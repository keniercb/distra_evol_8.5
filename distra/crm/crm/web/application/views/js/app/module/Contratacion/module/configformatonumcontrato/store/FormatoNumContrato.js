Ext.define('ConfigFormatoNumContrato.store.FormatoNumContrato', {
    extend: 'Ext.data.Store',
    fields: ['idformatonumcontrato', 'denominacion', 'preview'],
    storeId: 'stFormatoNumContrato',
    proxy: {
        type: 'ajax',
        url: (function(){
            var nomModule = ModuleMgr.get('Nomencladores').moduleCfg;
            return '/' + nomModule.getBasePath() + 'index.php/configurarformatonumcontrato/cargarFormatosNumContrato';
            // return '/' + nomModule.getBasePath() + 'index.php/nomenclador/getModel';
        })(),
        extraParams: {
            modelName: 'NomFormatoNumContrato',
        },
        url: UtilsFn.buildUrl({action: 'getModel'}, ModuleMgr.get('Nomencladores')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});
