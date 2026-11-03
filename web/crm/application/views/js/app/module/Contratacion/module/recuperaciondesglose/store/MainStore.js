Ext.define('RecuperacionDesglose.store.MainStore', {
    extend: 'Ext.data.Store',
    model: 'RecuperacionDesglose.model.MainModel',
    storeId: 'stMainStore',
    remoteFilter: true,
    groupField: 'idcontrato',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getMainRecuperacionDesglose'}, ModuleMgr.get('RecuperacionDesglose')),
        // actionMethods: {read: 'POST'},
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        },
    },
});
