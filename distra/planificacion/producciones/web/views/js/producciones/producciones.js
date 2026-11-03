//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
//var perfil = eval(window.parent.UCID.portal.perfil);
var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('producciones', cargarInterfaz);

var nodoEst = null, is_leaf = null, entidadOD = false;
var offsetProducciones = 0, offsetCT = 0;

var beforeloadstProducciones = false, beforeloadstCT = false;
var prodplan = [], denom_ent;
var integracion_proyecto = 0, expand_plan = true;


function cargarInterfaz() {
    var temp = window.location.pathname;
    var url = temp.substr(1);

    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'proyecto') {
                integracion_proyecto = 1;
                break;
            }
        }
    });

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    btnGrafica = new Utilidades.Cmp.botonGrafica({
        componente: 'Produccion'
    });

    btnAyuda = new Ext.Button({
        id: 'idbtnAyudaProduccion',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtAyuda,
    });

    stCbTipoCarta = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarTiposModelosActivos',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idtipomodelo"
        }, [{
                name: 'idtipomodelo'
            }, {
                name: 'denominacion'
            }]
                ),
        listeners: {
            load: function (t, n, e) {
                if (t.reader.jsonData.data[0] != undefined) {

                } else {
                    mostrarMensaje(1, "No existe configuración para tipos de cartas.");
                }
            }
        }
    });
    //Para el trabajo con los usuarios a partir de 'idusuario'
    stUsuarios = new Ext.data.Store({
        url: 'cargarUsuarios',
        autoLoad: true,
        id: 'stUsuarios',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idusuario'
        }, [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
            }
        }
    });
    //Fin del store Usuarios
    //Para el trabajo con las unidades de medidad a partir de 'idumedida'
    stum = new Ext.data.Store({
        url: 'cargarUnidaddeMedida',
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
    //Fin del store UM
    stVariable = new Ext.data.Store({
        url: 'cargarVariables',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idvariable',
            root: 'data'
        }, [{
                name: 'idvariable'
            }, {
                name: 'denominacionvariable'
            }])
    });

    stEtapas = new Ext.data.Store({
        url: 'cargarEtapas',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idetapa',
            root: 'data'
        }, [{
                name: 'idetapa'
            }, {
                name: 'denominacion'
            }])
    });

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
    trEntidades.width = 250;
    trEntidades.split = false;
    trEntidades.getRootNode().attributes.text = perfil.etiquetas.lbOrganismos;
    trEntidades.getRootNode().text = perfil.etiquetas.lbEntidades;
    trEntidades.addListener('click', function (n) {
        denom_ent = n.text;
        nodoEst = n;
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        if (n.id != 'Estructuras') {
            btnGrafica.entidad = nodoEst;
            btnGraficaProduccion.enable();
            Ext.Ajax.request({
                url: 'entidadOD',
                params: {
                    identidad: nodoEst.id
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    entidadOD = responseData;
                    if (entidadOD) {
                        pProducciones.enable();
                        stProducciones.reload();
                    } else {
                        //mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                        mostrarMensaje(1, "La entidad seleccionada no está configurada como órgano demandante.");
                        pProducciones.disable();
                        if (stProducciones.reader != undefined)
                            stProducciones.loadData({"data": [], "total": 0});
                    }
                }
            });
        } else {
            pProducciones.disable();
            btnGraficaProduccion.disable();
            if (stProducciones.reader != undefined)
                stProducciones.loadData({"data": [], "total": 0});
        }
    });

    filtrosProducciones = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'producto'
            }, {
                type: 'numeric',
                dataIndex: 'valorrendimiento'
            }, {
                type: 'listado',
                dataIndex: 'idumedidarendimiento',
                idcombo: 'idcbumrendimiento',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividad'
            }, {
                type: 'numeric',
                dataIndex: 'volumenproduccionhistorico'
            }, {
                type: 'numeric',
                dataIndex: 'productividadest'
            }, {
                type: 'listado',
                dataIndex: 'idvariablecontrol',
                idcombo: 'idcbvariable',
                valueFieldcb: 'idvariable',
                displayFieldcb: 'denominacionvariable',
                st: stVariable,
                autoload: false,
                mode: 'local'
            }, {
                type: 'date',
                dataIndex: 'fechainicio'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'date',
                dataIndex: 'fechafin'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [[4, 'Sí'], [1, 'No']]
            }, {
                type: 'listado',
                dataIndex: 'idtipomodelo',
                idcombo: 'idcbtipomodelo',
                valueFieldcb: 'idtipomodelo',
                displayFieldcb: 'denominacion',
                st: stCbTipoCarta,
                autoload: false,
                mode: 'local'
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
                dataIndex: 'fechamodificacion'
            }]
    });
    /** **************** Fin de filtros************************ */

    dateFechaInicio = new Ext.form.DateField({
        format: 'd/m/Y',
        allowBlank: false,
        invalidText: 'Formato: d/m/a',
        listeners: {
            change: function (df, date) {
                stProducciones.reload();
            }
        }
    })
    dateFechaFin = new Ext.form.DateField({
        format: 'd/m/Y',
        allowBlank: false,
        invalidText: 'Formato: d/m/a',
        listeners: {
            change: function (df, date) {
                stProducciones.reload();
            }
        }
    })
    chkGlobal = new Ext.form.Checkbox({
        boxLabel: 'Global',
        id: 'chkGlobal',
        hidden: true,
        listeners: {
            check: function (ck, t) {
                //controladorDeAciones();
            }
        }
    });


    //inicio del grid de datos
    stProducciones = new Ext.data.GroupingStore({
        url: 'listarProducciones',
        sortInfo: {
            field: 'producto',
            direction: "ASC"
        },
        groupField: 'producto',
        listeners: {
            beforeload: function () {
                //limpiar los records modified               
                stProducciones.commitChanges();
                //FIN DE LA BARBARIDAD
                beforeloadstProducciones = true;
                stProducciones.baseParams.start = offsetProducciones;
                stProducciones.baseParams.identidad = nodoEst.id;
                stProducciones.baseParams.global = chkGlobal.getValue();
                stProducciones.baseParams.fechaInicio = Ext.encode(dateFechaInicio.getValue());
                stProducciones.baseParams.fechaFin = Ext.encode(dateFechaFin.getValue());
                cambiarTituloFiltrar(gpProducciones, filtrosProducciones, perfil.etiquetas.lbProducciones);
            },
            load: function (options, success, response) {
                if (stProducciones.getCount() == 0) {
                    if (beforeloadstProducciones) {
                        if (filtrosProducciones.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                        }
                    }
                }
                btnGuardarProduccion.disable();
                beforeloadstProducciones = false;
                controlarObjetosProduccion();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idaplicacioncartatec'
        }, [{
                name: 'idaplicacioncartatec'
            }, {
                name: 'denominacion'
            }, {
                name: 'producto'
            }, {
                name: 'valorrendimiento'
            }, {
                name: 'idumedidarendimiento'
            }, {
                name: 'nivelactividad'
            }, {
                name: 'volumenproduccionhistorico'
            }, {
                name: 'productividadest'
            }, {
                name: 'idvariablecontrol'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'fecha'
            }, {
                name: 'asegurado'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'idtipomodelo'
            }, {
                name: 'idusuario'
            }, {
                name: 'fechamodificacion'
            }])
    });
    smProducciones = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetosProduccion();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetosProduccion();
            }
        }
    });
    //inicio del grid
    chkAsegurado = new Ext.grid.CheckColumn({
        header: perfil.etiquetas.lbAsegurado,
        tooltip: perfil.etiquetas.lbAsegurado,
        dataIndex: 'asegurado',
        editable: true,
        hidden: true,
        id: 'chkAsegurado',
        editor: {
            xtype: 'checkbox'/*,
             cls: 'x-grid-checkheader-editor'*/
        },
        width: 80,
        listeners: {
            checkchange: function () {
            },
            click: function () {
            },
            onMouseDown: function () {
            }
        }
    });

    cmProducciones = new Ext.grid.ColumnModel([{
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            //width: 180,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbProducto,
            tooltip: perfil.etiquetas.lbProducto,
            width: 180,
            dataIndex: 'producto',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbRendimiento,
            tooltip: perfil.etiquetas.lbRendimiento,
            width: 80,
            align: 'right',
            hidden: true,
            dataIndex: 'valorrendimiento',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUMRendimiento,
            tooltip: perfil.etiquetas.lbUMRendimiento,
            width: 80,
            hidden: true,
            dataIndex: 'idumedidarendimiento',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbNA,
            tooltip: perfil.etiquetas.lbNivelActividad,
            width: 80,
            align: 'right',
            dataIndex: 'nivelactividad',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 2,
                invalidText: perfil.etiquetas.msgValorMayorquecero,
                validator: function (val) {
                    if (val < 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbVPH,
            tooltip: perfil.etiquetas.lbVolProdHistorico,
            width: 80,
            align: 'right',
            dataIndex: 'volumenproduccionhistorico',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 2,
                invalidText: perfil.etiquetas.msgValorMayorquecero,
                validator: function (val) {
                    if (val < 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbVPE,
            tooltip: perfil.etiquetas.lbVolProdEstimado,
            width: 80,
            align: 'right',
            dataIndex: 'productividadest',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbVariable,
            tooltip: perfil.etiquetas.lbVariable,
            width: 80,
            hidden: true,
            dataIndex: 'idvariablecontrol',
            renderer: renderVariable
        }, {
            header: perfil.etiquetas.lbFechaInicio,
            tooltip: perfil.etiquetas.lbFechaInicio,
            width: 80,
            dataIndex: 'fechainicio',
            renderer: renderFecha
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            width: 80,
            dataIndex: 'fecha',
            renderer: renderFecha,
            editor: new Ext.form.DateField({
                format: 'd/m/Y',
                allowBlank: false,
                invalidText: 'Formato: d/m/a'
            })
        }, {
            header: perfil.etiquetas.lbFechaFin,
            tooltip: perfil.etiquetas.lbFechaFin,
            width: 80,
            dataIndex: 'fechafin',
            renderer: renderFecha
        }, chkAsegurado, {
            header: perfil.etiquetas.lbAprobado,
            tooltip: perfil.etiquetas.lbAprobado,
            width: 80,
            dataIndex: 'idaprobacion',
            renderer: renderAprobado
        }, {
            header: perfil.etiquetas.lbTipoCarta,
            tooltip: perfil.etiquetas.lbTipoCarta,
            width: 80,
            hidden: true,
            dataIndex: 'idtipomodelo',
            renderer: renderTipoCarta
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            width: 80,
            hidden: true,
            dataIndex: 'idusuario',
            renderer: renderUsuario
        }, {
            header: perfil.etiquetas.lbFechaModificacion,
            tooltip: perfil.etiquetas.lbFechaModificacion,
            width: 80,
            hidden: true,
            dataIndex: 'fechamodificacion',
            renderer: renderFecha
        }
    ]);
    btnAdicionarProduccion = new Ext.Button({
        id: 'btnAdicionarProduccion',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionarProduccion,
        handler: function () {
            adicionarProduccion();
        }
    });
    btnGuardarProduccion = new Ext.Button({
        id: 'btnGuardarProduccion',
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardarProduccion,
        disabled: true,
        handler: function () {
            guardarProduccion();
        }
    });
    btnEliminarProduccion = new Ext.Button({
        id: 'btnEliminarProduccion',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminarProduccion,
        disabled: true,
        handler: function () {
            eliminarProduccion();
        }
    });
    btnAprobarProduccion = new Ext.Button({
        id: 'btnAprobarProduccion',
        iconCls: 'aprobar',
        tooltip: perfil.etiquetas.lbAprobarProduccion,
        disabled: true,
        handler: function () {
            aprobarProduccion(4);
        }
    });
    btnDesaprobarProduccion = new Ext.Button({
        id: 'btnDesaprobarProduccion',
        iconCls: 'desaprobar',
        tooltip: perfil.etiquetas.lbDesaprobarProduccion,
        disabled: true,
        handler: function () {
            aprobarProduccion(1);
        }
    });

    mbExportar = new Ext.Toolbar.MenuButton({
        iconCls: 'exportar',
        menu: {
            items: [{
                    text: 'Exportar producciones',
                    id: 'btnExportarProducciones',
                    disabled: true,
                    iconCls: 'exportar',
                    listeners: {
                        click: function () {
                            exportarProducciones();
                        }
                    }
                }, {
                    text: 'Exportar actividades de la producción',
                    id: 'btnExportarActividadesProduccion',
                    disabled: true,
                    iconCls: 'exportar',
                    listeners: {
                        click: function () {
                            exportarActividadesOIndicadoresProducciones('act');
                        }
                    }
                }, {
                    text: 'Exportar indicadores de la producción',
                    id: 'btnExportarIndicadoresProduccion',
                    disabled: true,
                    iconCls: 'exportar',
                    listeners: {
                        click: function () {
                            exportarActividadesOIndicadoresProducciones('ind');
                        }
                    }
                }
            ]
        }
    });

    btnServicios = new Ext.Button({
        id: 'btnServicios',
        iconCls: 'gestionaracciones',
        tooltip: perfil.etiquetas.lbGestionarServicios,
        disabled: true,
        handler: function () {
            gestionarServicios();
        }
    });
    /*btnArrendamientos = new Ext.Button({
     id: 'btnArrendamientos',
     iconCls: 'gestionaracciones',
     tooltip: perfil.etiquetas.lbGestionarArrendamientos,
     disabled: true,
     handler: function () {
     gestionarArrendamientos();
     }
     });*/
    btnLimpiarProducciones = new Ext.Button({
        id: 'btnLimpiarProducciones',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            dateFechaFin.reset();
            dateFechaInicio.reset();
            filtrosProducciones.clearFilters();
        }
    });

    btnAdicionarAPlan = new Ext.Button({
        id: 'btnAdicionarAPlan',
        //itemCls: 'x-menu-item icondistra-actualizar',
        iconCls: 'icondistra-actualizar',
        text: 'Actualizar plan',
        tooltip: 'Actualizar plan',
        handler: function () {
            adicionarAPlan();
        }
    });
    btnGraficaProduccion = btnGrafica.botonMenuGrafica();

    gpProducciones = new Ext.grid.EditorGridPanel({
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        store: stProducciones,
        region: 'center',
        plugins: [filtrosProducciones, chkAsegurado],
        sm: smProducciones,
        cm: cmProducciones,
        title: perfil.etiquetas.lbProducciones,
        autoExpandColumn: 'expandir',
        frame: true,
        clicksToEdit: 2,
        //enableKeyEvents: true,
        tbar: [perfil.etiquetas.lbFechaInicio, dateFechaInicio, '-', perfil.etiquetas.lbFechaFin, dateFechaFin, '-', btnAdicionarProduccion, btnGuardarProduccion, btnEliminarProduccion, '-', btnAprobarProduccion, btnDesaprobarProduccion, '-', btnServicios, btnGraficaProduccion, /* btnArrendamientos,*/ '-', mbExportar, chkGlobal, '-', btnAdicionarAPlan],
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? perfil.etiquetas.lbProducciones : perfil.etiquetas.lbProduccion]})'
        }),
        bbar: new Ext.PagingToolbar({
            store: stProducciones,
            displayInfo: true,
            items: ['-', btnLimpiarProducciones],
            listeners: {
                beforechange: function (p, e) {
                    offsetProducciones = e.start;
                }
            }
        }),
        listeners: {
            beforeedit: function (e) {
                if (e.record.data.idaprobacion != 1) {
                    e.cancel = true;
                }
            },
            afteredit: function (sm) {
                btnGuardarProduccion.enable();
            }
        }
    });

    pProducciones = new Ext.Panel({
        id: 'pProducciones',
        layout: 'fit',
        region: 'center',
        disabled: true,
        items: [gpProducciones]
    });

