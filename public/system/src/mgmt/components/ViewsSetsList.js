import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Link, browserHistory } from 'react-router';
import { ERROR_RESOURCE } from '../config.const';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import { ROOT_IMG_URL } from '../config.const';


const DragHandle = SortableHandle(() => <span className="handle fa fa-ellipsis-v"></span>); 
const SortableItem = SortableElement(({value}) => {
    return (
            <li className="list-group-item">
                <Link to={"viewsSets/" + value._id}>
                    <h3 className="list-group-item-heading inlined">
                        {value.title}
                        {value.name ? <small>{value.name}</small> : null}
                    </h3>
                </Link>
                <Link className="list-group-extra-link" to={"vSviews/" + value._id}>&rarr; edit Views [{value.views ? value.views.length : 0}]</Link>
                <DragHandle />
            </li>
    )
});

const SortableList = SortableContainer(({items}) => {
    return (
        <ul className="list-group">
         { items.map((viewsSet, idx) => 
            <SortableItem key={viewsSet._id} index={idx} value={viewsSet} />
        )}
        </ul>
    );
});

class ViewsSetsList extends Component {
    state = {
        isSorted: false
    }

    componentWillMount() {
        this.setState({ isSorted: false});
        this.props.fetchViewsSets();      
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        if (this.props.viewsSetsList.loading) {
            ReactDom.findDOMNode(this).scrollIntoView();
        }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        const { viewsSets } = this.props.viewsSetsList;
        this.props.updateViewsSets(arrayMove(viewsSets, oldIndex, newIndex));
        this.setState({ isSorted: true });
    }

    saveOrder() {
        const { viewsSets } = this.props.viewsSetsList;
        let viewsSetsByOrder = {}, j, lenJ;
        for (j = 0, lenJ = viewsSets.length; j < lenJ; j += 1) {
            viewsSetsByOrder[viewsSets[j]._id] = j;
        }
        this.props.updateOrder(viewsSetsByOrder);
        this.setState({ isSorted: false });
    }

    renderViewsSets(viewsSets) {
        return (
            <SortableList items={viewsSets} 
                onSortEnd={this.onSortEnd} 
                useDragHandle={true} 
                hideSortableGhost={false}
                helperClass="onSortingClass" />
        )
    }

    render() {
        const { viewsSets, loading, error } = this.props.viewsSetsList;

        if(loading) {
            return <div className="container"><h1>Views-Sets</h1><h3>Loading...</h3></div>      
        } else if(error) {
            return <div className="alert alert-danger">Error: {error.message || ERROR_RESOURCE }</div>
        }

        return (
            <div className="container pos-rel">
                <div className="view-title">
                    <h1>Views-Sets</h1>
                    <Link to="/viewsSets/new" >+ Add new Views-Set</Link>
                </div>
                {this.state.isSorted ? <button className="top-right btn btn-success" onClick={this.saveOrder.bind(this)}>Save current order</button> : null }
                {this.renderViewsSets(viewsSets)}
            </div>
        );
    }
}


export default ViewsSetsList;