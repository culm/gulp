;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(), 
        // webAppPath:'http://123.56.194.79/chealth-app-web/',
        /**
         * 上传图片
         **/
        upload: function(odata){
            var that = this,
            d = A.defer();
            A.ajax({
                url: that.ServerPath + 'taibao/uploadImg',
                type: 'POST',
                data: {params:A.toJSON(odata)},
                success:function(res){
                    if(res.rtnCode != '2000'){
                        d.reject(res);
                    }else{
                        d.resolve(res);
                    }
                },
                error:function(xhr, type, error) {
                    var info = {
                        rtnCode: '-2000', 
                        rtnMsg: '发生网络错误',
                        xhr: xhr, 
                        type:type, 
                        error: error
                    }
                    d.reject(info);
                }
            })
            return d.promise;
        },
        /**
         * 判断给定的sn是否提交过
         */
        hasUpload: function(data){
            var that = this,
            d = A.defer();
            A.ajax({
                url: that.ServerPath + 'taibao/isLastUploadSuccess',
                type: 'get',
                data: data,
                success:function(res){
                    if(res === 'true' || res === true){
                        d.resolve(true);
                    }else{
                        d.resolve(false);
                    }
                },
                error:function(xhr, type, error) {
                    d.resolve(false);
                }
            })
            return d.promise;
        }   
    });
    A.service.upfileList=new CT();
})(my)