Ext.ns('LOG.inv.replicar');
LOG.inv.replicar.PanelExistencias = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
//    modoSeleccion: 2,
    autoLoad: false,
    dirController: '/logistica/inventario/replicadatos/index.php/replicardatos',
    urlBusquedaGridPrincipal: 'cargarExistenciasxUnidad',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.idioma = config.idioma;
        LOG.inv.replicar.PanelExistencias.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnMoviminetos,
            tooltip: this.idioma.ttBtnMoviminetos,
            iconCls: 'movimiento',
            handler: function () {
//                _this.activo = true;
//                _this.getSmPrincipal().each(function(item) {
//                    if (item.data.enexplotacion != 1) {
//                        _this.activo = false;
//                    }
//                });
                this.winMov = new LOG.inv.replicar.WinMovimient({
                    idioma: _this.idioma,
                    productos: _this.getSmPrincipal().getSelections(),
                    porentidad: _this.porentidad,
                    subordinacion: _this.subordinacion,
                    idestructuras: _this.idestructuras,
                    tipo: _this.tipo,
                    activo: _this.getSmPrincipal().getSelected().data.enexplotacion == '1'
                });
                this.winMov.init();
                this.winMov.view();
            },
            controlFn: function (b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (this.getCount() == 1) {
                            b.enable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnPartidas,
            tooltip: this.idioma.ttBtnPartidas,
            iconCls: 'partida',
            handler: function () {
                this.winPartidas = new LOG.inv.replicar.Partidas({
                    idioma: _this.idioma,
                    idProducto: _this.getSmPrincipal().getSelected().data.idproducto,
                    idCategoria: _this.getSmPrincipal().getSelected().data.idcategoria,
                    productos: _this.getSmPrincipal().getSelections(),
                    porentidad: _this.porentidad,
                    subordinacion: _this.subordinacion,
                    idestructuras: _this.idestructuras
                });
                this.winPartidas.init();
                this.winPartidas.view();
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (_this.porentidad) {
                            if (this.getCount() == 1 && this.getSelected().data.tipocontrol == 4) {
                                b.enable();
                            }
                        } else {
                            if (this.hasSelection()) {
                                var deshabilitar = false;
                                this.each(function(item) {
                                    if (item.data.tipocontrol != '4') {
                                        deshabilitar = true;
                                    }
                                });
                                b.setDisabled(deshabilitar);
                            }
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnNSerie,
            tooltip: this.idioma.ttBtnNSerie,
            iconCls: 'numeroserie',
            handler: function() {
                this.winPartidas = new LOG.inv.replicar.NroSerie({
                    idioma: _this.idioma,
                    idProducto: _this.getSmPrincipal().getSelected().data.idproducto,
                    idCategoria: _this.getSmPrincipal().getSelected().data.idcategoria,
                    productos: _this.getSmPrincipal().getSelections(),
                    porentidad: _this.porentidad,
                    subordinacion: _this.subordinacion,
                    idestructuras: _this.idestructuras
                });
                this.winPartidas.init();
                this.winPartidas.view();
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (_this.porentidad) {
                            if (this.getCount() == 1 && this.getSelected().data.tipocontrol == '3'
                                && this.getSelected().json.almacenado == '1' && this.getSelected().data.enalmacen == '1') {
                                b.enable();
                            }
                        } else {
                            if (this.hasSelection()) {
                                b.enable();
                                this.each(function(item) {
                                    if (item.data.tipocontrol != '3' || item.json.almacenado != '1' || item.data.enalmacen != '1') {
                                        b.disable();
                                    }
                                });
                            }
                        }
                    }
                }, 'smPanelNroSerie');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnRegNum,
            tooltip: this.idioma.ttBtnRegNum,
            iconCls: 'mediosenuso',
            handler: function() {
                this.winPartidas = new LOG.inv.replicar.NroSerieAFT({
                    idioma: _this.idioma,
                    idProducto: _this.getSmPrincipal().getSelected().data.idproducto,
                    idCategoria: _this.getSmPrincipal().getSelected().data.idcategoria,
                    productos: _this.getSmPrincipal().getSelections(),
                    porentidad: _this.porentidad,
                    subordinacion: _this.subordinacion,
                    idestructuras: _this.idestructuras
                });
                this.winPartidas.init();
                this.winPartidas.view();
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (this.hasSelection()) {
                            b.enable();
                            this.each(function(item) {
                                if (item.data.enexplotacion != '1' || item.json.explotacion != '1') {
                                    b.disable();
                                }
                            });
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'exportar',
            text: LOG.util.Idioma.lbBtnExcel,
            tooltip: LOG.util.Idioma.ttBtnExcel,
            itemId:'exportarMenu',
            disabled: true,
            menu:[_this.botonExportar({
                text: LOG.util.Idioma.lbBtnExcel + " Listado",
                disabled: true,
                isList:true,
                objSubmit:{},
                url: '/logistica/inventario/replicadatos/index.php/replicardatos/exportarExistencia',
                btn: 'exportar'
            }),_this.botonExportar({
                text: LOG.util.Idioma.lbBtnExcel + " Modelo",
                iconCls: 'exportar',
                disabled: true,
                isList:false,
                objSubmit:{},
                url: '/logistica/inventario/replicadatos/index.php/replicardatos/exportarExistencia',
                btn: 'exportar'
            })],
            controlFn: function (b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                    if (e == 'load') {
                        b.setDisabled(this.getCount() == 0);
                        b.menu.get(0).setDisabled(this.getCount() == 0);
                    }
                }, 'exportarExistencia1');
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (_caller.getSmPrincipal().getSelections().length == 1) {
                            b.menu.get(1).objSubmit.idproducto = this.getSelected().get('idproducto');
                            b.menu.get(1).objSubmit.idindicador = this.getSelected().get('idindicador');
                            b.menu.get(1).objSubmit.idcategoria = this.getSelected().get('idcategoria');
                            b.menu.get(1).objSubmit.tipocontrol = this.getSelected().get('tipocontrol');
                        }
                        b.menu.get(1).setDisabled(this.getCount() == 0);
                    }
                });
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnMaximizar,
            iconCls: 'maximizar',
            handler: function () {
                var gp = _this.gpPrincipal;
                var grid = LOG.util.UIManager.initEditableGridPanel(new Ext.grid.ColumnModel([]), new Ext.data.Store({}), new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }), {
                    view: new Ext.ux.grid.LockingGridView(),
                    nobbar: false
                });

                var btn = LOG.util.UIManager.createBtn({
                    text: _this.idioma.lbBtnMoviminetos,
                    tooltip: _this.idioma.ttBtnMoviminetos,
                    iconCls: 'movimiento',
                    disabled: true,
                    handler: function () {
                        var winMov = new LOG.inv.replicar.WinMovimient({
                            idioma: _this.idioma,
                            productos: grid.getSelectionModel().getSelections(),
                            porentidad: _this.porentidad,
                            subordinacion: _this.subordinacion,
                            idestructuras: _this.idestructuras,
                            tipo: _this.tipo,
                            activo: grid.getSelectionModel().getSelected().data.enexplotacion == '1'
                        });
                        winMov.init();
                        winMov.view();
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSelectionModel(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                b.disable();
                                if (_caller.getSelectionModel().getSelections().length == 1) {
                                    b.enable();
                                }
                            }
                        });
                    }
                });
                grid.getTopToolbar().add(btn);
                var btn2 = LOG.util.UIManager.createBtn({
                    text: _this.idioma.lbBtnPartidas,
                    tooltip: _this.idioma.ttBtnPartidas,
                    disabled: true,
                    iconCls: 'partida',
                    handler: function () {
                        this.winPartidas = new LOG.inv.replicar.Partidas({
                            idioma: _this.idioma,
                            idProducto: grid.getSelectionModel().getSelected().data.idproducto,
                            idCategoria: grid.getSelectionModel().getSelected().data.idcategoria,
                            productos: grid.getSelectionModel().getSelections(),
                            porentidad: _this.porentidad,
                            subordinacion: _this.subordinacion,
                            idestructuras: _this.idestructuras
                        });
                        this.winPartidas.init();
                        this.winPartidas.view();
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSelectionModel(), 'fireEvent', function(e) {
                            if (e == 'selectionchange') {
                                b.disable();
                                if (_caller.getSelectionModel().hasSelection()) {
                                    var deshabilitar = false;
                                    _caller.getSelectionModel().each(function(item) {
                                        if (item.data.concepto == 5 || item.data.tipocontrol != 4 || item.data.enalmacen != 1) {
                                            deshabilitar = true;
                                        }
                                    });
                                    b.setDisabled(deshabilitar);
                                }
                            }
                        });
                    }
                });
                grid.getTopToolbar().add(btn2);
                var btn3 = LOG.util.UIManager.createBtn({
                    text: _this.idioma.lbBtnNSerie,
                    tooltip: _this.idioma.ttBtnNSerie,
                    disabled: true,
                    iconCls: 'numeroserie',
                    handler: function () {
                        this.winPartidas = new LOG.inv.replicar.NroSerie({
                            idioma: _this.idioma,
                            idProducto: grid.getSelectionModel().getSelected().data.idproducto,
                            idCategoria: grid.getSelectionModel().getSelected().data.idcategoria,
                            productos: grid.getSelectionModel().getSelections(),
                            porentidad: _this.porentidad,
                            subordinacion: _this.subordinacion,
                            idestructuras: _this.idestructuras
                        });
                        this.winPartidas.init();
                        this.winPartidas.view();
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSelectionModel(), 'fireEvent', function(e) {
                            if (e == 'selectionchange') {
                                b.disable();
                                if (_caller.getSelectionModel().hasSelection()) {
                                    var deshabilitar = false;
                                    _caller.getSelectionModel().each(function(item) {
                                        if (item.data.concepto == 5 || item.data.tipocontrol != 3 || item.data.enalmacen != 1) {
                                            deshabilitar = true;
                                        }
                                    });
                                    b.setDisabled(deshabilitar);
                                }
                            }
                        });
                    }
                });
                grid.getTopToolbar().add(btn3);
                var btn4 = LOG.util.UIManager.createBtn({
                    text: _this.idioma.lbBtnRegNum,
                    tooltip: _this.idioma.ttBtnRegNum,
                    disabled: true,
                    iconCls: 'mediosenuso',
                    handler: function () {
                        this.winPartidas = new LOG.inv.replicar.NroSerieAFT({
                            idioma: _this.idioma,
                            idProducto: grid.getSelectionModel().getSelected().data.idproducto,
                            idCategoria: grid.getSelectionModel().getSelected().data.idcategoria,
                            productos: grid.getSelectionModel().getSelections(),
                            porentidad: _this.porentidad,
                            subordinacion: _this.subordinacion,
                            idestructuras: _this.idestructuras
                        });
                        this.winPartidas.init();
                        this.winPartidas.view();
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSelectionModel(), 'fireEvent', function(e) {
                            if (e == 'selectionchange') {
                                b.disable();
                                if (_caller.getSelectionModel().hasSelection()) {
                                    var deshabilitar = false;
                                    _caller.getSelectionModel().each(function(item) {
                                        if (item.data.enexplotacion != 1) {
                                            deshabilitar = true;
                                        }
                                    });
                                    b.setDisabled(deshabilitar);
                                }
                            }
                        });
                    }
                });
                grid.getTopToolbar().add(btn4);
                var btn5 = LOG.util.UIManager.createBtn({
                    iconCls: 'exportar',
                    text: LOG.util.Idioma.lbBtnExcel,
                    tooltip: LOG.util.Idioma.ttBtnExcel,
                    itemId:'exportarMenu',
                    menu:[_this.botonExportar({
                        text: LOG.util.Idioma.lbBtnExcel + " Listado",
                        isList:true,
                        objSubmit:{},
                        url: '/logistica/inventario/replicadatos/index.php/replicardatos/exportarExistencia',
                        btn: 'exportar'
                    }),_this.botonExportar({
                        text: LOG.util.Idioma.lbBtnExcel + " Modelo",
                        iconCls: 'exportar',
                        disabled: true,
                        isList:false,
                        objSubmit:{},
                        url: '/logistica/inventario/replicadatos/index.php/replicardatos/exportarExistencia',
                        btn: 'exportar'
                    })],
                    controlFn: function (b, _caller) {
                        LOG.util.UIManager.encadenaFn(_caller.getStore(), 'fireEvent', function(e) {
                            if (e == 'load') {
                                b.setDisabled(this.getCount() == 0);
                                b.menu.get(0).setDisabled(this.getCount() == 0);
                            }
                        }, 'exportarExistencia3');
                        LOG.util.UIManager.encadenaFn(_caller.getSelectionModel(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getSelections().length == 1) {
                                    b.menu.get(1).enable();
                                    b.menu.get(1).objSubmit.idproducto = this.getSelected().get('idproducto');
                                    b.menu.get(1).objSubmit.idindicador = this.getSelected().get('idindicador');
                                    b.menu.get(1).objSubmit.idcategoria = this.getSelected().get('idcategoria');
                                    b.menu.get(1).objSubmit.tipocontrol = this.getSelected().get('tipocontrol');
                                }
                                b.menu.get(1).setDisabled(this.getCount() == 0);
                            }
                        }, 'exportarExistencia4');
                    }
                });
                grid.getTopToolbar().add(btn5);
                grid.reconfigure(gp.getStore(), gp.getColumnModel());
                grid.getBottomToolbar().bindStore(grid.getStore());
                grid.loadMask = {
                    store: grid.getStore()
                }
                LOG.util.UIManager.encadenaFn(gp.getStore(), 'fireEvent', function(e) {
                    if (e == 'load') {
                        btn5.objSubmit = this.initBaseParams;
                    }
                }, 'stExportar2');
                var window = LOG.util.UIManager.initWindow({
                    title: _this.idioma.ttExistenciaUnidad,
                    usarAceptar: false,
                    usarAplicar: false,
                    items: [grid],
                    maximized: true
                });
                window.show();
                grid.getTopToolbar().findBy(function(c) {
                    if (typeof c.controlFn == 'function') {
                        c.controlFn.createDelegate(c, [c, this]).call();
                    }
                }, grid);
                btn5.setDisabled(_this.storePrincipal.getCount() == 0);
                btn5.menu.get(0).objSubmit = btn5.menu.get(1).objSubmit = _this.storePrincipal.baseParams;
            }
        }));
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({dataIndex: 'idcategoria'});
        this.addGridColumn({dataIndex: 'idestructura'});
        this.addGridColumn({dataIndex: 'tipocontrol'});
        this.addGridColumn({dataIndex: 'concepto'});
        this.addGridColumn({dataIndex: 'enalmacen'});
        this.addGridColumn({dataIndex: 'enexplotacion'});
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 100,
            dataIndex: 'codigo',
            locked: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            locked: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCategoria,
            width: 60,
            dataIndex: 'categoria',
            locked: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNaturaleza,
            width: 60,
            dataIndex: 'naturaleza',
            locked: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 40,
            dataIndex: 'umedida',
            locked: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPais,
            width: 60,
            dataIndex: 'pais',
            locked: true,
        });
        this.addGridColumn({
            header: 'Alm.',
            width: 50,
            dataIndex: 'tipocontrol',
            locked: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value == 4) {
                    metaData.css = 'icondistra-partida';
                } else if (value == 3) {
                    metaData.css = 'icondistra-numeroserie';
                } else {
                    metaData.css = 'icondistra-producto';
                }
            }
        });
    },
    botonExportar: function (config) {
        config = config || {};
        var ths = this;
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'E'
            },
            iconCls: 'exportar',
            text: config.text || LOG.util.Idioma.lbBtnExcel,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnExcel,
            handler: function () {
                var _this = this;
                _this.objSubmit.isList = this.isList;
                Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                Ext.Ajax.request({
                    url: _this.url,
                    method: 'POST',
                    params: _this.objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                        window.open(resp.dirFichero, 'ventana', wCfg);
                    }.createDelegate(_this)
                });
            }
        });
        return LOG.util.UIManager.createMenuItem(config);
    },
    reprogramar: function(st) {
        var _this = this;
        LOG.util.UIManager.encadenaFn(st, 'fireEvent', function(e) {
            _this.listaBotones.getBy('itemId', 'exportarMenu').setDisabled(this.getCount() == 0);
            if (e == 'load') {
                _this.listaBotones.getBy('itemId', 'exportarMenu').menu.get(0).setDisabled(this.getCount() == 0);
                _this.listaBotones.getBy('itemId', 'exportarMenu').menu.get(0).objSubmit = this.baseParams;
                _this.listaBotones.getBy('itemId', 'exportarMenu').menu.get(1).objSubmit = this.baseParams;
            }
        }, 'stExportar1');
    }
});

