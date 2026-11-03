Ext.ns('Ext.erp');
Ext.erp.configuracionparalizacion = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    listaBotonesPanel: undefined,
    listaAcciones: undefined,
    constructor: function (config) {
        var _this = this;
        this.listaAcciones = new LOG.util.List(UCID.portal.getAccionesReportes());
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesPanel = new LOG.util.List();
        this.addButtonPanel('->');
        this.urlController = '/logistica/talleres/configuracion/index.php/configuracionparalizacion/';

        this.layout = {
            type: 'vbox',
            align: 'stretch'
        };
        config.name = 'panelReporteVentas';
        config.items = [this.createGdCenter(), this.createGdSouth()];
        this.listeners = {
            afterrender: function () {
                _this.stReporte.load();
            },
            activate: function (panel) {
                panel.activateTap = true;
            },
            deactivate: function (panel) {
                panel.activateTap = false;
            }
        };
        _this.keyNav = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: "iI", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function () {
                    if (_this.activateTap) {
                        //_this.fnRangosGenerados("i");
                    }
                }
            }, {
                key: "mM", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function () {
                    if (_this.activateTap) {
                        //_this.fnRangosGenerados("m");
                    }
                }
            }, {
                key: Ext.EventObject.DELETE,
                fn: function () {
                    if (_this.activateTap) {
                        //_this.fnRangosGenerados("d");
                    }
                }
            }
        ]);
        Ext.erp.configuracionparalizacion.superclass.constructor.call(this, config);
        _this.btnModReporte.controlFn.createDelegate(this, [_this.btnModReporte, this]).call();
        _this.btnDelReporte.controlFn.createDelegate(this, [_this.btnDelReporte, this]).call();

        this.btnGuardar = LOG.util.Prototipos.botonGuardar({
            text: config.idioma.lbBtnGuardar,
            tooltip: config.idioma.ttlBtnGuardar,
            //disabled: true,
            key: {
                alt: true,
                key: 'G'
            },
            handler: function () {
                _this.salvarConfiguracion();
            }
        });
        this.addButtonPanel(this.btnGuardar);
        this.documentKeyMap = new Ext.KeyMap(document,
                [{
                        alt: true,
                        key: 'G',
                        fn: function () {
                            if (_this.isVisible()) {
                                _this.salvarConfiguracion();
                            }
                        }
                    }]);
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({
            id: 'ayudaconfiguracionparalizacion'
        }));
        Ext.erp.configuracionparalizacion.superclass.constructor.call(this, config);
        _this.on({
            'show': function () {
            }
        })
    },

    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addButtonPanel: function (b, f) {
        this.listaBotonesPanel.add(LOG.util.UIManager.reconfigureButton(b));
    },
    cargarConfiguracionInicial: function () {
        var _this = this;
    },
    salvarConfiguracion: function (parametros) {
        var _this = this;
    },
    grantedAction: function (idAccion) {
        var existe = false;
        this.listaAcciones.each(function (a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    createGdSouth: function () {
        var _this = this;
        this.pTipo = new Ext.erp.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            title: 'Tipos',
            concepto: 'tipo',
            util: {
                titleadd: 'Tipos',
                domain: 'DatReportetipo',
                primaryKey: 'idreportetipo'
            },
            idioma: this.idioma
        });
        this.pGrupo = new Ext.erp.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            title: 'Grupos',
            concepto: 'gruposubgrupo',
            util: {
                titleadd: 'Grupos',
                domain: 'DatReportegruposubgrupo',
                primaryKey: 'idreportegruposubgrupo'
            },
            idioma: this.idioma
        });
        this.pMarca = new Ext.erp.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            title: 'Marcas',
            concepto: 'marca',
            util: {
                titleadd: 'Marcas',
                domain: 'DatReportemarca',
                primaryKey: 'idreportemarca'
            },
            idioma: this.idioma
        });
        this.pModelo = new Ext.erp.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            title: 'Modelos',
            concepto: 'modelo',
            util: {
                titleadd: 'Modelos',
                domain: 'DatReportemodelo',
                primaryKey: 'idreportemodelo'
            },
            idioma: this.idioma
        });
        return {
            xtype: 'panel',
            flex: 1,
            layout: 'hbox',
            layoutConfig: {
                align: 'stretch'
            },
            items: [_this.pTipo, _this.pGrupo, _this.pMarca, _this.pModelo]
        };
    },
    createGdCenter: function () {
        var _this = this;
        this.btnAddReporte = LOG.util.Prototipos.botonAdicionar({
            text: 'Adicionar', tooltip: 'Adicionar configuraci\xf3n',
            handler: function () {
                _this.showWinAddReporte("add");
            }
        });
        this.btnModReporte = LOG.util.Prototipos.botonModificar({
            text: 'Modificar',
            disabled: true,
            tooltip: 'Modificar configuraci\xf3n',
            handler: function () {
                _this.showWinAddReporte("mod");
            },
            controlFn: function (b, cl) {
                _this.smReporte.fireEvent = _this.smReporte.fireEvent.createSequence(function (e) {
                    b.disable();
                    if (_this.smReporte.getSelections().length == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });
        this.btnDelReporte = LOG.util.Prototipos.botonEliminar({
            text: 'Eliminar',
            disabled: true,
            tooltip: 'Eliminar configuraci\xf3n',
            handler: function () {
                if (_this.smReporte.hasSelection()) {
                    mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar la(s) configuraci\xf3n(es) seleccionada(s)\x3f', function (ok) {
                        if (ok === "ok") {
                            _this.delReporte();
                        }
                    });
                }
            },
            controlFn: function (b, cl) {
                _this.smReporte.fireEvent = _this.smReporte.fireEvent.createSequence(function (e) {
                    b.disable();
                    if (_this.smReporte.getSelections().length > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });
        this.smReporte = LOG.util.UIManager.initSelectionModel(2);
        this.stReporte = new Ext.data.Store({
            url: '/logistica/talleres/configuracion/index.php/configuracionparalizacion/cargarReporteParalizacion',
            reader: new Ext.data.JsonReader({
                id: 'idreporteparalizacion',
                root: 'datos', totalProperty: 'cantidad',
                fields: [{
                        name: 'idreporteparalizacion'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'activo'
                    }]
            }),
            listeners: {
                'beforeload': function (st, opts) {
                    st.initBaseParams.limit = _this.gReporte.getBottomToolbar().cbPageSize.getValue();
                },
                'load': function (thisstore, objeto) {
                    //Ext.getBody().unmask();
                }
            }
        });
        this.cmReporte = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({header: 'No.'}),
            {
                dataIndex: 'denominacion',
                header: 'Denominaci\xf3n',
                sortable: true,
                width: 120,
                id: 'denominacion'
            }
        ]);
        this.gReporte = LOG.util.UIManager.initEditableGridPanel(
                this.cmReporte, this.stReporte, this.smReporte, {nobbar: false}
        );
        this.gReporte.getTopToolbar().add([this.btnAddReporte, this.btnModReporte, this.btnDelReporte]);
        this.gReporte.flex = 1;
        this.gReporte.title = 'Reportes de paralizaci\xf3n';
        this.gReporte.autoExpandColumn = 'denominacion';
        return this.gReporte;
    },
    showWinAddReporte: function (action) {
        var _this = this;
        var title = action === 'add' ? 'Adicionar reporte' : 'Modificar reporte';
        this.wReporte = new Ext.erp.wReporte({
            idioma: this.idioma,
            action: action,
            title: title,
            st: _this.stReporte,
            data: _this.smReporte.getSelected() ? _this.smReporte.getSelected().data : ''
        });
        this.wReporte.show();
    },
    delReporte: function () {
        var _this = this;
        var seleccion = _this.smReporte.getSelections();
        var ids = Array();
        Ext.each(seleccion, function (r) {
            ids.push(r.data.idreporteparalizacion);
        });
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionparalizacion/actionsReporte',
            method: 'post',
            params: {
                actions: 'del',
                idreporteparalizacion: Ext.encode(ids)
            },
            callback: function (conf, opts, response) {
                var responseText = Ext.decode(response.responseText);
                if (responseText.success) {
                    mostrarMensaje(1, 'La(s) configuraci\xf3n(es) ha(n) sido eliminada(s) satisfactoriamente');
                    _this.stReporte.reload();
                }
            }
        });
    }
});

