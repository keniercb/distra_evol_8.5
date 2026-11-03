Ext.ns('LOG.fac.despachotienda');

LOG.fac.despachotienda.View = Ext.extend(LOG.util.UITemplate, {
    seleccion: undefined,
    constructor: function(config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.despachotienda.Idioma);
        this.dirController = '/logistica/facturacion/facturacion/despachotienda/index.php/despachotienda';
        this.urlBusquedaGridPrincipal = 'cargarDespachos';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.autoSelect = false;
        this.seleccionAnterior = new Array();
        //this.autoLoad = false;
        //this.gridEditable = true;
        this.modelo = new LOG.fac.despachotienda.Modelo({
            idioma: config.idioma
        });
        LOG.fac.despachotienda.View.superclass.constructor.call(this, config);
    },
    init: function() {
        var _this = this;

        LOG.fac.despachotienda.View.superclass.init.call(this);
        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
            _this.getPanelPrincipal().add(_this.getPanelSur());
            _this.getPanelPrincipal().add(_this.getPanelEste());
            _this.getGridPrincipal().getStore().on('load', function () {
                if (_this.seleccionAnterior.length > 0) {
                    _this.getGridPrincipal().getSelectionModel().selectRows(_this.seleccionAnterior);
                }
                if (_this.getGridPrincipal().getStore().getCount() == 0) {
                    _this.panelSur.collapse();
                    _this.storeSur.removeAll();
                    _this.panelEste.collapse();
                    _this.storeEste.removeAll();
                }
            });
            /*_this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(
                function (e) {
                    if (e == 'rowclick') {
                        if (_this.getSmPrincipal().getSelections().length == 1) {
                            _this.panelSur.expand();
                            _this.storeSur.load();
                            _this.panelEste.expand();
                            _this.storeEste.load();
                        } else {
                            _this.panelSur.collapse();
                            _this.storeSur.removeAll();
                            _this.panelEste.collapse();
                            _this.storeEste.removeAll();
                        }
                    }
                }
            );*/
            _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(
                function (e) {
                    /*if (e == 'rowselect' || e == 'rowdeselect') {
                        if (_this.getSmPrincipal().getSelections().length == 1) {
                            _this.panelSur.expand();
                            _this.storeSur.load();
                            _this.panelEste.expand();
                            _this.storeEste.load();
                        } else {
                            _this.panelSur.collapse();
                            _this.storeSur.removeAll();
                            _this.panelEste.collapse();
                            _this.storeEste.removeAll();
                        }
                    }*/
                }
            );
            _this.getGridPrincipal().getSelectionModel().on('rowselect', function (sm, index, r) {
                if (_this.finSeleccion(index, _this.seleccionAnterior) == -1)
                    _this.seleccionAnterior.push(index);
                if (_this.getSmPrincipal().getSelections().length == 1) {
                    _this.panelSur.expand();
                    _this.storeSur.load();
                    _this.panelEste.expand();
                    _this.storeEste.load();
                    _this.storeSurE.removeAll();
                } else {
                    //_this.panelSur.collapse();
                    _this.storeSur.removeAll();
                    //_this.panelEste.collapse();
                    _this.storeEste.removeAll();
                    _this.storeSurE.removeAll();
                }
            });
            _this.getGridPrincipal().getSelectionModel().on('rowdeselect', function (sm, index, r) {
                _this.seleccionAnterior = _this.finSeleccion(index, _this.seleccionAnterior, true);
                if (_this.getSmPrincipal().getSelections().length != 1) {
                    //_this.panelSur.collapse();
                    _this.storeSur.removeAll();
                    //_this.panelEste.collapse();
                    _this.storeEste.removeAll();
                    _this.storeSurE.removeAll();
                } else {
                    _this.storeSur.load();
                    _this.storeEste.load();
                    _this.storeSurE.removeAll();
                }
            });
            _this.gpEste.getSelectionModel().on('rowselect', function (sm, index, r) {
                if (sm.getSelections().length > 0) {
                    _this.panelSurEste.expand();
                    _this.storeSurE.load();
                } else {
                    _this.storeSurE.removeAll();
                }
            });
            _this.gpEste.getSelectionModel().on('rowdeselect', function (sm, index, r) {
                if (sm.getSelections().length == 0) {
                    _this.storeSurE.removeAll();
                } else {
                    _this.storeSurE.load();
                }
            });
        });
    },
    render: function() {
        var _this = this;
        var vis = LOG.fac.despachotienda.View.superclass.render.call(this);
        if (typeof _this.btnEliminar.controlFn == 'function') {
            _this.btnEliminar.controlFn.createDelegate(this, [_this.btnEliminar, this]).call();
        }
        if (typeof _this.btnDespachar.controlFn == 'function') {
            _this.btnDespachar.controlFn.createDelegate(this, [_this.btnDespachar, this]).call();
        }
        return vis;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddespachotienda',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'iddeposito',
            hidden: true
        });
        this.addGridColumn({
            header: 'Nro. Despacho',
            width: 100,
            dataIndex: 'nrodespacho',
            //default: true
        });
        this.addGridColumn({
            header: 'Nro. Referencia',
            width: 100,
            dataIndex: 'nroreferencia',
            //default: true
        });
        this.addGridColumn({
            header: 'Fecha',
            width: 80,
            dataIndex: 'fecha',
            //default: true
        });
        this.addGridColumn({
            header: 'Centro de entrega',
            width: 200,
            dataIndex: 'centroentrega',
            //default: true
        });
        this.addGridColumn({
            header: 'Estado',
            width: 100,
            dataIndex: 'estado',
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });

    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.btnNuevo,
            tooltip: _this.idioma.ttBtnNuevo,
            iconCls: 'nuevo',
            //scope: this,
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                    btn.show();
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                Ext.MessageBox.wait('Verificando cantidad de destinos', _this.idioma.msgEspere);
                Ext.Ajax.request({
                    url: 'getDestinos',
                    method: 'POST',
                    params: {
                        iddeposito: _this.idDeposito
                    },
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        var destinos = new Array();
                        var destinosAll = '';
                        Ext.each(resp.datos, function(dest) {
                            destinos.push([dest.idestructura, dest.estructura]);
                            if (destinosAll == '') {
                                destinosAll = dest.idestructura;
                            } else {
                                destinosAll = destinosAll+','+dest.idestructura;
                            }
                        });
                        var storeDest = new Ext.data.SimpleStore({
                            fields: ['idestructura', 'denominacion'],
                            data: destinos
                        });
                        var cmbDestinos = new LOG.util.LovCombo({
                            store: storeDest,
                            fieldLabel: 'Destinos',
                            displayField: 'denominacion',
                            valueField: 'idestructura',
                            typeAhead: true,
                            mode: 'local',
                            anchor: '98%',
                            forceSelection: true,
                            triggerAction: 'all',
                            emptyText: 'Seleccione',
                            selectOnFocus: true
                        });
                        this.winDestinos = new LOG.util.Window({
                            title: 'Entregar a',
                            width: 380,
                            height: 120,
                            layout: 'border',
                            items: [{
                                xtype: 'panel',
                                height: 80,
                                region: 'center',
                                layout: 'form',
                                frame: true,
                                items: [cmbDestinos]
                            }],
                            aceptarFn: function() {

                            },
                            usarAplicar: false,
                            onCancelarHandler: function() {
                                this.scope.destroy();
                            },
                            onAceptarHandler: function() {
                                _this.generarDespacho((cmbDestinos.getValue().length > 0) ? cmbDestinos.getValue() : destinosAll);
                                this.scope.close();
                            },
                            onCloseHandler: function(p) {
                                p.destroy();
                            }
                        });
                        this.winDestinos.show();
                        this.winDestinos.doLayout();
                    }.createDelegate(this)
                });
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: '',
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('REliminar')) {
                    btn.show();
                    btn.disable();
                    _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length == 1) {
                                btn.enable();
                                if (seleccion[0].data.estado == 3)
                                    btn.disable();
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                _this.eliminarDespacho();
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
            disabled: true,
            tooltip: '',
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RAprobar')) {
                    btn.show();
                    btn.disable();
                    _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length == 1) {
                                btn.enable();
                                if (seleccion[0].data.estado == 3)
                                    btn.disable();
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                _this.verificarIncompletos(_this.aprobarDespacho);
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this)
            }
        }));
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.btnDeshabilitar,
            tooltip: _this.idioma.ttBtnDeshabilitar,
            iconCls: 'deshabilitar',
            idItem: 'Deshabilitar',
            isContextual: true,
            //scope: this,
            disabled: true,
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                    btn.show();
                    btn.disable();
                    _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                Ext.each(seleccion, function (uno) {
                                    if (uno.data.activo != "1") {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                _this.habilitar(2);
            }
        }));*/

    },
    generarDespacho: function(destinos) {
        var _this = this;
        Ext.MessageBox.wait('Generando despacho', _this.idioma.msgEspere);
        var objSubmit = {
            iddeposito: _this.idDeposito,
            destinos: destinos || null
        };
        Ext.Ajax.request({
            url: 'generarDespacho',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1 && resp.iddespacho) {
                    mostrarMensaje(resp.codigoMsg, 'El despacho ha sido generado satisfactoriamente');
                    _this.getGridPrincipal().getStore().reload();
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();

                    }
                } else {
                    mostrarMensaje(resp.codigoMsg, 'No se ha generado despacho');
                }
            }.createDelegate(this)
        });
    },
    verificarIncompletos: function(_fn) {
        var _this = this;
        var objSubmit = {iddespacho: _this.getSmPrincipal().getSelected().data.iddespachotienda};
        Ext.MessageBox.wait('Verificando pedidos incompletos en el despacho', _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: 'verificarIncompletos',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [1]).call();

                    }
                } else {
                    mostrarMensaje(2, '\xbfExisten pedidos incompletos en el despacho, desea aprobarlo de todos modos\x3f', function (btn) {
                        if (btn == 'ok') {
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [1]).call();

                            }
                        }
                    });
                }
            }.createDelegate(this)
        });
    },
    aprobarDespacho: function() {
        var _this = this;
        Ext.MessageBox.wait('Aprobando despacho', _this.idioma.msgEspere);
        var objSubmit = {
            iddespacho: _this.getSmPrincipal().getSelected().data.iddespachotienda
        };
        Ext.Ajax.request({
            url: 'aprobarDespacho',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, 'El despacho ha sido aprobado satisfactoriamente');
                    _this.getGridPrincipal().getStore().reload();
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();

                    }
                }
            }.createDelegate(this)
        });

    },
    eliminarDespacho: function() {
        var _this = this;
        Ext.MessageBox.wait('Eliminando despacho', _this.idioma.msgEspere);
        var objSubmit = {
            iddespacho: _this.getSmPrincipal().getSelected().data.iddespachotienda
        };
        Ext.Ajax.request({
            url: 'eliminarDespacho',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, 'El despacho ha sido eliminado satisfactoriamente');
                    _this.getGridPrincipal().getStore().reload();
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();

                    }
                }
            }.createDelegate(this)
        });

    },
    getPanelSur: function () {
        var _this = this;
        this.btnDespachar = LOG.util.UIManager.createBtn({
            text: 'Despachar todo',
            tooltip: 'Completa el despacho con las cantidades pedidas',
            iconCls: 'documentos',
            disabled: true,
            handler: function () {
                Ext.MessageBox.wait('Completando despacho', _this.idioma.msgEspere);
                var objSubmit = {
                    iddespachotienda: _this.getSmPrincipal().getSelected().data.iddespachotienda
                };
                Ext.Ajax.request({
                    url: 'completarDespacho',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success && resp.codigoMsg == 1) {
                            mostrarMensaje(resp.codigoMsg, 'El despacho ha sido completado satisfactoriamente');
                            _this.storeSur.load();
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp.datos]).call();

                            }
                        }
                    }.createDelegate(this)
                });
            },
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RDespachar')) {
                    btn.show();
                    btn.disable();
                    _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(function (e) {
                        var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length == 1) {
                                btn.enable();
                                if (seleccion[0].data.estado == 3)
                                    btn.disable();
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            }
        });
        this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
            text: 'Guardar',
            tooltip: '',
            handler: function() {
                var despachado = new Array();
                var modificados = _this.gpSur.getStore().getModifiedRecords();
                Ext.each(modificados, function(recd) {
                    despachado.push(recd.data);
                });
                Ext.MessageBox.wait(_this.idioma.msgSalvandoDatos, _this.idioma.msgEspere);
                var objSubmit = {
                    iddespacho: _this.getSmPrincipal().getSelected().data.iddespachotienda,
                    despachados: Ext.encode(despachado)
                };
                Ext.Ajax.request({
                    url: 'guardarDespacho',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success && resp.codigoMsg == 1) {
                            mostrarMensaje(resp.codigoMsg, 'Las cantidades han sido guardadas satisfactoriamente');
                            _this.gpSur.getStore().reload();
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp.datos]).call();

                            }
                        }
                    }.createDelegate(this)
                });

            }
        });

        this.panelSur = LOG.util.UIManager.initPanel({
            region: 'south',
            title: _this.idioma.tProductos,
            border: true,
            layout: 'border',
            collapsible: true,
            collapsed: true,
            split: true,
            tbar: ['-', this.btnDespachar],
            listeners: {
                expand: function (p) {
                    p.setHeight(_this.getPanelPrincipal().getHeight() / 2);
                }
            },
            buttons: [_this.btnSalvar]
        });
        this.panelSurEste = LOG.util.UIManager.initPanel({
            region: 'east',
            title: 'Productos del pedido',
            border: true,
            layout: 'fit',
            collapsible: true,
            collapsed: true,
            split: true,
            listeners: {
                expand: function (p) {
                    p.setWidth(_this.getPanelPrincipal().getWidth() / 2);
                }
            }
        });

        /*this.pnGridEste = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border'
        });*/
        this.pnGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border'
        });

        this.columnasSur = new LOG.util.List();
        this.columnasSur.add({
            dataIndex: 'iddespachoproducto'
        });
        this.columnasSur.add({
            dataIndex: 'iddespachotienda'
        });
        this.columnasSur.add({
            dataIndex: 'idindicador'
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
            header: 'Cantidad a despachar',
            align: 'right',
            dataIndex: 'cantidad',
            default: true,
            width: 90/*,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.cantidaddev > 0){
                    return value - record.json.cantidaddev;
                }
                return value;
            }*/
        }));
        this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
            header: 'Cantidad despachada',
            align: 'right',
            dataIndex: 'despachado',
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
        this.columnasSur.add(LOG.util.Prototipos.columnaImporte({
            header: 'Importe'/* + ' ' + codigoAlternativa*/,
            align: 'right',
            dataIndex: 'importe',
            default: true,
            width: 100
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
            listeners: {}
        });

        this.storeSur.on({
            'beforeload': function () {
                _this.storeSur.baseParams.iddespachotienda = _this.getSmPrincipal().getSelected().data.iddespachotienda;
                _this.storeSur.initBaseParams.iddespachotienda = _this.getSmPrincipal().getSelected().data.iddespachotienda;
            },
            'load': function(st){
                st.commitChanges();
            }
        });

        this.gpSur = LOG.util.UIManager.initEditableGridPanel(this.cmGridSur, this.storeSur, this.smGridSur, {nobbar: false});

        this.gpSur.on('beforeedit', function(e) {
            if(_this.getSmPrincipal().getSelected().data.estado == 3){
                e.cancel = true;
            }
        });

        this.gridFilter = new LOG.util.GridFilter({
            grid: _this.gpSur,
            concepto: '',
            searchTipText: ''
        });

        this.pnGrid.add(this.gpSur);
        //productos del pedido
        this.pnGridSE = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border'
        });

        this.columnasSurE = new LOG.util.List();
        this.columnasSurE.add({
            header: 'C\xf3digo',
            dataIndex: 'codreferencia',
            width: 200,
            default: true
        });
        this.columnasSurE.add({
            header: 'Producto',
            dataIndex: 'descripcionventa',
            width: 300,
            autoExpand: true,
            default: true
        });
        this.columnasSurE.add(LOG.util.Prototipos.columnaCantidad({
            header: 'Cantidad pedida',
            align: 'right',
            dataIndex: 'cantidad',
            default: true,
            width: 120/*,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.cantidaddev > 0){
                    return value - record.json.cantidaddev;
                }
                return value;
            }*/
        }));

        this.smGridSurE = LOG.util.UIManager.initSelectionModel(1, true);

        var clsSE = LOG.util.UIManager.proccessColumns(this.columnasSurE, this.smGridSurE);
        this.cmGridSurE = new Ext.grid.ColumnModel(clsSE.columns);
        this.recStGridSurE = Ext.data.Record.create(clsSE.fields);

        this.storeSurE = new Ext.data.Store({
            //autoLoad: true,
            url: 'devolverProductosPedido',
            reader: new Ext.data.JsonReader({
                id: "idindicador",
                root: "datos"
            }, this.recStGridSurE),
            listeners: {}
        });

        this.storeSurE.on({
            'beforeload': function () {
                var seleccion = _this.gpEste.getSelectionModel().getSelections();
                var facturas = (seleccion.length > 0) ? new Array() : [-1];
                Ext.each(seleccion, function(recd) {
                    facturas.push(recd.data.iddocumento);
                });
                _this.storeSurE.baseParams.facturas = Ext.encode(facturas);
                _this.storeSurE.initBaseParams.facturas = Ext.encode(facturas);
            }
        });

        this.gpSurE = LOG.util.UIManager.initEditableGridPanel(this.cmGridSurE, this.storeSurE, this.smGridSurE, {nobbar: false});

        this.gridFilterSE = new LOG.util.GridFilter({
            grid: _this.gpSurE,
            concepto: '',
            searchTipText: ''
        });

        this.pnGridSE.add(this.gpSurE);
        this.panelSurEste.add(this.pnGridSE);
        //fin productos pedido
        this.panelSur.add(this.pnGrid);
        this.panelSur.add(this.panelSurEste);

        return this.panelSur;
    },
    getPanelEste: function () {
        var _this = this;

        this.btnEliminar = LOG.util.Prototipos.botonEliminar({
            disabled: true,
            idioma: this.idioma,
            tooltip: 'Eliminar facturas del despacho',
            handler: function() {
                mostrarMensaje(2, _this.idioma.msgQtEliminarFactura, function(btn, text) {
                    if (btn === 'ok') {
                        var seleccion = _this.smGridEste.getSelections();
                        _this.eliminarFacturas(seleccion);
                    }
                });
            },
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('REliminar')) {
                    btn.show();
                    btn.disable();
                    _this.smGridEste.fireEvent = _this.smGridEste.fireEvent.createSequence(function (e) {
                        var seleccion = _this.smGridEste.getSelections();
                        var seleccionP = _this.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                if (seleccionP[0].data.estado == 3)
                                    btn.disable();
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            }
        });

        this.panelEste = LOG.util.UIManager.initPanel({
            region: 'east',
            title: 'Facturas',
            border: true,
            layout: 'fit',
            collapsible: true,
            collapsed: true,
            split: true,
            tbar: ['-', this.btnEliminar],
            listeners: {
                expand: function (p) {
                    p.setWidth(_this.getPanelPrincipal().getWidth() / 2);
                }
            }
        });

        this.pnGridEste = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border'
        });

        this.columnasEste = new LOG.util.List();
        this.columnasEste.add({
            dataIndex: 'iddespachofactura'
        });
        this.columnasEste.add({
            dataIndex: 'iddocumento'
        });
        this.columnasEste.add({
            header: 'Nro. Factura',
            dataIndex: 'nrofactura',
            width: 100,
            default: true
        });
        this.columnasEste.add({
            header: 'Nro. Referencia',
            dataIndex: 'nroreferencia',
            width: 100,
            default: true
        });
        this.columnasEste.add({
            header: 'Entregar a',
            dataIndex: 'cliente',
            width: 350,
            default: true,
            autoExpand: true
        });
        this.columnasEste.add({
            header: 'Nro. Pedido',
            dataIndex: 'nropedido',
            width: 200,
            default: true
        });

        this.smGridEste = LOG.util.UIManager.initSelectionModel(3, false);

        var cls = LOG.util.UIManager.proccessColumns(this.columnasEste, this.smGridEste);
        this.cmGridEste = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridEste = Ext.data.Record.create(cls.fields);

        this.storeEste = new Ext.data.Store({
            //autoLoad: true,
            url: 'devolverFacturas',
            reader: new Ext.data.JsonReader({
                id: "iddocumento",
                root: "datos"
            }, this.recStGridEste),
            listeners: {}
        });

        this.storeEste.on({
            'beforeload': function () {
                _this.storeEste.baseParams.iddespachotienda = _this.getSmPrincipal().getSelected().data.iddespachotienda;
                _this.storeEste.initBaseParams.iddespachotienda = _this.getSmPrincipal().getSelected().data.iddespachotienda;
            }
        });

        this.gpEste = LOG.util.UIManager.initGrid(this.cmGridEste, this.storeEste, this.smGridEste, {nobbar: false});

        this.gridFilterEste = new LOG.util.GridFilter({
            grid: _this.gpEste,
            concepto: '',
            searchTipText: ''
        });

        this.pnGridEste.add(this.gpEste);

        this.panelEste.add(this.pnGridEste);

        return this.panelEste;
    },
    getReportes: function (_this) {
        var _this = this;
        this.tipoReportes =  new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/OrdenDespacho',
                    isList: true,
                    params: {
                        iddespacho: _this.getSmPrincipal().getSelected().data.iddespachotienda,
                        monedacontable: 9900000000,
                        monedaalternativa: -1
                    }

                }
            ]
        });
        this.tipoReportes.view();
    },
    eliminarFacturas: function (seleccion) {
        var _this = this;
        var facturas = new Array();
        Ext.each(seleccion, function(recd) {
            facturas.push(recd.data.iddocumento);
        });
        Ext.MessageBox.wait('Eliminando facturas', _this.idioma.msgEspere);
        var objSubmit = {
            facturas: Ext.encode(facturas),
            iddespachotienda: _this.getSmPrincipal().getSelected().data.iddespachotienda
        };
        Ext.Ajax.request({
            url: 'eliminarFacturas',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, 'Las facturas han sido eliminadas satisfactoriamente');
                    _this.storeSur.load();
                    _this.storeEste.load();
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();

                    }
                }
            }.createDelegate(this)
        });
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
    }
}
);
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

