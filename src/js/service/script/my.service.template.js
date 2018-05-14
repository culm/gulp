;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        webAppPath: 'http://182.92.143.105/chealth-app-web/',  
        /**
         * [hospitaltemplates/delete description]
         * @method POST
         * @param  {number} id [description]
         */
        delete:function (id){
            var that=this;
            var d = A.defer();
            A.ajax({ 
                url: that.ServerPath + 'hospitaltemplates/delete',
                type: 'POST',
                data: {params: A.toJSON({id:id})},
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
         * [hospitaltemplates/list description]
         * @method POST
         * @param  {object} loaddata [description]
         */
        list:function (loaddata){
            var that=this;
            var d=A.defer();
            A.ajax({
                url: that.ServerPath + 'hospitaltemplates/list',
                emulate: true,
                type: 'POST',
                data: {params: A.toJSON(loaddata)},
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
         * [hospitaltemplates/update、hospitaltemplates/add description]
         * @method POST
         * @param  {object} data [description]
         */
        update: function(data){
            var that = this;
        	var d = A.defer();
            var URL='';
            if(data.update=='update')
            {
                URL='hospitaltemplates/update';
            }
            if(data.update=='add')
            {
                URL='hospitaltemplates/add';
            }
            A.ajax({
                url: that.ServerPath + URL,
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
         * [hospitaltemplates/detail 模板详情]
         * @param  {number} id [description]
         */        
        detail:function (id){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'hospitaltemplates/detail',
                data:{params:A.toJSON({id:id})},
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
         * [testTemplate 测试模板]
         * @method GET
         * @param  {object} data [description]
         */        
        testTemplate:function(data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'testTemplate',
                data:data,
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
         * [correctTemplate 矫正图片]
         * @method GET
         * @param  {object} data [description]
         */
        correctImage:function(data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'correctTemplate',
                type: 'POST',
                data:{params:A.toJSON(data)},
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
         * [templateDetail 从其他医院载入]
         * @method GET
         * @param  {object} data [description]
         */
        templateDetail:function(data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'templateDetail',
                type: 'GET',
                data:data,
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
         * [testTemplate 测试模板 测试]
         * @method GET
         * @param  {object} data [description]
         */
        testTemplate:function(data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'testTemplate',
                type: 'GET',
                data:data,
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
         * [autoCorrectTemplate 自动校正模板]
         * @method GET
         * @param  {object} data [description]
         */
        autoCorrectTemplate:function(data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'autoCorrectTemplate',
                type: 'GET',
                data:data,
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
         * [correctTemplateImage 手动拉平校正模板]
         * @method POST
         * @param  {object} data [description]
         */
        correctTemplateImage:function(data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'correctTemplateImage',
                type: 'POST',
                data:{params:A.toJSON(data)},
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
         * [correctCharSize 按字体大小校正]
         * @method GET
         * @param  {object} data [description]
         */
        correctCharSize:function(data){
            var that=this;
            var d = A.defer();
            A.ajax({
                url: that.ServerPath + 'correctCharSize',
                type: 'GET',
                data: data,
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
         * [get4InputValue 获取mapping数据字段]
         * @method POST
         * @param {object} data [{
                type: 单据类型,
                hosplitalId: 医院id
            }]
         */
        getTemplate: function(data) {
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'get4InputMappingTemplate', 
                //emulate: true,
                //dataType: 'json',
                type: "POST",
                data: {params:A.toJSON(data)},
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
         * [hospitaltemplates/delete description]
         * @method POST
         * @param  {number} id [description]
         */
        delete:function (id){
            var that=this;
            var d = A.defer();
            A.ajax({ 
                url: that.ServerPath + 'hospitaltemplates/delete',
                type: 'POST',
                data: {params: A.toJSON({id:id})},
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
         * [hospitaltemplates/delete description]
         * @method POST
         * @param  {number} id [description]
         */
        deleteTitleImg:function (data){
            console.dir(data);
            var that=this;
            var d = A.defer();
            A.ajax({ 
                url: that.ServerPath + 'hospitaltemplates/deleteTitleImg',
                type: 'POST',
                data: data,
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
         * [/hospitaltemplates/correct 图片自动矫正]
         * @method POST
         * @param  {number} id [description]
         */
        correctImg:function (data){
            var that=this;
            var d = A.defer();
            A.ajax({ 
                url: that.ServerPath + '/hospitaltemplates/correct',
                type: 'POST',
                data: data,
                dataType: 'json',
                success: function(res){
                    that.callbackProcess(d, res); 
                },
                error: function(xhr, txt, status){
                    that.networkError(d,xhr);
                }
            });
            return d.promise;
        }

    });
    A.service.template=new CT();
})(my)