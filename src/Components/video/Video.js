import React, { useRef ,useEffect} from 'react';

const Video = ({ styles, videoStream, autoPlay }) => {
  const videoRef = useRef(null);
 console.log("video stream ",videoStream)
  useEffect(() => {
    if (videoStream &&videoRef.current ) {
      videoRef.current.srcObject = videoStream;
      console.log("videoRef setted",videoStream.id)
    }
  }, [videoStream]);

  return <video ref={videoRef} style={styles} autoPlay={autoPlay} />;
};

export default Video;
