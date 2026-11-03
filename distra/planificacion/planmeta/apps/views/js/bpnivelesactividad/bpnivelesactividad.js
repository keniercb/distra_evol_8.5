var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();

UCID.portal.cargarEtiquetas('bpnivelesactividad', cargaretiquetas);
var etiqueta = new Object();
objci = {};
objci.acciones = [];
termine_cargar = false;
var Cmpcomplementario = new Utilidades.Cmp.CmpBotonesComplementarios({
    elemento: 'nivel'
});
var nodoEst = null;
var estadoEjercicio = null;
var idaprobacion_selecc = null;
var offsetNiveles = 0, beforeloadstNiveles = false;
var cbaccionesDWH = Cmpcomplementario.cbacciones;
//variables objetos de la interfaz
var cbEjercicio, stNiveles, gpNiveles, smDesgloses, filtrosNiveles,
        pgridDesgloses, pNiveles, fpAjustar, btnGraficoPlanif,
        btnGraficas, btnDesglosarNivel, pModelos, treePlanesParaActualizar;
var identidadselected = null, esrector = false, entidadEsOD, identidadorigen = null,
        identidaddestino = null, ajustarTodos = 0,
        btnGuardarDesglose, idtipomodelo = null,
        modeloselected = -1, idmodeloselected = -1, limpiar = 0, winImp = null;

//variables para el control de la hidden de los botones
var btnAprobarNivelesTodos_recurso = true, btnDesaprobarNivelesTodos_recurso = true,
        btnAprobarNivelesRectorTodos_recurso = true, btnDesaprobarNivelesRectorTodos_recurso = true,
        btnAprobarAjusteTodos_recurso = true, btnDesaprobarAjusteTodos_recurso = true,
        btnAprobarNiveles_recurso = true, btnDesaprobarNiveles_recurso = true,
        btnAprobarNivelesRector_recurso = true, btnDesaprobarNivelesRector_rector = true,
        btnAprobarAjuste_recurso = true, btnDesaprobarAjuste_recurso = true,
        btnAjustar_recurso = true, btnGuardarDesglose_recurso = true, btnEliminarDesglose_recurso = true
