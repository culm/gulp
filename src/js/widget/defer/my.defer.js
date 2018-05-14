;(function(A){
    A.defer = function(){
        return new _defer();
    }
    var _defer = function(){
        var that = this;
        that.promise = new _promise();
    }
    A.extend(_defer.prototype, {
        _getAguments: function(args){
            var arr = [this];
            A.each(args, function(index, key){
                arr.push(key);
            });
            return arr;
        },
        resolve: function(){
            var that = this,
                promise = that.promise;
            if(promise.status > 0) return;
            promise.status = 1;
            promise._process(arguments);
        },
        reject: function(){
            var that = this,
                promise = that.promise;
            if(promise.status > 0) return;
            promise.status = 2;
            promise._process(arguments);
        },
        notLogin: function(){
            var that = this,
                promise = that.promise;
            if(promise.status > 0) return;
            promise.status = 3;
            promise._process(arguments);
        },
        notify: function(){
            var that = this,
                promise = that.promise;
            if(promise.status == 0){
                promise._process(arguments);
            }
        }
    });
    function _promise(){
        this.status = 0;//0:初始状态,1:成功回调,2:失败回调,3:未登录
    }
    A.extend(_promise.prototype,{
        _process: function(args){
            var that = this,
                status = that.status;
            if(status == 1){
                if(that._success) that._success.apply(that,args);
            }else if(status == 2){
                if(that._fail) that._fail.apply(that,args);
            }else if(status == 3){
                if(that._notLogin) that._notLogin.apply(that,args);
            }else{
                if(that._progress) that._progress.apply(that,args);
            }
        },
        success: function(onFulfilled){
            this._success = onFulfilled;
            return this
        },
        fail: function(onRejected){
            this._fail = onRejected;
            return this
        },
        progress: function(progressBack){
            this._progress = progressBack;
            return this
        },
        then: function(onFulfilled, onRejected, progressBack){
            var that = this;
            that._success = onFulfilled;
            that._fail = onRejected;
            that._progress = progressBack;
        },
        notLogin: function(onNotLogin){
            this._notLogin = onNotLogin;
            return this
        },
        "finally": function(){

        }
    })
})(my)
