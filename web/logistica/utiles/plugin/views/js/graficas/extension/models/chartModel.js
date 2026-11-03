Ax.ns('Ax.Charts.Models');
Ax.Charts.Models.Chart = function (params) {
    this.chartOptions = null;
    this.chartContainer = null;
    this.opt3D = undefined;
    this.zoomType = 'xy';
    this.chartType = null;
    this.xAxisConfig = {};
    this.yAxisConfig = {};
    this.chartTypes = Ax.Charts.chartDefaultOptions.getDefaultOption('chartTypes');
    this.data = null;
    this.initAxis = function (axis, values) {
        var label = {
            enabled: true,
            rotation: values && values['rotation'] ? values['rotation'] : Ax.Charts.chartDefaultOptions.getDefaultOption('labelRotation'),
        }
        var config = {
            name: values && values['name'] ? values['name'] : Ax.Charts.chartDefaultOptions.getDefaultOption('name'),
            crosshair: axis == 'yAxisConfig' ? {
                width: 2,
                color: 'gray',
                dashStyle: 'shortdot'
            } : undefined,
            categories: values && values['categories'] ? values['categories'] : undefined,
            min: values && typeof values['min'] != 'undefined' ? values['min'] : undefined,
            color: values && values['color'] ? values['color'] : Ax.Charts.chartDefaultOptions.getDefaultOption('color'),
            label: label,
            title: {
                text: values && values['label'] ? values['label'] : undefined
            },
            labelCls: values && values['labelCls'] ? values['labelCls'] : Ax.Charts.chartDefaultOptions.getDefaultOption('labelCls'),
            range: values && values['range'] ? values['range'] : Ax.Charts.chartDefaultOptions.getDefaultOption('range'),
            source: values && values['source'] ? values['source'] : undefined,
        };
        if (axis == 'xAxisConfig') {
            this.setXAxis(config);
            return this.getXAxis();
        } else if (axis == 'yAxisConfig') {
            this.setYAxis(config);
            return this.getYAxis();
        }
    };
    this.getChartTypes = function (asSimpleArray) {
        var chartTypes = Ax.Charts.chartDefaultOptions.getDefaultOption('chartTypes');
        if (!asSimpleArray) {
            return chartTypes;
        } else {
            var simpleArray = [];
            for (var i = 0; i < chartTypes.length; i++) {
                simpleArray.push([chartTypes[i].name, chartTypes[i].text, chartTypes[i].allowMultiSeries, chartTypes[i].support3D]);
            }
            return simpleArray;
        }
    };
    this.generatePlotOptions = function (config) {
        var type = config && config['chartType'] ? config['chartType'] : Ax.Charts.chartDefaultOptions.getDefaultOption('chartType');
        //trabajo con los labels
        switch (type) {
            case 'column':
            {
                return {
                    column: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function () {
                                    if (config && config.clickFn && typeof config.clickFn == 'function') {
                                        config.clickFn();
                                    }
                                }
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            //format: '<b>{point.name}</b> ({point.y:,.0f})',
                            formatter: function () {
                                //var x = (typeof  this.x == "undefined") ? this.point.name : this.x;
                                var y = (typeof  this.y == "undefined") ? this.point.name : this.y;
                                /*if (Ax.isDate(x)) {
                                    x = Ax.parseDate(x, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }*/
                                if (Ax.isDate(y)) {
                                    y = Ax.parseDate(y, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }
                                /*if(Ax.isString(x)){
                                    x = x.length > 6 ? x.substr(0, 6) + '...' : x;
                                }*/
                                //return x + ' (' + y + ')';
                                return y;
                            },
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            //softConnector: true
                        }
                    }
                };
            }
                ;
                break;
            case 'pie':
            {
                return {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        showInLegend: true,
                        dataLabels: {
                            enabled: true,
                            //format: '<b>{point.name}</b> ({point.y:,.0f})',
                            formatter: function () {
                                //var x = (typeof  this.x == "undefined") ? this.point.name : this.x;
                                var y = (typeof  this.y == "undefined") ? this.point.name : this.y;
                                /*if (Ax.isDate(x)) {
                                    x = Ax.parseDate(x, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }*/
                                if (Ax.isDate(y)) {
                                    y = Ax.parseDate(y, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }
                                /*if(Ax.isString(x)){
                                    x = x.length > 6 ? x.substr(0, 6) + '...' : x;
                                }*/
                                //return x + ' (' + y + ')';
                                return y;
                            }
                        }
                    }
                };
            }
                ;
                break;
            case 'solidgauge':
            {
                return {
                    solidgauge: {
                        dataLabels: {
                            y: 5,
                            borderWidth: 0,
                            useHTML: true,
                            //format: '<b>{point.name}</b> ({point.y:,.0f})',
                            formatter: function () {
                               // var x = (typeof  this.x == "undefined") ? this.point.name : this.x;
                                var y = (typeof  this.y == "undefined") ? this.point.name : this.y;
                                /*if (Ax.isDate(x)) {
                                    x = Ax.parseDate(x, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }*/
                                if (Ax.isDate(y)) {
                                    y = Ax.parseDate(y, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }
                                /*if(Ax.isString(x)){
                                    x = x.length > 6 ? x.substr(0, 6) + '...' : x;
                                }*/
                                //return x + ' (' + y + ')';
                                return y;
                            }
                        }
                    }
                };
            }
                ;
                break;
            case 'area':
            {
                return {
                    area: {
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null,
                        dataLabels: {
                            enabled: true,
                            //format: '<b>{point.name}</b> ({point.y:,.0f})',
                            formatter: function () {
                                //var x = (typeof  this.x == "undefined") ? this.point.name : this.x;
                                var y = (typeof  this.y == "undefined") ? this.point.name : this.y;
                                /*if (Ax.isDate(x)) {
                                    x = Ax.parseDate(x, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }*/
                                if (Ax.isDate(y)) {
                                    y = Ax.parseDate(y, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }
                                /*if(Ax.isString(x)){
                                    x = x.length > 6 ? x.substr(0, 6) + '...' : x;
                                }
                                return x + ' (' + y + ')';*/
                                return y;
                            },
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            softConnector: true
                        }
                    }
                }
            }
                ;
                break;
            case 'areaspline':
            {
                return {
                    area: {
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null,
                        dataLabels: {
                            enabled: true,
                            //format: '<b>{point.name}</b> ({point.y:,.0f})',
                            formatter: function () {
                                //var x = (typeof  this.x == "undefined") ? this.point.name : this.x;
                                var y = (typeof  this.y == "undefined") ? this.point.name : this.y;
                                /*if (Ax.isDate(x)) {
                                    x = Ax.parseDate(x, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }*/
                                if (Ax.isDate(y)) {
                                    y = Ax.parseDate(y, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }
                                /*if(Ax.isString(x)){
                                    x = x.length > 6 ? x.substr(0, 6) + '...' : x;
                                }
                                return x + ' (' + y + ')';*/
                                return y;
                            },
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            softConnector: true
                        }
                    }
                }
            }
                ;
                break;
            default:
            {
                return {
                    series: {
                        dataLabels: {
                            enabled: true,
                            //format: '<b>{point.name}</b> ({point.y:,.0f})',
                            formatter: function () {
                                //var x = (typeof  this.x == "undefined") ? this.point.name : this.x;
                                var y = (typeof  this.y == "undefined") ? this.point.name : this.y;
                                /*if (Ax.isDate(x)) {
                                    x = Ax.parseDate(x, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }*/
                                if (Ax.isDate(y)) {
                                    y = Ax.parseDate(y, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                                }
                                /*if(Ax.isString(x)){
                                    x = x.length > 6 ? x.substr(0, 6) + '...' : x;
                                }*/
                                //return x + ' (' + y + ')';
                                return y;
                            },
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            softConnector: true
                        }
                    }
                };
            }
        }
    };
    this.generateChartOptions = function (options) {
        var config = options && options.config ? options.config : null;
        var _this = this;
        this.chartTitle = config && config['title'] ? config['title'] : undefined;
        this.height = config && config['height'] ? config['height'] : undefined;
        this.chartContainer = config && config['renderTo'] ? config['renderTo'] : this.chartContainer;
        this.chartType = config && config['chartType'] ? config['chartType'] : (this.chartType ? this.chartType : Ax.Charts.chartDefaultOptions.getDefaultOption('defaultType'));
        this.initChartType(this.chartType);
        this.chartOptions = {
            chart: {
                renderTo: this.chartContainer,
                height: this.height,
                type: this.chartType,
                options3d: this.options3d,
                zoomType: this.zoomType,
                panning: true,
                panKey: 'shift',
                animation: parseFloat(Ax.Highcharts.getCurrentVersion().version) >= 4 ? {
                    duration: 500,
                    easing: 'easeOutBounce'
                } : {
                    duration: 500,
                    easing: 'easeOutQuad'
                },
                backgroundColor: 'white'
            },
            title: {
                text: this.chartTitle,
            },
            tooltip: {
                xDateFormat: Ax.Charts.chartDefaultOptions.dateFormat,
                crosshairs: false,
                shared: false,
                followPointer: false,
                formatter: function () {
                    var serieName = '';
                    var xName = '';
                    var yName = '';
                    var serieObj = null;
                    if (this.series) {
                        serieObj = this.series;
                    } else if (this.points) {
                        serieObj = this.points[0].series;
                    }

                    if (serieObj) {
                        serieName = serieObj.name;
                        if (serieObj.chart.axes && serieObj.chart.axes[0].options.title) {
                            xName = serieObj.chart.axes[0].options.title.text
                        }
                        if (serieObj.chart.axes && serieObj.chart.axes[1].options.title) {
                            yName = serieObj.chart.axes[1].options.title.text
                        }
                    }

                    var tooltip = serieName ? '<b>' + serieName + '</b><br/>' : '';
                    var x = (typeof  this.x == "undefined") ? this.point.name : this.x;
                    var y = (typeof  this.y == "undefined") ? this.point.name : this.y;
                    if (Ax.isDate(x)) {
                        x = Ax.parseDate(x, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                    }
                    if (Ax.isDate(y)) {
                        y = Ax.parseDate(y, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                    }
                    if (xName && yName) {
                        return tooltip + xName + ': ' + x + '<br/>' + yName + ': ' + y;
                    }
                    return tooltip + x + ': ' + y;
                }
            },
            subtitle: {
                text: config && config['subtitle'] ? config['subtitle'] : undefined,
            },
            numericSymbols: config && config['numericSymbols'] ? config['numericSymbols'] : Ax.Charts.chartDefaultOptions.getDefaultOption('numericSymbols'),
            xAxis: _this.xAxisConfig,
            exporting: {
                buttons: {
                    contextButton: {
                        text: Ax.Charts.chartDefaultOptions.getLabel('export')
                        //symbolFill: 'white'
                    }
                }
            },
            yAxis: _this.yAxisConfig,
            plotOptions: this.generatePlotOptions(config),
            legend: config && config['legend'] ? config['legend'] : Ax.Charts.chartDefaultOptions.getDefaultOption('legend'),
            series: this.series
        }
        this.sortCategories();
        this.loadChartData();
    };
    this.setContainer = function (container) {
        if (this.chartOptions) {
            this.chartOptions.chart.renderTo = container;
        }
        this.chartContainer = container;
    };
    this.setChartOption = function (property, value) {
        if (this.chartOptions) {
            this.setPropertyValue(this.chartOptions, property, value);
        }
    };
    this.setPropertyValue = function (baseObject, attr, value) {
        baseObject = baseObject ? baseObject : this;
        var attrList = attr.split('.');
        if (attrList.length == 1) {
            baseObject[attrList[0]] = value;
            return baseObject;
        }
        if (typeof baseObject[attrList[0]] == 'undefined') {
            baseObject[attrList[0]] = {};
        }
        var nextProp = attr.replace(attrList[0], '').replace('.', '');
        return this.setPropertyValue(baseObject[attrList[0]], nextProp, value);
    };
    this.setSeriesPropertyValue = function (attr, value) {
        if (this.series) {
            for (var i = 0; i < this.series.length; i++) {
                this.setPropertyValue(this.series[i], attr, value);
            }
            this.loadChartData();
        }
    };
    this.setSeriesType = function (type) {
        if (this.series) {
            /*for (var i = 0; i < this.series.length; i++) {
             this.series[i].type = type;
             }*/
            this.loadChartData();
        }
    };
    this.initChartType = function (type) {
        this.zoomType = 'xy';
        this.chartType = type;
        switch (type) {
            case 'pie3d':
            {

                this.chartType = 'pie';

            }
                ;
                break;
            case 'arearange':
            {
                this.zoomType = 'x';
                this.chartType = type;
            }
                ;
                break;
            default:
            {

            }
                ;
                break;
        }
        var rotation = this.enableRotation(this.chartType);
        if (this.chartOptions) {
            this.chartOptions.chart.type = this.chartType;
            this.chartOptions.plotOptions = this.generatePlotOptions({chartType: type});
        }
        return {
            rotationData: rotation,
            chartType: this.chartType
        };
    };
    this.setChartType = function (type) {
        return this.initChartType(type);
    };
    this.setBackgroundColor = function (backgroundColor) {
        backgroundColor = backgroundColor ? backgroundColor : 'white';
        if (this.chartOptions) {
            this.chartOptions.chart.backgroundColor = backgroundColor;
        }
    }
    this.init = function (param) {
        if (param && typeof param == 'object') {
            if (param.config) {
                var config = typeof param.config == 'object' ? param.config : null;
                if (config && config.x) {
                    this.initAxis('xAxisConfig', config.x);
                }
                if (config && config.y) {
                    this.initAxis('yAxisConfig', config.y);
                }

            }
            if (param.data) {
                this.setData(param.data);
            }
            this.generateChartOptions(param);
        }
        return this;
    };

    this.clearCategories = function () {
        this.categoriesOnX = this.categoriesOnY = false;
        this.setXAxis('categories', undefined);
        this.setYAxis('categories', undefined);
    }

    this.getXAxis = function (attr) {
        if (attr && typeof attr == 'string') {
            return this.xAxisConfig[attr];
        }
        return this.xAxisConfig;
    };
    this.getYAxis = function (attr) {
        if (attr && typeof attr == 'string') {
            return this.yAxisConfig[attr];
        }
        return this.yAxisConfig;
    };
    this.setXAxis = function (attr, value) {
        if(attr == 'categories')
        if (typeof attr == 'string') {
            this.xAxisConfig[attr] = value;
        } else if (typeof attr == 'object' && !value) {
            for (var i in attr) {
                this.setXAxis(i, attr[i]);
            }
        }
        return (typeof attr == 'string') ? this.xAxisConfig[attr] : this.xAxisConfig;
    };
    this.setYAxis = function (attr, value) {
        if (typeof attr == 'string') {
            this.yAxisConfig[attr] = value;
        } else if (typeof attr == 'object' && !value) {
            for (var i in attr) {
                this.setYAxis(i, attr[i]);
            }
        }
        return (typeof attr == 'string') ? this.yAxisConfig[attr] : this.yAxisConfig;
    };
    this.getData = function () {
        return this.data;
    };
    this.setData = function (data, reader, filter) {
        this.series = [];
        this.clearCategories();
        this.parseChartData(data, reader, filter);
        this.loadChartData();
    };
    this.addSerie = function (data, reader, filter) {
        this.readCategories(data, reader);
        this.parseChartData(data, reader, filter);
    };
    this.clearFilters = function(){
        this.filters = {};
    }
    this.buildFilters = function(data, filters){
        if(!this.filters){
            this.clearFilters();
        }
        for(var i = 0 ; i < filters.length ; i ++){
            var filter = {
                name: '',
                valueField: '',
                displayField: '',
                values: []
            }
            if(typeof filters[i] == 'string'){
                filter.name = filters[i];
                filter.valueField = filters[i];
                filter.displayField = filters[i];
            }else if(typeof filters[i] == 'object' && filters[i].value){
                filter.name = filters[i].value;
                filter.valueField = filters[i].value;
                filter.displayField = filters[i].display ? filters[i].display : filters[i].value;
            }
            if(!this.filters[filter.name]){
                this.filters[filter.name] = filter;
            }
            for(var j = 0 ; j < data.length ; j ++){
                if(typeof data == 'object' && typeof data[filter.valueField] != 'undefined'){
                    var value = [];
                    value[0] = data[filter.valueField];
                    value[1] = typeof data[filter.displayField] != 'undefined' ? data[filter.displayField] : data[filter.valueField];
                    this.filters[filter.name].values.push(value);
                }
            }
        }
        return this.filters;
    };
    this.readCategories = function (data, reader) {
        var categories = [];
        if (this.categoriesOnX || this.categoriesOnY) {
            categories = this.categoriesOnX ? this.getXAxis('categories') : this.getYAxis('categories');
        }
        if (data) {
            if (typeof data == 'object') {
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        this.readCategories(data[i]);
                    }
                } else {
                    var xSource = this.getXAxis('source') ? this.getXAxis('source') : 0;
                    var ySource = this.getYAxis('source') ? this.getYAxis('source') : 1;
                    if (reader) {
                        if(reader.x && typeof reader.x == 'string'){
                            xSource = reader.x;
                        }else if(reader.x && typeof reader.x == 'object'){
                            xSource = reader.x.source;
                        }
                        if(reader.y && typeof reader.y == 'string'){
                            ySource = reader.y;
                        }else if(reader.y && typeof reader.y == 'object'){
                            ySource = reader.y.source;
                        }
                    }
                    var xIsDate = false;
                    var yIsDate = false;
                    for (var index = 0; index < data.data.length; index++) {
                        var xData = data.data[index][xSource] ? data.data[index][xSource] : data.data[index][0] ? data.data[index][0] : 0;
                        var yData = data.data[index][ySource] ? data.data[index][ySource] : data.data[index][1] ? data.data[index][1] : 0;
                        var xIsNumber = Ax.isNumber(xData);
                        var yIsNumber = Ax.isNumber(yData);
                        var xIsDate = Ax.isDate(xData);
                        var yIsDate = Ax.isDate(yData);
                        if (!xIsNumber && !yIsNumber) {
                            return Ax.Charts.throwError('NanError', {
                                data: data.data[index],
                                xaxis: xSource,
                                yayis: ySource
                            });
                        }
                        if (typeof xData == 'string' && !xIsNumber) {
                            this.categoriesOnX = true;
                            /*if(Ax.isDate(xData)){
                             xData = Ax.parseDate(xData, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                             }*/
                            categories.push(xData);
                        }
                        if (typeof yData == 'string' && !this.categoriesOnX && !yIsNumber) {
                            this.categoriesOnY = true;
                            /*if(Ax.isDate(yData)){
                             yData = Ax.parseDate(yData, Ax.Charts.chartDefaultOptions.getLabel('categoryDateFormat'));
                             }*/
                            categories.push(yData);
                        }
                    }
                    if (this.categoriesOnX || this.categoriesOnY) {
                        if (this.categoriesOnX) {
                            this.setXAxis('categories', categories);
                            if (!reader.x.notSort)
                                this.sortCategories();
                        } else if (this.categoriesOnY) {
                            this.setYAxis('categories', categories);
                            this.sortCategories();
                        }

                        return this.categoriesOnX ? this.getXAxis('categories') : this.getYAxis('categories');
                    }
                }
            }
        }
        return null;
    }
    this.sortCategories = function () {
        if (this.categoriesOnX || this.categoriesOnY) {
            var categories = this.categoriesOnX ? this.getXAxis('categories') : this.getYAxis('categories');
            //Removing categories duplication
            var newCategories = [];
            var marks = {};
            for (var i = 0; i < categories.length; i++) {
                if (!marks[i]) {
                    for (var j = i + 1; j < categories.length; j++) {
                        if (categories[i] == categories[j]) {
                            marks[j] = true;
                        }
                    }
                    newCategories.push(categories[i]);
                }
            }
            categories = newCategories.sort();

            if (this.categoriesOnX) {
                this.setXAxis('categories', categories);
            } else if (this.categoriesOnY) {
                this.setYAxis('categories', categories);
            }
            var rotation = 0;
            var align = 'center';
            if(categories.length > 10){
                rotation = -45;
                align = 'right';
            }
            if (this.categoriesOnX && rotation != 0) {
                this.setXAxis('labels', {
                    rotation: rotation,
                    align: align
                });
            } else if (this.categoriesOnY && rotation != 0) {
                this.setYAxis('labels', {
                    rotation: rotation,
                    align: align
                });
            }
            return this.categoriesOnX ? this.getXAxis('categories') : this.getYAxis('categories');
        }
        return null;
    };
    this.fixSeries = function () {
        if (this.categoriesOnX || this.categoriesOnY) {
            var categories = this.categoriesOnX ? this.getXAxis('categories') : this.getYAxis('categories');
            //removiendo categorias duplicadas
            var newCategories = [];
            var marks = {};
            for (var i = 0; i < categories.length; i++) {
                if (!marks[i]) {
                    for (var j = i + 1; j < categories.length; j++) {
                        if (categories[i] == categories[j]) {
                            marks[j] = true;
                        }
                    }
                    newCategories.push(categories[i]);
                }
            }
            categories = newCategories;
            //fin removiendo categorias duplicadas
            for (var i = 0; i < this.series.length; i++) {
                var serie = this.series[i].data;
                var cloneSerie = [];
                var sumCategories = {};
                for (var j = 0; j < categories.length; j++) {
                    if(!sumCategories[categories[j]]){
                        sumCategories[categories[j]] = {
                            index: undefined,
                            value: 0
                        };
                    }
                    var founded = false;
                    for (var z = 0; z < serie.length; z++) {
                        if (this.categoriesOnX) {
                            if (serie[z][0] == categories[j]) {
                                sumCategories[categories[j]].value += parseFloat(serie[z][1]);
                                if(typeof sumCategories[categories[j]].index != 'undefined'){
                                    cloneSerie[sumCategories[categories[j]].index][1] = sumCategories[categories[j]].value;
                                }else{
                                    sumCategories[categories[j]].index = cloneSerie.length;
                                    cloneSerie.push([categories[j], sumCategories[categories[j]].value]);
                                }
                                founded = true;
                            }
                        } else if (this.categoriesOnY) {
                            if (serie[z][1] == categories[j]) {
                                sumCategories[categories[j]].value += parseFloat(serie[z][0]);
                                if(typeof sumCategories[categories[j]].index != 'undefined'){
                                    cloneSerie[sumCategories[categories[j]].index][0] = sumCategories[categories[j]].value;
                                }else{
                                    sumCategories[categories[j]].index = cloneSerie.length;
                                    cloneSerie.push([sumCategories[categories[j]].value, categories[j]]);
                                }
                                founded = true;
                            }
                        }
                    }
                    if (!founded) {
                        sumCategories[categories[j]].index = cloneSerie.length;
                        var nullSerie = (this.categoriesOnX) ? [categories[j], sumCategories[categories[j]].value] : [sumCategories[categories[j]].value, categories[j]];
                        cloneSerie.push(nullSerie);
                    }
                }
                this.series[i].data = cloneSerie;
            }
        }
        return this.series;
    };
    this.rotateChart = function (rotationX, rotationY, deep) {
        if (rotationX || rotationY || deep) {
            rotationX = rotationX > this.getChartTypeAttr(this.chartType, 'support3D') ? this.getChartTypeAttr(this.chartType, 'support3D') : rotationX;
            rotationY = rotationY > this.getChartTypeAttr(this.chartType, 'support3D') ? this.getChartTypeAttr(this.chartType, 'support3D') : rotationY;
            this.opt3D = {
                enabled: true,
                alpha: rotationX ? rotationX : 0,
                beta: rotationY ? rotationY : 0,
                deep: deep ? deep : 45
            };
        } else {
            this.opt3D = undefined;
        }
        this.enableRotation(this.chartType);
    };
    this.enableRotation = function (type) {
        if (!this.rotationEnabled(type)) {
            this.opt3D = undefined;
        }
        if (this.chartOptions) {
            this.chartOptions.chart.options3d = this.opt3D;
        }
        return this.opt3D;
    };
    this.rotationEnabled = function (type) {
        return this.getChartTypeAttr(type, 'support3D');
    };
    this.getChartTypeAttr = function (chartType, attr) {
        for (var i = 0; i < this.chartTypes.length; i++) {
            if (this.chartTypes[i].name == chartType) {
                return this.chartTypes[i][attr];
            }
        }
    };
    this.parseChartData = function (data, reader, filter) {
        if (data) {
            if (typeof data == 'object') {
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        this.addSerie(data[i], reader, filter);
                    }
                } else {
                    var serie = [];
                    var xSource = this.getXAxis('source') ? this.getXAxis('source') : 0;
                    var ySource = this.getYAxis('source') ? this.getYAxis('source') : 1;
                    if (reader) {
                        if(reader.x && typeof reader.x == 'string'){
                            xSource = reader.x;
                        }else if(reader.x && typeof reader.x == 'object'){
                            xSource = reader.x.source;
                        }
                        if(reader.y && typeof reader.y == 'string'){
                            ySource = reader.y;
                        }else if(reader.y && typeof reader.y == 'object'){
                            ySource = reader.y.source;
                        }
                    }
                    for (var index = 0; index < data.data.length; index++) {
                        var xData = data.data[index][xSource] ? data.data[index][xSource] : data.data[index][0] ? data.data[index][0] : 0;
                        var yData = data.data[index][ySource] ? data.data[index][ySource] : data.data[index][1] ? data.data[index][1] : 0;
                        serie.push([xData, yData]);
                    }
                    this.series.push({
                        name: data.name,
                        data: serie,
                        color: data.color,
                        reader: {
                            x: xSource,
                            y: ySource
                        }
                    });
                    this.fixSeries();
                }
            } else {

            }
        }
    };
    this.loadChartData = function () {
        if (this.chartOptions) {
            this.chartOptions.series = this.series;
        }
    };
    this.getSeries = function () {
        return this.series;
    };
    this.setSeries = function (series) {
        this.series = series;
    };
    this.getChartOptions = function () {
        return this.chartOptions;
    };
    this.setChartOptions = function (chartOptions) {
        this.chartOptions = chartOptions;
    };
    this.getTheme = function (theme) {
        var themes = Ax.Charts.chartDefaultOptions.getDefaultOption('themes');
        if (theme) {
            return themes[theme];
        } else {
            var themeList = [];
            for (var i in themes) {
                themeList.push([i, themes[i].text, themes[i]]);
            }
            return themeList;
        }
    }
    this.getLabel = function (label, lang) {
        return Ax.Charts.chartDefaultOptions.getLabel(label, lang);
    };
    this.getChartTitle = function () {
        return this.chartTitle;
    };
    this.setChartTitle = function (title) {
        this.chartTitle = title;
        if (this.chartOptions) {
            this.chartOptions.title.text = this.chartTitle;
        }
    };
    this.setXaxisTitle = function (title) {
        this.xAxisConfig.title = {
            text: title
        };
        if (this.chartOptions) {
            this.chartOptions.xAxis.title = this.xAxisConfig.title;
        }
    };
    this.getXaxisTitle = function () {
        return this.xAxisConfig.title!=undefined ? this.xAxisConfig.title.text : 'Eje X';
    };
    this.getYayisTitle = function () {
        return this.yAxisConfig.title!=undefined ? this.yAxisConfig.title.text : 'Eje Y';
    };
    this.setYayisTitle = function (title) {
        this.yAxisConfig.title = {
            text: title
        };
        if (this.chartOptions) {
            this.chartOptions.yAxis.title = this.yAxisConfig.title;
        }
    };
    this.init(params);
}

Ax.EventManager.on('ax-chart-error', function (errObject) {
    if (window.console) {
        console.log(errObject);
    }
    return Ax.Charts.Views.notify(Ax.Charts.chartDefaultOptions.getLabel(errObject.severity), errObject.log, errObject.severity)
})