(function (A) {
    var getProvinceParam = {};
    A.widget.provinceCity = {
        options: {
            provinceSelector: '#provinceSelector',
            selectedProvince: '6362',
            citySelector: '#citySelector',
            selectedCity: '6393',
            countySelector: '#countySelector',
            selectedCounty: '6734'
        },
        init: function(_op){
            var that = this,
                op = that.options;
            A.extend(op, _op);
            //加载省份
            A.ajax({
                url: PATH + '/linkage/provinceListJson',
                success: function(data){
                    that._showProvince(data);
                }
            });
            //加载城市
            that.loadCity(op.selectedProvince)
            //加载县城
            that.loadCounty(op.selectedCity);
            $(op.provinceSelector).off('change').on('change', function(e){
                var provinceId = $(e.target).val();
                if(provinceId == ' ') return;
                $(op.citySelector).html("<option value=' '>数据加载中...</option>");
                $(op.countySelector).html("<option value=' '>数据加载中...</option>");
                that.loadCity(provinceId, true);
            });
            $(op.citySelector).off('change').on('change', function(e){
                var cityId = $(e.target).val();
                if(cityId == ' ') return;
                $(op.countySelector).html("<option value=' '>数据加载中...</option>");
                that.loadCounty(cityId);
            });
        },
        loadCity: function(provinceId, isLoadCounty){
            var that = this;
            A.ajax({
                url: PATH + '/linkage/cityListJson',
                data: {provinceId: provinceId},
                success: function(data){
                    that._showCity(data);
                    if(isLoadCounty && data.length > 0){
                        that.loadCounty(data[0].id);
                    }
                }
            });
        },
        loadCounty: function(cityId){
            var that = this;
            A.ajax({
                url: PATH + '/linkage/countyListJson',
                data: {cityId: cityId},
                success: function(data){
                    that._showCounty(data);
                }
            });
        },
        _showProvince: function(data){
            var that = this,
                op = that.options,
                html = ["<option value=' '>" + "请选择" + "</option>"],
                selectedProvince = op.selectedProvince;
            A.each(data || [], function(index, d){
                var id = d.id;
                html.push("<option value='" + id + "'" + (selectedProvince == id ? 'selected': '') + ">" + d.name + "</option>");
            });
            $(op.provinceSelector).html(html.join(''));
        },
        _showCity: function(data){
            var that = this,
                op = that.options,
                html = [],
                selectedCity = op.selectedCity;
            A.each(data ||[], function(index, d){
                var id = d.id;
                html.push("<option value='" + id + "'" + (selectedCity == id ? 'selected': '') + ">" + d.name + "</option>");
            });
            $(op.citySelector).html(html.join(''));
        },
        _showCounty: function(data){
            var that = this,
                op = that.options,
                html = [],
                selectedCity = op.selectedCounty;
            A.each(data || [], function(index, d){
                var id = d.id;
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
                cityId : selectedId,
                dt : new Date()
            }
        } else {
            params = {
                cityId : selectedCity,
                dt : new Date()
            }
        }
    
        jQuery.getJSON(PATH + "/linkage/countyListJson", params, function(data) {
            jQuery('#countySelector').empty();
            if (data != null && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i] != null) {
                        if (selectedCounty == data[i].id) {
                            jQuery('#countySelector').append(
                                    "<option value='" + data[i].id + "' selected>"
                                            + data[i].name + "</option>");
                        } else {
                            jQuery('#countySelector').append(
                                    "<option value='" + data[i].id + "'>"
                                            + data[i].name + "</option>");
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
                provinceId : selectedId,
                dt : new Date()
            }
        } else {
            params = {
                provinceId : selectedProvince,
                dt : new Date()
            }
        }
    
        // 避免改变了城市下拉框内容，而区县下拉框内容不变
        if (selectedCity == null && selectedCity == '') {
            jQuery('#countySelector').empty();
            jQuery('#countySelector').append("<option value=\"\">全部县城</option>");
        }
    
        jQuery.getJSON(PATH + "/linkage/cityListJson", params, function(data) {
            if (data != null && data.length > 0) {
                jQuery('#citySelector').empty();
                            
                for (var i = 0; i < data.length; i++) {
                    if (data[i] != null) {
                        if (selectedCity == data[i].id) {
                            jQuery('#citySelector').append(
                                    "<option value='" + data[i].id + "' selected>"
                                            + data[i].name + "</option>");
                        } else {
                            jQuery('#citySelector').append(
                                    "<option value='" + data[i].id + "'>"
                                            + data[i].name + "</option>");
                        }
                    }
                }
                
                if (selectedCounty == null || selectedCounty == '') {
                    // 加载城市对应的县级列表
                    var selectedId = data[0].id;
                    var params1;
                    params1 = {
                            cityId : selectedId,
                            dt : new Date()
                    }
                    
                    jQuery.getJSON(PATH + "/linkage/countyListJson", params1, function(data) {
                        jQuery('#countySelector').empty();
                        if (data != null && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i] != null) {
                                    if (selectedCounty == data[i].id) {
                                        jQuery('#countySelector').append(
                                                "<option value='" + data[i].id + "' selected>"
                                                + data[i].name + "</option>");
                                    } else {
                                        jQuery('#countySelector').append(
                                                "<option value='" + data[i].id + "'>"
                                                + data[i].name + "</option>");
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
                    provinceId : selectedId,
                    dt : new Date()
            }
        } else {
            params = {
                    provinceId : selectedProvince,
                    dt : new Date()
            }
        }
        
        // 避免改变了城市下拉框内容，而区县下拉框内容不变
        if (selectedCity == null && selectedCity == '') {
            jQuery('#countySelector').empty();
            jQuery('#countySelector').append("<option value=\"\">全部县城</option>");
        }
        
        jQuery.getJSON(PATH + "/linkage/cityListJson", params, function(data) {
            if (data != null && data.length > 0) {
                jQuery('#citySelector').empty();
                
                for (var i = 0; i < data.length; i++) {
                    if (data[i] != null) {
                        if (selectedCity == data[i].id) {
                            jQuery('#citySelector').append(
                                    "<option value='" + data[i].id + "' selected>"
                                    + data[i].name + "</option>");
                        } else {
                            jQuery('#citySelector').append(
                                    "<option value='" + data[i].id + "'>"
                                    + data[i].name + "</option>");
                        }
                    }
                }
                
                
                // 加载城市对应的县级列表
                var selectedId = data[0].id;
                var params1;
                params1 = {
                        cityId : selectedId,
                        dt : new Date()
                }
                
                jQuery.getJSON(PATH + "/linkage/countyListJson", params1, function(data) {
                    jQuery('#countySelector').empty();
                    if (data != null && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i] != null) {
                                if (selectedCounty == data[i].id) {
                                    jQuery('#countySelector').append(
                                            "<option value='" + data[i].id + "' selected>"
                                            + data[i].name + "</option>");
                                } else {
                                    jQuery('#countySelector').append(
                                            "<option value='" + data[i].id + "'>"
                                            + data[i].name + "</option>");
                                }
                            }
                        }
                    }
                });     
                
            }
            
        });
        
    }
})(alijk);