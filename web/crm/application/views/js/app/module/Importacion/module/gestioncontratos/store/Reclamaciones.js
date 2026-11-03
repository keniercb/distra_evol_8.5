Ext.define('GestionContratoImportacion.store.Reclamaciones', {
    extend: 'Ext.data.Store',
    requires: 'GestionContratoImportacion.model.Reclamaciones',
    model: 'GestionContratoImportacion.model.Reclamaciones',
    storeId: 'stReclamacionImportacion',
    remoteFilter: true,
    remoteSort: true,
    pageSize: 25,
    autoLoad:true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'reclamacion'}, ModuleMgr.get('GestionContratoImportacion')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
