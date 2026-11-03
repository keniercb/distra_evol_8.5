LOG.dist.pedido.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.dist.pedido.Idioma);
        LOG.dist.pedido.VentanaAdicionar.superclass.constructor.call(this, config);
    },

    builComponent: function () {
        //console.info(LOG.dist.pedido.VentanaAdicionar);

        this.idioma = this.idioma || LOG.lb.documento.Idioma;
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

        this.gridProductos = new LOG.dist.pedido.GridProductosExtra({
            idioma: this.idioma,
            title: this.idioma.lbTpProductos,
            modeloP: this.modelo,
            deshabilitar: false,
            vistaP: _this
        });

        this.gridServicios = new LOG.dist.pedido.GridServiciosExtras({
            idioma: this.idioma,
            title: this.idioma.lbTpServicios,
            modeloS: this.modelo,
            deshabilitar: false,
            vistaP: _this
        });

        this.gridReclamos = new LOG.dist.pedido.gridReclamos({
            id: 'idreclamos',
            idioma: this.idioma,
            title: this.idioma.lbTpReclamos,
            modeloR: this.modelo
        });


        this.tapPanel = new LOG.util.UITabTemplate({idioma: _this.idioma, formaVisualizacion: 'panel'});
        this.tapPanel.addTabToTemplete(this.gridProductos);
        this.tapPanel.addTabToTemplete(this.gridServicios);
        this.tapPanel.addTabToTemplete(this.gridReclamos);

        this.tapPanel.init();
        var tap = this.tapPanel.view();
        tap.region = 'center';

        this.tapPanel.on({
            'tabchange': function (tabpanel, panel) {
                if (panel.title == 'Productos') {
                    _this.gridProductos.storePrincipal.load();
                }
                if (panel.title == 'Servicios') {
                    _this.gridServicios.storePrincipal.load();
                }
                if (panel.title == 'Reclamos') {
                    _this.gridReclamos.storePrincipal.load();
                }
            }
        });

        this.panelProductos = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesProductos.getArray()
            }),
            layout: 'border',
            region: 'center',
            items: [tap]
        });

        this.btnSalvar = LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.Prototipos.botonGuardar({
            key:{
                alt:true,
                key:'G'
            },
            tooltip: _this.idioma.ttBtnGuardar,
            handler: this.salvarHandler,
            scope: this
        }));
        this.btnNuevo = LOG.util.UIManager.apply(this.listaBotones.getItem(1), LOG.util.Prototipos.botonNuevo({
            tooltip: _this.idioma.ttBtnNuevo,
            handler: function () {
                if (_this.fromularioGestion) {
                    _this.record = null;
                    _this.fromularioGestion.getForm()._record = null;
                    _this.fromularioGestion.getForm().reset();
                    _this.modelo.reset();
                    _this.tipoVentana=1;
                    _this.gridProductos.storePrincipal.reload();
                    _this.gridServicios.storePrincipal.reload();
                    _this.setTitle(_this.idioma.tlAdicionar);
                    _this.onShow();
                }
            },
            scope: this
        }));
        this.btnCerrar = LOG.util.UIManager.apply(this.listaBotones.getItem(2), LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            text: this.idioma.lbBtnCerrar,
            tooltip: this.idioma.ttBtnCerrarPedido,
            scope: this,
            key: {
                ctrl: true,
                alt: true,
                key: 'X'
            }
        }));

        this.modelo.addActionButton(this.btnSalvar);

        LOG.util.UIManager.apply(this, {
            resizable: false,
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesProductos.getArray()
            }),
            items: [this.panelSuperior, this.panelProductos],
            buttons: [this.btnCerrar, this.btnNuevo, this.btnSalvar]
        });
        LOG.dist.pedido.VentanaAdicionar.superclass.initComponent.call(this);
        this.onShow = this.onShow.createSequence(this.onShowHandler, this);
        this.doLayout();

    },

    onCloseHandler: function (p) {
        var _this = this;
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
        }
        _this.scope.storePrincipal.reload();
        _this.gridProductos.storePrincipal.removeAll();
        _this.gridServicios.storePrincipal.removeAll();
        _this.setTitle(_this.idioma.tlAdicionar);
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },

    onShow: function () {
        var _this = this;
        _this.modelo.gridModificado = false;

        this.listaBotonesProductos.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);

        this.scope.cmbCliente.on({
            'select': function () {
                if ((_this.record && _this.record.data.estado == 1 && _this.fromularioGestion.getForm().isValid() ) || (_this.tipoVentana == 1 && _this.fromularioGestion.getForm().isValid())) {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = false;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                } else {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = true;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                }
            },
            'keyup': function () {
                if ((_this.record && _this.record.data.estado == 1 && _this.fromularioGestion.getForm().isValid() ) || (_this.tipoVentana == 1 && _this.fromularioGestion.getForm().isValid())) {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = false;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                } else {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = true;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                }
            }
        });
        this.scope.fechaVencimiento.on({
            'select': function () {
                if ((_this.record && _this.record.data.estado == 1 && _this.fromularioGestion.getForm().isValid() ) || (_this.tipoVentana == 1 && _this.fromularioGestion.getForm().isValid())) {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = false;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                } else {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = true;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                }
            }
        });
        this.scope.cmbTipopedido.on({
            'select': function () {
                if ((_this.record && _this.record.data.estado == 1 && _this.fromularioGestion.getForm().isValid() ) || (_this.tipoVentana == 1 && _this.fromularioGestion.getForm().isValid())) {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = false;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                } else {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = true;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                }
            }
        });
        this.scope.pedidoObservaciones.on({
            'keyup': function () {
                if ((_this.record && _this.record.data.estado == 1 && _this.fromularioGestion.getForm().isValid() ) || (_this.tipoVentana == 1 && _this.fromularioGestion.getForm().isValid())) {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = false;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                } else {
                    Ext.each(_this.tapPanel.getListTemplate().getArray(), function (tabs) {
                        tabs.deshabilitar = true;
                        tabs.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(this));
                    });
                }
            }
        });

        if (this.tipoVentana == 1) {
            this.tapPanel.setActiveTab(0);
            this.tapPanel.doLayout();
            this.fromularioGestion.getForm().items.items[0].enable();
            this.fromularioGestion.getForm().items.items[1].enable();
            this.fromularioGestion.getForm().items.items[2].enable();

            var fechaHoy = new Date();
            this.fromularioGestion.getForm().items.items[1].fireEvent('select',this.fromularioGestion.getForm().items.items[1],fechaHoy.format('d/m/Y'));
            this.tapPanel.hideTabStripItem(2);
            this.btnNuevo.show();
            this.btnSalvar.show();
            this.gridProductos.lbCantidadText.setText(_this.idioma.lbImporteTotal+': '+0.000000);
            this.gridServicios.lbCantidadText.setText(_this.idioma.lbImporteTotal+': '+0.000000);
            Ext.each(this.tapPanel.getListTemplate().getArray(), function (tabs) {
                tabs.deshabilitar = true;
                tabs.listaBotones.each(function (b) {
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(this, [b, this]).call();
                    }
                }.createDelegate(this));
            });
            this.btnSalvar.setDisabled(true);
        }

       if (this.tipoVentana == 2) {
            this.btnNuevo.show();
            this.btnSalvar.show();
            this.btnSalvar.setDisabled(true);
            if (_this.record.data.estado == 3 || _this.record.data.estado == 2
                || _this.record.data.estado == 9) {
                this.fromularioGestion.getForm().items.items[0].disable();
                this.fromularioGestion.getForm().items.items[1].disable();
                this.fromularioGestion.getForm().items.items[2].disable();
                if(_this.record.data.estado == 2){
                    this.btnNuevo.show();
                    this.tapPanel.hideTabStripItem(2);
                    if (this.tapPanel.getActiveTab().title == 'Reclamos') {
                        this.tapPanel.setActiveTab(0);
                    }
                }else{
                    this.btnNuevo.hide();
                    this.tapPanel.unhideTabStripItem(2);
                }

                Ext.each(this.tapPanel.getListTemplate().getArray(), function (tabs) {
                    tabs.deshabilitar = true;
                    tabs.listaBotones.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }.createDelegate(this));
                });
                this.btnSalvar.hide();

            } else {
                var fechaHoy = new Date();
                if(_this.record.data.estado == 1 && _this.record.data.fechavencimiento < fechaHoy.format('d/m/Y')){
                    this.fromularioGestion.getForm().items.items[1].fireEvent('select',this.fromularioGestion.getForm().items.items[1],fechaHoy.format('d/m/Y'));
                    this.btnSalvar.setDisabled(false);
                }
                this.fromularioGestion.getForm().items.items[0].enable();
                this.fromularioGestion.getForm().items.items[1].enable();
                this.fromularioGestion.getForm().items.items[2].enable();
                if(this.tapPanel.getActiveTab().title == 'Reclamos'){
                    this.tapPanel.setActiveTab(0);
                }
                this.tapPanel.hideTabStripItem(2);
                this.tapPanel.doLayout();
                Ext.each(this.tapPanel.getListTemplate().getArray(), function (tabs) {
                    tabs.deshabilitar = false;
                    tabs.listaBotones.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }.createDelegate(this));
                });
            }
            if (this.tapPanel.getActiveTab().title == 'Productos') {
                _this.gridProductos.storePrincipal.load();
            }
            if (this.tapPanel.getActiveTab().title == 'Servicios') {
                _this.gridServicios.storePrincipal.load();
            }
            if (this.tapPanel.getActiveTab().title == 'Reclamos') {
                _this.gridReclamos.storePrincipal.load();
            }
        }


        this.gridProductos.gpPrincipal.on('afteredit', this.activarBoton, this);
        this.gridProductos.gpPrincipal.on('beforeedit' , function(e){
            if(_this.record && _this.record.data.estado != 1){
                e.cancel=true;
            }
        });
    },

    salvarHandler: function (elemento) {
        var _this = (elemento)?elemento:((this.scope)?this.scope:this);
        if (_this.modelo.listaProductosExtras.count() == 0 && _this.modelo.listaServiciosExtras.count() == 0
            && _this.record && _this.record.data.productos == 0 && _this.record.data.servicios == 0) {
            mostrarMensaje(1, _this.idioma.msgValidarCant);
        } else {
                _this.modelo.salvar({
                    productosExtras: Ext.encode(_this.modelo.listaProductosExtras.getArray()),
                    productosContratados: 'productos contratados',
                    identidad:_this.scope.idEntidad,
                    serviciosExtras: Ext.encode(_this.modelo.listaServiciosExtras.getArray()),
                    serviciosControtatados: 'servicios contratados'
                }, function (r) {
                    _this.tipoVentana = 2;
                    if (_this.record == null) {
                        _this.record = {};
                        Ext.apply(_this.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    }else{
                        _this.record.data.fechavencimiento = _this.scope.fechaVencimiento.value;
                    }
                    _this.cargarProductos(r);
                    _this.onShow();
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

    cargarProductos: function (d) {
        var _this = this;
        _this.gridProductos.storePrincipal.on({
            'beforeload': function () {
                if (_this.tipoVentana == 1) {
                    _this.gridProductos.storePrincipal.initBaseParams.idpedido = 0;
                } else {
                    if (d.data) {
                        _this.gridProductos.storePrincipal.initBaseParams.idpedido = d.data.iddocumento;
                    } else {
                        _this.gridProductos.storePrincipal.initBaseParams.idpedido = d.iddocumento;
                    }

                }
            },
            'load': function (st, records, op) {
                if(st.data.items[0]){
                    _this.gridProductos.lbCantidadText.setText(_this.idioma.lbImporteTotal+' : '+' '+(st.data.items[0].json.importeTotal).toFixed(2));
                }else{
                    _this.gridProductos.lbCantidadText.setText(_this.idioma.lbImporteTotal+': '+0.00);
                }
                _this.modelo.listaProductosExtras.deleteAll();
                _this.modelo.gridModificado = false;
                Ext.each(records, function (obj) {
                    _this.modelo.listaProductosExtras.add(obj.data);
                });
            }
        });

        _this.gridServicios.storePrincipal.on({
            'beforeload': function () {
                if (_this.tipoVentana == 1) {
                    _this.gridServicios.storePrincipal.initBaseParams.idpedido = 0;
                } else {
                    if (d.data) {
                        _this.gridServicios.storePrincipal.initBaseParams.idpedido = d.data.iddocumento;
                    } else {
                        _this.gridServicios.storePrincipal.initBaseParams.idpedido = d.iddocumento;
                    }
                }
            },
            'load': function (st, records, op) {
                if(st.data.items[0]){
                    _this.gridServicios.lbCantidadText.setText(_this.idioma.lbImporteTotal+': '+' '+(st.data.items[0].json.importeTotal).toFixed(2));
                }else{
                    _this.gridServicios.lbCantidadText.setText(_this.idioma.lbImporteTotal+': '+0.00);
                }
                _this.modelo.listaServiciosExtras.deleteAll();
                Ext.each(records, function (obj) {
                    _this.modelo.listaServiciosExtras.add(obj.data);
                });
            }
        });
        if (this.modelo.sm.getSelected() && this.modelo.sm.getSelected().data.estado == 3) {
            _this.gridReclamos.storePrincipal.on({
                'beforeload': function () {
                    if (d.data) {
                        _this.gridReclamos.storePrincipal.initBaseParams.idpedido = d.data.iddocumento;
                    } else {
                        _this.gridReclamos.storePrincipal.initBaseParams.idpedido = d.iddocumento;
                    }
                }
            });
        }
    },

    activarBoton: function () {
        if (this.fromularioGestion.getForm().isValid()) {
            this.modelo.gridModificado = true;
            this.btnSalvar.setDisabled(false);
        }
    },

    prepareDocModify: function (d) {
        if (this.tipoVentana == 2) {
            this.fromularioGestion.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.record = d;
            this.record.data.idcliente = this.record.data.cliente;
            this.getTitleDocumento(this.record.data.iddocumento);
            this.cargarProductos(d);
        }
    },

    ocultarColumna: function (dataIndex, ocultar) {

    }
});

LOG.dist.pedido.GridServiciosExtras = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        config.urlBusquedaGridPrincipal = 'cargarServiciosExtras';
        this.autoLoad = false;
        this.concepto = 'servicio(s) del pedido';
        this.busquedaBasica = true;
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.dist.pedido.Idioma);
        this.modeloS = config.modeloS ? config.modeloS : config.modelo;
        this.deshabilitar = config.deshabilitar;
        this.modoSeleccion = 3;
        this.idGridPrincipal = 'idproductopedido';
        this.vistaP = config.vistaP;
        LOG.dist.pedido.GridServiciosExtras.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.dist.pedido.GridServiciosExtras.superclass.init.call(this);
        var _this = this;
        if (_this.modeloS.tipopedido == 1) {
            this.panelServiciosContratados = new LOG.dist.pedido.panelServiciosContratados({
                idioma: this.idioma
            });
            this.panelServiciosContratados.init();
            var vista = this.panelServiciosContratados.view();
            vista.region = 'west';
            vista.width = '50%';
            this.getPanelGrid().onRender = this.getPanelGrid().onRender.createSequence(function () {
                this.getPanelGrid().add(vista);
            }, this);
        }

        this.lbCantidadText = new Ext.form.Label({
            text: 'Importe total:',
            style: 'font-weight: bolder'
        });

        this.panelImporte = LOG.util.UIManager.initPanel({
            region: 'south',
            layout: 'form',
            tbar : LOG.util.UIManager.initToolbar({
                items: ['->',this.lbCantidadText]
            })
        });

        this.getPanelGrid().onRender = this.getPanelGrid().onRender.createSequence(function () {
            this.getPanelGrid().add(this.panelImporte);
        }, this);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idproductopedido',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 80,
            dataIndex: 'codigo',
            default: true
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
            header: this.idioma.cgDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: 'Tarifa',
            dataIndex: 'precio',
            align: 'right',
            default: true
        });
    },

    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Servicios',
            tooltip:_this.idioma.ttBtnServicios,
            iconCls: 'servicio',
            handler: function () {
                _this.showWindowServicios();
            },
            controlFn: function (b, _caller) {
                if (_this.deshabilitar) {
                    b.disable();
                } else {
                    b.enable();
                }
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            disabled: true,
            text: _this.idioma.lbEliminar,
            iconCls: 'eliminar',
            tooltip:_this.idioma.ttBtnServicioDEL,
            handler: function () {
                var listaServicios = new LOG.util.List();
                var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    listaServicios.add(seleccion[i].data.idproductopedido);
                }
                _this.modeloS.eliminarProducto(listaServicios, _this.storePrincipal);
            },
            controlFn: function (b, _caller) {
                if (_this.deshabilitar) {
                    b.disable();
                } else {
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (!_this.deshabilitar && _caller.getGridPrincipal().getSelectionModel().hasSelection()) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                }
            }
        }));

    },
    showWindowServicios: function () {
        var _this = this;
        var _this = this;
        LOG.inv.maestroproductos.Loader.init(function () {
            var v = new LOG.lb.maestroproductos.UIProductos({
                tipo: 2,
                usarAplicar: true,
                parametros: {
                     idseleccionados: Ext.encode(_this.storePrincipal.collect('idproducto'))
                },
                doAction: function (r) {

                    var record = [];
                    var listaServ = new LOG.util.List();
                    var _idproductos = [];
                    Ext.each(r, function (obj) {
                        var objSi = obj;
                        objSi.data.idproducto = obj.id;
                        record.push(objSi);
                        listaServ.add(objSi.data);
                        _this.modeloS.listaServiciosExtras.add(objSi.data);
                        _idproductos.push(obj.json.idindicador)
                    })
                    _this.storePrincipal.add(record);

                    if (!_this.vistaP.record) {
                        _this.vistaP.salvarHandler(_this.vistaP);
                    } else {
                        _this.modeloS.adicionarProducto(_this.vistaP.record.data.iddocumento, listaServ, 1, _this.storePrincipal);
                    }

                    if (v.isVisible()) {
                        v.panelProductos.getStorePrincipal().reload(
                            v.parametros.idseleccionados = Ext.encode(Ext.decode(v.panelProductos.getStorePrincipal().baseParams.idseleccionados).concat(_idproductos))
                        );
                    }
                }
            });
            v.show();
        });
    }
});

