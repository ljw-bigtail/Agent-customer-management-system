import React, {
	Component
} from 'react';
import './ProList.css';
import {
	Link
} from 'react-router-dom';

class ProList extends Component {
	backout(id, serviceTime) {
		const data = {
			id: id,
			proState: "已撤销"
		};
		console.log(data);
		const url = "/api/setProState";
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
					this.getProListFun();
				} else {
					console.log("保存失败！")
				}
			})
			.catch(e => console.log("报错信息：", e))
	}
	notarize(id, serviceTime, amount) {
		var date = new Date();
		date.setYear(date.getFullYear() + serviceTime)
		const data = {
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
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					//刷新
					this.getProListFun();
				} else {
					console.log("保存失败！")
				}
			})
			.catch(e => console.log("报错信息：", e))
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
	handleClick(id, serviceTime, toolBtn, amount) {
		switch (toolBtn) {
			case "撤销申请":
				this.backout(id, serviceTime);
				break;
			case "确认交付":
				this.notarize(id, serviceTime, amount);
				break;
			default:
				break;
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			proData: {}
		};
	}
	componentWillMount() {
		const data = {
			username: this.props.userName
		};
		const url = "/api/getProList";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				const proData = {
					thead: ["序号", "编号", "项目名称", "交易金额", "申请日期", "交付日期", "服务截止日期", "项目状态", "操作"],
					tbody: data
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
			var _amount = item.amount ? item.amount.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,") : 0;
			var _applicationDate = item.applicationDate ? item.applicationDate.split("T")[0] : '';
			var _payDate = item.payDate ? item.payDate.split("T")[0] : '';
			var _closingDate = item.closingDate ? item.closingDate.split("T")[0] : '';

			var stateColor = "",
				toolBtn = '',
				toolBtnStyle = '',
				toolBorderColor = '';
			switch (item.status) {
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
				<li key={item.num} ref="oneProject">
					<Link to={`/main/pro/proDetail/${item.num}`}>
			  			<span>{i+1}</span>
			  			<span>{item.num}</span>
			  			<span>{item.name}</span>
			  			<span><div className="payMoney">{_amount}</div></span>
			  			<span>{_applicationDate}</span>
			  			<span>{_payDate}</span>
			  			<span>{_closingDate}</span>
			  			<span className={stateColor}>{item.status}</span>
					</Link>
		  			<span>
		  				<div className={toolBorderColor}>
							<span className={toolBtnStyle} ref="toolBtn" onClick={this.handleClick.bind(this,item.num,item.serviceLife,toolBtn,item.amount)}>{toolBtn}</span>
		  				</div>
		  			</span>
				</li>
			);
		}) : <div>当前无项目订单，请进行项目申请</div>;
		return (
			<div className="mainCon">
    			<div className="container">
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