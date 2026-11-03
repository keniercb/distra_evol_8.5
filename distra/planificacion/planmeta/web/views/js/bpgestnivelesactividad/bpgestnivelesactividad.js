var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('bpgestnivelesactividad', cargarInterfaz);
var winImp, rectora;
var estado_deshabilitado = null;
var selecciondeactividades = [];
var estado_deshabilitado = null;
var nivelseleccionado=null;
var tmconcolnomenclada = 0; //esta variable es para controlar el btnDesglosar cuando el TM tenga columnas nomencladas
var identidadselected = null, identidadEsOD = 0, entidadsel = null, pgactualcompartida = 0,
        obj, idEstructuraPadre, entidades_productoras, actaprobarajuste, importeIn, is_leaf = false,
        modificacionespendientes, identidadorigen = null, actaprobar, nivelesact, importefinal,
        aprobarOdesaprobarA = 0, AproDesaAjusteTo = 0, Ajustestodos = 0, identidaddestino = null;
var row = -1, column = -1, ent = 0, fila = 0, pgactual = 0, actajuste = 0, ajustepordesglosar = 0;
var mensajeAprobarDesaprobar = false, todosAjustados = false, pgactual2 = 0, offset = 0, cantSelect = 0;
var idaprobacion_sel = null, todos = null, columnasdinamicas = [], columna;
paginado2 = null, offsetdesg = 0;
objci = {};
objci.acciones = [];
termine_cargar = false;
var press_buscar = false, press_configurar = false, esrector = false, importes = [];
var clickderecho = 0, BarraProgreso = new BarraEstado(), campos_modificados = [];
var winParamsExport = null, datosdinamicos = null, adicionarrec = 0;
initDesgloses();
var idcolumn = "", desgloses_realizados;
//objeto del componente complemetario, en este caso para el cierre
var Cmpcomplementario = new Utilidades.Cmp.CmpBotonesComplementarios({
    elemento: 'nivel'
});
var cbaccionesDWH = Cmpcomplementario.cbacciones;
var valuecol = 0;
var tipoExportar = 0;
var gestionSegunEstEjercicioNA = true;
var offsetEntidadDemandante = 0;
var offsetEntidadCompartida = 0;
var offsetGestNorm = 0;

var offsetdin = 0, winImp = null

