Ext.ns('LOG.trans', 'LOG.trans.controldisponibilidad');
LOG.trans.controldisponibilidad.View = Ext.extend(Ext.Viewport, {
    bloqueada: false,
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        _this.plugins = new Array();
        _this.pluginsObjetos = new Array();
        _this.pluginsCM = new Array();
        for (var i = 0; i < arrCampos.length; i++) {
            _this.attatchPlugin(arrCampos[i]);
        }
        _this.campos = LOG.aft.RegOperativo.Campos;
        for (var i = 0; i < _this.plugins.length; i++) {
            _this.plugins[i].init(_this)
        }
        for (var cmp  in _this.campos) {
            var objeto = _this.campos[cmp];
            _this.pluginsObjetos[objeto['dataIndex']] = objeto['header'];
            _this.pluginsCM.push(objeto['dataIndex']);
        }

        this.btnActualizar = new Ext.Button({
            disabled: true,
            id: 'btnActualizar',
            iconCls: 'actualizar',
            text: _this.idioma.lbBtnActualizar,
            tooltip: _this.idioma.lbTtBtnActualizar,
            handler: function () {
                _this.actualizarEstadoMedio(_this.gridCentral.getSelectionModel().getSelected());
            }
        });

        this.btnVerResumen = new Ext.Button({
            id: 'btnVerResumen',
            iconCls: 'ver',
            text: _this.idioma.lbBtnVerResumen,
            tooltip: _this.idioma.lbTtBtnVerResumen,
            handler: function () {
                var estructuras = _this.treeCentral.getChecked("id");
                var idnodo = (_this.gridCentral.getSelectionModel().hasSelection()) ? _this.gridCentral.getSelectionModel().getSelected().data.idindicador : null;
                if (estructuras.length > 0) {
                    _this.verResumenDisponibilidad(estructuras, idnodo);
                } else {
                    mostrarMensaje(1, _this.idioma.lbMostrarEstructura);
                }
            }
        });
        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            iconCls: 'exportar',
            text: _this.idioma.lbBtnExportar,
            tooltip: _this.idioma.lbTtBtnExportar,
            handler: function () {
                _this.exportarResumen();
            }
        });

        //****Graficas*****
        var storeDatos = new Ext.data.Store({
            url: '/logistica/activos_fijos/cdt/index.php/controldisponibilidad/mostrarResumen',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idindicador'
            }, [
                {name: 'denominacion'},
                {name: 'idindicador'},
                {name: 'cantidad'},
                {name: 'disponible'},
                {name: 'porciento'},
            ])
        });

        this.btnGraficar = new Ax.Charts.Views.ChartButton({
            cls: 'tbar',
            chartType: 'column',
            text: 'Graficar disponibilidad t\xe9cnica',
            tooltip: 'Graficar disponibilidad t\xe9cnica',
            disabled: true,
            updateSourceStores: function () {
                _this.btnGraficar.addSerieStore("Disponibilidad T\xe9cnica", storeDatos, {
                    x: {
                        source: "denominacion",
                        label: "Denominaci\xf3n"
                    },
                    y: {
                        source: "cantidad",
                        label: "Porciento (Disponible/Cantidad) (%)"
                    }
                }, [{
                        name: 'Disponible',
                        source: 'disponible'
                    }, {
                        name: 'Cantidad',
                        source: 'cantidad'
                    }, {
                        name: 'Porciento',
                        source: 'porciento'
                    }]);

                return true;
            }, listeners: {
                'click': function () {
                    var estructuras = [_this.idNodoSeleccionado];
                    var idnodo = (_this.gridCentral.getSelectionModel().hasSelection()) ? _this.gridCentral.getSelectionModel().getSelected().data.idindicador : null;
                    if (estructuras.length > 0) {
                        storeDatos.baseParams = {estructurasIn: Ext.encode(estructuras), nodo: idnodo};
                        storeDatos.load();
                    }
                }
            }
        });
        //****************
        this.banderaparalizado = false;

        this.btnAyuda = LOG.util.Prototipos.botonAyuda({
            id: 'idcdt'
        });


        this.pFiltro = new LOG.trans.pFiltro({
            idioma: _this.idioma,
            border: false,
            bodyBorder: false,
            height: 45,
            fnFiltrar: function (values) {
                var estructuras = _this.treeCentral.getChecked("id");


                _this.gridCentral.getStore().reload({
                    params: {
                        query_denominacionmarcamodelo: values.denominacion,
                        indicativo: values.indicativo,
                        nromatricula: values.nromatricula,
                        actividad: values.actividad,
                        estructuras: Ext.encode(estructuras)
                    },
                    callback: function () {
                        _this.gridCentral.getStore().baseParams = {};
                    }
                });
            }
        })

        this.gridCentral = new LOG.trans.gpCtrolDisponibilidad({
            idioma: _this.idioma,
            region: 'center',
            id: 'idgpCtrolDisponibilidad',
            urlStore: 'mostrarMediosTransporte',
            sm: new Ext.grid.CheckboxSelectionModel(),
            columnas: _this.pluginsCM
        });
        this.gridCentral.getSelectionModel().fireEvent = this.gridCentral.getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'rowdeselect') {
                _this.btnActualizar.disable();
            }
            if (e == 'rowselect' && _this.gridCentral.getSelectionModel().getSelected().data._is_leaf) {
                _this.btnActualizar.enable();
            }
        });

        /*this.treeCentral = new LOG.trans.tpCtrolDisponibilidad({
         id: 'idtpCtrolDisponibilidad',
         urlLoader: 'getEntidadesDelDominio',
         autoScroll: true,
         idioma: _this.idioma
         });*/

        var configu = {
            doAction: function (nodo) {
                function funcion() {
                    _this.idNodoSeleccionado = nodo.attributes.id;
                    _this.denomNodoSeleccionado = nodo.attributes.text;
                    var nodoPadre = _this.treeCentral.dameNodoEntidadPertenece(nodo.attributes.id);
                    _this.idPadreNodoSeleccionado = nodoPadre.attributes.id;
                    _this.denomPadreNodoSeleccionado = nodoPadre.attributes.text;
                    _this.gridCentral.changeSelction(_this.idNodoSeleccionado);
                    _this.cargarGrid();

                }
                funcion();
            }
        };
        this.treeCentral = new Log.AF.Utiles.ArbolAreaResp({
            bodyStyle: 'background: white',
            id: 'idtpCtrolDisponibilidad',

            entidad: _this.denomPadreNodoSeleccionado,
            identidad: _this.idPadreNodoSeleccionado,
            region: 'center',
            border: false,
            bodyBorder: false,
            urlParams: 'cargarcomboarea',
            check: {
                conCheck: -1,
                chequeados: new Array()
            }
        });
        this.treeCentral.getLoader().on({
            'load': function (treeloader, node, response) {
                _this.cargarGrid();
            }
        });
        /*this.treeCentral.on({
         'checkchange': function(node, checked) {
         // Para mandar a cargar y expandir todos los nodos hijos
         if (checked && !node.isExpanded()) {
         node.expand(true);
         }
         
         // Para marcar y desmarcar todos los nodos hijos de un arbol ya cargado.
         node.eachChild(function(nodohijo) {
         nodohijo.ui.toggleCheck();
         });
         
         // Para cargar el grid cada vez que se cambie la seleccion de algun nodo
         if (node.isLoaded || node.attributes.leaf) {
         _this.cargarGrid();
         }
         }
         });*/
        this.treeCentral.getSelectionModel().on({
            'selectionchange': function (sm, newnode) {
                // _this.gridCentral.getStore().load();
            }
        });

        this.gridCentral.getSelectionModel().on({
            'rowselect': function (obj, rowIndex, record) {
                if (record.data._is_leaf && record.data.idregnumerico) {
                    _this.btnActualizar.enable();
                }
                if (parseInt(record.data.nivel) + 1 == record.data.ultimonivel) {
                    var estructuras = [_this.idNodoSeleccionado];
                    var idnodo = (_this.gridCentral.getSelectionModel().hasSelection()) ? _this.gridCentral.getSelectionModel().getSelected().data.idindicador : null;
                    storeDatos.baseParams = {estructurasIn: Ext.encode(estructuras), nodo: idnodo};
                    storeDatos.load();
                    window.setTimeout(function () {
                        _this.btnGraficar.enable();
                    }, 200);
                } else {
                    _this.btnGraficar.disable();

                }
            },
            'rowdeselect': function () {
                _this.btnActualizar.disable();
                _this.btnGraficar.disable();
            }
        });

        config = Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'border',
                    border: false,
                    bodyBorder: false,
                    tbar: [_this.btnActualizar, /*_this.btnVerResumen, */this.btnGraficar, _this.btnExportar, '->', _this.btnAyuda],
                    items: [
                        {
                            xtype: 'panel',
                            region: 'center',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'north',
                                    layout: 'fit',
                                    autoHeight: true,
                                    border: false,
                                    bodyBorder: false,
                                    split: true,
                                    collapseMode: 'mini',
                                    collapsible: true,
                                    items: [_this.pFiltro]
                                },
                                _this.gridCentral
                            ]
                        },
                        {
                            region: 'west',
                            layout: 'fit',
                            width: 255,
                            minSize: 255,
                            maxSize: 500,
                            collapsible: true,
                            collapseMode: 'mini',
                            autoScroll: true,
                            animCollapse: false,
                            animate: false,
                            split: true,
                            items: [_this.treeCentral]

                        }


                    ]
                }
            ]
        });
        document.onkeyup = function (e) {
            if (!_this.bloqueada) {

                if (e.altKey && !e.ctrlKey) {

                    if (e.which == Ext.EventObject.E) {
                        if (_this.btnExportar) {
                            if (!_this.btnExportar.disabled) {
                                _this.btnExportar.handler();
                            }
                        }

                    } else if (e.which == Ext.EventObject.B) {
                        if (_this.pFiltro.btnBuscar) {
                            _this.pFiltro.btnBuscar.handler();
                        }

                    } else if (e.which == Ext.EventObject.L) {
                        if (Ext.getCmp('idWinAvanzadaDisponibilidad') && Ext.getCmp('idWinAvanzadaDisponibilidad').isVisible()) {
                            Ext.getCmp('idbtnLimpiarWinAvzDisp').handler();
                        } else
                        if (_this.pFiltro.btnLimpiar) {
                            _this.pFiltro.btnLimpiar.handler();
                        }

                    } else if (e.which == Ext.EventObject.H) {
                        _this.btnAyuda.handler();
                    } else if (e.which == Ext.EventObject.X) {
                        if (Ext.getCmp('idWinResumenDisponibilidad') && Ext.getCmp('idWinResumenDisponibilidad').isVisible())
                        {
                            Ext.getCmp('btnCancelarResumenDisponibilidad').handler();
                        } else if (Ext.getCmp('idWinAvanzadaDisponibilidad') && Ext.getCmp('idWinAvanzadaDisponibilidad').isVisible()) {
                            Ext.getCmp('idbtnCancelarWinAvzDisp').handler();
                        } else if (_this.ventanaActualizar && _this.ventanaActualizar.isVisible()) {
                            Ext.getCmp('idbtnCancelarWinUpdate').handler();
                        }
                    }

                } else if (e.altKey && e.ctrlKey) {

                    if (e.which == Ext.EventObject.Z) {
                        if (_this.btnActualizar) {
                            if (!_this.btnActualizar.disabled) {
                                _this.btnActualizar.handler();
                            }
                        }

                    } else if (e.which == Ext.EventObject.M) {
                        if (_this.btnVerResumen) {
                            if (!_this.btnVerResumen.disabled) {
                                _this.btnVerResumen.handler();
                            }
                        }
                    }
                }

                if (e.which == Ext.EventObject.ENTER) {
                    if (_this.ventanaActualizar && _this.ventanaActualizar.isVisible()) {
                        Ext.getCmp('idbtnAceptarWinUpdateDisp').handler();
                    } else
                    if (Ext.getCmp('idWinAvanzadaDisponibilidad') && Ext.getCmp('idWinAvanzadaDisponibilidad').isVisible()) {
                        Ext.getCmp('idbtnAceptarWinAvzDisp').handler();
                    }
                }


            }
        };
        this.cargarEntidadComboArea(config);
        this.treeCentral.initEventos(configu);
    },
    attatchPlugin: function (plugin) {
        this.plugins.push(plugin);
    },
    actualizarEstadoMedio: function (record) {
        var _this = this;

        Ext.getBody().mask(_this.idioma.lbLoadMaskCargando, 'x-mask-loading');

        var marca = record.get('marca');
        var modelo = record.get('modelo');

        var taDescripcion = new Ext.form.TextArea({
            anchor: '100%',
            fieldLabel: this.idioma.lbObservaciones
        });

        var fieldCausa = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbCausa,
            labelAlign: 'top',
            height: 50,
            name: 'causa',
            anchor: '95%'
        });


        var fieldFecha = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFecha,
            allowBlank: false,
            anchor: '80%'

        });

        var stUbicacion = new Ext.data.SimpleStore({
            fields: ['id', 'descripcion'],
            data: [],
            autoLoad: false
        });

        this.cmbUbicacion = new Ext.form.TextField({
            anchor: '80%',
            allowBlank: false,
            labelAlign: 'top',
            fieldLabel: this.idioma.lbUbicacion
        });

        var arregloEstatus = Array();
        var cbEstado = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbCmEstatus,
            allowBlank: false,
            displayField: 'denominacion',
            valueField: 'idestatusoperativo',
            hiddenName: 'idestatusoperativo',
            triggerAction: 'all',
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: new Ext.data.Store({
                url: 'getSubEstatus',
                autoLoad: true/*,
                 baseParams: {
                 idpadre: record.get('idestado')
                 }*/,
                reader: new Ext.data.JsonReader({
                    id: 'idestatusoperativo',
                    root: 'datos',
                    totalProperty: 'cantidad'
                }, [
                    {
                        name: 'idestatusoperativo'
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'disponible'
                    },
                    {
                        name: 'afectacdt'
                    },
                    {
                        name: 'pordefecto'
                    }
                ]),
                listeners: {
                    'load': function (store, records) {
                        /*arregloEstatus = records;
                         if (record.get('idestatustecnico'))
                         cbEstado.setValue(record.get('idestatustecnico'));
                         
                         if (record.get('descripcionestado'))
                         taDescripcion.setValue(record.get('descripcionestado'));*/

                        Ext.getBody().unmask();
                    },
                    'beforeload': function (store, records) {
                        store.baseParams.idestatustecnico = record.data.idestatustecnico;
                    }
                }
            }),
            listeners: {
                'select': function (combo, recordcmb, index) {
                    if (recordcmb.data.afectacdt == "1" && recordcmb.data.disponible == "0") {
                        _this.banderaparalizado = true;
                        _this.ventanaActualizar.setHeight(505);
                        Ext.getCmp('idtabpanelDisponibilidad').add(panelTab2);
                    } else {
                        _this.banderaparalizado = false;
                        Ext.getCmp('idtabpanelDisponibilidad').remove(panelTab2);
                    }
                }
            },
            forceSelection: true
        });

        var textAreaObservaciones = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbDatosObservaciones,
            labelAlign: 'top',
            height: 80,
            allowBlank: false,
            name: 'observaciones',
            anchor: '90%'

        });

        var textAreaMotivos = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbDatosMotivo,
            labelAlign: 'top',
            allowBlank: false,
            height: 50,
            name: 'motivos',
            anchor: '95%'

        });

        var textAreaPendientes = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbDatosPendientes,
            labelAlign: 'top',
            allowBlank: false,
            height: 50,
            name: 'pendientes',
            anchor: '95%'

        });

        var panelTab2 = new Ext.form.FormPanel({
            frame: true,
            title: _this.idioma.lbDatosEspecificos,
            border: false,
            bodyBorder: false,
            // autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .50,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [_this.cmbUbicacion]
                        }
                    ]
                },
                {
                    labelAlign: 'top',
                    layout: 'form',
                    items: [textAreaMotivos, textAreaPendientes, fieldCausa]
                }
            ]
        });

        var itemsPrimerColum = [
            {
                fieldLabel: _this.idioma.lbCmDenominacion,
                xtype: 'textfield',
                value: record.get('denominacion'),
                readOnly: true
            }/*,
             {
             fieldLabel: _this.idioma.lbMarcaModelo,
             xtype: 'textfield',
             value: record.get('marca') + '-' + record.get('modelo'),
             readOnly: true
             },
             {
             fieldLabel: _this.idioma.lbCmMatricula,
             xtype: 'textfield',
             value: record.get('nromatricula'),
             readOnly: true
             }*/
        ];
        if (record.get('identificador'))
        {
            itemsPrimerColum.push({
                fieldLabel: _this.pluginsObjetos[record.get('identificador')],
                xtype: 'textfield',
                value: record.get(record.get('identificador')),
                readOnly: true
            });
        }

        _this.ventanaActualizar = new LOG.util.Window({
            title: _this.idioma.lbTitleActEstatus,
            height: 365,
            //id: 'idWinUpdateDisp',
            width: 580,
            resizable: false,
            modal: true,
            items: [new Ext.Panel({
                    autoHeight: true,
                    border: false,
                    region: 'north',
                    bodyBorder: false,
                    frame: true,
                    items: [
                        {
                            xtype: 'fieldset',
                            anchor: '100%',
                            title: _this.idioma.lbFsDatGenerales,
                            layout: 'column',
                            autoHeight: true,
                            items: [
                                {
                                    columnWidth: .50,
                                    layout: 'form',
                                    items: itemsPrimerColum
                                },
                                {
                                    columnWidth: .50,
                                    layout: 'form',
                                    labelWidth: 60,
                                    items: [
                                        {
                                            fieldLabel: _this.idioma.lbActividad,
                                            xtype: 'textfield',
                                            value: record.get('actividad'),
                                            readOnly: true

                                        },
                                        {
                                            fieldLabel: _this.idioma.lbTtCmEstatus,
                                            xtype: 'textfield',
                                            value: record.get('denominacionestado'),
                                            readOnly: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }),
                new Ext.TabPanel({
                    activeTab: 0,
                    height: 495,
                    region: 'center',
                    id: 'idtabpanelDisponibilidad',
                    items: [
                        new Ext.form.FormPanel({
                            frame: true,
                            title: _this.idioma.lbDatosGenerales,
                            border: false,
                            height: 495,
                            bodyBorder: false,
                            //autoHeight: true,
                            items: [
                                {
                                    layout: 'column',
                                    labelWidth: 50,
                                    items: [
                                        {
                                            columnWidth: .50,
                                            layout: 'form',
                                            items: [cbEstado]
                                        },
                                        {
                                            columnWidth: .50,
                                            layout: 'form',
                                            items: [fieldFecha]
                                        }
                                    ]
                                },
                                {
                                    labelAlign: 'top',
                                    layout: 'form',
                                    items: [textAreaObservaciones]
                                }
                            ]
                        })
                    ],
                    layoutOnTabChange: true
                })
            ],
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: _this.idioma.lbBtnCancelar,
                    id: 'idbtnCancelarWinUpdate',
                    tooltip: _this.idioma.lbTtBtnCancelar,
                    handler: function () {
                        _this.ventanaActualizar.close();
                    }
                },
                {
                    iconCls: 'aceptar',
                    text: _this.idioma.lbBtnAceptar,
                    id: 'idbtnAceptarWinUpdateDisp',
                    tooltip: _this.idioma.lbTtBtnAceptar,
                    handler: function () {
                        if (_this.banderaparalizado) {
                            if (!textAreaMotivos.getValue() || !textAreaPendientes.getValue() || !fieldCausa.getValue()) {
                                Ext.getCmp('idtabpanelDisponibilidad').setActiveTab(panelTab2);
                                mostrarMensaje(3, 'Debe llenar los campos espec&iacute;ficos')
                                if (!textAreaMotivos.getValue()) {
                                    textAreaMotivos.markInvalid();
                                }
                                if (!textAreaPendientes.getValue()) {
                                    textAreaPendientes.markInvalid();
                                }
                                if (!fieldCausa.getValue()) {
                                    fieldCausa.markInvalid();
                                }
                                if (!_this.cmbUbicacion.getValue()) {
                                    _this.cmbUbicacion.markInvalid();
                                }
                                return false;
                            }
                        }
                        Ext.Ajax.request({
                            url: 'modificarEstadoMedio',
                            method: 'POST',
                            params: {
                                paralizado: (_this.banderaparalizado) ? 2 : 3,
                                idregnumerico: record.get('idregnumerico'),
                                idprod: record.get('idprod'),
                                idestatusoperativo: cbEstado.getValue(),
                                fecha: fieldFecha.getValue(),
                                causa: fieldCausa.getValue(),
                                observaciones: textAreaObservaciones.getValue(),
                                ubicacion: _this.cmbUbicacion.getValue(),
                                motivo: textAreaMotivos.getValue(),
                                pendiente: textAreaPendientes.getValue()
                            },
                            callback: function (options, success, response) {

                                var resp = Ext.decode(response.responseText);

                                if (resp.cod == 1) {
                                    mostrarMensaje(1, _this.idioma.lbMsgGuardarOK, function () {
                                        var padre = _this.gridCentral.getStore().find('idindicador', record.data.idpadre);
                                        padre = _this.gridCentral.getStore().getAt(padre);

                                        _this.gridCentral.getSelectionModel().clearSelections();
                                        _this.gridCentral.getStore().load();
                                        _this.ventanaActualizar.close();

                                    });
                                } else {
                                    mostrarMensaje(3, _this.idioma.lbMsgGuardarError);
                                    cbEstado.markInvalid();
                                    fieldFecha.markInvalid();
                                }
                            }
                        })
                    }
                }
            ]
        });

        _this.ventanaActualizar.show();
    },
    verResumenDisponibilidad: function (estructuras, idnodo) {
        var _this = this;

        Ext.getBody().mask(_this.idioma.lbLoadMaskCargando, 'x-mask-loading');

        var pDisponibilidad = new LOG.trans.pDisponibilidad({
            idioma: _this.idioma,
            region: 'center'
        });
        var idnodo = (_this.gridCentral.getSelectionModel().hasSelection()) ? _this.gridCentral.getSelectionModel().getSelected().data.idindicador : null;
        var inicial = true;
        pDisponibilidad.treeColumn.loader.on({
            'beforeload': function (loader, node, callback) {
                loader.baseParams.estructurasIn = Ext.encode(estructuras);
                if (!inicial) {
                    loader.baseParams.nodo = node.id;
                } else if (inicial && idnodo) {
                    loader.baseParams.nodo = idnodo;
                }
                Ext.getBody().mask(_this.idioma.lbLoadMaskCargando, 'x-mask-loading');
            },
            'load': function (loader, node, response) {
                Ext.getBody().unmask();
                idnodo = null;
                inicial = false;
            }
        });

        var ventana = new LOG.util.Window({
            title: _this.idioma.lbTitleResumen,
            height: 450,
            width: 800,
            modal: true,
            layout: 'border',
            frame: true,
            //closeAction: 'close',
            items: [pDisponibilidad],
            buttons: [
                {
                    iconCls: 'cancelar',
                    //id: 'btnCancelarResumenDisponibilidad',
                    text: _this.idioma.lbBtnCerrar,
                    tooltip: _this.idioma.lbTtBtnCerrar,
                    handler: function () {
                        ventana.close();
                    }
                }
            ]
        })

        ventana.show();
    },
    exportarResumen: function () {
        /* var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
         var ventana = window.open('exportarResumen', 'ventana', wCfg);*/
        var _this = this;
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    params: {
                        entidad: LOG.trans.utf8_encode(_this.entidad),
                        idestructura: _this.identidad
                    },
                    dirReport: '/distra/logistica/activofijo/cdt/ReporteResumenCDT',
                    detailFirma: {}
                }
            ]
        }).view();
    },
    cargarGrid: function () {
        var _this = this;
        _this.gridCentral.getStore().load();

    },
    getWinAreasResponsabilidad: function () {
        var _this = this;
        Ext.getBody().mask(_this.idioma.lbLoadMaskCargando, 'x-mask-loading');
        if (!_this.cmpAreaRespWin) {
            _this.cmpAreaRespWin = new Log.AF.Utiles.WinContainer({
                modal: true,
                doAction: function (nodo) {
                    function funcion() {
                        _this.cmbUbicacion.setValue(nodo.attributes.id);
                        _this.cmbUbicacion.setRawValue(nodo.attributes.text);
                        _this.cmpAreaRespWin.hide();

                    }
                    funcion();
                    /*if (nodo.getDepth() == 0) {
                     
                     //  Es padre
                     _this.tipo_area_seleccionada = 'entidad';
                     Ext.getCmp('idAdicionarBtn').disable();
                     Ext.getCmp('idTrasladoBtn').disable();
                     funcion();
                     } else if (nodo.attributes.interna) {
                     
                     //  Es un área responzabilidad
                     _this.tipo_area_seleccionada = 'arearesp';
                     Ext.getCmp('idAdicionarBtn').enable();
                     Ext.getCmp('idTrasladoBtn').enable();
                     
                     funcion();
                     } else {
                     _this.tipo_area_seleccionada = 'otra';
                     mostrarMensaje(1, _this.idioma.lbNoEsAreaResp);
                     Ext.getCmp('idAdicionarBtn').disable();
                     Ext.getCmp('idTrasladoBtn').disable();
                     }*/
                },
                entidad: _this.entidad,
                identidad: _this.identidad,
                listeners: {
                    'beforeshow': function () {
                        Ext.getBody().unmask();
                    }
                }
            });
        } else {
            _this.cmpAreaRespWin.show();
        }
    },
    cargarEntidadComboArea: function (config) {
        var _this = this;
        Ext.Ajax.request({
            url: 'getentidad',
            method: 'POST',
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.identidad = rd.identidad;
                _this.entidad = rd.entidad;
                _this.treeCentral.asignarNodoPadre(rd.entidad, rd.identidad);
                LOG.trans.controldisponibilidad.View.superclass.constructor.call(this, config);

            }
        });
    }
});
LOG.trans.pFiltro = Ext.extend(LOG.util.Panel, {
    formFiltro: false,
    values: {},
    constructor: function (config) {
        var _this = this;

        Ext.applyIf(this, config);

        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            text: _this.idioma.lbBtnBuscar,
            tooltip: _this.idioma.lbTtBtnBuscar,
            handler: function () {
                _this.filtrar();
            }
        });

        this.btnBusquedaAvanza = new Ext.Button({
            id: 'busqAvanz',
            iconCls: 'buscar',
            text: _this.idioma.lbBtnBusqueA,
            tooltip: _this.idioma.lbTtBtnBusqueA,
            handler: function () {
                var ventana = new LOG.trans.ventanaBusquedaAvanzada({idioma: _this.idioma});
                ventana.show();
            }
        });

        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            text: _this.idioma.lbBtnLimpiar,
            tooltip: _this.idioma.lbTtBtnLimpiar,
            handler: function () {
                _this.formFiltro.getForm().reset();
                _this.values = {};
                _this.filtrar();
            }
        });

        var ind = new Ext.form.TextField({
            enableKeyEvents: true,
            name: 'indicativo',
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.filtrar();
                    }
                }
            }
        });

        var mat = new Ext.form.TextField({
            enableKeyEvents: true,
            name: 'nromatricula',
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.filtrar();
                    }
                }
            }
        });
        var grupo = new Ext.form.TextField({
            anchor: '100%',
            xtype: 'textfield',
            name: 'actividad',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.filtrar();
                    }
                }
            }
        });

        this.formFiltro = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            items: [
                {
                    columnWidth: .43,
                    layout: 'column',
                    tbar: ['-', new Ext.form.Label({text: 'Indicativo: '}), ' ', ind,
                        '-', new Ext.form.Label({text: 'Matr\xedcula: '}), ' ', mat,
                        '-', new Ext.form.Label({text: 'Grupo explotaci\xf3n: '}), ' ', grupo,
                        _this.btnBuscar,
                        _this.btnBusquedaAvanza,
                        _this.btnLimpiar]
                }
            ]
        });
        Ext.applyIf(this, {
            layout: 'fit',
            items: _this.formFiltro
        });


        var tempHotKeysDocument = [];
        function callkeydownhandler(evnt) {
            var ev = (evnt) ? evnt : event;
            var code = (ev.which) ? ev.which : event.keyCode;

            var busquedaAvz = '18|66|65'; // Alt|b|a


            if (code == 18) { // alt
                tempHotKeysDocument = [18];

            } else if (code == 17) { //Ctrl
                tempHotKeysDocument = [17];
            } else {
                tempHotKeysDocument.push(code);

                if (tempHotKeysDocument.length == 3) {
                    if (tempHotKeysDocument.join('|') == busquedaAvz) {
                        if (Ext.getCmp('busqAvanz')) {
                            Ext.getCmp('busqAvanz').handler();
                        }
                    }
                }
            }
        }

        if (window.document.addEventListener) {
            window.document.addEventListener("keydown", callkeydownhandler, false);
        } else {
            window.document.attachEvent("onkeydown", callkeydownhandler);
        }


        LOG.trans.pFiltro.superclass.constructor.apply(this, arguments);
    },
    filtrar: function () {
        var _this = this;

        if (_this.formFiltro.getForm().isValid()) {
            _this.values = _this.formFiltro.getForm().getValues();
            if (_this.fnFiltrar) {
                _this.fnFiltrar(_this.values);
            }
        }
    },
    getValues: function () {
        return this.values;
    }
});

