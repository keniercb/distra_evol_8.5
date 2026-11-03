Ext.define('GestionCampanna.store.CampannaProducto', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.CampannaProducto',

    storeId: 'stCampannaProducto',
    //autoLoad: true,
    remoteSort: true,
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCampannaProducto'}, ModuleMgr.get('GestionCampanna')),
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
