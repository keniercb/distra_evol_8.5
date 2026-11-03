/*inversiones.view.js
 * Vista para Inversiones
 * @author: Gerardo Acosta González
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Ext.ns('Gestionar.inversiones');
var perfil = window.parent.UCID.portal.perfil;

Gestionar.inversiones.Vista = {
    init: function(idioma, modelo) {
        _this = this;
        this.idioma = idioma;
        _this.objetoContenido = false;
        _this.identidadselected;
        _this.entidadSeleccionada;


        // _this.objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido();
        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: idioma.lbCargando
        });
        _this.modoace;

        _this.pBuscarDoc = new Ext.Panel({
            layout: 'fit',
            width: 300,
            margins: '3 3 3 3'

        });
        _this.btnAyudainversion = new Ext.Button({
            text: idioma.btnAyuda,
            tooltip: idioma.btnAyudatoll,
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            id: 'btnAyudainversion'
        });
        _this.btn_equipos = new Ext.Button({
            text: "Equipos",
            tooltip: "Equipos automotores",
            icon: perfil.dirImg + 'server.png',
            disabled: true,
            iconCls: 'ver'
        });

        _this.btn_constructores = new Ext.Button({
            text: "Constructores",
            tooltip: "Constructores",
            icon: perfil.dirImg + 'server.png',
            disabled: true,
            iconCls: 'ver'
        });

        _this.btnEliminarinversion = new Ext.Button({
            //text: idioma.btnEliminar,
            tooltip: idioma.toolTipEliminar,
            icon: perfil.dirImg + 'server.png',
            iconCls: 'eliminar',
            disabled: true
        });
        _this.btnAdicionarinversion = new Ext.Button({
            id: 'idbtnAdicionarinversion',
            tooltip: idioma.toolTipAdicionar,
            iconCls: 'adicionar',
            disabled: true
        });

        _this.btnModificarinversion = new Ext.Button({
            //text: idioma.btnModificar,
            tooltip: idioma.toolTipModificar,
            iconCls: 'modificar',
            disabled: true
        });

        _this.btnActualizarinversion = new Ext.Button({
            text: idioma.btnEliminar,
            icon: perfil.dirImg + 'server.png',
            iconCls: 'actualizar'
        });

        _this.btnLimpiarinversion = new Ext.Button({
            text: idioma.btnEliminar,
            tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
            icon: perfil.dirImg + 'server.png',
            iconCls: 'limpiar'
        });

        _this.btn_desactivar_inversion = new Ext.Button({
            id: 'btn_desactivar_inversion',
            text: idioma.btnDesactivarinversion,
            tooltip: idioma.toolTipDesactivarInversion,
            iconCls: 'deshabilitar',
            disabled: true

        });

        _this.btn_presupuesto_inversion = new Ext.Button({
            text: idioma.btnPresupuesto,
            icon: perfil.dirImg + 'ver_Old2.png',
            iconCls: 'btn',
            disabled: true

        });
        _this.btn_ver_Detalles = new Ext.Button({
            text: 'Ver detalles',
            tooltip: idioma.toolVer,
            iconCls: 'ver',
            disabled: true

        });

        _this.btn_financiamiento_inversion = new Ext.Button({
            text: idioma.btnFinanciamiento,
            icon: perfil.dirImg + 'ver_Old1.png',
            iconCls: 'btn',
            disabled: true

        });

        _this.btn_georefe_inversion = new Ext.Button({
            text: idioma.btnGeorefe,
            icon: perfil.dirImg + 'regla.png',
            iconCls: 'btn',
            disabled: true

        });

        _this.ChConsolidar = new Ext.form.Checkbox({
            id: 'idconsolidar',
            xtype: 'checkbox',
            disabled: true,
            boxLabel: 'General',
            listeners: {
                check: function(ch, chequeado) {
                    if (chequeado == true) {
                        _this.btnAdicionarinversion.disable();
                        _this.btnModificarinversion.disable();
                        _this.btnEliminarinversion.disable();
                        _this.cmp_CambioEstado.disable();
                    } else {
                        _this.btnAdicionarinversion.enable();
                        _this.btnModificarinversion.enable();
                        _this.btnEliminarinversion.enable();
                    }
                    _this.grid_gestionar_inversiones.getStore().reload({
                        params: {
                            start: 0,
                            limit: 20,
                            identidad: _this.identidadselected,
                            idejercicio: _this.cmbEjercicio.getValue()
                        }
                    });
                }
            }

        });

        _this.ChVigente = new Ext.form.Checkbox({
            id: 'idvigente',
            xtype: 'checkbox',
            disabled: true,
            boxLabel: 'Vigentes',
            checked: false,
            listeners: {
                check: function(ch, chequeado) {
                    _this.grid_gestionar_inversiones.getStore().reload({
                        params: {
                            start: 0,
                            limit: 20,
                            identidad: _this.identidadselected,
                            idejercicio: _this.cmbEjercicio.getValue()
                        }
                    });
                }
            }

        });

        _this.btnMenuAprobacion_inversion = new Ext.Toolbar.MenuButton({
            text: idioma.btnAprobacioninversion,
            disabled: true,
            icon: perfil.dirImg + 'area.png',
            iconCls: 'btn',
            menu: {
                items: [{
                        text: idioma.btnAprobarinversion,
                        iconCls: 'aprobar',
                        id: 'idaprobacion'
                    }, {
                        text: idioma.btnDesaprobarinversion,
                        icon: perfil.dirImg + 'desaprobar.png',
                        id: 'iddesaprobar'
                    }

                ]
            }
        });

        _this.btn_activar_inversion = new Ext.Button({
            text: idioma.btnActivarinversion,
            tooltip: idioma.toolTipActivarInversion,
            icon: perfil.dirImg + 'habilitar.png',
            iconCls: 'btn',
            disabled: true

        });

        _this.cmbEjercicio = new Ext.form.ComboBox({
            emptyText: idioma.tlSeleccione,
            width: 90,
            id: 'idejercicio',
            store: modelo.stCbejercicio,
            displayField: 'ejercicio',
            valueField: 'idejercicio',
            typeAhead: true,
            mode: 'local',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            loadingText: 'Cargando...',
            allowBlank: false
        });

//        this.btnGraficas = new Utilidades.Cmp.botonGrafica({
//            idioma: idioma,
//            idejercicio: _this.cmbEjercicio.getValue(),
//            ejercicio: _this.cmbEjercicio.getRawValue(),
//            nodeEntidad: _this.entidadSeleccionada
//        });
//
//        _this.btnGraficoInversion = this.btnGraficas.botonMenuGrafica();

        //----------------------Tree Panel----------------------------------------
        _this.treePanelinversion = new Ext.tree.TreePanel({
            title: idioma.tlOrganismos,
            border: true,
            region: 'west',
            split: true,
            width: 210,
            height: 300,
            collapsible: true,
            rootVisible: false,
            autoScroll: true,
            loader: modelo.loaderTreeinversiones,
            tbar: [{
                    iconCls: 'icon-expand-all',
                    tooltip: idioma.tlExpandir,
                    icon: perfil.dirImg + 'expand-all.gif',
                    handler: function() {
                        Gestionar.inversiones.Vista.treePanelinversion.root.expand(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: idioma.tlColapsar,
                    icon: perfil.dirImg + 'collapse-all.gif',
                    handler: function() {
                        Gestionar.inversiones.Vista.treePanelinversion.root.collapse(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: idioma.tlRefrescar,
                    icon: perfil.dirImg + 'table_refresh.png',
                    handler: function() {
                        Gestionar.inversiones.Vista.treePanelinversion.root.reload();
                    }
                }, '-', {
                    xtype: 'textfield',
                    emptyText: 'Filtrar entidad...',
                    width: 90,
                    id: 'idfiltroent'
                }
            ],
            root: {
                text: 'Estructuras',
                expanded: true,
                id: '0'
            },
            listeners: {
                click: function(n) {
                    if (_this.ChConsolidar.checked == false && _this.ChVigente.checked == false) {
                        Ext.getCmp('idbtnAdicionarinversion').enable();
                    } else {
                        Ext.getCmp('idbtnAdicionarinversion').disable();
                    }
                    identidadselected = n.id;
                    _this.entidadSeleccionada = n;
                    _this.btnEliminarinversion.disable();
                    _this.btnModificarinversion.disable();
                    _this.btn_desactivar_inversion.disable();
                    _this.btn_activar_inversion.disable();
                    _this.btn_presupuesto_inversion.disable();
                    _this.btn_ver_Detalles.disable();
                    _this.btn_financiamiento_inversion.disable();
                    _this.btn_georefe_inversion.disable();
                    Ext.getCmp('idaprobacion').disable();
                    Ext.getCmp('iddesaprobar').disable();
                }

            }

        });
//----------------------------------Equipos------------------------------
        _this.btnEliminarequipo = new Ext.Button({
            text: idioma.btnEliminar,
            tooltip: idioma.toolTipEliminar,
            icon: perfil.dirImg + 'server.png',
            iconCls: 'eliminar',
            disabled: true
        });
        _this.btnAdicionarequipo = new Ext.Button({
            id: 'idbtnAdicionarequipo',
            text: idioma.btnAdicionar,
            tooltip: idioma.toolTipAdicionar,
            iconCls: 'adicionar',
            disabled: false
        });

        _this.btnModificarequipo = new Ext.Button({
            text: idioma.btnModificar,
            tooltip: idioma.toolTipModificar,
            iconCls: 'modificar',
            disabled: true
        });
        _this.btn_guardar_equipo = new Ext.Button({
            text: 'Guardar',
            tooltip: 'guardar equipo',
            disabled: true,
            iconCls: 'guardar'
        });
        _this.btn_ActulizarEq = new Ext.Button({
            text: "Actualizar precios",
            tooltip: "Actualizar equipos automotores",
            icon: perfil.dirImg + 'server.png',
            // disabled: true,
            iconCls: 'ver'
        });

        _this.CmbEntidadModelo = new Ext.form.ComboBox({
            fieldLabel: 'Entidad',
            id: 'identidadmodelo',
            width: 160,
            align: 'right',
            mode: 'local',
            store: modelo.stModelo,
            valueField: 'identidadmodelo',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.btnLimpiarE = new Ext.Toolbar.Button({
            iconCls: 'btn',
            tabIndex: 11,
            icon: perfil.dirImg + 'limpiar.png',
            text: 'Limpiar',
            tooltip: 'Limpiar',
            id: 'btntodos',
            disabled: false
        });

        _this.colModel_equipo = new Ext.grid.ColumnModel([
            {
                header: "Código",
                tooltip: 'Código',
                dataIndex: 'codigo',
                width: 100,
                sortable: true,
                renderer: crearToolTip

            },
            {
                header: "Denominación",
                tooltip: 'Denominación',
                dataIndex: 'denominacion',
                width: 250,
                sortable: true,
                renderer: crearToolTip//, summaryType: 'sum'

            },
            {
                header: "Descripción",
                tooltip: 'Descripción',
                dataIndex: 'descripcion',
                width: 200,
                sortable: true,
                renderer: crearToolTip//, summaryType: 'sum'

            },
            {
                header: "Vía",
                tooltip: 'Vía',
                dataIndex: 'via',
                width: 90,
                sortable: true,
                hidden: true,
                renderer: crearToolTip//, summaryType: 'sum'

            },
            {
                header: "Organismo rector",
                tooltip: 'Organismo rector',
                dataIndex: 'orgrect',
                width: 110,
                sortable: true,
                hidden: true,
                renderer: crearToolTip//, summaryType: 'sum'

            }
            , {
                header: "Adquirir",
                tooltip: 'Adquirir',
                dataIndex: 'adquirir',
                width: 150,
                sortable: true,
                renderer: rendererAdquirir,
                editor: new Ext.form.ComboBox({
                    id: 'idadquisicion',
                    mode: 'local',
                    triggerAction: 'all',
                    allowBlank: false,
                    emptyText: 'Seleccione...',
                    valueField: 'idadquisicion',
                    displayField: 'denominacion',
                    store: modelo.stAdquisicion/*,
                     summaryType: 'sum'*/
                })
            }, {
                header: "Comprar",
                tooltip: 'Comprar',
                dataIndex: 'comprar',
                width: 200,
                sortable: true,
                renderer: rendererComprar,
                editor: new Ext.form.ComboBox({
                    id: 'idcomprar',
                    mode: 'local',
                    triggerAction: 'all',
                    allowBlank: false,
                    emptyText: 'Seleccione...',
                    valueField: 'idcomprar',
                    displayField: 'denominacion',
                    store: modelo.stComprar/*,
                     summaryType: 'sum'*/
                })
            }, {
                header: "Pa\xEDs",
                tooltip: 'Pa\xEDs',
                dataIndex: 'pais',
                width: 200,
                sortable: true,
                renderer: rendererComprarP,
                editor: new Ext.form.ComboBox({
                    id: 'idcomprarpais',
                    mode: 'local',
                    width: 180,
                    triggerAction: 'all',
                    allowBlank: false,
                    emptyText: 'Seleccione...',
                    valueField: 'idcomprar',
                    displayField: 'denominacion',
                    store: modelo.stComprar/*,
                     summaryType: 'sum'*/
                })
            },
            {
                header: "Cantidad",
                tooltip: 'Cantidad',
                width: 100,
                sortable: true,
                dataIndex: 'cantidad',
                renderer: crearToolTip,
                editor: new Ext.form.NumberField({
                    allowNegative: false,
                    enableKeyEvents: true
                })

            },
            {
                header: "Precio",
                tooltip: 'Precio',
                dataIndex: 'precio',
                width: 100,
                sortable: true,
                renderer: crearToolTip

            },
            {
                header: "Precio Divisa",
                tooltip: 'Precio Divisa',
                dataIndex: 'preciodivisa',
                width: 100,
                sortable: true,
                renderer: crearToolTip

            },
            {
                header: "Importe",
                tooltip: 'Importe',
                dataIndex: 'importe',
                width: 100,
                sortable: true,
                renderer: crearToolTip/*,
                 summaryType: 'sum'*/

            },
            {
                header: "Importe Divisa",
                tooltip: 'Importe Divisa',
                dataIndex: 'importedivisa',
                width: 100,
                sortable: true,
                renderer: crearToolTip/*,
                 summaryType: 'sum'*/

            },
            {
                header: "Observaciones",
                tooltip: 'Observaciones',
                width: 150,
                sortable: true,
                dataIndex: 'observaciones',
                renderer: crearToolTip,
                editor: new Ext.form.TextField({
                    allowNegative: false,
                    enableKeyEvents: true/*,
                     summaryType: 'sum'*/
                })

            }

        ]);


        _this.filtrosequipos = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }, {
                    type: 'numeric',
                    dataIndex: 'cantidad'
                }, {
                    type: 'numeric',
                    dataIndex: 'precio'
                }, {
                    type: 'numeric',
                    dataIndex: 'preciodivisa'
                }, {
                    type: 'numeric',
                    dataIndex: 'importe'
                }, {
                    type: 'numeric',
                    dataIndex: 'importedivisa'
                }, {
                    type: 'string',
                    dataIndex: 'orgrect'
                }, {
                    type: 'string',
                    dataIndex: 'via'
                }, {
                    type: 'string',
                    dataIndex: 'observaciones'
                }, {
                    dataIndex: 'adquirir',
                    type: 'listado',
                    idcombo: 'filtrot',
                    urlcb: 'listarComboAdquisicion',
                    idstore: 'idadquisicion',
                    valueFieldcb: 'idadquisicion',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'comprar',
                    type: 'listado',
                    idcombo: 'filtroc',
                    urlcb: 'listarComboComprar',
                    idstore: 'idcomprar',
                    valueFieldcb: 'idcomprar',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'pais',
                    type: 'listado',
                    idcombo: 'filtroc',
                    urlcb: 'listarComboComprar',
                    idstore: 'idcomprar',
                    valueFieldcb: 'idcomprar',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }

            ]
        });
        _this.sm_equipos = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function(s, n, r) {
                    if (_this.sm_equipos.getSelections().length = 1) {
                        _this.btnEliminarequipo.enable();
                        _this.btn_guardar_equipo.enable();
                    }
                }, rowdeselect: function(s, n, r) {
                    if (_this.sm_equipos.getSelections().length > 0) {
                        _this.btnEliminarequipo.enable();
                        _this.btn_guardar_equipo.enable();
                    } else {
                        _this.btnEliminarequipo.disable();
                        _this.btn_guardar_equipo.disable();
                    }
                }
            }
        });
        /*_this.gs = new Ext.grid.GridSummaryNew();*/
        _this.grid_equipos = new Ext.grid.EditorGridPanel({
            frame: true,
            autoWidth: true,
            height: 500,
            border: false,
            autoScroll: true,
            disable: false,
            region: 'center',
            plugins: [_this.filtrosequipos/*, _this.gs*/],
            clicksToEdit: 2,
            enableKeyEvents: true,
            store: modelo.store_gequipos,
            sm: _this.sm_equipos,
            cm: _this.colModel_equipo,
            loadMask: {
                store: modelo.store_gequipos
            },
            tbar: [_this.btnAdicionarequipo, _this.btnEliminarequipo, _this.btn_guardar_equipo, 'Plan:', _this.CmbEntidadModelo, '->', _this.btn_ActulizarEq],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptequi',
                store: modelo.store_gequipos,
                displayInfo: true,
                items: ['-', _this.btnLimpiarE]
            })
        });

        _this.btn_aceptar_equipo = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana.'
        });

        _this.btn_cancelar_equipo = new Ext.Button({
            text: 'Cerrar',
            iconCls: 'cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos.'
        });

        _this.window_equipos = new Ext.Window({
            title: "Equipos automotores",
            closable: true,
            graggable: false,
            border: false,
            layout: 'border',
            maximized: true,
            width: 950,
            height: 450,
            closeAction: 'hide',
            modal: true,
            frame: true,
            items: [_this.grid_equipos],
            buttons: [_this.btn_cancelar_equipo]
        });

        _this.smConstructores = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.tfProvinciaconstructor = new Ext.form.TextField({
            id: 'idtfProvinciaconstructor',
            xtype: 'textfield',
            align: 'right',
            allowBlank: false,
            editable: false,
            readOnly: true
        });

        _this.cmConstructores = new Ext.grid.ColumnModel([
            {
                header: "Constructor",
                tooltip: 'Constructor',
                dataIndex: 'denominacion',
                width: 300,
                sortable: true,
                renderer: rendererConstructor,
                editor: new Ext.form.ComboBox({
                    id: 'idnomcontructor',
                    mode: 'local',
                    triggerAction: 'all',
                    allowBlank: false,
                    emptyText: 'Seleccione...',
                    valueField: 'idconstructor',
                    displayField: 'denomconstructor',
                    store: modelo.stConstructores
                })
            }, {
                header: "Provincia",
                tooltip: 'Denominación',
                dataIndex: 'denomdpt',
                width: 200,
                sortable: true,
                editor: new Ext.form.ComboBox({
                    id: 'idProvinciaconstructor',
                    xtype: 'combo',
                    mode: 'local',
                    triggerAction: 'all',
                    allowBlank: false,
                    emptyText: 'Seleccione...',
                    valueField: 'iddpt',
                    displayField: 'denominacion',
                    store: modelo.stDpt,
                    listeners: {
                        focus: function() {
                            _this.ventanaDpt.show();
                        }
                    }
                })
            }
        ]);

        _this.btnElimconstructor = new Ext.Button({
            text: idioma.btnEliminar,
            tooltip: idioma.toolTipEliminar,
            icon: perfil.dirImg + 'server.png',
            iconCls: 'eliminar',
            disabled: true
        });

        _this.btnAddconstructor = new Ext.Button({
            id: 'idbtnAdicionarequipo',
            text: idioma.btnAdicionar,
            tooltip: idioma.toolTipAdicionar,
            iconCls: 'adicionar',
            disabled: false
        });

        _this.btnGuardarconstructor = new Ext.Button({
            text: 'Guardar',
            tooltip: 'guardar equipo',
            disabled: true,
            iconCls: 'guardar'
        });

        _this.btnLimpconstructor = new Ext.Toolbar.Button({
            iconCls: 'btn',
            tabIndex: 11,
            icon: perfil.dirImg + 'limpiar.png',
            text: 'Limpiar',
            tooltip: 'Limpiar',
            id: 'btntodos',
            disabled: false
        });

        _this.gpConstructores = new Ext.grid.EditorGridPanel({
            frame: true,
            autoWidth: true,
            height: 400,
            border: false,
            autoScroll: true,
            disable: false,
            clicksToEdit: 2,
            enableKeyEvents: true,
            store: modelo.stConstructoresEtapa,
            sm: _this.smConstructores,
            cm: _this.cmConstructores,
            loadMask: {
                store: modelo.stConstructoresEtapa
            },
            tbar: [_this.btnAddconstructor, _this.btnElimconstructor],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptequi',
                store: modelo.stConstructoresEtapa,
                displayInfo: true,
                items: ['-', _this.btnLimpconstructor]
            })
        });

        _this.btnAceptarConstructor = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana.'
        });

        _this.btnCancelarConstructor = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cerrar',
            tooltip: 'Cerrar ventana sin guardar los datos.'
        });

        _this.wConstructores = new Ext.Window({
            title: "Constructores",
            width: 600,
            closeAction: 'hide',
            modal: true,
            frame: true,
            items: [_this.gpConstructores],
            buttons: [_this.btnCancelarConstructor, _this.btnAceptarConstructor]
        });

        /*Importar */
        _this.btnImportar = new Ext.Button({
            disabled: false,
            id: 'btnImportarInversion',
            icon: perfil.dirImg + 'importar.png',
            iconCls: 'btn',
            tooltip: 'Importar inversión',
            text: 'Importar'
        });
        /*Botón para el cierre de la inversión */

        _this.btnCierreInversion = new Ext.Button({
            disabled: false,
            id: 'CierreInversion',
            icon: perfil.dirImg + 'almacen.png',
            iconCls: 'btn',
            tooltip: 'Cierre de la inversión',
            text: 'Cierre Inversión'
        });


        _this.cmbTiposExcel = new Ext.form.ComboBox({
            id: 'tiposexcel',
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            emptyText: 'Seleccione...',
            valueField: 'tipoexcel',
            displayField: 'nombreexcel',
            fieldLabel: 'Tipo de documento',
            store: modelo.simstTipoexcel,
            anchor: '93%'
        });

        _this.fpbuscar = new Ext.FormPanel({
            id: 'idFpBuscar',
            labelAlign: 'top',
            region: 'center',
            width: 600,
            frame: true,
            fileUpload: true,
            bodyStyle: 'padding:5px 5px 0',
            items:
                    [{
                            xtype: 'fileuploadfield',
                            regex: /^.+\.(xls|xlsx)$/i,
                            fieldLabel: 'Cargar documento',
                            name: 'file',
                            id: 'fileUpload',
                            emptyText: 'Seleccione el archivo ...',
                            allowBlank: false,
                            anchor: '100%',
                            buttonCfg: {
                                text: ':',
                                id: 'idbutton',
                                iconCls: 'btn',
                                icon: perfil.dirImg + 'buscar.png'
                            }
                        }, _this.cmbTiposExcel
                    ]

        });

        _this.btnCancelarImportar = new Ext.Button({
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });
        _this.btnAceptarImportar = new Ext.Button({
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            text: 'Aceptar',
            //   disabled:true,
            tooltip: 'Guardar datos y cerrar ventana'
        });
        _this.winImp = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            layout: 'fit',
            title: 'Importar Inversión',
            width: 400,
            height: 200,
            items: [_this.fpbuscar],
            buttons: [_this.btnCancelarImportar, _this.btnAceptarImportar]
        });



        //---------------------------------ADD EQUIPOS----------------------------
        _this.colModel_addEquipos = new Ext.grid.ColumnModel([
            {
                header: "Código",
                tooltip: 'Código',
                dataIndex: 'codigo',
                width: 90,
                sortable: true,
                renderer: crearToolTip

            }, {
                header: "Número de piezas",
                tooltip: 'Número de piezas',
                dataIndex: 'numeropieza',
                width: 110,
                sortable: true,
                renderer: crearToolTip

            },
            {
                header: "Denominación",
                tooltip: 'Denominación',
                dataIndex: 'denominacion',
                width: 110,
                sortable: true,
                id: 'expandir',
                renderer: crearToolTip

            },
            {
                header: "Unidad de Medida",
                tooltip: 'Unidad de Medida',
                dataIndex: 'denoum',
                width: 110,
                sortable: true,
                renderer: crearToolTip
            },
            {
                header: "Precio MN",
                tooltip: 'Precio MN',
                dataIndex: 'precio',
                width: 90,
                sortable: true,
                renderer: crearToolTip

            },
            {
                header: "Precio MLC",
                tooltip: 'Precio MLC',
                dataIndex: 'preciodivisa',
                width: 90,
                sortable: true,
                renderer: crearToolTip

            },
            {
                header: "Centro de Balance",
                tooltip: 'Centro de Balance',
                dataIndex: 'denocentrobalance',
                width: 110,
                sortable: true,
                renderer: crearToolTip

            },
            {
                header: "Naturaleza",
                tooltip: 'Naturaleza',
                dataIndex: 'naturaleza',
                width: 90,
                sortable: true,
                renderer: crearToolTip

            }

        ]);

        _this.filtrosaddEquipos = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'filtrocodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'numeropieza',
                    xtype: 'numberfield',
                    idTextField: 'filtronumero',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'numeric',
                    dataIndex: 'precio',
                    xtype: 'numberfield',
                    idTextField: 'filtropreciomn',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'numeric',
                    dataIndex: 'preciodivisa',
                    xtype: 'numberfield',
                    idTextField: 'filtropreciomlc',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    dataIndex: 'denoum',
                    type: 'listado',
                    idcombo: 'idunidadmedida',
                    urlcb: 'listarUnidadmedida',
                    idstore: 'idunidadmedida',
                    valueFieldcb: 'idunidadmedida',
                    displayFieldcb: 'denominacionunidadmedida',
                    tpl: '<tpl for="."><div ext:qtip="{denominacionunidadmedida}" class="x-combo-list-item">{denominacionunidadmedida}</div></tpl>'
                }, {
                    dataIndex: 'denocentrobalance',
                    type: 'listado',
                    idcombo: 'identidaddatosnomenclador',
                    urlcb: 'ListarComboCentrobalance',
                    idstore: 'identidaddatosnomenclador',
                    valueFieldcb: 'identidaddatosnomenclador',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }
            ]
        });
        _this.sm_addEquipos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });


        _this.btn_aceptar_addEquipos = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: idioma.toolTipAceptarinversiones
        });

        _this.btn_cancelar_addEquipos = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.toolTipCancelarinversiones
        });
        _this.btnLimpiar = new Ext.Toolbar.Button({
            iconCls: 'btn',
            tabIndex: 11,
            icon: perfil.dirImg + 'limpiar.png',
            text: 'Limpiar',
            tooltip: 'Limpiar',
            id: 'btntodos',
            disabled: false

        });

        _this.grid_addEquipos = new Ext.grid.GridPanel({
            frame: true,
            border: false,
            autoWidth: true,
            height: 400,
            autoExpandColumn: 'expandir',
            plugins: _this.filtrosaddEquipos,
            store: modelo.store_addEquipos,
            sm: _this.sm_addEquipos,
            cm: _this.colModel_addEquipos,
            loadMask: {
                store: modelo.store_addEquipos
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptequipo',
                store: modelo.store_addEquipos,
                displayInfo: true,
                items: ['-', _this.btnLimpiar]
            })
        });

        _this.window_addEquipos = new Ext.Window({
            title: "Adicionar equipos",
            width: 900,
            height: 460,
            closeAction: 'hide',
            modal: true,
            frame: true,
            items: [_this.grid_addEquipos],
            buttons: [_this.btn_cancelar_addEquipos, _this.btn_aceptar_addEquipos]
        });
        //---------------------------------END ADD EQUIPOS------------------------



        //-----------------------------END EQUIPOS-----------------------------------
