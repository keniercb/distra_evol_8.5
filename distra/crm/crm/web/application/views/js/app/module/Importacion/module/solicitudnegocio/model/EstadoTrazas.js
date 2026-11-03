Ext.define('SolicitudNegocioImportacion.model.EstadoTrazas', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idestadotrazas'},
        {name: 'idestado'},
        {name: 'estado'},
        {name: 'idusuario'},
        {name: 'usuario'},
        {name: 'idpersona'},
        {name: 'idpersona'},
        {name: 'nombreapellidos'},
        {name: 'area'},
        {name: 'cargo'},
        {name: 'fechainicio'},
        {name: 'fechafin'},
        {name: 'duracionestado'},
        {name: 'iconoestado'},
    ]
});