LOG.inv.replicar.WinMovimient = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'ventana',
    modoSeleccion: 1,
    autoLoad: false,
    busquedaBasica: true,
    dirController: '/logistica/inventario/replicadatos/index.php/replicardatos',
    urlBusquedaGridPrincipal: 'cargarMovimiento',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.idioma = config.idioma;
        this.concepto = config.idioma.ttCriterioMov;
        this.textBusquedaSimple = config.idioma.ttTextBusqueda;
        LOG.inv.replicar.WinMovimient.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = this.idioma.tlVentanamovimientos;
        this.getVistaPrincipal().maximizable = false;
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    init: function () {
        LOG.inv.replicar.WinMovimient.superclass.init.call(this, arguments);
        var _this = this;
        var idProducto = new Array();
        var idProductos = new Array();
        var idCategoria = new Array();
        Ext.each(_this.productos, function (p) {
            idProducto.push(p.data.idindicador);
            idProductos.push(p.data.idproducto);
            idCategoria.push(p.data.idcategoria);
            return;
        });
        _this.idProducto = idProducto.join(',');
        _this.idProductos = idProductos.join(',');
        _this.idCategoria = idCategoria.join(',');
        _this.idEstructuras = _this.idestructuras.join(',');
        this.cbDepositos = new LOG.util.ComboBox({
            width: 250,
            url: 'cargarComboDespositos',
            valueField: 'idestructura',
            displayField: 'denominacion'
        });
        LOG.util.UIManager.encadenaFn(this.cbDepositos.getStore(), 'fireEvent', function (e) {
            if (e == 'beforeload') {
                this.baseParams.idproducto = _this.idProducto;
                this.baseParams.idcategoria = _this.idCategoria;
                this.baseParams.id = _this.idProductos;
                this.baseParams.porentidad = _this.porentidad || null;
                this.baseParams.tipo = _this.tipo || null;
                this.baseParams.subordinacion = _this.subordinacion || null;
                this.baseParams.idestructuras = _this.idEstructuras || null;
            }
            if (e == 'load') {
                _this.cbDepositos.setRawValue(_this.cbDepositos.getStore().getAt(0).data.denominacion);
                _this.cbDepositos.setValue(_this.cbDepositos.getStore().getAt(0).data.idestructura);
                _this.cbDepositos.fireEvent('select');
            }
        });

        LOG.util.UIManager.encadenaFn(_this.getPanelSuperior(), 'onRender', function () {
            _this.getPanelSuperior().add({
                border: false,
                tbar: ['-', '->', _this.porentidad ? LOG.util.Idioma.lbEntidad : (_this.activo ? _this.idioma.lbAreaResponsabilidad : LOG.util.Idioma.lbDepositos), '', _this.cbDepositos]
            });
            _this.getPanelSuperior().doLayout();
        });
    },
    render: function (config) {
        var _this = this;
        var vista = LOG.inv.replicar.WinMovimient.superclass.render.call(this, config);
        _this.getStorePrincipal().initBaseParams = {
            idproducto: _this.idProducto,
            idcategoria: _this.idCategoria,
            porentidad: _this.porentidad || null,
            subordinacion: _this.subordinacion || null,
            idestructuras: _this.idEstructuras || null,
            activo: _this.activo || null
        };
        this.cbDepositos.on('select', function () {
            _this.getStorePrincipal().initBaseParams.idDeposito = _this.cbDepositos.getValue();
            _this.getStorePrincipal().initBaseParams.porentidad = _this.porentidad || null;
            _this.getStorePrincipal().load({
                params: {
                    idDeposito: _this.cbDepositos.getValue()
                }
            });
        });
        return vista;

    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        if (this.porentidad) {
            this.addGridColumn({
                header: LOG.util.Idioma.lbDepositos,
                width: 100,
                dataIndex: 'deposito',
                agrupador: true,
                default: true
            });
        }
        this.addGridColumn({
            header: this.idioma.cgFecha,
            width: 80,
            dataIndex: 'fecha',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTipoDoc,
            width: 110,
            dataIndex: 'denomdocumento',
            default: true
        });
        if (this.activo) {
            this.addGridColumn({
                header: this.idioma.cgOperacion,
                width: 100,
                dataIndex: 'denomoperacion',
                renderer: function(_v) {
                    return _v || '-';
                },
                default: true
            });
        }
        this.addGridColumn({
            header: this.idioma.cgNumeroDocumento,
            width: 80,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPD,
            width: 100,
            dataIndex: 'cliente',
            autoExpand: true,
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgEntradaCant,
            dataIndex: 'entradacant',
            width: 100,
            align: 'right',
            default: true
        }));
