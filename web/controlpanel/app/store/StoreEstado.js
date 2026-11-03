Ext.define('Controlpanel.store.estado', {
    require : [
        'Ext.data.Store'
    ],
    extend  : 'Ext.data.Store',
    model: 'Controlpanel.model.estado',

    data : [
        {name: 'Instalado'},
        {name: 'No instalado'},
        {name: 'Desactualizado'}
    ],
    autoLoad: true

    //store.load();
});
