Ext.ns('Log.lb.cierre');

Log.lb.cierre.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.lb.cierre.Idioma);
        this.modoSeleccion = 1;
        this.concepto = this.idioma.ttBuscar;
        this.busquedaBasica = true;
        this.textBusquedaSimple = 'No. documento';
        // this.autoShow = true;
        this.modelo = new Log.lb.cierre.Model({
            idioma: config.idioma
        });
        Log.lb.cierre.View.superclass.constructor.call(this, config);
    },
    init: function () {
        Log.lb.cierre.View.superclass.init.call(this);
        this.createLabelFecha();
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgDocumento,
            width: 120,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgRefer,
            width: 120,
            dataIndex: 'numeroref',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgAnno,
            width: 120,
            dataIndex: 'anno',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgEstatus,
            width: 120,
            dataIndex: 'estado',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });

        this.addGridColumn({
            header: this.idioma.cgTdoc,
            width: 170,
            dataIndex: 'iddoc',
            default: true,
            autoExpand: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                _this.documentos = store.reader.jsonData.documentos;
                return _this.getTipoDocById(value);
            }
        });

        this.addGridColumn({
            header: this.idioma.cgFecha,
            width: 120,
            dataIndex: 'fechacontable',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCreado,
            width: 120,
            dataIndex: 'idusuario',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                _this.usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: this.idioma.tBotonDiario,
            iconCls: 'cierrediario',
            tooltip: this.idioma.toBotonDiario,
            handler: function () {
                _this.modelo.cierreDiario(function () {
                    _this.modelo.cargaDatosFecha({
                        url: _this.dirController + '/cargaDatosFecha'
                    }, function (a, res, s) {
                        _this.lblImporteTotal.setText(_this.idioma.lblPerido + res.periodo.nombre + ', ' + _this.idioma.lblDesde + res.periodo.inicio + _this.idioma.lblHasta + res.periodo.fin + '. ' + _this.idioma.lblFechaContable + res.fechaContable);
                    });
                });
            },
            controlFn: function (b, _caller) {
                b.disable();
                if (fechaAutomatica == false) {
                    b.enable();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: this.idioma.tBotonPeriodo,
            iconCls: 'cerrarperiodo',
            tooltip: this.idioma.toBotonPeriodo,
            handler: function () {
                
                _this.modelo.cierrePeriodo(function () {
                    _this.modelo.cargaDatosFecha({
                        url: _this.dirController + '/cargaDatosFecha'
                    }, function (a, res, s) {
                        _this.lblImporteTotal.setText(_this.idioma.lblPerido + res.periodo.nombre + ', ' + _this.idioma.lblDesde + res.periodo.inicio + _this.idioma.lblHasta + res.periodo.fin + '. ' + _this.idioma.lblFechaContable + res.fechaContable);
                    });
                });
            },
            controlFn: function (b, __caller) {
            }
        }));
//        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
//            text: 'Reabrir per&iacute;odo contable',
//            iconCls: 'abrir',
//            tooltip: 'Reabrir per&iacute;odo contable',
////            hidden: true,
//            handler: function () {
//                _this.validarAbrirPeriodo();
//            },
//            controlFn: function (b, __caller) {
//            }
//        }));

        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: this.idioma.tBotonEjercicio,
            iconCls: 'cierreejercicio',
            tooltip: this.idioma.toBotonEjercicio,
            handler: function () {
                _this.modelo.cierreEjercicio(function () {
                    _this.modelo.cargaDatosFecha({
                        url: _this.dirController + '/cargaDatosFecha'
                    }, function (a, res, s) {
                        _this.lblImporteTotal.setText(_this.idioma.lblPerido + res.periodo.nombre + ', ' + _this.idioma.lblDesde + res.periodo.inicio + _this.idioma.lblHasta + res.periodo.fin + '. ' + _this.idioma.lblFechaContable + res.fechaContable);
                    });
                });
            },
            controlFn: function (b, __caller) {
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: this.idioma.tBotonCierreApertura,
            iconCls: 'cargainicial',
            tooltip: this.idioma.toBotonCierreApertura,
            handler: function () {
                _this.modelo.cierreApertura(_this);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT')) {
                    b.setVisible(cargaInicial == 0 && contIntegrada ? true : false);
                } else {
                    b.setVisible(false);
                }
            }

        }));

        this.addToolbarButton("->");
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            text: '',
            tooltip: this.idioma.tBotonAyuda,
            id: _this.idayuda
        }));


    },
    getUsuarioById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.usuarios.length; i++) {
            if (_this.usuarios[i].idusuario == id) {
                return _this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    getTipoDocById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.documentos.length; i++) {
            if (_this.documentos[i].iddoc == id) {
                return _this.documentos[i].denominacion;
            }
        }
        return '-';
    },
    createLabelFecha: function () {
        var _this = this;
        this.periodo = '';
        _this.modelo.cargaDatosFecha({
            url: this.dirController + '/cargaDatosFecha'
        }, function (a, res, s) {
            _this.lblImporteTotal.setText(_this.idioma.lblPerido + res.periodo.nombre + ', ' + _this.idioma.lblDesde + res.periodo.inicio + _this.idioma.lblHasta + res.periodo.fin + '. ' + _this.idioma.lblFechaContable + res.fechaContable);
        });

        this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function () {
            _this.lblImporteTotal = new Ext.form.Label({
                text: _this.periodo,
                style: 'padding: 10px 100px 0px 0px;font-weight: bolder;font-size: 12px;'
            });
            _this.panelNorte = new LOG.util.UIManager.initPanel({
                region: 'center',
                border: false,
                layout: 'form',
                tbar: ['->', _this.lblImporteTotal]
            });
            _this.getPanelSuperior().add(_this.panelNorte);
            _this.getPanelSuperior().autoHeight = true;
        });
        //return this.panelNorte;
    },
    validarAbrirPeriodo: function () {
        var _this = this;
        Ext.Msg.show({
            title: 'Confirmaci&oacute;n',
            msg: '<span style="color: red"><b>Ud. está intentando reabrir el período contable anterior para el subsistema actual. Este proceso tendrá consecuencias y podrá efectar la integridad de funcionamiento de otros subsistemas contables. Las operaciones realizadas bajo estas condiciones tendrán un tratamiento especial</b></span> <b> &iquest;Est&aacute; seguro que desea reabrir el período contable anterior?</b>',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn, text) {
                if (btn == 'ok') {
                    Ext.Msg.wait('Abriendo per&iacute;odo contable...', 'Por favor espere...');
                    Ext.Ajax.request({
                        url: 'validarAbrirPeriodo',
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.code == 1) {
                                _this.ventanaAbrirPeriodo();
                            } else {
                                Ext.Msg.show({
                                    title: '¡Atención!',
                                    msg: responseData.message,
                                    buttons: Ext.Msg.CANCEL,
                                    icon: Ext.MessageBox.WARNING,
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    ventanaAbrirPeriodo: function () {
        btnCancelarAbrirPeriodo = new Ext.Button({
            iconCls: 'cancelar',
            id: 'btnCancelarAbrirPeriodo',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                winAbrirPeriodo.destroy();
            }
        });
        btnAceptarAbrirPeriodo = new Ext.Button({
            iconCls: 'aceptar',
            id: 'btnAceptarAbrirPeriodo',
            nextTab: 'denominacion',
            disabled: true,
            text: 'Aceptar',
            tooltip: 'Guardar los datos y cerrar la ventana',
            handler: function () {
                abrirPeriodoPeticion('aceptar');
            }
        });
        txfAbrirPeriodo = new Ext.form.TextArea({
            id: 'observacion',
            width: '100%',
            height: 100,
            stateful: true,
            preventScrollbars: true,
            allowBlank: false,
            minLength: 1,
            emptyText: 'Motivos de la solicitud',
            enableKeyEvents: true,
            hideLabel: true,
            listeners: {
                keyup: function (tf, e) {
                    if (tf.isValid()) {
                        //
                    } else {
                        //
                    }
                }
            }
        });
        var buttons = [btnCancelarAbrirPeriodo, btnAceptarAbrirPeriodo];
        fpAbrirPeriodo = new Ext.FormPanel({
            id: 'fpAbrirPeriodo',
            region: 'center',
            autoHeight: true,
            autoDestroy: true,
            autoWidth: true,
            frame: true,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            style: 'margin:0 10 0 10;',
                            layout: 'form',
                            items: txfAbrirPeriodo
                        }]
                }]
        });
        winAbrirPeriodo = new Ext.Window({
            id: 'winAbrirPeriodo',
            title: 'Declarar motivo de solicitar apertura para un período contable',
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            resizable: true,
            width: 750,
            height: 500,
            autoHeight: true,
            items: fpAbrirPeriodo,
            buttons: buttons,
            listeners: {
                beforedestroy: function () {
                    Ext.Msg.hide();
                },
            }
        });
        winAbrirPeriodo.show();

        function abrirPeriodoPeticion(accion) {
            Ext.Ajax.timeout = 60000;
            if (fpAbrirPeriodo.getForm().isValid()) {
                Ext.Msg.show({
                    title: 'Confirmaci&oacute;n',
                    msg: '<span style="color: red"><b>Ud. está intentando reabrir el período contable anterior para el subsistema actual. Este proceso tendrá consecuencias y podrá afectar la integridad de funcionamiento de otros subsistemas contables. Las operaciones realizadas bajo estas condiciones tendrán un tratamiento especial</b></span> <b> &iquest;Est&aacute; seguro que desea reabrir el anterior período contable?</b>',
                    buttons: Ext.Msg.OKCANCEL,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn, text) {
                        if (btn == 'ok') {
                            Ext.Msg.wait('Abriendo per&iacute;odo contable...', 'Por favor espere...');
                            Ext.Ajax.request({
                                url: 'solicitarAbrirPeriodo',
                                params: {
                                    observacion: txfAbrirPeriodo.getValue()
                                },
                                callback: function (options, success, response) {
                                    winAbrirPeriodo.destroy();
                                    var responseData = Ext.decode(response.responseText);
                                    if (responseData.code == 2) {
                                        Ext.Msg.show({
                                            title: 'Notificación',
                                            msg: responseData.message,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.INFO,
                                        });
                                    } else {
                                        Ext.Msg.show({
                                            title: '¡Atención!',
                                            msg: responseData.message,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.WARNING,
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    }



});