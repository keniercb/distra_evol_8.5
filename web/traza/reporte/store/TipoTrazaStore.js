/**
 * Created by me on 15/01/16.
 */
Ext.define("Traces.store.TipoTrazaStore", {
    require:[
        'Ext.data.Store'
    ],
    extend: 'Ext.data.Store',
    model: 'Traces.model.TipoTrazaModel',

    proxy: {
        type: 'ajax',
        url: 'cargarcombotipo',
        reader: {
            type: 'json',
            root: 'tipo_traza',
            successProperty: 'success'
        }
    },
    autoLoad: true
});