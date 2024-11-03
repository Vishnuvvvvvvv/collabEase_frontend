import React, { useState } from 'react';
import "./Navbar.css";
import hamburger from '../assets/hamburger.svg';
import donut from "../assets/donut-chart.png";
import RightSection from './RightSection';
import  userContext  from './userContext'
import {useContext} from "react"
import UserSummary from './userSummary/UserSummary';


function Navbar({transcription,startRecording ,stopRecording ,togglePauseResume ,recordingBlob , isRecording ,isPaused,isPreparingTranscript}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isRoomHost } = useContext(userContext);
  
  const handleHamburgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='navbar'>
      <div className="home">
        HOME
      </div>
      <div className="logo-name">
        <img className='logo' src={donut} alt="Donut Logo" />
        COLLAB EASE!
      </div>
      <div className="hamburger" onClick={handleHamburgerClick}>
        <img className="H-icon" src={hamburger} alt="Hamburger Icon" />
      </div>
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={handleHamburgerClick}></div>
     
      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
            {isRoomHost ? ( <RightSection transcription={transcription}  
          startRecording = {startRecording}
          stopRecording ={stopRecording}
          togglePauseResume ={togglePauseResume}
          recordingBlob ={recordingBlob}
          isRecording = {isRecording}
          isPaused ={ isPaused}
          isPreparingTranscript={isPreparingTranscript}/>):
          
          (<UserSummary/>)}
            
            
           
      </div>
    
    
    </div>
  );
}

export default Navbar;
