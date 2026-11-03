Ext.define('Seguimiento.model.EstadoTrazas', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idarribo'},
        {name: 'idestado'},
        {name: 'estado'},
        {name: 'iconoestado'},
        {name: 'idusuario'},
        {name: 'usuario'},
        {name: 'idpersona'},
        {name: 'nombreapellidos'},
        {name: 'area'},
        {name: 'cargo'},
        {name: 'fechainicio'},
        {name: 'fechafin'},
        {name: 'duracionestado'},
        {name: 'idestadotrazas'},
    ]
});