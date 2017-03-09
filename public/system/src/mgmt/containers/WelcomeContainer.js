import { connect } from 'react-redux'
import { fetchCamPos, fetchCamPosSuccess, fetchCamPosFailure } from '../actions/welcome';

import Welcome from '../components/Welcome';

const mapStateToProps = (state) => {
  return { 
    data: state.welcome.camPos
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCamPos: () => {
      dispatch(fetchCamPos()).then((response) => {
            !response.error ? dispatch(fetchCamPosSuccess(response.payload)) : dispatch(fetchCamPosFailure(response.payload));
          });
    }
  }
}


const WelcomeContainer = connect(mapStateToProps, mapDispatchToProps)(Welcome)

export default WelcomeContainer