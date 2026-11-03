Ext.ns('Ext.erp');
Ext.erp.configuracionmediostaller = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        var gridSuperior;
        this.grid1 = new Ext.erp.gridMedios({
            idioma: config.idioma
        });
        this.grid1.init();
        var grid2 = new Ext.erp.grid({
            idioma: config.idioma
        });
        grid2.init();
        this.grid1.addEvents('recargardinamicos');
        this.grid1.addEvents('recargar');
        this.grid1.addEvents('cargainicial');

        Ext.MessageBox.wait(config.idioma.msgCargandoDatosIniciales, config.idioma.msjLoadMask);
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/cargarTiposMedios',
            params:{limit:5000},
            method: 'POST',
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                _this.grid1.setIdstablas(resp.datos);
                _this.grid1.fireEvent('cargainicial');
            }
        });
        this.grid1.on({
            'recargardinamicos': function (r) {
                _this.grid1.limpiarRecordsInferior();
                grid2.getStorePrincipal().initBaseParams.id = r;
                grid2.getStorePrincipal().removeAll();
                grid2.getStorePrincipal().load({
                    callback: function () {
                        var allRecords = grid2.getStorePrincipal().getRange();
                        Ext.each(allRecords, function (r, index) {
                            _this.grid1.addRecordsInferior(r.json);
                        });
                    }
                });
            },

            'recargar': function () {
                grid2.getStorePrincipal().removeAll();
                grid2.getStorePrincipal().load();
            },

            'cargainicial': function () {
                Ext.MessageBox.hide();
                _this.grid1.getStorePrincipal().load({
                    callback: function () {
                        var r = _this.grid1.getGridPrincipal().getSelectionModel().getSelected().json.idindicador;
                        grid2.getStorePrincipal().initBaseParams.id = r;
                        grid2.getStorePrincipal().removeAll();
                        grid2.getStorePrincipal().load({
                            callback: function () {
                                var allRecords = grid2.getStorePrincipal().getRange();
                                Ext.each(allRecords, function (r, index) {
                                    _this.grid1.addRecordsInferior(r.json);
                                });
                            }
                        });
                    }
                });
            },

            'mostrarrecuperables': function (r) {
                if (r.recuperable) {
                    grid2.getGridPrincipal().getColumnModel().setHidden(2, false);
                    grid2.listaBotones.getItem(0).enable();
                    grid2.listaBotones.getItem(1).enable();

                } else {
                    grid2.getGridPrincipal().getColumnModel().setHidden(2, true);
                    grid2.listaBotones.getItem(0).disable();
                    grid2.listaBotones.getItem(1).disable();
                    var param = {};
                    param['idindicador'] = r.idindicador;
                    param['desmaracar'] = 2;
                    var objSubmit = {
                        datos: Ext.encode(param)
                    };
                    Ext.Ajax.request({
                        url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/hacerRecuperable',
                        method: 'POST',
                        params: objSubmit,
                        callback: function (o, s, r) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                var record = _this.grid1.getStorePrincipal().getAt(_this.grid1.getStorePrincipal().find('idindicador', param['idindicador'].toString()));
                                record.set('recuperable', '0');
                                _this.grid1.getGridPrincipal().getView().refreshRow(record);
                            }
                        }
                    });
                }

            },

            'mostrarcolumna': function (r, cl) {
                if (r.recuperable == 1) {
                    grid2.getGridPrincipal().getColumnModel().setHidden(2, false);
                    grid2.listaBotones.getItem(0).enable();
                    grid2.listaBotones.getItem(1).enable();
                } else {
                    grid2.getGridPrincipal().getColumnModel().setHidden(2, true);
                    grid2.listaBotones.getItem(0).disable();
                    grid2.listaBotones.getItem(1).disable();
                }
            },

            'verificarrecuperable': function (r) {
                _this.comprobarRecuperables(grid2, _this.grid1, r);
            }
        });

        grid2.on({
            'recuperables': function (r) {
                if (r.constructor == Array) {
                    var idindicador = r[0].idindicador;
                    var param = r;
                } else {
                    var idindicador = r.idindicador;
                    if (r.recuperable) {
                        var param = {};
                        param['idindicador'] = r.idindicador;
                        param['atributo'] = r.idcampo;
                        param['desmaracar'] = 0;
                        _this.mostrarBotones(grid2);

                    } else {
                        var param = {};
                        param['idindicador'] = r.idindicador;
                        param['atributo'] = r.idcampo;
                        param['desmaracar'] = 1;
                        _this.mostrarBotones(grid2);
                    }
                }
                var objSubmit = {
                    datos: Ext.encode(param)
                };
                Ext.Ajax.request({
                    url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/hacerRecuperable',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (!param['desmaracar']) {
                                var record = _this.grid1.getStorePrincipal().getAt(_this.grid1.getStorePrincipal().find('idindicador', idindicador.toString()));
                                record.set('recuperable', '1');
                                _this.grid1.getGridPrincipal().getView().refreshRow(record);
                            }
                        }
                    }
                });

            }
        });

        gridSuperior = _this.grid1.view();
        gridSuperior.height = 470;
        var gridInferior = grid2.view();
        gridInferior.height = 357;
        var _this = this;
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                ctrl: false,
                key: 'I',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.grid1.listaBotones.getItem(0).handler(_this.grid1.listaBotones.getItem(0));
                    }
                }
            },
                {
                    alt: true,
                    ctrl: false,
                    key: 'M',
                    fn: function () {
                        if (_this.isVisible()) {
                            if (_this.grid1.getSmPrincipal().getSelected())
                                _this.grid1.listaBotones.getItem(1).handler(_this.grid1.listaBotones.getItem(1));
                        }
                    }
                },
                {
                    key: Ext.EventObject.DELETE,
                    shift: false,
                    alt: false,
                    ctrl: false,
                    fn: function () {
                        if (_this.isVisible()) {
                            if (_this.grid1.getSmPrincipal().getSelected())
                                _this.grid1.listaBotones.getItem(2).handler(_this.grid1.listaBotones.getItem(2));
                        }
                    }
                }

            ]);
        _this.grid1.getStorePrincipal().on('load', function (st) {
            if (st.getCount() == 0) {
                _this.grid1.listaBotones.getItem(1).disable();
                _this.grid1.listaBotones.getItem(2).disable();

            }
        })
        var panelAuxiliar = LOG.util.UIManager.initPanel({
            region: 'south',
            labelAlign: 'left',
            layout: 'form',
            title: 'Atributos din&aacute;micos del indicador',
            items: [gridInferior]
        });

        this.panelConfiguracion = LOG.util.UIManager.initPanel({
            region: 'center',
            labelAlign: 'left',
            layout: 'form',
            items: [gridSuperior, panelAuxiliar]
        });
        config.items = [
            {
                region: 'center',
                frame: true,
                items: [this.panelConfiguracion]
            }

        ];
        config.tbar = ['->', LOG.util.Prototipos.botonAyuda({id: 'ayudaconfiguracionmedios'})];
        Ext.erp.configuracionmediostaller.superclass.constructor.call(this, config);
        this.panelConfiguracion.on({
            'render': function () {
                var altura = _this.getHeight() / 2 - 26;
                gridSuperior.setHeight(altura + 30);
                gridInferior.setHeight(altura - 30);
            }
        });
        this.on({
            'resize': function () {
                var altura = _this.getHeight() / 2 - 26;
                gridSuperior.setHeight(altura + 30);
                gridInferior.setHeight(altura - 30);
            }
        });
    },

    comprobarRecuperables: function (grid2, grid1, r) {
        var result = false;
        grid2.getStorePrincipal().each(function (o) {
            if (o.data.recuperable == 1) {
                result = true;
            }
        });
        if (!result) {
            var record = grid1.getStorePrincipal().getAt(grid1.getStorePrincipal().find('idindicador', r.toString()));
            record.set('recuperable', '0');
            grid1.getGridPrincipal().getView().refreshRow(record);
        }
    },

    mostrarBotones: function (grid2) {
        var result = false;
        var count = 0;
        grid2.getStorePrincipal().each(function (o) {
            if (o.data.recuperable == 1) {
                count++;
            }
        });
        if (count == grid2.getStorePrincipal().getCount()) {
            grid2.listaBotones.getItem(1).setVisible(true);
            grid2.listaBotones.getItem(0).setVisible(false);
        } else {
            grid2.listaBotones.getItem(0).setVisible(true);
            grid2.listaBotones.getItem(1).setVisible(false);
        }
    }
});

