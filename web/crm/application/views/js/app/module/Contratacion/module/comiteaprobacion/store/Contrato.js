Ext.define('Comite.store.Contrato', {
    extend: 'Ext.data.Store',

    storeId: 'stComiteContrato',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    fields: [],
    remoteGroup: true,
//     groupDir:'DESC',
    groupField: 'fechaestado',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarcontrato'}, ModuleMgr.get('Comite')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
