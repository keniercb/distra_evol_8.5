Ext.ns('log.tall.adcsolicitud');
log.tall.adcsolicitud.Vista = Ext.extend(LOG.util.Window, {
    listaBotonesVentana: undefined,
    tab2: undefined,
    tab1: undefined,
    garantia: undefined,
    panelContenedor: undefined,
    tabPanel: undefined,
    formulario: undefined,
    btnSalvar: undefined,
    observaciones: undefined,
    observacionesCliente: undefined,
    observacionesTecnico: undefined,
    textoMedio: undefined,
    idMedio: undefined,
    idProducto: undefined,
    boton: undefined,
    boton1: undefined,
    store: undefined,
    countMask: 0,
    modify: false,
    elaboracion: false,
    record: null,
    valorObservado: null,
    idEntidad: undefined,
    listaAcciones: undefined,

    constructor: function (config) {
        var _this = this;
        LOG.util.UIManager.apply(this, config);
        this.listaAcciones = new LOG.util.List(config.acciones);
        config.idioma = {};
        LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        this.listaBotonesVentana = new LOG.util.List();
        this.addEvents('quitarmask');
        this.addEvents('mask');
        this.modify = config.modify;
        this.defectar = config.defectar;
        this.constrain = true;
        log.tall.adcsolicitud.Vista.superclass.constructor.call(this, config);
        this.modelo.urlAccionGuardar = 'adicionarSolicitud';
        this.on({
            'quitarmask': function () {
                if (_this.countMask > 1) {
                    _this.comboCliente.enable();
                    _this.body.unmask();
                    if (!_this.modify) {
                        _this.comboCliente.focus();
                    } else {
                        this.identificadorMedio(_this.record, _this.content, true);
                        if (_this.elaboracion) {
                            _this.textoMedio.enable();
                        } else {
                            _this.comboCliente.disable();
                        }
                    }
                }
            },

            'mask': function () {
                _this.body.unmask();
            }
        });
        this.documentKeyMap = new Ext.KeyMap(document, [
            {
                alt: true,
                ctrl: false,
                key: 'N',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(1));
                    }
                }
            }, {
                alt: true,
                ctrl: false,
                key: 'G',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(2));
                    }
                }
            }, {
                alt: true,
                ctrl: true,
                key: 'X',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(0));
                    }
                }
            }
        ]);
    },

    initComponent: function () {
        this.botonesVentana();
        var _this = this;
        this.listaBotones.deleteAll();
        this.store = new Ext.data.Store({
            url: '/logistica/talleres/recepcion/index.php/solicitud/cargarEntidad',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'identidad'
            }, [
                {name: 'identidad'},
                {name: 'denominacion'},
            ])
        });
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
            handler: function () {
                if (_this.defectar) {
                    _this.resetNuevo(true);
                } else {
                    _this.resetNuevo(false);
                }
            },
            tooltip: _this.idioma.ttBtnNuevo,
            key: {
                ctrl: false,
                alt: true,
                key: 'N'
            },
            disabled:true,
            scope: this
        }))
        this.listaBotones.add(this.btnNuevo);
        this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
            tooltip: _this.idioma.ttBtnGuaradar,
            handler: function () {
                if (_this.modelo.defectacion) {
                    _this.listaBotonesVentana.getItem(1).enable();
                    _this.listaBotonesVentana.getItem(0).disable();
                }
                var param = {};
                param['idproducto'] = _this.idProducto;
                param['idindicador'] = _this.idMedio;
                param['idpadre'] = _this.idpadre;
                param['atributoidentificador'] = _this.identificador;
                if (_this.defectar) {
                    _this.modelo.salvarDefectacion(param, function (r) {
                        if (_this.record == null) {
                            _this.record = {};
                            Ext.apply(_this.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });
                            _this.listaBotonesVentana.getItem(0).enable();
                        }
                        _this.getTitleDocumento(r.iddocumento);
                        _this.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this, [b, _this]).call();
                            }
                        }, _this);
                    });
                } else {
                    _this.modelo.salvarNuevaSolicitud(param, function (r) {
                        if (_this.record == null) {
                            _this.record = {};
                            Ext.apply(_this.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });
                            _this.listaBotonesVentana.getItem(0).enable();
                        }
                        _this.getTitleDocumento(r.iddocumento);
                        _this.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this, [b, _this]).call();
                            }
                        }, _this);
                        _this.modelo.origenmedio = null;
                    });
                }
            },
            fnEspecialCondition : function() {
                if(_this.content && _this.content.body && _this.content.body.isMasked())
                    return true;
                if(_this.formulario && _this.modelo.isValid())
                    return false;
                else
                    return true;
            }
        });
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(this.btnSalvar));

        this.modelo.addActionButton(this.btnSalvar, true);

        log.tall.adcsolicitud.Vista.superclass.initComponent.call(this);

        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'north',
            tbar: this.listaBotonesVentana.getArray()
        });

        this.tabPanel = new Ext.TabPanel({
            frame: true,
            region: 'center',
            enableTabScroll: true,
            activeTab: 0,
            layoutOnTabChange: true
        });
        this.tabs();
        this.comboCliente.disable();
        this.tabPanel.doLayout();

        this.formulario = LOG.util.UIManager.initForm({
            region: 'center',
            border: false,
            frame: true,
            items: [this.tabPanel]
        });
        this.modelo.bindForm(this.formulario);

        this.add(this.panelGeneral);
        this.add(this.formulario);

        this.tabPanel.on({
            'tabchange': function () {
                _this.observaciones.setValue(_this.observacionesCliente.getValue());
            }
        });

    },

    tabs: function () {
        var _this = this;
        var tabs = new Array();
        var fieldG = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var areaT = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.content = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        /**tab1-SUPERIOR**/

        if (!_this.modify) {
            this.store.on('load', function (st, params) {
                _this.idEntidad = params[0].data.identidad;
                _this.fireEvent('mask');
            });
        }

        /*Datos de Contrato/Cliente*/
        this.comboCliente = new LOG.util.ComboBox({
            name: 'idcliente',
            fieldLabel: this.idioma.labelClient,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            allowBlank: false,
            pageSize: 10,
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            width: 250,
            resizable: true,
            enableKeyEvents: true,
            minListWidth : 300,
            listeners:{
                keyup:function(){
                   if(_this.camposVacios()){
                       _this.btnNuevo.disable();
                   }
                    else _this.btnNuevo.enable();
                },
                change: function(){
                    if(_this.camposVacios()){
                        _this.btnNuevo.disable();
                    }
                    else _this.btnNuevo.enable();
                }
            }
        });
        this.comboCliente.store.on('load', function (st, r, op) {
            op.callback = function () {
                if (_this.record && _this.record.data.idcliente) {
                    _this.comboCliente.setValue(_this.comboCliente.getValue());
                }
                _this.countMask++;
                _this.fireEvent('quitarmask');
            }
        });
        this.content.addComponent(this.comboCliente);

        this.textoMedio = new LOG.util.Prototipos.inputTexto({
            name: 'idproducto',
            fieldLabel: this.idioma.labelMedio,
            allowBlank: false,
            width: 240,
            readOnly: true,
            listeners:{
                keyup:function(){
                    if(_this.camposVacios()){
                        _this.btnNuevo.disable();
                    }
                    else _this.btnNuevo.enable();
                },
                select: function(){
                    if(_this.camposVacios()){
                        _this.btnNuevo.disable();
                    }
                    else _this.btnNuevo.enable();
                }
            }
        });
        this.boton1 = this.botonesTexto(this.content).getItem(0);
        var plugin = new LOG.util.UIManager.initColumnForm({
            columnas: 2,
            defaultsAnchor: '100%'
        });
        plugin.getColumn(0).columnWidth = 0.91;
        plugin.getColumn(1).columnWidth = 0.09;
        var panel2 = new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({height: 19}), this.boton1]
        });
        plugin.addComponent(this.textoMedio);
        plugin.addComponent(panel2);
        this.content.addComponent(plugin);

        var s = new LOG.util.UIManager.initColumnForm({
            columnas: 2,
            defaultsAnchor: '98%'
        });

        this.garantia = new Ext.form.Checkbox({
            name: 'garantia',
            boxLabel: this.idioma.labelGarantia

        });
        this.content.addComponent(this.garantia);
        this.content.getColumn(0).columnWidth = 0.32;
        this.content.getColumn(1).columnWidth = 0.32;
        this.content.getColumn(2).columnWidth = 0.30;
        /**tab1-INFERIOR**/
        fieldG.addComponent(new Ext.form.FieldSet({
            title: this.idioma.tlDatosMedio,
            items: [this.content]
        }));
        fieldG.getColumn(0).labelAlign = '';
        this.observacionesCliente = new Ext.form.TextArea({
            name: 'falloscliente',
            fieldLabel: this.idioma.labelArea,
            maxLength: 255,
            minLength: 2,
            maxLengthText: this.idioma.msErroArea,
            allowBlank: false,
            regex: LOG.util.Regex.cadena,
            regexText: _this.idioma.msgRegexText,
            width: 680,
            height: 128,
            listeners:{
                keyup:function(d,ee){
                    if(_this.camposVacios()){
                        _this.btnNuevo.disable();
                    }
                    else _this.btnNuevo.enable();
                }
            }
        });
        areaT.addComponent(this.observacionesCliente);

        this.tab1 = new LOG.util.Panel({
            frame: true,
            region: 'center',
            title: _this.idioma.tabAdicionra,
            width: '98%'
        });

        if(!_this.defectar) {
            this.tab1.add(fieldG);
            this.tab1.add(areaT);
        } else {
            this.tab1.add(areaT);
        }

        var areaT1 = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var observacionesCont = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var combo = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        /**tab2**/
        this.observaciones = new Ext.form.TextArea({
            name: 'falloscliente1',
            fieldLabel: this.idioma.labelArea,
            maxLength: 255,
            minLength: 2,
            maxLengthText: this.idioma.msErroArea,
            regex: LOG.util.Regex.cadena,
            regexText: _this.idioma.msgRegexText,
            allowBlank: false,
            enableKeyEvents: true,
            width: 640,
            height: 95,
            disabled: true,
        });
        observacionesCont.addComponent(this.observaciones);

        this.comboTecnico = new LOG.util.ComboBox({
            name: 'idtecnico',
            url: '/logistica/talleres/recepcion/index.php/solicitud/cargarClientes',
            displayField: 'nombreapellidos',
            valueField: 'idpersona',
            fieldLabel: this.idioma.labelTecnico,
            allowBlank: false,
            pageSize: 10,
            disabled: true
        });
        combo.addComponent(this.comboTecnico);
        this.comboTecnico.store.on('load', function () {
            if (_this.record && _this.record.data.idcliente) {
                _this.comboTecnico.setValue(_this.comboTecnico.getValue());
            }
            _this.countMask++;
            _this.fireEvent('quitarmask');
        });
        combo.getColumn(0).columnWidth = 0.65;

        this.observacionesTecnico = new Ext.form.TextArea({
            fieldLabel: this.idioma.labelAreaDefect,
            name: 'fallostecnicos',
            maxLength: 255,
            minLength: 2,
            allowBlank: false,
            maxLengthText: this.idioma.msErroArea,
            regex: LOG.util.Regex.cadena,
            regexText: _this.idioma.msgRegexText,
            width: 700,
            height: 95,
            disabled: true
        });
        areaT1.addComponent(this.observacionesTecnico);
        this.tab2 = new LOG.util.Panel({
            frame: true,
            region: 'center',
            title: this.idioma.tabDefectacion,
            width: '98%',
            autoHeight: true,
            disabled: true,
            items: [observacionesCont, combo, areaT1]

        });

        /**Incluyendo en tabPanel**/
        this.tabPanel.add(this.tab1);
        this.tabPanel.doLayout();
        this.tabPanel.add(this.tab2);
        this.tabPanel.doLayout();
        this.observacionesCliente.on({
            'change': function () {
                _this.observaciones.value = _this.observacionesCliente.getValue();
            }
        });
    },
    camposVacios:function(){
        var cliente = this.comboCliente.getValue();
        var medio = this.textoMedio.getValue();
        var observ = this.observacionesCliente.getValue();
        if( (cliente == "" || cliente == null) && (medio == "" || medio == null)&& ( observ == "" || observ == null ) ){
            return true;
        }
        return false;
    },
    botonesTexto: function (cls) {
        var _this = this;
        var botones = new LOG.util.List();
        botones.add(LOG.util.UIManager.createBtn({
            text: '...',
            width: 18,
            handler: function () {
                var ventanaSeletMedio = new log.tall.adcsolicitud.VentanaSelecionMedio({
                    idioma: _this.idioma,
                    title: _this.idioma.tlVentanaSelectMedio,
                    isAFT: existeAFT,
                    idestructura: _this.idEntidad,
                    usarNomIndicador:  _this.grantedAction('usarNomPrd'),
                    usarAFTTall: _this.grantedAction('usarAFTTall'),
                    usarTallAFT: _this.grantedAction('usarTallAFT'),
                    tipo : 1
                });
                ventanaSeletMedio.show();
               /* ventanaSeletMedio.tabPanelGeneral.getListTemplate().each(function (temp) {
                    temp.getStorePrincipal().load();
                });*/
                ventanaSeletMedio.validacionBtn();
                ventanaSeletMedio.aceptarFn = function () {
                    if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                        var recordSeleccionado = ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                        _this.textoMedio.setValue(recordSeleccionado.data.descripcionmarcamodelo);
                        _this.nomProducto = recordSeleccionado.data.descripcionmarcamodelo;
                        _this.idpadre = recordSeleccionado.data.idpadre;
                        if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                            _this.idMedio = recordSeleccionado.data.idindicador;
                        }
                        else if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.idProducto = recordSeleccionado.data.idregnumerico;
                            _this.idMedio = recordSeleccionado.data.idindicador;
                        }
                        else  if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                            _this.idProducto = recordSeleccionado.data.idregnumerico;
                            _this.idMedio = recordSeleccionado.data.idindicador;
                            _this.modelo.origenmedio = 'tallaft';
                        }
						_this.identificadorMedio(recordSeleccionado, cls);
                    }
                    if (_this.modelo.isValid())
                        _this.modelo.habilitarBotones(false);
                    this.close();
                }
            }
        }));
        return botones;
    },

    botonesVentana: function () {
        var _this = this;
        this.listaBotonesVentana.add(LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.ttBtnConfirmar,
            disabled: true,
            isContextual: true,
            estado: 1,
            handler: function () {
                var param = Array();
                param.push(_this.record.data.iddocumento);
                _this.modelo.confirmarSolicitud(param, function () {
                    _this.tab2.enable();
                    _this.tab2.doLayout();
                    _this.tabPanel.setActiveTab(1);
                    _this.tabPanel.doLayout();
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.tab2.items.items[1].getColumn(0).items.items[0].enable();
                    _this.tab2.items.items[2].getColumn(0).items.items[0].enable();
                    _this.comboCliente.disable();
                    _this.atributo.disable();
                    _this.textoMedio.disable();
                    _this.btnSalvar.disable();
                    _this.boton1.disable();
                    _this.garantia.disable();
                    _this.observacionesCliente.disable();
                }, function () {
                    _this.tab2.items.items[1].getColumn(0).items.items[0].disable();
                    _this.tab2.items.items[2].getColumn(0).items.items[0].disable();
                });
            }
        }));

        this.listaBotonesVentana.add(LOG.util.Prototipos.botonAprobar({
            text: _this.idioma.lbBtnAprobar,
            tooltip: _this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            estado: 2,
            handler: function () {
                var param = Array();
                param.push(_this.record.data.iddocumento);
                _this.modelo.aprobarSolicitud(param, function () {
                    _this.comboTecnico.disable();
                    _this.observacionesTecnico.disable();
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.btnSalvar.disable();
                });
            }
        }));
    },

    controlFnConfirmar: function (r) {
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

    controlFnAprobar: function (r) {
        if (!this.modelo.iddocumento) {
            this.listaBotonesVentana.getItem(1).disable();
        } else {
            if (r.data.estado == '2' && r.data.fallostecnicos) {
                this.listaBotonesVentana.getItem(1).enable();
            } else {
                this.listaBotonesVentana.getItem(1).disable();
            }
        }
    },

    resetNuevo: function (d) {
        var _this = this.scope || this;
        if (!d) {
            if (_this.formulario) {
                _this.modelo.reset();
            }
            _this.tab2.items.items[1].getColumn(0).items.items[0].disable();
            _this.tab2.items.items[2].getColumn(0).items.items[0].disable();
            _this.tab2.disable();
            _this.tabPanel.setActiveTab(0);
            _this.setTitle(_this.idioma.tlAdicionar);
            _this.listaBotonesVentana.getItem(0).disable();
            _this.listaBotonesVentana.getItem(1).disable();
            _this.record = null;
            _this.comboCliente.enable();
            _this.textoMedio.enable();
            _this.boton1.enable();
            _this.garantia.enable();
            _this.observacionesCliente.enable();
            _this.content.items.each(function (e, p) {
                if(p >= 2) {
                    if(e.items.items[0] && e.items.items[0].name != 'garantia') {
                        e.removeAll();
                        _this.content.items.removeAt(p);
                    }
                }
            });
        } else {
            _this.observacionesTecnico.setValue("");
            _this.comboTecnico.setValue("");
            _this.modelo.setDictamen(true);
            _this.listaBotonesVentana.getItem(1).disable();
        }
        this.btnNuevo.disable();

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
            _this.modelo.habilitarBotones(true);

        });
    },

    controlBotones: function (b, status) {
        var _caller = this;
        ;
        if (_caller.record) {
            if (_caller.record.data.iddocumento && _caller.record.data.estado == status) {
                if (status == 2) {
                    if (this.modelo.fallostecnicos) {
                        b.enable();
                    }
                } else {
                    if (status == 1) {
                        b.enable();
                    }
                }
            } else {
                b.disable();
            }
        }
    },

    prepareSolModify: function (d) {
        if (this.formulario) {
            this.formulario.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.record = d;
            this.textoMedio.setValue(this.record.data.descripcionmarcamodelo);
            this.getTitleDocumento(this.record.data.iddocumento);
			this.identificador = this.record.data.atributoidentificador;
            if (this.record.data.estado != 1) {
                this.comboCliente.disable();
                this.textoMedio.disable();
                this.boton1.disable();
                this.garantia.disable();
                this.observacionesCliente.disable();
                this.listaBotones.getItem(1).hidden = true;
                this.listaBotones.getItem(2).hidden = true;
            } else {
                this.elaboracion = true;
                this.boton1.enable();
                this.garantia.enable();
                this.observacionesCliente.enable();
            }
            this.btnNuevo.enable();
        }
    },

    prepareSolDefectacion: function (d) {
        if (this.formulario) {
            this.formulario.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.record = d;
            this.getTitleDocumento(this.record.data.iddocumento);
            this.tab2.enable();
            this.tab1.disable();
            this.comboTecnico.enable();
            this.observacionesTecnico.enable();
            this.modelo.setDictamen(true);
        }
    },

    bindGridModelo: function (grid) {
        this.modelo.bindGridPanel(grid);
    },

    crearDinamico: function (obj) {
        var _this = this;
        var campoTexto = null;
        var label = obj.label= (obj.label) ? obj.label : obj.denominacion;
        if (obj.longitud == null)
            obj.longitud = 50;
		campoTexto = new LOG.util.Prototipos.inputTexto({
            name: 'atributoidentificador',
            campo: (_this.esMatricula(obj.label))? 'nromatricula' : obj.nombretabla,
            labelSeparator: (obj.identificador == 1) ? '' : ':',
            fieldLabel: '<span style="color:#008000">' +label +  ' (identificador):</span>',
            identificador: obj.identificador,
            allowBlank: false,
            enableKeyEvents: true,
            width: 180,
            maxLength: (_this.esMatricula(obj.label))?7:obj.longitud,
            maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + (_this.esMatricula(obj.label))?7:obj.longitud + ' caracteres.',
            regex: (_this.esMatricula(obj.label)) ? LOG.util.Regex.matriculaAll : LOG.util.Regex.alfanumerico,
            regexText: (_this.esMatricula(obj.label)) ? _this.idioma.msgErrorMatricula : _this.idioma.msgRegexText,
            listeners: {
                keyup: function () {
                    _this.identificador = this.getValue();
                }
            }
        });
        _this.atributo = campoTexto;
        return campoTexto;
    },

    match: function(comp, obj) {
        var _this = this;
        for(var prop in obj) {
            if((comp.campo.toString() == prop.toString()) && obj[prop]!= null) {
                comp.setValue(obj[prop]);
                _this.identificador = comp.getValue();
                break;
            }
        }
    },

    identificadorMedio: function(record, cls, mod) {
        var _this = this;
        cls.body.mask(_this.idioma.msjLoadMask);
        _this.modelo.cargarIdentificador(record.data.idpadre, function (r) {
            var cmp = null;
            Ext.each(r.datos.dinamicos, function(cm) {
                if(cm.identificador == 1)
                    cmp = cm;
            });
            Ext.each(r.datos.naturaleza, function (cm) {
                if (cm.identificador == 1)
                    cmp = cm;
            });
            var column = new LOG.util.UIManager.initColumnForm({
                columnas: 1,
                defaultsAnchor: '98%'
            });

            if(cmp != null) {
                cls.items.each(function (e, p) {
                    if(p >= 2) {
                        if(e.items.items[0] && e.items.items[0].name != 'garantia') {
                            e.removeAll();
                            cls.items.removeAt(p);
                        }
                    }
                });
                var comp = _this.crearDinamico(cmp);
                column.addComponent(comp);
                if(!mod)
                    _this.match(comp, record.data);
                else {
                    comp.setValue(record.data.atributoidentificador);
                    if (_this.elaboracion)
                        comp.enable();
                    else
                        comp.disable();
                }

                cls.insert(2, column);
            } else {
                cls.items.each(function (e, p) {
                    if(p >= 2) {
                        if(e.items.items[0] && e.items.items[0].name != 'garantia') {
                            e.removeAll();
                            cls.items.removeAt(p);
                        }
                    }
                });
            }
            cls.getColumn(0).columnWidth = 0.32;
            cls.getColumn(1).columnWidth = 0.33;
            cls.getColumn(2).columnWidth = 0.30;
            cls.doLayout();
            _this.tabPanel.doLayout();
            _this.modelo.bindForm(_this.formulario);
            cls.body.unmask();
            _this.modelo.habilitarBotones();

        });
    },

    grantedAction: function(idAccion) {
        var existe = false;
        this.listaAcciones.each(function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },

    esMatricula:function(cadena){
        if(cadena.indexOf('matricula')!= -1 || cadena.indexOf('matrícula')!= -1 || cadena.indexOf('matr\u00edcula')!= -1){
            return true;
        }
        return false;
    }

});

