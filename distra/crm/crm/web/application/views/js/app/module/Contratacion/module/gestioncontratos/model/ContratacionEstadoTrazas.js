Ext.define('GestionContrato.model.ContratacionEstadoTrazas', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idcontrato'},
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
    ]
});