Ext.erp.gridMedios = Ext.extend(LOG.util.UITemplate, {
    hide: undefined,
    datosMostrar: undefined,
    recordsInferior: Array(),
    constructor: function (config) {
        this.gridEditable = true;
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionmediostaller';
        this.urlBusquedaGridPrincipal = 'cargarIndicadores';
        this.modoSeleccion = 2;
        this.idioma = config.idioma;
        this.autoLoad = false;
        this.plugincheckcolumn = true;
        Ext.erp.gridMedios.superclass.constructor.call(this, config);
        this.addEvents('mostrarrecuperables');
        this.addEvents('mostrarcolumna');
        this.addEvents('verificarrecuperable');
    },

    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            hidden: true,
            dataIndex: 'idnaturaleza'
        });//1
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idtabla'
        });//2
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 260,
            dataIndex: 'idindicador',
            default: true,
            renderer: function (value, metaData, record) {
                var resul = value;
                Ext.each(_this.datosMostrar, function (r) {
                    if (r['idindicador'] == value) {
                        resul = r['denominacion'];
                        Ext.apply(record.json, {
                            denominacion: r['denominacion']
                        });
                    }
                });
                return resul
            }
        });//3
        this.checkColumn = new LOG.grid.CheckColumn({
            header: this.idioma.cgRecuperable,
            dataIndex: 'recuperable',
            width: 75,
            default: true
        });//4
        this.addGridPlugin(this.checkColumn);
        this.addGridColumn(this.checkColumn);
        for (var i = 0; i < 40; i++) {
            this.addGridColumn({
                header: i,
                width: 100,
                hidden: true,
                dataIndex: i,
                default: true
            });
        }

    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.ttBtnNuevo,
            handler: function () {
                var gestionar = new Ext.erp.gestionMedios({
                    idioma: _this.idioma,
                    height: 230,
                    width: 700,
                    title: _this.idioma.tlAdicionar,
                    resizable: true
                });
                gestionar.addEvents('selectindicador');
                gestionar.addEvents('recargargrid');
                gestionar.show();
                gestionar.on({
                    'selectindicador': function (r) {
                        medios.constrain = true;
                        medios.show();
                    }
                });
                gestionar.on({
                    'recargargrid': function () {
                        _this.getStorePrincipal().reload({
                            callback: function () {
                                var r = _this.getGridPrincipal().getSelectionModel().getSelected().json.idindicador;
                                _this.fireEvent('recargardinamicos', r);
                            }
                        });
                    }
                });
                var medios = new Ext.erp.tiposMedios({
                    idioma: _this.idioma,
                    height: 450,
                    width: 525,
                    title: _this.idioma.tlSeleccionar,
                    resizable: false
                });
                medios.show();
                medios.grid.getStorePrincipal().load();
                medios.validacionBtn();
                medios.aceptarFn = function () {
                    if (medios.grid.getGridPrincipal().getSelectionModel().getSelected()) {
                        var r = medios.grid.getGridPrincipal().getSelectionModel().getSelected();
                        var existe = _this.getStorePrincipal().find('idindicador', r.data.idindicador.toString());
                        if (existe == -1) {
                            this.fireEvent('aceptarindicador', r);
                            this.close();
                        } else {
                            mostrarMensaje(1, _this.idioma.msgIndicadorExistente);
                        }
                    }
                };
                medios.addEvents('aceptarindicador');
                medios.constrain = true;
                medios.show();
                medios.grid.getStorePrincipal().load();
                medios.on({
                    'aceptarindicador': function (r) {
                        _this.hide = r;
                        gestionar.identificador.reset();
                        gestionar.devolverAtributos(r.data);
                        gestionar.show();
                        gestionar.enable();
                    },

                    'hide': function () {
                        _this.hide = undefined;
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            text: this.idioma.BtnModificar,
            tooltip: this.idioma.ttBtnModificar,
            isContextual: true,
            handler: function () {
                Ext.MessageBox.wait(_this.idioma.msjLoadMod, _this.idioma.msgEspere || '...');
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                record.set('idtabla', _this.buscarIdTabla(record.data.idindicador));
                var objSubmit = {
                    datos: Ext.encode(record.data.idindicador)
                };
                Ext.Ajax.request({
                    url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/indicadorEnUso',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            var modificar = new Ext.erp.gestionMedios({
                                idioma: _this.idioma,
                                height: 450,
                                width: 700,
                                title: _this.idioma.tlModificar,
                                resizable: true,
                                modify: true,
                                disable: true
                            });
                            modificar.setDinamicosSelected(_this.recordsInferior);
                            modificar.prepareIndicadorModify(record);
                            modificar.indicador.disable();
                            modificar.show();
                            mostrarMensaje(1, _this.idioma.msgIndicadorNoModificado);
                        } else {
                            if (!resp.success) {
                                var modificar = new Ext.erp.gestionMedios({
                                    idioma: _this.idioma,
                                    height: 450,
                                    width: 700,
                                    title: _this.idioma.tlModificar,
                                    resizable: true,
                                    modify: true
                                });
                                modificar.setDinamicosSelected(_this.recordsInferior);
                                modificar.prepareIndicadorModify(record);
                                modificar.addEvents('recargargrid');
                                modificar.on({
                                    'recargargrid': function () {
                                        _this.getStorePrincipal().reload({
                                            callback: function () {
                                                var r = _this.getGridPrincipal().getSelectionModel().getSelected().json.idindicador;
                                                _this.fireEvent('recargardinamicos', r);
                                            }
                                        });
                                    }
                                });
                                modificar.indicador.disable();
                                modificar.show();
                            }
                        }
                    }.createDelegate(this)
                });
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminar,
            isContextual: true,
            handler: function () {
                var recors = _this.getGridPrincipal().getSelectionModel().getSelections();
                var ids = new Array();
                for (var i = 0; i < recors.length; i++) {
                    ids[i] = recors[i].data.idindicador;
                }
                mostrarMensaje(2, _this.idioma.msgDeleteObjeto, function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(_this.idioma.msgEliminandoIndicador, _this.idioma.msgEspere || '...');
                        var objSubmit = {
                            datos: Ext.encode(ids)
                        };
                        Ext.Ajax.request({
                            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/eliminarIndicador',
                            method: 'POST',
                            params: objSubmit,
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.success) {
                                    if (s) {
                                        mostrarMensaje(1, _this.idioma.msgIndicadorEliminado);
                                        _this.getStorePrincipal().load();
                                    }
                                } else {
                                    if (!resp.success) {
                                        mostrarMensaje(1, _this.idioma.msgIndicadorNoEliminado);
                                    }
                                }
                            }.createDelegate(this)
                        });
                    }
                }.createDelegate(this));
                _this.limpiarRecordsInferior();
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
    },

    columRender: function (value, metaData, record, dataindex, col) {
        var length = record.json.atributos.length;
        var contiene = false;
        if(length > 0) {
            for (var i = 0; i < length; i++) {
                if (record.json.atributos[i][1] == dataindex) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="Si"';
                    col.contiene = true;
                    break;
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip="No"';
                }
            }
        } else {
            metaData.css = 'icondistra-aceptar rojo';
            metaData.attr = 'ext:qtip="No"';
        }

    },

    setIdstablas: function (r) {
        this.datosMostrar = r;
    },

    addRecordsInferior: function (r) {
        this.recordsInferior.push([r.name, r.identificador]);
    },

    limpiarRecordsInferior: function () {
        this.recordsInferior = Array();
    },

    render: function () {
        var _this = this;
        var vista = Ext.erp.gridMedios.superclass.render.call(this);
        this.getStorePrincipal().on({
            'load': function (st, records, options) {
                var datos = st.reader.jsonData.datos;
                var visibles = Array();
                _this.generarColumnas(datos);
                for (var i = 0; i < datos.length; i++) {
                    var length = datos[i].atributos.length;
                    for (var j = 0; j < length; j++) {
                        var dataIndex = datos[i].atributos[j][1];
                        var index = _this.getGridPrincipal().getColumnModel().findColumnIndex(dataIndex);
                        _this.getGridPrincipal().getColumnModel().setHidden(index, false);
                        _this.getGridPrincipal().getView().refresh();
                        if (_this.getGridPrincipal().getColumnModel().getColumnAt(index).contiene) {
                            visibles.push(index);
                        }
                    }
                }
                for (var i = 5; i < _this.listaColumnas.count() - 1; i++) {
                    if (visibles.indexOf(i) == -1) {
                        _this.getGridPrincipal().getColumnModel().setHidden(i, true);
                    }
                }
                options.callback = function () {
                    var selection = _this.getGridPrincipal().getSelectionModel().hasSelection();
                    if (selection) {
                        var r = _this.getGridPrincipal().getSelectionModel().getSelected().json;
                        _this.fireEvent('mostrarcolumna', r);
                        _this.fireEvent('recargardinamicos', r.idindicador);
                    } else {
                        _this.fireEvent('recargar');
                    }
                }
            }
        });

        _this.getGridPrincipal().on({
            'rowclick': function (grid, rowIndex) {
                var r = _this.getGridPrincipal().getSelectionModel().getSelected().data;
                _this.fireEvent('mostrarcolumna', r);
                _this.fireEvent('recargardinamicos', r.idindicador);
                _this.getSmPrincipal().fireEvent('rowselect', _this.getSmPrincipal(), 0, _this.getSmPrincipal().getSelected());
            },
            'checkcolumn': function (r) {
                _this.fireEvent('mostrarrecuperables', r.data);
                _this.fireEvent('recargardinamicos', r.data.idindicador);
            }
        });

        this.getGridPrincipal().getSelectionModel().on({
            'beforerowselect': function (sm, index, exist, record) {
                var r = sm.getSelected();
                if (r) {
                    if (r != record) {
                        _this.fireEvent('verificarrecuperable', r.data.idindicador);
                    }
                }
            }
        });
        return vista;
    },

    generarColumnas: function (datos) {
        var _this = this;
        var dataIndex = Array();
        var label = Array();
        for (var i = 0; i < datos.length; i++) {
            var length = datos[i].atributos.length;
            for (var j = 0; j < length; j++) {
                var existe = dataIndex.indexOf(datos[i].atributos[j][1]);
                if (existe == -1) {
                    dataIndex.push(datos[i].atributos[j][1]);
                    label.push(datos[i].atributos[j][0]);
                }
            }
        }
        for (var i = 0; i < dataIndex.length; i++) {
            _this.getGridPrincipal().getColumnModel().setDataIndex(5 + i, dataIndex[i]);
            _this.getGridPrincipal().getColumnModel().setColumnHeader(5 + i, label[i]);
            _this.getGridPrincipal().getColumnModel().setRenderer(5 + i, function (value, metaData, record, dataindex, col) {
                return _this.columRender(value, metaData, record, this.dataIndex, this);
            });
            _this.getGridPrincipal().getView().refresh();
        }
    },

    buscarIdTabla: function (idindicador) {
        var idtabla = 0;
        Ext.each(this.datosMostrar, function (o) {
            if (o.idindicador == idindicador) {
                idtabla = o.idtabla;
            }
        });
        return idtabla;
    }

});

