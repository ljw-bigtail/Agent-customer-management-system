import React, {
	Component
} from 'react';
import {
	withRouter
} from 'react-router-dom';
import './ApplyPro.css';
import phone from '../img/phone.png';

class ApplyPro extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOk: false,
			picData: [],
			productMes: false,
			proItemMes: false
		};
	}
	componentWillMount() {
		fetch("/api/getTemplat", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({})
			})
			.then(response => response.json())
			.then(data => {
				this.setState({
					picData: data.templatList
				})
			})
			.catch(e => console.log("报错信息：", e))
	}
	handleClick(e) {
		if (e.target.nodeName === "BUTTON") {
			var ipCor = e.target.parentElement.parentElement.getElementsByTagName("input");
			if (ipCor[0].value && ipCor[1].value !== "") {
				this.setState({
					proItemMes: true
				})
				document.getElementById("chooseTemp").style.display = "block";
				document.getElementsByClassName("cardBox")[0].setAttribute("data-index", e.target.id.split("_")[1]);
				e.target.innerText = "修改模板";
			} else {
				alert("请将内容信息填写完整再选择模板");
				if (ipCor[0].value === "") {
					ipCor[0].style.borderColor = "#ff6666";
					this.setState({
						proItemMes: false
					})
				}
				if (ipCor[1].value === "") {
					ipCor[1].style.borderColor = "#ff6666";
					this.setState({
						proItemMes: false
					})
				}
			}
		}
	}
	handleSave() {
		//逻辑：先存项目信息，返回的值是项目编号等信息，根据项目信息来存储模板信息表（json）
		//获取项目信息
		var date = new Date();
		var year = date.toLocaleDateString().split("/")[0];
		var month = (Array(2).join('0') + (date.getMonth() + 1)).slice(-2);
		var day = (Array(2).join('0') + (date.getDate())).slice(-2);
		var thisTime = year + month + day;
		var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
		const proData = {
			userName: username,
			name: this.refs.name.value,
			amount: this.refs.amount.value,
			payDate: this.refs.payDate.value,
			serviceLife: this.refs.serviceLife.value,
			desc: this.refs.desc.value,
			num: thisTime
		};

		//获取模板信息
		const itemData = [];
		//projectSubNum
		Array.from(document.getElementsByClassName('cardTitle')).forEach(function(item, i) {
			if (i > 0) {
				itemData.push({
					projectNum: '',
					projectSubNum: item.textContent,
					websiteName: '',
					url: '',
					templateNum: '',
					templateSrc: '',
				})
			}
		})

		//websiteName
		Array.from(document.getElementsByClassName('cardName')).forEach(function(item, i) {
			if (i > 0) {
				itemData[i - 1].websiteName = item.value
			}
		})

		//url
		Array.from(document.getElementsByClassName('cardUrl')).forEach(function(item, i) {
			if (i > 0) {
				itemData[i - 1].url = item.value
			}
		})

		//templateNum
		Array.from(document.getElementsByClassName('choosedTempSrc')).forEach(function(item, i) {
			if (i > 0) {
				itemData[i - 1].templateNum = item.alt
			}
		})

		//templateSrc
		Array.from(document.getElementsByClassName('choosedTempSrc')).forEach(function(item, i) {
			if (i > 0) {
				itemData[i - 1].templateSrc = item.src
			}
		})
		console.log(proData)
		console.log(itemData)

		//发送请求前需要验证两部分是否有值
		var haveMessage = proData.name !== "" && proData.amount !== "" && proData.payDate !== "" && proData.serviceLife !== "" && proData.desc !== "",
			haveCard = document.getElementsByClassName("cardOne").length > 2;
		if (haveMessage) {
			if (haveCard) {
				this.setState({
					productMes: true
				})
				var bala = document.getElementsByTagName("span")[2].textContent.replace(",", "") * 1;
				if (bala - proData.amount >= 0) {
					console.log("正在申请···");
					const proUrl = "/api/applyNewPro";
					fetch(proUrl, {
							method: "POST",
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(proData)
						})
						.then(response => response.json())
						.then(prodata => {
							Array.from(document.getElementsByClassName('cardUrl')).forEach(function(item, i) {
								if (i > 0) {
									itemData[i - 1].projectNum = prodata.num
								}
							})
							const subUrl = "/api/setSubByName";
							fetch(subUrl, {
									method: "POST",
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify(itemData)
								})
								.then(response => response.json())
								.then((data) => {
									//开始扣款
									var bala = document.getElementsByTagName("span")[2].textContent.replace(",", "") - 0 - proData.amount;
									const cutData = {
										name: proData.userName,
										balance: bala
									};
									const billData = {
										userName: proData.userName,
										type: '扣款',
										amount: proData.amount,
										projectNum: prodata.num,
										balance: bala
									};
									console.log(cutData)
									console.log(billData)
									const cutUrl = "/api/changeBalance";
									const billUrl = "/api/applyDeal";
									fetch(cutUrl, {
											method: "POST",
											headers: {
												'Content-Type': 'application/json'
											},
											body: JSON.stringify(cutData)
										})
										.then(response => response.json())
										.then(data => {
											if (data.status === 'success') {
												//创建账单
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
															console.log("申请成功");
															//返回首页
															this.props.history.push("/main/pro");
															window.location.reload();
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
									this.setState({
										isOk: true
									});
								})
								.catch(e => console.log("报错信息：", e))
						})
						.catch(e => console.log("报错信息：", e))
				} else {
					alert("余额不足，请联系管理员。");
				}
			} else {
				alert("请至少创建一个模板。");
			}
		} else {
			alert("保存失败，请将信息内容填写完整，并至少创建一个模板。");
			if (proData.name === "") {
				this.refs.name.style.borderColor = "#ff6666";
				this.setState({
					productMes: false
				})
			}
			if (proData.amount === "") {
				this.refs.amount.style.borderColor = "#ff6666";
				this.setState({
					productMes: false
				})
			}
			if (proData.payDate === "") {
				this.refs.payDate.style.borderColor = "#ff6666";
				this.setState({
					productMes: false
				})
			}
			if (proData.serviceLife === "") {
				this.refs.serviceLife.style.borderColor = "#ff6666";
				this.setState({
					productMes: false
				})
			}
			if (proData.desc === "") {
				this.refs.desc.style.borderColor = "#ff6666";
				this.setState({
					productMes: false
				})
			}
		}
	}
	handleBlur(e) {
		if (e.target.value === "") {
			e.target.style.borderColor = "#ff6666";
		} else {
			e.target.style.borderColor = "#F0F0F0";
		}
	}
	keyClick(e) {
		var chooseTemp = this.refs.chooseTemp;
		var cardb = this.refs.cardb;
		var index = cardb.getAttribute("data-index") * 1;
		var cardName = cardb.getElementsByClassName("cardName")[index];
		var cardUrl = cardb.getElementsByClassName("cardUrl")[index];

		function findR(elem) {
			if (!elem) {
				return false;
			}
			if (elem.tagName === "LI") {
				return elem;
			} else {
				return findR(elem.parentNode);
			}
		}
		if (e.target.nodeName === 'DIV' || e.target.nodeName === 'UL') {
			//点击空白处无效果
			return false;
		}
		var tarImg = findR(e.target).getElementsByTagName("img")[1];
		chooseTemp.style.display = "none";
		const datas = {
			projectSubNum: index,
			projectNum: 0,
			websiteName: cardName.value,
			url: cardUrl.value,
			templateNum: tarImg.getAttribute("data-index"),
			templateSrc: tarImg.getAttribute("src")
		};
		document.getElementById('cardBgPic_' + index).src = datas.templateSrc;
		document.getElementById('cardBgPic_' + index).setAttribute('alt', datas.templateNum);
	}
	clonePrevCard(needValue) {
		var cardData = document.getElementsByClassName("cardOne");
		var i = cardData.length - 1;
		var card = cardData[cardData.length - 2].cloneNode(true);
		card.setAttribute("id", "cardOne_" + i);
		card.getElementsByTagName("div")[0].setAttribute("id", "cardId_" + i);
		card.getElementsByTagName("div")[0].innerHTML = i;
		card.getElementsByTagName("button")[0].setAttribute("id", "thisBtnId_" + i);
		card.getElementsByTagName("img")[0].setAttribute("id", "cardBgPic_" + i);
		//不传值
		if (!needValue) {
			card.getElementsByTagName("input")[0].value = '';
			card.getElementsByTagName("input")[1].value = '';
			card.getElementsByTagName("img")[0].src = '';
			card.getElementsByTagName("img")[0].setAttribute('alt', '');
		}
		document.getElementById("card").insertBefore(card, document.getElementById("addCard"));
	}
	render() {
		return (
			<div className='ApplyPro'>
				<div className="setMesTit">
					新增项目申请
					<div onClick={this.handleSave.bind(this)}>保存并提交</div>
				</div>	
			    <div className='messageBox'>
			      	<ul className='info'>
						<li>
		  		 			<span>项目名称</span>	
		  		 			<input ref="name" type='text' placeholder="请输入项目名称" onBlur={this.handleBlur} />
		  		 		</li>
						<li>
		  		 			<span>交易金额</span>	
		  		 			<input ref="amount" type='number' placeholder="请输入合同金额，确认后不可修改"  onBlur={this.handleBlur} />
		  		 		</li>
						<li>
		  		 			<span>交付日期</span>	
		  		 			<input ref="payDate" type='date'  onBlur={this.handleBlur} />
		  		 		</li>
						<li className="proYear">
		  		 			<span>服务期限</span>	
		  		 			<input ref="serviceLife" type='number' placeholder="请输入数字" min="0" max="100"  onBlur={this.handleBlur} />
		  		 		</li>
						<li className="proNeed">
		  		 			<span>需求描述</span>	
		  		 			<textarea ref="desc" type='text' placeholder="请输入需求描述"  onBlur={this.handleBlur} />
		  		 		</li>
			      	</ul>
			    </div>
				<div className='cardBox' ref='cardb'>
		      	    <div className='card' id="card"  onClick={this.handleClick.bind(this)}>
		      	    	<div style={{display:"none"}}>
					 		<div className='cardOne' id="cardOne">
								<div className="cardTitle" id="cardId">0</div>
				  	  		 	<div className="cardMes">
				  	  		 		<ul>
				  	  		 			<li><span>网站名称：</span><input className="cardName" type='text' placeholder="请输入网站名称" /></li>
				  	  		 			<li><span>详细网址：</span><input className="cardUrl" type='text' placeholder="请输入网址"  /></li>
				  	  		 			<li className="cardNum">
				  	  		 				<button className="chooseTempBtn" id="thisBtnId_0">选择模板</button>
			  	  		 				</li>
				  	  		 		</ul>
				  	  		 		<img id='cardBgPic' src='' alt='' className='choosedTempSrc'/>
					 			</div>
					 		</div>
				 		</div>
				 		<div className='cardOne addCardOne' id="addCard">
				 			<span onClick={this.clonePrevCard.bind(this, false)}><i>+</i></span>
				 			<span onClick={this.clonePrevCard.bind(this, true)}><i>RE</i></span>
				 		</div>
		      	    </div>
		  	  	</div>
	    		<div className='chooseTemp' id='chooseTemp' ref="chooseTemp" onClick={this.keyClick.bind(this)}>
					<ul>{this.state.picData.length&&this.state.picData.map((item, i) => {
						return (
							<li key={item.num}>
								<img src={phone} alt="temp"/>
								<div>
									<img src={item.url} alt="temp" data-index={item.num}/>
								</div>
							</li>
						);
					})}</ul>
	    		</div>
    		</div>
		)
	}
}

export default withRouter(ApplyPro);