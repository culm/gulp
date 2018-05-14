;(function(A){
    var CT = function(){};
    A.extend(CT, A.weixin, {
        localIds: [],
        serverId: [],
        existIds:{},
        hospitalId: 0,
        onReady: function () {
            var that = this;
            var params = A.getParams();
            that.weixinService.config(params.appid, params.ticket, ['chooseImage','previewImage','uploadImage','downloadImage']);
            that.loading.show('数据加载中...');
            wx.ready(function(){
                that.loading.hide();
            });
            that.initEvent();
        },
        initEvent: function(){
            var that = this;
            var autoComplete = new A.widget.AutoComplete('#hospitalname', {
                getTitleHtml:function(type){
                    return '<span class="title">输入医院名字</span>';
                },
                PageCount:10,
                ShowNavigate: 1,
                pageIndex:0,
                // SearchSource:0,//0:从网站搜索,1:从百度地图去数据
                GetUrl: function(){ return that.ServerPath + "searchTenantList"; },
                dataType: 'JSON',
                ajaxType: 'get',
                customerJsonData: function(res){
                    return {Data: res.tenantList||[], total: Math.ceil(res.total/10)};
                },
                getRequestData: function(){
                    var data = {
                        "tenantName" : this.target.val(),
                        "pageNum" : parseInt(this.Options.pageIndex,10) + 1,
                        "pageSize" : 10
                    };
                    return {params: A.toJSON(data)};
                },
                OnRender:function(item, type) {
                    var name = item.name;
                    return '<a class="text-overflow" title="' + name + '" targetid="' + item.id + '">' + name + '</a>';
                },
                OnSelect:function(item) {
                    if (item != null) {
                        this.GetTarget().val(item.name);
                        that.hospitalId = item.id;
                    }
                },
                OnBeforeHide: function(selected, defaultItem){
                    if(!selected){
                        this.Options.OnSelect.call(this,defaultItem);
                    }
                },
                SearchedTitle:function(){
                    return "搜索：" + this.GetTarget().val();
                },
                ShowDefault:function(){ return false;},
                GetDefaultValue: function(){return '医院名字';}
            });
        },
        removeImg:function(src){
            var that = this;
            try{
                delete that.existIds[src];
                // that.localIds.remove(src);
                var index = that.localIds.indexOf(src);
                if (index > -1) {
                    that.localIds.splice(index, 1);
                }
            }catch(e){
                alert(e)
            }
        },
        _checkImg: function(){
            var that = this;
            A.each(that.localIds, function(index, src){
                var myimg = document.querySelector('[mysrc="' + src + '"]');
                if(!myimg) return;
                var img = new Image();
                img.onload = function(){
                    myimg.src = this.src;
                }
                img.src = src;
            });
        },
        chooseImage: function(){
            var that = this;
            if(that.tenantId == ''){
                that.showModal('tenantActive')
                return
            }
            that.weixinService.chooseImage().then(function(res){
                var existIds = that.existIds;
                //过滤重复的图片
                A.each(res.localIds, function(index, src){
                    if(existIds[src]) return;
                    existIds[src] = true;
                    that.localIds.push(src);
                });
                // that.$apply(that.localIds);
                setTimeout(function(){
                    that._checkImg();
                }, 10);
            }, function(res){
                //选择图片微信产生错误
            });
        },
        uploadImage: function(){
            var that = this;
            if(!that.hospitalId){
                that.msg('请选择医院');
                return;  
            }
            if(that.localIds.length == 0){
                that.chooseImage();
                return; 
            }else{
                that.loading.show('数据上传中...');
                that.weixinService.uploadImage(that.localIds).then(function(serverimgs){
                    //上传到微信服务器成功的回调
                    that.uploadService.upload(serverimgs, that.hospitalId).then(function(res){
                        that.localIds=[];
                        that.hospitalId = '';
                        that.existIds = {};
                        $('#hospitalname').val('');
                        //上传成功
                        that.loading.show({
                            message:'上传成功',
                            complete:1,
                            time:2000
                        });
                        // that.$apply(that.localIds);
                    }, function(res){
                        that.loading.hide();
                        // alert(res.xhr.responseText);
                        // alert('type:' + res.xhr.type);
                        // alert('error:' + res.xhr.error);
                        that.msg('上传失败:' + res.rtnMsg + '(' + res.rtnCode+ ')');
                    });
                }, function(res){
                    //上传微信服务器失败的回调
                    that.loading.hide();
                    // alert(res.xhr.responseText);
                    // alert('type:' + res.xhr.type);
                    // alert('error:' + res.xhr.error);
                    that.msg('上传失败，请重新上传');   
                }, function(uploadedNum, total){
                    //上传进度回调
                    
                })
            }
        },
        tenantInput: function(){
            var $ = angular.element,
                that = this;
            $(document.getElementById('tenant')).on('input',function(){
                var data = {
                    val: $(this).val(),
                    pageIndex:1
                }
                that.uploadService.searchList(data).then(function(res){
                    that.localIds=[];
                    console.log(res);
                }, function(res){
                    that.msg(res.rtnMsg);
                });
            })
        }
    });
    A.getApp().controller("uploadController", ['$scope', '$http', 'uploadService', 'weixinService', function($scope, $http, uploadService, weixinService) {
        $scope.weixinService = weixinService;
        $scope.uploadService = uploadService;
        $scope.http = $http;
        A.extend($scope,CT)
        $scope.onReady();
    }]);

})(my);