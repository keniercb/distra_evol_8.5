Ext.define('PanelControlMarketing.view.OportunidadesMesChart', {
    extend: 'PanelControlMarketing.view.CustomPanel',
    alias: 'widget.oportmeschart',
    columnWidth: .7,
    initComponent: function () {
        this.store = Ext.create('PanelControlMarketing.store.OportunidadesMes');
        this.title = "Oportunidades de venta";
        this.chart = Ext.create('Ext.chart.Chart', {
            store: this.store,
            animate: true,
            shadow: true,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['cant'],
                title: false,
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['nombremes'],
                title: false
            }],
            series: [{
                type: 'line',
                axis: 'left',
                gutter: 80,
                xField: 'mes',
                yField: ['cant'],
                highlight: {
                    size: 7,
                    radius: 7
                },
                smooth: true,
                fill: true,
                tips: {
                    trackMouse: true,
                    titleAlign: 'center',
                    width:250,
                    renderer: function (klass, item) {
                        var storeItem = item.storeItem,
                            msg = storeItem.get('nombremes').toUpperCase() + ' : ' + storeItem.get('cant') + ' Oportunidad<#s#> de venta',
                            s = storeItem.get('cant') <= 1 ? '' : 'es';
                        this.setTitle(msg.replace(/<#s#>/g, s));
                    }
                }
            }]
        });

        this.items = this.chart;

        this.callParent(arguments);
    }
});
