/**
 * Created by madrid on 15/01/2016.
 */

var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controlejecuciondemanda', cargarInterfaz);
var _this = this;
var esHoja, idplanificacionactual, idcontrataciondemanda, idEstructuraPadre, iddesviacionplandemanda;
var adicion = false;
var adicionactv = false;
var esRector = false;
var numero = 0, contadorAdiciones = 0;
var filasPlan, fseleccionada = [], filasmodificadas = [], filascreadas = [];
indicadores_adicionados_adic = [];
var filasActv = [];
UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
    for (i in acciones_reportes) {
        if (acciones_reportes[i].abreviatura == 'rector') {
            esRector = true;
            break;
        } else {
            esRector = false;
        }
    }
})


function cargarInterfaz() {

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ii', // Adicionar real por fecha (ALt+I)
            alt: true,
            fn: function () {
                if (validarBtn(Ext.getCmp('idbtnAdicionarDesg'))) {
                    adicionarFilaRealPorFecha();
                }
            }
        },
        {
            key: 46, // Eliminar real por fecha
            fn: function () {
                if (validarBtn(Ext.getCmp('idbtnEliminarDesg'))) {
                    eliminarDesglosePlan();
                }


            }
        }
    ]);

    validarBtn = function (btn) {
        return btn.hidden == false && !btn.disabled
    };