//        /*********Mapeo de teclas calientes**************/
//        map = new Ext.KeyMap(Ext.getDoc(), [
//        {
//            key: 'Ii',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnAdicionarProduccion)) {
//                    adicionarProduccion();
//                }
//            }
//        }, {
//            key: 'Gg',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnGuardarProduccion)) {
//                    guardarProduccion();
//                }
//            }
//        }, {
//            key: 46,
//            fn: function () {
//                if (validarBtn(btnEliminarProduccion)) {
//                    eliminarProduccion();
//                }
//            }
//        }, {
//            key: 'Qq',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnAprobarProduccion)) {
//                    aprobarProduccion(4);
//                }
//            }
//        }, {
//            key: 'Ww',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnDesaprobarProduccion)) {
//                    aprobarProduccion(1);
//                }
//            }
//        }, {
//            key: 'Ee',
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnExportarProduccion)) {
//                    exportarProducciones();
//                }
//            }
//        }, {
//            key: 'Ss',
//            ctrl: true,
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnServicios)) {
//                    gestionarServicios();
//                }
//            }
//        }, {
//            key: 'Aa',
//            ctrl: true,
//            alt: true,
//            fn: function () {
//                if (validarBtn(btnArrendamientos)) {
//                    gestionarArrendamientos();
//                }
//            }
//        }
//    ]);
//    map.enable();
//    validarBtn = function (btn) {
//        return btn.hidden == false && !btn.disabled
//    };


    panelView = new Ext.Panel({
        id: 'panelView',
        layout: 'border',
        region: 'center',
        tbar: ['->', btnAyuda],
        items: [trEntidades, pProducciones]
    });

    myViewProducciones = new Ext.Viewport({
        layout: 'fit',
        items: [panelView]
    });
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

function crearToolTip(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return val;
}

function renderFecha(val, m) {
    try {
        if (val != null) {
            var temp = val.split(':');
            var tempC = val.split(' ');
            var v = temp[0] + ':' + temp[1];
            m.attr = 'ext:qtip="' + v + '"';
            return tempC[0];
        }
        return val;
    } catch (err) {
        m.attr = 'ext:qtip="' + val + '"';
        return val;
    }
}

function renderUM(value, m) {
    for (i in stum.data.items) {
        if (stum.data.items[i].data.hasOwnProperty('idunidadmedida') && stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.denominacionunidadmedida;
        } else if (stum.data.items[i].data.hasOwnProperty('idumedida') && stum.data.items[i].data.idumedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacion + '"';
            return stum.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}

function renderEtapa(value, m) {
    for (i in stEtapas.data.items) {
        if (stEtapas.data.items[i].data.hasOwnProperty('idetapa') && stEtapas.data.items[i].data.idetapa == value) {
            m.attr = 'ext:qtip="' + stEtapas.data.items[i].data.denominacion + '"';
            return stEtapas.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}

function renderTipoCarta(value, m) {
    for (i in stCbTipoCarta.data.items) {
        if (stCbTipoCarta.data.items[i].data.hasOwnProperty('idtipomodelo') && stCbTipoCarta.data.items[i].data.idtipomodelo == value) {
            m.attr = 'ext:qtip="' + stCbTipoCarta.data.items[i].data.denominacion + '"';
            return stCbTipoCarta.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}

function renderAprobado(val, m) {
    if (val == 3) {
        m.attr = 'ext:qtip="' + "Especialista" + '"';
        m.css = 'icondistra-true amarillo';
    } else if (val == 4) {
        m.attr = 'ext:qtip="' + "Rector" + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}

function renderEstado(val, m) {
    if (val > 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }
}

function renderVariable(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stVariable.data.items)
        if (stVariable.data.items[i].data.hasOwnProperty('idvariable') && stVariable.data.items[i].data.idvariable == value) {
            m.attr = 'ext:qtip="' + stVariable.data.items[i].data.denominacionvariable + '"';
            return stVariable.data.items[i].data.denominacionvariable;
        }
}

function renderUsuario(value, m) {
    for (i = 0; i < stUsuarios.data.length; i++) {
        if (stUsuarios.data.items[i].data.hasOwnProperty('idusuario') && stUsuarios.data.items[i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            return stUsuarios.data.items[i].data.nombreusuario;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + " - <i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function controlarObjetosProduccion() {
    btnAdicionarProduccion.disable();
    cmProducciones.setEditable(cmProducciones.findColumnIndex('nivelactividad'), false);
    cmProducciones.setEditable(cmProducciones.findColumnIndex('volumenproduccionhistorico'), false);
    cmProducciones.setEditable(cmProducciones.findColumnIndex('fecha'), false);
    //chkAsegurado.disable();

    btnEliminarProduccion.disable();
    btnAprobarProduccion.disable();
    btnDesaprobarProduccion.disable();
    Ext.getCmp('btnExportarProducciones').disable();
    Ext.getCmp('btnExportarActividadesProduccion').disable();
    Ext.getCmp('btnExportarIndicadoresProduccion').disable();

    if (stProducciones.getCount() > 0) {
        Ext.getCmp('btnExportarProducciones').enable();
        if (smProducciones.getSelections().length == 1) {
            if (smProducciones.getSelected().data.fecha != null) {
                Ext.getCmp('btnExportarActividadesProduccion').enable();
                Ext.getCmp('btnExportarIndicadoresProduccion').enable();
            }
        }
    }

    btnServicios.disable();
    //btnArrendamientos.disable();
    if (chkGlobal.getValue() == false) {
        if (entidadOD) {
            btnAdicionarProduccion.enable();
        }
        if (smProducciones.getSelections().length > 0) {
            if (smProducciones.getSelections().length == 1) {
                cmProducciones.setEditable(cmProducciones.findColumnIndex('nivelactividad'), true);
                cmProducciones.setEditable(cmProducciones.findColumnIndex('volumenproduccionhistorico'), true);
                cmProducciones.setEditable(cmProducciones.findColumnIndex('fecha'), true);
                //chkAsegurado.enable();

                btnServicios.enable();
                //btnArrendamientos.enable();

                if (smProducciones.getSelected().data.idaprobacion < 3) {
                    btnEliminarProduccion.enable();
                    btnAprobarProduccion.enable();
                } else {
                    btnDesaprobarProduccion.enable();
                }
            } else {
                btnEliminarProduccion.enable();
                btnAprobarProduccion.enable();
                btnDesaprobarProduccion.enable();
            }
        }
    }
}

function controlarObjetosAddProduccion() {

}

function adicionarProduccion() {
    cbTipoCarta = new Ext.form.ComboBox({
        id: 'cbTipoCarta',
        store: stCbTipoCarta,
        valueField: 'idtipomodelo',
        hiddenName: 'idtipomodelo',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                cargarDatosTipoCarta();
            }
        }
    });

    if (stCbTipoCarta.reader.jsonData.data[0] != undefined) {
        cbTipoCarta.setValue(stCbTipoCarta.reader.jsonData.data[0].idtipomodelo);
    } else {
        mostrarMensaje(1, "No existe configuración para tipos de cartas.");
    }

    //Adicionar produccion a partir de una carta tecnologica
    pAddProduccion = new Ext.Panel({
        id: 'panelProduccion',
        layout: 'fit',
        tbar: [cbTipoCarta]
    });
    winAddProduccion = new Ext.Window({
        id: 'winAddProduccion',
        modal: true,
        //keys: indicadormap,
        closeAction: 'destroy',
        width: 960,
        layout: 'fit',
        resizable: false,
        items: pAddProduccion,
        constrain: true,
        height: 500,
        title: perfil.etiquetas.lbAdicionarProd,
        listeners: {
            hide: function () {
                //stHojadeCalculo.reload();
            },
            beforeshow: function () {
                if (stCbTipoCarta.reader.jsonData.data[0] != undefined) {
                    cargarDatosTipoCarta();
                }
            },
            beforedestroy: function () {
                stProducciones.reload();
            }
        },
        buttons: [{
                id: 'btnAddProduccionCancelar',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winAddProduccion.destroy();
                }
            }, {
                id: 'btnAddProduccionAplicar',
                iconCls: 'aplicar',
                tooltip: perfil.etiquetas.msgGuardarSinCerrar,
                text: perfil.etiquetas.lbAplicar,
                handler: function () {
                    adicionarCTProduccion(true);
                }
            }, {
                id: 'btnAddProduccionAceptar',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    adicionarCTProduccion(false);
                }
            }]
    });

    function cargarDatosTipoCarta() {
        Ext.Ajax.timeout = 600000; //10min
        mymask.show();
        Ext.Ajax.request({
            url: 'obtenerColumnasDinamicas',
            params: {
                idtipomodelo: cbTipoCarta.getValue()
            },
            callback: function (options, success, response) {
                mymask.hide();
                var responseData = Ext.decode(response.responseText);
                if (responseData.cm) {
                    reconfgridCT(responseData);
                    pAddProduccion.add(crearGrid(filtrosCT, stCT, cmCT, pagCT, smCT));
                    pAddProduccion.doLayout();
                    stCT.reload();
                } else {
                    reconfgridCT();
                }
            }
        });
    }

    function reconfgridCT(cf) {
        filterDinamico = [];
        //poner todos los filtros de las columnas fijas
        filterDinamico.push({
            type: 'string',
            dataIndex: 'denominacion'
        });
        filterDinamico.push({
            type: 'string',
            dataIndex: 'denoindicador'
        });
        filterDinamico.push({
            type: 'list',
            dataIndex: 'idaprobacion',
            options: ['Aprobado rector', 'Aprobado',
                'Desaprobado']
        });
        filterDinamico.push({
            type: 'numeric',
            dataIndex: 'valorrendimiento'
        });
        filterDinamico.push({
            type: 'listado',
            dataIndex: 'idumedidarendimiento',
            idcombo: 'idcbumrendimiento',
            valueFieldcb: 'idunidadmedida',
            displayFieldcb: 'denominacionunidadmedida',
            st: stum,
            autoload: false,
            mode: 'local'
        });
        filterDinamico.push({
            type: 'listado',
            dataIndex: 'idvariablecontrol',
            idcombo: 'idcbvariable',
            valueFieldcb: 'idvariable',
            displayFieldcb: 'denominacionvariable',
            st: stVariable,
            autoload: false,
            mode: 'local'
        });

        Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
        var arrayIndexDinamicos = new Array();
        arrayIndexDinamicosTodos = new Array();
        arrayIndexDinamicosNum = new Array();
        arrayIndexDinamicosCad = new Array();

        readerdina = [];
        readerdina.push({
            name: 'idcartatecnologica'
        });
        readerdina.push({
            name: 'denominacion'
        });
        readerdina.push({
            name: 'idindicador'
        });
        readerdina.push({
            name: 'denoindicador'
        });
        readerdina.push({
            name: 'idaprobacion'
        });
        readerdina.push({
            name: 'estado'
        });
        readerdina.push({
            name: 'enuso'
        });
        readerdina.push({
            name: 'valorrendimiento'
        });
        readerdina.push({
            name: 'idumedidarendimiento'
        });
        readerdina.push({
            name: 'idvariablecontrol'
        });
        readerdina.push({
            name: 'idcartatecnologicaentidad'
        });

        //variable para controlar los editores dinamicos de los combos
        //1-es la diferencia entre posicion del arreglo y longitud
        //3-numero de columnas fijas antes de la 1er columna dinamica
        contJRGrid = readerdina.length + 1 - 11;

        cmdina = [];
        cmdina.push({
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            width: 180,
            id: 'expandir',
            renderer: crearToolTip
        });
        cmdina.push({
            header: perfil.etiquetas.lbProducto,
            tooltip: perfil.etiquetas.lbProducto,
            dataIndex: 'denoindicador',
            sortable: true,
            width: 180,
            renderer: crearToolTip
        });
        /*cmdina.push({
         header: perfil.etiquetas.lbAprobado,
         tooltip: perfil.etiquetas.lbAprobado,
         dataIndex: 'idaprobacion',
         sortable: true,
         width: 60,
         renderer: renderAprobado,
         align: 'center'
         });*/
        cmdina.push({
            header: perfil.etiquetas.lbRendimiento,
            tooltip: perfil.etiquetas.lbRendimiento,
            sortable: true,
            dataIndex: 'valorrendimiento',
            width: 90,
            align: 'right',
            renderer: crearToolTip
        });
        cmdina.push({
            header: "UM",
            tooltip: perfil.etiquetas.lbUM,
            sortable: true,
            dataIndex: 'idumedidarendimiento',
            width: 90,
            renderer: renderUM
        });
        cmdina.push({
            header: "Variable de control",
            tooltip: "Variable de control",
            sortable: true,
            dataIndex: 'idvariablecontrol',
            width: 90,
            renderer: renderVariable
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
                                filterDinamico.push({
                                    type: 'numeric',
                                    dataIndex: itemsNum[index].dataIndex
                                });
                                arrayIndexDinamicosTodos.push(itemsNum[index].dataIndex);
                                arrayIndexDinamicosNum.push(itemsNum[index].dataIndex);
                            }
                            break;
                        case 'datefield':
                            {
                                cf.cm[index].editor = new Ext.form.DateField(cf.cm[index].edit);
                                cf.cm[index].editor.format = 'd/m/Y';
                                cf.cm[index].tooltip = cf.cm[index].header;
                                filterDinamico.push({
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
                                arrayIndexDinamicosTodos.push(items[index].dataIndex);
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
                                        renderer: crearToolTip,
                                        store: almacen,
                                        listeners: {
                                            select: function (a, b, c) {
                                                for (var i = 0; i < smCT.getSelections().length; i++) {
                                                    stCT.getById(smCT.getSelections()[i].id).set(stCT.getById(smCT.getSelections()[i].id).fields.items[columna + contJRGrid].name, a.getValue());
                                                }
                                            }
                                        }
                                    })
                                };
                                filterDinamico.push({
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
                                filterDinamico.push({
                                    type: 'string',
                                    dataIndex: cf.cm[index].dataIndex
                                });
                            }
                            break;
                    }
                    cmdina.push(cf.cm[index]);
                }
            }
            for (var index = 0; index < cf.rd.length; index++) {
                readerdina.push(cf.rd[index]);
            }
        }

        jrStGpCT = new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'jrStGpCT',
            fields: readerdina
        });
        cmCT = new Ext.grid.ColumnModel(cmdina);
//para recorrer los indices dinamicos y trabajar con el render
        for (var i = 0; i < arrayIndexDinamicos.length; i++) {
            var indiceColumn = cmCT.findColumnIndex(arrayIndexDinamicos[i]);
            cmCT.setRenderer(indiceColumn, function (value, m, rec, row, col) {
                m.attr = 'ext:qtip="' + getRawValue(value, cmCT.getCellEditor(col, row).field, cmCT, col) + '"';
                return getRawValue(value, cmCT.getCellEditor(col, row).field, cmCT, col);
            });
        }
        for (var i = 0; i < arrayIndexDinamicosNum.length; i++) {
            var indiceColumn = cmCT.findColumnIndex(arrayIndexDinamicosNum[i]);
            cmCT.setRenderer(indiceColumn, function (value, m) {
                if (value != null) {
                    m.attr = 'ext:qtip="' + value + '"';
                    return value;
                } else {
                    m.attr = 'ext:qtip="' + 0 + '"';
                    return 0;
                }

            });
        }
        for (var i = 0; i < arrayIndexDinamicosCad.length; i++) {
            var indiceColumn = cmCT.findColumnIndex(arrayIndexDinamicosCad[i]);
            cmCT.setRenderer(indiceColumn, function (value, m) {
                if (value != null) {
                    m.attr = 'ext:qtip="' + value + '"';
                    return value;
                } else {
                    m.attr = 'ext:qtip=""';
                    return '';
                }
            });
        }
        stCT = new Ext.data.Store({
            url: 'listarCartasAddProduccion',
            listeners: {
                beforeload: function () {
                    mymask.show();
                    beforeloadstCT = true;
                    stCT.baseParams.idtipomodelo = cbTipoCarta.getValue();
                    stCT.baseParams.identidad = nodoEst.id;
                    stCT.baseParams.start = offsetCT;
                    cambiarTituloFiltrar(Ext.getCmp('gpCT'), filtrosCT, 'Cartas tecnológicas');
                },
                load: function (record) {
                    if (stCT.getCount() == 0) {
                        if (beforeloadstCT) {
                            if (filtrosCT.getFiltrosActivos().length > 0) {
                                mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                            }
                        }
                    }
                    controlarObjetosAddProduccion();
                    beforeloadstCT = false;
                    mymask.hide();
                }
            },
            reader: jrStGpCT
        });
        filtrosCT = new Ext.grid.GridFilters({
            filters: filterDinamico
        });
        btnLimpiarCT = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarCT',
            iconCls: 'limpiar',
            tooltip: "Limpiar",
            handler: function () {
                filtrosCT.clearFilters();
            }
        });
        pagCT = new Ext.PagingToolbar({
            store: stCT,
            displayInfo: true,
            items: [btnLimpiarCT],
            listeners: {
                beforechange: function (p, e) {
                    offsetCT = e.start;
                }
            }
        });

        smCT = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            id: 'smCT',
            listeners: {
                selectionchange: function (sm) {
                    controlarObjetosAddProduccion();
                }
            }
        });
    }

    function crearGrid(filtrosCT, stCT, cmCT, pagCT, smCT) {
        return new Ext.grid.EditorGridPanel({
            store: stCT,
            title: 'Cartas tecnológicas', //perfil.etiquetas.lbCT,
            id: 'gpCT',
            region: 'center',
            sm: smCT,
            cm: cmCT,
            frame: true,
            autoExpandColumn: 'expandir',
            plugins: filtrosCT,
            margins: '2 2 2 -4',
            clicksToEdit: 2,
            bbar: pagCT,
            loadMask: {
                msg: perfil.etiquetas.lbEspere
            },
            listeners: {
                beforeedit: function (e) {
                    columna = e.column;
                    //para el renderer luego
                    cmCT.getCellEditor(e.column, e.row).field.renderiza = true;
                },
                validateedit: function (e) {
                    if (e.originalValue != e.value)
                        cmCT.getCellEditor(e.column, e.row).field.renderiza = true;
                }
            }
        });

    }

    winAddProduccion.show();
}

