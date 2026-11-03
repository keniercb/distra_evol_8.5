
Ext.erp.nomtipologia = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idtipologia';
        Ext.apply(this, config);
        this.codigo = false;
        //this.bussinesModel = 'NomTipologiaModel';

        Ext.erp.nomtipologia.superclass.constructor.apply(this, arguments);

    },

    initFormFields: function() {
        var _this = this;
        Ext.apply(this.tfDenom, {
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)([-_/.\s]?[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9])*$/
        });
    }
});


