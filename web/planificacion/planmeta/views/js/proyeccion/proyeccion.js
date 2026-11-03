//cargando etiquetas, acciones, inicializando variables y el componente
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('proyeccion', cargarInterfaz);
var rectora, identidadselected = null, modificar = 0, fila = 0, offset = 0, offsetE = 0;
objci = {};
objci.acciones = [];

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
        }
        else {
            rectora = 0;
        }
    });

//Arbol de entidades
    trEnt = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 300
            });

    trEnt.btnBuscar.setText("");
    trEnt.btnLimpiar.setText("");
    trEnt = trEnt.items.items[0];
    trEnt.getRootNode().expand();
    trEnt.region = 'west';

    trEnt.addListener('click', function(n) {
        if (n.text != "Estructuras") {
            gpProyeccion.enable();
            gpProyeccionxejercicio.enable();
            identidadselected = n.id;
            gpProyeccion.getStore().reload();
            btnAdicionarProyeccion.enable();
        }
        else {
            gpProyeccion.disable();
            gpProyeccionxejercicio.disable();
            var store = gpProyeccion.getStore();
            store.removeAll();
            var storeX = gpProyeccionxejercicio.getStore();
            storeX.removeAll();
        }
    });

    /******************Grid de proyecciones****************************/
//JsonReader del grid proyeccion
    jrstProyeccion = new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'data'
            },
    [
        {
            name: 'numero'
        },
        {
            name: 'denominacion'
        },
        {
            name: 'descripcion'
        },
        {
            name: 'fecha'
        },
        {
            name: 'componente'
        },
        {
            name: 'ejerciciobase'
        },
        {
            name: 'idejercicio'
        },
        {
            name: 'planes'
        },
        {
            name: 'importeingreso'
        },
        {
            name: 'importegasto'
        },
        {
            name: 'tipo'
        },
        {
            name: 'idproyeccion'
        },
        {
            name: 'porciento'
        }
    ]
            );

//Store del grid proyeccion
    stProyeccion = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarProyeccion',
        listeners: {
            beforeload: function() {
                stProyeccion.baseParams.identidad = identidadselected;
                stProyeccion.baseParams.start = offset;
                cambiarTituloFiltrarProyeccion();
            },
            load: function(st, rec, obj) {
                smProyeccion.clearSelections();
                stProyeccionxejercicio.removeAll();
                btnEliminarProyeccionxejercicioTodos.hide();
                btnEliminarProyeccionxejercicio.hide();
                btnModificarProyeccion.disable();
                btnEliminarProyeccion.disable();
                if (st.getCount() > 0)
                    smProyeccion.selectRow(parseInt(fila));
                else {
                    btnEliminarProyeccionxejercicioTodos.hide();
                    btnEliminarProyeccionxejercicio.hide();
                    btnModificarProyeccionxejercicio.disable();
                    btnAdicionarProyeccionxejercicio.disable();
                    pgpProyeccionxejercicio.collapse();
                    stProyeccionxejercicio.removeAll();
                    Ext.getCmp('btnproyectar').disable();
                    Ext.getCmp('mnExportar').disable();
                    Ext.getCmp('btnGeneral').disable();
                    Ext.getCmp('btnResumen').disable();
                }
            }
        },
        reader: jrstProyeccion
    });

//Column model del grid proyeccion
    cmProyeccion = new Ext.grid.ColumnModel(
            [
                {
                    header: perfil.etiquetas.lbNo,
                    sortable: true,
                    width: 60,
                    dataIndex: 'numero',
                    tooltip: perfil.etiquetas.lbNo,
                    renderer: Creartip
                },
                {
                    id: 'expandir',
                    header: perfil.etiquetas.lbDenominacion,
                    sortable: true,
                    dataIndex: 'denominacion',
                    tooltip: perfil.etiquetas.lbDenominacion,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbTipo,
                    sortable: true,
                    width: 100,
                    dataIndex: 'tipo',
                    tooltip: perfil.etiquetas.lbTipo,
                    renderer: nombreTipo
                },
                {
                    header: perfil.etiquetas.lbDescripcion,
                    sortable: true,
                    hidden: true,
                    width: 300,
                    dataIndex: 'descripcion',
                    tooltip: perfil.etiquetas.lbDescripcion,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbFecha,
                    tooltip: perfil.etiquetas.lbFecha,
                    dataIndex: 'fecha',
                    align: 'center',
                    width: 150,
                    sortable: true,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbComponente,
                    sortable: true,
                    dataIndex: 'componente',
                    width: 150,
                    tooltip: perfil.etiquetas.lbComponente,
                    renderer: nombreComponente
                },
                {
                    header: perfil.etiquetas.lbEjerBase,
                    sortable: true,
                    width: 100,
                    align: 'center',
                    dataIndex: 'ejerciciobase',
                    tooltip: perfil.etiquetas.lbEjerBase,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbPlanes,
                    sortable: true,
                    width: 300,
                    dataIndex: 'planes',
                    tooltip: perfil.etiquetas.lbPlanes,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbImporteIngreso,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'importeingreso',
                    width: 100,
                    tooltip: perfil.etiquetas.lbImporteIngreso,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbImporteGasto,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'importegasto',
                    width: 100,
                    tooltip: perfil.etiquetas.lbImporteGasto,
                    renderer: Creartip
                }
            ]
            );
    cmProyeccion.defaultSortable = true;

