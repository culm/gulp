;(function(A){
	var CT = {};
	A.extend(CT, A.weixin, {
        onReady: function () {
            var that = this;
            that.getUser()
            that.loading.show()
        },
        getUser: function(){
            var that = this,openid = A.getParams().openid;
            that.personService.getBasicInfo(openid).then(function(res) {
                if(res.rtnCode == '2000'){
                    that.loading.show({
                        'message':'加载成功',
                        'time':1000,
                        'complete':1
                    })
                    that.user = res
                    that.user.photo = res.photo==null?'css/weixin/images/photo.png':res.photo
                }else{
                    that.msg(res.rtnMsg)
                } 
            }, function(res) {
                that.msg(res.rtnMsg, 'close')
            })
        }
    });
    A.getApp().controller("userController", ['$scope', '$http', 'personService', function($scope,$http,personService) {
        $scope.personService = personService;
        $scope.http = $http;
        A.extend($scope, CT);
        $scope.onReady();
    }]);
})(my)
