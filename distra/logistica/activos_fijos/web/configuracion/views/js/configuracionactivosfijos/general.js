/**
 * Javier Martin Rojas
 * Fichero encargado de la configuracion de los parametros generales
 **/
Ext.ns('Ext.erp');
Ext.ns('Ext.aft.Conf');

Ext.erp.auxiliaresPG = {};
Ext.erp.auxiliaresPGR = {};
Ext.erp.auxTrasportacion = null;
var encontrado = false;

Ext.erp.ParametrosGenerales = new Ext.extend(Ext.TabPanel, {
    verificaModificar: '',
    nodeSelect: false,
    constructor: function(config) {

        var _this = this;
        this.title = config.etiquetas.lbTpGeneral;
        this.labelWidth = 110;
        this.tipo = (config.tipo) ? config.tipo : 0;
        this.labelAlign = 'top';
        this.activeTab = 0;
        this.buttonAlign = 'right';
        this.codigooperacion = false;
        this.listaAcciones = new LOG.util.List(acciones_reportes);
       // this.autoScroll = true;

        _this.urlControladora = '/logistica/activos_fijos/configuracion/index.php/confparametrosgenerales/';
        _this.integradoPersona = false;

        Ext.Ajax.request({
            url: _this.urlControladora + 'verificarCmpPersona',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.integradoPersona = rd.integrado;

            }

        });
        _this.accionGruposCuenta = false;
        if (acciones_reportes.length > 0) {
            for (var i = 0; i < acciones_reportes.length; i++) {
                if (acciones_reportes[i].abreviatura == 'CONFROLUSER')
                    encontrado = true;
                if (acciones_reportes[i].abreviatura == 'CONCODIGOOPERACION')
                    _this.codigooperacion = true;
                if(acciones_reportes[i].abreviatura == 'CONFGRUPCUENTAS')
                    _this.accionGruposCuenta = true;
                if(acciones_reportes[i].abreviatura == 'CONFEXPORTARMOVIL')
                    _this.accionExportarMovil = true;

            }
        }
        var tabGeneral = new Ext.form.FormPanel({
            title: config.etiquetas.lbTgeneral,
            frame: true,
            labelWidth: 110,
            idComponent: 1,
            labelAlign: 'top',
            id: 'idtabGeneralCfgGeneral',
            bodyStyle: 'padding: 10px',
            buttonAlign: 'right',
            autoValidate: true,            
            validateDefault: true,
            autoScroll: true,
            listeners: {
                /*'updatesave': function(fp) {
                 
                 if (tabGeneral.isVisible()) {
                 if(Ext.getCmp('idSaveConf').pressed)
                 {
                 Ext.getCmp('idSaveConf').disable();
                 fp.getForm().items.each(function(field) {
                 field.render();
                 });
                 }
                 }
                 },*/
                'clientvalidation': function(fp, valid) {

                    if (tabGeneral.isVisible()) {
                        var checkdirty = false;
                        fp.getForm().items.each(function(field) {
                            if (field.isDirty() && valid) {
                                checkdirty = true;
                                Ext.getCmp('idSaveConf').enable();
                            }
                        });
                        if (!checkdirty) {
                            Ext.getCmp('idSaveConf').disable();
                        }
                    }
                }
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth:.5,
                            layout: 'form',
                            items:[
                                {
                                    xtype: 'fieldset',
                                    title: config.etiquetas.lbFsDepreciacion,
                                    style: '-moz-border-radius:5px',
                                    autoHeight: true,
                                    anchor: '95%',
                                    // collapsed: true,
                                    id: 'idtabGeneralCfgGeneralDep',
                                    layout: 'form',
                                    items: [
                                        {
                                            xtype: 'checkbox',
                                            id: 'ckdeprecia',
                                            boxLabel: config.etiquetas.lbCkDeprecia,
                                            hideLabel: true,
                                            listeners: {
                                                'check': function(ckb, checked) {
                                                    if (checked) {
                                                        Ext.getCmp('primero').enable();
                                                        Ext.getCmp('segundo').enable();
                                                        Ext.getCmp('primero').setValue(true);
                                                        Ext.getCmp('primero').originalValue = true;

                                                    } else {
                                                        Ext.getCmp('primero').disable();
                                                        Ext.getCmp('segundo').disable();
                                                        Ext.getCmp('primero').setValue(false);
                                                        Ext.getCmp('primero').originalValue = false;
                                                        Ext.getCmp('segundo').setValue(false);
                                                        Ext.getCmp('segundo').originalValue = false;
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            style: 'margin:0 0 10 10',
                                            labelStyle: 'font-weight:bold',
                                            items: [
                                                {
                                                    xtype: 'radio',
                                                    hideLabel: true,
                                                    boxLabel: config.etiquetas.lbExpInicio,
                                                    id: 'primero',
                                                    name: 'fa',
                                                    inputValue: '1'
                                                },
                                                {
                                                    xtype: 'radio',
                                                    hideLabel: true,
                                                    boxLabel: config.etiquetas.lbFecAdquisicion,
                                                    id: 'segundo',
                                                    name: 'fa',
                                                    inputValue: '2'
                                                }
                                            ]
                                        }
                                    ]
                                },
                            ]
                        },{
                            columnWidth:.5,
                            layout: 'form',
                            items:[
                                {
                                    xtype: 'fieldset',
                                    title: 'Plugins',
                                    style: '-moz-border-radius:5px',
                                    height: 100,
                                    id: 'idtabGeneralCfgGeneralPlugins',
                                    layout: 'form',
                                    hidden: (!_this.grantedAction('activBuque') && !_this.grantedAction('activTransp'))? true : false,
                                    items:[
                                        {
                                            xtype: 'checkbox',
                                            id: 'cktransporte',
                                            boxLabel: 'Transportación',
                                            hideLabel: true,
                                            hidden: !_this.grantedAction('activTransp')
                                        },{
                                            xtype: 'checkbox',
                                            id: 'ckbuque',
                                            boxLabel: 'Buque',
                                            hideLabel: true,
                                            hidden: !_this.grantedAction('activBuque')
                                        }
                                    ]
                                }
                            ]
                        }
                    ]

                },





                {
                    xtype: 'fieldset',
                    title: config.etiquetas.lbFsCfgNroInventario,
                    style: '-moz-border-radius:5px',
                    autoHeight: true,
                    id: 'idtabGeneralCfgGeneralInv',
                    layout: 'form',
                    items: [
                        {
                            xtype: 'textfield',
                            id: 'tfPrefijonroinv',
                            fieldLabel: config.etiquetas.lbPrefijo,
                            maxLength: 10,
                            regex: /^[a-zA-Z0-9]+$/,
                            regexText: 'Este campo admite solo letras y n&uacute;meros.',
                            enableKeyEvents: true,
                            listeners: {
                                'valid': function(field) {
                                    field.valido = true
                                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                                        field.markInvalid(config.etiquetas.lbContenidoSinEspacios);
                                        field.valido = false;
                                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                                        field.markInvalid(config.etiquetas.lbContenidoErroneo);
                                        field.valido = false;
                                    } else {
                                        for (var i = 0; i < field.getValue().length - 1; i++) {
                                            var char = field.getValue().charAt(i);
                                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                                var char1 = field.getValue().charAt(i + 1);
                                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                                    field.markInvalid(config.etiquetas.lbContenidoErroneo);
                                                    field.valido = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            id: 'numinicial',
                            fieldLabel: 'Número inicial',
                            regex: /^[0-9]+$/,
                            regexText: 'Este campo solo permite n&uacute;meros.',
                            enableKeyEvents: true,
                            listeners: {
                         
                            }
                        },
                        {
                            xtype: 'checkbox',
                            id: 'ckgenautomatico',
                            boxLabel: config.etiquetas.lbCkGenautomatico,
                            hideLabel: true
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: config.etiquetas.lbFsCfgIntegracion,
                    style: '-moz-border-radius:5px',
                    autoHeight: true,
                    id: 'idtabGeneralCfgIntegraciones',
                    layout: 'form',
                    items: [
                        {
                            xtype: 'checkbox',
                            id: 'ckcontabilidad',
                            boxLabel: config.etiquetas.lbCkSubsitContabilidad,
                            hideLabel: true
                        },
                        {
                            xtype: 'checkbox',
                            id: 'ckinventario',
                            boxLabel: config.etiquetas.lbCkSubsitInventario,
                            hideLabel: true
                        },
                        {
                            xtype: 'checkbox',
                            id: 'cktalleres',
                            boxLabel: config.etiquetas.lbCkSubsitTalleres,
                            hideLabel: true
                        },
                        {
                            xtype: 'checkbox',
                            id: 'ckpersona',
                            boxLabel: config.etiquetas.lbCkSubsitPersona,
                            hideLabel: true
                        },
                        {
                            xtype: 'checkbox',
                            id: 'ckfirmadigital',
                            boxLabel: config.etiquetas.lbCkSubsitFirma,
                            hideLabel: true
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: config.etiquetas.lbFsCompletamientoEntidad,
                    style: '-moz-border-radius:5px',
                    autoHeight: true,
                    hidden: _this.tipo,
                    id: 'idtabGeneralCfgCompletamiento',
                    layout: 'form',
                    items: [
                        {
                            xtype: 'checkbox',
                            id: 'ckcompletamiento',
                            boxLabel: config.etiquetas.lbTbValidarCompletamiento,
                            hideLabel: true
                        } 
                    ]
                }
            ]
        });


        this.gridOperacion = new Ext.aft.Conf.GridOperaciones({
            etiquetas: config.etiquetas,
            tipo: _this.tipo,
            autoLoad:false,
            scope: _this
        });
        var btnEliminarCodOperacion = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            id: 'idbtnEliminarcodopera',
            text: config.etiquetas.lbBtnEliminar,
            tooltip: config.etiquetas.lbTplBtnEliminarCodOperac,
            handler: function() {
                if (_this.gridOperacion.getStore().getModifiedRecords().length > 0) {
                    var datcodigooper = _this.gridOperacion.getStore().getModifiedRecords();
                }
                //getModifiedRecords()
                mostrarMensaje(2, config.etiquetas.msgConfirmEliminar, function(btn) {
                    if (btn == 'ok') {

                        Ext.MessageBox.wait(config.etiquetas.msgEsperaEliminando, "Por favor espere...");
                        var arraycodopera = new Array();
                        Ext.each(_this.gridOperacion.getSelectionModel().getSelections(), function(arr) {
                            if (arr.data.codigooperacion != "") {
                                arraycodopera.push(arr.data.idnomoperaciones);
                            }
                        });
                        Ext.Ajax.request({
                            url: _this.urlControladora + 'eliminarCodigoOperacion',
                            method: 'POST',
                            params: {
                                codigooperacion: Ext.encode(arraycodopera)
                            },
                            callback: function(options, success, response) {
                                Ext.MessageBox.hide();
                                var rd = Ext.decode(response.responseText);
                                if (rd.codMsg == 1) {
                                    _this.gridOperacion.getStore().load();
                                    mostrarMensaje(1, config.etiquetas.lbMsgElimTipoMedioOK);
                                }
                                if (rd.codMsg == 3) {
                                    mostrarMensaje(1, config.etiquetas.lbMsgEliminarCodigoOperError);
                                }
                            }
                        });
                    }
                })
            }
        });

        var tabOperaciones = new Ext.Panel({
            border: true,
            title: config.etiquetas.lbTOperaciones,
            frame: false,
            layout: 'fit',
            idComponent: 3,
            tbar: [btnEliminarCodOperacion],
            items: [_this.gridOperacion],
            activarHotKey: function(e) {
                if (e.which == Ext.EventObject.DELETE) {
                    if (btnEliminarCodOperacion && !btnEliminarCodOperacion.disabled)
                        btnEliminarCodOperacion.handler();
                }
            }
        });

        var btnExportarMovil = new Ext.Button({
            iconCls: 'exportar',
            disabled: false,
            id: 'idbtnEliminarExpMovil',
            text: config.etiquetas.lbBtnEliminarExpor,
            tooltip: config.etiquetas.lbBtnEliminarExporMovil,
            handler: function() {

                var winBuscarPersonaMovil = _this.showWindowIntegradoPersona({
                    etiquetas: config.etiquetas, nodo: _this.nodeSelect
                });
                winBuscarPersonaMovil.show();
                _this.btnAceptar.on('click', function () {
                   var parametros = {}

                    if (_this.panelBusPer.getSeleccion()) {
                        parametros.idpersona = _this.panelBusPer.getSeleccion().get('idpersona');
                        if (parametros.idpersona) {
                            Ext.MessageBox.wait("Preparando datos", config.etiquetas.lbEspere);
                            Ext.Ajax.request({
                                url: _this.urlControladora + 'prepararDatos',
                                method: 'POST',
                                params: parametros,
                                callback: function(options, success, response) {
                                    var rd = Ext.decode(response.responseText);
                                    Ext.MessageBox.hide();
                                    if (rd.codMsg == 1) {
                                        Ext.MessageBox.wait("Exportar datos", config.etiquetas.lbEspere);
                                        Ext.Ajax.request({
                                            url: _this.urlControladora + 'exportarDatos',
                                            method: 'POST',
                                            callback: function(options, success, response) {
                                                var rd = Ext.decode(response.responseText);
                                                window.open(rd.url);
                                                Ext.MessageBox.hide();
                                            }
                                        });

                                        winBuscarPersonaMovil.close();
                                    }
                                }
                            });
                        }

                    }
                });
            }
        });
        var tabExportarMovil = new Ext.Panel({
            border: true,
            title: config.etiquetas.lbBtnEliminarExporMovil,
            frame: false,
            layout: 'fit',
            idComponent: 3,
            tbar: [btnExportarMovil]
           // items: [_this.gridOperacion],
          /*  activarHotKey: function(e) {
                if (e.which == Ext.EventObject.DELETE) {
                    if (btnExportarMovil && !btnExportarMovil.disabled)
                        btnExportarMovil.handler();
                }
            }*/
        });

         //No se esta usando
        var storeCmbReportes = new Ext.data.Store({
            url: _this.urlControladora + 'cargarestados',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                id: "idestatustecnico"
            }, [
                {
                    name: 'idestatustecnico'
                },
                {
                    name: 'denominacion'
                }
            ])
        });
        storeCmbReportes.load();

        var treeLoader = new Ext.tree.TreeLoader({
            dataUrl: _this.urlControladora + 'cargarArbol',
            listeners: {
                beforeload: function(st, records, options) {
                    st.baseParams.tipo = _this.tipo;
                },
                load: function(This, node, response) {
                    var datos = Ext.decode(response.responseText);
                }
            }
        });

        _this.tpEstructurae = new Ext.tree.TreePanel({
            enableDD: false,
            autoScroll: true,
            collapsible: true,
            style: 'margin: 2 0 0 0',
            margins: '1 1 1 1',
            id: 'tree',
            loader: treeLoader,
            frame: false,
            listeners: {
                'click': function(node, e) {
                    if (node.isRoot || node.attributes.responsable == "" || node.attributes.responsable == null)
                        btnEliminarAsociar.disable();
                    else
                        btnEliminarAsociar.enable();

                    if (node.isRoot) {
                        btnAsociar.disable();
                        _this.nodeSelect = false;
                    }
                    else {
                        btnAsociar.enable();
                        _this.nodeSelect = node;
                    }

                }
            }
        });

        var nodopadre = new Ext.tree.AsyncTreeNode({
            text: config.etiquetas.lbEstructuraUbicacion,
            draggable: false,
            id: '0',
            animate: false,
            expanded: true
        });

        _this.tpEstructurae.setRootNode(nodopadre);

         var tabConfReportes = new Ext.form.FormPanel({
         title: config.etiquetas.lbTconfReportes,
         frame: true,
         labelWidth: 140,
         bodyStyle: 'padding: 10px',
         listeners: {
         'clientvalidation': function(fp, valid) {
         
         if (tabConfReportes.isVisible()) {
         var checkdirty = false;
         fp.getForm().items.each(function(field) {
         if (field.isDirty() && valid) {
         checkdirty = true;
         Ext.getCmp('idSaveConf').enable();
         }
         });
         if (!checkdirty) {
         Ext.getCmp('idSaveConf').disable();
         }
         }
         }
         },
         items: [
         {
         xtype: 'combo',
         emptyText: config.etiquetas.lbCbVacio,
         displayField: 'denominacion',
         editable: false,
         valueField: 'idestatustecnico',
         mode: 'remote',
         triggerAction: 'all',
         id: 'idalmacenado',
         hiddenName: 'almacenado',
         store: storeCmbReportes,
         fieldLabel: config.etiquetas.lbCbAlmacenado
         }, {
         xtype: 'combo',
         emptyText: config.etiquetas.lbCbVacio,
         displayField: 'denominacion',
         id: 'idreserva',
         editable: false,
         valueField: 'idestatustecnico',
         triggerAction: 'all',
         mode: 'remote',
         hiddenName: 'reserva',
         store: storeCmbReportes,
         fieldLabel: config.etiquetas.lbCbReserva
         }, {
         xtype: 'combo',
         emptyText: config.etiquetas.lbCbVacio,
         displayField: 'denominacion',
         valueField: 'idestatustecnico',
         id: 'idconcervacion',
         editable: false,
         triggerAction: 'all',
         mode: 'remote',
         hiddenName: 'concervacion',
         store: storeCmbReportes,
         fieldLabel: config.etiquetas.lbCbConservacion
         
         }, {
         xtype: 'combo',
         emptyText: config.etiquetas.lbCbVacio,
         displayField: 'denominacion',
         editable: false,
         valueField: 'idestatustecnico',
         id: 'idbueno',
         triggerAction: 'all',
         mode: 'remote',
         hiddenName: 'bueno',
         store: storeCmbReportes,
         fieldLabel: config.etiquetas.lbCbBueno
         
         
         }, {
         xtype: 'combo',
         emptyText: config.etiquetas.lbCbVacio,
         displayField: 'denominacion',
         editable: false,
         valueField: 'idestatustecnico',
         id: 'idregular',
         triggerAction: 'all',
         mode: 'remote',
         hiddenName: 'regular',
         store: storeCmbReportes,
         fieldLabel: config.etiquetas.lbCbRegular
         }, {
         xtype: 'combo',
         emptyText: config.etiquetas.lbCbVacio,
         displayField: 'denominacion',
         editable: false,
         valueField: 'idestatustecnico',
         id: 'idmal',
         mode: 'remote',
         triggerAction: 'all',
         hiddenName: 'mal',
         store: storeCmbReportes,
         fieldLabel: config.etiquetas.lbCbMal
         }
         ]
         
         });

        var btnAsociar = new Ext.Button({
            iconCls: 'asociar',
            disabled: true,
            text: config.etiquetas.lbBtnAsociar,
            tooltip: config.etiquetas.lbTplBtnAsociar,
            handler: function() {
                var winBuscarPersona = _this.showWindowIntegradoPersona({
                    etiquetas: config.etiquetas, nodo: _this.nodeSelect
                });
                winBuscarPersona.show();
            }
        });

        var btnEliminarAsociar = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            id: 'idbtnEliminarAsociar',
            text: config.etiquetas.lbBtnEliminar,
            tooltip: config.etiquetas.lbTplBtnEliminarAsociacion,
            handler: function() {

                var nodo = _this.tpEstructurae.getSelectionModel().getSelectedNode();

                if (nodo && !isNaN(nodo.id) && nodo.id != 0) {

                    _this.eliminarAsociacion({etiquetas: config.etiquetas, nodo: nodo});

                } else {
                    mostrarMensaje(1, config.etiquetas.lbMsgSeleccionarAreaEliminar);
                }


            }
        });


        var tabResponsablesPorAreas = new Ext.Panel({
            id: 'idtabrespareas',
            border: true,
            idComponent: 2,
            tbar: [btnAsociar, btnEliminarAsociar],
            title: config.etiquetas.lbTrespAreas,
            frame: false,
            layout: 'fit',
            items: [_this.tpEstructurae],
            activarHotKey: function(e) {
                if (e.altKey) {
                    if (e.which == Ext.EventObject.K) {
                        if (btnAsociar && !btnAsociar.disabled)
                            btnAsociar.handler();
                    }
                } else {
                    if (e.which == Ext.EventObject.DELETE) {
                        if (btnEliminarAsociar && !btnEliminarAsociar.disabled)
                            btnEliminarAsociar.handler();
                    }
                }
            }
        });

        var storeUsuariosRol = new Ext.data.Store({
            url: _this.urlControladora + 'cargarUsuariosRol',
            autoLoad: false,
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'nombreusuario'
                },
                {
                    name: 'idusuario'
                },
                {
                    name: 'denespecialidad'
                },
                {
                    name: 'idespecialidad'
                }
            ]),
            listeners: {
                'load': function(store) {
                    btnEliminar.disable();
                    _this.btnGuardar.disable();
                    if (store.getTotalCount() == 0)
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                }
            }
        });

        var selectionM = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                'rowselect': function(SelectionModel, rowIndex, record) {
                    if (record.data.denespecialidad == '')
                        btnEliminar.disable();
                    else
                        btnEliminar.enable();
                }
            },
            'rowdeselect': function(SelectionModel, rowIndex, record) {
                btnEliminar.disable();
            }
        });

        var storeespecialidad = new Ext.data.Store({
            autoLoad: false,
            url: _this.urlControladora + 'cargarEspecialidadUsuario',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'idespecialidad'
                },
                {
                    name: 'denespecialidad'
                }
            ])
        });

        this.btnGuardar = new Ext.Button({
            iconCls: 'guardar',
            disabled: true,
            id: 'idbtnGuardar',
            text: config.etiquetas.lbbtnGuardar,
            tooltip: config.etiquetas.lbbtnGuardarConf,
            handler: function() {

                var modificados = new Array();
                modificados = gridUsuarios.getStore().data.items;

                var arraParametros = new Array();
                for (var i = 0; i < modificados.length; i++) {
                    if (modificados[i].get('idespecialidad') != '') {
                        arraParametros.push({
                            idespecialidad: modificados[i].get('idespecialidad'),
                            idusuario: modificados[i].get('idusuario')
                        });
                    }
                }
                Ext.Ajax.request({
                    url: _this.urlControladora + 'guardarUsuariosEsp',
                    method: 'POST',
                    params: {
                        parametros: Ext.encode(arraParametros)
                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        if (rd.CodMsg == 1) {
                            mostrarMensaje(1, config.etiquetas.lbbtnGuardarConfiguracion);
                            modificados = new Array();
                            gridUsuarios.getStore().reload();
                        } else if (rd.CodMsg == 3) {
                            mostrarMensaje(3, 'Ocurrio un error en el sistema.');
                        }
                    }
                });
            }
        });

        var btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            text: config.etiquetas.lbbtnEliminar,
            tooltip: config.etiquetas.lbbtnEliminarConf,
            handler: function() {

                mostrarMensaje(2, '&iquest;Est\xE1 seguro que quiere eliminar la especialidad seleccionada?', elimina);

                function elimina(btnPresionado) {
                    if (btnPresionado == 'ok') {

                        var records = gridUsuarios.getSelectionModel().getSelections();
                        var arreglo = new Array();

                        for (var i = 0; i < records.length; i++) {
                            arreglo.push(records[i].get('idusuario'));
                        }

                        Ext.Ajax.request({
                            url: _this.urlControladora + 'eliminarAsociacionUsuariosEsp',
                            method: 'POST',
                            params: {
                                parametros: Ext.encode(arreglo)
                            },
                            callback: function(options, success, response) {
                                var rd = Ext.decode(response.responseText);
                                if (rd.CodMsg == 1) {
                                    mostrarMensaje(1, config.etiquetas.lbbtnEliminarUserConfiguracion);
                                    gridUsuarios.getStore().reload();
                                } else if (rd.CodMsg == 3) {
                                    mostrarMensaje(3, 'Ocurrio un error en el sistema.');
                                }
                            }
                        });
                    }
                }
            }
        });

        var gridUsuarios = new Ext.grid.EditorGridPanel({
            border: false,
            clicksToEdit: 1,
            region: 'center',
            bodyBorder: false,
            store: storeUsuariosRol,
            sm: selectionM,
            columns: [
                {
                    header: 'Usuarios',
                    width: 320,
                    dataIndex: 'nombreusuario'
                }, {
                    header: 'Especialidad',
                    width: 320,
                    dataIndex: 'denespecialidad',
                    editor: new Ext.form.ComboBox({
                        typeAhead: true,
                        triggerAction: 'all',
                        store: storeespecialidad,
                        valueField: 'denespecialidad',
                        displayField: 'denespecialidad',
                        hiddenName: 'idespecialidad',
                        editable: false,
                        mode: 'local',
                        emptyText: 'Seleccione',
                        listeners: {
                            'select': function(combo, record, index) {
                                var rc = gridUsuarios.getSelectionModel().getSelected();
                                rc.set('idespecialidad', record.get('idespecialidad'));
                                gridUsuarios.getStore().commitChanges();
                            },
                            'change': function(combo, newValue, oldValue) {
                                if (newValue != oldValue)
                                    _this.btnGuardar.enable();
                            }
                        }
                    })
                }
            ],
            tbar: [_this.btnGuardar, btnEliminar],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: storeUsuariosRol,
                displayInfo: true,
                displayMsg: "Resultados {0} - {1} de {2}",
                emptyMsg: "Ning&uacute;n resultado para mostrar."

            })
        });

        var tabConfigurarUsuariosRol = new Ext.Panel({
            border: true,
            title: config.etiquetas.lbConfUsuarios,
            frame: true,
            layout: 'border',
            idComponent: 4,
            id: 'idConfUserRol',
            hidden: true,
            items: [gridUsuarios],
            activarHotKey: function(e) {
                if (e.altKey) {
                    if (e.which == Ext.EventObject.G) {
                        if (!_this.btnGuardar.disabled)
                            _this.btnGuardar.handler();
                    }
                } else {
                    if (e.which == Ext.EventObject.DELETE) {
                        if (btnEliminar)
                            if (!btnEliminar.disabled)
                                btnEliminar.handler();
                    }
                }
            }
        });


        //var tabConfTransportesNaturalezas = new Ext.erp.ConfigNaturalezas({
        //    etiquetas: config.etiquetas
        //});
        this.items = [tabGeneral,  tabConfReportes, tabResponsablesPorAreas];
        if (encontrado)
            this.items.push(tabConfigurarUsuariosRol);
        if (_this.codigooperacion) {
            this.items.push(tabOperaciones);
        }if (_this.accionExportarMovil) {
            this.items.push(tabExportarMovil);
        }
        this.buttons = [
            {
                text: config.etiquetas.lbBtnGuardar,
                iconCls: 'guardar',
                disabled: true,
                id: 'idSaveConf',
                tooltip: config.etiquetas.lbTtBtnGuardarPG,
                handler: function() {
                    var params = {};
                    (tabConfReportes.rendered)? params = tabConfReportes.getForm().getValues() : params;
                    if (_this.codigooperacion) {
                        var codigooperacion = {};
                        for (var i = 0; i < _this.gridOperacion.getStore().getModifiedRecords().length; i++) {
                            if (_this.gridOperacion.getStore().getModifiedRecords()[i].data.codigooperacion != "") {
                                codigooperacion[i] = _this.gridOperacion.getStore().getModifiedRecords()[i].data;
                            }
                        }
                        params.codigoperacion = Ext.encode(codigooperacion);
                    }


                    /* if (!tabConfReportes.rendered) {
                     params.deprecia = (Ext.getCmp('ckdeprecia').getValue()) ? 1 : 0;
                     //params.cantidad = Ext.getCmp('idtextfMaxCantidad').getValue(); Pertenece a transportacion
                     params.explotacionadquisición = (Ext.getCmp('primero').getValue()) ? 1 : 0;
                     params.fechaadquisicion = (Ext.getCmp('segundo').getValue()) ? 1 : 0;
                     
                     params.prefijo = Ext.getCmp('tfPrefijonroinv').getValue();
                     params.autogenerado = (Ext.getCmp('ckgenautomatico').getValue()) ? 1 : 0;
                     
                     params.contabilidad = (Ext.getCmp('ckcontabilidad').getValue()) ? 1 : 0;
                     params.inventario = (Ext.getCmp('ckinventario').getValue()) ? 1 : 0;
                     params.talleres = (Ext.getCmp('cktalleres').getValue()) ? 1 : 0;
                     params.persona = (Ext.getCmp('ckpersona').getValue()) ? 1 : 0;
                     
                     } else {*/
                    // params = tabConfReportes.getForm().getValues();
                    // if (/*_this.tipo != 1*/Ext.getCmp('idtabGeneralCfgGeneralDep').getValue() == 1) {

                    params.deprecia = (Ext.getCmp('ckdeprecia').getValue()) ? 1 : 0;
                    params.transporte = (Ext.getCmp('cktransporte').getValue()) ? 1 : 0;
                    params.buque = (Ext.getCmp('ckbuque').getValue()) ? 1 : 0;
                    params.explotacionadquisición = (Ext.getCmp('primero').getValue()) ? 1 : 0;
                    params.fechaadquisicion = (Ext.getCmp('segundo').getValue()) ? 1 : 0;
                    // }

                    // params.cantidad = Ext.getCmp('idtextfMaxCantidad').getValue();


                    params.prefijo = Ext.getCmp('tfPrefijonroinv').getValue();
                    params.numinicial = Ext.getCmp('numinicial').getValue();
                    params.autogenerado = (Ext.getCmp('ckgenautomatico').getValue()) ? 1 : 0;

                    params.contabilidad = (Ext.getCmp('ckcontabilidad').getValue()) ? 1 : 0;
                    params.inventario = (Ext.getCmp('ckinventario').getValue()) ? 1 : 0;
                    params.talleres = (Ext.getCmp('cktalleres').getValue()) ? 1 : 0;
                    params.persona = (Ext.getCmp('ckpersona').getValue()) ? 1 : 0;
                    params.firmadigital = (Ext.getCmp('ckfirmadigital').getValue()) ? 1 : 0;
                    params.tipo = _this.tipo;

                    params.usarcompletamiento = (Ext.getCmp('ckcompletamiento').getValue()) ? 1 : 0;
                    // }
                    Ext.MessageBox.wait(config.etiquetas.msgEsperaGuardarCnf, "Por favor espere...");
                    //Ext.getBody().mask(config.etiquetas.lbMsgEliminandoRelacion, 'x-mask-loading');
                    Ext.Ajax.request({
                        url: _this.urlControladora + 'guardarparametros',
                        method: 'POST',
                        params: params,
                        callback: function(options, success, response) {
                            var response = Ext.decode(response.responseText);
                            //Ext.getBody().unmask();
                            Ext.MessageBox.hide();
                            if (success) {
                                if (_this.codigooperacion) {
                                    _this.gridOperacion.getStore().commitChanges();
                                    Ext.getCmp('idSaveConf').disable();
                                }
                                if (response.msg == 'false' && params.numinicial != '') {
                                    mostrarMensaje(3, "Ese número de inventario no está disponible, le sugerimos usar números iniciales mayores que "+ response.num);
                                } else {
                                    mostrarMensaje(1, config.etiquetas.lbModCorrecGC);
                                }

                                if (_this.tipo != 1) {
                                    Ext.getCmp('ckdeprecia').originalValue = Ext.getCmp('ckdeprecia').getValue();
                                    Ext.getCmp('primero').originalValue = Ext.getCmp('primero').getValue();
                                    Ext.getCmp('segundo').originalValue = Ext.getCmp('segundo').getValue();
                                }
                                Ext.getCmp('cktransporte').originalValue = Ext.getCmp('cktransporte').getValue();
                                Ext.getCmp('ckbuque').originalValue = Ext.getCmp('ckbuque').getValue();
                                Ext.getCmp('numinicial').originalValue = Ext.getCmp('numinicial').getValue();
                                Ext.getCmp('tfPrefijonroinv').originalValue = Ext.getCmp('tfPrefijonroinv').getValue();
                                Ext.getCmp('ckgenautomatico').originalValue = Ext.getCmp('ckgenautomatico').getValue();
                                Ext.getCmp('ckcontabilidad').originalValue = Ext.getCmp('ckcontabilidad').getValue();
                                Ext.getCmp('ckinventario').originalValue = Ext.getCmp('ckinventario').getValue();
                                Ext.getCmp('cktalleres').originalValue = Ext.getCmp('cktalleres').getValue();
                                Ext.getCmp('ckpersona').originalValue = Ext.getCmp('ckpersona').getValue();
                                Ext.getCmp('ckfirmadigital').originalValue = Ext.getCmp('ckfirmadigital').getValue();
                                Ext.getCmp('ckcompletamiento').originalValue = Ext.getCmp('ckcompletamiento').getValue();
                                _this.showPanelIntegradoContabilidad(params.contabilidad);
                            }
                        }
                    });
                }
            }
        ];

        _this.cargaInicialOp = true;
        _this.cargaInicialUsuario = true;
        this.listeners = {
            'activate': function() {
                _this.initGeneral({
                    fn: function(auxiliaresPG, auxiliaresPGR) {
                        Ext.erp.auxiliaresPG = auxiliaresPG;
                        Ext.erp.auxiliaresPGR = auxiliaresPGR;
                    }
                });
            },
            'tabchange': function(p, tab) {
                if (tab.idComponent == 3) {
                    if(_this.cargaInicialOp)
                    {
                        _this.gridOperacion.cargarStore();
                        _this.cargaInicialOp = false;
                    }
                    Ext.getCmp('idSaveConf').show();
                    if (_this.gridOperacion.getStore().getModifiedRecords().length > 0) {
                        Ext.getCmp('idSaveConf').enable();
                    } else
                        Ext.getCmp('idSaveConf').disable();
                }
                if (tab.idComponent == 2) {
                    Ext.getCmp('idSaveConf').hide();
                }
                if (tab.idComponent == 1) {
                    Ext.getCmp('idSaveConf').show();
                }
                if (tab.idComponent == 4) {
                    if (_this.cargaInicialUsuario) {
                        storeespecialidad.load();
                        storeUsuariosRol.load();
                        _this.cargaInicialUsuario = false;
                    }
                }

                initHotKeys(tab);
                _this.doLayout();
            }
        };
        Ext.erp.ParametrosGenerales.superclass.constructor.apply(this, arguments);
    },

    initGeneral: function(config) {
        var _this = this;
        var buqueAction = _this.grantedAction('activBuque');
        var transpAction = _this.grantedAction('activTransp');
        var acciones = [transpAction, buqueAction];

        //titleBP msgCargandoDatConf
        // Ext.MessageBox.wait("Cargando datos de la configuraci&oacute;n", _this.etiquetas.titleBP);
        Ext.Ajax.request({
            url: _this.urlControladora + 'cargarconfiguracion',
            method: 'POST',
            params: {
                acciones: Ext.encode(acciones),
                tipo: _this.tipo,

            },
            callback: function(options, success, response) {

                var rd = Ext.decode(response.responseText);
                Ext.erp.auxTrasportacion = rd[0].transporte;
                config.fn(rd[0], rd);
                //poner cunado salga de calidad
                /* if (Ext.erp.auxiliaresPG.enuso == 1) {
                 //Ext.getCmp('idtabGeneralCfgGeneral').disable();
                 Ext.getCmp('idtabGeneralCfgGeneralInv').disable();
                 Ext.getCmp('idtabGeneralCfgGeneralDep').disable();
                 Ext.getCmp('idtabGeneralCfgIntegraciones').disable();
                 }*/
                /***** Componente de transportacion ******/
                //Ext.getCmp('idtextfMaxCantidad').setValue(Ext.erp.auxiliaresPG.maxunidarrastporremolcadoras);
                _this.showPanelIntegradoContabilidad(Ext.erp.auxiliaresPG.contabilidad);

                if (Ext.erp.auxiliaresPG.depreciacion == 1) {

                    Ext.getCmp('ckdeprecia').setValue(true);
                    Ext.getCmp('ckdeprecia').originalValue = true;
                    // Ext.getCmp('ckdeprecia').originalValue = Ext.getCmp('ckdeprecia').getValue();
                    if (Ext.erp.auxiliaresPG.explotacionadquisicion == 0) {
                        Ext.getCmp('primero').setValue(false);
                        Ext.getCmp('primero').originalValue = Ext.getCmp('primero').getValue();
                        Ext.getCmp('segundo').setValue(true);
                        Ext.getCmp('segundo').originalValue = Ext.getCmp('segundo').getValue();
                    }
                }
                if (Ext.erp.auxiliaresPG.depreciacion == 0 || Ext.erp.auxiliaresPG.depreciacion == null) {
                    Ext.getCmp('ckdeprecia').setValue(false);
                    Ext.getCmp('ckdeprecia').originalValue = false;

                    Ext.getCmp('primero').disable();
                    Ext.getCmp('segundo').disable();
                    Ext.getCmp('primero').setValue(false);
                    Ext.getCmp('primero').originalValue = Ext.getCmp('primero').getValue();
                    Ext.getCmp('segundo').setValue(false);
                    Ext.getCmp('segundo').originalValue = Ext.getCmp('segundo').getValue();
                }

               /* if (Ext.erp.auxiliaresPG.enuso == false && _this.tipo != 1) {

                    Ext.getCmp('ckdeprecia').disable();
                    Ext.getCmp('primero').disable();
                    Ext.getCmp('segundo').disable();
                    Ext.getCmp('tfPrefijonroinv').disable();
                    Ext.getCmp('ckgenautomatico').disable();
                    Ext.getCmp('ckcontabilidad').disable();
                    Ext.getCmp('ckinventario').disable();
                    Ext.getCmp('cktalleres').disable();
                    Ext.getCmp('ckpersona').disable();
                    Ext.getCmp('ckfirmadigital').disable();
                }*/

                (Ext.erp.auxiliaresPG.autogenerado == '1') ? Ext.getCmp('ckgenautomatico').setValue(true) : Ext.getCmp('ckgenautomatico').setValue(false);
                Ext.getCmp('ckgenautomatico').originalValue = Ext.getCmp('ckgenautomatico').getValue();
                Ext.getCmp('tfPrefijonroinv').setValue(Ext.erp.auxiliaresPG.prefijo);
                Ext.getCmp('tfPrefijonroinv').originalValue = Ext.getCmp('tfPrefijonroinv').getValue();
                

                Ext.getCmp('numinicial').setValue(Ext.erp.auxiliaresPG.numinicial);
                Ext.getCmp('numinicial').originalValue = Ext.getCmp('numinicial').getValue();


                (Ext.erp.auxiliaresPG.contabilidad == '1') ? Ext.getCmp('ckcontabilidad').setValue(true) : Ext.getCmp('ckcontabilidad').setValue(false);
                Ext.getCmp('ckcontabilidad').originalValue = Ext.getCmp('ckcontabilidad').getValue();

                (Ext.erp.auxiliaresPG.transporte == '1') ? Ext.getCmp('cktransporte').setValue(true) : Ext.getCmp('cktransporte').setValue(false);
                Ext.getCmp('cktransporte').originalValue = Ext.getCmp('cktransporte').getValue();

                (Ext.erp.auxiliaresPG.buque == '1') ? Ext.getCmp('ckbuque').setValue(true) : Ext.getCmp('ckbuque').setValue(false);
                Ext.getCmp('ckbuque').originalValue = Ext.getCmp('ckbuque').getValue();




                (Ext.erp.auxiliaresPG.inventario == '1') ? Ext.getCmp('ckinventario').setValue(true) : Ext.getCmp('ckinventario').setValue(false);
                Ext.getCmp('ckinventario').originalValue = Ext.getCmp('ckinventario').getValue();
                (Ext.erp.auxiliaresPG.talleres == '1') ? Ext.getCmp('cktalleres').setValue(true) : Ext.getCmp('cktalleres').setValue(false);
                Ext.getCmp('cktalleres').originalValue = Ext.getCmp('cktalleres').getValue();
                (Ext.erp.auxiliaresPG.persona == '1') ? Ext.getCmp('ckpersona').setValue(true) : Ext.getCmp('ckpersona').setValue(false);
                Ext.getCmp('ckpersona').originalValue = Ext.getCmp('ckpersona').getValue();
                (Ext.erp.auxiliaresPG.firmadigital == '1') ? Ext.getCmp('ckfirmadigital').setValue(true) : Ext.getCmp('ckfirmadigital').setValue(false);
                Ext.getCmp('ckfirmadigital').originalValue = Ext.getCmp('ckfirmadigital').getValue();

                (Ext.erp.auxiliaresPG.usarcompletamiento == '1') ? Ext.getCmp('ckcompletamiento').setValue(true) : Ext.getCmp('ckcompletamiento').setValue(false);
                Ext.getCmp('ckcompletamiento').originalValue = Ext.getCmp('ckcompletamiento').getValue();


                // Ext.MessageBox.hide();
                  for (var i = 0; i < Ext.erp.auxiliaresPGR.length; i++) {
                 if (Ext.erp.auxiliaresPGR[i].denomcolumnareporte == "almacenado") {
                 Ext.getCmp('idalmacenado').setValue(Ext.erp.auxiliaresPGR[i].idestado);
                 Ext.getCmp('idalmacenado').originalValue = Ext.getCmp('idalmacenado').getValue();

                 } else if (Ext.erp.auxiliaresPGR[i].denomcolumnareporte == "reserva") {
                 Ext.getCmp('idreserva').setValue(Ext.erp.auxiliaresPGR[i].idestado);
                 Ext.getCmp('idreserva').originalValue = Ext.getCmp('idreserva').getValue();
                 } else if (Ext.erp.auxiliaresPGR[i].denomcolumnareporte == "concervacion") {
                 Ext.getCmp('idconcervacion').setValue(Ext.erp.auxiliaresPGR[i].idestado);
                 Ext.getCmp('idconcervacion').originalValue = Ext.getCmp('idconcervacion').getValue();
                 } else if (Ext.erp.auxiliaresPGR[i].denomcolumnareporte == "R") {
                 Ext.getCmp('idregular').setValue(Ext.erp.auxiliaresPGR[i].idestado);
                 Ext.getCmp('idregular').originalValue = Ext.getCmp('idregular').getValue();
                 } else if (Ext.erp.auxiliaresPGR[i].denomcolumnareporte == "M") {
                 Ext.getCmp('idmal').setValue(Ext.erp.auxiliaresPGR[i].idestado);
                 Ext.getCmp('idmal').originalValue = Ext.getCmp('idmal').getValue();
                 } else if (Ext.erp.auxiliaresPGR[i].denomcolumnareporte == "B") {
                 Ext.getCmp('idbueno').setValue(Ext.erp.auxiliaresPGR[i].idestado);
                 Ext.getCmp('idbueno').originalValue = Ext.getCmp('idbueno').getValue();
                 }
                 }
            }
        });
    },
    showWindowIntegradoPersona: function(config) {

        var parametros = {};
        var _this = this;

        this.panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            region: 'center',
            id: 'panelBusPer',
            singleSelect: true,
            identidad: perfil.idestructuracomun,
            showBtnAdicionar: true,
            modulo: 'LOGISTICA',
            showBtnAdicionar: false,
                    showBtnAyuda: false
        });

    // Se agrega esto porque sino el boton limpiar del componente de persona no funciona
    // -----------------------------------------------
    _this.panelBusPer.runSearch = function (condiciones) {
        if (condiciones && condiciones.length > 0 && condiciones[0] != " ") {
            condiciones[condiciones.length - 1].logico = '';
            _this.panelBusPer.hasSearch = true;
        } else {
            _this.panelBusPer.hasSearch = false;
        }
        _this.panelBusPer.stPersonas.baseParams.condiciones = condiciones; 
        _this.panelBusPer.stPersonas.load();
    };
    _this.panelBusPer.cleanSearch = function () {
        _this.panelBusPer.tfbuscar.reset();
        _this.panelBusPer.stPersonas.baseParams.condiciones = '';
        _this.panelBusPer.stPersonas.baseParams.start = 0;
        _this.panelBusPer.stPersonas.baseParams.limit = 25;
        _this.panelBusPer.stPersonas.reload();
    };
    // -----------------------------------------------


        this.btnAceptar = new Ext.Button({
            text: 'Aceptar ',
            // iconCls: 'aceptar',
            iconCls: 'aceptar',
            disabled: true,
            tooltip: config.etiquetas.lbTtBtnAceptarI,
            handler: function() {
                if (_this.panelBusPer.getSeleccion()) {

                    parametros.idpersona = _this.panelBusPer.getSeleccion().get('idpersona');
                    parametros.tiporesponsable = 1;
                    parametros.tipo = _this.tipo;

                    (config.nodo.attributes.idestructuraubicacion) ? parametros.idestructuraubicacion = config.nodo.attributes.idestructuraubicacion : "";
                    (config.nodo.attributes.iddeposito) ? parametros.idarearesp = config.nodo.attributes.iddeposito : "";

                    if (parametros.idpersona) {
                        Ext.Ajax.request({
                            url: _this.urlControladora + 'asociar',
                            method: 'POST',
                            params: parametros,
                            callback: function(options, success, response) {
                                var rd = Ext.decode(response.responseText);
                                if (rd.cod == 1) {
                                    mostrarMensaje(1, config.etiquetas.lbMsgAsociarAreaGood);

                                    _this.tpEstructurae.getLoader().load(_this.tpEstructurae.getRootNode(), function() {
                                        _this.tpEstructurae.getRootNode().expand();
                                    });
                                    winBuscarPersona.close();
                                }
                            }
                        });
                    }

                    winBuscarPersona.close();
                    _this.keymap.disable();
                }
            }
            /* listeners: {
             'click': function() {
             if (panelBusPer.getSeleccion()) {
             
             parametros.idpersona = panelBusPer.getSeleccion().get('idpersona');
             parametros.tipo = 1;
             parametros.idarearesp = config.nodo.id;
             
             if (parametros.idpersona) {
             Ext.Ajax.request({
             url: _this.urlControladora + 'asociar',
             method: 'POST',
             params: parametros,
             callback: function(options, success, response) {
             var rd = Ext.decode(response.responseText);
             if (rd.cod == 1) {
             mostrarMensaje(1, config.etiquetas.lbMsgAsociarAreaGood);
             
             _this.tpEstructurae.getLoader().load(_this.tpEstructurae.getRootNode(), function() {
             _this.tpEstructurae.getRootNode().expand();
             });
             winBuscarPersona.close();
             }
             }
             });
             }
             
             winBuscarPersona.close();
             }
             }
             }*/
        });

        this.btnCancelar = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: config.etiquetas.lbTtBtnCancelarI,
            handler: function() {
                winBuscarPersona.close();
                _this.keymap.disable();
            }
        });

        _this.panelBusPer.smPersonas.on({
            'rowselect': function(sm, rowIndex, r) {
                if (sm.selections.items.length > 0) {
                    _this.btnAceptar.enable();
                } else {
                    _this.btnAceptar.disable();
                }
            },
            'rowdeselect': function(sm, rowIndex, r) {
                if (sm.selections.items.length > 0) {
                    _this.btnAceptar.enable();
                } else {
                    _this.btnAceptar.disable();
                }
            }
        });

        var winBuscarPersona = new Ext.Window({
            title: 'Personas',
            width: 800,
            height: 600,
            resizable: false,
            modal: true,
            closeAction: 'close',
            constrain: true,
            layout: 'border',
            items: [_this.panelBusPer],
            buttons: [_this.btnCancelar, _this.btnAceptar]
        });

        _this.keymap = new Ext.KeyMap(document, [
            {key: 88,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (_this.btnCancelar.enable()) {
                        _this.btnCancelar.handler();
                    }
                }
            },
            {key: 13,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function()
                {
                    if (_this.btnAceptar && _this.btnAceptar.enable()) {
                        _this.btnAceptar.handler();
                    }
                }
            }

        ]);
        _this.keymap.stopEvent = true;
        _this.keymap.enable();

      //  winBuscarPersona.show();
        /*_this.panelBusPer.runSearch = function(condiciones) {
            if (condiciones.length > 0) {
                condiciones[condiciones.length - 1].logico = '';
                _this.panelBusPer.hasSearch = true;
                _this.panelBusPer.searchField.setVisibleBtnClear(_this.panelBusPer.hasSearch);
            } else {
                _this.panelBusPer.hasSearch = false;
                _this.panelBusPer.searchField.setVisibleBtnClear(this.hasSearch);
            }
            _this.panelBusPer.stPersonas.baseParams.condiciones = Ext.encode(condiciones);
            _this.panelBusPer.stPersonas.load();
        }
        _this.panelBusPer.cleanSearch = function() {

            _this.panelBusPer.fpAdvancedSearch.getForm().reset();
            _this.panelBusPer.stPersonas.baseParams.condiciones = '';
            if (_this.panelBusPer.fpAdvancedSearch.isVisible())
                _this.panelBusPer.tfNumero.focus(true, 100);
            _this.panelBusPer.btnCleanSearch.disable();
            _this.panelBusPer.btnSearch.disable();
            _this.panelBusPer.searchField.setValue(" ");
        }*/
        return winBuscarPersona;
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
    eliminarAsociacion: function(config) {
        var _this = this;
        mostrarMensaje(2, config.etiquetas.msgConfirmEliminarResponsable, function(btn) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url: _this.urlControladora + 'eliminarAsociacion',
                    method: 'POST',
                    params: {
                        idarearesp: config.nodo.id,
                        tipo: _this.tipo
                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        if (rd.cod == 1) {
                            Ext.getCmp('idbtnEliminarAsociar').disable();
                            mostrarMensaje(1, config.etiquetas.msgBPEliminarResponsable);
                            _this.tpEstructurae.getLoader().load(_this.tpEstructurae.getRootNode(), function() {
                                _this.tpEstructurae.getRootNode().expand();
                            });

                        } else {
                            //mostrarMensaje(3, 'todo mal');
                        }


                    }

                });
            }
        });
    },
    showPanelIntegradoContabilidad:function(contabilidad){
        var _this = this;
        if (contabilidad == 1 && _this.accionGruposCuenta) {
            if (!Ext.getCmp('gruposcuentas')) {
                _this.padre.tabGeneralTransp.insert(1, new Ext.erp.gruposcuentas({etiquetas: _this.etiquetas}));
            }

        } else if (Ext.getCmp('gruposcuentas')) {
            _this.padre.tabGeneralTransp.remove('gruposcuentas');
        }
    }
});

