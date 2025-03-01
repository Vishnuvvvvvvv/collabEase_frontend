import React, { useState } from "react";
import "./Navbar.css";
import hamburger from "../assets/hamburger.svg";
import donut from "../assets/donut-chart.png";
import RightSection from "./RightSection";
import userContext from "./userContext";
import { useContext } from "react";
import UserSummary from "./userSummary/UserSummary";

function Navbar({
  transcription,
  startRecording,
  stopRecording,
  togglePauseResume,
  recordingBlob,
  isRecording,
  isPaused,
  isPreparingTranscript,
}) {
  const { isRoomHost, setIsMenuOpen, isMenuOpen } = useContext(userContext);

  const handleHamburgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="home">
        {/* CollabEase */}
        <div
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            position: "relative",
            left: "390%",
            top: "30px",
            textShadow: "4px 4px 6px rgba(0, 0, 0, 0.3)", // Adding shadow
          }}
        >
          <h2 className="heading-collab">
            <span className="" style={{ color: "#00A550" }}>
              C
            </span>
            ollab
            <span className="" style={{ color: "#00A550" }}>
              E
            </span>
            ase
          </h2>
        </div>
      </div>
      <div className="logo-name">
        {/* <img className="logo" src={donut} alt="Donut Logo" />
        COLLAB EASE! */}
      </div>
      <div className="hamburger" onClick={handleHamburgerClick}>
        <img className="H-icon" src={hamburger} alt="Hamburger Icon" />
      </div>
      <div
        className={`menu-overlay ${isMenuOpen ? "open" : ""}`}
        onClick={handleHamburgerClick}
      ></div>

      <div className={`menu ${isMenuOpen ? "open" : ""}`}>
        {isRoomHost ? (
          <RightSection
            transcription={transcription}
            startRecording={startRecording}
            stopRecording={stopRecording}
            togglePauseResume={togglePauseResume}
            recordingBlob={recordingBlob}
            isRecording={isRecording}
            isPaused={isPaused}
            isPreparingTranscript={isPreparingTranscript}
          />
        ) : (
          <UserSummary />
        )}
      </div>
    </div>
  );
}

export default Navbar;
