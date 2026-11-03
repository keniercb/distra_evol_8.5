Ext.define('RecupClientesProveedores.store.ClientesProveedores', {
    extend: 'Ext.data.Store',
    model: 'RecupClientesProveedores.model.ClientesProveedores',
    storeId: 'stClientesProveedores',
    remoteFilter: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getClientesProveedores'}, ModuleMgr.get('RecupClientesProveedores')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
