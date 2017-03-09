import { connect } from 'react-redux'
import { fetchViewsSets, fetchViewsSetsSuccess, fetchViewsSetsFailure, 
  saveOViewsSets, saveOViewsSetsSuccess, saveOViewsSetsFailure } from '../actions/viewsSets';

import ViewsSetsList from '../components/ViewsSetsList';

const worldId = window.config.mainScene.worldId;

const mapStateToProps = (state) => {
  return { 
    viewsSetsList: state.viewsSets.viewsSetsList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchViewsSets: () => {
      dispatch(fetchViewsSets(worldId)).then((response) => {
            !response.error ? dispatch(fetchViewsSetsSuccess(response.payload.data)) : dispatch(fetchViewsSetsFailure(response.payload));
          });
    },
    updateViewsSets: (viewsSets) => {
      dispatch(fetchViewsSetsSuccess({data: viewsSets})) 
    },
    updateOrder: (nOrder) => {
      dispatch(saveOViewsSets(worldId, nOrder)).then((response) => {
            !response.error ? dispatch(saveOViewsSetsSuccess(response.payload.data)) : dispatch(saveOViewsSetsFailure(response.payload));
          });
    },
  }
}


const ViewsSetsListContainer = connect(mapStateToProps, mapDispatchToProps)(ViewsSetsList)

export default ViewsSetsListContainer