function cargarInterfaz() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);

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
    trEnt.addListener('contextmenu', function(node, e) {
        identidadselected = node.id;
        entidadsel = node;
        denomentidadselected = node.text;
        idEstructuraPadre = node.attributes.idEstructuraPadre;
        entidades_productoras = node.attributes.entidades_productoras;
        todos = true;
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
                if ((Ext.getCmp('chkglobalNA').getValue() == false || is_leaf) && identidadEsOD == 1) {
                    contextMenu.showAt(e.getXY());
                }

            }
        });
    });
    trEnt.addListener('click', function(n) {
        if (n.text != "Estructuras") {
            desabilitarTodasAciones();
            gpNivActividad.enable();
            if (objci.acciones.rector == true) {
                btnAprobarAjuste.show();
                btnDesapAjuste.show();
            }
            Ext.getCmp('btnAjustar').disable();
            pgridDesg.disable();
            if (typeof (stGpActividadDesglose) != 'undefined')
                stGpActividadDesglose.loadData({"data": [], "total": 0});
            smNivActividad.clearSelections();
            trEnt.getSelectionModel().select(n);
            identidadselected = n.id;
            entidadsel = n;
            denomentidadselected = n.text;
            idEstructuraPadre = n.attributes.idEstructuraPadre;
            entidades_productoras = n.attributes.entidades_productoras;
            is_leaf = n.leaf;
            if (is_leaf) {
                Ext.getCmp('chkglobalNA').hide();
            } else {
                Ext.getCmp('chkglobalNA').show();
            }
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
                    if ((Ext.getCmp('chkglobalNA').getValue() == false || is_leaf) && identidadEsOD == 1 && !objci.acciones.rector)
                        btnImportar.enable();
                    else
                        btnImportar.disable();
                }
            });

        } else {
            btnImportar.disable();
            gpNivActividad.disable();
            var store = gpNivActividad.getStore();
            store.removeAll();
            btnExportar.disable();
            btnGuardar.disable();
            cbaccionesDWH.disable();
            cbEjercicio.disable();
            btnAprob.disable();
            btnDesprob.disable();
            btnAprobarAjuste.disable();
            btnDesapAjuste.disable();
            btnVerDetalle.disable();
            btnGraficoPlanif.disable();
            Ext.getCmp('chkglobalNA').hide();
            //stNivActividad
            stNivActividad.loadData({"data": [], "total": 0});
        }
    });
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
                displayFieldcb: 'denominacion',
                autoload: true
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
                dataIndex: 'desglosada',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, 'Parcial']
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
                if (stNivActividad.getAt(i).data.desglosada == 1) {
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
                decimalPrecision: 4,
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
            /*id: 'columnanivelactividadproduccion',
             align: 'right',
             header: perfil.etiquetas.lbND,
             width: 100,
             sortable: true,
             dataIndex: 'nivelactividadproduccion',
             tooltip: perfil.etiquetas.lbTtNivDemandado,
             renderer: crearToolTip,
             editor: new Ext.form.NumberField({
             allowNegative: false,
             decimalPrecision: 4,
             enableKeyEvents: true,
             listeners: {
             keypress: function (nf, e) {
             if (e.getKey() == 100 || e.getKey() == 68)
             nf.setValue(0);
             }
             }
             })
             }, {*/
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
                decimalPrecision: 4,
                listeners: {
                    keypress: function(nf, e) {
                        if (e.getKey() == 13) {
                            var nivelact = smNivActividad.getSelected().data.nivelactividad;
                            if (smNivActividad.getSelected().data.idaprobacion == 4 && smNivActividad.getSelected().data.comportamiento != 0 && !esrector
                                    && nivelact > 0 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {
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
                valuecol = Math.round((Number(record.data.nivelactividad) + Number(record.data.ajuste)) * Math.pow(10, 4)) / Math.pow(10, 4);
                m.attr = 'ext:qtip="' + valuecol + '"';
                return valuecol.toLocaleString("en", {useGrouping: false, minimumFractionDigits: 4});
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
            dataIndex: 'desglosada',
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
        id: 'btnAprob',
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
        id: 'btnDesap',
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
        id: 'btnDesapAjuste',
        iconCls: 'icondistra-desaprobar sisplanico-verde',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbTtBtnDesaprobarAjuste + ' <b>(Alt+W+A)</b>',
        handler: function() {
            aprobarOdesaprobarA = 2;
            todos = false;
            DesaprobarAprobarAjuste();
            //mostrarMensaje(2, perfil.etiquetas., DesaprobarAprobarAjuste);
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
        id: 'btnAprobarAjuste',
        iconCls: 'icondistra-aprobar sisplanico-verde',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbTtBtnAprobarAjuste + ' <b>(Alt+Q+A)</b>',
        title: perfil.etiquetas.lbTtBtnAprobarAjuste,
        handler: function() {
            aprobarOdesaprobarA = 1;
            todos = false;
            DesaprobarAprobarAjuste();
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
            Ext.getCmp('btnDesap').disable();
            Ext.getCmp('btnAprob').disable();
        }

        if (activarAprobar) {
            Ext.getCmp('btnAprob').enable();
        } else {
            Ext.getCmp('btnAprob').disable();
        }

        if (activarDesaprobar) {
            Ext.getCmp('btnDesap').enable();
        } else {
            Ext.getCmp('btnDesap').disable();
        }

        if (selecciones.length == 0 || selecciones.length > 1) {
            if (Ext.getCmp('gridCentral') != undefined) {
                if (typeof (Ext.getCmp('gridCentral').getStore()) != 'undefined')
                {
                    Ext.getCmp('gridCentral').getStore().loadData({"data": [], "total": 0});
                    Ext.getCmp('pgridDesg').disable();
                }
            }
        }
        
        if (sm.getSelected().data.idaprobacion > 1 /*|| sm.getSelected().data.cantdesglosada != 0*/ || identidadEsOD == 0 || (Ext.getCmp('chkglobalNA').getValue() == true && !is_leaf)) {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('nivelactividadmanual'), false);
        } else {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('nivelactividadmanual'), true);
        }
        if (sm.getSelected().data.nivelactividad == 0 || (identidadEsOD == 0 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf))) {
            Ext.getCmp('btnAprob').disable();
            Ext.getCmp('btnAprobarAjuste').disable();
            Ext.getCmp('btnDesap').disable();
        }
        if (sm.getSelected().data.nivelactividad == 0 || identidadEsOD == 0 || (Ext.getCmp('chkglobalNA').getValue() == true && !is_leaf)) {
            Ext.getCmp('verdetalle').disable();
            Ext.getCmp('btnDesglosar').disable();
        } else {
            if (sm.getCount() == 1 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf) && !esrector) {
                validarTipoModeloConColumnNomencladas();
            } else {
                Ext.getCmp('btnDesglosar').disable();
            }
            Ext.getCmp('verdetalle').enable();
            Ext.getCmp('verdetalle1').enable();
            modificarbotonesaprobar(objci.acciones.rector, sm.getSelected().data.idaprobacion, sm.getSelected().data.idaprobacion);
        }

        HabilitarAjustes();
        HabilitarAprodesa();
        HabilitarDesa();
        var nivelact = smNivActividad.getSelected().data.nivelactividad;
        if (sm.getSelected().data.idaprobacion == 4 && sm.getSelected().data.comportamiento != 0 && !esrector && nivelact > 0 && (identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf))) {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('ajuste'), true);
        } else {
            cmnivelactividades.setEditable(cmnivelactividades.findColumnIndex('ajuste'), false);
        }

        if (sm.getSelected().data.idaprobacion > 1 || esrector || identidadEsOD == 0 || (Ext.getCmp('chkglobalNA').getValue() == true && !is_leaf)) {
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
            name: 'desglosada'
        }
    ]);
    smNivActividad.on("rowdeselect", function(sm, rowIndex, record) {
        if (sm.getSelections().length == 0 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf) && !esrector) {
            Ext.getCmp('btnAjustar').enable();
        }
        selecciones = sm.getSelections();
        var activar = false;
        var activarAprobar = false;
        var activarDesaprobar = false;
        for (var i = 0; i < selecciones.length; i++) {
            if (selecciones[i].data.nivelactividad > 0 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {
                activar = true;
                if (selecciones[i].data.idaprobacion == 1 && !activarAprobar) {
                    activarAprobar = true;
                } else if (selecciones[i].data.idaprobacion > 1 && !activarDesaprobar) {
                    activarDesaprobar = true;
                }
            }
        }
        if (!activar) {
            Ext.getCmp('btnDesap').disable();
            Ext.getCmp('btnAprob').disable();
        }
        if (activarAprobar) {
            Ext.getCmp('btnAprob').enable();
        } else {
            Ext.getCmp('btnAprob').disable();
        }
        if (activarDesaprobar) {
            Ext.getCmp('btnDesap').enable();
        } else {
            Ext.getCmp('btnDesap').disable();
        }
        if (selecciones.length == 0 || selecciones.length > 1) {
            if (Ext.getCmp('gridCentral') != undefined) {
                if (typeof (Ext.getCmp('gridCentral').getStore()) != 'undefined')
                {
                    Ext.getCmp('gridCentral').getStore().loadData({"data": [], "total": 0});
                    Ext.getCmp('pgridDesg').disable();
                }
            }
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
                if ((press_buscar || esta_buscando) && stNivActividad.getCount() == 0) {
                    if (filtrosnivelactividad.getFiltrosActivos() != undefined && filtrosnivelactividad.getFiltrosActivos().length > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
                    } else {
                        // mostrarMensaje(1, "No existen datos que mostrar");
                    }
                    press_buscar = false;
                }
                if (st.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgEntidadNoTieneEspecialidadAsoc);
                } else if (st.data.items[0].data.idactividadentidad == -1) {
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
                desabilitarTodasAciones();
                if (stNivActividad.getCount() > 0) {
                    Ext.getCmp('mnExportarNiv').enable();
                } else {
                    Ext.getCmp('mnExportarNiv').disable();
                }
            }
        },
        reader: jrstNivActividad
    });
    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardarCambio,
        disabled: true,
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
                            text: perfil.etiquetas.lbVerDetalles,
                            itemCls: 'x-menu-item icondistra-ver',
                            iconCls: 'imagen-none',
                            id: 'verdetalle',
                            handler: function() {
                                verDetalle();
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
                                pgridDesg.enable();
                                btnAdicionarDesglose.enable();
                                //paginadoact1.enable();
                            }
                        },
                        {
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
                            //paginadoact1.disable();
                            if (gpNivActividad.getSelectionModel().getSelected().data.cantdesglosada != 0 && !esrector && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {
                                //cargarDatos();
                                btnAdicionarDesglose.enable();
                            }
                            if (gpNivActividad.getSelectionModel().getSelected().data.cantdesglosada != 0 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {

                               size = gpNivActividad.getSelectionModel().getSelections().length;
                                if (size == 1){
                                    nivelseleccionado=gpNivActividad.getSelectionModel().getSelected().data.idactividad;
                                     cargarDatos();
                                }
                            } else {
                                // pgridDesg.collapse();                                
                                pgridDesg.disable();
                                if (typeof (stGpActividadDesglose) != 'undefined')
                                    stGpActividadDesglose.loadData({"data": [], "total": 0});
                            }
                        }
                    },
                    rowcontextmenu: function(g, r, e) {
                        e.stopEvent();
                        g.getSelectionModel().selectRow(r);
                        g.md.showAt(e.getXY());
                    },
                    beforeedit: function(cm) {
                        if (!gestionSegunEstEjercicioNA) {
                            cm.cancel = true; //aki se deshabilita el editable en la columna que se kiere modificar
                        } else {
                            cm.cancel = false; //aki se habilita el editable en la columna que se kiere modificar
                        }
                    },
                    afteredit: function(sm) {
                        if (sm.field == 'ajuste') {
                            var nivelact = smNivActividad.getSelected().data.nivelactividad;
                            if (sm.record.data.idaprobacion == 4 && sm.record.data.comportamiento != 0 && !esrector && nivelact > 0 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {
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
//panel de desgloses
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
    pgridDesg = new Ext.Panel({
        frame: true,
        id: 'pgridDesg',
        title: perfil.etiquetas.lbDesgloseActividades,
        region: 'south',
        layout: 'fit',
        split: true,
        height: 180,
        //collapsible: true, se quito momentariamente por problemas en su funcionamiento
        // collapsed: true,      
        tbar: [btnAdicionarDesglose, '-', btnEliminarDesglose, '-', btnGuardarDesglose],
    });
    smDesglose = new Ext.grid.RowSelectionModel({
        singleSelect: false,
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
        if (gestionSegunEstEjercicioNA) {
            Ext.getCmp('btnCopiarNiveles').enable();
        } else {
            Ext.getCmp('btnCopiarNiveles').disable();
        }

        Ext.getCmp('btnPegarNiveles').disable();
        identidadorigen = null;
        identidaddestino = null;
        press_buscar = false;
        btnBuscar.disable();
        Ext.getCmp('tfcodigo').reset();
        Ext.getCmp('tfdenominacionnivel').reset();
        filtrosnivelactividad.clearFilters();
        idRootNode = null;
    }

    btnExportar = new Ext.Button({
        disabled: true,
        id: 'idbtnExportar',
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbTtExportar,
        handler: function() {
            exportarNivelesAct();
        }
    });
    btnImportar = new Ext.Button({
        disabled: true,
        id: 'btnImportarNivelActividad',
        iconCls: 'importar',
        tooltip: perfil.etiquetas.lbTtImportar,
        handler: function() {
            initimportarniveles();
            estado_deshabilitado = pgridDesg.disabled;
            pgridDesg.enable();
            offsetdin = 0;
            winImportar(fpbuscar);
        }
    });
    // *********Ayuda****************
    btnAyu = new Ext.Button({
        disabled: false,
        id: 'btnAyudaNivelesActividad',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda
    });
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
        url: 'getEjercicios',
        listeners: {
            load: function(t, n, e) {
                //aki no hace falta el validar para el estado Elaboracion ya que se garantiza en Configurar ejercicios
                //que el ejercicio actual solo es de tipo estado Elaboracion
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
            }, {
                name: 'uridatosnomenclador'
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
            select: function(cb, rec, num) {
                mymask.show();
                gestionarPermiso();
                stNivActividad.reload();
                treePlanes.getRootNode().reload();
                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    habilitarDeshabilitarSegunEstadoEjercicio(false);
                } else {
                    habilitarDeshabilitarSegunEstadoEjercicio(true);
                }
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
        items: [gpNivActividad, pgridDesg]
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
                //pgridDesg.collapse();
                pgridDesg.disable();
                if (typeof (stGpActividadDesglose) != 'undefined')
                    stGpActividadDesglose.loadData({"data": [], "total": 0});
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
    chglobalNA = new Ext.form.Checkbox({
        boxLabel: 'Global',
        id: 'chkglobalNA',
        hidden: true,
        listeners: {
            check: function(ck, t) {
                controladorDeAciones();
                if ((Ext.getCmp('chkglobalNA').getValue() == false || is_leaf) && identidadEsOD == 1 && !objci.acciones.rector)
                    btnImportar.enable();
                else
                    btnImportar.disable();
            }
        }
    });
    menuExportarNive = new Ext.Toolbar.MenuButton({
        id: 'mnExportarNiv',
        iconCls: 'exportar',
        disabled: true,
        menu: {
            items: [{
                    iconCls: 'exportar',
                    text: perfil.etiquetas.lbTtExportar,
                    tooltip: perfil.etiquetas.lbTtExportar,
                    handler: function() {
                        tipoExportar = 1;
                        exportarNivelesAct();
                    }
                }, {
                    iconCls: 'exportar',
                    text: 'Exportar niveles de actividad con desgloses',
                    tooltip: 'Exportar niveles de actividad con desgloses',
                    id: 'idexportarnivdesg',
                    handler: function() {
                        tipoExportar = 2;
                        estado_deshabilitado = pgridDesg.disabled;
                        pgridDesg.enable();
                        winVentanaPlanes();
                    }
                }]
        }
    });

    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            items: [panelWest, pGrid],
            tbar: [menuExportarNive/*btnExportar*/, btnImportar, '-', btnGuardar, '-', cbaccionesDWH, btnAjustar, '-', perfil.etiquetas.lbEjercicio + ':', cbEjercicio, btnAprob,
                btnDesprob, btnAprobarAjuste, btnDesapAjuste, btnVerDetalle, btnGraficoPlanif, chglobalNA, '->', btnAyu]
        })
    });
    stNivActividad.reload({
        params: {
            start: 0
        }
    });
    smGpAsociadoaPresupuesto = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
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
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    } else {
        if (val == 0) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
            m.css = 'icondistra-false rojo';
        } else {
            m.attr = 'ext:qtip="Parcial"';
            m.css = 'icondistra-true amarillo';
        }
    }
}
function setModelo(val, m) {

    if (val == null) {
        val = '-';
    }
    m.attr = 'ext:qtip="' + val + '"';
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
                            if (stNivActividad.getAt(i).data.desglosada != 1) {
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
function cambiarTituloFiltrarNiveles() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosnivelactividad.getFiltrosActivos() == undefined || filtrosnivelactividad.getFiltrosActivos().length == 0) {
        gpNivActividad.setTitle(perfil.etiquetas.lbNivActividad);
    } else {
        for (i = 0; i < filtrosnivelactividad.getFiltrosActivos().length; i++) {
            var numberCol = cmnivelactividades.findColumnIndex(filtrosnivelactividad.getFiltrosActivos()[i].dataIndex);
            if (i == filtrosnivelactividad.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += cmnivelactividades.getColumnHeader(numberCol) + sep;
        }
        gpNivActividad.setTitle(perfil.etiquetas.lbFiltradoPorNiv + filtrado_por + '</i>');
        filtrado_por = "";
    }
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
        //mensages de salida
        var long = smNivActividad.getSelections().length;
        var msgsalida = '';

        //seleccion multiple
        var recordsSel = gpNivActividad.getSelectionModel().getSelections(), actaprobar = [];
        var aprobada_rector = false;
        for (var i = 0; i < recordsSel.length; i++) {
            if (recordsSel[i].data.idaprobacion >= '4' && !esrector && recordsSel[i].data.nivelactividadmanual > 0) {
                aprobada_rector = true;
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
            if (long == 1) {
                msgsalida = perfil.etiquetas.msgSegDesaprobarNivAct1;
            } else {
                msgsalida = perfil.etiquetas.msgSegDesaprobarNivAct2;
            }
            mostrarMensaje(2, msgsalida,
                    aprobardesaprobar);
        } else {
            if (long == 1) {
                msgsalida = perfil.etiquetas.msgSegAprobarNivAct1;
            } else {
                msgsalida = perfil.etiquetas.msgSegAprobarNivAct2;
            }
            mostrarMensaje(2, msgsalida,
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
    var long = recordsSel.length;
    var msgsalida = '';

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
                            if (long == 1) {
                                msgsalida = perfil.etiquetas.msgAprobandoAct1;
                            } else {
                                msgsalida = perfil.etiquetas.msgAprobandoAct2;
                            }
                            mostrarMensaje(1, msgsalida);
                            gpNivActividad.getStore().reload();
                        } else {
                            if (long == 1) {
                                msgsalida = perfil.etiquetas.msgDesaprobandoAct1;
                            } else {
                                msgsalida = perfil.etiquetas.msgDesaprobandoAct2;
                            }
                            mostrarMensaje(1, msgsalida);
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
function exportarNivelesAct() {
    var win = window.open('exportarNivelesActvAExcel?identidad=' + identidadselected + "&is_leaf=" + is_leaf
            + "&idejercicio=" + cbEjercicio.getValue()
            + "&glob=" + Ext.getCmp('chkglobalNA').getValue()
            + '&esrector=' + esrector + '&idEstructuraPadre=' + idEstructuraPadre + '&calcularimporte='
            + (!cmnivelactividades.getColumnById('columnaimporte').hidden) + '&calcularajustado='
            + (!cmnivelactividades.getColumnById('columnaimporteajustado').hidden) + '&calcularfinal='
            + (!cmnivelactividades.getColumnById('columnaimportefinal').hidden) + '&calcularrestoxdistrib='
            + (!cmnivelactividades.getColumnById('columnarestoxdistrib').hidden)
            + '&text=' + trEnt.getNodeById(identidadselected).text + '&tipo=' + tipoExportar + '&filtros=' + Ext.encode(filtrosnivelactividad.getFilterData()));
    mascaraExportar(perfil.etiquetas.lbExportandoNivs, perfil.etiquetas.lbEsperePorFavor, win);
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function DesaprobarAprobarAjuste() {
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
    var long = smNivActividad.getSelections().length;
    var msgsalida = '';
    var msgrespuesta = '';
    if (aprobarOdesaprobarA == 2) {
        if (long == 1) {
            msgsalida = perfil.etiquetas.msgSegDesaprobarAjustes1;
            msgrespuesta = perfil.etiquetas.msgDesaprobandoAjuste1;
        } else {
            msgsalida = perfil.etiquetas.msgSegDesaprobarAjustes2;
            msgrespuesta = perfil.etiquetas.msgDesaprobandoAjuste2;
        }

    } else {
        if (long == 1) {
            msgsalida = perfil.etiquetas.msgSegAprobarAjustes1;
            msgrespuesta = perfil.etiquetas.msgAprobandoAjuste1;
        } else {
            msgsalida = perfil.etiquetas.msgSegAprobarAjustes2;
            msgrespuesta = perfil.etiquetas.msgAprobandoAjuste2;
        }
    }


    mostrarMensaje(2, msgsalida, function(btnPresionado) {
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
                            mostrarMensaje(1, msgrespuesta);
                        else
                            mostrarMensaje(1, msgrespuesta);
                        gpNivActividad.getStore().reload();
                    } else
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                }
            });
            aprobarOdesaprobarA = 0;
            AproDesaAjusteTo = 0;
        }
    });
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
function HabilitarAjustes() {//usuario con idaprobacion 4 especcialista
    var ajuste = false;
    for (i = 0; i < smNivActividad.getSelections().length; i++) {
        if (smNivActividad.getSelections()[i].data.idaprobacion == '4' && !esrector && smNivActividad.getSelections()[i].data.comportamiento != 0 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {
            Ext.getCmp('btnAjustar').enable(); //boton Ajustar en el tb del gridpanel.
            Ext.getCmp('btnAjuste').enable(); //boton Ajustar del menu en el gridpanel.
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
        if (smNivActividad.getSelections()[i].data.idaprobacion == '4' && esrector && smNivActividad.getSelections()[i].data.ajuste != 0 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {
            Ext.getCmp('btnAprobarAjuste').enable();

            b = true;
            break;
        }
    }
    if (!b || !esrector) {
        Ext.getCmp('btnAprobarAjuste').disable();
    }
}
function HabilitarDesa() {//usuario con categoría rector y idaprobacion 5 rector
    //Aprobar Ajustes
    var b = false;
    for (i = 0; i < smNivActividad.getSelections().length; i++) {
        if (smNivActividad.getSelections()[i].data.idaprobacion == '5' && esrector && smNivActividad.getSelections()[i].data.ajuste != 0 && identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {
            Ext.getCmp('btnDesapAjuste').enable();
            b = true;
            break;
        }
    }
    if (!b || !esrector) {
        Ext.getCmp('btnDesapAjuste').disable();
    }
}
function setearImporte() {
    importes = [];
    importes.push('0.000'); //indice 0
    importes.push('0.000'); //indice 1
    importes.push('0.000'); //indice 2
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
//nivelactividad: nivelact
                nivelactividad: Math.round(nivelact * Math.pow(10, 4)) / Math.pow(10, 4)
            });
        } else {
            var p = new Fila({
//nivelactividad: (nivelact - nivelp)
                nivelactividad: Math.round((nivelact - nivelp) * Math.pow(10, 4)) / Math.pow(10, 4)
            });
        }
        Ext.getCmp('gridCentral').getStore().add(p);
        adicionarrec = 0;
    } else
        mostrarMensaje(1, perfil.etiquetas.msgNoPuedeSeguirDesglosando);
}
function cargarDatos() {
    Ext.Ajax.timeout = 600000; //10min
     mymask.show();
    Ext.Ajax.request({
        url: 'buscarColumnas',
        params: {
            idmodelo: gpNivActividad.getSelectionModel().getSelected().data.idmodelo
        },
        callback: function(options, success, response) {
            // mymask.hide();
            var responseData = Ext.decode(response.responseText);
            if (responseData) {
                reconfgrid(responseData);
                pgridDesg.add(crearGrid(/*filtrosDesg, */stGpActividadDesglose, cmGpCentral, /* paginadoact1,*/ smDesglose));
                pgridDesg.doLayout();
                //pgridDesg.expand();
                pgridDesg.enable();
                stGpActividadDesglose.reload();
            } else {
                reconfgrid();
            }

        }
    });
}
function crearGrid(/*filtrosDesg,*/ stGpActividadDesglose, cmGpCentral, /* paginadoact1,*/ smDesglose) {
    return new Ext.grid.EditorGridPanel({
        store: stGpActividadDesglose,
        id: 'gridCentral',
        region: 'center',
        sm: smDesglose,
        cm: cmGpCentral,
        frame: true,
        autoScroll: true,
        //plugins: filtrosDesg,
        margins: '2 2 2 -4',
        clicksToEdit: 2,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        //bbar: paginadoact1,
        listeners: {
            beforeedit: function(e) {
                if (esrector)
                    e.cancel = true;
                columna = e.column;
                //para el renderer luego
                cmGpCentral.getCellEditor(e.column, e.row).field.renderiza = true;
            },
            validateedit: function(e) {
                if (e.originalValue != e.value)
                    cmGpCentral.getCellEditor(e.column, e.row).field.renderiza = true;
            },
            afteredit: function() {
                btnGuardarDesglose.enable();
            }
        }
    });
}
function reconfgrid(cf) {
    filterDinamico = [];
    filterDinamico.push({
        type: 'numeric',
        dataIndex: 'nivelactividad'
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    var arrayIndexDinamicos = new Array();
    readerdina = [];
    readerdina.push({
        name: 'nivelactividad'
    });
    readerdina.push({
        name: 'iddesgloseentidadnivel'
    });
    cmdina = [];
    cmdina.push({
        header: perfil.etiquetas.lbNivel,
        width: 130,
        align: 'right',
        id: 'expandir',
        sortable: true,
        dataIndex: 'nivelactividad',
        renderer: crearToolTip,
        tooltip: perfil.etiquetas.lbNivel,
        editor: new Ext.form.NumberField({
            allowNegative: false,
            decimalPrecision: 4
        })
    });
    if (cf) {
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
            readerdina.push({
                name: cf.datos[index].uritiponomenclador
            });
            arrayIndexDinamicos.push(cf.datos[index].uritiponomenclador);
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
                })
            };

            cmdina.push(cf.datos[index]);
        }
    }

    jrStGpCentral = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data',
        //id: 'iddesgloseentidadnivel',
        llave: 'llave',
        llaveprimaria: 'llaveprimaria',
        fields: readerdina
    });
    cmGpCentral = new Ext.grid.ColumnModel(cmdina);
