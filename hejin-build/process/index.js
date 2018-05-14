var utils = require('../utils');

var html = require('./html.js');
var js = require('./js.js');
var css = require('./css.js');
var concat = require('./concat.js');
var static = require('./static.js');
var server = require('./server.js');

var exec = require('child_process').exec;

module.exports = function(options){
    // 获取配置文件
    options.data = utils.getData(options.config || []);
    // 执行shell删除上次生成的文件夹
    exec('rm -rf '+options.dst, function(err,stdout,stderr){if(err) console.log('shell error:'+stderr);})
    // 打包静态文件方法
    static.start(options);
    // 打包html，处理html模版数据
    html.start(options);
    // 判断single参数是否为true，true不合并js和css文件，false合并js和css文件
    if(options.single) {
        concat.start(options)
    }else{
        js.start(options);
        css.start(options);
    }
    // emulate参数为true则启动node服务
    if(options.emulate){
        server.start(options);
    }
}