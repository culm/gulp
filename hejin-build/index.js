var gulp = require('gulp'); 
var path = require('path'); 
// var jsdox = require('jsdox');
// var jsdoc = require('gulp-jsdoc3');
var utils =  require('./utils');
var process = require('./process');

// 获取打包路径
var outputPaths = {};
try{
    outputPaths = utils.getData("./config/local.json");
}
catch(e){
    if(e.code == 'ENOENT'){
        console.log('***************************************************************************');
        console.log('*  如果需要自定义输出路径，请在./config/local.json中配置相关参数,如下格式 *');
        console.log('*  {                                                                      *');
        console.log('*      "admin-dev": "./dst/admin"                                         *');
        console.log('*  }                                                                      *');
        console.log('***************************************************************************');
    }
    else throw e;
}

/**
 * [jsdox 生成接口文档]
 */
// gulp.task('docs', function(){
//     var doc = function (a,b){
//         try{
//             jsdox.generateForDir(a,b,'node_modules/jsdox/templates/', function(){console.log(b+':ok')});
//         }catch(e){
//             console.log(e);
//         }
//     }
//     doc('./src/js/service/script/', './docs/admin/');
//     doc('./src/js/service/ukang/', './docs/ukang/');
//     doc('./src/js/weixin/service/script/', './docs/weixin/');
// });

module.exports = function (application, op){
    // 默认api接口访问路径
    if(!op.ServerPath) op.ServerPath = '/chealth-app-web/'; 
    var defaultOption = {
        config: [
            "./config/json/common.json",
            "./config/json/widget.json",
            "./config/json/admin.json"
        ],
        statics: {
            "ServerPath": op.ServerPath,
            "EmulateServerPath": op.ServerPath
        },
        dst: outputPaths[application] || './dst/'+application,
        baseSrc: './src',
        application: application,
        baseFolder: path.resolve('./')
    };
    // 打包文件配置参数
    if(op.config) defaultOption.config = op.config;

    gulp.task(application+'-dev', function(){
        defaultOption.debug = op.debug;
        // 需要替换的变量对象，用“@@ 字段 @@”表示
        if(op.statics) defaultOption.statics = op.statics;
        // 生成项目的开发url地址变量
        if(op.uri) defaultOption.statics[application+'Uri'] = op.uri.dev;
        if(op.imagePath) defaultOption.statics["imagePath"] = op.imagePath.dev;
        // 生成项目的开发oss地址变量
        if(op.ossBucket) defaultOption.statics['ossBucket'] = op.ossBucket.dev;
        // 生成项目的开发oss路径变量
        if(op.ossDirName) defaultOption.statics['ossDirName'] = op.ossDirName.dev;
        // 打包文件生成的路径
        defaultOption.dst = outputPaths[application+'-dev'] || './dst/'+application;
        // 打包构建项目
        process(defaultOption);
    });
    gulp.task(application+'-emu', function(){
        // 需要替换的变量对象，用“@@ 字段 @@”表示
        defaultOption.statics = {
            "ServerPath": op.ServerPath,
            "EmulateServerPath": op.EmulateServerPath || 'http://127.0.0.1:3000/'
        }
        // 开启测试
        defaultOption.emulate = true;
        // 生成项目的开发url地址变量
        if(op.uri) defaultOption.statics[application+'Uri'] = op.uri.dev;
        // 生成项目的开发oss地址变量
        if(op.ossBucket) defaultOption.statics['ossBucket'] = op.ossBucket.dev;
        // 生成项目的开发oss路径变量
        if(op.ossDirName) defaultOption.statics['ossDirName'] = op.ossDirName.dev;
        // 打包文件生成的路径
        defaultOption.dst = outputPaths[application+'-emu'] || './dst/'+application;
        // 打包构建项目
        process(defaultOption);
    });
    gulp.task(application+'-pro', function(){
        // 是否需要合并
        if(op.single) defaultOption.single = op.single;
        // 是否需要压缩
        if(op.compression) defaultOption.compression = op.compression;
        // 需要替换的变量对象，用“@@ 字段 @@”表示
        if(op.statics) defaultOption.statics = op.statics;
        // 生成项目的生产url地址变量
        if(op.uri) defaultOption.statics[application+'Uri'] = op.uri.pro;
        // 生成项目的开发oss地址变量
        if(op.ossBucket) defaultOption.statics['ossBucket'] = op.ossBucket.pro;
        // 生成项目的开发oss路径变量
        if(op.ossDirName) defaultOption.statics['ossDirName'] = op.ossDirName.pro;
        // 打包文件生成的路径
        defaultOption.dst = outputPaths[application+'-pro'] || './dst/'+application;
        // 打包构建项目
        process(defaultOption);
    });
};


