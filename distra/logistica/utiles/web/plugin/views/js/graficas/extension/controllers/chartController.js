Ax.ns('Ax.Charts.Controllers');
Ax.Charts.Controllers.Chart = function (params) {
    this.modelCls = Ax.Charts.Models.Chart;
    this.modelInstance = new this.modelCls(params);
    this.getChartOptions = function (config) {
        return this.modelInstance.getChartOptions();
    };
    this.setChartType = function (type) {
        return this.modelInstance.setChartType(type);
    }
    this.setChartContainer = function (container) {
        this.modelInstance.setContainer(container);
    };
    this.setData = function (data, reader) {
        this.modelInstance.setData(data, reader);
    };
    this.getChartTypes = function (asSimpleArray) {
        return this.modelInstance.getChartTypes(asSimpleArray);
    };
    this.addSerie = function (serie) {
        return this.modelInstance.addSerie(serie);
    };
    this.getXSource = function () {
        return this.modelInstance.getXAxis('source') ? this.modelInstance.getXAxis('source') : 0;
    };
    this.getYSource = function () {
        return this.modelInstance.getYAxis('source') ? this.modelInstance.getYAxis('source') : 1;
    };
    this.rotateChart = function (rotation) {
        this.modelInstance.rotateChart(rotation.x, rotation.y, rotation.deep);
    }
    this.rotationEnabled = function (type) {
        return this.modelInstance.rotationEnabled(type);
    };
    this.getTheme = function (theme) {
        return this.modelInstance.getTheme(theme);
    };
    this.getThemeList = function () {
        return this.modelInstance.getTheme();
    };
    this.getLabel = function (label, lang) {
        return this.modelInstance.getLabel(label, lang);
    };
    this.getChartTitle = function () {
        return this.modelInstance.getChartTitle();
    };
    this.setChartTitle = function (title) {
        return this.modelInstance.setChartTitle(title);
    };
    this.getXaxisTitle = function () {
        return this.modelInstance.getXaxisTitle();
    };
    this.getYayisTitle = function () {
        return this.modelInstance.getYayisTitle();
    };
    this.setXaxisTitle = function (title) {
        return this.modelInstance.setXaxisTitle(title);
    };
    this.setYayisTitle = function (title) {
        return this.modelInstance.setYayisTitle(title);
    };
    this.setBackgroundColor = function (backgroundColor) {
        return this.modelInstance.setBackgroundColor(backgroundColor);
    };
    this.setChartOption = function (property, value) {
        return this.modelInstance.setChartOption(property, value);
    };
    this.setSeriesPropertyValue = function (property, value) {
        return this.modelInstance.setSeriesPropertyValue(property, value);
    };
}