var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestionarplanes', cargarAccionesPlanes);
var objciPlanes = {};
objciPlanes.acciones = [];
var urlCbUMPlanes = 'cargarunidadmedida', urlCbCentBalancePlanes = 'listarCentroBalance', urlLoaderTreePlanes = 'listarPlanModelo',
        urlCbPaisPlanes = 'listarPais', urlCbVAPlanes = 'cargarviaadquision', urlListarPlanes = 'listarIndModelo', urlListarPlanesConsolidacionPlanes = 'listarConsolidacion',
        urlListarVerActXIndPlanes = 'listarVerActXInd';
var ocultarPlanes = true, hojaPlanes, denom_ent, rectoraPlanes = false, identidadEsODPlanes = 0, contJRGrid = 0, gestionSegunEstEjercicioPlan = true;
var btnImportarPlanes, maskPlanTreePlanes, idtipodocPlanes, winClasifPlanesPlanes, consolidadoPlanes;
var winAsociarPlanes, winDesAsociarPlanes, idindsmGestModelo, aprobarajustePlanes, fpPlanes, winAddPlanes, tpBasePlanes, controlPlanes, btnAplicarAddPlanes, tpEstructuraPlanes;
var nodeIdsPlanes, rutaPlanes, denominacionclasifPlanes = '', offsetgpAsociadoaPresupuestoPlanes = 0;
var fpModeloPlanes, winAddModeloPlanes, btnAplicarModelo, stTipoModelPlanes, filtrosgpModeloPlanes, btnVerDemandaPlanes, jrStGpGestModeloPlanes;
var winDemandaCentroBalancePlanes, filtrosGpdemandacentrobalancePlanes, stGpdemandacentrobalancePlanes, control2Planes = 0, offsetNaePlanes = 0, offsetOGPlanes = 0;
var cbImportesPlanes, tfImportePlanes, tfcantidadfinalPlanes, pAsociadoaPresupuestoPlanes, pcmPlanes, filtrospresupuestoPlanes, storeAsociadoaPresupuestoPlanes, storeAsociadoaPresupuestoPlanesReconfig, gpAsociadoaPresupuestoPlanes, importesPlanes = [];
var winRealizarAjustePlanes, vistaPlan = true;
/*Estos son los objetos del Grid de los indicadores */
var smGpGestModeloPlanes, stGpGestModeloPlanes, gpModeloPlanes, pgGestModeloPlanes, nro_filaSeleccionada, identidadselectedPlanes, treePlanSelect, cbEjercicioPlanes, offsetGpGestModeloPlanes = 0;
//Importar
var winImpPlanes = null, offsetdin = 0, fpbuscarPlanes;
var estadoTreePlanes = true, estadoGridInd = true, estadoPanelInd = true;
//Ajustar
var importInicialPlanes, importFinalPlanes;
var importeInPlanes = 0, importAjuPlanes = 0, importeFiPlanes = 0;

var arrayIndexDinamicos, arrayIndexDinamicosNum, arrayIndexDinamicosCad;
//reporte OACE
var cbPlanesresumen, cbEjercicioresumen, storganodemandante;
function cargarAccionesPlanes() {

    //objeto del componente complemetario DWH, en este caso para el cierre
    cmpComboDWH = CmpBotonesComplementarios({elemento: 'pronostico'});

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            objciPlanes.acciones[acciones_reportes[i].abreviatura] = true;
        }
        termine_cargar = true;
        if (objciPlanes.acciones.rector) {
            rectoraPlanes = objciPlanes.acciones.rector;
            cmpComboDWH.show();
        }
        cargarInterfazPlan();
    });
}

