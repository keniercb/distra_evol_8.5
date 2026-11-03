var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('demandaproduccion', cargarInterfaz);
identidadselected = null;
fila = 0;
is_leaf = false;
var permiso_rector, permiso_ejecutor, aprobada_rector = false, superrector = false, tipo;
objci = {};
objci.acciones = [];
var lockHotKeys = false;
var interfazselecc = 'rector';
// function CargarInterfaz
function cargarInterfaz() {

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando//'Cargando'
    });
    //Cargo los permisos iniciales
    function init_rector() {
        if (objci.acciones.rector) {
            Ext.getCmp('btnAprobProductor').disable();
            Ext.getCmp('btnDesapProductor').disable();
        }
    }
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }

        init_rector();
    })

    filtrosRector = new Ext.grid.GridFilters({
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
                type: 'numeric',
                dataIndex: 'na'
            }, {
                type: 'numeric',
                dataIndex: 'naep'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }]
    });
    filtrosProductor = new Ext.grid.GridFilters({
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
                type: 'numeric',
                dataIndex: 'nad'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadpropio'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
            }, {
                type: 'numeric',
                dataIndex: 'nae'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }]
    });


    /******* Teclas calientes ***************/
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ll',
            alt: true,
            fn: function() {
                if (interfazselecc == 'rector')
                    seleccBtnLimpiarRector('Demanda de actividades');
                else
                    seleccBtnLimpiarProd('Demanda de actividades');

            }
        }
        , {
            key: 'Hh',
            alt: true,
            fn: function() {
               // mostrarAyuda('Demanda de actividades');
            }
        },
        {
            key: 'Qq', //aprobar
            alt: true,
            fn: function() {
                if (interfazselecc == 'rector') {
                    if (validarBtn(Ext.getCmp('btnAprobRector')))
                        seleccBtnAprobRector();
                } else {
                    if (validarBtn(Ext.getCmp('btnAprobProductor')))
                        seleccBtnAprobProd();
                }
            }
        }, {
            key: 'Ww', //desaprobar
            alt: true,
            fn: function() {
                if (interfazselecc == 'rector') {
                    if (validarBtn(Ext.getCmp('btnDesapRector')))
                        seleccBtnDesaprobRector();
                } else {
                    if (validarBtn(Ext.getCmp('btnDesapProductor')))
                        seleccBtnDesaprobProd();
                }
            }
        }, {
            key: 'Cc',
            ctrl: true,
            fn: function() {
            }
        }
    ]);

    teclascalientes = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 'Ee',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function(_this) {
                if (!Ext.getCmp('btnExportarRector').disabled) {
                    Ext.getCmp('btnExportarRector').handler.call(this);
                }
            }
        }

    ]);
    teclascalientes.enable();

    /******* Fin teclas calientes ***************/


    btnAyudaRector = new Ext.Button({
        disabled: false,
        id: 'btnAyudaDemanda',
       // icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbTtAyuda//,
        //text: perfil.etiquetas.lbAyuda,
    });


