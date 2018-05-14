(function(A) {
	$.fn.extend({

		/// <summary>
		/// 动态绑定执行对象事件方法
		/// 次方法与jQuery中bind方法的区别是事件方法是对象方法,简化调用.
		/// 解除绑定必须使用jQuery.UnBind
		/// </summary>
		/// <param name="e">事件名称,如click,mouseover</param>
		/// <param name="method">事件对象方法,如this.onClick</param>
		/// <param name="source">事件源,如当前对象this</param>
		/// <param name="args">事件参数</param>
		/// <return>事件对象,同jQuery中bind返回值</return>
		Bind: function(e, method, source, args) {
			return $(this).bind(e, args, $.proxy(method, source));
		},

		/// <summary>
		/// 动态解除通过jQuery.Bind绑定的对象事件方法
		/// </summary>
		/// <param name="e">事件名称,如click,mouseover</param>
		/// <param name="method">事件对象方法,如this.onClick</param>
		/// <param name="source">事件源,如当前对象this</param>
		/// <return>事件对象,同jQuery中unbind返回值</return>
		UnBind: function(e, method, source) {
			return $(this).unbind(e, $.proxy(method, source));
		}
	});
    var W = A.widget,
    	H = $,
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="selector">输入控件jQuery选择器</param>
        /// <param name="options">控件参数</param>
        auto = A.widget.AutoComplete = function(selector, options) {
            /// <summary>
            /// 配置选项
            /// </summary>
            this.Options= {
            	exClass: '',
            	canAjax: true,
				GetData:null,
				OnRender:null,
				OnSelectedItemChange:function(item){},
				OnSelect:null,
				OnBeforeShow:null,
				OnHide:function(){},
				PageCount:10,
				//是否显示导航栏，既是否显示分页导航, 1：显示,其他值表示不显示
				ShowNavigate:0,
				//0：表示数据源从网站后台获取，1：表示数据源从baidu地图获取
				SearchSource:0,
				//当前页面
				pageIndex:0,
				//默认数据源数组的个数
				DefaultDataLength: 0,

				dataType: 'JSON',
				ajaxType: 'get',

				DefaultClass:'defaultColor',
				panelWidth:230,
				getTitleHtml: function(type){
					return '<span class="title">输入名字或↑↓选择</span>';
				},
				getBottomHtml:function(allPage, currentPage, type){
                    return "<a class='bottom'>←→翻页,↑↓选择";
                },
                OnBeforeHide:function(currentSelectedItem, defaultItem){
                    var target = this.GetTarget();
                    if(currentSelectedItem == null){
                        target.attr('targetid', "");
                    }
                    target.removeAttr('initialId');
                    target.removeAttr('initialValue');
                },
                LoadingInfo:function(){return "数据加载中...";},
                SearchedTitle:function(){return "搜索：" + this.GetTarget().val();},
                TimeOutInfo:function(){
                    return "搜索<b>" + this.GetTarget().val() + "</b>超时，请稍候重试";
                },
                NoDataInfo: function(){ return '没有查询到:' + this.target.val();},
                ShowDefault:function(){ return false;}
            };
			/// <summary>
            /// 显示模式，0：显示默认数据，1：显示搜索数据
            /// </summary>
            this.showMode = 0;
            /// <summary>
            /// 控件实例
            /// </summary>
            this.instance = null;

            /// <summary>
            /// 控件id
            /// </summary>
            this.id = null

            /// <summary>
            /// 控件绑定的目标控件
            /// </summary>
            this.target = null;

            /// <summary>
            /// 当前选中页的值
            /// </summary>
            this.value = null;
			/// <summary>
            ///  当前数据源
            /// </summary>
			this.Data = null;
			
			/// <summary>
            ///  当前控件的旧值
            /// </summary>
			this.oldValue = "";
			/// <summary>
            ///  检查当前绑定控件值改变的时间间隔
            /// </summary>
			this.DefaultTimeOut = 100;
			/// <summary>
            ///  定时器
            /// </summary>
			this.IntervalTimer = null;

			this.Timer = null;

			this.currentGetJson = null;

            //设置默认值
            A.extend(this.Options, options);
            this.canAjax = this.Options.canAjax;
            // this.containerClass = this.Options.containerClass;
            this.exClass = this.Options.exClass;
            this.init(selector);
        }

    //内部短名称, 注意
    // var T = H.DateTime,
    //     S = H.String,
    //     DP = H.Widget.AutoComplete;

    //继承Holsun.Widget
    A.extend(auto.prototype, W, {
        /// <summary>
        /// 标记样式
        /// </summary>
        exClass: '',

        /// <summary>
        /// 日期控件容器样式
        /// </summary>
        containerClass: 'AutoCompleteContainer',

        /// <summary>
        /// 日期控件容器样式
        /// </summary>
        /// <param name="selector">输入控件jQuery选择器</param>
        init: function (selector) {
        	if(typeof selector == 'object'){//
        		var _id = selector.prop('id') || '_auto_' + new Date().getTime();
        		selector.prop('id', _id);
        		selector = _id;
        	}
            this.id = selector.replace(/([:\[\]\.])/g, '\\\\$1').replace('#', 'AutoComplete_');
            this.target = H(selector).prop('autocomplete', 'off');
            if(this.target.hasClass(this.id))
                return;
            this.container = H(this.containerClass);
            if(this.container.length<=0){
                this.container = H('<div><div id="' + this.id + '" class="' + this.id + ' AutoComplete" style="display:none;"></div></div>').appendTo('body');
                this.container.addClass(this.containerClass);
                if(this.exClass) this.container.addClass(this.exClass);
            }
            this.instance = H('.' + this.id);
            if(this.instance.length<=0) {
                this.instance = H('<div id="' + this.id + '" class="' + this.id + ' AutoComplete" style="display:none;"></div>')
                                    .appendTo(this.container);
            }

            var self = this,
                target = this.target,
                id = this.id;
			if(!target.hasClass(id)) {//输入框处理
                target.addClass(id)
                    .Bind('focus', this.onTargetFocus, this, null)//控件获取焦点事件
					.Bind('keydown', this.onKeyDown, this, null)
					.Bind('keyup', this.onKeyUp, this, null)
                   // .Bind('click', this.onTargetClick, this, null)//单击控件事件
					.Bind("unload", this.UnLoad, this, null)
                    .Bind('blur',  this.onTargetBlur, this, null);//控件失去焦点事件
					//ie维持输入框焦点
                // if(H.browser.msie)
                //     target.Bind('beforedeactivate', this.onBeforeDeactivate, this, null);//
            }
            this.instance
                .Bind('mousedown', this.onMouseDown, this, null);
			this.showDefaultValue();
			target = null;
        },
		showDefaultValue:function(){
			if(!this.Options.GetDefaultValue) return;
			var val = this.target.val();
			if(val == "" || val == this.Options.GetDefaultValue.call(this)){
				this.target.addClass(this.Options.DefaultClass);
				this.target.val(this.Options.GetDefaultValue.call(this));
				this.target.attr("default", this.Options.GetDefaultValue.call(this));
			}
			val = null;
		},
		removeDefaultValue:function(){
			if(!this.Options.GetDefaultValue) return;
			if(this.target.hasClass(this.Options.DefaultClass)){
				this.target.removeClass(this.Options.DefaultClass);
				this.target.val("");
			}
		},
		/// <summary>
        /// 输入控件获取焦点，显示当前控件
        /// </summary>
        onTargetFocus: function(event) {
			var that = this;
			that.showContainer(that.direction == 'up');
			if(that.Options.CorrctPosition){
				var option = that.Options.CorrctPosition.call(that);
				that.instance.parent().css({
					'top': option.top,
					'left': option.left
				});
				option = null;
			}
			that.Show();
			that.correctDefaultShow();
			that.removeDefaultValue();
			that.registerCheckChange();
			if(that.Options.onFocus) that.Options.onFocus.call(that);
        },
		/// <summary>
        /// 注册检查控件值改变的定时器
        /// </summary>
		registerCheckChange:function(){
			if(this.IntervalTimer == null){
				var self = this;
				self.oldValue = self.target.val();
				this.IntervalTimer = setInterval(function(){
					
					if(self.oldValue != self.target.val()){//输入框发生改变
					
						if (self.Timer != null)  {
							
							clearTimeout(self.Timer);
						}
						
						if(self.target.val() == ""){
							self.showMode = 0;
							self.attachHtml();
							self.correctDefaultShow();
						}
						else{
							self.showMode = 1; 
							self.Timer = setTimeout(function(){
								self.Options.pageIndex = 0;
								self.GetData();
							}, 110);
						}
						self.oldValue = self.target.val();
					}
				}, 100);
				
			}
		},
		/// <summary>
        /// 撤销检查控件值改变的定时器
        /// </summary>
		unRegisterCheckChange:function(){
			if(this.IntervalTimer != null) {
				clearInterval(this.IntervalTimer);
				this.IntervalTimer = null;

			}
		},
		/// <summary>
        /// 输入控件获取焦点，隐藏日历
        /// </summary>
        onTargetBlur: function(event) {
            this.unRegisterCheckChange();
            this.Hide();
			this.showMode = 0;
			this.showDefaultValue();
			if(this.Options.onBlur) this.Options.onBlur.call(this);
        },//onTargetFocus
		
		cancelLastRequest:function(){
			if(this.currentGetJson != null){
				
				this.currentGetJson.abort();
				//this.currentGetJson.customercode = 0;
				this.currentGetJson = null;
			}
		},
		/// <summary>
        /// 获取显示数据
        /// </summary>
		GetData:function(){
			var title = this.instance.find("span.title");
			if(title.length == 0){
				var titleHtml = "";
				if(this.Options.getTitleHtml)
					titleHtml = this.Options.getTitleHtml.call(this, 1);
				this.instance.append('<div class="AutoCompleteTitle">' + titleHtml + '</div><div class="AutoCompleteContent"></div>');
				title = this.instance.find("span.title");
				titleHtml = null;
			}
	
			var self = this, that = this;
			if(this.Options.LoadingInfo)
				title.html(this.Options.LoadingInfo.call(this));
			that.instance.show();
			that.showContainer(that.direction == 'up');
			that.instance.parent().show();
			that.showing = true;
			// if(this.Options.SearchSource == 0){
				that.cancelLastRequest();
				var requestUrl = "";
				if(this.Options.GetUrl){
					requestUrl = this.Options.GetUrl.call(this);
				}
				var data = null;
				if(this.Options.getRequestData)
					data = this.Options.getRequestData.call(this);
				this.currentGetJson = $.ajax({
					url:requestUrl,
					dataType:this.Options.dataType || 'json',
					type: this.Options.ajaxType || 'get',
					data: data,
					success:function(jsonData, textStatus, xmlHttpRequest){
						if(self.Options.customerJsonData) 
							jsonData = self.Options.customerJsonData(jsonData);
						if(!jsonData || !jsonData.Data || jsonData.Data == null || jsonData.Data.length == 0){
							if(self.Options.NoDataInfo){
								//title.html("对不起，找不到城市:" + self.target.val());
								title.text(self.Options.NoDataInfo.call(self));
								that.instance.find("ul.search").html('');
								//document.title = self.target.val();
							}
							return;
						}
						

						if(self.Options.SearchedTitle)
							title.html(self.Options.SearchedTitle.call(self));
						// var tempData = jsonData.Data,
						// 	allpages = parseInt((tempData.length - 1)/self.Options.PageCount) + 1,
						// 	index = 0;
						// self.Data = null;
						// self.Data = new Array(0);
						// for(index = 0; index < allpages; index++){
						// 	self.Data.push(new Array(0));
						// }
						// for(index=0; index < tempData.length; index++){
						// 	var pageindex = parseInt(index/self.Options.PageCount);
						// 	self.Data[pageindex].push(tempData[index]);
						// }
						// self.Options.pageIndex = 0;
						var currentIndex = self.Options.pageIndex;
						if(currentIndex == 0){
							self.Data = new Array(self.Options.PageCount);
						}
						self.Data[currentIndex] = jsonData.Data;
						self.total = jsonData.total;
						
						self.attachHtml();
					},
					timeout:15000,
					cache:true,
					error:function(xmlHttpRequest,textStatus){
						title = null;
						switch(textStatus){
							case "timeout":
								if(self.Options.TimeOutInfo)
									title.html(self.Options.TimeOutInfo.call(self));
								break;
							/*case "error":
								if(this.xhr().readyState == 0)
									title.html(self.Options.TimeOutInfo.call(self));
								break;*/
						}
					}
				});
			// }
			
			//title = null;
		},
        /// <summary>
        /// 生成控件html
        /// </summary>
        attachHtml: function (args) {
			switch(this.showMode){
				case 0:
					this.attachDefaultHtml();
					break;
				case 1:
					if(this.Data == null || !this.Data[this.Options.pageIndex] || this.Data[this.Options.pageIndex].length == 0){
						this.GetData();
					}
					else{ 
						this.attachSearchHtml();
					}
					break;
				default:
			}
		
        },//attachHtml
		/// <summary>
        /// 生成动态html
        /// </summary>
		attachSearchHtml:function(){
			// this.container.css({"width":"230px"});
			//this.instance.find("span.title").css({"width":"210px"});
			var that = this,
				options = that.Options,
				contentHtml = "",
				otherHtml = "",
				serarchObj = this.instance.find("ul.search"),
				instance = that.instance;
			instance.find(".defaultType").remove();
			instance.find(".defaultItem").remove();
			
			if(serarchObj.length == 0){
				H('<ul class="search"></ul>').appendTo(instance.find(".AutoCompleteContent"));
				serarchObj = instance.find("ul.search");
			}
			this.value = that.Data[options.pageIndex];
			var allpages = that.Data.length,
				currentIndex = parseInt(options.pageIndex);
				allpages = that.total;
			if(options.ShowNavigate == 1 && that.total > 1){
				otherHtml = that.Format("<li class='fenye'><span pageindex='{0}' class='navipage'>←</span>", parseInt(options.pageIndex - 1));
				var mode = currentIndex,/*parseInt(currentIndex/5, 10),*/
					index = currentIndex,/* * 5,*/
					endindex = (mode + 1) * 5;
					if(index>1)
						index=index-2;
					else{
						mode=0;
						index=0;
					}
					if(index+5<allpages)
						endindex=index+5;
					else{
						endindex=allpages;
						index=allpages-5;
						if(index<1)
							index=0;
					}
				if(mode > 0)
					index += 1;
				for(; index <= allpages && index <= endindex; index++){
					if(index-1 == options.pageIndex)
						otherHtml += that.Format("<span class='navipage {1}'>{0}</span>", index, "selected");
					else
						otherHtml += that.Format("<span pageindex='{0}' class='navipage'>{1}</span>", parseInt(index - 1), index);
				}
				var nextIndex = currentIndex + 1;
				if(nextIndex >= allpages) nextIndex = -1;
				otherHtml += that.Format("<span pageindex='{0}' class='navipage'>→ </span></li>", nextIndex);
			}
			for(dataIndex in this.value){
				if(options.OnRender)
					contentHtml += '<li index="' + dataIndex + '">' + options.OnRender.call(that, that.value[dataIndex], 1) + "</li>";
			}
			serarchObj.html(contentHtml + otherHtml/* + bottomHtml*/);
			var searchObj = instance.find("ul.search"),
				searchLiObj = searchObj.find("li.fenye");
			searchLiObj.css("margin-left", (searchObj.width() - searchLiObj.find("span").length*17)/2 + "px");
			instance.find("[pageindex='-1']").each(function(){H(this).remove();});
			that.showContainer();
		},
		showContainer: function(isup){
			var that = this,
				tpos = that.target.offset(),
				top = tpos.top + that.target.outerHeight(),
				height = that.container.height();
			if(isup || top + height >= window.innerHeight && height < top){
				that.direction = 'up';
				top = tpos.top - height - 2;
			}else{
				that.direction = 'down';
			}
			that.instance.parent().css({
                'top':top,
                'left': tpos.left
            });
		},
		/// <summary>
        /// 
        /// </summary>
        /// <param name="">字符串</param>
        /// <returns>字符串</returns>
		Format: function () {
			if (arguments.length == 0) return null;
			var str = arguments[0];
			for (var i = 1; i < arguments.length; i++) {
				var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
				str = str.replace(re, arguments[i]);
				re = null;
			}
			try{
				return str;
			}
			finally{
				str = null;
			}
		},
		/// <summary>
        /// 生成默认html
        /// </summary>
		attachDefaultHtml: function(){
			if(!this.Options.DefaultData){
				return;
			}
			this.container.css({"width":this.Options.panelWidth+"px"});
			this.instance.empty();
			this.Data = null;
			this.value = null;
			this.Data = this.Options.DefaultData;
			var titleHtml = '',
				contentHtml = '<div class="AutoCompleteContent">';
			if(this.Options.getTitleHtml)
				titleHtml = '<div class="AutoCompleteTitle">' + this.Options.getTitleHtml.call(this, 0) + '</div>';
			if(!this.Options.HideNavigate){
				contentHtml += '<ul class="defaultType" style="display:none">';
				var tempIndex = 0;
				for(index in this.Data){
					if(this.Options.pageIndex == tempIndex)
						this.value = this.Data[index];
					if(tempIndex == 0)
						contentHtml += '<li pageindex="' + tempIndex + '" class="selected">' + index + '</li>';
					else
						contentHtml += '<li pageindex="' + tempIndex + '">' + index + '</li>';
					tempIndex++;
				}
				contentHtml += "</ul>";
			}
			else {
				for(index in this.Data){
					this.value = this.Data[index];
					break;
				}
			}
			contentHtml += '<ul class="search">';
			//this.value = this.Data[this.Options.pageIndex];
			for(dataIndex in this.value){
				contentHtml += '<li class="item" index="' + dataIndex + '">' + this.Options.OnRender.call(this, this.value[dataIndex], 0) + "</li>";
			}
			this.instance.html(titleHtml + contentHtml + "</ul></div>");
			
		},
        /// <summary>
        /// 鼠标按下事件
        /// </summary>
        onMouseDown: function(event) {
            var self = this;
            try
            {
                var li = H(event.target),
                    tg = li.prop('tagName');
                if((tg == "LI" || tg == "SPAN") && li.attr("pageindex")){
					this.Options.pageIndex = li.attr("pageindex");
					this.attachHtml();
					this.instance.find("[pageindex]").each(function(){
						if(H(this).attr("pageindex") == li.attr("pageindex")){
							H(this).addClass("selected");
							self.Options.pageIndex = H(this).attr("pageindex");
						}
						else
							H(this).removeClass("selected");
					});
				}
				else if((tg == "A" && (li.attr("targetid") || li.attr("lng"))) || 
						((tg == "B" || tg == "P") && li.parent().attr("lng")) ||
						(tg == "SPAN" && li.parent().prop("tagName") == "A")){
					if(tg == "A"){
						li.addClass("selected");
						li = li.parent();
					}
					else {
						li.parent().addClass("selected");
						li = li.parent().parent();
					}
					this.Options.OnSelect.call(this, this.value[li.attr("index")]);
					this.Hide();
				}
            }catch(e){
            	var s = 0;
            }finally {//阻止事件冒泡
                return false;
            }
        },
        
        /// <summary>
        /// 鼠标弹起事件
        /// </summary>
        onMouseUp: function(event) {
			this.oldValue = this.target.val();
            this.registerCheckChange(event);
        },
		getSelected:function(){
			var selectedItem = this.instance.find("li[index] a.selected");
			var index = parseInt(selectedItem.parent().attr("index"));
			if(selectedItem.length == 0) return null;
			selectedItem = null;
			//if(this.value == null || this.value.length == 0) return null;
			return this.value[index];
		},

		/// <summary>
        /// 鼠标弹起事件
        /// </summary>
        onKeyUp: function(event) {
			
			 var which = event.which;
			if(event.which >=37 && event.which <= 40){
				this.oldValue = this.target.val();
                this.registerCheckChange();
			}
		
        },
		enterSelect:function(){
			if(this.target.val() != this.oldValue)
					return false;
				var selectedItem = this.instance.find("li[index] a.selected");
				if(selectedItem.length == 0){
					selectedItem = H(this.instance.find("li[index] a")[0]);
				}
				if(selectedItem.length == 0){//没有搜搜到内容
					if(this.Options.OnSelect)this.Options.OnSelect.call(this);
				}
				for(index in this.value){
					if(parseInt(index) == parseInt(selectedItem.parent().attr("index"))){
						if(this.Options.OnSelect)this.Options.OnSelect.call(this, this.value[index]);
						this.Hide();
						this.Options.pageIndex = 0;
						return;
					}
				}
				this.Options.pageIndex = 0;
		},
		/// <summary>
        /// 鼠标弹起事件
        /// </summary>
        onKeyDown: function(event) {
			switch(event.which){
				case 32:
					return false;
				case 27://esc
					//this.Options.OnBeforeHide.call(this, this.getSelected());
					//this.Options.pageIndex = 0;
					//this.oldValue = this.target.val();
					this.Hide();
					break;
				case 37://向左的方向键
					var length = this.Data.length || this.Options.DefaultDataLength;
					if(event.shiftKey && length >= 2) break;
					if(length <= 1) return true;
					var prePageindex = parseInt(this.Options.pageIndex) - 1;
					if(prePageindex < 0) prePageindex = length - 1;
					this.Options.pageIndex = prePageindex;
					this.attachHtml();
					return false;
				case 39://向右的方向键
					// var length = this.Data.length || this.Options.DefaultDataLength;
					var length = this.total;
					if(event.shiftKey && this.Data.length >= 2) break;
					if(length <= 1) return true;
					var nextPageindex = parseInt(this.Options.pageIndex) + 1;
					if(nextPageindex >= length) nextPageindex = 0;
					this.Options.pageIndex = nextPageindex;
					this.attachHtml();
					return false;
				case 38://向上的方向键
					var AllItems = this.instance.find("li[index] a");
					var selectedItem = this.instance.find("li[index] a.selected");
					if(selectedItem.length == 0 && AllItems.length != 0) H(AllItems[AllItems.length-1]).addClass("selected");
					var preItem = selectedItem.parent().prev().find("a");
					selectedItem.removeClass("selected");
					if(preItem.length == 0){
						H(AllItems[AllItems.length-1]).addClass("selected");
						this.Options.OnSelectedItemChange.call(this, this.value[AllItems.length-1]);
					}
					else{
						preItem.addClass("selected");
						this.Options.OnSelectedItemChange.call(this, this.value[parseInt(preItem.parent().attr("index"))]);
					}
					break;
				case 40://向下的方向键
					var AllItems = this.instance.find("li[index] a");
					var selectedItem = this.instance.find("li[index] a.selected");

					if(selectedItem.length == 0 && AllItems.length != 0) H(AllItems[0]).addClass("selected");
					var nextItem = selectedItem.parent().next().find("a");
					selectedItem.removeClass("selected");
					if(nextItem.length == 0){
						H(AllItems[0]).addClass("selected");
						this.Options.OnSelectedItemChange.call(this, this.value[0]);
					}
					else{
						nextItem.addClass("selected");
						this.Options.OnSelectedItemChange.call(this, this.value[parseInt(nextItem.parent().attr("index"))]);
					}
					break;
				case 13://回车选中
					this.enterSelect();
					break;
				case 9://tab
					this.Options.OnSelect.call(this, this.getSelected());
					break;
			}
            var which = event.which;
			if(event.which >=37 && event.which <= 40 || which == 9){
                this.unRegisterCheckChange();
			}
        },
        /// <summary>
        /// 单击控件
        /// </summary>
        onMouseClick: function(event) {
        },
		/// <summary>
        /// 在没有默认数据源的情况下,隐藏该控件
        /// </summary>
		correctDefaultShow:function(){
			if(this.target.val() != "" && !this.Options.DefaultData && this.Options.GetDefaultValue && this.target.val() != this.Options.GetDefaultValue.call(this)){
				//this.instance.append('<div class="AutoCompleteTitle">' + this.Options.getTitleHtml.call(this, 1) + '</div><div class="AutoCompleteContent"></div>');
				this.showMode = 1;
				//this.showing = true;
				//this.instance.show().parent().show();
				this.GetData();
			}
			else if(this.showing && !this.Options.DefaultData){
				if(this.mask!=null)
					this.mask.remove();
				this.mask = null;
				this.showing = false;
				this.instance.empty().hide().parent().hide();
				this.value = null;
				this.Data = null;
				this.Options.OnBeforeHide.call(this, null, null);
			}
		},

        /// <summary>	
        /// 显示控件
        /// </summary>
        Show: function (event) {
			if(this.showing)
                return;
			if(this.Options.OnBeforeShow) {
				this.Options.OnBeforeShow.call(this);
			}else{
				var target = this.GetTarget();
                if(!target.attr('targetid')) target.attr('targetid', "");
                if(!target.attr('initialId')){
                    target.attr('initialId', target.attr('targetid'));
                    target.attr('initialValue', target.val());
                }
			}
			if(!this.showing && !this.Options.DefaultData)
				return;
			var self = this;
            this.showing = true;
   
            
            this.Focus(true);
            this.attachHtml();
            this.instance.show().parent().show();
        },

        /// <summary>
        /// 关闭控件
        /// </summary>
        Hide: function (event) {
			this.cancelLastRequest();
			if(!this.showing)
                return;
			var defaultItem = null;
			if(this.value != null && this.value) defaultItem = this.value[0];
			if(this.Options.OnBeforeHide) this.Options.OnBeforeHide.call(this, this.getSelected(), this.showMode == 0 ? null : defaultItem);
            this.showing = false;
            this.target.blur();
			this.oldValue = this.target.val();
      
            this.instance.empty().hide().parent().hide();
            if(this.Options.OnHide)
                this.Options.OnHide.apply(this, arguments);

            if(this.mask!=null)
                this.mask.remove();
            this.mask = null;
		
			defaultItem = null;
			
        },
		/// <summary>
        /// 注销事件，释放资源
        /// </summary>
		UnLoad:function(){

			this.target.addClass(id)
				.UnBind('focus', this.onTargetFocus, this)//控件获取焦点事件
				.UnBind('keydown', this.onKeyDown, this)
				.UnBind('keyup', this.onKeyUp, this)
                   // .Bind('click', this.onTargetClick, this, null)//单击控件事件
				.UnBind("unload", this.UnLoad, this)
				.UnBind('blur',  this.onTargetBlur, this);//控件失去焦点事件
				//ie维持输入框焦点
			if(H.browser.msie)
				target.UnBind('beforedeactivate', this.onBeforeDeactivate, this);//

            this.instance
                .UnBind('mousedown', this.onMouseDown, this);

			this.Options.DefaultData = null;
			this.Options = null;
            this.showMode = null;
            this.instance = null;
            this.id = null
            this.target = null;
            this.value = null;
			this.Data = null;
			this.oldValue = null;
			this.DefaultTimeOut = null;
			this.IntervalTimer = null;
			this.Timer = null;
			this.currentGetJson = null;

			T = null;
			S = null;
		},
		/// <summary>
        /// 输入框失去焦点事件,ie下维持输入框焦点
        /// this.activate为true，则维持焦点，否则可失去焦点
        /// </summary>
        onBeforeDeactivate: function(event, args) {
            return true;
        },

		//onBeforeDeactivate
        /// <summary>
        /// 获得焦点
        /// </summary>
        Focus: function (isFocus) {
			if(isFocus){
				this.target.focus();
			}
        },
		GetTarget:function(){
			return this.target;
		}
    });///<end>Holsun.Widget.AutoComplete</end>
})(my);