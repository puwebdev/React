import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Link, browserHistory } from 'react-router';
import { ERROR_RESOURCE } from '../config.const';
import { ROOT_IMG_URL } from '../config.const';
import { SortableList } from './inputs/sortableItem';
import { Field, reduxForm } from 'redux-form'

const worldId = window.config.mainScene.worldId;

class InfowinsList extends Component {

    constructor(props) {
        super(props);

        this.saveOrder = this.saveOrder.bind(this);
        this.orderChange = this.orderChange.bind(this);

        this.state = {
            orderChanged: true
        }
    }

    componentWillMount() {
        this.props.fetchInfowins();      
    }

    componentDidUpdate() {
        if (this.props.infowinsList.loading) {
            ReactDom.findDOMNode(this).scrollIntoView();
        }
    }

    saveOrder(values, dispatch) {
        const { infowins } = this.props.infowinsList;

        var infowinsNewOrder = {};
        infowins.map(function(obj, index) { infowinsNewOrder[obj._id] = index; } );

        this.props.saveOInfowins(infowinsNewOrder);
        this.setState( {orderChanged: true} );
    }

    orderChange() {
        this.setState( {orderChanged: false} );
    }

    render() {
        const { infowins, loading, error } = this.props.infowinsList;
        const { handleSubmit, pristine, reset, submitting } = this.props

        if(loading) {
            return <div className="container"><h1>Info Windows</h1><h3>Loading...</h3></div>      
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message || ERROR_RESOURCE }</div>
        }

        return (
            <form onSubmit={handleSubmit(this.saveOrder)}>
                <div className="container pos-rel">
                    <div className="view-title">
                        <h1>Info Windows</h1>
                        <Link to={"/infowins/new/world/" + worldId}>+ Add new Info Window</Link>
                        <button type="submit" className="btn btn-primary pull-right" disabled={this.state.orderChanged}><span className="fa fa-save"></span> Save Order </button>
                    </div>
                    <SortableList data={infowins} parentId={worldId} parentType="world" orderChange={this.orderChange}/>
                </div>
            </form>
        );
    }
}

InfowinsList = reduxForm({
  form: 'infowinsSaveOrderForm',
  enableReinitialize: true,
})(InfowinsList);

export default InfowinsList;