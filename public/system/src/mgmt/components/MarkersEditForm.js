import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link, ButtonLink } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { fetchViews, fetchViewsSuccess, fetchViewsFailure } from '../actions/views';
import {
  fetchMarker, fetchMarkerSuccess, fetchMarkerwFailure, resetActiveMarker,
  updateMarker, updateMarkerSuccess, updateMarkerFailure, 
  deleteMarker, deleteMarkerSuccess, deleteMarkerFailure, 
  validateMarkerFields, validateMarkerFieldsSuccess, validateMarkerFieldsFailure
}
  from '../actions/markers';
import { validateMarker } from '../validators/markerValidator';
import { renderInput, renderTextarea, renderSelect, renderObjectSelect } from './inputs';

//For any field errors upon submission (i.e. not instant check)
const validateAndUpdateMarker = (values, dispatch, parentId) => {

  return new Promise((resolve, reject) => {
    dispatch(updateMarker(values, parentId))
      .then((response) => {
        let data = response.payload.data;
        //if any one of these exist, then there is a field error
        if (response.payload.status != 200) {
          dispatch(updateMarkerFailure(response.payload));
          reject(data);
        } else {
          dispatch(updateMarkerSuccess(response.payload));
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
    this.props.resetMe();
  }

  componentDidMount() {
      this.props.fetchMarker(this.props.markerId);
  }

  componentDidUpdate() {
      if (this.props.pristine && !this.props.submitting) {
          ReactDom.findDOMNode(this).scrollIntoView();
      }
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
    let saver = validateAndUpdateMarker(values, dispatch, this.props.parentId),
      router = this.context.router;
    saver.then(function(){
      router.goBack();
    });
  }

  deletethisMarker() {
      let me = this;
      if (window.confirm('Are you sure to delete this?')) {
          let deleter = this.props.deleteMarker(this.props.markerId),
              router = this.context.router;
          deleter.then(function(){
              router.goBack();
          });
      }
  }

  gotoBack() {
    this.context.router.goBack();
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
    ];

    return (
      <div className="container">
        <h1>Edit Marker</h1>
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

          <div className="form-group pull-right">
              <button type="button" className="btn btn-danger" 
                  onClick={this.deletethisMarker.bind(this)} 
                  disabled={submitting}>
                  Delete this marker <span className="fa fa-times"></span>
              </button>
          </div>          
        </form>

      </div>

    );
  }
}


MarkerForm = reduxForm({
  form: 'markersEditForm',
  enableReinitialize: true,
  validate: validateMarker
})(MarkerForm);

MarkerForm = connect(
  (state, ownProps) => ({
    parentId: ownProps.parentId,
    markerId: ownProps.id,
    initialValues: state.markers.activeMarker.marker,
    activeMarker: state.markers.activeMarker // pull initial values from markers reducer
  }),
  (dispatch, ownProps) => ({
    fetchMarker: (id) => {
        dispatch(fetchMarker(id)).then((response) => {
            !response.error ? dispatch(fetchMarkerSuccess(response.payload.data)) : dispatch(fetchMarkerFailure(response.payload));
          });
    },
    deleteMarker: (id) => {
        return new Promise((resolve, reject) => {
            dispatch(deleteMarker(ownProps.parentId, id)).then((response) => {
                let data = response.payload.data;
                if (!response.error) {
                    dispatch(deleteMarkerSuccess(response.payload.data))
                    resolve();
                } else { 
                    dispatch(deleteMarkerFailure(response.payload));
                    reject(data); 
                }
            });
        
        });
    },
    resetMe: () => {
      dispatch(resetActiveMarker());
    }
  })
)(MarkerForm);

export default MarkerForm;
