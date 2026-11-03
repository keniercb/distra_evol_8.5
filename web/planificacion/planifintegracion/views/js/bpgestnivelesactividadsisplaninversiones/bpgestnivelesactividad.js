var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('bpgestnivelesactividad', cargarInterfaz);
var winImp, rectora;
var identidadselected = null, identidadEsOD = 0, entidadsel = null, pgactualcompartida = 0, obj, idEstructuraPadre, entidades_productoras, actaprobarajuste, importeIn, is_leaf = false,
        modificacionespendientes, identidadorigen = null, actaprobar, nivelesact, importefinal, aprobarOdesaprobarA = 0, AproDesaAjusteTo = 0, Ajustestodos = 0, identidaddestino = null;
var row = -1, column = -1, ent = 0, fila = 0, pgactual = 0, actajuste = 0, ajustepordesglosar = 0;
var mensajeAprobarDesaprobar = false;
var todosAjustados = false;
pgactual2 = 0;
offset = 0;
cantSelect = 0;
var idaprobacion_sel = null, todos = null;
var columnasdinamicas = [];
objci = {};
objci.acciones = [];
termine_cargar = false;
var press_buscar = false;
var press_configurar = false;
var esrector = false;
var importes = [];
var clickderecho = 0;
var BarraProgreso = new BarraEstado();
var campos_modificados = [];
var winParamsExport = null;
var datosdinamicos = null;
var adicionarrec = 0;
initDesgloses();
var idcolumn = "";
var desgloses_realizados;
//objeto del componente complemetario, en este caso para el cierre
var Cmpcomplementario = new Utilidades.Cmp.CmpBotonesComplementarios({
    elemento: 'nivel'
});
var cbaccionesDWH = Cmpcomplementario.cbacciones;
var valuecol = 0;

