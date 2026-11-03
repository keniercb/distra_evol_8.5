Ext.define('GestionCampanna.store.Prioridad', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.Prioridad',

    storeId: 'stPrioridad',
    remoteSort: true,
    pageSize: 10,


    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getPrioridad'}, ModuleMgr.get('GestionCampanna')),
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