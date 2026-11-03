Ext.define('ConfContratacion.store.Roles', {
    extend: 'Ext.data.Store',
    model: 'ConfContratacion.model.Rol',
    storeId: 'stTransitionRol',
    groupField: 'nombreproceso'
});
