mport React, {
	Component
}
from 'react';
import {
	Redirect
} from 'react-router-dom';

import NewUser from '../components/newUser';

class SettingPage extends Component {
	render() {
		var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
		if (username === undefined) {
			return (
				<Redirect to="/" />
			)
		} else {
			return (
				<NewUser/>
			);
		}
	}
}

export default SettingPage;