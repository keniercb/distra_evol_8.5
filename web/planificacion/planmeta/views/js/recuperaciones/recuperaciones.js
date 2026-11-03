var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();

Ext.Ajax.timeout = 1000000000;

UCID.portal.cargarEtiquetas('recuperaciones', cargarInterfaz);
Ext.QuickTips.init();
var rep, strFormatoReporte, cmbFormatoReporte, cmbReportes, stReportes, stPlanes, v_reportes, stGpReportes, cmGpReportes;
var btnEjecutar, btnConfigurar, vpServicios, pReportes, pBarras, winReporte1, WinArbolOrgDemandante, WinArbolEntidades, organos = [], orgdereporte = 0, reporte, construcciondelgrid, mostrarReportes;
var idejercicio, idtipogasto, idnivel, idorgano, idplanes, idcentrobalance, idvia, idoace, listarIndicadoresdelReporte, denoplan, gastos = [], objci, rector, cb, od;
var valcomp, idplan, idcb, ident, idod, chekbal;
var _this = this;
var anualQuinquenal = 0;
var rutareporte = '', nodeIdsreporte = '', entidadesreporte = '', denominacionclasifreporte = '', CentroB = 0, nodeIdsreportePlanes = '', tituloCombo = '', tituloComboEjercicio = '';

function cargarInterfaz() {


    this.prevrow = -1;
    this.idtipodocumento = 0;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.tipoactivado = 0;
    this.categactivado = 0;
    this.idtiporeporteseleccionado = 0;
    this.arrayitemspComp = [];
    this.idversionreporte = 0;
    var prevrow = -1;
    var prevrow2 = -1;
    var fechaactual = new Date();
    var annoactual = fechaactual.getFullYear();
    this.arrayobjreporte = [];

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando,
        removeMask: false
    });
    Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function (options, success, response) {
            objci = Ext.decode(response.responseText);
            if (!objci.codMsg) {
                objci.acciones = [];
                UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
                    consolidado = 0;
                    objci.acciones.rector = false;
                    for (i in acciones_reportes) {
                        objci.acciones[acciones_reportes[i].abreviatura] = true;
                    }
                    mymask.hide();
                    if (objci.entidadCB && !objci.acciones.rector && !objci.entidadOD) {
                        soyCB = objci.entidadCB;
                        cb = 1;
                    }
                    if (!objci.acciones.rector && !objci.entidadCB) {
                        soyDem = true;
                        od = 1;
                    }
                    if (objci.entidadCB && !objci.acciones.rector && objci.entidadOD) {
                        soyCB = objci.entidadCB;
                        soyDem = true;
                        cb = 1;
                    }


                });
            }
        }

    });


    stReportes = [
        //[10, 'PROYECCIÓN DE LA PLANIFICACIÓN'],
        [1, 'RESUMEN DEL PLAN POR VÍA DE ADQUISICIÓN'],
        [2, 'RESUMEN DE PRODUCTOS POR OACE '],
        [3, 'RESUMEN COMPARATIVO DEL PLAN POR CONCEPTOS'],
        [4, 'RESUMEN DE PRODUCTOS SI POR ÓRGANO QUE SATISFACE'],
        [5, 'DEMANDA POR PLANES PARA INVERSIONES'],
        [6, 'RECUPERACIÓN PARA LOS DATOS DEL BALANCE'],
        [7, 'RESUMEN DE AJUSTE EN PLAN'],
        [8, 'RESUMEN POR DIFERENCIA DE PRECIOS']];


    cmbReportes = new Ext.form.ComboBox({
        id: 'cmbReportes',
        store: stReportes,
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        listWidth: 350,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        selectOnFocus: true,
        width: 260,
        listeners: {
            select: function (combo, record, index) {
                rep = index + 1;
                reporte = combo.getValue();
                reporte = cmbReportes.getValue();
                if (combo.getValue() == 10) {
                    proyeccionPlanifWin();

                } else {
                    cmbFormatoReporte.setDisabled(false);
                    cmbtamanno.setDisabled(false);
                    cmbposicion.setDisabled(false);
                    construcciondelgrid();
                    crearwinConfigReporte();
                    chbalancearR.disable();
                }

            }
        }
    })

    strFormatoReporte = [[1, 'HTML'], [2, 'PDF'], [3, 'EXCEL'], [3, 'CSV']];

    cmbFormatoReporte = new Ext.form.ComboBox({
        id: 'cmbFormatoReporte',
        store: strFormatoReporte,
        width: 60,
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        emptyText: perfil.etiquetas.lbSeleccione,
        selectOnFocus: true,
        disabled: true,
        listeners: {
            select: function (combo, record, index) {

            }
        }
    });

    //Tamaño de la hoja del reporte.
    sttamanno = [[1, 'Carta (21.59cm x 27.94cm)'], [2, 'A3 (29.7cm x 42cm)'], [3, 'A4 (21cm x 29.7cm)']];

    cmbtamanno = new Ext.form.ComboBox({
        id: 'cmbtamanno',
        store: sttamanno,
        width: 100,
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        listWidth: 150,
        allowBlank: false,
        emptyText: perfil.etiquetas.lbSeleccione,
        selectOnFocus: true,
        disabled: true,
        listeners: {
            select: function (combo, record, index) {

            }
        }
    });

    //Posición de la hoja
    stposicion = [[1, 'Horizontal'], [2, 'Vertical']];

    cmbposicion = new Ext.form.ComboBox({
        id: 'cmbposicion',
        store: stposicion,
        width: 80,
        listWidth: 100,
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        emptyText: perfil.etiquetas.lbSeleccione,
        selectOnFocus: true,
        disabled: true,
        listeners: {
            select: function (combo, record, index) {

            }
        }
    });

    btnLimpiarfil = new Ext.Button({
        id: 'btnLimpiarfil',
        //icon: perfil.dirImg + 'limpiar.png',
        tooltip: 'Limpiar filtros' + '(<b>Alt+L</b>)',
        iconCls: 'limpiar',
        text: 'Limpiar',
        handler: function () {
        }
    });
    btnEjecutar = new Ext.Button({
        disabled: true,
        id: 'btnEjecutar',
        tabIndex: 2,
        // icon: perfil.dirImg + 'ejecutar.png',
        iconCls: 'ejecutar',
        text: perfil.etiquetas.lbBtnEjecutar,
        handler: function () {

            crearwinConfigReporte();

        }
    });

    btnConfigurar = new Ext.Button({
        disabled: true,
        id: 'btnConfigurar',
        tabIndex: 2,
        // icon: perfil.dirImg + 'validar.png',
        iconCls: 'validar',
        text: perfil.etiquetas.lbBtnConfigurar,
        handler: function () {
            if (cmbReportes.getValue() < 5) {

                reporte = cmbReportes.getValue();

                crearwinConfigReporte();
            }
        }
    });

    btnAyuda = new Ext.Button({
        disabled: false,
        id: 'btnAyudarec',
        // icon: perfil.dirImg + 'ayuda.png',
        tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
        iconCls: 'ayuda'//,
                //text: perfil.etiquetas.lbBtnAyuda,
//        handler: function() {
//            mostrarAyudaR('Recuperaciones');
//        }
    });


    // Grid para mostrar los reportes.

    pBarras = new Ext.Panel({
        tbar: [new Ext.Toolbar.TextItem(perfil.etiquetas.lbReporte),
            cmbReportes, '->', btnAyuda,
        ],
        region: 'center',
        border: true,
        layout: 'fit',
        width: 800,
        height: 600
    })

    vpServicios = new Ext.Viewport({
        layout: 'fit',
        items: [pBarras]
    });


}

function mostrarReportes() {
    //if (fpConfigReporte.getForm().isValid()) {
    if (cmbReportes.getValue() != 10) {
        var idreport = Ext.getCmp('cmbReportes').getValue();
        var idformat = Ext.getCmp('cbformatreporte').getValue();
        var iddimens = Ext.getCmp('cbtipohoja').getValue();
        var idposic = Ext.getCmp('cborientacionh').getValue();
        var idejercicio = cbEjercicio.getValue();
        var idnivel = cbNivel.getValue();
        var idtipogasto = cbGasto.getValue();
        var mostrarind = chindicadores.getValue();
        var codigo = tfcodigo.getValue();
        var numpieza = tfnumpieza.getValue();
        var denominacion = tfdenominacion.getValue();
        var denoclasifplanrep = denominacionclasifreporte;
        var idsclasifplanrep = nodeIdsreporte;
        var idejercicioante = cbEjercicioanterior.getValue();
        var denomejercActual = cbEjercicio.getRawValue();
        var denomejercAnterior = cbEjercicioanterior.getRawValue();

        Ext.MessageBox.show({
            title: 'Por favor espere...',
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6',
            msg: 'Configurando el reporte.'
        });

        if (idreport == 6 || idreport == 7 || idreport == 8) {
            valcomp = cmbComportamiento.getValue();
            var idplanes = Array();
            a = CmbPlanesRecuperacion.getCheckedValue().split(',')
            b = CmbPlanesRecuperacion.getRawValue().split(',')
            c = CmbPlanesRecuperacion.getCheckedValue('uridatosnomenclador').split(',');
            d = CmbPlanesRecuperacion.getCheckedValue('iddatosnomenclador').split(',');
            for (var i = 0; i < a.length; i++) {
                idplanes.push({
                    idplan: a[i],
                    denominacion: b[i],
                    uridatosnomenclador: c[i],
                    idtipoplan: d[i]
                }
                );
            }
            var idcbs = Array();
            a = cbCBRecuperacion.getCheckedValue().split(',')
            b = cbCBRecuperacion.getRawValue().split(',')
            for (var i = 0; i < a.length; i++) {
                idcbs.push({
                    idcentrobalance: a[i],
                    denominacion: b[i]
                }
                );
            }
            ident = nodeIdsreportePlanes;
            var idods = Array();
            a = cborganodemandante.getCheckedValue().split(',')
            b = cborganodemandante.getRawValue().split(',')
            for (var i = 0; i < a.length; i++) {
                idods.push({
                    idvia: a[i],
                    denominacion: b[i]
                }
                );
            }

            var vias = Array();
            a = cbVia.getCheckedValue().split(',')
            b = cbVia.getCheckedValue('denominacion').split(',')
            c = cbVia.getCheckedValue('uriviaadquisicion').split(',')
            for (var i = 0; i < a.length; i++) {
                vias.push({
                    idvia: a[i],
                    denominacion: b[i],
                    uriviaadquisicion: c[i]
                }
                );
            }

            var arrayidoace = [];
            a = cbOACE.getCheckedValue().split(',');
            b = cbOACE.getCheckedValue('denominacion').split(',');
            for (var i = 0; i < a.length; i++) {
                arrayidoace.push({
                    idoace: a[i],
                    denominacion: b[i]
                }
                );
            }

            chekbal = chbalancearR.getValue();
        } else {
            var elementos = Array();
            a = cbPlanes.getCheckedValue().split(',')
            b = cbPlanes.getCheckedValue('denominacion').split(',')
            c = cbPlanes.getCheckedValue('uridatosnomenclador').split(',');
            d = cbPlanes.getCheckedValue('iddatosnomenclador').split(',');
            for (var i = 0; i < a.length; i++) {
                elementos.push({
                    idplan: a[i],
                    denominacion: b[i],
                    uridatosnomenclador: c[i],
                    idtipoplan: d[i]
                }
                );
            }
            var vias = Array();
            a = cbVia.getCheckedValue().split(',')
            b = cbVia.getCheckedValue('denominacion').split(',')
            c = cbVia.getCheckedValue('uriviaadquisicion').split(',')
            for (var i = 0; i < a.length; i++) {
                vias.push({
                    idvia: a[i],
                    denominacion: b[i],
                    uriviaadquisicion: c[i]
                }
                );
            }

            var arrayidoace = [];
            a = cbOACE.getCheckedValue().split(',')
            b = cbOACE.getCheckedValue('denominacion').split(',')
            for (var i = 0; i < a.length; i++) {
                arrayidoace.push({
                    idoace: a[i],
                    denominacion: b[i]
                }
                );
            }

            var arraycentrobalance = [];
            a = cbCB.getCheckedValue().split(',')
            b = cbCB.getRawValue().split(',')
            for (var i = 0; i < a.length; i++) {
                arraycentrobalance.push({
                    idcentrobalance: a[i],
                    denominacion: b[i]
                }
                );
            }

            var gastos = [];
            a = cbGasto.getCheckedValue().split(',');
            b = cbGasto.getCheckedValue('denominacion').split(',');

            for (var i = 0; i < a.length; i++) {
                gastos.push({
                    idtipogasto: a[i],
                    denominacion: b[i]
                });
            }
        }

        var params = {
            origenreporte: orgdereporte,
            idejercicio: idejercicio,
            comportamiento: cmbComportamiento.getValue(),
            idmodelos: idplanes,
            idcentrosb: idcbs,
            identsel: ident,
            idorgansodem: idods,
            balancear: chekbal,
            arraytipogastos: gastos,
            idnivel: idnivel,
            arrayidorganos: organos,
            arrayplanes: elementos,
            arrayidcentrobalance: arraycentrobalance,
            arrayviasadquisicion: vias,
            arrayoace: arrayidoace,
            idreporte: idreport,
            formatoreporte: idformat,
            dimensioneshoja: iddimens,
            posicionhoja: idposic,
            mostrarindicadores: mostrarind,
            esrector: objci.acciones.rector,
            codigo: codigo,
            numpieza: numpieza,
            denominacion: denominacion,
            denoclasifplanrep: tfclasificacionplan.getValue(),
            idsclasifplanrep: idsclasifplanrep,
            comportamiento: valcomp,
                    idejercicioante: idejercicioante,
            ejercicioActual: denomejercActual,
            ejercicioAnterior: denomejercAnterior
        }
        organos = [];
    }
    if (cmbReportes.getValue() == 10) {
        detalle = 0;
        numbdetalle = 0;
        if (Ext.getCmp('chDetalle1').getValue() == true) {
            detalle = 1;
            numbdetalle = 'porciento1';
        }
        if (Ext.getCmp('chDetalle2').getValue() == true) {
            detalle = 1;
            numbdetalle = 'porciento2';
        }
        if (Ext.getCmp('chDetalle3').getValue() == true) {
            detalle = 1;
            numbdetalle = 'porciento3';
        }
        if (Ext.getCmp('chDetalle4').getValue() == true) {
            detalle = 1;
            numbdetalle = 'porciento4';
        }
        if (Ext.getCmp('chDetalle5').getValue() == true) {
            detalle = 1;
            numbdetalle = 'porciento5';
        }


        componente = cmbComponentes.getRawValue();
        if (cbOrgDemand.getValue() != '' && cbOrgDemand.getValue() != null && cbOrgDemand.getValue() != undefined) {
            var arrayent = [];
            arrayent[0] = cbOrgDemand.getValue();
            identidades = arrayent;
        } else {
            identidades = stcbOrgDemand.data.keys;
        }
        if (CmbPlanesPP.getCheckedValue() != '' && CmbPlanesPP.getCheckedValue() != null && CmbPlanesPP.getCheckedValue() != undefined) {
            planes = CmbPlanesPP.getCheckedValue();
            casop = 1;
        } else {
            planes = stCmbPlanesPP.data.keys;
            casop = 2;
        }
        var params = {
            idejercicio: cbEjercicioAnno1.getValue(),
            importebaseG: importebaseG,
            anualQuinq: anualQuinquenal,
            importebaseV: importebaseV,
            identidades: identidades,
            casop: casop,
            planes: planes,
            numbdetalle: numbdetalle,
            detalle: detalle,
            componente: cmbComponentes.getValue(),
            porcientoEA: Ext.getCmp('porcientoEntreAnnos').getValue(),
            porcientoEntreAnnos: Ext.getCmp('chPorcientoEntreAnnos').getValue(),
            porciento1: Ext.getCmp('porciento1').getValue(),
            porciento2: Ext.getCmp('porciento2').getValue(),
            porciento3: Ext.getCmp('porciento3').getValue(),
            porciento4: Ext.getCmp('porciento4').getValue(),
            porciento5: Ext.getCmp('porciento5').getValue(),
            importe1: Ext.getCmp('importecalculadoG1').getValue(),
            importeV1: Ext.getCmp('importecalculadoV1').getValue(),
            importe2: Ext.getCmp('importecalculadoG2').getValue(),
            importeV2: Ext.getCmp('importecalculadoV2').getValue(),
            importe3: Ext.getCmp('importecalculadoG3').getValue(),
            importeV3: Ext.getCmp('importecalculadoV3').getValue(),
            importe4: Ext.getCmp('importecalculadoG4').getValue(),
            importeV4: Ext.getCmp('importecalculadoV4').getValue(),
            importe5: Ext.getCmp('importecalculadoG5').getValue(),
            importeV5: Ext.getCmp('importecalculadoV5').getValue(),
            idreporte: 10,
            dimensioneshoja: 4,
            posicionhoja: 2,
            formatoreporte: 1
        }
    }

    if (reporte == 8 || reporte == 3) {
        if (idejercicio != idejercicioante) {
            document.getElementById('parametrosReporte').value = Ext.util.JSON.encode(params);
            document.getElementById('imprimirReporte').submit(
                    );
            Ext.MessageBox.hide();
            _this.winConfigReporte.destroy();

        } else {

            Ext.MessageBox.hide();
            mostrarMensaje(3, 'No se puede generar el reporte, el ejercicio actual no debe ser igual al ejercicio anterior.')
        }
    } else {
        document.getElementById('parametrosReporte').value = Ext.util.JSON.encode(params);
        document.getElementById('imprimirReporte').submit(
                );
        Ext.MessageBox.hide();
    }

    /*} else
     mostrarMensaje(3, 'Por favor verifique, hay campos con valores incorrectos o vacíos.')*/
}

