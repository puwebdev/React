import React, { Component } from 'react';
import { Modal } from './modal';

export class ModalSaved extends Component {

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      label: props.label || "",
      showButton: true
    }
  }

  dismiss() {
    this.setState({ show: false });
  }

  show(label, showButton = true) {
    this.setState({ show: true, label: label, showButton: showButton });
  }

  setLabel(label, showButton = true) {
    this.setState({ label: label, showButton: showButton });
  }

  render() {

    if (!this.state.show) {
      return null;
    }

    return (
      <Modal className='success'>
          <div className="modal-success">
            <div>{this.state.label}</div>
            {this.state.showButton &&
              <button className="btn-ok noselect" onClick={this.dismiss.bind(this)}>
                {this.props.dismissText}
              </button>
            }
        </div>
      </Modal>
    );
  }
}
