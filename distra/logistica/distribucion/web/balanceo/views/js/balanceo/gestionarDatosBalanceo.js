// Este fichero es el de la vista de Balanceo de los 3 Grids
// Grid Principal donde aparecen los productos.
LOG.dist.balanceo.VpGestionarDatosBalanceo = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    estadoDoc: undefined,
    parentView: undefined,

    constructor: function (config) {
        var _this = this;
        LOG.util.UIManager.apply(config.idioma, LOG.dist.balanceo.Idioma);
        this.modelo = new LOG.dist.balanceo.Model({
            idioma: config.idioma
        });

        this.busquedaBasica = true;
        //this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'cargarProductos';
        this.dirController = '/logistica/distribucion/balanceo/index.php/balanceo';
        this.autoLoad = true;
        this.autoSelect = false;
        this.keepSelected = false;
        this.baseParams = {iddocumento: config.iddocumento};
        this.listaPedidos = [];
        this.parentView = config.parentView;
        this.idGridPrincipal = 'idproductosbalanceo';
        this.estadoDoc = config.estadoDoc;

        LOG.dist.balanceo.VpGestionarDatosBalanceo.superclass.constructor.call(this, config);

        _this.listaAcciones = _this.parentView.scope ? _this.parentView.scope.listaAcciones : _this.parentView.listaAcciones;
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            default: false,
            dataIndex: _this.idGridPrincipal
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });

        this.addGridColumn({
            header: 'C&oacute;digo',
            width: 120,
            default: false,
            dataIndex: 'codigo'
        });

        this.addGridColumn({
            header: 'Denominaci&oacute;n',
            width: 480,
            default: true,
            autoExpand: true,
            dataIndex: 'denominacion'
        });

        this.addGridColumn({
            header: 'UM',
            width: 40,
            dataIndex: 'unidadmedida',
            default: true
        });

        this.addGridColumn({
            header: 'ABC',
            width: 40,
            dataIndex: 'abc',
            default: true
        });

        this.addGridColumn({
            header: 'Total pedidos',
            width: 80,
            dataIndex: 'totalpedidos',
            default: true,
            type: 'decimal',
            align: 'right',
            renderer: function (value, md, r) {
                if (!r.json.idproductoasustituir) {
                    if (+r.json.totalconsustitutos_distribuidos + +r.json.totalconsustitutos_acomprar == +value) {
                        return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                    } else if (+r.json.totalconsustitutos_distribuidos + +r.json.totalconsustitutos_acomprar > +value) {
                        return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                    }
                    return '<b>' + value + '</b>';
                } else {
                    return value;
                }
            }
        });
        this.addGridColumn({
            header: 'Total distribuidos',
            width: 80,
            dataIndex: 'totaldistribuidos',
            default: true,
            type: 'decimal',
            align: 'right',
            renderer: function (value, md, r) {
                if (!r.json.idproductoasustituir) {
                    return '<b>' + value + '</b>';
                } else {
                    return value;
                }
            }
        });
        this.addGridColumn({
            header: 'Total a comprar',
            width: 80,
            dataIndex: 'totalcomprar',
            default: true,
            type: 'decimal',
            align: 'right',
            renderer: function (value, md, r) {
                if (!r.json.idproductoasustituir) {
                    return '<b>' + value + '</b>';
                } else {
                    return value;
                }
            }
        });

        this.addGridColumn({
            header: 'Pendientes',
            width: 80,
            default: true,
            type: 'decimal',
            align: 'right',
            renderer: function (value, md, r) {
                if (r.json.idproductoasustituir) {
                    return 0.00;
                }
                var valor = +r.json.totalpedidos - (+r.json.totalconsustitutos_distribuidos + +r.json.totalconsustitutos_acomprar);
                if (valor < 0) {
                    return '<b><span style="color:#FF5154";>' + valor.toFixed(2) + '</span></b>';
                } else {
                    return '<b>' + valor.toFixed(2) + '</b>';
                }
            }
        });

        this.addGridColumn({
            header: 'Sust.',
            width: 40,
            dataIndex: 'sustituto',
            default: true,
            renderer: function (value, md, r) {
                if (r.json.idproductoasustituir) {
                    return 'SI'
                } else
                    return 'NO';
            }
        });
        this.addGridColumn({
            header: 'Producto a sustituir',
            width: 200,
            dataIndex: 'productoasustituir',
            default: true
        });

    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: 'Adicionar pedido',
            isContextual: true,
            disabled: false,
            handler: function () {
                _this.openWinAddPedido();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REditar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: 'Eliminar producto',
            isContextual: true,
            disabled: false,
            handler: function () {
                _this.eliminarProducto();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REditar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: 'Confirmar',
            isContextual: true,
            disabled: false,
            handler: function () {

                _this.parentView.modelo.confirmar(
                    null,
                    function (resp) {
                        var newEstado = 2;
                        _this.estadoDoc = newEstado;
                        _this.gestionarBotones();
                        if (typeof _this.parentView.setEstadoDoc == 'function') {
                            _this.parentView.setEstadoDoc(newEstado);
                        }

                    },
                    function (resp) {
                        if (resp.codigoMsg == 'CANT_ERRORNEAS') {
                            mostrarMensaje(3, _this.idioma.msgDocumentoConfirmadoFailCant);
                        } else {
                            mostrarMensaje(3, _this.idioma.msgDocumentoConfirmadoFail);
                        }
                    })
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: 'Anular estado',
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.parentView.modelo.anularestado(null,
                    function (resp) {
                        var newEstado = 1;
                        _this.estadoDoc = newEstado;
                        _this.gestionarBotones();
                        if (typeof _this.parentView.setEstadoDoc == 'function') {
                            _this.parentView.setEstadoDoc(newEstado);
                        }
                    },
                    function (resp) {
                        mostrarMensaje(3, 'El documento no se pudo anular.');
                    }
                );
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnular') || _this.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));

        // Botones del grid
        this.btnSustituir = LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: 'Sustituir',
            disabled: true,
            handler: function () {
                var idindicador = _this.smGridPrincipal.getSelected().json.idindicador;
                var idproductosbalanceo = _this.smGridPrincipal.getSelected().json.idproductosbalanceo;
                const fn = function () {
                    _this.getGridPrincipal().getStore().reload({
                        params: {
                            iddocumento: _this.iddocumento
                        }
                    });
                };
                _this.modelo.sustituirProducto(_this.iddocumento, idproductosbalanceo, idindicador, fn);
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REditar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.addToolbarButton(this.btnSustituir);

        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: 'Aprobar',
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.parentView.modelo.aprobar(null,
                    function (resp) {

                        var newEstado = 3;
                        _this.estadoDoc = newEstado;
                        _this.gestionarBotones();
                        if (typeof _this.parentView.setEstadoDoc == 'function') {
                            _this.parentView.setEstadoDoc(newEstado);
                        }
                    }
                );
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: 'Imprimir',
            isContextual: true,
            disabled: true,
            handler: function () {

            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));


    },
    render: function () {
        var _this = this;

        LOG.dist.balanceo.VpGestionarDatosBalanceo.superclass.render.call(this);
        var tBar = this.gpPrincipal.getTopToolbar();
        tBar.insert(0, '->');
        //tBar.insert(0, this.btnSustitutos);
        //tBar.insert(0, this.btnSustituir);
        tBar.insert(0, '-');


        LOG.util.UIManager.encadenaFn(_this.smGridPrincipal, 'fireEvent', function (e, _sm, _index, _r) {
            if (e == 'rowselect') {
                _this.btnSustituir.enable();
                _this.vpPedidos.cargaPedidos(_r.json.idproductosbalanceo);
                _this.vpExistencias.cargarExistencias(_r.json.idindicador);
            }
        }, '_cargar');

        _this.modelo.cargarPedidosDeDocumento(_this.iddocumento)
            .then(function (idpedidos) {
                _this.listaPedidos = idpedidos
            })
            .catch(err => console.log(err));

        _this.gestionarBotones();
    },
    init: function () {
        LOG.dist.balanceo.VpGestionarDatosBalanceo.superclass.init.call(this);
        this.createPanelderecho();
        this.panelGrid.add(this.panelDerecho);


    },
    createPanelderecho: function () {
        var _this = this;

        var onChangePedido = function (record) {
            var _this = this;
            var idindicador = _this.smGridPrincipal.getSelected().json.idindicador;
            var idproductobalanceopedido = record.json.idproductobalanceopedido;
            vpExistencias.cargarExistencias(idindicador, idproductobalanceopedido);

            _this.panelDerecho.items.items[1].setTitle('Distribuci&oacute;n del pedido <span style="color:#FF5154";><u><b>No. ' + record.json.nropedido + '</b></u></span> del cliente: <span style="color:#FF5154";><u><b>' + record.json.cliente + '</b></u></span>');

        };

        var loadGrid = function () {
            var _this = this;

            const lastOptions = _this.getGridPrincipal().getStore().lastOptions || {params: {}};
            Ext.apply(lastOptions.params, {
                iddocumento: _this.iddocumento
            });
            _this.getGridPrincipal().getStore().reload(lastOptions);
        }


        var vpPedidos = new LOG.dist.balanceo.GpPedidos({
            idioma: _this.idioma,
            formaVisualizacion: 'panel',
            modoSeleccion: 1,
            loadMainGrid: loadGrid.bind(_this),
            cambiandoPedido: onChangePedido.bind(_this),
            iddocumento: _this.iddocumento
        });

        vpPedidos.init();
        vpPedidos.view();

        var loadPedidos = function () {
            const lastOptions = _this.vpPedidos.getStorePrincipal().lastOptions || {params: {}};
            Ext.apply(lastOptions.params, {});
            _this.vpPedidos.getStorePrincipal().reload(lastOptions);
        }

        var onClickAnteriorAction = () => {
            if (this.vpPedidos.getSmPrincipal().hasSelection() && this.vpPedidos.getSmPrincipal().hasPrevious()) {
                this.vpPedidos.getSmPrincipal().selectPrevious(false);
            } else {
                this.vpPedidos.getSmPrincipal().selectLastRow(false);
            }
        };
        var onClickSiguienteAction = () => {
            if (this.vpPedidos.getSmPrincipal().hasSelection() && this.vpPedidos.getSmPrincipal().hasNext()) {
                this.vpPedidos.getSmPrincipal().selectNext(false);
            } else {
                this.vpPedidos.getSmPrincipal().selectFirstRow(false);
            }
        };

        var vpExistencias = new LOG.dist.balanceo.GpExistencias({
            idioma: _this.idioma,
            formaVisualizacion: 'panel',
            modoSeleccion: 1,
            busquedaBasica: true,
            textBusquedaSimple: 'Agencia, Depósito',
            grdiPedidos: vpPedidos,
            loadMainGrid: loadGrid.bind(_this),
            loadGridPedidos: loadPedidos.bind(_this),
            iddocumento: _this.iddocumento,
            onClickAnterior: onClickAnteriorAction.bind(_this),
            onClickSiguiente: onClickSiguienteAction.bind(_this)
        });

        vpExistencias.init();
        vpExistencias.view();

        _this.vpPedidos = vpPedidos;
        _this.vpExistencias = vpExistencias;


        this.panelDerecho = new Ext.Panel({
            width: window.innerWidth / 2,
            layout: 'border',
            region: 'east',
            animCollapse: false,
            collapsible: true,
            collapsed: false,
            split: true,
            titleCollapse: true,
            collapseMode: 'mini',
            items: [{
                title: 'Pedidos del producto',
                region: 'north',
                border: false,
                layout: 'fit',
                height: window.innerHeight / 3,
                items: [_this.vpPedidos.getPanelPrincipal()],
                animCollapse: false,
                collapsible: true,
                collapsed: false,
                split: true,
                titleCollapse: true,
                collapseMode: 'mini'
            }, {
                title: 'Distribuci&oacute;n del pedido ...',
                region: 'center',
                layout: 'fit',
                border: false,

                items: [_this.vpExistencias.getPanelPrincipal()],

            }]
        });
    },
    abrirVentanaSustitutos: function () {
        var _this = this;

        var idindicador = _this.smGridPrincipal.getSelected().json.idindicador;
        var idproductosbalanceo = _this.smGridPrincipal.getSelected().json.idproductosbalanceo;
        var denomIndicador = _this.smGridPrincipal.getSelected().json.denominacion;
        if (idindicador) {
            _this.winSustitutos = new LOG.dist.balanceo.winSustituto({
                idindicador: idindicador,
                idioma: _this.idioma,
                textBusquedaSimple: 'C\xf3digo, denominaci\xf3n',
                busquedaBasica: true,
                viewConfig: {
                    width: '80%',
                    height: 400,
                    title: 'Seleccionar sustituto del producto ' + denomIndicador
                },
                baseParams: {
                    idindicador: idindicador
                },
                onSelectSustituto: function (idindicadorSustituto) {
                    let callback = function () {
                        _this.getStorePrincipal().reload();
                        if (this) this.close();
                    };
                    _this.modelo.adicionarSustituto(_this.iddocumento, idindicadorSustituto, idproductosbalanceo, callback);
                }
            });
            _this.winSustitutos.init();
            _this.winSustitutos.view();
        }

    },
    openWinAddPedido: function () {
        var _this = this;

        _this.winAddPedidos = new LOG.dist.balanceo.WinSeleccionarPedidos({
            idioma: _this.idioma,
            textBusquedaSimple: 'Nro documento',
            busquedaBasica: true,
            busquedaAvanzada: true,
            viewConfig: {
                width: '80%',
                height: 500,
                title: 'Pedidos'
            },
            baseParams: {},
            onSelectPedido: function (pedidos, fn_reload) {
                if (pedidos && pedidos.length > 0) {
                    var _fn = function () {
                        _this.getGridPrincipal().getStore().reload({
                            params: {
                                iddocumento: _this.iddocumento
                            }
                        });
                    };
                    const idpedidos = pedidos.map(pedido => pedido.iddocumento);
                    _this.modelo.agregarPedidosDoc(_this.iddocumento, idpedidos, _fn);
                }
            }
        });

        _this.winAddPedidos.init();
        _this.winAddPedidos.getPanelBusqueda().setColumns(1);
        _this.winAddPedidos.addFilterComponent(LOG.dist.balanceo.formBusqAvanzada(_this.winAddPedidos));
        _this.winAddPedidos.view();
    },
    eliminarProducto: function () {
        const _this = this;
        const cant = _this.smGridPrincipal.getSelections().length;
        const record = _this.smGridPrincipal.getSelected().json;

        if (cant != 1) {
            mostrarMensaje(3, 'Debe seleccionar al menos un producto.');
            return;
        }

        let mensaje = "\xbfEst\xe1 seguro que desea eliminar el producto seleccionado\x3f";

        mostrarMensaje(2, mensaje, function (btn) {
            if (btn == 'ok') {
                const fn = function () {
                    _this.getGridPrincipal().getStore().reload({
                        params: {
                            iddocumento: _this.iddocumento
                        }
                    });
                    _this.vpPedidos.getGridPrincipal().getStore().removeAll();
                    _this.vpExistencias.getGridPrincipal().getStore().removeAll();

                };

                const idproductosbalanceo = record.idproductosbalanceo;
                const iddocumento = _this.iddocumento;
                _this.modelo.eliminarProducto(iddocumento, idproductosbalanceo, fn);
            }
        });
    },
    gestionarBotones: function () {

        var posBtnAdicionarPedido = 0;
        var posBtnEliminarProd = 1;
        var posBtnConfirmar = 2;
        var posBtnAnular = 3;
        var posBtnAprobar = 4;
        var posBtnImprimir = 5;

        if (this.estadoDoc == 1) {

            this.btnSustitutos.enable();

            this.listaBotones.arrayData[posBtnAdicionarPedido].enable();
            this.listaBotones.arrayData[posBtnEliminarProd].enable();
            this.listaBotones.arrayData[posBtnConfirmar].enable();
            this.listaBotones.arrayData[posBtnAnular].disable();
            this.listaBotones.arrayData[posBtnAprobar].disable();
            this.listaBotones.arrayData[posBtnImprimir].disable();

        } else if (this.estadoDoc == 2) {
            this.btnSustituir.disable();

            this.listaBotones.arrayData[posBtnAdicionarPedido].disable();
            this.listaBotones.arrayData[posBtnEliminarProd].disable();
            this.listaBotones.arrayData[posBtnConfirmar].disable();
            this.listaBotones.arrayData[posBtnAnular].enable();
            this.listaBotones.arrayData[posBtnAprobar].enable();
            this.listaBotones.arrayData[posBtnImprimir].disable();

        } else if (this.estadoDoc == 3 || this.estadoDoc == 16) {
            this.btnSustituir.disable();

            this.getVistaPrincipal().listaBotones.getItem(1).disable();
            this.getVistaPrincipal().listaBotones.getItem(2).disable();
            this.listaBotones.arrayData[posBtnAdicionarPedido].disable();
            this.listaBotones.arrayData[posBtnEliminarProd].disable();
            this.listaBotones.arrayData[posBtnConfirmar].disable();
            this.listaBotones.arrayData[posBtnAnular].disable();
            this.listaBotones.arrayData[posBtnAprobar].disable();
            this.listaBotones.arrayData[posBtnImprimir].enable();

        } else {
            this.btnSustituir.disable();

            this.listaBotones.arrayData[posBtnAdicionarPedido].disable();
            this.listaBotones.arrayData[posBtnEliminarProd].disable();
            this.listaBotones.arrayData[posBtnConfirmar].disable();
            this.listaBotones.arrayData[posBtnAnular].disable();
            this.listaBotones.arrayData[posBtnAprobar].disable();
            this.listaBotones.arrayData[posBtnImprimir].disable();

        }
    }
});

