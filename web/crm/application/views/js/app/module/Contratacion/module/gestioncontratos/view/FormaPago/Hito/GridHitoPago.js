Ext.define('GestionContrato.view.FormaPago.Hito.GridHitoPago', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.GridHitoPago',
    region: 'center',
    layout: 'column',
    columnWidth: 1,
    autoScroll: true,
    datosLoad: [],
    sinAcciones:false,
    selModel: {mode: 'MULTI'},
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
//         me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.store = Ext.create('Ext.data.Store', {
            storeId: me.hitoStoreId || 'hitoStore',
            grid: me,
            remoteFilter: true,
            fields: ['numero', 'descripcion', 'moneda', 'monto', 'montototal', 'fechafin', 'meses',
                'pago', 'vigencia', 'unidadtiempo', 'idhito', 'idarea', 'nombrearea',
                'indicadores', 'arrayIndicadores', 'idperiodicidad', 'periodicidad', 'fechainicio', 'inicial', 'tienefactura'],
            data: me.dataMedioPago,
            remoteSort: true,
            sorters: [
                {property: 'fechafin', direction: 'ASC'},
                {property: 'numero', direction: 'ASC'},
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarhitoscontrato'}, ModuleMgr.get('GestionContrato')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success',
                    idProperty: 'idhito'
                }
            },
            cambio: false,
            originalValue: '[]',
            listeners: {
                update: function (yo) {
                    Ext.each(me.up('window').extrafields, function (value, index) {
                        if (me.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase())) {
                            if (!me.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase()).introducidoManual)
                                me.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase()).validate();
                        }
                    });
                    if (me.up('window').formaPago)
                        if (me.up('window').formaPago.indicadores)
                            if (me.up('window').formaPago.indicadores.getStore().getCount() == 0)
                                me.up('window').formaPago.indicadores.setDisabled(yo.getCount() > 0);
                }
            }
        });

        me.columns = [
            {
                text: me.etiquetas.lbNumber,
                xtype: 'templatecolumn',
                minWidth: 48,
                width: 48,
                tpl: new Ext.XTemplate('<div>{numero}</div>')
            }, {
                text: me.etiquetas.lbDescripcion,
                xtype: 'templatecolumn',
                minWidth: 35,
                flex: 1,
                tpl: new Ext.XTemplate('<div style="text-align: justify;white-space: normal">{descripcion}</div>')
            }, {
                text: me.etiquetas.lbFechaEstimada,
                align: 'center',
                width: 100,
                xtype: 'templatecolumn',
                tpl: new Ext.XTemplate('<div>{fechafin}</div>')
            }, {
                text: me.etiquetas.lbTotalAmount,
                width: 100,
                xtype: 'templatecolumn',
                align: 'center',
                tpl: new Ext.XTemplate('<div>{montototal:this.formatChange}</div>', {
                    formatChange: function (v) {
                        return Ext.util.Format.currency(v);
                    }
                })
            }, {
                text: me.etiquetas.lbMontos,
                width: 120,
                xtype: 'templatecolumn',
                align: 'center',
                tpl: new Ext.XTemplate('<div><tpl for="pago">',
                    '<div style = "float:left;text-align: right">',
                    '<b>{moneda}:</b><span>{monto:this.formatChange}</span>',
                    '</div><br>',
                    '</tpl></div>', {
                        formatChange: function (v) {
                            return Ext.util.Format.currency(v);
                        }
                    })
            }
        ];

        me.btnAdd = Ext.create('Ext.Button', {
            iconCls: 'icondistra-adicionar icon-medium',
            text: me.etiquetas.lbAdd,
            action: 'addhito',
            tooltip: me.etiquetas.lbAdd + ' ' + me.etiquetas.lbHitoPago.toLocaleLowerCase()
        });

        me.btnMod = Ext.create('Ext.Button', {
            iconCls: 'icondistra-modificar icon-medium',
            action: 'edithito',
            disabled: true,
            text: me.etiquetas.lbMod,
            tooltip: me.etiquetas.lbMod + ' ' + me.etiquetas.lbHitoPago.toLocaleLowerCase()
        });

        me.btnDel = Ext.create('Ext.Button', {
            iconCls: 'icondistra-eliminar icon-medium',
            action: 'delhito',
            disabled: true,
            text: me.etiquetas.lbDel,
            tooltip: me.etiquetas.lbDel + ' ' + me.etiquetas.lbHitoPago.toLocaleLowerCase() + ' <b>(DEL)</b>'
        });

        me.btnReplicar = Ext.create('Ext.Button', {
            iconCls: 'icondistra-duplicar icon-medium',
            action: 'replicarhito',
            disabled: true,
            text: me.etiquetas.lbReplicar,
            tooltip: me.etiquetas.lbReplicar + ' ' + me.etiquetas.lbHitoPago.toLocaleLowerCase()
        });

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            hidden: me.sinAcciones,
            items: [me.btnAdd, me.btnMod, me.btnDel, me.btnReplicar]
        });


        me.callParent();
    }
});
