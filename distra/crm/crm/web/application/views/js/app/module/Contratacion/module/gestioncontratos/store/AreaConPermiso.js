Ext.define('GestionContrato.store.AreaConPermiso', {
    extend: 'Ext.data.Store',
    model: 'GestionContrato.model.AreasConPermiso',
    storeId: 'stAreasConPermiso',
    autoLoad:true,
    proxy:{
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getAreaConPermiso'}, ModuleMgr.get('GestionContrato')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    },
    data: []
});
