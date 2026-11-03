Ext.ns('LOG.lb.partidas');

LOG.lb.partidas.View = Ext.extend(LOG.util.UITemplate, {
    confubicacion: undefined,
    proceso: false,
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma.init());
        this.modelo = new LOG.lb.partidas.Model({
            idioma: config.idioma
        });
        this.concepto = config.idioma.ttBuscar;
        this.idGridPrincipal = 'iddocumento';
        this.textBusquedaSimple = 'Nro documento, Nro referencia';
        LOG.lb.partidas.View.superclass.constructor.call(this, config);
        this.dirController = '/logistica/utiles/partidas/index.php/partidas';
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = true;
        //LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        //LOG.lb.partidas.View.superclass.constructor.call(this, config);
    },
    init: function() {
        var _this = this;
        LOG.lb.partidas.View.superclass.init.call(this);

       this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function() {
            _this.PanelSur = new LOG.lb.partidas.PanelProductos({
                idioma: _this.idioma,
                model: this.modelo,
                _scope: _this
            });
            _this.PanelSur.init();
            var vistaSur = _this.PanelSur.view();

            _this.PanelRegionSur = LOG.util.UIManager.initPanel({
                title: _this.idioma.TitleProductos,
                layout: 'fit',
                region: 'south',
                height: 500,
                minSize: 350,
                frame: true,
                collapsible: true,
                collapsed: true,
                split: true,
                items: [vistaSur],
                listeners: {
                    'collapse': function () {
                        this.hide();
                        _this.getPanelGrid().doLayout();
                    },
                    'beforeexpand': function () {
                        this.show();
                        _this.getPanelGrid().doLayout();
                    }
                }
            });
            _this.getPanelGrid().add(_this.PanelRegionSur);

            _this.PanelSur.getStorePrincipal().on({
                'beforeload': function () {
                    if (_this.getSmPrincipal().getSelected()) {
                        this.initBaseParams.iddocumento =  _this.getSmPrincipal().getSelected().data.iddocumento;
                    } else {
                        this.initBaseParams.iddocumento = -1;
                    }
                }
            });

            _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                if (e == 'selectionchange' && this.getCount() == 1) {
                    _this.PanelRegionSur.expand();
                    _this.PanelSur.getStorePrincipal().load();
                } else {
                    _this.PanelSur.getStorePrincipal().removeAll();
                    _this.PanelSur.getGridPrincipal().getView().refresh();
                }
            });
        });
    },
    initDefaultButtons: function () {
        var _this = this;

        /*this.onGridDobleClick = function () {
            var b = (_this.getSmPrincipal().getSelected() && _this.getSmPrincipal().getSelected().data.equipo == 1) ? _this.listaBotones.getItem(0) : _this.listaBotones.getItem(1);
            b.handler.call(b, b);
        };*/


        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: _this.idioma.lbBtnNoSerie,
            tooltip: _this.idioma.ttBtnNoSerie,
            disabled: true,
            handler: function () {

            },
            controlFn: function (b, _caller) {
                b.disable();
                if (_this.grantedAction('RB') || _this.grantedAction('CT')) {
                    b.setVisible(false);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.equipo == 1){
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'nroserie');
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'ayuda',
            text: this.idioma.lbBtnAyuda,
            tooltip: this.idioma.ttBtnAyuda,
            handler: function () {

            },
            controlFn: function (b, _caller) {
                b.disable();
                if ( _this.grantedAction('CT')) {
                    b.setVisible(true);
                    b.enable();
                } else {
                    b.setVisible(false);
                }
            }
        }));

    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.cgTipoDocumento,
            width: 180,
            //agrupador: true,
            dataIndex: 'tipodocumento',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgNumeroDocumento,
            width: 100,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgNumeroReferencia,
            width: 100,
            dataIndex: 'numeroref',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgEstado,
            width: 100,
            dataIndex: 'estado',
            default: true,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgFechaEmision,
            width: 100,
            dataIndex: 'fechacontable',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgProveedor,
            dataIndex: 'cliente',
            default: true,
            autoExpand: true,
        });

        this.addGridColumn({
            header: this.idioma.cgCantProd,
            width: 120,
            dataIndex: 'cantproductos',
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.gcImporte,
            dataIndex: 'importecontable',
            width: 100,
            align: 'right',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        }, 6);

        this.addGridColumn({
            header: _this.idioma.cgCantidadApertura,
            dataIndex: 'cantapertura',
            default: true,
            autoExpand: true,
        });

        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
    }
});

