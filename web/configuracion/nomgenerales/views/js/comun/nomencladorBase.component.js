Ext.ns('Ext.erp');

Ext.apply(Ext.form.VTypes, {
    daterange: function(val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
                //this.dateRangeMax = date;
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }

        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    }
});
Ext.override(Ext.form.Field, {
    enableKeyEvents: true,
    focused: false,
    fireEvent: Ext.form.Field.prototype.fireEvent.createInterceptor(function(e) {
        if (e == 'blur') {
            this.focused = false;
        }
        if (e == 'focus') {
            this.focused = true;
        }
    })
});


Ext.erp.nomencladorBase = Ext.extend(Ext.Panel, {
    /**
     **/
    bussinesModel: null,
    /**
     * Bandera para controlar si se esta ejecutando un accion 
     */
    hotKeyActive: false,
    /**
     *
     */
    constructor: function(config) {
        var _this = this;

        this.btnAdicionar = new Ext.Button({
            text: _this.idioma.lbBtnAdicionar,
            tooltip: _this.idioma.lbTtBtnAdicionar,
            iconCls: 'adicionar'
        });
        this.buscar = false;

        this.btnModificar = new Ext.Button({
            text: _this.idioma.lbBtnModificar,
            tooltip: _this.idioma.lbTtBtnModificar,
            iconCls: 'modificar',
            disabled: true
        });

        this.btnEliminar = new Ext.Button({
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.lbTtBtnEliminar,
            iconCls: 'eliminar',
            disabled: true
        });

        this.btnUsarEntidad = new Ext.Button({
            text: _this.idioma.lbBtnUsar,
            tooltip: _this.idioma.tipBtnUsar,
            iconCls: 'usarentidad verde',
            disabled: true
        });

        this.btnNoUsarEntidad = new Ext.Button({
            text: _this.idioma.lbBtnNoUsar,
            tooltip: _this.idioma.tipBtnNoUsar,
            iconCls: 'usarentidad rojo',
            disabled: true,
            hidden: true
        });

        this.btnHabilitar = new Ext.Button({
            text: _this.idioma.lbBtnHabilitar,
            tooltip: _this.idioma.tipBtnHabilitar,
            iconCls: 'habilitar',
            disabled: true
        });

        this.btnAyuda = new Ext.Button({
            text: _this.idioma.lbBtnAyuda,
            tooltip: _this.idioma.lbTtBtnAyuda,
            id: _this.campoIdNomenclador,
            iconCls: 'ayuda'
        });

        this.btnBuscar = new Ext.Button({
            text: _this.idioma.lbBtnBuscar,
            tooltip: _this.idioma.tipBtnBuscar,
            iconCls: 'buscar'
        });

        this.btnLimpiar = new Ext.Button({
            text: _this.idioma.lbBtnLimpiar,
            tooltip: _this.idioma.tipBtnLimpiar,
            iconCls: 'limpiar'
        });

        var btns = [this.btnAdicionar, this.btnModificar, this.btnEliminar, '-', this.btnUsarEntidad, this.btnNoUsarEntidad, this.btnHabilitar]

        if (this.tbarBtns) {

            btns = btns.concat(this.tbarBtns);
        }
        btns = btns.concat(['->', this.btnAyuda]);

        this.panelBotones = new Ext.Panel({
            tbar: btns,
            border: false,
            region: 'north'
        });
        /**vcv
         * Kenier: Esto lo comente porque estaba generando un error en la UI
         **/   //this.id = _this.idioma.idNomenclador;


        document.onkeyup = function(e) {
            if ((!_this.winGestionarNomenclador || !_this.winGestionarNomenclador.isVisible()) && !_this.hotKeyActive) {

                if (e.altKey) {
                    if (e.which == Ext.EventObject.I) {
                        if (_this.btnAdicionar) {

                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionar.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionar.disabled == false) {
                                Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionar.fireEvent('click');
                                Ext.getCmp('tabPanelCentral').getActiveTab().activaFuncionBotonesAdd();
                                _this.hotKeyActive = true;
                            }
                        }

                    } else if (e.which == Ext.EventObject.M) {
                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar) {
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar.disabled == false) {
                                //  Ext.getCmp('tabPanelCentral').getActiveTab().onBtnModificarClick(Ext.getCmp('tabPanelCentral').getActiveTab());
                                Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar.fireEvent('click');
                                _this.hotKeyActive = true;
                            }
                        }
                    } else if (e.which == Ext.EventObject.B) {
                        Ext.getCmp('tabPanelCentral').getActiveTab().btnBuscar.fireEvent('click');
                    } else if (e.which == Ext.EventObject.L) {
                        Ext.getCmp('tabPanelCentral').getActiveTab().btnLimpiar.fireEvent('click');
                    }
                }
                if (e.which == Ext.EventObject.DELETE) {
                    if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar) {
                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar.disabled == false) {
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().selectionModeNomenclador.getSelected()) {
                                Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar.fireEvent('click');

                                _this.hotKeyActive = true;
                            }
                        }
                    }
                }

            }

            if (e.altKey) {
                if (e.which == Ext.EventObject.X) {
                    if (_this.winGestionarNomenclador && _this.winGestionarNomenclador.isVisible()) {
                        _this.winGestionarNomenclador.close();
                    }
                }
            }
            if (e.ctrlKey) {
                if (e.altKey) {
                    if (e.which == Ext.EventObject.P && _this.isActiveButton(_this.btnAplicar) && !_this.tfDenom.focused) {
                        if (_this.winGestionarNomenclador && _this.winGestionarNomenclador.isVisible()) {
                            _this.btnAplicar.fireEvent('click');
                        }
                    }
                }
            }
            if (e.which == Ext.EventObject.ENTER && _this.isActiveButton(_this.btnAceptar) && !_this.tfDenom.focused) {
                if (_this.winGestionarNomenclador && _this.winGestionarNomenclador.isVisible()) {
                    _this.btnAceptar.fireEvent('click');
                }
            }

        };
        Ext.erp.nomencladorBase.superclass.constructor.call(this, config);
    },
    /**
     *
     */
    onBtnAdicionarClick: function(id) {
        var _this = this;
        if (!_this.winGestionarNomenclador || !_this.winGestionarNomenclador.isVisible()) {
            var fecha = new Date();

            if (!this.idFechaInicio) {
                this.idFechaInicio = fecha.getTime() + 'desde';
                this.idFechaFin = fecha.getTime() + 'hasta';
            }

            if (!this.fpGestionarNomenclador) {
                var field1 = [];
                if (_this.codigo) {
                    field1 = [new Ext.form.TextField({
                            name: 'codigo',
                            id: fecha.getTime(),
                            anchor: '98%',
                            maskRe: (!_this.alfanumerico) ? /^[0-9]/ :null,
                            regex: (!_this.alfanumerico) ? _this.idioma.lbRegexCodigo: null,
                            regexText: (!_this.alfanumerico) ? _this.idioma.lbRegexCodigoText:null,
                            maxLength: _this.idioma.lbMaxLengthCodigo,
                            minLength: _this.idioma.lbMinLengthCodigo,
                            maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
                            minLengthText: _this.idioma.lbMsgMinLongCodigo,
                            hidden: !_this.codigo,
                            disabled: !_this.codigo,
                            fieldLabel: _this.idioma.lbCodigo,
                            allowBlank: false
                        })];
                }
                this.tfDenom = new Ext.form.TextArea({
                    name: 'denominacion',
                    anchor: '98%',
                    fieldLabel: _this.idioma.lbDenominacion,
                    allowBlank: false,
                    //regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+([-_/.\s]{0,1}[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)+$/,
                  //  regex: LOG.util.Regex.general,
                    maxLength: _this.idioma.lbMaxLengthDescripcion,
                    regexText: _this.idioma.lbRegexDescripText,
                    minLength: _this.idioma.lbMinLengthDescripcion,
                    maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
                    minLengthText: _this.idioma.lbMsgMinLongDescripcion
                });
                var fields2 = [this.tfDenom];
                if (_this.usarFecha) {
                    var fieldFecha = new Ext.form.FieldSet({
                        //autoWidth: true,
                        style: '-moz-border-radius:5px',
                        autoHeight: true,
                        layout: 'column',
                        anchor: '98%',
                        items: [
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        fieldLabel: 'Fecha inicio',
                                        xtype: 'datefield',
                                        vtype: 'daterange',
                                        name: 'fechainicio',
                                        id: _this.idFechaInicio,
                                        //minValue: this.value ? this.value :fecha.format('d/m/Y'),
                                        endDateField: _this.idFechaFin,
                                        value: fecha.format('d/m/Y'),
                                        anchor: '95%',
                                        format: 'd/m/Y',
                                        enableKeyEvents: true,
                                        mode: 'local',
                                        readOnly: true
                                    }
                                ]
                            },
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        fieldLabel: 'Fecha fin',
                                        xtype: 'datefield',
                                        vtype: 'daterange',
                                        name: 'fechafin',
                                        id: _this.idFechaFin,
                                        startDateField: _this.idFechaInicio,
                                        anchor: '95%',
                                        format: 'd/m/Y',
                                        enableKeyEvents: true,
                                        mode: 'local',
                                        allowBlank: true,
                                        readOnly: true
                                    }
                                ]
                            }
                        ]
                    });
                    var fields2 = fields2.concat(fieldFecha);

                }
                fields2 = fields2.concat({
                    xtype: 'hidden',
                    name: _this.campoIdNomenclador,
                    id: 'hd' + _this.campoIdNomenclador
                });
                var fields = field1.concat(fields2);
                if (typeof this.initFormFields == 'function') {
                    this.initFormFields.createDelegate(this).call();
                }
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
            if (_this.usarFecha) {
                Ext.getCmp(this.idFechaInicio).setValue(fecha);
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
                handler: function() {
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
                'beforehide': function() {
                    _this.hotKeyActive = false;
                    _this.fpGestionarNomenclador.getForm().items.each(function (f) {
                        if (f.name != 'facturacion') {
                            f.originalValue = null;
                        }
                    });
                    _this.fpGestionarNomenclador.getForm().reset();
                },
                'beforeclose': function(p) {
                    p.hide();
                    _this.hotKeyActive = false;
                    return false;
                },
                'beforeshow': function() {
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
    focusFormFirstElement: function(form) {
        var i = 0;

        while (form.getComponent(i)) {
            if (!form.getComponent(i).disabled) {

                form.getComponent(i).focus(false, 500);
                return;
            }

            i++;
        }
    },
    onBtnModificarClick: function() {
        var _this = this;
        if (_this.selectionModeNomenclador.getSelected()) {
            _this.onBtnAdicionarClick(_this.selectionModeNomenclador.getSelected().id);
            _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinModificar);
            if (_this.usarFecha) {
                _this.fpGestionarNomenclador.getForm().items.items[2].setMinValue(_this.selectionModeNomenclador.getSelected().data.fechainicio);
            }
            _this.fpGestionarNomenclador.getForm().loadRecord(_this.selectionModeNomenclador.getSelected());
            _this.hotKeyActive = true;

            _this.btnAceptar.on({
                'click': function() {

                    _this.onBtnAceptarClick(true, function() {

                        mostrarMensaje(1, _this.idioma.lbMsgNomencladorModificado);
                        _this.storeNomenclador.reload();
                        // _this.treeLoader.reload();
                        _this.winGestionarNomenclador.close();
                    });
                }
            });
            _this.btnAplicar.setVisible(false);
        } else {
            mostrarMensaje(3, _this.idioma.lbMsgSeleccionarModificar);
        }
    },
    activaFuncionBotonesAdd: function() {
        var _this = this;
        _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinAdicionar);
        _this.btnAceptar.on({
            'click': function() {
                _this.onBtnAceptarClick(false, function() {
                    mostrarMensaje(1, _this.idioma.lbMsgNomencladorAdicionado);
                    if (_this.storeNomenclador)
                        _this.storeNomenclador.reload();
                    _this.winGestionarNomenclador.close();
                });
            }
        });

        _this.btnAplicar.on({
            'click': function() {
                _this.onBtnAceptarClick(false, function() {
                    mostrarMensaje(1, _this.idioma.lbMsgNomencladorAdicionado);

                    if (_this.storeNomenclador)
                        _this.storeNomenclador.reload();
                    _this.fpGestionarNomenclador.getForm().reset();
                    _this.focusFormFirstElement(_this.fpGestionarNomenclador);
                });
            }
        });
    },
    /**
     *
     */
    onBtnAceptarClick: function(modificar, _fn, msgerr) {

        var _this = this;
        var msgWait = (modificar == true) ? _this.idioma.lbMsgWaitModificado : _this.idioma.lbMsgWaitAdicionado;
        var url = _this.urlController + ((modificar == false) ? 'insertarnomenclador' : 'modificarnomenclador');
        var tempFp = _this.fpGestionarNomenclador.getForm();
        if (!tempFp.isValid()) {
            mostrarMensaje(3, _this.idioma.lbMsgCamposInvalidos);
            return;
        }
        tempFp.submit({
            url: url,
            waitMsg: msgWait,
            method: 'POST', params: {
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel
            },
            success: function(form, action) {

                if (typeof _fn == 'function') {
                    _fn.call();
                }
            },
            failure: function(form, action) {
                if (action.result.codigoRes && action.result.codigoMsg == '1') {
                    mostrarMensaje(1, (msgerr) ? msgerr : _this.idioma[action.result.codigoRes]);
                } else if (action.result.codigoRes && action.result.codigoMsg == '3') {
                    mostrarMensaje(1, _this.idioma[action.result.codigoRes]);

                } else if (action.result.codigoRes && action.result.codigoMsg == '4') {
                    mostrarMensaje(1, "No se puede modificar el cambio de clasificacion. Tiene cuentas con movimientos asociados.", function () {
                        
                    });
                }else {
                    mostrarMensaje(1, (modificar == true) ? _this.idioma.msjModDescexist : _this.idioma.msjAddDescexist);
                }
            }
        });
    },
    /**
     *
     */
    onAceptarEliminar: function(idnomencladores, _fn, msgp, msgr, msge) {//msgp, msge y msgr se utiliza en casos como marca modelo
        var _this = this;
        _this.hotKeyActive = true;
        mostrarMensaje(2, (msgp) ? msgp : _this.idioma.lbMsgConfirmarEliminar, function(btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.lbMsgEliminandoNomenclador);
                Ext.Ajax.request({
                    url: _this.urlController + 'eliminarnomenclador',
                    params: {
                        idnom: Ext.encode(idnomencladores),
                        pkid: _this.campoIdNomenclador,
                        modelo: _this.modelo
                    },
                    method: 'POST',
                    callback: function(o, s, r) {
                        var dataResp = Ext.decode(r.responseText);
                        Ext.getBody().unmask();
                        if (dataResp.success) {
                            mostrarMensaje(1, (msgr) ? msgr : _this.idioma.lbMsgNomencladorEliminado);

                            if (typeof _fn == 'function') {
                                _fn.call();
                            }
                        } else {
                            mostrarMensaje(3, (msge) ? msge : _this.idioma.lbMsgErrorEliminado);
                        }
                    }
                });
            }
            _this.hotKeyActive = false;
        });
    },
    /**
     *
     */
    onAceptarUsarEntidad: function(idnomencladores, valorUsar, _fn) {
        var _this = this;
        if (valorUsar == 1 || valorUsar == 2) {
            Ext.getBody().mask(valorUsar == 1 ? _this.idioma.lbMsgAsociandoNomenclador : _this.idioma.lbMsgNoAsociandoNomenclador);
            Ext.Ajax.request({
                url: 'habilitardesabiltarentidad',
                params: {
                    idnom: Ext.encode(idnomencladores),
                    pkid: _this.campoIdNomenclador,
                    modelo: _this.modelo,
                    bussines: _this.bussinesModel,
                    habilitarentidad: valorUsar
                },
                method: 'POST',
                callback: function(o, s, r) {
                    var dataResp = Ext.decode(r.responseText);
                    var msgUsar = '';
                    Ext.getBody().unmask();
                    if (dataResp.success) {
                        msgUsar = (valorUsar == 1) ? 'lbMsgUsarCorrecto' : 'lbMsgNoUsarCorrecto';
                        mostrarMensaje(1, _this.idioma[msgUsar]);
                        if (typeof _fn == 'function') {
                            _fn.call();
                        }
                    } else {
                        msgUsar = (valorUsar == 1) ? 'lbMsgErrorUsar' : 'lbMsgErrorNoUsar';
                        mostrarMensaje(3, _this.idioma[msgUsar]);
                    }
                }
            });
        }
    },
    /**
     *
     */
    onAceptarActivar: function(idnomencladores, _fn, msg) {
        var _this = this;
        var msgOk = (msg) ? msg : _this.idioma.lbMsgNomencladorActivado;
        Ext.getBody().mask(_this.idioma.lbMsgActivandoNomenclador);
        Ext.Ajax.request({
            url: 'activarnomenclador',
            params: {
                idnom: idnomencladores.join(','),
                pkid: _this.campoIdNomenclador,
                modelo: _this.modelo
            },
            method: 'POST',
            callback: function(o, s, r) {
                var dataResp = Ext.decode(r.responseText);
                Ext.getBody().unmask();
                if (dataResp.success) {
                    //mostrarMensaje(1, _this.idioma.lbMsgNomencladorActivado);
                    mostrarMensaje(1, msgOk);
                    if (typeof _fn == 'function') {
                        _fn.call();
                    }
                } else {
                    mostrarMensaje(3, _this.idioma.lbMsgErrorActivar);
                }
            }
        });
    },
    onBtnAyudaClick: function() {
        //if (! this.idioma.titleAyuda || ! this.idioma.referenciaAyuda) {
        // mostrarMensaje(1, 'Sobreescribir la function <b><i>onBtnAyudaClick</i></b> para cargar la ayudar \n o poner las etiquetas <b><i>titleAyuda</i></b> y <b><i>referenciaAyuda</i></b> en la configuraci\xf3n del idioma.');
        //} else {
        help.show(this.idioma.titleAyuda, this.idioma.referenciaAyuda);
        // }
    },
    isActiveButton: function(b) {
        return (b.isVisible() && !b.disabled);
    }
});
