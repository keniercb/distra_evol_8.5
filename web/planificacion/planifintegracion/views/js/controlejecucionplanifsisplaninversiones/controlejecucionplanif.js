var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controlejecucionplanif', cargarInterfaz);
var _this = this;
var esHoja, idplanificacionactual, idEstructuraPadre, entidadsel = null, offsetInd = 0, offsetIndEjec = 0, offsetIndDesv = 0, offsetIndAdic = 0, offsetAct = 0, offsetActEjec = 0, offsetActDesv = 0, offsetActAdic = 0;
var adicion = false, identidadselected = null;
var adicionactv = false;
var esRector = false;
var filasPlan = [];
var filasActv = [];

var reloadTab = true;
UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
    for (i in acciones_reportes) {
        if (acciones_reportes[i].abreviatura == 'rector') {
            esRector = true;
            break;
        } else {
            esRector = false;
        }

    }
});

function cargarInterfaz() {
    btnAyudaControlEjecucionPlanif = new Ext.Toolbar.Button({
        id: 'idbtnAyudaControlEjecucionPlanif',
        iconCls: 'ayuda',
        tooltip: 'Ayuda (<b>Alt+H</b>)',
        text: 'Ayuda'
    });

    Ext.ns('Ext.ux.layout');
    Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
        monitorResize: true,
        isValidParent: function(c, target) {
            return c.getEl().dom.parentNode == this.innerCt.dom;
        },
        onLayout: function(ct, target) {
            var rs = ct.items.items, len = rs.length, r, i;

            if (!this.innerCt) {
                target.addClass('ux-row-layout-ct');
                this.innerCt = target.createChild({cls: 'x-row-inner'});
            }
            this.renderAll(ct, this.innerCt);

            var size = target.getViewSize();

            if (size.width < 1 && size.height < 1) { // display none?
                return;
            }

            var h = size.height - target.getPadding('tb'),
                    ph = h;

            this.innerCt.setSize({height: h});


            for (i = 0; i < len; i++) {
                r = rs[i];
                if (!r.rowHeight) {
                    ph -= (r.getSize().height + r.getEl().getMargins('tb'));
                }
            }

            ph = ph < 0 ? 0 : ph;

            for (i = 0; i < len; i++) {
                r = rs[i];
                if (r.rowHeight) {
                    r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
                }
            }
        }

    });
    Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
    Ext.QuickTips.init();

//------------------------------GENERAL----------------------------

    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }]),
        listeners: {
            load: function(t, n, e) {
                cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        }
    });

    cmbEjercicio = new Ext.form.ComboBox({
        width: 150,
        id: 'idejercicioplanif',
        store: stCbejercicio,
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
        allowBlank: false,
        listeners: {
            select: function() {
                stPlanes.baseParams.identidad = identidadselected;
                stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                stPlanes.baseParams.glob = Ext.getCmp('chkglobalCEP').getValue();
                stPlanes.load();
                filasPlan = [];
                filasActv = [];
                gpNivelesActividadesEjecucionPlanif.getStore().reload();
            }
        }
    });

    //boton para comp graficas
    btnGraficas = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: entidadsel,
        componente: 'CEP'
    });

    btnGraficoPlanif = btnGraficas.botonMenuGrafica();

    tpEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 600
            });

    tpEntidades.btnBuscar.setText("");
    tpEntidades.btnLimpiar.setText("");
    tpEntidades = tpEntidades.items.items[0];
    tpEntidades.getRootNode().expand();
    tpEntidades.region = 'west';

    tpEntidades.addListener('click', function(n) {

        if (n.text != "Estructuras") {
            cmbPlanes.enable();
            pGeneralActividades.enable();
            pGeneralPlanes.enable();
            //Ext.getCmp('chkglobalCEP').enable();
            cmbEjercicio.enable();
            pDesgIndicadoresEjecucionPlanif.disable();
            pDesviacionIndicadoresEjecucionPlanif.disable();

            pDesgActividadesEjecucionPlanif.disable();
            pDesvActividadesEjecucionPlanif.disable();

            btnGraficoPlanif.enable();
            btnGraficoPlanifNA.enable();
            identidadselected = n.id;
            entidadsel = n;
            btnGraficas.actualizarParametros(n, 'CEP');
            btnGraficasNA.actualizarParametros(n, 'CENA');
            tpEntidades.getSelectionModel().select(n);
            idEstructuraPadre = n.attributes._parent;
            denomentidadselected = n.text;
            filasPlan = [];
            filasActv = [];
            if (n.leaf == true) {
                if (tpEjecucion.getActiveTab().id == "idejecucion_actividades") {
                    stNivelesActividadesEjecucionPlanif.load();
                }
                tpPlanesRealDesv.expand();
                tpPlanesRealDesv.enable();
                pAdicionIndicadoresEjecucionPlanif.enable();
                Ext.getCmp('idtp_actividades').setActiveTab('idTpAdicion_actividades');
                Ext.getCmp('idtp_planes').setActiveTab('idTpAdicion_plan');
                pAdicActividadesEjecucionPlanif.enable();
                esHoja = 1;
                btnGuadarAdicionPlan.disable();
                btnAdicionPlan.enable();
                stPlanes.baseParams.identidad = identidadselected;
                stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                stPlanes.baseParams.glob = Ext.getCmp('chkglobalCEP').getValue();
                stPlanes.load();
            } else if (n.leaf == false) {
                stNivelesActividadesEjecucionPlanif.load();
                esHoja = 0;
                tpPlanesRealDesv.collapse(true);
                pDesgIndicadoresEjecucionPlanif.disable();
                pDesviacionIndicadoresEjecucionPlanif.disable();
                pAdicionIndicadoresEjecucionPlanif.disable();

                tpActividadesRealDesv.collapse(true);
                pDesgActividadesEjecucionPlanif.disable();
                pDesvActividadesEjecucionPlanif.disable();
                pAdicActividadesEjecucionPlanif.disable();
                stActividadesAdicEjecucionPlanif.removeAll();
                stActividadesDesvEjecucionPlanif.removeAll();
                stActividadesRealPorFechaEjecucionPlanif.removeAll();

                stDesgIndicadoresEjecucionPlanif.removeAll();
                stDesvIndicadoresEjecucionPlanif.removeAll();
                stAdicIndicadoresEjecucionPlanif.removeAll();
                btnGuadarAdicionPlan.disable();
                btnAdicionPlan.disable();
                stPlanes.baseParams.identidad = identidadselected;
                stPlanes.baseParams.glob = Ext.getCmp('chkglobalCEP').getValue();
                stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                stPlanes.load();
            }
        } else {
            cmbPlanes.disable();
            pGeneralActividades.disable();
            pGeneralPlanes.disable();
            // Ext.getCmp('chkglobalCEP').disable();
            cmbEjercicio.disable();
            cmbPlanes.clearValue();
            reloadTab = false;
            tpEjecucion.setActiveTab(Ext.getCmp('idejecucion_plan'));
            var storeNivelesActividadesEjecucionPlanif = gpNivelesActividadesEjecucionPlanif.getStore();
            storeNivelesActividadesEjecucionPlanif.removeAll();

            var storeIndicadoresEjecucionPlanif = gpIndicadoresEjecucionPlanif.getStore();
            storeIndicadoresEjecucionPlanif.removeAll();
            //gpAdicIndicadoresEjecucionPlanif
            var storeAdicIndicadoresEjecucionPlanif = gpAdicIndicadoresEjecucionPlanif.getStore();
            storeAdicIndicadoresEjecucionPlanif.removeAll();
            //gpActividadesAdicEjecucionPlanif
            var storeActividadesAdicEjecucionPlanif = gpActividadesAdicEjecucionPlanif.getStore();
            storeActividadesAdicEjecucionPlanif.removeAll();
        }
    });