Ext.ns('Ext.ux.grid');
Ext.ux.grid.ProgressColumn = function (config) {
    Ext.apply(this, config);
    this.renderer = this.renderer.createDelegate(this);
    this.addEvents('action');
    Ext.ux.grid.ProgressColumn.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.grid.ProgressColumn, Ext.util.Observable, {
    /**
     * @cfg {String} colored determines whether use special progression coloring
     *      or the standard Ext.ProgressBar coloring for the bar (defaults to
     *      false)
     */
    textPst: '%',
    /**
     * @cfg {String} colored determines whether use special progression coloring
     *      or the standard Ext.ProgressBar coloring for the bar (defaults to
     *      false)
     */
    colored: false,
    /**
     * @cfg {String} actionEvent Event to trigger actions, e.g. click, dblclick,
     *      mouseover (defaults to 'dblclick')
     */
    actionEvent: 'dblclick',
    init: function (grid) {
        this.grid = grid;
        this.view = grid.getView();

        if (this.editor && grid.isEditor) {
            var cfg = {
                scope: this
            };
            cfg[this.actionEvent] = this.onClick;
            grid.afterRender = grid.afterRender.createSequence(function () {
                this.view.mainBody.on(cfg);
            }, this);
        }
    },
    onClick: function (e, target) {
        var rowIndex = e.getTarget('.x-grid3-row').rowIndex;
        var colIndex = this.view.findCellIndex(target.parentNode.parentNode);

        var t = e.getTarget('.x-progress-text');
        if (t) {
            this.grid.startEditing(rowIndex, colIndex);
        }
    },
    renderer: function (v, p, record) {
        var style = '';
        var textClass = (v < 55) ? 'x-progress-text-back' : 'x-progress-text-front' + (Ext.isIE6 ? '-ie6' : '');
        if (v == 0)
            textClass = 'x-progress-text-wrong';
        //ugly hack to deal with IE6 issue
        var text = String.format('</div><div class="x-progress-text {0}" style="width:100%;" id="{1}">{2}</div></div>',
                textClass, Ext.id(), v + this.textPst
                );
        text = (v < 96) ? text.substring(0, text.length - 6) : text.substr(6);

        if (this.colored == true) {
            if (v <= 50 && v >= 0)
                style = '-red';
            if (v < 70 && v > 50)
                style = '-orange';
            if (v > 70)
                style = '-green';
        }
        p.css += ' x-grid3-progresscol';
        return String.format(
                '<div class="x-progress-wrap"><div class="x-progress-inner"><div class="x-progress-bar{0}" style="width:{1}%;">{2}</div>' +
                '</div>', style, v, text
                );
    }
});
Ext.ns('Ext.ux.grid.filter');
Ext.ux.grid.filter.Filter = Ext.extend(Ext.util.Observable, {
    active: false,
    dataIndex: null,
    menu: null,
    updateBuffer: 500,
    constructor: function (config) {
        Ext.apply(this, config);

        this.addEvents(
                'activate',
                'deactivate',
                'serialize',
                'update'
                );
        Ext.ux.grid.filter.Filter.superclass.constructor.call(this);

        this.menu = new Ext.menu.Menu();
        this.init(config);
        if (config && config.value) {
            this.setValue(config.value);
            this.setActive(config.active !== false, true);
            delete config.value;
        }
    },
    destroy: function () {
        if (this.menu) {
            this.menu.destroy();
        }
        this.purgeListeners();
    },
    init: Ext.emptyFn,
    getValue: Ext.emptyFn,
    setValue: Ext.emptyFn,
    isActivatable: function () {
        return true;
    },
    getSerialArgs: Ext.emptyFn,
    validateRecord: function () {
        return true;
    },
    serialize: function () {
        var args = this.getSerialArgs();
        this.fireEvent('serialize', args, this);
        return args;
    },
    fireUpdate: function () {
        if (this.active) {
            this.fireEvent('update', this);
        }
        this.setActive(this.isActivatable());
    },
    setActive: function (active, suppressEvent) {
        if (this.active != active) {
            this.active = active;
            if (suppressEvent !== true) {
                this.fireEvent(active ? 'activate' : 'deactivate', this);
            }
        }
    }
});
Ext.ux.grid.filter.StringFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
    iconCls: 'ux-gridfilter-text-icon',
    emptyText: 'Enter Filter Text...',
    selectOnFocus: true,
    width: 125,
    init: function (config) {
        Ext.applyIf(config, {
            enableKeyEvents: true,
            iconCls: this.iconCls,
            listeners: {
                scope: this,
                keyup: this.onInputKeyUp
            }
        });

        this.inputItem = new Ext.form.TextField(config);
        this.menu.add(this.inputItem);
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
    },
    getValue: function () {
        return this.inputItem.getValue();
    },
    setValue: function (value) {
        this.inputItem.setValue(value);
        this.fireEvent('update', this);
    },
    isActivatable: function () {
        return this.inputItem.getValue().length > 0;
    },
    getSerialArgs: function () {
        return {type: 'string', value: this.getValue()};
    },
    validateRecord: function (record) {
        var val = record.get(this.dataIndex);

        if (typeof val != 'string') {
            return (this.getValue().length === 0);
        }

        return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
    },
    onInputKeyUp: function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
            this.menu.hide(true);
            return;
        }
        // restart the timer
        this.updateTask.delay(this.updateBuffer);
    }
});
Ext.ux.grid.GridFilters = Ext.extend(Ext.util.Observable, {
    autoReload: true,
    filterCls: 'ux-filtered-column',
    local: false,
    menuFilterText: 'Filters',
    paramPrefix: 'filter',
    showMenu: true,
    stateId: undefined,
    updateBuffer: 500,
    constructor: function (config) {
        config = config || {};
        this.deferredUpdate = new Ext.util.DelayedTask(this.reload, this);
        this.filters = new Ext.util.MixedCollection();
        this.filters.getKey = function (o) {
            return o ? o.dataIndex : null;
        };
        this.addFilters(config.filters);
        delete config.filters;
        Ext.apply(this, config);
    },
    init: function (grid) {
        if (grid instanceof Ext.grid.GridPanel) {
            this.grid = grid;

            this.bindStore(this.grid.getStore(), true);
            // assumes no filters were passed in the constructor, so try and use ones from the colModel
            if (this.filters.getCount() == 0) {
                this.addFilters(this.grid.getColumnModel());
            }

            this.grid.filters = this;

            this.grid.addEvents({'filterupdate': true});

            grid.on({
                scope: this,
                beforestaterestore: this.applyState,
                beforestatesave: this.saveState,
                beforedestroy: this.destroy,
                reconfigure: this.onReconfigure
            });

            if (grid.rendered) {
                this.onRender();
            } else {
                grid.on({
                    scope: this,
                    single: true,
                    render: this.onRender
                });
            }

        } else if (grid instanceof Ext.PagingToolbar) {
            this.toolbar = grid;
        }
    },
    applyState: function (grid, state) {
        var key, filter;
        this.applyingState = true;
        this.clearFilters();
        if (state.filters) {
            for (key in state.filters) {
                filter = this.filters.get(key);
                if (filter) {
                    filter.setValue(state.filters[key]);
                    filter.setActive(true);
                }
            }
        }
        this.deferredUpdate.cancel();
        if (this.local) {
            this.reload();
        }
        delete this.applyingState;
        delete state.filters;
    },
    saveState: function (grid, state) {
        var filters = {};
        this.filters.each(function (filter) {
            if (filter.active) {
                filters[filter.dataIndex] = filter.getValue();
            }
        });
        return (state.filters = filters);
    },
    onRender: function () {
        this.grid.getView().on('refresh', this.onRefresh, this);
        this.createMenu();
    },
    destroy: function () {
        this.removeAll();
        this.purgeListeners();

        if (this.filterMenu) {
            Ext.menu.MenuMgr.unregister(this.filterMenu);
            this.filterMenu.destroy();
            this.filterMenu = this.menu.menu = null;
        }
    },
    removeAll: function () {
        if (this.filters) {
            Ext.destroy.apply(Ext, this.filters.items);
            // remove all items from the collection
            this.filters.clear();
        }
    },
    bindStore: function (store, initial) {
        if (!initial && this.store) {
            if (this.local) {
                store.un('load', this.onLoad, this);
            } else {
                store.un('beforeload', this.onBeforeLoad, this);
            }
        }
        if (store) {
            if (this.local) {
                store.on('load', this.onLoad, this);
            } else {
                store.on('beforeload', this.onBeforeLoad, this);
            }
        }
        this.store = store;
    },
    onReconfigure: function () {
        this.bindStore(this.grid.getStore());
        this.store.clearFilter();
        this.removeAll();
        this.addFilters(this.grid.getColumnModel());
        this.updateColumnHeadings();
    },
    createMenu: function () {
        var view = this.grid.getView(),
                hmenu = view.hmenu;

        if (this.showMenu && hmenu) {

            this.sep = hmenu.addSeparator();
            this.filterMenu = new Ext.menu.Menu({
                id: this.grid.id + '-filters-menu'
            });
            this.menu = hmenu.add({
                checked: false,
                itemId: 'filters',
                text: this.menuFilterText,
                menu: this.filterMenu
            });

            this.menu.on({
                scope: this,
                checkchange: this.onCheckChange,
                beforecheckchange: this.onBeforeCheck
            });
            hmenu.on('beforeshow', this.onMenu, this);
        }
        this.updateColumnHeadings();
    },
    getMenuFilter: function () {
        var view = this.grid.getView();
        if (!view || view.hdCtxIndex === undefined) {
            return null;
        }
        return this.filters.get(
                view.cm.config[view.hdCtxIndex].dataIndex
                );
    },
    onMenu: function (filterMenu) {
        var filter = this.getMenuFilter();

        if (filter) {
            /*
             TODO: lazy rendering
             if (!filter.menu) {
             filter.menu = filter.createMenu();
             }
             */
            this.menu.menu = filter.menu;
            this.menu.setChecked(filter.active, false);
            // disable the menu if filter.disabled explicitly set to true
            this.menu.setDisabled(filter.disabled === true);
        }

        this.menu.setVisible(filter !== undefined);
        this.sep.setVisible(filter !== undefined);
    },
    onCheckChange: function (item, value) {
        this.getMenuFilter().setActive(value);
    },
    onBeforeCheck: function (check, value) {
        return !value || this.getMenuFilter().isActivatable();
    },
    onStateChange: function (event, filter) {
        if (event === 'serialize') {
            return;
        }

        if (filter == this.getMenuFilter()) {
            this.menu.setChecked(filter.active, false);
        }

        if ((this.autoReload || this.local) && !this.applyingState) {
            this.deferredUpdate.delay(this.updateBuffer);
        }
        this.updateColumnHeadings();

        if (!this.applyingState) {
            this.grid.saveState();
        }
        this.grid.fireEvent('filterupdate', this, filter);
    },
    onBeforeLoad: function (store, options) {
        options.params = options.params || {};
        this.cleanParams(options.params);
        var params = this.buildQuery(this.getFilterData());
        Ext.apply(options.params, params);
    },
    onLoad: function (store, options) {
        store.filterBy(this.getRecordFilter());
    },
    onRefresh: function () {
        this.updateColumnHeadings();
    },
    updateColumnHeadings: function () {
        var view = this.grid.getView(),
                i, len, filter;
        if (view.mainHd) {
            for (i = 0, len = view.cm.config.length; i < len; i++) {
                filter = this.getFilter(view.cm.config[i].dataIndex);
                Ext.fly(view.getHeaderCell(i))[filter && filter.active ? 'addClass' : 'removeClass'](this.filterCls);
            }
        }
    },
    reload: function () {
        if (this.local) {
            this.grid.store.clearFilter(true);
            this.grid.store.filterBy(this.getRecordFilter());
        } else {
            var start,
                    store = this.grid.store;
            this.deferredUpdate.cancel();
            if (this.toolbar) {
                start = store.paramNames.start;
                if (store.lastOptions && store.lastOptions.params && store.lastOptions.params[start]) {
                    store.lastOptions.params[start] = 0;
                }
            }
            store.reload();
        }
    },
    getRecordFilter: function () {
        var f = [], len, i;
        this.filters.each(function (filter) {
            if (filter.active) {
                f.push(filter);
            }
        });

        len = f.length;
        return function (record) {
            for (i = 0; i < len; i++) {
                if (!f[i].validateRecord(record)) {
                    return false;
                }
            }
            return true;
        };
    },
    addFilter: function (config) {
        var Cls = this.getFilterClass(config.type),
                filter = config.menu ? config : (new Cls(config));
        this.filters.add(filter);

        Ext.util.Observable.capture(filter, this.onStateChange, this);
        return filter;
    },
    addFilters: function (filters) {
        if (filters) {
            var i, len, filter, cm = false, dI;
            if (filters instanceof Ext.grid.ColumnModel) {
                filters = filters.config;
                cm = true;
            }
            for (i = 0, len = filters.length; i < len; i++) {
                filter = false;
                if (cm) {
                    dI = filters[i].dataIndex;
                    filter = filters[i].filter || filters[i].filterable;
                    if (filter) {
                        filter = (filter === true) ? {} : filter;
                        Ext.apply(filter, {dataIndex: dI});
                        // filter type is specified in order of preference:
                        //     filter type specified in config
                        //     type specified in store's field's type config
                        filter.type = filter.type || this.store.fields.get(dI).type.type;
                    }
                } else {
                    filter = filters[i];
                }
                // if filter config found add filter for the column
                if (filter) {
                    this.addFilter(filter);
                }
            }
        }
    },
    getFilter: function (dataIndex) {
        return this.filters.get(dataIndex);
    },
    clearFilters: function () {
        this.filters.each(function (filter) {
            filter.setActive(false);
        });
    },
    getFilterData: function () {
        var filters = [], i, len;

        this.filters.each(function (f) {
            if (f.active) {
                var d = [].concat(f.serialize());
                for (i = 0, len = d.length; i < len; i++) {
                    filters.push({
                        field: f.dataIndex,
                        data: d[i]
                    });
                }
            }
        });
        return filters;
    },
    buildQuery: function (filters) {
        var p = {}, i, f, root, dataPrefix, key, tmp,
                len = filters.length;

        if (!this.encode) {
            for (i = 0; i < len; i++) {
                f = filters[i];
                root = [this.paramPrefix, '[', i, ']'].join('');
                p[root + '[field]'] = f.field;

                dataPrefix = root + '[data]';
                for (key in f.data) {
                    p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
                }
            }
        } else {
            tmp = [];
            for (i = 0; i < len; i++) {
                f = filters[i];
                tmp.push(Ext.apply(
                        {},
                        {field: f.field},
                        f.data
                        ));
            }
            // only build if there is active filter
            if (tmp.length > 0) {
                p[this.paramPrefix] = Ext.util.JSON.encode(tmp);
            }
        }
        return p;
    },
    cleanParams: function (p) {
        // if encoding just delete the property
        if (this.encode) {
            delete p[this.paramPrefix];
            // otherwise scrub the object of filter data
        } else {
            var regex, key;
            regex = new RegExp('^' + this.paramPrefix + '\[[0-9]+\]');
            for (key in p) {
                if (regex.test(key)) {
                    delete p[key];
                }
            }
        }
    },
    getFilterClass: function (type) {
        // map the supported Ext.data.Field type values into a supported filter
        switch (type) {
            case 'auto':
                type = 'string';
                break;
            case 'int':
            case 'float':
                type = 'numeric';
                break;
            case 'bool':
                type = 'boolean';
                break;
        }
        return Ext.ux.grid.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
    }
});
Ext.preg('gridfilters', Ext.ux.grid.GridFilters);

