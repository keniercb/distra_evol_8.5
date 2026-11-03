Ext.define('SolicitudNegocio.store.EstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'SolicitudNegocio.model.EstadoTrazas',
    model: 'SolicitudNegocio.model.EstadoTrazas',
    storeId: 'EstadoTrazas',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getSolicitudEstadoTrazas'}, ModuleMgr.get('SolicitudNegocio')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
