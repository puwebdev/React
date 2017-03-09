import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { fetchViews, fetchViewsSuccess, fetchViewsFailure } from '../actions/views';
import {
  createInfowin, createInfowinSuccess, createInfowinFailure, resetNewInfowin,
  validateInfowinFields, validateInfowinFieldsSuccess, validateInfowinFieldsFailure
}
  from '../actions/infowins';
import { validateInfowin } from '../validators/infowinValidator';
import { renderInput, renderTextarea, renderSelect, renderObjectSelect } from './inputs';

const worldId = window.config.mainScene.worldId;

//For any field errors upon submission (i.e. not instant check)
const validateAndCreateInfowin = (values, dispatch, parentType, parentId) => {

  return new Promise((resolve, reject) => {
    dispatch(createInfowin({...values, world: worldId}, parentType, parentId))
      .then((response) => {
        let data = response.payload.data;
        //if any one of these exist, then there is a field error
        if (response.payload.status != 200) {
          dispatch(createInfowinFailure(response.payload));
          reject(data);
        } else {
          dispatch(createInfowinSuccess(response.payload));
          resolve(values);
        }
      });

  });
};

/* CLASS */

class InfowinForm extends Component {
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
    this.props.fetchViews();
  }

  componentDidUpdate() {
    ReactDom.findDOMNode(this).scrollIntoView();
  }

  renderError(newInfowin) {
    if(newInfowin && newInfowin.error && newInfowin.error.message) {
      return (
        <div className="alert alert-danger">
          {newInfowin ? newInfowin.error.message : ''}
        </div>
      );
    } else {
      return <span></span>
    }
  }

  saveInfowin(values, dispatch) {
    let saver = validateAndCreateInfowin(values, dispatch, this.props.parentType, this.props.parentId),
      router = this.context.router;
    saver.then(function(){
      router.goBack();
    });
  }

  populateViewSelections() {
    const { viewsList } = this.props;
    if (!viewsList.views || viewsList.views.length === 0) {
      return null;
    }

    const viewsListSelections = viewsList.views.map(viewIterator => ({
      label: viewIterator.title,
      value: viewIterator._id
    }));

    return viewsListSelections;
  }


  render() {
    const {asyncValidating, handleSubmit, pristine, submitting, newInfowin } = this.props;
    const viewsListSelections = this.populateViewSelections();

    return (
      <div className="container">
        <h1>New Info Window</h1>
        {this.renderError(newInfowin)}
        <form onSubmit={handleSubmit(this.saveInfowin.bind(this))}>

          <Field name="title" component={renderInput} type="text" placeholder="Title" label="Title"/>

          <Field name="name" component={renderInput} type="text" placeholder="Name" label="Name"/>

          <Field name="type" component={renderInput} type="text" placeholder="Type" label="Type"/>

          <Field name="thumbnail_src" component={renderInput} type="text" placeholder="Url of image" label="Thumbnail src (http://...)"/>

          <Field name="description" component={renderTextarea} placeholder="Description" label="Description" rows="3"/>

          <Field name="html" component={renderTextarea} placeholder="<p>...</p>" label="Html" rows="6"/>

          <Field name="view" component={renderObjectSelect} label="View" dataArray={viewsListSelections} />

          <div className="form-group">
            <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
            <Link to="/infowins" className="btn btn-error">Cancel</Link>
          </div>
        </form>

      </div>

    );
  }
}


InfowinForm = reduxForm({
  form: 'infowinsNewForm',
  enableReinitialize: true,
  validate: validateInfowin
})(InfowinForm);

InfowinForm = connect(
  (state, ownProps) => ({
    parentType: ownProps.parentType,
    parentId: ownProps.parentId,
    viewsList: state.views.viewsList,
    initialValues: state.infowins.newInfowin.infowin,
    newInfowin: state.infowins.newInfowin // pull initial values from infowins reducer
  }),
  dispatch => ({
    fetchViews: () => {
      dispatch(fetchViews('world', worldId)).then((response) => {
        !response.error ? dispatch(fetchViewsSuccess(response.payload.data)) : dispatch(fetchViewsFailure(response.payload));
      });
    },
    resetMe: () => {
      dispatch(resetNewInfowin());
    }
  })
)(InfowinForm);

export default InfowinForm;