LOG.lb.partidas.PanelProductos = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.autoLoad = false;
        this.concepto = 'producto';
        this.busquedaBasica = true;
        this.idGridPrincipal = 'idproducto';
        this.dirController = '/logistica/utiles/partidas/index.php/partidas';
        this.urlBusquedaGridPrincipal = 'cargarProductos';
        this.textBusquedaSimple = 'C\xf3digo, Denominaci\xf3n';
        this.modoSeleccion = 1;
        this.busquedaAvanzada = true;
        this.panelBotonesVisible = true;
        this.formaVisualizacion = 'panel';
        LOG.lb.partidas.PanelProductos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCodigoPro,
            width: 120,
            dataIndex: 'codigoproveedor',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });

        if (typeof usarCategoria !== 'undefined' && usarCategoria == true) {
            this.addGridColumn({
                header: this.idioma.cgCategoria,
                width: 120,
                dataIndex: 'nomcategoria',
                default: true
            });
        }

        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 60,
            dataIndex: 'umedida',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgPais,
            width: 140,
            dataIndex: 'nacionalidad',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            width: 200,
            dataIndex: 'ubicacion',
            default: true
        });

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,
            width: 80,
            align: 'right',
            dataIndex: 'existencia',
            default: true,
            renderer: function(value, metaData, record) {
                if (record.json.existencia_area) {
                    return record.json.existencia_area;
                }
                return value;
            }
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgDisponible,
            width: 80,
            align: 'right',
            dataIndex: 'disponible',
            default: true,
            renderer: function(value, metaData, record) {
                if (record.json.disponible_area) {
                    return record.json.disponible_area;
                }
                return value;
            }
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgMinimo,
            width: 100,
            align: 'right',
            dataIndex: 'minimo',
            renderer: function (_v, _mD, _r) {
                _r.data.minimo = _v || 0;
                return _r.data.minimo;
            },
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgMaximo,
            width: 100,
            align: 'right',
            dataIndex: 'maximo',
            renderer: function (_v, _mD, _r) {
                _r.data.maximo = _v || 0;
                return _r.data.maximo;
            },
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            width: 100,
            align: 'right',
            dataIndex: 'cantidad',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.cgPrecio,
            width: 100,
            dataIndex: 'preciocontable',
            align: 'right',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte,
            width: 100,
            align: 'right',
            dataIndex: 'importe',
            default: true
        }));

        this.addGridColumn({
            header: this.idioma.cgClasificacionCont,
            width: 150,
            dataIndex: 'clasificacioncont',
            default: true
        });

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

        this.addGridColumn({
            dataIndex: 'idmovimiento',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idunidadmedida'
        });

        this.addGridColumn({
            dataIndex: 'idindicador'
        });

        this.addGridColumn({
            dataIndex: 'iddeposito'
        });

        this.addGridColumn({
            dataIndex: 'numubicaciones'
        });

        this.addGridColumn({
            dataIndex: 'estado'
        });

        this.addGridColumn({
            dataIndex: 'numeroref'
        });

        this.addGridColumn({
            dataIndex: 'fechacontable'
        });

        this.addGridColumn({
            dataIndex: 'iddocumento'
        });

        this.addGridColumn({
            dataIndex: 'tipodocumento'
        });
    },
    initDefaultButtons: function () {
        var _this = this;

        this.onGridDobleClick = function () {
            var b = (_this.getSmPrincipal().getSelected() && _this.getSmPrincipal().getSelected().data.equipo == 1) ? _this.listaBotones.getItem(0) : _this.listaBotones.getItem(1);
            b.handler.call(b, b);
        };

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: _this.idioma.lbBtnNoSerie,
            tooltip: _this.idioma.ttBtnNoSerie,
            disabled: true,
            handler: function () {
                LOG.lb.numeroserie.Loader.init(function () {
                    var winNroSerie = new LOG.lb.numeroserie.Entrada({
                        idestructura: _this._scope.idDeposito,
                        producto: _this.getSmPrincipal().getSelected().data,
                        documento: _this._scope.getSmPrincipal().getSelected().data,
                        confubicacion: confubicacion,
                        fecha: fecha,
                        ocultarPanel: 1,
                        initAvanzada: function() {
                            /*var _this = this;

                            this.getPanelBusqueda().setColumns(2);

                            _this.addFilterComponent(LOG.util.Prototipos.inputTexto({
                                fieldLabel: _this.idioma.lbNroserie,
                                name: 'nroserie'
                            }));*/

                            /*var cbAnnoFabricacion = new LOG.util.ComboBox({
                                fieldLabel: this.idioma.lbTfFechaFabricacion,
                                name: 'annofabricacion',
                                url: '/logistica/utiles/producto/index.php/numeroserie/cargarAnnosNroSerie',
                                displayField: 'denominacion',
                                valueField: 'denominacion',
                                autoLoad: false
                            });
                            cbAnnoFabricacion.getStore().on({
                                beforeload: function() {
                                this.baseParams.tipo = 1;
                                this.baseParams.idestructura = _this.idestructura;
                                this.baseParams.idproducto = _this.producto.idproducto;
                                }
                            });
                            cbAnnoFabricacion.getStore().load();
                            var cbAnnoConservacion = new LOG.util.ComboBox({
                                fieldLabel: this.idioma.lbTfAnno,
                                name: 'annoconservacion',
                                url: '/logistica/utiles/producto/index.php/numeroserie/cargarAnnosNroSerie',
                                displayField: 'denominacion',
                                valueField: 'denominacion',
                                autoLoad: false
                            });
                            cbAnnoConservacion.getStore().on({
                            beforeload: function() {
                                this.baseParams.tipo = 2;
                                this.baseParams.idestructura = _this.idestructura;
                                this.baseParams.idproducto = _this.producto.idproducto;
                                }
                            });
                            cbAnnoConservacion.getStore().load();
                            this.addFilterComponent(cbAnnoFabricacion);
                            this.addFilterComponent(new LOG.util.TreeCombo({
                                fieldLabel: this.idioma.lbCbUbicacion,
                                url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
                                name: 'idestructuraubicacion',
                                node: this.idestructura,
                                selectOnlyLeaf: this.confubicacion
                            }));
                            //Verificar componente con Kenier...
                            this.addFilterComponent(LOG.util.Prototipos.inputTexto({
                                fieldLabel: this.idioma.lbTfNumero,
                                name: 'numero'
                            }));

                            this.addFilterComponent(cbAnnoConservacion);
                            this.addFilterComponent(new LOG.util.ComboBox({
                                fieldLabel: this.idioma.lbCbTipo,
                                hiddenName: 'idconservacion',
                                store: this.stConservacion,
                                displayField: 'denominacion',
                                valueField: 'idconservacion',
                                autoLoad: true,
                                editable: false
                            }));
                            if (this.usarMarcaModelo) {
                                this.addFilterComponent(new LOG.util.ComboBox({
                                    fieldLabel: this.idioma.lbCbMarca,
                                    hiddenName: 'idmarca',
                                    url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
                                    valueField: 'idmarca',
                                    displayField: 'denominacion'
                                }));
                                this.addFilterComponent(new LOG.util.ComboBox({
                                    fieldLabel: this.idioma.lbCbModelo,
                                    hiddenName: 'idmodelo',
                                    url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
                                    valueField: 'idmodelo',
                                    displayField: 'denominacion'
                                }));
                                if (!this.salida) {//Verificar componente con Kenier...
                                    this.addFilterComponent(LOG.util.Prototipos.inputTexto({
                                        fieldLabel: this.idioma.lbTfNroPieza,
                                        name: 'nropieza'
                                    }));
                                }
                            }*/
                        },
                        cerrarFn: function () {
                            _this.getStorePrincipal().reload();
                        }
                    });
                    winNroSerie.init();
                    winNroSerie.view();
                });
            },
            controlFn: function (b, _caller) {
                if (_this._scope.grantedAction('RB') || _this._scope.grantedAction('CT') || _this._scope.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.equipo == 1){
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'nroserie');
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'partida',
            text: this.idioma.lbBtnPartidas,
            tooltip: this.idioma.ttBtnPartidas,
            disabled: true,
            handler: function () {
                var municiones = new LOG.inv.municiones.View({
                    idestructura: _this._scope.idDeposito,
                    producto: _this.getSmPrincipal().getSelected().data,
                    documento: _this._scope.getSmPrincipal().getSelected().data,
                    confubicacion: confubicacion,
                    fecha: fecha,
                    desglose: true,
                    /*busquedaAvanzada: true,*/
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
                                    this.initBaseParams.contabilizado = _this.documento.estado != '1' ? true : null;
                                    if (_this.documento.idpadre) {
                                        this.initBaseParams.idpadre = _this.documento.idpadre;
                                    }
                                }
                                this.rejectChanges();
                            },
                            load: function() {
                                if (_this.cbIndice) {
                                    _this.cbIndice.setValue(this.reader.jsonData.indice || _this.stIndice.getBy('denominacion', _this.sinDatos).get('idmarcaarmamento'));
                                    _this.cbIndice.fireEvent('select');
                                }
                                if (_this.panelSuperior) {
                                    _this.cantidad.setHtml(this.reader.jsonData.total);
                                }
                            }
                        });
                        this.getGridPrincipal().on({
                            beforeedit: function(o) {
                                _this.ubicacion = {
                                    idubicacion: o.record.data.idestructuraubicacion,
                                    ubicacion: o.record.data.ubicacion
                                }
                                if (o.record.json && o.record.json.estado != '1' /*&& (o.field == 'cantidad' || o.field == 'existencia' || o.field == 'elemembalajes')*/) {
                                    o.cancel = true;
                                }
                            },
                            afteredit: function(o) {
                                if (_this.salida || (_this.producto && parseInt(_this.producto.diferencia || 0) > 0)) {
                                    o.record.data.cantidad = _this.validarSalida(o.record.data);
                                    o.grid.view.refresh();
                                }
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
                    initAvanzada: function(){
                        this.cbUbicacion = new LOG.util.TreeCombo({
                            fieldLabel: this.idioma.lbCbUbicacion,
                            url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
                            hiddenName: 'idestructuraubicacion',
                            node: _this.idDeposito || 0,
                            selectOnlyLeaf: confubicacion
                        });
                    },
                    editable: function() {
                        return true;
                    },
                    grantedAction: function (_p) {
                        return _this.grantedAction(_p);
                    },
                    cerrarFn: function () {
                        _this.getStorePrincipal().reload();
                    }
                });
                municiones.show();
            },
            controlFn: function(b, _caller) {
                if (_this._scope.grantedAction('CT') || _this._scope.grantedAction('RCRUD') || _this._scope.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.municion == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'municion');
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton("->");
        /*this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idpartidas'
        }));*/
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idproducto',
            referencia: '/logistica/utiles/producto/index.php/gestproducto',
            btn: 'ayuda'
        }));
    }
});