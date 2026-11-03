Ext.define('NomClienteProveedor.view.GlobalPanel', {
    extend: 'BaseModule.view.GlobalPanel',
    module: 'NomClienteProveedor',
    initComponent:function(){
        this.etiquetas = LangMgr.getLang(this);
        this.callParent();
    }
});