Ext.define('Packed.store.dependencias', {
    require : [
        'Ext.data.Store'
    ],
    extend  : 'Ext.data.Store',
    model: 'Packed.model.dependencias',
    proxy   : {
        type   : 'ajax',
        url : 'getRequireIsNotPackages',
        reader : {
            type          : 'json',
            root          : 'datos',
            totalProperty : 'cantidad'
        }

    }

});

