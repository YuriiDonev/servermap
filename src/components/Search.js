import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getVideosFromYouTube as _getVideosFromYouTube } from '../actions/video.js';

class Search extends Component {

  state = {
    searchInput: ''
  }

	setInputData = (e) => {
    if (e.target.name === 'youtube-search') {
      this.setState({searchInput: e.target.value});
    }
	}

	searchVideos = () => {
		this.props._getVideosFromYouTube(this.state.searchInput);
    this.setState({searchInput: ''});
	}

  detectIE = () => {
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE ');
    let trident = ua.indexOf('Trident/');
    let edge = ua.indexOf('Edge/');

    if (msie > 0 || trident > 0 || edge > 0) {
      return ' IE';
    } else {
      return '';
    }
  };

  render() {
    return (
      <div className={`search-container${this.detectIE()}`}>
          <div className='title'>{`What's on`}</div>
          <div className='search-input-wrapper'>
            <div className='search-label'>{'Search on YouTube'}</div>
            <div className='input-container'>
              <input
                type="text"
                name='youtube-search'
                value={this.state.searchInput}
                onChange={this.setInputData}
                placeholder={'Search on YouTube...'}
               />
               <button className={`search-button${this.detectIE()}`} onClick={this.searchVideos}>{'Search'}</button>
            </div>
          </div>
      </div>
    );
  }
}

const actions = {
  _getVideosFromYouTube,
};

export default connect(null, actions)(Search);