//------------ Planes -----------------------
    stPlanes = new Ext.data.Store({
        url: 'listarComboModelos',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function(st, rec, obj) {
                if (st.getCount() != 0) {
                    cmbPlanes.setValue(st.data.items[0].data.idmodelo);
                    Ext.getCmp('idplanes').enable();
                    if (Ext.getCmp('chkglobalCEP').getValue() == false) {
                        stAdicIndicadoresEjecucionPlanif.load();
                        stIndicadoresEjecucionPlanif.load();
                        tpPlanesRealDesv.expand();
                        tpPlanesRealDesv.enable();
                        pAdicionIndicadoresEjecucionPlanif.enable();

                    } else {
                        stIndicadoresEjecucionPlanif.load();
                        tpPlanesRealDesv.collapse(true);
                        pDesgIndicadoresEjecucionPlanif.disable();
                        pDesviacionIndicadoresEjecucionPlanif.disable();
                        pAdicionIndicadoresEjecucionPlanif.disable();

                        tpActividadesRealDesv.collapse(true);
                        pDesgActividadesEjecucionPlanif.disable();
                        pDesvActividadesEjecucionPlanif.disable();
                        pAdicActividadesEjecucionPlanif.disable();
                    }
                } else {
                    tpPlanesRealDesv.collapse(true);
                    pDesgIndicadoresEjecucionPlanif.disable();
                    pDesviacionIndicadoresEjecucionPlanif.disable();
                    pAdicionIndicadoresEjecucionPlanif.disable();

                    tpActividadesRealDesv.collapse(true);
                    pDesgActividadesEjecucionPlanif.disable();
                    pDesvActividadesEjecucionPlanif.disable();
                    pAdicActividadesEjecucionPlanif.disable();
                    stIndicadoresEjecucionPlanif.removeAll();
                    mostrarMensaje(1, 'La entidad seleccionada no posee indicadores planificados.');
                    cmbPlanes.clearValue();
                    cmbPlanes.disable();
                }
            }
        }
    });

    //boton para comp graficas
    btnGraficasNA = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: entidadsel,
        componente: 'CENA'
    });

    btnGraficoPlanifNA = btnGraficasNA.botonMenuGrafica();

    cmbPlanes = new Ext.form.ComboBox({
        width: 150,
        id: 'idplanes',
        store: stPlanes,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        typeAhead: true,
        mode: 'local',
        disabled: true,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        listeners: {
            select: function() {
                btnAdicionPlan.enable();
                btnGuadarAdicionPlan.disable();
                btnEliminarAdicion.disable();
                if (Ext.getCmp('chkglobalCEP').getValue() == false) {
                    stIndicadoresEjecucionPlanif.load();
                } else {
                    stAdicIndicadoresEjecucionPlanif.reload();
                    stIndicadoresEjecucionPlanif.load();
                }
                filasPlan = [];
                filasActv = [];
            }
        },
        allowBlank: false
    });

    smIndicadoresEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, rowIndex, rec) {
                if (tpPlanesRealDesv.getActiveTab().id == 'idTpDesviacion_plan' && Ext.getCmp('chkglobalCEP').getValue() == false) {
                    stDesvIndicadoresEjecucionPlanif.load();
                } else if (tpPlanesRealDesv.getActiveTab().id == 'idTpDesglose_plan' && Ext.getCmp('chkglobalCEP').getValue() == false) {
                    stDesgIndicadoresEjecucionPlanif.load();
                }

                idplanificacionactual = sm.getSelected().data.idplanificacion;
                Ext.getCmp('idbtnGuardarDesv').enable();
                if (Ext.getCmp('chkglobalCEP').getValue() == false) {
                    Ext.getCmp('idbtnAdicionarDesg').enable();
                    Ext.getCmp('idbtnGuardarDesg').disable();
                    btnExtraPlan.enable();
                    GridEditable(gpDesgIndicadoresEjecucionPlanif.getColumnModel());
                    GridEditable(gpDesvIndicadoresEjecucionPlanif.getColumnModel());
                    GridEditable(gpAdicIndicadoresEjecucionPlanif.getColumnModel());
                    tpPlanesRealDesv.expand();
                    pDesgIndicadoresEjecucionPlanif.enable();
                    pDesviacionIndicadoresEjecucionPlanif.enable();
                    pAdicionIndicadoresEjecucionPlanif.enable();
                } else {
                    Ext.getCmp('idbtnAdicionarDesg').disable();
                    Ext.getCmp('idbtnGuardarDesg').disable();
                    btnExtraPlan.disable();
                    GridNoEditable(gpDesgIndicadoresEjecucionPlanif.getColumnModel());
                    GridNoEditable(gpDesvIndicadoresEjecucionPlanif.getColumnModel());
                    GridNoEditable(gpAdicIndicadoresEjecucionPlanif.getColumnModel());
                    tpPlanesRealDesv.collapse(true);
                    pDesgIndicadoresEjecucionPlanif.disable();
                    pDesviacionIndicadoresEjecucionPlanif.disable();
                    pAdicionIndicadoresEjecucionPlanif.disable();
                    stDesgIndicadoresEjecucionPlanif.removeAll();
                    stDesvIndicadoresEjecucionPlanif.removeAll();
                }
            },
            rowdeselect: function(sm, rowIndex, record) {
                idplanificacionactual = '';
                Ext.getCmp('idbtnAdicionarDesg').disable();
                Ext.getCmp('idbtnGuardarDesg').disable();
                Ext.getCmp('idbtnGuardarDesv').disable();
                btnExtraPlan.disable();
                stDesgIndicadoresEjecucionPlanif.removeAll();
                stDesvIndicadoresEjecucionPlanif.removeAll();

                pDesgIndicadoresEjecucionPlanif.disable();
                pDesviacionIndicadoresEjecucionPlanif.disable();
            }
        }
    });

    stIndicadoresEjecucionPlanif = new Ext.data.Store({
        url: 'listarIndicadores',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'umedida'
            }, {
                name: 'cantfinal'
            }, {
                name: 'idplanificacion'
            }, {
                name: 'cantreal'
            }, {
                name: 'pendiente'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                st.baseParams.idmodelo = cmbPlanes.getValue();
                st.baseParams.start = offsetInd;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.identidad = identidadselected;
                st.baseParams.glob = Ext.getCmp('chkglobalCEP').getValue();
            },
            load: function(st, rec, op) {
                if (filasPlan.length != 0) {
                    for (var i = 0; i < filasPlan.length; i++) {
                        gpIndicadoresEjecucionPlanif.getSelectionModel().selectRows(filasPlan);
                    }
                }
                if (gpIndicadoresEjecucionPlanif.getSelectionModel().getSelected() == undefined) {
                    Ext.getCmp('idtp_planes').setActiveTab('idTpAdicion_plan');
                    pDesgIndicadoresEjecucionPlanif.disable();
                    pDesviacionIndicadoresEjecucionPlanif.disable();
                }
                if (st.getCount() == 0) {
                    mostrarMensaje(1, 'No existen datos que mostrar.');
                }
            }
        }
    });

    cmIndicadoresEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "C&oacute;digo",
            tooltip: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 150,
            sortable: true
        }, {
            header: "Denominaci&oacute;n",
            tooltip: 'Denominaci&oacute;n',
            dataIndex: 'denominacion',
            sortable: true,
            id: 'expandir'
        }, {
            header: "Unidad de medida",
            tooltip: 'Unidad de medida',
            dataIndex: 'umedida',
            width: 150,
            sortable: true
        }, {
            header: "Cantidad final",
            tooltip: 'Cantidad final',
            dataIndex: 'cantfinal',
            width: 150,
            sortable: true
        }, {
            header: "Real acumulado",
            tooltip: 'Real acumulado',
            dataIndex: 'cantreal',
            width: 150,
            sortable: true
        }, {
            header: "Pendiente",
            tooltip: 'Pendiente',
            dataIndex: 'pendiente',
            width: 150,
            sortable: true
        }
    ]);

    filtrosIndicadoresEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'idcbunidadmedida',
                urlcb: 'cargarunidadmedida',
                idstore: 'idtodasunidadesmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida'
            }, {
                type: 'numeric',
                dataIndex: 'cantfinal'
            }, {
                type: 'numeric',
                dataIndex: 'cantreal'
            }, {
                type: 'numeric',
                dataIndex: 'pendiente'
            }]
    });

    pgtIndicadoresEjecucionPlanif = new Ext.PagingToolbar({
        store: stIndicadoresEjecucionPlanif,
        displayInfo: true,
        items: ['-', {
                xtype: 'button',
                iconCls: 'limpiar',
                tooltip: 'Limpiar',
                handler: function() {
                    filtrosIndicadoresEjecucionPlanif.clearFilters();
                }
            }],
        listeners: {
            beforechange: function(p, e) {
                offsetInd = e.start;
            }
        }
    });


    gpIndicadoresEjecucionPlanif = new Ext.grid.GridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        plugins: filtrosIndicadoresEjecucionPlanif,
        enableKeyEvents: true,
        autoExpandColumn: 'expandir',
        store: stIndicadoresEjecucionPlanif,
        sm: smIndicadoresEjecucionPlanif,
        cm: cmIndicadoresEjecucionPlanif,
        region: 'center',
        loadMask: {
            store: stIndicadoresEjecucionPlanif
        },
        bbar: pgtIndicadoresEjecucionPlanif
    });

    smDesgIndicadoresEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
                btnEliminarDesg.enable();
            }, rowdeselect: function() {
                btnEliminarDesg.disable();
            }
        }
    });

    stDesgIndicadoresEjecucionPlanif = new Ext.data.Store({
        url: 'listarEjecucionPlan',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idcontrolejecucionplan'
            }, {
                name: 'cantidadreal'
            }, {
                name: 'fechareal'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                if (gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections().length != 0) {
                    btnAdicionarDesg.enable();
                } else {
                    btnAdicionarDesg.disable();
                }
                btnGuardarDesg.disable();
                btnEliminarDesg.disable();
                if (Ext.getCmp('chkglobalCEP').getValue() == false) {
                    st.baseParams.idplanif = smIndicadoresEjecucionPlanif.getSelected().data.idplanificacion;
                    st.baseParams.start = offsetIndEjec;
                }
            }
        }
    });

    dtGeneral = new Ext.form.DateField({
        format: 'd/m/Y',
        anchor: '95%',
        allowBlank: false,
        value: new Date(),
        listeners: {
            change: function() {
                console.log('df');
            }
        }
    });


    cmDesgIndicadoresEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "Cantidad",
            tooltip: 'Cantidad',
            dataIndex: 'cantidadreal',
            width: 300,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFieldDesgPlan',
                listeners: {
                    change: function(nm, newV, oldV) {
                        if ((newV != "" && newV != oldV)) {
                            Ext.getCmp('idbtnGuardarDesg').enable();
                        }
                    }
                }
            })
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            dataIndex: 'fechareal',
            width: 300,
            sortable: true,
            renderer: formatDate,
            editor: dtGeneral
        }
    ]);

    filtrosDesgIndicadoresEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'cantidadreal'
            }, {
                type: 'date',
                dataIndex: 'fechareal'
            }]
    });


    btnAdicionarDesg = new Ext.Button({
        tooltip: 'Adicionar Real por fecha',
        id: 'idbtnAdicionarDesg',
        iconCls: 'adicionar',
        disabled: true,
        handler: function() {
            adicionarFilaRealPorFecha();
        }
    });

    btnGuardarDesg = new Ext.Button({
        tooltip: 'Guardar Real por fecha',
        id: 'idbtnGuardarDesg',
        iconCls: 'guardar',
        disabled: true,
        handler: function() {
            guardarFilaRealPorFecha();
        }
    });

    btnEliminarDesg = new Ext.Button({
        tooltip: 'Eliminar Real por fecha',
        id: 'idbtnEliminarDesg',
        iconCls: 'eliminar',
        disabled: true,
        handler: function() {
            eliminarDesglosePlan();
        }
    });

    gpDesgIndicadoresEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disabled: false,
        clicksToEdit: 2,
        store: stDesgIndicadoresEjecucionPlanif,
        sm: smDesgIndicadoresEjecucionPlanif,
        cm: cmDesgIndicadoresEjecucionPlanif,
        plugins: filtrosDesgIndicadoresEjecucionPlanif,
        tbar: [btnAdicionarDesg, btnGuardarDesg, btnEliminarDesg],
        loadMask: {
            store: stDesgIndicadoresEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stDesgIndicadoresEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosDesgIndicadoresEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetIndEjec = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function(obj) {
                btnAdicionarDesg.enable();
                btnEliminarDesg.disable();
                var filasmodificadas = [];
                filasmodificadas = obj.grid.getStore().getModifiedRecords();
                for (var j = 0; j < filasmodificadas.length; j++) {
                    if (filasmodificadas[j].data.cantidadreal != '' || filasmodificadas[j].data.cantidadreal == 0) {
                        btnGuardarDesg.enable();
                        break;
                    }
                }
            }
        }
    });

    pDesgIndicadoresEjecucionPlanif = new Ext.Panel({
        title: 'Real por fecha ejecutado',
        layout: 'fit',
        disabled: true,
        id: 'idTpDesglose_plan',
        items: [gpDesgIndicadoresEjecucionPlanif]
    });

    btnAplicarDesvSustPlan = new Ext.Button({
        text: 'Aplicar',
        tooltip: 'Guardar datos y limpiar los campos',
        id: 'idbtnAplicarExtra',
        iconCls: 'aplicar',
        disabled: true,
        handler: function() {

        }
    });

    btnAceptarDesvSustPlan = new Ext.Button({
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana',
        id: 'idbtnAceptarExtra',
        iconCls: 'aceptar',
        disabled: true,
        handler: function() {
            if (adicion) {
                btnAdicionPlan.disable();
                adicionarAdicPlan(gpIndicadoresAddEjecucionPlanif.getSelectionModel().getSelections());
            } else {
                btnExtraPlan.disable();
                adicionarDesvPlan(gpIndicadoresAddEjecucionPlanif.getSelectionModel().getSelected());
            }


        }
    });

    btnCancelarDesvSustPlan = new Ext.Button({
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        id: 'idbtnCancelarExtra',
        iconCls: 'cancelar',
        disabled: false,
        handler: function() {
            wdesvExtraPlan.hide();
        }
    });

    smIndicadoresAddEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function() {
                btnAceptarDesvSustPlan.enable();
                btnAplicarDesvSustPlan.enable();
                btnAdicionPlan.enable();
            },
            rowdeselect: function() {
                btnAceptarDesvSustPlan.disable();
                btnAplicarDesvSustPlan.disable();
            }
        }
    });

    stIndicadoresAddEjecucionPlanif = new Ext.data.Store({
        url: 'listarIndAddDesviacion',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'umedida'
            }, {
                name: 'idindicador'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                st.baseParams.start = 0;

                indseleccionados = gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
                array_indicadoresplanif = [];
                indicadores_adicionados = [];

                for (var i = 0; i < indseleccionados.length; i++) {
                    array_indicadoresplanif[i] = indseleccionados[i].data.idindicador;
                }

                if (!adicion) {
                    if (indicadores_adicionados_desv.length != 0) {
                        indicadores_adicionados = indicadores_adicionados_desv.concat(array_indicadoresplanif);
                    } else {
                        indicadores_adicionados = array_indicadoresplanif;
                    }
                } else {
                    indicadores_adicionados = indicadores_adicionados_adic
                }
                st.baseParams.idindicadores = Ext.encode(indicadores_adicionados);
            },
            load: function(st, rec, opt) {
                if (st.getCount() == 0) {
                    mostrarMensaje(1, 'No existen datos que mostrar.');
                }
            }
        }
    });

    cmIndicadoresAddEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "C&oacute;digo",
            tooltip: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 150,
            sortable: true
        }, {
            header: "Denominaci&oacute;n",
            tooltip: 'Denominaci&oacute;n del plan',
            dataIndex: 'denominacion',
            sortable: true,
            id: 'expandir'
        }, {
            header: "Unidad de medida",
            tooltip: 'Unidad de medida',
            dataIndex: 'umedida',
            sortable: true
        }
    ]);

    filtrosIndicadoresAddEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'idcbunidadmedidaaaa',
                urlcb: 'cargarunidadmedida',
                idstore: 'idtodasunidadesmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadreal'
            }, {
                type: 'date',
                dataIndex: 'fechareal'
            }]
    });

    gpIndicadoresAddEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: 432,
        border: false,
        autoScroll: true,
        disabled: false,
        clicksToEdit: 2,
        enableKeyEvents: true,
        autoExpandColumn: 'expandir',
        plugins: filtrosIndicadoresAddEjecucionPlanif,
        store: stIndicadoresAddEjecucionPlanif,
        sm: smIndicadoresAddEjecucionPlanif,
        cm: cmIndicadoresAddEjecucionPlanif,
        loadMask: {
            store: stIndicadoresAddEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stIndicadoresAddEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosIndicadoresAddEjecucionPlanif.clearFilters();
                    }
                }]
        })
    });

    wdesvExtraPlan = new Ext.Window({
        title: 'Listado de indicadores',
        frame: true,
        width: 800,
        height: 500,
        constrain: true,
        resizable: false,
        modal: true,
        buttons: [btnCancelarDesvSustPlan, btnAplicarDesvSustPlan, btnAceptarDesvSustPlan],
        items: [gpIndicadoresAddEjecucionPlanif],
        listeners: {
            beforeshow: function() {
                btnAplicarDesvSustPlan.disable();
                btnAceptarDesvSustPlan.disable();
                stIndicadoresAddEjecucionPlanif.load();
                btnEliminarAdicion.disable();
                btnEliminarDesv.disable();
                if (adicion) {
                    gpIndicadoresAddEjecucionPlanif.getSelectionModel().singleSelect = false;
                } else {
                    gpIndicadoresAddEjecucionPlanif.getSelectionModel().singleSelect = true;
                }
            },
            beforehide: function() {
                btnAplicarDesvSustPlan.disable();
                btnAceptarDesvSustPlan.disable();
            }
        }
    });

    btnExtraPlan = new Ext.Button({
        tooltip: 'Adicionar Extra plan',
        id: 'idbtnExtra',
        iconCls: 'adicionar',
        disabled: true,
        handler: function() {
            adicion = false;
            wdesvExtraPlan.show();
        }
    });

    btnGuadarDesvPlan = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnGuardarDesv',
        iconCls: 'guardar',
        disabled: true,
        handler: function() {
            guadarDesvPlan();
        }
    });

    btnEliminarDesv = new Ext.Button({
        tooltip: 'Eliminar desviaci&oacute;n',
        id: 'idbtnEliminarDesv',
        iconCls: 'eliminar',
        disabled: true,
        handler: function() {
            eliminarDesvPlan();
        }
    });

    smDesvIndicadoresEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
                btnEliminarDesv.enable();
            },
            rowdeselect: function() {
                btnEliminarDesv.disbale();
            }
        }
    });

    stDesvIndicadoresEjecucionPlanif = new Ext.data.Store({
        url: 'listarDesvPlan',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idindicador'
            }, {
                name: 'cantidadreal'
            }, {
                name: 'fechareal'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'umedida'
            }, {
                name: 'iddesviacionnivelactividad'
            }, {
                name: 'iddesviacionplan'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                btnGuadarDesvPlan.disable();
                btnEliminarDesv.disable();
                indseleccionados = gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
                array_planif = [];
                array_planif_ordenado = [];
                for (var i = 0; i < indseleccionados.length; i++) {
                    array_planif[i] = indseleccionados[i].data.idplanificacion;
                }
                array_planif_ordenado = bubbleSort(array_planif);

                st.baseParams.idplanif = Ext.encode(array_planif_ordenado);
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.start = offsetIndDesv;
            },
            load: function(st, rec, opt) {
                indicadores_adicionados_desv = [];
                for (var i = 0; i < st.getCount(); i++) {
                    indicadores_adicionados_desv[i] = st.data.items[i].data.idindicador;
                }
                btnGuadarDesvPlan.disable();
            }
        }
    });

    dtDesvEjecPlan = new Ext.form.DateField({
        format: 'd/m/Y',
        id: 'iddtDesvEjecPlan',
        anchor: '95%',
        allowBlank: false,
        value: new Date().format('d/m/Y')
    });

    cmDesvIndicadoresEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "C&oacute;digo",
            tooltip: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 150,
            sortable: true
        }, {
            header: 'Denominaci&oacute;n',
            tooltip: 'Denominaci&oacute;n',
            dataIndex: 'denominacion',
            width: 300,
            sortable: true,
            id: 'expandir'
        }, {
            header: "Unidad de medida",
            tooltip: 'Unidad de medida',
            dataIndex: 'umedida',
            width: 150,
            sortable: true
        }, {
            header: "Cantidad",
            tooltip: 'Cantidad',
            dataIndex: 'cantidadreal',
            width: 150,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFieldDesvPlan',
                listeners: {
                    change: function(nm, newV, oldV) {
                        if ((newV != "" || newV != 0) && newV != oldV) {
                            btnGuadarDesvPlan.enable();
                        }
                    }
                }
            })
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            dataIndex: 'fechareal',
            width: 150,
            sortable: true,
            renderer: formatDate,
            editor: dtDesvEjecPlan
        }
    ]);

    filtrosDesvIndicadoresEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'idcbunidadmedidaaa',
                urlcb: 'cargarunidadmedida',
                idstore: 'idtodasunidadesmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadreal'
            }, {
                type: 'date',
                dataIndex: 'fechareal'
            }]
    });
    gpDesvIndicadoresEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disabled: false,
        clicksToEdit: 2,
        enableKeyEvents: true,
        autoExpandColumn: 'expandir',
        plugins: filtrosDesvIndicadoresEjecucionPlanif,
        store: stDesvIndicadoresEjecucionPlanif,
        sm: smDesvIndicadoresEjecucionPlanif,
        cm: cmDesvIndicadoresEjecucionPlanif,
        tbar: [btnExtraPlan, btnGuadarDesvPlan, btnEliminarDesv],
        loadMask: {
            store: stDesvIndicadoresEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stDesvIndicadoresEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosDesvIndicadoresEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetIndDesv = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function(obj) {
                btnExtraPlan.disable();
                btnEliminarDesv.disable();
                var filasmodificadas = [];
                filasmodificadas = obj.grid.getStore().getModifiedRecords();
                for (var j = 0; j < filasmodificadas.length; j++) {
                    if (filasmodificadas[j].data.cantidadreal != "" || filasmodificadas[j].data.cantidadreal == 0) {
                        btnGuadarDesvPlan.enable();
                        break;
                    }
                }
            }
        }
    });

    pDesviacionIndicadoresEjecucionPlanif = new Ext.Panel({
        title: 'Desviaci&oacute;n',
        layout: 'fit',
        disabled: true,
        id: 'idTpDesviacion_plan',
        items: [gpDesvIndicadoresEjecucionPlanif]
    });

    stAdicIndicadoresAddEjecucionPlanif = new Ext.data.Store({
        url: 'listarIndAddDesviacionAdicion',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'umedida'
            }, {
                name: 'idindicador'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                st.baseParams.start = 0;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.identidad = identidadselected;
                st.baseParams.idmodelo = cmbPlanes.getValue();
                st.baseParams.idmodelo = cmbPlanes.getValue();
                indicadores_adicionados_adicaux = [];
                if (ind_selecc_ventanaAdic.length != 0) {
                    indicadores_adicionados_adicaux = indicadores_adicionados_adic.concat(ind_selecc_ventanaAdic);
                    st.baseParams.idindicadores = Ext.encode(indicadores_adicionados_adicaux);
                } else {
                    st.baseParams.idindicadores = Ext.encode(indicadores_adicionados_adic);
                }
            }
        }
    });

    smAdicIndicadoresEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
                btnEliminarAdicion.enable();
            },
            rowdeselect: function() {
                btnEliminarAdicion.disable();
            }
        }
    });

    stAdicIndicadoresEjecucionPlanif = new Ext.data.Store({
        url: 'listarDesvAdicionesPlan',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idindicador'
            }, {
                name: 'cantidadreal'
            }, {
                name: 'fechareal'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'umedida'
            }, {
                name: 'iddesviacionplan'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                btnGuadarAdicionPlan.disable();
                btnEliminarAdicion.disable();
                st.baseParams.start = offsetIndAdic;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.identidad = identidadselected;
                st.baseParams.idmodelo = cmbPlanes.getValue();
            },
            load: function(st, rec, opt) {
                indicadores_adicionados_adic = [];
                for (var i = 0; i < st.getCount(); i++) {
                    indicadores_adicionados_adic[i] = st.data.items[i].data.idindicador;
                }
                if (st.getCount() == 0) {
                    tpPlanesRealDesv.collapse(true);
                } else {
                    tpPlanesRealDesv.expand();
                    tpPlanesRealDesv.enable();
                }
            }
        }
    });

    dtAdicEjecPlan = new Ext.form.DateField({
        format: 'd/m/Y',
        id: 'iddtAdicEjecPlan',
        anchor: '95%',
        allowBlank: false,
        value: new Date().format('d/m/Y')
    });

    cmAdicIndicadoresEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "C&oacute;digo",
            tooltip: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 150,
            sortable: true
        }, {
            header: 'Denominaci&oacute;n',
            tooltip: 'Denominaci&oacute;n',
            dataIndex: 'denominacion',
            width: 300,
            sortable: true,
            id: 'expandir'
        }, {
            header: "Unidad de medida",
            tooltip: 'Unidad de medida',
            dataIndex: 'umedida',
            width: 150,
            sortable: true
        }, {
            header: "Cantidad",
            tooltip: 'Cantidad',
            dataIndex: 'cantidadreal',
            width: 150,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFieldAdicPlan',
                listeners: {
                    change: function(nm, newV, oldV) {
                        if (newV != "" && newV != oldV) {
                            btnGuadarAdicionPlan.enable();
                        }
                    }
                }
            })
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            dataIndex: 'fechareal',
            width: 150,
            sortable: true,
            renderer: formatDate,
            editor: dtAdicEjecPlan
        }
    ]);

    filtrosAdicIndicadoresEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'idcbunidadmedidaa',
                urlcb: 'cargarunidadmedida',
                idstore: 'idtodasunidadesmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadreal'
            }, {
                type: 'date',
                dataIndex: 'fechareal'
            }]
    });

    btnAdicionPlan = new Ext.Button({
        tooltip: 'Adicionar Extra plan',
        id: 'idbtnExtraAdic',
        iconCls: 'adicionar',
        disabled: true,
        handler: function() {
            adicion = true;
            smIndicadoresEjecucionPlanif.clearSelections();
            pDesgIndicadoresEjecucionPlanif.disable();
            pDesviacionIndicadoresEjecucionPlanif.disable();
            wdesvExtraPlan.show();
        }
    });

    btnGuadarAdicionPlan = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnGuardarAdic',
        iconCls: 'guardar',
        disabled: true,
        handler: function() {
            guadarAdicPlan();
        }
    });

    btnEliminarAdicion = new Ext.Button({
        tooltip: 'Eliminar adici&oacute;n',
        id: 'idbtnEliminarAdic',
        iconCls: 'eliminar',
        disabled: true,
        handler: function() {
            eliminarAdicionPlan();
        }
    });


    gpAdicIndicadoresEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disabled: false,
        clicksToEdit: 2,
        enableKeyEvents: true,
        plugins: filtrosAdicIndicadoresEjecucionPlanif,
        autoExpandColumn: 'expandir',
        tbar: [btnAdicionPlan, btnGuadarAdicionPlan, btnEliminarAdicion],
        store: stAdicIndicadoresEjecucionPlanif,
        sm: smAdicIndicadoresEjecucionPlanif,
        cm: cmAdicIndicadoresEjecucionPlanif,
        loadMask: {
            store: stAdicIndicadoresEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stAdicIndicadoresEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosAdicIndicadoresEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetIndAdic = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function(obj) {
                btnAdicionPlan.disable();
                btnEliminarAdicion.disable();
                var filasmodificadas = [];
                filasmodificadas = obj.grid.getStore().getModifiedRecords();
                for (var j = 0; j < filasmodificadas.length; j++) {
                    if (filasmodificadas[j].data.cantidadreal != "" || filasmodificadas[j].data.cantidadreal == 0) {
                        btnGuadarAdicionPlan.enable();
                        break;
                    }
                }

            }
        }
    });

    pAdicionIndicadoresEjecucionPlanif = new Ext.Panel({
        title: 'Adici&oacute;n',
        layout: 'fit',
        disabled: false,
        id: 'idTpAdicion_plan',
        items: [gpAdicIndicadoresEjecucionPlanif]
    });


    tpPlanesRealDesv = new Ext.TabPanel({
        region: 'south',
        border: true,
        height: 400,
        activeTab: 2,
        collapsible: true,
        collapsed: true,
        id: 'idtp_planes',
        listeners: {
            tabchange: function(t, tabpanel) {
                if (tabpanel.id == 'idTpDesglose_plan') {
                    if (Ext.getCmp('chkglobalCEP').getValue() == false) {
                        stDesgIndicadoresEjecucionPlanif.load();
                    }
                    gpIndicadoresEjecucionPlanif.getSelectionModel().singleSelect = true;
                } else {
                    if (tabpanel.id == 'idTpDesviacion_plan' && Ext.getCmp('chkglobalCEP').getValue() == false) {
                        stDesvIndicadoresEjecucionPlanif.load();
                    }
                    if (tabpanel.id == 'idTpAdicion_plan' && Ext.getCmp('chkglobalCEP').getValue() == false && identidadselected != null) {
                        stAdicIndicadoresEjecucionPlanif.load();
                    }
                    gpIndicadoresEjecucionPlanif.getSelectionModel().singleSelect = false;
                }
            }
        },
        items: [pDesgIndicadoresEjecucionPlanif, pDesviacionIndicadoresEjecucionPlanif, pAdicionIndicadoresEjecucionPlanif]
    });

    pGeneralPlanes = new Ext.Panel({
        id: 'idejecucion_plan',
        title: 'Plan',
        layout: 'border',
        items: [gpIndicadoresEjecucionPlanif, tpPlanesRealDesv],
        tbar: ['Planes:   ', cmbPlanes, '-', btnGraficoPlanif]
    });