function construcciondelgrid() {
    switch (reporte) {

        case 1:

            {

                //Store del gris de reportes  1
                stGpReportes = new Ext.data.Store({
                    url: mostrarReportes,
                    listeners: {
                        beforeLoad: function () {
                            orgdereporte = 0;
                            stGpReportes.baseParams.origenreporte = orgdereporte
                        },
                        load: function () {
                        }

                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'idindicador'
                    }, [{
                            name: 'idindicador'
                        }, {
                            name: 'codigo'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'ejercicio'
                        }, {
                            name: 'nivel'
                        }, {
                            name: 'organo'
                        }, {
                            name: 'plan'
                        }, {
                            name: 'centrobalance'
                        }, {
                            name: 'idvia'
                        }
                    ])
                });

                //Colunmodel del grid de reportes 1
                cmGpReportes = new Ext.grid.ColumnModel([
                    {
                        dataIndex: 'codigo',
                        header: 'Código',
                        tooltip: 'Código del indicador',
                        sortable: true,
                        width: 90
                    }, {
                        dataIndex: 'denominacion',
                        header: 'Denominación',
                        tooltip: 'Denominación del indicador',
                        sortable: true,
                        width: 10,
                        id: 'expand'

                    }, {
                        dataIndex: 'ejercicio',
                        header: 'Ejercicio',
                        tooltip: 'Ejercicio de planificación',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'nivel',
                        header: 'Nivel',
                        tooltip: 'Nivel del indicador',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'organo',
                        header: 'Órgano demandante',
                        tooltip: 'Órgano demandante',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'plan',
                        header: 'Plan',
                        tooltip: 'Plan',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'centrobalance',
                        header: 'Centro de balance',
                        tooltip: 'Centro de balance',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'idvia',
                        header: 'Vía de adquisición',
                        tooltip: 'Vía de adquisición',
                        sortable: true,
                        width: 90

                    }]);

            }
            break;
        case 2:
            {

                //Store del gris de reportes 2
                stGpReportes = new Ext.data.Store({
                    url: mostrarReportes,
                    listeners: {
                        beforeLoad: function () {
                            orgdereporte = 0;
                            stGpReportes.baseParams.origenreporte = orgdereporte
                        },
                        load: function () {

                        }

                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'idindicador'
                    }, [{
                            name: 'idindicador'
                        }, {
                            name: 'codigo'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'ejercicio'
                        }, {
                            name: 'nivel'
                        }, {
                            name: 'organo'
                        }, {
                            name: 'plan'
                        }, {
                            name: 'centrobalance'
                        }, {
                            name: 'idoace'
                        }
                    ])
                });

                //Colunmodel del grid de reportes 2
                cmGpReportes = new Ext.grid.ColumnModel([
                    {
                        dataIndex: 'codigo',
                        header: 'Código',
                        tooltip: 'Código del indicador',
                        sortable: true,
                        width: 90
                    }, {
                        dataIndex: 'denominacion',
                        header: 'Denominación',
                        tooltip: 'Denominación del indicador',
                        sortable: true,
                        width: 10,
                        id: 'expand'

                    }, {
                        dataIndex: 'ejercicio',
                        header: 'Ejercicio',
                        tooltip: 'Ejercicio de planificación',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'nivel',
                        header: 'Nivel',
                        tooltip: 'Nivel del indicador',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'organo',
                        header: 'Órgano demandante',
                        tooltip: 'Órgano demandante',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'plan',
                        header: 'Plan',
                        tooltip: 'Plan',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'centrobalance',
                        header: 'Centro de balance',
                        tooltip: 'Centro de balance',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'idoace',
                        header: 'OACE',
                        tooltip: 'Órgano abastecedor central del estado',
                        sortable: true,
                        width: 90

                    }
                ]);
            }
            break;
        case 3:
            {

                //Store del gris de reportes 3
                stGpReportes = new Ext.data.Store({
                    url: mostrarReportes,
                    listeners: {
                        beforeLoad: function () {
                            orgdereporte = 0;
                            stGpReportes.baseParams.origenreporte = orgdereporte

                        },
                        load: function () {

                        }

                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'idindicador'
                    }, [{
                            name: 'idindicador'
                        }, {
                            name: 'codigo'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'ejercicio'
                        }, {
                            name: 'tipogasto'
                        }, {
                            name: 'organo'
                        }, {
                            name: 'plan'
                        }, {
                            name: 'centrobalance'
                        }
                    ])
                });

                //Colunmodel del grid de reportes 3
                cmGpReportes = new Ext.grid.ColumnModel([
                    {
                        dataIndex: 'codigo',
                        header: 'Código',
                        tooltip: 'Código del indicador',
                        sortable: true,
                        width: 90
                    }, {
                        dataIndex: 'denominacion',
                        header: 'Denominación',
                        tooltip: 'Denominación del indicador',
                        sortable: true,
                        width: 10,
                        id: 'expand'

                    }, {
                        dataIndex: 'ejercicio',
                        header: 'Ejercicio',
                        tooltip: 'Ejercicio de planificación',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'tipogasto',
                        header: 'Tipo de gasto',
                        tooltip: 'Tipo de gasto',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'organo',
                        header: 'Órgano demandante',
                        tooltip: 'Órgano demandante',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'plan',
                        header: 'Plan',
                        tooltip: 'Plan',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'centrobalance',
                        header: 'Centro de balance',
                        tooltip: 'Centro de balance',
                        sortable: true,
                        width: 90

                    }
                ]);
            }
            break;
        case 4:
            {

                //Store del gris de reportes 4
                stGpReportes = new Ext.data.Store({
                    url: mostrarReportes,
                    listeners: {
                        beforeLoad: function () {
                            orgdereporte = 0;
                            stGpReportes.baseParams.origenreporte = orgdereporte
                        },
                        load: function () {

                        }

                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'idindicador'
                    }, [{
                            name: 'idindicador'
                        }, {
                            name: 'codigo'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'ejercicio'
                        }, {
                            name: 'nivel'
                        }, {
                            name: 'organo'
                        }, {
                            name: 'plan'
                        }, {
                            name: 'centrobalance'
                        }, {
                            name: 'idoace'
                        }, {
                            name: 'idvia'
                        }
                    ])
                });

                //Colunmodel del grid de reportes4
                cmGpReportes = new Ext.grid.ColumnModel([
                    {
                        dataIndex: 'codigo',
                        header: 'Código',
                        tooltip: 'Código del indicador',
                        sortable: true,
                        width: 90
                    }, {
                        dataIndex: 'denominacion',
                        header: 'Denominación',
                        tooltip: 'Denominación del indicador',
                        sortable: true,
                        width: 10,
                        id: 'expand'

                    }, {
                        dataIndex: 'ejercicio',
                        header: 'Ejercicio',
                        tooltip: 'Ejercicio de planificación',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'nivel',
                        header: 'Nivel',
                        tooltip: 'Nivel del indicador',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'organo',
                        header: 'Órgano demandante',
                        tooltip: 'Órgano demandante',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'plan',
                        header: 'Plan',
                        tooltip: 'Plan',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'centrobalance',
                        header: 'Centro de balance',
                        tooltip: 'Centro de balance',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'idoace',
                        header: 'OACE',
                        tooltip: 'Órgano abastecedor central del estado',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'idvia',
                        header: 'Vía de adquisición',
                        tooltip: 'Vía de adquisición',
                        sortable: true,
                        width: 90

                    }
                ]);
            }
            break;
        case 5:
            {
                //Store del gris de reportes 2
                stGpReportes = new Ext.data.Store({
                    url: mostrarReportes,
                    listeners: {
                        beforeLoad: function () {
                            orgdereporte = 0;
                            stGpReportes.baseParams.origenreporte = orgdereporte
                        },
                        load: function () {

                        }

                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'idindicador'
                    }, [{
                            name: 'idindicador'
                        }, {
                            name: 'codigo'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'ejercicio'
                        }, {
                            name: 'nivel'
                        }, {
                            name: 'organo'
                        }, {
                            name: 'plan'
                        }, {
                            name: 'centrobalance'
                        }, {
                            name: 'idoace'
                        }
                    ])
                });

                //Colunmodel del grid de reportes 2
                cmGpReportes = new Ext.grid.ColumnModel([
                    {
                        dataIndex: 'codigo',
                        header: 'Código',
                        tooltip: 'Código del indicador',
                        sortable: true,
                        width: 90
                    }, {
                        dataIndex: 'denominacion',
                        header: 'Denominación',
                        tooltip: 'Denominación del indicador',
                        sortable: true,
                        width: 10,
                        id: 'expand'

                    }, {
                        dataIndex: 'ejercicio',
                        header: 'Ejercicio',
                        tooltip: 'Ejercicio de planificación',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'nivel',
                        header: 'Nivel',
                        tooltip: 'Nivel del indicador',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'organo',
                        header: 'Órgano demandante',
                        tooltip: 'Órgano demandante',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'plan',
                        header: 'Plan',
                        tooltip: 'Plan',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'centrobalance',
                        header: 'Centro de balance',
                        tooltip: 'Centro de balance',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'idoace',
                        header: 'OACE',
                        tooltip: 'Órgano abastecedor central del estado',
                        sortable: true,
                        width: 90

                    }
                ]);
            }
            break;
        case 6:
            {
                //Store del gris de reportes 2
                stGpReportes = new Ext.data.Store({
                    url: mostrarReportes,
                    listeners: {
                        beforeLoad: function () {
                            orgdereporte = 0;
                            stGpReportes.baseParams.origenreporte = orgdereporte
                        },
                        load: function () {

                        }

                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'idindicador'
                    }, [{
                            name: 'idindicador'
                        }, {
                            name: 'codigo'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'ejercicio'
                        }, {
                            name: 'nivel'
                        }, {
                            name: 'organo'
                        }, {
                            name: 'plan'
                        }, {
                            name: 'centrobalance'
                        }, {
                            name: 'idoace'
                        }
                    ])
                });

                //Colunmodel del grid de reportes 2
                cmGpReportes = new Ext.grid.ColumnModel([
                    {
                        dataIndex: 'codigo',
                        header: 'Código',
                        tooltip: 'Código del indicador',
                        sortable: true,
                        width: 90
                    }, {
                        dataIndex: 'denominacion',
                        header: 'Denominación',
                        tooltip: 'Denominación del indicador',
                        sortable: true,
                        width: 10,
                        id: 'expand'

                    }, {
                        dataIndex: 'ejercicio',
                        header: 'Ejercicio',
                        tooltip: 'Ejercicio de planificación',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'nivel',
                        header: 'Nivel',
                        tooltip: 'Nivel del indicador',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'organo',
                        header: 'Órgano demandante',
                        tooltip: 'Órgano demandante',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'plan',
                        header: 'Plan',
                        tooltip: 'Plan',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'centrobalance',
                        header: 'Centro de balance',
                        tooltip: 'Centro de balance',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'idoace',
                        header: 'OACE',
                        tooltip: 'Órgano abastecedor central del estado',
                        sortable: true,
                        width: 90

                    }
                ]);
            }
            break;
        case 7:
        {
            //Store del gris de reportes 2
            stGpReportes = new Ext.data.Store({
                url: mostrarReportes,
                listeners: {
                    beforeLoad: function () {
                        orgdereporte = 0;
                        stGpReportes.baseParams.origenreporte = orgdereporte
                    },
                    load: function () {

                    }

                },
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: 'idindicador'
                }, [{
                        name: 'idindicador'
                    }, {
                        name: 'codigo'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'ejercicio'
                    }, {
                        name: 'nivel'
                    }, {
                        name: 'organo'
                    }, {
                        name: 'plan'
                    }, {
                        name: 'centrobalance'
                    }, {
                        name: 'idoace'
                    }
                ])
            });

            //Colunmodel del grid de reportes 2
            cmGpReportes = new Ext.grid.ColumnModel([
                {
                    dataIndex: 'codigo',
                    header: 'Código',
                    tooltip: 'Código del indicador',
                    sortable: true,
                    width: 90
                }, {
                    dataIndex: 'denominacion',
                    header: 'Denominación',
                    tooltip: 'Denominación del indicador',
                    sortable: true,
                    width: 10,
                    id: 'expand'

                }, {
                    dataIndex: 'ejercicio',
                    header: 'Ejercicio',
                    tooltip: 'Ejercicio de planificación',
                    sortable: true,
                    width: 90

                }, {
                    dataIndex: 'nivel',
                    header: 'Nivel',
                    tooltip: 'Nivel del indicador',
                    sortable: true,
                    width: 90

                }, {
                    dataIndex: 'organo',
                    header: 'Órgano demandante',
                    tooltip: 'Órgano demandante',
                    sortable: true,
                    width: 90

                }, {
                    dataIndex: 'plan',
                    header: 'Plan',
                    tooltip: 'Plan',
                    sortable: true,
                    width: 90

                }, {
                    dataIndex: 'centrobalance',
                    header: 'Centro de balance',
                    tooltip: 'Centro de balance',
                    sortable: true,
                    width: 90

                }, {
                    dataIndex: 'idoace',
                    header: 'OACE',
                    tooltip: 'Órgano abastecedor central del estado',
                    sortable: true,
                    width: 90

                }
            ]);
        }
        case 8:
            {
                //Store del gris de reportes 2
                stGpReportes = new Ext.data.Store({
                    url: mostrarReportes,
                    listeners: {
                        beforeLoad: function () {
                            orgdereporte = 0;
                            stGpReportes.baseParams.origenreporte = orgdereporte
                        },
                        load: function () {

                        }

                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'idindicador'
                    }, [{
                            name: 'idindicador'
                        }, {
                            name: 'codigo'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'ejercicio'
                        }, {
                            name: 'nivel'
                        }, {
                            name: 'organo'
                        }, {
                            name: 'plan'
                        }, {
                            name: 'centrobalance'
                        }, {
                            name: 'idoace'
                        }
                    ])
                });

                //Colunmodel del grid de reportes 2
                cmGpReportes = new Ext.grid.ColumnModel([
                    {
                        dataIndex: 'codigo',
                        header: 'Código',
                        tooltip: 'Código del indicador',
                        sortable: true,
                        width: 90
                    }, {
                        dataIndex: 'denominacion',
                        header: 'Denominación',
                        tooltip: 'Denominación del indicador',
                        sortable: true,
                        width: 10,
                        id: 'expand'

                    }, {
                        dataIndex: 'ejercicio',
                        header: 'Ejercicio',
                        tooltip: 'Ejercicio de planificación',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'ejercicio',
                        header: 'Ejercicio anterior',
                        tooltip: 'Ejercicio anterior',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'nivel',
                        header: 'Nivel',
                        tooltip: 'Nivel del indicador',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'organo',
                        header: 'Órgano demandante',
                        tooltip: 'Órgano demandante',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'plan',
                        header: 'Plan',
                        tooltip: 'Plan',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'centrobalance',
                        header: 'Centro de balance',
                        tooltip: 'Centro de balance',
                        sortable: true,
                        width: 90

                    }, {
                        dataIndex: 'idoace',
                        header: 'OACE',
                        tooltip: 'Órgano abastecedor central del estado',
                        sortable: true,
                        width: 90

                    }
                ]);
            }
            ;
            ;


            break;

    }

    //Selection model del grid
    smGpReportes = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, row, record) {

            },
            rowdeselect: function (s, n, r) {
            }

        }
    });


    GpReportes = new Ext.grid.GridPanel({
        store: stGpReportes,
        autoExpandColumn: 'expand',
        id: 'GpReportes',
        cm: cmGpReportes,
        height: 500,
        sm: smGpReportes,
        listeners: {},
        loadMask: {
            msg: 'Cargando...'
        },
        tbar: [],
        bbar: new Ext.PagingToolbar({
            id: 'paginadoReportes',
            pageSize: 20,
            store: stGpReportes,
            displayInfo: true,
            items: ['-', btnLimpiarfil, '-', ]
        })

    });
    pBarras.remove('GpReportes', true);
    pBarras.add(GpReportes);
    pBarras.doLayout();


}
function crearwinConfigReporte() {
    if (_this.winConfigReporte)
        _this.winConfigReporte.destroy();

    //campo para el OD
    txforganoD = new Ext.form.TextField({
        id: 'txforganoD',
        readOnly: true,
        disabled: false,
        fieldLabel: perfil.etiquetas.lbOrganoDemandante,
        xtype: 'textfield',
        allowBlank: true,
        anchor: '95%',
        listeners: {
            focus: function () {
                ConstruirWinArbolOrgDemandante();

            }
        }
    });
    //campo para el OD para la recuperacion para los datos del balance
    txforganoDRecuperacion = new Ext.form.TextField({
        id: 'txforganoDRecuperacion',
        readOnly: true,
        disabled: true,
        fieldLabel: perfil.etiquetas.lbOrganoDemandante,
        xtype: 'textfield',
        allowBlank: true,
        anchor: '95%',
        listeners: {
            focus: function () {
                ConstruirWinArbolOrgDemandante();

            }
        }
    });

    tfentidadesrecuperacion = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Entidades',
        editable: false,
        id: 'tfentidadesrecuperacion',
        anchor: '95%',
        listeners: {
            focus: function () {
                CmbPlanesRecuperacion.clearValue();
                CmbPlanesRecuperacion.disable();
                ConstruirWinArbolEntidades();

            }
        }
    });


    //campo para el codigo
    tfcodigo = new Ext.form.TextField({
        id: 'tfcodigo',
        disabled: false,
        fieldLabel: 'C&oacute;digo',
        xtype: 'textfield',
        allowBlank: true,
        anchor: '95%',
        listeners: {
            focus: function () {
            }
        }
    });

    //campo para el numero de pieza
    tfnumpieza = new Ext.form.TextField({
        id: 'tfnumpieza',
        disabled: false,
        fieldLabel: 'N&uacute;mero de pieza',
        xtype: 'textfield',
        allowBlank: true,
        anchor: '95%',
        listeners: {
            focus: function () {
            }
        }
    });

    tfclasificacionplan = new Ext.form.TextField({
        fieldLabel: 'Clasificación del plan',
        disabled: true,
        editable: false,
        id: 'tfclasificacionplan',
        anchor: '95%',
        listeners: {
            focus: function () {
                ConstruirWinArbolClasificacionPlan();

            }
        }
    });

    //campo para el numero de pieza
    tfdenominacion = new Ext.form.TextField({
        id: 'tfdenominacion',
        disabled: false,
        fieldLabel: 'Denominaci&oacute;n',
        xtype: 'textfield',
        allowBlank: true,
        anchor: '95%',
        listeners: {
            focus: function () {
            }
        }
    });

    //combo para el ejercicio
    if (reporte == 8 || reporte == 3 || reporte == 1 || reporte == 2 || reporte == 7 || reporte == 6) {

        stEjercicio = new Ext.data.Store({
            url: 'getEjercicios',
            autoLoad: true,
            listeners: {
                load: function (t, n, e) {
                    cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                    tfclasificacionplan.enable();
                    if (reporte == 7) {
                        cbVia.enable();
                        storganodemandante.reload({
                            params: {
                                rect: objci.acciones.rector,
                                cb: 0
                            }
                        });
                    } else if (reporte == 8) {

                        storganodemandante.reload({
                            params: {
                                rect: objci.acciones.rector,
                                cb: 0
                            }
                        });
                        stCBRecuperacion.reload({
                            params: {
                                ident: objci.identidad,
                                rect: objci.acciones.rector,
                                idejercicio: cbEjercicio.getValue()
                            }
                        });
                    } else if (reporte != 3) {
                        Ext.getCmp('cbGasto').enable();
                        cmbComportamiento.enable();

                        if (valor != combo.getValue()) {
                            /* cmbComportamiento.reset();
                             //chbalancearR.reset();
                             //cbCBRecuperacion.clearValue();
                             tfentidadesrecuperacion.reset();
                             //cborganodemandante.clearValue();
                             //CmbPlanesRecuperacion.clearValue();
                             cbCBRecuperacion.disable();
                             tfentidadesrecuperacion.disable();
                             cborganodemandante.disable();
                             CmbPlanesRecuperacion.disable();
                             chbalancearR.disable();*/
                            cmbComportamiento.reset();
                            chbalancearR.reset();
                            cbCBRecuperacion.clearValue();
                            tfentidadesrecuperacion.reset();
                            cborganodemandante.clearValue();
                            CmbPlanesRecuperacion.clearValue();
                            cbCBRecuperacion.disable();
                            tfentidadesrecuperacion.disable();
                            cborganodemandante.disable();
                            CmbPlanesRecuperacion.disable();
                            chbalancearR.disable();
                        }
                    }
                    valor = combo.getValue();
                }
            },
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idejercicio'
            }, [{
                    name: 'idejercicio'
                }, {
                    name: 'ejercicio'
                }, {
                    name: 'estado'
                }])
        });
    } else {
        stEjercicio = new Ext.data.Store({
            url: 'listarEjercicios',
            id: 'idstEjercicio',
            autoLoad: true,
            reader: new Ext.data.JsonReader({}, [{
                    name: 'ejercicio'
                }, {
                    name: 'idejercicio'
                }])
        });
    }


    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stEjercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        fieldLabel: perfil.etiquetas.lbEjercicio,
        mode: 'local',
        editable: true,
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function (combo, record, index) {
                Ext.getCmp('cbPlanes').enable();
                stPlanes.reload();

            }
        }

    });
    //combo para los tipos de gastos
    stGasto = new Ext.data.Store({
        id: 'idtipogasto',
        url: 'cargarTipoGastos',
        autoLoad: false,
        reader: new Ext.data.JsonReader({}, [{
                name: 'idtipogasto'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function (st, opt) {


            }
        }
    });
    cbGasto = new Ext.ux.form.LovCombo({
        id: 'cbGasto',
        store: stGasto,
        disabled: true,
        displayField: 'denominacion',
        valueField: 'idtipogasto',
        fieldLabel: perfil.etiquetas.lbGasto,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        allowBlank: false,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function (combo, record, index) {
                Ext.getCmp('cbPlanes').enable();
            }
        }

    });

    //combo para el nivel del indicador
    stNivel = new Ext.data.Store({
        url: 'listarNivel',
        id: 'idstNivel',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'value',
            root: 'data'
        },
                [{
                        name: 'idnivelarbol'
                    }, {
                        name: 'nivelarbol'
                    }])
    });
    cbNivel = new Ext.form.ComboBox({
        id: 'cbNivel',
        store: stNivel,
        valueField: 'idnivelarbol',
        displayField: 'nivelarbol',
        fieldLabel: perfil.etiquetas.lbNivel,
        editable: true,
        mode: 'local',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione

    });

    //combo de planes
    stPlanes = new Ext.data.Store({
        id: 'idstPlanes',
        url: 'obtenerPlanesPorEjercicio',
        autoLoad: false,
        reader: new Ext.data.JsonReader({}, [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }]),
        listeners: {
            beforeload: function (st, opt) {
                st.baseParams.idejercicio = Ext.getCmp('cbEjercicio').getValue();

                if (tfclasificacionplan.getValue()) {
                    st.baseParams.denclasif = tfclasificacionplan.getValue();
                    st.baseParams.clasif = nodeIdsreporte;
                }


            }, load: function (st, opt, u) {
                Ext.getCmp('cbPlanes').enable();
            }
        }
    });
    cbPlanes = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        id: 'cbPlanes',
        disabled: true,
        store: stPlanes,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        listWidth: 250,
        fieldLabel: perfil.etiquetas.lbPlan,
        editable: true,
        mode: 'local',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function (combo, record, index) {

            },
            expand: function (combo) {
            }
        }

    });

    //combo de planes para recuperación para los datos del balance yanet
    stCmbPlanesRecuperacion = new Ext.data.Store({
        url: 'listarComboModelosRecuperacion',
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;

            },
            load: function () {
                CmbPlanesRecuperacion.enable();
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idmodelo',
            root: 'data'
        },
                [{
                        name: 'idmodelo'
                    }, {
                        name: 'denominacion'
                    }])
    });
    //Combo de Planes
    CmbPlanesRecuperacion = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        width: 168,
        listWidth: 250,
        fieldLabel: 'Plan',
        store: stCmbPlanesRecuperacion,
        valueField: 'idmodelo',
        displayField: 'denominacion',
        id: 'tbcmbPlanesRecuperacion',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        selectOnFocus: false
    }
    );

    //combo para centros de balance para recuperación para los datos del balance 
    stCBRecuperacion = new Ext.data.Store({
        url: 'ListarComboCentroBalanceRecuperacion',
        reader: new Ext.data.JsonReader({
            id: 'identidad',
            root: 'data'
        },
                [{
                        name: 'denominacion'
                    }, {
                        name: 'identidad'
                    }]),
        listeners: {
            load: function (r, e, u) {
                cbCBRecuperacion.enable();
                if (!objci.acciones.rector) {
                    cbCBRecuperacion.setValue(stCBRecuperacion.data.items[0].id);
                    cbCBRecuperacion.disable();
                    chbalancearR.enable();
                    storganodemandante.reload({
                        params: {
                            identidad: cbCBRecuperacion.getCheckedValue(),
                            rect: objci.acciones.rector,
                            cb: cb

                        }
                    });

                    stCmbPlanesRecuperacion.reload({
                        params: {
                            esrector: objci.acciones.rector,
                            idejercicio: cbEjercicio.getValue(),
                            identidad: cborganodemandante.getCheckedValue(),
                            check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                            idcb: cbCBRecuperacion.getCheckedValue(),
                            cb: CentroB,
                            comportamiento: cmbComportamiento.getValue()


                        }
                    });
                }

            }
        }
    });
    cbCBRecuperacion = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione",
        width: 170,
        listWidth: 250,
        fieldLabel: 'Centros de balance',
        store: stCBRecuperacion,
        valueField: 'identidad',
        displayField: 'denominacion',
        id: 'cbCBRecuperacion',
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        disabled: true,
        typeAhead: true,
        selectOnFocus: false,
        listeners: {
            select: function (combo, record, index) {

                if (reporte != 8) {

                    cborganodemandante.clearValue();
                    CmbPlanesRecuperacion.clearValue();
                    CmbPlanesRecuperacion.disable();
                    if (reporte == 8) {
                        cborganodemandante.enable();
                    } else {
                        cborganodemandante.disable();
                    }
                    soyCB = false;
                    CentroB = 1;
                    if (Ext.getCmp('chbalancearR').getValue() != true) {
                        storganodemandante.reload({
                            params: {
                                identidad: cbCBRecuperacion.getCheckedValue(),
                                rect: objci.acciones.rector,
                                cb: cb

                            }
                        });
                    }
                    chbalancearR.enable();
                    stCmbPlanesRecuperacion.reload({
                        params: {
                            esrector: objci.acciones.rector,
                            idejercicio: cbEjercicio.getValue(),
                            identidad: cborganodemandante.getCheckedValue(),
                            check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                            idcb: cbCBRecuperacion.getCheckedValue(),
                            cb: CentroB,
                            comportamiento: cmbComportamiento.getValue()


                        }
                    });
                }
            }
        }

    });

    storganodemandante = new Ext.data.Store({
        url: 'listarArbolEntidadesRecuperacion',
        reader: new Ext.data.JsonReader({
            id: 'id',
            root: 'data'
        },
                [{
                        name: 'text'
                    }, {
                        name: 'id'
                    }]),
        listeners: {
            load: function (r, e, u) {
                if (Ext.getCmp('chbalancearR').getValue() == false)
                    cborganodemandante.enable();
            }
        }
    });

    if (reporte == 7) {
        tituloCombo = 'Entidad';
    } else {
        tituloCombo = 'Órgano demandante';
    }

    cborganodemandante = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione",
        width: 169,
        listWidth: 250,
        fieldLabel: tituloCombo,
        store: storganodemandante,
        valueField: 'id',
        displayField: 'text',
        id: 'cborganodemandante',
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        disabled: true,
        typeAhead: true,
        selectOnFocus: false,
        listeners: {
            select: function (combo, record, index) {


                if (reporte != 8) {

                    CmbPlanesRecuperacion.clearValue();
                    CmbPlanesRecuperacion.disable();

                    soyCB = false;
                    if (objci.acciones.rector) {
                        stCmbPlanesRecuperacion.reload({
                            params: {
                                esrector: true,
                                idejercicio: cbEjercicio.getValue(),
                                identidad: cborganodemandante.getCheckedValue(),
                                check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                                idcb: cbCBRecuperacion.getCheckedValue(),
                                cb: CentroB,
                                comportamiento: cmbComportamiento.getValue()
                            }
                        });
                    } else {
                        stCmbPlanesRecuperacion.reload({
                            params: {
                                idejercicio: cbEjercicio.getValue(),
                                identidad: cborganodemandante.getCheckedValue(),
                                check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                                idcb: cbCBRecuperacion.getCheckedValue(),
                                cb: CentroB,
                                comportamiento: cmbComportamiento.getValue()
                            }
                        });
                    }
                } else {

                    soyCB = false;
                    if (objci.acciones.rector) {
                        stCmbPlanesRecuperacion.reload({
                            params: {
                                esrector: true,
                                idejercicio: cbEjercicio.getValue(),
                                identidad: cborganodemandante.getCheckedValue(),
                                check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                                idcb: cbCBRecuperacion.getCheckedValue(),
                                cb: CentroB,
                                comportamiento: cmbComportamiento.getValue()
                            }
                        });
                    } else {
                        stCmbPlanesRecuperacion.reload({
                            params: {
                                idejercicio: cbEjercicio.getValue(),
                                identidad: cborganodemandante.getCheckedValue(),
                                check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                                idcb: cbCBRecuperacion.getCheckedValue(),
                                cb: CentroB,
                                comportamiento: cmbComportamiento.getValue()
                            }
                        });
                    }
                }

            }
        }

    });


    var strComportamiento = [
        [1, 'Centro de balance'], [2, 'Órgano demandante']
    ];
    //----------------Combo de cargar de comportamiento
    cmbComportamiento = new Ext.form.ComboBox({
        id: 'cmbComportamiento',
        store: strComportamiento,
        fieldLabel: 'Comportamiento',
        height: 40,
        width: 169,
        displayField: 'comportamiento',
        hiddenName: 'idcomportamiento',
        valueField: 'idcomportamiento',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        loadingText: 'Cargando...',
        emptyText: 'Seleccione...',
        disabled: true,
        listeners: {
            select: function (combo, record, index) {
                cbCBRecuperacion.clearValue();
                tfentidadesrecuperacion.reset();
                cborganodemandante.clearValue();
                CmbPlanesRecuperacion.clearValue();
                cbCBRecuperacion.disable();
                tfentidadesrecuperacion.disable();
                cborganodemandante.disable();
                CmbPlanesRecuperacion.disable();
                chbalancearR.disable();
                chbalancearR.reset();
                if (combo.getValue() == 1) {
                    cb = 1;
                    od = null;
                } else if (combo.getValue() == 2) {
                    cb = null;
                    od = 1;
                }

                if (cmbComportamiento.getValue() == 1) {
                    stCBRecuperacion.reload({
                        params: {
                            ident: objci.identidad,
                            rect: objci.acciones.rector,
                            soyCB: cb,
                            soyDem: od,
                            idejercicio: cbEjercicio.getValue()
                        }
                    });
                    if (objci.acciones.rector) {
                        storganodemandante.reload({
                            params: {
                                identidad: cbCBRecuperacion.getCheckedValue(),
                                rect: objci.acciones.rector,
                                cb: cb

                            }
                        });

                        stCmbPlanesRecuperacion.reload({
                            params: {
                                esrector: objci.acciones.rector,
                                idejercicio: cbEjercicio.getValue(),
                                identidad: cborganodemandante.getCheckedValue(),
                                check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                                idcb: cbCBRecuperacion.getCheckedValue(),
                                cb: CentroB,
                                comportamiento: cmbComportamiento.getValue()


                            }
                        });
                    }

                } else {
                    storganodemandante.reload({
                        params: {
                            identidad: cbCBRecuperacion.getCheckedValue(),
                            rect: objci.acciones.rector,
                            cb: cb

                        }
                    });

                    stCmbPlanesRecuperacion.reload({
                        params: {
                            esrector: objci.acciones.rector,
                            idejercicio: cbEjercicio.getValue(),
                            identidad: cborganodemandante.getCheckedValue(),
                            check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                            idcb: cbCBRecuperacion.getCheckedValue(),
                            cb: CentroB,
                            comportamiento: cmbComportamiento.getValue()


                        }
                    });
                }
            }
        }

    });
    var valor = 0;
    if (reporte == 8 || reporte == 3) {
        tituloComboEjercicio = 'Ejercicio actual';
    } else {
        tituloComboEjercicio = 'Ejercicio';
    }
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stEjercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        fieldLabel: tituloComboEjercicio,
        editable: true,
        mode: 'local',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function (combo, record, index) {
                tfclasificacionplan.enable();
                if (reporte == 7) {
                    cbVia.enable();
                    storganodemandante.reload({
                        params: {
                            rect: objci.acciones.rector,
                            cb: 0
                        }
                    });
                } else if (reporte == 8) {

                    storganodemandante.reload({
                        params: {
                            rect: objci.acciones.rector,
                            cb: 0
                        }
                    });
                    stCBRecuperacion.reload({
                        params: {
                            ident: objci.identidad,
                            rect: objci.acciones.rector,
                            idejercicio: cbEjercicio.getValue()
                        }
                    });
                } else if (reporte != 3) {
                    Ext.getCmp('cbGasto').enable();
                    cmbComportamiento.enable();

                    if (valor != combo.getValue()) {
                        /* cmbComportamiento.reset();
                         //chbalancearR.reset();
                         //cbCBRecuperacion.clearValue();
                         tfentidadesrecuperacion.reset();
                         //cborganodemandante.clearValue();
                         //CmbPlanesRecuperacion.clearValue();
                         cbCBRecuperacion.disable();
                         tfentidadesrecuperacion.disable();
                         cborganodemandante.disable();
                         CmbPlanesRecuperacion.disable();
                         chbalancearR.disable();*/
                        cmbComportamiento.reset();
                        chbalancearR.reset();
                        cbCBRecuperacion.clearValue();
                        tfentidadesrecuperacion.reset();
                        cborganodemandante.clearValue();
                        CmbPlanesRecuperacion.clearValue();
                        cbCBRecuperacion.disable();
                        tfentidadesrecuperacion.disable();
                        cborganodemandante.disable();
                        CmbPlanesRecuperacion.disable();
                        chbalancearR.disable();
                    }
                }
                valor = combo.getValue();

            }
        }
    });
    cbEjercicioanterior = new Ext.form.ComboBox({
        id: 'cbEjercicioanterior',
        store: stEjercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        fieldLabel: 'Ejercicio anterior',
        editable: true,
        mode: 'local',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function (combo, record, index) {
                cbCBRecuperacion.enable();
                cborganodemandante.enable();
                if (reporte == 8) {
                    cbOACE.enable();
                    storganodemandante.reload({
                        params: {
                            rect: objci.acciones.rector,
                            cb: 1
                        }
                    });
                    stCBRecuperacion.reload({
                        params: {
                            ident: objci.identidad,
                            rect: objci.acciones.rector,
                            soyCB: 1,
                            soyDem: null
                        }
                    });
                    stCmbPlanesRecuperacion.reload({
                        params: {
                            esrector: true,
                            idejercicio: cbEjercicio.getValue(),
                            identidad: cborganodemandante.getCheckedValue(),
                            check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                            idcb: cbCBRecuperacion.getCheckedValue(),
                            cb: CentroB,
                            comportamiento: cmbComportamiento.getValue()
                        }
                    });
                } else if (reporte == 3) {
                    Ext.getCmp('cbGasto').enable();
                    Ext.getCmp('cbCB').enable();
                }
                valor = combo.getValue();
            }
        }
    });

