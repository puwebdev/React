import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import {
  createViewsSet, createViewsSetSuccess, createViewsSetFailure, resetNewViewsSet, 
  validateViewsSetFields, validateViewsSetFieldsSuccess, validateViewsSetFieldsFailure
}
from '../actions/viewsSets';
import { validateViewsSet } from '../validators/viewsSetValidator';
import { renderInput, renderTextarea, renderSelect} from './inputs';

//For any field errors upon submission (i.e. not instant check)
const validateAndCreateViewsSet = (values, dispatch, worldId) => {

    return new Promise((resolve, reject) => {
        dispatch(createViewsSet(values, worldId))
            .then((response) => {
            let data = response.payload.data;
            //if any one of these exist, then there is a field error 
            if (response.payload.status != 200) {
                dispatch(createViewsSetFailure(response.payload));
                reject(data); 
            } else {
                dispatch(createViewsSetSuccess(response.payload));
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

    componentWillMount() {
        console.log("willmount", this);
    }

    componentDidUpdate() {
        //ReactDom.findDOMNode(this).scrollIntoView();
    }

    renderError(newViewsSet) {
        if(newViewsSet && newViewsSet.error && newViewsSet.error.message) {
            return (
            <div className="alert alert-danger">
                {newViewsSet ? newViewsSet.error.message : ''}
            </div>
            );
        } else {
            return <span></span>
        }
    }

    saveViewsSet(values, dispatch) {
        let saver = validateAndCreateViewsSet(values, dispatch, window.config.mainScene.worldId),
            router = this.context.router;
        saver.then(function(){
            router.push("/viewsSets");
        });
    }

    render() {
        console.log(this);
        const {asyncValidating, handleSubmit, submitting, newViewsSet } = this.props;

        return (
            <div className="container">
                <h1>New Views-Set</h1>
                {this.renderError(newViewsSet)}
                <form onSubmit={handleSubmit(this.saveViewsSet.bind(this))}>

                    <Field name="title" component={renderInput} type="text" placeholder="Title" label="Title"/> 

                    <Field name="name" component={renderInput} type="text" placeholder="Name" label="Name"/>
                    
                    <Field name="description" component={renderTextarea} placeholder="Description" label="Description" rows="3"/> 
                    
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
                        <Link to="/viewsSets" className="btn btn-error">Cancel</Link>
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
  state => ({
    initialValues: state.viewsSets.newViewsSet.viewsSet,
    newViewsSet: state.viewsSets.newViewsSet // pull initial values from viewsSets reducer
  }),
  dispatch => ({
    resetMe: () => {
      dispatch(resetNewViewsSet());
    } 
  })          
)(ViewsSetsForm);

export default ViewsSetsForm