Ext.define('SolicitudNegocioImportacion.store.SolicitudNegocio', {
    extend: 'Ext.data.Store',
    requires: 'SolicitudNegocioImportacion.model.SolicitudNegocio',
    model: 'SolicitudNegocioImportacion.model.SolicitudNegocio',
    storeId: 'SolicitudNegocioImportacion',
    remoteFilter: true,
    remoteSort: true,
    pageSize: 25,
    autoLoad:true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getSolicitudesNegocio'}, ModuleMgr.get('SolicitudNegocioImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
