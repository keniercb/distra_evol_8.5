Ext.define('PanelControlMarketing.store.OportunidadesMes', {
    extend: 'Ext.data.Store',
    model: 'PanelControlMarketing.model.OportunidadMes',

    storeId: 'stOportunidadesMes',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCantOportunidadesMes'}, ModuleMgr.get('PanelControlMarketing')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            successProperty: 'success'
        }
    }
});
