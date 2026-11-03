Ext.define('BaseModule.view.ElementWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.elementwindow',
    layout: 'border',
    height: 450,
    initComponent: function () {
        this.addToBody();
        this.callParent();
        this.tools[0].refhelp = 'select_element';
    },
    addToBody: function () {
        var me=this;
        this.etiquetas = LangMgr.getLang(this);

        this.tree = Ext.create('BaseModule.view.ElementTree', {
            region: 'center',
            tipocontrato:me.tipocontrato,
            emptyText: this.etiquetas.msgNoDataLoaded,
            viewConfig: {
                deferEmptyText: false
            }
        });
        this.items = [this.tree];
    }
})
;