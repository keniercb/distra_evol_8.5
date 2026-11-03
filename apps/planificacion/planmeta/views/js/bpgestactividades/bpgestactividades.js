var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('bpgestactividades', preCargarInterfaz);

/*Variables globales de las actividades*/
var offsetActividades = 0, offsetBuscarIndicador = 0;
var nivelact = null, ultimonivel = 0, idformato = null, nombreformato = '', objectRector = {}, objectDemandada = "", objectCompartida = "", duplicar = false;
var buscarindicador = false, idindicadorebuscar = null, idejerciciosbuscar = null;
var stum, stPersona, stActivos, stCargos, stCB, stEjercicio, stNaturaleza, mymask, smGpGestAct, stGpActividades, stUsuarios,
        idactividadselecc, rowIndex_act, idespecialidad = null, denespecialidad = null,
        denomespecialidadLog = '', idespecialidadLog = null, codespecialidadLog = '',
        add = true, modificar = false, addhijo = false, cbEjercicio;
var tabsNormasReglasSalidas, tabActual = null;
var myMaskActv = new BarraEstado();
/*Fin de las variables globales de las actividades*/

/*Variables globales de las normas*/
var stGpGestNorm = null, winAddNorma, idnormaselected, gpGestNorm, btnAddReglaN, tfimportetotalactividad, gpAddNorma;
var gestionSegunEstEjercicioActv = true;
var campos_modificados = [];
/*Fin de las variables globales de las normas*/

/*Variables globales de las reglas*/
var fpAddRegla, winAddRegla, ventanaRegla, filtrosreglas, stGpActividadesReglas, gpActividadesReglas, varcontrol, nivBase, denominacionregla;
var filtradoregla = false;
/*Fin de las variables globales de las reglas*/

/*Variables globales de las salidas*/
var stGpGestSalida, gpGestSalidas, offsetSalida;
var salida = false, esta_buscandosalida = false;
/*Fin de las variables globales de las salidas*/
var cargos = 0;
var activos = 0;
/**
 * variable global gasto
 */

expResumenCosto = false;


/**
 * fin de las variables globales de gasto
 */
function preCargarInterfaz() {
    stEsp = new Ext.data.Store({
        url: 'obtenerEspecialidadLogueada',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idespecialidad'
        }, [{
                name: 'idespecialidad'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }]),
        listeners: {
            load: function (st) {
                idespecialidadLog = st.data.items[0].data.idespecialidad;
                denomespecialidadLog = st.data.items[0].data.denominacion;
                codespecialidadLog = st.data.items[0].data.codigo;
                cargaDeAcciones();
            }
        }
    });

}
function cargaDeAcciones() {
    /*objetos para iniciar el componente*/
    //tree combos para listar arbol de especialidades
    cbEspecialidadRector = new Utilidades.Cmp.TreeComboBox({
        id: 'cbEspecialidadRector',
        anchor: '100%',
        height: '140px',
        disabled: false,
        hidden: true,
        fieldLabel: 'params.type.label',
        treeConfig: {
            rootVisible: true,
            loader: new Ext.tree.TreeLoader({
                url: 'listarArbolEspecialidades'
            }),
            border: false,
            autoScroll: true,
            root: new Ext.tree.AsyncTreeNode({
                text: perfil.etiquetas.lbEspecialidades,
                id: 'root'
            })
        },
        callbackClick: function (node) {
            idespecialidad = node.id;
            denespecialidad = node.attributes.text;
            stEspecialidades.reload();
            stGpActividades.reload({
                params: {
                    anode: null
                }
            });
        }
    });
    cbEspecialidadEspecialista = new Utilidades.Cmp.TreeComboBox({
        id: 'cbEspecialidadEspecialista',
        anchor: '100%',
        height: '140px',
        disabled: false,
        hidden: true,
        fieldLabel: 'params.type.label',
        treeConfig: {
            rootVisible: true,
            loader: new Ext.tree.TreeLoader({
                url: 'listarArbolEspecialidades'
            }),
            border: false,
            autoScroll: true,
            root: new Ext.tree.AsyncTreeNode({
                text: denomespecialidadLog,
                id: idespecialidadLog
            })
        },
        callbackClick: function (node) {
            idespecialidad = node.id;
            denespecialidad = node.attributes.text;
            stEspecialidades.reload();
            stGpActividades.reload({
                params: {
                    anode: null
                }
            });
        }
    });

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbEspere,
        id: 'mask'
    });

    btnAprobarActividadRector = new Ext.Button({
        tooltip: perfil.etiquetas.lbAprobarActividad + '(Rector)',
        id: 'btnAprobarActividadRector',
        iconCls: 'aprobar',
        hidden: true,
        disabled: true,
        handler: function () {
            aprobarActividades(4, true);
        }
    });
    btnAprobarActividadEspecialista = new Ext.Button({
        tooltip: perfil.etiquetas.lbAprobarActividad + '(Especialista)',
        id: 'btnAprobarActividadEspecialista',
        iconCls: 'aprobar',
        hidden: true,
        disabled: true,
        handler: function () {
            aprobarActividades(3, false);
        }
    });
    btnDesaprobarActividadRector = new Ext.Button({
        tooltip: perfil.etiquetas.lbDesaprobarActividad + '(Rector)',
        id: 'btnDesaprobarActividadRector',
        iconCls: 'desaprobar',
        hidden: true,
        disabled: true,
        handler: function () {
            aprobarActividades(1, true);
        }
    });
    btnDesaprobarActividadEspecialista = new Ext.Button({
        tooltip: perfil.etiquetas.lbDesaprobarActividad + '(Especialista)',
        id: 'btnDesaprobarActividadEspecialista',
        iconCls: 'desaprobar',
        hidden: true,
        disabled: true,
        handler: function () {
            aprobarActividades(1, false);
        }
    });

    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'cargos') {
                cargos = 1;
            }
            if (acciones_reportes[i].abreviatura == 'activos') {
                activos = 1;
            }
        }
        cargarInterfaz();

    });
}