LOG.dist.pedido.panelServiciosContratados = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        this.urlBusquedaGridPrincipal = 'cargarProductosDocumento';
        this.autoLoad = false;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 1;
        LOG.dist.pedido.panelServiciosContratados.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.dist.pedido.panelServiciosContratados.superclass.init.call(this);
    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            handler: function () {

            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (_caller.getGridPrincipal().getSelectionModel().hasSelection()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idservicio',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 80,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        })
    }
});


LOG.dist.pedido.GridProductosExtra = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        var _this = this;
        this.formaVisualizacion = 'panel';
        config.urlBusquedaGridPrincipal = 'cargarProductosExtras';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.dist.pedido.Idioma);
        this.gridEditable = true;
        this.modoSeleccion = 3;
        this.concepto = 'producto(s) del pedido';
        this.autoLoad = false;
        this.idGridPrincipal = 'idproductopedido';
        this.busquedaBasica = true;
        this.deshabilitar = config.deshabilitar;
        this.modeloP = config.modeloP ? config.modeloP : config.modelo;
        this.vistaP = config.vistaP;
        LOG.dist.pedido.GridProductosExtra.superclass.constructor.call(this, config);
    },

    init: function () {
        LOG.dist.pedido.GridProductosExtra.superclass.init.call(this);
        var _this = this;
        if (this.modeloP.tipopedido == 1) {
            this.panelProductosContratados = new LOG.dist.pedido.panelProductosContratados({
                idioma: _this.idioma
            });
            this.panelProductosContratados.init();
            var vista = this.panelProductosContratados.view();
            vista.region = 'west'
            vista.width = '70%';
            this.getPanelGrid().onRender = this.getPanelGrid().onRender.createSequence(function () {
                this.getPanelGrid().add(vista);
            }, this);
        }

        this.lbCantidadText = new Ext.form.Label({
            text: _this.idioma.lbImporteTotal+ ':',
            style: 'font-weight: bolder'
        });

        this.panelImporte = LOG.util.UIManager.initPanel({
            region: 'south',
            layout: 'form',
            tbar : LOG.util.UIManager.initToolbar({
                items: ['->',this.lbCantidadText]
            })
        });
        this.getPanelGrid().onRender = this.getPanelGrid().onRender.createSequence(function () {
            this.getPanelGrid().add(this.panelImporte);
        }, this);

    },

    initDefaultColumns: function () {
        this.listaColumnas.deleteAll();
        this.addGridColumn({
            dataIndex: 'idproductopedido',
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
            header: 'Existe',
            width: 55,
            dataIndex: 'existe',
            align: 'center',
            renderer: function (value, metaData) {
                if (value == 'true' || value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                }
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        this.cantidad = LOG.util.Prototipos.inputEntero({
            allowBlank: false
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            dataIndex: 'cantidad',
            align: 'right',
            editor: this.deshabilitar ? null : this.cantidad,
            default: true,
            renderer: function (v) {
                if (v == null) {
                    return 0
                }
                return v;
            }
        });
        this.addGridColumn({
            header: 'Precio',
            dataIndex: 'precio',
            align: 'right',
            default: true
        });
        this.addGridColumn({
            header: 'Importe',
            dataIndex: 'importe',
            align: 'right',
            default: true,
            renderer: function (id, obj, st) {
                if (st.data.cantidad && st.data.precio) {
                    return (st.data.cantidad * st.data.precio ).toFixed(6);
                } else {
                    return 0.000000;
                }
            }
        });
        this.checkCapacidadLiquida = new Ext.grid.CheckColumn({
            header: 'Capacidad líquida',
            dataIndex: 'capacidadliquida',
            rowSelection: true
        });
        this.addGridPlugin(this.checkCapacidadLiquida);
        this.addGridColumn(this.checkCapacidadLiquida);
        this.addGridColumn({
            header: 'Sustituto',
            dataIndex: 'sustituto',
            align: 'right',
            default: true
        });
    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbProducto,
            tooltip:_this.idioma.ttBtnProducto,
            iconCls: 'producto',
            handler: function () {
                _this.showWindowProducto();
            },
            controlFn: function (b, _caller) {
                if (_this.deshabilitar) {
                    b.disable();
                } else {
                    b.enable();
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            disabled: true,
            text: _this.idioma.lbEliminar,
            iconCls: 'eliminar',
            tooltip:_this.idioma.ttBtnProductoDEL,
            handler: function () {
                var listaProductos = new LOG.util.List();
                var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    listaProductos.add(seleccion[i].data.idproductopedido);
                }
                _this.modeloP.eliminarProducto(listaProductos, _this.storePrincipal);
            },
            controlFn: function (b, _caller) {
                if (_this.deshabilitar) {
                    b.disable();
                } else {
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (!_this.deshabilitar && _caller.getGridPrincipal().getSelectionModel().hasSelection()) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                }
            }
        }));
    },

    showWindowProducto: function () {
        var _this = this;
        LOG.inv.maestroproductos.Loader.init(function () {
            var v = new LOG.lb.maestroproductos.UIProductos({
                tipo: 1,
                usarAplicar: true,
                parametros: {
                     idseleccionados: Ext.encode(_this.storePrincipal.collect('idproducto'))
                },
                doAction: function (r) {
                    var record = [];
                    var listaProd = new LOG.util.List();
                    var _idproductos = [];
                    Ext.each(r, function (obj) {
                        var objSi = obj;
                        objSi.data.idproducto = obj.id;
                        record.push(objSi);
                        _this.modeloP.listaProductosExtras.add(objSi.data);
                        listaProd.add(objSi.data);
                        _idproductos.push(obj.json.idindicador)
                    });
                    _this.storePrincipal.add(record);
                    if (!_this.vistaP.record) {
                        _this.vistaP.salvarHandler(_this.vistaP);
                    } else {
                        _this.modeloP.adicionarProducto(_this.vistaP.record.data.iddocumento, listaProd, 0, _this.storePrincipal);
                    }

                    if (v.isVisible()) {
                        v.panelProductos.getStorePrincipal().reload(
                            v.parametros.idseleccionados = Ext.encode(Ext.decode(v.panelProductos.getStorePrincipal().baseParams.idseleccionados).concat(_idproductos))
                        );
                    }
                }
            });
            v.show();
        });
    }
});