LOG.trans.gpCtrolDisponibilidad = Ext.extend(Ext.ux.maximgb.GridPanel, {
    initComponent: function (config) {

        var _this = this;
        this.stripeRows = true;
        this.autoExpandColumn = 'denominacion';
        this.master_column_id = 'denominacion';
        this.stripeRows = true;
        this.tbar = new Ext.Toolbar({});
        this.root_title = _this.idioma.lbRootGpControlDisp;
        this.viewConfig = {enableRowBody: true};
        this.loadMask = {
            msg: _this.idioma.lbLoadMaskCargando
        };

        Ext.apply(this, config);
        var columns = _this.columnas.concat([
            {
                name: 'descripcionmarcamodelo'
            }, {
                name: 'marca'
            },
            {
                name: 'modelo'
            },
            {
                name: '_parent'
            },
            {
                name: '_is_leaf'
            },
            {
                name: '_level'
            },
            {
                name: '_expand'
            },
            {
                name: 'icon'
            },
            {
                name: 'text'
            },
            {
                name: 'nromatricula'
            },
            {
                name: 'nroserie'
            },
            {
                name: 'idindicador'
            },
            {
                name: 'indicativo'
            },
            {
                name: 'idregnumerico'
            },
            {
                name: 'idmostrar'
            },
            {
                name: 'denominacionestado'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idpadre'
            },
            {
                name: 'idarbol'
            },
            {
                name: 'ultimonivel'
            },
            {
                name: 'nivel'
            },
            {
                name: 'ordenizq'
            },
            {
                name: 'ordender'
            },
            {
                name: 'idprod'
            },
            {
                name: 'idestatusoperativo'
            },
            {
                name: 'idactividad'
            },
            {
                name: 'idestatustecnico'
            },
            {
                name: 'actividad'
            },
            {
                name: 'identificador'
            }
        ]);
        this.store = new Ext.ux.maximgb.AdjacencyListStore({
            url: _this.urlStore,
            listeners: {
                'beforeexpandnode': function (st, record) {
                    // st.baseParams.idindicador = record.get('idindicador');
                    _this.getSelectionModel().selectRecords([record]);
                },
                'beforeload': function (st, opciones) {
                    var parametros = {
                        idnodo: 0,
                        nivel: 1,
                        ultimonivel: 0
                    };
                    var estructuras = (_this.id == 'idgpCtrolDisponibilidad') ? [] : [_this.id];
                    //var estructuras = Ext.getCmp('idtpCtrolDisponibilidad').getChecked("id");
                    if (estructuras.length > 0) {
                        st.baseParams.estructuras = Ext.encode(estructuras);
                        if (_this.getSelectionModel().getSelections().length > 0) {
                            var recordSeleccionado = _this.getSelectionModel().getSelected();
                            parametros['idnodo'] = recordSeleccionado.get('idindicador');
                            parametros['ordenizq'] = recordSeleccionado.get('ordenizq');
                            parametros['ordender'] = recordSeleccionado.get('ordender');
                            parametros['idpadre'] = recordSeleccionado.get('idpadre');
                            parametros['idarbol'] = recordSeleccionado.get('idarbol');
                            parametros['nivel'] = parseInt(recordSeleccionado.get('nivel')) + 1;
                            parametros['ultimonivel'] = recordSeleccionado.get('ultimonivel');
                            ;

                            st.baseParams.anode = recordSeleccionado.get('idindicador');

                        } else {
                            st.baseParams.anode = null;
                        }
                    } else {
                        _this.getSelectionModel().clearSelections();
                        st.baseParams.anode = 0;
                    }
                    st.baseParams.parametros = Ext.encode(parametros);

                },
                'load': function (store, record, options) {

                    _this.renderFiltroCM();
                    store.baseParams = {};
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: 'idmostrar',
                successProperty: 'success'
            }, columns)
        });


        LOG.trans.gpCtrolDisponibilidad.cm = new Ext.grid.ColumnModel([
            {
                id: 'denominacion',
                header: _this.idioma.lbCmDenominacion,
                width: 160,
                dataIndex: 'denominacion',
                renderer: function (value, metaData, record) {
                    var images = '';
                    if (record.get('_is_leaf'))
                    {
                        images = '<img src="/configuracion/comun/views/images/treegrid/leaf.gif">';

                    } else
                    {
                        images = '<img src="/configuracion/comun/views/images/treegrid/folder.gif">';

                    }
                    return _this.renderFiltro(this, value, null, null, images);
                }
            },
            {
                header: _this.idioma.lbTtCmMarca,
                width: 100,
                dataIndex: 'marca',
                id: 'marca',
                renderer: function (value, metaData) {
                    return _this.renderFiltro(this, value);
                }
            },
            {
                header: _this.idioma.lbTtCmModelo,
                width: 100,
                dataIndex: 'modelo',
                id: 'modelo',
                renderer: function (value, metaData) {
                    return _this.renderFiltro(this, value);
                }
            },
            {
                header: _this.idioma.lbCmMatricula,
                width: 100,
                id: 'nromatricula',
                dataIndex: 'nromatricula',
                renderer: function (value, metaData) {
                    return _this.renderFiltro(this, value);
                }
            },
            {
                header: _this.idioma.lbTtCmMIndicativo,
                width: 100,
                dataIndex: 'indicativo',
                id: 'nroserie',
                renderer: function (value, metaData) {
                    return _this.renderFiltro(this, value);
                }
            }, {
                header: _this.idioma.lbTtCmEstatus,
                width: 100,
                dataIndex: 'denominacionestado',
                id: 'denominacionestado',
                renderer: function (value, metaData) {
                    return  _this.renderFiltro(this, value);
                }
            },
            {
                header: _this.idioma.lbTtCmActividad,
                width: 100,
                dataIndex: 'actividad',
                id: 'actividad',
                renderer: function (value, metaData) {
                    return  _this.renderFiltro(this, value);
                }
            }

        ]);

        this.cm = LOG.trans.gpCtrolDisponibilidad.cm;

        LOG.trans.filtroColumnas = new Ext.ux.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacionestado'
                },
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                },
                {
                    type: 'string',
                    dataIndex: 'modelo'
                }, {
                    type: 'string',
                    dataIndex: 'marca'
                },
                {
                    type: 'string',
                    dataIndex: 'nromatricula'
                },
                {
                    type: 'string',
                    dataIndex: 'nroserie'
                },
                {
                    type: 'string',
                    dataIndex: 'actividad'
                }

            ]
        });
        this.plugins = LOG.trans.filtroColumnas;

        LOG.trans.gpCtrolDisponibilidad.superclass.initComponent.call(this, arguments);
    },
    renderFiltro: function (columna, value, pos, _fnRenderContenido, images) {

        var indexColumna = LOG.trans.gpCtrolDisponibilidad.cm.getIndexById(columna.id);
        var filtro = LOG.trans.filtroColumnas.filters.get(columna.id);
        var filtroValue = filtro.getValue();

        if (typeof (filtroValue) == 'object') {
            filtroValue = ("'" + filtroValue.eq + "'") ? filtroValue.eq : false;
        }

        var filtrado = (typeof (filtroValue) != 'undefined' && filtro.active) ? true : false;

        if (filtrado && _fnRenderContenido && filtroValue) {
            filtroValue = _fnRenderContenido(filtroValue);
        }

        if (value) {

            if (filtrado) {

                value = value.replace(eval('/' + filtroValue + '/gi'), '<span style="background-color: yellow">' + filtroValue + '</span>') + ((pos) ? pos : '');
            }
            if (images)
            {
                return images + " " + (value + ((pos) ? pos : ''));
            } else
            {
                return value + ((pos) ? pos : '');
            }

        }
    },
    renderFiltroCM: function () {
        var _this = this;
        var filtro = LOG.trans.filtroColumnas.filters;

        if (filtro) {

            for (var i = 0; i < filtro.items.length; i++) {
                var indexColumna = LOG.trans.gpCtrolDisponibilidad.cm.getIndexById(filtro.itemAt(i).dataIndex);
                var oldColumnHeader = LOG.trans.gpCtrolDisponibilidad.cm.getColumnHeader(indexColumna);
                var newColumnHeader = oldColumnHeader.replace('<u><b>', '');
                newColumnHeader = newColumnHeader.replace('</b></u>', '');

                if (filtro.itemAt(i).active) {
                    newColumnHeader = '<u><b>' + newColumnHeader + '</b></u>';
                }
                LOG.trans.gpCtrolDisponibilidad.cm.setColumnHeader(indexColumna, newColumnHeader);
            }

            /* // Recargar los nivales del formato seleccionado
             if (LOG.trans.filtroColumnas.getMenuFilter()) {
             if (LOG.trans.filtroColumnas.getMenuFilter().dataIndex == 'idformato') {
             Ext.erp.indicadores.storeNivelesFormato.load();
             }
             }*/

        }

    },
    changeSelction: function (id) {
        this.id = id;
    }
});

