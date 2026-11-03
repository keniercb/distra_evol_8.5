Ext.define('GestionCampanna.model.Campanna', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idcampanna', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'codigo', type: 'string'},
        {name: 'idmoneda', type: 'int'},
        {name: 'codigoiso', type: 'string'},
        {name: 'fechainicio'},
        {name: 'fechafin'} ,
        {name: 'costofijo', type: 'int'},
        {name: 'cantrespuestas', type: 'int'},
        {name: 'idprioridad', type: 'int'},
        {name: 'idusuario', type: 'int'},
        {name: 'nombreusuario', type: 'string'},
        {name: 'descripcion', type: 'string'},
        {name: 'denomprioridad', type: 'string'}
    ]
});