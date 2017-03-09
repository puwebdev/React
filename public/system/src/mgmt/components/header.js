import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';


class Header extends Component {
    /*static contextTypes = {
        router: PropTypes.object
    };*/
 
    renderLinks() {
        const { type, authenticatedUser } = this.props;

        return (
            <div className="container">
            <ul className="nav nav-pills navbar-left">
                <li className="ui-title">XPert-World Admin</li>
                <li role="presentation">      
                    <Link to="/"><span className="fa fa-home"></span></Link>
                </li>
                <li role="presentation">      
                    <Link to="/viewsSets" activeClassName="active"><span className="fa fa-eye"></span> Views-Sets</Link>
                </li>
                <li role="presentation">      
                    <Link to="/infowins" activeClassName="active"><span className="fa fa-info-circle"></span> Info Windows</Link>
                </li>
                <li role="presentation">      
                    <Link to="/gearmap" activeClassName="active"><span className="fa fa-cogs"></span> Gear-Map</Link>
                </li>
            </ul>
        </div>
            );
    };

    render() {
            return (
                <nav className="navbar navbar-default navbar-static-top">
                    <div id="navbar" className="navbar-collapse collapse">
                    {this.renderLinks()}
                </div>     
                </nav>				
            );
    }
}

export default Header