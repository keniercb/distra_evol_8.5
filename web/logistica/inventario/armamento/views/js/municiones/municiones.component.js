Ext.namespace('LOG.inv.municiones');

/**
 * Plantilla para la gestion de partidas.
 * @type LOG.util.UITemplate
 */
LOG.inv.municiones.View = Ext.extend(LOG.util.UITemplate, { 
    /**
     * Direccion del controlador
     */
    dirController: '/logistica/inventario/armamento/index.php/municiones',
    /**
     * URL de la que se carga el grid principal de la IU
     */
    urlBusquedaGridPrincipal: 'cargarMuniciones',
    /**
     * Forma en la que se vizualiza el componente, 
     * default - Ext.Viewport
     * panel - Ext.Panel
     * ventana - Ext.Window
     */
    formaVisualizacion: 'ventana',
    /**
     * Determin si se carga automaticamente el store del componente.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Determina si se selecciona automaticamente el primer record del grid.
     * @type
     */
    autoSelect: false,
    /**
     * Determina si se puede editar el grid.
     * @type Boolean
     */
    gridEditable: true,
    /**
     * Determina si se muestra el panel de datos superior.
     * @type Boolean
     */
    panelSuperior: true,
    /**
     * Determina si se incluyen los plugins de las columnas.
     * @type Boolean
     */
    plugins: true,
    /**
     * Indica la cantidad de store que han cargado.
     * @type Integer
     */
    cargado: 0,
    /**
     * Determina si es una salida de partidas o no.
     * @type Boolean
     */
    salida: false,
    /**
     * Determina si es un ajuste de partidas o no.
     * @type Boolean
     */
    ajuste: false,
    /**
     * Determina si es una devolucion de partidas o no.
     * @type Boolean
     */
    devolucion: false,
    /**
     * Determina si afecta la disponibilidad del producto.
     * @type Boolean
     */
    afecta: false,
    /**
     * Valor por defecto.
     * @type String
     */
    sinDatos: 'S/Datos',
    /**
     * Formato de la cantidad de partidas.
     * @type String
     */
    formato: '<b>{0}:</b> &nbsp;{1}',
    /**
     * Determina si se incluye el boton para aprobar las partidas con cantidades por desglose
     * @type Boolean
     */
    desglose: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.idioma = LOG.inv.municiones.Idioma;
        this.concepto = this.idioma.lbConcepto;
        this.textBusquedaSimple = this.idioma.lbBusquedaSimple;
        LOG.inv.municiones.View.superclass.constructor.call(this, config);
        this.modelo = new LOG.inv.municiones.Model({
            idioma: this.idioma
        });
        var condiferencia = (this.producto && parseInt(this.producto.diferencia || 0) > 0);
        if ((this.salida && !this.ajuste) || (this.ajuste && (condiferencia || this.producto.signo == '-'))) {
            if (this.producto.ordenado || this.producto.cantentregada) {
                this.cantmaxima = parseInt(this.producto.ordenado || this.producto.cantentregada) - parseInt(this.producto.resto || 0);
            } else {
                this.cantmaxima = parseInt(condiferencia ? this.producto.diferencia : this.producto.existencia) - parseInt(this.producto.resto || 0);
            }
            this.cantidadOriginal = parseInt(this.producto.cantidad);
            this.formato = '<b>{0}:</b> &nbsp;{2} - {1}';
        }
    },
    /**
     * Inicializa el componente.
     * @returns {undefined}
     */
    init: function() {
        this.initStores();
        LOG.inv.municiones.View.superclass.init.call(this);
        if (this.plugins) {
            this.initGridPlugins();
        }
        if (this.panelSuperior) {
            this.panelDatos();
        }
        this.initAvanzada();
        Ext.apply(this.getVistaPrincipal(), {
            title: this.idioma.tlVentana,
            maximized: true,
            resizable: false
        });
        Ext.data.Store.prototype.getBy = function(campo, valor) {
            var record = null;
            this.each(function(item) {
                if (item.data[campo] == valor) {
                    record = item;
                }
            });
            return record;
        };
    },
    /**
     * Inicializa los botones del componente.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        var _this = this;
        if (this.documento && !this.salida) {
            this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
                tooltip: this.idioma.ttBtnAdicionar,
                disabled: _this.documento.estado != '1',
                handler: function() {
                    _this.getStorePrincipal().add(_this.newRecord());
                },
                controlFn: function(b) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.show();
                    } else {
                        b.hide();
                    }
                }
            }));
            this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
                tooltip: this.idioma.ttBtnEliminar,
                disabled: true,
                handler: function() {
                    var eliminar = false;
                    var noguardadas = false;
                    var arrayId = new Array();
                    var arrayP = new Array();

                    Ext.each(_this.getSmPrincipal().getSelections(), function (item) {
                        if (item.data.estado == 2) {
                            arrayId.push({
                                idmovproductomunic: item.data.idmovproductomunic
                            });
                        }

                        if (item.data.estado == 1) {
                            arrayP.push({
                                idmovproductomunic: item.data.idmovproductomunic
                            });
                        }

                        if (item.data.idmovproductomunic == null || item.data.idmovproductomunic == ""){
                            noguardadas = true;
                        }
                    });

                    if (arrayId.length == 0 && arrayP.length > 0) {
                        eliminar = true;
                    }

                    if (arrayId.length == 1 && arrayP.length == 0) {
                        mostrarMensaje(3, _this.idioma.msgErrorEliminandoUna);
                    }
                    if (arrayId.length > 1) {
                        mostrarMensaje(3, _this.idioma.msgErrorEliminando);
                    }

                    if (eliminar) {
                        _this.modelo.eliminar();
                    }
                    if (noguardadas) {
                        _this.getSmPrincipal().each(function(item) {
                            _this.modelo.eliminarPartida(item.data);
                            this.remove(item);
                        }, _this.getStorePrincipal());
                    }
                },
                controlFn: function(b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0 && _this.documento.estado == '1') {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'btnEliminar');
                    } else {
                        b.hide();
                    }
                }
            }));
            this.addToolbarButton(LOG.util.Prototipos.botonDuplicar({
                tooltip: this.idioma.ttBtnDuplicar,
                disabled: true,
                handler: function() {
                    _this.getStorePrincipal().add(_this.newRecord(true));
                },
                controlFn: function(b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().data.idmovproductomunic && _this.documento.estado == '1') {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'btnDuplicar');
                    } else {
                        b.hide();
                    }
                }
            }));

            this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
                tooltip: this.idioma.ttBtnAprobar,
                disabled: true,
                hidden: !_this.desglose,
                handler: function() {
                    _this.modelo.aprobar(_this.documento.iddocumento);
                },
                controlFn: function(b, _caller) {
                    if (_this.desglose) {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e, o) {
                            if (e == 'load') {
                                Ext.each(o.data.items, function (rec) {
                                   if (rec.data.estado == '1') {
                                       b.enable();
                                   } else {
                                       b.disable();
                                   }
                                });
                            }
                        }, 'btnAprobar');
                    } else {
                        b.hide();
                    }
                }
            }));
        }
        // Los parametros para exportar se preparan en el render de este componente.
        this.addToolbarButton(LOG.util.Prototipos.botonExportar({
            tooltip: this.idioma.ttBtnExcel,
            //disabled: true,
            url: '/logistica/inventario/armamento/index.php/municiones/cargarMunicionesExportar',
            btn: 'exportar',
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                        if (e == 'load') {
                           // b.setDisabled(this.getCount() == 0);
                            if (this.getCount() > 0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }

                    }, 'btnExportar');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: this.salida ? 'idpartidasalida' : 'idpartida',
            referencia: '/logistica/inventario/armamento/index.php/municiones'
        }));

        if (this.formaVisualizacion == 'ventana' && this.documento) {
            Ext.apply(this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({}, true));
            this.getVistaPrincipal().listaBotones.getItem(1).hide();
            Ext.apply(this.getVistaPrincipal().listaBotones.getItem(2), LOG.util.Prototipos.botonGuardar({
                tooltip: this.idioma.ttBtnGuardar,
                disabled: true,
                hidden : (this.documento && this.documento.estado != '1'),
                handler: function() {
                     if (_this.desglose && _this.getSuma('cantidad') != parseInt(_this.producto.existencia)) {
                         mostrarMensaje(3, _this.idioma.msgCantidadMayor);
                     } else {
                         _this.modelo.salvar({salida: _this.salida, afecta: _this.afecta, desglose: _this.desglose});
                     }
                }
            }));
            this.modelo.addActionButton(this.getVistaPrincipal().listaBotones.getItem(2));
        }
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idtemp'});
        this.addGridColumn({dataIndex: 'idmovproductomunic'});
        this.addGridColumn({dataIndex: 'idproductomunic'});
        this.addGridColumn({dataIndex: 'idproductomuniccomprometido'});
        this.addGridColumn({dataIndex: 'idubicacioncomprometida'});
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idmovimiento'});
        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({dataIndex: 'idestructuraubicacion'});
        this.addGridColumn({dataIndex: '_cantidad'});
        this.addGridColumn({dataIndex: 'entregado'});
        this.addGridColumn({dataIndex: 'resto'});
        this.addGridColumn({dataIndex: 'estado'});
        this.addGridColumn({
            dataIndex: 'estadodoc'
        });
        // Montaje general.
        this.addGridColumn({
            header: this.idioma.cgPartida,
            dataIndex: 'idpartida',
            editor: this.editable() ? this.initCombo('partida', this.stPartida) : null,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAnno,
            dataIndex: 'idanno',
            editor: this.editable() ? this.initCombo('anno', this.stAnno) : null,
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idanno = _this.sinDatos;
                }
                return _r.data.idanno;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFabrica,
            dataIndex: 'idfab',
            editor: this.editable() ? this.initCombo('fab', this.stFabrica) : null,
            default: true
        });
        // Cantidad.
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,
            dataIndex: this.salida ? 'existencia' : 'cantidad',
            align: 'right',
            editor: this.editable() ? LOG.util.Prototipos.inputEntero({allowBlank: false}) : null,
            renderer: function(_v, _mD, _r) {
                _r.data.iddocumento = _this.documento ? _this.documento.iddocumento : null;
                _r.data[this.dataIndex] = _v || 0;
                return _r.data[this.dataIndex];
            },
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
//            header: this.idioma.cgDisponible,
            dataIndex: 'disponible',
//            align: 'right',
//            renderer: function(_v) {
//                return _v || 0;
//            },
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgEmbalaje,
            dataIndex: 'elemembalajes',
            align: 'right',
            editor: this.editable() ? LOG.util.Prototipos.inputEntero({allowBlank: false}) : null,
            renderer: function (_v, _mD, _r) {
                _r.data.elemembalajes = _v || 0;
                return _r.data.elemembalajes;
            },
            default: true
        }));
        if (this.salida) {
            this.addGridColumn({dataIndex: 'salida'});
            var encabezado = (this.documento.nroVale) ? this.idioma.cgDevolver : this.idioma.cgCantidad;
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: encabezado,
                dataIndex: 'cantidad',
                align: 'right',
                editor: this.editable(true) ? LOG.util.Prototipos.inputEntero({allowBlank: false}) : null,
                renderer: function(_v, _mD, _r) {
                    if (!_r.data.idtemp) {
                        _r.data.idtemp = 'idtemp_' + _this.cargado++;
                    }
                    _r.data.idmovimiento = _r.data.idmovimiento || _this.producto.idmovimiento;
                    _r.data.cantidad = _v || 0;
                    return _r.data.cantidad;
                },
                default: true
            }));
        }
        // Ubicacion.
        this.ubicacion = {};
        this.addGridColumn({
            header: this.idioma.cgDeposito,
            dataIndex: 'ubicacion',
            editor: this.editable() ? new LOG.util.TreeCombo({
                url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
                node: this.idestructura || 0,
                selectOnlyLeaf: this.confubicacion,
                listeners: {
                    select: function() {
                        _this.ubicacion = {
                            idubicacion: this.getValue(),
                            ubicacion: this.getNodeText()
                        };
                    }
                }
            }) : null,
            renderer: function(_v, _mD, _r) {
                _r.data.idestructuraubicacion = _this.ubicacion.idubicacion || _r.data.idestructuraubicacion;
                _r.data.ubicacion = _this.ubicacion.ubicacion || _r.data.ubicacion;
                _this.ubicacion = {};
                return _r.data.ubicacion;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgEstiba,
            dataIndex: 'estiba',
            align: 'right',
            editor: this.editable() ? LOG.util.Prototipos.inputEntero({allowBlank: false}) : null,
            renderer: function(_v, _mD, _r) {
                _r.data.estiba = _v || null;
                return _r.data.estiba;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgHilera,
            dataIndex: 'hilera',
            align: 'right',
            editor: this.editable() ? LOG.util.Prototipos.inputEntero({allowBlank: false}) : null,
            renderer: function(_v, _mD, _r) {
                _r.data.hilera = _v || null;
                return _r.data.hilera;
            },
            default: true
        });
        // Polvora I
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'idmarcapolvuno',
            editor: this.editable() ? this.initCombo('marca', this.stMarcaPolvora, true) : null,
            renderer: function(_v) {
                var record = _this.stMarcaPolvora.getById(_v);
                return record.data.denominacion;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPartida,
            dataIndex: 'idpartidapolvuno',
            editor: this.editable() ? this.initCombo('partida', this.stPartida, true) : null,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAnno,
            dataIndex: 'idannopolvuno',
            editor: this.editable() ? this.initCombo('anno', this.stAnno, true) : null,
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannopolvuno = _this.sinDatos;
                }
                return _r.data.idannopolvuno;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFabrica,
            dataIndex: 'idfabpolvuno',
            editor: this.editable() ? this.initCombo('fab', this.stFabrica, true) : null,
            default: true
        });
        // Polvora II
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'idmarcapolvdos',
            editor: this.editable() ? this.initCombo('marca', this.stMarcaPolvora, true) : null,
            renderer: function(_v) {
                var record = _this.stMarcaPolvora.getById(_v);
                return record.data.denominacion;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPartida,
            dataIndex: 'idpartidapolvdos',
            editor: this.editable() ? this.initCombo('partida', this.stPartida, true) : null,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAnno,
            dataIndex: 'idannopolvdos',
            editor: this.editable() ? this.initCombo('anno', this.stAnno, true) : null,
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannopolvdos = _this.sinDatos;
                }
                return _r.data.idannopolvdos;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFabrica,
            dataIndex: 'idfabpolvdos',
            editor: this.editable() ? this.initCombo('fab', this.stFabrica, true) : null,
            default: true
        });
        // Explosivo
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'idmarcaexplosivo',
            editor: this.editable() ? this.initCombo('marca', this.stMarcaExplosivo, true) : null,
            renderer: function(_v) {
                var record = _this.stMarcaExplosivo.getById(_v);
                return record.data.denominacion;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPartida,
            dataIndex: 'idpartidaexplosivo',
            editor: this.editable() ? this.initCombo('partida', this.stPartida, true) : null,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAnno,
            dataIndex: 'idannoexplosivo',
            editor: this.editable() ? this.initCombo('anno', this.stAnno, true) : null,
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannoexplosivo = _this.sinDatos;
                }
                return _r.data.idannoexplosivo;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFabrica,
            dataIndex: 'idfabexplosivo',
            editor: this.editable() ? this.initCombo('fab', this.stFabrica, true) : null,
            default: true
        });
        // Espoleta
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'idmarcaespoleta',
            editor: this.editable() ? this.initCombo('marca', this.stMarcaEspoleta, true) : null,
            renderer: function(_v) {
                var record = _this.stMarcaEspoleta.getById(_v);
                return record.data.denominacion;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPartida,
            dataIndex: 'idpartidaespoleta',
            editor: this.editable() ? this.initCombo('partida', this.stPartida, true) : null,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAnno,
            dataIndex: 'idannoespoleta',
            editor: this.editable() ? this.initCombo('anno', this.stAnno, true) : null,
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannoespoleta = _this.sinDatos;
                }
                return _r.data.idannoespoleta;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFabrica,
            dataIndex: 'idfabespoleta',
            editor: this.editable() ? this.initCombo('fab', this.stFabrica, true) : null,
            default: true
        });
        // Estopin
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'idmarcaestopin',
            editor: this.editable() ? this.initCombo('marca', this.stMarcaEstopin, true) : null,
            renderer: function(_v) {
                var record = _this.stMarcaEstopin.getById(_v);
                return record.data.denominacion;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPartida,
            dataIndex: 'idpartidaestopin',
            editor: this.editable() ? this.initCombo('partida', this.stPartida, true) : null,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAnno,
            dataIndex: 'idannoestopin',
            editor: this.editable() ? this.initCombo('anno', this.stAnno, true) : null,
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannoestopin = _this.sinDatos;
                }
                return _r.data.idannoestopin;
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFabrica,
            dataIndex: 'idfabestopin',
            editor: this.editable() ? this.initCombo('fab', this.stFabrica, true) : null,
            default: true
        });
        // Embalaje
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCompleta,
            dataIndex: 'completa',
            align: 'right',
            renderer: function (_v, _mD, _r) {
                return parseInt(parseFloat(_this.salida ? _r.data.existencia : _r.data.cantidad) / parseFloat(_r.data.elemembalajes));
            },
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgIncompleta,
            dataIndex: 'incompleta',
            align: 'right',
            renderer: function (_v, _mD, _r) {
                return parseFloat(_this.salida ? _r.data.existencia : _r.data.cantidad) % parseFloat(_r.data.elemembalajes);
            },
            default: true
        }));
    },
    /**
     * Inicializa las columnas cabeceras.
     * @returns {undefined}
     */
    initGridPlugins: function() {
        var columns = new Array();
        columns.push({
            header: this.idioma.cgpDatosGenerales,
            align: 'center',
            colspan: 5
        });
        columns.push({
            header: this.idioma.cgpCantidad,
            align: 'center',
            colspan: 2
        });
        if (this.salida) {
            columns.push({
                header: (this.ajuste && this.producto.signo == '+' ? this.idioma.cgpEntrada : this.idioma.cgpSalida),
                align: 'center',
                colspan: 1
            });
        }
        columns.push({
            header: this.idioma.cgpDatosUbicacion,
            align: 'center',
            colspan: 3
        });
        columns.push({
            header: this.idioma.cgpPolvoraI,
            align: 'center',
            colspan: 4
        });
        columns.push({
            header: this.idioma.cgpPolvoraII,
            align: 'center',
            colspan: 4
        });
        columns.push({
            header: this.idioma.cgpExplosivo,
            align: 'center',
            colspan: 4
        });
        columns.push({
            header: this.idioma.cgpEspoleta,
            align: 'center',
            colspan: 4
        });
        columns.push({
            header: this.idioma.cgpEstopin,
            align: 'center',
            colspan: 4
        });
        columns.push({
            header: this.idioma.cgpEmbalaje,
            align: 'center',
            colspan: 2
        });
        var plugins = new Ext.ux.grid.ColumnHeaderGroup({
            rows: [columns]
        });
        this.addGridPlugin(plugins);
    },
    /**
     * Inicializa el panel de busqueda avanzada.
     * @returns {undefined}
     */
    initAvanzada: function() {
        this.getPanelBusqueda().setColumns(1);
        var panelMontajeG = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        panelMontajeG.addComponent(this.initCombo('partida', this.stPartida, true, this.idioma.lbCbPartida, 'idpartida'));
        panelMontajeG.addComponent(this.initCombo('anno', this.stAnno, true, this.idioma.lbCbAnno, 'idanno'));
        panelMontajeG.addComponent(this.initCombo('fab', this.stFabrica, true, this.idioma.lbCbFabrica, 'idfab'));
        var fsMontajeG = new Ext.form.FieldSet({
            title: this.idioma.lbDatosGenerales,
            collapsible: true,
            collapsed: false,
            autoHeight: true,
            items: [panelMontajeG]
        });
        
        var panelUbicacion = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        this.cbUbicacion = new LOG.util.TreeCombo({
            fieldLabel: this.idioma.lbCbUbicacion,
            url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
            hiddenName: 'idestructuraubicacion',
            node: this.idestructura || 0,
            selectOnlyLeaf: this.confubicacion
        });
        panelUbicacion.addComponent(this.cbUbicacion);
        if (!this.salida) {//Verificar componente con Kenier...
            panelUbicacion.addComponent(LOG.util.Prototipos.inputEntero({
                fieldLabel: this.idioma.lbNfEstiba,
                name: 'estiba'
            }));
            panelUbicacion.addComponent(LOG.util.Prototipos.inputEntero({
                fieldLabel: this.idioma.lbNfHilera,
                name: 'hilera'
            }));
        }
        var fsUbicacion = new Ext.form.FieldSet({
            title: this.idioma.cgpDatosUbicacion,
            collapsible: true,
            collapsed: true,
            autoHeight: true,
            items: [panelUbicacion]
        });

        var panelPolvora1 = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        panelPolvora1.addComponent(this.initCombo('marca', this.stMarcaPolvora, true, this.idioma.lbCbMarca, 'idmarcapolvuno'));
        panelPolvora1.addComponent(this.initCombo('partida', this.stPartida, true, this.idioma.lbCbPartida, 'idpartidapolvuno'));
        panelPolvora1.addComponent(this.initCombo('anno', this.stAnno, true, this.idioma.lbCbAnno, 'idannopolvuno'));
        panelPolvora1.addComponent(this.initCombo('fab', this.stFabrica, true, this.idioma.lbCbFabrica, 'idfabpolvuno'));
        var fsPolvora1 = new Ext.form.FieldSet({
            title: this.idioma.cgpPolvoraI,
            collapsible: true,
            collapsed: true,
            autoHeight: true,
            items: [panelPolvora1]
        });

        var panelPolvora2 = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        panelPolvora2.addComponent(this.initCombo('marca', this.stMarcaPolvora, true, this.idioma.lbCbMarca, 'idmarcapolvdos'));
        panelPolvora2.addComponent(this.initCombo('partida', this.stPartida, true, this.idioma.lbCbPartida, 'idpartidapolvdos'));
        panelPolvora2.addComponent(this.initCombo('anno', this.stAnno, true, this.idioma.lbCbAnno, 'idannopolvdos'));
        panelPolvora2.addComponent(this.initCombo('fab', this.stFabrica, true, this.idioma.lbCbFabrica, 'idfabpolvdos'));
        var fsPolvora2 = new Ext.form.FieldSet({
            title: this.idioma.cgpPolvoraII,
            collapsible: true,
            collapsed: true,
            autoHeight: true,
            items: [panelPolvora2]
        });

        var panelExplosivo = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        panelExplosivo.addComponent(this.initCombo('marca', this.stMarcaPolvora, true, this.idioma.lbCbMarca, 'idmarcaexplosivo'));
        panelExplosivo.addComponent(this.initCombo('partida', this.stPartida, true, this.idioma.lbCbPartida, 'idpartidaexplosivo'));
        panelExplosivo.addComponent(this.initCombo('anno', this.stAnno, true, this.idioma.lbCbAnno, 'idannoexplosivo'));
        panelExplosivo.addComponent(this.initCombo('fab', this.stFabrica, true, this.idioma.lbCbFabrica, 'idfabexplosivo'));
        var fsExplosivo = new Ext.form.FieldSet({
            title: this.idioma.cgpExplosivo,
            collapsible: true,
            collapsed: true,
            autoHeight: true,
            items: [panelExplosivo]
        });
        
        var panelEspoleta = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        panelEspoleta.addComponent(this.initCombo('marca', this.stMarcaPolvora, true, this.idioma.lbCbMarca, 'idmarcaespoleta'));
        panelEspoleta.addComponent(this.initCombo('partida', this.stPartida, true, this.idioma.lbCbPartida, 'idpartidaespoleta'));
        panelEspoleta.addComponent(this.initCombo('anno', this.stAnno, true, this.idioma.lbCbAnno, 'idannoespoleta'));
        panelEspoleta.addComponent(this.initCombo('fab', this.stFabrica, true, this.idioma.lbCbFabrica, 'idfabespoleta'));
        var fsEspoleta = new Ext.form.FieldSet({
            title: this.idioma.cgpEspoleta,
            collapsible: true,
            collapsed: true,
            autoHeight: true,
            items: [panelEspoleta]
        });
        
        var panelEstopin = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        panelEstopin.addComponent(this.initCombo('marca', this.stMarcaPolvora, true, this.idioma.lbCbMarca, 'idmarcaestopin'));
        panelEstopin.addComponent(this.initCombo('partida', this.stPartida, true, this.idioma.lbCbPartida, 'idpartidaestopin'));
        panelEstopin.addComponent(this.initCombo('anno', this.stAnno, true, this.idioma.lbCbAnno,'idannoestopin'));
        panelEstopin.addComponent(this.initCombo('fab', this.stFabrica, true, this.idioma.lbCbFabrica, 'idfabestopin'));
        var fsEstopin = new Ext.form.FieldSet({
            title: this.idioma.cgpEstopin,
            collapsible: true,
            collapsed: true,
            autoHeight: true,
            items: [panelEstopin]
        });
        
        this.addFilterComponent(fsMontajeG);
        this.addFilterComponent(fsUbicacion);
        this.addFilterComponent(fsPolvora1);
        this.addFilterComponent(fsPolvora2);
        this.addFilterComponent(fsExplosivo);
        this.addFilterComponent(fsEspoleta);
        this.addFilterComponent(fsEstopin);
    },
    /**
     * Inicializa el panel de datos.
     * @returns {undefined}
     */
    panelDatos: function() {
        this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function() {
            this.fields = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            this.cantidad = new Ext.form.Label({
                html: String.format(this.formato, this.idioma.lbCantidad, 0, this.cantmaxima),
                scope: this,
                setHtml: function(v) {
                    delete this['html'];
                    if (this.rendered) {
                        this.el.dom.innerHTML = String.format(this.scope.formato, this.scope.idioma.lbCantidad, v, this.scope.cantmaxima);
                    }
                    return this;
                }
            });
            if (this.desglose) {
                this.fields.addComponent({html: String.format("<b>{0}:</b> &nbsp;{1}", this.idioma.lbTipoDoc, this.documento.tipodocumento)});
                this.fields.addComponent({html: String.format("<b>{0}:</b> &nbsp;{1}", this.idioma.lbFecha, this.documento.fechacontable)});
                this.fields.addComponent({html: String.format("<b>{0}:</b> &nbsp;{1}", this.idioma.lbNroDoc, (this.documento.nrodoc || this.documento.numeroref))});
                this.fields.addComponent(this.cantidad);
                this.fields.addComponent({html: String.format("<b>{0}:</b> &nbsp;{1}", this.idioma.lbDenominacion, this.producto.denominacion)});
            } else {
                this.fields.addComponent({html: String.format("<b>{0}:</b> &nbsp;{1}", this.idioma.lbNroDoc, (this.documento.nrodoc || this.documento.numeroref))});
                this.fields.addComponent({html: String.format("<b>{0}:</b> &nbsp;{1}", this.idioma.lbFecha, this.documento.fechacontable)});
                this.fields.addComponent({html: String.format("<b>{0}:</b> &nbsp;{1}", this.idioma.lbDenominacion, this.producto.denominacion)});
                this.fields.addComponent(this.cantidad);
            }
        
            this.fPanel = LOG.util.UIManager.initPanel({
                frame: true,
                items: [
                    new Ext.form.FieldSet({
                        items: [this.fields]
                    })
                ],
                region: 'center'
            });
            
            if (!this.salida) {
                this.cbIndice = new LOG.util.ComboBox({
                    fieldLabel: this.idioma.lbCbIndice,
                    displayField: 'denominacion',
                    store: this.stIndice,
                    hiddenName: 'indice',
                    valueField: 'idmarcaarmamento',
                    autoLoad: false,
                    allowBlank: false,
                    disabled: this.documento.estado != '1',
                    hidden: this.salida
                });
                this.formFields = LOG.util.UIManager.initForm({
                    items: [this.cbIndice]
                });
                this.fPanel.add(this.formFields);
                this.modelo.bindForm(this.formFields);
            }
            this.getPanelSuperior().add(this.fPanel);
            this.getPanelSuperior().autoHeight = true;
        }, this);
    },
    /**
     * Programa los eventos del componente y renderiza la vista.
     * @returns {Vista principal}
     */
    render: function() {
        var render = LOG.inv.municiones.View.superclass.render.call(this);
        var _this = this;
        // Parametrizacion de le funcion exportar.
        if (this.listaBotones.getBy('btn', 'exportar')) {
            this.listaBotones.getBy('btn', 'exportar').handler = this.listaBotones.getBy('btn', 'exportar').handler.createInterceptor(function() {
                var params = _this.panelBusquedaAvanzada.getForm().getFieldValues(true);
                Ext.apply(params, {
                    criterio: _this.gridFilter.tfBusqueda.getValue(),
                    idmovimiento: _this.producto.idmovimiento,
                    idproducto: _this.producto.idproducto,
                    idestructura: _this.idestructura,
                    proceso: true,
                    contabilizado: (_this.documento && _this.documento.estado != '1') ? true : null
                }, _this.baseParams);
                this.objSubmit = params;
            }, this.listaBotones.getBy('btn', 'exportar'));
        }
        if (this.formaVisualizacion == 'ventana') {
            this.getVistaPrincipal().on({
                hide: function() {
                    _this.onCerrarHandler();
                }
            });
            Ext.MessageBox.wait(this.idioma.msgCargando, this.idioma.msgEspere);
        }
        this.getStorePrincipal().on({
            beforeload: function() {
                if (_this.idestructuraUbic != _this.idestructura) {
                    _this.idestructuraUbic = _this.idestructura;
                    _this.cbUbicacion.setBaseNode({_node: _this.idestructura});
                }
                _this.modelo.reset();
                if (_this.producto) {
                    this.initBaseParams.idmovimiento = _this.producto.idmovimiento;
                    this.initBaseParams.idproducto = _this.producto.idproducto;
                    if (_this.salida) {
                        this.initBaseParams.idproducto = _this.producto.idproducto;
                    }
                }
                if (_this.documento) {
                    this.initBaseParams.contabilizado = _this.documento.estadodoc != '1' ? true : null;
                    if (_this.documento.idpadre) {
                        this.initBaseParams.idpadre = _this.documento.idpadre;
                    }
                }
                this.rejectChanges();
            },
            load: function() {
                console.info(this.reader)
                if (_this.cbIndice) {
                    _this.cbIndice.setValue(this.reader.jsonData.indice || _this.stIndice.getBy('denominacion', _this.sinDatos).get('idmarcaarmamento'));
                    _this.cbIndice.fireEvent('select');
                }
                if (_this.panelSuperior) {
                    if (_this.desglose) {
                        //_this.cantidadDesglozada.setHtml(this.reader.jsonData.totalDesglozado);
                        //_this.cantidadDesglozada.setHtml(this.reader.jsonData.totalDesglozado);
                        _this.cantidadOriginal.setHtml( parseInt(_this.producto.existencia));
                    } else {
                        _this.cantidad.setHtml(this.reader.jsonData.total);
                    }

                }
            }
        });
        this.getGridPrincipal().on({
            beforeedit: function(o) {
                _this.ubicacion = {
                    idubicacion: o.record.data.idestructuraubicacion,
                    ubicacion: o.record.data.ubicacion
                }
                if (o.record.json && o.record.json.estado != '1' && !_this.desglose && !_this.salida) {
                    o.cancel = true;
                }
            },
            afteredit: function(o) {
                if (_this.salida || (_this.producto && parseInt(_this.producto.diferencia || 0) > 0)) {
                    o.record.data.cantidad = _this.validarSalida(o.record.data);
                    o.grid.view.refresh();
                }

                /*if (o.field == 'cantidad' && _this.desglose) {
                    if (_this.getSuma('cantidad') > parseInt(_this.reader.jsonData.totalAprobado)) {
                        o.record.data.cantidad = o.originalValue;
                        o.grid.view.refresh();
                        mostrarMensaje(3, _this.idioma.msgCantidadMayor);
                    } else {
                        if (_this.desglose) {
                            _this.faltante = parseInt(o.originalValue) - parseInt(o.record.data.cantidad);
                        }
                    }
                }*/

                var record = o.record.copy();
                Ext.apply(record.data, {
                    idanno: record.data.idanno == _this.sinDatos ? 0 : record.data.idanno,
                    idannopolvuno: record.data.idannopolvuno == _this.sinDatos ? 0 : record.data.idannopolvuno,
                    idannopolvdos: record.data.idannopolvdos == _this.sinDatos ? 0 : record.data.idannopolvdos,
                    idannoexplosivo: record.data.idannoexplosivo == _this.sinDatos ? 0 : record.data.idannoexplosivo,
                    idannoespoleta: record.data.idannoespoleta == _this.sinDatos ? 0 : record.data.idannoespoleta,
                    idannoestopin: record.data.idannoestopin == _this.sinDatos ? 0 : record.data.idannoestopin
                });
                _this.modelo.adicionarPartida(record.data);
            }
        });
        return render;
    },
    /**
     * Crea los store del componente dinamicamente.
     * @returns {undefined}
     */
    initStores: function () {
        var _this = this;
        var stIndice = {
            id: 'idmarcaarmamento',
            baseParams: {
                modelo: 'NomMarcaarmamento',
                idnom: 'idmarcaarmamento',
                idelemento: 'indice',
                bussines: 'NomMarcaarmamentoModel',
                entidad: true
            }
        };
        this.crearStore('stIndice', stIndice);
        var stFabrica = {
            id: 'idfabrica',
            baseParams: {
                modelo: 'NomFabrica',
                idnom: 'idfabrica',
                entidad: true
            }
        };
        this.crearStore('stFabrica', stFabrica);
        var stPartida = {
            id: 'idpartida',
            baseParams: {
                modelo: 'NomPartida',
                idnom: 'idpartida',
                entidad: true
            }
        };
        this.crearStore('stPartida', stPartida);
        var stAnno = {
            id: 'idannofabricacion',
            baseParams: {
                modelo: 'NomAnnofabricacion',
                idnom: 'idannofabricacion',
                entidad: true
            },
            _fn: function(st) {
                var inicio = 1900, fin = _this.getYear(_this.fecha), records = new Array();
                while (inicio <= fin) {
                    if (!st.getBy('denominacion', inicio)) {
                        records.push(new Ext.data.Record({denominacion: inicio, anno: inicio, estado: 1, numero: true}));
                    }
                    inicio++;
                }
                st.add(records);
            }
        };
        this.crearStore('stAnno', stAnno);
        var stMarcaPolvora = {
            id: 'idmarcaarmamento',
            baseParams: {
                modelo: 'NomMarcaarmamento',
                idnom: 'idmarcaarmamento',
                idelemento: 'polvora',
                bussines: 'NomMarcaarmamentoModel',
                entidad: true
            }
        };
        this.crearStore('stMarcaPolvora', stMarcaPolvora);
        var stMarcaExplosivo = {
            id: 'idmarcaarmamento',
            baseParams: {
                modelo: 'NomMarcaarmamento',
                idnom: 'idmarcaarmamento',
                idelemento: 'explosivo',
                bussines: 'NomMarcaarmamentoModel',
                entidad: true
            }
        };
        this.crearStore('stMarcaExplosivo', stMarcaExplosivo);
        var stMarcaEspoleta = {
            id: 'idmarcaarmamento',
            baseParams: {
                modelo: 'NomMarcaarmamento',
                idnom: 'idmarcaarmamento',
                idelemento: 'espoleta',
                bussines: 'NomMarcaarmamentoModel',
                entidad: true
            }
        };
        this.crearStore('stMarcaEspoleta', stMarcaEspoleta);
        var stMarcaEstopin = {
            id: 'idmarcaarmamento',
            baseParams: {
                modelo: 'NomMarcaarmamento',
                idnom: 'idmarcaarmamento',
                idelemento: 'estopin',
                bussines: 'NomMarcaarmamentoModel',
                entidad: true
            }
        };
        this.crearStore('stMarcaEstopin', stMarcaEstopin);
    },
    /**
     * Construye un store con los datos especificados.
     * @param {String} nombre
     * @param {Object} params
     * @returns {undefined}
     */
    crearStore: function(nombre, params) {
        var _this = this;
        this[nombre] = new Ext.data.Store({
            url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomenclador',
            autoLoad: true,
            baseParams: params.baseParams,
            reader: new Ext.data.JsonReader({
                id: params.id,
                root: "datos",
                fields: [
                    {name: params.id},
                    {name: 'denominacion'}
                ]
            }),
            listeners: {
                load: function() {
                    _this.cargado++;
                    if (_this.cargado == 8) {
                        if (Ext.MessageBox.isVisible()) {
                            Ext.MessageBox.hide();
                            _this.getStorePrincipal().load();
                        }
                    }
                    if (typeof params._fn == 'function') {
                        params._fn.createDelegate(_this, [this]).call();
                    }
                }
            }
        });
    },
    /**
     * Inicializa un combo.
     * @param {String} tipo
     * @param {Ext.data.Store} store
     * @param {Boolean} vacio [Opcional]
     * @param {String} etiqueta [Opcional]
     * @param {String} nombre [Opcional]
     * @returns {LOG.util.ComboBox}
     */
    initCombo: function (tipo, store, vacio, etiqueta, nombre) {
        var _this = this;
        var combo = new LOG.util.ComboBox({
            fieldLabel: etiqueta,
            hiddenName: nombre,
            store: store,
            displayField: 'denominacion',
            valueField: (tipo == 'marca' ? 'idmarcaarmamento' : 'denominacion'),
            allowBlank: vacio || false,
            editable: true,
            enableKeyEvents: true,
            selectOnFocus: true
        });
        combo.on({
            expand: function() {
                this.keyNav.tab = this.keyNav.tab.createInterceptor(function() {
                    this.keyNav.enter.createDelegate(this).call();
                });
            }
        });
        if (tipo == 'anno') {
            combo.on({
                focus: function() {
                    this.selectText();
                },
                expand: function() {
                    this.getStore().filterBy(function(item) {
                        return !item.data.numero;
                    });
                },
                keyup: function(cb, e, v) {
                    if (!this.getRawValue()) {
                        this.fireEvent('expand', this);
                        if (!v) {
                            this.fireEvent('expand', this);
                            this.fireEvent('keyup', this, e, true);
                        }
                    }
                },
                blur: function() {
                    if (parseInt(combo.getValue()) < 1900 || parseInt(combo.getValue()) > new Date(_this.fecha).getFullYear()) {
                        this.setValue(_this.valor);
                        mostrarMensaje(3, _this.idioma.msgErrorAnno);
                    }
                    if (!combo.getValue()) {
                        this.setValue(_this.valor);
                    }
                }
            });
        }
        return combo;
    },
    /**
     * Devuelve un nuevo record para adicionar.
     * @param {Boolean} duplicar
     * @returns {Ext.data.Record}
     */
    newRecord: function(duplicar) {
        var _this = this;
        var data = {};
        if (duplicar) {
            data = this.getSmPrincipal().getSelected().copy().data;
            Ext.apply(data, {
                idtemp: 'idtemp_' + this.cargado++,
                idmovproductomunic: null,
                idproductomunic: null,
                iddocumento: this.documento.iddocumento,
                _cantidad: 0,
                cantidad: (_this.desglose) ? 0 : data.cantidad,
                idanno: data.idanno == this.sinDatos ? 0 : data.idanno,
                idannopolvuno: data.idannopolvuno == this.sinDatos ? 0 : data.idannopolvuno,
                idannopolvdos: data.idannopolvdos == this.sinDatos ? 0 : data.idannopolvdos,
                idannoexplosivo: data.idannoexplosivo == this.sinDatos ? 0 : data.idannoexplosivo,
                idannoespoleta: data.idannoespoleta == this.sinDatos ? 0 : data.idannoespoleta,
                idannoestopin: data.idannoestopin == this.sinDatos ? 0 : data.idannoestopin
            });
        } else {
            data = {
                idtemp: 'idtemp_' + this.cargado++,
                idproducto: this.producto.idproducto,
                idmovimiento: this.producto.idmovimiento,
                iddocumento: this.documento.iddocumento,
                idpartida: this.sinDatos,
                idanno: 0,
                idfab: this.sinDatos,
                //cantidad: (_this.desglose) ? _this.faltante : 0,
                cantidad: 0,
                //_cantidad: (_this.desglose) ? _this.faltante : 0,
                _cantidad: 0,
                elemembalajes: 0,
                idmarcapolvuno: this.stMarcaPolvora.getBy('denominacion', 'S/Datos').data.idmarcaarmamento,
                idpartidapolvuno: this.sinDatos,
                idannopolvuno: 0,
                idfabpolvuno: this.sinDatos,
                idmarcapolvdos: this.stMarcaPolvora.getBy('denominacion', 'S/Datos').data.idmarcaarmamento,
                idpartidapolvdos: this.sinDatos,
                idannopolvdos: 0,
                idfabpolvdos: this.sinDatos,
                idmarcaexplosivo: this.stMarcaExplosivo.getBy('denominacion', 'S/Datos').data.idmarcaarmamento,
                idpartidaexplosivo: this.sinDatos,
                idannoexplosivo: 0,
                idfabexplosivo: this.sinDatos,
                idmarcaespoleta: this.stMarcaEspoleta.getBy('denominacion', 'S/Datos').data.idmarcaarmamento,
                idpartidaespoleta: this.sinDatos,
                idannoespoleta: 0,
                idfabespoleta: this.sinDatos,
                idmarcaestopin: this.stMarcaEstopin.getBy('denominacion', 'S/Datos').data.idmarcaarmamento,
                idpartidaestopin: this.sinDatos,
                idannoestopin: 0,
                idfabestopin: this.sinDatos
            };
        }
        this.modelo.adicionarPartida(data);
        return new Ext.data.Record(data);
    },
    /**
     * Verifica si se puede editar la columna.
     * @param {Boolean} salida
     * @returns {Boolean}
     */
    editable: function(salida) {
        if ((this.grantedAction('CT') || this.grantedAction('RCRUD') || this.grantedAction('RAdicionar')) &&
            this.documento.estado == '1' && ((salida && this.salida) || (!salida && !this.salida))) {
            return true;
        }
        return false;
    },
    /**
     * Valida que la cantidad saliete sea correcta.
     * @param {Object} record
     * @returns {Integer}
     */
    validarSalida: function(record) {
        var unico = this.getStorePrincipal().getModifiedRecords().length == 1;
        var resto = this.cantmaxima - (this.getSuma('cantidad') - parseInt(record.cantidad));
        if (parseInt(record.cantidad || 0) > parseInt(record.disponible) && !this.devolucion && this.producto.signo == '-') {
            record.cantidad = Math.min(this.cantmaxima, parseInt(record.disponible), resto);
            mostrarMensaje(3, this.ajuste ? this.idioma.msgAjusteDisponible : this.idioma.msgSalidaDsiponible);
        } else if (parseInt(record.cantidad || 0) > this.cantmaxima && unico && !this.devolucion) {
            record.cantidad = Math.min(this.cantmaxima, parseInt(record.disponible), resto);
            mostrarMensaje(3, this.ajuste ? this.idioma.msgAjusteConteo : this.idioma.msgSalidaOrdenado);
        } else if (this.getSuma('cantidad') > this.cantmaxima && !this.devolucion) {
            record.cantidad = Math.min(this.cantmaxima, parseInt(record.disponible), resto);
            mostrarMensaje(3, this.ajuste ? this.idioma.msgAjusteSuma : this.idioma.msgSalidaSuma);
        } else if (parseInt(record.cantidad || 0) > (parseInt(record.entregado) - parseInt(record.resto)) && this.devolucion) {
            record.cantidad = parseInt(record.entregado) - parseInt(record.resto);
            mostrarMensaje(3, this.idioma.msgDevolucionEntregado);
        }
        return record.cantidad;
    },
    /**
     * Devuelve la suma de los valores de un campo en el store.
     * @param {String} campo
     * @returns {Integer}
     */
    getSuma: function(campo) {
        var suma = 0;
        this.getStorePrincipal().each(function(item) {
            suma += parseInt(item.data[campo] || 0);
        });
        return suma;
    },
    /**
     * Devuelve el años de la fecha.
     * @param {String} fecha
     * @returns {String}
     */
    getYear: function(fecha) {
        return fecha.split('/')[2];
    },
    /**
     * Inicializa y muestra la interfaz.
     * @returns {Object} Vista principal.
     */
    show: function() {
        this.init();
        return this.view();
    },
    /**
     * Funcion que se ejecuta al cerrar la ventana.
     * @returns {undefined}
     */
    onCerrarHandler: function() {
        if (typeof this.cerrarFn == 'function') {
            this.cerrarFn.createDelegate(this).call();
        }
    }
});