Ext.erp.panelGridGeneral = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        this.idioma = config.idioma;
        var _this = this;
        this.parent = config.parent;
        this.gpParent = config.gpParent;
        this.flex = 1;
        this.layout = 'border';
        this.margins = '0 1 0 1';
        this.concepto = config.concepto;
        this.util = config.util;
        config.items = [this.createGdCenter()];

        Ext.erp.panelGridGeneral.superclass.constructor.call(this, config);
        _this.btnAdd.controlFn.createDelegate(this, [_this.btnAdd, this]).call();
        _this.btnDel.controlFn.createDelegate(this, [_this.btnDel, this]).call();
    },
    createGdCenter: function () {
        var _this = this;
        this.btnAdd = LOG.util.Prototipos.botonAdicionar({
            text: 'Adicionar', tooltip: 'Adicionar ' + _this.concepto,
            disabled: true,
            handler: function () {
                var ventanaConcepto = new Ext.erp.addConceptos({
                    concepto: _this.concepto,
                    util: _this.util,
                    idioma: _this.idioma,
                    gpParent: _this.gpParent,
                    urlBusquedaGridPrincipal: 'cargarConcepto'
                });
                ventanaConcepto.init();

                ventanaConcepto.getVistaPrincipal().title = _this.util.titleadd;
                ventanaConcepto.view();
                ventanaConcepto.getGridPrincipal().store.load();
                var botonAceptar = ventanaConcepto.getVistaPrincipal().listaBotones.getItem(2);
                var botonAplicar = ventanaConcepto.getVistaPrincipal().listaBotones.getItem(1);
                botonAceptar.handler = botonAplicar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaConcepto.getGridPrincipal().getSelectionModel().getSelections();
                    var ids = Array();
                    Ext.each(records, function (r) {
                        ids.push(r.data['id' + _this.concepto]);
                    });
                    Ext.Ajax.request({
                        url: '/logistica/talleres/configuracion/index.php/configuracionparalizacion/actionsConcepto',
                        method: 'POST',
                        params: {
                            ids: Ext.encode(ids),
                            util: Ext.encode(_this.util),
                            actions: 'add',
                            idconcepto: 'id' + _this.concepto,
                            idreporteparalizacion: _this.gpParent.getSelectionModel().getSelected().data.idreporteparalizacion
                        },
                        callback: function (o, s, r) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                mostrarMensaje(1, _this.action === 'mod' ? 'Los datos han sido modificados satisfactoriamente' : 'Los datos han sido guardados satisfactoriamente');
                                ventanaConcepto.getGridPrincipal().getStore().reload();
                                _this.stConcepto.reload();
                            } else {
                                mostrarMensaje(1, _this.action === 'mod' ? 'Los datos no fueron guardados' : 'Los datos no fueron guardados');
                            }
                        }
                    });
                });
            },
            controlFn: function (b, cl) {
                _this.gpParent.getSelectionModel().fireEvent = _this.gpParent.getSelectionModel().fireEvent.createSequence(function (e) {
                    b.disable();
                    if (_this.gpParent.getSelectionModel().getSelections().length == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                    if (e == 'selectionchange' && _this.gpParent.getSelectionModel().getSelections().length == 1) {
                        _this.stConcepto.load();
                    }
                });
            }
        });
        this.btnDel = LOG.util.Prototipos.botonEliminar({
            text: 'Eliminar',
            disabled: true,
            tooltip: 'Eliminar ' + _this.concepto,
            handler: function () {
                var seleccion = _this.smConcepto.getSelections();
                var ids = Array();
                Ext.each(seleccion, function (r) {
                    ids.push(r.data[_this.util.primaryKey]);
                });
                Ext.Ajax.request({
                    url: '/logistica/talleres/configuracion/index.php/configuracionparalizacion/actionsConcepto',
                    method: 'POST',
                    params: {
                        ids: Ext.encode(ids),
                        util: Ext.encode(_this.util),
                        actions: 'del'
                    },
                    callback: function (o, s, r) {
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, _this.action === 'mod' ? 'Los datos han sido eliminados satisfactoriamente' : 'Los datos han sido eliminados satisfactoriamente');
                            _this.stConcepto.load();
                        } else {
                            mostrarMensaje(1, _this.action === 'mod' ? 'Los datos no pudieron ser eliminados' : 'Los datos no pudieron ser eliminados');
                        }
                    }
                });
            },
            controlFn: function (b, cl) {
                _this.smConcepto.fireEvent = _this.smConcepto.fireEvent.createSequence(function (e) {
                    b.disable();
                    if (_this.smConcepto.getSelections().length > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });
        this.smConcepto = LOG.util.UIManager.initSelectionModel(2);

        this.stConcepto = new Ext.data.Store({
            url: '/logistica/talleres/configuracion/index.php/configuracionparalizacion/cargarConcepto',
            reader: new Ext.data.JsonReader({
                id: 'idreporte' + _this.concepto,
                root: 'datos', totalProperty: 'cantidad',
                fields: [{
                        name: 'idreporte' + _this.concepto
                    }, {
                        name: 'denominacion'
                    }
                ]
            }),
            listeners: {
                'beforeload': function (st, opts) {
                    st.initBaseParams.util = Ext.encode(_this.util);
                    st.initBaseParams.concepto = _this.concepto;
                    st.initBaseParams.idreporteparalizacion = _this.gpParent.getSelectionModel().getSelected().data.idreporteparalizacion;
                    st.initBaseParams.limit = _this.gConcepto.getBottomToolbar().cbPageSize.getValue();
                },
                'load': function (thisstore, objeto) {
                    //Ext.getBody().unmask();
                }
            }
        });
        this.cmConcepto = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({header: 'No.'}),
            {
                dataIndex: 'denominacion',
                header: 'Denominaci\xf3n',
                sortable: true,
                width: 120,
                id: 'denominacion'
            }
        ]);
        this.gConcepto = LOG.util.UIManager.initEditableGridPanel(
                this.cmConcepto, this.stConcepto, this.smConcepto, {nobbar: false}
        );
        this.gConcepto.getTopToolbar().add([this.btnAdd, this.btnDel]);
        this.gConcepto.title = _this.concepto;
        this.gConcepto.autoExpandColumn = 'denominacion';
        this.gConcepto.region = 'center';
        return this.gConcepto;
    }
});