//Selection model del grid proyeccion
    smProyeccion = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        id: 'smProyeccion'
    });
    smProyeccion.on("rowselect", function(sm, rowIndex, record) {
        fila = rowIndex;
        if (sm.getCount() == 1) {
            gpProyeccionxejercicio.getStore().reload();
            btnModificarProyeccion.enable();
            btnAdicionarProyeccionxejercicio.enable();
            Ext.getCmp('btnproyectar').enable();
        }
        else {
            btnModificarProyeccion.disable();
            btnAdicionarProyeccionxejercicio.disable();
            btnEliminarProyeccionxejercicioTodos.hide();
            btnEliminarProyeccionxejercicio.hide();
            stProyeccionxejercicio.removeAll();
            Ext.getCmp('btnproyectar').disable();
            Ext.getCmp('mnExportar').disable();
            Ext.getCmp('btnGeneral').disable();
            Ext.getCmp('btnResumen').disable();
        }
        if (sm.getCount() > 0)
            btnEliminarProyeccion.enable();
        else
            btnEliminarProyeccion.disable();
    });
    smProyeccion.on("rowdeselect", function(sm, rowIndex, record) {
        if (sm.getCount() == 1) {
            gpProyeccionxejercicio.getStore().reload();
            btnModificarProyeccion.enable();
            btnAdicionarProyeccionxejercicio.enable();
            Ext.getCmp('btnproyectar').enable();
        }
        else {
            btnModificarProyeccion.disable();
            btnEliminarProyeccionxejercicioTodos.hide();
            btnAdicionarProyeccionxejercicio.disable();
            stProyeccionxejercicio.removeAll();
            Ext.getCmp('btnproyectar').disable();
            Ext.getCmp('mnExportar').disable();
            Ext.getCmp('btnGeneral').disable();
            Ext.getCmp('btnResumen').disable();
        }
        if (sm.getCount() > 0)
            btnEliminarProyeccion.enable();
        else
            btnEliminarProyeccion.disable();
    });

//Filtros del grid proyeccion 
    filtrosProyeccion = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            },
            {
                type: 'string',
                dataIndex: 'descripcion'
            },
            {
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'list',
                dataIndex: 'componente',
                multiple: true,
                options: [
                    perfil.etiquetas.lbNA,
                    perfil.etiquetas.lbPlan,
                    perfil.etiquetas.lbBM
                ]
            },
            {
                type: 'listado',
                dataIndex: 'ejerciciobase',
                idcombo: 'idcmbejercicio',
                urlcb: 'listarEjercicios',
                idstore: 'idstejercicio',
                valueFieldcb: 'idejercicio',
                displayFieldcb: 'ejercicio'
            },
            {
                type: 'listado',
                dataIndex: 'planes',
                idcombo: 'idcmbplanes',
                urlcb: 'listarPlanes',
                idstore: 'idstplanes',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion'
            },
            {
                type: 'numeric',
                dataIndex: 'importeingreso'
            },
            {
                type: 'numeric',
                dataIndex: 'importegasto'
            }, {
                type: 'list',
                dataIndex: 'tipo',
                multiple: true,
                options: [
                    perfil.etiquetas.lbLineal,
                    perfil.etiquetas.lbProgresiva]
            }

        ]
    });

//Boton para limpiar los filtros del grid proyeccion
    btnLimpiarfilProy = new Ext.Button({
        id: 'btnLimpiarfilProy',
        tooltip: perfil.etiquetas.lbLimpFilt,
        iconCls: 'limpiar',
        handler: function() {
            limpiarFiltrosProy();
        }
    });

//Botones del tbar del grid proyeccion
    btnAdicionarProyeccion = new Ext.Button({
        id: 'btnAdicionarProyeccion',
        iconCls: 'adicionar',
        disabled: true,
        tooltip: perfil.etiquetas.lbAddProy,
        handler: function() {
            modificar = 0;
            adicionarProyeccionInterfaz('add');
        }
    });
    btnModificarProyeccion = new Ext.Button({
        id: 'btnModificarProyeccion',
        iconCls: 'modificar',
        disabled: true,
        tooltip: perfil.etiquetas.lbModProy,
        handler: function() {
            modificar = 1;
            adicionarProyeccionInterfaz('mod');
        }
    });
    btnEliminarProyeccion = new Ext.Button({
        id: 'btnEliminarProyeccion',
        iconCls: 'eliminar',
        disabled: true,
        tooltip: perfil.etiquetas.lbElimProy,
        handler: function() {
            eliminarProyeccion();
        }
    });

    // Combo de botones exportar
    menuImportar = new Ext.Toolbar.MenuButton({
        id: 'mnExportar',
        disabled: true,
        tooltip: {
            text: perfil.etiquetas.lbBtnExportar
        },
        iconCls: 'exportar',
        menu: {
            items: [{
                    id: 'btnResumen',
                    itemCls: 'x-menu-item icondistra-exportar',
                    iconCls: 'imagen-none',
                    disabled: true,
                    text: perfil.etiquetas.lbBtnResumen,
                    handler: function() {
                        exportar('resumen');
                    }
                }, {
                    id: 'btnDetalles',
                    itemCls: 'x-menu-item icondistra-exportar',
                    iconCls: 'imagen-none',
                    disabled: true,
                    text: perfil.etiquetas.lbBtnDetalles,
                    handler: function() {
                        exportar('detalles');
                    }
                }, {
                    id: 'btnGeneral',
                    itemCls: 'x-menu-item icondistra-exportar',
                    iconCls: 'imagen-none',
                    disabled: true,
                    text: perfil.etiquetas.lbBtnGeneral,
                    handler: function() {
                        exportar('general');
                    }
                }]
        }
    });

//Gridpanel de proyecciones
    gpProyeccion = new Ext.grid.EditorGridPanel(
            {
                frame: true,
                border: false,
                autoExpandColumn: 'expandir',
                title: perfil.etiquetas.lbProyecciones,
                store: stProyeccion,
                plugins: filtrosProyeccion,
                enableKeyEvents: true,
                cm: cmProyeccion,
                sm: smProyeccion,
                tbar: [btnAdicionarProyeccion, '-', btnModificarProyeccion, '-', btnEliminarProyeccion, '-', menuImportar],
                bbar: new Ext.PagingToolbar({
                    id: 'paginadoProy',
                    store: stProyeccion,
                    displayInfo: true,
                    items: ['-', btnLimpiarfilProy],
                    listeners: {
                        beforechange: function(p, e) {
                            offset = e.start;
                        }
                    }
                }),
                loadMask: {
                    msg: perfil.etiquetas.lbEspere
                },
                md: new Ext.menu.Menu({
                    id: 'menunproy',
                    items: [{
                            id: 'btnproyectar',
                            itemCls: 'x-menu-intem icondistra-adicionar',
                            iconCls: 'imagen-none',
                            text: perfil.etiquetas.lbProyectar,
                            handler: function() {
                                pgpProyeccionxejercicio.expand();
                            }
                        }]
                }),
                listeners: {
                    rowcontextmenu: function(g, r, e) {
                        e.stopEvent();
                        g.getSelectionModel().selectRow(r);
                        g.md.showAt(e.getXY());

                    }}
            });
    /******************Fin grid de proyecciones****************************/


    /******************Grid de proyecciones x ejercicio****************************/
