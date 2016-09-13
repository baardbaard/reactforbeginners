'use strict';

/* 
    Import modules
*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

/*
    Import components
*/
import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App';

/* 
    Router
*/
var routes = (
    <Router history={browserHistory}>
        <Route path="/" component={StorePicker}/>
        <Route path="/store/:storeId" component={App}/>
        <Route path="*" component={NotFound}/>
    </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));