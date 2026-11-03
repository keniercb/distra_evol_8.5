Ext.define('PanelControlMarketing.view.CustomPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.custompanel',
    height: 350,
    layout: 'fit',
    padding: '2,5',
    plain: true,
    columnWidth: Ext.getBody().getWidth() <= 1024 ? 1 / 2 : 1 / 3,
    initComponent: function () {
        var me = this;
        this.maximize = Ext.create('Ext.panel.Tool', {
            type: 'maximize'
        });

        this.refresh = Ext.create('Ext.panel.Tool', {
            type: 'refresh',
            callback: function () {
                if (me.store) {
                    me.store.load();
                }
            }
        });

        this.tools = [this.refresh];
        this.callParent();
    }
});
