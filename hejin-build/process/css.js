// 引入 gulp
var gulp = require('gulp'); 
var path = require('path');

// 引入组件
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

// 引入自定义组件
var contentIncluder = require('../utils/contentIncluder.js');
var utils = require('../utils');

allFiles = {};
/**
 * [_init 初始化]
 * @return {} [赋值allFiles]
 */
function _init(){
    var config = this.config;
    allFiles = _getAllCss(config);
}
/**
 * [_build 编译js文件]
 * @return {} [for in调用_runTask编译所有css文件]
 */
function _build(){
    var that = this;
    var config = that.config;
    for(filepath in allFiles){
        _runTask(filepath, config);
    }
}
/**
 * [_watch 监控所有css文件改动]
 * @return {_runTask} [css文件改动重新调用_runTask]
 */
function _watch(){
    var that = this;
    var config = that.config;
    var baseFolder = config.baseFolder;
    var application = config.application;
    var baseSrc = config.baseSrc;
    var base = config.baseSrc + '/';
    var watchFile = [];
    for(var key in allFiles){
        watchFile.push(base + key);
    }
    var startIndex = path.join(baseFolder, baseSrc).length;
    // console.log(watchFile);
    gulp.watch(watchFile, function(obj){
        // console.log('html watch:' + JSON.stringify(obj));
        if(obj.type != 'changed') return;//目前只兼容changed类型
        var filePath = obj.path;
        _runTask(filePath.substring(startIndex + 1), config);
    });
}
/**
 * [_getAllJs 获取所有css]
 * @param  {object} config [配置文件]
 * @return {object}        [所有js的路径集合]
 */
function _getAllCss(config){
    var data = config.data;
    var allFiles = {};
    for(var key in data){
        var jsFiles = data[key].css ||[];
        var len = jsFiles.length;
        for(var index=0; index<len; index++){
            allFiles[jsFiles[index]] = true;
        }
    }
    return allFiles;
}
/**
 * [_runTask 打包css文件]
 * @param  {string} filepath [js文件路径]
 * @param  {object} config [配置文件]
 * @return {gulp.dest}          [打包文件到指定路径]
 */
function _runTask(filepath, config){
    var dst = path.dirname(filepath);
    var name = path.basename(filepath);
    var src = config.baseSrc + '/' + filepath;
    var _dst = config.dst + '/' + dst;
    gulp.src(src)
    .pipe(gulp.dest(_dst));
}


exports.init = _init;
exports.build = _build;
exports.watch = _watch;
exports.start = function(config){
    this.config = config;
    this.init();
    this.build();
    this.watch();
}