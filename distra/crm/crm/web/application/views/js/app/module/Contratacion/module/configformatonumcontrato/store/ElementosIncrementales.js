Ext.define('ConfigFormatoNumContrato.store.ElementosIncrementales', {
    extend: 'Ext.data.Store',
    model: 'ConfigFormatoNumContrato.model.ElementosIncrementales',
    storeId: 'stElementosIncrementales',
    proxy: {
        type: 'ajax',
        url: (function(){
            var nomModule = ModuleMgr.get('Nomencladores').moduleCfg;
            return '/' + nomModule.getBasePath() + 'index.php/configurarformatonumcontrato/cargarElementosIncrementales';
        })(),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'cant',
            successProperty: 'success'
        }
    }
});
