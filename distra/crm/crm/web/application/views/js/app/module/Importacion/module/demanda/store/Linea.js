Ext.define('Demanda.store.Linea', {
    extend: 'Ext.data.Store',
    requires: 'Demanda.model.Linea',
    model: 'Demanda.model.Linea',
    storeId: 'Linea',
    // remoteFilter: true,
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getLineasClientes'}, ModuleMgr.get('Demanda')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
