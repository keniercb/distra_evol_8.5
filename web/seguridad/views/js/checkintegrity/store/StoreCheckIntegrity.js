/**
 * Created by kmilo on 8/6/2018.
 */
Ext.define('CheckIntegrity.store.StoreCheckIntegrity', {
    extend  : 'Ext.data.Store',
    model: 'CheckIntegrity.model.ModelCheckIntegrity',
    pageSize: 20,
    proxy   : {
        type   : 'ajax',
        url : 'cargarDatosIniciales',
        reader : {
            type : 'json',
            root : 'datos',
        }

    }
});