Ext.define('OfertaNegocioImportacion.store.OfertaNegocio', {
    extend: 'Ext.data.Store',
    requires: 'OfertaNegocioImportacion.model.OfertaNegocio',
    model: 'OfertaNegocioImportacion.model.OfertaNegocio',
    storeId: 'OfertaNegocioImportacion',
    remoteFilter: true,
    remoteSort: true,
    sorters: [{property : 'idoferta', direction: 'DESC'}],
    // pageSize:10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getOfertasNegocio'}, ModuleMgr.get('OfertaNegocioImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
