Ext.define('Solicitud.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.scp_main',
    frame: false,
    margin: false,
    border :false,

    initComponent: function() {

        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;
        this.layout= 'border';
        this.closable = true;

        this.grid = Ext.create('Solicitud.view.MainGrid');
        this.items = [this.grid];

        this.callParent();
    }
});
