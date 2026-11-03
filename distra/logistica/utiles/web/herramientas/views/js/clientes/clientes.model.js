Ext.ns('LOG.tools.Clientes');
LOG.tools.Clientes.Model = Ext.extend(LOG.util.Model, {
    primaryKeyField : 'id',
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.urlAccionGuardar = 'unificarClientes';
        LOG.tools.Clientes.Model.superclass.constructor.call(this, config);
    }
});