function cargarInterfaz() {
    Ext.Ajax.timeout = 1000000000;
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        termine_cargar = true;
        esrector = ((objci.acciones.rector == undefined) ? false : true);
        if (objci.acciones.rector == true) {
            rectora = 1;
        } else {
            rectora = 0;
        }
        if (!esrector) {
            cbaccionesDWH.hide();
        }
    })

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbEspere
    });
    mymask.show();

    filtrosnivelactividad = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'codigo_act_niv_act',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'denmodelo',
                idcombo: 'idcbmodelogestnivactividad',
                urlcb: 'listarModelos',
                idstore: 'idstmodelogestnivactividad',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector, perfil.etiquetas.lbAjuste]
            }, {
                type: 'list',
                dataIndex: 'comportamiento',
                multiple: true,
                options: [perfil.etiquetas.lbPropia, perfil.etiquetas.lbDemandada, perfil.etiquetas.lbCompartida]
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividad'
            }, {
                type: 'listado',
                dataIndex: 'denespecialidad',
                idcombo: 'idcbespecialidad',
                urlcb: 'listarEspecialidades',
                idstore: 'idstespecialidad',
                valueFieldcb: 'idespecialidad',
                displayFieldcb: 'denespecialidad'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadautomatico'
            }, {
                type: 'list',
                dataIndex: 'cantdesglosada',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadmanual'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadproduccion'
            }, {
                type: 'numeric',
                dataIndex: 'ajuste'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'numeric',
                dataIndex: 'restoxdistrib'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadct'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadajuste'
            }, {
                type: 'numeric',
                dataIndex: 'importeajustado'
            }, {
                type: 'numeric',
                dataIndex: 'importefinal'
            }, {
                type: 'numeric',
                dataIndex: 'nivelinversion'
            }, {
                type: 'numeric',
                dataIndex: 'nivelproyecto'
            }]
    });

    /******* Teclas calientes ***************/
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ll',
            alt: true,
            fn: function() {
                seleccBtnLimpiarFiltros();
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function() {
            }
        }, {
            key: 'Qq',
            alt: true,
            ctrl: true,
            fn: function() {
                seleccAprobarTodos();
            }
        }, {
            key: 'Ww',
            alt: true,
            ctrl: true,
            fn: function() {
                seleccDesapTodos();
            }
        }, {
            key: 'Cc',
            alt: true,
            fn: function() {
                copiarNiveles();
            }
        }, {
            key: 'Vv',
            alt: true,
            fn: function() {
                confirmarCopiarPegarNiveles();
            }
        }, {
            key: 'Gg',
            alt: true,
            fn: function() {
                if (validarBtn(Ext.getCmp('btnGuardar'))) {
                    actualizarNivActividad(campos_modificados);
                }
            }
        }, {
            key: 'Ee',
            alt: true,
            fn: function() {
                if (validarBtn(Ext.getCmp('idbtnExportar'))) {
                    exportarNivelesAct();
                }
            }
        }, {
            key: 'Cc',
            ctrl: true,
            fn: function() {
                alert(gpNivActividad.getSelectionModel().getSelected().data.codigo);
            }
        }
    ]);

    function validarBtn(btn) {
        return btn.hidden == false && !btn.disabled
    }

    /******* Fin teclas calientes ***************/
    upColorCell = function() {
        for (var i = 0; i < stNivActividad.getCount(); i++) {
            for (var j = 0; j < cmnivelactividades.getColumnCount(); j++) {
                if (stNivActividad.getAt(i).data.esorigenautomatico == 1) {
                    Ext.get(gpNivActividad.getView().getCell(i, j))
                            .applyStyles('background-color:#FFCCCC');
                }
            }
        }
    };
    upColorCellDesglose = function() {
        for (var i = 0; i < stNivActividad.getCount(); i++) {
            for (var j = 0; j < cmnivelactividades.getColumnCount(); j++) {
                if (stNivActividad.getAt(i).data.cantdesglosada > 0) {
                    Ext.get(gpNivActividad.getView().getCell(i, j)).applyStyles('background-color:#F7FF7B');
                }
            }
        }
    };
    cmnivelactividades = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            tooltip: perfil.etiquetas.lbCodigo,
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            sortable: true,
            width: 300,
            dataIndex: 'denominacion',
            tooltip: perfil.etiquetas.lbDenominacion,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            sortable: true,
            width: 200,
            dataIndex: 'descripcion',
            tooltip: perfil.etiquetas.lbDescripcion,
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEspecialidad,
            tooltip: perfil.etiquetas.lbEspecialidad,
            width: 150,
            sortable: true,
            dataIndex: 'denespecialidad',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbComportamiento,
            tooltip: perfil.etiquetas.lbComportamiento,
            width: 90,
            sortable: true,
            dataIndex: 'comportamiento',
            hidden: true,
            renderer: setComportamiento
        }, {
            header: perfil.etiquetas.lbNivelAutomatico,
            width: 100,
            align: 'right',
            sortable: true,
            dataIndex: 'nivelactividadautomatico',
            tooltip: perfil.etiquetas.lbTtNivelAutomatico,
            renderer: crearToolTip
        }, {
            id: 'columnanivelactividadmanual',
            header: perfil.etiquetas.lbNivelManual,
            align: 'right',
            width: 100,
            tooltip: perfil.etiquetas.lbTtNivelManual,
            renderer: crearToolTip,
            sortable: true,
            dataIndex: 'nivelactividadmanual',
            editor: new Ext.form.NumberField({
                maxLength: 14,
                maxLengthText: perfil.etiquetas.lbMaxRequerido,
                allowNegative: false,
                enableKeyEvents: true,
                listeners: {
                    keypress: function(nf, e) {
                        if (e.getKey() == 100 || e.getKey() == 68)
                            nf.setValue(0);
                    }
                }
            })
        }, {
            id: 'columnanivelactividadproduccion',
            align: 'right',
            header: perfil.etiquetas.lbND,
            width: 100,
            sortable: true,
            dataIndex: 'nivelactividadproduccion',
            tooltip: perfil.etiquetas.lbTtNivDemandado,
            renderer: setNP,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                enableKeyEvents: true,
                listeners: {
                    keypress: function(nf, e) {
                        if (e.getKey() == 100 || e.getKey() == 68)
                            nf.setValue(0);
                    }
                }
            })
        },
        {
            header: perfil.etiquetas.lbNInversion,
            width: 100,
            align: 'right',
            sortable: true,
            dataIndex: 'nivelinversion',
            tooltip: perfil.etiquetas.lbNAInversion,
            renderer: crearToolTip
        },
        {
            header: perfil.etiquetas.lbNproyecto,
            width: 100,
            align: 'right',
            sortable: true,
            dataIndex: 'nivelproyecto',
            tooltip: perfil.etiquetas.lbNAproyecto,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNivelAct,
            align: 'right',
            width: 80,
            sortable: true,
            dataIndex: 'nivelactividad',
            tooltip: perfil.etiquetas.lbNivel,
            renderer: crearToolTip
        }, {
            id: 'columnarestoxdistrib',
            header: perfil.etiquetas.lbRD,
            width: 70,
            sortable: true,
            dataIndex: 'restoxdistrib',
            renderer: crearToolTip,
            align: 'right',
            tooltip: perfil.etiquetas.lbTtColumnaRxD,
            hidden: !esrector
        }, {
            id: 'ajuste',
            header: perfil.etiquetas.lbAjuste,
            width: 70,
            align: 'right',
            sortable: true,
            dataIndex: 'ajuste',
            renderer: crearToolTip,
            tooltip: perfil.etiquetas.lbAjuste,
            enableKeyEvents: true,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                enableKeyEvents: true,
                listeners: {
                    keypress: function(nf, e) {
                        if (e.getKey() == 13) {
                            var nivelact = smNivActividad.getSelected().data.nivelactividad;
                            if (smNivActividad.getSelected().data.idaprobacion == 4 && smNivActividad.getSelected().data.comportamiento != 0 && !esrector
                                    && nivelact > 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
                                cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('ajuste'), true);
                            } else {
                                cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('ajuste'), false);
                            }
                        }
                    }
                }
            })
        }, {
            id: 'columnanivelactividadajuste',
            header: perfil.etiquetas.lbTtColumnaNAAjust,
            width: 80,
            sortable: true,
            align: 'right',
            dataIndex: 'nivelactividadajuste',
            tooltip: perfil.etiquetas.lbTtColumnaNAA,
            hidden: false,
            renderer: function(v, m, record) {
                valuecol = Number(record.data.nivelactividad) + Number(record.data.ajuste);
                m.attr = 'ext:qtip="' + valuecol + '"';
                return valuecol;
            }
        }, {
            header: perfil.etiquetas.lbImporte,
            tooltip: perfil.etiquetas.lbImporte,
            width: 100,
            sortable: true,
            hidden: true,
            dataIndex: 'importe',
            renderer: crearToolTip,
            align: 'right',
            id: 'columnaimporte'
        }, {
            width: 100,
            header: perfil.etiquetas.lbimporteajustado,
            sortable: true,
            align: 'right',
            hidden: true,
            dataIndex: 'importeajustado',
            tooltip: perfil.etiquetas.lbimporteajustado,
            id: 'columnaimporteajustado',
            renderer: setImportA
        }, {
            width: 100,
            header: perfil.etiquetas.lbimportefinal,
            sortable: true,
            align: 'right',
            hidden: true,
            dataIndex: 'importefinal',
            id: 'columnaimportefinal',
            tooltip: perfil.etiquetas.lbimportefinal,
            renderer: setImportF
        }, {
            header: perfil.etiquetas.lbAprobacion,
            sortable: true,
            width: 60,
            align: 'center',
            dataIndex: 'idaprobacion',
            tooltip: perfil.etiquetas.lbAprobacion,
            renderer: modificarAprobacion
        }, {
            width: 120,
            header: perfil.etiquetas.lbPlan,
            sortable: true,
            dataIndex: 'denmodelo',
            tooltip: perfil.etiquetas.lbPlan,
            renderer: setModelo
        }, {
            width: 70,
            header: perfil.etiquetas.lbDesglosada,
            sortable: true,
            dataIndex: 'cantdesglosada',
            tooltip: perfil.etiquetas.lbDesglosada,
            align: 'center',
            renderer: modificarDesglose
        }
    ]);
    cmnivelactividades.defaultSortable = true;

    tfimportetotalnivelactvidad = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotalnivact',
        align: 'right',
        hidden: true,
        width: 95,
        fieldLabel: ' ',
        disabled: false,
        maskRe: /^([]+ ?[]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000'
    });

    stCbImportesNivelesAct = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporte],
            [2, perfil.etiquetas.lbimporteajustado],
            [3, perfil.etiquetas.lbimportefinal]
        ]
    });

    cbImportesNivelesAct = new Ext.form.ComboBox({
        value: 1,
        id: 'idcbImportesNivelesAct',
        store: stCbImportesNivelesAct,
        displayField: 'denominacion',
        typeAhead: true,
        listWidth: 100,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 110,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(cb, record, index) {
                tfimportetotalnivelactvidad.setValue(importes[record.data.idimporte]);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    btnAprob = new Ext.Button({
        id: 'btnAprob1',
        disabled: true,
        iconCls: 'aprobar',
        tooltip: perfil.etiquetas.lbTtBtnAprobar,
        handler: function() {
            todos = false;
            mensajeAprobarDesaprobar = true;
            seleccAprobarNivel();
        }
    });

    btnDesprob = new Ext.Button({
        id: 'btnDesap1',
        iconCls: 'desaprobar',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtBtnDesaprobar,
        handler: function() {
            todos = false;
            mensajeAprobarDesaprobar = false;
            seleccDesaprobarNivel();
        }
    });

    btnDesapAjuste = new Ext.Button({
        id: 'btnDesapAjuste1',
        iconCls: 'icondistra-desaprobar sisplanico-verde',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtBtnDesaprobarAjuste + ' <b>(Alt+W+A)</b>',
        handler: function() {
            aprobarOdesaprobarA = 2;
            todos = false;
            mostrarMensaje(2, perfil.etiquetas.msgSegDesaprobarAjustes, DesaprobarAprobarAjuste);
        }
    });

    btnAsociarObj = new Ext.Button({
        iconCls: 'asociar',
        disabled: true,
        id: 'btnAsociarObjetoGasto',
        tooltip: perfil.etiquetas.lbBtnAsocObjetoGasto,
        hidden: true,
        handler: function() {
            AsociarObjetoGasto();
        }
    });

    btnAsociarRec = new Ext.Button({
        iconCls: 'asociar',
        hidden: true,
        disabled: true,
        tooltip: perfil.etiquetas.lbBtnAsocRecFinanciero,
        id: 'asociarRFinanciero',
        handler: function() {
            recursofinaciero();
        }
    });

    btnVerDetalle = new Ext.Button({
        iconCls: 'ver',
        disabled: true,
        id: 'verdetalle1',
        tooltip: perfil.etiquetas.lbBtnVerDetalles,
        handler: function() {
            verDetalle();
        }
    });

    btnAprobarAjuste = new Ext.Button({
        id: 'btnAprobAjuste1',
        iconCls: 'icondistra-aprobar sisplanico-verde',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtBtnAprobarAjuste + ' <b>(Alt+Q+A)</b>',
        title: perfil.etiquetas.lbTtBtnAprobarAjuste,
        handler: function() {
            aprobarOdesaprobarA = 1;
            todos = false;
            mostrarMensaje(2, perfil.etiquetas.msgSegAprobarAjustes, DesaprobarAprobarAjuste);
        }
    });

    // ********** SelectionModel del Grid Gestionar Actividades ***************
    smNivActividad = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        id: 'smNivActividad'
    });

    smNivActividad.on("rowselect", function(sm, rowIndex, record) {
        fila = rowIndex;
        selecciones = sm.getSelections();
        var activar = false;
        var activarAprobar = false;
        var activarDesaprobar = false;
        for (var i = 0; i < selecciones.length; i++) {
            if (selecciones[i].data.nivelactividad > 0 && identidadEsOD == 1 || (identidadEsOD == 0 && Ext.getCmp('chkglobalNA').getValue() == true)) {
                activar = true;
                if (selecciones[i].data.idaprobacion == 1 && !activarAprobar) {
                    activarAprobar = true;
                } else if (selecciones[i].data.idaprobacion > 1 && !activarDesaprobar) {
                    activarDesaprobar = true;
                }
            }
        }

        if (!activar) {
            Ext.getCmp('btnDesap1').disable();
            Ext.getCmp('btnAprob1').disable();
        }

        if (activarAprobar) {
            Ext.getCmp('btnAprob1').enable();
        } else {
            Ext.getCmp('btnAprob1').disable();
        }

        if (activarDesaprobar) {
            Ext.getCmp('btnDesap1').enable();
        } else {
            Ext.getCmp('btnDesap1').disable();
        }

        if (sm.getSelected().data.idaprobacion > 1 || sm.getSelected().data.cantdesglosada != 0 || identidadEsOD == 0 || Ext.getCmp('chkglobalNA').getValue() == true) {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('nivelactividadmanual'), false);
        } else {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('nivelactividadmanual'), true);
        }
        if (sm.getSelected().data.nivelactividad == 0 || (identidadEsOD == 0 && Ext.getCmp('chkglobalNA').getValue() == false)) {
            Ext.getCmp('btnAprob').disable();
            Ext.getCmp('btnAprobAjuste').disable();
            Ext.getCmp('btnAprobAjuste1').disable();
            Ext.getCmp('btnDesap').disable();
        }
        if (sm.getSelected().data.nivelactividad == 0 || identidadEsOD == 0 || Ext.getCmp('chkglobalNA').getValue() == true) {
            Ext.getCmp('btnAsociarObjetoGasto').disable();
            Ext.getCmp('verdetalle').disable();
            Ext.getCmp('asociarRFinanciero').disable();
            Ext.getCmp('btnDesglosar').disable();
        } else {
            if (sm.getCount() == 1 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false && !esrector) {
                Ext.getCmp('btnDesglosar').enable();
            } else {
                Ext.getCmp('btnDesglosar').disable();
            }
            Ext.getCmp('btnAsociarObjetoGasto').enable();
            Ext.getCmp('verdetalle').enable();
            Ext.getCmp('verdetalle1').enable();
            Ext.getCmp('asociarRFinanciero').enable();
            modificarbotonesaprobar(objci.acciones.rector, sm.getSelected().data.idaprobacion, sm.getSelected().data.idaprobacion);
        }

        HabilitarAjustes();
        HabilitarAprodesa();
        HabilitarDesa();
        var nivelact = smNivActividad.getSelected().data.nivelactividad;
        if (sm.getSelected().data.idaprobacion == 4 && sm.getSelected().data.comportamiento != 0 && !esrector && nivelact > 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('ajuste'), true);
        } else {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('ajuste'), false);
        }
        if (sm.getSelected().data.idaprobacion == 4 || sm.getSelected().data.idaprobacion == 5 || esrector || identidadEsOD == 0 || Ext.getCmp('chkglobalNA').getValue() == true) {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('nivelactividadmanual'), false);
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('nivelactividadproduccion'), false);
        } else {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('nivelactividadmanual'), true);
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('nivelactividadproduccion'), true);
        }
    });

    jrstNivActividad = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data'
    }, [{
            name: 'idactividad'
        }, {
            name: 'identidad'
        }, {
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }, {
            name: 'codigo'
        }, {
            name: 'denespecialidad'
        }, {
            name: 'comportamiento'
        }, {
            name: 'idactividadentidad'
        }, {
            name: 'nivelactividad'
        }, {
            name: 'importe'
        }, {
            name: 'nivelactividadautomatico'
        }, {
            name: 'nivelactividadmanual'
        }, {
            name: 'nivelactividadproduccion'
        }, {
            name: 'nivelactividadct'
        }, {
            name: 'esorigenautomatico'
        }, {
            name: 'importe_total_paginado'
        }, {
            name: 'sololectura'
        }, {
            name: 'ajuste'
        }, {
            name: 'idaprobacion'
        }, {
            name: 'denmodelo'
        }, {
            name: 'idmodelo'
        }, {
            name: 'restoxdistrib'
        }, {
            name: 'version_manual'
        }, {
            name: 'existe_demanda'
        }, {
            name: 'importeajustado'
        }, {
            name: 'importefinal'
        }, {
            name: 'cantdesglosada'
        }, {
            name: 'nivelinversion'
        }, {
            name: 'nivelproyecto'
        }
    ]);

    smNivActividad.on("rowdeselect", function(sm, rowIndex, record) {
        if (sm.getSelections().length == 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false && !esrector) {
            Ext.getCmp('btnAjustar').enable();
        }
        selecciones = sm.getSelections();
        var activar = false;
        var activarAprobar = false;
        var activarDesaprobar = false;
        for (var i = 0; i < selecciones.length; i++) {
            if (selecciones[i].data.nivelactividad > 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
                activar = true;
                if (selecciones[i].data.idaprobacion == 1 && !activarAprobar) {
                    activarAprobar = true;
                } else if (selecciones[i].data.idaprobacion > 1 && !activarDesaprobar) {
                    activarDesaprobar = true;
                }
            }
        }
        if (!activar) {
            Ext.getCmp('btnDesap1').disable();
            Ext.getCmp('btnAprob1').disable();
        }
        if (activarAprobar) {
            Ext.getCmp('btnAprob1').enable();
        } else {
            Ext.getCmp('btnAprob1').disable();
        }
        if (activarDesaprobar) {
            Ext.getCmp('btnDesap1').enable();
        } else {
            Ext.getCmp('btnDesap1').disable();
        }
    })

    // Store de nivel de actividad
    stNivActividad = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarActsNivAct',
        listeners: {
            beforeload: function() {
                cambiarTituloFiltrarNiveles();
                //columnas bajo demanda
                if (cmnivelactividades.getColumnById('columnaimportefinal').hidden) {
                    cbImportesNivelesAct.hide();
                    Ext.getCmp('importetotalnivact').hide();
                } else {
                    cbImportesNivelesAct.show();
                    Ext.getCmp('importetotalnivact').show();
                }

                if (cmnivelactividades.getColumnById('columnaimporte').hidden) {
                    cbImportesNivelesAct.hide();
                    Ext.getCmp('importetotalnivact').hide();
                } else {
                    cbImportesNivelesAct.show();
                    Ext.getCmp('importetotalnivact').show();
                }

                if (cmnivelactividades.getColumnById('columnaimporteajustado').hidden) {
                    cbImportesNivelesAct.hide();
                    Ext.getCmp('importetotalnivact').hide();
                } else {
                    cbImportesNivelesAct.show();
                    Ext.getCmp('importetotalnivact').show();
                }

                if (identidadselected != "Estructuras") {
                    stNivActividad.baseParams.identidad = identidadselected;
                } else
                    stNivActividad.baseParams.identidad = 0;

                stNivActividad.baseParams.denominacion = Ext.getCmp('tfdenominacionnivel').getValue();
                stNivActividad.baseParams.codigo = Ext.getCmp('tfcodigo').getValue();

                stNivActividad.baseParams.is_leaf = is_leaf;
                stNivActividad.baseParams.glob = Ext.getCmp('chkglobalNA').getValue();
                stNivActividad.baseParams.limit = Ext.getCmp('paginadoniveles').cbPageSize.getValue();
                stNivActividad.baseParams.start = offset;

                stNivActividad.baseParams.calcularimporte = (!cmnivelactividades.getColumnById('columnaimportefinal').hidden
                        || !cmnivelactividades.getColumnById('columnaimporte').hidden
                        || !cmnivelactividades.getColumnById('columnaimporteajustado').hidden);

                stNivActividad.baseParams.esrector = ((objci.acciones.rector == undefined) ? null : true);
                stNivActividad.baseParams.idEstructuraPadre = idEstructuraPadre;
                stNivActividad.baseParams.idejercicio = cbEjercicio.getValue();
                stNivActividad.baseParams.calcularrestoxdistrib = !cmnivelactividades.getColumnById('columnarestoxdistrib').hidden;
                Ext.Ajax.timeout = 7200000;
            },
            load: function(st, rec, obj) {
                todosAjustados = false;
                campos_modificados = [];
                upColorCell();
                upColorCellDesglose();
                calcularImporteTotal();
                if (stNivActividad.getCount() > 0) {
                    Ext.getCmp('idbtnExportar').enable();
                } else {
                    Ext.getCmp('idbtnExportar').disable();
                }
                if ((press_buscar || esta_buscando) && stNivActividad.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                    press_buscar = false;
                }
                if (st.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgEntidadNoTieneEspecialidadAsoc);
                } else
                if (st.data.items[0].data.idactividadentidad == -1) {
                    mostrarMensaje(1, perfil.etiquetas.msgEntidadNoEsOD);
                }
                datosStore = st.data.items;
                for (var i = 0; i < datosStore.length; i++) {
                    if (datosStore[i].data.idaprobacion == 5) {
                        todosAjustados = true;
                    } else {
                        todosAjustados = false;
                        break;
                    }
                }
            }
        },
        reader: jrstNivActividad
    });

    stCbPaginado = new Ext.data.SimpleStore({
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
    });

    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    cbPaginado = new Ext.form.ComboBox({
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
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginadoniveles').pageSize = record.data.idnumpag;
                Ext.getCmp('paginadoniveles').doLoad(Ext.getCmp('paginadoniveles').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardarCambio,
        disabled: false,
        handler: function() {
            mymask.show();
            actualizarNivActividad(campos_modificados);
        }
    });

    btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function() {
            seleccBtnLimpiarFiltros();
        }
    });

    // ************ GRID Niveles de actividad *********************
    gpNivActividad = new Ext.grid.EditorGridPanel(
            {
                frame: true,
                title: perfil.etiquetas.lbNivelActividad,
                store: stNivActividad,
                plugins: filtrosnivelactividad,
                enableKeyEvents: true,
                columnsByDemand: true,
                cm: cmnivelactividades,
                clicksToEdit: 2,
                region: 'center',
                autoWidth: true,
                autoScroll: true,
                autoHeigth: true,
                sm: smNivActividad,
                loadMask: {
                    msg: perfil.etiquetas.lbEspere
                },
                md: new Ext.menu.Menu({
                    id: 'menunivelesact',
                    items: [{
                            id: 'btnAprob',
                            itemCls: 'x-menu-item icondistra-aprobar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnAprobar,
                            handler: function() {
                                todos = false;
                                seleccAprobarNivel();
                            }
                        }, {
                            id: 'btnDesap',
                            itemCls: 'x-menu-item icondistra-desaprobar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbBtnDesaprobar,
                            handler: function() {
                                todos = false;
                                seleccDesaprobarNivel();
                            }
                        }, {
                            text: perfil.etiquetas.lbBtnAsocObjetoGasto,
                            itemCls: 'x-menu-item icondistra-asociar',
                            iconCls: 'imagen-none',
                            id: 'btnAsociarObjetoGasto',
                            handler: function() {
                                AsociarObjetoGasto();
                            }
                        }, {
                            text: perfil.etiquetas.lbBtnAsocRecFinanciero,
                            itemCls: 'x-menu-item icondistra-asociar',
                            iconCls: 'imagen-none',
                            id: 'asociarRFinanciero',
                            handler: function() {
                                recursofinaciero();
                            }
                        }, {
                            text: perfil.etiquetas.lbVerDetalles,
                            itemCls: 'x-menu-item icondistra-ver',
                            iconCls: 'imagen-none',
                            id: 'verdetalle',
                            handler: function() {
                                verDetalle();
                            }
                        }, {
                            id: 'btnAprobAjuste',
                            itemCls: 'x-menu-item icondistra-aprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbTtBtnAprobarAjuste,
                            handler: function() {
                                aprobarOdesaprobarA = 1,
                                        todos = false;
                                mostrarMensaje(2, perfil.etiquetas.msgSegAprobarAjustes, DesaprobarAprobarAjuste);
                            }
                        }, {
                            id: 'btnDesapAjuste',
                            itemCls: 'x-menu-item icondistra-desaprobar sisplanico-verde',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbTtBtnDesaprobarAjuste,
                            handler: function() {
                                aprobarOdesaprobarA = 2,
                                        todos = false;
                                mostrarMensaje(2, perfil.etiquetas.msgSegDesaprobarAjustes, DesaprobarAprobarAjuste);
                            }
                        }, {
                            id: 'btnAjuste',
                            itemCls: 'x-menu-item icondistra-ajustar icon',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbAjustar,
                            handler: function() {
                                CargarImporteinicial();
                            }
                        }, {
                            id: 'btnDesglosar',
                            itemCls: 'x-menu-item icondistra-desglose icon',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbDesglosar,
                            disabled: true,
                            handler: function() {
                                cargarDatos();
                                gridCentral.expand();
                                btnAdicionarDesglose.enable();
                                paginadoact1.enable();
                            }
                        }, {
                            text: perfil.etiquetas.lbVerCalculos,
                            itemCls: 'x-menu-item icondistra-ver',
                            iconCls: 'imagen-none',
                            id: 'vercalculos',
                            handler: function() {
                                exportarCalculoNivelesAct();
                            }
                        }]
                }),
                listeners: {
                    click: function(n) {
                        if (gpNivActividad.getSelectionModel().getSelected() != undefined) {
                            btnAdicionarDesglose.disable();
                            paginadoact1.disable();
                            if (gpNivActividad.getSelectionModel().getSelected().data.cantdesglosada != 0 && !esrector && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
                                cargarDatos();
                                btnAdicionarDesglose.enable();
                            }
                            if (gpNivActividad.getSelectionModel().getSelected().data.cantdesglosada != 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
                                gridCentral.expand();
                                cargarDatos();
                            } else {
                                gridCentral.collapse();
                            }
                        }
                    },
                    rowcontextmenu: function(g, r, e) {
                        e.stopEvent();
                        g.getSelectionModel().selectRow(r);
                        g.md.showAt(e.getXY());
                    },
                    afteredit: function(sm) {
                        if (sm.field == 'ajuste') {
                            var nivelact = smNivActividad.getSelected().data.nivelactividad;
                            if (sm.record.data.idaprobacion == 4 && sm.record.data.comportamiento != 0 && !esrector && nivelact > 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
                                cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('ajuste'), true);
                            } else {
                                cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('ajuste'), false);
                                smNivActividad.getSelected().data.ajuste = sm.originalValue;
                            }
                        }
                        if (sm.field == 'nivelactividadmanual') {
                            if (sm.record.data.idaprobacion != 1) {
                                smNivActividad.getSelected().data.nivelactividadmanual = sm.originalValue;
                            }
                        }
                        if ((sm.record.data.nivelactividadmanual + '').length >= 15) {
                            mostrarMensaje(1, perfil.etiquetas.lbMaxRequerido);
                            if (sm.field == 'nivelactividadmanual') {
                                smNivActividad.getSelected().data.nivelactividadmanual = sm.originalValue;
                            } else if (sm.field == 'nivelactividadproduccion') {
                                smNivActividad.getSelected().data.nivelactividadproduccion = sm.originalValue;
                            }
                            smNivActividad.getSelected().commit();
                            return;
                        }
                        campos_modificados.push({
                            idactividadentidad: sm.record.data.idactividadentidad,
                            nivelactividadmanual: sm.record.data.nivelactividadmanual,
                            nivelactividadproduccion: sm.record.data.nivelactividadproduccion,
                            ajuste: sm.record.data.ajuste,
                            identidad: sm.record.data.identidad,
                            idactividad: sm.record.data.idactividad,
                            version_manual: sm.record.data.version_manual,
                            existe_demanda: (sm.record.data.existe_demanda == null) ? false : true,
                            campo_modif: sm.field
                        });
                        Ext.getCmp('btnGuardar').enable();
                    },
                    validateedit: function(e) {
                        campo = e.field;
                        valor = e.value;
                        ValidarOperacion(campo, valor, e);
                    },
                    keypress: function(e) {
                        if (e.altKey) {
                            if ((e.getKey() == 81 || e.getKey() == (81 + 32)) && validarBtn(Ext.getCmp('btnAprob'))) { //A a  Aprobar actividad
                                seleccAprobarNivel();
                            } else if ((e.getKey() == 87 || e.getKey() == (87 + 32)) && validarBtn(Ext.getCmp('btnDesap'))) { // D d  Desaprobar actividad
                                seleccDesaprobarNivel();
                            }
                        }
                    },
                },
                bbar: new Ext.PagingToolbar({
                    id: 'paginadoniveles',
                    store: stNivActividad,
                    displayInfo: true,
                    items: ['-', btnLimpiarFiltros, '-', cbImportesNivelesAct, tfimportetotalnivelactvidad],
                    listeners: {
                        beforechange: function(p, e) {
                            offset = e.start;
                        }
                    }
                })
            });

    smGpActividadDesglose = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(sm, rowIndex, record) {
                if (objci.acciones.rector == undefined) {
                    btnEliminarDesglose.enable();
                } else {
                    btnEliminarDesglose.disable();
                }
            },
            rowdeselect: function(sm, rowIndex, record) {
                btnEliminarDesglose.disable();
            }
        }
    });

    cmGpActividadDesglose = new Ext.grid.ColumnModel({
        columns: [{
                header: perfil.etiquetas.lbNivel2,
                dataIndex: 'nivelactividad',
                id: 'expandir',
                tooltip: perfil.etiquetas.lbNivel,
                renderer: crearToolTip,
                editor: new Ext.form.NumberField({
                    allowNegative: false
                })
            }
        ]
    });

    filtrosdesglose_niv_act = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'list',
                dataIndex: 'comportamiento',
                options: [perfil.etiquetas.lbPropia,
                    perfil.etiquetas.lbDemandada,
                    perfil.etiquetas.lbCompartida]
            }]
    });
    denominacionDesglose = new Ext.form.TextField({
        xtype: 'textfield',
        id: 'denominacionDesglose',
        fieldLabel: perfil.etiquetas.lbDenominacion,
        anchor: '100%',
        regex: /^\S+/,
        maskRe: /^([a-zA-ZáéíóúñüÑ\-\ \:\/\,\_\-\.\d]+ ?[a-zA-ZáéíóúñüÑ\-\:\/\,\_\-\.\d]*)+$/,
        allowBlank: false,
        blankText: perfil.etiquetas.lbRequerido
    });
    descripcionDesglose = new Ext.form.TextArea({
        xtype: 'textarea',
        id: 'descripcionDesglose',
        anchor: '100%',
        fieldLabel: perfil.etiquetas.lbDescripcion
    });
    btnDelDesglose = new Ext.Button({
        id: 'btnDelDesglose',
        iconCls: 'eliminar',
        disabled: true,
        tooltip: perfil.etiquetas.lbEliminarDesglose + ' <b>(DEL)</b>',
        text: perfil.etiquetas.lbEliminar,
        handler: function() {
            eliminarVariosDesgloses();
        }
    });
    btnSiguiente = new Ext.Button({
        disabled: true,
        id: 'btnsiguiente',
        style: 'margin-left:18px;margin-top:90px',
        iconCls: 'siguiente',
        handler: function() {
            addnomenclador();
        }
    });
    btnAnterior = new Ext.Button({
        disabled: true,
        id: 'btnAnterior',
        style: 'margin-left:18px;margin-top:50px',
        iconCls: 'anterior',
        handler: function() {
            eliminarnom();
        }
    });
    btnSubir = new Ext.Button({
        disabled: true,
        id: 'btnSubir',
        style: 'margin-left:18px;margin-top:90px',
        iconCls: 'arriba',
        handler: function() {
            Ordenar('up');
        }
    });
    btnBajar = new Ext.Button({
        disabled: true,
        id: 'btnBajar',
        style: 'margin-left:18px;margin-top:50px',
        iconCls: 'abajo',
        handler: function() {
            Ordenar('down');
        }
    });
    cmNomencladores = new Ext.grid.ColumnModel([{
            width: 50,
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true
        }, {
            width: 100,
            header: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            hidden: true
        }]);

    smNomencladores = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    smNomencladores.on('selectionchange', function(sm) {
        btnDelDesglose.enable();
        if (smNomencladores.getSelected()) {
            btnSiguiente.enable();
        } else {
            btnSiguiente.disable();
        }
    });
    stNomen = new Ext.data.Store({
        url: 'listarTipoNomenclador',
        enableKeyEvents: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idtiponomenclador'
        }, [{
                name: 'idtiponomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }])
    });

    gpNomencladores = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        title: perfil.etiquetas.lbNomencladores,
        id: 'stNomencladoresUsados',
        store: stNomen,
        sm: smNomencladores,
        cm: cmNomencladores,
        region: 'east',
        autoExpandColumn: 'expandir',
        height: 295,
        width: 100,
        margins: '2 2 2 2',
        anchor: '100%',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stNomen,
            displayInfo: true
        })
    });

    cmNomencladoresUsados = new Ext.grid.ColumnModel([{
            width: 50,
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true
        }, {
            width: 50,
            header: perfil.etiquetas.lbOrden,
            sortable: true,
            dataIndex: 'orden'
        }]);

    smNomencladoresUsados = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    smNomencladoresUsados.on('selectionchange', function(sm) {
        if (smNomencladoresUsados.getSelected()) {
            btnSubir.enable();
            btnBajar.enable();
            btnAnterior.enable();
        } else {
            btnSubir.disable();
            btnBajar.disable();
            btnAnterior.disable();
        }
    });
    stNomencladoresUsados = new Ext.data.Store({
        enableKeyEvents: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idtiponomenclador'
        }, [{
                name: 'idtiponomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'orden'
            }])
    });

    gpNomencladoresUsados = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        title: perfil.etiquetas.lbNomencladoresUsados,
        id: 'gpNomencladoresUsados',
        store: stNomencladoresUsados,
        sm: smNomencladoresUsados,
        cm: cmNomencladoresUsados,
        region: 'east',
        autoExpandColumn: 'expandir',
        height: 310,
        width: 100,
        margins: '2 2 2 2',
        anchor: '100%'
    });
    pAddDesgloseNomencladores = new Ext.Panel({
        id: 'pAddDesgloseNomencladores',
        labelAlign: 'top',
        height: 320,
        width: 805,
        frame: true,
        anchor: '100%',
        layout: 'form',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .40,
                        layout: 'form',
                        items: [gpNomencladores]
                    }, {
                        columnWidth: .10,
                        layout: 'form',
                        items: [btnSiguiente, btnAnterior],
                        anchor: '100%'
                    }, {
                        columnWidth: .40,
                        layout: 'form',
                        items: [gpNomencladoresUsados]
                    }, {
                        columnWidth: .10,
                        layout: 'form',
                        items: [btnSubir, btnBajar],
                        anchor: '100%'
                    }]
            }]
    });
    pAddDesgloseNorte = new Ext.FormPanel({
        id: 'pAddDesgloseNorte',
        labelAlign: 'top',
        height: 470,
        width: 920,
        frame: true,
        layout: 'form',
        items: [denominacionDesglose, descripcionDesglose, pAddDesgloseNomencladores]
    });
    winAddDesglose = new Ext.Window({
        modal: true,
        id: 'winAddDesglose',
        closeAction: 'hide',
        constrain: true,
        layout: 'fit',
        width: 893,
        height: 515,
        items: [pAddDesgloseNorte],
        title: perfil.etiquetas.lbAdicionarDesglose,
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function() {
                    winAddDesglose.hide();
                }
            }, {
                iconCls: 'aplicar',
                text: perfil.etiquetas.lbAplicar,
                tooltip: perfil.etiquetas.lbGuardarYLimpiar,
                handler: function() {
                    adicionarDesglose(true);
                }
            }, {
                iconCls: 'aceptar',
                id: 'btnaceptar1',
                text: perfil.etiquetas.lbAceptar,
                tooltip: perfil.etiquetas.lbGuardarYCerrar,
                handler: function() {
                    adicionarDesglose();
                }
            }]
    });
    Fila = Ext.data.Record.create([{
            name: 'idtiponomenclador',
            type: 'string'
        }, {
            name: 'denominacion',
            type: 'string'
        }, {
            name: 'descripcion',
            type: 'string'
        }, {
            name: 'orden',
            type: 'string'
        }]);
    btnAddDesglose = new Ext.Button({
        id: 'btnAddDesglose',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.lbAdicionarDesglose,
        text: perfil.etiquetas.lbBtnAdicionar,
        handler: function() {
            winAddDesglose.show();
        }
    });

    cmConfDesglose = new Ext.grid.ColumnModel([{
            width: 250,
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true
        }, {
            width: 120,
            header: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion'
        }]);

    smConfDesglose = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    smConfDesglose.on('selectionchange', function(sm) {
        btnDelDesglose.enable();
    });
    stConfDesglose = new Ext.data.Store({
        url: 'listarConfigDesglose',
        enableKeyEvents: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddesglose'
        }, [{
                name: 'iddesglose'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }])
    });
    gpConfDesglose = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        title: perfil.etiquetas.lbDesgloses,
        id: 'gpConfDesglose',
        store: stConfDesglose,
        sm: smConfDesglose,
        cm: cmConfDesglose,
        region: 'west',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        height: 425,
        width: 450,
        margins: '2 2 2 2',
        anchor: '95%',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stConfDesglose,
            displayInfo: true
        })
    });

    cmConfNomencladores = new Ext.grid.ColumnModel([{
            width: 250,
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true
        }, {
            width: 120,
            header: perfil.etiquetas.lbOrden,
            sortable: true,
            dataIndex: 'orden'
        }, {
            width: 120,
            header: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            hidden: true
        }]);

    smConfNomencladores = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    stConfNomencladores = new Ext.data.Store({
        url: 'listarDatosNomConfigDesglose',
        enableKeyEvents: true,
        listeners: {
            beforeload: function() {
                limit = 20;
                start = 0;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idtiponomenclador'
        }, [{
                name: 'idtiponomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'orden'
            }])
    });

    gpConfNomencladores = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        title: perfil.etiquetas.lbNomencladores,
        id: 'gpConfNomencladores',
        store: stConfNomencladores,
        sm: smConfNomencladores,
        cm: cmConfNomencladores,
        region: 'center',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        height: 425,
        width: 450,
        margins: '2 2 2 2',
        anchor: '100%',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stConfNomencladores,
            displayInfo: true
        })
    });
    pGestDesglose = new Ext.Panel({
        id: 'pGestDesglose',
        height: 450,
        width: 880,
        layout: 'border',
        tbar: [btnAddDesglose, btnDelDesglose],
        items: [gpConfNomencladores, gpConfDesglose]
    });
    winConfDesglose = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        items: pGestDesglose,
        constrain: true,
        width: 893,
        height: 515,
        title: perfil.etiquetas.lbConfiguracionDesglose,
        buttons: [{
                iconCls: 'cancelar',
                text: perfil.etiquetas.lbCerrar,
                handler: function() {
                    winConfDesglose.hide();
                }
            }],
        listeners: {
            beforehide: function() {
                press_configurar = false;
            }
        }
    });

    stGpActividadDesglose = new Ext.data.Store({
        url: 'listarDesgloseNivelesActividad',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data",
            id: 'idactividadentidad'
        }, [{
                name: 'nivelactividad'
            }]),
        listeners: {
            beforeload: function() {
                stGpActividadDesglose.baseParams.idactividad = gpNivActividad.getSelectionModel().getSelected().data.idactividad;
                stGpActividadDesglose.baseParams.identidad = identidadselected;
                stGpActividadDesglose.baseParams.idejercicio = cbEjercicio.getValue();
            },
            load: function() {
                btnGuardarDesglose.disable();
                Ext.getCmp('btnEliminarDesglose').disable();
            }
        }
    });
    btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar
    });
    btnAdicionarDesglose = new Ext.Button({
        id: 'btnAdicionarDesglose',
        iconCls: 'adicionar',
        disabled: true,
        tooltip: perfil.etiquetas.lbAdicionarDesglose,
        handler: function() {
            adicionarDesglose(datosdinamicos);
        }
    });
    btnEliminarDesglose = new Ext.Button({
        disabled: true,
        id: 'btnEliminarDesglose',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminarDesglose,
        handler: function() {
            eliminarDesglose();
        }
    });
    btnGuardarDesglose = new Ext.Button({
        disabled: true,
        id: 'btnGuardarDesglose',
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardarDesglose,
        handler: function() {
            desglosar();
        }
    });
    paginadoact1 = new Ext.PagingToolbar({
        id: 'paginadoact1',
        pageSize: 20,
        disabled: true,
        store: stGpActividadDesglose,
        displayInfo: true,
        items: ['-', btnLimpiarFiltros]
    });

    gridCentral = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.lbDesgloseActividades,
        frame: true,
        id: 'gridCentral',
        region: 'south',
        split: true,
        store: stGpActividadDesglose,
        plugins: filtrosdesglose_niv_act,
        autoScroll: true,
        clicksToEdit: 2,
        height: 300,
        autoWidth: true,
        collapsible: true,
        collapsed: true,
        sm: smGpActividadDesglose,
        cm: cmGpActividadDesglose,
        md: new Ext.menu.Menu({
            id: 'menunivelesact',
            items: [{
                    id: 'btnElmfila',
                    itemCls: 'x-menu-intem icondistra-eliminar',
                    iconCls: 'imagen-none',
                    text: perfil.etiquetas.lbEliminarFila,
                    handler: function() {
                        stGpActividadDesglose.remove(smGpActividadDesglose.getSelected());
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            },
            afteredit: function() {
                btnGuardarDesglose.enable();
            }
        },
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [btnAdicionarDesglose, '-', btnEliminarDesglose, '-', btnGuardarDesglose],
        bbar: paginadoact1
    });

    function seleccAprobarNivel() {
        todo = false;
        if (objci.acciones.rector == undefined) {
            idaprobacion_sel = 3;
        } else {
            idaprobacion_sel = 4;
        }
        cambiarAprobacion(3);
    }

    function seleccDesaprobarNivel() {
        todo = false;
        idaprobacion_sel = 1;
        cambiarAprobacion(1);
    }

    function seleccBtnLimpiarFiltros() {
        Ext.getCmp('btnCopiarNiveles').enable();
        Ext.getCmp('btnPegarNiveles').disable();
        identidadorigen = null;
        identidaddestino = null;
        press_buscar = false;
        btnBuscar.disable();
        Ext.getCmp('tfcodigo').reset();
        Ext.getCmp('tfdenominacionnivel').reset();
        filtrosnivelactividad.clearFilters();
        stNivActividad.reload();
        Ext.getCmp('idfiltroent').setValue(null);
        idRootNode = null;
    }

    btnExportar = new Ext.Button({
        disabled: true,
        id: 'idbtnExportar',
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbTtExportar,
        prevTab: 'idfiltroent',
        handler: function() {
            exportarNivelesAct();
        }
    });

    btnImportar = new Ext.Button({
        disabled: false,
        id: 'btnImportarNivelActividad',
        iconCls: 'importar',
        tooltip: perfil.etiquetas.lbTtImportar,
        handler: function() {
            winFp();
        }
    });
    // *********Ayuda****************
    btnAyu = new Ext.Button({
        disabled: false,
        id: 'btnAyudaNivelesActividad',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda
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
        items: [{
                id: 'btnAprobarTodo',
                itemCls: 'x-menu-item icondistra-aprobar',
                iconCls: 'imagen-none',
                disabled: false,
                text: perfil.etiquetas.lbBtnAprobarTodos,
                handler: function() {
                    todos = true;
                    seleccAprobarTodos();
                }
            }, {
                id: 'btnDesaprobarTodo',
                itemCls: 'x-menu-item icondistra-desaprobar',
                iconCls: 'imagen-none',
                disabled: false,
                text: perfil.etiquetas.lbBtnDesapTodos,
                handler: function() {
                    todos = true;
                    seleccDesapTodos()
                }
            }, {
                id: 'btnCopiarNiveles',
                itemCls: 'x-menu-item icondistra-copiar',
                iconCls: 'imagen-none',
                disabled: false,
                text: perfil.etiquetas.lbBtnCopiarNiveles,
                handler: function() {
                    copiarNiveles();
                }
            }, {
                id: 'btnPegarNiveles',
                itemCls: 'x-menu-item icondistra-pegar',
                iconCls: 'imagen-none',
                disabled: true,
                text: perfil.etiquetas.lbBtnPegarNiveles,
                handler: function() {
                    confirmarCopiarPegarNiveles();
                }
            }, {
                id: 'btnAprobarToAjustes',
                itemCls: 'x-menu-item icondistra-aprobar sisplanico-verde',
                iconCls: 'imagen-none',
                text: perfil.etiquetas.lbTtBtnAprobarTodosAjuste,
                handler: function() {
                    todos = true;
                    AproDesaAjusteTo = 1;
                    mostrarMensaje(2, perfil.etiquetas.msgSegAprobarAjustes, DesaprobarAprobarAjuste);
                }
            }, {
                id: 'btnDesaprobarToAjustes',
                itemCls: 'x-menu-item icondistra-desaprobar sisplanico-verde',
                iconCls: 'imagen-none',
                text: perfil.etiquetas.lbTtBtnDesaprobarTodosAjuste,
                handler: function() {
                    todos = true;
                    AproDesaAjusteTo = 2;
                    mostrarMensaje(2, perfil.etiquetas.msgSegDesaprobarAjustes, DesaprobarAprobarAjuste);
                }
            }
        ]
    });

    trEnt.addListener('contextmenu', function(node, e)
    {
        identidadselected = node.id;
        entidadsel = node;
        denomentidadselected = node.text;
        idEstructuraPadre = node.attributes.idEstructuraPadre;
        entidades_productoras = node.attributes.entidades_productoras;
        todos = true;
        is_leaf = node.leaf;
        //Determinando si es od
        if (identidadselected != "Estructuras") {
            ent = identidadselected;
            btnGraficoPlanif.enable();
            btnGraficas.actualizarParametros(node, 'NA');
        } else {
            ent.identidad = 0;
            btnGraficoPlanif.disable();
        }
        Ext.Ajax.request({
            url: 'entidadOD',
            params: {
                identidad: ent
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                identidadEsOD = responseData;
                controladorDeAcionesDerecha();
                if (Ext.getCmp('chkglobalNA').getValue() == false && identidadEsOD == 1) {
                    contextMenu.showAt(e.getXY());
                }
            }
        });
    });

    trEnt.addListener('click', function(n) {
        if (n.text != "Estructuras") {
            btnExportar.enable();
            btnImportar.enable();
            btnGuardar.enable();
            cbaccionesDWH.enable();
            cbEjercicio.enable();
            btnAprob.enable();
            btnDesprob.enable();
            btnAprobarAjuste.enable();
            btnDesapAjuste.enable();
            btnAsociarObj.enable();
            btnAsociarRec.enable();
            btnVerDetalle.enable();
            btnGraficoPlanif.enable();
            Ext.getCmp('chkglobalNA').enable();
            gpNivActividad.enable();
            Ext.getCmp('btnAjustar').disable();
            gridCentral.collapse();
            smNivActividad.clearSelections();
            trEnt.getSelectionModel().select(n);
            identidadselected = n.id;
            entidadsel = n;
            denomentidadselected = n.text;
            idEstructuraPadre = n.attributes.idEstructuraPadre;
            entidades_productoras = n.attributes.entidades_productoras;
            is_leaf = n.leaf;
            if (identidadselected != "Estructuras") {
                ent = identidadselected;
                btnGraficoPlanif.enable();
                btnGraficas.actualizarParametros(n, 'NA');
            } else {
                ent.identidad = 0;
                btnGraficoPlanif.disable();
            }
            Ext.Ajax.request({
                url: 'entidadOD',
                params: {
                    identidad: ent
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    identidadEsOD = responseData;
                    controladorDeAciones();
                }
            });
        } else {
            gpNivActividad.disable();//myView
            var store = gpNivActividad.getStore();
            store.removeAll();
            btnExportar.disable();
            btnImportar.disable();
            btnGuardar.disable();
            cbaccionesDWH.disable();
            cbEjercicio.disable();
            btnAprob.disable();
            btnDesprob.disable();
            btnAprobarAjuste.disable();
            btnDesapAjuste.disable();
            btnAsociarObj.disable();
            btnAsociarRec.disable();
            btnVerDetalle.disable();
            btnGraficoPlanif.disable();
            Ext.getCmp('chkglobalNA').disable();
        }

    });


    fpbuscar = new Ext.FormPanel({
        id: 'idFpBuscar',
        labelAlign: 'top',
        region: 'center',
        width: 600,
        frame: true,
        fileUpload: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                xtype: 'fileuploadfield',
                regex: /^.+\.(xls|xlsx)$/i,
                fieldLabel: perfil.etiquetas.lbCargarDocumento,
                name: 'file',
                id: 'form-file',
                prevTab: 'idBtnAceptarImp',
                emptyText: perfil.etiquetas.lbSeleccioneArchivo,
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

    function winFp() {
        if (!winImp) {
            winImp = new Ext.Window({
                modal: true,
                closeAction: 'hide',
                constrain: true,
                layout: 'fit',
                title: perfil.etiquetas.lbImportarExcel,
                width: 400,
                height: 150,
                buttons: [{
                        iconCls: 'cancelar',
                        text: perfil.etiquetas.lbCancelar,
                        tooltip: perfil.etiquetas.lbCerrarSinGuardar,
                        handler: function() {
                            winImp.hide();
                        }
                    }, {
                        iconCls: 'aceptar',
                        text: perfil.etiquetas.lbAceptar,
                        tooltip: perfil.etiquetas.lbGuardarYCerrar,
                        id: 'idBtnAceptarImp',
                        nextTab: 'fileUpload',
                        handler: function() {
                            importarNivelesActividad();
                        }
                    }]
            });
        }
        Ext.getCmp('idFpBuscar').getForm().reset();
        winImp.show();
        winImp.add(fpbuscar);
        winImp.doLayout();
    }

    function importarNivelesActividad() {
        try {
            if (fpbuscar.getForm().isValid()) {
                var barra = Ext.MessageBox.show({
                    msg: perfil.etiquetas.lbEspere,
                    width: 270,
                    wait: true,
                    progress: true,
                    closable: false
                });

                btnCerrarWin = new Ext.Button({
                    text: perfil.etiquetas.lbCerrar,
                    disabled: true,
                    id: 'btn',
                    tooltip: 'Cerrar',
                    iconCls: 'cerrar'
                });

                fpbuscar.getForm().submit(
                        {
                            url: 'importarfichero',
                            timeout: 1800000, //milisegundos = 30 min
                            method: 'POST',
                            params: {
                                idconcepto: 8,
                                idejercicio: cbEjercicio.getValue()
                            },
                            failure: function(form, action) {
                                mostrarMensaje(action.result.tipo, perfil.etiquetas.lbNoDatos);
                                barra.hide();
                                winImp.hide();
                            }
                        }
                );
            } else
                mostrarMensaje(1, perfil.etiquetas.lbCamposIncorrectos);
        } catch (e) {
        }
    }

    function seleccAprobarTodos() {
        if (identidadselected != null && !Ext.getCmp('btnAprobarTodo').hidden && !Ext.getCmp('btnAprobarTodo').disabled) {
            if (objci.acciones.rector == undefined) {
                idaprobacion_sel = 3;
            } else {
                idaprobacion_sel = 4;
            }
            todos = true;
            cambiarAprobacion(3);
        }
    }

    function seleccAprobarAjustes() {
        if (identidadselected != null) {
            if (objci.acciones.rector == undefined) {
                idaprobacion_sel = 3;
            } else {
                idaprobacion_sel = 4;
            }
            todos = true;
            cambiarAprobacion(3);
        }
    }

    function seleccDesapTodos() {
        if (identidadselected != null && !Ext.getCmp('btnDesaprobarTodo').hidden && !Ext.getCmp('btnDesaprobarTodo').disabled) {
            idaprobacion_sel = 1;
            todos = true;
            cambiarAprobacion(1);
        }
    }

    // ************ELEMENTOS PARA LA BUSQUEDA***********
    tfcodigo = new Ext.form.TextField({
        id: 'tfcodigo',
        width: 85,
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        regex: /^([0-9]+ ?[0-9]*)+$/,
        maxLength: 12,
        maxLengthText: perfil.etiquetas.lbmaxLengthText,
        minLength: 1,
        minLengthText: perfil.etiquetas.lbminLengthText,
        enableKeyEvents: true,
        listeners: {
            keypress: function(btn, e) {
                if (e.getKey() == 13) {
                    ejecutarBusqueda();
                }
            },
            change: function(tf, nT, oT) {
                habilitaBusqueda(true);
            }
        }
    })

    tfdenominacionnivel = new Ext.form.TextField(
            {
                id: 'tfdenominacionnivel',
                width: 200,
                regex: /^([a-zA-Z0-9á.,éí()#óú??É??ÓÚÑñ_-]+ ?[a-zA-Z0-9á.,éí()#óú??É??ÓÚÑñ _-]*)+$/,
                enableKeyEvents: true,
                listeners: {
                    keypress: function(btn, e) {
                        if (e.getKey() == 13) {
                            ejecutarBusqueda();
                        }
                    },
                    change: function(tf, nT, oT) {
                        habilitaBusqueda(true);
                    }
                }
            })

    //********************************************************
    stCbejercicio = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/gestplanes/getEjercicios',
        listeners: {
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                gestionarPermiso();
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
        enableKeyEvents: true,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function() {
                mymask.show();
                gestionarPermiso();
                stNivActividad.reload();
                treePlanes.getRootNode().reload();
            }
        }
    });
    stCbejercicio.reload();

    //boton para comp graficas
    btnGraficas = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: entidadsel,
        componente: 'NA'
    });
    btnGraficoPlanif = btnGraficas.botonMenuGrafica();

    btnBuscar = new Ext.Button({
        text: perfil.etiquetas.lbBuscar,
        id: 'btnBuscar',
        iconCls: 'buscar',
        disabled: true,
        enableToggle: true,
        handler: function() {
            press_buscar = true;
            ejecutarBusqueda();
        }
    });
    btnCalcular = new Ext.Button({
        text: perfil.etiquetas.lbCalcular,
        id: 'btnCalcular',
        height: 15,
        disabled: true,
        iconCls: 'calcular',
        handler: function() {
            Calcular();
        }
    });
    var porcientotext = {
        xtype: 'tbtext',
        id: 'porcientotex',
        width: 50,
        height: 35,
        text: perfil.etiquetas.lbPorcientoAjustar
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
        fieldLabel: perfil.etiquetas.lbPorcientoAjustar,
        maskRe: /^([0-9-]+ ?[0-9-]*)+$/,
        maskReregex: /^([0-9-]+ ?[0-9-]*)+$/,
        maxValue: 100,
        minValue: -100,
        maxText: perfil.etiquetas.lbMinMaxText0a100,
        minText: perfil.etiquetas.lbMinMaxText0a100,
        listeners: {
            keyup: function(btn, e) {
                if (fpAjustar.getForm().isValid()) {
                    Ext.getCmp('btnCalcular').enable();
                } else {
                    Ext.getCmp('btnCalcular').disable();
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
        fieldLabel: perfil.etiquetas.lbImporte,
        editable: false,
        disabled: true
    };
    var importFinal = {
        xtype: 'textfield',
        id: 'importFinal',
        width: 110,
        height: 25,
        fieldLabel: perfil.etiquetas.lbimportefinal,
        editable: false,
        disabled: true
    };
    var importAjustado = {
        xtype: 'textfield',
        id: 'importAjustado',
        width: 100,
        height: 25,
        fieldLabel: perfil.etiquetas.lbimporteajustado,
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
                        items: [btnCalcular]
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
        title: perfil.etiquetas.lbRealizarAjuste,
        autoHeight: true,
        items: fpAjustar,
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbCerrarSinGuardar,
                tabIndex: 33,
                text: perfil.etiquetas.lbCancelar,
                handler: function() {
                    winRealizarAjuste.hide();
                    LimpiarValores();
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                tooltip: perfil.etiquetas.lbCerrarYGuardar,
                tabIndex: 31,
                disabled: true,
                id: 'idajustar',
                text: perfil.etiquetas.lbAceptar,
                handler: function() {
                    winRealizarAjuste.hide();
                    InsertarAjuste();
                    LimpiarValores();
                }
            }],
        listeners: {
            'beforeshow': function() {
                Ext.getCmp('porciento').focus(true, 500);
            }
        }
    });

    btnAjustar = new Ext.Button({
        id: 'btnAjustar',
        iconCls: 'ajustar',
        tooltip: perfil.etiquetas.lbAjustar,
        disabled: true,
        handler: function() {
            CargarImporteinicial();
        }
    });
    pGrid = new Ext.Panel({
        layout: 'border',
        region: 'center',
        items: [gpNivActividad, gridCentral]
    });

    listarPlanModelo = new Ext.tree.TreeLoader({
        dataUrl: 'listarPlanModelo',
        preloadChildren: true,
        listeners: {
            scope: this,
            beforeload: function(tree, node, res) {
                if (identidadselected != "Estructuras") {
                    ent = identidadselected;
                } else {
                    ent.identidad = 0;
                }
                tree.baseParams.tipo = (node.id == 0) ? 0 : 1;
                tree.baseParams.idejercicio = cbEjercicio.getValue();
                tree.baseParams.identidad = ent;
            },
            load: function() {
            }
        }
    });

    treePlanes = new Ext.tree.TreePanel({
        id: 'treePlanes',
        autoScroll: true,
        collapsible: true,
        collapsed: true,
        disabled: true,
        region: 'south',
        height: 200,
        title: perfil.etiquetas.lbPlanes,
        border: false,
        rootVisible: true,
        root: new Ext.tree.AsyncTreeNode({
            text: perfil.etiquetas.lbPlanes,
            tipo: 0,
            id: '0'
        }),
        listeners: {
            click: function(n, e) {
                if (n.leaf) {
                    stNivActividad.reload({
                        params: {
                            idmodelo: n.id
                        }
                    })
                }
                gridCentral.collapse();
            },
            contextmenu: function(node, e) {
                if (node.attributes.menu == 1 && clickderecho == 0) {
                    treePlanes.fireEvent('click', node);
                    var c = node.getOwnerTree().contextMenu;
                    c.contextNode = node;
                    c.showAt(e.getXY());
                } else if (clickderecho == 1)
                    mostrarMensaje(1, perfil.etiquetas.lbYaEjecutandoEspere);
            }
        },
        loader: listarPlanModelo,
        contextMenu: new Ext.menu.Menu({
            items: [{
                    id: 'btnactualizarplan',
                    iconCls: 'actualizar',
                    disabled: false,
                    text: perfil.etiquetas.lbActualizaPlan,
                    handler: function() {
                        mostrarMensaje(2, perfil.etiquetas.lbActualizarPlan, actualizarPlan);
                        actualizarPlan();
                    }
                }]
        })
    });

    panelEnt = new Ext.Panel({
        id: 'panelEnt',
        region: 'center',
        split: true,
        width: 270,
        layout: 'border',
        items: [trEnt, treePlanes]
    });

    panelWest = new Ext.Panel({
        id: 'pMultiEnt',
        region: 'west',
        split: true,
        width: 270,
        layout: 'fit',
        items: [panelEnt]
    });

    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            items: [panelWest, pGrid],
            tbar: [btnExportar, btnImportar, '-', btnGuardar, '-', cbaccionesDWH, btnAjustar, '-', perfil.etiquetas.lbEjercicio + ':', cbEjercicio, btnAprob, btnDesprob, btnAprobarAjuste, btnDesapAjuste, btnAsociarObj, btnAsociarRec, btnVerDetalle, btnGraficoPlanif,
                {
                    xtype: 'checkbox',
                    boxLabel: 'Global',
                    id: 'chkglobalNA',
                    listeners: {
                        check: function(ck, t) {
                            controladorDeAciones();
                        }
                    }
                }, '->', btnAyu]
        })
    });

    stNivActividad.reload({
        params: {
            start: 0,
            limit: Ext.getCmp('paginadoniveles').cbPageSize.getValue()
        }
    });

    smGpAsociadoaPresupuesto = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
}

