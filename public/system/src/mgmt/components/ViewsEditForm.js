import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import {
  fetchView, fetchViewSuccess, fetchViewwFailure, resetActiveView,
  updateView, updateViewSuccess, updateViewFailure,
  deleteView, deleteViewSuccess, deleteViewFailure,
  validateViewFields, validateViewFieldsSuccess, validateViewFieldsFailure,
  updateViewCam, updateViewCamSuccess, updateViewCamFailure
}
  from '../actions/views';

import { validateView, populateObjectsLeft, populateObjectsRight } from '../validators/viewValidator';
import { renderInput, renderTextarea, renderSelect} from './inputs';
import { ROOT_IMG_URL } from '../config.const';

const worldId = window.config.mainScene.worldId;

//For any field errors upon submission (i.e. not instant check)
const validateAndUpdateView = (values, dispatch) => {

    return new Promise((resolve, reject) => {
        dispatch(updateView({...values, world: worldId}))
          .then((response) => {
              let data = response.payload.data;
              //if any one of these exist, then there is a field error
              if (response.payload.status != 200) {
                  dispatch(updateViewFailure(response.payload));
                  reject(data);
              } else {
                  dispatch(updateViewSuccess(response.payload));
                  resolve(values);
              }
          });

    });
};

/* CLASS */

class ViewsForm extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    state = {
        lastModified: null,
        gearListMapped: []
    }

    componentWillMount() {
        let gearListMapped = populateObjectsLeft(window.config.gearMap);
        let gearListMappedRight = populateObjectsRight(window.config.gearMap);
        this.setState({ gearListMapped: gearListMapped, gearListMappedRight: gearListMappedRight});
    }

    componentDidMount() {
        this.props.fetchView(this.props.viewId);
    }

    componentDidUpdate() {
        if (this.props.pristine && !this.props.submitting) {
            ReactDom.findDOMNode(this).scrollIntoView();
        }
    }

    updateWithCurrCamCoords() {
        this.props.updateWithCurrCamCoords(this.props.activeView.view);
        this.props.change("cameraPosition.x", this.props.activeView.view.cameraPosition.x);
        this.props.change("cameraPosition.y", this.props.activeView.view.cameraPosition.y);
        this.props.change("cameraPosition.z", this.props.activeView.view.cameraPosition.z);
        this.props.change("targetPosition.x", this.props.activeView.view.targetPosition.x);
        this.props.change("targetPosition.y", this.props.activeView.view.targetPosition.y);
        this.props.change("targetPosition.z", this.props.activeView.view.targetPosition.z);
    }

    renderError(activeView) {
        if(activeView && activeView.error && activeView.error.message) {
            return (
              <div className="alert alert-danger">
                  {activeView ? activeView.error.message : ''}
              </div>
            );
        } else {
            return <span></span>
        }
    }

    saveView(values, dispatch) {
        let me = this,
          camPos = values.cameraPosition,
          tarPos = values.targetPosition;

        window.app3dViewer.viewPosition([camPos.x, camPos.y, camPos.z],[tarPos.x, tarPos.y, tarPos.z]);

        window.app3dViewer.generateScreenshot(240, 180, "image/png", false, "", false)
            .then(function(screenshot){
                values.screenshot = screenshot;
                let saver = validateAndUpdateView(values, dispatch),
                router = me.context.router;
                saver.then(function(){
                    router.push("/vSviews/" + me.props.vsid);
                });
            });
    }

    deletethisView() {
        let me = this;
        if (window.confirm('Are you sure to delete this?')) {
            let deleter = this.props.deleteView(this.props.viewId),
              router = this.context.router;
            deleter.then(function(){
                router.push("/vSviews/" + me.props.vsid);
            });
        }
    }

    render() {
        const {asyncValidating, handleSubmit, submitting, activeView } = this.props;
        const gearMappedObjects = this.state.gearListMapped;
        const gearMappedObjectsRight = this.state.gearListMappedRight;

        return (
          <div className="container">
              <h1>Edit View</h1>
              {activeView.view ? <h2>{activeView.view.title}</h2> : null}
              {this.renderError(activeView)}
              <form onSubmit={handleSubmit(this.saveView.bind(this))}>

                  <Field name="title" component={renderInput} type="text" placeholder="Title" label="Title"/>

                  <Field name="name" component={renderInput} type="text" placeholder="Name" label="Name"/>

                  <Field name="keyCode" component={renderInput} type="text" placeholder="Numeric key code" label="Key Code"/>

                  <Field name="highlighted" component={renderSelect} label="Highlighted mapped object" dataArray={gearMappedObjectsRight}/>

                  <Field name="selected" component={renderSelect} label="Selected gear" dataArray={gearMappedObjects}/>


                  <Field name="description" component={renderTextarea} placeholder="Description" label="Description" rows="3"/>

                  <Field name="html" component={renderTextarea} placeholder="<p>...</p>" label="Html" rows="6"/>

                  <div className="form-group">
                      <button type="button" onClick={() => this.updateWithCurrCamCoords()}
                              disabled={submitting}
                              className="btn btn-info" >Update fields w/ current camera/target</button>
                  </div>

                  <div className="vector3group">
                      <h4>Camera position</h4>
                      <Field name="cameraPosition.x" component={renderInput} type="number" placeholder="0.0" label="x"/>
                      <Field name="cameraPosition.y" component={renderInput} type="number" placeholder="0.0" label="y"/>
                      <Field name="cameraPosition.z" component={renderInput} type="number" placeholder="0.0" label="z"/>
                  </div>

                  <div className="vector3group">
                      <h4>Target position</h4>
                      <Field name="targetPosition.x" component={renderInput} type="number" placeholder="0.0" label="x"/>
                      <Field name="targetPosition.y" component={renderInput} type="number" placeholder="0.0" label="y"/>
                      <Field name="targetPosition.z" component={renderInput} type="number" placeholder="0.0" label="z"/>
                  </div>


                  {activeView.view && activeView.view.screenshot ?
                    <div className="form-group">
                        <label>Current screenshot</label><br />
                        <img src={activeView.view.screenshot.indexOf("data:image") === 0 ? activeView.view.screenshot : `${ROOT_IMG_URL}${activeView.view.screenshot}`}
                             alt={activeView.view.title } />
                    </div>
                    : null }


                  <div className="form-group">
                      <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
                      <Link to={"/vSviews/" + this.props.vsid} className="btn btn-error">Cancel</Link>
                  </div>

                  <div className="form-group pull-right">
                      <button type="button" className="btn btn-danger"
                              onClick={this.deletethisView.bind(this)}
                              disabled={submitting}>
                          Delete this view <span className="fa fa-times"></span>
                      </button>
                  </div>
              </form>

          </div>

        );
    }
}


