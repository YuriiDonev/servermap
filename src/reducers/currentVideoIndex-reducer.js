
import { CHANGE_INDEX } from '../actions/types.js';

const initialState = {
  currentFirstIndex: 0,
  currentLastIndex: 2,
};

const currentVideoIndex = (state = initialState, action) => {
  switch (action.type) {

      case CHANGE_INDEX: {
        return {
          currentFirstIndex: action.payload.currentFirstIndex,
          currentLastIndex: action.payload.currentLastIndex,
        };
      }

      default: {
        return state;
      }
    }
  };

export default currentVideoIndex;
