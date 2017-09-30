import React, {
	Component
} from 'react';
import {
	Redirect
} from 'react-router-dom';

import Setting from '../components/Setting';

class SettingPage extends Component {
	render() {
		var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
		if (username === undefined) {
			return (
				<Redirect to="/" />
			)
		} else {
			return (
				<Setting username={username}/>
			);
		}
	}
}

export default SettingPage;