ViewsForm = reduxForm({
    form: 'viewsNewForm',
    enableReinitialize: true,
    validate: validateView
})(ViewsForm);

ViewsForm = connect(
  (state, ownProps) => ({
      viewId: ownProps.id,
      vsid: ownProps.vsid,
      initialValues: state.views.activeView.view,
      activeView: state.views.activeView, // pull initial values from views reducer
      threeDObjects: state.threeDObjects.threeDObjectsList
  }),
  (dispatch, ownProps) => ({
      updateWithCurrCamCoords: (values) => {
          dispatch(updateViewCam({...values, world: worldId})).then((response) => {
              !response.error ? dispatch(updateViewCamSuccess(response.payload.data)) : dispatch(updateViewCamFailure(response.payload));
          });
      },
      fetchView: (id) => {
          dispatch(fetchView(id)).then((response) => {
              !response.error ? dispatch(fetchViewSuccess(response.payload.data)) : dispatch(fetchViewFailure(response.payload));
          });
      },
      deleteView: (id) => {
          return new Promise((resolve, reject) => {
              dispatch(deleteView(id, ownProps.vsid)).then((response) => {
                  let data = response.payload.data;
                  if (!response.error) {
                      dispatch(deleteViewSuccess(response.payload.data))
                      resolve();
                  } else {
                      dispatch(deleteViewFailure(response.payload));
                      reject(data);
                  }
              });

          });
      },
      resetMe: () => {
          dispatch(resetActiveView());
      }
  })
)(ViewsForm);

export default ViewsForm