log.tall.adcsolicitud.VistaTerceros = Ext.extend(LOG.util.Window, {
    listaBotonesVentana: undefined,
    tab2: undefined,
    panelContenedor: undefined,
    tabPanel: undefined,
    tabPanelBajo: undefined,
    gridServicios: undefined,
    formulario: undefined,
    btnSalvar: undefined,
    comboTipoMedio: undefined,
    comboProveedores: undefined,
    winSeleccionarMedio1: undefined,
    record: null,
    countMask: 0,
    store: undefined,
    idEntidad: undefined,
    idMedio: undefined,
    idEstructura: undefined,
    idAgencia: undefined,
    nomEntidad: undefined,
    idProducto: undefined,
    modify: false,
    elaboracion: false,
    listaAcciones: undefined,

    constructor: function (config) {
        var _this = this;
        LOG.util.UIManager.apply(this, config);
        this.listaAcciones = new LOG.util.List(config.acciones);
        config.idioma = {};
        this.modelo = config.modelo;
        this.height = 565,
        this.width = 800,
        this.arrProveedor = config.arrProveedor;
        this.constrain = true;
        this.modify = config.modify;
        LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        this.listaBotonesVentana = new LOG.util.List();
        log.tall.adcsolicitud.Vista.superclass.constructor.call(this, config);
        this.addEvents('quitarmask');
        this.on({
            'quitarmask': function () {
                if (_this.countMask >= 1) {
                    if (!_this.modify) {
                        _this.comboProveedores.enable();
                        _this.textoMedio.enable();
                        _this.comboProveedores.focus();
                    } else {
                        this.identificadorMedio(_this.record, _this.clsMedio, true);
                        if (_this.elaboracion) {
                            _this.comboProveedores.enable();
                            _this.textoMedio.enable();
                            _this.gridServicios.listaBotones.getItem(0).enable();
                            _this.gridServicios.listaBotones.getItem(1).enable();
                        }
                    }
                    _this.body.unmask();

                }
            },

            'resize': function() {
                var altura = _this.getHeight();
                _this.vista.setHeight(altura - 397);	
            }
        });
        this.documentKeyMap = new Ext.KeyMap(document, [
            {
                alt: true,
                ctrl: false,
                key: 'N',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(1));
                    }
                }
            }, {
                alt: true,
                ctrl: false,
                key: 'G',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(2));
                    }
                }
            }, {
                alt: true,
                ctrl: true,
                key: 'X',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(0));
                    }
                }
            }
        ]);
    },

    initComponent: function () {
        var _this = this;
        this.botonesVentana();
        this.store = new Ext.data.Store({
            url: '/logistica/talleres/recepcion/index.php/solicitud/cargarEntidad',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'identidad'
            }, [
                {name: 'identidad'},
                {name: 'denominacion'},
            ])
        });
        this.gridServicios = new log.tall.adcsolicitud.GridServicios({
            idioma: _this.idioma,
            modelo: _this.modelo
        });

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
            scope: this,
            disabled:true
        }));
        this.listaBotones.add(this.btnNuevo);
        this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
            disabled: true,
            tooltip: _this.idioma.ttBtnGuaradar,
            handler: function () {
                if (_this.modelo.defectacion) {
                    _this.listaBotonesVentana.getItem(1).enable();
                    _this.listaBotonesVentana.getItem(0).disable();
                }
                if (_this.gridServicios.getStorePrincipal().data.getCount() == 0) {
                    mostrarMensaje(3, _this.idioma.msgErrorServicios);
                } else {
                    var params = {};
                    params['idpadre'] = _this.idpadre;
                    params['idproducto'] = _this.idProducto;
                    params['idindicador'] = _this.idMedio;
                    params['idagencia'] = _this.idAgencia;
                    params['idestructura'] = _this.idEstructura;
                    params['entidad'] = _this.nomEntidad;
                    params['atributoidentificador'] = _this.identificador;
                    _this.modelo.salvarSolicitud(_this.gridServicios.salvarListasServicios(), params, function (r) {
                        if (_this.record == null) {
                            _this.record = {};
                            Ext.apply(_this.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });
                            _this.listaBotonesVentana.getItem(0).enable();
                        }
                        _this.getTitleDocumento(r.iddocumento);
                        _this.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this, [b, _this]).call();
                            }
                        }, _this);
                        _this.modelo.origenmedio = null;
                        _this.gridServicios.listadoServicios.deleteAll();
                        _this.gridServicios.getStorePrincipal().initBaseParams.idplansolicitud = _this.record.data.iddocumento;
                        _this.gridServicios.getStorePrincipal().load();
                        _this.btnSalvar.disable();
                    });

                }
            }

        });
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(this.btnSalvar));

        log.tall.adcsolicitud.Vista.superclass.initComponent.call(this);

        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'north',
            tbar: this.listaBotonesVentana.getArray()
        });

        this.tabPanel = new Ext.TabPanel({
            frame: true,
            region: 'center',
            enableTabScroll: true,
            activeTab: 0,
            layoutOnTabChange: true
        });

        this.tabPanelMedio = new Ext.TabPanel({
            frame: true,
            enableTabScroll: true,
            activeTab: 0,
            layoutOnTabChange: true
        });

        this.tabPanelBajo = new Ext.TabPanel({
            frame: true,
            enableTabScroll: true,
            activeTab: 0,
            layoutOnTabChange: true
        });
        this.tabs();
        this.store.load();
        this.comboProveedores.disable();
        this.tabPanel.doLayout();
        this.tabPanelBajo.doLayout();

        this.formulario = LOG.util.UIManager.initForm({
            region: 'center',
            border: false,
            frame: true,
            items: [this.tabPanel, this.tabPanelMedio, this.tabPanelBajo]
        });
        this.modelo.bindForm(this.formulario);

        this.add(this.panelGeneral);
        this.add(this.formulario);

    },

    tabs: function () {
        var _this = this;
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.clsMedio = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.store.on('load', function (st, params) {
            _this.idEntidad = params[0].data.identidad;
            if(_this.modify) {
                _this.modelo.cargarActivos(_this.idEntidad, function(resp) {
                    Ext.each(resp.datos, function(o) {
                        if(o.idregnumerico == _this.record.data.idproducto) {
                            _this.marca.setValue(o.marca);
                            _this.modeloMedio.setValue(o.modelo);
                        }
                    });
                    if(_this.record.data.estado != 1) {
                        _this.gridServicios.listaBotones.each(function (item, pos) {
                            item.disable();
                        });
                    }
                    _this.countMask++;
                });
                _this.modelo.cargarIndicadores(1, function(resp) {
                    Ext.each(resp.datos, function(o) {
                        if(o.idindicador == _this.record.data.idindicador) {
                            _this.marca.setValue(o.marca);
                            _this.modeloMedio.setValue(o.modelo);
                        }
                    });
                    if(_this.record.data.estado != 1) {
                        _this.gridServicios.listaBotones.each(function (item, pos) {
                            item.disable();
                        });
                    }
                    _this.countMask++;
                    _this.fireEvent('quitarmask');
                });

            } else {
                _this.countMask++;
                _this.fireEvent('quitarmask');
            }
        });

        /**Datos generales**/
        this.comboProveedores = new Ext.form.TriggerField({
            name: 'idagencia',
            fieldLabel: this.idioma.labelAgencia,
            allowBlank: false,
            triggerClass: 'x-form-cliente-trigger',
            editable: false,
            tabular:true,
            emptyText: this.idioma.lbSeleccione,
            listeners: {
                'onSelect': function () {
                    if (_this.formulario.getForm().isValid() && _this.gridServicios.getStorePrincipal().getCount() > 0) {
                        _this.btnSalvar.enable();
                    } else {
                        _this.btnSalvar.disable();
                    }
                }
            }
        });

        this.comboProveedores.onTriggerClick = function(e) {
            var ventanaSelectAgencia = new log.tall.adcsolicitud.VentanaSelecionAgencia({
                idioma: _this.idioma,
                title: _this.idioma.tlVentanaSelectAgencia,
                height: 425,
                width: 605
            });
            ventanaSelectAgencia.show();
            ventanaSelectAgencia.tabPanelGeneral.getListTemplate().each(function (temp) {
                temp.getStorePrincipal().load();
            });
            ventanaSelectAgencia.validacionBtn();
            ventanaSelectAgencia.aceptarFn = function () {
                if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                    var recordSeleccionado = ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                    if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'estructuras') {
                        _this.idEstructura = recordSeleccionado.data.id;
                        _this.nomEntidad = recordSeleccionado.data.text;
                        _this.gridServicios.setIsEstructura(true);
                        _this.comboProveedores.setValue(recordSeleccionado.data.text);
                        _this.idAgencia = null;
                    }
                    else if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'proveedores') {
                        _this.idEstructura = null;
                        _this.idAgencia = recordSeleccionado.data.idclientesproveedores;
                        _this.nomEntidad = recordSeleccionado.data.nombre;
                        _this.gridServicios.setIsEstructura(false);
                        _this.comboProveedores.setValue(recordSeleccionado.data.nombre);
                    }
                    if (_this.formulario.getForm().isValid() && _this.gridServicios.getStorePrincipal().getCount() > 0) {
                        _this.btnSalvar.enable();
                    } else {
                        _this.btnSalvar.disable();
                    }
                }
                _this.gridServicios.listaBotones.getItem(0).enable();
                if(_this.datosLimpios()){
                    _this.btnNuevo.disable();
                }
                else _this.btnNuevo.enable();
                this.close();
            }
        };
        cls.addComponent(this.comboProveedores);

        this.fecha = new Ext.form.DateField({
            name: 'fecha',
            allowBlank: false,
            width: 220,
            editable: false,
            fieldLabel: this.idioma.labelFecha,
            emptyText: this.idioma.lbSeleccione,
            listeners: {
                'select': function () {
                    if (_this.formulario.getForm().isValid() && _this.gridServicios.getStorePrincipal().getCount() > 0) {
                        _this.btnSalvar.enable();
                    } else {
                        _this.btnSalvar.disable();
                    }
                    if(_this.datosLimpios()){
                        _this.btnNuevo.disable();
                    }
                    else _this.btnNuevo.enable();
                }
            }
        });
        cls.addComponent(this.fecha);

        /**Datos del medio**/
        this.textoMedio = new LOG.util.Prototipos.inputTexto({
            name: 'idproducto',
            fieldLabel: this.idioma.labelMedio,
            allowBlank: false,
            width: 250,
            readOnly: true,
        });
        this.boton1 = LOG.util.UIManager.createBtn({
            text: '...',
            width: 18,
            handler: function () {
                var ventanaSeletMedio = new log.tall.adcsolicitud.VentanaSelecionMedio({
                    idioma: _this.idioma,
                    title: _this.idioma.tlVentanaSelectMedio,
                    isAFT: existeAFT,
                    idestructura: _this.idEntidad,
                    usarNomIndicador:  _this.grantedAction('usarNomPrd'),
                    usarAFTTall: _this.grantedAction('usarAFTTall'),
                    usarTallAFT: _this.grantedAction('usarTallAFT'),
                    tipo : 1
                });
                ventanaSeletMedio.show();
                /*ventanaSeletMedio.tabPanelGeneral.getListTemplate().each(function (temp) {
                    temp.getStorePrincipal().load();
                });*/
                ventanaSeletMedio.validacionBtn();
                ventanaSeletMedio.aceptarFn = function () {
                    if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                        var recordSeleccionado = ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                        _this.textoMedio.setValue(recordSeleccionado.data.descripcionmarcamodelo);
                        _this.nomProducto = recordSeleccionado.data.descripcionmarcamodelo;
                        _this.idpadre = recordSeleccionado.data.idpadre;
                        if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                            _this.idMedio = recordSeleccionado.data.idindicador;
                            _this.marca.setValue(recordSeleccionado.data.marca);
                            _this.modeloMedio.setValue(recordSeleccionado.data.modelo);
                        }
                        else if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.idProducto = recordSeleccionado.data.idregnumerico;
                            _this.idMedio = recordSeleccionado.data.idindicador;
                            _this.marca.setValue(recordSeleccionado.data.marca);
                            _this.modeloMedio.setValue(recordSeleccionado.data.modelo);
                        }
                        else if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                            _this.idProducto = recordSeleccionado.data.idregnumerico;
                            _this.idMedio = recordSeleccionado.data.idindicador;
                            _this.marca.setValue(recordSeleccionado.data.marca);
                            _this.modeloMedio.setValue(recordSeleccionado.data.modelo);
                            _this.modelo.origenmedio = 'tallaft';
                        }
                        if (_this.formulario.getForm().isValid() && _this.gridServicios.getStorePrincipal().getCount() > 0) {
                            _this.btnSalvar.enable();
                        } else {
                            _this.btnSalvar.disable();
                        }
                        _this.identificadorMedio(recordSeleccionado, _this.clsMedio);
                    }
                    if(_this.datosLimpios()){
                        _this.btnNuevo.disable();
                    }
                    else _this.btnNuevo.enable();
                    this.close();
                }
            }
            });
        var plugin = new LOG.util.UIManager.initColumnForm({
            columnas: 2,
            defaultsAnchor: '100%'
        });
        plugin.getColumn(0).columnWidth = 0.95;
        plugin.getColumn(1).columnWidth = 0.05;
        var panel2 = new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({height: 19}), this.boton1]
        });
        plugin.addComponent(this.textoMedio);
        plugin.addComponent(panel2);
        this.clsMedio.addComponent(plugin);

        this.marca = new LOG.util.Prototipos.inputTexto({
            name: 'marca',
            disabled: true,
            width: 300,
            fieldLabel: this.idioma.labelMarcaMedio
        });
        this.clsMedio.addComponent(this.marca);

        this.modeloMedio = new LOG.util.Prototipos.inputTexto({
            name: 'modelo',
            disabled: true,
            width: 10,
            fieldLabel: this.idioma.labelModelo
        });
        this.clsMedio.addComponent(this.modeloMedio);

        this.tab1 = new LOG.util.Panel({
            frame: true,
            region: 'center',
            title: _this.idioma.tabAdicionra,
            width: '98%',
            height: 72,
            items: [cls]
        });

        this.tabMedio = new LOG.util.Panel({
            frame: true,
            region: 'center',
            title: _this.idioma.tabMedio,
            width: '98%',
            height: 120,
            items: [this.clsMedio]
        });

        this.gridServicios.init();
        this.vista = this.gridServicios.view();
        this.vista.height = 257;
        this.vista.setTitle(this.idioma.tabServicios);

        this.gridServicios.getStorePrincipal().on({
            load:function(){
                if(_this.datosLimpios())
                    _this.btnNuevo.disable();
                else
                    _this.btnNuevo.enable();
            },
            add:function(store){
                _this.gridServicios.listaBotones.getItem(1).enable();
                if (_this.modelo.basicForm.isValid()) {
                    _this.btnSalvar.enable();
                }
                else
                    _this.btnSalvar.disable();
                if(_this.datosLimpios())
                    _this.btnNuevo.disable();
                else
                    _this.btnNuevo.enable();
            },
            remove:function(store){
                if (store.getCount() == 0) {
                    _this.gridServicios.listaBotones.getItem(1).disable();
                }
                if (_this.modelo.basicForm.isValid()) {
                    if (store.getCount() > 0) {
                        _this.btnSalvar.enable();
                    } else {
                        _this.btnSalvar.disable();
                    }
                }
                else
                    _this.modelo.habilitarBotones(true);
                if(_this.datosLimpios())
                    _this.btnNuevo.disable();
                else
                    _this.btnNuevo.enable();
            }
        })

        this.tabPanel.add(this.tab1);
        this.tabPanel.doLayout();
        this.tabPanelMedio.add(this.tabMedio);
        this.tabPanelMedio.doLayout();
        this.tabPanelBajo.add(this.vista);
        this.tabPanelBajo.doLayout();
    },

    botonesVentana: function () {
        var _this = this;
        this.listaBotonesVentana.add(LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.ttBtnConfirmarT,
            disabled: true,
            isContextual: true,
            estado: 1,
            handler: function () {
                var param = Array();
                param.push(_this.record.data.iddocumento);
                _this.modelo.confirmarSolicitudterceros(param, function () {
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.btnSalvar.disable();
                    _this.comboProveedores.disable();
                    _this.atributo.disable();
                    _this.textoMedio.disable();
                    _this.boton1.disable();
                    _this.fecha.disable();
                    _this.gridServicios.listaBotones.getItem(0).disable();
                    _this.gridServicios.listaBotones.getItem(1).disable();
                });
                _this.listaBotonesVentana.getItem(1).enable();
            }
        }));

        this.listaBotonesVentana.add(LOG.util.Prototipos.botonAprobar({
            text: _this.idioma.lbBtnAprobar,
            tooltip: _this.idioma.ttBtnAprobarT,
            isContextual: true,
            disabled: true,
            estado: 2,
            handler: function () {
                var param = Array();
                param.push(_this.record.data.iddocumento);
                _this.modelo.aprobarSolicitudTerceros(param, function () {
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.btnSalvar.disable();
                });
            }
        }));
    },

    controlFnConfirmarTerceros: function (r) {
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

    controlFnAprobarTerceros: function (r) {
        if (!this.modelo.iddocumento) {
            this.listaBotonesVentana.getItem(1).disable();
        } else {
            if (r.data.estado == '2') {
                this.listaBotonesVentana.getItem(1).enable();
            } else {
                this.listaBotonesVentana.getItem(1).disable();
            }
        }
    },

    resetNuevo: function () {
        var _this = this.scope || this;
        if (_this.formulario) {
            _this.modelo.reset();
            _this.gridServicios.getStorePrincipal().removeAll();
            _this.gridServicios.listadoServicios = new LOG.util.List();
            _this.gridServicios.listadoServiciosElim = new LOG.util.List();
        }
        _this.setTitle(_this.idioma.tlAdicionarT);
        _this.gridServicios.getStorePrincipal().removeAll();
        _this.gridServicios.getStorePrincipal().initBaseParams.iddocumento = undefined;
        _this.gridServicios.listadoServicios.deleteAll();
        _this.marca.setValue('');
        _this.modeloMedio.setValue('');
        _this.listaBotonesVentana.getItem(0).disable();
        _this.listaBotonesVentana.getItem(1).disable();
        _this.gridServicios.listaBotones.getItem(0).disable();
        _this.gridServicios.listaBotones.getItem(1).disable();
        _this.record = null;
        _this.idEstructura = null;
        _this.idAgencia = null;
        _this.comboProveedores.enable();
        _this.textoMedio.enable();
        _this.boton1.enable();
        _this.btnNuevo.disable();
        _this.fecha.enable();
        _this.clsMedio.items.each(function (e, p) {
            if(p >= 1) {
                if(e.items.items[0] && e.items.items[0].name != 'marca') {
                    e.removeAll();
                    _this.clsMedio.items.removeAt(p);
                }
            }
        });
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
            _this.modelo.habilitarBotones(true);
        });
    },

    controlBotones: function (b, status) {
        var _caller = this;
        if (_caller.record) {
            if (_caller.record.data.iddocumento && _caller.record.data.estado == status)
                b.enable();
            else b.disable();
        }
    },

    prepareSolModify: function (d) {
        var _this = this;
        if (_this.formulario) {
            _this.formulario.getForm().loadRecord(d);
            _this.modelo.loadRecord();
            _this.record = d;
            _this.textoMedio.setValue(_this.record.json.descripcionmarcamodelo);
            _this.comboProveedores.setValue(_this.cargarAgencia(_this.record));
            if(_this.record.json.idestructura) {
                _this.gridServicios.setIsEstructura(true);
            } else {
                _this.gridServicios.setIsEstructura(false);
            }
            _this.idEstructura = _this.record.json.idestructura;
            _this.idAgencia = _this.record.json.idagencia;
            _this.identificador = _this.record.json.atributoidentificador;
            if(_this.record.json.idproducto) {
                _this.marca.setVisible(true);
                _this.modeloMedio.setVisible(true);
            }
            _this.getTitleDocumento(this.record.json.iddocumento);
            _this.gridServicios.getStorePrincipal().initBaseParams.idplansolicitud = this.record.json.iddocumento;
            _this.gridServicios.getStorePrincipal().load();
            if (_this.record.json.estado != 1) {
                _this.comboProveedores.disable();
                _this.textoMedio.disable();
                _this.boton1.disable();
                _this.fecha.disable();
                _this.listaBotones.getItem(1).hidden = true;
                _this.listaBotones.getItem(2).hidden = true;
            } else {
                _this.elaboracion = true;
            }
        }
    },

    cargarAgencia: function(record) {
        var _this = this;
        var id = record.json.idagencia;
        var resul = id;
        if(record.json.idagencia) {
            Ext.each(_this.arrProveedor, function (r) {
                if (r['idclientesproveedores'] == id) {
                    resul = r['nombre'];
                }
            });
        } else {
            if (record.json.entidad) {
                resul = record.json.entidad;
            }
        }
        return resul;

        },

    bindGridModeloTerceros: function (grid) {
        this.modelo.bindGridPanel(grid);
    },

    crearDinamico: function (obj) {
        var _this = this;
        var campoTexto = null;
        obj.label = (obj.label) ? obj.label : obj.denominacion;
        if (obj.longitud == null) {
            obj.longitud = 50;
        }
        campoTexto = new LOG.util.Prototipos.inputTexto({
            name: 'atributoidentificador',
            campo: (obj.label == 'matricula') ? 'nromatricula' : obj.nombretabla,
            labelSeparator: (obj.identificador == 1) ? '' : ':',
            fieldLabel: '<span style="color:#008000">' +obj.label +  ' (identificador):</span>',
            identificador: obj.identificador,
            allowBlank: false,
            enableKeyEvents: true,
            width: 370,
            maxLength: (_this.esMatricula(obj.label))? 7:obj.longitud,
            maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + (_this.esMatricula(obj.label)) ? 7:obj.longitud + ' caracteres.',
            regex: (_this.esMatricula(obj.label))? LOG.util.Regex.matriculaAll : LOG.util.Regex.alfanumerico,
            regexText: (_this.esMatricula(obj.label))? _this.idioma.msgErrorMatricula : _this.idioma.msgRegexText,
            listeners: {
                keyup: function () {
                    _this.identificador = this.getValue();
                }
            }
        });
        _this.atributo = campoTexto;
        return campoTexto;
    },

    match: function(comp, obj) {
        var _this = this;
        for(var prop in obj) {
            if((comp.campo.toString() == prop.toString()) && obj[prop]!= null) {
                comp.setValue(obj[prop]);
                _this.identificador = comp.getValue();
                break;
            }
        }
    },

    identificadorMedio: function(record, cls, mod) {
        var _this = this;
        _this.btnSalvar.disable();
        cls.body.mask(_this.idioma.msjLoadMask);
        _this.modelo.cargarIdentificador(record.data.idpadre, function (r) {
            var cmp = null;
            Ext.each(r.datos.dinamicos, function(cm) {
                if(cm.identificador == 1)
                    cmp = cm;
            });
            Ext.each(r.datos.naturaleza, function (cm) {
                if (cm.identificador == 1)
                    cmp = cm;
            });
            var column = new LOG.util.UIManager.initColumnForm({
                columnas: 1,
                defaultsAnchor: '100%'
            });

            if(cmp != null) {
                cls.items.each(function (e, p) {
                    if(p >= 1) {
                        if(e.items.items[0] && e.items.items[0].name != 'marca') {
                            e.removeAll();
                            cls.items.removeAt(p);
                        }
                    }
                });
                comp = _this.crearDinamico(cmp);
                column.addComponent(comp);
                if(!mod)
                    _this.match(comp, record.data);
                else {
                    comp.setValue(record.data.atributoidentificador);
                    if (_this.elaboracion)
                        comp.enable();
                    else
                        comp.disable();
                }

                cls.insert(1, column);
            } else {
                cls.items.each(function (e, p) {
                    if(p >= 1) {
                        if(e.items.items[0] && e.items.items[0].name != 'marca') {
                            e.removeAll();
                            cls.items.removeAt(p);
                        }
                    }
                });
            }/*
            cls.getColumn(0).columnWidth = 0.32;
            cls.getColumn(1).columnWidth = 0.33;*/
            cls.doLayout();
            _this.tabPanel.doLayout();
            _this.modelo.bindForm(_this.formulario);
            cls.body.unmask();
            _this.validarMascara();

        });
    },

    validarMascara :  function() {
        var _this = this;
        if(!_this.modify) {
            if (_this.formulario.getForm().isValid() && _this.gridServicios.getStorePrincipal().getCount() > 0) {
                _this.btnSalvar.enable();
            } else {
                _this.btnSalvar.disable();
            }
        } else {
            if (_this.formulario.getForm().isValid() && _this.formulario.getForm().isDirty() && _this.gridServicios.getStorePrincipal().getCount() > 0) {
                _this.btnSalvar.enable();
            } else {
                _this.btnSalvar.disable();
            }
        }

    },

    grantedAction: function(idAccion) {
        var existe = false;
        this.listaAcciones.each(function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    datosLimpios:function(){
        var _this = this;
        if(this.textoMedio.getValue() || this.fecha.getValue() || this.comboProveedores.getValue() ||  this.gridServicios.getStorePrincipal().getCount() > 0){
            return false;
        }
        else true;

    },
    esMatricula:function(cadena){
        if(cadena.indexOf('matricula')!= -1 || cadena.indexOf('matrícula')!= -1 || cadena.indexOf('matr\u00edcula')!= -1){
            return true;
        }
        return false;
    }

});

