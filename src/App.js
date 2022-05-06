import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from "react-router-dom";
import TaleOverview from './tales/taleOverview.jsx';
import TaleOne from './tales/tale1.jsx';
import TaleTwo from './tales/tale2.jsx';
import TaleThree from './tales/tale3.jsx';
import TaleFour from './tales/tale4.jsx';
import TaleFive from './tales/tale5.jsx';
import Card from './card';
import { io } from "socket.io-client";

const socket = io('localhost:3001', { autoConnect: false });

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    socket.on('message', data => {
      console.log(data);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('hello!', {
      "tets": 10
    });
  }

  const connectToSocket = () => {
    socket.connect();
  }

  var DeckLockUp =[
    {

    }
  ]

  const [organPlaced, setOrganPlaced] = useState(false);
  const [deckCards, setDeckCards] = useState([]);
  const [handCards, setHandCards] = useState([]);

  //const [areaHidden, setAreaHidden] = useState([true,false,false,false,false, false, false, false, false]);
  //const [menuHidden, setMenuHidden] = useState(true);

  /********GHOST*DIALOG*******/
  //const [ghostName, setGhostName] = useState("");
  
  //const [dialog, setDialog] = useState([]);
  //const [flavorDialog, setFlavorDialog] = useState([]);
  //const [dialogNumber, setDialogNumber] = useState(1);
  //const [ghostDialog, setGhostDialog] = useState("");

  /*const [ghostInHouse, setGhostInHouse] = useState([
    "n64Ghost",
    "EMPTY",
    "EMPTY",
    "EMPTY",
    "EMPTY",
    "EMPTY",
    "EMPTY",
    "EMPTY",
    "EMPTY"
  ]);

  const listOfGhosts = [
    {
      id: "n64Ghost",
      name: "Cyber Retro Ghost",
      startDialogs: [
        "Hi hows it going",
        "im dead"
      ],
      flavorDialogs:[
        "I AM DEAD,(get it because I AM BREAD)",
        "test test test",
        "n64 best console"
      ]
    }
  ]*/

  /*function doStuff(nmbr) {
    //Map, DialogGhost, restaurnant, graveyard, arcade ,room_select, roomBuilding, rpg, golf(card)
    let areaHide = [false,false,false,false,false, false, false, false, false];
    areaHide[nmbr] = true;
    setAreaHidden(areaHide);
  }

  function enableMenu() {
    setMenuHidden(!menuHidden)
  }

  function loadGhost(ghstId) {
    console.log(ghstId);
    if(ghstId === "EMPTY"){
      doStuff(6);
    }
    else{
      doStuff(1);
      let ghost = listOfGhosts.find(ghost => ghost.id === ghstId);
      console.log(ghost);
      setGhostName(ghost.name);
      setDialog(ghost.startDialogs);
      setFlavorDialog(ghost.flavorDialogs);
      setGhostDialog(ghost.startDialogs[0]);
      console.log(ghost.startDialogs);
    }
  }

  function nextDialog() {
    if(dialogNumber >= dialog.length){
      setGhostDialog(flavorDialog[Math.floor(Math.random() * flavorDialog.length)]);
    }
    else{
      let number = dialogNumber;
      setDialogNumber(number+1);
      setGhostDialog(dialog[dialogNumber]);
    }
    console.log(ghostDialog);
    console.log(dialog);
  }*/

  return (
    <div className="app">
      <br/>
      <NavLink className="navLink" to='/'><p className='headLine noTopMargin'>you died. welcome to the afterlife</p></NavLink>

      <Routes>
        <Route exact path='/' element={<TaleOverview/>} />
        <Route exact path='/card' element={<Card handCards={handCards} butt={sendMessage} connec={connectToSocket}/>} />
        <Route exact path='/tale1' element={<TaleOne/>} />
        <Route exact path='/tale2' element={<TaleTwo/>} />
        <Route exact path='/tale3' element={<TaleThree/>} />
        <Route exact path='/tale4' element={<TaleFour/>} />
        <Route exact path='/tale5' element={<TaleFive/>} />
      </Routes>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
    
    /*<div className="app">
        <div style={{position:"absolute", backgroundColor:"Green", height:"60%", width:"20%", zIndex:"1", visibility:menuHidden ? "hidden" : "visible"}} className="clipBoard">
        <button onClick={enableMenu}>
            <img height="100px" src={logo} alt="logo" />
          </button>
          <button onClick={() => doStuff(0)}>
            <img height="150px" src={logo} alt="logo" />
          </button>
        </div>
        <div style={{position:"absolute",zIndex:1, visibility:!menuHidden ? "hidden" : "visible"}}>
          <button onClick={enableMenu}>
            <img height="100px" src={logo} alt="logo" />
          </button>
        </div>
        <div className="areas">
          <div style={{height:areaHidden[0] ? "auto" : "0px", visibility:areaHidden[0] ? "visible" : "hidden"}}>
            <img className="building text" height="100px" src="/gfx/text.png" alt="logo" />
            <button className="building building_apartment" onClick={() => doStuff(5)}>
              <img height="250px" src="/gfx/apartment_3.png" alt="logo" />
            </button>
            <button className="building building_restaurant" onClick={() => doStuff(2)}>
              <img height="200px" src="/gfx/restaunrant_2.png" alt="logo" />
            </button>
            <button className="building building_graveyard" onClick={() => doStuff(3)}>
              <img height="130px" src="/gfx/grave_2.png" alt="logo" />
            </button>
            <button className="building building_arcade" onClick={() => doStuff(4)}>
              <img height="150px" src="/gfx/arcade_2.png" alt="logo" />
            </button>
            <img src="/gfx/island_2.png" height={areaHidden[0] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
          <div style={{height:areaHidden[1] ? "auto" : "0px", visibility:areaHidden[1] ? "visible" : "hidden"}}>
            <div className="dialBox" onClick={nextDialog}>
              <h1>{ghostName}</h1>
              <p>{ghostDialog}</p>
            </div>
            <img src="/gfx/room.png" height={areaHidden[1] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
          <div style={{height:areaHidden[2] ? "auto" : "0px", visibility:areaHidden[2] ? "visible" : "hidden"}}>
            <img src="/gfx/island.png" height={areaHidden[2] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
          <div style={{height:areaHidden[3] ? "auto" : "0px", visibility:areaHidden[3] ? "visible" : "hidden"}}>
            <img src="/gfx/island.png" height={areaHidden[3] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
          <div style={{height:areaHidden[4] ? "auto" : "0px", visibility:areaHidden[4] ? "visible" : "hidden"}}>
            <button className="building building_arcade" onClick={() => doStuff(7)}>
              <img height="150px" src="/gfx/arcade.png" alt="logo" />
            </button>
            <button className="building building_graveyard" onClick={() => doStuff(8)}>
              <img height="130px" src="/gfx/grave.png" alt="logo" />
            </button>
            <img src="/gfx/island.png" height={areaHidden[4] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
          <div style={{height:areaHidden[5] ? "auto" : "0px", visibility:areaHidden[5] ? "visible" : "hidden"}}>
            {ghostInHouse.map((ghost, index) => 
            <>
              <div style={{backgroundColor:"lime", height:areaHidden[5] ? "20vw" : "0px" , width:"20vw", position:"absolute", marginLeft:(index*25) + "vw"}} onClick={() => loadGhost(ghost)}>
                
              </div>
            </>
            )}
            <img src="/gfx/room.png" height={areaHidden[5] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
          <div style={{height:areaHidden[6] ? "auto" : "0px", visibility:areaHidden[6] ? "visible" : "hidden"}}>
            <img src="/gfx/island.png" height={areaHidden[6] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
          <div style={{height:areaHidden[7] ? "auto" : "0px", visibility:areaHidden[7] ? "visible" : "hidden"}}>
            <img src="/gfx/rpg.png" height={areaHidden[7] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
          <div style={{height:areaHidden[8] ? "auto" : "0px", visibility:areaHidden[8] ? "visible" : "hidden"}}>
            <img src="/gfx/golf.png" height={areaHidden[8] ? "auto" : "0px"} className="island" alt="logo" />
          </div>
        </div>
    </div>*/
  );
}

export default App;
