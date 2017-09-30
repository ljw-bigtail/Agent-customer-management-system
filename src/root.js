import React from 'react';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

import Login from './containers/login';
import Main from './containers/main';

const main = () => (
	<Main/>
)

const Root = () => (
	<Router>
        <div className="app">
            <Route exact path="/" component={Login}/>
            <Route path="/main" component={main}/>
        </div>
    </Router>
)

export default Root;