Ext.define('OfertaNegocio.store.OfertaNegocio', {
    extend: 'Ext.data.Store',
    requires: 'OfertaNegocio.model.OfertaNegocio',
    model: 'OfertaNegocio.model.OfertaNegocio',
    storeId: 'OfertaNegocio',
    remoteFilter: true,
    remoteSort: true,
    // pageSize:10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getOfertasNegocio'}, ModuleMgr.get('OfertaNegocio')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