//        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
//            header: this.idioma.cgEntradaImp,
//            dataIndex: 'entradaimp',
//            width: 100,
//            align: 'right',
//            default: true
//        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgSalidaCant,
            dataIndex: 'salidacant',
            width: 100,
            align: 'right',
            default: true
        }));
//        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
//            header: this.idioma.cgSalidaImp,
//            dataIndex: 'salidaimp',
//            width: 100,
//            align: 'right',
//            default: true
//        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistCant,
            dataIndex: 'existenciaactual',
            width: 100,
            align: 'right',
            default: true
        }));
//        if (!this.activo) {
//            this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
//                header: this.idioma.cgPrecioPromedio,
//                dataIndex: 'preciopromedio',
//                width: 110,
//                align: 'right',
//                default: true
//            }));
//        }
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.activo ? this.idioma.cgValorContable : this.idioma.cgImporteTotal,
            dataIndex: this.activo ? 'valorcontable' : 'importetotal',
            width: 110,
            align: 'right',
            default: true
        }));
    }
});

LOG.inv.replicar.Partidas = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'ventana',
    modoSeleccion: 1,
    autoLoad: false,
    // busquedaBasica: true,
    dirController: '/logistica/inventario/replicadatos/index.php/replicardatos',
    urlBusquedaGridPrincipal: 'cargarPartidas',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.idioma = config.idioma;
        LOG.inv.replicar.Partidas.superclass.constructor.call(this, config);
        var _this = this;
        var idProducto = new Array();
        var idCategoria = new Array();
        Ext.each(_this.productos, function (p) {
            idProducto.push(p.data.idindicador);
            idCategoria.push(p.data.idcategoria);
            return;
        });
        _this.idProducto = idProducto.join(',');
        _this.idCategoria = idCategoria.join(',');
        _this.idEstructuras = _this.idestructuras.join(',');
        this.getVistaPrincipal().title = this.idioma.tlVentanaPartidas;
        this.getVistaPrincipal().maximizable = false;
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    render: function (config) {
        var _this = this;
        var vista = LOG.inv.replicar.WinMovimient.superclass.render.call(this, config);
        this.getStorePrincipal().initBaseParams = {
            idproducto: _this.idProducto,
            idcategoria: _this.idCategoria,
            porentidad: _this.porentidad || null,
            subordinacion: _this.subordinacion || null,
            idestructuras: _this.idEstructuras || null
        };
//        if (this.porentidad) {
//            this.cbDepositos.on('select', function () {
//                _this.getStorePrincipal().initBaseParams.idDeposito = _this.cbDepositos.getValue();
//                _this.getStorePrincipal().initBaseParams.porentidad = true;
//                _this.getStorePrincipal().load({
//                    params: {
//                        idDeposito: _this.cbDepositos.getValue()
//                    }
//                });
//                _this.listaBotones.getBy('btn', 'exportar').objSubmit.idDeposito = _this.cbDepositos.getValue();
//            });
//        } else {
            this.getStorePrincipal().load();
//        }
        return vista;

    },
    init: function () {
        LOG.inv.replicar.Partidas.superclass.init.call(this, arguments);
//        if (this.porentidad) {
//            var _this = this;
//            this.cbDepositos = new LOG.util.ComboBox({
//                width: 250,
//                url: 'cargarComboDespositos',
//                valueField: 'idestructura',
//                displayField: 'denominacion'
//            });
//            LOG.util.UIManager.encadenaFn(this.cbDepositos.getStore(), 'fireEvent', function (e) {
//                if (e == 'beforeload') {
//                    this.baseParams.idproducto = _this.idProducto;
//                    this.baseParams.idcategoria = _this.idCategoria;
//                    this.baseParams.porentidad = _this.porentidad;
//                }
//                if (e == 'load') {
//                    _this.cbDepositos.setRawValue(_this.cbDepositos.getStore().getAt(0).data.denominacion);
//                    _this.cbDepositos.setValue(_this.cbDepositos.getStore().getAt(0).data.idestructura);
//                    _this.cbDepositos.fireEvent('select');
//                }
//            });
//
//            LOG.util.UIManager.encadenaFn(_this.getPanelSuperior(), 'onRender', function () {
//                _this.getPanelSuperior().add({
//                    border: false,
//                    tbar: ['-', '->', _this.porentidad ? LOG.util.Idioma.lbEntidad : LOG.util.Idioma.lbDepositos, '', _this.cbDepositos]
//                });
//                _this.getPanelSuperior().doLayout();
//            });
//        }
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        this.addToolbarButton(LOG.util.Prototipos.botonExportar({
            disabled: true,
            url: '/logistica/inventario/replicadatos/index.php/replicardatos/exportarPartidas',
            btn: 'exportar',
            objSubmit: {
                idproducto: this.idProducto,
                idcategoria: this.idCategoria,
                porentidad: this.porentidad || null,
                subordinacion: this.subordinacion || null,
                idestructuras: this.idEstructuras || null
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                    if (e == 'beforeload') {
                        b.disable();
                    }
                    if (e == 'load') {
                        b.setDisabled(this.getCount() == 0);
                    }
                }, 'exportarPartida');
            }
        }));
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        if (this.idProducto.split(',').length > 1) {
            this.addGridColumn({
                header: this.idioma.cgDenominacion,
                hidden: true,
                dataIndex: 'denominacion',
                agrupador: true,
                default: true
            });
        }
        if (this.porentidad) {
            this.addGridColumn({
                header: this.idioma.cgEntidad,
                dataIndex: 'entidad',
                autoExpand: true,
                default: true
            });
        }
        this.addGridColumn({
            header: LOG.util.Idioma.lbDepositos,
            dataIndex: 'deposito',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            dataIndex: 'denominacionubic',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgEstiba,
            dataIndex: 'estiba',
            default: false
        });
        this.addGridColumn({
            header: this.idioma.cgHilera,
            dataIndex: 'hilera',
            default: false
        });
        this.addGridColumn({dataIndex: 'idproductomunic'});
        this.addGridColumn({dataIndex: 'idmovproductomunic'});
        this.addGridColumn({
            header: 'MGP',
            dataIndex: 'idpartida',
            renderer: function (valor) {
                if (!valor) {
                    valor = 'S/Datos'
                }
                return valor;
            },
            default: false
        });
        this.addGridColumn({
            header: 'MGA',
            dataIndex: 'idanno',
            renderer: function (valor) {
                if (valor == 0) {
                    valor = 'S/Datos'
                }
                return valor;
            },
            default: false
        });
        this.addGridColumn({
            header: 'MGF',
            dataIndex: 'idfab',
            default: false
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,
            dataIndex: 'existencia',
            align: 'right',
            default: true
        }));
        this.addGridColumn({
            header: 'PIM',
            dataIndex: 'denominacionmarcapolvuno'
        });
        this.addGridColumn({
            header: 'PIP',
            dataIndex: 'idpartidapolvuno'
        });
        this.addGridColumn({
            header: 'PIA',
            dataIndex: 'idannopolvuno'
        });
        this.addGridColumn({
            header: 'PIF',
            dataIndex: 'idfabpolvuno'
        });
        this.addGridColumn({
            header: 'PIIM',
            dataIndex: 'denominacionmarcapolvdos',
        });
        this.addGridColumn({
            header: 'PIIP',
            dataIndex: 'idpartidapolvdos'
        });
        this.addGridColumn({
            header: 'PIIA',
            dataIndex: 'idannopolvdos'
        });
        this.addGridColumn({
            header: 'PIIF',
            dataIndex: 'idfabpolvdos'
        });
        this.addGridColumn({
            header: 'ExM',
            dataIndex: 'denominacionmarcaexplosivo'
        });
        this.addGridColumn({
            header: 'ExP',
            dataIndex: 'idpartidaexplosivo'
        });
        this.addGridColumn({
            header: 'ExA',
            dataIndex: 'idannoexplosivo'
        });
        this.addGridColumn({
            header: 'ExF',
            dataIndex: 'idfabexplosivo'
        });
        this.addGridColumn({
            header: 'EspM',
            dataIndex: 'denominacionmarcaespoleta'
        });
        this.addGridColumn({
            header: 'EspP',
            dataIndex: 'idpartidaespoleta'
        });
        this.addGridColumn({
            header: 'EspA',
            dataIndex: 'idannoespoleta'
        });
        this.addGridColumn({
            header: 'EspF',
            dataIndex: 'idfabespoleta'
        });
        this.addGridColumn({
            header: 'EstM',
            dataIndex: 'denominacionmarcaestopin'
        });
        this.addGridColumn({
            header: 'EstP',
            dataIndex: 'idpartidaestopin'
        });
        this.addGridColumn({
            header: 'EstA',
            dataIndex: 'idannoestopin'
        });
        this.addGridColumn({
            header: 'EstF',
            dataIndex: 'idfabestopin'
        });
        this.addGridColumn({dataIndex: 'idubicacion'});
        this.addGridColumn({dataIndex: 'checksum'});

    }
});

