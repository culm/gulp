;(function(A){
    var CT = function(){};
    A.extend(CT.prototype, A.service, {
        ServerPath:A.getServer(), 
        /**
         * 获取OSS参数
         */
        getOssKey: function(data){
            var that = this,
            d = A.defer();
            A.ajax({
                url: that.ServerPath + 'taibao/getOssKey',
                type: 'get',
                data: data,
                success:function(res){
                    if(res.rtnCode != '2000'){
                        d.reject(res);
                    }else{
                        d.resolve({
                            multipart_params:{
                                OSSAccessKeyId: "LTAIMpiKKHHcHiEl",
                                key: "@@ossDirName@@/${filename}",
                                policy: "eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
                                signature: "WabdmDzuLP73103PUow4drzBwak=",
                                success_action_status: "200"
                            },
                            host: 'http://@@ossBucket@@.oss-cn-beijing.aliyuncs.com/',
                            dirName: '@@ossDirName@@/'
                        });
                    }
                },
                error:function(xhr, type, error) {
                    d.resolve({
                        multipart_params:{
                            OSSAccessKeyId: "LTAIMpiKKHHcHiEl",
                            key: "@@ossDirName@@/${filename}",
                            policy: "eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
                            signature: "WabdmDzuLP73103PUow4drzBwak=",
                            success_action_status: "200"
                        },
                        host: 'http://@@ossBucket@@.oss-cn-beijing.aliyuncs.com/',
                        dirName: '@@ossDirName@@/' 
                    });
                }
            })
            return d.promise;
        },
        dataURItoBlob: function(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            dataURI = dataURI.replace(/\n/g,'');
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {
                type: mimeString
            });
        },
        /**
         * 上传图片到OSS
         */
        uploadOSS: function(data){ 
            var that = this,d = A.defer();;
            var formData = new FormData();
            var blob = that.dataURItoBlob(data.base64File);
            my.each(data.multipart_params,function(key, val) {
                formData.append(key,val)
            }); 
            formData.append("file", blob, data.fileName);
            A.ajax({
                url: data.host,
                processData: false,     // 必须
                contentType: false,     // 必须
                type: 'POST',
                data: formData,
                success:function(res,status){
                    if(status != 'success'){
                        d.reject(res);
                    }else{
                        d.resolve(res);
                    }
                },
                error:function(xhr, type, error) {
                    d.reject(xhr);
                }
            })
            return d.promise;
        },
        /**
         * 上传图片到OSS
         */
        uploadTaibao: function(data){
            var that = this;
            var formData = new FormData();
            var blob = that.dataURItoBlob(data.base64File);
             
            formData.append("avatar", blob, data.fileName);

            d = A.defer();
            A.ajax({
                url: "@@taibaojiankangUri@@/jkglapp/claimServer/uploadImageByOCR.do",
                // url: "http://182.150.61.49/jkglapp/claimServer/uploadImageByOCR.do",
                processData: false,     // 必须
                contentType: false,     // 必须
                type: 'POST',
                data: formData,
                success:function(res,status){
                    if(status != 'success'){
                        d.reject(res);
                    }else{
                        d.resolve(res);
                    }
                },
                error:function(xhr, type, error) {
                    d.reject(xhr);
                }
            })
            return d.promise;
        },
        uploadComplete: function(data){
            var that = this,
            d = A.defer();
            A.ajax({
                url: that.ServerPath + 'taibao/uploadComplete',
                type: 'post',
                data: {params:A.toJSON(data)},
                success:function(res){
                    if(res.rtnCode != '2000'){
                        d.reject(res);
                    }else{
                        d.resolve(res);
                    }
                },
                error:function(xhr, type, error) {
                    d.reject(xhr);
                }
            })
            return d.promise;
        },
        /**
         * deleteImageByOCR
         */
        deleteImageByOCR: function(data){
            var that = this,
                d = A.defer();
            A.ajax({
                url: "@@taibaojiankangUri@@/jkglapp/claimServer/removeImageByOCR.do",
                type: 'POST',
                data: data,
                success:function(res,status){
                    if(status != 'success'){
                        d.reject(res);
                    }else{
                        d.resolve(res);
                    }
                },
                error:function(xhr, type, error) {
                    d.reject(xhr);
                }
            })
            return d.promise;
        }    
    });
    A.service.upfileList=new CT();
})(my)