Ext.define('SolicitudNegocioImportacion.store.Linea', {
    extend: 'Ext.data.Store',
    requires: 'SolicitudNegocioImportacion.model.Linea',
    model: 'SolicitudNegocioImportacion.model.Linea',
    storeId: 'Linea',
    // remoteFilter: true,
    // remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarLineas'}, ModuleMgr.get('SolicitudNegocioImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
});
