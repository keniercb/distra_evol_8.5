Ext.ns('LOG.fact.magentoadmin');
LOG.fact.magentoadmin.Model = Ext.extend(LOG.util.Model, {});

LOG.fact.magentoadmin.OderVentaModel = Ext.extend(LOG.util.Model, {

    constructor: function (config) {
        config.urlController = '/logistica/facturacion/magentoadmin/index.php/magento/';
        config.urlAccionGuardar = 'insertarOrden';
        LOG.fact.magentoadmin.OderVentaModel.superclass.constructor.call(this, config);
    }
});