function buscarNodoTree(trEnt, idselected, idcampobusq, funct) {
    var rootNode = null;
    var idRootNode = null;
    if (idselected == null) {
        idRootNode = trEnt.getRootNode().firstChild.id;
        rootNode = trEnt.getNodeById(idRootNode);
        trEnt.getSelectionModel().select(rootNode);
    } else {
        if (idRootNode == null)
            idRootNode = idselected;
        rootNode = trEnt.getNodeById(idRootNode);
    }

    function contarCoinc(t1, t2) {
        var cont = 0;
        for (var index = 0; index < t1.length && index < t2.length; index++) {
            if (t1.charAt(index).toLowerCase() == t2.charAt(index).toLowerCase()) {
                cont++;
            } else {
                break;
            }
        }
        return cont;
    }

    var idmayor = -1;
    var cantConincMayor = 0;
    var node = null;
    rootNode.eachChild(function(n) {
        var cont = null;
        cont = contarCoinc(n.attributes.text, Ext.getCmp(idcampobusq).getValue());
        if (cont > cantConincMayor) {
            cantConincMayor = cont;
            idmayor = n.id;
            node = n;
        }
    }, null, null);
    if (node != null) {
        trEnt.getSelectionModel().select(node);
        identidadselected = node.id;
        //Determinando si es od
        if (identidadselected != "Estructuras") {
            ent = identidadselected;
        } else
            ent.identidad = 0;
        Ext.Ajax.request({
            url: 'entidadOD',
            params: {
                identidad: ent
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                identidadEsOD = responseData;
                controladorDeAciones();
            }
        });
        entidadsel = node;
        btnGraficas.actualizarParametros(node, 'NA');
        denomentidadselected = n.text;
        idEstructuraPadre = node.attributes.idEstructuraPadre;
        entidades_productoras = node.attributes.entidades_productoras;
        is_leaf = node.leaf;
        stNivActividad.reload();
    }
}

