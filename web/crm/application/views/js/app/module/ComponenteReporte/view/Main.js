Ext.define('ComponenteReporte.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.contenedorgeneralreporte',
    layout: 'border',
    border: false,
    initComponent: function () {
		var me = this;
		
		me.etiquetas =  LangMgr.getLang(this);

		me.items = [
            Ext.create('ComponenteReporte.view.TreeMenu',{
                region: 'west',
                collapsible:true,
                minWidth:150,
                maxWidth:500,
                resizable:true,
                width: 300,
                margins: '0 5 0 0'
            }),
            Ext.create('ComponenteReporte.view.TabpContenido',{
                region: 'center'
            })
        ];
        this.callParent();
    }
});