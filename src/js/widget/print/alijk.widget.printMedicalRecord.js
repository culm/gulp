(function(A) {
    var html='\
        <div class="medicalrecord">\
            <h2 id="Hospital_Name">{{Hospital_Name}}门诊病历单</h2>\
            <div class="c_personinfo"> \
                <ul style="margin:10px 0px 0px -50px">\
                    <li style="width: 90px;" class="SystemfontSet">姓名</li>\
                    <li style="width: 40px;" class="SystemfontSet">性别</li >\
                    <li style="width: 40px;" class="SystemfontSet">年龄</li >\
                    <li style="width: 70px;" class="SystemfontSet">病人编号</li >\
                    <li style="width:150px;" class="SystemfontSet">开具时间</li >\
                    <li style="width: 150px;" class="SystemfontSet">科别</li >\
                </ul> <br />\
                <ul style="margin:10px 1px -3px -50px;">\
                    <li style="width: 90px;" class="UserfontSet"><span></span>{{name}}</li>\
                    <li style="width: 40px;" class="UserfontSet"><span>{{gender}}</span></li >\
                    <li style="width: 40px;" class="UserfontSet"><span>{{age}}</span></li >\
                    <li style="width: 70px;" class="UserfontSet"><span>{{personId}}</span></li >\
                    <li style="width:150px;" class="UserfontSet"><span>{{date_time}}</span></li >\
                    <li style="width: 150px;" class="UserfontSet"><span>{{department}}</span></li >\
                </ul>\
            </div>\
            <br/>\
            &nbsp;\
            <table style="BORDER-COLLAPSE: collapse; margin-left: 70px;" height="320">\
                <tr>\
                    <td class="left">&nbsp;&nbsp;主诉：</td>\
                    <td width="570">{{Chief_Complaint}}</td>\
                </tr>\
                <tr>\
                    <td class="left">&nbsp;现病史：</td>\
                    <td>{{Disease_Now}}</td>\
                </tr> \
                <tr>\
                    <td class="left">&nbsp;既往史：</td>\
                    <td>{{Disease_History}}</td>\
                </tr> \
                <tr>\
                    <td class="left">诊疗意见:</td>\
                    <td>{{Disease_Comments}}</td>\
                </tr> \
                <tr>\
                <td class="left">&nbsp;&nbsp;体征：</td>\
                <td>\
                    <table id="reocord_print_Physical"></table>\
                </td>\
                </tr>\
                <tr>\
                    <td class="left">&nbsp;&nbsp;检查：</td>\
                    <td >\
                        <table id="record_print_CheckItem"></table>\
                    </td>\
                </tr> \
                <tr>\
                    <td class="left">&nbsp;&nbsp;处方：</td>\
                    <td>\
                         <table id="record_print_Prescription"></table>\
                    </td>\
                </tr>\
                <tr>\
                    <td class="left">&nbsp;&nbsp;治疗：</td>\
                    <td>\
                        <table id="record_print_Treatment"></table>\
                    </td>\
                </tr>\
                <tr>\
                    <td class="left">&nbsp;&nbsp;诊断：</td>\
                    <td>\
                        <table id="record_print_Diagnosis"></table>\
                    </td>\
                </tr>\
            </table>\
            <br />\
            <br />\
            <div class="footer">\
                时间：<span></span>&nbsp;&nbsp;&nbsp;</span>医生：<span id="_Doctor"></span>\
            </div>\
        </div>';
    A.widget.medicalrecord = function(data){
        data.date_time = new Date().toString('yyyy-MM-dd HH:mm');
        var doc = document,
            templateid = 'print_medicalRecord'
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
        if(data.Physical){//体格特征
            $('#reocord_print_Physical').html(tiGeJianCha(data.Physical));
        }
        if(data.CheckItem){
            $('#record_print_CheckItem').html(checkItemHTML(data.CheckItem));
        }
        if(data._Prescription){
            $('#record_print_Prescription').html(chufangHtml(data._Prescription));
        }
        if(data._Treatment){
            $('#record_print_Treatment').html(zhiliaoHtml(data._Treatment));
        }
        if(data._Diagnosis){
            $('#record_print_Diagnosis').html(zhenduan(data._Diagnosis))
        }
        try{
            return template(templateid, data);
        }
        catch(ex){
            var s = 0;
        }finally{
            document.body.removeChild(ele);
        }
    }
    function zhenduan(_Diagnosis){
        var _Diagnosis_html="";
        for(var i =0;i< _Diagnosis.length ;i++){
            var jsonObj = _Diagnosis[i]; //获取json对象
            if (jsonObj.conceptName != undefined) {
                _Diagnosis_html +="<tr align='left'><td>"+jsonObj.conceptName+"</td>";  
            }
            
            if(jsonObj.comments!=undefined){
                _Diagnosis_html +="<td>&nbsp;&nbsp;"+jsonObj.comments +"&nbsp;</td>";
            }
            
            _Diagnosis_html +="</tr>";
        }
        return _Diagnosis_html;
    }
    //治疗html
    function zhiliaoHtml(_Treatment){
        var _Treatment_html="";
        for(var i =0;i< _Treatment.length ;i++){
            var jsonObj = _Treatment[i]; //获取json对象
            _Treatment_html +="<tr align='left'><td>"+jsonObj.name +"</td><";
            if(jsonObj.pkg_spec!=undefined){
                _Treatment_html +="<td>"+jsonObj.pkg_spec +"</td>";
            }
            if(jsonObj.frequency!=undefined){
                _Treatment_html +="<td>"+jsonObj.frequency +"</td>";
            }
            if(jsonObj.note !=undefined){
                _Treatment_html +="<td>"+jsonObj.note +"</td>";
            }
            _Treatment_html +="/tr>";
        }
        return _Treatment_html;
    }
    //处方html
    function chufangHtml(_Prescription){
        var _Prescription_html="";
        for(var i =0;i< _Prescription.length ;i++){
            var jsonObj = _Prescription[i]; //获取json对象
            _Prescription_html +="<tr align='left'>";
            if(jsonObj.prescription_type=="中药饮片处方"){
                _Prescription_html +="<td>"+jsonObj.prescription_type+"</td>";
                if(jsonObj.TCM_prescription_days!=undefined){
                    _Prescription_html +="<td>"+jsonObj.TCM_prescription_days+"</td>";
                }
                if(jsonObj.total_price!=undefined){
//              _Prescription_html +="<td>"+jsonObj.total_price+"</td>";
                    _Prescription_html +="<td>"+ "" +"</td>";
                }
                _Prescription_html +="<td><table><tr align='left'>";
                var drugs =jsonObj.drugs;
                for(var j in drugs){
                    _Prescription_html +="<td>"+drugs[j].Drug_Name+"</td>";
                }
                _Prescription_html +="</tr></table></td>";
            }else{
                _Prescription_html +="<td>"+jsonObj.prescription_type+"</td>";
                if(jsonObj.total_price!=undefined){
//              _Prescription_html +="<td>"+jsonObj.total_price+"</td>";
                    _Prescription_html +="<td>"+""+"</td>";
                }
                _Prescription_html +="<td><table><tr align='left'>";
                var drugs =jsonObj.drugs;
                for(var j in drugs){
                    _Prescription_html +="<td>"+drugs[j].Drug_Name+"</td>";
                }
                _Prescription_html +="</tr></table></td>";
            }
            _Prescription_html +="</tr>";
        }
        return _Prescription_html;
    }
    //检查的html
    function checkItemHTML(_CheckItem){
        var CheckItem_html = '';
        for(var i =0;i< _CheckItem.length ;i++){
            var jsonObj = _CheckItem[i]; //获取json对象
            CheckItem_html +="<tr align='left'><td>"+jsonObj.name +"</td>";
            if(jsonObj.startdate!=undefined){
                CheckItem_html+="<td>"+jsonObj.startdate +"</td>";
            }
            if(jsonObj.comments!=undefined){
                CheckItem_html+="<td>"+jsonObj.comments+"</td>"
            }
            CheckItem_html+="</tr>"
        }
        return CheckItem_html;
    }
    //体格检查的html
    function tiGeJianCha(physical){
        //Physical.html("");
        var Physical_HTML="<tr>";
        
        if (physical.t == 0 ) {
            Physical_HTML+=("<td></td>");
    //      Physical_HTML+=("<td>体温:"+""+"℃</td>");
        } else {
            Physical_HTML+=("<td>体温:"+physical.t+"℃&nbsp;&nbsp;</td>"); 
        }   
        
        if (physical.p == 0) {
            Physical_HTML+=("<td></td>");
    //      Physical_HTML+=("<td>脉搏:"+""+"次/分</td>");   
        } else {
            Physical_HTML+=("<td>脉搏:"+physical.p+"次/分&nbsp;&nbsp;</td>");
        }
        
        if (physical.r == 0) {
            Physical_HTML+=("<td></td>");
    //      Physical_HTML+=("<td>呼吸频率:"+ "" +"次/分</td>");
        } else {
            Physical_HTML+=("<td>呼吸频率:"+physical.r+"次/分&nbsp;&nbsp;</td>"); 
        }

        if (physical.bph == 0) {
            Physical_HTML+=("<td></td>");       
        } else {
            Physical_HTML+=("<td>血压:"+physical.bph+"/"+physical.bpl+"mmHg&nbsp;&nbsp;</td>");
        }
        
        Physical_HTML+="</tr>";
        return Physical_HTML;
    }
})(alijk);