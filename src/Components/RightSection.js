import React, { useEffect, useState } from "react";
import "./RightSection.css";
import pause from "../assets/pause.png";
import stop from "../assets/stop.png";
import forward from "../assets/fast-forward.png";
import backward from "../assets/previous.png";
import LiveComponent from "./LiveComponent";
import LoadingContent from "./LoadingContent";
import loadImageIcon from "../assets/Infinity@1.25x-1.0s-200px-200px.svg";
import loadingDots from "../assets/LoadingDots.json";
import recordingIcon from "../assets/recordingIcon.json";
import Lottie from "lottie-react";
import recordingIcon2 from "../assets/recordingIcon2.json";
import recordingIcon3 from "../assets/recordingIcon3.json";
// import preparingIcon from "../assets/preparing.json"
import LoadingJar from "../assets/loadingJar.json";
import Summary from "./Summary";
import { summarise } from "../apiConfig";
function RightSection({
  transcription,
  isRecording,
  isPaused,
  isPreparingTranscript,
}) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTranscription, setShowTranscription] = useState(true);
  const [showLiveComponent, setShowLiveComponent] = useState(false);

  useEffect(() => {
    console.log("value of transcription is : ", showTranscription);
    console.log("hy there ");
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${summarise}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcription }),
      });
      const data = await response.json();
      console.log("summary prepared is : ", data.summary_text);
      setSummary(data.summary_text);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setLoading(false);
    }
  };

  const handleStopClick = () => {
    if (transcription) {
      if (showTranscription) {
        setShowTranscription(false);
        if (!summary) fetchSummary();
      } else {
        setShowTranscription(true);
      }
    }
  };

  return (
    <div className="RightSection">
      <div className="right-section-heading">
        <h2 className="right-sec-inner-head">
          {showTranscription ? "Transcription" : "Summary"}
        </h2>
        <div className="pause-icon">
          <div
            className="pause-img"
            onClick={() => {
              setShowLiveComponent(!showLiveComponent);
            }}
          >
            {" "}
            <img className="pause-img" src={pause} alt="" />
            {showLiveComponent ? "Stop Live" : "Go Live"}
          </div>
        </div>

        {transcription && (
          <div onClick={handleStopClick} className="stop-icon">
            <img
              className="pause-img"
              src={showTranscription ? forward : backward}
              alt=""
            />
          </div>
        )}
      </div>

      <div className="right-section-body">
        {showLiveComponent ? (
          <LiveComponent showLiveComponent={showLiveComponent} />
        ) : (
          <>
            {!isPreparingTranscript &&
            !isRecording &&
            !isPaused &&
            !transcription ? (
              <LoadingContent
                content="Recording Not Yet Started.."
                image={loadImageIcon}
              />
            ) : !isRecording &&
              !isPaused &&
              !transcription &&
              isPreparingTranscript == "Preparing Transcript" ? (
              <LoadingContent
                content={isPreparingTranscript}
                image={""}
                lottieC={<Lottie animationData={loadingDots} />}
              />
            ) : !isRecording &&
              !isPaused &&
              !transcription &&
              isPreparingTranscript == "Error in Transcribing..." ? (
              <LoadingContent
                content={isPreparingTranscript}
                image={""}
                lottieC={<Lottie animationData={loadingDots} />}
              />
            ) : isRecording && !isPaused ? (
              <LoadingContent
                content="Recording Audio..."
                image={""}
                lottieC={<Lottie animationData={recordingIcon2} />}
              />
            ) : isPaused ? (
              <LoadingContent
                content="Recording is Paused.."
                image={loadImageIcon}
              />
            ) : showTranscription ? (
              transcription.split("\n").map((line, index) => (
                <p className="transcription" key={index}>
                  {line}
                </p>
              ))
            ) : (
              // <p className="transcription">{transcription}</p>
              <div className="summary-content">
                <p className="transcription">
                  {loading ? (
                    <LoadingContent
                      content="Loading..."
                      image={loadImageIcon}
                    />
                  ) : (
                    <Summary summary={summary} btn={true} /> || (
                      <LoadingContent
                        content="Summary not available"
                        image={loadImageIcon}
                      />
                    )
                  )}
                </p>
              </div>
            )}

            {/* {showTranscription ? (
        <p className='transcription'>{transcription}</p>
      ) : (
        <div className="summary-content">
          <p className='transcription'>{loading ? 'Loading...' : summary || 'Summary not available'}</p>
        </div>
      )} */}
          </>
        )}
      </div>
    </div>
  );
}

export default RightSection;
