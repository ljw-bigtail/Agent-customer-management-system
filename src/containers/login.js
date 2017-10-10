import React, {
	Component
} from 'react';
import {
	Redirect
} from 'react-router-dom';
import BgSilser from '../components/BgSilser';
import LoginBox from '../components/LoginBox';

class LoginPage extends Component {
	constructor() {
		super();
		this.state = {
			isLogin: false,
			group: 0
		}
	}
	componentWillUpdate() {
		var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
		if (username !== undefined) {
			this.setState({
				isLogin: true
			})
		}
	}
	render() {
		if (this.state.isLogin) {
			if (this.state.group === 0) {
				return (
					<Redirect to="/main/pro" />
				)
			} else if (this.state.group === 10) {
				return (
					<Redirect to="/admin" />
				)
			}
		} else {
			return (
				<div className="login">
					<div id="bgSilser">
	    				<BgSilser/>
		    		</div>
					<div id="loginBox">
			    		<LoginBox urlData="/api/checkPassword"/>
		    		</div>
		    	</div>
			);
		}
	}
}

export default LoginPage;