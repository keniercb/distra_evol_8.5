Ext.ns('Log.aft.util');

Log.aft.util.partespiezasagregados = Ext.extend(LOG.util.Window, {
    cerrarAceptar: false,
    idregnumerico: undefined,
    constructor: function (config) {
        var _this =this;
        this.usarAplicar = false;
        this.usarAceptar = false;
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/utiles/index.php/partespiezasagregados/cargaretiquetas',
            method: 'POST',
            callback: function (opt, scs, resp) {
                _this.idioma = Ext.decode(resp.responseText);
                _this.idregnumerico = config.idregnumerico;
                _this.title = _this.idioma.lbPPA;
                Ext.apply(_this, config);
                Log.aft.util.partespiezasagregados.superclass.constructor.call(_this, arguments);
                _this.show();
                _this.maximize();
            }
        });
    },

    initComponent: function () {
        var _this = this;
        Ext.apply(_this.listaBotones.getItem(0), {
            text: _this.idioma.BtnCerrar,
            key: {
                key: 'X',
                ctrl: true,
                alt: true
            }
        });
        Log.aft.util.partespiezasagregados.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });

        this.grid = new Log.aft.util.gridPiezas({
            idioma: _this.idioma,
            idregnumerico : _this.idregnumerico
        });
        this.grid.init();
        var vista = this.grid.view();
        vista.height = 372;
        this.panelGeneral.add(vista);
        this.add(this.panelGeneral);
        this.on({
           'resize': function() {
               var altura = _this.getHeight() - 71;
               vista.setHeight(altura);
           }
        });
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                ctrl: false,
                key: 'A',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.grid.listaBotones.getItem(0).handler(_this.grid.listaBotones.getItem(0));
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
                                _this.grid.listaBotones.getItem(1).handler(_this.grid.listaBotones.getItem(1));
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
                                _this.grid.listaBotones.getItem(2).handler(_this.grid.listaBotones.getItem(2));
                        }
                    }
                }

            ]);
    }
});

