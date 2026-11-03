/**
 * Created by me on 15/01/16.
 */
Ext.define("Traces.store.UsuarioStore", {
    require:[
        'Ext.data.Store'
    ],
    extend: 'Ext.data.Store',
    model: 'Traces.model.UsuarioModel',

    proxy: {
        type: 'ajax',
        url: 'usuariosConTrazas',
        reader: {
            type: 'json',
            root: 'datos',
            successProperty: 'success'
        }
    },
    autoLoad: true
});