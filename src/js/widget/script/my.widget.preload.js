(function (A) {
    var widget = A.widget;
    widget.loadedFiles = {};
    var iPreload = widget.preload = function (options) {
        var that = this;
        //Default options
        that.options = {
            /// <summary>
            /// true:保存到本地，false：不保存到本地
            /// </summary>
            cached: true,
            /// <summary>
            /// true:用sessionStorage保存，false：用localStorage保存
            /// </summary>
            usedSession: false,
            /// <summary>
            /// html页面，多个用逗号隔开 
            /// </summary>
            html: null,
            tryTimes: 1,
            /// <summary>
            /// css页面，多个用逗号隔开 
            /// </summary>
            css: null,
            //cssFolder: "css/",
            cssFolder: "",
            /// <summary>
            /// 过期时间，默认为1分钟
            /// </summary>
            timeout: 30000,
            /// <summary>
            /// js页面，多个用逗号隔开 
            /// </summary>
            js: null,
            //jsFolder: "js/compressed-js/",
            jsFolder: "",
            pagePrefix: "",
            //pagePrefix: "../",
            //event
            afterLoad: null,
            beforeLoad: null,
            onProgess: null
        };
        // User defined options
        var _options = that.options;
        for (i in options) _options[i] = options[i];
        if (!localStorage) _options.usedSession = true;
        if (!_options.version) _options.version = JSON.parse((localStorage || sessionStorage).getItem("version"));

        that.fileSizes = { "Common.js": 138784};

        if (_options.beforeLoad) _options.beforeLoad.call(that);
        if(_options.cached){//如果不支持localstarage，将不能本地缓存
            if(!window.localStorage) _options.cached = false;
        }
        that._init();
    };
    // Prototype
    iPreload.prototype = {
        _init: function () {
            var that = this,
                _options = that.options,
                tryTimes = _options.tryTimes;
            that.totalFiles = 0;
            that.totalSize = 0;
            that.loadedFiles = 0;
            that.loadedFileSize = {};

            that._load(_options.html);
            that._load(_options.css);
            that._load(_options.js);

            var totalTimes = that.totalFiles * _options.timeout,
                runTime = 0;
            that.waittingTimer = setInterval(function () {
                if (that.totalFiles == that.loadedFiles) {
                    clearInterval(that.waittingTimer);
                    if (_options.afterLoad) _options.afterLoad.call(that);
                    else window.location.href = _options.pagePrefix + _options.html.split(',')[0].replace(".content", "");

                    return;
                }
                totalTimes -= 100;

                if (totalTimes < 0) {//时间过时
                    clearInterval(that.waittingTimer);
                    if (tryTimes > 0) {
                        _options.tryTimes = tryTimes - 1;
                        that._init.call(that);
                    }
                    else if (_options.onTimeout) {
                        _options.onTimeout.call(that);
                    }
                }
            }, 100);
        },
        _preload: function (op) {
            var that = this,
                xhr = new XMLHttpRequest(),
                filePath = "",
                _options = that.options;
            switch (op.fileType) {
                case "css":
                    filePath = _options.cssFolder + op.page;
                    break;
                case "js":
                    filePath = _options.jsFolder + op.page;
                    break;
                default:
                    filePath = op.page;
            }

            //如果是js，且不支持本地缓存,通过script标签添加
            if(op.fileType == 'js' && !_options.cached){
                that.loadScript(_options.pagePrefix + filePath + "?" + _options.version, function(){
                    op.onload.call(that, '', op);
                });
                return;
            }
            xhr.timeout = _options.timeout;
            xhr.open(op.type || 'get', _options.pagePrefix + filePath + "?" + _options.version, op.async);

            // if(xhr.overrideMimeType) xhr.overrideMimeType("text/html;charset=uft8");
            if(xhr.onprogress) xhr.onprogress = op.onprogress || function (progress) {
                that.loadedFileSize[op.page] = progress.loaded;
                that.onProgess.call(that);
                if (!op.infoTarget) return;
                op.infoTarget.innerHTML = "数据加载中..." + parseInt(progress.loaded / (progress.total > 0 ? progress.total : op.total) * 100) + "%";
            };

            if (op.onload)
                xhr.onload = function (load) {
                    var target = load.target,
                        staus = target.status;
                    if (staus >= 200 && status < 300 || status == 304)
                        op.onload.call(that, target.responseText, op);
                };
            xhr.send(op.data || null);
        },
        loadScript: function(url, callback) {
            var doc = document,
                script = doc.createElement("script");
            script.type = "text/javascript";
            script.onload = function () {
                callback();
            };
            script.src = url;
            doc.getElementsByTagName("head")[0].appendChild(script);
        },
        onProgess: function () {
            var loaded = 0,
                index = 0,
                that = this,
                loadFiles =
                that.loadedFileSize,
                option = that.options,
                totalSize = that.totalSize;
            for (i in loadFiles) {
                loaded += loadFiles[i];
            }
            if (loaded > totalSize) loaded = totalSize;

            if (option.onProgess) option.onProgess.call(that, loaded, totalSize);
        },
        _load: function (files) {
            if (!files) return;
            var that = this,
                filearr = files;
            if(typeof files == 'string') filearr = files.split(',');
            A.each(filearr, function(index, fileName){
                // if (!fileName || that._isFileLoaded(fileName)) return;
                if (!fileName || widget.loadedFiles[fileName]) return;
                if (that.fileSizes[fileName])
                    that.totalSize += that.fileSizes[fileName];
                that.totalFiles++;
                var firstIndex = fileName.lastIndexOf('.') + 1,
                    lastIndex = fileName.lastIndexOf('?');
                if(lastIndex < 0) lastIndex = fileName.length;
                var type = fileName.substring(firstIndex, lastIndex).toLowerCase(); //html,css,js
                var op = {
                    async: true,
                    fileType: type,
                    //page: type == "html" ? fileName.replace(".html", ".content.html") : fileName,
                    page: fileName,
                    onload: that._onload
                };
                //this.allOptions.push(op);
                that._preload(op);
            });
        },
        _isFileLoaded: function (fileName) {
            try {
                var that = this,
                    op = that.options;
                if(!op.cached) return false;
                var key = "hasload_" + fileName + "?" + op.version,
                    result = null;
                if (op.usedSession) { result = JSON.parse(sessionStorage.getItem(key)); }
                else {
                    var local = localStorage || sessionStorage,
                    result = local.getItem(key);

                    if (!result) return false;
                    result = JSON.parse(local.getItem(key));
                }

                if (!result) return false;
                return result == 1;
            }
            catch (ex) { return false; }
        },
        _saveLoadFile: function (fileName, fileContent) {
            var key = fileName + "?" + this.options.version,
                flagKey = "hasload_" + key;
            if (this.options.usedSession) {
                var session = sessionStorage;
                session.setItem(key, JSON.stringify(fileContent));
                session.setItem(flagKey, JSON.stringify(1));
            }
            else {
                var local = localStorage;
                local.setItem(key, JSON.stringify(fileContent));
                local.setItem(flagKey, JSON.stringify(1));
            }
        },
        _onload: function (fileContent, op) {
            var filename = op.page,
                that = this,
                options = that.options;
            if (options.pagePrefix && filename.indexOf(options.pagePrefix) == 0)
                filename = filename.substr(this.options.pagePrefix.length);
            
            if(that.options.cached)
                that._saveLoadFile(filename, fileContent);
            that.loadedFiles++;
            widget.loadedFiles[op.page] = true;
            if(options.onload) options.onload.call(that, fileContent, op)
        }
    }
})(alijk);