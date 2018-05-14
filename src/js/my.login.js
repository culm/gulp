;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, {
        ServerPath: '@@ServerPath@@',
        /**
        * 弹出登录窗口后，是否居中
        */
        autoCenter: true,
        /**
        * 退出时跳转的url,如果为空或null，不返回
        */
        logoutPage: 'index.html',
    	/**
    	* 是否初始化登录注册模块
    	*/
    	hasInit: false,
        /**
        * 能否enter键登陆
        */
        loginBool: false,
    	/**
    	* 登录状态,true:已登录
    	*/
    	loginStatus: false,
        login: A.service.login,
    	/**
    	* 初始化登录模块
    	*/
        init: function() {
        	var that = this;
        	that.hasInit = true;
            if(that.ServerPath=='/ukang-admin-web/') //admin
            {
                $('#login_register_btn').addClass('hide_admin_register'); 
                $('.J_re_admin').addClass('hide_admin_register');
                $('#onMobileQuickLogin').addClass('hide_admin_register');
            }
            else //ukang
            {
                $('#login_register_btn').removeClass('hide_admin_register');
                $('.J_re_admin').removeClass('hide_admin_register');
                $('#onMobileQuickLogin').removeClass('hide_admin_register');
            }
            $('#img_code').on('click',function (){
                var otime=new Date().getTime();
                var osrc=that.ServerPath+'code.images?time='+otime;
                $('#img_code').attr('src',osrc);
            });
            $.fn.getMobileCode = function(){
                var _this = this;
                _this.on('click', function(event) {
                    getmsgcode();
                });
                function getmsgcode(){
                    var i = 59,codePhone = /^((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(14[57][0-9]{8})|(17[6780][0-9]{8}))$/,
                        mobile = _this.closest('form').find('#mobile').val();
                    var imgCode=$('#code').val();
                    
                    var isValid = that.isValid(_this.closest('form').find('#mobile')[0]);
                    if(!isValid){
                        var obj = _this.closest('form').find('#mobile');
                        A.widget.tooltip.show({
                            message: obj.data('content'),
                            placement: 'bottom',
                            autoClose: 2000,
                            target: obj
                        });
                        return false;
                    }
                    //验证验证码
                    isValid = that.isValid($('#code')[0]);
                    if(!isValid){
                        var obj = $('#code');
                        A.widget.tooltip.show({
                            message: obj.data('content'),
                            placement: 'bottom',
                            autoClose: 2000,
                            target: obj
                        });
                        return false;
                    }
                    _this.off('click');
                    $('#img_code').click();
                    that.login.sendMobileCode(mobile,imgCode).success(function (res){
                        _this.html('60秒后重新发送');
                        var t = setInterval(function(){
                            if(i<0){
                                clearInterval(t);
                                _this.css('color','#333').html('获取验证码').on('click', getmsgcode);
                                _this.on('click', function(event) {
                                    getmsgcode()
                                });
                            }else{
                                _this.css('color','#999').html(i+'秒后重新发送');
                            }
                            i--;
                        },1000);
                    }).fail(function (res){
                        _this.on('click', function(event) {
                            getmsgcode()
                        });
                        if(res && res.rtnMsg){
                            A.alert(res.rtnMsg);
                        }else{
                            A.alert('短信接口正在努力中，请您稍后再试！')
                        }
                        
                    }); 
                }
            }
            //$('#loginmodel')
            that.dialogModel = $('#loginmodel');
			//登录事件
			$('#login-button').on('click', function(){
				if(that.checkPattern('#logintab')){
        			that.onLogin();
        		}
			});
            //注册事件
            $('#register-button').on('click', function(){
                if(that.checkPattern('#registertab')){
                    that.onRegister($(this));
                }
            });
			//点击修改验证码
			$('#register-imgcode').on('click', function(){
				this.src  = that.ServerPath + 'alijk.images?' + new Date().getTime();
			});
            //修改密码
            $('#reset-button').off('click').on('click', function(){
                if(that.checkPattern('#resetpasswordtab')){
                    that.onRestPassword();
                }
            });
            //获取验证码
            $('.phoneMsg3').getMobileCode();
            //绑定验证事件
            that.checkBlur('#loginmodel .focus-blur');
            // 验证用户名是否被注册
            $('#register-username').off('blur').on('blur',function(e){
                var obj = $(e.target);
                that.login.checkUserName(e.target.value).success(function (res){
                    obj.parent().removeClass('has-error')
                }).fail(function (res){
                    if(res.rtnCode === '2005'){
                        obj.parent().addClass('has-error')
                        A.widget.tooltip.show({
                            message: res.rtnMsg,
                            placement: 'bottom',
                            autoClose: 2000,
                            target: obj
                        });
                        return;
                    }
                    A.alert('网络错误');      
                }); 
            })
            //监听模态框
            $('#loginmodel').on('hidden.bs.modal', function(){
                //登录框关闭后，如果指定了，退出后的url，跳转到该url
                var page = that.logoutPage;
                that.closeCheckBlur('#loginmodel .focus-blur');
                that.loginBool = false
            }).on('shown.bs.modal', function(){
                //弹出登录框时，自动居中
                that.center($(this));
                that.loginBool = true
            });
            //弹出提示关闭，enter键不可登陆
            $('.iconfirmcontainer').on('hidden.bs.modal', function(){
                that.loginBool = true
            }).on('shown.bs.modal', function(){
                that.loginBool = false
            });
            
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                that.closeCheckBlur('#loginmodel .focus-blur');
                //验证调用摄像头 人脸识别
                // if(this.href == 'http://localhost/ukangres/index.html#registertab'){
                //     that.checkSelf();
                // }
            })
            
            if(that.autoCenter){
                $(window).resize(function(){
                    that.center(that.dialogModel);
                });
            }
            window.onkeyup = function(event){
                if (event.keyCode==13&&that.loginBool) {
                    $('#login-button').click();
                } 
            }
            
            that.checkPasswordStrong();
            that.forgotPasswordModal();
            that.mobileQuickLogin();
            // that.mobileModify();
            that.checkSelfModal();
            // that.checkSelf();
        },
        /**
        * 显示登录注册模块
        */
        show: function(loginCallback){
        	var that = this;
            that.isPassword = false;
        	if(that.loginStatus) return;
        	if(!that.hasInit){
        		that.init();
        	};
            A.widget.loading.hide();
            $('#loginmodel').removeClass('reset-password');
        	$('#loginmodel').modal('show');
            $('#login-username').focus();
        	that.loginCallback = loginCallback;
        },
        resetPassword: function(){
            var that = this;
            that.isPassword = true;
            if(!that.hasInit){
                that.init();
            }
            $('#loginmodel').addClass('reset-password');
            $('#loginmodel').modal('show');
        },
        onRestPassword: function(){
            var that = this;
            var jsonData={
                oldPassword: $('#reset-oldpassword').val(),
                password: $('#reset-newpassword').val(),
                confirmPassword: $('#reset-newconpassword').val()
            };
            A.widget.loading.show({message: '修改密码中...'});
            that.login.resetPassword(jsonData).success(function (res){
                    A.widget.loading.hide();
                    $('#loginmodel').modal('hide');
                    A.alert('修改密码成功！');
                }).notLogin(function (res){
                    A.widget.loading.hide();
                    A.ukang.login.show(function(user){
                        that.onLogin(user);
                    });
                }).fail(function (res){
                    A.widget.loading.hide();
                    if(res.rtnCode === '2005'){
                        A.alert(res.rtnMsg);
                        return;
                    }
                    A.alert('修改密码失败，请重试！');      
                });
        },
        center: function(_this){
            var that = this;
            if(!that.autoCenter) return;
            var target = _this.find('.modal-dialog');
            var top = (window.innerHeight - target.height())/2+$(window).scrollTop();
            if(top>30) top = top/3*2;
            if(top < 0) top = 0;
            
            target.css({'margin-top': top + 'px'});
        },
        /**
        * 登录
        */
        onLogin: function(){
        	var that = this;
        	var username = $('#login-username').val().trim();
            var jsonData={
                username: username, 
                password: $('#login-password').val()
            };
        	A.widget.loading.show({message: '登录中...'});
            that.login.login(jsonData).success(function (res){
                A.widget.loading.hide();
                that.loginStatus = true;
                $('#loginmodel').modal('hide');
                A.each(res.userRole,function(index, el) {
                    if(el !== 'admin') location.href = 'order.html';
                });
                if(that.loginCallback) that.loginCallback({name: username});
            }).notLogin(function (res){
                A.widget.loading.hide();
            }).fail(function (res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);      
            });
        },
        /**
        * 注册
        */
        onRegister: function(ev){
        	var that = this,
                form = ev.closest('form'),
                input = form.find('input'),
                jsonData={
                    // userName: userName, 
                    // password: $('#register-password').val().trim(),
                    // confirmPassword: $('#register-conpassword').val().trim(),
                    // validateCode: $('#register-code').val().trim(),
                    // mobile: $('#register-mobile').val().trim(),
                    // cardNo: $('#register-cardNo').val().trim()
                };
            A.each(input, function(index, el) {
                var name = el.name,val = el.value;
                jsonData[name] = val
            });
        	A.widget.loading.show({message: '注册中...'});
            that.login.register(jsonData).success(function (res){
                // $("#register-imgcode").click();
                A.widget.loading.hide();
                //注册完成后，自动登录
                var dataLogin={
                    username: jsonData.userName, 
                    password: $('#register-password').val()
                };
                that.login.login(dataLogin).success(function (res){
                    that.loginStatus = true;
                    $('#loginmodel').modal('hide');
                    if(that.loginCallback) that.loginCallback({name: jsonData.userName});
                }).fail(function (res){
                    A.alert('登录失败，请重试！');      
                });
            }).notLogin(function (res){
                A.widget.loading.hide();
            }).fail(function (res){
                // $("#register-imgcode").click();
                A.widget.loading.hide();
                A.alert(res.rtnMsg);    
            });
        },
        /**
        * 验证确认密码框
        */
        confirmPassword: function(){
        	return $('#register-conpassword').val() == $('#register-password').val();
        },
        /**
        * 验证修改密码确认框
        */
        confirmResetPassword: function(){
            return $('#reset-newpassword').val() == $('#reset-newconpassword').val();
        },
        /**
        * 验证密码强度
        */
        checkPasswordStrong: function () { 
            function checkpwd(sValue){
                var modes = 0; 
                if (sValue.length < 6) return 0;//6 
                if (/\d/.test(sValue)) modes++; //数字 
                if (/[a-zA-Z]/.test(sValue)) modes++; //大小写字母 
                if (/\W/.test(sValue)) modes++; //特殊字符 
                switch (modes) { 
                    case 1: 
                        return 1;
                        break; 
                    case 2: 
                        return 2; 
                        break; 
                    case 3: 
                    case 4: 
                        return sValue.length < 12 ? 3 : 4 
                    break; 
                }     
            }
            
            // 验证密码强度
            $('#register-password').on('input',function(e){
                var obj = $(e.target),
                    pwd = $('#pwdstrength'),
                    value = e.target.value,
                    tips = '请输入密码';
                switch(checkpwd(value)){
                    case 0:
                    pwd.attr('class','hide')
                    break;
                    case 1:
                    pwd.attr('class','strengthA')
                    break;
                    case 2:
                    pwd.attr('class','strengthB')
                    break;
                    case 3:
                    case 4:
                    pwd.attr('class','strengthC')
                    break;
                }   
            })
        },
        /**
        * 获取登录状态
        */
        getLoginStatus: function(loginedFunc, notLoginFunc){ 
            var that = this;
            that.login.judge().success(function (res){
                if(loginedFunc) loginedFunc({name: res.userName,avatar:that.ServerPath + 'upload/download?fileName='+res.photo});
                that.loginStatus = true;
                A.userID = res.userId;
                if(notLoginFunc) notLoginFunc();
            }).notLogin(function (res){
                A.login.show(function(user){
                    A.base.onLogin(user); 
                    if(notLoginFunc) notLoginFunc();
                });
            }).fail(function (){
                A.alert('获取登录状态失败');     
            }); 
        },
        /**
        * 退出
        */
        logout: function(){
            var that = this;
            that.loginStatus = false;
            that.login.logout().success(function (res){
                that.loginStatus = false;
            }).fail(function (){
                that.loginStatus = false;     
            }); 
            var page = that.logoutPage;
            if(!that.loginStatus && page){
                location.href = page;
            }
        },
        modifyPasswordModal: function(){
            //$('#modifyPassword').appendTo(document.body);  
            $('#userPassword').on('click', function(event) {
                that.setPassword();
            });
        },
        modifyPassword: function(){
            var that = this,
                newPassword1 = $('#newPassword1').val(),
                newPassword2 = $('#newPassword2').val(),
                oldPassword = $('#oldPassword').val();
            if(A.ukang.checkPattern('#form-password')){
                if(!( newPassword1==newPassword2)) return;
                var jsonData={
                    oldPassword: oldPassword,
                    password: newPassword1,
                    confirmPassword: newPassword2
                };
                that.login.resetPassword(jsonData).success(function (res){
                    A.alert('修改密码成功！');
                }).notLogin(function (res){
                    A.ukang.login.show(function(user){
                        that.onLogin(user);
                        that.loadData();
                    });
                }).fail(function (res){
                    if(res.rtnCode === '2005'){
                        A.alert(res.rtnMsg);
                        return;
                    }
                    A.alert('提交失败，请重试！');      
                });
            }
        },
        forgotPasswordModal: function(){
            var that = this;
            //$('').appendTo(document.body);  
            //that.forgotPassword = $('#forgotPassword .modal-dialog');
            $('#forgotPasswordBtn').on('click', function(event) {
                that.verifyForgetPwd();
            });
            $('#verifyForgetPwd').on('click', function(event) {
                that.forgotPassword();
            });
            $('.phoneMsg').getMobileCode();
            $('#onForgotPassword').on('click', function(event) {
                $('.modal').modal('hide');
                $('#forgotPassword').on('hidden.bs.modal', function(){
                    $('#loginmodel').modal('show');
                }).on('shown.bs.modal', function(){
                    that.center($(this));
                }).modal('show');
            });
        },
        forgotPassword: function(){
            var that = this,
                form = $('#forgotPassword'), 
                mobile = form.find('#mobile').val(),
                verifyCode = form.find('#verifyCode').val();
            if(mobile=='') {
                A.alert('请输入真实的手机号码')
                return false
            }
            if(verifyCode.length!=6)  {
                A.alert('请输入6位验证码')
                return false  
            };
            var jsonData={
                "mobile":mobile,
                "validateCode":verifyCode
            };
            that.login.forgetPassword(jsonData).success(function (res){
                $('#form-forgot2').addClass('cur').siblings('form').removeClass('cur');
                $('.tiaobox').find('li').eq(1).addClass('cur');
            }).fail(function (){
                A.alert('提交失败，请重试！');     
            }); 
        },
        verifyForgetPwd: function(){
            var that = this,
                form = $('#forgotPassword'),
                mobile = form.find('#mobile').val(),
                newPassword1 = $('#forgotPassword1').val(),
                newPassword2 = $('#forgotPassword2').val();
            var jsonData={
                "mobile":mobile,
                "password":newPassword1,
                "confirmPassword":newPassword2
            };
                that.login.verifyForgetPwd(jsonData).success(function (res){
                    $('#form-forgot3').addClass('cur').siblings('form').removeClass('cur');
                    $('.tiaobox').find('li').eq(2).addClass('cur');
                }).fail(function (){
                    A.alert('提交失败，请重试！');      
                });
        },
        mobileQuickLogin: function(){
            var that = this;
            //$('').appendTo(document.body);  
            $('#mobileQuickLoginBtn').on('click', function(event) {
                var form = $(this).closest('form'); 
                var jsonData={
                    mobile: form.find('#mobile').val(),
                    validateCode : form.find('#mobile-code').val()
                };
                that.login.fastRegisterByMobile(jsonData).success(function (res){
                    A.alert('登录成功');
                    location.href = location.href.split('#')[0];
                }).fail(function (){
                    A.alert('登录失败！');      
                }); 
            });
            $('#onMobileQuickLogin').on('click', function(event) {
                $('.modal').modal('hide');
                $('#mobileQuickLogin').on('hidden.bs.modal', function(){
                    $('#loginmodel').modal('show');
                }).on('shown.bs.modal', function(){
                    that.center($(this));
                }).modal('show');
            });
            $('.phoneMsg2').getMobileCode();
        },  
        checkSelfModal:function(){
            var that = this;
            //$('').appendTo(document.body);
            $('#checkSelf').on('hidden.bs.modal', function(){
                that.photographs.close()
                $('#canvas').animate({'left': '50%','margin-left': 0,'opacity': 0},1);
                $('#video').animate({'left': '50%','margin-left': '-100px'},1);
            })
        },
        checkSelf:function(){
            var that = this;
            // $('.modal').modal('hide');
            $('#checkSelf').modal('show');
            that.photographs = that.photograph({
                canvas:'canvas',
                video:'video',
                graph:'snap',
                imgX: 200,
                imgY: 200,
                callback:function(url){
                    $('#canvas').animate({'left': '300px','margin-left': 0,'opacity': 1},300);
                    $('#video').animate({'left': '50px','margin-left': 0},300);
                }
            });
            return true;
        }
    });
    A.login = new CT();
})(my);
