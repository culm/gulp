(function(A) {

	var fileupload = A.widget.fileupload = function(options){
		var that = this;
		var op = {
			containerClass: 'fileupload-container',
			container: '#fileupload-container',
			accept: 'image/*',
			title: '',
			/**
			* 上传控件是否可用
			*/
			enabled: true,
			/**
			* 上传成功回调
			*/
			onUploadSuccess: null,
			/**
			* 上传失败回调
			*/
			onUploadError: null,
			/**
			* 初始化
			*/
			onInit: null,
			/**
			* 显示图片时的回调
			*/
			onShowFile: null,
			/**
			* 删除图片
			*/
			onRemove: null
		};
		A.extend(op, options);
		that.options = op;
		that.container = op.container;
		that.init();
	},
	SUCCESS = 'success', FAIL = 'fail', UPLOADING = 'uploading';
	A.extend(fileupload.prototype, A.widget, {
		/**
		* 存储上传文件的ajax
		*/
		filesAjax: {},
		/**
		* 上传文件的状态，key：文件名字+文件大小，value：'success'(上传成功), 'fail', 'uploading'
		*/
		filesStatus: {},
		uplaodComplete: false,
		initData: function(){
			var that = this;
			that.filesAjax = {};
			that.filesStatus = {};
			that.uplaodComplete = false;
			$(that.options.container + ' .btn-pic-item').remove();
		},
		init: function(){
			var that = this,
				op = that.options,
				container = op.container,
				fileid = op.container + '-uploadfile';
			that.filesStatus = {};
			that.filesAjax = {};
			$('\
				<div class="btn-pic-add fileupload-add">\
					<label title="' + op.title + '" class="uploadfile-label ' + (op.enabled ? '':'disabled') + '" for="' + fileid + '"></label>\
					<input ' + (op.enabled ? '':'disabled') + ' multiple="multiple" accept="' + op.accept + '" type="file" id="' + fileid + '" style="display:none" />\
				</div>').appendTo(container);
			$(container).addClass(op.containerClass);
			if(op.onInit) op.onInit.call(that);
            A.on(that, 'change', $(container+' input[type=file]')[0]);
            A.on(that, 'click', $(container)[0]);
		},
		disable: function(){
			this._setStatus(false);
		},
		enable: function(){
			this._setStatus(true);
		},
		_setStatus: function(status){
			var that = this,
				op = that.options;
			if(status){
				$(op.container + ' .uploadfile-label').removeClass('disabled');
				$(op.container + ' input[type=file]').removeAttr('disabled');
			}else{
				$(op.container + ' .uploadfile-label').addClass('disabled');
				$(op.container + ' input[type=file]').attr('disabled','disabled');
			}
		},
		handleEvent: function(e){
			var that = this,
				t = e.target,
				type = e.type,
				op = that.options;
			if(type == 'click'){
				if(t.className == 'glyphicon glyphicon-remove'){//移除添加的图片
					var key = t.getAttribute('data-key');
					delete that.filesStatus[key];
					that.filesAjax[key].abort();
					if(op.onRemove) op.onRemove.call(that, t);
	                $(t.parentNode).remove();
				}
			}else if(type == 'progress'){
				that._onProgerss(e);
			}else if(type == 'change'){
				A.each(t.files, function(index, file){
					var name = file.name,
						key = that._getkey(file),
						status = that.filesStatus[key];
					if(status == UPLOADING){
						A.alert('文件'+ name + '已在上传队列中');
						return;
					}
					if(status == SUCCESS){
						A.alert('文件'+ name + '已上传');
						return;
					}
					if(file.type){
						that.showFile(file);
						that.uploadFile(file);
					}
				});
				t.value = '';
			}
		},
		showFile: function(file){
			var that = this,
				name = file.name,
				key = that._getkey(file),
				op = that.options,
				_showFile = function(dataKey, src){
					if(op.onShowFile && op.onShowFile.call(that, dataKey, src) === false) {
						return;
					}
					$('<div class="btn-pic-item">\
	                	<div data-key="' + dataKey + '" class="glyphicon glyphicon-remove"></div>\
	                		<img src="' + src + '" />\
	                		<div class="progress progress-striped"">\
							   	<div class="progress-bar progress-bar-success progress' + dataKey.replace(/\./g, '_') + '" role="progressbar" \
							      aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"\
							      style="width: 0;">\
							      	<span class="sr-only"></span>\
							   	</div>\
							</div>\
						</div>').insertBefore(op.container + ' .fileupload-add');	
					// if(!op.avatar){
						
					// }else{
					// 	var img = $(op.container).find('img')
					// 	img[0].src = src;
					// }
					
				};
			if(file.type == 'image/tiff'){//tif图片无法以base64格式显示
				_showFile(key, 'img/widget/fileupload/filetype-tif.png');
			}else{
				var reader = new FileReader();
				reader.onloadend = function(e){
	            	//在页面上显示该文件
	                _showFile(key, this.result);
	            }
	            reader.readAsDataURL(file);
			}
		},
		uploadFile: function(file){
			var that = this,
				formData = new FormData(),
				key = that._getkey(file);
			//缓存要下载的图片
			that.filesStatus[key] = UPLOADING;
            //上传文件
			formData.append("file", file);
	        that.filesAjax[key] = A.ajax({
	        	url:that.options.path,
	        	contentType: file.type,
	        	dataType: 'json',
	        	type:'post',
	        	setHeader: false,
	        	data: formData,
	        	processData: false,
	        	xhr: function(){
	        		var xhr = new window.XMLHttpRequest(),
		    			upload = xhr.upload;
		    		upload.file = file;
		    		A.on(that, 'progress', upload);
    				return xhr;
	        	},
	        	success: function(ret, status, xhr){
	        		var file = xhr.upload.file,
						key = that._getkey(file),
						container = that.container;
					$(container + ' .' + key.replace(/\./g, '_')).css('width','100%');
					that.filesStatus[key] = SUCCESS;
	        		var onUploadSuccess = that.options.onUploadSuccess;
	        		if(onUploadSuccess) onUploadSuccess.call(that, ret, file);
	        	},
	        	error: function(xhr, type, error){
	        		if(type == 'abort') return;
	        		var file = xhr.upload.file,
						key = that._getkey(file),
						bar = $(that.options.container + ' .' + key.replace(/\./g, '_'));
					bar.css('width','0%');
					bar.removeClass('progress-bar-success').addClass('progress-bar-danger');
					that.filesStatus[key] = FAIL;

					$(that.options.container + ' div[data-key="' + key + '"]').next().prop('src', 'img/widget/fileupload/upload-fail.png');

	        		var onUploadError = that.options.onUploadError;
	        		if(onUploadError) onUploadError.call(that, file);
	        	}
	        });
		},
		/**
		* 上传是否完成
		*/
		hasFinished: function(){
			var that = this,
				hasFail = false,
				hasUpload = false;
			A.each(that.filesStatus, function(key, value){
				if(value == UPLOADING) hasUpload = true;
				else if(value == FAIL) hasFail = true;
			});
			if(hasFail){
				A.alert('存在文件上传失败，请移除后重新上传');
				return false;
			}
			if(hasUpload){
				A.alert('文件上传中，请稍后重试');
				return false;
			}
			return true;
		},
		_onProgerss: function(e){
			if(e.lengthComputable){
				var file = e.target.file,
					key = this._getkey(file),
					that = this;
				var progress = Math.ceil((e.loaded / e.total) * 100);
				$(that.options.container + ' .progress' + key).css('width',progress+'%');
			}else{
				// A.alert('无法计算进度信息总大小');
			}
		},
		_getkey: function(file){
			var key = file.name + '_' + file.size;
			return key.encode().replace(/(\%|\.)/g, '_');
		}
	});

})(my);