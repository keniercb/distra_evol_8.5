Ext.ns('LOG.lb.documento');
LOG.lb.documento.ventanaGestionDocumentos = Ext.extend(LOG.util.Window, {
    /**
     * 
     * @type type
     */
    panelSuperior: undefined,
    /**
     * Lista de los botnes que se muestran en el tbar de la IU de adicionar
     */
    listaBotonesVentana: undefined,
    /**
     * Lista de los botnes que se muestran en el tbar de la IU de adicionar
     */
    listaBotonesProductos: undefined,
    /***
     * 
     */
    listaGridColumnsProductos: undefined,
    /**
     * 
     */
    started: false,
    /**
     * 
     */
    cbUmedida: undefined,
    /**
     * 
     */
    record: null,
    /**
     * 
     */
    idDocumento : null,
    /**
     * Tipo de la ventana 1 - Nuevo 2 - Ver detalles 3 - Aprobar
     */
    tipoVentana: 1,
    /**
     * Guarda la configuracion de ubicacion para cuando se utilice el componente
     */
    confubicacion: null,
    /**
     * 
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function(config) {
        LOG.util.UIManager.apply(this, config);
        this.listaBotonesProductos = new LOG.util.List();
        this.listaBotonesVentana = new LOG.util.List();
        this.listaGridColumnsProductos = new LOG.util.List();
        this.initDefaultButtons();
        this.initDefaultColumns();
        LOG.lb.documento.ventanaGestionDocumentos.superclass.constructor.call(this, config);
        this.started = false;
    },
    /**
     * 
     * @returns {undefined}
     */
    builComponent: function() {
        this.idioma = this.idioma || LOG.lb.documento.Idioma;
        var _this = this;
        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            //titleCollapse: (!_this.scope.colapsed)? false : true,
            //collapsible: true,//(!_this.scope.colapsed)? false : true,
            //collapseMode: 'mini',
            //animCollapse: false,
            //animate: false,
            title: this.idioma.tlPanelGeneral,
            autoHeight: true,
            frame: true
        });

        this.smGridDetalles = LOG.util.UIManager.initSelectionModel(3);
        var cls = LOG.util.UIManager.proccessColumns(this.listaGridColumnsProductos);
        this.cmGridDetalles = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridDetalles = Ext.data.Record.create(cls.fields);
        /*this.stGridDetalles = new Ext.data.Store({
            url: 'cargarProductosDocumento',
            reader: new Ext.data.JsonReader({
                id: 'idmovimiento',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridDetalles)
        });*/
        var cfgStore = {
            url: 'cargarProductosDocumento',
            reader: new Ext.data.JsonReader({
                id: 'idmovimiento',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridDetalles)
        };

        var objCfg = {
            _plugins: new Array(),
            expanded: cls.expanded,
            nobbar: false
        };
        
        if (cls.groupField != false) {
            cfgStore = LOG.util.UIManager.apply(cfgStore, {
                sortInfo: {field: this.orderField || this.idGridPrincipal, direction: "ASC"},
                groupField: cls.groupField,
                remoteSort: true,
                remoteGroup: true
            });

            objCfg.view = new Ext.grid.GroupingView({
                forceFit: this.foreceFitView,
                showGroupName: false,
                enableNoGroups: false,
                enableGroupingMenu: false,
                hideGroupedColumn: true,
                groupTextTpl: '{text} : {[values.rs.length]} ' + LOG.util.Idioma.lbItems
            });
        }
        
        this.stGridDetalles = (cls.groupField == false) ? new Ext.data.Store(cfgStore) : new Ext.data.GroupingStore(cfgStore);


        this.stGridDetalles.on({
            'beforeload': function() {
                _this.beforeLoadProductos();
            }
        });
        this.mantenerSeleccion();
        this.gridDetalles = LOG.util.UIManager.initEditableGridPanel(this.cmGridDetalles, this.stGridDetalles, this.smGridDetalles, objCfg);
        this.gridDetalles.on('afteredit', this.editarProducto, this);
        this.gridDetalles.on('beforeedit', this.beforeEditProducto, this);

        LOG.util.UIManager.initFilterGrid(this.gridDetalles, this.idioma.ttCriterioMov, this.idioma.ttConcepto);

        this.panelProductos = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesProductos.getArray()
            }),
            layout: 'border',
            region: 'center',
            items: [this.gridDetalles]
        });
        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            handler: this.salvarHandler,
            scope: this,
            controlFn: function() {
                _this.controlFnGuardar(_this.btnSalvar);
            }
        });
        this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnNuevo,
            handler: this.onResetHandler,
            scope: this,
            controlFn: function() {
                _this.controlFnGuardar(_this.btnNuevo, true);
            }
        });
        this.btnCerrar = LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            text: this.idioma.lbBtnCerrar,
            scope: this
        }, true);

        this.modelo.addActionButton(this.btnSalvar);
        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            items: [this.panelSuperior, this.panelProductos],
            buttons: [this.btnCerrar, this.btnNuevo, this.btnSalvar]
        });
        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
    },
    mantenerSeleccion: function() {
        var _this = this;
        this.marcados = new Array();
        this.smGridDetalles.on({
            rowselect: function(_sm, _index, _r) {
                if (_this.marcados.indexOf(_r.id) == -1) {
                    _this.marcados.push(_r.id);
                }
            },
            rowdeselect: function(_sm, _index, _r) {
/*                if (_this.marcados.indexOf(_r.id) != -1) {
                    _this.marcados.remove(_r.id);
                }*/
            }
        });
        LOG.util.UIManager.encadenaFn(this.stGridDetalles, 'fireEvent', function(e, st, rec) {
            if (e == 'load') {
                var checked = new Array();
                Ext.each(rec, function(r, index) {
                    Ext.each(_this.marcados, function(id) {
                        if (id == r.id) {
                            checked.push(index);
                        }
                    });
                });
                _this.smGridDetalles.selectRows(checked);
                _this.smGridDetalles.fireEvent('rowdeselect');
            }
        }, '_marcar');
    },

            /**
     * 
     * @returns {undefined}
     */
    onShowFn: function() {
        this.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        this.listaBotonesProductos.each(function(b) {
//            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        if (typeof this.btnNuevo.controlFn == 'function') {
            this.btnNuevo.controlFn.createDelegate(this).call();
        }
        if (typeof this.btnSalvar.controlFn == 'function') {
            this.btnSalvar.controlFn.createDelegate(this).call();
        }
        if (this.isInit()) {
            this.modelo.habilitarBotones(true);
        }
        if (typeof usarCategoria !== 'undefined' && usarCategoria == false) {
            this.ocultarColumna('nomcategoria');
        }
    },
    ocultarColumna: function(dataIndex, ocultar) {
        if (typeof ocultar == 'undefined') {
            ocultar = true;
        }
        var pos = this.listaGridColumnsProductos.getPosByField('dataIndex', dataIndex, 'header');
        this.gridDetalles.getColumnModel().setHidden(pos + 1, ocultar);
    },
    onRenderHandler: function() {
        LOG.util.UIManager.applyKey(this.btnSalvar, this);
        LOG.util.UIManager.applyKey(this.btnCerrar, this);
        LOG.util.UIManager.applyKey(this.btnNuevo, this);
    },
    /**
     * 
     * @returns {undefined}
     */
    salvarHandler: function(params) {
        var _this = this.scope || this;
        params = params || {
            idestructuracomun: _this.scope ? _this.scope.idDeposito : null
        };
        _this.modelo.salvar(params, function(r) {
            if (_this.modelo.listaProductos.count() || r.reloadGridDetalle == 1) {
                _this.cargarProductos();
            }
            _this.tipoVentana = 2;
            if (_this.record == null) {
                _this.record = {};
                Ext.apply(_this.record, {
                    data: {
                        iddocumento: r.iddocumento,
                        estado: "1"
                    }
                });

            }
            _this.getTitleDocumento(r.iddocumento);
            _this.listaBotonesVentana.each(function(b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);
        });
    },
    /**
     * 
     * @param {type} p
     * @returns {undefined}
     */
    addPanelSuperior: function(p) {
        this.fromularioGestion = LOG.util.UIManager.initForm({
            items: [p]
        });
        this.modelo.bindForm(this.fromularioGestion);
        this.panelSuperior.add(this.fromularioGestion);
    },
    /**
     * 
     * @param {type} b
     * @param {type} f
     * @returns {undefined}
     */
    addToolbarButtonVentana: function(b, f) {
        this.listaBotonesVentana.add(LOG.util.UIManager.reconfigureButton(b));
    },
    /**
     * Inserta un boton en una posicion especifca del tbar
     * @param {type} b
     * @param {type} i
     * @returns {undefined}
     */
    insertToolbarButtonVentana: function(b, i, f) {
        this.listaBotonesVentana.insert(LOG.util.UIManager.reconfigureButton(b), i);
    },
    /**
     * 
     * @param {type} b
     * @param {type} f
     * @returns {undefined}
     */
    addToolbarButtonProductos: function(b, f) {
        this.listaBotonesProductos.add(LOG.util.UIManager.reconfigureButton(b));
        /*if (f != undefined) {
         this.eventHandler.addEventListener('prueba', f.createDelegate(b));
         }*/
    },
    /**
     * Inserta un boton en una posicion especifca del tbar
     * @param {type} b
     * @param {type} i
     * @returns {undefined}
     */
    insertToolbarButtonProductos: function(b, i, f) {
        this.listaBotonesProductos.insert(LOG.util.UIManager.reconfigureButton(b), i);
    },
    /**
     * Adiciona un nueva columna al grid
     * @param {type} c
     * @returns {undefined}
     */
    addGridColumnProductos: function(c) {
        this.listaGridColumnsProductos.add(c);
    },
    /**
     * Inserta una columna en el grid en una posicion especifica
     * @param {type} c
     * @param {type} i
     * @returns {undefined}
     */
    insertGridColumnProductos: function(c, i) {
        this.listaGridColumnsProductos.insert(c, i);
    },
    /**
     * 
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        var _this = this;
        let isFarmacia = (typeof farmacia !== 'undefined' && farmacia == 1);

        if(isFarmacia != 1){
            this.addGridColumnProductos({
                header: _this.idioma.cgCodigo,
                width: 120,
                dataIndex: 'codigo',
                default: true
            });
        }

        this.addGridColumnProductos({
            header: (isFarmacia != 1)?_this.idioma.cgCodigoPro:_this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigoproveedor',
            default: true
        });

        if (isFarmacia == 1) {
            this.addGridColumnProductos({
                header: 'Nº. lote',
                width: 120,
                dataIndex: 'numerolote',
                default: true
            });

            this.addGridColumnProductos({
                header: 'Fecha vencimiento',
                width: 120,
                dataIndex: 'fechavencelote',
                default: true
            });
        }

        this.addGridColumnProductos({
            header: _this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });

        if(isFarmacia == 1){
            this.addGridColumnProductos({
                header: _this.idioma.cgDescripcionV,
                width: 200,
                dataIndex: 'descripcionventa',
                default: true
            });

            this.addGridColumnProductos({
                header: this.idioma.cgNaturaleza,
                width: 120,
                dataIndex: 'naturaleza',
                agrupador: true,
                default: true
            });
        }

        this.addGridColumnProductos({
            header: 'Categor\xeda',
            width: 120,
            dataIndex: 'nomcategoria',
            default: true

        });

        this.addGridColumnProductos({
            header: _this.idioma.cgUM,
            width: 60,
            dataIndex: 'umedida',
            align: 'center',
            default: true
        });
        
        this.addGridColumnProductos({
            header: _this.idioma.cgUbicacion,
            width: 170,
            align: 'right',
            dataIndex: 'ubicacion',
            default: true
        });
        this.addGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: 'Existencia',
            width: 80,
            dataIndex: 'existencia',
            align: 'right',
            default: true,
            renderer: function(value, metaData, record) {
                if (record.json.existencia_area) {
                    return record.json.existencia_area;
                }
                return value;
            }
        }));
        this.addGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgDisponible,
            width: 80,
            dataIndex: 'disponible',
            align: 'right',
            default: true,
            renderer: function(value, metaData, record) {
                if (record.json.disponible_area) {
                    return record.json.disponible_area;
                }
                return value;
            }
        }));
        this.addGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgCantidad,
            width: 80,
            dataIndex: 'cantidad',
            default: true,
            align: 'right',
            editor: LOG.util.Prototipos.inputDecimal()
        }));

        this.addGridColumnProductos(LOG.util.Prototipos.columnaPrecio({
            header: _this.idioma.cgPrecio,
            width: 80,
            dataIndex: 'preciocontable',
            align: 'right',
            default: true
        }));
        this.addGridColumnProductos(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cgImporte,
            width: 80,
            align: 'right',
            dataIndex: 'importe',
            default: true
        }));

        if(isFarmacia == 1){
            this.addGridColumnProductos({
                header: this.idioma.cgFormaFarma,
                width: 120,
                dataIndex: 'formafarma',
                default: true
            });
            
            this.addGridColumnProductos({
                header: this.idioma.cgPresentacion,
                width: 120,
                dataIndex: 'presentacion',
                default: true
            });
        }
        this.addGridColumnProductos({
            header: _this.idioma.cgClasificacionCont,
            width: 120,
            dataIndex: 'clasificacioncont',
            default: true
        });
        this.addGridColumnProductos({
            header: LOG.lb.producto.Idioma.cgPais,
            width: 140,
            dataIndex: 'nacionalidad',
            default: true

        });
        this.addGridColumnProductos({
            dataIndex: 'idproducto'
        });
        this.addGridColumnProductos({
            dataIndex: 'idmovimiento'
        });
        this.addGridColumnProductos({
            dataIndex: 'idunidadmedida'
        });
        this.addGridColumnProductos({
            dataIndex: 'idindicador'
        });
        this.addGridColumnProductos({
            dataIndex: 'iddeposito'
        });
        this.addGridColumnProductos({
            dataIndex: 'numubicaciones'
        });
    },
    /**
     * 
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        //Botones de la ventana 
        var _this = this;
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonEliminar({
            handler: Ext.emptyFn
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonConfirmar({
            text: 'Confirmar',
            handler: Ext.emptyFn
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            text: 'Anular estado',
            handler: Ext.emptyFn
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonAprobar({
            text: 'Aprobar',
            handler: Ext.emptyFn
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonDuplicar({
            text: 'Duplicar',
            handler: Ext.emptyFn
        }));
        //Botones del grid de productos
        this.addToolbarButtonProductos(LOG.util.Prototipos.botonEliminar({
            text: 'Eliminar',
            handler: _this.handlerEliminarMov,
            scope: this
        }));


    },
    /**
     * 
     * @returns {undefined}
     */
    init: function() {
        this.builComponent();
        this.started = true;
    },
    /**
     * 
     * @returns {Boolean}
     */
    isInit: function() {
        return this.started;
    },
    /**
     * 
     * @param {type} p
     * @returns {undefined}
     */
    addPanel: function(p) {
        this.panelProductos.add(p);
    },
    /**
     * 
     * @param {type} p
     * @returns {unresolved}
     */
    onCloseHandler: function(p) {        
        var _this = this;        
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
            if (_this.stGridDetalles) {
                _this.stGridDetalles.removeAll();
                _this.gridDetalles.getView().refresh();
            }
        }
        if(_this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento){
            var id = _this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento;
            _this.modelo.cargaInicial({
                cargando : true,
                url : '/logistica/utiles/documento/index.php/desbloqueo/desbloquearDocumento',
                id : Ext.encode([id])
            });
        }
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    /**
     * 
     * @returns {undefined}
     */
    onResetHandler: function() {

        var _this = this.scope || this;

        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.fromularioGestion.getForm()._record = null;
            _this.record = null;
            _this.stGridDetalles.removeAll();
            _this.gridDetalles.getView().refresh();
            _this.setTitle(_this.idioma.tlAdicionar);
            _this.onShowHandler()
        }
    },
    /**
     * 
     * @param {type} parametros
     * @returns {undefined}
     */
    cargarProductos: function(parametros) {
        var objParams = parametros || {};
        this.stGridDetalles.load(objParams);
    },
    /**
     * 
     * @param {Object} d
     * @param {Boolean} noCargar
     * @returns {undefined}
     */
    prepareDocModify: function(d, noCargar) {
        if (this.fromularioGestion) {
            this.fromularioGestion.getForm().loadRecord(d);
            if (!noCargar) {
                this.modelo.loadRecord();
            }
            this.cargarProductos();
            this.record = d;
            this.getTitleDocumento(this.record.data.iddocumento);
        }
    },
    /**
     * 
     * @param {type} e
     * @returns {undefined}
     */
    editarProducto: function(e) {
        this.modelo.adicionarProducto(e.record.data);
    },
    /**
     *
     * @param e
     */
    beforeEditProducto: function(e) {
        if (this.record != null && this.record.data.estado != "1") {
            e.cancel = true;
        } else if(e.field == 'cantidad') {
            if (e.record.data.decimales == "0") {
                e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputEntero({}));
            } else {
                e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputDecimal({}));
            }
        }
    },
    /**
     *
     * @param e
     */
    beforeLoadProductos: function() {
        this.stGridDetalles.baseParams[this.modelo.primaryKeyField] = (this.modelo[this.modelo.primaryKeyField]) ? this.modelo[this.modelo.primaryKeyField] : -1;
        this.stGridDetalles.initBaseParams[this.modelo.primaryKeyField] = (this.modelo[this.modelo.primaryKeyField]) ? this.modelo[this.modelo.primaryKeyField] : -1;
    },
    /***
     * 
     */
    handlerEliminarMov: function() {
        var _this = this.scope;
        var idmovimientos = new Array();
        Ext.each(_this.smGridDetalles.getSelections(), function(rec) {
            idmovimientos.push(rec.id);
        });
        _this.modelo.eliminarMovimientos(idmovimientos, function() {
            _this.stGridDetalles.reload();
        });

    },
    /**
     * 
     * @param {type} iddocumento
     * @returns {undefined}
     */
    getTitleDocumento: function(iddocumento) {
        var _this = this;
        _this.modelo.iddocumento = iddocumento;
        _this.idDocumento = iddocumento;
        this.modelo.cargaInicial({
            url: '/logistica/utiles/documento/index.php/documentologistica/cargarEncabezado',
            iddocumento: iddocumento
        }, function(datos) {
            var encabezado = datos[0];
            encabezado.estado = LOG.lb.documento.Estado[encabezado.estado];
            if (_this.isVisible()) {
                _this.setTitle(encabezado.tipo + " # " + encabezado.numero + " del " + encabezado.fecha + " en " + encabezado.estado);
            }
            _this.fromularioGestion.getForm().loadRecord({
                data: encabezado
            });
        });
    },
    /**
     * Muestra u oculta los botones nuevo y guardar de acuerdo a los provilegios establecidos.
     * @param {Button} b
     * @param {Boolean} nuevo
     * @returns {undefined}
     */
    controlFnGuardar: function(b, nuevo) {
        if (this.scope.grantedAction('CT') || this.scope.grantedAction('RCRUD') || this.scope.grantedAction('RAdicionar')) {
            b.show();
        } else {
            b.hide();
        }
    }
});
