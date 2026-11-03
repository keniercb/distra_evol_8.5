Ext.ns('LOG.lb.maestroproductos');
LOG.lb.maestroproductos.View = Ext.extend(LOG.util.UITemplate, {
    modoSeleccion: 3,
    urlBusquedaGridPrincipal: 'cargarGridClasificador',
    idGridPrincipal: 'idindicador',
    busquedaBasica: true,
    textBusquedaSimple: LOG.lb.maestroproductos.Idioma.textBusquedaSimple,
    concepto: LOG.lb.maestroproductos.Idioma.lbConceptoBuscar,
    autoSelect: false,
    atributosDinamicos: false,
    /**
     * Identifica la region que se selecciona, 1 si selecciona un nodo del abrol
     * 2 si se selecciona una tupla del grid
     */
    regionSeleccionada: 1,
    /*
     * nodo seleccionado en el gridpanel o en el treepanel
     */
    selectedNode: null,
    /*
     *identifica el tipo de vista si es la de dos paneles o la de un panel
     *valores: 0 -> la interfaz esta en la vista de 2 paneles.
     *         1 -> la interfaz esta en la vista de 1 panel.
     */
    activeView: 0,
    arrCentroB: undefined,
    arrPlanD: undefined,
    /**
     * @param {Object} config
     */
    constructor: function (config) {
        var _this = this;
        config.idioma = LOG.util.UIManager.apply(LOG.lb.maestroproductos.Idioma, LOG.util.Idioma);
        this.modelo = new LOG.lb.maestroproductos.Model({
            idioma: LOG.lb.maestroproductos.Idioma
        });
        this.PanelEast = new LOG.lb.maestroproductos.PanelEast({
            content: _this
        });
        this.panelSurth = new LOG.lb.maestroproductos.PanelSur({
            content: _this
        });
        LOG.lb.maestroproductos.View.superclass.constructor.call(this, config);
        //LOG.lb.maestroproductos.superclass.constructor.call(this, config);
    },
    render: function (config) {
        var _view = LOG.lb.maestroproductos.View.superclass.render.call(this, config);
        var _this = this;

        this.getSmPrincipal().on({
            'rowselect': function (sm, index, record) {
                _this.regionSeleccionada = 2;
                _this.arbolProductos.getSelectionModel().clearSelections();
                if (_this.atributosDinamicos) {
                    _this.gestInterfazAtributDinamicos(true, record);
                }
            },
            'rowdeselect': function () {
                if (_this.atributosDinamicos) {
                    _this.gestInterfazAtributDinamicos(false);
                }
            }
        });

        //abortar ejecucion anterior  de ajax
        this.getStorePrincipal().fireEvent = this.getStorePrincipal().fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {
                var conn = _this.getGridPrincipal().getStore().proxy.getConnection();
                if (conn.isLoading()) {
                    conn.abort();
                }
            }
        });
        //fin abortar ejecucion anterior de ajax
        this.initVentanaGestion(1);
        _this.getSmPrincipal().on('rowselect', function (sm, index, r) {
            _this.filaAnterior = index;
        });
        return _view;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.lbEstado,
            width: 65,
            dataIndex: 'estado',
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmHabiltado + '"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmDeshabiltado + '"';
                }
                return '';
            },
            filter: {
                type: 'boolean',
                yesText: 'Habilitado',
                noText: 'Deshabilitado',
                dataIndex: 'estado'
            }
        });
        this.addGridColumn({
            header: this.idioma.lbTipo,
            width: 35,
            dataIndex: 'tipo',
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'log-producto';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmProducto + '"';
                } else {
                    metaData.css = 'log-servicio';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmServicio + '"';
                }
                return '';
            },
            filter: {
                type: 'list',
                options: [[1, _this.idioma.ttClmProducto], [2, _this.idioma.ttClmServicio]],
                dataIndex: 'tipo'
            }
        });
        this.addGridColumn({
            header: this.idioma.lbCodigo,
            width: 90,
            dataIndex: 'codigo',
            default: true,
            isFiltroBusqueda: true,
            sortable: true,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbCodigo,
                dataIndex: 'codigo'
            }
        });
        //if (planificacion == false) {
        this.addGridColumn({
            header: this.idioma.lbNroPieza,
            width: 130,
            dataIndex: 'codigoproveedor',
            default: true,
            isFiltroBusqueda: true,
            sortable: true,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbNroPieza,
                dataIndex: 'codigoproveedor'
            }
        });
        //}
        this.addGridColumn({
            header: 'Codigo de barra',
            dataIndex: 'codigobarra',
            width: 120,
            default: true,
            isFiltroBusqueda: true,
            sortable: true,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbcodbarra,
                dataIndex: 'codigobarra'
            }
        });
        this.addGridColumn({
            header: 'Codigo auxiliar',
            dataIndex: 'codigoauxiliar',
            width: 120,
            default: true,
            isFiltroBusqueda: true,
            sortable: true,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbcodaux,
                dataIndex: 'codigoauxiliar'
            }
        });
        this.addGridColumn({
            header: this.idioma.lbDenom,
            width: 300,
            dataIndex: 'denominacion',
            //autoExpand: true,
            isFiltroBusqueda: true,
            default: true,
            sortable: true,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbDenom,
                dataIndex: 'denominacion'
            }
        });
        //if (planificacion == false) {
        this.addGridColumn({
            header: this.idioma.lbMarca,
            width: 90,
            dataIndex: 'marca',
            default: true,
            sortable: true,
            filter: {
                type: 'combo',
                url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
                valueField: 'idmarca',
                displayField: 'denominacion',
                dataIndex: 'marca',
            }

        });
        //}
        this.addGridColumn({
            header: this.idioma.lbModelo,
            width: 90,
            dataIndex: 'modelo',
            default: true,
            sortable: true,
            filter: {
                type: 'combo',
                url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
                valueField: 'idmodelo',
                displayField: 'denominacion',
                dataIndex: 'modelo',
            }

        });
        this.addGridColumn({
            header: 'Elemento CUP',
            width: 140,
            dataIndex: 'elementogasto',
            //autoExpand: true,
            isFiltroBusqueda: true,
            default: true,
            sortable: true/*,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbDenom,
                dataIndex: 'denominacion'
            }*/
        });
        this.addGridColumn({
            header: 'Elemento CUC',
            width: 140,
            dataIndex: 'elementogasto',
            //autoExpand: true,
            isFiltroBusqueda: true,
            default: true,
            sortable: true/*,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbDenom,
                dataIndex: 'denominacion'
            }*/
        });

        if (planificacion) {
            this.addGridColumn({
                header: 'Aprobado',
                dataIndex: 'idaprobacion',
                width: 80,
                renderer: function (value, metaData) {
                    if (value == 3) {
                        metaData.css = 'icondistra-aprobar amarillo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmAprobarEsp + '"';
                    }
                    else if (value == 4) {
                        metaData.css = 'icondistra-aprobar verde';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmAprobarJefe + '"';
                    }
                    else {
                        metaData.css = 'icondistra-desaprobar rojo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmDesAprobar + '"';
                    }
                    return '';
                },
                filter: {
                    type: 'list',
                    options: [[1, 'No aprobado'], [3, 'Aprobado especialista'], [4, 'Aprobado rector']],
                    dataIndex: 'idaprobacion'
                }
            });
        }
        this.addGridColumn({
            header: this.idioma.lbUmedida,
            align: 'center',
            width: 50,
            dataIndex: 'umedida',
            filter: {
                type: 'combo',
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
                valueField: 'idunidadmedida',
                name: 'idumedida',
                displayField: 'abreviaturaunidadmedida',
                dataIndex: 'umedida'
            }
        });
        //modificado precio por precioplanif-> tabla nomindicadorplanif
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.lbPrecio,
            align: 'right',
            width: 80,
            // dataIndex: 'precioplanif',
            dataIndex: 'precio',
            filter: {
                type: 'numeric',
                // dataIndex: 'precioplanif'
                dataIndex: 'precio'
            }
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: 'Precio MC',
            align: 'right',
            width: 80,
            // dataIndex: 'precioplanif',
            dataIndex: 'precioalt',
            filter: {
                type: 'numeric',
                // dataIndex: 'precioplanif'
                dataIndex: 'precioalt'
            }
        }));
        if (planificacion == false) {
            this.addGridColumn({
                header: this.idioma.lbPais,
                width: 100,
                dataIndex: 'nacionalidad',
                filter: {
                    type: 'combo',
                    url: 'cargarPaises',
                    valueField: 'idpais',
                    displayField: 'nombrepais',
                    dataIndex: 'nacionalidad',
                }
            });
        }
        this.addGridColumn({
            header: this.idioma.lbNaturaleza,
            width: 100,
            dataIndex: 'naturaleza',
            filter: {
                type: 'combo',
                url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza&ninguna=1',
                valueField: 'idnaturaleza',
                displayField: 'denominacion',
                dataIndex: 'naturaleza',
            }
        });
        this.addGridColumn({
            header: 'Fabricante',
            width: 100,
            dataIndex: 'fabricante',
            filter: {
                type: 'combo',
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
                valueField: 'idclientesproveedores',
                displayField: 'nombre',
                dataIndex: 'fabricante',
            }
        });
        this.addGridColumn({
            header: this.idioma.lbInicio,
            width: 100,
            dataIndex: 'fechainicio',
        });
        this.addGridColumn({
            header: this.idioma.lbFin,
            width: 75,
            dataIndex: 'fechafin',
        });
        if (planificacion) {
            this.addGridColumn({
                header: 'Nivel de planificaci\xf3n',
                width: 75,
                dataIndex: 'nivelplanif',
                renderer: function (value, metaData) {
                    if (value == 1) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmPlanificarActivo + '"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmPlanificarNoActivo + '"';
                    }
                    return '';
                },
                filter: {
                    type: 'boolean',
                    yesText: 'Habilitado',
                    noText: 'No habilitado',
                    dataIndex: 'nivelplanif'
                }
            });
        }
        /*columnas nuevas para planificacion*/
        if (planificacion) {
            //centro de balance
            this.addGridColumn({
                header: 'Centro de balance',
                dataIndex: 'idcentrobalance',
                width: 220,
                renderer: function (v, md, r) {
                    var ids = v.split(",");
                    var result = "";
                    Ext.each(ids, function (id) {
                        Ext.each(_this.arrCentroB, function (rec) {
                            if (id == rec.id)
                                result += rec.denominacion + ", ";
                        })
                    });
                    return result.substring(0, result.length - 2) || v;
                },

                filter: {
                    type: 'combo',
                    url: 'cargarCentrosBalance',
                    valueField: 'identidaddatosnomenclador',
                    displayField: 'denominacion',
                    dataIndex: 'idcentrobalance'
                }
            });


            this.addGridColumn({
                header: 'Flete / Seguro',
                dataIndex: 'flete',
                width: 80,
                filter: {
                    type: 'numeric',
                    dataIndex: 'flete'
                }
            });
            this.addGridColumn({
                header: 'Contingencia',
                dataIndex: 'contingencia',
                width: 80,
                filter: {
                    type: 'numeric',
                    dataIndex: 'contingencia',
                }
            });
            this.addGridColumn({
                header: 'V\xeda de adquisici\xf3n',
                dataIndex: 'idviaadquisicion',
                width: 200,
                renderer: function (v, md, r) {
                    return r.json.denominacionadquisicion;
                },
                filter: {
                    type: 'combo',
                    url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomenclador?modelo=NomViaadquisicion&idnom=idviaadquisicion',
                    //congiguracion para cargar los de la entidad nada mas
                    //url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=NomViaadquisicion&idnom=idviaadquisicion',
                    valueField: 'idviaadquisicion',
                    displayField: 'denominacion',
                    dataIndex: 'idviaadquisicion'
                }
            });
            this.addGridColumn({
                header: '\xd3rgano que satisface',
                dataIndex: 'idorganosatisface',
                width: 200,
                renderer: function (v, md, r) {
                    return r.json.denominacionorganosatisface;
                },
                filter: {
                    type: 'combo',
                    url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomenclador?modelo=NomOrganosatisface&idnom=idorganosatisface',
                    //congiguracion para cargar los de la entidad nada mas
                    // url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=nomOrganosatisface&idnom=idorganosatisface',
                    valueField: 'idorganosatisface',
                    displayField: 'denominacion',
                    dataIndex: 'idorganosatisface'
                }
            });
            this.addGridColumn({
                header: 'Cobertura',
                dataIndex: 'cobertura',
                width: 85,
                filter: {
                    type: 'numeric',
                    dataIndex: 'cobertura'
                }
            });
            this.addGridColumn({
                header: 'Margen comercial',
                dataIndex: 'margencomercial',
                width: 120,
                filter: {
                    type: 'numeric',
                    dataIndex: 'margencomercial'
                }
            });
            //plan directo
            this.addGridColumn({
                header: 'Plan directo',
                dataIndex: 'plandirecto',
                width: 90,
                renderer: function (v, md, r) {
                    var ids = v.split(",");
                    var result = "";
                    Ext.each(ids, function (id) {
                        Ext.each(_this.arrPlanD, function (rec) {
                            if (id == rec.idmodelo)
                                result += rec.denominacion + ", ";
                        })
                    });
                    return result.substring(0, result.length - 2) || v;
                },
                filter: {
                    type: 'combo',
                    url: 'cargarPlanes',
                    valueField: 'idmodelo',
                    displayField: 'denominacion',
                    dataIndex: 'plandirecto'
                }
            });
            this.addGridColumn({
                header: 'Balanceable',
                dataIndex: 'balanceable',
                width: 80,
                renderer: function (value, metaData) {
                    if (value == 1) {
                        metaData.css = 'log-activo';
                    } else {
                        metaData.css = 'log-inactivo';
                    }
                    return '';
                },
                filter: {
                    type: 'boolean',
                    yesText: 'Balanceable',
                    noText: 'No Balanceable',
                    dataIndex: 'balanceable'
                }
            });
            this.addGridColumn({
                header: 'Creado por',
                dataIndex: 'idusuario',
                width: 80,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    _this.usuarios = store.reader.jsonData.usuarios;
                    return _this.getUsuarioById(value);
                }
            });

        }
        /*fin de columnas nuevas*/
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idformato'
        });
        this.addGridColumn({
            dataIndex: 'idpadre'
        });
        this.addGridColumn({
            dataIndex: 'idarbol'
        });
        this.addGridColumn({
            dataIndex: 'idtabla'
        });
        this.addGridColumn({
            dataIndex: 'idtablageneral'
        });
        this.addGridColumn({
            dataIndex: 'arridtablas'
        });
        this.addGridColumn({
            dataIndex: 'arridtablasgenerales'
        });
        this.addGridColumn({
            dataIndex: 'cobertura'
        });
        this.addGridColumn({
            dataIndex: 'contingencia'
        });
        this.addGridColumn({
            dataIndex: 'flete'
        });
        this.addGridColumn({
            dataIndex: 'precioventa'
        });
        this.addGridColumn({
            dataIndex: 'preciodivisa'
        });
        this.addGridColumn({
            dataIndex: 'margencomercial'
        });
        this.addGridColumn({
            dataIndex: 'balanceable'
        });
        this.addGridColumn({
            dataIndex: 'idorganosatisface'
        });
        this.addGridColumn({
            dataIndex: 'idfabricante'
        });
        this.addGridColumn({
            dataIndex: 'codigobarra'
        });
        this.addGridColumn({
            dataIndex: 'codigoauxiliar'
        });
    },
    getUsuarioById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.usuarios.length; i++) {
            if (_this.usuarios[i].idusuario == id) {
                return _this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    initDefaultButtons: function () {
        //Botones principales
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            isContextual: true,
            tooltip: this.idioma.ttAdicionarClasificacion,
            handler: function () {
                _this.initVentanaGestion(1);
                if (_this.activeView == 0) {
                    var node = _this.arbolProductos.getSelectedNode();
                    node.attributes.idpadre = node.attributes.idindicador;
                    node.id = null;
                    _this.winIndicador.setNode(node);
                    node.id = node.attributes.idindicador;
                    if (centrobalance) {
                        //_this.winIndicador.treeView.getLoader().baseParams.id = _this.arbolProductos.getSelectedNode().id;
                        _this.winIndicador.treeView.getLoader().load(_this.winIndicador.treeView.getRootNode(), function () {
                            _this.winIndicador.treeView.getRootNode().expand();
                            _this.winIndicador.treeView.getEl().unmask();
                        });
                    }
                } else {
                    var record = _this.treeGrid.getSelectionModel().getSelected();
                    record.json.idpadre = record.json.idindicador;
                    record.id = null;
                    _this.winIndicador.setRecord(record);

                    if (centrobalance) {
                        _this.winIndicador.treeView.getLoader().baseParams.id = _this.getSmPrincipal().getSelected().data.idindicador;
                        _this.winIndicador.treeView.getLoader().load(_this.winIndicador.treeView.getRootNode(), function () {
                            _this.winIndicador.treeView.getRootNode().expand();
                            _this.winIndicador.treeView.getEl().unmask();
                        });
                    }
                }
                _this.winIndicador.show();
            },
            controlFn: function (btn, caller) {
                if (caller.grantedAction('RAdicionar')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
                btn.disable();
                caller.arbolProductos.getSelectionModel().fireEvent = caller.arbolProductos.getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        btn.enable();
                        var node = caller.getElementoSeleccionado().nodo;
                        if (node.id != 0
                            && node.attributes
                            && node.attributes.activo == 0) {
                            btn.disable();
                        }
                    }
                }, caller.arbolProductos);

                caller.getSmPrincipal().fireEvent = caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        btn.disable();
                    }
                });
                caller.treeGrid.getSelectionModel().fireEvent = caller.treeGrid.getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        btn.disable();
                        if (caller.treeGrid.getSelectionModel().hasSelection()) {
                            var node = caller.treeGrid.getSelectionModel().getSelected();
                            if (node.json.maxlevel != node.json.nivel) {
                                btn.enable();
                            }
                        }
                    }
                    /*if (e == 'rowdeselect') {
                     btn.disable();
                     }*/
                });
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            isContextual: true,
            controlFn: this.defaultControlFn.createSequence(function (btn, caller) {
                if (caller.grantedAction('RModificar')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
            }),
            tooltip: this.idioma.ttModificarClasificacion,
            handler: function () {
                _this.initVentanaGestion(2);
                if (_this.activeView == 0) {
                    if (_this.isTreeSeleccionado()) {
                        _this.winIndicador.setNode(_this.arbolProductos.getSelectedNode());
                        _this.winIndicador.nivelSurtido = 0;
                        if (centrobalance) {
                            _this.winIndicador.treeView.getLoader().baseParams.id = _this.arbolProductos.getSelectedNode().id;
                            _this.winIndicador.treeView.getLoader().load(_this.winIndicador.treeView.getRootNode(), function () {
                                _this.winIndicador.treeView.getRootNode().expand();
                                _this.winIndicador.treeView.getEl().unmask();
                            });
                        }
                    } else {
                        _this.winIndicador.setRecord(_this.getSmPrincipal().getSelected());
                        _this.winIndicador.nivelSurtido = 1;

                        if (centrobalance) {
                            _this.winIndicador.treeView.getLoader().baseParams.id = _this.getSmPrincipal().getSelected().data.idindicador;
                            _this.winIndicador.treeView.getLoader().load(_this.winIndicador.treeView.getRootNode(), function () {
                                _this.winIndicador.treeView.getRootNode().expand();
                                _this.winIndicador.treeView.getEl().unmask();
                            });
                        }
                    }
                } else {
                    _this.winIndicador.setRecord(_this.treeGrid.getSelectionModel().getSelected());
                    _this.winIndicador.nivelSurtido = _this.treeGrid.getSelectionModel()
                        .getSelected().data._is_leaf == true ? 1 : 0;
                }
                _this.winIndicador.show();
            },
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonDuplicar({
            isContextual: true,
            controlFn: this.defaultControlFn.createSequence(function (btn, caller) {
                if (caller.grantedAction('RGESTI')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
            }),
            tooltip: this.idioma.ttModificarClasificacion,
            handler: function () {
                _this.initVentanaGestion(3);
                if (_this.activeView == 0) {
                    if (_this.isTreeSeleccionado()) {
                        var node = _this.arbolProductos.getSelectedNode();
                        node.attributes.id = node.attributes.idindicador = null;
                        if (node.attributes.idpadre == node.id)
                            node.attributes.idpadre = null;
                        node.id = null;
                        _this.winIndicador.setNode(node);
                    } else {
                        var record = _this.getSmPrincipal().getSelected();
                        record.id = record.json.id = record.json.idindicador = null;
                        record.json.nivelsurtido = 1;
                        _this.winIndicador.setRecord(record);
                    }
                } else {

                    var record = _this.treeGrid.getSelectionModel().getSelected();
                    record.id = record.json.id = record.json.idindicador = null;
                    _this.winIndicador.setRecord(_this.treeGrid.getSelectionModel().getSelected());
                }
                _this.winIndicador.show();
            },
        }));
        this.onGridDobleClick = function () {
            var b = _this.listaBotones.getItem(1);
            b.handler.call(b, b);
        };
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            isContextual: true,
            controlFn: this.defaultControlFn.createSequence(function (btn, caller) {
                if (caller.grantedAction('REliminar')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
            }),
            tooltip: this.idioma.ttElimClasificacion,
            handler: function () {
                var node = _this.getElementoSeleccionado().nodo;
                if (_this.activeView == 0) {
                    if (_this.isTreeSeleccionado()) {
                        var _parent = _this.arbolProductos.getParentNode(node);
                        _this.modelo.eliminar({
                            id: node.id
                        }, function () {
                            _this.arbolProductos.select(_parent);
                            var params = _this.getStorePrincipal().lastOptions ?
                                _this.getStorePrincipal().lastOptions.params : {};
                            params.node = _parent.id;
                            _this.getStorePrincipal().load(_parent);
                            _this.arbolProductos.getLoader().load(_parent);
                            _parent.collapse();
                            _parent.expand();
                        }, false);
                    } else {
                        _this.modelo.eliminar({});
                    }
                } else {
                    var parent = _this.treeGrid.getStore().getNodeParent(node);
                    _this.treeGrid.getStore().setActiveNode(parent);
                    _this.modelo.eliminar({
                        id: node.id
                    }, function () {
                        _this.treeGrid.getStore().load();
                    });
                }
            }
        }));
        this.addToolbarButton('-');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            isContextual: true,
            iconCls: 'habilitar',
            text: this.idioma.lbBtnHabiliar,
            tooltip: this.idioma.ttHabilClasificacion,
            handler: function () {
                if (_this.isTreeSeleccionado()) {
                    var node = _this.getElementoSeleccionado().nodo;
                    var _parent = _this.arbolProductos.getParentNode(node);
                    _this.getStorePrincipal().baseParams.node = _parent.id;
                    _this.modelo.habilitar({
                        id: node.id
                    }, function () {
                        _this.arbolProductos.select(_parent);
                        _this.arbolProductos.getLoader().load(_parent);
                        _parent.collapse();
                        _parent.expand();
                    });
                } else {
                    _this.modelo.habilitar({});
                }
            },
            controlFn: function (btn, caller) {
                if (caller.grantedAction('RGESTI')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
                btn.disable();
                LOG.util.UIManager.encadenaFn(caller.arbolProductos.getSelectionModel(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        btn.disable();
                        var node = caller.getElementoSeleccionado().nodo;
                        if (node.id != 0
                            && node.attributes
                            && node.attributes.estado == 0
                            /*&& node.attributes.idaprobacion == 1*/
                        ) {
                            btn.enable();
                        }
                    }
                });

                LOG.util.UIManager.encadenaFn(caller.getSmPrincipal(), 'fireEvent', function (e) {

                    if (e == 'selectionchange') {
                        if (caller.getSmPrincipal().hasSelection() && caller.getSmPrincipal().getSelected().data.estado == 0
                        /*&& caller.getSmPrincipal().getSelected().data.idaprobacion == 1*/) {

                            btn.enable();
                        } else {

                            btn.disable();
                        }
                    }
                }, 'habilitar');

                LOG.util.UIManager.encadenaFn(caller.treeGrid.getSelectionModel(), 'fireEvent', function (e) {
                    if (e == 'rowselect' && caller.treeGrid.getSelectionModel().getSelected().data.estado == 0
                    /*&& caller.treeGrid.getSelectionModel().getSelected().data.idaprobacion == 1*/) {
                        btn.enable();
                    }
                    if (e == 'rowdeselect') {
                        btn.disable();
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            isContextual: true,
            iconCls: 'deshabilitar',
            text: this.idioma.lbBtnDesHabiliar,
            tooltip: this.idioma.ttDesabilClasificacion,
            handler: function () {
                if (_this.isTreeSeleccionado()) {
                    var node = _this.getElementoSeleccionado().nodo;
                    var _parent = _this.arbolProductos.getParentNode(node);
                    _this.getStorePrincipal().baseParams.node = _parent.id;
                    _this.modelo.habilitar({
                        id: node.id,
                        deshabilitar: 1
                    }, function () {
                        _this.arbolProductos.select(_parent);
                        _this.arbolProductos.getLoader().load(_parent);
                        _parent.collapse();
                        _parent.expand();
                    });
                } else {
                    _this.modelo.habilitar({
                        deshabilitar: 1
                    });
                }
            },
            controlFn: function (btn, caller) {
                if (caller.grantedAction('RGESTI')) {
                    btn.setVisible(true);
                } else {
                    btn.setVisible(false);
                }
                btn.disable();
                LOG.util.UIManager.encadenaFn(caller.arbolProductos.getSelectionModel(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        btn.disable();
                        var node = caller.getElementoSeleccionado().nodo;
                        if (node.id != 0
                            && node.attributes
                            && node.attributes.estado == 1
                            && node.attributes.idaprobacion == 1
                        ) {

                            btn.enable();
                        }
                    }
                });
                LOG.util.UIManager.encadenaFn(caller.getSmPrincipal(), 'fireEvent', function (e) {

                    if (e == 'selectionchange') {

                        if (caller.getSmPrincipal().hasSelection() && caller.getSmPrincipal().getSelected().data.estado == 1
                            && caller.getSmPrincipal().getSelected().data.idaprobacion == 1) {

                            btn.enable();
                        } else {

                            btn.disable();
                        }
                    }

                });
                LOG.util.UIManager.encadenaFn(caller.treeGrid.getSelectionModel(), 'fireEvent', function (e) {
                    if (e == 'rowselect' && caller.treeGrid.getSelectionModel().getSelected().data.estado == 1
                        && caller.treeGrid.getSelectionModel().getSelected().data.idaprobacion == 1) {
                        btn.enable();
                    }
                    if (e == 'rowdeselect') {
                        btn.disable();
                    }
                });
            }
        }));
        if (planificacion) {
            this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
                tooltip: this.idioma.ttAprobClasificacion,
                menu: [
                    LOG.util.UIManager.createMenuItem({
                        text: 'Aprobar rector',
                        iconCls: 'aprobar-jefe',
                        handler: function () {
                            var _parent = {};
                            if (_this.isTreeSeleccionado()) {
                                _parent = _this.getElementoSeleccionado().nodo;
                            }
                            _this.modelo.aprobarIndicador({
                                nivel: 4, id: _parent.id, fn: function (r) {
                                }, filaAnterior: _this.filaAnterior
                            });
                        },
                        controlFn: function (btn, caller) {
                            if (caller.grantedAction('RAprobar')) {
                                btn.disable();
                                caller.arbolProductos.getSelectionModel().fireEvent = caller.arbolProductos.getSelectionModel().fireEvent.createSequence(function (e) {
                                    if (e == 'selectionchange') {
                                        var node = caller.getElementoSeleccionado().nodo;
                                        if (node.id != 0
                                            && node.attributes
                                            && node.attributes.estado == 1
                                            && (node.attributes.idaprobacion == 3 || node.attributes.idaprobacion == 1)) {
                                            btn.enable();
                                        }
                                        if (node.id == 0) {

                                            btn.disable();
                                        }
                                    }
                                }, caller.arbolProductos);

                                caller.getSmPrincipal().fireEvent = caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                                    if (e == 'rowselect' && caller.getSmPrincipal().getSelected().data.estado == 1) {
                                        var node = caller.getSmPrincipal().getSelected();
                                        if (node.data.idaprobacion == 3 || node.data.idaprobacion == 1) {
                                            btn.enable();
                                        }
                                    }
                                    if (e == 'rowdeselect') {
                                        btn.disable();
                                    }
                                });
                                caller.treeGrid.getSelectionModel().fireEvent = caller.treeGrid.getSelectionModel().fireEvent.createSequence(function (e) {
                                    if (e == 'rowselect' && caller.treeGrid.getSelectionModel().getSelected().data.estado == 1) {
                                        var node = caller.treeGrid.getSelectionModel().getSelected();
                                        if (node.data.idaprobacion == 3 || node.data.idaprobacion == 1) {
                                            btn.enable();
                                        }
                                    }
                                    if (e == 'rowdeselect') {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.hide();
                            }

                        }
                    }, true),
                    LOG.util.UIManager.createMenuItem({
                        text: 'Aprobar especialista',
                        iconCls: 'aprobar-especialista',
                        handler: function () {
                            var _parent = {};
                            if (_this.isTreeSeleccionado()) {
                                _parent = _this.getElementoSeleccionado().nodo;
                            }
                            _this.modelo.aprobarIndicador({
                                nivel: 3, id: _parent.id, fn: function (r) {
                                }, filaAnterior: _this.filaAnterior
                            });
                        },
                        controlFn: function (btn, caller) {
                            btn.disable();
                            caller.arbolProductos.getSelectionModel().fireEvent = caller.arbolProductos.getSelectionModel().fireEvent.createSequence(function (e) {
                                if (e == 'selectionchange') {
                                    var node = caller.getElementoSeleccionado().nodo;
                                    if (node.id != 0
                                        && node.attributes
                                        && node.attributes.estado == 1
                                        && node.attributes.idaprobacion == 1) {
                                        btn.enable();
                                    }
                                    if (node.id == 0) {
                                        btn.disable();
                                    }
                                }
                            }, caller.arbolProductos);

                            caller.getSmPrincipal().fireEvent = caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                                if (e == 'rowselect' && caller.getSmPrincipal().getSelected().data.estado == 1) {
                                    var node = caller.getSmPrincipal().getSelected();
                                    if (node.data.idaprobacion == 1) {
                                        btn.enable();
                                    }
                                }
                                if (e == 'rowdeselect') {
                                    btn.disable();
                                }
                            });
                            caller.treeGrid.getSelectionModel().fireEvent = caller.treeGrid.getSelectionModel().fireEvent.createSequence(function (e) {
                                if (e == 'rowselect' && caller.treeGrid.getSelectionModel().getSelected().data.estado == 1) {
                                    var node = caller.treeGrid.getSelectionModel().getSelected();
                                    if (node.data.idaprobacion == 1) {
                                        btn.enable();
                                    }
                                }
                                if (e == 'rowdeselect') {
                                    btn.disable();
                                }
                            });
                        }
                    }, true),
                    LOG.util.UIManager.createMenuItem({
                        text: 'Desaprobar',
                        iconCls: 'desaprobar',
                        handler: function () {
                            var _parent = {};
                            if (_this.isTreeSeleccionado()) {
                                _parent = _this.getElementoSeleccionado().nodo;
                            }
                            _this.modelo.aprobarIndicador({
                                nivel: 1, id: _parent.id, fn: function (r) {
                                }, filaAnterior: _this.filaAnterior
                            });
                        },
                        controlFn: function (btn, caller) {
                            btn.disable();
                            caller.arbolProductos.getSelectionModel().fireEvent = caller.arbolProductos.getSelectionModel().fireEvent.createSequence(function (e) {
                                if (e == 'selectionchange') {
                                    var node = caller.getElementoSeleccionado().nodo;
                                    if (node.id != 0
                                        && node.attributes
                                        && node.attributes.estado == 1
                                        && node.attributes.idaprobacion != 1) {
                                        btn.enable();
                                    }
                                    if (node.id == 0) {
                                        btn.disable();
                                    }
                                }
                            }, caller.arbolProductos);

                            caller.getSmPrincipal().fireEvent = caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                                if (e == 'rowselect' && caller.getSmPrincipal().getSelected().data.estado == 1) {
                                    var node = caller.getSmPrincipal().getSelected();
                                    if (node.data.idaprobacion != 1) {
                                        btn.enable();
                                    }
                                }
                                if (e == 'rowdeselect') {
                                    btn.disable();
                                }
                            });
                            caller.treeGrid.getSelectionModel().fireEvent = caller.treeGrid.getSelectionModel().fireEvent.createSequence(function (e) {
                                if (e == 'rowselect' && caller.treeGrid.getSelectionModel().getSelected().data.estado == 1) {
                                    var node = caller.treeGrid.getSelectionModel().getSelected();
                                    if (node.data.idaprobacion != 1) {
                                        btn.enable();
                                    }
                                }
                                if (e == 'rowdeselect') {
                                    btn.disable();
                                }
                            });
                        }
                    }, true)
                ],
                controlFn: function (btn, caller) {
                    if (caller.grantedAction('RGESTI')) {
                        btn.setVisible(true);
                    } else {
                        btn.setVisible(false);
                    }
                }
            }));
        }

        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: 'Listado de indicadores',
                    isList: true,
                    name: 'IndicadorModelo',
                    dirReport: '/distra/datosmaestros/indicadores/',
                    handler: _this.onTriggerReport.createDelegate(this)
                }),
                new Ext.menu.Item({
                    text: 'Exportar',
                    isList: false,
                    handler: function () {
                        Ext.getBody().mask('Exportando datos');
                        Ext.Ajax.request({
                            timeout: 18000000,
                            url: '../exportarimportar/exportarNomenclador',
                            params: {
                                idespecialidad: _this.idEspecialidad ? _this.idEspecialidad : null
                            },
                            callback: function (opt, scs, resp) {
                                Ext.getBody().unmask();
                                var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                                var respData = Ext.decode(resp.responseText);
                                window.open(respData.url, 'ventana', wCfg);
                            }
                        });
                    },
                    controlFn: function (btn, caller) {
                        if (caller.grantedAction('RImprimir')) {
                            btn.setVisible(true);
                        } else {
                            btn.setVisible(false);
                        }
                    }
                })
            ],

        }));
        this.btnImportarExcel = LOG.util.UIManager.createMenuItem({
            text: 'Importar excel',
            tooltip: 'Importar productos desde un fichero excel',
            iconCls: 'importar',
            isContextual: true,
            //disabled: true,
            handler: function () {
                //var _this = this;
                //console.info(_this)
                var win = new LOG.lb.importar.View({
                    class: 'MaestroProductoModel',
                    fn: function (r) {
                        _this.getStorePrincipal().load();
                        if (r.error /*|| parseInt(r.total) > parseInt(r.cantidad*/) {
                            _this.mostrarError(

                                /* (/*!r.error ? _this.idioma.msjErrorImportar : */((r.error == 1 ? _this.idioma.msjErrorTarjeta : _this.idioma.msjErrorValoresNoValidos)),

                                (!r.error /*&& parseInt(r.total) > parseInt(r.cantidad)*/)
                            );
                        }

                    }
                });
                win.show();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RImportar')) {
                    b.setVisible(true);
                    b.enable();
                } else {
                    b.setVisible(false);
                    b.disable();
                }
            }
        });

        this.btnImportarCVS = LOG.util.UIManager.createMenuItem({
            text: 'Importar fichero csv',
            tooltip: 'Importar productos desde un fichero csv',
            iconCls: 'importar',
            isContextual: true,
            //disabled: true,
            handler: function () {
                //var _this = this;
                //console.info(_this)
                var win = new LOG.lb.importar.View({
                    class: 'MaestroProductoModel',
                    params: {ftp: 1, formato: 'csv', delimiter: ';'},
                    fn: function (r) {
                        _this.getStorePrincipal().load();
                        let errorcodif = null;
                        if (Array.isArray(r.error)) {
                            errorcodif = r.error
                        }
                        if (r.error/*|| parseInt(r.total) > parseInt(r.cantidad*/) {
                            _this.mostrarError(
                                _this.idioma.msjErrorValoresNoValidos,
                                (!r.error /*&& parseInt(r.total) > parseInt(r.cantidad)*/),
                                1, errorcodif
                            );
                        }

                    }
                });
                win.show();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RImportarCSV')) {
                    b.setVisible(true);
                    b.enable();
                } else {
                    b.setVisible(false);
                    b.disable();
                }
            }
        });
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Importar',
            iconCls: 'importar',
            menu: [this.btnImportarExcel, this.btnImportarCVS]
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnFactorConversion,
            tooltip: this.idioma.ttBtnFactorConversion,
            disabled: true,
            iconCls: 'unidadmedida',
            handler: function () {
                var convertidoUM = new LOG.lb.maestroproductos.ConvertirUM({
                    idioma: _this.idioma,
                    idindicador: _this.getSmPrincipal().getSelected().data.idindicador,
                    idumedida: _this.getSmPrincipal().getSelected().json.idumedida,
                    umedida: _this.getSmPrincipal().getSelected().json.umedida
                });
                convertidoUM.init();
                convertidoUM.view();
            },
            controlFn: function (b, _caller) {
                if (/*_caller.grantedAction('CT') ||*/ _caller.grantedAction('RFConversion')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'convertir');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: LOG.lb.maestroproductos.Especialidad.Idioma.lbCompartimentacion,
            tooltip: LOG.lb.maestroproductos.Especialidad.Idioma.ttCompartimentacion,
            iconCls: 'compartimentacion',
            handler: function () {
                var compartimentacionUI = new LOG.lb.maestroproductos.CompartimentacionEspecialidad({});
                compartimentacionUI.show();
            },
            controlFn: function (b, _caller) {
                if (/*_caller.grantedAction('CT') ||*/_caller.grantedAction('RFCompartimentacion')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));


		this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Generar codigos de barra',
            tooltip: 'Genera codigo de barra a los que no lo tienen segun el estandar seleccionado',
            iconCls: 'compartimentacion',
            handler: function () {
                let win = _this.crearVentanaSeleccionEstandarCodigobarras();
				win.on({
					aceptar: function (idestandarcodigobarra) {
						Ext.MessageBox.wait('', _this.idioma.msgEspere || '...');
						Ext.Ajax.request({
							url: 'generarCodigoBarrasGeneral',
							method: 'POST',
							scope: this,
							params: {
								idestandarcodigobarra: idestandarcodigobarra
							},
							callback: function(options, success, response)
							{
								Ext.MessageBox.hide();
								var responseData = Ext.decode(response.responseText);
								if (responseData.codigoMsg === 1) {
									mostrarMensaje(1, responseData.msg);
								} else {
									mostrarMensaje(1, responseData.msg);
								}
								win.close();
							}
						});
					}
				});
				win.show();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RFGenerarCodigoBarrasGeneral')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));

        /*boton dia cero*/
        if (planificacion == true) {
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: LOG.lb.maestroproductos.Especialidad.Idioma.lbdaycero,
                tooltip: LOG.lb.maestroproductos.Especialidad.Idioma.ttdaycero,
                iconCls: 'compartimentacion',
                handler: function () {
                    Ext.getBody().mask();
                    var simple = new Ext.FormPanel({
                        labelWidth: 75,
                        frame: true,
                        region: 'center',
                        title: 'Dia cero',
                        bodyStyle: 'padding:5px 5px 0',
                        defaults: { width: 180 },
                        defaultType: 'textfield',
                        items: [{
                            fieldLabel: 'Coeficiente',
                            name: 'first',
                            id: 'first',
                            maskRe: /^\d*$/,
                            allowBlank: false
                        }],
                        buttons: [{
                            iconCls: 'cancelar',
                            text: 'Cancelar',
                            tooltip: LOG.util.Idioma.ttBtnCancelar,
                            handler: function () {
                                win.destroy(this);
                                Ext.getBody().unmask();
                            }
                        }, {
                            iconCls: 'aceptar',
                            text: 'Aceptar',
                            tooltip: LOG.util.Idioma.ttBtnAceptar,
                            handler: function (parametros) {
                                win.hide(this);
                                Ext.getBody().unmask();
                                _this.getGridPrincipal().getEl().mask('Cargando...', 'x-mask-loading');
                                Ext.Ajax.request({
                                    url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/DayCero',
                                    method: 'POST',
                                    params: {
                                        coeficiente: Ext.getCmp('first').getValue()
                                    },
                                    callback: function (opt, success, response) {
                                        if (success) {
                                            win.destroy(this);
                                            _this.getGridPrincipal().getEl().unmask();
                                            _this.getStorePrincipal().reload();

                                        }
                                    }
                                });
                            }
                        }]
                    });
                    var win = new Ext.Window({
                        width: 300,
                        height: 150,
                        layout: 'border',
                        items: [simple]
                    });
                    win.show(this);
                },
                controlFn: function (b, _caller) {
                    if (/*_caller.grantedAction('CT') ||*/ _caller.grantedAction('RFDaycero')) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                }
            }));
        }
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'btnayudamaestroproductos',
            referencia: '/configuracion/maestroproductos/index.php/maestroproductos/maestroproductos'
        }));
    },
    onTriggerReport: function (btn) {
        var _this = this;
        this.control = new LOG.util.Report({
            reports: [
                {
                    name: btn.name,
                    isList: btn.isList,
                    params: {
                        idespecialidad: _this.idEspecialidad ? _this.idEspecialidad : null,
                        criterio: _this.gridFilter.tfBusqueda.getValue() ? _this.gridFilter.tfBusqueda.getValue() : null,
                        idpadre: (this.activeView == 0 && this.arbolProductos.getSelectedNode() && this.arbolProductos.getSelectedNode().id && this.arbolProductos.getSelectedNode().id != '0') ?
                            this.arbolProductos.getSelectedNode().id
                            : null,
                        idusuario: idUsuario ? idUsuario : null
                    },
                    dirReport: btn.dirReport + btn.name,
                    browserAdvanz: {}
                }
            ]
        });
        this.control.view();
    },
    initVentanaGestion: function (modo) {
        if (!this.winIndicador) {
            var _this = this;
            this.winIndicador = new LOG.lb.maestroproductos.WinGestIndicador({
                idioma: this.idioma,
                parentUI: this,
                modelo: this.modelo,
                postSaveFn: function (r) {
                    _this.winIndicador.adqquisicion = new Array();
                    _this.winIndicador.idindic = r.idindicador;
                    var node = _this.getElementoSeleccionado().nodo;
                    if (_this.activeView == 0) {
                        if (_this.isTreeSeleccionado()) {
                            _this.winIndicador.treeView.getLoader().on({
                                scope: this,
                                beforeload: function (treeloader, node) {
                                    //this.treemask = new Ext.LoadMask(_this.winIndicador.treeView.getEl());
                                    //this.treemask.show();
                                    treeloader.baseParams.id = r.idindicador;
                                }/*,
                                    load: function(treeloader, node, reponse) {
                                        node.expand();
                                        this.treemask.hide();
                                    }*/
                            }
                            );

                            _this.winIndicador.treeView.getLoader().load(_this.winIndicador.treeView.getRootNode(), function () {
                                _this.winIndicador.treeView.getRootNode().expand();
                                _this.winIndicador.treeView.getEl().unmask();
                            });

                            if (_this.winIndicador.tipo == 1) {
                                _this.arbolProductos.loadNode(node);
                            } else {
                                _this.arbolProductos.loadNode(_this.arbolProductos.getParentNode(node));
                            }

                            //_this.winIndicador.treeView.getLoader().baseParams.id = _this.arbolProductos.getSelectedNode().id;

                            /*_this.winIndicador.treeView.getLoader().on({
                                scope: this, beforeload: function(loader, r) {
                                    _this.winIndicador.treeView.getLoader().baseParams.id = r.idindicador;
                                    _this.winIndicador.treeView.getEl().mask("Loading", 'x-mask-loading');
                                }
                            });*/
                            /*_this.winIndicador.treeView.getLoader().load({node: _this.treeView.getRootNode(), id: r.idindicador}, function () {
                                _this.winIndicador.treeView.getRootNode().expand();
                                _this.winIndicador.treeView.getEl().unmask();
                            });*/
                        }
                    } else {
                        if (_this.winIndicador.tipo != 1 || node.data._is_leaf == 1) {
                            _this.treeGrid.getStore().setActiveNode(_this.treeGrid.getStore().getNodeParent(node));
                        } else {
                            _this.treeGrid.getStore().setActiveNode(node);
                        }
                        _this.treeGrid.getStore().load();
                    }
                }/*,
                closeFn: function () {
                    var record = _this.getSmPrincipal().getSelected();
                    record.id = record.data.id;
                    record.json.nivelsurtido = 1;
                    _this.winIndicador.setRecord(record);

                }*/
            });
        }
        this.winIndicador.setMode(modo);
    },
    init: function () {
        LOG.lb.maestroproductos.View.superclass.init.call(this);
        var _this = this;
        if (_this.atributosDinamicos) {
            _this.panelContentPanelEast = new LOG.util.Panel({
                region: 'east',
                width: 300,
                collapsed: true,
                collapsible: true,
                layout: 'fit',
                items: [this.PanelEast],
                listeners: {
                    "expand": function () {
                        var nodo = _this.getElementoSeleccionado();
                        if (nodo && nodo.nodo) {
                            _this.gestInterfazAtributDinamicos(true, nodo.nodo);
                            // _this.panelSurth.doLayout();
                        }
                    }
                }
            });
            this.panelPrincipal.add(_this.panelContentPanelEast);
            _this.panelContentPanelSurth = new LOG.util.Panel({
                region: 'south',
                collapsible: true,
                collapsed: true,
                height: 300,
                layout: 'fit',
                items: [this.panelSurth],
                listeners: {
                    "expand": function () {
                        var nodo = _this.getElementoSeleccionado();
                        if (nodo && nodo.nodo) {
                            _this.gestInterfazAtributDinamicos(true, nodo.nodo);
                        }
                    }
                }
            });
            this.panelPrincipal.add(_this.panelContentPanelSurth);
        }

        this.arbolProductos = new LOG.lb.maestroproductos.ArbolProductos({
            parentContainer: this.getPanelGrid(),
            parentUI: this
        });
        this.arbolProductos.init();
    },
    mostrarError: function (msg, diferencia, csv, errorcodif) {
        var _this = this;
        Ext.MessageBox.show({
            title: 'Error',
            msg: msg,
            csv: csv,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR,
            fn: function () {
                var win = new LOG.lb.maestroproductos.Error({ idioma: _this.idioma, diferencia: diferencia, csv: csv, errorcodif: errorcodif });
                win.init();
                win.view();
            }
        });
    },
    updateSelectedSelectedNode: function () {
        var _this = this;
        var elemento = null;
        var seleccion = _this.getElementoSeleccionado();
        if (seleccion.nodo != null) {
            elemento = seleccion.nodo.attributes || seleccion.nodo.data;
            elemento.id = elemento.idindicador;
            _this.selectedNode = {
                data: elemento
            };
        } else {
            _this.selectedNode = null;
        }
    },
    getElementoSeleccionado: function () {
        if (this.activeView == 0) {
            if (this.regionSeleccionada == 1) {
                return {
                    nodo: this.arbolProductos.getSelectedNode(),
                    cmp: this.arbolProductos
                }
            } else {
                if (this.getSmPrincipal().hasSelection()) {
                    return {
                        nodo: this.getSmPrincipal().getSelected(),
                        cmp: this.getGridPrincipal()
                    }
                }
            }
        }
        else {
            return {
                nodo: this.treeGrid.getSelectionModel().getSelected(),
                cmp: this.treeGrid
            }
        }
    },
    isTreeSeleccionado: function () {
        return this.regionSeleccionada == 1;
    },
    defaultControlFn: function (btn, caller) {
        btn.disable();
        LOG.util.UIManager.encadenaFn(caller.arbolProductos.getSelectionModel(), 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                btn.disable();
                var node = caller.getElementoSeleccionado().nodo;
                if (node.id != 0
                    && node.attributes
                    && node.attributes.activo == 1
                    && ((node.attributes.idaprobacion == 1 && planificacion) || !planificacion)) {
                    btn.enable();
                }
            }
        });

        LOG.util.UIManager.encadenaFn(caller.getSmPrincipal(), 'fireEvent', function (e) {
            if (e == 'rowselect'
                && caller.getSmPrincipal().getSelected().data.estado == 1
                && ((caller.getSmPrincipal().getSelected().data.idaprobacion == 1 && planificacion) || !planificacion)) {
                btn.enable();
            }
            if (e == 'rowdeselect') {
                btn.disable();
            }
        });//resuelto
        LOG.util.UIManager.encadenaFn(caller.treeGrid.getSelectionModel(), 'fireEvent', function (e) {
            if (e == 'rowselect'
                && caller.treeGrid.getSelectionModel().getSelected().data.estado == 1
                && ((caller.treeGrid.getSelectionModel().getSelected().data.idaprobacion == 1 && planificacion) || !planificacion)) {
                btn.enable();
            }
            if (e == 'rowdeselect') {
                btn.disable();
            }
        });
    },
    toggleEnableButtons: function () {
        this.listaBotones.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.listaMenu.each(function (m) {
            if (typeof m.controlFn == 'function') {
                m.controlFn.createDelegate(this, [m, this]).call();
            }
        }.createDelegate(this));
    },
    getPanelContenido: function () {
        var _this = this;
        this.treeGrid = new LOG.lb.maestroproductos.TreeGridView({
            urlBusquedaGridPrincipal: 'cargarGridIndicadoresVistaUnaColumna',
            //urlBusquedaGridPrincipal: 'cargarGridClasificador',
            region: 'center',
            content: this,
            arrCentroB: this.arrCentroB,
            arrPlanD: this.arrPlanD,


        });
        if (this.busquedaBasica) {
            LOG.util.UIManager.initFilterGrid(this.treeGrid, this.textBusquedaSimple);
        }
        var vista;
        var vistagrid;
        this.panelConetnido = LOG.util.UIManager.initPanel({
            layout: 'card',
            region: 'center',
            activeItem: 0,
            items: [vistagrid = this.panelGrid, vista = LOG.util.UIManager.initPanel({
                layout: 'border',
                items: [this.treeGrid]
            })]
        });
        //para llamarlo desde la modelo la linea
        this.modelo.setStTreeGrid(_this.treeGrid.getStore());
        //para llamarlo desde la modelo la linea
        this.modelo.setSMTreeGrid(_this.treeGrid.getSelectionModel());
        vistagrid.on({
            'show': function () {
                _this.modelo.setVista(0);
            }
        });
        vista.on({
            'show': function () {
                _this.treeGrid.getStore().load({ params: {/*start: 0, limit: 5*/ } });
                _this.modelo.setVista(_this.treeGrid.activeView);
            }
        });
        return this.panelConetnido;
    },
    getselectedNode: function () {
        return this.selectedNode;
    },
    gestInterfazAtributDinamicos: function (select, nodo) {
        if (!this.atributosDinamicos) {
            return;
        }
        var _this = this;
        var elemento = null;
        if (select) {
            elemento = nodo.attributes || nodo.data;
            elemento.id = elemento.idindicador;
            _this.selectedNode = {
                data: elemento
            };
            if (_this.PanelEast.controlView == 0) {
                _this.panelSurth.loadAtribDinamicos(false);
            } else {
                if (!_this.PanelEast.panelTreeAgrupaciones.cargando) {
                    _this.PanelEast.panelTreeAgrupaciones.getLoader().baseParams.idindicador = (_this.selectedNode.data.idindicador) ? _this.selectedNode.data.id : null;
                    _this.PanelEast.panelTreeAgrupaciones.getLoader().baseParams.arridtablas = (_this.selectedNode.data.idindicador) ? _this.selectedNode.data.arridtablas : null;
                    _this.PanelEast.panelTreeAgrupaciones.getLoader().baseParams.arridtablasgenerales = (_this.selectedNode.data.idindicador) ? _this.selectedNode.data.arridtablasgenerales : null;

                    _this.PanelEast.panelTreeAgrupaciones.getLoader().load(_this.PanelEast.panelTreeAgrupaciones.getRootNode(), function () {
                        _this.PanelEast.panelTreeAgrupaciones.getRootNode().expand();
                    });
                }
                _this.PanelEast.loadAtriDinamicospropertygrid();
                if (_this.selectedNode.data.idindicador != null) {
                    _this.PanelEast.panelTreeAgrupaciones.btnAsociar.enable();
                } else {
                    _this.PanelEast.panelTreeAgrupaciones.btnAsociar.disable();
                }
            }
        } else {
            _this.selectedNode = null;
            if (_this.PanelEast.controlView == 0) {
                _this.panelSurth.gridAtribDinamicos.btnAdicionar.disable();
            } else {
                _this.PanelEast.panelTreeAgrupaciones.btnAsociar.disable();
            }
        }
    },
    setDataNodoSeleccionadoGrid: function (columna, newValor) {
        this.getSmPrincipal().getSelected().set(columna, newValor);
    },
    setDataNodoSeleccionadoTreeGrid: function (columna, newValor) {
        this.treeGrid.getSelectionModel().getSelected().set(columna, newValor);
    },
    setCentroBalance: function (arrCB) {
        this.arrCentroB = arrCB;
    },
    //plan driecto
    setPlanDirecto: function (arrPD) {
        this.arrPlanD = arrPD;
    },
	crearVentanaSeleccionEstandarCodigobarras: function () {
        // let me = this;

        let btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: 'Cancelar',
            handler: function () {
                winForm.close();
            }
        });

        let btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            scope: this,
            handler: function () {
                if (cbEstandarCodigoBarras.getValue()) {
                    winForm.fireEvent('aceptar', cbEstandarCodigoBarras.getValue());
                }
            }
        });

        let cbEstandarCodigoBarras = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/estandarcodigobarras/cargarEstandaresCodigoBarra',
            name: 'idestandarcodigobarra',
            valueField: 'idestandarcodigobarra',
            autoLoad: true,
            autoSelect: false,
            displayField: 'denominacion',
            descField: 'desc',
            fieldLabel: 'Estandar',
            selectOnFocus: true,
            forceSelection: true,
            mode: 'local',
            anchor: '100%',
            // minChars: 0,
            listWidth: 300,
            //pageSize: 20,
            isCombo: true
        });

        let form = new Ext.FormPanel({
            // labelWidth: 50,
            // labelAlign: 'top',
            //region: 'center',
            autoHeight: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            layout: 'form',
            items: [
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            // style: 'margin: 0 0 0 5',
                            items: [cbEstandarCodigoBarras]
                        }
                    ]
                }
            ]
        });

        let winForm = new Ext.Window({
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.30,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            layout: 'fit',
            buttons: [btnCancelar, btnAceptar],
            items: [form]
        });
        winForm.addEvents('aceptar');
        return winForm;
    },
});