LOG.inv.replicar.NroSerie = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'ventana',
    modoSeleccion: 1,
    autoLoad: false,
    // busquedaBasica: true,
    dirController: '/logistica/inventario/replicadatos/index.php/replicardatos',
    urlBusquedaGridPrincipal: 'cargarNroSerie',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.idioma = config.idioma;
        LOG.inv.replicar.NroSerie.superclass.constructor.call(this, config);
        var _this = this;
        var idProducto = new Array();
        var idCategoria = new Array();
        Ext.each(_this.productos, function (p) {
            idProducto.push(p.data.idindicador);
            idCategoria.push(p.data.idcategoria);
            return;
        });
        _this.idProducto = idProducto.join(',');
        _this.idCategoria = idCategoria.join(',');
        _this.idEstructuras = _this.idestructuras.join(',');
        this.getVistaPrincipal().title = 'N\xfameros de serie';
        this.getVistaPrincipal().maximizable = false;
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    render: function (config) {
        var _this = this;
        var vista = LOG.inv.replicar.NroSerie.superclass.render.call(this, config);
        _this.getStorePrincipal().initBaseParams = {
            idproducto: _this.idProducto,
            idcategoria: _this.idCategoria,
            porentidad: _this.porentidad || null,
            subordinacion: _this.subordinacion || null,
            idestructuras: _this.idEstructuras || null
        };
//        if (this.porentidad) {
//            this.cbDepositos.on('select', function () {
//                _this.getStorePrincipal().initBaseParams.idDeposito = _this.cbDepositos.getValue();
//                _this.getStorePrincipal().initBaseParams.idDeposito = true;
//                _this.getStorePrincipal().load({
//                    params: {
//                        idDeposito: _this.cbDepositos.getValue()
//                    }
//                });
//                _this.listaBotones.getBy('btn', 'exportar').objSubmit.idDeposito = _this.cbDepositos.getValue();
//            });
//        } else {
            this.getStorePrincipal().load();
//        }
        return vista;

    },
    init: function () {
        LOG.inv.replicar.NroSerie.superclass.init.call(this, arguments);
//        if (this.porentidad) {
//            var _this = this;
//            this.cbDepositos = new LOG.util.ComboBox({
//                width: 250,
//                url: 'cargarComboDespositos',
//                valueField: 'idestructura',
//                displayField: 'denominacion'
//            });
//            LOG.util.UIManager.encadenaFn(this.cbDepositos.getStore(), 'fireEvent', function (e) {
//                if (e == 'beforeload') {
//                    this.baseParams.idproducto = _this.idProducto;
//                    this.baseParams.idcategoria = _this.idCategoria;
//                    this.baseParams.porentidad = _this.porentidad;
//                }
//                if (e == 'load') {
//                    _this.cbDepositos.setRawValue(_this.cbDepositos.getStore().getAt(0).data.denominacion);
//                    _this.cbDepositos.setValue(_this.cbDepositos.getStore().getAt(0).data.idestructura);
//                    _this.cbDepositos.fireEvent('select');
//                }
//            });
//
//            LOG.util.UIManager.encadenaFn(_this.getPanelSuperior(), 'onRender', function () {
//                _this.getPanelSuperior().add({
//                    border: false,
//                    tbar: ['-', '->', _this.porentidad ? LOG.util.Idioma.lbEntidad : LOG.util.Idioma.lbDepositos, '', _this.cbDepositos]
//                });
//                _this.getPanelSuperior().doLayout();
//            });
//        }
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        this.addToolbarButton(LOG.util.Prototipos.botonExportar({
            disabled: true,
            url: '/logistica/inventario/replicadatos/index.php/replicardatos/exportarNroSerie',
            btn: 'exportar',
            objSubmit: {
                idproducto: this.idProducto,
                idcategoria: this.idCategoria,
                porentidad: this.porentidad || null,
                subordinacion: this.subordinacion || null,
                idestructuras: this.idEstructuras || null
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                    if (e == 'beforeload') {
                        b.disable();
                    }
                    if (e == 'load') {
                        b.setDisabled(this.getCount() == 0);
                    }
                }, 'exportarNroSerie');
            }
        }));
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        if (this.idProducto.split(',').length > 1) {
            this.addGridColumn({
                header: this.idioma.cgDenominacion,
                hidden: true,
                dataIndex: 'denominacion',
                agrupador: true
            });
        }
        if (this.porentidad) {
            this.addGridColumn({
                header: this.idioma.cgEntidad,
                dataIndex: 'entidad',
                autoExpand: true,
                default: true
            });
        }
        this.addGridColumn({
            header: LOG.util.Idioma.lbDepositos,
            dataIndex: 'deposito',
            width: 170,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            dataIndex: 'denominacionubic',
            autoExpand: !this.porentidad,
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNumero,
            dataIndex: 'numero',
            width: 100,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroSerie,
            dataIndex: 'nroserie',
            width: 100,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAnnoFabricacion,
            dataIndex: 'annofabricacion',
            width: 120,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgSituacion,
            dataIndex: 'denominacionconserv',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAnnoConservacion,
            dataIndex: 'annoconservacion',
            width: 100,
            default: true
        });
        this.addGridColumn({dataIndex: 'idproductonroserie'});
    }
});