log.tall.adcsolicitud.GridServicios = Ext.extend(LOG.util.UITemplate, {
    listadoServicios: undefined,
    listadoServiciosElim: undefined,
    tipoServicio: 0,
    isestuctura: false,

    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/talleres/recepcion/index.php/solicitud';
        this.urlBusquedaGridPrincipal = 'devolverServios';
        this.modoSeleccion = 2;
        this.listadoServicios = new LOG.util.List();
        this.listadoServiciosElim = new LOG.util.List();
        config.idioma = {};
        LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        log.tall.adcsolicitud.GridServicios.superclass.constructor.call(this, config);
    },

    render: function () {
        var _this = this;
        var vista = log.tall.adcsolicitud.GridServicios.superclass.render.call(this);
        this.storePrincipal.on('load', function () {
            if (_this.listadoServicios.count() > 0) {
                _this.getStorePrincipal().insert(0, _this.listadoServicios.getArray());
            }
        });
        return vista;
    },

    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            dataIndex: 'id',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idactividad',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idservicio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idplansolicitud',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            default: true
        });
    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.BtnAdicionar,
            tooltip: _this.idioma.ttBtnAdicionarSer,
            disabled: true,
            handler: function () {
                if (!_this.isestuctura) {
                    LOG.inv.maestroproductos.Loader.init(function () {
                        var v = new LOG.lb.maestroproductos.UIProductos({
                            tipo: 2,
                            doAction: function (r) {
                                var TopicRecord = Ext.data.Record.create([
                                    {name: 'idindicador'},
                                    {name: 'denominacion'},
                                ]);
                                Ext.each(r, function (rec) {
                                    var myNewRecord = new TopicRecord({
                                        id: rec.json.idindicador,
                                        denominacion: rec.json.denominacion
                                    });
                                    var posA = -1;
                                    _this.listadoServiciosElim.each(function (rs, pos) {
                                        if (rs.data.id == myNewRecord.data.id) {
                                            posA = pos;
                                        }
                                    });
                                    if (posA != -1) {
                                        var newList = _this.deleteList(_this.listadoServiciosElim, posA);
                                        _this.listadoServiciosElim = newList;
                                    }
                                    if (!_this.servciosRepetidos(myNewRecord)) {
                                        _this.listadoServicios.add(myNewRecord);
                                        _this.tipoServicio = 1;
                                        _this.getStorePrincipal().add(myNewRecord);
                                    }
                                });
                                this.close();
                            }
                        });
                        v.constrain = true;
                        v.show();
                    });
                } else {
                    var servicios = new log.tall.adcsolicitud.GridActividades({
                        idioma: _this.idioma,
                        title: _this.idioma.tlVentanaSelectActividad,
                        height: 425,
                        width: 605
                    });
                    servicios.init();
                    servicios.view();
                    servicios.getStorePrincipal().load();
                    servicios.getVistaPrincipal().aceptarFn = function(){
                        var r = servicios.getSmPrincipal().getSelections();
                        var TopicRecord = Ext.data.Record.create([
                            {name: 'idindicador'},
                            {name: 'denominacion'},
                        ]);
                        Ext.each(r, function (rec) {
                            var myNewRecord = new TopicRecord({
                                id: rec.json.idactividad,
                                denominacion: rec.json.denominacion
                            });
                            var posA = -1;
                            _this.listadoServiciosElim.each(function (rs, pos) {
                                if (rs.data.id == myNewRecord.data.id) {
                                    posA = pos;
                                }
                            });
                            if (posA != -1) {
                                var newList = _this.deleteList(_this.listadoServiciosElim, posA);
                                _this.listadoServiciosElim = newList;
                            }
                            if (!_this.servciosRepetidos(myNewRecord)) {
                                _this.listadoServicios.add(myNewRecord);
                                _this.tipoServicio = 2;
                                _this.getStorePrincipal().add(myNewRecord);
                            }
                        });
                    }
                }

            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.BtnEliminar,
            tooltip: _this.idioma.ttBtnEliminarSer,
            iconCls: 'eliminar',
            isContextual: true,
            disabled: true,
            handler: function () {
                if (_this.getSmPrincipal().hasSelection()) {
                    Ext.each(_this.getSmPrincipal().getSelections(), function (r) {
                        _this.listadoServiciosElim.add(r);
                        var posE = -1;
                        _this.listadoServicios.each(function (rs, pos) {
                            if (rs.data.id == r.data.id) {
                                posE = pos;
                            }
                        });
                        if (posE != -1) {
                            var newList = _this.deleteList(_this.listadoServicios, posE);
                            _this.listadoServicios = newList;
                        }
                        _this.getStorePrincipal().remove(r);
                    });
                    this.disable();
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _caller.getGridPrincipal().getSelectionModel().getSelected()) {
                        b.enable();
                    }
                    if (e == 'rowdeselect' && _caller.getGridPrincipal().getSelectionModel().getSelected()) {
                        b.disable();
                    }
                });
            }
        }));
    },

    salvarListasServicios: function () {
        _this = this;
        var serviciosAdiconados = new Array();
        var serviciosEliminados = new Array();

        this.listadoServicios.each(function (rl, pos) {
            var param = {};
            param['denominacion'] = rl.data.denominacion;
            param['id'] = rl.data.id;
            serviciosAdiconados[pos] = param;
        });

        this.listadoServiciosElim.each(function (rl, pos) {
            serviciosEliminados[pos] = rl.data.idservicio;
        });

        var param = {};
        param['serviciosadicionados'] = serviciosAdiconados;
        param['servicioseliminados'] = serviciosEliminados;
        param['tiposervicio'] = _this.tipoServicio;

        this.getStorePrincipal().commitChanges();

        return param;
    },

    servciosRepetidos: function (r) {
        var _this = this;
        var repetido = false;
        _this.getStorePrincipal().each(function (rl, pos) {
            if (rl.data.idindicador == r.data.id) {
                repetido = true;
            } else {
                if (rl.data.idactividad == r.data.id) {
                    repetido = true;
                } else {
                    if (rl.data.id == r.data.id) {
                        repetido = true;
                    }
                }
            }

        });
        _this.listadoServicios.each(function (rl, pos) {
            if (rl.data.id == r.data.id) {
                repetido = true;
            }
        });
        return repetido;
    },

    deleteList: function (list, pos) {
        var result = new LOG.util.List();
        var length = list.count();
        if (pos >= 0 && pos < length) {
            if (pos == length - 1) {
                for (var i = 0; i < pos; i++) {
                    result.add(list.getItem(i));
                }
            } else {
                for (var i = 0; i < length; i++) {
                    if (pos == i) {
                        result.add(list.getItem(i + 1));
                        i = i + 1;
                    } else {
                        result.add(list.getItem(i));
                    }
                }
            }
            return result;
        }
    },

    setIsEstructura : function (bool) {
        var _this = this;
        _this.isestuctura = bool;
        _this.getStorePrincipal().each(function(o) {
            _this.listadoServiciosElim.add(o);
        });
        _this.getStorePrincipal().removeAll();
        _this.listadoServicios.deleteAll();
        _this.listaBotones.getItem(1).disable();
    }

});

