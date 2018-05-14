;(function (A) {
    var CT = function(){};
    A.extend(CT.prototype, A.base, A.admin,A.service, {
        onReady: function () {
            var that = this;
            that.newPageNum = 1 ;
            that.mappingData={
                pageNum : that.newPageNum,
                pageSize :10
            };
            that.actionRecord=A.service.actionRecord;
            that.initData();
            that.initEvent();   
        },
        initData: function(){
            var that = this;
            that.initHeader(function(){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            });
        },
        startEndTime:function (){
            //startTime endTime 如果直接传空，后台返回空数据
            var that = this; 
            var startTime=$('#starttime').val(),
                endTime=$('#endtime').val();
            
            if(startTime && endTime)
            {
                that.mappingData={
                    startUpdateTime: startTime,
                    endUpdateTime: endTime,
                    userName: $('#searchVal').val(), 
                    pageNum : that.newPageNum,
                    pageSize :10
                };
            }
            else if(startTime && !endTime)
            {
                that.mappingData={
                    startUpdateTime: startTime,
                    userName: $('#searchVal').val(), 
                    pageNum : that.newPageNum,
                    pageSize :10
                };
            }
            else if(!startTime && endTime)
            {
                that.mappingData={
                    endTime: endTime,
                    userName: $('#searchVal').val(), 
                    pageNum : that.newPageNum,
                    pageSize :10
                };
            }
            else
            {
                that.mappingData={
                    userName: $('#searchVal').val(), 
                    pageNum : that.newPageNum,
                    pageSize :10
                };
            }
        },
        initEvent: function(){
            var that = this; 
            that.mappingList(that.mappingData);
            $('#search').on('click', function(){
                that.newPageNum=1;
                that.startEndTime();
                that.mappingList(that.mappingData);
            });
            $('#starttime,#endtime').datetimepicker({
                language: 'zh-CN',
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                format: 'yyyymmdd',
                pickerPosition: "bottom-left",
                endDate: new Date()
            }).on('changeDate', function(e) {
                if(e.target.id === 'starttime'){
                    var Time = new Date($('#endtime').val());
                    if (e.date > Time){
                        A.alert('开始时间不能大于结束日期');
                        e.target.value = Time;
                        e.data = Time;
                    }
                }else{
                    var Time = new Date($('#starttime').val()); 
                    if (e.date < Time){
                        A.alert('开始时间不能大于结束日期');
                        e.target.value = Time;
                        e.data = Time;
                    }
                }
            });
            that.table = A.widget.bTable({
                container: '#recordList',
                tableClass: 'table-condensed table-hover table-bordered',
                multi: true,
                collumns:[
                {
                        title: '用户id',
                        field: 'userId',
                        class: 'userId',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.userId;
                        }
                    },{
                        title: '用户名',
                        field: 'userName',
                        class: 'userName',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            return value.userName;
                        }
                    },
                    {
                        title: '行为',
                        field: 'action',
                        class: 'action',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            var otype=value.action;
                            return otype;
                        }
                    },
                    {
                        title: '操作时间',
                        field: 'updateTime',
                        class: 'updateTime',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            var otype=value.updateTime;
                            var otime=that.getTime(otype);
                            return otime;
                        }
                    },
                    {
                        title: '参数',
                        field: 'param',
                        class: 'param',
                        editor: {
                            type: 'text'
                        },
                        formatter: function(rowValue, value , index){
                            var otype=value.param;
                            return otype;
                        }
                    }
                    // {
                    //     title: '操作',
                    //     field: 'roles',
                    //     class: 'roles',
                    //     updateWhenEdit: true,
                    //     formatter: function(rowValue, value, index, isEditting){
                    //             return'<button data-value="0" class="customeraction btn btn-primary">修改</button>\
                    //                   &nbsp;&nbsp;&nbsp;\
                    //                   <button data-value="1" class="customeraction btn btn-primary">复制</button>\
                    //                   &nbsp;&nbsp;&nbsp;\
                    //                   <button data-value="2" class="customeraction btn btn-danger">删除</button>';
                    //     },
                    //     onClick: function(rowValue, rowIndex, target){
                    //         var value = target.data('value'),
                    //             _this = this,
                    //             id = rowValue.id;
                    //         if(value == '0') //修改
                    //         {
                    //             location.href='saveMapping.html?mode=update&id='+id;
                    //             return false;
                    //         }
                    //         if(value == '1'){//复制
                    //             location.href='saveMapping.html?mode=copy&id='+id;
                    //             return false;
                    //         }
                    //         else if(value == '2'){//删除
                    //             A.widget.dialog.show({
                    //                 title: '提示',
                    //                 modalType: '',
                    //                 modalDialog: 'modal-sm',
                    //                 message: '您确定要删除吗？',
                    //                 buttons:[
                    //                     {text: '取消', class: 'btn btn-default', value: 1, dismiss: 'modal'},
                    //                     {text: '确定', class: 'btn btn-danger', value: 0, dismiss: 'modal'}],
                    //                 onClick:function(value, e){
                    //                     if(value == 0){
                    //                         if(id){
                    //                             that.delTemplate(rowIndex, id);
                    //                         }else{
                    //                             _this.delRow(rowIndex);
                    //                         }
                    //                     }
                    //                 }
                    //             });
                    //             return false;
                    //         }
                    //     }
                    // }
                    ]   
            });
        },
        //获取mapping列表
        mappingList: function(mappingData){
            var that = this;
            that.actionRecord.listRecord(mappingData).success(function (res){
                var returnObj=res.returnObj.list;
                var listData=[];
                for(var i=0;i<returnObj.length;i++)
                {
                    listData.push({'id':returnObj[i].id, 'userId':returnObj[i].userId, 'userName':returnObj[i].userName, 
                        'action':returnObj[i].action, 'updateTime':returnObj[i].updateTime, 'param':returnObj[i].param});
                }
                if(returnObj.length === 0) {
                    $('#pagination-container-tips').removeClass('hide');
                }else
                {
                    $('#pagination-container-tips').addClass('hide');
                }
                that.table.loadData(listData);
                if(!that.pagination){
                    A.widget.pagination({
                        container: '#pagination-container',
                        containerClass:'order-pagination',
                        size: 5,
                        pageNumber: that.newPageNum,
                        pageSize:10,
                        total: res.returnObj.total,
                        onPageChange: function(oldPaage, newPage){
                            that.newPageNum=newPage;
                            // that.mappingData={ 
                            //     pageNum : that.newPageNum || 1, 
                            //     pageSize:10
                            // };
                            that.startEndTime();
                            that.mappingList(that.mappingData);
                        }
                    });
                }else{
                    that.pagination.refresh({
                        pageNumber : res.pageNum,
                        total : res.total
                    })
                }
            }).notLogin(function (res){
                A.login.show(function(user){
                    that.onLogin(user);
                });
            }).fail(function (res){
                A.alert(res.rtnMsg);
            });                   
        },
        getTime: function (n){
            var that = this;
            var odata=new Date(n);
            var oyear=odata.getFullYear();
            var omonth=that.toTen(parseInt(odata.getMonth())+1);
            var odate=that.toTen(odata.getDate());
            var rt=oyear+'-'+omonth+'-'+odate;
            return rt;
        },
        toTen: function (n){
            var that = this;
            if(n<10)
            {
                return '0'+n;
            }
            else
            {
                return n;
            }
        }
    });

    $(function () {
        var page = new CT();
        page.onReady();
    });

})(my);