function cargarInterfazPlan() {
//mascaras
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    //carga de datos por defecto
        stUsuarios = new Ext.data.Store({
        url: 'cargarUsuarios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idusuario'
                    }, {
                        name: 'nombreusuario'
                    }])

    });
    stTipoModelPlanes = new Ext.data.Store({
        autoLoad: false,
        url: 'listarTiposModelosAprobados',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idtipomodelo"
        }, [{
                name: 'idtipomodelo'
            }, {
                name: 'denominacion'
            }]
                )
    });
    sttipoplanPlanes = new Ext.data.SimpleStore({
        id: 'stcbActivo',
        fields: ['idaccion', 'nombreaccion'],
        data: [
            [1, 'Ingreso'],
            [0, 'Gasto']
        ]
    });
    stTipoPlanEconomicoPlanes = new Ext.data.Store({
        autoLoad: false,
        url: 'cargarClasifModeloMatPres',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idclasf"
        }, [{
                name: 'idclasf'
            }, {
                name: 'denominacion'
            }]
                )
    });
    //botones
    var btnGraficasPlanes = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: identidadselectedPlanes,
        componente: 'Plan'
    });
    var btnGraficoPlanifPlanes = btnGraficasPlanes.botonMenuGrafica();
    btnAyudaPlanes = new Ext.Button({
        id: 'idbtnAyudaPlanes',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
    });
    btnExportarPlanes = new Ext.Button({
        disabled: false,
        id: 'btnExportar',
        hidden: false,
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportarIndicador,
        handler: function () {
            exportarIndicadores();
        }
    });
    btnVerActPlanes = new Ext.Toolbar.Button({
        id: 'btnVerActPlanes',
        iconCls: 'ver',
        tooltip: 'Ver Actividades',
        disabled: true,
        handler: function () {
            cargarActividades();
        }
    });
    btnImportarPlanes = new Ext.Button({
        id: 'btnImportarPlanes',
        iconCls: 'importar',
        tooltip: perfil.etiquetas.lbImportar,
        disabled: true,
        handler: function () {
            winFpPlanes('Imp');
        }
    });
    btnExportarParaEnmar = new Ext.Button({
        id: 'idbtnExportarParaEnmar',
        iconCls: 'exportar',
        tooltip: 'Exportar indicadores',
        disabled: true,
        handler: function () {
            exportarIndicadoresEnmarc();
        }
    });
    btnVerDemandaPlanes = new Ext.Toolbar.Button({
        id: 'btnVerDemandaPlanes',
        iconCls: 'ver',
        tooltip: 'Ver Demanda',
        handler: function () {
            cargarAccionesDemanda();
        }
    });
    btnResumenProductosXOace = new Ext.Button({
        disabled: false,
        id: 'btnResumenProductosXOace',
        iconCls: 'vistareporte',
        hidden: false,
        tooltip: 'Resumen de productos por OACE y órgano demandante',
        handler: function () {
            reporteResumenOACEInterfazGeneral();
        }
    });
    //importar datos a plan
    fpbuscarPlanes = new Ext.FormPanel({
        id: 'idfpbuscarPlanes',
        labelAlign: 'top',
        region: 'center',
        width: 600,
        frame: true,
        fileUpload: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                xtype: 'fileuploadfield',
                regex: /^.+\.(xls|xlsx)$/i,
                //fieldLabel: perfil.etiquetas.lbCargarDoc,
                fieldLabel: 'Cargar documento',
                name: 'file',
                id: 'form-file',
                prevTab: 'idBtnAceptarImp',
                emptyText: perfil.etiquetas.lbSeleccioneArch,
                allowBlank: false,
                anchor: '100%',
                buttonCfg: {
                    text: ':',
                    id: 'idbutton',
                    iconCls: 'importar',
                    icon: perfil.dirImg + 'buscar.png'
                }
            }]
    });

    stCbejercicioPlanes = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        disabled: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            load: function (t) {
                //aki no hace falta el validar para el estado Elaboracion ya que se garantiza en Configurar ejercicios
                //que el ejercicio actual solo es de tipo estado Elaboracion
                cbEjercicioPlanes.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                Ext.Ajax.request({
                    url: 'gestPermisos',
                    params: {
                        idejercicio: cbEjercicioPlanes.getValue()
                    },
                    callback: function (options, success, response) {
                        puedeadicionarPlanes = 1;
                        puedemodificarPlanes = 1;
                        puedeeliminarPlanes = 1;
                        puedeguardarPlanes = 1;
                        responseData = Ext.decode(response.responseText);

                    }

                });
            }
        }
    });
    cbEjercicioPlanes = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        width: 150,
        disabled: true,
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                tpBasePlanes.getRootNode().reload();
                if (typeof (stGpGestModeloPlanes) != 'undefined') {
                    stGpGestModeloPlanes.removeAll();
                    Ext.getCmp('idpModeloPlanes').disable();
                    Ext.getCmp('chglobalPlanes').setValue(false);
                }

                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    deshabilitarSegunEstadoDelEjercicioPLan(false);
                } else {
                    deshabilitarSegunEstadoDelEjercicioPLan(true);
                }
            }
        }
    });
    //combo global
    chglobalPlanes = new Ext.form.Checkbox({
        boxLabel: 'Global',
        id: 'chglobalPlanes',
        listeners: {
            check: function (ck, t) {
                stGpGestModeloPlanes.reload();
            }
        }
    });
    //****************************entidades********************************
    tpEstructuraPlanes = new Ext.estructura.panel.PanelEstructura({
        cargos: false,
        menu: false,
        width: 500

    });
    tpEstructuraPlanes.btnBuscar.setText("");
    tpEstructuraPlanes.btnLimpiar.setText("");
    tpEstructuraPlanes = tpEstructuraPlanes.items.items[0];
    tpEstructuraPlanes.getRootNode().expand();
    tpEstructuraPlanes.addListener('click', function (n) {
        if (n.text != "Estructuras") {
            tpEstructuraPlanes.getSelectionModel().select(n);
            loaderTreeBasePlanes.baseParams.identidad = n.id;
            tpBasePlanes.isVisible();
            tpBasePlanes.show();
            pModeloPlanes.disable();
            cbEjercicioPlanes.enable();
            btnGraficoPlanifPlanes.enable();
            identidadselectedPlanes = n.id;
            hojaPlanes = n.leaf;
            denom_ent = n.text;
            Ext.getCmp('idbtnExportarParaEnmar').enable();
            //Determinando si es od
            Ext.Ajax.request({
                url: 'entidadOD',
                params: {
                    identidad: identidadselectedPlanes
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    identidadEsODPlanes = responseData;
                    btnGraficoPlanifPlanes.enable();
                    btnGraficasPlanes.actualizarParametros(n, 'Plan');
                }
            });
            Ext.getCmp('idpPlanes').setTitle('Planes: ' + denom_ent);
            pPlanes.expand(true);
            Ext.getCmp('idtpBasePlanes').getRootNode().reload();
            pPlanes.enable();
            Ext.getCmp('idtpBasePlanes').expandAll();
        }

    });
    //***************************planes*****************************
    contextMenuBasePlanes = new Ext.menu.Menu({// 000000
        id: 'trMenuDPlanes',
        items: [
            {
                text: perfil.etiquetas.lbAdicionarP,
                itemCls: 'x-menu-item icondistra-adicionar',
                iconCls: 'imagen-none',
                id: 'addplanPlanes',
                handler: function () {
                    if (!winAddPlanes)
                        crearIUAddModPlanes();
                    fpPlanes.getForm().reset();
                    winAddPlanes.show(Ext.getBody());
                    Ext.getCmp('codigoplanPlanes').enable();
                    winAddPlanes.setTitle(perfil.etiquetas.lbAdicionarP);
                    Ext.getCmp('node').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.id);
                }
            }, {
                text: perfil.etiquetas.lbTtbtnModelo,
                itemCls: 'x-menu-item icondistra-adicionar',
                iconCls: 'imagen-none',
                id: 'addmodeloPlanes',
                handler: function () {
                    accPlanes = 'Adicionar';
                    accionPlanes = 2;
                    if (!Ext.getCmp('idwinAddModeloPlanes'))
                        crearIUAddModModeloPlanes();
                    btnAplicarModelo.show();
                    Ext.getCmp('idwinAddModeloPlanes').show(Ext.getBody());
                    Ext.getCmp('idwinAddModeloPlanes').setTitle(perfil.etiquetas.lbAdicionarM);
                    Ext.getCmp('idplanmPlanes').setValue(treePlanSelect);
                }
            }, {
                text: perfil.etiquetas.titModPlan,
                itemCls: 'x-menu-item icondistra-modificar',
                iconCls: 'imagen-none',
                id: 'modplanPlanes',
                handler: function () {
                    if (!winAddPlanes)
                        crearIUAddModPlanes();
                    winAddPlanes.show(Ext.getBody());
                    Ext.getCmp('codigoplanPlanes').disable();
                    btnAplicarAddPlanes.hide();
                    winAddPlanes.setTitle(perfil.etiquetas.lbModificarP);
                    Ext.getCmp('codigoplanPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.codigo);
                    Ext.getCmp('denominacionpPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.denominacion);
                    Ext.getCmp('descripcionpPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.descripcion);
                    Ext.getCmp('idplanmPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idplan);
                }
            }, {
                text: perfil.etiquetas.lbTtbtnMod,
                itemCls: 'x-menu-item icondistra-modificar',
                iconCls: 'imagen-none',
                id: 'modmodeloPlanes',
                handler: function () {
                    if (!Ext.getCmp('idwinAddModeloPlanes'))
                        accionPlanes = 1;
                    accPlanes = 'Modificar';
                    crearIUAddModModeloPlanes();
                    btnAplicarModelo.hide();
                    Ext.getCmp('idcmbtipomodeloPlanes').disable();
                    Ext.getCmp('idaplicarplanPlanes').hide();
                    Ext.getCmp('idwinAddModeloPlanes').show(Ext.getBody());
                    Ext.getCmp('idwinAddModeloPlanes').setTitle(perfil.etiquetas.lbModificarM);
                    Ext.getCmp('idplanmPlanes').setValue(treePlanSelect);
                    Ext.getCmp('denominacionPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.denominacion);
                    Ext.getCmp('descripcionPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.descripcion);
                    Ext.getCmp('idmodeloPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idmodelo);
                    Ext.getCmp('idcmbtipomodeloPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idtipomodelo);
                    Ext.getCmp('idcmbtipomodeloPlanes').setRawValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.tipomodelo);
                    Ext.getCmp('idcmbtipoplanPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.tipoplan);
                    Ext.getCmp('tfclasificacionPlanes').setValue(tpBasePlanes.getSelectionModel().getSelectedNode().attributes.ruta);
                }
            }, {
                text: perfil.etiquetas.lbTtbtnDelPlan,
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                id: 'delplanPlanes',
                handler: function () {
                    estadoGridInd = pModeloPlanes.disabled;
                    estadoPanelInd = Ext.getCmp('idpcmPlanes').disabled;
                    pModeloPlanes.enable();
                    Ext.getCmp('idpcmPlanes').enable();
                    eliminarPlanes();
                }
            }, {
                text: perfil.etiquetas.lbTtbtnDel,
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                id: 'delmodeloPlanes',
                handler: function () {
                    eliminarModeloPlanes();
                }
            }, {
                text: perfil.etiquetas.lbTtbtnVerInd,
                itemCls: 'x-menu-item icondistra-ver sisplanico-rojo',
                iconCls: 'imagen-none',
                id: 'verplanPlanes',
                handler: function () {
                    if (consolidadoPlanes == 1) {
                        consolidadoPlanes = 0;
                        stGpGestModeloPlanes.reload();
                        if (objciPlanes.acciones.rector) {
                            Ext.getCmp('btnAprobPlanes').show();
                            Ext.getCmp('btnDesPlanes').show();
                            Ext.getCmp('btnAprobTodosPlanes').show();
                            Ext.getCmp('btnDesTodosPlanes').show();
                            if (gestionSegunEstEjercicioPlan) {
                                Ext.getCmp('btnAprobPlanes').enable();
                                Ext.getCmp('btnDesPlanes').enable();
                                Ext.getCmp('btnAprobTodosPlanes').enable();
                                Ext.getCmp('btnDesTodosPlanes').enable();
                            } else {
                                Ext.getCmp('btnAprobPlanes').disable();
                                Ext.getCmp('btnDesPlanes').disable();
                                Ext.getCmp('btnAprobTodosPlanes').disable();
                                Ext.getCmp('btnDesTodosPlanes').disable();
                            }
                        } else {
                            Ext.getCmp('btnAprobPlanes').show();
                            Ext.getCmp('btnDesPlanes').show();
                            Ext.getCmp('btnAprobTodosPlanes').show();
                            Ext.getCmp('btnDesTodosPlanes').show();
                        }
                    }
                    Ext.getCmp('idpcmPlanes').layout.setActiveItem('idpModeloPlanes');
                }
            },
            {
                text: perfil.etiquetas.lbTtbtnAsociar,
                itemCls: 'x-menu-item icondistra-asociar',
                iconCls: 'imagen-none',
                id: 'menuAsociarPlanes',
                handler: function () {
                    if (!winAsociarPlanes)
                        funWinAsociarPlanes();
                    else {
                        stGpAsociarPlanes.reload();
                    }
                    winAsociarPlanes.show();
                }
            }, {
                text: 'Desasociar planes',
                itemCls: 'x-menu-item icondistra-asociar',
                iconCls: 'imagen-none',
                id: 'menuDesasociarPlanes',
                handler: function () {
                    if (!winDesAsociarPlanes)
                        funDesAsociarPlanes();
                    else {
                        stGpDesAsociarPlanes.reload();
                    }
                    winDesAsociarPlanes.show();
                }
            },
            {
                text: 'Ver presupuesto',
                itemCls: 'x-menu-item icondistra-ver sisplanico-verde',
                iconCls: 'imagen-none',
                id: 'verpresupuestoPlanes',
                handler: function () {
                    mostrarPresupuestoPlanes();
                }
            }, {
                text: 'Ajustar',
                itemCls: 'x-menu-item icondistra-ajustar',
                iconCls: 'imagen-none',
                id: 'ajustarPlanes',
                handler: function () {
                    CargarImporteinicialAjuste();
                }
            }
        ]
    });

    var porcientotextPlanes = {
        xtype: 'tbtext',
        id: 'porcientotexPlanes',
        width: 50,
        height: 35,
        text: 'Porciento a ajustar:'
    };

    var porcientoPlanes = {
        xtype: 'numberfield',
        id: 'porcientoPlanes',
        maskRe: /^([0-9-]+ ?[0-9-]*)+$/,
        maskReregex: /^([0-9-]+ ?[0-9-]*)+$/,
        maxValue: 100,
        minValue: -100,
        maxText: 'Solo admite números enteros entre 0 y 100.',
        minText: 'Solo admite números enteros entre 0 y 100.',
        allowBlank: false,
        width: 100,
        height: 25,
        enableKeyEvents: true,
        editable: false,
        fieldLabel: 'Porciento a ajustar',
        listeners: {
            keyup: function (btn, e) {
                if (Ext.getCmp('porcientoPlanes').getValue() != '' && Ext.getCmp('porcientoPlanes').getValue() != ' ' || Ext.getCmp('porcientoPlanes').getValue() == 0) {
                    Ext.getCmp('btnCalcularPlanes').enable();
                } else {
                    Ext.getCmp('btnCalcularPlanes').disable();
                }

            }
        }
    };

    var pPorcientoPlanes = new Ext.Panel({
        frame: false,
        border: false,
        width: 150,
        height: 25,
        items: [porcientoPlanes]
    });
    btnCalcularPlanes = new Ext.Button({
        text: 'Calcular',
        id: 'btnCalcularPlanes',
        disabled: true,
        height: 15,
        //icon: perfil.dirImg + 'buscar.png',
        iconCls: 'calcular',
        handler: function () {
            Ext.getCmp('idajustarPlanes').enable();
            CalcularAjustePlanes();
        }
    });
    var espacioPlanes = {
        xtype: 'panel',
        id: 'idespacioPlanes',
        frame: false,
        border: false,
        width: 500,
        height: 30
    };
    importInicialPlanes = {
        xtype: 'textfield',
        id: 'importInicialPlanes',
        width: 100,
        height: 25,
        fieldLabel: 'Importe Inicial',
        editable: false,
        disabled: true
    };
    importFinalPlanes = {
        xtype: 'textfield',
        id: 'importFinalPlanes',
        width: 100,
        height: 25,
        fieldLabel: 'Importe Final',
        editable: false,
        disabled: true
    };
    importAjustadoPlanes = {
        xtype: 'textfield',
        id: 'importAjustadoPlanes',
        width: 100,
        height: 25,
        fieldLabel: 'Importe Ajustado',
        editable: false,
        disabled: true
    };

    fpAjustarPlanes = new Ext.FormPanel({
        id: 'fpAjustarPlanes',
        autoHeight: true,
        width: 400,
        height: 2000,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:30px 0px 0px 20px",
                        items: [porcientotextPlanes]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:25px 0px 0px",
                        items: [pPorcientoPlanes]
                    }
                    , {
                        columnWidth: .33,
                        layout: 'form',
                        frame: false,
                        align: 'left',
                        bodyStyle: "padding:25px 0px 0px",
                        items: [btnCalcularPlanes]
                    }
                ]
            }
            , {
                layout: 'column',
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacioPlanes]
                    },
                    {
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacioPlanes]
                    },
                    {
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacioPlanes]
                    }
                ]
            }
            , {
                layout: 'column',
                bodyStyle: "padding:0px 0px 0px 20px",
                columnWidth: .33,
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [importInicialPlanes]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [importAjustadoPlanes]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [importFinalPlanes]
                    }]
            }

        ]
    });

    winRealizarAjustePlanes = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        width: 400,
        constrain: true,
        height: 2000,
        title: 'Realizar ajuste',
        autoHeight: true,
        items: fpAjustarPlanes,
        buttons: [{
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                tabIndex: 33,
                text: 'Cancelar',
                handler: function () {

                    winRealizarAjustePlanes.hide();
                    Ext.getCmp('btnCalcularPlanes').disable();
                    Ext.getCmp('idajustarPlanes').disable();
                    Ext.getCmp('porcientoPlanes').reset();
                    Ext.getCmp('importInicialPlanes').setValue('');
                    Ext.getCmp('importFinalPlanes').setValue('');
                    Ext.getCmp('importAjustadoPlanes').setValue('');
                }
            }, {
                //  icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                disabled: true,
                tooltip: 'Guardar datos y cerrar ventana',
                tabIndex: 31,
                id: 'idajustarPlanes',
                text: 'Aceptar',
                handler: function () {
                    winRealizarAjustePlanes.hide();
                    Ext.getCmp('btnCalcularPlanes').disable();
                    Ext.getCmp('idajustarPlanes').disable();
                    insertarAjustePlanes();
                    LimpiarValoresPlanes();
                    stGpGestModeloPlanes.reload();

                }
            }]
    });

    loaderTreeBasePlanes = new Ext.tree.TreeLoader({
        dataUrl: urlLoaderTreePlanes,
        listeners: {
            scope: this,
            beforeload: function (loader, treeNode) {
                loader.baseParams = {
                    tipo: treeNode.attributes.tipo,
                    identidad: identidadselectedPlanes,
                    erectora: rectoraPlanes,
                    idejercicio: cbEjercicioPlanes.getValue()
                };
                mymask.show();
            },
            load: function (loader, nodo, respuesta) {
                if (nodo.id == 0) {
                    nodo.expandChildNodes();
                }
                mymask.hide();
            }
        }
    });
    tpBasePlanes = new Ext.tree.TreePanel({
        autoScroll: true,
        id: 'idtpBasePlanes',
        border: false,
        contextMenu: contextMenuBasePlanes,
        loader: loaderTreeBasePlanes,
        root: {
            nodeType: 'async',
            id: '0',
            text: 'Planes',
            tipo: 0,
            leaf: false
        },
        listeners: {
            click: function (n, e) {
                if (!objciPlanes.acciones.rector) {
                    //-----------Grupo de condiciones para valdiar los permisos del componente----------------
                    if (puedeguardarPlanes == 0) {
                        Ext.getCmp('btnGuardar').hide();
                    }
                    if (puedeadicionarPlanes == 0) {
                        Ext.getCmp('addplanPlanes').hide();
                        Ext.getCmp('addmodeloPlanes').hide();
                    } else {
                        if (gestionSegunEstEjercicioPlan && (Ext.getCmp('chglobalPlanes').getValue() == false || hojaPlanes)) {
                            Ext.getCmp('addplanPlanes').enable();
                            Ext.getCmp('addmodeloPlanes').enable();
                        } else {
                            Ext.getCmp('addplanPlanes').disable();
                            Ext.getCmp('addmodeloPlanes').disable();
                        }
                    }
                    if (puedeeliminarPlanes == 0) {
                        Ext.getCmp('delplanPlanes').hide();
                        Ext.getCmp('delmodeloPlanes').hide();
                    } else {
                        if (gestionSegunEstEjercicioPlan) {
                            Ext.getCmp('delplanPlanes').enable();
                            Ext.getCmp('delmodeloPlanes').enable();
                        } else {
                            Ext.getCmp('delplanPlanes').disable();
                            Ext.getCmp('delmodeloPlanes').disable();
                        }
                    }
                    if (puedemodificarPlanes == 0) {
                        Ext.getCmp('modplanPlanes').hide();
                        Ext.getCmp('modmodeloPlanes').hide();
                    } else {
                        if (gestionSegunEstEjercicioPlan) {
                            Ext.getCmp('modplanPlanes').enable();
                            Ext.getCmp('modmodeloPlanes').enable();
                        } else {
                            Ext.getCmp('modplanPlanes').disable();
                            Ext.getCmp('modmodeloPlanes').disable();
                        }
                    }
                    Ext.getCmp('menuAprobAjustePlanes').hide();
                }
                //----------- Termina el grupo de condiciones para valdiar los permisos del componente----------------

                treePlanSelect = n.id;
                nodo = n;
                if (n.leaf == true && n.idplan != n.idpadre) {
                    pModeloPlanes.enable();
                    identidadmodelo = n.attributes.identidadmodelo
                }

                idelemsel = n.id;
                idtipodocPlanes = n.attributes.tipo;
                if (n.attributes.tipo == 2) {
                    Ext.getCmp('idpcmPlanes').layout.setActiveItem('idpModeloPlanes');
                    cargarconfgrid(n.attributes.idtipomodelo);
                } else {
                    Ext.getCmp('idpcmPlanes').disable();
                    if (typeof (stGpGestModeloPlanes) != 'undefined')
                        stGpGestModeloPlanes.removeAll();
                }
            },
            contextmenu: function (n, e) {
                n.select();
                var c = n.getOwnerTree().contextMenu;
                menuLeaf = n.leaf;
                c.contextNode = n;
                upMenuDerTreePlanes(n);
                c.showAt(e.getXY());
            }
        }
    });
    pPlanes = new Ext.Panel({
        id: 'idpPlanes',
        title: 'Planes',
        layout: 'fit',
        region: 'west',
        collapsible: true,
        split: true,
        disabled: true,
        width: 250,
        items: [tpBasePlanes]
    });
    pEstructuras = new Ext.Panel({
        title: 'Entidades',
        layout: 'fit',
        region: 'west',
        width: 250,
        collapsible: true,
        split: true,
        items: [tpEstructuraPlanes]
    });
    //***************************planes y entidades*************************
    pEntPlan = new Ext.Panel({
        layout: 'border',
        region: 'west',
        width: 500,
        items: [pEstructuras, pPlanes]
    });
    //**************grid panel indicadores****************************
    pModeloPlanes = new Ext.Panel({
        id: 'idpModeloPlanes',
        title: perfil.etiquetas.titModelos,
        split: true,
        disabled: true,
        layout: 'fit',
        tbar: [
            new Ext.Toolbar.MenuButton({
                id: 'menuAprobIndPlanes',
                tooltip: perfil.etiquetas.lbBtnAprobacion,
                iconCls: 'area',
                menu: {
                    items: [{
                            id: 'btnDesTodosPlanes',
                            tabIndex: 5,
                            itemCls: 'x-menu-item icondistra-desaprobar',
                            iconCls: 'imagen-none',
                            //tooltip: 'Desaprobar todos los indicadores (Ctrl+Alt+W)',
                            text: perfil.etiquetas.lbBtnDesaprobarTodos,
                            handler: function () {
                                desaprobar = 1;
                                cambiarEstadoTodosPlanes(1);
                            }
                        }, {
                            id: 'btnAprobTodosPlanes',
                            tabIndex: 4,
                            //tooltip: ' Aprobar todos los indicadores (Ctrl+Alt+Q)',
                            itemCls: 'x-menu-item icondistra-aprobar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnAprobarTodos,
                            handler: function () {
                                desaprobar = 0;
                                if (rectoraPlanes)
                                    cambiarEstadoTodosPlanes(4);
                                else
                                    cambiarEstadoTodosPlanes(3);
                            }
                        }, {
                            id: 'btnAprobPlanes',
                            disabled: true,
                            //tooltip: 'Aprobar el indicador seleccionado (Alt+Q)',
                            tabIndex: 4,
                            itemCls: 'x-menu-item icondistra-aprobar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnAprobar,
                            handler: function () {
                                desaprobar = 0;
                                accionAprobarPlanes();
                            }
                        }, {
                            id: 'btnDesPlanes',
                            disabled: true,
                            tabIndex: 5,
                            //tooltip: 'Desaprobar el indicador seleccionado (Alt+W)',
                            itemCls: 'x-menu-item icondistra-desaprobar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnDesaprobar,
                            handler: function () {
                                desaprobar = 1;
                                cambiarEstadoPlanes(1);
                            }
                        }]
                }
            }),
            new Ext.Toolbar.MenuButton({
                id: 'menuAprobAjustePlanes',
                tooltip: perfil.etiquetas.lbBtnAprobacionAjuste,
                iconCls: 'area',
                menu: {
                    items: [{
                            id: 'btnDesTodosAjustes',
                            tabIndex: 5,
                            //tooltip: 'Desaprobar todos los ajustes (Ctrl+Alt+W)',
                            itemCls: 'x-menu-item icondistra-desaprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnDesapTodosAjustes,
                            handler: function () {
                                aprobarajustePlanes = 0;
                                cambiarEstadoAjusteTodosPlanes(4);
                            }
                        }, {
                            id: 'btnAprobTodosAjustes',
                            tabIndex: 4,
                            //tooltip: ' Aprobar todos los ajustes (Ctrl+Alt+Q)',
                            itemCls: 'x-menu-item icondistra-aprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnAprobTodosAjustes,
                            handler: function () {
                                aprobarajustePlanes = 1;
                                cambiarEstadoAjusteTodosPlanes(5);
                            }
                        }, {
                            id: 'btnAprobAjustePlanes',
                            disabled: true,
                            //tooltip: 'Aprobar el ajuste del indicador seleccionado (Alt+Q)',
                            tabIndex: 4,
                            itemCls: 'x-menu-item icondistra-aprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnAprobAjustes,
                            handler: function () {
                                aprobarajustePlanes = 1;
                                cambiarEstadoAjustePlanes(5);
                            }
                        }, {
                            id: 'btnDesAjustePlanes',
                            disabled: true,
                            tabIndex: 5,
                            //tooltip: 'Desaprobar el ajuste del indicador seleccionado (Alt+W)',
                            itemCls: 'x-menu-item icondistra-desaprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnDesapAjustes,
                            handler: function () {
                                aprobarajustePlanes = 0;
                                cambiarEstadoAjustePlanes(4);
                            }
                        }]
                }
            }), {
                xtype: 'tbbutton',
                tooltip: perfil.etiquetas.lbAdicionarInd,
                id: 'btnAdicionarIndsPlanes',
                disabled: true,
                iconCls: 'adicionar',
                handler: function () {
                    crearIUAddIndicadores();
                }
            },
            {
                xtype: 'tbbutton',
                disabled: true,
                tooltip: perfil.etiquetas.lbEliminarIndicador,
                id: 'btnEliminarIndsPlanes',
                iconCls: 'eliminar',
                handler: function () {
                    eliminarIndModPlanes();
                }
            },
            {
                xtype: 'tbbutton',
                tooltip: perfil.etiquetas.lbGuardarIndicador,
                id: 'btnGuardarPlanes',
                disabled: true,
                iconCls: 'guardar',
                handler: function () {
                    GuardarTodasPlanes();
                }
            }, btnExportarPlanes, btnVerActPlanes,
            chglobalPlanes, '-']
    });
    //****************panel indicadores*******************
    pcmPlanes = new Ext.Panel({
        id: 'idpcmPlanes',
        region: 'center',
        layout: 'card',
        border: false,
        activeItem: 0,
        items: [pModeloPlanes, pAsociadoaPresupuestoPlanes]
    });
    pPlanModeloPresupuesto = new Ext.Panel({
        //title:'Estructuras',
        region: 'center',
        layout: 'border',
        items: [pPlanes, pcmPlanes]
    });
    //****************panel principal*******************
    pGeneral = new Ext.Panel({
        layout: 'border',
        tbar: [btnExportarParaEnmar, '-', btnVerDemandaPlanes, '-', btnResumenProductosXOace, '-', btnImportarPlanes, '-', btnGraficoPlanifPlanes, cmpComboDWH, '-', 'Ejercicio: ', cbEjercicioPlanes, '->', btnAyudaPlanes],
        items: [pEstructuras, pPlanModeloPresupuesto]
    });
    //******************viewport*****************
    myViewPlanes = new Ext.Viewport({
        layout: 'fit',
        items: [pGeneral]
    });
    //*****************sm del grid de indicadores*************
    smGpGestModeloPlanes = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (x, num, rec) {
                nro_filaSeleccionada = num;
                idindsmGestModelo = x.getSelected().get('idindicador');
                if (objciPlanes.acciones.rector || x.getSelected().data.idaprobaciondemanda > 1 || Ext.getCmp('chglobalPlanes').getValue() == true || identidadEsODPlanes == 0) {
                    columnasDinamicasgpModeloPlanes.setEditable(columnasDinamicasgpModeloPlanes.findColumnIndex('cantidad'), false);
                    for (var i = 0; i < arrayIndexDinamicos.length; i++) {
                        var indiceColumn = columnasDinamicasgpModeloPlanes.findColumnIndex(arrayIndexDinamicos[i]);
                        columnasDinamicasgpModeloPlanes.setEditable(indiceColumn, false);
                    }
                } else {
                    columnasDinamicasgpModeloPlanes.setEditable(columnasDinamicasgpModeloPlanes.findColumnIndex('cantidad'), true);
                    for (var i = 0; i < arrayIndexDinamicos.length; i++) {
                        var indiceColumn = columnasDinamicasgpModeloPlanes.findColumnIndex(arrayIndexDinamicos[i]);
                        columnasDinamicasgpModeloPlanes.setEditable(indiceColumn, true);
                    }
                }
                if (objciPlanes.acciones.rector || x.getSelected().data.idaprobaciondemanda != 4 || Ext.getCmp('chglobalPlanes').getValue() == true || identidadEsODPlanes == 0) {
                    columnasDinamicasgpModeloPlanes.setEditable(columnasDinamicasgpModeloPlanes.findColumnIndex('ajuste'), false);
                } else {
                    columnasDinamicasgpModeloPlanes.setEditable(columnasDinamicasgpModeloPlanes.findColumnIndex('ajuste'), true);
                }
                if (x.getSelections().length == 0) {
                    Ext.getCmp('btnEliminarIndsPlanes').disable();
                    habilitarDesabilitarPlanes(false);
                    habilitarDesabilitarAprobacionAjustePlanes(false);
                }
                if (x.getSelections().length == 1) {
                    if (x.getSelected().get('idaprobaciondemanda') < 3 && gestionSegunEstEjercicioPlan && (Ext.getCmp('chglobalPlanes').getValue() == false || hojaPlanes) && !objciPlanes.acciones.rector && identidadEsODPlanes == 1)
                        Ext.getCmp('btnEliminarIndsPlanes').enable();
                    else {
                        Ext.getCmp('btnEliminarIndsPlanes').disable();
                    }
                }
                if (x.getSelections().length > 1) {
                    if (gestionSegunEstEjercicioPlan && (Ext.getCmp('chglobalPlanes').getValue() == false || hojaPlanes) && !objciPlanes.acciones.rector && identidadEsODPlanes == 1)
                        Ext.getCmp('btnEliminarIndsPlanes').enable();
                }
                if (x.getSelections().length >= 1) {
                    habilitarDesabilitarPlanes(true);
                    habilitarDesabilitarAprobacionAjustePlanes(true);
                }
                if (x.getSelections().length != 0) {
                    if (x.getSelected().get('generadobasesplan') != 0) {
                        Ext.getCmp('btnVerActPlanes').enable();
                    } else {
                        Ext.getCmp('btnVerActPlanes').disable();
                    }

                    Ext.getCmp('btnEliminarIndsPlanes').on('click', function () {
                        Ext.getCmp('btnEliminarIndsPlanes').setHandler(
                                eliminarIndModPlanes(x));
                    });
                } else {
                    Ext.getCmp('btnVerActPlanes').disable();
                }
            },
            rowdeselect: function (s) {

                if (s.getSelections().length == 0) {
                    habilitarDesabilitarPlanes(false);
                    habilitarDesabilitarAprobacionAjustePlanes(false);
                }
                if (s.getSelections().length >= 1) {
                    habilitarDesabilitarPlanes(true);
                    habilitarDesabilitarAprobacionAjustePlanes(true);
                }
                if (s.getSelections().length != 0) {
                    if (s.getSelected().get('generadobasesplan') != 0) {
                        Ext.getCmp('btnVerActPlanes').enable();
                    } else {
                        Ext.getCmp('btnVerActPlanes').disable();
                    }
                } else {
                    Ext.getCmp('btnVerActPlanes').disable();
                }

                if (s.getSelections().length == 0) {
                    Ext.getCmp('btnEliminarIndsPlanes').disable();
                }
                if (s.getSelections().length == 1) {
                    if (s.getSelected().get('idaprobaciondemanda') < 3 && gestionSegunEstEjercicioPlan && (Ext.getCmp('chglobalPlanes').getValue() == false || hojaPlanes) && !objciPlanes.acciones.rector && identidadEsODPlanes == 1)
                        Ext.getCmp('btnEliminarIndsPlanes').enable();
                    else {
                        Ext.getCmp('btnEliminarIndsPlanes').disable();
                    }
                }
                if (s.getSelections().length > 1) {
                    if (gestionSegunEstEjercicioPlan && (Ext.getCmp('chglobalPlanes').getValue() == false || hojaPlanes) && !objciPlanes.acciones.rector && identidadEsODPlanes == 1)
                        Ext.getCmp('btnEliminarIndsPlanes').enable();
                }
                if (s.getSelections().length != 0) {
                    Ext.getCmp('btnEliminarIndsPlanes').on('click', function () {
                        Ext.getCmp('btnEliminarIndsPlanes').setHandler(
                                eliminarIndModPlanes(x));
                    });
                }
            }
        }
    });
    function reporteResumenOACEInterfazGeneral() {

        //store del combo de los ejercicios
        stCbejercicioresumen = new Ext.data.Store({
            url: 'getEjercicios',
            listeners: {
                load: function (t, n, e) {
                    cbEjercicioresumen.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                }
            },
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idejercicio'
            }, [{
                    name: 'idejercicio'
                }, {
                    name: 'ejercicio'
                }])});

        //combo de los ejercicios
        cbEjercicioresumen = new Ext.form.ComboBox({
            store: stCbejercicioresumen,
            valueField: 'idejercicio',
            hiddenName: 'idejercicio',
            displayField: 'ejercicio',
            fieldLabel: 'Ejercicio',
            mode: 'local',
            typeAhead: true,
            allowBlank: false,
            editable: true,
            triggerAction: 'all',
            emptyText: perfil.etiquetas.lbEjercicio,
            loadingText: perfil.etiquetas.lbCargando,
            width: 150,
            listeners: {
                select: function (cb, rec, index) {

                }
            }
        });

        /*store y combo de planes*/
        stPlanes = new Ext.data.Store({
            id: 'idstPlanes',
            url: 'listarPlanReporteOACE',
            autoLoad: true,
            listeners: {
                load: function (t, n, e) {
                    cbPlanesresumen.setValue(t.reader.jsonData[0]['idmodelo']);
                    storganodemandante.reload();
                }
            },
            reader: new Ext.data.JsonReader({}, [{
                    name: 'denominacion'
                }, {
                    name: 'idmodelo'
                }])
        });
        cbPlanesresumen = new Ext.form.ComboBox({
            store: stPlanes,
            valueField: 'idmodelo',
            hiddenName: 'idmodelo',
            displayField: 'denominacion',
            fieldLabel: perfil.etiquetas.titPlanes,
            mode: 'local',
            typeAhead: true,
            allowBlank: false,
            editable: true,
            triggerAction: 'all',
            emptyText: perfil.etiquetas.titPlanes,
            loadingText: perfil.etiquetas.lbCargando,
            width: 250
        });

        /*store y combo de OACE*/
        stOACE = new Ext.data.Store({
            url: 'listarOACE',
            id: 'idstOACE',
            autoLoad: true,
            reader: new Ext.data.JsonReader({}, [{
                    name: 'denominacion'
                }, {
                    name: 'idorganosatisface'
                }])
        });
        cbOACE = new Ext.ux.form.LovCombo({
            id: 'cbOACE',
            store: stOACE,
            displayField: 'denominacion',
            valueField: 'idorganosatisface',
            listWidth: 250,
            fieldLabel: perfil.etiquetas.lbOACE,
            editable: true,
            mode: 'local',
            anchor: '95%',
            typeAhead: true,
            triggerAction: 'all',
            disabled: false,
            loadingText: perfil.etiquetas.lbCargando,
            emptyText: perfil.etiquetas.lbSeleccione

        });

        /*store y combo de organodemandante*/
        storganodemandante = new Ext.data.Store({
            url: 'listarOrganosDemandantes',
            id: 'storganodemandante',
            listeners: {
                beforeLoad: function (st, opt) {
                    this.baseParams.idmodelo = cbPlanesresumen.getValue();
                }
            },
            reader: new Ext.data.JsonReader({}, [{
                    name: 'denominacion'
                }, {
                    name: 'idestructura'
                }])
        });
        cborganodemandante = new Ext.ux.form.LovCombo({
            tabIndex: 10,
            emptyText: "Seleccione",
            width: 250,
            listWidth: 250,
            fieldLabel: perfil.etiquetas.lborganodemandante,
            store: storganodemandante,
            valueField: 'idestructura',
            displayField: 'denominacion',
            id: 'cborganodemandante',
            mode: 'local',
            editable: true,
            triggerAction: 'all',
            typeAhead: true,
            selectOnFocus: false
        });

        //panel para mostrar todos los elementos de la ventana de duplicar
        pReporteResumenOACEInterfaz = new Ext.FormPanel({
            id: 'pReporteResumenOACEInterfaz',
            frame: true,
            items: [{
                    layout: 'column',
                    border: 'true',
                    items: [{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: cbEjercicioresumen
                        }
                        , {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: cbPlanesresumen
                        }

                    ]
                }, {
                    layout: 'column',
                    border: 'true',
                    items: [{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: cbOACE
                        }
                        , {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: cborganodemandante
                        }

                    ]
                }]
        });
        winReporteResumenOACEInterfaz = new Ext.Window({
            id: 'winReporteResumenOACEInterfaz',
            modal: true,
            closeAction: 'destroy',
            width: 800,
            height: 150,
            layout: 'fit',
            resizable: false,
            items: pReporteResumenOACEInterfaz,
            constrain: true,
            title: perfil.etiquetas.lbReporteResumenOACE,
            listeners: {
                beforeshow: function () {
                    guardarestadoPanelesResumen();
                    stCbejercicioresumen.reload();
                },
                beforeclose: function () {
                    habilitarPanelIndicadores();
                },
                beforedestroy: function () {
                    habilitarPanelIndicadores();
                },
                beforehide: function () {
                    habilitarPanelIndicadores();
                }
            },
            buttons: [{
                    id: 'btnReporteResumenOACECancelar',
                    iconCls: 'cancelar',
                    tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                    text: perfil.etiquetas.lbCancelar,
                    handler: function () {
                        winReporteResumenOACEInterfaz.destroy();
                    }
                }, {
                    id: 'btnReporteResumenOACEAceptar',
                    iconCls: 'aceptar',
                    tooltip: perfil.etiquetas.msgGuardaryCerrar,
                    text: perfil.etiquetas.lbAceptar,
                    handler: function () {
                        OACESelectIdDinamico = cbOACE.getCheckedValue().split(',');
                        if (cbOACE.getCheckedValue().split(',')[0] != '') {
                            idoace = OACESelectIdDinamico[0];
                            for (var i = 1; i < OACESelectIdDinamico.length; i++) {
                                idoace = idoace + ',' + OACESelectIdDinamico[i];
                            }
                        } else {
                            idoace = "";
                            for (i in stOACE.data.items) {
                                if (stOACE.data.items[i].data) {
                                    if (i == 0)
                                        idoace = stOACE.data.items[i].data.idorganosatisface;
                                    else
                                        idoace = idoace + ',' + stOACE.data.items[i].data.idorganosatisface;
                                }
                            }
                        }

                        entidadesSelectIdDinamico = cborganodemandante.getCheckedValue().split(',');
                        if (cborganodemandante.getCheckedValue().split(',')[0] != '') {
                            idorganosdemandantes = entidadesSelectIdDinamico[0];
                            for (var i = 1; i < entidadesSelectIdDinamico.length; i++) {
                                idorganosdemandantes = idorganosdemandantes + ',' + entidadesSelectIdDinamico[i];
                            }
                        } else {
                            idorganosdemandantes = "";
                            for (i in storganodemandante.data.items) {
                                if (storganodemandante.data.items[i].data) {
                                    if (i == 0)
                                        idorganosdemandantes = storganodemandante.data.items[i].data.idestructura;
                                    else
                                        idorganosdemandantes = idorganosdemandantes + ',' + storganodemandante.data.items[i].data.idestructura;
                                }
                            }
                        }

                        var win = window.open('exportarReporteResumenOACE?idejercicio='
                                + cbEjercicioresumen.getValue()
                                + '&idmodelo=' + cbPlanesresumen.getValue()
                                + '&modelo=' + cbPlanesresumen.getRawValue()
                                + '&ejercicio=' + cbEjercicioresumen.getRawValue()
                                + '&idoace=' + idoace
                                + '&idorganosdemandantes=' + idorganosdemandantes
                                );
                        mascaraExportar(perfil.etiquetas.lbExportandoDatos, perfil.etiquetas.lbEsperePorFavor, win);

                    }
                }]
        });
        winReporteResumenOACEInterfaz.show();
    }
}