//-----------------------------------Ver Presupuesto-------------------------------------

        _this.btn_cerrar_ver_documento = new Ext.Button({
            text: idioma.btnCerrar,
            iconCls: 'cerrar',
            tooltip: idioma.toolTipCerrar
        });


        _this.gpVerPresupuesto = new Ext.grid.GridPanel({
            frame: true,
            height: 150,
            width: 800,
            viewConfig: {//con esto salen todas las columnas ajustadas
                forceFit: true
            },
            region: 'center',
            autoExpandColumn: 'grid_Presupuesto',
            store: modelo.stPresupuesto,
            columns: [
                {
                    header: "Valor",
                    tooltip: 'Valor',
                    dataIndex: 'valor',
                    width: 200,
                    id: 'grid_Presupuesto',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: "Moneda",
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 300,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: modelo.stMonedas
                    })
                }]
        });

        _this.fmVerPresupuesto = new Ext.form.FormPanel({
            labelAlign: 'top',
            width: 400,
            height: 200,
            frame: false,
            items: [_this.gpVerPresupuesto]
        });

        _this.winVerPresupuesto = new Ext.Window({
            title: idioma.vtVerPresuesto,
            width: 400,
            height: 200,
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            items: [_this.fmVerPresupuesto],
            buttons: [_this.btn_cerrar_ver_documento]
        });