//para recorrer los indices dinamicos y trabajar con el render
    for (var i = 0; i < arrayIndexDinamicos.length; i++) {
        var indiceColumn = cmGpCentral.findColumnIndex(arrayIndexDinamicos[i]);
        cmGpCentral.setRenderer(indiceColumn, function(value, m, rec, row, col) {
            m.attr = 'ext:qtip="' + getRawValue(value, cmGpCentral.getCellEditor(col, row).field, cmGpCentral, col) + '"';
            return getRawValue(value, cmGpCentral.getCellEditor(col, row).field, cmGpCentral, col);
        });
    }

    stGpActividadDesglose = new Ext.data.Store({
        url: 'listarDesgloseNivelesActividad',
        listeners: {
            beforeLoad: function() {
                // mymask.show();
                console.log('nivelseleccionado');
                console.log(nivelseleccionado);
                stGpActividadDesglose.baseParams.idactividad = nivelseleccionado;
                stGpActividadDesglose.baseParams.identidad = identidadselected;
                stGpActividadDesglose.baseParams.idejercicio = cbEjercicio.getValue();
                stGpActividadDesglose.baseParams.start = offsetdesg;
            },
            load: function(st, rec, obj) {
                btnGuardarDesglose.disable();
                Ext.getCmp('btnEliminarDesglose').disable();
                var longitud = gpNivActividad.getSelectionModel().selections.length;
                if (longitud > 0)
                    pgridDesg.setTitle(perfil.etiquetas.lbDesgloseDeActividad + ' <i>' + gpNivActividad.getSelectionModel().getSelected().data.denominacion + '</i>');
                else
                    pgridDesg.setTitle(perfil.etiquetas.lbDesgloseDeActividad);
                mymask.hide();
            },
            loadexception: function() {
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        },
        reader: jrStGpCentral
    });

    filtrosDesg = new Ext.grid.GridFilters({
        filters: filterDinamico
    });
    btnLimpiarFiltrosD = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosD',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosDesg.clearFilters();
            stGpActividadDesglose.reload();
        }
    });
    paginadoact1 = new Ext.PagingToolbar({
        id: 'paginadoact1',
        store: stGpActividadDesglose,
        displayInfo: true,
        items: ['-', btnLimpiarFiltrosD],
        listeners: {
            beforechange: function(p, e) {
                offsetdesg = e.start;
            }
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
    /* else if ((parseFloat(gpNivActividad.getSelectionModel().getSelected().data.nivelactividad) + parseFloat(gpNivActividad.getSelectionModel().getSelected().data.ajuste)) > parseInt(suma))
     mostrarMensaje(1, perfil.etiquetas.msgExistenNivelesPorDesglosar);*/
    else if ((parseFloat(gpNivActividad.getSelectionModel().getSelected().data.nivelactividad) + parseFloat(gpNivActividad.getSelectionModel().getSelected().data.ajuste)) > 0 && (parseInt(suma) === 0))
        mostrarMensaje(1, perfil.etiquetas.msgVerifiqueQueNoHaDesglosado);
    else
        guardardesgloses();

}
function guardardesgloses(btn) {
    var desgloses = Ext.getCmp('gridCentral').getStore().getRange();
    var recorsm = [];
    var recorsm = Ext.getCmp('gridCentral').getStore().getModifiedRecords();
    var recordsEnviar = [];
    for (var i = 0; i < desgloses.length; i++) {
        if (desgloses[i].data.nivelactividad != null && desgloses[i].data.nivelactividad != 0) {
            recordsEnviar.push(desgloses[i].data);
        }
    }

    cantidadnull = false;

    if (recordsEnviar.length > 0) {
        mymask.show();
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
                Ext.getCmp('gridCentral').getStore().commitChanges();
                mymask.hide();
                btnGuardarDesglose.disable();
                btnEliminarDesglose.disable();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 20) {

                    if (recorsm.length == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgDesgloseRealizado);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgDesglosesRealizados);
                    }
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
        var desgloses = Ext.getCmp('gridCentral').getSelectionModel().getSelections();
        if (desgloses.length == 1)
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarDesglose, actualizar);
        else
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarDesgloses, actualizar);
    }
}
function actualizar(btnPresionado) {
    if (btnPresionado == 'ok') {
        var desgloses = Ext.getCmp('gridCentral').getSelectionModel().getSelections();
        var recordsEnviar = [];
        for (var i = 0; i < desgloses.length; i++) {
            if (desgloses[i].data.nivelactividad != null) {
                recordsEnviar.push(desgloses[i].data.iddesgloseentidadnivel);
            }
        }

        mymask.show();
        Ext.Ajax.timeout = 600000; //10min
        Ext.Ajax.request({
            url: 'eliminarDesglose',
            params: {
                idactividad: gpNivActividad.getSelectionModel().getSelected().data.idactividad,
                identidad: identidadselected,
                iddesglose: Ext.encode(recordsEnviar),
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                stGpActividadDesglose.removeAll();
                btnGuardarDesglose.disable();
                btnEliminarDesglose.disable();
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 1) {
                    if (desgloses.length == 1)
                        mostrarMensaje(1, perfil.etiquetas.msgDesglosesEliminado);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgDesglosesEliminados);
                } else if (responseData.codMsgE == 21)
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                else if (responseData.codMsgE == 3)
                    mostrarMensaje(1, responseData.mensaje);
                Ext.getCmp('gridCentral').getStore().load();
            }
        });
    }
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
function verDetalle() {
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
            start: 0
        },
        listeners: {
            load: function() {
            }
        }
    });
    //----------------------------
