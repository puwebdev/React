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
      return new Promise((resolve, reject) => {
          dispatch(fetchGearmap(worldId)).then((response) => {
              if (!response.error) {
                dispatch(fetchGearmapSuccess(response.payload.data));
                resolve();
              } else {
                dispatch(fetchGearmapFailure(response.payload));
                reject(response.payload);
              }
          });
      });
    },
    saveGearmap: (groupsMap, objDelKeys, worldId) => {
      return new Promise((resolve, reject) => {
          dispatch(saveGearmap(worldId, groupsMap, objDelKeys)).then((response) => {
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