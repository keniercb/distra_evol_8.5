Ext.define('ComiteImportacion.store.Solicitud', {
    extend: 'Ext.data.Store',
    requires: 'ComiteImportacion.model.Solicitud',
    model: 'ComiteImportacion.model.Solicitud',
    storeId: 'stComiteSolicitudNegocioImportacion',
    autoLoad: true,
    remoteFilter: true,
    groupDir:'DESC',
    groupField: 'fechaestado',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarSolicitudesNegocio'}, ModuleMgr.get('ComiteImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
