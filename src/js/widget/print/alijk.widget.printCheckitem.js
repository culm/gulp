(function(A) {
    var html='\
        <div class="checkitem">\
            <h2 id="Hospital_Name">{{Hospital_Name}}检查申请单</h2>\
            <br/>\
            <div class="c_personinfo"> \
                    <ul style="margin:10px 0px 0px 0px">\
                        <li style="width: 90px;" class="SystemfontSet">姓名</li>\
                        <li style="width: 40px;" class="SystemfontSet">性别</li >\
                        <li style="width: 40px;" class="SystemfontSet">年龄</li >\
                        <li style="width: 70px;" class="SystemfontSet">病人编号</li >\
                        <li style="width: 150px;" class="SystemfontSet">开具时间</li >\
                        <li style="width: 150px;" class="SystemfontSet">科别</li >\
                    </ul> <br />\
                    <ul style="margin:2px 1px -3px 0px;">\
                        <li style="width: 90px;" class="UserfontSet"><span  id="Full_name">{{Full_name}}</span></li>\
                        <li style="width: 40px;" class="UserfontSet"><span  id="_Sex">{{_Sex}}</span></li >\
                        <li style="width: 40px;" class="UserfontSet"><span  id="_Age">{{_Age}}</span></li >\
                        <li style="width: 70px;" class="UserfontSet"><span  id="patient_id">{{patient_id}}</span></li >\
                        <li style="width: 150px;" class="UserfontSet"><span  id="date_time">{{date_time}}</span></li >\
                        <li style="width: 150px;" class="UserfontSet"><span  id="Divisions">{{Divisions}}</span></li >\
                    </ul>\
            </div>\
            <br/>\
            <table class="table" border="1" height="270">\
                <tr>\
                    <td width="120">项目</td>\
                    <td >内容</td>\
                </tr>\
                <tr>\
                    <td>诊断</td>\
                    <td ><table id="checkitem_print_Diagnosis" ></table></td>\
                </tr>\
                <tr>\
                    <td>病史和体征</td>\
                    <td ><table id="checkitme_print_Disease_History"></table></td>\
                </tr>\
                <tr>\
                    <td>申请项目</td>\
                    <td ><span>{{checkitemName}}</span></td>\
                </tr>\
                <tr>\
                    <td>检查部位</td>\
                    <td><table></table></td>\
                </tr>\
                <tr>\
                    <td>检查目的</td>\
                    <td ><span>{{purpose}}</span></td>\
                </tr>\
                <tr>\
                    <td>备注</td>\
                    <td><span></span></td>\
                </tr> \
            </table>\
            <p style="text-align: left;margin-left:19px ;">其他需要备注信息：</p>\
            <table class="footer">\
                <tr>\
                    <td>是否妊娠：\
                        <span>{{cyophoriaName}}</span>\
                    </td>\
                </tr>\
                <tr>\
                    <td>是否体内装有金属物品：\
                        <span>{{metalName}}</span>\
                    </td>\
                </tr>\
            </table>\
        </div>';
    A.widget.checkitem = function(data){
        var doc = document,
            templateid = 'print_checkItem'
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
        // if(data._Prescription){
        //     $('#record_print_Prescription').html(chufangHtml(data._Prescription));
        // }
        // if(data._Treatment){
        //     $('#record_print_Treatment').html(zhiliaoHtml(data._Treatment));
        // }
        if(data._Diagnosis){
            $('#checkitem_print_Diagnosis').html(zhenduan(data._Diagnosis))
        }
        getDiseaseHistory(data.Disease_History);

        var cyophoria = data["cyophoria"];
        var metal = data["metal"];
        if(cyophoria == "yes"){
            cyophoria = "是";
        }else{
            cyophoria = "否";
        }
        if(metal == "yes"){
            metal = "是";
        }else{
            metal = "否";
        } 
        data.cyophoriaName = cyophoria;
        data.metalName = metal;

        try{
            return template(templateid, data);
        }
        catch(ex){
            var s = 0;
        }finally{
            document.body.removeChild(ele);
        }
    }
    function getDiseaseHistory(diseaseHistory){
        var Disease_History = $("#checkitme_print_Disease_History");
        Disease_History.empty();
        var Disease_History_html="";
        for(var i =0;i< diseaseHistory.length ;i++){
            var jsonObj = diseaseHistory[i]; //获取json对象
            if(jsonObj.modifier=="Rule Out"){
                Disease_History_html +="<tr align='center'><td>"+jsonObj.name+"</td><td>现病史</td></tr>";
            }else{
                //Disease_History_html +="<tr align='left'><td>"+jsonObj.name+"</td><td>既往史</td></tr>";
            }
        }
        Disease_History.append(Disease_History_html);
    }
    function zhenduan(_Diagnosis){
        var _Diagnosis_html="";
        for(var i =0;i< _Diagnosis.length ;i++){
            var jsonObj = _Diagnosis[i]; //获取json对象
            if (jsonObj.conceptName != undefined) {
                _Diagnosis_html +="<tr align='left'><td style='text-align: left;'>"+jsonObj.conceptName+"</td>";  
            }
            
            if(jsonObj.comments!=undefined){
                _Diagnosis_html +="<td>&nbsp;&nbsp;"+jsonObj.comments +"&nbsp;</td>";
            }
            
            _Diagnosis_html +="</tr>";
        }
        return _Diagnosis_html;
    }
    
})(alijk);