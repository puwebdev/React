import React, { Component } from 'react';
import QuestionForm from '../components/QuestionsNewForm.js';

class QuestionNew extends Component {
  render() {
    return (
      <div>
        <QuestionForm parentType={this.props.params.parentType} parentId={this.props.params.parentId} />
      </div>
    );
  }
}

export default QuestionNew;