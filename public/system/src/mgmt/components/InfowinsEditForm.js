import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm, change, submit } from 'redux-form'
import { connect } from 'react-redux';
import {
  fetchInfowin, fetchInfowinSuccess, fetchInfowinwFailure, resetActiveInfowin,
  fetchProductsMap, fetchProductsMapSuccess, fetchProductsMapFailure,
  updateInfowin, updateInfowinSuccess, updateInfowinFailure,
  deleteInfowin, deleteInfowinSuccess, deleteInfowinFailure,
  validateInfowinFields, validateInfowinFieldsSuccess, validateInfowinFieldsFailure
} from '../actions/infowins';
import { validateInfowin } from '../validators/infowinValidator';
import { orderLowercase, populateObjectsLeft } from '../validators/viewValidator';
import { markersSizes } from '../validators/markerValidator';

import { renderInput, renderTextarea, renderSelect, renderObjectSelect } from './inputs/inputs';
import { renderProductSelect } from './inputs/InputFields';
import { renderTinyMce } from './inputs/tinyMce';
import { ModalDelete } from './inputs/modalDelete';
import { ModalSaved } from './inputs/modalSaved';
import { InputDropDownSemantic, InputDropDownSemanticOne } from './inputs/inputsDropdownSem';
import { SortableList } from './inputs/sortableItem';
import { ViewComponent } from './inputs/inputsViewComp';
import { GroupCommands } from './inputs/inputsGroupCmds';
import { QuestionComponent } from './inputs/inputsQuestionComp';
import { getParentUrl } from '../helpers/helpers';
import { deviceScreensOptionsFlattened, DeviceScreensComponent } from './inputs/inputsDeviceScreens';

