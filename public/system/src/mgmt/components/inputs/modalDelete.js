import React, { Component, PropTypes } from 'react';
import { Modal } from './modal';

export class ModalDelete extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
  }
  
  constructor(props) {
      super(props);

      this.state = {
        infowins: []
      }
  }

  flattenInfoWins(infowins) {
      var infoWinsTreeArray = [];

      function recursiveIter(w) {
          var j, lenJ;
          function recurseInfowins(parent) {
              var g;
              if (!parent || !parent.infowins) return;

              for (var k = 0, lenK = parent.infowins.length; k < lenK; k += 1) {
                  g = parent.infowins[k];
                  infoWinsTreeArray.push(g);
                  recurseInfowins(g);
              }
          }
          recurseInfowins(w);
      }
      
      recursiveIter(infowins);
      return infoWinsTreeArray;
  }

  findInfowinWithId(infowins, infowin) {
    for (var i = 0; i < infowins.length; i++) {
      if (infowins[i]._id === infowin._id) return infowins[i];
    }
  }

  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }
    var delInfowins = this.flattenInfoWins(this.findInfowinWithId(this.flattenInfoWins(window.config), this.props.activeInfowin));

    return (
      <Modal className='danger'>
        <div className="delete-confirm-dialog">
          <div className="modal">
            <div className="warning">
              <span className="warning-message">WARNING</span>
            </div>

            <div className="delete-infowins">
              <span className="following-message">THE FOLLOWING <span>{delInfowins.length + 1} INFO WINDOWS</span> WILL BE DELETED IF YOU PROCEED</span>
              <div className="deleting-infowins-list">
                <span>1. {this.props.activeInfowin.title}</span>
                <div>{delInfowins.map(function(infowin, idx) { return <span key={idx}>{idx+2}. {infowin.title}</span>; })}</div>
              </div>
            </div>

            <div className="buttons">
              <button className="btn-ok noselect" onClick={this.props.onOk}>
                OK - Delete {delInfowins.length + 1} Info Windows
              </button>
              <button className="btn-close noselect" onClick={this.props.onClose}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