LOG.dist.pedido.panelProductosContratados = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        this.urlBusquedaGridPrincipal = 'cargarProductosDocumento';
        this.autoLoad = false;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 1;
        LOG.dist.pedido.panelProductosContratados.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.dist.pedido.panelProductosContratados.superclass.init.call(this);
    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            handler: function () {

            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (_caller.getGridPrincipal().getSelectionModel().hasSelection()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCodigo,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        })
        this.addGridColumn({
            header: _this.idioma.cgCantidad,
            dataIndex: 'cantidad',
            default: true
        });
    }
});

LOG.dist.pedido.gridReclamos = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        this.urlBusquedaGridPrincipal = 'cargarReclamos';
        this.autoLoad = false;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 3;
        this.concepto = 'reclamo(s) del pedido';
        this.busquedaBasica = true;
        this.modeloR = config.modeloR ? config.modeloR : config.modelo;
        config.idioma = LOG.util.UIManager.apply(LOG.dist.pedido.Idioma, LOG.util.Idioma);
        LOG.dist.pedido.gridReclamos.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.dist.pedido.gridReclamos.superclass.init.call(this);
    },

    initDefaultButtons: function () {
        var _this = this;
        this.cmbTiporeclamoWin = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTiporeclamo',
            idnom: 'idtiporeclamo',
            name: 'idtiporeclamo',
            anchor: '90%',
            editable: false,
            autoCargar: true
        });
        this.addToolbarButton(LOG.util.UIManager.createBtn(
            {
                iconCls: 'reclamacion',
                text: _this.idioma.lbReclamar,
                tooltip: _this.idioma.ttAddReclamo,
                handler: function () {
                    if (_this.cmbTiporeclamoWin.stCombo.getCount() == 0) {
                        mostrarMensaje(1, _this.idioma.msjConfigurarTipoReclamo);
                    } else {
                        this.ventanaReclamo = new LOG.dist.pedido.ventanaReclamo({
                            iddocumento: _this.storePrincipal.initBaseParams.idpedido,
                            storePrincipal: _this.storePrincipal
                        });
                        this.ventanaReclamo.show();
                    }
                }
            }
        ));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            disabled: true,
            text: _this.idioma.lbEliminar,
            iconCls: 'eliminar',
            tooltip: _this.idioma.ttEliminarReclamo,
            handler: function () {
                var listaReclamos = new LOG.util.List();
                var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    listaReclamos.add(seleccion[i].data.idreclamopedido);
                }

                _this.modeloR.eliminarReclamo(listaReclamos, _this.storePrincipal);
            },
            controlFn: function (b, _caller) {

                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if ( _caller.getGridPrincipal().getSelectionModel().hasSelection()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });

            }
        }));
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idreclamopedido',
            hidden: true
        });
        this.addGridColumn({
            header: _this.idioma.lbTipoReclamo,
            dataIndex: 'tiporeclamo',
            width: 200,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbFechaRegistro,
            dataIndex: 'fechasugerida',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbObservaciones,
            dataIndex: 'descripcion',
            autoExpand: true,
            default: true
        })
    }
});


