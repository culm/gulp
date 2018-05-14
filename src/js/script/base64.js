function Base64() {
      
    // private property   
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";   
      
    // public method for encoding   
    this.encode = function (input) {   
        var output = "";   
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;   
        var i = 0;   
        input = _utf8_encode(input);   
        while (i < input.length) {   
            chr1 = input.charCodeAt(i++);   
            chr2 = input.charCodeAt(i++);   
            chr3 = input.charCodeAt(i++);   
            enc1 = chr1 >> 2;   
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);   
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);   
            enc4 = chr3 & 63;   
            if (isNaN(chr2)) {   
                enc3 = enc4 = 64;   
            } else if (isNaN(chr3)) {   
                enc4 = 64;   
            }   
            output = output +   
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +   
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);   
        }   
        return output;   
    }   
      
    // public method for decoding   
    this.decode = function (input) {   
        var output = "";   
        var chr1, chr2, chr3;   
        var enc1, enc2, enc3, enc4;   
        var i = 0;   
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");   
        while (i < input.length) {   
            enc1 = _keyStr.indexOf(input.charAt(i++));   
            enc2 = _keyStr.indexOf(input.charAt(i++));   
            enc3 = _keyStr.indexOf(input.charAt(i++));   
            enc4 = _keyStr.indexOf(input.charAt(i++));   
            chr1 = (enc1 << 2) | (enc2 >> 4);   
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);   
            chr3 = ((enc3 & 3) << 6) | enc4;   
            output = output + String.fromCharCode(chr1);   
            if (enc3 != 64) {   
                output = output + String.fromCharCode(chr2);   
            }   
            if (enc4 != 64) {   
                output = output + String.fromCharCode(chr3);   
            }   
        }   
        output = _utf8_decode(output);   
        return output;   
    }   
      
    // private method for UTF-8 encoding   
    _utf8_encode = function (string) {   
        string = string.replace(/\r\n/g,"\n");   
        var utftext = "";   
        for (var n = 0; n < string.length; n++) {   
            var c = string.charCodeAt(n);   
            if (c < 128) {   
                utftext += String.fromCharCode(c);   
            } else if((c > 127) && (c < 2048)) {   
                utftext += String.fromCharCode((c >> 6) | 192);   
                utftext += String.fromCharCode((c & 63) | 128);   
            } else {   
                utftext += String.fromCharCode((c >> 12) | 224);   
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);   
                utftext += String.fromCharCode((c & 63) | 128);   
            }   
      
        }   
        return utftext;   
    }   
      
    // private method for UTF-8 decoding   
    _utf8_decode = function (utftext) {   
        var string = "";   
        var i = 0;   
        var c = c1 = c2 = 0;   
        while ( i < utftext.length ) {   
            c = utftext.charCodeAt(i);   
            if (c < 128) {   
                string += String.fromCharCode(c);   
                i++;   
            } else if((c > 191) && (c < 224)) {   
                c2 = utftext.charCodeAt(i+1);   
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));   
                i += 2;   
            } else {   
                c2 = utftext.charCodeAt(i+1);   
                c3 = utftext.charCodeAt(i+2);   
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));   
                i += 3;   
            }   
        }   
        return string;   
    }   
}

/*
  //使用：
  //encode:
  var str="{'username':'invoiceNumddddd','enterpriseId':'10002','SN':'000001','IDCardNum':'310107198302092123','CredentialsType':'C','name':'','address':'%E4%B8%8A%E6%B5%B7%E5%B8%82%E5%88%9B%E6%96%B0%E8%A5%BF%E8%B7%AF300%E5%BC%8431%E5%8F%B7301%E5%AE%A4','phone':'15644565656','ReimbursementType':'%E5%85%AC%E7%94%A8','invoiceNum':'3','invoiceNumSum':'1000','AccountBank':'%E4%BA%A4%E9%80%9A%E9%93%B6%E8%A1%8C','AccountBankNum':'6225896709809034','InsurancePolicyId':'GYA061EL5000769','time':'1457339084366'}";
  var b = new Base64();   
  var strencode = b.encode(str); 
  console.log("base64 encode:" + strencode);

  //decode:
  var str='eyd1c2VybmFtZSc6JzE4MDQ5Nzc0Njc3JywnZW50ZXJwcmlzZUlkJzonMTAwMDInLCdTTic6JzAwMDAwMScsJ0lEQ2FyZE51bSc6JzMxMDEwNzE5ODMwMjA5MjEyMycsJ0NyZWRlbnRpYWxzVHlwZSc6J0MnLCduYW1lJzonJywnYWRkcmVzcyc6JyVFNCVCOCU4QSVFNiVCNSVCNyVFNSVCOCU4MiVFNSU4OCU5QiVFNiU5NiVCMCVFOCVBNSVCRiVFOCVCNyVBRjMwMCVFNSVCQyU4NDMxJUU1JThGJUI3MzAxJUU1JUFFJUE0JywncGhvbmUnOicxODA0OTc3NDY3NycsJ1JlaW1idXJzZW1lbnRUeXBlJzonJUU1JTg1JUFDJUU3JTk0JUE4JywnaW52b2ljZU51bSc6JzMnLCdpbnZvaWNlTnVtU3VtJzonMTAwMCcsJ0FjY291bnRCYW5rJzonJUU0JUJBJUE0JUU5JTgwJTlBJUU5JTkzJUI2JUU4JUExJThDJywnQWNjb3VudEJhbmtOdW0nOic2MjI1ODk2NzA5ODA5MDM0JywnSW5zdXJhbmNlUG9saWN5SWQnOidHWUEwNjFFTDUwMDA3NjknLCd0aW1lJzonMTQ1NzMzOTA4NDM2Nid9';
  strdecode = b.decode(str); 
  console.log("base64 decode:" + strdecode);

  //求值md5 token
  var str='invoiceNumddddd3101071983020921231457339084366';
  var hash = hex_md5(str);
  console.log(hash);
*/