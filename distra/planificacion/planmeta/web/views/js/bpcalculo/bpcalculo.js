var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('bpcalculo', cargaretiquetas);
var etiqueta = new Object();
var identidadselected = null, modeloselected = -1, identidadEsOD = 0, is_leaf = false, offset = 0, beforeloadstCalculos = false, importes = [], operacion, limpiar = 0;
var actualizarCalculos_recurso = true, eliminarCalculos_recurso = true, actualizarplan_recurso = true;
function cargaretiquetas() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'actualizarcalculos') {
                actualizarCalculos_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'eliminarcalculos') {
                eliminarCalculos_recurso = false;
            }
            if (acciones_reportes[i].abreviatura == 'actualizarplan') {
                actualizarplan_recurso = false;
            }
        }
        initEtiquetas();
    });
}
function cargaInicial() {
    stCmbNaturaleza = new Ext.data.Store({
        url: 'listarNaturaleza',
        id: 'stCmbNaturaleza',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'naturaleza'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            load: function () {
                stCmbPaises.reload();
            }
        }
    });
    stCmbPaises = new Ext.data.Store({
        url: 'listarPaises',
        id: 'stCmbPaises',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idpais'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            load: function () {
                stCmbViaAdq.reload();
            }
        }
    });
    stCmbViaAdq = new Ext.data.Store({
        url: 'listarViaAdquisicion',
        id: 'stCmbViaAdq',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idviaadquisicion'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            load: function () {
                stCmbOrgSat.reload();
            }
        }
    });
    stCmbOrgSat = new Ext.data.Store({
        url: 'listarOrganoSatisface',
        id: 'stCmbOrgSat',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idorganosatisface'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            load: function () {
                stCmbModelos.reload();
            }
        }
    });
    stCmbModelos = new Ext.data.Store({
        url: 'listarModelos',
        id: 'stCmbModelos',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idmodelo'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            load: function () {
                stum.reload();
            }
        }
    });
    stum = new Ext.data.Store({
        url: 'cargarunidadmedida',
        id: 'stCmbModelos',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idunidadmedida'
                    }, {
                        name: 'abreviaturaunidadmedida'
                    }]),
        listeners: {
            load: function () {
                stcb.reload();
            }
        }
    });
    stcb = new Ext.data.Store({
        url: 'listarCentroBalance',
        id: 'stcb',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{name: 'idcentrobalance'
                    }, {
                        name: 'centrobalance'
                    }]),
        listeners: {
            load: function () {
                stCbejercicio.reload();
            }
        }
    });
    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        listeners: {
            load: function (t) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                cargarInterfaz();
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
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        disabled: false,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: etiqueta.lbSeleccione,
        loadingText: etiqueta.lbCargando,
        width: 180,
        listeners: {
            select: function () {
                modeloselected = -1;
                if (cbTipoCalc.getValue() != null && cbTipoCalc.getValue() != '' && cbTipoCalc.getValue() != undefined
                        && identidadselected != null) {
                    stGpGestCalc.reload();
                    if (!actualizarplan_recurso)
                        treePlanesParaActualizar.getRootNode().reload();
                }
            }
        }
    });
}
function cargarInterfaz() {
    sttipocalc = new Ext.data.SimpleStore({
        fields: [{
                name: 'idtipocalc'
            }, {
                name: 'denominacion'
            }],
        data: [[1, etiqueta.lbNormas], [2, etiqueta.lbSalidas]]
    });
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
//                ,
//        listeners: {
//            load: function (st) {
//                stEstados.reload();
//            }
//        }
    });
    cbTipoCalc = new Ext.form.ComboBox({
        value: 1,
        id: 'cbTipoCalc',
        store: sttipocalc,
        valueField: 'idtipocalc',
        hiddenName: 'idtipocalc',
        displayField: 'denominacion',
        disabled: false,
        mode: 'local',
        allowBlank: true,
        editable: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: etiqueta.lbSeleccione,
        width: 100,
        listeners: {
            select: function () {
                modeloselected = -1;
                if (cbEjercicio.getValue() != null && cbEjercicio.getValue() != '' && cbEjercicio.getValue() != undefined
                        && identidadselected != null) {
                    stGpGestCalc.reload();
                    if (!actualizarplan_recurso)
                        treePlanesParaActualizar.getRootNode().reload();
                }
            }
        }
    });
    btnGraficas = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: identidadselected,
        componente: 'Calculo'
    });
    btnGraficoPlanif = btnGraficas.botonMenuGrafica();
    btnExportar = new Ext.Button({
        disabled: true,
        id: 'btnExportar',
        iconCls: 'exportar',
        tooltip: etiqueta.lbExportarCalculos,
        handler: function () {
            exportar();
        }
    });
    btnActualizarCalculos = new Ext.Button({
        iconCls: 'calcular',
        disabled: true,
        id: 'btnActualizarCalculos',
        hidden: actualizarCalculos_recurso,
        tooltip: etiqueta.lbActualizarCalculos,
        handler: function () {
            confActualizarCalculos();
        }
    });
    btnEliminarCalculos = new Ext.Button({
        iconCls: 'eliminar',
        id: 'btnEliminarCalculos',
        hidden: eliminarCalculos_recurso,
        disabled: true,
        tooltip: etiqueta.lbEliminarCalculos,
        handler: function () {
            confElimCalculos();
        }
    });
    btnActualizarPlan = new Ext.Button({
        iconCls: 'planificar',
        disabled: true,
        tooltip: 'Actualizar planes',
        id: 'btnActualizarPlan',
        hidden: actualizarplan_recurso,
        handler: function () {
            actualizarPlan();
        }
    });
    chkglobalBC = new Ext.form.Checkbox({
        xtype: 'checkbox',
        boxLabel: 'Global',
        hidden: true,
        id: 'chkglobalBC',
        listeners: {
            check: function () {
                if (cbTipoCalc.getValue() != null && cbTipoCalc.getValue() != '' && cbTipoCalc.getValue() != undefined
                        && cbEjercicio.getValue() != null && cbEjercicio.getValue() != '' && cbEjercicio.getValue() != undefined
                        && identidadselected != null) {
                    stGpGestCalc.reload();
                    if (Ext.getCmp('chkglobalBC').getValue() == true) {
                        limpiar = 1;
                    } else {
                        limpiar = 0;
                    }
                    if (!actualizarplan_recurso)
                        treePlanesParaActualizar.getRootNode().reload();
                }
            }
        }});
    btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: etiqueta.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtroscalculos.clearFilters();
        }
    });
    tfimportetotal = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'preciototal',
        width: 100,
        align: 'right',
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000',
        disabled: true
    });
    stCbImportes = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, etiqueta.lbImporte],
            [2, etiqueta.lbImporteMLC],
            [3, etiqueta.lbImporteFlete],
            [4, etiqueta.lbImporteConti]
        ]
    });
    cbImportes = new Ext.form.ComboBox({
        value: 1,
        store: stCbImportes,
        displayField: 'denominacion',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 110,
        emptyText: etiqueta.lbSeleccione,
        listeners: {
            select: function () {
                if (importes[cbImportes.getValue()] != undefined) {
                    var importe = separadorDeMiles(importes[cbImportes.getValue()]);
                    tfimportetotal.setValue(importe);
                } else {
                    tfimportetotal.setValue('0.000');
                }
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    storelistadoactualizarplanes = new Ext.tree.TreeLoader({
        dataUrl: 'listarplanmodelo',
        listeners: {
            scope: this,
            beforeload: function (loader, treeNode) {
                loader.baseParams = {
                    idesctructura: identidadselected,
                    tipo: treeNode.attributes.tipo,
                    idejercicio: cbEjercicio.getValue(),
                    tipocalc: Ext.getCmp('cbTipoCalc').getValue(),
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
                stGpGestCalc.reload();
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
//grid de calculos
    stGpGestCalc = new Ext.data.GroupingStore({
        url: 'listarCalculos',
        sortInfo: {
            field: 'modelo',
            direction: "ASC"
        },
        groupField: 'modelo',
        listeners: {
            load: function () {
                calcularImporteTotal();
                pintarIndicDirectos();
                controlarBtn();
                if (stGpGestCalc.getCount() == 0) {
                    if (beforeloadstCalculos) {
                        if (filtroscalculos.getFiltrosActivos().length > 0)
                            mostrarMensaje(1, etiqueta.msjNoExistenDatosFiltro);
                        else
                            mostrarMensaje(1, etiqueta.msjNoExistenDatos);
                    }
                    btnGraficoPlanif.disable();
                } else {
                    btnGraficoPlanif.enable();
                }
                beforeloadstCalculos = false;
            },
            beforeload: function () {
                Ext.Ajax.timeout = 600000; //10min
                stGpGestCalc.baseParams.identidad = identidadselected;
                stGpGestCalc.baseParams.start = offset;
                stGpGestCalc.baseParams.tipocalc = (Ext.getCmp('cbTipoCalc').getValue() == '') ? 1 : Ext.getCmp('cbTipoCalc').getValue();
                stGpGestCalc.baseParams.idejercicio = cbEjercicio.getValue();
                stGpGestCalc.baseParams.glob = Ext.getCmp('chkglobalBC').getValue();
                stGpGestCalc.baseParams.hoja = is_leaf;
                //este es el modelo que se va a actualizar
                if (modeloselected != -1) {
                    if (modeloselected.attributes.tipo == 2)
                        stGpGestCalc.baseParams.idmodelo = modeloselected.attributes.id;
                    else
                        stGpGestCalc.baseParams.idmodelo = -1;
                } else
                    stGpGestCalc.baseParams.idmodelo = -1;
                beforeloadstCalculos = true;
                cambiarTituloFiltrar(gpGestCalc, filtroscalculos, etiqueta.lbBaseCalculo);
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [{
                name: 'indicador'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'idmodelo'
            }, {
                name: 'modelo'
            }, {
                name: 'identidaddatosnomenclador'
            }, {
                name: 'idnaturaleza'
            }, {
                name: 'idvia'
            }, {
                name: 'idorgano'
            }, {
                name: 'idpais'
            }, {
                name: 'idtipoplan'
            }, {
                name: 'esdirecto'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'flete'
            }, {
                name: 'contingencia'
            }, {
                name: 'necesidad'
            }, {
                name: 'importe'
            }, {
                name: 'importedivisa'
            }, {
                name: 'importeflete'
            }, {
                name: 'importecontingencia'
            }, {
                name: 'importetotal'
            }, {
                name: 'importedivisatotal'
            }, {
                name: 'importefletetotal'
            }, {
                name: 'importecontingenciatotal'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }
        ])
    });
    var cm = new Ext.grid.ColumnModel([{
            header: etiqueta.lbCodigo,
            tooltip: etiqueta.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: etiqueta.lbNroPieza,
            tooltip: etiqueta.lbTtNroPieza,
            width: 100,
            dataIndex: 'numeropieza',
            renderer: crearToolTip
        }, {
            header: etiqueta.lbDenominacion,
            tooltip: etiqueta.lbDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: etiqueta.lbUnidadMedida,
            width: 60,
            dataIndex: 'idumedida',
            tooltip: etiqueta.lbUnidadMedida,
            renderer: renderUM
        }, {
            header: etiqueta.lbCentrobalance,
            width: 150,
            dataIndex: 'identidaddatosnomenclador',
            tooltip: etiqueta.lbCentrobalance,
            hidden: true,
            renderer: renderCB
        }, {
            header: etiqueta.lbNaturaleza,
            width: 110,
            dataIndex: 'idnaturaleza',
            tooltip: etiqueta.lbNaturaleza,
            hidden: true,
            renderer: renderNat
        }, {
            header: etiqueta.lbViaAdquisicion,
            width: 110,
            dataIndex: 'idvia',
            hidden: true,
            tooltip: etiqueta.lbViaAdquisicion,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbOrganoQueSatisface,
            width: 150,
            dataIndex: 'idorgano',
            tooltip: etiqueta.lbOrganoQueSatisface,
            hidden: true,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbPais,
            width: 110,
            dataIndex: 'idpais',
            tooltip: etiqueta.lbPais,
            hidden: true,
            renderer: renderPais
        }, {
            header: etiqueta.lbPlan,
            width: 100,
            dataIndex: 'modelo',
            tooltip: etiqueta.lbPlan,
            renderer: crearToolTip
        }, {
            header: etiqueta.lbTipoPlan,
            width: 110,
            dataIndex: 'idtipoplan',
            tooltip: etiqueta.lbTipoPlan,
            hidden: true,
            renderer: renderTipoPlan
        }, {
            header: etiqueta.lbPrecio,
            width: 100,
            dataIndex: 'precio',
            tooltip: etiqueta.lbTtPrecio,
            renderer: crearToolTipNro,
            align: 'right'
        }, {
            header: etiqueta.lbPrecioMLC,
            width: 100,
            dataIndex: 'preciodivisa',
            tooltip: etiqueta.lbTtPrecioMLC,
            renderer: crearToolTipNro,
            align: 'right'
        }, {
            header: etiqueta.lbNecesidad,
            width: 100,
            align: 'right',
            dataIndex: 'necesidad',
            tooltip: etiqueta.lbTtNecesidad,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbImporte,
            width: 110,
            dataIndex: 'importe',
            align: 'right',
            tooltip: etiqueta.lbImporte,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbImporteMLC,
            width: 110,
            dataIndex: 'importedivisa',
            align: 'right',
            tooltip: etiqueta.lbImporteMLC,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbContingencia,
            width: 110,
            align: 'right',
            dataIndex: 'contingencia',
            tooltip: etiqueta.lbContingencia,
            hidden: true,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbFlete,
            width: 110,
            align: 'right',
            dataIndex: 'flete',
            tooltip: etiqueta.lbFlete,
            hidden: true,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbImporteFlete,
            width: 110,
            dataIndex: 'importeflete',
            align: 'right',
            tooltip: etiqueta.lbImporteFlete,
            hidden: true,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbImporteConti,
            width: 110,
            dataIndex: 'importecontingencia',
            align: 'right',
            tooltip: etiqueta.lbTtImporteConti,
            hidden: true,
            renderer: crearToolTipNro
        }, {
            header: etiqueta.lbUsuario,
            tooltip: etiqueta.lbUsuario,
            width: 100,
            sortable: true,
            align: 'left',
            hidden: true,
            dataIndex: 'idusuario',
            renderer: renderUsuarios
        }, {
            header: etiqueta.lbFecha,
            tooltip: etiqueta.lbFechaM,
            width: 100,
            sortable: true,
            align: 'center',
            hidden: true,
            dataIndex: 'fecha',
            renderer: renderFecha
        }
    ]);
    smGpGestCalc = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    filtroscalculos = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'codigo_ind_calculo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidacalculo',
                urlcb: 'cargarunidadmedida',
                st: stum,
                autoload: false,
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida'
            }, {
                type: 'listado',
                dataIndex: 'modelo',
                idcombo: 'idcbmodelocalculo',
                urlcb: 'listarModelos',
                st: stCmbModelos,
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                autoload: false,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'necesidad'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'numeric',
                dataIndex: 'importedivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importeflete'
            }, {
                type: 'numeric',
                dataIndex: 'importecontingencia'
            }, {
                type: 'listado',
                dataIndex: 'identidaddatosnomenclador',
                idcombo: 'stcb',
                urlcb: 'listarCentroBalance',
                st: stcb,
                autoload: false,
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance',
                tpl: '<tpl for="."><div ext:qtip="{centrobalance}" class="x-combo-list-item">{centrobalance}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'flete'
            }, {
                type: 'numeric',
                dataIndex: 'contingencia'
            }, {
                type: 'listado',
                dataIndex: 'idnaturaleza',
                idcombo: 'cbFiltroNaturaleza',
                urlcb: 'listarNaturaleza',
                valueFieldcb: 'naturaleza',
                displayFieldcb: 'denominacion',
                st: stCmbNaturaleza,
                autoload: false,
                mode: 'local',
                multiple: 1
            }, {
                type: 'listado',
                dataIndex: 'idvia',
                idcombo: 'cbviaadquisicion',
                urlcb: 'listarViaAdquisicion',
                valueFieldcb: 'idviaadquisicion',
                displayFieldcb: 'denominacion',
                st: stCmbViaAdq,
                autoload: false,
                mode: 'local',
                width: 200,
                multiple: 1
            }, {
                type: 'listado',
                dataIndex: 'idorgano',
                idcombo: 'cboqs',
                urlcb: 'listarOrganoSatisface',
                valueFieldcb: 'idorganosatisface',
                displayFieldcb: 'denominacion',
                st: stCmbOrgSat,
                autoload: false,
                mode: 'local',
                width: 200,
                multiple: 1

            }, {
                type: 'listado',
                dataIndex: 'idpais',
                idcombo: 'cbFiltroPaises',
                urlcb: 'listarPaises',
                valueFieldcb: 'idpais',
                displayFieldcb: 'denominacion',
                st: stCmbPaises,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'idtipoplan',
                options: [etiqueta.lbIngreso,
                    etiqueta.lbGasto]
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
            }
        ]
    });
    gpGestCalc = new Ext.grid.GridPanel({
        frame: true,
        id: 'gpGestCalc',
        title: etiqueta.lbBaseCalculo,
        store: stGpGestCalc,
        margins: '2 2 2 -4',
        region: 'center',
        disabled: true,
        plugins: filtroscalculos,
        sm: smGpGestCalc,
        cm: cm,
        autoWidth: true,
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "' + etiqueta.lbIndicadores + '" : "' + etiqueta.lbIndicador + '"]})'
        }),
        loadMask: {
            msg: etiqueta.lbCargando
        },
        tbar: [etiqueta.lbTipo, cbTipoCalc, '-', etiqueta.lbEjercicio, cbEjercicio, '-', btnActualizarCalculos, btnEliminarCalculos, '-', btnExportar, '-', btnGraficoPlanif, '-', chkglobalBC],
        bbar: new Ext.PagingToolbar({
            store: stGpGestCalc,
            displayInfo: true,
            items: ['-', btnLimpiarFiltros, '-', cbImportes, tfimportetotal],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        })
    });
    trEnt = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 600
            });
    trEnt.btnBuscar.setText("");
    trEnt.btnLimpiar.setText("");
    trEnt = trEnt.items.items[0];
    trEnt.getRootNode().expand();
    trEnt.region = 'center';
