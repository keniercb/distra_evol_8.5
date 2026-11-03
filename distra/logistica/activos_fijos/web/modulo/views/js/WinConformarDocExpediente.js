


Ext.LOG.moduloMedio.confExpedienteGrid = Ext.extend(LOG.util.UITemplate, {
    nottitle: null,
    idsRegNumNoMostrar: new Array(),
    constructor: function(config) {
        this.dirController = '/logistica/activos_fijos/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        // this.idGridPrincipal = 'idregnumerico';
        this.autoLoad = true;
        this.idioma = config.idioma;
        this.region = 'center';
        this.dataregnumerico = config.dataregnumerico;
        this.identidad = config.identidad;
        this.scopGrid = config.scopGrid;
        this.urlBusquedaGridPrincipal = 'cargardocumentos';

        Ext.LOG.moduloMedio.confExpedienteGrid.superclass.constructor.call(this, config);
        this.idExpInmuebleSeleccionado = null;
        this.llavesForaneas = Array();
        this.ar_where = '';
        this.arridtablas = Array();


    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idexpediente',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idexpdocumento',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idtabla',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbHederDescp,
            dataIndex: 'denominacion',
            autoExpand: true,
            width: 120,
            default: true,
            tooltip: _this.idioma.lbTtDenominacion,
        });
        this.addGridColumn({
            header: _this.idioma.lbCulminacion,
            dataIndex: 'culminacion',
            width: 120,
            agrupador: false,
            default: true,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        var scopeGrid = _this.scopGrid;
        // console.info(_this.scopGrid.scope.comboDeposito.getValue());
        var dataregnumerico = _this.dataregnumerico;
        var identidad = this.identidad;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.lbbtnAdicionarExp,
            handler: function() {
                var winDocExpediente = new Ext.LOG.moduloMedio.winDocExpedienteModulo({
                    formaVisualizacion: 'ventana',
                    datConfExp: _this,
                    idioma: _this.idioma,
                    identidad: _this.identidad,
                    idregnumerico: _this.dataregnumerico.data.idregnumerico,
                    storedata: _this.getStorePrincipal().data
                });
                winDocExpediente.init();
                winDocExpediente.view();
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.TooltbtnEliminarDocExp,
            disabled: true,
            handler: function() {
                var datidexpediente = Array();
                mostrarMensaje(2, _this.idioma.lbMsgEliminar2, function(btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait('Eliminando datos', 'Por favor espere...' || '...');
                        // Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
                        var sm = _this.gpPrincipal.getSelectionModel().selections;
                        for (var i = 0; i < sm.items.length; i++) {
                            datidexpediente.push(sm.items[i].data.idexpediente);
                        }
                        Ext.Ajax.request({
                            url: 'getEliminarDocExpedinte',
                            method: 'POST',
                            params: {
                                idregnumerico: _this.dataregnumerico.data.idregnumerico,
                                datidexpediente: Ext.encode(datidexpediente)
                            },
                            callback: function(options, success, response) {
                                var rd = Ext.decode(response.responseText);
                                if (rd.msg == 1) {
                                    Ext.MessageBox.hide();
                                    mostrarMensaje(1, _this.idioma.MsgEliminarConfirmacion);
                                    _this.getStorePrincipal().load();
                                }
                            }
                        });
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'informe',
            disabled: false,
            text: _this.idioma.btnInscripcion,
            tooltip: _this.idioma.lbTtInscripcion,
            handler: function() {
                var winInscripcion = new Ext.LOG.moduloMedio.winInscripcionModulo({
                    idioma: _this.idioma,
                    text: _this.idioma.lbTtInscripcion,
                    width: 700,
                    idregnumerico: _this.dataregnumerico.data.idregnumerico,
                    datregnum: _this.dataregnumerico

                });
                winInscripcion.show();
                winInscripcion.getInscripcion();
            },
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'informe',
            disabled: false,
            text: _this.idioma.btnInscripcionRegimen,
            tooltip: _this.idioma.lbTtInscripcionRegimen,
            handler: function() {
                var winInscripcion = new Ext.LOG.moduloMedio.winInscripcionModulo({
                    idioma: _this.idioma,
                    text: _this.idioma.btnInscripcionRegimen,
                    width: 700,
                    idregnumerico: _this.dataregnumerico.data.idregnumerico,
                    datregnum: _this.dataregnumerico,
                    camRegimen: true

                });
                winInscripcion.show();
                winInscripcion.getInscripcion();
            },
        }));

    },
    render: function() {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.confExpedienteGrid.superclass.render.call(this);
        
        this.getStorePrincipal().on({
            'beforeload':function(st){
                st.initBaseParams.idexpinmueble = _this.dataregnumerico.data.idregnumerico;
            },
            'load': function (st){
                var culminado = false
                    if (_this.dataregnumerico.data.denominacioncolumnareporte == "constAloj"
                            || _this.dataregnumerico.data.denominacioncolumnareporte == "ingenieria") {
                        _this.listaBotones.getItem(2).disable();
                        _this.listaBotones.getItem(3).disable();
                       /* _this.btnInscipcion.disable();
                        _this.btnInscipcionRegimen.disable();*/
                    } else {
                        for (var i = 0; i < st.data.items.length; i++) {
                            if (st.data.items[i].data.culminacion == 1) {
                                culminado = true;
                                _this.listaBotones.getItem(2).enable();
                                _this.listaBotones.getItem(3).enable();
                               /* _this.btnInscipcion.enable();
                                _this.btnInscipcionRegimen.enable()*/
                                break;
                            }
                        }
                        
                        if (culminado == false) {
                            _this.listaBotones.getItem(2).disable();
                            _this.listaBotones.getItem(3).disable();
                            /*_this.btnInscipcion.disable();
                            _this.btnInscipcionRegimen.disable();*/
                        }
                    }
            }
        });
        this.getStorePrincipal().load({
            params: {
                objetoobra: (_this.objetoobra) ? _this.objetoobra : false,
                interfazNrodinventario: 1,
                idarea: _this.idarea,
            }
        });
        this.smGridPrincipal.on({
            'rowselect': function(sm) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.listaBotones.getItem(1).enable();
                    // _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.listaBotones.getItem(1).disable();
                    // _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            },
            'rowdeselect': function(sm) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.listaBotones.getItem(1).enable();
                    //_this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.listaBotones.getItem(1).disable();
                    //_this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });        
        this.gpPrincipal.on({
            'rowclick': function(grid, rowIndex, e) {
                if (_this.smGridPrincipal.getCount() > 0) {

                    if (_this.idExpInmuebleSeleccionado != _this.smGridPrincipal.getSelected().get('idexpdocumento')) {
                        var record = _this.smGridPrincipal.getSelected();

                        if (record) {
                            _this.llavesForaneas = Array();
                            _this.llavesForaneas[0] = {
                                key: 'idexpdocumento',
                                value: record.get('idexpdocumento')
                            };
                            _this.ar_where = 'idexpdocumento = ' + record.get('idexpdocumento');
                        } else {
                            throw 'Record no seleccionado';
                        }
                       
                        //_this.scopGrid.gpPropertyGrid.setContenido([record.get('idtabla')]);
                        if (record.get('idtabla') != -1)
                            _this.scopGrid.panelAD.expand();
                        else
                            _this.scopGrid.panelAD.collapse();
                        _this.idExpInmuebleSeleccionado = record.get('idexpdocumento');
                    }
                }
            }
        });

        return vista;
    },
});

Ext.LOG.moduloMedio.confExpediente = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        config.resizable = false;
        this.usarAplicar = false;
        this.idioma = config.idioma;
        this.layout = 'fit';
        this.dataregnumerico = config.dataregnumerico;
        this.identidad = this.identidad;
        this.tree = this.tree;
        this.idarea = this.idarea;
        // this.gridCEntral = config.gridCEntral;
        Ext.LOG.moduloMedio.confExpediente.superclass.constructor.call(this, config);
        Ext.LOG.moduloMedio.confExpediente.regimen = 0;
        Ext.LOG.moduloMedio.confExpediente.regimenValue = null;
        Ext.LOG.moduloMedio.confExpediente.regim = null;
        this.setTitle(this.idioma.btnConformarexpediente);
        this.panelDatos();        
        this.bodyStyle = 'padding:5px 5px 0';
        this.modal = true;
        this.collapsible = true;
        this.layout = 'border';

        this.width = 445;
        this.height = 130;
        var _this = this;
        this.nroinventario = (_this.dataregnumerico.data.nroinventario != null) ? _this.dataregnumerico.data.nroinventario : "_",
                this.denominacion = (_this.dataregnumerico.data.denominacion) ? _this.dataregnumerico.data.denominacion : "_",
                this.valorcontable = (_this.valorcontable) ? _this.valorcontable : "_";

    },
    initComponent: function(config) {
        var _this = this;
        Ext.LOG.moduloMedio.confExpediente.superclass.initComponent.call(this);
        _this.listaBotones.getItem(1).disable();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {               
                 var activar = 0;
                        if (this.gridCenter.getStorePrincipal().data.items.length == 0) {
                            activar = 0;
                        } else {
                            for (var i = 0; i < this.gridCenter.getStorePrincipal().data.items.length; i++) {
                                if (this.gridCenter.getStorePrincipal().data.items[i].data.culminacion == 1) {
                                    activar = 1;
                                    break;
                                }
                            }
                        }
                        
                if (_this.dataregnumerico.data.estaentidad == 0) {
                    var regimen = null;
                    if (!_this.comboRegimen.getValue() && _this.comboRegimen.getRawValue()) {
                        regimen = Ext.LOG.moduloMedio.confExpediente.regim;
                    }
                    if (!_this.comboRegimen.getValue() && !_this.comboRegimen.getRawValue()) {
                        regimen = null
                    }
                }
                       
                        Ext.Ajax.request({
                            url: 'getConformarDocExpediente',
                            method: 'POST',
                            params: {
                                idregnumerico: _this.dataregnumerico.data.idregnumerico,
                                regcontable: (_this.checkRegistro.getValue()) ? 1 : 0,
                                areaatencion: (_this.checkAreaAtencion.getValue()) ? 1 : 0,
                                addfecha: activar,                                
                                cmbregimen: (_this.comboRegimen.getValue()) ? _this.comboRegimen.getValue() : null,
                            },
                            callback: function(options, success, response) {
                                var rd = Ext.decode(response.responseText);
                                if (rd.msg == 1) {
                                    mostrarMensaje(1, _this.idioma.MsgConformarExpediente);
                                    _this.close();
                                    _this.tree.getStore().reload({
                                        idarea: _this.idarea,
                                        start: Ext.LOG.moduloMedio.start,
                                        limit: Ext.LOG.moduloMedio.limit
                                    });
                                    //_this.stDocExpInmueble.load();
                                }
                            }
                        });
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                _this.scope.keyMap.stopEvent = false;
                this.close();
            }
        });
    },
    panelDatos: function() {
        var _this = this;
        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.clsPanelfieluno = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });

        this.clsPanelfieldos = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        _this.nroinventario = (_this.dataregnumerico.data.nroinventario != null) ? _this.dataregnumerico.data.nroinventario : "_",
                _this.denominacion = (_this.dataregnumerico.data.denominacion) ? _this.dataregnumerico.data.denominacion : "_",
               // _this.nromatricula = (_this.dataregnumerico.data.nromatricula) ? _this.dataregnumerico.data.nromatricula : "_",
                _this.valorcontable = (_this.valorcontable) ? _this.valorcontable : "_";

        this.clsPanelfieluno.addComponent({html: _this.idioma.lbHtml2});
        this.clsPanelfieluno.addComponent({html: "<p><div id='divdescripcion'>" + _this.denominacion + "</div></p>"});

        this.clsPanelfieluno.addComponent({html: _this.idioma.lbHtml1});
        this.clsPanelfieluno.addComponent({html: "<p><div id='divdescripcion'>" + _this.valorcontable + "</div></p>"});

        this.clsPanelfieluno.addComponent(new Ext.Panel({
            height: 18
        }));
        this.clsPanelfieluno.addComponent(new Ext.Panel({
            height: 18
        }));
        this.clsPanelfieluno.addComponent(new Ext.Panel({
            height: 18
        }));
        this.clsPanelfieluno.addComponent(new Ext.Panel({
            height: 18
        }));

        this.clsPanelfieluno.addComponent({html: _this.idioma.lbHtml3});
        this.clsPanelfieluno.addComponent({html: "<p><div id='divdescripcion'>" + _this.nroinventario + "</div></p>"});

        this.clsPanelfieluno.addComponent(new Ext.Panel({
                height: 18
            }));
        this.clsPanelfieluno.addComponent(new Ext.Panel({
                height: 18
            }));
        this.clsPanelfieluno.addComponent(new Ext.Panel({
            height: 12
        }));
        this.comboRegimen = new LOG.util.ComboBox({
            url: 'getCargarRegimen',
            hiddenName: 'idregimen',
            valueField: 'idregimen',
            disabled: true,
            displayField: 'denominacion',
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            typeAhead: true,
            resizable: true,
            emptyText: _this.idioma.lbSeleccione,
            fieldLabel: _this.idioma.lbRegimen,
            editable: false
        });

        this.comboRegimen.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
                Ext.LOG.moduloMedio.confExpediente.regimen += 1;
                if (Ext.LOG.moduloMedio.confExpediente.regimen > 1) {
                    st.baseParams.cargartodo = "cargartodo";
                }
            },
            'load': function(st) {
                var cant = st.data.items.length;
                if (_this.dataregnumerico.data.estaentidad == 0) {
                    _this.comboRegimen.disable();
                }
                if (st.data.items.length == 1) {
                    Ext.LOG.moduloExpediente.confExpediente.regim = rd.data[0].idregimen;
                }
                _this.comboRegimen.setRawValue((cant == 1) ? st.data.items[0].data.denominacion : _this.idioma.lbSeleccione);

            }
        });

        _this.checkRegistro = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbRegistroCont,
            hideLabel: true,
            name: 'regcontable'
        });

        _this.checkAreaAtencion = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbAreaAtencion,
            hideLabel: true,
            name: 'areatencion'
        });

        this.clsPanelfieldos.addComponent(this.comboRegimen);
        this.clsPanelfieldos.addComponent(_this.checkRegistro);
        this.clsPanelfieldos.addComponent(new Ext.Panel({
            height: 12
        }));
        this.clsPanelfieldos.addComponent(_this.checkAreaAtencion);

        this.clsPanel.addComponent(new Ext.form.FieldSet({
            title: _this.idioma.lbDatosMedio,
            autoHeight: true,
            items: [this.clsPanelfieluno]
        }));
        this.clsPanel.addComponent(new Ext.form.FieldSet({
            title: _this.idioma.lbDetalles,
            autoHeight: true,
            items: [this.clsPanelfieldos]
        }));

        _this.gridCenter = new Ext.LOG.moduloMedio.confExpedienteGrid({
            idioma: _this.idioma,
            scopGrid: _this,
            identidad: _this.identidad,
            dataregnumerico: _this.dataregnumerico
        });
        _this.gridCenter.init();
        var show = _this.gridCenter.view();
        show.height = 700;
        
        this.panelAD = new Ext.Panel({
            region: 'east',
            width: 300,
            layout: 'fit',
            border: true,
            collapsible: true,
            split: true,
            collapseMode: 'mini',
            collapsed: true
        });
        
        this.gpPropertyGrid = new Ext.grid.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            editable: (_this.dataregnumerico.data.estaentidad == 0) ? false : true,
            listeners: {
                'show': function(propertyGrid) {
                    _this.panelAD.add(propertyGrid);
                    _this.panelAD.doLayout(true);
                }
            },
            preOperacion: function() {
                var record = _this.gridCenter.smGridPrincipal.getSelected();
                if (record) {
                    this.llavesForaneas = Array();
                    this.llavesForaneas = _this.llavesForaneas;
                    this.idtabla = record.get('idtabla');
                    this.ar_where = _this.ar_where;
                } else {
                    throw 'Record no seleccionado'
                }
            }
        });
        this.panelCenter = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            layout: 'form',
            title: _this.idioma.lbTitleDocExpInmueble,
            anchor: '98%',
            autoHeight: true,
            defaults: {
                anchor: '100%',
                msgTarget: 'side'
            },
           /* listeners: {
                 'clientvalidation': function(fp, valid) {
                    var checkdirty = false;
                    _this.panelCenter.getForm().items.each(function(field) {
                        console.info(field);
                        console.info(valid);
                        console.info("----------");
                        if (field.isDirty() && valid) {
                            checkdirty = true;
                            _this.listaBotones.getItem(2).enable();
                        }
                    });
                    if (!checkdirty) {
                       _this.listaBotones.getItem(1).disable();
                    }
                }
            },*/
            
            items: [show, this.clsPanel,this.panelAD]
        });

        this.add(this.panelCenter);
        this.cargarCheckBox();
        this.getIdespecialidadRegimen();
        this.getDesactivarButton(_this.dataregnumerico);
    },
    cargarCheckBox: function() {
        var _this = this;
        Ext.Ajax.request({
            url: 'getCargarCheckBox',
            method: 'POST',
            params: {
                idregnumerico: _this.dataregnumerico.data.idregnumerico
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (_this.dataregnumerico.data.estaentidad == 0) {
                    _this.checkRegistro.disable();
                    _this.checkAreaAtencion.disable();
                }                
                if (rd.datos[0].registrocontable == 1) {
                    _this.checkRegistro.setValue(true);
                    _this.checkRegistro.originalValue = 1;
                } else {
                    _this.checkRegistro.setValue(false);
                     _this.checkRegistro.originalValue = 0;
                }
                if (rd.datos[0].areaatencion == 1) {
                    _this.checkAreaAtencion.setValue(true);
                    _this.checkAreaAtencion.originalValue = 1;
                } else {
                   _this.checkAreaAtencion.setValue(false);
                   _this.checkAreaAtencion.originalValue = 1;
                }

            }
        });
    },
    getIdespecialidadRegimen: function(){
        var _this = this;
        Ext.Ajax.request({
            url: 'getIdespecialidadRegimen',
            method: 'POST',
            params: {
                idespecialidad: _this.dataregnumerico.data.idespecialidad
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                
                if (rd.codespecialidad != 02) {
                    _this.comboRegimen.disable();
                } else {
                    _this.comboRegimen.enable();
                }
            }
        });
    },
    getDesactivarButton: function(storedata) {        
        if (storedata.data.estaentidad == 0) {
            this.gridCenter.listaBotones.getItem(1).disable();
            this.gridCenter.listaBotones.getItem(0).disable();
            this.gridCenter.listaBotones.getItem(2).disable();
            this.gridCenter.listaBotones.getItem(3).disable();
            
           /* this.btnAdd.disable();
            this.btnInscipcion.disable();
            this.btnInscipcionRegimen.disable();*/
        }
    }
    
});

