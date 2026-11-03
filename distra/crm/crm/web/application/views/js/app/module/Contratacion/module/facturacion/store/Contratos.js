Ext.define('Facturacion.store.Contratos', {
    extend: 'Ext.data.Store',
    model: 'Facturacion.model.Contrato',
    storeId: 'fac_stContratos',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarContratos'}, ModuleMgr.get('Facturacion')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