LOG.inv.replicar.NroSerieAFT = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'ventana',
    modoSeleccion: 1,
    autoLoad: false,
    // busquedaBasica: true,
    dirController: '/logistica/inventario/replicadatos/index.php/replicardatos',
    urlBusquedaGridPrincipal: 'cargarNroSerieActivo',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.idioma = config.idioma;
        LOG.inv.replicar.NroSerieAFT.superclass.constructor.call(this, config);
        var _this = this;
        var idProducto = new Array();
        var idCategoria = new Array();
        Ext.each(_this.productos, function (p) {
            idProducto.push(p.data.idindicador);
            idCategoria.push(p.data.idcategoria);
            return;
        });
        _this.idProducto = idProducto.join(',');
        _this.idCategoria = idCategoria.join(',');
        _this.idEstructuras = _this.idestructuras.join(',');
        this.getVistaPrincipal().title = this.idioma.tlRegistroNumerico;
        this.getVistaPrincipal().maximizable = false;
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    render: function (config) {
        var vista = LOG.inv.replicar.NroSerieAFT.superclass.render.call(this, config);
        this.getStorePrincipal().initBaseParams = {
            idproducto: this.idProducto,
            idcategoria: this.idCategoria,
            porentidad: this.porentidad || null,
            subordinacion: this.subordinacion || null,
            idestructuras: this.idEstructuras || null
        };
        this.getStorePrincipal().load();
        return vista;
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonExportar({
            disabled: true,
            url: '/logistica/inventario/replicadatos/index.php/replicardatos/exportarNroSerieActivo',
            btn: 'exportar',
            objSubmit: {
                idproducto: _this.idProducto,
                idcategoria: _this.idCategoria,
                porentidad: _this.porentidad || null,
                subordinacion: _this.subordinacion || null,
                idestructuras: _this.idEstructuras || null
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                    if (e == 'beforeload') {
                        b.disable();
                    }
                    if (e == 'load') {
                        b.setDisabled(this.getCount() == 0);
                    }
                }, 'exportarNroSerieActivo');
            }
        }));
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        if (this.porentidad) {
            this.addGridColumn({
                header: this.idioma.cgEntidad,
                dataIndex: 'entidad',
                autoExpand: true,
                default: true
            });
        }
        this.addGridColumn({
            header: this.idioma.cgAreaResponsabilidad,
            dataIndex: 'arearesponsabilidad',
            width: 120,
            agrupador: !this.porentidad,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroSerie,
            width : 90,
            dataIndex: 'nroserie',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroInventario,
            dataIndex: 'nroinventario',
            width : 100,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCategoriaATF,
            dataIndex: 'denominacioncategoria',
            width : 100,
            renderer: function(_v) {
                return _v || '-';
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            dataIndex: 'denominacionubicacion',
            autoExpand: !this.porentidad,
            width: 170,
            renderer: function(_v) {
                return _v || '-';
            },
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgValorContable,
            dataIndex: 'valorcontable',
            width: 100,
            align: 'right',
            default: true
        }));
        this.addGridColumn({
            header: this.idioma.cgEstadoTecnico,
            dataIndex: 'denominacionestatustecnico',
            width: 100,
            default: true
        });
        this.addGridColumn({dataIndex: 'idproductonumericoactivo'});
    }
});