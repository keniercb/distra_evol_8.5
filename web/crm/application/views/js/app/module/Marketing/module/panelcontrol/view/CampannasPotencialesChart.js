Ext.define('PanelControlMarketing.view.CampannasPotencialesChart', {
    extend: 'PanelControlMarketing.view.CustomPanel',
    alias: 'widget.clientespotschart',
    columnWidth: .5,
    initComponent: function () {
        this.store = Ext.create('PanelControlMarketing.store.CampannasPotenciales');
        this.title = "Campañas exitosas";
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
                fields: ['denominacion'],
                title: false
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
                            msg = storeItem.get('denominacion').toUpperCase() + ' : ' + storeItem.get('cant') + "<#cliente#>",
                            cliente = storeItem.get('cant') <= 1 ? " Cliente potencial" : " Clientes potenciales";
                        this.setTitle(msg.replace(/<#cliente#>/g, cliente));
                    }
                }
            }]
        });

        this.items = this.chart;

        this.callParent(arguments);
    }
});
