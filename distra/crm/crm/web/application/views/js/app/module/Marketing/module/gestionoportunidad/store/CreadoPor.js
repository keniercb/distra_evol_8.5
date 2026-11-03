Ext.define('GestionOportunidad.store.CreadoPor', {
    extend: 'Ext.data.Store',
    model: 'GestionOportunidad.model.CreadoPor',
    storeId: 'stCreadoPor',
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCreadoPor'}, ModuleMgr.get('GestionOportunidad')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
});