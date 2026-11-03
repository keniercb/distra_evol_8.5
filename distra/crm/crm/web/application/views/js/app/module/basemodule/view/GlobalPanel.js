Ext.define('BaseModule.view.GlobalPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.globalpanel',
    title: 'Nomencladores',
    module: '',
    closable: true,
    border: false,
    layout: 'border',
    initComponent: function () {
        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var me = this,
            globalLang = LangMgr.getLang(this);

        this.etiquetas = Ext.Object.merge(globalLang, me.etiquetas || {});

        if (!this.modelName) {
            this.treePanel = new Ext.create('BaseModule.view.WesternTree', {
                etiquetas: me.etiquetas,
                module: this.module
            });

            this.tabPanel = Ext.create('Ext.tab.Panel', {
                border: false,
                region: 'center',
                plugins: Ext.create('CRM.plugins.tabpanel.TabCloseMenu', {
                    closeTabText: me.etiquetas.lbTabClose,
                    closeOthersTabsText: me.etiquetas.lbTabCloseOthers,
                    closeAllTabsText: me.etiquetas.lbTabCloseAll
                })
            });
            this.items = [this.treePanel, this.tabPanel];
        }
    }
});