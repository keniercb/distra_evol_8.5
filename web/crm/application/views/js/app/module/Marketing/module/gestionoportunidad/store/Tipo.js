Ext.define('GestionOportunidad.store.Tipo', {
    extend: 'Ext.data.Store',
    model: 'GestionOportunidad.model.Tipo',

    storeId: 'stTipo',
    //autoLoad: true,
    remoteSort: true,
    pageSize: 10,


    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getTipo'}, ModuleMgr.get('GestionOportunidad')),
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