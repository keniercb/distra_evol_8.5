Ext.define('ClientContract.view.Main', {
    extend: 'Dashboard.view.core.Portlet',
    alias: 'widget.stock-contract-chart',
    initComponent: function () {

        var config = this.config;
        var labels = this.$lang;

        if (config && labels) {

            var chartConfig = config.getColumnDrillDown();
            chartConfig.chartConfig.title.text = 'Eventos Generales';
            chartConfig.chartConfig.yAxis.title.text = 'Total percent market share';
            chartConfig.chartConfig.tooltip = {
                formatter: function () {
                    var point = this.point,
                        s = this.x + ':<b>' + this.y + '% market share</b><br/>';
                    if (point.drilldown) {
                        s += 'Click to view ' + point.category + ' versions';
                    } else {
                        s += 'Click to return to browser brands';
                    }
                    return s;
                }
            };

            chartConfig.chartConfig.credits = {
                text: 'hermes.wordpress.com',
                href: 'http://hermes.wordpress.com',
                style: {
                    cursor: 'pointer',
                    color: '#707070',
                    fontSize: '12px'
                }
            };

            Ext.apply(this, {
                height: 400,
                layout: 'fit',
                margins: '0 5 5 0',
                title: labels.moduleName,
                tools:[{
                    xtype: 'tool',
                    type: 'refresh'
                }]
            });
        }
        this.callParent(arguments);
    }
});
