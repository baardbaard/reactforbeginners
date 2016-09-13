'use strict';

/* 
    Store Picker
    This will let us make <StorePicker/>
*/
import React from 'react';
import { browserHistory } from 'react-router'
import h from '../helpers';
import autobind from 'autobind-decorator';

class StorePicker extends React.Component {

    @autobind
    goToStore(event) {
        event.preventDefault();

        // get data from input
        var storeId = this.refs.storeId.value;

        // transition from <StorePicker/> to <App/>
        browserHistory.push('/store/' + storeId);
    }

    render() {
        return (
            <form className="store-selector" onSubmit={this.goToStore}>
                <h2>Please enter a store</h2>
                <input type="text" ref="storeId" defaultValue={h.getFunName()} required/>
                <input type="submit"/>
            </form>
        )
    }
}

export default StorePicker;