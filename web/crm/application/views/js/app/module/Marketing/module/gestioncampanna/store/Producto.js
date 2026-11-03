Ext.define('GestionCampanna.store.Producto', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.Producto',

    storeId: 'stProducto',
    autoLoad: true,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionCampanna')),
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
