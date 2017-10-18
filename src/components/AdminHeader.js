import React, {
	Component
} from 'react';
import {
	withRouter,
	Link
} from 'react-router-dom';
import './AdminHeader.css';

class AdminHeader extends Component {
	getCookie(name) {
		var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (document.cookie.match(reg)) {
			return (document.cookie.match(reg)[2]);
		} else {
			return null;
		}
	}
	delCookie(name) {
		var cval = this.getCookie(name);
		if (cval != null) {
			document.cookie = name + "=" + cval + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
		} else {
			console.log("删除失败")
		}
	}
	handleClick() {
		console.log("当前的Cookie：" + document.cookie);
		this.delCookie("username")
		console.log("删除后的Cookie：" + document.cookie);
		this.props.history.push("/");

		window.location.reload()
	}
	constructor(props) {
		super(props);
		this.state = {
			yearMoney: 0,
			mounthMoney: 0
		};
	}
	componentWillMount() {
		var date = new Date();
		const yeardata = {
			year: date.getFullYear()
		};
		const url = "/api/getYearMoney";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(yeardata)
			})
			.then(response => response.json())
			.then(data => {
				this.setState({
					yearMoney: data.money
				});
			})
			.catch(e => console.log("报错信息：", e))

		const mounthdata = {
			year: date.getFullYear(),
			mounth: date.getMonth() + 1
		};
		const mounthurl = "/api/getMounthMoney";
		fetch(mounthurl, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(mounthdata)
			})
			.then(response => response.json())
			.then(data => {
				this.setState({
					mounthMoney: data.money
				});
			})
			.catch(e => console.log("报错信息：", e))
	}
	render() {
		var yearMoney = this.state.yearMoney && this.state.yearMoney.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,");
		var mounthMoney = this.state.mounthMoney && this.state.mounthMoney.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,");
		var date = new Date();
		return (
			<div className="header">
				<div className="header-left">
			        <span>云适配营销管理平台</span>
			        <span>
			        	{date.getFullYear()}年度总业绩：
			        	<span>{yearMoney}</span>元
			        	本月业绩：
			        	<span>{mounthMoney}</span>元
			        </span>
			        <span>
			        	{
			          		this.props.location.pathname === "/admin/pro" ?
			        		<Link to="/admin/userManagement" className="applyBtn">用户管理</Link> :
			          		<Link to="/admin/pro">返回首页</Link>
			          	}
			        </span>
			    </div>
			    <div className="header-right">	
					{/*<Link to="/admin/setting">账户设置</Link>*/}
					<a onClick={this.handleClick.bind(this)}>退出系统</a>
			    </div>
			</div>
		);
	}
}

export default withRouter(AdminHeader);