//-------------- Actividades ---------------------------------


    smNivelesActividadesEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, rowIndex, rec) {

                if (tpActividadesRealDesv.getActiveTab().id == 'idTpDesviacion_actividades' && Ext.getCmp('chkglobalCEP').getValue() == false) {
                    stActividadesDesvEjecucionPlanif.load();
                } else if (tpActividadesRealDesv.getActiveTab().id == 'idTpDesglose_actividades' && Ext.getCmp('chkglobalCEP').getValue() == false) {
                    stActividadesRealPorFechaEjecucionPlanif.load();
                }

                if (Ext.getCmp('chkglobalCEP').getValue() == false) {
                    btnAdicionarDesgActv.enable();
                    btnAdicionarDesvActv.enable();
                    pDesgActividadesEjecucionPlanif.enable();
                    pDesvActividadesEjecucionPlanif.enable();

                } else {
                    pDesgActividadesEjecucionPlanif.disable();
                    pDesvActividadesEjecucionPlanif.disable();
                    stActividadesRealPorFechaEjecucionPlanif.removeAll();
                    stActividadesDesvEjecucionPlanif.removeAll();
                }
            },
            rowdeselect: function(x, y, w) {
                btnAdicionarDesgActv.disable();
                btnGuardarDesgActv.disable();
                btnAdicionarDesvActv.disable();
                btnGuardarDesvActv.disable();
                pDesgActividadesEjecucionPlanif.disable();
                pDesvActividadesEjecucionPlanif.disable();
            }
        }
    });
    cmNivelesActividadesEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "C&oacute;digo",
            tooltip: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 150,
            sortable: true
        }, {
            header: "Denominaci&oacute;n",
            tooltip: 'Denominaci&oacute;n',
            dataIndex: 'denominacion',
            width: 300,
            sortable: true,
            id: 'expandir'
        }, {
            header: "Nivel actividad final",
            tooltip: 'Nivel actividad final',
            dataIndex: 'nivelactividadfinal',
            width: 150,
            sortable: true
        }, {
            header: "Real acumulado",
            tooltip: 'Real acumulado',
            dataIndex: 'nivelactvreal',
            width: 150,
            sortable: true
        }, {
            header: "Pendiente",
            tooltip: 'Pendiente',
            dataIndex: 'pendiente',
            width: 150,
            sortable: true
        }
    ]);

    filtrosNivelesActividadesEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadfinal'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactvreal'
            }, {
                type: 'numeric',
                dataIndex: 'pendiente'
            }]
    });

    stNivelesActividadesEjecucionPlanif = new Ext.data.Store({
        url: 'listarNivelesAct',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'nivelactividadfinal'
            }, {
                name: 'nivelactvreal'
            }, {
                name: 'pendiente'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                st.baseParams.start = offsetAct;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.idEstructuraPadre = idEstructuraPadre;
                st.baseParams.esrector = esRector;
                st.baseParams.identidad = identidadselected;
                st.baseParams.glob = Ext.getCmp('chkglobalCEP').getValue();
            },
            load: function(st, rec, op) {
                if (Ext.getCmp('chkglobalCEP').getValue() == false && identidadselected != null) {
                    tpActividadesRealDesv.expand();
                    tpActividadesRealDesv.enable();
                    pAdicActividadesEjecucionPlanif.enable();
                }
                if (filasActv.length != 0) {
                    for (var i = 0; i < filasActv.length; i++) {
                        gpNivelesActividadesEjecucionPlanif.getSelectionModel().selectRows(filasActv);
                    }
                }
                if (gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelected() == undefined) {
                    pDesgActividadesEjecucionPlanif.disable();
                    pDesvActividadesEjecucionPlanif.disable();
                    Ext.getCmp('idtp_actividades').setActiveTab('idTpAdicion_actividades');
                }
                if (st.getCount() == 0) {
                    mostrarMensaje(1, 'No existen datos que mostrar.');
                }
            }
        }
    });

    gpNivelesActividadesEjecucionPlanif = new Ext.grid.GridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        plugins: filtrosNivelesActividadesEjecucionPlanif,
        enableKeyEvents: true,
        autoExpandColumn: 'expandir',
        store: stNivelesActividadesEjecucionPlanif,
        sm: smNivelesActividadesEjecucionPlanif,
        cm: cmNivelesActividadesEjecucionPlanif,
        region: 'center',
        loadMask: {
            store: stNivelesActividadesEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stNivelesActividadesEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosNivelesActividadesEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetAct = e.start;
                }
            }
        })
    });


    smActividadesRealPorFechaEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
                btnEliminarDesgActv.enable();
            },
            rowdeselect: function() {
                btnEliminarDesgActv.disable();
            }
        }
    });

    dtRealPorFechaEjecActv = new Ext.form.DateField({
        format: 'd/m/Y',
        id: 'iddtRealPorFechaEjecActv',
        anchor: '95%',
        allowBlank: false,
        value: new Date().format('d/m/Y')
    });


    cmActividadesRealPorFechaEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "Cantidad",
            tooltip: 'Cantidad',
            dataIndex: 'nivelactividadreal',
            width: 300,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowBlank: false
            })
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            dataIndex: 'fechareal',
            width: 300,
            sortable: true,
            renderer: formatDate,
            editor: dtRealPorFechaEjecActv
        }
    ]);

    filtrosActividadesRealPorFechaEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'nivelactividadreal'
            }, {
                type: 'date',
                dataIndex: 'fechareal'
            }]
    });

    stActividadesRealPorFechaEjecucionPlanif = new Ext.data.Store({
        url: 'listarEjecucionNiveles',
        auotLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idcontrolejecucionnivelactividad'
            }, {
                name: 'nivelactividadreal'
            }, {
                name: 'fechareal'
            }, {
                name: 'idactividadentidad'
            }
        ]),
        listeners: {
            beforeload: function(st) {
                st.baseParams.idactividad = gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelected().data.idactividad;
                st.baseParams.identidad = identidadselected;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.start = offsetActEjec;
                btnAdicionarDesgActv.enable();
                btnGuardarDesgActv.disable();
                btnEliminarDesgActv.disable();
            }
        }
    });

    btnAdicionarDesgActv = new Ext.Button({
        tooltip: 'Adicionar Extra plan',
        iconCls: 'adicionar',
        disabled: true,
        handler: function() {
            adicionarFilaDesgActv();
        }
    });

    btnGuardarDesgActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        iconCls: 'guardar',
        disabled: true,
        handler: function() {
            guardarFilaDesgActv();
        }
    });

    btnEliminarDesgActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnEliminarDesgAct',
        iconCls: 'eliminar',
        disabled: true,
        handler: function() {
            eliminarEjecActv();
        }
    });

    gpActividadesRealPorFechaEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        enableKeyEvents: true,
        store: stActividadesRealPorFechaEjecucionPlanif,
        sm: smActividadesRealPorFechaEjecucionPlanif,
        cm: cmActividadesRealPorFechaEjecucionPlanif,
        plugins: filtrosActividadesRealPorFechaEjecucionPlanif,
        region: 'center',
        tbar: [btnAdicionarDesgActv, btnGuardarDesgActv, btnEliminarDesgActv],
        loadMask: {
            store: stActividadesRealPorFechaEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stActividadesRealPorFechaEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosActividadesRealPorFechaEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetActEjec = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function(obj) {
                btnAdicionarDesgActv.enable();
                btnEliminarDesgActv.disable();
                var filasmodificadas = [];
                filasmodificadas = obj.grid.getStore().getModifiedRecords();
                for (var j = 0; j < filasmodificadas.length; j++) {
                    if (filasmodificadas[j].data.cantidadreal != '' || filasmodificadas[j].data.cantidadreal == 0) {
                        btnGuardarDesgActv.enable();
                        break;
                    }
                }
            }
        }
    });

    pDesgActividadesEjecucionPlanif = new Ext.Panel({
        title: 'Real por fecha ejecutado',
        layout: 'fit',
        disabled: true,
        id: 'idTpDesglose_actividades',
        items: [gpActividadesRealPorFechaEjecucionPlanif]
    });

    smActividadesDesvEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    dtDesvEjecActv = new Ext.form.DateField({
        format: 'd/m/Y',
        id: 'iddtRealPorFechaEjecActv',
        anchor: '95%',
        allowBlank: false,
        value: new Date().format('d/m/Y')
    });


    cmActividadesDesvEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "C&oacute;digo",
            tooltip: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 150,
            sortable: true
        }, {
            header: "Denominac&oacute;n",
            tooltip: 'Denominac&oacute;n',
            dataIndex: 'denominacion',
            width: 300,
            sortable: true,
            id: 'expandir'
        }, {
            header: "Cantidad",
            tooltip: 'Cantidad',
            dataIndex: 'nivelactividadrealxdesviacion',
            width: 150,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowBlank: false
            })
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            dataIndex: 'fechareal',
            width: 150,
            sortable: true,
            renderer: formatDate,
            editor: dtDesvEjecActv
        }
    ]);

    filtrosActividadesDesvEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadrealxdesviacion'
            }, {
                type: 'date',
                dataIndex: 'fechareal'
            }]
    });

    stActividadesDesvEjecucionPlanif = new Ext.data.Store({
        url: 'listarDesvNiveles',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'nivelactividadrealxdesviacion'
            }, {
                name: 'fechareal'
            }, {
                name: 'iddesviacionnivelactividad'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                btnAdicionarDesvActv.enable();
                btnGuardarDesvActv.disable();
                btnEliminarDesvActv.disable();
                st.baseParams.start = offsetActDesv;
                idactividades_aux = [];
                idactividades = [];
                seleccionadas = gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelections();

                for (var i = 0; i < seleccionadas.length; i++) {
                    idactividades_aux[i] = seleccionadas[i].data.idactividad;
                }
                idactividades = bubbleSort(idactividades_aux);
                st.baseParams.idactividades = Ext.encode(idactividades);
                st.baseParams.identidad = identidadselected;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
            },
            load: function(st, rec, opt) {
                actividades_adicionados_desv = [];
                for (var i = 0; i < st.getCount(); i++) {
                    actividades_adicionados_desv[i] = st.data.items[i].data.idactividad;
                }
            }
        }
    });


    btnAplicarDesvSustActividades = new Ext.Button({
        text: 'Aplicar',
        tooltip: 'Guardar datos y limpiar los campos',
        iconCls: 'aplicar',
        disabled: true,
        handler: function() {

        }
    });

    btnAceptarDesvSustActividades = new Ext.Button({
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana',
        iconCls: 'aceptar',
        disabled: true,
        handler: function() {
            if (adicionactv) {
                btnAdicionarAdicActv.disable();
                adicionarFilaAdicActv(gpActividadesAddEjecucionPlanif.getSelectionModel().getSelections());
                wdesvExtraActividades.hide();
            } else {
                btnAdicionarDesvActv.disable();
                wdesvExtraActividades.hide();
                adicionarFilaDesvActv(gpActividadesAddEjecucionPlanif.getSelectionModel().getSelected());
            }
        }
    });

    btnCancelarDesvSustActividades = new Ext.Button({
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        iconCls: 'cancelar',
        disabled: false,
        handler: function() {
            wdesvExtraActividades.hide();
        }
    });

    smActividadesAddEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function() {
                btnAceptarDesvSustActividades.enable();
                btnAplicarDesvSustActividades.enable();
            },
            rowdeselect: function() {
                btnAceptarDesvSustActividades.disable();
                btnAplicarDesvSustActividades.disable();
            }
        }
    });

    stActividadesAddEjecucionPlanif = new Ext.data.Store({
        url: 'listarActAddDesviacion',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idactividad'
            }, {
                name: 'idactespcomportamiento'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
                st.baseParams.start = 0;

                array_idactividades = [];
                array_idactividadesaux = [];
                elementos_selec = gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelections();

                for (var i = 0; i < elementos_selec.length; i++) {
                    array_idactividadesaux[i] = elementos_selec[i].data.idactividad;
                }

                if (!adicionactv) {
                    if (actividades_adicionados_desv.length != 0) {
                        array_idactividades = array_idactividadesaux.concat(actividades_adicionados_desv);
                    } else {
                        array_idactividades = array_idactividadesaux;
                    }
                } else {
                    array_idactividades = actv_inser_adicion;
                }

                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.identidad = identidadselected;
                st.baseParams.idactividades = Ext.encode(array_idactividades);
            },
            load: function(st, rec, opt) {
                if (st.getCount() == 0) {
                    mostrarMensaje(1, 'No existen datos que mostrar.');
                }
            }
        }
    });

    cmActividadesAddEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "C&oacute;digo",
            tooltip: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 150,
            sortable: true
        }, {
            header: "Denominaci&oacute;n",
            tooltip: 'Denominaci&oacute;n del plan',
            dataIndex: 'denominacion',
            sortable: true,
            id: 'expandir'
        }
    ]);

    filtrosActividadesAddEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });

    gpActividadesAddEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: 432,
        border: false,
        autoScroll: true,
        disabled: false,
        clicksToEdit: 2,
        enableKeyEvents: true,
        autoExpandColumn: 'expandir',
        store: stActividadesAddEjecucionPlanif,
        sm: smActividadesAddEjecucionPlanif,
        cm: cmActividadesAddEjecucionPlanif,
        plugins: filtrosActividadesAddEjecucionPlanif,
        loadMask: {
            store: stActividadesAddEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stActividadesAddEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosActividadesAddEjecucionPlanif.clearFilters();
                    }
                }]
        })
    });

    wdesvExtraActividades = new Ext.Window({
        title: 'Listado de actividades',
        frame: true,
        width: 800,
        height: 500,
        constrain: true,
        resizable: false,
        modal: true,
        buttons: [btnCancelarDesvSustActividades, btnAplicarDesvSustActividades, btnAceptarDesvSustActividades],
        items: [gpActividadesAddEjecucionPlanif],
        listeners: {
            beforeshow: function() {
                btnEliminarAdicActv.disable();
                btnEliminarDesvActv.disable();
                btnAplicarDesvSustActividades.disable();
                btnAceptarDesvSustActividades.disable();
                stActividadesAddEjecucionPlanif.load();
                if (adicionactv) {
                    gpActividadesAddEjecucionPlanif.getSelectionModel().singleSelect = false;
                } else {
                    gpActividadesAddEjecucionPlanif.getSelectionModel().singleSelect = true;
                }
            },
            beforehide: function() {
                btnAplicarDesvSustActividades.disable();
                btnAceptarDesvSustActividades.disable();
            }
        }
    });

    btnAdicionarDesvActv = new Ext.Button({
        tooltip: 'Adicionar Extra plan',
        id: 'idbtnExtraDesv',
        iconCls: 'adicionar',
        disabled: true,
        handler: function() {
            adicionactv = false;
            wdesvExtraActividades.show();
        }
    });

    btnGuardarDesvActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnGuardarDesv',
        iconCls: 'guardar',
        disabled: true,
        handler: function() {
            guardarFilaDesvActv();
        }
    });

    btnEliminarDesvActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnEliminarDesvAct',
        iconCls: 'eliminar',
        disabled: true,
        handler: function() {
            eliminarDesvActv();
        }
    });


    smActividadesDesvEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
                btnEliminarDesvActv.enable();
            },
            rowdeselect: function() {
                btnEliminarDesvActv.disable();
            }
        }
    });

    dtDesvEjecActv = new Ext.form.DateField({
        format: 'd/m/Y',
        id: 'iddtRealPorFechaEjecActv',
        anchor: '95%',
        allowBlank: false,
        value: new Date().format('d/m/Y')
    });

    gpActividadesDesvEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        enableKeyEvents: true,
        autoExpandColumn: 'expandir',
        store: stActividadesDesvEjecucionPlanif,
        sm: smActividadesDesvEjecucionPlanif,
        cm: cmActividadesDesvEjecucionPlanif,
        plugins: filtrosActividadesDesvEjecucionPlanif,
        region: 'center',
        tbar: [btnAdicionarDesvActv, btnGuardarDesvActv, btnEliminarDesvActv],
        loadMask: {
            store: stActividadesDesvEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stActividadesDesvEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosActividadesDesvEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetActDesv = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function(obj) {
                btnAdicionarDesvActv.disable();
                btnEliminarDesvActv.disable();
                var filasmodificadas = [];
                filasmodificadas = obj.grid.getStore().getModifiedRecords();
                for (var j = 0; j < filasmodificadas.length; j++) {
                    if (filasmodificadas[j].data.nivelactividadrealxdesviacion != '' || filasmodificadas[j].data.nivelactividadrealxdesviacion == 0) {
                        btnGuardarDesvActv.enable();
                        break;
                    }
                }

            }
        }
    });

    pDesvActividadesEjecucionPlanif = new Ext.Panel({
        title: 'Desviaci&oacute;n',
        layout: 'fit',
        disabled: true,
        id: 'idTpDesviacion_actividades',
        items: [gpActividadesDesvEjecucionPlanif]
    });

    //-------------------- Adicion en Actividades ----------------

    btnAdicionarAdicActv = new Ext.Button({
        tooltip: 'Adicionar Extra plan',
        id: 'idbtnExtraAdic',
        iconCls: 'adicionar',
        disabled: false,
        handler: function() {
            adicionactv = true;
            wdesvExtraActividades.show();
            gpNivelesActividadesEjecucionPlanif.getSelectionModel().clearSelections();
            pDesgActividadesEjecucionPlanif.disable();
            pDesvActividadesEjecucionPlanif.disable();
        }
    });

    btnGuardarAdicActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnGuardarAdic',
        iconCls: 'guardar',
        disabled: true,
        handler: function() {
            guardarFilaAdicActv();
        }
    });

    btnEliminarAdicActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnEliminarAdicAct',
        iconCls: 'eliminar',
        disabled: true,
        handler: function() {
            eliminarAdicActv();
        }
    });

    smActividadesAdicEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
                btnEliminarAdicActv.enable();
            },
            rowdeselect: function() {
                btnEliminarAdicActv.disable();
            }
        }
    });

    function formatDate(value) {
        if (Ext.isDate(value)) {
            return value.format('d/m/Y');
        } else {
            return value;
        }
    }
    ;

    dtAdicEjecActv = new Ext.form.DateField({
        anchor: '95%',
        allowBlank: false,
        format: 'd/m/Y',
        value: new Date()
    });

    cmActividadesAdicEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: "C&oacute;digo",
            tooltip: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 150,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowBlank: false
            })
        }, {
            header: "Denominac&oacute;n",
            tooltip: 'Denominac&oacute;n',
            dataIndex: 'denominacion',
            width: 300,
            sortable: true,
            id: 'expandir',
            editor: new Ext.form.NumberField({
                allowBlank: false
            })
        }, {
            header: "Cantidad",
            tooltip: 'Cantidad',
            dataIndex: 'nivelactividadrealxdesviacion',
            width: 150,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowBlank: false
            })
        }, {
            header: "Fecha",
            tooltip: 'Fecha',
            dataIndex: 'fechareal',
            width: 150,
            sortable: true,
            renderer: formatDate,
            editor: dtAdicEjecActv
        }
    ]);

    filtrosActividadesAdicEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadrealxdesviacion'
            }, {
                type: 'date',
                dataIndex: 'fechareal'
            }]
    });

    stActividadesAdicEjecucionPlanif = new Ext.data.Store({
        url: 'listarActDesviacionAdicion',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'nivelactividadrealxdesviacion'
            }, {
                name: 'fechareal'
            }, {
                name: 'iddesviacionnivelactividad'
            }
        ]),
        listeners: {
            load: function(st, rec, opt) {
                actv_inser_adicion = [];
                for (var i = 0; i < st.getCount(); i++) {
                    actv_inser_adicion[i] = st.data.items[i].data.idactividad;
                }
                if (st.getCount() == 0) {
                    tpActividadesRealDesv.collapse(true);
                } else {
                    tpActividadesRealDesv.expand();
                    tpActividadesRealDesv.enable();
                }
            },
            beforeload: function(st, op) {
                btnGuardarAdicActv.disable();
                btnEliminarAdicActv.disable();
                st.baseParams.start = offsetActAdic;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.identidad = identidadselected;
            }
        }
    });

    gpActividadesAdicEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        enableKeyEvents: true,
        autoExpandColumn: 'expandir',
        plugins: filtrosActividadesAdicEjecucionPlanif,
        store: stActividadesAdicEjecucionPlanif,
        sm: smActividadesAdicEjecucionPlanif,
        cm: cmActividadesAdicEjecucionPlanif,
        region: 'center',
        tbar: [btnAdicionarAdicActv, btnGuardarAdicActv, btnEliminarAdicActv],
        loadMask: {
            store: stActividadesAdicEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stActividadesAdicEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosActividadesAdicEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetActAdic = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function(obj) {
                btnAdicionarAdicActv.disable();
                btnEliminarAdicActv.disable();
                var filasmodificadas = [];
                filasmodificadas = obj.grid.getStore().getModifiedRecords();
                for (var j = 0; j < filasmodificadas.length; j++) {
                    if (filasmodificadas[j].data.nivelactividadrealxdesviacion != "" || filasmodificadas[j].data.nivelactividadrealxdesviacion == 0) {
                        btnGuardarAdicActv.enable();
                        break;
                    }
                }

            }
        }
    });

    pAdicActividadesEjecucionPlanif = new Ext.Panel({
        title: 'Adici&oacute;n',
        layout: 'fit',
        disabled: true,
        id: 'idTpAdicion_actividades',
        items: [gpActividadesAdicEjecucionPlanif]
    });


    tpActividadesRealDesv = new Ext.TabPanel({
        region: 'south',
        border: true,
        height: 400,
        activeTab: 2,
        collapsible: true,
        collapsed: true,
        id: 'idtp_actividades',
        listeners: {
            tabchange: function(t, tabpanel) {
                if (tabpanel.id == 'idTpDesglose_actividades') {
                    if (Ext.getCmp('chkglobalCEP').getValue() == false) {
                        stActividadesRealPorFechaEjecucionPlanif.load();
                    }
                    gpNivelesActividadesEjecucionPlanif.getSelectionModel().singleSelect = true;
                } else {
                    if (tabpanel.id == 'idTpDesviacion_actividades' && Ext.getCmp('chkglobalCEP').getValue() == false) {
                        stActividadesDesvEjecucionPlanif.load();
                    } else if (tabpanel.id == 'idTpAdicion_actividades' && Ext.getCmp('chkglobalCEP').getValue() == false) {
                        stActividadesAdicEjecucionPlanif.load();
                    }
                    gpNivelesActividadesEjecucionPlanif.getSelectionModel().singleSelect = false;
                }
            }
        },
        items: [pDesgActividadesEjecucionPlanif, pDesvActividadesEjecucionPlanif, pAdicActividadesEjecucionPlanif]
    });

    pGeneralActividades = new Ext.Panel({
        height: 802,
        id: 'idejecucion_actividades',
        title: 'Actividades',
        layout: 'border',
        items: [gpNivelesActividadesEjecucionPlanif, tpActividadesRealDesv],
        tbar: [btnGraficoPlanifNA]
    });

    //------------------- General ----------------------------
    tpEjecucion = new Ext.TabPanel({
        border: true,
        activeTab: 0,
        listeners: {
            tabchange: function(t, tabpanel) {
                if (tabpanel.id == 'idejecucion_actividades') {
                    if (Ext.getCmp('chkglobalCEP').getValue() == false) {
                        if (identidadselected != null) {
                            stNivelesActividadesEjecucionPlanif.load();
                            stActividadesAdicEjecucionPlanif.load();
                            if (stActividadesAdicEjecucionPlanif.getCount() == 0) {
                                tpActividadesRealDesv.collapse(true);
                            } else {
                                tpActividadesRealDesv.expand();
                                tpActividadesRealDesv.enable();
                            }
                            pAdicActividadesEjecucionPlanif.enable();
                        }

                    } else {
                        tpActividadesRealDesv.collapse(true);
                        pDesgActividadesEjecucionPlanif.disable();
                        pDesvActividadesEjecucionPlanif.disable();
                        pAdicActividadesEjecucionPlanif.disable();
                    }
                } else if (tabpanel.id == 'idejecucion_plan') {
                    if (reloadTab) {
                        if (Ext.getCmp('chkglobalCEP').getValue() == false && identidadselected != null) {
                            stIndicadoresEjecucionPlanif.load();
                            stAdicIndicadoresEjecucionPlanif.load();
                            if (stAdicIndicadoresEjecucionPlanif.getCount() == 0) {
                                tpPlanesRealDesv.collapse(true);
                            } else {
                                tpPlanesRealDesv.expand();
                                tpPlanesRealDesv.enable();
                            }
                            pAdicionIndicadoresEjecucionPlanif.enable();
                        } else {
                            tpPlanesRealDesv.collapse(true);
                            pDesgIndicadoresEjecucionPlanif.disable();
                            pDesviacionIndicadoresEjecucionPlanif.disable();
                            pAdicionIndicadoresEjecucionPlanif.disable();
                        }
                    }
                    reloadTab = true;
                }
            }
        },
        items: [pGeneralPlanes, pGeneralActividades]
    });

    pGeneralAux = new Ext.Panel({
        layout: 'fit',
        region: 'center',
        border: false,
        items: [tpEjecucion]
    });


    pGeneral = new Ext.Panel({
        layout: 'border',
        border: false,
        tbar: ['Ejercicio:  ', cmbEjercicio, '-', {
                xtype: 'checkbox',
                boxLabel: 'Global',
                id: 'chkglobalCEP',
                listeners: {
                    check: function(ck, t) {
                        stPlanes.baseParams.identidad = identidadselected;
                        stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                        stPlanes.baseParams.glob = Ext.getCmp('chkglobalCEP').getValue();
                        stPlanes.load();
                    }
                }
            }, '->', btnAyudaControlEjecucionPlanif],
        items: [tpEntidades, pGeneralAux]
    });

    view = new Ext.Viewport({
        layout: 'fit',
        items: [pGeneral]
    });
}


