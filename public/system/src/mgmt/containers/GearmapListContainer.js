import { connect } from 'react-redux'
import { fetchGearmap, fetchGearmapSuccess, fetchGearmapFailure, saveGearmap, saveGearmapSuccess, saveGearmapFailure } from '../actions/gearmap';

import GearmapList from '../components/GearmapList';

const worldId = window.config.mainScene.worldId;

const mapStateToProps = (state) => {
  return { 
    gearmapList: state.gearmap.gearmapList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGearmap: () => {
      dispatch(fetchGearmap(worldId)).then((response) => {
            !response.error ? dispatch(fetchGearmapSuccess(response.payload.data)) : dispatch(fetchGearmapFailure(response.payload));
          });
    },
    saveGearmap: (gearmap, worldId) => {
      return new Promise((resolve, reject) => {
          dispatch(saveGearmap(worldId, gearmap)).then((response) => {
              if (!response.error) {
                dispatch(saveGearmapSuccess(response.payload.data));
                resolve();
              } else {
                dispatch(saveGearmapFailure(response.payload));
                reject(response.payload);
              }
          });
      });
    },
  }
}


const GearmapListContainer = connect(mapStateToProps, mapDispatchToProps)(GearmapList)

export default GearmapListContainer