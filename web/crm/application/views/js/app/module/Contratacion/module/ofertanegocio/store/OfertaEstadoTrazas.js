Ext.define('OfertaNegocio.store.OfertaEstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'OfertaNegocio.model.OfertaEstadoTrazas',
    model: 'OfertaNegocio.model.OfertaEstadoTrazas',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getOfertaEstadoTrazas'}, ModuleMgr.get('OfertaNegocio')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
