Ext.define('GestionContratoImportacion.store.EstadosCuenta', {
    extend: 'Ext.data.Store',
    model: 'GestionContratoImportacion.model.EstadosCuenta',

    storeId: 'stEstadosCuentaImportacion',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'comprobarDeudaClienteProveedor'}, ModuleMgr.get('GestionContratoImportacion')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            // root: 'data',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
