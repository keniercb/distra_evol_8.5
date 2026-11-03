var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('controldemanda', cargaretiquetas);
var etiqueta = new Object(), controlcb = false, cargarPlanAprobado_recurso = true, addControlDemanda_recurso = true, delControlDemanda_recurso = true, guardarControlDemanda_recurso = true;
var aprobarControlDemanda_recurso = true, desaprobarControlDemanda_recurso = true, aprobarEjecucion_recurso = true, desaprobarEjecucion_recurso = true;
var offset = 0, offsetIndicadoresAdd = 0, etiquetacbEntidad = '';
function cargaretiquetas() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'controlcb') {
                controlcb = true;
            }
            if (acciones_reportes[i].abreviatura == 'cargarplan') {
                cargarPlanAprobado_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'adicionarcontrol') {
                addControlDemanda_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'eliminarcontrol') {
                delControlDemanda_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'guardarcontrol') {
                guardarControlDemanda_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'aprobarcontrol') {
                aprobarControlDemanda_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'desaprobarcontrol') {
                desaprobarControlDemanda_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'aprobarejecucion') {
                aprobarEjecucion_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'desaprobarejecucion') {
                desaprobarEjecucion_recurso = false;
            }

        }
        initEtiquetas();
    });
}
function cargarInterfaz() {
    if (controlcb) {
        etiquetacbEntidad = etiqueta.lbCB;
    } else
        etiquetacbEntidad = etiqueta.lbOD;
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiqueta.lbCargando
    });
    /*-------------------unidades de medida-----------------------*/
    stUnidadesMedida = new Ext.data.Store({
        url: 'listarunidadesmedida',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                mymask.show();
            },
            load: function () {
                mymask.hide();
                stVias.reload();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idunidadmedida'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'abreviaturaunidadmedida'
            }])
    });
    /*-------------------Vias-----------------------*/
    stVias = new Ext.data.Store({
        url: 'listarViaAdquisicion',
        listeners: {
            beforeload: function () {
                mymask.show();
                stVias.baseParams.combo = true;
            },
            load: function (t, n, e) {
                mymask.hide();
                cbVias.setValue('Todas');
                stcbEjercicios.reload();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idviaadquisicion'
        }, [{
                name: 'idviaadquisicion'
            }, {
                name: 'denominacion'
            }, {
                name: 'uriviaadquisicion'
            }])
    });
    cbVias = new Ext.ux.form.LovCombo({
        id: 'cbVias',
        store: stVias,
        valueField: 'denominacion',
        hiddenName: 'idviaadquisicion',
        displayField: 'denominacion',
        mode: 'local',
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        checkField: 'checked',
        width: 220,
        listeners: {
            select: function (cb, rec, index) {
                if (cbEntidad.getValue() != undefined && cbEntidad.getValue() != null &&
                        cbEjercicios.getValue() != undefined && cbEjercicios.getValue() != null &&
                        ((cbMes.getValue() != undefined && cbMes.getValue() != null) || chkAcumulados.getValue() == true)) {
                    stGpControlDemanda.reload();
                }
            }
        }
    });
    cbVias.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbVias.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    /*-------------------ejercicios-----------------------*/
    stcbEjercicios = new Ext.data.Store({
        url: 'listarEjercicios',
        listeners: {
            beforeload: function () {
                mymask.show();
            },
            load: function (t, n, e) {
                mymask.hide();
                if (t.reader.jsonData.idejercicioejecucion.idejercicio != undefined) {
                    cbEjercicios.setValue(t.reader.jsonData.idejercicioejecucion.idejercicio);
                    stcbEntidad.reload();
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
    cbEjercicios = new Ext.form.ComboBox({
        id: 'cbEjercicios',
        store: stcbEjercicios,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        width: 150,
        listeners: {
            select: function () {
                if (cbEntidad.getValue() != undefined && cbEntidad.getValue() != null &&
                        cbVias.getValue() != undefined && cbVias.getValue() != null &&
                        ((cbMes.getValue() != undefined && cbMes.getValue() != null) || chkAcumulados.getValue() == true)) {
                    stGpControlDemanda.reload();
                }
            }
        }
    });
    /*-------------------cb-----------------------*/
    stcbEntidad = new Ext.data.Store({
        url: 'listarEntidadesDominio',
        listeners: {
            beforeload: function () {
                mymask.show();
                stcbEntidad.baseParams.configuracion = controlcb;
            },
            load: function () {
                mymask.hide();
                if (stcbEntidad.data.items[0].id != undefined) {
                    cbEntidad.setValue(stcbEntidad.data.items[0].id);
                    stcbMes.reload();
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'identidad'
        }, [{
                name: 'identidaddatosnomenclador'
            }, {
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });
    cbEntidad = new Ext.form.ComboBox({
        id: 'cbEntidad',
        store: stcbEntidad,
        valueField: 'identidad',
        hiddenName: 'identidad',
        displayField: 'denominacion',
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        emptyText: etiqueta.lbSeleccione,
        loadingText: etiqueta.lbCargando,
        width: 240,
        listeners: {
            select: function () {
                if (cbEjercicios.getValue() != undefined && cbEjercicios.getValue() != null &&
                        cbVias.getValue() != undefined && cbVias.getValue() != null &&
                        ((cbMes.getValue() != undefined && cbMes.getValue() != null) || chkAcumulados.getValue() == true)) {
                    stGpControlDemanda.reload();
                }
            }
        }
    });
    /*-------------------cantidades-----------------------*/
    stCantidades = new Ext.data.SimpleStore({
        fields: [{
                name: 'idtipocant'
            }, {
                name: 'denominacion'
            }],
        data: [[1, etiqueta.lbTodos], [2, etiqueta.lbPendientesCont],
            [3, etiqueta.lbContratados], [4, etiqueta.lbPendientesEjec],
            [5, etiqueta.lbCumplimentados]]
    });
    cbCantidades = new Ext.form.ComboBox({
        id: 'cbCantidades',
        store: stCantidades,
        valueField: 'idtipocant',
        hiddenName: 'idtipocant',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        editable: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: etiqueta.lbSeleccione,
        width: 150,
        listeners: {
            select: function () {
                if (cbEntidad.getValue() != undefined && cbEntidad.getValue() != null &&
                        cbVias.getValue() != undefined && cbVias.getValue() != null &&
                        cbEjercicios.getValue() != undefined && cbEjercicios.getValue() != null
                        && chkAcumulados.getValue() == true) {
                    stGpControlDemanda.reload();
                }
            }
        }
    });
    /*-------------------valores-----------------------*/
    stValores = new Ext.data.SimpleStore({
        fields: [{
                name: 'idtipoval'
            }, {
                name: 'denominacion'
            }],
        data: [[1, etiqueta.lbTodos], [2, etiqueta.lbPendientesCont],
            [3, etiqueta.lbContratados], [4, etiqueta.lbPendientesEjec],
            [5, etiqueta.lbCumplimentados]]
    });
    cbValores = new Ext.form.ComboBox({
        id: 'cbValores',
        store: stValores,
        valueField: 'idtipoval',
        hiddenName: 'idtipoval',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        editable: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: etiqueta.lbSeleccione,
        width: 150,
        listeners: {
            select: function () {
                if (cbEntidad.getValue() != undefined && cbEntidad.getValue() != null &&
                        cbVias.getValue() != undefined && cbVias.getValue() != null &&
                        cbEjercicios.getValue() != undefined && cbEjercicios.getValue() != null
                        && chkAcumulados.getValue() == true) {
                    stGpControlDemanda.reload();
                }
            }
        }
    });
    /*-------------------meses-----------------------*/
    stcbMes = new Ext.data.Store({
        url: 'listarMeses',
        listeners: {
            beforeload: function () {
                mymask.show();
            },
            load: function () {
                mymask.hide();
                if (cbEntidad.getValue() != undefined && cbEntidad.getValue() != null &&
                        cbEjercicios.getValue() != undefined && cbEjercicios.getValue() != null) {
                    chkAcumulados.setValue(true);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cbMes = new Ext.form.ComboBox({
        id: 'cbMes',
        store: stcbMes,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        width: 80,
        listeners: {
            select: function () {
                if (cbEntidad.getValue() != undefined && cbEntidad.getValue() != null &&
                        cbVias.getValue() != undefined && cbVias.getValue() != null &&
                        cbEjercicios.getValue() != undefined && cbEjercicios.getValue() != null) {
                    //Ext.getCmp('exportarEjecucionAcumuladaMes').enable();
                    stGpControlDemanda.reload();
                }
            }
        }
    });
    /*-------------------check acumulados------------*/
    chkAcumulados = new Ext.form.Checkbox({
        boxLabel: etiqueta.lbMostAcumulados,
        id: 'chkAcumulados',
        hidden: false,
        listeners: {
            check: function (ck, t) {
                if (t) {
                    // Ext.getCmp('exportarEjecucionAcumuladaMes').disable();
                    cbCantidades.setValue(1);
                    cbValores.setValue(1);
                    cbCantidades.enable();
                    cbValores.enable();
                    cbMes.disable();
                    cbMes.clearValue();
                    btnAprobarEjecucion.disable();
                    btnDesaprobarEjecucion.disable();
                    //oculto las columnas de los precios
                    cmGpControlDemanda.setHidden(cmGpControlDemanda.findColumnIndex('preciocontratacion'), true);
                    cmGpControlDemanda.setHidden(cmGpControlDemanda.findColumnIndex('precioejecucion'), true);
                    cmGpControlDemanda.setHidden(cmGpControlDemanda.findColumnIndex('idaprobacionejecucion'), true);
                    if (cbEntidad.getValue() != undefined && cbEntidad.getValue() != null &&
                            cbVias.getValue() != undefined && cbVias.getValue() != null &&
                            cbEjercicios.getValue() != undefined && cbEjercicios.getValue() != null) {
                        stGpControlDemanda.reload();
                    }
                } else {
                    cbCantidades.disable();
                    cbCantidades.clearValue();
                    cbValores.disable();
                    cbValores.clearValue();
                    //muestro las columnas de los precios
                    cmGpControlDemanda.setHidden(cmGpControlDemanda.findColumnIndex('preciocontratacion'), false);
                    cmGpControlDemanda.setHidden(cmGpControlDemanda.findColumnIndex('precioejecucion'), false);
                    cmGpControlDemanda.setHidden(cmGpControlDemanda.findColumnIndex('idaprobacionejecucion'), false);
                    cbMes.enable();
                    cbMes.setValue(stcbMes.data.items[0].id);
                    if (cbEntidad.getValue() != undefined && cbEntidad.getValue() != null &&
                            cbVias.getValue() != undefined && cbVias.getValue() != null &&
                            cbEjercicios.getValue() != undefined && cbEjercicios.getValue() != null) {
                        stGpControlDemanda.reload();
                        // Ext.getCmp('exportarEjecucionAcumuladaMes').enable();
                    }
                }

            }
        }
    });
    /*-------------------grid de control de la demanda-----------------------*/
    btnCargarPlanAprobado = new Ext.Button({
        hidden: cargarPlanAprobado_recurso,
        id: 'btnCargarPlanAprobado',
        iconCls: 'actualizar',
        tooltip: etiqueta.lbCargarP,
        handler: function () {
            mostrarMensaje(2, etiqueta.msgSegCargarPlan, cargarPlanAprobado);
        }
    });
    menuExportar = new Ext.Toolbar.MenuButton({
        text: 'Exportar',
        id: 'mnExportar',
        tooltip: {
            text: 'Exportar actividades'
        },
        iconCls: 'exportar',
        menu: {
            items: [{
                    disabled: true,
                    id: 'btnExportarControlDemanda',
                    iconCls: 'exportar',
                    text: etiqueta.lbExportarCD,
                    handler: function () {
                        exportarControlDemanda();
                    }
                }/*, {
                 disabled: true,
                 id: 'exportarEjecucionAcumuladaMes',
                 iconCls: 'exportar',
                 text: etiqueta.lbExportarEjecucionAcumuladaMes,
                 handler: function () {
                 exportarEjecucionAcumuladaMes();
                 }
                 }, {
                 id: 'exportarEjecucionOSDE',
                 iconCls: 'exportar',
                 text: etiqueta.lbExportarEjecucionOSDE,
                 handler: function () {
                 exportarEjecucionOSDE(2);
                 }
                 }, {
                 id: 'exportarEjecucionOS',
                 iconCls: 'exportar',
                 text: etiqueta.lbExportarEjecucionOS,
                 handler: function () {
                 exportarEjecucionOSDE(3);
                 }
                 }, {
                 id: 'exportarEjecucionCBOS',
                 iconCls: 'exportar',
                 text: etiqueta.lbExportarEjecucionCBOS,
                 handler: function () {
                 exportarEjecucionOSDE(4);
                 }
                 }*/]
        }
    });
    btnVerCompImportes = new Ext.Button({
        id: 'btnVerCompImportes',
        iconCls: 'ver',
        tooltip: etiqueta.lbVerCompImportes,
        handler: function () {
            verCompImportes();
        }
    });
    btnAddControlDemanda = new Ext.Button({
        hidden: addControlDemanda_recurso,
        id: 'btnAddControlDemanda',
        iconCls: 'adicionar',
        tooltip: etiqueta.lbAdicionar,
        handler: function () {
            adicionarControlDemanda();
        }
    });
    btnDelControlDemanda = new Ext.Button({
        hidden: delControlDemanda_recurso,
        disabled: true,
        id: 'btnDelControlDemanda',
        iconCls: 'eliminar',
        tooltip: etiqueta.lbEliminar,
        handler: function () {
            eliminarControlDemanda();
        }
    });
    btnGuardarControlDemanda = new Ext.Button({
        disabled: true,
        hidden: guardarControlDemanda_recurso,
        id: 'btnGuardarControlDemanda',
        iconCls: 'guardar',
        tooltip: etiqueta.lbGuardar,
        handler: function () {
            guardarControlDemanda();
        }
    });
    btnAprobarControlDemanda = new Ext.Button({
        disabled: true,
        hidden: aprobarControlDemanda_recurso,
        id: 'btnAprobarControlDemanda',
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobar,
        handler: function () {
            aprobarControlDemanda(4);
        }
    });
    btnDesaprobarControlDemanda = new Ext.Button({
        disabled: true,
        hidden: desaprobarControlDemanda_recurso,
        id: 'btnDesaprobarControlDemanda',
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobar,
        handler: function () {
            aprobarControlDemanda(1);
        }
    });
    btnAprobarEjecucion = new Ext.Button({
        disabled: true,
        hidden: aprobarEjecucion_recurso,
        id: 'btnAprobarEjecucion',
        iconCls: 'aprobar',
        tooltip: etiqueta.lbAprobarEjec,
        handler: function () {
            aprobarEjecucion(4);
        }
    });
    btnDesaprobarEjecucion = new Ext.Button({
        disabled: true,
        hidden: desaprobarEjecucion_recurso,
        id: 'btnDesaprobarEjecucion',
        iconCls: 'desaprobar',
        tooltip: etiqueta.lbDesaprobarEjec,
        handler: function () {
            aprobarEjecucion(1);
        }
    });
    stGpControlDemanda = new Ext.data.Store({
        url: 'listarControlDemanda',
        method: 'POST',
        listeners: {
            beforeload: function (st) {
                cambiarTituloFiltrar(gpControlDemanda, filtrosGpControlDemanda, etiqueta.lbTituloGridPanel);
                //trabajo con las vias
                vias = false;
                viasSelect = cbVias.getCheckedValue().split(',');
                if (cbVias.getCheckedValue().split(',')[0] != '') {
                    vias = viasSelect[0];
                    for (var i = 1; i < viasSelect.length; i++) {
                        vias = vias + ',' + viasSelect[i];
                    }
                }
                st.baseParams.identidad = cbEntidad.getValue();
                st.baseParams.idmes = cbMes.getValue();
                st.baseParams.start = offset;
                st.baseParams.idejercicio = cbEjercicios.getValue();
                st.baseParams.ejercicio = cbEjercicios.getRawValue();
                st.baseParams.cbCant = cbCantidades.getValue();
                st.baseParams.cbVal = cbValores.getValue();
                st.baseParams.cbVA = vias;
            },
            load: function (st) {
                btnGuardarControlDemanda.disable();
                btnAprobarControlDemanda.disable();
                btnDesaprobarControlDemanda.disable();
                btnAprobarEjecucion.disable();
                btnDesaprobarEjecucion.disable();
                btnDelControlDemanda.disable();
                st.commitChanges();
                //actualizar los importes totales
                if (parseFloat(stGpControlDemanda.reader.jsonData.importeAprobado) < parseFloat(stGpControlDemanda.reader.jsonData.importeContratadoTotal))
                    mostrarMensaje(1, etiqueta.msgContSup);
                if (parseFloat(stGpControlDemanda.reader.jsonData.importeAprobado) < parseFloat(stGpControlDemanda.reader.jsonData.importeEjecutadoTotal))
                    mostrarMensaje(1, etiqueta.msgEjecSup);
//                Ext.getCmp('idImporteAprobado').setValue(adicionarSeparadorMiles(stGpControlDemanda.reader.jsonData.importeAprobado));
//                Ext.getCmp('idImporteContratadoTotal').setValue(adicionarSeparadorMiles(stGpControlDemanda.reader.jsonData.importeContratadoTotal));
//                Ext.getCmp('idImporteEjecutadoTotal').setValue(adicionarSeparadorMiles(stGpControlDemanda.reader.jsonData.importeEjecutadoTotal));
                Ext.getCmp('idImporteAprobado').setValue(stGpControlDemanda.reader.jsonData.importeAprobado);
                Ext.getCmp('idImporteContratadoTotal').setValue(stGpControlDemanda.reader.jsonData.importeContratadoTotal);
                Ext.getCmp('idImporteEjecutadoTotal').setValue(stGpControlDemanda.reader.jsonData.importeEjecutadoTotal);
                if (st.getCount() == 0) {
                    Ext.getCmp('btnExportarControlDemanda').disable();
                    if (filtrosGpControlDemanda.getFiltrosActivos().length > 0)
                        mostrarMensaje(1, etiqueta.msgBusquedasSinResultado);
                    else
                        mostrarMensaje(1, etiqueta.msgSinDatos);
                } else {
                    Ext.getCmp('btnExportarControlDemanda').enable();
                    upColorCell();
                }
                smGpControlDemanda.clearSelections();
            }

        },
        reader: new Ext.data.JsonReader({
            id: 'idcontroldemanda',
            root: 'data',
            totalProperty: 'total',
            importeAprobado: 'importeAprobado',
            importeContratadoTotal: 'importeContratadoTotal',
            importeEjecutadoTotal: 'importeEjecutadoTotal'
        }, [{
                name: 'idcontroldemanda'
            }, {
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idunidadmedida'
            }, {
                name: 'viasadquisicion'
            }, {
                name: 'organossatisface'
            }, {
                name: 'demanda'
            }, {
                name: 'precio'
            }, {
                name: 'importe'
            }, {
                name: 'puntualizacion'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'adicionado'
            }, {
                name: 'idcontroldemandafecha'
            }, {
                name: 'cantidadcontratada'
            }, {
                name: 'preciocontratacion'
            }, {
                name: 'importecontratacion'
            }, {
                name: 'cantidadejecutada'
            }, {
                name: 'precioejecucion'
            }, {
                name: 'importeejecucion'
            }, {
                name: 'idaprobacionejecucion'
            }
        ])

    });
    smGpControlDemanda = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        id: 'smGpControlDemanda'
    });
    cmGpControlDemanda = new Ext.grid.ColumnModel([
        {
            header: etiqueta.lbCodigo,
            width: 80,
            dataIndex: 'codigo',
            tooltip: etiqueta.lbCodigoInd,
            sortable: true,
            renderer: toolTip
        }, {
            header: etiqueta.lbDenominacion,
            id: 'expandir',
            dataIndex: 'denominacion',
            tooltip: etiqueta.lbDenominacionInd,
            renderer: toolTip
        }, {
            header: etiqueta.lbUm,
            width: 80,
            sortable: true,
            dataIndex: 'idunidadmedida',
            tooltip: etiqueta.lbUmedida,
            renderer: toolTipUM
        }, {
            header: etiqueta.lbVA,
            width: 150,
            hidden: true,
            sortable: true,
            dataIndex: 'viasadquisicion',
            tooltip: etiqueta.lbVAInd,
            renderer: toolTip
        }, {
            header: etiqueta.lbOS,
            width: 100,
            hidden: true,
            sortable: true,
            dataIndex: 'organossatisface',
            tooltip: etiqueta.lbOSInd,
            renderer: toolTip
        }, {
            header: etiqueta.lbDemanda,
            align: 'right',
            width: 90,
            sortable: true,
            dataIndex: 'demanda',
            tooltip: etiqueta.lbDemandaInd,
            renderer: tooltipNumerico,
            editor: new Ext.form.NumberField({
                name: 'demanda',
                allowBlank: false,
                decimalPrecision: 3,
                minValue: 0,
                listeners: {
                    focus: function (f) {
                        f.selectText();
                    }
                }
            })
        }, {
            header: etiqueta.lbPrecio,
            align: 'right',
            width: 90,
            sortable: true,
            dataIndex: 'precio',
            tooltip: etiqueta.lbPrecioInd,
            renderer: tooltipNumerico,
            editor: new Ext.form.NumberField({
                name: 'precio',
                allowBlank: false,
                decimalPrecision: 3,
                minValue: 0,
                listeners: {
                    focus: function (f) {
                        f.selectText();
                    }
                }
            })
        }, {
            header: etiqueta.lbImporte,
            align: 'right',
            width: 90,
            sortable: true,
            dataIndex: 'importe',
            tooltip: etiqueta.lbImporteInd,
            renderer: tooltipNumerico
        }, {
            header: etiqueta.lbAdicion,
            align: 'center',
            width: 60,
            sortable: true,
            dataIndex: 'adicionado',
            tooltip: etiqueta.lbAdicion,
            renderer: toolTipBoolean
        }, {
            header: etiqueta.lbPuntualizacion,
            align: 'center',
            width: 60,
            sortable: true,
            dataIndex: 'puntualizacion',
            tooltip: etiqueta.lbPuntualizacion,
            renderer: toolTipBoolean
        }, {
            header: etiqueta.lbAprobacion,
            align: 'center',
            width: 60,
            sortable: true,
            dataIndex: 'idaprobacion',
            tooltip: etiqueta.lbAprobacion,
            renderer: toolTipAprobacion
        }, {
            header: etiqueta.lbCantidadContratada,
            align: 'right',
            width: 90,
            sortable: true,
            dataIndex: 'cantidadcontratada',
            tooltip: etiqueta.lbCantidadContratada,
            renderer: tooltipNumerico,
            editor: new Ext.form.NumberField({
                name: 'cantidadcontratada',
                allowBlank: false,
                decimalPrecision: 3,
                minValue: 0,
                listeners: {
                    focus: function (f) {
                        f.selectText();
                    }
                }
            })
        }, {
            header: etiqueta.lbPrecioContratacion,
            align: 'right',
            hidden: true,
            width: 90,
            sortable: true,
            dataIndex: 'preciocontratacion',
            tooltip: etiqueta.lbPrecioContratacion,
            renderer: toolTipPrecio,
            editor: new Ext.form.NumberField({
                name: 'preciocontratacion',
                allowBlank: false,
                decimalPrecision: 3,
                minValue: 0,
                listeners: {
                    focus: function (f) {
                        f.selectText();
                    }
                }
            })
        }, {
            header: etiqueta.lbImporteContratacion,
            align: 'right',
            width: 90,
            sortable: true,
            dataIndex: 'importecontratacion',
            tooltip: etiqueta.lbImporteContratacion,
            renderer: tooltipNumerico
        }, {
            header: etiqueta.lbCantidadEjecutada,
            align: 'right',
            width: 90,
            sortable: true,
            dataIndex: 'cantidadejecutada',
            tooltip: etiqueta.lbCantidadEjecutada,
            renderer: tooltipNumerico,
            editor: new Ext.form.NumberField({
                name: 'cantidadejecutada',
                allowBlank: false,
                decimalPrecision: 3,
                minValue: 0,
                listeners: {
                    focus: function (f) {
                        f.selectText();
                    }
                }
            })
        }, {
            header: etiqueta.lbPrecioEjecutada,
            align: 'right',
            hidden: true,
            width: 90,
            sortable: true,
            dataIndex: 'precioejecucion',
            tooltip: etiqueta.lbPrecioEjecutada,
            renderer: toolTipPrecio,
            editor: new Ext.form.NumberField({
                name: 'precioejecucion',
                allowBlank: false,
                decimalPrecision: 3,
                minValue: 0,
                listeners: {
                    focus: function (f) {
                        f.selectText();
                    }
                }
            })
        }, {
            header: etiqueta.lbImporteEjecutada,
            align: 'right',
            width: 90,
            sortable: true,
            dataIndex: 'importeejecucion',
            tooltip: etiqueta.lbImporteEjecutada,
            renderer: tooltipNumerico
        }, {
            header: etiqueta.lbAprobacionEjecucion,
            align: 'center',
            width: 60,
            sortable: true,
            dataIndex: 'idaprobacionejecucion',
            tooltip: etiqueta.lbAprobacionEjecucion,
            renderer: toolTipAprobacionEjecucion
        }
    ]);
    filtrosGpControlDemanda = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
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
                type: 'listado',
                dataIndex: 'idunidadmedida',
                idcombo: 'idcbunidadmedida',
                urlcb: 'listarunidadesmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida',
                idstore: 'idtodasunidadesmedida'
            }, {
                type: 'numeric',
                dataIndex: 'demanda'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'list',
                dataIndex: 'adicionado',
                options: [etiqueta.lbSi, etiqueta.lbNo]
            }, {
                type: 'list',
                dataIndex: 'puntualizacion',
                options: [etiqueta.lbSi, etiqueta.lbNo]
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [etiqueta.lbSi, etiqueta.lbNo]
            }, {
                type: 'numeric',
                dataIndex: 'cantidadcontratada'
            }, {
                type: 'numeric',
                dataIndex: 'preciocontratacion'
            }, {
                type: 'numeric',
                dataIndex: 'importecontratacion'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadejecutada'
            }, {
                type: 'numeric',
                dataIndex: 'precioejecucion'
            }, {
                type: 'numeric',
                dataIndex: 'importeejecucion'
            }, {
                type: 'list',
                dataIndex: 'idaprobacionejecucion',
                options: [etiqueta.lbSi, etiqueta.lbNo]
            }, {
                type: 'listado',
                dataIndex: 'organossatisface',
                idcombo: 'idcborganos',
                urlcb: 'listarOrganoSatisface',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                idstore: 'idtodosorganos',
                multiple: 1
            }]
    });
    btnLimpiarControlDemanda = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarControlDemanda',
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiarFiltros,
        handler: function () {
            filtrosGpControlDemanda.clearFilters();
        }
    });
    gpControlDemanda = new Ext.grid.EditorGridPanel({
        id: 'gpControlDemanda',
        autoExpandColumn: 'expandir',
        store: stGpControlDemanda,
        plugins: filtrosGpControlDemanda,
        title: etiqueta.lbTituloGridPanel,
        sm: smGpControlDemanda,
        cm: cmGpControlDemanda, tbar: [chkAcumulados, '-',
            {xtype: 'tbtext', text: etiqueta.lbCantidades}, '-', cbCantidades, '-',
            {xtype: 'tbtext', text: etiqueta.lbValores}, '-', cbValores, '-',
            {xtype: 'tbtext', text: etiqueta.lbMes}, cbMes, '-',
            btnAddControlDemanda, btnGuardarControlDemanda,
            btnDelControlDemanda, btnAprobarControlDemanda,
            btnDesaprobarControlDemanda, '-', btnAprobarEjecucion,
            btnDesaprobarEjecucion, '-', menuExportar/*, '-', btnVerCompImportes*/
        ],
        listeners: {
            beforeedit: function (e) {
                if (btnGuardarControlDemanda.hidden)
                    e.cancel = true;
            },
            afteredit: function (e) {
                if (btnGuardarControlDemanda.disabled) {
                    if (parseFloat(e.originalValue) != parseFloat(e.value)) {
                        btnGuardarControlDemanda.enable();
                    }
                }
            },
            click: function (e) {
                var seleccAprob = 0;
                var seleccDesaprob = 0;
                var seleccAddDesap = 0;
                var seleccEjecDesaprob = 0;
                var seleccEjecAprob = 0;
                var selecc = smGpControlDemanda.getSelections();
                if (selecc.length > 0) {
                    while (selecc.length > 0) {
                        var record = selecc.pop();
                        if (record.data['idaprobacion'] == 1)
                            seleccDesaprob++;
                        else
                            seleccAprob++;
                        if (record.data['idaprobacionejecucion'] == 1 && record.data['idcontroldemandafecha'] != null)
                            seleccEjecDesaprob++;
                        else
                        if (record.data['idcontroldemandafecha'] != null)
                            seleccEjecAprob++;

                        if (record.data['adicionado'] == 1 && record.data['idaprobacion'] == 1 && record.data['idaprobacionejecucion'] == 1)
                            seleccAddDesap++;
                    }
                }
                if (seleccDesaprob > 0)
                    btnAprobarControlDemanda.enable();
                else
                    btnAprobarControlDemanda.disable();
                if (seleccAprob > 0)
                    btnDesaprobarControlDemanda.enable();
                else
                    btnDesaprobarControlDemanda.disable();
                if (seleccAddDesap > 0)
                    btnDelControlDemanda.enable();
                else
                    btnDelControlDemanda.disable();
                if (chkAcumulados.getValue() == true) {
                    btnAprobarEjecucion.disable();
                    btnDesaprobarEjecucion.disable();
                } else {
                    if (seleccEjecDesaprob > 0)
                        btnAprobarEjecucion.enable();
                    else
                        btnAprobarEjecucion.disable();
                    if (seleccEjecAprob > 0)
                        btnDesaprobarEjecucion.enable();
                    else
                        btnDesaprobarEjecucion.disable();
                }
                if (btnGuardarControlDemanda.hidden || smGpControlDemanda.getSelected() == undefined) {
                    cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('demanda'), false);
                    cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('precio'), false);
                    cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('cantidadcontratada'), false);
                    cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('preciocontratacion'), false);
                    cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('cantidadejecutada'), false);
                    cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('precioejecucion'), false);
                } else {
                    if (smGpControlDemanda.getSelected() != undefined) {
                        if (smGpControlDemanda.getSelected().data.idaprobacion != 4) {
                            cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('demanda'), true);
                            cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('precio'), true);

                            cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('cantidadcontratada'), false);
                            cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('preciocontratacion'), false);
                            cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('cantidadejecutada'), false);
                            cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('precioejecucion'), false);
                        } else {
                            cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('demanda'), false);
                            cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('precio'), false);
                            if (smGpControlDemanda.getSelected().data.idaprobacionejecucion != 4 && chkAcumulados.getValue() == false) {
                                cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('cantidadcontratada'), true);
                                cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('preciocontratacion'), true);
                                cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('cantidadejecutada'), true);
                                cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('precioejecucion'), true);
                            } else {
                                cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('cantidadcontratada'), false);
                                cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('preciocontratacion'), false);
                                cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('cantidadejecutada'), false);
                                cmGpControlDemanda.setEditable(cmGpControlDemanda.findColumnIndex('precioejecucion'), false);
                            }
                        }
                    }
                }
            }
        },
        loadMask: {
            msg: etiqueta.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            id: 'pagControlDemanda',
            store: stGpControlDemanda,
            displayInfo: true,
            items: ['-', btnLimpiarControlDemanda, '-',
                {
                    xtype: 'tbtext',
                    text: etiqueta.lbImporteAprobado
                }, {
//                    xtype: 'textfield',
                    xtype: 'numberfield',
                    id: 'idImporteAprobado',
                    emptyText: etiqueta.lbImpDefecto,
                    width: 120,
                    renderer: tooltipNumerico,
                    editable: false
                }, '-', {
                    xtype: 'tbtext',
                    text: etiqueta.lbImporteContratadoTotal
                }, {
//                    xtype: 'textfield',
                    xtype: 'numberfield',
                    id: 'idImporteContratadoTotal',
                    emptyText: etiqueta.lbImpDefecto,
                    width: 120,
                    renderer: tooltipNumerico,
                    editable: false
                }, '-', {
                    xtype: 'tbtext',
                    text: etiqueta.lbImporteEjecutadoTotal
                }, {
//                    xtype: 'textfield',
                    xtype: 'numberfield',
                    id: 'idImporteEjecutadoTotal',
                    emptyText: etiqueta.lbImpDefecto,
                    width: 120,
                    renderer: tooltipNumerico,
                    editable: false
                }],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        })
    });
    /*---------------------panel general------------------*/
    pControlDemanda = new Ext.Panel({
        id: 'pControlDemanda',
        tbar: [btnCargarPlanAprobado, '-',
            {xtype: 'tbtext', text: etiqueta.lbEjercicio}, cbEjercicios, '-',
            {xtype: 'tbtext', text: etiquetacbEntidad}, '-', cbEntidad, '-',
            {xtype: 'tbtext', text: etiqueta.lbVias}, cbVias],
        layout: 'fit',
        items: [gpControlDemanda]
    });
    viewControlDemanda = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'fit',
            items: [pControlDemanda]

        })
    });
}
/*--------------------funcionalidades-----------------*/

