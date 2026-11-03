Ext.define('GestionContrato.store.ContratacionEstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'GestionContrato.model.ContratacionEstadoTrazas',
    model: 'GestionContrato.model.ContratacionEstadoTrazas',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getContratoEstadoTrazas'}, ModuleMgr.get('GestionContrato')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
