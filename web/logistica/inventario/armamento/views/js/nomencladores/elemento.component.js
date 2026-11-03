/**
 * Created by W-01223 on 23/01/15.
 */
Ext.ns('Ext.erp');

Ext.erp.elemento = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idelemento';
        config.codigo = false;
        Ext.erp.elemento.superclass.constructor.call(this, config);

        _this.btnAdicionar.hide();
        _this.btnModificar.hide();
        _this.btnNoUsarEntidad.hide();
        _this.btnEliminar.hide();
        _this.btnHabilitar.hide();
    },
    activarBotones: function () {
        var _this = this;
        if (_this.selectionModeNomenclador.getCount() > 0 && _this.selectionModeNomenclador.getSelected().id > 0) {
            if (_this.selectionModeNomenclador.getSelected().data.usarentidad) {
                _this.btnUsarEntidad.disable();
            } else {
                _this.btnUsarEntidad.enable();
            }
        } else {
            _this.btnUsarEntidad.enable();
        }
    }

});