btnAdicionarDesglose_recurso = true, btnActualizarPlan_recurso = true, btnImportar_recurso = true;
function cargaretiquetas() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'btnAprobarNivelesTodos') {
                btnAprobarNivelesTodos_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnDesaprobarNivelesTodos') {
                btnDesaprobarNivelesTodos_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnAprobarNivelesRectorTodos') {
                btnAprobarNivelesRectorTodos_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnDesaprobarNivelesRectorTodos') {
                btnDesaprobarNivelesRectorTodos_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnAprobarAjusteTodos') {
                btnAprobarAjusteTodos_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnDesaprobarAjusteTodos') {
                btnDesaprobarAjusteTodos_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnAprobarNiveles') {
                btnAprobarNiveles_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnDesaprobarNiveles') {
                btnDesaprobarNiveles_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnAprobarNivelesRector') {
                btnAprobarNivelesRector_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnDesaprobarNivelesRector') {
                btnDesaprobarNivelesRector_rector = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnAprobarAjuste') {
                btnAprobarAjuste_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnDesaprobarAjuste') {
                btnDesaprobarAjuste_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnAjustar') {
                btnAjustar_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnGuardarDesglose') {
                btnGuardarDesglose_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnEliminarDesglose') {
                btnEliminarDesglose_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnAdicionarDesglose') {
                btnAdicionarDesglose_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnActualizarPlan') {
                btnActualizarPlan_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'btnImportar') {
                btnImportar_recurso = false;
            }
        }
        if (btnAprobarNivelesRectorTodos_recurso == false) {
            esrector = true;
        }
        if (!esrector) {
            cbaccionesDWH.hide();
        }
        initEtiquetas();
    }
    );
}
function cargarInterfaz() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiqueta.lbCargando
    });
    btnAyuda = new Ext.Button({
        id: 'idbtnAyudaNA',
        iconCls: 'ayuda',
        text: etiqueta.lbBtnAyuda,
        tooltip: etiqueta.lbTtAyuda
    });
    stComportamientos = new Ext.data.Store({
        url: 'cargarComportamientos',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                mymask.show();
            },
            load: function () {
                mymask.hide();
                stEspecialidadesTodas.reload();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    stEspecialidadesTodas = new Ext.data.Store({
        url: 'cargarEspecialidadesTodas',
        listeners: {
            beforeload: function () {
                mymask.show();
            },
            load: function () {
                mymask.hide();
                stModelos.reload();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idespecialidad'
        }, [{
                name: 'idespecialidad'
            }, {
                name: 'denespecialidad'
            }])
    });
    stModelos = new Ext.data.Store({
        url: 'listarModelos',
        listeners: {
            beforeload: function () {
                mymask.show();
            },
            load: function () {
                mymask.hide();
                stEjercicios.reload();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        }, [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }])
    });
    stEjercicios = new Ext.data.Store({
        url: 'cargarEjercicios',
        listeners: {
            beforeload: function () {
                mymask.show();
            },
            load: function (t, n, e) {
                mymask.hide();
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                estadoEjercicio = t.reader.jsonData.idejercicioactual.uridatosnomenclador;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stEjercicios,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: etiqueta.lbEmptyTextSeleccionar,
        loadingText: etiqueta.lbCargando,
        width: 140,
        listeners: {
            select: function (cb, rec, index) {
                modeloselected = -1;
                idmodeloselected = -1;
                estadoEjercicio = rec.data.uridatosnomenclador;
                if (identidadselected != null) {
                    stNiveles.reload();
                    treePlanesParaActualizar.getRootNode().reload();
                }
            }
        }
    });

    //Aprobar todos
    btnAprobarNivelesTodos = new Ext.Button({
        id: 'btnAprobarNivelesTodos',
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobarNivelesTodos,
        hidden: btnAprobarNivelesTodos_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 3;
            aprobarNivelesOAJusteTodos(3);
        }
    });
    btnDesaprobarNivelesTodos = new Ext.Button({
        id: 'btnDesaprobarNivelesTodos',
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobarNivelesTodos,
        hidden: btnDesaprobarNivelesTodos_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 1;
            aprobarNivelesOAJusteTodos(1);
        }
    });
    btnAprobarNivelesRectorTodos = new Ext.Button({
        id: 'btnAprobarNivelesRectorTodos',
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobarNivelesTodos + ' - Rector',
        hidden: btnAprobarNivelesRectorTodos_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 4;
            aprobarNivelesOAJusteTodos(4);
        }
    });
    btnDesaprobarNivelesRectorTodos = new Ext.Button({
        id: 'btnDesaprobarNivelesRectorTodos',
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobarNivelesTodos + ' - Rector',
        hidden: btnDesaprobarNivelesRectorTodos_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 1;
            aprobarNivelesOAJusteTodos(1);
        }
    });
    btnAprobarAjusteTodos = new Ext.Button({
        id: 'btnAprobarAjusteTodos',
        iconCls: 'icondistra-aprobar sisplanico-verde',
        tooltip: etiqueta.lbAprobarAjusteTodos,
        hidden: btnAprobarAjusteTodos_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 5;
            aprobarNivelesOAJusteTodos(5);
        }
    });
    btnDesaprobarAjusteTodos = new Ext.Button({
        id: 'btnDesaprobarAjusteTodos',
        iconCls: 'icondistra-desaprobar sisplanico-verde',
        tooltip: etiqueta.lbDesaprobarAjusteTodos,
        hidden: btnDesaprobarAjusteTodos_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 4;
            aprobarNivelesOAJusteTodos(4);
        }
    });

    //Aprobar simple
    btnAprobarNiveles = new Ext.Button({
        id: 'btnAprobarNiveles',
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobarNiveles,
        hidden: btnAprobarNiveles_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 3;
            aprobarNiveles(3, false);
        }
    });
    btnDesaprobarNiveles = new Ext.Button({
        id: 'btnDesaprobarNiveles',
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobarNiveles,
        hidden: btnDesaprobarNiveles_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 1;
            aprobarNiveles(1);
        }
    });
    btnAprobarNivelesRector = new Ext.Button({
        id: 'btnAprobarNivelesRector',
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobarNiveles + ' - Rector',
        hidden: btnAprobarNivelesRector_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 4;
            aprobarNiveles(4);
        }
    });
    btnDesaprobarNivelesRector = new Ext.Button({
        id: 'btnDesaprobarNivelesRector',
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobarNiveles + ' - Rector',
        hidden: btnDesaprobarNivelesRector_rector,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 1;
            aprobarNiveles(1);
        }
    });
    btnAprobarAjuste = new Ext.Button({
        id: 'btnAprobarAjuste',
        iconCls: 'icondistra-aprobar sisplanico-verde',
        tooltip: etiqueta.lbAprobarAjuste,
        hidden: btnAprobarAjuste_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 5;
            aprobarAjustes(5);
        }
    });
    btnDesaprobarAjuste = new Ext.Button({
        id: 'btnDesaprobarAjuste',
        iconCls: 'icondistra-desaprobar sisplanico-verde',
        tooltip: etiqueta.lbDesaprobarAjuste,
        hidden: btnDesaprobarAjuste_recurso,
        disabled: true,
        handler: function () {
            idaprobacion_selecc = 4;
            aprobarAjustes(4);
        }
    });

    //ajustar todos los niveles de la entidad seleccionada 
    var porcientotext = {
        xtype: 'tbtext',
        id: 'porcientotex',
        width: 50,
        height: 35,
        text: etiqueta.lbPorcientoAjustar
    };
    var espacio = {
        xtype: 'panel',
        id: 'idespacio',
        frame: false,
        border: false,
        width: 500,
        height: 30
    };
    var porciento = {
        xtype: 'numberfield',
        id: 'porciento',
        allowBlank: false,
        width: 100,
        height: 25,
        enableKeyEvents: true,
        fieldLabel: etiqueta.lbPorcientoAjustar,
        maskRe: /^([0-9-]+ ?[0-9-]*)+$/,
        maskReregex: /^([0-9-]+ ?[0-9-]*)+$/,
        maxValue: 100,
        minValue: -100,
        maxText: etiqueta.lbMinMaxText0a100,
        minText: etiqueta.lbMinMaxText0a100,
        listeners: {
            keyup: function (btn, e) {
                if (fpAjustar.getForm().isValid()) {
                    Ext.getCmp('btnCalcularAjuste').enable();
                } else {
                    Ext.getCmp('btnCalcularAjuste').disable();
                    Ext.getCmp('idajustar').disable();
                }
            }
        }
    };
    var importInicial = {
        xtype: 'textfield',
        id: 'importInicial',
        width: 110,
        height: 25,
        fieldLabel: etiqueta.lbImporteInicial,
        editable: false,
        disabled: true
    };
    var importFinal = {
        xtype: 'textfield',
        id: 'importFinal',
        width: 110,
        height: 25,
        fieldLabel: etiqueta.lbimportefinal,
        editable: false,
        disabled: true
    };
    var importAjustado = {
        xtype: 'textfield',
        id: 'importAjustado',
        width: 100,
        height: 25,
        fieldLabel: etiqueta.lbimporteajustado,
        editable: false,
        disabled: true
    };
    var pPorciento = new Ext.Panel({
        frame: false,
        border: false,
        width: 100,
        height: 25,
        items: [porciento]
    });
    btnCalcularAjuste = new Ext.Button({
        text: etiqueta.lbCalcular,
        id: 'btnCalcularAjuste',
        height: 15,
        disabled: true,
        iconCls: 'calcular',
        handler: function () {
            calcularAjuste();
        }
    });
    fpAjustar = new Ext.FormPanel({
        id: 'fpAjustar',
        autoHeight: true,
        width: 400,
        height: 2000,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                bodyStyle: "padding:0px 0px 0px 20px",
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:30px 0px 0px 20px",
                        items: [porcientotext]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:25px 0px 0px",
                        items: [pPorciento]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        frame: false,
                        align: 'left',
                        bodyStyle: "padding:25px 0px 0px",
                        items: [btnCalcularAjuste]
                    }
                ]
            }, {
                layout: 'column',
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacio]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacio]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacio]
                    }
                ]
            }, {
                layout: 'column',
                bodyStyle: "padding:0px 0px 0px 20px",
                columnWidth: .33,
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [importInicial]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [importAjustado]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [importFinal]
                    }]
            }
        ]
    });
    winRealizarAjuste = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        width: 400,
        height: 2000,
        title: etiqueta.lbRealizarAjuste,
        autoHeight: true,
        items: fpAjustar,
        buttons: [{
                iconCls: 'cancelar',
                tooltip: etiqueta.lbCerrarSinGuardar,
                tabIndex: 33,
                text: etiqueta.lbCancelar,
                handler: function () {
                    winRealizarAjuste.hide();
                    limpiarValores();
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                tooltip: etiqueta.lbCerrarYGuardar,
                tabIndex: 31,
                disabled: true,
                id: 'idajustar',
                text: etiqueta.lbAceptar,
                handler: function () {
                    winRealizarAjuste.hide();
                    insertarAjuste();
                    limpiarValores();
                }
            }],
        listeners: {
            'beforeshow': function () {
                Ext.getCmp('porciento').focus(true, 500);
            }
        }
    });
    btnAjustarTodos = new Ext.Button({
        id: 'btnAjustarTodos',
        iconCls: 'ajustar',
        tooltip: etiqueta.lbAjustarTodos,
        disabled: true,
        hidden: btnAjustar_recurso,
        handler: function () {
            ajustarTodos = 1;
            cargarImporteinicial();
        }
    });

    //copiar y pegar niveles
    btnCopiarNiveles = new Ext.Button({
        id: 'btnCopiarNiveles',
        iconCls: 'copiar',
        tooltip: etiqueta.lbBtnCopiarNiveles,
        disabled: true,
        handler: function () {
            copiarNiveles();
        }
    });
    btnPegarNiveles = new Ext.Button({
        id: 'btnPegarNiveles',
        iconCls: 'pegar',
        tooltip: etiqueta.lbBtnPegarNiveles,
        disabled: true,
        handler: function () {
            confirmarCopiarPegarNiveles();
        }
    });

    //panel de estructuras y acciones generales
    trEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    trEntidades.btnBuscar.setText("");
    trEntidades.btnLimpiar.setText("");
    trEntidades = trEntidades.items.items[0];
    trEntidades.getRootNode().expand();
    trEntidades.region = 'west';
    trEntidades.width = 300;
    trEntidades.split = true;
    trEntidades.getRootNode().text = etiqueta.lbEntidades;
    trEntidades.addListener('click', function (n) {
        nodoEst = n;
        if (n.id != 'Estructuras') {
            identidadselected = n.id;
            btnGraficoPlanif.enable();
            btnGraficas.actualizarParametros(nodoEst, 'NA');
            modeloselected = -1;
            idmodeloselected = -1;
            Ext.Ajax.request({
                url: 'entidadOD',
                params: {
                    identidad: identidadselected
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    entidadEsOD = responseData;
                    if (entidadEsOD == 1 || (!nodoEst.leaf && Ext.getCmp('chkGlobalNA').getValue() == true)) {
                        if (cbEjercicio.getValue() != null && cbEjercicio.getValue() != '' && cbEjercicio.getValue() != undefined
                                && identidadselected != null) {
                            stNiveles.reload();
                            treePlanesParaActualizar.getRootNode().reload();
                        }
                    } else {
                        mostrarMensaje(1, etiqueta.msjErrorNoEsOD);
                        stNiveles.loadData({"data": [], "total": 0});
                        limpiar = 1;
                        treePlanesParaActualizar.getRootNode().reload();

                    }
                    controlarObjetosNiveles();

                }
            });
            stNiveles.reload();
            pNiveles.enable();
        } else {
            cbaccionesDWH.disable();
            btnGraficoPlanif.disable();
            pModelos.disable();
            pNiveles.disable();
            treePlanesParaActualizar.getRootNode().reload();
            if (stNiveles.reader != undefined)
                stNiveles.loadData({"data": [], "total": 0});
        }
    });

    //boton para comp graficas
    btnGraficas = new Utilidades.Cmp.botonGrafica({
        idioma: etiqueta,
        nodeEntidad: nodoEst,
        componente: 'NA'
    });
    btnGraficoPlanif = btnGraficas.botonMenuGrafica();
    btnImportar = new Ext.Button({
        id: 'btnImportar',
        iconCls: 'importar',
        tooltip: etiqueta.lbImportarNiveles,
        disabled: true,
        hidden: btnImportar_recurso,
        handler: function () {
            initimportarniveles();
            estado_deshabilitado = pgridDesgloses.disabled;
            pgridDesgloses.enable();
            offsetdin = 0;
            winImportar(fpbuscar);
        }
    });
    pEstructuras = new Ext.Panel({
        title: etiqueta.lbEntidades,
        id: 'pEstructuras',
        region: 'west',
        collapsible: true,
        titleCollapse: true,
        split: true,
        width: 300,
        layout: 'fit',
        tbar: [btnGraficoPlanif, '-', cbaccionesDWH, btnImportar, '-', btnAprobarNivelesTodos, btnDesaprobarNivelesTodos, btnAprobarNivelesRectorTodos, btnDesaprobarNivelesRectorTodos, '-', btnAprobarAjusteTodos, btnDesaprobarAjusteTodos, btnAjustarTodos, '-', btnCopiarNiveles, btnPegarNiveles],
        items: trEntidades
    });

    //Botones de desglose
    btnDesglosarNivel = new Ext.Button({
        id: 'btnDesglosarNivel',
        iconCls: 'icondistra-desglose',
        tooltip: etiqueta.lbDesglosar,
        disabled: true,
        handler: function () {
            pgridDesgloses.enable();
            idtipomodelo = gpNiveles.getSelectionModel().getSelected().data.idtipomodelo;
            cargarconfgridDesglose(idtipomodelo);
        }
    });
    btnAdicionarDesglose = new Ext.Button({
        id: 'btnAdicionarDesglose',
        iconCls: 'adicionar',
        hidden: btnAdicionarDesglose_recurso,
        disabled: true,
        tooltip: etiqueta.lbAdicionarDesglose,
        handler: function () {
            adicionarDesglose();
        }
    });
    btnEliminarDesglose = new Ext.Button({
        id: 'btnEliminarDesglose',
        tooltip: etiqueta.lbEliminarDesglose,
        hidden: btnEliminarDesglose_recurso,
        disabled: true,
        iconCls: 'eliminar',
        handler: function () {
            eliminarDesgloseConfirmacion();
        }
    });
    btnGuardarDesglose = new Ext.Button({
        tooltip: etiqueta.lbGuardarDesglose,
        hidden: btnGuardarDesglose_recurso,
        id: 'btnGuardarDesglose',
        iconCls: 'guardar',
        handler: function () {
            guardarDesgloseConfirmacion();
        }
    });

    //Actualizar planes
    btnActualizarPlan = new Ext.Button({
        iconCls: 'planificar',
        disabled: true,
        tooltip: 'Actualizar planes',
        id: 'btnActualizarPlan',
        hidden: btnActualizarPlan_recurso,
        handler: function () {
            actualizarPlan();
        }
    });
    storelistadoactualizarplanes = new Ext.tree.TreeLoader({
        dataUrl: 'listarPlanModelo',
        listeners: {
            scope: this,
            beforeload: function (loader, treeNode) {
                loader.baseParams = {
                    identidad: identidadselected,
                    tipo: treeNode.attributes.tipo,
                    idejercicio: cbEjercicio.getValue(),
                    limpiar: limpiar
                };
            },
            load: function (loader, nodo, respuesta) {
                if (nodo.id == 0) {
                    nodo.expandChildNodes();
                }
                if (limpiar == 0)
                    pModelos.enable();
                limpiar = 0;
            }
        }
    });
    treePlanesParaActualizar = new Ext.tree.TreePanel({
        autoScroll: true,
        border: false,
        listeners: {
            click: function (n, e) {
                modeloselected = n;
                idmodeloselected = n.id;
                controlarObjetosNiveles();
                stNiveles.reload();
            }
        },
        loader: storelistadoactualizarplanes,
        root: {
            nodeType: 'async',
            id: '0',
            text: etiqueta.lbListadoPlanes,
            tipo: 0,
            leaf: false
        }
    });
    pModelos = new Ext.Panel({
        title: etiqueta.lbPlanes,
        disabled: true,
        id: 'pModelos',
        region: 'east',
        collapsible: true,
        titleCollapse: true,
        collapsed: true,
        split: true,
        width: 200,
        layout: 'fit',
        tbar: [btnActualizarPlan],
        items: treePlanesParaActualizar
    });
    //Objetos del gpNiveles
    btnGuardarNiveles = new Ext.Button({
        id: 'btnGuardarNiveles',
        iconCls: 'guardar',
        tooltip: etiqueta.lbGuardarNiveles,
        disabled: true,
        hidden: false,
        handler: function () {           
            guardarNiveles(stNiveles.modified);
        }
    });
    btnAjustar = new Ext.Button({
        id: 'btnAjustar',
        iconCls: 'ajustar',
        tooltip: etiqueta.lbAjustar,
        hidden: btnAjustar_recurso,
        disabled: true,
        handler: function () {
            ajustarTodos = 2;
            cargarImporteinicial();
        }
    });
    btnVerDetalle = new Ext.Button({
        id: 'btnVerDetalle',
        iconCls: 'ver',
        tooltip: etiqueta.lbVerDetalles,
        disabled: true,
        handler: function () {
            verDetalles();
        }
    });
    btnVerCalculosySalidas = new Ext.Button({
        id: 'btnVerCalculosySalidas',
        iconCls: 'calcular',
        tooltip: etiqueta.lbVerCalculosySalidas,
        disabled: true,
        handler: function () {
            verCalculosySalidas();
        }
    });
    btnLimpiarNiveles = new Ext.Button({
        id: 'btnLimpiarNiveles',
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiar,
        handler: function () {
            filtrosNiveles.clearFilters();
            identidadorigen = null;
            identidaddestino = null;
            idmodeloselected = -1;
            treePlanesParaActualizar.getRootNode().reload();
        }
    });
    mbExportar = new Ext.Toolbar.MenuButton({
        id: 'mbExportar',
        iconCls: 'exportar',
        tooltip: etiqueta.lbExportar,
        disabled: true,
        menu: {
            items: [{
                    id: 'btnExportarNiveles',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarNiveles,
                    disabled: false,
                    listeners: {
                        click: function () {
                            exportarNiveles(1, -1, -1);
                        }
                    }
                }, {
                    id: 'btnExportarDesgloses',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarDesgloses,
                    disabled: true,
                    listeners: {
                        click: function () {
                            winVentanaPlanes();
                        }
                    }
                }
            ]
        }
    });


    chkGlobal = new Ext.form.Checkbox({
        boxLabel: 'Global',
        id: 'chkGlobalNA',
        hidden: false,
        listeners: {
            check: function (ck, t) {
                stNiveles.reload();
                if (Ext.getCmp('chkGlobalNA').getValue() == true) {
                    limpiar = 1;
                    treePlanesParaActualizar.getRootNode().reload();
                } else {
                    limpiar = 0;
                    treePlanesParaActualizar.getRootNode().reload();
                }
            }
        }
    });
    stNiveles = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarNivelesActividad',
        listeners: {
            beforeload: function () {
                Ext.Ajax.timeout = 7200000;
                beforeloadstNiveles = true;
                cambiarTituloFiltrar(gpNiveles, filtrosNiveles, etiqueta.lbNivelesActividad);
                stNiveles.baseParams.start = offsetNiveles;
                stNiveles.baseParams.identidad = identidadselected;
                stNiveles.baseParams.hoja = nodoEst.leaf;
                stNiveles.baseParams.glob = chkGlobal.getValue();
                stNiveles.baseParams.idejercicio = cbEjercicio.getValue();
                stNiveles.baseParams.idmodelo = idmodeloselected;
            },
            load: function (options, success, response) {
                if (stNiveles.getCount() == 0) {
                    if (beforeloadstNiveles) {
                        if (filtrosNiveles.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, etiqueta.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, etiqueta.msgNoExistenDatos);
                        }
                    }
                } else {
                    upColorCellNivel();
                    upColorCellDesglose();
                }
                beforeloadstNiveles = false;
                controlarObjetosNiveles();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idespecialidad'
            }, {
                name: 'idcomportamiento'
            }, {
                name: 'nivelactividadautomatico'
            }, {
                name: 'nivelactividadmanual'
            }, {
                name: 'nivelactividad'
            }, {
                name: 'ajuste'
            }, {
                name: 'nivelactividadfinal'
            }, {
                name: 'importe'
            }, {
                name: 'importeajuste'
            }, {
                name: 'importefinal'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'idmodelo'
            }, {
                name: 'desglosada'
            }, {
                name: 'idtipomodelo'
            }
        ])
    });
    filtrosNiveles = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            },
            {
                type: 'listado',
                dataIndex: 'idespecialidad',
                idcombo: 'idcbEspecialidad',
                urlcb: 'cargarEspecialidadesTodas',
                valueFieldcb: 'idespecialidad',
                displayFieldcb: 'denespecialidad',
                idstore: 'idstEspecialidad'
            }, {
                type: 'list',
                dataIndex: 'idcomportamiento',
                options: [etiqueta.lbPropia,
                    etiqueta.lbCompartida,
                    etiqueta.lbDemandada]
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadautomatico'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadmanual'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividad'
            }, {
                type: 'numeric',
                dataIndex: 'ajuste'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadfinal'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'numeric',
                dataIndex: 'importeajuste'
            }, {
                type: 'numeric',
                dataIndex: 'importefinal'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [etiqueta.lbNo,
                    etiqueta.lbEspecialista,
                    etiqueta.lbRector,
                    etiqueta.lbAjuste]
            }, {
                type: 'listado',
                dataIndex: 'idmodelo',
                idcombo: 'idcbModelo',
                urlcb: 'listarModelos',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                idstore: 'idstModelo'
            }, {
                type: 'list',
                dataIndex: 'desglosada',
                options: [etiqueta.lbNo,
                    etiqueta.lbParcial,
                    etiqueta.lbSi]
            }]
    });
    smNiveles = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function () {
                controlarObjetosNiveles();
//                limpiarDesglose();
                pgridDesgloses.disable();

            },
            rowselect: function () {
                controlarObjetosNiveles();
            },
            rowdeselect: function () {
                controlarObjetosNiveles();
            }
        }
    });
    cmNiveles = new Ext.grid.ColumnModel([{
            header: etiqueta.lbCodigo,
            tooltip: etiqueta.lbCodigo,
            dataIndex: 'codigo',
            width: 90,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            dataIndex: 'denominacion',
            width: 200,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbDescripcion,
            tooltip: etiqueta.lbDescripcion,
            dataIndex: 'descripcion',
            width: 120,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbEspecialidad,
            tooltip: etiqueta.lbEspecialidad,
            dataIndex: 'idespecialidad',
            width: 100,
            renderer: renderEspecialidad

        }, {
            header: etiqueta.lbComportamiento,
            tooltip: etiqueta.lbComportamiento,
            dataIndex: 'idcomportamiento',
            width: 100,
            renderer: renderComportamiento
        }, {
            header: etiqueta.lbNivelAutomatico,
            tooltip: etiqueta.lbNivelAutomatico,
            dataIndex: 'nivelactividadautomatico',
            align: 'right',
            width: 100,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbNivelManual,
            tooltip: etiqueta.lbNivelManual,
            dataIndex: 'nivelactividadmanual',
            align: 'right',
            width: 100,
            renderer: crearToolTipNro,
            editor: new Ext.form.NumberField({
                maxLength: 14,
                decimalPrecision: 4,
                maxLengthText: etiqueta.lbMaxRequerido,
                allowNegative: false,
                enableKeyEvents: true,
                listeners: {
                    keypress: function (nf, e) {
                        if (e.getKey() == 100 || e.getKey() == 68)
                            nf.setValue(0);
                    }
                }
            })
        }, {
            header: etiqueta.lbNA,
            tooltip: etiqueta.lbNivelActividad,
            dataIndex: 'nivelactividad',
            align: 'right',
            width: 100,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbAjuste,
            tooltip: etiqueta.lbAjuste,
            dataIndex: 'ajuste',
            align: 'right',
            width: 100,
            renderer: crearToolTipNro,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                enableKeyEvents: true,
                decimalPrecision: 4,
                listeners: {
                    keypress: function (nf, e) {
                        if (e.getKey() == 13) {
                            var nivelact = smNiveles.getSelected().data.nivelactividad;
                            if (smNiveles.getSelected().data.idaprobacion == 4 && smNiveles.getSelected().data.comportamiento != 0 && !esrector
                                    && nivelact > 0 && entidadEsOD == 1 &&
                                    chkGlobal.getValue() == false) {
                                cmNiveles.setEditable(smNiveles.findColumnIndex('ajuste'), true);
                            } else {
                                cmNiveles.setEditable(smNiveles.findColumnIndex('ajuste'), false);
                            }
                        }
                    }
                }
            })
        }, {
            header: etiqueta.lbNAAjustado,
            tooltip: etiqueta.lbNivelActividadAjustado,
            dataIndex: 'nivelactividadfinal',
            align: 'right',
            width: 100,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbImporte,
            tooltip: etiqueta.lbImporte,
            dataIndex: 'importe',
            hidden: true,
            align: 'right',
            width: 100,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbImporteAjustado,
            tooltip: etiqueta.lbImporteAjustado,
            dataIndex: 'importeajuste',
            align: 'right',
            hidden: true,
            width: 100,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbImporteFinal,
            tooltip: etiqueta.lbImporteFinal,
            dataIndex: 'importefinal',
            align: 'right',
            hidden: true,
            width: 100,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbAprobacion,
            tooltip: etiqueta.lbAprobacion,
            dataIndex: 'idaprobacion',
            align: 'center',
            width: 80,
            renderer: renderAprobacion
        }, {
            header: etiqueta.lbPlan,
            tooltip: etiqueta.lbPlan,
            dataIndex: 'idmodelo',
            width: 100,
            renderer: renderModelo
        }, {
            header: etiqueta.lbDesglosada,
            tooltip: etiqueta.lbDesglosada,
            dataIndex: 'desglosada',
            align: 'center',
            width: 100,
            renderer: renderDesglosada
        }]);

    gpNiveles = new Ext.grid.EditorGridPanel({
        loadMask: {
            msg: etiqueta.lbEspere
        },
        title: etiqueta.lbNivelesActividad,
        store: stNiveles,
        plugins: filtrosNiveles,
        sm: smNiveles,
        cm: cmNiveles,
        region: 'center',
        clicksToEdit: 2,
        tbar: [{
                xtype: 'tbtext',
                text: etiqueta.lbEjercicio + ': '
            }, cbEjercicio, '-', btnGuardarNiveles, '-', btnDesglosarNivel,
            '-', btnAprobarNiveles, btnDesaprobarNiveles, btnAprobarNivelesRector, btnDesaprobarNivelesRector,
            '-', btnAjustar, btnAprobarAjuste, btnDesaprobarAjuste, '-', btnVerDetalle, btnVerCalculosySalidas, mbExportar, '-', chkGlobal],
        bbar: new Ext.PagingToolbar({
            store: stNiveles,
            displayInfo: true,
            items: ['-', btnLimpiarNiveles],
            listeners: {
                beforechange: function (p, e) {
                    offsetNiveles = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function (e) {

                if (btnGuardarNiveles.disabled) {
                    if (parseFloat(e.originalValue) != parseFloat(e.value)) {
                        btnGuardarNiveles.enable();
                    }
                }

            }
        }
    });

    pgridDesgloses = new Ext.Panel({
        id: 'pgridDesgloses',
        title: etiqueta.lbDesgloses,
        region: 'south',
        layout: 'fit',
        split: true,
        hidden: false,
        disabled: true,
        height: 180,
        tbar: [btnAdicionarDesglose, '-', btnEliminarDesglose, '-', btnGuardarDesglose]

    });
    pNiveles = new Ext.Panel({
        id: 'pNivelesActividad',
        layout: 'border',
        region: 'center',
        items: [gpNiveles, pgridDesgloses]
    });
    panelView = new Ext.Panel({
        id: 'panelView',
        layout: 'border',
        region: 'center',
        tbar: ['->', btnAyuda],
        items: [pEstructuras, pNiveles, pModelos]
    });

    myViewNivelesActividad = new Ext.Viewport({
        layout: 'fit',
        items: [panelView]
    });

}

function controlarObjetosNiveles() {
    btnAprobarNiveles.disable();
    btnDesaprobarNiveles.disable();
    btnAprobarNivelesRector.disable();
    btnDesaprobarNivelesRector.disable();
    btnAprobarAjuste.disable();
    btnDesaprobarAjuste.disable();
    btnVerDetalle.disable();
    btnVerCalculosySalidas.disable();

    btnDesglosarNivel.disable();
    btnAjustar.disable();

    btnImportar.disable();
    mbExportar.disable();
    Ext.getCmp('btnExportarDesgloses').disable();
    btnAprobarNivelesRectorTodos.disable();
    btnAprobarNivelesTodos.disable();
    btnAprobarAjusteTodos.disable();
    btnDesaprobarNivelesTodos.disable();
    btnDesaprobarNivelesRectorTodos.disable();
    btnDesaprobarAjusteTodos.disable();
    btnAjustarTodos.disable();
    cmNiveles.setEditable(cmNiveles.findColumnIndex('nivelactividadmanual'), false);
    cmNiveles.setEditable(cmNiveles.findColumnIndex('ajuste'), false);
    cbaccionesDWH.disable();
    btnActualizarPlan.disable();
    if (esrector) {
        btnCopiarNiveles.hide();
        btnPegarNiveles.hide();
    }
    if (chkGlobal.getValue() == false) {
        Ext.getCmp('btnExportarDesgloses').enable();
    }
    if (stNiveles.getCount() > 0) {
        mbExportar.enable();
        if (entidadEsOD == 1) {
            btnAprobarNivelesRectorTodos.enable();
            btnAprobarNivelesTodos.enable();
            btnAprobarAjusteTodos.enable();
            btnDesaprobarNivelesTodos.enable();
            btnDesaprobarNivelesRectorTodos.enable();
            btnDesaprobarAjusteTodos.enable();
            if (estadoEjercicio == 'elaboracion' && idmodeloselected != -1) {
                btnActualizarPlan.enable();
            }
        }
    }
    if (smNiveles.getSelections().length == 1) {
        btnVerDetalle.enable();
        if (parseFloat(smNiveles.getSelected().data.nivelactividadfinal) > 0 &&
                entidadEsOD == 1 && smNiveles.getSelected().data.idmodelo != null) {
            btnDesglosarNivel.enable();
        }
    }
    if (smNiveles.getSelections().length > 0) {
        btnVerCalculosySalidas.enable();
        btnAjustarTodos.disable();
    } else {
        if (chkGlobal.getValue() == false && stNiveles.getCount() > 0 && entidadEsOD == 1 && estadoEjercicio == 'elaboracion') {
            btnAjustarTodos.enable();
            btnCopiarNiveles.show();
            btnPegarNiveles.show();
            btnCopiarNiveles.enable();
            if (identidadselected == identidadorigen) {
                btnPegarNiveles.disable();
            }
        }
    }
    if (estadoEjercicio == 'elaboracion') {
        if (esrector) {
            cbaccionesDWH.enable();
        }
        if (chkGlobal.getValue() == false && entidadEsOD == 1) {
            btnImportar.enable();
            Ext.getCmp('btnExportarDesgloses').enable();
            if (smNiveles.getSelections().length > 0) {

                if (smNiveles.getSelections().length == 1) {
                    var aprobacion = smNiveles.getSelected().data.idaprobacion;
                    switch (aprobacion) {
                        case '1':
                            if (parseFloat(smNiveles.getSelected().data.nivelactividadfinal) > 0) {
                                btnAprobarNiveles.enable();
                            }
                            cmNiveles.setEditable(cmNiveles.findColumnIndex('nivelactividadmanual'), true);
                            break;
                        case '3':
                            btnDesaprobarNiveles.enable();
                            btnAprobarNivelesRector.enable();
                            break;
                        case '4':

                            if (esrector) {
                                btnDesaprobarNivelesRector.enable();
                                if (smNiveles.getSelected().data.ajuste != 0) {
                                    btnAprobarAjuste.enable();
                                }
                            } else {
                                btnAjustar.enable();
                                cmNiveles.setEditable(cmNiveles.findColumnIndex('ajuste'), true);
                            }
                            break;
                        case '5':
                            btnDesaprobarAjuste.enable();
                    }
                } else {
                    btnAprobarNiveles.enable();
                    btnDesaprobarNiveles.enable();
                    btnAprobarNivelesRector.enable();
                    btnDesaprobarNivelesRector.enable();
                    btnAprobarAjuste.enable();
                    btnDesaprobarAjuste.enable();
                    btnAjustar.enable();

                }
            }
        }
    } else {
        btnCopiarNiveles.hide();
        btnPegarNiveles.hide();
    }


}

function guardarNiveles() {
    var campos_modificados = [];
    var arrayNiveles = [];
    campos_modificados = stNiveles.modified;

    var guardarajuste = false;
    for (var i = 0; i < campos_modificados.length; i++) {

        dataMod = campos_modificados[i].modified.hasOwnProperty('ajuste') ? 'ajuste' : 'nivelManual';
        campos_modificados[i].data.campo_modif = dataMod;
        arrayNiveles.push(campos_modificados[i].data);
    }

    Ext.Ajax.request({
        url: 'actualizarNivActividad',
        params: {
            niveles: Ext.encode(arrayNiveles),
            identidad: identidadselected,
            idejercicio: cbEjercicio.getValue()
        },
        callback: function (options, success, response) {            
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 3) {
                mostrarMensaje(1, responseData.mensaje);
            }
            if (responseData.codMsgE == 1) {
                gpNiveles.getStore().reload();
                mostrarMensaje(1, etiqueta.lbGuardar);
                btnGuardarNiveles.disable();
            }
        }
    });
}

/*Metodos para exportar */
function exportarNiveles(tipo, idmodelo, modelo) {
    var win = window.open('exportar?identidad=' + identidadselected
            + '&text=' + trEntidades.getNodeById(identidadselected).text
            + '&idejercicio=' + cbEjercicio.getValue()
            + "&hoja=" + nodoEst.leaf
            + "&idmodelo=" + idmodelo
            + "&modelo=" + modelo
            + "&tipo=" + tipo
            + "&glob=" + chkGlobal.getValue()
            + '&filtros=' + Ext.encode(filtrosNiveles.getFilterData()));

    mascaraExportar(etiqueta.lbExportandoNA, etiqueta.lbEsperePorFavor, win);
}
function winVentanaPlanes() {
    stCbSeleccplan = new Ext.data.Store({
        url: 'listarModeloEntidad',
        listeners: {
            beforeload: function (st, n, e) {
                st.baseParams.identidad = identidadselected;
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }])
    });
    cbSeleccplan = new Ext.form.ComboBox({
        id: 'cbSeleccplan',
        fieldLabel: 'Planes',
        store: stCbSeleccplan,
        valueField: 'idmodelo',
        hiddenName: 'idmodelo',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: 'Seleccione un plan...',
        loadingText: 'Cargando...',
        anchor: '95%'
    });
    pSeleccPlan = new Ext.FormPanel({
        id: 'idSeleccPlan',
        labelAlign: 'top',
        frame: true,
        items: [cbSeleccplan]
    });
    winSeleccPlan = new Ext.Window({
        title: 'Planes',
        modal: true,
        id: 'idwinSeleccPlan',
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        width: 250,
        height: 130,
        items: [pSeleccPlan],
        buttons: [{
                iconCls: 'cancelar',
                tooltip: etiqueta.lbCerrarSinGuardar,
                text: etiqueta.lbCancelar,
                handler: function () {
                    winSeleccPlan.destroy();
                }
            }, {
                iconCls: 'aceptar',
                id: 'btnaceptarSeleccPlan',
                text: etiqueta.lbAceptar,
                tooltip: etiqueta.lbGuardarYCerrar,
                handler: function () {
                    exportarNiveles(2, cbSeleccplan.getValue(), cbSeleccplan.getRawValue());
                    winSeleccPlan.destroy();
                }
            }],
        listeners: {
            beforeshow: function () {
                stCbSeleccplan.load();
            }
        }
    });
    winSeleccPlan.show();
}

