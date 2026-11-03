Ext.define('Penalizaciones.model.EstadoTrazasPenalizacion', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idpenalidad'},
        {name: 'idestado'},
        {name: 'estado'},
        {name: 'iconoestado'},
        {name: 'idusuario'},
        {name: 'usuario'},
        {name: 'idpersona'},
        {name: 'nombreapellidos'},
        {name: 'fechainicio'},
        {name: 'fechafin'},
        {name: 'duracionestado'},
    ]
});