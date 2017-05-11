import React, { Component, PropTypes } from 'react';
import { renderInput, renderTextarea, renderSelect, renderObjectSelect, getOptions } from './inputs';
import { populateObjectsLeft, orderLowercase } from '../helpers/objectHelpers';
import { RenderTinyMceNoField } from './tinyMce';

export class GrpCmdsGotoInfowin extends Component {
    render() {
        const gearsToSelect = [{ value: "", label: "- please select a group -"}].concat(this.props.groupsList);
        const infowinsList = [{ value: "goNext", label: "> go Next"}, { value: "goPrev", label: "< go Previous"}].concat(this.props.infowinsList);
        return(
            <div className="groups-cmd groups-cmd-alert">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>Alert overlay</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-down" aria-hidden="true"></i></span>
                                    <select name={`target_${this.props.index}`} className="form-control" value={this.props.value.target} onChange={this.props.onChange}>
                                        {gearsToSelect && getOptions(gearsToSelect)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-eye" aria-hidden="true" title="Infowin"></i></span>
                                    <select name={`goto_${this.props.index}`} className="form-control" value={this.props.value.goto} onChange={this.props.onChange}>
                                        {infowinsList && getOptions(infowinsList)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <button type="button" className="btn btn-xs btn-warning btn-setbelow" onClick={() => this.props.onDeleteRow(this.props.index)}><i className="fa fa-trash-o"> REMOVE</i></button>
                    </div>
                </div>        
            </div>
        )
    }
}

export class GrpCmdsAlert extends Component {
    render() {
        const gearsToSelect = [{ value: "", label: "- please select a group -"}].concat(this.props.groupsList);
        const infowinsList = [{ value: "", label: "(none)"}, { value: "goNext", label: "> go Next"}, { value: "goPrev", label: "< go Previous"}].concat(this.props.infowinsList);
        return(
            <div className="groups-cmd groups-cmd-alert">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>Alert overlay</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-down" aria-hidden="true"></i></span>
                                    <select name={`target_${this.props.index}`} className="form-control" value={this.props.value.target} onChange={this.props.onChange}>
                                        {gearsToSelect && getOptions(gearsToSelect)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-times" aria-hidden="true" title="Dismiss text"></i></span>
                                    <input type="text" name={`dismissText_${this.props.index}`} placeholder="Dismiss text: Got it!, Ok!, ..." className="form-control" value={this.props.value.dismissText} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <RenderTinyMceNoField name={`html_${this.props.index}`} value={this.props.value.html}
                                    onChange={this.props.onChange} label="Feedback" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="control-label">On dismiss goto infowin</label>
                                    <div>
                                        <select name={`goto_${this.props.index}`} className="form-control" value={this.props.value.goto} onChange={this.props.onChange}>
                                            {infowinsList && getOptions(infowinsList)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <button type="button" className="btn btn-xs btn-warning btn-setbelow" onClick={() => this.props.onDeleteRow(this.props.index)}><i className="fa fa-trash-o"> REMOVE</i></button>
                    </div>
                </div>        
            </div>
        )
    }
}

export class GrpCmdsObjVisHigh extends Component {
    render() {
        const gearsToSelect = [{ value: "", label: "- please select a group -"}].concat(this.props.groupsList);
        const allGears = [{ value: "", label: "(self group)"}].concat(this.props.groupsList);
        return(
            <div className="groups-cmd groups-cmd-vishig">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>3D Group of Objects, visual state</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-down" aria-hidden="true"></i></span>
                                    <select name={`target_${this.props.index}`} className="form-control" value={this.props.value.target} onChange={this.props.onChange}>
                                        {gearsToSelect && getOptions(gearsToSelect)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-right" aria-hidden="true"></i></span>
                                    <select name={`action_${this.props.index}`} className="form-control" value={this.props.value.action} onChange={this.props.onChange}>
                                        <option value="show">Show</option>
                                        <option value="hide">Hide</option>
                                        <option value="highlight">Highlight</option>
                                        <option value="highlightOff">Hihglight Off</option>
                                        <option value="flash">Flash (5 on/off)</option>
                                        <option value="blink">Start blinking</option>
                                        <option value="blinkOff">Stop blinking</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-cogs" aria-hidden="true"></i></span>
                                    <select name={`src_${this.props.index}`} className="form-control" value={this.props.value.src} onChange={this.props.onChange}>
                                        {allGears && getOptions(allGears)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <button type="button" className="btn btn-xs btn-warning btn-setbelow" onClick={() => this.props.onDeleteRow(this.props.index)}><i className="fa fa-trash-o"> REMOVE</i></button>
                    </div>
                </div>        
            </div>
        )
    }
}

export class GrpCmdsObjPosRel extends Component {
    render() {
        const gearsToSelect = [{ value: "", label: "- please select a group -"}].concat(this.props.groupsList);
        const allGears = [{ value: "", label: "(self group)"}].concat(this.props.groupsList);
        return(
            <div className="groups-cmd groups-cmd-posrel">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>3D Group of Objects, Change <em className="emphh">relative</em> position</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-down" aria-hidden="true"></i></span>
                                    <select name={`target_${this.props.index}`} className="form-control" value={this.props.value.target} onChange={this.props.onChange}>
                                        {gearsToSelect && getOptions(gearsToSelect)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-arrow-right" aria-hidden="true" title="Duration (in seconds)"></i></span>
                                    <input type="number" name={`duration_${this.props.index}`} value={this.props.value.duration} className="form-control" placeholder="Duration (in seconds)" onChange={this.props.onChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-location-arrow" aria-hidden="true" title="Position"></i> x</span>
                                    <input type="text" name={`position.x_${this.props.index}`} className="form-control" value={this.props.value.position.x} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-location-arrow" aria-hidden="true" title="Position"></i> y</span>
                                    <input type="text" name={`position.y_${this.props.index}`} className="form-control" value={this.props.value.position.y} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-location-arrow" aria-hidden="true" title="Position"></i> z</span>
                                    <input type="text" name={`position.z_${this.props.index}`} className="form-control" value={this.props.value.position.z} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>                        
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-cogs" aria-hidden="true"></i></span>
                                    <select name={`src_${this.props.index}`} className="form-control" value={this.props.value.src} onChange={this.props.onChange}>
                                        {allGears && getOptions(allGears)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-right" aria-hidden="true"></i></span>
                                    <select name={`action_${this.props.index}`} className="form-control" value={this.props.value.action} onChange={this.props.onChange}>
                                        <option value="set">Set (immediately)</option>
                                        <option value="animate">Animate (->duration)</option>
                                        <option value="animateRevert">Animate and revert (->duration)</option>
                                    </select>
                                </div>
                            </div>                            
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <button type="button" className="btn btn-xs btn-warning btn-setbelow" onClick={() => this.props.onDeleteRow(this.props.index)}><i className="fa fa-trash-o"> REMOVE</i></button>
                    </div>
                </div>        
            </div>
        )
    }
}

export class GrpCmdsObjRotation extends Component {
    render() {
        const gearsToSelect = [{ value: "", label: "- please select a group -"}].concat(this.props.groupsList);
        const allGears = [{ value: "", label: "(self group)"}].concat(this.props.groupsList);
        return(
            <div className="groups-cmd groups-cmd-posrel">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>3D Group of Objects, Change <em className="emphh">rotation</em> </h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-down" aria-hidden="true"></i></span>
                                    <select name={`target_${this.props.index}`} className="form-control" value={this.props.value.target} onChange={this.props.onChange}>
                                        {gearsToSelect && getOptions(gearsToSelect)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-arrow-right" aria-hidden="true" title="Duration (in seconds)"></i></span>
                                    <input type="number" name={`duration_${this.props.index}`} value={this.props.value.duration} className="form-control" placeholder="Duration (in seconds)" onChange={this.props.onChange}/>
                                </div>
                            </div>
                        </div>                                           
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-repeat" aria-hidden="true" title="Rotation"></i> x</span>
                                    <input type="text" name={`rotation.x_${this.props.index}`} className="form-control" value={this.props.value.rotation.x} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-repeat" aria-hidden="true" title="Rotation"></i> y</span>
                                    <input type="text" name={`rotation.y_${this.props.index}`} className="form-control" value={this.props.value.rotation.y} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-repeat" aria-hidden="true" title="Rotation"></i> z</span>
                                    <input type="text" name={`rotation.z_${this.props.index}`} className="form-control" value={this.props.value.rotation.z} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>                        
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-cogs" aria-hidden="true"></i></span>
                                    <select name={`src_${this.props.index}`} className="form-control" value={this.props.value.src} onChange={this.props.onChange}>
                                        {allGears && getOptions(allGears)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-right" aria-hidden="true"></i></span>
                                    <select name={`action_${this.props.index}`} className="form-control" value={this.props.value.action} onChange={this.props.onChange}>
                                        <option value="set">Set (immediately)</option>
                                        <option value="animate">Animate (->duration)</option>
                                        <option value="animateRevert">Animate and revert (->duration)</option>
                                    </select>
                                </div>
                            </div>                            
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <button type="button" className="btn btn-xs btn-warning btn-setbelow" onClick={() => this.props.onDeleteRow(this.props.index)}><i className="fa fa-trash-o"> REMOVE</i></button>
                    </div>
                </div>        
            </div>
        )
    }
}

export class GrpCmdsCamera extends Component {   
    render() {
        const gearsToSelect = [{ value: "", label: "- please select a group -"}].concat(this.props.groupsList);
        
        return(
            <div className="groups-cmd groups-cmd-camera">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>Camera movement</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-down" aria-hidden="true"></i></span>
                                    <select name={`target_${this.props.index}`} className="form-control" value={this.props.value.target} onChange={this.props.onChange}>
                                        {gearsToSelect && getOptions(gearsToSelect)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-arrow-right" aria-hidden="true" title="Duration (in seconds)"></i></span>
                                    <input type="number" name={`duration_${this.props.index}`} value={this.props.value.duration} className="form-control" placeholder="Duration (in seconds)" onChange={this.props.onChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> x</span>
                                    <input type="text" name={`cameraPosition.x_${this.props.index}`} className="form-control" value={this.props.value.cameraPosition.x} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> y</span>
                                    <input type="text" name={`cameraPosition.y_${this.props.index}`} className="form-control" value={this.props.value.cameraPosition.y} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> z</span>
                                    <input type="text" name={`cameraPosition.z_${this.props.index}`} className="form-control" value={this.props.value.cameraPosition.z} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> x</span>
                                    <input type="text" name={`targetPosition.x_${this.props.index}`} className="form-control" value={this.props.value.targetPosition.x} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> y</span>
                                    <input type="text" name={`targetPosition.y_${this.props.index}`} className="form-control" value={this.props.value.targetPosition.y} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> z</span>
                                    <input type="text" name={`targetPosition.z_${this.props.index}`} className="form-control" value={this.props.value.targetPosition.z} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="col-sm-2">
                        <button type="button" className="btn btn-xs btn-warning btn-setbelow" onClick={() => this.props.onDeleteRow(this.props.index)}><i className="fa fa-trash-o"> REMOVE</i></button><br />
                        <button type="button" className="btn btn-xs btn-info btn-setbelow" onClick={() => this.props.onCurrentCamera(this.props.index)}><i className="fa fa-map-marker"> CURRENT CAMERA</i></button>
                    </div>
                </div>        
            </div>
        )
    }
}

export class GrpCmdsAudio extends Component {
    render() {
        const gearsToSelect = [{ value: "", label: "- please select a group -"}].concat(this.props.groupsList);
        return(
            <div className="groups-cmd groups-cmd-audio">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>Audio</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-down" aria-hidden="true"></i></span>
                                    <select name={`target_${this.props.index}`} className="form-control" value={this.props.value.target} onChange={this.props.onChange}>
                                        {gearsToSelect && getOptions(gearsToSelect)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-music" aria-hidden="true"></i></span>
                                    <input type="text" name={`src_${this.props.index}`} value={this.props.value.src} className="form-control" placeholder="Paste here the mp3 file path" onChange={this.props.onChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <button type="button" className="btn btn-xs btn-warning btn-setbelow" onClick={() => this.props.onDeleteRow(this.props.index)}><i className="fa fa-trash-o"> REMOVE</i></button>
                    </div>
                </div>        
            </div>
        )
    }
}


export class GroupCommands extends Component {

    constructor(props) {
      super(props);

      let cmds = props.input.value && Array.isArray(props.input.value) ? props.input.value.sort(orderLowercase) : []
      this.state = {cmds: cmds, keyMax: cmds.length};

      this.onChangeFields = this.onChangeFields.bind(this); 
      this.onDeleteRow = this.onDeleteRow.bind(this); 
      this.setCurrentCameraPosValues = this.setCurrentCameraPosValues.bind(this); 
    }

    updateState(props) {
      let cmds = props.input.value && Array.isArray(props.input.value) ? props.input.value.sort(orderLowercase) : []
      this.setState({cmds: cmds, keyMax: cmds.length});
    }

    componentWillReceiveProps(nextProps) {
      this.updateState(nextProps);        
    }

    addAlert() {
        this.addComponent("alert");
    }

    addGotoInfowin() {
        this.addComponent("gotoInfowin");
    }

    addAudio() {
        this.addComponent("audio");
    }

    addCamera() {
        this.addComponent("camera");
    }    

    add3DObjectState() {
        this.addComponent("3dObjectState");
    }

    add3dObjectPosition() {
        this.addComponent("3dObjectPosition");
    }

    add3dObjectRotation() {
        this.addComponent("3dObjectRotation");
    }

    setCurrentCameraPosValues(ev) {
        const cmds = this.state.cmds;
        if (isNaN(ev) || ev < 0 || ev >= cmds.length) { return; }

        let animsEv = Object.assign({}, cmds[ev], window.app3dViewer.viewPositionObjs(3));
        cmds.splice(ev, 1, animsEv);
        this.setState({ cmds: cmds });        
    }    

    addComponent(type) {
        let key = this.state.keyMax + 1,
            cmds = Object.assign([], this.state.cmds),
            myObj;

        switch(type) {
            case "alert": 
                myObj = { target: "", type: "alert", html: "", dismissText: "", goto: "" };
                break;
            case "gotoInfowin": 
                myObj = { target: "", type: "gotoInfowin", goto: "" };
                break;
            case "audio": 
                myObj = { target: "", type: "audio", src: "" };
                break;
            case "3dObjectState": 
                myObj = { target: "", src: "", type: "3dObjectState", action:"show" };
                break;
            case "3dObjectPosition": 
                myObj = { target: "", duration:1, src: "", type: "3dObjectPosition", action:"set",
                            position: {x:0, y:0, z:0}
                        };
                break;
            case "3dObjectRotation": 
                myObj = { target: "", duration:1, src: "", type: "3dObjectRotation", action:"set",
                            rotation: {x:0, y:0, z:0}
                        };
                break;
            case "camera": 
                myObj = { target: "", duration: 5, type: "camera", label:"",
                            cameraPosition: {x:"", y:"", z:""},
                            targetPosition: {x:"", y:"", z:""}
                        };
                break;
        }

        if (!myObj) { return; }
        cmds.push(myObj);

        this.setState({
            keyMax: key,
            cmds: cmds
        });
        
    }

    onChangeFields(ev) {
        let target = ev.target,
            name = target ? target.getAttribute("name") : ev.name,
            value = target ? target.value : ev.value,
            parts = name.split("_"),
            propertyChain;

        const cmds = Object.assign([], this.state.cmds),
            index = Number(parts[1]);

        value = !isNaN(value) ? Number(value) : value;

        propertyChain = parts[0].indexOf(".") >= 0 ? parts[0].split("."): [parts[0]];

        switch (propertyChain.length) {
            case 1:
                cmds[index][propertyChain[0]] = value;
                break;
            case 2:
                cmds[index][propertyChain[0]][propertyChain[1]] = value;
                break;
            case 3:
                cmds[index][propertyChain[0]][propertyChain[1]][propertyChain[2]] = value;
                break;
            default:
                return;
        }
        
        this.setState({ cmds: cmds });
        this.props.input.onChange(cmds);
    }

    onDeleteRow(ev) {
        const cmds = Object.assign([], this.state.cmds);
        if (isNaN(ev) || ev < 0 || ev >= cmds.length) { return; }

        if (!window.confirm("Are you sure to remove this?\n(" + ev + ")")) { return; }

        cmds.splice(ev, 1);
        this.setState({ cmds: cmds });        
        this.props.input.onChange(cmds);
    }

    render() {
        let me = this;
        const cmds = this.state.cmds || [];
        const groupsList = this.props.groupsMap;
        const infowinsList = window.app3dViewsNav.infoWinsTreeArray.map((ob, i) => {
            let dashes = "-----------".substring(0, ob.___level);
            return { 
                key: i, 
                value: ob._id, 
                label: dashes + ob.title
            }
        });

        const elements = cmds.map(function(myObj, key){
            switch(myObj.type) {
                case "alert":
                    return(
                        <GrpCmdsAlert key={key} index={key} value={myObj} groupsList={groupsList} infowinsList={infowinsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "gotoInfowin":
                    return(
                        <GrpCmdsGotoInfowin key={key} index={key} value={myObj} groupsList={groupsList} infowinsList={infowinsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "audio":
                    return(
                        <GrpCmdsAudio key={key} index={key} value={myObj} groupsList={groupsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "camera":
                    let myObj2 = Object.assign({}, myObj);
                    if (!myObj2.label) { myObj2.label = "";} 
                    return(
                        <GrpCmdsCamera key={key} index={key} value={myObj2} onCurrentCamera={me.setCurrentCameraPosValues} groupsList={groupsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "3dObjectState": 
                    return(
                        <GrpCmdsObjVisHigh key={key} index={key} value={myObj} groupsList={groupsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "3dObjectPosition": 
                    return(
                        <GrpCmdsObjPosRel key={key} index={key} value={myObj} groupsList={groupsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "3dObjectRotation": 
                    return(
                        <GrpCmdsObjRotation key={key} index={key} value={myObj} groupsList={groupsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
            }
        });

        return(
            <div>
                <div>
                {elements}
                </div>
                <div className="add-buttons-media">
                    <button type="button" onClick={this.addAlert.bind(this)} className="btn btn-sm btn-success">Add alert</button>
                    <span> &nbsp; </span> 
                    <button type="button" onClick={this.addGotoInfowin.bind(this)} className="btn btn-sm btn-success">Add goto Infowin</button>
                    <span> &nbsp; </span> 
                    <button type="button" onClick={this.addAudio.bind(this)} className="btn btn-sm btn-success">Add audio track</button>
                    <span> &nbsp; </span> 
                    <button type="button" onClick={this.addCamera.bind(this)} className="btn btn-sm btn-success">Add camera movement</button>
                    <span> &nbsp; </span> 
                    <button type="button" onClick={this.add3DObjectState.bind(this)} className="btn btn-sm btn-success">Add 3D group state</button>
                    <span> &nbsp; </span> 
                    <button type="button" onClick={this.add3dObjectPosition.bind(this)} className="btn btn-sm btn-success">Add 3D group RELATIVE position</button>
                    <span> &nbsp; </span> 
                    <button type="button" onClick={this.add3dObjectRotation.bind(this)} className="btn btn-sm btn-success">Add 3D group rotation</button>
                </div>
            </div>
        )
    }
}