import _ from 'lodash';
import { GET_YOUTUBE_VIDEO } from '../actions/types.js';


const videos = (state = [], action) => {
  switch (action.type) {

      case GET_YOUTUBE_VIDEO: {
        const newState = _.map(action.payload, (video) => _.cloneDeep(video));
        return newState;
      }

      default: {
        return state;
      }
    }
  };

export default videos;
