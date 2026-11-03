//Namespace del componente Desglose de niveles de actividad
Ext.ns('Planificacion.BasesDelPlan.Desglose')

//Vista del componente Actividades asociadas a presupuesto
Planificacion.BasesDelPlan.Desglose.Vista = {
    /*Componente que inicializa la vista
     *@param: idioma Objeto que contiene el idioma de la aplicacion (type:Object)
     *@param: modelo Objeto que contiene los modelos para cargar los datos(type:Planificacion.BasesDelPlan.Desglose.Modelo)
     */
    identidadselected: null,
    is_leaf: false,
    tipo: null,
    nodo: 0,
    iddes: null,
    orden1: null,
    ptr_ordenactual: -1,
    ident: null,
    iddatoscolum: -1,
    text: null,
    iddatoscolumselecc: -1,
    esultimonivel: true,
    desgloses_realizados: [],
    idactividadentidadselec: null,
    columnadinamicaselec: null,
    idmodeloselec: null,
    idtipomodeloselec: null,
    idmodelo: null,
    idtipomodelo: null,
    press_buscar: false,
    press_configurar: false,
    tmpidentidadselecc: null,
    textconfig: null,
    esdesglozarcol: false,
    objci: {},
    mostrarColumAprobYPlan: true,
    esrector: false,
    verSoloColValores: false,
    init: function(idioma, modelo) {
        this.idioma = idioma;
        this.modelo = modelo;
        _this = this;
        this.mymask = new Ext.LoadMask(
                Ext.getBody(), {
            msg: idioma.lbCargando
        });

        this.filtrosdesglose_niv_act = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'filtrodesglosecodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                    strEmptyText: ''
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                },
                {
                    type: 'list',
                    dataIndex: 'comportamiento',
                    options: [perfil.etiquetas.lbPropia,
                        perfil.etiquetas.lbDemandada,
                        perfil.etiquetas.lbCompartida]
                }, {
                    type: 'listado',
                    dataIndex: 'denespecialidad',
                    idcombo: 'idcbespecialidad',
                    urlcb: 'listarEspecialidades',
                    idstore: 'idstespecialidad',
                    valueFieldcb: 'idespecialidad',
                    displayFieldcb: 'denespecialidad'
                }, {
                    type: 'list',
                    dataIndex: 'idaprobacionactent',
                    options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector]
                }, {
                    type: 'listado',
                    dataIndex: 'denmodelo',
                    idcombo: 'idcbmodelogestnivactividad',
                    urlcb: 'listarModelos',
                    idstore: 'idstmodelogestnivactividad',
                    valueFieldcb: 'idmodelo',
                    displayFieldcb: 'denominacion'
                }, {
                    type: 'numeric',
                    dataIndex: 'porciento'
                }, {
                    type: 'numeric',
                    dataIndex: 'nivelactividad'
                }]
        });

        this.treeEntidades = new Ext.tree.TreePanel({
            id: 'treeEntidades',
            autoScroll: true,
            height: 200,
            layout: 'fit',
            split: true,
            border: false,
            region: 'center',
            rootVisible: false,
            root: new Ext.tree.AsyncTreeNode({
                text: perfil.etiquetas.lbEntidades,
                tipo: 0,
                ident: -1,
                id: '0'
            }),
            loader: modelo.listadoEntidades,
            tbar: [{
                    id: 'expandirent',
                    iconCls: 'icon-expand-all',
                    tooltip: perfil.etiquetas.lbExpandirEnt, //'Expandir todas las entidades',
                    icon: perfil.dirImg + 'expand-all.gif',
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.treeEntidades.root.expand(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: perfil.etiquetas.lbColapsarEnt, //'Colapsar todas las entidades',
                    icon: perfil.dirImg + 'collapse-all.gif',
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.treeEntidades.root.collapse(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: perfil.etiquetas.lbRefrescarEnt, //'Refrescar todas las entidades',
                    icon: perfil.dirImg + 'table_refresh.png',
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.actualizarArbol(Planificacion.BasesDelPlan.Desglose.Vista.treeEntidades);
                    }
                },
                '-', {
                    xtype: 'textfield',
                    emptyText: 'Filtrar entidad...',
                    width: 110,
                    id: 'idfiltroent',
                    listeners: {
                        specialkey: function(t, e) {
                            if (e.getKey() == '13') {
                                buscarNodo(Planificacion.BasesDelPlan.Desglose.Vista.treeEntidades);
                            }
                        }
                    }
                }]
        });
        this.btnLimpiarFiltros = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarFiltros',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
            text: perfil.etiquetas.lbBtnLimpiar
        });
        this.treeDesgloses = new Ext.tree.TreePanel({
            id: 'treeDesgloses',
            autoScroll: true,
            region: 'south',
            collapsible: true,
            collapsed: true,
            titleCollapse: true,
            disabled: true,
            title: idioma.lbDesgloses,
            height: 200,
            split: true,
            border: false,
            rootVisible: true,
            root: new Ext.tree.AsyncTreeNode({
                text: idioma.lbDesgloses,
                tipo: 0,
                ident: -1,
                orden: -1,
                iddesglosetiponomenclador: -1,
                id: '0'
            }),
            loader: modelo.listadoPlanesConfDesg,
            contextMenu: new Ext.menu.Menu({
                items: [{
                        id: 'btneliminardesglose',
                        icon: perfil.dirImg + 'eliminar.png',
                        iconCls: 'btn',
                        disabled: false,
                        text: idioma.lbElimTodos,
                        handler: function() {
                            Planificacion.BasesDelPlan.Desglose.Vista.eliminarDesgloces();
                        }
                    }]
            }),
            tbar: [{
                    iconCls: 'icon-expand-all',
                    tooltip: perfil.etiquetas.lbExpandirDesgloses,
                    icon: perfil.dirImg + 'expand-all.gif',
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.treeDesgloses.root.expand(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: perfil.etiquetas.lbColapsarDesgloces,
                    icon: perfil.dirImg + 'collapse-all.gif',
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.treeDesgloses.root.collapse(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: perfil.etiquetas.lbRefrescarDesgloces,
                    icon: perfil.dirImg + 'table_refresh.png',
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.actualizarArbol(Planificacion.BasesDelPlan.Desglose.Vista.treeDesgloses)
                    }
                }, '-', {
                    xtype: 'textfield',
                    emptyText: perfil.etiquetas.lbFiltrarDesgloses,
                    width: 110,
                    id: 'idfiltrodesglose',
                    listeners: {
                        specialkey: function(t, e) {
                            if (e.getKey() == '13') {
                                buscarNodo(Planificacion.BasesDelPlan.Desglose.Vista.treeDesgloses);
                            }
                        }
                    }
                }]
        });

        this.panelEntidadDesglose = new Ext.Panel({
            id: 'panelEntidadDesglose',
            title: perfil.etiquetas.lbEntDesglose,
            width: 180,
            layout: 'border',
            items: [this.treeEntidades, this.treeDesgloses]
        });

        //        TreePanel para mostrar los planes
        this.treePlanes = new Ext.tree.TreePanel({
            id: 'treePlanes',
            autoScroll: true,
            height: 200,
            title: perfil.etiquetas.lbPlanes,
            layout: 'fit',
            border: false,
            rootVisible: true,
            disabled: true,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Planes',
                tipo: 0,
                id: '0'
            }),
            loader: modelo.listarPlanModelo,
            contextMenu: new Ext.menu.Menu({
                items: [{
                        id: 'btnactualizarplan',
                        icon: perfil.dirImg + 'actualizar.png',
                        iconCls: 'btn',
                        disabled: false,
                        text: idioma.lbActualizarPlan,
                        handler: function() {
                            Planificacion.BasesDelPlan.Desglose.Vista.actualizarPlan();
                        }
                    }
                ]
            })
        });

        this.panelAccordion = new Ext.Panel({
            id: 'panelAccordion',
            width: 180,
            split: true,
            minSize: 175,
            maxSize: 300,
            collapsible: true,
            layout: 'accordion',
            layoutConfig: {
                animate: true
            },
            items: [this.panelEntidadDesglose, this.treePlanes]
        });

        this.panelWest = new Ext.Panel({
            title: perfil.etiquetas.lbConfiguracion,
            id: 'pMultiEnt',
            region: 'west',
            collapsible: true,
            titleCollapse: true,
            split: true,
            width: 270,
            layout: 'fit',
            items: [this.panelAccordion]
        });

        // ***SelectionModel del Grid que muestra las actividades desglosadas***
        this.smGpActividadDesglose = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.cmGpActividadDesglose = new Ext.grid.ColumnModel({
            columns: [{
                    header: perfil.etiquetas.lbCodigo,
                    width: 100,
                    sortable: true,
                    dataIndex: 'codigo',
                    tooltip: 'Código',
                    renderer: crearToolTip
                }, {
                    id: 'expandir',
                    width: 100,
                    header: perfil.etiquetas.lbDenominacion,
                    sortable: true,
                    dataIndex: 'denominacion',
                    tooltip: 'Denominación',
                    renderer: crearToolTip
                }, {
                    width: 100,
                    header: perfil.etiquetas.lbDescripcion,
                    sortable: true,
                    dataIndex: 'descripcion',
                    hidden: true,
                    tooltip: 'Descripción',
                    renderer: crearToolTip
                }, {
                    header: perfil.etiquetas.lbNivel,
                    width: 100,
                    sortable: true,
                    dataIndex: 'nivelactividad',
                    tooltip: 'Nivel de actividad',
                    renderer: crearToolTip
                }, {
                    header: perfil.etiquetas.lbComportamiento,
                    width: 100,
                    sortable: true,
                    dataIndex: 'comportamiento',
                    tooltip: 'Comportamiento',
                    renderer: Planificacion.BasesDelPlan.Desglose.Vista.setComportamiento
                },
                {
                    header: perfil.etiquetas.lbEspecialidad,
                    width: 100,
                    sortable: true,
                    dataIndex: 'denespecialidad',
                    tooltip: 'Especialidad',
                    renderer: crearToolTip
                },
                {
                    header: perfil.etiquetas.lbAprobacion,
                    width: 100,
                    sortable: true,
                    dataIndex: 'idaprobacionactent',
                    tooltip: 'Aprobación',
                    renderer: Planificacion.BasesDelPlan.Desglose.Vista.setAprobacion
                },
                {
                    header: perfil.etiquetas.lbPlan,
                    width: 100,
                    sortable: true,
                    dataIndex: 'denmodelo',
                    tooltip: 'Plan',
                    renderer: Planificacion.BasesDelPlan.Desglose.Vista.setPlan
                }
            ]
        });

        this.btnGuardar = new Ext.Button({
            disabled: true,
            id: 'btnGuardar',
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbGuardarCambio,
            text: perfil.etiquetas.lbGuardar,
            handler: function() {
            }
        });


        this.paginadoact1 = new Ext.PagingToolbar({
            id: 'paginadoact1',
            pageSize: 20,
            store: modelo.stGpActividadDesglose,
            displayInfo: true,
            items: ['-', this.btnLimpiarFiltros]
        })

        this.gridCentral = new Ext.grid.EditorGridPanel({
            title: 'Desglose de actividades',
            frame: true,
            id: 'gridCentral',
            region: 'center',
            autoExpandMin: 150,
            autoExpandColumn: 'expandir',
            split: true,
            store: modelo.stGpActividadDesglose,
            plugins: this.filtrosdesglose_niv_act,
            autoScroll: true,
            clicksToEdit: 2,
            height: 530,
            autoWidth: true,
            sm: this.smGpActividadDesglose,
            cm: this.cmGpActividadDesglose,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            bbar: this.paginadoact1
        });

        // ********* Botones ****************
        this.btnExportar = new Ext.Button({
            disabled: true,
            id: 'btnExportar',
            hidden: false,
            icon: perfil.dirImg + 'exportar.png',
            iconCls: 'btn',
            tooltip: 'Exportar desgloses <b>(Alt+E)',
            text: 'Exportar',
            handler: function() {
                exportar();
            }
        });
        this.btnAyu = new Ext.Button({
            disabled: false,
            id: 'btnAyu',
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)',
            handler: function() {
                mostrarAyuda('Desglose');

            }
        });



        this.btnConfigurar = new Ext.Button({
            text: 'Configurar',
            id: 'btnConfigurar',
            tooltip: 'Configurar desglose <b>(Alt+F)',
            icon: perfil.dirImg + 'cambiodestado.png',
            iconCls: 'btn',
            hidden: true,
            disabled: false,
            enableToggle: true
        });

        map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'Hh',
                alt: true,
                fn: function() {
                    if (!btnAyu.hidden) {
                        if (!btnAyu.disabled)
                            mostrarAyuda('Desglose');

                    }

                }
            }

        ]);

        var controlador = Planificacion.BasesDelPlan.Desglose.Controlador;
        this.cbEjercicio = new Ext.form.ComboBox({
            id: 'cbEjercicioDesglose',
            store: modelo.stCbejercicio,
            disabled: true,
            valueField: 'idejercicio',
            hiddenName: 'idejercicio',
            displayField: 'ejercicio',
            mode: 'local',
            allowBlank: true,
            typeAhead: true,
            editable: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            loadingText: 'Cargando...',
            width: 180,
            listeners: {
                select: function(cb, rec, index) {
                    controlador.listarDadoEjercicio();
                    if (Ext.getCmp('treePlanes').disabled == false) {
                        Ext.getCmp('treePlanes').getLoader().load(Ext.getCmp('treePlanes').getRootNode());
                    }
                    Ext.Ajax.request({
                        url: 'gestPermisos',
                        params: {
                            idejercicio: _this.cbEjercicio.getValue()
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData[0]) {
                                if (responseData[0].guardar == 1) {
                                    _this.btnGuardar.show();
                                } else {
                                    _this.btnGuardar.hide();
                                }
                                if (responseData[0].insertar == 1) {
                                    _this.btnAddDesglose.show();
                                } else {
                                    _this.btnAddDesglose.hide();
                                }
                                if (responseData[0].eliminar == 1) {
                                    _this.btnDelDesglose.show();
                                    Ext.getCmp('btneliminardesglose').show();
                                } else {
                                    _this.btnDelDesglose.hide();
                                    Ext.getCmp('btneliminardesglose').hide();
                                }
                            } else {
                                _this.btnGuardar.hide();
                                _this.btnDelDesglose.hide();
                                _this.btnAddDesglose.hide();
                                Ext.getCmp('btneliminardesglose').hide();
                            }
                        }
                    });

                }
            }
        });

        this.chk = new Ext.form.Checkbox({
            id: 'ckbcolsvals',
            disabled: true,
            boxLabel: 'Columnas con valores'
        });

        //ViewPort para mostrar los elementos
        this.view = new Ext.Viewport({
            layout: 'fit',
            frame: false,
            items: [
                new Ext.Panel({
                    layout: 'border',
                    tbar: [this.btnExportar, '-', this.btnGuardar, '-', this.chk, this.btnConfigurar, '-'
                                , {
                            xtype: 'tbtext',
                            text: 'Ejercicio:'
                        }, this.cbEjercicio, '->', this.btnAyu],
                    items: [this.panelWest, this.gridCentral]
                })]
        });


        /********* CONFIGURACION DEL DESGLOSE **************/


        this.btnAddDesglose = new Ext.Button({
            id: 'btnAddDesglose',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: idioma.lbttAdicionarDesglose,
            text: idioma.lbBtnAdicionar,
            handler: function() {
                Planificacion.BasesDelPlan.Desglose.Vista.winAddDesglose.show();
            }
        });

        this.btnDelDesglose = new Ext.Button({
            id: 'btnDelDesglose',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: idioma.lbttEliminarDesglose,
            text: idioma.lbBtnEliminar,
            handler: function() {
                Planificacion.BasesDelPlan.Desglose.Vista.eliminarVariosDesgloses();
            }
        });

        this.cmConfDesglose = new Ext.grid.ColumnModel([{
                width: 250,
                id: 'expandir',
                header: 'Denominación',
                dataIndex: 'denominacion',
                sortable: true
            }, {
                width: 120,
                header: 'Descripción',
                sortable: true,
                dataIndex: 'descripcion'
            }]);

        this.smConfDesglose = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        //
        this.gpConfDesglose = new Ext.grid.GridPanel({
            loadMask: {
                msg: 'Por favor,espere...'
            },
            title: 'Desgloses',
            id: 'gpConfDesglose',
            store: modelo.stConfDesglose,
            sm: this.smConfDesglose,
            cm: this.cmConfDesglose,
            region: 'west',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            height: 425,
            width: 450,
            margins: '2 2 2 2',
            anchor: '95%',
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.stConfDesglose,
                displayInfo: true
            })
        });

        this.cmConfNomencladores = new Ext.grid.ColumnModel([{
                width: 250,
                id: 'expandir',
                header: 'Denominación',
                dataIndex: 'denominacion',
                sortable: true
            }, {
                width: 120,
                header: 'Orden',
                sortable: true,
                dataIndex: 'orden'
            }, {
                width: 120,
                header: 'Descripcion',
                sortable: true,
                dataIndex: 'descripcion',
                hidden: true
            }]);

        this.smConfNomencladores = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpConfNomencladores = new Ext.grid.GridPanel({
            loadMask: {
                msg: 'Por favor,espere...'
            },
            title: 'Nomencladores',
            id: 'gpConfNomencladores',
            store: this.modelo.stConfNomencladores,
            sm: this.smConfNomencladores,
            cm: this.cmConfNomencladores,
            region: 'center',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            height: 425,
            width: 450,
            margins: '2 2 2 2',
            anchor: '100%',
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: this.modelo.stConfNomencladores,
                displayInfo: true
            })
        });

        this.pGestDesglose = new Ext.Panel({
            id: 'pGestDesglose',
            height: 450,
            width: 880,
            layout: 'border',
            tbar: [this.btnAddDesglose, this.btnDelDesglose],
            items: [this.gpConfNomencladores, this.gpConfDesglose]
        });

        this.winConfDesglose = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            items: this.pGestDesglose,
            width: 893,
            height: 515,
            title: 'Configuración del desglose',
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    text: 'Cerrar',
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.winConfDesglose.hide();
                    }
                }],
            listeners: {
                beforehide: function() {
                    Planificacion.BasesDelPlan.Desglose.Vista.press_configurar = false;
                }
            }
        });


        //*********************Ventana adicionar desglose********************
        //******Denominacion**********************
        this.denominacionDesglose = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'denominacionDesglose',
            fieldLabel: idioma.lbDenominacion,
            anchor: '100%',
            regex: /^\S+/,
            maskRe: /^([a-zA-ZáéíóúñüÑ\-\ \:\/\,\_\-\.\d]+ ?[a-zA-ZáéíóúñüÑ\-\:\/\,\_\-\.\d]*)+$/,
            allowBlank: false,
            blankText: idioma.lbRequerido
        });
        //******Descripcion**********************
        this.descripcionDesglose = new Ext.form.TextArea({
            xtype: 'textarea',
            id: 'descripcionDesglose',
            anchor: '100%',
            fieldLabel: idioma.lbDescripcion
        });


        this.cmNomencladores = new Ext.grid.ColumnModel([{
                width: 50,
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                dataIndex: 'denominacion',
                sortable: true
            }, {
                width: 100,
                header: perfil.etiquetas.lbDescripcion,
                sortable: true,
                dataIndex: 'descripcion',
                hidden: true
            }]);

        this.smNomencladores = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.smNomencladores.on('selectionchange', function(sm) {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            vista.btnDelDesglose.enable();
            if (vista.smNomencladores.getSelected()) {
                vista.btnSiguiente.enable();
            } else {
                vista.btnSiguiente.disable();
            }
        }, this);


        this.gpNomencladores = new Ext.grid.GridPanel({
            loadMask: {
                msg: perfil.etiquetas.lbEspere
            },
            title: perfil.etiquetas.lbNomencladores,
            id: 'stNomencladoresUsados',
            store: modelo.stNomen,
            sm: this.smNomencladores,
            cm: this.cmNomencladores,
            region: 'east',
            autoExpandColumn: 'expandir',
            height: 295,
            width: 100,
            margins: '2 2 2 2',
            anchor: '100%',
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.stNomen,
                displayInfo: true
            })
        });


        this.cmNomencladoresUsados = new Ext.grid.ColumnModel([{
                width: 50,
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                dataIndex: 'denominacion',
                sortable: true
            }, {
                width: 50,
                header: 'Orden',
                sortable: true,
                dataIndex: 'orden'
            }]);

        this.smNomencladoresUsados = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.smNomencladoresUsados.on('selectionchange', function(sm) {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            if (vista.smNomencladoresUsados.getSelected()) {
                vista.btnSubir.enable();
                vista.btnBajar.enable();
                vista.btnAnterior.enable();
            } else {
                vista.btnSubir.disable();
                vista.btnBajar.disable();
                vista.btnAnterior.disable();
            }
        }, this);

        this.gpNomencladoresUsados = new Ext.grid.GridPanel({
            loadMask: {
                msg: perfil.etiquetas.lbEspere
            },
            title: perfil.etiquetas.lbNomencladoresUsados,
            id: 'gpNomencladoresUsados',
            store: modelo.stNomencladoresUsados,
            sm: this.smNomencladoresUsados,
            cm: this.cmNomencladoresUsados,
            region: 'east',
            autoExpandColumn: 'expandir',
            height: 310,
            width: 100,
            margins: '2 2 2 2',
            anchor: '100%'
        });

        this.btnSiguiente = new Ext.Button({
            disabled: true,
            id: 'btnsiguiente',
            style: 'margin-left:18px;margin-top:90px',
            icon: perfil.dirImg + 'siguiente.png',
            iconCls: 'btn',
            handler: function() {
                Planificacion.BasesDelPlan.Desglose.Vista.addnomenclador();
            }
        });

        this.btnAnterior = new Ext.Button({
            disabled: true,
            id: 'btnAnterior',
            style: 'margin-left:18px;margin-top:50px',
            icon: perfil.dirImg + 'anterior.png',
            iconCls: 'btn',
            handler: function() {
                Planificacion.BasesDelPlan.Desglose.Vista.eliminarnom();
            }
        });
        this.btnSubir = new Ext.Button({
            disabled: true,
            id: 'btnSubir',
            style: 'margin-left:18px;margin-top:90px',
            icon: perfil.dirImg + 'arriba.png',
            iconCls: 'btn',
            handler: function() {
                Planificacion.BasesDelPlan.Desglose.Vista.Ordenar('up');
            }
        });
        this.btnBajar = new Ext.Button({
            disabled: true,
            id: 'btnBajar',
            style: 'margin-left:18px;margin-top:50px',
            icon: perfil.dirImg + 'abajo.png',
            iconCls: 'btn',
            handler: function() {
                Planificacion.BasesDelPlan.Desglose.Vista.Ordenar('down');
            }
        });

        this.pAddDesgloseNomencladores = new Ext.Panel({
            id: 'pAddDesgloseNomencladores',
            labelAlign: 'top',
            height: 320,
            width: 805,
            frame: true,
            anchor: '100%',
            layout: 'form',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .40,
                            layout: 'form',
                            items: [this.gpNomencladores]
                        },
                        {
                            columnWidth: .10,
                            layout: 'form',
                            items: [this.btnSiguiente, this.btnAnterior],
                            anchor: '100%'
                        },
                        {
                            columnWidth: .40,
                            layout: 'form',
                            items: [this.gpNomencladoresUsados]
                        }, {
                            columnWidth: .10,
                            layout: 'form',
                            items: [this.btnSubir, this.btnBajar],
                            anchor: '100%'
                        }]
                }]

        });
        this.pAddDesgloseNorte = new Ext.FormPanel({
            id: 'pAddDesgloseNorte',
            labelAlign: 'top',
            height: 470,
            width: 920,
            frame: true,
            layout: 'form',
            items: [this.denominacionDesglose, this.descripcionDesglose, this.pAddDesgloseNomencladores]

        });

        this.winAddDesglose = new Ext.Window({
            modal: true,
            id: 'winAddDesglose',
            closeAction: 'hide',
            layout: 'fit',
            constrain: true,
            width: 893,
            height: 515,
            items: [this.pAddDesgloseNorte],
            title: 'Adicionar desglose',
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip: perfil.etiquetas.lbttCancelar,
                    text: perfil.etiquetas.lbCancelar,
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.winAddDesglose.hide();
                    }
                }, {
                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'btn',
                    text: perfil.etiquetas.lbAplicar,
                    tooltip: perfil.etiquetas.lbttCancelar,
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.adicionarDesglose(true);
                    }
                }, {
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn',
                    id: 'btnaceptar1',
                    text: perfil.etiquetas.lbAceptar,
                    tooltip: perfil.etiquetas.lbttCancelar,
                    handler: function() {
                        Planificacion.BasesDelPlan.Desglose.Vista.adicionarDesglose();
                    }
                }]
        });

        this.Fila = Ext.data.Record.create([{
                name: 'idtiponomenclador',
                type: 'string'
            }, {
                name: 'denominacion',
                type: 'string'
            }, {
                name: 'descripcion',
                type: 'string'
            }, {
                name: 'orden',
                type: 'string'
            }]);

    },
    setComportamiento: function(val, m) {
        m.attr = 'ext:qtip="' + val + '"';
        if (val == 'propia') {
            return perfil.etiquetas.lbPropia;
        }
        else if (val == 'demandada') {
            return perfil.etiquetas.lbDemandada;
        }
        if (val == 'compartida') {
            return perfil.etiquetas.lbCompartida;
        }
        return '?';
    },
    setAprobacion: function(val, m) {
        m.attr = 'ext:qtip="' + val + '"';
        if (val == 1 || val < 1)
            return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
        else if (val == 3)
            return '<span><img src=' + perfil.dirImg + 'tick(amarillo).png' + '>';
        else if (val == 4 || val == 5)
            return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
        else
            return '?';
    },
    setPlan: function(val, m) {
        m.attr = 'ext:qtip="' + val + '"';
        if (val == null)
            return perfil.etiquetas.lbPlanIndefinido;
        return val;
    },
    desglozar: function() {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        var desgloseMod = [], auxdesgloseMod = [],
            recordsMod = vista.gridCentral.getStore().getModifiedRecords();
        if (vista.validarcampos()) {
            if (vista.desgloses_realizados.length > 0) {
                Ext.Msg.wait(perfil.etiquetas.lbGuardandoDesgloce, perfil.etiquetas.lbEspere);
                Ext.Ajax.request({
                    url: 'adicionarDesglosesNivelesActividad',
                    params: {
                        identidad: vista.identidadselected,
                        orden: vista.ptr_ordenactual,
                        tipo: vista.tipo,
                        niveles_actividad_desglosados: Ext.encode(vista.desgloses_realizados),
                        ident: vista.ident,
                        idejercicio: this.cbEjercicio.getValue(),
                        _iddn_idpadrerama: vista.iddatoscolum
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 3) {
                            mostrarMensaje(3, perfil.etiquetas.lbmsgError);
                        } else if (responseData.codMsg == 21) {
                            recordsMod = vista.gridCentral.getStore().getModifiedRecords();
                            for (var j = 0; j < recordsMod.length; j++) {
                                if (vista.gridCentral.getStore().getById(recordsMod[j].data.idactividadentidad) !== undefined)
                                    vista.gridCentral.getStore().getById(recordsMod[j].data.idactividadentidad).commit();
                            }
                            recodsMod = [];
                            vista.desgloses_realizados = [];
                            mostrarMensaje(1, perfil.etiquetas.msgDesgloseGuardado, function() {
                                vista.gridCentral.getStore().reload({});
                                actualizarArbol(vista.treeDesgloses);
                            });
                        }
                    }
                });
            }

        } else {
            vista.btnGuardar.disable();
        }
    },
    validarcampos: function() {
        if (Planificacion.BasesDelPlan.Desglose.Modelo.stGpActividades === undefined)
            return false;
        return !Planificacion.BasesDelPlan.Desglose.Vista.pintarValidarFilasErrorneas();
    },
    pintarValidarFilasErrorneas: function(indexfilaactual) {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
        //pintar desgloses                    
        if (modelo.stGpActividades == undefined)
            return;
        var index = 0;
        var existerror = false;
        var existerrorfilaactual = false;
        modelo.stGpActividades.data.each(function() {
            var nivelactividad = modelo.stGpActividades.getAt(index).data.nivelactividad;
            var cont = 0;
            var sumador = 0;
            var cant_col_estaticydin = 0;
            for (var columna_dinamica in modelo.stGpActividades.getAt(index).data) {
                if ((cont++) >= 8 && (columna_dinamica.substring(0, 1) == '_' && columna_dinamica.substring(0, 2) != '__')) {
                    cant_col_estaticydin++
                    sumador += Number(eval('modelo.stGpActividades.getAt(index).data.' + columna_dinamica));
                }
            }
            /* Las primeras 8 columnas son estaticas el resto son dinamicas */
            cant_col_estaticydin += 8;
            if (sumador != 0) {
                var backgroundcolor = '';
                if (sumador > nivelactividad) {//rojo intenso es que esta por encima  
                    existerror = true;
                    if (indexfilaactual == index) {
                        existerrorfilaactual = true;
                    }
                    backgroundcolor = 'background-color:#E00000';
                } else if (sumador < nivelactividad) { //rojo claro es que esta por debajo
                    backgroundcolor = 'background-color:#FFCCCC';
                }
                if (backgroundcolor != '')
                    for (var col = 0; col < cant_col_estaticydin; col++) {
                        Ext.get(vista.gridCentral.getView().getCell(index, col)).applyStyles(backgroundcolor);
                    }
            }
            index++;
        });
        if (indexfilaactual != null)
            return existerrorfilaactual;
        return existerror;
    },
    actualizarArbol: function(arbol) {
        if (arbol.getSelectionModel().getSelectedNode() != undefined) {
            if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                arbol.getSelectionModel().getSelectedNode().reload();
            }
        } else
            arbol.root.reload();
    },
    getFiltrosActivos: function() {
        return Planificacion.BasesDelPlan.Desglose.Vista.filtrosdesglose_niv_act.getFilterData();
    },
    cambiarTituloFiltrarDesglose: function() {
        var filtrado_por = "";
        var sep = "/";
        if (this.filtrosdesglose_niv_act.getFiltrosActivos() == undefined || this.filtrosdesglose_niv_act.getFiltrosActivos().length == 0) {
            this.gridCentral.setTitle(this.idioma.lbDesgloseActividades);
        } else {
            for (i = 0; i < this.filtrosdesglose_niv_act.getFiltrosActivos().length; i++) {
                var numberCol = this.gridCentral.getColumnModel().findColumnIndex(this.filtrosdesglose_niv_act.getFiltrosActivos()[i].dataIndex);
                if (i == this.filtrosdesglose_niv_act.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += this.gridCentral.getColumnModel().getColumnHeader(numberCol) + sep;
            }
            this.gridCentral.setTitle(this.idioma.lbDesgloseActividades + "<i> " + this.idioma.lbFiltradoPor + filtrado_por + '</i>');
            filtrado_por = "";
        }
    },
    limpiar: function() {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        vista.gridCentral.getStore().reload({
            params: {
                start: 0,
                limit: 20
            }
        });
        vista.filtrosdesglose_niv_act.clearFilters();
    },
    mostrarAyuda: function(referencia, title) {
        var title = 'Desglose';
        var referencia = 'desglosenivelesactividad';
        help.show(title, referencia);
    },
    ObtenerConfiguracion: function(ident, ord, tip, colum, idmodelo) {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
        vista.mostrarColumAprobYPlan = (idmodelo == null) ? true : false;
        if (vista.orden1 == -1) {
            vista.gridCentral.reconfigure(modelo.stGpActividadDesglose, vista.cmGpActividadDesglose);
            Ext.getCmp('paginadoact1').bind(modelo.stGpActividadDesglose);
            vista.gridCentral.getStore().load({
                params: {
                    start: 0,
                    limit: 20,
                    idejercicio: vista.cbEjercicio.getValue()
                }
            });
        } else {
            Ext.Ajax.request({
                url: 'obtenerGripDesgloseNivActIU',
                params: {
                    ident: ident,
                    orden: ord,
                    tipo: tip,
                    columna: vista.iddatoscolum,
                    idmodelo: idmodelo
                },
                callback: function(options, success, response) {
                    var datos = Ext.decode(response.responseText);
                    for (var i = 0; i < datos.cm.length; i++) {
                        datos.cm[i].hidden = false;
                    }
                    var vista = Planificacion.BasesDelPlan.Desglose.Vista;
                    vista.configurarGridActividad(datos, id, ord);
                    if (vista.esdesglozarcol) {
                        vista.actualizarArbol(vista.treeDesgloses);
                        vista.esdesglozarcol = false;
                    }
                }
            });
        }
    },
    configurarGridActividad: function(da) {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;

        this.recAct = [];
        this.recAct.push({
            name: 'idactividad'
        });
        this.recAct.push({
            name: 'codigo'
        });
        this.recAct.push({
            name: 'denominacion'
        });

        this.recAct.push({
            name: 'nivelactividad'
        });
        this.recAct.push({
            name: 'idactividadentidad'
        });
        this.recAct.push({
            name: 'denmodelo'
        });
        this.recAct.push({
            name: 'descripcion'
        });
        this.recAct.push({
            name: 'comportamiento'
        });
        this.recAct.push({
            name: 'idaprobacionactent'
        });
        this.recAct.push({
            name: 'denespecialidad'
        });

        /* Almacenar el desglose como name = "_iddatosnomenclador" */
        for (var index = 0; index < da.st.length; index++) {
            this.recAct.push(da.st[index]);
        }

        for (var index1 = 0; index1 < da.st_id.length; index1++) {
            this.recAct.push(da.st_id[index1]);
        }

        if (vista.orden1 > 0) {
            for (var index2 = 0; index2 < da.st_otrosids.length; index2++) {
                this.recAct.push(da.st_otrosids[index2]);
            }
        }
        /*nuevo*/
        for (var index3 = 0; index3 < da.st_idrama.length; index3++) {
            this.recAct.push(da.st_idrama[index3]);
        }


        // **********************************************************
        this.cmGpAct = [];
        this.cmGpAct.push({
            header: perfil.etiquetas.lbCodigo,
            width: 80,
            sortable: true,
            dataIndex: 'codigo',
            tooltip: 'Código',
            renderer: crearToolTip
        });
        this.cmGpAct.push({
            id: 'expandir',
            width: 100,
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            tooltip: 'Denominación',
            renderer: crearToolTip,
            sortable: true,
            autoExpandMin: 200
        });
        this.cmGpAct.push({
            header: 'Descripcion',
            width: 100,
            sortable: true,
            dataIndex: 'descripcion',
            tooltip: 'Descripción',
            renderer: crearToolTip,
            hidden: true
        });
        this.cmGpAct.push({
            header: perfil.etiquetas.lbNivel,
            width: 100,
            sortable: true,
            dataIndex: 'nivelactividad',
            tooltip: 'Nivel de Actividad',
            renderer: crearToolTip
        });
        this.cmGpAct.push({
            header: perfil.etiquetas.lbComportamiento,
            width: 100,
            sortable: true,
            dataIndex: 'comportamiento',
            tooltip: 'Comportamiento',
            renderer: vista.setComportamiento
        });

        if (vista.tipo != 3) {
            this.cmGpAct.push({
                header: perfil.etiquetas.lbAprobacion,
                width: 100,
                sortable: true,
                dataIndex: 'idaprobacionactent',
                tooltip: 'Aprobación',
                renderer: vista.setAprobacion
            });
            this.cmGpAct.push({
                header: perfil.etiquetas.lbPlan,
                width: 100,
                sortable: true,
                dataIndex: 'denmodelo',
                tooltip: 'Plan',
                renderer: vista.setPlan
            });
        }

        this.cmGpAct.push({
            header: perfil.etiquetas.lbEspecialidad,
            width: 100,
            sortable: true,
            dataIndex: 'denespecialidad',
            tooltip: 'Especialidad',
            renderer: crearToolTip
        });

        for (var index = 0; index < da.cm.length; index++) {
            da.cm[index].editor = new Ext.form.NumberField({
                allowNegative: false,
                minValue: 0,
                maxValue: 999999999999999, //15 lugares
                enableKeyEvents: true,
                listeners: {
                    keypress: function(nf, e) {

                        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
                        if ((e.getKey() == 99 || e.getKey() == 67) && vista.idactividadentidadselec != null && vista.columnadinamicaselec != null) {
                            /* Numeros de las teclas: c = 99, C= 67 */
                            /*Completar desglose presionando la tecla C o c*/
                            var data = vista.gridCentral.getStore().getById(vista.idactividadentidadselec).data;
                            var cantidad_columnas = 0, cont = 0, sumador = 0, nivelactividad = data.nivelactividad;
                            for (var columna_dinamica in data) {
                                if ((cont++) >= 8 && (columna_dinamica.substring(0, 1) == '_' && columna_dinamica.substring(0, 2) != '__')) {
                                    cantidad_columnas++;
                                    /*
                                     * Las primeras 8 columnas son estaticas el resto son
                                     * dinamicas
                                     */
                                    if (columna_dinamica != vista.columnadinamicaselec)
                                        sumador += parseFloat(eval('data.' + columna_dinamica));
                                }
                            }
                            var valor_desglose_calculado = Number(nivelactividad) - Number(sumador);
                            if (valor_desglose_calculado > 0) {
                                nf.setValue(parseFloat(valor_desglose_calculado).toFixed(3));
                            }
                            else {
                                nf.setValue(0);
                            }
                        } else {
                            if (e.getKey() == 110 || e.getKey() == 78) { //elimina con n = 110,N = 78
                                nf.setValue('0');
                            }
                        }
                    }
                }
            });
            da.cm[index].renderer = this.setColumDinamic;
            this.cmGpAct.push(da.cm[index]);
            this.addFilter(da.cm[index].dataIndex);
        }
        vista.esultimonivel = da.config[0].esultimonivel;
        modelo.stGpActividades = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: 'listarDesgloseNivelesActividad',
            listeners: {
                beforeLoad: function() {
                    this.baseParams.identidad = vista.identidadselected;
                    this.baseParams.ident = vista.ident;
                    this.baseParams.orden = vista.ptr_ordenactual;
                    this.baseParams.tipo = vista.tipo;
                    this.baseParams.is_leaf = vista.is_leaf;
                    this.baseParams.columna = vista.iddatoscolum;
                    this.baseParams.idtipomodelointegracion = vista.idtipomodelo;
                    this.baseParams.idmodelointegracion = vista.idmodelo;
                    vista.desgloses_realizados = [];
                    this.baseParams.fxc = Ext.encode(vista.getFiltrosActivos());
                    this.baseParams.idejercicio = vista.cbEjercicio.getValue();
                    vista.cambiarTituloFiltrarDesglose();
                },
                load: function() {
                    vista.pintarValidarFilasErrorneas();
                    vista.ptr_ordenactual = modelo.stGpActividades.reader.jsonData.ordenactual;
                    vista.iddatoscolum = modelo.stGpActividades.reader.jsonData.columna;
                    Planificacion.BasesDelPlan.Desglose.Controlador.ocultarColumnasSinValores(_this);
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "data",
                id: 'idactividadentidad',
                ordenactual: 'ordenactual',
                ordenactual:'columna',
                        fields: this.recAct
            })
        });
        this.cmdinamico = new Ext.grid.ColumnModel(this.cmGpAct);

        var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
        vista.gridCentral.reconfigure(modelo.stGpActividades, this.cmdinamico);
        vista.paginadoact1.bind(modelo.stGpActividades);
        Planificacion.BasesDelPlan.Desglose.Controlador.construirMenu(vista.gridCentral);
        vista.gridCentral.getStore().reload({
            params: {
                start: 0,
                limit: 20
            }
        });
        for (i = 0; i < vista.gridCentral.getColumnModel().getColumnCount(); i++) {
            if (vista.orden1 <= 0)
                vista.gridCentral.getColumnModel().setEditable(i, false);
            else if (i > 7)
                vista.gridCentral.getColumnModel().setEditable(i, true);
        }
    },
    addFilter: function(dataIndex) {
        if (this.filtrosdesglose_niv_act.getFilter(dataIndex) == undefined) {
            this.filtrosdesglose_niv_act.addFilter({
                type: 'numeric',
                dataIndex: dataIndex
            });
        }
    },
    actualizarPlan: function() {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
        mostrarMensaje(2, perfil.etiquetas.msgConfirActualizarPlanSelecc, actualizar);
        function actualizar(btnPresionado) {
            if (btnPresionado == 'ok') {
                vista.mymask.show();
                Ext.Ajax.timeout = 600000; //10min
                Ext.Ajax.request({
                    url: 'actualizarPlan',
                    params: {
                        idtipomodelo: vista.idtipomodeloselec,
                        idmodelo: vista.idmodeloselec,
                        identidad: vista.tmpidentidadselecc,
                        idejercicio: vista.cbEjercicio.getValue(),
                        iddesglose: Planificacion.BasesDelPlan.Desglose.Vista.treeDesgloses.getSelectionModel().getSelectedNode().attributes.ident
                    },
                    callback: function(options, success, response) {
                        vista.mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1)
                            mostrarMensaje(1, perfil.etiquetas.lbPlanActualizado);
                        else if (responseData.codMsg == 21)
                            mostrarMensaje(1, perfil.etiquetas.lbNoActualizoPlan);
                        else if (responseData.codMsg == 3)
                            mostrarMensaje(3, responseData.mensaje);
                    }
                });
            }
        }
    },
    exportar: function() {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        var win = window.open("exportar?identidad=" + vista.identidadselected
                + "&ident=" + vista.ident
                + "&is_leaf=" + vista.is_leaf
                + "&orden=" + vista.orden1
                + "&text_ent=" + vista.treeEntidades.getNodeById(vista.identidadselected).text
                + "&text_conf=" + vista.textconfig
                + "&columna=" + vista.iddatoscolum
                + "&tipo=" + vista.tipo
                + "&idmodelo=" + vista.idmodelo
                + "&idtipomodelo=" + vista.idtipomodelo
                + "&idejercicio=" + this.cbEjercicio.getValue()
                + "&fxc=" + Ext.encode(vista.getFiltrosActivos()));
        mascaraExportar(perfil.etiquetas.lbExportandoDesglose, perfil.etiquetas.lbEsperePorFavor, win);
    },
    /*Configuracion del desglose*/
    eliminarVariosDesgloses: function() {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        if (vista.gpConfDesglose.getSelectionModel().getSelections().length <= 0) {
            mostrarMensaje(1, 'Debe seleccionar al menos un desglose');
        } else {
            mostrarMensaje(2, vista.idioma.msgConfirElimDesglose, eliminarDesglosesSeleccionados);
        }
        function eliminarDesglosesSeleccionados(btnPresionado) {
            if (btnPresionado == 'ok') {
                vista.mymask.show();
                var recordsSel = vista.gpConfDesglose.getSelectionModel().getSelections(), desElim = [];
                if (recordsSel.length > 0) {
                    for (var i = 0; i < recordsSel.length; i++)
                        desElim.push({
                            iddesglose: recordsSel[i].data.iddesglose
                        });
                    Ext.Ajax.request({
                        url: 'eliminarConfigDesglose',
                        params: {
                            conf_desgloses: Ext.encode(desElim)
                        },
                        callback: function(options, success, response) {
                            vista.mymask.hide();
                            vista.stConfDesglose.reload();
                            vista.stConfNomencladores.reload();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, vista.idioma.msgElimCorrectamente);
                            } else
                            if (responseData.mensaje != null)
                                mostrarMensaje(3, responseData.mensaje);
                            else
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                        }
                    });
                }
            }
        }
    },
    buscarRecord: function(idtipo) {
        var bandera = false;
        for (var i = 0; i < this.modelo.stNomencladoresUsados.getCount(); i++) {
            if (this.modelo.stNomencladoresUsados.getAt(i).data.idtiponomenclador == idtipo) {
                bandera = true;
                break;
            }
        }
        return bandera;
    },
    addnomenclador: function() {

        var recordsSel = this.gpNomencladores.getSelectionModel().getSelections();
        if (recordsSel.length > 0 && this.modelo.stNomencladoresUsados.getCount() < 20) {
            if (recordsSel.length > 2) {
                Ext.MessageBox.show({
                    title: perfil.etiquetas.lbTitAddNomencladores, //'Informaci&oacute;n',
                    buttons: Ext.MessageBox.OK,
                    msg: 'No se pueden adicionar más de dos nomencladores',
                    icon: Ext.MessageBox.WARNING
                });
            }
            for (var i = 0; i < recordsSel.length && i < 2; i++) {
                var p = new this.Fila({
                    idtiponomenclador: recordsSel[i].data.idtiponomenclador,
                    denominacion: recordsSel[i].data.denominacion,
                    descripcion: recordsSel[i].data.descripcion,
                    orden: this.modelo.stNomencladoresUsados.getCount() + 1
                });
                if (!this.buscarRecord(recordsSel[i].data.idtiponomenclador)) {
                    this.modelo.stNomencladoresUsados.add(p);
                } else {
                    Ext.MessageBox.show({
                        title: perfil.etiquetas.lbTitAddNomencladores,
                        buttons: Ext.MessageBox.OK,
                        msg: perfil.etiquetas.msgNomYaExisten, //'Algunos de los nomencladores ya existen',
                        icon: Ext.MessageBox.WARNING
                    });
                }
            }
        } else {
            Ext.MessageBox.show({
                title: 'Error',
                buttons: Ext.MessageBox.OK,
                msg: perfil.etiquetas.msgNoMasDe20Nom, //No se pueden adicionar m&aacute;s de 20 nomencladores',
                icon: Ext.MessageBox.ERROR
            });
        }

    }, //fin del metodo addnomenclador

    eliminarnom: function() {
        var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
        var recordsSel = this.gpNomencladoresUsados.getSelectionModel().getSelections();
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                modelo.stNomencladoresUsados.remove(recordsSel[i]);
            }
        }
        var index = 0;
        modelo.stNomencladoresUsados.data.each(function() {
            modelo.stNomencladoresUsados.getAt(index).data.orden = index + 1;
            modelo.stNomencladoresUsados.getAt(index).commit();
            index++;
        });

    }, //fin del metodo eliminarnom

    Ordenar: function(orden) {
        var validacion1, validacion2;
        var decremento, aumento, posicion;
        if (orden == 'up') {
            posicion = -1;
            aumento = -1;
            decremento = 1;
            validacion1 = 'this.modelo.stNomencladoresUsados.getAt(j).data.orden>1';
            validacion2 = 'j>0';
        } else {
            posicion = 1;
            aumento = 1;
            decremento = -1;
            validacion1 = 'this.modelo.stNomencladoresUsados.getAt(j).data.orden<stNomencladoresUsados.getCount()';
            validacion2 = 'j<this.modelo.stNomencladoresUsados.getCount()';
        }

        var recordsSel = this.gpNomencladoresUsados.getSelectionModel().getSelections();
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                for (var j = 0; j < this.modelo.stNomencladoresUsados.getCount(); j++) {
                    if (this.modelo.stNomencladoresUsados.getAt(j).data.idtiponomenclador == recordsSel[i].data.idtiponomenclador) {
                        if (eval(validacion1)) {

                            this.modelo.stNomencladoresUsados.getAt(j).set('orden', this.modelo.stNomencladoresUsados.getAt(j).data.orden + aumento);
                            if (eval(validacion2))
                                this.modelo.stNomencladoresUsados.getAt(j + posicion).set('orden', this.modelo.stNomencladoresUsados.getAt(j + posicion).data.orden + decremento);
                        }
                    }
                }
            }
        }
        this.modelo.stNomencladoresUsados.sort('orden', 'ASC');
    }, //fin del metodo Ordenar

    adicionarDesglose: function(aplicar) {
        if (this.pAddDesgloseNorte.getForm().isValid()) {
            if (this.modelo.stNomencladoresUsados.getCount() != 0) {
                this.mymask.show();
                array_nomencladores = [];
                for (var i = 0; i < this.modelo.stNomencladoresUsados.getCount(); i++) {
                    array_nomencladores.push({
                        idtiponomenclador: this.modelo.stNomencladoresUsados.getAt(i).data.idtiponomenclador,
                        orden: this.modelo.stNomencladoresUsados.getAt(i).data.orden
                    })
                }
                Ext.Ajax.request({
                    url: 'adicionarConfigDesglose',
                    params: {
                        denominacion: this.denominacionDesglose.getValue(),
                        descripcion: this.descripcionDesglose.getValue(),
                        tiponomencladores_orden: Ext.encode(array_nomencladores)
                    },
                    callback: function(options, success, response) {
                        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
                        vista.mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesgloseGuardado);
                            vista.pAddDesgloseNorte.getForm().reset();
                            if (!aplicar)
                                vista.winAddDesglose.hide();
                            vista.modelo.stConfDesglose.reload();
                            vista.smNomencladores.deselectRange(0, vista.modelo.stNomen.getCount());
                            vista.modelo.stNomencladoresUsados.removeAll();
                        } else
                        if (responseData.mensaje != null)
                            mostrarMensaje(3, responseData.mensaje);
                        else
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                    }
                });
            } else {
                mostrarMensaje(1, perfil.etiquetas.msgAlMenosUnNom);
            }
        } else {
            mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
        }
    },
    eliminarVariosDesgloses:function() {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        if (this.gpConfDesglose.getSelectionModel().getSelections().length <= 0) {
            mostrarMensaje(1, 'Debe seleccionar al menos un desglose');
        } else {
            mostrarMensaje(2, perfil.etiquetas.msgConfirElimDesglose, eliminarDesglosesSeleccionados);
        }
        function eliminarDesglosesSeleccionados(btnPresionado) {
            if (btnPresionado == 'ok') {
                vista.mymask.show();
                var recordsSel = vista.gpConfDesglose.getSelectionModel().getSelections(), desElim = [];
                if (recordsSel.length > 0) {
                    for (var i = 0; i < recordsSel.length; i++)
                        desElim.push({
                            iddesglose: recordsSel[i].data.iddesglose
                        });
                    Ext.Ajax.request({
                        url: 'eliminarConfigDesglose',
                        params: {
                            conf_desgloses: Ext.encode(desElim)
                        },
                        callback: function(options, success, response) {
                            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
                            var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
                            vista.mymask.hide();
                            modelo.stConfDesglose.reload();
                            modelo.stConfNomencladores.reload();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, perfil.etiquetas.msgElimCorrectamente);
                            } else
                            if (responseData.mensaje != null)
                                mostrarMensaje(3, responseData.mensaje);
                            else
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                        }
                    });
                }
            }
        }

    },
            validarBtn: function(btn) {
        return btn.hidden == false && !btn.disabled
    },
    setColumDinamic: function(val) {
        return ((val != null) ? val : 0);
    },
    eliminarDesgloces: function() {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        mostrarMensaje(2, perfil.etiquetas.msgSegEliminarTodosDesgloses, eliminarTodosDesgloses);
        function eliminarTodosDesgloses(btnPresionado) {
            if (btnPresionado == 'ok') {
                vista.mymask.show();
                Ext.Ajax.request({
                    url: 'eliminarDesgloces',
                    params: {
                        identidad: vista.identidadselected,
                        is_leaf: vista.is_leaf,
                        iddesglose: vista.ident,
                        iddesglosetiponomenclador: vista.iddesglosetiponomencladorSelecc,
                        orden: vista.orden1,
                        columna: vista.iddatoscolum
                    },
                    callback: function(options, success, response) {
                        vista.mymask.hide();
                        vista.gridCentral.getStore().reload({});
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 3) {
                            mostrarMensaje(3, responseData.mensaje);
                        }
                        if (responseData.codMsg == 1) {
                            vista.treeDesgloses.root.reload();
                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoDesglose);
                        }
                    }
                });
            }
        }
    },
    ObtenerConfVistaPreviaPlan: function(idmodelo, idtipomodelo, identidad) {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        Ext.Ajax.request({
            url: 'ObtenerConfVistaPreviaPlanIU',
            params: {
                idtipomodelo: vista.idtipomodelo
            },
            callback: function(options, success, response) {
                var datos = Ext.decode(response.responseText);
                for (var i = 0; i < datos.cm.length; i++) {
                    datos.cm[i].hidden = false;
                }
                vista.confGridVistaPreviaPlan(datos, idmodelo, idtipomodelo, identidad);
            }
        });
    },
    confGridVistaPreviaPlan: function(da, idmodelo, idtipomodelo, identidad) {

        var vista = Planificacion.BasesDelPlan.Desglose.Vista;

        recVistaPreviaPlan = [];
        recVistaPreviaPlan.push({
            name: 'idindicador'
        });
        recVistaPreviaPlan.push({
            name: 'codigo'
        });
        recVistaPreviaPlan.push({
            name: 'numeropieza'
        });

        recVistaPreviaPlan.push({
            name: 'denominacion'
        });

        recVistaPreviaPlan.push({
            name: 'descripcion'
        });
        recVistaPreviaPlan.push({
            name: 'idcentrobalance'
        });
        recVistaPreviaPlan.push({
            name: 'centrobalance'
        });
        recVistaPreviaPlan.push({
            name: 'idumedida'
        });
        recVistaPreviaPlan.push({
            name: 'naturaleza'
        });
        recVistaPreviaPlan.push({
            name: 'necesidad'
        });
        recVistaPreviaPlan.push({
            name: 'importe'
        });
        recVistaPreviaPlan.push({
            name: 'precio'
        });
        /* Almacenar el desglose como name = "_iddatosnomenclador" */
        for (var index = 0; index < da.st.length; index++) {
            recVistaPreviaPlan.push(da.st[index]);
        }
        cmGpVistaPreviaPlan = [];
        cmGpVistaPreviaPlan.push({
            header: perfil.etiquetas.lbCodigo,
            width: 80,
            sortable: true,
            dataIndex: 'codigo'
        });
        cmGpVistaPreviaPlan.push({
            header: 'Num. pieza',
            width: 80,
            sortable: true,
            dataIndex: 'numeropieza'
        });
        cmGpVistaPreviaPlan.push({
            id: 'expandir',
            width: 100,
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            autoExpandMin: 200
        });
        cmGpVistaPreviaPlan.push({
            header: 'Descripcion',
            width: 100,
            sortable: true,
            dataIndex: 'descripcion',
            hidden: true
        });
        cmGpVistaPreviaPlan.push({
            header: 'UM',
            width: 100,
            sortable: true,
            dataIndex: 'idumedida'
        });
        cmGpVistaPreviaPlan.push({
            header: perfil.etiquetas.lbPrecio,
            width: 100,
            sortable: true,
            dataIndex: 'precio'
        });

        cmGpVistaPreviaPlan.push({
            header: 'Necesidad',
            width: 100,
            sortable: true,
            dataIndex: 'necesidad'
        });
        cmGpVistaPreviaPlan.push({
            header: 'Importe',
            width: 100,
            sortable: true,
            dataIndex: 'importe'
        });
        var arrayidstpnom = [];
        for (var index = 0; index < da.cm.length; index++) {
            cmGpVistaPreviaPlan.push(da.cm[index]);
            arrayidstpnom.push(da.cm[index].dataIndex.substring(4, da.cm[index].dataIndex.length));
        }
        esultimonivel = da.config[0].esultimonivel;
        stGpVistaPreviaPlan = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: 'listarIndicadoresVistaPreviaPlan',
            listeners: {
                beforeLoad: function() {
                    this.baseParams.idmodelo = idmodelo;
                    this.baseParams.idtipomodelo = idtipomodelo;
                    this.baseParams.identidad = identidad;
                    this.baseParams.idstiponom = Ext.encode(arrayidstpnom);
                    this.baseParams.fxc = Ext.encode(vista.getFiltrosActivos());
                },
                load: function() {

                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "data",
                id: 'idindicador',
                fields: recVistaPreviaPlan
            })
        });
        var cmdinamico = new Ext.grid.ColumnModel(cmGpVistaPreviaPlan);
        vista.gridCentral.reconfigure(stGpVistaPreviaPlan, cmdinamico);
        Ext.getCmp('paginadoact1').bind(stGpVistaPreviaPlan);
        vista.gridCentral.getStore().reload({
            params: {
                start: 0,
                limit: 20
            }
        });
    }
}
//Inicializando la vista.
//variable que guarda los datos del perfil
//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = {};
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('bpdesglose', function(idioma) {

    //Escogiendo la configuraciÃƒÆ’Ã‚Â³n del idioma segÃƒÆ’Ã‚Âºn la versiÃƒÆ’Ã‚Â³n del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Planificacion.BasesDelPlan.Desglose.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Planificacion.BasesDelPlan.Desglose.Controlador.init(idioma, vista, modelo);
    vista.objci.acciones = [];
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura != undefined)
                vista.objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        if (vista.objci.acciones != undefined) {
            vista.esrector = ((vista.objci.acciones.rector == undefined) ? false : true);
            if (vista.esrector) {
                vista.gridCentral.suspendEvents();
            }
        }

    })
});
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}