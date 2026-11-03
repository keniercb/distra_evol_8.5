/**
 * Created with JetBrains PhpStorm.
 * User: yoendy
 * Date: 8/2/13
 * Time: 8:51 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.erp.nomotrasinstalaciones = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idotrasinstalacionesviv';
        Ext.apply(this, config);
        this.codigo = false;
        //this.bussinesModel = 'ColorModel';

        Ext.erp.nomotrasinstalaciones.superclass.constructor.apply(this, arguments);

    }
});