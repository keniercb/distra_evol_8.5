Ext.define('Comite.view.WindowHistorial', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowhistorial',
    width: 900,
    height: 550,
    layout: 'border',
    constrain: true,
    closeAction: 'destroy',
    modal: true,
    initComponent: function () {
        var me=this;

        me.items=Ext.create('Ext.grid.Panel',{

        });

        me.callParent();
    }
});