/*Metodos para aprobar y desaprobar niveles */
function aprobarNivelesOAJusteTodos(valor) {
    if (valor == 3 || valor == 4) {
        mostrarMensaje(2, etiqueta.msgSegAprobarTodosNivAct, aprobardesaprobartodos);
    } else {
        if (valor == 5) {
            mostrarMensaje(2, etiqueta.msgSegAprobarTodosAjustesNivAct, aprobardesaprobartodos);
        } else
            mostrarMensaje(2, etiqueta.msgSegDesaprobarTodosNivAct, aprobardesaprobartodos);
    }
}
function aprobardesaprobartodos(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'aprobarDesaprobarNivelTodos',
            params: {
                identidad: identidadselected,
                idaprobacion: idaprobacion_selecc,
                hoja: nodoEst.leaf,
                esrector: esrector,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 1) {
                    if (responseData.mensaje == 'aprobada')
                        mostrarMensaje(1, etiqueta.msgAprobandoTodosAct);
                    else
                        mostrarMensaje(1, etiqueta.msgDesaprobandoTodosAct);
                    stNiveles.reload();
                } else {
                    if (responseData.codMsgE == 2)
                    {
                        mostrarMensaje(1, etiqueta.msgNoSePuedeAprobarDesaprobarTodos)
                    } else
                        mostrarMensaje(1, etiqueta.msgErrorAction);
                }

            }
        });
    }
}
function aprobarNiveles(valor) {
    //mensages de salida
    var long = smNiveles.getSelections().length;
    var msgsalida = '';

    //seleccion multiple
    var recordsSel = gpNiveles.getSelectionModel().getSelections(), actaprobar = [];

    for (var i = 0; i < recordsSel.length; i++) {
        actaprobar.push(recordsSel[i].data.idactividad);
    }
    if (parseInt(valor) == 1) {
        if (long == 1) {
            msgsalida = etiqueta.msgSegDesaprobarNivAct1;
        } else {
            msgsalida = etiqueta.msgSegDesaprobarNivAct2;
        }
        mostrarMensaje(2, msgsalida, aprobardesaprobar);
    } else {

        if (long == 1) {
            msgsalida = etiqueta.msgSegAprobarNivAct1;
        } else {
            msgsalida = etiqueta.msgSegAprobarNivAct2;
        }
        mostrarMensaje(2, msgsalida, aprobardesaprobar);
    }

}
function aprobardesaprobar(btnPresionado) {

    var recordsSel = gpNiveles.getSelectionModel().getSelections(), actaprobar = [];

    for (var i = 0; i < recordsSel.length; i++) {
        if (recordsSel[i].data.idaprobacion >= '4' && !esrector) {
            break;
        }
        actaprobar.push(recordsSel[i].data.idactividad);
    }

    if (btnPresionado == 'ok') {
        if (gpNiveles.getSelectionModel().getSelected().data.idaprobacion == 4
                && !esrector
                ) {
            mostrarMensaje(1, etiqueta.msgErrorAproSuperior);
        } else {
            mymask.show();
            Ext.Ajax.request({
                url: 'aprobarDesaprobarNivelActividad',
                params: {
                    identidad: identidadselected,
                    actividades: Ext.encode(actaprobar),
                    idaprobacion: idaprobacion_selecc,
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgE == 1) {
                        mostrarMensaje(1, etiqueta.lbGuardar);
                    } else {
                        mostrarMensaje(1, etiqueta.msgErrorAction);
                    }
                    stNiveles.reload();
                    treePlanesParaActualizar.getRootNode().reload();
                }
            });
        }
    }
}

