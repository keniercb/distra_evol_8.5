Ext.ns('LOG.fac.pedidotienda');

LOG.fac.pedidotienda.View = Ext.extend(LOG.util.UITemplate, {
        seleccion: undefined,
        constructor: function(config) {
            this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.pedidotienda.Idioma);
            this.dirController = '/logistica/facturacion/puntoventa/index.php/pedidotienda';
            this.urlBusquedaGridPrincipal = 'cargarPedidos';
            this.modoSeleccion = 1;
            this.busquedaBasica = true;
            this.busquedaAvanzada = true;
            this.autoLoad = false;
            this.autoSelect = false;
            this.seleccionAnterior = new Array();
            //this.gridEditable = true;
            this.modelo = new LOG.fac.pedidotienda.Modelo({
                idioma: config.idioma
            });
            LOG.fac.pedidotienda.View.superclass.constructor.call(this, config);
        },
        init: function() {
            var _this = this;
            LOG.fac.pedidotienda.View.superclass.init.call(this);

            this.cmbArea = new LOG.util.ComboBox({
                //autoLoad: true,
                name: 'idareaventa',
                url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarAreas',
                valueField: 'idestructuraop',
                displayField: 'coddenominacion',
                width:350,
                anchor: '90%',
                listWidth:350,
                //pageSize: 10,
                //mode: 'remote',
                allowBlank: false,
                editable: true,
                listeners: {
                    /*expand: function () {
                        this.store.reload();
                    },*/
                    select: function (combo,record,index) {
                        _this.idareaventa = record.json.idareaventa;
                        _this.tiendavirtual = record.json.tiendavirtual;
                        _this.tipotienda = record.json.tipo;
                        _this.cajasregistradoras = record.json.cr;
                        _this.idestructuraop = combo.getValue();
                        if (_this.tiendavirtual) {
                            if (_this.tipotienda == "ps" || _this.tipotienda == "gjt") {
                                _this.listaBotones.getItem(0).enable();
                                _this.listaBotones.getItem(0).show();
                                _this.listaBotones.getItem(1).hide();
                                _this.listaBotones.getItem(2).hide();
                                _this.listaBotones.getItem(3).hide();
                                _this.listaBotones.getItem(4).hide();
                                _this.listaBotones.getItem(5).hide();
                            } else if (_this.tipotienda == "cx") {
                                _this.listaBotones.getItem(3).enable();
                                _this.listaBotones.getItem(3).show();
                                _this.listaBotones.getItem(0).hide();
                                _this.listaBotones.getItem(1).hide();
                                _this.listaBotones.getItem(2).hide();
                                _this.listaBotones.getItem(4).hide();
                                _this.listaBotones.getItem(5).show();
                            }
                        } else {
                            if (_this.cajasregistradoras) {
                                _this.listaBotones.getItem(1).enable();
                                _this.listaBotones.getItem(1).show();

                                //_this.listaBotones.getItem(3).show();
                            }
                            _this.listaBotones.getItem(2).enable();
                            _this.listaBotones.getItem(2).show();
                            _this.listaBotones.getItem(0).hide();
                            _this.listaBotones.getItem(3).hide();
                            _this.listaBotones.getItem(5).enable();
                            _this.listaBotones.getItem(5).show();
                            _this.listaBotones.getItem(4).show();
                        }
                        _this.getStorePrincipal().load({
                            params: {
                                idestructuraop: combo.getValue(),
                                idareaventa: record.json.idareaventa/*,
                            idmonedaventa: record.json.idmoneda*/
                            }
                        });
                    }
                }
            });

            this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
                tbar: ['->', '-', 'Tienda' + ':', this.cmbArea]
            }));
            LOG.util.UIManager.apply(this.getPanelSuperior(), {
                width: 10
            });

            this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
                //_this.getPanelPrincipal().add(_this.getPanelEste());
                this.leyendaPedido = new LOG.lb.plugin.Leyenda({
                    leyendAlign: 'bot-left',
                    leyendContainer: _this.getGridPrincipal(),
                    leyendConfig: _this.getLeyenda(true)
                });
                _this.getGridPrincipal().getBottomToolbar().insert(_this.getGridPrincipal().getBottomToolbar().items.length - 1, this.leyendaPedido);
                _this.getGridPrincipal().getBottomToolbar().insert(_this.getGridPrincipal().getBottomToolbar().items.length - 1, '-');

                _this.getPanelPrincipal().add(_this.getPanelSur());
                _this.getGridPrincipal().getStore().on('load', function () {
                    if (_this.getGridPrincipal().getStore().getCount() == 0) {
                        _this.panelSur.collapse();
                        _this.storeSur.removeAll();
                        _this.storeServ.removeAll();
                    }
                    if (_this.seleccionAnterior.length > 0) {
                        _this.getGridPrincipal().getSelectionModel().selectRows(_this.seleccionAnterior);
                    }
                });
                _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(
                    function (e) {
                        if (e == 'rowclick') {
                            if (_this.getSmPrincipal().getSelections().length == 1) {
                                _this.panelSur.expand();
                                _this.storeSur.load();
                                _this.storeServ.load();
                                _this.storeEste.load();
                            } else {
                                _this.panelSur.collapse();
                                _this.storeServ.removeAll();
                                _this.storeEste.removeAll();
                            }
                        }
                    }
                );
                /*_this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(
                    function (e) {
                        if (e == 'rowselect') {
                            if (_this.getSmPrincipal().getSelections().length == 1) {
                                _this.panelSur.expand();
                                _this.storeSur.load();
                            } else {
                                _this.panelSur.collapse();
                                _this.storeSur.removeAll();
                            }
                        }
                    }
                );*/
                _this.getGridPrincipal().getSelectionModel().on('rowselect', function (sm, index, r) {
                    if (_this.finSeleccion(index, _this.seleccionAnterior) == -1)
                        _this.seleccionAnterior.push(index);
                });
                _this.getGridPrincipal().getSelectionModel().on('rowdeselect', function (sm, index, r) {
                    _this.seleccionAnterior = _this.finSeleccion(index, _this.seleccionAnterior, true);
                });

                _this.getGridPrincipal().getStore().on('load', function () {
                    if (_this.seleccionAnterior.length == 0) {
                        //_this.getGridPrincipal().getSelectionModel().selectFirstRow();
                    } else {
                        _this.getGridPrincipal().getSelectionModel().selectRows(_this.seleccionAnterior);
                    }
                    var colModel = _this.getGridPrincipal().getColumnModel();
                    for (var i = 2; i < colModel.getColumnCount(); i++) {
                        _this.getGridPrincipal().getColumnModel().setRenderer(i, function (value, md, rd, ri, ci, st) {
                            var dataIndex = colModel.getDataIndex(ci);

                            if (rd.data.incompleto > 0) {
                                md.attr = 'style="background-color: rgba(255, 185, 201, 0.9);"';//#ffb9c9
                                if(dataIndex == 'estado'){
                                    return LOG.fac.pedidotienda.Estado[value];
                                } else {
                                    return value;
                                }
                            }else if (parseFloat(rd.json.modificado) > 0) {
                                md.attr = 'style="background-color: rgba(28, 28, 255, 0.5);"';//#ffb9c9
                                if(dataIndex == 'estado'){
                                    return LOG.fac.pedidotienda.Estado[value];
                                } else {
                                    return value;
                                }
                            } else if (rd.json.incompleto == 0) {
                                if(dataIndex == 'estado'){
                                    return LOG.fac.pedidotienda.Estado[value];
                                } else {
                                    return value;
                                }
                            }
                        });
                    }
                    _this.getGridPrincipal().getView().refresh();
                });

                _this.gpSur.getStore().on('load', function () {
                    var colModel = _this.gpSur.getColumnModel();
                    for (var i = 2; i < colModel.getColumnCount(); i++) {
                        _this.gpSur.getColumnModel().setRenderer(i, function (value, md, rd, ri, ci, st) {
                            var dataIndex = colModel.getDataIndex(ci);
                            if (rd.json.idproducto == null) {
                                md.attr = 'style="background-color: rgba(255, 222, 28, 0.9);"';
                            } else if (parseFloat(rd.json.existencia) < parseFloat(rd.json.cantidad) && (rd.json.estadopedido == 1 || rd.json.estadopedido == 2)) {
                                md.attr = 'style="background-color: rgba(255, 185, 201, 0.9);"';
                            } else if (rd.json.addmod == 1) {
                                md.attr = 'style="background-color: rgba(28, 192, 28, 0.7);"';
                            } else if (rd.json.addmod == 2) {
                                md.attr = 'style="background-color: rgba(28, 28, 255, 0.5);"';
                            }
                            return value;
                        });
                    }
                    _this.gpSur.getView().refresh();
                });

                _this.storeSur.on('load', function () {
                    if (_this.storeSur.getCount() == 0) {
                        _this.panelEsteSur.collapse();
                        _this.storeEsteSur.removeAll();
                    }
                });
                _this.gpSur.fireEvent = _this.gpSur.fireEvent.createSequence(
                    function (e) {
                        if (e == 'rowclick') {
                            if (_this.gpSur.getSelectionModel().getSelections().length == 1) {
                                _this.panelEsteSur.expand();
                                //_this.storeEsteSur.load();
                            } else {
                                _this.panelEsteSur.collapse();
                                _this.storeEsteSur.removeAll();
                            }
                        }
                    }
                );

                _this.gpSur.getSelectionModel().fireEvent = _this.gpSur.getSelectionModel().fireEvent.createSequence(function (e) {
                    var seleccion = _this.gpSur.getSelectionModel().getSelections();
                    if (e == "selectionchange") {
                        if (seleccion.length == 1) {
                            _this.storeEsteSur.load();
                        } else {
                            _this.storeEsteSur.removeAll();
                        }
                    }
                });
            });
        },
        render: function() {
            var _this = this;
            var vis = LOG.fac.pedidotienda.View.superclass.render.call(this);
            _this.btnAdicionarProd.controlFn.createDelegate(this, [this.btnAdicionarProd, this]).call();
            _this.btnEliminarProd.controlFn.createDelegate(this, [this.btnEliminarProd, this]).call();
            _this.getStorePrincipal().on({
                'beforeload': function (st) {
                    st.baseParams.idareaventa = _this.idareaventa || -1;
                    st.initBaseParams.idareaventa = _this.idareaventa || -1;
                }
            });
            return vis;
        },
        initDefaultColumns: function() {
            var _this = this;
            this.addGridColumn({
                dataIndex: 'idpedidotienda',
                hidden: true
            });
            this.addGridColumn({
                dataIndex: 'idestructuracomun',
                hidden: true
            });
            this.addGridColumn({
                dataIndex: 'idareaventa',
                hidden: true
            });
            this.addGridColumn({
                dataIndex: 'pendiente',
                hidden: true
            });
            this.addGridColumn({
                dataIndex: 'incompleto',
                hidden: true
            });
            this.addGridColumn({
                header: 'Nro. Pedido',
                width: 120,
                dataIndex: 'nropedido',
                filter : {
                    type : 'string',
                    emptyText : 'Nro. Pedido',
                    dataIndex : 'nropedido'
                }
                //default: true
            });
            this.addGridColumn({
                header: 'Fecha',
                width: 120,
                dataIndex: 'fechapedido',
                //default: true
            });
            this.addGridColumn({
                header: 'Hora',
                width: 120,
                dataIndex: 'hora',
                //default: true
            });
            this.addGridColumn({
                header: 'Estado',
                width: 120,
                dataIndex: 'estado',
                filter : {
                    type : 'combo',
                    store : new Ext.data.SimpleStore({
                        fields: ['idestado', 'estado'],
                        data: [
                            ['1', LOG.fac.pedidotienda.Estado[1]],
                            ['2', LOG.fac.pedidotienda.Estado[2]],
                            ['3', LOG.fac.pedidotienda.Estado[3]],
                            ['5', LOG.fac.pedidotienda.Estado[5]],
                            ['7', LOG.fac.pedidotienda.Estado[7]],
                            ['13', LOG.fac.pedidotienda.Estado[13]]
                        ]
                    }),
                    valueField : 'idestado',
                    displayField: 'estado',
                    dataIndex : 'estado'
                },
                renderer: function (v) {
                    return LOG.fac.pedidotienda.Estado[v];
                }
            });
            this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                header: 'Importe',
                width: 150,
                dataIndex: 'importe',
                align: 'right',
            }));
            this.addGridColumn({
                header: 'Tipo devoluci\xf3n',
                width: 150,
                dataIndex: 'estadodev',
                renderer: function (v) {
                    //return LOG.fac.pedidotienda.Estado[v];
                }
            });
            this.addGridColumn({
                header: 'Despacho',
                width: 120,
                dataIndex: 'nrodespacho',
                filter : {
                    type : 'string',
                    emptyText : 'Nro. Despacho',
                    dataIndex : 'nrodespacho'
                }
            });
            this.addGridColumn({
                header: 'M\xe9todo pago',
                width: 120,
                dataIndex: 'metodopago'
            });
            this.addGridColumn({
                header: 'Beneficiario',
                width: 120,
                dataIndex: 'beneficiario',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'Beneficiario',
                    dataIndex : 'beneficiario'
                }
            });
            this.addGridColumn({
                header: 'CI. Beneficiario',
                width: 100,
                dataIndex: 'cibeneficiario',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'CI. beneficiario',
                    dataIndex : 'cibeneficiario'
                }
            });
            this.addGridColumn({
                header: 'Telf. Beneficiario',
                width: 100,
                dataIndex: 'telbeneficiario',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'Telf. Beneficiario',
                    dataIndex : 'telbeneficiario'
                }
            });
            this.addGridColumn({
                header: 'Direcci\xf3n beneficiario',
                width: 300,
                dataIndex: 'dirbeneficiario',
                default: true,
                autoExpand: true,
                filter : {
                    type : 'string',
                    emptyText : 'Direcci\xf3n beneficiario',
                    dataIndex : 'dirbeneficiario'
                }
            });
            this.addGridColumn({
                header: 'Remitente',
                width: 120,
                dataIndex: 'remitente',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'Remitente',
                    dataIndex : 'remitente'
                }
            });
            this.addGridColumn({
                header: 'CI. Remitente',
                width: 100,
                dataIndex: 'ciremitente',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'CI. Remitente',
                    dataIndex : 'ciremitente'
                }
            });
            this.addGridColumn({
                header: 'Telf. Remitente',
                width: 100,
                dataIndex: 'telremitente',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'Telf. Remitente',
                    dataIndex : 'telremitente'
                }
            });
            this.addGridColumn({
                header: 'Direcci\xf3n remitente',
                width: 300,
                dataIndex: 'dirremitente',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'Direcci\xf3n remitente',
                    dataIndex : 'dirremitente'
                }
            });
        },
        initDefaultButtons: function() {
            var _this = this;
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: _this.idioma.btnDescargar,
                tooltip: _this.idioma.ttBtnDescargar,
                iconCls: 'descargar',
                idItem: 'Descargar',
                disabled: true,
                hidden: true,
                //scope: this,
                controlFn: function (btn, called) {
                    if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                        if (_this.tiendavirtual != undefined && _this.tipotienda != undefined && (_this.tipotienda == "ps" || _this.tipotienda == "gjt")) {
                            btn.show();
                        } else {
                            btn.hide();
                        }
                    } else {
                        btn.hide();
                    }
                },
                handler: function () {
                    _this.descargarPedidos(_this.procesarPedidos);
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: _this.idioma.btnDescargar,
                tooltip: _this.idioma.ttBtnDescargarCR,
                iconCls: 'descargar',
                idItem: 'descargarcr',
                disabled: true,
                hidden: true,
                //scope: this,
                controlFn: function (btn, called) {
                    if ((called.grantedAction('CT') || called.grantedAction('RCRUD')) && _this.cajasregistradoras != undefined) {
                        btn.show();
                    } else {
                        btn.hide();
                    }
                },
                handler: function () {
                    _this.descargarVentasCR();
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: _this.idioma.btnProcesar,
                tooltip: _this.idioma.ttBtnProcesar,
                iconCls: 'descargar',
                idItem: 'Procesar',
                disabled: true,
                hidden: true,
                //scope: this,
                controlFn: function (btn, called) {
                    if ((called.grantedAction('CT') || called.grantedAction('RCRUD')) && _this.tiendavirtual != undefined) {
                        btn.show();
                    } else {
                        btn.hide();
                    }
                },
                handler: function () {
                    _this.procesarPedidos(true);
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: _this.idioma.btnImportar,
                tooltip: _this.idioma.ttBtnImportar,
                iconCls: 'importar',
                idItem: 'Importar',
                disabled: true,
                hidden: true,
                //scope: this,
                controlFn: function (btn, called) {
                    if ((called.grantedAction('CT') || called.grantedAction('RCRUD')) && _this.tiendavirtual != undefined && _this.tipotienda != undefined && _this.tipotienda == "cx") {
                        btn.show();
                    } else {
                        btn.hide();
                    }
                },
                handler: function () {
                    var win = new LOG.lb.importar.View({
                        class: 'PedidotiendaModel',
                        params: {idareaventa: _this.idareaventa, idestructura: _this.idestructuraop, formato: 'ord'},
                        fn: function(r) {
                            _this.getGridPrincipal().getStore().reload();
                            _this.procesarPedidos();
                            // mostrarMensaje(1, 'Importados '+r.importados+' de '+r.total+' c\xf3digos');
                        }
                    });
                    win.show();
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: 'Importar JSON',
                tooltip: 'Importar pedidos desde fichero JSON',
                iconCls: 'importar',
                idItem: 'ImportarJson',
                disabled: true,
                hidden: true,
                //scope: this,
                controlFn: function (btn, called) {
                    if (/*(called.grantedAction('RIMPORTARJSON')) &&*/ _this.tiendavirtual != undefined) {
                        btn.show();
                    } else {
                        btn.hide();
                    }
                },
                handler: function () {
                    var win = new LOG.lb.importar.View({
                        class: 'PedidotiendaModel',
                        params: {idareaventa: _this.idareaventa, idestructura: _this.idestructuraop, formato: 'json'},
                        fn: function(r) {
                            _this.getGridPrincipal().getStore().reload();
                            // mostrarMensaje(1, 'Importados '+r.importados+' de '+r.total+' c\xf3digos');
                        }
                    });
                    win.show();
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: 'Cancelar',
                tooltip: 'Cancelar pedidos que no ser\xe1n procesados',
                isContextual: true,
                iconCls: 'cancelar',
                disabled: true,
                handler: function () {
                    _this.confirmarCancelarPedido(_this.getSmPrincipal().getSelections());
                },
                controlFn: function (b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCancelar')) {
                        b.setVisible(true);
                        _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            var seleccion = _caller.getGridPrincipal().getSelectionModel().getSelections();
                            if (e == "selectionchange") {
                                if (seleccion.length > 0) {
                                    b.enable();
                                    Ext.each(seleccion, function (uno) {
                                        if (uno.data.estado != "1" && uno.data.estado != "2") {
                                            b.disable();
                                        }
                                    });
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.setVisible(false);
                    }
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: _this.idioma.btnEjecucion,
                tooltip: _this.idioma.ttbtnEjecucion,
                iconCls: 'estado',
                idItem: 'Ejecucion',
                //scope: this,
                controlFn: function (btn, called) {
                    if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                        btn.show();
                    } else {
                        btn.hide();
                    }
                },
                handler: function () {
                    var estadoEjecucion = new LOG.fac.pedidotienda.EstadoEjecucion({
                        formaVisualizacion: 'ventana',
                        idioma: _this.idioma,
                        idpedido: (_this.getSmPrincipal().hasSelection()) ? _this.getSmPrincipal().getSelected().data.idpedidotienda : -1
                    });
                    estadoEjecucion.init();
                    estadoEjecucion.view();
                    estadoEjecucion.getVistaPrincipal().setTitle('Estado de ejecuci\xf3n');
                    estadoEjecucion.getVistaPrincipal().height = 200;
                    estadoEjecucion.getVistaPrincipal().width = 500;
                    estadoEjecucion.getVistaPrincipal().listaBotones.getItem(0).hide();
                    estadoEjecucion.getVistaPrincipal().listaBotones.getItem(1).hide();
                }
            }));
            this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
                text: this.idioma.btnAprobarDevolucion,
                tooltip: this.idioma.ttBtnAprobarDevolucion,
                isContextual: true,
                disabled: true,
                handler: function () {
                    var objSubmit = {idpedidotienda: _this.getSmPrincipal().getSelected().data.idpedidotienda, idareaventa: _this.idareaventa};
                    Ext.MessageBox.wait('Devolviendo pedido', _this.idioma.msgEspere);
                    Ext.Ajax.request({
                        url: 'devolverPedido',
                        method: 'POST',
                        params: objSubmit,
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success && resp.codigoMsg == 1) {
                                mostrarMensaje(resp.codigoMsg, 'El pedido han sido devuelto satisfactoriamente');
                                _this.getGridPrincipal().getStore().reload();
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp.datos]).call();

                                }
                            }
                        }.createDelegate(this)
                    });
                },
                controlFn: function (b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RDevolver')) {
                        b.setVisible(true);
                        _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            if (e == 'rowselect') {
                                console.info(this.getSelected().data);
                                b.setDisabled(!(this.getCount() == 1 && (this.getSelected().data.estado == 3 || this.getSelected().data.estado == 2) && this.getSelected().data.pendiente > 0));
                            }
                        });
                    } else {
                        b.setVisible(false);
                    }
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: _this.idioma.btnDevoluciones,
                tooltip: _this.idioma.ttBtnDevoluciones,
                iconCls: 'estado',
                idItem: 'Ejecucion',
                //scope: this,
                controlFn: function (btn, called) {
                    if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                        btn.show();
                    } else {
                        btn.hide();
                    }
                },
                handler: function () {
                    var devoluciones = new LOG.fac.pedidotienda.EstadoDevoluciones({
                        formaVisualizacion: 'ventana',
                        idioma: _this.idioma,
                        idpedido: (_this.getSmPrincipal().hasSelection()) ? _this.getSmPrincipal().getSelected().data.idpedidotienda : -1
                    });
                    devoluciones.init();
                    devoluciones.view();
                    devoluciones.getVistaPrincipal().setTitle('Devoluciones del pedido '+_this.getSmPrincipal().getSelected().data.nropedido);
                    devoluciones.getVistaPrincipal().height = 400;
                    devoluciones.getVistaPrincipal().width = 800;
                    devoluciones.getVistaPrincipal().listaBotones.getItem(0).hide();
                    devoluciones.getVistaPrincipal().listaBotones.getItem(1).hide();
                }
            }));
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: 'XML Golden',
                tooltip: 'Generar fichero de ventas XML del Golden',
                iconCls: 'estado',
                idItem: 'Golden',
                //scope: this,
                controlFn: function (btn, called) {
                    if (called.grantedAction('RGOLDEN')) {
                        btn.show();
                    } else {
                        btn.hide();
                    }
                },
                handler: function () {
                    Ext.MessageBox.wait('Generando fichero', 'Espere por favor');
                    Ext.Ajax.request({
                        url: 'openGoldenXml',
                        method: 'post',
                        params: {
                            idareaventa : _this.idareaventa
                        },
                        success: function (rp) {
                            const obj = Ext.decode(rp.responseText);
                            window.open(obj.file)
                            Ext.MessageBox.hide();
                        }
                    });
                }
            }));
        },
        confirmarCancelarPedido: function(seleccion) {
            var _this = this;
            var anulObservaciones = new Ext.form.TextArea({
                fieldLabel: 'Motivo',
                anchor: '99%',
                allowBlank: false,
                maxLength: '255',
                minLength: '2',
            });

            _this.cancelarPedido = new Ext.Window({
                title: 'Confirmaci\xf3n',
                width: 440,
                height: 190,
                modal: true,
                resizable: false,
                constrain: true,
                items: new Ext.Panel({
                    frame: true,
                    autoHeight: true,
                    autoWidth: true,
                    bodyBorder: false,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [anulObservaciones]
                }),
                buttons: [{
                    text: 'Cancelar',
                    //tooltip: _this.idioma.lbTxtBtnCancelar,
                    iconCls: 'cancelar',
                    handler: function () {
                        _this.cancelarPedido.close();
                    }
                }, {
                    text: 'Aceptar',
                    //tooltip: _this.idioma.lbTxtBtnAAceptar,
                    iconCls: 'aceptar',
                    handler: function () {
                        if(anulObservaciones.isValid()){
                            Ext.MessageBox.wait('Cancelando pedidos', 'Por favor espere.' || '...');
                            var idpedido = Array();
                            Ext.each(seleccion, function(uno) {
                                idpedido.push(uno.json.idpedidotienda);
                            });
                            Ext.Ajax.request({
                                url: 'cancelarPedido',
                                params: {
                                    pedidos: Ext.encode(idpedido),
                                    motivo: anulObservaciones.getValue()
                                },
                                success: function(response) {
                                    var data = Ext.decode(response.responseText);
                                    Ext.MessageBox.hide();
                                    if (data.success === true) {
                                        mostrarMensaje(1, 'El(los) pedido(s) ha(n) sido cancelado(s) satisfactoriamente');
                                        _this.getGridPrincipal().getStore().reload();
                                    }
                                    _this.cancelarPedido.close();
                                }
                            });
                        }

                    }
                }]
            });
            _this.cancelarPedido.show();
            _this.cancelarPedido.center();
        },
        descargarPedidos: function(_fn) {
            var _this = this;
            var objSubmit = {idareaventa: _this.idareaventa, idestructuraop: _this.idestructuraop};//descargar por tienda
            Ext.MessageBox.wait('Descargando pedidos pendientes de la tienda virtual', _this.idioma.msgEspere);
            Ext.Ajax.request({
                url: 'descargarPedidos',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success && resp.codigoMsg == 1) {
                        mostrarMensaje(resp.codigoMsg, 'Los pedidos han sido descargados satisfactoriamente');
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp.datos]).call();

                        }
                    }
                }.createDelegate(this)
            });
        },
        descargarVentasCR: function(_fn) {
            var _this = this;
            var objSubmit = {idareaventa: _this.idareaventa, idestructuraop: _this.idestructuraop};
            Ext.MessageBox.wait('Descargando ventas registradas', _this.idioma.msgEspere);
            Ext.Ajax.request({
                url: 'descargarVentasCR',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success && resp.codigoMsg == 1) {
                        mostrarMensaje(resp.codigoMsg, 'Las ventas han sido descargadas satisfactoriamente');
                        _this.getGridPrincipal().getStore().reload();
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp.datos]).call();

                        }
                    }
                }.createDelegate(this)
            });
        },
        procesarPedidos: function (externo) {
            var _this = this;
            var objSubmit = {idtienda: _this.idareaventa, externo: externo || null, cr: _this.cajasregistradoras || null};//descargar por tienda
            Ext.MessageBox.wait('Procesando pedidos descargados', _this.idioma.msgEspere);
            Ext.Ajax.request({
                url: 'procesarPedidos',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success && resp.codigoMsg == 1) {
                        mostrarMensaje(resp.codigoMsg, 'Los pedidos han sido procesados satisfactoriamente');
                        _this.getGridPrincipal().getStore().reload();
                    }
                }.createDelegate(this)
            });
        },
        getPanelSur: function () {
            var _this = this;
            /*this.btnDevolver = LOG.util.UIManager.createBtn({
                text: 'Devoluci\xf3n total',
                tooltip: 'Devuelve todos los productos del pedido',
                iconCls: 'topizquierda',
                handler: function () {

                },
                controlFn: function (b, called) {

                }
            });*/
            this.btnAdicionarProd = LOG.util.UIManager.createBtn({
                text: 'Adicionar',
                tooltip: 'Adiciona nuevo producto al pedido',
                iconCls: 'adicionar',
                disabled: true,
                handler: function () {
                    var winProductos = new LOG.lb.documento.VentanaProductos({
                        idioma: _this.idioma,
                        _parent: _this,
                        busquedaAvanzada: false,
                        urlBusquedaGridPrincipal: 'cargarProductos',
                        dirController: '/logistica/facturacion/puntoventa/index.php/pedidotienda',
                        parametros: {
                            idestructura: _this.cmbArea.getValue(),
                        },
                        doAction: function (r) {
                            var _t = this;
                            var _productos = new Array();
                            Ext.each(r, function (rec) {
                                _productos.push(rec.data);
                            });

                            var objSubmit = {
                                idpedidotienda: _this.getSmPrincipal().getSelected().data.idpedidotienda,
                                idestructura: _this.idestructuraop,
                                productos: Ext.encode(_productos)
                            };
                            Ext.Ajax.request({
                                url: 'adicionarProducto',
                                method: 'POST',
                                params: objSubmit,
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                    if (resp.success) {
                                        _this.storeSur.load();
                                    }
                                }.createDelegate(this)
                            });
                        }
                    });
                    winProductos.init();
                    _this.vistaProductos = winProductos.view();
                    _this.vistaProductos.show();
                },
                controlFn: function (b, called) {
                    LOG.util.UIManager.encadenaFn(_this.cmbArea, 'fireEvent', function (e) {
                        if (e == 'select') {
                            var pedidos = _this.getGridPrincipal().getSelectionModel().getSelections();
                            if (_this.cmbArea.getValue() != '' && (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) && _this.cajasregistradoras != undefined) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'ADICIONARPROD');

                    _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            var pedidos = _this.getGridPrincipal().getSelectionModel().getSelections();
                            if (_this.cmbArea.getValue() != '' && (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) && _this.cajasregistradoras != undefined
                                && pedidos.length == 1 && (pedidos[0].data.estado == "1" || pedidos[0].data.estado == "2")) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'ADICIONARPROD');
                }
            });
            this.btnEliminarProd = LOG.util.UIManager.createBtn({
                text: 'Eliminar',
                tooltip: 'Elimina un producto del pedido',
                iconCls: 'eliminar',
                disabled: true,
                handler: function () {
                    mostrarMensaje(2, "\xbfEst\xe1 seguro que desea eliminar los productos seleccionados\x3f", function (btn) {
                        if (btn == 'ok') {
                            let selections = _this.gpSur.getSelectionModel().getSelections();
                            let ids = [];
                            Ext.each(selections, function (rec) {
                                ids.push(rec.data.idproductopedido);
                            });
                            var params = {
                                datos: Ext.encode(ids),
                            };
                            msg = "Eliminando productos";
                            Ext.MessageBox.wait(msg, 'Por favor espere' || '...');
                            var objSubmit = params || {};
                            Ext.Ajax.request({
                                url: 'eliminarProductos',
                                method: 'POST',
                                params: objSubmit,
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                    if (resp.success) {
                                        var msgConf;
                                        msgConf = 'Los productos han sido eliminados satesfactoriamente';

                                        mostrarMensaje(1, msgConf);
                                        _this.storeSur.load();
                                    } else {

                                    }
                                }.createDelegate(this)
                            });
                        }
                    });
                },
                controlFn: function (b, called) {
                    _this.gpSur.getSelectionModel().fireEvent = _this.gpSur.getSelectionModel().fireEvent.createSequence(function (e) {
                        var pedidos = _this.getGridPrincipal().getSelectionModel().getSelections();
                        var seleccion = _this.gpSur.getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0 && pedidos.length == 1 && (pedidos[0].data.estado == "1" || pedidos[0].data.estado == "2")) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                }
            });
            this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
                text: 'Guardar',
                tooltip: '',
                handler: function() {
                    var devuelto = new Array();
                    var modificados = _this.gpSur.getStore().getModifiedRecords();
                    Ext.each(modificados, function(recd) {
                        devuelto.push(recd.data);
                    });
                    Ext.MessageBox.wait(_this.idioma.msgSalvandoDatos, _this.idioma.msgEspere);
                    var objSubmit = {
                        devuelto: Ext.encode(devuelto)
                    };
                    Ext.Ajax.request({
                        url: 'guardarDevolucion',
                        method: 'POST',
                        params: objSubmit,
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success && resp.codigoMsg == 1) {
                                mostrarMensaje(resp.codigoMsg, 'Las cantidades han sido guardadas satisfactoriamente');
                                _this.getStorePrincipal().reload();
                                _this.gpSur.getStore().reload();
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp.datos]).call();

                                }
                            }
                        }.createDelegate(this)
                    });

                }
            });

            this.leyenda = new LOG.lb.plugin.Leyenda({
                leyendAlign: 'bot-left',
                //leyendContainer: _this.panelSur,
                leyendConfig: _this.getLeyenda()
            });

            this.panelSur = LOG.util.UIManager.initPanel({
                region: 'south',
                title: _this.idioma.tProductos,
                border: true,
                layout: 'border',
                collapsible: true,
                collapsed: true,
                split: true,
                buttons: [_this.leyenda, _this.btnSalvar],
                tbar: ['-', _this.btnAdicionarProd, '-', _this.btnEliminarProd],
                listeners: {
                    expand: function (p) {
                        p.setHeight(_this.getPanelPrincipal().getHeight() / 2);
                    }
                }
            });
            this.pnGrid = LOG.util.UIManager.initFocusPanel({
                region: 'center',
                layout: 'border',
                title: 'Productos',
                view: function () {
                    return this;
                }
            });

            this.columnasSur = new LOG.util.List();
            this.columnasSur.add({
                dataIndex: 'idproductopedido'
            });
            this.columnasSur.add({
                dataIndex: 'idproducto'
            });
            this.columnasSur.add({
                header: 'C\xf3digo',
                dataIndex: 'codreferencia',
                width: 200,
                default: true
            });
            this.columnasSur.add({
                header: 'Producto',
                dataIndex: 'descripcionventa',
                width: 350,
                autoExpand: true,
                default: true
            });
            this.columnasSur.add({
                header: 'UM',
                dataIndex: 'umedida',
                default: true,
                width: 40
            });
            this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
                header: 'Cantidad',
                align: 'right',
                dataIndex: 'cantidad',
                default: true,
                editor: LOG.util.Prototipos.inputDecimal({}),
                width: 90/*,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.cantidaddev > 0){
                    return value - record.json.cantidaddev;
                }
                return value;
            }*/
            }));
            this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
                header: 'Cantidad pedida',
                align: 'right',
                dataIndex: 'cantidadreal',
                default: true,
                editor: LOG.util.Prototipos.inputDecimal({}),
                width: 120/*,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.cantidaddev > 0){
                    return value - record.json.cantidaddev;
                }
                return value;
            }*/
            }));
            this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
                header: 'Devolver',
                align: 'right',
                dataIndex: 'devolver',
                default: true,
                width: 90,
                editor: LOG.util.Prototipos.inputDecimal({})
            }));
            /*this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
                header: _this.idioma.cmCantidadDev,
                align: 'right',
                dataIndex: 'cantidaddev',
                default: true,
                width: 100,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    return (value)?value:0;
                }
            }));*/
            this.columnasSur.add(LOG.util.Prototipos.columnaPrecio({
                header: 'Precio'/* + ' ' + codigoAlternativa*/,
                align: 'right',
                dataIndex: 'precio',
                default: true,
                width: 100
            }));
            this.columnasSur.add(LOG.util.Prototipos.columnaPrecio({
                header: 'Precio Unit.'/* + ' ' + codigoAlternativa*/,
                align: 'right',
                dataIndex: 'preciounitario',
                default: true,
                width: 100
            }));
            this.columnasSur.add(LOG.util.Prototipos.columnaImporte({
                header: 'Importe'/* + ' ' + codigoAlternativa*/,
                align: 'right',
                dataIndex: 'importe',
                default: true,
                width: 100
            }));
            this.columnasSur.add({
                header: 'Descuento'/* + ' ' + codigoAlternativa*/,
                align: 'right',
                dataIndex: 'descuento',
                default: true,
                width: 100,
                renderer: function(v, m, rd) {
                    var value = (v) ? v : 0;
                    console.log(value)
                    value =  parseFloat(value).toFixed(2) + '%';
                    console.log(value)
                    return value;
                }
            });
            this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
                header: 'Devuelto',
                align: 'right',
                dataIndex: 'devuelto',
                default: true,
                width: 90/*,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.cantidaddev > 0){
                    return value - record.json.cantidaddev;
                }
                return value;
            }*/
            }));
            this.columnasSur.add(LOG.util.Prototipos.columnaImporte({
                header: 'Importe devuelto'/* + ' ' + codigoAlternativa*/,
                align: 'right',
                dataIndex: 'importedev',
                default: true,
                width: 150
            }));

            this.smGridSur = LOG.util.UIManager.initSelectionModel(3, true);

            var cls = LOG.util.UIManager.proccessColumns(this.columnasSur, this.smGridSur);
            this.cmGridSur = new Ext.grid.ColumnModel(cls.columns);
            this.recStGridSur = Ext.data.Record.create(cls.fields);

            this.storeSur = new Ext.data.Store({
                //autoLoad: true,
                url: 'devolverProductos',
                reader: new Ext.data.JsonReader({
                    id: "idproductopedido",
                    root: "datos"
                }, this.recStGridSur),
                listeners: {
                    load: function(st){
                        st.commitChanges();
                    }
                }
            });

            this.storeSur.on({
                'beforeload': function () {
                    _this.storeSur.baseParams.idpedidotienda = _this.getSmPrincipal().getSelected().data.idpedidotienda;
                    _this.storeSur.initBaseParams.idpedidotienda = _this.getSmPrincipal().getSelected().data.idpedidotienda;

                    _this.storeSur.baseParams.cr = _this.cajasregistradoras;
                    _this.storeSur.initBaseParams.cr = _this.cajasregistradoras;

                    _this.storeSur.baseParams.producto = 1;
                    _this.storeSur.initBaseParams.producto = 1;
                }
            });

            this.gpSur = LOG.util.UIManager.initEditableGridPanel(this.cmGridSur, this.storeSur, this.smGridSur, {nobbar: false});

            this.gpSur.on('beforeedit', function(e) {
                if (e.field == 'devolver') {
                    if(_this.getSmPrincipal().getSelected().data.estado == 3 || _this.getSmPrincipal().getSelected().data.estado == 2){
                        if (parseFloat(e.record.json.cantidadreal) == parseFloat(e.record.json.devuelto) + parseFloat(e.record.json.procesado)) {
                            e.cancel = true;
                        }
                    } else {
                        e.cancel = true;
                    }
                }
                if (e.field == 'cantidadreal') {
                    if (_this.cajasregistradoras != undefined) {
                        if(_this.getSmPrincipal().getSelected().data.estado != 1 && _this.getSmPrincipal().getSelected().data.estado != 2){
                            e.cancel = true;
                        } else {
                            e.cancel = false;
                        }
                    } else {
                        e.cancel = true;
                    }
                }
                if (e.field == 'cantidad') {
                    if (_this.cajasregistradoras != undefined) {
                        if(_this.getSmPrincipal().getSelected().data.estado == 3 || _this.getSmPrincipal().getSelected().data.estado == 2){
                            if (parseFloat(e.record.data.cantidadreal) == 0) {
                                e.cancel = true;
                            }
                        } else {
                            e.cancel = false;
                        }
                    } else {
                        e.cancel = true;
                    }
                }
            });
            this.gpSur.on('afteredit', function(e) {
                if (parseFloat(e.record.json.cantidadreal) < parseFloat(e.record.json.devuelto) + parseFloat(e.record.json.procesado) + parseFloat(e.record.data.devolver)) {
                    mostrarMensaje(3, 'La cantidad a devolver no puede ser mayor a la pedida');
                    e.record.data.devolver = e.originalValue;
                    _this.gpSur.getView().refresh();
                }
                if (e.field == 'cantidad' || e.field == 'cantidadreal') {
                    e.record.data.addmod = (e.record.json.addmod == "1") ? "1" : "2";
                }
            });
            this.gpSur.on({
                'celldblclick': function ( gp, rowIndex, columnIndex, e ) {
                    if (columnIndex == 2) {
                        const copyToClipboard = async str => {
                            try {
                                await navigator.clipboard.writeText(str);
                                mostrarMensaje(1, 'C\xf3digo <b>'+str+'</b> copiado al portapapeles');
                            } catch (error) {
                                console.log(error);
                            }
                        };
                        copyToClipboard(e.target.outerText)
                    }
                }
            });

            this.gridFilter = new LOG.util.GridFilter({
                grid: _this.gpSur,
                concepto: '',
                searchTipText: ''
            });
            this.pnGrid.add(this.gpSur);

            /*SERVICIOS*/
            this.pnGridServ = LOG.util.UIManager.initFocusPanel({
                region: 'center',
                layout: 'border',
                title: 'Servicios',
                view: function () {
                    return this;
                }
            });

            this.columnasServ = new LOG.util.List();
            this.columnasServ.add({
                dataIndex: 'idproductopedido'
            });
            this.columnasServ.add({
                dataIndex: 'idservicio'
            });
            this.columnasServ.add({
                header: 'C\xf3digo',
                dataIndex: 'codreferencia',
                width: 200,
                default: true
            });
            this.columnasServ.add({
                header: 'Servicio',
                dataIndex: 'descripcionventa',
                width: 350,
                autoExpand: true,
                default: true
            });
            this.columnasServ.add({
                header: 'UM',
                dataIndex: 'umedida',
                default: true,
                width: 40
            });
            this.columnasServ.add(LOG.util.Prototipos.columnaCantidad({
                header: 'Cantidad',
                align: 'right',
                dataIndex: 'cantidad',
                default: true,
                width: 90
            }));
            this.columnasServ.add(LOG.util.Prototipos.columnaCantidad({
                header: 'Cantidad pedida',
                align: 'right',
                dataIndex: 'cantidadreal',
                default: true,
                width: 120
            }));
            this.columnasServ.add(LOG.util.Prototipos.columnaCantidad({
                header: 'Devolver',
                align: 'right',
                dataIndex: 'devolver',
                default: true,
                width: 90,
                editor: LOG.util.Prototipos.inputDecimal({})
            }));
            this.columnasServ.add(LOG.util.Prototipos.columnaPrecio({
                header: 'Precio',
                align: 'right',
                dataIndex: 'precio',
                default: true,
                width: 100
            }));
            this.columnasServ.add(LOG.util.Prototipos.columnaPrecio({
                header: 'Precio Unit.',
                align: 'right',
                dataIndex: 'preciounitario',
                default: true,
                width: 100
            }));
            this.columnasServ.add(LOG.util.Prototipos.columnaImporte({
                header: 'Importe',
                align: 'right',
                dataIndex: 'importe',
                default: true,
                width: 100
            }));
            this.columnasServ.add({
                header: 'Descuento',
                align: 'right',
                dataIndex: 'descuento',
                default: true,
                width: 100,
                renderer: function(v, m, rd) {
                    var value = (v) ? v : 0;
                    console.log(value)
                    value =  parseFloat(value).toFixed(2) + '%';
                    console.log(value)
                    return value;
                }
            });
            this.columnasServ.add(LOG.util.Prototipos.columnaCantidad({
                header: 'Devuelto',
                align: 'right',
                dataIndex: 'devuelto',
                default: true,
                width: 90
            }));
            this.columnasServ.add(LOG.util.Prototipos.columnaImporte({
                header: 'Importe devuelto',
                align: 'right',
                dataIndex: 'importedev',
                default: true,
                width: 150
            }));

            this.smGridServ = LOG.util.UIManager.initSelectionModel(3, true);

            var clsServ = LOG.util.UIManager.proccessColumns(this.columnasServ, this.smGridServ);
            this.cmGridServ = new Ext.grid.ColumnModel(clsServ.columns);
            this.recStGridServ = Ext.data.Record.create(clsServ.fields);

            this.storeServ = new Ext.data.Store({
                //autoLoad: true,
                url: 'devolverProductos',
                reader: new Ext.data.JsonReader({
                    id: "idproductopedido",
                    root: "datos"
                }, this.recStGridServ),
                listeners: {
                    load: function(st){
                        st.commitChanges();
                    }
                }
            });

            this.storeServ.on({
                'beforeload': function () {
                    _this.storeServ.baseParams.idpedidotienda = _this.getSmPrincipal().getSelected().data.idpedidotienda;
                    _this.storeServ.initBaseParams.idpedidotienda = _this.getSmPrincipal().getSelected().data.idpedidotienda;

                    _this.storeServ.baseParams.cr = _this.cajasregistradoras;
                    _this.storeServ.initBaseParams.cr = _this.cajasregistradoras;

                    _this.storeServ.baseParams.producto = 0;
                    _this.storeServ.initBaseParams.producto = 0;
                }
            });

            this.gpServ = LOG.util.UIManager.initEditableGridPanel(this.cmGridServ, this.storeServ, this.smGridServ, {nobbar: false});

            this.gpServ.on('beforeedit', function(e) {
                if(_this.getSmPrincipal().getSelected().data.estado == 3 || _this.getSmPrincipal().getSelected().data.estado == 2){
                    if (parseFloat(e.record.json.cantidadreal) == parseFloat(e.record.json.devuelto) + parseFloat(e.record.json.procesado)) {
                        e.cancel = true;
                    }
                } else {
                    e.cancel = true;
                }
            });
            this.gpServ.on('afteredit', function(e) {
                if (parseFloat(e.record.json.cantidadreal) < parseFloat(e.record.json.devuelto) + parseFloat(e.record.json.procesado) + parseFloat(e.record.data.devolver)) {
                    mostrarMensaje(3, 'La cantidad a devolver no puede ser mayor a la pedida');
                    e.record.data.devolver = e.originalValue;
                    _this.gpServ.getView().refresh();
                }
            });
            this.gpServ.on({
                'celldblclick': function ( gp, rowIndex, columnIndex, e ) {
                    if (columnIndex == 2) {
                        const copyToClipboard = async str => {
                            try {
                                await navigator.clipboard.writeText(str);
                                mostrarMensaje(1, 'C\xf3digo <b>'+str+'</b> copiado al portapapeles');
                            } catch (error) {
                                console.log(error);
                            }
                        };
                        copyToClipboard(e.target.outerText)
                    }
                }
            });

            this.gridFilterServ = new LOG.util.GridFilter({
                grid: _this.gpServ,
                concepto: '',
                searchTipText: ''
            });
            this.pnGridServ.add(this.gpServ);

            this.tabGeneral = new LOG.util.UITabTemplate({
                idioma: _this.idioma,
                region: 'center',
                formaVisualizacion: 'panel'
            });

            this.tabGeneral.addTabToTemplete(this.pnGrid);
            this.tabGeneral.addTabToTemplete(this.pnGridServ);
            this.tabGeneral.addTabToTemplete(_this.getPanelEste());

            this.tabGeneral.init();

            this.panelSur.add(this.tabGeneral.view());
            this.panelSur.add(_this.getPanelEsteSur());

            //this.tabGeneral.view();
            return this.panelSur;
        },
        getPanelEste: function () {
            var _this = this;

            this.panelEste = LOG.util.UIManager.initPanel({
                region: 'center',
                title: 'Informaci\xf3n de pago',
                border: true,
                layout: 'border',
                listeners: {
                    /*expand: function (p) {
                        p.setHeight(_this.getPanelPrincipal().getHeight() / 2);
                    }*/
                },
                view: function () {
                    return this;
                }
            });
            this.pnGridEste = LOG.util.UIManager.initFocusPanel({
                region: 'center',
                layout: 'border',
                view: function () {
                    return this;
                }
            });

            this.columnasEste = new LOG.util.List();
            this.columnasEste.add({
                dataIndex: 'idpago'
            });
            this.columnasEste.add({
                dataIndex: 'idppedidotienda'
            });
            this.columnasEste.add({
                header: 'Modo de pago',
                dataIndex: 'denominacion',
                width: 200,
                default: true,
                renderer: function (v, md, rd) {
                    if (rd.data.denominacion == 'Total:') {
                        md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                    }
                    return v;
                }
            });
            this.columnasEste.add(LOG.util.Prototipos.columnaImporte({
                header: 'Importe',
                align: 'right',
                dataIndex: 'importe',
                default: true,
                width: 90,
                renderer: function (v, md, rd) {
                    if (rd.data.denominacion == 'Total:') {
                        md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                    }
                    return v;
                }
            }));


            this.smGridEste = LOG.util.UIManager.initSelectionModel(3, true);

            var clsEste = LOG.util.UIManager.proccessColumns(this.columnasEste, this.smGridEste);
            this.cmGridEste = new Ext.grid.ColumnModel(clsEste.columns);
            this.recStGridEste = Ext.data.Record.create(clsEste.fields);

            this.storeEste = new Ext.data.Store({
                //autoLoad: true,
                url: 'devolverPagos',
                reader: new Ext.data.JsonReader({
                    id: "idpago",
                    root: "datos"
                }, this.recStGridEste),
                listeners: {
                    load: function(st){
                        let importe = 0;
                        Ext.each(st.reader.jsonData.datos, function (r) {
                            importe += parseFloat(r.importe);
                        })
                        st.add(new Ext.data.Record({
                            importe: importe,
                            denominacion: 'Total:'
                        }));
                    }
                }
            });

            this.storeEste.on({
                'beforeload': function () {
                    _this.storeEste.baseParams.idpedidotienda = _this.getSmPrincipal().getSelected().data.idpedidotienda;
                    _this.storeEste.initBaseParams.idpedidotienda = _this.getSmPrincipal().getSelected().data.idpedidotienda;

                    _this.storeEste.baseParams.cr = _this.cajasregistradoras;
                    _this.storeEste.initBaseParams.cr = _this.cajasregistradoras;
                }
            });

            this.gpEste = LOG.util.UIManager.initEditableGridPanel(this.cmGridEste, this.storeEste, this.smGridEste, {nobbar: false});

            this.pnGridEste.add(this.gpEste);

            this.panelEste.add(this.pnGridEste);

            //this.tabGeneral.view();

            return this.panelEste;
        },
        getPanelEsteSur: function () {
            var _this = this;

            this.panelEsteSur = LOG.util.UIManager.initPanel({
                region: 'east',
                title: 'Datos registrables',
                border: true,
                layout: 'fit',
                collapsible: true,
                collapsed: true,
                split: true,
                width: 500,
                listeners: {
                    /*expand: function (p) {
                        p.setHeight(_this.getPanelPrincipal().getHeight() / 2);
                    }*/
                }
            });
            this.pnGridEsteSur = LOG.util.UIManager.initFocusPanel({
                region: 'center',
                layout: 'border',
                view: function () {
                    return this;
                }
            });

            this.columnasEsteSur = new LOG.util.List();
            this.columnasEsteSur.add({
                dataIndex: 'id'
            });
            this.columnasEsteSur.add({
                header: 'Dato',
                dataIndex: 'label',
                width: 200,
                default: true
            });
            this.columnasEsteSur.add({
                header: 'Valor',
                dataIndex: 'valor',
                default: true,
                width: 200
            });


            this.smGridEsteSur = LOG.util.UIManager.initSelectionModel(3, true);

            var clsEsteSur = LOG.util.UIManager.proccessColumns(this.columnasEsteSur, this.smGridEsteSur);
            this.cmGridEsteSur = new Ext.grid.ColumnModel(clsEsteSur.columns);
            this.recStGridEsteSur = Ext.data.Record.create(clsEsteSur.fields);

            this.storeEsteSur = new Ext.data.Store({
                //autoLoad: true,
                url: 'devolverRegistrables',
                reader: new Ext.data.JsonReader({
                    id: "id",
                    root: "datos"
                }, this.recStGridEsteSur),
                listeners: {
                    load: function(st){
                    }
                }
            });

            this.storeEsteSur.on({
                'beforeload': function () {
                    _this.storeEsteSur.baseParams.idproductopedido = _this.gpSur.getSelectionModel().getSelected().data.idproductopedido;
                    _this.storeEsteSur.initBaseParams.idproductopedido = _this.gpSur.getSelectionModel().getSelected().data.idproductopedido;
                }
            });

            this.gpEsteSur = LOG.util.UIManager.initEditableGridPanel(this.cmGridEsteSur, this.storeEsteSur, this.smGridEsteSur, {nobbar: false});

            this.pnGridEsteSur.add(this.gpEsteSur);

            this.panelEsteSur.add(this.pnGridEsteSur);

            return this.panelEsteSur;
        },
        finSeleccion: function (sel, array, eliminar) {
            if (!eliminar) {
                for (var i = 0; i < array.length; i++) {
                    if (sel == array[i]) {
                        return i;
                    }
                }
                return -1;
            } else {
                var auxiliar = new Array();
                for (var i = 0; i < array.length; i++) {
                    if (sel != array[i]) {
                        auxiliar.push(array[i]);
                    }
                }
                return auxiliar;
            }
        },
        getLeyenda: function (pedido = false) {
            if (pedido) {
                return {
                    autoWidth: true,
                    autoHeight: true,
                    tpl: new Ext.XTemplate(
                        '<div class="leyend-block">',
                        '<h3>Pedido con error</h3>',
                        '<ul>',
                        /* '<li style="color:#00CC33;">' + this.idioma.gcCodigoVacio + '</li>',*/
                        '<li style="color:#f995aa;">' + 'Pedido incompleto' + '</li>',
                        '<li style="color:#1c1cff;">' + 'Pedido modificado' + '</li>',
                        '</ul>',
                        '</div>'
                    )
                };
            }
            return {
                autoWidth: true,
                autoHeight: true,
                tpl: new Ext.XTemplate(
                    '<div class="leyend-block">',
                    '<h3>Leyenda</h3>',
                    '<ul>',
                    /* '<li style="color:#00CC33;">' + this.idioma.gcCodigoVacio + '</li>',*/
                    '<li style="color:#ffde1c;">' + `No existe en almac\xe9n` + '</li>',
                    '<li style="color:#f995aa;">' + 'Sin existencias' + '</li>',
                    '<li style="color:#1cc11c;">' + 'Producto adicionado' + '</li>',
                    '<li style="color:#1c1cff;">' + 'Producto modificado' + '</li>',
                    '</ul>',
                    '</div>'
                )
            };
        }
    },

);

