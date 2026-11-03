Ext.define('GestionOportunidad.model.Oportunidad', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idoportunidad', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'ingresoestimado', type: 'int'},
        {name: 'fecha'},
        {name: 'idcliente', type: 'int'},
        {name: 'idusuario', type: 'int'},
        {name: 'nombreusuario', type: 'string'},
        {name: 'descripcion', type: 'string'},
        {name: 'idcampanna', type: 'int'},
        {name: 'denomcampanna', type: 'string'},
        {name: 'idprioridad', type: 'int'},
        {name: 'denomprioridad', type: 'string'},
        {name: 'idcanal', type: 'int'},
        {name: 'denomcanal', type: 'string'},
        {name: 'idtipo', type: 'int'},
        {name: 'denomtipo', type: 'string'}
    ]
});