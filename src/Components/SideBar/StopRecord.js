import React, { useContext } from "react";
import copy from "../../assets/sidebar/Copy.png";
import "./SideBar.css";
import { stopAudioRecording } from "../../utils/webRTCHandler";
import axios from "axios";
import userContext from "../userContext";
import { serverIP } from "../../apiConfig";

function StopRecord() {
  const {
    isRoomHost,
    roomId,
    socketId,
    transcription,
    setTranscription,
    isPreparingTranscript,
    setIsPreparingTranscript,
    setIsRecording,
  } = useContext(userContext);

  const copyRoomIdToClipboard = (roomId) => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        alert(`Room ID ${roomId} copied to clipboard`);
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
      });
  };

  return (
    <img
      className="stopRec"
      src={copy}
      onClick={() => {
        copyRoomIdToClipboard(roomId);
      }}
      style={{ width: "70%", height: "12%" }}
    />
  );
}

export default StopRecord;