log.tall.adcsolicitud.VentanaSelecionMedio = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    panelGeneral: undefined,
    tabPanelGeneral: undefined,
    isAFT: undefined,
    usarAFTTall:true,
    usarTallAFT:true,
    idestructura: undefined,
    cerrarAceptar: true,
    usarNomIndicador: 1,
    constructor: function (config) {
        this.usarAplicar = false;
        this.usarNomIndicador = config.usarNomIndicador;
        this.resizable = false;
        this.tipo = config.tipo;
        this.height = 425,
        this.width = 880,
        log.tall.adcsolicitud.VentanaSelecionMedio.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();
    },
    initComponent: function () {
        var _this = this;
        log.tall.adcsolicitud.VentanaSelecionMedio.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.tabPanelGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            formaVisualizacion: 'panel'
        });
        if (this.usarNomIndicador) {
            this.tab1 = new log.tall.adcsolicitud.GridIndicadores({
                idioma: _this.idioma,
                title: _this.idioma.tlIndicadores,
                height: 200
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab1);
        }
        if (this.isAFT) {
            if(this.usarAFTTall) {
                this.tab2 = new log.tall.adcsolicitud.GridActivosFijos({
                    idioma: _this.idioma,
                    title: 'Enviados al taller',
                    height: 200,
                    tipo : _this.tipo,
                    idestructura: _this.idestructura
                });
                this.tabPanelGeneral.addTabToTemplete(this.tab2);
            }
            if(this.usarTallAFT) {
                this.tab3 = new log.tall.adcsolicitud.GridActivosFijos({
                    idioma: _this.idioma,
                    title: _this.idioma.tlActivos,
                    height: 200,
                    textBusquedaSimple:'Identificador',
                    identificador:"tallaft",
                    idComponent:"tallaft",
                    idestructura: _this.idestructura,
                    busquedaBasica:true,
                    busquedaAvanzadaAFT: _this.busquedaAvanzadaAFT
                });
                this.tabPanelGeneral.addTabToTemplete(this.tab3);
            }

        }

        this.tabPanelGeneral.init();
        var x = this.tabPanelGeneral.view();
        if(this.tab3){
            this.tab3.on({
                'adicionarmedio':function(){
                    _this.aceptarFn();
                    _this.close();
                }
            });
        }
        x.height = 350;
        x.width = 856;
        x.frame = false;
        this.panelGeneral.add(x);
        this.add(this.panelGeneral);
        this.tabPanelGeneral.on({
            tabchange:function(p){
                if(_this.tabPanelGeneral.getActiveTemplate().getStorePrincipal().getCount()==0) {
                    if(_this.tabPanelGeneral.getActiveTemplate().getIdentificador() != 'tallaft')
                        _this.tabPanelGeneral.getActiveTemplate().getStorePrincipal().load();
                }
                if(_this.tabPanelGeneral.getActiveTemplate().getSmPrincipal().hasSelection()){
                    _this.listaBotones.getItem(2).enable();
                }
                else  _this.listaBotones.getItem(2).disable();
            }
        })
    },
    validacionBtn: function () {
        var _this = this;
        if (this.isAFT) {
            if (this.tab2) {
                this.tab2.getSmPrincipal().on({
                    rowselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.listaBotones.getItem(2).enable()
                        }
                    },
                    rowdeselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                });
            }
            if (this.tab3) {
                this.tab3.getSmPrincipal().on({
                    rowselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                            _this.listaBotones.getItem(2).enable()
                        }
                    },
                    rowdeselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                });
                this.tab3.getStorePrincipal().on({
                    load:function(st){
                        if(st.getCount()==0){
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                })
            }
        }
        if (this.usarNomIndicador) {
            this.tab1.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                        _this.listaBotones.getItem(2).enable();
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
            this.tab1.getStorePrincipal().on({
                load:function(st){
                    if(st.getCount()==0){
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            })
        }

    }

});

