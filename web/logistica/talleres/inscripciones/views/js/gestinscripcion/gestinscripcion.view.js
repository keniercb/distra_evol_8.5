Ext.ns('log.tall.inscripcion');

log.tall.inscripcion.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Incripcion',
    cantSign: 3,
    signDetails: {
        1: 'Recepcionado',
        2: 'Revisado',
        3: 'Contabilizado'
    },
    dirReport: '/logistica/talleres/inscripcion/',
    ventanaAdicionar: undefined,
    arrMedios: undefined,
    arrClientes: undefined,
    textoMedio: undefined,
    store: undefined,
    arrClientes: undefined,
    arrMedios: undefined,
    arrServicios: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = LOG.util.UIManager.apply(config.idioma, log.tall.inscripcion.Idioma);
        this.dirController = '/logistica/talleres/inscripciones/index.php/inscripcion';
        this.urlBusquedaGridPrincipal = 'cargarInscripciones';
        this.panelBotonesVisible = true;
        this.busquedaAvanzada = true;
        this.busquedaBasica = true;
        this.textBusquedaSimple = this.idioma.labelBuscar;
        this.modoSeleccion = 2;
        this.concepto = this.idioma.ttBuscar;
        log.tall.inscripcion.View.superclass.constructor.call(this, config);
        this.modelo = new log.tall.inscripcion.Model({
            idioma: config.idioma
        });
        this.modelo.urlAccionEliminar = 'eliminarInscripcion';
        this.modelo.urlAccionConfirmar = 'confirmarInscripcion';
        this.modelo.urlAccionAnularEstado = 'anularEstadoInscripcion';
        this.modelo.urlAccionAprobar = 'aprobarInscripcion';

    },

    initDefaultColumns: function () {
        log.tall.inscripcion.View.superclass.initDefaultColumns.call(this);
        var _this = this;

        this.listaColumnas.deleteAll();

        this.addGridColumn({
            header: this.idioma.cgNoins,
            width: 110,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTipo,
            width: 160,
            dataIndex: 'tipo',
            default: true,
            renderer: function (value) {
                if (value == '1') {
                    return _this.idioma.labelPermanente;
                }
                return _this.idioma.labelTemporal;
            }

        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 160,
            dataIndex: 'estado',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
        this.addGridColumn({
            dataIndex: 'atributoidentificador'
        });
        this.addGridColumn({
            dataIndex: 'idmedio'
        });
        this.addGridColumn({
            dataIndex: 'datosmedio'
        });
        this.addGridColumn({
            header: this.idioma.cgClient,
            width: 300,
            dataIndex: 'idcliente',
            default: true,
            renderer: function (val) {
                var resul = val;
                Ext.each(_this.arrClientes, function (r) {
                    if (r['idclientesproveedores'] == val) {
                        resul = r['nombre'];
                    }
                });
                return resul;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgMedio,
            width: 320,
            dataIndex: 'descripcionmarcamodelo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgOrden,
            width: 120,
            dataIndex: 'ordenabierta',
            default: true,
            renderer: function (value) {
                if (value == '1') {
                    return 'si';
                }
                return 'no';
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFecha,
            width: 180,
            dataIndex: 'fechainicio',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechafin'
        });
    },

    initDefaultButtons: function () {
        log.tall.inscripcion.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        this.listaBotones.deleteAll();

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'nuevo',
            key: {
                alt: true,
                key: 'N'
            },
            text: _this.idioma.BtnNuevo,
            tooltip: _this.idioma.ttBtnNuevo1,
            handler: function () {
                _this.ventanaAdicionar = new log.tall.addinscripcion.Vista({
                    idioma: _this.idioma,
                    height: 490,
                    width: 900,
                    title: _this.idioma.tlAdicionar,
                    modelo: _this.modelo,
                    modify: false,
                    clientes: _this.arrClientes,
                    servicios: _this.arrServicios,
                    acciones: _this.acciones
                });
                _this.ventanaAdicionar.bindGridModelo(_this.getGridPrincipal());
                _this.ventanaAdicionar.on({
                    'recargar': function (rd) {
                        _this.getStorePrincipal().load();
                        _this.modelo.generarOrden(rd.data.iddocumento, function () {
                            _this.ventanaAdicionar.listaBotonesVentana.getItem(1).disable();
                        }, function () {
                            _this.ventanaAdicionar.listaBotonesVentana.getItem(1).enable();
                        });
                    }
                });
                _this.ventanaAdicionar.show();
            },
            controlFn: function(b, _caller){
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAdicionar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: _this.idioma.ttBtnDetalles,
            iconCls: 'abrir',
            text: _this.idioma.BtnDetalles,
            key: {
                alt: true,
                key: 'A'
            },
            handler: function () {
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                var modificar = new log.tall.addinscripcion.Vista({
                    idioma: _this.idioma,
                    height: 520,
                    width: 900,
                    title: _this.idioma.tlAbrir,
                    modelo: _this.modelo,
                    modify: true,
                    clientes: _this.arrClientes,
                    servicios: _this.arrServicios,
                    acciones: _this.acciones
                });
                modificar.bindGridModelo(_this.getGridPrincipal());
                modificar.prepareModify(record);
                modificar.controlFnAprobar(record);
                modificar.listaBotones.getItem(1).hidden = true;
                modificar.on({
                    'recargar': function () {
                        _this.getStorePrincipal().load();
                        _this.modelo.generarOrden(this.record.data.iddocumento, function (resp) {
                                modificar.estado.setValue(LOG.lb.documento.Estado[resp.datos.estado]);
                                modificar.numero.enable();
                                modificar.numero.setValue(resp.datos.nrodoc);
                                modificar.ordenAbierta.setValue(true);
                                modificar.listaBotonesVentana.getItem(1).disable();
                            }, function () {
                                modificar.estado.setValue(_this.idioma.labelOrdenNoAbierta);
                                modificar.numero.disable();
                                modificar.ordenAbierta.setValue(false);
                            });
                    }
                });
                modificar.show();
                modificar.body.mask(_this.idioma.msjLoadMask);
            },
            controlFn: function(b, _caller){
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange' && this.getCount() == 1)
                        b.enable();
                    else
                        b.disable();
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.ttBtnEliminarS,
            key: {
                key: Ext.EventObject.DELETE,
                ctrl: false,
                alt: false,
                shift: false
            },
            handler: function () {
                _this.modelo.eliminar();
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('REliminar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'rowselect' && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1) {
                        b.enable();
                    }
                    if (e == 'rowselect' && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado != 1) {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            text: this.idioma.lbBtnAnularEstado,
            tooltip: _this.idioma.ttBtnAnularEstado,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAnularestado')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange' && this.getCount() == 1) {
                        if(_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 3 && _caller.getGridPrincipal().getSelectionModel().getSelected().data.ordenabierta == 0)
                            b.enable();
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado != 3 && _caller.getGridPrincipal().getSelectionModel().getSelected().data.ordenabierta == 0)
                            b.disable();
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 3 && _caller.getGridPrincipal().getSelectionModel().getSelected().data.ordenabierta == 1)
                            b.disable();
                    } else {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
            text: _this.idioma.lbBtnAprobar,
            tooltip: _this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.aprobar();
            },
            controlFn: function (b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAprobar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange' && this.getCount() == 1 && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
            isContextual: true,
            text: _this.idioma.lbBtnImprimir,
            name: this.name + 'Modelo',
            disabled: true,
            handler: _this.onReport.createDelegate(this),
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RB')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange' && this.getCount() == 1)
                        b.enable();
                    else
                        b.disable();
                });
            }
        }));

        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idayudaincripcion'
        }));

    },

    render: function () {
        var _this = this;
        var vista = log.tall.inscripcion.View.superclass.render.call(this);

        this.getGridPrincipal().getSelectionModel().on({
            'rowdeselect': function(e) {
                if(!this.hasSelection()) {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                    _this.listaBotones.getItem(3).disable();
                    _this.listaBotones.getItem(4).disable();
                    _this.listaBotones.getItem(5).disable();
                }
            }
        });

        this.getStorePrincipal().on({
            'load': function () {
                if (this.getCount() < 1) {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                    _this.listaBotones.getItem(3).disable();
                    _this.listaBotones.getItem(4).disable();
                    _this.listaBotones.getItem(5).disable();
                } else {
                    _this.listaBotones.getItem(1).enable();
                }

            }
        });
        return vista;
    },

    view: function () {
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);

        var cl = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        var cliente = new LOG.util.ComboBox({
            name: 'idcliente',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            fieldLabel: this.idioma.cgClient,
            valueField: 'idclientesproveedores',
            mode: 'remote',
            width: 240,
            pageSize: 10
        });
        cl.addComponent(cliente);

        var medio = new LOG.util.ComboBox({
            name: 'idindicador',
            fieldLabel: this.idioma.labelMedio,
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            displayField: 'denominacion',
            valueField: 'idindicador',
            queryParam: 'criterio',
            pageSize: 10,
            mode: 'remote',
            width: 240
        });
        cl.addComponent(medio);

        var fecha = new Ext.form.DateField({
            name: 'fecha',
            width: 240,
            editable: false,
            fieldLabel: this.idioma.cgFecha,
            invalidText: _this.idioma.ttTextoFechaIncorrecto
        });
        cl.addComponent(fecha);

        _this.addFilterComponent(cl);

        LOG.util.UIManager.apply(_this.getPanelBusqueda().listaBotones.getItem(1), {
            handler: function () {
                _this.getPanelBusqueda().onLimpiarHandler();
                _this.getPanelBusqueda().parametros['idindicador'] = undefined;
                _this.getPanelBusqueda().parametros['idcliente'] = undefined;
            }
        });

        return log.tall.inscripcion.View.superclass.view.call(this);
    },

    setClients: function (clientes) {
        this.arrClientes = clientes;
    },

    setMedios: function (medios) {
        this.arrMedios = medios;
    },

    setServicios: function (servicos) {
        this.arrServicios = servicos;
    },

    onReport: function (btn) {
        var _this = this;
        this.report = new LOG.util.Report({
            reports: [
                {
                    name: this.name,
                    isList:true,
                    params: {
                        iddocumento: (_this.getGridPrincipal().getSelectionModel().hasSelection()) ? _this.getGridPrincipal().getSelectionModel().getSelected().get("iddocumento") : null
                    },
                    dirReport:this.dirReport + btn.name
                }
            ]
        }).view();
    }
});
