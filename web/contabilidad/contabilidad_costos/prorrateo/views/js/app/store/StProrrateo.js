Ext.define('PRT.store.StProrrateo', {
    extend: 'Ext.data.Store',

    model: 'PRT.model.MdProrrateo',
    autoLoad: false,
    storeId: 'stProrrateo',
    groupField: 'nomnivelprorrateo',
    proxy: {
        type: 'ajax',
        api: {
            read: 'loadProrrateos',
            create: 'addModProrrateo',
            update: 'addModProrrateo'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});