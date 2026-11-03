Ext.define('GestionContrato.store.EstadosCuenta', {
    extend: 'Ext.data.Store',
    model: 'GestionContrato.model.EstadosCuenta',

    storeId: 'stEstadosCuenta',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'comprobarDeudaClienteProveedor'}, ModuleMgr.get('GestionContrato')),
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
