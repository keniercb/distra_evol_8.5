/**
 * Created by W-01223 on 23/01/15.
 */
Ext.ns('Ext.erp');

Ext.erp.partida = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idpartida';
        config.codigo = false;
        this.formFields = [new Ext.erp.tecladoruso({config:config, principal:this})];
        Ext.erp.partida.superclass.constructor.call(this, config);

        Ext.apply(this.btnHabilitar, {hidden: true});
        _this.selectionModeNomenclador.fireEvent = _this.selectionModeNomenclador.fireEvent.createSequence(function(e) {
            if (e == 'rowselect') {
                if (this.getSelected().data.denominacion == 'S/Datos') {
                    _this.btnModificar.disable();
                    _this.btnNoUsarEntidad.disable();
                    _this.btnUsarEntidad.disable();
                    _this.btnEliminar.disable();
                    if (this.getSelected().data.usarentidad) {
                        _this.btnUsarEntidad.disable();
                    } else {
                        _this.btnUsarEntidad.enable();
                    }
                }
            }
        });
        _this.onBtnAdicionarClick = _this.onBtnAdicionarClick.createSequence(function() {
            Ext.apply(this.fpGestionarNomenclador.items.items[0], {regex : /^[\w\s\-\/ñÑ/áéíóúАБВГДЕЁЖЗЙКЛМИНОПРСТУФХЦЧШЩЪЭЮЯ]+$/});
        });
        _this.onBtnModificarClick = _this.onBtnModificarClick.createSequence(function() {
            Ext.apply(this.fpGestionarNomenclador.items.items[0], {regex : /^[\w\s\-\/ñÑ/áéíóúАБВГДЕЁЖЗЙКЛМИНОПРСТУФХЦЧШЩЪЭЮЯ]+$/});
        });
    }

});