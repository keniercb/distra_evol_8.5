Ext.define('GestionOportunidad.store.ClienteOportunidad', {
    extend: 'Ext.data.Store',
    model: 'GestionOportunidad.model.Cliente',

    storeId: 'stClienteOportunidad',
    remoteSort: true,
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getClienteOportunidad'}, ModuleMgr.get('GestionOportunidad')),
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
