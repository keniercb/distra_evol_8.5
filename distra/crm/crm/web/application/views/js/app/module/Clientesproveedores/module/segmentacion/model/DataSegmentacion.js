Ext.define('Segmentacion.model.DataSegmentacion', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idsegmentacion', type: 'int'},
        {name: 'select', type: 'array'},
        {name: 'where', type: 'array'},
        {name: 'segmentacion', type: 'string'},
        {name: 'descripcion', type: 'string'},
    ]
});