LOG.trans.tpCtrolDisponibilidad = Ext.extend(Ext.tree.TreePanel, {
    urlLoader: '',
    baseParams: {},
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        var LoadMask;
        var firstTime = true;

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: _this.urlLoader,
            listeners: {
                'beforeload': function (loader, nodo, fncallback) {
                    loader.baseParams.checked = (nodo.attributes.checked) ? 1 : 0;

                    LoadMask = new Ext.LoadMask(_this.id, {
                        msg: _this.idioma.lbMsgCargando
                    });
                    LoadMask.show();
                },
                'load': function () {
                    LoadMask.hide();
                    if (firstTime) {
                        var estructuras = _this.getChecked("id");
                        Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.estructuras = Ext.encode(estructuras);
                        Ext.getCmp('idgpCtrolDisponibilidad').getStore().load();
                        firstTime = false;
                    }
                }
            }
        });

        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            expanded: true,
            animate: false,
            iconCls: 'nodo',
            text: _this.idioma.lbtree
        });

        LOG.trans.tpCtrolDisponibilidad.superclass.constructor.apply(this, arguments);
    }
});

LOG.trans.ventanaBusquedaAvanzada = Ext.extend(LOG.util.Window, {
    constructor: function (config) {

        var _this = this;
//        _this.id = 'idWinAvanzadaDisponibilidad';
        Ext.apply(this, config);

        Ext.apply(Ext.form.VTypes, {
            daterange: function (val, field) {
                var date = field.parseDate(val);
                if (!date) {
                    return;
                }
                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                    var start = Ext.getCmp(field.startDateField);
                    start.setMaxValue(date);
                    start.validate();
                    this.dateRangeMax = date;
                } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                    var end = Ext.getCmp(field.endDateField);
                    end.setMinValue(date);
                    end.validate();
                    this.dateRangeMin = date;
                }
                return true;
            }
        });

        var btnCancelar = new Ext.Button({
//            id: 'idbtnCancelarWinAvzDisp',
            iconCls: 'cancelar',
            tooltip: _this.idioma.btnTCancelarBusq,
            text: _this.idioma.lbBtnCancelar,
            handler: function () {
                _this.close();
            }
        });


        var btnLimpiar = new Ext.Button({
            id: 'idbtnLimpiarWinAvzDisp',
            iconCls: 'limpiar',
            tooltip: _this.idioma.lbTtBtnLimpiar,
            text: _this.idioma.lbBtnLimpiar,
            handler: function () {
                fechafin.setMinValue(null);
                fechafin.setMaxValue(null);
                fechainicio.setMaxValue(null);
                fechainicio.setMinValue(null);
                fechafin.reset();
                fechainicio.reset();
                _this.matricula.reset();
                denominacion.reset();
                indicativo.reset();
                _this.marca.reset();
                _this.modelo.reset();
                _this.status.reset();
                _this.statusOperativo.reset();
                _this.motivo.reset();
                _this.causa.reset();
                _this.pendiente.reset();
            }
        });

        var btnAceptar = new Ext.Button({
//            id: 'idbtnAceptarWinAvzDisp',
            iconCls: 'aceptar',
            tooltip: _this.idioma.btnTAceptarBusq,
            text: _this.idioma.lbBtnAceptar,
            handler: function () {

                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams = {};
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.marca = (_this.marca.getValue() != '') ? _this.marca.getValue() : '';

                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.modelo = (_this.modelo.getValue() != '') ? _this.modelo.getValue() : '';
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.status = (_this.status.getValue() != '') ? _this.status.getValue() : '';
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.nromatricula = (_this.matricula.getValue() != '') ? _this.matricula.getValue() : '';
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.indicativo = (indicativo.getValue() != '') ? indicativo.getValue() : '';
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.denominacion = (denominacion.getValue() != '') ? denominacion.getValue() : '';
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.motivo = (_this.motivo.getValue() != '') ? _this.motivo.getValue() : '';
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.causa = (_this.causa.getValue() != '') ? _this.causa.getValue() : '';
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().baseParams.pendiente = (_this.pendiente.getValue() != '') ? _this.pendiente.getValue() : '';
                Ext.getCmp('idgpCtrolDisponibilidad').getStore().reload();
                _this.close();
            }
        });

        //Primera columna

        var denominacion = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbCmDenominacion,
            name: 'denominacion',
            anchor: '95%',
            maxLength: 255,
            maxLengthText: _this.idioma.lbMaximaLongitudTexto255,
            maskRe: /^([a-zA-ZáéíóúñüÑ0-9-_/()]+ ?[a-zA-ZáéíóúñüÑ0-9-_/()]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/()]+ ?[a-zA-ZáéíóúñüÑ0-9-_/()]*)+$/
        });


        _this.matricula = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbCmMatricula,
            name: 'matricula',
            anchor: '95%',
            maskRe: /^([a-zA-ZáéíóúñüÑ0-9]+ ?[a-zA-ZáéíóúñüÑ0-9]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ0-9]+ ?[a-zA-ZáéíóúñüÑ0-9]*)+$/
        });

        var indicativo = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbTtCmMIndicativo,
            name: 'indicativo',
            anchor: '95%',
            maskRe: /^([a-zA-ZáéíóúñüÑ0-9,.\s]+ ?[a-zA-ZáéíóúñüÑ0-9,.\s]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ0-9,.\s]+ ?[a-zA-ZáéíóúñüÑ0-9,.\s]*)+$/
        });


        var fechainicio = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbFechaInicio,
            anchor: '95%',
            name: 'fecha_inicio',
            emptyText: 'Seleccione..',
            id: 'fecha_inicio',
            vtype: 'daterange',
            endDateField: 'fecha_fin',
            editable: false
        });

        //Segunda columna      

        _this.storecmbmarca = new Ext.data.Store({
            url: 'getMarcas',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {
                    name: 'idmarca'
                },
                {
                    name: 'denominacion'
                }
            ])

        });

        _this.marca = new Ext.form.ComboBox({
            anchor: '95%',
            fieldLabel: _this.idioma.lbTtCmMarca,
            name: 'idmarca',
            valueField: 'idmarca',
            emptyText: 'Seleccione..',
            displayField: 'denominacion',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: _this.storecmbmarca,
            triggerAction: 'all',
            listWidth: 300,
            pageSize: 20,
            minChars: 0,
            resizable: true,
            typeAhead: true,
            forceSelection: true,
            mode: 'remote',
            listeners: {
                'select': function (combo, record, index) {
                    _this.storecmbmodelo.baseParams.idmarca = combo.getValue();
                    _this.storecmbmodelo.load();
                }/*,
                 'specialkey': function(cmp, e) {
                 if (e.getKey() == Ext.EventObject.ENTER) {
                 _this.buttons[2].handler();
                 }
                 }*/
            }
        });


        _this.storecmbmodelo = new Ext.data.Store({
            url: 'getModelos',
            listeners: {
                'beforeLoad': function (st) {
                    _this.modelo.reset();
                    _this.modelo.disable();
                },
                'load': function (st, records, options) {
                    if (records.length > 0) {
                        _this.modelo.enable();
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {
                    name: 'idmodelo'
                },
                {
                    name: 'denominacion'
                }
            ])

        });


        _this.modelo = new Ext.form.ComboBox({
            anchor: '95%',
            fieldLabel: _this.idioma.lbTtCmModelo,
            name: 'idmarca',
            valueField: 'idmodelo',
            emptyText: 'Seleccione..',
            displayField: 'denominacion',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: _this.storecmbmodelo,
            triggerAction: 'all',
            listWidth: 300,
            pageSize: 20,
            minChars: 0,
            resizable: true,
            typeAhead: true,
            forceSelection: true,
            mode: 'remote'
        });


        _this.storecmbstatus = new Ext.data.Store({
            url: 'getEstatus',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {
                    name: 'idestatustecnico'
                },
                {
                    name: 'denominacion'
                }
            ])

        });


        _this.storecmbstatusOp = new Ext.data.Store({
            url: 'getEstatusOperativo',
            listeners: {
                'beforeLoad': function (st) {
                    _this.statusOperativo.reset();
                    _this.statusOperativo.disable();
                },
                'load': function (st, records, options) {
                    if (records.length > 0) {
                        _this.statusOperativo.enable();
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {
                    name: 'idestatustecnico'
                },
                {
                    name: 'denominacion'
                }
            ])

        });

        _this.status = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbTtCmEstatus,
            name: 'statustecnico',
            valueField: 'idestatustecnico',
            displayField: 'denominacion',
            store: _this.storecmbstatus,
            emptyText: 'Seleccione..',
            triggerAction: 'all',
            anchor: '95%',
            listeners: {
                'select': function (combo, record, index) {
                    _this.storecmbstatusOp.baseParams.idestatus = combo.getValue();
                    _this.storecmbstatusOp.load();
                }
            }
        });

        _this.statusOperativo = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbTtCmEstatusOp,
            name: 'statusoperativo',
            valueField: 'idestatusoperativo',
            displayField: 'denominacion',
            emptyText: 'Seleccione..',
            store: _this.storecmbstatusOp,
            triggerAction: 'all',
            anchor: '95%'
        });


        var fechafin = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbFechaFin,
            anchor: '95%',
            name: 'fecha_fin',
            id: 'fecha_fin',
            emptyText: 'Seleccione..',
            vtype: 'daterange',
            startDateField: 'fecha_inicio',
            editable: false
        });


        _this.motivo = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbMotivo,
            name: 'motivo',
            height: 40,
            anchor: '99%',
            maxLength: 255,
            maxLengthText: _this.idioma.lbMaximaLongitudTexto255
        });

        _this.causa = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbCausa,
            name: 'causa',
            height: 40,
            anchor: '99%',
            maxLength: 255,
            maxLengthText: _this.idioma.lbMaximaLongitudTexto255
        });

        _this.pendiente = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbPendiente,
            name: 'pendiente',
            height: 40,
            anchor: '99%',
            maxLength: 255,
            maxLengthText: _this.idioma.lbMaximaLongitudTexto255
        });
        var panelNorte = new LOG.util.Panel({
            region: 'north',
            height: 248,
            border: false,
            bodyBorder: false,
            items: [{
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .50,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [denominacion, _this.matricula, indicativo, fechainicio, fechafin]
                        },
                        {
                            columnWidth: .50,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [_this.marca, _this.modelo, _this.status, _this.statusOperativo]
                        }
                    ]
                }
            ]
        });

        var panelSur = new LOG.util.Panel({
            region: 'south',
            height: 240,
            border: false,
            bodyBorder: false,
            items: [{
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.causa, _this.motivo, _this.pendiente]
                }
            ]
        });

        var panelderecho = new LOG.util.Panel({
            region: 'center',
            frame: true,
            items: [panelNorte, panelSur]
        });

        this.layout = 'border';
        this.modal = true;
        this.height = 530;
        this.width = 600;
        this.resizable = false;
        this.autoScroll = true;
        this.title = _this.idioma.lbTitleBusquedaAvanzada;
