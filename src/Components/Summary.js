import React from 'react'
import * as webRTCHandler from "../utils/webRTCHandler";
function Summary({summary,btn}) {

    const identity = "admin"
    const sendMessage = () => {
        
          console.log("Sended meassage successfully")
          //webRTCHandler.sendMessageUsingDataChannel(summary,identity);
         webRTCHandler.sendSummaryUsingDataChannel(summary,identity);
        
      };



  return (
    <>
    {summary}
    <br/>
    <br/>
    {/* <br/>
    <br/>
    <br/>
    <br/><br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/><br/>
    <br/> */}
  
   
    {btn && <button className='broadCastbutton' onClick={sendMessage} >Broadcast</button>}
    </>
  )
}

export default Summary