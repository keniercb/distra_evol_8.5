Ext.ns('log.tall.recepcion');

log.tall.recepcion.View = Ext.extend(LOG.lb.documento.View, {
    name: 'SolicitudServicio',
    cantSign: 3,
    signDetails: {
        1: 'Recepcionado',
        2: 'Revisado',
        3: 'Contabilizado'
    },
    dirReport: '/logistica/talleres/solicitudatercero/',
    ventanaAdicionar: undefined,
    ventanaAdicionarTerceros: undefined,
    filas: undefined,
    formularioGneralAprobar: null,
    formularioGestion: null,
    ventanaDefectacion: false,
    ventanaTipo1: undefined,
    ventanaTipo2: undefined,
    arrMedios: undefined,
    arrClientes: undefined,
    arrProveedor: undefined,
    textoMedio: undefined,
    cliente: undefined,
    proveedores: undefined,
    valorMedio: undefined,
    fecha: undefined,
    constructor: function(config) {
        var _this = this;
        this.idioma = LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        this.dirController = '/logistica/talleres/recepcion/index.php/solicitud';
        this.urlBusquedaGridPrincipal = 'cargarSolicitudes';
        this.panelBotonesVisible = true;
        this.busquedaAvanzada = true;
        this.busquedaBasica = true;
        this.textBusquedaSimple = this.idioma.cgNosol;
        this.modoSeleccion = 2;
        this.concepto = this.idioma.ttBuscar;
        log.tall.recepcion.View.superclass.constructor.call(this, config);
        this.modelo = new log.tall.recepcion.Model({
            idioma: config.idioma
        });
        this.modelo.urlAccionEliminar = 'eliminarSolicitud';
        this.modelo.urlAccionConfirmar = 'confirmarSolicitud';
        this.modelo.urlAccionAnularEstado = 'anularEstadoSolicitud';
        this.modelo.urlAccionAprobar = 'aprobarSolicitud';
    },
    initDefaultColumns: function() {
        log.tall.recepcion.View.superclass.initDefaultColumns.call(this);
        var _this = this;

        this.listaColumnas.deleteAll();

        this.addGridColumn({
            header: this.idioma.cgNosol,
            width: 110,
            dataIndex: 'nrodoc',
            default: true,
            renderer:function(val,x,record){
                if(!val||val==""||val==null){
                    return record.json.numeroref + " ref."
                }
                return val;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 160,
            dataIndex: 'estado',
            default: true,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });

        this.addGridColumn({
            header: this.idioma.cgFecha,
            width: 220,
            dataIndex: 'fecha'
        });
        this.addGridColumn({
            dataIndex: 'fechacontable'
        });
        this.addGridColumn({
            dataIndex: 'estado'
        });
        this.addGridColumn({
            dataIndex: 'numeroref'
        });
        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
        this.addGridColumn({
            dataIndex: 'idtecnico'
        });
        this.addGridColumn({
            dataIndex: 'fallostecnicos'
        });
        this.addGridColumn({
            dataIndex: 'tipo'
        });
        this.addGridColumn({
            dataIndex: 'prioridad'
        });
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idpadre'
        });
        this.addGridColumn({
            dataIndex: 'atributoidentificador'
        });
        this.addGridColumn({
            header: this.idioma.cgMedio,
            width: 220,
            dataIndex: 'descripcionmarcamodelo'
        });
        this.addGridColumn({
            header: this.idioma.labelClient,
            width: 220,
            dataIndex: 'idcliente',
            default: true,
            renderer: function(val) {
                var resul = '-';
                Ext.each(_this.arrClientes, function(r) {
                    if (r['idclientesproveedores'] == val) {
                        resul = r['nombre'];
                    }
                });
                return resul;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgAgencia,
            width: 220,
            dataIndex: 'idagencia',
            default: true,
            renderer: function(val, metaData, record) {
                var resul = val;
                if (record.json.idagencia) {
                    Ext.each(_this.arrProveedor, function(r) {
                        if (r['idclientesproveedores'] == val) {
                            resul = r['nombre'];
                        }
                    });
                } else {
                    if (record.json.entidad) {
                        resul = record.json.entidad;
                    } else {
                        resul = '-';
                    }

                }

                return resul;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgGarantia,
            width: 120,
            dataIndex: 'garantia',
            default: true,
            renderer: function(value) {
                return _this.getGarantia(value);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgObservaciones,
            width: 220,
            dataIndex: 'falloscliente',
            default: true
        });
    },
    initDefaultButtons: function() {
        log.tall.recepcion.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        this.listaBotones.deleteAll();

        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.BtnNuevo,
            iconCls: 'nuevo',
            tooltip: _this.idioma.ttBtnNuevo1,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.menuNuevaSolicitud,
                    idItem: 'btnAddSolicitud',
                    scope: _this,
                    handler: function() {
                        _this.ventanaAdicionar = new log.tall.adcsolicitud.Vista({
                            idioma: _this.idioma,
                            height: 495,
                            width: 900,
                            title: _this.idioma.tlAdicionar,
                            modelo: _this.modelo,
                            acciones:this.acciones,
                            modify: false
                        });
                        _this.ventanaAdicionar.bindGridModelo(_this.getGridPrincipal());
                        _this.ventanaAdicionar.show();
                        _this.ventanaAdicionar.body.mask(_this.idioma.msjLoadMask);
                    },
                    controlFn: function(b, _caller){
                        if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RSolicitudCliente')){
                            b.setVisible(true);
                        }
                        else  b.setVisible(false);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.menuNuevaSolicitudTerceros,
                    idItem: 'btnAddSolicitudTerceros',
                    scope: _this,
                    handler: function() {
                        var ventanaAdicionarTerceros = new log.tall.adcsolicitud.VistaTerceros({
                            idioma: _this.idioma,
                            modelo: _this.modelo,
                            title: _this.idioma.tlAdicionarT,
                            acciones:this.acciones,
                            modify: false
                        });
                        ventanaAdicionarTerceros.bindGridModeloTerceros(_this.getGridPrincipal());
                        LOG.util.UIManager.apply(ventanaAdicionarTerceros.listaBotones.getItem(1), {
                            tooltip: _this.idioma.ttBtnNuevoS
                        });
                        LOG.util.UIManager.apply(ventanaAdicionarTerceros.listaBotones.getItem(2), {
                            tooltip: _this.idioma.ttBtnGuaradarS
                        });
                        ventanaAdicionarTerceros.show();
                        ventanaAdicionarTerceros.body.mask(_this.idioma.msjLoadMask);
                    },
                    controlFn: function(b, _caller){
                        if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RSolicitudTerceros')){
                            b.setVisible(true);
                        }
                        else  b.setVisible(false);
                    }
                })
            ],
            controlFn: function(b, _caller){
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAdicionar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
            }
        }), 0);

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: _this.idioma.ttBtnDetalles,
            text: _this.idioma.BtnDetalles,
            iconCls: 'abrir',
            key: {
                alt: true,
                key: 'A'
            },
            handler: function() {
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                if (record.data.tipo == 1) {
                    this.ventanaTipo1 = new log.tall.adcsolicitud.Vista({
                        idioma: _this.idioma,
                        height: 470,
                        width: 900,
                        title: _this.idioma.tlDetalles,
                        modelo: _this.modelo,
                        acciones:this.acciones,
                        modify: true
                    });
                    this.ventanaTipo1.bindGridModelo(_this.getGridPrincipal());
                    this.ventanaTipo1.prepareSolModify(record);
                    this.ventanaTipo1.controlFnConfirmar(record);
                    this.ventanaTipo1.controlFnAprobar(record);
                    this.ventanaTipo1.listaBotones.getItem(1).hidden = true;
                    if (record.data.estado == 2 || record.data.estado == 3) {
                        this.ventanaTipo1.tab2.enable();
                    }
                    this.ventanaTipo1.show();
                    this.ventanaTipo1.body.mask(_this.idioma.msjLoadMask);
                } else {
                    this.ventanaTipo2 = new log.tall.adcsolicitud.VistaTerceros({
                        idioma: _this.idioma,
                        title: _this.idioma.tlDetallesT,
                        modelo: _this.modelo,
                        arrProveedor: _this.arrProveedor,
                        acciones:this.acciones,
                        modify: true
                    });
                    LOG.util.UIManager.apply(this.ventanaTipo2.listaBotones.getItem(1), {
                        tooltip: _this.idioma.ttBtnNuevoS
                    });
                    LOG.util.UIManager.apply(this.ventanaTipo2.listaBotones.getItem(2), {
                        tooltip: _this.idioma.ttBtnGuaradarS
                    });
                    this.ventanaTipo2.bindGridModeloTerceros(_this.getGridPrincipal());
                    this.ventanaTipo2.prepareSolModify(record);
                    this.ventanaTipo2.controlFnConfirmarTerceros(record);
                    this.ventanaTipo2.controlFnAprobarTerceros(record);
                    this.ventanaTipo2.listaBotones.getItem(1).hidden = true;
                    this.ventanaTipo2.show();
                    this.ventanaTipo2.body.mask(_this.idioma.msjLoadMask);
                }

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
            handler: function() {
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

        this.addToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.confirmar();
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RConfirmar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange' && this.getCount() == 1 && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1) {
                        b.enable();
                    } else {
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
            handler: function() {
                _this.modelo.anularestado();
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAnularestado')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange' && this.getCount() == 1 && _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'dictamentecnico',
            text: _this.idioma.BtnDefectacion,
            tooltip: _this.idioma.ttBtnDefectacion,
            isContextual: true,
            handler: function() {
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                var defectar = new log.tall.adcsolicitud.Vista({
                    idioma: _this.idioma,
                    height: 470,
                    width: 900,
                    title: _this.idioma.tlAdicionar,
                    modelo: _this.modelo,
                    defectar: true
                });
                defectar.bindGridModelo(_this.getGridPrincipal());
                defectar.prepareSolDefectacion(record);
                defectar.controlFnAprobar(record);
                defectar.tabPanel.setActiveTab(1);
                LOG.util.UIManager.apply(defectar.listaBotones.getItem(1), {
                    tooltip: _this.idioma.ttBtnNuevoD
                });
                LOG.util.UIManager.apply(defectar.listaBotones.getItem(2), {
                    tooltip: _this.idioma.ttBtnGuaradarD
                });
                defectar.show();
                defectar.body.mask(_this.idioma.msjLoadMask);
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RDictamen')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange' && this.getCount() == 1) {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                            if (dataActual.estado == 2 && dataActual.tipo == 1) {
                                b.enable();
                            }
                        }
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
            handler: function() {
                _this.modelo.aprobar();
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAprobar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange' && this.getCount() == 1) {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2 &&
                            _caller.getGridPrincipal().getSelectionModel().getSelected().data.fallostecnicos != null) {
                            b.enable();
                        }
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.tipo == 2 &&
                            _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
                            b.enable();
                        }
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado != 2) {
                            b.disable();
                        }
                    } else {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.BtnPrioridad,
            iconCls: 'ordenarcampos',
            tooltip: _this.idioma.ttBtnPrioridad,
            menu: [
                new Ext.menu.Item({
                    text: _this.idioma.BtnArriba,
                    tooltip: _this.idioma.ttBtnArriba,
                    iconCls: 'arriba',
                    isContextual: true,
                    handler: function() {
                        var rowSelected = _this.getGridPrincipal().getSelectionModel().getSelections();
                        var indexSelected = _this.getStorePrincipal().indexOf(rowSelected[0]);
                        if (indexSelected > 0) {
                            var prioridad = new Array();
                            _this.getStorePrincipal().remove(rowSelected[0]);
                            _this.getStorePrincipal().insert(indexSelected - 1, rowSelected);
                            _this.getGridPrincipal().getSelectionModel().selectRow(indexSelected - 1);
                            var allRecord = _this.getStorePrincipal().getRange();
                            Ext.each(allRecord, function(rm, index) {
                                if (rm.data.prioridad != index) {
                                    var param = {};
                                    param['idsolicitud'] = rm.data.iddocumento;
                                    param['prioridad'] = index;
                                    prioridad[index] = param;
                                }
                            });
                            if (prioridad) {
                                _this.modelo.actualizarPrioridad(prioridad, function() {
                                    _this.getGridPrincipal().getSelectionModel().selectRow(indexSelected - 1);
                                });
                            }
                        }
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                            var rowSelected = _this.getGridPrincipal().getSelectionModel().getSelections();
                            var indexSelected = _this.getStorePrincipal().indexOf(rowSelected[0]);
                            if (e == 'rowselect' && indexSelected > 0) {
                                b.enable();
                            }
                            if (e == 'rowdeselect') {
                                b.disable();
                            }
                        });
                    }
                }),
                new Ext.menu.Item({
                    text: _this.idioma.BtnAbajo,
                    tooltip: _this.idioma.ttBtnAbajo,
                    iconCls: 'abajo',
                    //icon: LOG.util.UIManager.getIcon('bottom','/contabilidad/comun/componentes/MultiItemSelector/images/'),
                    isContextual: true,
                    handler: function() {
                        var rowSelected = _this.getGridPrincipal().getSelectionModel().getSelections();
                        var indexSelected = _this.getStorePrincipal().indexOf(rowSelected[0]);
                        if (indexSelected < _this.getStorePrincipal().getCount() - 1) {
                            var prioridad = new Array();
                            _this.getStorePrincipal().remove(rowSelected[0]);
                            _this.getGridPrincipal().getSelectionModel().clearSelections();
                            _this.getStorePrincipal().insert(indexSelected + 1, rowSelected);
                            _this.getGridPrincipal().getSelectionModel().selectRow(indexSelected + 1);
                            var allRecord = _this.getStorePrincipal().getRange();
                            Ext.each(allRecord, function(rm, index) {
                                if (rm.data.prioridad != index) {
                                    var param = {};
                                    param['idsolicitud'] = rm.data.iddocumento;
                                    param['prioridad'] = index;
                                    prioridad[index] = param;
                                }
                            });
                            if (prioridad) {
                                _this.modelo.actualizarPrioridad(prioridad, function() {
                                    _this.getGridPrincipal().getSelectionModel().selectRow(indexSelected + 1);
                                });
                            }
                        }
                    }
                })
            ],
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange' && this.getCount() == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            isContextual: true,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    isList: true,
                    hidden: true,
                    name: this.name + 'Listado',
                    handler: _this.onReport.createDelegate(this)
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    isList: false,
                    name: this.name + 'Modelo',
                    disabled: true,
                    handler: _this.onReport.createDelegate(this)
                })
            ],
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RB')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        var btn = _caller.listaBotones.getItem(8);
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().get('tipo') == 2)
                                btn.menu.get(1).enable();
                            else
                                btn.menu.get(1).disable();
                        }
                    }, 'imprimir1');
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                        if (e == 'load') {
                            b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir1');
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'ayudasolicitud'
        }));
    },
    view: function() {
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);

        var cl = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        _this.cliente = new LOG.util.ComboBox({
            name: 'idcliente',
            fieldLabel: this.idioma.labelClient,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            mode: 'remote',
            width: 240,
            pageSize: 10
        });
        _this.cliente.on('select', function(sb, record) {
            _this.getPanelBusqueda().parametros['idcliente'] = record.data.idclientesproveedores;
            _this.proveedores.disable();
        });
        cl.addComponent(_this.cliente);

        _this.proveedores = new LOG.util.ComboBox({
            width: 240,
            name: 'entidad',
            fieldLabel: this.idioma.cgAgencia,
            triggerClass: 'x-form-cliente-trigger',
            editable: false,
            tabular: true
        });
        _this.proveedores.onTriggerClick = function(e) {
            var ventanaSelectAgencia = new log.tall.adcsolicitud.VentanaSelecionAgencia({
                idioma: _this.idioma,
                title: _this.idioma.tlVentanaSelectAgencia,
                height: 425,
                width: 605
            });
            ventanaSelectAgencia.show();
            ventanaSelectAgencia.tabPanelGeneral.getListTemplate().each(function(temp) {
                temp.getStorePrincipal().load();
            });
            ventanaSelectAgencia.validacionBtn();
            ventanaSelectAgencia.aceptarFn = function() {
                if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                    var recordSeleccionado = ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                    if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'estructuras') {
                        _this.getPanelBusqueda().parametros['idagencia'] = undefined;
                        _this.getPanelBusqueda().parametros['estructura'] = recordSeleccionado.data.id;
                        _this.proveedores.setValue(recordSeleccionado.data.text);
                    }
                    else if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'proveedores') {
                        _this.getPanelBusqueda().parametros['estructura'] = undefined;
                        _this.getPanelBusqueda().parametros['idagencia'] = recordSeleccionado.data.idclientesproveedores;
                        _this.proveedores.setValue(recordSeleccionado.data.nombre);
                    }
                }
                _this.getPanelBusqueda().listaBotones.getItem(2).enable();
                _this.cliente.disable();
                this.close();
            }
        };
        cl.addComponent(_this.proveedores);
        this.textoMedio = new LOG.util.ComboBox({
            name: 'idindicador',
            displayField: 'descripcionmarcamodelo',
            valueField: 'idindicador',
            autoLoad:false,
            fieldLabel: 'Medio',
            url:'/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            queryParam:'criterio',
            mode: 'remote',
            minChars: 1,
            pageSize: 10
        });
        this.textoMedio.store.on({beforeload:function(st, obj){
            obj.params.explotacion = 1;
        }});
        /*_this.textoMedio = new Ext.form.TextField({
            name: 'nomproducto',
            fieldLabel: this.idioma.labelMedio,
            width: 260,
            minLength: 1,
            startValue: '',
            maxLength: 50,
            maxLengthText: _this.idioma.msgErrortext,
            readOnly: true
        });
        var boton = LOG.util.UIManager.createBtn({
            text: '...',
            width: 18,
            handler: function() {
                var ventanaSeletMedio = new log.tall.adcsolicitud.VentanaSelecionMedio({
                    idioma: _this.idioma,
                    title: _this.idioma.tlVentanaSelectMedio,
                    isAFT: existeAFT,
                    idestructura: _this.idEntidad,
                    usarNomIndicador: false,
                    tipo : 2
                });
                ventanaSeletMedio.show();
                ventanaSeletMedio.tabPanelGeneral.getListTemplate().each(function(temp) {
                    temp.getStorePrincipal().load();
                });
                ventanaSeletMedio.validacionBtn();
                ventanaSeletMedio.aceptarFn = function() {
                    if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                        var recordSeleccionado = ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                        _this.textoMedio.setValue(recordSeleccionado.data.descripcionmarcamodelo);
                        if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                            _this.getPanelBusqueda().parametros['producto'] = undefined;
                            _this.getPanelBusqueda().parametros['idindicador'] = recordSeleccionado.data.idindicador;
                            _this.valorMedio = recordSeleccionado.data.idindicador;
                        }
                        else if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.getPanelBusqueda().parametros['producto'] = recordSeleccionado.data.idregnumerico;
                            _this.valorMedio = recordSeleccionado.data.idregnumerico;
                            _this.getPanelBusqueda().parametros['idindicador'] = undefined;
                        }
                    }
                    _this.getPanelBusqueda().listaBotones.getItem(2).enable();
                    this.close();
                }
            }
        });
        var plugin = new LOG.util.UIManager.initColumnForm({
            columnas: 2,
            defaultsAnchor: '100%'
        });
        plugin.getColumn(0).columnWidth = 0.86;
        plugin.getColumn(1).columnWidth = 0.14;
        var panel2 = new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({height: 19}), boton]
        });
        plugin.addComponent(_this.textoMedio);
        plugin.addComponent(panel2);
        cl.addComponent(plugin);*/
        cl.addComponent(this.textoMedio);

        _this.identificador = new LOG.util.Prototipos.inputTexto({
            name: 'atributoidentificador',
            fieldLabel: _this.idioma.cgidentificador,
            width: 240,
            maxLength: 50,
            maxLengthText: this.idioma.msgErrortext,
            regex: LOG.util.Regex.alfanumerico,
            regexText: _this.idioma.msgRegexText,
            enableKeyEvents: true
        });
        cl.addComponent(_this.identificador);

        _this.fecha = new Ext.form.DateField({
            fieldLabel: this.idioma.cgFecha,
            name: 'fechasolicitud',
            width: 240,
            editable: false,
            invalidText: _this.idioma.ttTextoFechaIncorrecto
        });
        cl.addComponent(_this.fecha);

        _this.addFilterComponent(cl);

        LOG.util.UIManager.apply(_this.getPanelBusqueda().listaBotones.getItem(1), {
            handler: function() {
                _this.getPanelBusqueda().parametros['producto'] = undefined;
                _this.getPanelBusqueda().parametros['idindicador'] = undefined;
                _this.getPanelBusqueda().parametros['idcliente'] = undefined;
                _this.getPanelBusqueda().parametros['idagencia'] = undefined;
                _this.getPanelBusqueda().parametros['estructura'] = undefined;
                _this.getPanelBusqueda().parametros['fechasolicitud'] = undefined;
                _this.getPanelBusqueda().parametros['atributoidentificador'] = undefined;
                _this.cliente.enable();
                _this.proveedores.enable();
                _this.listaBotones.getItem(8).disable();
                _this.getPanelBusqueda().onLimpiarHandler();
            }
        });

        return log.tall.recepcion.View.superclass.view.call(this);
    },
    getGarantia: function(v) {
        var _this = this;
        if (v == '1') {
            return 'si';
        }
        return 'no';
    },
    setClients: function(clientes) {
        this.arrClientes = clientes;
    },
    setProveedores: function(proveedores) {
        this.arrProveedor = proveedores;
    },
    render: function() {
        var _this = this;
        var vista = log.tall.recepcion.View.superclass.render.call(this);
        this.getGridPrincipal().on({
            'rowclick': function(e) {
                var rowSelected = _this.getGridPrincipal().getSelectionModel().getSelections();
                var indexSelected = _this.getStorePrincipal().indexOf(rowSelected[0]);
                if (indexSelected < _this.getStorePrincipal().getCount() - 1) {
                    _this.listaBotones.getItem(7).menu.items.items[1].enable();
                } else {
                    _this.listaBotones.getItem(7).menu.items.items[1].disable();
                }
                if (_this.getStorePrincipal().getCount() == 1 || indexSelected == 0) {
                    _this.listaBotones.getItem(7).menu.items.items[0].disable();
                } else {
                    _this.listaBotones.getItem(7).menu.items.items[0].enable();
                }
            }
        });

        this.getStorePrincipal().on({
            'beforeload': function(st, records, options) {
                _this.listaBotones.getItem(7).enable();
                var rowSelected = _this.getGridPrincipal().getSelectionModel().getSelections();
                var indexSelected = _this.getStorePrincipal().indexOf(rowSelected[0]);
                if (indexSelected < _this.getStorePrincipal().getCount() - 1) {
                    _this.listaBotones.getItem(7).menu.items.items[1].enable();
                } else {
                    _this.listaBotones.getItem(7).menu.items.items[1].disable();
                }
                if (_this.getStorePrincipal().getCount() == 1 || indexSelected == 0) {
                    _this.listaBotones.getItem(7).menu.items.items[0].disable();
                } else {
                    _this.listaBotones.getItem(7).menu.items.items[0].enable();
                }
            },

            'load': function() {
                if (this.getCount() < 1) {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                    _this.listaBotones.getItem(3).disable();
                    _this.listaBotones.getItem(4).disable();
                    _this.listaBotones.getItem(5).disable();
                    _this.listaBotones.getItem(7).disable();
                    _this.listaBotones.getItem(8).disable();
                } else {
                    _this.listaBotones.getItem(1).enable();
                }

            }
        });

        this.getGridPrincipal().getSelectionModel().on({
            'rowdeselect': function(e) {
                if(!this.hasSelection()) {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                    _this.listaBotones.getItem(3).disable();
                    _this.listaBotones.getItem(4).disable();
                    _this.listaBotones.getItem(5).disable();
                    _this.listaBotones.getItem(6).disable();
                    _this.listaBotones.getItem(7).disable();
                }
            }
        });
        return vista;
    },
    setEntidad: function(arr) {
        this.idEntidad = arr['identidad'];
    },
    onReport: function(btn) {
        var cliente = this.cliente.getValue();
        var agencia = this.proveedores.getValue();
        var medio = this.valorMedio;
        var fecha = (this.fecha.getValue()) ? this.fecha.getValue().format('d-m-Y') : null;
        var record = this.getGridPrincipal().getSelectionModel().getSelected();
        var iddocumento = (record.data.tipo = 2) ? record.data.iddocumento : null;
        this.control = new LOG.util.Report({
            reports: [
                {
                    name: btn.name,
                    description: this.winGestionarDocumento.isVisible() ? this.winGestionarDocumento.title : btn.name + " # " + record.get('nrodoc') + " ref. " + record.get('numeroref') + " del " + record.get('fechacontable') + " en " + LOG.lb.documento.Estado[record.get('estado')],
                    isList: btn.isList,
                    params: {
                        cliente: cliente,
                        idagencia: agencia,
                        idmedio: medio,
                        fechacreacion: fecha,
                        iddocumento: iddocumento
                    },
                    dirReport : this.dirReport + btn.name,
                    browserAdvanz: {}
                }
            ]
        });
        this.control.view();
    }

});