//JsonReader del grid proyeccion x ejercicio
    jrstProyeccionxejercicio = new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'data'
            },
    [
        {
            name: 'numero'
        },
        {
            name: 'ejercicioproyectado'
        },
        {
            name: 'porciento'
        },
        {
            name: 'importeingreso'
        },
        {
            name: 'importegasto'
        },
        {
            name: 'idproyeccionporejercicio'
        },
        {
            name: 'idejercicio'
        },
        {
            name: 'orden'
        }
    ]
            );

//Store del grid proyeccion x ejercicio
    stProyeccionxejercicio = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarProyeccionporejercicio',
        listeners: {
            beforeload: function() {
                stProyeccionxejercicio.baseParams.idproyeccion = smProyeccion.getSelected().data.idproyeccion;
                stProyeccionxejercicio.baseParams.start = offsetE;
                cambiarTituloFiltrarProyeccionxEjercicio();
            },
            load: function(st, rec, obj) {
                if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 0)
                    btnEliminarProyeccionxejercicioTodos.show();
                else
                    btnEliminarProyeccionxejercicioTodos.hide();

                if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 1)
                    btnEliminarProyeccionxejercicio.show();
                else
                    btnEliminarProyeccionxejercicio.hide();

                if (gpProyeccionxejercicio.getStore().data.length > 0) {
                    if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 0)
                        btnEliminarProyeccionxejercicioTodos.enable();
                    pgpProyeccionxejercicio.expand();

                    Ext.getCmp('mnExportar').enable();
                    Ext.getCmp('btnResumen').enable();
                    Ext.getCmp('btnGeneral').enable();
                }
                else {
                    btnEliminarProyeccionxejercicioTodos.hide();
                    btnEliminarProyeccionxejercicio.hide();
                    pgpProyeccionxejercicio.collapse();
                    stProyeccionxejercicio.removeAll();
                    Ext.getCmp('mnExportar').disable();
                    Ext.getCmp('btnResumen').disable();
                    Ext.getCmp('btnGeneral').disable();
                }

                btnModificarProyeccionxejercicio.disable();
                if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 1)
                    btnEliminarProyeccionxejercicio.disable();
                else
                    btnEliminarProyeccionxejercicio.hide();
                pgpProyeccionxejercicio.setTitle(perfil.etiquetas.lbejercicios +
                        '<i>' + gpProyeccion.getSelectionModel().getSelected().data.denominacion +
                        perfil.etiquetas.lbal +
                        gpProyeccion.getSelectionModel().getSelected().data.porciento +
                        perfil.etiquetas.lbporciento + '</i>');
                Ext.getCmp('btnDetalles').disable();
            }
        },
        reader: jrstProyeccionxejercicio
    });

//Column model del grid proyeccion x ejercicio
    cmProyeccionxejercicio = new Ext.grid.ColumnModel(
            [
                {
                    header: perfil.etiquetas.lbNo,
                    id: 'expandir',
                    sortable: true,
                    width: 100,
                    dataIndex: 'numero',
                    tooltip: perfil.etiquetas.lbNo,
                    renderer: Creartip

                },
                {
                    header: perfil.etiquetas.lbEjerProyectado,
                    sortable: true,
                    align: 'center',
                    width: 150,
                    dataIndex: 'ejercicioproyectado',
                    tooltip: perfil.etiquetas.lbEjerProyectado,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbPorciento,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'porciento',
                    width: 100,
                    tooltip: perfil.etiquetas.lbPorciento,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbImporteIngreso,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'importeingreso',
                    width: 100,
                    tooltip: perfil.etiquetas.lbImporteIngreso,
                    renderer: Creartip
                },
                {
                    header: perfil.etiquetas.lbImporteGasto,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'importegasto',
                    width: 100,
                    tooltip: perfil.etiquetas.lbImporteGasto,
                    renderer: Creartip
                }
            ]
            );
    cmProyeccionxejercicio.defaultSortable = true;

//Selection model del grid proyeccion x ejercicio
    smProyeccionxejercicio = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        id: 'smProyeccionxejercicio'
    });
    smProyeccionxejercicio.on("rowselect", function(sm, rowIndex, record) {
        if (sm.getCount() == 1) {
            Ext.getCmp('btnDetalles').enable();
            btnModificarProyeccionxejercicio.enable();
        }
        else {
            btnModificarProyeccionxejercicio.disable();
            Ext.getCmp('btnDetalles').disable();
        }
        if (sm.getCount() > 0)
            if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 1)
                btnEliminarProyeccionxejercicio.enable();
            else
                btnEliminarProyeccionxejercicio.disable();
    });
    smProyeccionxejercicio.on("rowdeselect", function(sm, rowIndex, record) {
        if (sm.getCount() == 1) {
            btnModificarProyeccionxejercicio.enable();
            Ext.getCmp('btnDetalles').enable();
        }
        else {
            btnModificarProyeccionxejercicio.disable();
            Ext.getCmp('btnDetalles').disable();
        }
        if (sm.getCount() > 0)
            if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 1)
                btnEliminarProyeccionxejercicio.show();
            else
                btnEliminarProyeccionxejercicio.disable();
        else
            btnEliminarProyeccionxejercicio.disable();
    });

