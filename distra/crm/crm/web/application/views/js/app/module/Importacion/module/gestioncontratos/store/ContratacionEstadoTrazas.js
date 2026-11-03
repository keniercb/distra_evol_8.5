Ext.define('GestionContratoImportacion.store.ContratacionEstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'GestionContratoImportacion.model.ContratacionEstadoTrazas',
    model: 'GestionContratoImportacion.model.ContratacionEstadoTrazas',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getContratoEstadoTrazas'}, ModuleMgr.get('GestionContratoImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