Ext.erp.addConceptos = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        config.modoSeleccion = 3;
        config.autoLoad = false;
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionparalizacion';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        this.concepto = config.concepto;
        this.busquedaBasica = true;
        this.dataIndexPrincipal = config.dataIndexPrincipal;
        this.util = config.util;
        this.gpParent = config.gpParent;
        config = Ext.apply(_this, config);
        Ext.erp.addConceptos.superclass.constructor.call(this, config);

    },
    init: function () {
        var _this = this;
        Ext.erp.addConceptos.superclass.init.call(this);
        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 350;
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    aceptarFn: function () {
        console.info('aceptar');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'id' + _this.concepto
        });
        this.addGridColumn({
            header: 'Denominaci\xf3n',
            width: 200,
            dataIndex: (_this.dataIndexPrincipal) ? _this.dataIndexPrincipal : 'denominacion',
            default: true
        });
    },
    render: function () {
        var _this = this;
        var p = Ext.erp.addConceptos.superclass.render.call(this);
        _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange') {
                if (this.getCount() > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.initBaseParams.concepto = _this.concepto;
                st.initBaseParams.util = Ext.encode(_this.util);
                st.initBaseParams.all = 1;

                if (_this.concepto != 'persona')
                    st.initBaseParams.idreporteparalizacion = _this.gpParent.getSelectionModel().getSelected().data.idreporteparalizacion;
                st.baseParams.start = 0;
                st.baseParams.limit = 30;
            }
        });
        return p;
    }
});