Log.aft.util.gridPiezas = Ext.extend(LOG.util.UITemplate, {
    arrAgencias: undefined,
    arrServicios: undefined,
    id: undefined,
    idregnumerico: undefined,
    constructor: function (config) {
        this.dirController = '/logistica/activos_fijos/utiles/index.php/partespiezasagregados';
        this.urlBusquedaGridPrincipal = 'cargarPartespiezasagregados';
        this.modoSeleccion = 2;
        this.busquedaBasica = true;
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.idregnumerico = config.idregnumerico;
        this.textBusquedaSimple = this.idioma.labelBuscarG;
        this.concepto = this.idioma.ttBuscar;
        Log.aft.util.gridPiezas.superclass.constructor.call(this, config);
    },

    render: function (config) {
        var render = Log.aft.util.gridPiezas.superclass.render.call(this, config);
        var _this = this;
        this.getStorePrincipal().on({
            'load': function (st, records, options) {
                if (st.getCount() > 0) {
                    _this.listaBotones.getItem(1).enable();
                    _this.listaBotones.getItem(2).enable();
                } else {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                    _this.ocultarColumnas();
                }
                options.callback = function (records) {
                    _this.ocultarColumnas();
                    var datos = Array();
                    var info = Array();
                    for (var i = 0; i < records.length; i++) {
                        var array = Ext.decode(records[i].json.datos);
                        info.push(Ext.decode(records[i].json.datos));
                        for (var j = 0; j < array.length; j++) {
                            datos.push(array[j]);
                        }
                    }
                    _this.mostrarColumnas(datos);
                     for (var j = 0; j < info.length; j++) {
                         var detail = info[j];
                         for (var k = 0; k < detail.length; k++) {
                             var name = detail[k].name;
                             var obj = detail[k];
                             _this.addValores(records[j], name, obj[name]);
                         }
                     }
                }
            },

            'beforeload' : function(store) {
                store.initBaseParams = {
                    idregnumerico: _this.idregnumerico,
                    limit: 30,
                    start: 0
                };
            }
        });
        this.getStorePrincipal().load();
        return render;
    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionar,
            key: {
                alt: true,
                key: 'A'
            },
            handler: function () {
                var adicionar = new Log.aft.util.adicionarPPA({
                    idioma: _this.idioma,
                    idregnumerico: _this.idregnumerico,
                    title : _this.idioma.lbAdicionarPPA
                });
                adicionar.show();
                adicionar.on({
                    'selectindicador': function (r) {
                        medios.constrain = true;
                        medios.show();
                    },

                    'recargargrid' : function() {
                        _this.getStorePrincipal().load();
                    }
                });
                var medios = new Log.aft.util.ventanaSeleccion({
                    idioma: _this.idioma,
                    height: 450,
                    width: 800,
                    title: _this.idioma.lbSeleccionar,
                    resizable: false,
                    idregnumerico: _this.idregnumerico
                });
                medios.show();
                medios.grid.getStorePrincipal().load();
                medios.validacionBtn();
                medios.aceptarFn = function () {
                    if (medios.grid.getGridPrincipal().getSelectionModel().getSelected()) {
                        var r = medios.grid.getGridPrincipal().getSelectionModel().getSelected();
                        //var existe = _this.getStorePrincipal().find('idindicador', r.data.idindicador.toString());
                        //if (existe == -1) {
                            this.fireEvent('aceptarindicador', r);
                            this.close();
                       /* } else {
                            mostrarMensaje(1, _this.idioma.msgIndicadorExistente);
                        }*/
                    }
                };
                medios.constrain = true;
                medios.show();
                medios.grid.getStorePrincipal().load();
                medios.on({
                    'aceptarindicador': function (r) {
                        adicionar.devolverAtributosConfigurados(r);
                        adicionar.show();
                        adicionar.setPieza(r);
                    },

                    'hide': function() {
                        adicionar.comboPieza.enable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            text: this.idioma.BtnModificar,
            tooltip: this.idioma.ttBtnModificar,
            isContextual: true,
            key: {
                alt: true,
                key: 'M'
            },
            handler: function () {
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                var modificar = new Log.aft.util.adicionarPPA({
                    idioma: _this.idioma,
                    idregnumerico: _this.idregnumerico,
                    idpiezaagregado: record.data.idpiezaagregado,
                    title : _this.idioma.lbModificarPPA
                });
                modificar.show();
                modificar.on({
                    'recargargrid' : function() {
                        _this.getStorePrincipal().load();
                    }
                });
                modificar.prepareModify(record);
                modificar.setPieza(record, true);
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminar,
            isContextual: true,
            key: {
                key: Ext.EventObject.DELETE,
                ctrl: false,
                alt: false,
                shift: false
            },
            handler: function () {
                var recors = _this.getGridPrincipal().getSelectionModel().getSelections();
                var ids = new Array();
                for (var i = 0; i < recors.length; i++) {
                    ids[i] = recors[i].data.idpiezaagregado;
                }
                _this.eliminar(ids);
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _caller.getGridPrincipal().getSelectionModel().getSelected().data.fechacierre != null) {
                        b.disable();
                    }
                    if (e == 'rowselect' && (_caller.getGridPrincipal().getSelectionModel().getSelected().data.fechacierre == null || _caller.getGridPrincipal().getSelectionModel().getSelected().data.fechacierre == "")) {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
    },

    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            width: 350,
            default: true
        });//1

        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            width: 350,
            default: true,
            id: 'piezas'
        });//2

        this.addGridColumn({
            dataIndex: 'marca',
            header: this.idioma.cgMarca,
            width: 200,
            default: true,
            renderer: function (val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//3

        this.addGridColumn({
            dataIndex: 'modelo',
            header: this.idioma.cgModelo,
            width: 200,
            default: true,
            renderer: function (val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//4

        this.addGridColumn({
            dataIndex: 'precio',
            header: this.idioma.cgCosto,
            width: 120,
            default: true,
            renderer: function (val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//5

        this.addGridColumn({
            dataIndex: 'fechaadquisicion',
            header: this.idioma.cgFechaAdq,
            width: 120,
            default: true
        });//6

        this.addGridColumn({
            dataIndex: 'fechacierre',
            header: this.idioma.cgFechaCambio,
            width: 120,
            default: true
        });//7

        this.addGridColumn({
            dataIndex: 'idordentrabajo',
            header: this.idioma.cgOrden,
            width: 110,
            default: true,
            renderer: function (value) {
                if (value) {
                    return 'si';
                } else {
                    return 'no';
                }
            }
        });//8

        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });//9

        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true
        });//10

        for (var i = 0; i < 40; i++) {
            this.addGridColumn({
                header: i,
                width: 100,
                hidden: true,
                dataIndex: i,
                default: true
            });
        }//next
        this.addGridColumn({
            dataIndex: 'idpiezaagregado',
        });

    },

    mostrarColumnas: function(array) {
        var _this = this;
        var datos = Array();
        for (var i = 0; i < array.length; i++) {
            var items = array[i];
            var index = _this.getGridPrincipal().getColumnModel().findColumnIndex(items.name);
            if(index == -1) {
                _this.getGridPrincipal().getColumnModel().setDataIndex(11 + i, items.name);
                _this.getGridPrincipal().getColumnModel().setColumnHeader(11 + i, items.etiqueta);
                _this.getGridPrincipal().getColumnModel().setHidden(11 + i, false);
            }

        }
        _this.getGridPrincipal().getView().refresh();
    },

    addValores : function(record, propiedad, valor) {
        var _this = this;
       if(typeof(valor) == 'boolean') {
           valor = (valor) ? 'si' : 'no';
       }
       record.set(propiedad.toString(), valor);
       _this.getGridPrincipal().getView().refreshRow(record);
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
                    url: '/logistica/activos_fijos/utiles/index.php/partespiezasagregados/eliminarPieza',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgAtributoEliminado);
                                _this.getStorePrincipal().load();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },

    ocultarColumnas: function() {
        var _this = this;
        for (var i = 11; i < 40; i++) {
            _this.getGridPrincipal().getColumnModel().setDataIndex(i, i);
            _this.getGridPrincipal().getColumnModel().setHidden(i, true);
        }
        _this.getGridPrincipal().getView().refresh();
    }

});

Log.aft.util.adicionarPPA = Ext.extend(LOG.util.Window, {
    cerrarAceptar: false,

    listaDinamicos: undefined,

    idregnumerico: null,

    idpiezaagregado: null,

    constructor: function (config) {
        this.idioma = config.idioma;
        this.idregnumerico = config.idregnumerico;
        this.idpiezaagregado = config.idpiezaagregado;
        this.title = config.title;
        this.height =  163;
        this.width = 550;
        this.listaPlugins = new LOG.util.List();
        Log.aft.util.adicionarPPA.superclass.constructor.call(this, config);
        this.addEvents('recargargrid');
        this.xtypesEvtents = {
            checkbox: {
                evt: ['check']
            },
            combobox: {
                evt: ['select']
            },
            combousuariosdoc: {
                evt: ['select']
            },
            combo: {
                evt: ['select']
            },
            combotipodoc: {
                evt: ['select']
            },
            combologistica: {
                evt: ['select']
            },
            trigger: {
                evt: ['change']
            },
            combonomenclador: {
                evt: ['select']
            },
            textarea: {
                evt: ['keyup']
            },
            textfield: {
                evt: ['keyup']
            },
            numberfield: {
                evt: ['keyup']
            },
            radio: {
                evt: ['check']
            },
            field: {
                evt: ['keyup']
            },
            datefield: {
                evt: ['select']
            },
            treecombologistica: {
                evt: ['select']
            }
        };
    },

    initComponent: function () {
        var _this = this;
        this.listaBotones.deleteAll();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            handler: function () {
                this.scope.close();
            },
            text: this.idioma.lbBtnCerrar,
            key: {
                ctrl: true,
                alt: true,
                key: 'X'
            },
            scope: this
        })));
        this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
            disabled: true,
            tooltip: _this.idioma.ttBtnGuaradar,
            scope: this,
            handler: _this.salvar
        });
        this.listaBotones.add(this.btnSalvar);
        Log.aft.util.adicionarPPA.superclass.initComponent.call(this);

        this.panelMedio = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.comboPieza = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbPieza,
            mode: 'remote',
            width: 220,
            disabled: true,
            //url: '/logistica/activos_fijos/configuracion/index.php/configuracioncontrolmedios/cargarTiposMedios',
            displayField: 'denominacion',
            valueField: 'idindicador',
            queryParam: 'criterio',
            emptyText: this.idioma.lbSeleccione,
            pageSize: 10,
            listeners:{
                'focus': function () {
                    _this.fireEvent('selectindicador');
                }
            }
        });
        this.panelMedio.addComponent(this.comboPieza);

        this.fechaadq = new Ext.form.DateField({
            name: 'fechaadquisicion',
            allowBlank: false,
            width: 220,
            editable: false,
            disabled: true,
            maxValue : new Date(),
            fieldLabel: this.idioma.cgFechaAdq,
            listeners: {
                'select': function (cb, record) {
                    if (_this.formDatosMedio) {
                        if (_this.formDatosMedio.getForm().isValid()) {
                            _this.btnSalvar.enable();
                        }
                    }
                }
            }
        });
        this.panelMedio.addComponent(this.fechaadq);

        this.panelAtributos = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });

        this.fieldPieza = new Ext.form.FieldSet({
            title: this.idioma.lbDatos,
            items: [this.panelMedio, this.panelAtributos]
        });

        this.formulario = LOG.util.UIManager.initForm({
            region: 'center',
            border: false,
            frame: true,
            labelWidth: 40,
            items: [this.fieldPieza]
        });
        this.add(this.formulario);
    },

    devolverAtributosConfigurados: function(record, mod) {
        var _this = this;
        var atributos = Array();
        var recorridos = record.data.consumidos;
        _this.limpiarComponentes();
        _this.body.mask(_this.idioma.msjLoadMask);
        var objSubmit = {
            idindicador: record.data.idpadre
        };
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/configuracion/index.php/configuracioncontrolmedios/cargarAtributos',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                _this.body.unmask();
                _this.comboPieza.enable();
                _this.fechaadq.enable();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if(resp.cantidad > 0) {
                        Ext.each(resp.datos, function(o) {
                            var atributo = _this.crearAtributosDinamicos(o, recorridos, mod);
                            atributos.push(atributo);
                            _this.panelAtributos.addComponent(atributo);
                        });
                        _this.panelAtributos.doLayout();
                        _this.formDatosMedio = LOG.util.UIManager.initForm({
                            items: [_this.panelAtributos]
                        });
                        _this.bindFormMedio(_this.formDatosMedio);
                        _this.recalcularAltura();
                    } else {
                        mostrarMensaje(2, _this.idioma.msjNoAtributos);
                        _this.recalcularAltura();
                    }
                }
                if(mod) {
                    _this.cargarDatos(Ext.decode(record.json.datos), atributos);
                    _this.comboPieza.disable();
                }
            }
        });

    },

    recalcularAltura: function() {
        var _this = this;
        var altura = _this.panelAtributos.getHeight() + 80;
        _this.fieldPieza.setHeight(altura);
        _this.setHeight(altura + 90);
    },

    crearAtributosDinamicos: function (obj, recorridos, mod) {
        var _this = this;
        switch (obj.idtipocomponente) {
            case '1':
                var campoTexto = new LOG.util.Prototipos.inputDecimal({
                    name: obj.name,
                    idcampo: obj.idcampo,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.denominacion,
                    etiqueta: obj.denominacion,
                    tipo: 1,
                    maxLength: 10,
                    maxLengthText : _this.idioma.msgMaxLength,
                    //allowBlank: false,
                    enableKeyEvents: true,
                    listeners: {
                        keyup: function () {
                            if (!_this.modify) {
                                _this.fireEvent('habilitar');
                            } else {
                                if (_this.modify) {
                                    var inicial = _this.recordMedio.get(this.name);
                                    if (_this.formDatosMedio.getForm().isValid() && this.getValue() != inicial) {
                                        _this.btnSalvar.enable();
                                    } else {
                                        _this.btnSalvar.disable()
                                    }
                                }
                            }
                        }
                    }
                });
                if(obj.name.toLowerCase() == 'km_recorridos' && !mod) {
                    campoTexto.setValue(recorridos);
                }
                break;
            case '2':
                campoTexto = new Ext.form.Checkbox({
                    name: obj.name,
                    boxLabel: obj.denominacion,
                    idcampo: obj.idcampo,
                    tipo: 2,
                    etiqueta: obj.denominacion,
                   // allowBlank: false,
                    enableKeyEvents: true,
                    listeners: {
                        check: function (ch, checked) {
                            if (!_this.modify) {
                                _this.fireEvent('habilitar');
                            }
                            else {
                                if (_this.modify) {
                                    var valor = false;
                                    var name = this.name;
                                    Ext.each(_this.checkValue, function (r) {
                                        if (r.nombre == name) {
                                            valor = r.valor;
                                        }
                                    });
                                    if (valor) {
                                        if (!checked)
                                            _this.btnSalvar.enable();
                                    } else {
                                        if (checked)
                                            _this.btnSalvar.enable();
                                    }
                                }
                            }
                        }
                    }
                })
                break;
            case '3':
                campoTexto = new Ext.form.DateField({
                    name: obj.name,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.denominacion,
                    idcampo: obj.idcampo,
                    etiqueta: obj.denominacion,
                    editable: false,
                    tipo: 3,
                  //  allowBlank: false,
                    enableKeyEvents: true,
                    listeners: {
                        select: function () {
                            if (!_this.modify) {
                                _this.fireEvent('habilitar');
                            } else {
                                if (_this.modify) {
                                    var inicial = _this.recordMedio.get(this.name);
                                    if (_this.formDatosMedio.getForm().isValid() && this.getValue() != inicial) {
                                        _this.btnSalvar.enable();
                                    } else {
                                        _this.btnSalvar.disable()
                                    }
                                }
                            }
                        }
                    }
                });
                break;
            case '4':
                if (obj.longitud == null)
                    obj.longitud = 50;
                campoTexto = new LOG.util.Prototipos.inputTexto({
                    name: obj.name,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.denominacion,
                    etiqueta: obj.denominacion,
                    idcampo: obj.idcampo,
                    tipo: 4,
                   // allowBlank: false,
                    enableKeyEvents: true,
                    maxLength: obj.longitud,
                    maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.',
                    regex: LOG.util.Regex.cadena,
                    regexText: _this.idioma.msgRegexTextA,
                    listeners: {
                        keyup: function () {
                            if (!_this.modify) {
                                _this.fireEvent('habilitar');
                            } else {
                                if (_this.modify) {
                                    var inicial = _this.recordMedio.get(this.name);
                                    if (_this.formDatosMedio.getForm().isValid() && this.getValue() != inicial) {
                                        _this.btnSalvar.enable();
                                    } else {
                                        _this.btnSalvar.disable()
                                    }
                                }
                            }
                        }
                    }
                });
                if(obj.name.toLowerCase() == 'km_recorridos' && !mod) {
                    campoTexto.setValue(recorridos);
                }
                break;
            case '5':
                campoTexto = new LOG.util.ComboBox({
                    name: obj.name,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.denominacion,
                    etiqueta: obj.denominacion,
                    idcampo: obj.idcampo,
                    tipo: 5,
                   // allowBlank: false,
                    enableKeyEvents: true,
                    listeners: {
                        select: function () {
                            if (!_this.modify) {
                                _this.fireEvent('habilitar');
                            } else {
                                if (_this.modify) {
                                    if (_this.formDatosMedio.getForm().isValid()) {
                                        _this.btnSalvar.enable();
                                    } else {
                                        _this.btnSalvar.disable()
                                    }
                                }
                            }
                        },
                        keyup: function () {
                            if (this.isDirty()) {
                                _this.btnSalvar.disable();
                            }
                        }
                    }
                });
                break;
            case '6':
                if (obj.longitud == null)
                    obj.longitud = 255;
                campoTexto = LOG.util.Prototipos.inputTexto({
                    name: obj.name,
                    tipo: 6,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.denominacion,
                    idcampo: obj.idcampo,
                    etiqueta: obj.denominacion,
                    //allowBlank: false,
                    enableKeyEvents: true,
                    maxLength: obj.longitud,
                    maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.',
                    maxLengthText: _this.idioma.msErroArea,
                    regex: LOG.util.Regex.alfanumerico,
                    regexText: _this.idioma.msgRegexTextA,
                    listeners: {
                        keyup: function () {
                            if (!_this.modify) {
                                _this.fireEvent('habilitar');
                            } else {
                                if (_this.modify) {
                                    var inicial = _this.recordMedio.get(this.name);
                                    if (_this.formDatosMedio.getForm().isValid() && this.getValue() != inicial) {
                                        _this.btnSalvar.enable();
                                    } else {
                                        _this.btnSalvar.disable()
                                    }
                                }
                            }
                        }
                    }
                });
                if(obj.name.toLowerCase() == 'km_recorridos' && !mod) {
                    campoTexto.setValue(recorridos);
                }
                break;
            default :
                if (obj.longitud == null)
                    obj.longitud = 50;
                campoTexto = new LOG.util.Prototipos.inputTexto({
                    name: obj.name,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.denominacion,
                    //allowBlank: false,
                    tipo: 4,
                    etiqueta: obj.denominacion,
                    enableKeyEvents: true,
                    maxLength: obj.longitud,
                    maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.',
                    regex: LOG.util.Regex.alfanumerico,
                    regexText: _this.idioma.msgRegexTextA,
                    listeners: {
                        keyup: function () {
                            if (!_this.modify) {
                                _this.fireEvent('habilitar');
                            } else {
                                if (_this.modify) {
                                    var inicial = _this.recordMedio.get(this.name);
                                    if (_this.formDatosMedio.getForm().isValid() && this.getValue() != inicial) {
                                        _this.btnSalvar.enable();
                                    } else {
                                        _this.btnSalvar.disable()
                                    }
                                }
                            }
                        }
                    }
                });
                if(obj.name.toLowerCase() == 'km_recorridos' && !mod) {
                    campoTexto.setValue(recorridos);
                }
                break;
        }

        return campoTexto;
    },

    limpiarComponentes: function () {
        this.comboPieza.reset();
        this.panelAtributos.items.each(function (e, p) {
            e.removeAll();
        });
        this.panelAtributos.columnaActual = 1;
        this.panelAtributos.doLayout();
    },

    setPieza: function(record, mod) {
        this.comboPieza.setValue(record.data.denominacion);
        this.denominacion = record.data.denominacion;
        this.idindicador = record.data.idindicador;
        this.idpadre = record.data.idpadre;

        if(mod) {
            this.fechaadq.setValue(record.data.fechaadquisicion);
        }
    },

    bindFormMedio: function (basicForm) {
        var _scope = this;
        basicForm.getForm().items.each(function (field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents) {
                    field.enableKeyEvents = true;
                }

                field.fireEvent = field.fireEvent.createSequence(function (e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        _scope.adicionarLista(field);
                        if (_scope.formulario.getForm().isValid() && basicForm.getForm().isValid()) {
                            _scope.btnSalvar.enable();
                        } else {
                            _scope.btnSalvar.disable();
                        }
                    }
                });
            }
        });
    },

    existeYa: function (name) {
        var result = -1;
        this.listaPlugins.each(function (it, pos) {
            if (it.name == name) {
                result = pos;
            }
        });
        return result;
    },

    salvar: function () {
        var _this = this.scope || this;
        var param = {};
        param['idregnumerico'] = _this.idregnumerico;
        param['idpiezaagregado'] = _this.idpiezaagregado;
        param['idindicador'] = _this.idindicador;
        param['denominacion'] = _this.denominacion;
        param['idpadre'] = _this.idpadre;
        param['fechaadquisicion'] = _this.fechaadq.getValue();
        _this.formDatosMedio.getForm().items.each(function (field) {
            _this.adicionarLista(field);
        });
        param['atributosDinamicos'] = _this.listaPlugins.getArray();
        Ext.MessageBox.wait(_this.idioma.msgSalvandoObjeto, _this.idioma.msgEspere || '...');
        var objSubmit = {
            datos: Ext.encode(param)
        };
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/utiles/index.php/partespiezasagregados/adicionarPartespiezasagregados',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    _this.fireEvent('recargargrid');
                    if (s) {
                        mostrarMensaje(1, _this.idioma.MsgObjetoSalvado);
                    }

                }
                else if(resp.msg == 1) {
                    mostrarMensaje(3, 'El identificador introducido ya est\xe1 en uso.');
                }
            }
        });
        _this.close();
    },

    prepareModify: function (d) {
        this.listaPlugins.deleteAll();
        this.devolverAtributosConfigurados(d, true);
    },

    adicionarLista: function(field) {
        var _scope = this;
        var auxObj = {};
        var existe = _scope.existeYa(field.getName());
        auxObj['name'] = field.getName();
        auxObj['etiqueta'] = field.etiqueta;
        auxObj['tipo'] = field.tipo;
        if(field.tipo == 3) {
            auxObj[field.getName()] = field.getValue().format('d/m/Y');
        } else {
            auxObj[field.getName()] = field.getValue();
        }
        _scope.listaPlugins.setItem(auxObj, existe);
    },

    cargarDatos: function(datos, campos) {
        var _this = this;
        Ext.each(campos, function(obj, pos) {
            var valor = datos[pos];
            obj.setValue(valor[datos[pos].name]);
        });

    }
});

