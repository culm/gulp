;(function(A) {
    var CT = {};
    A.extend(CT, A.weixin, {
        style: {},
        pageNum:1,
        listJson:{pageNum:1},
        paymentList: [],
        loadList: true,
        onReady: function() {
            var that = this;
            that.wxEvent();
            that.weixinEvent();
            that.getList(that.listJson);
        },
        wxEvent: function (){
            var that = this;
            window.onscroll=function (ev){
                var ev=ev || window.event;
                var top=document.body.scrollTop;
                var height=document.body.scrollHeight;
                var clientH=document.documentElement.clientHeight;
                var deltas=height-top-clientH;
                console.log(deltas);
                if(deltas<=20 && that.loadList)
                {
                    //加载新的一页
                    that.pageNum++;
                    that.listJson.pageNum=that.pageNum;
                    that.getList(that.listJson);
                }
            }
        },
        showImg: function(i) {
            var that = this,toImg='toImg'+i,img = 'imagesActive'+i;
            that.style[toImg] = 'toImg'
            that.style[img] = 'active'
        },
        hideImg: function(i) {
            var that = this,toImg='toImg'+i,img = 'imagesActive'+i;
            that.style[toImg] = ''
            that.style[img] = ''
        },
        getList: function(listJson) {
            var that = this,
                openid = A.getParams().openid||A.getParams().openId,
                startDate = that.getTimes(1, listJson.index),
                endDate = that.getTimes(2, listJson.index);
            that.hideModal('timeActive');
            that.loading.show();
            //请求理赔单列表
            that.orderService.getList({
                openId: openid,
                startDate: startDate,
                endDate: endDate,
                pageNum: listJson.pageNum,
                pageSize: 10
            }).then(function(res){
                //上传成功
                if (res.rtnCode == '2000' && res.paymentList) {
                    that.loading.show({
                        'message': '加载成功',
                        'time': 1000,
                        'complete': 1
                    })
                    for (var i = res.paymentList.length - 1; i >= 0; i--) {
                        res.paymentList[i].openId = openid;
                    };
                    for (var i =0; i <res.paymentList.length; i++) {
                        that.paymentList.push(res.paymentList[i]); 
                    };
                    //that.paymentList = res.paymentList;  
                } else {
                    if(that.paymentList.length>0)
                    {
                        that.msg('没有更多理赔单信息了');
                    }
                    else{
                        that.msg(res.rtnMsg);
                    }
                    that.loadList=false;
                    //that.paymentList = [];
                } 
            }, function(res){
                //上传失败
                that.msg(res.rtnMsg, 'close')
            })
        },
        hasPayment: function(){
            var that = this
            if(!that.receipt||that.receipt.length === 0||!that.prescription||that.prescription.length === 0){
                that.msg('资料不全', 'close')
                // that.hideModal('menuActive')
            }
        },
        getDetail: function(el) {
            var _that = this,
                that = this.$parent,
                params = {
                    personId: el.personId,
                    paymentId: el.mainPaymentId,
                    openId: el.openId
                }
            that.loading.show();
            that.orderService.getDetail(params).then(function(res) {
                if(el.status != '1999'){
                    that.loading.show({
                        'message': '数据处理中...',
                        'time': 3000,
                        'complete': 0
                    })
                    return
                }
                that.showModal('menuActive');
                that.loading.hide();
                if (res.prescriptionList && res.prescriptionList.length != 0) {
                    that.imgPath = that.ServerPath+'upload/download?fileName=';
                    that.prescription = res.prescriptionList;
                    that.hospitalName = res.prescriptionList[0].hospitalName;
                    //如果没有医院名字，就不显示“-”号
                    if(that.hospitalName) that.hospitalName += '-';
                }
                if (res.receiptList && res.receiptList.length != 0) {
                    that.receipt = res.receiptList;
                }
                
            },function(res) {
                if(res.rtnCode == '2005'){
                    that.loading.show({
                        'message': '数据处理中...',
                        'time': 3000,
                        'complete': 0
                    })
                    return
                }
                that.msg(res.rtnMsg, 'close')
            })
            that.orderService.getSummary(params).then(function(res) {
                if(el.status != '1999'){
                    that.loading.show({
                        'message': '数据处理中...',
                        'time': 3000,
                        'complete': 0
                    })
                    return
                }
                that.basicInfo = res.userBasicInfo;
                that.medical = {};
                that.medical.invoiceNumTotal = res.invoiceNumTotal;
                that.medical.invoiceAmountTotal = res.invoiceAmountTotal;
                that.medical.invocieInfo = res.invocieInfo;
            },function(res) {
                if(res.rtnMsg == '没有人员号'){
                    that.loading.show({
                        'message': '数据处理中...',
                        'time': 3000,
                        'complete': 0
                    })
                    return
                }
                that.msg(res.rtnMsg, 'close')
            })
        },
        getTimes: function(type, index) {
            var date = '';
            var now = new Date(); //当前日期 
            var nowDayOfWeek = now.getDay(); //今天本周的第几天 
            var nowDay = now.getDate(); //当前日 
            var nowMonth = now.getMonth(); //当前月 
            var nowYear = now.getFullYear(); //当前年 
            //获得本季度的开端月份 
            function getQuarterStartMonth() {
                var quarterStartMonth = 0;
                if (nowMonth < 3) {
                    quarterStartMonth = 0;
                }
                if (2 < nowMonth && nowMonth < 6) {
                    quarterStartMonth = 3;
                }
                if (5 < nowMonth && nowMonth < 9) {
                    quarterStartMonth = 6;
                }
                if (nowMonth > 8) {
                    quarterStartMonth = 9;
                }
                return quarterStartMonth;
            }
            //获得本月的天数 
            function getMonthDays(myMonth) {
                var monthStartDate = new Date(nowYear, myMonth, 1);
                var monthEndDate = new Date(nowYear, myMonth + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                return days;
            }

            function formatDate(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                return (year + "-" + month + "-" + day);
            }

            //获得本周的开端日期 
            function getWeekStartDate() {
                var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                return formatDate(weekStartDate);
            }

            //获得本周的停止日期 
            function getWeekEndDate() {
                var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
                return formatDate(weekEndDate);
            }

            //获得本月的开端日期 
            function getMonthStartDate() {
                var monthStartDate = new Date(nowYear, nowMonth, 1);
                return formatDate(monthStartDate);
            }

            //获得本月的停止日期 
            function getMonthEndDate() {
                var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
                return formatDate(monthEndDate);
            }
            //获得本季度的开端日期 
            function getQuarterStartDate() {
                var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
                return formatDate(quarterStartDate);
            }

            //或的本季度的停止日期 
            function getQuarterEndDate() {
                var quarterEndMonth = getQuarterStartMonth() + 2;
                var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
                return formatDate(quarterStartDate);
            }
            if (type == 1) {
                if (index == 0) {
                    date = getWeekStartDate();
                } else if (index == 1) {
                    date = getMonthStartDate();
                } else if (index == 2) {
                    date = getQuarterStartDate();
                } else{
                    date = '';
                }
            }
            if (type == 2) {
                if (index == 0) {
                    date = getWeekEndDate();
                } else if (index == 1) {
                    date = getMonthEndDate();
                } else if (index == 2) {
                    date = getQuarterEndDate();
                } else{
                    date = ''
                }
            }
            return date;
        }
    });
    A.getApp().controller("listController", ['$scope', '$http', 'orderService', function($scope, $http, orderService) {
        $scope.orderService = orderService;
        $scope.http = $http;
        A.extend($scope, CT);
        $scope.onReady();
    }]);

})(my)
