Ext.ns('LOG.lb.plugin');

LOG.lb.plugin.CodigoCliente = function() {
    function initWindowAsociar(v, scope) {
        scope.windowGeneral = Ext.extend(LOG.util.Window, {
            cerrarAceptar: true,
            listaBotonesCodigo: undefined,
            listaBotonesCliente: undefined,
            listacolumnascodigo: undefined,
            listacolumnascliente: undefined,
            constructor: function (config) {
                var _this = this;
                this.idindicador = config.idindicador;
                this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.lb.codigocliente.Idioma);
                this.listaBotonesCodigo = new LOG.util.List();
                this.listaBotonesCliente = new LOG.util.List();
                this.listacolumnascodigo = new LOG.util.List();
                this.listacolumnascliente = new LOG.util.List();
                this.usarAplicar = false;
                this.usarAceptar = false;
                this.height = 450;
                this.width = 880;
                this.title = this.idioma.tlAsociarElementos;
                scope.windowGeneral.superclass.constructor.call(_this, arguments);
                _this.show();
                this.listaBotonesCodigo.each(function(b) {
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(this, [b, this]).call();
                    }
                }.createDelegate(this));
                this.listaBotonesCliente.each(function(b) {
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(this, [b, this]).call();
                    }
                }.createDelegate(this));
            },
            initComponent: function (config) {
                var _this = this;

                Ext.apply(_this.listaBotones.getItem(0), {
                    text: _this.idioma.lbBtnCerrar,
                    key: {
                        key: 'X',
                        ctrl: true,
                        alt: true
                    }
                });

                this.listaBotonesCodigo.add(LOG.util.Prototipos.botonAdicionar({
                    scope: this,
                    tooltip: _this.idioma.ttBtnAdicionarCodigo,
                    handler: function () {
                        _this.winAdicionarCodigo = new scope.windowAddCodigo({
                             idioma: _this.idioma,
                             idindicadorselecc: (scope.view.getSmPrincipal().getSelected()) ? scope.view.getSmPrincipal().getSelected().data.idindicador : null,
                             st: _this.stGridCodigo
                        });
                        _this.winAdicionarCodigo.show();

                    },
                    controlFn: function (b, _caller) {
                        if (scope.view.grantedAction('RGESTI') || scope.view.grantedAction('RAdicionar')) {
                            b.setVisible(true);
                        } else {
                            b.setVisible(false);
                        }
                    }
                }));

                this.listaBotonesCodigo.add(LOG.util.Prototipos.botonEliminar({
                    scope: this,
                    tooltip: _this.idioma.ttBtnEliminarCodigo,
                    handler: function () {
                        var idcodigos = new Array();

                        if (!_this.smGridCodigo.hasSelection()) {
                            mostrarMensaje(1, _this.idioma.msgSelectCodigo);
                            return;
                        } else {
                            Ext.each(_this.smGridCodigo.getSelections(), function (rec) {
                                idcodigos.push(rec.data.idcodigoindicador);
                            });

                            _this.eliminar(idcodigos, 1, function(r) {
                                _this.stGridCodigo.load();
                            });
                        }
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        if (scope.view.grantedAction('RGESTI') || scope.view.grantedAction('REliminar')) {
                            b.setVisible(true);
                            LOG.util.UIManager.encadenaFn(_this.smGridCodigo, 'fireEvent', function (e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() > 0) {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'eliminar');
                        } else {
                            b.setVisible(false);
                        }
                    }
                }));

                this.listaBotonesCliente.add(LOG.util.Prototipos.botonAdicionar({
                    scope: this,
                    tooltip: _this.idioma.ttBtnAdicionarCliente,
                    handler: function () {
                        _this.winAdicionarCliente = new scope.windowAddCliente({
                            idioma: _this.idioma,
                            st: _this.stGridCliente,
                            idindicadorselecc: (scope.view.getSmPrincipal().getSelected()) ? scope.view.getSmPrincipal().getSelected().data.idindicador : null,
                            idcodigoindicador: (_this.smGridCodigo.getSelected()) ? _this.smGridCodigo.getSelected().data.idcodigoindicador : null,
                        });
                        _this.winAdicionarCliente.show();
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        if (scope.view.grantedAction('RGESTI') || scope.view.grantedAction('RAdicionar')) {
                            b.setVisible(true);
                            LOG.util.UIManager.encadenaFn(_this.smGridCodigo, 'fireEvent', function (e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() == 1) {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'adicionar');
                        } else {
                            b.setVisible(false);
                        }
                    }
                }));

                this.listaBotonesCliente.add(LOG.util.Prototipos.botonEliminar({
                    scope: this,
                    tooltip: _this.idioma.ttBtnEliminarCliente,
                    handler: function () {
                        var idclientes = new Array();

                        if (!_this.smGridCliente.hasSelection()) {
                            mostrarMensaje(1, _this.idioma.msgSelectCliente);
                            return;
                        } else {
                            Ext.each(_this.smGridCliente.getSelections(), function (rec) {
                                idclientes.push(rec.data.idclientecodigo);
                            });

                            _this.eliminar(idclientes, null ,function(r) {
                                _this.stGridCliente.load();
                            });
                        }
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        if (scope.view.grantedAction('RGESTI') || scope.view.grantedAction('REliminar')) {
                            b.setVisible(true);
                            LOG.util.UIManager.encadenaFn(_this.smGridCliente, 'fireEvent', function (e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() > 0) {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'eliminar');
                        } else {
                            b.setVisible(false);
                        }
                    }
                }));

                this.listacolumnascodigo.add({
                    header: _this.idioma.lbCmCodigo,
                    dataIndex: 'codigo',
                    width: 120,
                    default: false
                });

                this.listacolumnascodigo.add({
                    header:  _this.idioma.lbCmNombre,
                    dataIndex: 'nombre',
                    width: 200,
                    default: true,
                    autoExpand: true
                });

                this.listacolumnascodigo.add({
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcodigoindicador'
                });

                this.listacolumnascliente.add({
                    header: _this.idioma.lbCmCodCliente,
                    dataIndex: 'codigo',
                    width: 120,
                    default: false
                });

                this.listacolumnascliente.add({
                    header: _this.idioma.lbCmNombCliente,
                    dataIndex: 'cliente',
                    width: 200,
                    default: true,
                    autoExpand: true
                });

                this.listacolumnascliente.add({
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idclientecodigo'
                });

                this.smGridCodigo = LOG.util.UIManager.initSelectionModel(2);

                this.smGridCodigo.fireEvent = this.smGridCodigo.fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() > 0) {
                            _this.stGridCliente.load();
                        }
                    }
                });

                var cls1 = LOG.util.UIManager.proccessColumns(this.listacolumnascodigo);

                this.cmGridCodigo = new Ext.grid.ColumnModel(cls1.columns);

                this.recStGridCodigo = Ext.data.Record.create(cls1.fields);

                this.stGridCodigo = new Ext.data.Store({
                    autoload: true,
                    url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarCodigos',
                    reader: new Ext.data.JsonReader({
                        id: 'idcodigoindicador',
                        totalProperty: 'cantidad',
                        root: 'datos'
                    }, this.recStGridCodigo)
                });

                this.stGridCodigo.on({
                    'beforeload': function () {
                        _this.stGridCodigo.initBaseParams.idindicador = (scope.view.getSmPrincipal().getSelected()) ? scope.view.getSmPrincipal().getSelected().data.idindicador : null;
                    }
                });

                this.stGridCodigo.fireEvent = this.stGridCodigo.fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        _this.smGridCodigo.clearSelections();
                        //_this.smGridCodigo.fireEvent('rowdeselect');
                        if (_this.stGridCodigo.getTotalCount() > 0) {
                            _this.smGridCodigo.selectFirstRow();
                        } else {
                            _this.stGridCliente.load();
                        }
                    }
                });

                this.gridCodigo = LOG.util.UIManager.initEditableGridPanel(this.cmGridCodigo, this.stGridCodigo, this.smGridCodigo, {
                    expanded: cls1.expanded,
                    nobbar: false,
                    height: 340,
                    tbar: LOG.util.UIManager.initToolbar({
                        items: this.listaBotonesCodigo.getArray()
                    })
                });

                this.stGridCodigo.load();

                this.smGridCliente = LOG.util.UIManager.initSelectionModel(2);

                var cls2 = LOG.util.UIManager.proccessColumns(this.listacolumnascliente);

                this.cmGridCliente = new Ext.grid.ColumnModel(cls2.columns);

                this.recStGridCliente = Ext.data.Record.create(cls2.fields);

                this.stGridCliente = new Ext.data.Store({
                    autoload: false,
                    url: 'cargarClientes',
                    reader: new Ext.data.JsonReader({
                        id: 'idcliente',
                        totalProperty: 'cantidad',
                        root: 'datos'
                    }, this.recStGridCliente)
                });

                this.stGridCliente.on({
                    'beforeload': function () {
                        _this.stGridCliente.initBaseParams.idcodigoindicador = (_this.smGridCodigo.getSelected()) ? _this.smGridCodigo.getSelected().data.idcodigoindicador : null;
                    }
                });

                this.stGridCliente.fireEvent = this.stGridCliente.fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        _this.smGridCliente.clearSelections();
                        //_this.smGridCliente.fireEvent('rowdeselect');
                        if (_this.stGridCliente.getTotalCount() > 0) {
                            _this.smGridCliente.selectFirstRow();
                        }
                    }
                });

                this.gridCliente = LOG.util.UIManager.initEditableGridPanel(this.cmGridCliente, this.stGridCliente, this.smGridCliente, {
                    expanded: cls2.expanded,
                    nobbar: false,
                    height: 340,
                    tbar: LOG.util.UIManager.initToolbar({
                        items: this.listaBotonesCliente.getArray()
                    })
                });

                scope.windowGeneral.superclass.initComponent.call(this);

                this.clsSuperior = LOG.util.UIManager.initColumnForm({
                    frame: true,
                    region: 'center',
                    columnas: 2
                });

                this.panelCodigos = LOG.util.UIManager.initPanel({
                    frame: true,
                    layout: 'fit',
                    region: 'center',
                    title: _this.idioma.tlPanelCodigos,
                    items: [this.gridCodigo]
                });

                this.panelClientes = LOG.util.UIManager.initPanel({
                    frame: true,
                    layout: 'fit',
                    region: 'west',
                    title: _this.idioma.tlPanelClienteProveedores,
                    items: [this.gridCliente]
                });

                this.clsSuperior.addComponent(this.panelCodigos);

                this.clsSuperior.addComponent(this.panelClientes);

                this.add(this.clsSuperior);
            },
            //opcion: 1 - codigo, opcion: 2 - cliente
            eliminar: function (parametros, opcion, _fn) {
                var _this = this;

                mostrarMensaje(2, (opcion == 1) ? this.idioma.msgDeleteCodigo : this.idioma.msgDeleteCliente, function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(this.idioma.msgEliminandoObjeto , this.idioma.msgEspere || '...');
                        var objSubmit = {
                            arrayAuxiliar: Ext.encode(parametros),
                            opcion: opcion
                        };
                        Ext.Ajax.request({
                            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/eliminarElementos',
                            method: 'POST',
                            params: objSubmit,
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.success) {
                                    mostrarMensaje(1, (opcion == 1) ? this.idioma.msgCodigoEliminado : this.idioma.msgClienteEliminado);
                                    if (typeof _fn == 'function') {
                                        _fn.createDelegate(this, [resp]).call();
                                    }
                                }
                            }.createDelegate(this)
                        });
                    }
                }.createDelegate(this));
            }
        });

        scope.windowAddCodigo = Ext.extend(LOG.util.Window, {
            constructor: function (config) {
                var _this = this;
                Ext.apply(this, config);
                config.resizable = false;
                config.width = 450;
                config.height = 150;
                config.autoScroll = true;
                config.title = config.idioma.tlAdicionarCodigo;
                config.closeAction = 'close';
                config.idindicador = config.idindicadorselecc;
                scope.windowAddCodigo.superclass.constructor.call(this, config);
                this.documentKeyMap = new Ext.KeyMap(document,
                    [{
                        alt: true,
                        key: 'G',
                        fn: function () {
                            if (_this.isVisible()) {
                                _this.salvar();
                            }
                        }
                    }, {
                        alt: true,
                        ctrl: true,
                        key: 'X',
                        fn: function () {
                            _this.close();
                        }
                    }]);
            },
            initComponent: function () {
                var _this = this;

                scope.windowAddCodigo.superclass.initComponent.call(this);

                var clsComun = LOG.util.UIManager.initColumnForm({
                    columnas: 2
                });

                clsComun.addComponent(new LOG.util.Prototipos.inputTexto({
                    fieldLabel: 'C\xf3digo',
                    name: 'codigo',
                    regex: LOG.util.Regex.codigo,
                    regexText: _this.idioma.msgCodigoIncorrecto,
                    allowBlank: false
                }));

                clsComun.addComponent(new LOG.util.Prototipos.inputTexto({
                    fieldLabel: 'Nombre',
                    name: 'nombre',
                    enableKeyEvents: true,
                    regex: LOG.util.Regex.nombre,
                    maxLength: 100,
                    regexText: this.idioma.lbSoloLetras,
                    //allowBlank: false

                }));

                this.panelGeneral = LOG.util.UIManager.initForm({
                    frame: true,
                    region: 'center',
                    border: false,
                    //layout: 'form',
                    //labelAlign: 'top',
                    //bodyStyle: 'padding:5px',
                    //monitorValid: true,
                    items: [clsComun]
                });

                this.add(this.panelGeneral);
            },
            onShowHandler: function () {
                var _this = this;
                if (this.edit) {
                    this.panelGeneral.getForm().loadRecord(this.record);
                    this.getButton(1).hide();
                }
                else {
                    this.panelGeneral.getForm().reset();
                    this.getButton(1).show();
                }
                this.getButton(2).disable();
                this.getButton(1).disable();
                this.panelGeneral.on({
                    'clientvalidation': function (fp, valid) {
                        _this.getButton(2).setDisabled(!fp.getForm().isValid() || !fp.getForm().isDirty());
                        _this.getButton(1).setDisabled(!fp.getForm().isValid() || !fp.getForm().isDirty());
                    }
                });
            },
            aceptarFn: function(apl) {
                var _this = this;
                var parametros = _this.panelGeneral.getForm().getValues();
                parametros['idindicador'] = _this.idindicador;

                if (this.panelGeneral.getForm().isValid()) {
                    Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
                    var objSubmit = {};
                    objSubmit.data = Ext.encode(parametros);
                    Ext.Ajax.request({
                        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/adicionarCodigo',
                        method: 'POST',
                        params: objSubmit,
                        callback: function(o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                if (s) {
                                    mostrarMensaje(1, this.idioma.msgObjetoSalvado);
                                    _this.st.load();
                                    if (apl) {
                                        _this.panelGeneral.getForm().reset();
                                    }
                                }
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            } else {
                                if (resp.existe == 'ambos') {
                                    mostrarMensaje(3, this.idioma.msgExisteAmbos);
                                }
                                if (resp.existe == 'codigo') {
                                    mostrarMensaje(3, this.idioma.msgExisteCodigo);
                                }
                                if (resp.existe == 'nombre') {
                                    mostrarMensaje(3, this.idioma.msgExisteNombre);
                                }
                                if (typeof _fnFail == 'function') {
                                    _fnFail.createDelegate(this, [resp]).call();
                                }
                            }
                        }.createDelegate(this)
                    });
                } else {
                    mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
                }
            }
        });

        scope.windowAddCliente = Ext.extend(LOG.util.Window, {
            listacolumnascliente: undefined,
            constructor: function (config) {
                var _this = this;
                Ext.apply(this, config);
                config.resizable = false;
                config.width = 500;
                config.height = 450;
                config.autoScroll = true;
                config.title = config.idioma.tlAdicionarClientes;
                config.closeAction = 'close';
                config.idindicador = config.idindicadorselecc;
                config.idcodigoindicador = config.idcodigoindicador;
                scope.windowAddCliente.superclass.constructor.call(this, config);
                this.documentKeyMap = new Ext.KeyMap(document,
                    [{
                        alt: true,
                        key: 'G',
                        fn: function () {
                            if (_this.isVisible()) {
                                _this.salvar();
                            }
                        }
                    }, {
                        alt: true,
                        ctrl: true,
                        key: 'X',
                        fn: function () {
                            _this.close();
                        }
                    }]);
            },
            initComponent: function () {
                var _this = this;

                scope.windowAddCliente.superclass.initComponent.call(this);

                this.panelGeneral = new LOG.util.Panel({
                    frame: true,
                    region: 'center'
                });

                this.grid = new scope.gridClientes({
                    idioma: _this.idioma,
                    idcodigoindicador : _this.idcodigoindicador,
                    gridCodigo: _this.gridCodigo
                });
                this.grid.init();
                var vista = this.grid.view();
                vista.height = 400;
                LOG.util.UIManager.apply(_this.listaBotones.getItem(1), {
                    disabled: true
                });
                LOG.util.UIManager.apply(_this.listaBotones.getItem(2), {
                    disabled: true
                });
                LOG.util.UIManager.encadenaFn(_this.grid.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() > 0) {
                            _this.listaBotones.getItem(1).enable();
                            _this.listaBotones.getItem(2).enable();
                        } else {
                            _this.listaBotones.getItem(1).disable();
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }, 'selectionarDoc');

                this.panelGeneral.add(vista);

                this.add(this.panelGeneral);

                this.on({
                    'resize': function() {
                        var altura = _this.getHeight() - 76;
                        vista.setHeight(altura);
                    }
                });
            },
            aceptarFn: function(apl) {
                var _this = this;
                var dataClientes = new Array();
                var seleccionados = _this.grid.getSmPrincipal().getSelections();
                Ext.each(seleccionados, function (rec) {
                    dataClientes.push({
                        idclientesproveedores: rec.get('idclientesproveedores'),
                        idcodigoindicador: _this.idcodigoindicador,
                        idindicador: _this.idindicador
                    });
                });

                Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
                var objSubmit = dataClientes || {};
                objSubmit = {
                    data: Ext.encode(dataClientes)
                };
                Ext.Ajax.request({
                    url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/adicionarClientes',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgClienteAdicionado);
                                _this.st.reload();
                                if (apl) {
                                    _this.grid.getSmPrincipal().clearSelections();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        } else {
                            if (resp.existenClientes.length == 1) {
                                mostrarMensaje(3, _this.idioma.msgClienteNoAdicionado +'<b>'+ resp.existenClientes[0]['nombre'] +'</b>'+ _this.idioma.msgExiste);
                            } else {
                                var msg = new Array();
                                Ext.each(resp.existenClientes, function (r) {
                                    msg.push((r.nombre) ? r.nombre : ',');
                                });
                                mostrarMensaje(3, _this.idioma.msgClientesNoAdicionados +'<b>'+ msg +'</b>'+ _this.idioma.msgExisten);
                            }
                        }
                    }.createDelegate(this)
                });
            }
        });
        scope.gridClientes = Ext.extend(LOG.util.UITemplate, {
            plugins: true,
            idcodigoindicador: undefined,
            constructor: function (config) {
                this.autoLoad = true;
                this.autoSelect = false;
                this.busquedaBasica = true;
                this.textBusquedaSimple = config.idioma.lbCampoBusquedaClientes;
                this.concepto = config.idioma.lbClientes;
                this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
                this.urlBusquedaGridPrincipal = 'cargarClientesService';
                this.modoSeleccion = 3;
                this.formaVisualizacion = 'panel';
                this.autoLoad = false;
                this.idioma = config.idioma;
                scope.gridClientes.superclass.constructor.call(this, config);
            },
            render: function (config) {
                var _this = this;
                var render = scope.gridClientes.superclass.render.call(this, config);
                this.getStorePrincipal().initBaseParams.start = 0;
                this.getStorePrincipal().initBaseParams.limit = 30;
                this.getStorePrincipal().load();
                return render;
            },
            initDefaultColumns: function () {
                var _this = this;

                this.addGridColumn({
                    header: this.idioma.lbCmCodigoCliente,
                    dataIndex: 'codigo',
                    width: 150,
                    default: true,
                    filter:{
                        type:'string',
                        emptyText : this.idioma.lbCmCodigoCliente,
                        dataIndex:'codigo'
                    }
                });//1

                this.addGridColumn({
                    header: this.idioma.lbCmDenomCliente,
                    dataIndex: 'nombre',
                    width: 250,
                    default: true,
                    autoExpand: true,
                    filter:{
                        type:'string',
                        emptyText : this.idioma.lbCmDenomCliente,
                        dataIndex:'nombre'
                    }
                });//2

                this.addGridColumn({dataIndex: 'idclientesproveedores'});
            }
        });
    }
    return {
        init: function (v) {
            v.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'asociar',
                text: LOG.lb.codigocliente.Idioma.lbBtnAsociar,
                tooltip: LOG.lb.codigocliente.Idioma.ttBtnAsociar,
                isContextual: true,
                view: v,
                handler: function (v) {
                    initWindowAsociar(v, this);
                    this.winAsociar = new this.windowGeneral({
                        idioma: LOG.lb.codigocliente.Idioma
                    });
                    this.winAsociar.show();
                    this.winAsociar.doLayout();
                },
                controlFn: function (btn, vista) {
                    if (vista.grantedAction('RGESTI') || vista.grantedAction('RASOCIAR')) {
                        btn.setVisible(true);
                    } else {
                        btn.setVisible(false);
                    }
                    btn.disable();

                    vista.getSmPrincipal().fireEvent = v.getSmPrincipal().fireEvent.createSequence(function (e, args) {
                        if (e == 'rowselect' ) {
                            btn.enable();
                        }
                        if (e == 'rowdeselect') {
                            btn.disable();
                        }
                    });
                }
            }), v.listaBotones.count() - 2);
        }
    }
};