log.tall.adcsolicitud.GridActivosFijos = Ext.extend(LOG.util.UITemplate, {
    identificador: 'aft',
    idComponent: 'aft',
    tipo: 1,
    idestructura: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.tipo = config.tipo;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/recepcion/index.php/solicitud';
        this.urlBusquedaGridPrincipal = 'cargarEnviadosATaller';
        this.idioma = LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        this.textBusquedaSimple = this.idioma.tlCodigoDeno;
        log.tall.adcsolicitud.GridActivosFijos.superclass.constructor.call(this, config);
        this.concepto = this.idioma.ttBuscarMedios;
        this.idGridPrincipal = 'idregnumerico';
        this.addEvents('adicionarmedio');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMatricula,
            dataIndex: 'nromatricula',
            //default: true,
            hidden:true,
            filter:{
                type:'string',
                dataIndex:'nromatricula'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgIndicativo,
            dataIndex: 'indicativo',
            //default: true,
            hidden:true,
            filter:
            {
                type:'string',
                dataIndex:'indicativo'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            //default: true,
            filter:{
                type:'string',
                dataIndex:'codigo'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacionMedios,
            width: 250,
            dataIndex: 'descripcionmarcamodelo',
            default: true,
            id: 'denoAft',
            filter:{
                type:'string',
                dataIndex:'descripcionmarcamodelo'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            width: 120,
            //default: true,
            filter:{
                type:'string',
                dataIndex:'marca'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            width: 120,
            //default: true,
            filter:{
                type:'string',
                dataIndex:'modelo'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgSerie,
            width: 120,
            dataIndex: 'nroserie',
            //default: true,
            filter:{
                type:'string',
                dataIndex:'nroserie'
            }
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = log.tall.adcsolicitud.GridActivosFijos.superclass.render.call(this);
        this.getStorePrincipal().on('beforeload', function (store) {
            store.initBaseParams = {idestructura: _this.idestructura, tipo: _this.tipo,
                ventana:_this.getIdentificador()};
        });
        this.getStorePrincipal().on('load', function (store, records) {
            var matricula = false;
            Ext.each(records, function(r){
                if(r.json.nromatricula) {
                    matricula = true;
                }
            });

            if(matricula) {
                var mat = _this.getGridPrincipal().getColumnModel().findColumnIndex('nromatricula');
               _this.getGridPrincipal().getColumnModel().setHidden(mat, false);
            }

            var indicativo = false;
            Ext.each(records, function(r){
                if(r.json.indicativo) {
                    indicativo = true;
                }
            });

            if(indicativo) {
                var ind = _this.getGridPrincipal().getColumnModel().findColumnIndex('indicativo');
               _this.getGridPrincipal().getColumnModel().setHidden(ind, false);
            }
            if( _this.getIdentificador()== "tallaft" ){
                if(store.getCount() == 1) {
                    _this.getSmPrincipal().selectFirstRow();
                    _this.fireEvent('adicionarmedio');
                }
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denoAft';
        return vista;
    }
});

log.tall.adcsolicitud.GridIndicadores = Ext.extend(LOG.util.UITemplate, {
    identificador: 'indicadores',
    idComponent: 'indicadores',
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
        this.urlBusquedaGridPrincipal = 'cargarGridClasificador';
        this.idioma = LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        this.concepto = this.idioma.ttBuscarMedios;
        this.textBusquedaSimple = this.idioma.tlCodigo;
        log.tall.adcsolicitud.GridIndicadores.superclass.constructor.call(this, config);


    },

    render: function() {
        var _this = this;
        var vista = log.tall.adcsolicitud.GridIndicadores.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'denoInd';
        this.getStorePrincipal().initBaseParams.explotacion = 1;
        return vista;
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
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
            header: this.idioma.cgDenominacionMedios,
            width: 120,
            dataIndex: 'descripcionmarcamodelo',
            default: true,
            id: 'denoInd'
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            width: 150,
            default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    }
});

log.tall.adcsolicitud.GridActividades = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        this.formaVisualizacion='ventana';
        this.panelBotonesVisible = true;
        this.dirController = '/logistica/talleres/recepcion/index.php/solicitud';
        config.urlBusquedaGridPrincipal = 'cargarActividadesExistentes';
        this.busquedaBasica = true;
        this.title = config.title;
        this.autoLoad = false,
        this.idioma = LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        this.textBusquedaSimple = this.idioma.tlServicio;
        this.concepto = this.idioma.ttBuscarServicios;
        log.tall.adcsolicitud.GridActividades.superclass.constructor.call(this, config);
        this.modelo = new log.tall.recepcion.Model({
            idioma: config.idioma
        });
        this.getVistaPrincipal().title = this.idioma.tlVentanaSelectActividad;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
    },
    initDefaultColumns:function(){
        this.addGridColumn({
            dataIndex: 'idactividad',
            hidden:true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTrabajoRealizar,
            dataIndex: 'denominacion',
            id:'denominacionSA',
            default: true
        });

    },

    render:function(){
        var _this = this;
        var vista =  log.tall.adcsolicitud.GridActividades.superclass.render.call(this);
        this.storePrincipal.on('beforeload',function(store){
            store.initBaseParams = {idservicio:null, hijos:0, nivel:2};
        });
        this.gpPrincipal.autoExpandColumn = 'denominacionSA';
        return vista;
    }
});

log.tall.adcsolicitud.VentanaSelecionAgencia = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    panelGeneral: undefined,
    tabPanelGeneral: undefined,
    cerrarAceptar: true,
    constructor: function (config) {
        this.usarAplicar = false;
        log.tall.adcsolicitud.VentanaSelecionAgencia.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();
    },

    initComponent: function () {
        var _this = this;
        log.tall.adcsolicitud.VentanaSelecionAgencia.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.tabPanelGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            formaVisualizacion: 'panel'
        });

        this.tab1 = new log.tall.adcsolicitud.gridEstructuras({
            idioma: _this.idioma,
            title: _this.idioma.tlEstructuras,
            height: 200
        });
        this.tabPanelGeneral.addTabToTemplete(this.tab1);


        this.tab2 = new log.tall.adcsolicitud.gridProveedor({
            idioma: _this.idioma,
            title: _this.idioma.tlProveedor,
            height: 200,
            idestructura: _this.idestructura
        });
        this.tabPanelGeneral.addTabToTemplete(this.tab2);

        this.tabPanelGeneral.init();
        var x = this.tabPanelGeneral.view();
        x.height = 350;
        x.width = 580;
        x.frame = false;
        this.panelGeneral.add(x);
        this.add(this.panelGeneral);
    },

    validacionBtn: function () {
        var _this = this;
        this.tab2.getSmPrincipal().on({
            rowselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'proveedores') {
                    _this.listaBotones.getItem(2).enable()
                }
            },
            rowdeselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'proveedores') {
                    _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.tab1.getSmPrincipal().on({
            rowselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'estructuras') {
                    _this.listaBotones.getItem(2).enable();
                }
            },
            rowdeselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'estructuras') {
                    _this.listaBotones.getItem(2).disable();
                }
            }
        });

        this.tabPanelGeneral.on({
            tabchange: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                    _this.listaBotones.getItem(2).enable();
                }
                else  _this.listaBotones.getItem(2).disable();
            }
        });
    }

});

