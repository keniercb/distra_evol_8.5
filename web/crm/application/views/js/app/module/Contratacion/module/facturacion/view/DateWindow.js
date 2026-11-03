Ext.define('Facturacion.view.DateWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.fac_datewindow',
    margin: false,
    width: 250,
    height: 120,
    closable: true,
    closeAction: 'destroy',
    layout: 'fit',
    modal: true,
    resizable: false,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.titleFechaFin;

        me.createBody();

        me.callParent();
    },
    createBody: function () {
        var me = this;

        me.idhito = Ext.create('Ext.form.field.Hidden', {
            name: 'idhito'
        });

        me.fechaestimada = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaNueva,
            name: 'fechafin',
            allowBlank: false,
            flex: 1,
            listeners: {
                render: function (field) {
                    field.fireEvent('change', field);
                }
            }
        });

        me.form = Ext.create('Ext.form.Panel', {
            bodyStyle: 'background:#DFE9F6; padding:5px',
            fieldDefaults: {
                labelAlign: 'top'
            },
            layout: 'hbox',
            border: false,
            trackResetOnLoad: true,
            items: [me.idhito, me.fechaestimada]
        });

        me.btnCancel = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            action: 'cancel',
            iconCls: 'cancelar',
            handler: function () {
                me.close();
            }
        });

        me.btnAcept = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnAccept,
            tooltip: this.etiquetas.qtipAccept,
            action: 'acept',
            disabled: true,
            iconCls: 'aceptar'
        });

        me.buttons = [me.btnCancel, me.btnAcept];

        me.items = [me.form];
    }
});
