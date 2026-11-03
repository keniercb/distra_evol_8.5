Ext.define('GestionContratoImportacion.store.AreaConPermiso', {
    extend: 'Ext.data.Store',
    model: 'GestionContratoImportacion.model.AreasConPermiso',
    storeId: 'stAreasConPermisoImportacion',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreaConPermiso'}, ModuleMgr.get('GestionContratoImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    },
    data: []
});
