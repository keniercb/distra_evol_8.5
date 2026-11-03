Ax.ns('Ax.Charts.Views');
Ax.Charts.Views.Chart = function (params) {
    this.chart = null;
    this.config = (params && params.config) ? params.config : {};
    this.params = (params) ? params : {};
    this.create = function (config) {
        this.config = (config && config.config) ? config.config : this.config;
        this.params = (config) ? config : this.params;
        this.controller = new Ax.Charts.Controllers.Chart(this.params);
        this.chartOptions = this.controller.getChartOptions();
        if (this.config.autoShow) {
            this.render();
        }
    };
    this.render = function () {
        if (this.chart && typeof this.chart.destroy == 'function') {
            if(this.chart.renderTo && document.getElementById(this.chart.renderTo)){
                this.chart.destroy();
            }
        }
        Highcharts.setOptions({
            lang: this.getLabel('highchartsLabels'),
            credits: this.getLabel('highchartsCredits'),
            title: {
                text: this.getLabel('chartTitle')
            }
        });
        console.log(this.chartOptions);
        this.chart = new Highcharts.Chart(this.chartOptions);
    };
    this.resizeChart = function () {
        if (this.chart) {
            var width = $(this.chart.container).parent().width();
            var height = $(this.chart.container).parent().height();
            this.chart.setSize(width, height, true)
        }
    };
    this.setOpts = function (chartOpts) {
        this.chartOptions = chartOpts;
    };
    this.setContainer = function (container) {
        this.controller.setChartContainer(container);
        this.chartOptions = this.controller.getChartOptions();
    };
    this.getChart = function () {
        return this.chart;
    };
    this.setData = function (data, reader, skipRender) {
        if (data) {
            this.controller.setData(data, reader);
            this.chartOptions = this.controller.getChartOptions();
            if(!skipRender){
                this.destroy();
                this.render();
            }
        }
    };
    this.rotateChart = function (rotation) {
        this.controller.rotateChart(rotation);
        this.chartOptions = this.controller.getChartOptions();
        this.destroy();
        this.render();
    };
    this.clearChart = function () {
        if (this.chart) {
            while (this.chart.series[0]) {
                this.chart.series[0].remove(false)
            }
        }
    };
    this.drawSerie = function (serie) {
        if (this.chart) {
            this.chart.addSeries(serie, false);
            this.chart.redraw();
        }
    };
    this.destroy = function () {
        if (this.chart && typeof this.chart.destroy == 'function') {
            this.chart.destroy();
            delete this.chart;
            this.chart = null;
        }
    };
    this.changeChartType = function (type) {
        this.destroy();
        var response = this.controller.setChartType(type);
        this.chartOptions = this.controller.getChartOptions();
        this.render();
        return response;
    };
    this.addSerie = function (serie) {
        this.destroy();
        this.controller.addSerie(serie);
        this.chartOptions = this.controller.getChartOptions();
        this.render();
    };
    this.getChartTypes = function (asSimpleArray) {
        return this.controller.getChartTypes(asSimpleArray);
    };
    this.getLabel = function (label, lang) {
        return this.controller.getLabel(label, lang);
    };
    this.reconfigure = function (config) {
        if (config) {
            this.destroy();
            if (config.data) {
                var reader = config.reader ? config.reader : null;
                this.controller.setData(config.data, reader);
            }
            if (config.type) {
                this.controller.setChartType(config.type);
            }
            var rotationX = 0;
            var rotationY = 0;
            var deep = 0;
            if (config.rotation) {
                rotationX = config.rotation.x;
                rotationY = config.rotation.y;
                deep = config.rotation.deep;
            }
            this.controller.rotateChart({
                x: rotationX,
                y: rotationY,
                deep: deep
            });
            if (config.fillOpacity) {
                this.setFillOpacityOpt(config.fillOpacity);
            }
            this.chartOptions = this.controller.getChartOptions();
            this.render();
        }
    };
    this.rotationEnabled = function (type) {
        return this.controller.rotationEnabled(type);
    };
    this.getXSource = function () {
        return this.controller.getXSource();
    };
    this.getYSource = function () {
        return this.controller.getYSource();
    };
    this.setTheme = function (theme) {
        var defaultTheme = this.controller.getTheme(theme);
        var background = 'white';
        if (defaultTheme) {
            background = defaultTheme.background;
            var container = this.chart ? this.chart.container : null;
            if (this.chart) {
                this.chart.container.style.background = background;
                var chartBackground = this.chart.container.getElementsByClassName('highcharts-background');
                if (chartBackground && chartBackground.length) {
                    chartBackground[0].style.fill = 'transparent';
                }
            }
        } else {
            background = theme;
            this.controller.setBackgroundColor(background);
            this.chartOptions = this.controller.getChartOptions();
            this.render();
        }
    };
    this.getThemeList = function () {
        return this.controller.getThemeList();
    };
    this.getChartTitle = function () {
        return this.controller.getChartTitle();
    };
    this.setChartTitle = function (title) {
        return this.controller.setChartTitle(title);
    };
    this.getXaxisTitle = function () {
        return this.controller.getXaxisTitle();
    };
    this.getYayisTitle = function () {
        return this.controller.getYayisTitle();
    };
    this.setXaxisTitle = function (title) {
        return this.controller.setXaxisTitle(title);
    };
    this.setYayisTitle = function (title) {
        return this.controller.setYayisTitle(title);
    };
    this.setFillOpacityOpt = function (opacity) {
        return this.setChartOption('plotOptions.series.fillOpacity', parseFloat(opacity));
    };
    this.setFillOpacity = function (opacity) {
        this.setFillOpacityOpt(opacity);
        this.chartOptions = this.controller.getChartOptions();
        this.render();
    };
    this.redraw = function () {
        this.chartOptions = this.controller.getChartOptions();
        this.render();
    };
    this.setChartOption = function (property, value) {
        return this.controller.setChartOption(property, value);
    };
    this.setSeriesPropertyValue = function (property, value) {
        return this.controller.setSeriesPropertyValue(property, value);
    };
    this.setCurrentCategorySource= function(categorySource){
        
    };
    this.appendFilterToTitle = function(title, filters){
        
    };
    this.buildSeriesBy = function(data, categorieField, yayisField, serieFields, filters, filterCfg){
        var multiSeries = undefined;
        var multiSerieSource = undefined;
        if(filters && filterCfg && typeof filterCfg == 'object' && filterCfg.filters && typeof filterCfg.filters == 'object') {
            var mark = false;
            for (var i in filters) {
                if (typeof filters[i] == 'object' && filters[i].length && filterCfg.filters[i].serialize) {
                    multiSeries = [];
                    for (var j = 0; j < filters[i].length; j++) {
                        multiSeries.push(filters[i][j]);
                    }
                    if(multiSeries.length){
                        mark = true;
                        multiSerieSource = filterCfg.filters[i].valueField
                    }else{
                        multiSeries = undefined;
                        multiSerieSource = undefined;
                    }
                }
            }
        }
        var series = [];
        var categSource = categorieField && typeof categorieField == 'string' ? categorieField : null;
        if(categorieField && typeof categorieField == 'object'){
            categSource = categorieField.source;
        }
        var yayisSource = yayisField && typeof yayisField == 'string' ? yayisField : null;
        if(yayisField && typeof yayisField == 'object'){
            yayisSource = yayisField.source;
        }
        var yayis = serieFields.y && typeof serieFields.y == 'object' ? serieFields.y : serieFields;
        if(typeof serieFields.x == 'object'){
            categSource = serieFields.x.source ? serieFields.x.source : categSource;
        }
        for(var i = 0 ; i < yayis.length ; i ++){
            var serieCfg = yayis[i];
            if(serieCfg.x || serieCfg.y){

                if(typeof serieCfg.y == 'object'){
                    serieCfg = serieCfg.y ? serieCfg.y : serieCfg;
                }
            }
            if(serieCfg.name && serieCfg.source){
                if(multiSeries && categSource != multiSerieSource){
                    for(var k = 0 ; k < multiSeries.length ; k ++){
                        var serie = {
                            name: serieCfg.name + "(" + multiSeries[k] + ")",
                            data: []
                        };
                        for(var j = 0 ; j < data.length ; j ++){
                            if(typeof data[j][categSource] != 'undefined' && data[j][multiSerieSource] == multiSeries[k]){
                                var res = {};
                                res[categSource] = data[j][categSource];
                                res[yayisSource] = typeof data[j][serieCfg.source] != 'undefined' ? data[j][serieCfg.source] : null;
                                serie.data.push(res);
                            }
                        }
                        series.push(serie);
                    }
                }else{
                    var serie = {
                        name: serieCfg.name,
                        data: []
                    };
                    for(var j = 0 ; j < data.length ; j ++){
                        if(typeof data[j][categSource] != 'undefined'){
                            var res = {};
                            res[categSource] = data[j][categSource];
                            res[yayisSource] = typeof data[j][serieCfg.source] != 'undefined' ? data[j][serieCfg.source] : null;
                            serie.data.push(res);
                        }
                    }
                    series.push(serie);
                }
                
            }
        }
        return series;
    };
    this.buildFilters = function(data, filtersCfg){
        var filters = {};
        var serialize = false;
        if(typeof filtersCfg != 'undefined') {
            for (var i = 0; i < filtersCfg.length; i++) {
                var filter = {
                    name: '',
                    valueField: '',
                    displayField: '',
                    values: [],
                    ctrlVal: {},
                    multiselect: false,
                    serialize: false
                }
                if(typeof filtersCfg[i] == 'string'){
                    filter.name = filtersCfg[i];
                    filter.valueField = filtersCfg[i];
                    filter.displayField = filtersCfg[i];
                }else if(typeof filtersCfg[i] == 'object' && filtersCfg[i].name){
                    filter.name = filtersCfg[i].name;
                    filter.valueField = filtersCfg[i].value ? filtersCfg[i].value : (filtersCfg[i].source ? filtersCfg[i].source : filtersCfg[i].name);
                    filter.displayField = filtersCfg[i].display ? filtersCfg[i].display : filtersCfg[i].value;
                }
                if(filtersCfg[i].multiselect) {
                    filter.multiselect = true;
                }
                if(filtersCfg[i].serialize && !serialize) {
                    filter.serialize = true;
                    serialize = true;
                }
                if(filters[filter.name]){
                    filter = filters[filter.name];
                }
                filter.values.push(['none', this.getLabel('removeFilter')]);
                for(var j = 0 ; j < data.length ; j ++){
                    if(typeof data[j][filter.valueField] != 'undefined' && !filter.ctrlVal[data[j][filter.valueField]]){
                        var value = [];
                        value[0] = data[j][filter.valueField];
                        value[1] = data[j][filter.displayField] ? data[j][filter.displayField] : data[j][filter.valueField];
                        filter.values.push(value);
                        filter.ctrlVal[value[0]] = true;
                    }
                }
                filters[filter.name] = filter;
            }
        }
        return filters;
    };
    this.transformData = function(filterObj, filter){
        if(typeof filterObj == 'object'){
            var data = filterObj.dataBag;
            var reader = filterObj.reader;
            var result = {
                data: []
            };
            if(filter === -1 || filter.length == 0){
                filterObj.currentFilter = {};
            }else if (typeof filter == 'object'){
                Ax.apply(filterObj.currentFilter, filter);
            }
            for(var i = 0 ; i < data.length ; i ++){
                var valid = {};
                for(var j in filterObj.currentFilter){
                    valid[j] = false;
                    var filterArg = filterObj.filters[j];
                    var valueField = filterArg.valueField;
                    if(typeof filterObj.currentFilter[j] == 'object' && filterObj.currentFilter[j].length){
                        for(var k = 0 ; k < filterObj.currentFilter[j].length ; k ++){
                            if(data[i][valueField] == filterObj.currentFilter[j][k]){
                                valid[j] = true;
                            }
                        }
                    }else {
                        if (filterObj.currentFilter[j] == 'none' || data[i][valueField] == filterObj.currentFilter[j]) {
                            valid[j] = true;
                        }
                    }
                }
                var append = true;
                for(var v in valid){
                    append = (valid[v] && append);
                }
                if(append){
                    result.data.push(data[i]);
                }
            }
            return result;
        }
        return null;
    };
    this.setFilteredTitle = function(title, filter){
        var joiner = '(';
        for(var i in filter){
            title += joiner + i + ': ' + filter[i];
            joiner = ',';
        }
        title += joiner != '(' ? ')' : '';
        this.setChartTitle(title);
    };
    if (params) {
        this.create(params);
    }
    ;
}

Ax.Charts.Views.notify = function (title, msg, severity) {
    return window.alert(title + '\n' + msg);
}