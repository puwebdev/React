import axios from 'axios';
import { ROOT_URL } from '../config.const';

//Set the User's status for Info win and Question.
export const SAVE_TRACK = 'SAVE_TRACK';
export const SAVE_TRACK_SUCCESS = 'SAVE_TRACK_SUCCESS';
export const SAVE_TRACK_FAILURE = 'SAVE_TRACK_FAILURE';

export function save(target_type, target_id, activity_type, world_id) {
  const request = axios({
    method: 'post',
    data: {
      track: {
        target_type: target_type,
        target_id: target_id,
        activity_type: activity_type,
        timestamp_sync: Date.now()
      },
      world: world_id
    },
    url: `${ROOT_URL}/tracks`
  });

  return {
    type: SAVE_TRACK,
    payload: request
  };
}
