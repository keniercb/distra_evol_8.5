Ext.define('GestionOportunidad.store.Cliente', {
    extend: 'Ext.data.Store',
    model: 'GestionOportunidad.model.Cliente',

    storeId: 'stCliente',
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCliente'}, ModuleMgr.get('GestionOportunidad')),
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