//---------------------------FUNCIONES DE PLANES----------------------------------------
function adicionarFilaRealPorFecha() {
    dtGeneral.setValue(new Date().format('d/m/Y'));
    var record = new Ext.data.Record({
        cantidadreal: '',
        fechareal: dtGeneral.getValue().format('d/m/Y')
    });
    stDesgIndicadoresEjecucionPlanif.add(record);
}

function guardarFilaRealPorFecha() {
    filasmodificadas = [];
    filasmodificadas = gpDesgIndicadoresEjecucionPlanif.getStore().getModifiedRecords();
    campos_nulos = false;

    indseleccionados = gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
    keys_st = stIndicadoresEjecucionPlanif.data.keys;
    filasPlan = [];
    var cont = 0;
    for (var i = 0; i < indseleccionados.length; i++) {
        for (var j = 0; j < keys_st.length; j++) {
            if (indseleccionados[i].id == keys_st[j]) {
                filasPlan[cont] = j;
                cont++;
            }
        }
    }

    var campos_modificados = [];
    for (var i = 0; i < filasmodificadas.length; i++) {
        if (filasmodificadas[i].data.idcontrolejecucionplan != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d/m/Y'),
                    idcontrolejecucionplan: filasmodificadas[i].data.idcontrolejecucionplan
                })

            } else {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    idcontrolejecucionplan: filasmodificadas[i].data.idcontrolejecucionplan
                })
            }
        } else {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d/m/Y')
                })
            } else {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal
                })
            }
        }
    }

    Ext.Ajax.request({
        url: 'insertarEjecPlan',
        params: {
            idplanificacion: idplanificacionactual,
            ejec: Ext.encode(campos_modificados)
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {
                if (campos_modificados.length > 1) {
                    mostrarMensaje(1, 'Los desgloses han sido adicionados correctamente.');
                } else {
                    mostrarMensaje(1, 'El desglose ha sido adicionado correctamente.');
                }
                stDesgIndicadoresEjecucionPlanif.rejectChanges();
                stDesgIndicadoresEjecucionPlanif.reload({
                    params: {
                        idplanif: idplanificacionactual,
                        start: 0
                    }
                });
                Ext.getCmp('idbtnAdicionarDesg').enable();
                Ext.getCmp('idbtnGuardarDesg').disable();
                btnEliminarDesg.disable();
                stIndicadoresEjecucionPlanif.reload();
            }
        }
    });


}

