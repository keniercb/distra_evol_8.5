Ext.define('GestionOportunidad.store.CampannaAsociada', {
    extend: 'Ext.data.Store',
    model: 'GestionOportunidad.model.CampannaAsociada',

    storeId: 'stCampanna',
    //autoLoad: true,
    remoteSort: true,
    pageSize: 10,


    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCampannaAsociada'}, ModuleMgr.get('GestionOportunidad')),
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