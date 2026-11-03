Ext.define('ConfContratacion.store.Transitions', {
    extend: 'Ext.data.Store',
    model: 'ConfContratacion.model.Transition',
    storeId: 'stConfTransitions',
    groupField: 'nombreproceso'
});