//combo para centros de balance
    stCB = new Ext.data.Store({
        url: 'listarCentrobalance',
        id: 'idstCB',
        autoLoad: true,
        reader: new Ext.data.JsonReader({}, [{
                name: 'denominacion'
            }, {
                name: 'identidad'
            }])
    });
    cbCB = new Ext.ux.form.LovCombo({
        id: 'cbCB',
        store: stCB,
        displayField: 'denominacion',
        valueField: 'identidad',
        listWidth: 250,
        fieldLabel: perfil.etiquetas.lbCB,
        editable: true,
        mode: 'local',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        disabled: true
    });

    //combo de las vias
    stVia = new Ext.data.Store({
        url: 'listarViasadquisicion',
        id: 'idstVia',
        autoLoad: true,
        reader: new Ext.data.JsonReader({}, [{
                name: 'denominacion'
            }, {
                name: 'idviaadquisicion'
            },
            {name: 'uriviaadquisicion'}
        ])
    });

    if (reporte == 7) {
        enable = true;
    } else
        enable = false;

    cbVia = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        id: 'cbVia',
        store: stVia,
        displayField: 'denominacion',
        valueField: 'idviaadquisicion',
        fieldLabel: perfil.etiquetas.lbVia,
        listWidth: 250,
        editable: true,
        mode: 'local',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        disabled: enable,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione, listeners: {
            select: function (combo, record, index) {
                Ext.getCmp('cbOACE').enable();
                stOACE.reload();
            }
        }

    });

    //combo para los organos que satisfacen
    stOACE = new Ext.data.Store({
        url: 'listarOACE',
        id: 'idstOACE',
        autoLoad: true,
        listeners: {
            beforeload: function (st) {
                st.baseParams.idvia = cbVia.getValue();
            }
        },
        reader: new Ext.data.JsonReader({}, [{
                name: 'denominacion'
            }, {
                name: 'idorganosatisface'
            }])
    });

    if (reporte != 8) {
        disable = false;
    } else {
        disable = true;
    }

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
        disabled: disable,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione

    });

    //checkbox para mostrar los indicadores en el reporte
    chindicadores = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Mostrar indicadores en el reporte',
        id: 'chindicadores',
        checked: true,
        name: 'chindicadores'
    });
    //checkbox para balancear para la recuperacion para los datos del balance
    chbalancearR = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Balancear',
        id: 'chbalancearR',
        checked: false,
        name: 'chbalancearR',
        listeners: {
            check: function (st) {
                cborganodemandante.clearValue();
                cborganodemandante.disable();
                if (Ext.getCmp('chbalancearR').getValue() == true)
                    stCmbPlanesRecuperacion.reload({
                        params: {
                            esrector: objci.acciones.rector,
                            idejercicio: cbEjercicio.getValue(),
                            identidad: cborganodemandante.getCheckedValue(),
                            check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                            idcb: cbCBRecuperacion.getCheckedValue(),
                            cb: CentroB,
                            comportamiento: cmbComportamiento.getValue()


                        }
                    });
                else {
                    storganodemandante.reload({
                        params: {
                            identidad: cbCBRecuperacion.getCheckedValue(),
                            rect: objci.acciones.rector,
                            cb: cb

                        }
                    });
                    stCmbPlanesRecuperacion.reload({
                        params: {
                            esrector: objci.acciones.rector,
                            idejercicio: cbEjercicio.getValue(),
                            identidad: cborganodemandante.getCheckedValue(),
                            check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                            idcb: cbCBRecuperacion.getCheckedValue(),
                            cb: CentroB,
                            comportamiento: cmbComportamiento.getValue()


                        }
                    });
                }
            }
        }
    });

    //store para el combo del formato de los reportes
    scbformatreporte = new Ext.data.SimpleStore({
        fields: ['idformato', 'nombre'],
        data: [
            [1, 'HTML']
        ]
    });
    //combo de formato de los reportes
    cbformatreporte = new Ext.form.ComboBox({
        id: 'cbformatreporte',
        name: 'cbformatreporte',
        value: 1,
        fieldLabel: 'Formato del reporte',
        store: scbformatreporte,
        displayField: 'nombre',
        typeAhead: true,
        allowBlank: false,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        hiddenName: 'idformato',
        valueField: 'idformato',
        anchor: '90%',
        emptyText: 'Seleccionar',
        disabled: false,
        enableKeyEvents: true
    });

    //store para el combo de la orientacion del reporte
    scborientacionh = new Ext.data.SimpleStore({
        fields: ['idorientacion', 'nombre'],
        data: [
            [2, "Horizontal"],
            [1, "Vertical"]
        ]
    });
    //combo de la orientacion del reporte
    cborientacionh = new Ext.form.ComboBox({
        id: 'cborientacionh',
        name: 'cborientacionh',
        value: 2,
        fieldLabel: 'Orientacion de la hoja',
        store: scborientacionh,
        displayField: 'nombre',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        allowBlank: false,
        triggerAction: 'all',
        hiddenName: 'idorientacion',
        valueField: 'idorientacion',
        anchor: '90%',
        emptyText: 'Seleccionar',
        disabled: false,
        enableKeyEvents: true,
        listeners: {
            select: function (combo, record, index) {
                Ext.getCmp('fsvistadoc').remove(_this.arrayobjreporte[0]);
                _this.arrayobjreporte = [];

                var formato = _this.cbformatreporte.getValue();
                _this.orientacion = _this.cborientacionh.getValue();
                _this.anchohoja = '';
                if (_this.cbtipohoja.getValue()) {
                    var valor = _this.cbtipohoja.getValue();
                    _this.anchohoja = _this.stcbtipohoja.getById(valor).data.ancho;
                }
                _this.altohoja = '';
                if (_this.cbtipohoja.getValue()) {
                    var valor = _this.cbtipohoja.getValue();
                    _this.altohoja = _this.stcbtipohoja.getById(valor).data.alto;
                }
                var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
                var pvistapreviadoc = new Ext.Panel({
                    id: 'pvistadoc',
                    frame: false,
                    border: false,
                    layout: 'fit',
                    width: 218,
                    html: htmlvistadoc,
                    height: 150
                });
                Ext.getCmp('fsvistadoc').add(pvistapreviadoc);
                Ext.getCmp('fsvistadoc').doLayout();
            }
        }
    });

    //store del combo tipo de hojas
    stcbtipohoja = new Ext.data.Store({
        url: 'cargartipohojas',
        listeners: {
            load: function (store, records, options) {
                cbtipohoja.setValue('4');
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idtipohoja',
            root: "data"
        }, [{
                name: 'idtipohoja'
            }, {
                name: 'denominacion'
            }, {
                name: 'ancho'
            }, {
                name: 'alto'
            }])
    });
    //combo tipo de hojas
    cbtipohoja = new Ext.form.ComboBox({
        id: 'cbtipohoja',
        emptyText: 'Seleccione',
        fieldLabel: 'Tipo de hoja a imprimir',
        store: stcbtipohoja,
        hiddenName: 'idtipohoja',
        valueField: 'idtipohoja',
        displayField: 'denominacion',
        triggerAction: 'all',
        allowBlank: false,
        editable: true,
        loadingText: 'Cargando datos...',
        forceSelection: true,
        mode: 'local',
        anchor: '90%',
        listeners: {
            render: function (combo) {
                _this.stcbtipohoja.reload();
            },
            expand: function (combo) {
                _this.stcbtipohoja.reload();
            },
            select: function (combo, record, index) {
                orgdereporte = 1;
                Ext.getCmp('fsvistadoc').remove(_this.arrayobjreporte[0]);
                _this.arrayobjreporte = [];

                var formato = _this.cbformatreporte.getValue();
                _this.orientacion = _this.cborientacionh.getValue();
                _this.anchohoja = '';
                if (_this.cbtipohoja.getValue()) {
                    var valor = _this.cbtipohoja.getValue();
                    _this.anchohoja = _this.stcbtipohoja.getById(valor).data.ancho;
                }
                _this.altohoja = '';
                if (_this.cbtipohoja.getValue()) {
                    var valor = _this.cbtipohoja.getValue();
                    _this.altohoja = _this.stcbtipohoja.getById(valor).data.alto;
                }
                var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
                var pvistapreviadoc = new Ext.Panel({
                    id: 'pvistadoc',
                    frame: false,
                    border: false,
                    layout: 'fit',
                    width: 218,
                    html: htmlvistadoc,
                    height: 150
                });
                Ext.getCmp('fsvistadoc').add(pvistapreviadoc);
                Ext.getCmp('fsvistadoc').doLayout();
            }
        }
    });

    //fieldset para la configuracion del reporte
    fsconfigreporte = new Ext.form.FieldSet({
        collapsible: true,
        title: 'Filtros para visualizar el reporte',
        bodyStyle: 'padding:5px 5px 5px 5px',
        width: 575,
        height: 220,
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: .5,
                        border: false,
                        layout: 'form',
                        items: [cbformatreporte, cborientacionh, cbtipohoja]
                    },
                    {
                        columnWidth: .5,
                        border: false,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'panel',
                                id: 'fsvistadoc',
                                frame: false,
                                border: false,
                                layout: 'fit',
                                width: 240,
                                height: 200
                            }
                        ]
                    }
                ]
            }
        ]
    });


    switch (reporte) {
        case 1:
            altoformulario = 320;
            altoventana = 520;

            //fieldset para los campos de filtro
            fscamposfiltro = new Ext.form.FieldSet({
                collapsible: true,
                title: 'Filtros para obtener la informaci&oacute;n',
                bodyStyle: 'padding:5px 5px 5px 5px',
                width: 575,
                height: 230,
                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicio, tfclasificacionplan, cbVia, tfdenominacion]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbNivel, cbPlanes, tfcodigo, chindicadores]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [txforganoD, cbCB, tfnumpieza]
                            }
                        ]
                    }
                ]
            });
            break;
        case 2:
            altoformulario = 320;
            altoventana = 550;

            //fieldset para los campos de filtro
            fscamposfiltro = new Ext.form.FieldSet({
                collapsible: true,
                title: 'Filtros para obtener la informaci&oacute;n',
                bodyStyle: 'padding:5px 5px 5px 5px',
                width: 575,
                height: 240,
                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                layout: 'column',
                                border: false,
                                items: [
                                    {
                                        columnWidth: .33,
                                        border: false,
                                        layout: 'form',
                                        items: [cbEjercicio, tfclasificacionplan/*, cbVia*/, tfdenominacion, tfcodigo]
                                    },
                                    {
                                        columnWidth: .33,
                                        border: false,
                                        layout: 'form',
                                        items: [cbNivel, cbPlanes, chindicadores/*, tfcodigo*/]
                                    },
                                    {
                                        columnWidth: .33,
                                        border: false,
                                        layout: 'form',
                                        items: [txforganoD, cbCB, tfnumpieza, /*chindicadores*/]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            break;

        case 3:
            altoformulario = 320;
            altoventana = 510;

            //Redefiniendo el combo de ejercicios
            //combo para el ejercicio
            stEjercicio = new Ext.data.Store({
                url: 'listarEjercicios',
                id: 'idstEjercicio',
                autoLoad: true,
                reader: new Ext.data.JsonReader({}, [{
                        name: 'ejercicio'
                    }, {
                        name: 'idejercicio'
                    }])
            });

            //Redefiniendo el combo de planes
            //combo de planes
            var urlReporte = ""
            if (reporte == 3) {
                urlReporte = "obtenerPlanesPorEjercicioReporte"
            } else {
                urlReporte = "obtenerPlanesPorEjercicio"
            }
            stPlanes = new Ext.data.Store({
                id: 'idstPlanes',
                url: urlReporte,
                autoLoad: false,
                reader: new Ext.data.JsonReader({}, [{
                        name: 'denominacion'
                    }, {
                        name: 'idmodelo'
                    }, {
                        name: 'uridatosnomenclador'
                    }, {
                        name: 'iddatosnomenclador'
                    }]),
                listeners: {
                    beforeload: function (st, opt) {
                        st.baseParams.idejercicio = Ext.getCmp('cbEjercicio').getValue();
                        st.baseParams.idejercicioanterior = Ext.getCmp('cbEjercicioanterior').getValue();

                        var gastos = [];
                        a = cbGasto.getCheckedValue().split(',')
                        b = cbGasto.getCheckedValue('denominacion').split(',')
                        for (var i = 0; i < a.length; i++) {
                            gastos.push({
                                idtipogasto: a[i],
                                denominacion: b[i]
                            }
                            );
                        }

                        st.baseParams.arrayTipogasto = Ext.encode(gastos);

                    }
                }
            });
            cbPlanes = new Ext.ux.form.LovCombo({
                xtype: 'combo',
                id: 'cbPlanes',
                disabled: true,
                store: stPlanes,
                displayField: 'denominacion',
                valueField: 'idmodelo',
                listWidth: 250,
                fieldLabel: perfil.etiquetas.lbPlan,
                mode: 'remote',
                anchor: '95%',
                typeAhead: true,
                triggerAction: 'all',
                allowBlank: true,
                loadingText: perfil.etiquetas.lbCargando,
                emptyText: perfil.etiquetas.lbSeleccione,
                listeners: {
                    expand: function (combo, record, index) {
                        stPlanes.reload();
                    }
                }

            });

            //fieldset para los campos de filtro
            fscamposfiltro = new Ext.form.FieldSet({
                collapsible: true,
                title: 'Filtros para obtener la informaci&oacute;n',
                bodyStyle: 'padding:5px 5px 5px 5px',
                width: 575,
                height: 200,
                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicio, txforganoD, tfcodigo]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicioanterior, cbPlanes, tfdenominacion]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbGasto, cbCB, tfnumpieza]
                            }

                        ]
                    }
                ]

            });
            break;

        case 4:
            altoformulario = 320;
            altoventana = 530;

            //fieldset para los campos de filtro
            fscamposfiltro = new Ext.form.FieldSet({
                collapsible: true,
                title: 'Filtros para obtener la informaci&oacute;n',
                bodyStyle: 'padding:5px 5px 5px 5px',
                width: 575,
                height: 240,
                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicio, tfclasificacionplan, cbOACE, tfdenominacion]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbNivel, cbPlanes, tfcodigo, chindicadores]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [txforganoD, cbCB, tfnumpieza]
                            }
                        ]
                    }
                ]
            });
            break;
        case 5:
            altoformulario = 320;
            altoventana = 590;

            //fieldset para los campos de filtro
            fscamposfiltro = new Ext.form.FieldSet({
                collapsible: true,
                title: 'Filtros para obtener la informaci&oacute;n',
                bodyStyle: 'padding:5px 5px 5px 5px',
                width: 575,
                height: 280,
                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicio, tfclasificacionplan, cbVia, tfdenominacion]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbNivel, cbPlanes, cbOACE, tfcodigo, chindicadores]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [txforganoD, cbCB, tfnumpieza]
                            }
                        ]
                    }
                ]
            });
            break;
        case 6:
            altoformulario = 320;
            altoventana = 590;

            //fieldset para los campos de filtro
            fscamposfiltro = new Ext.form.FieldSet({
                collapsible: true,
                title: 'Filtros para obtener la informaci&oacute;n',
                bodyStyle: 'padding:5px 5px 5px 5px',
                width: 575,
                height: 280,
                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicio, cborganodemandante, tfcodigo, chindicadores]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cmbComportamiento, CmbPlanesRecuperacion, tfnumpieza]
                            }
                            ,
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbCBRecuperacion, tfdenominacion, chbalancearR]
                            }
                        ]
                    }
                ]
            });
            break;
        case 7:
            altoformulario = 280;
            altoventana = 400;

            //fieldset para los campos de filtro
            fscamposfiltro = new Ext.form.FieldSet({
                collapsible: true,
                title: 'Filtros para obtener la informaci&oacute;n',
                bodyStyle: 'padding:5px 5px 5px 5px',
                width: 575,
                height: 135,
                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicio, cbVia]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cborganodemandante]
                            }
                            ,
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [CmbPlanesRecuperacion]
                            }
                        ]
                    }
                ]
            });
            break;
        case 8:
            altoformulario = 320;
            altoventana = 500;

            //fieldset para los campos de filtro
            fscamposfiltro = new Ext.form.FieldSet({
                collapsible: true,
                title: 'Filtros para obtener la informaci&oacute;n',
                bodyStyle: 'padding:5px 5px 5px 5px',
                width: 575,
                height: 200,
                items: [
                    {
                        layout: 'column',
                        border: false,
                        items: [
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicio, cborganodemandante, tfnumpieza]
                            },
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbEjercicioanterior, CmbPlanesRecuperacion, tfdenominacion]
                            }
                            ,
                            {
                                columnWidth: .33,
                                border: false,
                                layout: 'form',
                                items: [cbCBRecuperacion, cbOACE, tfcodigo]
                            }
                        ]
                    }
                ]
            });
            break;
    }


    //construyo la imagen por defecto del reporte
    var formato = _this.cbformatreporte.getValue();
    _this.orientacion = _this.cborientacionh.getValue();
    _this.anchohoja = '';
    _this.altohoja = '';
    var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
    var pvistapreviadoc = new Ext.Panel({
        id: 'pvistadoc',
        frame: false,
        border: false,
        layout: 'fit',
        width: 218,
        html: htmlvistadoc,
        height: 150
    });
    _this.arrayobjreporte.push(pvistapreviadoc);
    Ext.getCmp('fsvistadoc').add(pvistapreviadoc);

    //formulario para las configuraciones del reporte
    _this.fpConfigReporte = new Ext.FormPanel({
        id: 'fpConfigReporte',
        frame: false,
        border: false,
        rezisable: false,
        region: "center",
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 5px 5px',
        width: 500,
        height: altoformulario,
        items: [fscamposfiltro, fsconfigreporte]
    });


    //ventana para filtrar los datos de reporte y configurar la hoja		
    _this.winConfigReporte = new Ext.Window({
        id: 'winConfigReporte',
        title: "Obtener reporte",
        constrain: true,
        width: 600,
        height: altoventana,
        draggable: true,
        resizable: false,
        modal: true,
        layout: 'border',
        closeAction: 'destroy',
        items: [_this.fpConfigReporte],
        buttons: [
            new Ext.Button({
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar datos',
                //icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                handler: function () {
                    _this.winConfigReporte.destroy();
                }
            }),
            new Ext.Button({
                text: 'Aceptar',
                tooltip: 'Guardar datos y  cerrar ventana',
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                handler: function () {
                    if (fpConfigReporte.getForm().isValid()) {
                        mostrarReportes();
                        _this.winConfigReporte.destroy();
                    } else
                        mostrarMensaje(3, 'Por favor verifique, hay campos con valores incorrectos o vacíos.')
                }
            })
        ]
    });

    _this.stcbtipohoja.reload();
    _this.winConfigReporte.show();
    _this.cborientacionh.setValue(2);
    _this.cbformatreporte.setValue(1);

}

