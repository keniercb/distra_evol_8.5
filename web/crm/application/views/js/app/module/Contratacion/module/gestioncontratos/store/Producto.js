Ext.define('GestionContrato.store.Producto', {
    extend: 'Ext.data.Store',
    model: 'GestionContrato.model.Producto',
    // storeId: 'stProducto',
    // autoLoad: true,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContrato')),
        actionMethods: {
            read: 'POST'
        },
        extraParams: {
            idtipoprecio: -1
        },
        reader: {
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
});
