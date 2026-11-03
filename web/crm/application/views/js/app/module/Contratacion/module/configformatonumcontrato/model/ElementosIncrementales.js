Ext.define('ConfigFormatoNumContrato.model.ElementosIncrementales', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'identidadformatonumcontratoincremento', type: 'int'},
        {name: 'valorinicial'},
        {name: 'valor'},
        {name: 'idformatonumcontratoelemento', type: 'int'},
        {name: 'denominacion', type: 'string'},
        {name: 'identidadformatonumcontrato'},
        {name: 'info'}
    ]
});
