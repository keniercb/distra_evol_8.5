Ext.define('CRM.view.TabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.main_tabpanel',

    border: false,
    activeTab: 0,
    items: [
        Ext.create('CRM.view.InitPage')
    ],
    initComponent: function () {
        var me = this;


        this.callParent(arguments);
    }
});