Ext.erp.wReporte = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        this.usarAplicar = config.action == 'add' ? true : false;
        Ext.erp.wReporte.superclass.constructor.call(this, config);
        if (this.action == 'mod') {
            this.cargarDatos(this.data);
        }
    },
    initComponent: function () {
        var _this = this;
        Ext.erp.wReporte.superclass.initComponent.call(this);
        this.setSize(400, 250);
        this.frmReporteVentas = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center'
        });
        this.txtDenominacion = LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Denominaci\xf3n',
            allowBlank: false,
            maxLength: 50,
            minLength: 2,
            name: 'denominacion',
            enableKeyEvents: true,
            selectOnFocus: true,
            listeners: {
                keyup: function (txt) {
                    if (_this.action == 'mod' && txt.isValid() && txt.isDirty()) {
                        _this.listaBotones.getItem(2).enable();
                        return;
                    }
                    if (txt.isValid()
                            && txt.isDirty()
                            ) {
                        _this.listaBotones.getItem(2).enable();
                        if (_this.listaBotones.getItem(1).isVisible()) {
                            _this.listaBotones.getItem(1).enable();
                        }
                    } else {
                        _this.listaBotones.getItem(2).disable();
                        if (_this.listaBotones.getItem(1).isVisible()) {
                            _this.listaBotones.getItem(1).disable();
                        }
                    }
                }
            }
        });
        this.txtDenominacion.focus(true, 100);
        this.frmReporteVentas.add(this.txtDenominacion);
        this.add(this.frmReporteVentas);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                _this.salvarDatos('ok');
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            disabled: true,
            handler: function () {
                _this.salvarDatos('apply');
            }
        });
    },
    salvarDatos: function (btn) {
        var _this = this;
        if (this.action == 'add')
            if (_this.listaBotones.getItem(1).disabled || _this.listaBotones.getItem(2).disabled)
                return;
            else
            if (_this.listaBotones.getItem(2).disabled)
                return;

        var params = {
            actions: this.action
        };
        if (this.txtDenominacion.isDirty() && this.txtDenominacion.isValid()) {
            params.denominacion = this.txtDenominacion.getValue();
        }
        if (this.action === 'mod') {
            params.idreporteparalizacion = this.data.idreporteparalizacion;
        }
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionparalizacion/actionsReporte',
            method: 'POST',
            params: params,
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, _this.action === 'mod' ? 'La configuraci\xf3n del reporte ha sido modificada satisfactoriamente' : 'La configuraci\xf3n del reporte ha sido adicionada satisfactoriamente');
                    _this.st.reload();
                } else {
                    mostrarMensaje(1, _this.action === 'mod' ? 'No se pudo modificar' : 'No se pudo adicionar');
                }
            }
        });
        if (btn === 'ok') {
            _this.close();
        } else {
            _this.frmReporteVentas.getForm().reset();
            _this.listaBotones.getItem(1).disable();
            _this.listaBotones.getItem(2).disable();
        }
    },
    cargarDatos: function (data) {
        this.frmReporteVentas.getForm().loadRecord(
                new Ext.data.Record({
                    denominacion: data.denominacion,
                    agrupacion: data.agrupacion,
                    orden: data.orden
                })
                );
    }
});
