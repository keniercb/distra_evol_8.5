Ext.define('GestionContrato.model.EstadosCuenta', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'denominacion'},
        {name: 'numero'},
        {name: 'fechaemision'},
        {name: 'fechaentrega'},
        {name: 'nombrecliente'},
        {name: 'codigoiso'},
        {name: 'codigo'},
        {name: 'importemb'},
        {name: 'liquidadomb'},
        {name: 'pendienteliq'},
        {name: 'numcomprobante'},
        {name: 'concatcta'},
    ]
});
