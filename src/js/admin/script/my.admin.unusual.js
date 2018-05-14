// alert('加载unusual.js成功');   
;
(function(A) {
    var CT = function() {};
    A.extend(CT.prototype, A.base, A.admin, A.service, {
        onReady: function() {
            var that = this;
            /*that.initHeader(function() {
                that.initEvent();
            })*/

            // 不做登入功能的情况
            that.resizeHeight();
            $(window).resize(function() {
                that.resizeHeight();
            });
            that.initEvent();
        },
        initEvent: function() {
            var that = this;
            $('#passBack').on('click', function() {
                that.passBack();
            })
        },
        /*
         *重新案件接口
         */
        passBack: function() {
            var that = this,
                data = {};
            A.each($('.form-control'), function(index, element) {
                if (element.value != '') data[element.id] = element.value;
            });
            that.order.passBackCase(data).success(function(res) {
                A.alert(res.rtnMsg, function() {
                    that.reload();
                })
            }).fail(function(res) {
                A.alert(res.rtnMsg)
            })
        }
    });
    $(function() {
        var page = new CT();
        page.onReady();
    });
})(my)
