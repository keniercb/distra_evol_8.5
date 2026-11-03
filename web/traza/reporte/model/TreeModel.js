/**
 * Created by me on 22/01/16.
 */

Ext.apply(Ext.data.SortTypes, {
    asFecha: function(fecha){
        var array = fecha.split('/');
        var date = array[1]+'/'+array[0]+'/'+array[2]
        return new Date(date);
    }
});

Ext.define('Traces.model.TreeModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idtraza'},
        {name: 'usuario_sesion'},
        {name: 'text'},
        {name: 'tipo'},
        {name: 'fecha', sortType: 'asFecha'},
        {name: 'hora'},
        {name: 'subsistema'},
        {name: 'funcionalidad_accion'},
        {name: 'funcionalidad_integracion'},
        {name: 'tiempoejecucion_accion'},
        {name: 'tiempoejecucion_integracion'},
        {name: 'memoria_accion'},
        {name: 'memoria_integracion'},
        {name: 'identidad'},
        {name: 'tipotraza'}
    ]
});