Ext.define('GestionContratoImportacion.store.TipoPrecio', {
    extend: 'Ext.data.Store',
    model: 'GestionContratoImportacion.model.TipoPrecio',
    storeId: 'stTipoPrecioImportacion',
    autoLoad: true,
    //pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getTipoPrecio'}, ModuleMgr.get('GestionContratoImportacion')),
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