function cargarconfgrid(idtipomodelo) {
//controlar acciones
    if (objciPlanes.acciones.rector) {
        Ext.getCmp('btnAprobTodosPlanes').show();
        Ext.getCmp('btnDesTodosPlanes').show();
        Ext.getCmp('btnAprobTodosPlanes').show();
        Ext.getCmp('btnDesTodosPlanes').show();
        if (gestionSegunEstEjercicioPlan) {
            Ext.getCmp('btnAprobTodosPlanes').enable();
            Ext.getCmp('btnDesTodosPlanes').enable();
            Ext.getCmp('btnAprobTodosPlanes').enable();
            Ext.getCmp('btnDesTodosPlanes').enable();
        } else {
            Ext.getCmp('btnAprobTodosPlanes').disable();
            Ext.getCmp('btnDesTodosPlanes').disable();
            Ext.getCmp('btnAprobTodosPlanes').disable();
            Ext.getCmp('btnDesTodosPlanes').disable();
        }

    } else if ((identidadEsODPlanes == 1 || (identidadEsODPlanes == 0 && Ext.getCmp('chglobalPlanes').getValue() == true))) {
        Ext.getCmp('btnAprobPlanes').show();
        Ext.getCmp('btnDesPlanes').show();
        Ext.getCmp('btnAprobTodosPlanes').show();
        Ext.getCmp('btnDesTodosPlanes').show();
        if (gestionSegunEstEjercicioPlan) {
            Ext.getCmp('btnAprobPlanes').enable();
            Ext.getCmp('btnDesPlanes').enable();
            Ext.getCmp('btnAprobTodosPlanes').enable();
            Ext.getCmp('btnDesTodosPlanes').enable();
        } else {
            Ext.getCmp('btnAprobPlanes').disable();
            Ext.getCmp('btnDesPlanes').disable();
            Ext.getCmp('btnAprobTodosPlanes').disable();
            Ext.getCmp('btnDesTodosPlanes').disable();
        }
    } else {
        Ext.getCmp('btnAprobPlanes').hide();
        Ext.getCmp('btnDesPlanes').hide();
        Ext.getCmp('btnAprobTodosPlanes').show();
        Ext.getCmp('btnDesTodosPlanes').show();
        if (gestionSegunEstEjercicioPlan) {
            Ext.getCmp('btnAprobTodosPlanes').enable();
            Ext.getCmp('btnDesTodosPlanes').enable();
        } else {
            Ext.getCmp('btnAprobTodosPlanes').disable();
            Ext.getCmp('btnDesTodosPlanes').disable();
        }

    }

    //fin controlar acciones


    Ext.Ajax.request({
        url: 'getgridinterfaces',
        params: {
            idtipomodelo: idtipomodelo
        },
        callback: function (options, success, response) {
            Ext.getCmp('verpresupuestoPlanes').hide();
            var responseData = Ext.decode(response.responseText);
            if (responseData.cm) {
                reconfgrid(responseData);
                Ext.getCmp('idpModeloPlanes').add(crearGrid(filtrosgpModeloPlanes, stGpGestModeloPlanes, columnasDinamicasgpModeloPlanes, pgGestModeloPlanes, smGpGestModeloPlanes));
                Ext.getCmp('idpModeloPlanes').doLayout();
                stGpGestModeloPlanes.reload();
            } else {
                reconfgrid();
            }
            Ext.getCmp('idpcmPlanes').enable();
            pModeloPlanes.enable();
        }
    });
}

