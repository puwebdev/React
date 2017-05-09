"use strict"; 

import React, { Component, PropTypes } from 'react';
import { populateObjectsLeft, populateObjectsRight } from '../../validators/viewValidator';
import { InputDropDownSemanticShowHide } from './inputsDropdownSem';
import { MediaAnimObjects } from './inputsMediaAnim';
import { getOptions } from './inputs';

import { ROOT_IMG_URL } from '../../config.const';


export class ViewComponent extends Component {

    constructor(props) {
        super(props);

        this.state = Object.assign({ 
            screenshot: "_missing.png",
            cameraPosition: {x: 0, y: 0, z: 0},
            targetPosition: {x: 0, y: 0, z: 0},
            onLoadActions: { hide: [], show: [] },
            mediaAnimatorData: {},
            mediaAnimatorAutoStart: false
        }, props.input.value);

        this.updateWithCurrCamCoords = this.updateWithCurrCamCoords.bind(this); 
        this.onChangeFields = this.onChangeFields.bind(this); 
        this.onChangeMediaAnimatorData = this.onChangeMediaAnimatorData.bind(this);
        this.onChangeLoadActions = this.onChangeLoadActions.bind(this);
    }

    updateState(props) {
        this.setState(Object.assign({}, this.state, props.input.value));
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps);        
    }

    onChangeFields(ev) {
        let name = ev.target.getAttribute("name"),
            propertyChain,
            value = !isNaN(ev.target.value) ? Number(ev.target.value) : ev.target.value,
            st = Object.assign({}, this.state);
        
        propertyChain = name.indexOf(".") >= 0 ? name.split("."): [name];

        switch (propertyChain.length) {
            case 1:
                st[propertyChain[0]] = value;
                break;
            case 2:
                st[propertyChain[0]][propertyChain[1]] = value;
                break;
            case 3:
                st[propertyChain[0]][propertyChain[1]][propertyChain[2]] = value;
                break;
            default:
                return;
        }
        
        this.setState(st);
        this.props.input.onChange(st);
    }

    onChangeMediaAnimatorData(ev) {
        let st = Object.assign({}, this.state);
        st.mediaAnimatorData = ev;

        this.setState(st);
        this.props.input.onChange(st);
    }

    onChangeLoadActions(ev) {
        let st = Object.assign({}, this.state);
        st.onLoadActions = ev;
        
        this.setState(st);
        this.props.input.onChange(st);
    }

    updateWithCurrCamCoords() {
        let camCoords = window.app3dViewer.viewPositionObjs(3),
            st = Object.assign({}, this.state);
        
        st.cameraPosition = camCoords.cameraPosition;
        st.targetPosition = camCoords.targetPosition;
        
        this.setState(st);
        this.props.input.onChange(st);        
    }    

    render() {        
        const groupsMap = this.props.groupsMap;
        const autoStartSelections = [{ label: 'Auto-start', value: true }, { label: 'Do not auto-start', value: false }];
        const screenshot = this.state.screenshot;

        return(
            <div>
                <div className="row">
                    <div className="col-sm-3">
                        { screenshot &&
                        <div className="form-group">
                            <img src={screenshot.indexOf("data:image") === 0 ? screenshot : `${ROOT_IMG_URL}${screenshot}`} />
                        </div>
                        }
                    </div>
                    <div className="col-sm-9">
                        <div className="camera-data">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> x</span>
                                        <input type="text" name="cameraPosition.x" className="form-control" value={this.state.cameraPosition.x} onChange={this.onChangeFields} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> y</span>
                                        <input type="text" name="cameraPosition.y" className="form-control" value={this.state.cameraPosition.y} onChange={this.onChangeFields} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> z</span>
                                        <input type="text" name="cameraPosition.z" className="form-control" value={this.state.cameraPosition.z} onChange={this.onChangeFields} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> x</span>
                                        <input type="text" name="targetPosition.x" className="form-control" value={this.state.targetPosition.x} onChange={this.onChangeFields} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> y</span>
                                        <input type="text" name="targetPosition.y" className="form-control" value={this.state.targetPosition.y} onChange={this.onChangeFields} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> z</span>
                                        <input type="text" name="targetPosition.z" className="form-control" value={this.state.targetPosition.z} onChange={this.onChangeFields} />
                                    </div>
                                </div>
                            </div>

                            <button type="button" onClick={() => this.updateWithCurrCamCoords()}
                                className="btn btn-info btn-sm" ><i className="fa fa-map-marker"></i> Update fields w/ current camera/target</button>
                        </div>
                    </div>
                </div>

                <div className="children-list mgmt-load-unload form-group">
                    <InputDropDownSemanticShowHide name="onLoadActions" value={this.state.onLoadActions} label="On-Load" 
                        options={groupsMap} placeholder="Select 3d Groups" onChange={this.onChangeLoadActions} />
                </div>

                <div className="children-list form-group">
                    <div className="form-group">
                        <label className="control-label">Auto-start animation</label>
                        <div>
                            <select name="mediaAnimatorAutoStart" 
                                onChange={this.onChangeFields}
                                value={this.state.mediaAnimatorAutoStart}
                                className="form-control">
                                {autoStartSelections && getOptions(autoStartSelections, null)}
                            </select>
                        </div>
                    </div>

                    <MediaAnimObjects name="mediaAnimatorData" 
                        value={this.state.mediaAnimatorData} groupsMap={groupsMap}
                        onChange={this.onChangeMediaAnimatorData} />
                </div>
            </div>
        )
    }
}