function adicionarCTProduccion(apl) {
    recordsAdd = smCT.getSelections();
    cartastecnologicasAdd = [];
    if (recordsAdd.length > 0) {
        for (var i = 0; i < recordsAdd.length; i++) {
            cartastecnologicasAdd.push({
                idcartatecnologica: recordsAdd[i].data.idcartatecnologica,
                idcartatecnologicaentidad: recordsAdd[i].data.idcartatecnologicaentidad
            });
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'adicionarProduccion',
            params: {
                producciones: Ext.encode(cartastecnologicasAdd),
                identidad: nodoEst.id
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN > 0) {
                    if (apl) {
                        stCT.reload();
                    } else {
                        winAddProduccion.destroy();
                    }
                    mostrarMensaje(2, perfil.etiquetas.msgAdicionadoProduccionOk);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgAdicionadoProduccionNo);
                }
            }
        });
        smCT.clearSelections();
    }
}

function guardarProduccion() {
    var records = stProducciones.getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['idaplicacioncartatec'] = record.data['idaplicacioncartatec'];
        arreglo.push(rec);
    }
    if (arreglo.length > 0) {
        mymask.msg = perfil.etiquetas.msgGuardandoProduccion;
        mymask.show();
        Ext.Ajax.request({
            url: 'guardarProduccion',
            waitMsg: perfil.etiquetas.msgGuardandoProduccion,
            params: {
                producciones: Ext.encode(arreglo),
                identidad: nodoEst.id
            },
            callback: function (options, success, response) {
                mymask.hide();
                mymask.msg = perfil.etiquetas.lbCargando;
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardadoProduccionOk);
                    stProducciones.reload();
                } else if (responseData.codMsgN == 2) {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardadoProduccionNoSinNorma);
                } else if (responseData.codMsgN == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardadoProduccionNo);
                } else if (responseData.codMsgN == 3) {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardadoProduccionNoTodasSinNorma);
                    stProducciones.reload();
                } else {//4
                    mostrarMensaje(1, perfil.etiquetas.msgGuardadoProduccionNoTodas);
                    stProducciones.reload();
                }
            }
        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
    }
}

