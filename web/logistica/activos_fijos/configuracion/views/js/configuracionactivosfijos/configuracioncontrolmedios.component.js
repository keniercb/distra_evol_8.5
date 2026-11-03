Ext.ns('Ext.erp');
Ext.ns('Ext.aft.Conf');

Ext.erp.configuracioncontrolmedios = Ext.extend(LOG.util.Panel, {
    records: Array(),
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        this.idioma = config.idioma;
        _this.grid = new Ext.erp.gridAtributos({
            idioma: config.idioma
        });
        _this.grid.init();


        var vista = _this.grid.view();
        vista.height = 357;
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

        this.panelConfiguracion = LOG.util.UIManager.initPanel({
            region: 'center',
            labelAlign: 'left',
            layout: 'form',
            items: [vista]
        });

        this.listaBotones = new LOG.util.List();
        this.listaBotones.add(new LOG.util.Prototipos.botonAdicionar({
            text: config.idioma.BtnAdicionar,
            tooltip: config.idioma.ttBtnNuevo,
            disabled: true,
            handler: function () {
                var gestionar = new Ext.erp.gestionAtributos({
                    idioma: config.idioma,
                    height: 350,
                    width: 450,
                    title: config.idioma.tlAdicionar,
                    resizable: true,
                    idindicador: _this.idindicador,
                    idtabla: _this.idtabla
                });
                gestionar.on({
                    'recargargrid': function () {
                        _this.grid.getStorePrincipal().load({params: {
                                limit: 30,
                                start: 0
                        }});
                    }
                });
                gestionar.show();
                gestionar.devolverAtributos();
            }
        }));
        this.listaBotones.add(LOG.util.Prototipos.botonModificar({
            text: config.idioma.BtnModificar,
            tooltip: config.idioma.ttBtnModificar,
            isContextual: true,
            disabled: true,
            handler: function () {
                var modificar = new Ext.erp.gestionAtributos({
                    idioma: config.idioma,
                    height: 450,
                    width: 400,
                    title: config.idioma.tlModificar,
                    resizable: true,
                    records: _this.records,
                    modify: true
                });
                var record = {};
                Ext.apply(record, {
                    idindicador: _this.idindicador,
                    idtabla: _this.idtabla
                });
                modificar.on({
                    'recargargrid': function () {
                        _this.grid.getStorePrincipal().load({params: {
                            limit: 30,
                            start: 0
                        }});
                    }
                });
                modificar.show();
                modificar.prepareIndicadorModify(record);
            }
        }));
        this.listaBotones.add(LOG.util.Prototipos.botonEliminar({
            tooltip: config.idioma.ttBtnEliminar,
            isContextual: true,
            disabled: true,
            handler: function () {
                var recors = _this.grid.getGridPrincipal().getSelectionModel().getSelections();
                var datos = new Array();
                for (var i = 0; i < recors.length; i++) {
                    var r = {};
                    Ext.apply(r, {
                        idindicador: recors[i].data.idindicador,
                        idcampo: recors[i].data.idcampo,
                        name: recors[i].data.name
                    });
                    datos.push(r);
                    _this.eliminar(datos);
                }
            }
        }));
        this.listaBotones.add("->");
        this.listaBotones.add(new LOG.util.Prototipos.botonAyuda({id: 'idcontrolmedios'}));

        this.combo = new LOG.util.ComboBox({
            width: 300,
            listeners: {
                'focus': function () {
                    var medios = new Ext.erp.tiposMediosAFT({
                        idioma: config.idioma,
                        height: 450,
                        width: 455,
                        title: config.idioma.tlSeleccionar,
                        resizable: false
                    });
                    medios.show();
                    medios.grid.getStorePrincipal().load();
                    medios.validacionBtn();
                    medios.aceptarFn = function () {
                        if (medios.grid.getGridPrincipal().getSelectionModel().getSelected()) {
                            var r = medios.grid.getGridPrincipal().getSelectionModel().getSelected();
                            _this.idindicador = r.data.idindicador;
                            _this.idtabla = r.data.idtabla;
                            _this.onSelectElemento(_this.idindicador);
                            _this.listaBotones.getItem(0).enable();
                            _this.combo.setValue(r.data.denominacion);
                            this.close();
                        }
                    };
                }
            }
        });

        config.layout = 'border';
        config.items = [{
            region: 'north',
            tbar: this.listaBotones.getArray(),
            bbar: ["->",
                new Ext.form.Label({text: config.idioma.BtnMedios}),
                ' ',
                this.combo
            ]
        },
            this.panelConfiguracion
        ];

        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                ctrl: false,
                key: 'A',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.listaBotones.getItem(0).handler(_this.listaBotones.getItem(0));
                    }
                }
            },
                {
                    alt: true,
                    ctrl: false,
                    key: 'M',
                    fn: function () {
                        if (_this.isVisible()) {
                            if (_this.grid.getSmPrincipal().getSelected())
                                _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(1));
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
                            if (_this.grid.getSmPrincipal().getSelected())
                                _this.listaBotones.getItem(2).handler(_this.listaBotones.getItem(2));
                        }
                    }
                }

            ]);

        Ext.erp.configuracioncontrolmedios.superclass.constructor.call(this, config);

        this.on({
            'resize': function () {
                var altura = _this.getHeight() - 65;
                vista.setHeight(altura);
            }
        });
    },

    onSelectElemento: function (idindicador) {
        var _this = this;
        _this.grid.setId(idindicador);

        _this.grid.getStorePrincipal().on({
            'load': function (st, r, options) {
                if (st.getCount() > 0) {
                    _this.listaBotones.getItem(1).enable();
                    _this.listaBotones.getItem(2).enable();
                } else {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                }
                options.callback = function () {
                    _this.records = Array();
                    var allRecords = _this.grid.getStorePrincipal().getRange();
                    Ext.each(allRecords, function (r, index) {
                        _this.records.push(r.json.name);
                    });
                }
            }
        });

        _this.grid.getStorePrincipal().load({
            params: {
                idindicador: (idindicador) ? idindicador : null,
                limit: 30,
                start: 0
            },
            callback: function () {
                if (this.getCount() == 0)
                    mostrarMensaje(1, _this.idioma.msgdatosExistente);
            }
        });
    },

    eliminar: function(datos) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.msgDeleteObjeto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgEliminandoAtributo, _this.idioma.msgEspere || '...');
                var objSubmit = {
                    datos: Ext.encode(datos)
                };
                Ext.Ajax.request({
                    url: '/logistica/activos_fijos/configuracion/index.php/configuracioncontrolmedios/eliminarAtributos',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgAtributoEliminado);
                                _this.grid.getStorePrincipal().load();
                            }
                        } else {
                            if (!resp.success) {
                                mostrarMensaje(1, _this.idioma.msgAtributoNoEliminado);
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    }

});