function validarBtn(btn) {
    return btn.hidden == false && !btn.disabled
}

function modificarAprobacion(val, m) {
    if (val == 1 || val < 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } else if (val == 4) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbRector + '"';
        m.css = 'icondistra-true verde';
    } else if (val == 3) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true amarillo';
    } else if (val == 5) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAjuste + '"';
        m.css = 'icondistra-true azul';
    }

}
function modificarDesglose(val, m) {
    if (val > 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}
function setModelo(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == null)
        return '-';
    return val;
}
function setImportA(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == null)
        return '-';
    return val;
}
function setImportF(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == null)
        return '-';
    return val;
}
function setNP(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == null)
        return 0;
    else
        return val;
}
function setComportamiento(val, m) {
    if (val == -1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbPropia + '"';
        return perfil.etiquetas.lbPropia;
    } else if (val == 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbDemandada + '"';
        return perfil.etiquetas.lbDemandada;
    } else if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbCompartida + '"';
        return perfil.etiquetas.lbCompartida;
    }
    return '?';
}
function habilitaBusqueda(bandera) {
    if (bandera) {
        Ext.getCmp('btnBuscar').enable();
    } else {
        Ext.getCmp('btnBuscar').disable();
    }
}

function ejecutarBusqueda() {
    press_buscar = true;
    gpNivActividad.getStore().reload({
        params: {
            start: 0,
            limit: 20,
            codigo: Ext.getCmp('tfcodigo').getValue(),
            denominacion: Ext.getCmp('tfdenominacionnivel').getValue()
        }
    });
}
function actualizarNivActividad(campos_modificados) {
    tfimportetotalnivelactvidad.setValue("...");

    var guardarajuste = false;
    if (campos_modificados.length > 0) {
        for (i = 0; i < campos_modificados.length; i++) {
            if (campos_modificados[i].campo_modif == 'ajuste')
                actajuste = 1;
            if (campos_modificados[0].campo_modif == 'ajuste') {
                actajuste = 1;
                var nivelact = smNivActividad.getSelected().data.nivelactividad;
                var ajuste = campos_modificados[i].ajuste;
                if (nivelact - ajuste < 0) {
                    mymask.hide();
                    gpNivActividad.getStore().reload();
                    mostrarMensaje(1, perfil.etiquetas.lbAjusteNopermitido);
                    return;
                }
            }
        }
        if (gpNivActividad.getStore().getCount() > 0) {
            gpNivActividad.getStore().getAt(0).data.importe_total_paginado = "-1";
        }
        Ext.Ajax.request({
            url: 'actualizarNivActividad',
            params: {
                niveles: Ext.encode(campos_modificados),
                idEstructuraPadre: idEstructuraPadre,
                entidades_productoras: entidades_productoras,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 3) {
                    mostrarMensaje(1, responseData.mensaje);
                }
                if (responseData.codMsgE == 1) {
                    gpNivActividad.getStore().reload();
                    if (actajuste == 1) {
                        for (var i = 0; i < stNivActividad.getCount(); i++) {
                            if (stNivActividad.getAt(i).data.cantdesglosada > 0) {
                                ajustepordesglosar = 1;
                            }
                        }
                        if (ajustepordesglosar == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgDebeRevisarDesglose);
                        }
                        actajuste = 0;
                        ajustepordesglosar = 0;
                    }
                }
            }
        });
    } else {
        mymask.hide();
        mostrarMensaje(1, perfil.etiquetas.msgDebeModificarNA);
    }
    campos_modificados = [];
}

function actualizarInterfazUsuario(responseData) {
    if (responseData === undefined) {
        return;
    }
    if (responseData.mods == undefined) {
        return;
    }
    for (var i = 0; i < responseData.mods.length; i++) {
        gpNivActividad.getStore().getById(responseData.mods[i].idactividad).data.importe = responseData.mods[i].importe;
        gpNivActividad.getStore().getById(responseData.mods[i].idactividad).data.nivelactividadmanual = responseData.mods[i].nivelactividadmanual;
        gpNivActividad.getStore().getById(responseData.mods[i].idactividad).data.nivelactividadproduccion = responseData.mods[i].nivelactividadproduccion;
        gpNivActividad.getStore().getById(responseData.mods[i].idactividad).data.nivelactividad = responseData.mods[i].nivelactividad;
        gpNivActividad.getStore().getById(responseData.mods[i].idactividad).data.version_manual = responseData.mods[i].version_manual;
        gpNivActividad.getStore().getById(responseData.mods[i].idactividad).data.restoxdistrib = responseData.mods[i].restoxdistrib;
        gpNivActividad.getStore().getById(responseData.mods[i].idactividad).data.ajuste = responseData.mods[i].ajuste;
        gpNivActividad.getStore().getById(responseData.mods[i].idactividad).commit();
        /* Actualizar asoc_automaticas */
        var array_acts_gen_x_regla = responseData.mods[i].idsactividades_generadas_x_regla;
        for (var j = 0; j < array_acts_gen_x_regla.length; j++) {
            try {
                gpNivActividad.getStore().getById(array_acts_gen_x_regla[j].idactividadquegenera).data.nivelactividadautomatico = array_acts_gen_x_regla[j].nivelactividadautomatico;
                /*
                 * temporal verificar que no ocurra un error al buscar una
                 * actividad que no se encuentre en el paginado actual
                 */
                if (array_acts_gen_x_regla[j].nivelactividadautomatico > 0) {
                    gpNivActividad.getStore().getById(array_acts_gen_x_regla[j].idactividadquegenera).data.esorigenautomatico = 1;
                } else {
                    gpNivActividad.getStore().getById(array_acts_gen_x_regla[j].idactividadquegenera).data.esorigenautomatico = 0;
                }
                gpNivActividad.getStore().getById(array_acts_gen_x_regla[j].idactividadquegenera).data.nivelactividad = array_acts_gen_x_regla[j].nivelactividad;
                gpNivActividad.getStore().getById(array_acts_gen_x_regla[j].idactividadquegenera).data.importe = array_acts_gen_x_regla[j].importe;
                gpNivActividad.getStore().getById(array_acts_gen_x_regla[j].idactividadquegenera).commit();
            } catch (errorInfo) {
                // continua
                /*
                 * capturar la excepcion para el caso en que la dupla no se
                 * encuentre en la pagina actual o no se muestre por que la
                 * actividad no esta a probada para pasar a el componente
                 * niveles de actividad
                 */
            }
        }
        upColorCell();
        upColorCellDesglose();
    }
}

function SeleccionarFila(sm, st, fila) {
    var filaSeleccionada = parseInt(fila);
    if (filaSeleccionada != st.getCount() - 1)
        sm.selectRow(filaSeleccionada + 1);
    else
        sm.selectRow(filaSeleccionada);
}

function calcularImporteTotalTodosNivAct() {
    if (gpNivActividad.getStore().getCount() > 0) {
        if (gpNivActividad.getStore().getAt(0).data.importe_total_paginado != '-1')
            tfimportetotalnivelactvidad.setValue(gpNivActividad.getStore().reader.jsonData.importefinal);
        else
            /** Los (...) Indican que debe de mandar a recargar */
            tfimportetotalnivelactvidad.setValue("...");
    } else
        tfimportetotalnivelactvidad.setValue(parseFloat(0).toFixed(3));
}
function dosdecimalesimporteniveles(val) {
    return parseFloat(val).toFixed(3);
}
function cambiarTituloFiltrarNiveles() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosnivelactividad.getFiltrosActivos() == undefined
            || filtrosnivelactividad.getFiltrosActivos().length == 0) {
        gpNivActividad.setTitle(perfil.etiquetas.lbNivActividad);
        esta_buscando = false;
    } else {
        esta_buscando = true;
        for (i = 0; i < filtrosnivelactividad.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "estado") {
                aux = perfil.etiquetas.lbActivado;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "descripcion") {
                aux = perfil.etiquetas.lbDescripcion;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "denespecialidad") {
                aux = perfil.etiquetas.lbEspecialidad;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "comportamiento") {
                aux = perfil.etiquetas.lbComportamiento;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "nivelactividadautomatico") {
                aux = perfil.etiquetas.lbNivelAutomatico;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "cantdesglosada") {
                aux = perfil.etiquetas.lbDesglosada;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "nivelactividadmanual") {
                aux = perfil.etiquetas.lbNivelManual;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "nivelactividad") {
                aux = perfil.etiquetas.lbNivel;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "idaprobacion") {
                aux = perfil.etiquetas.lbAprobacion;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "denmodelo") {
                aux = perfil.etiquetas.lbPlan;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "nivelactividadproduccion") {
                aux = perfil.etiquetas.lbND;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "importe") {
                aux = perfil.etiquetas.lbImporte;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "importeajustado") {
                aux = perfil.etiquetas.lbimporteajustado;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "importefinal") {
                aux = perfil.etiquetas.lbimportefinal;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "nivelactividadct") {
                aux = perfil.etiquetas.lbNACT;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "restoxdistrib") {
                aux = perfil.etiquetas.lbRD;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "ajuste") {
                aux = perfil.etiquetas.lbAjuste;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "nivelactividadajuste") {
                aux = perfil.etiquetas.lbAjuste;
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "nivelinversion") {
                aux = 'Nivel de actividad de inversiones';
            } else if (filtrosnivelactividad.getFiltrosActivos()[i].dataIndex == "nivelproyecto") {
                aux = 'Nivel de actividad de proyecto';
            } else {
                aux = '?';
            }
            if (i == filtrosnivelactividad.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpNivActividad.setTitle(perfil.etiquetas.lbFiltradoPorNiv + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function actualizarCalculos() {
    Ext.Ajax.request({
        url: 'actualizarBasesDeCalculo',
        params: {
            is_leaf: is_leaf,
            identidad: identidadselected
        },
        callback: function(options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 3) {
                mostrarMensaje(1, perfil.etiquetas.lbmsgError);
            }
            if (responseData.codMsg == 1 || responseData.codMsg == 20) {
                mostrarMensaje(1, perfil.etiquetas.lbCalculoAct);
            }
        }
    });
}
function InsertarAjuste() {
    mymask.show();
    arrayAjuste = [];
    for (i = 0; i < smNivActividad.getSelections().length; i++) {
        if (smNivActividad.getSelections()[i].data.idaprobacion == '4') {
            arrayAjuste.push(smNivActividad.getSelections()[i].data.idactividad);
        }
    }
    mymask.show();
    Ext.Ajax.request({
        url: 'insertarAjusteNivel',
        params: {
            identidad: identidadselected,
            idejercicio: cbEjercicio.getValue(),
            arrayidactividad: Ext.encode(arrayAjuste)
        },
        callback: function(options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (response.responseText == 23) {
                mostrarMensaje(1, perfil.etiquetas.lbNoajuste);
            } else if (response.responseText == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbAjusteSat);
                gpNivActividad.getStore().reload();
            }
        }
    });
}

function cambiarAprobacion(aprobacion) {
    /* desaprobado o aprobado */
    if (todos) {
        if (aprobacion == 3 || aprobacion == 4) {
            mostrarMensaje(2, perfil.etiquetas.msgSegAprobarTodosNivAct, aprobardesaprobartodos);
        } else {
            mostrarMensaje(2, perfil.etiquetas.msgSegDesaprobarTodosNivAct, aprobardesaprobartodos);
        }
    } else {
        //seleccion multiple
        var recordsSel = gpNivActividad.getSelectionModel().getSelections(), actaprobar = [];
        var aprobada_rector = false;
        for (var i = 0; i < recordsSel.length; i++) {
            if (recordsSel[i].data.idaprobacion >= '4' && !esrector) {
                aprobada_rector = true
                aprobada_rector = true
                break;
            }
            actaprobar.push(recordsSel[i].data.idactividad);
        }
        if (aprobada_rector && !esrector) {
            mostrarMensaje(1, perfil.etiquetas.msgErrorAproSuperior);
            aprobada_rector = false;
            return;
        }
        if (!mensajeAprobarDesaprobar) {
            mostrarMensaje(2, perfil.etiquetas.msgSegDesaprobarNivAct,
                    aprobardesaprobar);
        } else {
            mostrarMensaje(2, perfil.etiquetas.msgSegAprobarNivAct,
                    aprobardesaprobar);
        }
    }
}

function aprobardesaprobar(btnPresionado) {
    var recordsSel = gpNivActividad.getSelectionModel().getSelections(), actaprobar = [];
    var aprobada_rector = false;
    for (var i = 0; i < recordsSel.length; i++) {
        if (recordsSel[i].data.idaprobacion >= '4' && !esrector) {
            aprobada_rector = true;
            aprobada_rector = true;
            break;
        }
        actaprobar.push(recordsSel[i].data.idactividad);
    }

    if (btnPresionado == 'ok') {
        if (gpNivActividad.getSelectionModel().getSelected().data.idaprobacion == 4
                && objci.acciones.rector == undefined) {
            mostrarMensaje(1, perfil.etiquetas.msgErrorAproSuperior);
            aprobada_rector = false;
        } else {
            mymask.show();
            Ext.Ajax.request({
                url: 'aprobarDesaprobarNivelActividad',
                params: {
                    identidad: gpNivActividad.getSelectionModel().getSelected().data.identidad,
                    actividades: Ext.encode(actaprobar),
                    idaprobacion: idaprobacion_sel,
                    todos: todos,
                    es_rector: objci.acciones.rector,
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function(options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgE == 1) {
                        if (responseData.mensaje == 'aprobada') {
                            mostrarMensaje(1, perfil.etiquetas.msgAprobandoAct);
                            gpNivActividad.getStore().reload();
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgDesaprobandoAct);
                            gpNivActividad.getStore().reload();
                        }
                    } else
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                }
            });
        }
    }
}

