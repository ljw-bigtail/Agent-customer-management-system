import React, {
	Component
} from 'react';
import './ProList.css';
import {
	Link
} from 'react-router-dom';

class ListOne extends Component {
	sendChange() {
		if (this.props.dataChange) {
			this.props.dataChange()
		}
	}
	reSetMoney(amount, username) {
		const changeBalanceMessage = {
			name: username,
			balance: (document.getElementsByTagName("span")[2].textContent.replace(/,/g, "") - 0) + (amount.replace(/,/g, "") - 0),
			type: '项目退还'
		};
		const applyDealMessage = {
			userName: username,
			type: '项目退还',
			amount: (amount.replace(/,/g, "") - 0),
			balance: changeBalanceMessage.balance
		};
		const url = "/api/changeBalance";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(changeBalanceMessage)
			})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					const billUrl = "/api/applyDeal";
					fetch(billUrl, {
							method: "POST",
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(applyDealMessage)
						})
						.then(response => response.json())
						.then(data => {
							if (data.status === 'success') {
								//刷新
								this.sendChange();
								//刷新总金额
								document.getElementsByTagName("span")[2].innerHTML = changeBalanceMessage.balance.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,")
							} else {
								console.log("保存失败！")
							}
						})
						.catch(e => console.log("报错信息：", e))
				} else {
					console.log("保存失败！")
				}
			})
			.catch(e => console.log("报错信息：", e))
	}
	backout(id, amount) {
		const setProStateMessage = {
			id: id,
			proState: "已撤销"
		};
		const url = "/api/setProState";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(setProStateMessage)
			})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					//把扣掉的钱充值回来
					// console.log(this.props.username)
					this.reSetMoney(amount, this.props.username);
				} else {
					console.log("保存失败！")
				}
			})
			.catch(e => console.log("报错信息：", e))
	}
	notarize(id, serviceTime, amount) {
		var date = new Date();
		date.setYear(date.getFullYear() + serviceTime)
		const setProStateMessage = {
			id: id,
			proState: "已交付",
			closingDate: date
		};
		const url = "/api/setProState";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(setProStateMessage)
			})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					//刷新
					this.sendChange();
					// window.location.reload();
				} else {
					console.log("保存失败！")
				}
			})
			.catch(e => console.log("报错信息：", e))
	}
	handleClick(serviceTime, amount) {
		switch (this.refs.toolBtn.innerHTML) {
			case "撤销申请":
				this.backout(this.refs.proId.innerHTML, amount);
				break;
			case "确认交付":
				this.notarize(this.refs.proId.innerHTML, serviceTime, amount);
				break;
			default:
				break;
		}
	}
	render() {
		var data = this.props.data;
		var _amount = data.amount ? data.amount.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,") : 0;
		var _applicationDate = data.applicationDate ? data.applicationDate.split("T")[0] : '';
		var _payDate = data.payDate ? data.payDate.split("T")[0] : '';
		var _closingDate = data.closingDate ? data.closingDate.split("T")[0] : '';

		var stateColor = "",
			toolBtn = '',
			toolBtnStyle = '',
			toolBorderColor = '';
		switch (data.status) {
			case ("申请中"):
				stateColor = "state_apply";
				toolBtn = "撤销申请";
				toolBtnStyle = "yesBtn";
				toolBorderColor = "yesColor";
				break;
			case ("开发中"):
				stateColor = "state_develop";
				toolBtnStyle = "loadingBtn";
				toolBorderColor = "loadingColor";
				break;
			case ("已交付"):
				stateColor = "state_payment";
				break;
			case ("已撤销"):
				stateColor = "state_payment";
				break;
			case ("交付中"):
				stateColor = "state_paying";
				toolBtn = "确认交付";
				toolBtnStyle = "yesBtn";
				toolBorderColor = "yesColor";
				break;
			default:
				break;
		}
		return (
			<li>
				<Link to={`/main/pro/proDetail/${data.num}`}>
		  			<span>{this.props.index}</span>
		  			<span ref='proId'>{data.num}</span>
		  			<span>{data.name}</span>
		  			<span><div className="payMoney" ref='amount'>{_amount}</div></span>
		  			<span>{_applicationDate}</span>
		  			<span>{_payDate}</span>
		  			<span>{_closingDate}</span>
		  			<span className={stateColor}>{data.status}</span>
				</Link>
	  			<span>
	  				<div className={toolBorderColor}>
						<span className={toolBtnStyle} ref="toolBtn" onClick={this.handleClick.bind(this,data.serviceLife,_amount)}>{toolBtn}</span>
	  				</div>
	  			</span>
			</li>
		)
	}
}

class ProList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			proData: this.props.proData
		};
	}
	getProListFun() {
		const getData = {
			username: this.props.userName
		};
		const getUrl = "/api/getProList";
		fetch(getUrl, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(getData)
			})
			.then(response => response.json())
			.then(_data => {
				const proData = {
					thead: ["序号", "编号", "项目名称", "交易金额", "申请日期", "交付日期", "服务截止日期", "项目状态", "操作"],
					tbody: _data
				}
				this.setState({
					proData: proData
				});
			})
			.catch(e => console.log("报错信息：", e))
	}
	render() {
		var data = this.state.proData;
		var listLength = data.tbody ? data.tbody.length : 0;
		var onePro = listLength !== 0 ? data.tbody.map((item, i) => {
			return (
				<ListOne username={this.props.userName} data={item} index={i+1} key={i} dataChange={this.getProListFun.bind(this)} />
			)
		}) : <div>当前无项目订单，请进行项目申请</div>;
		return (
			<div className="mainCon">
    			<div className= "container">
			        <ul className="ProListTit">
				      	<li>{
			      			data.thead && data.thead.map((item,i)=>{
				      			return(<span key={i}>{item}</span>);
				      		})
			      		}</li>
		        	</ul>
			        <ul className="ProList">
				      	{data.tbody ? onePro : <div>正在查询，请稍后</div>}
			        </ul>
    			</div>
    		</div>
		);
	}
}

export default ProList;