/**
 * Plantilla para la gestion de partidas.
 * @type LOG.util.UITemplate
 */
LOG.inv.municiones.Ventana = Ext.extend(LOG.inv.municiones.View, {
    /**
     * Forma en la que se vizualiza el componente, 
     * default - Ext.Viewport
     * panel - Ext.Panel
     * ventana - Ext.Window
     */
    formaVisualizacion: 'panel',
    /**
     * Inicializa los botones del componente.
     */
    initDefaultButtons: Ext.emptyFn,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.modoSeleccion = 1;
        this.autoShow = false;
        this.panelSuperior = false;
        this.plugins = false;
        LOG.inv.municiones.Ventana.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idproductomunic'});
        this.addGridColumn({dataIndex: 'idmovproductomunic'});
        this.addGridColumn({dataIndex: 'idestructuraubicacion'});
        this.addGridColumn({dataIndex: 'checksum'});
        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            dataIndex: 'ubicacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgEstiba,
            dataIndex: 'estiba'
        });
        this.addGridColumn({
            header: this.idioma.cgHilera,
            dataIndex: 'hilera'
        });
        this.addGridColumn({
            header: this.idioma.cgMGPartida,
            dataIndex: 'idpartida'
        });
        this.addGridColumn({
            header: this.idioma.cgMGAnno,
            dataIndex: 'idanno',
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idanno = _this.sinDatos;
                }
                return _r.data.idanno;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgMGFabrica,
            dataIndex: 'idfab'
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            dataIndex: 'existencia',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
//            header: this.idioma.cgDisponible,
            dataIndex: 'disponible',
            align: 'right',
            default: true
        }));
        this.addGridColumn({
            header: this.idioma.cgPIMarca,
            dataIndex: 'idmarcapolvuno',
            renderer: function(v) {
                var record = _this.stMarcaPolvora.getById(v);
                return record.data.denominacion;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgPIPartida,
            dataIndex: 'idpartidapolvuno'
        });
        this.addGridColumn({
            header: this.idioma.cgPIAnno,
            dataIndex: 'idannopolvuno',
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannopolvuno = _this.sinDatos;
                }
                return _r.data.idannopolvuno;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgPIFabrica,
            dataIndex: 'idfabpolvuno'
        });
        this.addGridColumn({
            header: this.idioma.cgPIIMarca,
            dataIndex: 'idmarcapolvdos',
            renderer: function(v) {
                var record = _this.stMarcaPolvora.getById(v);
                return record.data.denominacion;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgPIIPartida,
            dataIndex: 'idpartidapolvdos'
        });
        this.addGridColumn({
            header: this.idioma.cgPIIAnno,
            dataIndex: 'idannopolvdos',
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannopolvdos = _this.sinDatos;
                }
                return _r.data.idannopolvdos;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgPIIFabrica,
            dataIndex: 'idfabpolvdos'
        });
        this.addGridColumn({
            header: this.idioma.cgExplosivoMarca,
            dataIndex: 'idmarcaexplosivo',
            renderer: function(v) {
                var record = _this.stMarcaExplosivo.getById(v);
                return record.data.denominacion;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgExplosivoPartida,
            dataIndex: 'idpartidaexplosivo'
        });
        this.addGridColumn({
            header: this.idioma.cgExplosivoAnno,
            dataIndex: 'idannoexplosivo',
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannoexplosivo = _this.sinDatos;
                }
                return _r.data.idannoexplosivo;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgExplosivoFabrica,
            dataIndex: 'idfabexplosivo'
        });
        this.addGridColumn({
            header: this.idioma.cgEspoletaMarca,
            dataIndex: 'idmarcaespoleta',
            renderer: function(v) {
                var record = _this.stMarcaEspoleta.getById(v);
                return record.data.denominacion;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEspoletaPartida,
            dataIndex: 'idpartidaespoleta'
        });
        this.addGridColumn({
            header: this.idioma.cgEspoletaAnno,
            dataIndex: 'idannoespoleta',
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannoespoleta = _this.sinDatos;
                }
                return _r.data.idannoespoleta;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEspoletaFabrica,
            dataIndex: 'idfabespoleta'
        });
        this.addGridColumn({
            header: this.idioma.cgEstopinMarca,
            dataIndex: 'idmarcaestopin',
            renderer: function(v) {
                var record = _this.stMarcaEstopin.getById(v);
                return record.data.denominacion;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstopinPartida,
            dataIndex: 'idpartidaestopin'
        });
        this.addGridColumn({
            header: this.idioma.cgEstopinAnno,
            dataIndex: 'idannoestopin',
            renderer: function(_v, _mD, _r) {
                if (_v == 0) {
                    _r.data.idannoestopin = _this.sinDatos;
                }
                return _r.data.idannoestopin;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstopinFabrica,
            dataIndex: 'idfabestopin'
        });

    },
    /**
     * Programa los eventos del componente y renderiza la vista.
     * @returns {Vista principal}
     */
    render: function() {
        var _this = this;
        var render = LOG.inv.municiones.Ventana.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function() {
                this.initBaseParams.idproducto = _this.idproducto;
                this.initBaseParams.idarea = _this.idarea;
            }
        });
        return render;
    }
});