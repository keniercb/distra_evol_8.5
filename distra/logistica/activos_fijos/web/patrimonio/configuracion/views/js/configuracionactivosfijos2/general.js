/**
 * Javier Martin Rojas
 * Fichero encargado de la configuracion de los parametros generales
 **/
Ext.ns('Ext.erp');
Ext.ns('Ext.aft.Conf');

Ext.erp.auxiliaresPG = {};
Ext.erp.auxiliaresPGR = {};
var encontrado = false;

Ext.erp.ParametrosGenerales = new Ext.extend(Ext.TabPanel, {
    verificaModificar: '',
    nodeSelect: false,
    constructor: function(config) {

        var _this = this;
        this.title = config.etiquetas.lbTpGeneral;
        this.labelWidth = 110;
        this.labelAlign = 'top';
        this.activeTab = 0;
        this.buttonAlign = 'right';

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

        if (acciones_reportes.length > 0) {
            for (var i = 0; i < acciones_reportes.length; i++) {
                if (acciones_reportes[i].abreviatura == 'CONFROLUSER')
                    encontrado = true;
            }
        }
        var tabGeneral = new Ext.form.FormPanel({
            title: config.etiquetas.lbTgeneral,
            frame: true,
            labelWidth: 110,
            labelAlign: 'top',
            id: 'idtabGeneralCfgGeneral',
            bodyStyle: 'padding: 10px',
            buttonAlign: 'right',
            autoValidate: true,
            validateDefault: true,
            listeners: {
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
                    xtype: 'fieldset',
                    title: config.etiquetas.lbFsDepreciacion,
                    style: '-moz-border-radius:5px',
                    autoHeight: true,
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
                        }
                    ]
                }
            ]
        });


        var storeCmbReportes = new Ext.data.Store({
            url: _this.urlControladora + 'cargarestados',
            autoLoad: true,
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

        var treeLoader = new Ext.tree.TreeLoader({
            dataUrl: _this.urlControladora + 'cargarArbol',
            listeners: {
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

        /* var tabConfReportes = new Ext.form.FormPanel({
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

         });*/

        var btnAsociar = new Ext.Button({
            iconCls: 'asociar',
            disabled: true,
            text: config.etiquetas.lbBtnAsociar,
            tooltip: config.etiquetas.lbTplBtnAsociar,
            handler: function() {
                _this.showWindowIntegradoPersona({etiquetas: config.etiquetas, nodo: _this.nodeSelect});
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
            autoLoad: true,
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
                    btnGuardar.disable();
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
            autoLoad: true,
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

        var btnGuardar = new Ext.Button({
            iconCls: 'guardar',
            disabled: true,
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
                                    btnGuardar.enable();
                            }
                        }
                    })
                }
            ],
            tbar: [btnGuardar, btnEliminar],
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
            id: 'idConfUserRol',
            hidden: true,
            items: [gridUsuarios],
            activarHotKey: function(e) {
                if (e.altKey) {
                    if (e.which == Ext.EventObject.G) {
                        if (!btnGuardar.disabled)
                            btnGuardar.handler();
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
        this.items = [tabGeneral, /* tabConfReportes,*/ tabResponsablesPorAreas];
        if (encontrado)
            this.items.push(tabConfigurarUsuariosRol);
        this.buttons = [
            {
                text: config.etiquetas.lbBtnGuardar,
                iconCls: 'guardar',
                disabled: true,
                id: 'idSaveConf',
                tooltip: config.etiquetas.lbTtBtnGuardarPG,
                handler: function() {
                    var params = {};
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
                        params.deprecia = (Ext.getCmp('ckdeprecia').getValue()) ? 1 : 0;
                        // params.cantidad = Ext.getCmp('idtextfMaxCantidad').getValue();
                        params.explotacionadquisición = (Ext.getCmp('primero').getValue()) ? 1 : 0;
                        params.fechaadquisicion = (Ext.getCmp('segundo').getValue()) ? 1 : 0;

                        params.prefijo = Ext.getCmp('tfPrefijonroinv').getValue();
                        params.autogenerado = (Ext.getCmp('ckgenautomatico').getValue()) ? 1 : 0;

                        params.contabilidad = (Ext.getCmp('ckcontabilidad').getValue()) ? 1 : 0;
                        params.inventario = (Ext.getCmp('ckinventario').getValue()) ? 1 : 0;
                        params.talleres = (Ext.getCmp('cktalleres').getValue()) ? 1 : 0;
                        params.persona = (Ext.getCmp('ckpersona').getValue()) ? 1 : 0;
                    // }

                    Ext.getBody().mask(config.etiquetas.lbMsgEliminandoRelacion, 'x-mask-loading');
                    Ext.Ajax.request({
                        url: _this.urlControladora + 'guardarparametros',
                        method: 'POST',
                        params: params,
                        callback: function(options, success, response) {
                            Ext.getBody().unmask();
                            if (success) {
                                mostrarMensaje(1, config.etiquetas.lbModCorrecGC)
                            }
                        }
                    })
                }
            }
        ];
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
                initHotKeys(tab);
                _this.doLayout();
            }
        };
        Ext.erp.ParametrosGenerales.superclass.constructor.apply(this, arguments);
    },
    initGeneral: function(config) {
        var _this = this;

        Ext.Ajax.request({
            url: _this.urlControladora + 'cargarconfiguracion',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
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

                (Ext.erp.auxiliaresPG.autogenerado == '1') ? Ext.getCmp('ckgenautomatico').setValue(true) : Ext.getCmp('ckgenautomatico').setValue(false);
                Ext.getCmp('ckgenautomatico').originalValue = Ext.getCmp('ckgenautomatico').getValue();
                Ext.getCmp('tfPrefijonroinv').setValue(Ext.erp.auxiliaresPG.prefijo);
                Ext.getCmp('tfPrefijonroinv').originalValue = Ext.getCmp('tfPrefijonroinv').getValue();

                (Ext.erp.auxiliaresPG.contabilidad == '1') ? Ext.getCmp('ckcontabilidad').setValue(true) : Ext.getCmp('ckcontabilidad').setValue(false);
                Ext.getCmp('ckcontabilidad').originalValue = Ext.getCmp('ckcontabilidad').getValue();
                (Ext.erp.auxiliaresPG.inventario == '1') ? Ext.getCmp('ckinventario').setValue(true) : Ext.getCmp('ckinventario').setValue(false);
                Ext.getCmp('ckinventario').originalValue = Ext.getCmp('ckinventario').getValue();
                (Ext.erp.auxiliaresPG.talleres == '1') ? Ext.getCmp('cktalleres').setValue(true) : Ext.getCmp('cktalleres').setValue(false);
                Ext.getCmp('cktalleres').originalValue = Ext.getCmp('cktalleres').getValue();
                (Ext.erp.auxiliaresPG.persona == '1') ? Ext.getCmp('ckpersona').setValue(true) : Ext.getCmp('ckpersona').setValue(false);
                Ext.getCmp('ckpersona').originalValue = Ext.getCmp('ckpersona').getValue();

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

        var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            region: 'center',
            id: 'panelBusPer',
            singleSelect: true,
            identidad: perfil.idestructuracomun,
            showBtnAdicionar: true,
            modulo: 'LOGISTICA',
            showBtnAdicionar: false,
            showBtnAyuda: false
        });


        var btnAceptar = new Ext.Button({
            text: 'Aceptar ',
            // iconCls: 'aceptar',
            iconCls: 'aceptar',
            disabled: true,
            tooltip: config.etiquetas.lbTtBtnAceptarI,
            handler: function() {
                    if (panelBusPer.getSeleccion()) {

                        parametros.idpersona = panelBusPer.getSeleccion().get('idpersona');
                        parametros.tipo = 1;
                        (config.nodo.attributes.idestructuraubicacion)? parametros.idestructuraubicacion =config.nodo.attributes.idestructuraubicacion:"";
                        (config.nodo.attributes.iddeposito)? parametros.idarearesp = config.nodo.attributes.iddeposito:"";

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

        var btnCancelar = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: config.etiquetas.lbTtBtnCancelarI,
            handler: function() {
                    winBuscarPersona.close();
                    _this.keymap.disable();
                }
        });

        panelBusPer.smPersonas.on({
            'rowselect': function(sm, rowIndex, r) {
                if (sm.selections.items.length > 0) {
                    btnAceptar.enable();
                } else {
                    btnAceptar.disable();
                }
            },
            'rowdeselect': function(sm, rowIndex, r) {
                if (sm.selections.items.length > 0) {
                    btnAceptar.enable();
                } else {
                    btnAceptar.disable();
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
            items: [panelBusPer],
            buttons: [btnCancelar, btnAceptar]
        });

        _this.keymap = new Ext.KeyMap(document, [
            {key: 88,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (btnCancelar.enable()) {
                        btnCancelar.handler();
                    }
                }
            },
            {key: 13,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function()
                {
                    if (btnAceptar && btnAceptar.enable()) {
                        btnAceptar.handler();
                    }
                }
            }

        ]);
        _this.keymap.stopEvent = true;
        _this.keymap.enable();

        winBuscarPersona.show();
    },
    eliminarAsociacion: function(config) {
        var _this = this;
        mostrarMensaje(2, config.etiquetas.msgConfirmEliminarResponsable, function(btn) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url: _this.urlControladora + 'eliminarAsociacion',
                    method: 'POST',
                    params: {
                        idarearesp: config.nodo.id
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
    }
});

Ext.erp.configuracionactivosfijos = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        conf = config;
        this.frame = true;
        this.layout = 'fit';
        this.getItemsTrans(config);

        Ext.erp.configuracionactivosfijos.superclass.constructor.call(this, config);
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
                        items.push(new Ext.erp.ParametrosGenerales({etiquetas: config.idioma}));
                        break;
                        /*case 'CONFESTOPR':
                         items.push(new Ext.erp.estadosoperaciones({etiquetas: config.idioma}));
                         break;*/
                    case 'CONFGRUPCUENTAS':
                        items.push(new Ext.erp.gruposcuentas({etiquetas: config.idioma}));
                        break;
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

        var tabGeneralTransp = new Ext.TabPanel({
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

        this.items = [tabGeneralTransp];
        this.tbar = ['->', LOG.util.Prototipos.botonAyuda({
                id: 'idconfiguracionaft'
            })]
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