/*Metodos para aprobar y desaprobar los ajustes*/
function aprobarAjustes(valor) {
    //mensages de salida
    var long = smNiveles.getSelections().length;
    var msgsalida = '';

    //seleccion multiple
    var recordsSel = gpNiveles.getSelectionModel().getSelections(), actaprobar = [];

    for (var i = 0; i < recordsSel.length; i++) {
        actaprobar.push(recordsSel[i].data.idactividad);
    }
    if (parseInt(valor) == 4) {
        if (long == 1) {
            msgsalida = etiqueta.msgSegDesaprobarAjuste;
        } else {
            msgsalida = etiqueta.msgSegDesaprobarAjustes;
        }
        mostrarMensaje(2, msgsalida, aprobardesaprobarAjuste);
    } else {

        if (long == 1) {
            msgsalida = etiqueta.msgSegAprobarAjuste;
        } else {
            msgsalida = etiqueta.msgSegAprobarAjustes;
        }
        mostrarMensaje(2, msgsalida, aprobardesaprobarAjuste);
    }

}
function aprobardesaprobarAjuste(btnPresionado) {

    var recordsSel = gpNiveles.getSelectionModel().getSelections(), actaprobarajuste = [];

    for (var i = 0; i < recordsSel.length; i++) {
        if (recordsSel[i].data.idaprobacion !== '4' && !esrector) {
            break;
        }
        actaprobarajuste.push(recordsSel[i].data.idactividad);
    }

    if (btnPresionado == 'ok') {
        if (gpNiveles.getSelectionModel().getSelected().data.idaprobacion == 4
                && !esrector
                ) {
            mostrarMensaje(1, etiqueta.msgErrorAproSuperior);
        } else {
            mymask.show();
            Ext.Ajax.request({
                url: 'aprobarDesaprobarNivelActividad',
                params: {
                    identidad: identidadselected,
                    actividades: Ext.encode(actaprobarajuste),
                    idaprobacion: idaprobacion_selecc,
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgE == 1) {
                        mostrarMensaje(1, etiqueta.lbGuardar);
                    } else {
                        mostrarMensaje(1, etiqueta.msgErrorAction);
                    }
                    stNiveles.reload();
                    treePlanesParaActualizar.getRootNode().reload();
                }
            });
        }
    }
}

