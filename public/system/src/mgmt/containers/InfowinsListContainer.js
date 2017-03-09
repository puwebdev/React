import { connect } from 'react-redux'
import { fetchInfowins, fetchInfowinsSuccess, fetchInfowinsFailure, saveOInfowins, saveOInfowinsSuccess, saveOInfowinsFailure } from '../actions/infowins';

import InfowinsList from '../components/InfowinsList';

const worldId = window.config.mainScene.worldId;

const mapStateToProps = (state) => {
  return { 
    infowinsList: state.infowins.infowinsList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchInfowins: () => {
      dispatch(fetchInfowins(worldId)).then((response) => {
            !response.error ? dispatch(fetchInfowinsSuccess(response.payload.data)) : dispatch(fetchInfowinsFailure(response.payload));
          });
    },
    updateInfowins: (infowins) => {
      dispatch(fetchInfowinsSuccess({data: infowins})) 
    }
  }
}


const InfowinsListContainer = connect(mapStateToProps, mapDispatchToProps)(InfowinsList)

export default InfowinsListContainer