Ext.LOG.moduloMedio.winDocExpedienteModulo = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        this.autoLoad = false;
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = false;
        this.modoSeleccion = 3;
        this.datConfExp = config.datConfExp;
        this.idregnumerico = config.idregnumerico;
        this.storedata = config.storedata;
        this.identidad = config.identidad;
        this.modal = true;
        this.autoheight = true;
        this.closeAction = 'close';
        this.dirController = '/logistica/activos_fijos/modulo/index.php/gestmodulos';
        this.urlBusquedaGridPrincipal = 'cargardocumentos';
        Ext.LOG.moduloMedio.winDocExpedienteModulo.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = this.idioma.lbTitleDocExpediente;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(700, 400);

    },
    /*   init: function() {
     Ext.LOG.moduloMedio.winDocExpedienteModulo.superclass.init.call(this);
     var _this = this;
     this.getVistaPrincipal().onRender = this.getVistaPrincipal().onRender.createSequence(function() {
     _this.getVistaPrincipal().add({
     xtype: 'panel',
     frame: true,
     region: 'north',
     height: 30,
     html: _this.idioma.lbTextinformacion
     });
     });
     },*/
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.lbHederDescp,
            dataIndex: 'denominacion',
            sortable: false,
            width: 200,
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCulminacion,
            width: 100,
            dataIndex: 'culminacion',
            default: true,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        });
        this.addGridColumn({
            dataIndex: 'idexpediente',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idexpdocumento',
            default: true
        });
    },
    initDefaultButtons: function() {

        var _this = this;
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(1), {
            tooltip: _this.idioma.btnAplicar,
            disabled: true,
            iconCls: 'aplicar',
            handler: function() {

                Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                var datidexpediente = Array();
                if (_this.gpPrincipal.getSelectionModel().getSelected()) {
                    // _this.gpPrincipal.getSelectionModel().getSelected()
                    var sm = _this.gpPrincipal.getSelectionModel().selections;
                    for (var i = 0; i < _this.gpPrincipal.getSelectionModel().selections.items.length; i++) {
                        datidexpediente.push(_this.gpPrincipal.getSelectionModel().selections.items[i].data.idexpediente);
                    }
                    Ext.Ajax.request({
                        url: 'getAddDocExpedinte',
                        method: 'POST',
                        params: {
                            idregnumerico: _this.idregnumerico,
                            datidexpediente: Ext.encode(datidexpediente)
                        },
                        callback: function(options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            if (rd.msg == 1) {
                                //_this.vistaPrincipal.close();
                                for (var i = 0; i < _this.datConfExp.gpPrincipal.getSelectionModel().selections.items.length; i++) {
                                    datidexpediente.push(_this.datConfExp.gpPrincipal.getSelectionModel().selections.items[i].data.idexpediente);
                                }
                                _this.datConfExp.getStorePrincipal().load();
                                mostrarMensaje(1, _this.idioma.MsgAddConfirmacion);
                                _this.getStorePrincipal().load({
                                    params: {
                                        accrfgfdgion: "aplicar",
                                        idregnumerico: _this.idregnumerico,
                                        idexpedienteactivoAplicar: Ext.encode(datidexpediente),
                                        start: 0,
                                        limit: 20
                                    }
                                });
                                Ext.getBody().unmask();
                            } else {
                                Ext.getBody().unmask();
                            }
                        }
                    });
                }
            }
        });

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            tooltip: _this.idioma.lbTtBtnAplicar,
            iconCls: 'aceptar',
            disabled: true,
            handler: function() {
                Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                var datidexpediente = Array();
                if (_this.gpPrincipal.getSelectionModel().getSelected()) {
                    // _this.gpPrincipal.getSelectionModel().getSelected()
                    var sm = _this.gpPrincipal.getSelectionModel().selections;
                    for (var i = 0; i < _this.gpPrincipal.getSelectionModel().selections.items.length; i++) {
                        datidexpediente.push(_this.gpPrincipal.getSelectionModel().selections.items[i].data.idexpediente);
                    }
                    Ext.Ajax.request({
                        url: 'getAddDocExpedinte',
                        method: 'POST',
                        params: {
                            idregnumerico: _this.idregnumerico,
                            datidexpediente: Ext.encode(datidexpediente)
                        },
                        callback: function(options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            if (rd.msg == 1) {
                                _this.vistaPrincipal.close();
                                _this.datConfExp.getStorePrincipal().load();
                                mostrarMensaje(1, _this.idioma.MsgAddConfirmacion);
                                Ext.getBody().unmask();
                            } else {
                                Ext.getBody().unmask();

                            }
                        }
                    });
                }
            }
        });
    },
    render: function() {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.winDocExpedienteModulo.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function(store) {
                var idexpdocumento = Array();
                var idexpediente = Array();
                store.initBaseParams.docexpediente = "docExp";
                store.initBaseParams.idregnumerico = _this.idregnumerico;

                if (_this.storedata.items.length > 0) {
                    for (var i = 0; i < _this.storedata.items.length; i++) {
                        idexpediente.push(_this.storedata.items[i].data.idexpediente);
                    }
                    store.initBaseParams.idexpedienteactivo = Ext.encode(idexpediente);
                }
            },
            'load': function(store, obj) {
                if (store.data.items.length == 0) {
                    mostrarMensaje(1, _this.idioma.MsgAddExpedienteNull);
                    Ext.getBody().unmask();
                }
            }
        });

        _this.smGridPrincipal.on({
            'rowselect': function(sm) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).enable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            },
            'rowdeselect': function(sm) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).enable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        _this.getStorePrincipal().load();
        return vista;
    }
});

