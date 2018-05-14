;(function(A){
	var CT = {};
	A.extend(CT, A.weixin, {
        bankBlured: false,
        valigate:{
            required:false,
            valigate:false,
            owner:false,
            name:false
        },
        bankClass: 'showbank',
        ngclass:{
            cardNoclass:'',
            nameclass:'', 
            ownerclass:''
        },
        banks: [],
        obtains:[],
        maskClass: '',
        onReady: function () {
            var that = this;
            that.loading.show();
            that.loadData();
            //调用获取银行列表的接口
            that.obtainBank();
        },
        loadData: function($scope){
            var that = this,openid = A.getParams().openid||A.getParams().openId;
            that.bankService.bankCard(openid).then(function(res){
                // that.loading.hide();
                if(res.rtnCode==2000)
                {
                    that.banks = res.list || [];
                    that.loading.show({
                        'message': '加载成功',
                        'time': 1000,
                        'complete': 1
                    })
                }
                else{
                    //上传失败
                    that.msg(res.rtnMsg, 'close')
                }  
            }, function(res){
                //上传失败
                that.msg(res.rtnMsg, 'close')
            })
        },
        luhmCheck: function (bankno){
            if (bankno.length < 16 || bankno.length > 19) {
                //$("#banknoInfo").html("银行卡号长度必须在16到19之间");
                return false;
            }
            var num = /^\d*$/;  //全数字
            if (!num.exec(bankno)) {
                //$("#banknoInfo").html("银行卡号必须全为数字");
                return false;
            }
            //开头6位
            var strBin="10,18,20,21,30,34,35,36,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,63,64,65,67,68,69,84,87,88,94,95,98,99";    
            if (strBin.indexOf(bankno.substring(0, 2))== -1) {
                //$("#banknoInfo").html("银行卡号开头6位不符合规范");
                return false;
            }
            var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
        
            var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
            var newArr=new Array();
            for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
                newArr.push(first15Num.substr(i,1));
            }
            var arrJiShu=new Array();  //奇数位*2的积 <9
            var arrJiShu2=new Array(); //奇数位*2的积 >9
            
            var arrOuShu=new Array();  //偶数位数组
            for(var j=0;j<newArr.length;j++){
                if((j+1)%2==1){//奇数位
                    if(parseInt(newArr[j])*2<9)
                    arrJiShu.push(parseInt(newArr[j])*2);
                    else
                    arrJiShu2.push(parseInt(newArr[j])*2);
                }
                else //偶数位
                arrOuShu.push(newArr[j]);
            }
            
            var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
            var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
            for(var h=0;h<arrJiShu2.length;h++){
                jishu_child1.push(parseInt(arrJiShu2[h])%10);
                jishu_child2.push(parseInt(arrJiShu2[h])/10);
            }        
            
            var sumJiShu=0; //奇数位*2 < 9 的数组之和
            var sumOuShu=0; //偶数位数组之和
            var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
            var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
            var sumTotal=0;
            for(var m=0;m<arrJiShu.length;m++){
                sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
            }
            
            for(var n=0;n<arrOuShu.length;n++){
                sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
            }
            
            for(var p=0;p<jishu_child1.length;p++){
                sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
                sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
            }      
            //计算总和
            sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
            
            //计算Luhm值
            var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
            var luhm= 10-k;
            
            if(lastNum==luhm){
            //$("#banknoInfo").html("Luhm验证通过");
            return true;
            }
            else{
            //$("#banknoInfo").html("银行卡号必须符合Luhm校验");
            return false;
            }        
        },
        //测试点击确定时执行某个函数
        ceshihanshu:function (){
            alert('点击确定执行自定义函数');
        },
        addBank: function(){
            var that = this;
            that.maskClass = 'weui_fade_toggle';
            that.addBankClass = 'weui_actionsheet_toggle';
            that.newBank = {};
        },
        //获取银行列表
        obtainBank:function (){
            var that=this;
            that.bankService.bankList().then(function(res){
                // that.loading.hide();
                if(res.rtnCode==2000)
                {
                    that.obtains=res.list || [];
                }
                else{
                    //上传失败
                    that.msg(res.rtnMsg, 'close')
                }  
            }, function(res){
                //上传失败
                that.msg(res.rtnMsg, 'close')
            })
        },
        bankBlur: function(){
            var that = this;
            that.bankBlured = false;
            // console.log('bankBlur:' + that.bankBlured);
        },
        //根据列表填充input输入框的值
        chooseBank:function (bank){
            var that = this;
            that.newBank.name = bank.name;
            that.bankBlured = false;
            that.testName(that.newBank.name);
        },
        bankFocus:function (){
            var that = this;
            that.bankBlured = true;
            var val=that.form.name.$viewValue;
            var valig=true;
            that.ngclass.nameclass='hascolor';
            if(!val)
            {
                that.valigate.name=true;
                valig=false;
            }
            else
            {
                that.valigate.name=false;
                valig=true;
            }
            return valig;
            // console.log('bankFocus:' + that.bankBlured);
        },
        hideName:function (){
            var that=this;
            that.ngclass.nameclass='';
        },
        //校验银行卡号是否符合
        testCard:function (a){
            var that=this;
            var valig=true;
            var val=that.form.cardNo.$viewValue;
            if(a=='focus')
            {
                that.ngclass.cardNoclass='hascolor';
            }
            else
            {
                that.ngclass.cardNoclass='';
            }
            if(!val)
            {
                //请输入银行卡号
                that.valigate.required=true;
                valig=false;
            }
            else
            {
                that.valigate.required=false;
                if(!that.luhmCheck(val))
               {
                    that.valigate.valigate=true;
                    valig=false;
               }
               else
               {
                    that.valigate.valigate=false;
                    valig=true;
               }
            }
            return valig;
        },
        //校验持卡人姓名是否为空
        testOwner:function(a){
            var valig=true;
            var that=this;
            if(a=='focus')
            {
                that.ngclass.ownerclass='hascolor';
            }
            else
            {
                that.ngclass.ownerclass='';
            }
            var val=that.form.owner.$viewValue;
            if(!val)
            {
                that.valigate.owner=true;
                valig=false;
            }
            else
            {
                that.valigate.owner=false;
                valig=true;
            }
            return valig;
        },
        //校验银行卡名称是否空
        testName:function (n){
            var valig=true;
            var that=this;
            var val=that.form.name.$viewValue || n;
            if(!val)
            {
                that.valigate.name=true;
                valig=false;
            }
            else
            {
                that.valigate.name=false;
                valig=true;
            }
            return valig;
        },
        cancelBank: function(){
            var that = this;
            that.maskClass = '';
            that.addBankClass = '';
        },
        saveBank: function(){
            var that = this;
            //获取到表单是否验证通过
            if((!that.testOwner())|| (!that.testName()) || (!that.testCard())) return false;
            that.bankService.saveBank(that.newBank).then(function(res){
                // that.loading.hide();
                if(res.rtnCode==2000)
                {
                    that.newBank.id=res.bank.id;
                    that.banks.push(that.newBank);
                    that.newBank = {};
                    that.cancelBank();
                }
                else{
                    //上传失败
                    that.cancelBank();
                    that.msg(res.rtnMsg, 'close')
                }  
            }, function(res){
                //上传失败
                that.msg(res.rtnMsg, 'close')
            })
        },
        delBank: function(index){
            var that = this,
                delObj = that.banks[index];
            //todo 调用ajax删除该条记录
            that.bankService.deleteBank(delObj.id).then(function(res){
                // that.loading.hide();
                if(res.rtnCode==2000)
                {
                    that.msg('删除成功，您删除的银行id为：'+res.bankId);
                    that.banks.splice(index, 1);
                }
                else{
                    //上传失败
                    that.msg(res.rtnMsg, 'close')
                }  
            }, function(res){
                //上传失败
                that.msg(res.rtnMsg, 'close')
            })
        }
    });
    A.getApp().controller("bankController", ['$scope', '$http', 'bankService', function($scope, $http, bankService) {
        $scope.bankService = bankService;
        $scope.http = $http;
        A.extend($scope, CT);
        $scope.onReady();
    }]);
})(my)
