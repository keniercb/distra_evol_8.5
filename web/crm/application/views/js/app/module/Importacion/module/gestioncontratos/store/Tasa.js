Ext.define('GestionContratoImportacion.store.Tasa', {
    extend: 'Ext.data.Store',
    requires: 'GestionContratoImportacion.model.Tasa',
    model: 'GestionContratoImportacion.model.Tasa',
    storeId: 'stTasaContratoImportacion',
    autoLoad: false
});