this.ObtenerImgVistaDoc = function (formato, orientacion, ancho, alto) {
    var imgname = "img_doc_previa";
    if (orientacion == '2') {
        var temp = ancho;
        _this.anchohoja = alto;
        _this.altohoja = temp;
        imgname = "img_doc_previa_horizontal";
    }
    var html = "<center><div style='width:auto;height:auto;position:relative;float:center'>" +
            "<div style='width:18px;height:160px;position:relative;float:left;margin-top:70px;margin-left:5px;'><b>" + _this.altohoja + "</b></div>" +
            "<div style='width:190px;height:160px;position:relative;float:left'><img src='" + perfil.dirImg + imgname + ".png'></img></div>" +
            "<div style='width:150px;height:20px;position:relative;float:left;margin-left:5px;'><b>" + _this.anchohoja + "</b></div>" +
            "</div></center>";

    return html;
}

function ConstruirWinArbolOrgDemandante() {
    if (WinArbolOrgDemandante)
        WinArbolOrgDemandante.destroy();

    //loader del arbol donde se muestran los organos demandantes
    loadertpOrgDemandante = new Ext.tree.TreeLoader({
        dataUrl: 'cargarOrganosDemandantes',
        scope: this,
        listeners: {
            beforeload: function (tl, n) {
            },
            load: function () {
            }
        }

    });


    //arbol donde se muestran los organos demandantes
    tpOrgDemandante = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        border: false,
        region: 'center',
        id: 'tpOrgDemandante',
        height: 310,
        listeners: {
            click: function (node, e) {
            }

        },
        loader: loadertpOrgDemandante,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Organos demandantes',
            tipo: 0,
            expanded: true,
            id: '0'
        })

    });
    //ventana donde se muestran las opciones para escoger los organos demandantes
    WinArbolOrgDemandante = new Ext.Window({
        title: 'Órganos demandantes',
        modal: true,
        height: 400,
        constrain: true,
        width: 375,
        layout: 'border',
        resizable: false,
        items: [tpOrgDemandante],
        buttons: [
            new Ext.Button({
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos.',
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function () {
                    WinArbolOrgDemandante.destroy();
                }
            }),
            new Ext.Button({
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                id: 'btnaceptar1',
                tooltip: 'Guardar datos y cerrar ventana.',
                text: perfil.etiquetas.lbBtnAceptar,
                handler: function () {
                    guardarDenoeIds();
                    WinArbolOrgDemandante.destroy();
                }
            })
        ]

    });
    WinArbolOrgDemandante.show();

}


