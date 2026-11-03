Ext.define('GestionContratoImportacion.store.Servicio', {
    extend: 'Ext.data.Store',
    model: 'GestionContratoImportacion.model.Servicio',
    storeId: 'stServicioImportacion',
    autoLoad: true,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getServicios'}, ModuleMgr.get('GestionContratoImportacion')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
});
