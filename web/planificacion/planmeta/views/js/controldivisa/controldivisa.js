var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controldivisa', cargarInterfaz);
var is_leaf, identidadselect, controldivisateclas;
var idarbol, anode;
var rector = 0;
Ext.QuickTips.init();
function cargarInterfaz() {
    myMask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });


    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ii',
            alt: true,
            fn: function () {
                //adicionar 
                if (Ext.getCmp('ventanaCrud') == undefined) {
                    ObjCtrlDiv.CrearVentanaCrudControlDivisa('Adicionar', null)
                }
            }
        }, {
            key: 'Mm',
            alt: true,
            fn: function () {
                //modificar 
                if (Ext.getCmp('ventanaCrud') == undefined) {
                    ObjCtrlDiv.CrearVentanaCrudControlDivisa('Modificar', smGpIndControlDivisa.getSelected().data.idcontroldivisa);
                }
            }
        }

    ]);


    controldivisateclas = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 46,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btEliminar').disabled) {
                    Ext.getCmp('btEliminar').handler.call(this);
                }
            }
        },
        {
            key: 'Tt',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnActivar').disabled) {
                    Ext.getCmp('btnActivar').handler.call(this);
                }
            }
        },
        {
            key: 'Ff',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnDesactivar').disabled) {
                    Ext.getCmp('btnDesactivar').handler.call(this);
                }
            }
        },
        {
            key: 'Qq',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnAprobar').disabled) {
                    Ext.getCmp('btnAprobar').handler.call(this);
                }
            }
        },
        {
            key: 'Ww',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnDesaprobar').disabled) {
                    Ext.getCmp('btnDesaprobar').handler.call(this);
                }
            }
        }

        ,
        {
            key: 'Hh',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnAyuda').disabled) {
                    Ext.getCmp('btnAyuda').handler.call(this);
                }
            }
        },
        {
            key: 'Ll',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function () {
                filtrosIndPlanificacion.clearFilters();

            }

        },
        {
            key: 'Ll',
            alt: true,
            ctrl: true,
            scope: this,
            stopEvent: true,
            fn: function () {
                filtrosIndControlDivisa.clearFilters();
            }}
    ]);
    controldivisateclas.enable();

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        stCbejercicio.reload();
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'rector') {
                rector = 1;
            }
        }

       /* if (rector == 1)
         {
         btnAsociar.hide();
         btnDesasociar.hide();
         } else
         {
         btnmenuactivacion.hide();
         btnEliminar.hide();
         btnModificar.hide();
         btnAdicionar.hide();
         btnmenuaprobacion.hide();
         }*/
    })

    //********Combo Niveles Indicadores********
    stNivelesCorrind = new Ext.data.SimpleStore({
        fields: ['idnivel', 'denominacion'],
        data: [[1, 'Genérico'], [2, 'Subgérico'], [3, 'Específico'], [4, 'Surtido']],
        listeners: {
            load: function (t, n, e) {
                //Ext.getCmp('cbNivelesCorrind').setValue(t.data.items[0].data.idnivel);
            }
        }
    });

    cbNivelesCorrind = new Ext.form.ComboBox({
        id: 'cbNivelesCorrind',
        loadingText: 'Cargando...',
        store: stNivelesCorrind,
        valueField: 'idnivel',
        width: 140,
        displayField: 'denominacion',
        emptyText: 'Niveles...',
        anchor: '100%',
        mode: 'local',
        listWidth: 250,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function () {
                stGpIndPlanificacion.baseParams.nivelfiltrar = cbNivelesCorrind.getValue();
                stGpIndPlanificacion.baseParams.idejercicio = cbEjercicio.getValue();
                stGpIndPlanificacion.baseParams.rector = rector;
                stGpIndPlanificacion.baseParams.start = 0;
                stGpIndPlanificacion.baseParams.limit = cbPaginadoPlanif.getValue();
                stGpIndPlanificacion.load();
            }
        }
    });

    stCbejercicio = new Ext.data.Store({
        url: ' ../gestplanes/getEjercicios',
        timeout: 7200000,
        listeners: {
            load: function (t, n, e) {

                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);

                gpIndPlanificacion.getStore().reload({
                    params: {
                        idejercicio: cbEjercicio.getValue(),
                        start: 0,
                        limit: 20
                    }
                });

            }, beforeload: function () {
                Ext.Ajax.timeout = 600000; //10min
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [
            {
                name: 'idejercicio'
            },
            {
                name: 'ejercicio'
            },
            {
                name: 'estado'
            }
        ])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        tpl: '<tpl for="."><div ext:qtip="{ejercicio}" class="x-combo-list-item">{ejercicio}</div></tpl>',
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                gpIndPlanificacion.getStore().reload({
                    params: {
                        idejercicio: cbEjercicio.getValue(),
                        start: 0,
                        limit: 20
                    }
                });
            }
        }
    });


    btnLimpiarPI = new Ext.Button({
        // text: '<u>L</u>impiar',
        tooltip: 'Limpiar filtro(s) (<b>Alt+L</b>) ',
        id: 'btnLimpiarPI',
        iconCls: 'limpiar',
        // icon: perfil.dirImg + 'limpiar.png',
        handler: function () {
            filtrosIndPlanificacion.clearFilters();
        }
    });
    btnLimpiarPC = new Ext.Button({
        // text: '<u>L</u>impiar',
        tooltip: 'Limpiar filtro(s) (<b>Ctrl+Alt+L</b>) ',
        id: 'btnLimpiarPC',
        iconCls: 'limpiar',
        //icon: perfil.dirImg + 'limpiar.png',
        handler: function () {
            filtrosIndControlDivisa.clearFilters();
        }
    });
    filtrosIndControlDivisa = new Ext.grid.GridFilters({
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
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'boolean',
                dataIndex: 'estado'
            }]
    });

    ObjCtrlDiv = new PlanifMaterial.CtrlDiv.crudControlDivisa();

    //grid de Indicadores de Control de Divisa
    cmGpIndControlDivisa = new Ext.grid.ColumnModel([{
            header: 'Código',
            dataIndex: 'codigo',
            tooltip: 'Código',
            sortable: true,
            width: 100
        }, {
            id: 'expandir',
            header: 'Denominación',
            sortable: true,
            dataIndex: 'denominacion',
            tooltip: 'Denominación'
        }, {
            id: 'estadoid',
            header: 'Activo',
            sortable: true,
            dataIndex: 'estado',
            tooltip: 'Activo',
            renderer: renderactivacion

        }]);
    stGpIndControlDivisa = new Ext.data.Store({
        timeout: 7200000,
        url: 'listarIndicadoresControlDivisa',
        listeners: {
            beforeload: function () {
                Ext.Ajax.timeout = 600000; //10min           
                stGpIndControlDivisa.baseParams.rector = rector;
                stGpIndControlDivisa.baseParams.idejercicio = Ext.getCmp('cbEjercicio').getValue();
            },
            load: function () {
                if (stGpIndControlDivisa.getCount() == 0) {
                    if (filtrosIndControlDivisa.getFiltrosActivos() == undefined || filtrosIndControlDivisa.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');

                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                    Ext.getCmp('btnModificar').disable();
                    Ext.getCmp('btEliminar').disable();
                    Ext.getCmp('menuactiv').disable();
                }
                if (smGpIndPlanificacion.getSelections().length == 1)
                {
                    var pinto = false;
                    for (var i = 0; i < stGpIndControlDivisa.getCount(); i++) {
                        for (var k = 0; k < smGpIndPlanificacion.getSelected().data.DatControldivisaindicadormodelo.length; k++) {
                            if (smGpIndPlanificacion.getSelected().data.DatControldivisaindicadormodelo[k].idcontroldivisa == stGpIndControlDivisa.getAt(i).data.idcontroldivisa
                                    && smGpIndPlanificacion.getSelected().data.DatControldivisaindicadormodelo[k].idejercicio == Ext.getCmp('cbEjercicio').getValue()) {
                                pinto = true;
                                Ext.get(gpIndControlDivisa.getView().getRow(i)).addClass('superior');

                            } else {
                                Ext.get(gpIndControlDivisa.getView().getRow(i)).removeClass('superior');
                            }
                        }
                    }
                    if (pinto == false) {
                        smGpIndControlDivisa.clearSelections();
                    }
                } else {
                    if (smGpIndPlanificacion.getSelections().length > 1) {
                        var primerCodigo = smGpIndPlanificacion.getSelections()[0].data.DatControldivisaindicadormodelo;
                        var pinto = true;
                        for (var c = 1; c < smGpIndPlanificacion.getCount(); c++) {
                            if (smGpIndPlanificacion.getSelections()[c].data.DatControldivisaindicadormodelo.length == primerCodigo.length) {
                                for (var k = 0; k < smGpIndPlanificacion.getSelections()[c].data.DatControldivisaindicadormodelo.length; k++) {
                                    if (smGpIndPlanificacion.getSelections()[c].data.DatControldivisaindicadormodelo[k].idcontroldivisa != primerCodigo[k].idcontroldivisa)
                                    {
                                        pinto = false;
                                    }
                                }
                            } else
                            {
                                pinto = false;
                            }
                        }
                        if (pinto) {
                            for (var i = 0; i < stGpIndControlDivisa.getCount(); i++) {
                                for (var k = 0; k < smGpIndPlanificacion.getSelections()[0].data.DatControldivisaindicadormodelo.length; k++) {
                                    if (smGpIndPlanificacion.getSelections()[0].data.DatControldivisaindicadormodelo[k].idcontroldivisa == stGpIndControlDivisa.getAt(i).data.idcontroldivisa) {
                                        for (var j = 0; j < 3; j++) {
                                            Ext.get(gpIndControlDivisa.getView().getCell(i, j))
                                                    .applyStyles('background-color:#FFCCCC');
                                        }
                                    }
                                }
                            }
                        } else {
                            smGpIndControlDivisa.clearSelections();
                        }
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idcontroldivisa'
        }, [{
                name: 'idcontroldivisa'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'estado'
            }, {
                name: 'idejercicio'
            }])
    });

    stGpIndControlDivisa.reload({params: {
            start: 0,
            limit: 20
        }});

    // Selection Model grid
    smGpIndControlDivisa = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (_this, row_index, record) {
                stGpIndDestino.reload();
                panelDerecho.expand(true);
                if (smGpIndPlanificacion.getSelections().length != 0) {

                    if (smGpIndPlanificacion.getSelected().data.asociado == 'Si')
                    {
                        btnDesasociar.enable();
                    }
                    btnAsociar.enable();
                }
                if (smGpIndControlDivisa.getSelections().length == 0)
                {
                    btnModificar.disable();
                    btnEliminar.disable();
                } else if (smGpIndControlDivisa.getSelections().length > 1)
                {
                    btnEliminar.enable();
                    btnModificar.disable();
                } else
                {
                    btnEliminar.enable();
                    btnModificar.enable();
                }
                var primero = smGpIndControlDivisa.getSelected().data.estado;
                if (primero == 1)
                {
                    Ext.getCmp('btnActivar').disable();
                    Ext.getCmp('btnDesactivar').enable();
                } else
                {
                    Ext.getCmp('btnDesactivar').disable();
                    Ext.getCmp('btnActivar').enable();
                }



            },
            rowdeselect: function (_this, row_index, record) {
                stGpIndDestino.reload();
                if (smGpIndControlDivisa.getSelections().length == 0)
                {
                    btnModificar.disable();
                    btnEliminar.disable();
                    Ext.getCmp('btnActivar').disable();
                    Ext.getCmp('btnDesactivar').disable();
                } else if (smGpIndControlDivisa.getSelections().length > 1)
                {
                    btnEliminar.enable();
                    btnModificar.disable();
                } else
                {
                    btnEliminar.enable();
                    btnModificar.enable();
                }
            }

        }
    });

    stCbIndControlDivisa = new Ext.data.SimpleStore({
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

    cbIndControlDivisa = new Ext.form.ComboBox({
        value: 20,
        store: stCbIndControlDivisa,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 55,
        emptyText: 'Seleccionar',
        listeners: {
            select: function (cb, record, index) {
                Ext.getCmp('pgtIndControlDivisa').pageSize = cbIndControlDivisa.getValue();
                stGpIndControlDivisa.reload({
                    params: {
                        start: 0,
                        limit: cbIndControlDivisa.getValue()
                    }
                });
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    /**
     * menu del click derecho del grid
     */
    mnIndControlDivisa = new Ext.menu.Menu({
        id: 'mnIndControlDivisa',
        //disabled: true,
        listeners: {},
        items: [{
            text: 'Eliminar',
            iconCls: 'eliminar',
            id: 'mdDelIndControlDivisa',
            tooltip: 'Eliminar indicador',
            handler: function () {

            }
        },{
            text: 'Activar',
            iconCls: 'habilitar',
            id: 'mdActIndControlDivisa',
            tooltip: 'Activar Indicador',
            handler: function () {

            }
        },{
            text: 'Desactivar',
            iconCls: 'deshabilitar',
            id: 'mdDesactIndControlDivisa',
            tooltip: 'Desactivar Indicador',
            handler: function () {

            }
        }]
    });

    // Grid gestion
    gpIndControlDivisa = new Ext.grid.GridPanel({
        store: stGpIndControlDivisa,
        plugins: filtrosIndControlDivisa,
        autoExpandColumn: 'expandir',
        sm: smGpIndControlDivisa,
        cm: cmGpIndControlDivisa,
        md:mnIndControlDivisa,
        frame: true,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            id: "pgtIndControlDivisa",
            //pageSize: cbIndControlDivisa.getValue(),
            store: stGpIndControlDivisa,
            displayInfo: true,
            items: [btnLimpiarPC/*'-', cbIndControlDivisa, '->'*/]
        }),
        listeners: {
            rowdblclick: function (_this, row_index, record) {
            },
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());

            }
        }
    });

    filtrosDestino = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    smGpIndDestino = new Ext.grid.RowSelectionModel({
        singleSelect: true

    });
    cmGpIndDestino = new Ext.grid.ColumnModel([{
            id: 'expandir',
            header: 'Denominación',
            sortable: true,
            dataIndex: 'denominacion',
            tooltip: 'Denominación',
            renderer: crearToolTip
        }]);

    stGpIndDestino = new Ext.data.Store({
        url: 'listarDestinoControlDivisa',
        listeners: {
            beforeload: function () {
                Ext.Ajax.timeout = 600000; //10min  
                var id;
                if (smGpIndControlDivisa.getSelections().length == 1)
                {
                    id = smGpIndControlDivisa.getSelected().data.idcontroldivisa;
                }
                stGpIndDestino.baseParams.idcontroldivisa = id;
                stGpIndDestino.baseParams.rector = rector;
                var selections = smGpIndPlanificacion.getSelections();
                if (selections.length > 0)
                {
                    ids = [];
                    for (var i = 0; i < selections.length; i++) {
                        ids.push(selections[i].id);
                    }
                    stGpIndDestino.baseParams.idindicador = Ext.encode(ids);
                } else {
                    stGpIndDestino.baseParams.idindicador = null;

                }
                stGpIndDestino.baseParams.idejercicio = cbEjercicio.getValue();
            },
            load: function () {
                for (var i = 0; i < stGpIndDestino.getCount(); i++) {
                    if (stGpIndDestino.getAt(i).data.pintar == 1) {
                        for (var j = 0; j < 1; j++) {
                            Ext.get(gpIndDestino.getView().getCell(i, j))
                                    .applyStyles('background-color:#FFCCCC');
                        }
                    }
                }
                if (stGpIndDestino.getCount() == 0) {

                    if (filtrosDestino.getFiltrosActivos() == undefined || filtrosDestino.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');

                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'ReadIndDestino'}, [{
                name: 'denominacion'
            }, {
                name: 'identidadmodelo'
            }, {
                name: 'pintar'
            }])
    });

    //grid de Indicadores de la Planificación
    gpIndDestino = new Ext.grid.GridPanel({
        store: stGpIndDestino,
        plugins: filtrosDestino,
        autoExpandColumn: 'expandir',
        sm: smGpIndDestino,
        cm: cmGpIndDestino,
        frame: true,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpIndDestino,
            displayInfo: false
        })
    });
    //botones
    smGpIndPlanificacion = new Ext.grid.RowSelectionModel({
        listeners: {
            rowselect: function (_this, row_index, record) {

                stGpIndControlDivisa.reload({
                    params: {
                        start: 0,
                        limit: cbIndControlDivisa.getValue()
                    }
                });
                var seleccionesGpplanif = smGpIndPlanificacion.getSelections();
                if (seleccionesGpplanif.length == 1) {
                    if (smGpIndControlDivisa.getSelections().length != 0) {
                        btnAsociar.enable();

                    }
                    if (smGpIndPlanificacion.getSelected().data.asociado == 'Si')
                    {
                        if (smGpIndControlDivisa.getSelections().length != 0)
                            btnDesasociar.enable();
                        if (smGpIndPlanificacion.getSelected().data.aprobadoasociacion == 1) {
                            Ext.getCmp('btnAprobar').enable();
                            Ext.getCmp('btnDesaprobar').disable();
                        } else {
                            Ext.getCmp('btnDesaprobar').enable();
                            Ext.getCmp('btnAprobar').disable();
                        }

                    } else {
                        Ext.getCmp('btnAprobar').disable();
                        Ext.getCmp('btnDesaprobar').disable();
                        btnDesasociar.disable();
                    }
                } else if (seleccionesGpplanif.length > 1) {
                    if (smGpIndControlDivisa.getSelections().length != 0)
                        btnAsociar.enable();
                    var primeroAsociado = seleccionesGpplanif[0].data.asociado;
                    var primeroAprob = seleccionesGpplanif[0].data.aprobadoasociacion;
                    var primerodestino = seleccionesGpplanif[0].data.destino;
                    if (primeroAsociado == 'Si')
                    {
                        btnDesasociar.enable();
                        if (primeroAprob == 1) {
                            Ext.getCmp('btnAprobar').enable();
                            Ext.getCmp('btnDesaprobar').disable();
                        } else {
                            Ext.getCmp('btnDesaprobar').enable();
                            Ext.getCmp('btnAprobar').disable();
                        }

                    } else {
                        Ext.getCmp('btnAprobar').disable();
                        Ext.getCmp('btnDesaprobar').disable();
                        btnDesasociar.disable();

                    }
                    for (var i = 1; i < seleccionesGpplanif.length; i++)
                    {
                        if (seleccionesGpplanif[i].data.asociado != primeroAsociado)
                        {
                            btnAsociar.disable();
                            btnDesasociar.disable();
                        }
                        if (seleccionesGpplanif[i].data.aprobadoasociacion != primeroAprob)
                        {
                            Ext.getCmp('btnAprobar').disable();
                            Ext.getCmp('btnDesaprobar').disable();
                        }
                    }
                }
            },
            rowdeselect: function (_this, row_index, record) {


                stGpIndControlDivisa.reload({
                    params: {
                        start: 0,
                        limit: cbIndControlDivisa.getValue()
                    }
                });
                var seleccionesGpplanif = smGpIndPlanificacion.getSelections();
                if (seleccionesGpplanif.length == 0) {
                    Ext.getCmp('btnAprobar').disable();
                    Ext.getCmp('btnDesaprobar').disable();
                    btnAsociar.disable();
                    btnDesasociar.disable();

                }
            }
        }
    });
    stGpIndPlanificacion = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarIndicadores',
        listeners: {
            beforeload: function () {
                Ext.Ajax.timeout = 600000; //10min   
                stGpIndPlanificacion.baseParams.idejercicio = cbEjercicio.getValue();
                stGpIndPlanificacion.baseParams.idarbol = (gpIndPlanificacion.getSelectionModel().hasSelection()) ? gpIndPlanificacion.getSelectionModel().getSelected().data.idarbol : idarbol;
                stGpIndPlanificacion.baseParams.anode = (gpIndPlanificacion.getSelectionModel().hasSelection()) ? gpIndPlanificacion.getSelectionModel().getSelected().data.idindicador : anode;
                idarbol = null;
                anode = null;
                stGpIndPlanificacion.baseParams.ordender = (gpIndPlanificacion.getSelectionModel().hasSelection()) ? gpIndPlanificacion.getSelectionModel().getSelected().data.ordender : null;
                stGpIndPlanificacion.baseParams.ordenizq = (gpIndPlanificacion.getSelectionModel().hasSelection()) ? gpIndPlanificacion.getSelectionModel().getSelected().data.ordenizq : null;
                stGpIndPlanificacion.baseParams.rector = rector;
            },
            load: function () {
                if (stGpIndPlanificacion.getCount() == 0) {
                    stGpIndPlanificacion.removeAll();
                    if (filtrosIndPlanificacion.getFiltrosActivos() == undefined || filtrosIndPlanificacion.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');

                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }

                stGpIndControlDivisa.reload({
                    params: {
                        idejercicio: cbEjercicio.getValue(),
                        start: 0,
                        limit: cbIndControlDivisa.getValue()
                    }
                });
                stGpIndDestino.load({
                    params: {
                        idejercicio: cbEjercicio.getValue(),
                        start: 0,
                        limit: 20
                    }
                });

                myMask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, // campos a tener en cuenta en la carga de
        // indicadores
                [{
                        name: 'idindicador'
                    }, {
                        name: 'codigo'
                    }, {
                        name: 'numeropieza'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'descripcion'
                    }, {
                        name: 'idumedida'
                    }, {
                        name: 'precio'
                    }, {
                        name: 'preciodivisa'
                    }, {
                        name: 'estado'
                    }, {
                        name: 'idaprobacion'
                    }, {
                        name: 'nivelplanif'
                    }, {
                        name: 'idpais'
                    }, {
                        name: 'nivel'
                    }, {
                        name: 'idarbol'
                    }, {
                        name: 'idpadre'
                    }, {
                        name: 'flete'
                    }, {
                        name: 'idformato'
                    }, {
                        name: 'contingencia'
                    }, {
                        name: 'idnaturaleza'
                    }, {
                        name: 'naturaleza'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: '_parent'
                    }, {
                        name: 'idcentrobalance'
                    }, {
                        name: 'ordenizq'
                    }, {
                        name: 'ordender'
                    }, {
                        name: 'orgabasteccentral'
                    }, {
                        name: 'sustimp'
                    }, {
                        name: 'denomviaadquisicion'
                    }, {
                        name: 'denomorgansatisface'
                    }, {
                        name: 'DatIndicadorviaadquisicion'
                    }, {
                        name: 'DatControldivisaindicadormodelo'
                    }, {
                        name: 'DatIndicadorviaadquisicionorganosatisface'
                    }, {
                        name: 'impdirecta'
                    }, {
                        name: 'denocentrobalance'
                    }, {
                        name: 'denoum'
                    }, {
                        name: 'denompais'
                    }, {
                        name: 'data'
                    }, {
                        name: 'idmodelo'
                    }, {
                        name: 'denmodelo'
                    }, {
                        name: 'asociado'
                    }, {
                        name: 'codigocd'
                    }, {
                        name: 'denominacioncd'
                    }, {
                        name: 'destino'
                    }, {
                        name: 'aprobadoasociacion'
                    },
                    {
                        name: 'idplanificado'
                    },
                    {
                        name: 'centrobalance'
                    },
                    {
                        name: 'idejercicio'
                    }])
    });
    // Configuracion de columnas del gris de indicadores
    cmGpIndPlanificacion = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            id: 'columncodigo',
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            tooltip: 'Codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNopieza,
            width: 110,
            sortable: true,
            dataIndex: 'numeropieza',
            tooltip: perfil.etiquetas.lbNopieza,
            renderer: renderNopieza
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            tooltip: 'Denominacion',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: perfil.etiquetas.lbNivel,
            width: 60,
            sortable: true,
            dataIndex: 'nivel',
            tooltip: 'Nivel',
            renderer: modificarNivel
        }, {
            header: perfil.etiquetas.lbAsociado,
            width: 80,
            sortable: true,
            dataIndex: 'asociado',
            hidden: false,
            tooltip: 'Asociado'
        }, {
            header: "Aprobado",
            dataIndex: 'aprobadoasociacion',
            width: 90,
            sortable: true,
            renderer: renderaprobacionanteproyecto
        }, {
            header: "Planificado",
            dataIndex: 'idplanificado',
            id: 'planificado',
            width: 90,
            sortable: true,
            renderer: renderaplanificadoanteproyecto
        }, {
            header: 'CB',
            width: 60,
            sortable: true,
            dataIndex: 'centrobalance',
            tooltip: 'Centro Balance'

        }]);


    filtrosIndPlanificacion = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'list',
                dataIndex: 'nivel',
                options: [{
                        idnivelarbol: 1,
                        nivelarbol: 'Generico'
                    },
                    {
                        idnivelarbol: 2,
                        nivelarbol: 'Subgenerico'
                    },
                    {
                        idnivelarbol: 3,
                        nivelarbol: 'Especifico'
                    },
                    {
                        idnivelarbol: 4,
                        nivelarbol: 'Surtido'
                    }],
                id: 'idnivelarbol',
                labelField: 'nivelarbol'
            }, {
                type: 'boolean',
                dataIndex: 'asociado'
            }, {
                type: 'boolean',
                dataIndex: 'aprobadoasociacion'
            }
            , {
                type: 'boolean',
                dataIndex: 'idplanificado'
            }, {
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'filtrocb',
                urlcb: 'listarCentroBalance',
                idstore: 'idstcentrobalancenorma',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance'
            }]
    });

    btnAsociar = new Ext.Button({
        text: 'Asociar',
        tooltip: 'Adicionar(Alt + K)',
        id: 'btnAsociar',
        // icon: perfil.dirImg + 'asociar.png',
        iconCls: 'asociar',
        disabled: true,
        handler: function () {
            Asociar(true, cbEjercicio.getValue());

        }
    });
    btnDesasociar = new Ext.Button({
        text: 'Desasociar',
        tooltip: 'Adicionar (Alt + U)',
        id: 'btnDesasociar',
        disabled: true,
        iconCls: 'deshacer',
        //icon: perfil.dirImg + 'deshacer.png',
        handler: function () {
            Asociar(false, cbEjercicio.getValue());
        }
    });
    btnLimpiar = new Ext.Button({
        // text: 'Limpiar',
        tooltip: 'Limpiar filtro(s) ',
        id: 'btnLimpiar',
        iconCls: 'limpiar',
        //icon: perfil.dirImg + 'limpiar.png',
        handler: function () {
        }
    });
    btnmenuaprobacion = new Ext.Toolbar.MenuButton({
        id: 'menuaprob',
        // text: perfil.etiquetas.textBtnMenuAprobacion,
        tooltip: perfil.etiquetas.ttBtnMenuAprobacion,
        // icon: perfil.dirImg + 'area.png',
        iconCls: 'area',
        menu: {
            items: [
                {
                    id: 'btnAprobar',
                    itemCls: 'x-menu-item icondistra-aprobar',
                    iconCls: 'imagen-none',
                    //icon: perfil.dirImg + 'aprobar.png',
                    //iconCls: 'btn',
                    tooltip: perfil.etiquetas.ttBtnAprobar,
                    text: perfil.etiquetas.textBtnAprobar,
                    disabled: true,
                    handler: function () {
                        mostrarMensaje(2, '¿Está seguro que quiere aprobar el(los) indicador(es) de la planificación seleccionado(s)?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                Aprobar(true, cbEjercicio.getValue());
                            }
                        });
                    }
                },
                {
                    id: 'btnDesaprobar',
                    itemCls: 'x-menu-item icondistra-desaprobar',
                    iconCls: 'imagen-none',
                    // icon: perfil.dirImg + 'desaprobar.png',
                    // iconCls: 'btn',
                    tooltip: perfil.etiquetas.ttBtnDesaprobar,
                    text: perfil.etiquetas.textBtnDesaprobar,
                    disabled: true,
                    handler: function () {
                        mostrarMensaje(2, '¿Está seguro que quiere desaprobar el(los) indicador(es) de la planificación seleccionado(s)?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                Aprobar(false, cbEjercicio.getValue());
                            }
                        });

                    }
                }
            ]
        }
    });

    stCbPaginadoPlanif = new Ext.data.SimpleStore({
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

    cbPaginadoPlanif = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginadoPlanif,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 55,
        emptyText: 'Seleccionar',
        listeners: {
            select: function (cb, record, index) {
                Ext.getCmp('pgTreeGrid').pageSize = cbPaginadoPlanif.getValue();
                stGpIndPlanificacion.reload({
                    params: {
                        start: 0,
                        limit: cbPaginadoPlanif.getValue()
                    }
                });
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });


    /**
     * menu del click derecho del grid
     */
    menuCorrelIndicadores = new Ext.menu.Menu({
        id: 'menuCorrelIndicadores',
        //disabled: true,
        listeners: {},
        items: [{
            text: 'Aprobar',
            iconCls: 'aprobar',
            id: 'mdAprobarDocIndicador',
            tooltip: 'Aprobar documento',
            handler: function () {

            }
        },{
            text: 'Desaprobar',
            iconCls: 'desaprobar',
            id: 'mdDesaprobarDocIndicador',
            tooltip: 'Desaprobar documento',
            handler: function () {

            }
        }]
    });

    gpIndPlanificacion = new Ext.ux.maximgb.treegrid.GridPanel({
        title: perfil.etiquetas.lbSinFiltradoTitle,
        store: stGpIndPlanificacion,
        master_column_id: 'columncodigo',
        tbar: [btnAsociar, btnDesasociar, btnmenuaprobacion],
        sm: smGpIndPlanificacion,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        region: 'center',
        root_title: perfil.etiquetas.lbGpRootTitle,
        autoExpandColumn: 'expandir',
        stripeRows: true,
        cm: cmGpIndPlanificacion,
        md:menuCorrelIndicadores,
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            //pageSize: cbPaginadoPlanif.getValue(),
            store: stGpIndPlanificacion,
            displayInfo: true,
            id: 'pgTreeGrid',
            items: [btnLimpiarPI/*'-', cbPaginadoPlanif, '->'*/]
        }),
        plugins: filtrosIndPlanificacion,
        listeners: {
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());

            }
        }
    });

    myMask.show();

    btnLimpiarPD = new Ext.Button({
        //text: 'Limpiar',
        tooltip: 'Limpiar filtro(s) ',
        id: 'btnLimpiarPD',
        iconCls: 'limpiar',
        // icon: perfil.dirImg + 'limpiar.png',
        handler: function () {
            filtrosDestino.clearFilters();
        }
    });
    btnAyuda = new Ext.Button({
        // text: 'Ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>',
        id: 'btnAyudacon',
        iconCls: 'ayuda'
        // icon: perfil.dirImg + 'ayuda.png',
//        handler: function(opcion) {
//            mostrarAyuda('Configurar Control de divisa');
//        }
    });

    btnExportarCorre = new Ext.Button({
        tooltip: 'Exportar correlacionador <b>(Alt+E)</b>',
        id: 'btnExportarCorre',
        iconCls: 'exportar',
        handler: function () {
            exportarCorrelacionadores(smGpIndPlanificacion);
        }
    });

    btnPrueba = new Ext.Button({
        // text: 'Prueba',
        tooltip: 'Probando el panelito',
        id: 'btnPrueba',
        iconCls: 'ayuda',
        //icon: perfil.dirImg + 'ayuda.png',
        handler: function () {
        }
    });
    btnPrueba1 = new Ext.Button({
        // text: 'Prueba1',
        tooltip: 'Probando el panelito',
        id: 'btnPrueba1',
        iconCls: 'ayuda',
        //icon: perfil.dirImg + 'ayuda.png',
        handler: function () {
        }
    });

    //****************** filtros Indicador Control de Divisa ******************************
    contador_filter = 0;
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    //****************** filtros Indicador de la Planificación ******************************
    contador_filter = 0;
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';


    panelIzquierdo = new Ext.Panel({
        id: 'panelIzquierdo',
        region: 'center',
        collapsible: false,
        collapsed: false,
        titleCollapse: true,
        split: true,
        width: 500,
        height: 260,
        layout: 'fit',
        //bbar: [btnLimpiarPI],
        items: [gpIndPlanificacion]
    });

    btnAdicionar = new Ext.Button({
        //text: 'Ad<u>i</u>cionar',
        tooltip: 'Adicionar indicador <b>(Alt+I)</b>',
        id: 'btnAdicionarr',
        // icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        disabled: false,
        handler: function () {
            ObjCtrlDiv.CrearVentanaCrudControlDivisa('Adicionar', null)
        }
    });
    btnModificar = new Ext.Button({
        //  text: '<u>M</u>odificar',
        tooltip: 'Modificar indicador <b>(Alt+M)</b>',
        id: 'btnModificar',
        disabled: true,
        iconCls: 'modificar',
        //icon: perfil.dirImg + 'modificar.png',
        handler: function () {
            ObjCtrlDiv.CrearVentanaCrudControlDivisa('Modificar', smGpIndControlDivisa.getSelected().data.idcontroldivisa);
        }
    });
    btnEliminar = new Ext.Button({
        // text: 'Eliminar',
        tooltip: 'Eliminar indicador <b>(DEL)</b>',
        id: 'btEliminar',
        disabled: true,
        iconCls: 'eliminar',
        // icon: perfil.dirImg + 'eliminar.png',
        handler: function () {
            eliminarControlDivisa();
        }
    });



    btnmenuactivacion = new Ext.Toolbar.MenuButton({
        id: 'menuactiv',
        // text: perfil.etiquetas.textBtnMenuActivacion,
        tooltip: 'Activar o Desactivar indicador',
        //icon: perfil.dirImg + 'activardepbanco.png',
        iconCls: 'activardepbanco',
        menu: {
            items: [
                {
                    id: 'btnActivar',
                    itemCls: 'x-menu-item icondistra-habilitar',
                    iconCls: 'imagen-none',
                    // icon: perfil.dirImg + 'habilitar.png',
                    //  iconCls: 'btn',
                    tooltip: 'Activar  (Alt+T)',
                    text: perfil.etiquetas.textBtnActivar,
                    disabled: true,
                    handler: function () {
                        mostrarMensaje(2, 'Está seguro que quiere activar el indicador de control de divisa seleccionado.', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                ActivarDesactivar(true);
                            }
                        });
                    }
                },
                {
                    id: 'btnDesactivar',
                    itemCls: 'x-menu-item icondistra-deshabilitar',
                    iconCls: 'imagen-none',
                    //  icon: perfil.dirImg + 'deshabilitar.png',
                    // iconCls: 'btn',
                    tooltip: 'Desactivar (Alt+F)',
                    text: perfil.etiquetas.textBtnDesactivar,
                    disabled: true,
                    handler: function () {
                        mostrarMensaje(2, 'Está seguro que quiere desactivar el indicador de control de divisa seleccionado.', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                ActivarDesactivar(false);
                            }
                        });
                    }}
            ]
        }
    });




    panelCentral = new Ext.Panel({
        title: 'Indicadores de Control de Divisa',
        id: 'panelCentral',
        region: 'center',
        split: true,
        width: 300,
        height: 250,
        layout: 'fit',
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnmenuactivacion],
        //bbar: ['->', btnLimpiarPC],
        items: [gpIndControlDivisa]
    });

    panelDerecho = new Ext.Panel({
        title: 'Conceptos del Plan',
        id: 'panelDerecho',
        region: 'east',
        collapsible: true,
        collapsed: true,
        split: true,
        width: 270,
        height: 250,
        layout: 'fit',
        //bbar: ['->', btnLimpiarPD],
        items: [gpIndDestino],
        listeners: {
            collapse: function (n, b) {
            },
            expand: function (n, b) {

            }
        }
    });

    panelIncluyeDerIzq = new Ext.Panel({
        id: 'panelIncluyeDerIzq',
        region: 'east',
        collapsible: true,
        collapsed: false,
        titleCollapse: true,
        split: true,
        width: 590,
        height: 500,
        layout: 'border',
        items: [panelCentral, panelDerecho]
    });

    panelIncluyeCentro_Derecho = new Ext.Panel({
        title: 'Correlacionador',
        id: 'panelIncluyeCentro_Derecho',
        region: 'center',
        titleCollapse: true,
        split: true,
        width: 600,
        height: 400,
        layout: 'border',
        items: [panelIzquierdo, panelIncluyeDerIzq]
    });

    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            tbar: ['Ejercicio: ', cbEjercicio, '-', cbNivelesCorrind, '-', btnExportarCorre, '->', btnAyuda],
            items: [panelIncluyeCentro_Derecho]
        })
    });


    function renderNopieza(value, m) {
        if (value == "" || value == null) {
            m.attr = 'ext:qtip="-"';
            return '-';
        } else {
            m.attr = 'ext:qtip="' + value + '"';
            return value;
        }
    }

    function ActivarDesactivar(value) {
        var accion = "";
        var estadoActivar;
        if (value) {
            estadoActivar = 1;
            accion = "activado";
        } else {
            estadoActivar = 0;
            accion = "desactivado";
        }

        Ext.Ajax.request({
            url: 'activarDesactivarEstado',
            params: {
                idcontroldivisa: smGpIndControlDivisa.getSelected().data.idcontroldivisa,
                estado: estadoActivar
            },
            callback: function (options, success, response) {

                mostrarMensaje(1, "El indicador de control de divisa ha sido " + accion + " satisfactoriamente.");
                stGpIndControlDivisa.reload({
                    limit: cbIndControlDivisa.getValue()
                });
            }
        });
    }

    function modificarNivel(value, m) {
        m.attr = 'ext:qtip="' + value + '"';
        switch (value)
        {
            case '1':
                return perfil.etiquetas.lbGenerico
                break;
            case '2':
                return perfil.etiquetas.lbSubgenerico
                break;
            case '3':
                return perfil.etiquetas.lbEspecifico
                break;
            default:
                return perfil.etiquetas.lbSurtido
        }
        return x
    }

    function actualizararbol(arbol) {

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
}

