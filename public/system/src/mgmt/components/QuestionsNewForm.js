import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Router, Link } from 'react-router';
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import {
  createQuestion, createQuestionSuccess, createQuestionFailure, resetNewQuestion, 
  validateQuestionFields, validateQuestionFieldsSuccess, validateQuestionFieldsFailure
}
from '../actions/questions';
import { validateQuestion } from '../validators/questionValidator';
import { renderInput, renderTextarea, renderSelect, renderQSelect} from './inputs';

//For any field errors upon submission (i.e. not instant check)
const validateAndCreateQuestion = (values, dispatch, parentType, parentId) => {
    return new Promise((resolve, reject) => {
        dispatch(createQuestion(values, parentType, parentId))
            .then((response) => {
            let data = response.payload.data;
            //if any one of these exist, then there is a field error 
            if (response.payload.status != 200) {
                dispatch(createQuestionFailure(response.payload));
                reject(data); 
            } else {
                dispatch(createQuestionSuccess(response.payload));
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
            value: 'Multi Choice',
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

    componentWillMount() {
        this.props.resetMe();
    }

    componentDidUpdate() {
        ReactDom.findDOMNode(this).scrollIntoView();
    }    

    renderError(newQuestion) {
        if(newQuestion && newQuestion.error && newQuestion.error.message) {
            return (
            <div className="alert alert-danger">
                {newQuestion ? newQuestion.error.message : ''}
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
        let saver = validateAndCreateQuestion(values, dispatch, this.props.parentType, this.props.parentId),
            router = this.context.router;
        saver.then(function(){
            router.goBack();
        });
    }

    render() {
        const {asyncValidating, handleSubmit, pristine, submitting, newQuestion } = this.props;
        const questionTypes = this.state.questionTypes;
        const showReplyForm = () => {this.setState({showForm: true});};
        const grades = [{label: "None", value: "0.0"}, {label: "100%", value: "1"}, {label: "50%", value: "0.5"}, 
                        {label: "25%", value: "0.25"}, {label: "5%", value: "0.05"}, 
                        {label: "-5%", value: "-0.05"}, {label: "-25%", value: "-0.25"}, 
                        {label: "-50%", value: "-0.5"}, {label: "-100%", value: "-0.1"}];
        return (
            <div className="container">
                <h1>New Info Window for Question</h1>
                {this.renderError(newQuestion)}
                <form onSubmit={handleSubmit(this.saveQuestion.bind(this))} id="page-changer">

                    <Field name="title" component={renderInput} type="text" placeholder="Title" label="Title"/>

                    <Field name="description" component={renderTextarea} placeholder="Description" label="Description" rows="3"/>

                    <Field name="qtype" component={renderQSelect} label="Question Type" dataArray={questionTypes} value={this.state.value} onChange={this.handleChange}/> 

                    <div className="answers">
                      <div className="answer">
                        <Field name="answer1" component={renderTextarea} placeholder="" label="Choice 1" rows="2"/> 
                        <Field name="fraction1" component={renderQSelect} label="Grade" dataArray={grades} value={this.state.value1} onChange={this.handleChange1}/> 
                        <Field name="feedback1" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
                      </div>
                      <div className="answer">
                        <Field name="answer2" component={renderTextarea} placeholder="" label="Choice 2" rows="2"/> 
                        <Field name="fraction2" component={renderQSelect} label="Grade" dataArray={grades} value={this.state.value2} onChange={this.handleChange2}/> 
                        <Field name="feedback2" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
                      </div>  
                      <div className="answer">
                        <Field name="answer3" component={renderTextarea} placeholder="" label="Choice 3" rows="2"/> 
                        <Field name="fraction3" component={renderQSelect} label="Grade" dataArray={grades} value={this.state.value3} onChange={this.handleChange3}/> 
                        <Field name="feedback3" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
                      </div>  
                      <div className="answer">
                        <Field name="answer4" component={renderTextarea} placeholder="" label="Choice 4" rows="2"/> 
                        <Field name="fraction4" component={renderQSelect} label="Grade" dataArray={grades} value={this.state.value4} onChange={this.handleChange4}/> 
                        <Field name="feedback4" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
                      </div>
                      <div className="answer">
                        <Field name="answer5" component={renderTextarea} placeholder="" label="Choice 5" rows="2"/> 
                        <Field name="fraction5" component={renderQSelect} label="Grade" dataArray={grades} value={this.state.value5} onChange={this.handleChange5}/> 
                        <Field name="feedback5" component={renderTextarea} placeholder="" label="Feedback" rows="2"/> 
                      </div>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary"  disabled={submitting} ><span className="fa fa-save"></span> Save</button>
                        <Link to="/questions" className="btn btn-error">Cancel</Link>
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
    initialValues: state.questions.newQuestion.question,
    newQuestion: state.questions.newQuestion // pull initial values from questions reducer
  }),
  dispatch => ({
    resetMe: () => {
      dispatch(resetNewQuestion());
    } 
  })          
)(QuestionForm);

export default QuestionForm;
