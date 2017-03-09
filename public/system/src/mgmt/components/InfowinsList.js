import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Link, browserHistory } from 'react-router';
import { ERROR_RESOURCE } from '../config.const';
import { ROOT_IMG_URL } from '../config.const';

const worldId = window.config.mainScene.worldId;


class InfowinsList extends Component {

    componentWillMount() {
        this.props.fetchInfowins();      
    }

    componentDidUpdate() {
        if (this.props.infowinsList.loading) {
            ReactDom.findDOMNode(this).scrollIntoView();
        }
    }

    renderInfowins(infowins) {
        return infowins.map((infowin) => {
            return (
                <li className="list-group-item" key={infowin._id}>
                <Link to={"/infowins/world/" + worldId + "/" + infowin._id}>
                    <h3 className="list-group-item-heading">{infowin.title}</h3>
                </Link>
                </li>
            );
        });
    }

    render() {
        const { infowins, loading, error } = this.props.infowinsList;

        if(loading) {
            return <div className="container"><h1>Info Windows</h1><h3>Loading...</h3></div>      
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message || ERROR_RESOURCE }</div>
        }

        return (
            <div className="container pos-rel">
                <div className="view-title">
                    <h1>Info Windows</h1>
                    <Link to={"/infowins/new/world/" + worldId}>+ Add new Info Window</Link>
                </div>
                {this.renderInfowins(infowins)}
            </div>
        );
    }
}


export default InfowinsList;