function adicionarDesvPlan(codind) {
    dtDesvEjecPlan.setValue(new Date().format('d/m/Y'));
    var record = new Ext.data.Record({
        cantidadreal: '',
        codigo: codind.data.codigo,
        denominacion: codind.data.denominacion,
        umedida: codind.data.umedida,
        fechareal: dtDesvEjecPlan.getValue().format('d/m/Y'),
        idindicador: codind.data.idindicador
    });
    wdesvExtraPlan.hide();
    stDesvIndicadoresEjecucionPlanif.add(record);
}

function guadarDesvPlan() {
    indseleccionados = gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
    keys_st = stIndicadoresEjecucionPlanif.data.keys;
    array_planif = [];
    array_planif_ordenadomenor_mayor = [];
    filasPlan = [];
    var cont = 0;
    for (var i = 0; i < indseleccionados.length; i++) {
        array_planif[i] = indseleccionados[i].data.idplanificacion;
        for (var j = 0; j < keys_st.length; j++) {
            if (indseleccionados[i].id == keys_st[j]) {
                filasPlan[cont] = j;
                cont++;
            }
        }
    }


    filasmodificadas = [];
    filasmodificadas = gpDesvIndicadoresEjecucionPlanif.getStore().getModifiedRecords();

    array_planif_ordenadomenor_mayor = bubbleSort(array_planif);

    var campos_modificados = [];
    for (var i = 0; i < filasmodificadas.length; i++) {
        if (filasmodificadas[i].data.iddesviacionplan != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    iddesviacionplan: filasmodificadas[i].data.iddesviacionplan,
                    idindicador: filasmodificadas[0].data.idindicador
                })
            } else {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    iddesviacionplan: filasmodificadas[i].data.iddesviacionplan,
                    idindicador: filasmodificadas[0].data.idindicador
                })
            }
        } else {


            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    idindicador: filasmodificadas[0].data.idindicador,
                    idplanificacion: array_planif_ordenadomenor_mayor
                })
            } else {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    idindicador: filasmodificadas[0].data.idindicador,
                    idplanificacion: array_planif_ordenadomenor_mayor
                })
            }


        }
    }

    Ext.Ajax.request({
        url: 'insertarDesvPlan',
        params: {
            ejec: Ext.encode(campos_modificados),
            idejercicio: cmbEjercicio.getValue(),
            identidad: identidadselected,
            idmodelo: cmbPlanes.getValue()
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {

                mostrarMensaje(1, 'La desviaci&oacute;n ha sido adicionada correctamente.');

                stDesvIndicadoresEjecucionPlanif.rejectChanges();
                stDesvIndicadoresEjecucionPlanif.reload();
                stIndicadoresEjecucionPlanif.reload();
                btnExtraPlan.enable();
                btnGuadarDesvPlan.disable();
            }
        }
    });
}

