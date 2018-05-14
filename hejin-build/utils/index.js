var fs=require('fs');  
var path = require('path');

var time = new Date().getTime();

/**
 * [each 循环]
 * @param  {Array|object}   elements [循环元素]
 * @param  {Function} callback [回调函数]
 * @return {Array|object}            [elements]
 */
function each(elements, callback) {
    var i, key
    if (typeof elements.length == 'number') {
        for (i = 0; i < elements.length; i++)
            if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
        for (key in elements)
            if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
}

function getData(filePaths){
    var data = {};
    var arr = [];
    if(typeof filePaths === 'string'){
        arr.push(filePaths);
    }else{
        arr = filePaths;
    }
    each(arr, function(key, filePath){
        try{
            var d = fs.readFileSync(filePath,'utf8');
            // console.log(filePath + ':' + d);
            var json = JSON.parse(d);
            for(var key in json){
                // console.log(filePath + ':' + key)
                data[key] = json[key];
            }
        }
        catch(ex){
            console.log(key + ':' + filePath);
            throw ex;
        }
    });
    return data;
}
/**
 * [getStatics 获取关联的静态资源文件]
 * @param  {json} alldata [config下的json文件内容]
 * @param  {string} key     [json文件中配置的key，如ukang.order]
 * @param  {string} type    [html,css或js]
 * @return {object}         [description]
 */
function getStatics(alldata, key, type){
    var pageData = alldata[key],
        dependent = {},
        dataToConcat = [],
        existFiles = {},
        data = [];
    // console.log('key:' + key);
    // console.log('type:' + type);
    try{
        each(pageData[type] || [], function(index, fileName){
            if(existFiles[fileName]) return;
            existFiles[fileName] = true;
            data.push(fileName)
        });
    }
    catch(e){
        console.log('getStatics error');
        console.log('key:' + key);
        console.log('type:' + type);
        throw e;
    }
    dataToConcat = dataToConcat.concat(pageData.dependent);
    while(dataToConcat.length > 0){
        var configKey = dataToConcat.shift(),
            _pageData = alldata[configKey] || [],
            typeData = _pageData[type] ||[];
        if(dependent[configKey]) continue;
        // console.log('configKey:' + configKey);
        dependent[configKey] = true;
        for(var _index = typeData.length - 1; _index>= 0; _index--){
            data.unshift(typeData[_index]);
        }
        // console.log('typeData.dependent:' + JSON.stringify(_pageData));
        dataToConcat = dataToConcat.concat(_pageData.dependent || []);
    }
    return data;
}
/**
 * [getContent 获取content类型数据]
 * @param  {json} data [当前页面所有静态文件路径的json数据]
 * @param  {string} type [类型html、css、js]
 * @return {function}      [根据类型调用_getHtml、_getCss、_getJs]
 */
function getContent(data, type){
    if(type == 'html' || type == 'jshtml'){
        return _getHtml(data);
    }
    else if(type == 'js'){
        return _getJs(data);
    }else if(type == 'css'){
        return _getCss(data);
    }
    return ['未知的模板类型：' + type];
}
/**
 * [_getCss 返回css链接数组]
 * @param  {json} data [当前页面css静态文件路径的json数据]
 * @return {Array}      [css链接数组]
 */
function _getCss(data){
    var arr = [];
    each(data, function(index, name){
        if(name){
            arr.push('<link rel="stylesheet" href="' + name + '?' + time + '" />\n');
        }
    });
    return arr;
}
/**
 * [_getJs 返回js链接数组]
 * @param  {json} data [当前页面js静态文件路径的json数据]
 * @return {Array}      [js链接数组]
 */
function _getJs(data){
    var arr = [];
    each(data, function(index, name){
        if(name){
            arr.push('<script type="text/javascript" src="' + name + '?' + time + '" ></script>\n');
        }
    });
    return arr;
}
/**
 * [_getJs 返回html模板链接数组]
 * @param  {json} data [当前页面html模板文件路径的json数据]
 * @return {Array}      [html模板链接数组]
 */
function _getHtml(data){
    var arr = [];
    // console.log('html data:' + JSON.stringify(data));
    each(data, function(index, name){
        if(name){
            // console.log('name:' + name);
            arr.push('<!--include "./' + name + '"-->');
        }
    });
    // console.log(arr);
    return arr;
}
/**
 * [getFiles 获取文件夹]
 * @param  {string} folder [获取指定文件夹下的文件]
 * @param  {string} match  [指定某个扩展名的文件]
 * @return {Array}        [返回文件路径数组]
 */
function getFiles(folder, match) {  
    var fileArr = [];
    // console.log('getFiles:' + folder)
    var files=fs.readdirSync(folder);
    var that = this;
    for(fn in files) {
        var fname = folder + path.sep + files[fn];  
        var stat = fs.lstatSync(fname);
        if(stat.isDirectory() == true) {  
            fileArr = fileArr.concat(that.getFiles(fname));  
        } else {  
            // console.log(fname);
            var ext = path.extname(fname)
            // var ext = fname.substr(fname.lastIndexOf('.') + 1);
            if(match && ext === match){
                fileArr.push(fname);
            }else{
                fileArr.push(fname);
            }
        }  
    }
    return fileArr;
}


exports.each = each;
exports.getData = getData;
exports.getFiles = getFiles;
exports.getStatics = getStatics;
exports.getContent = getContent;