function crearGrid(filtrosgpModeloPlanes, stGpGestModeloPlanes, columnasDinamicasgpModeloPlanes, pgGestModeloPlanes, smGpGestModeloPlanes) {
    return new Ext.grid.EditorGridPanel({
        store: stGpGestModeloPlanes,
        id: 'gpModeloPlanes',
        region: 'center',
        sm: smGpGestModeloPlanes,
        cm: columnasDinamicasgpModeloPlanes,
        frame: true,
        plugins: filtrosgpModeloPlanes,
        margins: '2 2 2 -4',
        clicksToEdit: 2,
        loadMask: {
            msg: 'Cargando...'
        },
        bbar: pgGestModeloPlanes,
        md: new Ext.menu.Menu({
            id: 'mdGrid',
            items: [{
                    text: perfil.etiquetas.lbTtbtnComen,
                    itemCls: 'x-menu-item icondistra-adicionar',
                    iconCls: 'imagen-none',
                    id: 'mdAddcoment',
                    handler: function () {
                        fpComent.getForm().reset();
                        winAddComent.show(Ext.getBody());
                        winAddComent.setTitle(perfil.etiquetas.lbAdicionarC);
                        Ext.getCmp('idelemcoment').setValue(smGpGestModeloPlanes.getSelected().get('idplanificacion'));
                    }
                }/*, {
                 text: perfil.etiquetas.lbVerComent,
                 itemCls: 'x-menu-item icondistra-ver',
                 iconCls: 'imagen-none',
                 disabled: false,
                 id: 'vercomentario',
                 handler: function() {
                 idelementoComentado = smGpGestModeloPlanes.getSelected().get('idplanificacion');
                 mostrarComentarios();
                 }
                 }*/, {
                    text: 'Ajustar',
                    itemCls: 'x-menu-item icondistra-ajustar',
                    iconCls: 'imagen-none',
                    id: 'ajustarind',
                    handler: function () {
                        CargarImporteinicialAjuste();
                    }
                }
            ]
        }),
        listeners: {
            beforeedit: function (e) {
                if (objciPlanes.acciones.rector || Ext.getCmp('chglobalPlanes').getValue() == true)
                    e.cancel = true;
                else {
                    if (e.record.json.idaprobaciondemanda == 1) {
                        columnasDinamicasgpModeloPlanes.getCellEditor(e.column, e.row).field.renderiza = true;
                        fila = e.row;
                        columna = e.column;

                        if (!gestionSegunEstEjercicioPlan) {
                            e.cancel = true; //aki se deshabilita el editable en la columna que se kiere modificar
                        } else {
                            e.cancel = false; //aki se habilita el editable en la columna que se kiere modificar

                        }
                    } else {
                        if ((e.record.json.idaprobaciondemanda == 4 && e.field != "ajuste") || e.record.json.idaprobaciondemanda == 3)
                        {
                            e.cancel = true;
                        }

                    }
                }
            },
            validateedit: function (e) {
                e.cancel = false;
                if (consolidadoPlanes == 1)
                    e.cancel = true;
                if (e.originalValue != e.value)
                    columnasDinamicasgpModeloPlanes.getCellEditor(e.column, e.row).field.renderiza = true;
                else
                    e.cancel = true;
                campo = e.field;
                valor = e.value;
                ValidarOperacionPlanes(campo, valor, e);


            },
            afteredit: function (e) {
                if (columnasDinamicasgpModeloPlanes.config[parseInt(e.column)].editor.field.hasOwnProperty('xtype') && columnasDinamicasgpModeloPlanes.config[parseInt(e.column)].edit.xtype == "datefield") {
                    if (e.value.format('d/m/Y') != e.originalValue.format('d/m/Y')) {
                        Ext.getCmp('btnGuardarPlanes').enable();
                    } else {
                        Ext.getCmp('btnGuardarPlanes').disable();
                    }

                } else {
                    Ext.getCmp('btnGuardarPlanes').enable();
                }

            },
            rowcontextmenu: function (g, r, e) {

                if (Ext.getCmp('chglobalPlanes').getValue() == true || identidadEsODPlanes == 0) {
                    e.stopEvent();
                    ValidateMenu();
                } else {
                    if (!objciPlanes.acciones.rector) {
                        if (smGpGestModeloPlanes.getSelections().length == 1) {
                            if (smGpGestModeloPlanes.getSelected().get('idaprobaciondemanda') == '4') {
                                e.stopEvent();
                                Ext.getCmp('gpModeloPlanes').getSelectionModel().selectRow(r);
                                Ext.getCmp('ajustarind').show();
                                if (gestionSegunEstEjercicioPlan) {
                                    Ext.getCmp('ajustarind').enable();
                                } else {
                                    Ext.getCmp('ajustarind').disable();
                                }

                                ValidateMenu();
                                Ext.getCmp('gpModeloPlanes').md.showAt(e.getXY());
                            }
                        } else if (smGpGestModeloPlanes.getSelections().length > 1) {
                            e.stopEvent();
                            Ext.getCmp('gpModeloPlanes').getSelectionModel().selectRow(r);
                            Ext.getCmp('ajustarind').show();
                            if (gestionSegunEstEjercicioPlan) {
                                Ext.getCmp('ajustarind').enable();
                            } else {
                                Ext.getCmp('ajustarind').disable();
                            }
                            ValidateMenu();
                            Ext.getCmp('gpModeloPlanes').md.showAt(e.getXY());
                        }
                    }
                }
            }
        }
    });
}

