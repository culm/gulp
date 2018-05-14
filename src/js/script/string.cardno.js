/// <summary>
/// 将日期字符串转换为日期对象
/// </summary>
/// <param name="format">日期格式,例如:yyyy-MM-dd HH:mm:ss</param>
/// <return>日期对象</return>
String.prototype.isCardNo = function () {
    var idcard = this;
    if (idcard == "") return false;
    var area = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外"
            };
            var Y, JYM,S, M,
                idcard_array = new Array();
            idcard_array = idcard.split("");
            // 地区检验
            if (area[parseInt(idcard.substr(0, 2), 10)] == null) {
                return false;
            }
            // 身份号码位数及格式检验
            switch (idcard.length) {
                case 15:
                    if ((parseInt(idcard.substr(6, 2)) + 1900, 10) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900, 10) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900, 10) % 4 == 0)) {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
                    }
                    else {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
                    }
                    if (ereg.test(idcard)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    break;
                case 18:
                    // 18位身份号码检测
                    // 出生日期的合法性检查
                    // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                    // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                    if (parseInt(idcard.substr(6, 4), 10) % 4 == 0 || (parseInt(idcard.substr(6, 4), 10) % 100 == 0 && parseInt(idcard.substr(6, 4), 10) % 4 == 0)) {
                        ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// 闰年出生日期的合法性正则表达式
                    }
                    else {
                        ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// 平年出生日期的合法性正则表达式
                    }
                    if (ereg.test(idcard)) {// 测试出生日期的合法性
                        // 计算校验位
                        S = (parseInt(idcard_array[0], 10) + parseInt(idcard_array[10], 10)) * 7 +
                        (parseInt(idcard_array[1], 10) + parseInt(idcard_array[11], 10)) * 9 +
                        (parseInt(idcard_array[2], 10) + parseInt(idcard_array[12], 10)) * 10 +
                        (parseInt(idcard_array[3], 10) + parseInt(idcard_array[13], 10)) * 5 +
                        (parseInt(idcard_array[4], 10) + parseInt(idcard_array[14], 10)) * 8 +
                        (parseInt(idcard_array[5], 10) + parseInt(idcard_array[15], 10)) * 4 +
                        (parseInt(idcard_array[6], 10) + parseInt(idcard_array[16], 10)) * 2 +
                        parseInt(idcard_array[7], 10) * 1 +
                        parseInt(idcard_array[8], 10) * 6 +
                        parseInt(idcard_array[9], 10) * 3;
                        Y = S % 11;
                        M = "F";
                        JYM = "10X98765432";
                        M = JYM.substr(Y, 1);// 判断校验位
                        if (M == idcard_array[17]) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                    break;
                default:
                    return false;
                    break;
            }
}
//根据身份证赋值生日
String.prototype.getBirthdate= function (){
    var idCard = this;
    if(!idCard.isCardNo()) return '';
    idCard = idCard.replace(/ /g, "").trim();//对身份证号码做处理。包括字符间有空格。   
    var len = idCard.length;
    if (len == 15) {
        return ('19' + idCard.substr(6, 6)).toDate('yyyyMMdd');
    } else {
        return idCard.substr(6, 8).toDate('yyyyMMdd');
    }
}
//根据身份证赋值年龄
String.prototype.getAge= function (){
    var idCard = this;
    if(!idCard.isCardNo()) return '';
    idCard = idCard.replace(/ /g, "").trim();//对身份证号码做处理。包括字符间有空格。   
    var len = idCard.length;
       var oAge=idCard.substr(6, 4);
       var oDate=new Date();
       var year=oDate.getFullYear();
       oAge=year-oAge;
        return oAge;
}
//检验年龄是否合法
String.prototype.checkAge= function (){
    var idAge = this;
    var reg=/^[0-9]*$/g;
    idAge = idAge.replace(/ /g, "").trim();   
    var len = idAge.length;
    if (!reg.test(idAge)) {
        return false;
    }
    else if(len >= 4){
        return false;
    } else {
        return true;
    }
}
//检验是否为数字
String.prototype.checkDigital= function (){
    var idAge = this;
    var reg=/^[0-9]*$/g;
    idAge = idAge.replace(/ /g, "").trim();   
    var len = idAge.length;
    if (!reg.test(idAge)) {
        return false;
    }
    else {
        return true;
    }
}
//邮箱验证
String.prototype.checkEmail= function (){
    var idAge = this;
    var myReg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;//i.test(email)
    if(myReg.test(idAge)) return true; 
        return false; 
}
//验证手机号
String.prototype.checkMobilePhone= function (){
    var phone=this;
    //正则：验证电话号码手机号码，包含至今所有号段
    //var reg = /^[1][358]\d{9}$/;                        //正则1
    //var ab=/^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/;//正则2
    var reg = /^(1)[\d]{10}$/;                    //正则3
    //var reg = /^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/;  //正则4
    if (phone.match(reg) == null) {
        return false;
    }
    else {
        return true;
    }
}
