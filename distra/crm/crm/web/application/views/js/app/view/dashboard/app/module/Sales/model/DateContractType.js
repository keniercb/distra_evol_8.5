Ext.define('Sales.model.DateContractType', {
  extend : 'Ext.data.Model',
  fields : [{
    name : 'clientnumber',
    type : 'string'
  }, {
    name : 'clientname',
    type : 'string'
  }, {
    name : 'clienttime',
    type : 'int'
  }, {
    name : 'clientamount',
    type : 'float'
  },{
    name : 'providernumber',
    type : 'string'
  }, {
    name : 'providername',
    type : 'string'
  }, {
    name : 'providertime',
    type : 'int'
  }, {
    name : 'provideramount',
    type : 'float'
  }]
});
