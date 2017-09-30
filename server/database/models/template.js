/**
 * 模板表
 * Created by zpl on 2017/9/1.
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;
let templateSchema = new Schema({
	"num": {
		unique: true,
		type: Number
	}, //	模板编号	唯一
	"name": {
		type: String
	}, //	模板名称
	"url": {
		type: String
	}, //	图片地址
	"desc": {
		type: String
	} //	描述
});

templateSchema.statics = {
	findTemplat: function(callback) {
		this.find().exec((err, _templat) => {
			if (err) {
				//logger.error(err);
				console.log(err);
			} else {
				callback(_templat)
			}
		});
	},
	addTemplate: function(_templat, callback) {
		this.create(_templat, (err, templatData) => {
			if (err) {
				console.log(err);
				callback({
					mes: "wrong"
				});
			} else {
				callback(templatData);
			}
		})
	}
}

module.exports = mongoose.model('template', templateSchema);