Ext.define('ComiteImportacion.store.Oferta', {
    extend: 'Ext.data.Store',

    storeId: 'stComiteOfertaImportacion',
    autoLoad: true,
    remoteSort: true,
    pageSize: 25,
    fields: [],
    groupDir:'DESC',
    groupField: 'fechaestado',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'cargarOfertas'}, ModuleMgr.get('ComiteImportacion')),
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
