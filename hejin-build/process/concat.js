// 引入 gulp
var gulp = require('gulp');
var path = require('path');
// 引入 gulp组件
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

// 引入自定义组件
var contentIncluder = require('../utils/contentIncluder.js');

var allFiles = {};
/**
 * [_init 初始化]
 * @return {} [赋值allFiles]
 */
function _init() {
    var config = this.config;
    allFiles = _getAllFlies(config);
}
/**
 * [_build 编译js、css文件]
 * @return {} [for in调用_runTask编译所有js文件]
 */
function _build() {
    var config = this.config;
    for (name in allFiles) {
        _runTask(name, config);
    }
}
/**
 * [_watch 监控所有js、css文件改动]
 * @return {_runTask} [js、css文件改动重新调用_runTask]
 */
function _watch() {
    var config = this.config;
    var watchFile = [];
    for (name in allFiles) {
        watchFile = watchFile.concat(allFiles[name])
    }
    gulp.watch(watchFile, function(obj) {
        var paths = obj.path,
            src = paths.replace(config.baseFolder, '.').replace(/\\/g, '/')
        for (name in allFiles) {
            allFiles[name].forEach(function(el, index) {
                if (src == el) {
                    _runTask(name, config);
                }
            })
        }
    });
}
/**
 * [_getAllJs 获取所有js、css文件]
 * @param  {object} config [配置文件]
 * @return {object}        [所有js、css文件的路径集合]
 */
function _getAllFlies(config) {
    var data = config.data,
        allFiles = {};
    for (var key in data) {        
        var dep = data[key].dependent || false
        if (dep[0] !== 'common' && dep || key === 'common') {
            var arrJs = [],
                arrCss = [];
            for (var i = dep.length - 1; i >= 0; i--) {
                if (data[dep[i]].js) arrJs = arrJs.concat(data[dep[i]].js)
                if (data[dep[i]].css) arrCss = arrCss.concat(data[dep[i]].css)
            };
            allFiles[key + '.js'] = arrJs.concat(data[key].js) || [];
            allFiles[key + '.css'] = arrCss.concat(data[key].css) || [];
        }else{
            if (key!='static') {
                allFiles[key + '.js'] = data[key].js || [];
                allFiles[key + '.css'] = data[key].css || [];
            }
        }
    }
    return allFiles;
}

function _runTask(name, config) {
    var arr = allFiles[name]
    var dst = name.match('js') ? 'script/' : 'style/';
    var src = config.baseSrc + '/';
    var _dst = config.dst + '/' + dst;
    var regArr = [/@@(.*?)@@/g];
    var statics = config.statics;
    for (var i = arr.length - 1; i >= 0; i--) {
        arr[i] = arr[i].match(src) ? arr[i] : src + arr[i]
    };
    var _gulp = gulp.src(arr)
                .pipe(contentIncluder({
                    staticResReg: [/@@(.*?)@@/g,/<!\-\-resinclude\s+"([^\"]+)"\-\->/g],
                    onResReplace: function(op){
                        if(op.index == 0){
                            var _resplace = statics[op.value];
                            if(!_resplace){
                                console.log(statics);
                                console.log('filepath:' + name);
                                console.log(op.reg + ' need to be replaced');
                                return op.value;
                            }
                            return _resplace;
                        }else{
                            return '';
                        }
                    }
                }));
    //合并;
    if (config.compression) {
        name = name.match('.js') ? name.replace('.js', '.min.js') : name.replace('.css', '.min.css'),
            _gulp = _gulp.pipe(concat(name))
        // 压缩js  
        if (name.match('js')) {
            _gulp = _gulp.pipe(uglify().on('error', gutil.log))
        }
        // 压缩css
        if (name.match('css')) {
            _gulp = _gulp.pipe(minify().on('error', gutil.log))
        }
    } else {
        _gulp = _gulp.pipe(concat(name))
    }
    _gulp.pipe(gulp.dest(_dst));
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