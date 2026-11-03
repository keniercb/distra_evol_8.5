var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('bpcalculo', cargarInterfaz);
var identidadselected = null, is_leaf = false, modificacionespendientes, operacion, offset = 0;

var added_nodes = [], deleted_nodes = [], originals_nodes = [], idejercicio = -1;
var stCmbNaturaleza, stCmbPaises, stCmbTipoPlan, stCmbModelos, identidadEsOD = 0;
var importes = [];
var idmodelosel = null, valuecol = 0;

var Cmpcomplementario = new Utilidades.Cmp.CmpBotonesComplementarios({
    elemento: 'Calculo'
});

function cargarInterfaz() {
    /******* Fin teclas calientes ***************/
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ll', // limpiar
            alt: true,
            fn: function() {
                limpiar();
            }
        }, {
            key: 'Hh', // ayudaf
            alt: true,
            fn: function() {
            }
        }, {
            key: 'Zz', // actualizar calculos
            alt: true,
            ctrl: true,
            fn: function() {
                if (validarBtn(Ext.getCmp('btnactualizarcalculos'))) {
                    actualizarCalculos();
                }
            }
        }, {
            key: 46, // eliminar calculos
            fn: function() {
                if (validarBtn(Ext.getCmp('btneliminarcalculos'))) {
                    confElimCalculos();
                }
            }
        }, {
            key: 'Ee', // exportar calculos
            alt: true,
            fn: function() {
                if (validarBtn(Ext.getCmp('btnExportar'))) {
                    exportar();
                }
            }
        }
    ]);

    validarBtn = function(btn) {
        return btn.hidden == false && !btn.disabled
    };
    stCmbNaturaleza = getBuildStore('listarNaturaleza', 'stCmbNaturaleza', 'naturaleza', 'naturaleza', 'denominacion');
    stCmbPaises = getBuildStore('listarPaises', 'stCmbPaises', 'idpais', 'idpais', 'denominacion');
    stCmbViaAdq = getBuildStore('listarViaAdquisicion', 'stCmbViaAdq', 'idviaadquisicion', 'idviaadquisicion', 'denominacion');
    stCmbOrgSat = getBuildStore('listarOrganoSatisface', 'stCmbOrgSat', 'idorganosatisface', 'idorganosatisface', 'denominacion');
    stCmbTipoPlan = getBuildStore('listarTiposPlan', 'stCmbTipoPlan', 'iddatosnomenclador', 'iddatosnomenclador', 'denominacion');
    stCmbModelos = getBuildStore('listarModelos', 'stCmbModelos', 'idmodelo', 'idmodelo', 'denominacion');
    btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function() {
            limpiar();
        }
    });
    /******* Fin teclas calientes ***************/
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
                dataIndex: 'umedida',
                idcombo: 'idcbunidadmedidacalculo',
                urlcb: 'cargarunidadmedida',
                idstore: 'idtodasunidadesmedidacalculo',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida'
            }, {
                type: 'listado',
                dataIndex: 'denominacionmodelo',
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
                dataIndex: 'importeflete'
            }, {
                type: 'numeric',
                dataIndex: 'importecontingencia'
            }, {
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'idcentrobalancecalculo',
                urlcb: 'listarCentroBalance',
                idstore: 'idstcentrobalancecalculo',
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
                dataIndex: 'naturaleza',
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
                dataIndex: 'via',
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
                dataIndex: 'oqs',
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
                type: 'listado',
                dataIndex: 'idtipoplan',
                idcombo: 'cbFiltroPlanes',
                urlcb: 'listarTiposPlan',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stCmbTipoPlan,
                autoload: false,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }
        ]
    });

    var cm = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: perfil.etiquetas.lbNroPieza,
            tooltip: perfil.etiquetas.lbTtNroPieza,
            width: 100,
            dataIndex: 'numeropieza',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: perfil.etiquetas.lbUnidadMedida,
            width: 60,
            dataIndex: 'umedida',
            tooltip: perfil.etiquetas.lbUnidadMedida,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: perfil.etiquetas.lbPlan,
            width: 100,
            dataIndex: 'denominacionmodelo',
            tooltip: perfil.etiquetas.lbPlan,
            renderer: denominacionmodelo,
            sortable: true
        }, {
            header: perfil.etiquetas.lbPrecio,
            width: 100,
            dataIndex: 'precio',
            tooltip: perfil.etiquetas.lbTtPrecio,
            renderer: crearToolTip,
            align: 'right',
            hidden: false,
            sortable: true
        }, {
            header: perfil.etiquetas.lbPrecioMLC,
            width: 100,
            dataIndex: 'preciodivisa',
            tooltip: perfil.etiquetas.lbTtPrecioMLC,
            renderer: crearToolTip,
            align: 'right',
            hidden: false,
            sortable: true
        }, {
            header: perfil.etiquetas.lbNecesidad,
            width: 100,
            align: 'right',
            dataIndex: 'necesidad',
            tooltip: perfil.etiquetas.lbTtNecesidad,
            renderer: crearToolTip,
            hidden: false,
            sortable: true
        }, {
            header: perfil.etiquetas.lbImporte,
            width: 110,
            dataIndex: 'importe',
            align: 'right',
            tooltip: perfil.etiquetas.lbImporte,
            hidden: false,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbImporteFlete,
            width: 110,
            dataIndex: 'importeflete',
            align: 'right',
            tooltip: perfil.etiquetas.lbImporteFlete,
            hidden: true,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbImporteConti,
            width: 110,
            dataIndex: 'importecontingencia',
            align: 'right',
            tooltip: perfil.etiquetas.lbTtImporteConti,
            hidden: true,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCentroBalance,
            width: 150,
            dataIndex: 'centrobalance',
            tooltip: perfil.etiquetas.lbCentroBalance,
            hidden: true,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: perfil.etiquetas.lbContingencia,
            width: 110,
            align: 'right',
            id: 'contingencia',
            dataIndex: 'contingencia',
            tooltip: perfil.etiquetas.lbContingencia,
            hidden: true,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbFlete,
            width: 110,
            align: 'right',
            id: 'flete',
            dataIndex: 'flete',
            tooltip: perfil.etiquetas.lbFlete,
            hidden: true,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNaturaleza,
            width: 110,
            id: 'naturaleza',
            dataIndex: 'naturaleza',
            tooltip: perfil.etiquetas.lbNaturaleza,
            hidden: true,
            sortable: true,
            renderer: function(val, m) {
                valuecol = getDenominacion(val, stCmbNaturaleza);
                m.attr = 'ext:qtip="' + valuecol + '"';
                return valuecol;
            }
        }, {
            header: perfil.etiquetas.lbViaAdquisicion,
            width: 110,
            id: 'via',
            dataIndex: 'via',
            sortable: true,
            tooltip: perfil.etiquetas.lbViaAdquisicion,
            renderer: function(val, m) {
                valuecol = getDenominacionVariosVal(val, stCmbViaAdq, 'via');
                m.attr = 'ext:qtip="' + valuecol + '"';
                return valuecol;
            }
        }, {
            header: perfil.etiquetas.lbOrganoQueSatisface,
            width: 150,
            id: 'oqs',
            dataIndex: 'oqs',
            sortable: true,
            tooltip: perfil.etiquetas.lbOrganoQueSatisface,
            hidden: true,
            renderer: function(val, m) {
                valuecol = getDenominacionVariosVal(val, stCmbOrgSat, 'oqs');
                m.attr = 'ext:qtip="' + valuecol + '"';
                return valuecol;
            }
        }, {
            header: perfil.etiquetas.lbPais,
            width: 110,
            id: 'idpais',
            dataIndex: 'idpais',
            sortable: true,
            tooltip: perfil.etiquetas.lbPais,
            hidden: true,
            renderer: function(val, m) {
                valuecol = getDenominacion(val, stCmbPaises);
                m.attr = 'ext:qtip="' + valuecol + '"';
                return valuecol;
            }
        }, {
            header: perfil.etiquetas.lbTipoPlan,
            width: 110,
            id: 'idtipoplan',
            dataIndex: 'idtipoplan',
            sortable: true,
            tooltip: perfil.etiquetas.lbTtTipoPlan,
            hidden: true,
            renderer: function(val, m) {
                valuecol = getDenominacion(val, stCmbTipoPlan);
                m.attr = 'ext:qtip="' + valuecol + '"';
                return valuecol;
            }
        }
    ]);
    cm.defaultSortable = true;
    tfcantidadtotal = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'cantidadtotal',
        width: 100,
        align: 'right',
        disabled: false,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0'
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
        emptyText: '0.000'
    });
    sttipocalc = new Ext.data.SimpleStore({
        id: 0,
        fields: [{
                name: 'idtipocalc'
            }, {
                name: 'denominacion'
            }],
        data: [[1, perfil.etiquetas.lbNormas], [2, perfil.etiquetas.lbSalidas]]
    });
    /* stCbPaginado = new Ext.data.SimpleStore({
     fields: ['idnumpag', 'dennumpag'],
     data: [
     [20, '20'],
     [80, '80'],
     [100, '100'],
     [250, '250'],
     [500, '500'],
     [750, '750'],
     [1000, '1000']
     ]
     });*/
    stCbImportes = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporte],
            [2, perfil.etiquetas.lbImporteFlete],
            [3, perfil.etiquetas.lbImporteConti]
        ]
    });
    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    /*cbPaginado = new Ext.form.ComboBox({
     value: 20,
     store: stCbPaginado,
     displayField: 'dennumpag',
     typeAhead: true,
     mode: 'local',
     forceSelection: true,
     triggerAction: 'all',
     selectOnFocus: true,
     hiddenName: 'idnumpag',
     valueField: 'idnumpag',
     width: 55,
     emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
     listeners: {
     select: function (cb, record, index) {
     Ext.getCmp('ptCalc').pageSize = record.data.idnumpag;
     Ext.getCmp('ptCalc').doLoad(Ext.getCmp('ptCalc').cursor);
     }
     },
     maskRe: /^([0-9]+ ?[0-9]*)+$/,
     maskReregex: /^([0-9]+ ?[0-9]*)+$/
     });*/
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
            select: function(cb, record, index) {
                if (cbImportes.getValue() == 1) {
                    tfimportetotal.setValue(stGpGestCalc.data.items[0].data.importetotal);
                } else if (cbImportes.getValue() == 2) {
                    tfimportetotal.setValue(stGpGestCalc.data.items[0].data.importefletetotal);
                } else if (cbImportes.getValue() == 3) {
                    tfimportetotal.setValue(stGpGestCalc.data.items[0].data.importecontingenciatotal);
                }
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    cbTipoCalc = new Ext.form.ComboBox({
        value: 1,
        id: 'cbTipoCalc',
        store: sttipocalc,
        valueField: 'idtipocalc',
        hiddenName: 'idtipocalc',
        displayField: 'denominacion',
        disabled: true,
        mode: 'local',
        allowBlank: true,
        editable: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: perfil.etiquetas.lbSeleccioneNormas,
        width: 100,
        listeners: {
            select: function(cb, rec, index) {
                stGpGestCalc.reload();
            }
        }
    });
    //*************************************
    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                getPermisos();
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
        disabled: true,
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
            select: function(cb, rec, index) {
                stGpGestCalc.reload();
                getPermisos();
            }
        }
    });

    stGpGestCalc = new Ext.data.GroupingStore({
        url: 'listarCalculos',
        sortInfo: {
            field: 'denominacionmodelo',
            direction: "ASC"
        },
        groupField: 'denominacionmodelo',
        listeners: {
            load: function() {
                gpGestCalc.getSelectionModel().selectFirstRow();
                calcularImporteTotal();
                pintarIndicDirectos();
            },
            beforeload: function() {
                Ext.Ajax.timeout = 600000; //10min
                stGpGestCalc.baseParams.identidad = identidadselected;
                //stGpGestCalc.baseParams.limit = cbPaginado.getValue();
                stGpGestCalc.baseParams.start = offset;
                stGpGestCalc.baseParams.is_leaf = is_leaf;
                stGpGestCalc.baseParams.ver_nat = !cm.getColumnById('naturaleza').hidden;
                stGpGestCalc.baseParams.ver_via = !cm.getColumnById('via').hidden;
                stGpGestCalc.baseParams.ver_oqs = !cm.getColumnById('oqs').hidden;
                stGpGestCalc.baseParams.tipocalc = (Ext.getCmp('cbTipoCalc').getValue() == '') ? 1 : Ext.getCmp('cbTipoCalc').getValue();
                stGpGestCalc.baseParams.idejercicio = cbEjercicio.getValue();
                stGpGestCalc.baseParams.glob = Ext.getCmp('chkglobalBC').getValue();
                cambiarTituloFiltrarCalculo();
            },
            load: function(st, rec, obj) {
                siexistecolumFiltrada();
                if (stGpGestCalc.getCount() == 0) {
                    if (identidadEsOD == 0) {
                        if ((is_leaf || Ext.getCmp('chkglobalBC').getValue() == false) && identidadselected != null) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorNoEsOD);
                            btnGraficoPlanif.disable();
                        }
                    }
                    btnExportar.disable();
                    tfimportetotal.setValue(importes[0]);
                } else {
                    btnExportar.enable();
                    if (cbImportes.getValue() == 1) {
                        tfimportetotal.setValue(stGpGestCalc.data.items[0].data.importetotal);
                    } else if (cbImportes.getValue() == 3) {
                        tfimportetotal.setValue(stGpGestCalc.data.items[0].data.importefletetotal);
                    } else if (cbImportes.getValue() == 4) {
                        tfimportetotal.setValue(stGpGestCalc.data.items[0].data.importecontingenciatotal);
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [{
                name: 'idbasescalculo'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'umedida'
            }, {
                name: 'denominacionmodelo'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'necesidad'
            }, {
                name: 'importe'
            }, {
                name: 'importeflete'
            }, {
                name: 'importecontingencia'
            }, {
                name: 'centrobalance'
            }, {
                name: 'flete'
            }, {
                name: 'contingencia'
            }, {
                name: 'naturaleza'
            }, {
                name: 'via' //via de adquisicion
            }, {
                name: 'oqs' //organo que satisface
            }, {
                name: 'idpais'
            }, {
                name: 'idtipoplan'
            }, {
                name: 'indicador'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'esdirecto'
            }, {
                name: 'importetotal'
            }, {
                name: 'importemlctotal'
            }, {
                name: 'importefletetotal'
            }, {
                name: 'importecontingenciatotal'
            }
        ])
    });

    smGpGestCalc = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    gpGestCalc = new Ext.grid.GridPanel({
        frame: true,
        id: 'gpGestCalc',
        title: perfil.etiquetas.lbBaseCalculo,
        store: stGpGestCalc,
        margins: '2 2 2 -4',
        region: 'center',
        plugins: filtroscalculos,
        sm: smGpGestCalc,
        collapsible: true,
        autoWidth: true,
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Indicadores" : "Indicador"]})'
        }),
        cm: cm,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        bbar: new Ext.PagingToolbar({
            id: 'ptCalc',
            store: stGpGestCalc,
            displayInfo: true,
            items: ['-', btnLimpiarFiltros, '-', cbImportes, {
                    xtype: 'tbtext',
                    text: '<b>:</b>'
                }, tfimportetotal/*, '-', {
                 xtype: 'tbtext',
                 text: perfil.etiquetas.lbResultPorPeginas
                 }, cbPaginado, '->'*/],
            listeners: {
                beforechange: function(p, e) {
                    offset = e.start;
                }
            }
        })

    });
    btnExportar = new Ext.Button({
        disabled: true,
        id: 'btnExportar',
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportarCalculos,
        handler: function() {
            exportar();
        }
    });
    limpiar = function() {
        filtroscalculos.clearFilters();
        Ext.getCmp('idfiltroent').setValue(null);
        rootNode = null;
        cbTipoCalc.reset();
    };
    btnAyu = new Ext.Button({
        disabled: false,
        id: 'btnAyudaCalculo',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbTtbtnAyu
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

    var listener = getNamedListener(trEnt, 'contextmenu');
    if (listener.length > 0) {
        for (var i = 0; i < listener.length; i++) {
            trEnt.removeListener('contextmenu', listener[i]);
        }
    }

    trEnt.getRootNode().expand();
    trEnt.region = 'center';
    var contextMenu = new Ext.menu.Menu({
        items: [
            {
                id: 'btnactualizarcalculos',
                itemCls: 'x-menu-item icondistra-actualizar',
                iconCls: 'imagen-none',
                disabled: false,
                text: perfil.etiquetas.lbCalculoPadre,
                handler: function() {
                    actualizarCalculos();
                }
            }, {
                id: 'btneliminarcalculos',
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                disabled: false,
                text: perfil.etiquetas.lbEliminarCalculos,
                handler: function() {
                    confElimCalculos();
                }
            }, {
                id: 'menuactualizarplan',
                itemCls: 'x-menu-item icondistra-actualizar sisplanico-verde',
                iconCls: 'imagen-none',
                disabled: false,
                hidden: true,
                text: 'Actualizar planes',
                handler: function() {
                    actualizarPlan(trEnt.getSelectionModel().selNode.id);
                }
            }]
    });
    trEnt.addListener('contextmenu', function(node, e)
    {
        node.select();
        identidadselected = node.id;
        is_leaf = node.leaf;
        //Determinando si es od
        Ext.Ajax.request({
            url: 'entidadOD',
            params: {
                identidad: identidadselected
            },
            callback: function(options, success, response) {

                var responseData = Ext.decode(response.responseText);
                identidadEsOD = responseData;
                if (identidadEsOD == 1) {
                    contextMenu.items.itemAt(2).show();
                    contextMenu.showAt(e.getXY());
                    Ext.getCmp('btnExportar').enable();
                    btnGraficoPlanif.enable();
                    btnGraficas.actualizarParametros(node, 'Calculo');
                } else {
                    if (Ext.getCmp('chkglobalBC').getValue() == true) {
                        btnGraficoPlanif.enable();
                        btnGraficas.actualizarParametros(node, 'Calculo');
                    } else {
                        btnGraficoPlanif.disable();
                    }
                }
            }
        });
        if (Ext.getCmp('chkglobalBC').getValue() == true && !is_leaf)
            Ext.getCmp('menuactualizarplan').hide();
    });

    trEnt.addListener('click', function(n) {
        if (n.text != "Estructuras") {
            gpGestCalc.enable();
            cbTipoCalc.enable();
            cbEjercicio.enable();
            Ext.getCmp('cbTipoCalc').enable();
            trEnt.getSelectionModel().select(n);
            identidadselected = n.id;
            is_leaf = n.leaf;
            if (is_leaf)
                Ext.getCmp('chkglobalBC').hide();
            else
                Ext.getCmp('chkglobalBC').show();
            stCmbModelos.removeAll();
            stCmbModelos.reload({
                params: {
                    identidad: identidadselected
                }
            });
            //Determinando si es od
            Ext.Ajax.request({
                url: 'entidadOD',
                params: {
                    identidad: identidadselected
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    identidadEsOD = responseData;
                    if (((Ext.getCmp('chkglobalBC').getValue() == false || is_leaf) && identidadEsOD == 1) || Ext.getCmp('chkglobalBC').getValue() == true) {
                        Ext.getCmp('btnExportar').enable();
                    }
                    if (identidadEsOD == 0) {
                        gpGestCalc.resumeEvents();
                        gpGestCalc.stopEditing();
                        gpGestCalc.getStore().removeAll();
                        btnGraficoPlanif.disable();
                        if (Ext.getCmp('chkglobalBC').getValue() == true) {
                            btnGraficoPlanif.enable();
                            btnGraficas.actualizarParametros(n, 'Calculo');
                        } else {
                            btnGraficoPlanif.disable();
                        }
                        if ((is_leaf) || (Ext.getCmp('chkglobalBC').getValue() == false)) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorNoEsOD);
                            stGpGestCalc.loadData({"data": [], "total": 0});
                        } else {
                            gpGestCalc.getStore().reload({
                                params: {
                                    idmodelo: null
                                }
                            });
                        }
                    } else {
                        btnGraficoPlanif.enable();
                        btnGraficas.actualizarParametros(n, 'Calculo');
                        gpGestCalc.getStore().reload({
                            params: {
                                idmodelo: null
                            }
                        });
                    }
                }
            });
        } else {
            gpGestCalc.disable();
            cbTipoCalc.disable();
            cbEjercicio.disable();
            Ext.getCmp('chkglobalBC').hide();
            stGpGestCalc.loadData({"data": [], "total": 0});
            /*var store = gpGestCalc.getStore();
             store.removeAll();*/
        }
    });

    actualizarCalculos = function() {
        if (identidadselected == null)
            return;
        mostrarMensaje(2, perfil.etiquetas.lbmsgConfActCalculo, actCalculos);
    };
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

    confElimCalculos = function() {
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

    pMultiEnt = new Ext.Panel({
        title: perfil.etiquetas.lbEntidades,
        id: 'pMultiEnt',
        region: 'west',
        collapsible: true,
        titleCollapse: true,
        split: true,
        listeners: {
            show: function(tp) {
                trEnt.getRootNode().expand();
            }
        },
        width: 200,
        layout: 'fit',
        items: trEnt
    });

    //boton para comp graficas
    btnGraficas = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: identidadselected,
        componente: 'Calculo'
    });
    btnGraficoPlanif = btnGraficas.botonMenuGrafica();

    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            items: [pMultiEnt, gpGestCalc],
            tbar: [btnExportar, '-', 'Tipo: ', cbTipoCalc, '-', 'Ejercicio:', cbEjercicio, '-', {
                    xtype: 'checkbox',
                    boxLabel: 'Global',
                    hidden: true,
                    id: 'chkglobalBC',
                    listeners: {
                        check: function(ck, t) {
                            // if (Ext.getCmp('chkglobalBC').getValue() == true) {
                            //btnGraficoPlanif.enable();
                            // } else {
                            // btnGraficoPlanif.disable();
                            //}
                            stGpGestCalc.reload();
                        }
                    }
                }, '-', btnGraficoPlanif, '->', btnAyu]
        })
    });
    gpGestCalc.on('headerclick', function(grid, colIndex, e) {
        pintarIndicDirectos();
    });
    stGpGestCalc.load();
}

