import * as wss from "./wss";
import Peer from "simple-peer";
import store from "../store/store";
import {
  setLocalVideoRef,
  setRemoteVideoRef,
  removeRemoteVideoRef,
  setMessages,
  setSummary,
} from "../store/actions";
import { useContext, useEffect } from "react";
import userContext from "../Components/userContext";

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
  roomId = null
) => {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      console.log("successfuly received local stream");
      localStream = stream;
      localStream.getAudioTracks()[0].enabled = false;
      showLocalVideoPreview(localStream);

      isRoomHost ? wss.createNewRoom(identity) : wss.joinRoom(identity, roomId);
    })
    .catch((err) => {
      console.log(
        "error occurred when trying to get an access to local stream"
      );
      console.log(err);
    });
};

let peers = {};
let streams = [];

const getConfiguration = () => {
  console.warn("Using only STUN server");
  return {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
};

const messengerChannel = "messenger";

//prepare a  peeer connection with the joined user with connUserSocketId
export const prepareNewPeerConnection = (connUserSocketId, isInitiator) => {
  console.log(
    `Preparing new peer connection with ${connUserSocketId}, Initiator: ${isInitiator}`
  );
  const configuration = getConfiguration();
  console.log("configuratioon is : ", configuration);
  peers[connUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
  });
  console.log("peer object : ", peers);
  console.log("local stream is : ");
  console.log(localStream.getAudioTracks());

  peers[connUserSocketId].on("signal", (data) => {
    console.log(`Sending signal data to ${connUserSocketId}`);
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
      channelName: messengerChannel,
    };

    wss.signalPeerData(signalData);
  });

  // new function for helping recording audio
  let activeAudioStreams = []; // Array to hold active audio tracks for recording
  let mediaRecorder;
  let recordedChunks = [];

  const startRecording = () => {
    if (activeAudioStreams.length === 0) {
      console.log("No active audio streams to record.");
      return;
    }

    // Combine all active audio tracks into a single MediaStream
    const combinedStream = new MediaStream();
    activeAudioStreams.forEach((stream) => {
      stream
        .getAudioTracks()
        .forEach((track) => combinedStream.addTrack(track));
    });

    // Initialize MediaRecorder
    mediaRecorder = new MediaRecorder(combinedStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      console.log("Recording complete. Downloading file...");
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recording.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    mediaRecorder.start();
    console.log("Recording started...");
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log("Recording stopped.");
    } else {
      console.log("No active recording to stop.");
    }
  };

  const updateActiveAudioStreams = () => {
    activeAudioStreams = streams.filter((stream) =>
      stream.getAudioTracks().some((track) => track.enabled)
    );
    console.log("Updated active audio streams:", activeAudioStreams);
  };

  //

  peers[connUserSocketId].on("stream", (stream) => {
    console.log(`Received stream from ${connUserSocketId}`);
    addStream(stream, connUserSocketId);
    streams = [...streams, stream];
    // const state = store.getState(); // Get the current Redux state
    // const userName = state.username;
    // ----------new
    // Check if the audio track is enabled and update active streams
    updateActiveAudioStreams();
    console.log("checking....");
    // -----------
    // monitorAudioLevel(stream, connUserSocketId, userName, connUserSocketId);
  });

  peers[connUserSocketId].on("data", (data) => {
    const messageData = JSON.parse(data);
    console.log("Message adtaa is : ", messageData);
    if (messageData.identity === "admin") {
      store.dispatch(setSummary(messageData.content));
    } else {
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
    console.log("object set to null");
    videoContainer.parentNode.removeChild(videoContainer);
    //store.dispatch(removeRemoteVideoRef(socketId));
    console.log("thas remved");
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

const addStream = (stream, connUserSocketId) => {
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
};

////buttons logic////

let analyser;
let audioContext;
let source;

const stopAudioAnalyzer = () => {
  if (analyser && source && audioContext) {
    source.disconnect(analyser);
    audioContext.close();
    analyser = null;
    source = null;
    audioContext = null;
  }
};

const monitorAudioLevel = (stream, userName, socket, roomId) => {
  audioContext = new AudioContext();
  source = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();

  // Configure the analyser
  analyser.fftSize = 512;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  source.connect(analyser);
  let isCurrentlySpeaking = false;
  const checkAudioLevel = () => {
    if (!analyser) return;
    analyser.getByteFrequencyData(dataArray);

    // Compute the average volume
    const volume =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    // Threshold for detecting active speaker
    const threshold = 50; // Adjust as needed
    // console.log("volume is ", volume);
    if (volume > threshold) {
      console.log(`Active speaker detected: ${socket}`);

      if (!isCurrentlySpeaking) {
        // User just started speaking, notify the backend
        console.log(`Active speaker: ${userName}`);

        socket.emit("speaking", { roomId: roomId, name: userName });

        isCurrentlySpeaking = true;
      }
    } else {
      isCurrentlySpeaking = false;
    }

    // Update UI or perform actions for active speaker
    // if (activeSpeakers[connUserSocketId]) {
    //   highlightActiveSpeaker(connUserSocketId); // Implement this function for UI updates
    // }

    requestAnimationFrame(checkAudioLevel);
  };

  checkAudioLevel();
};

export const toggleMic = (isMuted, socketId, roomId) => {
  localStream.getAudioTracks()[0].enabled = isMuted ? false : true;
  // Update active streams when mic is toggled

  if (isMuted) {
    stopAudioAnalyzer();
  } else {
    const state = store.getState(); // Get the current Redux state
    const userName = state.username;
    // updateActiveAudioStreams();
    monitorAudioLevel(localStream, userName, socketId, roomId);

    // startAudioAnalyzer(localStream, roomId, userName);
  }
};

export const toggleCamera = (isDisabled) => {
  localStream.getVideoTracks()[0].enabled = isDisabled ? true : false;
};

//messages

const appendNewMessage = (messageData) => {
  const messages = store.getState().messages;
  console.log("Messages in store", messages);
  store.dispatch(setMessages([...messages, messageData]));
  console.log("After updation Messages in store", messages);
};
export const sendMessageUsingDataChannel = (messageContent, identity) => {
  // append this message locally
  // const identity = store.getState().identity;

  const localMessageData = {
    content: messageContent,
    identity,
    messageCreatedByMe: true,
  };

  console.log(
    `local meassage data created by ${identity} ${localMessageData.content}`
  );
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

export const sendSummaryUsingDataChannel = (messageContent, identity) => {
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
