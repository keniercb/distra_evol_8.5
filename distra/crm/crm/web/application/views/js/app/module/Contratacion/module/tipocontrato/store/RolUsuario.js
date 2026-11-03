Ext.define('TipoContrato.store.RolUsuario', {
    extend: 'Ext.data.Store',
    requires: 'TipoContrato.model.RolUsuario',
    model: 'TipoContrato.model.RolUsuario',
    storeId: 'RolUsuario',
    autoLoad: false

});