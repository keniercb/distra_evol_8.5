Ext.define('ConfContratacion.view.ConfContratoCompart', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confcontratocompart',
    frame: true,
    border: false,
    layout: 'fit',
    autoScroll: true,

    requires: [],

    initComponent: function () {
        var me = this;
        this.getLang();

        this.grid = Ext.create('ConfContratacion.view.CompartGrid',{
            title: 'Compartimentación de contrato',
            modelName: 'DatContrato'
        });

        this.items = [this.grid];

        this.callParent();
    }
});
