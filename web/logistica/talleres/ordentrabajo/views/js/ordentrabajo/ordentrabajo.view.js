Ext.ns('LOG.tall.ordentrabajo');
LOG.tall.ordentrabajo.View = Ext.extend(LOG.lb.documento.View, {
    name: 'OrdenDeTrabajo',
    cantSign: 3,
	//jahsdjhas
    signDetails: {
        1: 'Confeccionado ',
        2: 'Autorizado ',
        3: 'Entregado-Cliente '
    },
    dirReport: '/logistica/talleres/ordentrabajo/',
    tapSuperior: undefined,
    panelSolucion: undefined,
    winReclamaciones: undefined,
    monedasEntidad: undefined,
    winSolucion: undefined,
    arrAreasInternas: undefined,
    arrPersonas: undefined,
    arrClientes: [],//undefined,
    arrProveedores: [],//undefined,
    arrMedios: undefined,
    arrServicios: undefined,
    idEntidad: undefined,
    constructor: function (config) {
        var _this = this;
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.modoSeleccion = 2;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarOrdenes';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = this.idioma.cgNumeroOrden;
        this.cargarMonedaEntidad();
        LOG.tall.ordentrabajo.View.superclass.constructor.call(this, config);
        this.modelo = new LOG.tall.ordentrabajo.Model({
            idioma: config.idioma,
            st: this.getStorePrincipal(),
            parent: _this
        });
        this.autoExpandColumn = 'idnomservicio';
        this.winGestionarDocumento = new LOG.tall.ordentrabajo.VentanaAdicionar({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            title: (config.idioma.tlCrearOrden) ? config.idioma.tlCrearOrden : config.idioma.tlVentanaGestion,
            width: 750,
            acciones: this.acciones
        });
        this.winReclamaciones = new LOG.tall.ordentrabajo.VentanaReclamaciones({
            idioma: this.idioma
        });
        this.winSolucion = new LOG.tall.ordentrabajo.VentanaRegistrarSolucion({idioma: this.idioma});

        this.__comprobante = new LOG.lb.comprobante.View({
            idioma: LOG.util.UIManager.apply(LOG.lb.comprobante.Idioma, LOG.util.Idioma),
            acciones: config.acciones,
            subsistema: 113
        });
        this.__comprobante.initDefaultButtons();
        this.__comprobante.btnGenerar.controlFn = function (b, _caller) {

            if (_this.grantedAction('RPOSTEAR')) {
                b.show();
            } else {
                b.hide();
            }
            b.enable();
            _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                if (e == 'selectionchange') {
                    b.disable();
                    if (this.hasSelection() && this.getCount() == 1 && this.getSelected().data.idcomprobante == '' && this.getSelected().data.estado == 9) {
                        b.enable();
                    }
                }
            });
        };
    },
    cargarMonedaEntidad: function () {
        var _this = this;
        Ext.Ajax.request({
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarMonedasEntidad',
            method: 'POST',
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        this.winGestionarDocumento.setMonedasEntidad(resp.datos);
                    }

                }
            }.createDelegate(this)
        });
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fallascliente',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrodocorigen',
            align: 'right',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'dictamentecnico',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'cantactvidades',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtecnico',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: this.idioma.cgNumeroOrden,
            width: 80,
            align: 'right',
            renderer: function (val, x, rec) {
                if (val != '')
                    return val;
                else return rec.json.numeroref;
            }
        });
        this.addGridColumn({
            dataIndex: 'tipo',
            header: this.idioma.cgTipo,
            width: 80,
            renderer: function (val) {
                if (val == 1) {
                    return 'Mantenimiento';
                }
                return 'Reparaci\xf3n';
            }
        });
        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            header: 'Identificador',
            width: 80,
        });
        this.addGridColumn({
            header: 'Ubicación',
            width: 100,
            default: true,
            dataIndex: 'ubicaciontall'
        });
        /*this.addGridColumn({
            header: 'Documento origen',
            width: 110,
            dataIndex: 'documentoorigen',
            renderer: function (value) {
                if (value == 1) {
                    return _this.idioma.lbTipoDocSolicitud;
                }
                else if (value == 2) {
                    return _this.idioma.lbTipoDocInscripcion;
                }
                else if (value == 3) {
                    return _this.idioma.lbTipoDocSolicitudTerceros;
                }
                else if (value == 4) {
                    return _this.idioma.lbTipoDocPedido
                }
                else if (value == 5 || value == 6) {
                    return "Enviado a reparar";
                }
                else return '';
            }
        });*/
        this.addGridColumn({
            dataIndex: 'estado',
            header: this.idioma.cgEstado,
            width: 90,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            dataIndex: 'estadoorden',
            header: this.idioma.cgDisponibilidadMaterial,
            width: 120,
            renderer: function (val) {
                if (val == 1) {
                    return _this.idioma.lbDisponible;
                }
                else
                    return '';
            }
        });
        this.addGridColumn({
            dataIndex: 'fechainicio',
            header: this.idioma.cgFechaComienzo,
            width: 110
        });
        this.addGridColumn({
            dataIndex: 'fechafin',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fechacierre',
            header: this.idioma.cgFechaCierre,
            width: 110
        });
        this.addGridColumn({
            dataIndex: 'idservicio',

        });
        this.addGridColumn({
            dataIndex: 'servicio',
            header: this.idioma.cgServicio,
            width: 190,
            id: 'idnomservicio'
        });
        this.addGridColumn({
            dataIndex: 'idcliente',
            width: 190
        });
        this.addGridColumn({
            header: this.idioma.cgCliente,
            dataIndex: 'cliente',
            width: 190,
            //hidden:true
        });
        this.addGridColumn({
            dataIndex: 'idpadreindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            header: this.idioma.cgIdentificador,
            width: 100,
        });
        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelo',
            header: this.idioma.cgMedio,
            width: 190,
        });
        this.addGridColumn({
            dataIndex: 'garantia',
            header: this.idioma.cgGarantia,
            width: 120,
            renderer: function (g) {
                if (g == '1') {
                    return 'si';
                }
                else
                    return 'no'
            }
        });
        this.addGridColumn({
            dataIndex: 'cantactvidades',
            header: 'Actividades'
        });
        this.addGridColumn({
            dataIndex: 'productos',
            header: 'Materiales'
        });
        this.addGridColumn({
            dataIndex: 'tipodestino',
            header: this.idioma.cgTipoDestino
        });
        this.addGridColumn({
            dataIndex: 'docdestino',
            align: 'right',
            header: this.idioma.cgDocDestino
        });
        this.addGridColumn({
            dataIndex: 'importetotal',
            header: this.idioma.cgImporteTotal,
            width: 120,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
            this.addGridColumn({
            header: 'Nro. Comprobante',
            dataIndex: 'nrocomprobante',
            width: 100,
            align: 'right',
            default: true
        });
        var ocultar = (monedaAlternativa && monedaAlternativa != '') ? false : true;
        if(monedaAlternativa){
            this.addGridColumn({
                dataIndex: 'importealternativo',
                header: this.idioma.cgImporteTotal + ' ' + monedaAlternativa,
                width: 120,
                hidden: ocultar,
                align: 'right',
                renderer: function (v) {
                    return Ext.util.Format.number(v, '0,000.00');
                }
            });
        }
        this.addGridColumn({
            dataIndex: 'existeactvidadsindatos',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'cantidadreclamaciones',
            header: this.idioma.cgCantReclamaciones,
            width: 150,
            align: 'right',
            renderer: function (value) {
                if (!value)
                    return 0;
                else
                    return value;
            }
        });
        this.addGridColumn({
            dataIndex: 'solucion',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idcentrocosto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'denomcentrocosto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idresponsablemedio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idplanificacionmantenimiento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fechacontable',
            hidden: true
        });
        this.addGridColumn({
            header: 'Creado por',
            width: 100,
            dataIndex: 'idusuario',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                _this.usuarios = store.reader.jsonData.usuarios;
                /*var usuarios = new Array();
                usuarios = store.reader.jsonData.usuarios;*/
                return _this.getUsuarioById(value);
            }
        });

        this.addGridColumn({
            header: 'Cerrado por',
            width: 100,
            dataIndex: 'cerradopor',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                _this.usuarios = store.reader.jsonData.usuarios;
                /*var usuarios = new Array();
                usuarios = store.reader.jsonData.usuarios;*/
                return _this.getUsuarioById(value);
            }
        });
        this.addGridColumn({
            dataIndex: 'totalcantidadreal'
        });
        this.addGridColumn({
            dataIndex: 'documentoorigen'
        });
        this.addGridColumn({
            dataIndex: 'nombre'
        });
    },
    getUsuarioById: function (id) {
        for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].idusuario == id) {
                return this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    initDefaultButtons: function () {
        LOG.tall.ordentrabajo.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        this.listaBotones.delete(0);
        this.insertToolbarButton(LOG.util.Prototipos.botonNuevo({
            text: this.idioma.lbBtnNuevo,
            tooltip: this.idioma.ttBtnAdicionarOrden,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnOrdenTrabajo,
                    idItem: 'btnAddOrden',
                    scope: _this,
                    handler: function () {
                        _this.initVentanaGestion(null, 1, null, null);
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnOrdenTrabajoDocOrigen,
                    idItem: 'btnAddOrdenDocOrigen',
                    scope: _this,
                    handler: function () {
                        var ventanaGenerica = new LOG.tall.ordentrabajo.ventanaDocumentoOrigen({
                            idioma: _this.idioma,
                            title: _this.idioma.tlVentanaOrigen,
                            height: 473,
                            width: 825,
                            resizable: false,
                            arrClientes: _this.arrClientes,
                            arrMedios: _this.arrMedios,
                            arrProveedores: _this.arrProveedores,
                            acciones: _this.acciones
                        });
                        ventanaGenerica.show();
                        ventanaGenerica.validacionBtn();
                        ventanaGenerica.aceptarFn = function () {

                            if (ventanaGenerica.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                                var recordSelecionado = ventanaGenerica.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                                if (ventanaGenerica.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'solicitud') {
                                    _this.initVentanaGestion(recordSelecionado, 1, 0, 0);
                                }
                                else if (ventanaGenerica.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'incripcion') {
                                    _this.initVentanaGestion(recordSelecionado, 1, 0, 1);
                                }
                                else if (ventanaGenerica.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'solicitudterceros') {
                                    _this.initVentanaGestion(recordSelecionado, 1, 0, 2);
                                }
                                else if (ventanaGenerica.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'planificacion') {
                                    recordSelecionado.data = recordSelecionado.json;
                                    recordSelecionado.data.idproducto = recordSelecionado.data.idregnumerico;
                                    _this.initVentanaGestion(recordSelecionado, 1, 0, 4);
                                }
                                else if (ventanaGenerica.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'pedido') {
                                    recordSelecionado.data = recordSelecionado.json;
                                    recordSelecionado.data.iddocumentoorigen = recordSelecionado.data.iddocumento;
                                    recordSelecionado.data.iddocumento = null;
                                    recordSelecionado.data.nrodocorigen = recordSelecionado.data.nrodoc;
                                    recordSelecionado.data.nrodoc = null;
                                    _this.initVentanaGestion(recordSelecionado, 1, 0, 5);
                                }
                                else if (ventanaGenerica.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'cita') {
                                    recordSelecionado.data = recordSelecionado.json;
                                    recordSelecionado.data.iddocumentoorigen = recordSelecionado.data.iddocumento;
                                    recordSelecionado.data.iddocumento = null;
                                    recordSelecionado.data.nrodocorigen = recordSelecionado.data.nrodoc;
                                    recordSelecionado.data.nrodoc = null;
                                    recordSelecionado.data.documentoorigen = 7;
                                    recordSelecionado.data.nombre = recordSelecionado.data.cliente;
                                    recordSelecionado.data.idcliente = recordSelecionado.data.idcliente;
                                    _this.modelo.generarOrdenTrabajoCita(recordSelecionado);
                                }
                            }
                        }
                    },
                    controlFn: function (b, _caller) {
                        if ( _caller.grantedAction('RAdicionarDocOrigrn') ) {
                            b.enable();
                        }
                        else  b.disable();
                    }
                }),
            ],
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
            }
        }), 0);
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            tooltip: this.idioma.ttBtnAbrirOrden,
            isContextual: true
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            tooltip: this.idioma.ttBtnEliminarOrden,
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().getSelected() && _this.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1)
                    _this.modelo.eliminar({integrarfacturacion: _this.grantedAction('RIntegrarFac')});
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1)
                            b.enable();
                        else
                            b.disable();
                    }

                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount() >= 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1)
                                b.enable();
                            else
                                b.disable();
                        }
                        else {
                            b.disable();
                        }

                    }
                });
            }
        });
        this.insertToolbarButton(new LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            handler: function () {
                _this.modelo.confirmar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                            if (dataActual.estado == 1 && dataActual.cantactvidades > 0 ) {
                                b.enable();
                               /* if (dataActual.documentoorigen == 3) {
                                    b.enable();
                                }
                                else if (/!*dataActual.cantactvidades > 0 && *!/dataActual.existeactvidadsindatos == 0) {
                                    b.enable();
                                }
                                else b.disable();*/
                            }
                            else
                                b.disable();
                        }
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                                if (dataActual.estado == 1) {
                                    if (dataActual.documentoorigen == 3) {
                                        b.enable();
                                    }
                                    else if (/*dataActual.cantactvidades > 0 && */dataActual.existeactvidadsindatos == 0) {
                                        b.enable();
                                    }
                                    else b.disable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 3);
        this.insertToolbarButton(new LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            isContextual: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                if (_caller.getGridPrincipal().getSelectionModel().getSelected().json.estado == 2 && _caller.getGridPrincipal().getSelectionModel().getSelected().json.hijos == 0) {
                                    b.enable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });

            }
        }), 4);
        this.insertToolbarButton(new Ext.Button({
            tooltip: this.idioma.ttBtnRegistrarOrden,
            text: this.idioma.lbBtnRegistrarOrden,
            iconCls: 'revisar',
            isContextual: true,
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    _this.initVentanaSolucion(_this.getGridPrincipal().getSelectionModel().getSelected());
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RRegistrarSolucion')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2 || _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 9
                                && _caller.getGridPrincipal().getSelectionModel().getSelected().data.documentoorigen != 3) {
                                b.enable();
                            }
                            else
                                b.disable();
                        }
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2 || _caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 9
                                    && _caller.getGridPrincipal().getSelectionModel().getSelected().data.documentoorigen != 3) {
                                    b.enable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 5);
        this.insertToolbarButton(this.__comprobante.btnGenerar, 6);
        this.insertToolbarButton(new Ext.Button({
            tooltip: this.idioma.ttBtnCerrarOrden,
            text: this.idioma.lbBtnCerrarOrden,
            iconCls: 'cerrarordendetrabajo',
            isContextual: true,
            handler: function () {
                _this.modelo.cerrarOrdenTrabajo();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RCerrarDocumento')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            var dataSelect = _caller.getGridPrincipal().getSelectionModel().getSelected().data;

                            if (dataSelect.estado == 2 && dataSelect.estadoorden != 1) {
                                /*if (dataSelect.documentoorigen == 3 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "")
                                    b.enable();
                                else if (dataSelect.solucion != 0 && dataSelect.cantactvidades > 0 && dataSelect.existeactvidadsindatos == 0 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "") {
                                    b.enable();
                                }*/
                                if(dataSelect.cantactvidades > 0){
                                    b.enable();
                                }
                                else b.disable();
                            }
                            else
                                b.disable();
                        }
                    }

                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {

                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                var dataSelect = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                                if (dataSelect.estado == 2 && dataSelect.estadoorden != 1) {
                                    /*if (dataSelect.documentoorigen == 3 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "")
                                    b   .enable();
                                    else if (dataSelect.solucion != 0 && dataSelect.cantactvidades > 0 && dataSelect.existeactvidadsindatos == 0 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "") {
                                        b.enable();
                                    }*/
                                    if(dataSelect.cantactvidades > 0){
                                        b.enable();
                                    }
                                    else b.disable();
                                }
                                else
                                    b.disable();
                            }
                        }
                    }
                });
            }
        }), 6);

        this.insertToolbarButton(new Ext.Button({
            tooltip: 'Facturar',
            text: 'Facturar orden',
            iconCls: 'facturar',
            isContextual: true,
            handler: function () {
                var dataSelect = _this.getGridPrincipal().getSelectionModel().getSelected().data;
                _this.modelo.generarFactura(dataSelect.iddocumento);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RFacturar')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            var dataSelect = _caller.getGridPrincipal().getSelectionModel().getSelected().data;

                            if (dataSelect.estado == 9 || (dataSelect.estado == 2 && dataSelect.estadoorden != 1)) {
                                /*if (dataSelect.documentoorigen == 3 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "")
                                    b.enable();
                                else if (dataSelect.solucion != 0 && dataSelect.cantactvidades > 0 && dataSelect.existeactvidadsindatos == 0 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "") {
                                    b.enable();
                                }*/
                                if(dataSelect.cantactvidades > 0){
                                    b.enable();
                                }
                                else b.disable();
                            }
                            else
                                b.disable();
                        }
                    }

                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {

                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                var dataSelect = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                                if (dataSelect.estado == 9 || (dataSelect.estado == 2 && dataSelect.estadoorden != 1)) {
                                    /*if (dataSelect.documentoorigen == 3 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "")
                                    b   .enable();
                                    else if (dataSelect.solucion != 0 && dataSelect.cantactvidades > 0 && dataSelect.existeactvidadsindatos == 0 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "") {
                                        b.enable();
                                    }*/
                                    if(dataSelect.cantactvidades > 0){
                                        b.enable();
                                    }
                                    else b.disable();
                                }
                                else
                                    b.disable();
                            }
                        }
                    }
                });
            }
        }), 6);

        this.insertToolbarButton(new Ext.Button({
            tooltip: this.idioma.ttBtnRecuperarPiezas,
            text: 'Recuperar piezas',
            iconCls: 'recuperaciones',
            isContextual: true,
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    var ventana = new LOG.tall.ordentrabajo.WinRecuperacionPiezas({
                        recordSeleccionado: _this.getSmPrincipal().getSelected(),
                        idordentrabajo: _this.getSmPrincipal().getSelected().data.iddocumento,
                        idproducto: _this.getSmPrincipal().getSelected().data.idproducto
                    });
                    ventana.show();
                    //ventana.listaBotones.getItem()
                }

            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RRecuperarPiezas')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 9) {
                                b.enable();
                            }
                            else
                                b.disable();
                        }
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 9) {
                                    b.enable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 8);

        this.insertToolbarButton(new Ext.Button({
            tooltip: this.idioma.ttBtnReclamaciones,
            text: this.idioma.lbBtnReclamarOrden,
            iconCls: 'generadorreportes',
            isContextual: true,
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                    _this.initVentanaReclamaciones(_this.getGridPrincipal().getSelectionModel().getSelected());
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RReclamacion')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            b.enable();
                        }
                    }
                    if (e == 'rowdeselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            b.enable();
                        }
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 9);
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'estado',
            text: 'Estado de ejecución',
            tooltip: 'Consultar estado de ejecución del documento',
            isContextual: true,
            disabled: true,
            handler: function () {
                var winEstadoEjecucion = new LOG.tall.ordentrabajo.winEstadoEjecucion({
                    _parent: _this,
                    record: _this.getSmPrincipal().getSelected(),
                    idioma: _this.idioma,
                    modelo: _this.modelo,
                    datos: (_this.getGridPrincipal().getSelectionModel().getSelected()) ? _this.getGridPrincipal().getSelectionModel().getSelected().data : null
                });
                winEstadoEjecucion.init();
                _this.vistaEstadoEjecucion = winEstadoEjecucion.view();
                _this.vistaEstadoEjecucion.show();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RB')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(this.getCount() == 1));
                        }
                    }, 'estadoEjecucion1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);

        //this.listaBotones.getBy('itemId','btnImprimir').menu.get(0).hidden = true;
        LOG.util.UIManager.apply(this.listaBotones.getItem(11), {
            id: 'ayudaordentrabajo'

        });
        this.insertToolbarButton(new LOG.util.Prototipos.botonCancelar({
            iconCls: 'anulardocumento',
            tooltip: this.idioma.ttBtnAnularDocumento,
            isContextual: true,
            handler: function() {
                _this.confirmarAnularDocumento(_this.getGridPrincipal().getSelectionModel().getSelections());
                /*_this.modelo.anular({
                    idordentrabajo: _this.getSmPrincipal().getSelected().data.iddocumento
                }, function(r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = '6';
                    _this.winGestionarDocumento.listaBotonesVentana.each(function(b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.idordentrabajo);
                });*/
            },
            controlFn: function(b, _caller) {
                if(/* _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| */_caller.grantedAction('RCancelar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == "selectionchange") {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                                //console.info(dataActual)
                                if (( dataActual.estado == 2 || dataActual.estado == 9) /*&& dataActual.totalcantidadreal == 0*/) {
                                    b.enable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 3);

       /* LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), LOG.util.UIManager.createBtn({
            iconCls: 'anulardocumento',
            text: this.idioma.lbBtnAnularDocumento,
            tooltip: this.idioma.ttBtnAnularDocumento,
            isContextual: true,
            key: null,
            handler: function() {
                _this.modelo.anular({
                    idordentrabajo: _this.getSmPrincipal().getSelected().data.iddocumento
                }, function(r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = '6';
                    _this.winGestionarDocumento.listaBotonesVentana.each(function(b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.idordentrabajo);
                });
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RCancelar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == "selectionchange") {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                                //console.info(dataActual)
                                if ((dataActual.estado == 1 || dataActual.estado == 2) && dataActual.totalcantidadreal == 0) {
                                    b.enable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));*/
        this.insertToolbarButton(new Ext.Button({
            tooltip: 'Anular el estado del documento para su rectificaci\xf3n',
            text: 'Rectificar orden',
            iconCls: 'seleccion',
            isContextual: true,
            handler: function () {
               _this.modelo.rectificarOrden();

            },
            controlFn: function (b, _caller) {
                if ( _caller.grantedAction('RRectificarOrden')) {
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado > 1) {
                                b.enable();
                            }
                            else
                                b.disable();
                        }
                    }
                });
            }
        }), 9);
        this.insertToolbarButton(new Ext.Button(
            {
            text: 'Ubicación',
            tooltip: 'Editar ubicación de odene de trabajo',
            iconCls: 'abrir',
            editable: 'false',
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().hasSelection()){
                    var locatewindow = new LOG.tall.ordentrabajo.ubicacionwin({
                        title: 'Ubicacion',
                        width : 600,
                        height : 400,
                        datos : _this.getGridPrincipal().getSelectionModel().getSelected(),
                        resizable: false
                    });
                    locatewindow.init();
                    locatewindow.view();
                }
            }
        }),11);
            

    },
    confirmarAnularDocumento: function(seleccion) {
        var _this = this;

        var rgTipoReporte = new Ext.form.RadioGroup({
            region: 'north',
            fieldLabel: 'Cancelaci\xf3n',
            itemCls: 'x-check-group-alt',
            anchor: '98%',
            columns: 2,
            items: [
                {boxLabel: 'Parcial', name: 'tipodev', inputValue: 1},
                {boxLabel: 'Total', name: 'tipodev', inputValue: 2, checked: true}
            ]
        });

        var anulObservaciones = new Ext.form.TextArea({
            fieldLabel: 'Motivo de cancelaci\xf3n',
            anchor: '99%',
            allowBlank: false,
            maxLength: '255',
            minLength: '2',
        });

        _this.anularDocumento = new Ext.Window({
            title: 'Cancelar documento',
            width: 440,
            height: 250,
            modal: true,
            resizable: false,
            constrain: true,
            items: new Ext.Panel({
                frame: true,
                autoHeight: true,
                autoWidth: true,
                bodyBorder: false,
                layout: 'form',
                labelAlign: 'top',
                items: [{
                    html: "<p><font size = '2'>" + _this.idioma.msgAnularDocumento + "</font></p><br>"
                },rgTipoReporte, anulObservaciones]
            }),
            buttons: [{
                text: 'Cancelar',
                //tooltip: _this.idioma.lbTxtBtnCancelar,
                iconCls: 'cancelar',
                handler: function () {
                    _this.anularDocumento.close();
                }
            }, {
                text: 'Aceptar',
                //tooltip: _this.idioma.lbTxtBtnAAceptar,
                iconCls: 'aceptar',
                handler: function () {
                    if(anulObservaciones.isValid()){
                        var idsdoc = Array();
                        Ext.each(seleccion, function(uno) {
                            idsdoc.push(uno.json.iddocumento);
                        });
                        Ext.MessageBox.wait(_this.idioma.msgAnulandoObjeto, _this.idioma.msgEsperePorFavor || '...');
                        var objSubmit = {};
                        objSubmit.id = Ext.encode(idsdoc);
                        objSubmit.motivo = anulObservaciones.getValue();
                        objSubmit.tipo = rgTipoReporte.getValue().inputValue;
                        Ext.Ajax.request({
                            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/anularDocumento',
                            method: 'POST',
                            params: objSubmit,
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.respuesta.cantidad) {
                                    mostrarMensaje(1, 'El documento no puede ser cancelado, tiene productos por devolver.');
                                } else if (resp.respuesta.ref) {
                                    mostrarMensaje(1, 'El documento no puede ser cancelado, tiene facturas asociadas que deben ser eliminadas/canceladas.<br>Nro. Ref: <b>'+resp.respuesta.ref);
                                } else if (resp.respuesta.nodevtotal) {
                                    mostrarMensaje(1, 'El documento no puede ser cancelado totalmente, tiene facturas asociadas que deben ser eliminadas/canceladas.<br>Ver estado de ejecuci\xf3n');
                                } else if (resp.respuesta.nodevparcial) {
                                    mostrarMensaje(1, 'El documento no puede ser cancelado parcialmente, tiene facturas asociadas que deben ser eliminadas/canceladas.<br>Ver estado de ejecuci\xf3n');
                                } else if (resp.success) {
                                    if (s) {
                                        mostrarMensaje(1, _this.idioma.msgDocumentoAnulado);
                                        _this.getGridPrincipal().getStore().reload();
                                        _this.anularDocumento.close()
                                    }
                                    if (typeof _fn == 'function') {
                                        _fn.createDelegate(this, [resp]).call();
                                    }
                                }
                            }.createDelegate(this)
                        });
                        /*Ext.Ajax.request({
                            url: '/logistica/utiles/documento/index.php/documentologistica/getIdentificador',
                            params: {
                                iddocumento: Ext.encode(idsdocumentos),
                            },
                            success: function(response) {
                                var data = Ext.decode(response.responseText);
                                if (data.datos) {
                                    _this.anularFactura(anulObservaciones.getValue(),data.datos,desdeAdd);
                                    _this.anularDocumento.close();
                                }
                            }
                        });*/
                    }

                }
            }]
        });
        _this.anularDocumento.show();
        _this.anularDocumento.center();
    },
    view: function () {
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.comboClientesBA = new LOG.util.ComboBox({
            name: 'cliente',
            queryParam:'criterio',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            fieldLabel: this.idioma.lbCliente,
            mode: 'remote',
            minChars: 1,
            pageSize: 20
        });
        this.comboClientesBA.on('select', function (sb, record) {
            _this.getPanelBusqueda().parametros['cliente'] = record.data.idclientesproveedores;
        });
        cls.addComponent(this.comboClientesBA);
        //Datos del Medio
        this.textoMedioBA = new LOG.util.ComboBox({
            name: 'idindicador',
            autoLoad: false,
            displayField: 'descripcionmarcamodelo',
            valueField: 'idindicador',
            fieldLabel: 'Medio',
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            queryParam: 'criterio',
            mode: 'remote',
            minChars: 1,
            pageSize: 20
        });
        this.textoMedioBA.store.on({beforeload:function(st, obj){
            obj.params.explotacion = 1;
        }});

        cls.addComponent(this.textoMedioBA);

        this.comboServicioBA = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbServicio,
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarActividadesExistentes',
            name: 'idservicio',
            queryParam:'criterio',
            displayField: 'denominacion',
            valueField: 'idactividad',
            minChars:1,
            mode: 'remote',
            pageSize : 20,
            resizable:true,
            baseParams: {
                nivel: 2
            }
        });
        this.comboubicaciones = new LOG.util.LovCombo({
            fieldLabel : 'Ubicaciones',
            name: 'ubicaciones',
            autoLoad: false,
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarnomubicaciontall',
            displayField: 'denominacion',
            allowblank: false,
            valueField: 'idubicaciontall',
            mode: 'remote',
            resizable: true,
        });
        
        this.comboubicaciones.store.on('beforeload', function(store) {
            store.baseParams.todas =  1;
        });
        /*this.comboServicioBA.store.on('beforeload', function(store) {
            store.baseParams.nivel =  2;
        });*/
        this.comboServicioBA.on('select', function (sb, record) {
            _this.getPanelBusqueda().parametros['idservicio'] = record.data.idactividad;
            });
        cls.addComponent(this.comboServicioBA);
        cls.addComponent(this.comboubicaciones);

        this.comboEstadoBA = new LOG.util.LovCombo({
            fieldLabel: this.idioma.cgEstado,
            hiddenName: 'estado',
            valueField: 'idestado',
            displayField: 'estado',
            editable: false,
            mode: 'local',
            minChars: 1,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    ['1', LOG.lb.documento.Estado[1]],
                    ['2', LOG.lb.documento.Estado[2]],
                    ['5', LOG.lb.documento.Estado[5]],
                    ['6', LOG.lb.documento.Estado[6]],
                    ['9', LOG.lb.documento.Estado[9]]
                ]
            })
        });
        cls.addComponent(this.comboEstadoBA);
        this.textoIndetificadorBA = new LOG.util.Prototipos.inputTexto({
            name: 'atributoidentificador',
            fieldLabel: 'Identificador',
            width: 410,
            maxLength: 50,
            enableKeyEvents: true
        });
        this.comboCentroCostoBA = new LOG.util.ComboBox({
            autoLoad:true,
            mode:'local',
            fieldLabel: this.idioma.lbCentroCosto,
            name: 'idcentrocosto',
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarComboCentroCosto',
            valueField: 'idcentrogrupo',
            displayField: 'text',
            queryParam:'criterio',
            width: '98%',
            validarEnFormBasico:true,
            campo: true,
            listeners: {
                select:function(cb,st){
                    _this.getPanelBusqueda().listaBotones.getItem(2).enable();
                    _this.getPanelBusqueda().listaBotones.getItem(0).enable();
                    _this.getPanelBusqueda().parametros['idcentrocosto'] = record.data.documentoorigen;
                }

            },
            resizable:true
        });
        /*this.comboDocumentOrigenBA = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbDocumentoOrigen,
            hiddenName: 'documentoorigen',
            valueField: 'documentoorigen',
            displayField: 'denominacion',
            editable: false,
            mode: 'local',
            minChars: 1,
            store: new Ext.data.SimpleStore({
                fields: ['documentoorigen', 'denominacion'],
                data: [
                    [100, _this.idioma.lbStCbDONoTiene],
                    [1, _this.idioma.lbStCbDOSolicitud],
                    //[2, _this.idioma.lbStCbDOInscripcion],
                    [3, _this.idioma.lbStCbDOSolicitudTerceros],
                    //[4, _this.idioma.lbTipoDocPedido],
                    [5, _this.idioma.lbTipoDocEviadoReparar]
                ]
            })
        });
        this.comboDocumentOrigenBA.on('select', function (sb, record) {
            _this.getPanelBusqueda().listaBotones.getItem(2).enable();
            _this.getPanelBusqueda().listaBotones.getItem(0).enable();
            _this.getPanelBusqueda().parametros['documentoorigen'] = record.data.documentoorigen;
        });*/
        cls.addComponent(this.textoIndetificadorBA);
        //cls.addComponent(this.comboDocumentOrigenBA);
        cls.addComponent(this.comboCentroCostoBA);
        cls.addComponent(this.comboGarantiaBA = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cgGarantia,
            name: 'garantia',
            valueField: 'garantia',
            displayField: 'nombre',
            editable: false,
            mode: 'local',
            minChars: 1,
            store: new Ext.data.SimpleStore({
                fields: ['garantia', 'nombre'],
                data: [
                    [1, _this.idioma.lbNo],
                    [2, _this.idioma.lbSi]
                ]
            }),
            getXType:function(){
               return 'combobox';
            }
        }));

        if (typeof vg_operariosvarios !== 'undefined' && vg_operariosvarios == 1) {
            this.editorArea = new LOG.util.ComboBox({
                url: 'cargarAreasTaller',
                valueField: 'idarea',
                fieldLabel: 'Area',
                name: 'idarea',
                validarEnFormBasico: false,
                autoLoad: false,
                displayField: 'denominacion',
                mode: 'remote',
                queryParam: 'criterio',
                minChars: 1,
                pageSize: 15,
                resizable: true,
                baseParams: {
                    areasuti: 1
                }
            });

            cls.addComponent(this.editorArea);
        }

        _this.addFilterComponent(cls);
        var clsFsRangoFecha = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var clsFsRFInterno = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.dfFechaInicioBA = new Ext.form.DateField({
            name: 'fechainiciocomienzo',
            fieldLabel: this.idioma.cgFechaInicio,
            width: 200,
            format:'d/m/Y',
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
            listeners: {
                'select': function (campo) {
                    _this.dfFechaTerminacionBA.setMinValue(campo.getValue());
                }
            },
            getValue : function() {
               if(Ext.form.DateField.superclass.getValue.call(this)){
                 return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)).format('d/m/Y');
               } else {
                 return "";
               }
            }
        });
        clsFsRFInterno.addComponent(this.dfFechaInicioBA);
        this.dfFechaTerminacionBA = new Ext.form.DateField({
            name: 'fechafincomienzo',
            fieldLabel: this.idioma.cgFechaFin,
            width: 200,
            format:'d/m/Y',
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
            listeners: {
                'select': function (campo) {
                    _this.dfFechaInicioBA.setMaxValue(campo.getValue());
                }
            },
            getValue : function() {
               if(Ext.form.DateField.superclass.getValue.call(this)){
                 return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)).format('d/m/Y');
               } else {
                 return "";
               }
            }
        });
        clsFsRFInterno.addComponent(this.dfFechaTerminacionBA);
        clsFsRangoFecha.addComponent(
            new Ext.form.FieldSet({
                title: _this.idioma.lbRangoFechaComienzo,
                items: clsFsRFInterno,
            })
        );
        _this.addFilterComponent(clsFsRangoFecha);

        var clsFsRangoFechaCierre = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var clsFsRFCierre = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.dfFechaInicioCierreBA = new Ext.form.DateField({
            name: 'fechainiciocierre',
            fieldLabel: this.idioma.cgFechaInicio,
            width: 200,
            format:'d/m/Y',
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
            listeners: {
                'select': function (campo) {
                    _this.dfFechaFinCierreBA.setMinValue(campo.getValue());
                }
            },
            getValue : function() {
               if(Ext.form.DateField.superclass.getValue.call(this)){
                 return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)).format('d/m/Y');
               } else {
                 return "";
               }
            }
        });
        clsFsRFCierre.addComponent(this.dfFechaInicioCierreBA);
        this.dfFechaFinCierreBA = new Ext.form.DateField({
            name: 'fechafincierre',
            fieldLabel: this.idioma.cgFechaFin,
            width: 200,
            format:'d/m/Y',
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
            listeners: {
                'select': function (campo) {
                    _this.dfFechaInicioCierreBA.setMaxValue(campo.getValue());
                }
            },
            getValue : function() {
               if(Ext.form.DateField.superclass.getValue.call(this)){
                 return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)).format('d/m/Y');
               } else {
                 return "";
               }
            }
        });
        clsFsRFCierre.addComponent(this.dfFechaFinCierreBA);
        clsFsRangoFechaCierre.addComponent(
            new Ext.form.FieldSet({
                title: _this.idioma.lbRangoFechaCierre,
                items: clsFsRFCierre,
            })
        );

        _this.addFilterComponent(clsFsRangoFechaCierre);
        LOG.util.UIManager.apply(_this.getPanelBusqueda().listaBotones.getItem(0), {
            handler: function () {
                _this.getPanelBusqueda().onOcultarHandler();
            }
        });
        LOG.util.UIManager.apply(_this.getPanelBusqueda().listaBotones.getItem(1), {
            handler: function () {
                _this.getPanelBusqueda().parametros['idproducto'] = undefined;
                _this.getPanelBusqueda().parametros['idindicador'] = undefined;
                _this.getPanelBusqueda().parametros['cliente'] = undefined;
                _this.getPanelBusqueda().parametros['idservicio'] = undefined;
                _this.getPanelBusqueda().parametros['atributoidentificador'] = undefined;
                _this.getPanelBusqueda().parametros['documentoorigen'] = undefined;
                _this.dfFechaTerminacionBA.setMinValue(null);
                _this.dfFechaInicioBA.setMaxValue(null);
                _this.getPanelBusqueda().onLimpiarHandler();
            }
        });
        _this.__comprobante.modelo.urlController = '/logistica/talleres/comun_tall/index.php/comprobantetalleres/';
        return LOG.tall.ordentrabajo.View.superclass.view.call(this);
    },
    render: function () {
        var vista = LOG.tall.ordentrabajo.View.superclass.render.call(this);
        this.__comprobante.modelo.bindGridPanel(this.getGridPrincipal());
        this.gpPrincipal.autoExpandColumn = 'idnomservicio';
        this.getGridPrincipal().getStore().load();
        return vista;
    },
    buildReport: function (btn, record) {
        return {
            name: btn.name,
            description: this.winGestionarDocumento.isVisible() ? this.winGestionarDocumento.title : btn.name + " # " + ( record.get('nrodoc')) + " del " + record.get('fechacontable') + " en " + LOG.lb.documento.Estado[record.get('estado')],
            isList: btn.isList,
            params: this.getParamsReport(record, btn),
            dirReport: '/distra' + this.dirReport + btn.name,
            uiSearch: (btn.isList && this.busquedaAvanzada) ? this.panelBusquedaAvanzada : {}
        };
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        var criterioBusqueda = _this.getGridPrincipal().toolbars[0].items.items[1].getValue();
        return btn.isList ? {
          idestructura : idEntidad || null,
        	idcliente : (_this.comboClientesBA.getValue()) ? _this.comboClientesBA.getValue() : null,
        	idservicio: (_this.comboServicioBA.getValue()) ? _this.comboServicioBA.getValue() : null,
        	identificador: (_this.textoIndetificadorBA.getValue()) ? _this.textoIndetificadorBA.getValue() : null,
          idmedio: (_this.textoMedioBA.getValue()) ? _this.textoMedioBA.getValue() : null,
        	idestado: (_this.comboEstadoBA.getValue()) ? '{'+_this.comboEstadoBA.getValue()+'}' : null,
        	idcentrocosto: (_this.comboCentroCostoBA.getValue()) ? _this.comboCentroCostoBA.getValue() : null,
        	criterio:criterioBusqueda,
          garantia: (_this.comboGarantiaBA.getValue() ) ? (( _this.comboGarantiaBA.getValue() == 1) ? 0 : 1)  : null,
        	fechainiciocomienzo: (_this.dfFechaInicioBA.getValue()) ? _this.dfFechaInicioBA.getValue() : null,
        	fechafincomienzo: (_this.dfFechaTerminacionBA.getValue()) ? _this.dfFechaTerminacionBA.getValue() : null,
        	fechainiciocierre: (_this.dfFechaInicioCierreBA.getValue()) ? _this.dfFechaInicioCierreBA.getValue() : null,
        	fechafincierre: (_this.dfFechaFinCierreBA.getValue()) ? _this.dfFechaFinCierreBA.getValue() : null
        } : {
            useSign: this.useSign,
            hasCategoria: (window.usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            criterio: criterioBusqueda
        };
    },
    setPersonas: function (arr) {
        this.arrPersonas = arr;
    },
    setServicios: function (arr) {
        // this.arrServicios = arr;
    },
    setMedios: function (arr) {
        this.arrMedios = arr;
    },
    setAreasInternas: function (arr) {
        this.arrAreasInternas = arr;
    },
    setEntidad: function (arr) {
        this.idEntidad = arr['identidad'];
        this.winGestionarDocumento.setEntidad(arr);
    },
    setClientes: function (clientes) {
        this.arrClientes = clientes;
    },
    setProveedores: function (proveedores) {
        this.arrProveedores = proveedores;
    },
    initVentanaGestion: function (d, tipoVentana, tab, origRecord) {
        var _this = this;
        this.winGestionarDocumento.setOrigen(origRecord);
        if (!this.winGestionarDocumento.isInit()) {
            this.winGestionarDocumento.setArrAreasInternas(this.arrAreasInternas);
            this.winGestionarDocumento.setPersonas(this.arrPersonas);
            this.winGestionarDocumento.init();
            this.auxiliarDocument(d);

            if (this.winGestionarDocumento.formularioGeneral != null) {
                this.winGestionarDocumento.addPanelSuperior(this.winGestionarDocumento.formularioGeneral);
            }
            if (this.formularioSur != null) {
                this.winGestionarDocumento.addPanel(this.formularioSur);
            }
            if (this.formularioEste != null) {
                this.winGestionarDocumento.addPanel(this.formularioEste);
            }
            if (this.formularioOeste != null) {
                this.winGestionarDocumento.addPanel(this.formularioOeste);
            }
        }
        this.winGestionarDocumento.tipoVentana = tipoVentana || 1;
        tab = (tab) ? tab : 0;
        this.winGestionarDocumento.formularioGeneral.setActiveTab(1);
        this.winGestionarDocumento.formularioGeneral.doLayout();
        this.winGestionarDocumento.show();
        this.winGestionarDocumento.formularioGeneral.setActiveTab(tab);
        this.winGestionarDocumento.tabPanelInferior.setActiveTab(0);
        if (this.winGestionarDocumento.tabPanelInferior.getComponent(2)) {
            this.winGestionarDocumento.tabPanelInferior.hideTabStripItem(2);
        }
        if (this.winGestionarDocumento.tabPDatosMedio.getComponent(1)) {
            this.winGestionarDocumento.tabPDatosMedio.hideTabStripItem(1);
        }
        if (this.winGestionarDocumento.tabPDatosMedio.getComponent(2)) {
            this.winGestionarDocumento.tabPDatosMedio.hideTabStripItem(2);
            }
        if (this.winGestionarDocumento.isInit()) {
            if (d) {
               /* _this.comboServicio*/
                this.winGestionarDocumento.body.mask();
                _this.winGestionarDocumento.setTitle(_this.idioma.tlAbrirOrden);
                this.winGestionarDocumento.prepareDocModify(d);
                if (d.data.cantidadreclamaciones && d.data.cantidadreclamaciones > 0) {
                    this.winGestionarDocumento.tabPanelInferior.unhideTabStripItem(2);
                }
                _this.winGestionarDocumento.btnNuevo.hide();
            }
            else {
                _this.winGestionarDocumento.habilitarComponentes();
                _this.winGestionarDocumento.btnNuevo.show();
                _this.winGestionarDocumento.btnNuevo.disable();
                if (_this.winGestionarDocumento.body.isMasked())
                    _this.winGestionarDocumento.body.unmark();
                if (_this.winGestionarDocumento.tabPDatosMedio.body.isMasked())
                    _this.winGestionarDocumento.tabPDatosMedio.body.unmask();
            }

        }

        this.winGestionarDocumento.maximize();
        this.winGestionarDocumento.doLayout();
    },
    initVentanaReclamaciones: function (d) {
        if (!this.winReclamaciones.isInit()) {
            this.winReclamaciones.init();
            this.winReclamaciones.bindGridPanel(this.getGridPrincipal());
        }
        this.winReclamaciones.tipoVentana = 1;
        this.winReclamaciones.show();
        this.winReclamaciones.setFechaInicioOrden(d.data.fechainicio);
        if (d) {
            this.winReclamaciones.prepareForm(d);
        }

        this.winReclamaciones.doLayout();
    },
    initVentanaSolucion: function (d) {

        if (!this.winSolucion.isInit()) {
            this.winSolucion.init();
            this.winSolucion.bindGridPanel(this.getGridPrincipal());
        }
        this.winSolucion.tipoVentana = 1;
        this.winSolucion.show();

        if (d) {
            this.winSolucion.prepareForm(d);
            if (d.data.estado == 9) {
                this.winSolucion.deshabilitar();
            }
            else this.winSolucion.habilitar();
        }

        this.winSolucion.doLayout();
    },
    auxiliarDocument: function (d) {

        var _this = this;
        if (d) {
            this.winGestionarDocumento.on('componentescreados', function () {
                if (_this.winGestionarDocumento.contador == 3) {
                    _this.winGestionarDocumento.setTitle(_this.idioma.tlAbrirOrden);
                    _this.winGestionarDocumento.prepareDocModify(d);
                    if (d.data.cantidadreclamaciones && d.data.cantidadreclamaciones > 0) {
                        _this.winGestionarDocumento.tabPanelInferior.unhideTabStripItem(2);
                    }
                    _this.winGestionarDocumento.btnNuevo.hide();
                }
            });
        }
        else {
            _this.winGestionarDocumento.habilitarComponentes();
            _this.winGestionarDocumento.btnNuevo.show();
        }
    }
});
