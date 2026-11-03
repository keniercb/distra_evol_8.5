Ext.define('Sales.view.Pie', {
    extend: 'Chart.ux.Highcharts',
    requires: ['Sales.store.ContractType'],
    alias: 'widget.sales-pie-chart',
    height: 400,
    margins: '0',
    frame: false,
    border: false,
    store: 'Sales.store.ContractType',

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
