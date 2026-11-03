Ext.define('ComiteImportacion.model.Opinion', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'idrol', type: 'int'},
        {name: 'nombrerol', type: 'string'},
        {name: 'abreviaturarol', type: 'string'},
        {name: 'nombreestado', type: 'string'},
        {name: 'iconoestado', type: 'string'},
        {name: 'observacion', type: 'string'},
        {name: 'nombrepersona', type: 'string'},
        {name: 'cargopersona', type: 'string'},
        {name: 'fecha'}
    ]
});