/**
 * Created by jmzaldivar on 15/01/16.
 */
Ext.define('Traces.store.storeGraficasTrazas', {
    extend: 'Ext.data.Store',
    model: 'Traces.model.modelGraficasTrazas.GraficasTrazas',

    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'cargarValoresGraficas',
        reader : {
            type          : 'json',
            root          : 'data'
            //successProperty: 'success'
        }
    }
});