function actualizarPlan(identidad) {
    deleted_nodes = [];
    added_nodes = [];
    idejercicio = -1;
    btnCancelar = new Ext.Toolbar.Button({
        id: 'btnCancelaractualizarplanes',
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbBtnCerrar,
        handler: function() {
            winActualizarPlanes.close();
        }
    });
    btnAceptar = new Ext.Toolbar.Button({
        id: 'btnAceptaractualizarplanes',
        iconCls: 'aceptar',
        disabled: true,
        text: 'Aceptar',
        handler: function() {
            if (listabasecalculo.getSelectionModel().selNode) {
                winActualizarPlanes.close();
                Ext.getBody().mask(perfil.etiquetas.lbActualizandoPlan, 'ext-el-mask-msg x-mask-loading');
                idmodelosel = listabasecalculo.getSelectionModel().selNode.id;
                idejercicio:cbEjercicio.getValue();
                Ext.Ajax.request({
                    url: 'actualizarplanes',
                    timeout: 6400000,
                    params: {
                        eliminar: Ext.encode(deleted_nodes),
                        adicionar: idmodelosel,
                        idestructura: identidad,
                        idejercicio: idejercicio
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        response = Ext.decode(response.responseText);
                        if (response.cod[0].f_integracion_basecalculo) {
                            mostrarMensaje(1, perfil.etiquetas.lbPlanesActualizadosOk);
                        } else {
                            mostrarMensaje(3, perfil.etiquetas.lbPlanesActualizadosError);
                        }
                        Ext.getBody().unmask();
                    }
                });
            }
        }
    });
    btnAplicar = new Ext.Toolbar.Button({
        id: 'btnAplicaractualizarplanes',
        iconCls: 'aplicar',
        text: 'Aplicar',
        disabled: true,
        handler: function() {
            if (listabasecalculo.getSelectionModel().selNode) {
                Ext.getBody().mask(perfil.etiquetas.lbActualizandoPlan, 'ext-el-mask-msg x-mask-loading');
                idmodelosel = listabasecalculo.getSelectionModel().selNode.id;
                idejercicio: cbEjercicio.getValue();
                Ext.Ajax.request({
                    url: 'actualizarplanes',
                    timeout: 6400000,
                    params: {
                        eliminar: Ext.encode(deleted_nodes),
                        adicionar: listabasecalculo.getSelectionModel().selNode.id,
                        idestructura: identidad,
                        idejercicio: idejercicio
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        response = Ext.decode(response.responseText);
                        if (response.cod[0].f_integracion_basecalculo) {
                            mostrarMensaje(1, perfil.etiquetas.lbPlanesActualizadosOk);
                        } else {
                            mostrarMensaje(3, perfil.etiquetas.lbPlanesActualizadosError);
                        }
                    }
                });
            }
        }
    });
    storelistadoactualizarplanes = new Ext.tree.TreeLoader({
        dataUrl: 'listarplanmodelo',
        preloadChildren: true,
        listeners: {
            beforeload: function(this_, node) {
                this_.baseParams.idesctructura = identidad;
                this_.baseParams.tipo = node.attributes.tipo;
                this_.baseParams.idejercicio = cbEjercicio.getValue();
                Ext.Ajax.timeout = 60000;
            },
            load: function(this_, node, response) {
                response = Ext.decode(response.responseText);
                if (response.length > 0) {
                    obj = response[0];
                    idejercicio = (obj.idejercicio) ? obj.idejercicio : null;
                } else {
                    mostrarMensaje(1, perfil.etiquetas.lbNoExitenPlanes);
                    winActualizarPlanes.close();
                }
            }
        }
    });
    listabasecalculo = new Ext.tree.TreePanel({
        title: perfil.etiquetas.lbListadoPlanes,
        rootVisible: true,
        autoScroll: true,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Grupos',
            tipo: 0,
            ident: -1,
            orden: -1,
            id: '0'
        }),
        loader: storelistadoactualizarplanes,
        tbar: [
            {
                iconCls: 'icon-expand-all',
                tooltip: perfil.etiquetas.ttBtnExpandirEntidades,
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function() {
                    listabasecalculo.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: perfil.etiquetas.ttBtnColapsarEntidades,
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function() {
                    listabasecalculo.root.collapse(true);
                }
            }
        ],
        listeners: {
            checkchange: function(node, checked) {
                node.expand(false, true, function(node_checked) {
                    node_checked.eachChild(function(child_node) {
                        child_node.getUI().toggleCheck(checked);
                    });
                });
                parent_node = node.parentNode;
                check = true;
                if (parent_node.id != 0) {
                    parent_node.eachChild(function(child) {
                        if (child.getUI().isChecked() != checked) {
                            parent_node.getUI().checkbox.checked = false;
                            check = false;
                            return false;
                        }
                        return true;
                    });
                    if (check) {
                        parent_node.getUI().checkbox.checked = checked;
                    }
                }
                if (node.attributes.leaf) {
                    if (checked) {
                        index = Planificacion.find(originals_nodes, node.id);
                        if (index == -1) {
                            added_nodes.push(node.id);
                        } else {
                            Planificacion.remove(deleted_nodes, node.id);
                        }
                    } else {
                        index = Planificacion.find(originals_nodes, node.id);
                        if (index > -1) {
                            deleted_nodes.push(node.id);
                        } else {
                            Planificacion.remove(added_nodes, node.id);
                        }
                    }
                }
            },
            click: function(n) {
                if (n.leaf) {
                    Ext.getCmp('btnAceptaractualizarplanes').enable();
                    Ext.getCmp('btnAplicaractualizarplanes').enable();
                } else {
                    Ext.getCmp('btnAceptaractualizarplanes').disable();
                    Ext.getCmp('btnAplicaractualizarplanes').disable();
                }
            }
        }
    });
    winActualizarPlanes = new Ext.Window({
        title: perfil.etiquetas.lbActualizarPlanes,
        width: 600,
        modal: true,
        constrain: true,
        height: 400,
        layout: 'fit',
        closeAction: 'destroy',
        items: [listabasecalculo],
        buttons: [btnCancelar, btnAplicar, btnAceptar],
        listeners: {
            show: function(_this) {
                _this.items.get(0).getRootNode().expand();
            }
        }
    });
    winActualizarPlanes.show();
}

