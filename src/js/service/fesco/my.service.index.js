;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [fesco/uploadImg 提交图片]
         * @param  {object} data [提交图片]
         */
        saveImg:function (data){
            var that = this,
                d = A.defer(),
                url = that.ServerPath + 'fesco/uploadImg';
            if(data.appfrom == '1'){
                url = that.ServerPath + 'wechat/uploadImg';
            }
            A.ajax({
                url: url,
                data: {jsonParam: A.toJSON(data)},
                dataType: 'json',
                type:'POST',
                success: function(res){
                    that.callbackProcess(d, res); 
                },
                error: function(xhr, txt, status){
                    that.networkError(d,xhr);
                }
            })
            return d.promise;
        },
        /**
         * [fesco/attrData 提交图片]
         * @param  {object} {id:id} [获取attr数据]
         */
        getAttr:function (data){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath+'fesco/attrData',
                data: data,
                dataType: 'json',
                type:'GET',
                success: function(res){
                    that.callbackProcess(d, res); 
                },
                error: function(xhr, txt, status){
                    that.networkError(d,xhr);
                }
            })
            return d.promise;
        },
        /**
         * [fesco/isExistHospital 修改医院]
         * @param  {object} {hospitalId:hospitalId} [医院的id]
         */
        isExistHospital:function (data){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath+'fesco/isExistHospital',
                data: data,
                dataType: 'json',
                type:'GET',
                success: function(res){
                    that.callbackProcess(d, res); 
                },
                error: function(xhr, txt, status){
                    that.networkError(d,xhr);
                }
            })
            return d.promise;
        },
        /**
         * [http://tfespage.itpin.net/health/ApiOcr/CheckBillNo 验证单据号]
         * @param  {object} data [验证单据号]
         */
        checkBillNo:function(data,sign){
            var that = this,
                d = A.defer();
            A.ajax({
                url: '@@fescoUri@@/health/ApiOcr/CheckBillNo',
                data: {jsonParam:A.toJSON(data),sign:sign},
                dataType: 'jsonp',
                type:"GET",
                success: function(res){
                    that.callbackProcess(d, res); 
                },
                error: function(xhr, txt, status){
                    that.networkError(d,xhr);
                }
            })
            return d.promise;
        }
    });
    A.service.fesco = new CT();
})(my)