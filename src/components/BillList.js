import React, {
	Component
} from 'react';
import {
	Link
} from 'react-router-dom';
import './BillList.css';

class BillList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			billData: {}
		};
	}
	componentWillMount() {
		const data = {
			username: this.props.userName
		};
		const url = "/api/getBillList";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				const billData = {
					thead: ["序号", "交易日期", "交易金额", "交易类型", "项目编号", "余额"],
					tbody: data
				}
				this.setState({
					billData: billData
				});
			})
			.catch(e => console.log("报错信息：", e))
	}
	render() {
		var data = this.state.billData;
		var $li = data.tbody && data.tbody.map((item, i) => {
			var cls = item.type === "充值" ? "reChange" : "pay";
			var _amount = item.amount && item.amount.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,");
			var _time = item.time.split("T")[0]
			return (
				<li key={i} >
		  			<span>{i+1}</span>
		  			<span>{_time}</span>
		  			<span>
						<div className={cls}>
		  					{_amount}
		  				</div>
		  			</span>
		  			<span>{item.type}</span>
		  			<span>{item.projectNum ? <Link to={`/main/pro/proDetail/${item.projectNum}`}>{item.projectNum}</Link> : ''}</span>
		  			<span>{item.balance}</span>
				</li>
			);
		});
		return (
			<div className="mainCon" onClick={this.onClick}>
	    		<div className="container">
			        <ul className="BillListTit">
				      	<li>{
				      		data.thead && data.thead.map((item,i)=>{
				      			return(<span key={i}>{item}</span>);
				      		})
		      			}</li>
			        </ul>
			        <ul className="BillList">
			      		{data.tbody ? $li : <div>暂无交易记录</div>}
			        </ul>
		        </div>
	        </div>
		);
	}
}

export default BillList;