function reconfgrid(cf) {

//creando filtros estáticos
    filterDinamicoPlanes = [];
    filterDinamicoPlanes.push({
        type: 'string',
        dataIndex: 'codigo'
    }, {
        type: 'string',
        dataIndex: 'numeropieza'
    }, {
        type: 'string',
        dataIndex: 'denominacion'
    }, {
        type: 'string',
        dataIndex: 'descripcion'
    }, {
        type: 'listado',
        dataIndex: 'umedida',
        idcombo: 'idumedidaindicadores',
        urlcb: urlCbUMPlanes,
        mode: 'remote',
        idstore: 'idstumedidaindicadores',
        valueFieldcb: 'idunidadmedida',
        displayFieldcb: 'denominacionunidadmedida',
        autoload: false

    }, {
        type: 'numeric',
        dataIndex: 'precio'
    }, {
        type: 'numeric',
        dataIndex: 'preciodivisa'
    }, {
        type: 'numeric',
        dataIndex: 'cantidad'
    }, {
        type: 'numeric',
        dataIndex: 'ajuste'
    }, {
        type: 'numeric',
        dataIndex: 'cantidadfinal'
    }, {
        type: 'listado',
        dataIndex: 'centrobalance',
        idcombo: 'idcbcentrobalancenorma',
        urlcb: urlCbCentBalancePlanes,
        idstore: 'idstcentrobalancenorma',
        valueFieldcb: 'centrobalance',
        displayFieldcb: 'centrobalance',
        tpl: '<tpl for="."><div ext:qtip="{centrobalance}" class="x-combo-list-item">{centrobalance}</div></tpl>'
    }
    , {
        type: 'listado',
        dataIndex: 'pais',
        idcombo: 'idcbpaisnorma',
        urlcb: urlCbPaisPlanes,
        idstore: 'idstpais',
        valueFieldcb: 'idpais',
        displayFieldcb: 'nombrepais',
        autoload: false,
        mode: 'remote'
    }, {
        type: 'numeric',
        dataIndex: 'importe'
    }, {
        type: 'numeric',
        dataIndex: 'importeajustado'
    }, {
        type: 'numeric',
        dataIndex: 'importefinal'
    }, {
        type: 'numeric',
        dataIndex: 'flete'
    }, {
        type: 'numeric',
        dataIndex: 'contingencia'
    }, {
        type: 'list',
        dataIndex: 'generadobasesplan',
        options: [[0, 'Directo al plan'], [1, 'Base para el plan (Norma)'], [2, 'Afectado'], [3, 'Otros'], [4, 'Base para el plan (Salida)']]
    }, {
        type: 'list',
        dataIndex: 'idaprobaciondemanda',
        options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector, perfil.etiquetas.lbAjuste]
    }, {
        type: 'listado',
        dataIndex: 'viaadquisicion',
        idcombo: 'idviaadquisicionc',
        urlcb: urlCbVAPlanes,
        mode: 'remote',
        idstore: 'idstvia',
        valueFieldcb: 'denominacion',
        displayFieldcb: 'denominacion',
        // editable: true,
        // readOnly: false,
        autoload: false
    }, {
        type: 'string',
        dataIndex: 'organosatisface'
    }, {
        type: 'listado',
        dataIndex: 'idusuario',
        idcombo: 'idcbusuario',
        valueFieldcb: 'idusuario',
        displayFieldcb: 'nombreusuario',
        st: stUsuarios,
        autoload: false,
        mode: 'local'
    }, {
        type: 'date',
        dataIndex: 'fecha'
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    arrayIndexDinamicos = [];
    arrayIndexDinamicosNum = [];
    arrayIndexDinamicosCad = [];
//creando reader estáticos
    var recPlanes = [];
    recPlanes.push({
        name: 'codigo'
    });
    recPlanes.push({
        name: 'numeropieza'
    });
    recPlanes.push({
        name: 'denominacion'
    });
    recPlanes.push({
        name: 'descripcion'
    });
    recPlanes.push({
        name: 'umedida'
    });
    recPlanes.push({
        name: 'precio'
    });
    recPlanes.push({
        name: 'preciodivisa'
    });
    recPlanes.push({
        name: 'cantidad'
    });
    recPlanes.push({
        name: 'ajuste'
    });
    recPlanes.push({
        name: 'cantidadfinal'
    });
    recPlanes.push({
        name: 'centrobalance'
    });
    recPlanes.push({
        name: 'pais'
    });
    recPlanes.push({
        name: 'importe'
    });
    recPlanes.push({
        name: 'importeajustado'
    });
    recPlanes.push({
        name: 'importefinal'
    });
    recPlanes.push({
        name: 'flete'
    });
    recPlanes.push({
        name: 'contingencia'
    });
    recPlanes.push({
        name: 'generadobasesplan'
    });
    recPlanes.push({
        name: 'idaprobaciondemanda'
    });
    recPlanes.push({
        name: 'viaadquisicion'
    });
    recPlanes.push({
        name: 'organosatisface'
    });
    recPlanes.push({
        name: 'idusuario'
    });
    recPlanes.push({
        name: 'fecha'
    });
//estos son los datos que se usan pero no se listan
    recPlanes.push({
        name: '_is_leaf'
    });
    recPlanes.push({
        name: '_parent'
    });
    recPlanes.push({
        name: 'idplanificacion'
    });
    /*recPlanes.push({
     name: 'comentario'
     });*/
    recPlanes.push({
        name: 'idindicador'
    });
    recPlanes.push({
        name: 'llave'
    });
    recPlanes.push({
        name: 'llaveprimaria'
    });
    //variable para controlar los editores dinamicos de los combos
    //1-es la diferencia entre posicion del arreglo y longitud
    //6-numero de columnas fijas antes de la 1er columna dinamica
    contJRGrid = recPlanes.length + 1 - 6;
    //creando columnmodel estáticos y dinámico
    cmGpPlanes = [];
    dinamica = 0;
    cmGpPlanes.push({
        header: 'Código',
        width: 80,
        sortable: true,
        dataIndex: 'codigo',
        tooltip: perfil.etiquetas.lbCodigo,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Nro. pieza',
        width: 80,
        sortable: true,
        dataIndex: 'numeropieza',
        tooltip: perfil.etiquetas.lbNumPieza,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Denominación',
        width: 250,
        sortable: true,
        dataIndex: 'denominacion',
        tooltip: perfil.etiquetas.lbDenominacion,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Descripción',
        width: 200,
        sortable: true,
        dataIndex: 'descripcion',
        tooltip: perfil.etiquetas.lbDescrip,
        hidden: true,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'UM',
        width: 35,
        sortable: true,
        dataIndex: 'umedida',
        tooltip: perfil.etiquetas.lbUM,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Precio',
        width: 70,
        align: 'right',
        sortable: true,
        dataIndex: 'precio',
        tooltip: perfil.etiquetas.lbPrecio,
        renderer: precioPlanes
    });
    if (cf) {
        for (var index = 0; index < cf.cm.length; index++) {
            if (cf.cm[index].edit.xtype) {
                switch (cf.cm[index].edit.xtype) {
                    case 'numberfield':
                        {
                            cf.cm[index].editor = new Ext.form.NumberField(cf.cm[index].edit);
                            cf.cm[index].tooltip = cf.cm[index].header;
                            cf.cm[index].align = 'right';
                            cf.cm[index].editor.on('focus', function (f) {
                                f.selectText();
                            });
                            var itemsNum = cf.cm;
                            filterDinamicoPlanes.push({
                                type: 'numeric',
                                dataIndex: itemsNum[index].dataIndex
                            });
                            arrayIndexDinamicosNum.push(itemsNum[index].dataIndex);
                        }
                        break;
                    case 'datefield':
                        {
                            cf.cm[index].editor = new Ext.form.DateField(cf.cm[index].edit);
                            cf.cm[index].editor.format = 'd/m/Y';
                            cf.cm[index].tooltip = cf.cm[index].header;
                            filterDinamicoPlanes.push({
                                type: 'date',
                                dataIndex: cf.cm[index].dataIndex
                            });
                            cf.cm[index].renderer = function (v, m, r, ri, ci, st) {
                                if (v) {
                                    if (typeof (v) == 'string') {
                                        var arreg = v.split('-');
                                        v = arreg[2] + '/' + arreg[1] + '/' + arreg[0];
                                        m.attr = 'ext:qtip="' + v + '"';
                                        return v;
                                    } else {
                                        m.attr = 'ext:qtip="' + v.format('d/m/Y') + '"';
                                        return v.format('d/m/Y');
                                    }
                                }
                                return '';
                            }
                        }
                        break;
                    case 'combo':
                        {
                            var item = cf.cm[index].edit;
                            var items = cf.cm;
                            var almacen = new Ext.data.SimpleStore({fields: ['iddatosnomenclador', item.displayField]});
                            var valores = [];
                            for (var j = 0; j < cf.cm[index].edit.store.length; j++) {
                                valores.push(new Ext.data.Record(cf.cm[index].edit.store[j]));
                            }
                            almacen.add(valores);
                            //arreglos de index dinamicos para despues trabajar con ellos
                            arrayIndexDinamicos.push(items[index].dataIndex);
                            cf.cm[index] = {
                                id: items[index].edit.id,
                                header: items[index].header,
                                dataIndex: items[index].dataIndex,
                                sortable: true,
                                width: 180,
                                tooltip: items[index].header,
                                renderer: function (value, cell, rec, row, col) {
                                    var col = col;
                                },
                                editor: new Ext.form.ComboBox({
                                    id: item.id,
                                    hiddenName: item.hiddenName,
                                    name: item.hiddenName,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    allowBlank: item.allowBlank,
                                    emptyText: item.emptyText,
                                    width: 180,
                                    typeAhead: item.typeAhead,
                                    valueField: item.valueField,
                                    displayField: item.displayField,
                                    renderer: crearToolTipPlanes,
                                    store: almacen,
                                    listeners: {
                                        select: function (a, b, c) {
                                            for (var i = 0; i < smGpGestModeloPlanes.getSelections().length; i++) {
                                                stGpGestModeloPlanes.getById(smGpGestModeloPlanes.getSelections()[i].id).set(stGpGestModeloPlanes.getById(smGpGestModeloPlanes.getSelections()[i].id).fields.items[columna + contJRGrid].name, a.getValue());
                                                //stGpGestModeloPlanes.getById(smGpGestModeloPlanes.getSelections()[i].id).set(stGpGestModeloPlanes.getById(smGpGestModeloPlanes.getSelections()[i].id).fields.items[columna + 22].name, a.getValue());
                                            }
                                        }
                                    }

                                })
                            };
                            filterDinamicoPlanes.push({
                                type: 'listado',
                                dataIndex: items[index].dataIndex,
                                valueFieldcb: 'iddatosnomenclador',
                                st: almacen,
                                displayFieldcb: item.displayField,
                                autoload: false
                            });
                        }
                        break;
                    default:
                        {
                            arrayIndexDinamicosCad.push(cf.cm[index].dataIndex);
                            //Hubo que reimplementar el editor porque daba error con las comillas del regex
                            //cf.cm[index].editor = new Ext.form.TextField({cf.cm[index].edit});
                            cf.cm[index].editor = new Ext.form.TextField({
                                allowBlank: cf.cm[index].edit.allowBlank,
                                anchor: cf.cm[index].edit.anchor,
                                fieldLabel: cf.cm[index].edit.fieldLabel,
                                id: cf.cm[index].edit.id,
                                maxLength: cf.cm[index].edit.maxLength,
                                name: cf.cm[index].edit.name,
                                regex: new RegExp(cf.cm[index].edit.regex.substring(1, cf.cm[index].edit.regex.length - 1)),
                                store: cf.cm[index].edit.store,
                                xtype: cf.cm[index].edit.xtype
                            });
                            cf.cm[index].editor.on('focus', function (f) {
                                f.selectText();
                            });
                            cf.cm[index].tooltip = cf.cm[index].header;
                            filterDinamicoPlanes.push({
                                type: 'string',
                                dataIndex: cf.cm[index].dataIndex
                            });
                        }
                        break;
                }
                cmGpPlanes.push(cf.cm[index]);
            }
        }

        for (var index = 0; index < cf.rd.length; index++) {
            recPlanes.push(cf.rd[index]);
        }
    }
    cmGpPlanes.push({
        header: 'Precio MLC',
        width: 80,
        sortable: true,
        align: 'right',
        hidden: false,
        dataIndex: 'preciodivisa',
        tooltip: perfil.etiquetas.lbPrecioMLC,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Cantidad',
        width: 70,
        align: 'right',
        sortable: true,
        dataIndex: 'cantidad',
        tooltip: perfil.etiquetas.lbCant,
        renderer: CantidadPlanes,
        minValue: 0,
        editor: new Ext.form.NumberField({
            //name: 'cantidad',
            allowBlank: false,
            //decimalPrecision: 6,
            minValue: 0,
            listeners: {
                focus: function (f) {
                    f.selectText();
                }
            }
        })
    });
    cmGpPlanes.push({
        header: 'Ajuste',
        width: 70,
        sortable: true,
        dataIndex: 'ajuste',
        align: 'right',
        tooltip: perfil.etiquetas.lbAjuste,
        renderer: CantidadPlanes,
        editable: false,
        editor: new Ext.form.NumberField({
            name: 'ajuste',
            allowBlank: false,
            decimalPrecision: 6,
            listeners: {
                focus: function (f) {
                    f.selectText();
                }
            }
        })
    });
    cmGpPlanes.push({
        header: 'Cantidad final',
        width: 90,
        align: 'right',
        sortable: true,
        dataIndex: 'cantidadfinal',
        tooltip: perfil.etiquetas.lbCantidadFinal,
        renderer: CantidadPlanes
    });
    cmGpPlanes.push({
        header: 'Centro de balance',
        width: 150,
        sortable: true,
        dataIndex: 'centrobalance',
        tooltip: perfil.etiquetas.lbCentroBalance,
        hidden: true,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'País',
        width: 200,
        sortable: true,
        dataIndex: 'pais',
        tooltip: perfil.etiquetas.lbPais,
        hidden: true,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Importe inicial',
        width: 90,
        align: 'right',
        sortable: true,
        dataIndex: 'importe',
        tooltip: 'Importe inicial',
        minValue: 0,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Importe ajuste',
        width: 90,
        align: 'right',
        sortable: true,
        dataIndex: 'importeajustado',
        tooltip: perfil.etiquetas.lbImporteAjustado,
        minValue: 0,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Importe final',
        align: 'right',
        width: 90,
        sortable: true,
        dataIndex: 'importefinal',
        tooltip: perfil.etiquetas.lbImporteFinal,
        minValue: 0,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Importe flete',
        width: 90,
        sortable: true,
        align: 'right',
        dataIndex: 'flete',
        tooltip: perfil.etiquetas.lbImporteFS,
        minValue: 0,
        hidden: true,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Importe cont.',
        width: 90,
        align: 'right',
        sortable: true,
        dataIndex: 'contingencia',
        tooltip: perfil.etiquetas.lbImporteConting,
        minValue: 0,
        hidden: true,
        renderer: crearToolTipPlanes
    });
    cmGpPlanes.push({
        header: 'Origen',
        width: 60,
        sortable: true,
        dataIndex: 'generadobasesplan',
        tooltip: perfil.etiquetas.lbOrigen,
        renderer: EsdeBasePlanPPLanes
    });
    cmGpPlanes.push({
        header: 'Aprobado',
        width: 60,
        align: 'center',
        sortable: true,
        dataIndex: 'idaprobaciondemanda',
        tooltip: perfil.etiquetas.lbAprobado,
        renderer: ColumnaAprobacionPLanes
    });
    cmGpPlanes.push({
        header: 'Vía de adquisición',
        width: 110,
        sortable: true,
        hidden: false,
        dataIndex: 'viaadquisicion',
        tooltip: perfil.etiquetas.lbViaAdquisicion,
        renderer: crearToolTipPlanes

    });
    cmGpPlanes.push({
        header: 'Órgano satisface',
        width: 110,
        sortable: true,
        hidden: false,
        dataIndex: 'organosatisface',
        tooltip: perfil.etiquetas.lbOrganoSatis,
        renderer: crearToolTipPlanes

    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbUsuario,
        width: 110,
        sortable: true,
        hidden: false,
        dataIndex: 'idusuario',
        tooltip: perfil.etiquetas.lbUsuario,
        renderer: renderUsuarios

    });
    cmGpPlanes.push({
        header: perfil.etiquetas.lbFechaM,
        width: 110,
        sortable: true,
        hidden: false,
        dataIndex: 'fecha',
        tooltip: perfil.etiquetas.lbFechaMtip,
        renderer: renderFecha

    });
    jrStGpGestModeloPlanes = new Ext.data.JsonReader({
        totalProperty: 'total',
        importetotal: 'importetotal',
        importedivisatotal: 'importedivisatotal',
        importeflete: 'importeflete',
        importecontingencia: 'importecontingencia',
        cantidadfinal: 'cantidadfinal',
        llave: 'llave',
        llaveprimaria: 'llaveprimaria',
        root: 'data',
        id: 'jrStGpGestModeloPlanes',
        fields: recPlanes
    });
    columnasDinamicasgpModeloPlanes = new Ext.grid.ColumnModel(cmGpPlanes);
//para recorrer los indices dinamicos y trabajar con el render
    for (var i = 0; i < arrayIndexDinamicos.length; i++) {
        var indiceColumn = columnasDinamicasgpModeloPlanes.findColumnIndex(arrayIndexDinamicos[i]);
        columnasDinamicasgpModeloPlanes.setRenderer(indiceColumn, function (value, m, rec, row, col) {
            // aqui se controla la columna completa, para todas las filas
            if (!objciPlanes.acciones.rector && Ext.getCmp('chglobalPlanes').getValue() == false && identidadEsODPlanes == 1) {
                columnasDinamicasgpModeloPlanes.setEditable(col, true);
            } else {
                columnasDinamicasgpModeloPlanes.setEditable(col, false);
            }
            m.attr = 'ext:qtip="' + getRawValue(value, columnasDinamicasgpModeloPlanes.getCellEditor(col, row).field, columnasDinamicasgpModeloPlanes, col) + '"';
            return getRawValue(value, columnasDinamicasgpModeloPlanes.getCellEditor(col, row).field, columnasDinamicasgpModeloPlanes, col);
        });
    }


    tfImportePlanes = new Ext.form.TextField({
        id: 'idtfImportePlan',
        width: 90,
        align: 'right',
        disabled: false,
        editable: false,
        emptyText: '0.000'
    });
    tfcantidadfinalPlanes = new Ext.form.TextField({
        id: 'idtfcantidadfinal',
        width: 90,
        align: 'right',
        disabled: false,
        editable: false,
        emptyText: '0.000'
    });
    stCbImportesPlanes = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporteMNTotal],
            [3, perfil.etiquetas.lbImporteFlete],
            [4, perfil.etiquetas.lbImporteConti],
            [5, perfil.etiquetas.lbImporteAjuste],
            [6, perfil.etiquetas.lbImporteFinal]
        ]
    });
    cbImportesPlanes = new Ext.form.ComboBox({
        value: 1,
        id: 'idcbImportesPlanes',
        store: stCbImportesPlanes,
        displayField: 'denominacion',
        typeAhead: true,
        listWidth: 100,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 80,
        emptyText: 'Seleccionar',
        listeners: {
            select: function (cb, record, index) {
                tfImportePlanes.setValue(importesPlanes[record.data.idimporte]);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    stGpGestModeloPlanes = new Ext.data.Store({
        url: urlListarPlanes,
        listeners: {
            beforeLoad: function (st, opt) {
                Ext.Ajax.timeout = 600000; //10min
                this.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                this.baseParams.hoja = hojaPlanes;
                this.baseParams.idmodelo = treePlanSelect;
                this.baseParams.start = offsetGpGestModeloPlanes;
                this.baseParams.glob = Ext.getCmp('chglobalPlanes').getValue();
                this.baseParams.identidadmodelo = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
                this.baseParams.identidad = identidadselectedPlanes;
                this.baseParams.filtrosD = Ext.encode(filtrosgpModeloPlanes.getFilterData());
                cambiarTituloFiltrar();
            },
            load: function (st, rec, obj) {
                if (!objciPlanes.acciones.rector && gestionSegunEstEjercicioPlan && identidadEsODPlanes == 1 && (Ext.getCmp('chglobalPlanes').getValue() == false || hojaPlanes)) {
                    Ext.getCmp('btnAdicionarIndsPlanes').enable();
                    Ext.getCmp('btnImportarPlanes').enable();
                } else {
                    Ext.getCmp('btnAdicionarIndsPlanes').disable();
                    Ext.getCmp('btnImportarPlanes').disable();
                }
                Ext.getCmp('btnEliminarIndsPlanes').disable();
                Ext.getCmp('btnGuardarPlanes').disable();

                if (st.getCount() != 0) {
                    if (identidadEsODPlanes == 0) {
                        if ((hojaPlanes) || (Ext.getCmp('chglobalPlanes').getValue() == false) && identidadselectedPlanes != null)
                            mostrarMensaje(1, 'La entidad seleccionada no posee el comportamiento órgano demandante');
                    }
                    calcularImporteTotalPlanes();
                    siexisteIndEnModeloFiltradoPlanes();
                    upColorCell();
                    Ext.getCmp('menuAprobIndPlanes').enable();
                } else {
                    Ext.getCmp('menuAprobIndPlanes').disable();
                }
                habilitarDesabilitarPlanes(false);
                habilitarDesabilitarAprobacionAjustePlanes(false);
                Ext.getBody().unmask();
            },
            loadexception: function () {
                mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
            }
        },
        reader: jrStGpGestModeloPlanes
    });
    filtrosgpModeloPlanes = new Ext.grid.GridFilters({
        id: 'filtros',
        filters: filterDinamicoPlanes
    });
    btnLimpiarFiltrosPlanes = new Ext.Button({
        id: 'btntodoslimp',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosgpModeloPlanes.clearFilters();
        }
    });
    if (objciPlanes.acciones.rector) {
        pgGestModeloPlanes = new Ext.PagingToolbar({
            pageSize: 20,
            id: 'pagGpModeloPlanes',
            store: stGpGestModeloPlanes,
            displayInfo: true,
            items: [btnLimpiarFiltrosPlanes, '-', cbImportesPlanes, {
                    xtype: 'tbtext',
                    text: '<b>:</b>'
                }, tfImportePlanes/*, '-', {
                 xtype: 'tbtext',
                 text: '<b>Cantidad final:</b>'
                 }, tfcantidadfinalPlanes*/],
            listeners: {
                beforechange: function (p, e) {
                    offsetGpGestModeloPlanes = e.start;
                }
            }
        });
    } else {
        pgGestModeloPlanes = new Ext.PagingToolbar({
            pageSize: 20,
            id: 'pagGpModeloPlanes',
            store: stGpGestModeloPlanes,
            displayInfo: true,
            items: [btnLimpiarFiltrosPlanes, '-', cbImportesPlanes, {
                    xtype: 'tbtext',
                    text: '<b>:</b>'
                }, tfImportePlanes],
            listeners: {
                beforechange: function (p, e) {
                    offsetGpGestModeloPlanes = e.start;
                }
            }
        });
    }

    if (urlListarPlanes == urlListarPlanesConsolidacionPlanes) {
        stGpGestModeloPlanes.baseParams.idmodelo = treePlanSelect;
        stGpGestModeloPlanes.baseParams.calcular = calcular;
        stGpGestModeloPlanes.baseParams.modelos = Ext.encode(tpBasePlanes.getChecked("idmodelo", nodo));
    }
}

function crearIUAddModModeloPlanes() {
//if (!winAddModeloPlanes) {
    fpModeloPlanes = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbDenominacion,
                                allowBlank: false,
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ, _-]*)+$/,
                                id: 'denominacionPlanes',
                                anchor: '100%'
                            }, {
                                xtype: 'hidden',
                                id: 'idmodeloPlanes'
                            }, {
                                xtype: 'hidden',
                                id: 'idplanmPlanes'
                            }
                        ]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [
                            {
                                displayField: 'denominacion',
                                xtype: 'combo',
                                id: 'idcmbtipomodeloPlanes',
                                valueField: 'idtipomodelo',
                                hiddenName: 'idtipomodelo',
                                triggerAction: 'all',
                                typeAhead: true,
                                editable: true,
                                forceSelection: true,
                                validateOnBlur: true,
                                loadingText: 'Cargando...',
                                mode: 'remote',
                                anchor: '100%',
                                fieldLabel: perfil.etiquetas.lbTipodemodelo,
                                allowBlank: false,
                                blankText: perfil.etiquetas.msgErrorCargaNula,
                                emptyText: perfil.etiquetas.lbSeleccione,
                                store: stTipoModelPlanes

                            }]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Clasificación del plan',
                                allowBlank: false,
                                editable: false,
                                id: 'tfclasificacionPlanes',
                                anchor: '100%',
                                listeners: {
                                    focus: function () {
                                        ConstruirWinArbolClasificacionPlanPlanes(accPlanes);
                                    }
                                }
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                displayField: 'nombreaccion',
                                xtype: 'combo',
                                id: 'idcmbtipoplanPlanes',
                                valueField: 'idaccion',
                                hiddenName: 'idaccion',
                                triggerAction: 'all',
                                typeAhead: true,
                                editable: true,
                                forceSelection: true,
                                validateOnBlur: true,
                                mode: 'local',
                                anchor: '100%',
                                fieldLabel: 'Tipo de plan',
                                allowBlank: false,
                                blankText: perfil.etiquetas.msgErrorCargaNula,
                                emptyText: perfil.etiquetas.lbSeleccione,
                                store: sttipoplanPlanes,
                                listeners: {
                                    select: function (combo, record) {
                                    }
                                }
                            }, {
                                id: 'chkbalancematerialPlanes',
                                xtype: 'checkbox',
                                width: 160,
                                hideLabel: true,
                                boxLabel: 'Balance material',
                                listeners: {
                                    render: function (ch, chequeado) {
                                    }
                                }
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                id: 'descripcionPlanes',
                                anchor: '100%',
                                fieldLabel: perfil.etiquetas.lbDescripcion,
                                editable: false,
                                allowBlank: false
                            }]
                    }]
            }]
    });
    var btnCancelarModelo = new Ext.Button({
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbBtnCancelar,
        disabled: false,
        tooltip: 'Cerrar ventana sin guardar los datos.',
        handler: function () {
            Ext.getCmp('idwinAddModeloPlanes').destroy();
        }
    });
    btnAplicarModelo = new Ext.Button({
        iconCls: 'aplicar',
        id: 'idaplicarplanPlanes',
        disabled: true,
        text: perfil.etiquetas.lbBtnAplicar + '<b>',
        tooltip: 'Guardar datos y limpiar los campos.',
        handler: function () {
            adicionarModeloPlanes(true);
        }
    });
    var btnAceptarModelo = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnaceptarPlanes',
        disabled: true,
        text: perfil.etiquetas.lbBtnAceptar + '<b>',
        tooltip: 'Guardar datos y cerrar ventana.',
        handler: function () {
            adicionarModeloPlanes(false);
        }
    });
    //Ventana para la adici�n y edici�n de modelos
    winAddModeloPlanes = new Ext.Window({
        modal: true,
        id: 'idwinAddModeloPlanes',
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        //cls: 'ventanaAdelante',
        //x: 100,
        //y: 100,
        title: perfil.etiquetas.lbTtbtnAdd,
        width: 385,
        height: 410,
        items: fpModeloPlanes,
        buttons: [btnCancelarModelo, btnAplicarModelo, btnAceptarModelo],
        listeners: {
            beforeshow: function () {
                Ext.getCmp('idcmbtipoplanPlanes').clearValue();
                stTipoModelPlanes.load();

                guardarEstadoPaneles();
            }, beforeclose: function () {
                habilitarPanelIndicadores();
            }, beforedestroy: function () {
                habilitarPanelIndicadores();
            }, beforehide: function () {
                habilitarPanelIndicadores();

            }
        }
    }).show();
    //}
}

