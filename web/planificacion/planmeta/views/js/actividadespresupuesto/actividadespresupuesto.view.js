//Namespace del componente Actividades asociadas a presupuesto
Ext.ns('Planificacion.Presupuesto.Actividad')

//Vista del componente Actividades asociadas a presupuesto
Planificacion.Presupuesto.Actividad.Vista = {
    /*Componente que inicializa la vista
     *@param: idioma Objeto que contiene el idioma de la aplicacion (type:Object)
     *@param: modelo Objeto que contiene los modelos para cargar los datos(type:Planificacion.Presupuesto.Actividad.Modelo)
     */

    identidadselected: null,
    iplanselected: null,
    flagobj: 0,
    modelo: null,
    init: function (idioma, modelo) {
        this.modelo = modelo;

        //Tree para mostrar las entidades
        this.treeentidades = new Ext.tree.TreePanel(
                {
                    title: 'Entidades',
                    region: 'west',
                    autoScroll: true,
                    collapseFirst: true,
                    width: 250,
                    collapsible: true,
                    rootVisible: false,
                    tbar: [
                        {
                            iconCls: 'icon-expand-all',
                            tooltip: 'Expandir',
                            icon: perfil.dirImg + 'expand-all.gif',
                            handler: function () {
                                Planificacion.Presupuesto.Actividad.Vista.treeentidades.root.expand(true);
                            }
                        }, {
                            iconCls: 'icon-collapse-all',
                            tooltip: 'Colapsar',
                            icon: perfil.dirImg + 'collapse-all.gif',
                            handler: function () {
                                Planificacion.Presupuesto.Actividad.Vista.treeentidades.root.collapse(true);
                            }
                        }, {
                            iconCls: 'icon-collapse-all',
                            tooltip: 'Refrescar todas las entidades',
                            icon: perfil.dirImg + 'table_refresh.png',
                            handler: function () {
                                Planificacion.Presupuesto.Actividad.Vista.treeentidades.root.reload();
                            }
                        }, '-',
                        {
                            xtype: 'textfield',
                            emptyText: 'Filtrar entidad...',
                            width: 110,
                            id: 'idfiltroent',
                            listeners: {
                                specialkey: function (t, e) {
                                    if (e.getKey() == '13') {
                                        buscarNodoTreeX(Planificacion.Presupuesto.Actividad.Vista.treeentidades, Planificacion.Presupuesto.Actividad.Vista.identidadselected, 'idfiltroent');
                                    }
                                }
                            }
                        }],
                    root: {
                        text: 'Estructuras',
                        expanded: true,
                        id: '0'
                    },
                    loader: modelo.listadoEntidades
                });

        //Tree para mostrar las entidades
        this.treeplanes = new Ext.tree.TreePanel(
                {
                    title: 'Planes',
                    region: 'west',
                    collapseFirst: true,
                    autoScroll: true,
                    width: 250,
                    disabled: true,
                    collapsible: true,
                    tbar: [{
                            iconCls: 'icon-expand-all',
                            tooltip: 'Expandir',
                            icon: perfil.dirImg + 'expand-all.gif',
                            handler: function () {
                                Planificacion.Presupuesto.Actividad.Vista.treeplanes.root.expand(true);
                            }
                        }, {
                            iconCls: 'icon-collapse-all',
                            tooltip: 'Colapsar',
                            icon: perfil.dirImg + 'collapse-all.gif',
                            handler: function () {
                                Planificacion.Presupuesto.Actividad.Vista.treeplanes.root.collapse(true);
                            }
                        }, {
                            iconCls: 'icon-collapse-all',
                            tooltip: 'Refrescar todos los planes',
                            icon: perfil.dirImg + 'table_refresh.png',
                            handler: function () {
                                Planificacion.Presupuesto.Actividad.Vista.treeplanes.root.reload();
                            }
                        }, '-',
                        {
                            xtype: 'textfield',
                            emptyText: 'Filtrar plan...',
                            width: 110,
                            id: 'idfiltroplan',
                            listeners: {
                                specialkey: function (t, e) {
                                    if (e.getKey() == '13') {
                                        buscarNodoTreeX(Planificacion.Presupuesto.Actividad.Vista.treeplanes, Planificacion.Presupuesto.Actividad.Vista.iplanselected, 'idfiltroplan');
                                    }
                                }
                            }
                        }],
                    root: {
                        text: 'Planes',
                        id: '0'
                    },
                    loader: modelo.listadoPlanes
                });

        //menu del grid de actividades para asociar objeto de gasto
        this.mnAsociarGasto = new Ext.menu.Item({
            // icon: perfil.dirImg + 'asociar.png',
            id: 'asociargasto',
            iconCls: 'asociar',
            text: 'Asociar objeto de gasto'
        })

        //menu del grid de actividades para asociar recurso financiero
        this.mnAsociarFinaciero = new Ext.menu.Item({
            //  icon: perfil.dirImg + 'asociar.png',
            id: 'asociarrecurso',
            iconCls: 'asociar',
            text: 'Asociar recurso financiero'
        })

        //menu del grid de actividades para desasociar objeto de gasto
        this.mnDesasociar = new Ext.menu.Item({
            // icon: perfil.dirImg + 'deshacer.png',
            id: 'desasociar',
            iconCls: 'deshacer',
            text: 'Desasociar'
        })

        //Pluging del filtro del grid de actividades
        this.filtroactividades = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'listado',
                    dataIndex: 'idespecialidad',
                    idcombo: 'idcbespecialidad',
                    urlcb: 'listarEspecialidades',
                    idstore: 'idstespecialidad',
                    valueFieldcb: 'idespecialidad',
                    displayFieldcb: 'denespecialidad'
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'numeric',
                    dataIndex: 'importe'
                }, {
                    type: 'list',
                    dataIndex: 'asociado',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'og_rf',
                    options: ['OG', 'RF']
                }, {
                    type: 'string',
                    dataIndex: 'datos'
                }]
        });

        this.btnLimpiarFiltros = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarFiltros',
            // icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'limpiar',
            tooltip: "Limpiar filtro(s)(Alt+L)"
                    //            text:'Limpiar'
        });

        this.nfImporteTotal = new Ext.form.TextField({
            xtype: 'numberfield',
            id: 'nfImporte',
            anchor: '95%',
            align: 'right',
            disabled: false,
            maskRe: /^([.,]+ ?[.,]*)+$/,
            regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
            enableKeyEvents: false,
            emptyText: '0.000'
        });

        //Grid para mostrar las actividades
        this.gridActividades = new Ext.grid.GridPanel({
            title: 'Actividades',
            disabled: true,
            autoExpandColumn: 'denominacion',
            store: modelo.listadoActividades,
            region: 'center',
            plugins: this.filtroactividades,
            md: new Ext.menu.Menu({
                items: [this.mnAsociarGasto, this.mnAsociarFinaciero, this.mnDesasociar]
            }),
            loadMask: {
                store: modelo.listadoActividades
            },
            columns: [{
                    header: 'Codigo', //idioma.codigo,  
                    width: 80,
                    dataIndex: 'codigo',
                    tooltip: 'Codigo de la actividad',
                    renderer: function (v, m) {
                        return getQtip(v, m);
                    }
                }, {
                    header: 'Especialidad', //idioma.denominacion,  
                    width: 100,
                    dataIndex: 'idespecialidad',
                    tooltip: 'Especialidad',
                    renderer: function (v, m) {
                        return getQtip(getRawValue(v, Ext.getCmp('idcbespecialidad')), m);
                    }
                }, {
                    header: 'Denominación', //idioma.denominacion,  
                    width: 150,
                    dataIndex: 'denominacion',
                    id: 'denominacion',
                    tooltip: 'Denominación de la actividad',
                    renderer: function (v, m) {
                        return getQtip(v, m);
                    }
                }, {
                    header: 'Importe', //idioma.denominacion,  
                    width: 80,
                    dataIndex: 'importe',
                    tooltip: 'Importe'
                }, {
                    header: 'Asociado', //idioma.denominacion,  
                    width: 80,
                    dataIndex: 'asociado',
                    renderer: function (a, b, c) {
                        if (c.data.idplanificacionnaegeneral == null) {
                            return '<center>NO</center>'
                        } else {
                            return '<center>SI</center>'
                        }
                    }
                }, {
                    header: 'OG-RF', //idioma.denominacion,  
                    width: 80,
                    dataIndex: 'og_rf',
                    renderer: function (a, b, c) {
                        if (c.data.idobjetogasto != null) {
                            return '<center>OG</center>'
                        } else if (c.data.idingreso != null) {
                            return '<center>RF</center>'
                        } else {
                            return '<center>-</center>'
                        }
                    }
                }, {
                    header: 'Datos', //idioma.denominacion,  
                    width: 80,
                    dataIndex: 'datos',
                    renderer: function (v, m) {
                        return getQtip(v, m);
                    }
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.listadoActividades,
                displayInfo: true,
                items: ['-', this.btnLimpiarFiltros, '-', {
                        xtype: 'tbtext',
                        text: '<b>Importe total</b>'
                    }, this.nfImporteTotal]
            })
        })

        //Pluging del filtro del grid de Niveles de actividad economicos
        this.filtroNAE = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'codigo'
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }]
        });

        //Grid para mostrar los Niveles de actividad economicos
        this.gridNAE = new Ext.grid.GridPanel({
            title: 'Nivel de actividad económica',
            autoExpandColumn: 'nae',
            store: modelo.listadoNAE,
            height: 400,
            width: 500,
            plugins: this.filtroNAE,
            region: 'west',
            loadMask: {
                store: modelo.listadoNAE
            },
            columns: [new Ext.grid.CheckboxSelectionModel(), {
                    header: 'Codigo', //idioma.codigo,  
                    width: 80,
                    dataIndex: 'codigo'
                }, {
                    header: 'NAE', //idioma.denominacion,  
                    width: 100,
                    dataIndex: 'denominacion',
                    id: 'nae'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.listadoNAE,
                displayInfo: true
            })
        })

        //Pluging del filtro del grid de los Objetos de gastos
        this.filtroOG = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }]
        });

        //Grid para mostrar los Objetos de gastos
        this.gridObjetoGasto = new Ext.grid.GridPanel({
            title: 'Objeto de gasto',
            autoExpandColumn: 'denominacion',
            store: modelo.listadoObjetoGasto,
            plugins: this.filtroOG,
            loadMask: {
                store: modelo.listadoObjetoGasto
            },
            columns: [new Ext.grid.CheckboxSelectionModel({
                    singleSelect: true
                }), {
                    header: 'Código', //idioma.codigo,  
                    width: 80,
                    dataIndex: 'codigo'
                }, {
                    header: 'Denominación', //idioma.denominacion,  
                    width: 100,
                    dataIndex: 'denominacion',
                    id: 'denominacion'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.listadoObjetoGasto,
                displayInfo: true
            })
        })

        //Pluging del filtro del grid de los recursos financieros
        this.filtroRF = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }]
        });

        //Grid para mostrar los recursos financieros
        this.gridRecursoFinanciero = new Ext.grid.GridPanel({
            title: 'Recursos financieros',
            autoExpandColumn: 'denominacion',
            store: modelo.listadoRecursoFinanciero,
            plugins: this.filtroRF,
            loadMask: {
                store: modelo.listadoRecursoFinanciero
            },
            columns: [new Ext.grid.CheckboxSelectionModel({
                    singleSelect: true
                }), {
                    header: 'Código',
                    width: 80,
                    dataIndex: 'codigo'
                }, {
                    header: 'Denominación',
                    width: 100,
                    dataIndex: 'denominacion',
                    id: 'denominacion'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.listadoRecursoFinanciero,
                displayInfo: true
            })
        })

        //Panel para integrar el tree de planes y el grid de actividades
        this.panelCentral = new Ext.Panel({
            region: 'center',
            border: false,
            layout: 'border',
            items: [this.treeplanes, this.gridActividades]
        })

        //boton cancelar de la ventana
        this.btnCancelar = new Ext.Button({
            //  icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar'
        })

        //boton aceptar de la ventana
        this.btnAceptar = new Ext.Button({
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            id: 'btnaceptar',
            text: 'Aceptar'
        })

        //Panel contenedor de [gridObjetoGasto,gridRecursoFinanciero]
        this.panel = new Ext.Panel({
            layout: 'card',
            region: 'center',
            border: false,
            activeItem: 0,
            items: [{
                    border: false,
                    id: 'panelGpObjeto',
                    layout: 'fit',
                    items: this.gridObjetoGasto
                }, {
                    border: false,
                    id: 'panelGpRecurso',
                    layout: 'fit',
                    items: this.gridRecursoFinanciero
                }]
        })

        //Ventana para asociar las actividades a objetos de gastos
        this.ventana = new Ext.Window({
            title: 'Asociar a objeto de gasto',
            closeAction: 'hide',
            constrain: true,
            height: 400,
            width: 950,
            layout: 'border',
            items: [this.gridNAE, this.panel],
            buttons: [this.btnCancelar, this.btnAceptar]
        });

        //ViewPort para mostrar los elementos
        this.view = new Ext.Viewport({
            layout: 'border',
            items: [this.treeentidades, this.panelCentral]
        })
    }

};

//Inicializando la vista.
//variable que guarda los datos del perfil
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = {};
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('actividadespresupuesto', function (idioma) {
    //Escogiendo la configuraciÃƒÆ’Ã‚Â³n del idioma segÃƒÆ’Ã‚Âºn la versiÃƒÆ’Ã‚Â³n del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Planificacion.Presupuesto.Actividad.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Planificacion.Presupuesto.Actividad.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Planificacion.Presupuesto.Actividad.Controlador.init(idioma, vista, modelo);
});