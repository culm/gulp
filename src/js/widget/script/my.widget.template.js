(function (A) {
    /**
    * 模板管理
    */
    var itemplate = A.widget.template = function (options) {
        var that = this;
        that.options = {
        	typeId: null,
        	//诊所id
        	tenantId: window.TENANT_ID,
        	//医生id
        	persionId: window.PHYSICIAN_ID,
        	contianer: '',

        	//event
        	onDblClickRow: null
        }
        // User defined options
        var _options = that.options;
        for (i in options) _options[i] = options[i];
        that.container = $(that.options.container);
        that.pageIndex = 1;
        // that._init();
    };
    A.widget.template.findByName = function(options){
    	A.ajax({
			url: PATH + "/findTemplateName",
			dataType: "json",
			type: 'post',
			data: {
				params: A.toJSON(options.data)
			},
			success: function(opInfo) {
				if(options.success)options.success(opInfo);
			},
			error: function(){
				if(options.error)options.error();
			}
		});
    }
    A.widget.template.save = function(options){
    	A.widget.loading.show({message: '正在保存模板...'});
    	var data = options.data;
    	itemplate.findByName({
    		data: data,
    		success: function(op){
    			var info = op;
				if(info.success=='2005'){
        			A.ajax({
        				url: PATH + "/templateSave",
        				dataType: "json",
        				type: 'post',
        				data: {
        					params: A.toJSON(data)
        				},
        				success: function(opInfo) {
        					A.widget.loading.hide();
        					var info = opInfo;
        	                if (info.success =='1'){
        	                   	if(options.success) options.success(true);
        	                }else{
                				if(options.error) options.error();
        	                }
        				}

        			});
                }else if(info.success=='2000'){
                	A.widget.loading.hide();

            		$.messager.confirm('提示信息', '模板名称重复，是否覆盖?', function(r){
                        if (r){
                        	A.widget.loading.show({message: '正在保存模板...'});
                            data.id = info.id;
                			//提交修改的内容
                			A.ajax({
                				url: PATH + "/templateUpdate",
                				dataType: "json",
                				type: 'post',
                				data: {
                					params: A.toJSON(data)
                				},
                				success: function(opInfo) {
                					A.widget.loading.hide();
                					var info = opInfo;
                	                if (info.success =='1'){
                	                    if(options.success) options.success();
                	                }else{
                						if(options.error) options.error();
                	                }
                				},
                				error: function(){
                					A.widget.loading.hide();
                					if(options.error) options.error();
                				}
                			});
                        }
                    });
                }
    		},error: function(){
    			A.widget.loading.hide();
                if(options.error) options.error();
    		}
    	})
    }
    // Prototype
    itemplate.prototype = {
        _init: function(){
        	var that = this,
        		div = $('\
					<div class="template">\
                        <div class="no-template">模板数据加载中...</div>\
    					<div class="template-container" style="display:none">\
    						<div class="template-datagrid"></div>\
                            <div class="template-paginator"></div>\
    						<div class="caseSearchdiv">\
    							<input id="template_search_input" class="template-search form-control input-sm" />\
    						</div>\
    						<div class="type-container">\
    							<input type="radio" name="SearchType_question" value="0" checked/>\
    							次数优先\
    							<input type="radio" name="SearchType_question" value="1" />\
    							最新访问优先\
    						</div>\
    					</div>\
                    </div>');
			div.appendTo(that.container);
			that.noTemplate = div.find('.no-template');
            that.paginator = div.find('.template-paginator');
			that.templateContainer = div.find('.template-container');
			that.caseSearchdiv = div.find('.caseSearchdiv');
			that.datagrid = div.find('.template-datagrid');
			that.search = div.find('.template-search');
			that.typeContainer = div.find('.type-container');
			//选择事件，重载模板
			var inputs = div.find('.type-container input');
			inputs[0].checked = true;
            $(inputs).off('click').on('click', function(){
                that.pageIndex = 1;
        	    that.getTemplates();
        	});
			that.getTemplates();
            that.initSearch();
        },
        show: function(){
        	var that = this;
        	that.container.show();
        	if(!that.hasShowed){
        		that.hasShowed = true;
        		that._init();
        	}
        },
        hide: function(){
        	this.container.hide();
        },
        insertRow: function(row){
        	var that = this,
                table = that.table,
                data = table.getData(),
                value = A.toJSON(row.value.value || row.value);
        	if(data.length ==  0){
                that.noTemplate.hide();
                that.typeContainer.show();
                that.templateContainer.show();
                that.caseSearchdiv.show();
            }
            var _name = data.name,
                exist = false;
            A.each(data,function(i){
                if(_name == this.name){
                    data[i].value = value;
                    exist = true;
                    return false;
                }
            });
            if(!exist){
                table.insertRow(row);
            }
        },
        showTemplate: function(data){
            var that = this,
                pageSize = data.pageInfo.pageSize,
                casetemplate = that.datagrid,
                pageInfo = data.pageInfo;
            var notemplate = that.noTemplate;
            notemplate.hide();
            // data.pageInfo.total = 0;
            // data.pageInfo.result = [];
           if(pageInfo.total == 0){
                casetemplate.hide();
                that.templateContainer.hide();
                that.caseSearchdiv.hide();
                notemplate.html('暂无模板数据');
                notemplate.show();
            } else{
                that.initTable();
                casetemplate.show();
                that.typeContainer.show();
                that.templateContainer.show();
                that.caseSearchdiv.show();
                that.table.loadData(data.pageInfo.result);
                if(pageInfo.pageNum == 1){
                    A.widget.pagination({
                        container: that.paginator,
                        containerClass:'template-pagination',
                        paginationClass: 'pagination-sm',
                        size: 5,
                        currentPage: 1,
                        total: pageInfo.total,
                        onPageChange: function(old, newPageIndex){
                            that.pageIndex = newPageIndex;
                            that.getTemplates();
                        }
                    });
                }
            }
            
        },
        initTable: function(){
            var that = this;
            if(that.table) return;
            that.table = A.widget.bTable({
                container: that.datagrid,
                tableClass: 'table-hover table-bordered',
                collumns: [
                    {
                        halign : 'center',
                        field : 'name', 
                        title : '模板名称',
                        width : "65%"
                    },{
                        halign : 'center',
                        field : 'usedNum',
                        title : '引用次数',
                        width : "35%"
                    }],
                onDbClick: function(rowValue, index){
                    that.options.onDblClickRow.call(that, rowValue);
                }
            });
        },
        initSearch: function(){
            var that = this,
                search = that.search;
            if(that.autoComplete) return;
            that.autoComplete = new A.widget.AutoComplete('#' + search.prop('id'), {
                containerClass: 'AutoCompleteContainer.',
                exClass: 'template-auto',
                getTitleHtml:function(type){
                    return '<span class="title">输入模板名字或↑↓选择</span>';
                },
                PageCount:10,
                ShowNavigate: 1,
                pageIndex:0,
                GetUrl: function(){ 
                    return PATH + "/templateSearch";
                },
                dataType: 'text',
                ajaxType: 'get',
                customerJsonData: function(textdata){
                    var data = null;
                    eval('data=' + textdata + ';');
                    if(!data.info || data.info.success != 1){
                        return {Data: [], total:0}
                    }
                    var pageInfo = data.pageInfo;
                    return {Data: pageInfo.result ||[], total: Math.ceil(pageInfo.total/pageInfo.pageSize)};
                },
                getRequestData: function(){
                    var data = {
                            name: that.search.val(),
                            searchOrder: that.typeContainer.find("input[name='SearchType_question']:checked").val() || '0',
                            classId: 1,
                            pageNum: parseInt(this.Options.pageIndex,10) + 1,
                            pageSize: 10
                        }, 
                        op = that.options;
                    data.tenantId = op.tenantId;
                    data.persionId = op.persionId;
                    data.typeId = op.typeId;
                    return {params: A.toJSON(data)};
                },
                OnRender:function(item, type) {
                    var name = item.name || '',
                        usedNum = item.usedNum || 0;
                    return '\
                        <a class="container">\
                            <span title="' + name + '" class="itemdetail first col-sm-7" targetid>' + name + '</span>\
                            <span title="使用' + usedNum + '次"class="itemdetail second col-sm-5" targetid>' + usedNum + '</span>\
                        </a>';
                },
                OnSelect:function(item) {
                    if (item && that.options.onDblClickRow) {
                        that.options.onDblClickRow.call(that, item);
                        this.target.val('')
                    }
                },
                SearchedTitle:function(){
                    return '\
                        <div class="container">\
                            <div class="itemtitle first col-sm-7">模板名称</div>\
                            <div class="itemtitle second col-sm-5">引用次数</div>\
                        </div>';
                },
                ShowDefault:function(){ return false;},
                GetDefaultValue: function(){return '模板名字';}
            });
        },
        /*
        获取病历模板数据
    	success: 成功回调方法
    	error：失败回调，
    	data：参数
    	*/
    	getTemplates: function(options){
            options = options ||{};
    		var that = this,
    			data = options.data ||{},
    			op = that.options;
            data.name = '';
            data.pageSize = 10;
            data.searchOrder = that.typeContainer.find("input[name='SearchType_question']:checked").val() || '0';
    		data.tenantId = op.tenantId;
            data.classId = 1;
            data.pageNum = that.pageIndex;
    		data.persionId = op.persionId;
    		data.typeId = op.typeId;
    		if(that.tempalteajax){
    			that.tempalteajax.abort();
    			that.tempalteajax = null;
    		}
    		that.tempalteajax = A.ajax({
                type: 'post',
                url: PATH + "/templateSearch",
                data : {params: A.toJSON(data)},
                dataType : "text",
                success: function(textdata){
                    var data = null;
                    eval('data=' + textdata + ';');
                    that.templateContainer.show();
                    that.showTemplate(data);
                    if(options.success) options.success(data);
                },
                error: function(xhr, status){
                    if(status == 'abort') return;
                    if(options.error) options.error(xhr, status);
                }
            });
    	}
    }
})(alijk);