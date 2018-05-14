;(function(A) {
	var Deferred = function(){
		this.status = 0
		this.promise = new Promise()
	}
	var Promise = function(){
		this.status = 0
		this.fix = 0
	}
	A.extend(Deferred.prototype, {
	    resolve: function(obj) {
	    	this.promise.status = 1
	    	this.promise.fn(obj)
	    },
	    reject: function(obj) {
	    	this.promise.status = 2
	    	this.promise.fn(obj)
	    },
	    notify: function(obj) {
	    	this.promise.status = 3
	    	this.promise.fn(obj)
	    }
	});
	A.extend(Promise.prototype, {
		fn: function(obj){
			var status = this.status;
			if(this.fix === 0) this.fix = status
			else if(status != this.fix) return
            if(status == 1){
                if(this._success) this._success(obj)
            }else if(status == 2){
                if(this._fail) this._fail(obj)
            }else{
                if(this._progres) this._progres(obj)
            }
		},
	    then: function(success, error, progres) {
	    	this._success = success
	    	this._fail = error
	    	this._progres = progres
	    },
	    success: function(callback) {
	        this._success = callback
	    },
	    fail: function(callback) {
	        this._fail = callback
	    },
	    progres: function(callback) {
	        this._progres = callback
	    }
	});

	A.defer = function() {
    	return new Deferred();
  	};
})(my);