Ext.define('SolicitudNegocioImportacion.store.AreasImplicadas', {
    extend: 'Ext.data.Store',
    model: 'SolicitudNegocioImportacion.model.AreasImplicadas',
    storeId: 'stAreasImplicadasImportacion',
    proxy:{
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreasImplicadas'}, ModuleMgr.get('SolicitudNegocioImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    },
    data: []
});
