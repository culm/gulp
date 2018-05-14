var utils = require('../utils');

/**
 * [_startEmulate 前端模拟接口]
 * @param  {object} options  [配置文件]
 * @return {data}         [监听本地3000端口,监控所有请求，返回模拟数据]
 */
function _startEmulate(options){
    var express = require('express'); 
    var app = express();
    //设置跨域访问
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        res.header("Access-Control-Allow-Methods","POST,GET");
        res.header("Content-Type", "application/json;charset=utf-8");
        var data = getOutput(req.path.replace(/(^\/*)/g, ''), options);
        res.end(data);
    });
    app.listen(3000);
    console.log('listen to 127.0.0.1:3000');
}
/**
 * [getOutput 获取模拟接口数据]
 * @param  {string} path    [接口路径]
 * @param  {object} options  [配置文件]
 * @return {json}         [模拟接口数据]
 */
function getOutput(path, options){
    // var data = config.getData('');
    var application = options.application;
    console.log('call ' + path);
    var _path = './config/emulate/' + application + '/' + path.replace('/','.') + '.json';
    var data = {};
    try{
        data = utils.getData(_path);
    }catch(ex){
        if(ex.code == 'ENOENT'){
            var msg = '请提供json文件：' + _path;
            console.log(msg);
            data = {
                rtnCode: '-10000000',
                rtnMsg: msg
            }
        }else{
            console.log(ex.message);
            data = {
                rtnCode: '-10000000',
                rtnMsg: ex.message
            }
        }
    }
    return JSON.stringify(data);
}

exports.starts = _startEmulate

