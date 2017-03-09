import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import {
  fetchQuestion, fetchQuestionSuccess, fetchQuestionFailure, resetActiveQuestion,
  updateQuestion, updateQuestionSuccess, updateQuestionFailure,
  deleteQuestion, deleteQuestionSuccess, deleteQuestionFailure,
  validateQuestionFields, validateQuestionFieldsSuccess, validateQuestionFieldsFailure
}
  from '../actions/questions';
import { validateQuestion } from '../validators/questionValidator';
import { renderInput, renderTextarea, renderSelect, renderQSelect} from './inputs';

//For any field errors upon submission (i.e. not instant check)
const validateAndUpdateQuestion = (values, dispatch) => {

  return new Promise((resolve, reject) => {
    dispatch(updateQuestion(values))
      .then((response) => {
        let data = response.payload.data;
        //if any one of these exist, then there is a field error
        if (response.payload.status != 200) {
          dispatch(updateQuestionFailure(response.payload));
          reject(data);
        } else {
          dispatch(updateQuestionSuccess(response.payload));
          resolve(values);
        }
      });

  });
};

/* CLASS */

class QuestionForm extends Component {
  static contextTypes = {
    router: PropTypes.object
  };
      
  constructor(props) {
      super(props);
      this.state = {
          value: '',
          value1: '',
          value2: '',
          value3: '',
          value4: '',
          value5: '',            
          lastModified: null,
          questionTypes: [{label: "Multi Choice", value: "multi"}, {label: "Single Choice", value: "single"}]
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleChange1 = this.handleChange1.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleChange3 = this.handleChange3.bind(this);
      this.handleChange4 = this.handleChange4.bind(this);
      this.handleChange5 = this.handleChange5.bind(this);  
     
  }

  state = {
    lastModified: null
  }

  setInitialValues(activeQuestion) {

      if (activeQuestion.question) {
        this.state.value1 = activeQuestion.question.fraction1;
        this.state.value2 = activeQuestion.question.fraction2;
        this.state.value3 = activeQuestion.question.fraction3;
        this.state.value4 = activeQuestion.question.fraction4;
        this.state.value5 = activeQuestion.question.fraction5;
      }      
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.questionId !== this.props.questionId) { 
      this.props.fetchQuestion(nextProps.questionId);
    }
  }

  componentDidMount() {    
    this.props.fetchQuestion(this.props.questionId);
  }

  componentDidUpdate() {
    ReactDom.findDOMNode(this).scrollIntoView();
  }

  renderError(activeQuestion) {
    if(activeQuestion && activeQuestion.error && activeQuestion.error.message) {
      return (
        <div className="alert alert-danger">
          {activeQuestion ? activeQuestion.error.message : ''}
        </div>
      );
    } else {
      return <span></span>
    }
  }

  handleChange(event){
      event.preventDefault();        
      this.setState({value: event.target.value});
  }

  handleChange1(event) {
      event.preventDefault();
      this.setState({value1: event.target.value});
  }

  handleChange2(event) {
      event.preventDefault();
      this.setState({value2:event.target.value});
  }

  handleChange3(event) {
      event.preventDefault();
      this.setState({value3: event.target.value});
  }

  handleChange4(event) {
      event.preventDefault();
      this.setState({value4: event.target.value});
  }

  handleChange5(event) {
      event.preventDefault();
      this.setState({value5: event.target.value});
  }

  saveQuestion(values, dispatch) {
    let saver = validateAndUpdateInfowin(values, dispatch),
      router = this.context.router;
    saver.then(function(){
      router.goBack();
    });
  }

  deletethisQuestion() {
    if (window.confirm('Are you sure to delete this?')) {
      let deleter = this.props.deleteQuestion(this.props.parentType, this.props.parentId, this.props.questionId),
        router = this.context.router;
      deleter.then(function(){
        router.push("/infowins");
      });
    }
  }

