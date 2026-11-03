Ext.define('Range.view.Pie', {
    extend: 'Chart.ux.Highcharts',
    requires: ['Range.store.ContractType'],
    alias: 'widget.range-pie-chart',
    height: 350,
    margins: '0',
    frame: false,
    border: false,
    store: 'Range.store.ContractType',

    initComponent: function () {
        var config = this.config;
        var labels = this.$lang;

        if (config && labels) {
            var cfg = config.getPie();
            cfg.chartConfig.title.text = labels.chartTitle;
            cfg.chartConfig.subtitle.text = labels.chartSubTitle;
            cfg.chartConfig.tooltip = {
                formatter: function () {
                    return [
                        '<b>', this.point.name, '</b><br/>',
                        'Cantidad: ' , this.y
                    ].join('');
                }
            };
            Ext.apply(this, cfg);
        }
        this.callParent(arguments);
    }
});