function aprobardesaprobartodos(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'aprobarDesaprobarNivelActividad',
            params: {
                identidad: identidadselected,
                idaprobacion: idaprobacion_sel,
                todos: todos,
                is_leaf: is_leaf,
                es_rector: objci.acciones.rector,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 1) {
                    if (responseData.mensaje == 'aprobada')
                        mostrarMensaje(1, perfil.etiquetas.msgAprobandoTodosAct);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgDesaprobandoTodosAct);
                } else
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAction);

                if (todos) {
                    gpNivActividad.getStore().reload();
                }
                todos = null;
                idaprobacion_sel = null;
            }
        });
    }
}

function copiarNiveles() {
    if (!is_leaf) {
        return;
    }
    identidadorigen = null;
    identidaddestino = null;
    if (!Ext.getCmp('btnCopiarNiveles').disabled && !Ext.getCmp('btnCopiarNiveles').hidden) {
        Ext.getCmp('btnCopiarNiveles').disable();
        Ext.getCmp('btnPegarNiveles').enable();
        identidadorigen = identidadselected;
    }
}

function confirmarCopiarPegarNiveles() {
    if (!is_leaf) {
        return;
    }
    if (!Ext.getCmp('btnPegarNiveles').disabled && !Ext.getCmp('btnPegarNiveles').hidden) {
        Ext.getCmp('btnCopiarNiveles').enable();
        Ext.getCmp('btnPegarNiveles').disable();
        identidaddestino = identidadselected;
        if ((identidadorigen != null && identidaddestino != null) && (identidadorigen != identidaddestino)) {
            mostrarMensaje(2, perfil.etiquetas.msgSegPegarNivAct, copiarPegarNiveles);
        }
    }
}

function copiarPegarNiveles(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'copiarpegarniveles',
            params: {
                identidadorigen: identidadorigen,
                identidaddestino: identidaddestino,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                gpNivActividad.getStore().reload();
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 24) {
                    mostrarMensaje(1,
                            perfil.etiquetas.msgNivelesActividadCopiados);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                }
            }
        });
    }
}

function Calcular() {
    mymask.show();
    Ext.Ajax.request({
        url: 'calcularAjuste',
        params: {
            identidad: identidadselected,
            idejercicio: cbEjercicio.getValue(),
            arrayidactividad: Ext.encode(arrayActSelect),
            todos: todos,
            porciento: Ext.getCmp('porciento').getValue()
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (response.responseText == 23) {
            } else {
                Ext.getCmp('importAjustado').setValue(responseData.importeformato);
                var importAju = responseData.importe;
                ImporteFinal(importeIn, importAju);
                mymask.hide();
            }
        }
    });
}

function ImporteFinal(importeIn, importAju) {
    mymask.show();
    Ext.Ajax.request({
        url: 'ImporteFinal',
        params: {
            importeInicial: importeIn,
            importeAjustado: importAju
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            Ext.getCmp('importFinal').setValue(responseData.importeformato);
            Ext.getCmp('idajustar').enable();
        }
    });
}

function CargarImporteinicial(btnPresionado) {
    mymask.show();
    arrayActSelect = [];
    if (smNivActividad.getSelections().length > 0) {
        for (i = 0; i < smNivActividad.getSelections().length; i++) {
            if (smNivActividad.getSelections()[i].data.idaprobacion == '4') {
                arrayActSelect.push(smNivActividad.getSelections()[i].data.idactividad);
            }
        }
    }
    mymask.show();
    Ext.Ajax.request({
        url: 'cargarImporteInicial',
        params: {
            identidad: identidadselected,
            idejercicio: cbEjercicio.getValue(),
            arrayidactividad: Ext.encode(arrayActSelect)
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            mymask.hide();
            if (response.responseText == 23) {
                mostrarMensaje(1, perfil.etiquetas.lbNoajuste);
            } else {
                LimpiarValores();
                importeIn = responseData.importe;
                Ext.getCmp('importInicial').setValue(responseData.importeformato);
                winRealizarAjuste.show();
            }
        }
    });
}

function modificarbotonesaprobar(rector, aprobar) {
    if (rector) {
        //Si es rector
        if (aprobar == 3) {
            //si va a desaprobar o a aprobar
            Ext.getCmp('btnAprob').enable();
            Ext.getCmp('btnDesap').enable();
        } else if (aprobar == 4 || aprobar == 5) {
            //si va a desaprobar
            Ext.getCmp('btnAprob').disable();
            Ext.getCmp('btnDesap').enable();
            idaprobacion_sel = 1;
        } else {
            //si va a aprobar
            Ext.getCmp('btnAprob').enable();
            Ext.getCmp('btnDesap').disable();
            idaprobacion_sel = 4;
        }
    } else {
        //Si no es rector
        if (aprobar == 4 || aprobar == 5) {
            //Si va a desaprobar un nivel del rector
            Ext.getCmp('btnAprob').disable();
            Ext.getCmp('btnDesap').disable();
        } else if (aprobar == 3) {
            //Si va a desaprobar un nivel
            Ext.getCmp('btnAprob').disable();
            Ext.getCmp('btnDesap').enable();
            idaprobacion_sel = 1;
        } else if (aprobar == 1) {
            //Si va a aprobar un nivel
            Ext.getCmp('btnAprob').enable();
            Ext.getCmp('btnDesap').disable();
            idaprobacion_sel = 3;
        } else {
            Ext.getCmp('btnAprob').disable();
            Ext.getCmp('btnDesap').disable();
        }
    }
}
var idRootNode = null;

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

function exportarNivelesAct() {
    var win = window.open('exportarNivelesActvAExcel?identidad=' + identidadselected + "&is_leaf=" + is_leaf
            + "&idejercicio=" + cbEjercicio.getValue()
            + "&glob=" + Ext.getCmp('chkglobalNA').getValue()
            + '&esrector=' + esrector + '&idEstructuraPadre=' + idEstructuraPadre + '&calcularimporte='
            + (!cmnivelactividades.getColumnById('columnaimporte').hidden) + '&calcularajustado='
            + (!cmnivelactividades.getColumnById('columnaimporteajustado').hidden) + '&calcularfinal='
            + (!cmnivelactividades.getColumnById('columnaimportefinal').hidden) + '&calcularrestoxdistrib='
            + (!cmnivelactividades.getColumnById('columnarestoxdistrib').hidden)
            + '&text=' + trEnt.getNodeById(identidadselected).text + '&filtros=' + Ext.encode(filtrosnivelactividad.getFilterData()));
    mascaraExportar(perfil.etiquetas.lbExportandoNivs, perfil.etiquetas.lbEsperePorFavor, win);
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function setAprobacion(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == 1 || val < 1)
        return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
    else if (val == 3)
        return '<span><img src=' + perfil.dirImg + 'tick(amarillo).png' + '>';
    else if (val == 4 || val == 5)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    else
        return '?';
}
function setPlan(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == null)
        return perfil.etiquetas.lbPlanIndefinido;
    return val;
}

function DesaprobarAprobarAjuste(btnPresionado) {
    if (aprobarOdesaprobarA == 1 || AproDesaAjusteTo == 1) {
        idaprobacion_sel = 5;
    } else if (aprobarOdesaprobarA == 2 || AproDesaAjusteTo == 2) {
        idaprobacion_sel = 4;
    }
    actaprobarajuste = [];
    for (var i = 0; i < smNivActividad.getSelections().length; i++) {
        if (((smNivActividad.getSelections()[i].data.idaprobacion == '4') || (smNivActividad.getSelections()[i].data.idaprobacion == '5'))
                && esrector) {
            actaprobarajuste.push(smNivActividad.getSelections()[i].data.idactividad);
        }
    }
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'aprobarDesaprobarNivelActividad',
            params: {
                aprobarOdesaprobarA: aprobarOdesaprobarA,
                identidad: identidadselected,
                actividades: Ext.encode(actaprobarajuste),
                idaprobacion: idaprobacion_sel,
                todos: todos,
                idejercicio: cbEjercicio.getValue(),
                is_leaf: is_leaf,
                es_rector: objci.acciones.rector
            },
            callback: function(options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 1) {
                    if (responseData.idaprobacion == '4')
                        mostrarMensaje(1, perfil.etiquetas.msgDesaprobandoAjuste);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgAprobandoAjuste);
                    gpNivActividad.getStore().reload();
                } else
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
            }
        });
        aprobarOdesaprobarA = 0;
        AproDesaAjusteTo = 0;
    }
}
function LimpiarValores() {
    Ext.getCmp('porciento').setValue('');
    Ext.getCmp('importInicial').setValue('');
    Ext.getCmp('importFinal').setValue('');
    Ext.getCmp('importAjustado').setValue('');
    Ext.getCmp('idajustar').disable();
    Ext.getCmp('btnCalcular').disable();
    fpAjustar.getForm().reset();
}
function EliminarAjuste(btnPresionado) {
    arrayActSelect = [];
    for (i = 0; i < smNivActividad.getSelections().length; i++) {
        if (smNivActividad.getSelections()[i].data.idaprobacion == '4') {
            arrayActSelect.push(smNivActividad.getSelections()[i].data.idactividad);
        }
    }
    if (btnPresionado == 'ok') {
        Ext.Ajax.request({
            url: 'eliminarAjustes',
            params: {
                identidad: identidadselected,
                idejercicio: cbEjercicio.getValue(),
                arrayidactividad: Ext.encode(arrayActSelect)
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                gpNivActividad.getStore().reload();
                if (response.responseText == 1) {
                    mostrarMensaje(1, perfil.etiquetas.lbEliminarSatisf);
                }
            }
        });
    }
}
function Habilitareliminar() {
    //Eliminar ajustes
    var del = false;
    for (i = 0; i < smNivActividad.getSelections().length; i++) {
        if (smNivActividad.getSelections()[i].data.ajuste != 0 && !esrector && smNivActividad.getSelections()[i].data.idaprobacion == '4' && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
            Ext.getCmp('btnEliminarAjustes').enable();
            del = true;
            break;
        }
    }
    if (!del || esrector || identidadEsOD == 0 || Ext.getCmp('chkglobalNA').getValue() == true) {
        Ext.getCmp('btnEliminarAjustes').disable();
    }
}
function HabilitarAjustes() {//usuario con idaprobacion 4 especcialista
    var ajuste = false;
    for (i = 0; i < smNivActividad.getSelections().length; i++) {
        if (smNivActividad.getSelections()[i].data.idaprobacion == '4' && !esrector && smNivActividad.getSelections()[i].data.comportamiento != 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
            Ext.getCmp('btnAjustar').enable();//boton Ajustar en el tb del gridpanel.
            Ext.getCmp('btnAjuste').enable();//boton Ajustar del menu en el gridpanel.
            ajuste = true;
            break;
        }
    }
    if (!ajuste || esrector) {
        Ext.getCmp('btnAjustar').disable();
        Ext.getCmp('btnAjuste').disable();
    }
}
function HabilitarAprodesa() {//usuario con categoría rector y idaprobacion 4 rector
    //Aprobar Ajustes
    var b = false;
    for (i = 0; i < smNivActividad.getSelections().length; i++) {
        if (smNivActividad.getSelections()[i].data.idaprobacion == '4' && esrector && smNivActividad.getSelections()[i].data.ajuste != 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
            Ext.getCmp('btnAprobAjuste').enable();
            Ext.getCmp('btnAprobAjuste1').enable();
            b = true;
            break;
        }
    }
    if (!b || !esrector) {
        Ext.getCmp('btnAprobAjuste').disable();
        Ext.getCmp('btnAprobAjuste1').disable();
    }
}

function HabilitarDesa()
{//usuario con categoría rector y idaprobacion 5 rector
    //Aprobar Ajustes
    var b = false;
    for (i = 0; i < smNivActividad.getSelections().length; i++) {
        if (smNivActividad.getSelections()[i].data.idaprobacion == '5' && esrector && smNivActividad.getSelections()[i].data.ajuste != 0 && identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
            Ext.getCmp('btnDesapAjuste').enable();
            Ext.getCmp('btnDesapAjuste1').enable();
            b = true;
            break;
        }
    }
    if (!b || !esrector) {
        Ext.getCmp('btnDesapAjuste').disable();
        Ext.getCmp('btnDesapAjuste1').disable();
    }
}

function setearImporte() {
    importes = [];
    importes.push('0.000'); //indice 0
    importes.push('0.000');//indice 1
    importes.push('0.000');//indice 2
}

function calcularImporteTotal() {
    setearImporte();
    if (stNivActividad.getCount() > 0) {
        importes[1] = jrstNivActividad.jsonData.importe;
        importes[2] = jrstNivActividad.jsonData.importeajuste;
        importes[3] = jrstNivActividad.jsonData.importefinal;
        tfimportetotalnivelactvidad.setValue(importes[cbImportesNivelesAct.getValue()]);
    } else {
        tfimportetotalnivelactvidad.setValue(importes[0]);
    }
}