Ext.erp.tiposMedios = Ext.extend(LOG.util.Window, {
    grid: undefined,
    cerrarAceptar: false,
    constructor: function (config) {
        this.usarAplicar = false;
        this.tipo = config.tipo;
        Ext.erp.tiposMedios.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();
    },

    initComponent: function () {
        var _this = this;
        Ext.erp.tiposMedios.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.grid = new Ext.erp.medios({
            idioma: _this.idioma
        });
        this.grid.init();
        var x = this.grid.view();
        x.height = 372;

        this.panelGeneral.add(x);
        this.add(this.panelGeneral);
    },

    validacionBtn: function () {
        var _this = this;
        this.grid.getSmPrincipal().on({
            rowselect: function () {
                    _this.listaBotones.getItem(2).enable()
            },
            rowdeselect: function () {
                    _this.listaBotones.getItem(2).disable();
            }

        });
    }
});

Ext.erp.medios = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionmediostaller';
        this.urlBusquedaGridPrincipal = 'cargarTiposMedios';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        this.idioma = config.idioma;
        this.textBusquedaSimple = this.idioma.labelBuscar;
        this.concepto = this.idioma.ttBuscar;
        Ext.erp.medios.superclass.constructor.call(this, config);
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idtabla',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idnaturaleza',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 180,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 260,
            dataIndex: 'denominacion',
            default: true
        });

    },

    render: function() {
        var _this = this;
        var vista = Ext.erp.medios.superclass.render.call(this);
        this.getStorePrincipal().initBaseParams.tipo = 1;
        return vista;
    }
});

