Ext.define('RecupClientesProveedores.model.ClientesProveedores', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idclientesproveedores'},
        {name: 'codigocontable'},
        {name: 'descripcion'},
        {name: 'idtipo'},
        {name: 'idclasificacion'},
        {name: 'idclasificacioncontable'},
        {name: 'nombre'},
        {name: 'codigo'},
        {name: 'abreviatura'},
        {name: 'direccion'},
        {name: 'correo'},
        {name: 'telefono'},
        {name: 'foto'},
        {name: 'cantcontratos'},
    ]
});