// Grid de la derecha arriba
LOG.dist.balanceo.GpPedidos = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    idproductosbalanceo: undefined,
    cambiandoPedido: undefined,
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.dist.balanceo.Idioma);
        this.modelo = new LOG.dist.balanceo.Model({
            idioma: config.idioma
        });
        this.urlBusquedaGridPrincipal = 'cargarPedidosProducto';
        this.dirController = '/logistica/distribucion/balanceo/index.php/balanceo';
        this.autoLoad = false;
        this.autoSelect = false;
        this.keepSelected = false;
        this.gridEditable = true;
        this.loadMainGrid = config.loadMainGrid;
        this.iddocumento = config.iddocumento;
        this.idGridPrincipal = 'idproductobalanceopedido';


        LOG.dist.balanceo.GpPedidos.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.dist.balanceo.GpPedidos.superclass.init.call(this);
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            region: 'center',
            border: false,
            layout: 'border'
        });
        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            border: false,
        });
    },
    render: function () {
        this.smGridPrincipal = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            moveEditorOnEnter: false
        });

        LOG.dist.balanceo.GpPedidos.superclass.render.call(this);
        var _this = this;


        LOG.util.UIManager.encadenaFn(_this.smGridPrincipal, 'fireEvent', function (e, _sm, _index, _r) {
            if (e == 'rowselect') {
                _this.cambiandoPedido(_r);
            }
        }, '_cargar');

        _this.getStorePrincipal().on({
            'beforeload': function () {
                this.initBaseParams.idproductosbalanceo = _this.idproductosbalanceo;
            }
        });
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            default: false,
            dataIndex: _this.idGridPrincipal
        });

        this.addGridColumn({
            header: 'Entidad',
            width: 120,
            default: true,
            dataIndex: 'estructura'
        });

        this.addGridColumn({
            header: 'No. pedido',
            width: 80,
            default: false,
            dataIndex: 'nropedido'
        });

        this.addGridColumn({
            header: 'Cliente',
            width: 120,
            default: false,
            dataIndex: 'cliente'
        });

        this.addGridColumn({
            header: 'Pedidos',
            width: 80,
            dataIndex: 'pedidos',
            default: true,
            type: 'decimal',
            align: 'right',
            renderer: function (value, md, r) {
                if (r.json.pedidos == 0) {
                    return '<b>' + value + '</b>';
                }
                var valor = +r.json.pedidos - (+r.json.totaldistribuido + +r.json.cantcomprar);
                if (valor < 0) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else if (valor > 0) {
                    return '<b>' + value + '</b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
        });

        this.addGridColumn({
            header: 'Distribuidos',
            width: 80,
            dataIndex: 'totaldistribuido',
            default: true,
            type: 'decimal',
            align: 'right',
            renderer: function (value, md, r) {
                if (r.json.pedidos == 0) {
                    return '<b>' + value + '</b>';
                }
                var valor = +r.json.pedidos - (+r.json.totaldistribuido + +r.json.cantcomprar);
                if (valor < 0) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else if (valor > 0) {
                    return '<b>' + value + '</b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
        });

        this.addGridColumn({
            header: '<b>Cant. comprar</b>',
            width: 100,
            dataIndex: 'cantcomprar',
            default: true,
            type: 'decimal',
            align: 'right',
            renderer: function (value, md, r) {
                if (r.json.pedidos == 0) {
                    return '<b>' + value + '</b>';
                }
                var valor = +r.json.pedidos - (+r.json.totaldistribuido + +r.json.cantcomprar);
                if (valor < 0) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else if (valor > 0) {
                    return '<b>' + value + '</b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            editor: new LOG.util.Prototipos.inputDecimal({
                listeners: {
                    'change': function (cmp, newVlue, oldValue) {
                        if (newVlue >= 0) {
                            var idproductobalanceopedido = cmp.gridEditor.record.json.idproductobalanceopedido;
                            _this.guardarCantidadAComprar(idproductobalanceopedido, newVlue);
                        }
                    }
                }
            })
        });

        this.addGridColumn({
            header: 'Pendientes',
            width: 80,
            default: true,
            type: 'decimal',
            align: 'right',
            renderer: function (value, md, r) {
                if (r.json.pedidos == 0) {
                    return '<b>' + 0.00 + '</b>';
                }
                var valor = +r.json.pedidos - (+r.json.totalconsustitutos_acomprar + +r.json.totalconsustitutos_distribuidos);
                if (valor < 0) {
                    return '<b><span style="color:#FF5154";>' + valor.toFixed(2) + '</span></b>';
                } else if (valor > 0) {
                    return '<b>' + valor.toFixed(2) + '</b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + valor.toFixed(2) + '</span></b>';
                }
            }
        });

        this.addGridColumn({
            header: 'A comprar',
            width: 80,
            dataIndex: 'acomprar',
            default: true,
            renderer: function (value, md, r) {
                if (r.json.cantcomprar > 0) {
                    return 'SI'
                } else
                    return 'NO';
            }
        });

    },
    cargaPedidos: function (idproductosbalanceo) {
        var _this = this;

        _this.idproductosbalanceo = idproductosbalanceo;
        const lastOptions = _this.getGridPrincipal().getStore().lastOptions || {params: {}};

        Ext.apply(lastOptions.params, {
            idproductosbalanceo: idproductosbalanceo
        })
        _this.getGridPrincipal().getStore().reload(lastOptions);
    },
    limpiarPedidos: function () {
        var _this = this;
        if (_this.storePrincipal.baseParams.iddocumento != _this.iddocumento || _this.storePrincipal.baseParams.idindicador != _this.idindicador) {
            _this.getGridPrincipal().getStore().removeAll();
        }
    },
    guardarCantidadAComprar: function (idproductobalanceopedido, cantidad) {
        var _this = this;

        var fnAfterSuccess = function () {
            _this.loadMainGrid();
            //_this.storePrincipal.commitChanges();
            const lastOptions = _this.getStorePrincipal().lastOptions || {params: {}};
            _this.getStorePrincipal().reload(lastOptions);
        }

        _this.modelo.guardarCantidadComprar(_this.iddocumento, idproductobalanceopedido, cantidad, fnAfterSuccess);
    }
});

// Grid de la derecha abajo
LOG.dist.balanceo.GpExistencias = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    idindicador: undefined,
    idproductobalanceopedido: undefined,
    onClickAnterior: undefined,
    onClickSiguiente: undefined,

    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.dist.balanceo.Idioma);
        this.modelo = new LOG.dist.balanceo.Model({
            idioma: config.idioma
        });
        this.urlBusquedaGridPrincipal = 'cargarExistenciasProductos';
        this.dirController = '/logistica/distribucion/balanceo/index.php/balanceo';
        this.autoLoad = false;
        this.autoSelect = false;
        this.keepSelected = false;
        this.gridEditable = true;
        this.loadMainGrid = config.loadMainGrid;
        this.loadGridPedidos = config.loadGridPedidos;

        this.iddocumento = config.iddocumento;
        this.grdiPedidos = config.grdiPedidos;

        this.onClickAnterior = config.onClickAnterior;
        this.onClickSiguiente = config.onClickSiguiente;

        LOG.dist.balanceo.GpExistencias.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.dist.balanceo.GpExistencias.superclass.init.call(this);
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            region: 'center',
            border: false,
            layout: 'border'
        });
        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            border: false,
        });
    },
    render: function () {
        this.smGridPrincipal = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            moveEditorOnEnter: false
        });
        LOG.dist.balanceo.GpExistencias.superclass.render.call(this);

        var tBar = this.gpPrincipal.getTopToolbar();

        tBar.insert(0, '->');
        tBar.insert(0, this.btnSiguiente);
        tBar.insert(0, '-');
        tBar.insert(0, this.btnAnterior);
        tBar.insert(0, '-');

        var _this = this;

        _this.getStorePrincipal().on({
            'beforeload': function () {
                this.initBaseParams.idindicador = _this.idindicador;
                this.initBaseParams.iddocumento = _this.iddocumento;
                this.initBaseParams.idproductobalanceopedido = _this.idproductobalanceopedido;
            }
        });

    },
    initDefaultButtons: function () {
        // Botones del grid
        var _this = this
        this.btnAnterior = LOG.util.UIManager.createBtn({
            iconCls: 'anterior',
            text: 'Anterior',
            handler: _this.onClickAnterior
        });

        this.btnSiguiente = LOG.util.UIManager.createBtn({
            iconCls: 'siguiente',
            text: 'Siguiente',
            handler: _this.onClickSiguiente
        });
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'Entidad',
            width: 120,
            default: false,
            dataIndex: 'entidad'
        });

        this.addGridColumn({
            header: 'Depósito',
            width: 480,
            default: true,
            autoExpand: true,
            dataIndex: 'almacen'
        });

        this.addGridColumn({
            header: 'ABC',
            width: 40,
            dataIndex: 'abc',
            default: true
        });

        this.addGridColumn({
            header: 'Existencia',
            width: 100,
            dataIndex: 'existencia',
            default: true,
            type: 'decimal',
            align: 'right',
        });

        this.addGridColumn({
            header: 'Disponible',
            width: 100,
            dataIndex: 'disponible',
            default: true,
            type: 'decimal',
            align: 'right',
        });

        this.addGridColumn({
            header: '<b>Cantidad</b>',
            width: 100,
            dataIndex: 'cantidad',
            default: true,
            type: 'decimal',
            align: 'right',
            editor: new LOG.util.Prototipos.inputDecimal({
                listeners: {
                    'focus': function () {
                        if (_this.grdiPedidos.getSmPrincipal().getSelections().length == 0) {
                            mostrarMensaje(3, 'Debe seleccionar un pedido para modificar la cantidad a distribuir');
                            return false;
                        }
                        return true;
                    },
                    'change': function (cmp, newVlue, oldValue) {
                        if (newVlue >= 0) {
                            var idproductobalanceopedido = _this.grdiPedidos.getSmPrincipal().getSelected().json.idproductobalanceopedido;
                            var idproducto = _this.getSmPrincipal().getSelected().json.idproducto;
                            _this.guardarCantidadADistribuir(idproductobalanceopedido, idproducto, newVlue, oldValue);
                        }
                    }
                }
            })
        });

        this.addGridColumn({
            header: '&Uacute;ltimo mov.',
            width: 80,
            dataIndex: 'fechaultimomovimiento',
            default: true
        });

        this.addGridColumn({
            header: 'Cantidad &uacute;ltimo mov.',
            width: 120,
            dataIndex: 'cantultimomovimiento',
            default: true
        });

        this.addGridColumn({
            header: 'Nro. Dist.',
            width: 80,
            dataIndex: 'nrodocdistribucion',
            default: true
        });
    },
    cargarExistencias: function (idindicador, idproductobalanceopedido) {
        var _this = this;

        const lastOptions = _this.getGridPrincipal().getStore().lastOptions || {params: {}};

        _this.idindicador = idindicador ? idindicador : _this.idindicador;
        _this.idproductobalanceopedido = idproductobalanceopedido;
        Ext.apply(lastOptions.params, {
            idindicador: _this.idindicador,
            iddocumento: _this.iddocumento,
            idproductobalanceopedido: _this.idproductobalanceopedido
        });
        _this.getGridPrincipal().getStore().reload(lastOptions);
    },
    limpiarExistencias: function () {
        var _this = this;
        if (_this.storePrincipal.baseParams.idindicador != _this.idindicador) {
            this.getGridPrincipal().getStore().removeAll();
        }
    },
    guardarCantidadADistribuir: function (idproductobalanceopedido, idproducto, cantidad, cantidadVieja) {
        var _this = this;

        var fnAfterSuccess = function () {
            _this.storePrincipal.commitChanges();
            _this.loadMainGrid();
            _this.loadGridPedidos();

            const lastOptions = _this.getStorePrincipal().lastOptions || {params: {}};
            _this.getStorePrincipal().reload(lastOptions);
        };
        _this.modelo.guardarCatidadDistribuir(_this.iddocumento, idproductobalanceopedido, idproducto, cantidad, cantidadVieja, fnAfterSuccess);
    }
});