//Filtros del grid proyeccion x ejercicio
    filtrosProyeccionxejercicio = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'ejercicioproyectado',
                idcombo: 'idcmbejercicioproyectado',
                urlcb: 'listarEjercicios',
                idstore: 'idstejercicio',
                valueFieldcb: 'idejercicio',
                displayFieldcb: 'ejercicio'
            },
            {
                type: 'numeric',
                dataIndex: 'importeingreso'
            },
            {
                type: 'numeric',
                dataIndex: 'importegasto'
            }, {
                type: 'numeric',
                dataIndex: 'porciento'
            }
        ]
    });

//Boton para limpiar los filtros x ejercicio
    btnLimpiarfilProyXejerc = new Ext.Button({
        id: 'btnLimpiarfilProyXejerc',
        tooltip: perfil.etiquetas.lbLimpFilt,
        iconCls: 'limpiar',
        handler: function() {
            limpiarFiltrosProyXejerc();
        }
    });

//Botones del tbar del grid proyeccion x ejercicio
    btnAdicionarProyeccionxejercicio = new Ext.Button({
        id: 'btnAdicionarProyeccionxejercicio',
        iconCls: 'adicionar',
        disabled: true,
        tooltip: perfil.etiquetas.lbAddProyEjerc,
        handler: function() {
            adicionarProyeccionXejercicioInterfaz('add');
        }
    });
    btnModificarProyeccionxejercicio = new Ext.Button({
        id: 'btnModificarProyeccionxejercicio',
        iconCls: 'modificar',
        disabled: true,
        tooltip: perfil.etiquetas.lbModProyEjerc,
        handler: function() {
            adicionarProyeccionXejercicioInterfaz('mod');
        }
    });
    btnEliminarProyeccionxejercicio = new Ext.Button({
        id: 'btnEliminarProyeccionxejercicio',
        iconCls: 'eliminar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbElimProyEjerc,
        handler: function() {
            eliminarProyeccionXejercicio();
        }
    });
    btnEliminarProyeccionxejercicioTodos = new Ext.Button({
        id: 'btnEliminarProyeccionxejercicioTodos',
        iconCls: 'eliminar',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbElimProyEjercTodos,
        handler: function() {
            eliminarProyeccionXejercicioTodos();
        }
    });

//Gridpanel de proyecciones x ejercicio
    gpProyeccionxejercicio = new Ext.grid.EditorGridPanel(
            {
                frame: true,
                store: stProyeccionxejercicio,
                plugins: filtrosProyeccionxejercicio,
                enableKeyEvents: true,
                cm: cmProyeccionxejercicio,
                height: 200,
                border: false,
                sm: smProyeccionxejercicio,
                tbar: [btnAdicionarProyeccionxejercicio, '-', btnModificarProyeccionxejercicio, '-', btnEliminarProyeccionxejercicio, btnEliminarProyeccionxejercicioTodos],
                bbar: new Ext.PagingToolbar({
                    id: 'paginadoProyXejerc',
                    store: stProyeccionxejercicio,
                    displayInfo: true,
                    items: ['-', btnLimpiarfilProyXejerc],
                    listeners: {
                        beforechange: function(p, e) {
                            offsetE = e.start;
                        }
                    }
                }),
                loadMask: {
                    msg: perfil.etiquetas.lbEspere
                },
                listeners: {
                    click: function(n) {
                    }
                }
            });
    /******************Fin grid de proyecciones x ejercicio****************************/
//Panel de las proyecciones
    pgpProyeccionxejercicio = new Ext.Panel({
        title: perfil.etiquetas.lbejercicios,
        layout: 'fit',
        region: 'south',
        height: 300,
        split: true,
        collapsible: true,
        collapsed: true,
        items: [gpProyeccionxejercicio]
    });

//Panel de las proyecciones x ejercicio
    pgpProyeccion = new Ext.Panel({
        layout: 'fit',
        region: 'center',
        split: true,
        items: [gpProyeccion]
    });

//Panel de las proyecciones y proyecciones x ejercicio
    pderecha = new Ext.Panel({
        layout: 'border',
        region: 'center',
        items: [pgpProyeccion, pgpProyeccionxejercicio]
    });

// Viewport general
    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            items: [trEnt, pderecha]
        })

    });
}

