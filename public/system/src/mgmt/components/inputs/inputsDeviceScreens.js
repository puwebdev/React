"use strict"; 

import React, { Component, PropTypes } from 'react';
import { orderLowercase } from '../../helpers/helpers';
import { getOptions } from './inputs';

export const deviceScreensOptionsFlattened = () => {
    let ds = window.config.deviceScreens,
        optionsArray = [];

    _.each(ds, (obKey, key) => {
        _.each(obKey, (obSubkey, subkey) => {
            _.each(obSubkey.locations, (loc, locKey) => {
                optionsArray.push(`${key}_____${subkey}_____${locKey}`);
            });
        });
    });

    return optionsArray.sort(orderLowercase);
}

export class DeviceScreensComponent extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            key: props.input.value ? props.input.value.key : "",
            subkey: props.input.value ? props.input.value.subkey : "",
            location: props.input.value ? props.input.value.location : ""
        };

        this.onChangeSelect = this.onChangeSelect.bind(this);
    }

    updateState(props) {
        this.setState(Object.assign({}, this.state, props.input.value));
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps);        
    }    

    onChangeSelect(ev) {
        let st = Object.assign({}, this.state),
            dpdvals = ev.target.value ? ev.target.value.split("_____") : ["","",""];

        st.key = dpdvals[0];
        st.subkey = dpdvals[1];
        st.location = dpdvals[2];

        this.setState(st);
        this.props.input.onChange(st);
    }    

    render() {
        const currVal = this.state.key && this.state.subkey && this.state.location ? 
            `${this.state.key}_____${this.state.subkey}_____${this.state.location}`
            : "";

        return(
            <div className="row">
              <div className="col-sm-12">
                    <div className="form-group">
                        <label className="control-label">{this.props.label}</label>
                        <select 
                            value={currVal} 
                            onChange={this.onChangeSelect} className="form-control">
                            
                            <option value="">(None)</option>
                            {this.props.dataArray && getOptions(this.props.dataArray, null)}

                        </select>
                    </div>
              </div>
            </div>
        )
    }


}