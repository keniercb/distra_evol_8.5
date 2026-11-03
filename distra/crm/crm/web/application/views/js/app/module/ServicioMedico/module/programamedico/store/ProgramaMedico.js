Ext.define('ProgramaMedico.store.ProgramaMedico', {
    extend: 'Ext.data.Store',
    requires: 'ProgramaMedico.model.ProgramaMedico',
    model: 'ProgramaMedico.model.ProgramaMedico',
    // remoteFilter: true,
    // remoteSort: true,
    // pageSize:10,
    proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getProgramasMedicos'}, ModuleMgr.get('ProgramaMedico')),
        actionMethods: {read: 'POST'},
        reader: {
            root: 'datos',
            totalProperty: 'cantidad',
            successProperty: 'success'
        }
    }
});