LOG.lb.maestroproductos.TreeGridView = Ext.extend(Ext.ux.maximgb.GridPanel, {
    arrCentroB: undefined,
    arrPlanD: undefined,
    activeView: 1,
    initComponentPreOverride: function () {
        var _this = this;
        var listaColumnas = new LOG.util.List();
        /*listaColumnas.add({
         dataIndex: '_id',
         type: 'int'
         });
         listaColumnas.add({
         dataIndex: 'id'
         });
         listaColumnas.add({
         dataIndex: '_level',
         type: 'int'
         });
         listaColumnas.add({
         dataIndex: '_lft',
         type: 'int'
         });*/
        listaColumnas.add({
            dataIndex: '_parent',
            type: 'int'
        });
        /* listaColumnas.add({
         dataIndex: '_rgt',
         type: 'int'
         });
         listaColumnas.add({
         dataIndex: '_is_leaf',
         type: 'bool'
         });*/
        listaColumnas.add({
            dataIndex: 'nivel'
        });
        listaColumnas.add({
            dataIndex: 'maxlevel'
        });
        listaColumnas.add({
            dataIndex: 'idindicador'
        });
        listaColumnas.add({
            dataIndex: 'idumedida'
        });
        listaColumnas.add({
            dataIndex: 'idnaturaleza'
        });
        listaColumnas.add({
            dataIndex: 'idtabla'
        });
        listaColumnas.add({
            dataIndex: 'idtablageneral'
        });
        listaColumnas.add({
            dataIndex: 'arridtablas'
        });
        listaColumnas.add({
            dataIndex: 'arridtablasgenerales'
        });
        listaColumnas.add({
            header: 'C\xf3digo',
            dataIndex: 'codigo',
            width: 140,
            default: true,
            autoExpand: true,
            filter: {
                type: 'string',
                emptyText: 'C\xf3digo',
                dataIndex: 'codigo'
            }
        });
        if (planificacion == false) {
            //numero de piezas
            listaColumnas.add({
                header: 'N\xFAmero de pieza',
                dataIndex: 'numeropieza',
                width: 90,
                filter: {
                    type: 'numeric',
                    dataIndex: 'numeropieza'
                }
            });
        }
        listaColumnas.add({
            header: 'Denominaci\xf3n',
            dataIndex: 'denominacion',
            isFiltroBusqueda: true,
            sortable: true,
            width: 320,
            default: true,
            filter: {
                type: 'string',
                emptyText: 'Denominaci\xf3n',
                dataIndex: 'denominacion'
            }
        });
        listaColumnas.add({
            header: 'UM',
            dataIndex: 'umedida',
            width: 50,
            filter: {
                type: 'combo',
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
                valueField: 'idunidadmedida',
                name: 'idumedida',
                displayField: 'abreviaturaunidadmedida',
                dataIndex: 'umedida'
            }
        });
        //centro de balance
        listaColumnas.add({
            header: 'Centro de balance',
            dataIndex: 'idcentrobalance',
            width: 220,
            renderer: function (v, md, r) {
                var ids = v.split(",");
                var result = "";
                Ext.each(ids, function (id) {
                    Ext.each(_this.arrCentroB, function (rec) {
                        if (id == rec.id)
                            result += rec.denominacion + ", ";
                    })
                });
                return result.substring(0, result.length - 2) || v;
            },

            filter: {
                type: 'combo',
                url: 'cargarCentrosBalance',
                valueField: 'identidaddatosnomenclador',
                displayField: 'denominacion',
                dataIndex: 'idcentrobalance'
            }
        });
        listaColumnas.add({
            header: 'Naturaleza',
            dataIndex: 'naturaleza',
            width: 100,
            filter: {
                type: 'combo',
                url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza',
                valueField: 'idnaturaleza',
                displayField: 'denominacion',
                dataIndex: 'naturaleza'
            }
        });
        if (planificacion == false) {
            listaColumnas.add({
                header: 'Nacionalidad',
                width: 100,
                dataIndex: 'nacionalidad',
                filter: {
                    type: 'combo',
                    url: 'cargarPaises',
                    valueField: 'idpais',
                    displayField: 'nombrepais',
                    dataIndex: 'nacionalidad'
                }
            });
        }
        listaColumnas.add({
            header: 'Flete / Seguro',
            dataIndex: 'flete',
            width: 80,
            filter: {
                type: 'numeric',
                dataIndex: 'flete'
            }
        });
        listaColumnas.add({
            header: 'Contingencia',
            dataIndex: 'contingencia',
            width: 80,
            filter: {
                type: 'numeric',
                dataIndex: 'contingencia',
            }
        });
        listaColumnas.add({
            header: 'Precio',
            dataIndex: 'precio',
            width: 80,
            filter: {
                type: 'numeric',
                dataIndex: 'precio'
            }
        });
        listaColumnas.add({
            header: 'Precio de venta',
            dataIndex: 'precioventa',
            width: 90,
            filter: {
                type: 'numeric',
                dataIndex: 'precioventa'
            }
        });
        listaColumnas.add({
            header: 'Precio divisa',
            dataIndex: 'preciodivisa',
            width: 90,
            filter: {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }
        });
        listaColumnas.add({
            header: 'Nivel',
            dataIndex: 'dnivel',
            width: 90,
            filter: {
                type: 'list',
                options: [
                    [1, 'GENERICO'],
                    [2, 'SUB GENERICO'],
                    [3, 'ESPECIFICO'],
                    [4, 'SURTIDO'],
                ],
                field: 'nivel',
                dataIndex: 'nivel'
            }
        });
        //new
        listaColumnas.add({
            header: 'V\xeda de adquisici\xf3n',
            dataIndex: 'idviaadquisicion',
            width: 200,
            renderer: function (v, md, r) {
                return r.json.denominacionadquisicion;
            },
            filter: {
                type: 'combo',
                url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomenclador?modelo=NomViaadquisicion&idnom=idviaadquisicion',
                //congiguracion para cargar los de la entidad nada mas
                //url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=NomViaadquisicion&idnom=idviaadquisicion',
                valueField: 'idviaadquisicion',
                displayField: 'denominacion',
                dataIndex: 'idviaadquisicion'
            }
        });
        listaColumnas.add({
            header: '\xd3rgano que satisface',
            dataIndex: 'idorganosatisface',
            width: 200,
            renderer: function (v, md, r) {
                return r.json.denominacionorganosatisface;
            },
            filter: {
                type: 'combo',
                url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomenclador?modelo=NomOrganosatisface&idnom=idorganosatisface',
                //congiguracion para cargar los de la entidad nada mas
                // url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=nomOrganosatisface&idnom=idorganosatisface',
                valueField: 'idorganosatisface',
                displayField: 'denominacion',
                dataIndex: 'idorganosatisface'
            }
        });
        listaColumnas.add({
            header: 'Cobertura',
            dataIndex: 'cobertura',
            width: 85,
            filter: {
                type: 'numeric',
                dataIndex: 'cobertura'
            }
        });
        listaColumnas.add({
            header: 'Margen comercial',
            dataIndex: 'margencomercial',
            width: 120,
            filter: {
                type: 'numeric',
                dataIndex: 'margencomercial'
            }
        });
        //plan directo
        listaColumnas.add({
            header: 'Plan directo',
            dataIndex: 'plandirecto',
            width: 90,
            renderer: function (v, md, r) {
                var ids = v.split(",");
                var result = "";
                Ext.each(ids, function (id) {
                    Ext.each(_this.arrPlanD, function (rec) {
                        if (id == rec.idmodelo)
                            result += rec.denominacion + ", ";
                    })
                });
                return result.substring(0, result.length - 2) || v;
            },
            filter: {
                type: 'combo',
                url: 'cargarPlanes',
                valueField: 'idmodelo',
                displayField: 'denominacion',
                dataIndex: 'plandirecto'
            }
        });
        listaColumnas.add({
            header: 'Habilitado',
            width: 65,
            dataIndex: 'estado',
            default: true,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'log-estado';
                } else {
                    metaData.css = 'log-inactivo';
                }
                return '';
            },
            filter: {
                type: 'boolean',
                yesText: 'Habilitado',
                noText: 'Deshabilitado',
                dataIndex: 'estado'
            }
        });
        listaColumnas.add({
            header: 'Balanceable',
            dataIndex: 'balanceable',
            width: 80,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'log-estado';
                } else {
                    metaData.css = 'log-inactivo';
                }
                return '';
            },
            filter: {
                type: 'boolean',
                yesText: 'Balanceable',
                noText: 'No Balanceable',
                dataIndex: 'balanceable'
            }
        });

        listaColumnas.add({
            header: 'Nivel de planificaci\xf3n',
            dataIndex: 'nivelplanif',
            width: 130,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'log-activo';
                } else {
                    metaData.css = 'log-inactivo';
                }
            }
        });
        listaColumnas.add({
            header: 'Aprobado',
            dataIndex: 'idaprobacion',
            width: 80,
            renderer: function (value, metaData) {
                if (value == 3) {
                    metaData.css = 'aprobar-especialista';
                }
                else if (value == 4) {
                    metaData.css = 'aprobar-jefe';
                }
                else {
                    metaData.css = 'desaprobar';
                }
                return '';
            },
            filter: {
                type: 'list',
                options: [
                    [1, 'No aprobado'],
                    [3, 'Aprobado especialista'],
                    [4, 'Aprobado rector']
                ],
                dataIndex: 'idaprobacion'
            }
        });
        var _columns = LOG.util.UIManager.proccessColumns(listaColumnas);
        this._columns = _columns.columns;
        var recStGridPrincipal = Ext.data.Record.create(_columns.fields);

        var cfgStore = {
            url: this.urlBusquedaGridPrincipal,
            reader: new Ext.data.JsonReader({
                id: this.idGridPrincipal,
                totalProperty: 'cantidad',
                root: 'datos',
                successProperty: 'success'
            }, recStGridPrincipal)
        };
        this._store = new Ext.ux.maximgb.NestedSetStore(cfgStore);
        this._store.on({
            'beforeload': function (st, opt) {
                if (opt.add !== true) {
                    opt.params.anode = null;
                }
                if (opt.add == true && st.baseParams.criterio != null) {
                    opt.params.anode = null;
                    opt.add = false;
                    st.active_node = null;
                }
                if (st.filtrado == false) {
                    st.baseParams.criterio = null
                }
            }
        });
        this._sm = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                'rowselect': function (sm, index, record) {
                    _this.content.gestInterfazAtributDinamicos(true, record);
                },
                'rowdeselect': function () {
                    _this.content.gestInterfazAtributDinamicos(false);
                }
            }
        });
        var cfg = LOG.util.UIManager.configureGrid(this._columns, this._store, this._sm, {});
        var gridFilter = new Ext.ux.grid.GridFilters({
            local: false,
            encode: true,
            filters: cfg.filtros
        });
        Ext.apply(this, {
            columns: this._columns,
            store: this._store,
            sm: this._sm,
            loadMask: {
                store: this._store
            },
            plugins: [gridFilter],
            tbar: [],
            master_column_id: 'idExpandGrid',
            bbar: cfg.bbar = new Ext.PagingToolbar({
                pageSize: 30,
                store: this._store,
                displayInfo: true
            })
        });
        //new Ext.ux.maximgb.PagingToolbar({
        //    store: this._store,
        //    displayInfo: true,
        //    pageSize: 30
        //})
        //});

    },

    initComponentPostOverride: function () {

    }
});


