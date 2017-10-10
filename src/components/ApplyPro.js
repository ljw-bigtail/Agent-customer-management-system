import React, {
	Component
} from 'react';
import './ApplyPro.css';
import phone from '../img/phone.png';



class ApplyPro extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOk: false,
			proNum: 0,
			picData: []
		};
	}
	componentWillMount() {
		fetch("/api/getTemplat", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: {}
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
			if (ipCor[0].value && ipCor[1].value && ipCor[2].value !== "") {
				document.getElementById("chooseTemp").style.display = "block";
				document.getElementsByClassName("cardBox")[0].setAttribute("data-index", e.target.id.split("_")[1]);
				e.target.innerText = "修改模板";
			} else {
				alert("请将内容信息填写完整再选择模板");
				if (ipCor[0].value === "") {
					ipCor[0].style.borderColor = "#ff6666";
				}
				if (ipCor[1].value === "") {
					ipCor[1].style.borderColor = "#ff6666";
				}
				if (ipCor[2].value === "") {
					ipCor[2].style.borderColor = "#ff6666";
				}
			}

		}
	}
	handleSave() {
		var date = new Date();
		var year = date.toLocaleDateString().split("/")[0];
		var month = (Array(2).join('0') + (date.getMonth() + 1)).slice(-2);
		var day = (Array(2).join('0') + (date.getDate())).slice(-2);
		var thisTime = year + month + day;
		var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
		const data = {
			userName: username,
			name: this.refs.name.value,
			amount: this.refs.amount.value,
			payDate: this.refs.payDate.value,
			serviceLife: this.refs.serviceLife.value,
			desc: this.refs.desc.value,
			num: thisTime
		};
		const url = "/api/applyNewPro";
		const getUrl = "/api/getProList";
		if (data.name && data.amount && data.payDate && data.serviceLife && data.desc !== "") {
			const getData = {
				username: data.userName
			};
			fetch(getUrl, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(getData)
			})
			.then(response => response.json())
			.then(_data => {
				var applyMoney= 0, bala = document.getElementsByTagName("span")[2].textContent.replace(",","")*1,newBala;
				Array.from(_data).forEach((item,i)=>{
					if(item.status==="申请中"){
						applyMoney += item.amount;
					}
				})
				newBala = bala-applyMoney-data.amount*1;
				if(newBala>0){
					fetch(url, {
						method: "POST",
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)
					})
					.then(response => response.json())
					.then(data => {
						this.setState({
							isOk: true,
							proNum: data.num
						});
						var spanS = document.getElementById("addCard").getElementsByTagName("span");
						spanS[0].style.display = "none";
						spanS[1].style.display = "block";
					})
					.catch(e => console.log("报错信息：", e))
				}else{
					alert("冻结余额为"+applyMoney+"，当前余额不足以支付，请联系管理员。");
				}
			})
			.catch(e => console.log("报错信息：", e))

		} else {
			alert("保存失败，请将信息内容填写完整");
			if (data.name === "") {
				this.refs.name.style.borderColor = "#ff6666";
			}
			if (data.amount === "") {
				this.refs.amount.style.borderColor = "#ff6666";
			}
			if (data.payDate === "") {
				this.refs.payDate.style.borderColor = "#ff6666";
			}
			if (data.serviceLife === "") {
				this.refs.serviceLife.style.borderColor = "#ff6666";
			}
			if (data.desc === "") {
				this.refs.desc.style.borderColor = "#ff6666";
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
		var cardMes = cardb.getElementsByClassName("cardMes")[index];
		var cardName = cardb.getElementsByClassName("cardName")[index];
		var cardUrl = cardb.getElementsByClassName("cardUrl")[index];
		var cardMoney = cardb.getElementsByClassName("cardMoney")[index];

		function findR(elem) {
			if (elem.tagName === "LI") {
				return elem;
			} else {
				return findR(elem.parentNode);
			}
		}
		var tarImg = findR(e.target).getElementsByTagName("img")[1];
		cardMes.style.background = "url('" + tarImg.getAttribute("src") + "')";
		cardMes.style.backgroundSize = "cover";
		chooseTemp.style.display = "none";
		const datas = {
			projectSubNum: cardb.getAttribute("data-index"),
			projectNum: this.state.proNum,
			websiteName: cardName.value,
			url: cardUrl.value,
			amount: cardMoney.value,
			templateNum: index,
			templateSrc: tarImg.getAttribute("src")
		};
		const url = "/api/setSubByName";
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(datas)
			})
			.then(response => response.json())
			.then(data => {
				this.setState({
					isOk: true
				});
			})
			.catch(e => console.log("报错信息：", e))
	}
	render() {
		var i = 0;
		return (
			<div className='ApplyPro'>
				<div className="setMesTit">
					新增项目申请
					<div onClick={this.handleSave.bind(this)}>保存并付费</div>
				</div>	
			    <div className='messageBox'>
			      	<ul className='info'>
						<li>
		  		 			<span>项目名称</span>	
		  		 			<input ref="name" type='text' placeholder="请输入项目名称" onBlur={this.handleBlur} />
		  		 		</li>
						<li>
		  		 			<span>交易金额</span>	
		  		 			<input ref="amount" type='number' placeholder="请输入数字"  onBlur={this.handleBlur} />
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
					 			<div className="cardTitle" id="cardId">初始层</div>
				  	  		 	<div className="cardMes">
				  	  		 		<ul>
				  	  		 			<li><span>网站名称:</span><input className="cardName" type='text' placeholder="请输入网站名称" /></li>
				  	  		 			<li><span>详细网址:</span><input className="cardUrl" type='text' placeholder="请输入网址"  /></li>
				  	  		 			<li><span>单项金额:</span><input className="cardMoney" type='number' placeholder="请输入数字" /></li>
				  	  		 			<li className="cardNum"><button className="chooseTempBtn" id="thisBtnId_0">选择模板</button></li>
				  	  		 		</ul>
					 			</div>
					 		</div>
				 		</div>
				 		<div className='cardOne addCardOne' id="addCard">
				 			<span style={{color:"#999"}}>+</span>
				 			<span style={{display:"none"}} onClick={
				 				function(){
				 					var card = document.getElementById("cardOne").cloneNode(true);
				 					i++;
									card.setAttribute("id","cardOne_"+i);
									card.getElementsByTagName("div")[0].setAttribute("id","cardId_"+i);
									card.getElementsByTagName("div")[0].innerHTML = i;
									card.getElementsByTagName("button")[0].setAttribute("id","thisBtnId_"+i);
				 					document.getElementById("card").insertBefore(card,document.getElementById("addCard"));
				 				}
				 			}>+</span>
				 		</div>
		      	    </div>
		  	  	</div>
	    		<div className='chooseTemp' id='chooseTemp' ref="chooseTemp" onClick={this.keyClick.bind(this)}>
					<ul>{this.state.picData.length&&this.state.picData.map((item, i) => {
						return (
							<li key={item.num} data-index={item.num}>
								<img src={phone} alt="temp" />
								<div>
									<img src={item.url} alt="temp" />
								</div>
							</li>
						);
					})}</ul>
	    		</div>
    		</div>
		)
	}
}

export default ApplyPro;