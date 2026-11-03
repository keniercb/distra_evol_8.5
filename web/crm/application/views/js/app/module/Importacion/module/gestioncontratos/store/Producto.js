Ext.define('GestionContratoImportacion.store.Producto', {
    extend: 'Ext.data.Store',
    model: 'GestionContratoImportacion.model.Producto',
    storeId: 'stProductoImportacion',
    // autoLoad: true,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContratoImportacion')),
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
