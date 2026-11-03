Ext.define('SolicitudNegocio.store.AreasImplicadas', {
    extend: 'Ext.data.Store',
    model: 'SolicitudNegocio.model.AreasImplicadas',
    storeId: 'stAreasImplicadas',
    proxy:{
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreasImplicadas'}, ModuleMgr.get('SolicitudNegocio')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    },
    data: []
});
