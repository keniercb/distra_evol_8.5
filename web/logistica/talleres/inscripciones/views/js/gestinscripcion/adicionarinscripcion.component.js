Ext.ns('log.tall.addinscripcion');
log.tall.addinscripcion.Vista = Ext.extend(LOG.util.Window, {
    listaBotonesVentana: undefined,
    formulario: undefined,
    modify: false,
    record: null,
    camposDinamicos: undefined,
    fieldG1: undefined,
    fieldG2: undefined,
    fieldG3: undefined,
    comboCliente: undefined,
    direccion: undefined,
    telefono: undefined,
    ordenAbierta: undefined,
    estado: undefined,
    medio: undefined,
    idorden: undefined,
    btnSalvar: undefined,
    btnNuevo: undefined,
    formDatosMedio: undefined,
    countValidate: 0,
    identificador: undefined,
    valorIdn: undefined,
    clientes: undefined,
    servicios: undefined,
    record: null,
    checkValue: Array(),
    acciones: undefined,
    constructor: function (config) {
        var _this = this;
        LOG.util.UIManager.apply(this, config);
        config.idioma = {};
        LOG.util.UIManager.apply(config.idioma, log.tall.inscripcion.Idioma);
        this.listaBotonesVentana = new LOG.util.List();
        this.modify = config.modify;
        this.clientes = config.clientes;
        this.servicios = config.servicios;
        this.defectar = config.defectar;
        this.constrain = true;
        this.addEvents('quitarmask');
        this.addEvents('habilitar');
        this.addEvents('recargar');
        log.tall.addinscripcion.Vista.superclass.constructor.call(this, config);
        this.modelo.urlAccionGuardar = 'adicionarInscripcion';
        this.on({
            'quitarmask': function () {
                _this.body.unmask();
            }
        });
        this.on({
            'habilitar': function () {
                if (_this.comboTipoIns.getValue() == 2) {
                    if (_this.comboCliente.getValue() && _this.medio.getValue() && _this.rango.getValue() && _this.formDatosMedio) {
                        if (_this.formDatosMedio.getForm().isValid()) {
                            _this.btnSalvar.enable();
                        }
                    } else {
                        _this.btnSalvar.disable();
                    }
                } else {
                    if (_this.comboTipoIns.getValue() == 1 && _this.comboCliente.getValue() && _this.medio.getValue() && _this.formDatosMedio) {
                        if (_this.formDatosMedio.getForm().isValid()) {
                            _this.btnSalvar.enable();
                        } else {
                            _this.btnSalvar.disable();
                        }
                    } else {
                        _this.btnSalvar.disable();
                    }
                }

            }
        });
        this.on({
            'close': function () {
                _this.modelo.listaDinamicos.deleteAll();
            }
        });

    },
    initComponent: function () {
        this.botonesVentana();
        var _this = this;
        this.listaBotones.deleteAll();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            handler: function () {
                _this.modelo.reset();
                this.scope.close();
            },
            text: this.idioma.lbBtnCerrar,
            key: {
                ctrl: true,
                alt: true,
                key: 'X'
            },
            scope: this
        },true)));
        this.btnNuevo = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonNuevo({
            handler: this.resetNuevo,
            tooltip: _this.idioma.ttBtnNuevo,
            key: {
                ctrl: false,
                alt: true,
                key: 'N'
            },
            scope: this,
            disabled:true,
        }))
        this.listaBotones.add(this.btnNuevo);
        this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
            disabled: true,
            tooltip: _this.idioma.ttBtnGuaradar,
            handler: function () {
                var param = {};
                param['idmedio'] = _this.medio.getValue();
                _this.modelo.salvar(param, function (r) {
                    if (_this.record == null) {
                        _this.record = {};
                        Ext.apply(_this.record, {
                            data: r.datos[0],
                            json:  r.datos[0]
                        });
                        _this.listaBotonesVentana.getItem(0).enable();
                    }
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                }, function () {
                    mostrarMensaje(1, this.idioma.lbMsgObjetoSalvadoDoble);
                });
            }
        });
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(this.btnSalvar));

        log.tall.addinscripcion.Vista.superclass.initComponent.call(this);

        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'north',
            tbar: this.listaBotonesVentana.getArray()
        });

        this.centralPanel = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.initPanel();

        this.formulario = LOG.util.UIManager.initForm({
            region: 'center',
            border: false,
            frame: true,
            items: [this.centralPanel]
        });
        this.modelo.bindForm(this.formulario);

        this.add(this.panelGeneral);
        this.add(this.formulario);
    },

    initPanel: function () {
        var _this = this;
        this.camposDinamicos = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });

        /**SUPERIOR-CLIENTE*/
        var cls1 = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var dir = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.fieldG = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.fieldG1 = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var tipos = [
            ['Permanente', '1'],
            ['Temporal', '2'],
        ];
        var storeTipo = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'tipo'
                },
                {
                    name: 'idtipo'
                }
            ]
        });
        storeTipo.loadData(tipos);
        this.comboTipoIns = new LOG.util.ComboBox({
            fieldLabel: this.idioma.labelTipiIns,
            name: 'tipo',
            width: 360,
            allowBlank: false,
            emptyText: this.idioma.lbSeleccione,
            store: storeTipo,
            displayField: 'tipo',
            valueField: 'idtipo',
            listeners: {
                'select': function (cb, record) {
                    _this.fireEvent('habilitar');
                    if (record.data.idtipo == 2) {
                        _this.rango.setVisible(true);
                        _this.rango.setDisabled(false);
                    } else {
                        _this.rango.setVisible(false);
                        _this.rango.setDisabled(true);
                    }
                    if(_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.btnSalvar.disable();
                        }
                    }
                    if(cb.getRawValue()==""){
                        cb.setValue("");
                    }
                    if(_this.datosLimpios()) {
                        _this.listaBotones.getItem(1).disable();
                        console.info('desable');
                    }
                    else
                        _this.listaBotones.getItem(1).enable();
                }
            }
        });
        cls.addComponent(this.comboTipoIns);

        this.rango = new Ext.form.DateField({
            name: 'fechafin',
            allowBlank: false,
            width: 220,
            editable: false,
            hidden: true,
            fieldLabel: this.idioma.labelRango,
            listeners: {
                select: function (cb, record) {
                    _this.fireEvent('habilitar');
                    if(_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        cls.addComponent(this.rango);
        this.fieldG.addComponent(new Ext.form.FieldSet({
            items: cls
        }));

        /*Nombre*/
        this.comboCliente = new LOG.util.ComboBox({
            name: 'idcliente',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            queryParam: 'filtro',
            fieldLabel: this.idioma.labelClient,
            allowBlank: false,
            pageSize: 10,
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            width: 300,
            listeners: {
                'select': function (cb, record) {
                    _this.direccion.setValue(record.json.direccion);
                    _this.telefono.setValue(record.json.telefono)
                    var param = {};
                    param['idpersona'] = record.json.idpersona;
                    var objSubmit = {
                        datos: Ext.encode(param)
                    };
                    _this.fireEvent('habilitar');
                    if(_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },

                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.btnSalvar.disable();
                        }
                    }
                    if(cb.getRawValue()==""){
                        cb.setValue("");
                    }
                    if(_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.comboCliente.store.on('load', function (st, r, op) {
            op.callback = function () {
                if (_this.record && _this.record.data.idcliente) {
                    _this.comboCliente.setValue(_this.comboCliente.getValue());
                    var index = this.find('idclientesproveedores', _this.comboCliente.getValue().toString());
                    var valor = this.getAt(index);
                    _this.direccion.setValue(valor.json.direccion);
                    _this.telefono.setValue(valor.json.telefono);
                    var param = {};
                    param['idpersona'] = valor.json.idpersona;
                    var objSubmit = {
                        datos: Ext.encode(param)
                    };
                }
            }
        });
        cls1.addComponent(this.comboCliente);

        /*Telefono*/
        this.telefono = new LOG.util.Prototipos.inputTexto({
            name: 'telefono',
            disabled: true,
            width: 300,
            maxLength: 70,
            fieldLabel: this.idioma.labelTelefono,

        });
        cls1.addComponent(this.telefono);
        cls1.getColumn(0).columnWidth = 0.495;
        cls1.getColumn(1).columnWidth = 0.495;

        /*Direccion*/
        this.direccion = new Ext.form.TextArea({
            name: 'direccion',
            maxLength: 255,
            disabled: true,
            fieldLabel: this.idioma.labelDireccion,
            maxLengthText: this.idioma.msErroArea,
            width: 900,
            height: 40,
            'keyup': function (cb, e) {
                if(_this.datosLimpios())
                    _this.btnNuevo.disable();
                else
                    _this.btnNuevo.enable();
            }
        });
        dir.addComponent(this.direccion);

        this.fieldG1.addComponent(new Ext.form.FieldSet({
            title: this.idioma.tlDatosCliente,
            items: [cls1, dir]
        }));
        this.fieldG1.getColumn(0).labelAlign = '';
        /*MEDIO - MEDIO*/
        var cls2 = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.fieldG2 = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        /*Tipo de medio*/
        this.medio = new LOG.util.ComboBox({
            name: 'idmedio',
            fieldLabel: this.idioma.labelMedio,
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            displayField: 'descripcionmarcamodelo',
            valueField: 'idindicador',
            allowBlank: false,
            queryParam: 'criterio',
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            pageSize: 10,
            width: 375,
            listeners: {
                'select': function (cb, record) {
                    if (record.data.idindicador) {
                        _this.propioMedio = this.getValue();
                        _this.limpiarComponentesMedio();
                        _this.body.mask(_this.idioma.msjLoadMask);
                        _this.layoutDatosMedio(record.json._parent);
                        _this.fireEvent('habilitar');
                    }
                    if(_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.btnSalvar.disable();
                        }
                    }
                    if(_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.medio.store.on({
            beforeload: function(st,obj){
                obj.params.explotacion = 1;
            }
        });
        if (_this.modify) {
            this.medio.store.on('load', function (st, r, op) {
                op.callback = function () {
                     _this.modelo.cargarNombreMedio(function(array) {
                        _this.limpiarComponentesMedio();
                        var r = _this.find(array, 'idindicador', _this.medio.getValue().toString());
                        if(r)
                            _this.layoutDatosMedio(r._parent);
                        else
                            _this.body.unmask();
                        _this.medio.setValue(_this.medio.getValue());
                    });
                }
            });
        }
        cls2.addComponent(this.medio);

        this.fieldG2.addComponent(new Ext.form.FieldSet({
            title: this.idioma.tlDatosMedio,
            items: [cls2, this.camposDinamicos]
        }));
        this.fieldG2.getColumn(0).labelAlign = '';

        if (this.modify) {
            /*INFERIOR - ORDEN*/
            var cls3 = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });
            var contenedor = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var contenedorPanel = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var auxPanel = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });



            /*Estado de la orden*/
            this.estado = new LOG.util.Prototipos.inputTexto({
                name: 'estadoOrden',
                disabled: true,
                width: 10,
                maxLength: 70,
                fieldLabel: this.idioma.labelOrdenEstado,
                maxLengthText: _this.idioma.msgErrortext,
                regex: LOG.util.Regex.cadena,
                regexText: _this.idioma.msgRegexText
            });
            contenedorPanel.addComponent(this.estado);
            contenedorPanel.getColumn(0).columnWidth = 0.5;

            cls3.addComponent(contenedorPanel);


            /*No. de la orden*/
            this.numero = LOG.util.Prototipos.inputTexto({
                name: 'atributoidentificador',
                width: 10,
                disabled: true,
                fieldLabel: this.idioma.labelNoOrden,
                listeners: {
                    focus: function () {
                        var idiomaOrden = LOG.util.UIManager.apply(LOG.tall.ordentrabajo.Idioma, LOG.util.Idioma);
                        var vista = new LOG.tall.ordentrabajo.View({
                            idioma: idiomaOrden,
                            autoLoad: false,
                            formaVisualizacion: 'ventana',
                            acciones: _this.acciones
                        });
                        vista.init();
                        vista.setClientes(_this.clientes);
                        vista.setServicios(_this.servicios);
                        Ext.apply(vista.getVistaPrincipal().listaBotones.getItem(0), {text: 'Cerrar'});
                        vista.getVistaPrincipal().listaBotones.getItem(1).hide();
                        vista.getVistaPrincipal().listaBotones.getItem(2).hide();
                        vista.view();
                        vista.getVistaPrincipal().setWidth(900);
                        vista.getVistaPrincipal().setTitle('Gestionar orden de trabajo');
                        vista.getVistaPrincipal().on({
                            render: function () {
                                vista.getVistaPrincipal().maximize();
                                vista.getStorePrincipal().load({
                                    params: {iddocumentoorigen: _this.record.data.iddocumento},
                                    callback: function (resp) {
                                        vista.initVentanaGestion(resp[0], 2, 0, 2);
                                    }
                                });
                            }
                        });
                    }
                }
            });
            auxPanel.addComponent(this.numero);
            auxPanel.getColumn(0).columnWidth = 0.4;

            cls3.addComponent(auxPanel);

            /*Orden abierta*/
            this.ordenAbierta = new Ext.form.Checkbox({
                name: 'ordenabierta',
                disabled: true,
                boxLabel: this.idioma.labelOrden
            });
            cls3.addComponent(this.ordenAbierta);

            var datos = new Ext.form.FieldSet({
                title: this.idioma.labelOrden,
                items: [cls3]
            });

        }

        /*INCLUYENDO*/
        this.centralPanel.add(this.fieldG);
        this.centralPanel.add(this.fieldG1);
        this.centralPanel.doLayout();
        this.centralPanel.add(this.fieldG2);
        this.centralPanel.doLayout();
        if (this.modify) {
            this.centralPanel.add(datos);
            this.centralPanel.doLayout();
        }
    },

    find: function(array, prop, value) {
        var record = {};
        Ext.each(array ,function(r){
            if(r[prop] == value){
                record = r; return;
            }
        });
        return record;
    },

    limpiarComponentesMedio: function () {
        this.camposDinamicos.items.each(function (e, p) {
            e.removeAll();
        });
        this.camposDinamicos.columnaActual = 1;
        if (this.modify) {
            520
            this.setHeight(520);
        } else {
            this.setHeight(490);
        }
        this.camposDinamicos.doLayout();
        this.centralPanel.doLayout();
    },

    layoutDatosMedio: function (idindicador) {
        var _this = this;
        _this.modelo.cargarAtributosMedios(idindicador, function (val) {
            var cantidad = val['datos'].dinamicos.length;
            if (cantidad > 0) {
                var listaCheck = new LOG.util.List();
                Ext.each(val['datos'].dinamicos, function (t) {
                    if (t.tipocomp != 2) {
                        var text = _this.crearDinamico(t);
                        if (_this.mod) {
                            text.disable();
                        }
                        _this.camposDinamicos.addComponent(text);
                    } else {
                        listaCheck.add(t);
                    }
                });
                listaCheck.each(function (t, pos) {
                    var text = _this.crearDinamico(t);
                    if (_this.mod) {
                        text.disable();
                    }
                    _this.camposDinamicos.addComponent(text);
                });
            } else {
                if (_this.medio.getValue()) {
                    mostrarMensaje(1, _this.idioma.msgNoExiste);
                    _this.btnSalvar.disable()
                }
            }
            _this.camposDinamicos.doLayout();
            var alto1 = _this.fieldG1.getHeight();
            var alto2 = _this.fieldG2.getHeight();
            if (cantidad > 12) {
                alto2 = 241;
                _this.camposDinamicos.setAutoScroll(true);
                _this.camposDinamicos.setHeight(145);
                _this.fieldG2.setHeight(241);
            }
            if (_this.modify) {
                _this.setHeight(305 + alto1 + alto2);

            } else {
                _this.setHeight(235 + alto1 + alto2);
            }
            _this.centralPanel.doLayout();
            _this.formDatosMedio = LOG.util.UIManager.initForm({
                items: [_this.camposDinamicos]
            });
            if (!_this.formDatosMedio.getForm().isValid()) {
                _this.btnSalvar.disable();
            }
            _this.modelo.bindFormMedio(_this.formDatosMedio);
            if (_this.body.isMasked()) {
                _this.body.unmask();
            }
            if (_this.recordMedio) {
                _this.formDatosMedio.getForm().loadRecord(_this.recordMedio);
            }

        });
    },

    crearDinamico: function (obj) {
        var _this = this;
        if (obj.identificador == 1) {
            obj.label = '<span style="color:#008000">' + obj.label + '(identificador):</span>';
        }
        switch (obj.tipocomp) {
            case '1':
                if (obj.longitud == null)
                    obj.longitud = 10;
                var campoTexto = new LOG.util.Prototipos.inputDecimal({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    idcampo: obj.idcampo,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.label,
                    identificador: obj.identificador,
                    tipo: 1,
                    allowBlank: false,
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
                if (obj.longitud) {
                    Ext.apply(campoTexto, {
                        maxLength: obj.longitud,
                        maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.'
                    })
                }
                break;
            case '2':
                campoTexto = new Ext.form.Checkbox({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    boxLabel: obj.label,
                    idcampo: obj.idcampo,
                    identificador: obj.identificador,
                    tipo: 2,
                    allowBlank: false,
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
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.label,
                    idcampo: obj.idcampo,
                    editable: false,
                    identificador: obj.identificador,
                    tipo: 3,
                    allowBlank: false,
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
                if(_this.esMatricula(obj.label)){
                    obj.longitud =7;
                }
                campoTexto = new LOG.util.Prototipos.inputTexto({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.label,
                    idcampo: obj.idcampo,
                    identificador: obj.identificador,
                    tipo: 4,
                    allowBlank: false,
                    enableKeyEvents: true,
                    maxLength: obj.longitud,
                    maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.',
                    regex: (_this.esMatricula(obj.label))? LOG.util.Regex.matriculaAll : LOG.util.Regex.cadena,
                    regexText: (_this.esMatricula(obj.label)) ? _this.idioma.msgErrorMatricula : _this.idioma.msgRegexTextA,
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
                break;
            case '5':
                campoTexto = new LOG.util.ComboBox({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.label,
                    idcampo: obj.idcampo,
                    tipo: 5,
                    identificador: obj.identificador,
                    allowBlank: false,
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
                if(_this.esMatricula(obj.label)){
                    obj.longitud = 7;
                }
                campoTexto = LOG.util.Prototipos.inputTexto({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    tipo: 6,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.label,
                    idcampo: obj.idcampo,
                    identificador: obj.identificador,
                    allowBlank: false,
                    enableKeyEvents: true,
                    maxLength: obj.longitud,
                    maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.',
                    maxLengthText: _this.idioma.msErroArea,
                    regex: (_this.esMatricula(obj.label))? LOG.util.Regex.matriculaAll : LOG.util.Regex.alfanumerico,
                    regexText: (_this.esMatricula(obj.label))? _this.idioma.msgErrorMatricula : _this.idioma.msgRegexTextA,
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
                break;
            default :
                if (obj.longitud == null)
                    obj.longitud = 50;
                if(_this.esMatricula(obj.label)){
                    obj.longitud = 7;
                }
                campoTexto = new LOG.util.Prototipos.inputTexto({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.label,
                    identificador: obj.identificador,
                    allowBlank: false,
                    enableKeyEvents: true,
                    maxLength: obj.longitud,
                    maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.',
                    regex: (_this.esMatricula(obj.label)) ? LOG.util.Regex.matriculaAll : LOG.util.Regex.alfanumerico,
                    regexText: (_this.esMatricula(obj.label)) ? _this.idioma.msgErrorMatricula : _this.idioma.msgRegexTextA,
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
                break;
        }

        return campoTexto;
    },

    botonesVentana: function () {
        var _this = this;

        this.listaBotonesVentana.add(LOG.util.Prototipos.botonAprobar({
            text: _this.idioma.lbBtnAprobar,
            tooltip: _this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            estado: 1,
            handler: function () {
                var param = Array();
                param.push(_this.record.data.iddocumento);
                _this.modelo.aprobarInscripcion(param, function () {
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.btnSalvar.disable();
                });
                _this.medio.disable();
                _this.comboTipoIns.disable();
                _this.comboCliente.disable();
                _this.rango.disable();
                _this.formDatosMedio.getForm().items.each(function (item) {
                    item.disable();
                });
            }
        }));

        this.listaBotonesVentana.add(LOG.util.UIManager.createBtn({
            text: _this.idioma.ttBtnGestionarOrden,
            tooltip: _this.idioma.ttBtnGestionarOrden,
            disabled: true,
            estado: 3,
            iconCls: 'generadorreportes',
            handler: function () {
                var idiomaOrden = LOG.util.UIManager.apply(LOG.tall.ordentrabajo.Idioma, LOG.util.Idioma);
                var vista = new LOG.tall.ordentrabajo.View({
                    idioma: idiomaOrden,
                    autoLoad: false,
                    formaVisualizacion: 'ventana',
                    acciones:_this.acciones
                });
                vista.init();
                vista.setClientes(_this.clientes);
                vista.setServicios(_this.servicios);
                Ext.apply(vista.getVistaPrincipal().listaBotones.getItem(0), {text: 'Cerrar'});
                vista.getVistaPrincipal().listaBotones.getItem(1).hide();
                vista.getVistaPrincipal().listaBotones.getItem(2).hide();
                vista.view();
                vista.getVistaPrincipal().setWidth(900);
                vista.getVistaPrincipal().setTitle('Gestionar orden de trabajo');
                vista.getVistaPrincipal().on({
                    render: function () {
                        vista.getVistaPrincipal().maximize();
                        vista.getStorePrincipal().load({
                            callback: function (resp) {
                                vista.initVentanaGestion(_this.record, 2, 0, 1);
                            }
                        });
                    },
                    hide: function () {
                        _this.fireEvent('recargar', _this.record);
                    }
                });

            }
        }));

    },

    controlFnAprobar: function (r) {
        if (!this.modelo.iddocumento) {
            this.listaBotonesVentana.getItem(0).disable();
        } else {
            if (r.data.estado == '1') {
                this.listaBotonesVentana.getItem(0).enable();
            } else {
                this.listaBotonesVentana.getItem(0).disable();
            }
        }
    },

    resetNuevo: function () {
        var _this = this.scope || this;
        if (_this.formulario) {
            _this.modelo.reset();
        }
        _this.limpiarComponentesMedio();
        _this.btnSalvar.disable();
        _this.propioMedio = undefined;
        _this.valorMedio = undefined;
        _this.rango.setVisible(false);
        _this.countValidate = 0;
        _this.setTitle(_this.idioma.tlAdicionar);
        _this.listaBotonesVentana.getItem(0).disable();
        _this.listaBotonesVentana.getItem(1).disable();
        _this.medio.enable();
        _this.comboTipoIns.enable();
        _this.comboCliente.enable();
        _this.rango.enable();
        _this.modelo.listaDinamicos.deleteAll();
        _this.listaBotones.getItem(1).disable();
        _this.btnNuevo.disable();
    },

    getTitleDocumento: function (iddocumento) {
        var _this = this;
        this.modelo.cargaInicial({
            url: '/logistica/utiles/documento/index.php/documentologistica/cargarEncabezado',
            iddocumento: iddocumento
        }, function (datos) {
            var encabezado = datos[0];
            _this.record.data.estado = encabezado.estado;
            encabezado.estado = LOG.lb.documento.Estado[encabezado.estado];
            if (_this.isVisible()) {
                _this.setTitle(encabezado.tipo + _this.idioma.lbSignoNumero + encabezado.numero + _this.idioma.lbDel
                + encabezado.fecha + _this.idioma.lbEn + encabezado.estado);
            }
            _this.listaBotonesVentana.each(function (b) {
                _this.controlBotones(b, b.estado);
            });
            _this.btnSalvar.disable();
        });
    },

    controlBotones: function (b, status) {
        var _caller = this;
        if (_caller.record) {
            if (_caller.record.data.iddocumento && _caller.record.data.estado == status) {
                b.enable();
            } else {
                b.disable();
            }
        }
    },

    prepareModify: function (d) {
        var _this = this;
        if (this.formulario) {
            this.formulario.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.record = d;
            _this.medio.setValue(this.record.data.idmedio);

            if (this.record.data.datosmedio) {
                var map = [];
                var valores = {};
                var dinamics = Ext.decode(this.record.data.datosmedio);
                _this.modelo.listaDinamicos.deleteAll();
                Ext.each(dinamics, function (obj, pos) {
                    _this.modelo.listaDinamicos.add(obj);
                    map[pos] = {name: obj.name};
                    if (obj.tipo == 3) {
                        obj[obj.name] = obj[obj.name].substring(0, 10);
                    }
                    if (obj.tipo == 2) {
                        var param = {};
                        param['nombre'] = obj.name;
                        param['valor'] = obj[obj.name];
                        _this.checkValue.push(param);
                    }
                    valores[obj.name] = obj[obj.name];
                });
                var MapRecord = Ext.data.Record.create(map);
                _this.recordMedio = new MapRecord(valores);
            }
            _this.modelo.generarOrden(this.record.data.iddocumento, function (resp) {
                _this.estado.setValue(LOG.lb.documento.Estado[resp.datos.estado]);
                _this.numero.enable();
                _this.numero.setValue(resp.datos.nrodoc);
                _this.ordenAbierta.setValue(true);
                _this.listaBotonesVentana.getItem(1).disable();
            }, function () {
                _this.estado.setValue(_this.idioma.labelOrdenNoAbierta);
                _this.numero.disable();
                _this.ordenAbierta.setValue(false);
            });
            if (this.record.data.fechafin) {
                _this.rango.setVisible(true);
            }
            this.getTitleDocumento(this.record.data.iddocumento);
            if (this.record.data.estado != 1) {
                this.medio.disable();
                this.comboTipoIns.disable();
                this.comboCliente.disable();
                this.rango.disable();
                this.listaBotones.getItem(1).hidden = true;
                this.listaBotones.getItem(2).hidden = true;
                this.mod = true;
            } else {
                this.medio.enable();
                this.comboTipoIns.enable();
                this.comboCliente.enable();
            }
        }
    },

    bindGridModelo: function (grid) {
        this.modelo.bindGridPanel(grid);
    },

    esMatricula:function(cadena){
        if(cadena.indexOf('matricula')!= -1 || cadena.indexOf('matrícula')!= -1 || cadena.indexOf('matr\u00edcula')!= -1){
            return true;
        }
        return false;
    },
    datosLimpios:function(){
        var _this = this;
        if (this.comboTipoIns.getRawValue() || this.rango.getValue() || this.telefono.getValue()
        || this.medio.getRawValue()||this.comboCliente.getRawValue()){
            return false;
        }
        else return true;
    }
});





