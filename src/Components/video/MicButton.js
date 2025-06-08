import React, { useContext, useState } from "react";
// import MicButtonImg from "../../assets/mic.svg";
// import MicButtonImgOff from "../../assets/micOff.svg";
import MicButtonImg from "../../assets/sidebar/Microphone.png";
import MicButtonImgOff from "../../assets/sidebar/mute.png";

import * as webRTCHandler from "../../utils/webRTCHandler";
import userContext from "../userContext";

const MicButton = () => {
  const [isMicMuted, setIsMicMuted] = useState(true);
  const {
    roomId,
    isRoomHost,
    setIsRoomHost,
    identity,
    setIdentity,
    setRoomId,
    participants,
    setParticipants,
    socketId,
    setSocketId,
  } = useContext(userContext);
  const handleMicButtonPressed = () => {
    console.log("mic button is pressed");
    webRTCHandler.toggleMic(!isMicMuted, socketId, roomId);

    setIsMicMuted(!isMicMuted);
  };

  return (
    // <div className="video_button_container">
    <img
      src={isMicMuted ? MicButtonImgOff : MicButtonImg}
      onClick={handleMicButtonPressed}
      className="video_button_image"
    />
    // </div>
  );
};

export default MicButton;
