Ext.define('Comite.model.Solicitud', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idsolicitud'},
        {name: 'nombre'},
        {name: 'numerosolicitud'},
        {name: 'idclienteproveedor'},
        {name: 'clienteproveedor'},
        {name: 'idsector'},
        {name: 'sector'},
        {name: 'idarea'},
        {name: 'arearesponsable'},
        {name: 'documento'},
        {name: 'documentourl'},
        {name: 'descripcion'},
        {name: 'fechacreada'},
        {name: 'areasimplicadas'},
        {name: 'idestado'},
        {name: 'estadoicon'},
        {name: 'estado'}
    ]
});