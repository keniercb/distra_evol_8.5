var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();
Ext.QuickTips.init();
Ext.Ajax.timeout = 1000000000;

/*prueba*/
/*
 variables globales
 */

var vpGestionarGrupos, btnAyuda, btnBuscar, panelCentral, btnAdicionar,
        btnModificar, btnEliminar, btnAlias, btnActivar, btnDesactivar, GpGrupos, stGpGrupos, smGpGrupos,
        btnactualizar;

var wingestionargrupos, btnCancelar, btnAplicar, btnAceptar, fpwingestionargrupos, tpEntidades,
        padretpEntidades, tpGrupo, padretpGrupo, tpfpwingestionargrupos, pgestionargrupos, personal,
        stcbpaginadogrupos, cbpaginadogrupos, pggrupo;

var winAlias, GpAlias, stGpAlias, smalias, stcbActivo, cbActivo;

var stGpUsuarios, smUsuarios, GpUsuarios;

var click = true, arrayrecords, totalrecords, totalidgrupos, estamodificando, idgrupoamodificar,
        idgrupo, url, mensaje, estamod;
//para validar posteriormente modificacion
var datos_ini,
        datos_fin,
        array_entidades_ini = [],
        array_entidades_fin = [],
        array_grupos_ini = [],
        array_grupos_fin = [];
arrayalias_ini = [];
arrayalias_fin = [];
var _this = this;
/*
 funcion para cargar la interfaz
 */
