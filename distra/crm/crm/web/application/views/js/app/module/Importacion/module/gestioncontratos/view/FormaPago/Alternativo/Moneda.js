Ext.define('GestionContratoImportacion.view.FormaPago.Alternativo.Moneda', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.Monedaimportacion',
    requires: [
        'Ext.ux.CmbSelectField',
        'GestionContratoImportacion.store.Moneda',
        'GestionContratoImportacion.store.Tasa'
    ],

    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.frame = false;
        me.border = 0;
        me.layout = 'column';
        me.columnWidth = 1;
        me.bodyStyle = 'background:#DFE9F6;';
        me.margin = '5 0 5 0';
        me.defaults = {
            bodyStyle: 'background:#DFE9F6;',
            //margin: '0 5 0 5',
            //columnWidth: 1,
            layout: 'column',
            border: false
        };

        me.moneda = Ext.create('Ext.form.ComboBox', {
            store: Ext.create('GestionContratoImportacion.store.Moneda'),
            displayField: 'codigoiso',
            valueField: 'idmonedaentidad',
            valueToolTip: 'nombremoneda',
            enableKeyEvents: true,
            forceSelection: true,
            queryMode: 'local',
            columnWidth: 0.35,
            margin: '0 5 0 0',
            emptyText: me.etiquetas.lbSeleccione,
            context: 'monedacontrato'
        });
        me.tasa = Ext.create('Ext.form.ComboBox', {
            store: Ext.create('GestionContratoImportacion.store.Tasa'),
            displayField: 'nombretasa',
            valueField: 'idtasa',
            labelToolTip: me.etiquetas.lbfactorconversion,
            valueToolTip: 'factordeconversion',
            enableKeyEvents: true,
            forceSelection: true,
            columnWidth: 0.35,
            queryMode: 'local',
            margin: '0 5 0 0',
            disabled: true,
            hidden: false,
            emptyText: me.etiquetas.lbSeleccione,
            context: 'tasacontrato'
        });
        me.montoAlternativo = Ext.create('Ext.ux.MoneyField', {
            name: 'montoalternativo',
            columnWidth: 0.3,
            disabled: true,
            minValue: 0,
            value: 0,
            decimalPrecision: 10,
            flex: 1
        });
        me.btnDelMoneda = Ext.create('Ext.button.Button', {
            iconCls: 'icondistra-eliminar icon-medium',
            tooltip: me.etiquetas.lbDel + ' ' + me.etiquetas.lbMoneda.toLowerCase(),
            margin: '3 0 0 5',
            action: 'delmoneda',
            width: 20,
            height: 20,
            disabled: false,
            border: 0
        });
        me.items = [me.moneda, me.tasa, me.montoAlternativo, me.btnDelMoneda];

        me.callParent();
    },
    reset:function(){
        this.moneda.reset();
        this.tasa.reset();
        this.tasa.disable();
        this.montoAlternativo.reset();
    }
});
