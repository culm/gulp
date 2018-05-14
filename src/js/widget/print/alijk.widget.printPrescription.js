(function(A) {
    var html = '\
        <div class="prescription">\
            <div class="head" style="margin-top:20px; position:relative;">\
                <div style="{{display}}" id="print_Barcode" class="c_Barcode">6954171236883339</div>\
                <a id="print_report_hostpitalname" class="Hospital_Name">{{Hospital_Name}}</a>\
                <li style="{{display}}"  class="c_PrescriptionId"><span style="font-size: 8px; font-family: \'微软雅黑\';  opacity: 0.5;">处方号</span>&nbsp;<span style="font-size:17px;font-weight:bold;color:black;">{{encounter_id}}</span></li>\
                <li style="{{display}}"  class="c_Order_form_no" ><span style="font-size: 8px; font-family: \'微软雅黑\';  opacity: 0.5;">订单号</span>&nbsp;<span id="print_Order_form_no" style="font-size:17px;font-weight:bold; color:black;" hidden="hidden">6954171236883339</span></li>\
                <div class="c_personinfo" > \
                        <ul style="margin:10px 0px 0px 0px">\
                            <li style="width: 90px;" class="SystemfontSet">姓名</li>\
                            <li style="width: 40px;" class="SystemfontSet">性别</li >\
                            <li style="width: 40px;" class="SystemfontSet">年龄</li >\
                            <li style="width: 50px; {{display}}" class="SystemfontSet">付费<li >\
                            <li style="width: 150px;" class="SystemfontSet">科别</li >\
                        </ul> <br />\
                        <ul style="margin:2px 1px 0px 0px;clear:both">\
                            <li style="width: 90px;" class="UserfontSet"><span>{{name}}</span></li>\
                            <li style="width: 40px;" class="UserfontSet"><span>{{gender}}</span></li >\
                            <li style="width: 40px;" class="UserfontSet"><span>{{age}}</span></li >\
                            <li style="width: 50px;{{display}}" class="UserfontSet"><span>{{expense}}</span><li >\
                            <li style="width: 150px;" class="UserfontSet"><span>{{department}}</span></li >\
                        </ul>\
                </div>\
            <img src="/physician/static/print/img/black.png" style="float: none; repeat-x:100px; width: 760px; height: 2px;padding-left:10px;padding-top: 10px;"/>\
            </div>\
            <div class="c_Prescription_Medicine_Box"> \
                <div class="c_Prescription_Medicine_Box_left">\
                    <p class="c_Prescription_Medicine_Box_left_Content">\
                        {{each disease_table}}\
                            <span style="display:block;margin-bottom:4px;">{{$value.conceptName}}</span>\
                        {{/each}}\
                        <p class="SystemfontSet prescription_hashealthcard" style="margin-left: 5px;">阿里健康号</p>\
                        <p style="font-size:11px;margin-left: 5px;" class="prescription_hashealthcard">{{HealthCardNumber}}</p>\
                        <div id="alijk_healthcard_prescription">\
                        </div>\
                        <div style="display:none" id="test_prescription_hide_health_barcode"></div>\
                    </p>\
                </div>\
                <div class="c_Prescription_Medicine_Box_right">\
                    <div style="height: 390px;">\
                        <img src="/physician/static/print/img/rx.png" style="width:20px;height:20px;margin:20px 0 0 20px; padding:0px;{{display}}" />\
                        <table style="width:580px;margin:0px 10px 10px 15px; " id="prescription_drug_table">\
                        </table>\
                    </div>\
                    <div class="c_Prescription_Medicine_Box_right_list_foot">\
                            <div id="pirint_TCM_decoction_flag" style="margin-left:80px;display:inline-block;float:left">\
                                <span class="UserfontSet">{{Days}}副</span>\
                                <span class="UserfontSet">{{TCM_decoction_flag}}</span>\
                                <span class="UserfontSet">{{TCM_type}}</span>\
                            </div>\
                            <div style="float: right;margin-right: 50px;display:inline-block;">\
                                <span>医师</span>\
                                <span class="UserfontSet">{{_Doctor}}</span>\
                                <span>时间</span>\
                                <span class="UserfontSet">{{date_time}}</span>\
                            </div>\
                    </div>\
                </div>\
            </div>\
            <img src="/physician/static/print/img/black.png" style="float: none; repeat-x:100px; width: 760px; height: 2px;padding-left:10px;"/>\
            <div class="c_personinfo" style="{{display}}">\
                    <ul style="margin-top:10px">\
                        <li style="width: 230px; text-align: left;" class="SystemfontSet">药费&nbsp;\
                            <span id="Prescription_Drugs_Money" style="font-weight:bold; color: #000000;   " class="UserfontSet">&nbsp;</span>&nbsp;</li>\
                        <li style="width: 230px;text-align: left;" class="SystemfontSet">审核/调配&nbsp;<span span style="font-weight:bold; color: #000000;"  class="UserfontSet">{{Audit_Debug}}</span></li>\
                        <li style="width: 230px;text-align: left;" class="SystemfontSet">核对/发药&nbsp;<span style="font-weight:bold; color: #000000;"  class="UserfontSet">{{Check_debug}}</span></li> \
                    </ul> \
            </div> \
        </div>';
    A.widget.prescription = function(data){
        data.date_time = new Date().toString('yyyy-MM-dd HH:mm');
        var doc = document,
            templateid = 'print_presescription' + new Date().getTime();
            ele = doc.createElement('div');
        // ele = doc.createElement('div');
        ele.style.display = 'none';
        ele.innerHTML = html;
        ele.id = templateid;
        doc.body.appendChild(ele);
        // data.HealthCardNumber = '111111';
        if(data.HealthCardNumber){
            // data.imgBarcode = $.fn.qrcode.getImgBarcode(data.HealthCardNumber);
            var tempbarcode = $('#test_prescription_hide_health_barcode')
            tempbarcode.attr('barcode', data.HealthCardNumber);
            tempbarcode.html('');
            tempbarcode.qrcode();
            $('#alijk_healthcard_prescription').html('<img src="' + tempbarcode.find('canvas')[0].toDataURL() + '"/>');
        }else{
            $('.prescription_hashealthcard').hide();
        }
        if(data.NotPrintPrice == '1'){//不打印价格

        }else{
            $('#Prescription_Drugs_Money').html("￥"+ (data.total_price || 0) +"元");
        }
        if(data.prescriptionType == 'videoReport'){//远程写报告打印
            $('#print_report_hostpitalname').css('margin-left', '330px');
            data.display = 'display:none;'
           	var strArry = data.comment.split("\n");
           	var trHtml = "";
			$.each(strArry, function(index,item) {    
				trHtml+="<tr><td style='padding-top:8px;'>"+item+"</td></tr>";	                                                    
			});				
            $('#prescription_drug_table').html('');
            //$('#prescription_drug_table').html('<tr><td>' + data.comment + '</td></tr>');
            $('#prescription_drug_table').html(trHtml);
            $('#pirint_TCM_decoction_flag').hide();
        }else{
            if(data.prescriptionType != '58365'){
                $('#pirint_TCM_decoction_flag').hide();
              $("#prescription_drug_table").html(getDrugHtml(data.drugs));
            }else{
                $("#prescription_drug_table").html(getDrugTCMHtml(data.drugs));
            }
        }

        $('#print_Barcode').barcode({code:'I25'});
        try{
            if(!data.encounter_id) data.encounter_id = '   ';
            return template(templateid, data);
        }
        catch(ex){
            var s = 0;
        }finally{
            document.body.removeChild(ele);
        }
    }
    function getDrugTCMHtml(drugs){
        var drugs_html="";
        drugs_html +="<tr>";
        
        for(var i =1; i < drugs.length + 1; i++){
            var jsonObj = drugs[ i - 1]; //获取json对象
            drugs_html +="<td>";
            
            drugs_html += jsonObj.Drug_Name;
            drugs_html +=  "&nbsp";
            drugs_html +=  jsonObj.Quantity || '1';
            drugs_html += jsonObj.Unit || '';
            
            if (jsonObj.TCM_op_type != undefined && 
                jsonObj.TCM_op_type != "无") {
                drugs_html += "<sup>(" + jsonObj.TCM_op_type + ")</sup>";
            }
            drugs_html +="</td>";
            
            if (i % 4 == 0) {
                drugs_html +="</tr>";
                drugs_html +="<tr>";            
            }
        }
        drugs_html +="</tr>";
        return drugs_html;
    }

    function getDrugHtml(drugs){
        //获取有配伍的药品的id集合 index               // //
        //newIndex : 配伍药品id集合                   // //
        var Index = getindex(drugs);            // //
                                                //处//
        //将药品拆分成两个集合                            //理//
        //newDrugs  : 所有配伍药品                    //配//
        //drugs     : 所有非配伍药品                   //伍//
        var newDrugs = InsertDrug(drugs,Index); //药//
        var drugs = ClearDrug(drugs,Index);     //品//
                                                //排//
        //拿到需要标记的配伍分组                       //序//
        var id = abcTest(newDrugs);             // //
        //将药品按顺序合并到一个集合                     // //
        //drugs:返回排好顺序的集合                   // //
        drugs=peiwuGO(newDrugs,drugs);          // //
//===================================================     
          //添加药品数据
          var space = "&nbsp;";
          var li_html="";
          for(var i =0;i< drugs.length ;i++){
            var jsonObj = drugs[i]; //获取json对象
            li_html +="<tr><th  style='text-align:left;font-size: 15px; font-family: '黑体';font-weight:bold'>"+jsonObj.Drug_Name+"</th>";
            li_html +=space+"<td class='SystemfontSet' align='left'>"+jsonObj.Specification+"</td>";
            li_html +=space+"<td class='SystemfontSet' align='left'>"+jsonObj.Quantity+"</td>";
            //备注加在第一行
            //li_html +=space+"<td  align='right'>"+jsonObj.Remark+"</td>"+space;
            li_html +=space+"<td class='SystemfontSet' align='left'>"+jsonObj.Usage+space+"</td>";
            li_html +=space+"<td class='SystemfontSet' align='left' >"+jsonObj.Frequency+"</td>";
            //一行
            //li_html +=space+"<td  align='center' >"+jsonObj.Usage+"："+jsonObj.Frequency+"</td>";
            li_html +=space+"<td class='SystemfontSet' align='left'>每次"+jsonObj.The_amount+"</td>";
            //备注加在第二行
            li_html +=space+"<td class='SystemfontSet' align='right'>"+((jsonObj.Remark+"")=="undefined"?"":jsonObj.Remark)+"</td>";
            for(var j = 0;j<id.length;j++){
                if(id[j]>=i){
                    li_html +=space+"<td class='SystemfontSet' align='right' >组合</td>";
                }
            }
            li_html +="</tr><p style='float: none; width:300px; height: 3px;background-color:#FFFFFF;'></p>";
            for(var k = 0;k<id.length;k++){
                if(id[k]==i){
                 li_html +="</tr><tr><th colspan='10'><img src='img/black.png' width='580px' height='1px'/></th></tr>";
                }
            }
          }
          return li_html; 
    }

    /**
     * 配伍分组返回要下划线的标记(int,int)
     * */
    function abcTest(wudrugs){
        var result= new Array(0);
        wudrugs=daoIndex(wudrugs);
        var index = new Array(0);
        for(var i =0; i<wudrugs.length; i++){
            for(var j=0;j<wudrugs.length; j++){
                if(wudrugs[i].Drug_Name==wudrugs[j].match_drug_order_id){
                    index.push(wudrugs[i]);
                }
            }
        }
        index=clearid(index);
        for(var i=0;i<index.length; i++){
            var id = new Array(0);
            for(var j=0;j<wudrugs.length; j++){
                if(index[i].Drug_Name==wudrugs[j].match_drug_order_id){
                    id.unshift(j);
                }
            }
            index.shift();
            result.push(id[0]);
        } 
        return result;
    }



    /**
     * 将配伍用药位置前移
     * */
    function peiwuGO(newDrugs,drugs){
        drugs =daoIndex(drugs)
        var result = new Array(0);
        for(var j = 0; j < drugs.length;j++){
            result.unshift(drugs[j]);
        }
        for(var i = 0; i < newDrugs.length;i++){
            result.unshift(newDrugs[i]);
        }
        
        return result;
    }
    /**
     * 将原有集合的drug中清除有配伍的drug
     * */
    function ClearDrug(drugs,newIndex){
        for(var i =0; i<newIndex.length; i++){
            drugs.splice(newIndex[i],1);
        }
        return drugs;
    }
    /**
     * 将有配伍的药品存放到一个新的集合
     * */
    function InsertDrug(drugs,newIndex){
        var newDrugs=new Array(0);
        //倒序
        var dao = daoIndex(newIndex);
        for(var i =0; i<newIndex.length; i++){
            newDrugs.push(drugs[newIndex[i]]);
        }
        return newDrugs;    
    }
    /**
     * 获取有配伍的药品的id集合 index
     * */
    function getindex(drugs){
        var index = new Array(0);
        for(var i = 0; i < drugs.length; i++){
            for(var j = 0;j < drugs.length; j++){
                if(drugs[i].Drug_Name==drugs[j].match_drug_order_id){
                    index.push(i,j);
                }
            }
        }
        return clearid(index)
    }
    /**
     * 清除药品id集合中冗余的药品id
     * */
    function clearid(index){
        var newIndex = new Array(0);        //目标数组
        for(var i=0;i<index.length;i++){
            var flag=true;
            var n=newIndex.length;
            for(var j=0;j<n;j++)
                if(newIndex[j] == index[i])
                    flag=false;
            if(flag)
                 newIndex[n]=index[i];
        }
        return newIndex;
    }

    /**
     * 倒序
     * */
    function daoIndex(DB){
       DB.sort(function(a,b){
        if(a>b) return -1;
        if(a==b)return 0;
        else    return 1;
       })    
    return DB;
    }

})(alijk);