/*Metodos Ver*/
function verCalculosySalidas() {
    arrayActSelect = [];
    if (smNiveles.getSelections().length > 0) {
        for (i = 0; i < smNiveles.getSelections().length; i++) {
            arrayActSelect.push(smNiveles.getSelections()[i].data.idactividad);
        }
    }
    var win = window.open(
            'verCalculosySalidas?identidad=' + identidadselected +
            "&idejercicio=" + cbEjercicio.getValue() +
            '&text=' + trEntidades.getNodeById(identidadselected).text +
            "&glob=" + chkGlobal.getValue() +
            '&idactividades=' + Ext.encode(arrayActSelect)
            );
    mascaraExportar(etiqueta.lbExportandoNACalculosySalidas, etiqueta.lbEsperePorFavor, win);
}
function verDetalles() {
    idactividad = gpNiveles.getSelectionModel().getSelected().data.idactividad;
    actividad = gpNiveles.getSelectionModel().getSelected().data.denominacion;
    var win = window.open('verDetalles?identidad=' + identidadselected
            + '&text=' + trEntidades.getNodeById(identidadselected).text
            + '&idejercicio=' + cbEjercicio.getValue()
            + "&idactividad=" + idactividad
            + "&actividad=" + actividad
            );

    mascaraExportar(etiqueta.lbExportandoDetalles, etiqueta.lbEsperePorFavor, win);
}