function adicionarModeloPlanes(aplyPlanes) {
    if (accionPlanes == 1)
        var mensa = perfil.etiquetas.lbModificarPP;
    else if (accionPlanes == 2)
        var mensa = perfil.etiquetas.lbAdicionarPP;
    var chequeado;
    if (Ext.getCmp('chkbalancematerialPlanes').getValue()) {
        chequeado = 1;
    } else {
        chequeado = 0;
    }
    if (fpModeloPlanes.getForm().isValid()) {
        fpModeloPlanes.getForm().submit({
            url: 'adicionarModelo',
            timeout: 120000,
            params: {
                identidad: identidadselectedPlanes,
                idejercicio: cbEjercicioPlanes.getValue(),
                tipoplan: Ext.getCmp('idcmbtipoplanPlanes').getValue(),
                rectora: rectoraPlanes,
                idclasif: nodeIdsPlanes,
                idplan: tpBasePlanes.getSelectionModel().getSelectedNode().id,
                balancematerial: chequeado
            },
            waitMsg: mensa,
            failure: function (form, action) {
                if (action.result.codMsgA == 1) {
                    if (action.result.mensaje == 'Add')
                        mostrarMensaje(1, perfil.etiquetas.msgAddModelo);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgModModelo);
                    if (!aplyPlanes) {
                        Ext.getCmp('idwinAddModeloPlanes').destroy();
                    }
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAction)
                }
                if (!aplyPlanes) {
                    Ext.getCmp('idtpBasePlanes').getSelectionModel().getSelectedNode().parentNode.reload();
                }
            }
        });
    } else {
        control1Planes = 2;
        mostrarMensaje(1, perfil.etiquetas.msgEstadoCampo);
    }
}

function ConstruirWinArbolClasificacionPlanPlanes(accionPlanes) {
    if (winClasifPlanesPlanes)
        winClasifPlanesPlanes.destroy();
    var htmlruta = '<spam style="margin-left:1em;">Trazabilidad:</spam><spam style="margin-left:1em;"></spam>' + rutaPlanes;
    if (denominacionclasifPlanes == '') {
        htmlruta = '<spam style="font-size:11px;color:red;margin-top:2em;margin-left:1em;margin-bottom:2em;">Seleccione la clasificaci&oacute;n deseada...</spam>';
    }

//label donde se almacena la trazabilidad de la clasificacion
    var tfdenominacioncaractPlanes = new Ext.form.Label({
        html: htmlruta,
        style: 'font-size:11px;color:red;margin-top:2em;margin-left:1em;margin-bottom:2em;',
        listeners: {
            render: function (field) {
                if (tpBasePlanes.getSelectionModel().getSelectedNode()) {
                    if (tpBasePlanes.getSelectionModel().getSelectedNode().attributes.ruta != null)
                        field.setText('Trazabilidad: ' + tpBasePlanes.getSelectionModel().getSelectedNode().attributes.ruta);
                }

            }
        }
    });
    //loader del arbol donde se muestran las clasificaciones anidadas
    loadertpClasifPlanesPlanes = new Ext.tree.TreeLoader({
        dataUrl: 'cargarClasifPlanes',
        listeners: {
            beforeload: function (tl, n) {
                var uri = 'tipodeplan';
                var ruta = '';
                if (tpBasePlanes.getSelectionModel().getSelectedNode()) {
                    ruta = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.rutaids;
                }
                this.baseParams = {
                    uri: uri,
                    ruta: ruta,
                    iddatosnomenclador: n.attributes.iddatosnomenclador
                };
            }
        }
    });
    //arbol donde se muestran las clasificaciones anidadas
    tpClasifPlanesPlanes = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        border: false,
        region: 'center',
        id: 'tpClasifPlanesPlanes',
        height: 310,
        listeners: {
            click: function (node, e) {
                rutaPlanes = '';
                denominacionclasifPlanes = '';
                nodeIdsPlanes = '';
                while (node.parentNode) {
                    if (rutaPlanes == '') {
                        rutaPlanes = '<spam style="font-size:11px;color:red;margin-top:2em;margin-bottom:2em;"><strong>' + node.text + '</strong></spam>';
                        denominacionclasifPlanes = node.text;
                    } else {
                        rutaPlanes = '<spam style="font-size:11px;color:red;margin-top:2em;margin-bottom:2em;"><strong>' + node.text + '</strong></spam>' + " ->" + rutaPlanes;
                        denominacionclasifPlanes = node.text + " -> " + denominacionclasifPlanes;
                    }
                    nodeIdsPlanes = node.id + "+" + nodeIdsPlanes;
                    node = node.parentNode;
                }

                if (rutaPlanes != '') {
                    Ext.getCmp('ptextPlanes').remove(tfdenominacioncaractPlanes);
                    tfdenominacioncaractPlanes = new Ext.form.Label({
                        id: 'tfdenominacioncaractPlanes',
                        html: '<spam style="margin-left:1em;">Trazabilidad:</spam><spam style="margin-left:1em;"></spam>' + rutaPlanes
                    });
                    Ext.getCmp('ptextPlanes').add(tfdenominacioncaractPlanes);
                    Ext.getCmp('ptextPlanes').doLayout();
                }

            }

        },
        loader: loadertpClasifPlanesPlanes,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Clasificaciones',
            tipo: 0,
            expanded: true,
            id: '0'
        })

    });
    //ventana donde se muestran las opciones para escoger la clasificacion del plan
    winClasifPlanesPlanes = new Ext.Window({
        title: accPlanes + ' clasificaci&oacute;n del plan',
        modal: true,
        constrain: true,
        height: 400,
        width: 450,
        x: 30,
        y: 100,
        layout: 'border',
        //cls: 'ventanaMasAdelante',
        resizable: false,
        items: [
            new Ext.Panel({
                region: 'north',
                id: 'ptextPlanes',
                layout: 'form',
                height: 20,
                border: false,
                items: tfdenominacioncaractPlanes
            }),
            tpClasifPlanesPlanes],
        buttons: [
            new Ext.Button({
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos.',
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function () {
                    winClasifPlanesPlanes.destroy();
                }
            }),
            new Ext.Button({
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                id: 'btnaceptar1',
                tooltip: 'Guardar datos y cerrar ventana.',
                text: perfil.etiquetas.lbBtnAceptar,
                handler: function () {

                    Ext.getCmp('tfclasificacionPlanes').setRawValue(denominacionclasifPlanes);
                    Ext.getCmp('tfclasificacionPlanes').clearInvalid();
                    winClasifPlanesPlanes.destroy();
                }
            })
        ]

    });
    winClasifPlanesPlanes.show();
}

