Ext.define('OfertaNegocioImportacion.model.OfertaEstadoTrazas', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idofertaestado'},
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
        {name: 'duracionestado'}
    ]
});