/*Copiar y pegar niveles*/
function copiarNiveles() {
    identidadorigen = null;
    identidaddestino = null;
    if (!Ext.getCmp('btnCopiarNiveles').disabled && !Ext.getCmp('btnCopiarNiveles').hidden) {
        Ext.getCmp('btnCopiarNiveles').disable();
        Ext.getCmp('btnPegarNiveles').enable();
        identidadorigen = identidadselected;
    }
}
function confirmarCopiarPegarNiveles() {
    if (!Ext.getCmp('btnPegarNiveles').disabled && !Ext.getCmp('btnPegarNiveles').hidden) {
        Ext.getCmp('btnCopiarNiveles').enable();
        Ext.getCmp('btnPegarNiveles').disable();
        identidaddestino = identidadselected;
        if ((identidadorigen != null && identidaddestino != null) && (identidadorigen != identidaddestino)) {
            mostrarMensaje(2, etiqueta.msgSegPegarNivAct, copiarPegarNiveles);
        }
    }
}
function copiarPegarNiveles(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'copiarPegarNiveles',
            params: {
                identidadorigen: identidadorigen,
                identidaddestino: identidaddestino,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function (options, success, response) {
                gpNiveles.getStore().reload();
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    mostrarMensaje(1, etiqueta.msgNivelesActividadCopiados);
                } else {
                    mostrarMensaje(1, etiqueta.msgErrorAction);
                }
            }
        });
    }
}

