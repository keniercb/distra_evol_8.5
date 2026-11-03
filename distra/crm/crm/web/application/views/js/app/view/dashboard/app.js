Ext.Loader.setConfig({
    enabled: true,
    disableCaching: true, // For debug only
    paths: {
        // 'Chart' : HOME + '/highcharts_extjs4'     // For website
        'Chart.ux': '../../core/utils/components/'
    }
});

Ext.require('Chart.ux.Highcharts');
Ext.require('Chart.ux.Highcharts.Serie');
Ext.require('Chart.ux.Highcharts.AreaRangeSerie');
Ext.require('Chart.ux.Highcharts.AreaSerie');
Ext.require('Chart.ux.Highcharts.AreaSplineRangeSerie');
Ext.require('Chart.ux.Highcharts.AreaSplineSerie');
Ext.require('Chart.ux.Highcharts.BarSerie');
Ext.require('Chart.ux.Highcharts.BoxPlotSerie');
Ext.require('Chart.ux.Highcharts.BubbleSerie');
Ext.require('Chart.ux.Highcharts.ColumnRangeSerie');
Ext.require('Chart.ux.Highcharts.ColumnSerie');
Ext.require('Chart.ux.Highcharts.ErrorBarSerie');
Ext.require('Chart.ux.Highcharts.FunnelSerie');
Ext.require('Chart.ux.Highcharts.GaugeSerie');
Ext.require('Chart.ux.Highcharts.LineSerie');
Ext.require('Chart.ux.Highcharts.PieSerie');
Ext.require('Chart.ux.Highcharts.RangeSerie');
Ext.require('Chart.ux.Highcharts.ScatterSerie');
Ext.require('Chart.ux.Highcharts.SplineSerie');
Ext.require('Chart.ux.Highcharts.WaterfallSerie');
Ext.require('Chart.ux.Highcharts.PyramidSerie');


Ext.override(Ext.data.proxy.Ajax, {
    getMethod: function (request) {
        return 'POST';
    }
});

Ext.ns("Dashboard");

Ext.HMVCApplication({
    name: 'Dashboard',
    extend: 'Ext.app.BundledApplication',
    autoCreateViewport: true,
    globalConfig: true,
    appFolder: 'app',
    controllers: ['AppCntrl'],
    modules: ['Sales', 'Clients', 'State', 'Range'],
    init: function () {
        this.on('beforeloadModule', function (className, depth, parentModule) {
            //console.log(className, depth, parentModule);
            return true;
        })
    },
    launch: function () {

    }
});
