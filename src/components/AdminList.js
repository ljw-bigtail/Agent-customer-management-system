import React, {
	Component
} from 'react';
import './AdminList.css';
import {
	Link
} from 'react-router-dom';

class ProList extends Component {
	agreePro(id) {
		const data = {
			id: id,
			proState: "开发中"
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
	devDone(id) {
		const data = {
			id: id,
			proState: "交付中"
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
	getProListFun(name) {
		const getData = {
			username: "",
			sortName: this.state.sortName
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
					thead: ["序号", "代理商", "编号", "项目名称", "交易金额", "申请日期", "交付日期", "服务截止日期", "项目状态", "操作"],
					tbody: _data
				}
				this.setState({
					proData: proData
				});
			})
			.catch(e => console.log("报错信息：", e))
	}
	setSearchName(event) {
		this.setState({
			sortName: event.target.value
		});
	}
	handleClick(id, toolBtn) {
		switch (toolBtn) {
			case "同意申请":
				this.agreePro(id);
				break;
			case "开发完毕":
				this.devDone(id);
				break;
			default:
				break;
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			proData: {},
			sortName: ""
		};
	}
	componentWillMount() {
		this.getProListFun();
	}
	render() {
		var data = this.state.proData;
		var listLength = data.tbody ? data.tbody.length : 0;
		var onePro = listLength !== 0 ? data.tbody && data.tbody.map((item, i) => {
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
					toolBtn = "同意申请";
					toolBtnStyle = "yesBtn";
					toolBorderColor = "yesColor";
					break;
				case ("开发中"):
					stateColor = "state_apply";
					toolBtn = "开发完毕";
					toolBtnStyle = "yesBtn";
					toolBorderColor = "yesColor";
					break;
				case ("已交付"):
					stateColor = "state_payment";
					break;
				case ("交付中"):
					stateColor = "state_paying";
					break;
				default:
					break;
			}
			return (
				<li key={item.num} ref="oneProject">
					<Link to="#">
			  			<span>{i+1}</span>
			  			<span>{item.userName}</span>
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
							<span className={toolBtnStyle} ref="toolBtn" onClick={this.handleClick.bind(this,item.num,toolBtn)}>{toolBtn}</span>
		  				</div>
		  			</span>
				</li>
			);
		}) : <div>无项目订单</div>;
		return (
			<div className="mainCon">
    			<div className="container">
					<div className='searchBox'>
    					<input type='text' placeholder="请输入项目关键字" onChange={this.setSearchName.bind(this)}/>
    					<button onClick={this.getProListFun.bind(this)}>查询项目</button>
    				</div>
			        <ul className="AllListTit">	
				      	<li>{
			      			data.thead && data.thead.map((item,i)=>{
				      			return(<span key={i}>{item}</span>);
				      		})
			      		}</li>
		        	</ul>
			        <ul className="AllList">	 
				      	{data.tbody ? onePro : <div>当前无项目数据</div>}
			        </ul>
    			</div>
    		</div>
		);
	}
}

export default ProList;