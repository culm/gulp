;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.weixin, {
        onReady: function () {
            var that = this;
            that.getDetail();
            that.loading.show()
        },
        getDetail: function() {
            var that = this,params = A.getParams();
            that.orderService.getDetail(params).then(function(res) {
                if (res.rtnCode === '2000') {
                    if (res.prescriptionList && res.prescriptionList.length != 0) {
                        that.imgPath = that.ServerPath+'upload/download?fileName=';
                        that.prescription = res.prescriptionList;
                        that.hospitalName = res.prescriptionList[0].hospitalName
                    }
                    if (res.receiptList && res.receiptList.length != 0) {
                        that.receipt = res.receiptList;
                    }
                    that.loading.hide()
                    that.showModal('menuActive')
                } else {
                    that.msg(res.rtnMsg, 'close');
                }
            },function(xhr, type, error) {
                that.msg(error, 'close')
            })
            that.orderService.getSummary(params).then(function(res) {
                if (res.rtnCode === '2000') {
                    res.invocieInfo.invoiceNumTotal = res.invoiceNumTotal
                    res.invocieInfo.invoiceAmountTotal = res.invoiceAmountTotal
                    that.basicInfo = res.userBasicInfo;
                    that.medical = res.invocieInfo;
                } else {
                    that.msg(res.rtnMsg, 'close');
                }
            },function(xhr, type, error) {
                that.msg(error, 'close')
            })
        }
    });
    A.getApp().controller("detailController", ['$scope', '$http', 'orderService', function($scope, $http, orderService) {
        $scope.orderService = orderService;
        $scope.http = $http;
        A.extend($scope, CT);
        $scope.onReady();
    }]);
    
})(my)