//-----------------------------------Fin de Ver Presupuesto---------------------------------

//--------------------------------Inicio Ver Financiamiento----------------------------------
        _this.btn_cerrar_ver_financiamiento = new Ext.Button({
            text: idioma.btnCerrar,
            iconCls: 'cerrar',
            tooltip: idioma.toolTipCerrar
        });

        _this.gpVerFinanciamiento = new Ext.grid.GridPanel({
            frame: true,
            height: 150,
            width: 800,
            viewConfig: {//con esto salen todas las columnas ajustadas
                forceFit: true
            },
            region: 'south',
            store: modelo.store_Financiamiento,
            columns: [
                {
                    header: "Tipo de financiamiento",
                    tooltip: 'Tipo Financiamiento',
                    dataIndex: 'tipo',
                    id: 'idtipo',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        id: 'idtipofinanciamiento',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idtipofinanciamiento',
                        displayField: 'denominaciontipo',
                        store: modelo.stTipoFinan,
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                _this.modoace = true;
                            }
                        }
                    })
                }, {
                    header: "Financista",
                    tooltip: 'Financista',
                    dataIndex: 'financi',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        id: 'idfinancista',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idfinancista',
                        displayField: 'denominaciontipo',
                        store: modelo.stFinancista
                    })
                }, {
                    header: "Porciento Interés",
                    tooltip: 'Porciento',
                    dataIndex: 'porcientointeres',
                    width: 150,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: "Plazo de amortización",
                    tooltip: 'Plzo de amortización',
                    dataIndex: 'plazoamortizacion',
                    width: 170,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }
                , {
                    header: "Valor",
                    tooltip: 'Valor',
                    dataIndex: 'valor',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: "Moneda",
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: modelo.stMonedas
                    })
                }]
        });


        _this.fmVerFinanciamiento = new Ext.form.FormPanel({
            labelAlign: 'top',
            width: 800,
            height: 200,
            frame: false,
            items: [_this.gpVerFinanciamiento]
        });

        _this.winVerFinanciamiento = new Ext.Window({
            title: idioma.vtVerFinanciamiento,
            width: 800,
            height: 200,
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            items: [_this.fmVerFinanciamiento],
            buttons: [_this.btn_cerrar_ver_financiamiento]
        });

