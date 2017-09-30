/**
 * models控制类，包含常用数据库操作方法
 * Created by zpl on 2017/4/18 0018.
 */
function dao(collection) {
    var collection = collection;

    this.getCount = getCount;
    this.getAll = getAll;
    this.getByPager = getByPager;
    this.getById = getById;
    this.insert = insert;
    this.update = update;
    this.updateById = updateById;
    this.del = del;

    /**
     * 数据库操作后的架设方法
     * @param err 错误信息
     * @param res 返回结果
     * @param funStr 执行的操作描述
     * @param callback 回调方法
     */
    function afterSubmit(err, res, funStr, callback) {
        if (err) {
            console.log(funStr + " end. Error:" + err);
            callback && callback({"status": "error", "message": err});
        } else {
            console.log(funStr + " end. Res:" + res);
            callback && callback({"status": "ok", "result": res});
        }
    }

    /**
     * 获取记录条数
     * @param whereStr
     * @param callback
     */
    function getCount(whereStr, callback) {
        console.log("getCount begin.");
        collection.count(whereStr, function (err, res) {
            afterSubmit(err, res, "getCount", callback);
        });
    }

    /**
     * 查找全部
     */
    function getAll(callback) {
        console.log("getAll begin.");
        collection.find({}).exec(function (err, res) {
            afterSubmit(err, res, "getAll", callback);
        });
    }

    /**
     * 分页查找
     */
    function getByPager(opt, callback) {
        console.log("getByPager begin.");
        console.log("opt= " + JSON.stringify(opt));
        var settings = opt || {};
        settings.pageSize = settings.pageSize || 1000; //一页多少条
        settings.currentPage = settings.currentPage || 1; //当前第几页
        settings.sort = settings.sort || {'id': 1}; //排序
        settings.condition = settings.condition || {}; //条件
        var skipnum = (settings.currentPage - 1) * settings.pageSize; //跳过数

        collection.find(settings.condition).skip(skipnum).limit(settings.pageSize).sort(settings.sort).exec(function (err, res) {
            afterSubmit(err, res, "getByPager", callback);
        });
    }

    /**
     * 根据id查找
     */
    function getById(id, callback) {
        console.log("getById begin.");
        collection.findById(id, function (err, res) {
            afterSubmit(err, res, "getById", callback);
        });
    }

    /**
     * 插入
     */
    function insert(collection, callback) {
        console.log("insert begin.");
        collection.save(function (err, res) {
            afterSubmit(err, res, "insert", callback);
        });
    }

    /**
     * 更新
     */
    function update(whereStr, updateStr, callback) {
        console.log("update begin.");
        collection.update(whereStr, updateStr, function (err, res) {
            afterSubmit(err, res, "update", callback);
        });
    }

    /**
     * 根据id更新
     */
    function updateById(id, updatestr, callback) {
        console.log("updateById begin.");
        collection.findByIdAndUpdate(id, updatestr, function (err, res) {
            afterSubmit(err, res, "updateById", callback);
        });
    }

    /**
     * 删除
     */
    function del(wherestr, callback) {
        console.log("delete begin.");
        collection.remove(wherestr, function (err, res) {
            afterSubmit(err, res, "delete", callback);
        });
    }
}
module.exports = dao;