//        this.closeAction = 'close';
        this.buttons = [btnCancelar, btnLimpiar, btnAceptar];
        this.items = [panelderecho];

        LOG.trans.ventanaBusquedaAvanzada.superclass.constructor.apply(this, arguments);
    }
});

Ext.tree.ColumnTree = Ext.extend(Ext.tree.TreePanel, {
    lines: false,
    borderWidth: Ext.isBorderBox ? 0 : 2, // the combined left/right border for each cell
    cls: 'x-column-tree',
    onRender: function () {
        Ext.tree.ColumnTree.superclass.onRender.apply(this, arguments);
        this.headers = this.body.createChild(
                {cls: 'x-tree-headers'}, this.innerCt.dom);

        var cols = this.columns, c;
        var totalWidth = 0;

        for (var i = 0, len = cols.length; i < len; i++) {
            c = cols[i];
            totalWidth += c.width;
            this.headers.createChild({
                cls: 'x-tree-hd ' + (c.cls ? c.cls + '-hd' : ''),
                cn: {
                    cls: 'x-tree-hd-text',
                    html: c.header
                },
                style: 'width:' + (c.width - this.borderWidth) + 'px;'
            });
        }
        this.headers.createChild({cls: 'x-clear'});
        // prevent floats from wrapping when clipped
        this.headers.setWidth(totalWidth);
        this.innerCt.setWidth(totalWidth);
    }
});