//-------------------------- Para el tama�o ------------------------

    btnAyudaControlEjecucionPlanif = new Ext.Toolbar.Button({
        id: 'idbtnAyudaControlEjecucionPlanif',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.ttAyuda,
        text: perfil.etiquetas.btnTxAyuda
    });

    Ext.ns('Ext.ux.layout');
    Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
        // private
        monitorResize: true,
        // private
        isValidParent: function (c, target) {
            return c.getEl().dom.parentNode == this.innerCt.dom;
        },
        // private
        onLayout: function (ct, target) {
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

            // some rows can be percentages while others are fixed
            // so we need to make 2 passes

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

        /**
         * @property activeItem
         * @hide
         */
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
            load: function (t, n, e) {
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
        loadingText: perfil.etiquetas.msgLoadingText,
        allowBlank: false,
        listeners: {
            select: function () {
                stPlanes.baseParams.identidad = identidadselected;
                stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                stPlanes.baseParams.isLeaf = esHoja;
                filasPlan = [];
                fseleccionada = [];
                filasActv = [];

            }
        }
    });

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
            tpEjecucion.enable();
            tpPlanesRealDesv.enable();
            cmbEjercicio.enable();
            btnreportesPlan.enable();
            btngraficasPlan.enable();

            pDesgIndicadoresEjecucionPlanif.disable();
            // pDesviacionIndicadoresEjecucionPlanif.disable();
            pDesgActividadesEjecucionPlanif.disable();
            pDesvActividadesEjecucionPlanif.disable();

            btngraficasPlan.enable();
            btngraficasAct.enable();

            identidadselected = n.id;
            tpEntidades.getSelectionModel().select(n);
            idEstructuraPadre = n.attributes._parent;
            denomentidadselected = n.text;
            filasPlan = [];
            fseleccionada = [];
            filasActv = [];
            pAdicionIndicadoresEjecucionPlanif.enable();
            if (n.leaf == true) {
                if (tpEjecucion.getActiveTab().id == "idejecucion_actividades") {
                    stNivelesActividadesEjecucionPlanif.load();
                }
                tpPlanesRealDesv.expand();
                tpPlanesRealDesv.enable();
                Ext.getCmp('idtp_actividades').setActiveTab('idTpAdicion_actividades');
                Ext.getCmp('idtp_planes').setActiveTab('idTpAdicion_plan');
                pAdicActividadesEjecucionPlanif.enable();
                esHoja = 1;
                btnGuadarAdicionPlan.disable();
                btnAdicionPlan.enable();
                stPlanes.baseParams.identidad = identidadselected;
                stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                stPlanes.baseParams.isLeaf = esHoja;
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
                stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                stPlanes.baseParams.isLeaf = esHoja;
                stPlanes.load();
            }

        }else{
            cmbPlanes.disable();
            tpEjecucion.disable();
            tpPlanesRealDesv.disable();
            cmbEjercicio.disable();
            btnreportesPlan.disable();
            btngraficasPlan.disable();
            stCbejercicio.removeAll();
            cmbPlanes.clearValue();
            cmbPlanesTab2.clearValue();
             var storeIndicadoresEjecucionPlanif = gpIndicadoresEjecucionPlanif.getStore();
            storeIndicadoresEjecucionPlanif.removeAll();


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
            load: function (st, rec, obj) {
                if (st.getCount() != 0) {
                    cmbPlanes.setValue(st.data.items[0].data.idmodelo);
                    cmbPlanesTab2.setValue(st.data.items[0].data.idmodelo);
                    Ext.getCmp('idplanes').enable();

                    //stAdicIndicadoresEjecucionPlanif.load();
                    if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                        stIndicadoresEjecucionPlanif.reload();
                    tpPlanesRealDesv.expand();
                    tpPlanesRealDesv.enable();
                    pAdicionIndicadoresEjecucionPlanif.enable();


                } else {
                    tpPlanesRealDesv.collapse(true);
                    // pDesgIndicadoresEjecucionPlanif.disable();
                    //pDesviacionIndicadoresEjecucionPlanif.disable();
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
            select: function () {
                btnAdicionPlan.enable();
                btnGuadarAdicionPlan.disable();
                btnEliminarAdicion.disable();
                if (esHoja == 0) {
                    if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                        stIndicadoresEjecucionPlanif.load();
                } else {
                    //stAdicIndicadoresEjecucionPlanif.reload();
                    if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                        stIndicadoresEjecucionPlanif.load();
                }
                filasPlan = [];
                fseleccionada = [];
                filasActv = [];
            }
        },
        allowBlank: false
    });

    cmbPlanesTab2 = new Ext.form.ComboBox({
        width: 150,
        id: 'idplanestab2',
        store: stPlanes,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        listeners: {
            select: function () {
                //  idsmodelos = cmbPlanesTab2.getCheckedValue();
                btnAdicionPlan.enable();
                btnGuadarAdicionPlan.disable();
                btnEliminarAdicion.disable();
                if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                    stIndicadoresEjecucionPlanif.reload();

                filasPlan = [];
                fseleccionada = [];
                filasActv = [];
            }
        },
        allowBlank: false
    });
    //men� de acciones para gr�ficas del plan
    btngraficasPlan = new Ext.Toolbar.MenuButton({
        id: 'menugraficas',
        disabled: true,
        tooltip: "Gr\xE1ficas",
        iconCls: 'graficar',
        menu: {
            items: [{
                    id: 'btnVergrafica',
                    itemCls: 'x-menu-item icondistra-reportegrafico',
                    iconCls: 'imagen-none',
                    text: 'Ejecuci\xF3n global por entidad',
                    handler: function () {
                        crearGraficadinamica(1, 'plan');

                    }

                }/*, {
                 id: 'btnVergraficaD',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-verde',
                 iconCls: 'imagen-none',
                 text: 'Ejecuci\xF3n global por entidad y plan',
                 handler: function () {
                 crearGraficadinamica(2, 'plan');
                 }
                 
                 }, {
                 id: 'btnVergraficaT',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-amarillo',
                 iconCls: 'imagen-none',
                 text: 'Evoluci\xF3n de la ejecuci\xF3n por trimestre (Gastos)',
                 handler: function () {
                 crearGraficadinamica(3, 'plan');
                 
                 }
                 
                 }, {
                 id: 'btnVergraficaT1',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-amarillo',
                 iconCls: 'imagen-none',
                 text: 'Evoluci\xF3n de la ejecuci\xF3n por trimestre (Ingresos)',
                 handler: function () {
                 crearGraficadinamica(31, 'plan');
                 
                 }
                 
                 }, {
                 id: 'btnVergraficaC',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-naranja',
                 iconCls: 'imagen-none',
                 text: 'Evoluci\xF3n de la ejecuci\xF3n por mes (Gastos)',
                 handler: function () {
                 crearGraficadinamica(4, 'plan');
                 
                 }
                 
                 }, {
                 id: 'btnVergraficaC1',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-naranja',
                 iconCls: 'imagen-none',
                 text: 'Evoluci\xF3n de la ejecuci\xF3n por mes (Ingresos)',
                 handler: function () {
                 crearGraficadinamica(41, 'plan');
                 
                 }
                 
                 }, {
                 id: 'btnVergraficaCi',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-rojo',
                 iconCls: 'imagen-none',
                 text: 'Indicadores m\xE1s valiosos',
                 handler: function () {
                 crearGraficadinamica(5, 'plan');
                 
                 }
                 }
                 , {
                 id: 'btnVergraficaCi1',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-rojo',
                 iconCls: 'imagen-none',
                 text: 'Indicadores m\xE1s valiosos fuera del plan',
                 handler: function () {
                 crearGraficadinamica(51, 'plan');
                 
                 }
                 }
                 , {
                 id: 'btnVergraficaSe',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-negro',
                 iconCls: 'imagen-none',
                 text: 'Indicadores menos ejecutados',
                 handler: function () {
                 crearGraficadinamica(6, 'plan');
                 
                 }
                 }, {
                 id: 'btnVergraficaSe1',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-negro',
                 iconCls: 'imagen-none',
                 text: 'Indicadores m\xE1s ejecutados',
                 handler: function () {
                 crearGraficadinamica(61, 'plan');
                 
                 }
                 }
                 , {
                 id: 'btnVergraficaSi',
                 itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-rosado',
                 iconCls: 'imagen-none',
                 text: 'Ejecuci\xF3n por v\xEDas de adquisici\xF3n (Gastos)',
                 handler: function () {
                 crearGraficadinamica(7, 'plan');
                 
                 }
                 }*/
            ]
        }
    });
    //men� de acciones para los reportes
    btnreportesPlan = new Ext.Toolbar.MenuButton({
        id: 'menureportesplan',
        //  disabled: true,
        tooltip: "Reportes",
        iconCls: 'reportes',
        menu: {
            items: [{
                    id: 'btnVergrafica',
                    itemCls: 'x-menu-item icondistra-reportes',
                    iconCls: 'imagen-none',
                    text: 'Contratación y ejecucion de indicadores',
                    handler: function () {
                        numero = 1;
                        generarReporte();

                    }

                }, {
                    id: 'btnVergraficaD',
                    itemCls: 'x-menu-item icondistra-reportes  sisplanico-verde',
                    iconCls: 'imagen-none',
                    text: 'Resumen general por Centros de Balance',
                    handler: function () {
                        numero = 2;
                        generarReporte();
                    }

                }, {
                    id: 'btnVergraf',
                    itemCls: 'x-menu-item icondistra-reportes  sisplanico-amarillo',
                    iconCls: 'imagen-none',
                    text: 'Centros sin terminar la ejecución de su plan',
                    handler: function () {
                        numero = 3;
                        generarReporte();
                    }

                }
            ]
        }
    });

    smIndicadoresEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, rowIndex, rec) {
                if (tpPlanesRealDesv.getActiveTab().id == 'idTpDesviacion_plan') {
                    stDesvIndicadoresEjecucionPlanif.load();
                } else if (tpPlanesRealDesv.getActiveTab().id == 'idTpDesglose_plan') {
                    stDesgIndicadoresEjecucionPlanif.load();
                }

                idplanificacionactual = sm.getSelected().data.idplanificacion;
                idcontrataciondemanda = sm.getSelected().data.idcontrataciondemanda;
                Ext.getCmp('idbtnGuardarDesv').enable();
                //  if (esHoja == 1) {
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
                /* } else {
                 Ext.getCmp('idbtnAdicionarDesg').disable();
                 Ext.getCmp('idbtnGuardarDesg').disable();
                 btnExtraPlan.disable();
                 GridNoEditable(gpDesgIndicadoresEjecucionPlanif.getColumnModel());
                 GridNoEditable(gpDesvIndicadoresEjecucionPlanif.getColumnModel());
                 GridNoEditable(gpAdicIndicadoresEjecucionPlanif.getColumnModel());
                 tpPlanesRealDesv.collapse(true);
                 pDesgIndicadoresEjecucionPlanif.disable();
                 //pDesviacionIndicadoresEjecucionPlanif.disable();
                 pAdicionIndicadoresEjecucionPlanif.disable();
                 stDesgIndicadoresEjecucionPlanif.removeAll();
                 stDesvIndicadoresEjecucionPlanif.removeAll();
                 }*/
            },
            rowdeselect: function (sm, rowIndex, record) {
                idplanificacionactual = '';
                idcontrataciondemanda = '';
                Ext.getCmp('idbtnAdicionarDesg').disable();
                Ext.getCmp('idbtnGuardarDesg').disable();
                Ext.getCmp('idbtnGuardarDesv').disable();
                btnExtraPlan.disable();
                stDesgIndicadoresEjecucionPlanif.removeAll();
                stDesvIndicadoresEjecucionPlanif.removeAll();

                //  pDesgIndicadoresEjecucionPlanif.disable();
                //pDesviacionIndicadoresEjecucionPlanif.disable();
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
            }, /*{
             name: 'denomvia'
             },*/ {
                name: 'cantfinal'
            }, {
                name: 'idplanificacion'
            }, {
                name: 'cantreal'
            }, {
                name: 'pendiente'
            }, {
                name: 'precio'
            }, {
                name: 'importe'
            }, {
                name: 'cantcontratada'
            }, {
                name: 'preciocontratado'
            }, {
                name: 'importecontratado'
            }, {
                name: 'pcontratado'
            }, {
                name: 'pejecutado'
            }, {
                name: 'idcontrataciondemanda'
            }, {
                name: 'iddesviacionplandemanda'
            }, {
                name: 'sustituidos'
            }, {
                name: 'idcontrolejecdesviacion'
            }, {
                name: 'indsustituido'
            }
        ]),
        listeners: {
            beforeload: function (st, op) {
                if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined) {
                }
                st.baseParams.idmodelo = cmbPlanes.getValue();
                st.baseParams.start = 0;
                st.baseParams.limit = 20;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.identidad = identidadselected;
                st.baseParams.esHoja = esHoja;
                if (tpEjecucion.getActiveTab().id == 'idejecucion_plan')
                    st.baseParams.codigo = 1;
                else if (tpEjecucion.getActiveTab().id == 'idTpAdicion_plan')
                    st.baseParams.codigo = 2;
                else
                    st.baseParams.codigo = 3;
            },
            load: function (st, rec, op) {

                if (gpIndicadoresEjecucionPlanif.getSelectionModel().getSelected() == undefined && gpDesvIndicadoresEjecucionPlanif.getSelectionModel().getSelected() == undefined && gpAdicIndicadoresEjecucionPlanif.getSelectionModel().getSelected() == undefined) {
                    // Ext.getCmp('idtp_planes').setActiveTab('idTpAdicion_plan');

                    pDesgActividadesEjecucionPlanif.disable();
                    //pDesviacionIndicadoresEjecucionPlanif.disable();
                } else {
                    pDesgActividadesEjecucionPlanif.enable();
                }

                if (filasPlan.length != 0) {
                    for (var i = 0; i < filasPlan.length; i++) {
                        if (tpEjecucion.getActiveTab().id == 'idejecucion_plan')
                            gpIndicadoresEjecucionPlanif.getSelectionModel().selectRows(filasPlan);
                        else if (tpEjecucion.getActiveTab().id == 'idTpAdicion_plan')
                            gpAdicIndicadoresEjecucionPlanif.getSelectionModel().selectRows(filasPlan);
                    }
                }
                if (fseleccionada.length != 0) {
                    for (var i = 0; i < fseleccionada.length; i++) {
                        gpAdicIndicadoresEjecucionPlanif.getSelectionModel().selectRows(fseleccionada);
                    }
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
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Denominaci&oacute;n",
            tooltip: 'Denominaci&oacute;n',
            dataIndex: 'denominacion',
            sortable: true,
            renderer: crearToolTipdenomSust,
            id: 'expandir'
        }, /*{
         header: "V&iacute;a",
         tooltip: 'Vía de adquisición',
         dataIndex: 'denomvia',
         width: 100,
         sortable: true,
         renderer: crearToolTip
         },*/ {
            header: "Cantidad aprobada",
            tooltip: 'Cantidad aprobada',
            dataIndex: 'cantfinal',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Precio",
            tooltip: 'Precio',
            dataIndex: 'precio',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Importe aprobado",
            tooltip: 'Importe aprobado',
            dataIndex: 'importe',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Cantidad contratada",
            tooltip: 'Cantidad contratada',
            dataIndex: 'cantcontratada',
            width: 100,
            sortable: true,
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFieldcontratado',
                listeners: {
                    change: function (nm, newV, oldV) {
                        if ((newV != "" && newV != oldV)) {
                            Ext.getCmp('idbtnGuardarCont').enable();
                        }

                    }
                }
            })
        }, {
            header: "Precio contratado",
            tooltip: 'Precio contratado',
            dataIndex: 'preciocontratado',
            width: 100,
            sortable: true,
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFielddesgloseplan',
                listeners: {
                    change: function (nm, newV, oldV) {
                        if ((newV != "" && newV != oldV)) {
                            Ext.getCmp('idbtnGuardarCont').enable();
                        }

                    }
                }
            })
        }, {
            header: "Importe contratado",
            tooltip: 'Importe contratado',
            dataIndex: 'importecontratado',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "% Cont",
            tooltip: 'Porciento contratado',
            dataIndex: 'pcontratado',
            width: 60,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "% Ejec",
            tooltip: 'Porciento ejecutado',
            dataIndex: 'pejecutado',
            width: 60,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Ejecución acumulada",
            tooltip: 'Ejecución acumulada',
            dataIndex: 'cantreal',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Pendiente a ejecutar",
            tooltip: 'Pendiente a ejecutar',
            dataIndex: 'pendiente',
            width: 100,
            sortable: true,
            renderer: crearToolTip
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
        pageSize: 20,
        store: stIndicadoresEjecucionPlanif,
        displayInfo: true,
        items: ['-', {
                xtype: 'button',
                iconCls: 'limpiar',
                tooltip: 'Limpiar',
                handler: function () {
                    filtrosIndicadoresEjecucionPlanif.clearFilters();
                }
            }]
    });


    gpIndicadoresEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        id: 'idgpIndicadoresEjecucionPlanif',
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
        bbar: pgtIndicadoresEjecucionPlanif,
        md: new Ext.menu.Menu({
            id: 'menunivelesact',
            items: [{
                    id: 'btnCambiar',
                    itemCls: 'x-menu-intem icondistra-cambiar',
                    iconCls: 'imagen-none',
                    text: '  Sustituir',
                    handler: function () {
                        indicadores_adicionados_desv = [];
                        wdesvExtraPlan.show();
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());

            },
            afteredit: function (e) {
                if (e.value > smIndicadoresEjecucionPlanif.getSelected().data.cantfinal) {
                    btnGuardarCont.disable();
                    mostrarMensaje(1, 'La cantidad contratada debe ser igual o menor que la cantidad aprobada.');
                } else {
                    btnGuardarCont.enable();
                }

            }

        }

    });

    smDesgIndicadoresEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                btnEliminarDesg.enable();
            }, rowdeselect: function () {
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
                name: 'idcontrolejecucionplandemanda'
            }, {
                name: 'idindicador'
            }, {
                name: 'iddesviacionplan'
            }, {
                name: 'cantidadreal'
            }, {
                name: 'fechareal'
            }, {
                name: 'idcontrolejecdesviacion'
            }
        ]),
        listeners: {
            beforeload: function (st, op) {

                if (gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections().length != 0) {
                    btnAdicionarDesg.enable();
                } else {
                    btnAdicionarDesg.disable();
                }

                if (tpEjecucion.getActiveTab().id == 'idejecucion_plan') {
                    st.baseParams.idplanif = smIndicadoresEjecucionPlanif.getSelected().data.idplanificacion;
                    st.baseParams.codigo = 1;
                } else if (tpEjecucion.getActiveTab().id == 'idTpAdicion_plan') {
                    st.baseParams.idindicador = smAdicIndicadoresEjecucionPlanif.getSelected().data.idindicador;
                    st.baseParams.codigo = 2;
                    st.baseParams.iddesviacionplandemanda = smAdicIndicadoresEjecucionPlanif.getSelected().data.iddesviacionplandemanda;
                    if (gpAdicIndicadoresEjecucionPlanif.getSelectionModel().getSelections().length != 0) {
                        btnAdicionarDesg.enable();
                    } else {
                        btnAdicionarDesg.disable();
                    }
                } else {
                    st.baseParams.idindicador = smDesvIndicadoresEjecucionPlanif.getSelected().data.idindicador;
                    if (gpDesvIndicadoresEjecucionPlanif.getSelectionModel().getSelections().length != 0) {
                        btnAdicionarDesg.enable();
                    } else {
                        btnAdicionarDesg.disable();
                    }
                    st.baseParams.codigo = 3;
                    st.baseParams.iddesviacionplandemanda = smDesvIndicadoresEjecucionPlanif.getSelected().data.iddesviacionplandemanda;
                }
                btnGuardarDesg.disable();
                btnEliminarDesg.disable();
                st.baseParams.start = 0;
                st.baseParams.limit = 20;

            },
            load: function (st, re, o) {
                contadorAdiciones = 0;
            }
        }
    });

    dtGeneral = new Ext.form.DateField({
        format: 'd/m/Y',
        anchor: '95%',
        allowBlank: false,
        value: new Date(),
        listeners: {
            change: function () {
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
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFieldDesgPlan',
                listeners: {
                    change: function (nm, newV, oldV) {
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
        tooltip: 'Adicionar real por fecha <b>(ALt+I)</b>',
        id: 'idbtnAdicionarDesg',
        iconCls: 'adicionar',
        disabled: true,
        handler: function () {
            adicionarFilaRealPorFecha();
        }
    });

    btnGuardarDesg = new Ext.Button({
        tooltip: 'Guardar real por fecha',
        id: 'idbtnGuardarDesg',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            guardarFilaRealPorFecha();
        }
    });
    btnGuardarCont = new Ext.Button({
        tooltip: 'Guardar contratación',
        id: 'idbtnGuardarCont',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            guardarContratado();
        }
    });

    btnEliminarDesg = new Ext.Button({
        tooltip: 'Eliminar real por fecha <b>(Del)</b>',
        id: 'idbtnEliminarDesg',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            eliminarDesglosePlan();
        }
    });

    gpDesgIndicadoresEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '20%',
        id: 'idgpDesgIndicadoresEjecucionPlanif',
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
            pageSize: 20,
            store: stDesgIndicadoresEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
                        filtrosDesgIndicadoresEjecucionPlanif.clearFilters();
                    }
                }]
        }),
        listeners: {
            afteredit: function (obj) {
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
        disabled: false,
        id: 'idTpDesglose_plan',
        items: [gpDesgIndicadoresEjecucionPlanif]
    });

    btnAplicarDesvSustPlan = new Ext.Button({
        text: 'Aplicar',
        tooltip: 'Guardar datos y limpiar los campos',
        id: 'idbtnAplicarExtra',
        iconCls: 'aplicar',
        disabled: true,
        handler: function () {

        }
    });

    btnAceptarDesvSustPlan = new Ext.Button({
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana',
        id: 'idbtnAceptarExtra',
        iconCls: 'aceptar',
        disabled: true,
        handler: function () {
            //  if (adicion) {
            //     btnAdicionPlan.disable();
            adicionarAdicPlan(gpIndicadoresAddEjecucionPlanif.getSelectionModel().getSelections());
            //  } else {
            //      btnExtraPlan.disable();
            //     adicionarDesvPlan(gpIndicadoresAddEjecucionPlanif.getSelectionModel().getSelected());
            //  }


        }
    });

    btnCancelarDesvSustPlan = new Ext.Button({
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        id: 'idbtnCancelarExtra',
        iconCls: 'cancelar',
        disabled: false,
        handler: function () {
            wdesvExtraPlan.hide();
        }
    });

    smIndicadoresAddEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                btnAceptarDesvSustPlan.enable();
                btnAplicarDesvSustPlan.enable();
                btnAdicionPlan.enable();
            },
            rowdeselect: function () {
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
            beforeload: function (st, op) {
                st.baseParams.start = 0;
                st.baseParams.limit = 20;

                indseleccionados = gpIndicadoresAddEjecucionPlanif.getSelectionModel().getSelections();
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
                st.baseParams.idejercicio = cmbEjercicio.getValue();
            },
            load: function (st, rec, opt) {
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
            pageSize: 20,
            store: stIndicadoresAddEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
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
        closeAction: 'hide',
        modal: true,
        buttons: [btnCancelarDesvSustPlan, btnAplicarDesvSustPlan, btnAceptarDesvSustPlan],
        items: [gpIndicadoresAddEjecucionPlanif],
        listeners: {
            beforeshow: function () {
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
            beforehide: function () {
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
        handler: function () {
            adicion = false;
            wdesvExtraPlan.show();
        }
    });

    btnGuadarDesvPlan = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnGuardarDesv',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            //guadarDesvPlan();
            guardarContratado();
        }
    });

    btnEliminarDesv = new Ext.Button({
        tooltip: 'Eliminar desviaci&oacute;n',
        id: 'idbtnEliminarDesv',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            eliminarDesvPlan();
        }
    });

    smDesvIndicadoresEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, rw, r) {
                btnEliminarDesv.enable();
                if (tpPlanesRealDesv.getActiveTab().id == 'idTpDesviacion_plan') {
                    stDesvIndicadoresEjecucionPlanif.load();
                } else if (tpPlanesRealDesv.getActiveTab().id == 'idTpDesglose_plan') {
                    stDesgIndicadoresEjecucionPlanif.load();
                }


                Ext.getCmp('idbtnGuardarDesv').enable();
                //  if (esHoja == 1) {
                Ext.getCmp('idbtnAdicionarDesg').enable();
                Ext.getCmp('idbtnGuardarDesg').disable();
                btnExtraPlan.enable();
                tpPlanesRealDesv.expand();
                pDesgIndicadoresEjecucionPlanif.enable();
                pDesviacionIndicadoresEjecucionPlanif.enable();
                pAdicionIndicadoresEjecucionPlanif.enable();
            },
            rowdeselect: function () {
                btnEliminarDesv.disable();
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
                name: 'iddesviacionnivelactividaddemanda'
            }, {
                name: 'iddesviacionplandemanda'
            }, {
                name: 'numeropieza'
            }, {
                name: 'precioejecutado'
            }, {
                name: 'importeejecutado'
            }
        ]),
        listeners: {
            beforeload: function (st, op) {
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
                st.baseParams.start = 0;
                st.baseParams.limit = 20;
            },
            load: function (st, rec, opt) {
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
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Denominaci&oacute;n",
            tooltip: 'Denominaci&oacute;n',
            dataIndex: 'denominacion',
            sortable: true,
            id: 'expandir',
            renderer: crearToolTipdenominacion
        }/*, {
         header: "No pieza",
         tooltip: 'número de pieza',
         dataIndex: 'numeropieza',
         width: 100,
         sortable: true,
         renderer:crearToolTip
         }*/, {
            header: "Cantidad contratada",
            tooltip: 'Cantidad contratada',
            dataIndex: 'cantcontratada',
            width: 120,
            sortable: true,
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFieldcontratado',
                listeners: {
                    change: function (nm, newV, oldV) {
                        if ((newV != "" && newV != oldV)) {
                            Ext.getCmp('idbtnGuardarCont').enable();
                        }

                    }
                }
            })
        }, {
            header: "Precio contratado",
            tooltip: 'precio contratado',
            dataIndex: 'preciocontratado',
            width: 100,
            sortable: true,
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFielddesgloseplan',
                listeners: {
                    change: function (nm, newV, oldV) {
                        if ((newV != "" && newV != oldV)) {
                            Ext.getCmp('idbtnGuardarCont').enable();
                        }

                    }
                }
            })
        }, {
            header: "Importe contratado",
            tooltip: 'importe contratado',
            dataIndex: 'importecontratado',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "% Ejec",
            tooltip: 'porciento ejecutado',
            dataIndex: 'pejecutado',
            width: 60,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Ejecucion acumulada",
            tooltip: 'Ejecucion acumulada',
            dataIndex: 'cantreal',
            width: 120,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Pendiente a Ejecutar",
            tooltip: 'Pendiente a Ejecutar',
            dataIndex: 'pendiente',
            width: 120,
            sortable: true,
            renderer: crearToolTip
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
        id: 'idgpDesvIndicadoresEjecucionPlanif',
        plugins: filtrosDesvIndicadoresEjecucionPlanif,
        store: stIndicadoresEjecucionPlanif,
        sm: smDesvIndicadoresEjecucionPlanif,
        cm: cmDesvIndicadoresEjecucionPlanif,
        tbar: [/*btnExtraPlan,*/ btnGuadarDesvPlan, btnEliminarDesv],
        loadMask: {
            store: stIndicadoresEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stIndicadoresEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
                        filtrosDesvIndicadoresEjecucionPlanif.clearFilters();
                    }
                }]
        }),
        listeners: {
            afteredit: function (obj) {
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
        disabled: false,
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
            beforeload: function (st, op) {
                st.baseParams.start = 0;
                st.baseParams.limit = 20;
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
            rowselect: function (sm, rowIndex, rec) {
                btnEliminarAdicion.enable();
                pDesgIndicadoresEjecucionPlanif.enable();
                // stDesvIndicadoresEjecucionPlanif.load();
                fseleccionada = rowIndex;
                stDesgIndicadoresEjecucionPlanif.load();
                iddesviacionplandemanda = sm.getSelected().data.iddesviacionplandemanda;

            },
            rowdeselect: function () {
                iddesviacionplandemanda = '';
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
                name: 'iddesviacionplandemanda'
            }, {
                name: 'numeropieza'
            }, {
                name: 'precioejecutado'
            }, {
                name: 'importeejecutado'
            }
        ]),
        listeners: {
            beforeload: function (st, op) {
                btnGuadarAdicionPlan.disable();
                btnEliminarAdicion.disable();
                st.baseParams.start = 0;
                st.baseParams.limit = 20;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.identidad = identidadselected;
                st.baseParams.idmodelo = cmbPlanes.getValue();
            },
            load: function (st, rec, opt) {
                indicadores_adicionados_adic = [];
                for (var i = 0; i < st.getCount(); i++) {
                    indicadores_adicionados_adic[i] = st.data.items[i].data.idindicador;
                }
                if (st.getCount() == 0) {
                    tpPlanesRealDesv.collapse(true);
                    //tpPlanesRealDesv.disable();
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
            header: "Denominaci&oacute;n",
            tooltip: 'Denominaci&oacute;n',
            dataIndex: 'denominacion',
            sortable: true,
            id: 'expandir'
        }, /*{
         header: "No pieza",
         tooltip: 'número de pieza',
         dataIndex: 'numeropieza',
         width: 100,
         sortable: true
         }, */{
            header: "Cantidad contratada",
            tooltip: 'Cantidad contratada',
            dataIndex: 'cantcontratada',
            width: 120,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFieldcontratado',
                listeners: {
                    change: function (nm, newV, oldV) {
                        if ((newV != "" && newV != oldV)) {
                            Ext.getCmp('idbtnGuardarCont').enable();
                        }

                    }
                }
            })
        }, {
            header: "Precio contratado",
            tooltip: 'precio contratado',
            dataIndex: 'preciocontratado',
            width: 100,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                id: 'idNumberFielddesgloseplan',
                listeners: {
                    change: function (nm, newV, oldV) {
                        if ((newV != "" && newV != oldV)) {
                            Ext.getCmp('idbtnGuardarCont').enable();
                        }

                    }
                }
            })
        }, {
            header: "Importe contratado",
            tooltip: 'importe contratado',
            dataIndex: 'importecontratado',
            width: 100,
            sortable: true
        }, {
            header: "% Ejec",
            tooltip: 'porciento ejecutado',
            dataIndex: 'pejecutado',
            width: 60,
            sortable: true
        }, {
            header: "Ejecucion acumulada",
            tooltip: 'Ejecucion acumulada',
            dataIndex: 'cantreal',
            width: 120,
            sortable: true
        }, {
            header: "Pendiente a Ejecutar",
            tooltip: 'Pendiente a Ejecutar',
            dataIndex: 'pendiente',
            width: 120,
            sortable: true
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
        handler: function () {
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
        handler: function () {

            guardarContratado();
        }
    });

    btnEliminarAdicion = new Ext.Button({
        tooltip: 'Eliminar adici&oacute;n',
        id: 'idbtnEliminarAdic',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
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
        id: 'idgpAdicIndicadoresEjecucionPlanif',
        plugins: filtrosAdicIndicadoresEjecucionPlanif,
        autoExpandColumn: 'expandir',
        tbar: ['Planes: ', cmbPlanesTab2, btnAdicionPlan, btnGuadarAdicionPlan, btnEliminarAdicion],
        store: stIndicadoresEjecucionPlanif,
        sm: smAdicIndicadoresEjecucionPlanif,
        cm: cmAdicIndicadoresEjecucionPlanif,
        loadMask: {
            store: stIndicadoresEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stIndicadoresEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
                        filtrosAdicIndicadoresEjecucionPlanif.clearFilters();
                    }
                }]
        }),
        listeners: {
            afteredit: function (obj) {
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
        //  title: 'Adici&oacute;n',
        title: 'Fuera de plan',
        layout: 'fit',
        disabled: false,
        id: 'idTpAdicion_plan',
        items: [gpAdicIndicadoresEjecucionPlanif]
    });


    tpPlanesRealDesv = new Ext.TabPanel({
        region: 'south',
        border: true,
        height: 300,
        activeTab: 0,
        collapsible: true,
        collapsed: true,
        id: 'idtp_planes',
        listeners: {
            tabchange: function (t, tabpanel) {
                if (tabpanel.id == 'idTpDesglose_plan') {
                    if (esHoja) {
                        stDesgIndicadoresEjecucionPlanif.load();
                    }
                } else {
                    if (tabpanel.id == 'idTpDesviacion_plan' && esHoja) {
                        stDesvIndicadoresEjecucionPlanif.load();
                    }
                    if (tabpanel.id == 'idTpAdicion_plan' && esHoja) {
                        stAdicIndicadoresEjecucionPlanif.load();
                    }
                    gpIndicadoresEjecucionPlanif.getSelectionModel().singleSelect = false;
                }
            }
        },
        items: [pDesgIndicadoresEjecucionPlanif]
    });

    pGeneralPlanes = new Ext.Panel({
        id: 'idejecucion_plan',
        title: 'Plan',
        layout: 'border',
        items: [gpIndicadoresEjecucionPlanif],
        tbar: ['Planes:   ', cmbPlanes, '-', btnGuardarCont]
    });


