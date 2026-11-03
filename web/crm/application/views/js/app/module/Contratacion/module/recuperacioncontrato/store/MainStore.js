Ext.define('RecuperacionContrato.store.MainStore', {
    extend: 'Ext.data.Store',
    model: 'RecuperacionContrato.model.MainModel',
    storeId: 'stMainStoreContrato',
    remoteFilter: true,
    groupField: 'idcontrato',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getMainRecuperacionContrato'}, ModuleMgr.get('RecuperacionContrato')),
        // actionMethods: {read: 'POST'},
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        },
    },
});
