Ext.define('GestionContrato.store.Areas', {
    extend: 'Ext.data.TreeStore',
    model: 'GestionContrato.model.Area',

    storeId: 'stAreas',
    root: {
        text: 'Areas',
        id: 0,
        expanded: true
    },
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreas'}, ModuleMgr.get('GestionContrato')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            successProperty: 'success'
        }
    }
});
