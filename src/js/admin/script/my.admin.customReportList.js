;
(function(A) {
    var U = A.admin,
        S = A.service,
        CT = function() {};
    A.extend(CT.prototype, A.base, U, S, {
        data : {},
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
            var that = this;

            $('#search').on('click', function() {
                that.data = {
                    tenantId : $('#tenantId option:selected').val(),
                    type : $('#type option:selected').val(),
                    name : $('#name').val()
                }
                that.loadData();
            });

            $('#addCustomReport').on('click', function() {
                var url = 'customReport.html?';
                url += 'tenantId=' + $('#tenantId option:selected').val();
                url += '&type=' + $('#type option:selected').val();
                url += '&name=' + $('#name').val();
                location.href = url;
            });


            // that.timeEvent();
            that.table = A.widget.bTable({
                container: '#customReport-container',
                tableClass: 'table-condensed table-hover table-bordered',
                onGroupFormatter: function(flag, row) {
                    return flag;
                },
                collumns: [{
                    title: '报表名',
                    field: 'name',
                    class: 'name',
                    formatter: function(value, row) {
                        return value
                    }
                }, {
                    title: '保险公司',
                    field: 'tenantId',
                    formatter: function(value, row) {
                        return that.getTenantName(value);
                    }
                }, {
                    title: '类型',
                    field: 'type',
                    formatter: function(value, row) {
                        if(value == 1) return '一般类型报表'
                        return '统计类型报表'
                    }
                }, {
                    title: '创建时间',
                    field: 'createdDate',
                    formatter: function(value, row) {
                        var creatBy = row.createdPeople || '',
                            creatDate = new Date(value).toString('yyyy-MM-dd HH:mm:ss') || '';
                        return '创建人:' + creatBy + '<div><a style=" cursor:text;text-decoration:none;">创建时间:' + creatDate + '</a></div>';
                        
                    }
                }, {
                    title: '最后修改时间',
                    field: 'lastModifiedDate',
                    formatter: function(value, row) {
                        var lastModifiy = row.lastModifiedPeople || '',
                            lastModifiyDate = new Date(value).toString('yyyy-MM-dd HH:mm:ss') || '';
                        return '最后修改人:' + lastModifiy + '<div><a style=" cursor:text;text-decoration:none;">最后修改时间:' + lastModifiyDate + '</a></div>';
                    }
                }, {
                    title: '操作',
                    field: 'claimer',
                    formatter: function(value, row) {
                        return '<button data-value="0" class="btn btn-primary">修改</button>\
                                <button data-value="1" class="btn btn-primary">删除</button>';
                    },
                    onClick: function(rowValue, rowIndex, target) {
                        var value = target.data('value');
                        if(value == 0 ){
                            var url = 'customReport.html?id='+rowValue.id+'&tenantId='+rowValue.tenantId+'&type='+rowValue.type+'&name='+rowValue.name;
                            location.href = url;
                        } 
                        if(value == 1 ){
                            //删除页面上对应的行数据
                            A.widget.dialog.show({
                                title: '提示',
                                modalType: '',
                                modalDialog: 'modal-sm',
                                message: '您确定要删除吗？',
                                buttons:[
                                    {text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal'},
                                    {text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal'}],
                                onClick:function(value, e){
                                    if(value == 0){
                                        that.delReport(rowValue.id)
                                    }
                                }
                            });
                            
                        }
                    }
                }]
            });
        },
        loadData: function(newPageNum) {
            var that = this;
            that.data.pageNum = newPageNum || 1;
            that.data.pageSize = 10;
            A.widget.loading.show({
                message: '数据查询中...'
            });

            that.customReport.getListPage(that.data).success(function(res){
                if (res.data.length === 0) {
                    $('#pagination-container-tips').removeClass('hide');
                } else {
                    $('#pagination-container-tips').addClass('hide');
                }
                that.table.loadData(res.data);
                A.widget.loading.hide();
                A.widget.pagination({
                    container: '#pagination-container',
                    containerClass: 'order-pagination',
                    size: 5,
                    pageNumber: res.pageNum,
                    pageSize: 10,
                    total: res.total,
                    onPageChange: function(oldPaage, newPage) {
                        that.loadData(newPage)
                    }
                });
            }).fail(function(res) {
                A.alert(res.rtnMsg);
                A.widget.loading.hide();
            })
        },
        delReport: function(id){
            var that = this;
            A.widget.loading.show({
                message: '数据正在删除...'
            });
            that.customReport.delete({'id':id}).success(function(res){
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
                location.reload(true)
            }).fail(function(res) {
                A.widget.loading.hide();
                A.alert(res.rtnMsg);
            })
        }
    });

    $(function() {
        var page = new CT();
        page.onReady();
    });

})(my);
