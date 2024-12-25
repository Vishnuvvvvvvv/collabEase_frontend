// // working 2 way webrtc
// // ====================

// import React from 'react'

// import { useEffect, useRef, useState } from 'react'
// import io from 'socket.io-client';
//  import Video from './video/Video';
// import Videos from './video/Videos';
// // import "./App.css"
// //const socket = io.connect('http://localhost:8080');

// const VideoElement = () => {
//   const [localStream, setLocalStream] = useState(null);
//   // const local = useRef();
//   // const remoteVideoRef = useRef();

//   const [remoteStream, setRemoteStream] = useState(null);
//   const [remoteStreams, setRemoteStreams] = useState([]);
//   const [peerConnections, setPeerConnections] = useState({});
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [status, setStatus] = useState('Please wait...');

//   const pcConfig = {
//     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//   };

//   const sdpConstraints = {
//     mandatory: {
//       OfferToReceiveAudio: true,
//       OfferToReceiveVideo: true,
//     },
//   };

//   const serviceIP = 'http://localhost:8080/webrtcPeer';
//   let socket = null;

//   const getLocalStream = () => {
//     const success = (stream) => {
//       //console.log('Local stream obtained:', stream);
//       setLocalStream(stream);
//     // localStream.current.srcObject = stream
//       //console.log('local ',localStream)
//       whoisOnline();
//     };

//     const failure = (e) => {
//       console.log('getUserMedia Error: ', e);
//     };

//     const constraints = { video: true, options: { mirror: true } };

//     navigator.mediaDevices
//       .getUserMedia(constraints)
//       .then(success)
//       .catch(failure);
//   };

//   const whoisOnline = () => {
//     sendToPeer('onlinePeers', null, { local: socket.id });
//   };

//   const sendToPeer = (messageType, payload, socketID) => {
//     socket.emit(messageType, {
//       socketID,
//       payload,
//     });
//   };

//   const createPeerConnection = (socketID, callback) => {
//     try {
//       let pc = new RTCPeerConnection(pcConfig);

//       const newPeerConnections = { ...peerConnections, [socketID]: pc };
//       setPeerConnections(newPeerConnections);

//       pc.onicecandidate = (e) => {
//         if (e.candidate) {
//           sendToPeer('candidate', e.candidate, {
//             local: socket.id,
//             remote: socketID,
//           });
//         }
//       };

//       pc.oniceconnectionstatechange = (e) => {
//         // Handle ice connection state change if needed
//       };

//       pc.ontrack = (e) => {
//         const remoteVideo = {
//           id: socketID,
//           name: socketID,
//           stream: e.streams[0],
//         };
//         console.log("remote video ",remoteVideo)

//         setRemoteStreams((prevStreams) => [
//           ...prevStreams.filter((stream) => stream.id !== socketID),
//           remoteVideo,
//         ]);

//         if (!selectedVideo) {
//           setSelectedVideo(remoteVideo);
//         }
//       };

//       pc.close = () => {
//         // Handle peer connection close if needed
//       };

//       if (localStream) pc.addStream(localStream);

//       callback(pc);
//     } catch (e) {
//       console.log('Something went wrong! pc not created!!', e);
//       callback(null);
//     }
//   };

//   useEffect(() => {
//     socket = io.connect(serviceIP, {
//       path: '/io/webrtc',
//       query: {},
//     });

//     socket.on('connection-success', (data) => {
//       getLocalStream();
//       setStatus(
//         data.peerCount > 1
//           ? `Total Connected Peers: ${data.peerCount}`
//           : 'Waiting for other peers to connect'
//       );
//     });

//     socket.on('peer-disconnected', (data) => {
//       setRemoteStreams((prevStreams) =>
//         prevStreams.filter((stream) => stream.id !== data.socketID)
//       );

//       if (selectedVideo && selectedVideo.id === data.socketID) {
//         setSelectedVideo(null);
//       }
//     });

//     socket.on('online-peer', (socketID) => {
//       console.log("new peer connected",socketID)
//       createPeerConnection(socketID, (pc) => {
//         if (pc) {

