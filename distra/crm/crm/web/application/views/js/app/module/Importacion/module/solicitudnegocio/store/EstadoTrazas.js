Ext.define('SolicitudNegocioImportacion.store.EstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'SolicitudNegocioImportacion.model.EstadoTrazas',
    model: 'SolicitudNegocioImportacion.model.EstadoTrazas',
    storeId: 'EstadoTrazasImportacion',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getSolicitudEstadoTrazas'}, ModuleMgr.get('SolicitudNegocioImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