cargarPlanAprobado = function (btnPresionado) {
    if (btnPresionado == 'ok') {
        idcentros = [];
        if (controlcb) {
            for (var i = 0; i < stcbEntidad.data.items.length; i++) {
                idcentros[i] = stcbEntidad.data.items[i].data.identidaddatosnomenclador;
            }
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'cargarPlanAprobado',
            params: {
                idejercicio: cbEjercicios.getValue(),
                identidades: Ext.encode(stcbEntidad.data.keys),
                idcentrosbalance: Ext.encode(idcentros),
                configuracion: controlcb
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, etiqueta.msgCargarPlanOk);
                } else {
                    mostrarMensaje(1, etiqueta.msgCargarPlanNo);
                }
                mymask.hide();
                stGpControlDemanda.reload();
            }
        });
    }
};
exportarControlDemanda = function () {
    var win = window.open('exportar?identidad=' + cbEntidad.getValue()
            + '&denomentidad=' + cbEntidad.getRawValue()
            + '&idmes=' + cbMes.getValue()
            + '&idejercicio=' + cbEjercicios.getValue()
            + '&ejercicio=' + cbEjercicios.getRawValue()
            + '&idmes=' + cbMes.getValue()
            + '&denommes=' + cbMes.getRawValue()
            + '&cbCant=' + cbCantidades.getValue()
            + '&cbVal=' + cbValores.getValue()
            + '&cbVA=' + cbVias.getValue()
            + '&configuracion=' + controlcb
            + '&filtros=' + Ext.encode(filtrosGpControlDemanda.getFilterData()));
    mascaraExportar(etiqueta.lbExportandoDem, etiqueta.lbCargando, win);
};
adicionarControlDemanda = function () {
    stGpIndicadoresAdd = new Ext.data.Store({
        url: 'listarIndicadoresAdd',
        method: 'POST',
        listeners: {
            beforeload: function (st) {
                cambiarTituloFiltrar(gpIndicadoresAdd, filtrosGpIndicadoresAdd, etiqueta.lbIndAdd);
                st.baseParams.idejercicio = cbEjercicios.getValue();
                st.baseParams.identidad = cbEntidad.getValue();
                st.baseParams.start = offsetIndicadoresAdd;
                st.baseParams.configuracion = controlcb;
            },
            load: function (st) {
                if (st.getCount() == 0) {
                    if (filtrosGpIndicadoresAdd.getFiltrosActivos().length > 0)
                        mostrarMensaje(1, etiqueta.msgBusquedasSinResultado);
                    else
                        mostrarMensaje(1, etiqueta.msgSinDatos);
                }
            }

        },
        reader: new Ext.data.JsonReader({
            id: 'idindicador',
            root: 'data',
            totalProperty: 'total'
        }, [, {
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idunidadmedida'
            }, {
                name: 'precio'
            }
        ])

    });
    smGpIndicadoresAdd = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        id: 'smGpIndicadoresAdd',
        listeners: {
            selectionchange: function () {
                if (gpIndicadoresAdd.getSelectionModel().getSelected() != null) {
                    Ext.getCmp('idbtnAceptarAddInd').enable();
                } else {
                    Ext.getCmp('idbtnAceptarAddInd').disable();
                }

            }
        }
    });
    cmGpIndicadoresAdd = new Ext.grid.ColumnModel([
        smGpIndicadoresAdd,
        {
            header: etiqueta.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            tooltip: etiqueta.lbCodigoInd,
            sortable: true,
            renderer: toolTip
        }, {
            header: etiqueta.lbDenominacion,
            id: 'expandir',
            dataIndex: 'denominacion',
            tooltip: etiqueta.lbDenominacionInd,
            renderer: toolTip
        }, {
            header: etiqueta.lbUm,
            width: 100,
            sortable: true,
            dataIndex: 'idunidadmedida',
            tooltip: etiqueta.lbUmedida,
            renderer: toolTipUM
        }, {
            header: etiqueta.lbPrecio,
            align: 'right',
            width: 100,
            sortable: true,
            dataIndex: 'precio',
            tooltip: etiqueta.lbPrecioInd,
            renderer: toolTip
        }
    ]);
    filtrosGpIndicadoresAdd = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idunidadmedida',
                idcombo: 'idcbunidadmedida',
                urlcb: 'listarunidadesmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida',
                idstore: 'idtodasunidadesmedida'
            },
            {
                type: 'numeric',
                dataIndex: 'precio'
            }]
    });
    btnLimpiarIndicadoresAdd = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarIndicadoresAdd',
        iconCls: 'limpiar',
        tooltip: etiqueta.lbLimpiarFiltros,
        handler: function () {
            filtrosGpIndicadoresAdd.clearFilters();
        }
    });
    gpIndicadoresAdd = new Ext.grid.GridPanel({
        id: 'gpIndicadoresAdd',
        title: etiqueta.lbIndAdd,
        store: stGpIndicadoresAdd,
        plugins: filtrosGpIndicadoresAdd,
        cm: cmGpIndicadoresAdd,
        sm: smGpIndicadoresAdd,
        autoExpandColumn: 'expandir',
        loadMask: {
            msg: etiqueta.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            id: 'pagIndicadoresAdd',
            store: stGpIndicadoresAdd,
            displayInfo: true,
            items: ['-', btnLimpiarIndicadoresAdd],
            listeners: {
                beforechange: function (p, e) {
                    offsetIndicadoresAdd = e.start;
                }
            }
        })
    });
    winIndicadoresAdd = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        width: 950,
        height: 500,
        layout: 'fit',
        items: gpIndicadoresAdd,
        listeners: {
            show: function () {
                filtrosGpIndicadoresAdd.clearFilters();
            }
        },
        buttons: [{
                iconCls: 'cancelar',
                tooltip: etiqueta.lbCerrarSinGuardar,
                text: etiqueta.lbCancelar,
                handler: function () {
                    winIndicadoresAdd.hide();
                    smGpIndicadoresAdd.clearSelections();
                    cmGpIndicadoresAdd.setColumnHeader(0, '');
                    cmGpIndicadoresAdd.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');

                }
            }, {
                disabled: true,
                id: 'idbtnAceptarAddInd',
                iconCls: 'aceptar',
                tooltip: etiqueta.lbGuardarCerrar,
                text: etiqueta.lbAceptar,
                handler: function () {
                    adicionarIndicadores();
                    winIndicadoresAdd.hide();
                    smGpIndicadoresAdd.clearSelections();
                    cmGpIndicadoresAdd.setColumnHeader(0, '');
                    cmGpIndicadoresAdd.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }]
    });
    winIndicadoresAdd.show();
};
adicionarIndicadores = function () {
    mymask.show();
    var datosAdicionar = [];
    var cont = 0;
    var seleccionados = smGpIndicadoresAdd.getSelections();
    while (seleccionados.length > 0) {
        var record = seleccionados.pop();
        var rec = Object();
        rec ['idindicador'] = record.data['idindicador'];
        rec ['precio'] = record.data['precio'];
        rec ['idunidadmedida'] = record.data['idunidadmedida'];
        rec ['viasadquisicion'] = record.data['viasadquisicion'];
        rec ['organossatisface'] = record.data['organossatisface'];
        datosAdicionar.push(rec);
        cont++;
    }
    Ext.Ajax.request({
        url: 'adicionarControlDemanda',
        params: {
            tuplasaguardar: Ext.encode(datosAdicionar),
            identidad: cbEntidad.getValue(),
            idejercicio: cbEjercicios.getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                if (cont == 1)
                    mostrarMensaje(1, etiqueta.msgControlAdicionar);
                else
                    mostrarMensaje(1, etiqueta.msgControlesAdicionar);
            } else {
                if (cont == 1)
                    mostrarMensaje(1, etiqueta.msgControlNoAdicionar);
                else
                    mostrarMensaje(1, etiqueta.msgControlesNoAdicionar);
            }
            mymask.hide();
            stGpControlDemanda.reload();
        }

    });
};
guardarControlDemanda = function () {
    mymask.show();
    var datosGuardar = [];
    var editados = [];
    var cont = 0;
    editados = stGpControlDemanda.getModifiedRecords();
    while (editados.length > 0) {
        var record = editados.pop();
        var rec = record.getChanges();
        rec['idcontroldemanda'] = record.data['idcontroldemanda'];
        rec['idcontroldemandafecha'] = record.data['idcontroldemandafecha'];
        rec['precioc'] = record.data['preciocontratacion'];
        rec['precioe'] = record.data['precioejecucion'];
        datosGuardar.push(rec);
        cont++;
    }
    Ext.Ajax.request({
        url: 'guardarControlDemanda',
        params: {
            tuplasaguardar: Ext.encode(datosGuardar),
            idmes: cbMes.getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                if (cont == 1)
                    mostrarMensaje(1, etiqueta.msgControlGuard);
                else
                    mostrarMensaje(1, etiqueta.msgControlesGuard);
            } else {
                if (cont == 1)
                    mostrarMensaje(1, etiqueta.msgControlNoGuard);
                else
                    mostrarMensaje(1, etiqueta.msgControlesNoGuard);
            }
            mymask.hide();
            stGpControlDemanda.reload();
        }

    });
};
eliminarControlDemanda = function () {
    mymask.show();
    var datosEliminar = [];
    var cont = 0;
    var seleccionados = smGpControlDemanda.getSelections();
    while (seleccionados.length > 0) {
        var record = seleccionados.pop();
        if (record.data['adicionado'] == 1 && record.data['idaprobacion'] == 1 && record.data['idaprobacionejecucion'] == 1) {
            datosEliminar.push(record.data['idcontroldemanda']);
            cont++;
        }
    }
    Ext.Ajax.request({
        url: 'eliminarControlDemanda',
        params: {
            tuplasaeliminar: Ext.encode(datosEliminar)
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN > 0) {
                if (cont == 1)
                    mostrarMensaje(1, etiqueta.msgControlEliminar);
                else
                    mostrarMensaje(1, etiqueta.msgControlesEliminar);
            } else {
                if (cont == 1)
                    mostrarMensaje(1, etiqueta.msgControlNoEliminar);
                else
                    mostrarMensaje(1, etiqueta.msgControlesNoEliminar);
            }
            mymask.hide();
            stGpControlDemanda.reload();
        }
    });
};
aprobarControlDemanda = function (idaprobacion) {
    mymask.show();
    var datosAprobar = [];
    var cont = 0;
    var seleccionados = smGpControlDemanda.getSelections();
    while (seleccionados.length > 0) {
        var record = seleccionados.pop();
        datosAprobar.push(record.data['idcontroldemanda']);
        cont++;
    }
    Ext.Ajax.request({
        url: 'aprobarControlDemanda',
        params: {
            tuplasaguardar: Ext.encode(datosAprobar),
            idaprobacion: idaprobacion
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                if (idaprobacion == 1) {
                    if (cont == 1)
                        mostrarMensaje(1, etiqueta.msgControlDesaprobar);
                    else
                        mostrarMensaje(1, etiqueta.msgControlesDesaprobar);
                } else {
                    if (cont == 1)
                        mostrarMensaje(1, etiqueta.msgControlAprobar);
                    else
                        mostrarMensaje(1, etiqueta.msgControlesAprobar);
                }
            } else {
                if (idaprobacion == 1) {
                    if (cont == 1)
                        mostrarMensaje(1, etiqueta.msgControlNoDesaprobar);
                    else
                        mostrarMensaje(1, etiqueta.msgControlesNoDesaprobar);
                } else {
                    if (cont == 1)
                        mostrarMensaje(1, etiqueta.msgControlNoAprobar);
                    else
                        mostrarMensaje(1, etiqueta.msgControlesNoAprobar);
                }
            }
            mymask.hide();
            stGpControlDemanda.reload();
        }

    });
};
aprobarEjecucion = function (idaprobacion) {
    mymask.show();
    var datosAprobar = [];
    var cont = 0;
    var seleccionados = smGpControlDemanda.getSelections();
    while (seleccionados.length > 0) {
        var record = seleccionados.pop();
        if (record.data['idcontroldemandafecha'] != null) {
            datosAprobar.push(record.data['idcontroldemandafecha']);
            cont++;
        }
    }
    Ext.Ajax.request({
        url: 'aprobarEjecucion',
        params: {
            tuplasaguardar: Ext.encode(datosAprobar),
            idaprobacion: idaprobacion
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                if (idaprobacion == 1) {
                    if (cont == 1)
                        mostrarMensaje(1, etiqueta.msgControlDesaprobar);
                    else
                        mostrarMensaje(1, etiqueta.msgControlesDesaprobar);
                } else {
                    if (cont == 1)
                        mostrarMensaje(1, etiqueta.msgControlAprobar);
                    else
                        mostrarMensaje(1, etiqueta.msgControlesAprobar);
                }
            } else {
                if (idaprobacion == 1) {
                    if (cont == 1)
                        mostrarMensaje(1, etiqueta.msgControlNoDesaprobar);
                    else
                        mostrarMensaje(1, etiqueta.msgControlesNoDesaprobar);
                } else {
                    if (cont == 1)
                        mostrarMensaje(1, etiqueta.msgControlNoAprobar);
                    else
                        mostrarMensaje(1, etiqueta.msgControlesNoAprobar);
                }
            }
            mymask.hide();
            stGpControlDemanda.reload();
        }

    });
};

