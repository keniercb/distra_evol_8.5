Ext.define('GestionContrato.store.Moneda', {
    extend: 'Ext.data.Store',
    requires: 'GestionContrato.model.Moneda',
    model: 'GestionContrato.model.Moneda',
    pageSize: 10,
    autoLoad: true
});