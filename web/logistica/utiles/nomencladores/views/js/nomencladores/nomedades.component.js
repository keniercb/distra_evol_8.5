Ext.ns('Ext.erp');

Ext.erp.nomedades = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    idproducto: undefined,
    constructor: function (config) {
        var _this = this;
        this.bussinesModel = 'NomEdadesModel';
        this.campoIdNomenclador = 'idnomedades';
        config.codigo = false;
        config.usarFecha = false;
        this.storeFields = [{
            name: 'desde'
        }, {
            name: 'hasta'
        }];
        this.columnsFields = [{
            header: 'Inicio',
            dataIndex: 'desde'
        }, {
            header: 'Fin',
            dataIndex: 'hasta'
        }];

        Ext.erp.nomedades.superclass.constructor.call(this, config);
        this.columnasNomenclador.config[1].width = 120;
        this.columnasNomenclador.config[2].width = 200;
        this.columnasNomenclador.config[5].hidden = true;
        this.columnasNomenclador.config[6].hidden = true;
    },

     initFormFields: function(){
         var _this =this;
         var desde = new Ext.form.NumberField({
                fieldLabel: _this.idioma.lbDesde,
                name: 'desde',
                anchor: '95%',
                enableKeyEvents: true,
                allowBlank: false,
                regex: _this.idioma.lbRegexEntero,
                regexText: _this.idioma.lbRegexEnteroText,
                invalidText: _this.idioma.msjInicio,
                maxLength: 10,
                maxLengthText : _this.idioma.msgMaxLength,
                listeners: {
                    keyup: function () {
                        this.validate();
                        hasta.validate();
                    }
                },
                validator: function (value) {
                    if (hasta.getValue() > 0) {
                        if (value < hasta.getValue()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                            return true;
                    }

                }

            });
            var hasta = new Ext.form.NumberField({
                fieldLabel: _this.idioma.lbHasta,
                name: 'hasta',
                anchor: '95%',
                enableKeyEvents: true,
                allowBlank: false,
                regex: _this.idioma.lbRegexEntero,
                regexText: _this.idioma.lbRegexEnteroText,
                maxLength: 10,
                maxLengthText : _this.idioma.msgMaxLength,
                invalidText: _this.idioma.msjFin,
                    listeners: {
                    keyup: function () {
                        this.validate();
                        desde.validate();
                    }
                },
                validator: function (value) {
                    if (desde.getValue() > 0) {
                        if (value > desde.getValue()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                            return true;

                    }

                }
            });
        this.formFields = [ new Ext.form.FieldSet({
                    style: '-moz-border-radius:5px',
                    autoHeight: true,
                    layout: 'column',
                    anchor: '98%',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [desde]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [hasta]
                        }
                    ]
                })];
    }

    /*onBtnAdicionarClick: function (id) {
        var _this = this;
        if (!_this.winGestionarNomenclador || !_this.winGestionarNomenclador.isVisible()) {

            var desde = new Ext.form.NumberField({
                fieldLabel: _this.idioma.lbDesde,
                name: 'desde',
                anchor: '95%',
                enableKeyEvents: true,
                allowBlank: false,
                regex: _this.idioma.lbRegexEntero,
                regexText: _this.idioma.lbRegexEnteroText,
                invalidText: _this.idioma.msjInicio,
                listeners: {
                    keyup: function () {
                        this.validate();
                        hasta.validate();
                    }
                },
                validator: function (value) {
                    if (hasta.getValue() > 0) {
                        if (value < hasta.getValue()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                            return true;
                    }

                }

            });
            var hasta = new Ext.form.NumberField({
                fieldLabel: _this.idioma.lbHasta,
                name: 'hasta',
                anchor: '95%',
                enableKeyEvents: true,
                allowBlank: false,
                regex: _this.idioma.lbRegexEntero,
                regexText: _this.idioma.lbRegexEnteroText,
                invalidText: _this.idioma.msjFin,
                    listeners: {
                    keyup: function () {
                        this.validate();
                        desde.validate();
                    }
                },
                validator: function (value) {
                    if (desde.getValue() > 0) {
                        if (value > desde.getValue()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                            return true;

                    }

                }
            });

            if (!this.fpGestionarNomenclador) {
                var field1 = [];
                this.tfDenom = new Ext.form.TextArea({
                    name: 'denominacion',
                    anchor: '98%',
                    fieldLabel: _this.idioma.lbDenominacion,
                    allowBlank: false,
                    regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+([-_/.\s]{0,1}[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)+$/,
                    maxLength: _this.idioma.lbMaxLengthDescripcion,
                    regexText: _this.idioma.lbRegexDescripText,
                    minLength: _this.idioma.lbMinLengthDescripcion,
                    maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
                    minLengthText: _this.idioma.lbMsgMinLongDescripcion
                });
                var fields2 = [this.tfDenom, new Ext.form.FieldSet({
                    style: '-moz-border-radius:5px',
                    autoHeight: true,
                    layout: 'column',
                    anchor: '98%',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [desde]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [hasta]
                        }
                    ]
                }), {
                    xtype: 'hidden',
                    name: _this.campoIdNomenclador,
                    id: 'hd' + _this.campoIdNomenclador
                }];
                var fields = field1.concat(fields2);
                if (this.formFields) {
                    fields = fields.concat(_this.formFields);
                }
                this.fpGestionarNomenclador = new Ext.form.FormPanel({
                    labelAlign: 'top',
                    frame: true,
                    width: 300,
                    autoHeight: true,
                    items: fields,
                    trackResetOnLoad: true
                });
            }

            this.btnAceptar = new Ext.Button({
                text: _this.idioma.lbBtnAceptar,
                tooltip: _this.idioma.lbTtBtnAceptar,
                iconCls: 'aceptar'
            });
            this.btnAplicar = new Ext.Button({
                text: _this.idioma.lbBtnAplicar,
                tooltip: _this.idioma.lbTtBtnAplicar,
                iconCls: 'aplicar'
            });
            this.btnCancelar = new Ext.Button({
                text: _this.idioma.lbBtnCancelar,
                tooltip: _this.idioma.lbTtBtnCancelar,
                iconCls: 'cancelar',
                handler: function () {
                    _this.winGestionarNomenclador.close();
                }
            });

            this.winGestionarNomenclador = new Ext.Window({
                items: [this.fpGestionarNomenclador],
                closeAction: 'hide',
                autoValidate: true,
                validateDefault: true,
                modal: true,
                resizable: false,
                autoHeight: true,
                constrain: true,
                autoWidth: true,
                buttons: [_this.btnCancelar, _this.btnAplicar, _this.btnAceptar]
            });
            this.winGestionarNomenclador.on({
                'beforehide': function () {
                    _this.hotKeyActive = false;
                    _this.fpGestionarNomenclador.getForm().items.each(function (f) {
                        f.originalValue = null;
                    });
                    _this.fpGestionarNomenclador.getForm().reset();
                },
                'beforeclose': function (p) {
                    p.hide();
                    _this.hotKeyActive = false;
                    return false;
                },
                'beforeshow': function () {
                    _this.focusFormFirstElement(_this.fpGestionarNomenclador);
                }
            });
            if (!_this.winGestionarNomenclador.isVisible()) {
                _this.winGestionarNomenclador.show();
                _this.winGestionarNomenclador.doLayout(true);
                _this.hotKeyActive = true;
            }
            Ext.getCmp('hd' + this.campoIdNomenclador).setValue(id);
        }
    },

    onBtnModificarClick: function () {
        var _this = this;
        if (_this.selectionModeNomenclador.getSelected()) {
            _this.onBtnAdicionarClick(_this.selectionModeNomenclador.getSelected().id);
            _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinModificar);
            _this.fpGestionarNomenclador.getForm().loadRecord(_this.selectionModeNomenclador.getSelected());
            _this.hotKeyActive = true;
            _this.btnAceptar.on({
                'click': function () {
                    _this.onBtnAceptarClick(true, function () {
                        mostrarMensaje(1, _this.idioma.lbMsgNomencladorModificado);
                        _this.storeNomenclador.reload();
                        _this.winGestionarNomenclador.close();
                    });
                }
            });
            _this.btnAplicar.setVisible(false);
        } else {
            mostrarMensaje(3, _this.idioma.lbMsgSeleccionarModificar);
        }
    }*/

});
