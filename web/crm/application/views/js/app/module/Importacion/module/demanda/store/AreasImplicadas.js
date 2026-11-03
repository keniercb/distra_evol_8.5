Ext.define('Demanda.store.AreasImplicadas', {
    extend: 'Ext.data.Store',
    model: 'Demanda.model.AreasImplicadas',
    storeId: 'stAreasImplicadas',
    proxy:{
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreasImplicadas'}, ModuleMgr.get('Demanda')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    },
    data: []
});
