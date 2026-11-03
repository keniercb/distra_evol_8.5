Ext.ns('LOG.dist.pedido');
LOG.dist.pedido.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Pedido',
    cantSign: 2,
    signDetails: {
        1: 'Creado',
        2: 'Aprobado'
    },
    dirReport: '/logistica/distribucion/pedido/',
    constructor: function (config) {
        config.urlBusquedaGridPrincipal = 'cargarDocumentos';
        config.modoSeleccion = 1;
        this.concepto = 'pedido(s)';
        LOG.util.UIManager.apply(config.idioma, LOG.lb.documento.Idioma);
        config.model = new LOG.dist.pedido.Model(
            {
                idioma: config.idioma
            }
        );
        LOG.dist.pedido.View.superclass.constructor.call(this, config);

        this.winGestionarDocumento = new LOG.dist.pedido.VentanaAdicionar({
            idioma: config.idioma,
            modelo: this.modelo,
            height: 580,
            width: 750,
            scope: this,
           title: config.idioma.tlAdicionarPedido
        });
        

    },
    render: function () {
        var _this = this;
        var render = LOG.dist.pedido.View.superclass.render.call(this);
        this.getStorePrincipal().fireEvent = this.getStorePrincipal().fireEvent.createSequence(function (e, st, record) {
            if (e == 'load') {
                if (st.data.items[0] && st.data.items[0].json.docnoconfigurado) {
                    this.removeAll();
                    _this.listaBotones.getItem(0).disable();
                    _this.listaBotones.getItem(10).disable();
                    mostrarMensaje(3, 'La entidad ' + _this.nomEntidad + ' no tiene el documento primario <b><i>Pedido</i></b> configurado.');
                } else {
                    _this.listaBotones.getItem(0).enable();
                    _this.listaBotones.getItem(10).enable();
                }
            }
        });
        return render;
    },
    init: function () {
        LOG.dist.pedido.View.superclass.init.call(this);
        this.panelSuperior();
    },
    initDefaultButtons: function () {
        LOG.dist.pedido.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbCerrarPedido,
            iconCls: 'cancelar',
            disabled: true,
            tooltip: this.idioma.ttBtnCerrar,
            handler: function () {
                _this.modelo.cerrarPedido(_this.getGridPrincipal().getSelectionModel().getSelected().data.iddocumento, _this.storePrincipal);
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _caller.grantedAction('RCerrarDocumento')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(
                        function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().data.estado == 3) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }
                    )
                } else {
                    b.setVisible(false);
                }
            }
        }), 3);

        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                var valido = true;
                var fechainvalida = false;
                var fechaHoy = new Date().format('d/m/Y');
                var sDia1 = _this.smGridPrincipal.getSelected().data.fechavencimiento.substr(0, 2);
                var sMes1 = _this.smGridPrincipal.getSelected().data.fechavencimiento.substr(3, 2);
                var sAno1 = _this.smGridPrincipal.getSelected().data.fechavencimiento.substr(6, 4);

                var sDia0 = fechaHoy.substr(0, 2);
                var sMes0 = fechaHoy.substr(3, 2);
                var sAno0 = fechaHoy.substr(6, 4);

                if (sAno0 > sAno1) {
                    fechainvalida = true;
                } else {
                    if (sAno0 == sAno1) {
                        if (sMes0 > sMes1) {
                            fechainvalida = true;
                        } else {
                            if (sMes0 == sMes1) {
                                if (sDia0 > sDia1) {
                                    fechainvalida = true;
                                }
                            }
                        }
                    }
                }

                if (!_this.smGridPrincipal.getSelected().data.fechavencimiento || fechainvalida) {
                    mostrarMensaje(3, _this.idioma.msgPedidoVencido);
                    valido = false;
                }
                if (_this.smGridPrincipal.getSelected().data.productos == 0 && _this.smGridPrincipal.getSelected().data.servicios == 0) {
                    mostrarMensaje(3, _this.idioma.msgValidarCant);
                    valido = false
                }
                if (valido) {
                    _this.modelo.confirmar({}, null, function (r) {
                        if (r.codigoMsg == 4) {
                            mostrarMensaje(3, _this.idioma.msgValidarClientePendiente);
                        }
                        if (r.codigoMsg == 3) {
                            mostrarMensaje(3, _this.idioma.msgValidarCantMayorCero);
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(
                        function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().data.estado == 1 && (this.getSelected().data.productos > 0 || this.getSelected().data.servicios > 0)) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }
                    )
                } else {
                    b.setVisible(false);
                }
            }
        }), 4);

        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            isContextual: true,
            tooltip: _this.idioma.ttBtnAnular,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
               
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(
                        function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().data.estado == 2) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }
                    )
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);
        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: _this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 2);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                            (this.getCount() == 1 && this.getSelected().data.estado == 2) && //first
                            ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'anulardocumento',
            text:  this.idioma.lbBtnCancelarPedido,
            tooltip: this.idioma.ttBtnCancelarPedido,
            isContextual: true,
            disabled: true,
           handler: function () {
                _this.modelo.anular();
               
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAnular')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _caller.getSmPrincipal().getSelected().data.estado == 3) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'anularDoc1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 9);


        this.cmbTiporeclamoWin = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTiporeclamo',
            idnom: 'idtiporeclamo',
            name: 'idtiporeclamo',
            anchor: '90%',
            editable: false,
            autoCargar: true
        });

        // this.insertToolbarButton(LOG.util.UIManager.createBtn({
        //     iconCls: 'estructura',
        //     text: 'Trazabilidad',
        //     tooltip: 'Trazabilidad',
        //     disabled: false,
        //     handler: function () {
        //         this.winTrazabilidad = new LOG.dist.pedido.winTrazabilidad ({
        //             idioma: _this.idioma,
        //             iddocumento: _this.getGridPrincipal().getSelectionModel().getSelected().data.iddocumento,//_this.idDeposito,
        //             datos: ''//_this.comboDeposito.getRawValue(),
        //             //datos: _this.getGridPrincipal().getSelectionModel()
        //         });
        //         this.winTrazabilidad.setTitle('Trazabilidad del pedido # '+ _this.getGridPrincipal().getSelectionModel().getSelected().data.nrodoc);
        //         this.winTrazabilidad.show();
        //     },
        //     controlFn: function (b, _caller) {
        //         if (_caller.grantedAction('CT') || _caller.grantedAction('RReclamar')) {
        //             b.setVisible(true);
        //             _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(
        //                 function (e) {
        //                     if (e == 'selectionchange') {
        //                         if (this.getCount() == 1 && (this.getSelected().data.estado == 3 || this.getSelected().data.estado == 9)) {
        //                             b.enable();
        //                         } else {
        //                             b.disable();
        //                         }
        //                     }
        //                 }
        //             )
        //         } else {
        //             b.setVisible(false);
        //         }
        //
        //     }
        // }), 7);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'estructura',
            text: 'Trazabilidad',
            tooltip: 'Trazabilidad',
            disabled: false,
            menu: [
                new Ext.menu.Item({
                    iconCls: 'estructura',
                    text: 'Trazabilidad',
                    tooltip: 'Trazabilidad',
                    name: 'trazabilidad',
                    disabled: true,
                    handler: function () {
                        this.winTrazabilidad = new LOG.dist.pedido.winTrazabilidad ({
                            idioma: _this.idioma,
                            iddocumento: _this.getGridPrincipal().getSelectionModel().getSelected().data.iddocumento,//_this.idDeposito,
                            datos: ''//_this.comboDeposito.getRawValue(),
                            //datos: _this.getGridPrincipal().getSelectionModel()
                        });
                        this.winTrazabilidad.setTitle('Trazabilidad del pedido # '+ _this.getGridPrincipal().getSelectionModel().getSelected().data.nrodoc);
                        this.winTrazabilidad.show();
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RReclamar')) {
                            b.setVisible(true);
                            _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(
                                function (e) {
                                    if (e == 'selectionchange') {
                                        if (this.getCount() >= 1/* && (this.getSelected().data.estado == 3 || this.getSelected().data.estado == 9)*/) {
                                            b.enable();
                                        } else {
                                            b.disable();
                                        }
                                    }
                                }
                            )
                        } else {
                            b.setVisible(false);
                        }

                    }
                }),
                new Ext.menu.Item({
                    text: 'Exportar trazabilidad <span style="color:#2b9c26;">' + '(*.xls)',
                    tooltip: 'Exportar la trazabilidad de los pedidos',
                    name: 'exportartrazabilidad',
                    iconCls: 'exportar',
                    disabled: true,
                    handler: function () {
                        var iddocumentos = Ext.encode(_this.getStorePrincipal().collect('iddocumento'));
                        //console.info(idsdoc);
                         wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                        window.open(`exportarTrazabilidad?iddocumentos=${iddocumentos}`, 'ventana', wCfg);
                         // window.open(`exportarTrazabilidad?iddocumento=${iddocumento}`, 'ventana', wCfg);
                        //_this.model.exportar();
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT')) {
                            b.setVisible(true);
                            LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() >= 1) {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'exportar');
                        } else {
                            b.setVisible(false);
                        }
                    }
                })
            ]
        }), 7);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'reclamacion',
            text: _this.idioma.lbReclamar,
            tooltip: _this.idioma.ttBtnReclamar,
            disabled: true,
            handler: function () {
                if (_this.cmbTiporeclamoWin.stCombo.getCount() == 0) {
                    mostrarMensaje(1, _this.idioma.msjConfigurarTipoReclamo);
                } else {
                    this.ventanaReclamo = new LOG.dist.pedido.ventanaReclamo({
                        iddocumento: _this.smGridPrincipal.getSelected().data.iddocumento,
                        storePrincipal: _this.storePrincipal
                    });
                    this.ventanaReclamo.show();
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RReclamar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(
                        function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && (this.getSelected().data.estado == 3 || this.getSelected().data.estado == 9)) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }
                    )
                } else {
                    b.setVisible(false);
                }

            }
        }), 8);
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'cumplimiento',
            text: _this.idioma.lbBtnEstadoEjecucion,
            tooltip: _this.idioma.ttBtnEstadoEjecucion,
            isContextual: true,
            disabled: true,
            handler: function () {
                this.winCumplimiento = new LOG.dist.distribucion.winCumplimiento({
                    dirController: '/logistica/distribucion/pedido/index.php/pedido',
                    datos: _this.getGridPrincipal().getSelectionModel().getSelected().json,
                    record: _this.getGridPrincipal().getSelectionModel().getSelected(),
                    externo: _this.idComponent == 1 ? 1 : null
                });

                this.winCumplimiento.init();
                this.winCumplimiento.view();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('REstadoEjecucion')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 3) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    })
                } else {
                    b.setVisible(false);
                }
            }
        }), 9);

        this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: _this.idioma.tlDuplicar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.duplicar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RDuplicar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 10);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Importar',
            tooltip: 'Importar productos',
            iconCls: 'importar',
            isContextual: true,
            disabled: true,
            handler: function() {
                var win = new LOG.lb.importar.View({            
                   class: 'PedidoModel',
                    params: {iddocumento: _this.getSmPrincipal().getSelected().get('iddocumento')}, 
                    fn: function(r) {
                        _this.getStorePrincipal().load();
                        if (r.error || parseInt(r.total) > parseInt(r.cantidad)) {
                            _this.mostrarError(
                                (!r.error ? _this.idioma.msjErrorImportar : (r.error == 1 ? _this.idioma.msjErrorTarjeta : _this.idioma.msjErrorValoresNoValidos)),
                                _this.getSmPrincipal().getSelected().get('iddocumento'),
                                (!r.error && parseInt(r.total) > parseInt(r.cantidad))
                                );
                        }
                    }
                });
                win.show();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'importar');
                } else {
                    b.setVisible(false);
                }
            }
        }),11);
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(11), {
            text: 'Importar',
            tooltip: 'Importar productos',
            iconCls: 'importar',
            disabled: true,
            fn: function() {
                var win = new LOG.lb.importar.View({
                 class: 'PedidoModel',
                    params: {iddocumento: _this.winGestionarDocumento.record.data.iddocumento},
                    fn: function(r) {
                        _this.winGestionarDocumento.stGridDetalles.load();
                        _this.getStorePrincipal().load();
                        if (r.error || parseInt(r.total) > parseInt(r.cantidad)) {
                            _this.mostrarError(
                                (!r.error ? _this.idioma.msjErrorImportar : (r.error == 1 ? _this.idioma.msjErrorTarjeta : _this.idioma.msjErrorValoresNoValidos)),
                                _this.winGestionarDocumento.record.data.iddocumento,
                                (!r.error && parseInt(r.total) > parseInt(r.cantidad))
                                );
                        }
                    }
                });
                win.show();
            },
            controlFn: function(b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) && _this.winGestionarDocumento.tipoVentana != 3) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.listaBotones.getItem(10), {
            iconCls: 'ver',
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RObservaciones')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.disable();
                            } else {
                                b.enable();
                            }
                        }
                    });
                } else {
                    b.hide();
                }
            }
        });

        LOG.util.UIManager.apply(this.listaBotones.getItem(13), {id: 'idpedido'});

        this.winGestionarDocumento.listaBotonesProductos.deleteAll();
        this.addToolbarButtonProductos(LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.ttBtnEliminarPedido,
            key: {
                key: Ext.EventObject.DELETE,
                shift: false,
                alt: false,
                ctrl: false
            },
            handler: function () {
                _this.modelo.eliminar(_this.winGestionarDocumento.record.data, function () {
                    _this.winGestionarDocumento.close()
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (!_this.winGestionarDocumento.record) {
                            b.disable();
                        } else {
                            if (_this.modelo.iddocumento) {
                                b.enable();
                            }
                            if (_this.winGestionarDocumento.record.data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        LOG.util.UIManager.applyKey(_this.winGestionarDocumento.listaBotonesProductos.getItem(0), _this.panel);

        this.addToolbarButtonProductos(LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.ttBtnConfirmar,
            handler: function () {
                var valido = true;
                var fechainvalida = false;
                var fechaHoy = new Date().format('d/m/Y');
                if (_this.winGestionarDocumento.record.data.fechavencimiento) {
                    var sDia1 = _this.winGestionarDocumento.record.data.fechavencimiento.substr(0, 2);
                    var sMes1 = _this.winGestionarDocumento.record.data.fechavencimiento.substr(3, 2);
                    var sAno1 = _this.winGestionarDocumento.record.data.fechavencimiento.substr(6, 4);

                    var sDia0 = fechaHoy.substr(0, 2);
                    var sMes0 = fechaHoy.substr(3, 2);
                    var sAno0 = fechaHoy.substr(6, 4);

                    if (sAno0 > sAno1) {
                        fechainvalida = true;
                    } else {
                        if (sAno0 == sAno1) {
                            if (sMes0 > sMes1) {
                                fechainvalida = true;
                            } else {
                                if (sMes0 == sMes1) {
                                    if (sDia0 > sDia1) {
                                        fechainvalida = true;
                                    }
                                }
                            }
                        }
                    }
                }

                if (fechainvalida) {
                    mostrarMensaje(3, _this.idioma.msgPedidoVencido);
                    valido = false;
                } else {
                    if (_this.modelo.listaProductosExtras.count() == 0 && _this.modelo.listaServiciosExtras.count() == 0
                        && _this.winGestionarDocumento.record.data.productos && _this.winGestionarDocumento.record.data.productos == 0 && _this.winGestionarDocumento.record.data.servicios == 0) {
                        mostrarMensaje(3, _this.idioma.msgValidarCant);
                        valido = false;
                    }

                    Ext.each(_this.modelo.listaProductosExtras.getArray(), function (p) {
                        if (!p.cantidad || p.cantidad <= 0) {
                            mostrarMensaje(3, _this.idioma.msgValidarCantMayorCero);
                            valido = false;
                        }
                    });
                }
                if (valido) {
                    _this.modelo.confirmar(_this.winGestionarDocumento.record.data, function (r) {
                        if (_this.winGestionarDocumento.record == null) {
                            _this.winGestionarDocumento.record = {};
                            Ext.apply(_this.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "2"
                                }
                            });
                        } else {
                            _this.winGestionarDocumento.record.data.estado = "2";
                        }
                        _this.winGestionarDocumento.onShow();
                        _this.winGestionarDocumento.cargarProductos(_this.modelo);
                        _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    }, function (resp) {
                        if (resp.codigoMsg == 2) {
                            mostrarMensaje(3, _this.idioma.msgValidarCant);
                        }
                        if (resp.codigoMsg == 3) {
                            mostrarMensaje(3, _this.idioma.msgValidarCantMayorCero);
                        }
                        if (resp.codigoMsg == 4) {
                            mostrarMensaje(3, _this.idioma.msgValidarClientePendiente);
                        }

                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    }
                    else {
                        b.show();
                        if (!_this.winGestionarDocumento.record) {
                            b.disable();
                        }
                        else {
                            if (_this.modelo.iddocumento) {
                                b.enable();
                            }
                            if (_this.winGestionarDocumento.record.data.estado == 1) {
                                b.enable();
                            }
                            else {
                                b.disable();
                            }
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButtonProductos(LOG.util.Prototipos.botonAnularEstado({
            tooltip: _this.idioma.ttBtnAnular,
            handler: function () {
                _this.modelo.anularestado(_this.winGestionarDocumento.record.data, function (r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "1";
                    }
                    _this.winGestionarDocumento.onShow();
                    _this.winGestionarDocumento.cargarProductos(_this.modelo);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    }
                    else {
                        b.show();
                        if (!_this.winGestionarDocumento.record) {
                            b.disable();
                        }
                        else {
                            if (_this.winGestionarDocumento.record.data.estado == 2) {
                                b.enable();
                            }
                            else {
                                b.disable();
                            }
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

this.btnImportar = LOG.util.UIManager.createBtn({
    text: 'Importar',
    tooltip: 'Importar productos',
    iconCls: 'importar',
    isContextual: true,
    disabled:false,
    handler: function() {
        var win = new LOG.lb.importar.View({            
            class: 'PedidoModel',
            params: {iddocumento: _this.getSmPrincipal().getSelected().get('iddocumento')}, 
            fn: function(r) {
                _this.getStorePrincipal().load();
                if (r.error || parseInt(r.total) > parseInt(r.cantidad)) {
                    _this.mostrarError(
                        (!r.error ? _this.idioma.msjErrorImportar : (r.error == 1 ? _this.idioma.msjErrorTarjeta : _this.idioma.msjErrorValoresNoValidos)),
                        _this.getSmPrincipal().getSelected().get('iddocumento'),
                        (!r.error && parseInt(r.total) > parseInt(r.cantidad))
                        );
                }
            }
        });
        win.show();
    },  
})
 this.addToolbarButtonProductos(this.btnImportar);

        this.winGestionarDocumento.on('show',function(){
            if (
                (this.getSmPrincipal().getSelected() && this.getSmPrincipal().getSelected().data.estado == '1')) {
                this.btnImportar.enable();
            } else {
                this.btnImportar.disable();
            }
        }.createDelegate(this));
      
        this.addToolbarButtonProductos(LOG.util.Prototipos.botonAprobar({
            tooltip: _this.idioma.ttBtnAprobar,
            text: _this.idioma.lbBtnAprobar,
            handler: function () {

                _this.modelo.aprobar(_this.winGestionarDocumento.record.data, function (r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "3"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "3";
                    }
                    _this.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.winGestionarDocumento.cargarProductos(_this.modelo);
                    _this.winGestionarDocumento.onShow();
                });

            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (!_this.winGestionarDocumento.record) {
                            b.disable();
                        } else {
                            if (_this.winGestionarDocumento.record.data.estado == 2) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
       
    },
    initDefaultColumns: function () {
        LOG.dist.pedido.View.superclass.initDefaultColumns.call(this);
        var _this = this;
        this.listaColumnas.deleteAll();

        this.addGridColumn({
            header: _this.idioma.cgNroDoc,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgNroRef,
            width: 110,
            dataIndex: 'numeroref',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgFechaCreado,
            width: 120,
            dataIndex: 'fechacontable',
            default: true
        });
        /*this.addGridColumn({
            header: 'Origen',
            width: 150,
            default: true,
            renderer: function (value, md, r) {
                if(r.json.nordoc_origen && r.json.nordoc_origen != '')
                    return r.json.nordoc_origen +  ': ' + r.json.tipodoc_origen;
                return '';
            }
        });*/
        this.addGridColumn({
            header: _this.idioma.lbDocOrigen,
            dataIndex: 'nroDoc',
            width: 100,
            align: 'right',
            default: true,
            renderer: function (v) {
                if (v == null) {
                    return '-';
                }
                return v;
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbTipoDocOrigen,
            dataIndex: 'tipoDoc',
            width: 150,
            default: true,
        });
        this.addGridColumn({
            header: _this.idioma.lbCliente,
            dataIndex: 'cliente',
            autoExpand: true,
            default: true,
            renderer: function (v) {
                if (v == null) {
                    return '-'
                }
                return v;
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbBalanceo,
            dataIndex: 'balanceado',
            autoExpand: true,
            width: 75,
            default: true,
            renderer: function (v,metaData) {
                if (v == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + 'Balanceado' + '"';
                }else{
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip="' + 'No Balanceado' + '"';
                }
                return '';
            }
        });
        this.addGridColumn({
            header: 'No.Balanceo',
            dataIndex: 'nrodocbalanceo',
            autoExpand: true,
            width: 90,
            default: true
        });

        Ext.Ajax.request({
            url: 'getTipopedido',
            callback: function (opt, scs, resp) {
                respMsg = Ext.decode(resp.responseText);
                if (respMsg.datos[0]) {
                    if (respMsg.datos[0].tipopedido == 1) {
                        _this.insertGridColumn({
                            header: _this.idioma.lbContrato,
                            dataIndex: 'idcontrato',
                            default: true,
                            renderer: function (v) {
                                if (v == null) {
                                    return '-'
                                }
                                return v;
                            }
                        }, 2)
                    }
                }
            }
        });

        this.addGridColumn({
            header: _this.idioma.lbEstado,
            dataIndex: 'estado',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbEstadoEjecucion,
            dataIndex: 'estadopedido',
            width: 150,
            default: true,
            renderer: function (v) {
                    if (!v) {
                    return '-'
                } else {
                    return LOG.dist.pedido.EstadoPedido[v];
                }
            }
        });

        this.addGridColumn({
            header: _this.idioma.lbFechaVencimiento,
            dataIndex: 'fechavencimiento',
            width: 120,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbCapacidadLiquida,
            width: 110,
            dataIndex: 'capacidadliquida',
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClHabiltado + '"';
                }
                    else{
                     metaData.css = 'icondistra-aceptar rojo';
                     metaData.attr = 'ext:qtip="' + _this.idioma.ttClDeshabiltado + '"';
                    }


                return '';
            },
            filter: {
                type: 'boolean',
                yesText: 'Habilitado',
                noText: 'Deshabilitado',
                dataIndex: 'capacidadliquida'
            }
        });
        this.addGridColumn({
            header: 'Tipo de pedido',
            dataIndex: 'denomtipopedido',
            width: 120,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCantProductos,
            width: 150,
            align: 'right',
            dataIndex: 'productos',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCantServicios,
            width: 150,
            align: 'right',
            dataIndex: 'servicios',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCantReclamos,
            width: 150,
            align: 'right',
            dataIndex: 'reclamos',
            default: true
        });
       

        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({dataIndex: 'observaciones'});
        this.addGridColumn({dataIndex: 'idcliente'});
        this.addGridColumn({dataIndex: 'balanceado'});
        this.addGridColumn({dataIndex: 'nrodocbalanceo'});
        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({dataIndex: 'iddoc'});
        this.addGridColumn({dataIndex: 'nroDoc'});
        this.addGridColumn({dataIndex: 'tipoDoc'});
        this.addGridColumn({dataIndex: 'denomtipopedido'});
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            tiporeclamo: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            fechavencimineto: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            estadoejecucion: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            cliente: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null
        } : {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null
        };
    },
    panelSuperior: function () {

        var _this = this;
        var fecha = new Date();
        this.pedidoObservaciones = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbObservaciones,
            name: 'observaciones',
            maxLength: 255,
            minLength: 2,
            enableKeyEvents: true
        });

        this.txtNroContrato = new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbContrato,
            name: 'idcontrato',
            allowBlank: false
        });

        this.checkCapacidadLiquida = new Ext.form.Checkbox({
            boxLabel:'Capacidad líquida',
            name: 'capacidadliquida',
            style: 'margin:25px 0px 0px 15px',
            height: 40,
            width: '50%',
            disabled: true
        });
        this.panelCheck = LOG.util.UIManager.initPanel({
            title: '',
            region: 'center',
            labelAlign: 'left',
            layout: 'column',
            height: 40,
            width: '50%',
            items: [this.checkCapacidadLiquida]
        });

        this.cmbCliente = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCliente,
            url: 'cargarClientes',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            loadingText: _this.idioma.lbCargando,
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            width: '50%',
            allowBlank: false,
            emptyText: _this.idioma.lbSeleccione,
            minChars: 0,
            forceSelection: true,
            mode: 'remote'
        });

        this.cmbCliente.getStore().on({
            load: function (st) {
                if (st.data.items[0] && !st.data.items[1]) {
                    _this.cmbCliente.setValue(st.data.items[0].data.nombre);
                }
            }
        });

        this.cmbTipopedido = new LOG.util.ComboBox({
            fieldLabel: 'Tipo de pedido',
            url: 'cargarNomtipopedido',
            hiddenName: 'denomtipopedido',
            valueField: 'idnomconcepto',
            displayField: 'denomtipopedido',
            loadingText: _this.idioma.lbCargando,
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            width: '50%',
            //allowBlank: false,
            emptyText: _this.idioma.lbSeleccione,
            minChars: 0,
            forceSelection: true,
            mode: 'remote'
        });

        this.cmbTipopedido.getStore().on({
            load: function (st) {
                if (st.data.items[0] && !st.data.items[1]) {
                    _this.cmbTipopedido.setValue(st.data.items[0].data.denominacion);
                }
            }
        });

        this.panelDatosContrato = LOG.util.UIManager.initColumnForm({
            columnas:3
        });
        this.panelDatosContrato.addComponent(this.cmbCliente);
        this.panelDatosContrato.getColumn(0).columnWidth = '0.3';
        Ext.Ajax.request({
            url: 'getTipopedido',
            callback: function (opt, scs, resp) {
                respMsg = Ext.decode(resp.responseText);
                if (respMsg.datos[0]) {
                    if (respMsg.datos[0].tipopedido == 1) {
                        _this.panelDatosContrato.addComponent(_this.txtNroContrato);
                        _this.panelDatosContrato.getColumn(1).columnWidth = '0.3';
                    }
                    if (respMsg.datos[0].vigenciapedido) {
                        var fechaMax = new Date();
                        var vigencia = fechaMax.add(Date.DAY, parseInt(respMsg.datos[0].vigenciapedido));
                    }
                    _this.fechaVencimiento = new Ext.form.DateField({
                        fieldLabel: _this.idioma.lbFechaVencimiento,
                        name: 'fechavencimiento',
                        allowBlank: false,
                        format: 'd/m/Y',
                        width: '50%',
                        minValue: fecha.format('d/m/Y'),
                        minText: _this.idioma.minTextFechaVencimiento + fecha.format('d/m/Y') + '.',
                        maxValue: (vigencia) ? vigencia.format('d/m/Y') : null,
                        mode: 'local',
                        editable: false
                    });
                    _this.panelDatosContrato.addComponent(_this.fechaVencimiento);
                    _this.panelDatosContrato.addComponent(_this.cmbTipopedido);
                    //_this.panelDatosContrato.addComponent(_this.panelCheck);
                }

            }
        });
        this.panelDatosContrato.getColumn(1).columnWidth = '0.35';
        this.panelSuperiorEncabezado = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.panelSuperiorEncabezado.addComponent(this.panelDatosContrato);
        this.panelSuperiorEncabezado.addComponent(this.pedidoObservaciones);

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            items: [this.panelSuperiorEncabezado]
        });
    },
    mostrarError: function(msg, id, diferencia) {
        var _this = this;
        Ext.MessageBox.show({
            title: 'Error',
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR,
            fn: function() {
                var win = new LOG.dist.pedido.Error({idioma: _this.idioma, iddocumento: id, diferencia: diferencia});
                win.init();
                win.view();
            }
        });
    }
});

/**
 * 
 * @type LOG.util.UITemplate
 */
LOG.dist.pedido.Error = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'ventana';
        this.urlBusquedaGridPrincipal = 'cargarProductoError';
        this.autoLoad = false;
        this.autoSelect = false;
        LOG.dist.pedido.Error.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlError;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idimppedido'});
        this.addGridColumn({
           header: this.idioma.gcNro,
            width: 30,
            dataIndex: 'nrodoc',
            align: 'right',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcCodigo,
            width: 80,
            dataIndex: 'codigo',
            renderer: function(_v) {
                return _v || _this.idioma.gcCodigoVacio;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcDenominacion,
            autoExpand: true,
            dataIndex: 'descripcionproducto',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcUM,
            width: 40,
            dataIndex: 'umedida',
            default: true
        });
        /*this.addGridColumn({
            header: this.idioma.gcCategoria,
            width: 80,
            dataIndex: 'categoria',
            renderer: function(_v) {
                return _v || '-';
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcFechaFabricacion,
            width: 100,
            dataIndex: 'fechafabricacion',
            renderer: function(_v, _mD, _r) {
                var pos = -1;
                if (_r.json.errorfecha) {
                    pos = _r.json.errorfecha.indexOf('1');
                }
                return _v || (pos != -1 ? _this.idioma.gcFechaNoValida : '-');
            },
            default: true
        });*/
        this.addGridColumn({
            header: this.idioma.gcFechaVencimiento,
            width: 100,
            dataIndex: 'fechavencimiento',
            renderer: function(_v, _mD, _r) {
                var pos = -1;
                if (_r.json.errorfecha) {
                    pos = _r.json.errorfecha.indexOf('2');
                }
                return _v || (pos != -1 ? _this.idioma.gcFechaNoValida : '-');
            },
            default: true
        });
       
       /* // Lote.
        this.addGridColumn({
            header: this.idioma.gcFechaProduccion,
            width: 120,
            dataIndex: 'fechaproduccion',
            renderer: function(_v, _mD, _r) {
                var pos = -1;
                if (_r.json.errorfecha) {
                    pos = _r.json.errorfecha.indexOf('3');
                }
                return _v || (pos != -1 ? _this.idioma.gcFechaNoValida : _r.json.cantidadlote ? _this.idioma.gcFechaVacia : '-');
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcFechaVencimientoLote,
            width: 120,
            dataIndex: 'fechavencimientolote',
            renderer: function(_v, _mD, _r) {
                var pos = -1;
                if (_r.json.errorfecha) {
                    pos = _r.json.errorfecha.indexOf('4');
                }
                return _v || (pos != -1 ? _this.idioma.gcFechaNoValida : '-');
            },
            default: true
        });*/
    },
    render: function() {
        var _this = this;
        var render = LOG.dist.pedido.Error.superclass.render.call(this);
        if (!_this.diferencia) {
            this.leyenda = new LOG.lb.plugin.Leyenda({
                leyendAlign: 'bot-left',
                leyendContainer: this.getGridPrincipal(),
                leyendConfig: this.getLeyenda()
            });
            this.getGridPrincipal().getBottomToolbar().insert(this.getGridPrincipal().getBottomToolbar().items.length - 1, this.leyenda);
            this.getGridPrincipal().getBottomToolbar().insert(this.getGridPrincipal().getBottomToolbar().items.length - 1, '-');
        }
        this.getStorePrincipal().on({
            beforeload: function() {
                this.baseParams.iddocumento = this.initBaseParams.iddocumento = _this.iddocumento;
                this.baseParams.diferencia = this.initBaseParams.diferencia = _this.diferencia || null;
            },
            load: function() {
                this.each(function(p, index) {
                    if (p.json.codigoproducto && !p.json.sinfecha && !p.json.actualp) {
                        if (p.json.errorfecha && p.json.errorfecha.indexOf('5') != -1) {
                            Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass('fila-azul');
                        }
                        if (p.json.duplicado) {
                            Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass('fila-verde');
                        }
                    }
                    if (!p.json.codigoproducto) {
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 3)).addClass('fila-roja'); 
                    }
                    if (!p.json.sinfecha && !p.json.errorfecha) {
                        if (p.json.rangop && !p.json.actualp) {
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 7)).addClass('fila-naranja');
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 8)).addClass('fila-naranja');
                        }
                        /*if (p.json.rangol && !p.json.actuall) {
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 9)).addClass('fila-naranja');
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 10)).addClass('fila-naranja');
                        }*/
                    }
                    if (p.json.sinfecha) {
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 9)).addClass('fila-marron');
                    }
                    if (p.json.actualp) {
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 7)).addClass('fila-violeta');
                    }
                    if (p.json.actuall) {
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 9)).addClass('fila-violeta');
                    }
                    if (p.json.errorfecha) {
                        var error = p.json.errorfecha.trim().split(' ');
                        Ext.each(error, function(e) {
                            if (parseInt(e) < 5) {
                                Ext.fly(_this.getGridPrincipal().getView().getCell(index, (parseInt(e) + 6))).addClass('fila-violeta');
                            }
                        });
                    }
                });
            }
        });
        this.getStorePrincipal().load();
        this.getVistaPrincipal().closeFn = function() {
            Ext.Ajax.request({
                url: 'eliminarImportar',
                method: 'POST',
                params: {iddocumento: _this.iddocumento}
            });
        };
        return render;
    },
    getLeyenda: function() {
        return {
            autoWidth: true,
            autoHeight: true,
            tpl: new Ext.XTemplate(
                '<div class="leyend-block">',
                '<h3>' + this.idioma.lbTipoError + '</h3>',
                '<ul>',
                '<li style="color:#00CCFF;">' + this.idioma.lbTarjetaExistencte + '</li>',
                '<li style="color:#00CC33;">' + this.idioma.lbProductoRepetido + '</li>',
                '<li style="color:red;">' + this.idioma.lbCodigoProductoFaltante,
                '<li style="color:violet;">' + this.idioma.lbFechaNoValida + '</li>',
                '<li style="color:#FF9933;">' + this.idioma.lbRangoFecha + '</li>',
                '<li style="color:#cccc00;">' + this.idioma.lbFechaVacia + '</li>',
                '</ul>',
                '</div>'
                )
        };
    }

    
});