//-------------- Actividades ---------------------------------


    smNivelesActividadesEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, rowIndex, rec) {

                if (tpActividadesRealDesv.getActiveTab().id == 'idTpDesviacion_actividades' && esHoja) {
                    stActividadesDesvEjecucionPlanif.load();
                } else if (tpActividadesRealDesv.getActiveTab().id == 'idTpDesglose_actividades' && esHoja) {
                    stActividadesRealPorFechaEjecucionPlanif.load();
                }


                btnAdicionarDesgActv.enable();
                btnAdicionarDesvActv.enable();
                pDesgActividadesEjecucionPlanif.enable();
                pDesvActividadesEjecucionPlanif.enable();


            },
            rowdeselect: function (x, y, w) {
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
            header: "Ejecucion acumulada",
            tooltip: 'Ejecucion acumulada',
            dataIndex: 'nivelactvreal',
            width: 150,
            sortable: true
        }, {
            header: "Pendiente a Ejecutar",
            tooltip: 'Pendiente a Ejecutar',
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
            beforeload: function (st, op) {
                st.baseParams.start = 0;
                st.baseParams.limit = 20;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.idEstructuraPadre = idEstructuraPadre;
                st.baseParams.esrector = esRector;
                st.baseParams.identidad = identidadselected;
                st.baseParams.is_leaf = esHoja;
            },
            load: function (st, rec, op) {

                if (gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelected() == undefined) {
                    pDesgActividadesEjecucionPlanif.disable();
                    pDesvActividadesEjecucionPlanif.disable();
                    Ext.getCmp('idtp_actividades').setActiveTab('idTpAdicion_actividades');
                }

                if (esHoja) {
                    tpActividadesRealDesv.expand();
                    tpActividadesRealDesv.enable();
                    pAdicActividadesEjecucionPlanif.enable();
                }
                if (filasActv.length != 0) {
                    for (var i = 0; i < filasActv.length; i++) {
                        gpNivelesActividadesEjecucionPlanif.getSelectionModel().selectRows(filasActv);
                    }
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
            pageSize: 20,
            store: stNivelesActividadesEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
                        filtrosNivelesActividadesEjecucionPlanif.clearFilters();
                    }
                }]
        })
    });


    smActividadesRealPorFechaEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                btnEliminarDesgActv.enable();
            },
            rowdeselect: function () {
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
            renderer: crearToolTip,
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
                name: 'idcontrolejecucionnivelactividaddemanda'
            }, {
                name: 'nivelactividadreal'
            }, {
                name: 'fechareal'
            }, {
                name: 'idactividadentidad'
            }
        ]),
        listeners: {
            beforeload: function (st) {
                st.baseParams.idactividad = gpNivelesActividadesEjecucionPlanif.getSelectionModel().getSelected().data.idactividad;
                st.baseParams.identidad = identidadselected;
                st.baseParams.idejercicio = cmbEjercicio.getValue();
                st.baseParams.start = 0;
                st.baseParams.limit = 20;
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
        handler: function () {
            adicionarFilaDesgActv();
        }
    });

    btnGuardarDesgActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            guardarFilaDesgActv();
        }
    });

    btnEliminarDesgActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnEliminarDesgAct',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            eliminarEjecActv();
        }
    });

    gpActividadesRealPorFechaEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '20%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        id: 'idgpActividadesRealPorFechaEjecucionPlanif',
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
            pageSize: 20,
            store: stActividadesRealPorFechaEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
                        filtrosActividadesRealPorFechaEjecucionPlanif.clearFilters();
                    }
                }]
        }),
        listeners: {
            afteredit: function (obj) {
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
        singleSelect: false,
        listeners: {
            rowselect: function () {
                btnEliminarDesvActv.enable();
                pDesgIndicadoresEjecucionPlanif.enable();
                // stDesvIndicadoresEjecucionPlanif.load();
                fseleccionada = rowIndex;
                stDesgIndicadoresEjecucionPlanif.load();
                gpActividadesRealPorFechaEjecucionPlanif.getStore().reload();
            },
            rowdeselect: function () {
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
                name: 'iddesviacionnivelactividaddemanda'
            }
        ]),
        listeners: {
            beforeload: function (st, op) {
                btnAdicionarDesvActv.enable();
                btnGuardarDesvActv.disable();
                btnEliminarDesvActv.disable();
                st.baseParams.start = 0;
                st.baseParams.limit = 20;
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
            load: function (st, rec, opt) {
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
        handler: function () {

        }
    });

    btnAceptarDesvSustActividades = new Ext.Button({
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana',
        iconCls: 'aceptar',
        disabled: true,
        handler: function () {
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
        handler: function () {
            wdesvExtraActividades.hide();
        }
    });

    smActividadesAddEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                btnAceptarDesvSustActividades.enable();
                btnAplicarDesvSustActividades.enable();
            },
            rowdeselect: function () {
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
            beforeload: function (st, op) {
                st.baseParams.start = 0;
                st.baseParams.limit = 20;

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
            load: function (st, rec, opt) {
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
            pageSize: 20,
            store: stActividadesAddEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
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
            beforeshow: function () {
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
            beforehide: function () {
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
        handler: function () {
            adicionactv = false;
            wdesvExtraActividades.show();
        }
    });

    btnGuardarDesvActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnGuardarDesv',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            guardarFilaDesvActv();
        }
    });

    btnEliminarDesvActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnEliminarDesvAct',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            eliminarDesvActv();
        }
    });


    smActividadesDesvEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                btnEliminarDesvActv.enable();
                pDesgIndicadoresEjecucionPlanif.enable();
                // stDesvIndicadoresEjecucionPlanif.load();
                fseleccionada = rowIndex;
                stDesgIndicadoresEjecucionPlanif.load();
                gpActividadesRealPorFechaEjecucionPlanif.getStore().reload();
            },
            rowdeselect: function () {
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
            pageSize: 20,
            store: stActividadesDesvEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
                        filtrosActividadesDesvEjecucionPlanif.clearFilters();
                    }
                }]
        }),
        listeners: {
            afteredit: function (obj) {
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
        handler: function () {
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
        handler: function () {
            guardarFilaAdicActv();
        }
    });

    btnEliminarAdicActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnEliminarAdicAct',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            eliminarAdicActv();
        }
    });

    smActividadesAdicEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                btnEliminarAdicActv.enable();
            },
            rowdeselect: function () {
                btnEliminarAdicActv.disable();
            }
        }
    });

    function formatDate(value, m) {
        if (Ext.isDate(value)) {
            m.attr = 'ext:qtip="' + value.format('d/m/Y') + '"';
            return value.format('d/m/Y');
        } else {
            m.attr = 'ext:qtip="' + value + '"';
            return value;
        }
    }
    ;

    dtAdicEjecActv = new Ext.form.DateField({
        anchor: '95%',
        allowBlank: false,
        format: 'd/m/Y',
        value: new Date()/*.format('d/m/Y')*/
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
                name: 'iddesviacionnivelactividaddemanda'
            }
        ]),
        listeners: {
            load: function (st, rec, opt) {
                actv_inser_adicion = [];
                for (var i = 0; i < st.getCount(); i++) {
                    actv_inser_adicion[i] = st.data.items[i].data.idactividad;
                }
                if (st.getCount() == 0) {
                    tpActividadesRealDesv.collapse(true);
                    //tpActividadesRealDesv.disable();
                } else {
                    tpActividadesRealDesv.expand();
                    tpActividadesRealDesv.enable();
                }
            },
            beforeload: function (st, op) {
                btnGuardarAdicActv.disable();
                btnEliminarAdicActv.disable();
                st.baseParams.start = 0;
                st.baseParams.limit = 20;
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
            pageSize: 20,
            store: stActividadesAdicEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
                        filtrosActividadesAdicEjecucionPlanif.clearFilters();
                    }
                }]
        }),
        listeners: {
            afteredit: function (obj) {
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
            tabchange: function (t, tabpanel) {
                if (tabpanel.id == 'idTpDesglose_actividades') {
                    if (esHoja) {
                        stActividadesRealPorFechaEjecucionPlanif.load();
                    }
                    gpNivelesActividadesEjecucionPlanif.getSelectionModel().singleSelect = true;
                } else {
                    if (tabpanel.id == 'idTpDesviacion_actividades' && esHoja) {
                        stActividadesDesvEjecucionPlanif.load();
                    } else if (tabpanel.id == 'idTpAdicion_actividades' && esHoja) {
                        stActividadesAdicEjecucionPlanif.load();
                    }
                    gpNivelesActividadesEjecucionPlanif.getSelectionModel().singleSelect = false;
                }
            }
        },
        items: [pDesgActividadesEjecucionPlanif, pDesvActividadesEjecucionPlanif, pAdicActividadesEjecucionPlanif]
    });