//--------------------------------Fin de Ver Finanaciamiento------------------------------------

//------------------------------Inicio Ver documento--------------------------------------------
        _this.sm_ver_documentos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });


        _this.colModel_ver_documentos = new Ext.grid.ColumnModel([
            {
                header: "Documentos",
                tooltip: 'Documentos',
                dataIndex: 'denominacion',
                width: 450,
                sortable: true

            }
        ]);


        _this.grid_ver_documentos = new Ext.grid.GridPanel({
            frame: true,
            width: 450,
            height: 500,
            region: 'center',
            autoWidth: true,
            store: modelo.store_verdoc,
            loadMask: {store: modelo.store_verdoc},
            sm: _this.sm_ver_documentos,
            cm: _this.colModel_ver_documentos

        });

        _this.fm_ver_documentos = new Ext.form.FormPanel({
            labelAlign: 'top',
            width: 450,
            height: 500,
            frame: false
        });

        _this.btn_aceptar_ver_documento = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: idioma.toolTipAceptarinversiones
        });

        _this.btn_cancelar_ver_documento = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.toolTipCancelarinversiones
        });

        //Ventana de Gestionar Documento
        _this.window_ver_docs = new Ext.Window({
            title: idioma.vtVerDoc,
            width: 450,
            height: 500,
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            items: [_this.fm_ver_documentos],
            buttons: [_this.btn_cancelar_ver_documento, _this.btn_aceptar_ver_documento]
        });
