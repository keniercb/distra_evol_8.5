Ext.define('PanelControlMarketing.view.OportunidadDesacuerdoChart', {
    extend: 'PanelControlMarketing.view.CustomPanel',
    alias: 'widget.oportdesacuerdochart',
    columnWidth: .3,
    initComponent: function () {
        var me = this;
        this.store = Ext.create('PanelControlMarketing.store.OportunidadDesacuerdo');

        this.title = "Oportunidades";
        this.chart = Ext.create('Ext.chart.Chart', {
            animate: true,
            store: this.store,
            shadow: true,
            legend: {
                position: 'bottom'
            },
            insetPadding: 20,
            series: [{
                type: 'pie',
                field: 'cant',
                showInLegend: true,
                donut: 35,
                tips: {
                    trackMouse: true,
                    width: 170,
                    height: 28,
                    renderer: function (storeItem) {
                        this.setTitle(storeItem.get('denominacion') + ': ' + me.getPorciento(storeItem.get('cant')));
                    }
                },
                highlight: {
                    segment: {
                        margin: 20
                    }
                },
                label: {
                    field: 'denominacion',
                    display: 'rotate',
                    contrast: true,
                    font: '18px Arial',
                    renderer: function (value,label,storeItem) {
                        return me.getPorciento(storeItem.get('cant'));
                    }
                }
            }]
        });

        this.items = this.chart;

        this.callParent(arguments);
    },
    getPorciento: function (cant) {
        var total = 0;
        this.store.each(function (rec) {
            total += rec.get('cant');
        });
        return Math.round(cant / total * 100) + '%';
    }
});