Ext.erp.gestionMedios = Ext.extend(LOG.util.Window, {
    clsN: undefined,
    clsD: undefined,
    fieldN: undefined,
    fieldD: undefined,
    ocultoN: undefined,
    ocultoD: undefined,
    existD: false,
    existN: false,
    formulario: undefined,
    indicador: undefined,
    btnSalvar: undefined,
    idnaturaleza: undefined,
    itemIdf: undefined,
    dinamicosSlected: Array(),
    modify: false,
    disable: false,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        this.modify = config.modify;
        this.disable = config.disable;
        this.constrain = true;
        Ext.erp.gestionMedios.superclass.constructor.call(this, config);
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
        this.listaBotones.deleteAll();
        this.store = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'label'
                },
                {
                    name: 'name'
                },
                {
                    name: 'display'
                }
            ]
        });
        this.listaBotones.add(LOG.util.UIManager.createBtn({
            handler: function () {
                this.scope.close();
            },
            iconCls: 'cerrar',
            text: this.idioma.BtnCerrar,
            tooltip: this.idioma.ttBtnCerrar,
            scope: this
        }));
        this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
            disabled: true,
            tooltip: this.idioma.ttBtnGuaradar,
            handler: function () {
                _this.salvar();
            }
        });
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(this.btnSalvar));
        Ext.erp.gestionMedios.superclass.initComponent.call(this);
        this.clsN = LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        this.clsD = LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        this.fieldN = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.fieldD = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.ocultoN = new Ext.form.Hidden({
            valoresAdd: Array(),
            valoresDel: Array()
        });
        this.ocultoD = new Ext.form.Hidden({
            valoresAdd: Array()
        });
        this.indicador = new LOG.util.ComboBox({
            name: 'indicador',
            idindicador: undefined,
            fieldLabel: _this.idioma.labelindicador,
            width: 170,
            displayField: 'denominacion',
            valueField: 'idindicador',
            allowBlank: false,
            emptyText: 'Seleccione...',
            listeners: {
                'focus': function () {
                    _this.fireEvent('selectindicador');
                }
            }
        });
        cls.addComponent(this.indicador);
        this.identificador = new LOG.util.ComboBox({
            name: 'identificador',
            identificador: undefined,
            fieldLabel: _this.idioma.labelidentificador,
            width: 170,
            store: _this.store,
            displayField: 'display',
            valueField: 'name',
            allowBlank: false,
            emptyText: 'Seleccione...',
            listeners: {
                'select': function(cb, record) {
                   var existe = _this.find('identificador',1);
                    _this.itemIdf = _this.find('name',record.data.name.toString())[0];
                    if(existe.length > 0) {
                        _this.itemIdf.setValue(true);
                        _this.itemIdf.identificador = 1;
                        _this.itemIdf.disable();
                        existe[0].enable();
                        Ext.apply(existe[0],{
                            identificador : 0
                        });
                        existe[0].setValue(false);
                    } else {
                        _this.itemIdf.setValue(true);
                        _this.itemIdf.identificador = 1;
                        _this.itemIdf.disable();
                    }
                    _this.btnSalvar.enable();
                 }
            }
        });
        cls.addComponent(this.identificador);
        cls.getColumn(0).columnWidth = 0.49;
        cls.getColumn(1).columnWidth = 0.49;
        this.fieldN.addComponent(new Ext.form.FieldSet({
            title: _this.idioma.tlNaturaleza,
            items: [_this.clsN]
        }));
        this.fieldD.addComponent(new Ext.form.FieldSet({
            title: _this.idioma.tlDinamicos,
            items: [_this.clsD]
        }));

        this.formulario = LOG.util.UIManager.initForm({
            region: 'center',
            border: false,
            frame: true,
            items: [cls, _this.fieldN, _this.fieldD, _this.ocultoN, _this.ocultoD]
        });
        this.add(this.formulario);
    },

    salvar: function () {
        var _this = this;
        var param = {};
        param['idindicador'] = _this.getIndicador();
        param['idnaturaleza'] = _this.idnaturaleza;
        param['idtabla'] = _this.idtabla;
        param['eliminarPorNaturaleza'] = _this.getValoresDelHiddenNaturaleza();
        param['eliminarDinamicos'] = _this.getValoresDelHiddenDinamicos();
        param['atributosNaturaleza'] = _this.getValoresAddHiddenNaturaleza();
        param['atributosDinamicos'] = _this.getValoresHiddenDinamico();
        var item =_this.find('identificador',1)[0];
        var identificador = (!item) ? _this.itemIdf : item;
        param['identificador'] = identificador.name;
        Ext.MessageBox.wait(_this.idioma.msgSalvandoObjeto, _this.idioma.msgEspere || '...');
        var objSubmit1 = {
            datos: Ext.encode(param)
        };
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/guardarIndicador',
            method: 'POST',
            params: objSubmit1,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    _this.fireEvent('recargargrid');
                    if (s) {
                        mostrarMensaje(1, _this.idioma.MsgObjetoSalvado);
                    }

                }
            }
        });
        _this.close();
    },

    devolverAtributos: function (record, mod) {
        var _this = this;
        Ext.getBody().mask(_this.idioma.msjLoadMask);
        var natural = true;
        var dinamico = true;
        var modify = mod || null;
        var param = {};
        param['idindicador'] = record.idindicador;
        param['idnaturaleza'] = record.idnaturaleza;
        _this.idnaturaleza = record.idnaturaleza;
        _this.idtabla = record.idtabla;
        param['idtabla'] = record.idtabla;
        this.indicador.setValue(record.denominacion);
        this.indicador.idindicador = record.idindicador;
        var objSubmit1 = {
            datos: Ext.encode(param)
        };
        _this.clsN.items.each(function (e, p) {
            e.removeAll();
        });
        _this.clsD.items.each(function (e, p) {
            e.removeAll();
        });
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/devolverAtributos',
            method: 'POST',
            params: objSubmit1,
            callback: function (o, s, r) {
                var array = Array();
                Ext.getBody().unmask();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    _this.btnSalvar.disable();
                    _this.ocultoN.valoresAdd = Array();
                    _this.ocultoD.valoresAdd = Array();
                    _this.ocultoN.valoresDel = Array();
                    _this.ocultoD.valoresDel = Array();
                    var posN = 0;
                    var posD = 0;
                    if (resp.datos.cantidadN > 0) {
                        for (var i = 0; i < resp.datos.cantidadN; i++) {
                            array.push([resp.datos.naturaleza[i].label, resp.datos.naturaleza[i].name, resp.datos.naturaleza[i].display]);
                            var item = _this.crearComponentNaturaleza(resp.datos.naturaleza[i], modify);
                            var name = item.name;
                            if (modify) {
                                _this.editarItems(modify, name, item, resp.datos.naturaleza[i].display);
                            }
                            if (_this.disable) {
                                item.disable();
                            }
                            _this.clsN.listaCmpColumnas.getItem(posN).add(item);
                            if (posN == 4) {
                                posN = 0;
                            } else {
                                posN++;
                            }
                        }
                        _this.btnSalvar.disable();
                        _this.existD = true;
                    } else {
                        natural = false;
                        _this.existD = false;
                    }
                    if (resp.datos.cantidadD > 0) {
                        for (var i = 0; i < resp.datos.cantidadD; i++) {
                            array.push([resp.datos.dinamicos[i].label, resp.datos.dinamicos[i].nameInTabla,resp.datos.dinamicos[i].display]);
                            var item = _this.crearComponentDinamico(resp.datos.dinamicos[i], modify);
                            item.addEvents('pintar');
                            var name = item.name;
                            var campos = _this.dinamicosSlected;
                            if (modify) {
                                _this.editarItems(campos, name, item, resp.datos.dinamicos[i].display);
                            }
                            if (_this.disable) {
                                item.disable();
                            }
                            _this.clsD.listaCmpColumnas.getItem(posD).add(item);
                            if (posD == 4) {
                                posD = 0;
                            } else {
                                posD++;
                            }
                        }
                        _this.btnSalvar.disable();
                        _this.existD = true;
                    } else {
                        dinamico = false;
                        _this.existD = false;
                    }
                    if (!natural && !dinamico) {
                        _this.fieldN.show();
                        _this.fieldD.show();
                        _this.identificador.disable();
                        mostrarMensaje(1, _this.idioma.msjNoAtributos);
                    } else {
                        if (!natural && dinamico) {
                            _this.fieldN.hide();
                            _this.fieldD.show();
                            _this.identificador.enable();
                        } else {
                            if (!dinamico && natural) {
                                _this.fieldD.hide();
                                _this.fieldN.show();
                                _this.identificador.enable();
                            } else {
                                _this.fieldN.show();
                                _this.fieldD.show();
                                _this.identificador.enable();
                            }
                        }
                    }
                    _this.store.loadData(array);
                    _this.formulario.doLayout();
                    var altoN = _this.fieldN.getHeight();
                    var altoD = _this.fieldD.getHeight();
                    _this.setHeight(130 + altoN + altoD);
                    natural = true;
                    dinamico = true;
                }
            }
        });
    },

    editarItems: function(array, name, item, valueCombo) {
        var _this = this;
        Ext.each(array, function(arr) {
            if(arr[0] == name) {
                item.setValue(true);
                if(arr[1] == 1) {
                    item.identificador = 1;
                    _this.identificador.setValue(valueCombo);
                    item.disable();
                }
            }
        })
    },

    comprobarExistencia: function(array, name) {
        var existe = false;
        Ext.each(array, function(arr) {
                if(arr[0] == name) {
                    existe = true;
                }
        });
        return existe;
    },

    crearComponentNaturaleza: function (obj, mod) {
        var _this = this;
        var checks = new Ext.form.Checkbox({
            name: obj.name,
            hideLabel: true,
            boxLabel: obj.label,
            identificador: 0,
            listeners: {
                'check': function (ch, checked) {
                    if (checked) {
                        var param = {};
                        param['index'] = obj.name;
                        param['deno'] = obj.descripcion;
                        if(mod == null){
                            _this.ocultoN.valoresAdd.push(param);
                        } else {
                            if(!_this.comprobarExistencia(mod, obj.name)) {
                                _this.ocultoN.valoresAdd.push(param);
                            }
                        }
                        Ext.each(_this.ocultoN.valoresDel, function (e, p) {
                            if (obj.name == e) {
                                _this.ocultoN.valoresDel.remove(e);
                            }
                        });
                        if(_this.identificador.getValue()) {
                            _this.btnSalvar.enable();
                        } else {
                            _this.btnSalvar.disable();
                        }
                    } else {
                        _this.ocultoN.valoresDel.push(obj.name);
                        Ext.each(_this.ocultoN.valoresAdd, function (e, p) {
                            if(e) {
                                if (obj.name == e.index) {
                                    _this.ocultoN.valoresAdd.remove(e);
                                }
                            }
                        });
                        Ext.each(mod, function (e, p) {
                            if(e) {
                                if (obj.name == e[0]) {
                                    mod.remove(e);
                                }
                            }
                        });
                        if (_this.ocultoN.valoresDel.length > 0 || !_this.existD) {
                            _this.btnSalvar.enable();
                        } else {
                            _this.btnSalvar.disable();
                        }
                        if (!_this.modify) {
                            if (_this.ocultoN.valoresAdd.length == 0 && _this.ocultoD.valoresAdd.length == 0) {
                                _this.btnSalvar.disable();
                            }
                        }

                    }
                }
            }
        });
        if (checks) {
            _this.existN = true;
        } else {
            _this.existN = false;
        }
        return checks;
    },

    crearComponentDinamico: function (obj, mod) {
        var _this = this;

        var checks = new Ext.form.Checkbox({
            name: obj.nameInTabla,
            hideLabel: true,
            boxLabel: obj.label,
            identificador: 0,
            listeners: {
                'check': function (ch, checked) {
                    if (checked) {
                        var param = {};
                        param['idcampo'] = obj.idcampo;
                        param['name'] = obj.nameInTabla;
                        if(mod == null){
                            _this.ocultoD.valoresAdd.push(param);
                        } else {
                            if(!_this.comprobarExistencia(mod, obj.name)) {
                                _this.ocultoD.valoresAdd.push(param);
                            }
                        }
                        Ext.each(_this.ocultoD.valoresDel, function (e, p) {
                            if (obj.idcampo == e) {
                                _this.ocultoD.valoresDel.remove(e);
                            }
                        });
                        if(_this.identificador.getValue()) {
                            _this.btnSalvar.enable();
                        } else {
                            _this.btnSalvar.disable();
                        }
                    } else {
                        _this.ocultoD.valoresDel.push(obj.idcampo);
                        var eliminar = Array();
                        Ext.each(_this.ocultoD.valoresAdd, function (e, p) {
                            if (obj.idcampo == e.idcampo) {
                                eliminar.push(e);
                            }
                        });
                        Ext.each(eliminar, function (e) {
                            _this.ocultoD.valoresAdd.remove(e);
                        });
                        if (_this.ocultoD.valoresDel.length > 0 || !_this.existN) {
                            _this.btnSalvar.enable();
                        } else {
                            _this.btnSalvar.disable();
                        }
                        if (!_this.modify) {
                            if (_this.ocultoN.valoresAdd.length == 0 && _this.ocultoD.valoresAdd.length == 0) {
                                _this.btnSalvar.disable();
                            }
                        }
                    }
                }
            }
        });
        return checks;
    },

    getValoresAddHiddenNaturaleza: function () {
        var _this = this;
        return _this.ocultoN.valoresAdd;
    },

    getValoresDelHiddenNaturaleza: function () {
        var _this = this;
        return _this.ocultoN.valoresDel;
    },

    getValoresDelHiddenDinamicos: function () {
        var _this = this;
        return _this.ocultoD.valoresDel;
    },

    getValoresHiddenDinamico: function () {
        var _this = this;
        return _this.ocultoD.valoresAdd;
    },

    getIndicador: function () {
        var _this = this;
        return _this.indicador.idindicador;
    },

    prepareIndicadorModify: function (d) {
        var atributos = Array();
        Ext.each(d.json.atributos, function (arr) {
            atributos.push([arr[1], arr[2]]);
        });
        var TopicRecord = Ext.data.Record.create([
            {name: 'idindicador'},
            {name: 'denominacion'},
            {name: 'idtabla'},
            {name: 'idnaturaleza'},
        ]);
        var record = new TopicRecord({
            idindicador: d.json.idindicador,
            denominacion: d.json.denominacion,
            idnaturaleza: d.json.idnaturaleza,
            idtabla: d.data.idtabla
        });
        this.identificador.disable();
        this.devolverAtributos(record.data, atributos);
    },

    setDinamicosSelected: function (e) {
        this.dinamicosSlected = e;
    }

});

