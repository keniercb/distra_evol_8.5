Ext.define('Facturacion.view.AreaWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.fac_areawindow',
    margin: false,
    width: 300,
    height: 120,
    closable: true,
    closeAction: 'destroy',
    layout: 'fit',
    modal: true,
    resizable: false,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.qtipModificarAreaResponsable;

        me.createBody();

        me.callParent();
    },
    createBody: function () {
        var me = this;

        me.idhito = Ext.create('Ext.form.field.Hidden', {
            name: 'idhito'
        });

        me.idarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea'
        });

        me.cmbarea = Ext.create('GestionContrato.view.CmbArea', {
            localId: 'idarea',
            name: 'nombrearea',
            fieldLabel: me.etiquetas.lbNewArea,
            flex: 1,
            allowBlank: false,
            emptyText: me.etiquetas.lbNewArea,
            editable: false,
        });

        me.form = Ext.create('Ext.form.Panel', {
            bodyStyle: 'background:#DFE9F6; padding:5px',
            fieldDefaults: {
                labelAlign: 'top'
            },
            layout: 'hbox',
            border: false,
            trackResetOnLoad: true,
            items: [me.idhito, me.idarea, me.cmbarea]
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
