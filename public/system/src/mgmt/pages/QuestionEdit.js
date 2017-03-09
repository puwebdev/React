import React, { Component } from 'react';
import QuestionForm from '../components/QuestionsEditForm.js';

class QuestionEdit extends Component {
  render() {
    return (
      <div>
        <QuestionForm
          parentType={this.props.params.parentType}
          parentId={this.props.params.parentId}
          id={this.props.params.id} />
      </div>
    );
  }
}

export default QuestionEdit;