//menu para los reportes.
    //men� de acciones para gr�ficas de actividades
    btngraficasAct = new Ext.Toolbar.MenuButton({
        id: 'menugraficasA',
        disabled: true,
        tooltip: "Gr\xE1ficas",
        iconCls: 'graficar',
        menu: {
            items: [{
                    id: 'btnVergraficaA',
                    itemCls: 'x-menu-item icondistra-reportegrafico',
                    iconCls: 'imagen-none',
                    text: 'Ejecuci\xF3n global por entidad',
                    handler: function () {
                        crearGraficadinamica(1, 'activ');
                    }
                }
            ]
        }
    });


    pGeneralActividades = new Ext.Panel({
        height: 802,
        id: 'idejecucion_actividades',
        title: 'Actividades',
        layout: 'border',
        items: [gpNivelesActividadesEjecucionPlanif, tpActividadesRealDesv],
        tbar: [btngraficasAct]
    });

    //------------------- General ----------------------------
    tpEjecucion = new Ext.TabPanel({
        region: 'center',
        border: true,
        activeTab: 0,
        listeners: {
            tabchange: function (t, tabpanel) {
                if (esHoja) {
                    if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                        stIndicadoresEjecucionPlanif.load();
                    //stAdicIndicadoresEjecucionPlanif.load();
                    if (stIndicadoresEjecucionPlanif.getCount() == 0) {
                        tpPlanesRealDesv.collapse(true);
                        //tpPlanesRealDesv.disable();
                    } else {
                        tpPlanesRealDesv.expand();
                        tpPlanesRealDesv.enable();
                    }
                    pAdicionIndicadoresEjecucionPlanif.enable();
                } else {
                    tpPlanesRealDesv.collapse(true);
                    pAdicionIndicadoresEjecucionPlanif.disable();
                }
            }
        },
        items: [pGeneralPlanes, pAdicionIndicadoresEjecucionPlanif, pDesviacionIndicadoresEjecucionPlanif/* pGeneralActividades*/]
    });

    pGeneralAux = new Ext.Panel({
        layout: 'border',
        region: 'center',
        border: false,
        items: [tpEjecucion, tpPlanesRealDesv]
    });

    pGeneral = new Ext.Panel({
        layout: 'border',
        border: false,
        tbar: ['Ejercicio:  ', cmbEjercicio, '-', btnreportesPlan, '-', btngraficasPlan, '->', btnAyudaControlEjecucionPlanif],
        items: [tpEntidades, pGeneralAux]
    });

    view = new Ext.Viewport({
        layout: 'fit',
        items: [pGeneral]
    });
}


