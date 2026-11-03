Ext.define('GestionContrato.store.Tasa', {
    extend: 'Ext.data.Store',
    requires: 'GestionContrato.model.Tasa',
    model: 'GestionContrato.model.Tasa',
    storeId: 'stTasaContrato',
    autoLoad: false
});