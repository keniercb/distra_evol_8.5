/**
 * Created by jmzaldivar on 14/01/16.
 */
Ext.define('Traces.model.modelGraficasTrazas.GraficasTrazas', {
    extend : 'Ext.data.Model',
    fields  : [
        {name :  'name', mapping: 'categoria'},
        {name : 'data1', mapping: 'valor'}
    ]

});