function cargarInterfaz() {

    stEspecialidades = new Ext.data.Store({
        url: 'listarEspecialidades',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idespecialidad'
        }, [{
                name: 'idespecialidad'
            }, {
                name: 'denespecialidad'
            }]),
        listeners: {
            beforeload: function (st, opt) {
                filtrosActividades.clearFiltersDataindex('idespecialidad');
                if (Ext.getCmp('idcbespecialidad').getValue() != undefined && Ext.getCmp('idcbespecialidad').getValue() != "")
                    Ext.getCmp('idcbespecialidad').clearValue();
                st.baseParams.idespecialidad = idespecialidad;
                st.baseParams.denespecialidad = denespecialidad;
                st.baseParams.rector = Ext.getCmp('cbEspecialidadEspecialista').hidden;
            }
        }
    });

    //Para el trabajo con los usuarios a partir de 'idusuario'
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
                    }]),
        listeners: {
            load: function (st) {
                stNiveles.reload();
            }
        }
    });
    //Fin del store Usuarios

    stNiveles = new Ext.data.Store({
        url: 'cargarNiveles',
        id: 'stNiveles',
        reader: new Ext.data.JsonReader({
            root: 'data',
            ultimo: 'ultimonivel'
        }, [{
                name: 'nivel'
            }, {
                name: 'nombre'
            }, {
                name: 'abreviatura'
            }
        ]),
        listeners: {
            load: function (r, o, s) {
                if (r.reader.jsonData.data.length > 0) {
                    cbNiveles.setValue(r.reader.jsonData.data[0].nivel);
                    ultimonivel = r.reader.jsonData.ultimonivel;
                    idformato = r.reader.jsonData.formato;
                    nombreformato = r.reader.jsonData.nombreformato;
                    nivelact = cbNiveles.getValue();
                    stModelos.reload();
                } else {
                    mostrarMensaje(2, "No existe un formato definido para las actividades");
                }
            }
        }
    });

    cbNiveles = new Ext.form.ComboBox({
        id: 'cbNiveles',
        emptyText: perfil.etiquetas.lbSeleccione,
        store: stNiveles,
        valueField: 'nivel',
        width: 170,
        displayField: 'nombre',
        mode: 'local',
        listWidth: 170,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        fieldLabel: perfil.etiquetas.lbNivel,
        enableKeyEvents: true,
        listeners: {
            select: function () {
                nivelact = cbNiveles.getValue();
                stGpActividades.reload({
                    params: {
                        anode: null
                    }
                });

                axuliarBtnasociar(null, null);
                axuliarBtnAdd(null, null);
                axuliarBtnModificarAct(null, null);
                axuliarBtnEliminarAct(null, null);
                axuliarBtnActivarDesactAct(null, null);
                axuliarBtnAprobDesaproAct(null, null);
                axuliarBtnasociarEspPlanes(null, null);
            }
        }
    });

    stModelos = new Ext.data.Store({
        url: 'cargarModelos',
        id: 'stModelos',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        }, [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function (st) {
                stEspecialidadesTodas.reload();
            }
        }
    });

    stEspecialidadesTodas = new Ext.data.Store({
        url: 'listarEspecialidadesTodas',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idespecialidad'
        }, [{
                name: 'idespecialidad'
            }, {
                name: 'denespecialidad'
            }]),
        listeners: {
            load: function (st) {
                stGpActividades.reload();
            }
        }
    });

    /*objetos para iniciar el componente*/
    stEjercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                if (t.reader.jsonData.data.length > 0) {
                    if (t.reader.jsonData.idejercicioactual != null) {
                        cbEjercicioBuscar.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                        cbEjercicioNorma.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                        cbEjercicioRegla.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                        cbEjercicioSalida.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgEjercicioActual);
                    }
                } else {
                    mostrarMensaje(2, "No existen ejercicios de planificación configurados");
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
            }, {
                name: 'uridatosnomenclador'
            }])
    });

    /*Objetos utilizados para los filtros*/
    stum = new Ext.data.Store({
        url: 'cargarunidadmedida',
        id: 'stum',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });
    stCB = new Ext.data.Store({
        url: 'listarCentroBalance',
        id: 'stCB',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idcentrobalance'
        }, [{
                name: 'idcentrobalance'
            }, {
                name: 'centrobalance'
            }])
    });
    stNaturaleza = new Ext.data.Store({
        url: 'listarNaturalezas',
        id: 'stNaturaleza',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'naturaleza'
        }, [{
                name: 'naturaleza'
            }, {
                name: 'denominacion'
            }])
    });
    /*Fin de los Objetos utilizados para los filtros*/

    initBaseNorma();
    initBaseRegla();
    initBaseSalida();
    initBaseCargo();
    initBaseActivos();

    /*botones*/
    btnAdicionarActividad = new Ext.Button({
        tooltip: perfil.etiquetas.lbAddActividad,
        id: 'btnAdicionarActividad',
        iconCls: 'adicionar',
        disabled: false,
        handler: function () {
            duplicar = false;
            adicionarActividades(false);
        }
    });

    btnDuplicarActividad = new Ext.Button({
        tooltip: perfil.etiquetas.lbTtbtnDupAct,
        iconCls: 'duplicar',
        id: 'btnDuplicarActividad',
        disabled: true,
        handler: function () {
            duplicar = true;
            adicionarActividades(true);
        }
    });
    /*btnResumenGastos = new Ext.Button({
     tooltip: perfil.etiquetas.verResumenGastos,
     iconCls: 'ver',
     id: 'btnResumenGastos',
     disabled: true,
     handler: function () {
     verResumenGastos();
     }
     });*/

    btnModificarActividad = new Ext.Button({
        tooltip: perfil.etiquetas.lbModActividad,
        id: 'btnModificarActividad',
        iconCls: 'modificar',
        disabled: true,
        handler: function () {
            modificar = true;
            duplicar = false;
            adicionarActividades(true);
        }
    });
    btnEliminarActividad = new Ext.Button({
        tooltip: perfil.etiquetas.lbDelActividad,
        id: 'btnEliminarActividad',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            var long = smGpGestAct.getSelections().length;
            if (long == 1) {
                mostrarMensaje(2, perfil.etiquetas.msgSegEliminarActividad, eliminarActividadesSeleccionadas);
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgSegEliminarActividades, eliminarActividadesSeleccionadas);
            }
            function eliminarActividadesSeleccionadas(btnPresionado) {
                if (btnPresionado == 'ok') {
                    eliminarActividades();
                }
            }
        }
    });

    btnActivarActividad = new Ext.Button({
        tooltip: perfil.etiquetas.lbActivarActividad,
        id: 'btnActivarActividad',
        disabled: true,
        iconCls: 'habilitar',
        handler: function () {
            habilitarActividades(1);
        }
    });
    btnDesactivarActividad = new Ext.Button({
        tooltip: perfil.etiquetas.lbDesactivarActividad,
        id: 'btnDesactivarActividad',
        iconCls: 'deshabilitar',
        disabled: true,
        handler: function () {
            habilitarActividades(0);
        }
    });
    buscarIndicador();
    btnResumenGastos = new Ext.Button({
        tooltip: perfil.etiquetas.verResumenGastos,
        iconCls: 'ver',
        id: 'btnResumenGastos',
        disabled: true,
        handler: function () {
            expResumenCosto = true;
            verResumenGastos();
            // fpResumenCosto.getForm().reset();
        }
    });
    btnBuscarIndicador = new Ext.Button({
        tooltip: perfil.etiquetas.lbBuscarIndicador,
        id: 'btnBuscarIndicador',
        iconCls: 'buscar',
        handler: function () {
            winbuscarIndicador.show();
        }
    });

    btnAsociarEspPlanes = new Ext.Button({
        tooltip: perfil.etiquetas.lbTtbtnAsocAct,
        id: 'btnAsociarEspPlanes',
        disabled: true,
        iconCls: 'asociar',
        handler: function () {
            asociarPlanesByEspecialidades();
        }
    });
    btnLimpiarFiltrosActividades = new Ext.Button({
        id: 'btnLimpiarFiltrosActividades',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            idindicadorebuscar = null;
            idejerciciosbuscar = null;
            buscarindicador = false;
            filtrosActividades.clearFilters();
        }
    });
    /*fin de los botonoes del grid*/

    /* Tree grid principal */
    cmGpActividades = new Ext.grid.ColumnModel({
        columns: [{
                header: perfil.etiquetas.lbCodigo,
                tooltip: perfil.etiquetas.lbCodigo,
                width: 100,
                sortable: true,
                dataIndex: 'codigo',
                renderer: crearToolTip
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                width: 300,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbDescripcion,
                tooltip: perfil.etiquetas.lbDescripcion,
                width: 250,
                sortable: true,
                hidden: true,
                dataIndex: 'descripcion',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbEspecialidad,
                tooltip: perfil.etiquetas.lbEspecialidad,
                width: 250,
                sortable: true,
                hidden: true,
                dataIndex: 'idespecialidad',
                renderer: renderEspecialidad
            }, {
                header: perfil.etiquetas.lbPlan,
                tooltip: perfil.etiquetas.lbPlan,
                width: 150,
                sortable: true,
                dataIndex: 'idmodelo',
                renderer: renderPlanes
            }, {
                header: perfil.etiquetas.lbPlanSalida,
                tooltip: perfil.etiquetas.lbPlanSalida,
                width: 150,
                sortable: true,
                dataIndex: 'idmodelosalida',
                renderer: renderPlanes
            }, {
                header: perfil.etiquetas.lbActivado,
                tooltip: perfil.etiquetas.lbActivado,
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'estado',
                renderer: modificarEstado
            }, {
                header: perfil.etiquetas.lbAprobado,
                tooltip: perfil.etiquetas.lbAprobado,
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'idaprobacion',
                renderer: modificarAprobacion
            }, {
                header: perfil.etiquetas.lbNormada,
                tooltip: perfil.etiquetas.lbNormada,
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'normada',
                id: 'normada',
                renderer: modificarEstado
            }, {
                header: perfil.etiquetas.lbRegla,
                tooltip: perfil.etiquetas.lbRegla,
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'reglas',
                id: 'reglas',
                renderer: modificarEstado
            }, {
                header: perfil.etiquetas.lbSalida,
                tooltip: perfil.etiquetas.lbSalida,
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'salida',
                id: 'salida',
                renderer: modificarEstado
            }, {
                header: perfil.etiquetas.lbUsuario,
                tooltip: perfil.etiquetas.lbUsuario,
                width: 60,
                sortable: true,
                align: 'right',
                hidden: true,
                dataIndex: 'idusuario',
                renderer: renderUsuarios
            }, {
                header: perfil.etiquetas.lbFecha,
                tooltip: perfil.etiquetas.lbFechaU,
                width: 150,
                sortable: true,
                align: 'center',
                hidden: true,
                dataIndex: 'fecha',
                renderer: crearToolTip
            }]
    });

    stGpActividades = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarActividades',
        listeners: {
            beforeload: function () {
                Ext.Ajax.timeout = 7200000;
                stGpActividades.baseParams.start = offsetActividades;
                stGpActividades.baseParams.nivel = (nivelact == null) ? 1 : nivelact;
                stGpActividades.baseParams.idindicadorebuscar = idindicadorebuscar;
                stGpActividades.baseParams.idejerciciosbuscar = idejerciciosbuscar;
                stGpActividades.baseParams.idespecialidad = idespecialidad;
                stGpActividades.baseParams.rector = Ext.getCmp('cbEspecialidadEspecialista').hidden;
            },
            load: function (st) {
                cambiarTituloFiltrarAct(gpActividades, filtrosActividades, perfil.etiquetas.lbActividades);
                if (stGpGestNorm != null && smGpGestAct.getSelections().length == 0) {

                    if (parseInt(cbNiveles.getValue()) == 1) {
                        btnAdicionarActividad.enable();
                    }

                    if (tabsNormasReglasSalidas != null && (tabsNormasReglasSalidas.getActiveTab())) {
                        tabsNormasReglasSalidas.collapse();
                    }
                }
                myView.enable();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idactividad'
        }, [{
                name: 'idactividad'
            }, {
                name: 'total'
            }, {
                name: 'reglas'
            }, {
                name: 'idpadre'
            }, {
                name: 'codigo'
            }, {
                name: 'idformato'
            }, {
                name: 'denominacion'
            }, {
                name: 'estado'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'idespecialidad'
            }, {
                name: 'idarbol'
            }, {
                name: 'descripcion'
            }, {
                name: 'nivel'
            }, {
                name: 'ordender'
            }, {
                name: 'ordenizq'
            }, {
                name: 'normada'
            }, {
                name: 'idmodelo'
            }, {
                name: 'idmodelosalida'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'esultimonivel'
            }, {
                name: 'codigopadre'
            }, {
                name: 'salida'
            }, {
                name: 'denespecialidad'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }])
    });

    filtrosActividades = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
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
                /*                type: 'string',
                 dataIndex: 'idespecialidad'*/
                type: 'listado',
                mode: 'remote',
                triggerAction: 'all',
                dataIndex: 'idespecialidad',
                idcombo: 'idcbespecialidad',
                valueFieldcb: 'idespecialidad',
                displayFieldcb: 'denespecialidad',
                st: stEspecialidades//,
                        //autoload: true//,
                        // mode: 'local'

            }, {
                type: 'listado',
                dataIndex: 'idmodelo',
                idcombo: 'idcbmodelo',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                st: stModelos,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idmodelosalida',
                idcombo: 'idcbmodelosalida',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                st: stModelos,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [perfil.etiquetas.lbNo,
                    perfil.etiquetas.lbEspecialista,
                    perfil.etiquetas.lbRector]
            }, {
                type: 'list',
                dataIndex: 'normada',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'reglas',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'salida',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
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
            }]
    });

    smGpGestAct = new Ext.grid.RowSelectionModel({
        listeners: {
            rowdeselect: function (sm, rowIndex, record) {
                //controlarPaneles();
                axuliarBtnasociar(record, sm);
                axuliarBtnAdd(record, sm);
                axuliarBtnModificarAct(record, sm);
                axuliarBtnEliminarAct(record, sm);
                axuliarBtnActivarDesactAct(record, sm);
                axuliarBtnAprobDesaproAct(record, sm);
                axuliarBtnasociarEspPlanes(record, sm);

                if (stGpActividades.getCount() == 1 && recordSeleccionado != null)
                    recordSeleccionado = sm.getSelected();
                else
                    recordSeleccionado = null;

                if (sm.getSelections().length == 1 && (!sm.getSelected().data.esultimonivel == true)) {
                    add = true;
                    addhijo = true;
                } else {
                    add = true;
                    addhijo = false;
                }
                if (sm.getSelections().length == 1 && sm.getSelected().data.esultimonivel == true) {
                    btnResumenGastos.disable();
                } else {
                    btnResumenGastos.enable();
                }
            },
            rowselect: function (sm, rowIndex, record) {
                idactividadselecc = sm.getSelected().data.idactividad;

                axuliarBtnasociar(record, sm);
                axuliarBtnAdd(record, sm);
                axuliarBtnModificarAct(record, sm);
                axuliarBtnEliminarAct(record, sm);
                axuliarBtnActivarDesactAct(record, sm);
                axuliarBtnAprobDesaproAct(record, sm);
                axuliarBtnasociarEspPlanes(record, sm);

                controlarPaneles();
                if ((sm.getSelections().length == 1) && (!sm.getSelected().data.esultimonivel)) {
                    add = true;
                    addhijo = true;
                } else {
                    add = true;
                    addhijo = false;
                }
                if (sm.getSelections().length == 1 && sm.getSelected().data.esultimonivel) {
                    btnResumenGastos.enable();
                } else {
                    btnResumenGastos.disable();
                }
                rowIndex_act = rowIndex;
            }
        },
        singleSelect: false
    });

    gpActividades = new Ext.ux.maximgb.treegrid.GridPanel({
        title: perfil.etiquetas.lbActividades,
        store: stGpActividades,
        cm: cmGpActividades,
        sm: smGpGestAct,
        plugins: filtrosActividades,
        split: true,
        region: 'center',
        height: 300,
        stripeRows: true,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [],
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            store: stGpActividades,
            displayInfo: true,
            id: 'idpaginado',
            items: ['-', btnLimpiarFiltrosActividades/*, cbPaginado*/],
            listeners: {
                beforechange: function (p, e) {
                    offsetActividades = e.start;
                }
            }
        }),
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                if ((smGpGestAct.getSelections().length == 1) && (parseInt(smGpGestAct.selections.items[0].data.estado) == 0 && parseInt(smGpGestAct.selections.items[0].data.idaprobacion) == 1)) {
                    modificar = true;
                    duplicar = false;
                    adicionarActividades(true);
                }
            }
        }
    });
    /*FIN de tree grid principal*/

    /*Tabs para las Normas, Reglas y Salidas*/
    tabsNormasReglasSalidas = new Ext.TabPanel({
        activeTab: 0,
        width: 600,
        height: 250,
        plain: true,
        region: 'south',
        defaults: {autoScroll: true},
        collapsible: true,
        collapsed: true,
        disabled: true,
        split: true,
        title: 'Panel de Normas-Reglas-Salidas',
        items: [{
                id: 'tabNormas',
                title: perfil.etiquetas.lbNormas,
                layout: 'fit',
                items: [gpGestNorm],
                listeners: {
                    activate: function () {
                        if (tabActual != null)
                            stGpGestNorm.load();
                        tabActual = 'tabNormas';
                    }
                }
            }, {
                id: 'tabReglas',
                title: perfil.etiquetas.lbReglas,
                layout: 'fit',
                items: [gpGestReglas],
                listeners: {
                    activate: function () {
                        stgpGestReglas.load();
                        tabActual = 'tabReglas';
                    }
                }
            }, {
                id: 'tabSalidas',
                title: perfil.etiquetas.lbSalidas,
                layout: 'fit',
                items: [gpGestSalidas],
                listeners: {
                    activate: function () {
                        stGpGestSalida.load();
                        tabActual = 'tabSalidas';
                    }
                }
            }
        ]
    });
    if (cargos == 1)
        tabsNormasReglasSalidas.add({
            id: 'tabCargos',
            title: perfil.etiquetas.lbCargos,
            layout: 'fit',
            items: [gpGestCargos],
            listeners: {
                activate: function () {
                    stGpGestCargo.load();
                    tabActual = 'tabCargos';
                }
            }
        });
    if (activos == 1)
        tabsNormasReglasSalidas.add({
            id: 'tabActivos',
            title: perfil.etiquetas.lbActivos,
            layout: 'fit',
            items: [gpGestActivos],
            listeners: {
                activate: function () {
                    stGpGestActivos.load();
                    tabActual = 'tabActivos';
                }
            }
        });
    /*Fin de los Tabs para las Normas, Reglas y Salidas*/

    /*Paneles*/
    pPrincipal = new Ext.Panel({
        id: 'pPrincipal',
        split: true,
        region: 'center',
        layout: 'border',
        tbar: [btnAdicionarActividad, btnModificarActividad, btnEliminarActividad, btnAprobarActividadRector, btnDesaprobarActividadRector, btnAprobarActividadEspecialista, btnDesaprobarActividadEspecialista,
            btnActivarActividad, btnDesactivarActividad, btnDuplicarActividad, btnAsociarEspPlanes, btnResumenGastos,
            '-', new Ext.Toolbar.MenuButton({
                id: 'mnExportar',
                tooltip: {
                    text: perfil.etiquetas.lbExportar
                },
                iconCls: 'exportar',
                menu: {
                    items: [{
                            id: 'btnActividades',
                            iconCls: 'exportar',
                            text: perfil.etiquetas.lbExportarActividades,
                            handler: function () {
                                exportar('actividad');
                            }
                        }, {
                            id: 'btnconNormas',
                            iconCls: 'exportar',
                            text: perfil.etiquetas.lbExportarActividadesNormas,
                            handler: function () {
                                exportar('norma');
                            }
                        }, {
                            id: 'btnconReglas',
                            iconCls: 'exportar',
                            text: perfil.etiquetas.lbExportarActividadesReglas,
                            handler: function () {
                                exportar('regla');
                            }
                        }, {
                            id: 'btnconSalidas',
                            iconCls: 'exportar',
                            text: perfil.etiquetas.lbExportarActividadesSalidas,
                            handler: function () {
                                exportar('salida');
                            }
                        }]
                }
            }), '-', btnBuscarIndicador, '->', {
                xtype: 'tbtext',
                text: perfil.etiquetas.lbNivel
            }, cbNiveles, '-', {
                xtype: 'tbtext',
                text: perfil.etiquetas.lbEspecialidades
            }, cbEspecialidadRector, cbEspecialidadEspecialista],
        items: [gpActividades, tabsNormasReglasSalidas]
    });
    /*FIN de los paneles*/

    /*Viewport general del componente*/
    myView = new Ext.Viewport({
        layout: 'fit',
        id: 'myView',
        disabled: true,
        items: new Ext.Panel({
            layout: 'border',
            items: [pPrincipal],
            tbar: []
        })
    });
    /*FIN del viewport*/
}
//FIN del metodo cargarInterfaz

