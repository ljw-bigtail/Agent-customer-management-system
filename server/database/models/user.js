/**
 * 用户表
 * Created by zpl on 2017/8/31
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;
var _underscore = require('underscore');

//引入一个加密算法的库
let bcrypt = require('bcryptjs');
//设置加盐的程度
let SALT_WORK_FACTOR = 10;

//邮件发送模块
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'qq',
	auth: {
		user: '747624075@qq.com',
		pass: 'klarzhzbchjdbejd' //授权码,通过QQ获取
	}
});

let userSchema = new Schema({
	// 支持的数据类型 String  Number  Date  Buffer  Boolean  Mixed  Objectid  Array
	"name": {
		//设定：name唯一
		unique: true,
		type: String
	}, // 账号
	"pwd": {
		type: String
	}, // 密码
	"mobile": {
		type: String
	}, // 联系电话
	"address": {
		type: String
	}, // 地址
	"email": {
		type: String
	}, // 邮箱
	"balance": {
		//初始余额为0
		type: Number,
		default: "0"
	}, // 余额
	"group": {
		//设定：普通代理 - 0，伙伴 - 1，管理员 - 10
		type: Number,
		default: 0
	}, // 分组
	"desc": {
		type: String
	} // 描述
});

userSchema.statics = {
	findUserByName: function(user, callback) {
		this.findOne({
			"name": user
		}).exec((err, _user) => {
			if (err) {
				//logger.error(err);
				console.log(err);
			} else {
				callback(_user);
			}
		});
	},
	addUser: function(user, callback) {
		var self = this;
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.pwd, salt, function(err, hash) {
				if (err) {
					return next(err);
				}
				var _newUser = _underscore.extend(user, {
					"pwd": hash
				});
				self.create(_newUser, (err) => {
					if (err) {
						console.log(err);
						callback("faile");
					} else {
						callback("success");
					}
				})
			})
		})
	},
	deletUserByName: function(user, callback) {
		this.remove({
			"name": user
		}).exec((err) => {
			if (err) {
				//logger.error(err);
				console.log(err);
				callback("faile");
			} else {
				callback("success");
			}
		});
	},
	findUserList: function(sortName, callback) {
		if (sortName === '') {
			this.find({
				"group": 0
			}).sort({
				"_id": -1
			}).exec((err, userList) => {
				if (err) {
					//logger.error(err);
					console.log(err);
				} else {
					callback(userList);
				}
			});
		} else {
			var _name = new RegExp(sortName, "g");
			this.find({
				"name": _name
			}).sort({
				"_id": -1
			}).exec((err, userList) => {
				if (err) {
					//logger.error(err);
					console.log(err);
				} else {
					callback(userList);
				}
			});
		}

	},
	setUserByName: function(data, callback) {
		this.findOne({
			"name": data.name
		}).exec((err, _user) => {
			if (err) {
				//logger.error(err);
				console.log(err);
			} else {
				console.log("需要设置的用户：\n" + _user)
				var _newProState = _underscore.extend(_user, {
					"mobile": data.mobile,
					"address": data.address,
					"email": data.email
				});
				_newProState.save((err) => {
					if (err) {
						console.log(err);
						callback('wrong');
					} else {
						callback('success');
					}
				});
			}
		});
	},
	changePassword: function(data, callback) {
		this.findOne({
			"name": data.name
		}).exec((err, _user) => {
			if (err) {
				//logger.error(err);
				console.log(err);
			} else {
				//加盐
				bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
					if (err) {
						return next(err);
					}
					bcrypt.hash(data.pwd, salt, function(err, hash) {
						if (err) {
							return next(err);
						}
						console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~\n需要修改密码的用户：" + _user + '\n原始的密码：' + _user.pwd + '\n修改后的密码：' + data.pwd)
						var _newProState = _underscore.extend(_user, {
							"pwd": hash
						});
						_newProState.save((err) => {
							if (err) {
								console.log(err);
								callback('faile');
							} else {
								callback('success');
							}
						});
					})
				})
			}
		});
	},
	comparePassword: function(_password, thisPwd, cb) {
		bcrypt.compare(_password, thisPwd, function(err, isMatch) {
			if (err) {
				return cb(err);
			}
			cb(null, isMatch)
		})
	},
	changeBalance: function(data, callback) {
		this.findOne({
			"name": data.name
		}).exec((err, _user) => {
			if (err) {
				//logger.error(err);
				console.log(err);
			} else {
				var chazhi = _user.balance - data.balance;
				var howToChange = '';
				if (chazhi > 0) {
					howToChange = '扣款';
				} else {
					chazhi = 0 - chazhi;
					howToChange = '充值';
				}
				var mailOptionsToUser = {
					from: '747624075@qq.com', // 发送者
					to: _user.email, // 接受者
					subject: '余额变动告知-云适配营销管理平台', // 标题
					text: howToChange + '金额：' + chazhi + '元人民币。\n当前余额：' + data.balance + '。'
				};
				var mailOptionsToAdmin = {
					from: '747624075@qq.com', // 发送者
					to: '747624075@qq.com', // 接受者
					subject: '余额变动告知', // 标题
					text: howToChange + '角色：' + data.name + '。\n' + howToChange + '金额：' + chazhi + '元人民币。\n当前余额：' + data.balance + '。'
				};
				var _newProState = _underscore.extend(_user, {
					"balance": data.balance
				});
				_newProState.save((err) => {
					if (err) {
						console.log(err);
						callback('faile');
					} else {
						transporter.sendMail(mailOptionsToUser, function(err, info) {
							if (err) {
								console.log(err);
								return;
							}
							console.log('发送成功');
						});
						transporter.sendMail(mailOptionsToAdmin, function(err, info) {
							if (err) {
								console.log(err);
								return;
							}
							console.log('发送成功');
						});
						callback('success');
					}
				});
			}
		});
	},
}

userSchema.methods = {
	//校验密码
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.pwd, function(err, isMatch) {
			if (err) {
				return cb(err);
			}
			cb(null, isMatch)
		})
	}
}

module.exports = mongoose.model('user', userSchema);