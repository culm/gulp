(function(A) {
	A.widget.bTable = function(options){
		var op = {
			container: null,//table的容器,css selector
			containerClass: 'table-container',//表格默认样式
			tableClass: 'table-hover table-bordered',
			bindDropdown: false,//如果是可编辑表格，是否绑定下来列表
			initCollapseAll: false,//默认不展开
			multi: false,//默认不支持多行编辑
			//groupField: status,//表格的分组字段
			//onGroupFormatter,//分组的formmatter
			//groupSort: true,//自动排序
			/*collumns:[//列
				{title: '医疗机构名称',//标题
				field: 'name',//字段
				class: 'title'//列自动绑定的class,
				formatter: function(rowValue, value, index){
					//rowValue,绑定行的数据,value对应字段的值,index：第几行
				}
				editor: {//可编辑表格对应的类型
					type: 'dropdown'//可编辑表格列对应的类型，目前只支持dropdown，text
					options:{
						valueField: 'id',
						textField:'text',
					},
					getDefaultData(){//动态获取可编辑表格下拉框的值
						return [{text: 'yes1', id: 1},
						{text: 'no2', id: 2}]
					},
					data: null,默认提供的动态表格的值
				}
				}
				{
					title: '操作',
					field: 'myaction',// 如果是myaction，代表对应的表格是自定义的button等类型
					class: 'myaction',
					formatter: function(rowValue, value, index){
						return [{
							text: '添加',
							value: 1,
							class: 'btn btn-link'
						},{
							text: '删除',
							value: 0,
							class: 'btn btn-danger'
						}]
					},
					//如果返回true，代表事件流终止，行级的onClick事件不在处理改事件
					onClick: function(rowValue, rowIndex, target){
						var value = target.data('value');
						if(typeof value !== 'undefined'){
							alert(value)
						}
						return true;
					}
				}
			]*/
			/*
			* true:显示， false：隐藏
			*/
			showHeader: true,
			/*
			* 绑定的click事件
			* 第一参数rowValue代表代表行绑定的数据
			* 第二个参数rowIndex代表第几行
			*/
			onClick: null,
			/*
			* 绑定的双击事件
			* 第一参数rowValue代表代表行绑定的数据
			* 第二个参数rowIndex代表第几行
			*/
			onDbClick: null
		}
		var _op = A.extend(op, options);
		var t = new _table(_op);
		return t;
	}
	function _table(options){
		var that = this;
		that.options = options;
		that._init();
	}
	A.extend(_table.prototype, A.widget, {
		_init: function(){
			var that = this,
				op = that.options,
				table = $('<table></table>'),
				tbody = $('<tbody></tbody>'),
				div = $('<div></div>');
			if(op.showHeader){
				var thead = that._getHead();
				table.append(thead);
				that.thead = thead;
			}
			that.container = div;
			div.addClass(op.containerClass);
			that.tbody = tbody;
			table.append(tbody);
			table.addClass('b-table table ' + op.tableClass);
			table.appendTo(div);
			
			if(that.options.onDbClick){
				tbody.on('dblclick', function(e){
					that.onDbClick($(e.target));
				});
			}

			div.find('table').on('click', function(e){
				var target = $(e.target);
				if(target.hasAttr('groupflag') && that._toggleGroup(target)){
					return;
				}
				that.onClick(target);
				// return false;
			});
			div.appendTo(op.container)

			that.data = [];
		},
		getData: function(){
			return this.data;
		},
		getColsData: function(){
			var that = this,data = []
			A.each(that.data, function(index, row) {
				var _row = {};
				A.each(that.options.collumns, function(index, col) {
					var field = col.field;
					_row[field] = row[field];
				});
				data.push(_row);
			});
			return data;
		},
		/**
		* 删除一行,先将data中的数据删除，在删除页面元素
		*/
		delRow: function(rowIndex){
			var that = this,
				tbody = that.tbody;
            that.data.splice(rowIndex, 1);
			tbody.find('tr[row-index="' + rowIndex + '"]').remove();
			A.each(tbody.find('tr'), function(index, tr){
				var _tr = $(tr),
					_rowIndex = parseInt(_tr.attr('row-index'),10);
				if(_rowIndex > rowIndex){
					_tr.attr('row-index', _rowIndex - 1);
				}
			});
			// that.loadData(data);
		},
		/*
		* 在当前行前插入一行数据
		 */
		insertRowTo: function(rowIndex, row, editting){
			var that = this,
				index = rowIndex,
				tbody = that.tbody;
			var otr=tbody.find('tr[row-index="' + rowIndex + '"]');
			that.data.splice(rowIndex, 0, row);
			$('<tr row-index="' + index + '">' + that._getRow(row, index) + '</tr>').insertBefore(otr);
			//更新整个table 否则 row-index 不对
			that._loadData();
			if(editting){
				that.showEdit(index);
			}
		},
		/*
		* 将当前行向上移动一个位置
		 */
		moveUpRow: function(rowIndex){
			var that = this,
				tbody = that.tbody,
				before=rowIndex-1,
				last=parseInt(rowIndex)+1;
			if(rowIndex<=0)
			{
				return;
			}
			var old=that.data.slice(rowIndex,last);
			that.data.splice(rowIndex, 1);
			that.data.splice(before, 0, old[0]);
			//更新整个table 否则 row-index 不对
			that._loadData();
		},
		/*
		* 将当前行向下移动一个位置
		 */
		moveDownRow: function(rowIndex){
			var that = this,
				tbody = that.tbody,
				len=that.data.length,
				before=rowIndex-1,
				last=parseInt(rowIndex)+1;
			if(rowIndex>=len-1)
			{
				return;
			}
			var old=that.data.slice(rowIndex,last);
			that.data.splice(rowIndex, 1);
			that.data.splice(last, 0, old[0]);
			//更新整个table 否则 row-index 不对
			that._loadData();
		},
		insertRow: function(row){
			var that = this;
			that.data.unshift(row);
			that._loadData();
			that.endEditing();
		},
		appendRowBool: true,
		appendRow: function(row, editting){
			var that = this,
				data = that.data,
				index = data.length;
			if(!that.options.multi && !that.validateAll()){
				return false;
			}
			data.push(row);
			$('<tr row-index="' + index + '">' + that._getRow(row, index) + '</tr>').appendTo(that.tbody);
			// that._loadData();
			if(editting){
				that.showEdit(index);
			}
			
			// that.endEditing();
		},
		loadData: function(data){
			var that = this,
				html = [],
				options = that.options,
				groupfield = options.groupfield || options.groupField;
			if(groupfield && options.groupSort){
				var sort = that.options.onSort;
				if(!sort) sort = function(d1, d2){
					var val1 = d1[groupfield],
						val2 = d2[groupfield];
					if(val1 > val2) return 1;
					else if(val1 == val2) return 0
					else return -1;
				}
				data.sort(sort);
			}
			that.data = data;
			that._loadData();
		},
		_loadData: function(){
			var that = this,
				html = [],
				op = that.options,
				groupfield = op.groupfield || op.groupField;
			var groupFlag = null,
				style = '';
			if(op.initCollapseAll) style = 'display:none';
			A.each(that.data, function(index, d){
				if(groupfield){
					var flagValue = d[groupfield];
					if(flagValue != groupFlag){
						groupFlag = flagValue;
						html.push(that._getGroupHTML(flagValue,d));
					}
				}
				// if(op.getRowStyle) style = op.getRowStyle.call(that, d);
				var rowClass = '';
				if(op.getRowClass) rowClass = op.getRowClass.call(that, d);
				html.push('<tr class="' + rowClass + '" style="' + style + '" flag="' + d[groupfield] + '" row-index="' + index + '">' + that._getRow(d, index) + '</tr>');
			});
			that.tbody.html(html.join(''));
		},
		_getGroupHTML: function(flag,row){
			var that = this,
				op = that.options,
				length = op.collumns.length,
				flagTxt = flag,styler='',cls='',toolbar='',
				groupFlagClass = 'glyphicon-minus';
			if(op.initCollapseAll) groupFlagClass = 'glyphicon-plus';
			if(op.onGroupFormatter){
				flagTxt = op.onGroupFormatter(flag,row);
			}
			if (op.groupStyler) {
				if (typeof op.groupStyler == 'function')
					styler = op.groupStyler(flag,row);
				else {
					styler = op.groupStyler;
				}
			}
			if (op.groupCls) {
				if (typeof op.groupCls == 'function')
					cls = op.groupCls(flag,row);
				else {
					cls = op.groupCls;
				}
			}
			if(op.groupToolbarFormatter){
				if (typeof op.groupToolbarFormatter == 'function')
					toolbar = op.groupToolbarFormatter(flag,row);
				else {
					toolbar = op.groupToolbarFormatter;
				}
			}
			return '<tr class="' + cls + '" style="' + styler + '"><td colspan="' + length + '"><span class="btable-group glyphicon ' + groupFlagClass + '" groupflag="' + flag + '" aria-hidden="true"></span><span>' + flagTxt + '</span>' + toolbar + '</td></tr>'
		},
		_toggleGroup: function(target){
			var that = this,
				flag = target.attr('groupflag');
			if(!target.hasClass('btable-group')) return false;
			if(target.hasClass('glyphicon-minus')){
				target.removeClass('glyphicon-minus');
				target.addClass('glyphicon-plus');
				that.tbody.find('tr[flag="' + flag + '"]').hide();
			}else{
				target.removeClass('glyphicon-plus');
				target.addClass('glyphicon-minus');
				that.tbody.find('tr[flag="' + flag + '"]').show();
			}
			return true;
		},
		_getHead: function(){
			var thead = $('<thead></thead>'),
				html  = ['<tr>'];
			A.each(this.options.collumns, function(index, collumn){
				var style = '';
				if(collumn.width){
					style = 'width:' + collumn.width + ";";
				}
				if(collumn.hidden) style += 'display:none;';
				
				html.push('<th style="' + style + '" class="' + (collumn.class || '') + '">' + collumn.title + '</th>');
			});
			html.push('</tr>');
			thead.html(html.join(''));
			return thead;
		},
		_getCheckBoxHtml: function(value, row, index, col){
			if(row.disabl && row.disabl=='true')
			{
				return '<input class="checkbox-input" data-row="' + index + '" ' + (value === true ? 'checked="checked"':'')+'disabled="disabled"' + ' type="checkbox">';
			}
			else{
			return '<input class="checkbox-input" data-row="' + index + '" ' + (value === true ? 'checked="checked"':'') + ' type="checkbox">';
			}
		},
		_getFormatter: function(value, row, index, col){
			var that = this;
			if(!col.formatter) {
				var editor = col.editor;
				if(editor && editor.type === 'checkbox'){
					return that._getCheckBoxHtml(value, row, index, col);
				}
				if(typeof value == 'undefined') return '';
				return value;
			}
			var formatter = col.formatter.call(that, value, row, index, that.editingIndex === index);
			if(typeof formatter == 'string'||typeof formatter == 'number') return formatter;
			var html = [];
			if(typeof formatter !== 'undefined'){
				A.each(formatter, function(index, obj){
					var tagName = obj.tagName || 'button';
					html.push('<' + tagName + ' data-value="' + obj.value + '"class="customeraction ' + obj.class + '">' + obj.text + '</' + tagName + '>');
				});
			}
			return html.join('');
		},
		_getRow: function(rowVaue, index){
			var that = this,
				op = that.options,
				html = [];
			A.each(op.collumns, function(cindex, col){
				var field = col.field,
					value = rowVaue[field],
					txt = that._getFormatter(value, rowVaue, index, col),
					style = '';
				if(col.width){
					style = 'width:' + col.width + ';';
				}
				if(col.hidden) style += 'display:none;';
				var formatterValue = value;
				if(col.formatter) formatterValue = col.formatter.call(that, value, rowVaue, index);
				if(formatterValue && typeof formatterValue == 'string' && formatterValue.indexOf('<') >= 0) formatterValue = '';
				var title = formatterValue;
				if(!title) title = '';
				if(typeof title == 'object') title = '';
				html.push('<td data-field="' + col.field + '" style="' + style + '" class="' + (col.class || '')+ '" col-index="' + cindex + '"><div class="no-table-editor-' + field + ' no-table-field-editor" title="' + title + '">' + txt + '</div></td>');
			});
			return html.join('');
		},
		_getClickCell: function(target){
			while(!target.hasAttr('col-index')) {
				var tagName = target.prop('tagName');
				if(tagName == 'TR' || tagName == 'TBODY' || tagName == 'BODY') return null;
				target = target.parent();
			}
			return target;
		},
		onDbClick: function(target){
			var that = this,
				op = that.options,
				cellDom = that._getClickCell(target);
			if(cellDom == null) return;
			var rowDom = cellDom.parent(),
				cellIndex = parseInt(cellDom.attr('col-index'), 10),
				rowIndex = parseInt(rowDom.attr('row-index'), 10),
				collumn = op.collumns[cellIndex],
				rowValue = that.data[rowIndex];
			if(op.onDbClick){
				op.onDbClick.call(that, rowValue[collumn.field], rowValue, rowIndex);
			}
		},
		onClick: function(target){
			var that = this,
				op = that.options,
				cellDom = that._getClickCell(target);
			if(cellDom == null) return;
			var rowDom = cellDom.parent(),
				cellIndex = parseInt(cellDom.attr('col-index'), 10),
				rowIndex = parseInt(rowDom.attr('row-index'), 10),
				collumn = op.collumns[cellIndex],
				rowValue = that.data[rowIndex],
				isEditting = that.tbody.find('tr[row-index="' + rowIndex + '"]').hasClass('editing-tr');
			if(collumn.onClick){
				var ret = collumn.onClick.call(that, rowValue, rowIndex, target, isEditting);
				if(ret === false) return false;
			}
			//如果点击的是可编辑表格的tr，不触发行级onClick事件
			if(rowIndex != that.editIndex && op.onClick){
				var ret = op.onClick.call(that, rowValue, rowIndex, isEditting);
			}
		},
		/**
		* 验证值是否正确
		*/
		_hasErr: function(patterns, value, rowValue){
			var that = this,
				message = '';
			if(!patterns || typeof value === 'undefined') return message;
			A.each(patterns, function(pattern, obj){
				var objType = typeof obj;
				// if(value===null) {
				// 	obj(value, rowValue);
				// 	return false;
				// }
				if(objType !== 'undefined' && value !== null && typeof value[pattern] === 'function'){//string自身或扩展的方法
					if(value && !value[pattern]()){
						message = obj;
						return false;
					}
				}else if(objType === 'string'){//正则表达式
					var pattern = new RegExp(pattern,'g');
					if(!pattern.test(value)){
						message = obj;
						return false;
					}
				}else if(objType === 'function'){//自定义的验证方法
					message = obj(value, rowValue);
					if(message){
						return false;
					}
				}
			});
			return message;
		},
		validateRow: function(rowIndex){
			var that = this;
			var op = that.options,
				_data = {},
				isRight = true,
				tr = that.tbody.find('tr[row-index="' + rowIndex + '"]'),
				rowValue = that.data[rowIndex];
			//验证每一项是否正确
			A.each(op.collumns, function(index, col){
				var editor = col.editor;
				if(!editor) return;
				var editorType = editor.type || 'text';
				var value = null,
					obj = null,
					field = col.field,
					pattern = editor.pattern;
				switch(editorType){//取值
					case 'text':
					case 'datetimepicker':
					case 'checkbox':
						obj = tr.find('td.' + col.field + ' input');
						// field = obj.attr('field');
						value = obj.val();
						break;
					case 'dropdown':
						obj = tr.find('td.' + col.field + ' a.dropdown-toggle');
						// field = obj.attr('field');
						value = obj.attr('value');
						break;
					case 'fileupload':
						obj = tr.find('td.' + col.field + ' .table-fileupload');
						// field = obj.parent().data('field');
						value = obj.data('url');
						if(typeof value == 'undefined'){
							value = rowValue[col.field];
						}
						break;
					case 'select': 
						obj = tr.find('td.' + col.field + ' select');
						value = obj.val();
						break;
					default:
						throw ('未知的控件类型：' + editorType);
				}
				if(pattern){//有验证
					var message = that._hasErr(pattern, value, rowValue);
					if(message){//验证数值不正确
						isRight = false;
						obj.parent().addClass('has-error');
						obj.focus();
						A.widget.tooltip.show({
							message: message,
							placement: 'bottom',
							autoClose: 2000,
							target: obj
						});
						return false;
					}
				}
				if(col.getEditData){//自定义了取值方法
					value = col.getEditData.call(that, that.data[rowIndex], obj, value);
				}
				_data[field] = value;
			});
			if(!isRight){
				return false;
			}
			//获取编辑的值
			A.extend(that.data[rowIndex], _data);
			return true;
		},
		/**
		* 开始编辑,如果rowindex不是数字，编辑所有行
		*/
		beginEditIng: function(rowIndex){
			var that = this,
				op = that.options,
				len = that.data.length;
			if(!op.multi && !that.validateAll()){
				return;
			}
			if(typeof rowIndex == 'number'){
				if(rowIndex >= len){
					return;
				}
				that.showEdit(rowIndex);
			}else{
				for(var index = 0;index<len; index++){
					that.showEdit(index);
				}
			}
		},
		validateAll: function(){
			var that = this,
				trs = that.tbody.find('.editing-tr'),
				isValid = true;
			A.each(trs, function(index, tr){
				var rowIndex = parseInt($(tr).attr('row-index'), 10);
				if(that.validateRow(rowIndex)){
					that._endEditing(rowIndex);
				}else{
					isValid = false;
				}
			});
			return isValid;
		},
		endEditing: function(){
			if(this.validateAll()){
				return true;
			}else{
				return false;
			}
		},
		_endEditing: function(rowIndex){
			var that = this,
				tr = that.tbody.find('tr[row-index="' + rowIndex + '"]');
			tr.html(that._getRow(that.data[rowIndex], rowIndex));
			tr.removeClass('editing-tr');
			that.appendRowBool=true;
		},
		/*
		* 显示可编辑表格
		*/
		showEdit: function(rowIndex){
			var that = this,
				op = that.options,
				rowValue = that.data[rowIndex],
				hasDropdown = false,
				hasDatetimepicker = false,
				hasFileupload = false,
				hasSelect = false,
				tr = that.tbody.find('tr[row-index="' + rowIndex + '"]');
			tr.addClass('editing-tr');
			that.editingIndex = rowIndex;
			A.each(op.collumns, function(index, col){
				if(op.container=='#user-container' && index==0 && rowValue.userId)return true;
				var field = col.field,
					className = field + ' ' + (col.class || ''),
					editor = col.editor,
					td = tr.children('[col-index="' + index + '"]');
				// if(field=='name')continue;
				if(col.updateWhenEdit){
					var value = rowValue[col.field],
						html = that._getFormatter(value, rowValue, rowIndex, col);
					td.find('.no-table-field-editor').html(html);
				}
				if(!editor || editor.hidden) {
					return;
				}
				var type = editor.type;
				className += ' editor editor' + type;
				if(type == 'dropdown') {
					hasDropdown = true;
					if(!parseInt(rowValue[field]) && editor.typeNum) rowValue[field] = 0;
				}else if(type == 'datetimepicker') {
					hasDatetimepicker = true;
				}else if(type == 'fileupload'){
					hasFileupload = true;
				}else if(type == 'select'){
					hasSelect = true;
				}

				var value = rowValue[field] == null ? '' : rowValue[field],
					editorHtml = that._getEidtorHTML(value, col, rowValue, index, rowIndex),
					editorObj = td.find('.table-field-editor');
				if(editorObj.length === 0){
					$('<div class="table-' + type + ' table-field-editor-' + field + ' table-field-editor">' + editorHtml + '</div>').appendTo(td);
				}
				td.addClass('table-editing');
			});
			if(hasSelect){//代替绑定select的选中事件
			    var _this = null,
			        isSelected = false; 
				tr.delegate('.table-select-item','click',function (){
					_this = $(this),
					isSelected = _this.hasClass('selected');
	                if(isSelected){
                        _this.removeClass('selected'); 
	                }else{
	                	_this.addClass('selected');
	                }
	            });
			}
			if(hasDropdown){//代替绑定dropdownlist的选中事件 
				//tr.find('a[dropdown-id]').off('click').on('click', function (e) {
				tr.delegate('a[dropdown-id]','click', function (e) {
				  	var target = $(e.target),
				  		txt = target.html(),
				  		dropObj = $(target.attr('dropdownid')),
				  		field = dropObj.attr('field'),
				  		span = dropObj.find('span')[0];
				  	span.innerHTML = txt;
				  	span.title = txt;
				  	dropObj.attr('value', target.attr('dropdown-id'));
				  	var parent=$(target).parents('#hostpitalList');
				  	if(parent && field=='province') 
				  	{
				  		var html=[];
				  		//调用城市查询接口 更新城市列表
				  		//var getCityList= A.admin.hosL.getCity(txt,'out');
				  		A.admin.hosL.hosList.getCity(txt).success(function (res){
			                var getCityList = res.list; 
			                var oul= $(target).parents('tr.editing-tr').find('.table-field-editor-city .navbar-nav li .dropdown-menu');
			                var dropdownId = $(oul).attr('aria-labelledby');
			                A.each(getCityList, function(index, d){
								var _text = d.name, _id=d.id;
								html.push('<li><a title="' + _text + '" class="text-overflow" dropdownid="#' + dropdownId + '" dropdown-id="' + _text + '" href="javascript:void(0)">' + _text + '</a></li>');
							});	
							$(oul).html(html);
			            });				  		
				  	}
				  	if(parent && field=='city') 
				  	{
				  		var html=[];
				  		//调用地区查询接口 更新地区列表
				  		//A.admin.hosL.getCountry(txt,'out');
				  		A.admin.hosL.hosList.getCountry(txt).success(function (res){
			                var getCityList = res.list; 
			                var oul= $(target).parents('tr.editing-tr').find('.table-field-editor-country .navbar-nav li .dropdown-menu');
			                var dropdownId = $(oul).attr('aria-labelledby');
			                A.each(getCityList, function(index, d){
								var _text = d.name, _id=d.id;
								html.push('<li><a title="' + _text + '" class="text-overflow" dropdownid="#' + dropdownId + '" dropdown-id="' + _text + '" href="javascript:void(0)">' + _text + '</a></li>');
							});	
							$(oul).html(html);
			            });
				  	}
				  	if(parent && field=='grade') //点击医院级别 更新等级
				  	{
				  		var html=[];
				  		var levelList=[];
				  		if(txt=="三级") {
				  			levelList = [{name: '特等', id: 0},
                                        {name: '甲等', id: 1},
                                        {name: '乙等', id: 2},
                                        {name: '丙等', id: 3},
                                        {name: '未评等', id: 4},
                                        {name: '其他', id: 5}]
				  		}else if (txt=="二级"||txt=="一级") {
				  			levelList = [{name: '甲等', id: 0},
                                        {name: '乙等', id: 1},
                                        {name: '丙等', id: 2},
                                        {name: '未评等', id: 3},
                                        {name: '其他', id: 4}]
				  		}else {
				  			levelList = [{name: '其他', id: 0}];
				  		}
				  		var abiaoqian= $(target).parents('tr.editing-tr').find('.table-field-editor-level .navbar-nav li a');
				  			html.push('<span class="dropdowntext text-overflow" title="'+levelList[0].name+'">'+levelList[0].name+'</span><span class="caret"></span>'); 
				  			abiaoqian.html(html);

			                var oul= $(target).parents('tr.editing-tr').find('.table-field-editor-level .navbar-nav li .dropdown-menu');
			                var dropdownId = $(oul).attr('aria-labelledby');
			                html = [];
			                A.each(levelList, function(index, d){
								var _text = d.name, _id=d.id;
								html.push('<li><a title="' + _text + '" class="text-overflow" dropdownid="#' + dropdownId + '" dropdown-id="' + _text + '" href="javascript:void(0)">' + _text + '</a></li>');
							});	
							$(oul).html(html);
		                
				  	}
				  	A.each(op.collumns, function(index, col){
				  		if(col.editor && col.field == field){
				  			var _op = col.editor.options;
				  			if(_op && _op.onSelect){
				  				_op.onSelect.call(that, e, target.attr('dropdown-id'), txt);
				  			}
				  			return false;
				  		}
				  	});
				});
			}			
			if(hasDatetimepicker){//绑定Datetimepicker控件
				A.each(tr.find('input.datetimepicker'), function(_index, dom){
					var target = $(dom),
						index = target.data('index'),
						col = op.collumns[index],
						_op = {
							format: 'yyyy-mm-dd',
							language: 'zh-CN',
				            weekStart: 1,
				            todayBtn: 1,
				            autoclose: 1,
				            todayHighlight: 1,
				            startView: 2,
				            minView: 2,
				            forceParse: 0
						};
					A.extend(_op, col.editor.options);
					target.datetimepicker(_op);
				});
			}
			if(hasFileupload){
				A.each(tr.find('.table-fileupload'), function(_index, div){
					var target = $(div),
						index = parseInt(target.parent().attr('col-index'),10),
						col = op.collumns[index];
					if(div.id) return;
					var id = 'fileupload-' + _index + '_' + new Date().getTime();
					div.id = id;
					var _op = {
						container: '#' + id
					};
					A.extend(_op, col.editor.options);
					new A.widget.fileupload(_op);
				})
			}
			//绑定注册事件
			A.each(op.collumns, function(index, col){
				var editor = col.editor;
				if(!editor || !editor.inputEvents || editor.type != 'text') return;
				var input = tr.find('td.' + col.field + ' input');
				if(editor.keyUpevent && editor.keyUpevent=='true')
				{
					A.each(editor.inputEvents, function(eventName, func){
						if(eventName=='keyup')
						{
							input.off(eventName).on(eventName, function(e){
								var len=$(input).val().length;
								var obj=$(input).parent();
								if(len>=$(input).attr('maxLength'))
								{
									obj.addClass('has-error');
									A.widget.tooltip.show({
										message: '最多允许30个字符',
										placement: 'bottom',
										autoClose: 2000,
										target: obj
									});
								}
								else
								{
									A.widget.tooltip.hide();
									obj.removeClass('has-error');
								}
							});
						}
						else
						{
							input.off(eventName).on(eventName, function(e){
								func.call(that, e);
							});
						}
					})
				}
				else
				{
					A.each(editor.inputEvents, function(eventName, func){
						input.off(eventName).on(eventName, function(e){
							func.call(that, e);
						});
					})
				}
			});
			that.editingIndex = null;
			var customerEditor = tr.find('.customerEditor')[that.clickIndex-1];
			if(customerEditor) customerEditor.focus();
		},
		_getEidtorHTML: function(value, col, rowData, colIndex, rowIndex){
			val = typeof value == 'object' ? value.data : value;
			var that = this,
				editor = col.editor;
			var maxLenHtml='';
			if(col.maxLen)
			{
				maxLenHtml='maxLength='+col.maxLen;
			}
			if(typeof val == 'undefined') val = '';
			switch(editor.type){
				case 'text':
					return '<input '+maxLenHtml+' data-index="' + colIndex + '" field="' + col.field + '" type="text" class="form-control customerEditor ' + editor.type + '" value="' + val + '">';
				case 'datetimepicker':
					return '<input '+maxLenHtml+' readonly data-index="' + colIndex + '" field="' + col.field + '" type="text" class="form-control customerEditor ' + editor.type + '" value="' + val + '">';
				case 'dropdown':
					return that._getDropdownHTML(val, col, rowData, colIndex, rowIndex);
				case 'fileupload':
					return '';
				case 'checkbox':
					return that._getCheckBoxHtml(value, rowData, rowIndex, col);
				case 'select': 
					return that._getSelectHtml(value, rowData, rowIndex, col);
				default:
					return '未知类型:' + editor.type;
			}
			return val || '';
		},
		_getSelectHtml: function(value, rowData, rowIndex, col){
			var that = this,
				editor = col.editor,
				options = editor.options,
				valueField = options.valueField,
				textField = options.textField,
				html = ['<div ' + (options.multi ? 'multiple="multiple"' : '') + ' class="form-control role_select"><div class="role_s_s">'],
				defaultData = editor.getDefaultData.call(that) || [],
				_value = value,
				customerValue = {};
			if(typeof _value === 'string'){
				_value = [value];
			}
			// A.each(_value, function(__, filedId){
			// 	customerValue[filedId] = true;
			// });
			A.each(defaultData, function(index, obj){
				if(editor.onRender){
					html.push(editor.onRender(obj, value));
				}
				// var val = obj[valueField];
				// if(obj[textField])
				// {
				// 	html.push('<p ' + (customerValue[val] ? 'selected class="has_select"':'') + ' value="' + val + '">' + obj[textField] + '</p>');
				// }
			});
			html.push('</div></div>');
			return html.join('');
		},
		_getFileuploadHtml: function(value, col, rowData, colIndex, rowIndex){
			return '';
		},
		_getDropdownHTML: function(value, col, rowData, colIndex, rowIndex){
			var html = [],
				that = this,
				txt = value,
				editor = col.editor,
				eOp = editor.options,
				field = col.field,
				dropdownId = 'dropdown_btable' + field + '-' + rowIndex + '-' + col.field + '-' + new Date().getTime(),
				valueField = eOp.valueField,
				textField = eOp.textField;
			html.push('<ul class="dropdown-menu" aria-labelledby="' + dropdownId + '">');
			var data = eOp.data;
			if(eOp.getDefaultData) data = eOp.getDefaultData.call(that, rowData);
			A.each(data, function(index, d){
				if(d[valueField] == value) txt = d[textField];
				var _text = d[textField];
				html.push('<li><a title="' + _text + '" class="text-overflow" dropdownid="#' + dropdownId + '" dropdown-id="' + d[valueField] + '" href="javascript:void(0)">' + _text + '</a></li>');
			});

			html.push('</ul>');
			if(col.formatter) txt = col.formatter.call(that, value);
			return '<div class="dropdown nav navbar-nav"><li><a field="' + field + '" id="' + dropdownId + '" class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><span class="dropdowntext text-overflow" title="' + txt + '">' + txt + '</span><span class="caret"></span></a>' + html.join('') + '</li></div>';
		},
		/**
		* 获取所有的checkbox选中的行和非选中的行
		*/
		getSelectStatus: function(){
			var that = this,
				checkboxes = that.tbody.find('.checkbox-input'),
				data = that.data,
				selected = [],
				unselected = [];
			A.each(checkboxes, function(index, checkbox){
				var rowIndex = parseInt(checkbox.getAttribute('data-row'), 10);
				if(checkbox.checked){
					selected.push(data[rowIndex]);
				}else{
					unselected.push(data[rowIndex]);
				}
			});
			return {
				"selected": selected,
				"unselected": unselected
			};
		}		
	});
	$.fn.hasAttr = function(name,val){
	    if(val){
	        return $(this).attr(name) === val;
	    }
	    return $(this).attr(name) !== undefined;
	};
})(my);