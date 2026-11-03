Ext.ns('Log.lb.desbloqueo');

Log.lb.desbloqueo.Model = Ext.extend(LOG.util.Model, {
    /**
     * 
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function(config) {

        config.urlAccionEliminar = 'desbloquearDocumento';

        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idbloqueo',
            primary: true
        });

        Log.lb.desbloqueo.Model.superclass.constructor.call(this, config);
    }
});