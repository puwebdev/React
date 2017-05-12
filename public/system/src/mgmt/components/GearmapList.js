import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { ERROR_RESOURCE } from '../config.const';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { orderLowercase } from '../validators/viewValidator';
import { Dropdown } from 'semantic-ui-react';

const customConfirm = (next, dropRowKeys) => {
    if (confirm(`Are you sure you want to delete them?`)) {
        next();
    }
}

const sanitizeKey = (original) => {
    const _strip_list = [/\s/g,/\./g, /\|/g, /\\/g, /\&/g, /\?/g, /\:/g, /\;/g, /\~/g, /\!/g, /@/g, /#/g, /\//g, /'/g];
    var i, stripC, sanitized = original;
    if (typeof original === 'string') {
        for (i = 0; i < _strip_list.length; i++) {
            if (original.search((stripC = _strip_list[i])) > -1) {
                sanitized = sanitized.replace(stripC, '-');  
            }
        }
    }
    return sanitized;
}

const selectRowProp = {
  mode: 'checkbox'
};

class DropDownObjectsInScene extends React.Component {

    constructor(props) {
        super(props);      

        let objs = _.uniq(((window.app3dViewer.renderer3d._modelsMapNames || []).sort(orderLowercase))).map((ob, i) => {
                return { key: i, value: ob, text: ob }
            }),
            objsO1 = {};

        objs.map((ob, idx) => { objsO1[ob.value] = true; });

        this.state = { 
            value: props.defaultValue,
            options: objs,
            objsO1: objsO1
        };

        this.updateData = this.updateData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    focus() {}

    updateData() {
        let value = this.state.value || [],
            filteredVals = [], 
            optionsO1 = this.state.objsO1;
                
        value.map((ob, idx) => { if (optionsO1[ob]) { filteredVals.push(ob); } });

        this.setState({ value: filteredVals });
        this.props.onUpdate(filteredVals);
    }

    handleChange(e, { value }) {
        this.setState({ value });
    }

    render() {
        const options = this.state.options;
        return(
            <span>
                <button className="btn btn-success pull-right" onClick={this.updateData}>
                    <span className="fa fa-check"></span>
                </button>
                <Dropdown placeholder='Choose 3D objects' 
                    ref='inputRef' className="width-90p"
                    multiple fluid selection search
                    value={this.state.value}
                    onChange={this.handleChange}
                    options={options} />

            </span>
        )
    }
}

function keysFormatter(cell, row) {
  return (row.dgrp || []).sort(orderLowercase).join(" &middot; ");
}

const createObjectsEditor = (onUpdate, props) => {  
    return(
        <DropDownObjectsInScene onUpdate={ onUpdate } {...props}  />
    )
}

class GearmapList extends Component {

    constructor(props) {
        super(props); 

        this.state = { 
            arrayGroupsMap: [],
            objDelKeys: {},
            maxRows: 0
        };

        this.keyIsRequired = this.keyIsRequired.bind(this);
    }

    tableOptions = {
        handleConfirmDeleteRow: customConfirm,
        onAddRow: this.onAddRow.bind(this),
        afterDeleteRow: this.onAfterDeleteRow.bind(this)
    }

    cellEditProp = {
        mode: 'click',
        blurToSave: true,
        afterSaveCell: this.onAfterSaveCell.bind(this)
    }

    onAfterDeleteRow(rowsKeys) {
        let arrayGroupsMap = this.state.arrayGroupsMap,
            objDelKeys = this.state.objDelKeys,
            k, lenK = rowsKeys.length,
            j, lenJ = arrayGroupsMap.length;

        for (k = 0; k < lenK; k += 1) {  
            for (j = 0; j < lenJ; j += 1) {
                if (arrayGroupsMap[j].didd === rowsKeys[k]) {
                    arrayGroupsMap[j].dedt = true;
                    arrayGroupsMap[j].ddel = true;
                    objDelKeys[arrayGroupsMap[j].dkey] = true;
                    break;
                }
            }
        }
    }

    onAddRow(row) {
        let arrayGroupsMap = this.state.arrayGroupsMap,
            objDelKeys = this.state.objDelKeys;

        row.didd = ++this.state.maxRows;
        row.dkey = sanitizeKey(row.dkey);
        if (objDelKeys[row.dkey]) { delete objDelKeys[row.dkey]; }

        arrayGroupsMap.push({
                    didd: row.didd,
                    dkey: row.dkey,
                    dhid: row.hiddenByDefault === "true",
                    dgrp: [],
                    dedt: true,
                    ddel: false,
                    dObj: {
                        hiddenByDefault: row.hiddenByDefault === "true",
                        keys: []
                    }
                });
    }
    
    onAfterSaveCell(row, cellName, cellValue) {
        let arrayGroupsMap = this.state.arrayGroupsMap,
            objDelKeys = this.state.objDelKeys,
            j, lenJ = arrayGroupsMap.length;

        for (j = 0; j < lenJ; j += 1) {
            if (arrayGroupsMap[j].didd === row.didd) {
                arrayGroupsMap[j].dedt = true;
                break;
            }
        }        
    }

    keyIsRequired(value) {
        const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
        let isValid = !!value.replace(/^\s+|\s+$/g, "");
        if (!isValid) {
            response.isValid = false;
            response.notification.type = 'error';
            response.notification.msg = 'Value can\'t be blank';
            response.notification.title = '';
        } else {
            let j, lenJ, arrayGroupsMap = this.state.arrayGroupsMap;
            
            for (j = 0, lenJ = arrayGroupsMap.length; j < lenJ; j += 1) {
                if (arrayGroupsMap[j].dkey === value) {
                    response.isValid = false;
                    response.notification.type = 'error';
                    response.notification.msg = 'Value can\'t be repeated';
                    response.notification.title = '';
                    break;
                }
            }
        }
        return response;
    }    

    componentWillMount() {
        let me = this,
            arrayGroupsMap = [],
            totalRows = this.state.maxRows;
        
        this.props.fetchGearmap().then(() => {
            let data = this.props.gearmapList.gearmap;
            data.map((obj, idx) => {
                arrayGroupsMap.push({
                    didd: obj.didd,
                    dkey: obj.dkey,
                    dhid: !!obj.dval.hiddenByDefault,
                    dgrp: obj.dval.keys || [],
                    dedt: false,
                    ddel: false,
                    dObj: obj.dval
                });
            });
            me.setState({ arrayGroupsMap: arrayGroupsMap, maxRows: Math.max(totalRows, arrayGroupsMap.length)});        
        });      
    }

    save() {
        var gmArray = this.state.arrayGroupsMap,
            objDelKeys = this.state.objDelKeys,
            gmu, 
            newGroupsMap = {};

        for (var j = 0, lenJ = gmArray.length; j < lenJ; j += 1) {
            gmu = gmArray[j];
            if (!gmu.dkey || !gmu.dedt) { continue; }
            newGroupsMap[sanitizeKey(gmu.dkey)] = Object.assign(gmu.dObj, { hiddenByDefault: gmu.dhid === "true", keys: gmu.dgrp });
        }

        let saver = this.props.saveGearmap(newGroupsMap, objDelKeys, window.config.mainScene.worldId),
            router = this.props.router,
            me = this;
        
        saver.then(function() {
               window.alert("You have to re-load this World to see the changes (Ctrl-R or F5)");
               router.push("/");
            }, function(error) {
                console.log(error);
            });
    }

    renderGearmap(gearmap) {
        const trueAndFalse = [ "false", "true" ]; 
        const height = window.app3dViewer.height - 400;
        return (
            <BootstrapTable data={gearmap} height={height}
                cellEdit={ this.cellEditProp }
                insertRow={true} deleteRow={true} selectRow={ selectRowProp }
                keyField='didd' striped
                options={ this.tableOptions } >
                <TableHeaderColumn dataField='didd' hiddenOnInsert width="60">Order</TableHeaderColumn>
                <TableHeaderColumn dataField='dkey' editable={ { type: 'text', validator: this.keyIsRequired } } width="240">Group Name</TableHeaderColumn>
                <TableHeaderColumn dataField='dhid' editable={ { type: 'select', options: { values: trueAndFalse } } } width="140">Hide by default</TableHeaderColumn>
                <TableHeaderColumn 
                    dataField='dgrp' hiddenOnInsert
                    dataFormat={ keysFormatter } 
                    customEditor={ { getElement: createObjectsEditor } }>
                    Objects
                </TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { loading, error } = this.props.gearmapList;
        const groupsMap = this.state.arrayGroupsMap;

        if(loading) {
            return <div className="container"><h1>Gear Map</h1><h3>Loading...</h3></div>      
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message || ERROR_RESOURCE }</div>
        }

        return (
            <div className="container pos-rel">
                <div className="view-title">
                    <h1>Groups Map</h1>
                </div>
                    <button type="submit" className="top-right btn btn-primary" onClick={this.save.bind(this)}><span className="fa fa-save"></span> Save</button>
                    
                    {this.renderGearmap(groupsMap)}

                    <button  className="btn btn-primary" onClick={this.save.bind(this)}><span className="fa fa-save"></span> Save</button>
            </div>
            
            
        );
    }
}


export default GearmapList;

