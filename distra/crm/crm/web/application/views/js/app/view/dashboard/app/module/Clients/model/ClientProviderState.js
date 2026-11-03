Ext.define('Clients.model.ClientProviderState', {
  extend : 'Ext.data.Model',
  fields : [{
    name : 'client_name',
    type : 'string'
  }, {
    name : 'amount',
    type : 'float'
  }, {
    name : 'mean',
    type : 'float'
  }, {
    name : 'quantity',
    type : 'int'
  }, {
    name: 'time',
    type: 'date'
  }, {
    name: 'size',
    type: 'int'
  }]
});
