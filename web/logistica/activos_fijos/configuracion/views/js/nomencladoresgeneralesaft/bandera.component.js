/**
 * Created with JetBrains PhpStorm.
 * User: yoendy
 * Date: 8/2/13
 * Time: 8:51 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.erp.bandera = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idbandera';
        Ext.apply(this, config);
        //this.idioma.
        this.codigo = true;
        //this.bussinesModel = 'ColorModel';

        Ext.erp.bandera.superclass.constructor.apply(this, arguments);
    }
});