function cargarInterfaz() {
    //objeto del componente "barra de progreso"
    var _this = this;
    BarraProgresoGrupos = new BarraEstado
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    MyCheckboxSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
        header: '<div class="x-grid3-hd-checker">&#160;</div>',
        width: 20,
        sortable: false,
        menuDisabled: true,
        fixed: true,
        dataIndex: '',
        id: 'checker',
        initEvents: function() {
            MyCheckboxSelectionModel.superclass.initEvents.call(this);
            this.grid.on('render', function() {
                var view = this.grid.getView();
                view.mainBody.on('mousedown', this.onMouseDown, this);
                Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);

            }, this);
        },
        // private
        onMouseDown: function(e, t) {
            if (e.button === 0 && t.className == 'x-grid3-row-checker') { // Only fire if left-click
                e.stopEvent();
                var row = e.getTarget('.x-grid3-row');
                if (row) {
                    var index = row.rowIndex;
                    if (this.isSelected(index)) {
                        this.deselectRow(index);
                    } else {
                        this.selectRow(index, true);
                    }
                }
            }
        },
        // private
        onHdMouseDown: function(e, t) {
            if (t.className == 'x-grid3-hd-checker') {
                e.stopEvent();
                var hd = Ext.fly(t.parentNode);
                var isChecked = hd.hasClass('x-grid3-hd-checker-on');
                if (isChecked) {
                    hd.removeClass('x-grid3-hd-checker-on');
                    this.clearSelections(false, 'columnChecked');
                    this.fireEvent('columnselectionchange', this, false);

                } else {
                    hd.addClass('x-grid3-hd-checker-on');
                    this.selectAll('columnChecked');
                    this.fireEvent('columnselectionchange', this, true);

                }
            }
        },
        // private
        renderer: function(v, p, record) {
            return '<div class="x-grid3-row-checker">&#160;</div>';
        }
    });

    btnAdicionar = new Ext.Button({
        id: 'btnAgr',
        //icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        text: 'Adicionar',
        handler: function() {
            if (smGpGrupos.hasSelection())
            {
                smGpGrupos.clearSelections();
                GpGrupos.getView().refresh(true);
                SetEstadoBotonesTbarGrid();
            }
            estamod = 0;
            CrearVentanaGestionarGrupos('add');
        },
        tooltip: 'Adicionar grupo de usuarios',
        key: {
            alt: true ,
            key: 'I'
        },
        scope: this
    });
    btnModificar = new Ext.Button({
        disabled: true,
        id: 'btnMod',
        //icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        text: 'Modificar',
        handler: function() {
            estamod = 1;
            CrearVentanaGestionarGrupos('mod');
        },
        tooltip: 'Modificar grupo de usuarios',
        key: {
            alt: true ,
            key: 'M'
        },
        scope: this
    });
    btnEliminar = new Ext.Button({
        disabled: true,
        id: 'btnEli',
        //icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        text: 'Eliminar',
        handler: function() {
            ConfirmarEliminacion();
        },
        tooltip: 'Eliminar grupo de usuarios',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    btnAyuda = new Ext.Button({
        text: 'Ayuda',
        id: 'btnAyu',
        handler: function() {
            help.show('Grupos de usuarios y estructuras', 'Grupos de usuarios y estructuras');
        },
        //icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad.',
        key: {
            alt: true ,
            key: 'H'
        },
        scope: this
    });
    btnAlias = new Ext.Button({
        disabled: true,
        id: 'btnAlias',
        //icon: perfil.dirImg + 'buscarclitepersona.png',
        iconCls: 'buscarclitepersona',
        text: 'Cambiar alias a usuarios',
        handler: function() {
            CreaVentanaCambiarAlias();
        },
        tooltip: 'Cambiar el alias a los usuarios'
    });
    btnActivar = new Ext.Button({
        disabled: true,
        id: 'btnAlias',
        //icon: perfil.dirImg + 'habilitar.png',
        iconCls: 'habilitar',
        text: 'Activar',
        handler: function() {
            ConfirmarActivacion();
        },
        tooltip: 'Activar grupo de usuarios',
        key: {
            alt: true ,
            key: 'X'
        },
        scope: this
    });
    btnDesactivar = new Ext.Button({
        disabled: true,
        id: 'btnDesactivar',
        //icon: perfil.dirImg + 'deshabilitar.png',
        iconCls: 'deshabilitar',
        text: 'Desactivar',
        handler: function() {
            ConfirmarDesactivacion();
        },
        tooltip: 'Desactivar grupo de usuarios',
        key: {
            alt: true ,
            key: 'F'
        },
        scope: this

    });
    btnBuscar = new Ext.Button({
        disabled: true,
        id: 'btnBuscar',
        //icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscar',
        //text:'Buscar',
        handler: function() {
            BuscarGrupos();
        },
        tooltip: 'Buscar grupo(s)',
        key: {
            alt: true ,
            key: 'B'
        },
        scope: this

    });
    btnLimpiar = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        //icon: perfil.dirImg + 'limpiar.png',
        handler: function() {
            // cbActivo.reset();
            _this.ftCmpgrupos.clearFilters();
            // stGpGrupos.load();
            //  Ext.getCmp('tfbdenom').reset();
        },
        key: {
            alt: true ,
            key: 'L'
        },
        scope: this

    });


    /*
     funcion para mostrar la imagen de si esta suspendido o no el grupo
     */
    function MostrarImagenEsadoGrupo(valor) {
        if (valor == 0)
            return '<center>No</center>';
        if (valor == 1)
            return '<center>Sí</center>';
    }

    function MostrarImagenActivo(valor)
    {
        if (valor == 0) {
            return '<center><span><img src="../../../comun/recursos/images/fam/desactivo.png" ></span></center>';
        }
        else {
            return '<center><span><img src="../../../comun/recursos/images/fam/activo.png" ></span></center>';
        }
    }

    /*
     funcion para mostrar el icno de grupo en cada tupla del grid de grupos
     */
    function MostrarImagenGrupo(valor, record) {
        if (record.data.tipo == 'estructura')
            return '<span><img src=' + record.data.icono + ' >' + ' ' + valor + '</span>';
        return '<span><img src="../../../comun/recursos/images/fam/grupo.png" >' + ' ' + valor + '</span>';
    }

    //store del combo para buscar por activo
    stcbActivo = new Ext.data.SimpleStore({
        id: 'stcbActivo',
        fields: ['idactivo', 'denactivo'],
        data: [[1, 'Sí'],
            [0, 'No'],
            [2, 'Ambos']]
    });

    //combobox para buscar por activo
    cbActivo = new Ext.form.ComboBox({
        id: 'cbActivo',
        name: 'cbActivo',
        value: 2,
        store: stcbActivo,
        displayField: 'denactivo',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        editable: false,
        hiddenName: 'idactivo',
        valueField: 'idactivo',
        width: 200,
        emptyText: 'Seleccione...',
        listeners: {
            render: function(cb) {
                btnBuscar.enable();
            }
        }
    });

    //store del combo del modo donde muestro la cantidad de elementos por paginas del grid
    stcbpaginadogrupos = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [10, '10'],
            [20, '20'],
            [40, '40'],
            [80, '80'],
            [100, '100'],
            [200, '200'],
            [500, '500'],
            [1000, '1000']
        ]
    });
    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    cbpaginadogrupos = new Ext.form.ComboBox({
        value: 80,
        store: stcbpaginadogrupos,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 50,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                stGpGrupos.removeAll();
                stGpGrupos.load();
            }
        }
    });

    //Store del Grid de grupos
    stGpGrupos = new Ext.data.Store({
        autoLoad: true,
        url: 'cargargrupos',
        listeners: {
            beforeload: function(st)
            {
                stGpGrupos.removeAll();
                st.baseParams.limit = cbpaginadogrupos.getValue();
                st.baseParams.start = 0;
            },
            load: function(st)
            {
                _this.changeTitlegrupo();
                SetEstadoBotonesTbarGrid();
            }
        },
        reader: new Ext.data.JsonReader(
                {
                    totalProperty: "total",
                    root: "campos",
                    id: "idgrupo"
                }, [{
                name: 'idgrupo'
            }, {
                name: 'dengrupo'
            }, {
                name: 'descgrupo'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'idusuariocrea'
            }, {
                name: 'activo'
            }, {
                name: 'personal'
            }, {
                name: 'icono'
            }])
    });

    //barra de paginado del grid donde se cargan las repeticiones
    pggrupo = new Ext.PagingToolbar({
        pageSize: cbpaginadogrupos.getValue(),
        store: stGpGrupos,
        width: 400,
        displayInfo: true
    });

    // Establesco modo de seleccion de grid (multiple)
    smGpGrupos = new MyCheckboxSelectionModel({
        listeners: {
            rowselect: function(sm, indiceFila, record)
            {
                On_RowClick(sm);
            },
            rowdeselect: function(sm, indiceFila, record)
            {
                On_RowClick(sm);
            }
            /*selectionchange:function(sm, event){  
             
             if(event != "columnChecked")
             On_RowClick(sm);
             else
             {                   
             stGpUsuarios.removeAll();
             GpUsuarios.collapse();
             GpUsuarios.setTitle('<center>Por favor, seleccione un grupo para ver sus integrantes ...</center>');
             }
             }*/
        }
    });
    //plugins para los filtros del grid
    this.ftCmpgrupos = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'dengrupo'
            }, {
                type: 'list',
                dataIndex: 'activo',
                options: ['Si', 'No']
            }]
    });

    // Defino el grid de Grupos
    GpGrupos = new Ext.grid.GridPanel({
        frame: true,
        region: 'center',
        plugins: _this.ftCmpgrupos,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        store: stGpGrupos,
        sm: smGpGrupos,
        loadMask: {
            msg: 'Cargando grupos'
        },
        columns: [smGpGrupos, {
                hidden: true,
                hideable: false,
                dataIndex: 'idgrupo'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idusuariocrea'
            }, {
                id: 'expandir',
                header: 'Denominación',
                renderer: MostrarImagenGrupo,
                dataIndex: 'dengrupo'
            }, {
                header: 'Activo',
                dataIndex: 'activo',
                renderer: MostrarImagenActivo,
                width: 100
            }],
        listeners: {
            rowdblclick: function() {
                estamod = 1;
                CrearVentanaGestionarGrupos('mod');

            }
        },
        bbar: [pggrupo, '->', 'Resultados por p&aacute;gina : ', cbpaginadogrupos]
    });

    stGpUsuarios = new Ext.data.Store({
        url: 'cargarusuariosgrupo',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "campos",
            id: "idusuario"
        },
        [{
                name: 'idusuario'
            }, {
                name: 'denominacion'
            }])
    });

    smUsuarios = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    GpUsuarios = new Ext.grid.GridPanel({
        title: 'Seleccione un grupo para ver sus integrantes...',
        frame: true,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        collapsible: true,
        collapsed: true,
        height: 200,
        clicksToEdit: 1,
        region: 'south',
        store: stGpUsuarios,
        loadMask: {
            msg: 'Cargando usuarios'
        },
        sm: smUsuarios,
        disabled: false,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idusuario'
            }, {
                id: 'expandir',
                header: 'Denominación',
                dataIndex: 'denominacion'
            }],
        listeners: {
            beforeexpand: function(p) {
                stGpUsuarios.removeAll();
                GpUsuarios.getView().refresh(true);
            },
            expand: function(p)
            {
                GpUsuarios.setHeight(250);
            }
        }
        /*
         loadMask:{msg :'Cargando usuarios del grupo'}, 
         bbar:new Ext.PagingToolbar({
         pageSize: 15,
         store: stGpUsuarios,
         displayInfo: true,
         displayMsg: perfil.etiquetas.lbMsgbbarI,
         emptyMsg: perfil.etiquetas.lbMsgbbarII
         })*/
    });

    //store del grid de alias
    stGpAlias = new Ext.data.Store({
        url: 'cargargridalias',
        //baseParams :{start:0,limit:15,idgrupo:arrayrecords[0].data.idgrupo},
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "campos",
            id: "idusuario"
        },
        [{
                name: 'idgrupo'
            }, {
                name: 'idusuario'
            }, {
                name: 'alias'
            }])
    });
    // Establesco modo de seleccion de grid (single)
    smalias = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    smalias.on('beforerowselect', function(smodel, rowIndex, keepExisting, record) {
    }, this);



    // Defino el grid de Alias
    GpAlias = new Ext.grid.EditorGridPanel({
        frame: true,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        clicksToEdit: 1,
        region: 'center',
        maskRe: /^([a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?,-]+ ?[a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?,-]*)+$/,
        regex: /^([a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?,-]+ ?[a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?,-]*)+$/,
        store: stGpAlias,
        sm: smalias,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idusuario'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idgrupo'
            }, {
                id: 'expandir',
                header: 'Denominación',
                dataIndex: 'alias',
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            }
        ],
        loadMask: {
            msg: 'Cargando usuarios del grupo'
        }
    });

    //ventana alias
    winAlias = new Ext.Window({
        id: 'winAlias',
        modal: true,
        closeAction: 'hide',
        animateTarget: 'btnAlias',
        layout: 'border',
        title: 'Cambiar alias a usuarios',
        width: 600,
        height: 400,
        items: [GpAlias],
        keys: [{
                key: Ext.EventObject.ENTER,
                fn: function() {
                    ModificarAlias();
                },
                scope: this
            }],
        buttons: [
            {                
                iconCls: 'cancelar',
                text: 'Cancelar',
                handler: function() {
                    if (smGpGrupos.hasSelection())
                    {
                        smGpGrupos.clearSelections();
                        GpGrupos.getView().refresh(true);
                    }
                    winAlias.hide();
                },
                tooltip: 'Cerrar ventana sin guardar los datos'
            }, {                
                iconCls: 'aceptar',
                id: 'btnacepalias',
                tooltip: 'Guardar datos y cerrar ventana',
                text: 'Aceptar',
                cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
                handler: function() {
                    ModificarAlias();
                }
            }],
        listeners: {
            show: function(win) {
                var elementosAlias = stGpAlias.getRange();
                if (elementosAlias.length > 0) {
                    for (var i = 0; i < elementosAlias.length; i++)
                    {
                        var aliasusuarios;
                        aliasusuarios = elementosAlias[i].data.alias,
                                arrayalias_ini.push(aliasusuarios);
                    }
                }
            },
            hide: function(win) {
                arrayalias_ini = [];
                arrayalias_fin = [];
                stGpAlias.rejectChanges();
            }
        }
    });

    // Panel central
    this.panelCentral = new Ext.Panel({
        title: 'Registro de grupos de usuarios por rol',
        layout: 'border',
        items: [GpGrupos, GpUsuarios],
        usarKeymap:true,
        botonesKeymap: [ btnAdicionar, btnModificar, btnEliminar, btnAlias,  btnActivar, btnDesactivar,  btnLimpiar ],
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnAlias, btnActivar, btnDesactivar,btnLimpiar/*,'->',btnAyuda*/]
    });

    //viewport de la vista
    vpGestionarGrupos = new Ext.Viewport({
        layout: 'fit',
        items: panelCentral
    });

    //............................FUNCIONES.........................................

    /*
     funcion que invoco cuando selecciono un elemento en el grid
     */
    function On_RowClick(sm, indiceFila, record) {
        CrearArregloDeRecords(sm);
        SetEstadoBotonesTbarGrid();
    }

    /*
     funcion donde guardo en un arreglo los record del selection model
     */
    function CrearArregloDeRecords(sm) {
        arrayrecords = [];
        arrayrecords = sm.getSelections();
        totalrecords = arrayrecords.length;
        totalidgrupos = [];
        for (var i = 0; i < totalrecords; i++)
        {
            var grupo = {
                idgrupo: arrayrecords[i].data.idgrupo
            };
            totalidgrupos.push(grupo);
        }
        if (totalrecords == 1)
        {
            GpUsuarios.expand();
            stGpUsuarios.reload({
                params: {
                    idgrupo: totalidgrupos[0].idgrupo
                }
            });
            GpUsuarios.getView().refresh(true);
            GpUsuarios.setTitle('Integrantes del grupo ' + arrayrecords[0].data.dengrupo);
        }
        if (totalrecords != 1)
        {
            stGpUsuarios.removeAll();
            GpUsuarios.getView().refresh(true);
            GpUsuarios.setTitle('Por favor, seleccione un grupo para ver sus integrantes...');
        }
    }

    /*
     funcion para activar los botones de la barra de herramientas para la gestion de los grupos
     */
    function SetEstadoBotonesTbarGrid() {
        if (smGpGrupos.hasSelection())
        {
            if (totalrecords == 1)
            {
                btnModificar.enable();
                btnAlias.enable();
                btnEliminar.enable();
                if (arrayrecords[0].data.activo == 1) {
                    btnActivar.disable();
                    btnDesactivar.enable();
                }
                if (arrayrecords[0].data.activo == 0) {
                    btnActivar.enable();
                    btnDesactivar.disable();
                }
            }
            if (totalrecords > 1)
            {
                btnAlias.disable();
                btnDesactivar.disable();
                btnActivar.disable();
                btnModificar.disable();
                btnEliminar.enable();
                var todosactivos = true;
                var todosdesactivos = true;
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.activo == 1)
                        todosdesactivos = false;
                    if (arrayrecords[i].data.activo == 0)
                        todosactivos = false;

                }
                if (todosactivos == true)
                    btnDesactivar.enable();
                if (todosdesactivos == true)
                    btnActivar.enable();
            }
        } else {
            btnModificar.disable();
            btnEliminar.disable();
            btnAlias.disable();
            btnDesactivar.disable();
            btnActivar.disable();
        }
    }


    /*
     funcion para crear la ventana de gestionar grupos
     */
    function CrearVentanaGestionarGrupos(opcion) {
             
        if (wingestionargrupos)
            wingestionargrupos.destroy();
        var titulo = 'Adicionar ';
        if (opcion == 'mod') {
            titulo = 'Modificar ';
        }

        //arbol de estructuras
        tpEntidades = new Ext.tree.TreePanel({
            title: 'Estructura',
            autoScroll: true,
            region: 'center',
            split: true,
            width: '37%',
            root: {
                text: 'Dominio',
                tipo: '00',
                id: '0'
            },
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'cargarestructuras',
                listeners: {
                    'beforeload': function(atreeloader, anode) {
                        disableWinGroup();
                        atreeloader.baseParams = {
                            idgrupoamodificar: idgrupoamodificar,
                            tipo: anode.attributes.tipo,
                            estamodificando: estamodificando,
                            dominio: anode.attributes.dominio
                        };
                    },
                    'load': function(atreeloader, anode) {
                        enableWinGroup();
                        array_entidades_ini = tpEntidades.getChecked();
                    }
                }
            })
        });
        setLogicaArbolCheck(tpEntidades);

        //treepanel "Desde Grupos:"
        tpGrupo = new Ext.tree.TreePanel({
            title: 'Grupos ',
            autoScroll: true,
            region: 'center',
            split: true,
            width: '35%',
            root: {
                text: 'Mis grupos: ',
                tipo: '0',
                id: 'nodo2',
                idgrupo: 'nodo2',
                expanded: true
            },
            /*listeners:{
             'checkchange':function(nodo,check)
             {
             ChequearNodosHijos(nodo,check);
             ChequearNodoPadre(nodo,check);
             }
             },*/
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'cargargruposexistentes',
                listeners: {
                    'beforeload': function(atreeloader, anode) {
                        disableWinGroup();
                        atreeloader.baseParams = {
                            idgrupoamodificar: idgrupoamodificar,
                            idgrupo: anode.attributes.idgrupo,
                            tipo: anode.attributes.tipo,
                            idusuario: anode.attributes.idelemento,
                            estamodificando: estamodificando
                        };
                    },
                    'load': function(atreeloader, anode) {
                        enableWinGroup();
                        array_grupos_ini = tpGrupo.getChecked();
                    }
                }
            })
        });

        /*function ChequearNodosHijos(nodo,check)
         {
         if(nodo.hasChildNodes())
         {
         nodo.eachChild(function(anodehijo)
         {
         if (anodehijo.attributes.checked != check)
         {
         anodehijo.getUI().toggleCheck(check);
         anodehijo.attributes.checked = check;
         if(anodehijo.hasChildNodes()) 
         {ChequearNodosHijos(anodehijo,check);}
         }
         });
         }
         }
         function ChequearNodoPadre(nodo,check)
         {
         if(nodo.parentNode && nodo.parentNode.attributes.checked!=undefined)
         {
         var estado = true;
         if(nodo.parentNode.hasChildNodes())
         {
         nodo.parentNode.eachChild(function(anodehijo){
         if(anodehijo.attributes.checked != check)
         {estado = false;}
         });
         if(estado)
         {
         nodo.parentNode.getUI().toggleCheck(check);
         nodo.parentNode.attributes.checked = check;
         }
         }
         }
         }*/
        setLogicaArbolCheck(tpGrupo);

        //treepanel "Desde Perisos:"
        tpPermisos = new Ext.tree.TreePanel({
            title: 'Permisos del nivel superior ',
            autoScroll: true,
            region: 'center',
            split: true,
            width: '35%',
            root: {
                nodeType: 'async',
                id: 'nodo4',
                idgrupo: 'nodo4',
                text: 'Permisos otorgados por el nivel superior',
                tipo: '2',
                leaf: false
            },
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'cargarpermisosnivelsuperior',
                listeners: {
                    'beforeload': function(atreeloader, anode) {
                        /* disableWinGroup();*/
                        atreeloader.baseParams = {
                            //idgrupoamodificar: idgrupoamodificar,
                            //idgrupo: anode.attributes.idgrupo, 
                            tipo: anode.attributes.tipo,
                            //idusuario: anode.attributes.idelemento, 
                            estamodificando: estamodificando
                        };
                    },
                    'load': function(atreeloader, anode) {
                        /*enableWinGroup();
                         array_grupos_ini = tpGrupo.getChecked();*/
                    }
                }
            })
        });
        setLogicaArbolCheck(tpPermisos);

        //tabpanel donde muestro los arboles
        tpfpwingestionargrupos = new Ext.TabPanel({
            id: 'pfpwingestionargrupos',
            region: 'center',
            activeTab: 0,
            items: [{
                    xtype: 'panel',
                    id: 'pestruct',
                    title: 'Desde estructura',
                    layout: 'border',
                    listeners: {
                        render: function(p) {
                        }
                    },
                    items: [tpEntidades]
                }, {
                    xtype: 'panel',
                    id: 'pgrup',
                    title: 'Desde grupos',
                    layout: 'border',
                    listeners: {
                        render: function(p) {
                        }
                    },
                    items: [tpGrupo]
                }/*,{
                 xtype:'panel',
                 id:'pperm',
                 title:'Desde permisos',
                 layout:'border',
                 listeners:{
                 render:function(p){}
                 },			 
                 items:[tpPermisos]
                 }*/]
        });


        //formulario de la ventana para gestionar grupos
        fpwingestionargrupos = new Ext.FormPanel({
            id: 'fpwingestionargrupos',
            labelAlign: 'top',
            frame: true,
            region: 'west',
            width: 230,
            bodyStyle: 'padding:5px 5px 0',
            items: [
                {
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: [{
                                    xtype: 'textfield',
                                    fieldLabel: 'Denominación',
                                    id: 'dengrupo',
                                    name: 'dengrupo',
                                    regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                                    maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                                    regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                                    vtype: 'validarEspaciosEnBlanco',
                                    prevTab: 'btnAceptar',
                                    allowBlank: false,
                                    anchor: '100%'
                                }]
                        }, {
                            columnWidth: 1,
                            layout: 'form',
                            items: [{
                                    xtype: 'textarea',
                                    fieldLabel: 'Descripción',
                                    id: 'descgrupo',
                                    name: 'descgrupo',
                                    maskRe: /^([a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.¿?,-]+ ?[a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.¿?,-]*)+$/,
                                    regex: /^([a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.¿?,-]+ ?[a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.¿?,-]*)+$/,
                                    height: 245,
                                    anchor: '100%'
                                }]
                        }]
                }, {
                    xtype: 'textfield',
                    id: 'modificar',
                    allowBlank: true,
                    hidden: true
                }]
        });

        personal = new Ext.form.Checkbox({
            id: 'personal',
            name: 'personal',
            listeners: {
                check: function(ch, checked)
                {
                    if (checked == 1)
                    {
                        tpfpwingestionargrupos.disable();
                    }
                    if (checked == 0)
                    {
                        tpfpwingestionargrupos.enable();
                    }
                }
            }

        });

        //panel donde cargo el formulario y los arboles para gestionar grupos
        pgestionargrupos = new Ext.Panel({
            layout: 'border',
            //tbar:[personal,'',' Rol personal'],		
            items: [fpwingestionargrupos, tpfpwingestionargrupos]
        });


        //ventana para gestionar grupos
        wingestionargrupos = new Ext.Window({
            id: 'wingestionargrupos',
            modal: true,
            layout: 'fit',
            resizable: false,
            title: titulo + 'grupo de usuarios por rol',
            width: 800,
            height: 400,
            items: [pgestionargrupos]/*,
             keys:[{              
             key: Ext.EventObject.ENTER,
             fn:  function(){
             GestionarGrupos('acp');
             },
             scope: this
             }]*/
        });

        btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar',
            handler: function() {
                //tpfpwingestionargrupos.activate('pestruct');                
                array_entidades_ini = [];
                array_entidades_fin = [];
                array_grupos_ini = [];
                array_grupos_fin = [];
                if (smGpGrupos.hasSelection())
                {
                    smGpGrupos.clearSelections();
                    GpGrupos.getView().refresh(true);
                }
                SetEstadoBotonesTbarGrid();
                wingestionargrupos.destroy();
            },
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            nextTab:'dengrupo',
            tooltip: 'Guardar datos y cerrar ventana',
            text: 'Aceptar',
            cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
            handler: function() {
                GestionarGrupos('acp');
            }
        });
        btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            //icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            text: 'Aplicar',
            cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
            handler: function() {
                GestionarGrupos('apl');
            }
        });

        if (opcion == 'add')
        {
            wingestionargrupos.addButton(btnCancelar);
            wingestionargrupos.addButton(btnAplicar);
            wingestionargrupos.addButton(btnAceptar);

            wingestionargrupos.doLayout();
            estamodificando = false;
            url = 'adicionargrupo';
            mensaje = 'Por favor espere...';
        }
        if (opcion == 'mod')
        {
            wingestionargrupos.addButton(btnCancelar);
            wingestionargrupos.addButton(btnAceptar);
            wingestionargrupos.doLayout();
            fpwingestionargrupos.getForm().loadRecord(arrayrecords[0]);
            estamodificando = true;
            idgrupoamodificar = arrayrecords[0].data.idgrupo;
            fpwingestionargrupos.findById('modificar').setValue(arrayrecords[0].data.idgrupo);
            fpwingestionargrupos.findById('dengrupo').setValue(arrayrecords[0].data.dengrupo);
            fpwingestionargrupos.findById('descgrupo').setValue(arrayrecords[0].data.descgrupo);

            url = 'modificargrupo';
            mensaje = 'Por favor espere ...';
        }

        //tpEntidades.getRootNode().reload();
        wingestionargrupos.show();
        //para validar datos nulos(ARA)
        datos_ini = fpwingestionargrupos.getForm().getValues(true);
        //Ext.get('dengrupo').focus(/*false,1024*/);

    }
    //para validar datos nulos(ARA)
    function validarModificacion() {

        var result = true;
        datos_fin = fpwingestionargrupos.getForm().getValues(true);
        array_entidades_fin = tpEntidades.getChecked();
        array_grupos_fin = tpGrupo.getChecked();

        if (datos_fin === datos_ini
                && array_entidades_ini.toString() === array_entidades_fin.toString()
                && array_grupos_ini.toString() === array_grupos_fin.toString())
        {
            mostrarMensaje(1, 'Usted no ha realizado modificaciones.');
            result = false;
        }

        return result;

    }

    /*
     funcion para gestionar grupos
     */
    function GestionarGrupos(opcion)
    {
        if (fpwingestionargrupos.getForm().isValid())
        {
            var patron = /[a-zA-Z0-9áéíóúñüÑ]/;
            if (Ext.getCmp('dengrupo').getValue().match(patron))
            {
                var caden = 'adicionado';
                var mens = 'Guardando datos del grupo';
                if (estamod == 1) {
                    caden = 'modificado';
                    if (!validarModificacion())
                        return;
                }
                BarraProgresoGrupos.show(mens);
                var arrayElementos = getgestionarCheck(tpEntidades, ['tipo', 'dominio', 'padres'], ['tipo', 'dominio']);//genera arreglos de cambios
                var arrayGrupos = getgestionarCheck(tpGrupo, ['tipo', 'idusuario', 'idgrupo'], ['tipo', 'idusuario']);//genera arreglos de cambios			
                fpwingestionargrupos.getForm().submit({
                    url: url,
                    params: {
                        elementosinsertar: Ext.encode(arrayElementos.insertar),
                        elementoseliminar: Ext.encode(arrayElementos.eliminar),
                        gruposinsertar: Ext.encode(arrayGrupos.insertar),
                        personal: personal.getValue(),
                        gruposeliminar: Ext.encode(arrayGrupos.eliminar),
                        estamodificando: estamod
                    },
                    failure: function(form, action) {
                        BarraProgresoGrupos.hide();
                        if (action.result.resp == 1) {
                            if (smGpGrupos.hasSelection())
                                smGpGrupos.clearSelections();
                            mostrarMensaje(1, 'El grupo ha sido ' + caden + ' correctamente.', function()
                            {
                                stGpGrupaos.reload();
                                if (opcion == 'acp') {
                                    wingestionargrupos.destroy();
                                    SetEstadoBotonesTbarGrid();
                                }
                                if (opcion == 'apl')
                                {
                                    fpwingestionargrupos.getForm().reset();
                                    SetEstadoBotonesTbarGrid();
                                    tpEntidades.getRootNode().reload();
                                    tpGrupo.getRootNode().reload();
                                }
                                array_entidades_ini = [];
                                array_entidades_fin = [];
                                array_grupos_ini = [];
                                array_grupos_fin = [];
                            }
                            );
                        }
                        else
                        {
                            mostrarMensaje(3, 'Ya existe un grupo con esa denominaci&oacute;n.');
                        }
                    }
                });
            }
            else
                mostrarMensaje(3, 'Por favor verifique que la denominaci&oacute;n no tenga valores incorrectos.');
        }
        else
            mostrarMensaje(3, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');


    }



    /*
     funcion para confirmar la eliminacion de grupos
     */
    function ConfirmarEliminacion() {
        var mensaje = '';
        if (totalidgrupos.length > 1)
        {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar  los grupos seleccionados?';
        }
        else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar el grupo seleccionado)?';
        }
        mostrarMensaje(2, mensaje, EliminarGrupos);
    }


    /*
     funcion para eliminar grupos
     */
    function EliminarGrupos(btnEli) {
        if (btnEli == 'ok') {
            if (totalidgrupos.length > 1)
            {
                BarraProgresoGrupos.show('Eliminando grupos');
            }
            else {
                BarraProgresoGrupos.show('Eliminando grupo');
            }
            Ext.Ajax.request({
                url: 'eliminargrupo',
                method: 'POST',
                params: {
                    totalidgrupos: Ext.encode(totalidgrupos)
                },
                callback: function(options, success, response) {
                    BarraProgresoGrupos.hide();
                    responseData = Ext.decode(response.responseText);
                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    stGpGrupos.load();
                    smGpGrupos.clearSelections();
                    GpGrupos.getView().refresh(true);
                    SetEstadoBotonesTbarGrid();
                }
            });
        }
        else
        {
            if (smGpGrupos.hasSelection())
            {
                smGpGrupos.clearSelections();
                GpGrupos.getView().refresh(true);
            }
            SetEstadoBotonesTbarGrid();
        }
    }

    /*
     funcion para confirmar la suspension de un grupo
     */
    function ConfirmarDesactivacion() {
        var mensaje='';
        if (totalidgrupos.length > 1)
        {
            mensaje = ' ¿Est&aacute; seguro que quiere desactivar los grupos seleccionados?';
        }
        else {
            mensaje = ' ¿Est&aacute; seguro que quiere desactivar el grupo seleccionado)?';
        }
        mostrarMensaje(2, mensaje, DesactivarGrupos);
    }

    /*
     funcion para desactivar grupos
     */
    function DesactivarGrupos(btn)
    {
        if (btn == 'ok')
        {
            var mensajemask = 'Desactivando grupo';
            if (totalidgrupos.length > 1) {
                mensajemask = 'Desactivando grupos';
            }
            BarraProgresoGrupos.show(mensajemask);
            Ext.Ajax.request({
                url: 'suspendergrupo',
                params: {
                    totalidgrupos: Ext.encode(totalidgrupos)
                },
                callback: function(options, success, response) {
                    BarraProgresoGrupos.hide();
                    responseData = Ext.decode(response.responseText);
                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    stGpGrupos.load();
                    smGpGrupos.clearSelections();
                    SetEstadoBotonesTbarGrid();
                }
            });
        }
        else
        {
            if (smGpGrupos.hasSelection())
            {
                smGpGrupos.clearSelections();
                GpGrupos.getView().refresh(true);
            }
            SetEstadoBotonesTbarGrid();
        }
    }

    /* 
     funcion para confirmar la activacion de un grupo
     */
    function ConfirmarActivacion() {
        var mensaje = ' ¿Est&aacute; seguro que quiere activar el(los) grupo(s) seleccionado(s)?';
        mostrarMensaje(2, mensaje, ActivarGrupos);
    }

    /*
     funcion para activar un grupo
     */
    function ActivarGrupos(btn)
    {
        if (btn == 'ok')
        {
            var mensajemask = 'Activando grupo';
            if (totalidgrupos.length > 1) {
                mensajemask = 'Activando grupos';
            }
            BarraProgresoGrupos.show(mensajemask);
            Ext.Ajax.request({
                url: 'activargrupo',
                params: {
                    totalidgrupos: Ext.encode(totalidgrupos)
                },
                callback: function(options, success, response) {
                    BarraProgresoGrupos.hide();
                    responseData = Ext.decode(response.responseText);
                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    stGpGrupos.load();
                    smGpGrupos.clearSelections();
                    SetEstadoBotonesTbarGrid();
                }
            });
        }
        else
        {
            if (smGpGrupos.hasSelection())
            {
                smGpGrupos.clearSelections();
                GpGrupos.getView().refresh(true);
            }
            SetEstadoBotonesTbarGrid();
        }
    }


    /*
     funcion donde creo la ventana para cambiar el alias de los usuarios
     */
    function CreaVentanaCambiarAlias() {
        stGpAlias.removeAll();
        var titulogridalias = arrayrecords[0].data.dengrupo;
        GpAlias.setTitle(titulogridalias);
        stGpAlias.reload({
            params: {
                start: 0,
                limit: 15,
                idgrupo: arrayrecords[0].data.idgrupo
            },
            callback: function(r, options, success) {
                if (success)
                    winAlias.show();
            }
        });
    }

    function cambiosModificarAlias() {
        var bandera = true;
        var elementosAlias_fin = [];
        elementosAlias_fin = stGpAlias.getModifiedRecords();

        if (elementosAlias_fin.length == 0)
            bandera = false;
        else {

            for (var i = 0; i < elementosAlias_fin.length; i++)
            {
                var aliasusuarios;
                aliasusuarios = elementosAlias_fin[i].data.alias,
                        arrayalias_fin.push(aliasusuarios);
            }

            for (i = 0; i < arrayalias_ini.length; i++) {
                if (arrayalias_fin[i] == arrayalias_ini[i])
                    bandera = false;
                break;
            }
        }

        return bandera;
    }

    function ModificarAlias(opcion)
    {
        var records = GpAlias.getStore().getModifiedRecords();
        var recordsMod = [];
        var procede = 1;
        var patron = /[^a-zA-Z0-9áéíóúñüÑ ]/;
        for (var i = 0; i < records.length; i++)
        {
            if (records[i].data.alias.match(patron)) {
                procede = 0;
            } else {
                recordsMod.push({
                    idusuario: records[i].data.idusuario,
                    idgrupo: records[i].data.idgrupo,
                    alias: records[i].data.alias
                });
            }
        }
        if (procede == 1)
        {
            if (cambiosModificarAlias()) {
                BarraProgresoGrupos.show('Modificando alias');
                Ext.Ajax.request({
                    url: 'modificaralias',
                    params: {
                        arraycambios: Ext.encode(recordsMod)
                    },
                    callback: function(options, success, response) {
                        BarraProgresoGrupos.hide();
                        responseData = Ext.decode(response.responseText);
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        winAlias.hide();
                        stGpUsuarios.reload({
                            params: {
                                start: 0,
                                limit: 15,
                                idgrupo: arrayrecords[0].data.idgrupo
                            }
                        });
                    }
                });
            } else {
                mostrarMensaje(1, 'Usted no ha realizado modificaciones.');
            }
        } else {
            mostrarMensaje(3, 'Por favor verifique que los datos modificados no tengan valores incorrectos.');
        }
    }


    function BuscarGrupos() {
        var denom = Ext.getCmp('tfbdenom').getValue();
        if (!denom) {
            mostrarMensaje(3, "Introduzca un criterio de b&uacute;squeda.");
            return;
        }
        var act = cbActivo.getValue();
        stGpGrupos.reload({
            params: {
                denominacion: denom,
                activo: act
            },
            callback: function() {
                if (stGpGrupos.getTotalCount() == 0) {
                    mostrarMensaje(1, 'No existen grupos para el criterio de b&uacute;squeda definido.');
                    cbActivo.reset();
                    Ext.getCmp('tfbdenom').reset();
                    stGpGrupos.load();
                }
            }
        });
    }

    function enableWinGroup() {
        Ext.getCmp('btnCancelar').enable();
        Ext.getCmp('btnAceptar').enable();
    }

    function disableWinGroup() {
        Ext.getCmp('btnCancelar').disable();
        Ext.getCmp('btnAceptar').disable();
    }

    function CargarAyuda(opcion)
    {

        //var urlayuda = "../../../comun/templates/configuracion/ayudagrupo.html";
        var urlayuda = "../../../comun/templates/ayuda_usuario/ayuda.htm";
        window.open(urlayuda, "Ayuda", "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
    }
    //funcion para cambiarle el titulo al grid de nomencladores cuando filtre    
    this.changeTitlegrupo = function() {
        var filtrado_por = "";
        var sep = "/";
        if (_this.ftCmpgrupos.getFiltrosActivos() == undefined || _this.ftCmpgrupos.getFiltrosActivos().length == 0) {
            _this.panelCentral.setTitle('Registro de grupos de usuarios por rol');
        } else {
            for (i = 0; i < _this.ftCmpgrupos.getFiltrosActivos().length; i++) {
                var aux = "";
                if (_this.ftCmpgrupos.getFiltrosActivos()[i].dataIndex == "dengrupo") {
                    aux = 'Denominaci&oacute;n';
                }
                else {
                    aux = 'Activo';
                }
                if (i == _this.ftCmpgrupos.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            _this.panelCentral.setTitle('Registro de grupos de usuarios por rol <i>- Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    }

}

cargarInterfaz();
Ext.override(Ext.grid.RowSelectionModel, {
    deselectRow: function(index, preventViewNotify, event) {
        if (this.isLocked())
            return;
        if (this.last == index) {
            this.last = false;
        }
        if (this.lastActive == index) {
            this.lastActive = false;
        }
        var r = this.grid.store.getAt(index);
        if (r) {
            this.selections.remove(r);
            if (!preventViewNotify) {
                this.grid.getView().onRowDeselect(index);
            }
            this.fireEvent("rowdeselect", this, index, r);
            this.fireEvent("selectionchange", this, event);
        }
    },
    clearSelections: function(fast, event) {
        if (this.isLocked())
            return;
        if (fast !== true) {
            var ds = this.grid.store;
            var s = this.selections;
            s.each(function(r) {
                this.deselectRow(ds.indexOfId(r.id), false, event);
            }, this);
            s.clear();
        } else {
            this.selections.clear();
        }
        this.last = false;
    },
    selectAll: function(event) {
        if (this.isLocked())
            return;
        this.selections.clear();
        for (var i = 0, len = this.grid.store.getCount(); i < len; i++) {
            this.selectRow(i, true, false, event);
        }
    },
    selectRow: function(index, keepExisting, preventViewNotify, event) {
        if (this.isLocked() || (index < 0 || index >= this.grid.store.getCount()) || this.isSelected(index))
            return;
        var r = this.grid.store.getAt(index);
        if (r && this.fireEvent("beforerowselect", this, index, keepExisting, r) !== false) {
            if (!keepExisting || this.singleSelect) {
                this.clearSelections();
            }
            this.selections.add(r);
            this.last = this.lastActive = index;
            if (!preventViewNotify) {
                this.grid.getView().onRowSelect(index);
            }
            this.fireEvent("rowselect", this, index, r);
            this.fireEvent("selectionchange", this, event);
        }
    }
});
