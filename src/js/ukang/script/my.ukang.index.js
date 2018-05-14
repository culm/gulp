;(function (A) {
    var U = A.ukang,
        CT = function(){};
    A.extend(CT.prototype, A.base, U, {
        init: function () {
        	var that = this;
            that.initEvent();
        },
        initEvent: function(){
            var conBox = $('.con-box'),
                height = window.innerHeight;
            $(window).resize(function(event) {
                conBox.height(height)
            });
            conBox.height(height)
        }
    });
    U.index = new CT();
    U.index.init();
})(my);