//    stgpEntidadDemandante = new Ext.data.Store({
//        url: 'listarDemandada',
//        enableKeyEvents: true,
//        listeners: {
//            beforeload: function() {
//                stgpEntidadDemandante.baseParams.idejercicio = cbEjercicio.getValue();
//                stgpEntidadDemandante.baseParams.idactividad = smNivActividad.getSelected().data.idactividad;
//                stgpEntidadDemandante.baseParams.start = offsetEntidadDemandante;
//            },
//            load: function() {
//                if (stgpEntidadDemandante.getCount() == 0 && filtrosgpEntidadDemandante.getFiltrosActivos().length > 0) {
//                    mostrarMensaje(1, perfil.etiquetas.msgBuscarSinResultado);
//                }
//            }
//        },
//        reader: new Ext.data.JsonReader({
//            totalProperty: 'total',
//            root: 'data'
//        }, [{
//                name: 'denominacionespecialidad'
//            }, {
//                name: 'nivel'
//            }, {
//                name: 'denominacionentidad'
//            }])
//    });
//    smgpEntidadDemandante = new Ext.grid.RowSelectionModel({
//        singleSelect: false
//    });
//    cmgpEntidadDemandante = new Ext.grid.ColumnModel([{
//            header: perfil.etiquetas.lbEspecialidad,
//            tooltip: perfil.etiquetas.lbEspecialidad,
//            id: 'expandir',
//            dataIndex: 'denominacionespecialidad',
//            sortable: true,
//            width: 200,
//            renderer: crearToolTip
//        }, {
//            header: perfil.etiquetas.lbEntidaddenom,
//            tooltip: perfil.etiquetas.lbEntidaddenom,
//            sortable: true,
//            width: 200,
//            dataIndex: 'denominacionentidad',
//            renderer: crearToolTip
//        }, {
//            width: 100,
//            header: perfil.etiquetas.lbNivel2,
//            tooltip: perfil.etiquetas.lbNivel2,
//            dataIndex: 'nivel',
//            sortable: true,
//            renderer: crearToolTip
//        }
//    ]);
//    filtrosgpEntidadDemandante = new Ext.grid.GridFilters({
//        filters: [{
//                type: 'listado',
//                dataIndex: 'denominacionespecialidad',
//                idcombo: 'idcbespecialidad',
//                urlcb: 'listarEspecialidades',
//                idstore: 'idstespecialidaddem',
//                valueFieldcb: 'idespecialidad',
//                displayFieldcb: 'denespecialidad'
//            }, {
//                type: 'listado',
//                dataIndex: 'denominacionentidad',
//                idcombo: 'cbfiltroentidades',
//                urlcb: 'cargarEntidadescombo',
//                valueFieldcb: 'id',
//                displayFieldcb: 'text',
//                idstore: 'stCmblistarEntidad',
//                mode: 'local',
//                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
//            }, {
//                type: 'numeric',
//                dataIndex: 'nivel'
//            }]
//    });
//    btnLimpiarFiltrosEntidadDemandante = new Ext.Button({
//        disabled: false,
//        id: 'btnLimpiarFiltrosEntidadDemandante',
//        iconCls: 'limpiar',
//        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
//        text: perfil.etiquetas.lbBtnLimpiar,
//        handler: function() {
//            filtrosgpEntidadDemandante.clearFilters();
//            gpEntidadDemandante.setTitle(perfil.etiquetas.lbEntidadDemandante);
//        }
//    });
//    gpEntidadDemandante = new Ext.grid.EditorGridPanel({
//        frame: true,
//        title: perfil.etiquetas.lbEntidadDemandante,
//        id: 'gpEntidadDemandante',
//        store: stgpEntidadDemandante,
//        plugins: filtrosgpEntidadDemandante,
//        region: 'north',
//        height: 180,
//        autoWidth: true,
//        split: true,
//        margins: '2 2 2 -4',
//        sm: smgpEntidadDemandante,
//        cm: cmgpEntidadDemandante,
//        loadMask: {
//            msg: perfil.etiquetas.lbEspere
//        },
//        bbar: new Ext.PagingToolbar({
//            store: stgpEntidadDemandante,
//            displayInfo: true,
//            listeners: {
//                beforechange: function(p, e) {
//                    offsetEntidadDemandante = e.start;
//                }
//            },
//            items: [
//                '-', btnLimpiarFiltrosEntidadDemandante]
//        })
//    });


    stgpEntidadCompartida = new Ext.data.Store({
        url: 'listarCompartida',
        enableKeyEvents: true,
        listeners: {
            beforeload: function() {
                stgpEntidadCompartida.baseParams.idejercicio = cbEjercicio.getValue();
                stgpEntidadCompartida.baseParams.idactividad = smNivActividad.getSelected().data.idactividad;
                stgpEntidadCompartida.baseParams.start = offsetEntidadCompartida;
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
            width: 200,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEntidaddenom,
            tooltip: perfil.etiquetas.lbEntidaddenom,
            sortable: true,
            width: 200,
            dataIndex: 'denominacionentidad',
            renderer: crearToolTip
        }, {
            width: 100,
            header: perfil.etiquetas.lbNivel2,
            tooltip: perfil.etiquetas.lbNivel2,
            dataIndex: 'nivel',
            sortable: true,
            renderer: crearToolTip
        }
    ]);
    filtrosgpEntidadCompartida = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'denominacionespecialidad',
                idcombo: 'idcbespecialidad',
                urlcb: 'listarEspecialidades',
                idstore: 'idstespecialidadcomp',
                valueFieldcb: 'idespecialidad',
                displayFieldcb: 'denespecialidad'
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
            store: stgpEntidadCompartida,
            displayInfo: true,
            listeners: {
                beforechange: function(p, e) {
                    offsetEntidadCompartida = e.start;
                }
            },
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
                stGpGestNorm.baseParams.start = offsetGestNorm;
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
                name: 'numeropieza'
            }, {
                name: 'estado'
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
            store: stGpGestNorm,
            displayInfo: true,
            listeners: {
                beforechange: function(p, e) {
                    offsetGestNorm = e.start;
                }
            },
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
        items: [gpGestNorm, /* gpEntidadDemandante,*/ gpEntidadCompartida]
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
    //filtrosnorma.clearFilters();
    gpGestNorm.setTitle(perfil.etiquetas.lbNormas);
    gpGestNorm.getStore().reload();
    if (smNivActividad.getSelected().data.comportamiento == -1) {
        //filtrosgpEntidadCompartida.clearFilters();
        stgpEntidadCompartida.reload();
        gpEntidadCompartida.setTitle(perfil.etiquetas.lbEntidadQueComparte);
        //filtrosgpEntidadDemandante.clearFilters();
        //stgpEntidadDemandante.reload();
//        gpEntidadDemandante.setTitle(perfil.etiquetas.lbEntidadDemandante);
//        gpEntidadDemandante.enable();
//        gpEntidadCompartida.enable();
    } else {
        //gpEntidadDemandante.disable();
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
    Ext.getCmp('btnAprob').disable();
    Ext.getCmp('btnDesap').disable();
    Ext.getCmp('btnDesapAjuste').disable();
    Ext.getCmp('verdetalle1').disable();
    Ext.getCmp('btnAprobarAjuste').disable();
    Ext.getCmp('btnGuardar').disable();
    //Ext.getCmp('btnLimpiarFiltros').disable();
    Ext.getCmp('btnAjustar').disable();
    Ext.getCmp('btnDelDesglose').disable();
    Ext.getCmp('btnAddDesglose').disable();
    Ext.getCmp('btnAdicionarDesglose').disable();
    Ext.getCmp('btnEliminarDesglose').disable();
    Ext.getCmp('btnGuardarDesglose').disable();
    //Ext.getCmp('idbtnExportar').disable();
    Ext.getCmp('mnExportarNiv').disable();
}
function controladorDeAciones() {
    if (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf) {
        Ext.getCmp('idexportarnivdesg').enable();
    } else {
        Ext.getCmp('idexportarnivdesg').disable();
    }

    if (!esrector) {
        Ext.getCmp('btnDesglosar').enable();
        Ext.getCmp('btnAjustar').enable();

    } else {
        Ext.getCmp('btnAjustar').disable();
        Ext.getCmp('btnDesglosar').disable();

    }
    if (identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf)) {
        if (!esrector) {
//gpNivActividad.resumeEvents();
            cbEjercicio.enable();
            Ext.getCmp('btnAjustar').enable();
            Ext.getCmp('btnAjuste').enable();
            Ext.getCmp('btnAprobarAjuste').hide();
            Ext.getCmp('btnDesapAjuste').hide();
            Ext.getCmp('btnAjuste').show();
            Ext.getCmp('btnDesglosar').show();
        } else {
            cbEjercicio.enable();
            //gpNivActividad.resumeEvents();
            //gpNivActividad.stopEditing();
            Ext.getCmp('btnDesglosar').hide();
            Ext.getCmp('btnAjustar').disable();
            Ext.getCmp('btnAjuste').enable();
            Ext.getCmp('btnAprob').disable();
            Ext.getCmp('btnDesap').disable();
        }
        if (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf) {
            treePlanes.getRootNode().reload();
            //gpNivActividad.resumeEvents();
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
        if ((identidadEsOD == 0 && is_leaf) || (identidadEsOD == 0 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf))) {
            mostrarMensaje(1, perfil.etiquetas.msgEntidadNoEsOD);
            stNivActividad.loadData({"data": [], "total": 0});
        } else {
            gpNivActividad.getStore().reload({
                params: {
                    idmodelo: null
                }
            });
        }
        Ext.getCmp('verdetalle').show();
    }

    if (identidadEsOD == 1 || (identidadEsOD == 0 && (Ext.getCmp('chkglobalNA').getValue() == true && !is_leaf))) {
        //Ext.getCmp('btnDesapAjuste').show();
        //Ext.getCmp('btnAprobarAjuste').show();

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
    if (identidadEsOD == 1 && (Ext.getCmp('chkglobalNA').getValue() == false || is_leaf) && gestionSegunEstEjercicioNA) {
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
    if (identidadEsOD == 0 || (Ext.getCmp('chkglobalNA').getValue() == true && !is_leaf) && gestionSegunEstEjercicioNA) {
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
    //var win = window.open('exportarCalculoNivelesActvAExcel?identidad=' + identidadselected + "&idejercicio=" + cbEjercicio.getValue() + "&is_leaf=" + is_leaf + '&idactividades=' + Ext.encode(arrayActSelect));
    var win = window.open('exportarCalculoNivelesActvAExcel?identidad=' + identidadselected + "&idejercicio=" + cbEjercicio.getValue() + "&glob=" + Ext.getCmp('chkglobalNA').getValue() + '&idactividades=' + Ext.encode(arrayActSelect));
    mascaraExportar(perfil.etiquetas.lbExportandoNivs, perfil.etiquetas.lbEsperePorFavor, win);
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
function winVentanaPlanes() {
    _this = this;
    _this.stCbSeleccplan = new Ext.data.Store({
        url: 'listarModeloEntidad',
        listeners: {
            beforeload: function(st, n, e) {
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
    _this.cbSeleccplan = new Ext.form.ComboBox({
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
    _this.pSeleccPlan = new Ext.FormPanel({
        id: 'idSeleccPlan',
        labelAlign: 'top',
        frame: true,
        items: [cbSeleccplan]
    });
    _this.winSeleccPlan = new Ext.Window({
        title: 'Planes',
        modal: true,
        id: 'idwinSeleccPlan',
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        width: 250,
        height: 130,
        items: [_this.pSeleccPlan],
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function() {
                    _this.winSeleccPlan.destroy();
                }
            }, {
                iconCls: 'aceptar',
                id: 'btnaceptarSeleccPlan',
                text: perfil.etiquetas.lbAceptar,
                tooltip: perfil.etiquetas.lbGuardarYCerrar,
                handler: function() {
                    exportarNivelesActConDesglose(_this.cbSeleccplan);
                    _this.winSeleccPlan.destroy();
                }
            }],
        listeners: {
            beforeshow: function() {
                _this.stCbSeleccplan.load();
            },
            destroy: function() {
                if (estado_deshabilitado == true)
                    pgridDesg.disable();
                else
                    pgridDesg.enable();
            }
        }
    });
    _this.winSeleccPlan.show();
}
function exportarNivelesActConDesglose(cbSeleccplan) {
    var win = window.open('exportarNivelesActvAExcel?identidad=' + identidadselected + "&is_leaf=" + is_leaf
            + "&idejercicio=" + cbEjercicio.getValue()
            + '&esrector=' + esrector + '&idEstructuraPadre=' + idEstructuraPadre + '&calcularimporte='
            + (!cmnivelactividades.getColumnById('columnaimporte').hidden) + '&calcularajustado='
            + (!cmnivelactividades.getColumnById('columnaimporteajustado').hidden) + '&calcularfinal='
            + (!cmnivelactividades.getColumnById('columnaimportefinal').hidden) + '&calcularrestoxdistrib='
            + (!cmnivelactividades.getColumnById('columnarestoxdistrib').hidden)
            + '&text=' + trEnt.getNodeById(identidadselected).text + '&tipo=' + tipoExportar + '&idmodelo=' + cbSeleccplan.getValue()
            + '&filtros=' + Ext.encode(filtrosnivelactividad.getFilterData()));
    mascaraExportar(perfil.etiquetas.lbExportandoNivs, perfil.etiquetas.lbEsperePorFavor, win);
}
function habilitarDeshabilitarSegunEstadoEjercicio(accion) {
    if (accion) {
        btnAjustar.enable();
        cbaccionesDWH.enable();
        btnAprob.enable();
        btnDesprob.enable();
        btnAprobarAjuste.enable();
        btnDesapAjuste.enable();
        Ext.getCmp('btnAjuste').enable();
        Ext.getCmp('btnDesapAjuste').enable();
        Ext.getCmp('btnAprobarAjuste').enable();
        Ext.getCmp('verdetalle').enable();
        Ext.getCmp('btnDesap').enable();
        Ext.getCmp('btnAprobarTodo').enable();
        Ext.getCmp('btnDesaprobarTodo').enable();
        Ext.getCmp('btnCopiarNiveles').enable();
        Ext.getCmp('btnPegarNiveles').enable();
        Ext.getCmp('btnAprobarToAjustes').enable();
        Ext.getCmp('btnDesaprobarToAjustes').enable();
        gestionSegunEstEjercicioNA = true;
    } else {
        btnAjustar.disable();
        btnGuardar.disable();
        cbaccionesDWH.disable();
        btnAprob.disable();
        btnDesprob.disable();
        btnAprobarAjuste.disable();
        btnDesapAjuste.disable();
        Ext.getCmp('btnAjuste').disable();
        Ext.getCmp('btnDesapAjuste').disable();
        Ext.getCmp('btnAprobarAjuste').disable();
        Ext.getCmp('verdetalle').disable();
        Ext.getCmp('btnDesap').disable();
        Ext.getCmp('btnAprobarTodo').disable();
        Ext.getCmp('btnDesaprobarTodo').disable();
        Ext.getCmp('btnCopiarNiveles').disable();
        Ext.getCmp('btnPegarNiveles').disable();
        Ext.getCmp('btnAprobarToAjustes').disable();
        Ext.getCmp('btnDesaprobarToAjustes').disable();
        gestionSegunEstEjercicioNA = false;
    }
}
function validarTipoModeloConColumnNomencladas() {
    // mymask.show();
    Ext.Ajax.request({
        url: 'validarTipoModeloConColumnNomencladas',
        params: {
            idactividad: smNivActividad.getSelected().data.idactividad
        },
        callback: function(options, success, response) {
            tmconcolnomenclada = Ext.decode(response.responseText);
            if (tmconcolnomenclada == 1) {
                Ext.getCmp('btnDesglosar').enable();
            } else {
                Ext.getCmp('btnDesglosar').disable();
            }
        }
    });
}