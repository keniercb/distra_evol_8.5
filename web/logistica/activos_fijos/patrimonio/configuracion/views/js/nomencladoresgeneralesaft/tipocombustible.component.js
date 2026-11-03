/**
 *  Kenier Cumba Bueno
 *  24/07/2013
 */
Ext.ns('Ext.erp');

/*
 *  Implemetación del componente para la gestión de Tipo combustible
 */
Ext.erp.tipocombustible = Ext.extend(Ext.erp.treePanelNomenclador, {
    constructor: function (config) {
        config.campoIdNomenclador = 'idtipocombustible';
        Ext.apply(this, config);
        this.codigo = false;
        Ext.erp.tipocombustible.superclass.constructor.call(this, arguments);
    }
});