//    function mostrarAyuda(referencia, title) {
//        var title = perfil.etiquetas.lbTituloAyudaDemanda;
//        var referencia = 'demandaactividades';//esto puede ser el id del boton o cualquier cosa 
//        help.show(title, referencia);
//    }



    btnAyudaProductor = new Ext.Button({
        disabled: false,
        id: 'btnAyudaProductor',
       // icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbTtAyuda,
        //text: perfil.etiquetas.lbAyuda,
        handler: function() {
            mostrarAyuda('Demanda de actividades');
        }
    });

    btnExportarRector = new Ext.Button({
        id: 'btnExportarRector',
        //icon: perfil.dirImg + 'exportar.png',
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbTtBtnExportarDemanda,
       // text: perfil.etiquetas.lbBtnExportar,
        handler: function() {
            exportar('rector');
        }
    });
    btnExportarProductor = new Ext.Button({
        id: 'btnExportarProductor',
       // icon: perfil.dirImg + 'exportar.png',
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbTtBtnExportarDemanda,
       // text: perfil.etiquetas.lbBtnExportar,
        handler: function() {
            exportar('productor');
        }
    });

    function seleccBtnAyudaProd(opcion) {
        var urlayuda = "../../../comun/templates/Ayuda/Bases para el plan/Demanda de actividades/" + opcion + ".html";
        window.open(urlayuda, "Ayuda", "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");

    }
    btnLimpiarRector = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarRector',
       // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtLimpiarFiltros,
       // text: perfil.etiquetas.lbLimpiar,
        handler: function() {
            seleccBtnLimpiarRector();
        }
    });

    function seleccBtnLimpiarRector() {
        Ext.getCmp('btnAprobRector').disable();
        Ext.getCmp('btnDesapRector').disable();
        Ext.getCmp('cbEspecialidadRector').reset();
        cbEspecialidadEconomia.reset();
        cbEspecialidadRector.reset();
        filtrosRector.clearFilters();
        stRector.reload();
        storeEspecialidad.reload();
        storeEspecialidadEconomia.reload();
        cambiarTituloFiltrarRector();
        Ext.getCmp('btnAprobRector').enable();
        Ext.getCmp('btnDesapRector').enable();
        smRector.deselectRow(0);
    }
    btnLimpiarProductor = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarProductor',
      //  icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtLimpiarFiltros,
        //text: perfil.etiquetas.lbLimpiar,
        handler: function() {
            seleccBtnLimpiarProd();
        }
    });
    function seleccBtnLimpiarProd() {
        Ext.getCmp('cbEspecialidadRector').reset();
        cbEspecialidadProductorEco.reset();
        cbEspecialidadProductor.reset();
        filtrosProductor.clearFilters();
        stProductor.reload();
        storeEspecialidadProductor.reload();
        storeEspecialidadProductorEco.reload();
        cambiarTituloFiltrarProductor();
        Ext.getCmp('btnAprobProductor').enable();
        Ext.getCmp('btnDesapProductor').enable();
        smProductor.deselectRow(0);

    }

    storeEspecialidad = new Ext.data.Store({
        url: 'listarEspecialidadesRector',
        reader: new Ext.data.JsonReader({
            id: 'id',
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function() {
                storeEspecialidad.baseParams.id = cbEspecialidadEconomia.getValue();
            }
        }
    })
    storeEspecialidadProductor = new Ext.data.Store({
        url: 'listarEspecialidadesProductor',
        reader: new Ext.data.JsonReader({
            id: 'id',
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function() {
                storeEspecialidadProductor.baseParams.id = cbEspecialidadProductorEco.getValue();
            }
        }
    })
    storeEspecialidadEconomia = new Ext.data.Store({
        url: 'listarEspecialidadesSuperRector',
        reader: new Ext.data.JsonReader({
            id: 'id',
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'denominacion'
            }])
    })
    storeEspecialidadProductorEco = new Ext.data.Store({
        url: 'listarProductores',
        reader: new Ext.data.JsonReader({
            id: 'id',
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'denominacion'
            }])
    })
    cbEspecialidadRector = new Ext.form.ComboBox({
        id: 'cbEspecialidadRector',
        emptyText: perfil.etiquetas.lbSeleccEsp,
        store: storeEspecialidad,
        valueField: 'id',
        displayField: 'denominacion',
        mode: 'remote',
        editable: false,
        listWidth: 250,
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                stRector.reload();
            }
        }
    });
    cbEspecialidadProductor = new Ext.form.ComboBox({
        id: 'cbEspecialidadProductor',
        emptyText: perfil.etiquetas.lbSeleccEsp,
        store: storeEspecialidadProductor,
        valueField: 'id',
        displayField: 'denominacion',
        mode: 'remote',
        editable: false,
        listWidth: 250,
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function() {

                stProductor.reload();
            }
        }
    });
    cbEspecialidadEconomia = new Ext.form.ComboBox({
        id: 'cbEspecialidadEconomia',
        emptyText: perfil.etiquetas.lbSeleccEsp,
        store: storeEspecialidadEconomia,
        valueField: 'id',
        displayField: 'denominacion',
        mode: 'remote',
        editable: false,
        listWidth: 250,
        hidden: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                cbEspecialidadRector.reset();
                storeEspecialidad.reload();
                stRector.reload();

            }
        }
    });
    cbEspecialidadProductorEco = new Ext.form.ComboBox({
        id: 'cbEspecialidadProductorEco',
        emptyText: perfil.etiquetas.lbSeleccEsp,
        store: storeEspecialidadProductorEco,
        valueField: 'id',
        displayField: 'denominacion',
        mode: 'remote',
        editable: false,
        listWidth: 250,
        hidden: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                cbEspecialidadProductor.reset();
                storeEspecialidadProductor.reload();
                stProductor.reload();
                Ext.getCmp('btnAprobProductor').enable();
                Ext.getCmp('btnDesapProductor').enable();
            }
        }
    });
    stRector = new Ext.data.Store({
        url: 'listarActividadesRectoreadas',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idactividad'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'na'
            }, {
                name: 'naep'
            }, {
                name: 'idaprobacion'
            }]),
        listeners: {
            beforeload: function() {
                cambiarTituloFiltrarRector();
                stRector.baseParams.superrector = superrector;
                stRector.baseParams.idespecialidadrector = cbEspecialidadEconomia.getValue();
                stRector.baseParams.idespecialidad = cbEspecialidadRector.getValue();
                stRector.baseParams.start = 0;
                stRector.baseParams.limit = 20;
            }
        }
    });
    smRector = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    smRector.on("rowselect", function(sm, rowIndex, record) {
        fila = rowIndex;
        if (sm.getSelected().data.idaprobacion >= '6' && objci.acciones.rector == undefined) {
            /* Es 3 o 4 esta aprobada */
            cmRector.setEditable(2, false);
        } else {
            /* Esta desaprobada */
            cmRector.setEditable(2, true);
        }
    });
    cmRector = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo, //'Código',
            width: 100,
            sortable: true,
            dataIndex: 'codigo'
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion, // 'Denominación',
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            header: perfil.etiquetas.lbNA, //'NA',
            width: 100,
            sortable: true,
            renderer: renderPonerCero,
            tooltip: perfil.etiquetas.lbNivelActividad, //'Nivel de actividad',
            dataIndex: 'na'
        }, {
            header: perfil.etiquetas.lbNAEP,
            width: 100,
            sortable: true,
            renderer: renderPonerCero,
            tooltip: perfil.etiquetas.lbNivelActAprobadaPorProd, //'Nivel de actividad aprobada por el productor',
            dataIndex: 'naep'
        }, {
            header: perfil.etiquetas.lbDiferencia,
            width: 100,
            sortable: true,
            dataIndex: 'diferencia',
            renderer: function(v, params, record) {
                return record.data.naep - record.data.na;
            },
            tooltip: perfil.etiquetas.lbDifNivelAct
        }, {
            header: perfil.etiquetas.lbAprobado,
            width: 80,
            sortable: true,
            align: 'center',
            dataIndex: 'idaprobacion',
            renderer: modificarAprobacion
        }]);
    gpRector = new Ext.grid.EditorGridPanel({
        id: 'gpRector',
        frame: true,
        autoExpandColumn: 'expandir',
        store: stRector,
        cm: cmRector,
        plugins: filtrosRector,
        clicksToEdit: 2,
        region: 'center',
        autoWidth: true,
        autoHeigth: true,
        margins: '2 2 2 -4',
        sm: smRector,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stRector,
            displayInfo: true,
            items: [btnLimpiarRector]

        })
    });
    stProductor = new Ext.data.Store({
        url: 'listarActividadesDemandadasAlProductorPorElRector',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idactividad'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'nad'
            }, {
                name: 'nae'
            }, {
                name: 'nivelactividadpropio'
            }, {
                name: 'idaprobacion'
            }]),
        listeners: {
            beforeload: function() {
                stProductor.baseParams.superrector = superrector;
                stProductor.baseParams.idespecialidad = cbEspecialidadProductor.getValue();
                stProductor.baseParams.idespecialidadrector = cbEspecialidadProductorEco.getValue();
                cambiarTituloFiltrarProductor();
                stProductor.baseParams.start = 0;
                stProductor.baseParams.limit = 20;
            }
        }
    });
    smProductor = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    smProductor.on("rowselect", function(sm, rowIndex, record) {
        fila = rowIndex;
        Ext.getCmp('btnDesapProductor').disable();
        Ext.getCmp('btnAprobProductor').disable();
        if (sm.getSelected().data.idaprobacion == 1 || sm.getSelected().data.idaprobacion == null) {
            cmProductor.setEditable(4, true); //4 = nro columna /* Esta desaprobada */
            Ext.getCmp('btnAprobProductor').enable();
            Ext.getCmp('btnDesapProductor').disable();
        }
        else {
            cmProductor.setEditable(4, false);    // * Es 3 o 4 esta aprobada */
            if (sm.getSelected().data.idaprobacion == 3 || (sm.getSelected().data.idaprobacion == 4 && objci.acciones.rector)) {
                Ext.getCmp('btnAprobProductor').disable();
                Ext.getCmp('btnDesapProductor').enable();
            }
        }
    });
    cmProductor = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo'
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion, //'Denominación',
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            header: perfil.etiquetas.lbNAD,
            width: 100,
            renderer: renderPonerCero,
            tooltip: perfil.etiquetas.lbNivelActividadDemandado,
            dataIndex: 'nad'
        },
        {
            header: perfil.etiquetas.lbNAP,
            width: 100,
            renderer: renderPonerCero,
            dataIndex: 'nivelactividadpropio',
            tooltip: perfil.etiquetas.lbNivelActProp
        }, {
            header: perfil.etiquetas.lbNAE,
            width: 100,
            renderer: renderPonerCero,
            dataIndex: 'nae',
            tooltip: perfil.etiquetas.lbNivelActAEjecutar,
            editor: new Ext.form.NumberField({
                allowNegative: false
            })
        }, {
            header: perfil.etiquetas.lbDiferencia,
            width: 100,
            sortable: true,
            dataIndex: 'diferencia',
            renderer: function(v, params, record) {
                return record.data.nae - record.data.nad - record.data.nivelactividadpropio;
            },
            tooltip: perfil.etiquetas.lbDifNivelAct
        }, {
            header: perfil.etiquetas.lbAprobado,
            width: 80,
            sortable: true,
            align: 'center',
            dataIndex: 'idaprobacion',
            renderer: modificarAprobacionProductor
        }]);
    gpProductor = new Ext.grid.EditorGridPanel({
        id: 'gpProductor',
        frame: true,
        autoExpandColumn: 'expandir',
        store: stProductor,
        cm: cmProductor,
        clicksToEdit: 2,
        region: 'center',
        autoWidth: true,
        plugins: filtrosProductor,
        autoHeigth: true,
        margins: '2 2 2 -4',
        sm: smProductor,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stProductor,
            displayInfo: true,
            items: [btnLimpiarProductor]
        }),
        listeners: {
            afteredit: function(sm) {
                if (sm.record.data.idaprobacion != 1 && sm.record.data.idaprobacion != null)
                    return;
                var campos_modificados = [];
                campos_modificados.push({
                    idactividad: sm.record.data.idactividad,
                    nae: sm.record.data.nae
                });
                actualizarNivActividad(campos_modificados);
            }
        }
    });
    textEconomia = new Ext.Toolbar.TextItem({
        text: perfil.etiquetas.lbRector,
        hidden: true
    })
    textProductor = new Ext.Toolbar.TextItem({
        text: perfil.etiquetas.lbProductor,
        hidden: true
    })
    panelGeneral = new Ext.Panel({
        layout: 'accordion',
        id: 'panelGeneral',
        frame: true,
        items: [{
                id: 'panelRector',
                title: perfil.etiquetas.lbDemandaRector,
                layout: 'border',
                items: gpRector,
                tbar: [textEconomia, cbEspecialidadEconomia, ' ', {
                        xtype: 'tbtext',
                        text: perfil.etiquetas.lbDemandante
                    }, ' ', cbEspecialidadRector, '-', new Ext.Toolbar.MenuButton({
                       // text: perfil.etiquetas.lbAprobacion,
                        tooltip: {
                            text: perfil.etiquetas.lbAprobNivelesActividades//,
                            //title: perfil.etiquetas.lbAprobacion
                        },
                        //icon: perfil.dirImg + 'area.png',
                        iconCls: 'area',
                        menu: {
                            items: [{
                                    id: 'btnAprobRector',
                                   // icon: perfil.dirImg + 'aprobar.png',
                                    //iconCls: 'btn',
                                    itemCls: 'x-menu-item icondistra-aprobar',
                                    iconCls: 'imagen-none',
                                    tooltip: perfil.etiquetas.lbAprobarNiveles,
                                    text: perfil.etiquetas.lbAprobar,
                                    handler: function() {
                                        seleccBtnAprobRector();
                                    }
                                }, {
                                    id: 'btnDesapRector',
                                    //icon: perfil.dirImg + 'desaprobar.png',
                                   // iconCls: 'btn',
                                    itemCls: 'x-menu-item icondistra-desaprobar',
                                    iconCls: 'imagen-none',
                                    tooltip: perfil.etiquetas.lbDesapNiveles,
                                    text: perfil.etiquetas.lbDesaprobar,
                                    handler: function() {
                                        seleccBtnDesaprobRector();
                                    }
                                }]
                        }
                    }), '-', btnExportarRector, '->', btnAyudaRector]
            }, {
                id: 'panelProductor',
                title: perfil.etiquetas.lbDemandaDelProductor,
                layout: 'border',
                items: gpProductor,
                tbar: [textProductor, cbEspecialidadProductorEco, ' ', {
                        xtype: 'tbtext',
                        text: perfil.etiquetas.lbDemandante
                    }, ' ', cbEspecialidadProductor, '-', new Ext.Toolbar.MenuButton({
                        text: perfil.etiquetas.lbAprobacion,
                        tooltip: {
                            text: perfil.etiquetas.lbAprobNivelesActividades//,
                          //  title: perfil.etiquetas.lbAprobacion
                        },
                        icon: perfil.dirImg + 'area.png',
                        iconCls: 'area',
                        menu: {
                            items: [{
                                    id: 'btnAprobProductor',
                                   // icon: perfil.dirImg + 'aprobar.png',
                                   // iconCls: 'btn',
                                itemCls: 'x-menu-item icondistra-aprobar',
                                iconCls: 'imagen-none',
                                    tooltip: perfil.etiquetas.lbAprobarNivelesActAEjecutar,
                                    text: perfil.etiquetas.lbAprobar,
                                    handler: function() {
                                        seleccBtnAprobProd();
                                    }
                                }, {
                                    id: 'btnDesapProductor',
                                    //icon: perfil.dirImg + 'desaprobar.png',
                                    //iconCls: 'btn',
                                    itemCls: 'x-menu-item icondistra-aprobar',
                                    iconCls: 'imagen-none',
                                    tooltip: perfil.etiquetas.lbDesapNivsActAEjecutar,
                                    text: perfil.etiquetas.lbDesaprobar,
                                    handler: function() {
                                        seleccBtnDesaprobProd();
                                    }
                                }]
                        }
                    }), '-', btnExportarProductor, '->', btnAyudaProductor]
            }]
    });

    Ext.getCmp('panelRector').on('beforeexpand', function() {
        interfazselecc = 'rector';
    });
    Ext.getCmp('panelProductor').on('beforeexpand', function() {
        interfazselecc = 'productor';
    });

    function seleccBtnAprobRector() {
        tipo = 'rector';
        cambiarAprobacion(objci.acciones.rector ? 4 : 5, gpRector, smRector, cbEspecialidadRector, cbEspecialidadEconomia, cbEspecialidadProductorEco);
    }

    function seleccBtnDesaprobRector() {
        tipo = 'rector';
        cambiarAprobacion(1, gpRector, smRector, cbEspecialidadRector, cbEspecialidadEconomia, cbEspecialidadProductorEco);
    }

    function seleccBtnAprobProd() {
        tipo = 'productor';
        cambiarAprobacion(objci.acciones.rector ? 4 : 3, gpProductor, smProductor, cbEspecialidadProductor, cbEspecialidadEconomia, cbEspecialidadProductorEco);
    }
    function seleccBtnDesaprobProd() {
        tipo = 'productor';
        cambiarAprobacion(1, gpProductor, smProductor, cbEspecialidadProductor, cbEspecialidadEconomia, cbEspecialidadProductorEco);
    }
    vpDemanda = new Ext.Viewport({
        layout: 'fit',
        items: [panelGeneral]
    });
    textEconomia.hide();
    textProductor.hide();
    PermisosIniciales();
    //************FUNCIONES*******************
    function actualizarNivActividad(campos_modificados) {
        if (campos_modificados.length > 0) {
            Ext.Ajax.request({
                url: 'adicionarModificarNivelActAEjecutar',
                params: {
                    niveles: Ext.encode(campos_modificados)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 3) {
                        mostrarMensaje(3, perfil.etiquetas.lbmsgError);
                    }
                    if (responseData.si == 1) {
                        actualizarInterfazUsuario(responseData);
                        SeleccionarFila(smProductor, stProductor, fila);
                        gpProductor.startEditing(fila, 3);
                    }
                }
            });
        }
    }
    function actualizarInterfazUsuario(responseData) {
        if (responseData === undefined) {
            return;
        }
        if (responseData.mods == undefined) {
            return;
        }
        //escribir los niveles en la interfaz
        for (var i = 0; i < responseData.mods.length; i++) {
            gpProductor.getStore().getById(responseData.mods[i].idactividad).data.nae = responseData.mods[i].nae;
            gpProductor.getStore().getById(responseData.mods[i].idactividad).commit();
        }
    }
    function SeleccionarFila(sm, st, fila) {
        var filaSeleccionada = parseInt(fila);
        if (filaSeleccionada != st.getCount() - 1)
            sm.selectRow(filaSeleccionada + 1);
        else
            sm.selectRow(filaSeleccionada);
    }
    function cambiarTituloFiltrarRector() {
        var filtrado_por = "";
        var sep = "/";
        if (filtrosRector.getFiltrosActivos() == undefined || filtrosRector.getFiltrosActivos().length == 0) {
            Ext.getCmp('panelRector').setTitle("<b>Demanda al rector</b>");
        } else {
            for (i = 0; i < filtrosRector.getFiltrosActivos().length; i++) {
                var aux = "";
                if (filtrosRector.getFiltrosActivos()[i].dataIndex == "denominacion") {
                    aux = perfil.etiquetas.lbDenominacion;
                } else if (filtrosRector.getFiltrosActivos()[i].dataIndex == "codigo") {
                    aux = perfil.etiquetas.lbCodigo;
                } else if (filtrosRector.getFiltrosActivos()[i].dataIndex == "na") {
                    aux = perfil.etiquetas.lbNA;
                } else {
                    aux = perfil.etiquetas.lbNAEP;
                }
                if (i == filtrosRector.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            Ext.getCmp('panelRector').setTitle(perfil.etiquetas.lbTituloFiltradoDemandaAlRector + filtrado_por + '</i></b>');
            filtrado_por = "";
        }
    }
    function cambiarTituloFiltrarProductor() {
        var filtrado_por = "";
        var sep = "/";
        if (filtrosProductor.getFiltrosActivos() == undefined || filtrosProductor.getFiltrosActivos().length == 0) {
            Ext.getCmp('panelProductor').setTitle(perfil.etiquetas.lbDemandaDelProductor);
        } else {
            for (i = 0; i < filtrosProductor.getFiltrosActivos().length; i++) {
                var aux = "";
                if (filtrosProductor.getFiltrosActivos()[i].dataIndex == "denominacion") {
                    aux = perfil.etiquetas.lbDenominacion;
                } else if (filtrosProductor.getFiltrosActivos()[i].dataIndex == "codigo") {
                    aux = perfil.etiquetas.lbCodigo;
                } else if (filtrosProductor.getFiltrosActivos()[i].dataIndex == "nad") {
                    aux = perfil.etiquetas.lbNAD;
                } else {
                    aux = perfil.etiquetas.lbNAE;
                }
                if (i == filtrosProductor.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            Ext.getCmp('panelProductor').setTitle(perfil.etiquetas.lbTituloFiltradoDemandaDelProd + filtrado_por + '</i></b>');
            filtrado_por = "";
        }
    }
    function renderPonerCero(val) {
        if (val == null)
            return 0
        else
            return val
    }
    function cambiarAprobacion(aprobacion, grid, selectionmodel, comboesp, comborec, comboprod) {
        var recordsSel = grid.getSelectionModel().getSelections(), actaprobar = [];
        aprobada_rector = false;
        for (var i = 0; i < recordsSel.length; i++) {
            if (tipo == 'productor' && recordsSel[i].data.idaprobacion == '4' && objci.acciones.rector == undefined) { //  >='6'
                aprobada_rector = true
                break;
            } else if (tipo == 'rector' && recordsSel[i].data.idaprobacion >= '6' && objci.acciones.rector == undefined) {
                aprobada_rector = true;
                break;
            }
            actaprobar.push(
                    recordsSel[i].data.idactividad
                    );
        }
        if (aprobada_rector) {
            mostrarMensaje(3, perfil.etiquetas.msgNoPuedeRealizarAccion1);
            aprobada_rector = false;
        } else {
            if (recordsSel.length == 0) {
                if (aprobacion == 5 || aprobacion == 4) {
                    mostrarMensaje(2, perfil.etiquetas.msgConfigAprobTodosNivAct, aprobardesaprobar);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgConfigDesaprobTodosNivAct, aprobardesaprobar);
                }
            } else {
                if (aprobacion == 5 || aprobacion == 4) {
                    mostrarMensaje(2, perfil.etiquetas.msgConfigAprobNivAct, aprobardesaprobar);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgConfigDesaprobNivAct, aprobardesaprobar);
                }
            }

        }
        function aprobardesaprobar(btnPresionado) { //aprobar por el rector
            if (btnPresionado == 'ok') {
                mymask.show();
                Ext.Ajax.request({
                    url: 'guardaraprobacion',
                    params: {
                        actividades: Ext.encode(actaprobar),
                        idaprobacion: aprobacion,
                        idespecialidad: comboesp.getValue(),
                        idespecialidadrector: comborec.getValue(),
                        idespecialidadproductor: comboprod.getValue(),
                        tipo: tipo,
                        rectorseguridad: superrector
                    },
                    callback: function(options, success, response) {
                        mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 24) {
                            if (selectionmodel.getSelected()) {
                                grid.getStore().getById(selectionmodel.getSelected().id).idaprobacion = responseData.idaprobacion;
                                grid.getStore().getById(selectionmodel.getSelected().id).commit();
                                grid.getStore().reload({
                                    params: {
                                        anode: null
                                    }
                                });
                            } else

                            if (aprobacion == 4 || aprobacion == 5)
                                mostrarMensaje(1, perfil.etiquetas.msgAprobRetorno, function() {
                                    grid.getStore().reload({
                                        start: 0,
                                        limit: 20
                                    });
                                });
                            else
                                mostrarMensaje(1, perfil.etiquetas.msgDesaprobRetorno, function() {
                                    grid.getStore().reload({
                                        start: 0,
                                        limit: 20
                                    });
                                });
                        } else
                            mostrarMensaje(3, perfil.etiquetas.msgError);
                    }
                });
            }
        }
    }
    function PermisosIniciales() {
        mymask.show();
        Ext.Ajax.request({
            method: 'POST',
            url: 'cargarconfiguracionpermisosiu',
            callback: function(options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                permiso_rector = responseData.permisos.rectorActiv;
                permiso_ejecutor = responseData.permisos.esEjecutor;
                if (objci.acciones.rector) {
                    textEconomia.show();
                    cbEspecialidadEconomia.show();
                    textProductor.show();
                    cbEspecialidadProductorEco.show();
                    superrector = true;
                    Ext.getCmp('btnAprobRector').disable();
                    Ext.getCmp('btnDesapRector').disable();

                }
                stProductor.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
                stRector.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });

            }
        });
    }
    /*
     *'tick(amarillo).png'----aprobado
     *'tick.png'----aprobado Rector Economia verde
     *'tick(azul).png'----aprobado 5 azul
     *'cross.png'----desaprobado rojo
     **/
    function modificarAprobacion(val) {
        if (val < 6 && val >= 5)
            return '<span><img src=' + perfil.dirImg + 'tick(azul).png' + '>';
        else if (val >= 6)
            return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
        else if (val < 5 && val >= 3)
            return '<span><img src=' + perfil.dirImg + 'tick(amarillo).png' + '>';
        return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
    }
    function modificarAprobacionProductor(val) {
        if (val == 3)
            return '<span><img src=' + perfil.dirImg + 'tick(amarillo).png' + '>';
        else if (val == 4)
            return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';//aprobado por el max. rector que es 4
        else
            return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
    }

    function validarBtn(btn) {
        return btn.hidden == false && !btn.disabled && !lockHotKeys
    }

    function exportar(tipo) {
        window.open("exportar?superrector=" + superrector
                + "&idespecialidadrector=" + cbEspecialidadEconomia.getValue()
                + "&idespecialidad=" + cbEspecialidadRector.getValue()
                + "&tipo=" + tipo
                + "&fxc=" + Ext.encode(getFiltrosActivos(tipo)));
    }

    function getFiltrosActivos(tipo) {
        if (tipo == 'rector') {
            return filtrosRector.getFilterData();
        }
        return filtrosProductor.getFilterData();
    }
}