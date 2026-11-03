var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('bpcalculo', cargaInicial);

var identidadselected = null, modeloselected = -1, identidadEsOD = 0, is_leaf = false, offset = 0, importes = [];

//no se si hacen falta
var added_nodes = [], operacion, deleted_nodes = [], originals_nodes = [], idejercicio = -1;

var idmodelosel = null, valuecol = 0;
var Cmpcomplementario = new Utilidades.Cmp.CmpBotonesComplementarios({
    elemento: 'Calculo'
});
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
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function () {
                modeloselected = -1;
                cbPlanesParaActualizar.getRootNode().reload();
                if (cbTipoCalc.getValue() != null && cbTipoCalc.getValue() != '' && cbTipoCalc.getValue() != undefined
                        && identidadselected != null)
                    stGpGestCalc.reload();
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
        data: [[1, perfil.etiquetas.lbNormas], [2, perfil.etiquetas.lbSalidas]]
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
        emptyText: perfil.etiquetas.lbSeleccioneNormas,
        width: 100,
        listeners: {
            select: function () {
                modeloselected = -1;
                cbPlanesParaActualizar.getRootNode().reload();
                if (cbEjercicio.getValue() != null && cbEjercicio.getValue() != '' && cbEjercicio.getValue() != undefined
                        && identidadselected != null)
                    stGpGestCalc.reload();
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
        tooltip: perfil.etiquetas.lbExportarCalculos,
        handler: function () {
            exportar();
        }
    });
    btnactualizarcalculos = new Ext.Button({
        iconCls: 'calcular',
        disabled: true,
        tooltip: perfil.etiquetas.lbCalculoPadre,
        handler: function () {
            actualizarCalculos();
        }
    });
    btneliminarcalculos = new Ext.Button({
        iconCls: 'eliminar',
        disabled: true,
        tooltip: perfil.etiquetas.lbEliminarCalculos,
        handler: function () {
            confElimCalculos();
        }
    });
    btnactualizarplan = new Ext.Button({
        iconCls: 'planificar',
        disabled: true,
        tooltip: 'Actualizar planes',
        handler: function () {
            actualizarPlan(trEnt.getSelectionModel().selNode.id);
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
                        && identidadselected != null)
                    stGpGestCalc.reload();
                controlarBtn();
            }
        }});

    btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtroscalculos.clearFilters();
        }
    });
    tfimportetotal = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'preciototal',
        width: 100,
        align: 'right',
        disabled: false,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000',
        disabled: true
    });
    stCbImportes = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporte],
            [2, perfil.etiquetas.lbImporteMLC],
            [3, perfil.etiquetas.lbImporteFlete],
            [4, perfil.etiquetas.lbImporteConti]
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
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
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
                    tipocalc: Ext.getCmp('cbTipoCalc').getValue()
                };
            },
            load: function (loader, nodo, respuesta) {
                if (nodo.id == 0) {
                    nodo.expandChildNodes();
                }
            }
        }
    });
    cbPlanesParaActualizar = new Ext.tree.TreePanel({
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
            text: perfil.etiquetas.lbListadoPlanes,
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
                if (stGpGestCalc.getCount() == 0) {
                    controlarBtn();
                    if (filtroscalculos.getFiltrosActivos().length > 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    btnGraficoPlanif.disable();
                    btnExportar.disable();
                } else {
                    controlarBtn();
                    btnGraficoPlanif.enable();
                    btnExportar.enable();
                }
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
                cambiarTituloFiltrarCalculo();
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
            }
        ])
    });
    var cm = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNroPieza,
            tooltip: perfil.etiquetas.lbTtNroPieza,
            width: 100,
            dataIndex: 'numeropieza',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUnidadMedida,
            width: 60,
            dataIndex: 'idumedida',
            tooltip: perfil.etiquetas.lbUnidadMedida,
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbCentroBalance,
            width: 150,
            dataIndex: 'identidaddatosnomenclador',
            tooltip: perfil.etiquetas.lbCentroBalance,
            hidden: true,
            renderer: renderCB
        }, {
            header: perfil.etiquetas.lbNaturaleza,
            width: 110,
            dataIndex: 'idnaturaleza',
            tooltip: perfil.etiquetas.lbNaturaleza,
            hidden: true,
            renderer: renderNat
        }, {
            header: perfil.etiquetas.lbViaAdquisicion,
            width: 110,
            dataIndex: 'idvia',
            hidden: true,
            tooltip: perfil.etiquetas.lbViaAdquisicion,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbOrganoQueSatisface,
            width: 150,
            dataIndex: 'idorgano',
            tooltip: perfil.etiquetas.lbOrganoQueSatisface,
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPais,
            width: 110,
            dataIndex: 'idpais',
            tooltip: perfil.etiquetas.lbPais,
            hidden: true,
            renderer: renderPais
        }, {
            header: perfil.etiquetas.lbPlan,
            width: 100,
            dataIndex: 'modelo',
            tooltip: perfil.etiquetas.lbPlan,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbTipoPlan,
            width: 110,
            dataIndex: 'idtipoplan',
            tooltip: perfil.etiquetas.lbTtTipoPlan,
            hidden: true,
            renderer: renderTipoPlan
        }, {
            header: perfil.etiquetas.lbPrecio,
            width: 100,
            dataIndex: 'precio',
            tooltip: perfil.etiquetas.lbTtPrecio,
            renderer: crearToolTipNro,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbPrecioMLC,
            width: 100,
            dataIndex: 'preciodivisa',
            tooltip: perfil.etiquetas.lbTtPrecioMLC,
            renderer: crearToolTipNro,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbNecesidad,
            width: 100,
            align: 'right',
            dataIndex: 'necesidad',
            tooltip: perfil.etiquetas.lbTtNecesidad,
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbImporte,
            width: 110,
            dataIndex: 'importe',
            align: 'right',
            tooltip: perfil.etiquetas.lbImporte,
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbImporteMLC,
            width: 110,
            dataIndex: 'importedivisa',
            align: 'right',
            tooltip: perfil.etiquetas.lbImporteMLC,
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbContingencia,
            width: 110,
            align: 'right',
            dataIndex: 'contingencia',
            tooltip: perfil.etiquetas.lbContingencia,
            hidden: true,
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbFlete,
            width: 110,
            align: 'right',
            dataIndex: 'flete',
            tooltip: perfil.etiquetas.lbFlete,
            hidden: true,
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbImporteFlete,
            width: 110,
            dataIndex: 'importeflete',
            align: 'right',
            tooltip: perfil.etiquetas.lbImporteFlete,
            hidden: true,
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbImporteConti,
            width: 110,
            dataIndex: 'importecontingencia',
            align: 'right',
            tooltip: perfil.etiquetas.lbTtImporteConti,
            hidden: true,
            renderer: crearToolTipNro
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
                options: [perfil.etiquetas.lbIngreso,
                    perfil.etiquetas.lbGasto]
            }
        ]
    });

    gpGestCalc = new Ext.grid.GridPanel({
        frame: true,
        id: 'gpGestCalc',
        title: perfil.etiquetas.lbBaseCalculo,
        store: stGpGestCalc,
        margins: '2 2 2 -4',
        region: 'center',
        disabled: true,
        plugins: filtroscalculos,
        sm: smGpGestCalc,
        cm: cm,
        autoWidth: true,
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Indicadores" : "Indicador"]})'
        }),
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        tbar: ['Tipo: ', cbTipoCalc, '-', 'Ejercicio:', cbEjercicio, '-', btnactualizarcalculos, '-', btneliminarcalculos, '-', btnExportar, '-', btnGraficoPlanif, '-', chkglobalBC],
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
            cbPlanesParaActualizar.getRootNode().reload();
            is_leaf = n.leaf;
            btnGraficoPlanif.enable();
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
                    if (identidadEsOD == 1) {
                        controlarBtn();
                        gpGestCalc.enable();
                        if (cbTipoCalc.getValue() != null && cbTipoCalc.getValue() != '' && cbTipoCalc.getValue() != undefined
                                && cbEjercicio.getValue() != null && cbEjercicio.getValue() != '' && cbEjercicio.getValue() != undefined
                                && identidadselected != null)
                            stGpGestCalc.reload();
                    } else {
                        controlarBtn();

                        if ((is_leaf || Ext.getCmp('chkglobalBC').getValue() == false) && identidadselected != null) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorNoEsOD);
                        }
                        Ext.getCmp('chkglobalBC').hide();
                        stGpGestCalc.loadData({"data": [], "total": 0});

                    }
                }
            });

        } else {
            gpGestCalc.disable();
            btnGraficoPlanif.disable();
            Ext.getCmp('chkglobalBC').hide();
            stGpGestCalc.loadData({"data": [], "total": 0});
        }
    });
    pMultiEnt = new Ext.Panel({
        title: perfil.etiquetas.lbEntidades,
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
        title: perfil.etiquetas.lbPlanes,
        disabled: true,
        id: 'pModelos',
        region: 'east',
        collapsible: true,
        titleCollapse: true,
        collapsed: true,
        split: true,
        width: 200,
        layout: 'fit',
        tbar: [btnactualizarplan],
        items: cbPlanesParaActualizar
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
    if (identidadselected == null)
        return;
    mostrarMensaje(2, perfil.etiquetas.lbmsgConfElimCalculo, eliminarCalculos);
    eliminarCalculos();
    function eliminarCalculos(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Msg.wait(perfil.etiquetas.msjEliminandoCalc, perfil.etiquetas.lbEspereActualizando);
            operacion = 'eliminar';
            generarCalculos();
        }
    }
}
function actualizarCalculos() {
    if (identidadselected == null)
        return;
    mostrarMensaje(2, perfil.etiquetas.lbmsgConfActCalculo, actCalculos);
}
function actCalculos(btnPresionado) {
    if (btnPresionado == 'ok') {
        Ext.MessageBox.show({
            title: perfil.etiquetas.lbEspereActualizando,
            msg: perfil.etiquetas.msjActualizandoCalc,
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6'
        });
        operacion = 'actualizar';
        generarCalculos();
    }
}
function actualizarPlan(identidad) {
    if (modeloselected != -1)
        if (modeloselected.attributes.tipo == 2) {
            Ext.getBody().mask(perfil.etiquetas.lbActualizandoPlan, 'ext-el-mask-msg x-mask-loading');

            Ext.Ajax.request({
                url: 'actualizarplanes',
                timeout: 6400000,
                params: {
                    idmodelo: modeloselected.attributes.id,
                    idestructura: identidad,
                    idejercicio: cbEjercicio.getValue(),
                    idtipocalc: (Ext.getCmp('cbTipoCalc').getValue() == '') ? 1 : Ext.getCmp('cbTipoCalc').getValue()
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    response = Ext.decode(response.responseText);
                    if (Ext.getCmp('cbTipoCalc').getValue() == 1) {
                        if (response.cod[0].f_integracion_basecalculo) {
                            mostrarMensaje(1, perfil.etiquetas.lbPlanesActualizadosOk);
                        } else {
                            mostrarMensaje(3, perfil.etiquetas.lbPlanesActualizadosError);
                        }
                    } else {
                        if (response.cod[0].f_integracion_basecalculosalida) {
                            mostrarMensaje(1, perfil.etiquetas.lbPlanesActualizadosOk);
                        } else {
                            mostrarMensaje(3, perfil.etiquetas.lbPlanesActualizadosError);
                        }
                    }
                    Ext.getBody().unmask();
                }
            });
        }
}
function generarCalculos() {
    Ext.Ajax.request({
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        url: 'operacionesBasesDeCalculo',
        timeout: 600000, //180000 miliseg = 3min  600000 ms = 10min
        params: {
            identidad: identidadselected,
            is_leaf: is_leaf,
            idejercicio: cbEjercicio.getValue(),
            operacion: operacion,
            idtipocalc: (Ext.getCmp('cbTipoCalc').getValue() == '') ? 1 : Ext.getCmp('cbTipoCalc').getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == undefined) {
                mostrarMensaje(3, perfil.etiquetas.msgTiempoExcedido);
                return;
            }
            if (responseData.codMsg == 22) {
                if (operacion == 'eliminar') {
                    mostrarMensaje(1, perfil.etiquetas.msgCalculoElimOk);
                    Ext.Msg.hide();
                    gpGestCalc.getStore().reload();
                    return;
                } else if (operacion == 'actualizar') {
                    mostrarMensaje(1, perfil.etiquetas.msgCalculoActOk);
                    Ext.Msg.hide();
                    gpGestCalc.getStore().reload();
                    return;
                }
            }
            if (responseData.codMsg == 3) {
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                Ext.Msg.hide();
                gpGestCalc.getStore().reload();
                Ext.MessageBox.hide();
                return;
            }
            if (responseData.codMsg == 20) {
                mostrarMensaje(1, perfil.etiquetas.msgErrorAction1);
                Ext.Msg.hide();
                gpGestCalc.getStore().reload();
                return;
            }
            Ext.Msg.hide();
        }
    });
}



