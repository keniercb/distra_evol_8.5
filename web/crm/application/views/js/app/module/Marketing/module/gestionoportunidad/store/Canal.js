Ext.define('GestionOportunidad.store.Canal', {
    extend: 'Ext.data.Store',
    model: 'GestionOportunidad.model.Canal',

    storeId: 'stCanal',
    //autoLoad: true,
    remoteSort: true,
    pageSize: 10,


    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCanal'}, ModuleMgr.get('GestionOportunidad')),
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