LOG.lb.maestroproductos.ConvertirUM = Ext.extend(LOG.util.UITemplate, {
    /**
     * Direccion de la clase controladora.
     * @type String
     */
    dirController: '/logistica/utiles/maestroproductos/index.php/maestroproductos',
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarFactorConversion',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        LOG.lb.maestroproductos.ConvertirUM.superclass.constructor.call(this, config);
        this.getVistaPrincipal().setSize(500, 400);
        this.getVistaPrincipal().setTitle(this.idioma.tlFactorConversion + ': ' + this.umedida);
        this.modelo = new LOG.lb.maestroproductos.ConvertirUM.Model({
            idioma: this.idioma
        });
    },
    /**
     * Inicializa los componentes.
     * @returns {undefined}
     */
    init: function () {
        LOG.lb.maestroproductos.ConvertirUM.superclass.init.call(this);
        this.panelDatos();
    },
    /**
     * Inicializa los botones del panel superior.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: this.idioma.ttBtnEliminar,
            handler: function () {
                _this.modelo.eliminar();
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'btnEliminar');
            }
        }));
        Ext.apply(this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({}, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        this.addGridColumn({ dataIndex: 'idfactorconversion' });
        this.addGridColumn({ dataIndex: 'idindicador' });
        this.addGridColumn({ dataIndex: 'idunidadmedida' });
        this.addGridColumn({
            header: this.idioma.gcUM,
            dataIndex: 'abreviaturaunidadmedida',
            width: 120,
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcFactorConversion,
            dataIndex: 'factorconversion',
            width: 130,
            align: 'right',
            default: true
        }));
    },
    /**
     * Renderiza los componente y reprograma los eventos.
     * @returns {Vista principal}
     */
    render: function () {
        var render = LOG.lb.maestroproductos.ConvertirUM.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            beforeload: function () {
                this.initBaseParams.idindicador = _this.modelo.idindicador = _this.idindicador;
            },
            load: function () {
                _this.cbUM.fireEvent('expand', _this.cbUM);
            }
        });
        return render;
    },
    /**
     * Inicializa los componentes de entrada de datos.
     * @returns {undefined}
     */
    panelDatos: function () {
        var _this = this;
        this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function () {
            _this.formFields = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            _this.cbUM = new LOG.util.ComboBox({
                fieldLabel: _this.idioma.lbCbUM,
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
                hiddenName: 'idunidadmedida',
                valueField: 'idunidadmedida',
                displayField: 'abreviaturaunidadmedida',
                selectOnlyLeaf: true,
                allowBlank: false,
                listeners: {
                    expand: function () {
                        this.getStore().filterBy(function (item) {
                            var index = _this.getStorePrincipal().find('idunidadmedida', item.data.idunidadmedida);
                            return item.data.idunidadmedida != _this.idumedida && index == -1;
                        });
                    }
                }
            });
            _this.cbUM.getStore().on({
                load: function () {
                    this.filterBy(function (item) {
                        return item.data.idunidadmedida != _this.idumedida;
                    });
                    _this.cbUM.fireEvent('expand', _this.cbUM);
                    _this.getStorePrincipal().load();
                }
            });
            _this.formFields.addComponent(_this.cbUM);
            _this.formFields.addComponent(LOG.util.Prototipos.inputDecimal({
                fieldLabel: _this.idioma.lbNfFactorConversion,
                name: 'factorconversion',
                allowBlank: false,
                enableKeyEvents: true
            }));
            _this.btnGuardar = LOG.util.Prototipos.botonGuardar({
                tooltip: _this.idioma.ttBtnGuardar,
                handler: function () {
                    _this.modelo.salvar({}, function (r) {
                        _this.fPanel.getForm().reset();
                        _this.modelo.reset();
                        _this.modelo.idindicador = _this.idindicador;
                    });
                }
            });
            _this.fPanel = LOG.util.UIManager.initForm({
                frame: true,
                items: [_this.formFields],
                region: 'center',
                buttons: [
                    LOG.util.Prototipos.botonNuevo({
                        tooltip: _this.idioma.ttBtnNuevo,
                        handler: function () {
                            _this.fPanel.getForm().reset();
                            _this.modelo.reset();
                            _this.modelo.idindicador = _this.idindicador;
                        }
                    }),
                    _this.btnGuardar
                ]
            });
            _this.modelo.bindForm(_this.fPanel);
            _this.modelo.addActionButton(_this.btnGuardar);
            _this.getPanelSuperior().add(_this.fPanel);
            _this.getPanelSuperior().autoHeight = true;
        });
    }
});


