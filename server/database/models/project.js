/**
 * 项目表
 * Created by zpl on 2017/9/1.
 */
let mongoose = require('../db'),
    Schema = mongoose.Schema;
var _underscore = require('underscore');

let projectSchema = new Schema({
    "num": {
        unique: true,
        type: String
    }, // 项目编号,按yyyymmdd+3位数统一编码，唯一
    "userName": {
        type: String
    }, // 所属用户
    "name": {
        type: String
    }, // 项目名称
    "amount": {
        type: Number
    }, // 交易金额
    "applicationDate": {
        type: Date,
        default: Date.now
    }, // 申请日期，日期类型修改时需要用 实例.markModified('applicationDate') 再save，才能生效
    "payDate": {
        type: Date
    }, // 交付日期
    "serviceLife": {
        type: Number
    }, // 服务期限,单位为年
    "closingDate": {
        type: Date
    }, // 服务截止日期,确认交付后自动按交付日期加上服务期限赋值
    "status": {
        type: String,
        default: "申请中"
    }, // 项目状态,申请中,开发中,已交付,交付中,已撤销
    "desc": {
        type: String
    }, // 需求描述
    "changeInfo": {
        type: [String]
    } // 需求变更记录
});

projectSchema.statics = {
    findAllPro: function(sortName, callback) {
        if (sortName === '') {
            this.find({
                "status": {
                    $ne: "已撤销"
                }
            }).sort({
                "num": -1
            }).exec((err, proList) => {
                if (err) {
                    console.log(err)
                } else {
                    callback(proList)
                }
            })
        } else {
            var _name = new RegExp(sortName, "g");
            this.find({
                "status": {
                    $ne: "已撤销"
                }
            }).find({
                "name": _name
            }).sort({
                "num": -1
            }).exec((err, proList) => {
                if (err) {
                    console.log(err)
                } else {
                    callback(proList)
                }
            })
        }
    },
    findProByName: function(userName, callback) {
        this.find({
            "userName": userName
        }).find({
            "status": {
                $ne: "已撤销"
            }
        }).sort({
            "num": -1
        }).exec((err, proList) => {
            if (err) {
                console.log(err)
            } else {
                callback(proList)
            }
        })
    },
    findProByNum: function(id, callback) {
        this.find({
            "num": id
        }).exec((err, proData) => {
            if (err) {
                console.log(err)
            } else {
                callback(proData)
            }
        })
    },
    getYearMoney: function(year, callback) {
        var _year = new RegExp("^" + year + ".*$", "g");
        this.find({
            "status": "已交付"
        }).find({
            "num": _year
        }).exec((err, Data) => {
            if (err) {
                console.log(err)
            } else {
                var Amount = 0;
                console.log("共有" + Data.length + "条销售记录")
                for (var i = 0; i < Data.length; i++) {
                    Amount += Data[i].amount
                    console.log(Data[i].amount)
                }
                callback(Amount)
            }
        })
    },
    getMounthMoney: function(year, mounth, callback) {
        var date = new RegExp("^" + year + mounth + ".*$", "g");
        this.find({
            "status": "已交付"
        }).find({
            "num": date
        }).exec((err, Data) => {
            if (err) {
                console.log(err)
            } else {
                var Amount = 0;
                console.log("共有" + Data.length + "条销售记录")
                for (var i = 0; i < Data.length; i++) {
                    Amount += Data[i].amount
                    console.log(Data[i].amount)
                }
                callback(Amount)
            }
        })
    },
    setProState: function(data, callback) {
        this.findOne({
            "num": data.id
        }).exec((err, _pro) => {
            if (err) {
                console.log(err);
            } else {
                console.log("需要设置的项目：\n" + _pro)
                var _newProState = _underscore.extend(_pro, {
                    "status": data.proState,
                    "closingDate": data.closingDate
                });
                _newProState.save((err) => {
                    if (err) {
                        console.log(err);
                        callback('faile');
                    } else {
                        callback('success');
                    }
                });
            }
        })
    },
    changeProInfo: function(data, callback) {
        this.findOne({
            "num": data.num
        }).exec((err, _pro) => {
            if (err) {
                console.log(err);
            } else {
                console.log("需要设置的项目：\n" + _pro)
                var _newProState = _underscore.extend(_pro, {
                    "name": data.name,
                    "amount": data.amount,
                    "payDate": data.payDate,
                    "serviceLife": data.serviceLife,
                    "desc": data.desc
                });
                _newProState.save((err) => {
                    if (err) {
                        console.log(err);
                        callback('faile');
                    } else {
                        callback('success');
                    }
                });
            }
        })
    },
    applyNewPro: function(_proData, callback) {
        this.find({}).sort({
            "_id": -1
        }).limit(1).exec((err, proData) => {
            if (err) {
                console.log(err);
            } else {
                //this当前；prve上一个
                var prveNum = proData[0].num;
                var prveTime = prveNum.substring(0, 8);
                var prveIndex = prveNum.substring(8);

                var thisTime = _proData.num.substring(0, 8);

                if (thisTime == prveTime) {
                    thisNum = (Array(3).join('0') + (prveNum - 0 + 1)).slice(-3);
                } else {
                    thisNum = "000";
                }

                _proData.num = thisTime + thisNum;

                console.log(_proData)

                //存数据
                this.create(_proData, (err, projectData) => {
                    if (err) {
                        console.log(err);
                        callback({
                            mes: "wrong"
                        });
                    } else {
                        callback(projectData);
                    }
                })
            }
        })
    }
}

module.exports = mongoose.model('project', projectSchema);