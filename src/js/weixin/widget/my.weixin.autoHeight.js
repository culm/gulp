;(function(A){
    // directive字段的详细解释http://www.cnblogs.com/lvdabao/p/3391634.html
    A.getApp().directive('myAutoHeight',function($timeout){
        return {
            // 'E' : 用于元素的名称 (<my-loading></my-loading>|<my-loading/>)
            // 'A' : 用于元素的 Attribute，这是默认值 (<span my-loading="exp"></span>)
            // 'C' : 用于 CSS 中的 class (<span class="my-dir: exp;"></span>)
            // 'M' : 用于注释 (<!-- directive: my-dir exp -->)
            restrict : 'EA',
            // 是否替换指令标签(true|flas)
            replace : false,
            // 是否将当前元素的内容转移到模板中(true|flas)
            transclude : true,
            // 指定指令的作用域
            // scope: bool or object,   
            // 指定需要依赖的其他指令
            // require: string,         
            // 模板文件引入(string)
            // templateUrl : 'template.html'
            // 模板字符(string)
            // template : '',
            // 定义与其他指令进行交互的接口函数
            // controller: function controllerConstructor($scope, $element, $attrs, $transclude){...},
            // 以编程的方式操作DOM，包括添加监听器等
            link: function(scope, el, attr){
                // scope是父级元素controller的$scope
                // el是父级元素的jquery对象(angular简单的封装了jQlite)
                // attr是父级元素上attr元素
                var h = window.innerHeight - 44
                $timeout(function() {
                    el.css('height', h + 'px');
                }, 10);
            }
        };
    })
})(my)