function eliminarProduccion() {
    mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarProduccion, eliminarObjetoProduccion);

    function eliminarObjetoProduccion(btnPresionado) {
        if (btnPresionado == 'ok') {
            var produccionesEliminar = [];
            var recordsSel = smProducciones.getSelections();
            if (recordsSel.length > 0) {
                for (var i = 0; i < recordsSel.length; i++)
                    if (recordsSel[i].data.idaprobacion == 1) {
                        produccionesEliminar.push({
                            idaplicacioncartatec: recordsSel[i].data.idaplicacioncartatec,
                            idcartatecnologica: recordsSel[i].data.idcartatecnologica
                        });
                    }
                if (produccionesEliminar.length == 0) {
                    return 0;
                }
                Ext.Ajax.request({
                    url: 'eliminarProducciones',
                    waitMsg: perfil.etiquetas.msgEliminandoProduccion,
                    params: {
                        producciones: Ext.encode(produccionesEliminar),
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgN > 0) {
                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoProduccionOk);
                            stProducciones.reload();
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoProduccionNo);
                        }
                    }
                });
            }
        }
    }
}

function aprobarProduccion(idaprobacion) {
    mymask.show();
    var produccionesActualizar = [];
    var recordsSel = smProducciones.getSelections();
    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++)
            produccionesActualizar.push({
                idaplicacioncartatec: recordsSel[i].data.idaplicacioncartatec
            });
        Ext.Ajax.request({
            url: 'aprobarProducciones',
            waitMsg: perfil.etiquetas.msgEliminandoProduccion,
            params: {
                producciones: Ext.encode(produccionesActualizar),
                idaprobacion: idaprobacion,
                integracion_proyecto: integracion_proyecto
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN > 0 && responseData.codIntegracionProy == 1) {
                    if (idaprobacion == 4)
                        mostrarMensaje(1, perfil.etiquetas.msgAprobadoProduccionOk);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoProduccionOk);
                    stProducciones.reload();
                } else if (responseData.codMsgN > 0 && responseData.codIntegracionProy == 0) {
                    if (idaprobacion == 4)
                        mostrarMensaje(1, perfil.etiquetas.msgAprobadoProduccionOkAddProyFail);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoProduccionOkDelProyFail);
                    stProducciones.reload();
                } else {
                    if (idaprobacion == 4)
                        mostrarMensaje(1, perfil.etiquetas.msgAprobadoProduccionNo);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoProduccionNo);
                }
            }
        });
    }
}

