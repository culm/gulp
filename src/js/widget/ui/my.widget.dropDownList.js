; (function (A) {
    var currentIndex = 0;
    A.widget.dropDownList = function (options) {
        var defaults = {
            id: null,
            buttonText: "",
            readOnly: true,
            maxHeight: -1,
            onSelect: $.noop(),
            container: null
        }
        this.options = A.extend(defaults, options);
        this.init();
        return this;
    };
    A.extend(A.widget.dropDownList.prototype, {
        container: null,
        input: null,
        selectedText: '',
        selectedValue: '',
        init: function () {
            var that = this;
            var options = that.options;
            if (!options.id) {
                that.id = 'dropDownList' + currentIndex;
                currentIndex++;
            }
            that.container = $(options.container);

            var s = "<div class='input-group'>";
            s = s + "<input type='text' class='form-control' name='alijk-dropdownlist' id='" + options.id + "' />";
            s = s + "<div class='input-group-btn'>";
            s = s + "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>" + options.buttonText + "<span class='caret'></span></button>";
            s = s + "<ul class='dropdown-menu dropdown-menu-right' role='menu'>";

            //可以由sections参数或items参数设置下拉条目，sections的优先级比items高
            if (options.sections !== undefined) {
                $.each(options.sections, function (n, value) {
                    //从第2节开始，在每节的顶部添加一条分割线
                    if (n > 0) { s = s + "<li class='divider'></li>"; }
                    //如果设置了itemHeader参数，则给该节添加标题文本
                    if (value.title !== undefined) { s = s + "<li class='dropdown-header'>" + value.title + "</li>"; }
                    createItem(value);
                });
            }
            else {
                createItem(options);
            }
            function createItem(section) {
                $.each(section.items, function (n, item) {
                    //如果itemData参数没有定义，则把itemText参数传给itemDate
                    if (item.value === undefined) { item.value = item.text; }
                    s = s + "<li><a href='javascript:void(0);'  data-value='" + item.value + "' >" + item.text + "</a></li>";
                    //如果设置了selected参数，则获取该条目的text和value。
                    //如果有多个条目设置该参数，则获取的是满足条件最后一个条目
                    if (item.selected == true) {
                        that.selectedText = item.text;
                        that.selectedValue = item.value;
                    }
                });
            }
            s = s + "</ul></div></div>";

            that.container.html(s);

            var input = that.input = that.container.find("input");
            //如果有条目设置selected参数，则调用设置活动条目的函数
            if (that.selectedText != "") {
                that.selectItem(that.selectedText, that.selectedValue);
            }

            //给所有的条目绑定单击事件，单击后调用设置活动条目的函数
            that.container.find("a").bind("click", function (e) {
                that.selectItem($(this).text(), $(this).attr("data-value"));
            });

            //如果readOnly参数设置为true，则屏蔽掉文本框的相关事件，使得文本框不能编辑。（而又显示为激活状态）
            if (options.readOnly == true) {
                input.bind("cut copy paste keydown", function (e) {
                    e.preventDefault();
                });
            }

            //设置maxHeight参数后（大于0），则设置下拉菜单的最大高度，若条目过多，会出现垂直滚动条
            if (options.maxHeight > 0) {
                var uL = that.container.find("ul");
                if (uL.height() > o.maxHeight)
                { uL.css({ 'height': o.maxHeight, 'overflow': 'auto' }); }
            }
        },
        selectItem: function (text, value) {
            var that = this, opts = that.options;
            that.input.val(text);
            if (opts.onSelect) {
                opts.onSelect.call(that, text, value);
            }
        }
    });

})(my);
