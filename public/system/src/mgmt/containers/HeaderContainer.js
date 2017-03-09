import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchViews, resetDeletedView, deleteView, deleteViewSuccess, deleteViewFailure } from '../actions/views';
import Header from '../components/header.js';



function mapStateToProps(state) {
  return { 
    deletedView: state.views.deletedView
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  	 onDeleteClick: () => {
    	dispatch(deleteView(ownProps.viewId, token))
      	.then((response) => {
            !response.error ? dispatch(deleteViewSuccess(response.payload)) : dispatch(deleteViewFailure(response.payload));
          });
  	 },
     resetMe: () =>{
        dispatch(resetDeletedView());
     }
     
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);