function cambiarTituloFiltrarCalculo() {
    var filtrado_por = "";
    var sep = "/";
    if (filtroscalculos.getFiltrosActivos() == undefined || filtroscalculos.getFiltrosActivos().length == 0) {
        gpGestCalc.setTitle(perfil.etiquetas.lbBaseCalculo);
    } else {
        for (i = 0; i < filtroscalculos.getFiltrosActivos().length; i++) {
            var numberCol = gpGestCalc.getColumnModel().findColumnIndex(filtroscalculos.getFiltrosActivos()[i].dataIndex);
            if (i == filtroscalculos.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gpGestCalc.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gpGestCalc.setTitle(perfil.etiquetas.lbBaseCalculo + "<i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
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
        mascaraExportar(perfil.etiquetas.lbExportandoCals, perfil.etiquetas.lbEsperePorFavor, win);
    } else {
        mascaraExportar(perfil.etiquetas.lbExportandoSal, perfil.etiquetas.lbEsperePorFavor, win);
    }

}
function setearImporte() {
    importes = [];
    importes.push('0.000'); //indice 0
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
    btnactualizarcalculos.disable();
    btneliminarcalculos.disable();
    btnactualizarplan.disable();

    btnExportar.disable();
    pModelos.disable();
    if (chkglobalBC.getValue() == false && identidadEsOD == 1) {
        if (cbTipoCalc.getValue() != null && cbTipoCalc.getValue() != '' && cbTipoCalc.getValue() != undefined
                && cbEjercicio.getValue() != null && cbEjercicio.getValue() != '' && cbEjercicio.getValue() != undefined
                ) {
            btnactualizarcalculos.enable();
            if (stGpGestCalc.getCount() > 0) {
                pModelos.enable();
                btneliminarcalculos.enable();
                if (modeloselected != -1)
                    if (modeloselected.attributes.tipo == 2) {
                        btnactualizarplan.enable();
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
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbGasto + '"';
        return perfil.etiquetas.lbGasto;
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbIngreso + '"';
        return perfil.etiquetas.lbIngreso;
    }
}

