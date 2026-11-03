/**
 * Created by me on 15/01/16.
 */
Ext.define("Traces.store.SubsistemaStore", {
    require:[
        'Ext.data.Store'
    ],
    extend: 'Ext.data.Store',
    model: 'Traces.model.SubsistemaModel',

    proxy: {
        type: 'ajax',
        url: 'sistemasConTrazas',
        reader: {
            type: 'json',
            root: 'datos',
            successProperty: 'success'
        }
    },
    autoLoad: true
});