  render() {
    const {asyncValidating, handleSubmit, submitting, activeQuestion } = this.props;
    const questionTypes = this.state.questionTypes;
    const grades = [{label: "None", value: "0.0"}, {label: "100%", value: "1"}, {label: "50%", value: "0.5"}, 
                    {label: "25%", value: "0.25"}, {label: "5%", value: "0.05"}, 
                    {label: "-5%", value: "-0.05"}, {label: "-25%", value: "-0.25"}, 
                    {label: "-50%", value: "-0.5"}, {label: "-100%", value: "-0.1"}];
                    
                   
    return (
      <div className="container">
        <div className="view-title">
          <h1>Edit Question Info Windows</h1>               
        </div>
       
        {activeQuestion.question ? <h2>{activeQuestion.question.title}</h2> : null}
        {this.setInitialValues(activeQuestion)}
        {this.renderError(activeQuestion)}
        <form onSubmit={handleSubmit(this.saveQuestion.bind(this))}>

          <Field name="title" component={renderInput} type="text" placeholder="Title" label="Title"/>

          <Field name="description" component={renderTextarea} placeholder="Description" label="Description" rows="3"/>

          <Field name="qtype" component={renderQSelect} label="Question Type" dataArray={questionTypes} selectedValue={this.state.value} onChange={this.handleChange}/> 

          <div className="answers">
            <div className="answer">
              <Field name="answer1" component={renderTextarea} placeholder="" label="Choice 1" rows="2"/> 
              <Field name="fraction1" component={renderQSelect} label="Grade" dataArray={grades} selectedValue={this.state.value1} onChange={this.handleChange1}/> 
              <Field name="feedback1" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
            </div>
            <div className="answer">
              <Field name="answer2" component={renderTextarea} placeholder="" label="Choice 2" rows="2"/> 
              <Field name="fraction2" component={renderQSelect} label="Grade" dataArray={grades} selectedValue={this.state.value2} onChange={this.handleChange2}/> 
              <Field name="feedback2" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
            </div>  
            <div className="answer">
              <Field name="answer3" component={renderTextarea} placeholder="" label="Choice 3" rows="2"/> 
              <Field name="fraction3" component={renderQSelect} label="Grade" dataArray={grades} selectedValue={this.state.value3} onChange={this.handleChange3}/> 
              <Field name="feedback3" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
            </div>  
            <div className="answer">
              <Field name="answer4" component={renderTextarea} placeholder="" label="Choice 4" rows="2"/> 
              <Field name="fraction4" component={renderQSelect} label="Grade" dataArray={grades} selectedValue={this.state.value4} onChange={this.handleChange4}/> 
              <Field name="feedback4" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
            </div>
            <div className="answer">
              <Field name="answer5" component={renderTextarea} placeholder="" label="Choice 5" rows="2"/> 
              <Field name="fraction5" component={renderQSelect} label="Grade" dataArray={grades} selectedValue={this.state.value5} onChange={this.handleChange5}/> 
              <Field name="feedback5" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
            <Link to="/infowins" className="btn btn-error">Cancel</Link>
          </div>

          <div className="form-group pull-right">
            <button type="button" className="btn btn-danger"
                    onClick={this.deletethisQuestion.bind(this)}
                    disabled={submitting}>
              Delete this question <span className="fa fa-times"></span>
            </button>
          </div>
        </form>

      </div>

    );
  }
}


QuestionForm = reduxForm({
  form: 'questionsNewForm',
  enableReinitialize: true,
  validate: validateQuestion
})(QuestionForm);

QuestionForm = connect(
  (state, ownProps) => ({
    parentType: ownProps.parentType,
    parentId: ownProps.parentId,
    questionId: ownProps.id,
    initialValues: state.questions.activeQuestion.question,
    activeQuestion: state.questions.activeQuestion // pull initial values from questions reducer
  }),
    dispatch => ({
    fetchQuestion: (id) => {
      console.log(id);
      dispatch(fetchQuestion(id)).then((response) => {
        console.log("response:", response);
        !response.error ? dispatch(fetchQuestionSuccess(response.payload.data)) : dispatch(fetchQuestionFailure(response.payload));
      });
    },
    deleteQuestion: (parentType, parentId, id) => {
      return new Promise((resolve, reject) => {
        dispatch(deleteQuestion(parentType, parentId, id)).then((response) => {
          let data = response.payload.data;
          if (!response.error) {
            dispatch(deleteQuestionSuccess(response.payload.data))
            resolve();
          } else {
            dispatch(deleteQuestionFailure(response.payload));
            reject(data);
          }
        });

      });
    },
    resetMe: () => {
      dispatch(resetActiveQuestion());
    }
  })
)(QuestionForm);

export default QuestionForm