(function(A) {
    var html='\
        <div class="inspection">\
            <div class="print_test_con1 clearfix">\
                <div class="print_test_con1_fl fl">\
                    <div class="cont1_fl_1">\
                        <span class="large_title">检验申请单</span>\
                        <span class="small_title">{{tenantName}}</span>\
                    </div>\
                    <div class="cont1_fl_2 clearfix">\
                        <div class="pers_info"><p>姓名</p><span>{{name}}</span></div>\
                        <div class="pers_info"><p>年龄</p><span>{{age}}</span></div>\
                        <div class="pers_info"><p>性别</p><span>{{gender}}</span></div>\
                        <div class="pers_info"><p>送检科室</p><span>{{department}}</span></div>\
                    </div>\
                    <div class="cont1_fl_3">\
                        <div class="record_pers">\
                            <span>就诊号</span>\
                            <p>{{visitorId}}</p>\
                        </div>\
                        <div class="record_pers prescription_hashealthcard">\
                            <span>阿里健康卡号</span>\
                            <p>{{HealthCardNumber}}</p>\
                        </div>\
                        <div class="record_pers">\
                            <span>检验申请号</span>\
                            <p>{{encounterId}}</p>\
                        </div>\
                    </div>\
                </div>\
                <div class="print_test_con1_fr fr clearfix" style="margin-right: 15px;">\
                    <div class="print_test_con1_fr_rc alijk_record prescription_hashealthcard">\
                        <span>阿里健康卡号</span>\
                        <div class="card_div" id="alijk_healthcard_inspection"></div>\
                        <div style="display:none" id="print_inspection_healthcard_hide"></div>\
                    </div>\
                    <div class="print_test_con1_fr_rc test_record">\
                        <span>检验申请号</span>\
                        <div class="card_div" barcode="{{encounterId}}" id="print_inspection_encounterId"></div>\
                        <div style="display:none" id="print_inspection_encounterId_hide"></div>\
                    </div>\
                </div>\
            </div>\
            <div class="print_test_con2 clearfix">\
                <div class="print_test_con2_fr fl zhengduan" style="margin-top: 10px;">\
                    <h3 style="padding-left: 10px;">临床诊断</h3>\
                    <p>\
                        {{each Casediagnosed}}\
                            <span style="display:block;" class="Casediagnosed">{{$value.conceptName}}</span>\
                        {{/each}}\
                    </p>\
                </div>\
                <div class="print_test_con2_fl fr">\
                    <div class="clearfix con2_has_title has_back">\
                        <div class="fl first">检验项目</div>\
                        <div class="fr last">标本类别</div>\
                    </div>\
                    {{each _inspection}}\
                        <div class="clearfix con2_has_cont">\
                            <div class="fl first">{{$value.name}}</div>\
                            <div class="fr last">{{$value.sampleTypeName}}</div>\
                        </div>\
                    {{/each}}\
                    <div class="con2_has_cont_absolute">\
                        <div class="left">医嘱时间<span>{{date}}</span></div>\
                        <div class="right">送检医生及签字<span>{{doctor_name}}</span></div>\
                    </div>\
                </div>\
            </div>\
            <div class="print_test_con3 clearfix">\
                <div class="fl print_test_con3_fl">检验机构<span>{{inspection_agency}}</span></div>\
                <div class="fr print_test_con3_fr">采血机构<span>{{tenantName}}</span></div>\
            </div>\
        </div>';
    A.widget.inspection = function(data){
        var doc = document,
            templateid = 'print_inpection'
            ele = doc.getElementById(templateid);
        if(!ele){
            ele = doc.createElement('div');
            ele.style.display = 'none';
            ele.innerHTML = html;
            ele.id = templateid;
            doc.body.appendChild(ele);
        }else{
            ele.innerHTML = html;
        }
        data.date = new Date().toString('yyyy-MM-dd HH:mm');
        // data.HealthCardNumber = '11111111';
        //阿里健康卡号的二维码
        if(data.HealthCardNumber){
            // data.imgBarcode = $.fn.qrcode.getImgBarcode(data.HealthCardNumber);
            var tempbarcode = $('#print_inspection_healthcard_hide')
            tempbarcode.attr('barcode', data.HealthCardNumber);
            tempbarcode.html('');
            tempbarcode.qrcode();
            $('#alijk_healthcard_inspection').html('<img src="' + tempbarcode.find('canvas')[0].toDataURL() + '"/>');
        }else{
            $('.prescription_hashealthcard').hide();
        }
        //encouterid的二维码
        var tempbarcode = $('#print_inspection_encounterId_hide')
        tempbarcode.attr('barcode', data.encounterId);
        tempbarcode.html('');
        tempbarcode.qrcode();
        $('#print_inspection_encounterId').html('<img src="' + tempbarcode.find('canvas')[0].toDataURL() + '"/>');
        
        try{
            return template(templateid, data);
        }
        catch(ex){
            var s = 0;
        }finally{
            document.body.removeChild(ele);
        }
    }
})(alijk);