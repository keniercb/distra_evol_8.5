LOG.dist.distribucion.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    listaGridColumnsDistribucion: undefined,
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.dist.distribucion.Idioma);
        this.listaGridColumnsDistribucion = new LOG.util.List();
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        LOG.dist.distribucion.VentanaAdicionar.superclass.constructor.call(this, config);
        this.modelo.tipodistribucion = this.tipodistribucion;
        this.tipodistribucion = config.tipodistribucion;
    },
    initDefaultButtons: function () {
        LOG.dist.distribucion.VentanaAdicionar.superclass.initDefaultButtons.call(this);
    },
    initDefaultColumns: function (config) {
        var _this = this;
        LOG.dist.distribucion.VentanaAdicionar.superclass.initDefaultColumns.call(this);

        this.listaGridColumnsDistribucion.add({
            header: this.idioma.cgNroPedido,
            width: 120,
            default: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.nropedido) {
                    return record.json.nropedido;
                } else if (record.json.codigo) {
                    return record.json.codigo;
                } else if (record.json.codigocliente){
                    return record.json.codigocliente;
                } else if (record.json.codigoentidad) {
                    return record.json.codigoentidad;
                } else {
                    return '-';
                }
            }
        });

        this.listaGridColumnsDistribucion.add({
            header: this.idioma.cgCliente,
            width: 480,
            default: true,
            autoExpand: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.codigocliente || record.json.idpedido) {
                    return record.json.cliente;
                } if  (record.json.nombre) {
                    return record.json.nombre;
                } else {
                    return record.json.entidaddestino;
                }
            }
        });

        this.listaGridColumnsDistribucion.add({
            header: this.idioma.cgFechaEmision,
            width: 140,
            dataIndex: 'fechacontable',
            default: true
        });

        this.listaGridColumnsDistribucion.add({
            header: this.idioma.cgFechaVencimiento,
            width: 140,
            dataIndex: 'fechavencimiento',
            default: true
        });

        this.listaGridColumnsDistribucion.add({
            header: this.idioma.cgCantReclamaciones,
            width: 140,
            dataIndex: 'cantidadreclamo',
            align: 'right',
            default: true
        });

        this.listaGridColumnsDistribucion.add({
            header: this.idioma.cgCantProductos,
            width: 140,
            dataIndex: 'cantidadproducto',
            align: 'right',
            default: true
        });

        this.listaGridColumnsDistribucion.add({dataIndex: 'idcliente'});

        this.listaGridColumnsDistribucion.add({dataIndex: 'iddocumentocliente'});

        this.listaGridColumnsDistribucion.add({dataIndex: 'idpedido'});

        this.listaGridColumnsDistribucion.add({dataIndex: 'prioridad'});
    },
    builComponent: function () {
        this.idioma = this.idioma || LOG.dist.distribucion.Idioma;

        var _this = this;

        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: this.idioma.tlPanelGeneral,
            autoHeight: true,
            frame: true
        });

        this.smGridDetalles = LOG.util.UIManager.initSelectionModel(2);

        var cls = LOG.util.UIManager.proccessColumns(this.listaGridColumnsDistribucion);

        this.cmGridDetalles = new Ext.grid.ColumnModel(cls.columns);

        this.recStGridDetalles = Ext.data.Record.create(cls.fields);

        this.stGridDetalles = new Ext.data.Store({
            url: 'cargarDestinos',
            reader: new Ext.data.JsonReader({
                id: 'iddocumento',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridDetalles)
        });

        this.stGridDetalles.on({
            'beforeload': function () {
                _this.stGridDetalles.initBaseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.stGridDetalles.initBaseParams.tipodistribucion = (_this.modelo.tipodistribucion) ? _this.modelo.tipodistribucion : null;
            }
        });

        this.stGridDetalles.fireEvent = this.stGridDetalles.fireEvent.createSequence(function (e) {
            if (e == 'load') {
                _this.smGridDetalles.clearSelections();
                _this.smGridDetalles.fireEvent('rowdeselect');
                if (_this.stGridDetalles.getTotalCount() > 0) {
                    _this.smGridDetalles.selectFirstRow();
                }
            }
        });

        this.gridDetalles = LOG.util.UIManager.initEditableGridPanel(this.cmGridDetalles, this.stGridDetalles, this.smGridDetalles, {
            expanded: cls.expanded,
            nobbar: false
        });

        LOG.util.UIManager.initFilterGrid(this.gridDetalles,this.idioma.ttCriterioMov, this.idioma.ttConcepto);

        this.panelProductos = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesProductos.getArray()
            }),
            layout: 'border',
            region: 'center',
            title: (_this.modelo.tipodistribucion == '2') ? this.idioma.tlGridPedidos : (_this.modelo.tipodistribucion == '1' ? this.idioma.tlGridClientes : this.idioma.tlGridDestinos),
            items: [this.gridDetalles]
        });

        this.panelProductos.doLayout();

        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            handler: this.salvarHandler,
            scope: this
        });

        this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnNuevo,
            handler: this.onResetHandler,
            scope: this
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
        this.onShow = this.onShow.createSequence(this.onShowHandler, this);
    },
    onShowHandler: function() {
        this.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        this.listaBotonesProductos.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
    },
    onRenderHandler: function() {
        LOG.util.UIManager.applyKey(this.btnSalvar, this);
        LOG.util.UIManager.applyKey(this.btnCerrar, this);
        LOG.util.UIManager.applyKey(this.btnNuevo, this);
    },
    onCloseHandler: function (p) {
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
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    onResetHandler: function () {
        var _this = this.scope || this;
        var tipodistribucion = _this.modelo.tipodistribucion
        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.record = null;
            _this.stGridDetalles.removeAll();
            _this.gridDetalles.getView().refresh();
            _this.setTitle(_this.idioma.tlVentanaAdicionarDistribucion);
            _this.onShowHandler();
        }
        _this.modelo.tipodistribucion = tipodistribucion;
    },
    salvarHandler: function (params) {
        var _this = this.scope || this;
        params = params || null;
        if (_this.stGridDetalles.getTotalCount() == 0 && _this.modelo.tipodistribucion == 2) {
            mostrarMensaje(1, _this.idioma.msgValidarPedido);
        } else if (_this.stGridDetalles.getTotalCount() == 0 && _this.modelo.tipodistribucion == 3) {
            mostrarMensaje(1, _this.idioma.msgValidarDestino);
        } else if (_this.stGridDetalles.getTotalCount() == 0 && _this.modelo.tipodistribucion == 1) {
            mostrarMensaje(1, _this.idioma.msgValidarCliente);
        } else {
            _this.modelo.salvar(params, function (r) {
                _this.tipoVentana = 2;
                if (_this.winGestionarDocumento && _this.winGestionarDocumento.record == null) {
                    _this.winGestionarDocumento.record = {};
                    Ext.apply(_this.winGestionarDocumento.record, {
                        data: {
                            iddocumento: r.iddocumento,
                            nrodoc: r.nro,
                            numeroref: r.numeroref,
                            fechacontable: r.fecha,
                            tipodestino: r.tipodestino,
                            tipodistribucion: r.tipodistribucion,
                            estado: "1",
                            cant_clientes: r.cantclientes,
                            cant_productos: 0
                        }
                    });
                }
                _this.getTitleDocumento(r.iddocumento);
                _this.listaBotonesVentana.each(function (b) {
                    LOG.util.UIManager.applyKey(b, _this);
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(_this, [b, _this]).call();
                    }
                }, _this);
            });
        }
    },
    cargarProductos: function (parametros) {
        var objParams = parametros || {};
        this.stGridDetalles.load(objParams);
    },
    prepareDocModify: function (d) {
        if (this.fromularioGestion) {
            this.fromularioGestion.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.cargarProductos();
            this.record = d;
            this.getTitleDocumento(this.record.data.iddocumento);
        }
    },
    onShow: function () {
        this.listaBotonesVentana.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.listaBotonesProductos.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
    }
});
