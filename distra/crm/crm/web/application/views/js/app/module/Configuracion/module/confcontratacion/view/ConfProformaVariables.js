Ext.define('ConfContratacion.view.ConfProformaVariables', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confproformavariables',
    frame: true,
    border: false,
    layout: 'border',
    trackResetOnLoad: true,
   // fieldDefaults: {labelAlign: 'top'},
    initComponent: function () {
        var me=this;
        this.getLang();

        me.items=[
            Ext.create('ConfContratacion.view.GridVariables',{})
        ];

        this.btnSave = Ext.create('Ext.Button', {
            text: this.etiquetas.lbSave,
            tooltip: this.etiquetas.qtipApply,
            iconCls: 'guardar',
            disabled: true,
            action: 'save'
        });

        this.btnCancel = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            iconCls: 'cancelar',
            action: 'cancel'
        });

        this.buttons = [this.btnCancel, this.btnSave];

        this.callParent();
    }
});
