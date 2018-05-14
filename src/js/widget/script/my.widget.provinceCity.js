(function (A) {
    var CP = {};
    A.widget.provinceCity = {
        ServerPath: '@@ServerPath@@',
        options: {
            provinceSelector: '#provinceSelector',
            selectedProvince: '',
            citySelector: '#citySelector',
            selectedCity: '',
            countySelector: '#countySelector',
            selectedCounty: ''
        },
        init: function(_op){
            var that = this,
                op = that.options;
            A.extend(op, _op);
            //加载省份
            A.ajax({
                url: that.ServerPath + 'getProvince',
                emulate:true,
                dataType: 'json',
                success: function(data){
                    that._showProvince(data);
                }
            });
            //加载城市
            //that.loadCity(op.selectedProvince)
            //加载县城
            //that.loadCounty(op.selectedCity);
            $(op.provinceSelector).off('change').on('change', function(e){
                var provinceId = $(e.target).val();
                if(provinceId == ' ') return;
                $(op.citySelector).html("<option value=''>数据加载中...</option>");
                $(op.countySelector).html("<option value=''>请选择</option>");
                that.loadCity(provinceId, true);
            });
            $(op.citySelector).off('change').on('change', function(e){
                var cityId = $(e.target).val();
                if(cityId == ' ') return;
                $(op.countySelector).html("<option value=''>数据加载中...</option>");
                that.loadCounty(cityId);
            });
        },
        loadCity: function(provinceId, isLoadCounty){
            var that = this;
            A.ajax({
                url: that.ServerPath + 'getCity',
                emulate:true,
                type:'POST',
                dataType: 'json',
                data: {params: A.toJSON({provinceName: provinceId.encode()})},
                success: function(data){
                    that._showCity(data);
                    if(isLoadCounty && data.list.length > 0){
                        that.loadCounty(data.list[0].name);
                    }
                }
            });
        },
        loadCounty: function(cityId){
            var that = this;
            A.ajax({
                url: that.ServerPath + 'getCountry',
                emulate:true,
                type:'POST',
                dataType: 'json',
                data: {params: A.toJSON({cityName: cityId.encode()})},
                success: function(data){
                    that._showCounty(data);
                }
            });
        },
        _showProvince: function(data){
            var that = this,
                data=data.list,
                op = that.options,
                html = ["<option value=''>" + "请选择" + "</option>"],
                selectedProvince = op.selectedProvince;
            A.each(data || [], function(index, d){
                var id = d.name;
                html.push("<option value='" + id + "'" + (selectedProvince == id ? 'selected': '') + ">" + d.name + "</option>");
            });
            $(op.provinceSelector).html(html.join(''));
        },
        _showCity: function(data){
            var that = this,
                data=data.list,
                op = that.options,
                html = ["<option value=''>" + "请选择" + "</option>"],
                selectedCity = op.selectedCity;
            A.each(data ||[], function(index, d){
                var id = d.name;
                html.push("<option value='" + id + "'" + (selectedCity == id ? 'selected': '') + ">" + d.name + "</option>");
            });
            $(op.citySelector).html(html.join(''));
        },
        _showCounty: function(data){
            var that = this,
                data=data.list,
                op = that.options,
                html = ["<option value=''>" + "请选择" + "</option>"],
                selectedCity = op.selectedCounty;
            A.each(data || [], function(index, d){
                var id = d.name;
                html.push("<option value='" + id + "'" + (selectedCity == id ? 'selected': '') + ">" + d.name + "</option>");
            });
            $(op.countySelector).html(html.join(''));
        }
    }


    function initCountySelector() {
        var selectedId = jQuery('#citySelector').val();
        // alert('selectedId:'+selectedId);
        var params;
        if (selectedId != null && selectedId != '') {
            params = {
                cityName : selectedId.encode(),
                dt : new Date()
            }
        } else {
            params = {
                cityName : selectedCity.encode(),
                dt : new Date()
            }
        }
    
        jQuery.getJSON(that.ServerPath + "getCountry", params, function(data) {
            jQuery('#countySelector').empty();
            var odata=data.list;
            if (data != null && odata.length > 0) {
                for (var i = 0; i < odata.length; i++) {
                    if (odata[i] != null) {
                        if (selectedCounty == odata[i].name) {
                            jQuery('#countySelector').append(
                                    "<option value='" + odata[i].name + "' selected>"
                                            + odata[i].name + "</option>");
                        } else {
                            jQuery('#countySelector').append(
                                    "<option value='" + odata[i].name + "'>"
                                            + odata[i].name + "</option>");
                        }
                    }
                }
            }
        });
    }
    
    // 初始化城市下拉框
    function initCitySelector() {
        var selectedId = jQuery('#provinceSelector').val();
        var params;
        if (selectedId != null && selectedId != '') {
            params = {
                provinceName : selectedId.encode(),
                dt : new Date()
            }
        } else {
            params = {
                provinceName : selectedProvince.encode(),
                dt : new Date()
            }
        }
    
        // 避免改变了城市下拉框内容，而区县下拉框内容不变
        if (selectedCity == null && selectedCity == '') {
            jQuery('#countySelector').empty();
            jQuery('#countySelector').append("<option value=\"\">全部县城</option>");
        }
    
        jQuery.getJSON(that.ServerPath + "getCity", params, function(data) {
            var odata=data.list;
            if (data != null && odata.length > 0) {
                jQuery('#citySelector').empty();
                            
                for (var i = 0; i < odata.length; i++) {
                    if (odata[i] != null) {
                        if (selectedCity == odata[i].name) {
                            jQuery('#citySelector').append(
                                    "<option value='" + odata[i].name + "' selected>"
                                            + odata[i].name + "</option>");
                        } else {
                            jQuery('#citySelector').append(
                                    "<option value='" + odata[i].name + "'>"
                                            + odata[i].name + "</option>");
                        }
                    }
                }
                
                if (selectedCounty == null || selectedCounty == '') {
                    // 加载城市对应的县级列表
                    var selectedId = odata[0].name;
                    var params1;
                    params1 = {
                            cityId : selectedId.encode(),
                            dt : new Date()
                    }
                    
                    jQuery.getJSON(that.ServerPath + "getCountry", params1, function(data) {
                        var odata=data.list;
                        jQuery('#countySelector').empty();
                        if (data != null && odata.length > 0) {
                            for (var i = 0; i < odata.length; i++) {
                                if (odata[i] != null) {
                                    if (selectedCounty == odata[i].name) {
                                        jQuery('#countySelector').append(
                                                "<option value='" + odata[i].name + "' selected>"
                                                + odata[i].name + "</option>");
                                    } else {
                                        jQuery('#countySelector').append(
                                                "<option value='" + odata[i].name + "'>"
                                                + odata[i].name + "</option>");
                                    }
                                }
                            }
                        }
                    });     
                }

                
            }
    
        });
        
    }
    
    function changeCitySelector() {
        var selectedId = jQuery('#provinceSelector').val();
        var params;
        if (selectedId != null && selectedId != '') {
            params = {
                    provinceName : selectedId.encode(),
                    dt : new Date()
            }
        } else {
            params = {
                    provinceName : selectedProvince.encode(),
                    dt : new Date()
            }
        }
        
        // 避免改变了城市下拉框内容，而区县下拉框内容不变
        if (selectedCity == null && selectedCity == '') {
            jQuery('#countySelector').empty();
            jQuery('#countySelector').append("<option value=\"\">全部县城</option>");
        }
        
        jQuery.getJSON(that.ServerPath + "getCity", params, function(data) {
            var odata=data.list;
            if (data != null && odata.length > 0) {
                jQuery('#citySelector').empty();
                
                for (var i = 0; i < odata.length; i++) {
                    if (odata[i] != null) {
                        if (selectedCity == odata[i].name) {
                            jQuery('#citySelector').append(
                                    "<option value='" + odata[i].name + "' selected>"
                                    + odata[i].name + "</option>");
                        } else {
                            jQuery('#citySelector').append(
                                    "<option value='" + odata[i].name + "'>"
                                    + odata[i].name + "</option>");
                        }
                    }
                }
                
                
                // 加载城市对应的县级列表
                var selectedId = odata[0].name;
                var params1;
                params1 = {
                        cityName : selectedId.encode(),
                        dt : new Date()
                }
                
                jQuery.getJSON(that.ServerPath + "getCountry", params1, function(data) {
                    var odata=data.list;
                    jQuery('#countySelector').empty();
                    if (data != null && odata.length > 0) {
                        for (var i = 0; i < odata.length; i++) {
                            if (odata[i] != null) {
                                if (selectedCounty == odata[i].name) {
                                    jQuery('#countySelector').append(
                                            "<option value='" + odata[i].name + "' selected>"
                                            + odata[i].name + "</option>");
                                } else {
                                    jQuery('#countySelector').append(
                                            "<option value='" + odata[i].name + "'>"
                                            + odata[i].name + "</option>");
                                }
                            }
                        }
                    }
                });     
                
            }
            
        });
        
    }
})(my);