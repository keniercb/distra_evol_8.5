Ext.define('Facturacion.view.facturaPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fac_facturapanel',
    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.refhelp = "";

        me.numero = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Campo 1',
            readOnly: true,
            flex: 1
        });



    }

});
