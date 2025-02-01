import { useState, useContext, useEffect } from "react";

import "./App.css";
import Navbar from "./Components/Navbar";
import VideoConference from "./Components/VideoConference";
import ParticipantsSection from "./Components/ParticipantsSection";
import { useAudioRecorder } from "react-audio-voice-recorder";
import userContext from "./Components/userContext";
import * as webRTCHandler from "./utils/webRTCHandler";
import { startAudioRecording, stopAudioRecording } from "./utils/webRTCHandler";

function RoomPage() {
  const {
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
  } = useContext(userContext);
  console.log("Identity at room page ", identity);

  useEffect(() => {
    webRTCHandler.getLocalPreviewAndInitRoomConnection(
      isRoomHost,
      identity,
      roomId
      // connectOnlyWithAudio
    );
    console.log("get local preview called");
  }, []);

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();

  const [isPreparingTranscript, setIsPreparingTranscript] = useState(false);
  const [count, setCount] = useState(0);
  const [transcription, setTranscription] = useState();

  return (
    <div className="main-body">
      <Navbar
        transcription={transcription}
        startRecording={startRecording}
        stopRecording={stopRecording}
        togglePauseResume={togglePauseResume}
        recordingBlob={recordingBlob}
        isRecording={isRecording}
        isPaused={isPaused}
        isPreparingTranscript={isPreparingTranscript}
      />

      <div className="body">
        <div className="video-conferencing">
          <VideoConference />
          <button onClick={startAudioRecording}>Start Recording</button>
          <button onClick={stopAudioRecording}>Stop Recording</button>
        </div>

        <div className="participants-section">
          <ParticipantsSection
            setTranscription={setTranscription}
            startRecording={startRecording}
            stopRecording={stopRecording}
            togglePauseResume={togglePauseResume}
            recordingBlob={recordingBlob}
            isRecording={isRecording}
            isPaused={isPaused}
            roomId={roomId}
            setIsPreparingTranscript={setIsPreparingTranscript}
            transcription={transcription}
          />
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
