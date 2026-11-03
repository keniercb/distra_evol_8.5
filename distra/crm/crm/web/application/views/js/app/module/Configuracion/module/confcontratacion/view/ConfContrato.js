Ext.define('ConfContratacion.view.ConfContrato', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confcontrato',
    frame: true,
    border: false,

    initComponent: function() {
        this.getLang();
        this.title = this.etiquetas.titleGestContrato;

        this.buttons = [
            {
                text: this.etiquetas.lbSave,
                tooltip: this.etiquetas.qtipApply,
                iconCls: 'guardar',
                disabled: true,
                action: 'apply'
            },
            {
                text: this.etiquetas.lbBtnCancel,
                tooltip: this.etiquetas.qtipCancel,
                iconCls: 'cancelar',
                action: 'cancel'
            }
        ];

        this.callParent();
    }
});