function modificarNivel(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    switch (value)
    {
        case '1':
            return perfil.etiquetas.lbGenerico
            break;
        case '2':
            return perfil.etiquetas.lbSubgenerico
            break;
        case '3':
            return perfil.etiquetas.lbEspecifico
            break;
        default:
            return perfil.etiquetas.lbSurtido
    }
    return x
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function crearToolTipasociado(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
}
function Asociar(asociar, ejercicio)
{
    if (asociar) {
        myMask.show();
        var selections = smGpIndPlanificacion.getSelections();
        idsplanif = [];
        orden = [];
        for (var i = 0; i < selections.length; i++) {
            idsplanif.push(selections[i].id);
            var ordenderizq = {};
            ordenderizq = {
                ordender: selections[i].data.ordender,
                ordenizq: selections[i].data.ordenizq
            };
            orden.push(ordenderizq);
        }
        Ext.Ajax.request({
            url: 'AsociarIndicadores',
            params: {
                idindicador: Ext.encode(idsplanif),
                orden: Ext.encode(orden),
                idcontroldivisa: smGpIndControlDivisa.getSelected().data.idcontroldivisa,
                iddatosnomenclador: (smGpIndDestino.hasSelection()) ? smGpIndDestino.getSelected().data.identidadmodelo : null,
                idejercicio: ejercicio
            },
            callback: function (options, success, response) {
                myMask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData == 1) {
                    mostrarMensaje(1, "Los indicadores han sido asociados satisfactoriamente.");
                    var aux = smGpIndPlanificacion.getSelections();
                    smGpIndPlanificacion.clearSelections();
                    smGpIndDestino.clearSelections();
                    stGpIndPlanificacion.reload({
                        params: {
                            start: 0,
                            limit: cbPaginadoPlanif.getValue()
                        }
                    });
                    smGpIndPlanificacion.selectRecords(aux);
                    smGpIndControlDivisa.clearSelections();
                } else {
                    mostrarMensaje(3, "El(los) indicador(es) de planificación que desea asociar ya se encuentra(n) asociado(s) " +
                            "al indicador de control de divisa o concepto del plan seleccionado.");
                    var aux = smGpIndPlanificacion.getSelections();
                    smGpIndPlanificacion.clearSelections();
                    stGpIndPlanificacion.reload({
                        params: {
                            start: 0,
                            limit: cbPaginadoPlanif.getValue()
                        }
                    });
                    smGpIndPlanificacion.selectRecords(aux);
                }
            }
        });

    } else {
        myMask.show();
        var selectionsdes = smGpIndPlanificacion.getSelections();
        idsplanif = [];
        orden = [];
        for (var j = 0; j < selectionsdes.length; j++) {
            idsplanif.push(selectionsdes[j].id);
            var ordenderizq = {};
            ordenderizq = {
                ordender: selectionsdes[j].data.ordender,
                ordenizq: selectionsdes[j].data.ordenizq
            };
            orden.push(ordenderizq);
        }
        Ext.Ajax.request({
            url: 'desasociarindicadores',
            params: {
                idindicador: Ext.encode(idsplanif),
                orden: Ext.encode(orden),
                idcontroldivisa: smGpIndControlDivisa.getSelected().data.idcontroldivisa,
                idejercicio: ejercicio
            },
            callback: function (options, success, response) {
                myMask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData == 1) {
                    mostrarMensaje(1, "El(los) indicador(es) ha(n) sido desasociado(s) satisfactoriamente.");
                    var aux = smGpIndPlanificacion.getSelections();
                    smGpIndPlanificacion.clearSelections();
                    stGpIndPlanificacion.reload({
                        params: {
                            start: 0,
                            limit: cbPaginadoPlanif.getValue()
                        }
                    });
                    smGpIndPlanificacion.selectRecords(aux);
                } else {
                    mostrarMensaje(1, "Este indicador de divisa no se encuentra asociado al indicador de la planificación seleccionado.");
                    var aux = smGpIndPlanificacion.getSelections();
                    smGpIndPlanificacion.clearSelections();
                    stGpIndPlanificacion.reload({
                        params: {
                            start: 0,
                            limit: cbPaginadoPlanif.getValue()
                        }
                    });
                    smGpIndPlanificacion.selectRecords(aux);
                }


            }
        });
    }
}

