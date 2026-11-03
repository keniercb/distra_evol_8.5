Ext.define('GestionContrato.view.SelectWindowClienteProveedor', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.co_selectwindowclienteproveedor',
    autoScroll: true,
    autoHeight: true,
    width: 1000,
    height: 470,
    maximizable: true,
    layout: 'fit',
    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);
        this.title = 'Seleccionar Cliente proveedor';
        this.panel = Ext.create('GestionClienteProveedor.view.Main', {
            closable: false,
            header: false
        });
        this.items = [this.panel];

        this.btnAceptar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnAccept) ? this.etiquetas.lbBtnAccept : 'Aceptar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipAccept) ? this.etiquetas.qtipAccept : 'Aceptar ',
            action: 'acept',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnCancelar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnCancel) ? this.etiquetas.lbBtnCancel : 'Cancelar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipCancel) ? this.etiquetas.qtipCancel : 'Cancelar ',
            action: 'cancel',
            iconCls: 'cancelar'
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];

        this.callParent();
    }
});