function gestionarPermiso() {
    Ext.Ajax.request({
        url: 'gestPermisos',
        params: {
            idejercicio: cbEjercicio.getValue(),
        },
        callback: function(options, success, response) {
            var responseData = Ext.decode(response.responseText);
            mymask.hide();
            if (responseData.data.length == 0) {
                btnGuardar.hide();
            } else {
                if (responseData.data[0].guardar != '1') {
                    btnGuardar.hide();
                } else {
                    btnGuardar.show();
                }
            }
            btnGuardar.show();
        }
    });
}
function ValidarOperacion(campo, valor, sm) {
    if (campo == 'ajuste' && valor < 0 && (-1 * valor) > sm.record.data.nivelactividad) {
        Ext.MessageBox.show({
            title: perfil.etiquetas.lbInformacion,
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgAjusteIncorrecto,
            icon: Ext.MessageBox.INFO
        });
        sm.cancel = true;
    }
}
function eliminarVariosDesgloses() {
    if (gpConfDesglose.getSelectionModel().getSelections().length <= 0) {
        mostrarMensaje(1, perfil.etiquetas.msgDebeSeleccionarDesglose);
    } else {
        mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarDesglose, eliminarDesglosesSeleccionados);
    }
    function eliminarDesglosesSeleccionados(btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            var recordsSel = gpConfDesglose.getSelectionModel().getSelections(), desElim = [];
            if (recordsSel.length > 0) {
                for (var i = 0; i < recordsSel.length; i++)
                    desElim.push({
                        iddesglose: recordsSel[i].data.iddesglose
                    });
                Ext.Ajax.request({
                    url: 'eliminarConfigDesglose',
                    params: {
                        conf_desgloses: Ext.encode(desElim)
                    },
                    callback: function(options, success, response) {
                        mymask.hide();
                        stConfDesglose.reload();
                        stConfNomencladores.reload();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesglosesEliminados);
                        } else if (responseData.mensaje != null)
                            mostrarMensaje(1, responseData.mensaje);
                        else
                            mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                    }
                });
            }
        }
    }
}
function addnomenclador() {
    var recordsSel = gpNomencladores.getSelectionModel().getSelections();
    if (recordsSel.length > 0 && stNomencladoresUsados.getCount() < 20) {
        if (recordsSel.length > 2) {
            Ext.MessageBox.show({
                title: perfil.etiquetas.lbTitAddNomencladores,
                buttons: Ext.MessageBox.OK,
                msg: perfil.etiquetas.msgNoMasDeDosNomencladores,
                icon: Ext.MessageBox.WARNING
            });
        }
        for (var i = 0; i < recordsSel.length && i < 2; i++) {
            var p = new Fila({
                idtiponomenclador: recordsSel[i].data.idtiponomenclador,
                denominacion: recordsSel[i].data.denominacion,
                descripcion: recordsSel[i].data.descripcion,
                orden: stNomencladoresUsados.getCount() + 1
            });
            if (!buscarRecord(recordsSel[i].data.idtiponomenclador)) {
                stNomencladoresUsados.add(p);
            } else {
                Ext.MessageBox.show({
                    title: perfil.etiquetas.lbInformacion,
                    buttons: Ext.MessageBox.OK,
                    msg: perfil.etiquetas.msgNomencaldoresYaExisten, //'Algunos de los nomencladores ya existen',
                    icon: Ext.MessageBox.WARNING
                });
            }
        }
    } else {
        Ext.MessageBox.show({
            title: perfil.etiquetas.lbmsgError,
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgSolo20Nomencladores, //No se pueden adicionar m&aacute;s de 20 nomencladores',
            icon: Ext.MessageBox.ERROR
        });
    }
}
function eliminarnom() {
    var recordsSel = gpNomencladoresUsados.getSelectionModel().getSelections();
    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++) {
            stNomencladoresUsados.remove(recordsSel[i]);
        }
    }
    var index = 0;
    stNomencladoresUsados.data.each(function() {
        stNomencladoresUsados.getAt(index).data.orden = index + 1;
        stNomencladoresUsados.getAt(index).commit();
        index++;
    });
}
function Ordenar(orden) {
    var validacion1, validacion2;
    var decremento, aumento, posicion;
    if (orden == 'up') {
        posicion = -1;
        aumento = -1;
        decremento = 1;
        validacion1 = 'stNomencladoresUsados.getAt(j).data.orden>1';
        validacion2 = 'j>0';
    } else {
        posicion = 1;
        aumento = 1;
        decremento = -1;
        validacion1 = 'stNomencladoresUsados.getAt(j).data.orden<stNomencladoresUsados.getCount()';
        validacion2 = 'j<stNomencladoresUsados.getCount()';
    }
    var recordsSel = gpNomencladoresUsados.getSelectionModel().getSelections();
    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++) {
            for (var j = 0; j < stNomencladoresUsados.getCount(); j++) {
                if (stNomencladoresUsados.getAt(j).data.idtiponomenclador == recordsSel[i].data.idtiponomenclador) {
                    if (eval(validacion1)) {
                        stNomencladoresUsados.getAt(j).set('orden', stNomencladoresUsados.getAt(j).data.orden + aumento);
                        if (eval(validacion2))
                            stNomencladoresUsados.getAt(j + posicion).set('orden', stNomencladoresUsados.getAt(j + posicion).data.orden + decremento);
                    }
                }
            }
        }
    }
    stNomencladoresUsados.sort('orden', 'ASC');
}
function adicionarDesglose1(aplicar) {
    if (pAddDesgloseNorte.getForm().isValid()) {
        if (stNomencladoresUsados.getCount() != 0) {
            mymask.show();
            array_nomencladores = [];
            for (var i = 0; i < stNomencladoresUsados.getCount(); i++) {
                array_nomencladores.push({
                    idtiponomenclador: stNomencladoresUsados.getAt(i).data.idtiponomenclador,
                    orden: stNomencladoresUsados.getAt(i).data.orden
                })
            }
            Ext.Ajax.request({
                url: 'adicionarConfigDesglose',
                params: {
                    denominacion: denominacionDesglose.getValue(),
                    descripcion: descripcionDesglose.getValue(),
                    tiponomencladores_orden: Ext.encode(array_nomencladores)
                },
                callback: function(options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgDesglosesGuardados);
                        pAddDesgloseNorte.getForm().reset();
                        if (!aplicar)
                            winAddDesglose.hide();
                        stConfDesglose.reload();
                        smNomencladores.deselectRange(0, stNomen.getCount());
                        stNomencladoresUsados.removeAll();
                    } else if (responseData.mensaje != null)
                        mostrarMensaje(1, responseData.mensaje);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                }
            });
        } else {
            mostrarMensaje(1, perfil.etiquetas.msgAlMenosUnNomenclador);
        }
    } else {
        mostrarMensaje(1, perfil.etiquetas.lbCamposIncorrectos);
    }
}
function buscarRecord(idtipo) {
    var bandera = false;
    for (var i = 0; i < stNomencladoresUsados.getCount(); i++) {
        if (stNomencladoresUsados.getAt(i).data.idtiponomenclador == idtipo) {
            bandera = true;
            break;
        }
    }
    return bandera;
}
function actualizarPlan(btnPresionado) {
    if (btnPresionado == 'ok') {
        clickderecho = 1;
        BarraProgreso.show(perfil.etiquetas.lbActualizando, false);
        Ext.Ajax.timeout = 600000; //10min
        Ext.Ajax.request({
            url: 'actualizarPlan',
            params: {
                idtipomodelo: treePlanes.getSelectionModel().getSelectedNode().attributes.idtipomodelo,
                idmodelo: treePlanes.getSelectionModel().getSelectedNode().attributes.idmodelo,
                tipoplan: treePlanes.getSelectionModel().getSelectedNode().attributes.tipoplan,
                identidad: identidadselected,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                BarraProgreso.hide();
                if (responseData.codMsgA == 1)
                    mostrarMensaje(1, perfil.etiquetas.msgPlanesActualizados);
                else
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                clickderecho = 0;
            }
        });
    }
}
function adicionarDesglose(datosdinamicos) {
    adicionarrec = 1;
    Fila = Ext.data.Record.create({
        name: 'nivelactividad',
        type: 'string'
    });
    var nivelact = parseFloat(gpNivActividad.getSelectionModel().getSelected().data.nivelactividad) + parseFloat(gpNivActividad.getSelectionModel().getSelected().data.ajuste);
    var nivelp = calcularCantidad();
    if (nivelact - nivelp > 0) {
        if (nivelp == 0) {
            var p = new Fila({
                nivelactividad: nivelact
            });
        } else {
            var p = new Fila({
                nivelactividad: (nivelact - nivelp)
            });
        }
        gridCentral.getStore().add(p);
        adicionarrec = 0;
    } else
        mostrarMensaje(1, perfil.etiquetas.msgNoPuedeSeguirDesglosando);
}
function cargarDatos() {
    Ext.Ajax.timeout = 600000; //10min
    Ext.Ajax.request({
        url: 'buscarColumnas',
        params: {
            idmodelo: gpNivActividad.getSelectionModel().getSelected().data.idmodelo
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            datosdinamicos = responseData;
            reconfgrid(responseData);
        }
    });
}

