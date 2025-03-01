import React, { useEffect, useState } from "react";

// import CameraButtonImg from "../../assets/camera.svg";
// import CameraButtonImgOff from "../../assets/cameraOff.svg";
import * as webRTCHandler from "../../utils/webRTCHandler";

import CameraButtonImg from "../../assets/sidebar/Camera.png";
import CameraButtonImgOff from "../../assets/sidebar/HideCamera.png";
const CameraButton = () => {
  const [isLocalVideoDisabled, setIsLocalVideoDisabled] = useState(false);

  const handleCameraButtonPressed = () => {
    webRTCHandler.toggleCamera(isLocalVideoDisabled);

    setIsLocalVideoDisabled(!isLocalVideoDisabled);
  };

  return (
    // <div className="video_button_container">
    <img
      src={isLocalVideoDisabled ? CameraButtonImgOff : CameraButtonImg}
      className="video_button_image2"
      onClick={handleCameraButtonPressed}
    />
    // </div>
  );
};

export default CameraButton;
