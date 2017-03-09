import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

class Welcome extends Component {
    state = {
        lastModified: ""
    }

    componentWillMount() {
        this.props.fetchCamPos();

        window.__reactApp.WelcomeCallback = (data) => {
            this.props.fetchCamPos();
            this.setState({ lastModified: data });
            return this;  
        };
    }
    
    render() {
        const { data, loading, error } = this.props.data;
        const myTitle = "Welcome to the XPert-World 3D Administration UI";

        if(loading || data.length === 0) {
            return <div className="container"><h1>{myTitle}</h1><h3>Loading...</h3></div>      
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message || ERROR_RESOURCE }</div>
        }        

        return (
            <div className="container pos-rel">
            <div className="view-title">
                <h1>{myTitle}</h1>
            </div>
                <h3>Current camera position</h3>
                <ul className="liVector3">
                    <li>x: {Math.round(data[0].x * 1000) / 1000}</li>
                    <li>y: {Math.round(data[0].y * 1000) / 1000}</li>
                    <li>z: {Math.round(data[0].z * 1000) / 1000}</li>
                </ul>
                <h3>Current Target position</h3>
                <ul className="liVector3">
                    <li>x: {Math.round(data[1].x * 1000) / 1000}</li>
                    <li>y: {Math.round(data[1].y * 1000) / 1000}</li>
                    <li>z: {Math.round(data[1].z * 1000) / 1000}</li>
                </ul>
                <p>(this data will be available at the Edit/New 'View' page)</p>
                <p className="hidden">{this.state.lastModified}</p>
            </div>
        );
    }
}


export default Welcome;