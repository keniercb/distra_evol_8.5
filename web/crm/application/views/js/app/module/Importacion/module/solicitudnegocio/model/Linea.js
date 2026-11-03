Ext.define('SolicitudNegocioImportacion.model.Linea', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idlinea', mapping: 'idindicador'},
        {name: 'idtipolinea'},
        {name: 'linea'},
        {name: 'tipolinea'},
        {name: 'idnaturaleza'},
        {name: 'denominacion'},
        {name: 'idindicador'}
    ]
});