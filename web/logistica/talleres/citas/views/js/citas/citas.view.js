Ext.ns('LOG.tall.citas');
LOG.tall.citas.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Citas',
    cantSign: 3,
    signDetails: {
        1: 'Confeccionado ',
        2: 'Autorizado ',
        3: 'Entregado-Cliente '
    },
    dirReport: '/logistica/talleres/citas/',
    tapSuperior: undefined,
    panelSolucion: undefined,
    monedasEntidad: undefined,
    arrAreasInternas: undefined,
    arrPersonas: undefined,
    arrClientes: [],
    arrProveedores: [],
    arrMedios: undefined,
    arrServicios: undefined,
    idEntidad: undefined,
    constructor: function (config) {
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.modoSeleccion = 1;
        this.dirController = '/logistica/talleres/citas/index.php/citastalleres';
        config.urlBusquedaGridPrincipal = 'cargarCitas';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = this.idioma.cgNumeroCitas;
        this.cargarMonedaEntidad();
        // this.monedaContable = (this.monedasEntidad.codigoiso) ? this.monedasEntidad.codigoiso : null;
        LOG.tall.citas.View.superclass.constructor.call(this, config);
        this.modelo = new LOG.tall.citas.Model({
            idioma: config.idioma,
            st: this.getStorePrincipal()
        });
        // this.autoExpandColumn = 'idnomservicio';
        this.winGestionarDocumento = new LOG.tall.citas.VentanaAdicionar({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            //title: (config.idioma.tlCrearCita) ? config.idioma.tlCrearCita : config.idioma.tlVentanaGestion,
            title: config.idioma.tlCrearCita,
            // width: 400,
            acciones: this.acciones
        });
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
    setPersonas: function (arr) {
        this.arrPersonas = arr;
    },
    cargarMonedaEntidad: function () {
        var _this = this;
        Ext.Ajax.request({
            url: '/logistica/talleres/citas/index.php/citastalleres/cargarMonedasEntidad',
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
            dataIndex: 'nrodocorigen',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: this.idioma.cgNumeroCitas,
            width: 80,
            renderer: function (val, x, rec) {
                if (val != '')
                    return val;
                else return rec.json.numeroref;
            }
        });
        this.addGridColumn({
            dataIndex: 'estado',
            header: this.idioma.cgEstado,
            width: 150,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            dataIndex: 'fechadocumento',
            header: 'Fecha de creaci\xf3n',
            width: 190
        });
        this.addGridColumn({
            dataIndex: 'fechacita',
            header: this.idioma.cgFechaCita,
            width: 190
        });
        this.addGridColumn({
            dataIndex: 'fechaextimada',
            header: this.idioma.cgFechaTerminacion,
            width: 190
        });
        this.addGridColumn({
            dataIndex: 'fechaextimada',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'horaentrada',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idservicio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtipoprecio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtipoprecio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idcliente',
            width: 80
        });
        this.addGridColumn({
            header: this.idioma.cgCliente,
            dataIndex: 'cliente',
            width: 200,
            id: 'clienteId'
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
            dataIndex: 'idpadreindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'cantactvidades',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });

        var cod = (monedacontable) ? monedacontable : "";
        this.addGridColumn({
            dataIndex: 'importetotal',
            align: 'right',
            header: this.idioma.cgImporte + " " + cod,
            width: 100,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        var ocultar = (monedaalternativa && monedaalternativa != '') ? false : true;
        var codAlt = (monedaalternativa && monedaalternativa != '') ? monedaalternativa : "";
        this.addGridColumn({
            dataIndex: 'importetotalalternativo',
            align: 'right',
            header: this.idioma.cgImporte + " " + codAlt,
            width: 100,
            hidden: ocultar,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });

        this.addGridColumn({
            dataIndex: 'pedido',
            header: this.idioma.cgPedido,
            align: 'center',
            width: 80,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmHabiltado + '"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmDeshabiltado + '"';
                }
                return '';
            }/*,
            filter: {
                type: 'boolean',
                yesText: 'Con pedidos',
                noText: 'Sin pedidos',
                dataIndex: 'pedido'
            }*/
        });

        this.addGridColumn({
            header: this.idioma.cgNoPedido,
            dataIndex: 'nropedido',
            width: 80
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
            dataIndex: 'fechacontable',
            hidden: true
        });
        this.addGridColumn({
            header: 'Creado por',
            width: 120,
            dataIndex: 'idusuario',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                // _this.usuarios = store.reader.jsonData.usuarios;
                var usuarios = new Array();
                usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }
        });
        this.addGridColumn({
            header: 'Aprobado por',
            width: 120,
            dataIndex: 'cerradopor',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                // _this.usuarios = store.reader.jsonData.usuarios;
                var usuarios = new Array();
                usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }
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
        LOG.tall.citas.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });
        this.insertToolbarButton(LOG.util.Prototipos.botonNuevo({
            text: this.idioma.lbBtnNuevo,
            tooltip: this.idioma.ttBtnAdicionarCita,
            scope: _this,
            handler: function () {
                _this.initVentanaGestion(null, 1, null, null);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
            }
        }), 0);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            tooltip: this.idioma.ttBtnAbrirCita,
            isContextual: true
        });

        this.onGridDobleClick = function () {
            var b = _this.listaBotones.getItem(2);
            b.handler.call(b, b);
        };

        LOG.util.UIManager.apply(this.listaBotones.getItem(3), {
            tooltip: this.idioma.ttBtnEliminarCita,
            handler: function () {
                if (_this.getGridPrincipal().getSelectionModel().getSelected() && _this.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1)
                    _this.modelo.eliminar({integrarfacturacion: _this.grantedAction('RIntegrarFac')});
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.hide();
                }
            }
        });
        this.insertToolbarButton(new LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmarDoc,
            isContextual: true,
            handler: function () {
                _this.modelo.confirmar({}, function(r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "2"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "2";
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                                var jsonActual = _caller.getGridPrincipal().getSelectionModel().getSelected().json;

                                if (dataActual.estado == 1 && dataActual.cantactvidades > 0 &&
                                    (dataActual.cantactvidades == jsonActual.CantActConPrecio) /*&&
                                jsonActual.cant_piezasdisponibles > 0 && (jsonActual.cant_piezasdisponibles == jsonActual.CantPiezasConPrecio)*/) {
                                    b.enable();
                                    /* if (dataActual.documentoorigen == 3) {
                                         b.enable();
                                     }
                                     else if (/!*dataActual.cantactvidades > 0 && *!/dataActual.existeactvidadsindatos == 0) {
                                         b.enable();
                                     }
                                     else b.disable();*/
                                } else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 4);
        this.insertToolbarButton(new LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            isContextual: true,
            handler: function () {
                _this.modelo.anularestado({}, function(r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.record.data.estado = "1";
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
                                    b.enable();
                                } else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });

            }
        }), 5);
        this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: this.idioma.ttBtnDuplicarCita,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.duplicar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RDuplicar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'duplicar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);
        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            handler: function () {
                _this.modelo.aprobar({
                    correocliente: _this.getSmPrincipal().getSelected().json.correo
                }, function(){
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
                });
                // _this.getStorePrincipal().reload();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RCerrarDocumento')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {

                            if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2 /*&&
                                _caller.getGridPrincipal().getSelectionModel().getSelected().json.idtipopreciopiezas != null &&
                                _caller.getGridPrincipal().getSelectionModel().getSelected().json.idtipoprecioactividad != null*/) {
                                b.enable();
                            } else
                                b.disable();
                        }
                    }

                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    /*   if (e == 'selectionchange') {
                           if (this.getCount() == 1) {
                               if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                   var dataSelect = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                                   if (dataSelect.estado == 2 ) {
                                       if (dataSelect.documentoorigen == 3 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "")
                                           b.enable();
                                       else if (dataSelect.solucion != 0 /!*&& dataSelect.cantactvidades > 0*!/ && dataSelect.existeactvidadsindatos == 0 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "") {
                                           b.enable();
                                       }
                                       else b.disable();
                                   }
                                   else
                                       b.disable();
                               }
                           }
                       }*/
                });
            }
        }), 7);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnAnularDoc,
            text: this.idioma.lbBtnAnularDocumento,
            iconCls: 'anulardocumento',
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
                            if (this.getCount() == 1 && this.getSelected().data.estado == '3') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'anularDoc');
                } else {
                    b.setVisible(false);
                }
            }
        }), 8);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnGenerarPedidos,
            text: this.idioma.lbBtnGenerarPedidos,
            iconCls: 'generadorreportes',
            isContextual: true,
            disabled: true,
            handler: function () {
                mostrarMensaje(2, _this.idioma.msgGenerarPedido, function (btn) {
                    if (btn == 'ok') {

                        _this.modelo.generarPedido({
                            idcliente: _this.getSmPrincipal().getSelected().data.idcliente,
                            idcita: _this.getSmPrincipal().getSelected().data.iddocumento,
                            allProducto: true
                        }, function (r) {
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
                            _this.getStorePrincipal().reload();
                        });
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RGPedidoCita')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '3') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'generarDoc');
                } else {
                    b.setVisible(false);
                }
            }
        }), 9);

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tootip: _this.idioma.ttBtnEliminarCita,
            disabled: true,
            handler: function () {
                _this.modelo.eliminar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function () {
                    _this.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            handler: function () {
                _this.modelo.confirmar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "2"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "2";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                });
            },
            disabled: true,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1' &&
                            _this.winGestionarDocumento.record.data.cantactvidades > 0 && (_this.winGestionarDocumento.record.json &&
                                _this.winGestionarDocumento.record.data.cantactvidades == _this.winGestionarDocumento.record.json.CantActConPrecio ||
                                _this.winGestionarDocumento.record.data.cantactvidades == _this.winGestionarDocumento.record.data.CantActConPrecio)) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            disabled: true,
            handler: function () {
                _this.modelo.anularestado({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
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
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado') || _this.grantedAction('RAnular')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            disabled: true,
            handler: function () {
                _this.modelo.aprobar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
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
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            disabled: true,
            handler: function () {
                _this.modelo.aprobar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
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
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        /*LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            disabled: true,
            handler: function () {
                _this.modelo.duplicar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        this.insertToolbarButtonVentana(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnAnularDoc,
            text: this.idioma.lbBtnAnularDocumento,
            iconCls: 'anulardocumento',
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anular({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "6"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "6";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAnular')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '3') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);*/

        /*LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });*/

        /*this.insertToolbarButton(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    iconCls: 'icondistra-imprimir',
                    isList: true,
                    hidden: true,
                    name: this.name + 'Listado',
                    handler: _this.onReport.call(_this)
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    isList: false,
                    name: this.name + 'Modelo',
                    iconCls: 'icondistra-imprimir',
                    hidden: true,
                    handler: _this.onReport.call(_this)
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    iconCls: 'icondistra-imprimir',
                    isList: false,
                    name: 'CitaPeriodoModelo',
                    hidden: true,
                    handler:  _this.onReport.call(_this)
                })
            ],
            controlFn: function (b, _caller) { //
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    b.enable();
                    b.menu.get(1).setVisible(((_this.winGestionarDocumento.record.data.abreviatura === 'transferenciaLog') && (_this.winGestionarDocumento.record.data.estado == '1' && _this.winGestionarDocumento.record.data.tipocliente == '1')) ? true : false);
                    b.menu.get(2).setVisible(((_this.winGestionarDocumento.record.data.abreviatura === 'transferenciaLog') && (_this.winGestionarDocumento.record.data.tipocliente == '3')) ? true : false);
                    b.menu.get(3).setVisible(((_this.winGestionarDocumento.record.data.abreviatura === 'transferenciaLog') && (_this.winGestionarDocumento.record.data.estado != '1') && (_this.winGestionarDocumento.record.data.tipocliente == '1')) ? true : false);
                    b.menu.get(4).setVisible((_this.winGestionarDocumento.record.data.abreviatura === 'valeLog') ? true : false);
                } else {
                    b.setVisible(false);
                }
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
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
        }), 7);*/

        /*this.insertToolbarButton(new Ext.Button({
            tooltip: this.idioma.ttBtnEstadoCuenta,
            text: this.idioma.lbBtnEstadoCuenta,
            iconCls: 'estado',
            isContextual: true,
            handler: function () {

            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RCerrarDocumento')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            var dataSelect = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                            if (dataSelect.estado == 2 && dataSelect.estadoorden != 1) {
                                if (/!*dataSelect.documentoorigen == 3 && dataSelect.dictamentecnico != "" &&*!/ dataSelect.idtecnico != "")
                                    b.enable();
                                else if (dataSelect.solucion != 0 && dataSelect.cantactvidades > 0 && /!*dataSelect.existeactvidadsindatos == 0 && dataSelect.dictamentecnico != "" &&*!/ dataSelect.idtecnico != "") {
                                    b.enable();
                                } else b.disable();
                            } else
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
                                    if (dataSelect.documentoorigen == 3 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "")
                                        b.enable();
                                    else if (dataSelect.solucion != 0 /!*&& dataSelect.cantactvidades > 0*!/ && dataSelect.existeactvidadsindatos == 0 && dataSelect.dictamentecnico != "" && dataSelect.idtecnico != "") {
                                        b.enable();
                                    } else b.disable();
                                } else
                                    b.disable();
                            }
                        }
                    }
                });
            }
        }), 7);
        this.insertToolbarButton(new Ext.Button({
            tooltip: this.idioma.ttBtnCotizacion,
            text: this.idioma.lbBtnCotizacion,
            iconCls: 'contabilidad',
            isContextual: true,
            handler: function () {
                _this.modelo.confirmar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                            if (dataActual.estado == 1 && dataActual.cantactvidades > 0) {
                                b.enable();
                                /!* if (dataActual.documentoorigen == 3) {
                                     b.enable();
                                 }
                                 else if (/!*dataActual.cantactvidades > 0 && *!/dataActual.existeactvidadsindatos == 0) {
                                     b.enable();
                                 }
                                 else b.disable();*!/
                            } else
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

                            }
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 8);
        LOG.util.UIManager.apply(this.listaBotones.getItem(11), {
            id: 'ayudacitas'

        });
        this.insertToolbarButton(new LOG.util.Prototipos.botonCancelar({
            iconCls: 'cancelar',
            tooltip: this.idioma.ttBtnAnularDocumento,
            isContextual: true,
            handler: function () {
                /!*  _this.modelo.anular({
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
                  });*!/
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RCancelar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == "selectionchange") {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                                if ((dataActual.estado == 2) && dataActual.totalcantidadreal == 0) {
                                    b.enable();
                                } else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 9);
        this.insertToolbarButton(new Ext.Button({
            tooltip: 'Anular el estado del documento para su rectificaci\xf3n',
            text: 'Rectificar orden',
            iconCls: 'seleccion',
            isContextual: true,
            handler: function () {
                // _this.modelo.rectificarOrden();

            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RRectificarOrden')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado > 1) {
                                b.enable();
                            } else
                                b.disable();
                        }
                    }
                });
            }
        }), 10);*/

    },
    view: function () {
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
        var cls0 = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.comboServicioBA = new LOG.util.LovCombo({
            fieldLabel: this.idioma.lbServicio,
            url: '/logistica/talleres/citas/index.php/citastalleres/cargarActividadesExistentes',
            name: 'idservicio',
            displayField: 'denominacion',
            valueField: 'idactividad',
            queryParam: 'criterio',
            mode: 'remote',
            emptyText: this.idioma.lbSeleccione,
            autoLoad: false,
            validarEnFormBasico: true
        });
        cls0.addComponent(this.comboServicioBA);
        _this.addFilterComponent(cls0);
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.comboClientesBA = new LOG.util.ComboBox({
            name: 'cliente',
            queryParam: 'criterio',
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
        this.textoMedioBA.store.on({
            beforeload: function (st, obj) {
                obj.params.explotacion = 1;
            }
        });
        cls.addComponent(this.textoMedioBA);
        this.comboEstadoBA = new LOG.util.LovCombo({
            fieldLabel: this.idioma.cgEstado,
            hiddenName: 'idestado',
            valueField: 'idestado',
            displayField: 'estado',
            editable: false,
            mode: 'local',
            minChars: 1,
            emptyText: this.idioma.lbSeleccione,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [3, LOG.lb.documento.Estado[3]],
                    [5, LOG.lb.documento.Estado[5]],
                    [6, LOG.lb.documento.Estado[6]],
                    [9, LOG.lb.documento.Estado[9]]
                ]
            }),
            getXType: function () {
                return 'combobox';
            }
        });
        cls.addComponent(this.comboEstadoBA);
        this.textoIndetificadorBA = new LOG.util.Prototipos.inputTexto({
            name: 'atributoidentificador',
            fieldLabel: 'Identificador',
            width: 410,
            maxLength: 50,
            enableKeyEvents: true
        });
        /*  this.comboCentroCostoBA = new LOG.util.ComboBox({
              autoLoad: true,
              mode: 'local',
              fieldLabel: this.idioma.lbCentroCosto,
              name: 'idcentrocosto',
              url: '/logistica/talleres/citas/index.php/citastalleres/cargarComboCentroCosto',
              valueField: 'idcentrogrupo',
              displayField: 'text',
              queryParam: 'criterio',
              width: '98%',
              validarEnFormBasico: true,
              campo: true,
              listeners: {
                  select: function (cb, st) {
                      _this.getPanelBusqueda().listaBotones.getItem(2).enable();
                      _this.getPanelBusqueda().listaBotones.getItem(0).enable();
                      _this.getPanelBusqueda().parametros['idcentrocosto'] = record.data.documentoorigen;
                  }

              },
              resizable: true
          });*/
        cls.addComponent(this.textoIndetificadorBA);
        /*cls.addComponent(this.comboCentroCostoBA);*/
        _this.addFilterComponent(cls);
        var clsFsRangoFecha = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var clsFsRFInterno = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.FechaCitaBA = new Ext.form.DateField({
            fieldLabel: 'Fecha cita',
            name: 'fechacita',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });
        clsFsRFInterno.addComponent(this.FechaCitaBA);
        this.FechaDocumentoBA = new Ext.form.DateField({
            fieldLabel: 'Fecha documento',
            name: 'fechadocumento',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });
        clsFsRFInterno.addComponent(this.FechaDocumentoBA);
        clsFsRangoFecha.addComponent(
            new Ext.form.FieldSet({
                title: _this.idioma.lbRangoFechaComienzo,
                items: clsFsRFInterno,
            })
        );
        _this.addFilterComponent(clsFsRangoFecha);

        var clsFsRangoFechaPeriodo = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        var clsFsRFInternoPeriodo = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.FechaDesdeBA = new Ext.form.DateField({
            fieldLabel: 'Desde',
            name: 'desdeBA',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeBA',
            endDateField: 'hastaBA',
            editable: false
        });
        clsFsRFInternoPeriodo.addComponent(this.FechaDesdeBA);

        this.FechaHastaBA = new Ext.form.DateField({
            fieldLabel: 'Hasta',
            name: 'hastaBA',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaBA',
            startDateField: 'desdeBA',
            editable: false
        });
        clsFsRFInternoPeriodo.addComponent(this.FechaHastaBA);

        clsFsRangoFechaPeriodo.addComponent(
            new Ext.form.FieldSet({
                title: _this.idioma.lbRangoFechaPeriodo,
                items: clsFsRFInternoPeriodo,
            })
        );
        _this.addFilterComponent(clsFsRangoFechaPeriodo);

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
                _this.FechaDocumentoBA.setMinValue(null);
                _this.FechaCitaBA.setMaxValue(null);
                _this.FechaHastaBA.setMinValue(null);
                _this.FechaDesdeBA.setMaxValue(null);
                _this.getPanelBusqueda().onLimpiarHandler();
            }
        });
        return LOG.tall.citas.View.superclass.view.call(this);
    },
    render: function () {
        var vista = LOG.tall.citas.View.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'clienteId';
        this.getGridPrincipal().getStore().load();
        return vista;
    },
    buildReport: function (btn, record) {
        /*return {
            name: btn.name,
            description: this.winGestionarDocumento.isVisible() ? this.winGestionarDocumento.title : btn.name + " # " + (record.get('nrodoc')) + " del " + record.get('fechacontable') + " en " + LOG.lb.documento.Estado[record.get('estado')],
            isList: btn.isList,
            params: this.getParamsReport(record, btn),
            dirReport: this.dirReport + btn.name,
            uiSearch: (btn.isList && this.busquedaAvanzada) ? this.panelBusquedaAvanzada : {}
        };*/
        return LOG.tall.citas.View.superclass.buildReport.call(this, btn, record);
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        var criterioBusqueda = _this.getGridPrincipal().toolbars[0].items.items[1].getValue();
        return btn.isList ? {
            idestructura: idEntidad || null,
            idcliente: (_this.comboClientesBA.getValue()) ? _this.comboClientesBA.getValue() : null,
            idmedio: (_this.textoMedioBA.getValue()) ? _this.textoMedioBA.getValue() : null,
            idestado: (_this.comboEstadoBA.getValue()) ? _this.comboEstadoBA.getValue() : null,
            idservicio: (_this.comboServicioBA.getValue()) ? "{"+_this.comboServicioBA.getValue()+"}" : null,
            nrocita: criterioBusqueda ? criterioBusqueda : null,
            fechacita: (_this.FechaCitaBA.getValue()) ? _this.FechaCitaBA.getValue() : null,
            fechadocumento: (_this.FechaDocumentoBA.getValue()) ? _this.FechaDocumentoBA.getValue() : null,
            monedacontable: window.monedacontable || null,
            monedaalternativa: window.monedaalternativa || null,
            idcontable: window.idcontable || null,
            idalternativa: window.idalternativa || null,
            fechadesde: (_this.FechaDesdeBA.getValue()) ? _this.FechaDesdeBA.getValue(): null,
            fechahasta: (_this.FechaHastaBA.getValue()) ? _this.FechaHastaBA.getValue(): null
            // fechainiciocierre: (_this.dfFechaInicioCierreBA.getValue()) ? _this.dfFechaInicioCierreBA.getValue() : null,
            // fechafincierre: (_this.dfFechaFinCierreBA.getValue()) ? _this.dfFechaFinCierreBA.getValue() : null
        } : {
            useSign: this.useSign,
            hasCategoria: (window.usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            monedacontable: window.monedacontable || null,
            monedaalternativa: window.monedaalternativa || null,
            idcontable: window.idcontable || null,
            idalternativa: window.idalternativa || null,
            criterio: criterioBusqueda
        };
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
        this.winGestionarDocumento.record = d;
        this.winGestionarDocumento.tipoVentana = tipoVentana || 1;
        this.winGestionarDocumento.formularioGeneral.doLayout();
        this.winGestionarDocumento.show();
        if (this.winGestionarDocumento.tabPDatosMedio.getComponent(1)) {
            this.winGestionarDocumento.tabPDatosMedio.hideTabStripItem(1);
        }
        if (this.winGestionarDocumento.tabPDatosMedio.getComponent(2)) {
            this.winGestionarDocumento.tabPDatosMedio.hideTabStripItem(2);
        }
        if (this.winGestionarDocumento.isInit()) {
            if (d) {

                this.winGestionarDocumento.body.mask();
                _this.winGestionarDocumento.setTitle(_this.idioma.tlAbrirCita);
                _this.winGestionarDocumento.prepareDocModify(d);
                _this.winGestionarDocumento.btnNuevo.hide();
                if (d.data.estado == 1) {
                    _this.winGestionarDocumento.gridActividades.listaBotones.getItem(0).enable();
                    _this.winGestionarDocumento.gridListPiezasDisp.listaBotones.getItem(0).enable();
                }

            } else {
                _this.winGestionarDocumento.habilitarComponentes();
                _this.winGestionarDocumento.btnNuevo.show();
                _this.winGestionarDocumento.btnNuevo.disable();
                _this.winGestionarDocumento.gridActividades.listaBotones.getItem(0).enable();
                _this.winGestionarDocumento.gridListPiezasDisp.listaBotones.getItem(0).enable();

                if (_this.winGestionarDocumento.tabPDatosMedio.body.isMasked())
                    _this.winGestionarDocumento.tabPDatosMedio.body.unmask();
            }
        }

        this.winGestionarDocumento.maximize();
        this.winGestionarDocumento.doLayout();
    },
    auxiliarDocument: function (d) {
        var _this = this;

        if (d) {
            _this.winGestionarDocumento.record = d;
            _this.winGestionarDocumento.prepareDocModify(d);
            this.winGestionarDocumento.on('componentescreados', function () {
                if (_this.winGestionarDocumento.contador == 3) {

                    _this.winGestionarDocumento.setTitle(_this.idioma.tlAbrirCitas);

                    _this.winGestionarDocumento.btnNuevo.hide();
                }
            });
        } else {
            _this.winGestionarDocumento.btnNuevo.show();
        }
    },
    habilitarElementosWindow: function () {
        if (this.winGestionarDocumento.tipoVentana == 3) {
            this.winGestionarDocumento.deshabilitarComponentes();
            this.winGestionarDocumento.doLayout();
        } else {
            this.winGestionarDocumento.doLayout();
            if (this.winGestionarDocumento.record) {
                if (this.winGestionarDocumento.record.data.estado > 1) {
                    this.winGestionarDocumento.deshabilitarComponentes();
                }
                else {
                    this.winGestionarDocumento.gridActividades.listaBotones.getItem(0).enable();
                    this.winGestionarDocumento.gridListPiezasDisp.listaBotones.getItem(0).enable();
                    this.winGestionarDocumento.habilitarComponentes();
                }
            } else {
                this.winGestionarDocumento.habilitarComponentes();
                this.winGestionarDocumento.btnSalvar.show();
            }
        }
    }
});