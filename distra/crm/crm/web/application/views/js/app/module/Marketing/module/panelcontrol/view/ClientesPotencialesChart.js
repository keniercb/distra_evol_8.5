Ext.define('PanelControlMarketing.view.ClientesPotencialesChart', {
    extend: 'PanelControlMarketing.view.CustomPanel',
    alias: 'widget.clientespotschart',
    columnWidth: .5,
    initComponent: function () {
        this.store = Ext.create('PanelControlMarketing.store.ClientesPotenciales');
        this.title = "Clientes potenciales";
        this.chart = Ext.create('Ext.chart.Chart', {
            store: this.store,
            animate: true,
            shadow: true,
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: ['cant'],
                title: false,
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'left',
                fields: ['nombre'],
                title: false,
            }],
            series: [{
                type: 'bar',
                axis: 'bottom',
                highlight: true,
                xField: 'nombre',
                yField: ['cant'],
                tips: {
                    trackMouse: true,
                    width: 350,
                    height: 28,
                    renderer: function(storeItem, item) {
                        var storeItem = item.storeItem,
                            msg = storeItem.get('nombre').toUpperCase() + ' : ' + storeItem.get('cant') + ' Oportunidad<#s#> de venta',
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
