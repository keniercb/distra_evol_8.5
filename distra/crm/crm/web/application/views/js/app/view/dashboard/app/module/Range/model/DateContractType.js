Ext.define('Range.model.DateContractType', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'clientquantity',
        type: 'int'
    }, {
        name: 'clienttotalamount',
        type: 'float'
    }, {
        name: 'clientminamount',
        type: 'float'
    }, {
        name: 'clientmeanamount',
        type: 'float'
    }, {
        name: 'clientmaxamount',
        type: 'float'
    }, {
        name: 'clienttime',
        type: 'date'
    }, {
        name: 'cluster',
        type: 'int'
    }]
});
