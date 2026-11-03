
Ext.erp.nomvinculacionlaboral = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idvinculacionlaboral';
        Ext.apply(this, config);
        this.codigo = false;
       // this.bussinesModel = 'RegimenModel';

        Ext.erp.nomvinculacionlaboral.superclass.constructor.apply(this, arguments);

    }
});


