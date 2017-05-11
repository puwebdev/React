import React, { Component, PropTypes } from 'react';
import { renderInput, renderTextarea, renderSelect, renderObjectSelect, getOptions } from './inputs';
import { populateObjectsLeft } from '../../validators/viewValidator';

export class MediaAnimTiming extends Component {
    constructor(props) {
        super(props);
        this.state = { value: props.value || 0};
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        this.setState({ value: ev.target.value });
    }

    render() {
        return(
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-clock-o" aria-hidden="true" title="Starts at (seconds)"></i></span>
                <input type="number" name={this.props.name} className="form-control" value={this.state.value} onChange={this.onChange} onBlur={this.props.onChange} />
            </div>
        )
    }
}

export class MediaAnimObjVisHigh extends Component {
    render() {
        const allGears = [{ value: "", label: "(none)"}].concat(this.props.groupsList);
        return(
            <div className="media-anim media-anim-vishig">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>3D Group of Objects, visual state</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <MediaAnimTiming name={`timing/${this.props.index}`} index={this.props.index} value={this.props.value.timing} onChange={this.props.onChange} />
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-right" aria-hidden="true"></i></span>
                                    <select name={`action/${this.props.index}`} className="form-control" value={this.props.value.action} onChange={this.props.onChange}>
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
                                    <select name={`src/${this.props.index}`} className="form-control" value={this.props.value.src} onChange={this.props.onChange}>
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

export class MediaAnimObjPosRel extends Component {
    render() {
        const allGears = [{ value: "", label: "(none)"}].concat(this.props.groupsList);
        return(
            <div className="media-anim media-anim-posrel">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>3D Group of Objects, Change <em className="emphh">relative</em> position</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <MediaAnimTiming name={`timing/${this.props.index}`} index={this.props.index} value={this.props.value.timing} onChange={this.props.onChange} />
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-arrow-right" aria-hidden="true" title="Duration (in seconds)"></i></span>
                                    <input type="number" name={`duration/${this.props.index}`} value={this.props.value.duration} className="form-control" placeholder="Duration (in seconds)" onChange={this.props.onChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-location-arrow" aria-hidden="true" title="Position"></i> x</span>
                                    <input type="text" name={`position.x/${this.props.index}`} className="form-control" value={this.props.value.position.x} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-location-arrow" aria-hidden="true" title="Position"></i> y</span>
                                    <input type="text" name={`position.y/${this.props.index}`} className="form-control" value={this.props.value.position.y} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-location-arrow" aria-hidden="true" title="Position"></i> z</span>
                                    <input type="text" name={`position.z/${this.props.index}`} className="form-control" value={this.props.value.position.z} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>                        
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-cogs" aria-hidden="true"></i></span>
                                    <select name={`src/${this.props.index}`} className="form-control" value={this.props.value.src} onChange={this.props.onChange}>
                                        {allGears && getOptions(allGears)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-right" aria-hidden="true"></i></span>
                                    <select name={`action/${this.props.index}`} className="form-control" value={this.props.value.action} onChange={this.props.onChange}>
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

export class MediaAnimObjRotation extends Component {
    render() {
        const allGears = [{ value: "", label: "(none)"}].concat(this.props.groupsList);
        return(
            <div className="media-anim media-anim-posrel">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>3D Group of Objects, Change <em className="emphh">rotation</em> </h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <MediaAnimTiming name={`timing/${this.props.index}`} index={this.props.index} value={this.props.value.timing} onChange={this.props.onChange} />
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-arrow-right" aria-hidden="true" title="Duration (in seconds)"></i></span>
                                    <input type="number" name={`duration/${this.props.index}`} value={this.props.value.duration} className="form-control" placeholder="Duration (in seconds)" onChange={this.props.onChange}/>
                                </div>
                            </div>
                        </div>                                           
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-repeat" aria-hidden="true" title="Rotation"></i> x</span>
                                    <input type="text" name={`rotation.x/${this.props.index}`} className="form-control" value={this.props.value.rotation.x} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-repeat" aria-hidden="true" title="Rotation"></i> y</span>
                                    <input type="text" name={`rotation.y/${this.props.index}`} className="form-control" value={this.props.value.rotation.y} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-repeat" aria-hidden="true" title="Rotation"></i> z</span>
                                    <input type="text" name={`rotation.z/${this.props.index}`} className="form-control" value={this.props.value.rotation.z} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>                        
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-cogs" aria-hidden="true"></i></span>
                                    <select name={`src/${this.props.index}`} className="form-control" value={this.props.value.src} onChange={this.props.onChange}>
                                        {allGears && getOptions(allGears)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-hand-o-right" aria-hidden="true"></i></span>
                                    <select name={`action/${this.props.index}`} className="form-control" value={this.props.value.action} onChange={this.props.onChange}>
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

export class MediaAnimCamera extends Component {   
    render() {
        return(
            <div className="media-anim media-anim-camera">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>Camera movement</h4>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="input-group input-group-sm has-warning">
                                    <span className="input-group-addon"><i className="fa fa-tag" aria-hidden="true" title="Label"></i></span>
                                    <input type="text" name={`label/${this.props.index}`} className="form-control" placeholder="optional label..." value={this.props.value.label} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <MediaAnimTiming name={`timing/${this.props.index}`} index={this.props.index} value={this.props.value.timing} onChange={this.props.onChange} />
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-arrow-right" aria-hidden="true" title="Duration (in seconds)"></i></span>
                                    <input type="number" name={`duration/${this.props.index}`} value={this.props.value.duration} className="form-control" placeholder="Duration (in seconds)" onChange={this.props.onChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> x</span>
                                    <input type="text" name={`cameraPosition.x/${this.props.index}`} className="form-control" value={this.props.value.cameraPosition.x} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> y</span>
                                    <input type="text" name={`cameraPosition.y/${this.props.index}`} className="form-control" value={this.props.value.cameraPosition.y} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-camera" aria-hidden="true" title="Camera position"></i> z</span>
                                    <input type="text" name={`cameraPosition.z/${this.props.index}`} className="form-control" value={this.props.value.cameraPosition.z} onChange={this.props.onChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> x</span>
                                    <input type="text" name={`targetPosition.x/${this.props.index}`} className="form-control" value={this.props.value.targetPosition.x} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> y</span>
                                    <input type="text" name={`targetPosition.y/${this.props.index}`} className="form-control" value={this.props.value.targetPosition.y} onChange={this.props.onChange} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-bullseye" aria-hidden="true" title="Target position"></i> z</span>
                                    <input type="text" name={`targetPosition.z/${this.props.index}`} className="form-control" value={this.props.value.targetPosition.z} onChange={this.props.onChange} />
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

export class MediaAnimAudio extends Component {
    render() {
        return(
            <div className="media-anim media-anim-audio">
                <div className="row">
                    <div className="col-sm-10">
                        <h4>Audio</h4>
                        <div className="row">
                            <div className="col-sm-6">
                                <MediaAnimTiming name={`timing/${this.props.index}`} index={this.props.index} value={this.props.value.timing} onChange={this.props.onChange} />
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-music" aria-hidden="true"></i></span>
                                    <input type="text" name={`src/${this.props.index}`} value={this.props.value.src} className="form-control" placeholder="Paste here the mp3 file path" onChange={this.props.onChange}/>
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

const orderMediaAnimObjects = (a, b) => { 
    return Number(a.timing) > Number(b.timing) ? 1 : -1;
}

export class MediaAnimObjects extends Component {

    constructor(props) {
      super(props);

      let anims = props.value && Array.isArray(props.value) ? props.value.sort(orderMediaAnimObjects) : []
      this.state = {anims: anims, keyMax: anims.length};

      this.onChangeFields = this.onChangeFields.bind(this); 
      this.onDeleteRow = this.onDeleteRow.bind(this); 
      this.setCurrentCameraPosValues = this.setCurrentCameraPosValues.bind(this); 
    }

    updateState(props) {
      let anims = props.value && Array.isArray(props.value) ? props.value.sort(orderMediaAnimObjects) : []
      this.setState({anims: anims, keyMax: anims.length});
    }

    componentWillReceiveProps(nextProps) {
      this.updateState(nextProps);        
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
        const anims = this.state.anims;
        if (isNaN(ev) || ev < 0 || ev >= anims.length) { return; }

        let animsEv = Object.assign({}, anims[ev], window.app3dViewer.viewPositionObjs(3));
        anims.splice(ev, 1, animsEv);
        this.setState({ anims: anims });        
    }    

    addComponent(type) {
        let key = this.state.keyMax + 1,
            anims = this.state.anims,
            myObj;

        switch(type) {
            case "audio": 
                myObj = { timing: 0, src: "", type: "audio" };
                break;
            case "3dObjectState": 
                myObj = { timing: 0, src: "", type: "3dObjectState", action:"show" };
                break;
            case "3dObjectPosition": 
                myObj = { timing: 0, duration:1, src: "", type: "3dObjectPosition", action:"set",
                            position: {x:0, y:0, z:0}
                        };
                break;
            case "3dObjectRotation": 
                myObj = { timing: 0, duration:1, src: "", type: "3dObjectRotation", action:"set",
                            rotation: {x:0, y:0, z:0}
                        };
                break;
            case "camera": 
                myObj = { timing: 0, duration: 5, type: "camera", label:"",
                            cameraPosition: {x:"", y:"", z:""},
                            targetPosition: {x:"", y:"", z:""}
                        };
                break;
        }

        if (!myObj) { return; }
        anims.push(myObj);

        this.setState({
            keyMax: key,
            anims: anims
        });
        
    }

    onChangeFields(ev) {
        let name = ev.target.getAttribute("name"),
            parts = name.split("/"),
            value = !isNaN(ev.target.value) ? Number(ev.target.value) : ev.target.value,
            propertyChain;

        const anims = this.state.anims,
            index = Number(parts[1]);
        
        propertyChain = parts[0].indexOf(".") >= 0 ? parts[0].split("."): [parts[0]];

        switch (propertyChain.length) {
            case 1:
                anims[index][propertyChain[0]] = value;
                break;
            case 2:
                anims[index][propertyChain[0]][propertyChain[1]] = value;
                break;
            case 3:
                anims[index][propertyChain[0]][propertyChain[1]][propertyChain[2]] = value;
                break;
            default:
                return;
        }
        
        this.setState({ anims: anims });
        this.props.onChange(anims);
    }

    onDeleteRow(ev) {
        const anims = this.state.anims;
        if (isNaN(ev) || ev < 0 || ev >= anims.length) { return; }

        if (!window.confirm("Are you sure to remove this?")) { return; }

        anims.splice(ev, 1);
        this.setState({ anims: anims });        
        this.props.onChange(anims);
    }

    render() {
        let me = this;
        const anims = this.state.anims || [];
        const groupsList = this.props.groupsMap;

        const elements = anims.map(function(myObj, key){
            switch(myObj.type) {
                case "audio":
                    return(
                        <MediaAnimAudio key={key} index={key} value={myObj}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "camera":
                    let myObj2 = Object.assign({}, myObj);
                    if (!myObj2.label) { myObj2.label = "";} 
                    return(
                        <MediaAnimCamera key={key} index={key} value={myObj2} onCurrentCamera={me.setCurrentCameraPosValues}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "3dObjectState": 
                    return(
                        <MediaAnimObjVisHigh key={key} index={key} value={myObj} groupsList={groupsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "3dObjectPosition": 
                    return(
                        <MediaAnimObjPosRel key={key} index={key} value={myObj} groupsList={groupsList}
                            onChange={me.onChangeFields} onDeleteRow={me.onDeleteRow}/>
                    );
                case "3dObjectRotation": 
                    return(
                        <MediaAnimObjRotation key={key} index={key} value={myObj} groupsList={groupsList}
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
                    <button type="button" onClick={this.addAudio.bind(this)} className="btn btn-sm btn-success">Add audio track</button>
                    <span>&nbsp; or &nbsp;</span> 
                    <button type="button" onClick={this.addCamera.bind(this)} className="btn btn-sm btn-success">Add camera movement</button>
                    <span>&nbsp; or &nbsp;</span> 
                    <button type="button" onClick={this.add3DObjectState.bind(this)} className="btn btn-sm btn-success">Add 3D group state</button>
                    <span>&nbsp; or &nbsp;</span> 
                    <button type="button" onClick={this.add3dObjectPosition.bind(this)} className="btn btn-sm btn-success">Add 3D group RELATIVE position</button>
                    <span>&nbsp; or &nbsp;</span> 
                    <button type="button" onClick={this.add3dObjectRotation.bind(this)} className="btn btn-sm btn-success">Add 3D group rotation</button>
                </div>
            </div>
        )
    }
}