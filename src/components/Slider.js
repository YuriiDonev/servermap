import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Search from './Search.js';
import Video from './Video-item.js';
import {
  getVideosFromYouTube as _getVideosFromYouTube,
  changeIndex as _changeIndex
 } from '../actions/video.js';

const DEFAULT_VIDEO_QUERY = 'chillout music';

class Slider extends Component {

  static propTypes = {
    videos: PropTypes.array.isRequired,
  };


  componentDidMount() {
    if (!_.isEmpty(this.props.videos)) return;
    this.props._getVideosFromYouTube(DEFAULT_VIDEO_QUERY);
  }


  showPreviousVideos = () => {
    if (this.props.currentVideoIndex.currentFirstIndex <= 0) return;
    this.props._changeIndex({
      currentFirstIndex: this.props.currentVideoIndex.currentFirstIndex-1,
      currentLastIndex: this.props.currentVideoIndex.currentLastIndex-1
    });
  }

  showNextVideos = () => {
    if (this.props.currentVideoIndex.currentLastIndex >= this.props.videos.length-1) return;
    this.props._changeIndex({
      currentFirstIndex: this.props.currentVideoIndex.currentFirstIndex+1,
      currentLastIndex: this.props.currentVideoIndex.currentLastIndex+1
    });
  }

  playVideoInPlayer = (id) => {
    this.props.history.push(`/play/${id}`);
  }

  render() {
    const renderVideos = this.props.videos.filter((video, i) => i >= this.props.currentVideoIndex.currentFirstIndex &&
    i <= this.props.currentVideoIndex.currentLastIndex );

    return (
      <div className='wrapper'>
        <div className='app'>
        <Search />
          {
            (this.props.videos.length < 3) ? <div className='container keep-search'>{'Keep Searching...'}</div> :
            <div className='container'>
              <div className='previous' onClick={this.showPreviousVideos} />
              <div className='videos-container'>
                {
                  renderVideos.map((video, i) =>
                  <Video
                    key={i}
                    id={video.id.videoId}
                    url={video.snippet.thumbnails.medium.url}
                    description={video.snippet.description}
                    publishDate={video.snippet.publishedAt}
                    playVideo={this.playVideoInPlayer}
                  />)
                }
              </div>
            <div className='next' onClick={this.showNextVideos} />
          </div>
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ videos, currentVideoIndex }) => ({
  videos,
  currentVideoIndex,
});

const actions = {
  _getVideosFromYouTube,
  _changeIndex,
};

export default connect(mapStateToProps, actions)(Slider);


// render() {
//   const renderVideos = this.props.videos.filter((video, i) => i >= this.props.currentVideoIndex.currentFirstIndex &&
//   i <= this.props.currentVideoIndex.currentLastIndex );
//
//   return (
//     <div className='wrapper'>
//       <div className='app'>
//       <Search />
//         {
//           (this.props.videos.length < 3) ? <div className='container keep-search'>{'Keep Searching...'}</div> :
//           <div className='container'>
//             <button className='previous' onClick={this.showPreviousVideos}>PREV</button>
//             <div className='videos-container'>
//               {
//                 renderVideos.map((video, i) =>
//                 <Video
//                   key={i}
//                   id={video.id.videoId}
//                   url={video.snippet.thumbnails.medium.url}
//                   description={video.snippet.description}
//                   publishDate={video.snippet.publishedAt}
//                   playVideo={this.playVideoInPlayer}
//                 />)
//               }
//             </div>
//           <button className='next' onClick={this.showNextVideos}>NEXT</button>
//         </div>
//         }
//       </div>
//     </div>
//   );
// }
