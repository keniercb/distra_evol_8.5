Ext.define('PanelControlMarketing.store.CampannasPotenciales', {
    extend: 'Ext.data.Store',
    model: 'PanelControlMarketing.model.CampannaPotencial',

    storeId: 'stCampannaPotencial',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCampannasPotenciales'}, ModuleMgr.get('PanelControlMarketing')),
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
