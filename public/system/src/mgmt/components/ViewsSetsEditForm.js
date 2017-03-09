import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import {
  fetchViewsSet, fetchViewsSetSuccess, fetchViewsSetwFailure, resetActiveViewsSet,
  updateViewsSet, updateViewsSetSuccess, updateViewsSetFailure, 
  deleteViewsSet, deleteViewsSetSuccess, deleteViewsSetFailure, 
  validateViewsSetFields, validateViewsSetFieldsSuccess, validateViewsSetFieldsFailure
}
from '../actions/viewsSets';
import { validateViewsSet } from '../validators/viewsSetValidator';
import { renderInput, renderTextarea, renderSelect} from './inputs';
import { ROOT_IMG_URL } from '../config.const';

//For any field errors upon submission (i.e. not instant check)
const validateAndUpdateViewsSet = (values, dispatch) => {

    return new Promise((resolve, reject) => {
        dispatch(updateViewsSet(values))
            .then((response) => {
            let data = response.payload.data;
            //if any one of these exist, then there is a field error 
            if (response.payload.status != 200) {
                dispatch(updateViewsSetFailure(response.payload));
                reject(data); 
            } else {
                dispatch(updateViewsSetSuccess(response.payload));
                resolve(values);
            }
        });

    });
};

/* CLASS */ 

class ViewsSetsForm extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    componentDidMount() {
        this.props.fetchViewsSet(this.props.viewsSetId);
    }

    componentDidUpdate() {
        ReactDom.findDOMNode(this).scrollIntoView();
    }
    
    renderError(activeViewsSet) {
        if(activeViewsSet && activeViewsSet.error && activeViewsSet.error.message) {
            return (
            <div className="alert alert-danger">
                {activeViewsSet ? activeViewsSet.error.message : ''}
            </div>
            );
        } else {
            return <span></span>
        }
    }

    saveViewsSet(values, dispatch) {
        let saver = validateAndUpdateViewsSet(values, dispatch),
            router = this.context.router;
        saver.then(function(){
            router.push("/viewsSets");
        });
    }

    deletethisViewsSet() {
        if (window.confirm('Are you sure to delete this?')) {
            let deleter = this.props.deleteViewsSet(this.props.viewsSetId, window.config.mainScene.worldId),
                router = this.context.router;
            deleter.then(function(){
                router.push("/viewsSets");
            });
        }
    }

    render() {
        const {asyncValidating, handleSubmit, submitting, activeViewsSet } = this.props;

        return (
            <div className="container">
                <h1>Edit Views-Set</h1>
                {activeViewsSet.viewsSet ? <h2>{activeViewsSet.viewsSet.title}</h2> : null}
                {this.renderError(activeViewsSet)}
                <form onSubmit={handleSubmit(this.saveViewsSet.bind(this))}>

                    <Field name="title" component={renderInput} type="text" placeholder="Title" label="Title"/> 

                    <Field name="name" component={renderInput} type="text" placeholder="Name" label="Name"/>
                    
                    <Field name="description" component={renderTextarea} placeholder="Description" label="Description" rows="3"/>                        
                    
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
                        <Link to="/viewsSets" className="btn btn-error">Cancel</Link>
                    </div>

                    <div className="form-group pull-right">
                        <button type="button" className="btn btn-danger" 
                            onClick={this.deletethisViewsSet.bind(this)} 
                            disabled={submitting}>
                            Delete this Views-Set <span className="fa fa-times"></span>
                        </button>
                    </div>
                </form>        

            </div>

        );
    }
}


ViewsSetsForm = reduxForm({
  form: 'viewsSetsNewForm',
  enableReinitialize: true,
  validate: validateViewsSet
})(ViewsSetsForm);

ViewsSetsForm = connect(
  (state, ownProps) => ({
    viewsSetId: ownProps.vsid,
    initialValues: state.viewsSets.activeViewsSet.viewsSet,
    activeViewsSet: state.viewsSets.activeViewsSet // pull initial values from viewsSets reducer
  }),
  dispatch => ({
    updateWithCurrCamCoords: (values) => {        
        dispatch(updateViewsSetCam(values)).then((response) => {
            !response.error ? dispatch(updateViewsSetCamSuccess(response.payload.data)) : dispatch(updateViewsSetCamFailure(response.payload));
          });
    },
    fetchViewsSet: (id) => {
        dispatch(fetchViewsSet(id)).then((response) => {
            !response.error ? dispatch(fetchViewsSetSuccess(response.payload.data)) : dispatch(fetchViewsSetFailure(response.payload));
          });
    },
    deleteViewsSet: (id, worldId) => {
        return new Promise((resolve, reject) => {
            dispatch(deleteViewsSet(id, worldId)).then((response) => {
                let data = response.payload.data;
                if (!response.error) {
                    dispatch(deleteViewsSetSuccess(response.payload.data))
                    resolve();
                } else { 
                    dispatch(deleteViewsSetFailure(response.payload));
                    reject(data); 
                }
            });
        
        });
    },
    resetMe: () => {
      dispatch(resetActiveViewsSet());
    } 
  })          
)(ViewsSetsForm);

export default ViewsSetsForm