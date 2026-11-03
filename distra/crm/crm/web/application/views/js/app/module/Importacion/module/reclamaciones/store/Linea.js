Ext.define('Reclamaciones.store.Linea', {
    extend: 'Ext.data.Store',
    requires: 'Reclamaciones.model.Linea',
    model: 'Reclamaciones.model.Linea',
    storeId: 'Linea',
    // remoteFilter: true,
    // remoteSort: true,
    // pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarLineas'}, ModuleMgr.get('Reclamaciones')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