//Titulo del grid proyeccion segun filtros
function cambiarTituloFiltrarProyeccion() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosProyeccion.getFiltrosActivos() == undefined
            || filtrosProyeccion.getFiltrosActivos().length == 0) {
        gpProyeccion.setTitle(perfil.etiquetas.lbProyecciones);
        esta_buscando = false;
    } else {
        esta_buscando = true;
        for (i = 0; i < filtrosProyeccion.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "descripcion") {
                aux = perfil.etiquetas.lbDescripcion;
            } else if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "fecha") {
                aux = perfil.etiquetas.lbFecha;
            } else if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "componente") {
                aux = perfil.etiquetas.lbComponente;
            } else if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "ejerciciobase") {
                aux = perfil.etiquetas.lbEjerBase;
            } else if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "planes") {
                aux = perfil.etiquetas.lbPlanes;
            } else if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "importeingreso") {
                aux = perfil.etiquetas.lbImporteIngreso;
            } else if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "importegasto") {
                aux = perfil.etiquetas.lbImporteGasto;
            } else if (filtrosProyeccion.getFiltrosActivos()[i].dataIndex == "tipo") {
                aux = perfil.etiquetas.lbTipo;
            }
            else {
                aux = '?';
            }
            if (i == filtrosProyeccion.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpProyeccion.setTitle(perfil.etiquetas.lbProyecciones + ' <i>-' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

//Titulo del grid proyeccion x ejercicio segun filtros
function cambiarTituloFiltrarProyeccionxEjercicio() {
    var filtrado_por_ejercicio = "";
    var sep_ejercicio = "/";
    if (filtrosProyeccionxejercicio.getFiltrosActivos() == undefined
            || filtrosProyeccionxejercicio.getFiltrosActivos().length == 0) {
        pgpProyeccionxejercicio.setTitle(perfil.etiquetas.lbejercicios);
        esta_buscando_ejercicio = false;
    } else {
        esta_buscando_ejercicio = true;
        for (i = 0; i < filtrosProyeccionxejercicio.getFiltrosActivos().length; i++) {
            var aux_ejercicio = "";
            if (filtrosProyeccionxejercicio.getFiltrosActivos()[i].dataIndex == "ejercicioproyectado") {
                aux_ejercicio = perfil.etiquetas.lbEjerProyectado;
            } else if (filtrosProyeccionxejercicio.getFiltrosActivos()[i].dataIndex == "importeingreso") {
                aux_ejercicio = perfil.etiquetas.lbImporteIngreso;
            } else if (filtrosProyeccionxejercicio.getFiltrosActivos()[i].dataIndex == "importegasto") {
                aux_ejercicio = perfil.etiquetas.lbImporteGasto;
            } else if (filtrosProyeccionxejercicio.getFiltrosActivos()[i].dataIndex == "porciento") {
                aux_ejercicio = perfil.etiquetas.lbPorciento;
            }
            else {
                aux_ejercicio = '?';
            }
            if (i == filtrosProyeccionxejercicio.getFiltrosActivos().length - 1) {
                sep_ejercicio = "";
            }
            filtrado_por_ejercicio += aux_ejercicio + sep_ejercicio;
        }
        pgpProyeccionxejercicio.setTitle(perfil.etiquetas.lbejercicios + '<i>- ' + perfil.etiquetas.lbFiltradoPor + filtrado_por_ejercicio + '</i>');
        filtrado_por_ejercicio = "";
    }
}

//Implementacion de render de las columnas
function nombreComponente(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNA + '"';
        return perfil.etiquetas.lbNA;
    }
    else if (val == 2) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbPlan + '"';
        return perfil.etiquetas.lbPlan;
    }
    if (val == 3) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbBM + '"';
        return perfil.etiquetas.lbBM;
    }
    return '?';
}

function nombreTipo(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbLineal + '"';
        return perfil.etiquetas.lbLineal;
    }
    else if (val == 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbProgresiva + '"';
        return perfil.etiquetas.lbProgresiva;
    }
    return '?';
}

function Creartip(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return val;
}

