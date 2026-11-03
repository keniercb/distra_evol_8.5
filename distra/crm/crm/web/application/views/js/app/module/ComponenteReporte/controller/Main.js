Ext.define('ComponenteReporte.controller.Main', {
    extend: 'Ext.app.Controller',
    alias: 'controller.main',
    refs: [{
        ref: 'ContenedorPrincipal', selector: 'contenedorgeneralreporte'},
        {ref: 'TreeMenu', selector: 'treemenu'},
        {ref: 'TabpContenido', selector: 'tabpcontenido'}
    ],
    init: function () {
        var me = this;

        me.listen({
            component: {
                'treemenu': {
                    beforeload: this.onBeforeloadStoreMenu,
                    render: this.onRenderTreeMenu,
                    selectionchange: this.onSelectionChangeMenu
                },
                'tabpcontenido': {
                    tabchange: this.onTabChange
                }
            }
        });

    },
    onBeforeloadStoreMenu: function(store, oper){
        oper.params.identificadormodulo = this.getContenedorPrincipal().identificadormodulo;
    },
    onRenderTreeMenu: function(){
        this.getTreeMenu().getRootNode().expand();
    },
    onSelectionChangeMenu: function(sm, selected){
        var cant = sm.getCount(),
            isRoot = sm.getCount() && selected[0].isRoot(),
            isAgrupador = sm.getCount() && selected[0].get('agrupador') == 1;

        if(!isRoot && !isAgrupador)
            this.activeReporteTab(selected[0]);
    },
    activeReporteTab: function(record){
        var me = this,
            tabpanel = me.getTabpContenido(),
            tabId = 'tab_'+record.get('idreporte'),
            isRenderedTab = tabpanel.queryById(tabId);

        if(!isRenderedTab)
            this.createTabReporte(tabId, record);

        tabpanel.setActiveTab(tabId);

    },
    createTabReporte: function(tabid, config){
        var me = this,
            tabpanel =  me.getTabpContenido();
        // console.log('sdsd', config.getData())
        tabpanel.add({
            title: config.get('denominacion'),
            id: tabid,
            tabTip: config.get('denominacion'),
            height: '100%',
            closable: true,
            layout: 'fit',
            border: false,
            items: Ext.create('ComponenteReporte.view.ReporteContainer', {
                configReporte : config.getData()
            })
        });
    },
    onTabChange: function(tabpanel, panel){
        var nodeId = panel.id.split('tab_')[1],
            menu = this.getTreeMenu(),
            node = menu.getStore().getById(nodeId),
            sm = menu.getSelectionModel();

        if(node)
            sm.select(node);
        else
            sm.deselectAll(true);
    }
});
