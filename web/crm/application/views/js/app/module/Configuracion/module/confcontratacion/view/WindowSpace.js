Ext.define('ConfContratacion.view.WindowSpace', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowspace',
    layout: 'fit',
    height: 500,
    initComponent: function () {
        this.getLang();

        this.title = this.etiquetas.titleEspacioTrabajo;

        this.store = Ext.create('ConfContratacion.store.Espacios');

        this.tree = Ext.create('Ext.tree.Panel', {
            store: this.store,
            rootVisible: false,
            autoScroll: true
        });

        this.items = this.tree;

        this.callParent();
    }
});
