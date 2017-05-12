import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import {
    createInfowin, createInfowinSuccess, createInfowinFailure, resetNewInfowin,
    fetchProductsMap, fetchProductsMapSuccess, fetchProductsMapFailure,
    validateInfowinFields, validateInfowinFieldsSuccess, validateInfowinFieldsFailure
  } from '../actions/infowins';
import { validateInfowin } from '../validators/infowinValidator';
import { orderLowercase, populateObjectsLeft } from '../validators/viewValidator';
import { renderInput, renderTextarea, renderSelect, renderObjectSelect } from './inputs/inputs';
import { renderProductSelect } from './inputs/InputFields';
import { renderTinyMce } from './inputs/tinyMce';
import { InputDropDownSemantic, InputDropDownSemanticOne } from './inputs/inputsDropdownSem';
import { ViewComponent } from './inputs/inputsViewComp';
import { QuestionComponent } from './inputs/inputsQuestionComp';
import { getParentUrl } from '../helpers/helpers';
import { deviceScreensOptionsFlattened, DeviceScreensComponent } from './inputs/inputsDeviceScreens';

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

  constructor(props) {
      super(props);
      this.state = {
          firstLoad: true,                 
          lastModified: null,
          pCode: "",
          productsCode: []
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleTinyMceChange = this.handleTinyMceChange.bind(this);
      this.setInitialValues();
  }

  handleChange(event){
      this.setState({pCode: event.target.value});
  }

  componentWillMount() {
    this.props.resetMe();
  }

  componentDidUpdate() {
    if (this.state.firstLoad) {
      ReactDom.findDOMNode(this).scrollIntoView();
      this.setState({ firstLoad: false });      
    }
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

  setInitialValues() {      
      var initialProductsCode = ["None", "BPI0500000", "BPI0700000"];
      let fetchProducts = this.props.fetchProductsMap();
      var _this = this;      

      fetchProducts.then(function() {
        var removeableProducts = [];
        var productsCode = initialProductsCode;
          
         for(var i = 0; i < productsCode.length; i ++) {         
          for(var j = 0; j < _this.props.activeProducts.product.length; j ++) {              
              if (_this.props.activeProducts.product[j]["product"] &&
                _this.props.activeProducts.product[j]["product"] == productsCode[i]) {               
                removeableProducts.push(productsCode[i]);
                break;
              }
           }
         }
         
         for(var i = 0; i < removeableProducts.length; i ++) {            
            var index = productsCode.indexOf(removeableProducts[i]);            
            if(index != -1) {
              productsCode.splice(index, 1);
            }            
         }

          _this.setState({
            productsCode: productsCode
          });         
      });
  }

  saveInfowin(values, dispatch) {    
      var me = this,
          camPos = values.view ? values.view.cameraPosition : {x:-1600, y:1400, z:-225},
          tarPos = values.view ? values.view.targetPosition : {x:-230, y:380, z:-8000};

      if (!values.productCode || values.productCode == "None")
        values.productCode = "";
      
      //Set camera to current view's coordinates
      window.app3dViewer.viewPosition([camPos.x, camPos.y, camPos.z],[tarPos.x, tarPos.y, tarPos.z]);
      //Generate screenshot and save
      window.app3dViewer.generateScreenshot(240, 180, "image/png", false, "", false)
          .then(function(screenshot) {

              if (!values.view) { 
                values.view = { 
                  screenshot: "_missing.png",
                  cameraPosition: {x: 0, y: 0, z: 0},
                  targetPosition: {x: 0, y: 0, z: 0},
                  onLoadActions: { hide: [], show: [] },
                  mediaAnimatorData: {},
                  mediaAnimatorAutoStart: false
                }
              }
              values.view.screenshot = screenshot;

              let saver = validateAndCreateInfowin(values, dispatch, me.props.parentType, me.props.parentId),
                  router = me.context.router;

              saver.then(() => { 
                  router.push(getParentUrl(me.props.parentId))
              });
          });      
  }
  
  handleTinyMceChange(event) {
  } 
  
  render() {
    const productsCode = this.state.productsCode;
    const {asyncValidating, handleSubmit, pristine, submitting, newInfowin } = this.props;
    const groupsMap = populateObjectsLeft(window.config.groupsMap).map((ob, i) => { return { key: i, value: ob, text: ob, label: ob } });    
    const deviceScreens = deviceScreensOptionsFlattened().map((ob, i) => { return { key: i, value: ob, label: ob } });

    return (
      <div className="container">
        <h1>New Info Window</h1>
        {this.renderError(newInfowin)}
        <form onSubmit={handleSubmit(this.saveInfowin.bind(this))} className="scrollable-content container">

          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title">New infowin</h3></div>
            <div className="panel-body">
              <Field name="title" component={renderInput} type="text" isBig="true" placeholder="Title" label="Title"/>

              <div className="row">
                  <div className="col-sm-5">
                    <Field name="type" component={renderInput} type="text" placeholder="Type" label="Type"/>

                    <Field name="description" component={renderTinyMce} 
                        onBlur={this.handleTinyMceChange} 
                        placeholder="Description" label="Description" rows="3"/>

                    {newInfowin && newInfowin.infowin && 
                    <Field name="defaultForGroups" component={InputDropDownSemanticOne} 
                      value={newInfowin.infowin.defaultForGroups}
                      label="Default for groups" 
                      placeholder="Select groups"
                      options={groupsMap}  />
                    }          

                  </div>
                  <div className="col-sm-7">
                    <Field name="html" component={renderTinyMce} 
                        onBlur={this.handleTinyMceChange} height="300"
                        placeholder="<p>...</p>" label="Html" rows="6"/>
                  </div>
              </div>
              <Field name="css3ObjectPath" component={DeviceScreensComponent}
                  dataArray={deviceScreens}  label="Css3d Object" />
              
              
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title">View</h3></div>
            <div className="panel-body">
              <Field name="view" component={ViewComponent} groupsMap={groupsMap} />
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title">Product Code</h3></div>
            <div className="panel-body">
              <Field name="productCode" component={renderProductSelect} dataArray={productsCode} selectedValue={this.state.pCode} onChange={this.handleChange} /> 
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title">Question</h3></div>
            <div className="panel-body">
              <Field name="questionsObj" component={QuestionComponent}  />
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save Infowin</button>
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

const selector = formValueSelector('infowinsNewForm');

InfowinForm = connect(
  (state, ownProps) => ({
    parentType: ownProps.parentType,
    parentId: ownProps.parentId,
    initialValues: state.infowins.newInfowin.infowin,
    newInfowin: state.infowins.newInfowin, // pull initial values from infowins reducer
    activeProducts: state.infowins.activeProducts, // pull initial values from infowins reducer
  }),
  dispatch => ({
    fetchProductsMap: () => {
      return new Promise((resolve, reject) => {
        dispatch(fetchProductsMap()).then((response) => {
          let data = response.payload.data;  
          if (!response.error) {
            dispatch(fetchProductsMapSuccess(response.payload.data));
            resolve();
          } else {
            dispatch(fetchProductsMapFailure(response.payload));
            reject(data);
          }          
        });
      });
    },      
    resetMe: () => {
      dispatch(resetNewInfowin());
    }
  })
)(InfowinForm);

export default InfowinForm;