//arbol de entidades
    trEnt.addListener('click', function (n) {
        if (n.text != "Estructuras") {
            identidadselected = n.id;
            modeloselected = -1;
            is_leaf = n.leaf;
            btnGraficas.actualizarParametros(n, 'Calculo');
            if (!is_leaf)
                Ext.getCmp('chkglobalBC').show();
            else
                Ext.getCmp('chkglobalBC').hide();
            Ext.Ajax.request({
                url: 'entidadOD',
                params: {
                    identidad: identidadselected
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    identidadEsOD = responseData;
                    gpGestCalc.enable();
                    if (identidadEsOD == 1 || (!is_leaf && Ext.getCmp('chkglobalBC').getValue() == true)) {
                        if (cbTipoCalc.getValue() != null && cbTipoCalc.getValue() != '' && cbTipoCalc.getValue() != undefined
                                && cbEjercicio.getValue() != null && cbEjercicio.getValue() != '' && cbEjercicio.getValue() != undefined
                                && identidadselected != null) {
                            stGpGestCalc.reload();
                            if (!actualizarplan_recurso)
                                treePlanesParaActualizar.getRootNode().reload();
                        }
                    } else {
                        mostrarMensaje(1, etiqueta.msjErrorNoEsOD);
                        stGpGestCalc.loadData({"data": [], "total": 0});
                        limpiar = 1;
                        if (!actualizarplan_recurso)
                            treePlanesParaActualizar.getRootNode().reload();
                        controlarBtn();
                    }
                }
            });
        } else {
            gpGestCalc.disable();
            pModelos.disable();
            stGpGestCalc.loadData({"data": [], "total": 0});
            limpiar = 1;
            if (!actualizarplan_recurso)
                treePlanesParaActualizar.getRootNode().reload();
        }
    });
    pMultiEnt = new Ext.Panel({
        title: etiqueta.lbEntidades,
        id: 'pMultiEnt',
        region: 'west',
        collapsible: true,
        titleCollapse: true,
        split: true,
        listeners: {
            show: function (tp) {
                trEnt.getRootNode().expand();
            }
        },
        width: 300,
        layout: 'fit',
        items: trEnt
    });
    pModelos = new Ext.Panel({
        title: etiqueta.lbPlanes,
        disabled: true,
        id: 'pModelos',
        region: 'east',
        hidden: actualizarplan_recurso,
        collapsible: true,
        titleCollapse: true,
        collapsed: true,
        split: true,
        width: 200,
        layout: 'fit',
        tbar: [btnActualizarPlan],
        items: treePlanesParaActualizar
    });
    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            items: [pMultiEnt, gpGestCalc, pModelos]
        })
    });
}
function confElimCalculos() {
    mostrarMensaje(2, etiqueta.msjConfElimCalculo, eliminarCalculos);
}
function eliminarCalculos(btnPresionado) {
    if (btnPresionado == 'ok') {
        Ext.MessageBox.show({
            title: etiqueta.lbCargando,
            msg: etiqueta.msjEliminandoCalc,
            width: 300,
            wait: true,
            progress: true,
            closable: false
        });
        operacion = 'eliminar';
        generarCalculos();
    }
}
function confActualizarCalculos() {
    mostrarMensaje(2, etiqueta.msjConfActCalculo, actCalculos);
}
function actCalculos(btnPresionado) {
    if (btnPresionado == 'ok') {
        Ext.MessageBox.show({
            title: etiqueta.lbCargando,
            msg: etiqueta.msjActualizandoCalc,
            width: 300,
            wait: true,
            progress: true,
            closable: false
        });
        operacion = 'actualizar';
        generarCalculos();
    }
}
function generarCalculos() {
    Ext.Ajax.request({
        loadMask: {
            msg: etiqueta.lbCargando
        },
        url: 'operacionesBasesDeCalculo',
        timeout: 600000, //180000 miliseg = 3min  600000 ms = 10min
        params: {
            identidad: identidadselected,
            idejercicio: cbEjercicio.getValue(),
            operacion: operacion,
            idtipocalc: (Ext.getCmp('cbTipoCalc').getValue() == '') ? 1 : Ext.getCmp('cbTipoCalc').getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 1) {
                if (operacion == 'eliminar') {
                    mostrarMensaje(1, etiqueta.msjCalculoElimOk);
                } else if (operacion == 'actualizar') {
                    mostrarMensaje(1, etiqueta.msjCalculoActOk);
                }
                Ext.MessageBox.hide();
                stGpGestCalc.reload();
            }
            if (responseData.codMsgN == 0) {
                mostrarMensaje(3, etiqueta.msjErrorAction);
                Ext.MessageBox.hide();
            }
        }
    });
}
function actualizarPlan() {
    if (modeloselected != -1)
        if (modeloselected.attributes.tipo == 2) {
            Ext.getBody().mask(etiqueta.msjActualizandoPlan, 'ext-el-mask-msg x-mask-loading');
            Ext.Ajax.request({
                url: 'actualizarplanes',
                timeout: 6400000,
                params: {
                    idmodelo: modeloselected.attributes.id,
                    idestructura: identidadselected,
                    idejercicio: cbEjercicio.getValue(),
                    idtipocalc: (Ext.getCmp('cbTipoCalc').getValue() == '') ? 1 : Ext.getCmp('cbTipoCalc').getValue()
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    response = Ext.decode(response.responseText);
                    if (Ext.getCmp('cbTipoCalc').getValue() == 1) {
                        if (response.cod[0].f_integracion_basecalculo) {
                            mostrarMensaje(1, etiqueta.msjPlanActualizadoOk);
                        } else {
                            mostrarMensaje(3, etiqueta.msjPlanActualizadoError);
                        }
                    } else {
                        if (response.cod[0].f_integracion_basecalculosalida) {
                            mostrarMensaje(1, etiqueta.msjPlanActualizadoOk);
                        } else {
                            mostrarMensaje(3, etiqueta.msjPlanActualizadoError);
                        }
                    }
                }
            });
        }
}
function cambiarTituloFiltrar(gridPanel, filtro, titulo) {
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
}
function exportar() {
    if (modeloselected != -1)
        if (modeloselected.attributes.tipo == 2)
            $idmodelo = modeloselected.attributes.id;
        else
            $idmodelo = -1;
    else
        $idmodelo = -1;
    var win = window.open('exportar?identidad=' + identidadselected
            + '&text=' + trEnt.getNodeById(identidadselected).text
            + '&idejercicio=' + cbEjercicio.getValue()
            + "&hoja=" + is_leaf
            //este es el modelo que se va a actualizar
            + "&idmodelo=" + $idmodelo
            + "&idtipocalc=" + ((Ext.getCmp('cbTipoCalc').getValue() == '') ? 1 : Ext.getCmp('cbTipoCalc').getValue())
            + "&glob=" + Ext.getCmp('chkglobalBC').getValue()
            + '&filtros=' + Ext.encode(filtroscalculos.getFilterData()));
    if (Ext.getCmp('cbTipoCalc').getValue() == 1) {
        mascaraExportar(etiqueta.msjExportandoCals, etiqueta.msjEsperePorFavor, win);
    } else {
        mascaraExportar(etiqueta.msjExportandoSal, etiqueta.msjEsperePorFavor, win);
    }
}
function setearImporte() {
    importes = [];
    importes.push('0.000'); //indice 1 MN
    importes.push('0.000'); //indice 2 MLC
    importes.push('0.000'); //indice 3 IFlete
    importes.push('0.000'); //indice 4 IContingencia
}
function calcularImporteTotal() {
    setearImporte();
    if (stGpGestCalc.getCount() > 0) {
        importes[1] = stGpGestCalc.getAt(0).data.importetotal;
        importes[2] = stGpGestCalc.getAt(0).data.importedivisatotal;
        importes[3] = stGpGestCalc.getAt(0).data.importeparcialflete;
        importes[4] = stGpGestCalc.getAt(0).data.importeparcialconti;
        var importe = separadorDeMiles(importes[cbImportes.getValue()]);
        tfimportetotal.setValue(importe);
    } else {
        var importe = separadorDeMiles(importes[cbImportes.getValue()]);
        tfimportetotal.setValue(importe);
    }
}
function  pintarIndicDirectos() {
    for (var i = 0; i < stGpGestCalc.getCount(); i++) {
        for (var j = 0; j < gpGestCalc.getColumnModel().getColumnCount(); j++) {
            if (stGpGestCalc.getAt(i).data.esdirecto == 1) {
                Ext.get(gpGestCalc.getView().getCell(i, j)).applyStyles('background-color:#FFCCAA');
            }
        }
    }
}
function controlarBtn() {
    btnActualizarCalculos.disable();
    btnEliminarCalculos.disable();
    btnActualizarPlan.disable();
    btnExportar.disable();
    if (chkglobalBC.getValue() == false && identidadEsOD == 1) {
        if (cbTipoCalc.getValue() != null && cbTipoCalc.getValue() != '' && cbTipoCalc.getValue() != undefined
                && cbEjercicio.getValue() != null && cbEjercicio.getValue() != '' && cbEjercicio.getValue() != undefined
                && identidadselected != null) {
            btnActualizarCalculos.enable();
            if (stGpGestCalc.getCount() > 0) {
                btnEliminarCalculos.enable();
                if (modeloselected != -1)
                    if (modeloselected.attributes.tipo == 2) {
                        btnActualizarPlan.enable();
                    }

            }
        }
    }
    if (stGpGestCalc.getCount() > 0) {
        btnExportar.enable();
    }
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function crearToolTipNro(v, m) {
    m.attr = 'ext:qtip="' + separadorDeMiles(v) + '"';
    return separadorDeMiles(v);
}
function separadorDeMiles(nStr) {
    nStr += '';
    ds = nStr.replace(/,/g, '');
    nStr = ds;
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stum.data.items.length; i++)
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.abreviaturaunidadmedida + '"';
            return stum.data.items[i].data.abreviaturaunidadmedida;
        }
}
function renderCB(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stcb.data.items.length; i++)
        if (stcb.data.items[i].data.idcentrobalance == value) {
            m.attr = 'ext:qtip="' + stcb.data.items[i].data.centrobalance + '"';
            return stcb.data.items[i].data.centrobalance;
        }
}
function renderNat(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stCmbNaturaleza.data.items.length; i++)
        if (stCmbNaturaleza.data.items[i].data.naturaleza == value) {
            m.attr = 'ext:qtip="' + stCmbNaturaleza.data.items[i].data.denominacion + '"';
            return stCmbNaturaleza.data.items[i].data.denominacion;
        }
}
function renderPais(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stCmbPaises.data.items.length; i++)
        if (stCmbPaises.data.items[i].data.idpais == value) {
            m.attr = 'ext:qtip="' + stCmbPaises.data.items[i].data.denominacion + '"';
            return stCmbPaises.data.items[i].data.denominacion;
        }
}
function renderTipoPlan(val, m) {
    if (val == 0) {
        m.attr = 'ext:qtip="' + etiqueta.lbGasto + '"';
        return etiqueta.lbGasto;
    } else {
        m.attr = 'ext:qtip="' + etiqueta.lbIngreso + '"';
        return etiqueta.lbIngreso;
    }
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