function adicionarAdicPlan(codind) {
    dtDesvEjecPlan.setValue(new Date().format('d/m/Y'));

    if (codind.length > 1) {
        for (var i = 0; i < codind.length; i++) {
            var record = new Ext.data.Record({
                cantidadreal: '',
                codigo: codind[i].data.codigo,
                denominacion: codind[i].data.denominacion,
                umedida: codind[i].data.umedida,
                fechareal: dtDesvEjecPlan.getValue().format('d/m/Y'),
                idindicador: codind[i].data.idindicador
            });
            wdesvExtraPlan.hide();
            stAdicIndicadoresEjecucionPlanif.add(record);
        }

    } else {
        var record = new Ext.data.Record({
            cantidadreal: '',
            codigo: codind[0].data.codigo,
            denominacion: codind[0].data.denominacion,
            umedida: codind[0].data.umedida,
            fechareal: dtDesvEjecPlan.getValue().format('d/m/Y'),
            idindicador: codind[0].data.idindicador
        });
        stAdicIndicadoresEjecucionPlanif.add(record);
    }
    wdesvExtraPlan.hide();

}

function guadarAdicPlan() {
    indseleccionados = gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
    array_planif = [];
    filasmodificadas = [];
    filasmodificadas = gpAdicIndicadoresEjecucionPlanif.getStore().getModifiedRecords();

    campos_modificados = [];
    for (var i = 0; i < filasmodificadas.length; i++) {
        if (filasmodificadas[i].data.iddesviacionplan != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    iddesviacionplan: filasmodificadas[i].data.iddesviacionplan,
                    idindicador: filasmodificadas[i].data.idindicador
                })
            } else {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    iddesviacionplan: filasmodificadas[i].data.iddesviacionplan,
                    idindicador: filasmodificadas[i].data.idindicador
                })
            }
        } else {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    idindicador: filasmodificadas[i].data.idindicador
                })
            } else {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    idindicador: filasmodificadas[i].data.idindicador
                })
            }
        }
    }

    Ext.Ajax.request({
        url: 'insertarDesvPlan',
        params: {
            idejercicio: cmbEjercicio.getValue(),
            identidad: identidadselected,
            idmodelo: cmbPlanes.getValue(),
            ejec: Ext.encode(campos_modificados),
            adicion: 1
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {
                if (campos_modificados.length > 1) {
                    mostrarMensaje(1, 'Los indicadores han sido adicionados correctamente.');
                } else {
                    mostrarMensaje(1, 'El indicador ha sido adicionado correctamente.');
                }
                stAdicIndicadoresEjecucionPlanif.rejectChanges();
                stAdicIndicadoresEjecucionPlanif.load();
                btnGuadarAdicionPlan.disable();
                btnEliminarDesg.disable();
                btnAdicionPlan.enable();
            }
        }
    });
}


