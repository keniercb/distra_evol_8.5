Ext.define('OfertaNegocioImportacion.store.OfertaEstadoTrazas', {
    extend: 'Ext.data.Store',
    requires: 'OfertaNegocioImportacion.model.OfertaEstadoTrazas',
    model: 'OfertaNegocioImportacion.model.OfertaEstadoTrazas',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getOfertaEstadoTrazas'}, ModuleMgr.get('OfertaNegocioImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
