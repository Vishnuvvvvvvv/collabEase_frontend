import React, { useEffect } from "react";
import "./VideoConference.css";
//import VideoElement from './VideoElement'
// VideoConference.js

import { connect } from "react-redux";
import { setLocalVideoRef, setRemoteVideoRef } from "../store/actions";
import VideoElement from "./VideoElement";
import MicButton from "./video/MicButton";
import LeaveRoomButton from "./video/LeaveRoomButton";
import CameraButton from "./video/CameraButton";

function VideoConference({ localVideoRef, remoteVideoRef }) {
  useEffect(() => {
    console.log("local video", localVideoRef);
    console.log("Remote video ", remoteVideoRef);
  }, [localVideoRef, remoteVideoRef]);

  //  const el = remoteVideoRef.map((item)=>{
  //   console.log("item",item)
  //   return(
  //   <VideoElement videoStream={item} displayText={"User 1"}/>
  //  )})

  return (
    <div className="videoConference">
      <div className="section1">
        {/* <VideoElement videoStream={localVideoRef} isLocal={true} displayText={"User 1"}/> */}
        {/*
       <VideoElement videoStream={remoteVideoRef[0]} displayText={"User 2"}/>
       <VideoElement videoStream={ remoteVideoRef[1]} displayText={"User 3"}/>
     
      </div>
      
      <div className='section2'>
     
        <VideoElement videoStream={remoteVideoRef[2]} displayText={"User 4"}/>
        <VideoElement videoStream={remoteVideoRef[3]} displayText={"User 5"}/>
        <VideoElement videoStream={remoteVideoRef[4]} displayText={"User 6"}/>
      */}

        {/* <VideoElement videoStream={remoteVideoRef[0]} displayText={"User 2"}/> */}
      </div>

      {/* <div className="video_buttons_container"> */}
      {/* <MicButton /> */}
      {/* {!connectOnlyWithAudio && <CameraButton />} */}
      {/* <LeaveRoomButton /> */}
      {/* {!connectOnlyWithAudio && <SwitchToScreenSharingButton />} */}
      {/* <CameraButton/> */}
      {/* </div> */}
    </div>
  );
}

const mapStateToProps = (state) => ({
  localVideoRef: state.localVideoRef,
  remoteVideoRef: state.remoteVideoRefs,
});

export default connect(mapStateToProps, {
  setLocalVideoRef,
  setRemoteVideoRef,
})(VideoConference);
