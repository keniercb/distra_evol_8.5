var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('modelosestadisticos', cargarModelosEstadisticosInterfaz);

var cbEjercicio, tabsModelos, varidejercicio, stEjerciciosInterEmiEconomia;
var mymask;
function cargarModelosEstadisticosInterfaz() {

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    mymask.show();
    cargarInterEmiEconomia();
    cargarplanInterEmi();
    cargarplanEconomia();
    cargarproduccionesCaptadas();
    cargarproduccionesAtrasadas();
    cargarproduccionesSobreCump();
    cargarplanVsReal();
    cargarResumenProgramas();
    cargarresumenDestinos();
    cargarInterfaz();
}

function cargarInterfaz() {

    stEjerciciosInterEmiEconomia = new Ext.data.Store({
        url: 'listarEjercicios',
        listeners: {
            beforeload: function (st, opt) {
            },
            load: function (t, n, e) {
                if (t.reader.jsonData.idejercicioactual != undefined) {
                    cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                    //antes de pintar voy a asegurarme de que si los stores del tab donde 
                    //estoy parada aun no se han cargado se carguen antes de pintar
                    cargandoStores();
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stEjerciciosInterEmiEconomia,
        fieldLabel: 'Años', // perfil.etiquetas.lbEjercicios,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        width: 100,
        listeners: {
            select: function (cb, rec, index) {
//                pintar(cbEjercicio.getValue());
                tabSelected = tabsModelos.getActiveTab();
                if (tabSelected.id == 'tabProduccionesCaptadas') {
//                    mymask.show();
                    produccionesCaptadas(cbEjercicio.getValue());
//                    mymask.hide();
                }
            }
        }
    });

    tabsModelos = new Ext.TabPanel({
        activeTab: 0,
        enableTabScroll: true,
        defaults: {autoScroll: true},
        id: 'tabsModelos',
        region: 'center',
        listeners: {
            tabchange: function (panel, tab) {
                tab.doLayout(true);
            }
        }
    });

    tabsModelos.add({
        id: 'tabInterEmiEconomia',
        activeTab: 0,
        html: "<div id = 'interEmiEconomia_contenedor' ></div>",
        title: perfil.etiquetas.lbInterEmiEconomia,
        layout: 'fit',
        items: [fpInterEmiEconomia, pGenInterEmiEconomia],
        //bbar: ['->', btnGraficarInterEmiEconomia],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });
    tabsModelos.add({
        id: 'tabPlanInterEmi',
        activeTab: 1,
        html: "<div id = 'planInterEmi_contenedor' ></div>",
        title: perfil.etiquetas.lbPlanInterEmi,
        layout: 'fit',
        items: [fpPlanInterEmi, pGeneral],
        // bbar: ['->', btnGraficarInterEmi],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });
    tabsModelos.add({
        id: 'tabPlanEconomia',
        activeTab: 2,
        html: "<div id = 'PlanEconomia_contenedor' ></div>",
        title: perfil.etiquetas.lbPlanEconomia,
        layout: 'fit',
        items: [fpPlanEconomia, pGenPlanEconomia],
//        bbar: ['->', btnGraficarPlanEconomia],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });
    tabsModelos.add({
        id: 'tabProduccionesCaptadas',
        activeTab: 3,
        html: "<div id = 'produccionesCaptadas_contenedor' ></div>",
        title: perfil.etiquetas.lbProduccionesCaptadas,
        layout: 'border',
        items: [pGenproduccionesCaptadas1, pGenproduccionesCaptadas2],
//        bbar: ['->', btnGraficarProduccionesCaptadas],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });
    tabsModelos.add({
        id: 'tabProduccionesAtrasadas',
        activeTab: 4,
        html: "<div id = 'produccionesAtrasadas_contenedor' ></div>",
        title: perfil.etiquetas.lbProduccionesAtrasadas,
        layout: 'fit',
        items: [fpProduccionesAtrasadas, pGenProduccionesAtrasadas],
        // bbar: ['->', btnGraficarProduccionesAtrasadas],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });
    tabsModelos.add({
        id: 'tabProduccionesSobreCump',
        activeTab: 5,
        html: "<div id = 'produccionesSobreCump_contenedor' ></div>",
        title: perfil.etiquetas.lbProduccionesSobreCump,
        layout: 'fit',
        items: [fpProduccionesSobreCump, pGenProduccionesSobreCump],
//        bbar: ['->', btnGraficarProduccionesSobreCump],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });
    tabsModelos.add({
        id: 'tabPlanVsReal',
        activeTab: 6,
        html: "<div id = 'planVsReal_contenedor' ></div>",
        title: perfil.etiquetas.lbPlanVsReal,
        layout: 'fit',
        items: [fpPlanVsReal, pPlanVsRealMes, pGenplanVsReal],
//        bbar: ['->', btnGraficarPlanVsReal],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });
    tabsModelos.add({
        id: 'tabResumenProgramas',
        activeTab: 7,
        html: "<div id = 'resumenProgramas_contenedor' ></div>",
        title: perfil.etiquetas.lbResumenProgramas,
        layout: 'fit',
        items: [fpResumenProgramas, pGeneralProgramas],
//        bbar: ['->', btnGraficarProgramas],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });

    tabsModelos.add({
        id: 'tabResumenDestinos',
        activeTab: 8,
        html: "<div id = 'resumenDestinos_contenedor' ></div>",
        title: perfil.etiquetas.lbResumenDestinos,
        layout: 'fit',
        items: [fpResumenDestinos, pGeneralDestinos],
//        bbar: ['->', btnGraficarDestinos],
        listeners: {
            activate: function (p) {
                if (cbEjercicio.getValue() != '') {
                    cargandoStores();
                }
            }
        }
    });

    btnAyudaModelosEstadisticos = new Ext.Toolbar.Button({
        id: 'btnAyudaModelosEstadisticos',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbAyuda,
        tooltip: perfil.etiquetas.lbAyuda
    });

    panelView = new Ext.Panel({
        layout: 'fit',
        tbar: ['Año: ', cbEjercicio, '->', btnAyudaModelosEstadisticos],
        items: [tabsModelos]
    });
    myViewModelosEstadisticos = new Ext.Viewport({
        layout: 'fit',
        items: [panelView]
    });
    stEjerciciosInterEmiEconomia.reload();

}


function cargandoStores() {
    mymask.show();
    tabSelected = tabsModelos.getActiveTab();
    if (tabSelected.id == 'tabInterEmiEconomia') {
        if (storesCargadosInterEmiEcon == 2) {
            stPeriodoInterEmiEcon.reload();
        } else {
            btnGraficarInterEmiEconomia.enable();
            mymask.hide();
            //  pintar(cbEjercicio.getValue());
        }
        storesCargadosInterEmiEcon = 3;

    }
    if (tabSelected.id == 'tabPlanInterEmi') {
        if (storesCargadosPlanInterEmi == 2)
            stEntidadesUIMplanInterEmi.reload();
        else {
            btnGraficarInterEmi.enable();
//            pintar(cbEjercicio.getValue());
            mymask.hide();
        }
        storesCargadosPlanInterEmi = 3;
    }
    if (tabSelected.id == 'tabPlanEconomia') {
        if (storesCargadosPlanEconomia == 2)
            stPeriodoPlanEconomia.reload();
        else {
            btnGraficarPlanEconomia.enable();
            //pintar(cbEjercicio.getValue());
            mymask.hide();
        }
        storesCargadosPlanEconomia = 3;
    }
    if (tabSelected.id == 'tabProduccionesCaptadas') {
//        btnGraficarProduccionesCaptadas.enable();
//        pintar(cbEjercicio.getValue());
        mymask.show();
        produccionesCaptadas(cbEjercicio.getValue());
        mymask.hide();
    }
    if (tabSelected.id == 'tabProduccionesAtrasadas') {
        if (storesCargadosAtrasadas == 2)
            stProgramasproduccionesAtrasadas.reload();
        else {
            btnGraficarProduccionesAtrasadas.enable();
//            pintar(cbEjercicio.getValue());
            mymask.hide();
        }
        storesCargadosAtrasadas = 3;
    }
    if (tabSelected.id == 'tabProduccionesSobreCump') {
        if (storesCargadosSobreCump == 2)
            stProgramasSobreCump.reload();
        else {
            btnGraficarProduccionesSobreCump.enable();
//            pintar(cbEjercicio.getValue());
            mymask.hide();
        }
        storesCargadosSobreCump = 3;
    }
    if (tabSelected.id == 'tabPlanVsReal') {
        if (storesCargadosplanVsReal == 2)
            stEntidadesClientesplanVsReal.reload();
        else {
            btnGraficarPlanVsReal.enable();
//            pintar(cbEjercicio.getValue());
            mymask.hide();
        }
        storesCargadosplanVsReal = 3;
    }
    if (tabSelected.id == 'tabResumenProgramas') {
        if (storesCargadosProgramas == 2)
            stProgramasResumenProgramas.reload();
        else {
            btnGraficarProgramas.enable();
//            pintar(cbEjercicio.getValue());
            mymask.hide();
        }
        storesCargadosProgramas = 3;
    }
    if (tabSelected.id == 'tabResumenDestinos') {
        if (storesCargadosDestinos == 2)
            stProgramasResumenDestinos.reload();
        else {
            btnGraficarDestinos.enable();
//            pintar(cbEjercicio.getValue());
            mymask.hide();
        }
        storesCargadosDestinos = 3;
    }


}
//function pintar(varidejercicio) {
//    var tab = tabsModelos.getActiveTab();
//    if (tab != null) {
//        switch (tab.id) {
//            case 'tabInterEmiEconomia':    
//                console.log(5);
//                btnGraficarInterEmiEconomia.enable();
//                //interEmiEconomia(varidejercicio);
//                break;
//            case 'tabPlanInterEmi':
//                btnGraficarInterEmi.enable();
////                planInterEmi(varidejercicio);
//                break;
//            case 'tabPlanEconomia':
//                planEconomia(varidejercicio);
//                break;
//            case 'tabProduccionesCaptadas':
//                produccionesCaptadas(varidejercicio);
//                break;
//            case 'tabProduccionesAtrasadas':
//                produccionesAtrasadas(varidejercicio);
//                break;
//            case 'tabProduccionesSobreCump':
//                produccionesSobreCump(varidejercicio);
//                break;
//            case 'tabPlanVsReal':
//                planVsReal(varidejercicio);
//                break;
//            case 'tabResumenProgramas':
//                resumenProgramas(varidejercicio);
//                break;
//            case 'tabResumenDestinos':
//                resumenDestinos(varidejercicio);
//                break;
//        }
//    }
//}