Ext.tree.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    focus: Ext.emptyFn, // prevent odd scrolling behavior

    renderElements: function (n, a, targetNode, bulkRender) {
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var t = n.getOwnerTree();
        var cols = t.columns;
        var bw = t.borderWidth;
        var c = cols[0];

        var buf = [
            '<li class="x-tree-node"><div ext:tree-node-id="', n.id, '" class="x-tree-node-el x-tree-node-leaf ', a.cls, '">',
            '<div class="x-tree-col" style="width:', c.width - bw, 'px;">',
            '<span class="x-tree-node-indent">', this.indentMarkup, "</span>",
            '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow">',
            '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon', (a.icon ? " x-tree-node-inline-icon" : ""), (a.iconCls ? " " + a.iconCls : ""), '" unselectable="on">',
            '<a hidefocus="on" class="x-tree-node-anchor" href="', a.href ? a.href : "#", '" tabIndex="1" ',
            a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "", '>',
            '<span unselectable="on">', n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]), "</span></a>",
            "</div>"];
        for (var i = 1, len = cols.length; i < len; i++) {
            c = cols[i];

            buf.push('<div class="x-tree-col ', (c.cls ? c.cls : ''), '" style="width:', c.width - bw, 'px;">',
                    '<div class="x-tree-col-text">', (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]), "</div>",
                    "</div>");
        }
        buf.push(
                '<div class="x-clear"></div></div>',
                '<ul class="x-tree-node-ct" style="display:none;"></ul>',
                "</li>");

        if (bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()) {
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
                    n.nextSibling.ui.getEl(), buf.join(""));
        } else {
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        this.anchor = cs[3];
        this.textNode = cs[3].firstChild;
    }
});

