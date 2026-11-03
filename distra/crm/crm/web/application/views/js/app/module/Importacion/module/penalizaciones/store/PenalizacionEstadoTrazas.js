Ext.define('Penalizaciones.store.PenalizacionEstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'Penalizaciones.model.EstadoTrazasPenalizacion',
    model: 'Penalizaciones.model.EstadoTrazasPenalizacion',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getpenalizacionEstadoTrazas'}, ModuleMgr.get('Penalizaciones')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
