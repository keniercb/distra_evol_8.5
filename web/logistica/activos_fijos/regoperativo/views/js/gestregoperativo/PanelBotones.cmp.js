Ext.ns('Ext.LOG.RegNumOperativo');
Ext.LOG.RegNumOperativo.PanelBotones = Ext.extend(Ext.Panel,    {
    dirController:'/logistica/activos_fijos/regoperativo/index.php/gestregoperativo',
    border : false,
    bodyBorder : false,
    tipo_area_seleccionada : 'entidad',    
    id_entidad_seleccionada: null,
    myMaskk: new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando datos...'}),
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.listaAcciones = new LOG.util.List(config.acciones_reportes);
        this.region = 'north';
        _this.plugins = new Array();
        for (var i = 0; i < arrCampos.length; i++) {
            _this.attatchPlugin(arrCampos[i]);
        }
        _this.crearBotones();
        _this.bbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar,_this.btnImportarListado, _this.btnOrganigrama, _this.Documento, _this.btnClonar, _this.btnPlantilla, _this.btnVista, '->', _this.btnConfiguracion, _this.btnAyuda];
        _this.keymap = new Ext.KeyMap(document, [
            {key: 73,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (!Ext.WindowMgr.getActive()) {
                        _this.btnAddNuevoReg.handler();
                    }
                },
                scope: this
            },
            {key: 77,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (!Ext.WindowMgr.getActive())
                        _this.btnModificar.handler();
                },
                scope: this
            },
            {key: 'p',
                ctrl: false,
                alt: true,
                shift: true,
                stopEvent: true,
                fn: function()
                {
                    if (!Ext.WindowMgr.getActive())
                        _this.btnAddPlanReg.handler();
                },
                scope: this
            },
            {
                key: 46,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function()
                {
                    if (!Ext.WindowMgr.getActive())
                        _this.btnEliminar.handler();
                },
                scope: this
            },
            {
                key: 77,
                ctrl: true,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (!Ext.WindowMgr.getActive())
                        _this.btnOrganigrama.handler();
                },
                scope: this
            }, {
                key: 68,
                ctrl: true,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (!Ext.WindowMgr.getActive())
                        _this.btnClonar.handler();
                },
                scope: this
            }
        ]);
        _this.keymap.stopEvent = true;
        _this.keymap.enable();
        Ext.LOG.RegNumOperativo.PanelBotones.superclass.constructor.apply(this, arguments);
    },
    crearBotones: function() {
        var _this = this;
        this.btnAddNuevoReg = {
            text: _this.idioma.lbnuevoregistro,
            iconCls: 'adicionar',
            tooltip: _this.idioma.TooltbtnAddNuevoReg,
            hidden: !_this.grantedAction('btnAdicionarRegistro'),
            handler: function() {
                _this.onAdicionarMedios('adicionar');
            }
        };
        this.btnAddPlanReg = {
            text: _this.idioma.btnRegistroplantilla,
            iconCls: 'adicionar',
            hidden: !_this.grantedAction('btnAdicionarRegistroPlantilla'),
            tooltip: _this.idioma.TooltbtnAddPlanReg,
            handler: function() {
                _this.onAdicionarRegistroPlantilla();
            }
        };
        this.btnAdicionar = new Ext.Button({
            iconCls: 'adicionar',
            disabled: true,
            text: _this.idioma.btnAdicionar,
            hidden: !_this.grantedAction('btnAdicionarRegistroPlantilla') && !_this.grantedAction('btnAdicionarRegistro'),
            default: {iconCls: 'adicionar'},
            tooltip: _this.idioma.TooltbtnAdicionar,
            menu: [_this.btnAddNuevoReg, _this.btnAddPlanReg]
        });
        this.btnModificar = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            text: _this.idioma.btnModificar,
            hidden: !_this.grantedAction('btnModificarRegistro'),
            tooltip: _this.idioma.TooltbtnModificar,
            handler: function() {
                _this.onAdicionarMedios('modificar');
            }
        });
        this.btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            hidden: !_this.grantedAction('btnEliminarRegistro'),
            text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.TooltbtnEliminar,
            handler: function() {
                _this.onEliminarMedios();
            }
        });
        this.btnPlantilla = new Ext.Button({
            iconCls: 'duplicar',
            disabled: true,
            hidden: !_this.grantedAction('btnAdicionarPlantilla'),
            text: _this.idioma.btnPlantilla,
            tooltip: _this.idioma.TooltbtnPlantilla,
            handler: function() {
                _this.onCrearWinClonarPlantilla(true);
            }
        });
        this.btnClonar = new Ext.Button({
            iconCls: 'duplicar',
            disabled: true,
            text: _this.idioma.btnClonar,
            hidden: !_this.grantedAction('btnClonar'),
            tooltip: _this.idioma.TooltbtnClonar,
            handler: function() {
                _this.onCrearWinClonarPlantilla();
            }
        });
        this.btnOrganigrama = new Ext.Button({
            iconCls: 'estructura',
            disabled: true,
            hidden: !_this.grantedAction('btnOrganigrama'),
            text: _this.idioma.btnOrganigrama,
            tooltip: _this.idioma.btnTOrganigrama,
            handler: function() {
                _this.onOrganigramaMedios();
            }
        });
        this.Documento = new Ext.Button({
            iconCls: 'informe',
            disabled: true,
            hidden: !_this.grantedAction('btnAsociarNuevoDoc') && !_this.grantedAction('btnAsociarDoc'),
            text: _this.idioma.btnListadoDocumento,
            tooltip: _this.idioma.btnTtListadoDocumento,
            menu: [
                {
                    text: _this.idioma.btnAdicionarDocumentoNew,
                    iconCls: 'informe',
                    hidden: !_this.grantedAction('btnAsociarNuevoDoc'),
                    tooltip: _this.idioma.btnTTADDNewDocumento,
                    handler: function() {

                        if (procesorevaluacion == 'true') {
                            mostrarMensaje(3, _this.idioma.msgProcesoRevaluacion);
                        } else {


                            if (_this.validarRegistroParaDoc()) {
                                _this.getWinGestDocumento();
                            } else {
                                mostrarMensaje(1, _this.idioma.lbValidRegnumPadre)
                            }
                        }
                    }
                },
                {
                    text: _this.idioma.btnAdicionarDocumentoExist,
                    hidden: !_this.grantedAction('btnAsociarDoc'),
                    tooltip: _this.idioma.btnTTADDExistDocumento,
                    iconCls: 'informe',
                    handler: function() {
                        if (procesorevaluacion == 'true') {
                            mostrarMensaje(3, _this.idioma.msgProcesoRevaluacion);
                        } else {
                            if (_this.validarRegistroParaDoc()) {
                                _this.crearWinDocumento();
                            } else {
                                mostrarMensaje(1, _this.idioma.lbValidRegnumPadre)
                            }
                        }
                    }
                }
            ]
        });
        this.btnVista = new Ext.Button({
            iconCls: 'mostrar',
            disabled: false,
            hidden: !_this.grantedAction('btnVistaReg') && !_this.grantedAction('btnVistaPlantilla'),
            text: _this.idioma.btnVista,
            tooltip: _this.idioma.TooltbtnVista,
            menu: [
                {
                    text: _this.idioma.btnVistaRegistro,
                    iconCls: 'mostrar',
                    id: 'idbtnVistaRegistro',
                    hidden: !_this.grantedAction('btnVistaReg'),
                    disabled: true,
                    tooltip: _this.idioma.TooltbtnVistaRegistro,
                    handler: function() {
                        _this.cambiarVistaInterfaz('registroNumOperativo');
                    }
                },
                {
                    text: _this.idioma.btnVistaPlantilla,
                    iconCls: 'mostrar',
                    id: 'idbtnVistaPlantilla',
                    hidden: !_this.grantedAction('btnVistaPlantilla'),
                    tooltip: _this.idioma.TooltbtnVistaPlantilla,
                    handler: function() {
                        _this.cambiarVistaInterfaz('plantilla');
                    }
                }
            ]
        });
        this.btnConfiguracion = new AFT.util.ViewConfigCache.btnGuardarConfiguracionInterfaz({
            guardar: function() {
                var vista = "registroNumOperativo";
                this.guardarConfiguracion(vista, _this.treegrid)
            },
            resetear: function() {
                var vista = "registroNumOperativo";
                this.reestablecerValoresPredeterminados(vista);
                if (Ext.getCmp('idbtnVistaPlantilla').disabled == false) {
                    vista = "registroNumOperativo";
                } else {
                    vista = "plantilla";
                }
                _this.cambiarVistaInterfaz(vista);
            }
        });
        this.btnImportarListado = LOG.util.UIManager.createBtn({
            iconCls: 'importar',
            text: "<u>I</u>mportar",
            tooltip: "Importar listado de medios",
            key: {
                alt: true,
                ctrl: true,
                shift: false,
                key: 'I'
            },
            disabled: false,
            handler: function () {
                AFT.util.importarFileUploadField(_this);
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('btnImportarMedios')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        this.btnAyuda = LOG.util.Prototipos.botonAyuda({
            id: 'idregistroactivo'
        });
    },
    onClonarPlantilla: function(plantilla, valor, color) {
        var _this = this;
        var idregnumericoPadre = _this.treegrid.getSelectionModel().getSelected().data._parent;
        var parametros = {
            idregnumerico: _this.treegrid.getSelectionModel().getSelected().data.idregnumerico,
            color: color
        };
        (plantilla) ? parametros['denominacionplantilla'] = valor : parametros['cantidad'] = valor;
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: (!plantilla) ? _this.idioma.labClonando : _this.idioma.labPlantilla});
        myMask.show();
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/clonar',
            method: 'POST',
            timeout: '120000',
            params: parametros,
            callback: function(options, success, response) {
                response = Ext.util.JSON.decode(response.responseText);
                myMask.hide();
                if (response.codigoMsg == 3) {
                    mostrarMensaje(response.Msg, (plantilla) ? _this.idioma.MsgAdicionarPlantillaError : _this.idioma.MsgAdicionarClonarError);
                } else {
                    mostrarMensaje(1, (plantilla) ? _this.idioma.MsgAdicionarPlantillaOK : _this.idioma.MsgAdicionarClonarOK);
                    /*_this.treegrid.getSelectionModel().clearSelections();
                    _this.treegrid.getStore().baseParams = {};
                    _this.treegrid.getStore().load();*/
                    if (idregnumericoPadre) {
                        _this.treegrid.getStore().getById(idregnumericoPadre).store.load({
                            params: {
                                anode: idregnumericoPadre,
                                _id: null
                            },
                            callback: function () {
                                _this.treegrid.getStore().expandNode(_this.treegrid.getStore().getById(idregnumericoPadre));
                            }
                        });
                    } else {
                        _this.treegrid.getSelectionModel().clearSelections();
                        _this.treegrid.getStore().baseParams = {};
                        _this.treegrid.getStore().load()
                    }
                }
            }
        });
    },
    onCrearWinClonarPlantilla: function(plantilla) {
        var _this = this;
        if (!_this.treegrid.getSelectionModel().hasSelection()) {
            return;
        }
        var itemsWin = new Array();
        if (!plantilla) {
            var textVal = new Ext.form.NumberField({
                fieldLabel: _this.idioma.lbCantidad,
                minValue: 1,
                maxValue: 100,
                width:70,
                allowBlank: false,
                name: 'cantidad',
                anchor: '95%',
                maxLength: 100,
                regexText: _this.idioma.lbInvalidText,
                regex: /^[0-9]+$/,
                regexp: /^[0-9]+$/
            });
            var chDiferenciar = new Ext.form.Checkbox({
                boxLabel: _this.idioma.lbDiferenciarResult,
                name: 'diferenciarcolor',
                hideLabel: true,
                anchor: '95%',
                checked:true,
                cls: "clschkbModulo",
                disabled: false
            });
            itemsWin = [
                {
                    layout: 'column',
                    items:[{
                        columnWidth: .70,
                        layout: 'form',
                        labelWidth: 50,
                        items: [textVal
                        ]
                    }, {
                        columnWidth: .30,
                        layout: 'form',
                        items: [chDiferenciar
                        ]
                    }]
                }
            ];
        } else {
            var textVal = new Ext.form.TextField({
                fieldLabel: _this.idioma.lbCMDenominacion,
                regexText: _this.idioma.lbValorIncorrectoDenomAtributo,
                allowBlank: false,
                labelWidth: 50,
                width: 150,
                regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9\(\/]+([_/\s\)\/]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)+$/,
                maxLength: 100
            });
            itemsWin.push(textVal);

        }


        var form = new Ext.form.FormPanel({
            frame: true,
            items: itemsWin
        });
        _this.btnAceptarWinClonar = new Ext.Button({
            iconCls: 'aceptar',
            text: _this.idioma.btnAceptar,
            tooltip: _this.idioma.btnTAceptar,
            handler: function() {
                if (form.getForm().isValid()) {
                    var color = (chDiferenciar && chDiferenciar.getValue())?2:1;
                    _this.onClonarPlantilla(plantilla, textVal.getValue(), color);
                    _this.winClonar.close();
                } else {
                    mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                }
            }
        });
        _this.btnCancelarWinClonar = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.btnCancelar,
            tooltip: _this.idioma.btnTCancelar,
            handler: function() {
                _this.winClonar.close();
            }
        });
        _this.winClonar = new Ext.Window({
            width: 300,
            height: 130,
            constrain: true,
            title: (plantilla) ? _this.idioma.lbtitleplantilla : _this.idioma.lbtitleclonar,
            modal: true,
            resizable: false,
            frame: true,
            items: [form],
            buttons: [_this.btnCancelarWinClonar, _this.btnAceptarWinClonar],
            listeners: {
                'show': function() {
                    this.keymap.stopEvent = true;
                    this.keymap.enable();
                },
                'close': function() {
                    this.keymap.disable();
                }
            }
        });
        _this.winClonar.keymap = new Ext.KeyMap(document, [{
                key: 13,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this.winClonar) {
                        _this.btnAceptarWinClonar.handler();
                    }
                }
            }, {
                key: 88,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this.winClonar) {
                        _this.btnCancelarWinClonar.handler();
                    }
                }
            }]);
        _this.winClonar.show();
    },
    onAdicionarRegistroPlantilla: function() {
        var _this = this;
        _this.registro_plantilla = new Ext.LOG.RegNumOperativo.Registro_Plantilla({
            title: _this.idioma.lbWInAdicionarRegistroPlantilla,
            idioma: _this.idioma,
            treegrid: _this.treegrid

        });
        _this.registro_plantilla.show();
    },
    onAdicionarMedios: function(opcion, plantilla) {
        var _this = this;
        if (opcion == 'modificar' && !_this.treegrid.getSelectionModel().hasSelection()) {
            return;
        }
        var records = _this.treegrid.getSelectionModel().getSelections();
        if (!_this.ventanaAdicionarRegistro || !_this.ventanaAdicionarRegistro.isVisible()) {
            _this.ventanaAdicionarRegistro = new Ext.LOG.RegNumOperativo.VentataAdicionarRegistro({
                title: (opcion == 'adicionar') ? _this.idioma.lbTitleWInAdicionarRegistro : _this.idioma.lbTitleWInModificarRegistro,
                idioma: _this.idioma,
                closeAction: 'close',
                treegridPrincipal: _this.treegrid,
                recordTree: records,
                panelBotones:_this,
                acciones_reportes: _this.listaAcciones,
                plantilla: (plantilla) ? true : false,
                modificar: (opcion == 'adicionar') ? false : true,
                id_entidad_seleccionada: _this.id_entidad_seleccionada
            });
            _this.ventanaAdicionarRegistro.id_entidad_seleccionada = _this.id_entidad_seleccionada;
            _this.ventanaAdicionarRegistro.show();
            
        }
    },
    cambiarVistaInterfaz: function(caso) {
        var _this = this;
        switch (caso) {
            case 'plantilla':
                {
                    var panelContenTreeGrid = _this.viwport.items.items[1];
                    _this.btnAdicionar.setVisible(false);
                    _this.btnOrganigrama.setVisible(false);
                    _this.Documento.setVisible(false);
                    _this.btnModificar.handler = function() {
                        _this.onAdicionarMedios('modificar', true);
                    }
                    Ext.getCmp('idbtnVistaPlantilla').disable();
                    Ext.getCmp('idbtnVistaRegistro').enable();
                    this.treegrid = new Ext.LOG.RegNumOperativo.TreeGridRegistroNO({
                        region: 'center',
                        layout: 'fit',
                        idioma: _this.idioma,
                        parent: _this.viwport,
                        idarea: _this.idnodoSeleccionado,
                        plantilla: true,
                        url: 'cargarRegNumOperativo',
                        root_title: 'Plantillas',
                        fnHabilitarBotones: function() {
                            _this.viwport.habilitarBotonesPlantilla(_this.treegrid);
                        },
                        fnDesabilitarBotones: function() {
                            _this.viwport.desabilitarBotonesPlantilla(_this.treegrid);
                        },
                        scope: _this.viwport
                    });
                    this.btnClonar.hide();
                    this.btnPlantilla.hide();
                    this.treegrid.textfieldNoinventario.hidden = true;
                    Ext.getCmp('idlabelNoInvent').hide();
                    Ext.getCmp('idlabelestadoTec').hide();
                    this.treegrid.combEstadotecnico.hidden = true;
                    this.treegrid.btnBuscaravanzada.hidden = true;
                    this.treegrid.getColumnModel().getColumnById('idclminventario').hidden = true;
                    this.treegrid.getColumnModel().getColumnById('idclminventario').hideable = false;
                    this.treegrid.getColumnModel().getColumnById('idCOLfechaadq').hidden = true;
                    this.treegrid.getColumnModel().getColumnById('idCOLfechaadq').hideable = false;
                    this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hidden = false;
                    this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hideable = true;

                    this.treegrid.getSelectionModel().on('rowselect', function(SelectionModel, rowIndex, record) {
                        if (SelectionModel.getSelections() && SelectionModel.getSelections().length == 1) {
                            var idindicador = record.data.idindicador;
                            var idregnumerico = record.data.idregnumerico;
                            var idtabla = record.data.idtabla;
                            var arridtablas = record.data.arridtablas;
                            _this.viwport.propertyGrid.setContenido(idindicador, idregnumerico, idtabla, arridtablas);
                        } else {
                            _this.viwport.propertyGrid.setContenido();
                        }
                    });
                    this.treegrid.getSelectionModel().on('rowdeselect', function(SelectionModel, rowIndex, record) {
                        _this.viwport.propertyGrid.setContenido();
                    });
                    panelContenTreeGrid.remove(panelContenTreeGrid.items.keys[0]);
                    panelContenTreeGrid.add(this.treegrid);


                    break;
                }
            case 'registroNumOperativo':
                {
                    var panelContenTreeGrid = _this.viwport.items.items[1];
                    _this.viwport.panel_botones.btnAdicionar.setVisible(true);
                    _this.viwport.panel_botones.btnOrganigrama.setVisible(true);
                    _this.viwport.panel_botones.Documento.setVisible(true);
                    _this.btnModificar.handler = function() {
                        _this.onAdicionarMedios('modificar');
                    }

                    Ext.getCmp('idbtnVistaRegistro').disable();
                    Ext.getCmp('idbtnVistaPlantilla').enable();
                    this.treegrid = new Ext.LOG.RegNumOperativo.TreeGridRegistroNO({
                        idioma: _this.idioma,
                        parent: _this.viwport,
                        idarea: _this.idnodoSeleccionado,
                        url: 'cargarRegNumOperativo',
                        fnHabilitarBotones: function() {
                            _this.viwport.habilitarBotones(_this.treegrid);
                        },
                        fnDesabilitarBotones: function() {
                            _this.viwport.desabilitarBotones(_this.treegrid);
                        },
                        scope: _this.viwport,
                        enableDragDrop: true,
                        ddGroup: 'firstGridDDGroup'
                    });
                    this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hidden = true;
                    this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hideable = false;
                    this.btnClonar.show();
                    this.btnClonar.disable();
                    this.btnPlantilla.show();
                    this.btnPlantilla.disable();
                    this.treegrid.getSelectionModel().on('rowselect', function(SelectionModel, rowIndex, record) {
                        if (SelectionModel.getSelections() && SelectionModel.getSelections().length == 1) {
                            var idindicador = record.data.idindicador;
                            var idregnumerico = record.data.idregnumerico;
                            var idtabla = record.data.idtabla;
                            var arridtablas = record.data.arridtablas;
                            _this.viwport.propertyGrid.setContenido(idindicador, idregnumerico, idtabla, arridtablas);
                        } else {
                            _this.viwport.propertyGrid.setContenido();
                        }
                    });
                    this.treegrid.getSelectionModel().on('rowdeselect', function(SelectionModel, rowIndex, record) {
                        _this.viwport.propertyGrid.setContenido();
                    });
                    panelContenTreeGrid.remove(panelContenTreeGrid.items.keys[0]);
                    panelContenTreeGrid.add(_this.treegrid);
                    break;
                }
        }



        this.treegrid.on('render', function() {
            var dragzone = this.treegrid.getView().el.dom.childNodes[0].childNodes[1];
            this.firstGridDropTarget = new Ext.dd.DropTarget(dragzone, {
                ddGroup: 'firstGridDDGroup',
                copy: false,
                notifyDrop: function(ddSodurce, e, data) {
                    var origenes = _this.treegrid.getSelectionModel().getSelections();
                    var t = Ext.lib.Event.getTarget(e);
                    var rindex = _this.treegrid.getView().findRowIndex(t);
                    mostrarMensaje(2, "\xbfEst\xe1 seguro que desea modificar el(los) registro(s) seleccionado(s)\x3f", function (btn) {
                        if (btn == 'ok') {
                            Ext.getBody().mask('Procesando', 'x-mask-loading');


                            if (rindex !== false) {
                                var id_destino = _this.treegrid.getStore().getAt(rindex).get('idregnumerico');
                            } else {
                                var id_destino = null;
                            }
                            var ids_origen = new Array();
                            var ids_origenes_padres = new Array();
                            var i = 0;
                            while (i < origenes.length) {
                                if (origenes[i].data.idregnumerico != id_destino) {
                                    ids_origen[i] = origenes[i].data.idregnumerico;
                                    ids_origenes_padres[i] = origenes[i].data.idpadremodulo;

                                }
                                i += 1;
                            }

                            if (ids_origen.length > 0) {
                                _this.treegrid.getSelectionModel().selectRow(rindex);

                                Ext.Ajax.request({
                                    url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/crearModuloDrgDrop',
                                    method: 'POST',
                                    params: {
                                        ids_origen: Ext.encode(ids_origen),
                                        ids_origenes_padres: Ext.encode(ids_origenes_padres),
                                        id_destino: id_destino
                                    },
                                    callback: function (options, success, response) {
                                        Ext.getBody().unmask();
                                        if (success) {
                                            mostrarMensaje(1, 'El m&oacute;dulo ha sido modificado satisfactoriamente.');
                                            if (id_destino) {
                                                var objDestino = _this.treegrid.getStore().getById(id_destino);

                                                if(id_destino != objDestino.data.idpadremodulo){
                                                    var padreDestino = _this.treegrid.getStore().getById(objDestino.data.idpadremodulo);
                                                    padreDestino.store.load({
                                                        callback:function () {
                                                            _this.treegrid.getStore().expandNode(padreDestino);
                                                            _this.treegrid.getStore().expandNode(objDestino);
                                                        }
                                                    });
                                                }else {
                                                    _this.treegrid.getStore().load({
                                                        params: {
                                                            anode: null,
                                                            _id: null
                                                        },
                                                        callback:function () {
                                                            // _this.treegrid.getSelectionModel().selectRow(rindex);
                                                            _this.treegrid.getStore().expandNode(objDestino);
                                                        }
                                                    });
                                                }


                                            } else {
                                                _this.treegrid.getStore().load({
                                                    params: {
                                                        anode: id_destino,
                                                        _id: null
                                                    },
                                                    callback:function () {
                                                        _this.treegrid.getSelectionModel().clearSelections();
                                                    }
                                                });
                                            }

                                        } else {
                                            mostrarMensaje(3, 'El m&oacute;dulo no se ha podido modificar.');
                                        }
                                    }
                                });
                            } else {
                                Ext.getBody().unmask();
                            }
                            return (true);
                        }
                    });

                }.createDelegate(this)
            });
        }, this);
        _this.viwport.render();
        _this.viwport.doLayout();
        this.treegrid.getStore().load();
    },
    onEliminarMedios: function() {
        var _this = this;
        if (!_this.treegrid.getSelectionModel().hasSelection()) {
            return;
        }
        mostrarMensaje(2, _this.idioma.lbMsgEliminar2, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.labEliminando});
                var datosModulos = new Array();
                var modulosseleccionados = _this.treegrid.getSelectionModel().getSelections();
                for (var i = 0; i < modulosseleccionados.length; i++) {
                    datosModulos[i] = {
                        idregnumerico: modulosseleccionados[i].data.idregnumerico,
                        ordenizq: modulosseleccionados[i].data.ordenizqmodulo,
                        ordender: modulosseleccionados[i].data.ordendermodulo,
                        esmodulo: modulosseleccionados[i].data.esmodulo,
                        idtabla: modulosseleccionados[i].data.idtabla,
                        idarbol: modulosseleccionados[i].data.idarbolmodulo,
                        arridtablas: modulosseleccionados[i].data.arridtablas
                    }
                }
                myMask.show();
                Ext.Ajax.request({
                    url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/eliminarRegNumOperativo',
                    method: 'POST',
                    params: {
                        datosModulos: Ext.encode(datosModulos)
                    },
                    callback: function(options, success, response) {
                        response = Ext.util.JSON.decode(response.responseText);
                        _this.treegrid.getSelectionModel().clearSelections();
                        for (var j = 0;j< modulosseleccionados.length ; j++) {
                            var idregnumericoPadre = modulosseleccionados[j].data._parent;
                            if (idregnumericoPadre) {
                                _this.treegrid.getStore().getById(idregnumericoPadre).store.load({
                                    params: {
                                        anode: idregnumericoPadre,
                                        _id: null
                                    },
                                    callback: function () {
                                        _this.treegrid.getStore().expandNode(_this.treegrid.getStore().getById(idregnumericoPadre));
                                    }
                                });
                            } else {
                                _this.treegrid.getStore().load({
                                    params: {
                                        anode: null,
                                        _id: null
                                    },
                                    callback: function () {
                                        // _this.treegrid.getStore().expandAll();
                                    }
                                });
                            }
                        }

                        myMask.hide();
                        if (response.codigoMsg == 3)
                            mostrarMensaje(response.msg, _this.idioma.MsgEliminarModuloError);
                        else
                            mostrarMensaje(1, _this.idioma.MsgEliminarModuloOK);
                        // _this.treegrid.getSelectionModel().clearSelections();
                        // _this.treegrid.getStore().baseParams = {};
                        // _this.treegrid.getStore().load(/*{
                        //  params: {
                        //  idarearesp: _this.comboDeposito.getValue(),
                         //start: 0,
                         //limit: 20
                         // }
                         // }*/);
                    }
                });
            }
        }
    },
    crearWinDocumento: function() {
        var _this = this;
        var win = new Ext.aft.WinListadoDocumentos({
            tipo_area_seleccionada: _this.tipo_area_seleccionada,
            idarearesp: _this.idnodoSeleccionado,
            cargarArbolCompleto: true,
            identidad: _this.identidad,
            validar_usuario: 0,
            entidad: _this.entidad,
            closeAction: 'close',
            idestadoPorDefecto: 1,
            denomarearesp: _this.treegrid.comboDeposito.getRawValue(),
            idestructurapadre: (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.idnodoSeleccionado).attributes.id : _this.idnodoSeleccionado,
            columnasOcultar: [/*'iconodoc', */'cmestado', 'cmaprobadopor'],
            cmpOcultar: ['idcmboperacionesserv', 'idcmbestadoserv', 'idlabeloperacionserv', 'idlabelestadoserv'],
            filtros: {'idestado': 1},
            doAction: function(iddocumento) {
                _this.insertarRegNumDocumento(iddocumento, null, false);
            }
        });
        win.show();
    },
    insertarRegNumDocumento: function(iddocumento, nrodoc, nuevo) {
        var _this = this;
        var aregloReg = Array();
        var mMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Insertando datos...'});
        var records = _this.treegrid.getSelectionModel().getSelections();

        for (var i = 0; i < records.length; i++) {
            aregloReg.push({
                izquierdo: records[i].data.ordenizqmodulo,
                derecho: records[i].data.ordendermodulo,
                idregnumerico: records[i].data.idregnumerico,
                idarbol: records[i].data.idarbolmodulo,
                idprod: records[i].data.idprod
            });
        }

        /*se ordena el arreglo por id producto porque el metodo
         de que crea los movimiento los espera de forma ordenada
         metodo:crearMovDeDoc
         */
        var arregloRegistroOrdenadosIdProd = _this.OrdenarArregloporIDprod(aregloReg);
        console.info(arregloRegistroOrdenadosIdProd);
        mMask.show();
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/insertarRegNumDocumento',
            method: 'POST',
            params: {
                iddocumento: iddocumento,
                nuevo: nuevo,
                regnumericos: Ext.encode(arregloRegistroOrdenadosIdProd)

            },
            callback: function(options, success, response) {
                mMask.hide();
                var resp = Ext.decode(response.responseText);
                if (resp.success == true) {
                    if (nrodoc) {
                        mostrarMensaje(1, 'El documento adicionado es el Nro: ' + nrodoc);
                    }else
                    {
                        mostrarMensaje(1, 'El(los) registro(s) ha(n) sido asociado(s) satisfactoriamente');
                    }
                    _this.treegrid.getStore().baseParams = {};
                    _this.treegrid.getStore().load({
                        params: {
                            anode: null,
                            _id: null,
                            idarearesp: _this.idnodoSeleccionado
                        }
                    });
                } else if(resp.usados){
                    mostrarMensaje(3, 'El(los) registro(s) est\xe1a(n) siendo usado(s).');
                }else {
                    mostrarMensaje(3, 'Ha ocurrido un error al asociar los registros al nuevo documento.');
                }
            }
        });
    },
    getWinGestDocumento: function() {
        var _this = this;
        _this.myMaskk.show();
        _this.winGestDoc = new Ext.aft.WinGestDocServicio({
            idarearesp: _this.treegrid.comboDeposito.getValue(),
            denomArea: _this.treegrid.comboDeposito.getRawValue(),
            cargarArbolCompleto: true,
            regoperativo: true,
            identidad: _this.identidad,
            entidad: _this.entidad,
            operacionesEntrada: true,
            desabilitar_cmp: false,
            idestructurapadre: _this.treegrid.comboDeposito.getValue(), //(_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.comboDeposito.getValue()).attributes.id : _this.comboDeposito.getValue(),
            //tipo_area_seleccionada: _this.tipo_area_seleccionada,
            modificar: 'Adicionar',
            //nodoPadre: (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.comboDeposito.getValue()) : {attributes: {text: _this.comboDeposito.getRawValue(), id: _this.comboDeposito.getValue()}},
            listeners: {
                show: function() {
                    _this.myMaskk.hide();
                }
            },
            doAction: function(iddocumento, nrodoc) {

                _this.insertarRegNumDocumento(iddocumento, nrodoc, true);
            }
        });
        //_this.winGestDoc.doLayout();
    },
    OrdenarArregloporIDprod: function(arreglo) {
        for (var i = 0; i < arreglo.length; i++) {
            for (var j = 0; j < arreglo.length; j++) {
                if (arreglo[i].idprod > arreglo[j].idprod) {
                    var aux = arreglo[i];
                    arreglo[i] = arreglo[j];
                    arreglo[j] = aux;
                }
            }
        }
        return arreglo;
    },
    onOrganigramaMedios: function() {
        var _this = this;
        var record = this.treegrid.getSelectionModel().getSelected();
        var modulo = record.data;
        var text = modulo.denominacion;
        if (modulo.descripcionmarcamodelo != null) {
            text += ' ' + modulo.descripcionmarcamodelo;
        }
        text += '</br>';
        if (modulo.numinventario != null) {
            text += '</br>N.\xb0 inventario: ' + modulo.numinventario;
        }
        if (modulo.nroserie != null) {
            text += '</br>N.\xb0 nroserie: ' + modulo.nroserie;
        }
        var moduloRaiz = {
            idregnumerico: modulo.idregnumerico,
            text: text,
            denominacion: modulo.denominacion,
            esmodulo: modulo.esmodulo,
            ordenizq: modulo.ordenizqmodulo,
            ordender: modulo.ordendermodulo,
            idtabla: modulo.idtabla,
            idpadre: modulo.idpadremodulo,
            imagenes: (modulo.imagenesRegistro) ? modulo.imagenesRegistro : modulo.imagenesIndicador
        };
        var organigrama = new Ext.LOG.Organigrama({
            moduloRaiz: moduloRaiz,
            treegrid: _this.treegrid,
            //idarea: _this.comboDeposito.getValue(),
            etiq: _this.idioma,
            cmpPadre: _this
        });
        _this.ventanaVistaOrganigrama = new Ext.Window({
            id: "idwinvistaOrganigrama",
            title: 'Vista organigrama',
            resizable: false,
            layout: 'fit',
            constrain: true,
            modal: true,
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana.',
                    handler: function() {
                        _this.ventanaVistaOrganigrama.close();
                    }
                }
            ],
            listeners: {
                'close': function() {
                    _this.treegrid.getSelectionModel().clearSelections();
                    _this.treegrid.getStore().baseParams = {};
                    _this.treegrid.getStore().load(/*{
                     params: {
                     idarea: _this.comboDeposito.getValue()
                     }
                     }*/);
                }
            },
            items: [organigrama]
        });
        _this.ventanaVistaOrganigrama.show();
        _this.ventanaVistaOrganigrama.maximize();
    },
    validarRegistroParaDoc: function() {
        var _this = this;
        if (_this.treegrid.getSelectionModel().hasSelection()) {
            var records = _this.treegrid.getSelectionModel().getSelections();
            var i = 0;
            while (i < records.length) {
                if (records[i].data.idregnumerico != records[i].data.idpadremodulo) {
                    return false;
                }
                i += 1;
            }
            return true;
        } else {
            return false;
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
    attatchPlugin: function (plugin) {
        this.plugins.push(plugin);
    },
    insertarDatosExcel: function(enviar, scope){
        var _this = this;
        var idregnumericoPadre = (_this.treegrid.getSelectionModel().hasSelection())?_this.treegrid.getSelectionModel().getSelected().data.idregnumerico:null;
        var idArbol = (_this.treegrid.getSelectionModel().hasSelection()) ?_this.treegrid.getSelectionModel().getSelected().data.idarbolmodulo:null;
        Ext.Ajax.request({
            url: _this.dirController + '/adicionarRegistroNumericoOperativo',
            method: 'POST',
            params: {
                datos: Ext.encode(enviar),
                primaryKeyField: 'idregnumerico',
                idpadreModulo: idregnumericoPadre,
                plantilla: false,
                busqAvanzada: 1,
                idarbol: idArbol,
                modificar: false,
                importar:true,
                paginado: 1

            },
            callback: function (options, success, response) {
                Ext.Msg.hide();
                var rd = Ext.decode(response.responseText);
                if (response.Msg == 4) {
                    mostrarMensaje(1,  _this.idioma.MsgRegistroExiste);
                } else if (response.Msg == 3) {
                    mostrarMensaje(response.Msg,  _this.idioma.MsgAdicionarRegistroError);
                } else {
                    mostrarMensaje(1,  _this.idioma.MsgAdicionarRegistroOK);

                        if (_this.idarearesp) {
                            _this.treegrid.comboDeposito.getStore().load({
                                params: {},
                                callback: function () {
                                    _this.treegrid.comboDeposito.setValue(_this.idarearesp);
                                    _this.treegrid.btnBuscar.handler();
                                    _this.close();
                                }
                            });
                        } else {
                            scope.winMostrarDatos.close();
                            if (scope.winConfigurarDatos && _this.winConfigurarDatos.isVisible()) {
                                scope.winConfigurarDatos.close();
                            }
                            scope.winImportar.close();
                            if (_this.treegrid) {
                                _this.treegrid.getSelectionModel().clearSelections();
                                _this.treegrid.getStore().baseParams = {};
                                _this.treegrid.getStore().load();
                            }
                        }
                }
            }
        })
    }
});