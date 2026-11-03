Ext.define('GestionOportunidad.store.Oportunidad', {
    extend: 'Ext.data.Store',
    model: 'GestionOportunidad.model.Oportunidad',

    storeId: 'stOportunidad',
    autoLoad: true,
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getOportunidad'}, ModuleMgr.get('GestionOportunidad')),
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
