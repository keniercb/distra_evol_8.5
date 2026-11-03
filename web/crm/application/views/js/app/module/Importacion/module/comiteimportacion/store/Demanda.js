Ext.define('ComiteImportacion.store.Demanda', {
    extend: 'Ext.data.Store',
    requires: 'ComiteImportacion.model.Demanda',
    model: 'ComiteImportacion.model.Demanda',
    storeId: 'stComiteDemanda',
    autoLoad: true,
    remoteFilter: true,
    groupDir:'DESC',
    groupField: 'fechaestado',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarSolicitudesNegocio'}, ModuleMgr.get('ComiteImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
});