//métodos auxiliares
upColorCell = function () {
    for (var i = 0; i < stGpControlDemanda.getCount(); i++) {
        for (var j = 0; j < cmGpControlDemanda.getColumnCount(); j++) {
            try {
                if (stGpControlDemanda.getAt(i).data.adicionado == 1)
                    Ext.get(gpControlDemanda.getView().getCell(i, j)).applyStyles('background-color:#efffe2');
            } catch (err) {
            }
        }
    }
};
toolTip = function (v, m) {
    if (v != null)
        m.attr = 'ext:qtip="' + v + '"';
    else
        m.attr = 'ext:qtip=""';
    return v;
};
toolTipBoolean = function (v, m) {
    if (v == 0) {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
        return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    } else if (v == 1) {
        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
        return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    }
};
toolTipUM = function (v, m) {
    for (i in stUnidadesMedida.data.items) {
        if (stUnidadesMedida.data.items[i].data.idunidadmedida == v) {
            m.attr = 'ext:qtip="' + stUnidadesMedida.data.items[i].data.abreviaturaunidadmedida + '"';
            return stUnidadesMedida.data.items[i].data.abreviaturaunidadmedida;
        }
    }
};

adicionarSeparadorMiles = function (v) {
    v += '';
    ds = v.replace(/,/g, '');
    v = ds;
    var x = v.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    x3 = x1 + x2;
    return x3;
};
tooltipNumerico = function (v, m) {
    m.attr = 'ext:qtip="' + adicionarSeparadorMiles(v) + '"';
    return adicionarSeparadorMiles(v);
};
toolTipAprobacion = function (v, m) {
    if (v == 1) {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
        return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    } else if (v == 4) {
        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
        return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    }
};
toolTipAprobacionEjecucion = function (v, m) {
    if (v == 1) {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
        return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    } else if (v == 4) {
        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
        return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    } else {
        m.attr = 'ext:qtip="-"';
        return "-";
    }
}
toolTipPrecio = function (v, m) {
    if (v) {
        return tooltipNumerico(v, m);
    } else {
        m.attr = 'ext:qtip="-"';
        return "-";
    }
}
cambiarTituloFiltrar = function (gridPanel, filtro, titulo) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(titulo);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(titulo + " - <i> " + etiqueta.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
};

