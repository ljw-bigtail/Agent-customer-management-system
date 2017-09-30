import React, {
    Component
} from 'react';
import {
    withRouter
} from 'react-router-dom';
import './Setting.css';

class Setting extends Component {
    constructor() {
        super();
        this.state = {
            isOk1: false,
            isOk2: false,
            isOk3: false
        }
    }
    componentWillMount() {
        const url = "/api/getUser";
        var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
        const data = {
            username: username
        };
        fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => {
                var mobile = this.refs.mobileNum;
                var address = this.refs.addressTet;
                var email = this.refs.emailTxt;
                mobile.value = data.mobile;
                address.value = data.address;
                email.value = data.email;
            })
            .catch((e) => console.log("报错信息：", e))
    }
    checkTel() {
        /*电话校验*/
        var mobile = this.refs.mobileNum.value;
        var info = this.refs.phoneInf;
        if (!(/^1[34578]\d{9}$/.test(mobile))) {
            info.style.display = 'block';
            return false;
        }
        this.setState({
            isOk1: true
        })
        info.style.display = 'none';
    }
    checkAddress() {
        /*地址校验*/
        var address = this.refs.addressTet.value;
        var info1 = this.refs.addressInf;
        if (address.length === 0) {

            info1.style.display = 'block';
            return false;
        }
        this.setState({
            isOk2: true
        })
        info1.style.display = 'none';
    }
    checkEmail() {
        /*邮箱校验*/
        var email = this.refs.emailTxt.value;
        var info2 = this.refs.emailInf;
        if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
            info2.style.display = 'block';
            return false;
        }
        this.setState({
            isOk3: true
        })
        info2.style.display = 'none';
    }
    save() {
        const url = "/api/setUser";
        var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
        var mobile = this.refs.mobileNum.value;
        var address = this.refs.addressTet.value;
        var email = this.refs.emailTxt.value;
        if (mobile === '' || address === '' || email === '') {
            return false;
        }
        if (!(this.state.isOk1 || this.state.isOk2 || this.state.isOk3)) {
            return false;
        }
        const data = {
            name: username,
            mobile: mobile,
            email: email,
            address: address
        };
        fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => {
                var info2 = this.refs.emailInf;
                var info = this.refs.phoneInf;
                var info1 = this.refs.addressInf;
                var successINO = this.refs.successINO;
                info1.style.display = 'none';
                info.style.display = 'none';
                info2.style.display = 'none';
                if (data.status === 'success') {
                    successINO.innerHTML = '保存成功';
                } else {
                    successINO.innerHTML = '保存失败';
                }
                successINO.style.display = 'block';
                this.setState({
                    isOk1: false,
                    isOk2: false,
                    isOk3: false
                })
                setTimeout(function() {
                    successINO.innerHTML = '';
                    successINO.style.display = 'none';
                }, 2000)

            })
            .catch((e) => console.log("报错信息：", e))
    }
    checkPwd() {
        /*对比原始密码*/
        const url = "/api/checkPassword";
        var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
        var password = this.refs.oldpwd.value;
        if (password.length === 0) {
            return false;
        }
        const data = {
            username: username,
            password: password
        };
        fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => {
                var inf = this.refs.oldpwdIfo;
                if (data.status === 'error') {
                    inf.style.display = 'block';
                    return false;
                }
                inf.style.display = 'none'

            })
            .catch((e) => console.log("报错信息：", e))
    }
    checkNewPwd() {
        var newpwd1 = this.refs.newpwd1.value;
        var pwdIfo = this.refs.pwdIfo;
        if (newpwd1.length >= 6) {
            pwdIfo.style.display = 'none';
        } else {
            pwdIfo.style.display = 'block';
        }
    }
    checkReNewPwd() {
        var newpwd1 = this.refs.newpwd1.value;
        var newpwd2 = this.refs.newpwd2.value;
        var errorIfo = this.refs.newpwdIfo;
        if (newpwd1 !== newpwd2) {
            errorIfo.style.display = 'block';
        } else {
            errorIfo.style.display = 'none';
        }
    }
    changePwd() {
        /*修改密码*/
        const url = "/api/changePassword";
        var username = document.cookie ? JSON.parse('{"' + document.cookie.replace(/;/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}').username : undefined;
        var oldpwd = this.refs.oldpwd.value;
        var newpwd1 = this.refs.newpwd1.value;
        var newpwd2 = this.refs.newpwd2.value;
        var errorIfo = this.refs.newpwdIfo; //新密码2
        var pwdIfo = this.refs.pwdIfo; //新密码

        console.log(oldpwd !== newpwd1)
        console.log(newpwd1.length >= 6)
        console.log(newpwd1 !== newpwd2)
        if (oldpwd === newpwd1 && newpwd1.length < 6) {
            pwdIfo.style.display = 'block';
            return false;
        } else if (newpwd1 !== newpwd2) {
            errorIfo.style.display = 'block';
            return false;
        }

        const data = {
            name: username,
            pwd: newpwd2
        };
        fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => {
                var successINO = this.refs.successINO;
                if (data.status === 'success') {
                    successINO.innerHTML = '保存成功';

                    console.log("修改密码，当前的Cookie：" + document.cookie);
                    this.delCookie("username")
                    console.log("修改密码，删除后的Cookie：" + document.cookie);

                    // this.props.history.push("/");
                } else {
                    successINO.innerHTML = '保存失败';
                }
                successINO.style.display = 'block';
                setTimeout(function() {
                    successINO.innerHTML = '';
                    successINO.style.display = 'none';
                }, 2000)

            })
            .catch((e) => console.log("报错信息：", e))
    }
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
            console.log(document.cookie)
        } else {
            console.log("删除失败")
        }
    }
    render() {
        return (
            <div className = "setBox">
                <p ref = "successINO" className = "successINO"></p>
                <div className="setMes">
                    <div className="setMesTit">基本设置</div>
                    <ul>
                        <li>
                            <div className="name">
                                <span> 账户名称 </span>
                                <span className="stopBtn"> {this.props.username} </span>
                            </div>
                        </li>
                        <li>
                            <div className = "mobile">
                                <span> 联系电话 </span>
                                <input type = "text" data-isOk={this.state.isOk1} onBlur = {this.checkTel.bind(this)}  ref = "mobileNum" name = "mobile" placeholder = "请输入手机号码" />
                            </div>
                            <span ref = "phoneInf" className = "inf"> 电话信息输入不正确 </span>
                        </li>
                        <li>
                            <div className = "address">
                                <span> 地址 </span>
                                <input type = "text" data-isOk={this.state.isOk2} onBlur = {this.checkAddress.bind(this)} ref = "addressTet" name = "address" placeholder = "请输入地址" />
                            </div>
                            <span ref = "addressInf" className = "inf"> 地址信息输入不正确 </span>
                        </li>
                        <li>
                            <div className = "email">
                                <span> 邮箱 </span>
                                <input type="email" data-isOk={this.state.isOk3} onBlur = {this.checkEmail.bind(this)} ref = "emailTxt" name = "email" placeholder = "请输入邮箱" />
                            </div>
                            <span ref = "emailInf" className = "inf"> 邮箱信息输入不正确 </span>
                        </li>
                    </ul>

                    <div className = "btnBox">
                        <button onClick = {this.save.bind(this)}> 保存 </button>
                        <button> 取消 </button>
                    </div>
                </div>
                <div className="changePwd">
                    <div className="setMesTit">修改密码</div>
                    <ul>
                        <li>
                            <div className="pwdOld">
                                <span>原始密码</span>
                                <input type="password" onBlur={this.checkPwd.bind(this)} ref="oldpwd" name="mobile" />
                            </div>
                            <span ref="oldpwdIfo" className = "inf">密码不正确</span>
                        </li>
                        <li>
                            <div className="mobile">
                                <span>新密码</span>
                                <input onChange={this.checkNewPwd.bind(this)} type="password" ref="newpwd1" name="mobile" placeholder="至少6位，支持字母与数字" />
                            </div>
                             <span ref="pwdIfo" className = "inf">新密码不符规则</span>
                        </li>
                        <li>
                            <div className="address">
                                <span>确认新密码</span>
                                <input onChange={this.checkReNewPwd.bind(this)} type="password" ref="newpwd2" name="address" placeholder="再次输入新密码" />
                            </div>
                             <span ref="newpwdIfo" className = "inf">两次密码不一致</span>
                        </li>
                    </ul>
                    <div className="btnBox">
                        <button onClick={this.changePwd.bind(this)}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Setting);