Ext.define('ComponenteReporte.view.TreeMenu', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treemenu',
    loadMask: true,
    autoScroll: true,
    useArrows: true,
    rootVisible: false,
    hideHeaders: true,
    selModel:{
        selType : 'treemodel',
        pruneRemoved: true
    },
    viewConfig: {
        bubbleEvents: ['refresh'],
        loadMask: true
    },
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.title = me.etiquetas.titlePanelMenu;

        me.store = Ext.create('ComponenteReporte.store.Menu');

        me.root = {
            idreporte: 'root',
            denominacion: me.etiquetas.lbRootMenu
        };

        me.columns = [{
            xtype: 'treecolumn',
            text: me.etiquetas.lbDenominacion,
            flex: 2,
            sortable: true,
            dataIndex: 'denominacion'
        }];

        me.callParent();
    }
});