//---------------------------FUNCIONES DE PLANES----------------------------------------
function adicionarFilaRealPorFecha() {
    suma = 0;
    contadorAdiciones++;
    Fila = Ext.data.Record.create([{
            name: 'idcontrolejecucionplandemanda',
            type: 'string'
        }, {
            name: 'cantidadreal',
            type: 'string'
        }, {
            name: 'fechareal',
            type: 'string'
        }]);

    suma = 0;
    for (i = 0; i < Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getCount(); i++) {
        suma += parseFloat(Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getAt(i).data.cantidadreal);
    }

    if (tpEjecucion.getActiveTab().id == 'idejecucion_plan') {
        //Si estoy en el Tab Panel
        if ((parseFloat(Ext.getCmp('idgpIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantcontratada) - parseFloat(suma)) <= 0) {
            mostrarMensaje(2, 'No se puede desglozar porque se ha alcanzado el límite máximo.');
        } else {
            dtGeneral.setValue(new Date().format('d/m/Y'));
            var p = new Fila({
                idcontrolejecucionplandemanda: null,
                cantidadreal: (parseFloat(Ext.getCmp('idgpIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantcontratada) - parseFloat(suma)).toFixed(4),
                fechareal: dtGeneral.getValue().format('d/m/Y')
            });
            Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().add(p);
            Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getSelectionModel().selectRow(Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getCount() - 1);
            Ext.getCmp('idbtnGuardarDesg').enable();
        }
    } else
    if (tpEjecucion.getActiveTab().id == 'idTpAdicion_plan') {
        //Si estoy en el Tab Fuera de Plan
        if ((parseFloat(Ext.getCmp('idgpAdicIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantcontratada) - parseFloat(suma)) <= 0) {
            mostrarMensaje(2, 'No se puede desglozar porque se ha alcanzado el límite máximo.');
        } else {
            dtGeneral.setValue(new Date().format('d/m/Y'));
            var p = new Fila({
                idcontrolejecucionplandemanda: null,
                cantidadreal: (parseFloat(Ext.getCmp('idgpAdicIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantcontratada) - parseFloat(suma)).toFixed(4),
                fechareal: dtGeneral.getValue().format('d/m/Y')
            });
            Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().add(p);
            Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getSelectionModel().selectRow(Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getCount() - 1);
            Ext.getCmp('idbtnGuardarDesg').enable();
        }
    } else {
        //Si estoy en el Tab Desviación
        if ((parseFloat(Ext.getCmp('idgpDesvIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantcontratada) - parseFloat(suma)) <= 0) {
            mostrarMensaje(2, 'No se puede desglozar porque se ha alcanzado el límite máximo.');
        } else {
            dtGeneral.setValue(new Date().format('d/m/Y'));
            var p = new Fila({
                idcontrolejecucionplandemanda: null,
                cantidadreal: (parseFloat(Ext.getCmp('idgpDesvIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantcontratada) - parseFloat(suma)).toFixed(4),
                fechareal: dtGeneral.getValue().format('d/m/Y')
            });
            Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().add(p);
            Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getSelectionModel().selectRow(Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getCount() - 1);
            Ext.getCmp('idbtnGuardarDesg').enable();
        }
    }

}

function guardarFilaRealPorFecha() {

    suma = 0;
    for (i = 0; i < Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getCount(); i++) {
        suma += parseFloat(Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getAt(i).data.cantidadreal);
    }

    /*if ((parseFloat(Ext.getCmp('idgpIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantfinal) - parseFloat(suma)) < 0) {
     mostrarMensaje(3, 'No se puede guardar el desglose realizado porque se ha excedido la cantidad aprobada.');
     } */

    if (
            ((tpEjecucion.getActiveTab().id == 'idejecucion_plan') && ((parseFloat(Ext.getCmp('idgpIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantfinal) - parseFloat(suma)) < 0)) ||
            ((tpEjecucion.getActiveTab().id == 'idTpAdicion_plan') && ((parseFloat(Ext.getCmp('idgpAdicIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantcontratada) - parseFloat(suma)) < 0)) ||
            ((tpEjecucion.getActiveTab().id == 'idTpDesviacion_plan') && ((parseFloat(Ext.getCmp('idgpDesvIndicadoresEjecucionPlanif').getSelectionModel().getSelected().data.cantcontratada) - parseFloat(suma)) < 0))
            ) {
        //Si estoy en el Tab Panel
        mostrarMensaje(3, 'No se puede guardar el desglose realizado porque se ha excedido la cantidad aprobada.');

    } else {
        filasmodificadas = Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getRange(0, Ext.getCmp('idgpDesgIndicadoresEjecucionPlanif').getStore().getCount() - 1);

        //filasmodificadas = gpDesgIndicadoresEjecucionPlanif.getStore().getModifiedRecords();
        campos_nulos = false;

        indseleccionados = gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
        indselecss = gpAdicIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
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
        fseleccionada = [];
        var cont = 0;
        for (var i = 0; i < indselecss.length; i++) {
            for (var j = 0; j < keys_st.length; j++) {
                if (indselecss[i].id == keys_st[j]) {
                    fseleccionada[cont] = j;
                    cont++;
                }
            }
        }

        var campos_modificados = [];
        Ext.each(filasmodificadas, function (record) {
            campos_modificados.push(Ext.apply(record.data));

        });
        var codigo = 0
        if (tpEjecucion.getActiveTab().id == 'idejecucion_plan') {
            codigo = 1;
        } else if (tpEjecucion.getActiveTab().id == 'idTpAdicion_plan') {
            codigo = 2;
        } else {
            codigo = 3;
            iddesviacionplandemanda = smDesvIndicadoresEjecucionPlanif.getSelected().data.iddesviacionplandemanda;
        }

        Ext.Ajax.request({
            url: 'insertarEjecPlan',
            params: {
                idplanificacion: idplanificacionactual,
                iddesviacionplandemanda: iddesviacionplandemanda,
                codigo: codigo,
                ejec: Ext.encode(campos_modificados)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData == true) {
                    if (campos_modificados.length > 1) {
                        mostrarMensaje(1, 'Los desgloses han sido adicionados correctamente.');
                    } else {
                        mostrarMensaje(1, 'El desglose ha sido adicionado correctamente.');
                    }

                    stDesgIndicadoresEjecucionPlanif.reload({
                        params: {
                            idplanif: idplanificacionactual,
                            iddesv: iddesviacionplandemanda,
                            start: 0,
                            limit: 20
                        }
                    });

                    if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                        stIndicadoresEjecucionPlanif.reload();

                    Ext.getCmp('idbtnAdicionarDesg').enable();
                    Ext.getCmp('idbtnGuardarDesg').disable();
                    btnEliminarDesg.disable();
                }
                // stDesgIndicadoresEjecucionPlanif.rejectChanges();
                // stDesgIndicadoresEjecucionPlanif.commit();
            }
        });
        filasmodificadas = [];

    }
}

function guardarContratado() {
    filasmod = [];
    //filas = gpIndicadoresEjecucionPlanif.getStore().getRange();
    filasmod = gpIndicadoresEjecucionPlanif.getStore().getModifiedRecords();

    var campos = [];
    for (var i = 0; i < filasmod.length; i++) {
        campos.push({
            cantcontratada: filasmod[i].data.cantcontratada,
            preciocontratado: filasmod[i].data.preciocontratado,
            idcontrataciondemanda: filasmod[i].data.idcontrataciondemanda,
            idplanificacion: filasmod[i].data.idplanificacion,
            idindicador: filasmod[i].data.idindicador,
            identidad: identidadselected,
            idejercicio: cmbEjercicio.getValue(),
            idmodelo: cmbPlanes.getValue()
        })
    }

    var codigo = 0;
    if (tpEjecucion.getActiveTab().id == 'idejecucion_plan')
        codigo = 1;
    else if (tpEjecucion.getActiveTab().id == 'idTpAdicion_plan')
        codigo = 2;
    else
        codigo = 3;

    Ext.Ajax.request({
        url: 'insertarContratacion',
        params: {
            modificados: Ext.encode(campos),
            codigo: codigo
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {
                if (campos.length > 1) {
                    mostrarMensaje(1, 'Los indicadores han sido contratados correctamente.');
                } else {
                    mostrarMensaje(1, 'El indicador ha sido contratado correctamente.');
                }

                stDesgIndicadoresEjecucionPlanif.rejectChanges();
                stIndicadoresEjecucionPlanif.rejectChanges();
                //stIndicadoresEjecucionPlanif.commit();

                stDesgIndicadoresEjecucionPlanif.reload({
                    params: {
                        idplanif: idplanificacionactual,
                        start: 0,
                        limit: 20
                    }
                });
                if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                    stIndicadoresEjecucionPlanif.reload();

                Ext.getCmp('idbtnAdicionarDesg').enable();
                Ext.getCmp('idbtnGuardarDesg').disable();
                btnEliminarDesg.disable();

            }

            /* gpIndicadoresEjecucionPlanif.getStore().rejectChanges();
             gpIndicadoresEjecucionPlanif.getStore().commit();
             gpAdicIndicadoresEjecucionPlanif.getStore().rejectChanges();
             gpAdicIndicadoresEjecucionPlanif.getStore().commit();
             gpDesvIndicadoresEjecucionPlanif.getStore().rejectChanges();
             gpDesvIndicadoresEjecucionPlanif.getStore().commit();*/

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
        if (filasmodificadas[i].data.iddesviacionplandemanda != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    iddesviacionplandemanda: filasmodificadas[i].data.iddesviacionplandemanda,
                    idindicador: filasmodificadas[0].data.idindicador,
                    precio: filasmodificadas[0].data.precioejecutado

                })
            } else {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    iddesviacionplandemanda: filasmodificadas[i].data.iddesviacionplandemanda,
                    idindicador: filasmodificadas[0].data.idindicador,
                    precio: filasmodificadas[0].data.precioejecutado
                })
            }
        } else {


            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    idindicador: filasmodificadas[0].data.idindicador,
                    idplanificacion: array_planif_ordenadomenor_mayor,
                    precio: filasmodificadas[0].data.precioejecutado
                })
            } else {
                campos_modificados.push({
                    cantidadreal: filasmodificadas[i].data.cantidadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    idindicador: filasmodificadas[0].data.idindicador,
                    idplanificacion: array_planif_ordenadomenor_mayor,
                    precio: filasmodificadas[0].data.precioejecutado
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
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {

                mostrarMensaje(1, 'La desviaci&oacute;n ha sido adicionada correctamente.');

                stDesvIndicadoresEjecucionPlanif.rejectChanges();
                stDesvIndicadoresEjecucionPlanif.reload();
                if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                    stIndicadoresEjecucionPlanif.reload();
                btnExtraPlan.enable();
                btnGuadarDesvPlan.disable();
            }
        }
    });
}

function adicionarAdicPlan(codind) {
    if (codind.length > 0) {

        var record = [];
        for (var i = 0; i < codind.length; i++) {
            record[i] = {
                cantidadreal: 0,
                codigo: codind[i].data.codigo,
                denominacion: codind[i].data.denominacion,
                umedida: codind[i].data.umedida,
                idindicador: codind[i].data.idindicador
            };

        }

    }
    var codigo = 0;
    if (tpEjecucion.getActiveTab().id == 'idejecucion_plan') {
        var record1 = [];
        filasm = gpIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
        for (var i = 0; i < filasm.length; i++) {
            record1[i] = filasm[i].data.idplanificacion;

        }
        codigo = 1;
    } else if (tpEjecucion.getActiveTab().id == 'idTpAdicion_plan')
        codigo = 2;
    else
        codigo = 3;
    Ext.Ajax.request({
        url: 'insertarFueradePlan',
        params: {
            indicadores: Ext.encode(record),
            idsplanificacion: Ext.encode(record1),
            idejercicio: cmbEjercicio.getValue(),
            identidad: identidadselected,
            // idmodelo: cmbPlanesTab2.getValue(),
            codigo: codigo,
            adicion: 1
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == true) {
                mostrarMensaje(1, 'Los indicadores han sido contratados correctamente.');
                if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                    stIndicadoresEjecucionPlanif.reload();
                stAdicIndicadoresEjecucionPlanif.rejectChanges();
                stAdicIndicadoresEjecucionPlanif.load();
                btnGuadarAdicionPlan.disable();
                btnEliminarDesg.disable();
                btnAdicionPlan.enable();
                wdesvExtraPlan.hide();
            }
        }
    });

}

function eliminarDesglosePlan() {

    indselecss = gpAdicIndicadoresEjecucionPlanif.getSelectionModel().getSelections();
    fseleccionada = [];
    var cont = 0;
    for (var i = 0; i < indselecss.length; i++) {
        for (var j = 0; j < keys_st.length; j++) {
            if (indselecss[i].id == keys_st[j]) {
                fseleccionada[cont] = j;
                cont++;
            }
        }
    }
    var elementos_eliminar = [];
    var elementos_sel = smDesgIndicadoresEjecucionPlanif.getSelections();
    var codigo = 0;
    for (var i = 0; i < elementos_sel.length; i++) {
        if (tpEjecucion.getActiveTab().id == 'idejecucion_plan') {
            elementos_eliminar[i] = elementos_sel[i].data.idcontrolejecucionplandemanda;
            codigo = 1;
        } else if (tpEjecucion.getActiveTab().id == 'idTpAdicion_plan') {
            elementos_eliminar[i] = elementos_sel[i].data.idcontrolejecdesviacion;
            codigo = 2;

        } else {
            codigo = 3;
            //elementos_eliminar[i] = elementos_sel[i].data.iddesviacionplandemanda;
            elementos_eliminar[i] = smDesvIndicadoresEjecucionPlanif.getSelected().data.idcontrolejecdesviacion;
            //st.baseParams.iddesviacionplandemanda = smDesvIndicadoresEjecucionPlanif.getSelected().data.iddesviacionplandemanda;
        }
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
                    eliminar: Ext.encode(elementos_eliminar),
                    codigo: codigo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Los desgloses han sido eliminados satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'El desglose ha sido eliminado satisfactoriamente.');
                        }
                        stDesgIndicadoresEjecucionPlanif.load();
                        btnEliminarDesg.disable();
                        if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
                            stIndicadoresEjecucionPlanif.reload();

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
        elementos_eliminar[i] = elementos_sel[i].data.iddesviacionplandemanda;
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
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Las desviaciones han sido eliminadas satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'La desviaci&oacute;n ha sido eliminada satisfactoriamente.');
                        }
                        stDesvIndicadoresEjecucionPlanif.load();
                        if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
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
        elementos_eliminar[i] = elementos_sel[i].data.iddesviacionplandemanda;
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
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        if (elementos_eliminar.length > 1) {
                            mostrarMensaje(1, 'Los indicadores han sido eliminados satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'El indicador ha sido eliminado satisfactoriamente.');
                        }
                        stAdicIndicadoresEjecucionPlanif.load();
                        if (cmbPlanes.getValue() != null && cmbPlanes.getValue() != "" && cmbPlanes.getValue() != undefined)
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
        if (filasmodificadas[i].data.iddesviacionnivelactividaddemanda != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    iddesviacionnivelactividaddemanda: filasmodificadas[i].data.iddesviacionnivelactividaddemanda
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal,
                    iddesviacionnivelactividaddemanda: filasmodificadas[i].data.iddesviacionnivelactividaddemanda
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
        callback: function (options, success, response) {
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
        if (filasmodificadas[i].data.iddesviacionnivelactividaddemanda != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal.format('d/m/Y'),
                    iddesviacionnivelactividaddemanda: filasmodificadas[i].data.iddesviacionnivelactividaddemanda
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadrealxdesviacion,
                    fecha: filasmodificadas[i].data.fechareal,
                    iddesviacionnivelactividaddemanda: filasmodificadas[i].data.iddesviacionnivelactividaddemanda
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
        callback: function (options, success, response) {
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

        if (filasmodificadas[i].data.idcontrolejecucionnivelactividaddemanda != undefined) {
            if (filasmodificadas[i].modified.fechareal != undefined) {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadreal,
                    fecha: filasmodificadas[i].data.fechareal.format('d-m-Y'),
                    idcontrolejecucionnivel: filasmodificadas[i].data.idcontrolejecucionnivelactividaddemanda
                })
            } else {
                campos_modificados.push({
                    nivelactividadreal: filasmodificadas[i].data.nivelactividadreal,
                    fecha: filasmodificadas[i].data.fechareal,
                    idcontrolejecucionnivel: filasmodificadas[i].data.idcontrolejecucionnivelactividaddemanda
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
        callback: function (options, success, response) {
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
        elementos_eliminar[i] = elementos_sel[i].data.iddesviacionnivelactividaddemanda;
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
                callback: function (options, success, response) {
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
        elementos_eliminar[i] = elementos_sel[i].data.iddesviacionnivelactividaddemanda;
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
                callback: function (options, success, response) {
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
        elementos_eliminar[i] = elementos_sel[i].data.idcontrolejecucionnivelactividaddemanda;
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
                callback: function (options, success, response) {
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

//---------------------------------------------------------------------

function actualizarArbol(arbol, valor) {
    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.getSelectionModel().getSelectedNode().reload({
                params: {
                    valor: valor
                }
            });
        }
    } else
        arbol.root.reload({
            params: {
                valor: valor
            }
        });
}

//----------------------------------------- GRAFICAS---------------------------------------

function crearGraficadinamica(valor, tab) {

    Ext.ns('Ext.ux.layout');
    Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
        monitorResize: true,
        isValidParent: function (c, target) {
            return c.getEl().dom.parentNode == this.innerCt.dom;
        },
        onLayout: function (ct, target) {
            var rs = ct.items.items, len = rs.length, r, i;
            if (!this.innerCt) {
                target.addClass('ux-row-layout-ct');
                this.innerCt = target.createChild({cls: 'x-row-inner'});
            }
            this.renderAll(ct, this.innerCt);
            var size = target.getViewSize();
            if (size.width < 1 && size.height < 1) {
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

    barY = 'Importe';
    idsmodelos = '';
    uridtnD = 1;
    uridtnF = 0;
    ordenf = 1;
    ordend = 1;

    if (valor == 1) {
        tipo = 'column';
        tipod = 'column';
        ancho = '50%';
        titulow = 'Ejecuci\xF3n global por entidad';
        urlGrafica = 'graficaEjecucionglobalxentidad';
        titgraf = 'Ejecuci\xF3n global por entidad';

    }



    if (valor == 1 || valor == 3 || valor == 4 || valor == 41 || valor == 7 || valor == 5 || valor == 51 || valor == 6 || valor == 61 || valor == 31) {

        panelDiagBarra = new Ext.Panel({
            id: 'containerDiagBarra',
            layout: 'fit',
            region: 'center',
            width: ancho,
            html: '<div id="containerDiagBarra" margin: 0 auto"></div>'
        });

        if (valor == 1 || valor == 5 || valor == 6 || valor == 61 || valor == 51)
            panelDiagBarraD = new Ext.Panel({
                id: 'containerDiagBarraD',
                layout: 'fit',
                width: ancho,
                region: 'east',
                html: '<div id="containerDiagBarraD" margin: 0 auto"></div>'
            });
    }



    if (valor == 1) {
        panelGeneral = new Ext.Panel({
            layout: 'border',
            items: [panelDiagBarra]
        });
    }

    _this.onTop = new Ext.WindowGroup;
    _this.onTop.zseed = 90000;

    WinGenerica = new Ext.Window({
        layout: 'fit',
        title: titulow,
        closable: true,
        graggable: false,
        // manager: _this.onTop,
        maximized: true,
        modal: true,
        items: [panelGeneral]
    });

    WinGenerica.show();

    subttitgraf = '';
    if (valor != 2)
        Grafica(urlGrafica, valor, tab, tipo, titgraf, subttitgraf, barY, idsmodelos, uridtnF, ordenf);

    if (valor == 2 || valor == 1 || valor == 5 || valor == 6 || valor == 61 || valor == 51) {
        GraficaD(urlGraficaD, valor, tab, tipod, titgrafD, subttitgraf, barY, uridtnD, ordend);
    }

    if (valor == 2) {
        GraficaT(urlGraficaT, valor, tab, tipo, titgrafT, subttitgraf, barY, idsmodelos);
    }
}

function Grafica(urlGrafica, valor, tab, tipo, titgraf, subttitgraf, barY, idsmodelos, uridtnF, ordenf) {

    Ext.Ajax.request({
        url: urlGrafica,
        method: 'POST',
        params: {
            identidad: identidadselected,
            idejercicio: cmbEjercicio.getValue(),
            idmodelo: cmbPlanes.getValue(),
            idsmodelos: idsmodelos,
            esHoja: esHoja,
            orden: ordenf,
            tipo: tab,
            uri: uridtnF
        },
        callback: function (options, success, response) {
            resp = Ext.decode(response.responseText);
            if (valor == 2 || valor == 1)
                ser = [{
                        colorByPoint: true,
                        data: resp.data
                    }];
            if (valor == 3 || valor == 4 || valor == 41 || valor == 5 || valor == 51 || valor == 6 || valor == 61 || valor == 7 || valor == 31) {
                ser = resp.data;
            }
            subttitgraf = '<b>Entidad: ' + denomentidadselected + '</b>';

            if (valor == 2 || valor == 1) {
                $('#containerDiagBarra').highcharts({
                    chart: {
                        height: panelDiagBarra.getInnerHeight(),
                        type: tipo,
                        zoomType: 'xy'
                    },
                    title: {
                        text: titgraf
                    },
                    subtitle: {
                        text: subttitgraf
                    },
                    yAxis: {
                        title: {
                            text: barY
                        }
                    }, plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            },
                            shadow: true
                        },
                        column: {
                            pointPadding: 0.2
                        }
                    }, tooltip: {
                        pointFormat: '<b>' + barY + ': {point.y}</b> '
                    },
                    xAxis: {
                        categories: resp.categorias
                    },
                    credits: {
                        enabled: false
                    }
                    ,
                    legend: {
                        enabled: false
                    },
                    series: ser
                });
            }
            if (valor == 3 || valor == 4 || valor == 41 || valor == 5 || valor == 51 || valor == 6 || valor == 61 || valor == 31) {
                $('#containerDiagBarra').highcharts({
                    chart: {
                        height: panelDiagBarra.getInnerHeight(),
                        type: tipo,
                        zoomType: 'xy'
                    },
                    title: {
                        text: titgraf
                    },
                    subtitle: {
                        text: subttitgraf
                    },
                    yAxis: {
                        title: {
                            text: barY
                        }
                    }, plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            },
                            shadow: true
                        },
                        column: {
                            pointPadding: 0.2
                        }
                    },
                    xAxis: {
                        categories: resp.categorias
                    },
                    credits: {
                        enabled: false
                    }
                    ,
                    legend: {
                        enabled: true
                    },
                    series: ser
                });
            }
            if (valor == 7) {
                $('#containerDiagBarra').highcharts({
                    chart: {
                        height: panelDiagBarra.getInnerHeight(),
                        zoomType: 'xy'
                    },
                    title: {
                        text: titgraf
                    },
                    subtitle: {
                        text: subttitgraf
                    },
                    yAxis: {
                        title: {
                            text: barY
                        }
                    },
                    xAxis: {
                        categories: resp.categorias
                    }, plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                            },
                            shadow: true
                        },
                        column: {
                            pointPadding: 0.2
                        }
                    },
                    credits: {
                        enabled: false
                    }
                    ,
                    legend: {
                        enabled: true
                    },
                    series: resp.data
                });

            }

        }
    });

}

function GraficaD(urlGraficaD, valor, tab, tipod, titgrafD, subttitgraf, barY, uridtnD, ordend) {

    Ext.Ajax.request({
        url: urlGraficaD,
        method: 'POST',
        params: {
            identidad: identidadselected,
            idejercicio: cmbEjercicio.getValue(),
            uri: 1,
            esHoja: esHoja,
            uri: uridtnD,
                    orden: ordend,
            tipo: tab
        },
        callback: function (options, success, response) {
            resp = Ext.decode(response.responseText);
            if (valor == 1) {
                if (tab == 'plan') {
                    ser = [{
                            colorByPoint: true,
                            data: resp.data
                        }];
                    enb = false;
                } else {
                    if (tab == 'activ') {
                        ser = resp.data;
                        enb = true;
                    }
                }

            }
            if (valor == 5 || valor == 6 || valor == 61 || valor == 51) {
                disenab = true;
                if (valor == 5 || valor == 51)
                    if (tab == 'activ')
                        disenab = false;
                ser = resp.data;
            }
            subttitgraf = '<b>Entidad: ' + denomentidadselected + '</b>';

            if (valor == 5 || valor == 6 || valor == 61 || valor == 51) {
                $('#containerDiagBarraD').highcharts({
                    chart: {
                        height: panelDiagBarraD.getInnerHeight(),
                        type: tipod,
                        zoomType: 'xy'
                    },
                    title: {
                        text: titgrafD
                    },
                    subtitle: {
                        text: subttitgraf
                    },
                    yAxis: {
                        title: {
                            text: barY
                        }
                    }, plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            },
                            shadow: true
                        },
                        column: {
                            pointPadding: 0.2
                        }
                    },
                    xAxis: {
                        categories: resp.categorias
                    },
                    credits: {
                        enabled: false
                    }
                    ,
                    legend: {
                        enabled: disenab
                    },
                    series: ser
                });
            }


            if (valor == 1) {
                $('#containerDiagBarraD').highcharts({
                    chart: {
                        height: panelDiagBarraD.getInnerHeight(),
                        type: tipod,
                        zoomType: 'xy'
                    },
                    title: {
                        text: titgrafD
                    },
                    subtitle: {
                        text: subttitgraf
                    },
                    yAxis: {
                        title: {
                            text: barY
                        }
                    }, plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            },
                            shadow: true
                        },
                        column: {
                            pointPadding: 0.2
                        }
                    },
                    xAxis: {
                        categories: resp.categorias
                    }, tooltip: {
                        pointFormat: '<b>' + barY + ': {point.y}</b> '
                    },
                    credits: {
                        enabled: false
                    }
                    ,
                    legend: {
                        enabled: enb
                    },
                    series: ser
                });
            }
            if (valor == 2) {
                $('#containerDiagBarraD').highcharts({
                    chart: {
                        height: panelDiagBarraT.getInnerHeight(),
                        zoomType: 'xy'
                    },
                    title: {
                        text: titgrafD
                    },
                    subtitle: {
                        text: subttitgraf
                    },
                    yAxis: {
                        title: {
                            text: barY
                        }
                    },
                    xAxis: {
                        categories: resp.categorias
                    }, plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                            },
                            shadow: true
                        },
                        column: {
                            pointPadding: 0.2
                        }
                    },
                    credits: {
                        enabled: false
                    }
                    ,
                    legend: {
                        enabled: true
                    },
                    series: resp.data
                });

            }
        }
    });
}
function generarReporte() {
    /////////////////reportes
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
            load: function (t, n, e) {
                cmbEjercicioreporte.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        }
    });
    cmbEjercicioreporte = new Ext.form.ComboBox({
        width: 200,
        id: 'idejercicioreporte',
        store: stCbejercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        typeAhead: true,
        mode: 'local',
        disabled: false,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        fieldLabel: 'Ejercicio',
        // anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function () {
                stPlanes.baseParams.identidad = identidadselected;
                stPlanes.baseParams.idejercicio = cmbEjercicioreporte.getValue();
                stPlanes.baseParams.isLeaf = esHoja;
                stPlanes.load();
                filasPlan = [];
                filasActv = [];
                gpNivelesActividadesEjecucionPlanif.getStore().reload();
            }
        }
    });
    this.stidcbCentroBalancee = new Ext.data.Store({
        autoLoad: true,
        id: 'storeCentroBalance',
        url: 'listarCentroBalance',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'centrobalance'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'identidad'
            }])
    });
    this.stcbOrganoo = new Ext.data.Store({
        autoLoad: true,
        id: 'stcbOrganoo',
        url: 'listarOrganos',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idorganosatisface'
            }, {
                name: 'denominacion'
            }])
    });
    this.idcbCentroBalancee = new Ext.ux.form.LovCombo({
        id: 'ididcbCentroBalancee',
        store: _this.stidcbCentroBalancee,
        valueField: 'identidad',
        hiddenName: 'identidad',
        displayField: 'centrobalance',
        mode: 'local',
        //allowBlank: false,
        width: 180,
        editable: true,
        triggerAction: 'all',
        fieldLabel: 'Centro de Balance',
        emptyText: 'Centro de Balance',
        loadingText: 'Cargando...',
        bodyStyle: 'padding: 0 0 0'
    });
    this.cbOrganoo = new Ext.ux.form.LovCombo({
        id: 'idcbOrganoo',
        store: _this.stcbOrganoo,
        valueField: 'idorganosatisface',
        hiddenName: 'idorganosatisface',
        displayField: 'denominacion',
        mode: 'local',
        //allowBlank: false,
        width: 200,
        editable: true,
        triggerAction: 'all',
        fieldLabel: 'OACE',
        emptyText: 'OACE',
        loadingText: 'Cargando...',
        bodyStyle: 'padding: 0 0 0'
    });
    this.btnAceptarRep = new Ext.Button({
        text: 'Aceptar',
        iconCls: 'aceptar',
        tooltip: 'Aceptar',
        handler: function () {
            verReportesEjecucion()
        }
    });

    this.btnCancelarRep = new Ext.Button({
        text: 'Cancelar',
        iconCls: 'cancelar',
        tooltip: 'Cancelar',
        handler: function () {
            Ext.getCmp('winConfigReporte').destroy();
            Ext.getCmp('idcbOrganoo').setValue('');
            Ext.getCmp('ididcbCentroBalancee').setValue('');
        }
    });
    this.fmreporte = new Ext.form.FormPanel({
        id: 'idfmreporteejec',
        width: 700,
        height: 250,
        frame: true,
        region: "center",
        border: false,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .4,
                        layout: 'form',
                        items: [cmbEjercicioreporte, _this.cbOrganoo]
                    }, {
                        columnWidth: .4,
                        layout: 'form',
                        items: [_this.idcbCentroBalancee]
                    }
                ]
            }
        ]
    });
    this.winReporteEjec = new Ext.Window({
        title: 'Configurar reporte',
        id: 'winConfigReporte',
        width: 500,
        height: 200,
        draggable: true,
        closable: true,
        constrain: true,
        resizable: false,
        modal: true,
        closeAction: 'destroy',
        listeners: {
            destroy: function () {
                Ext.getCmp('winConfigReporte').destroy();
                Ext.getCmp('idcbOrganoo').setValue('');
                Ext.getCmp('ididcbCentroBalancee').setValue('');
            }
        },
        items: [_this.fmreporte],
        buttons: [_this.btnCancelarRep, _this.btnAceptarRep]
    }).show();

}
function verReportesEjecucion() {

    var idejercicio = cmbEjercicioreporte.getValue();
    //  var mes = _this.cbMesRep.getValue();
    var no = numero;
    var centrobalance = _this.idcbCentroBalancee.getValue();

    var cbname = _this.idcbCentroBalancee.getRawValue();
    //var reporte = _this.cbReporte.getValue();
    var idorgano = _this.cbOrganoo.getValue();
    var organo = _this.cbOrganoo.getRawValue();
    var win = window.open('reporteEjecucion?idejercicio=' +
            idejercicio + '&idorgano=' + idorgano + '&organo=' + organo + '&numero=' + no + '&centrobalance=' + centrobalance + '&cbname=' + cbname);
    // _this.winReporteEjec.hide();
    Ext.getCmp('winConfigReporte').destroy();

}
function GraficaT(urlGraficaT, valor, tab, tipo, titgrafT, subttitgraf, barY, idsmodelos) {


    Ext.Ajax.request({
        url: urlGraficaT,
        method: 'POST',
        params: {
            identidad: identidadselected,
            idejercicio: cmbEjercicio.getValue(),
            uri: 0,
            idsmodelos: idsmodelos,
            esHoja: esHoja,
            tipo: tab
        },
        callback: function (options, success, response) {
            resp = Ext.decode(response.responseText);

            subttitgraf = '<b>Entidad: ' + denomentidadselected + '</b>';
            if (valor == 3)
                $('#containerDiagBarraT').highcharts({
                    chart: {
                        height: panelDiagBarraT.getInnerHeight(),
                        type: tipo,
                        zoomType: 'xy'
                    },
                    title: {
                        text: titgrafT
                    },
                    subtitle: {
                        text: subttitgraf
                    },
                    yAxis: {
                        title: {
                            text: barY
                        }
                    }, plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                            },
                            shadow: true
                        },
                        column: {
                            pointPadding: 0.2
                        }
                    },
                    xAxis: {
                        categories: resp.categorias
                    },
                    credits: {
                        enabled: false
                    }
                    ,
                    legend: {
                        enabled: true
                    },
                    series: resp.data
                });
            if (valor == 2)
                $('#containerDiagBarraT').highcharts({
                    chart: {
                        height: panelDiagBarraT.getInnerHeight(),
                        zoomType: 'xy'
                    },
                    title: {
                        text: titgrafT
                    },
                    subtitle: {
                        text: subttitgraf
                    },
                    yAxis: {
                        title: {
                            text: barY
                        }
                    },
                    xAxis: {
                        categories: resp.categorias
                    }, plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                            },
                            shadow: true
                        },
                        column: {
                            pointPadding: 0.2
                        }
                    },
                    credits: {
                        enabled: false
                    }
                    ,
                    legend: {
                        enabled: true
                    },
                    series: resp.data
                });
        }
    });
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function crearToolTipdenominacion(v, m, record) {
    m.attr = 'ext:qtip="<b>Sustituye a:</b> ' + record.data.sustituidos + '"';
    return v;
}
function crearToolTipdenomSust(v, m, record) {
    if (record.data.indsustituido == null) {
        m.attr = 'ext:qtip="Sin sustituir"';
    } else {
        m.attr = 'ext:qtip="<b>Sustituido por:</b> ' + record.data.indsustituido + '"';
    }
    return v;
}