(function (A) {
    var H = $,
        TABLE_INDEX = 0;
    A.widget.iTable = function (selector, options) {
        return new iTable(selector, options);
    }

    function iTable(selector, options) {
        this.target = $(selector);
        if (!this.target) {
            return false;
        }
        this.setOptions(options);
        this.init();
        return this;
    }

    function indexOfArray(a, o) {
        for (var i = 0, len = a.length; i < len; i++) {
            if (a[i] == o) return i;
        }
        return -1;
    }

    function removeArrayItem(a, o, id) {
        if (typeof o == 'string') {
            for (var i = 0, len = a.length; i < len; i++) {
                if (a[i][o] == id) {
                    a.splice(i, 1);
                    return;
                }
            }
        } else {
            var index = indexOfArray(a, o);
            if (index != -1) {
                a.splice(index, 1);
            }
        }
    }

    function addArrayItem(a, o, r) {
        for (var i = 0, len = a.length; i < len; i++) {
            if (a[i][o] == r[o]) {
                return;
            }
        }
        a.push(r);
    }

    A.extend(iTable.prototype, A.widget, {
        setOptions: function (options) {
            this.options = $.extend(true, $.extend(true, {}, iTable.default.options), options || {});
        },
        init: function () {
            var that = this,
                target = that.target,
                opts = that.options;
            target.css('width', '').css('height', '');
            that.wrapTable();
            opts.columns = $.extend(true, [], opts.columns);
            opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
            opts.view = $.extend({}, opts.view);

            that.buildGrid();
            that.bindEvents();
            that.setSize();
            if (opts.data) {
                that.loadData(opts.data);
                that.initChanges();
            }

            that.request();
            that.setSize();
        },
        wrapTable: function () {
            var that = this,
                opts = that.options,
                target = that.target;
            var panel = $(
                '<div class="itable-container">' +
                    '<div class="itable-view">' +
                        '<div class="itable-view-normal"></div>' +
                        '<div class="itable-view-frozen"></div>' +
                    '</div>' +
                '</div>').insertAfter(target);
            target.hide().appendTo(panel.find('itable-view'));
            var view = panel.children('div.itable-view');
            var normalView = view.children('div.itable-view-normal');
            var frozenView = view.children('div.itable-view-frozen');
            if (opts.pagination) {
                var paper = $('<div class="itable-pagination" style="display: block;">' +
                         '<input type="button" class="first" value="首页">' +
                         '<input type="button" value="上一页" class="prev">' +
						'<span>第{pageNumber}/{total}页</span>' +
						'<input type="button" class="next" value="下一页">' +
                        '<input type="button" class="last" value="尾页">' +
                        '<span>共{totalCount}条记录</span>' +
					'</div>').appendTo(panel).hide();
            }
            that.panel = panel;
            that.dataContext = {
                view: view,
                normalView: normalView,
                frozenView: frozenView,
                pager: panel.children('div.itable-pagination')
            };
        },
        buildGrid: function () {
            var that = this,
                opts = that.options,
                target = that.target,
                dc = that.dataContext;
            that.ss = that.createStyleSheet();

            that.rowIdPrefix = 'itable-row-r' + (++TABLE_INDEX);
            that.cellClassPrefix = 'itable-cell-c' + TABLE_INDEX;
            createColumnHeader(dc.frozenView, opts.frozenColumns, true);
            createColumnHeader(dc.normalView, opts.columns, false);
            createColumnStyle();

            function createColumnHeader(container, columns, frozen) {
                if (!columns) return;
                $(container).show();
                $(container).empty();

                var t = $('<table class="itable-body" border="0" cellspacing="0" cellpadding="0"><thead></thead></table>').appendTo(container);
                for (var i = 0; i < columns.length; i++) {
                    var tr = $('<tr></tr>').appendTo($('thead', t));
                    var cols = columns[i];
                    for (var j = 0; j < cols.length; j++) {
                        var col = cols[j];

                        var td = $('<td></td>').appendTo(tr);

                        td.attr('field', col.field);
                        td.append('<div class="itable-cell"><span></span></div>');
                        $('span', td).html(col.title);
                        var cell = td.find('div.itable-cell');
                        if (col.width) {
                            var value = that.parseValue('width', col.width, dc.view, opts.scrollbarSize);
                            cell.outerWidth(value - 1);
                            col.boxWidth = parseInt(cell[0].style.width);
                            col.deltaWidth = value - col.boxWidth;
                        } else {
                            col.auto = true;
                        }
                        cell.css('text-align', (col.halign || col.align || ''));

                        col.cellClass = that.cellClassPrefix + '-' + col.field.replace(/[\.|\s]/g, '-');

                        cell.addClass(col.cellClass).css('width', '');

                        if (col.hidden) {
                            td.hide();
                        }
                    }
                }
            }

            function createColumnStyle() {
                var lines = [];
                var fields = that.getColumnFields(true).concat(that.getColumnFields());
                for (var i = 0; i < fields.length; i++) {
                    var col = that.getColumnOption(fields[i]);
                    if (col) {
                        lines.push(['.' + col.cellClass, col.boxWidth ? col.boxWidth + 'px' : 'auto']);
                    }
                }
                that.ss.add(lines);
                that.ss.dirty(that.cellSelectorPrefix);
                that.cellSelectorPrefix = '.' + that.cellClassPrefix;
            }
        },
        bindEvents: function () {
            var that = this, opts = that.options;
            if (opts.pagination) {
                var pager = that.dataContext.pager;
                pager.find("input[type='button']").each(function (index) {

                    $(this).unbind('.pagination').bind('click.pagination', function (e) {
                        var target = $(this);
                        switch (index) {
                            case 0:
                                opts.pageNumber = 1;
                                break;
                            case 1:
                                opts.pageNumber = (opts.pageNumber - 1) <= 0 ? 1 : (opts.pageNumber - 1);
                                break;
                            case 2:
                                opts.pageNumber = (opts.pageNumber + 1) > opts.totalPage ? opts.totalPage : (opts.pageNumber + 1);
                                break;
                            case 3:
                                opts.pageNumber = opts.totalPage;
                                break;
                        }
                        if (!target.hasClass('pager-disabled')) {
                            opts.onSelectPage.call(that, opts.pageNumber, opts.pageSize);
                            that.request();
                        }
                    });
                });
            }
        },
        createStyleSheet: function () {
            var that = this,
                opts = that.options,
                panel = that.panel,
                dc = that.dataContext;
            var ss = null;
            if (opts.sharedStyleSheet) {
                ss = typeof opts.sharedStyleSheet == 'boolean' ? 'head' : opts.sharedStyleSheet;
            } else {
                ss = panel.closest('div.itable-view');
                if (!ss.length) {
                    ss = dc.view
                };
            }

            var cc = $(ss);
            var state = $.data(cc[0], 'ss');
            if (!state) {
                state = $.data(cc[0], 'ss', {
                    cache: {},
                    dirty: []
                });
            }
            return {
                add: function (lines) {
                    var ss = ['<style type="text/css" itable="true">'];
                    for (var i = 0; i < lines.length; i++) {
                        state.cache[lines[i][0]] = {
                            width: lines[i][1]
                        };
                    }
                    var index = 0;
                    for (var s in state.cache) {
                        var item = state.cache[s];
                        item.index = index++;
                        ss.push(s + '{width:' + item.width + '}');
                    }
                    ss.push('</style>');
                    $(ss.join('\n')).appendTo(cc);
                    cc.children('style[itable]:not(:last)').remove();
                },
                getRule: function (index) {
                    var style = cc.children('style[itable]:last')[0];
                    var styleSheet = style.styleSheet ? style.styleSheet : (style.sheet || document.styleSheets[document.styleSheets.length - 1]);
                    var rules = styleSheet.cssRules || styleSheet.rules;
                    return rules[index];
                },
                set: function (selector, width) {
                    var item = state.cache[selector];
                    if (item) {
                        item.width = width;
                        var rule = this.getRule(item.index);
                        if (rule) {
                            rule.style['width'] = width;
                        }
                    }
                },
                remove: function (selector) {
                    var tmp = [];
                    for (var s in state.cache) {
                        if (s.indexOf(selector) == -1) {
                            tmp.push([s, state.cache[s].width]);
                        }
                    }
                    state.cache = {};
                    this.add(tmp);
                },
                dirty: function (selector) {
                    if (selector) {
                        state.dirty.push(selector);
                    }
                },
                clean: function () {
                    for (var i = 0; i < state.dirty.length; i++) {
                        this.remove(state.dirty[i]);
                    }
                    state.dirty = [];
                }
            }
        },
        parseValue: function (property, value, parent, delta) {
            delta = delta || 0;
            var v = $.trim(String(value || ''));
            var endchar = v.substr(v.length - 1, 1);
            if (endchar == '%') {
                v = parseInt(v.substr(0, v.length - 1));
                if (property.toLowerCase().indexOf('width') >= 0) {
                    v = Math.floor((parent.width() - delta) * v / 100.0);
                } else {
                    v = Math.floor((parent.height() - delta) * v / 100.0);
                }
            } else {
                v = parseInt(v) || undefined;
            }
            return v;
        },
        getColumnFields: function (frozen) {
            var that = this,
                target = that.target,
                opts = that.options;
            var columns = (frozen == true) ? (opts.frozenColumns || [
                []
            ]) : opts.columns;
            if (columns.length == 0) return [];

            var aa = [];
            var count = getCount(); // the fields count
            for (var i = 0; i < columns.length; i++) {
                aa[i] = new Array(count);
            }
            for (var rowIndex = 0; rowIndex < columns.length; rowIndex++) {
                $.map(columns[rowIndex], function (col) {
                    var colIndex = getIndex(aa[rowIndex]); // get the column index
                    if (colIndex >= 0) {
                        var value = col.field || '';
                        for (var c = 0; c < (col.colspan || 1) ; c++) {
                            for (var r = 0; r < (col.rowspan || 1) ; r++) {
                                aa[rowIndex + r][colIndex] = value;
                            }
                            colIndex++;
                        }
                    }
                });
            }
            return aa[aa.length - 1]

            function getCount() {
                var count = 0;
                $.map(columns[0], function (col) {
                    count += col.colspan || 1;
                });
                return count;
            }

            function getIndex(a) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] == undefined) {
                        return i;
                    }
                }
                return -1;
            }
        },
        getColumnOption: function (field) {
            var that = this,
                target = that.target,
                opts = that.options;

            function find(columns) {
                if (columns) {
                    for (var i = 0; i < columns.length; i++) {
                        var cc = columns[i];
                        for (var j = 0; j < cc.length; j++) {
                            var c = cc[j];
                            if (c.field == field) {
                                return c;
                            }
                        }
                    }
                }
                return null;
            }
            var col = find(opts.columns);
            if (!col) {
                col = find(opts.frozenColumns);
            }
            return col;
        },
        _outerWidth: function (width) {
            if (width == undefined) {
                if (this[0] == window) {
                    return this.width() || document.body.clientWidth;
                }
                return this.outerWidth() || 0;
            }
            return this._size('width', width);
        },
        loadData: function (data) {
            var that = this,
               target = that.target,
               opts = that.options, pager = that.dataContext.pager;
            data = opts.loadFilter.call(that, data);
            data.total = parseInt(data.total);
            that.data = data;
            that.onBeforeRender();
            that.render(false);
            that.render(true);
            that.onAfterRender();

            that.ss.clean();

            if (pager.length) {
                //var popts = pager.pagination('options');
                //if (popts.total != data.total) {
                //    pager.pagination('refresh', { total: data.total });
                //    if (opts.pageNumber != popts.pageNumber) {
                //        opts.pageNumber = popts.pageNumber;
                //        request(target);
                //    }
                //}
                that.refreshPagerState();
            }

            if(opts.onLoadSuccess) opts.onLoadSuccess.call(that, data);
        },
        render: function (frozen) {
            var that = this, opts = that.options, dc = that.dataContext, rows = that.data.rows || [], fields;
            var fields = that.getColumnFields(frozen);
            if (frozen) {
                if (!(opts.frozenColumns && opts.frozenColumns.length)) {
                    return;
                }
            }

            var table = (frozen ? dc.frozenview : dc.normalView).find('table.itable-body');
            var tbody = table.find('tbody');
            if (tbody.length > 0) {
                tbody.empty();
            } else {
                tbody = $('<tbody></tbody>').appendTo(table);
            }
            for (var i = 0; i < rows.length; i++) {

                var css = opts.rowStyler ? opts.rowStyler.call(that, i, rows[i]) : '';
                var classValue = '';
                var styleValue = '';
                if (typeof css == 'string') {
                    styleValue = css;
                } else if (css) {
                    classValue = css['class'] || '';
                    styleValue = css['style'] || '';
                }

                var cls = 'class="itable-row ' + (i % 2 && opts.striped ? 'itable-row-alt ' : ' ') + classValue + '"';
                var rowId = that.rowIdPrefix + '-' + (frozen ? 1 : 2) + '-' + i;
                var tr = $('<tr id="' + rowId + '" itable-row-index="' + i + '" ' + cls + ' ' + styleValue + '></tr>').appendTo(tbody);
                that.renderRow(tr, fields, frozen, i, rows[i]);
                if(opts.onTrRender){
                    opts.onTrRender.call(that, rows[i], tbody);
                }
            }
        },
        renderRow: function (tr, fields, frozen, rowIndex, rowData) {
            var that = this, opts = that.options, dc = that.dataContext, rows = that.data.rows, fields;
            var cc = [];
            if (frozen) {
                //var rownumber = rowIndex + 1;
                //if (opts.pagination) {
                //    rownumber += (opts.pageNumber - 1) * opts.pageSize;
                //}
                //cc.push('<td class="itable-td-rownumber"><div class="itable-cell-rownumber">' + rownumber + '</div></td>');
            }
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var col = that.getColumnOption(field);
                if (col) {
                    var value = rowData[field];
                    var css = col.styler ? (col.styler(value, rowData, rowIndex) || '') : '';
                    var classValue = '';
                    var styleValue = '';
                    if (typeof css == 'string') {
                        styleValue = css;
                    } else if (css) {
                        classValue = css['class'] || '';
                        styleValue = css['style'] || '';
                    }
                    var cls = classValue ? 'class="' + classValue + '"' : '';
                    var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');

                    var td = $('<td field="' + field + '" ' + cls + ' ' + style + '></td>').appendTo(tr);

                    var style = '';

                    if (col.align) { style += 'text-align:' + col.align + ';' }
                    if (!opts.nowrap) {
                        style += 'white-space:normal;height:auto;';
                    } else if (opts.autoRowHeight) {
                        style += 'height:auto;';
                    }

                    var cell = $('<div style="' + style + '" class="itable-cell ' + col.cellClass + '"></div>').appendTo(td);

                    if (col.formatter) {
                        var formatted = col.formatter(value, rowData, rowIndex);
                        if (typeof formatted === 'string') {
                            cell.html(formatted);
                        } else {
                            cell.append(formatted);
                        }
                    } else {
                        cell.html(value);
                    }
                }
            }
        },
        onBeforeRender: function () { },
        onAfterRender: function () { },
        initChanges: function () {
            var that = this,
                target = that.target,
                opts = that.options,
                data = that.data || { total: 0, rows: [] },
                rows = data.rows || [];
            var originalRows = [];
            for (var i = 0; i < rows.length; i++) {
                originalRows.push($.extend({}, rows[i]));
            }
            that.originalRows = originalRows;
            that.updatedRows = [];
            that.insertedRows = [];
            that.deletedRows = [];
        },
        request: function (params) {
            var that = this,
               target = that.target,
               opts = that.options;

            if (params) opts.queryParams = params;

            var param = $.extend({}, opts.queryParams);
            if (opts.pagination) {
                $.extend(param, {
                    pageNumber: opts.pageNumber,
                    pageSize: opts.pageSize
                });
            }
            if (opts.onBeforeLoad.call(that, param) == false) return;

            that.loading();
            setTimeout(function () {
                doRequest();
            }, 0);

            function doRequest() {
                var result = opts.loader.call(that, param, function (data) {
                    setTimeout(function () {
                        that.loaded();
                        var total = data.total || 0;
                        if (total == 0) {
                            that.showMessage(that.options.norecordMsg);
                        }
                    }, 0);
                    that.loadData(data);
                    setTimeout(function () {
                        that.initChanges();
                    }, 0);
                }, function () {
                    setTimeout(function () {
                        that.loaded();
                    }, 0);
                    opts.onLoadError.apply(that, arguments);
                });
                if (result == false) {
                    that.loaded();
                }
            }
        },
        loading: function () {
            var that = this, opts = that.options;
            if (opts.loadMsg) {
                var panel = that.panel;
                that.loaded();
                $('<div class="itable-mask itable-mask-loading" style="display:block"></div>').appendTo(panel);
                var msg = $('<div class="itable-mask-msg" style="display:block;left:50%"></div>').html(opts.loadMsg).appendTo(panel);
                msg.outerHeight(40);
                msg.css({
                    marginLeft: (-msg.outerWidth() / 2),
                    lineHeight: (msg.height() + 'px')
                });
            }
        },
        loaded: function () {
            var that = this, opts = that.options;
            var panel = that.panel;
            panel.children('div.itable-mask-msg').remove();
            panel.children('div.itable-mask').remove();
        },
        showMessage: function (msg) {
            var that = this, opts = that.options;
            var panel = that.panel;
            if (!panel.children('div.itable-mask').length) {
                $('<div class="itable-mask itable-mask-message" style="display:block"></div>').appendTo(panel);
                var msg = $('<div class="itable-mask-msg" style="display:block;left:50%"></div>').html(msg).appendTo(panel);
                msg.outerHeight(40);
                msg.css({
                    marginLeft: (-msg.outerWidth() / 2),
                    lineHeight: (msg.height() + 'px')
                });
            }
        },
        setSize: function (param) {
            var that = this, opts = that.options, panel = that.panel,
                tableBody = that.dataContext.normalView.children('table.itable-body');

            //if (param) {
            //    $.extend(opts, param);
            //}

            //if (opts.fit == true) {
            //    var p = panel.panel('panel').parent();
            //    opts.width = p.width();
            //    opts.height = opts.canAutoHeight ? p.height() : 'auto';
            //}
            panel.width(tableBody.width());
        },
        refreshPagerState: function () {
            var that = this,
                opts = that.options,
                dc = that.dataContext,
                pager = dc.pager.show(),
                data = that.data || { total: 0, rows: [] },
                pageNumber = opts.pageNumber || 1,
                pageSize = opts.pageSize || 15,
                totalCount = opts.totalCount = data.total,
                totalPage = opts.totalPage = Math.ceil(totalCount / pageSize) > 0 ? Math.ceil(totalCount / pageSize) : 1,
                pageNumber = opts.pageNumber = pageNumber > totalPage ? totalPage : pageNumber;
            if (pager.length > 0) {
                var pagerFirst = pager.children('.first'),
                    pagerPrev = pager.children('.prev'),
                    pagerNext = pager.children('.next'),
                    pagerLast = pager.children('.last'),
                    pagerMsgContainer = pager.children('span:eq(0)'),
                    displayMsgContainer = pager.children('span:eq(1)');
                displayMsgContainer.text(opts.pager.displayMsg.replace(/{totalCount}/, totalCount));
                pagerMsgContainer.text(opts.pager.pagerMsg.replace(/{total}/, totalPage).replace(/{pageNumber}/, pageNumber));
                pagerFirst.add(pagerPrev).add(pagerNext).add(pagerLast).removeClass('pager-disabled');
                if (pageNumber == 1) {
                    pagerFirst.add(pagerPrev).addClass('pager-disabled');
                }
                if (pageNumber == totalPage) {
                    pagerNext.add(pagerLast).addClass('pager-disabled');
                }
            }
        }

    });
    iTable.default = {
        options: {
            striped: true,
            nowrap: true,
            method: 'post',
            scrollbarSize: 0,
            showHeader: true,
            loadMsg: '正在加载中，请等待...',
            norecordMsg: '没有与搜索条件匹配的项',
            queryParams: {},
            pagination: true,
            pageNumber: 1,
            pageSize: 15,
            pager: {
                displayMsg: '共{totalCount}条记录',
                pagerMsg: '第{pageNumber}/{total}页'
            },
            loadFilter: function (data) {
                if (typeof data.length == 'number' && typeof data.splice == 'function') {
                    return {
                        total: data.length || 0,
                        rows: data || []
                    };
                } else {
                    return data;
                }
            },
            onLoadSuccess: function (data) { },
            onBeforeLoad: function (param) {
                return true;
            },
            onLoadError: function (arguments) {

            },
            loader: function (param, success, error) {
                var that = this, opts = that.options;
                if (!opts.url) return false;
                $.ajax({
                    type: opts.method,
                    url: opts.url,
                    data: param,
                    dataType: 'json',
                    success: function (data) {
                        success(data);
                    },
                    error: function () {
                        error.apply(that, arguments);
                    }
                });
            },
            onSelectPage: function (pageNumber, pageSize) {

            }
        }
    }
})(alijk);