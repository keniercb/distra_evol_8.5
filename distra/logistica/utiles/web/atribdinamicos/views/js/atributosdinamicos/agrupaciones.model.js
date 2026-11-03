Ext.ns('LOG.lb.agrupaciones');
LOG.lb.agrupaciones.Model = Ext.extend(LOG.util.Model, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.urlAccionGuardar = 'adicionarAgrupacion';
        config.urlAccionEliminar = 'eliminarAgrupaciones';
        config.urlController = '/logistica/utiles/atribdinamicos/index.php/agrupaciones/';
        config.fields = [
            {primary: true, name: 'idagrupacion'},
            {name: 'denominacion'}
        ];
        LOG.lb.agrupaciones.Model.superclass.constructor.call(this, config);
    }
});
