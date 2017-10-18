import React, {
	Component
} from 'react';
import {
	withRouter
} from 'react-router-dom';
import './UserManagement.css';

class UserManagements extends Component {
	reSetMoney(username, balance, user) {
		const data = {
			name: username,
			balance: this.refs['user' + user].value - 0 + balance
		};
		const billData = {
			userName: username,
			type: '充值',
			amount: this.refs['user' + user].value - 0,
			balance: data.balance
		};
		console.log(billData)
		const url = "/api/changeBalance";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					//账单
					console.log(billData)
					const billUrl = "/api/applyDeal";
					fetch(billUrl, {
							method: "POST",
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(billData)
						})
						.then(response => response.json())
						.then(data => {
							if (data.status === 'success') {
								//返回首页
								this.props.history.push("/admin/pro");
								window.location.reload();
							} else {
								console.log("保存失败！")
							}
						})
						.catch(e => console.log("报错信息：", e))
					this.getUserListFun();
				} else {
					console.log("保存失败！")
				}
			})
			.catch(e => console.log("报错信息：", e))
	}
	deletUser(username) {
		const data = {
			username: username,
		};
		console.log(data);
		const url = "/api/deletUserByName";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					this.getUserListFun();
				} else {
					console.log("保存失败！")
				}
			})
			.catch(e => console.log("报错信息：", e))
	}
	getUserListFun() {
		const data = {
			sortName: this.state.sortName
		};
		const url = "/api/getUserList";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				const userData = {
					thead: ["编号", "代理商", "电话", "邮箱", "地址", "余额", "描述", "操作"],
					tbody: data
				}
				this.setState({
					userData: userData
				});
			})
			.catch(e => console.log("报错信息：", e))
	}
	handleClick() {
		alert("待制作")
	}
	showAddUser() {
		this.setState({
			addUserShow: {
				display: "block"
			}
		});
	}
	hideAddUser() {
		this.setState({
			addUserShow: {
				display: "none"
			}
		});
	}
	setNewUsername(event) {
		this.setState({
			newname: event.target.value
		});
	}
	setNewUsermobile(event) {
		this.setState({
			newmobile: event.target.value
		});
	}
	setNewUseremail(event) {
		this.setState({
			newemail: event.target.value
		});
	}
	setNewUseraddress(event) {
		this.setState({
			newaddress: event.target.value
		});
	}
	setNewUserbalance(event) {
		this.setState({
			newbalance: event.target.value
		});
	}
	setNewUserdesc(event) {
		this.setState({
			newdesc: event.target.value
		});
	}
	setSearchName(event) {
		this.setState({
			sortName: event.target.value
		});
	}
	addUser() {
		var data = {
			name: this.state.newname,
			pwd: "111111",
			mobile: this.state.newmobile,
			email: this.state.newemail,
			address: this.state.newaddress,
			balance: this.state.newbalance - 0,
			desc: this.state.newdesc
		}
		console.log("新增代理商" + data)
		const url = "/api/addUser";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				console.log(data)
				if (data.status === "success") {
					this.getUserListFun();
					this.hideAddUser();
				}
			})
			.catch(e => console.log("报错信息：", e))
	}
	constructor(props) {
		super(props);
		this.state = {
			userData: {},
			addUserShow: {
				display: "none"
			},
			newname: '',
			newmobile: '',
			newemail: '',
			newaddress: '',
			newbalance: '',
			newdesc: '',
			changeBalance: '',
			sortName: ''
		};
	}
	componentWillMount() {
		this.getUserListFun();
	}
	render() {
		var data = this.state.userData;
		var oneUser = data.tbody && data.tbody.map((item, i) => {
			var _balance = item.balance ? item.balance.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,") : 0;
			return (
				<li key={i} ref="oneProject">
		  			<span>{i+1}</span>
		  			<span>{item.name}</span>
		  			<span>{item.mobile}</span>
		  			<span>{item.email}</span>
		  			<span>{item.address}</span>
		  			<span><div className="payMoney">{_balance}</div></span>
		  			<span>{item.desc}</span>
		  			<span>
		  				<div>
		  					<input type='number' min='1' placeholder='充值金额' ref={'user'+i}/>
							<div className='toolBtn' onClick={this.reSetMoney.bind(this,item.name,item.balance,i)}> 充值 </div>
		  				</div>
						<div className='toolBtn' onClick={this.deletUser.bind(this,item.name)}> 删除 </div>
		  			</span>
				</li>
			);
		});
		return (
			<div className="mainCon">
				<div className="container">
					<div className='searchBox'>
						<input type='text' placeholder="请输入角色关键字" onChange={this.setSearchName.bind(this)}/>
						<button onClick={this.getUserListFun.bind(this)}>查询角色</button>
					</div>
					<ul className="UserListTit">	
					  	<li>{
							data.thead && data.thead.map((item,i)=>{
					  			return(<span key={i}>{item}</span>);
					  		})
						}</li>
					</ul>
					<ul className="UserList">
					    <li onClick={this.showAddUser.bind(this)}>新增代理商</li>
					    <li ref="oneUser" style={this.state.addUserShow}>
				    		<span></span>
							<span><input type='text' value={this.state.newname} placeholder='代理商名称' onChange={this.setNewUsername.bind(this)}/></span>
							<span><input type='text' value={this.state.newmobile} placeholder='手机号' onChange={this.setNewUsermobile.bind(this)}/></span>
							<span><input type='text' value={this.state.newemail} placeholder='邮箱' onChange={this.setNewUseremail.bind(this)}/></span>
							<span><input type='text' value={this.state.newaddress} placeholder='地址' onChange={this.setNewUseraddress.bind(this)}/></span>
							<span><input type='text' value={this.state.newbalance} placeholder='余额' onChange={this.setNewUserbalance.bind(this)}/></span>
							<span><input type='text' value={this.state.newdesc} placeholder='描述' onChange={this.setNewUserdesc.bind(this)}/></span>
							<span>
								<div className='toolBtn' onClick={this.addUser.bind(this)}>新增代理商</div>
								<div className='toolBtn' onClick={this.hideAddUser.bind(this)}>取消</div>
							</span>
						</li>
					  	{data.tbody ? oneUser : <div>暂无代理商</div>}
					</ul>
				</div>
			</div>
		);
	}
}

export default withRouter(UserManagements);