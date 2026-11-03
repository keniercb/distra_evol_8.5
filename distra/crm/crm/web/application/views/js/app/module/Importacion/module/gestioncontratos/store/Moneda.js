Ext.define('GestionContratoImportacion.store.Moneda', {
    extend: 'Ext.data.Store',
    requires: 'GestionContratoImportacion.model.Moneda',
    model: 'GestionContratoImportacion.model.Moneda',
    pageSize: 10,
    autoLoad: true
});