//----------------------------Fin Ver Documento------------------------------------
//
//------------------------------Inversiones---------------------------------------------------
        _this.btn_limpiar_inversiones = new Ext.Button({
            text: idioma.btnLimpiar,
            tooltip: idioma.toolTipAplicarinversiones,
            iconCls: 'limpiar'
        });

        _this.sm_inversiones = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.colModel_inversiones = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {header: idioma.tlcodigo, tooltip: 'Código', width: 75, sortable: true, dataIndex: 'codigo'},
            {header: idioma.tlDenom, tooltip: 'Denominación', width: 260, sortable: true, dataIndex: 'denominacion'},
            {header: idioma.tlClasif, tooltip: 'Clasificación', width: 75, sortable: true, hidden: true, dataIndex: 'clasificacion'},
            {header: idioma.tlTipoInv, tooltip: 'Tipo Inversión', width: 140, sortable: true, dataIndex: 'tipoinv'},
            {header: "Programa", tooltip: 'Programa', width: 140, sortable: true, dataIndex: 'programa'},
            {header: idioma.tlCaract, tooltip: 'Características', width: 90, sortable: true, hidden: true, dataIndex: 'caracteristicas'},
            {header: idioma.tlForma, tooltip: 'Forma de propiedad', width: 110, sortable: true, dataIndex: 'forma'},
            {header: idioma.tlProv, tooltip: 'Provincia', width: 65, sortable: true, dataIndex: 'provincia'},
            {header: idioma.tlFechaIni, tooltip: 'Fecha de inicio', width: 75, sortable: true, dataIndex: 'fechainicio'},
            {header: idioma.tlFechaFin, tooltip: 'Fecha fin', width: 75, sortable: true, dataIndex: 'fechafin'},
            {header: idioma.tlObjetivo, tooltip: 'Objetivo', width: 90, sortable: true, dataIndex: 'objetivo', hidden: false},
            {header: idioma.tlEfecto, tooltip: 'Efecto', width: 90, sortable: true, dataIndex: 'efecto', hidden: false},
            {header: 'Desempeño', tooltip: 'Desempeño', width: 110, sortable: true, hidden: true, dataIndex: 'desempenno'},
            {header: 'Análisis post-inversión', tooltip: 'Análisis post-inversión', hidden: true, width: 110, sortable: true, dataIndex: 'analpostinversiones'},
            {header: idioma.tlActivado, tooltip: 'Activado', width: 60, sortable: true, hidden: true, dataIndex: 'idestadoinversion', hidden: false, renderer: modificarEstado},
            {header: idioma.tlAprobado, tooltip: 'Aprobado', width: 60, sortable: true, hidden: true, dataIndex: 'idestadoaprobacion', hidden: false, renderer: modificarEstado},
            {header: 'V&iacute;a r&aacute;pida', tooltip: 'V&iacute;a r&aacute;pida', hidden: true, width: 100, sortable: true, dataIndex: 'fasttrack', hidden: false, renderer: modificarEstado},
            {header: 'Cuadrada', tooltip: 'Cuadrada', width: 100, sortable: true, hidden: true, dataIndex: 'cuadrada', hidden: false, renderer: modificarEstado}
        ]);

        _this.filtrosinv = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'filtrocodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    dataIndex: 'tipoinv',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: 'listarComboTipoInversion',
                    idstore: 'idtipoinversion',
                    valueFieldcb: 'idtipoinversionprograma',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'programa',
                    type: 'listado',
                    idcombo: 'filtrotProg',
                    urlcb: 'listarComboProgramada',
                    idstore: 'idprogramada',
                    valueFieldcb: 'idprogramada',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'clasificacion',
                    type: 'listado',
                    idcombo: 'idclasificacion',
                    urlcb: 'listarComboClasificacion',
                    idstore: 'stidclasificacion',
                    valueFieldcb: 'idtipoinversion',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'caracteristicas',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: 'listarComboCaracteristica',
                    idstore: 'idcaracteristica',
                    valueFieldcb: 'idcaracteristica',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'forma',
                    type: 'listado',
                    idcombo: 'idcmpformapropiedad',
                    urlcb: 'listarComboFormaPropiedad',
                    idstore: 'stidformapropiedad',
                    valueFieldcb: 'idformapropiedad',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'provincia',
                    type: 'listado',
                    idcombo: 'idprovincia',
                    urlcb: 'listarProvincias',
                    idstore: 'stidprovincia',
                    valueFieldcb: 'idprovincia',
                    displayFieldcb: 'provincia',
                    tpl: '<tpl for="."><div ext:qtip="{provincia}" class="x-combo-list-item">{provincia}</div></tpl>'
                }, {
                    type: 'date',
                    dateFormat: 'Y-m-d',
                    dataIndex: 'fechainicio'
                }, {
                    type: 'date',
                    dateFormat: 'Y-m-d',
                    dataIndex: 'fechafin'
                }, {
                    dataIndex: 'objetivo',
                    type: 'listado',
                    idcombo: 'idobjetivo',
                    urlcb: 'listarComboObjetivo',
                    idstore: 'stidobjetivo',
                    valueFieldcb: 'idobjetivo',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'efecto',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: 'listarComboEfecto',
                    idstore: 'stidefectocomercial',
                    valueFieldcb: 'idefectocomercial',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    type: 'list',
                    dataIndex: 'idestadoinversion',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'idestadoaprobacion',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'fasttrack',
                    options: ['Si', 'No']
                }, {
                    dataIndex: 'desempenno',
                    type: 'listado',
                    idcombo: 'filtrotInve',
                    urlcb: 'listarComboDesempenno',
                    idstore: 'iddatdesempenno',
                    valueFieldcb: 'iddatdesempenno',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    type: 'numeric',
                    dataIndex: 'analpostinversiones'
                }, {
                    type: 'list',
                    dataIndex: 'cuadrada',
                    options: ['Si', 'No']
                }
            ]
        });

        _this.grid_gestionar_inversiones = new Ext.grid.GridPanel({
            frame: true,
            title: idioma.tlInversiones,
            border: false,
            height: 165,
            autoScroll: true,
            plugins: _this.filtrosinv,
            store: modelo.store_gestionar_inversiones,
            loadMask: {
                store: modelo.store_gestionar_inversiones
            },
            sm: _this.sm_inversiones,
            cm: _this.colModel_inversiones,
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptinversiones',
                store: modelo.store_gestionar_inversiones,
                displayInfo: true,
                items: ['-', _this.btn_limpiar_inversiones]
            })
        });

        _this.pgpgestionarinversiones = new Ext.Panel({
            layout: 'fit',
            height: 200,
            autoWidth: true,
            border: false,
            items: [_this.grid_gestionar_inversiones]
        });



        //------------------------- Adicionar Inversiones -----------------------------------------------------

        _this.tfdenominacion = new Ext.form.TextField({
            xtype: 'textfield',
            width: 160,
            //regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            //maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            //regexText: 'Este campo solo admite caracteres alfanúmericos',
            regexText: perfil.etiquetas.msgRTdenominInv,
            align: 'right',
            allowBlank: false,
            fieldLabel: 'Denominaci&oacute;n'
        });
        _this.CmbFormaDePropiedad = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stFormapropiedad,
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Forma de propiedad',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });
        _this.CmbObjetivo = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            mode: 'local',
            store: modelo.stObjetivo,
            valueField: 'idobjetivo',
            displayField: 'denominacion',
            allowBlank: false,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Objetivo',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });
        _this.cmbClasificacion = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            valueField: 'idtipoinversion',
            displayField: 'denominacion',
            store: modelo.stClasificacion,
            allowBlank: false,
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'Seleccione...',
            fieldLabel: 'Clasificaci&oacute;n',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.tfProvincia = new Ext.form.TextField({
            xtype: 'textfield',
            width: 160,
            align: 'right',
            allowBlank: false,
            editable: false,
            readOnly: true,
            fieldLabel: 'Provincia'
        });

        _this.CmbEfectoEnComercio = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: modelo.stEfecto,
            valueField: 'idefectocomercial',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Efecto',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.CmbEstado = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: modelo.stEstado,
            valueField: 'idestado',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Estado',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });
        _this.CmbDesempeno = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: modelo.stDesempeno,
            valueField: 'iddatdesempenno',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Desempeño',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stDesempeno.reload();
                }
            }
        });

        _this.tfanalisis = new Ext.form.NumberField({
            width: 160,
            align: 'right',
            allowBlank: false,
            fieldLabel: 'Análisis post-inversión(meses)',
            regex: /^([0-9]*)+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/
        });



