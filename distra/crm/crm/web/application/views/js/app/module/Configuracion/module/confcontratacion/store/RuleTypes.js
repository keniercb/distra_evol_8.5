Ext.define('ConfContratacion.store.RuleTypes', {
    extend: 'Ext.data.Store',
    fields: ['idtiporegla', 'tiporegla'],
    data: [
        {idtiporegla: 1, tiporegla: 'Voto obligatorio'},
        {idtiporegla: 2, tiporegla: 'Cantidad de votos'},
        {idtiporegla: 3, tiporegla: 'Cantidad de d\xEDas ( voto autom\xE1tico )'},
        {idtiporegla: 4, tiporegla: 'Cantidad de d\xEDas ( plazo de votaci\xF3n )'}
    ]
});
