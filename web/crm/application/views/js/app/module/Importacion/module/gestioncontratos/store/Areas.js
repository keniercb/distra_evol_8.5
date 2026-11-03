Ext.define('GestionContratoImportacion.store.Areas', {
    extend: 'Ext.data.TreeStore',
    model: 'GestionContratoImportacion.model.Area',

    storeId: 'stAreasImportacion',
    root: {
        text: 'Areas',
        id: 0,
        expanded: true,
    },
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreas'}, ModuleMgr.get('GestionContratoImportacion')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            successProperty: 'success'
        }
    }
});