//Funcionalidad adicionar proyeccion
function adicionarProyeccionInterfaz(add) {
    //Text de la denominacion
    textDenominacion = {
        xtype: 'textfield',
        fieldLabel: perfil.etiquetas.lbDenominacion,
        id: 'denominacion',
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓ./ÚñÑ//-]* ?[a-zA-Z0-9áéíóúÁÉÍÓ./ÚñÑ//-]*[a-zA-Z0-9áéíóúÁÉÍÓ./ÚñÑ//-]* ?[a-zA-Z0-9áéíóúÁÉÍÓ./ÚñÑ//-])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓ./ÚñÑ//-])$/,
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: perfil.etiquetas.lbTamMax,
        allowBlank: false};

    //Combo de los componentes
    stComponentes = [
        [1, perfil.etiquetas.lbNA],
        [2, perfil.etiquetas.lbPlan],
        [3, perfil.etiquetas.lbBM]];

    cmbComponentes = new Ext.form.ComboBox({
        id: 'cmbComponentes',
        store: stComponentes,
        typeAhead: true,
        fieldLabel: perfil.etiquetas.lbComponente,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        editable: true,
        anchor: '95%',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        selectOnFocus: true,
        listeners: {
            select: function(combo, record, index) {
                CmbPlanes.clearValue();
                CmbPlanes.disable();
                if (cbEjercicioBase.getValue() != null && cbEjercicioBase.getValue() != '' && cbEjercicioBase.getValue() != "")
                    stCmbPlanes.reload();
            }
        }
    });

    //Combo del ejercicio base
    stEjercicioBase = new Ext.data.Store({
        url: 'listarEjercicios',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }])
    });

    cbEjercicioBase = new Ext.form.ComboBox({
        id: 'cbEjercicioBase',
        store: stEjercicioBase,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        fieldLabel: perfil.etiquetas.lbEjerBase,
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
            select: function(combo, record, index) {
                CmbPlanes.clearValue();
                CmbPlanes.disable();
                if (cmbComponentes.getValue() != null && cmbComponentes.getValue() != '' && cmbComponentes.getValue() != "")
                    stCmbPlanes.reload();
            }
        }

    });

    //Combo de planes
    stCmbPlanes = new Ext.data.Store({
        url: 'listarComboModelos',
        listeners: {
            beforeload: function(st, opt) {
                this.baseParams = {
                    componente: cmbComponentes.getValue(),
                    identidad: identidadselected,
                    idejercicio: cbEjercicioBase.getValue()
                };
            },
            load: function() {
                CmbPlanes.enable();
                if (modificar == 1) {
                    Ext.Ajax.request({
                        url: 'obtenerIds',
                        params: {
                            denominaciones: gpProyeccion.getSelectionModel().getSelected().data.planes
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.getCmp('CmbPlanes').setValue(responseData);
                        }
                    });
                }
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

    CmbPlanes = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        anchor: '95%',
        fieldLabel: 'Plan',
        store: stCmbPlanes,
        valueField: 'idmodelo',
        displayField: 'denominacion',
        id: 'CmbPlanes',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        selectOnFocus: false
    }
    );

    //Check progresiva
    chProgresiva = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: perfil.etiquetas.lbProgresiva,
        id: 'chProgresiva',
        checked: false,
        name: 'chProgresiva',
        height: 40,
        listeners: {
            check: function(ch, checked) {
                if (checked) {
                    Ext.getCmp('porcientoEntreAnnos').enable();
                }
                else {
                    Ext.getCmp('porcientoEntreAnnos').disable();
                    Ext.getCmp('porcientoEntreAnnos').setValue(100);

                }
            }
        }
    });

    //Porciento entre annos
    porcientoEntreAnnos = {
        xtype: 'numberfield',
        id: 'porcientoEntreAnnos',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 2,
        allowBlank: false,
        value: '100',
        disabled: true,
        width: 110,
        enableKeyEvents: true,
        editable: false,
        fieldLabel: perfil.etiquetas.lbPorciento
    };

    //Text de la descripcion
    textDescripcion = {
        xtype: 'textarea',
        id: 'descripcion',
        anchor: '100%',
        maxLength: 255,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
        regexText: perfil.etiquetas.lbMsgSoloALfaguion,
        maxLengthText: perfil.etiquetas.lbTamMaxDesc,
        fieldLabel: perfil.etiquetas.lbDescripcion,
        editable: false,
        allowBlank: true
    };

    //Formulario para seleccionar datos a adicionar
    fsAddProyeccion = new Ext.form.FieldSet({
        bodyStyle: 'padding:5px 0px 5px 5px',
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: .50,
                        border: false,
                        layout: 'form',
                        items: [cmbComponentes, {bodyStyle: 'paddingTop: 10px;', border: false}, cbEjercicioBase, {bodyStyle: 'paddingTop: 10px;', border: false},
                            {
                                layout: 'column',
                                border: false,
                                items: [
                                    {
                                        columnWidth: .33,
                                        border: false,
                                        layout: 'form',
                                        items: [chProgresiva]
                                    },
                                    {
                                        columnWidth: .67,
                                        border: false,
                                        layout: 'form',
                                        items: [porcientoEntreAnnos]
                                    }
                                ]
                            }]
                    },
                    {
                        columnWidth: .50,
                        border: false,
                        layout: 'form',
                        items: [textDenominacion, {bodyStyle: 'paddingTop: 10px;', border: false}, CmbPlanes]
                    }
                ]
            }, textDescripcion
        ]
    });

    fpfsAddProyeccion = new Ext.FormPanel({
        id: 'fpfsAddProyeccion',
        frame: false,
        layout: 'fit',
        border: false,
        rezisable: false,
        items: [fsAddProyeccion]
    });

    //Ventana para crear la proyeccion    
    if (add == 'mod') {
        winAddProyPlanif = new Ext.Window({
            id: 'winAddProyPlanif',
            title: perfil.etiquetas.lbModProy,
            constrain: true,
            width: 685,
            height: 280,
            draggable: true,
            resizable: false,
            modal: true,
            layout: 'fit',
            closeAction: 'destroy',
            items: [fpfsAddProyeccion],
            buttons: [
                {
                    iconCls: 'cancelar',
                    id: 'idcancel',
                    text: perfil.etiquetas.lbBtnCancelar,
                    tooltip: perfil.etiquetas.lbTtBtnCancelarC,
                    handler: function() {
                        winAddProyPlanif.destroy();
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'idaceptar',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbTTBtnAceptarC,
                    handler: function() {
                        adicionarProyeccionLogica('acp', add);
                    }
                }
            ]
        });
    }
    else {
        winAddProyPlanif = new Ext.Window({
            id: 'winAddProyPlanif',
            title: perfil.etiquetas.lbAddProy,
            constrain: true,
            width: 685,
            height: 280,
            draggable: true,
            resizable: false,
            modal: true,
            layout: 'fit',
            closeAction: 'destroy',
            items: [fpfsAddProyeccion],
            buttons: [
                {
                    iconCls: 'cancelar',
                    id: 'idcancel',
                    text: perfil.etiquetas.lbBtnCancelar,
                    tooltip: perfil.etiquetas.lbTtBtnCancelarC,
                    handler: function() {
                        winAddProyPlanif.destroy();
                    }
                }, {
                    iconCls: 'aplicar',
                    id: 'idaplicar',
                    text: perfil.etiquetas.lbBtnAplicar,
                    tooltip: perfil.etiquetas.lbTtBtnAplicarC,
                    handler: function() {
                        adicionarProyeccionLogica('apl', add);
                        fpfsAddProyeccion.getForm().reset();

                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'idaceptar',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbTTBtnAceptarC,
                    handler: function() {
                        adicionarProyeccionLogica('acp', add);
                    }
                }
            ]
        });
    }

    if (add == 'mod') {
        Ext.getCmp('denominacion').setValue(gpProyeccion.getSelectionModel().getSelected().data.denominacion);
        Ext.getCmp('descripcion').setValue(gpProyeccion.getSelectionModel().getSelected().data.descripcion);
        Ext.getCmp('cmbComponentes').setValue(gpProyeccion.getSelectionModel().getSelected().data.componente);
        stEjercicioBase.load({
            callback: function(options, success, response) {
                Ext.getCmp('cbEjercicioBase').setValue(gpProyeccion.getSelectionModel().getSelected().data.idejercicio);
                stCmbPlanes.reload();
            }
        });
        if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 1)
            Ext.getCmp('chProgresiva').checked = false;
        else {
            Ext.getCmp('chProgresiva').checked = true;
            Ext.getCmp('porcientoEntreAnnos').enable();
        }
        Ext.getCmp('chProgresiva').disable();
        Ext.getCmp('porcientoEntreAnnos').setValue(gpProyeccion.getSelectionModel().getSelected().data.porciento);
    }
    else
        stEjercicioBase.reload();
    winAddProyPlanif.show();
}