//función personalizada para el listar actividades... por lo de buscar el indicador en la norma
function cambiarTituloFiltrarAct(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        if (buscarindicador == false)
            gridPanel.setTitle(etiqueta);
        else
            gridPanel.setTitle(etiqueta + ' <i>' + perfil.etiquetas.lbFiltradoPor + perfil.etiquetas.lbIndicador + '</i>');
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        if (buscarindicador == false)
            gridPanel.setTitle(etiqueta + ' <i>' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        else
            gridPanel.setTitle(etiqueta + ' <i>' + perfil.etiquetas.lbFiltradoPor + perfil.etiquetas.lbIndicador + '/' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

//Construccion de los objetos para buscar un indicador en la norma
function buscarIndicador() {
    cbEjercicioBuscar = new Ext.form.ComboBox({
        id: 'cbEjercicioBuscar',
        store: stEjercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                //no se hace nada
            }
        }
    });
    btnLimpiarFiltrosbuscarIndicador = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosbuscarIndicador',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosbuscarIndicador.clearFilters();
        }
    });
    stgpbuscarIndicador = new Ext.data.Store({
        url: 'listarBuscarIndicador',
        listeners: {
            beforeload: function () {
                stgpbuscarIndicador.baseParams.start = offsetBuscarIndicador;
                Ext.Ajax.timeout = 7200000;
            },
            load: function () {
                cambiarTituloFiltrar(gpbuscarIndicador, filtrosbuscarIndicador, perfil.etiquetas.lbIndicadores)
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'estado'
            }, {
                name: 'idaprobacion'
            }])
    });
    smbuscarIndicador = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    cmgpbuscarIndicador = new Ext.grid.ColumnModel([{
            id: 'mscolumn',
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo'
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            header: perfil.etiquetas.lbActivado,
            tooltip: perfil.etiquetas.lbActivado,
            width: 60,
            sortable: true,
            align: 'center',
            dataIndex: 'estado',
            renderer: modificarEstado
        }, {
            header: perfil.etiquetas.lbAprobado,
            tooltip: perfil.etiquetas.lbAprobado,
            width: 60,
            align: 'center',
            sortable: true,
            dataIndex: 'idaprobacion',
            renderer: modificarAprobacion
        }
    ]);
    filtrosbuscarIndicador = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
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
            }]
    });
    gpbuscarIndicador = new Ext.grid.GridPanel({
        id: 'gpbuscarIndicador',
        frame: true,
        store: stgpbuscarIndicador,
        region: 'center',
        autoExpandColumn: 'expandir',
        cm: cmgpbuscarIndicador,
        sm: smbuscarIndicador,
        plugins: filtrosbuscarIndicador,
        title: perfil.etiquetas.lbIndicadores,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        listeners: {
            click: function (n) {
                if (smbuscarIndicador.getCount() != 0)
                    Ext.getCmp('btnaceptarbuscarind').enable();
                else
                    Ext.getCmp('btnaceptarbuscarind').disable();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stgpbuscarIndicador,
            displayInfo: true,
            id: 'idpaginadoBuscar',
            items: ['-', btnLimpiarFiltrosbuscarIndicador],
            listeners: {
                beforechange: function (p, e) {
                    offsetBuscarIndicador = e.start;
                }
            }
        })
    });
    winbuscarIndicador = new Ext.Window({
        modal: true,
        frame: true,
        closeAction: 'hide',
        constrain: true,
        width: 700,
        layout: 'fit',
        items: gpbuscarIndicador,
        height: 600,
        title: perfil.etiquetas.lbBuscarIndicador,
        tbar: [perfil.etiquetas.lbEjercicio, cbEjercicioBuscar],
        buttons: [{
                text: perfil.etiquetas.lbCancelar,
                tooltip: perfil.etiquetas.lbTtCancelar,
                iconCls: 'cancelar',
                handler: function () {
                    winbuscarIndicador.hide();
                    gpbuscarIndicador.getSelectionModel().clearSelections();
                }
            }, {
                text: perfil.etiquetas.lbAceptar,
                tooltip: perfil.etiquetas.lbTtAceptar,
                iconCls: 'aceptar',
                id: 'btnaceptarbuscarind',
                disabled: true,
                handler: function () {
                    buscarindicador = true;
                    idindicadorebuscar = smbuscarIndicador.getSelected().id;
                    idejerciciosbuscar = cbEjercicioBuscar.getValue();
                    nivelact = ultimonivel;
                    cbNiveles.setValue(ultimonivel);
                    stGpActividades.reload({
                        params: {
                            anode: null
                        }
                    });
                    winbuscarIndicador.hide();
                }
            }],
        listeners: {
            beforeshow: function (w) {
                stgpbuscarIndicador.reload();
            }
        }
    });

}