LOG.fac.pedidotienda.EstadoEjecucion = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.viewConfig = {
            usarAplicar: false,
            usarAceptar: false
        };
        this.idpedido = config.idpedido;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        //this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
        this.urlBusquedaGridPrincipal = 'getDocumentosGenerados';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.pedidotienda.Idioma);
        LOG.fac.pedidotienda.EstadoEjecucion.superclass.constructor.call(this, config);
        this.getVistaPrincipal().height = 300;
        this.getVistaPrincipal().width = 550;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'tipo',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: 'Nro. Documento',
            width: 120,
            dataIndex: 'nrodoc',
            //default: true
        });
        this.addGridColumn({
            header: 'Nro. Referencia',
            width: 120,
            dataIndex: 'numeroref',
            //default: true
        });
        this.addGridColumn({
            header: 'Tipo documento',
            width: 120,
            dataIndex: 'tipodoc',
            //default: true
        });
        this.addGridColumn({
            header: 'Entidad',
            width: 120,
            dataIndex: 'entidad',
            //default: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.fac.pedidotienda.EstadoEjecucion.superclass.render.call(this);
        this.getStorePrincipal().baseParams.idpedido = _this.idpedido;
        this.getStorePrincipal().initBaseParams.idpedido = _this.idpedido;
        this.getStorePrincipal().load();
        return vista;
    }
});

