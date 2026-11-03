Ext.define('GestionContrato.model.Actividad', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'idactividad', type: 'string'},
        {name: 'denominacion', type: 'string'},
        {name: 'tipo', type: 'string'},
        {name: 'humanlabel', type: 'string'},
        {name: 'namecomponent', type: 'string'},
        {name: 'mextype', type: 'string'},
        {name: 'fuente', type: 'array'},
        {name: 'model', type: 'string'},
        {name: 'ruta', type: 'string'},
        {name: 'descripcion', type: 'string'},
        {name: 'idpadre', type: 'string'},
        {name: 'cfg', type: 'array'},
        {name: 'event', type: 'array'},
        {name: 'compartimentacion', type: 'array'},
        {name: 'visibilidad', type: 'boolean'},
        {name: 'obligatorio', type: 'boolean'},
        {name: 'depth', type: 'string'},
        {name: 'index', type: 'string'},
        {name: 'expand', type: 'boolean'}
    ]
});