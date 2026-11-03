Ext.define('ComponenteReporte.view.TabpContenido', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.tabpcontenido',
    activeTab: 0,
    autoScroll : true,
    bodyBorder : false,
    border: false,
    initComponent: function () {
		var me = this;
		
		me.etiquetas =  LangMgr.getLang(this);

        me.items = {
            title : me.etiquetas.lbTitleTabPrincipal,
            cls: 'menureporte-principalTab',
            html: '<div class="componentereporte-info-container"><div class="componentereporte-info"><p>'+me.etiquetas.lbMsgPrincipalTab+'</p><hr/></div></div>'
        };

        this.callParent();
    }
});