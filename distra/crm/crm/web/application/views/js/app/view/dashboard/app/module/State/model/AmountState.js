Ext.define('State.model.AmountState', {
  extend : 'Ext.data.Model',
  fields : [{
    name : 'state_name',
    type : 'string'
  }, {
    name : 'amount',
    type : 'float'
  }, {
    name : 'mean',
    type : 'float'
  }, {
    name : 'quantity',
    type : 'integer'
  }]
});
