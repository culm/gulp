;(function(A){

    // directive字段的详细解释http://www.cnblogs.com/lvdabao/p/3391634.html
    A.getApp.directive('myLoading',function($timeout){
        return {
            // 'E' : 用于元素的名称 (<my-loading></my-loading>|<my-loading/>)
            // 'A' : 用于元素的 Attribute，这是默认值 (<span my-loading="exp"></span>)
            // 'C' : 用于 CSS 中的 class (<span class="my-dir: exp;"></span>)
            // 'M' : 用于注释 (<!-- directive: my-dir exp -->)
            restrict : 'EA',
            // 是否替换指令标签(true|flas)
            replace : true,
            // 是否将当前元素的内容转移到模板中(true|flas)
            transclude : true,
            // 指定指令的作用域
            // scope: bool or object,   
            // 指定需要依赖的其他指令
            // require: string,         
            // 模板文件引入(string)
            // templateUrl : 'template.html'
            // 模板字符(string)
            template : '<section ng-show="{{loading.showed}}" class="{{loading.class}}">\
                <div class="weui_mask_transparent"></div>\
                <div class="weui_toast">\
                    <div class="weui_loading" ng-show="{{loading.complete == 0}}">\
                        <div class="weui_loading_leaf weui_loading_leaf_0"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_1"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_2"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_3"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_4"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_5"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_6"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_7"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_8"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_9"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_10"></div>\
                        <div class="weui_loading_leaf weui_loading_leaf_11"></div>\
                    </div>\
                    <i class="weui_icon_toast" ng-show="{{loading.complete == 1}}"></i>\
                    <p class="weui_toast_content">{{loading.message}}</p>\
                </div>\
            </section>',
            // 定义与其他指令进行交互的接口函数
            // controller: function controllerConstructor($scope, $element, $attrs, $transclude){...},
            // 以编程的方式操作DOM，包括添加监听器等
            link: function(scope, el, attr){
                // scope是父级元素controller的$scope
                // el是父级元素的jquery对象(angular简单的封装了jQlite)
                // attr是父级元素上attr元素
                
                // 向scope增加loading对象
                scope.loading = {
                    message: '加载中...',
                    showed: false,
                    complete: 0,
                    class:'weui_loading_toast',
                    timer: null,
                    
                    show: function(options){
                        var that = this;
                        if(angular.isString(options)){
                            options = {message: options};
                        }
                        if(angular.isUndefined(options)){
                            options = {message: that.message};
                        }
                        that.message = options.message;
                        if(angular.isNumber(options.complete)){
                            scope.$apply(function(){
                                that.complete = options.complete;
                                if(that.complete == 1) that.class = ""
                            })
                        }
                        that.showed = true;
                        var time = options.time;
                        if(time && time > 0){
                            that.timer = $timeout(function(){
                                that.hide();
                            }, time);
                        }
                    },
                    hide: function(){
                        var that = this;
                        if(that.timer) {
                            $timeout.cancel(that.timer);
                            that.timer = null;
                        }
                        that.showed = false;
                    }
                } 
            }
        };
    })
})(my)

