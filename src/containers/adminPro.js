import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

import AdminList from '../components/AdminList';

const proList = () => (
	<AdminList/>
)

class AdminPage extends Component {
	render() {
		return (
			<Router>
		    	<div className="main">
					<Route exact path="/admin" component={proList}/>
	    		</div>
		    </Router>
		);
	}
}

export default AdminPage;