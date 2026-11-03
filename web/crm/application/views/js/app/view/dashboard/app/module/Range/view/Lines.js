Ext.define('Range.view.Lines', {
    extend: 'Chart.ux.Highcharts',
    requires: ['Range.store.DateContractType'],
    alias: 'widget.range-line-chart',
    height: 350,
    margins: '0',
    frame: false,
    border: false,
    store: 'Range.store.DateContractType',
    initComponent: function () {
        var me = this;
        var config = this.isContained.config;
        var labels = this.isContained.$lang;

        if (config && labels) {
            var cfg = config.getLines();
            // cfg.chartConfig.xAxis.type = 'datetime';
            // cfg.chartConfig.xAxis.formatter = function(){
            //     console.log(this)
            // };
            cfg.series[0].name = labels.chartFirstSerieName;
            cfg.series[1].name = labels.chartSecondSerieName;
            cfg.chartConfig.yAxis.title.text = labels.chartYAxisTitle;
            //cfg.chartConfig.credits.text = 'crm.xetid.cu';
            //cfg.chartConfig.credits.href = 'http://crm.xetid.cu';
            Ext.apply(this, cfg);
        }
        this.callParent(arguments);
    }
});
