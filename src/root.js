import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import Login from './containers/login';
import Main from './containers/main';
import Admin from './containers/adminMain';

const main = () => (
    <Main/>
)

const admin = () => (
    <Admin/>
)

const Root = () => (
    <Router>
        <div className="app">
            <Route exact path="/" component={Login}/>
            <Route path="/main" component={main}/>
            <Route path="/admin" component={admin}/>
        </div>
    </Router>
)

export default Root;