import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { fetchViews, fetchViewsSuccess, fetchViewsFailure } from '../actions/views';
import {
  fetchInfowin, fetchInfowinSuccess, fetchInfowinwFailure, resetActiveInfowin,
  updateInfowin, updateInfowinSuccess, updateInfowinFailure,
  deleteInfowin, deleteInfowinSuccess, deleteInfowinFailure,
  cloneInfowin, cloneInfowinSuccess, cloneInfowinFailure,
  validateInfowinFields, validateInfowinFieldsSuccess, validateInfowinFieldsFailure
}
  from '../actions/infowins';
import { validateInfowin } from '../validators/infowinValidator';
import { renderInput, renderTextarea, renderSelect, renderObjectSelect } from './inputs';

const worldId = window.config.mainScene.worldId;

//For any field errors upon submission (i.e. not instant check)
const validateAndUpdateInfowin = (values, dispatch) => {

  return new Promise((resolve, reject) => {
    dispatch(updateInfowin({...values, world: worldId}))
      .then((response) => {
        let data = response.payload.data;
        //if any one of these exist, then there is a field error
        if (response.payload.status != 200) {
          dispatch(updateInfowinFailure(response.payload));
          reject(data);
        } else {
          dispatch(updateInfowinSuccess(response.payload));
          resolve(values);
        }
      });

  });
};

/* CLASS */

class InfowinsForm extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    lastModified: null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.infowinId !== this.props.infowinId) {
      this.props.fetchInfowin(nextProps.infowinId);
    }
  }

  componentDidMount() {
    this.props.fetchInfowin(this.props.infowinId);
    this.props.fetchViews();
  }

  componentDidUpdate() {
    ReactDom.findDOMNode(this).scrollIntoView();
  }

  renderError(activeInfowin) {
    if(activeInfowin && activeInfowin.error && activeInfowin.error.message) {
      return (
        <div className="alert alert-danger">
          {activeInfowin ? activeInfowin.error.message : ''}
        </div>
      );
    } else {
      return <span></span>
    }
  }

  saveInfowin(values, dispatch) {
    let saver = validateAndUpdateInfowin(values, dispatch),
      router = this.context.router;
    saver.then(function(){
      router.goBack();
    });
  }

  deletethisInfowin() {
    if (window.confirm('Are you sure to delete this?')) {
      let deleter = this.props.deleteInfowin(this.props.parentType, this.props.parentId, this.props.infowinId),
        router = this.context.router;
      deleter.then(function(){
        router.push("/infowins");
      });
    }
  }

  cloneThisInfowin() {
    alert("This functionality has been disabled: It generates an inconsistency in the DB.");
    return; 
    /*
    let cloner = this.props.cloneInfowin(this.props.parentType, this.props.parentId, this.props.selectedRelativePosition, this.props.infowinId),
      router = this.context.router;
    cloner.then(function(){
      router.goBack();
    });*/    
  }

  renderChildInfowins(activeInfowin) {
    if (activeInfowin && activeInfowin.infowin &&
      activeInfowin.infowin.infowins &&
      activeInfowin.infowin.infowins.length > 0) {
      return activeInfowin.infowin.infowins.map((childInfowin) => {
        if (childInfowin.qtype && childInfowin.qtype != '') {
          return (
            <li className="list-group-item" key={childInfowin._id}>
              <Link to={"/questions/infowin/" + activeInfowin.infowin._id + "/" + childInfowin._id}>
                <h3 className="list-group-item-heading">{childInfowin.title}</h3>
              </Link>
            </li>
          );  
        } else {
          return (
            <li className="list-group-item" key={childInfowin._id}>
              <Link to={"/infowins/infowin/" + activeInfowin.infowin._id + "/" + childInfowin._id}>
                <h3 className="list-group-item-heading">{childInfowin.title}</h3>
              </Link>
            </li>
          );          
        }
      });
    }
    return null;
  }

  renderMarkers(activeInfowin) {
    if (activeInfowin && activeInfowin.infowin &&
      activeInfowin.infowin.markers &&
      activeInfowin.infowin.markers.length) {
      return activeInfowin.infowin.markers.map((marker) => {
        return (
          <li className="list-group-item" key={marker._id}>
            <Link to={"/markers/" + activeInfowin.infowin._id + "/" + marker._id}>
              <h3 className="list-group-item-heading">{marker.title}</h3>
            </Link>
          </li>
        );          
        
      });
    }
    return null;
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
    const {asyncValidating, handleSubmit, submitting, cloning, activeInfowin } = this.props;
    const viewsListSelections = this.populateViewSelections();
    const clonedRelativePositionSelections = [{
      label: 'Before',
      value: 'before'
    }, {
      label: 'After',
      value: 'after'
    }];

    return (
      <div className="container">
        <div className="view-title">
          <h1>Edit Infowin</h1>
          {activeInfowin.infowin &&
            <Link to={"/infowins/new/infowin/" + activeInfowin.infowin._id}>+ Add New Child Info Window</Link>
          }
          {activeInfowin.infowin &&
            <Link to={"/questions/new/infowin/" + activeInfowin.infowin._id}>+ Add New Child Question</Link>
          }
          {activeInfowin.infowin &&
            <Link to={"/markers/new/" + activeInfowin.infowin._id}>+ Add New Marker</Link>
          }
        </div>
        {activeInfowin.infowin ? <h2>{activeInfowin.infowin.title}</h2> : null}
        {this.renderError(activeInfowin)}
        <form onSubmit={handleSubmit(this.saveInfowin.bind(this))}>

          <Field name="title" component={renderInput} type="text" placeholder="Title" label="Title"/>

          <Field name="name" component={renderInput} type="text" placeholder="Name" label="Name"/>

          <Field name="type" component={renderInput} type="text" placeholder="Type" label="Type"/>

          <Field name="thumbnail_src" component={renderInput} type="text" placeholder="Url of image" label="Thumbnail src (http://...)"/>

          <Field name="description" component={renderTextarea} placeholder="Description" label="Description" rows="3"/>

          <Field name="html" component={renderTextarea} placeholder="<p>...</p>" label="Html" rows="6"/>

          <Field name="view" component={renderObjectSelect} label="View" dataArray={viewsListSelections} />

          <div className="row">
            <div className="col-sm-8">
              <Field name="clonedRelativePosition" component={renderObjectSelect} label="Clone" dataArray={clonedRelativePositionSelections} />
            </div>
            <div className="col-sm-4">
              <button type="button" className="btn btn-info btn-clone"
                      onClick={this.cloneThisInfowin.bind(this)}
                      disabled={cloning || !this.props.selectedRelativePosition}>
                Clone
              </button>
            </div>
          </div>

          {activeInfowin && activeInfowin.infowin && activeInfowin.infowin.infowins && activeInfowin.infowin.infowins.length > 0 &&
          <div className="child-infowins children-list form-group">
            <h3>Child Infowins</h3>
            {this.renderChildInfowins(activeInfowin)}
          </div>
          }

          {activeInfowin && activeInfowin.infowin && activeInfowin.infowin.markers && activeInfowin.infowin.markers.length > 0 &&
          <div className="child-markers children-list form-group">
            <h3>Markers</h3>
            {this.renderMarkers(activeInfowin)}
          </div>
          }          

          <div className="form-group">
            <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
            <Link to="/infowins" className="btn btn-error">Cancel</Link>
          </div>

          <div className="form-group pull-right">
            <button type="button" className="btn btn-danger"
                    onClick={this.deletethisInfowin.bind(this)}
                    disabled={submitting}>
              Delete this infowin <span className="fa fa-times"></span>
            </button>
          </div>
        </form>

      </div>

    );
  }
}


