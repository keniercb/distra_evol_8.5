Ext.define('GestionContrato.store.TipoPrecio', {
    extend: 'Ext.data.Store',
    model: 'GestionContrato.model.TipoPrecio',
    storeId: 'stTipoPrecio',
    autoLoad: true,
    //pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getTipoPrecio'}, ModuleMgr.get('GestionContrato')),
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
