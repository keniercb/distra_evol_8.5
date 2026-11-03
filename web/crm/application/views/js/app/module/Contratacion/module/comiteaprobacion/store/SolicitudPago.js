Ext.define('Comite.store.SolicitudPago', {
    extend: 'Ext.data.Store',
    requires: 'Comite.model.Solicitud',
    model: 'Comite.model.SolicitudPago',
    storeId: 'stComiteSolicitudPago',
    autoLoad: true,
    remoteFilter: true,
    groupDir:'DESC',
    groupField: 'fechaestado',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarSolicitudesPago'}, ModuleMgr.get('Comite')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
});
