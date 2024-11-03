import React,{useEffect} from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import LoadingContent from './LoadingContent';
// import animationData from "../assets/preparing.json"
import speakNow from "../assets/speakNow.json"
import Lottie from "lottie-react"
function LiveComponent({showLiveComponent}) {

  useEffect(() => {
    SpeechRecognition.startListening({continuous:true});
}, []);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
    
      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
      }

    

  return (
    <div>
       {transcript? (<p className='transcription' >{transcript}</p>): <p className='transcription'> <LoadingContent className="loading-text" content={"Capturing..."} image="" lottieC={<Lottie animationData={speakNow}/>}/> </p> }
        
    </div>
  )
}

export default LiveComponent