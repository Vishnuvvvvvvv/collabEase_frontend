import React, { useContext } from "react";
import "./SideBar.css";
import MicButton from "../video/MicButton";
import LeaveRoomButton from "../video/LeaveRoomButton";
import CameraButton from "../video/CameraButton";
import StartRecord from "./StartRecord";
import StopRecord from "./StopRecord";
import Transcript from "./Transcript";
import userContext from "../userContext";

function SideBar() {
  const { isRoomHost } = useContext(userContext);
  return (
    <div className="SideBar">
      <MicButton />
      {/* {!connectOnlyWithAudio && <CameraButton />} */}
      <Transcript />

      {isRoomHost && <StartRecord />}
      {/* {!connectOnlyWithAudio && <CameraButton />} */}
      <CameraButton />
      {isRoomHost && <StopRecord />}
      {/* {!connectOnlyWithAudio && <SwitchToScreenSharingButton />} */}

      {/* {!connectOnlyWithAudio && <SwitchToScreenSharingButton />} */}
      {/* <CameraButton /> */}

      <LeaveRoomButton />
    </div>
  );
}

export default SideBar;