LOG.fac.pedidotienda.EstadoDevoluciones = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.viewConfig = {
            usarAplicar: false,
            usarAceptar: false
        };
        this.idpedido = config.idpedido;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        //this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
        this.urlBusquedaGridPrincipal = 'getDevolucionesPedido';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.pedidotienda.Idioma);
        LOG.fac.pedidotienda.EstadoDevoluciones.superclass.constructor.call(this, config);
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().width = 650;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: 'Nro. Devoluci\xf3n',
            width: 120,
            dataIndex: 'numero',
            //default: true
        });
        this.addGridColumn({
            header: 'Fecha',
            width: 120,
            dataIndex: 'fecha',
            //default: true
        });
        this.addGridColumn({
            header: 'Importe',
            width: 120,
            dataIndex: 'importe',
            //default: true
        });
        this.addGridColumn({
            header: 'Estado',
            width: 120,
            dataIndex: 'estado',
            renderer: function (v) {
                return LOG.fac.pedidotienda.EstadoDev[v];
            }
        });
        this.addGridColumn({
            header: 'Descripci\xf3n',
            width: 350,
            dataIndex: 'descripcion',
            //default: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.fac.pedidotienda.EstadoDevoluciones.superclass.render.call(this);
        this.getStorePrincipal().baseParams.idpedido = _this.idpedido;
        this.getStorePrincipal().initBaseParams.idpedido = _this.idpedido;
        this.getStorePrincipal().load();
        return vista;
    }
});
/*
LOG.lb.dispositivos.addAlmacen = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        config.modoSeleccion = 1;
        //this.dirController = '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        this.busquedaBasica = true;
        config = Ext.apply(_this, config);
        LOG.lb.dispositivos.addAlmacen.superclass.constructor.call(this, config);

    },
    init: function () {
        var _this = this;
        LOG.lb.dispositivos.addAlmacen.superclass.init.call(this);
        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 350;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    aceptarFn: function(){
        console.info('aceptar');
    },
    close: function () {
        var _this = this;
        _this.getVistaPrincipal().close();
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddeposito'
        });
        this.addGridColumn({
            header: _this.idioma.lbDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
    },
    render: function () {
        var _this = this;
        var p = LOG.lb.dispositivos.addAlmacen.superclass.render.call(this);
        _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                if (this.getCount()> 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }else{
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                /!*st.initBaseParams.tipocliente = _this.tipocliente;
                st.initBaseParams.idclientesproveedores = _this.idclientesproveedores;*!/
                st.baseParams.start = 0;
                st.baseParams.limit = 30;
            }
        });
        return p;
    }
});*/

