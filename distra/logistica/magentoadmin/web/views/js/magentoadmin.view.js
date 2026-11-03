Ext.ns('LOG.fact.magentoadmin');

LOG.fact.magentoadmin.View = Ext.extend(LOG.util.UITemplate, {
    baseParams: {},
    constructor: function (config) {
        config.idioma = LOG.util.UIManager.apply(LOG.fact.magentoadmin.Idioma, LOG.util.Idioma);
        this.busquedaBasica = true;
        this.dirController = '/logistica/facturacion/magentoadmin/index.php/magento'
        this.busquedaAvanzada = true;
        this.idGridPrincipal = 'nroorodenventa';
        this.concepto = LOG.fact.magentoadmin.Idioma.lbOrdenV;
        this.textBusquedaSimple = LOG.fact.magentoadmin.Idioma.lbOrdenV;
        this.modoSeleccion = 2;
        this.vistaProductos = new LOG.fact.magentoadmin.ViewProductos({
            parentView: this
        });
        this.urlBusquedaGridPrincipal = 'getOrdenesVenta';
        this.modelo = new LOG.fact.magentoadmin.Model({
            idioma: config.idioma
        });
        LOG.fact.magentoadmin.View.superclass.constructor.call(this, config);
        this.filtroUEB = this.grantedAction('filtrarUEB');
        if (this.filtroUEB) {
            this.baseParams.idueb = idEntidad;
            this.baseParams.estadoov = -1;
        }
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(
            LOG.util.UIManager.createBtn({
                iconCls: 'adicionar',
                text: 'Adicionar',
                tooltip: 'Crear nueva orde de venta',
                controlFn: function (btn, caller) {
                    btn.setVisible(false);
                    if (caller.grantedAction('R_NVB')) {
                        btn.setVisible(true);
                    }
                },
                handler: function () {
                    var ordenModel = new LOG.fact.magentoadmin.OderVentaModel({
                        idioma: _this.idioma
                    });
                    var panelForm = LOG.util.UIManager.initColumnForm({
                        region: 'center',
                        border: false,
                        columnas: 2,
                    });

                    panelForm.addComponent(
                        LOG.util.Prototipos.inputTexto({
                            fieldLabel: "No. Orden",
                            name: "orderId",
                            allowBlank: false,
                        }),
                    );
                    panelForm.addComponent(
                        new Ext.form.DateField({
                            fieldLabel: "Fecha de oferta",
                            anchor: "98%",
                            format: "d/m/Y",
                            allowBlank: false,
                            name: "foferta",
                            minDate: new Date(),
                        }),
                    );
                    panelForm.addComponent(
                        LOG.util.Prototipos.inputTexto({
                            fieldLabel: "Entregar a",
                            name: "cliente",
                            allowBlank: false,
                        }),
                    );
                    var fAddOrder = LOG.util.UIManager.initForm({
                        frame: true,
                        border: false,
                        region: 'center',
                        layout: 'border',
                        items: [panelForm, {
                            region: 'south',
                            layout: 'form',
                            labelAlign: 'top',
                            border: false,
                            height: 120,
                            items: [new Ext.form.TextArea({
                                anchor: "98%",
                                fieldLabel: 'Direcci\xf3n de entrega',
                                name: 'direntrega'
                            })]
                        }]
                    });
                    ordenModel.bindForm(fAddOrder);
                    var win = LOG.util.UIManager.initWindow({
                        title: "Crear orden de venta",
                        usarAplicar: false,
                        resizable: false,
                        width: 530,
                        height: 300,
                        onShowFn: function () {
                            ordenModel.addActionButton(this.getButton(2));
                        },
                        aceptarFn: function () {
                            ordenModel.salvar({}, function () {
                                _this.getStorePrincipal().load();
                            }, function () {
                                mostrarMensaje(3, LOG.fact.magentoadmin.Idioma.msgErrorOrden);
                            });
                        },
                        items: [fAddOrder],
                    });
                    console.log(win);
                    win.show();
                }
            })
        );
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: 'Importar',
            controlFn: function (btn, caller) {
                if (caller.grantedAction('FIMPORRTAR') && !caller.grantedAction('R_NVB')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
            },
            menu: [
                new Ext.menu.Item({
                    text: 'Ordenes listas',
                    iconCls: 'importar',
                    tooltip: LOG.fact.magentoadmin.Idioma.ttImportarOrdenes,
                    handler: function () {
                        var win = new LOG.lb.importar.View({
                            class: 'MagentoModel',
                            params: {
                                formato: 'xml'
                            },
                            fn: function (r) {
                                _this.getStorePrincipal().load();
                            }
                        });
                        win.show();
                    }
                }),
                new Ext.menu.Item({
                    text: 'Fichero de banco',
                    iconCls: 'importar',
                    tooltip: LOG.fact.magentoadmin.Idioma.ttImportarFB,
                    handler: function () {
                        var win = new LOG.lb.importar.View({
                            class: 'MagentoModel',
                            params: {
                                formato: 'csv'
                            },
                            fn: function (r) {
                                _this.getStorePrincipal().load();
                            }
                        });
                        win.show();
                    }
                })
            ]
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            handler: function () {
                var parametros = {};
                parametros.idorden = _this.getSmPrincipal().getSelected().data.id;
                parametros.url = 'eliminarOrden';
                _this.modelo.cargaInicial(parametros, function () {
                    _this.getStorePrincipal().reload({});
                    _this.modelo.reset();
                });
            },
            controlFn: function (btn, caller) {
                if (caller.grantedAction('FELIM')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
                btn.disable();
                _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(function (e) {
                    if (e === 'selectionchange') {
                        if (_this.getSmPrincipal().getCount() === 1 && caller.getSmPrincipal().getSelected().data.estadoov === 'Pago pendiente') {
                            btn.enable();
                        } else {
                            btn.disable();
                        }
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonNuevo({
            iconCls: 'intercambiar',
            text: 'Enviar UEB',
            handler: function () {
                (new LOG.util.UIManager.initWindow({
                    title: LOG.fact.magentoadmin.Idioma.lbEnviarUEB,
                    usarAplicar: false,
                    resizable: false,
                    width: 250,
                    height: 130,
                    onShowFn: function () {
                        _this.modelo.addActionButton(this.getButton(2));
                    },
                    aceptarFn: function () {
                        var idOrden = [];
                        if (_this.getSmPrincipal().getCount() == 0) {
                            mostrarMensaje(1, LOG.fact.magentoadmin.Idioma.msgErrorSeleccion);
                            return;
                        }
                        Ext.each(_this.getSmPrincipal().getSelections(), function (r) {
                            if (r.data.idueb == '') {
                                idOrden.push(r.data.id);
                            }
                        });
                        if (idOrden.length == 0) {
                            mostrarMensaje(1, LOG.fact.magentoadmin.Idioma.msgErrorUEBAsignadas);
                            return;
                        }
                        _this.modelo.cargaInicial({
                            url: 'establecerUEB',
                            idorden: Ext.encode(idOrden),
                            idueb: _this.modelo.idueb
                        }, function () {
                            _this.getStorePrincipal().reload({});
                        })
                    },
                    items: [_this.modelo.bindForm(LOG.util.UIManager.initForm({
                        region: 'center',
                        labelAlign: 'top',
                        frame: true,
                        items: [new LOG.util.ComboBox({
                            fieldLabel: LOG.fact.magentoadmin.Idioma.lbUEB,
                            url: 'getUEB?ueb=0',
                            name: 'idueb',
                            allowBlank: false,
                            forceSelection: true,
                            autoSelect: true,
                            displayField: 'denominacion',
                            valueField: 'id'
                        })]
                    }))]
                })).show();
            },
            controlFn: function (btn, caller) {
                if (caller.grantedAction('FENVIAR') && !caller.grantedAction('R_NVB')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
                btn.disable();
                LOG.util.UIManager.encadenaFn(caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (caller.getSmPrincipal().getCount() > 0) {
                            btn.enable();
                        } else {
                            btn.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonNuevo(
            {
                text: 'Pago aceptado',
                iconCls: 'facturar',
                tooltip: LOG.fact.magentoadmin.Idioma.ttFacturar,
                handler: function () {
                    _this.modelo.cargaInicial({
                        url: 'aceptarPago',
                        idorden: _this.getSmPrincipal().getSelected().data.id
                    }, function (o, r) {
                        let comprobanteModel = new LOG.lb.comprobante.Model({
                            idioma: LOG.util.UIManager.apply(LOG.lb.comprobante.Idioma, LOG.util.Idioma),
                            urlController: '/logistica/utiles/comprobante/index.php/comprobante/'
                        });
                        comprobanteModel.bindGridPanel(_this.getGridPrincipal());
                        comprobanteModel.contabilizar({
                            iddocumento : r.id,
                            idestructuracomun : r.storageId
                        }, function (_o, _s, _r){
                            var rData = Ext.decode(_r.responseText);
                            var comprobante = rData.comprobante;
                            Ext.Cont.Comprobante.init(comprobante.idsubsistema, comprobante.detalle,
                                comprobante.descripcion, comprobante.fechaContable, comprobante.dataComprobante,
                                comprobante.idtipocomprobante, 1, 1, undefined, undefined, undefined,
                                undefined, undefined, undefined, r.storageId)
                                .onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                                    if (idComprobante) {
                                        comprobanteModel.actualizarDocumentos(idComprobante, numComprobante, fechaComprobante,r.documentosContabilizados);
                                    }
                                }).onClose(function () {

                            }).onShow(function () {
                                Ext.getBody().unmask();
                            });
                        });
                        _this.getStorePrincipal().reload({});
                        /*mostrarMensaje(r.codigoMsg, r.msg)*/
                    })
                },
                controlFn: function (btn, caller) {
                    btn.setVisible(false);
                    if (caller.grantedAction('R_NVB')) {
                        btn.setVisible(true);
                    }
                    btn.disable();
                    LOG.util.UIManager.encadenaFn(caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e === 'selectionchange') {
                            btn.disable();
                            if (caller.getSmPrincipal().getCount() === 1 && caller.getSmPrincipal().getSelected().data.estadoov === 'Pago pendiente') {
                                btn.enable();
                            }
                        }
                    }, 'controlBoton');
                }
            }
        ));
        this.addToolbarButton(LOG.util.Prototipos.botonNuevo({
            iconCls: 'aprobar',
            text: 'Entregado',
            handler: function () {
                var fEntrega;
                (new LOG.util.UIManager.initWindow({
                    title: LOG.fact.magentoadmin.Idioma.lbEntregada,
                    usarAplicar: false,
                    resizable: false,
                    width: 250,
                    height: 130,
                    onShowFn: function () {
                        _this.modelo.addActionButton(this.getButton(2));
                    },
                    aceptarFn: function () {
                        var idOrden = [];
                        if (_this.getSmPrincipal().getCount() == 0) {
                            mostrarMensaje(1, LOG.fact.magentoadmin.Idioma.msgErrorSeleccion);
                            return;
                        }
                        Ext.each(_this.getSmPrincipal().getSelections(), function (r) {
                            if (r.data.estadoov != 3) {
                                idOrden.push(r.data.id);
                            }
                        });
                        if (idOrden.length == 0) {
                            mostrarMensaje(1, LOG.fact.magentoadmin.Idioma.msgErrorUEBEntregadas);
                            return;
                        }
                        _this.modelo.cargaInicial({
                            url: 'entregarOrden',
                            fecha: fEntrega.getValue(),
                            idorden: Ext.encode(idOrden)
                        }, function () {
                            _this.getStorePrincipal().reload({});
                        })
                    },
                    items: [_this.modelo.bindForm(LOG.util.UIManager.initForm({
                        region: 'center',
                        labelAlign: 'top',
                        frame: true,
                        items: [fEntrega = new Ext.form.DateField({
                            fieldLabel: 'Fecha de entrega',
                            anchor: '98%',
                            format: 'd/m/Y',
                            allowBlank: false,
                            name: 'fechantrega',
                            maxDate: new Date()
                        })]
                    }))]
                })).show();
            },
            controlFn: function (btn, caller) {
                if (caller.grantedAction('FENTREGAR')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
                btn.disable();
                LOG.util.UIManager.encadenaFn(caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (caller.getSmPrincipal().getCount() === 1 && caller.getSmPrincipal().getSelected().data.estadoov === 'Pago aceptado') {
                            btn.enable();
                        } else {
                            btn.disable();
                        }
                    }
                });
            }
        }));


        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: 'Operaciones',
            controlFn: function (btn, caller) {
                if (caller.grantedAction('FOPONES') && !caller.grantedAction('R_NVB')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
            },
            menu: [
                new Ext.menu.Item({
                    text: 'Consolidar productos por UEB',
                    iconCls: 'importar',
                    tooltip: LOG.fact.magentoadmin.Idioma.ttConsolidado,
                    handler: function () {
                        _this.modelo.cargaInicial({
                            url: 'getDistribucion',
                            ueb: _this.filtroUEB ? 1 : -1,
                            fecha: '',
                            fFin: '',
                        }, function (o, r) {
                            window.open(r.url);
                        });
                        /*var fEntrega;
                        var fFin;
                        (new LOG.util.UIManager.initWindow({
                            title: LOG.fact.magentoadmin.Idioma.lbFecha,
                            usarAplicar: false,
                            resizable: false,
                            width: 250,
                            height: 180,
                            onShowFn: function () {
                                _this.modelo.addActionButton(this.getButton(2));
                            },
                            aceptarFn: function () {
                                _this.modelo.cargaInicial({
                                    url: 'getDistribucion',
                                    ueb: _this.filtroUEB ? 1 : -1,
                                    fecha: fEntrega.getValue(),
                                    fFin: fFin.getValue(),
                                }, function (o, r) {
                                    window.open(r.url);
                                })
                            },
                            items: [_this.modelo.bindForm(LOG.util.UIManager.initForm({
                                region: 'center',
                                labelAlign: 'top',
                                frame: true,
                                items: [fEntrega = new Ext.form.DateField({
                                    anchor: '98%',
                                    format: 'd/m/Y',
                                    allowBlank: false,
                                    name: 'fechantrega',
                                    maxDate: new Date()
                                }),fFin = new Ext.form.DateField({
                                    anchor: '98%',
                                    format: 'd/m/Y',
                                    allowBlank: false,
                                    name: 'fFin',
                                    maxDate: new Date()
                                })]
                            }))]
                        })).show();*/
                    },
                    controlFn: function (btn, caller) {
                        if (caller.grantedAction('FCOSNOL')) {
                            btn.setVisible(true);
                        } else {
                            btn.setVisible(false);
                        }
                    }
                }),
                new Ext.menu.Item({
                    text: 'Total de productos',
                    iconCls: 'importar',
                    tooltip: LOG.fact.magentoadmin.Idioma.ttConsolidado,
                    handler: function () {
                        var fEntrega;
                        var fFin;
                        (new LOG.util.UIManager.initWindow({
                            title: LOG.fact.magentoadmin.Idioma.lbFecha,
                            usarAplicar: false,
                            resizable: false,
                            width: 250,
                            height: 180,
                            onShowFn: function () {
                                _this.modelo.addActionButton(this.getButton(2));
                            },
                            aceptarFn: function () {
                                _this.modelo.cargaInicial({
                                    url: 'getDistribucionTotal',
                                    ueb: _this.filtroUEB ? 1 : -1,
                                    fecha: fEntrega.getValue(),
                                    fFin: fFin.getValue()
                                }, function (o, r) {
                                    window.open(r.url);
                                })
                            },
                            items: [_this.modelo.bindForm(LOG.util.UIManager.initForm({
                                region: 'center',
                                labelAlign: 'top',
                                frame: true,
                                items: [fEntrega = new Ext.form.DateField({
                                    anchor: '98%',
                                    format: 'd/m/Y',
                                    allowBlank: false,
                                    name: 'fechantrega',
                                    maxDate: new Date()
                                }),
                                    fFin = new Ext.form.DateField({
                                        anchor: '98%',
                                        format: 'd/m/Y',
                                        allowBlank: false,
                                        name: 'fFin',
                                        maxDate: new Date()
                                    })]
                            }))]
                        })).show();
                    },
                    controlFn: function (btn, caller) {
                        if (caller.grantedAction('FCOSNOL')) {
                            btn.setVisible(true);
                        } else {
                            btn.setVisible(false);
                        }
                    }
                }),
                new Ext.menu.Item({
                    text: 'Transferir productos',
                    iconCls: 'sincronizar',
                    tooltip: LOG.fact.magentoadmin.Idioma.ttTransferir,
                    handler: function () {
                        _this.modelo.cargaInicial({
                            url: 'transferirProductos',
                            fecha: '',
                            fFin: ''
                        }, function (o, r) {
                            mostrarMensaje(1, r.msg)
                        });
                        /*var fEntrega;
                        var fFin;
                        (new LOG.util.UIManager.initWindow({
                            title: LOG.fact.magentoadmin.Idioma.lbFecha,
                            usarAplicar: false,
                            resizable: false,
                            width: 250,
                            height: 180,
                            onShowFn: function () {
                                _this.modelo.addActionButton(this.getButton(2));
                            },
                            aceptarFn: function () {
                                _this.modelo.cargaInicial({
                                    url: 'transferirProductos',
                                    fecha: fEntrega.getValue(),
                                    fFin: fFin.getValue()
                                }, function (o, r) {
                                    mostrarMensaje(1, r.msg)
                                })
                            },
                            items: [_this.modelo.bindForm(LOG.util.UIManager.initForm({
                                region: 'center',
                                labelAlign: 'top',
                                frame: true,
                                items: [fEntrega = new Ext.form.DateField({
                                    anchor: '98%',
                                    format: 'd/m/Y',
                                    allowBlank: false,
                                    name: 'fechantrega',
                                    maxDate: new Date()
                                }),fFin = new Ext.form.DateField({
                                    anchor: '98%',
                                    format: 'd/m/Y',
                                    allowBlank: false,
                                    name: 'fFin',
                                    maxDate: new Date()
                                })]
                            }))]
                        })).show();*/
                    },
                    controlFn: function (btn, caller) {
                        if (caller.grantedAction('FTRANSFERIR')) {
                            btn.setVisible(true);
                        } else {
                            btn.setVisible(false);
                        }
                    }
                }),
                new Ext.menu.Item({
                    text: 'Facturar',
                    iconCls: 'facturar',
                    tooltip: LOG.fact.magentoadmin.Idioma.ttFacturar,
                    handler: function () {
                        _this.modelo.cargaInicial({
                            url: 'facturarOrden',
                            idorden: _this.getSmPrincipal().getSelected().data.id
                        }, function (o, r) {
                            mostrarMensaje(r.codigoMsg, r.msg)
                        })
                    },
                    controlFn: function (btn, caller) {
                        if (caller.grantedAction('FFACTURAR')) {
                            btn.setVisible(true);
                        } else {
                            btn.setVisible(false);
                        }
                        btn.disable();
                        LOG.util.UIManager.encadenaFn(caller.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (caller.getSmPrincipal().getCount() == 1 && caller.getSmPrincipal().getSelected().data.esatdofac == 1) {
                                    btn.enable();
                                } else {
                                    btn.disable();
                                }
                            }
                        });
                    }
                }),
                new Ext.menu.Item({
                    text: 'Cerrar',
                    iconCls: 'iniciar',
                    tooltip: LOG.fact.magentoadmin.Idioma.lbCerrar,
                    handler: function () {
                        _this.modelo.cargaInicial({
                            url: 'cerrar'
                        }, function (o, r) {
                            _this.getStorePrincipal().reload({});
                        })
                    },
                    controlFn: function (btn, caller) {
                        if (caller.grantedAction('FCERRAR')) {
                            btn.setVisible(true);
                        } else {
                            btn.setVisible(false);
                        }
                    }
                }),
                new Ext.menu.Item({
                    text: 'Imprimir listado',
                    iconCls: 'imprimir',
                    tooltip: LOG.fact.magentoadmin.Idioma.lbListadoOV,
                    handler: function () {
                        var params = {};//TODO obtener los parametros por los cuales esta filtrando el grid principal
                        params.idestructura = _this.filtroUEB ? idEntidad : -1;
                        var tipoReportes = new LOG.util.Report({
                            reports: [{
                                dirReport: '/distra/logistica/inventario/recuperaciones/MovimientosCuentaModelo',
                                name: 'MovimientosCuentaModelo',
                                isList: true,
                                params: params
                            }]
                        });
                        tipoReportes.view();
                    }
                })
            ]
        }));

        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            iconCls: 'configuracion',
            text: 'Configurar',
            handler: function () {
                (LOG.util.UIManager.initWindow({
                    title: 'Configurar m\xf3dulo',
                    resizable: false,
                    usarAplicar: false,
                    width: 370,
                    height: 200,
                    items: [
                        LOG.util.UIManager.initForm({
                            region: 'center',
                            labelAlign: 'top',
                            frame: true,
                            items: [
                                new LOG.util.ComboBox({
                                    fieldLabel: 'Dep\xf3sito de Mercancias',
                                    url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos?idtipo=-1&seguridad=1&caso=1',
                                    forceSelection: true,
                                    anchor: '98%',
                                    mode: 'remote',
                                    valueField: 'id',
                                    displayField: 'deposito'
                                }),

                                new LOG.util.ComboBox({
                                    fieldLabel: 'Cliente',
                                    url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
                                    forceSelection: true,
                                    anchor: '98%',
                                    mode: 'remote',
                                    valueField: 'idclientesproveedores',
                                    displayField: 'nombre'
                                }),
                            ]
                        })]
                })).show();
            },
            controlFn: function (_btn, _invoker) {
                _btn.setVisible(false);
                if (_invoker.grantedAction('R_NVB')) {
                    _btn.setVisible(true)
                }

            }
        }))
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'id'
        });
        this.addGridColumn({
            dataIndex: 'esatdofac'
        });
        this.addGridColumn({
            dataIndex: 'idueb'
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbOrdenV,
            width: 105,
            isFiltroBusqueda: true,
            dataIndex: 'nroorodenventa'
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbEntregar,
            width: 200,
            dataIndex: 'entregar'
        });

        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbEntregarDir,
            width: 280,
            dataIndex: 'direccion',
            isFiltroBusqueda: true,
            filter: {
                type: 'string',
                emptyText: LOG.fact.magentoadmin.Idioma.lbEntregarDir,
                dataIndex: 'direccion'
            }
        });

        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbUEB,
            width: 180,
            dataIndex: 'ueb',
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbTransf,
            width: 70,
            dataIndex: 'transferido',
        });

        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbEOV,
            width: 120,
            dataIndex: 'estadoov',
            filter: {
                type: 'combo',
                url: 'getEstados?fac=0',
                valueField: 'id',
                displayField: 'denominacion',
                dataIndex: 'estadoov',
            }
        });

        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbEFAC,
            width: 120,
            dataIndex: 'estadofac',
            filter: {
                type: 'combo',
                url: 'getEstados?fac=1',
                valueField: 'id',
                displayField: 'denominacion',
                dataIndex: 'estadofac',
            }
        });

        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbNFAC,
            width: 80,
            dataIndex: 'nfactura'
        });

        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbFVT,
            width: 100,
            dataIndex: 'fct'
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbFAB,
            width: 100,
            dataIndex: 'fcb'
        });

        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbFEF,
            width: 100,
            dataIndex: 'fef'
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbGrandTotalM,
            width: 100,
            dataIndex: 'mercancia'
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbGrandTotalT,
            width: 100,
            dataIndex: 'transportacion'
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbGrandTotal,
            width: 100,
            dataIndex: 'importe'
        });
    },
    init: function () {
        var _this = this;
        LOG.fact.magentoadmin.View.superclass.init.call(this);
        this.getPanelBusqueda().setColumns(2);
        this.addFilterComponent(new LOG.util.ComboBox({
            fieldLabel: LOG.fact.magentoadmin.Idioma.lbEOV,
            url: 'getEstados?fac=0',
            name: 'estadoov',
            displayField: 'denominacion',
            valueField: 'id'
        }));

        this.addFilterComponent(new LOG.util.ComboBox({
            fieldLabel: LOG.fact.magentoadmin.Idioma.lbFabric,
            name: 'fabricante',
        }));
        this.addFilterComponent(new LOG.util.ComboBox({
            fieldLabel: LOG.fact.magentoadmin.Idioma.lbEFAC,
            url: 'getEstados?fac=1',
            name: 'estadofac',
            displayField: 'denominacion',
            valueField: 'id'
        }));
        if (!this.filtroUEB) {
            this.addFilterComponent(new LOG.util.ComboBox({
                fieldLabel: LOG.fact.magentoadmin.Idioma.lbUEB,
                url: 'getUEB?ueb=1',
                name: 'idueb',
                displayField: 'denominacion',
                valueField: 'id'
            }));
        }
        _this.getPanelGrid().onRender = _this.getPanelGrid().onRender.createSequence(function () {
            _this.vistaProductos.init();
            _this.getPanelGrid().add(_this.vistaProductos.view({
                region: 'south',
                height: 250,
                width: 450
            }));
        }, _this);
    }
});
LOG.fact.magentoadmin.ViewProductos = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    modoSeleccion: 1,
    autoLoad: false,
    constructor: function (config) {
        var _this = this;
        config.idioma = LOG.util.UIManager.apply(LOG.fact.magentoadmin.Idioma, LOG.util.Idioma);
        LOG.fact.magentoadmin.ViewProductos.superclass.constructor.call(this, config);
        this.dirController = '/logistica/facturacion/magentoadmin/index.php/magento';
        this.urlBusquedaGridPrincipal = 'cargarProductos';
        this.parentView = config.parentView;
        var frm = LOG.util.UIManager.initColumnForm({
            columns: 2
        });
        var inputQty, inputPrice;
        frm.addComponent(inputQty = LOG.util.Prototipos.inputDecimal({
            fieldLabel: LOG.fact.magentoadmin.Idioma.lbCantidad,
            decimalPrecision: 2,
            name: 'cantidad',
            allowBlank: true
        }));
        frm.addComponent(inputPrice = LOG.util.Prototipos.inputDecimal({
            fieldLabel: LOG.fact.magentoadmin.Idioma.lbPrice,
            decimalPrecision: 2,
            name: 'precio',
            allowBlank: true
        }));
        var cbProduct = new LOG.util.ComboBox({
            fieldLabel: LOG.fact.magentoadmin.Idioma.lbDenom,
            url: 'cargarProductos',
            name: 'idproducto',
            allowBlank: false,
            forceSelection: true,
            anchor: '98%',
            autoSelect: true,
            mode: 'remote',
            displayField: 'text',
            valueField: 'idindicador',
            pageSize: 30,
            listeners: {
                select: function (cb, row) {
                    inputQty.setValue(1);
                    inputQty.fireEvent('keyup')
                    inputPrice.setValue(row.json.price);
                    inputPrice.fireEvent('keyup')
                }
            }
        });
        this.winAddProd = new LOG.util.UIManager.initWindow({
            title: LOG.fact.magentoadmin.Idioma.lbProducto,
            width: 350,
            height: 180,
            resizable: false,
            usarAceptar: false,
            aceptarFn: function () {
                var parametros = _this.parentView.modelo.encode();
                parametros.idorden = _this.parentView.getSmPrincipal().getSelected().data.id;
                parametros.productid = cbProduct.getStore().getAt(cbProduct.selectedIndex).json.productid;
                parametros.url = 'guardarProducto';
                _this.parentView.modelo.cargaInicial(parametros, function () {
                    _this.getStorePrincipal().reload({});
                    _this.parentView.modelo.reset();
                });
            },
            items: [this.addForm = LOG.util.UIManager.initForm({
                region: 'center',
                frame: true,
                labelAlign: 'top',
                items: [
                    cbProduct, frm
                ]
            })]
        });

    },
    init: function () {
        LOG.fact.magentoadmin.ViewProductos.superclass.init.call(this);
        var _this = this;
        _this.parentView.getSmPrincipal().fireEvent = _this.parentView.getSmPrincipal().fireEvent.createSequence(function (e) {
            if (e == 'rowselect') {
                _this.getStorePrincipal().initBaseParams.orderId = _this.parentView.getSmPrincipal().getSelected().data.id;
                _this.getStorePrincipal().reload({
                    params: {
                        orderId: _this.parentView.getSmPrincipal().getSelected().data.id
                    }
                })
            }
        });
        this.parentView.modelo.bindForm(this.addForm);
        this.parentView.modelo.addActionButton(this.winAddProd.getButton(1));
        this.parentView.modelo.addActionButton(this.winAddProd.getButton(2));
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            handler: function () {
                _this.winAddProd.show();
            },
            controlFn: function (btn, caller) {
                if (_this.parentView.grantedAction('FPRODS')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
                btn.disable();
                _this.parentView.getSmPrincipal().fireEvent = _this.parentView.getSmPrincipal().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (_this.parentView.getSmPrincipal().getCount() == 1) {
                            btn.enable();
                        } else {
                            btn.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            handler: function () {
                var parametros = {};
                parametros.idorden = _this.parentView.getSmPrincipal().getSelected().data.id;
                parametros.productid = _this.getSmPrincipal().getSelected().data.productid;
                parametros.url = 'eliminarProducto';
                _this.parentView.modelo.cargaInicial(parametros, function () {
                    _this.getStorePrincipal().reload({});
                    _this.parentView.modelo.reset();
                });
            },
            controlFn: function (btn, caller) {
                if (_this.parentView.grantedAction('FPRODS')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
                btn.disable();
                _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (_this.getSmPrincipal().getCount() == 1) {
                            btn.enable();
                        } else {
                            btn.disable();
                        }
                    }
                });
            }
        }));
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbCodigo,
            dataIndex: 'codigo',
            width: 120
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbDenom,
            dataIndex: 'denominacion',
            autoExpand: true
        });

        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbFabric,
            dataIndex: 'fabricante',
            width: 200
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbCantidad,
            dataIndex: 'cantidad',
            width: 90
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbPrice,
            dataIndex: 'precio',
            width: 90
        });
        this.addGridColumn({
            header: LOG.fact.magentoadmin.Idioma.lbGrandTotal,
            dataIndex: 'importe',
            width: 90
        });
        this.addGridColumn({
            dataIndex: 'productid'
        });
    }
});