import React, { useContext, useEffect, useState } from "react";
import "./AttendeeList.css";
import profilePic from "../assets/sidebar/person.png";
import startIcon from "../assets/icons8-record-50.png";
import stopIcon from "../assets/stop.png";
import axios from "axios";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { serverIP } from "../apiConfig";
import {
  startAudioRecording,
  stopAudioRecording,
} from "../utils/webRTCHandler";
import userContext from "./userContext";

const AttendeeList = ({
  roomId,
  participants,
  setTranscription,
  startRecording,
  stopRecording,
  togglePauseResume,
  recordingBlob,
  isRecording,
  isPaused,
  setIsPreparingTranscript,
  transcription,
}) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  // const [transcript, setTranscript] = useState('');
  const [recordingActive, setRecordingActive] = useState(false);
  //const [name,setName] = useState(['Jacob Samuel','Abraham Issac','Joshua P','Peter Domnic','Paul Augustine','John Manuel'])
  const { isRoomHost, socketId } = useContext(userContext);

  //  const {
  //   startRecording,
  //   stopRecording,
  //   togglePauseResume,
  //   recordingBlob,
  //   isRecording,
  //   isPaused,
  //   recordingTime,
  //   mediaRecorder
  // } = useAudioRecorder();

  useEffect(() => {
    if (isRecording) {
      setRecordingActive("Recording");
    } else if (isPaused) {
      console.log("pause");
      setRecordingActive("Paused");
    } else {
      setRecordingActive("Idle");
    }
  }, [isRecording, isPaused]);

  console.log("recording status", recordingActive);

  // const process = (arr) => {
  //   let result = "";
  //   for (let obj of arr) {
  //     result += "Speaker " + obj.speaker + " : " + obj.text + "<br />";
  //   }
  //   setTranscription(result);
  // };
  const process = (arr) => {
    return arr.map((obj, index) => (
      <div key={index}>
        Speaker {obj.speaker}: {obj.text}
        <br />
      </div>
    ));
  };

  useEffect(() => {
    if (recordingBlob) {
      // Do something with the recordingBlob, like save it or send it to the server
      console.log("Recording saved:", recordingBlob);
      const formData = new FormData();
      formData.append("audio_file", recordingBlob);
      setIsPreparingTranscript("Preparing Transcript");
      axios
        .post(
          // "https://9018-34-82-118-146.ngrok-free.app/transcribe",
          `${serverIP}/multi-transcribe`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
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
    }
  }, [recordingBlob]);

  const stopClicked = () => {
    setButtonText("REC");
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

  const nameEl = participants.map((item) => {
    return (
      <>
        <div key={item.identity} className="attendee-name">
          <img className="prf-img" src={profilePic} alt="" srcset="" />
          <h3
            style={{
              fontFamily: " monospace",
              letterSpacing: "4px",
            }}
          >
            {item.identity}
          </h3>
        </div>
      </>
    );
  });

  const copyRoomIdToClipboard = (roomId) => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        alert(`Room ID ${roomId} copied to clipboard`);
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
      });
  };

  const [buttonText, setButtonText] = useState("REC");

  return (
    <>
      {" "}
      {/* <button onClick={() => copyRoomIdToClipboard(roomId)}>
        Copy Room ID
      </button> */}
      <div className="attendeeList">
        {/* Recording time: {recordingTime} seconds <br /><br /> */}
        {nameEl}

        {/* <p>Recording time: {recordingTime} seconds</p> */}
        {/* <p>Status: {isRecording ? 'Recording' : isPaused ? 'Paused' : 'Idle'}</p> */}

        {/* {isRoomHost && (
          <div className="attendee-btn-container">
            {!isRecording ? (
              <div
                className="attendee-start-btn"
                disabled={isRecording}
                // onClick={startRecording}
                onClick={() => {
                  socketId.emit("clearActiveSpeakerArray");
                  startAudioRecording();
                  setButtonText("Recording");
                }}
              >
                <img
                  className="attendee-start-icon"
                  src={startIcon}
                  alt=""
                  srcset=""
                />
                {buttonText}
              </div>
            )
            : (
              <div
                className="attendee-stop-btn"
                onClick={togglePauseResume}
                disabled={!isRecording}
              >
                {isPaused ? "Resume" : "Pause"}
              </div>
            )}
            <div
              className="attendee-stop-btn"
              disabled={!isRecording}
              onClick={() => {
                // stopRecording();
                stopClicked();
              }}
            >
              <img
                className="attendee-stop-icon"
                src={stopIcon}
                alt=""
                srcset=""
              />
              STOP
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default AttendeeList;
