Ext.ns('LOG.util');

LOG.util.UICrudBase = Ext.extend(LOG.util.UITemplate, {
    nFromColunms : 3,
    columnas : null,
    constructor: function (config) {
        LOG.util.UICrudBase.superclas.constructor.call(this, config)
    }
})