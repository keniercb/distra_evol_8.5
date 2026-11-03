/**
 * Created by me on 27/01/16.
 */
Ext.define('Traces.model.DetallesModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'referencia'},
        {name: 'accion'},
        {name: 'codigo'},
        {name: 'idioma'},
        {name: 'tipo'},
        {name: 'mensaje'},
        {name: 'descripcion'},
        {name: 'log'},
        {name: 'esquema'},
        {name: 'tabla'},
        {name: 'dato'},
        {name: 'origen'},
        {name: 'interno'},
        {name: 'tipobloqueo'}
    ]
});