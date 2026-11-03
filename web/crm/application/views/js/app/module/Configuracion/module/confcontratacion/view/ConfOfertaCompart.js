Ext.define('ConfContratacion.view.ConfOfertaCompart', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confofertacompart',
    frame: true,
    border: false,
    layout: 'fit',
    autoScroll: true,

    requires: [],

    initComponent: function () {
        var me = this;
        this.getLang();

        this.grid = Ext.create('ConfContratacion.view.CompartGrid',{
            title: me.etiquetas.lbOfertaCompart,
            modelName: 'OfertaNegocio'
        });

        this.items = [this.grid];

        this.callParent();
    }
});
