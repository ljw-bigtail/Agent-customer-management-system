import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect
} from 'react-router-dom';

import Project from '../containers/project';
import Bill from '../containers/bill';
import ApplyPro from '../containers/applyPro';
import Setting from '../containers/setting';

import Header from '../components/Header';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {}
		};
	}
	componentWillMount() {
		var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
		const data = {
			username: username
		};
		const url = "/api/getUser";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				// console.log("当前登录的用户信息："+data)
				this.setState({
					user: data
				});
			})
			.catch(e => console.log("报错信息：", e))
	}
	render() {
		var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
		if (username === undefined) {
			return (
				<Redirect to="/" />
			)
		} else {
			return (
				<Router>
					<div className="body">
				    	<Header user={this.state.user} />

						<Route path="/main/pro" component={Project}/>
				        <Route path="/main/setting" component={Setting}/>
				        <Route path="/main/billList" component={Bill}/>
				        <Route path="/main/applyPro" component={ApplyPro}/>
					</div>
	    		</Router>
			);
		}
	}
}

export default Main;