//           pc.createOffer(sdpConstraints).then((sdp) => {
//             pc.setLocalDescription(sdp);
//             console.log("setttde ld")
//             sendToPeer('offer', sdp, {
//               local: socket.id,
//               remote: socketID,
//             });
//           });
//         }
//       });
//     });

//     // Other socket event listeners...
//     socket.on('offer', data => {

//       createPeerConnection(data.socketID, pc => {
//         pc.addStream(localStream);

//         pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
//           pc.createAnswer(sdp => {
//             pc.setLocalDescription(sdp);

//             sendToPeer('answer', sdp, {
//               local: socket.id,
//               remote: data.socketID
//             });
//           });
//         });
//       });
//     });

//     socket.on('answer', data => {
//       const pc = peerConnections[data.socketID];
//       if (pc) {
//         console.log("going to set remote description")
//         pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
//           .then(() => console.log('Remote description set successfully'))
//           .catch(error => console.error('Error setting remote description:', error));
//       }
//     });

//     socket.on('candidate', data => {
//       const pc = peerConnections[data.socketID];
//       if (pc) {
//         pc.addIceCandidate(new RTCIceCandidate(data.candidate))
//           .then(() => console.log('Ice candidate added successfully'))
//           .catch(error => console.error('Error adding ice candidate:', error));
//       }
//     });

//     return () => {
//       // Clean-up logic here
//       socket.disconnect();
//     };
//   }, []);

//   const switchVideo = (_video) => {
//     setSelectedVideo(_video);
//   };

//   const statusText = <div style={{ color: 'yellow', padding: 5 }}>{status}</div>

//   return (
//     <>

//     {/* <button onClick={()=>{getUserMedia()}}>Get access to microphone and video</button> */}

//    {/* <div className="video-container"> */}
//   <Video styles={{zIndex: '2',
//     position: 'absolute',
//     right: '27%',
//     top:'13%',
//     borderRadius:'10px',
//     width:' 200px'}}  videoStream={localStream} autoPlay></Video>

//     <Video
//           styles={{

//             width: '100%',
//             height: '95% ',
//             // backgroundColor: 'black'
//           }}
//           // ref={ this.remoteVideoref }
//           videoStream={selectedVideo && selectedVideo.stream}
//           autoPlay>
//     </Video>
//  <br />
//  <div style={{
//           zIndex: 3,
//           position: 'absolute',
//           margin: 10,
//           backgroundColor: '#cdc4ff4f',
//           padding: 10,
//           borderRadius: 5,
//         }}>
//           { statusText }
//         </div>
//   {/* <video style={{height: '95%',
//     width: '100%',
//     backgroundColor: 'black'}}ref={remoteVideoRef} autoPlay></video> */}
//   <div>
//           <Videos
//             switchVideo={switchVideo}
//             remoteStreams={remoteStreams}
//           ></Videos>
//      </div>

//   {/* <button className='btn-vc1' onClick={createOffer}>Call</button>
//   <button className='btn-vc2' onClick={createAnswer}>Accept</button> */}
//    {/* </div> */}

// <br />
// {/* <textarea ref={textRef}></textarea> */}
// <br />
// {/* <button onClick={setRemoteDescription}>Set Remote Description</button>
// <button onClick={addCandidate}>Add Candidates</button> */}

//   </>
//   );
// };

// export default VideoElement;

import React, { useRef, useEffect } from "react";

const VideoElement = ({ videoStream, styles, isLocal, displayText }) => {
  const videoRef = useRef(null);
  console.log(": ", videoStream);
  useEffect(() => {
    if (videoStream && videoRef.current) {
      !isLocal
        ? (videoRef.current.srcObject = videoStream.stream)
        : (videoRef.current.srcObject = videoStream);
    }
  }, [videoStream]);

  return (
    <div className="videoElement">
      <video
        className="videoElement1"
        id={!isLocal && videoStream ? videoStream.id : ""}
        ref={videoRef}
        autoPlay
      ></video>
      {!videoStream && <h2 className="videoElementText">{displayText}</h2>}
    </div>
  );
};

export default VideoElement;
