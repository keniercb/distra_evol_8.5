Ext.define('Reclamaciones.model.ReclamacionEstadoTrazas', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idreclamacion'},
        {name: 'idestado'},
        {name: 'estado'},
        {name: 'iconoestado'},
        {name: 'idusuario'},
        {name: 'usuario'},
        {name: 'idpersona'},
        {name: 'nombreapellidos'},
        {name: 'area'},
        {name: 'fechainicio'},
        {name: 'fechafin'},
        {name: 'duracionestado'},
    ]
});