function funWinAsociarPlanes() {

    var btnCancelarAsociarPlanes = new Ext.Button({
        text: perfil.etiquetas.lbBtnCancelar,
        id: 'btnCancelarAsociarPlanes',
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        disabled: false,
        handler: function () {
            checkCAsociarPlanes.clearSelections();
            winAsociarPlanes.hide();
        }
    });
    var btnAceptarAsociarPlanes = new Ext.Button({
        text: perfil.etiquetas.lbBtnAceptar,
        id: 'btnAceptarAsociarPlanes',
        //icon: perfil.dirImg + 'aceptar.png',
        tooltip: perfil.etiquetas.lbTtbtnAceptar,
        iconCls: 'aceptar',
        disabled: false,
        handler: function () {
            asociarEntidadesPlanes();
            checkCAsociarPlanes.clearSelections();
            winAsociarPlanes.hide();
        }
    });
    var btnAplicarAsociarPlanes = new Ext.Button({
        text: perfil.etiquetas.lbBtnAplicar,
        id: 'btnAplicarAsociarPlanes',
        //icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        tooltip: perfil.etiquetas.lbTtbtnAplicar,
        disabled: false,
        handler: function () {
            asociarEntidadesPlanes();
            checkCAsociarPlanes.clearSelections();
        }
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtrosAsociarPlanes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'text'
            }]
    });
    checkCAsociarPlanes = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    cmGpAsociarPlanes = new Ext.grid.ColumnModel([
        checkCAsociarPlanes,
        {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'text'
        }]);
    smGpAsociarPlanes = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    stGpAsociarPlanes = new Ext.data.Store({
        url: 'cargarEntidadesCompDemandante',
        listeners: {
            beforeload: function () {
                this.baseParams = {
                    idmodelo: treePlanSelect
                };
            },
            load: function (t, r, o) {
                var array = new Array();
                for (var i = 0; i < r.length; i++) {
                    if (r[i].data.checked == true) {
                        array.push(r[i]);
                    }
                }
                checkCAsociarPlanes.selectRecords(array);
                siexisteindFiltradoAsociarPlanes();
                if (r.length == 0)
                    mostrarMensaje(1, perfil.etiquetas.msgAsociadasTodas)
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'id'
        }, [{
                name: 'text'
            }, {
                name: 'checked'
            }])
    });
    var gpAsociarPlanes = new Ext.grid.GridPanel({
        store: stGpAsociarPlanes,
        loadMask: stGpAsociarPlanes,
        cm: cmGpAsociarPlanes,
        height: 200,
        sm: checkCAsociarPlanes,
        plugins: filtrosAsociarPlanes,
        autoExpandColumn: 'expandir',
        region: 'center',
        id: 'gpAsociarPlanes'
    });
    stGpAsociarPlanes.load();
    winAsociarPlanes = new Ext.Window({
        width: 300,
        constrain: true,
        title: perfil.etiquetas.lbBtnAsociarEntidad,
        autoHeight: true,
        layout: 'fit',
        closeAction: 'hide',
        buttons: [btnCancelarAsociarPlanes, btnAplicarAsociarPlanes, btnAceptarAsociarPlanes],
        items: [gpAsociarPlanes]
    })
}

function asociarEntidadesPlanes() {
    mascaraPlanes('Asociando las entidades', 1);
    var entidades = new Array();
    if (checkCAsociarPlanes.hasSelection())
        for (p in checkCAsociarPlanes.getSelections()) {
            if (checkCAsociarPlanes.getSelections()[p].id)
                entidades.push(checkCAsociarPlanes.getSelections()[p].id);
        }
    Ext.Ajax.request({
        url: 'asociarModelo',
        params: {
            idmodelo: treePlanSelect,
            entidades: Ext.encode(entidades)
        },
        callback: function (options, success, response) {
            mascaraPlanes('', 0);
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgAs == 1) {
                mostrarMensaje(1, perfil.etiquetas.msgAsociarEntidad);
                stGpAsociarPlanes.reload();
            } else
                mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
        }
    });
}

function funDesAsociarPlanes() {
    var btnCancelarDesAsociarPLanes = new Ext.Button({
        text: perfil.etiquetas.lbBtnCancelar,
        id: 'btnCancelarDesAsociarPlanes',
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        disabled: false,
        handler: function () {
            checkCDesAsociarPlanes.clearSelections();
            winDesAsociarPlanes.hide();
        }
    });
    var btnAceptarDesAsociarPLanes = new Ext.Button({
        text: perfil.etiquetas.lbBtnAceptar,
        id: 'btnAceptarDesAsociarPlanes',
        //icon: perfil.dirImg + 'aceptar.png',
        tooltip: perfil.etiquetas.lbTtbtnAceptar,
        iconCls: 'aceptar',
        disabled: false,
        handler: function () {
            desasociarEntidadesPlanes();
            checkCDesAsociarPlanes.clearSelections();
            winDesAsociarPlanes.hide();
        }
    });
    var btnAplicarDesAsociarPlanes = new Ext.Button({
        text: perfil.etiquetas.lbBtnAplicar,
        id: 'btnAplicarDesAsociarPlanes',
        //icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        tooltip: perfil.etiquetas.lbTtbtnAplicar,
        disabled: false,
        handler: function () {
            desasociarEntidadesPlanes();
            checkCDesAsociarPlanes.clearSelections();
        }
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtrosDesAsociarPlanes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'text'
            }]
    })
    checkCDesAsociarPlanes = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    cmGpDesAsociarPlanes = new Ext.grid.ColumnModel([
        checkCDesAsociarPlanes,
        {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            renderer: crearToolTipPlanes,
            sortable: true,
            dataIndex: 'text'
        }]);
    smGpDesAsociarPlanes = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    stGpDesAsociarPlanes = new Ext.data.Store({
        url: 'cargarEntidadesDesasociar',
        listeners: {
            beforeload: function () {
                this.baseParams = {
                    idmodelo: idelemsel
                };
            },
            load: function (t, r, o) {
                var array = new Array();
                for (var i = 0; i < r.length; i++) {
                    if (r[i].data.checked == true) {
                        array.push(r[i]);
                    }
                }
                checkCDesAsociarPlanes.selectRecords(array);
                siexisteindFiltradoDesAsociarPlanes();
                if (r.length == 0)
                    mostrarMensaje(1, perfil.etiquetas.msgDessociadasTodas)
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'id'
        }, [{
                name: 'text'
            }, {
                name: 'checked'
            }])
    });
    var gpDesAsociarPlanes = new Ext.grid.GridPanel({
        store: stGpDesAsociarPlanes,
        loadMask: {
            msg: 'Cargando...'
        },
        cm: cmGpDesAsociarPlanes,
        height: 200,
        sm: checkCDesAsociarPlanes,
        plugins: filtrosDesAsociarPlanes,
        autoExpandColumn: 'expandir',
        region: 'center',
        id: 'gpDesAsociarPlanes'
    });
    stGpDesAsociarPlanes.load();
    winDesAsociarPlanes = new Ext.Window({
        width: 300,
        constrain: true,
        title: 'Desasociar planes',
        autoHeight: true,
        layout: 'fit',
        closeAction: 'hide',
        buttons: [btnCancelarDesAsociarPLanes, btnAplicarDesAsociarPlanes, btnAceptarDesAsociarPLanes],
        items: [gpDesAsociarPlanes]
    })
}

function desasociarEntidadesPlanes() {
    Ext.MessageBox.show({
        title: 'Por favor espere...',
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        msg: 'Desasociando las entidades'
    });
    var entidades = new Array();
    if (checkCDesAsociarPlanes.hasSelection())
        for (p in checkCDesAsociarPlanes.getSelections()) {
            if (checkCDesAsociarPlanes.getSelections()[p].id)
                entidades.push(
                        [checkCDesAsociarPlanes.getSelections()[p].id,
                            checkCDesAsociarPlanes.getSelections()[p].json.identidadmodelo]
                        )

        }
    Ext.Ajax.request({
        url: 'desasociarModelo',
        params: {
            idmodelo: treePlanSelect,
            entidades: Ext.encode(entidades)
        },
        callback: function (options, success, response) {
            Ext.getBody().unmask();
            Ext.MessageBox.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 21) {
                mostrarMensaje(1, 'El plan ha sido desasociado satisfactoriamente.');
                stGpDesAsociarPlanes.reload();
            } else if (responseData.codMsg == 22) {
                mostrarMensaje(1, 'EL plan no ha sido desasociado, hubo un error a la hora de desasociar.');
            } else if (responseData.codMsg == 24) {
                mostrarMensaje(1, 'No existe plan asociado a la entidad seleccionada.');
            }

        }
    });
}

function cambiarEstadoTodosPlanes(valor) {
    if (desaprobar == 1) {
        var mensaje;
        mensaje = 'Desaprobando todos los indicadores.'
    } else {
        mensaje = 'Aprobando todos los indicadores.'
    }

    var arrayidindicadores = [];
    if (stGpGestModeloPlanes.getCount() >= 1) {
        for (var i = 0; i < stGpGestModeloPlanes.getCount(); i++) {
            arrayidindicadores.push(stGpGestModeloPlanes.getAt(i).get('idindicador'));
        }
    }
    if (desaprobar == 1) {
        var mensaje1;
        mensaje1 = perfil.etiquetas.msgComprobarDesTodos;
    } else {
        mensaje1 = perfil.etiquetas.msgComprobarTodos;
    }
    mostrarMensaje(2, mensaje1, function (btn) {
        if (btn == 'ok') {
            Ext.Ajax.request({
                url: 'aprobarTodos',
                params: {
                    identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                    idmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    aprobado: valor,
                    idejercicio: cbEjercicioPlanes.getValue(),
                    identidad: identidadselectedPlanes,
                    rectora: rectoraPlanes,
                    glob: Ext.getCmp('chglobalPlanes').getValue()

                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgM == 1) {
                        if (valor == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoTodo);
                            stGpGestModeloPlanes.reload();
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgAprobadoTodo);
                            stGpGestModeloPlanes.reload();
                        }

                    } else {
                        if (responseData.codMsgM == 3) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorAction)
                        }
                        if (responseData.codMsgM == 21) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorAprobarNecesidad)
                        }
                        if (responseData.codMsgM == 22) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorDesaprobar)
                        }
                    }
                }
            });
        }
    }
    );
}

function cambiarEstadoPlanes(valor) {
    var long = smGpGestModeloPlanes.getSelections().length;
    var msgsalida = '';
    var msgrespuesta = '';
    if (desaprobar == 1) {
        if (long == 1) {
            msgsalida = perfil.etiquetas.msgComprobarDesap1;
            msgrespuesta = perfil.etiquetas.msgDesaprobado1;
        } else {
            msgsalida = perfil.etiquetas.msgComprobarDesap2;
            msgrespuesta = perfil.etiquetas.msgDesaprobado2;
        }

    } else {
        if (long == 1) {
            msgsalida = perfil.etiquetas.msgComprobarAbrob1;
            msgrespuesta = perfil.etiquetas.msgAprobado1;
        } else {
            msgsalida = perfil.etiquetas.msgComprobarAbrob2;
            msgrespuesta = perfil.etiquetas.msgAprobado2;
        }
    }
    if (smGpGestModeloPlanes.getSelections().length >= 1) {
        var aux = smGpGestModeloPlanes.getSelections();
        var arreglo = [];
        for (pos in aux) {
            if (aux[pos].id) {
                arreglo.push(aux[pos].data.idplanificacion);
            }
        }


        mostrarMensaje(2, msgsalida, function (btn) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url: 'aprobarDesaprobar',
                    params: {
                        arrayidplanificacion: Ext.encode(arreglo),
                        aprobado: valor,
                        rectora: rectoraPlanes
                    },
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgAD == 1) {
                            if (valor == 1) {
                                mostrarMensaje(1, msgrespuesta);
                                stGpGestModeloPlanes.reload();
                            } else {
                                mostrarMensaje(1, msgrespuesta);
                                stGpGestModeloPlanes.reload();
                            }
                        } else {
                            if (responseData.codMsgAD == 3) {
                                mostrarMensaje(1, perfil.etiquetas.msgErrorAction)
                            }
                            if (responseData.codMsgAD == 21) {
                                mostrarMensaje(1, perfil.etiquetas.msgErrorAprobarNecesidad)
                            }
                            if (responseData.codMsgAD == 22) {
                                mostrarMensaje(1, perfil.etiquetas.msgErrorDesaprobar)
                            }
                        }
                        mymask.hide();
                    }

                });
            }
        }
        );
    } else
        mostrarMensaje(1, perfil.etiquetas.msgSeleccionparaAprobar)
}

