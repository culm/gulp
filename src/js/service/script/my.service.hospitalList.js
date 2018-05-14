;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [list 医院列表] 
         * @param  {number} pageNum   [第几页]
         * @param  {number} pageSize  [每页几条数据]
         * @param  {string} tenantName   [医院名称]
         */
        listHos: function(data){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'hospitalManager/list',
                type: 'GET',
                data:{params: A.toJSON(data)},
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [saveOrUpdate 更新保存医院] 
         * @param  {string} tenantName   [医院名称]
         */
        saveHos: function(data){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'hospitalManager/saveOrUpdate',
                type: 'POST',
                data:{params:A.toJSON(data)},
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [delete 删除医院] 
         * @param  {string} tenantName   [医院名称]
         */
        deleteHos: function(id){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'hospitalManager/delete',
                type: 'GET',
                data:{id:id},
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [getProvince 获取省份] 
         * @param  
         */
        getProvince: function(){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getProvince',
                type: 'GET',
                data:{},
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [getCity 根据省份获取城市] 
         * * @param  {string} provinceName   [省份名称]
         */
        getCity: function(provinceName){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getCity',
                type: 'POST',
                data:{params: A.toJSON({provinceName: provinceName.encode()})},
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [getCountry 根据城市获取区域] 
         * * @param  {string} cityName   [城市名称]
         */
        getCountry: function(cityName){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'getCountry',
                type: 'POST',
                data:{params: A.toJSON({cityName: cityName.encode()})},
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res);
                },
                error: function(xhr, txt, status){
                   that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [addHospitalMapping 新增医院mapping]
         * @param {object} data [{
                id          必填  医院id
                tenantId    必填  保险公司tenantId
                code        必填  映射医院code
                aliasName   必填  映射医院名称
            }]
         */
        addHosMap: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'hospitalManager/addHospitalMapping',
                type: 'POST',
                data:{params:A.toJSON(data)},
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [updateHospitalMapping 修改医院mapping]
         * @param {object} data [{
                id              必填  Mapping表id
                myId            医院id
                tenantId        保险公司tenantId
                code            映射医院code
                aliasName       映射医院名称
                standardCode    医院code
            }]
         */
        updateHosMap: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'hospitalManager/updateHospitalMapping',
                type: 'POST',
                data:{params:A.toJSON(data)},
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d,xhr);
                }
            });
            return d.promise;
        },
        /**
         * [getHospitalMapping 查询医院mapping列表]
         * @param {object} data [{
                id              Mapping表id
                myId            医院id
                tenantId        保险公司tenantId
                code            映射医院code
                aliasName       映射医院名称
                standardCode    医院code
                pageSize        必填  页数大小
                pageNum         必填  页数
            }]
         */
        getHosMap: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'hospitalManager/getHospitalMapping',
                // type: 'GET',
                // data: data,
                type: 'POST',
                data:{params:A.toJSON(data)},
                success: function(res) {
                    that.callbackProcess(d, res)
                },
                error: function(xhr, txt, status) {
                    that.networkError(d,xhr);
                }
            });
            return d.promise;
        }
    });
    A.service.hosList=new CT();
})(my)