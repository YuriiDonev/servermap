import youtube from 'youtube-finder';
import { GET_YOUTUBE_VIDEO, CHANGE_INDEX } from './types.js';
import { APIkey } from '../youtube/APIkey.js';

export const getVideosFromYouTube = keyword => async dispatch => {
  try {
    const client = youtube.createClient({ key: APIkey});
    const params = {
      part: 'snippet',
      q: keyword,
      type: 'video',
      maxResults: 9
    }
    await client.search(params, function (err, data) {
      dispatch({
        type: GET_YOUTUBE_VIDEO,
        payload: data.items,
      });
      dispatch({
        type: CHANGE_INDEX,
        payload: {
          currentFirstIndex: 0,
          currentLastIndex: 2
        },
      });
    });
  } catch (err) {
    console.error('youtube error', err);
  }
};

export const changeIndex = (index) => ({
  type: CHANGE_INDEX,
  payload: index,
});
