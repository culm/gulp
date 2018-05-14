;
(function(A) {
    var U = A.admin,
        S = A.service,
        CT = function() {};
    A.extend(CT.prototype, A.base, U, S, {
        onReady: function() {
            var that = this;
            that.initData();
        },
        initData: function() {
            var that = this;
            that.initHeader(function() {
                that.initEvent();
                that.loadData();
            });
        },
        initEvent: function() {
            var that = this,
                params = A.getParams();
                
            if(params.tenantId) $('#tenantId').val(params.tenantId);
            if(params.type) $('#type').val(params.type||1);
            if(params.name) $('#name').val(decodeURIComponent(params.name));

            $('#saveCustomReport').on('click', function() {
                var data = {
                    tenantId : $('#tenantId option:selected').val(),
                    type : $('#type option:selected').val(),
                    name : $('#name').val()
                }
                if(params.id) data.id = params.id;
                if (data.tenantId==''){
                    A.alert('请选择保险公司')
                } else if(data.type == ''){
                    A.alert('请选择报表类型')
                } else if(data.name==''){
                    A.alert('报表模版名称不能为空')
                } else {
                    data.content = {}
                    A.each($('#customReportBox .checkbox'),function(index, el) {
                        var type = el.getAttribute('data-parent');
                        var val = el.getAttribute('data-value');
                        var name = el.name;
                        if(!data.content[type]) data.content[type] = {};
                        data.content[type][name] = {
                            'name':val,
                            'checked':el.checked
                        }
                    });
                    data.content = A.toJSON(data.content);
                    that.submitInfo(data)
                }
            });
            $('#type').change(function(event) {
                that.loadData()
            });
        },
        loadData: function() {
            var that = this,
                params = A.getParams(),
                data = {
                    type : $('#type option:selected').val()
                }
                
            if(params.id && params.type == data.type) data.id = params.id
  
            A.widget.loading.show({
                message: '数据查询中...'
            });

            that.customReport.getName(data).success(function(res){
                var data = {};
                for(var type in res.data){
                    data[type] = []
                    for(var key in res.data[type]){
                        data[type].push({'key':key,'value':res.data[type][key].name,'checked':res.data[type][key].checked||false})
                    }
                }
                $('#customReportBox').html(template('customReportTemplate', data));
                $('.checkAll').on('click', function(event) {
                    var inputs = $(this).closest('.col-md-4').find('.inputEdit');
                    var checkBool = event.target.checked;
                    A.each(inputs,function(index, el) {
                        var input = el.children[1].children[0]
                        if(checkBool){
                            input.checked = true
                        }else{
                            input.checked = false
                        }
                    });
                });
                A.widget.loading.hide();
            }).fail(function(res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            })
        },
        submitInfo: function(data){
            var that = this;
            A.widget.loading.show({
                message: '报表模版提交中...'
            });
            if(data.id){
                that.customReport.update(data).success(function(res){
                    A.widget.loading.hide();
                    A.alert('报表模版修改成功')
                    location.href="customReportList.html"
                }).fail(function(res){
                    A.widget.loading.hide();
                    A.alert(res.rtnMsg);
                })
            } else {
                that.customReport.add(data).success(function(res){
                    A.widget.loading.hide();
                    A.alert('报表模版增加成功')
                    location.href="customReportList.html"
                }).fail(function(res){
                    A.widget.loading.hide();
                    A.alert(res.rtnMsg);
                })
            }
            
        }
    });

    $(function() {
        var page = new CT();
        page.onReady();
    });

})(my);