function cambiarEstadoAjusteTodosPlanes(valor) {
    if (aprobarajustePlanes == 0) {
        var mensaje;
        mensaje = 'Desaprobando todos los indicadores.'
    } else {
        mensaje = 'Aprobando todos los indicadores.'
    }

    var mens;
    if (valor == 5)
        mens = perfil.etiquetas.msgComprobarAjusteAprobarTodos;
    else
        mens = perfil.etiquetas.msgComprobarAjusteDesaprobarTodos;
    mostrarMensaje(2, mens, function (btn) {
        if (btn == 'ok') {
            Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: mensaje,
                width: 300,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: 'aprobarDesaprobarAjusteTodos',
                params: {
                    identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                    idmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    aprobado: valor,
                    idejercicio: cbEjercicioPlanes.getValue(),
                    identidad: tpEstructuraPlanes.getSelectionModel().getSelectedNode().attributes.id,
                    rectora: rectoraPlanes,
                    glob: Ext.getCmp('chglobalPlanes').getValue()
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    Ext.MessageBox.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        if (valor == 4) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoAjuste);
                            stGpGestModeloPlanes.reload();
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgAprobadoAjuste);
                            stGpGestModeloPlanes.reload();
                        }
                    }
                }
            });
        }
    }
    );
}

function cambiarEstadoAjustePlanes(valor) {
    var cantSel = smGpGestModeloPlanes.getSelections().length;
    if (aprobarajustePlanes == 0) {
        var mensaje;
        if (cantSel > 1)
            mensaje = 'Desaprobando los ajustes de los indicadores seleccionados.'
        else
            mensaje = 'Desaprobando el ajuste del indicador seleccionado.'
    } else {
        if (cantSel > 1)
            mensaje = 'Aprobando los ajustes de los indicadores seleccionados.'
        else
            mensaje = 'Aprobando el ajuste del indicador seleccionado.'
    }
    if (smGpGestModeloPlanes.getSelections().length >= 1) {

        var aux = smGpGestModeloPlanes.getSelections();
        var arreglo = [];
        for (pos in aux) {
            if (aux[pos].id) {
                arreglo.push(aux[pos].data.idplanificacion);
            }
        }
        var rectora;
        if (objciPlanes.acciones)
            rectora = objciPlanes.acciones.rector;
        var mens;
        if (valor == 5) {
            if (cantSel > 1)
                mens = perfil.etiquetas.msgComprobarAjustesAprobar;
            else
                mens = perfil.etiquetas.msgComprobarAjusteAprobar;
        } else {
            if (cantSel > 1)
                mens = perfil.etiquetas.msgComprobarAjustesDesaprobar;
            else
                mens = perfil.etiquetas.msgComprobarAjusteDesaprobar;
        }
        mostrarMensaje(2, mens, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.show({
                    title: perfil.etiquetas.lbEspere,
                    msg: mensaje,
                    width: 350,
                    wait: true,
                    progress: true,
                    closable: false
                });
                Ext.Ajax.request({
                    url: 'aprobarDesaprobarAjuste',
                    params: {
                        idplanificacion: Ext.encode(arreglo),
                        aprobado: valor
                    },
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        Ext.MessageBox.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {

                            if (valor == 5) {
                                if (cantSel > 1)
                                    mostrarMensaje(1, perfil.etiquetas.msgAprobadoAjustes);
                                else
                                    mostrarMensaje(1, perfil.etiquetas.msgAprobadoAjuste);
                                stGpGestModeloPlanes.reload();
                            } else {
                                if (cantSel > 1)
                                    mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoAjustes);
                                else
                                    mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoAjuste);
                                stGpGestModeloPlanes.reload();
                            }
                        }
                    }

                });
            }
        }
        );
    } else
        mostrarMensaje(1, perfil.etiquetas.msgSeleccionparaAprobar)
}

function accionAprobarPlanes() {
    var rectora = false;
    if (objciPlanes.acciones)
        rectora = objciPlanes.acciones.rector;
    if (rectora)
        cambiarEstadoPlanes(4);
    else
        cambiarEstadoPlanes(3);
}

function crearIUAddModPlanes() {
// formulario fpTipoModelo
    fpPlanes = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .25,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbCodigo,
                                allowBlank: false,
                                //regex: /^([a-zA-Z0-9 _-]+ ?[a-zA-Z0-9 _-]*)+$/,
                                id: 'codigoplanPlanes',
                                anchor: '95%'
                            }, {
                                xtype: 'hidden',
                                id: 'idplanmPlanes'
                            }, {
                                xtype: 'hidden',
                                id: 'node'
                            }]
                    }, {
                        columnWidth: .75,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbDenominacion,
                                allowBlank: false,
                                //regex: /^([a-zA-Z0-9 _-]+ ?[a-zA-Z0-9 _-]*)+$/,
                                id: 'denominacionpPlanes',
                                anchor: '100%'
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                id: 'descripcionpPlanes',
                                anchor: '100%',
                                fieldLabel: perfil.etiquetas.lbDescripcion,
                                editable: false
                            }]
                    }]
            }]
    });
    var btnCancelarAddPlanes = new Ext.Button({
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbBtnCancelar,
        tooltip: 'Cerrar ventana sin guardar los datos.',
        handler: function () {
            winAddPlanes.hide()
        }
    });
    btnAplicarAddPlanes = new Ext.Button({
        iconCls: 'aplicar',
        tooltip: 'Guardar datos y limpiar los campos.',
        id: 'idbtnAplicarAddPlan',
        text: perfil.etiquetas.lbBtnAplicar,
        disabled: true,
        handler: function () {
            adicionarPlanPlanes();
            controlPlanes = 2;
        }
    });
    var btnAceptarAddPlanes = new Ext.Button({
        iconCls: 'aceptar',
        text: perfil.etiquetas.lbBtnAceptar,
        tooltip: 'Guardar datos y cerrar ventana.',
        disabled: true,
        handler: function () {
            adicionarPlanPlanes();
            controlPlanes = 1;
        }
    });
    winAddPlanes = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        layout: 'fit',
        title: perfil.etiquetas.lbTtbtnAddi,
        width: 380,
        height: 220,
        cls: 'ventanaAdelante',
        items: fpPlanes,
        buttons: [btnCancelarAddPlanes, btnAplicarAddPlanes, btnAceptarAddPlanes],
        listeners: {
            beforeshow: function () {
                guardarEstadoPaneles();
            }, beforeclose: function () {
                habilitarPanelIndicadores();
            }, beforedestroy: function () {
                habilitarPanelIndicadores();
            }, beforehide: function () {
                habilitarPanelIndicadores();
            }
        }
    });
}
function guardarEstadoPaneles() {
    estadoGridInd = pModeloPlanes.disabled;
    estadoPanelInd = Ext.getCmp('idpcmPlanes').disabled;
    pModeloPlanes.enable();
    Ext.getCmp('idpcmPlanes').enable();
}
function habilitarPanelIndicadores() {
    if (estadoGridInd)
        pModeloPlanes.disable();
    if (estadoPanelInd)
        Ext.getCmp('idpcmPlanes').disable();
}

function adicionarPlanPlanes() {
    if (fpPlanes.getForm().isValid()) {
        fpPlanes.getForm().submit({
            params: {
                identidad: identidadselectedPlanes,
                rect: objciPlanes.acciones.rector,
                idejercicio: cbEjercicioPlanes.getValue()

            },
            url: 'adicionarPlan',
            waitMsg: perfil.etiquetas.lbAdicionarAA,
            failure: function (form, action) {
                if (action.result.codMsgA == 1) {
                    if (controlPlanes == 1) {
                        fpPlanes.getForm().reset();
                        tpBasePlanes.getRootNode().reload();
                        winAddPlanes.hide();
                    } else {
                        tpBasePlanes.getRootNode().reload();
                    }

                    if (action.result.mensaje == 'Add')
                        mostrarMensaje(1, perfil.etiquetas.msgAddPlan);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgModPlan);
                } else if (action.result.codMsg == 21) {
                    mostrarMensaje(1, perfil.etiquetas.msgCodExistente)
                } else
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
            }
        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgEstadoCampo);
    }
}

function eliminarPlanes() {
    mostrarMensaje(2, "¿Está seguro que quiere eliminar la agrupación seleccionada?", elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            mascaraPlanes(perfil.etiquetas.msgEliminandoAgrupac, 1);
            Ext.Ajax.request({
                url: 'eliminar',
                params: {
                    idplan: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idplan,
                    identidad: identidadselectedPlanes
                },
                callback: function (options, success, response) {
                    if (estadoGridInd)
                        pModeloPlanes.disable();
                    if (estadoPanelInd)
                        Ext.getCmp('idpcmPlanes').disable();
                    mascaraPlanes('', 0);
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgE == 1) {
                        mostrarMensaje(responseData.codMsg, perfil.etiquetas.msgEliminarAgrupacion);
                        tpBasePlanes.getSelectionModel().getSelectedNode().parentNode.reload();
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                    }
                }
            });
        } else {
            if (estadoGridInd)
                pModeloPlanes.disable();
            if (estadoPanelInd)
                Ext.getCmp('idpcmPlanes').disable();
        }
    }
}

function eliminarModeloPlanes() {
    mostrarMensaje(2, perfil.etiquetas.msgEP, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: 'Eliminando el plan seleccionado.',
                width: 350,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: 'eliminarModelo',
                timeout: 7200000,
                params: {
                    identidad: identidadselectedPlanes,
                    identidadcrea: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadcrea,
                    idmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        tpBasePlanes.selectPath(tpBasePlanes.getSelectionModel().getSelectedNode().parentNode.getPath());
                        idelemsel = tpBasePlanes.getSelectionModel().getSelectedNode().id;
                        mostrarMensaje(1, perfil.etiquetas.msgPlanEliminado);
                        tpBasePlanes.getSelectionModel().getSelectedNode().parentNode.reload();
                    } else if (responseData.codMsg == 21) {
                        mostrarMensaje(1, perfil.etiquetas.msgErrorElimMode);
                    }
                    Ext.MessageBox.hide();
                }
            });
        }
    }
}

function eliminarIndModPlanes(sModel) {
    mostrarMensaje(2, "¿Está seguro que quiere eliminar el(los) indicador(es) seleccionado(s)?", elimina);
    function elimina(btn) {
        if (btn == 'ok') {
            var aux = sModel.getSelections();
            var arreglo = [];
            var arrayInd = [];
            for (pos in aux) {
                if (aux[pos].id) {
                    arreglo.push(aux[pos].data.idplanificacion);
                    arrayInd.push(aux[pos].data.idindicador);
                }
            }
            var maskElim = Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: 'Eliminando el(los) indicador(es) seleccionado(s).',
                width: 350,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: 'eliminarIndmodPlan',
                params: {
                    idplanificacion: Ext.encode(arreglo),
                    identidadmodelo: tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                    idindicador: Ext.encode(arrayInd),
                    idejercicio: cbEjercicioPlanes.getValue()
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (responseData.codMsgD == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgEliminado);
                            funcionAceptarPlanes();
                        } else if (responseData.codMsgD == 21) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorEliminarDemanda);
                        }
                    } else
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                    maskElim.hide();
                    Ext.MessageBox.hide();
                }
            });
        }

    }
}

function exportarIndicadores() {
    var selectedEntity = tpEstructuraPlanes.selModel.getSelectedNode().text;
    var selectedPlan = tpBasePlanes.selModel.getSelectedNode().text;
    var identidadmodelo = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
    var win = window.open('exportar?entidad=' + selectedEntity + '&glob=' + Ext.getCmp('chglobalPlanes').getValue() +
            '&plan=' + selectedPlan + '&idejercicio=' + cbEjercicioPlanes.getValue() + '&hoja=' + hojaPlanes +
            '& idmodelo=' + treePlanSelect + '& identidadmodelo=' + identidadmodelo +
            '& identidad=' + identidadselectedPlanes + '& filtros=' + Ext.encode(filtrosgpModeloPlanes.getFilterData()));
}
upColorCell = function () {
    for (var i = 0; i < stGpGestModeloPlanes.getCount(); i++) {
        for (var j = 0; j < columnasDinamicasgpModeloPlanes.getColumnCount(); j++) {
            if (stGpGestModeloPlanes.getAt(i).data.ajuste != 0) {
                Ext.get(Ext.getCmp('gpModeloPlanes').getView().getCell(i, j))
                        .applyStyles('background-color:#FFCCCC');
            }
        }
    }
};

function GuardarTodasPlanes() {

    var editadas = stGpGestModeloPlanes.getModifiedRecords();
    var count = 0;
    var objPlanes = {};
    var arreglo = [];
    var llave = stGpGestModeloPlanes.data.items[0].data.llave;
    var llaveprimaria = stGpGestModeloPlanes.data.items[0].data.llaveprimaria;
    while (editadas.length > 0) {
        var record = editadas.pop();
        var rec = record.getChanges();
        for (k in rec) {
            if (typeof (rec[k]) == 'object') {
                if (rec[k]) {
                    rec[k] = rec[k].format('d/m/Y');
                }
            }
        }
        if (((Object.keys(rec).length > 0 && !rec['cantidad'] && rec['cantidad'] != 0 && !rec['importe']) ||
                (Object.keys(rec).length > 2 && rec['cantidad'] && rec['importe']) ||
                (Object.keys(rec).length > 1 && rec['cantidad'] && !rec['importe'])) && !rec['ajuste'] && rec['ajuste'] != 0) {

            rec[llaveprimaria] = record.data[llaveprimaria];
            rec['insertarenmeta'] = true;
        }

        rec['idplanificacion'] = record.data['idplanificacion'];
        count++;
        arreglo.push(rec);
    }
    objPlanes['idmodelo'] = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.idmodelo;
    objPlanes['identidadmodelo'] = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
    objPlanes.filas = Ext.encode(arreglo);
    Ext.Ajax.request({
        url: 'adicionarIndicador',
        params: objPlanes,
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgM) {
                if (responseData.codMsgM == 20) {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardados);
                    stGpGestModeloPlanes.reload();
                } else {
                    editadas.push(record);
                    if (responseData.codMsgM == 3) {
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAction)
                    }
                }
            } else {
                editadas.push(record);
                mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
            }
        }
    });
}
function guardarestadoPanelesResumen() {
    estadoGridInd = pModeloPlanes.disabled;
    estadoPanelInd = Ext.getCmp('idpcmPlanes').disabled;
    pModeloPlanes.enable();
    pPlanes.enable();
}
function renderUsuarios(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stUsuarios.data.items.length; i++)
        if (stUsuarios.data.items[i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            return stUsuarios.data.items[i].data.nombreusuario;
        }
}
function renderFecha(val, m) {
    if (val != null) {
        var temp = val.split(':');
        var tempC = val.split(' ');
        if (tempC[0] != '31/12/2009' && tempC[0] != '01/01/2010') {
            var v = temp[0] + ':' + temp[1];
            m.attr = 'ext:qtip="' + v + '"';
            return tempC[0];
        } else {
            m.attr = 'ext:qtip=""';
            return null;
        }
    }
    return val;
}