Ext.erp.grid = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionmediostaller';
        this.urlBusquedaGridPrincipal = 'cargarDinamicos';
        this.modoSeleccion = 1;
        this.idioma = config.idioma;
        this.region = 'south';
        this.autoLoad = false;
        this.plugincheckcolumn = true;
        Ext.erp.grid.superclass.constructor.call(this, config);
        this.addEvents('desmarcar');
        this.addEvents('recuperables');
    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.BtnMarcar,
            tooltip: _this.idioma.ttBtnMarcar,
            iconCls: 'marcartodos',
            hidden: false,
            disabled: true,
            handler: function () {
                var array = Array();
                _this.getStorePrincipal().each(function (record, index) {
                    if (record.data.recuperable == 0) {
                        var param = {};
                        param['idindicador'] = record.data.idindicador;
                        param['atributo'] = record.data.idcampo;
                        param['desmaracar'] = false;
                        array.push(param);
                        record.set('recuperable', '1');
                        _this.getGridPrincipal().getView().refreshRow(record);
                    }
                });
                if (array.length > 0) {
                    this.setVisible(false);
                    _this.listaBotones.getItem(1).setVisible(true);
                    _this.fireEvent('recuperables', array);
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.BtnDesmaracar,
            tooltip: _this.idioma.ttBtnDesmaracar,
            iconCls: 'desmarcartodos',
            hidden: true,
            disabled: true,
            handler: function () {
                var array = Array();
                _this.getStorePrincipal().each(function (record, index) {
                    if (record.data.recuperable == 1) {
                        var param = {};
                        param['idindicador'] = record.data.idindicador;
                        param['atributo'] = record.data.idcampo;
                        param['desmaracar'] = true;
                        array.push(param);
                        record.set('recuperable', '0');
                        _this.getGridPrincipal().getView().refreshRow(record);
                    }
                });
                if (array.length > 0) {
                    this.setVisible(false);
                    _this.listaBotones.getItem(0).setVisible(true);
                    _this.fireEvent('recuperables', array);
                }
            }
        }));
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idcampo'
        });
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            hidden: true,
            dataIndex: 'name'
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 500,
            dataIndex: 'denominacion',
            default: true,
            renderer: function (value, metaData, record) {
                var id = record.data.identificador;
                if (id == 1) {
                    return '<span style="color: green">' + value + '</span>';
                } else {
                    return value;
                }
            }
        });
        var checkColumn = new LOG.grid.CheckColumn({
            header: this.idioma.cgRecuperable,
            dataIndex: 'recuperable',
            width: 80,
            default: true,
            hidden: true
        });
        this.addGridPlugin(checkColumn);
        this.addGridColumn(checkColumn);
        this.addGridColumn({
            header: this.idioma.cgTipoDato,
            width: 150,
            align: 'center',
            dataIndex: 'tipocomponente',
            default: true,
            renderer: function (value, metaData, record) {
                var id = record.data.identificador;
                if (id == 1) {
                    return '<span style="color: green">' + value + '</span>';
                } else {
                    return value;
                }
            }
        });
        this.addGridColumn({
            header: this.idioma.cgLongitud,
            width: 150,
            align: 'center',
            dataIndex: 'longitud',
            default: true,
            renderer: function (value, metaData, record) {
                var id = record.data.identificador;
                if (id == 1) {
                    return '<span style="color: green">' + value + '</span>';
                } else {
                    return value;
                }
            }
        });
        this.addGridColumn({
            header: this.idioma.cgIdentificador,
            width: 150,
            align: 'center',
            dataIndex: 'identificador',
            default: true,
            renderer: function (value, metaData, record) {
                return _this.columRender(value, metaData, record, this.dataIndex, this);
            }
        });
    },

    columRender: function (value, metaData, record, dataindex, col) {
        var id = record.data.identificador;
        if (id == 1) {
            metaData.css = 'icondistra-aceptar verde';
            metaData.attr = 'ext:qtip="Si"';
        } else {
            metaData.css = 'icondistra-aceptar rojo';
            metaData.attr = 'ext:qtip=" No"';
        }
    },

    render: function () {
        var _this = this;
        var vista = Ext.erp.grid.superclass.render.call(this);
        _this.getGridPrincipal().on({
            'checkcolumn': function (r) {
                _this.fireEvent('recuperables', r.data);

            }
        });

        _this.getStorePrincipal().on({
            'load': function (st, records, options) {
                var count = 0;
                st.each(function (o) {
                    if (o.data.recuperable == 1) {
                        count++;
                    }
                });
                if (count == st.getCount()) {
                    _this.listaBotones.getItem(1).setVisible(true);
                    _this.listaBotones.getItem(0).setVisible(false);
                } else {
                    _this.listaBotones.getItem(0).setVisible(true);
                    _this.listaBotones.getItem(1).setVisible(false);
                }
            }
        });

        return vista;
    }

});

