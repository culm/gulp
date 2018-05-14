;(function(A) {

    A.getApp().filter('gender', function() {
        return function(i) {
            var g = '未知'
            if(i==1){
                g = '男'
            }
            if(i==2){
                g = '女'
            }
            return g;
        }
    });
    A.getApp().filter('newDate0', function() {
        return function(i) {
            var date = i==null?'':i.split(' 00:')[0]
            return date;
        }
    });
    A.getApp().filter('cardType', function() {
        return function(i) {
            var t = {
                '0': '身份证',
                '1': '军官证',
                '2': '护照',
                '3': '户口本',
                '4': '港澳通行证',
                '5': '台胞证',
                '6': '出生证'
            };
            var msg = t[i]?t[i]:'证件号码'
            return msg;
        }
    });
    A.getApp().filter('relation', function() {
        return function(i) {
            var g = {
                '0': '子女',
                '1': '父母',
                '2': '岳父母',
                '3': '其他关系'
            };
            return g[i];
        }
    });
    A.getApp().filter('status', function() {
        return function(status) {
            var messages = {
                '0': '处理中',
                '399':'待确认',
                '1000': '待确认',//'专家审核中',
                '1001': '单据缺失',
                '1002': '理赔人信息不全',
                '1999': '理赔中',
                '2000': '理赔中',
                '3000': '理赔完成'
            };
            var message = messages[status];
            if (message) return message;
            else return '未知状态';
        }
    });
    A.getApp().filter('yuan', function() {
        return function(c) {
            var i = parseFloat(c)
            return "￥" + i;
        }
    });

})(my)
