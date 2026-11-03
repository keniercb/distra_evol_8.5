Ext.define('GestionContratoImportacion.view.Grafica', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.graficaimportacion',
    require: (['Ext.Window', 'Ext.layout.container.Fit', 'Ext.fx.target.Sprite', 'Ext.window.MessageBox']),
    legend: {
        position: 'bottom'
    },
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['idcontrato', 'numeroContrato', 'montos', 'Ejecutado', 'No Ejecutado'],
            data: []
        });

        function mostrarTooltip(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        this.callParent();
    },

    axes: [{
        type: 'Numeric',
        position: 'left',
        fields: ['Ejecutado', 'No Ejecutado'],
        label: {
            renderer: Ext.util.Format.numberRenderer('0,100')
        },
        title: 'Monto(s)',
        grid: true,
        minimum: 0
    }, {
        type: 'Category',
        position: 'bottom',
        fields: ['numeroContrato'],
        title: 'Contrato(s)'
    }],
    series: [{
        type: 'column',
        axis: 'left',
        highlight: true,
        tips: {
            trackMouse: true,
            width: 180,
            height: 28,
            renderer: function (storeItem, item) {
                this.setTitle(item.yField + ': ' + Ext.util.Format.currency(storeItem.get(item.yField)) + ' $');
            }
        },
        xField: 'numeroContrato',
        yField: ['Ejecutado', 'No Ejecutado']
    }]
});

