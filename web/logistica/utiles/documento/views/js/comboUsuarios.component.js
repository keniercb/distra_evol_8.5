Ext.ns('LOG.lb.documento');

LOG.lb.documento.ComboUsuarios = Ext.extend(LOG.util.ComboBox, {
    /**
     * 
     */
    valueField: 'idusuario',
    /**
     * 
     */
    displayField: 'nombreusuario',
    /**
     * 
     */
    url: '/logistica/utiles/documento/index.php/documentologistica/cargarUsuarios',
    /**
     * 
     */
    campo: 'idusuario',
    /**
     * 
     * @type type
     */
    alias: undefined,
    /**
     * 
     * @type type
     */
    subsistema: undefined,
    /**
     * 
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function(config) {
        LOG.util.UIManager.apply(this, config);
        LOG.lb.documento.ComboUsuarios.superclass.constructor.call(this, config);
    },
    initStore: function() {
        var _this = this;
        var store = LOG.lb.documento.ComboUsuarios.superclass.initStore.call(this);
        store.on({
            'beforeload': function() {
                store.baseParams.campo = _this.campo;
                store.baseParams.alias = _this.alias;
                store.baseParams.subsistema = _this.subsistema;
                store.baseParams.exception = true;
            }
        });
        return store;
    }
});

Ext.ComponentMgr.registerType('combousuariosdoc', LOG.lb.documento.ComboUsuarios);

