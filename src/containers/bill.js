import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect
} from 'react-router-dom';

import BillList from '../components/BillList';
import ProDetail from '../components/ProDetail';

const proDetail = () => (
	<ProDetail/>
)

const billList = () => (
	<BillList userName={document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined}/>
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
			        <Route exact path="/main/billList" component={billList}/>
			        <Route path="/main/pro/proDetail/" component={proDetail}/>
	    		</div>
		    </Router>
		);
	}
}

export default BillPage;