Log.aft.util.ventanaSeleccion = Ext.extend(LOG.util.Window, {
    grid: undefined,
    cerrarAceptar: false,
    idregnumerico: undefined,
    constructor: function (config) {
        this.usarAplicar = false;
        this.tipo = config.tipo;

        this.idregnumerico = config.idregnumerico;
        Log.aft.util.ventanaSeleccion.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();
        this.addEvents('aceptarindicador');
    },

    initComponent: function () {
        var _this = this;
        Log.aft.util.ventanaSeleccion.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.grid = new Log.aft.util.gridPiezasSeleccion({
            idioma: _this.idioma,
            idregnumerico : _this.idregnumerico
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

Log.aft.util.gridPiezasSeleccion = Ext.extend(LOG.util.UITemplate, {
    idregnumerico: undefined,
    constructor: function (config) {
        this.dirController = '/logistica/activos_fijos/utiles/index.php/partespiezasagregados';
        this.urlBusquedaGridPrincipal = 'cargarPiezasConfiguradas';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        this.idioma = config.idioma;
        this.idregnumerico = config.idregnumerico;
        this.textBusquedaSimple = this.idioma.labelBuscar;
        this.concepto = this.idioma.ttBuscar;
        Log.aft.util.gridPiezasSeleccion.superclass.constructor.call(this, config);
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
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
        this.addGridColumn({
            header: this.idioma.cgMarca,
            width: 150,
            dataIndex: 'marca',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            width: 150,
            dataIndex: 'modelo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'consumidos',
            hidden: true
        });
    },

    render: function () {
        var _this = this;
        var vista = Log.aft.util.gridPiezasSeleccion.superclass.render.call(this);
        this.getStorePrincipal().initBaseParams.tipo = 1;
        this.getStorePrincipal().initBaseParams.idnaturaleza = naturalezaPPA;
        this.getStorePrincipal().initBaseParams.idregnumerico = _this.idregnumerico;
        return vista;
    }
});

