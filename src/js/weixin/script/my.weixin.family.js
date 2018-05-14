;(function(A){
    var CT = {};
    A.extend(CT, A.weixin, {
        onReady: function () {
            var that = this;
            that.getList(1);
            that.loading.show();
        },
        getList:function(index){
            var that = this;
            that.personService.getFamilyList(index).then(function(res) {
                if(res.rtnCode == '2000' && res.paymentList){
                    that.loading.show({
                        'message':'加载成功',
                        'time':1000,
                        'complete':1
                    })
                    that.personFamily=res.personFamilyList;
                }else{
                    that.personFamily=[]; 
                    that.loading.hide()
                } 
            }, function(res) {
                that.msg(res.rtnMsg, 'close')
            })
        }
    });
    A.getApp().controller("familyController", ['$scope', '$http', 'personService', function($scope,$http,personService) {
        $scope.personService = personService;
        $scope.http = $http;
        A.extend($scope, CT);
        $scope.onReady();
    }]);
    
})(my)
