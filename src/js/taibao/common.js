;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, {
        onReady: function () {
            var that = this;
            that.initEvent();
        },
        initEvent: function(){
        	var that = this; 
          var u = navigator.userAgent;
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
          if(isiOS)
          {
            // $('.iosMarg20').css({'padding-top':'15px','padding-bottom':'22px','height':'60px'});
            // $('.fixed-top').css({'padding-top':'60px'});
            // $('.iosHeight60').css({'height':'60px'});
          }
      }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });

})(my);

    
      