function habilitaBusqueda(bandera) {
    if (bandera) {
        Ext.getCmp('btnBuscar').enable();
    } else {
        Ext.getCmp('btnBuscar').disable();
    }
}

function setearImporte() {
    importes = [];
    importes.push('0.000'); //indice 0
    importes.push('0.000'); //indice 1 MN
    importes.push('0.000'); //indice 3 IFlete
    importes.push('0.000'); //indice 4 IContingencia
}

function calcularImporteTotal() {
    setearImporte();
    if (stGpGestCalc.getCount() > 0) {
        importes[1] = stGpGestCalc.getAt(0).data.importetotal;
        importes[3] = stGpGestCalc.getAt(0).data.importeparcialflete;
        importes[4] = stGpGestCalc.getAt(0).data.importeparcialconti;
        importes[5] = stGpGestCalc.jsonData.importeajustado;
        importes[6] = stGpGestCalc.jsonData.importefinal;
        tfimportetotal.setValue(importes[cbImportes.getValue()]);
    } else {
        tfimportetotal.setValue(importes[0]);
    }
}

function  pintarIndicDirectos() {
    var backgroundcolor = 'background-color:#FFCCAA';
    var index = 0;
    gpGestCalc.getStore().each(function(record_) {
        if (gpGestCalc.getStore().getAt(index).data.esdirecto) {
            Ext.get(gpGestCalc.getView().getRow(index)).applyStyles(backgroundcolor);
        }
        index++;
    });
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
        callback: function(options, success, response) {
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
function ejecutarBusqueda() {
    gpGestCalc.getStore().reload();
    calcularImporteTotal();
}

function tresdecimalesimportecalculo(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return parseFloat(val).toFixed(3);
}
function tresdecimalesimportecalculo(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return parseFloat(val).toFixed(3);
}
/*nuevo*/
function denominacionmodelo(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val != '-' && val != null)
        return val;
    return perfil.etiquetas.lbPlanNoDefinido;
}

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

function exportar() {
    var win = window.open('exportar?identidad=' + identidadselected
            + '&text=' + trEnt.getNodeById(identidadselected).text
            + '&idejercicio=' + cbEjercicio.getValue()
            + "&is_leaf=" + is_leaf
            + "&idtipocalc=" + ((Ext.getCmp('cbTipoCalc').getValue() == '') ? 1 : Ext.getCmp('cbTipoCalc').getValue())
            + "&glob=" + Ext.getCmp('chkglobalBC').getValue()
            + '&filtros='
            + Ext.encode(filtroscalculos.getFilterData()));
    mascaraExportar(perfil.etiquetas.lbExportandoCals, perfil.etiquetas.lbEsperePorFavor, win);
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function getDenominacion(val, store) {
    if (store.getById(val) == undefined)
        return '-';
    var estcol = store.getById(val).data.denominacion;
    if (estcol != null)
        return estcol;
    return '-';
}

function getDenominacionVariosVal(val, store, tipo) {
    if (val == null)
        return '-';
    var partes = val.split(',');
    var text = '';
    var coma = '';
    //temporal falta desagregar los organos de una misma via
    for (var i = 0; i < partes.length; i++) {
        if (store.getById(partes[i]) != undefined) {
            var estcol = store.getById(partes[i]).data.denominacion;
            if (estcol != null) {
                text += coma + estcol;
                coma = ',';
            }
        } else {
            text += coma + '-';
            coma = ',';
        }
    }
    if (text != '')
        return text;
    return '-';
}

function getBuildStore(url, id1, id2, name1, name2) {
    return new Ext.data.Store({
        url: url,
        id: id1,
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: id2
        },
        [{
                name: name1
            }, {
                name: name2
            }])
    });
}

