import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

import ProList from '../components/ProList';
import ProDetail from '../components/ProDetail';

const proDetail = () => (
	<ProDetail/>
)

const proList = () => (
	<ProList userName={document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined}/>
)

class ProjectPage extends Component {
	render() {
		return (
			<Router>
		    	<div className="main">
					<Route exact path="/main/pro" component={proList}/>
			        <Route path="/main/pro/proDetail/" component={proDetail}/>
	    		</div>
		    </Router>
		);
	}
}

export default ProjectPage;