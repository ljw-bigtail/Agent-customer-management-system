import React, {
	Component
} from 'react';
import {
	withRouter
} from 'react-router-dom';
import './ProDetail.css';

class ProDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			proData: {},
			subData: {},
			display: "none",
			disable: true
		};
	}
	componentWillMount() {
		const data = {
			proNum: window.location.pathname.split("proDetail/")[1]
		};
		//获取项目信息
		const pro_url = "/api/getProData";
		fetch(pro_url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				this.setState({
					proData: data
				});
			})
			.catch(e => console.log("报错信息：", e))

		//获取项目的模板表
		const sub_url = "/api/getSubByName";
		fetch(sub_url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				this.setState({
					subData: data
				});
			})
			.catch(e => console.log("报错信息：", e))
	}

	HandleClick(e) {
		this.setState({
			display: "block",
			disable: !this.state.disable
		});
		e.target.style.display = "none";
	}
	HandleSave(_this) {
		_this.props.history.goBack();
		fetch("/api/changeProInfo", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.state.proData)
			})
			.then(response => response.json())
			.catch(e => console.log("报错信息：", e))

	}
	HandleChange(e) {
		var subName = e.target.name;
		let pro = this.state.proData;
		pro[subName] = e.target.value;
		this.setState({
			proData: pro
		});
	}
	render() {
		var _this = this;
		var data = this.state.proData;
		var _amount = data.amount && data.amount.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,");
		var _applicationDate = data.applicationDate && data.applicationDate.split("T")[0];
		var _payDate = data.payDate && data.payDate.split("T")[0];
		var _closingDate = data.closingDate && data.closingDate.split("T")[0];

		var subData = this.state.subData;

		var stateColor = '';
		var showHide = 'none';
		switch (data.status) {
			case ("申请中"):
				stateColor = "state_apply";
				showHide = "block";
				break;
			case ("开发中"):
				stateColor = "state_develop";
				break;
			case ("已交付"):
				stateColor = "state_payment";
				break;
			case ("交付中"):
				stateColor = "state_paying";
				break;
			default:
				break;
		};
		return (
			<div className='ProDetail'>
				<div className="setMesTit">
					<div ref="edit" style={{display:showHide}} onClick={this.HandleClick.bind(this)}>编辑</div>
					<div ref="save" style={{display:this.state.display}} onClick={this.HandleSave.bind(this,_this)}>保存</div>
				</div>
				<div className='messageBox'>
			      	<ul className='info'>
			      	  	<li>
		  		 			<span>项目编号</span>	
		  		 			<span>{data.num} </span>
		  		 		</li>
		  		 		<li>
		  		 			<span>项目名称</span>	
		  		 			<input type="text" name="name"  disabled={this.state.disable} value={data.name} onChange={this.HandleChange.bind(this)} />
		  		 		</li>
		  		 		<li>
		  		 			<span>交易金额</span>	
		  		 			{/*<input type="number" name="amount" disabled={this.state.disable} value={_amount} onChange={this.HandleChange.bind(this)} />*/}
		  		 			<span >{_amount}</span>
		  		 		</li>
		  		 		<li>
		  		 			<span>项目状态</span>
		  		 			<span className={stateColor}>{data.status}</span>
		  		 		</li>
			      	</ul>
			      	<ul className='info'>
			      	  	<li>
		  		 			<span>申请日期</span>	
		  		 			<span>{_applicationDate}</span>
		  		 		</li>
		  		 		<li>
		  		 			<span>交付日期</span>	
		  		 			<input type="date" name="payDate" disabled={this.state.disable} value={_payDate}  onChange={this.HandleChange.bind(this)} />
		  		 		</li>
		  		 		<li>
		  		 			<span>服务期限</span>	
		  		 			<span><input type="number" min="0" max="100" name="serviceLife" disabled={this.state.disable} value={data.serviceLife}  onChange={this.HandleChange.bind(this)} />年</span>
		  		 		</li>
		  		 		<li>
		  		 			<span>服务截止日期</span>	
		  		 			<span>{_closingDate}</span>
		  		 		</li>
			      	</ul>
			      	<ul className='info'>
			      	  	<li>
		  		 			<span>需求描述</span>	
		  		 			<textarea type='text' name="desc" disabled={this.state.disable} value={data.desc}  onChange={this.HandleChange.bind(this)}></textarea>
		  		 			
		  		 		</li>
			      	</ul>
				</div>
			    <div className='cardBox' ref='cardb'>
			      	<div className='card' ref='card' >{
		  	  	 	    subData.subList && subData.subList.map((data, index) => {
		  	  	 	    	var money_card = data.amount && data.amount.toString().replace(/(\d)(?=((\d{3})+)$)/g, "$1,");
		  	  		    	return (
			  	  		 		<div key={index} className='cardOne'>
			  	  		 			<div className="cardTitle">
			  	  		 				<span>{data.projectSubNum}</span>{data.websiteName}
				  	  		 		</div>
					  	  		 	<div className="cardMes">
					  	  		 		<ul>
				      	  		 			<li ref="cardUrl"><span>详细网址:</span><span>{data.url}</span></li>
				      	  		 			<li ref="cardMoney"><span>单项金额:</span><span>{money_card}</span></li>
				      	  		 			<li ref="cardNum"><span>模板编号:</span><span>{data.templateNum}</span></li>
					  	  		 		</ul>
					  	  		 		<img src={data.templateSrc} alt={"模板编号"+ data.templateNum} />
			  	  		 			</div>
			  	  		 		</div>	
		  		 			)
		  	  		    })
			      	}</div>
  	  	 		</div>
    		</div>
		)
	}
}

export default withRouter(ProDetail);