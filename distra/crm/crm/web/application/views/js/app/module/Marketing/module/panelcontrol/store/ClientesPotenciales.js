Ext.define('PanelControlMarketing.store.ClientesPotenciales', {
    extend: 'Ext.data.Store',
    model: 'PanelControlMarketing.model.ClientePotencial',

    storeId: 'stClientePotencial',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getClientesPotenciales'}, ModuleMgr.get('PanelControlMarketing')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            successProperty: 'success'
        }
    },
    sorters: {
        property: 'cant',
        direction:'desc'
    }
});
