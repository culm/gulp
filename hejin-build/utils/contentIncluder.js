var path = require('path');
var util = require('util');
var fs = require('fs');
var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'gulp-content-includer';
var utils = require('./index.js');

module.exports = function(options) {
    return through.obj(function(file, enc, cb) {
        var self = this;

        options = options || {};

        var showLog = options.showLog;

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var includerReg = options.includerReg;
        var content = file.contents.toString();
        var configData = options.configData;
        /**
         * [replaceContent 获取html模板内容]
         * @param  {string} content [当前文件内容的字符串]
         * @param  {string} dir     [当前文件的路径]
         * @return {string}         [处理过的字符串]
         */
        var replaceContent = function (content,dir){
            if(!includerReg) return content;
            content = content.replace(includerReg, function(str, src) {
                if (/^[\\\/]/.test(src)) {
                    if (options.resolvePath && typeof options.resolvePath === "function") {
                        src = options.resolvePath(src);
                    } else {
                        src = path.join(options.baseSrc || "",src);
                    }                 
                } else {
                    // console.log('dir' + ':' + dir);
                    var _baseSrc = options.baseSrc + '/html'
                    src = path.join(_baseSrc || "", src);
                    // console.log('src:' + src);
                }          
                try {
                    var fileContent = fs.readFileSync(src,'utf8');
                    utils.each(options.staticResReg || [], function(regIndex, reg){
                        fileContent = replaceResContent(fileContent, dir, reg, regIndex);
                    });
                    if (options.deepConcat && includerReg.test(fileContent)) {
                        return replaceContent(fileContent,src);
                    }
                    // console.log('src:' + fileContent);        
                    return fileContent;
                } catch (err) {
                    gutil.log(gutil.colors.red('[ERROR] the file %s required by %s is not exsist'),src,dir);
                    return str;
                }
            
            });
            return content;
        }
        /**
         * [replaceResContent 获取静态文件的内容]
         * @param  {string} content [当前文件内容的字符串]
         * @param  {string} dir     [当前文件的路径]
         * @param  {string} reg     [正则表达式]
         * @param  {number} index   [正则表达式在正则数组的位置]
         * @return {string}         [处理过的字符串]
         */
        var replaceResContent = function (content, dir, reg, index){
            if(!reg) return content;
            // console.log('reg:' + reg);
            content = content.replace(reg, function(str, src) {
                var params = src.split('-'),
                    key = params[0],
                    type = params[1];
                if(options.onResReplace){
                    var res = options.onResReplace({reg: str, value: src, path: dir, index: index});
                    if(res !== false) return res;
                }
                try{
                    var data = utils.getStatics(configData, key, type);
                    // console.log(key + ':' + dir);
                    return utils.getContent(data, type).join('');
                }catch(e){
                    console.log('replaceResContent:' + str);
                    console.log(dir);
                    throw e;
                }
            });
            return content;
        }
        // console.log(options.staticResReg) => [ /@@(.*?)@@/g, /<!\-\-resinclude\s+"([^\"]+)"\-\->/g ]
        utils.each(options.staticResReg || [], function(regIndex, reg){
            // =>0 /@@(.*?)@@/g
            // =>1 /<!\-\-resinclude\s+"([^\"]+)"\-\->/g
            content = replaceResContent(content, file.path, reg, regIndex);
        });
        content = replaceContent(content,file.path);

        file.contents = new Buffer(content);
        this.push(file);
        cb();
    });
};
