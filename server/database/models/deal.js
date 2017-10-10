/**
 * 交易表
 * Created by zpl on 2017/9/1.
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;
let dealSchema = new Schema({
	"time": {
		type: Date,
		default: Date.now
	}, //	交易时间
	"userName": {
		type: String
	}, //	所属用户
	"type": {
		type: String
	}, //	交易类型	充值、扣款
	"amount": {
		type: Number,
		default: "0"
	}, //	交易金额
	"projectNum": {
		type: Number
	}, //	项目编号
	"balance": {
		type: Number
	} //	余额
});

dealSchema.statics = {
	applyNewPro: function(data, cb) {
		this.save(function(err, user) {
				if (err) {
					console.log(err)
				}
			})
			.exec(cb || function() {})
	},
	findBillByName: function(userName, callback) {
		this.find({
			"userName": userName
		}).sort({
			"num": -1
		}).exec((err, billList) => {
			if (err) {
				console.log(err)
			} else {
				callback(billList)
			}
		})
	},
	applyDeal: function(_dealData, callback) {
		//存数据
		console.log("_dealData~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + _dealData)
		this.create(_dealData, (err, dealData) => {
			if (err) {
				console.log(err);
				callback({
					mes: "wrong"
				});
			} else {
				callback(dealData);
			}
		})
	}
}

module.exports = mongoose.model('deal', dealSchema);