import React, { useEffect, useState } from 'react';
import Video from './Video';

const Videos = ({ switchVideo, remoteStreams }) => {
  const [rVideos, setRVideos] = useState([]);
  console.log('remote',remoteStreams)
  useEffect(() => {
    if (remoteStreams.length > 0) {
      const _rVideos = remoteStreams.map((rVideo, index) => {
       console.log('remote',rVideo.stream)
        const video = (
          <Video
            // key={index}
            videoStream={rVideo.stream}
            // frameStyle={{ width: 120, float: 'left', padding: '0 3px' }}
            // videoStyles={{
            //   cursor: 'pointer',
            //   objectFit: 'cover',
            //   borderRadius: 3,
            //   width: '100%',
            // }}
            styles={{zIndex: '2',
            position: 'absolute',
            right: '27%',
            top:'13%',
            borderRadius:'10px',
            width:' 200px',
            border:'2px solid white'}}
            onClick={() => switchVideo(rVideo)}
          />
        );
        return (
          <div
            key={rVideo.name}
            style={{ display: 'inline-block' }}
          >
            {video}
          </div>
        );
      });
      setRVideos(_rVideos);
    }
  }, [remoteStreams, switchVideo]);

  return (
    <div
      style={{
        zIndex: 3,
        position: 'fixed',
        padding: '6px 3px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        maxHeight: 120,
        top: 'auto',
        right: 10,
        left: 10,
        width:'73%',
        bottom: 76,
        border: '1px solid white',
        // overflowX: 'scroll',
        whiteSpace: 'nowrap'
      }}
    >
      {rVideos}
    </div>
  );
};

export default Videos;
