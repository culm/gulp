;(function(A){
    var CT=function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [submitUploadInfo 上传图片]
         * @param  {number} selectedHospital [医院的id]
         * @param  {array} imgs             [图片的数组]
         */
        submitUploadInfo: function(data){
            var that=this;
        	var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'payment/info/save',
                type: 'POST',
                dataType: 'json',
                data: {params: A.toJSON(data)},
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(){
                    that.networkError(d,xhr);
                }
            })
            return d.promise;
        }
    });   
    A.service.upload = new CT();
})(my)