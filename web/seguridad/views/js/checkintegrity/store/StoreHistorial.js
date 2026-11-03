/**
 * Created by kmilo on 15/6/2018.
 */

Ext.define('CheckIntegrity.store.StoreHistorial', {
    extend  : 'Ext.data.Store',
    model: 'CheckIntegrity.model.ModelHistorial',
    autoLoad: true,
    proxy   : {
        type   : 'ajax',
        url : 'cargarHistorial',
        reader : {
            type : 'json',
            root : 'datos',
            totalProperty: 'total'
        }

    }
});