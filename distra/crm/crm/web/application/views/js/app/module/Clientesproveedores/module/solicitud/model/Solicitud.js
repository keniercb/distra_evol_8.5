Ext.define('Solicitud.model.Solicitud', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idsolicitud', type: 'int'},
        {name: 'nombre', type: 'string'},
        {name: 'direccion', type: 'string'},
        {name: 'iddpapais', type: 'int'},
        {name: 'nombredpapais', type: 'string'},
        {name: 'iddpaciudad', type: 'int'},
        {name: 'nombredpaciudad', type: 'string'},
        {name: 'codigopostal', type: 'string'},
        {name: 'telefono', type: 'string'},
        {name: 'correo', type: 'string'},
        {name: 'estado'}
    ]
});