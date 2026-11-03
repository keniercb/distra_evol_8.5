Ext.ns('LOG.lb.maestroproductos');

LOG.lb.maestroproductos.PanelEast = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        _this.region = 'east';
        _this.activeItem = 0;
        _this.layout = 'card';
        _this.width = 300;
        _this.controlView = 0;
        _this.btnChangeView = LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: 'Atributos agrupados',
            isContextual: true,
            tooltip: 'Cambiar la forma de visualización de los atributos dinámicos.',
            handler: function() {
                if (_this.controlView == 0) {
                    _this.btnChangeView.setText('Atributos no agrupados');
                    _this.getLayout().setActiveItem(1);
                    _this.content.panelSurth.getLayout().setActiveItem(1);
                    _this.content.panelSurth.propertyGridAtribDinamicos.getStore().removeAll();
                    _this.content.panelSurth.propertyGridAtribDinamicos.btnGuardar.disable();
                    _this.controlView = 1;
                    var select = _this.content.getElementoSeleccionado();
                    if (select.nodo) {
                        _this.content.gestInterfazAtributDinamicos(true, select.nodo);
                    } else {
                        _this.content.gestInterfazAtributDinamicos(false);
                    }
                    return;
                } else {
                    _this.btnChangeView.setText('Atributos agrupados');
                    _this.getLayout().setActiveItem(0);
                    _this.content.panelSurth.getLayout().setActiveItem(0);
                    _this.controlView = 0;
                    _this.content.panelSurth.gridAtribDinamicos.getStore().removeAll();
                    _this.propertyGridAtribDinamicos.getStore().removeAll();
                    _this.propertyGridAtribDinamicos.btnGuardar.disable();
                    var select = _this.content.getElementoSeleccionado();
                    if (select.nodo) {
                        _this.content.gestInterfazAtributDinamicos(true, select.nodo);
                    } else {
                        _this.content.gestInterfazAtributDinamicos(false);
                    }
                    return;
                }
            }
        });
        this.tbar = ['->', _this.btnChangeView];
        _this.panel1raCara = new Ext.Panel({
            title: 'Valores de los atributos',
            border: false,
            bodyBorder: false,
            layout: 'fit'
        });
        _this.panel2daCara = new Ext.Panel({
            title: 'Agrupaciones de atributos din&aacute;micos',
            border: false,
            bodyBorder: false,
            layout: 'fit'
        });
        _this.buildtreeAgrupaciones();
        _this.buildProperygrid();
        _this.items = [_this.panel1raCara, _this.panel2daCara];
        LOG.lb.maestroproductos.PanelEast.superclass.constructor.apply(this, arguments);
    },
    buildProperygrid: function() {
        var _this = this;
        _this.propertyGridAtribDinamicos = new Ext.erp.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            globalDefault: true,
            editable: true,
            listeners: {
                'show': function(propertyGrid) {
                    _this.panel1raCara.add(propertyGrid);
                    _this.panel1raCara.doLayout(true);
                    _this.doLayout(true);
                },
                'mouseover': function() {
                    _this.blockHotKeys = true;
                },
                'mouseout': function() {
                    _this.blockHotKeys = false;
                }
            },
            preOperacion: function() {
                var dataRecord = _this.content.selectedNode;
                this.llavesForaneas = Array();
                this.llavesForaneas.push({
                    key: 'idindicador',
                    value: dataRecord.data.id
                });
                this.idtabla = dataRecord.data.idtabla;
                this.idtablageneral = dataRecord.data.idtablageneral;
                this.ar_where = 'idindicador = ' + dataRecord.data.id;
                this.id = dataRecord.data.id;
            }
        });
    },
    buildtreeAgrupaciones: function() {
        var _this = this;
        _this.panelTreeAgrupaciones = new Ext.erp.treedeagrupaciones({
            border: true,
            bodyBorder: false,
            mostrarTbar: false,
            concheck: true,
            useTbarExterno: true,
            llamadaExterna: true,
            region: 'center',
            content: _this.content,
            width: 250,
            autoScroll: true,
            listeners: {
                'show': function(tree) {
                    _this.panel2daCara.add(tree);
                    _this.panel2daCara.doLayout(true);
                    _this.doLayout(true);
                }
            }, /**
             *  Función ha ejecutarse tras asociar un nuevo atributo dinámico
             */
            postAsociar: function(idtabla, columna) {
                if (idtabla) {
                    _this.content.panelSurth.actualizarIdTabla(idtabla, columna, function() {
                        _this.loadAtriDinamicospropertygrid();
                    });
                } else {
                    var select = _this.content.getElementoSeleccionado();
                    if (_this.content.activeView == 0) {
                        if (_this.content.regionSeleccionada == 1) {
                            var _parent = _this.content.arbolProductos.getParentNode(select.nodo);
                            _this.content.arbolProductos.select(_parent);
                            _this.content.arbolProductos.getLoader().load(_parent);
                            _this.content.gestInterfazAtributDinamicos(false);
                            _this.content.arbolProductos.getRootNode().expand();
                        } else {
                            select.cmp.getStore().load({
                                callback: function() {
                                    if (select.cmp.getSelectionModel().hasSelection()) {
                                        _this.content.gestInterfazAtributDinamicos(true, select.cmp.getSelectionModel().getSelected());
                                    } else {
                                        _this.content.gestInterfazAtributDinamicos(false);
                                    }
                                }
                            });
                        }
                    } else {
                        _this.content.treeGrid.getStore().load({
                            callback: function() {
                                if (select.cmp.getSelectionModel().hasSelection()) {
                                    _this.content.gestInterfazAtributDinamicos(true, select.cmp.getSelectionModel().getSelected());
                                } else {
                                    _this.content.gestInterfazAtributDinamicos(false);
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    loadAtriDinamicospropertygrid: function() {
        var _this = this;
        if (_this.content.panelSurth.propertyGridAtribDinamicos) {
            var data = _this.content.selectedNode;
            if (data) {
                _this.content.panelSurth.propertyGridAtribDinamicos.setContenido(data.data.arridtablasgenerales);
            }
        }
    }
});
LOG.lb.maestroproductos.PanelSur = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        _this.region = 'south';
        _this.activeItem = 0;
        _this.layout = 'card';
        _this.height = 250;
        _this.panel1raCara = new Ext.Panel({
            title: 'Atributos del producto o servicio',
            border: false,
            bodyBorder: false,
            layout: 'fit'
        });
        _this.panel2daCara = new Ext.Panel({
            title: 'Valores de los atributos',
            border: false,
            bodyBorder: false,
            layout: 'fit'
        });
        _this.buildProperygrid();
        _this.buildGridAtribDinamico();
        _this.items = [_this.panel1raCara, _this.panel2daCara];
        LOG.lb.maestroproductos.PanelSur.superclass.constructor.call(this, config);
    },
    buildGridAtribDinamico: function() {
        var _this = this;
        _this.gridAtribDinamicos = new Ext.erp.gridAtribDinamicos({
            schema: 'mod_datosmaestrosmeta',
            descripcionOrigen: 'Nomenclador_indicadores',
            prefijoTabla: 'indicadores',
            llavesGlobal: ['idindicador'],
            llavesHijos: ['idregnumerico', 'idmovregnumerico'],
            globalHide: false,
            globalDefault: true,
            region: 'center',
            fnShowVentanaGestion: function(open) {
                _this.blockHotKeys = open;
            },
            listeners: {
                'show': function(grid) {
                    _this.panel1raCara.add(grid);
                    _this.panel1raCara.doLayout(true);
                    _this.doLayout(true);
                }
            },
            preOperacion: function() {
                var dataRecord = _this.content.selectedNode;
                this.idObjeto = dataRecord.data.id;

                _this.gridAtribDinamicos.getStore().baseParams = {
                    arridtablas: dataRecord.data.arridtablas,
                    arridtablasgenerales: dataRecord.data.arridtablasgenerales
                };
                this.idtabla = dataRecord.data.idtabla;
                this.idtablageneral = dataRecord.data.idtablageneral;
            },
            /**
             *  Función ha ejecutarse tras insertar un nuevo atributo dinámico
             */
            postAdicionar: function(idtabla, columna) {
                _this.actualizarIdTabla(idtabla, columna, function() {
                    _this.loadAtribDinamicos();
                });
            },
            postModificar: function() {
                _this.loadAtribDinamicos();
            },
            /**
             *  Función ha ejecutarse tras eliminar un atributo dinámico
             */
            postEliminar: function() {
                _this.loadAtribDinamicos();
            }
        });
    }, /**
     *  Actualizar el campo idtabla, correspondiente a la tabla metadatos de atributos dinámicos asocida a dicho objeto,
     *  esto debe ocurrir cuando se asocia por primera vez un atributo dinámico al ojeto seleccionado
     */
    actualizarIdTabla: function(idtabla, columna, _fn) {
        var _this = this;
        var dataRecord = _this.content.selectedNode;
        /*
         *  En caso de que el idtabla ó idtablageneral sea distinto al parámetro, significa que es nueva la tabla metadata
         *  de atributos dinámicos
         */
        var vluecolumna = dataRecord.data.idtablageneral;
        if (columna == 'idtablas') {
            vluecolumna = dataRecord.data.idtabla;
        }
        if (idtabla != null && vluecolumna != idtabla) {
            var parametros = {
                idindicador: dataRecord.data.id,
                primaryKeyField: 'idindicador'
            };
            if (idtabla)
                parametros[(columna == 'idtablas') ? 'idtabla' : 'idtablageneral'] = idtabla;
            Ext.Ajax.request({
                url: 'adicionarClasificador',
                method: 'POST',
                params: parametros,
                callback: function(options, success, response) {
                    var resp = Ext.decode(response.responseText);
                    if (resp.success) {
                        var columnaSimple = (columna == 'idtablas') ? 'idtabla' : 'idtablageneral';
                        if (_this.content.activeView == 0) {
                            if (_this.content.regionSeleccionada == 1) {
                                _this.content.arbolProductos.setDataNodoSeleccionado(columnaSimple, idtabla);
                                _this.content.arbolProductos.setDataNodoSeleccionado('arr' + columna, (dataRecord.data['arr' + columna] + ',' + idtabla));
                            } else {
                                _this.content.setDataNodoSeleccionadoGrid(columnaSimple, idtabla);
                                _this.content.setDataNodoSeleccionadoGrid('arr' + columna, (dataRecord.data['arr' + columna] + ',' + idtabla));
                            }
                        } else {
                            _this.content.setDataNodoSeleccionadoTreeGrid(columnaSimple, idtabla);
                            _this.content.setDataNodoSeleccionadoTreeGrid('arr' + columna, (dataRecord.data['arr' + columna] + ',' + idtabla));
                        }
                        _fn();
                    } else {
                        mostrarMensaje(3, "Ha ocurrido un error mientras se guardaban los datos correspondientes a la clasificaci\xf3n.");
                    }
                }
            });
        } else {
            _fn();
        }

    },
    loadAtribDinamicos: function(update) {
        var _this = this;
        if (update) {
            _this.content.updateSelectedSelectedNode();
        }
        var data = _this.content.getselectedNode();
        if (data != null) {
            if (_this.gridAtribDinamicos && _this.gridAtribDinamicos.getStore()) {
                if (data.data.arridtablas || data.data.arridtablasgenerales) {
                    _this.gridAtribDinamicos.getStore().load();
                } else {
                    _this.gridAtribDinamicos.getStore().removeAll();
                }
            }

            if (data.data.idindicador == null) {
                if (_this.gridAtribDinamicos && _this.gridAtribDinamicos.btnAdicionar) {
                    _this.gridAtribDinamicos.btnAdicionar.disable();
                }
                if (_this.content.PanelEast.propertyGridAtribDinamicos) {
                    _this.content.PanelEast.propertyGridAtribDinamicos.setContenido({});
                }
            } else {
                if (_this.gridAtribDinamicos) {
                    if (_this.gridAtribDinamicos.btnAdicionar) {
                        _this.gridAtribDinamicos.btnAdicionar.enable();
                    }
                }
                if (_this.content.PanelEast.propertyGridAtribDinamicos) {
                    _this.content.PanelEast.propertyGridAtribDinamicos.setContenido(data.data.arridtablasgenerales);
                }
            }
        }
    },
    buildProperygrid: function() {
        var _this = this;
        _this.propertyGridAtribDinamicos = new Ext.erp.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            globalDefault: true,
            editable: true,
            listeners: {
                'show': function(propertyGrid) {
                    _this.panel2daCara.add(propertyGrid);
                    _this.panel2daCara.doLayout(true);
                    _this.doLayout(true);
                },
                'mouseover': function() {
                    _this.blockHotKeys = true;
                },
                'mouseout': function() {
                    _this.blockHotKeys = false;
                }
            },
            preOperacion: function() {
                var dataRecord = _this.content.selectedNode;
                this.llavesForaneas = Array();
                this.llavesForaneas.push({
                    key: 'idindicador',
                    value: dataRecord.data.id
                });
                this.idtabla = dataRecord.data.idtabla;
                this.idtablageneral = dataRecord.data.idtablageneral;
                this.ar_where = 'idindicador = ' + dataRecord.data.id;
                this.id = dataRecord.data.id;
            }
        });
    },
});




