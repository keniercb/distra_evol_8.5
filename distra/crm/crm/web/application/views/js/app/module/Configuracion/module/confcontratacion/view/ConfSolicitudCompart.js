Ext.define('ConfContratacion.view.ConfSolicitudCompart', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confsolicitudcompart',
    frame: true,
    border: false,
    layout: 'fit',
    autoScroll: true,

    requires: [],

    initComponent: function () {
        var me = this;
        this.getLang();

        this.grid = Ext.create('ConfContratacion.view.CompartGrid',{
            title: me.etiquetas.lbSolicitudCompart,
            modelName: 'SolicitudNegocio'
        });

        this.items = [this.grid];

        this.callParent();
    }
});
