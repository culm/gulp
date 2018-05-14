;(function(A){

    // directive字段的详细解释http://www.cnblogs.com/lvdabao/p/3391634.html
    A.getApp().directive('myDialog',function($timeout){
        return {
            restrict : 'EA',
            // 是否替换指令标签(true|flas)
            replace : true,
            // 是否将当前元素的内容转移到模板中(true|flas)
            transclude : true,
            // 模板字符(string)
            template : '<section ng-show="{{dialog.showed}}" class="weui_dialog_confirm">\
                <div class="weui_mask"></div>\
                <div class="weui_dialog">\
                    <div class="weui_dialog_hd"><strong class="weui_dialog_title">{{dialog.title}}</strong></div>\
                    <div class="weui_dialog_bd">{{dialog.content}}</div>\
                    <div class="weui_dialog_ft">\
                        <a href="javascript:;" ng-repeat="btn in dialog.options.buttons" ng-click="dialog.click(btn.value)" class="{{btn.class}}">{{btn.text}}</a>\
                    </div>\
                </div>\
            </section>',
            // 以编程的方式操作DOM，包括添加监听器等
            link: function(scope, el, attr){
                // scope是父级元素controller的$scope
                // el是父级元素的jquery对象(angular简单的封装了jQlite)
                // attr是父级元素上attr元素
                
                // 向scope增加dialog对象
                scope.dialog = {
                    showed:false,
                    click: function(value){
                        var that = this;
                        var click = that.options.onClick;
                        if(click) click(value);
                    },
                    show:function(options){
                        var that=this;
                        that.showed = true;
                        that.options = options;
                        that.title=options.title;
                        that.content=options.content;

                        //scope.$apply(scope.dialog)
                    },
                    hide:function (){
                        this.showed = false;
                    }
                }
                scope.msg = function(str,fn){
                    var that = this;
                    that.dialog.show({
                        title:'提示',
                        content: str,
                        buttons: fn ? [
                            {text: '取消', class: 'weui_btn_dialog default',value:0},
                            {text: '确定', class: 'weui_btn_dialog primary',value:1}
                        ] :  [
                            {text: '确定', class: 'weui_btn_dialog primary',value:0}
                        ] ,
                        onClick: function(value){
                            if(value==0)
                            {
                                //直接隐藏
                                that.dialog.hide();
                                that.loading.hide();
                            }
                            else if(value==1)
                            {
                                //执行回调函数
                                that.dialog.hide();
                                that.loading.hide();
                                function closeWin(){
                                    WeixinJSBridge.call('closeWindow');
                                }
                                fn === 'close' ? closeWin() : fn();
                            }
                        }                        
                    })                    
                } 
            }
        };
    })
})(my)

/*调用*/
/*
that.dialog.show({
    title:'传入自定义标题',
    content:'传入自定义显示内容',
    buttons:[
        {text: '取消', class: 'weui_btn_dialog primary',value:0},
        {text: '确定', class: 'weui_btn_dialog primary',value:1}
    ],
    onClick: function(value){
        if(value==0)
        {
            //直接隐藏
            that.dialog.hide();
        }
        else if(value==1)
        {
            //执行函数ceshihanshu
            that.ceshihanshu();
        }
    }
});
*/
