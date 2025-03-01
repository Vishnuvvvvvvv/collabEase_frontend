import "regenerator-runtime/runtime";
import RoomPage from "./RoomPage";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroductionPage from "./Components/IntroductionPage/IntroductionPage";
import JoinRoomPage from "./Components/JoinRoomContent/JoinRoomPage";
import userContext from "./Components/userContext";
import * as wss from "../src/utils/wss";
import "./Components/IntroductionPage/IntroductionPage.css";
function App() {
  //global variables
  const [isRoomHost, setIsRoomHost] = useState(false);
  const [onlyWithAudio, setConnectOnlyWithAudio] = useState();
  const [identity, setIdentity] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [socketId, setSocketId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [transcription, setTranscription] = useState();
  const [isPreparingTranscript, setIsPreparingTranscript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    wss.connectWithSocketIOServer({
      setLocalStream,
      setRemoteStreams,
      isRoomHost,
      setIsRoomHost,
      identity,
      setIdentity,
      roomId,
      setRoomId,
      participants,
      setParticipants,
      socketId,
      setSocketId,
    });
  }, []);

  return (
    <userContext.Provider
      value={{
        setLocalStream,
        setRemoteStreams,
        isRoomHost,
        setIsRoomHost,
        identity,
        setIdentity,
        roomId,
        setRoomId,
        participants,
        setParticipants,
        socketId,
        setSocketId,
        transcription,
        setTranscription,
        isPreparingTranscript,
        setIsPreparingTranscript,
        isRecording,
        setIsRecording,
        isMenuOpen,
        setIsMenuOpen,
      }}
    >
      <Router>
        <Routes>
          <Route path="/join-room" element={<JoinRoomPage />} />
          <Route path="/room" element={<RoomPage />} />

          <Route path="/" element={<IntroductionPage />} />
        </Routes>
      </Router>
    </userContext.Provider>
  );
}

export default App;