/* Constants */

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

  constructor(props) {
      super(props);

      this.state = {
          firstLoad: true,
          lastModified: null,
          pCode: "",
          productsCode: [],
          delConfirmOpen: false,
          parentUrl: ""
      }
      this.handleChange = this.handleChange.bind(this); 
      this.handleTinyMceChange = this.handleTinyMceChange.bind(this);
      this.toggleDelConfirmModal = this.toggleDelConfirmModal.bind(this);
      this.saveInfowin = this.saveInfowin.bind(this);
  }

  handleChange(event){
      this.setState({pCode: event.target.value});      
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.infowinId !== this.props.infowinId) {
      this.setState({ parentUrl: "" });
      this.props.fetchInfowin(nextProps.infowinId);
    }
  }
 
  componentDidMount() {  
    this.props.fetchInfowin(this.props.infowinId);
  }
  
  setInitialValues(activeInfowin) {
      var pcode = "";
      var initialProductsCode = ["None", "BPI0500000", "BPI0700000"];

      if (activeInfowin.infowin) {
          pcode = activeInfowin.infowin.productCode ? activeInfowin.infowin.productCode : "";
      } 

      let fetchProducts = this.props.fetchProductsMap();
      var _this = this;

      fetchProducts.then(function() {
        var removeableProducts = [];
        var productsCode = initialProductsCode;

         for(var i = 0; i < productsCode.length; i ++) {          
          for(var j = 0; j < _this.props.activeProducts.product.length; j ++) {
              if (_this.props.activeProducts.product[j]["product"] && 
                _this.props.activeProducts.product[j]["product"] != pcode && 
                _this.props.activeProducts.product[j]["product"] == productsCode[i]) {
                  removeableProducts.push(_this.props.activeProducts.product[j]["product"]);
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

          _this.setState({
            pCode: pcode,
          });           
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.firstLoad || prevProps.infowinId !== this.props.infowinId) {
      ReactDom.findDOMNode(this).scrollIntoView();
      this.setState({ firstLoad: false });
    }
  }

  renderError(activeInfowin) {
    if(activeInfowin && activeInfowin.error && activeInfowin.error.message) {
      return (
        <div className="alert alert-danger">
          {activeInfowin ? activeInfowin.error.message : ''}
        </div>
      );
    } 
    return null;    
  }

  saveInfowin(values, dispatch) {
      var me = this,
          camPos = values.view ? values.view.cameraPosition : {x:-1600, y:1400, z:-225},
          tarPos = values.view ? values.view.targetPosition : {x:-230, y:380, z:-8000};
      
      me.refs.modalSaved.show("Saving...", false);

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
              let saver = validateAndUpdateInfowin(values, dispatch),
                  router = me.context.router;

              saver.then(() => {
                if (!me.state.parentUrl) {
                  me.refs.modalSaved.setLabel("Saved!", true);
                } else {
                  me.refs.modalSaved.dismiss();
                  router.push(me.state.parentUrl)
                }
              });
          });      
  }

  deletethisInfowin() {
    this.toggleDelConfirmModal();

    let me = this,
        deleter = this.props.deleteInfowin(this.props.parentType, this.props.parentId, this.props.infowinId),
        router = this.context.router;

    deleter.then(function(){
        router.push(me.state.parentUrl)
    });
    
  }

  renderMarkers(infowin) {
    if (infowin && infowin.markers && infowin.markers.length > 0) {
      return infowin.markers.map((marker) => {
        return (
          <li className="list-group-item" key={marker._id}>
            <Link to={"/markers/" + infowin._id + "/" + marker._id}>
              <h3 className="list-group-item-heading">{marker.title}</h3>
            </Link>
          </li>
        );          
        
      });
    }
    return null;
  }  

  handleTinyMceChange(event) {
  }

  toggleDelConfirmModal = () => {
    this.setState({
      delConfirmOpen: !this.state.delConfirmOpen
    });
  }

  saveAndGo(nId, values, dispatch) {
    this.setState({ parentUrl: getParentUrl(nId)});
    this.saveInfowin(values, dispatch);
  }

  render() {
    const productsCode = this.state.productsCode;
    const {asyncValidating, handleSubmit, submitting, cloning, activeInfowin, viewsSetsList, productsMap } = this.props;
    const groupsMap = populateObjectsLeft(window.config.groupsMap).map((ob, i) => { return { key: i, value: ob, text: ob, label: ob } });    
    const deviceScreens = deviceScreensOptionsFlattened().map((ob, i) => { return { key: i, value: ob, label: ob } });
    const currInfTree = activeInfowin && activeInfowin.infowin ? window.app3dViewsNav.infoWinsTreeById[activeInfowin.infowin._id] : null;

    if(activeInfowin.loading) {
        return <div className="container"><h1>Edit Infowin</h1><h3>Loading...</h3></div>      
    } 

    return (
      <div className="container">        
        <form onSubmit={handleSubmit(this.saveInfowin)}>
        <div className="view-title">
          <h1>Edit Infowin</h1>
          {activeInfowin.infowin &&
            <Link to={"/infowins/new/infowin/" + activeInfowin.infowin._id}>+ Add New Child Info Window</Link>
          }          
          {activeInfowin.infowin &&
            <Link to={"/markers/new/" + activeInfowin.infowin._id}>+ Add New Marker</Link>
          }

          <div className="btn-group pull-right">
            <button type="submit" className="btn btn-primary" disabled={submitting}><span className="fa fa-save"></span> Save Infowin</button>
            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="caret"></span>
              <span className="sr-only">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu">
              {currInfTree && currInfTree.nextId &&
              <li><a onClick={handleSubmit(this.saveAndGo.bind(this, currInfTree.nextId))}><span className="fa fa-arrow-right"></span> Save &amp; Next</a></li>
              }
              {currInfTree && currInfTree.prevId &&
              <li><a onClick={handleSubmit(this.saveAndGo.bind(this, currInfTree.prevId))}><span className="fa fa-arrow-left"></span> Save &amp; Previous</a></li>
              }
              <li role="separator" className="divider"></li>
              <li><a onClick={handleSubmit(this.toggleDelConfirmModal)}><span className="fa fa-times"></span> Delete this!</a></li>
            </ul>
          </div>

        </div>
        <div className="scrollable-content container">
        {this.renderError(activeInfowin)}
          <div className="panel panel-default">
            <div className="panel-heading">{activeInfowin.infowin ? <h3 className="panel-title">{activeInfowin.infowin.title}</h3> : "loading..."}</div>
            <div className="panel-body">
              <Field name="title" component={renderInput} type="text" isBig="true" placeholder="Title" label="Title"/>

              <div className="row">
                  <div className="col-sm-5">
                    <Field name="type" component={renderInput} type="text" placeholder="Type" label="Type"/>

                    <Field name="description" component={renderTinyMce} 
                        onBlur={this.handleTinyMceChange} height="75"
                        placeholder="Description" label="Description" rows="3"/>

                    {activeInfowin && activeInfowin.infowin && 
                    <Field name="defaultForGroups" component={InputDropDownSemanticOne} 
                      value={activeInfowin.infowin.defaultForGroups}
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
              {activeInfowin && activeInfowin.infowin && 
              <Field name="css3ObjectPath" component={DeviceScreensComponent}
                  dataArray={deviceScreens}  label="Css3d Object" />
              }              
                            
            </div>
          </div>

          {activeInfowin && activeInfowin.infowin && 
          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title">View</h3></div>
            <div className="panel-body">
              <Field name="view" component={ViewComponent} value={activeInfowin.infowin.view} groupsMap={groupsMap} />
            </div>
          </div>
          }

          {activeInfowin && activeInfowin.infowin && 
          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title">Question</h3></div>
            <div className="panel-body">
              <Field name="questionsObj" component={QuestionComponent} value={activeInfowin.infowin.questionsObj} />
            </div>
          </div>
          }        

          {activeInfowin && activeInfowin.infowin && 
          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title">Groups' commands</h3></div>
            <div className="panel-body">
              <Field name="groupCommands" component={GroupCommands} value={activeInfowin.infowin.groupCommands} groupsMap={groupsMap} />
            </div>
          </div>
          }            

          {activeInfowin && activeInfowin.infowin && 
          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title">SCTE Product Code</h3></div>
            <div className="panel-body">
              <Field name="productCode" component={renderProductSelect} dataArray={productsCode} selectedValue={this.state.pCode} onChange={this.handleChange} /> 
            </div>
          </div>
          }

          {activeInfowin && activeInfowin.infowin && activeInfowin.infowin.infowins && activeInfowin.infowin.infowins.length > 0 &&
          <div className="child-infowins children-list form-group">
            <h3>Child Infowins</h3>
            <SortableList data={activeInfowin.infowin.infowins} parentId={activeInfowin.infowin._id} parentType="infowin"/>
          </div>
          }

          {activeInfowin && activeInfowin.infowin &&
          <div className="child-markers children-list form-group">
            <h3>Markers &nbsp;  <small><Link to={"/markers/new/" + activeInfowin.infowin._id}>+ Add New Marker</Link></small></h3>
            <div className="row">
              <div className="col-sm-4">
                <Field name="markerScale" component={renderObjectSelect} withoutNone="true" label="Marker Size" dataArray={markersSizes}  />
              </div>
            </div>
            {this.renderMarkers(activeInfowin.infowin)}
          </div>
          }

        </div>
        </form>
        <ModalDelete show = {this.state.delConfirmOpen}
          onOk = {this.deletethisInfowin.bind(this)}
          onClose = {this.toggleDelConfirmModal}
          activeInfowin = {activeInfowin.infowin}>
        </ModalDelete>
        <ModalSaved ref="modalSaved" label="Data saved!" dismissText="Ok!" />

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
    initialValues: state.infowins.activeInfowin.infowin,
    activeInfowin: state.infowins.activeInfowin, // pull initial values from infowins reducer,
    activeProducts: state.infowins.activeProducts, // pull initial values from infowins reducer
  }),
    (dispatch, ownProps) => ({
    fetchInfowin: (id) => {
      return new Promise((resolve, reject) => {
        dispatch(fetchInfowin(id)).then((response) => {
          let data = response.payload.data;
          if (!response.error) {
            dispatch(fetchInfowinSuccess(response.payload.data));
            resolve();
          } else {
            dispatch(fetchInfowinFailure(response.payload));
            reject(data);
          }
        });
      });
    },
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
    resetMe: () => {
      dispatch(resetActiveInfowin());
    }
  })
)(InfowinsForm);

export default InfowinsForm