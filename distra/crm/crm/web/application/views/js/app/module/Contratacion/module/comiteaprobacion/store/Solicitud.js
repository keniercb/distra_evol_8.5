Ext.define('Comite.store.Solicitud', {
    extend: 'Ext.data.Store',
    requires: 'Comite.model.Solicitud',
    model: 'Comite.model.Solicitud',
    storeId: 'stComiteSolicitudNegocio',
    autoLoad: true,
    remoteFilter: true,
    groupDir:'DESC',
    groupField: 'fechaestado',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarSolicitudesNegocio'}, ModuleMgr.get('Comite')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