LOG.dist.pedido.ventanaReclamo = Ext.extend(LOG.util.Window, {
    listaBotones: undefined,
    proceso: false,
    constructor: function (config){
        config.width = 500;
        config.height = 230;
        config.constrain = true;
        config.resizable = false;
        this.usarAplicar = false;
        this.listaBotonesVentana = new LOG.util.List();
        config.idioma = LOG.util.UIManager.apply(LOG.dist.pedido.Idioma, LOG.util.Idioma);
        this.initComponents(config);

        LOG.dist.pedido.ventanaReclamo.superclass.constructor.call(this, config);
        this.modelo = new LOG.dist.pedido.Model({
            idioma: config.idioma,
            urlController: '/logistica/distribucion/pedido/index.php/pedido/'
        });
        this.setTitle(config.idioma.tReclamar);
        this.panelDatos();
    },
    initComponents: function (config) {
        var _this = this;
        this.listaBotonesVentana.add(LOG.util.Prototipos.botonCancelar({
            text: config.idioma.lbBtnCerrar,
            tooltip: config.idioma.lbTipBtnCerrarReclamo,
            handler: function () {
                _this.close();
            }
        }));
        this.listaBotonesVentana.add(LOG.util.Prototipos.botonNuevo({
            text: config.idioma.lbBtnNuevo,
            tooltip: config.idioma.lbTipBtnNuevoReclamo,
            handler: function () {
                _this.panel.getForm().reset();
            }
        }));
        this.listaBotonesVentana.add(LOG.util.Prototipos.botonGuardar({
            text: config.idioma.lbBtnGuardar,
            tooltip: config.idioma.lbTipBtnGuardarReclamo,
            disabled: true,
            handler: function () {
                if (_this.panel.getForm().isValid()) {
                    var idtiporeclamo = _this.cmbTiporeclamo.getValue();
                    var descripcion = _this.reclamoDescripcion.getValue();
                    var fechasugerida = _this.fechaSugerida.getValue();
                    _this.modelo.adicionarReclamo(_this.iddocumento, idtiporeclamo, descripcion, fechasugerida, _this.storePrincipal);
                    _this.close();
                }
            }
        }));

        document.onkeyup = function (e) {
            if (e.altKey) {
                if (e.which == Ext.EventObject.N) {
                    _this.panel.getForm().reset();
                }
                if (e.which == Ext.EventObject.X) {
                    _this.close();
                }
                if (e.which == Ext.EventObject.G) {
                    if (_this.panel.getForm().isValid()) {
                        var idtiporeclamo = _this.cmbTiporeclamo.getValue();
                        var descripcion = _this.reclamoDescripcion.getValue();
                        var fechasugerida = _this.fechaSugerida.getValue();
                        _this.modelo.adicionarReclamo(_this.iddocumento, idtiporeclamo, descripcion, fechasugerida, _this.storePrincipal);
                        _this.close();
                    }
                }
            }
            if(e.ctrlKey){
                if (e.altKey) {
                    if (e.which == Ext.EventObject.X) {
                        _this.close();
                    }
                }
            }
        };

        config.buttons = this.listaBotonesVentana.getArray();
    },
    panelDatos: function () {
        var _this = this;

        this.cmbTiporeclamo = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTiporeclamo',
            idnom: 'idtiporeclamo',
            name: 'idtiporeclamo',
            anchor: '90%',
            allowBlank: false,
            editable: false,
            autoCargar: true,
            fieldLabel: _this.idioma.lbTipoReclamo,
            emptyText: _this.idioma.lbSeleccione,
            listeners:{
                'select': function(){
                    if(_this.panel.getForm().isValid()){
                        _this.listaBotonesVentana.getItem(2).enable();
                    }else{
                        _this.listaBotonesVentana.arrayData[2].disable();
                    }
                }

            }
        });
        Ext.apply(this.cmbTiporeclamo, {
            editable: false
        });

        this.reclamoDescripcion = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbObservaciones,
            name: 'descripcion',
            maxLength: 255,
            minLength: 2,
            maxLengthText: _this.idioma.lbMsgMaxLongObservaciones,
            minLengthText: _this.idioma.lbMsgMinLongObservaciones,
            enableKeyEvents: true,
            allowBlank: false,
            listeners:{
                'keyup': function(){
                    if(_this.panel.getForm().isValid()){
                        _this.listaBotonesVentana.getItem(2).enable();
                    }else{
                        _this.listaBotonesVentana.arrayData[2].disable();
                    }
                }

            }
        });

        this.fechaSugerida = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbFechaRegistro,
            name: 'fechasugerida',
            editable: false,
            allowBlank: false,
            listeners:{
                'select': function(){
                    if(_this.panel.getForm().isValid()){
                        _this.listaBotonesVentana.getItem(2).enable();
                    }else{
                        _this.listaBotonesVentana.arrayData[2].disable();
                    }
                }

            }
        });

        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.clsSuperior.addComponent(this.cmbTiporeclamo);
        this.clsSuperior.addComponent(this.fechaSugerida);

        this.clsDescripcion = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.clsDescripcion.addComponent(this.reclamoDescripcion);

        this.panel = LOG.util.UIManager.initForm({
            frame: true,
            layout: 'form',
            labelAlign: 'top',
            region: 'center',
            items: [this.clsSuperior, this.clsDescripcion]
        });
        this.add(this.panel);
    },
    onCloseHandler: function(p) {
        p.destroy();
        return false;
    }
});

