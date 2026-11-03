Ext.define('BaseModule.view.MainWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.mainwindow',
    autoCreateForm:true,
    autoScroll: true,
    initComponent:function(){
        this.callParent();
    }
});