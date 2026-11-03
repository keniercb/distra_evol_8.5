Ext.define('ConfPlantilla.store.Plantilla', {
    extend: 'Ext.data.Store',
    model: 'ConfPlantilla.model.Plantilla',
    storeId: 'stPlantilla',
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getPlantillas'}, ModuleMgr.get('ConfPlantilla')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