actFormAdd = function () {
    if (gpActividades.getSelectionModel().getCount() == 0) {
        addhijo = false;
    }

    if (add) {
        if (!addhijo) {
//estoy adicionando una act del primer nivel
            if (idformato != null) {
                //cargo el formato predefinido
                //con su primer nivel y la cantidad de digitos
                //controlo los elementos que son solo para el ultimo nivel
                longnivel(1, idformato);
                cbformato.setValue(idformato);
                cbformato.disable();
            } else {
                cbformato.setValue(null);
                cbformato.enable();
                winAddAct.show('btnAddAct');
            }

            Ext.getCmp('tfespecialidad').setValue(denomespecialidadLog);
            Ext.getCmp('tfespecialidad').disable();
            Ext.getCmp('codpadre').setValue(codespecialidadLog);
            mensaje = perfil.etiquetas.lbAdicinando;
        } else {
            //es un hijo
            var objectData = nivelEspSelecc();
            Ext.getCmp('cbformato').setValue(gpActividades.getSelectionModel().getSelected().data.idformato);
            Ext.getCmp('cbformato').disable();
            Ext.getCmp('tfespecialidad').setValue(objectData['especialidad']);
            Ext.getCmp('tfespecialidad').disable();

            longnivel((smGpGestAct.getSelected() && addhijo) ? Number(gpActividades.getSelectionModel().getSelected().data.nivel) + 1 : 1, smGpGestAct.getSelected().data.idformato);
            Ext.getCmp('tfcodigo').enable();
            Ext.getCmp('codpadre').setValue(gpActividades.getSelectionModel().getSelected().data.codigo);
            Ext.getCmp('codpadre').disable();
            mensaje = perfil.etiquetas.lbAdicinandoAI;
        }
    }
};

