import React, { useContext } from "react";
import StartRecordImg from "../../assets/sidebar/Record.png";
import "./SideBar.js";
import userContext from "../userContext.js";
import {
  startAudioRecording,
  stopAudioRecording,
} from "../../utils/webRTCHandler";
import stopRecordImg from "../../assets/sidebar/StopRecord.png";
import axios from "axios";
import { serverIP } from "../../apiConfig.js";

function StartRecord() {
  const {
    isRoomHost,
    socketId,
    transcription,
    setTranscription,
    isPreparingTranscript,
    setIsPreparingTranscript,
    isRecording,
    setIsRecording,
  } = useContext(userContext);

  const stopRecordHandler = () => {
    setIsRecording(false);
    stopAudioRecording()
      .then((audioBlob) => {
        console.log("Recording complete. Blob ready to use.", audioBlob);

        // Example: Sending the Blob to an API
        const formData = new FormData();
        formData.append("audio_file", audioBlob);
        setIsPreparingTranscript("Preparing Transcript");
        axios
          .post(`${serverIP}/multi-transcribe`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            setIsPreparingTranscript(false);

            // setTranscription(response.data.transcript);

            //-------- new changes -----

            // const processedResult = process(response.data.transcript);

            setTranscription(response.data.transcript);
            console.log("Transcription ready");
          })
          .catch((error) => {
            console.error("Error transcribing audio:", error);
            setIsPreparingTranscript("Error in Transcribing...");
          });
      })
      .catch((error) => {
        console.error("Error stopping audio recording:", error);
      });
  };

  const RecordHanlder = () => {
    if (!isRecording) {
      setIsRecording(true);
      socketId.emit("clearActiveSpeakerArray");
      startAudioRecording();
    } else {
      setIsRecording(false);
      stopRecordHandler();
    }
  };

  return (
    <img
      className="startRec"
      src={!isRecording ? StartRecordImg : stopRecordImg}
      onClick={RecordHanlder}
      style={
        !isRecording
          ? { width: "82%", height: "18%" }
          : { width: "70%", height: "12%" }
      }
    />
  );
}

export default StartRecord;
