import React, {
	Component
} from 'react';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

import ProList from '../components/ProList';
import ProDetail from '../components/ProDetail';

const proData = {
	thead: ["序号", "编号", "项目名称", "交易金额", "申请日期", "交付日期", "服务截止日期", "项目状态", "操作"],
	tbody: []
}
const getProListMessage = {
	username: document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined
}
const url = "/api/getProList"
fetch(url, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(getProListMessage)
	})
	.then(response => response.json())
	.then(_data => {
		proData.tbody = _data
	})
	.catch(e => console.log("报错信息：", e))

const proDetail = () => (
	<ProDetail/>
)

const proList = () => (
	<ProList proData={proData} userName={getProListMessage.username}/>
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