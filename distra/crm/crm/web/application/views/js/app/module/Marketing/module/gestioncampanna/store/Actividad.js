/**
 * Created by Puchita on 16/03/2016.
 */
Ext.define('GestionCampanna.store.Actividad', {
    extend: 'Ext.data.Store',
    model: 'GestionCampanna.model.Actividad',

    storeId: 'stActividad',
    //autoLoad: true,
    remoteSort: true,
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getActividad'}, ModuleMgr.get('GestionCampanna')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
});