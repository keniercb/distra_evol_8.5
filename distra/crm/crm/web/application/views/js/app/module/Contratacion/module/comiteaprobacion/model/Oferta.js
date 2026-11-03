Ext.define('Comite.model.Oferta', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idoferta'},
        {name: 'nombre'},
        {name: 'idsolicitud'},
        {name: 'solicitud'},
        {name: 'clienteproveedor'},
        {name: 'sector'},
        {name: 'arearesponsable'},
        {name: 'responsable'},
        {name: 'fechainicio'},
        {name: 'fechafirma'},
        {name: 'vigencia'},
        {name: 'idmediopago'},
        {name: 'mediopago'},
        {name: 'idcondicionpago'},
        {name: 'condicionpago'},
        {name: 'montototal'},
        {name: 'numero'},
        {name: 'descripcion'}
    ]
});