longnivel = function (n, f) {
    mymask.show();
    Ext.Ajax.request({
        url: 'longNivel',
        params: {
            nivel: n,
            idformato: f
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            tfcodigo.maxLength = responseData.longitud;
            tfcodigo.minLength = responseData.longitud;
            tfcodigo.minLengthText = 'El tamaño requerido es ' + responseData.longitud + ' dígito(s).';
            tfcodigo.maxLengthText = 'El tamaño requerido es ' + responseData.longitud + ' dígito(s).';

            if (!modificar) {
                Ext.getCmp('cantdig').setValue(responseData.longitud);
                Ext.getCmp('nivel').setValue(responseData.abreviatura);
            }

            if (n != 1) {
                var nivelActual = modificar ? Number(gpActividades.getSelectionModel().getSelected().data.nivel) : Number(gpActividades.getSelectionModel().getSelected().data.nivel) + 1;
            } else {
                var nivelActual = n;
            }

            if (!modificar) {

                if (nivelActual == parseInt(ultimonivel)) {
                    cbmodelo.enable();
                    cbmodelosalida.enable();
                    //Ext.getCmp('fpCbDemandantes').show();
                    Ext.getCmp('fpCbCompartida').show();
                    Ext.getCmp('fpCbModelo').show();
                    Ext.getCmp('fpCbModeloSalida').show();
                    Ext.getCmp('cbDemandantes').enable();
                    Ext.getCmp('cbEspecialidadCompartida').enable();

                } else {
                    cbmodelo.disable();
                    cbmodelosalida.disable();
                    //Ext.getCmp('fpCbDemandantes').hide();
                    Ext.getCmp('fpCbCompartida').hide();
                    Ext.getCmp('fpCbModelo').hide();
                    Ext.getCmp('fpCbModeloSalida').hide();
                    Ext.getCmp('cbDemandantes').disable();
                    Ext.getCmp('cbEspecialidadCompartida').disable();
                }

                winAddAct.setTitle("Adicionar actividad");

            }

            winAddAct.on('beforeshow', function () {
                denominacion.focus(true, 700);
                stespecialiddemandante.load();
                stespecialidcompartir.load();
            });
            winAddAct.show('btnAddAct');

            if (modificar) {
                modificar = false;
                // winAddAct.setTitle(perfil.etiquetas.lbActividad);

            }
            if (duplicar) {
                duplicar = false;
                winAddAct.setTitle(perfil.etiquetas.lbActividadD);
            }
            winAddAct.doLayout();

        }
    });
};

