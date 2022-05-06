import React from 'react';

  export default function card({handCards, butt, connec}) {
    return (
        <div>
            <h1>Flesh &amp; Souls, a card game</h1>
            <button onClick={connec}>Connect</button>
            <br/>
            <br/>
            <br/>
            <div style={{display:"flex"}}>
                <div>
                    <button onClick={butt}>1</button>
                    <button>2</button>
                    <button>3</button>
                    <br/>
                    <button>4</button>
                    <button>5</button>
                    <button>6</button>
                </div>
                <div style={{width: "100px"}}></div>
                <div>
                    <button disabled>1</button>
                    <button disabled>2</button>
                    <button disabled>3</button>
                    <br/>
                    <button disabled>4</button>
                    <button disabled>5</button>
                    <button disabled>6</button>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            {handCards.map((ghost, index) => 
            <>
              <button disabled>6</button>
            </>
            )}
        </div>
    )
}
  