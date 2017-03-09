import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { ERROR_RESOURCE } from '../config.const';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

const customConfirm = (next, dropRowKeys) => {
    if (confirm(`Are you sure you want to delete them?`)) {
        next();
    }
}

function onAddRow(row) {
    //console.log("onAddRow", row);
}

const options = {
  handleConfirmDeleteRow: customConfirm,
  onAddRow: onAddRow
};

const selectRowProp = {
  mode: 'checkbox'
};

const cellEditProp = {
    mode: 'click',
    blurToSave: true
};



class GearmapList extends Component {
    state = {
        objectsList: []
    }

    componentWillMount() {
        var objs = ((window.app3dViewer.renderer3d._modelsMapNames || []).sort());
        this.setState({ objectsList: objs});
        this.props.fetchGearmap();      
    }

    save() {
        var gmArray = this.props.gearmapList.gearmap, 
            gmu, 
            newGearmap = {};

        for (var j = 0, lenJ = gmArray.length; j < lenJ; j += 1) {
            gmu = gmArray[j];
            if (!gmu.dkey) { continue; }
            newGearmap[gmu.dkey] = gmu.dval;
        }

        let saver = this.props.saveGearmap(newGearmap, window.config.mainScene.worldId),
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
        const objectsList = this.state.objectsList;
        return (
            <BootstrapTable data={gearmap} 
                cellEdit={ cellEditProp }
                insertRow={true} deleteRow={true} selectRow={ selectRowProp }
                keyField='didd'
                options={ options } striped hover>
                <TableHeaderColumn dataField='didd' hiddenOnInsert autoValue>Order</TableHeaderColumn>
                <TableHeaderColumn dataField='dkey' editable={ { type: 'select', options: { values: objectsList } } }>Object</TableHeaderColumn>
                <TableHeaderColumn dataField='dval' editable={ { type: 'text' } }>Mapped to</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { gearmap, loading, error } = this.props.gearmapList;

        if(loading) {
            return <div className="container"><h1>Gear Map</h1><h3>Loading...</h3></div>      
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message || ERROR_RESOURCE }</div>
        }

        return (
            <div className="container pos-rel">
                <div className="view-title">
                    <h1>Gear Map</h1>
                </div>
                    <button type="submit" className="top-right btn btn-primary" onClick={this.save.bind(this)}><span className="fa fa-save"></span> Save</button>
                    {this.renderGearmap(gearmap)}

                    <button  className="btn btn-primary" onClick={this.save.bind(this)}><span className="fa fa-save"></span> Save</button>
            </div>
            
            
        );
    }
}


export default GearmapList;