function exportarProducciones() {
    window.open('exportarProducciones?identidad=' + nodoEst.id +
            '&denoentidad=' + nodoEst.attributes.text +
            '&global=' + chkGlobal.getValue() +
            '&fechaInicio=' + Ext.encode(dateFechaInicio.getValue()) +
            '&fechaFin=' + Ext.encode(dateFechaFin.getValue()) +
            '&filtros=' + Ext.encode(filtrosProducciones.getFilterData()));
}

function exportarActividadesOIndicadoresProducciones(tipo) {
    var seleccion = smProducciones.getSelected() != undefined ? gpProducciones.getSelectionModel().getSelected().data : null;

    window.open('exportarActividadesOIndicadoresProducciones?denoentidad=' + nodoEst.attributes.text +
            '&idaplicacioncartatec=' + seleccion.idaplicacioncartatec +
            '&denominacion=' + seleccion.denominacion +
            '&producto=' + seleccion.producto +
            '&valorrendimiento=' + seleccion.valorrendimiento +
            '&nivelactividad=' + seleccion.nivelactividad +
            '&fechainicio=' + seleccion.fechainicio +
            '&fecha=' + seleccion.fecha +
            '&fechafin=' + seleccion.fechafin +
            '&tipo=' + tipo
            );
}

function adicionarAPlan(identidad) {
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
                cbEjercicioPlanes.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                listabasecalculo.getRootNode().reload();
            }
        }
    });
    cbEjercicioPlanes = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        width: 50,
        disabled: false,
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '80%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                listabasecalculo.collapseAll();
                storelistadoactualizarplanes.baseParams.idejercicio = cb.getValue();
                listabasecalculo.getRootNode().reload();
                Ext.getCmp('btnAceptaractualizarplanes').disable();
                Ext.getCmp('btnAplicaractualizarplanes').disable();
            }
        }
    });
    deleted_nodes = [];
    added_nodes = [];
    idejercicio = -1;
    btnCancelar = new Ext.Toolbar.Button({
        id: 'btnCancelaractualizarplanes',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        text: perfil.etiquetas.lbCancelar,
        handler: function () {
            winActualizarPlanes.close();
        }
    });
    btnAceptar = new Ext.Toolbar.Button({
        id: 'btnAceptaractualizarplanes',
        iconCls: 'aceptar',
        disabled: true,
        tooltip: perfil.etiquetas.msgGuardaryCerrar,
        text: perfil.etiquetas.lbAceptar,
        handler: function () {
            if (listabasecalculo.getSelectionModel().selNode) {
                winActualizarPlanes.close();
                utilAdicionar();
            }
        }
    });
    btnAplicar = new Ext.Toolbar.Button({
        id: 'btnAplicaractualizarplanes',
        iconCls: 'aplicar',
        tooltip: perfil.etiquetas.msgGuardarSinCerrar,
        text: perfil.etiquetas.lbAplicar,
        disabled: true,
        handler: function () {
            if (listabasecalculo.getSelectionModel().selNode) {
                utilAdicionar();
            }
        }
    });
    storelistadoactualizarplanes = new Ext.tree.TreeLoader({
        dataUrl: 'listarplanmodelo',
        preloadChildren: true,
        listeners: {
            beforeload: function (this_, node) {
                this_.baseParams.idesctructura = nodoEst.id;
                this_.baseParams.tipo = node.attributes.tipo;
                this_.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                Ext.Ajax.timeout = 60000;
                mymask.show();
            },
            load: function (this_, node, response) {
                if (node.id == 0 && expand_plan) {
                    node.expandChildNodes();
                }
                mymask.hide();
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
        title: 'Planes',
        rootVisible: true,
        autoScroll: true,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Planes',
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
                handler: function () {
                    expand_plan = true;
                    listabasecalculo.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: perfil.etiquetas.ttBtnColapsarEntidades,
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function () {
                    expand_plan = false;
                    listabasecalculo.root.collapse(true);
                }
            }
        ],
        listeners: {
            click: function (n) {
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
        title: 'Actualizar plan',
        width: 400,
        modal: true,
        constrain: true,
        height: 480,
        layout: 'fit',
        closeAction: 'destroy',
        tbar: ['Ejercicio: '],
        items: [cbEjercicioPlanes, listabasecalculo],
        buttons: [btnCancelar, btnAplicar, btnAceptar],
        listeners: {
            show: function (_this) {
                listabasecalculo.setTitle('Planes: ' + denom_ent);
            }
        }
    });
    winActualizarPlanes.show();
}

function utilAdicionar() {
    Ext.getBody().mask('Actualizando plan', 'ext-el-mask-msg x-mask-loading');
    Ext.Ajax.request({
        url: 'adicionarAPlan',
        timeout: 6400000,
        params: {
            idmodelo: listabasecalculo.getSelectionModel().selNode.id,
            idejercicio: cbEjercicioPlanes.getValue(),
            identidad: nodoEst.id
        },
        callback: function (options, success, response) {
            Ext.getBody().unmask();
            response = Ext.decode(response.responseText);
            if (response.codMsgN == 1) {
                mostrarMensaje(1, perfil.etiquetas.msgAddPlan1);
            }
            if (response.codMsgN == 3) {
                mostrarMensaje(1, perfil.etiquetas.msgAddPlan3);
            }

        }
    });


}

function validarBtnGuardar(sm) {
    var puedeGuardar = 0;
    var recordsSel = sm.getSelections();
    var cant = recordsSel.length;
    if (cant > 0) {
        for (var i = 0; i < cant; i++) {
            if (recordsSel[i].data.idaprobacion == 1) {
                puedeGuardar = 1;
                break;
            }
        }
    }
    return puedeGuardar;
}
