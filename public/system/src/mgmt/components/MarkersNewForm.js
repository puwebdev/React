import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { fetchViews, fetchViewsSuccess, fetchViewsFailure } from '../actions/views';
import {
  createMarker, createMarkerSuccess, createMarkerFailure, resetNewMarker,
  validateMarkerFields, validateMarkerFieldsSuccess, validateMarkerFieldsFailure
}
  from '../actions/markers';
import { validateMarker } from '../validators/markerValidator';
import { renderInput, renderTextarea, renderSelect, renderObjectSelect } from './inputs';

//For any field errors upon submission (i.e. not instant check)
const validateAndCreateMarker = (values, dispatch, parentId) => {

  return new Promise((resolve, reject) => {
    dispatch(createMarker(values, parentId))
      .then((response) => {
        let data = response.payload.data;
        //if any one of these exist, then there is a field error
        if (response.payload.status != 200) {
          dispatch(createMarkerFailure(response.payload));
          reject(data);
        } else {
          dispatch(createMarkerSuccess(response.payload));
          resolve(values);
        }
      });

  });
};

/* CLASS */

class MarkerForm extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    lastModified: null,
  }

  componentWillMount() {
    //this.props.resetMe();
  }

  componentDidUpdate() {
    ReactDom.findDOMNode(this).scrollIntoView();
  }

  renderError(newMarker) {
    if(newMarker && newMarker.error && newMarker.error.message) {
      return (
        <div className="alert alert-danger">
          {newMarker ? newMarker.error.message : ''}
        </div>
      );
    } else {
      return <span></span>
    }
  }

  saveMarker(values, dispatch) {
    let saver = validateAndCreateMarker(values, dispatch, this.props.parentId),
      router = this.context.router;
    saver.then(function(){
      router.goBack();
    });
  }

  render() {
    const {asyncValidating, handleSubmit, pristine, submitting, newMarker } = this.props;
    const noYesSelect = [{
      label: 'No',
      value: false
    }, {
      label: 'Yes',
      value: true
    }];
    const arrowDirection = [
      { label: 'Bottom', value: 0 },
      { label: 'Up', value: 1 },
      { label: 'Left', value: 2 },
      { label: 'Right', value: 3 }
    ]

    return (
      <div className="container">
        <h1>New Marker</h1>
        {this.renderError(newMarker)}
        <form onSubmit={handleSubmit(this.saveMarker.bind(this))}>

          <Field name="title" component={renderInput} isBig="true" type="text" placeholder="Title" label="Title"/>
          <Field name="letter" component={renderInput} type="text" placeholder="A or B or 1 or i or iii..." label="Letter on marker (only 1)"/>
          <Field name="direction" component={renderObjectSelect} withoutNone="true" dataArray={arrowDirection}  label="Arrow direction" />
          <Field name="faIcon" component={renderInput} placeholder="fa-info-circle or fa-check-circle or fa-times-circle ..." label="Font-Awesome Icon (http://fontawesome.io/icons/) on Feedback" />
          <Field name="feedbackHtml" component={renderTextarea} placeholder="<p>...</p>" label="Feedback Html" rows="6"/>
          <Field name="dismissText" component={renderInput} placeholder="Close or Got it! or Next or Dismiss ..." label="Dismiss Button text" />
          <Field name="optionsOnShowFeedback" component={renderInput} placeholder="{}" label="optionsOnShowFeedback" />
          <Field name="optionsOnDismissFeedback" component={renderInput} placeholder="{}" label="optionsOnDismissFeedback" />
          <Field name="toNext" component={renderObjectSelect} withoutNone="true" dataArray={noYesSelect}  label="&rarr; To Next?" />

          <div className="vector3group">
              <h4>Marker position</h4>
              <Field name="position.x" component={renderInput} type="number" placeholder="0.0" label="x"/> 
              <Field name="position.y" component={renderInput} type="number" placeholder="0.0" label="y"/> 
              <Field name="position.z" component={renderInput} type="number" placeholder="0.0" label="z"/> 
          </div>          

          <div className="form-group">
            <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
            <Link to="/infowins" className="btn btn-error">Cancel</Link>
          </div>
        </form>

      </div>

    );
  }
}


MarkerForm = reduxForm({
  form: 'markersNewForm',
  enableReinitialize: true,
  validate: validateMarker
})(MarkerForm);

MarkerForm = connect(
  (state, ownProps) => ({
    parentId: ownProps.parentId,
    viewsList: state.views.viewsList,
    initialValues: state.markers.newMarker.marker,
    newMarker: state.markers.newMarker // pull initial values from markers reducer
  }),
  dispatch => ({
    fetchViews: () => {
      dispatch(fetchViews()).then((response) => {
        !response.error ? dispatch(fetchViewsSuccess(response.payload.data)) : dispatch(fetchViewsFailure(response.payload));
      });
    },
    resetMe: () => {
      dispatch(resetNewMarker());
    }
  })
)(MarkerForm);

export default MarkerForm;
