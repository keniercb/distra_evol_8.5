Ext.ns('LOG.lb.ubicacion');

LOG.lb.ubicacion.View = Ext.extend(LOG.util.UITemplate, {
    confubicacion: undefined,
    proceso: false,
    constructor: function (config) {
        this.autoLoad = false;
        this.dirController = '/logistica/utiles/ubicacion/index.php/ubicacion';
        this.urlBusquedaGridPrincipal = 'cargarProductosUbicar';
        this.modoSeleccion = 1;
        this.autoSelect = false;
        this.busquedaBasica = true;
        this.idGridPrincipal = 'idproducto';
        this.busquedaAvanzada = true;
        this.textBusquedaSimple = 'C\xf3digo y denominaci\xf3n';
        this.listaP = new LOG.util.List();
        this.concepto = config.idioma.ttBuscar;
        this.modelo = new LOG.lb.ubicacion.Model({
            idioma: config.idioma
        });
        LOG.lb.ubicacion.View.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.lb.ubicacion.View.superclass.init.call(this);
        _this.panelInferior = LOG.util.UIManager.initPanel({
            animCollapse: false,
            collapsible: true,
            collapsed: true,
            region: 'south',
            layout: 'fit',
            html: 'fit',
            height: 400,
            title: _this.idioma.tlVentanaGestionarDatos,
            collapseMode: 'mini',
            titleCollapse: true,
            pContainer: _this.getPanelPrincipal(),
            animate: true,
            bbar: ['->',
                _this.btnSalvar = LOG.util.Prototipos.botonGuardar({
                    tooltip: _this.idioma.ttBtnGuardar,
                    scope: this,
                    disabled: true,
                    handler: function () {
                        _this.modelo.redistribuirLotes(_this.prepararDatos(), function (r) {
                            _this.lote.getStorePrincipal().reload();
                        });
                    }
                })]
        });
        _this.panelInferior.on({
            'collapse': function () {
                this.hide();
                this.pContainer.doLayout();
            },
            'beforeexpand': function () {
                this.show();
                this.pContainer.doLayout();
            }
        }, _this.panelInferior);
        LOG.util.UIManager.encadenaFn(_this.getPanelPrincipal(), 'onRender', function () {
            _this.getPanelPrincipal().add(_this.panelInferior);
        });
    },
    prepararDatos: function () {
        var arrayLotes = new Array();
        Ext.each(this.lote.getStorePrincipal().getModifiedRecords(), function (item) {
            if (item.get('idubicacion') && item.get('cantidad')) {
                arrayLotes.push({
                    idproducto: item.get('idproducto'),
                    idubicacionproducto: item.get('idubicacionproducto'),
                    cantidad: item.get('cantidad'),
                    idlote: item.get('idlote'),
                    idarea: item.get('idarea'),
                    idubicacionlote: item.get('idubicacionlote'),
                    idarealote: item.get('idarealote'),
                    idareaproducto: item.get('idareaproducto'),
                    idubicacion: item.get('idubicacion'),
                    idubicacionloteViejo: item.get('idubicacionloteViejo'),
                    idubicacionproductoViejo: item.get('idubicacionproductoViejo'),
                    idarealoteViejo: item.get('idarealoteViejo'),
                    idareaproductoViejo: item.get('idareaproductoViejo'),
                    unificar: item.get('unificar')
                });
            }
        }, this);
        return arrayLotes;
    },
    render: function () {
        var _this = this;
        var resultado = LOG.lb.ubicacion.View.superclass.render.call(this);
        _this.storePrincipal.on({
            load: function (st, rd) {
                _this.confubicacion = st.reader.jsonData.confubicacion;
            }
        });
        LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                if (this.getCount() == 1 && this.getSelected().data.tienelote == 1) {
                    _this.initLoteView(function () {
                        _this.lote.iddeposito = _this.idDeposito;
                        _this.lote.cbUbicacion.setBaseNode({_node: _this.idDeposito});
                    });
                }
                else {
                    _this.panelInferior.collapse();
                }
            }
        }, 'seleccionarLote');
        return resultado;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 150,
            dataIndex: 'numeropieza',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenom,
            width: 200,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 60,
            dataIndex: 'umedida',
            default: true
        });
        if (typeof usarCategoria !== 'undefined' && usarCategoria == true) {
            this.addGridColumn({
                header: this.idioma.cgCategoria,
                width: 100,
                dataIndex: 'nomcategoria',
                default: true
            });
        }

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            width: 100,
            align: 'right',
            dataIndex: 'ubicada',
            default: true,
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidadPorUbicar,
            width: 120,
            align: 'right',
            dataIndex: 'cantidad',
            default: true

        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgMinimo,
            width: 100,
            align: 'right',
            dataIndex: 'minimo',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgMaximo,
            width: 100,
            align: 'right',
            dataIndex: 'maximo',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,
            width: 100,
            align: 'right',
            dataIndex: 'existencia',
            default: true
        }));

        this.addGridColumn({
            header: this.idioma.cgAlmacenamiento,
            width: 100,
            dataIndex: 'especial',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {

                if (record.get('municion') == 1) {
                    metaData.css = 'icondistra-partida';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmMunicion + '"';

                } else if (record.get('equipo') == 1) {
                    metaData.css = 'icondistra-numeroserie';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNorSerie + '"';

                } else if (record.get('tienelote') == 1) {
                    metaData.css = 'icondistra-lote';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmLote + '"';

                } else {
                    metaData.css = 'icondistra-producto';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmProducto + '"';

                }

            }
        });


        this.addGridColumn({
            dataIndex: 'municion',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'equipo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'tienelote',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idestructura',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: true
        });

    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbBtnUbicar,
            tooltip: this.idioma.ttBtnUbicar,
            iconCls: 'ubicarproducto',
            disabled: true,
            handler: function () {

                LOG.inv.ubicacion.Loader.init(function () {

                    var winUbicar = new LOG.lb.ubicacion.winUbicar({
                        vista: _this,
                        st: _this.getStorePrincipal(),
                        datos: _this.getSmPrincipal(),
                        iddeposito: _this.idDeposito,
                        nomDeposito: _this.nomDeposito,
                        confubicacion: _this.confubicacion,
                        tienelote: _this.getSmPrincipal().getSelected().data.tienelote,
                        idindicador: (_this.getGridPrincipal().getSelectionModel().getSelected().json.idindicador) ? _this.getGridPrincipal().getSelectionModel().getSelected().json.idindicador : ''
                    });
                    winUbicar.show();
                });
            },
            controlFn: function (b, _caller) {
                b.setVisible(false);
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().json.tienelote != 1 && this.getSelected().json.equipo != 1
                            && this.getSelected().json.municion != 1 && this.getSelected().json.cantidad > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'wUbicar');
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'ubicar',
            text: this.idioma.lbBtnUbicaciones,
            tooltip: this.idioma.ttBtnUbicaciones,
            disabled: true,
            handler: function () {
                LOG.inv.ubicacion.Loader.init(function () {
                    this.winUbicaciones = new LOG.lb.ubicacion.winUbicaciones({
                        idioma: _this.idioma,
                        vista: _this,
                        idproducto: _this.getGridPrincipal().getSelectionModel().getSelected().json.idproducto,
                        datos: _this.getGridPrincipal().getSelectionModel(),
                        iddeposito: _this.idDeposito,
                        nomDeposito: _this.nomDeposito,
                        confubicacion: _this.confubicacion
                    });
                    this.winUbicaciones.init();
                    this.winUbicaciones.view();
                });
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().json.tienelote != '1' /*&&
                         this.getSelected().data.existencia - this.getSelected().data.cantidad != 0*/) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'wUbicaciones');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'estructura',
            text: this.idioma.lbBtnEstructuraAlmacen,
            tooltip: this.idioma.ttBtnEstructuraAlmacen,

            handler: function () {
                this.winEstructuraAlmacen = new LOG.lb.ubicacion.winEstructuraAlmacen({
                    idioma: _this.idioma,
                    iddeposito: _this.idDeposito,
                    nomDeposito: _this.comboDeposito.getRawValue(),
                    datos: _this.getGridPrincipal().getSelectionModel()
                });
                this.winEstructuraAlmacen.setTitle(_this.idioma.tlVentanaEstructuraAlmacen);
                this.winEstructuraAlmacen.show();
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idubicacion'
        }));
    },
    initLoteView: function (_fn) {
        var _this = this;
        if (this.lote == undefined) {
            LOG.lb.lote.Loader.init(function () {
                _this.lote = new LOG.lb.lote.View({
                    formaVisualizacion: 'panel',
                    panelSuperior: false,
                    gridEditable: true,
                    ubicacion: true,
                    iddeposito: _this.idDeposito,
                    sm: _this.getSmPrincipal(),
                    dirController: '/logistica/utiles/ubicacion/index.php/ubicacion',
                    urlBusquedaGridPrincipal: 'cargarlotes',
                    grantedAction: function (_p) {
                        return true;
                    }
                });

                _this.lote.init();
                _this.lote.cbUbicacion = new LOG.util.TreeCombo({
                    fieldLabel: _this.idioma.lbCbUbicacion,
                    name: 'idubicacion',
                    displayField: 'text',
                    url: 'cargarComboUbicacion',
                    node: _this.idDeposito,
                    _fn: function (r) {
                        _this.ubicaciones = r.childNodes;
                    },
                    allowBlank: false,
                    selectFn: function (_v) {
                        this.displayedText = _v.text;
                    }
                });
                Ext.apply(_this.lote.listaColumnas.getBy('dataIndex', 'descripcion'), {
                    editor: _this.lote.cbUbicacion,
                    renderer: function (_v, _mD, _r) {
                        _r.data.idubicacion = this.editor.getValue() || _r.data.idubicacion;
                        _r.data.descripcion = this.editor.getNodeText() || _v;
                        _r.data.esarea = this.editor.node.parentNode ? (this.editor.node.parentNode.attributes.id == 0 ? true : null) : _r.data.esarea;
                        return _r.data.descripcion;
                    }
                });
                _this.lote.insertToolbarButton(LOG.util.Prototipos.botonNuevo({
                    text: _this.idioma.lbBtnRedistribuir,
                    tooltip: _this.idioma.ttBtnRedistribuir,
                    iconCls: 'redistribucion',
                    scope: this,
                    handler: function () {
                        var record = {};
                        Ext.apply(record, _this.lote.getSmPrincipal().getSelected().data);
                        if (_this.lote.getSmPrincipal().getSelected().data.canthijos == undefined) {
                            _this.lote.getSmPrincipal().getSelected().data.canthijos = 1;
                        } else {
                            _this.lote.getSmPrincipal().getSelected().data.canthijos++;
                        }
                        Ext.apply(record, {
                            id: record.idubicacionlote + '-' + record.canthijos,
                            idubicacionlotepadre: record.idubicacionlote,
                            indexpadre: _this.lote.getStorePrincipal().indexOf(_this.lote.getSmPrincipal().getSelected()),
                            canthijos: 0,
                            idarea: null,
                            idareaproducto: null,
                            idarealote: null,
                            esarea: false,
                            idubicacion: null,
                            idubicacionproducto: null,
                            idubicacionlote: null,
                            descripcion: null,
                            cantidad: 0,
                            idubicacionloteViejo: record.idubicacionlote,
                            idubicacionproductoViejo: record.idubicacionproducto,
                            idarealoteViejo: record.idarealote,
                            idareaproductoViejo: record.idareaproducto
                        });
                        Ext.data.Record.id(record);
                        _this.lote.getStorePrincipal().add(new Ext.data.Record(record));
                    },
                    controlFn: function (b, _caller) {
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().data.indexpadre == undefined
                                    && this.getSelected().data.idubicacion == this.getSelected().data.idubicacionFija) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'wDividir');
                    }
                }), 0);
                _this.lote.insertToolbarButton(LOG.util.Prototipos.botonEliminar({
                    disabled: true,
                    tooltip: _this.idioma.ttBtnEliminarUbicacion,
                    handler: function () {
                        _this.lote.getStorePrincipal().getAt(_this.lote.getSmPrincipal().getSelected().data.indexpadre).data.canthijos--;
                        _this.lote.getStorePrincipal().remove(_this.lote.getSmPrincipal().getSelected());
                    },
                    controlFn: function (b, _caller) {
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && this.getSelected().data.indexpadre != undefined) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'wEliminarDiv');
                    }
                }), 1);
                _this.cantUbic = LOG.util.Prototipos.inputDecimal({enableKeyEvents: true});
                _this.lote.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                    header: _this.idioma.cgCantidad,
                    dataIndex: 'cantidad',
                    align: 'right',
                    width: 110,
                    editor: _this.cantUbic,
                    editable: true,
                    renderer: function (_v, _mD, _r) {
                        if (!_r.data.idubicacionFija && _r.data.indexpadre === undefined) {
                            _r.data.idubicacionFija = _r.data.idubicacion;
                        }
                        return _v;
                    },
                    default: true
                }));
                _this.panelInferior.add(_this.lote.view());
                _this.lote.getStorePrincipal().on({
                    load: function () {
                        this.modified = [];
                        this.commitChanges();
                        _this.btnSalvar.disable();
                    },
                    add: function () {
                        _this.btnSalvar.setDisabled(true);
                    },
                    remove: function (_st, _r) {
                        _st.modified.remove(_r);
                        _this.habilitarSalvar();
                    }
                });
                _this.lote.getGridPrincipal().on({
                    beforeedit: function (e) {
                        if (e.record.data.canthijos > 0) {
                            return false;
                        }
                        if (e.field == 'cantidad' && e.record.data.indexpadre === undefined) {
                            return false;
                        }
                        e.record.data.idubicacionOrigen = e.record.data.idubicacion;
                    },
                    afteredit: function (e) {
                        if (e.field == 'descripcion') {
                            if (!e.value) {
                                e.record.data.descripcion = e.originalValue;
                                e.grid.getView().refresh();
                                if (e.record.data.indexpadre === undefined && !e.record.data.canthijos) {
                                    e.record.reject();
                                }
                            } else if (e.record.data.indexpadre === undefined && !e.record.data.canthijos
                                && e.record.data.idubicacion == e.record.data.idubicacionFija) {
                                e.record.reject();
                                _this.lote.listaBotones.getItem(0).enable();
                            } else {
                                _this.lote.listaBotones.getItem(0).disable();
                            }
                            _this.lote.cbUbicacion.resetNode();
                            var error = false;
                            if (e.record.data.indexpadre !== undefined && (e.record.data.idubicacion == _this.lote.getStorePrincipal().getAt(e.record.data.indexpadre).data.idubicacion
                                || _this.existeLote(e.record.data.idlote, e.record.data.idubicacion, e.record.data.idubicacionlote))) {
                                error = true;
                                e.record.data.descripcion = e.originalValue;
                                e.record.data.idubicacion = e.record.data.idubicacionOrigen;
                                mostrarMensaje(3, _this.idioma.msgUbicacionesIguales);
                                e.grid.getView().refresh();
                            }
                            if (!error && e.record.data.indexpadre === undefined && _this.existeLote(e.record.data.idlote, e.record.data.idubicacion, e.record.data.idubicacionlote)) {
                                mostrarMensaje(2, _this.idioma.msgUnificar, function (btn) {
                                    if (btn == 'ok') {
                                        e.record.data.cantidad = _this.unificarLote(e.record);
                                    }
                                    if (btn == 'cancel') {
                                        e.record.data.descripcion = e.originalValue;
                                        e.record.data.idubicacion = e.record.data.idubicacionOrigen;
                                    }
                                    e.grid.getView().refresh();
                                });
                            }
                        }
                        if (e.field == 'cantidad') {
                            var cantOrigen = parseFloat(_this.lote.getStorePrincipal().getAt(e.record.data.indexpadre).data.cantidad);
                            var suma = _this.lote.modelo.getSumaCantidad(e.record.data.idubicacionlotepadre, 'idubicacionlotepadre');
                            var error = parseFloat(e.value) >= cantOrigen ? 1 : (suma >= cantOrigen ? 2 : 0);
                            if (error != 0) {
                                e.record.data.cantidad = e.originalValue || 0;
                                e.grid.getView().refresh();
                                mostrarMensaje(3, _this.idioma[error == 1 ? 'msgCantidadMayorOriginal' : 'msgSumaCantidadMayorOriginal']);
                            }
                        }
                        _this.habilitarSalvar();
                    }
                });

                _this.panelInferior.expand();
                if (typeof _fn == 'function') {
                    _fn.createDelegate().call();
                }
                LOG.util.UIManager.applyKey(_this.btnSalvar, _this.lote.getGridPrincipal());
            });
        } else {
            if (typeof _fn == 'function') {
                _fn.createDelegate().call();
            }
            _this.panelInferior.expand();
        }

    },
    habilitarSalvar: function () {
        var deshabilitar = this.lote.getStorePrincipal().getModifiedRecords().length == 0;
        Ext.each(this.lote.getStorePrincipal().getModifiedRecords(), function (item) {
            if (!item.data.idubicacion || !item.data.cantidad) {
                deshabilitar = true;
            }
        });
        this.btnSalvar.setDisabled(deshabilitar);
    },
    /**
     * Devuelve true si existe el lote.
     * @param {Numeric} idlote
     * @param {Numeric} idubicacion
     * @param {Numeric} idubicacionlote
     * @returns {Boolean}
     */
    existeLote: function (idlote, idubicacion, idubicacionlote) {
        var cant = 0;
        this.lote.getStorePrincipal().each(function (item) {
            if (((item.data.indexpadre === undefined && item.data.idubicacionlote != idubicacionlote)
                || (item.data.indexpadre !== undefined))
                && item.data.idlote == idlote && item.data.idubicacion == idubicacion) {
                cant++;
            }
        });
        return idubicacionlote && cant > 0 ? true : !idubicacionlote && cant > 1;
    },
    /**
     * Unifica el record pasado con el record que contenga la misma ubicaciÃ³n del lote y devuelve la cantidad resultante.
     * @param {Ext.Record} record
     * @returns {Integer}
     */
    unificarLote: function (record) {
        var nuevo = {};
        this.lote.getStorePrincipal().each(function (item) {
            if (((item.data.indexpadre === undefined && item.data.idubicacionlote != record.data.idubicacionlote))
                && item.data.idlote == record.data.idlote && item.data.idubicacion == record.data.idubicacion) {
                nuevo = item;
            }
        });
        Ext.apply(nuevo.data, {
            cantidad: parseFloat(record.data.cantidad),
            idubicacionloteViejo: record.data.idubicacionlote,
            idubicacionproductoViejo: record.data.idubicacionproducto,
            idarealoteViejo: record.data.idarealote,
            idareaproductoViejo: record.data.idareaproducto,
            unificar: true
        });
        this.lote.getStorePrincipal().remove(record);
        this.lote.getStorePrincipal().modified.remove(record);
        this.lote.getStorePrincipal().modified.push(nuevo);
        var _this = this;
        _this.modelo.redistribuirLotes(this.prepararDatos(), function () {
            _this.lote.getStorePrincipal().reload();
        });
        return nuevo.data.cantidad;
    },
    initLoteViewViejo: function (_fn) {
        var _this = this;
        if (this.lote == undefined) {
            LOG.lb.lote.Loader.init(function () {
                _this.lote = new LOG.lb.lote.View({
                    formaVisualizacion: 'panel',
                    panelSuperior: false,
                    gridEditable: true,
                    ubicacion: true,
                    iddeposito: _this.idDeposito,
                    sm: _this.getSmPrincipal(),
                    dirController: '/logistica/utiles/ubicacion/index.php/ubicacion',
                    urlBusquedaGridPrincipal: 'cargarlotes',
                    grantedAction: function (_p) {
                        return true;
                    }
                });

                _this.lote.init();
                _this.lote.insertToolbarButton(LOG.util.Prototipos.botonNuevo({
                    text: _this.idioma.lbBtnRedistribuir,
                    tooltip: _this.idioma.ttBtnRedistribuir,
                    scope: this,
                    handler: function () {
                        if (_this.lote.getGridPrincipal().getSelectionModel()) {
                            _this.lote.getGridPrincipal().getSelectionModel().getSelected().data.dividido = true;
                            var record = _this.lote.getGridPrincipal().getSelectionModel().getSelected();
                            var numLote = record.data.numero;
                            var rClon = record.copy();
                            rClon.data.padre = rClon.data.idubicacion;
                            rClon.data.posPadre = _this.lote.getStorePrincipal().indexOf(record);
                            rClon.data.dividido = false;
                            rClon.data.noDivisible = true;
                            rClon.data.disponible = null;
                            rClon.data.descripcion = null;
                            rClon.data.idareaproducto = null;
                            rClon.data.idarea = null;
                            rClon.data.idubicacion = null;
                            rClon.data.ubicada = null;
                            rClon.data.idubicacionproducto = null;
                            rClon.data.idubicacionlote = null;
                            var recNuevo = new Ext.data.Record();
                            recNuevo.data = rClon.data;
                            _this.lote.getStorePrincipal().add(recNuevo);
                            _this.lote.getStorePrincipal().data.items.forEach(function (elem, i) {
                                if (elem.data.numero == numLote && elem.data.padre == undefined) {
                                    _this.lote.getStorePrincipal().getAt(i).data.dividido = true;
                                }
                            });
                        }
                    },
                    controlFn: function (b, _caller) {
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && _caller.getGridPrincipal().getSelectionModel().getSelected() && _caller.getGridPrincipal().getSelectionModel().getSelected().data.noDivisible != true && _caller.getGridPrincipal().getSelectionModel().getSelected().data.editado != true) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'wDividir');
                    }
                }), 0);
                _this.lote.insertToolbarButton(LOG.util.Prototipos.botonEliminar({
                    disabled: true,
                    tooltip: _this.idioma.ttBtnEliminarUbicacion,
                    handler: function () {
                        var rec = _this.lote.getGridPrincipal().getSelectionModel().getSelected();
                        var padreEl = rec.data.padre;
                        var posPadre = rec.data.posPadre;
                        _this.lote.getStorePrincipal().remove(rec);
                        _this.lote.listaBotones.getItem(4).disable();
                        var cont = 0;
                        _this.lote.getStorePrincipal().data.items.forEach(function (elem) {
                            if (padreEl == elem.data.padre && elem.data.dividido == false) {
                                cont++;
                            }
                        });
                        if (cont == 0) {
                            _this.lote.getStorePrincipal().getAt(posPadre).data.dividido = false;
                            var numLote = _this.lote.getStorePrincipal().getAt(posPadre).data.numero;
                            _this.lote.getStorePrincipal().data.items.forEach(function (elem, i) {
                                if (elem.data.numero == numLote && elem.data.padre == undefined) {
                                    _this.lote.getStorePrincipal().getAt(i).data.dividido = false;
                                }
                            });
                        }
                    },
                    controlFn: function (b, _caller) {
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1 && _caller.getGridPrincipal().getSelectionModel().getSelected() && _caller.getGridPrincipal().getSelectionModel().getSelected().data.padre) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'wEliminarDiv');
                    }
                }), 1);
                _this.cantUbic = LOG.util.Prototipos.inputEntero({enableKeyEvents: true});
                _this.lote.addGridColumn({
                    header: _this.idioma.cgCantidad,
                    width: 100,
                    dataIndex: 'ubicada',
                    editor: _this.cantUbic,
                    editable: true,
                    default: true
                });
                _this.lote.addGridColumn({
                    header: _this.idioma.cgCantidadPorUbicar,
                    width: 120,
                    dataIndex: '',
                    autoExpand: true,
                    hidden: true,
                    default: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        return parseFloat(record.get('existencia')) - parseFloat(record.get('ubicada'));
                    }
                });
                _this.panelInferior.add(_this.lote.view());
                _this.lote.getStorePrincipal().on({
                    'load': function (st, records, opt) {
                        st.modified = [];
                        _this.lote.listaBotones.getItem(4).disable();
                        _this.btnSalvar.disable();
                    }
                });
                _this.lote.getGridPrincipal().on({
                    'afteredit': function (e) {

                        if (e.field == 'descripcion') {

                            if (_this.lote.getStorePrincipal().data.items[e.row].data.padre == e.record.data.idubicacion/*_this.lote.cbUbicacion.getValue()*/) {
                                mostrarMensaje(2, _this.idioma.msgUbicacionesIguales);
                                _this.lote.getStorePrincipal().data.items[e.row].reject();
                            } else if (e.record.data.idubicacion/*_this.lote.cbUbicacion.getValue()*/ != null) {
                                var cont = 0;
                                _this.lote.getStorePrincipal().data.items.forEach(function (elem) {

                                    if (e.record.data.numero == elem.data.numero && e.record.data.idubicacionlote != elem.data.idubicacionlote) {
                                        if (_this.lote.cbUbicacion.getValue() == elem.data.idubicacion) {
                                            cont++;
                                        }
                                    }
                                });

                                if (cont == 0) {

                                    // _this.lote.getStorePrincipal().data.items[e.row].data.idubicacion = _this.lote.cbUbicacion.getValue();
                                    //  _this.lote.getStorePrincipal().data.items[e.row].data.descripcion = _this.lote.cbUbicacion.value;

                                } else if (cont == 1 && typeof _this.lote.getStorePrincipal().data.items[e.row].data.padre == 'undefined') {

                                    mostrarMensaje(2, _this.idioma.msgUnificar, function (btn) {
                                        if (btn == 'ok') {
                                            _this.lote.getStorePrincipal().data.items[e.row].data.unificar = true;
                                            _this.modelo.redistribuirLotes(_this.prepararDatos(), function (r) {
                                                _this.lote.getStorePrincipal().reload();
                                            });
                                        } else {
                                            _this.lote.getStorePrincipal().load();
                                            // _this.lote.getStorePrincipal().data.items[e.row].reject();

                                            //  _this.lote.getStorePrincipal().data.items[e.row].data.idubicacion = null;
                                            e.record.data.editado = false;
                                            _this.lote.listaBotones.getItem(3).enable();
                                            if (_this.lote.storePrincipal.getModifiedRecords().length > 0) {
                                                _this.btnSalvar.enable();
                                            } else {
                                                _this.btnSalvar.disable();
                                            }
                                        }

                                    });
                                }
                            } else {
                                _this.lote.getStorePrincipal().data.items[e.row].reject();
                            }
                            if (_this.lote.storePrincipal.getModifiedRecords().length > 0) {
                                _this.btnSalvar.enable();
                            } else {
                                _this.btnSalvar.disable();
                            }
                            e.record.data.editado = true;
                        }
                        if (e.field == 'ubicada') {
                            var sumaH = 0;
                            var cantFinal = 0;
                            var m = false;
                            _this.lote.getStorePrincipal().data.items.forEach(function (elem, i) {
                                if (e.record.data.padre == elem.data.idubicacion) {
                                    cantFinal = elem.data.ubicada;
                                }
                                if (e.record.data.padre == elem.data.padre) {
                                    sumaH += elem.data.ubicada;
                                }
                            });
                            if (e.value < cantFinal) {
                                if (sumaH > cantFinal) {
                                    m = true;
                                    e.record.set('ubicada', "");
                                    e.record.commit();
                                }
                            } else {
                                m = true;
                                e.record.set('ubicada', "");
                                e.record.commit();
                            }
                            if (m) {
                                mostrarMensaje(2, _this.idioma.msgCantidadMayorOriginal);
                            }
                        }
                    },
                    'beforeedit': function (e) {
                        if (e.field == 'ubicada') {
                            if (!e.record.data.padre) {
                                e.cancel = true;
                            }
                        }
                        if (e.field == 'descripcion') {
                            _this.lote.listaBotones.getItem(3).disable();
                            if (e.record.data.dividido) {
                                e.cancel = true;
                            }
                        }
                    }
                });
                _this.panelInferior.expand();
                if (typeof _fn == 'function') {
                    _fn.createDelegate().call();
                }
            });
        } else {
            if (typeof _fn == 'function') {
                _fn.createDelegate().call();
            }
            _this.panelInferior.expand();
        }
    }
});