function eliminarDesglosePlan() {

    var elementos_eliminar = [];
    var elementos_sel = smDesgIndicadoresEjecucionPlanif.getSelections();
    for (var i = 0; i < elementos_sel.length; i++) {
        elementos_eliminar[i] = elementos_sel[i].data.idcontrolejecucionplan;
    }

    if (elementos_sel.length == 1) {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar el desglose seleccionado?", accionEliminar);
    } else {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar los desgloses seleccionados?", accionEliminar);
    }

    function accionEliminar(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'insertarEjecPlan',
                params: {
                    eliminar: Ext.encode(elementos_eliminar)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Los desgloses han sido eliminados satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'El desglose ha sido eliminado satisfactoriamente.');
                        }
                        stDesgIndicadoresEjecucionPlanif.load();
                        stIndicadoresEjecucionPlanif.reload();
                        btnEliminarDesg.disable();
                    }
                }
            });
        }
    }

}

function eliminarDesvPlan() {

    var elementos_eliminar = [];
    var elementos_sel = smDesvIndicadoresEjecucionPlanif.getSelections();
    for (var i = 0; i < elementos_sel.length; i++) {
        elementos_eliminar[i] = elementos_sel[i].data.iddesviacionplan;
    }

    if (elementos_sel.length == 1) {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar la desviaci&oacute;n seleccionada?", accionEliminar);
    } else {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar las desviaciones seleccionadas?", accionEliminar);
    }

    function accionEliminar(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'insertarDesvPlan',
                params: {
                    eliminar: Ext.encode(elementos_eliminar)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Las desviaciones han sido eliminadas satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'La desviaci&oacute;n ha sido eliminada satisfactoriamente.');
                        }
                        stDesvIndicadoresEjecucionPlanif.load();
                        stIndicadoresEjecucionPlanif.reload();
                        btnEliminarDesv.disable();
                    }
                }
            });
        }
    }
}

function eliminarAdicionPlan() {

    var elementos_eliminar = [];
    var elementos_sel = smAdicIndicadoresEjecucionPlanif.getSelections();
    for (var i = 0; i < elementos_sel.length; i++) {
        elementos_eliminar[i] = elementos_sel[i].data.iddesviacionplan;
    }

    if (elementos_sel.length == 1) {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar el indicador seleccionado?", accionEliminar);
    } else {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar los indicadores seleccionados?", accionEliminar);
    }

    function accionEliminar(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'insertarDesvPlan',
                params: {
                    eliminar: Ext.encode(elementos_eliminar)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Los indicadores han sido eliminados satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'El indicador ha sido eliminado satisfactoriamente.');
                        }
                        stAdicIndicadoresEjecucionPlanif.load();
                        stIndicadoresEjecucionPlanif.reload();
                        btnEliminarAdicion.disable();
                    }
                }
            });
        }
    }
}

//-----------------------------------------------------------------------------------------------

//---------------------------FUNCIONES DE ACTVIDADES----------------------------------------

function adicionarFilaDesvActv(seleccion) {
    dtGeneral.setValue(new Date().format('d/m/Y'));
    var record = new Ext.data.Record({
        nivelactividadrealxdesviacion: '',
        idactividad: seleccion.data.idactividad,
        codigo: seleccion.data.codigo,
        denominacion: seleccion.data.denominacion,
        fechareal: dtGeneral.getValue().format('d/m/Y')
    });
    stActividadesDesvEjecucionPlanif.add(record);
}

