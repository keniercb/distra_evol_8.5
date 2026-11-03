Ext.define('Ext.ux.ComprobarAdjuntos', {
    extend: 'Ext.window.Window',
    alias: 'widget.comprobaradjuntoswindow',
    width: 630,
    minWidth: 630,
    minHeight: 200,
    layout: 'anchor',
    constrain: true,
    modal: true,
    initComponent: function () {
        var me=this;

        me.callParent();
    },
    show: function(attachment){
        console.log('attachment', attachment)
    }
})