//xtype: 'textarea',
//id: 'descripcion',
//anchor: '100%',
//fieldLabel: perfil.etiquetas.lbDescripcion,
//editable: false,
//allowBlank: false


        _this.Observacion = new Ext.form.TextArea({
//            xtype: 'textarea',
            id: 'idobservacion',
            anchor: '100%',
            fieldLabel: 'Observaciones',
            editable: false
        });

        _this.btn_aceptar_assoDoc = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: idioma.toolTipAceptarinversiones
        });

        _this.btn_cancelar_assoDoc = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.toolTipCancelarinversiones
        });
        _this.tfDennominacion = new Ext.form.TextField({
            id: 'tfDennominacion',
            name: 'denominacion',
            tabIndex: 11,
            fieldLabel: "Denominación",
            anchor: '100%',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ_-]+ ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ _-]*)+$/,
            allowBlank: false
        });
        _this.taDescrip = new Ext.form.TextArea({
            id: 'taDescrip',
            tabIndex: 12,
            name: 'descripcion',
            fieldLabel: "Descripcion",
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ_-]+ ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ _-]*)+$/,
            allowBlank: false,
            anchor: '100%',
            maxLength: 255
        });
        _this.CmbTipoInversion = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            allowBlank: false,
            store: modelo.stTipoInversion,
            valueField: 'idtipoinversionprograma',
            displayField: 'denominacion',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Tipo de inversi&oacute;n',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });
        _this.CmbProgramada = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            allowBlank: false,
            store: modelo.stPrograma,
            valueField: 'idprogramada',
            displayField: 'denominacion',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Programa',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.tfFechaInicio = new Ext.form.DateField({
            id: 'idFechaInicio',
            width: 160,
            align: 'right',
            allowBlank: false,
            readOnly: true,
            endDateField: 'idFechaFin',
            //anchor: '100%',
            fieldLabel: 'Fecha Inicio',
            format: 'd/m/Y'


        });

        _this.ChkFastTrack = new Ext.form.Checkbox({
            width: 160,
            align: 'right',
            allowBlank: false,
            fieldLabel: 'V&iacute;a r&aacute;pida',
            disabled: true
        });

        _this.CmbCaracteristica = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            allowBlank: false,
            triggerAction: 'all',
            store: modelo.stCaracteristica,
            valueField: 'idcaracteristica',
            displayField: 'denominacion',
            mode: 'local',
            emptyText: 'Seleccione...',
            fieldLabel: 'Caracter&iacute;stica'
        });
        _this.cmbMedioAmbiente = new Ext.form.ComboBox({
            id: 'idcmbInvMedioAmbiente',
            width: 160,
            align: 'right',
            allowBlank: true,
            store: modelo.stMedioAmbiente,
            valueField: 'idmedioambiente',
            displayField: 'denominacion',
            // forceSelection: true,
            typeAhead: true,
            mode: 'local',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlMedioAmbiente,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stMedioAmbiente.reload();
                }
            }
        });
        _this.tfFechaFin = new Ext.form.DateField({
            id: 'idFechaFin',
            width: 160,
            align: 'right',
            allowBlank: false,
            readOnly: true,
            startDateField: 'idFechaInicio',
            fieldLabel: 'Fecha Fin',
            format: 'd/m/Y'
        });


        _this.btnAdicionarPresupuesto = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarPresupuesto',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: 'Adicionar',
            text: 'Adicionar'
        });

        _this.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEliminar',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: 'Eliminar',
            text: 'Eliminar'
        });

        _this.btnAdicionarFinan = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarFinan',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: 'Adicionar',
            text: 'Adicionar'
        });

        _this.btnEliminarFinan = new Ext.Button({
            disabled: true,
            id: 'btnEliminarFinan',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: 'Eliminar',
            text: 'Eliminar'
        });

        _this.btnAdicionarImpor = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarImpor',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: 'Adicionar',
            text: 'Adicionar'
        });

        _this.btnEliminarImpor = new Ext.Button({
            disabled: true,
            id: 'btnEliminarImpor',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: 'Eliminar',
            text: 'Eliminar'
        });
        //Ventana que sale luego dar clic en el texfield Provincia
        _this.rootNodoDpt = {
            text: 'Cuba',
            id: 0
        };

        _this.ventanaDpt = new Ext.secodena.comun.window.winSelectDPA({
            rootNodo: _this.rootNodoDpt,
            sinTitulo: true,
            selPais: true,
            id: 'winDPAPersona'
        });

        _this.fmAdicionarInversion = new Ext.form.FormPanel({
            width: 800,
            height: 100,
            region: 'north',
            frame: true,
            border: false,
            labelAlign: 'top',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.tfdenominacion, _this.CmbFormaDePropiedad, _this.CmbObjetivo, _this.CmbProgramada]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.cmbClasificacion, _this.tfProvincia, _this.CmbEfectoEnComercio,_this.tfanalisis]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbTipoInversion, _this.tfFechaInicio, _this.CmbDesempeno, _this.ChkFastTrack]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbCaracteristica, _this.tfFechaFin,_this.cmbMedioAmbiente ]
                        }
                    ]
                }, {
//                    layout: 'column',
//                    items: [
//                        {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                            xtype: 'textarea',
                            id: 'idobservacion',
                            anchor: '100%',
                            fieldLabel: 'Observaciones',
                            editable: false
                                    // allowBlank: false
                        }]
                            //  items: [_this.Observacion]
                }
//                    ]
//                }
            ]
        });

        _this.sm_importacion = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        _this.grid_Importacion = new Ext.grid.EditorGridPanel({
            title: 'Erogaci&oacute;n a l&iacutequido de importaci&oacute;n',
            frame: true,
            height: 250,
            region: 'north',
            sm: _this.sm_importacion,
            clicksToEdit: 1,
            autoExpandColumn: 'grid_Importacion',
            store: modelo.stImportacion,
            loadMask: {
                store: modelo.stImportacion
            },
            tbar: [_this.btnAdicionarImpor, _this.btnEliminarImpor],
            columns: [
                {
                    header: "Valor",
                    tooltip: 'Valor',
                    dataIndex: 'valor',
                    width: 200,
                    id: 'grid_Importacion',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([1-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                        selectOnFocus: true,
                        emptyText: 'Seleccione...',
                        allowBlank: false
                    })
                }, {
                    header: "Moneda",
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 300,
                    sortable: true,
                    renderer: rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmonedaim',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: modelo.stMonedas
                    })
                }]


        });


        _this.sm_presupuesto = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
