import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect
} from 'react-router-dom';

import UserManagement from '../components/UserManagement';

const userManagement = () => (
	<UserManagement userName={document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined}/>
)

class BillPage extends Component {
	render() {
		var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
		if (username === undefined) {
			return (
				<Redirect to="/" />
			)
		}
		return (
			<Router>
		    	<div className="main">
			        <Route path="/admin/userManagement" component={userManagement}/>
	    		</div>
		    </Router>
		);
	}
}

export default BillPage;