Ext.define('SolicitudNegocio.store.SolicitudNegocio', {
    extend: 'Ext.data.Store',
    requires: 'SolicitudNegocio.model.SolicitudNegocio',
    model: 'SolicitudNegocio.model.SolicitudNegocio',
    storeId: 'SolicitudNegocio',
    remoteFilter: true,
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getSolicitudesNegocio'}, ModuleMgr.get('SolicitudNegocio')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
