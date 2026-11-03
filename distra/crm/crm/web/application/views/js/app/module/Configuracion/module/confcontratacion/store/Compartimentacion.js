Ext.define('ConfContratacion.store.Compartimentacion', {
    extend: 'Ext.data.Store',
    model: 'ConfContratacion.model.Compartimentacion',

    storeId: 'stCompartimentacion',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,

    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'loadConfCompartimentacion'}, ModuleMgr.get('ConfContratacion')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }

});
