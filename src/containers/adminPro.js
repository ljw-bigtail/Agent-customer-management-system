import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

import AdminList from '../components/AdminList';
import UserManagement from '../components/UserManagement';

class AdminPage extends Component {
	render() {
		return (
			<Router>
		    	<div className="main">
					<Route exact path="/admin/pro" component={AdminList}/>
					<Route path="/admin/userManagement" component={UserManagement}/>
	    		</div>
		    </Router>
		);
	}
}

export default AdminPage;