function adicionarProyeccionLogica(apl, add) {
    if (add == 'mod')
        idproyeccion = smProyeccion.getSelected().data.idproyeccion;
    else
        idproyeccion = null;
    if (CmbPlanes.getCheckedValue() != '' && CmbPlanes.getCheckedValue() != null && CmbPlanes.getCheckedValue() != undefined) {
        planes = CmbPlanes.getCheckedValue();
    }
    else {
        planesAux = stCmbPlanes.data.keys;
        planes = planesAux.toString();
    }
    if (Ext.getCmp('chProgresiva').getValue() == true)
        tipo = 0;
    else
        tipo = 1;

    if (planes != null && planes != '') {
        Ext.Ajax.request({
            url: 'adicionarProyeccion',
            params: {
                componente: cmbComponentes.getValue(),
                identidad: identidadselected,
                idejercicio: cbEjercicioBase.getValue(),
                denominacion: Ext.getCmp('denominacion').getValue(),
                descripcion: Ext.getCmp('descripcion').getValue(),
                planes: planes,
                idproyeccion: idproyeccion,
                tipo: tipo,
                porciento: Ext.getCmp('porcientoEntreAnnos').getValue()
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgP == 1) {
                    if (apl != 'apl')
                        winAddProyPlanif.destroy();
                    if (responseData.mensaje == 'mod')
                        mostrarMensaje(1, perfil.etiquetas.lbModPoyok);
                    if (responseData.mensaje == 'add')
                        mostrarMensaje(1, perfil.etiquetas.lbAddPoyok);
                }
                gpProyeccion.getStore().reload();
            }
        });
    }
    else
        mostrarMensaje(1, perfil.etiquetas.lbNoPlanif);
}

//Funcionalidad adicionar proyeccion x ejercicio
function adicionarProyeccionXejercicioInterfaz(add) {

    //Combo del ejercicio base
    stEjercicioBaseXejercicio = new Ext.data.Store({
        url: 'listarEjercicios',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }])
    });
    cbEjercicioBaseXejercicio = new Ext.form.ComboBox({
        id: 'cbEjercicioBaseXejercicio',
        store: stEjercicioBaseXejercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        fieldLabel: perfil.etiquetas.lbEjer,
        mode: 'local',
        editable: true,
        width: 110,
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione
    });

    //Porciento entre annos
    porcientoXejercicio = {
        xtype: 'numberfield',
        id: 'porcientoXejercicio',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 2,
        allowBlank: false,
        value: '100',
        width: 110,
        enableKeyEvents: true,
        editable: false,
        fieldLabel: perfil.etiquetas.lbPorciento
    };

    //Formulario para seleccionar datos a adicionar    
    if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 1) {
        var altura = 170;
        fsAddProyeccionXejercicio = new Ext.form.FieldSet({
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            border: false,
                            layout: 'form',
                            items: [
                                cbEjercicioBaseXejercicio, {bodyStyle: 'paddingTop: 10px;', border: false},
                                porcientoXejercicio]
                        }
                    ]
                }
            ]
        });
    }
    else {
        var altura = 130;
        fsAddProyeccionXejercicio = new Ext.form.FieldSet({
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            border: false,
                            layout: 'form',
                            items: [cbEjercicioBaseXejercicio, {bodyStyle: 'paddingTop: 10px;', border: false}]
                        }
                    ]
                }
            ]
        });
    }

    fpfsAddProyeccionXejercicio = new Ext.FormPanel({
        id: 'fpfsAddProyeccionXejercicio',
        frame: false,
        layout: 'fit',
        border: false,
        rezisable: false,
        items: [fsAddProyeccionXejercicio]
    });

    //Ventana para crear la proyeccion x ejercicio
    if (add == 'mod') {
        winAddProyPlanifXejercicio = new Ext.Window({
            id: 'winAddProyPlanifXejercicio',
            title: perfil.etiquetas.lbModProyEjerc,
            constrain: true,
            width: 280,
            height: altura,
            draggable: true,
            resizable: false,
            modal: true,
            layout: 'fit',
            closeAction: 'destroy',
            items: [fpfsAddProyeccionXejercicio],
            buttons: [
                {
                    iconCls: 'cancelar',
                    id: 'idcancel',
                    text: perfil.etiquetas.lbBtnCancelar,
                    tooltip: perfil.etiquetas.lbTtBtnCancelarC,
                    handler: function() {
                        winAddProyPlanifXejercicio.destroy();
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'idaceptar',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbTTBtnAceptarC,
                    handler: function() {
                        adicionarProyeccionLogicaXejercicio('acp', add);
                    }
                }
            ]
        });
    }
    else {
        winAddProyPlanifXejercicio = new Ext.Window({
            id: 'winAddProyPlanifXejercicio',
            title: perfil.etiquetas.lbAddProyEjerc,
            constrain: true,
            width: 280,
            height: altura,
            draggable: true,
            resizable: false,
            modal: true,
            layout: 'fit',
            closeAction: 'destroy',
            items: [fpfsAddProyeccionXejercicio],
            buttons: [
                {
                    iconCls: 'cancelar',
                    id: 'idcancel',
                    text: perfil.etiquetas.lbBtnCancelar,
                    tooltip: perfil.etiquetas.lbTtBtnCancelarC,
                    handler: function() {
                        winAddProyPlanifXejercicio.destroy();
                    }
                }, {
                    iconCls: 'aplicar',
                    id: 'idaplicar',
                    text: perfil.etiquetas.lbBtnAplicar,
                    tooltip: perfil.etiquetas.lbTtBtnAplicarC,
                    handler: function() {
                        adicionarProyeccionLogicaXejercicio('apl', add);
                        fpfsAddProyeccionXejercicio.getForm().reset();
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'idaceptar',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbTTBtnAceptarC,
                    handler: function() {
                        adicionarProyeccionLogicaXejercicio('acp', add);
                    }
                }
            ]
        });
    }

    if (add == 'mod') {
        stEjercicioBaseXejercicio.load({
            callback: function(options, success, response) {
                Ext.getCmp('cbEjercicioBaseXejercicio').setValue(gpProyeccionxejercicio.getSelectionModel().getSelected().data.idejercicio);
            }
        });
        if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 1)
            Ext.getCmp('porcientoXejercicio').setValue(gpProyeccionxejercicio.getSelectionModel().getSelected().data.porciento);
    }
    else
        stEjercicioBaseXejercicio.reload();
    winAddProyPlanifXejercicio.show();
}

