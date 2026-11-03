Ext.define('Pliego.view.PanelVista', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.panelvista',
    collapsible: true,
    margin: 4,
    minHeight: 400,
    maxHeight: 500,
    height: 450,
    layout: {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start',
    },
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.columnWidth=0.5;
        me.minHeight= 50;
        // me.layout= 'anchor';
        me.defaults={margin:4};

        me.callParent();
    }
});
