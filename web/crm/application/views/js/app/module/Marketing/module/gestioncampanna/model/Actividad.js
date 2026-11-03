Ext.define('GestionCampanna.model.Actividad', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idactividad', type: 'int'},
        {name: 'presupuesto', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'fechainicio'},
        {name: 'fechafin'} ,
        {name: 'descripcion', type: 'string'},
        {name: 'idcampanna', type: 'int'},
        {name: 'idprioridad', type: 'int'},
        {name: 'idcanal', type: 'int'},
        {name: 'denomcanal', type: 'string'},
        {name: 'denomprioridad', type: 'string'},
        {name: 'clientesmodificados', type: 'array'},
        {name: 'clienteseliminados', type: 'array'}
    ]
});