// Ventana de medios sustitutos
LOG.dist.balanceo.winSustituto = Ext.extend(LOG.util.UITemplate, {
    idindicador: undefined,
    onSelectSustituto: function () {
    },
    constructor: function (config) {
        var _this = this;
        LOG.util.UIManager.apply(config.idioma, LOG.dist.balanceo.Idioma);
        this.modelo = new LOG.dist.balanceo.Model({
            idioma: config.idioma
        });

        this.busquedaBasica = true;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'cargarSustitutos';
        this.dirController = '/logistica/distribucion/balanceo/index.php/balanceo';
        this.autoLoad = true;
        this.autoSelect = false;
        this.baseParams = {idindicador: config.idindicador};
        this.onSelectSustituto = config.onSelectSustituto;

        LOG.dist.balanceo.winSustituto.superclass.constructor.call(this, config);
        this.vistaPrincipal.aceptarFn = () => this.onAceptar(this);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'C\xf3digo',
            width: 120,
            default: false,
            dataIndex: 'codigo'
        });

        this.addGridColumn({
            header: 'Denominaci\xf3n',
            width: 480,
            default: true,
            autoExpand: true,
            dataIndex: 'denominacion'
        });

        this.addGridColumn({
            header: 'UM',
            width: 40,
            dataIndex: 'unidadmedida',
            default: true
        });

        this.addGridColumn({
            header: 'ABC',
            width: 40,
            dataIndex: 'abc',
            default: true
        });
    },
    onAceptar: function (self) {
        var selectedRecord = self.getGridPrincipal().getSelectionModel().getSelected();
        var idindicador = selectedRecord.json.idindicador;

        this.onSelectSustituto(idindicador);
    }
});