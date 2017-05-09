import React, { Component, PropTypes } from 'react';
import { sortable } from 'react-sortable';
import { Router, Link } from 'react-router';

export class ListItem extends Component {
  
  static displayName = 'SortableListItem'

  render() {
    const { parentId, parentType, ...props } = this.props;

    return (
      <li {...props} className="list-group-item">
          <Link to={"/infowins/" + parentType + "/" + parentId + "/" + props.children._id}>
              <h3 className="list-group-item-heading inlined">{props.children.title}</h3>
          </Link>
      </li>
    )
  }
} 
var SortableListItem = sortable(ListItem);
 
export class SortableList extends Component {
 
  constructor(props) {
    super(props);

    this.state = {
      draggingIndex: null,
      data: this.props.data
    };

    this.updateState = this.updateState.bind(this);
  }

  updateState(obj) {
    this.setState(obj);
    if (obj.draggingIndex > 0) { this.props.orderChange(); }
  }
 
  componentWillReceiveProps() {
    return false;
  }

  render() {
    var childProps = { className: 'myClass1', parentId: this.props.parentId, parentType: this.props.parentType };
    var listItems = this.state.data.map(function(item, i) {
      return (
        <SortableListItem
          key={i}
          updateState={this.updateState}
          items={this.state.data}
          draggingIndex={this.state.draggingIndex}
          sortId={i}
          outline="list"
          childProps={childProps}
          >{item}</SortableListItem>
      );
    }, this);
 
    return (
          <div className="list">{listItems}</div>
    )
  }
};