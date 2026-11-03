Ext.define('GestionOportunidad.store.Prioridad', {
    extend: 'Ext.data.Store',
    model: 'GestionOportunidad.model.Oportunidad',

    storeId: 'stPrioridad',
    //autoLoad: true,
    remoteSort: true,
    pageSize: 10,


    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getPrioridad'}, ModuleMgr.get('GestionOportunidad')),
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