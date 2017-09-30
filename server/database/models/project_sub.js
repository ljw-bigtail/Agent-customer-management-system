/**
 * 项目子表
 * Created by zpl on 2017/9/1.
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;
let projectSubSchema = new Schema({
	"projectSubNum": {
		type: Number
	},
	"projectNum": {
		type: String
	}, //	所属项目
	"websiteName": {
		type: String
	}, // 网站名称
	"url": {
		type: String
	}, // 网址
	"templateNum": {
		type: Number
	}, // 模板号
	"amount": {
		type: Number,
		default: "0"
	}, // 金额
	"templateSrc": {
		type: String
	} // 模板地址
});

projectSubSchema.statics = {
	findSubByName: function(projectNum, callback) {
		this.find({
			'projectNum': projectNum
		}).exec((err, subList) => {
			if (err) {
				console.log(err)
			} else {
				callback(subList)
			}
		})
	},
	setSubByName: function(_projectSub, callback) {
		this.create(_projectSub, (err) => {
			if (err) {
				console.log(err)
				callback('wrong')
			} else {
				callback('success')
			}
		})
	}
}

module.exports = mongoose.model('project_sub', projectSubSchema);