;
(function(A) {
    A.widget.dropdownMenu = function(options) {
        var defaults = {
            // 默认标题
            title: '请选择',
            // 选择菜单
            // {id:10,text:'身份证'}
            menus: null,
            // 选择替换的name
            name: '',
            // 点击事件（不是function用默认事件）
            onClick: null
        }
        var op = A.extend(defaults, options);
        var t = new _menu(op);
        return t;
    }

    function _menu(options) {
        var that = this,
            name = options.name;
        that.options = options;
        // 判断元素是否是input
        that.selectorBool = name.indexOf('#') > -1 || name.indexOf('.') > -1;
        that.selector = that.selectorBool ? $(name) : $('input[name="' + name + '"]');
        // 判断元素是否是attr元素
        that.menus = options.menus ? options.menus : JSON.parse(that.selector.attr('data-menus'));
        // 初始化菜单
        that._init(options);
    }
    A.extend(_menu.prototype, A.widget, {
        _init: function(options) {
            var that = this;
            name = that.selectorBool ? options.name.replace(/#|\./g, '') : options.name;
            A.each(that.selector, function(index, el) { 
                var date = new Date().getTime() + index;
                var val = el.value ? el.value : options.default ? options.default.id : '';
                var title = options.default ? options.default.text : options.title;
                var button = '';
                var siblingName = '';
                if (el.type == 'hidden') return;
                if (val && val[0] == '{') return;

                // 拼接dropdown菜单
                var html = ['<div class="btn-group" id="menu_' + name + date + '"><ul class="dropdown-menu">'];
                A.each(that.menus, function(i, menu) {
                    if (menu.id == val) {
                        if (val === '') {
                            button = '<button type="button" class="btn btn-primary dropdown-toggle ' + name + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + title + ' <b class="caret"></b></button>';
                        }else {
                            siblingName = menu.text
                            button = '<button type="button" class="btn btn-primary dropdown-toggle ' + name + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + menu.text + ' <b class="caret"></b></button>';
                        }
                    }
                    html.push('<li><a href="javascript:;" id="' + menu.id + '" data-id="' + name + date + '">' + menu.text + '</a></li>');
                });
                html.push('</ul></div>');
                // 插入页面dom节点
                if (that.selectorBool) {
                    $(el).append('<input type="hidden" name="' + name + '" value="' + val + '" id="input_' + name + date + '">' + html.join(''))
                    $('#menu_' + name + date).prepend(button);
                } else {
                    $(el).after(html.join('')).attr({
                        id: 'input_' + name + date,
                        type: 'hidden',
                        value: val
                    });
                    $('#menu_' + name + date).prepend(button);
                }
                if(options.siblings){
                    '<input type="hidden" name="' + options.siblings + '" value="' + siblingName + '">'
                }
                // 菜单子元素处理
                var menuBox = $('#menu_' + name + date);
                $(menuBox).on('click', 'a', function(event) {
                    var name = that.selectorBool ? that.options.name.replace(/#|\./g, '') : that.options.name;
                    if (typeof that.options.onClick === 'function') {
                        that.options.onClick.call(that, event.target, name, menuBox);
                    } else {
                        that.onclick(event.target, name, menuBox);
                    }
                });
            });
        },
        // 默认子元素点击事件
        onclick: function(el, name, menuBox) {
            var that = this;
            menuBox.prev().val(el.id);
            menuBox.find('.' + name).html(el.innerHTML + ' <b class="caret"></b>');
        }
    })
})(my);
