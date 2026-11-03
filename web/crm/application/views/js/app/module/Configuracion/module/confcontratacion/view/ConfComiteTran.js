Ext.define('ConfContratacion.view.ConfComiteTran', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confcomitetran',
    frame: true,
    border: false,
    layout: 'fit',
    autoScroll: true,

    requires: [
        'ConfContratacion.view.TrasitionPanel'
    ],

    initComponent: function () {
        var me = this;
        this.getLang();

        this.transitionPanel = Ext.create('ConfContratacion.view.TrasitionPanel');

        this.items = [this.transitionPanel];

        this.btnSave = Ext.create('Ext.Button',{
            text: this.etiquetas.lbSave,
            tooltip: this.etiquetas.qtipApply,
            iconCls: 'guardar',
            disabled: true,
            action: 'save'
        });

        this.btnCancel = Ext.create('Ext.Button',{
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            iconCls: 'cancelar',
            action: 'cancel'
        });

        this.buttons = [this.btnCancel,this.btnSave];

        this.callParent();
    }
});
