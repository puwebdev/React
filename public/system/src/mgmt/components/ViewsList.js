import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Link, browserHistory } from 'react-router';
import { ERROR_RESOURCE } from '../config.const';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import { ROOT_IMG_URL } from '../config.const';


const DragHandle = SortableHandle(() => <span className="handle fa fa-ellipsis-v"></span>); 
const SortableItem = SortableElement(({value, vsid}) => {
    return (
            <li className="list-group-item">
                <Link to={"/vSviews/" + vsid + "/" + value._id}>
                    <img className="list-group-item-img" src={`${ROOT_IMG_URL}${value.screenshot}`} alt={value.title} />
                    <h3 className="list-group-item-heading">
                        {value.title}
                        {value.keyCode ? <small>{String.fromCharCode(value.keyCode)}</small> : null}
                    </h3>
                </Link>
                <DragHandle />
            </li>
    )
});

const SortableList = SortableContainer(({items, vsid}) => {
    return (
        <ul className="list-group">
         { items.map((view, idx) => 
            <SortableItem key={view._id} index={idx} value={view} vsid={vsid} />
        )}
        </ul>
    );
});

class ViewsList extends Component {
    state = {
        isSorted: false
    }

    componentWillMount() {
        this.setState({ isSorted: false});
        this.props.fetchViews();
        this.props.fetchViewsSets();
    }

    componentDidUpdate() {
        if (this.props.viewsList.loading) {
            ReactDom.findDOMNode(this).scrollIntoView();
        }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        const { views } = this.props.viewsList;
        this.props.updateViews(arrayMove(views, oldIndex, newIndex), this.props.vsid);
        this.setState({ isSorted: true });
    }

    saveOrder() {
        const { views } = this.props.viewsList;
        let viewsByOrder = {}, j, lenJ;
        for (j = 0, lenJ = views.length; j < lenJ; j += 1) {
            viewsByOrder[views[j]._id] = j;
        }
        this.props.updateOrder(viewsByOrder);
        this.setState({ isSorted: false });
    }

    renderViews(views, vsid) {
        return (
            <SortableList items={views} vsid={vsid} 
                onSortEnd={this.onSortEnd} 
                useDragHandle={true} 
                hideSortableGhost={false}
                helperClass="onSortingClass" />
        )
    }

    render() {
        const { views, loading, error } = this.props.viewsList;

        if(loading) {
            return <div className="container"><h1>Views</h1><h3>Loading...</h3></div>      
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message || ERROR_RESOURCE }</div>
        }

        return (
            <div className="container pos-rel">
            <div className="view-title">
                <h1>Views</h1>
                <Link to={"/vSviews/" + this.props.vsid + "/new"}>+ Add new View</Link>
            </div>
                {this.state.isSorted ? <button className="top-right btn btn-success" 
                    onClick={this.saveOrder.bind(this)}>Save current order</button> : null }
                {this.renderViews(views, this.props.vsid)}
            </div>
        );
    }
}


export default ViewsList;