function actualizarBalance(ppaso) {

    Ext.MessageBox.show({
        title: perfil.etiquetas.lbEspereActualizando,
        width: 325,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        msg: '(' + ppaso + perfil.etiquetas.msgActualizandoBalanceMaterial
    });
    Ext.Ajax.request({
        url: 'actualizarBalance',
        timeout: 7200000, //max 2horas
        params: {
            paso: ppaso,
            idmodelo: idmodelosel,
            identidad: identidadselected,
            idejercicio: idejercicio
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.cod == 3) {
                mostrarMensaje(3, perfil.etiquetas.msgErrorActualizarBalance);
            } else if (ppaso == 1) {
                actualizarBalance(2);
            } else if (ppaso == 2) {
                actualizarBalance(3);
            } else if (responseData.cod == 10) {
                mostrarMensaje(1, perfil.etiquetas.msgActualizadosBalanceyPlan);
            }
        }
    });
}

function getPermisos() {
    Ext.Ajax.request({
        url: 'gestPermisos',
        params: {
            idejercicio: cbEjercicio.getValue()
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData[0]) {

                if (responseData[0].eliminar == 0) {
                    Ext.getCmp('btneliminarcalculos').hide();
                } else {
                    Ext.getCmp('btneliminarcalculos').show();
                }
            } else {
                Ext.getCmp('btneliminarcalculos').hide();
            }
        }
    });
}

function formato_numero(numero, separador_decimal, separador_miles) { // v2007-08-06
    numero = parseFloat(numero);
    if (isNaN(numero)) {
        return "";
    }
// Convertimos el punto en separador_decimal
    numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ",");
    if (separador_miles) {
// Añadimos los separadores de miles
        var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
        while (miles.test(numero)) {
            numero = numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }
    return numero;
}

function siexistecolumFiltrada() {
    if (filtroscalculos.getFiltrosActivos().length > 0 && stGpGestCalc.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
}

function getNamedListener(obj, eventType) {
    var listeners = obj.events[eventType].listeners;
    var funciones = [];
    if (listeners != undefined) {
        for (var i = 0; i < listeners.length; i++) {
            var func = listeners[i].fn;
            funciones.push(func);
        }
    }
    return funciones;
}