Ext.erp.tiposMediosAFT = Ext.extend(LOG.util.Window, {
    grid: undefined,
    cerrarAceptar: false,
    constructor: function (config) {
        this.usarAplicar = false;
        this.tipo = config.tipo;
        Ext.erp.tiposMediosAFT.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();
    },

    initComponent: function () {
        var _this = this;
        Ext.erp.tiposMediosAFT.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.grid = new Ext.erp.mediosAFT({
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

Ext.erp.mediosAFT = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/activos_fijos/configuracion/index.php/configuracioncontrolmedios';
        this.urlBusquedaGridPrincipal = 'cargarTiposMedios';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        this.idioma = config.idioma;
        this.textBusquedaSimple = this.idioma.labelBuscar;
        this.concepto = this.idioma.ttBuscar;
        Ext.erp.mediosAFT.superclass.constructor.call(this, config);
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
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });

    },

    render: function () {
        var _this = this;
        var vista = Ext.erp.mediosAFT.superclass.render.call(this);
        this.getStorePrincipal().initBaseParams.tipo = 1;
        return vista;
    }
});

Ext.erp.gestionAtributos = Ext.extend(LOG.util.Window, {
    clsD: undefined,
    fieldD: undefined,
    ocultoD: undefined,
    existD: false,
    formulario: undefined,
    indicador: undefined,
    btnSalvar: undefined,
    idtabla: undefined,
    itemIdf: undefined,
    records: Array(),
    modify: false,
    disable: false,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        this.modify = config.modify;
        this.constrain = true;
        Ext.erp.gestionAtributos.superclass.constructor.call(this, config);
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
        this.addEvents('recargargrid');
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
            iconCls: 'cancelar',
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
        Ext.erp.gestionAtributos.superclass.initComponent.call(this);

        this.clsD = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        this.fieldD = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.ocultoD = new Ext.form.Hidden({
            valoresAdd: Array()
        });

        this.fieldD.addComponent(new Ext.form.FieldSet({
            title: _this.idioma.tlDinamicos,
            items: [_this.clsD]
        }));

        this.formulario = LOG.util.UIManager.initForm({
            region: 'center',
            border: false,
            frame: true,
            items: [_this.fieldD, _this.ocultoD]
        });
        this.add(this.formulario);
    },

    salvar: function () {
        var _this = this;
        var param = {};
        param['idindicador'] = _this.idindicador;
        param['idtabla'] = _this.idtabla;
        param['eliminarDinamicos'] = _this.getValoresDelHiddenDinamicos();
        param['atributosDinamicos'] = _this.getValoresHiddenDinamico();

        Ext.MessageBox.wait(_this.idioma.msgSalvandoObjeto, _this.idioma.msgEspere || '...');
        var objSubmit1 = {
            datos: Ext.encode(param)
        };
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/configuracion/index.php/configuracioncontrolmedios/guardarAtributos',
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
                } else {
                    mostrarMensaje(2, _this.idioma.msgAtributoExistente);
                }
            }
        });
        _this.close();
    },

    devolverAtributos: function (modify) {
        var _this = this;
        _this.body.mask(_this.idioma.msjLoadMask);
        var dinamico = true;
        var param = {};
        param['idindicador'] = _this.idindicador;
        param['idtabla'] = _this.idtabla;
        var objSubmit1 = {
            datos: Ext.encode(param)
        };

        _this.clsD.items.each(function (e, p) {
            e.removeAll();
        });
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/configuracion/index.php/configuracioncontrolmedios/devolverAtributosIndicador',
            method: 'POST',
            params: objSubmit1,
            callback: function (o, s, r) {
                _this.body.unmask();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    _this.btnSalvar.disable();
                    _this.ocultoD.valoresAdd = Array();
                    _this.ocultoD.valoresDel = Array();
                    var posD = 0;
                    if (resp.cantidad > 0) {
                        for (var i = 0; i < resp.cantidad; i++) {
                            var item = _this.crearComponentDinamico(resp.datos[i], modify);
                            var name = item.name;
                            if (modify) {
                                _this.editarItems(_this.records, name, item);
                            }
                            _this.clsD.listaCmpColumnas.getItem(posD).add(item);
                            if (posD == 3) {
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
                    _this.formulario.doLayout();
                    var altoD = _this.fieldD.getHeight();
                    _this.setHeight(80 + altoD);
                    dinamico = true;
                } else {
                    mostrarMensaje(2, _this.idioma.msjNoAtributos);
                    _this.hide();
                }
            }
        });
    },

    editarItems: function (array, name, item) {
        var _this = this;
        Ext.each(array, function (arr) {
            if (arr == name) {
                item.setValue(true);
            }
        })
    },

    comprobarExistencia: function (array, name) {
        var existe = false;
        Ext.each(array, function (arr) {
            if (arr == name) {
                existe = true;
            }
        });
        return existe;
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
                        param['denominacion'] = obj.label;
                        if (!mod) {
                            _this.ocultoD.valoresAdd.push(param);
                            _this.btnSalvar.enable();
                        } else {
                            if (!_this.comprobarExistencia(_this.records, obj.nameInTabla)) {
                                _this.ocultoD.valoresAdd.push(param);
                                _this.btnSalvar.enable();
                            } else {
                                _this.btnSalvar.disable();
                            }
                        }
                        Ext.each(_this.ocultoD.valoresDel, function (e, p) {
                            if (obj.idcampo == e) {
                                _this.ocultoD.valoresDel.remove(e);
                            }
                        });
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
                        if (_this.ocultoD.valoresDel.length > 0) {
                            _this.btnSalvar.enable();
                        } else {
                            _this.btnSalvar.disable();
                        }
                        if (!_this.modify) {
                            if (_this.ocultoD.valoresAdd.length == 0) {
                                _this.btnSalvar.disable();
                            }
                        }
                    }
                }
            }
        });
        return checks;
    },

    getValoresDelHiddenDinamicos: function () {
        var _this = this;
        return _this.ocultoD.valoresDel;
    },

    getValoresHiddenDinamico: function () {
        var _this = this;
        return _this.ocultoD.valoresAdd;
    },

    prepareIndicadorModify: function (d) {
        var _this = this;
        _this.idindicador = d.idindicador;
        _this.idtabla = d.idtabla;
        _this.devolverAtributos(d, true);
    }

});

Ext.erp.gridAtributos = Ext.extend(LOG.util.UITemplate, {
    idindicador: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/activos_fijos/configuracion/index.php/configuracioncontrolmedios';
        this.urlBusquedaGridPrincipal = 'cargarAtributos';
        this.modoSeleccion = 2;
        this.idioma = config.idioma;
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.textBusquedaSimple = this.idioma.cgCampo;
        this.concepto = this.idioma.ttBuscar;
        Ext.erp.gridAtributos.superclass.constructor.call(this, config);
    },

    render: function () {
        var _this = this;
        var vista = Ext.erp.gridAtributos.superclass.render.call(this);
        this.getStorePrincipal().on('beforeload', function (store) {
            store.initBaseParams = {idindicador: _this.idindicador};
        });
        return vista;
    },

    setId: function (id) {
        this.idindicador = id;
    },

    initDefaultColumns: function () {
        var _this = this;
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
        this.addGridColumn({
            dataIndex: 'idcampo',
            hidden: true
        });
    }

});

