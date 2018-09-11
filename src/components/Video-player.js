import React from 'react';
import YouTube from 'react-youtube';
import { options } from '../youtube/video-options.js';


const VideoPlayer = (props) => {

  const redirectToMainPage = () => {
    props.history.push('/');
  }

  return (
    <div className='video-player'>
      <div onClick={redirectToMainPage} className='back-button'>Back to Search</div>
      <div>
        <YouTube
          videoId={props.match.params.videoId}
          opts={options}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
