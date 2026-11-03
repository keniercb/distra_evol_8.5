Ext.define('GestionCampanna.store.Moneda', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.Moneda',
    storeId: 'stMoneda',
    concept:'moneda',
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getMoneda'}, ModuleMgr.get('GestionCampanna')),
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