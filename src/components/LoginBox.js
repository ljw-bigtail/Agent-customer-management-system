import React, {
	Component
} from 'react';
import './LoginBox.css';
import logo from '../img/logo.png';
import {
	Redirect
} from 'react-router-dom';

class LoginBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			group: 0,
			logined: false,
			loginMessage: ""
		};
	}
	componentDidMount() {
		document.addEventListener('keyup', function(e) {
			if (e.keyCode === 13) {
				document.getElementById("loginBtn") && document.getElementById("loginBtn").click();
			}
		})
	}
	handleClick() {
		this.setState({
			logined: false,
			loginMessage: ""
		});
		const data = {
			username: this.refs.username.value,
			password: this.refs.password.value
		}
		fetch(this.props.urlData, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => {
				if (response.ok) {
					return response.json()
				} else {
					this.setState({
						logined: false,
						loginMessage: "无网络或服务器错误！"
					});
				}
			})
			.then(data => {
				if (data.status === "ok") {
					//存cookie,关闭浏览器就清除
					document.cookie = "username=" + data.username
					console.log("登录成功后：" + document.cookie)

					this.setState({
						group: data.userGroup,
						logined: true
					});
				} else {
					this.setState({
						logined: false,
						loginMessage: data.message
					});
				}
			})
			.catch(e => console.log('错误：', e));
	}
	render() {
		if (this.state.logined) {
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
				<div id="LoginCard">
				    <div className="logo">
						<img src={logo} alt="" />
						<h1>Welcome</h1>
						<h3>西安云适配代理客户管理系统</h3>
					</div>
					<div className="loginMes">
						<div className="username">
							<input type="text" ref="username" />
						</div>
						<div className="password">
							<input type="password" ref="password"/>
						</div>
						<div className="login">
							<div className="loginBtn">
								<a onClick={this.handleClick.bind(this)} id='loginBtn'>Sign in</a>
							</div>
						</div>
						<div className='message'>
							{this.state.loginMessage}
						</div>
					</div>
				</div>
			);
		}
	}
}

export default LoginBox;