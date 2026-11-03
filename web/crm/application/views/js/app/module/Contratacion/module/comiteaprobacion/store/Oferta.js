Ext.define('Comite.store.Oferta', {
    extend: 'Ext.data.Store',

    storeId: 'stComiteOffer',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    fields: [],
    groupDir:'DESC',
    groupField: 'fechaestado',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarOfertas'}, ModuleMgr.get('Comite')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
