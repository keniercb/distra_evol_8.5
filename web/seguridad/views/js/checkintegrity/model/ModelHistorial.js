/**
 * Created by kmilo on 15/6/2018.
 */

Ext.define('CheckIntegrity.model.ModelHistorial', {
    extend : 'Ext.data.Model',
    fields  : [
        {name : 'id'},
        {name : 'violacion'},
        {name : 'fechaanalisis'},
        {name : 'log'},
        {name : 'ultimoescaneo'},
        {name : 'escaneoautomatico'}
    ]

});