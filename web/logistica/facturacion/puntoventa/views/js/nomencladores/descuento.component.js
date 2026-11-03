Ext.ns('Ext.erp');

Ext.erp.descuento = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
        var _this = this;
        config.codigo = true;    
        this.campoIdNomenclador = 'iddescuento';
        Ext.apply(this, config);

        this.storeFields = [{
            name: 'porciento'
        }];
        this.columnsFields = [ {
            dataIndex: 'porciento',
            header: _this.idioma.lbPorciento,
            width: 75,
            renderer: function(value, metaData) {
                return value+'%';
            }
        }];

        Ext.erp.descuento.superclass.constructor.call(this, config);
        this.btnNoUsarEntidad.setVisible(false);
        this.btnUsarEntidad.setVisible(false);
    },
    initFormFields: function(){
        var _this = this;
        this.txtValor = LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.lbPorciento,
            name: 'porciento',
            allowBlank: false,
            anchor: '98%'
        });
        this.formFields = [
                    this.txtValor
                ];
    },
    activarBotones: function() {
        this.btnModificar.disable();
        this.btnEliminar.disable();
        this.btnNoUsarEntidad.setVisible(false);
        this.btnUsarEntidad.setVisible(false);
        this.btnHabilitar.disable();
        var _this = this;
        var itemSeleccionado = _this.selectionModeNomenclador.getSelected();
        if (_this.selectionModeNomenclador.getCount() > 0 && itemSeleccionado.id > 0) {
            if (_this.selectionModeNomenclador.getCount() == 1)
                this.btnModificar.enable();
            if (itemSeleccionado.data.estado == 1) {
                this.btnEliminar.enable();
            } else {
                this.btnHabilitar.enable();
            }

            if (itemSeleccionado.id <= 0) {
                this.btnModificar.disable();
                this.btnEliminar.disable();
                this.btnHabilitar.disable();
            }
        }
    }
});
