/**
 * Created with JetBrains PhpStorm.
 * User: yoendy
 * Date: 8/2/13
 * Time: 8:51 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.erp.sector = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        
        config.campoIdNomenclador = 'idsector';
        Ext.apply(this, config);
        var _this = this;
        this.codigo = false;
       // this.bussinesModel = 'ColorModel';

        Ext.erp.sector.superclass.constructor.apply(this, arguments);
        
    },
});