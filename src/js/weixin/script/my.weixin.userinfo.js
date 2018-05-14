;(function(A){
	var CT = {};
	A.extend(CT, A.weixin, {
        message:{},
        onReady: function () {
            var that = this;
            that.weixinEvent();
            that.loading.show()
            that.loadData();
        },
        loadData: function(){
            var that = this,openid = A.getParams().openid;
            that.personService.getBasicInfo(openid).then(function(res) {
                if(res.rtnCode == '2000'){
                    that.loading.show({
                        'message':'加载成功',
                        'time':1000,
                        'complete':1
                    });
                    that.message = res.message || [];
                }else{
                    that.loading.hide()
                    that.msg(res.rtnMsg)
                } 
            }, function(res) {
                that.msg(res.rtnMsg, 'close')
            })
        }
    });
    A.getApp().controller("userinfoController", ['$scope', '$http', 'personService', function($scope,$http,personService) {
        $scope.personService = personService;
        $scope.http = $http;        
        A.extend($scope, CT);
        $scope.onReady();
    }]);
})(my)
