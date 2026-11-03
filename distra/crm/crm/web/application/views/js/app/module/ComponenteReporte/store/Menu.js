Ext.define('ComponenteReporte.store.Menu', {
    extend: 'Ext.tree.Store',
    requires: 'ComponenteReporte.model.Menu',
    model: 'ComponenteReporte.model.Menu',
    proxy: {
        type: 'ajax',
        url: (function(){
            var nomModule = ModuleMgr.get('ConfiguracionGral').moduleCfg;
            return '/' + nomModule.getBasePath() + 'index.php/componentereportes/getMenuReportes';
        })()
    },
    autoLoad: false,
});
