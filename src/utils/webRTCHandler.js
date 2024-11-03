import * as wss from "./wss";
import Peer from 'simple-peer'
import store from '../store/store';
import { setLocalVideoRef, setRemoteVideoRef,removeRemoteVideoRef,setMessages,setSummary} from '../store/actions';


const constraints = {
  audio: true,
  video: {
    width: "580",
    height: "500",
  },
};


let localStream;

export const getLocalPreviewAndInitRoomConnection = async (
  isRoomHost,
  identity,
  roomId = null,
 
) =>{
  navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    console.log("successfuly received local stream");
    localStream = stream;
    showLocalVideoPreview(localStream);

    isRoomHost
    ? wss.createNewRoom(identity)
    : wss.joinRoom(identity, roomId);
  }
  )
    .catch((err) => {
      console.log(
        "error occurred when trying to get an access to local stream"
      );
      console.log(err);
    });

}

let peers = {};
let streams=[]

const getConfiguration = ()=>{
  console.warn("Using only STUN server");
  return {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
}


const messengerChannel = "messenger";


//prepare a  peeer connection with the joined user with connUserSocketId
export const prepareNewPeerConnection = (connUserSocketId,isInitiator)=>{
  
  console.log(`Preparing new peer connection with ${connUserSocketId}, Initiator: ${isInitiator}`);
  const configuration = getConfiguration();
  console.log("configuratioon is : ",configuration)
  peers[connUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
   
  });
  console.log("peer object : ",peers)

  peers[connUserSocketId].on("signal", (data) => {
    console.log(`Sending signal data to ${connUserSocketId}`);
  const signalData = {
    signal: data,
    connUserSocketId: connUserSocketId,
    channelName: messengerChannel,
  };

  wss.signalPeerData(signalData);
});

  
  peers[connUserSocketId].on('stream',(stream)=>{
    console.log(`Received stream from ${connUserSocketId}`);
    addStream(stream,connUserSocketId)
    streams = [...streams,stream]
  })

  peers[connUserSocketId].on("data", (data) => {
    const messageData = JSON.parse(data);
    console.log("Message adtaa is : ",messageData)
    if(messageData.identity==="admin"){
      store.dispatch(setSummary(messageData.content));
    }
    else
    {
    appendNewMessage(messageData);
    }
  });

};


export const handleSignalingData = (data) => {
  //add signaling data to peer connection
  console.log(`Handling signaling data from ${data.connUserSocketId}`);
  peers[data.connUserSocketId].signal(data.signal);
};

export const removePeerConnection = (data) => {
  const { socketId } = data;
  const videoContainer = document.getElementById(socketId);

  const videoEl = document.getElementById(`${socketId}-video`);

  if (videoEl) {
    const tracks = videoEl.srcObject.getTracks();

    tracks.forEach((t) => t.stop());

    videoEl.srcObject = null;
     videoContainer.removeChild(videoEl);
    console.log("object set to null")
     videoContainer.parentNode.removeChild(videoContainer);
    //store.dispatch(removeRemoteVideoRef(socketId));
    console.log("thas remved")
    if (peers[socketId]) {
      peers[socketId].destroy();
    }
    delete peers[socketId];

    // const currentState = store.getState();
    // console.log("Updated remoteVideoRefs array:", currentState.remoteVideoRefs);
  }
};

//////////////////////////////////////////////////////////////
const showLocalVideoPreview = (stream) => {
  const videosContainer = document.getElementById("videos_portal");
  videosContainer.classList.add("videos_portal_styles");
  const videoContainer = document.createElement("div");
  videoContainer.classList.add("video_track_container");
  const videoElement = document.createElement("video");
  videoElement.classList.add("videoElement1");
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.srcObject = stream;
  //store.dispatch(setLocalVideoRef(stream));

  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };

  videoContainer.appendChild(videoElement);

  

  videosContainer.appendChild(videoContainer);
};

const addStream = (stream,connUserSocketId)=>{
 //display incoming stream
 console.log(`Adding stream from ${connUserSocketId}`);
 const videosContainer = document.getElementById("videos_portal");
 const videoContainer = document.createElement("div");
 videoContainer.id = connUserSocketId;

 videoContainer.classList.add("video_track_container");
 const videoElement = document.createElement("video");
 videoElement.classList.add("videoElement1");
 videoElement.autoplay = true;
 videoElement.srcObject = stream;
 videoElement.id = `${connUserSocketId}-video`;
 //console.log("remote video at webrtc is :",stream)
 //store.dispatch(setRemoteVideoRef(stream,connUserSocketId));
 videoElement.onloadedmetadata = () => {
   videoElement.play();
 };

 videoContainer.appendChild(videoElement);
 videosContainer.appendChild(videoContainer);

}

////buttons logic////


export const toggleMic = (isMuted) => {
  localStream.getAudioTracks()[0].enabled = isMuted ? true : false;
};

export const toggleCamera = (isDisabled) => {
  localStream.getVideoTracks()[0].enabled = isDisabled ? true : false;
};

//messages

const appendNewMessage = (messageData) => {
  const messages = store.getState().messages;
  console.log("Messages in store",messages)
  store.dispatch(setMessages([...messages, messageData]));
  console.log("After updation Messages in store",messages)
}
;

export const sendMessageUsingDataChannel = (messageContent,identity) => {
  // append this message locally
  // const identity = store.getState().identity;

  const localMessageData = {
    content: messageContent,
    identity,
    messageCreatedByMe: true,
  };

  console.log(`local meassage data created by ${identity} ${localMessageData.content}`)
  appendNewMessage(localMessageData);
  
  const messageData = {
    content: messageContent,
    identity,
  };

  const stringifiedMessageData = JSON.stringify(messageData);
  for (let socketId in peers) {
    peers[socketId].send(stringifiedMessageData);
  }
};





export const sendSummaryUsingDataChannel = (messageContent,identity) => {
  // append this message locally
  // const identity = store.getState().identity;

  // const localMessageData = {
  //   content: messageContent,
  //   identity,
  //   messageCreatedByMe: true,
  // };
  // console.log(`local meassage data created by ${identity} ${localMessageData.content}`)
  // appendNewMessage(localMessageData);
  
  const messageData = {
    content: messageContent,
    identity,
  };

  const stringifiedMessageData = JSON.stringify(messageData);
  for (let socketId in peers) {
    peers[socketId].send(stringifiedMessageData);
  }
};