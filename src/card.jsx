import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";

const socket = io('localhost:3001', { autoConnect: false });

  export default function Card() {
    const [input, setInput] = useState('');

    const [placecardSelected, setPlacecardSelected] = useState(-1);
    const [organPlaced, setOrganPlaced] = useState(false);
    const [deckCards, setDeckCards] = useState([]);
    const [handCards, setHandCards] = useState([]);
    const [room, setRoom] = useState("");
    const [player, setPlayer] = useState(0);
    const [playerMaybe, setPlayerMaybe] = useState(0);
    const [canPlay, setCanPlay] = useState(false);
    const [playerSet, setPlayerSet] = useState(false);
    const [nextTurn, setNextTurn] = useState(0);
    const [nextAttack, setAttack] = useState(0);
    const [swap, setSwap] = useState(0);
    const [effectInEffect, setEffectInEffect] = useState(null);
    const [permEffects, setPermEffects] = useState([]);
    const [indexOfEffectCard, setIndexOfEffectCard] = useState(-1);
    const [startingPlayer, setStartingPlayer] = useState(0);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [cardsOnField, setCardsOnField] = useState([-1,-1,-1,-1,0,-1]);
    const [enemyCardsOnField, setEnemyCardsOnField] = useState([-1,-1,-1,-1,-1,-1]);
    const [enemyCardsOnFieldMaybe, setEnemyCardsOnFieldMaybe] = useState([[-1,-1,-1,-1,-1,-1],0]);
    //INTEGRITY,INTEGRITYMAX , ATTACK, SENSE, RESISTANCE
    const [monsterStats, setMonsterStats] = useState([3, 3, 0, 0, 0])

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
        });
        socket.on('message', data => {
            /*if(data.nextTurn != null){
                
            }*/
            if(data.cmd != null){
                setEnemyCardsOnFieldMaybe([data.cmd, data.currentPlayer]);
            }
            if(data.player != null){
                //console.log( data.player ,playerSet, "aassss")
                setPlayerMaybe(data.player);
                //console.log( player, "asssssss")
            }
            if(data.startingPlayer != null){
                setStartingPlayer(data.startingPlayer);
                //console.log( canPlay, data.startingPlayer, player , "plyandPay")
            }
            if (data.notNextPlayer != null) {
                setNextTurn(data.notNextPlayer);
            }
            if(data.notYou != null){
                setAttack(data);
            }
            if(data.newGrid != null){
                console.log("ddadad");
                setSwap(data);
            }
            //console.log(data, "dataLater", data.length);
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
        };
    }, []);

    useEffect(() => {
        if(startingPlayer !== 0){
            if(player === startingPlayer){
                setCanPlay(true);
            }
        }
    }, [player, playerSet, startingPlayer]);

    useEffect(() => {
        if(nextTurn !== 0){
            if(nextTurn !== player){
                let hand = handCards;
                hand.push(deckCards.pop());
                console.log(deckCards, "deck")
                setHandCards(hand);
                setCanPlay(true);
                setOrganPlaced(false);
            }
        }
        setNextTurn(0);
    }, [handCards, nextTurn, deckCards, player]);
    
    useEffect(() => {
        if (!playerSet && playerMaybe !== 0) {
            setPlayer(playerMaybe);
            setPlayerSet(true);
            console.log(playerMaybe, playerSet, "yeah")
        }
    }, [playerSet, player, playerMaybe]);

    useEffect(() => {
        if (player !== enemyCardsOnFieldMaybe[1]) {
            setEnemyCardsOnField(enemyCardsOnFieldMaybe[0]);
        }
    }, [player, enemyCardsOnFieldMaybe]);

    useEffect(() => {
        if (nextAttack !== 0 && player !== nextAttack.notYou) {
            console.log("yeahATTACK");
            let monster2 = monsterStats;
            let totalATK = nextAttack.attack - monster2[4]
            console.log(totalATK, "totla");
            if(totalATK > 0){
                monster2[0] = monster2[0] - totalATK;
            }
            setMonsterStats(monster2);
            setAttack(0);
        }
    }, [nextAttack, player, monsterStats]);

    useEffect(() => {
        if (swap.notAgain !== player && swap.newGrid !== undefined) {
            console.log(swap.newGrid, "asas");
            setCardsOnField(swap.newGrid);
        }
    }, [swap, player]);

    const joinServer = (aRoom) => {
        socket.connect();
        setRoom(aRoom);
        setup();
        socket.emit('hello!', {
            "room": aRoom
        });
    }

    const createServer = (aRoom) => {
        socket.connect();
        setRoom(aRoom);
        setup();
        socket.emit('create!', {
            "room": aRoom
        });
    }

    const setup = () => {
        let niceDeck = makeDeck();
        console.log(niceDeck, "sssssdad");
        let deckS = [];
        for (let index = 0; index < 5; index++) {
            deckS.push(niceDeck.pop());        
        }
        setHandCards(deckS);
        setDeckCards(niceDeck);
        console.log(deckS);
        console.log(DeckLockUp[0]);
    }

    const setCardPos = (place) => {
        let theCardsOnField = cardsOnField;
        theCardsOnField[place] = placecardSelected;
        let index = handCards.indexOf(placecardSelected);
        handCards.splice(index, 1);
        console.log(placecardSelected);
        setHandCards(handCards);
        setCardsOnField(theCardsOnField);
        console.log("sssssssddd");
        if(DeckLockUp[placecardSelected].cardType !== "EFFECT"){
            setOrganPlaced(true);
        }
        
    }

    const sendCommand = (place) => {
        if(canPlay){
            console.log(effectInEffect);
            if(effectInEffect == null){
                if(placecardSelected !== -1 && (!organPlaced || DeckLockUp[placecardSelected].cardType === "EFFECT" && cardsOnField[place] === -1)){
                    setCardPos(place);
                    loadUpCard(placecardSelected, place);
                    socket.emit('action!', {
                        "cmd": cardsOnField,
                        "room": room,
                        "player": player
                    });
                }
            }
            else{
                selectCommand(place, true);
                console.log("lagtrain");
            }
        }
        setPlacecardSelected(-1);
    }

    const selectCommand = (place, isYou) => {
        let cards;
        console.log(isYou)

        if(isYou){
            cards = cardsOnField;
        }
        else{
            cards = enemyCardsOnField;
        }
        if(cards[place] !== -1){
            if(canPlay){
                if(effectInEffect != null){
                    console.log("sssddafagaffff")
                    let yesElements = effectInEffect.slice();
                    yesElements.splice(0,2);
                    console.log(yesElements, place);
                    for (let index = 0; index < yesElements.length; index++) {
                        if(yesElements[index] === DeckLockUp[cards[place]].cardType){
                            let newEnemyGrid = cards;
                            switch (effectInEffect[1]) {
                                case "sw":
                                    newEnemyGrid[place] = Math.floor(Math.random() * 10);
                                    break;
                                case "do":
                                    newEnemyGrid[place] = -1;
                                    break;
                                default:
                                    break;
                            }
                            cardsOnField[indexOfEffectCard] = -1;
                            if(!isYou){
                                socket.emit('swap!', {
                                    "grid": newEnemyGrid,
                                    "room": room,
                                    "player": player
                                });
                                setEffectInEffect(null);
                            }
                            else{
                                socket.emit('action!', {
                                    "cmd": cardsOnField,
                                    "room": room,
                                    "player": player
                                });
                                setEffectInEffect(null);         
                            }
                            break;
                        }
                    }
                }
            }
            setPlacecardSelected(-1);
        }
    }

    const loadUpCard = (cardId, place) => {
        let monster = monsterStats;

        monster[0] += DeckLockUp[cardId].INT;
        monster[1] += DeckLockUp[cardId].INT;
        monster[2] += DeckLockUp[cardId].ATK;
        monster[3] += DeckLockUp[cardId].SEN;
        monster[4] += DeckLockUp[cardId].DEF;

        setMonsterStats(monster);
        parseEffect(cardId, place);
    }

    const parseEffect = (cardId, place) => {
        DeckLockUp[cardId].EFFECT.forEach(element => {
            let effects = element.split(",");
            switch (effects[1]) {
                case "al":
                    setPermEffects();
                    console.log("yessssssAL")
                    break;
                case "h":
                    let health = monsterStats;
                    if(health[0] + effects[2] < health[1]){
                        health[0] += effects[2];
                    }
                    else{
                        health[0] = health[1];
                    }
                    setMonsterStats(health);
                    let theCardsOnField = cardsOnField;
                    theCardsOnField[place] = -1;
                    setCardsOnField(theCardsOnField);
                    console.log("yessssssH");
                    break;
                case "do":
                    setEffectInEffect(effects);
                    setIndexOfEffectCard(place);
                    console.log("yessssssDO");
                    break;
                case "sw":
                    setEffectInEffect(effects);
                    setIndexOfEffectCard(place);
                    console.log("yessssssSW");
                    break;
                default:
                    break;
            }
        });
        
    }

    const endRound = () => {
        if(canPlay){
            socket.emit('end!', {
                "room": room,
                "player": player
            });
            setCanPlay(false);
        }
    }

    const attackEnemy = () => {
        if(canPlay && !organPlaced){
            socket.emit('attack!', {
                "room": room,
                "player": player,
                "attack": monsterStats[2]
            });
        }
    }

    const makeDeck = () => {
        let deck = [DeckLockUp.length-3,DeckLockUp.length-3,DeckLockUp.length-2,DeckLockUp.length-2,7,4,1];
        /*for (let index = 0; index < 21; index++) {
            deck.push(Math.floor(Math.random() * DeckLockUp.length));
        }*/
        return deck;
    }

    var ColorLockUp = {
        "RED": "#FF0000",
        "BLUE": "#0000FF",
        "GREEN": "00FF00",
        "ITEM": "#EEEEEE"
    }

    //singleOrMulti[s/m], command[al,do,h,sw], args
    var DeckLockUp =[
        {
            "cardType": "RED",
            "name": "BRAIN",
            "ATK": 0,
            "DEF": 2,
            "INT": 0,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "RED",
            "name": "SPINE",
            "ATK": 0,
            "DEF": 1,
            "INT": 1,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "RED",
            "name": "HEART",
            "ATK": 0,
            "DEF": 0,
            "INT": 2,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "BLUE",
            "name": "BONES",
            "ATK": 0,
            "DEF": 0,
            "INT": 3,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "BLUE",
            "name": "NERVES",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "BLUE",
            "name": "LIVER",
            "ATK": -2,
            "DEF": 0,
            "INT": 4,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "BLUE",
            "name": "KIDNEY",
            "ATK": -1,
            "DEF": 0,
            "INT": 3,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "BLUE",
            "name": "STOMACH",
            "ATK": 2,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "GREEN",
            "name": "TONGUE",
            "ATK": 1,
            "DEF": 1,
            "INT": 0,
            "SEN": 1,
            "EFFECT": []
        },
        {
            "cardType": "GREEN",
            "name": "SKIN",
            "ATK": 0,
            "DEF": 0,
            "INT": 2,
            "SEN": 1,
            "EFFECT": []
        },
        {
            "cardType": "GREEN",
            "name": "EYE",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 3,
            "EFFECT": []
        },
        {
            "cardType": "GREEN",
            "name": "EAR",
            "ATK": 0,
            "DEF": 2,
            "INT": 0,
            "SEN": 2,
            "EFFECT": []
        },
        {
            "cardType": "ITEM",
            "name": "SWORD",
            "ATK": 2,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "ITEM",
            "name": "SHIELD",
            "ATK": 0,
            "DEF": 2,
            "INT": 0,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "ITEM",
            "name": "REVOLVER/2",
            "ATK": 4,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": ["s,al,3"]
        },
        /*{
            "cardType": "ITEM",
            "name": "SODA",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": ["s,h,1"]
        },*/
        {
            "cardType": "ITEM",
            "name": "FUNI HAT",
            "ATK": 0,
            "DEF": 2,
            "INT": 0,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "ITEM",
            "name": "COWBOY HAT",
            "ATK": 2,
            "DEF": 0,
            "INT": 0,
            "SEN": 1,
            "EFFECT": []
        },
        {
            "cardType": "EFFECT",
            "name": "SOULSWAP",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": ["s,sw,SOUL"]
        },
        {
            "cardType": "EFFECT",
            "name": "ORGAN FAILURE",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": ["m,do,RED,GREEN,BLUE"]
        },
        /*{
            "cardType": "EFFECT",
            "name": "BLOOD PRESSURE DX",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": []
        },
        {
            "cardType": "EFFECT",
            "name": "BRAIN FREEZE",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": []
        },*/
        {
            "cardType": "EFFECT",
            "name": "RADIATION MUTATION",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": ["m,sw,RED,BLUE,GREEN"]
        },
        {
            "cardType": "EFFECT",
            "name": "COOL HEAL",
            "ATK": 0,
            "DEF": 0,
            "INT": 0,
            "SEN": 0,
            "EFFECT": ["s,h,3"]
        },
        
    ]

    var SoulDeckLockUp =[
        {
            "cardType": "SOUL",
            "name": "SIMPLE SOUL",
            "ATK": 0,
            "DEF": 0,
            "INT": 3,
            "SEN": 0,
            "EFFECT": []
        },
    ]

    return (
        <div>
            <h1>Flesh &amp; Souls, a card game</h1>            
            <button onClick={() => createServer(input)}>Start</button>
            <button onClick={() => joinServer(input)}>Join</button>
            <br/>
            <br/>
            <input value={input} onInput={e => setInput(e.target.value)}/>
            <br/>
            <br/>
            <h2 style={{color: "white"}}>{canPlay === true ? "Your Turn" : "Opponents Turn"}</h2>
            <p style={{color: "white"}}>{"INT:" + monsterStats[0]+"/"+monsterStats[1] + " ATK:" + monsterStats[2] + " SEN:" + monsterStats[3] + " DEF:" +  monsterStats[4]}</p>
            <br/>
            <br/>
            <button onClick={endRound}>EndRound</button>
            <button onClick={attackEnemy}>ATTACK</button>
            <br/>
            <br/>
            <br/>
            <div style={{display:"flex"}}>
                <div>
                    <button style={{backgroundColor: cardsOnField[0] !== -1 ? ColorLockUp[DeckLockUp[cardsOnField[0]].cardType] : "" }} onClick={() => sendCommand(0)}>{cardsOnField[0] !== -1 ? DeckLockUp[cardsOnField[0]].name : ''}</button>
                    <button style={{backgroundColor: cardsOnField[1] !== -1 ? ColorLockUp[DeckLockUp[cardsOnField[1]].cardType] : "" }} onClick={() => sendCommand(1)}>{cardsOnField[1] !== -1 ? DeckLockUp[cardsOnField[1]].name : ''}</button>
                    <button style={{backgroundColor: cardsOnField[2] !== -1 ? ColorLockUp[DeckLockUp[cardsOnField[2]].cardType] : "" }} onClick={() => sendCommand(2)}>{cardsOnField[2] !== -1 ? DeckLockUp[cardsOnField[2]].name : ''}</button>
                    <br/>
                    <button style={{backgroundColor: cardsOnField[3] !== -1 ? ColorLockUp[DeckLockUp[cardsOnField[3]].cardType] : "" }} onClick={() => sendCommand(3)}>{cardsOnField[3] !== -1 ? DeckLockUp[cardsOnField[3]].name : ''}</button>
                    <button style={{backgroundColor: cardsOnField[4] !== -1 ? ColorLockUp[SoulDeckLockUp[cardsOnField[4]].cardType] : "" }} onClick={() => sendCommand(4, "soul")}>{cardsOnField[4] !== -1 ? SoulDeckLockUp[cardsOnField[4]].name : ''}</button>
                    <button style={{backgroundColor: cardsOnField[5] !== -1 ? ColorLockUp[DeckLockUp[cardsOnField[5]].cardType] : "" }} onClick={() => sendCommand(5)}>{cardsOnField[5] !== -1 ? DeckLockUp[cardsOnField[5]].name : ''}</button>
                </div>
                <div style={{width: "100px"}}></div>
                <div>
                    <button style={{backgroundColor: enemyCardsOnField[0] !== -1 ? ColorLockUp[DeckLockUp[enemyCardsOnField[0]].cardType] : "" }} onClick={() => selectCommand(0, false)}>{enemyCardsOnField[0] !== -1 ? DeckLockUp[enemyCardsOnField[0]].name : ''}</button>
                    <button style={{backgroundColor: enemyCardsOnField[1] !== -1 ? ColorLockUp[DeckLockUp[enemyCardsOnField[1]].cardType] : "" }} onClick={() => selectCommand(1, false)}>{enemyCardsOnField[1] !== -1 ? DeckLockUp[enemyCardsOnField[1]].name : ''}</button>
                    <button style={{backgroundColor: enemyCardsOnField[2] !== -1 ? ColorLockUp[DeckLockUp[enemyCardsOnField[2]].cardType] : "" }} onClick={() => selectCommand(2, false)}>{enemyCardsOnField[2] !== -1 ? DeckLockUp[enemyCardsOnField[2]].name : ''}</button>
                    <br/>
                    <button style={{backgroundColor: enemyCardsOnField[3] !== -1 ? ColorLockUp[DeckLockUp[enemyCardsOnField[3]].cardType] : "" }} onClick={() => selectCommand(3, false)}>{enemyCardsOnField[3] !== -1 ? DeckLockUp[enemyCardsOnField[3]].name : ''}</button>
                    <button style={{backgroundColor: enemyCardsOnField[4] !== -1 ? ColorLockUp[SoulDeckLockUp[enemyCardsOnField[4]].cardType] : "" }} onClick={() => selectCommand(4, false)}>{enemyCardsOnField[4] !== -1 ? SoulDeckLockUp[enemyCardsOnField[4]].name : ''}</button>
                    <button style={{backgroundColor: enemyCardsOnField[5] !== -1 ? ColorLockUp[DeckLockUp[enemyCardsOnField[5]].cardType] : "" }} onClick={() => selectCommand(5, false)}>{enemyCardsOnField[5] !== -1 ? DeckLockUp[enemyCardsOnField[5]].name : ''}</button>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            {handCards.map((card, index) => 
              <button key={index} onClick={() => setPlacecardSelected(card)}>{DeckLockUp[card].name}</button>
            )}
        </div>
    )
}
  