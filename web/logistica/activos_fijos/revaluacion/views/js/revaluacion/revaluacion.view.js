Ext.ns('LOG.aft.revaluacion');
LOG.aft.revaluacion.View = Ext.extend(LOG.util.UITemplate, {
    /**
     * @param {object} config
     * @returns {undefined}
     */
    panelOperaciones: undefined,
    vConfRevaluacion: undefined,
    vDocAnulados: undefined,
    vDocEnProceso: undefined,
    idDeposito: '',
    coeficiente: 0,
    tasa: 0,
    evaluado: false,
    revisado: false,
    aprobado: false,
    cargaInicial: function(_fn) {
        this.modelo.cargaInicial({
            url: 'getConfiguracionEvaluacion'
        }, _fn, this.idioma.msgCargaInicial);
    },
    view: function() {
        var _this = this;
        this.cargaInicial(function(r, rd) {
            _this.coeficiente = rd.coeficiente;
            _this.tasa = rd.tasa;
            LOG.aft.revaluacion.View.superclass.view.call(_this);
        });
    },
    constructor: function(config) {
        var _this = this;
        config.idioma = LOG.util.UIManager.apply(LOG.aft.revaluacion.Idioma, LOG.util.Idioma);
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'getProductosEvaluacion';
        this.autoLoad = false;
        this.modelo = new LOG.aft.revaluacion.Model({
            idioma: config.idioma
        });
        LOG.aft.revaluacion.LabelFooter = Ext.extend(Ext.form.Label, {
            labelStyle: 'font-weight:bold; margin-top: -3px;', // font-size: 14px;
            //style: 'font-size: 16px;',
        });
        LOG.aft.revaluacion.vDocumentos = Ext.extend(LOG.util.UITemplate, {
            autoSelect: false,
            busquedaAvanzada: false,
            autoExpand: false,
            autoLoad: true,
            urlImprimir: '',
            constructor: function(config) {

                this.formaVisualizacion = 'ventana';
                this.modoSeleccion = 3;
                this.busquedaBasica = false;
                this.panelBotonesVisible = true;
                this.autoShow = false;
                this.urlBusquedaGridPrincipal = config.urlBusquedaGridPrincipal;
                config.idioma = config.idioma;
                LOG.aft.revaluacion.vDocumentos.superclass.constructor.call(this, config);
            },
            initDefaultButtons: function() {

                var self = this;
                this.addToolbarButton(LOG.util.UIManager.createBtn({
                    text: _this.idioma.tBtnImpDocAnulados,
                    tooltip: _this.idioma.ttBtnImpDocAnulados,
                    iconCls: 'imprimir',
                    handler: function() {
                        _this.showReporte(self.titleReport, self.urlReport);
                    }
                }));
            },
            initDefaultColumns: function() {
                var _this = this;
                function numero(val, meta, record) {
					
					if (val) {
                        return 'Nro doc: ' + val;
                    }

                    return '<span style="opacity: 0.5;">Nro ref: ' + record.get('numeroref') + '</span>';
                }

                this.addGridColumn({
                    dataIndex: 'numeroref'
                });
                this.addGridColumn({
                    header: this.idioma.cgNrDoc,
                    width: 100,
                    dataIndex: 'nrodoc',
                    default: true,
                    renderer: numero
                });
                /*this.addGridColumn({
                    header: this.idioma.cgTipoDoc,
                    width: 150,
                    dataIndex: 'sigla',
                    default: true
                });*/
				this.addGridColumn({
                    header: this.idioma.cgTipoDoc,
                    width: 150,
                    dataIndex: 'tipodoc',
                    default: true
                });
				this.addGridColumn({
                    header: 'Operaci&oacute;n',
                    width: 150,
                    dataIndex: 'operacion',
                    default: true
                });
				this.addGridColumn({
                    header: 'Entidad',
                    width: 150,
                    dataIndex: 'entidad',
                    default: true
                });
                this.addGridColumn({
                    header: this.idioma.cgCantProd,
                    width: 150,
                    dataIndex: 'cantidad',
                    align: 'right',
                    default: true
                });
                this.addGridColumn({
                    header: this.idioma.cgCreadoPor,
                    width: 200,
                    dataIndex: 'creadopor',
                    default: true
                });
            },
            render: function() {
                var _this = this;
                var view = LOG.aft.revaluacion.vDocumentos.superclass.render.call(this);
                view.height = 450;
                view.width = 650;
                view.buttons[1].setVisible(false);
                view.buttons[2].setVisible(false);
                view.loadStorePrincipal = function() {
                    _this.storePrincipal.load();
                }

                return view;
            }
        });
        LOG.aft.revaluacion.View.superclass.constructor.call(this, config);
        _this.concepto = _this.idioma.ttBotonBuscar;
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.tBtnVerInfo,
            tooltip: this.idioma.ttBtnVerInfo,
            iconCls: 'ver',
            handler: function() {
                _this.getDocEnProceso();
            },
            controlFn: function(b, _caller) {
                //b.disable();
                _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (this.hasSelection()) {
                            b.enable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.tBtnConfiguracion,
            tooltip: this.idioma.ttBtnConfiguracion,
            iconCls: 'configuracion',
            handler: function() {
                _this.confRevaluacion();
            },
            controlFn: function(b, _caller) {
                _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (this.hasSelection()) {
                            b.enable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnAyuda,
            iconCls: 'ayuda',
            handler: function() {

                /*_this.modelo.({}, function () {
                 
                 });*/
            },
            controlFn: function(b, _caller) {
                _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (this.hasSelection()) {
                            b.enable();
                        }
                    }
                });
            }
        }));
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
        this.addGridColumn({
            dataIndex: 'idnaturaleza'
        });
        /* function filaCombustible(val, meta, record) {
         
         if (record.get('idnaturaleza') == -3)
         return '<span style="color:#B45F04;">' + val + '</span>';
         return val;
         }*/

        this.addGridColumn({
            header: this.idioma.cgDenomProducto,
            width: 210,
            autoExpand: true,
            dataIndex: 'denominacion',
            // renderer: filaCombustible,
            default: true
        });
        /* this.addGridColumn({
         header: this.idioma.cgNroPieza,
         width: 100,
         dataIndex: 'numeropieza',
         renderer: filaCombustible,
         default: true
         });
         
         this.addGridColumn({
         header: this.idioma.cgCategoria,
         width: 100,
         dataIndex: 'categoria',
         renderer: filaCombustible,
         default: true
         });
         
         this.addGridColumn({
         header: this.idioma.cgUM,
         width: 100,
         dataIndex: 'um',
         renderer: filaCombustible,
         default: true
         });*/

        this.addGridColumn({
            header: this.idioma.cgExistencia,
            width: 100,
            dataIndex: 'existencia',
            //renderer: filaCombustible,
            //align: 'right',
            default: true
        });
        /*  this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
         header: this.idioma.cgPrecio,
         width: 100,
         // align: 'right',
         dataIndex: 'precio',
         renderer: filaCombustible,
         default: true
         }));*/

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte,
            width: 100,
            align: 'right',
            dataIndex: 'importe',
            //renderer: filaCombustible,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.cgPrecioDepreciacion,
            width: 100,
            align: 'right',
            dataIndex: 'depreciacion',
            // renderer: filaCombustible,
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporteRevaluado,
            width: 100,
            align: 'right',
            dataIndex: 'importereevaluado',
            // renderer: filaCombustible,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.cgPrecioDepreRevaluado,
            width: 100,
            align: 'right',
            dataIndex: 'depreciacionreevaluado',
            // renderer: filaCombustible,
            default: true
        }));


        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgDiferencia,
            width: 100,
            align: 'right',
            dataIndex: 'importediferencia',
            //renderer: filaCombustible,
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgDiferenciaDepre,
            width: 100,
            align: 'right',
            dataIndex: 'depreciaciondiferencia',
            //renderer: filaCombustible,
            default: true
        }));
        this.addGridColumn({
            header: this.idioma.cgRevisado,
            width: 100,
            dataIndex: 'revisadopor',
            //renderer: filaCombustible,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAprobado,
            width: 100,
            dataIndex: 'aprobadopor',
            // renderer: filaCombustible,
            default: true
        });
    },
    render: function(config) {

        var _this = this;
        this.btnRevaluar = LOG.util.UIManager.createBtn({
            text: this.idioma.tBtnRevaluar,
            tooltip: this.idioma.ttBtnRevaluar,
            iconCls: 'reevaluacion',
            handler: function() {

                mostrarMensaje(2, _this.idioma.lMsgQuestionEvaluacion, function(btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(_this.idioma.lMsgRevaluendo, _this.idioma.msgEspere);
                        _this.modelo.revaluarProductos({},
                                function(o, s, r) {                                   
                                    var rd = Ext.decode(r.responseText);
                                    if (rd.codigoMsg == 1) {
                                        mostrarMensaje(1, _this.idioma.lMsgEvaluacion);
                                        _this.storePrincipal.load();
                                    } else if (rd.codigoMsg == 4) {
                                        mostrarMensaje(3, _this.idioma.lMsgDocpendienteEvaluacion, function() {
                                            _this.getDocEnProceso();
                                        });
                                    }
                                    else {
                                        var errorMsg = rd.error ? rd.error : _this.idioma.lMsgErrorEvaluacion;
                                        //mostrarMensaje(3, _this.idioma.lMsgErrorEvaluacion);
                                        mostrarMensaje(3, errorMsg);
                                    }
                                });
                    }
                })
            }
        });
        this.btnRevisar = LOG.util.UIManager.createBtn({
            text: this.idioma.tBtnRevisar,
            tooltip: this.idioma.ttBtnRevisar,
            iconCls: 'revisar',
            disabled: true,
            handler: function() {

                mostrarMensaje(2, _this.idioma.lMsgQuestionRevisar, function(btn) {
                    if (btn == 'ok') {

                        Ext.MessageBox.wait(_this.idioma.lMsgRevisando, _this.idioma.msgEspere);
                        _this.modelo.revisarProductos({
                            idDeposito: _this.comboDeposito.getValue()
                        },
                        function(o, s, r) {
                            var rd = Ext.decode(r.responseText);
                            if (rd.codigoMsg == 3) {
                            } else {
                                mostrarMensaje(1, _this.idioma.lMsgRevisar);
                                _this.storePrincipal.load();
                            }
                        });
                    }
                })
            }
        });
        this.btnAprobar = LOG.util.UIManager.createBtn({
            text: this.idioma.tBtnAprobar,
            tooltip: this.idioma.ttBtnAprobar,
            iconCls: 'aprobar',
            disabled: true,
            handler: function() {

                mostrarMensaje(2, _this.idioma.lMsgQuestionAprobar, function(btn) {
                    if (btn == 'ok') {

                        Ext.MessageBox.wait(_this.idioma.lMsgAprobando,_this.idioma.msgEspere);
                        _this.modelo.aprobarProductos({
                            idDeposito: _this.comboDeposito.getValue()
                        },
                        function(o, s, r) {

                            var rd = Ext.decode(r.responseText);
                            mostrarMensaje(1, _this.idioma.lMsgAprobar);
                            _this.storePrincipal.load();
                        });
                    }
                })
            }
        });
        this.btnDocAnulados = LOG.util.UIManager.createBtn({
            text: this.idioma.tBtnDocAnulados,
            tooltip: this.idioma.ttBtnDocAnulados,
            iconCls: 'documentos',
            hidden : true,
            disabled: true,
            handler: function() {
                _this.getDocAnulados();
            },
            controlFn: function(b, _caller) {
                b.disable();
                _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (this.hasSelection()) {
                            b.enable();
                        }
                    }
                });
            }
        });
        this.nfTasa = LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.flTasaCambio,
            readOnly: true,
            value: _this.tasa,
            width: 60
        });
        this.nfCoeficiente = LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.flCoeficiente,
            readOnly: true,
            value: _this.coeficiente,
            width: 60
        })
        var cfg = config || {};
        var seg = typeof seguridad != 'undefined' ? seguridad : 1;
        cfg.caso = 3;
        cfg.tipo = typeof cfg.tipo != 'undefined' ? cfg.tipo : -1;
        this.comboDeposito = new LOG.util.ComboBox({
            allowBlank: true,
            url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
            disabled: false,
            valueField: 'iddeposito',
            displayField: 'deposito',
            name: 'idestructuracomun',
            typeAhead: true,
            resizable: true,
            idioma: _this.idioma,
            width: 250,
            emptyText: _this.idioma.lbCbVacio,
            fieldLabel: _this.idioma.lbCbDepositoBuscar,
            listeners: {
                select: function(a, record) {
                    if (typeof (record) == 'undefined') {
                        return;
                    }
                    this.moveFocus.defer(100, this);
                },
                render: function(field) {
                    field.moveFocus = function() {
                        LOG.util.WindowMgr.activate();
                        this.triggerBlur();
                    };
                },
                reset: function() {
                    _this.btnRevisar.disable();
                    _this.btnAprobar.disable();
                    _this.btnDocAnulados.disable();
                }
            },
            activateButtons: function() {

                _this.btnDocAnulados.disable();
                _this.btnAprobar.disable();
                _this.btnRevisar.disable();
                if (_this.comboDeposito.getValue().length > 0) {
                    if (_this.evaluado == true) {
                        _this.btnDocAnulados.enable();
                        if (_this.aprobado == true) {
                            _this.btnRevisar.disable();
                            _this.btnAprobar.disable();
                        }
                        else {
                            if (_this.revisado == true) {
                                _this.btnAprobar.enable();
                            }
                            else {
                                _this.btnRevisar.enable();
                            }
                        }
                    }
                }
            }
        });
        _this.comboDeposito.getStore().on({
            'load': function(st, obj) {
                if (st.data.items.length > 0) {
                    _this.comboDeposito.setValue(st.data.items[0].data.iddeposito);
                }
            }
        })
        this.comboDeposito.fireEvent = _this.comboDeposito.fireEvent.createSequence(function(e, args) {

            if ('valuechange' == e) {

                if (String(_this.idDeposito) !== String(args)) {

                    _this.getStorePrincipal().initBaseParams.idestructura = args;
                    _this.getStorePrincipal().load();
                    _this.idDeposito = args;
                    var datos = _this.comboDeposito.getStore().data.items;
                    Ext.each(datos, function(rec, index) {
                        if (rec.data.iddeposito == _this.idDeposito) {
                            _this.nomDeposito = rec.data.deposito;
                        }
                    });
                    _this.comboDeposito.activateButtons();
                }
            }
        });
        this.panelRevaluarCoeficiente = LOG.util.UIManager.initForm({
            columnWidth: .3,
            buttonAlign: 'left',
            defaults: {
                labelWidth: 150,
            },
            items: [{
                    layout: 'form',
                    xtype: 'fieldset',
                    height: 65,
                    style: 'margin: 2px; border-radius: 3px 3px 3px 3px; -moz-border-radius: 3px 3px 3px 3px; -webkit-border-radius: 3px 3px 3px 3px;',
                    items: [_this.nfCoeficiente/*, _this.nfTasa*/]
                }
            ],
            buttons: [_this.btnRevaluar]
        });
        this.panelAprobarRevaluacion = LOG.util.UIManager.initForm({
            columnWidth: .7,
            buttonAlign: 'left',
            labelWidth: 140,
            items: [{
                    xtype: 'fieldset',
                    height: 65,
                    style: 'margin: 2px; border-radius: 3px 3px 3px 3px; -moz-border-radius: 3px 3px 3px 3px; -webkit-border-radius: 3px 3px 3px 3px;',
                    items: [_this.comboDeposito]
                }
            ],
            buttons: [_this.btnRevisar, _this.btnAprobar, _this.btnDocAnulados]
        });
        this.modelo.bindForm(this.panelAprobarRevaluacion);
        this.panelOperaciones = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'column',
            frame: true,
            height: 130,
            items: [_this.panelRevaluarCoeficiente, _this.panelAprobarRevaluacion]
        });
        this.flEstado = new LOG.aft.revaluacion.LabelFooter({
            fieldLabel: _this.idioma.flEstado
        });
        this.flImpTotal = new LOG.aft.revaluacion.LabelFooter({
            fieldLabel: _this.idioma.flImpTotal
        });
        this.flImpRevaluado = new LOG.aft.revaluacion.LabelFooter({
            fieldLabel: _this.idioma.flImpRevaluado
        });
        this.flImpDiferencia = new LOG.aft.revaluacion.LabelFooter({
            fieldLabel: _this.idioma.flImpDiferencia
        });
        this.panelImportes = LOG.util.UIManager.initFocusPanel({
            region: 'south',
            layout: 'column',
            frame: true,
            height: 45,
            items: [{
                    columnWidth: .55,
                    layout: 'form',
                    labelWidth: 50,
                    items: [_this.flEstado]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    labelWidth: 80,
                    items: [_this.flImpTotal]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    labelWidth: 112,
                    items: [_this.flImpRevaluado]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    labelWidth: 65,
                    items: [_this.flImpDiferencia]
                }]
        });
        this.panelGrid.add(_this.panelImportes);
        var _view = LOG.aft.revaluacion.View.superclass.render.call(this, config);
        _this.panelBotones.add(_this.panelOperaciones);
        _this.panelBotones.setHeight(160, true);
        _this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function(e) {
            if (e == 'load') {
                _this.evaluado = _this.storePrincipal.reader.jsonData.evaluado;
                _this.revisado = _this.storePrincipal.reader.jsonData.revisado;
                _this.aprobado = _this.storePrincipal.reader.jsonData.aprobado;
                _this.impTotal = _this.storePrincipal.reader.jsonData.impTotal;
                _this.impRevTotal = _this.storePrincipal.reader.jsonData.impRevTotal;
                _this.difTotal = _this.storePrincipal.reader.jsonData.difTotal;
                if (_this.comboDeposito.getValue().length > 0) {

                    if (_this.evaluado == true
                            && _this.revisado == false
                            && _this.aprobado == false
                            ) {
                        _this.flEstado.setText(_this.idioma.lbEstadoRevaluado);
                    }
                    else {
                        _this.flEstado.setText('');
                        if (_this.aprobado == true) {
                            _this.flEstado.setText(_this.idioma.lbEstadoAprobado);
                        }
                        else if (_this.revisado == true) {
                            _this.flEstado.setText(_this.idioma.lbEstadoRevisado);
                        }

                    }

                    _this.flImpTotal.setText(_this.impTotal);
                    _this.flImpRevaluado.setText(_this.impRevTotal);
                    _this.flImpDiferencia.setText(_this.difTotal);
                }
                else {
                    _this.flEstado.setText('');
                    _this.flImpTotal.setText('');
                    _this.flImpRevaluado.setText('');
                    _this.flImpDiferencia.setText('');
                }

                _this.comboDeposito.activateButtons();
            }
        })

        _view.doLayout();
        return _view;
    },
    confRevaluacion: function() {
        var _this = this;
        if (typeof (_this.vConfRevaluacion) == 'undefined') {

            /* var nfTasa = LOG.util.Prototipos.inputDecimal({
             fieldLabel: _this.idioma.flTasaCambio,
             allowBlank: false,
             width: 110,
             value: _this.tasa,
             listeners: {
             'valid': function () {
             if (nfCoeficiente.isValid()) {
             btnGuardar.enable();
             }
             },
             'invalid': function () {
             btnGuardar.disable();
             }
             }
             });*/

            var nfCoeficiente = LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.flCoeficienteShort,
                allowBlank: false,
                width: 110,
                value: _this.coeficiente
            })

            var btnGuardar = LOG.util.UIManager.createBtn({
                text: this.idioma.tBtnGuardarConfig,
                tooltip: this.idioma.ttBtnGuardarConfig,
                iconCls: 'guardar',
                disabled: true,
                handler: function() {

                    _this.modelo.guardarConfiguracion({
                        // tasa: nfTasa.getValue(),
                        coeficiente: nfCoeficiente.getValue()
                    },
                    function(o, s, r) {
                        var rd = Ext.decode(r.responseText);
                        if (rd.codigoMsg == 1) {
                            mostrarMensaje(1, _this.idioma.lMsgConfGuardada);
                            // _this.tasa = nfTasa.getValue();
                            _this.coeficiente = nfCoeficiente.getValue();
                            //_this.nfTasa.setValue(_this.tasa);
                            _this.nfCoeficiente.setValue(_this.coeficiente);
                        }
                        else {
                            mostrarMensaje(3, _this.idioma.lMsgNoConfGuardada);
                        }

                        _this.vConfRevaluacion.close();
                    });
                }
            })
            var clsPanel = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            clsPanel.addComponent(nfCoeficiente);
            _this.fpConfRevaluacionConfRevaluacion = LOG.util.UIManager.initForm({
                frame: true,
                region: 'center',
                layout: 'form',
                defaultsAnchor: '100%',
                anchor: '100%',
                autoHeight: true,
                items: [clsPanel],
                listeners: {
                    'clientvalidation': function(fp, valid) {
                        var checkdirty = false;
                        fp.getForm().items.each(function(field) {
                            if (field.isDirty() && valid) {
                                checkdirty = true;
                                btnGuardar.enable();
                            }
                        });
                        if (!checkdirty) {
                            btnGuardar.disable();
                        }
                    }
                },
            });
            this.modelo.bindForm(this.fpConfRevaluacionConfRevaluacion);
            _this.vConfRevaluacion = new LOG.util.Window({
                height: 130,
                width: 260,
                layout: 'border',
                resizable: false,
                title: _this.idioma.flVentConf,
                items: [this.fpConfRevaluacionConfRevaluacion],
                buttons: [btnGuardar]
            });
        }

        _this.vConfRevaluacion.show();
    },
    getDocAnulados: function() {
        var _this = this;
        if (typeof (_this.vDocAnulados) == 'undefined') {

            var vDocAnulados = new LOG.aft.revaluacion.vDocumentos({
                idioma: _this.idioma,
                baseParams: {
                    idestructura: _this.idDeposito
                },
                urlBusquedaGridPrincipal: 'getDocAnuladosEvaluacionProductos',
                titleReport: 'titleReport',
                urlReport: '/distra/logistica/activos_fijos/revaluacion/DocumentosAnuladosListado'
            });
            vDocAnulados.init();
            _this.vDocAnulados = vDocAnulados.view();
            _this.vDocAnulados.title = _this.idioma.lVentDocAnulados;
        }
        else {
            _this.vDocAnulados.loadStorePrincipal();
        }

        _this.vDocAnulados.show();
    },
    getDocEnProceso: function() {
        var _this = this;
        if (typeof (_this.vDocEnProceso) == 'undefined') {
            var vDocEnProceso = new LOG.aft.revaluacion.vDocumentos({
                idioma: _this.idioma,
                urlBusquedaGridPrincipal: 'getDocPendintesEvaluacionProductos',
                titleReport: 'VerificarInformacionListado',
                urlReport: '/distra/logistica/activofijo/revaluacion/VerificarInformacionListado'
            })

            vDocEnProceso.init();
            _this.vDocEnProceso = vDocEnProceso.view();
            _this.vDocEnProceso.title = _this.idioma.lVentDocEnProceso;
        }

        _this.vDocEnProceso.show();
    },
    showReporte: function(titleReport, urlReport) {
        var _this = this;
		
		var tipoReportes = new LOG.util.Report({
			reports: [{
				dirReport: urlReport,
				name: titleReport,
				isList: true,
				params: {
				}
			}]
		});
		tipoReportes.view();
		
        /*this.control = new Distra.util.report.ViewController({
            useFirma: false,
            idioma: this.idioma,
            reports: [
                {
                    name: titleReport,
                    typeView: 3,
                    isList: true,
                    params: {
                        hasFirma: 'false',
                        idestructuracomun: _this.comboDeposito.getValue()
                    },
                    dirReport: urlReport
                }
            ]
        });
        this.control.view('1');*/
    }
});