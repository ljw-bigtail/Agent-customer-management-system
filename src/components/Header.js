import React, {
	Component
} from 'react';
import {
	Link,
	withRouter
} from 'react-router-dom';
import './Header.css';

class Header extends Component {
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

		window.location.reload();
	}
	render() {
		var $data = this.props.user;
		var money = $data.balance && $data.balance.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,");

		return (
			<div className="header">
				<div className="header-left">
			        <span>欢迎 {$data.name} 进入云适配营销管理平台</span>
			        <span>
			          	余额
			          	<span>{money}</span>{
			          		this.props.location.pathname === "/main/pro" ?
			          		<Link to="/main/billList">查看消费明细</Link> :
			          		<Link to="/main/pro">查看项目列表</Link>	
			          	}
			          	<Link to="/main/applyPro" className="applyBtn">项目申请</Link>
			        </span>
			    </div>
			    <div className="header-right">	
					<Link to="/main/setting">账户设置</Link>
					<a onClick={this.handleClick.bind(this)}>退出</a>
			    </div>
			</div>
		);
	}
}

export default withRouter(Header);