function adicionarProyeccionLogicaXejercicio(apl, add) {
    if (add == 'mod')
        idproyeccionxejercicio = smProyeccionxejercicio.getSelected().data.idproyeccionporejercicio;
    else
        idproyeccionxejercicio = null;

    if (gpProyeccion.getSelectionModel().getSelected().data.tipo == 1)
        var porciento = Ext.getCmp('porcientoXejercicio').getValue();
    else
        var porciento = gpProyeccion.getSelectionModel().getSelected().data.porciento;

    Ext.Ajax.request({
        url: 'adicionarProyeccionxejercicio',
        params: {
            idejercicio: Ext.getCmp('cbEjercicioBaseXejercicio').getValue(),
            idproyeccionxejercicio: idproyeccionxejercicio,
            idproyeccion: smProyeccion.getSelected().data.idproyeccion,
            porciento: porciento,
            tipo: smProyeccion.getSelected().data.tipo,
            importegasto: smProyeccion.getSelected().data.importegasto,
            importeingreso: smProyeccion.getSelected().data.importeingreso
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgP == 1) {
                if (apl != 'apl')
                    winAddProyPlanifXejercicio.destroy();
                if (responseData.mensaje == 'mod')
                    mostrarMensaje(1, perfil.etiquetas.lbModPoyEjercok);
                if (responseData.mensaje == 'add')
                    mostrarMensaje(1, perfil.etiquetas.lbAddPoyEjercok);
                gpProyeccionxejercicio.getStore().reload();
            }
            else if (responseData.codMsgP == 3) {
                if (responseData.mensaje == 'mod')
                    mostrarMensaje(1, perfil.etiquetas.lbModPoynoEjerc);
                if (responseData.mensaje == 'add')
                    mostrarMensaje(1, perfil.etiquetas.lbAddPoynoEjerc);
            }
        }
    });
}

//Funcionalidad limpiar filtros de la proyeccion
function limpiarFiltrosProy() {
    if (gpProyeccion.getStore().getCount() >= 0) {
        filtrosProyeccion.clearFilters();
    } else {
        Ext.MessageBox.show({
            title: perfil.etiquetas.lbInformacion,
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.lbNoDatList,
            icon: Ext.MessageBox.INFO
        });
    }
}

//Funcionalidad limpiar filtros de la proyeccion x ejercicio
function limpiarFiltrosProyXejerc() {
    if (gpProyeccionxejercicio.getStore().getCount() >= 0) {
        filtrosProyeccionxejercicio.clearFilters();
    } else {
        Ext.MessageBox.show({
            title: perfil.etiquetas.lbInformacion,
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.lbNoDatList,
            icon: Ext.MessageBox.INFO
        });
    }
}

//Funcionalidad eliminar proyeccion
function eliminarProyeccion() {
    idproyecciones = "";
    selecciones = smProyeccion.getSelections();
    for (var i = 0; i < selecciones.length; i++) {
        if (i != 0)
            idproyecciones += ',' + selecciones[i].data.idproyeccion;
        else
            idproyecciones += selecciones[i].data.idproyeccion;
    }
    Ext.Ajax.request({
        url: 'eliminarProyeccion',
        params: {
            idproyeccion: idproyecciones
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgP == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbElimPoyok);
            }
            gpProyeccion.getStore().reload();
        }
    });
}

//Funcionalidad eliminar proyeccion x ejercicio
function eliminarProyeccionXejercicio() {
    idproyeccionesxejercicio = "";
    seleccionesxejercicio = smProyeccionxejercicio.getSelections();
    for (var i = 0; i < seleccionesxejercicio.length; i++) {
        if (i != 0)
            idproyeccionesxejercicio += ',' + seleccionesxejercicio[i].data.idproyeccionporejercicio;
        else
            idproyeccionesxejercicio += seleccionesxejercicio[i].data.idproyeccionporejercicio;
    }

    Ext.Ajax.request({
        url: 'eliminarProyeccionxejercicio',
        params: {
            idproyeccionporejercicio: idproyeccionesxejercicio
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgP == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbElimPoyEjercok);
            }
            gpProyeccionxejercicio.getStore().reload();
        }
    });
}

//Funcionalidad eliminar todas las proyecciones x ejercicio
function eliminarProyeccionXejercicioTodos() {
    Ext.Ajax.request({
        url: 'eliminarProyeccionxejercicioTodos',
        params: {
            idproyeccion: smProyeccion.getSelected().data.idproyeccion
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgP == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbElimPoyEjerTodcok);
            }
            gpProyeccionxejercicio.getStore().reload();
        }
    });
}

//Funcionalidad eliminar todas las proyecciones x ejercicio
function eliminarProyeccionXejercicioTodos() {
    Ext.Ajax.request({
        url: 'eliminarProyeccionxejercicioTodos',
        params: {
            idproyeccion: smProyeccion.getSelected().data.idproyeccion
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgP == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbElimPoyEjerTodcok);
            }
            gpProyeccionxejercicio.getStore().reload();
        }
    });
}

//Funcionalidad para exportar
function exportar(tipo) {
    Ext.Ajax.timeout = 600000;
    if (smProyeccionxejercicio.getCount() == 1)
        var porc = smProyeccionxejercicio.getSelected().data.porciento;
    else
        var porc = 100;
    var win = window.open('exportar?&tipo=' + tipo +
            '&idproyeccion=' + smProyeccion.getSelected().data.idproyeccion +
            '&componente=' + smProyeccion.getSelected().data.componente +
            '&planes=' + smProyeccion.getSelected().data.planes +
            '&entidad=' + identidadselected +
            '&porciento=' + porc +
            '&ejerciciobase=' + smProyeccion.getSelected().data.ejerciciobase +
            '&idejerciciobase=' + smProyeccion.getSelected().data.idejercicio +
            '&tipoProy=' + smProyeccion.getSelected().data.tipo +
            '&importegasto=' + smProyeccion.getSelected().data.importegasto +
            '&importeingreso=' + smProyeccion.getSelected().data.importeingreso);
}