/* Metodos del ajustar multiple y todos */
function cargarImporteinicial(btnPresionado) {
    if (ajustarTodos == 2) {
        arrayActSelect = [];
        if (smNiveles.getSelections().length > 0) {
            for (i = 0; i < smNiveles.getSelections().length; i++) {
                if (smNiveles.getSelections()[i].data.idaprobacion == '4') {
                    arrayActSelect.push(smNiveles.getSelections()[i].data.idactividad);
                }
            }
        }
    } else {
        arrayActSelect = null;
    }
    mymask.show();
    Ext.Ajax.request({
        url: 'cargarImporteInicial',
        params: {
            identidad: identidadselected,
            idejercicio: cbEjercicio.getValue(),
            arrayidactividad: Ext.encode(arrayActSelect)
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            mymask.hide();
            if (response.responseText == 23) {
                mostrarMensaje(1, etiqueta.lbNoajuste);
            } else {
                limpiarValores();
                importeIn = responseData.importe;
                Ext.getCmp('importInicial').setValue(responseData.importeformato);
                winRealizarAjuste.show();
            }
        }
    });
}
function calcularAjuste() {
    mymask.show();
    Ext.Ajax.request({
        url: 'calcularAjuste',
        params: {
            identidad: identidadselected,
            idejercicio: cbEjercicio.getValue(),
            arrayidactividad: Ext.encode(arrayActSelect),
            porciento: Ext.getCmp('porciento').getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (response.responseText == 23) {
                //ver aqui q se puede poner 
            } else {
                Ext.getCmp('importAjustado').setValue(responseData.importeformato);
                var importAju = responseData.importe;
                importeFinal(importeIn, importAju);
                mymask.hide();
            }
        }
    });
}
function importeFinal(importeIn, importAju) {
    mymask.show();
    Ext.Ajax.request({
        url: 'importeFinal',
        params: {
            importeInicial: importeIn,
            importeAjustado: importAju
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            Ext.getCmp('importFinal').setValue(responseData.importeformato);
            Ext.getCmp('idajustar').enable();
        }
    });
}
function insertarAjuste() {
    mymask.show();
    if (ajustarTodos == 2) {
        arrayAjuste = [];
        for (i = 0; i < smNiveles.getSelections().length; i++) {
            if (smNiveles.getSelections()[i].data.idaprobacion == '4') {
                arrayAjuste.push(smNiveles.getSelections()[i].data.idactividad);
            }
        }
    } else {
        arrayAjuste = null;
    }
    mymask.show();
    Ext.Ajax.request({
        url: 'insertarAjusteNivel',
        params: {
            identidad: identidadselected,
            idejercicio: cbEjercicio.getValue(),
            arrayidactividad: Ext.encode(arrayAjuste)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (response.responseText == 23) {
                mostrarMensaje(1, etiqueta.lbNoajuste);
            } else {
                mostrarMensaje(1, etiqueta.lbAjusteSat);
                stNiveles.reload();
            }
        }
    });
}
function limpiarValores() {
    Ext.getCmp('porciento').setValue('');
    Ext.getCmp('importInicial').setValue('');
    Ext.getCmp('importFinal').setValue('');
    Ext.getCmp('importAjustado').setValue('');
    Ext.getCmp('idajustar').disable();
    Ext.getCmp('btnCalcularAjuste').disable();
    fpAjustar.getForm().reset();
}

