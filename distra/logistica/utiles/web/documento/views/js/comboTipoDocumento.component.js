Ext.ns('LOG.lb.documento');

LOG.lb.documento.ComboTipoDocumento= Ext.extend(LOG.util.ComboBox, {
    /**
     * 
     */
    valueField: 'iddoc',
    /**
     * 
     */
    displayField: 'denominacion',
    /**
     * 
     * @type type
     */
    subsistema: undefined,
    /**
     * 
     */
    url: '/logistica/utiles/documento/index.php/documentologistica/cargarTipoDocumento',
    
    constructor: function(config) {
        LOG.util.UIManager.apply(this, config);
        LOG.lb.documento.ComboTipoDocumento.superclass.constructor.call(this, config);
    },
    initStore: function() {
        var _this = this;
        var store = LOG.lb.documento.ComboTipoDocumento.superclass.initStore.call(this);
        store.on({
            'beforeload': function() {
                
                store.baseParams.subsistema = _this.subsistema;
                store.baseParams.exception = true;
            }
        });
        return store;
    }
});

Ext.ComponentMgr.registerType('combotipodoc', LOG.lb.documento.ComboTipoDocumento);

