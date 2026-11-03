Ext.define('Seguimiento.store.EstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'Seguimiento.model.EstadoTrazas',
    model: 'Seguimiento.model.EstadoTrazas',
    storeId: 'EstadoTrazasSeguimiento',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAEstadoTrazas'}, ModuleMgr.get('Seguimiento')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
