;(function(A){
    var CT=function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [getPersonBasicInfo 获取当前用户的主要信息]
         */
        getPersonBasicInfo:function (){
            var that=this;
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + 'getPersonBasicInfo',
                dataType: 'json',
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
         * [modifyPersonBasicInfo 修改当前用户的主要信息]
         * @param  {object} data [{
                    name: 名字,
                    cardNo: 证件号,
                    cardType: 证件类型,
                    cardPhoto: 证件照片
                }]
         */
        modifyPersonBasicInfo:function (data){
            var that=this;
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + 'modifyPersonBasicInfo',
                data: {params: A.toJSON(data)},
                dataType: 'json',
                type: 'post',
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
    A.service.setting=new CT();
})(my)