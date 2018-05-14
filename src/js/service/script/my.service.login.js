;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(),
        /**
         * [sendMobileCode 验证手机短信验证码]
         * @param  {number} mobile  [手机号]
         * @param  {number} imgCode [图片验证码]
         */
        sendMobileCode: function(mobile,imgCode){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'sendMobileCode',
                type: 'GET',
                data:{
                    'mobile': mobile,
                    'code': imgCode
                },
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
         * [checkUserName 校验用户名是否重复]
         * @param {string} userName [用户名]
         */
        checkUserName: function(userName){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'checkUserName',
                type: 'GET',
                data:{'userName': userName},
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
         * [resetPassword 找回密码接口]
         * @param  {object} jsonData [{
                oldPassword:老密码, 
                password: 新密码,
                confirmPassword: 重复新密码
            }]
         */
        resetPassword: function(jsonData){
            var that=this,
                d = A.defer();
            if(that.ServerPath=='/chealth-app-web/'){
                jsonData = jsonData;
            }else{
                jsonData = {params: A.toJSON(jsonData)}
            }
            A.ajax({
                url: that.ServerPath + 'resetPassword',
                type: 'POST',
                data: jsonData,
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
         * [login 登录]
         * @param  {object} jsonData [{
                username: 用户名, 
                password: 密码
            }]
         */
        login: function(jsonData){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'login',
                type: 'GET',
                data: jsonData,
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
         * [register 注册]
         * @param  {object} jsonData [{
                userName: 用户名, 
                password: 密码,
                confirmPassword: 重复输入密码,
                cardId: 身份证号,
                mobile: 手机号,
                validateCode: 手机验证码
            }]
         */
        register: function(jsonData){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'register',
                type: 'POST',
                data: jsonData,
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
         * [judge 获取登录状态]
         */
        judge: function(){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'judge',
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
         * [logout 登出]
         */
        logout: function(){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'logout',
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
         * [getAllowVisit 判断权限]
         */
        getPurview: function(){
            var that = this,
                d = A.defer();
            A.ajax({
                //url: that.ServerPath + 'menu/getAllowVisit',
                url: that.ServerPath + 'getAllowVisitMenus',
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
         * [forgetPassword 忘记密码]
         * @param {object} jsonData [{
                "mobile":手机号,
                "validateCode":手机验证码
            };]
         */
        forgetPassword: function(jsonData){
            var that = this,
                d = A.defer();
            if(that.ServerPath=='/chealth-app-web/'){
                jsonData = jsonData
            }else{
                jsonData = {params: A.toJSON(jsonData)}
            }
            A.ajax({
                url: that.ServerPath + 'forgetPassword',
                type: 'POST',
                dataType: 'json',
                data: jsonData,
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
         * [verifyForgetPwd 校验新旧密码]
         * @param {object} jsonData [{
                "mobile":手机号,
                "password":新密码,
                "confirmPassword":重复新密码
            }]
         */        
        verifyForgetPwd: function(jsonData){
            var that = this,
                d = A.defer();
            if(that.ServerPath=='/chealth-app-web/'){
                jsonData = jsonData
            }else{
                jsonData = {params: A.toJSON(jsonData)}
            }
            A.ajax({
                url: that.ServerPath + 'verifyForgetPwd',
                type: 'POST',
                dataType: 'json',
                data: jsonData,
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
         * [fastRegisterByMobile 手机快速登录]
         * @param {object} jsonData [{
                "mobile":手机号,
                "validateCode":手机验证码
            }]
         */          
        fastRegisterByMobile: function(jsonData){
            var that = this,
                d = A.defer();
            A.ajax({
                url: that.ServerPath + 'fastRegisterByMobile',
                type: 'POST',
                dataType: 'json',
                data: jsonData,
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
    A.service.login=new CT();
})(my)