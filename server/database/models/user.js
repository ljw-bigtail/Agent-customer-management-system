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
	}
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