//reportes por definir y actualizar
verCompImportes = function () {
    var cb = [];
    for (i in stcbEntidad.data.items) {
        if (stcbEntidad.data.items[i].data) {
            var rec = Object();
            rec ['idcb'] = stcbEntidad.data.items[i].data.identidaddatosnomenclador;
            rec ['denominacion'] = stcbEntidad.data.items[i].data.denominacion;
            cb.push(rec);
        }
    }
    var win = window.open('verCompImportes?idcb=' + Ext.encode(cb)
            + '&idejercicio=' + cbEjercicios.getValue()
            + '&cbVA=' + cbVias.getValue()
            + '&cbVADenom=' + cbVias.getRawValue()
            + '&ejercicio=' + cbEjercicios.getRawValue());
    mascaraExportar(etiqueta.lbExportandoDem, etiqueta.lbCargando, win);
};
exportarEjecucionAcumuladaMes = function () {
    var cb = [];
    for (i in stcbEntidad.data.items) {
        if (stcbEntidad.data.items[i].data) {
            var rec = Object();
            rec ['idcb'] = stcbEntidad.data.items[i].data.identidaddatosnomenclador;
            rec ['denominacion'] = stcbEntidad.data.items[i].data.denominacion;
            cb.push(rec);
        }
    }
    var win = window.open('exportarEjecucionAcumuladaMes?idcentros=' + Ext.encode(cb)
            + '&idejercicio=' + cbEjercicios.getValue()
            + '&ejercicio=' + cbEjercicios.getRawValue()
            + '&idmes=' + cbMes.getValue()
            + '&cbVA=' + cbVias.getValue()
            + '&cbVADenom=' + cbVias.getRawValue()
            + '&denommes=' + cbMes.getRawValue());
    mascaraExportar(etiqueta.lbExportandoDem, etiqueta.lbCargando, win);
};
exportarEjecucionOSDE = function (osde) {
    if (osde == 4) {
        var cb = [];
        for (i in stcbEntidad.data.items) {
            if (stcbEntidad.data.items[i].data) {
                var rec = Object();
                rec ['idcb'] = stcbEntidad.data.items[i].data.identidaddatosnomenclador;
                rec ['denominacion'] = stcbEntidad.data.items[i].data.denominacion;
                cb.push(rec);
            }
        }
    }
    var win = window.open('exportarEjecucionOSDE?idejercicio=' + cbEjercicios.getValue()
            + '&ejercicio=' + cbEjercicios.getRawValue()
            + '&idcentros=' + Ext.encode(cb)
            + '&cbVA=' + cbVias.getValue()
            + '&cbVADenom=' + cbVias.getRawValue()
            + '&tipo=' + osde);
    if (osde == 2)
        mascaraExportar(etiqueta.lbExportandoEjecucionOSDE, etiqueta.lbCargando, win);
    else if (osde == 3)
        mascaraExportar(etiqueta.lbExportandoEjecucionOS, etiqueta.lbCargando, win);
    else if (osde == 4)
        mascaraExportar(etiqueta.lbExportandoEjecucionCBOS, etiqueta.lbCargando, win);
};


