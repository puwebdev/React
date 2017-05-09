import React, { Component, PropTypes } from 'react';
import { Field, formValueSelector, reduxForm, change } from 'redux-form';
import { RenderTinyMceNoField } from './tinyMce';
import { getOptions } from './inputs';

/* Constants */

const MULTIPLE = "multi";
const SINGLE = "single";

const mergeState = (value) => {
  let r = Object.assign({ 
          index: 0,
          qbehaviour: 'no',
          correctfb: '',
          incorrectfb: '',
          instruction: '',
          qtext: '',
          qtype: '',
          answsArr: [],
          ranswsObj: {}
    }, value);
    r.index = Math.max(_.max(_.pluck(r.answsArr, "key")), 0);
    return r;
}

export class QuestionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = mergeState(props.input.value);

        this.handleQTypeChange = this.handleQTypeChange.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleTinyMceChange = this.handleTinyMceChange.bind(this);
        this.handleAnswersTextChange = this.handleAnswersTextChange.bind(this);
        this.handleAnswersRightChange = this.handleAnswersRightChange.bind(this);
        this.addOption = this.addOption.bind(this);
        this.deleteOption = this.deleteOption.bind(this);
    }

    componentWillReceiveProps(nextProps) {    
      let st = mergeState(nextProps.input.value);
      this.setState(st);
      this.props.input.onChange(st);
    }

    handleQTypeChange(event){
      let st = Object.assign({}, this.state);
      st.qtype = event.target.value;

      if (st.qtype === SINGLE && Object.keys(st.ranswsObj).lenght > 1) {
        let ranswsObj = {};
        ranswsObj[Object.keys(st.ranswsObj)[0]] = true;
        st.ranswsObj = ranswsObj;
      }

      this.setState(st);
      this.props.input.onChange(st);        
    }

    handleOrderChange(event){
      let st = Object.assign({}, this.state);
      st.qbehaviour = event.target.value;
      this.setState(st);
      this.props.input.onChange(st);          
    }

    handleTinyMceChange(target) {
      let st = Object.assign({}, this.state);
      st[target.name] = target.value;
      this.setState(st);
      this.props.input.onChange(st);
    }

    handleAnswersTextChange(event) {
      let v = event.target.id.split("/"),
        key =  v[1],
        n = Number(v[2]),
        st = Object.assign({}, this.state),
        answsArr = Object.assign([], st.answsArr);

      answsArr[n].val = event.target.value;
      st.answsArr = answsArr;

      this.setState(st);
      this.props.input.onChange(st);
    }

    handleAnswersRightChange(event) {
      let t = event.target,
        v = t.id.split("/"),
        key =  v[1],
        n = Number(v[2]),
        st = Object.assign({}, this.state),
        ranswsObj = Object.assign({}, st.ranswsObj);

      if (st.qtype === SINGLE) {
        st.ranswsObj = {};
        st.ranswsObj[Number(key)] = true;
      } else {
        st.ranswsObj[Number(key)] = t.checked;
      }

      this.setState(st);
      this.props.input.onChange(st);         
    }

    addOption(ev, w) {
      let st = Object.assign({}, this.state);

      if (isNaN(w) || w < 0 || w > st.answsArr.length) { return; }

      st.answsArr.splice(w, 0, {key: st.index + 1, val: ""});
      st.index = st.index + 1;

      this.setState(st);        
      this.props.input.onChange(st);
    }

    deleteOption(ev, w) {
      let st = Object.assign({}, this.state);

      if (isNaN(w) || w < 0 || w >= st.answsArr.length) { return; }

      if (!window.confirm("Are you sure to remove this option?")) { return; }

      //Delete
      let deleted = st.answsArr.splice(w, 1);
      //Delete if in right answers
      if (st.ranswsObj[deleted[0].key]) { delete st.ranswsObj[deleted[0].key]; }
      //Update the index
      st.index = Math.max(_.max(_.pluck(st.answsArr, "key")), 0);

      this.setState(st);        
      this.props.input.onChange(st);
    }

    render() {
        const questionTypes = [{label: "None", value: ""}, {label: "Multiple choice", value: MULTIPLE}, {label: "Single choice", value: SINGLE}];
        const questionBehaviours = [{label: "No", value: "no"}, {label: "Yes", value: "yes"}];
        const questionControl = this.state.qtype ? (this.state.qtype === MULTIPLE ? "checkbox" : "radio") : null;
        const answsArr = this.state.answsArr || [];
        const maxAnswArr = answsArr.length;

        return(
          <div className="mgmt-questions children-list form-group">

            <div className="row">
              <div className="col-sm-6">  
                  <div className="form-group">
                    <label className="control-label">Question type</label>
                    <div>
                      <select name="qtype" className="form-control" value={this.state.qtype} onChange={this.handleQTypeChange}>
                          {questionTypes && getOptions(questionTypes)}
                      </select>      
                    </div>
                  </div>
              </div>
              { questionControl &&
              <div className="col-sm-6">
                  <div className="form-group">
                    <label className="control-label">Shuffle the answers</label>
                    <div>
                      <select name="qbehaviour" className="form-control" value={this.state.qbehaviour} onChange={this.handleOrderChange}>
                          {questionBehaviours && getOptions(questionBehaviours)}
                      </select>      
                    </div>
                  </div>
              </div>
              }
            </div>

            { questionControl &&
            <div>

              <div className="row">
                <div className="col-sm-6">  
                  <RenderTinyMceNoField name="qtext" value={this.state.qtext} 
                    onChange={this.handleTinyMceChange} label="Question Text" />
                </div>
                <div className="col-sm-6">  
                  <RenderTinyMceNoField name="instruction" value={this.state.instruction} 
                    onChange={this.handleTinyMceChange} label="Instruction Text" />
                </div>
              </div>
            
              <div className="row">
                <div className="col-sm-6">  
                  <RenderTinyMceNoField name="correctfb" value={this.state.correctfb} 
                    onChange={this.handleTinyMceChange} label="Correct Feedback" />
                </div>
                <div className="col-sm-6">  
                  <RenderTinyMceNoField name="incorrectfb" value={this.state.incorrectfb} 
                    onChange={this.handleTinyMceChange} label="Incorrect Feedback" />
                </div>
              </div>
            
              <label>Answers (tick the correct answers)</label>
              <div className="ul-mgmt-questions">
                {_.map(answsArr, (ob, i) => 
                  <div key={i} className="ul-mgmt-questions-li">

                    <div className="input-group">
                      <span className="input-group-addon">
                        <input id={`sel/${ob.key}/${i}`} name={`sel`} type={questionControl} 
                          checked={!!this.state.ranswsObj[ob.key]} onChange={this.handleAnswersRightChange} />
                      </span>
                      <input id={`txt/${ob.key}/${i}`}  name={`txt/${ob.key}/${i}`} type="text" placeholder="text of the option..."
                        className="form-control" value={String(ob.val)} onChange={this.handleAnswersTextChange} />
                      <div className="input-group-btn">
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">action <span className="caret"></span></button>
                        <ul className="dropdown-menu dropdown-menu-right">
                          <li><a onClick={(ev) => this.addOption(ev, i)}>Add option above</a></li>
                          <li><a onClick={(ev) => this.addOption(ev, i + 1)}>Add option below</a></li>
                          <li role="separator" className="divider"></li>
                          <li><a onClick={(ev) => this.deleteOption(ev, i)}>Delete option</a></li>
                        </ul>
                      </div>                  
                    </div>

                  </div> 
                )}
                <button type="button" onClick={(ev) => this.addOption(ev, maxAnswArr) } className="btn btn-sm btn-success">Add option</button>
              </div>
            </div>
            }

          </div>
        )
    }
}