Ext.LOG.moduloMedio.winInscripcionModulo = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        config.resizable = false;
        this.usarAplicar = false;
        this.idioma = config.idioma;
        this.layout = 'fit';
        this.idregnumerico = config.idregnumerico;
        this.datregnum = config.datregnum;
        Ext.LOG.moduloMedio.winInscripcionModulo.superclass.constructor.call(this, config);
        this.setTitle(this.text);
        this.panelDatos();
        this.height = 180;
        this.modal = true;
        this.layout = 'border';
        var _this = this;
    },
    initComponent: function(config) {
        var _this = this;
        Ext.LOG.moduloMedio.winInscripcionModulo.superclass.initComponent.call(this);
        _this.listaBotones.getItem(1).hide();

        LOG.util.UIManager.apply(_this.listaBotones.getItem(1), new LOG.util.Prototipos.botonLimpiar({
            tooltip: 'Limpiar filtro(s)',
            disabled: true,
            handler: function() {
                var form = this.scope.panelCenter.getForm();
                form.items.each(function(field) {
                    if (field.isFormField) {
                        field.reset();
                        field.setValue("");
                    }
                });
            }
        }));

        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                var parametros = {};

                if (this.panelCenter.getForm().isValid() && !this.listaBotones.getItem(2).disabled) {
                    if (this.panelCenter.getForm().isValid() && this.finca.valido) {
                        Ext.MessageBox.wait(_this.idioma.lbMsgCargandoDatos, 'Por favor espere...' || '...');
                        var parametros = {};

                        parametros = {
                            idregnumerico: _this.idregnumerico,
                            tomo: this.tomo.getValue(),
                            folio: this.folio.getValue(),
                            finca: this.finca.getValue(),
                            idseccion: (this.comboSeccion.getValue()) ? this.comboSeccion.getValue() : null,
                            nroresolucion: this.resolucion.getValue(),
                            fechainscripcion: this.fechainserpcion.getValue(),
                            iddptprovincia: (this.comboprovincia.getValue()) ? this.comboprovincia.getValue() : null,
                            iddptmunicipio: (this.combomunicipios.getValue() && this.combomunicipios.getValue() != 'Seleccione...') ? this.combomunicipios.getValue() : null,
                            modregimen: (_this.camRegimen) ? 1 : 0
                        }
                        Ext.Ajax.request({
                            url: 'getAddInscripcion',
                            method: 'POST',
                            params: {
                                params: Ext.encode(parametros)
                            },
                            callback: function(options, success, response) {
                                var rd = Ext.decode(response.responseText);
                                if (rd.msg == 1) {
                                    mostrarMensaje(1, _this.idioma.MsgConformarExpediente);
                                    Ext.MessageBox.hide();
                                    _this.close();
                                }
                            }
                        });
                    }
                    else {
                        mostrarMensaje(1, _this.idioma.lbCamposIncorrectos);
                        return;
                    }
                }
            }
        });

    },
    getInscripcion: function() {
        var _this = this;
        Ext.MessageBox.hide();
        Ext.MessageBox.wait(_this.idioma.lbMsgCargandoDatos, 'Por favor espere...' || '...');
        Ext.Ajax.request({
            url: 'getCargarInscripcion',
            method: 'POST',
            params: {
                idregnumerico: _this.idregnumerico,
                modregimen: (_this.camRegimen) ? 1 : 0
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                // console.info(rd);return;
                if (rd.datos) {
                    _this.tomo.setValue(rd.datos.tomo);
                    _this.tomo.originalValue = _this.tomo.getValue();
                    _this.folio.setValue(rd.datos.folio);
                    _this.folio.originalValue = _this.folio.getValue();
                    _this.finca.setValue(rd.datos.finca);
                    _this.finca.originalValue = _this.finca.getValue();
                    _this.comboSeccion.setValue(rd.datos.idseccion);
                    _this.comboSeccion.setRawValue(rd.datos.denominacion);
                    _this.comboSeccion.originalValue = _this.comboSeccion.getValue();
                    _this.resolucion.setValue(rd.datos.nroresolucion);
                    _this.resolucion.originalValue = _this.resolucion.getValue();
                    _this.fechainserpcion.setValue(rd.datos.fechainscripcion);
                    _this.fechainserpcion.originalValue = _this.fechainserpcion.getValue();
                    _this.comboprovincia.setValue(rd.datos.iddptprovincia);
                    _this.comboprovincia.setRawValue(rd.datos.provincia);
                    _this.comboprovincia.originalValue = _this.comboprovincia.getValue();
                    _this.combomunicipios.setValue(rd.datos.iddptmunicipio);
                    _this.combomunicipios.setRawValue(rd.datos.municipio);
                    _this.combomunicipios.originalValue = _this.combomunicipios.getValue();
                    Ext.MessageBox.hide();
                } else {
                    Ext.MessageBox.hide();
                }
            }
        });
    },
    panelDatos: function() {
        var _this = this;

        this.tomo = new LOG.util.Prototipos.inputTexto({
            maxLength: '30',
            maskRe: /^[0-9]/,
            name: 'tomo',
            allowBlank: false,
            disabled: false,
            fieldLabel: _this.idioma.lbTomo
        });

        this.folio = new LOG.util.Prototipos.inputTexto({
            maxLength: '30',
            maskRe: /^[0-9]/,
            name: 'folio',
            allowBlank: false,
            disabled: false,
            fieldLabel: _this.idioma.lbFolio
        });

        this.finca = new LOG.util.Prototipos.inputTexto({
            maxLength: '50',
            disabled: false,
            name: 'finca',
            fieldLabel: _this.idioma.lbFinca,
            listeners: {
                'valid': function(field) {
                    field.valido = true;
                    if (field.getValue().charAt(0) == ' ') {
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                        field.valido = false;
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                        field.valido = false;
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbContenidoErroneo);
                                    field.valido = false;
                                }
                            }

                        }
                    }
                }
            }
        });

        this.resolucion = new LOG.util.Prototipos.inputTexto({
            maxLength: '30',
            maskRe: /^[0-9]/,
            name: 'nroresolucion',
            allowBlank: false,
            disabled: false,
            fieldLabel: _this.idioma.lbResolucion
        });

        this.fechainserpcion = new Ext.form.DateField({
            maxLength: '11',
            name: 'fechainscripcion',
            disabled: false,
            allowBlank: false,
            //maskRe: /^[0-9]/,
            fieldLabel: _this.idioma.lbFechaInserpcion
        });

        this.comboprovincia = new LOG.util.ComboBox({
            url: 'getCargarProvincias',
            hiddenName: 'iddptprovincia',
            valueField: 'iddpt',
            disabled: true,
            displayField: 'denominacion',
            mode: 'local',
            listWidth: 300,
            minChars: 0,
            resizable: true,
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            typeAhead: true,
            emptyText: 'Seleccione....',
            fieldLabel: _this.idioma.lbProvincia,
            editable: false,
            listeners: {
                'select': function(combo, record, index) {
                    _this.combomunicipios.reset();
                    _this.combomunicipios.enable();
                    _this.combomunicipios.getStore().load({
                        params: {
                            accion: "municipio",
                            idpadre: combo.getValue()
                        }
                    });
                    _this.combomunicipios.setValue(" ");
                    _this.combomunicipios.setRawValue(" ");
                }
            }
        });
        this.comboprovincia.getStore().on({
            'load': function(store, records) {
                if (store.data.items.length > 0) {
                    _this.comboprovincia.enable();
                }
            }
        });

        this.combomunicipios = new LOG.util.ComboBox({
            url: 'getCargarProvincias',
            hiddenName: 'idmunicipioviv',
            valueField: 'iddpt',
            autoLoad: false,
            disabled: true,
            displayField: 'denominacion',
            mode: 'local',
            listWidth: 300,
            minChars: 0,
            resizable: true,
            allowBlank: true,
            // emptyText: 'Seleccione...',
            fieldLabel: _this.idioma.lbMunicipio,
            editable: false
        });
        this.combomunicipios.getStore().on({
            'load': function(store, records) {
                var cant = store.data.items.length;
                _this.combomunicipios.setValue((cant >= 1) ? store.data.items[0].data.iddpt : _this.idioma.lbSeleccione);
            }
        });
        //_this.combomunicipios.getStore().load();

        this.comboSeccion = new LOG.util.ComboBox({
            url: 'getCargarSeccion',
            hiddenName: 'idseccion',
            valueField: 'idseccion',
            autoLoad: false,
            disabled: true,
            displayField: 'denominacion',
            mode: 'local',
            listWidth: 300,
            minChars: 0,
            resizable: true,
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            typeAhead: true,
            emptyText: 'Seleccione....',
            fieldLabel: _this.idioma.lbSeccion,
            editable: false
        });
        this.comboSeccion.getStore().on({
            'load': function(store, records) {
                if (store.data.items.length > 0) {
                    _this.comboSeccion.enable();
                }
            }
        });
        this.comboSeccion.getStore().load();
        if (_this.datregnum.data.estaentidad == 0) {
            _this.tomo.disable();
            _this.folio.disable();
            _this.finca.disable();
            _this.resolucion.disable();
            _this.fechainserpcion.disable();
            _this.comboprovincia.disable();
            _this.combomunicipios.disable();
            _this.listaBotones.getItem(2).disable();
            _this.listaBotones.getItem(2).disable();
            _this.comboSeccion.disable();

        }
        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        this.clsPanel.addComponent(_this.tomo);
        this.clsPanel.addComponent(_this.folio);
        this.clsPanel.addComponent(_this.finca);
        this.clsPanel.addComponent(_this.resolucion);
        this.clsPanel.addComponent(_this.fechainserpcion);
        this.clsPanel.addComponent(_this.comboprovincia);
        this.clsPanel.addComponent(_this.combomunicipios);
        this.clsPanel.addComponent(_this.comboSeccion);
        this.panelCenter = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            layout: 'form',
            anchor: '98%',
            autoWith: true,
            autoHeight: true,
            // bodyStyle: 'padding: 10px 10px 0 10px; margin-bottom:10px',
            // labelWidth: 50,
            defaults: {
                anchor: '100%',
                msgTarget: 'side'
            },
            listeners: {
                'clientvalidation': function(fp, valid) {
                    var checkdirty = false;

                    fp.getForm().items.each(function(field) {
                        if (field.isDirty() && valid) {
                            checkdirty = true;
                            _this.listaBotones.getItem(2).enable();
                            _this.listaBotones.getItem(1).enable();
                        }
                    });
                    if (!checkdirty) {
                        _this.listaBotones.getItem(2).disable();
                        _this.listaBotones.getItem(1).enable();
                    }
                }
            },
            items: [this.clsPanel]
        });
        this.add(this.panelCenter);
    },
});