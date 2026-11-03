Ext.ns('LOG.dist.balanceo');
LOG.dist.balanceo.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Balanceo',
    cantSign: 3,
    signDetails: {
        1: 'Elaborado',
        2: 'Confirmado',
        3: 'Aprobado',
    },
    estado: null,
    dirReport: '/logistica/distribucion/balanceo/',
    constructor: function (config) {
        var _this = this;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.concepto = 'balanceos';
        config.model = new LOG.dist.balanceo.Model({
            idioma: config.idioma
        });
        LOG.dist.balanceo.View.superclass.constructor.call(this, config);


        this.winGestionarDocumento = new LOG.dist.balanceo.GestDocBalanceo({
            idioma: config.idioma,
            modelo: config.model,
            scope: this,
            height: 580,
            title: this.idioma.tlGestDocBalanceo,
            width: 750,
            onClose: function () {
                const lastOptions = _this.getStorePrincipal().lastOptions || {params: {}};
                Ext.apply(lastOptions.params, {});
                _this.getStorePrincipal().reload(lastOptions);
            }
        });
    },
    init: function () {
        LOG.dist.balanceo.View.superclass.init.call(this);
        this.panelSuperior();
    },
    initVentanaGestion: function (d, tipoVentana) {
        var _this = this;
        this.estado = d ? d.json.estado : undefined;
        LOG.dist.balanceo.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();
        _this.habilitarElementosWindow();

        this.winGestionarDocumento.setTitle(_this.idioma.tlVentanaAdicionarBalanceo);

        _this.desabilitarElements();
        this.winGestionarDocumento.setEstadoDoc(this.estado);
        this.winGestionarDocumento.doLayout();
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.dist.balanceo.View.superclass.initDefaultColumns.call(this);

        var columFechaCreacion = this.listaColumnas.getPosByField('dataIndex', 'estado', 'header');

        this.insertGridColumn({
            header: 'Fecha de creación',
            width: 80,
            dataIndex: 'fechacreacion',
            default: true,
        }, columFechaCreacion + 1);


        this.insertGridColumn({
            header: 'Fecha de aprobación',
            width: 80,
            dataIndex: 'fechaaprobacion',
            default: true,
        }, columFechaCreacion + 2);

        this.insertGridColumn({
            header: this.idioma.lbDocumentosOrigen,
            width: 240,
            dataIndex: 'padres',
            default: true,
            autoExpand: true,
            renderer: function (value, metadata, record) {

                padresEntidad = record.json.padres_con_entidad;
                const arr = padresEntidad.split(',');
                const newData = arr.reduce((acum, val, index, arr) => {
                    const [entidad, nrodoc] = val.split(' - ');
                    if (acum[entidad]) {
                        acum[entidad] = acum[entidad] + ', ' + '<b>' + nrodoc + '</b>';
                    } else {
                        acum[entidad] = '<b>' + nrodoc + '</b>';
                    }
                    return acum;
                }, {});
                $newStr = Object
                    .keys(newData)
                    .map(entidad => '<p><b>' + entidad + '</b> - (' + newData[entidad] + ')</p>')
                    .join('<br>');

                metadata.tdAttr = 'data-qtip="' + $newStr + '"';
                metadata.attr = 'ext:qtip="' + $newStr + '"';
                return value;
            },

        }, columFechaCreacion + 3);

        LOG.util.UIManager.apply(this.listaColumnas.getBy('dataIndex', 'cantproductos'), {
            dataIndex: 'cant_productos'
        });

        var columEstado = this.listaColumnas.getPosByField('dataIndex', 'estado', 'header');

        this.insertGridColumn({
            header: _this.idioma.cgEstadoEjecucion,
            width: 130,
            dataIndex: 'estadoejecucion',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.estadoejecucion == 3) {
                    return _this.idioma.lbCumplimentado;
                } else if (record.json.estadoejecucion == 2) {
                    return _this.idioma.lbEnProceso;
                } else {
                    return _this.idioma.lbNoProcesado;
                }
                return value;
            }
        }, columEstado + 1);

        var columCantProductos = this.listaColumnas.getPosByField('dataIndex', 'cant_productos', 'header');

        this.insertGridColumn({
            header: _this.idioma.cgSalidaPor,
            width: 150,
            dataIndex: 'salidapor',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.salidaporfactura == 1) {
                    return value;
                } else if (record.json.tipocliente == 2) {
                    return 'Vale de entrega';
                } else {
                    return 'Transferencia';
                }
            }
        }, columCantProductos + 1);

        this.addGridColumn({dataIndex: 'cant_clientes'});

        this.addGridColumn({dataIndex: 'tipodistribucion'});

        this.addGridColumn({dataIndex: 'idnomconcepto'});

        this.addGridColumn({dataIndex: 'idestructuraop'});

        this.addGridColumn({dataIndex: 'tipodestino'});

        this.addGridColumn({dataIndex: 'arrayClientes'});

        this.addGridColumn({dataIndex: 'salidaporfactura'});

        this.addGridColumn({dataIndex: 'id'});

        this.addGridColumn({dataIndex: 'idcliente'});

        this.addGridColumn({dataIndex: 'controlfirma'});

        this.addGridColumn({dataIndex: 'idnodo'});

        this.addGridColumn({dataIndex: 'iddoc'});
    },
    initDefaultButtons: function () {
        LOG.dist.balanceo.View.superclass.initDefaultButtons.call(this);

        var _this = this;

        // Boton Nuevo
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function () {
                _this.initVentanaGestion();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });

        // Boton abrir
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected());
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAbrir')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });

        this.onGridDobleClick = function () {
            var b = _this.listaBotones.getItem(1);
            if (b.isVisible())
                b.handler.call(b, b);
        };


        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    tooltip: this.idioma.ttBtnImprimir,
                    isList: true,
                    iconCls: 'icondistra-imprimir',
                    name: this.name + 'Listado',
                    handler: _this.onReport.createDelegate(this)
                }),
                new Ext.menu.Item({
                    text: 'Demanda de productos',
                    tooltip: 'Imprimir demanda de productos',
                    isList: false,
                    name: 'balanceoDemanda',
                    iconCls: 'icondistra-imprimir',
                    hidden: true,
                    handler: _this.onReport.createDelegate(this)
                })
            ],
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.menu.get(0).setVisible(this.getCount() == 1);
                            b.menu.get(1).setVisible(this.getCount() == 1);
                        }
                    }, 'imprimir');
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir');
                } else {
                    b.setVisible(false);
                }
            }
        }));


        // Boton Productos
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'auditar',
            text: 'Balanceo',
            tooltip: 'Abrir balanceo',
            isContextual: true,
            disabled: true,
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().getSelected().json.iddocumento) {
                    _this.getionarBalanceo(
                        _this.getGridPrincipal().getSelectionModel().getSelected().json.iddocumento,
                        _this.getGridPrincipal().getSelectionModel().getSelected().json.estado
                    );
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RProductos')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 4);

        // Boton Confirmar
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.confirmar(null, null, (resp) => {
                    if (resp.codigoMsg == 'CANT_ERRORNEAS') {
                        mostrarMensaje(3, _this.idioma.msgDocumentoConfirmadoFailCant);
                    } else {
                        mostrarMensaje(3, _this.idioma.msgDocumentoConfirmadoFail);
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
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
        }), 5);

        // Boton Anular
        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnular,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado') || _this.grantedAction('RAnular')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 2) {
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
        }), 6);

        // Boton Aprobar
        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 3);
                if (_this.modelo.tipodistribucion == 1) {
                    _this.desabilitarElements(1);
                } else if (_this.modelo.tipodistribucion == 2) {
                    _this.desabilitarElements(2);
                } else if (_this.modelo.tipodistribucion == 4) {
                    _this.desabilitarElements(4);
                } else {
                    _this.desabilitarElements(3);
                }
                _this.habilitarElementosWindow();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                                (this.getCount() == 1 && (this.getSelected().data.estado == 2 || this.getSelected().data.estado == 10)) && //first
                                ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }), 7);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'anulardocumento',
            text: this.idioma.lbBtnCancelarParalizar,
            tooltip: this.idioma.ttBtnCancelarParalizar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.cancelar();

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
        }), 8);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'exportar',
            text: this.idioma.lbBtnExcel,
            tooltip: this.idioma.ttBtnExcelD,
            isContextual: true,
            disabled: true,
            handler: function () {
                let iddocumento = _this.getGridPrincipal().getSelectionModel().getSelected().id;
                let wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                window.open(`exportarDemanda?iddocumento=${iddocumento}`, 'ventana', wCfg);
                //_this.model.exportar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
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
        }), 9);

        /*this.insertToolbarButton(LOG.util.Prototipos.botonExportar({
            tooltip: 'Exportar producto(s) demandado(s)',
            isContextual: true,
            btn: 'exportar',
            url: 'exportarDemanda',
            disabled: true,
            objSubmit: {
                id: 1000884300
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                          //&& _caller.getSmPrincipal().getSelected().data.estado == 3
                            if (this.getCount() == 1) {
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
        }), 9);*/

    },
    panelSuperior: function () {
        var _this = this;

        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbObservaciones,
            name: 'observaciones',
            //maxLength: 255,
            maxLengthText: this.idioma.msgMaxLengthText,
            tabular: true,
            width: '98%'

        });
        LOG.dist.balanceo.View.superclass.taObservaciones = this.taObservaciones;

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [this.taObservaciones]
        });
    },
    habilitarElementosWindow: function () {

        var posBtnEliminar = 1;
        var posBtnConfirmar = 2;
        var posBtnAnular = 3;
        var posBtnAprobar = 4;
        var posBtnImprimir = 5;

        if (this.estado == 1) {
            console.info(this.winGestionarDocumento)
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnEliminar].enable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnConfirmar].enable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnAnular].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnAprobar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnImprimir].disable();
        } else if (this.estado == 2) {
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnEliminar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnConfirmar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnAnular].enable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnAprobar].enable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnImprimir].disable();
        } else if (this.estado == 3 || this.estado == 16) {
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnEliminar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnConfirmar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnAnular].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnAprobar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnImprimir].enable();
        } else {
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnEliminar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnConfirmar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnAnular].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnAprobar].disable();
            this.winGestionarDocumento.listaBotonesVentana.arrayData[posBtnImprimir].disable();
        }
    },
    desabilitarElements: function (opcion) {

    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {} : {
            monedacontable: window.monedacontable || window.idcontable,
            iddocumento: record.get("iddocumento") || null
        };
    },
    postSalvar: function (r) {
        var _scope = this.winGestionarDocumento;
        _scope.cargarProductos();

        _scope.record.data.estado = "1";
        _scope.record.data.cant_clientes = r.cantclientes;
        _scope.record.data.cant_productos = r.cantproductos;

        _scope.getTitleDocumento(_scope.record.data.iddocumento);
        _scope.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);

        _scope.modelo.getStore().reload();
    },
    getionarBalanceo: function (iddocumento, estadoDoc) {
        var _this = this;
        var vpGestDatosBalanceo = new LOG.dist.balanceo.VpGestionarDatosBalanceo({
            idioma: _this.idioma,
            iddocumento: iddocumento,
            estadoDoc: estadoDoc,
            formaVisualizacion: 'ventana',
            viewConfig: {
                width: window.innerWidth,
                height: window.innerHeight,
                title: 'Balanceo'
            },
            parentView: _this
        });
        vpGestDatosBalanceo.attachPlugin(new LOG.lb.plugin.Sustituto());
        vpGestDatosBalanceo.init();
        vpGestDatosBalanceo.getVistaPrincipal().on({
            'beforehide': function () {
                const lastOptions = _this.getStorePrincipal().lastOptions || {params: {}};
                Ext.apply(lastOptions.params, {});
                _this.getStorePrincipal().reload(lastOptions);
            }
        });
        vpGestDatosBalanceo.view();

    }
});