/**
 * Seleccion de la denominacion del nivel y la especialidad seleccionada
 */
function nivelEspSelecc() {
    var nivel = Number(gpActividades.getSelectionModel().getSelected().data.nivel);
    var especialidad = Number(gpActividades.getSelectionModel().getSelected().data.idespecialidad);

    var respuesta = {
        nivel: "",
        especialidad: "",
        long: "",
        codigo: gpActividades.getSelectionModel().getSelected().data.codigo
    };


    for (var i = 0; i < stNiveles.data.items.length; i++) {
        if (nivel == Number(stNiveles.data.items[i].data.nivel)) {
            respuesta['nivel'] = stNiveles.data.items[i].data.abreviatura;
            respuesta['long'] = parseInt(stNiveles.data.items[i].json.longitud);
        }
    }

    for (var i = 0; i < stEspecialidadesTodas.data.items.length; i++) {
        if (especialidad == Number(stEspecialidadesTodas.data.items[i].data.idespecialidad)) {
            respuesta['especialidad'] = stEspecialidadesTodas.data.items[i].data.denespecialidad;
            respuesta['codespecialidad'] = stEspecialidadesTodas.data.items[i].json.codespecialidad;
        }
    }
    return respuesta;
}

function exportar(valor) {
    Ext.Ajax.timeout = 600000;
    var win = window.open('exportar?&tipo=' + valor +
            '&idespecialidad=' + idespecialidad +
            '&nivel=' + nivelact +
            '&idejercicio=' + cbEjercicioNorma.getValue() +
            '&filtros=' + Ext.encode(filtrosActividades.getFilterData()) + '&rector=' + Ext.getCmp('cbEspecialidadEspecialista').hidden);
    mascaraExportar(perfil.etiquetas.lbExportandoActvs, perfil.etiquetas.lbEsperePorFavor, win);
}

function SeleccionarFila(sm, st, fila) {
    var filaSeleccionada = parseInt(fila);
    if (filaSeleccionada != st.getCount() - 1)
        sm.selectRow(filaSeleccionada + 1);
    else
        sm.selectRow(filaSeleccionada);
}
function exportarResumenCosto() {
    var win = window.open('exportarResumenCosto?directo=' + Ext.getCmp('costoDirecto').getValue() +
            "&indirecto=" + Ext.getCmp('costoIndirecto').getValue() +
            "&ejercicio=" + cbEjercicioNorma.getRawValue() +
            "&denominacion=" + gpActividades.getSelectionModel().getSelected().data.denominacion + '&otros=' + Ext.getCmp('otrosCostos').getValue());
}