log.tall.adcsolicitud.gridEstructuras = Ext.extend(LOG.util.UITemplate, {
    identificador: 'estructuras',
    idComponent: 'estructuras',
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/recepcion/index.php/solicitud';
        this.urlBusquedaGridPrincipal = 'cargarEstructuras';
        this.idioma = LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        this.concepto = this.idioma.ttBuscarEstructura;
        this.textBusquedaSimple = this.idioma.tlEstructura;
        log.tall.adcsolicitud.gridEstructuras.superclass.constructor.call(this, config);


    },

    render: function() {
        var _this = this;
        var vista = log.tall.adcsolicitud.gridEstructuras.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'text';
        this.getStorePrincipal().initBaseParams.tipo = 1;
        return vista;
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'id',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacionMedios,
            width: 120,
            dataIndex: 'text',
            default: true,
            id: 'text'
        });
    },
    getIdentificador: function () {
        return this.identificador;
    }
});

log.tall.adcsolicitud.gridProveedor = Ext.extend(LOG.util.UITemplate, {
    identificador: 'proveedores',
    idComponent: 'proveedores',
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/recepcion/index.php/solicitud';
        this.urlBusquedaGridPrincipal = 'cargarEstructuras';
        this.idioma = LOG.util.UIManager.apply(config.idioma, log.tall.recepcion.Idioma);
        this.concepto = this.idioma.ttBuscarProveedor;
        this.textBusquedaSimple = this.idioma.tlProveeedor;
        log.tall.adcsolicitud.gridProveedor.superclass.constructor.call(this, config);


    },

    render: function() {
        var _this = this;
        var vista = log.tall.adcsolicitud.gridProveedor.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'nombre';
        this.getStorePrincipal().initBaseParams.tipo = 2;
        return vista;
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idclientesproveedores',
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
            header: this.idioma.cgDenominacionMedios,
            width: 120,
            dataIndex: 'nombre',
            default: true,
            id: 'nombre'
        });
    },
    getIdentificador: function () {
        return this.identificador;
    }
});



