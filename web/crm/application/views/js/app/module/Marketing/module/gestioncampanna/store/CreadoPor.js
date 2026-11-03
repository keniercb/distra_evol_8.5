Ext.define('GestionCampanna.store.CreadoPor', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.CreadoPor',
    storeId: 'gc_stCreadoPor',
    concept:'usuario',
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCreadoPor'}, ModuleMgr.get('GestionCampanna')),
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