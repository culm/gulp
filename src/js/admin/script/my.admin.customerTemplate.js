;
(function(A) {
    A.customerTemplate = {
        /**
         * 显示mapping模板
         */
        showMapping: function(data){
            var that = this;
            A.widget.loading.hide();
            data.imgPath = that.ServerPath + 'upload/download?fileName=';

            if(data.diagnoise&&data.diagnoise.match(',')){
                var arr = data.diagnoise.split(',');
                A.each(arr,function(index, el) {
                    if(index==0) data.diagnoise = arr[index]
                    else data['diagnoise'+(index+1)] = arr[index]
                })
            }
            var diagnoseName = data.inHospitalDiagnoseCh
            var diagnoseCode = data.inHospitalDiagnose
            if(diagnoseName&&diagnoseName.match('|')||diagnoseCode&&diagnoseCode.match('|')){
                var name = diagnoseName ? diagnoseName.split('|') : [];
                var code = diagnoseCode ? diagnoseCode.split('|') : [];
                A.each(name,function(index, el) {
                    if(index==0) {
                        data.inHospitalDiagnoseCh = name[index]
                        data.inHospitalDiagnose = code[index]
                    }else {
                        data['inHospitalDiagnoseCh'+(index+1)] = name[index]
                        data['inHospitalDiagnose'+(index+1)] = code[index]
                    }
                });
            }
            var detailLength = data.detailList ? data.detailList.length : 0;
            that.detailIndex = detailLength == 0 ? 0 : data.detailList.length;
            A.each(data.detailList,function(index, el) {
                if(el.moneyAmount == -1) el.moneyAmount = '?';
            });
            that._processProperty(data);
            that.showMappingTemplate(that.res.tenantId, that.province, that.dataType);
            // 处理处方模板
            that.tabDetail({
                container: '#detail-table',
                data: data,
                templateId: 'tabDetail_template_detail'
            });
            // 处理处方模板
            that.tabDetail({
                container: '#detail-keyBox',
                data: data,
                templateId: 'tabDetail_template_invoice'
            });
            // 处理input事件
            that.inputField();
        },
        showMappingTemplate:function(tanentId, city, type){
            var that = this;
            if(this.paramsId&&this.typeBool) {
                tanentId = '99999'
                city = 1000;
                type = 200;
            }
            // 平安统一改成其他地区
            if(that.isPingan) city = '0000'
            var that = this,
                invoice = $('#tabDetail_template_invoice'),
                detail = $('#tabDetail_template_detail'),
                invoiceMapping = A.mapping.data[tanentId][city][type].invoiceMapping,
                invoiceDetailMapping = A.mapping.data[tanentId][city][type].invoiceDetailMapping,
                mappingStr = [],
                mappingHead = [],
                mappingBody = ['<div class="detail-tr"><input data-type="text" data-index="{{a}}" type="hidden" name="itemId" value="{{list.itemId}}" />'];

            A.each(invoiceMapping,function(key, val) {
                mappingStr.push('<div class="inputEdit"><span>'+val+'：</span><span><input class="form-control" data-type="text" data-img="{{'+key+'ImgPath}}" data-original="{{'+key+'OriginalPath}}" type="text" name="'+key+'" id="'+key+'" value="{{'+key+'}}"/></span></div>');                    
            });
            invoice.append(mappingStr);

            if(invoiceDetailMapping){
                A.each(invoiceDetailMapping,function(key, val) {                    
                    mappingHead.push('<div class="t_head">'+val+'</div>');
                    mappingBody.push('<div class="t_td"><input class="form-control" data-type="text" type="text" name="'+key+'" value="{{list.'+key+'}}" data-img="{{list.'+key+'ImgPath}}" data-original="{{list.'+key+'OriginalPath}}" data-index="{{a}}"/></div>');
                });
                mappingBody.push('<span class="glyphicon glyphicon-remove remove" style="position:absolute;top:12px;right:-2px;color:#f00"></span></div>');
                detail.append('<div class="detail-thead">'+mappingHead.join('')+'</div><div class="detail-tbody">{{each detailList as list a}}'+mappingBody.join('')+'{{/each}}</div>');
                //计算每个项目的宽度
                var t_head = detail.find('.t_head'),
                    t_td = detail.find('.t_td'),
                    width = (100/t_head.length)+'%';
                t_head.each(function(index, el) {  
                    el.style.width = width;
                });
                t_td.each(function(index, el) {  
                    el.style.width = width;
                });
                // 缓存详情数据格式
                that.mappingList = mappingBody.join('');
            }
           
        },   
        /**
         * 给输入框绑定事件
         **/
        inputField: function() {
            var that = this,
                elements = $('.main-Tpl [data-type]');
            A.each(elements,function(index, el) {
                var _this = $(el);
                // var name = el.name;
                // 循环配置文件，删除或修改部分input
                // var names = A.mapping.nameField[1000][that.dataType]
                // A.each(names,function(key, value) {
                //     var keyName =  _this.parent().next();
                //     var inputBox = _this.closest('inputEdit');
                //     if(name==key){
                //         if(value===false) {
                //             inputBox.remove();
                //         }else{
                //             keyName.html(key+"：");
                //         }
                //     }
                // });

                // 绑定focus事件
                if(_this){
                    _this.off('focus').on('focus',function(ev){
                        that.enterKey(ev.target);
                    }).on('blur',function(ev){
                        $('#itooltip-container').hide(); 
                        that.inputBlur(ev.target);                       
                    })
                }
            });
        },
        /**
         * 获取所有提交数据
         */
        getMappingData: function(){
            var that = this,
                // 单独处理时间格式
                dateSubstr = function (v){
                    if(v && v.match('-')) return v;
                    else if(v.length==8) return v.substr(0, 4)+'-'+v.substr(4, 2)+'-'+v.substr(6, 2);
                    else return '';
                },
                data = {
                    id: that.dataInfo.id,
                    personId: that.dataInfo.personId,
                    paymentNo: that.dataInfo.paymentNo,
                    imageName: that.dataInfo.imageName,
                    hospitalId: that.dataInfo.hospitalId,
                    tenantId: that.res.tenantId,
                    type: that.dataType,
                    detailList:[]
                },
                newArr = [];
                if(that.isPingan){
                    data.hospitalCode = that.hospitalCode;
                    data.hospitalName = that.hospitalName;
                }
            A.each($('.main-Tpl [data-type]'), function(i, dom) {
                var name = dom.name,
                    value = dom.value,
                    index = dom.getAttribute('data-index'),
                    imgPath = dom.getAttribute('data-original');
                if(name.match('Date')) value = dateSubstr(value);
                if(name == 'belongsType'){
                    value = dom.getAttribute('data-id');
                }
                if (index) {
                    if (!data.detailList[index]) data.detailList[index] = {};
                    name = name.replace(index, '');
                    data.detailList[index][name] = value;
                    data.detailList[index][name+'Path'] = imgPath;
                    if(name == 'moneyAmount'&&(value.indexOf('?')>-1||value.indexOf('？')>-1)){
                        data.detailList[index][name] = -1;
                    }
                } else {
                    data[name] = value;
                    data[name+'Path'] = imgPath;
                }
                
                if(name.match('diagnoise')){
                    if(name=="diagnoise"||value=="") return;
                    data.diagnoise += ','+value
                }
                if(name.match('inHospitalDiagnoseCh')){
                    if(name=='inHospitalDiagnoseCh'||value=="") return;
                    data.inHospitalDiagnoseCh += '|'+value;
                }
                if(name.match('inHospitalDiagnose')){
                    if(name.match('inHospitalDiagnoseCh')) return;
                    if(name=='inHospitalDiagnose'||value=="") return;
                    data.inHospitalDiagnose += '|'+value;
                }
            });
            A.each(data.detailList,function(index, el) {
                if(el != null) newArr.push(el)
            });
            data.detailList = newArr;
            
            return data;
        },
        /**
         * template模板函数
         **/
        tabDetail: function(options){
            var that = this;
            $(options.container).html(template(options.templateId, options.data));
        },
        _processProperty: function(obj){
            var that = this;
            var rateFlag = 'Confidence';
            var imgFlag = 'ImgPath';
            var OriginalPath = 'OriginalPath';
            var customerFlag = 'HejinOnline';
            A.each(obj, function(key, value){
                if(value === 'null'||value === null||value === 'undefined'||value === undefined) {
                    obj[key] = '';
                    return;
                };
                var type = typeof value;
                if(type === 'object' && typeof value.length == 'number'){
                    type = 'array';
                }
                if(key.indexOf(imgFlag) > 0 || key.indexOf(OriginalPath) > 0){
                    var path = value
                    if(!value.match(that.ServerPath)){
                        path = that.ServerPath + 'upload/downloadNamePhoto?fileName=' + value;
                    }
                    obj[key] = path;
                    return;
                }
                if(type === 'function') return;
                //数字特殊处理
                if(type === 'array'){
                    A.each(value, function(index, _value){
                        var _type = typeof _value;
                        if(_value === null || _type === 'function') return;
                        if(_type === 'object') {
                            that._processProperty(_value);
                        }else{
                            return;
                        }
                    });
                }else if(type === 'object'){
                    that._processProperty(value);
                }else{
                    // obj[key + customerFlag] = that._getCustomerData(value.toString(), obj[key + rateFlag],key,obj);
                    // if(typeof obj[key + rateFlag] !== 'undefined') obj[key+'Rate'] = 'true'
                }
            });
        },
        _getCustomerData: function(value, rate, k,obj){
            var that = this;
            if(value === 'null') obj[k] = '';
            if(typeof rate === 'undefined' || value === '' || rate === null) return '';
            var values = [];
            var ratelen = rate.length;
            A.each(value, function(index, key){
                var flag = '1';
                if(ratelen > index){
                    flag = rate.charAt(index);
                }
                if(flag === '0') {
                    values.push('<a class="recognition-warning">' + key + '</a>');
                }
                else values.push(key);
            });
            
            return values.join('');
        }
    }
})(my);
