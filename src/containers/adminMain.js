import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect
} from 'react-router-dom';

import AdminPro from '../containers/adminPro';
import UserManagement from '../containers/userManagement';
// import NewUser from '../containers/newUser';

import AdminHeader from '../components/AdminHeader';

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
				    	<AdminHeader user={this.state.user} />

						<Route path="/admin/pro" component={AdminPro}/>
						<Route path="/admin/userManagement" component={UserManagement}/>
						{/*<Route path="/admin/newUser" component={NewUser}/>*/}
					</div>
	    		</Router>
			);
		}
	}
}

export default Main;