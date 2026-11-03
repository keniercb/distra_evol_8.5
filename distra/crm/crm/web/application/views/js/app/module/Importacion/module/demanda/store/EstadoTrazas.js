Ext.define('Demanda.store.EstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'Demanda.model.EstadoTrazas',
    model: 'Demanda.model.EstadoTrazas',
    storeId: 'EstadoTrazas',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getDemandaEstadoTrazas'}, ModuleMgr.get('Demanda')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