//grid del add
        _this.grid_Presupuesto = new Ext.grid.EditorGridPanel({
            title: 'Plan de preparaci&oacute;n',
            frame: true,
            height: 200,
            region: 'center',
            sm: _this.sm_presupuesto,
            clicksToEdit: 1,
            autoExpandColumn: 'grid_PresupuestoAdd',
            store: modelo.stPresupuesto,
            loadMask: {
                store: modelo.stPresupuesto
            },
            tbar: [_this.btnAdicionarPresupuesto, _this.btnEliminar],
            columns: [
                {
                    header: "Valor",
                    tooltip: 'Valor',
                    dataIndex: 'valor',
                    width: 250,
                    id: 'grid_PresupuestoAdd',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([1-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                        selectOnFocus: true,
                        emptyText: 'Seleccione...',
                        allowBlank: false
                    })
                }, {
                    header: "Moneda",
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 300,
                    sortable: true,
                    renderer: rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmonedap',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: modelo.stMonedas
                    })
                }]


        });

        _this.sm_financiamiento = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        _this.grid_Financiamiento = new Ext.grid.EditorGridPanel({
            title: 'Financiamiento',
            frame: true,
            sm: _this.sm_financiamiento,
            autoScroll: true,
            height: 250,
            region: 'south',
            loadMask: {
                store: modelo.store_Financiamiento
            },
            store: modelo.store_Financiamiento,
            tbar: [_this.btnAdicionarFinan, _this.btnEliminarFinan],
            columns: [
                {
                    header: "Quién Financia",
                    tooltip: 'Quién Financia',
                    dataIndex: 'financi',
                    width: 150,
                    sortable: true,
                    renderer: rendeFinancista,
                    editor: new Ext.form.ComboBox({
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idfinancista',
                        displayField: 'denominaciontipo',
                        store: modelo.stFinancista,
                        tpl: '<tpl for="."><div ext:qtip="{denominaciontipo}" class="x-combo-list-item">{denominaciontipo}</div></tpl>'
                    })
                }, {
                    header: "Como se financia",
                    tooltip: 'Como se financia',
                    dataIndex: 'tipo',
                    width: 150,
                    sortable: true,
                    renderer: rendeTipoFin,
                    editor: new Ext.form.ComboBox({
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idtipofinanciamiento',
                        displayField: 'denominaciontipo',
                        store: modelo.stTipoFinan,
                        tpl: '<tpl for="."><div ext:qtip="{denominaciontipo}" class="x-combo-list-item">{denominaciontipo}</div></tpl>'
                    })
                }, {
                    header: "Gracia",
                    tooltip: 'Gracia',
                    dataIndex: 'gracia',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: "Porciento Interés",
                    tooltip: 'Porciento',
                    dataIndex: 'porcientointeres',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: "Plazo de amortización",
                    tooltip: 'Plazo de amortización',
                    dataIndex: 'plazoamortizacion',
                    width: 170,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false,
                        decimalPrecision: 3
                    })
                }, {
                    header: "Valor",
                    tooltip: 'Valor',
                    dataIndex: 'valor',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.TextField({
                        disabledClass: 'disabled-component',
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([1-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                        selectOnFocus: true,
                        allowBlank: false

                    })
                }, {
                    header: "Moneda",
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 200,
                    sortable: true,
                    renderer: rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: modelo.stMonedas
                    })
                }]
        });


        _this.pPrincipal = new Ext.Panel({
            height: 500,
            region: 'center',
            layout: 'fit',
            items: [_this.fmAdicionarInversion]
        });

        _this.tabAbajo = new Ext.TabPanel({
            id: 'tabAbajo',
            height: 200,
            activeTab: 0,
            region: 'south',
            items: [_this.grid_Importacion, _this.grid_Presupuesto, _this.grid_Financiamiento]
        });


        _this.win_add_inversiones = new Ext.Window({
            width: 1000,
            height: 600,
            layout: 'border',
            closeAction: 'hide',
            resizable: false,
            modal: true,
            items: [_this.pPrincipal, _this.tabAbajo],
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip: perfil.etiquetas.toolTipCancelarParam,
                    text: perfil.etiquetas.btnCancelar,
                    handler: function() {
                        _this.win_add_inversiones.hide();
                        _this.tabAbajo.setActiveTab(0);
                    }

                }, {
                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'btn',
                    id: 'btnaplicar',
                    tooltip: perfil.etiquetas.toolTipAplicarWinAddInversion,
                    text: perfil.etiquetas.btnAplicar,
                    disable: false
                },
                {
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn',
                    id: 'btnaceptar',
                    tooltip: perfil.etiquetas.toolTipAceptarWinAddInversion,
                    text: perfil.etiquetas.btnAceptar,
                    disable: false
                }],
            listeners: {
                beforeshow: function() {
                    modelo.stFormapropiedad.load();
                    modelo.stObjetivo.load();
                    modelo.stClasificacion.load();
                    modelo.stEfecto.load();
                    modelo.stTipoInversion.load();
                    modelo.stCaracteristica.load();
                    modelo.stMedioAmbiente.load();
                    modelo.stPrograma.load();
                }
            }

        });

        //---------------------- Componentes -------------------------------------------------
        _this.btn_limpiar_componente = new Ext.Button({
            text: idioma.btnLimpiar,
            tooltip: idioma.toolTipAplicarinversiones,
            iconCls: 'limpiar'
        });


        _this.sm_componentes = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.colModel_componentes = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {header: idioma.tlDenom, tooltip: idioma.tlDenom, width: 300, sortable: true, dataIndex: 'denominacion'},
            {header: idioma.tlEstado, tooltip: idioma.tlEstado, width: 300, sortable: true, dataIndex: 'estado'},
            {header: "Orden", tooltip: "Orden", width: 150, sortable: true, dataIndex: 'orden'},
        ]);
        _this.filtroscomp = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'listado',
                    idcombo: 'estadofilt',
                    urlcb: 'listarEstados',
                    idstore: 'idestado',
                    valueFieldcb: 'idestadosft',
                    displayFieldcb: 'denominacion',
                    dataIndex: 'estado'
                }, {
                    type: 'numeric',
                    dataIndex: 'orden'
                }
            ]
        });
        _this.cmp_CambioEstado = new Ext.form.ComboBox({
            id: 'idcmp_CambioEstado',
            width: 160,
            disabled: true,
            mode: 'local',
            triggerAction: 'all',
            store: modelo.stCambioEstado,
            valueField: 'idestadosft',
            displayField: 'deno',
            emptyText: 'Seleccione...'
        });
        _this.grid_gestionar_componentes = new Ext.grid.GridPanel({
            frame: true,
            region: 'center',
            height: 130,
            border: false,
            disable: false,
            plugins: _this.filtroscomp,
            store: modelo.store_gestionar_componentes,
            sm: _this.sm_componentes,
            cm: _this.colModel_componentes,
            loadMask: {
                store: modelo.store_gestionar_componentes
            },
            tbar: ["Cambio de estado", _this.cmp_CambioEstado, _this.btn_equipos, _this.btn_constructores],
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                id: 'ptcomponente',
                store: modelo.store_gestionar_componentes,
                displayInfo: true,
                items: ['-', _this.btn_limpiar_componente]
            })
        });


        //------------------ Elementos ---------------------------------   

        _this.btn_limpiar_elemento = new Ext.Button({
            text: idioma.btnLimpiar,
            tooltip: idioma.toolTipAplicarinversiones,
            iconCls: 'limpiar'
        });

        _this.sm_elementos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.sm_elementos_der = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.colModel_elementos = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {header: idioma.tlIdent, dataIndex: 'idetapaelementoinversion', hidden: true},
            {header: idioma.tlDenom, tooltip: 'Denominaci&oacute;n', width: 160, sortable: true, dataIndex: 'denominacion'},
            {header: idioma.tlasociados, tooltip: 'Documentos asociados', width: 160, sortable: true, dataIndex: 'documento', renderer: modificarEstado},
            {header: idioma.tlparametros, tooltip: 'Par&aacute;metros din&aacute;micos', width: 160, sortable: true, dataIndex: 'parametrosdinamicos', id: 'expandir', renderer: modificarEstado}
        ]);
        _this.colModel_elementos_der = new Ext.grid.ColumnModel([
            {
                header: "Valor",
                tooltip: 'Valor',
                dataIndex: 'valor',
                width: 100,
                height: 80,
                id: 'grid',
                sortable: true,
                editor: new Ext.form.NumberField({
                    disabledClass: 'disabled-component',
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([1-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                    selectOnFocus: true,
                    allowBlank: false,
                    decimalPrecision: 3
                })
            },
            {
                header: "Moneda",
                tooltip: 'Moneda',
                dataIndex: 'moneda',
                width: 60,
                height: 80,
                sortable: true,
                id: 'expandir',
                renderer: rendeMoneda,
                editor: new Ext.form.ComboBox({
                    id: 'idm',
                    mode: 'local',
                    triggerAction: 'all',
                    allowBlank: false,
                    emptyText: 'Seleccione...',
                    valueField: 'moneda',
                    displayField: 'denominacion',
                    store: modelo.stMonedasEValor,
                    listeners: {
                        select: function(c, r, i) {
                            record = _this.grid_gestionar_elementos_der.getSelectionModel().getSelected();
                            index = modelo.store_gestionar_elementos_der.indexOf(record);
                            //modelo.store_gestionar_elementos_der.getAt(index).data.moneda = r.data.moneda;
                            modelo.store_gestionar_elementos_der.getAt(index).data.idmonedaentidad = r.data.idmonedaentidad;
                        }
                    }
                })
            }

        ]);

        _this.btn_gest_docs = new Ext.Button({
            text: idioma.btnGestDoc,
            tooltip: idioma.toolTipGestdoc,
            iconCls: 'btn',
            disabled: true,
            icon: perfil.dirImg + 'nuevo.png'
        });

        _this.btn_gest_para = new Ext.Button({
            id: 'idbtn_gest_para',
            text: idioma.btnGestParam,
            tooltip: idioma.toolTipGestparam,
            iconCls: 'btn',
            disabled: true,
            icon: perfil.dirImg + 'nuevo.png'
        });
        _this.filtroselemt = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                },
                {
                    type: 'list',
                    dataIndex: 'documento',
                    options: ['SI', 'NO']

                },
                {
                    type: 'list',
                    dataIndex: 'parametrosdinamicos',
                    options: ['SI', 'NO']

                }
            ]
        });

        _this.grid_gestionar_elementos = new Ext.grid.GridPanel({
            frame: true,
            title: idioma.tlElementos,
            border: false,
            region: 'center',
            autoScroll: true,
            height: 165,
            width: 50,
            autoExpandColumn: 'expandir',
            plugins: _this.filtroselemt,
            loadMask: {
                store: modelo.store_gestionar_elementos
            },
            store: modelo.store_gestionar_elementos,
            sm: _this.sm_elementos,
            cm: _this.colModel_elementos,
            tbar: [_this.btn_gest_docs, _this.btn_gest_para],
            bbar: new Ext.PagingToolbar({
                pageSize: 2,
                id: 'ptelemento',
                store: modelo.store_gestionar_elementos,
                displayInfo: true,
                items: ['-', _this.btn_limpiar_elemento]
            })
        });

        _this.btn_adicionar_elementos_der = new Ext.Button({
            text: idioma.btnAdicionar,
            tooltip: idioma.toolTipAdicionarElementoDer,
            disabled: true,
            iconCls: 'adicionar'
        });

        _this.btn_guardar_elementos_der = new Ext.Button({
            text: idioma.btnGuardar,
            tooltip: idioma.toolTipGuardarElementoDer,
            disabled: true,
            iconCls: 'guardar'
        });

        _this.btn_eliminar_elementos_der = new Ext.Button({
            text: idioma.btnEliminar,
            tooltip: idioma.toolTipEliminarElementoDer,
            disabled: true,
            iconCls: 'eliminar'
        });
        _this.grid_gestionar_elementos_der = new Ext.grid.EditorGridPanel({
            store: modelo.store_gestionar_elementos_der,
            sm: _this.sm_elementos_der,
            autoScroll: true,
            autoWidth: true,
            frame: true,
            editable: true,
            autoExpandColumn: 'expandir',
            loadMask: {
                store: modelo.store_gestionar_elementos_der
            },
            viewConfig: {
                getRowClass: function(record, index) {
                    if (record.data.pintar == 1) {
                        return 'verde';
                    }
                    else {
                        return '';
                    }
                }
            },
            cm: _this.colModel_elementos_der,
            tbar: [_this.btn_adicionar_elementos_der, _this.btn_guardar_elementos_der, _this.btn_eliminar_elementos_der]
        });

        _this.pContenidoDerDer = new Ext.Panel({
            height: 200,
            width: 250,
            frame: true,
            border: false,
            layout: 'fit',
            collapsible: true,
            region: 'east',
            items: [_this.grid_gestionar_elementos_der]
        });
        _this.pContenidoDer = new Ext.Panel({
            region: 'south',
            collapsible: true,
            collapsed: true,
            layout: 'border',
            height: 200,
            border: false,
            frame: true,
            items: [_this.grid_gestionar_elementos, _this.pContenidoDerDer]

        });

        _this.btn_asoc_documento = new Ext.Button({
            text: idioma.btnAsociarDoc,
            tooltip: idioma.toolTipAplicarinversiones,
            iconCls: 'asociar'
        });
        _this.btn_verEspacio = new Ext.Button({
            text: 'Ver espacio de trabajo',
            tooltip: idioma.toolTipAplicarinversiones,
            iconCls: 'ver'
        });
        _this.sm_gestionar_documentos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.colModel_gestionar_documentos = new Ext.grid.ColumnModel([
            {
                header: "Documentos",
                tooltip: 'Documentos',
                dataIndex: 'denominacion',
                width: 800,
                sortable: true,
                renderer: function(value, p, record) {
                    p.attr = 'ext:qtip="' + value + '"';
                    return String.format(value,
                            value, record.data.iddocumentos);
                }

            }
        ]);

        _this.grid_gestionar_documentos = new Ext.grid.GridPanel({
            frame: true,
            width: 450,
            height: 500,
            region: 'center',
            autoWidth: true,
            viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
                forceFit: true
            },
            store: modelo.store_gestionar_documentos,
            loadMask: {store: modelo.store_gestionar_documentos},
            sm: _this.sm_gestionar_documentos,
            cm: _this.colModel_gestionar_documentos

        });

        _this.formulario_gestionar_documentos = new Ext.form.FormPanel({
            labelAlign: 'top',
            width: 450,
            height: 500,
            frame: false,
            tbar: [_this.btn_verEspacio],
            items: [_this.grid_gestionar_documentos]
        });
        _this.btn_cancelar_gestionar = new Ext.Button({
            text: "Cerrar",
            iconCls: 'cancelar',
            tooltip: idioma.toolTipCancelarinversiones
        });

        //Ventana de Gestionar Documento
        _this.window_gestionar_docs = new Ext.Window({
            title: idioma.vtGestDoc,
            width: 450,
            height: 500,
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            items: [_this.formulario_gestionar_documentos],
            buttons: [_this.btn_cancelar_gestionar]
        });

        _this.colModel_gestionar_parametros = new Ext.grid.ColumnModel([]);

        _this.smParamsdinamico = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });


        _this.grid_gestionar_parametros = {
            store: modelo.store_gestionar_parametros,
            id: 'gpGestparamentros',
            sm: _this.smParamsdinamico,
            cm: new Ext.grid.ColumnModel([]),
            frame: false,
            height: 300,
            width: 400,
            region: 'center',
            tbar: [_this.btnAdicionarParamTbar, _this.btnEliminarParamTbar],
            clicksToEdit: 2,
        }

        //Ventana de Gestionar Parametros Dinamicos
        _this.window_gestionar_parametros = {
            title: idioma.vtGestionarParamDinamicos,
            height: 300,
            width: 400,
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            buttons: [_this.btnCancelarParam, _this.btnAceptarParam]
        };

        _this.pgestionar_inversiones = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            collapsible: true,
            collapsed: false,
            height: 200,
            border: false,
            frame: true,
            items: [_this.grid_gestionar_inversiones]

        });
        _this.pcomponentes = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            height: 200,
            border: false,
            frame: true,
            items: [_this.grid_gestionar_componentes]
        });
        _this.pgestionar_componentes = new Ext.Panel({
            id: 'idPanelContendor',
            title: 'Componentes',
            collapsed: true,
            region: 'south',
            layout: 'border',
            collapsible: true,
            split: true,
            border: false,
            height: 400,
            frame: true,
            items: [_this.pcomponentes, _this.pContenidoDer]
        });
        _this.pContenido = new Ext.Panel({
            layout: 'border',
            region: 'center',
            height: 1500,
            frame: true,
            border: false,
            items: [_this.pgestionar_inversiones, _this.pgestionar_componentes]
        });

        _this.pGeneral = new Ext.Panel({
            layout: 'border',
            border: false,
            width: 200,
            tbar: [_this.btnAdicionarinversion, _this.btnModificarinversion, _this.btnEliminarinversion, _this.btn_activar_inversion,
                _this.btn_desactivar_inversion, _this.btnMenuAprobacion_inversion, _this.btn_presupuesto_inversion,
                _this.btn_financiamiento_inversion, _this.btn_ver_Detalles, _this.btn_georefe_inversion, _this.btnImportar, _this.btnCierreInversion, /*_this.btnGraficoInversion,*/ _this.ChConsolidar, '', _this.ChVigente, '->', 'Ejercicio:', _this.cmbEjercicio, '-', '->', _this.btnAyudainversion
            ],
            items: [_this.treePanelinversion, _this.pContenido]
        });

        _this.view = new Ext.Viewport({
            layout: 'fit',
            items: [_this.pGeneral]
        });


        function crearToolTip(v, m) {
            m.attr = 'ext:qtip="' + v + '"';
            return v;
        }
        function rendererAdquirir(idadquisicion) {
            var index = modelo.stAdquisicion.find('idadquisicion', idadquisicion);
            if (index > -1) {
                var record = modelo.stAdquisicion.getAt(index);
                return record.get('denominacion');
            }
            return idadquisicion;
        }
        function rendererComprar(idcomprar) {
            var index = modelo.stComprar.find('idcomprar', idcomprar);
            if (index > -1) {
                var record = modelo.stComprar.getAt(index);
                return record.get('denominacion');
            }
            return idcomprar;

        }
        function rendererComprarP(idcomprar) {
            var index = modelo.stComprar.find('idcomprar', idcomprar);
            if (index > -1) {
                var record = modelo.stComprar.getAt(index);
                return record.get('denominacion');
            }
            return idcomprar;
        }

        function rendeMoneda(idmoneda) {
            var index = modelo.stMonedas.find('idmoneda', idmoneda);
            if (index > -1) {
                var record = modelo.stMonedas.getAt(index);
                return record.get('denominacion');
            }
            return idmoneda;
        }

        function rendeFinancista(idfinancista) {
            var index = modelo.stFinancista.find('idfinancista', idfinancista);
            if (index > -1) {
                var record = modelo.stFinancista.getAt(index);
                return record.get('denominaciontipo');
            }
            return idfinancista;
        }

        function rendeTipoFin(idtipofinanciamiento) {
            var index = modelo.stTipoFinan.find('idtipofinanciamiento', idtipofinanciamiento);
            if (index > -1) {
                var record = modelo.stTipoFinan.getAt(index);
                return record.get('denominaciontipo');
            }
            return idtipofinanciamiento;
        }
        function rendererConstructor(idconstructor) {
            var index = modelo.stConstructores.find('idconstructor', idconstructor);
            if (index > -1) {
                var record = modelo.stConstructores.getAt(index);
                return record.get('denomconstructor');
            }
            return idconstructor;
        }

        function modificarEstado(val, m, record, row, col) {
            var palabra = GetPalabraColumna(val, col);
            m.attr = 'ext:qtip="' + palabra + '"';
            if (val == 1) {
                return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
            }

            return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
        }
        function modificarEstadocCmp(val, m, record, row, col) {
            var palabra = GetPalabraColumna(val, col);
            m.attr = 'ext:qtip="' + palabra + '"';
            if (val == 0) {
                return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
            }

            return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
        }

        function GetPalabraColumna(val, col)
        {
            if (col == 17)
                return (val == 1) ? 'Fasttrack' : 'No Fasttrack';
            if (col == 16)
                return (val == 1) ? 'Aprobado' : 'Desaprobado';
            if (col == 15)
                return (val == 1) ? 'Activado' : 'Desactivado';
            if (col == 18)
                return (val == 1) ? 'Cuadrada' : 'Descuadrada';
        }

    },
    build: function(items) {
        var me = this;
        return this.window_gestionar_parametros = new Ext.Window({
            title: this.idioma.vtGestionarParamDinamicos,
            height: 300,
            width: 400,
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            items: [items],
            buttons: [me.btnCancelarParam, me.btnAceptarParam]
        });
    }

}