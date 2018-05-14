(function(A) {
    var html='\
        <div class="treament">\
            <h2 id="Hospital_Name">{{Hospital_Name}}治疗单</h2>\
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
                        <li style="width: 150px;" class="UserfontSet"><span>{{department}}</span></li >\
                    </ul>\
            </div>\
            <br/>\
            <table class="table" border="1">\
                <tr>\
                    <td width="100px">项目</td>\
                    <td>内容</td>\
                </tr>\
                <tr>\
                    <td>申请项目</td>\
                    <td height="90">\
                        <table id="print_treament_table">\
                        </table>\
                    </td>\
                </tr>\
                <tr>\
                    <td>备注</td>\
                    <td>{{_comments}}</td>\
                </tr>\
            </table>\
            <table class="footer">\
                <tr>\
                    <td>操作者：<span>{{Operating}}</span></td>\
                    <td>申请医师：<span>{{_Doctor}}</span></td>\
                </tr>\
            </table>\
        </div>';
    A.widget.treament = function(data){
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
        if(data.treatment){
            $('#print_treament_table').html(zhiliaoHtml(data.treatment));
        }
        // if(data._Diagnosis){
        //     $('#checkitem_print_Diagnosis').html(zhenduan(data._Diagnosis))
        // }
        // getDiseaseHistory(data.Disease_History);

        try{
            return template(templateid, data);
        }
        catch(ex){
            var s = 0;
        }finally{
            document.body.removeChild(ele);
        }
    }
     //治疗html
    function zhiliaoHtml(treatment){
        var table_html="";
      for(var i =0;i< treatment.length ;i++){
        var jsonObj = treatment[i]; //获取json对象
        var name =jsonObj.name.length==0?SPACE:jsonObj.name;
        var unit =(!jsonObj.Unit)?"":jsonObj.Unit;
        var frequency =(!jsonObj.Frequency)?"":jsonObj.Frequency;
        var remark =(!jsonObj.Remark)?"":jsonObj.Remark;
        table_html +="<tr align='left'><td style='text-align:left;padding-left: 20px;'>"+name+"&nbsp;&nbsp;&nbsp;&nbsp;"+frequency+"&nbsp;&nbsp;&nbsp;&nbsp;"+unit+"&nbsp;&nbsp;&nbsp;&nbsp;"+remark+"</td></tr>";
      }
        return table_html;
    }

})(alijk);