Ext.define('Sales.view.Lines', {
    extend: 'Chart.ux.Highcharts',
    requires: ['Sales.store.DateContractType'],
    alias: 'widget.sales-line-chart',
    height: 300,
    margins: '0',
    frame: false,
    border: false,
    store: 'Sales.store.DateContractType',
    initComponent: function () {
        var me = this;
        var config = this.isContained.config;
        var labels = this.isContained.$lang;

        if (config && labels) {
            var cfg = config.getLines();
            cfg.chartConfig.xAxis.type = 'datetime';
            cfg.series[0].name = labels.chartFirstSerieName;
            cfg.series[1].name = labels.chartSecondSerieName;
            cfg.chartConfig.yAxis.title.text = labels.chartYAxisTitle;
            cfg.chartConfig.credits.text = 'crm.xetid.cu';
            cfg.chartConfig.credits.href = 'http://crm.xetid.cu';
            Ext.apply(this, cfg);
        }
        this.callParent(arguments);
    }
});