function reconfgrid(cf) {

    rec = [];
    rec.push({
        name: 'nivelactividad'
    });
    cmGp = [];
    cmGp.push({
        header: perfil.etiquetas.lbNivel,
        width: 80,
        sortable: true,
        dataIndex: 'nivelactividad',
        tooltip: perfil.etiquetas.lbNivel,
        editor: new Ext.form.NumberField({
            allowNegative: false
        })
    });
    columnasdinamicas = [];
    for (var index = 0; index < cf.datos.length; index++) {
        columnasdinamicas.push({
            denom: cf.datos[index].uritiponomenclador,
            id: cf.datos[index].iddesglosetiponomenclador
        });
        var almacen = new Ext.data.SimpleStore({
            fields: ['iddatosnomenclador', 'denominacion']
        });
        var valores = [];
        for (pos in cf.datos[index].datoscolumnas) {
            valores.push(new Ext.data.Record(cf.datos[index].datoscolumnas[pos]));
        }
        valores.pop();
        almacen.add(valores);
        rec.push({
            name: cf.datos[index].uritiponomenclador
        });
        cf.datos[index] = {
            id: cf.datos[index].idtiponomenclador,
            header: cf.datos[index].denominacion,
            dataIndex: cf.datos[index].uritiponomenclador,
            sortable: true,
            width: 300,
            tooltip: cf.datos[index].denominacion,
            editor: new Ext.form.ComboBox({
                id: cf.datos[index].uritiponomenclador,
                mode: 'local',
                triggerAction: 'all',
                allowBlank: true,
                emptyText: perfil.etiquetas.lbSeleccione,
                width: 300,
                valueField: 'iddatosnomenclador',
                displayField: 'denominacion',
                renderer: crearToolTip,
                store: almacen,
                listeners: {
                    select: function(a, b, c) {
                        adicionarrec = 0;
                        idcolumn = a.el.id;
                    },
                    focus: function() {
                    }
                }
            }),
            renderer: function(value, cell, rec, row, col) {
                return getRawValue(value, gridCentral.getColumnModel().getCellEditor(col, row).field, gridCentral.getColumnModel(), col);
            }
        };
        cmGp.push(cf.datos[index]);
    }

    jrStGpCentral = new Ext.data.JsonReader({
        root: 'data',
        id: 'jrStGpCentral',
        fields: rec
    });
    stGpActividadDesglose = new Ext.data.Store({
        url: 'listarDesgloseNivelesActividad',
        listeners: {
            beforeLoad: function() {
                stGpActividadDesglose.removeAll();
                stGpActividadDesglose.baseParams.idactividad = gpNivActividad.getSelectionModel().getSelected().data.idactividad;
                stGpActividadDesglose.baseParams.identidad = identidadselected;
                stGpActividadDesglose.baseParams.idejercicio = cbEjercicio.getValue();
            },
            load: function() {
            }
        },
        reader: jrStGpCentral
    });
    gridCentral.reconfigure(stGpActividadDesglose, new Ext.grid.ColumnModel(cmGp));
    paginadoact1.bind(stGpActividadDesglose);
    stGpActividadDesglose.load({
        params: {
            idactividad: gpNivActividad.getSelectionModel().getSelected().data.idactividad,
            identidad: identidadselected,
            start: 0,
            limit: 20
        }
    });
}
function calcularCantidad() {
    var suma = 0;
    for (var i = 0; i < Ext.getCmp('gridCentral').getStore().getCount(); i++) {
        if (Ext.getCmp('gridCentral').getStore().getAt(i).data.nivelactividad == null)
            cant = 0
        else
            cant = Ext.getCmp('gridCentral').getStore().getAt(i).data.nivelactividad
        suma += parseFloat(cant);
    }
    return suma;
}
function initDesgloses() {
    desgloses_realizados = [];
    for (var i = 0; i < 20; i++)
        desgloses_realizados.push({
            id: i,
            modif: false
        });
}
function desglosar() {
    var suma = calcularCantidad();
    if ((parseFloat(gpNivActividad.getSelectionModel().getSelected().data.nivelactividad) + parseFloat(gpNivActividad.getSelectionModel().getSelected().data.ajuste)) - parseInt(suma) < 0)
        mostrarMensaje(1, perfil.etiquetas.msgNoPuedeSeguirDesglosandoLimite);
    else if ((parseFloat(gpNivActividad.getSelectionModel().getSelected().data.nivelactividad) + parseFloat(gpNivActividad.getSelectionModel().getSelected().data.ajuste)) > parseInt(suma))
        mostrarMensaje(1, perfil.etiquetas.msgExistenNivelesPorDesglosar);
    else {
        guardardesgloses();
    }
    if ((parseFloat(gpNivActividad.getSelectionModel().getSelected().data.nivelactividad) + parseFloat(gpNivActividad.getSelectionModel().getSelected().data.ajuste)) > 0 && (parseInt(suma) === 0))
        mostrarMensaje(1, perfil.etiquetas.msgVerifiqueQueNoHaDesglosado);
}
function guardardesgloses(btn) {
    var desgloses = gridCentral.getStore().getRange();
    var recordmod = gridCentral.getStore().getModifiedRecords();
    var recordsEnviar = [];
    for (var i = 0; i < desgloses.length; i++) {
        if (desgloses[i].data.nivelactividad != null) {
            recordsEnviar.push(desgloses[i].data);
        }
    }
    cantidadnull = false;
    if (recordsEnviar.length > 0) {
        Ext.Ajax.request({
            url: 'guardarDesgloses',
            params: {
                columnas: Ext.encode(columnasdinamicas),
                desglose: Ext.encode(recordsEnviar),
                idactividad: gpNivActividad.getSelectionModel().getSelected().data.idactividad,
                identidad: identidadselected,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                btnGuardarDesglose.disable();
                btnEliminarDesglose.disable();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 20) {
                    mostrarMensaje(1, perfil.etiquetas.msgDesgloseRealizado)
                    Ext.getCmp('gridCentral').getStore().reload();
                    initDesgloses();
                } else if (responseData.codMsg == 26) {
                    mostrarMensaje(1, perfil.etiquetas.msgDesglosesSinGuardar);
                    Ext.getCmp('gridCentral').getStore().reload();
                } else if (responseData.codMsg == "Error") {
                    mostrarMensaje(1, perfil.etiquetas.msgNoSePudoGuardarDesglose);
                }
            }
        });
    }
}
function eliminarDesglose() {
    var suma = calcularCantidad();
    if (suma == 0) {
        mostrarMensaje(1, perfil.etiquetas.msgNoHayDesgloses);
    } else {
        mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarDesglose, actualizar);
    }
}
function actualizar(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.timeout = 600000; //10min
        Ext.Ajax.request({
            url: 'eliminarDesglose',
            params: {
                idactividad: gpNivActividad.getSelectionModel().getSelected().data.idactividad,
                identidad: identidadselected,
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                stGpActividadDesglose.removeAll();
                btnGuardarDesglose.disable();
                btnEliminarDesglose.disable();
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 1)
                    mostrarMensaje(1, perfil.etiquetas.msgDesglosesEliminados);
                else if (responseData.codMsgE == 21)
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                else if (responseData.codMsgE == 3)
                    mostrarMensaje(1, responseData.mensaje);
                gridCentral.getStore().load({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        });
    }
}
function AsociarObjetoGasto() {
    btnCancelar = new Ext.Toolbar.Button({
        id: 'btncancelar',
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbCancelar,
        handler: function() {
            winAsociar.close();
        }
    });
    btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        iconCls: 'asociar',
        text: perfil.etiquetas.lbBtnGestAsoc,
        handler: function() {
            idnaes = [];
            del = 0;
            idplanificaciones = [];
            selections = gpNAE.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                idnaes.push(selections[i].id);
            }
            selections_plan = winAsociar.planificaciones;
            for (var j = 0; j < selections_plan.length; j++) {
                idplanificaciones.push(selections_plan[j].data.idplanificacion);
            }
            if (idplanificaciones.length > 1)
                del = 1;
            if (gpNAE.getSelectionModel().getSelected() && gpOG.getSelectionModel().getSelected() && selections_plan) {
                mymasknae = new Ext.LoadMask(Ext.getBody(), {
                    msg: perfil.etiquetas.lbEspere
                });
                mymasknae.show();
                Ext.Ajax.request({
                    url: 'asociarmodeloaobjetogasto',
                    params: {
                        idplanificaciones: Ext.encode(idplanificaciones),
                        idnaes: Ext.encode(idnaes),
                        del: del,
                        idobjgasto: gpOG.getSelectionModel().getSelected().id,
                        idejercicio: cbEjercicio.getValue()
                    },
                    callback: function(options, success, response) {
                        respuesta = Ext.decode(response.responseText);
                        mymasknae.hide();
                        if (respuesta.cod == 3) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                        } else if (respuesta.cod == 1) {
                            winAsociar.close();
                            mostrarMensaje(1, perfil.etiquetas.msgCambiosOK, function() {
                                storeAsociadoaPresupuesto.reload();
                            });
                        }
                    }
                });
            } else {
                mostrarMensaje(1, perfil.etiquetas.msgDebeSeleccionarNAE);
            }
        }
    });

    storeNAE = new Ext.data.Store({
        url: 'cargarnaes',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [{
                name: 'idnae'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }]), listeners: {
            beforeload: function(s) {
                s.baseParams.start = pgactual;
                s.baseParams.limit = cbPaginado1.getValue();
            }
        }
    });
    filtrosNAE = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    myColumnModel = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_
        }, {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbNAE,
            tooltip: perfil.etiquetas.lbNAEconomica,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    smNAE = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                gpOG.enable();
                var aux = (obj) ? obj[0] : [];
                if (aux.length == 0)
                    aux.DatPlanificacionnae = [];
                var flag = false;
                for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                    if (aux.DatPlanificacionnae[i].idnae == record.id) {
                        gpOG.getStore().each(function(r) {
                            if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto.idobjetogasto) {
                                gpOG.getSelectionModel().clearSelections();
                                Ext.get('checkgridogog_' + r.id).dom.checked = true;
                                Ext.get('checkgridnaeog_' + record.id).dom.checked = true;
                            }
                        });
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    gpOG.getStore().each(function(r) {
                        gpOG.getSelectionModel().clearSelections();
                        Ext.get('checkgridogog_' + r.id).dom.checked = false;
                    });
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gpOG.getSelectionModel().selectAll();
                    gpOG.getSelectionModel().clearSelections();
                    gpOG.disable();
                } else {
                    var aux = (obj) ? obj[0] : [];
                    if (aux.length == 0)
                        aux.DatPlanificacionnae = [];
                    var flag = false;
                    for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                        if (aux.DatPlanificacionnae[i].idnae == record.id) {
                            gpOG.getStore().each(function(r) {
                                if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto.idobjetogasto) {
                                    gpOG.getSelectionModel().clearSelections();
                                    Ext.get('checkgridogog_' + r.id).dom.checked = false;
                                }
                            });
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        Ext.get('checkgridnaeog_' + record.id).dom.checked = false;
                }
            }
        }
    });
    btnLimpiarFiltrosP = new Ext.Button({
        id: 'btnLimpiarFiltrosP',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosNAE.clearFilters();
            storeNAE.reload();
        }
    });
    stCbPaginado1 = new Ext.data.SimpleStore({
        fields: ['idnumpagi', 'dennumpagi'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });
    cbPaginado1 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado1,
        displayField: 'dennumpagi',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagi',
        valueField: 'idnumpagi',
        width: 60,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado2').pageSize = record.data.idnumpagi;
                Ext.getCmp('paginado2').doLoad(Ext.getCmp('paginado2').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    paginado2 = new Ext.PagingToolbar({
        pageSize: cbPaginado1.getValue(),
        store: storeNAE,
        id: 'paginado2',
        displayInfo: true,
        listeners: {
            beforechange: function(p, e) {
                pgactual = e.start;
            }
        },
        items: [btnLimpiarFiltrosP, cbPaginado1]
    });
    gpNAE = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbNAEconomica,
        region: 'west',
        store: storeNAE,
        plugins: filtrosNAE,
        cm: myColumnModel,
        sm: smNAE,
        autoExpandColumn: 'expandir',
        height: 250,
        width: 450,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado2,
        contextmenu: new Ext.menu.Menu({
            items: [{
                    iconCls: 'eliminar',
                    handler: function() {
                        selections = gpNAE.getSelectionModel().getSelections();
                        idnaes = [];
                        idplanificaciones = [];
                        for (var i = 0; i < selections.length; i++) {
                            idnaes.push(selections[i].id);
                        }
                        selections_plan = winAsociar.planificaciones
                        for (var j = 0; j < selections_plan.length; j++) {
                            idplanificaciones.push(selections_plan[j].data.idplanificacion);
                        }
                        mymaskaog = new Ext.LoadMask(Ext.getBody(), {
                            msg: perfil.etiquetas.msgEliminandoAsociacion
                        });
                        mymaskaog.show();
                        Ext.Ajax.request({
                            url: 'eliminarasociacionesnaeobjetogasto',
                            params: {
                                idnaes: Ext.encode(idnaes),
                                idplanificaciones: Ext.encode(idplanificaciones),
                                idejercicio: cbEjercicio.getValue()
                            },
                            callback: function(options, success, response) {
                                response = Ext.decode(response.responseText);
                                mymaskaog.hide(0);
                                if (response.cod == 1) {
                                    winAsociar.close();
                                    mostrarMensaje(1, perfil.etiquetas.msgAsociacionesEliminadas, function() {
                                        storeAsociadoaPresupuesto.reload();
                                    });
                                }
                            }
                        });
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(grid_this, row_index, event) {
                event.stopEvent();
                grid_this.getSelectionModel().selectRow(row_index);
                selections = grid_this.getSelectionModel().getSelections();
                if (grid_this.getSelectionModel().hasSelection()) {
                    if (selections.length > 1) {
                        grid_this.contextmenu.items.itemAt(0).setText(perfil.etiquetas.lbEliminarAsociaciones);
                    } else {
                        grid_this.contextmenu.items.itemAt(0).setText(perfil.etiquetas.lbEliminarAsociacion);
                    }
                    grid_this.contextmenu.showAt(event.getXY());
                }
            }
        }
    });
    storeOG = new Ext.data.Store({
        url: 'cargarobjetosgasto',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idobjetogasto'
        }, [{
                name: 'idobjetogasto'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function(s) {
                s.baseParams.start = pgactual2;
                s.baseParams.limit = cbPaginado3.getValue();
            }
        }
    });
    myColumnModelOG = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_OG
        }, {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'idcolumnog',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    filtrosOG = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                storeOG.each(function(rec) {
                    Ext.get('checkgridogog_' + rec.id).dom.checked = false;
                });
                if (!Ext.get('checkgridogog_' + record.id).dom.checked) {
                    Ext.get('checkgridogog_' + record.id).dom.checked = true;
                    sel_.checked = true;
                    entro_ = true;
                }
                naes = smNAE.getSelections();
                for (var i = 0; i < naes.length; i++) {
                    Ext.get('checkgridnaeog_' + naes[i].id).dom.checked = true;
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (Ext.get('checkgridogog_' + record.id).dom.checked) {
                    Ext.get('checkgridogog_' + record.id).dom.checked = false;
                    sel_.checked = false;
                    entro_ = true;
                }
                naes = smNAE.getSelections();
                if (!_this.hasSelection()) {
                    naes = storeNAE;
                    naes.each(function(record_) {
                        Ext.get('checkgridnaeog_' + record_.id).dom.checked = false;
                    });
                    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
                    for (var i = 0; i < aux.length; i++) {
                        naes.each(function(record_1) {
                            if (record_1.id == aux[i].idnae) {
                                Ext.get('checkgridnaeog_' + record_1.id).dom.checked = true;
                            }
                        });
                    }
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
                sel_ = _this.getSelections();
            }
        }
    });
    btnLimpiarFiltrosOG = new Ext.Button({
        id: 'btnLimpiarFiltrosOG',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosOG.clearFilters();
            storeOG.reload();
        }
    });
    stCbPaginado3 = new Ext.data.SimpleStore({
        fields: ['idnumpagina', 'dennumpagina'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });
    cbPaginado3 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado3,
        displayField: 'dennumpagina',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagina',
        valueField: 'idnumpagina',
        width: 60,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado1').pageSize = record.data.idnumpagina;
                Ext.getCmp('paginado1').doLoad(Ext.getCmp('paginado1').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    paginado1 = new Ext.PagingToolbar({
        pageSize: cbPaginado3.getValue(),
        store: storeOG,
        id: 'paginado1',
        displayInfo: true,
        listeners: {
            beforechange: function(p, e) {
                pgactual = e.start;
            }
        },
        items: [btnLimpiarFiltrosOG, cbPaginado3]
    });
    gpOG = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbObjetoGasto,
        region: 'center',
        id: 'gpOG',
        store: storeOG,
        cm: myColumnModelOG,
        plugins: filtrosOG,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumnog',
        height: 250,
        width: 200,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado1,
        listeners: {
            start: 0,
            limit: 20
        }
    });
    winAsociar = new Ext.Window({
        title: perfil.etiquetas.lbBtnAsocObjetoGasto,
        width: 1000,
        layout: 'border',
        constrain: true,
        height: 300,
        modal: true,
        planificaciones: smGpAsociadoaPresupuesto.getSelections(),
        closeAction: 'destroy',
        buttons: [btnCancelar, btnAsociar],
        items: [gpNAE, gpOG]
    });
    cont = 0;
    storeNAE.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociar.show();
            }
        }
    });
    storeOG.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociar.show();
            }
        }
    });
}
function getCheck_(value, metadata, record, rowindex, colindex, store) {
    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
    var check = "<input onclick='stopEvent(this.id)' type='checkbox' id='" + "checkgridnaeog_" + record.id + "'>";
    for (var i = 0; i < aux.length; i++) {
        if (record.id == aux[i].idnae) {
            check = "<input onclick='stopEvent(this.id)'  id='" + "checkgridnaeog_" + record.id + "' type='checkbox' checked='true'>";
        }
    }
    return check;
}
function getCheck_OG(value, metadata, record, rowindex, colindex, store) {
    var check = "<input onclick='selectRow_(this.id)' type='checkbox' id='" + "checkgridogog_" + record.id + "'>";
    return check;
}
function getCheck_RF(value, metadata, record, rowindex, colindex, store) {
    var check = "<input onclick='selectRow(this.id)' type='checkbox' id='" + "checkgridrfrf_" + record.id + "'>";
    return check;
}
function getRawValue(v, cmb, g, c) {
    var arrid = (v != null) ? v.split(",") : '';
    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
    }
    return str;
}
function stopEvent(id) {
    check = Ext.get(id);
    check.dom.checked = !check.dom.checked;
}
function selectRow(id) {
    idrecord = id.substr(14, id.length);
    check = Ext.get(id);
    store = Ext.getCmp('gpRF').getStore();
    if (entro)
        check.dom.checked = sel.checked;
    if (!check.dom.checked) {
        index = store.find('idingreso', idrecord);
        Ext.getCmp('gpRF').getSelectionModel().deselectRow(index);
    }
    entro = false;
}
function selectRow_(id) {
    idrecord = id.substr(14, id.length);
    check = Ext.get(id);
    store = Ext.getCmp('gpOG').getStore();
    if (entro_)
        check.dom.checked = sel_.checked;
    if (!check.dom.checked) {
        index = store.find('idobjetogasto', idrecord);
        Ext.getCmp('gpOG').getSelectionModel().deselectRow(index);
    }
    entro_ = false;
}
function recursofinaciero() {
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                storeRecurso.each(function(rec) {
                    Ext.get('checkgridrfrf_' + rec.id).dom.checked = false;
                });
                if (!Ext.get('checkgridrfrf_' + record.id).dom.checked) {
                    Ext.get('checkgridrfrf_' + record.id).dom.checked = true;
                    sel.checked = true;
                    entro = true;
                }
                naes = smNAE.getSelections();
                for (var i = 0; i < naes.length; i++) {
                    Ext.get('checkgridnaerf_' + naes[i].id).dom.checked = true;
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (Ext.get('checkgridrfrf_' + record.id).dom.checked) {
                    Ext.get('checkgridrfrf_' + record.id).dom.checked = false;
                    sel.checked = false;
                    entro = true;
                }
                naes = smNAE.getSelections();
                if (!_this.hasSelection()) {
                    naes = storeNAE;
                    naes.each(function(record_) {
                        Ext.get('checkgridnaerf_' + record_.id).dom.checked = false;
                    });
                    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
                    for (var i = 0; i < aux.length; i++) {
                        naes.each(function(record_1) {
                            if (record_1.id == aux[i].idnae) {
                                Ext.get('checkgridnaerf_' + record_1.id).dom.checked = true;
                            }
                        });
                    }
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
                sel = _this.getSelections();
            }
        }
    });
    smNAE = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                gpRF.enable();
                var aux = (obj) ? obj[0] : [];
                if (aux.length == 0)
                    aux.DatPlanificacionnae = [];
                var flag = false;
                for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                    if (aux.DatPlanificacionnae[i].idnae == record.id) {
                        gpRF.getStore().each(function(r) {
                            if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso.idingreso) {
                                gpRF.getSelectionModel().clearSelections();
                                Ext.get('checkgridrfrf_' + r.id).dom.checked = true;
                                Ext.get('checkgridnaerf_' + record.id).dom.checked = true;
                            }
                        });
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    gpRF.getStore().each(function(r) {
                        gpRF.getSelectionModel().clearSelections();
                        Ext.get('checkgridrfrf_' + r.id).dom.checked = false;
                    });
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gpRF.getSelectionModel().selectAll();
                    gpRF.getSelectionModel().clearSelections();
                    gpRF.disable();
                } else {
                    var aux = obj[0];
                    var flag = false;
                    for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                        if (aux.DatPlanificacionnae[i].idnae == record.id) {
                            gpRF.getStore().each(function(r) {
                                if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso.idingreso) {
                                    gpRF.getSelectionModel().clearSelections();
                                    Ext.get('checkgridrfrf_' + r.id).dom.checked = false;
                                }
                            });
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        Ext.get('checkgridnaerf_' + record.id).dom.checked = false;
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
            }
        }
    });
    //creando el repositorio de datos
    storeNAE = new Ext.data.Store({
        url: 'cargarnaes',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [{
                name: 'idnae'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //Creando el objeto Ext.grid.ColumnModel
    myColumnModel = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck
        }, {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbNAE,
            tooltip: perfil.etiquetas.lbNAE,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    btnLimpiarFiltrosP = new Ext.Button({
        id: 'btnLimpiarFiltrosP',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosNAE.clearFilters();
            storeNAE.reload();
        }
    });
    stCbPaginado3 = new Ext.data.SimpleStore({
        fields: ['idnumpagin', 'dennumpagin'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });
    cbPaginado3 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado3,
        displayField: 'dennumpagin',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagin',
        valueField: 'idnumpagin',
        width: 60,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado3').pageSize = record.data.idnumpagin;
                Ext.getCmp('paginado3').doLoad(Ext.getCmp('paginado3').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    //creamos una variable para referenciar a nuesto objeto
    paginado3 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeNAE,
        id: 'paginado3',
        displayInfo: true,
        items: [btnLimpiarFiltrosP, cbPaginado3]
    });
    filtrosNAE = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    gpNAE = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbNAEconomica,
        region: 'west',
        store: storeNAE,
        cm: myColumnModel,
        sm: smNAE,
        plugins: filtrosNAE,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado3,
        contextmenu: new Ext.menu.Menu({
            items: [{
                    iconCls: 'eliminar',
                    handler: function() {
                        selections = gpNAE.getSelectionModel().getSelections();
                        idnaes = [];
                        idplanificaciones = [];
                        for (var i = 0; i < selections.length; i++) {
                            idnaes.push(selections[i].id);
                        }
                        selections_plan = winAsociarRF.planificaciones
                        for (var j = 0; j < selections_plan.length; j++) {
                            idplanificaciones.push(selections_plan[j].data.idplanificacion);
                        }
                        mymasknae = new Ext.LoadMask(Ext.getBody(), {
                            msg: perfil.etiquetas.msgEliminandoAsociacion
                        });
                        mymasknae.show();
                        Ext.Ajax.request({
                            url: 'eliminarasociacionesnaerecursos',
                            params: {
                                idnaes: Ext.encode(idnaes),
                                idplanificaciones: Ext.encode(idplanificaciones),
                                idejercicio: cbEjercicio.getValue()

                            },
                            callback: function(options, success, response) {
                                response = Ext.decode(response.responseText);
                                mymasknae.hide();
                                if (response.cod == 1) {
                                    winAsociarRF.close();
                                    mostrarMensaje(1, perfil.etiquetas.msgAsociacionesEliminadas, function() {
                                        storeAsociadoaPresupuesto.reload();
                                    });
                                }
                            }
                        });
                    }
                }]
        }),
        autoExpandColumn: 'expandir',
        height: 250,
        width: 480,
        listeners: {
            rowcontextmenu: function(grid_this, row_index, event) {
                event.stopEvent();
                grid_this.getSelectionModel().selectRow(row_index);
                selections = grid_this.getSelectionModel().getSelections();
                if (grid_this.getSelectionModel().hasSelection()) {
                    if (selections.length > 1) {
                        grid_this.contextmenu.items.itemAt(0).setText(perfil.etiquetas.lbEliminarAsociaciones);
                    } else {
                        grid_this.contextmenu.items.itemAt(0).setText(perfil.etiquetas.lbEliminarAsociacion);
                    }
                    grid_this.contextmenu.showAt(event.getXY());
                }
            }
        }
    });
    gpNAE.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    //creando el repositorio de datos
    storeRecurso = new Ext.data.Store({
        url: 'cargarnrecursosfinacieros',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idrecursofinanciero'
        }, [{
                name: 'idrecursofinanciero'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    stCbPaginado = new Ext.data.SimpleStore({
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
    });
    cbPaginado = new Ext.form.ComboBox({
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
        width: 60,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginadoRF').pageSize = record.data.idnumpag;
                Ext.getCmp('paginadoRF').doLoad(Ext.getCmp('paginadoRF').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    btnLimpiarFiltrosRF = new Ext.Button({
        id: 'btnLimpiarFiltrosRF',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosRF.clearFilters();
            storeRecurso.reload();
        }
    });
    paginadoRF = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeRecurso,
        id: 'paginadoRF',
        displayInfo: true,
        items: [btnLimpiarFiltrosRF, cbPaginado]
    });
    //Creando el objeto Ext.grid.ColumnModel
    myColumnModelRF = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_RF
        }, {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'idcolumrf',
            header: perfil.etiquetas.lbRecursoFinanciero,
            tooltip: perfil.etiquetas.lbRecursoFinanciero,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    filtrosRF = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    //creamos una variable para referenciar a nuesto objeto

    gpRF = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbRecursoFinanciero,
        region: 'center',
        store: storeRecurso,
        plugins: filtrosRF,
        id: 'gpRF',
        cm: myColumnModelRF,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumrf',
        height: 250,
        width: 200,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginadoRF,
        listeners: {
            start: 0,
            limit: 20,
            rowclick: function(_this, rowindex, event) {
            }
        }
    });
    gpRF.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    btnCancelar = new Ext.Toolbar.Button({
        id: 'btncancelarrf',
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbCancelar,
        handler: function() {
            winAsociarRF.close();
        }
    });
    btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        iconCls: 'asociar',
        text: perfil.etiquetas.lbAsociar,
        handler: function() {
            idnaes = [];
            idplanificaciones = [];
            del = 0;
            selections = gpNAE.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                idnaes.push(selections[i].id);
            }
            selections_plan = winAsociarRF.planificaciones
            for (var j = 0; j < selections_plan.length; j++) {
                idplanificaciones.push(selections_plan[j].data.idplanificacion);
            }
            if (idplanificaciones.length > 1)
                del = true;
            mymasknae = new Ext.LoadMask(Ext.getBody(), {
                msg: perfil.etiquetas.lbEspere
            });
            mymasknae.show();
            Ext.Ajax.request({
                url: 'asociarmodeloarecursofinaciero',
                params: {
                    idplanificaciones: Ext.encode(idplanificaciones),
                    idnaes: Ext.encode(idnaes),
                    del: del,
                    idingreso: gpRF.getSelectionModel().getSelected().id,
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function(options, success, response) {
                    respuesta = Ext.decode(response.responseText);
                    mymasknae.hide();
                    if (respuesta.cod == 3) {
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                    } else if (respuesta.cod == 1) {
                        winAsociarRF.close();
                        mostrarMensaje(1, perfil.etiquetas.msgCambiosOK, function() {
                            storeAsociadoaPresupuesto.reload();
                        });
                    }
                }
            });
        }
    });
    winAsociarRF = new Ext.Window({
        title: perfil.etiquetas.lbBtnAsocRecFinanciero,
        width: 1000,
        layout: 'border',
        constrain: true,
        height: 300,
        planificaciones: smGpAsociadoaPresupuesto.getSelections(),
        modal: true,
        closeAction: 'destroy',
        buttons: [btnCancelar, btnAsociar],
        items: [gpNAE, gpRF]
    })
    var cont = 0;
    Ext.getBody().mask(perfil.etiquetas.lbCargando, 'ext-el-mask-msg x-mask-loading');
    storeNAE.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociarRF.show();
            }
        }
    });
    storeRecurso.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociarRF.show();
            }
        }
    });
}
function getCheck(value, metadata, record, rowindex, colindex, store) {
    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
    var check = "<input onclick='stopEvent(this.id)' type='checkbox' id='" + "checkgridnaerf_" + record.id + "'>";
    for (var i = 0; i < aux.length; i++) {
        if (record.id == aux[i].idnae) {
            check = "<input onclick='stopEvent(this.id)'  id='" + "checkgridnaerf_" + record.id + "' type='checkbox' checked='true'>";
        }
    }
    return check;
}
function verDetalle() {
    stgpEntidadDemandante = new Ext.data.Store({
        url: 'listarDemandada',
        enableKeyEvents: true,
        listeners: {
            beforeload: function() {
                stgpEntidadDemandante.baseParams.idejercicio = cbEjercicio.getValue();
                stgpEntidadDemandante.baseParams.idactividad = smNivActividad.getSelected().data.idactividad;
            },
            load: function() {
                if (stgpEntidadDemandante.getCount() == 0 && filtrosgpEntidadDemandante.getFiltrosActivos().length > 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'denominacionespecialidad'
            }, {
                name: 'nivel'
            }, {
                name: 'denominacionentidad'
            }])
    });
    smgpEntidadDemandante = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    cmgpEntidadDemandante = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbEspecialidad,
            tooltip: perfil.etiquetas.lbEspecialidad,
            id: 'expandir',
            dataIndex: 'denominacionespecialidad',
            sortable: true,
            width: 100,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEntidad,
            tooltip: perfil.etiquetas.lbEntidad,
            sortable: true,
            dataIndex: 'denominacionentidad',
            renderer: crearToolTip
        }, {
            width: 50,
            header: perfil.etiquetas.lbNivel2,
            tooltip: perfil.etiquetas.lbNivel2,
            dataIndex: 'nivel',
            sortable: true,
            renderer: crearToolTip
        }
    ]);
    filtrosgpEntidadDemandante = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'denominacionespecialidad',
                idcombo: 'cbfiltroespecialidades',
                urlcb: 'cargarEntidadesPadre',
                valueFieldcb: 'id',
                displayFieldcb: 'text',
                idstore: 'stCmblistarEspecialidad',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
            }, {
                type: 'listado',
                dataIndex: 'denominacionentidad',
                idcombo: 'cbfiltroentidades',
                urlcb: 'cargarEntidadescombo',
                valueFieldcb: 'id',
                displayFieldcb: 'text',
                idstore: 'stCmblistarEntidad',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'nivel'
            }]
    });
    btnLimpiarFiltrosEntidadDemandante = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosEntidadDemandante',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            filtrosgpEntidadDemandante.clearFilters();
            gpEntidadDemandante.setTitle(perfil.etiquetas.lbEntidadDemandante);
        }
    });
    gpEntidadDemandante = new Ext.grid.EditorGridPanel({
        frame: true,
        title: perfil.etiquetas.lbEntidadDemandante,
        id: 'gpEntidadDemandante',
        store: stgpEntidadDemandante,
        plugins: filtrosgpEntidadDemandante,
        region: 'north',
        height: 180,
        autoWidth: true,
        split: true,
        margins: '2 2 2 -4',
        sm: smgpEntidadDemandante,
        cm: cmgpEntidadDemandante,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        }, bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stgpEntidadDemandante,
            displayInfo: true,
            items: [
                '-', btnLimpiarFiltrosEntidadDemandante]
        })
    });
    stgpEntidadCompartida = new Ext.data.Store({
        url: 'listarCompartida',
        enableKeyEvents: true,
        listeners: {
            beforeload: function() {
                stgpEntidadCompartida.baseParams.idejercicio = cbEjercicio.getValue();
                stgpEntidadCompartida.baseParams.idactividad = smNivActividad.getSelected().data.idactividad;
            },
            load: function() {
                if (stgpEntidadCompartida.getCount() == 0 && filtrosgpEntidadCompartida.getFiltrosActivos().length > 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'denominacionespecialidad'
            }, {
                name: 'nivel'
            }, {
                name: 'denominacionentidad'
            }])
    });
    smgpEntidadCompartida = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    cmgpEntidadCompartida = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbEspecialidad,
            tooltip: perfil.etiquetas.lbEspecialidad,
            id: 'expandir',
            dataIndex: 'denominacionespecialidad',
            sortable: true,
            width: 100,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEntidad,
            tooltip: perfil.etiquetas.lbEntidad,
            sortable: true,
            dataIndex: 'denominacionentidad',
            renderer: crearToolTip
        }, {
            width: 50,
            header: perfil.etiquetas.lbNivel2,
            tooltip: perfil.etiquetas.lbNivel2,
            dataIndex: 'nivel',
            sortable: true,
            renderer: crearToolTip
        }
    ]);
    stCmblistarEntidad = new Ext.data.Store({
        id: 'stCmblistarEntidad',
        url: 'cargarEntidadescombo',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'text'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function() {
            }
        }
    });
    stCmblistarEspecialidad = new Ext.data.Store({
        id: 'stCmblistarEspecialidad',
        url: 'cargarEntidadesPadre',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'text'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function() {
            }
        }
    });
    filtrosgpEntidadCompartida = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'denominacionespecialidad',
                idcombo: 'cbfiltroespecialidades',
                urlcb: 'cargarEntidadesPadre',
                valueFieldcb: 'id',
                displayFieldcb: 'text',
                idstore: 'stCmblistarEspecialidad',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
            }, {
                type: 'listado',
                dataIndex: 'denominacionentidad',
                idcombo: 'cbfiltroentidades',
                urlcb: 'cargarEntidadescombo',
                valueFieldcb: 'id',
                displayFieldcb: 'text',
                idstore: 'stCmblistarEntidad',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'nivel'
            }]
    });
    btnLimpiarFiltrosEntidadCompartida = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosnormas',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            filtrosgpEntidadCompartida.clearFilters();
            gpEntidadCompartida.setTitle(perfil.etiquetas.lbEntidadQueComparte);
        }
    });
    gpEntidadCompartida = new Ext.grid.EditorGridPanel({
        frame: true,
        title: perfil.etiquetas.lbEntidadQueComparte,
        id: 'gpEntidadCompartida',
        store: stgpEntidadCompartida,
        plugins: filtrosgpEntidadCompartida,
        region: 'center',
        autoWidth: true,
        autoHeigth: true,
        split: true,
        margins: '2 2 2 -4',
        sm: smgpEntidadCompartida,
        cm: cmgpEntidadCompartida,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stgpEntidadCompartida,
            displayInfo: true,
            items: [
                '-', btnLimpiarFiltrosEntidadCompartida]
        })
    });

    stGpGestNorm = new Ext.data.Store({
        url: 'listarNormas',
        enableKeyEvents: true,
        listeners: {
            beforeload: function() {
                cambiarTituloFiltrarNormas();
                stGpGestNorm.baseParams.idejercicio = cbEjercicio.getValue();
                if (smNivActividad.getSelected() != undefined) {
                    stGpGestNorm.baseParams.idactividad = smNivActividad.getSelected().data.idactividad;
                }
            },
            load: function() {
                calcularImporteTotalActividadGripNorma();
                if (stGpGestNorm.getCount() == 0 && filtrosnorma.getFiltrosActivos().length > 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idnorma'
        }, [{
                name: 'idactividad'
            }, {
                name: 'idindicador'
            }, {
                name: 'idnorma'
            }, {
                name: 'cantbase'
            }, {
                name: 'cantplanif'
            }, {
                name: 'version'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'umedida'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'importe'
            }, {
                name: 'importedivisa'
            }, {
                name: 'necesidad'
            }, {
                name: 'centrobalance'
            }, {
                name: 'numeropieza',
                mapping: 'numeropieza'
            }, {
                name: 'estado',
                mapping: 'NomIndicador.estado'
            }, {
                name: 'importetotalactividad'
            }])
    });
    filtrosnorma = new Ext.grid.GridFilters({
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
                idcombo: 'idcbunidadmedida',
                urlcb: 'cargarunidadmedida',
                idstore: 'idtodasunidadesmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [perfil.etiquetas.lbNo,
                    perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbRector]
            }, {
                type: 'numeric',
                dataIndex: 'cantplanif'
            }, {
                type: 'numeric',
                dataIndex: 'cantbase'
            }, {
                type: 'numeric',
                dataIndex: 'necesidad'
            }, {
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'idcbcentrobalanceindicadornorma',
                urlcb: 'listarCentroBalance',
                idstore: 'idtodascentrosbalanceindicadornorma',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'numeric',
                dataIndex: 'importedivisa'
            }, {
                type: 'string',
                dataIndex: 'denominacionindicador'
            }, {
                type: 'numeric',
                dataIndex: 'valorcontrol'
            }, {
                type: 'string',
                dataIndex: 'denomicionactgenera'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadbase'
            }]
    });
    smGpGestAct = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    cmnorma = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            width: 100,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNroPieza,
            tooltip: perfil.etiquetas.lbNroPieza,
            width: 80,
            sortable: true,
            dataIndex: 'numeropieza',
            renderer: crearToolTip
        }, {
            width: 200,
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            width: 100,
            id: 'umedida',
            header: perfil.etiquetas.lbUnidadMedida,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbPreciomn,
            tooltip: perfil.etiquetas.lbPreciomn,
            width: 80,
            align: 'right',
            dataIndex: 'precio',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPreciomlc,
            tooltip: perfil.etiquetas.lbPreciomlc,
            width: 80,
            align: 'right',
            dataIndex: 'preciodivisa',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbActivado,
            tooltip: perfil.etiquetas.lbActivado,
            width: 60,
            align: 'center',
            dataIndex: 'estado',
            sortable: true,
            renderer: modificarEstado
        }, {
            header: perfil.etiquetas.lbAprobado,
            tooltip: perfil.etiquetas.lbAprobado,
            width: 60,
            align: 'center',
            dataIndex: 'idaprobacion',
            sortable: true,
            renderer: modificarAprobacion
        }, {
            header: perfil.etiquetas.lbFNorma,
            tooltip: perfil.etiquetas.lbFNorma,
            width: 70,
            align: 'right',
            dataIndex: 'cantplanif',
            renderer: seisdecimales,
            sortable: true
        }, {
            width: 60,
            header: perfil.etiquetas.lbBase,
            tooltip: perfil.etiquetas.lbBase,
            align: 'right',
            dataIndex: 'cantbase',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNecesidad,
            tooltip: perfil.etiquetas.lbNecesidad,
            dataIndex: 'necesidad',
            width: 80,
            sortable: true,
            align: 'right',
            renderer: seisdecimales
        }, {
            header: perfil.etiquetas.lbCentroBalance,
            tooltip: perfil.etiquetas.lbCentroBalance,
            width: 200,
            sortable: true,
            dataIndex: 'centrobalance',
            hidden: true,
            renderer: renderCentroBalance
        }, {
            header: perfil.etiquetas.lbImporte,
            tooltip: perfil.etiquetas.lbImporte,
            width: 90,
            sortable: true,
            dataIndex: 'importe',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbImportemlc,
            tooltip: perfil.etiquetas.lbImportemlc,
            width: 90,
            sortable: true,
            dataIndex: 'importedivisa',
            align: 'right',
            renderer: crearToolTip
        }
    ]);
    cmnorma.defaultSortable = true;

    btnLimpiarFiltrosnormas = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosnormas',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            filtrosnorma.clearFilters();
            gpGestNorm.setTitle('Normas');
        }
    });
    smGpGestNorm = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {}
    });
    tfimportetotalactividad = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotalactividad',
        anchor: '95%',
        align: 'right',
        disabled: false,
        maskRe: /^([.]+ ?[.]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.00'
    });
    gpGestNorm = new Ext.grid.EditorGridPanel({
        frame: true,
        title: perfil.etiquetas.lbNormas,
        id: 'gpGestNorm',
        store: stGpGestNorm,
        plugins: filtrosnorma,
        region: 'south',
        height: 200,
        autoWidth: true,
        autoHeigth: true,
        split: true,
        margins: '2 2 2 -4',
        sm: smGpGestNorm,
        cm: cmnorma,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpGestNorm,
            displayInfo: true,
            items: [
                '-', btnLimpiarFiltrosnormas, '-', {
                    xtype: 'tbtext',
                    text: '<b>' + perfil.etiquetas.lbImporteTotal
                            + '</b>'
                }, tfimportetotalactividad]
        })
    });

    panelGeneralVerDet = new Ext.Panel({
        id: 'panelGeneralVerDet',
        region: 'center',
        split: true,
        width: 270,
        layout: 'border',
        items: [gpGestNorm, gpEntidadDemandante, gpEntidadCompartida]
    });
    winVerDet = new Ext.Window({
        title: perfil.etiquetas.lbVerDetalles,
        tbar: [perfil.etiquetas.lbCodigoActividad + ':', smNivActividad.getSelected().data.codigo, perfil.etiquetas.lbDenominacionActividad + ':', smNivActividad.getSelected().data.denominacion],
        width: 1000,
        layout: 'fit',
        constrain: true,
        height: 600,
        modal: true,
        closeAction: 'destroy',
        items: [panelGeneralVerDet]
    });
    winVerDet.show();
    filtrosnorma.clearFilters();
    gpGestNorm.setTitle(perfil.etiquetas.lbNormas);
    gpGestNorm.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    if (smNivActividad.getSelected().data.comportamiento == -1) {
        gpGestNorm.getStore().reload({
            params: {
                start: 0,
                limit: 20
            }
        });
        filtrosgpEntidadCompartida.clearFilters();
        stgpEntidadCompartida.reload({
            params: {
                start: 0,
                limit: 20
            }
        });
        gpEntidadCompartida.setTitle(perfil.etiquetas.lbEntidadQueComparte);
        filtrosgpEntidadDemandante.clearFilters();
        stgpEntidadDemandante.reload({
            params: {
                start: 0,
                limit: 20
            }
        });
        gpEntidadDemandante.setTitle(perfil.etiquetas.lbEntidadDemandante);
        gpEntidadDemandante.enable();
        gpEntidadCompartida.enable();
    } else {
        gpEntidadDemandante.disable();
        gpEntidadCompartida.disable();
    }
}
function renderUM(value) {
    return getRawValue(value, Ext.getCmp('idcbunidadmedida'));
}
function modificarEstado(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}
function seisdecimales(val) {
    return parseFloat(val).toFixed(6);
}
function renderCentroBalance(value) {
    return getRawValue(value, Ext.getCmp('idcbcentrobalanceindicadornorma'));
}
function desabilitarTodasAciones() {
    Ext.getCmp('btnAprob1').disable();
    Ext.getCmp('btnDesap1').disable();
    Ext.getCmp('btnDesapAjuste1').disable();
    Ext.getCmp('btnAsociarObjetoGasto').disable();
    Ext.getCmp('verdetalle1').disable();
    Ext.getCmp('btnAprobAjuste1').disable();
    Ext.getCmp('btnGuardar').disable();
    Ext.getCmp('btnLimpiarFiltros').disable();
    Ext.getCmp('btnImportarNivelActividad').disable();
    Ext.getCmp('btnAjustar').disable();
    Ext.getCmp('btnDelDesglose').disable();
    Ext.getCmp('btnAddDesglose').disable();
    Ext.getCmp('btnAdicionarDesglose').disable();
    Ext.getCmp('btnEliminarDesglose').disable();
    Ext.getCmp('btnGuardarDesglose').disable();
    Ext.getCmp('idbtnExportar').disable();
}
function controladorDeAciones() {
    if (!esrector) {
        Ext.getCmp('btnDesglosar').enable();
        Ext.getCmp('btnAjustar').enable();
    } else {
        Ext.getCmp('btnAjustar').disable();
        Ext.getCmp('btnDesglosar').disable();
    }
    if (identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
        if (!esrector) {
            gpNivActividad.resumeEvents();
            cbEjercicio.enable();
            Ext.getCmp('btnAjustar').enable();
            Ext.getCmp('btnAjuste').enable();
            Ext.getCmp('btnAsociarObjetoGasto').hide();
            Ext.getCmp('asociarRFinanciero').hide();
            Ext.getCmp('btnAjuste').show();
            Ext.getCmp('btnDesglosar').show();
        } else {
            cbEjercicio.enable();
            gpNivActividad.resumeEvents();
            gpNivActividad.stopEditing();
            Ext.getCmp('btnDesglosar').hide();
            Ext.getCmp('btnAjustar').disable();
            Ext.getCmp('btnAjuste').enable();
            Ext.getCmp('btnAprob').disable();
            Ext.getCmp('btnDesap').disable();
        }
        if (Ext.getCmp('chkglobalNA').getValue() == false) {
            treePlanes.getRootNode().reload();
            gpNivActividad.resumeEvents();
        }
        gpNivActividad.getStore().reload({
            params: {
                idmodelo: null
            }
        });
        treePlanes.enable();
    } else {
        gpNivActividad.resumeEvents();
        gpNivActividad.stopEditing();
        gpNivActividad.getStore().removeAll();
        desabilitarTodasAciones();
        treePlanes.disable();
        if ((identidadEsOD == 0 && is_leaf) || (identidadEsOD == 0 && Ext.getCmp('chkglobalNA').getValue() == false)) {
            mostrarMensaje(1, perfil.etiquetas.msgEntidadNoEsOD);
        } else {
            gpNivActividad.getStore().reload({
                params: {
                    idmodelo: null
                }
            });
        }
        Ext.getCmp('verdetalle').show();
    }
    if (identidadEsOD == 1 || (identidadEsOD == 0 && Ext.getCmp('chkglobalNA').getValue() == true)) {
        Ext.getCmp('btnDesapAjuste').show();
        Ext.getCmp('btnDesapAjuste1').show();
        Ext.getCmp('btnAprobAjuste').show();
        Ext.getCmp('btnAprobAjuste1').show();
        if (esrector) {
            Ext.getCmp('btnAprobarToAjustes').enable();
            Ext.getCmp('btnDesaprobarToAjustes').enable();
        } else {
            Ext.getCmp('btnAprobarToAjustes').disable();
            Ext.getCmp('btnDesaprobarToAjustes').disable();
        }
        Ext.getCmp('btnAprob').show();
        Ext.getCmp('btnDesap').show();
    } else {
        Ext.getCmp('btnAprob').disable();
        Ext.getCmp('btnDesap').disable();
        Ext.getCmp('btnAprobarToAjustes').disable();
        Ext.getCmp('btnDesaprobarToAjustes').disable();
    }
}
function controladorDeAcionesDerecha() {
    if (todosAjustados && esrector) {
        Ext.getCmp('btnDesaprobarToAjustes').enable();
        Ext.getCmp('btnAprobarToAjustes').disable();
    } else if (!todosAjustados && esrector) {
        Ext.getCmp('btnDesaprobarToAjustes').disable();
        Ext.getCmp('btnAprobarToAjustes').enable();
    } else {
        if (esrector) {
            Ext.getCmp('btnDesaprobarToAjustes').enable();
            Ext.getCmp('btnAprobarToAjustes').enable();
        }
    }
    if (identidadEsOD == 1 && Ext.getCmp('chkglobalNA').getValue() == false) {
        Ext.getCmp('btnCopiarNiveles').enable();
        Ext.getCmp('btnCopiarNiveles').show();
    } else {
        if (identidadEsOD == 0) {
            gpNivActividad.resumeEvents();
            gpNivActividad.stopEditing();
            gpNivActividad.getStore().removeAll();
            desabilitarTodasAciones();
        }
    }
    if (identidadEsOD == 0 || Ext.getCmp('chkglobalNA').getValue() == true) {
        Ext.getCmp('btnCopiarNiveles').enable();
        Ext.getCmp('btnPegarNiveles').disable();
        Ext.getCmp('btnCopiarNiveles').hide();
        Ext.getCmp('btnPegarNiveles').hide();
    } else {
        Ext.getCmp('btnPegarNiveles').show();
        Ext.getCmp('btnCopiarNiveles').show();
    }
    if (identidadselected == identidadorigen) {
        Ext.getCmp('btnCopiarNiveles').enable();
        Ext.getCmp('btnPegarNiveles').disable();
    }
    if (esrector) {
        Ext.getCmp('btnCopiarNiveles').hide();
        Ext.getCmp('btnPegarNiveles').hide();
    }
    if (!esrector) {
        Ext.getCmp('btnDesaprobarToAjustes').disable();
        Ext.getCmp('btnAprobarToAjustes').disable();
    }
    gpNivActividad.getStore().reload({
        params: {
            idmodelo: null
        }
    });
}
function cambiarTituloFiltrarNormas() {
    var filtrado_por = "";
    var sep = "/";
    for (i = 0; i < filtrosnorma.getFiltrosActivos().length; i++) {
        var numberCol = gpGestNorm.getColumnModel().findColumnIndex(filtrosnorma.getFiltrosActivos()[i].dataIndex);
        if (i == filtrosnorma.getFiltrosActivos().length - 1) {
            sep = "";
        }
        filtrado_por += gpGestNorm.getColumnModel().getColumnHeader(numberCol) + sep;
    }
    if (filtrado_por != "")
        gpGestNorm.setTitle(perfil.etiquetas.lbNormas + "<i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
    else
        gpGestNorm.setTitle(perfil.etiquetas.lbNormas);
    filtrado_por = "";
}
calcularImporteTotalActividadGripNorma = function() {
    if (stGpGestNorm.getCount() > 0) {
        Ext.getCmp('importetotalactividad').setValue(stGpGestNorm.getAt(0).data.importetotalactividad);
    } else {
        Ext.getCmp('importetotalactividad').setValue('0.000');
    }
}
function exportarCalculoNivelesAct() {
    arrayActSelect = [];
    if (smNivActividad.getSelections().length > 0) {
        for (i = 0; i < smNivActividad.getSelections().length; i++) {
            arrayActSelect.push(smNivActividad.getSelections()[i].data.idactividad);
        }
    }
    var win = window.open('exportarCalculoNivelesActvAExcel?identidad=' + identidadselected + "&idejercicio=" + cbEjercicio.getValue() + "&is_leaf=" + is_leaf + '&idactividades=' + Ext.encode(arrayActSelect));
    mascaraExportar(perfil.etiquetas.lbExportandoNivs, perfil.etiquetas.lbEsperePorFavor, win);
}

function objectHasNamedListener(obj, eventType, name) {
    var listeners = obj.events[eventType].listeners;
    //trim functionality since .trim() doesn't exist in old IE
    name = name.replace(/^\s+|\s+$/g, '');
    if (listeners != undefined) {
        for (var i = 0; i < listeners.length; i++) {
            var func = listeners[i].fn;
            var funcStr = func.toString();
            var funcName = funcStr.substr('function'.length);
            funcName = funcName.substr(0, funcName.indexOf('('));
            funcName = funcName.replace(/^\s+|\s+$/g, '');
            if (funcName == name) {
                return true;
            }
        }
    }
    return false;
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