//*********************
function ConstruirWinArbolEntidades() {
    if (WinArbolEntidades)
        WinArbolEntidades.destroy();

    //loader del arbol donde se muestran los organos demandantes
    loadertpEntidades = new Ext.tree.TreeLoader({
        dataUrl: 'ListarEntidadesRecuperacion',
        scope: this,
        listeners: {
            beforeload: function (tl, n) {

                tl.baseParams.checked = n.attributes.checked;
            },
            load: function () {
            }
        }

    });


    //arbol donde se muestran los organos demandantes
    tpEntidades = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        border: false,
        region: 'center',
        id: 'tpEntidades',
        height: 310,
        listeners: {
            click: function (node, e) {
                nodeIdsreportePlanes = '';
                entidadesreporte = node.text;
                nodeIdsreportePlanes = node.id + nodeIdsreportePlanes;

            },
            checkchange: function (node, b) {

                node.eachChild(function () {
                    node.attributes.checked = b;

                })

            }

        },
        loader: loadertpEntidades,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Entidades',
            tipo: 0,
            expanded: true,
            id: '0'
        })

    });
    //ventana donde se muestran las opciones para escoger los organos demandantes
    WinArbolEntidades = new Ext.Window({
        title: 'Entidades',
        modal: true,
        height: 400,
        constrain: true,
        width: 375,
        layout: 'fit',
        resizable: false,
        items: [tpEntidades],
        buttons: [
            new Ext.Button({
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos.',
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function () {
                    WinArbolEntidades.destroy();
                }
            }),
            new Ext.Button({
                //  icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                id: 'btnaceptar1',
                tooltip: 'Guardar datos y cerrar ventana.',
                text: perfil.etiquetas.lbBtnAceptar,
                handler: function () {
                    Ext.getCmp('tfentidadesrecuperacion').setRawValue(entidadesreporte);
                    Ext.getCmp('tfentidadesrecuperacion').clearInvalid();
                    WinArbolEntidades.destroy();

                    if (objci.acciones.rector) {
                        stCmbPlanesRecuperacion.reload({
                            params: {
                                esrector: true,
                                idejercicio: cbEjercicio.getValue(),
                                identidad: nodeIdsreportePlanes,
                                check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                                idcb: cbCBRecuperacion.getValue(),
                                cb: CentroB,
                                comportamiento: cmbComportamiento.getValue()


                            }
                        });
                    } else {
                        stCmbPlanesRecuperacion.reload({
                            params: {
                                idejercicio: cbEjercicio.getValue(),
                                identidad: nodeIdsreportePlanes,
                                check: (Ext.getCmp('chbalancearR').getValue() == true) ? 1 : 0,
                                idcb: cbCBRecuperacion.getValue(),
                                cb: CentroB,
                                comportamiento: cmbComportamiento.getValue()


                            }
                        });
                    }

                }
            }),
        ]

    });
    WinArbolEntidades.show();

}
//function mostrarAyudaR(opcion) {
//    var urlayuda = "../../../comun/templates/Ayuda/Recuperaciones/" + opcion + ".html";
//    window.open(urlayuda, "Ayuda", "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
//}
function guardarDenoeIds() {
    var denominacion = '', chequeados = tpOrgDemandante.getChecked();

    for (var i = 0; i < chequeados.length; i++) {
        organos.push({
            idorgano: chequeados[i].id,
            organoden: chequeados[i].attributes.text
        });

        denominacion += chequeados[i].text + ',';
    }

    txforganoD.setRawValue(denominacion.substr(0, denominacion.length - 1));
}