InfowinsForm = reduxForm({
  form: 'infowinsNewForm',
  enableReinitialize: true,
  validate: validateInfowin
})(InfowinsForm);

const selector = formValueSelector('infowinsNewForm');

InfowinsForm = connect(
  (state, ownProps) => ({
    parentType: ownProps.parentType,
    parentId: ownProps.parentId,
    infowinId: ownProps.id,
    viewsList: state.views.viewsList,
    initialValues: state.infowins.activeInfowin.infowin,
    activeInfowin: state.infowins.activeInfowin, // pull initial values from infowins reducer
    selectedRelativePosition: selector(state, 'clonedRelativePosition'),
    cloning: state.infowins.clonedInfowin.loading
  }),
    dispatch => ({
    fetchViews: () => {
      dispatch(fetchViews('world', worldId)).then((response) => {
        !response.error ? dispatch(fetchViewsSuccess(response.payload.data)) : dispatch(fetchViewsFailure(response.payload));
      });
    },
    fetchInfowin: (id) => {
      dispatch(fetchInfowin(id)).then((response) => {
        !response.error ? dispatch(fetchInfowinSuccess(response.payload.data)) : dispatch(fetchInfowinFailure(response.payload));
      });
    },
    deleteInfowin: (parentType, parentId, id) => {
      return new Promise((resolve, reject) => {
        dispatch(deleteInfowin(parentType, parentId, id)).then((response) => {
          let data = response.payload.data;
          if (!response.error) {
            dispatch(deleteInfowinSuccess(response.payload.data))
            resolve();
          } else {
            dispatch(deleteInfowinFailure(response.payload));
            reject(data);
          }
        });

      });
    },
    cloneInfowin: (parentType, parentId, relativePosition, id) => {
      return new Promise((resolve, reject) => {
        dispatch(cloneInfowin(parentType, parentId, relativePosition, id)).then((response) => {
          let data = response.payload.data;
          if (!response.error) {
            dispatch(cloneInfowinSuccess(response.payload.data));
            resolve();
          } else {
            dispatch(cloneInfowinFailure(response.payload));
            reject(data);
          }
        });
      });
    },
    resetMe: () => {
      dispatch(resetActiveInfowin());
    }
  })
)(InfowinsForm);

export default InfowinsForm
