Ext.define('Facturacion.store.HitoEstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'Facturacion.model.HitoEstadoTrazas',
    model: 'Facturacion.model.HitoEstadoTrazas',
    storeId: 'HitoEstadoTrazas',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getHitoEstadoTrazas'}, ModuleMgr.get('Facturacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
