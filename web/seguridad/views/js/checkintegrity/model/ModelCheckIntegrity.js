/**
 * Created by kmilo on 8/6/2018.
 */

Ext.define('CheckIntegrity.model.ModelCheckIntegrity', {
    extend : 'Ext.data.Model',
    fields  : [
        {name : 'id'},
        {name : 'violacion'},
        {name : 'fechaanalisis'},
        {name : 'log'},
        {name : 'estaInstaladoAIDE'},
        {name : 'escaneoActivo'}
    ]

});