Ext.erp.configuracionactivosfijos = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        conf = config;
        this.frame = true;
        this.layout = 'fit';        
        this.getItemsTrans(config);

        Ext.erp.configuracionactivosfijos.superclass.constructor.call(this, config);
        this.autoScroll = true;
    },
    getItemsTrans: function(config) {
        var _this = this;

        var items = [];

        if (acciones_reportes.length > 0) {
            for (var i = 0; i < acciones_reportes.length; i++) {
                switch (acciones_reportes[i].abreviatura) {
                    case 'CONFFORMATOS':
                        items.push(new Ext.erp.panelFormato({etiquetas: config.idioma}));
                        break;
                    case 'CONFPARAMGENER':
                        _this.paramGenerales = new Ext.erp.ParametrosGenerales({etiquetas: config.idioma, padre: _this});
                        items.push(_this.paramGenerales);
                        break;
                        /*case 'CONFESTOPR':
                         items.push(new Ext.erp.estadosoperaciones({etiquetas: config.idioma}));
                         break;*/
                    case 'CONFDATOSNATURALEZAS':
                        items.push(new Ext.aft.Conf.tiposMedios({etiquetas: config.idioma}));
                        break;
                    case 'CONFESTRUCTURAUBICACION':
                       items.push(new Ext.aft.Conf.EstructuraUbicacion({idioma: config.idioma}));
                        break;
                    case 'CONFINDICADOR':
                        items.push(new Ext.aft.Conf.indicadorPanel({idioma: config.idioma}));
                        break;
                }
            }
        } else {
            mostrarMensaje(1, config.idioma.lbRecursos);
        }

        _this.tabGeneralTransp = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            id: 'idTabGeneralTransp',
            items: items,
            autoWidth: true,
            listeners: {
                tabchange: function(p, t) {
                    initHotKeys(t);
                    if (t.id == 'estadosoperaciones') {
                        cargarStoresEstatus();
                    } else if (t.id == 'interfacesoperaciones') {
                        cargarStoresInterfaces();
                    } else if (t.id == 'gruposcuentas') {
                        cargarStoresGrupos();
                    }
                }
            }

        });

        this.items = [_this.tabGeneralTransp];
        this.tbar = ['->', LOG.util.Prototipos.botonAyuda({
                id: 'idconfiguracionaft'
            })]
    }
});
Ext.aft.Conf.GridOperaciones = Ext.extend(Ext.grid.EditorGridPanel, {
    constructor: function(config) {
        var _this = this;
        this.region = 'center';
        this.tipo = config.tipo;
        this.scope = config.scope;
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '</br><b>',
                'Configuraciones.xml',
                ':</b></br></br>', '</b>{datosgenerales}', '</br></br>'
            )
        });
        this.stColumnReader = [
            {
                name: 'idnomoperaciones'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idestructuracomun'
            },
            {
                name: 'idsubsistema'
            },
            {
                name: 'codigooperacion'
            },
            {
                name: 'datosgenerales'
            }
        ];

        this.storeoperaciones = new Ext.data.Store({
            autoLoad: _this.autoLoad,
            url: '/logistica/activos_fijos/configuracion/index.php/confparametrosgenerales/leerXmlConfiguracion',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'codigo'
                },
                {
                    name: 'codigooperacion'
                }, 
                {
                    name: 'detalles'
                }
            ])
        });

        this.columsCM = [
            new Ext.LOG.PagingRowNumberer(),
            {
                width: 300,
                header: config.etiquetas.lbCmdenoper,
                dataIndex: 'denominacion',
                id: 'denomoperacion'
            },
            {
                width: 180,
                header: config.etiquetas.lbCmCodigoOpe,
                dataIndex: 'codigooperacion',
                id: 'codigooperacion',
                editor: new Ext.form.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    store: _this.storeoperaciones,
                    valueField: 'codigooperacion',
                    displayField: 'codigooperacion',
                    hiddenName: 'codigo',
                    editable: false,
                    mode: 'local',
                    tpl: '<tpl for="."><div ext:qtip="{detalles}" class="x-combo-list-item">{codigooperacion}</div></tpl>',
                    resizable: true,
                    emptyText: 'Seleccione...',
                    listeners: {
                        'select': function(combo, record, index) {

                            // Ext.getCmp('idSaveConf').enable();
                            // var rc = gridUsuarios.getSelectionModel().getSelected();
                            // rc.set('idespecialidad', record.get('idespecialidad'));
                            // gridUsuarios.getStore().commitChanges();
                        },
                        'change': function(firld, newValue, oldValue) {
                            if (newValue != oldValue) {
                                Ext.getCmp('idSaveConf').enable();
                            } else {
                                Ext.getCmp('idSaveConf').disable();
                            }
                        }
                    }
                })
            },
            _this.expander
        ];
        this.plugins = _this.expander;


        this.store = new Ext.data.Store({
            url: '/logistica/activos_fijos/configuracion/index.php/confparametrosgenerales/cargaroperacionescontable',
            autoLoad: _this.autoLoad,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: "total",
                id: 'denominacion'
            }, _this.stColumnReader),
            listeners: {
                'beforeload': function(st) {
                    Ext.getBody().mask('Cargando...', 'x-mask-loading');
                    st.baseParams.tipo = _this.tipo;
                },
                'load': function(st, records, options) {
                    st.commitChanges();
                    Ext.getCmp('idSaveConf').disable();
                    Ext.getBody().unmask();

                }
            }
        });
        this.sm = new Ext.grid.RowSelectionModel({
            id: 'smgridconfiguracion',
            singleSelect: false,
            listeners: {
                'rowselect': function(sm, rowIndex, r) {
                    if (sm.getSelections().length > 0) {
                        Ext.getCmp('idbtnEliminarcodopera').enable();
                    } else
                        Ext.getCmp('idbtnEliminarcodopera').disable();
                },
                'rowdeselect': function(sm) {
                    if (sm.getSelections().length > 0) {
                        Ext.getCmp('idbtnEliminarcodopera').enable();
                    } else
                        Ext.getCmp('idbtnEliminarcodopera').disable();
                    // Ext.getCmp('btnModificarTipoMedio').disable();
                }
            }
        });
        this.cm = new Ext.grid.ColumnModel(_this.columsCM);


        this.bbar = new Ext.PagingToolbar({
            pageSize: 30,
            store: _this.store,
            displayInfo: true,
            displayMsg: config.etiquetas.lbGpMsgBBar,
            emptyMsg: config.etiquetas.lbGpMsgBBar2
        });
        Ext.aft.Conf.GridOperaciones.superclass.constructor.apply(this, arguments);
    },
    cargarStore:function(){
        var _this = this;
        this.store.load();
        this.storeoperaciones.load();
    }
});

function initHotKeys(tab) {
    document.onkeyup = function(e) {
        if (typeof tab.activarHotKey == 'function') {
            tab.activarHotKey(e);
        }

        /*if (e.altKey) {
         if (e.which == Ext.EventObject.H) {
         var referencia = 'Logistica/Gestiondeltransporte/Configuraciontransportacion';
         var titulo = conf.idioma.lbTitleAyuda;
         help.show(titulo, referencia);
         }
         }*/
    }
}
