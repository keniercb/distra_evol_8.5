/**
 * Created by me on 15/01/16.
 */
Ext.define("Traces.store.IpStore", {
    require:[
        'Ext.data.Store'
    ],
    extend: 'Ext.data.Store',
    model: 'Traces.model.IpModel',

    proxy: {
        type: 'ajax',
        url: 'ipsConTrazas',
        reader: {
            type: 'json',
            root: 'datos',
            successProperty: 'success'
        }
    },
    autoLoad: true
});