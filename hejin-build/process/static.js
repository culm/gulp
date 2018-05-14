// 引入 gulp
var gulp = require('gulp'); 
var path = require('path');
var fs = require('fs');
// 引入自定义组件
var utils = require('../utils');

/**
 * [staticProcess 打包一些其他文件夹]
 * @param  {object} options [配置文件]
 * @return {_runTask}         [打包文件夹]
 */
function staticProcess(options){
    var staticData = options.data["static"];
    if(staticData){
        var baseSrc = options.baseSrc;
        utils.each(staticData, function(index, filepath){
            var files = utils.getFiles(baseSrc + path.sep + filepath);
            utils.each(files, function(_index, _filepath){
                _runTask(_filepath, options);
            })
        });
    }
}
/**
 * [_runTask 打包文件]
 * @param  {string} filepath [文件路径]
 * @param  {object} options  [配置文件]
 * @return {gulp.dest}          [打包文件到指定路径]
 */
function _runTask(filepath, options){ 
    var baseFolder = options.baseFolder,
        fullPath = path.join(baseFolder, filepath),
        _baseFolder = path.join(baseFolder, options.baseSrc),
        relatedPath = fullPath.substring(_baseFolder.length + 1),
        dst = path.dirname(path.join(options.dst, relatedPath));
    if(options.single){
        // 合并css文件，图片和字体路径需要做些特殊处理
        if(dst.match('fonts')) dst = dst.replace('bootstrap\\','')
        else if(filepath.match('loading')) dst = dst.replace('css\\widget','style')
        else if(dst.match('fesco')) dst = dst.split('css')[0]+'style/images/'+path.dirname(filepath.split('images')[1])
        else return false;
    } 
    gulp.src(filepath)
    .pipe(gulp.dest(dst));
}

exports.start = staticProcess;


