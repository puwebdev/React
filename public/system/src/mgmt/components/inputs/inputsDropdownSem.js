import React, { Component, PropTypes } from 'react';
import { renderInput, renderTextarea, renderSelect, renderObjectSelect, getOptions } from './inputs';
import { populateObjectsLeft } from '../../validators/viewValidator';
import { Dropdown } from 'semantic-ui-react';

export class InputDropDownSemantic extends Component {

    constructor(props) {
      super(props);

      this.state = {
          show: Object.assign([], props.input.value.show),
          hide: Object.assign([], props.input.value.hide)
      }

      this.handleChangeShow = this.handleChangeShow.bind(this); 
      this.handleChangeHide = this.handleChangeHide.bind(this); 
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props.input, nextProps.input);

        if (!this.props.input.value || !this.props.input.value.show || !this.props.input.value.hide
            || !Array.isArray(this.props.input.value.show) || !Array.isArray(this.props.input.value.hide)
            || !nextProps.input.value || !nextProps.input.value.show || !nextProps.input.value.hide
            || !Array.isArray(nextProps.input.value.show) || !Array.isArray(nextProps.input.value.hide)) {
            return;
        }

        if ((nextProps.input.value.show.join("") !== this.props.input.value.show.join("")) ||
            (nextProps.input.value.hide.join("") !== this.props.input.value.hide.join(""))){
            this.setState({
                show: Object.assign([], nextProps.input.value.show),
                hide: Object.assign([], nextProps.input.value.hide)
            });
        }
    }

    handleChangeShow(e, { value }){
        let st = this.state;
        this.props.input.onChange(Object.assign(st, {show: value}));
    }

    handleChangeHide(e, { value }){
        let st = this.state;
        this.props.input.onChange(Object.assign(st, {hide: value}));
    }

    render() {
        return(
            <div>
                <h4>{this.props.label}</h4>
                <div className="row">
                    <div className="col-sm-6">
                        <label>Show</label>
                        <Dropdown placeholder={this.props.placeholder} 
                        ref='inputRef' 
                        multiple fluid selection search
                        value={this.state.show}
                        onChange={this.handleChangeShow}
                        options={this.props.options} /> 
                    </div>
                    <div className="col-sm-6">
                        <label>Hide</label>
                        <Dropdown placeholder={this.props.placeholder} 
                        ref='inputRef' 
                        multiple fluid selection search
                        value={this.state.hide}
                        onChange={this.handleChangeHide}
                        options={this.props.options} /> 
                    </div>
                </div>   
            </div>
        )
    }
}


export class InputDropDownSemanticOne extends Component {

    constructor(props) {
      super(props);

      this.state = {
          value: Object.assign([], props.input.value)
      }

      this.handleChangeValue = this.handleChangeValue.bind(this); 
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.input.value && this.props.input.value 
            && Array.isArray(nextProps.input.value) && Array.isArray(this.props.input.value)
            && nextProps.input.value.join("") !== this.props.input.value.join("")){
            this.setState({
                value: Object.assign([], nextProps.input.value)
            });
        }
    }

    handleChangeValue(e, { value }){
        this.props.input.onChange(value);
    }

    render() {
        return(
            <div>
                <label>{this.props.label}</label>
                <Dropdown placeholder={this.props.placeholder} 
                    ref='inputRef' 
                    multiple fluid selection search
                    value={this.state.value}
                    onChange={this.handleChangeValue}
                    options={this.props.options} /> 
                </div>
        )
    }
}


export class InputDropDownSemanticShowHide extends Component {

    constructor(props) {
      super(props);

      this.state = {
          show: Object.assign([], props.value.show),
          hide: Object.assign([], props.value.hide)
      }

      this.handleChangeShow = this.handleChangeShow.bind(this); 
      this.handleChangeHide = this.handleChangeHide.bind(this); 
    }

    componentWillReceiveProps(nextProps) {
        
        if (!this.props.value || !this.props.value.show || !this.props.value.hide
            || !Array.isArray(this.props.value.show) || !Array.isArray(this.props.value.hide)
            || !nextProps.value || !nextProps.value.show || !nextProps.value.hide
            || !Array.isArray(nextProps.value.show) || !Array.isArray(nextProps.value.hide)) {
            return;
        }

        if ((nextProps.value.show.join("") !== this.props.value.show.join("")) ||
            (nextProps.value.hide.join("") !== this.props.value.hide.join(""))){
            this.setState({
                show: Object.assign([], nextProps.value.show),
                hide: Object.assign([], nextProps.value.hide)
            });
        }
    }

    handleChangeShow(e, { value }){
        let st = this.state;
        this.props.onChange(Object.assign(st, {show: value}));
    }

    handleChangeHide(e, { value }){
        let st = this.state;
        this.props.onChange(Object.assign(st, {hide: value}));
    }

    render() {
        return(
            <div>
                <h4>{this.props.label}</h4>
                <div className="row">
                    <div className="col-sm-6">
                        <label>Show</label>
                        <Dropdown placeholder={this.props.placeholder} 
                        ref='inputRef' 
                        multiple fluid selection search
                        value={this.state.show}
                        onChange={this.handleChangeShow}
                        options={this.props.options} /> 
                    </div>
                    <div className="col-sm-6">
                        <label>Hide</label>
                        <Dropdown placeholder={this.props.placeholder} 
                        ref='inputRef' 
                        multiple fluid selection search
                        value={this.state.hide}
                        onChange={this.handleChangeHide}
                        options={this.props.options} /> 
                    </div>
                </div>   
            </div>
        )
    }
}
