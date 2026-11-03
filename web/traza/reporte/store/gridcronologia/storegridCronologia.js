/**
 * Created by angel on 28/01/16.
 */
Ext.define('Traces.store.gridcronologia.storegridCronologia', {
    extend: 'Ext.data.Store',
    model: "Traces.model.gridcronologia.modelgridCronologia",
    //sortInfo:{field: 'ip_fecha', direction: "ASC"},
    //sorters: ['ip_fecha'],
    pageSize: 20,
    groupField: 'ip_fecha',
    proxy:{
        type: 'ajax',
        url: 'listarTrazas',
        reader:{
            type: 'json',
            root: 'datos',
            totalProperty : 'cantidad'
        }
    },
    autoload:true
});