LOG.trans.pDisponibilidad = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        var _this = this;

        Ext.apply(this, config);

        this.treeColumn = new Ext.tree.ColumnTree({
            lines: true,
            region: 'center',
            autoScroll: true,
            rootVisible: false,
            columns: [
                {
                    header: _this.idioma.lbCmDenominacion,
                    width: 365,
                    dataIndex: 'text'
                },
                {
                    header: _this.idioma.lbCmResumenPorciento,
                    width: 215,
                    dataIndex: 'porciento',
                    renderer: _this.getBarraProgreso
                },
                {
                    header: _this.idioma.lbCmTotal,
                    width: 60,
                    dataIndex: 'cantidad'
                },
                {
                    header: _this.idioma.lbCmDisponible,
                    width: 70,
                    dataIndex: 'disponible'
                }
            ],
            loader: new Ext.tree.TreeLoader({
                url: 'mostrarResumen',
                uiProviders: {
                    'col': Ext.tree.ColumnNodeUI
                }
            }),
            root: new Ext.tree.AsyncTreeNode({
                id: 0
            })
        });

        Ext.apply(this, {
            layout: 'border',
            items: [_this.treeColumn]
        });

        LOG.trans.pDisponibilidad.superclass.constructor.apply(this, arguments);
    },
    getBarraProgreso: function (valor) {
        return '<div style="position:absolute; background-color:#9cbfee; background-image:url(/logistica/utiles/comun/views/images/custom-bar.gif); border-top-color:#d1e4fd; border-bottom-color:#7fa9e4; border-right-color:#7fa9e4; width:' + (valor * 2) + 'px;">&nbsp</div><div align="center" style="border:1px solid #396095; position:absolute; font-size:11px; font-weight:bold; color:#396095; width:199px; height:12px;">' + valor + '%</div>';
    }
});

LOG.trans.utf8_encode = function (argString) {
    //  discuss at: http://phpjs.org/functions/utf8_encode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: sowberry
    // improved by: Jack
    // improved by: Yves Sucaet
    // improved by: kirilloid
    // bugfixed by: Onno Marsman
    // bugfixed by: Onno Marsman
    // bugfixed by: Ulrich
    // bugfixed by: Rafal Kukawski
    // bugfixed by: kirilloid
    //   example 1: utf8_encode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
            start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128
                    );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                    );
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                    );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}