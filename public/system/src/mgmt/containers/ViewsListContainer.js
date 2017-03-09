import { connect } from 'react-redux'
import { fetchViews, fetchViewsSuccess, fetchViewsFailure, 
  saveOViews, saveOViewsSuccess, saveOViewsFailure
} from '../actions/views';
import { fetchViewsSets, fetchViewsSetsSuccess, fetchViewsSetsFailure } from '../actions/viewsSets';

import ViewsList from '../components/ViewsList';

const worldId = window.config.mainScene.worldId;

const mapStateToProps = (state, ownProps) => {
  return { 
    viewsList: state.views.viewsList,
    viewsSetsList: state.viewsSets.viewsSetsList,
    vsid: ownProps.vsid    
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchViews: () => {
      dispatch(fetchViews('viewsSet', ownProps.vsid)).then((response) => {
            !response.error ? dispatch(fetchViewsSuccess(response.payload.data)) : dispatch(fetchViewsFailure(response.payload));
          });
    },
    updateViews: (views) => {
      dispatch(fetchViewsSuccess({data: views})) 
    },
    updateOrder: (nOrder) => {
      dispatch(saveOViews(ownProps.vsid, nOrder)).then((response) => {
            !response.error ? dispatch(saveOViewsSuccess(response.payload.data)) : dispatch(saveOViewsFailure(response.payload));
          });
    },
    fetchViewsSets: () => {
      dispatch(fetchViewsSets(worldId)).then((response) => {
            !response.error ? dispatch(fetchViewsSetsSuccess(response.payload.data)) : dispatch(fetchViewsSetsFailure(response.payload));
          });
    }
  }
}


const ViewsListContainer = connect(mapStateToProps, mapDispatchToProps)(ViewsList)

export default ViewsListContainer