/* Metodos para colorear las celdas segun las condiciones */
function upColorCellNivel() {
    for (var i = 0; i < stNiveles.getCount(); i++) {
        for (var j = 0; j < cmNiveles.getColumnCount(); j++) {
            if (stNiveles.getAt(i).data.nivelactividadautomatico > 0) {
                Ext.get(gpNiveles.getView().getCell(i, j)).applyStyles('background-color:#FFCCCC');
            }
        }
    }
}
function upColorCellDesglose() {
    for (var i = 0; i < stNiveles.getCount(); i++) {
        for (var j = 0; j < cmNiveles.getColumnCount(); j++) {
            if (stNiveles.getAt(i).data.desglosada == 1) {
                Ext.get(gpNiveles.getView().getCell(i, j)).applyStyles('background-color:#F7FF7B');
            }
        }
    }
}



function actualizarPlan() {
    idtipomodelo = modeloselected.attributes.idtipomodelo;
    if (modeloselected != -1)
        if (modeloselected.attributes.tipo == 2) {
            Ext.getBody().mask(etiqueta.msjActualizandoPlan, 'ext-el-mask-msg x-mask-loading');
            Ext.Ajax.request({
                url: 'actualizarPlanes',
                timeout: 6400000,
                params: {
                    idmodelo: idmodeloselected,
                    identidad: identidadselected,
                    idtipomodelo: idtipomodelo,
                    tipoplan: treePlanesParaActualizar.getSelectionModel().getSelectedNode().attributes.tipoplan,
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    response = Ext.decode(response.responseText);
                    if (response.cod == 1) {
                        mostrarMensaje(1, etiqueta.msjPlanActualizadoOk);
                    } else {
                        mostrarMensaje(1, etiqueta.msjPlanActualizadoError);
                    }
                }
            });
        }
}