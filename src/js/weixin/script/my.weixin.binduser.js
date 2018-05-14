;(function(A,$){
	var CT = {},
    S = A.service;
	A.extend(CT, A.weixin, S, {
		params:A.getParams(),
		formData:{},
		valigate:{
			insur:false,
			idCard:false,
			idCardsure:false,
			code:false,
			code4:false
		},
        ngclass:{
             insurclass:'',
             idCardclass:'',
             codeclass:''
        },
        imgSrc:'',
        selfImg: '',
        onReady: function () {
            var that = this;
            var params = that.params;
            that.weixinService.config(params.appid, params.ticket, ['chooseImage','previewImage','uploadImage','downloadImage']);
            that.imgSrc=that.ServerPath + 'alijk.images?' + new Date().getTime();   
        },
        submit:function (event){
        	var that = this,data = that.formData;
        	data.openId = that.params.openId;
            data.cardType = 0;

            // if(that.selfImg == ''){
            //     that.msg('请验证是不是本人',function(){
            //         that.checkSelf()
            //     })
            //     return false;
            // }
            
            //临时注释验证码
            // if(!that.testIdcard() || !that.testIdcardSure() || !that.testCode()) return false;
            data.mobileCode = '123456';
            
        	if(!that.testIdcard() || !that.testIdcardSure()) return false;
			that.personService.modify(data).then(function(res){
                if(res.rtnCode == '2000'){
                    that.loading.show({
                        'message': '绑定成功',
                        'time': 1000,
                        'complete': 1
                    })
                    that.wxLocation('upload')
                }
                else
                {
                    that.msg(res.rtnMsg)
                    
                }
            }, function(res){
                that.msg(res.rtnMsg,function() {
                    WeixinJSBridge.call('closeWindow');
                })
            })	
        },
        //校验保单号是否空
        testInsur:function (a){
        	var that=this,
        		valit=true;
        	var val=that.form.insuranceNo.$viewValue;
            if(a=='focus')
                {that.ngclass.insurclass='hascolor'}
            else
            {
                that.ngclass.insurclass='';
            }
        	if(!val)
        	{
        		that.valigate.insur=true;
        		valit=false;
        	}
        	else
        	{
        		that.valigate.insur=false;
        		valit=true;
        	}
        	return valit;
        },
        //校验身份证号是否空
        testIdcard:function(a){
        	var that=this,
        		valit=true;
        	var val=that.form.cardNo.$viewValue;
            if(a=='focus'){that.ngclass.idCardclass='hascolor'}
            else
            {
                that.ngclass.idCardclass='';
            }
        	if(!val)
        	{
        		that.valigate.idCard=true;
        		valit=false;
        	}else if(val.length!=18) {
                that.valigate.idCard = false;
                that.valigate.idCardsure = true;
                valit=false;
            }
        	else
        	{
        		that.valigate.idCard=false;
        		that.valigate.idCardsure=false;
        		valit=true;
        	}
        	return valit;
        },
        testIdMobile:function(a){
            var that=this,
                valit=true,
                val=that.form.mobile.$viewValue;
            if(a=='focus'){ that.ngclass.idMobileClass = 'hascolor' }
            else{
                that.ngclass.idMobileClass='';
            }
            if(!val){
                that.valigate.Mobile = true;                
                valit=false;
            }else if(val.length!=11) {
                that.valigate.Mobile = false;
                that.valigate.Mobileture = true;
                valit=false;
            }else{
                that.valigate.Mobile=false;
                that.valigate.Mobileture=false;
                valit=true;
            }
            return valit;
        },
        //校验身份证号是否正确
        testIdcardSure:function (){ 
        	var that=this,
        		valit=true;
        	var val=that.form.cardNo.$viewValue;
        	if(!val.isCardNo())
        	{
        		that.valigate.idCardsure=true;
        		valit=false;
        	}
        	return valit;
        },
        //校验验证码是否空
        testCode:function(a){
        	var that=this,
        		valit=true;
        	var val=that.form.mobileCode.$viewValue;
            if(a=='focus'){that.ngclass.codeclass='hascolor'}
            else
            {
                that.ngclass.codeclass='';
            }
        	if(!val)
        	{
        		that.valigate.code=true;
        		valit=false;
        	}
        	else if(val.length!=6)
        	{
				that.valigate.code=false;
				that.valigate.code4=true;
        		valit=false;
        	}
        	else
        	{
        		that.valigate.code=false;
        		that.valigate.code4=false;
        		valit=true;
        	}
        	return valit;
        },
        codeNum : 60,
        //点击获取验证码
        sendCode:function (){
        	var that=this,
                mobile=that.formData.mobile;
            if(!mobile){
                that.valigate.Mobile = true;
            }else{
                var i = 59,
                    codeBtn = $(document.querySelector('.img_code'))
                    codePhone = /^((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(14[57][0-9]{8})|(17[6780][0-9]{8}))$/;
                if(!codePhone.test(mobile)){
                    that.valigate.Mobile = false;
                    that.valigate.Mobileture = true;
                    return false;
                }else{ 
                    if (that.codeNum!=60) return;
                    codeBtn.css('color','#ddd').html('60秒后重新发送');
                    that.personService.sendMobileCode(mobile);
                    var t = setInterval(function(){
                        if(i<1){
                            clearInterval(t);
                            that.codeNum = 60;
                            codeBtn.css('color','#fff').html('点击发送验证码')
                        }else{
                            that.codeNum = i;
                            i = i<10?'0'+i:i;
                            codeBtn.css('color','#ddd').html(i+'秒后重新发送');
                        }
                        i--;
                    },1000) 
                }
            }
        },
        checkSelf: function(){
            var that = this;
            that.weixinService.chooseImage().then(function(res){ 
                try{
                    that.loading.show('正在识别中...')
                    that.selfImg = res.localIds[0]  
                    that.uploadImage(); 
                }catch(e){
                    alert(e)
                }                       
            }, function(res) {
                that.msg(res.errMsg, function() {
                    WeixinJSBridge.call('closeWindow');
                })
            });  
        },
        uploadImage:function(){
            var that = this;
            that.weixinService.uploadImage(that.selfImg).then(function(res){
                //上传到微信服务器成功的回调
                var serverId = [res.serverId]; 
                that.uploadService.faceRecognition(serverId).then(function(res){
                    if(res.rtnMsg != '严冰'){
                        that.msg('很遗憾，不是本人');
                        that.selfImg = '';
                    }else{
                        that.msg('验证成功',function(){
                            that.chooseImage();
                        });
                    }
                }, function(res){
                    that.msg(res.rtnMsg, function() {
                        WeixinJSBridge.call('closeWindow');
                    })   
                });
            }, function(res){
                //上传微信服务器失败的回调
                that.msg(res.errMsg, function() {
                    WeixinJSBridge.call('closeWindow');
                });  
            })
        }
    });
    A.getApp().controller("binduserController", ['$scope', '$http', 'personService', 'weixinService', function($scope,$http,personService,weixinService) {
        $scope.personService = personService;
        $scope.weixinService = weixinService;
        $scope.http = $http;
        A.extend($scope, CT);
        $scope.onReady();
    }]);
	
})(my,angular.element)
