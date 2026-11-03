Ext.define('GestionContratoImportacion.view.SignWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.signwindowimportacion',
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

        me.title = me.etiquetas.titleFirma;

        me.createBody();

        me.callParent();
    },
    createBody: function () {
        var me = this;

        me.fechafirma = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaFirma,
            name: 'fechafirma',
            allowBlank: false,
            value: new Date(),
            flex: 1,
            maxValue: new Date(),
            listeners: {
                render: function (field) {
                    field.fireEvent('change', field);
                }
            }
        });

        me.unidadTiempo = Ext.create('Ext.form.field.Number', {
            hidden: true,
            name: 'unidadtiempo'
        });

        me.vigencia = Ext.create('Ext.form.field.Number', {
            hidden: true,
            name: 'vigencia'
        });

        me.fechaFin = Ext.create('Ext.form.field.Date', {
            hidden: true,
            name: 'fechafin',
            flex: 1,
        });

        me.form = Ext.create('Ext.form.Panel', {
            bodyStyle: 'background:#DFE9F6; padding:5px',
            fieldDefaults: {
                labelAlign: 'top'
            },
            layout: 'hbox',
            border: false,
            items: [
                me.fechafirma,
                me.vigencia,
                me.unidadTiempo,
                me.fechaFin
            ]
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