function ConstruirWinArbolClasificacionPlan() {

    var htmlruta = '<spam style="margin-left:1em;">Trazabilidad:</spam><spam style="margin-left:1em;"></spam>' + rutareporte;
    if (denominacionclasifreporte == '') {
        htmlruta = '<spam style="font-size:11px;color:red;margin-top:2em;margin-left:1em;margin-bottom:2em;">Seleccione la clasificaci&oacute;n deseada...</spam>';
    }

    //label donde se almacena la trazabilidad de la clasificacion
    tfdenominacioncaract = new Ext.form.Label({
        html: htmlruta,
        style: 'font-size:11px;color:red;margin-top:2em;margin-left:1em;margin-bottom:2em;',
        listeners: {
            render: function (field) {

            }
        }
    });

    //loader del arbol donde se muestran las clasificaciones anidadas
    loadertpClasifPlanes = new Ext.tree.TreeLoader({
        dataUrl: 'cargarClasifPlanes',
        listeners: {
            beforeload: function (tl, n) {
                var uri = 'tipodeplan';
                var rutareporte = '';
                this.baseParams = {
                    uri: uri,
                    ruta: rutareporte,
                    iddatosnomenclador: n.attributes.iddatosnomenclador
                };
            }
        }
    });

    //arbol donde se muestran las clasificaciones anidadas
    tpClasifPlanes = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        border: false,
        region: 'center',
        id: 'tpClasifPlanes',
        height: 310,
        listeners: {
            click: function (node, e) {
                rutareporte = '';
                denominacionclasifreporte = '';
                nodeIdsreporte = '';
                while (node.parentNode) {
                    if (rutareporte == '') {
                        rutareporte = '<spam style="font-size:11px;color:red;margin-top:2em;margin-bottom:2em;"><strong>' + node.text + '</strong></spam>';
                        denominacionclasifreporte = node.text;
                    } else {
                        rutareporte = '<spam style="font-size:11px;color:red;margin-top:2em;margin-bottom:2em;"><strong>' + node.text + '</strong></spam>' + " ->" + rutareporte;
                        denominacionclasifreporte = node.text + " -> " + denominacionclasifreporte;
                    }
                    nodeIdsreporte = node.id + "+" + nodeIdsreporte;
                    node = node.parentNode;
                }

                if (rutareporte != '') {
                    Ext.getCmp('ptext').remove(tfdenominacioncaract);
                    tfdenominacioncaract = new Ext.form.Label({
                        id: 'tfdenominacioncaract',
                        html: '<spam style="margin-left:1em;">Trazabilidad:</spam><spam style="margin-left:1em;"></spam>' + rutareporte
                    });
                    Ext.getCmp('ptext').add(tfdenominacioncaract);
                    Ext.getCmp('ptext').doLayout();
                }

            }

        },
        loader: loadertpClasifPlanes,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Clasificaciones',
            tipo: 0,
            expanded: true,
            id: '0'
        })

    });


    //ventana donde se muestran las opciones para escoger la clasificacion del plan
    winClasifPlanes = new Ext.Window({
        title: 'Clasificaci&oacute;n del plan',
        modal: true,
        height: 400,
        width: 450,
        constrain: true,
        layout: 'border',
        resizable: false,
        items: [
            new Ext.Panel({
                region: 'north',
                id: 'ptext',
                layout: 'form',
                height: 20,
                border: false,
                items: tfdenominacioncaract
            }),
            tpClasifPlanes],
        buttons: [
            new Ext.Button({
                //icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos.',
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function () {
                    winClasifPlanes.destroy();
                }
            }),
            new Ext.Button({
                // icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                id: 'btnaceptar1',
                tooltip: 'Guardar datos y cerrar ventana.',
                text: perfil.etiquetas.lbBtnAceptar,
                handler: function () {

                    Ext.getCmp('tfclasificacionplan').setRawValue(denominacionclasifreporte);
                    Ext.getCmp('tfclasificacionplan').clearInvalid();
                    winClasifPlanes.destroy();
                    cbPlanes.clearValue();
                    stPlanes.reload();
                }
            })

        ]

    });

    winClasifPlanes.show();
}
function proyeccionPlanifWin() {

//combo de los componentes
    stComponentes = [
        [1, 'Niveles de actividad'],
        [2, 'Plan'],
        [3, 'Balance material']];

    cmbComponentes = new Ext.form.ComboBox({
        id: 'cmbComponentes',
        store: stComponentes,
        typeAhead: true,
        fieldLabel: 'Componente',
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        editable: true,
        anchor: '95%',
        emptyText: "Seleccione...",
        loadingText: perfil.etiquetas.lbCargando,
        selectOnFocus: true,
        listeners: {
            select: function (combo, record, index) {
                if (cbEjercicioAnno1.getValue() != null && cbEjercicioAnno1.getValue() != '' && cbEjercicioAnno1.getValue() != "") {
                    cbOrgDemand.clearValue();
                    cbOrgDemand.disable();
                    stcbOrgDemand.reload();
                    Ext.getCmp('CalcularIF').enable();
                }
                Ext.getCmp('importecalculadoG1').reset();
                Ext.getCmp('importecalculadoV1').reset();
                Ext.getCmp('importecalculadoG2').reset();
                Ext.getCmp('importecalculadoV2').reset();
                Ext.getCmp('importecalculadoG3').reset();
                Ext.getCmp('importecalculadoV3').reset();
                Ext.getCmp('importecalculadoG4').reset();
                Ext.getCmp('importecalculadoV4').reset();
                Ext.getCmp('importecalculadoG5').reset();
                Ext.getCmp('importecalculadoV5').reset();
                Ext.getCmp('importeG').reset();
                Ext.getCmp('importeV').reset();
                Ext.getCmp('Generar').disable();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }
    });

    //combo del ejercicio para el año 1
    stEjercicioAnno1 = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }])
    });

    cbEjercicioAnno1 = new Ext.form.ComboBox({
        id: 'cbEjercicioAnno1',
        store: stEjercicioAnno1,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        fieldLabel: 'Ejercicio base',
        mode: 'local',
        editable: true,
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function (combo, record, index) {
                if (cmbComponentes.getValue() != null && cmbComponentes.getValue() != '' && cmbComponentes.getValue() != "") {
                    cbOrgDemand.clearValue();
                    cbOrgDemand.disable();
                    stcbOrgDemand.reload();
                    Ext.getCmp('CalcularIF').enable();
                }
                Ext.getCmp('importecalculadoG1').reset();
                Ext.getCmp('importecalculadoV1').reset();
                Ext.getCmp('importecalculadoG2').reset();
                Ext.getCmp('importecalculadoV2').reset();
                Ext.getCmp('importecalculadoG3').reset();
                Ext.getCmp('importecalculadoV3').reset();
                Ext.getCmp('importecalculadoG4').reset();
                Ext.getCmp('importecalculadoV4').reset();
                Ext.getCmp('importecalculadoG5').reset();
                Ext.getCmp('importecalculadoV5').reset();
                Ext.getCmp('importeG').reset();
                Ext.getCmp('importeV').reset();
                Ext.getCmp('Generar').disable();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }

    });

    //combo que lista las entidades organos demandantes hijas directas de la entidad logueada
    stcbOrgDemand = new Ext.data.Store({
        url: 'listarEntidadesDemandantesProyPlanif',
        reader: new Ext.data.JsonReader({
            id: 'identidad',
            root: 'data'
        },
                [{
                        name: 'denominacion'
                    }, {
                        name: 'identidad'
                    }]),
        listeners: {
            beforeload: function (st, opt) {
                this.baseParams = {
                    componente: cmbComponentes.getValue(),
                    idejercicio: cbEjercicioAnno1.getValue()
                };

            },
            load: function (r, e, u) {
                cbOrgDemand.enable();
                CmbPlanesPP.clearValue();
                CmbPlanesPP.disable();
                if (stcbOrgDemand.data.length != 0) {
                    stCmbPlanesPP.reload();
                }
            }
        }
    });
    cbOrgDemand = new Ext.form.ComboBox({
        id: 'cbOrgDemand',
        store: stcbOrgDemand,
        displayField: 'denominacion',
        valueField: 'identidad',
        fieldLabel: 'Órganos demandantes',
        mode: 'local',
        disabled: true,
        editable: true,
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: "Seleccione...",
        listeners: {
            select: function (combo, record, index) {
                CmbPlanesPP.clearValue();
                CmbPlanesPP.disable();
                if (stcbOrgDemand.data.length != 0) {
                    stCmbPlanesPP.reload();
                }
                Ext.getCmp('importecalculadoG1').reset();
                Ext.getCmp('importecalculadoV1').reset();
                Ext.getCmp('importecalculadoG2').reset();
                Ext.getCmp('importecalculadoV2').reset();
                Ext.getCmp('importecalculadoG3').reset();
                Ext.getCmp('importecalculadoV3').reset();
                Ext.getCmp('importecalculadoG4').reset();
                Ext.getCmp('importecalculadoV4').reset();
                Ext.getCmp('importecalculadoG5').reset();
                Ext.getCmp('importecalculadoV5').reset();
                Ext.getCmp('importeG').reset();
                Ext.getCmp('importeV').reset();
                Ext.getCmp('Generar').disable();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }

    });

    //combo de planes
    stCmbPlanesPP = new Ext.data.Store({
        url: 'listarComboModelosPP',
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;
                if (cbOrgDemand.getValue() != '' && cbOrgDemand.getValue() != null && cbOrgDemand.getValue() != undefined) {
                    this.baseParams = {
                        componente: cmbComponentes.getValue(),
                        identidades: cbOrgDemand.getValue(),
                        idejercicio: cbEjercicioAnno1.getValue(),
                        caso: 1
                    };
                } else {
                    this.baseParams = {
                        componente: cmbComponentes.getValue(),
                        identidades: Ext.encode(stcbOrgDemand.data.keys),
                        idejercicio: cbEjercicioAnno1.getValue(),
                        caso: 2
                    };
                }

            },
            load: function () {
                CmbPlanesPP.enable();
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idmodelo',
            root: 'data'
        },
                [{
                        name: 'idmodelo'
                    }, {
                        name: 'denominacion'
                    }])
    });

    CmbPlanesPP = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        anchor: '95%',
        fieldLabel: 'Plan',
        store: stCmbPlanesPP,
        valueField: 'idmodelo',
        displayField: 'denominacion',
        id: 'CmbPlanesPP',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        selectOnFocus: false,
        listeners: {
            select: function (combo, record, index) {
                Ext.getCmp('importecalculadoG1').reset();
                Ext.getCmp('importecalculadoV1').reset();
                Ext.getCmp('importecalculadoG2').reset();
                Ext.getCmp('importecalculadoV2').reset();
                Ext.getCmp('importecalculadoG3').reset();
                Ext.getCmp('importecalculadoV3').reset();
                Ext.getCmp('importecalculadoG4').reset();
                Ext.getCmp('importecalculadoV4').reset();
                Ext.getCmp('importecalculadoG5').reset();
                Ext.getCmp('importecalculadoV5').reset();
                Ext.getCmp('importeG').reset();
                Ext.getCmp('importeV').reset();
                Ext.getCmp('Generar').disable();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }
    }
    );

    //text importe gastos
    importeG = {
        xtype: 'textfield',
        id: 'importeG',
        anchor: '95%',
        fieldLabel: 'Importe gastos',
        editable: false,
        disabled: true
    };
    //text importe ingresos
    importeV = {
        xtype: 'textfield',
        id: 'importeV',
        anchor: '95%',
        fieldLabel: 'Importe ingresos',
        editable: false,
        disabled: true
    };
    //text para el porciento entre annos
    porcientoEntreAnnos = {
        xtype: 'numberfield',
        id: 'porcientoEntreAnnos',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 1,
        allowBlank: false,
        value: '100',
        disabled: true,
        anchor: '95%',
        enableKeyEvents: true,
        editable: false,
        fieldLabel: 'Porciento entre años',
        listeners: {
            focus: function (tf, nT, oT) {
                Ext.getCmp('importecalculadoG1').reset();
                Ext.getCmp('importecalculadoV1').reset();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }
    };

    //text para el porciento 1
    porciento1 = {
        xtype: 'numberfield',
        id: 'porciento1',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 1,
        allowBlank: false,
        value: '100',
        anchor: '95%',
        enableKeyEvents: true,
        editable: false,
        fieldLabel: 'Porciento',
        listeners: {
            focus: function (tf, nT, oT) {
                Ext.getCmp('importecalculadoG1').reset();
                Ext.getCmp('importecalculadoV1').reset();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }
    };
    //text para el porciento 2
    porciento2 = {
        xtype: 'numberfield',
        id: 'porciento2',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 1,
        allowBlank: false,
        value: '100',
        anchor: '95%',
        enableKeyEvents: true,
        editable: false,
        fieldLabel: 'Porciento',
        listeners: {
            focus: function (tf, nT, oT) {
                Ext.getCmp('importecalculadoG2').reset();
                Ext.getCmp('importecalculadoV2').reset();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }
    };
    //text para el porciento 3
    porciento3 = {
        xtype: 'numberfield',
        id: 'porciento3',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 1,
        allowBlank: false,
        value: '100',
        anchor: '95%',
        enableKeyEvents: true,
        editable: false,
        fieldLabel: 'Porciento',
        listeners: {
            focus: function (tf, nT, oT) {
                Ext.getCmp('importecalculadoG3').reset();
                Ext.getCmp('importecalculadoV3').reset();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }
    };
    //text para el porciento 4
    porciento4 = {
        xtype: 'numberfield',
        id: 'porciento4',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 1,
        allowBlank: false,
        value: '100',
        anchor: '95%',
        enableKeyEvents: true,
        editable: false,
        fieldLabel: 'Porciento',
        listeners: {
            focus: function (tf, nT, oT) {
                Ext.getCmp('importecalculadoG4').reset();
                Ext.getCmp('importecalculadoV4').reset();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }
    };
    //text para el porciento 5
    porciento5 = {
        xtype: 'numberfield',
        id: 'porciento5',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 1,
        allowBlank: false,
        anchor: '95%',
        enableKeyEvents: true,
        value: '100',
        editable: false,
        fieldLabel: 'Porciento',
        listeners: {
            focus: function (tf, nT, oT) {
                Ext.getCmp('importecalculadoG5').reset();
                Ext.getCmp('importecalculadoV5').reset();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();
            }
        }
    };

    //text importe calculado gastos 1
    importecalculadoG1 = {
        xtype: 'textfield',
        id: 'importecalculadoG1',
        anchor: '95%',
        fieldLabel: 'Importe calculado gastos',
        editable: false,
        disabled: true
    };
    //text importe calculado ingresos 1
    importecalculadoV1 = {
        xtype: 'textfield',
        id: 'importecalculadoV1',
        anchor: '95%',
        fieldLabel: 'Importe calculado ingresos',
        editable: false,
        disabled: true
    };

    //text importe calculado gastos 2
    importecalculadoG2 = {
        xtype: 'textfield',
        id: 'importecalculadoG2',
        anchor: '95%',
        fieldLabel: 'Importe calculado gastos',
        editable: false,
        disabled: true
    };
    //text importe calculado ingresos 2
    importecalculadoV2 = {
        xtype: 'textfield',
        id: 'importecalculadoV2',
        anchor: '95%',
        fieldLabel: 'Importe calculado ingresos',
        editable: false,
        disabled: true
    };

    //text importe calculado gastos 3
    importecalculadoG3 = {
        xtype: 'textfield',
        id: 'importecalculadoG3',
        anchor: '95%',
        fieldLabel: 'Importe calculado gastos',
        editable: false,
        disabled: true
    };

    //text importe calculado ingresos 3
    importecalculadoV3 = {
        xtype: 'textfield',
        id: 'importecalculadoV3',
        anchor: '95%',
        fieldLabel: 'Importe calculado ingresos',
        editable: false,
        disabled: true
    };

    //text importe calculado gastos 4
    importecalculadoG4 = {
        xtype: 'textfield',
        id: 'importecalculadoG4',
        anchor: '95%',
        fieldLabel: 'Importe calculado gastos',
        editable: false,
        disabled: true
    };

    //text importe calculado ingresos 4
    importecalculadoV4 = {
        xtype: 'textfield',
        id: 'importecalculadoV4',
        anchor: '95%',
        fieldLabel: 'Importe calculado ingresos',
        editable: false,
        disabled: true
    };

    //text importe calculado gastos 5
    importecalculadoG5 = {
        xtype: 'textfield',
        id: 'importecalculadoG5',
        anchor: '95%',
        fieldLabel: 'Importe calculado gastos',
        editable: false,
        disabled: true
    };

    //text importe calculado ingresos 5
    importecalculadoV5 = {
        xtype: 'textfield',
        id: 'importecalculadoV5',
        anchor: '95%',
        fieldLabel: 'Importe calculado ingresos',
        editable: false,
        disabled: true
    };

    //checkbox ver detalle 1
    chDetalle1 = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Ver detalles',
        id: 'chDetalle1',
        anchor: '95%',
        checked: false,
        name: 'chDetalle1',
        height: 40,
        listeners: {
            check: function (ch, checked) {
                if (checked) {
                    chDetalle4.disable();
                    chDetalle3.disable();
                    chDetalle2.disable();
                    chDetalle5.disable();
                } else {
                    chDetalle4.enable();
                    chDetalle3.enable();
                    chDetalle2.enable();
                    chDetalle5.enable();
                }
            }
        }
    });

    //checkbox ver % entre annos
    chPorcientoEntreAnnos = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Porciento entre años',
        id: 'chPorcientoEntreAnnos',
        anchor: '95%',
        checked: false,
        name: 'chPorcientoEntreAnnos',
        height: 40,
        listeners: {
            check: function (ch, checked) {
                if (checked) {
                    Ext.getCmp('porcientoEntreAnnos').enable();
                    chDetalle1.disable();
                    chDetalle2.disable();
                    chDetalle3.disable();
                    chDetalle4.disable();
                    chDetalle5.disable();
                } else {
                    Ext.getCmp('porcientoEntreAnnos').disable();
                    chDetalle1.enable();
                    chDetalle2.enable();
                    chDetalle3.enable();
                    chDetalle4.enable();
                    chDetalle5.enable();
                }
                Ext.getCmp('importecalculadoG1').reset();
                Ext.getCmp('importecalculadoV1').reset();
                Ext.getCmp('importecalculadoG2').reset();
                Ext.getCmp('importecalculadoV2').reset();
                Ext.getCmp('importecalculadoG3').reset();
                Ext.getCmp('importecalculadoV3').reset();
                Ext.getCmp('importecalculadoG4').reset();
                Ext.getCmp('importecalculadoV4').reset();
                Ext.getCmp('importecalculadoG5').reset();
                Ext.getCmp('importecalculadoV5').reset();
                Ext.getCmp('exportar').disable();
                Ext.getCmp('exportarq').disable();


            }
        }
    });
    //checkbox ver detalle 2
    chDetalle2 = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Ver detalles',
        id: 'chDetalle2',
        anchor: '95%',
        checked: false,
        name: 'chDetalle2',
        height: 42,
        listeners: {
            check: function (ch, checked) {
                if (checked) {
                    chDetalle4.disable();
                    chDetalle3.disable();
                    chDetalle5.disable();
                    chDetalle1.disable();
                } else {
                    chDetalle4.enable();
                    chDetalle3.enable();
                    chDetalle5.enable();
                    chDetalle1.enable();
                }
            }
        }
    });
    //checkbox ver detalle 3
    chDetalle3 = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Ver detalles',
        id: 'chDetalle3',
        anchor: '95%',
        checked: false,
        name: 'chDetalle3',
        height: 42,
        listeners: {
            check: function (ch, checked) {
                if (checked) {
                    chDetalle4.disable();
                    chDetalle5.disable();
                    chDetalle2.disable();
                    chDetalle1.disable();
                } else {
                    chDetalle4.enable();
                    chDetalle5.enable();
                    chDetalle2.enable();
                    chDetalle1.enable();
                }
            }
        }
    });
    //checkbox ver detalle 4
    chDetalle4 = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Ver detalles',
        id: 'chDetalle4',
        anchor: '95%',
        checked: false,
        name: 'chDetalle4',
        height: 42,
        listeners: {
            check: function (ch, checked) {
                if (checked) {
                    chDetalle5.disable();
                    chDetalle3.disable();
                    chDetalle2.disable();
                    chDetalle1.disable();
                } else {
                    chDetalle5.enable();
                    chDetalle3.enable();
                    chDetalle2.enable();
                    chDetalle1.enable();
                }
            }
        }
    });
    //checkbox ver detalle 5
    chDetalle5 = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Ver detalles',
        id: 'chDetalle5',
        anchor: '95%',
        checked: false,
        name: 'chDetalle5',
        height: 20,
        listeners: {
            check: function (ch, checked) {
                if (checked) {
                    chDetalle4.disable();
                    chDetalle3.disable();
                    chDetalle2.disable();
                    chDetalle1.disable();
                } else {
                    chDetalle4.enable();
                    chDetalle3.enable();
                    chDetalle2.enable();
                    chDetalle1.enable();
                }
            }
        }
    });
    //formulario para seleccionar datos generales para hacer el reporte
    fscamposgeneralProyPlanif = new Ext.form.FieldSet({
        title: 'Filtros globales para obtener la informaci&oacute;n',
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: .33,
                        border: false,
                        layout: 'form',
                        items: [cmbComponentes, CmbPlanesPP, chPorcientoEntreAnnos]
                    },
                    {
                        columnWidth: .33,
                        border: false,
                        layout: 'form',
                        items: [cbEjercicioAnno1, importeG, porcientoEntreAnnos]
                    },
                    {
                        columnWidth: .33,
                        border: false,
                        layout: 'form',
                        items: [cbOrgDemand, importeV]
                    }
                ]
            }
        ]
    });

    //formulario para seleccionar ejercicios para hacer el reporte
    fscamposProyPlanif = new Ext.form.FieldSet({
        title: 'Filtros por año para obtener la informaci&oacute;n',
        items: [
            {
                layout: 'column',
                border: false,
                items: [{
                        columnWidth: .28,
                        border: false,
                        layout: 'form',
                        items: [porciento1, porciento2, porciento3, porciento4, porciento5]
                    }
                    , {
                        columnWidth: .29,
                        border: false,
                        layout: 'form',
                        items: [importecalculadoG1, importecalculadoG2, importecalculadoG3, importecalculadoG4, importecalculadoG5]
                    }, {
                        columnWidth: .29,
                        border: false,
                        layout: 'form',
                        items: [importecalculadoV1, importecalculadoV2, importecalculadoV3, importecalculadoV4, importecalculadoV5]
                    }
                    , {
                        columnWidth: .14,
                        border: false,
                        layout: 'form',
                        bodyStyle: 'paddingTop: 15px;',
                        items: [chDetalle1, chDetalle2, chDetalle3, chDetalle4, chDetalle5]
                    }
                ]
            }
        ]
    });

    //panel para mostrar formulario de selección de datos generalespara hacer el reporte
    fpgeneralProyPlanif = new Ext.FormPanel({
        id: 'fpgeneralProyPlanif',
        frame: false,
        layout: 'fit',
        region: 'center',
        border: false,
        rezisable: false,
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 5px 5px',
        items: [fscamposgeneralProyPlanif]
    });
    //panel para mostrar formulario de selección de ejercicios para hacer el reporte
    fpProyPlanif = new Ext.FormPanel({
        id: 'fpProyPlanif',
        frame: false,
        layout: 'fit',
        region: 'south',
        height: 300,
        border: false,
        rezisable: false,
        labelAlign: 'top',
        bodyStyle: 'padding:5px 5px 5px 5px',
        items: [fscamposProyPlanif]
    });

    //ventana que contiene panel para mostrar formulario de selección de datos para hacer el reporte
    winProyPlanif = new Ext.Window({
        id: 'winProyPlanif',
        title: "Proyección de la planificación",
        constrain: true,
        width: 685,
        height: 560,
        draggable: true,
        resizable: false,
        modal: true,
        layout: 'border',
        closeAction: 'destroy',
        items: [fpgeneralProyPlanif, fpProyPlanif],
        buttons: [
            new Ext.Button({
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar datos',
                iconCls: 'cancelar',
                handler: function () {
                    winProyPlanif.destroy();
                }
            }),
            new Ext.Button({
                text: 'Calcular',
                tooltip: 'Calcular importe total',
                id: 'CalcularIF',
                iconCls: 'calcular',
                disabled: true,
                handler: function () {
                    if (stcbOrgDemand.data.length != 0) {
                        importebaseG = 0;
                        importebaseV = 0;
                        if (cbOrgDemand.getValue() != '' && cbOrgDemand.getValue() != null && cbOrgDemand.getValue() != undefined) {
                            identidades = cbOrgDemand.getValue();
                            caso = 1;
                        } else {
                            identidades = Ext.encode(stcbOrgDemand.data.keys);
                            caso = 2;
                        }

                        if (CmbPlanesPP.getCheckedValue() != '' && CmbPlanesPP.getCheckedValue() != null && CmbPlanesPP.getCheckedValue() != undefined) {
                            planes = CmbPlanesPP.getCheckedValue();
                            casop = 1;
                        } else {
                            planes = Ext.encode(stCmbPlanesPP.data.keys);
                            casop = 2;
                        }
                        Ext.Ajax.request({
                            url: 'calcularImporteTotal',
                            params: {
                                identidades: identidades,
                                caso: caso,
                                casop: casop,
                                planes: planes,
                                idejercicio: cbEjercicioAnno1.getValue(),
                                componente: cmbComponentes.getValue()

                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                Ext.getCmp('importeG').setValue(responseData.importeformato[0]);
                                Ext.getCmp('importeV').setValue(responseData.importeformato[1]);
                                importebaseG = responseData.importe[0].importegasto;
                                importebaseV = responseData.importe[0].importeingreso;
                                Ext.getCmp('Generar').enable();
                            }

                        });
                    } else {
                        mostrarMensaje(1, 'No existen órganos demandantes en el dominio de la entidad logueada.');
                        winProyPlanif.destroy();
                    }

                }
            }), new Ext.Button({
                text: 'Generar',
                id: 'Generar',
                disabled: true,
                tooltip: 'Generar importe según porciento',
                iconCls: 'calcular',
                handler: function () {
                    Ext.Ajax.request({
                        url: 'calcularImporteCalculado',
                        params: {
                            importebaseG: importebaseG,
                            importebaseV: importebaseV,
                            porciento1: Ext.getCmp('porciento1').getValue(),
                            porciento2: Ext.getCmp('porciento2').getValue(),
                            porciento3: Ext.getCmp('porciento3').getValue(),
                            porciento4: Ext.getCmp('porciento4').getValue(),
                            porciento5: Ext.getCmp('porciento5').getValue(),
                            porcientoEntreAnnos: Ext.getCmp('chPorcientoEntreAnnos').getValue(),
                            porcientoEA: Ext.getCmp('porcientoEntreAnnos').getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.getCmp('importecalculadoG1').setValue(responseData.data[0]);
                            Ext.getCmp('importecalculadoG2').setValue(responseData.data[1]);
                            Ext.getCmp('importecalculadoG3').setValue(responseData.data[2]);
                            Ext.getCmp('importecalculadoG4').setValue(responseData.data[3]);
                            Ext.getCmp('importecalculadoG5').setValue(responseData.data[4]);

                            Ext.getCmp('importecalculadoV1').setValue(responseData.data[5]);
                            Ext.getCmp('importecalculadoV2').setValue(responseData.data[6]);
                            Ext.getCmp('importecalculadoV3').setValue(responseData.data[7]);
                            Ext.getCmp('importecalculadoV4').setValue(responseData.data[8]);
                            //Ext.getCmp('importecalculadoV5').setValue(responseData.data[9]);
                            Ext.getCmp('exportar').enable();
                            Ext.getCmp('exportarq').enable();
                        }

                    });
                }
            }),
            new Ext.Button({
                text: 'Anual',
                tooltip: 'Exportar datos anuales',
                iconCls: 'exportar',
                id: 'exportar',
                disabled: true,
                handler: function () {
                    anualQuinquenal = 2;
                    mostrarReportes();
                }
            })
                    ,
            new Ext.Button({
                text: 'Quinquenal',
                tooltip: 'Exportar datos quinquenales',
                iconCls: 'exportar',
                id: 'exportarq',
                disabled: true,
                handler: function () {
                    anualQuinquenal = 3;
                    mostrarReportes();
                }
            })
        ]
    });

    winProyPlanif.show();


}