function guardarFilaDesvActv() {
    filasmodificadas = [];
    filasmodificadas = gpActividadesDesvEjecucionPlanif.getStore().getModifiedRecords();
    actv_seleccionadas = [];
    keys_stActv = stNivelesActividadesEjecucionPlanif.data.keys;
    filasActv = [];
    var cont = 0;
    seleccionadas = gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelections();
    for (var i = 0; i < seleccionadas.length; i++) {
        actv_seleccionadas[i] = seleccionadas[i].data.idactividad;
        for (var j = 0; j < keys_stActv.length; j++) {
            if (seleccionadas[i].id == keys_stActv[j]) {
                filasActv[cont] = j;
                cont++;
            }
        }
    }

    actv_seleccionadas_ord = [];
    actv_seleccionadas_ord = bubbleSort(actv_seleccionadas);

    var campos_modificados = [];
    for (var i = 0; i < filasmodificadas.length; i++) {
        if (filasmodificadas[i].data.iddesviacionnivelactividad != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    iddesviacionnivelactividad: filasmodificadas[i].data.iddesviacionnivelactividad
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal,
                    iddesviacionnivelactividad: filasmodificadas[i].data.iddesviacionnivelactividad
                })
            }
        } else {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    idactividad: filasmodificadas[i].data.idactividad,
                    idactividadessust: actv_seleccionadas_ord
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal,
                    idactividad: filasmodificadas[i].data.idactividad,
                    idactividadessust: actv_seleccionadas_ord
                })
            }
        }
    }

    Ext.Ajax.request({
        url: 'insertarDesvNiv',
        params: {
            identidad: identidadselected,
            idejercicio: cmbEjercicio.getValue(),
            ejec: Ext.encode(campos_modificados)
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {
                mostrarMensaje(1, 'La desviaci&oacute;n ha sido adicionada correctamente.');

                stActividadesDesvEjecucionPlanif.rejectChanges();
                stActividadesDesvEjecucionPlanif.reload();
                stNivelesActividadesEjecucionPlanif.reload();
                btnGuardarDesvActv.disable();
                btnAdicionarDesvActv.enable();
            }
        }
    });

}

function adicionarFilaAdicActv(seleccion) {
    dtAdicEjecActv.setValue(new Date().format('d/m/Y'));
    if (seleccion.length > 1) {
        for (var i = 0; i < seleccion.length; i++) {
            var record = new Ext.data.Record({
                nivelactividadrealxdesviacion: '',
                idactividad: seleccion[i].data.idactividad,
                codigo: seleccion[i].data.codigo,
                denominacion: seleccion[i].data.denominacion,
                fechareal: dtAdicEjecActv.getValue(),
                idactespcomportamiento: seleccion[i].data.idactespcomportamiento
            });
            stActividadesAdicEjecucionPlanif.add(record);
        }
    } else {
        var record = new Ext.data.Record({
            nivelactividadrealxdesviacion: '',
            idactividad: seleccion[0].data.idactividad,
            codigo: seleccion[0].data.codigo,
            denominacion: seleccion[0].data.denominacion,
            fechareal: dtAdicEjecActv.getValue()
        });
        stActividadesAdicEjecucionPlanif.add(record);
    }
}

function guardarFilaAdicActv() {
    filasmodificadas = [];
    filasmodificadas = gpActividadesAdicEjecucionPlanif.getStore().getModifiedRecords();

    var campos_modificados = [];
    for (var i = 0; i < filasmodificadas.length; i++) {
        if (filasmodificadas[i].data.iddesviacionnivelactividad != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal.format('d/m/Y'),
                    iddesviacionnivelactividad: filasmodificadas[i].data.iddesviacionnivelactividad
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal,
                    iddesviacionnivelactividad: filasmodificadas[i].data.iddesviacionnivelactividad
                })
            }
        } else {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal.format('d/m/Y'),
                    idactividad: filasmodificadas[i].data.idactividad,
                    idactespcomportamiento: filasmodificadas[i].data.idactespcomportamiento,
                    adicion: 1
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal,
                    idactividad: filasmodificadas[i].data.idactividad,
                    idactespcomportamiento: filasmodificadas[i].data.idactespcomportamiento,
                    adicion: 1
                })
            }
        }
    }

    Ext.Ajax.request({
        url: 'insertarDesvNiv',
        params: {
            identidad: identidadselected,
            idejercicio: cmbEjercicio.getValue(),
            ejec: Ext.encode(campos_modificados)
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {
                if (campos_modificados.length > 1) {
                    mostrarMensaje(1, 'Los indicadores han sido adicionados correctamente.');
                } else {
                    mostrarMensaje(1, 'El indicador ha sido adicionado correctamente.');
                }
                stActividadesAdicEjecucionPlanif.rejectChanges();
                stActividadesAdicEjecucionPlanif.reload();
                btnGuardarAdicActv.disable();
                btnAdicionarAdicActv.enable();

            }
        }

    });
}

function adicionarFilaDesgActv() {
    dtGeneral.setValue(new Date().format('d/m/Y'));
    var record = new Ext.data.Record({
        nivelactividadreal: '',
        fechareal: dtGeneral.getValue().format('d/m/Y')
    });
    stActividadesRealPorFechaEjecucionPlanif.add(record);
}

function guardarFilaDesgActv() {
    filasmodificadas = [];
    filasmodificadas = gpActividadesRealPorFechaEjecucionPlanif.getStore().getModifiedRecords();
    keys_stActv = stNivelesActividadesEjecucionPlanif.data.keys;
    filasActv = [];
    var cont = 0;
    seleccionadas = gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelections();
    for (var i = 0; i < seleccionadas.length; i++) {
        for (var j = 0; j < keys_stActv.length; j++) {
            if (seleccionadas[i].id == keys_stActv[j]) {
                filasActv[cont] = j;
                cont++;
            }
        }
    }
    var campos_modificados = [];
    for (var i = 0; i < filasmodificadas.length; i++) {

        if (filasmodificadas[i].data.idcontrolejecucionnivelactividad != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    idcontrolejecucionnivel: filasmodificadas[i].data.idcontrolejecucionnivelactividad
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    idcontrolejecucionnivel: filasmodificadas[i].data.idcontrolejecucionnivelactividad
                })
            }
        } else {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y')
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadreal,
                    fecha: filasmodificadas[i].data.fechareal
                })
            }
        }
    }

    Ext.Ajax.request({
        url: 'insertarEjecNiv',
        params: {
            idactividad: gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelected().data.idactividad,
            identidad: identidadselected,
            idejercicio: cmbEjercicio.getValue(),
            ejec: Ext.encode(campos_modificados)
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {
                if (campos_modificados.length > 1) {
                    mostrarMensaje(1, 'Los desgloses han sido adicionados correctamente.');
                } else {
                    mostrarMensaje(1, 'El desglose ha sido adicionado correctamente.');
                }
                btnGuardarDesgActv.disable();
                btnAdicionarDesgActv.enable();
                stActividadesRealPorFechaEjecucionPlanif.rejectChanges();
                stActividadesRealPorFechaEjecucionPlanif.reload();
                stNivelesActividadesEjecucionPlanif.reload();
            }
        }

    });
}


function eliminarAdicActv() {
    var elementos_eliminar = [];
    var elementos_sel = smActividadesAdicEjecucionPlanif.getSelections();
    for (var i = 0; i < elementos_sel.length; i++) {
        elementos_eliminar[i] = elementos_sel[i].data.iddesviacionnivelactividad;
    }
    if (elementos_sel.length == 1) {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar la actividad seleccionada?", accionEliminar);
    } else {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar las actividades seleccionadas?", accionEliminar);
    }

    function accionEliminar(btnPresionado) {
        if (btnPresionado == 'ok') {

            Ext.Ajax.request({
                url: 'insertarDesvNiv',
                params: {
                    eliminar: Ext.encode(elementos_eliminar)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Las actividades han sido eliminadas satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'La actividad ha sido eliminada satisfactoriamente.');
                        }
                        stActividadesAdicEjecucionPlanif.load();
                        stNivelesActividadesEjecucionPlanif.reload();
                        btnEliminarAdicActv.disable();
                    }
                }
            });
        }
    }

}

function eliminarDesvActv() {
    var elementos_eliminar = [];
    var elementos_sel = smActividadesDesvEjecucionPlanif.getSelections();
    for (var i = 0; i < elementos_sel.length; i++) {
        elementos_eliminar[i] = elementos_sel[i].data.iddesviacionnivelactividad;
    }

    if (elementos_sel.length == 1) {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar la desviaci&oacute;n seleccionada?", accionEliminar);
    } else {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar las desviaciones seleccionadas?", accionEliminar);
    }

    function accionEliminar(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'insertarDesvNiv',
                params: {
                    eliminar: Ext.encode(elementos_eliminar)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Las desviaciones han sido eliminadas satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'La desviaci&oacute;n ha sido eliminada satisfactoriamente.');
                        }
                        stActividadesDesvEjecucionPlanif.load();
                        stNivelesActividadesEjecucionPlanif.reload();
                        btnEliminarDesvActv.disable();
                    }
                }
            });
        }
    }

}

function eliminarEjecActv() {
    var elementos_eliminar = [];
    var elementos_sel = smActividadesRealPorFechaEjecucionPlanif.getSelections();
    for (var i = 0; i < elementos_sel.length; i++) {
        elementos_eliminar[i] = elementos_sel[i].data.idcontrolejecucionnivelactividad;
    }

    if (elementos_sel.length == 1) {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar el desglose seleccionado?", accionEliminar);
    } else {
        mostrarMensaje(2, "\xBFEst&aacute; seguro que quiere eliminar los desgloses seleccionados?", accionEliminar);
    }

    function accionEliminar(btnPresionado) {
        if (btnPresionado == 'ok') {

            Ext.Ajax.request({
                url: 'insertarEjecNiv',
                params: {
                    eliminar: Ext.encode(elementos_eliminar)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Las desviaciones han sido eliminadas satisfactoriamentev.');
                        } else {
                            mostrarMensaje(1, 'La desviaci&oacute;n ha sido eliminada satisfactoriamente.');
                        }
                        stActividadesRealPorFechaEjecucionPlanif.load();
                        stNivelesActividadesEjecucionPlanif.reload();
                        btnEliminarDesgActv.disable();
                    }
                }
            });
        }
    }


}
//--------------------------------------------------------------------------------------------
//---------------------- Ordenar de menor a mayor --------------------------------------------
function swap(myArr, indexOne, indexTwo) {
    var tmpVal = myArr[indexOne];
    myArr[indexOne] = myArr[indexTwo];
    myArr[indexTwo] = tmpVal;
    return myArr;
}

function bubbleSort(myArr) {
    var size = myArr.length;

    for (var pass = 1; pass < size; pass++) { // outer loop
        for (var left = 0; left < (size - pass); left++) { // inner loop
            var right = left + 1;
            if (myArr[left] > myArr[right]) {
                swap(myArr, left, right);
            }
        }
    }

    return myArr;
}

//----------------------------------- Hacer un Grid No Editable o Editable ----------------------------------

function GridNoEditable(colModel) {
    for (var i = 0; i < colModel.config.length; i++) {
        colModel.setEditable(i, false);
    }
}

function GridEditable(colModel) {
    for (var i = 0; i < colModel.config.length; i++) {
        colModel.setEditable(i, true);
    }
}


