import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import {
  createView, createViewSuccess, createViewFailure, resetNewView,
  validateViewFields, validateViewFieldsSuccess, validateViewFieldsFailure,
  updateViewCam, updateViewCamSuccess, updateViewCamFailure
}
  from '../actions/views';
import { validateView, populateObjectsLeft, populateObjectsRight } from '../validators/viewValidator';
import { renderInput, renderTextarea, renderSelect} from './inputs';

const worldId = window.config.mainScene.worldId;

//For any field errors upon submission (i.e. not instant check)
const validateAndCreateView = (values, dispatch, vsid) => {

    return new Promise((resolve, reject) => {
        dispatch(createView({...values, world: worldId}, vsid))
          .then((response) => {
              let data = response.payload.data;
              //if any one of these exist, then there is a field error
              if (response.payload.status != 200) {
                  dispatch(createViewFailure(response.payload));
                  reject(data);
              } else {
                  dispatch(createViewSuccess(response.payload));
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
        this.props.updateWithCurrCamCoords(this.props.newView.view);
    }

    componentDidUpdate() {
        if (this.props.pristine && !this.props.submitting) {
            ReactDom.findDOMNode(this).scrollIntoView();
        }
    }

    updateWithCurrCamCoords() {
        this.props.updateWithCurrCamCoords(this.props.newView.view);
        this.props.change("cameraPosition.x", this.props.newView.view.cameraPosition.x);
        this.props.change("cameraPosition.y", this.props.newView.view.cameraPosition.y);
        this.props.change("cameraPosition.z", this.props.newView.view.cameraPosition.z);
        this.props.change("targetPosition.x", this.props.newView.view.targetPosition.x);
        this.props.change("targetPosition.y", this.props.newView.view.targetPosition.y);
        this.props.change("targetPosition.z", this.props.newView.view.targetPosition.z);
    }

    renderError(newView) {
        if(newView && newView.error && newView.error.message) {
            return (
              <div className="alert alert-danger">
                  {newView ? newView.error.message : ''}
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
                let saver = validateAndCreateView(values, dispatch, me.props.vsid),
                router = me.context.router;
                saver.then(function(){
                    router.push("/vSviews/" + me.props.vsid);
                });
            });

    }

    render() {
        const {asyncValidating, handleSubmit, pristine, submitting, newView } = this.props;
        const gearMappedObjects = this.state.gearListMapped;
        const gearMappedObjectsRight = this.state.gearListMappedRight;

        return (
          <div className="container">
              <h1>New View</h1>
              {this.renderError(newView)}
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

                  <div className="form-group">
                      <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
                      <Link to={"/vSviews/" + this.props.vsid} className="btn btn-error">Cancel</Link>
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
      vsid: ownProps.vsid,
      initialValues: state.views.newView.view,
      newView: state.views.newView // pull initial values from views reducer
  }),
  (dispatch, ownProps) => ({
      updateWithCurrCamCoords: (values) => {
          dispatch(updateViewCam({...values, world: worldId}, ownProps.vsid)).then((response) => {
              !response.error ? dispatch(updateViewCamSuccess(response.payload.data)) : dispatch(updateViewCamFailure(response.payload));
          });
      },
      resetMe: () => {
          dispatch(resetNewView());
      }
  })
)(ViewsForm);

export default ViewsForm
