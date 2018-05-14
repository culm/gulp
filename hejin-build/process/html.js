// 引入 gulp
var gulp = require('gulp');
var path = require('path');

// 引入组件
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//htmlmin的文档：https://github.com/kangax/html-minifier
var htmlmin = require('gulp-htmlmin');
// 引入自定义组件
var contentIncluder = require('../utils/contentIncluder.js');
var utils = require('../utils');

var allrelatedFiles = {};
/**
 * [_init 初始化]
 * @return {} [赋值allFiles、allrelatedFiles、that.dependentFiles]
 */
function _init() {
    var that = this;
    var config = that.config;
    allrelatedFiles = _getMainHtmls(config);
    that.dependentFiles = _getDependentFile(config);
}
/**
 * [_build 编译html文件]
 * @return {} [for in调用_runTask编译所有html文件]
 */
function _build() {
    var that = this;
    var config = that.config;
    for (var filepath in allrelatedFiles) {
        // console.log('filepath:' + filepath);
        _runTask(filepath, config);
    }
}
/**
 * [_watch 监控所有html文件改动]
 * @return {_runTask} [htmlcss文件改动重新调用_runTask]
 */
function _watch() {
    var that = this;
    var config = that.config;
    var application = config.application;
    var folder = config.baseSrc + '/' + application;
    var dependentFiles = that.dependentFiles;
    var watchFiles = []; 

    // console.log('dependentFiles:' + JSON.stringify(dependentFiles));
    for (var key in dependentFiles) {
        watchFiles.push(key);
    }

    // console.log('watchFiles:' + watchFiles);
    gulp.watch(watchFiles, function(obj) {
        // console.log('html watch:' + JSON.stringify(obj));
        if (obj.type != 'changed') return; //目前只兼容changed类型
        var filePath = obj.path;
        var name = path.basename(filePath, '.html'),
            folderName = path.basename(path.dirname(filePath));
        // var taskName = tasks[application + '-' + name + '-html'];
        var taskNames = getTasks(filePath, dependentFiles);
        // console.log(taskNames);
        if (taskNames.length == 0) taskNames.push(taskName);
        var len = taskNames.length;
        for (var index = 0; index < len; index++) {
            _runTask(taskNames[index], config);
        }
    });
}
/**
 * [getTasks description]
 * @param  {[type]} filename       [description]
 * @param  {[type]} dependentFiles [description]
 * @return {array}                [空数组]
 */
function getTasks(filename, dependentFiles) {
    filename = filename.replace(/\\/g, '/');
    // console.log('filename:' + filename);
    for (var key in dependentFiles) {
        var str = key.substring(1);
        // console.log('getTasks:' + str)
        if (filename.indexOf(str) > 0) {
            return dependentFiles[key];
        }
    }
    return [];
}
/**
 * [_getMainHtmls 获取html文件路径集合]
 * @param  {object} config [配置文件]
 * @return {object}        [所有html的路径集合]
 */
function _getMainHtmls(config) {
    var data = config.data;
    var allFiles = {};
    var base = config.baseSrc + '/html/';
    for (var key in data) {
        var relatefile = data[key].relatefile;
        if (relatefile) {
            allFiles[base + relatefile] = true;
        }
    }
    return allFiles;
}

function _getDependentFile(config) {
    var relatedFiles = {};
    var configData = config.data;
    utils.each(config.data, function(key, _configData) {
        var params = key.split('.');
        var relatefile = _configData.relatefile;
        // console.log('params:' + params)
        //读取当前工程的配置文件
        if (params[0] != config.application || params.length != 2 || !relatefile) {
            return;
        }
        //获取所有关联的html
        var data = utils.getStatics(configData, key, 'html');
        var jsHtmlData = utils.getStatics(configData, key, 'jshtml');
        data = data.concat(jsHtmlData);
        // console.log(data);
        var baseSrc = config.baseSrc + '/html/';
        utils.each(data, function(index, fileName) {
            fileName = baseSrc + fileName;
            var exist = relatedFiles[fileName] || [];
            exist.push(baseSrc + relatefile);
            relatedFiles[fileName] = exist;
        });
        relatedFiles[baseSrc + relatefile] = [baseSrc + relatefile];
    });
    return relatedFiles;
}

/**
 * [_runTask 打包html文件]
 * @param  {string} taskName [html文件路径]
 * @param  {object} config [配置文件]
 * @return {gulp.dest}          [打包文件到指定路径]
 */
function _runTask(taskName, config) {
    var folder = path.join(config.baseSrc, 'html', '', config.application).replace(/(\\)/g, '/');
    var parentfolder = path.dirname(taskName).substring(taskName.indexOf(folder) + folder.length + 1);
    // console.log('_runTask:' + taskName);
    // console.log('dst:' + parentfolder);
    // console.log('config.dst:' + config.dst);
    var statics = config.statics;
    var regArr = [/@@(.*?)@@/g, /<!\-\-resinclude\s+"([^\"]+)"\-\->/g];
    var _gulp = gulp.src(taskName).pipe(contentIncluder({
        includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g,
        staticResReg: regArr,
        configData: config.data,
        baseSrc: config.baseSrc,
        onResReplace: function(op) {
            // console.log(JSON.stringify(op));
            var type = op.value.split('-')[1]
            // 输出合并后的js和css
            if (config.single && type != 'jshtml') {
                var dst = type == 'js' ? 'script/' : 'style/';
                var val = [dst + 'common.' + type, dst + op.value.replace('-', '.')];
                if(op.value=='imagePath') return statics[op.value];
                if(op.value=='fescoUri') return statics[op.value];
                return utils.getContent(val, type).join('');
            }
            if (op.index == 0) {
                var _resplace = statics[op.value];
                if (!_resplace) {
                    console.log(statics);
                    console.log('filepath:' + taskName);
                    console.log(op.reg + ' need to be replaced');
                    return op.value;
                }
                return _resplace;
            } else {
                return false;
            }
        }
    }));
    /**
     * 压缩合并html文件
     * config.single => true && config.compression =>true
     */
    if (config.single && config.compression) {
        _gulp = _gulp.pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }));
    }
    _gulp.pipe(gulp.dest(path.join(config.dst, parentfolder)));
}

exports.init = _init;
exports.build = _build;
exports.watch = _watch;
exports.start = function(config) {
    this.config = config;
    this.init();
    this.build();
    this.watch();
}