LOG.dist.pedido.EstadoPedido = {

    1: 'No procesado',

    2: 'En proceso',

    3: 'En distribución',

    4: 'Cumplimentado'
};

LOG.dist.pedido.ComboEntidades = function() {
    function initComboDeposito(v, scope) {
        scope.comboEntidades = new LOG.util.ComboBox({width: 300, url: 'getEntidades', valueField: 'id', displayField: 'text'});

        scope.comboEntidades.getStore().on({
            'load': function(st, rd) {
                if (rd.length > 0) {
                    var datos = rd[0].data;
                    if(rd[0].json.entidadunica){
                        scope.comboEntidades.setValue(rd[0].json.entidadunica);
                        scope.comboEntidades.setDisabled(true);
                    }else{
                        scope.comboEntidades.setValue(datos.id);
                    }
                }
            }
        });

        scope.comboEntidades.fireEvent = scope.comboEntidades.fireEvent.createSequence(function(e, args) {
            if ('valuechange' == e) {
                if (String(v.idEntidad) !== String(args)) {
                    v.getStorePrincipal().initBaseParams.identidad = args;
                    v.getStorePrincipal().load({
                        params : {
                            identidad : args
                        }
                    });
                    v.idEntidad = args;
                    var datos = scope.comboEntidades.getStore().data.items;
                    Ext.each(datos, function(rec,index) {
                        if (rec.data.id ==  v.idEntidad) {
                            v.nomEntidad =  rec.data.text;
                        }
                    });
                }
            }
        });
    }
    return {
        init: function(v) {
            v.autoLoad = false;
            v.getPanelSuperior().onRender = v.getPanelSuperior().onRender.createSequence(function() {
                initComboDeposito(v, this);
                v.getPanelSuperior().add({
                    border: false,
                    tbar: ['-', '->', LOG.dist.pedido.Idioma.lbEntidad, '', this.comboEntidades]
                });
                v.getPanelSuperior().doLayout();
            });
        }
    };
};
