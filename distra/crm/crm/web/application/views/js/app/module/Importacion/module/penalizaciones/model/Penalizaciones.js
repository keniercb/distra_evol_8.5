Ext.define('Penalizaciones.model.Penalizaciones', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idpenalidad'},
        {name: 'nombre'},
        {name: 'numero'},
        {name: 'idespaciotrabajo'},
        {name: 'docadicionales'},
        {name: 'idcontrato'},
        {name: 'contrato'},
        {name: 'arribo'},
        {name: 'porciento'},
        {name: 'tipopenalidad'},
        {name: 'estado'},
        {name: 'idestado'},
        {name: 'iconoestado'},
        {name: 'idarribo'},
        {name: 'idtipopenalidad'},
        {name: 'fechaestado'},
        {name: 'clienteproveedor'},
        {name: 'descripcion'}
    ]
});