function Aprobar(aprobar, idejercicio)
{
    if (aprobar) {
        myMask.show();
        var selections = smGpIndPlanificacion.getSelections();
        idsplanif = [];
        orden = [];
        for (var i = 0; i < selections.length; i++) {
            idsplanif.push(selections[i].json.idcontroldi);
            var ordenderizq = {};
            ordenderizq = {
                ordender: selections[i].data.ordender,
                ordenizq: selections[i].data.ordenizq
            };
            orden.push(ordenderizq);
        }
        Ext.Ajax.request({
            url: 'AprobarDesaprobarAsociacion',
            params: {
                idcontroldivisaindicador: Ext.encode(idsplanif),
                aprobar: 1,
                rector: rector,
                orden: Ext.encode(orden),
                idejercicio: idejercicio
            },
            callback: function (options, success, response) {
                myMask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData != 3) {
                    mostrarMensaje(1, "El(los) indicador(es) de la planificación ha(n) sido aprobado(s) satisfactoriamente.");
                    var aux = smGpIndPlanificacion.getSelections();
                    smGpIndPlanificacion.clearSelections();
                    stGpIndPlanificacion.reload({
                        params: {
                            start: 0,
                            limit: cbPaginadoPlanif.getValue()
                        }
                    });
                    smGpIndPlanificacion.selectRecords(aux);
                } else {
                    mostrarMensaje(3, "No se pudo aprobar la asociación.");
                }

            }
        });

    } else {
        myMask.show();
        var selectionsdes = smGpIndPlanificacion.getSelections();
        idsplanif = [];
        orden = [];
        for (var j = 0; j < selectionsdes.length; j++) {
            idsplanif.push(selectionsdes[j].json.idcontroldi);
            var ordenderizq = {};
            ordenderizq = {
                ordender: selectionsdes[j].data.ordender,
                ordenizq: selectionsdes[j].data.ordenizq
            };
            orden.push(ordenderizq);
        }
        Ext.Ajax.request({
            url: 'aprobardesaprobarasociacion',
            params: {
                idcontroldivisaindicador: Ext.encode(idsplanif),
                aprobar: 0,
                rector: rector,
                orden: Ext.encode(orden),
                idejercicio: idejercicio
            },
            callback: function (options, success, response) {
                myMask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData == 1) {
                    mostrarMensaje(1, "El(los) indicador(es) de la planificación ha(n) sido desaprobado(s) satisfactoriamente.");
                    var aux = smGpIndPlanificacion.getSelections();
                    smGpIndPlanificacion.clearSelections();
                    stGpIndPlanificacion.reload({
                        params: {
                            start: 0,
                            limit: cbPaginadoPlanif.getValue()
                        }
                    });
                    smGpIndPlanificacion.selectRecords(aux);
                } else {
                    mostrarMensaje(3, "No se pudo desaprobar.");
                    var aux = smGpIndPlanificacion.getSelections();
                    smGpIndPlanificacion.clearSelections();
                    stGpIndPlanificacion.reload({
                        params: {
                            start: 0,
                            limit: cbPaginadoPlanif.getValue()
                        }
                    });
                    smGpIndPlanificacion.selectRecords(aux);
                }


            }
        });
    }
}
function renderaprobacionanteproyecto(value) {
    if (value == 4)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    else if (value == 3)
        return '<span><img src=' + perfil.dirImg + 'tick(amarillo).png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}
function renderactivacion(value) {
    if (value == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    else
        return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}
function renderaplanificadoanteproyecto(value) {
    if (value == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    else if (value == 0)
        return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}

function eliminarControlDivisa() {
    arrayAeliminar = [];
    for (var i = 0; i < smGpIndControlDivisa.getSelections().length; i++)
    {
        arrayAeliminar.push(smGpIndControlDivisa.getSelections()[i].data.idcontroldivisa);
    }
    mostrarMensaje(2, '¿Está seguro que quiere eliminar el(los) indicador(es) de control de divisa seleccionado(s)?', function (btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'eliminarIndCD',
                params: {
                    todelete: Ext.encode(arrayAeliminar),
                    eliminarasoc: 0
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == 1) {
                        mostrarMensaje(1, "El(los) indicador(es) de control de divisa ha(n) sido eliminado(s) satisfactoriamente.");
                        stGpIndControlDivisa.reload({
                            limit: cbIndControlDivisa.getValue()
                        });
                    } else
                    {
                        mostrarMensaje(3, "El(los) indicador(es) de control de divisa seleccionado(s) se encuentran en uso.");
                    }
                }
            });
        }
    });
}

function exportarCorrelacionadores(smIndPlanif) {
    var selections = smIndPlanif.getSelections();
    indcontroldivmodelo = [];

    for (var i = 0; i < selections.length; i++) {
        indcontroldiv = [];
        for (var j = 0; j < selections[i].data.DatControldivisaindicadormodelo.length; j++) {
            var result = {};
            result = {
                idinddivmodelo: selections[i].data.DatControldivisaindicadormodelo[j].idcontroldivisaindicadormodelo
            };
            indcontroldiv.push(result);
        }

        var result1 = {};
        result1 = {
            idinddivmodelo: indcontroldiv,
            codigoindplanif: selections[i].data.codigo,
            denominacionindplanif: selections[i].data.denominacion
        };
        indcontroldivmodelo.push(result1);
    }

    var win = window.open('exportarCorrelacionadorInd?indicadorescontdivisa=' + Ext.encode(indcontroldivmodelo)
            + '&idejercicio=' + cbEjercicio.getValue());
    mascaraExportar("Exportando", "Espere por favor...", win);
}


//function mostrarAyuda(referencia, title) {
//    var title = 'Ayuda de Control de Divisa';
//    var referencia = 'controldivisa';
//    help.show(title, referencia);
//}
