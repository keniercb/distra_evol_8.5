Ext.define('Nomencladores.store.Areas', {
    extend: 'Ext.data.TreeStore',
    model: 'Nomencladores.model.Area',

    storeId: 'stAreas',
    root: {
        text: 'Areas',
        id: 0,
        expanded: true
    },
    autoLoad:false,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreas'}, ModuleMgr.get('Nomencladores')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            successProperty: 'success'
        }
    }
});