LOG.lb.maestroproductos.ConvertirUM.Model = Ext.extend(LOG.util.Model, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        config.urlController = '/logistica/utiles/maestroproductos/index.php/maestroproductos/';
        config.urlAccionGuardar = 'adicionarFactorConversion';
        config.urlAccionEliminar = 'eliminarFactorConversion';
        config.fields = [
            {
                name: 'idfactorconversion',
                primary: true
            },
            { name: 'idindicador' },
            { name: 'idunidadmedida' },
            { name: 'factorconversion' }
        ];
        LOG.lb.maestroproductos.ConvertirUM.Model.superclass.constructor.call(this, config);
    },
    /**
     *
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    salvar: function (parametros, _fn, _fnFail, msgMostrar) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoFConversion, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(objSubmit.data || this.encode());

            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardar,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, msgMostrar || this.idioma.lbMsgFConversionSalvado);
                            if (this.st) {
                                this.st.reload();
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        if (typeof _fnFail == 'function') {
                            _fnFail.createDelegate(this, [resp]).call();
                        }
                    }
                    this.setDefaulFormValues();
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    },

    /**
     *
     * @param {Object} parametros
     * @param {function} _fn
     * @param {Boolean} loadStore
     * @returns {undefined}
     */
    eliminar: function (parametros, _fn, loadStore) {
        var _this = this;
        if (!this.sm.hasSelection() && !parametros.id) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgDeleteFConversion, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoFConversion, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.id) ? Ext.encode([objSubmit.id]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgFConversionEliminado);
                                loadStore = loadStore || true;
                                if (loadStore) {
                                    this.st.reload({
                                        //                                        params : {
                                        //                                            start : 0
                                        //                                        }
                                    });
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },

});
LOG.lb.maestroproductos.Error = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/utiles/maestroproductos/index.php/maestroproductos',
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarProductoError',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.urlBusquedaGridPrincipal = 'cargarProductoError';
        this.autoLoad = false;
        this.autoSelect = false;
        LOG.lb.maestroproductos.Error.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlError;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({ dataIndex: 'idimpproducto' });
        /*this.addGridColumn({
           header: this.idioma.gcNro,
            width: 30,
            dataIndex: 'nrodoc',
            align: 'right',
            default: true
        });*/
        this.addGridColumn({
            header: this.idioma.gcCodigo,
            width: 80,
            dataIndex: 'codigoproducto',
            renderer: function (_v) {
                return _v || 'Sin c\xf3digo';
            },

            default: true
        });
        this.addGridColumn({
            header: 'Error',
            width: 80,
            dataIndex: 'error',
            agrupador: true,
            renderer: function (_v) {
                return _this.getErrorById(_v);
            }
        });
        if (/*_this.csv*/ true) {
            this.addGridColumn({
                header: this.idioma.gcCodigo+ ' de barra',
                width: 80,
                dataIndex: 'codigobarra',
                renderer: function (_v) {
                    return _v || 'Sin c\xf3digo';
                },

                default: true
            });
        }
        this.addGridColumn({
            header: this.idioma.gcDenominacion,
            autoExpand: true,
            dataIndex: 'denominacionproducto',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcUM,
            width: 40,
            dataIndex: 'um',
            default: true
        });
        if (!_this.csv) {
            this.addGridColumn({
                header: this.idioma.gcNaturaleza,
                width: 40,
                dataIndex: 'naturaleza',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcTipo,
                width: 40,
                dataIndex: 'tipo',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcAlmacenamiento,
                width: 40,
                dataIndex: 'almacenamiento',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcUtil,
                width: 40,
                dataIndex: 'utiloherramienta',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcFormaAlmacenamiento,
                width: 40,
                dataIndex: 'formaalmacenamiento',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcGrupo,
                width: 40,
                dataIndex: 'grupo',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcMarca,
                width: 40,
                dataIndex: 'marca',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcModelo,
                width: 40,
                dataIndex: 'modelo',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcElementogasto,
                width: 40,
                dataIndex: 'elementogasto',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcElementogastoAlt,
                width: 40,
                dataIndex: 'elementogastoalternativo',
                default: true
            });
        }

    },
    initDefaultButtons: function () {
        var _this = this;
        let isCimex = LOG.util.isVariableGlobalActiva('VG_ISCIMEX');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'exportar',
            text: 'Exportar',
            tooltip: 'Exportar fichero excel',
            handler: function () {
                let wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                window.open(`exportarError?csv=${_this.csv}`, 'ventana', wCfg);
                //_this.model.exportar();
            }
        }));

        if (isCimex) {
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'modificar',
                text: 'Generar codigo de barra',
                tooltip: 'Generar codigo de barra y volver a importar',
                handler: function () {
                    let win = _this.crearVentanaSeleccionEstandarCodigobarras();
                    win.on('aceptar', function (idestandarcodigobarra) {
                        _this.generarCodigoBarrasProductoError.call(_this, idestandarcodigobarra);
                        win.close();
                    });
                    win.show();
                }
            }));
        }

    },
    render: function () {
        var _this = this;
        var render = LOG.lb.maestroproductos.Error.superclass.render.call(this);
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
            beforeload: function () {
                this.baseParams.diferencia = this.initBaseParams.diferencia = _this.diferencia || null;
                this.baseParams.csv = this.initBaseParams.csv = _this.csv || null;
                this.baseParams.errorcodif = this.initBaseParams.errorcodif = Ext.encode(_this.errorcodif) || null;
            },
            load: function () {
                this.each(function (p, index) {
                    console.info(p.json)
                    if (p.json.codigoproducto) {
                        if (/*p.json.duplicado = false ||*/p.json.codigoproducto == null /*|| p.json.vacio == null*/) {

                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 2)).addClass('fila-verde');
                        } else {
                            if (_this.csv) {
                                if (p.json.error == 1) {
                                    Ext.fly(_this.getGridPrincipal().getView().getCell(index, 2)).addClass('fila-roja');
                                } else if (p.json.error == 2) {
                                    Ext.fly(_this.getGridPrincipal().getView().getCell(index, 3)).addClass('fila-naranja');
                                } else if (p.json.error == 3) {
                                    Ext.fly(_this.getGridPrincipal().getView().getCell(index, 2)).addClass('fila-verde');
                                } else if (p.json.error == 4) {
                                    Ext.fly(_this.getGridPrincipal().getView().getCell(index, 2)).addClass('fila-azul');
                                }
                            } else {
                                if (p.json.error == 1) {
                                    Ext.fly(_this.getGridPrincipal().getView().getCell(index, 2)).addClass('fila-roja');
                                }
                            }
                        }

                    }
                    if (p.json.codigoproducto == null) {
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index, 3)).addClass('fila-verde');
                    }

                });
            }
        });
        this.getStorePrincipal().load();
        // this.getVistaPrincipal().closeFn = function () {
        //     Ext.Ajax.request({
        //         url: 'eliminarImportar',
        //         method: 'POST',
        //         //  params: {iddocumento: _this.iddocumento}
        //     });
        // };
        return render;
    },
    mostrarError: function (msg, diferencia,csv) {
        var _this = this;
        Ext.MessageBox.show({
            title: 'Error',
            msg: msg,
            csv: csv,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR,
            fn: function () {
                var win = new LOG.lb.maestroproductos.Error({ idioma: _this.idioma, diferencia: diferencia,csv: csv });
                win.init();
                win.view();
            }
        });
    },
    getLeyenda: function () {
        return {
            autoWidth: true,
            autoHeight: true,
            tpl: new Ext.XTemplate(
                '<div class="leyend-block">',
                '<h3>' + this.idioma.lbTipoError + '</h3>',
                '<ul>',
                /* '<li style="color:#00CC33;">' + this.idioma.gcCodigoVacio + '</li>',*/
                '<li style="color:green;">' + this.idioma.gcCodigoVacio + '</li>',
                '<li style="color:red;">' + this.idioma.lbProductoRepetido + '</li>',
                '<li style="color:orange;">' + this.idioma.lbProductoBarraRepetido + '</li>',
                '<li style="color:blue;">' + this.idioma.lbProductoCaracterEspecial + '</li>',
                '</ul>',
                '</div>'
            )
        };
    },
    getErrorById: function (error) {
        const msgErrorDefault = '?';
        const msgError = {
            '1': 'Producto repetido',
            '2': 'C\xf3digo de barra repetido',
            '3': 'C\xf3digo vacio',
            '4': 'Caracteres especiales',
            '7': 'C\xf3digo de barra vacio',
            '8': 'Tamaño no permitido del c\xf3digo de barra',
            '9': 'Codigo de chequeo incorrecto del c\xf3digo de barra',
            '10': 'C\xf3digo de barra con caracteres no numericos',
        };
        return msgError[error] || msgErrorDefault;
    },
    crearVentanaSeleccionEstandarCodigobarras: function () {
        // let me = this;

        let btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: 'Cancelar',
            handler: function () {
                winForm.close();
            }
        });

        let btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            scope: this,
            handler: function () {
                if (cbEstandarCodigoBarras.getValue()) {
                    winForm.fireEvent('aceptar', cbEstandarCodigoBarras.getValue());
                }
            }
        });

        let cbEstandarCodigoBarras = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/estandarcodigobarras/cargarEstandaresCodigoBarra',
            name: 'idestandarcodigobarra',
            valueField: 'idestandarcodigobarra',
            autoLoad: true,
            autoSelect: false,
            displayField: 'denominacion',
            descField: 'desc',
            fieldLabel: 'Estandar',
            selectOnFocus: true,
            forceSelection: true,
            mode: 'local',
            anchor: '100%',
            // minChars: 0,
            listWidth: 300,
            //pageSize: 20,
            isCombo: true
        });

        let form = new Ext.FormPanel({
            // labelWidth: 50,
            // labelAlign: 'top',
            //region: 'center',
            autoHeight: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            layout: 'form',
            items: [
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            // style: 'margin: 0 0 0 5',
                            items: [cbEstandarCodigoBarras]
                        }
                    ]
                }
            ]
        });

        let winForm = new Ext.Window({
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.30,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            layout: 'fit',
            buttons: [btnCancelar, btnAceptar],
            items: [form]
        });
        winForm.addEvents('aceptar');
        return winForm;
    },
    generarCodigoBarrasProductoError: function (idestandarcodigobarra) {
        Ext.Ajax.request({
            url: 'generarCodigoBarrasProductoError',
            method: 'POST',
            scope: this,
            params: {
                idestandarcodigobarra: idestandarcodigobarra
            },
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codigoMsg === 1) {
                    mostrarMensaje(1, responseData.msg);
                    this.vistaPrincipal.close();
                } else {
                    mostrarMensaje(1, responseData.msg);
                    this.getStorePrincipal().load();
                }
            }
        });
    }

});