Utilidades.Cmp.Cmpgestionarnomencladores = function (opcionesConfig) {
    var perfil = window.parent.UCID.portal.perfil;
    perfil.etiquetas = Object();
    var _this = this;
    Ext.QuickTips.init();
    //objeto del componente "barra de progreso"
    this.BarraProgresoNomencladores = new BarraEstado();
    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    /* funcion donde creo todos los elemtnos de la interfaz
     */
    //this.CargarCmpGestionarNom = function(idelemento, PostAccionesRelacionar) {
    Ext.Ajax.timeout = 1000000000;
    var start = 0;
    var vpNomencladores, nomInvolucrados,
        btnImprimir,
        btnAyuda,
        tpTipoNom, nomPlanificacion, nodosReportes,
        panelcentral,
        btnAdicionarNomenclador,
        btnModificarNomenclador,
        btnEliminarNomenclador,
        btnDesactivarNomenclador,
        btnActivarNomenclador,
        btnPublicarNomenclador,
        btnDespublicarNomenclador,
        gdNomenclador, smMostrarNomenclador, stNomenclador, cmNomenclador,
        tpPublicarEntidades,
        tpPublicidadUsuarios,
        tbPanelPublicar,
        panelPublicidad,
        panelUsuariosDominio;
    var wingestionarNom,
        btnGestionCancelar,
        btnGestionAceptar,
        btnGestionAplicar,
        fpGestionarNom,
        tfdenominacion,
        tpdatos,
        pdatgenerales,
        fechainicio,
        fechafin,
        tfcolor,
        tfalto,
        tfancho,
        btcolorcat,
        hedescripcion,
        panelRangoPublicidad,
        chpublicotodos,
        tpPublicidad,
        tpEntidadesSobre,
        tprangopublicidad;
    var aply = false;
    var publicartodos = false;
    var winpublicidad,
        wPublicarNomencladores,
        fppublicidad;
    //se repite panelRangoPublicidad

    //variables necesarias	
    var colorMenu,
        nametiponom,
        tiponom, // -1 si no hay tipo seleccionado, sino con un valor del 0 al 7
        idnom,
        idrowpadre = -1, // id del nom padre del nom seleccionado, vacio si no tiene
        selected = 'no', // = {idnom:'',denom:'',fdesde:'',fhasta:'',activo:'',superior:'',pub:'',pubtodos:'',color:'',descrip:'',_parent:'',_is_leaf:''},
        color = '#FFFFFF',
        modificando, //  false para adicionar, true para modificar
        adicionando,
        activar_desactivar,
        tabarbolact = 0,
        adicionarhijo, // si al adicionar un nomenclador es hijo de otro
        responseData,
        fechahoy,
        prevrow = -1, //indice del ultimo nomenclador superior seleccionado
        numloads = 0, //numero de llamadas recursivas de recargar el store de nomencladores, maximo 1
        fechas,
        datos_ini,
        datos_fin,
        array_publicidad_ini = [],
        array_publicidad_fin = [],
        denomnomenclador;
    var modificarInvol = true;

    this.mod = ({
        denominacion: false,
        descripcion: false,
        fechainicio: false,
        fechafin: false,
        color: false,
        alto: false,
        ancho: false,
        incidencia: false,
        inicial: false,
        publicarTodos: false
    });
    this.valoresiniform = ({
        denominacion: '',
        descripcion: '',
        fechainicio: null,
        fechafin: null,
        color: '',
        alto: '',
        ancho: '',
        incidencia: '',
        inicial: '',
        publicarTodos: ''
    });
    var colorMenu = new Ext.menu.ColorMenu({
        listeners: {
            select: function (p, c) {
                tfcolor.setValue(c);
                Ext.get('tfcolor').applyStyles('border:2px solid #' + c);
                if (modificando) {
                    (_this.valoresiniform.color != c) ? _this.mod.color = true : _this.mod.color = false;
                }
            }
        }
    });

    ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    function MostrarImagenActivo(valor) {
        if (valor == 0) {
            return '<center><span class="icondistra-jabber sipac-grisclaro"></span></center>';
        } else {
            return '<center><span class="icondistra-jabber sipac-amarilla"></span></center>';
        }
    }

//******************Elementos de la Interfaz Principal***************************

//botones de la barra de herramientas del panel central para la gestion de nomencladores	
    btnAdicionarNomenclador = new Ext.Button({
        iconCls: 'adicionar',
        id: "btnAdicionarNomenclador" + opcionesConfig.subsistemaLlamada,
        disabled: true,
        tooltip: 'Adicionar nomenclador',
        handler: function () {
            modificando = false;
            adicionarhijo = false;
            tabarbolact = 0;
            CrearVentanaGestionNom();
        },
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    btnModificarNomenclador = new Ext.Button({
        handler: function () {
            modificando = true;
            tabarbolact = 0;
            CrearVentanaGestionNom();
        },
        iconCls: 'modificar',
        id: "btnModificarNomenclador",
        disabled: true,
        tooltip: 'Modificar nomenclador',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    btnLimpiar = new Ext.Button({
        disabled: false,
        handler: function () {
            smMostrarNomenclador.clearSelections();
            _this.ftCmpnomencladores.clearFilters();
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    btnEliminarNomenclador = new Ext.Button({
        handler: function () {
            confirmarEliminar();
        },
        iconCls: 'eliminar',
        id: "btnEliminarNomenclador",
        disabled: true,
        tooltip: 'Eliminar nomenclador',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    btnActivarNomenclador = new Ext.Button({
        handler: function () {
            confirmarActivar();
        },
        iconCls: 'habilitar',
        id: "btnActivarNomenclador",
        disabled: true,
        tooltip: 'Activar nomenclador',
        key: {
            alt: true,
            key: 'X'
        },
        scope: this
    });
    btnDesactivarNomenclador = new Ext.Button({
        handler: function () {
            confirmarDesactivar();
        },
        iconCls: 'deshabilitar',
        id: "btnDesactivarNomenclador",
        disabled: true,
        tooltip: 'Desactivar nomenclador',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });
    btnImprimir = new Ext.Button({
        text: 'Imprimir',
        iconCls: 'imprimir',
        id: "btnImprimir"
    });
    btnAyuda = new Ext.Button({
        text: 'Ayuda',
        id: 'btnAyudaGestionarNomencladores',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    btnPublicarNomenclador = new Ext.Button({
        id: 'btnPublicarNomencl',
        disabled: true,
        iconCls: 'publicar',
        tooltip: 'Publicar todos los nomencladores',
        handler: function () {
            //publicartodos = true;
            CrearVentanaPublicarNomen();
        },
        key: {
            alt: true,
            key: 'Y'
        },
        scope: this
    });

    btnDespublicarNomenclador = new Ext.Button({
        id: 'btnDespublicartodos',
        iconCls: 'icondistra-publicar sipac-roja',
        disabled: true,
        tooltip: 'Despublicar todos los nomencladores',
        handler: function () {
            if (existenPublicaciones()) {
                confirmarDespublicar();
            } else {
                mostrarMensaje(1, 'No existen publicaciones.');
            }
        },
        key: {
            ctrl: true,
            key: 'Y'
        },
        scope: this
    });

    var _this = this;
    // Hijos de Root del Arbol "utilizados en la planificacion"
    if (opcionesConfig.tipoNomenDadoSubsistema == "proyecto") {
        nomPlanificacion = [
            {
                text: '<span class="icondistra-planilla sipac-azul"></span>' + 'Categor&iacute;a de proyecto',
                titulo: 'categor&iacute;a de proyecto',
                leaf: true,
                referencia: 'nomCategoriaproy',
                id: 14,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-asentar sipac-azul"></span>' + 'Categor&iacute;a de hito',
                titulo: 'categor&iacute;a de hito',
                leaf: true,
                referencia: 'nomCategoriahito',
                id: 15,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-tarea sipac-azul"></span>' + 'Categor&iacute;a de tarea',
                titulo: 'categor&iacute;a de tarea',
                leaf: true,
                referencia: '',
                id: 16,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-tarea sipac-azul"></span>' + 'Tipo de tarea',
                titulo: 'tipo de tarea',
                leaf: true,
                referencia: '',
                id: 17,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-usuario sipac-azul"></span>' + 'Tipo de vinculado',
                titulo: 'tipo de vinculado',
                leaf: true,
                referencia: '',
                id: 9,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-evaluar sipac-azul"></span>' + 'Criterio de evaluaci&oacute;n',
                titulo: 'Criterio de evaliaci&oacute;n',
                leaf: true,
                referencia: '',
                id: 18,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-prioridadcrm sipac-azul"></span>' + 'Prioridad del proyecto',
                titulo: 'Prioridad del proyecto',
                leaf: true,
                referencia: '',
                id: 19,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-recursos sipac-azul"></span>' + 'Recursos',
                titulo: 'recursos',
                leaf: true,
                referencia: '',
                id: 5,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-tablasporcategoria sipac-azul"></span>' + 'Tipo de d&iacute;as',
                titulo: 'tipo de días',
                leaf: true,
                referencia: '',
                id: 12,
                iconCls: 'imagen-none'
            }
        ];
    } else {
        nomPlanificacion = [
            {
                text: '<span class="icondistra-folder sipac-azul"></span>' + 'Categor&iacute;a del plan',
                titulo: 'categor&iacute;a del plan',
                leaf: true,
                referencia: 'nomCategoriaplan',
                id: '0',
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-actividades sipac-azul"></span>' + 'Categor&iacute;a de la actividad',
                titulo: 'categor&iacute;a de la actividad',
                leaf: true,
                referencia: 'nomCategoria',
                id: 2,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Categor&iacute;a del objetivo',
                titulo: 'categor&iacute;a del objetivo/hito',
                leaf: true,
                referencia: '',
                id: 11,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-actividades sipac-azul"></span>' + 'Tipo de actividad',
                titulo: 'tipo de actividad',
                leaf: true,
                referencia: '',
                id: 3,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-ficha sipac-azul"></span>' + 'Tipo de FIP',
                titulo: 'tipo de FIP',
                leaf: true,
                referencia: '',
                id: 4,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-ficha sipac-azul"></span>' + 'Nivel de acceso al FIP',
                titulo: 'nivel de acceso al FIP',
                leaf: true,
                referencia: '',
                id: 7,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-usuario sipac-azul"></span>' + 'Tipo de involucrado',
                titulo: 'tipo de involucrado',
                leaf: true,
                referencia: '',
                id: 9,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-recursos sipac-azul"></span>' + 'Recursos',
                titulo: 'recursos',
                leaf: true,
                referencia: '',
                id: 5,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-incidencia sipac-azul"></span>' + 'Tipo de incidencia',
                titulo: 'tipo de incidencia',
                leaf: true,
                referencia: '',
                id: 6,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-conflicto sipac-azul"></span>' + 'Tipo de desviaci&oacute;n',
                titulo: 'tipo de desviaci&oacute;n',
                leaf: true,
                referencia: '',
                id: 10,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-conflicto sipac-azul"></span>' + 'Criterio de evaluaci&oacute;n',
                titulo: 'criterio de evaluaci&oacute;n',
                leaf: true,
                referencia: '',
                id: 12,
                iconCls: 'imagen-none'
            }, {
                text: '<span class="icondistra-conflicto sipac-azul"></span>' + 'Tipo de documento',
                titulo: 'Tipo de documento',
                leaf: true,
                referencia: '',
                id: 13,
                iconCls: 'imagen-none'
            }
        ];
    }
    // Hijos de Root del Arbol "utilizados en los reportes"
    nodosReportes = [
        {
            text: '<span class="icondistra-documentos sipac-azul"></span>' + 'Tipo de hoja',
            titulo: 'tipo de hoja',
            leaf: true,
            referencia: '',
            id: 8,
            iconCls: 'imagen-none'
        }
    ];
    // Arbol de los Tipos de  Nomencladores	
    tpTipoNom = new Ext.tree.TreePanel({
        useArrows: true,
        id: 'tpTipoNom' + opcionesConfig.idsubsistema,
        width: 250,
        region: 'west',
        margins: '3 3 3 3',
        title: 'Nomencladores del sistema',
        autoScroll: true,
        loader: new Ext.tree.TreeLoader(),
        root: new Ext.tree.AsyncTreeNode({
            expanded: true,
            children: [
                {
                    id: 'up' + opcionesConfig.idsubsistema,
                    text: 'Utilizados en la planificaci&oacute;n',
                    expanded: true,
                    iconCls: 'up',
                    children: nomPlanificacion
                }, {
                    id: 'ur' + opcionesConfig.idsubsistema,
                    text: 'Utilizados en los reportes',
                    expanded: true,
                    iconCls: 'ur',
                    children: nodosReportes
                }
            ]
        }),
        rootVisible: false,
        listeners: {
            click: function (nodo) {
                if (nodo.id != 'up' && nodo.id != 'ur') {
                    tiponom = nodo.id;
                    nametiponom = nodo.attributes.titulo;
                    denomnomenclador = nodo.attributes.text;
                    On_TipoNomClick();
                }
            }
        }
    });
    var pNomencladores = new Ext.Panel({
        title: 'Nomencladores del sistema',
        layout: 'accordion',
        collapsible: true,
        width: 250,
        region: 'west',
        margins: '3 3 3 3',
        items: [tpTipoNom]
    });

    //Store del TreeGrid de Nomencladores
    stNomenclador = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/listarNomencladores',
        sortInfo: {
            field: "idnom",
            direction: "ASC"
        },
        reader: new Ext.data.JsonReader(
            {
                id: 'idnom',
                root: 'data',
                totalProperty: 'total'
            },
            [{//visibles
                name: 'denom'
            }, {
                name: 'fdesde'
            }, {
                name: 'fhasta'
            }, {
                name: 'pub'
            }, {
                name: 'activo'
            }, {//ocultos 
                name: 'superior'
            }, {
                name: 'color'
            }, {
                name: 'enuso'
            }, {
                name: 'ancho'
            }, {
                name: 'alto'
            }, {
                name: 'idnom'
            }, {
                name: 'descrip'
            }, {
                name: 'pubtodos'
            }, {
                name: '_parent'
            }, {
                name: 'idautor'
            }, {
                name: 'nombreautor'
            }, {
                name: '_is_leaf'
            }, {
                name: 'inicial'
            }, {
                name: 'incidencia'
            }]
        ),
        listeners: {
            beforeload: function (s) {
                if (prevrow >= 0) {
                    if (gdNomenclador.getView().getRow(prevrow) != undefined) {
                        Ext.get(gdNomenclador.getView().getRow(prevrow)).removeClass('superior2');
                        Ext.get(gdNomenclador.getView().getRow(prevrow)).addClass('superior');
                    }
                    prevrow = -1;
                }
                if (modificando || adicionarhijo || activar_desactivar) {
                    s.baseParams.idpadre = (smMostrarNomenclador.hasSelection()) ? smMostrarNomenclador.getSelected().data._parent : 0;
                    s.baseParams.anode = (smMostrarNomenclador.hasSelection()) ? smMostrarNomenclador.getSelected().data._parent : 0;
                } else {
                    s.baseParams.idpadre = (smMostrarNomenclador.hasSelection()) ? smMostrarNomenclador.getSelected().id : 0;
                    s.baseParams.anode = (smMostrarNomenclador.hasSelection()) ? smMostrarNomenclador.getSelected().id : 0;
                }
                s.baseParams.tiponom = tiponom;
                modificando = false;
                adicionarhijo = false;
                activar_desactivar = false;
            },
            load: function (st) {
                if (gdNomenclador.getStore().getCount() == 0) {
                    if (_this.ftCmpnomencladores.getFiltrosActivos() == undefined || _this.ftCmpnomencladores.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');
                    }
                    btnPublicarNomenclador.disable();
                    btnDespublicarNomenclador.disable();
                } else {
                    btnPublicarNomenclador.enable();
                }
                _this.changeTitlenomenclador();
            }
        }
    });
    //Selection Model del TreeGrid de Nomencladores
    smMostrarNomenclador = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, ri, record) {
                selected = record.data; //importante
                var arrayrecords = 0;
                arrayrecords = sm.getSelections();
                if (prevrow >= 0 && prevrow != ri) {
                    Ext.get(gdNomenclador.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(gdNomenclador.getView().getRow(prevrow)).addClass('superior');
                }
                if (selected.superior == 1) {
                    Ext.get(gdNomenclador.getView().getRow(ri)).removeClass('superior');
                    Ext.get(gdNomenclador.getView().getRow(ri)).addClass('superior2');
                    prevrow = ri;
                } else
                    prevrow = -1;
                idnom = selected.idnom;
                idrowpadre = (selected.idnom == selected._parent) ? "" : selected._parent;
                ActivarBotonesGestion();
                if (arrayrecords.length > 1) {
                    btnModificarNomenclador.disable();
                    btnEliminarNomenclador.disable();
                    btnActivarNomenclador.disable();
                    btnDesactivarNomenclador.disable();
		                btnDespublicarNomenclador.enable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                var arrayrecords = 0;
                arrayrecords = sm.getSelections();
                if (sm.getSelected() == undefined) {
                    idnom = "";
                    idrowpadre = "";
                }
                if (prevrow >= 0) {
                    if (gdNomenclador.getView().getRow(prevrow) != undefined) {
                        Ext.get(gdNomenclador.getView().getRow(prevrow)).removeClass('superior2');
                        Ext.get(gdNomenclador.getView().getRow(prevrow)).addClass('superior');
                    }
                    prevrow = -1;
                }
                ActivarBotonesGestion();
                if (arrayrecords.length > 1) {
                    btnModificarNomenclador.disable();
                    btnEliminarNomenclador.disable();
                    btnActivarNomenclador.disable();
                    btnDesactivarNomenclador.disable();
		                btnDespublicarNomenclador.enable();
                }
            }
        }
    });
    _this.paginadoNomencladores = new Ext.ux.maximgb.treegrid.PagingToolbar({
        id: "paginadoNomencladores",
        pageSize: 1000,
        store: stNomenclador,
        displayInfo: true
    });

    //plugins para los filtros del grid
    this.ftCmpnomencladores = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'denom'
        }, {
            type: 'list',
            dataIndex: 'pub',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'activo',
            options: ['Si', 'No']

        }, {
            type: 'date',
            dataIndex: 'fdesde'
        }, {
            type: 'date',
            dataIndex: 'fhasta'
        }, {
            type: 'string',
            dataIndex: 'nombreautor'
        }, {
            type: 'numeric',
            dataIndex: 'ancho'

        }, {
            type: 'numeric',
            dataIndex: 'alto'
        }]
    });
    //Column Model del TreeGrid Nomencladores
    cmNomenclador = [
        {
            id: 'expandir',
            header: "Denominaci&oacute;n",
            width: 100,
            sortable: true,
            dataIndex: 'denom'
        }, {
            header: "P&uacute;blico",
            width: 95,
            dataIndex: 'pub',
            sortable: true,
            renderer: MostrarImagenT
        }, {
            header: "Activo",
            width: 95,
            dataIndex: 'activo',
            sortable: true,
            renderer: MostrarImagenActivo
        }, {
            header: "Fecha de inicio",
            width: 85,
            dataIndex: 'fdesde',
            sortable: true
        }, {
            header: "Fecha de fin",
            width: 85,
            dataIndex: 'fhasta',
            sortable: true
        }, {
            header: "Autor",
            width: 120,
            dataIndex: 'nombreautor',
            sortable: true,
            renderer: function (val) {
                return val;
            }
        }, {
            hidden: true,
            id: 'columncolor',
            header: "Color",
            sortable: true,
            width: 80,
            dataIndex: 'color',
            renderer: function (val) {
                if (val != '')
                    return "<div style='height:15px;background-color:#" + val + "'></div>";
                return "";
            }
        }, {
            hidden: true,
            id: 'enuso',
            header: "En uso",
            sortable: true,
            width: 80,
            dataIndex: 'enuso',
            renderer: MostrarImagenT
        }, {
            hideable: false,
            hidden: true,
            dataIndex: 'idnom'
        }, {
            hideable: false,
            hidden: true,
            dataIndex: 'descrip'
        }, {
            hideable: false,
            hidden: true,
            dataIndex: 'pubtodos'
        }, {
            hideable: false,
            hidden: true,
            dataIndex: 'superior'
        }, {
            hidden: true,
            id: 'ancho',
            header: "Ancho",
            sortable: true,
            width: 80,
            dataIndex: 'ancho'
        }, {
            hidden: true,
            id: 'alto',
            header: "Alto",
            sortable: true,
            width: 80,
            dataIndex: 'alto'
        }, {
            hidden: true,
            header: "Inicial",
            width: 80,
            dataIndex: 'inicial',
            sortable: true,
            renderer: MostrarImagenT
        }, {
            hidden: true,
            header: "Incide",
            width: 80,
            dataIndex: 'incidencia',
            sortable: true,
            renderer: MostrarImagenT
        }
    ];
    //TreeGrid de Nomencladores
    gdNomenclador = new Ext.ux.maximgb.treegrid.GridPanel({
        id: 'gdNomenclador',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        plugins: _this.ftCmpnomencladores,
        store: stNomenclador,
        stripeRows: true,
        sm: smMostrarNomenclador,
        root_title: 'Nomenclador',
        loadMask: {
            msg: 'Cargando nomenclador'
        },
        columns: cmNomenclador,
        listeners: {
            rowdblclick: function () {
                modificando = true;
                tabarbolact = 0;
                if (btnModificarNomenclador.disabled == false) {
                    CrearVentanaGestionNom();
                }
            },
            rowcontextmenu: function (t, ri, e) {
                smMostrarNomenclador.selectRow(ri);
                var menunom = new Ext.menu.Menu({
                    id: 'menunom'
                });
                if (tiponom != 1 && tiponom != 6) {
                    menunom.addMenuItem({
                        id: 'adicionarMenuItem',
                        text: 'Adicionar nomenclador',
                        itemCls: 'x-menu-item icondistra-adicionar',
                        iconCls: 'imagen-none',
                        tooltip: 'Adicionar nomenclador hijo',
                        handler: function () {
                            modificando = false;
                            adicionarhijo = true;
                            CrearVentanaGestionNom();
                        }
                    });
                    menunom.addSeparator();
                }
                if (!selected.superior) {
                    menunom.addMenuItem({
                        id: 'modificarMenuItem',
                        text: 'Modificar nomenclador',
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        tooltip: 'Modificar nomenclador',
                        handler: function () {
                            modificando = true;
                            CrearVentanaGestionNom();
                        }
                    });
                    menunom.addMenuItem({
                        id: 'eliminarMenuItem',
                        text: 'Eliminar nomenclador',
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar nomenclador',
                        handler: function () {
                            modificando = true;
                            confirmarEliminar();
                        }
                    });
                    menunom.addMenuItem({
                        id: 'activarMenuItem',
                        text: ((selected.activo == 1) ? 'Desactivar' : 'Activar') + ' nomenclador',
                        itemCls: ((selected.activo == 1) ? 'x-menu-item icondistra-deshabilitar' : 'x-menu-item icondistra-habilitar'),
                        iconCls: 'imagen-none',
                        tooltip: ((selected.activo == 1) ? 'Desactivar' : 'Activar') + ' nomenclador',
                        handler: function () {
                            modificando = true;
                            if (selected.activo == 1)
                                confirmarDesactivar();
                            else
                                confirmarActivar();
                        }
                    });
                    if (smMostrarNomenclador.getSelections()[0].data.pub == 1) {
                        menunom.addMenuItem({
                            text: 'Despublicar nomenclador',
                            //itemCls: 'x-menu-item icondistra-ptr',
                            itemCls: 'x-menu-item icondistra-publicar sipac-roja',
                            iconCls: 'imagen-none',
                            tooltip: 'Despublicar nomenclador',
                            handler: function () {
                                despublicar();
                            }
                        });
                    } else {
                        menunom.addMenuItem({
                            text: 'Publicar nomenclador',
                            itemCls: 'x-menu-item icondistra-publicar',
                            iconCls: 'imagen-none',
                            tooltip: 'Publicar nomenclador',
                            handler: function () {
                                publicartodos = false;
                                CrearVentanaPublicarNomen();
                            }
                        });
                    }
                } else {
                    menunom.addMenuItem({
                        text: 'Editar publicidad del nomenclador',
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        tooltip: 'Editar publicidad del nomenclador',
                        handler: function () {
                            modificando = true;
                            CrearVentanaPublicidad()
                        }
                    });
                }
                if (smMostrarNomenclador.getSelections().length == 1) {
                    //mostrar menu
                    e.stopEvent();
                    var xy = e.getXY();
                    gdNomenclador.contextMenu = menunom;
                    gdNomenclador.contextMenu.showAt(xy);
                } else {
                    Ext.getCmp('adicionarMenuItem').disable();
                    Ext.getCmp('modificarMenuItem').disable();
                    Ext.getCmp('eliminarMenuItem').disable();
                    Ext.getCmp('activarMenuItem').disable();
                    //mostrar menu
                    e.stopEvent();
                    var xy = e.getXY();
                    gdNomenclador.contextMenu = menunom;
                    gdNomenclador.contextMenu.showAt(xy);
                }
            }
        },
        bbar: _this.paginadoNomencladores
    });
    gdNomenclador.getView().getRowClass = function (ri, n) {
        if (ri.data.superior)
            return "superior";
        else
            return "";
    };

//panel central donde visualizo el TreeGrid con los datos de los nomencladores	
    panelcentral = new Ext.Panel({
        title: 'Escoja un nomenclador para ver sus datos',
        id: 'panelcentral' + opcionesConfig.idsubsistema,
        layout: 'fit',
        region: 'center',
        tbar: [btnAdicionarNomenclador, ' ', btnModificarNomenclador, ' ', btnEliminarNomenclador, ' ',
            btnActivarNomenclador, ' ', btnDesactivarNomenclador, ' ', btnPublicarNomenclador, ' ',
            btnDespublicarNomenclador, ' ', btnLimpiar, '->', btnAyuda],
        usarKeymap: true,
        botonesKeymap: [btnAdicionarNomenclador, btnModificarNomenclador, btnEliminarNomenclador,
            btnActivarNomenclador, btnDesactivarNomenclador, btnPublicarNomenclador,
            btnDespublicarNomenclador, btnLimpiar, btnAyuda],
        items: gdNomenclador
    });

    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        closable: false,
        graggable: false,
        constrain: true,
        noTitle: true,
        maximized: true,
        modal: true,
        width: 1000,
        height: 510,
        items: [tpTipoNom, panelcentral]
    });

    //************************Elementos de Publicidad***************************
    function elementosPublicidad() {
        var _this = this;
        this.arr_tempNodos = [];
        //checkbox para definir si es publico pata todos mis grupos
        chpublicotodos = new Ext.form.Checkbox({
            id: 'publicotodos'
        });
        //arbol con el clasificador de involucrados
        this.tfbuscarInvPreCondicion2 = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 110,
                id: 'tfbuscarInvPreCondicion2',
                listeners: {
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBuscarinvolucrados.enable();
                            _this.btnLimpiarInvol.enable();
                        } else {
                            _this.btnBuscarinvolucrados.disable();
                            _this.btnLimpiarInvol.disable();
                            (tf.getValue() == '') ? tprangopublicidad.getRootNode().reload() : null;
                        }
                    },
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (tf.isValid() && tf.getValue() != '') {
                                _this.btnBuscarinvolucrados.handler();
                            }
                        }
                    },
                }
            });
        this.btnBuscarinvolucrados = new Ext.Button({
            handler: function () {
                if (_this.tfbuscarInvPreCondicion2.getValue() == '') {
                    tprangopublicidad.getRootNode().reload();
                } else {
                    tprangopublicidad.body.mask('Buscando involucrados', 'x-mask-loading');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/BuscarInvolucrados',
                        params: {
                            denominacion: _this.tfbuscarInvPreCondicion2.getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            var cont = 0;
                            var array = [];
                            for (var i = 0; i < responseData.data.length; i++) {
                                if (responseData.data[i] != null) {
                                    array[cont++] = responseData.data[i];
                                }
                            }
                            if (cont == 0) {
                                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            }
                            this.setChildren(array);
                            tprangopublicidad.body.unmask();
                        }
                    });
                }
            },
            iconCls: 'buscar',
            tooltip: 'Buscar involucrado(s)',
            disabled: true,
            key: {
                alt: true,
                key: 'B'
            },
            scope: this

        });
        this.btnLimpiarInvol = new Ext.Button({
            handler: function () {
                tprangopublicidad.getRootNode().reload();
                _this.tfbuscarInvPreCondicion2.reset();
                _this.btnBuscarinvolucrados.disable();
                _this.btnLimpiarInvol.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtros',
            disabled: true,
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });
        tprangopublicidad = new Ext.tree.TreePanel({
            id: 'tprangopublicidad',
            tbar: ['Buscar:', '', _this.tfbuscarInvPreCondicion2, '-',
                _this.btnBuscarinvolucrados, _this.btnLimpiarInvol, '-',
                {
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        tprangopublicidad.expandAll();
                    }
                }, {
                    iconCls: 'contraer',
                    tooltip: 'Contraer agrupación',
                    handler: function () {
                        tprangopublicidad.collapseAll();
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    handler: function () {
                        tprangopublicidad.getRootNode().reload();
                        tprangopublicidad.focus();
                    }
                }
            ],
            autoScroll: true,
            split: false,
            height: 50,
            useArrows: true,
            collapsible: false,
            root: {
                text: 'Clasificador de involucrados',
                expanded: true,
                id: 'root',
                children: [
                    {
                        nodeType: 'async',
                        id: 'nodo2',
                        idgrupo: 'nodo2',
                        text: 'Mis grupos',
                        leaf: false,
                        checked: false
                    }, {
                        nodeType: 'async',
                        id: 'nodo3',
                        idgrupo: 'nodo3',
                        text: 'Usuarios subordinados',
                        leaf: false,
                        checked: false
                    }, {
                        nodeType: 'async',
                        id: 'nodo5',
                        idgrupo: 'nodo5',
                        text: 'Estructuras',
                        leaf: false,
                        checked: false
                    }
                ]
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (tprangopublicidad.getChecked().length > 0) {
                        if (nodo.id == 'nodo3') {
                            tprangopublicidad.getRootNode().findChild('id', 'nodo3').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                        if (nodo.id == 'nodo2') {
                            tprangopublicidad.getRootNode().findChild('id', 'nodo2').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                        if (nodo.id == 'nodo5') {
                            tprangopublicidad.getRootNode().findChild('id', 'nodo5').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                    }
                    modificarInvol = compararArray(array_publicidad_ini, tprangopublicidad.getChecked());
                }
            },
            loader: new Ext.tree.TreeLoader({
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarRangoPublicidad',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        disableWinNom();
                        if (modificando && selected != 'no') {
                            atreeloader.baseParams = {
                                estamodificando: 1,
                                idgrupo: anode.attributes.idgrupo,
                                idnom: selected.idnom
                            };
                        } else
                            atreeloader.baseParams = {
                                estamodificando: 0,
                                idgrupo: anode.attributes.idgrupo
                            };
                    },
                    'load': function (atreeloader, anode) {
                        enableWinNom();
                        array_publicidad_ini = tprangopublicidad.getChecked();
                    }
                }
            })
        });

        this.setChildren = function (childrenNodos) {
            _this.newRootChild = childrenNodos;
            tprangopublicidad.root.eachChild(function (n) {
                if (n.isExpanded())
                    n.collapse(true, false);
                if (n.ui.ctNode.offsetHeight < 3) {
                    if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                        _this.arr_tempNodos.push(n);
                    n.ui.hide();
                }
            });
            tprangopublicidad.root.appendChild(_this.newRootChild);
            tprangopublicidad.render();
            tprangopublicidad.root.eachChild(function (n) {
            })
        };

        setLogicaArbolCheck(tprangopublicidad, chpublicotodos);
        tpEntidadesSobre = new Ext.tree.TreePanel({
            autoScroll: true,
            region: 'center',
            useArrows: true,
            root: {
                nodeType: 'async',
                id: 'nodo3',
                expanded: true,
                text: 'Estructuras',
                leaf: false
            },
            listeners: {
                'checkchange': function (node, ch) {
                    Ext.getCmp('aceptar').disable();
                    if (ch) {
                        chequeadopermisos++;
                    } else {
                        chequeadopermisos--;
                    }
                    if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                        Ext.getCmp('aceptar').enable();
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpasignarentidades/cargarArbolRelacionesAutor',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                    },
                    'load': function (atreeloader, anode) {
                        if (!anode.hasChildNodes()) {
                            mostrarMensaje(1, 'Usted no tiene asociaciones usuario/estructura configuradas.');
                        }
                    }
                }
            })
        });
        //panel que muestra los datos del rango de publicidad 
        panelRangoPublicidad = new Ext.Panel({
            title: 'Usuarios',
            id: 'panelRangoPublicidad',
            layout: 'fit',
            autoScroll: true,
            height: 300,
            region: 'center',
            items: [tprangopublicidad],
            listeners: {
                activate: function (p) {
                    if (modificando && tabarbolact == 0) {
                        tprangopublicidad.getRootNode().findChild('id', 'nodo2').expand();
                        tprangopublicidad.getRootNode().findChild('id', 'nodo3').expand();
                        tprangopublicidad.getRootNode().findChild('id', 'nodo5').expand();
                    }
                }
            }
        });
        tpPublicidad = new Ext.TabPanel({
            title: 'Rango de publicidad',
            activeTab: 0,
            border: false,
            items: panelRangoPublicidad,
            usarKeymap: true,
            botonesKeymap: [_this.btnBuscarinvolucrados, _this.btnLimpiarInvol]
        });
    }

    function CrearVentanaPublicarNomen() {
        tpPublicidadUsuarios = new Ext.tree.TreePanel({
            id: 'tpPublicidadUsuarios',
            autoScroll: true,
            split: false,
            useArrows: true,
            collapsible: false,
            root: {
                text: 'Clasificador de involucrados',
                expanded: true,
                id: 'root',
                children: [
                    {
                        nodeType: 'async',
                        id: 'nodo2',
                        idgrupo: 'nodo2',
                        text: 'Mis grupos',
                        leaf: false,
                        checked: false
                    }, {
                        nodeType: 'async',
                        id: 'nodo3',
                        idgrupo: 'nodo3',
                        text: 'Usuarios subordinados',
                        leaf: false,
                        checked: false
                    }, {
                        nodeType: 'async',
                        id: 'nodo5',
                        idgrupo: 'nodo5',
                        text: 'Estructuras',
                        leaf: false,
                        checked: false
                    }
                ]
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (tpPublicidadUsuarios.getChecked().length > 0) {
                        Ext.getCmp('publinomen').enable();
                        if (nodo.id == 'nodo3') {
                            nodo.eachChild(function (n) {
                                n.getUI().toggleCheck(check);
                            });
                        }
                        if (nodo.id == 'nodo2') {
                            nodo.eachChild(function (n) {
                                n.getUI().toggleCheck(check);
                            });
                        }
                        if (nodo.id == 'nodo5') {
                            nodo.eachChild(function (n) {
                                n.getUI().toggleCheck(check);
                            });
                        }
                    } else {
                        Ext.getCmp('publinomen').disable();
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarRangoPublicidad',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            estamodificando: 0,
                            idgrupo: anode.attributes.idgrupo,
                            idnom: selected.idnom
                        };
                    },
                    'load': function (atreeloader, nodo) {
                        array_publicidad_ini = tpPublicidadUsuarios.getChecked();
                        if ((nodo.id == 'nodo3' || nodo.id == 'nodo2' || nodo.id == 'nodo5') && nodo.attributes.checked) {
                            nodo.eachChild(function (n) {
                                n.getUI().toggleCheck(true);
                            });
                        }
                    }
                }
            })
        });
        tpPublicarEntidades = new Ext.tree.TreePanel({
            title: 'Estructuras',
            autoScroll: true,
            region: 'center',
            height: 370,
            root: {
                nodeType: 'async',
                id: 'nodoo',
                expanded: true,
                text: 'Estructuras',
                leaf: false
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpasignarentidades/cargarArbolRelacionesAutor',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                    },
                    'load': function (atreeloader, anode) {
                        if (!anode.hasChildNodes()) {
                            mostrarMensaje(1, 'Usted no tiene asociaciones usuario/estructura configuradas.');
                        }
                    }
                }
            })
        });
        panelPublicidad = new Ext.Panel({
            title: 'Usuarios',
            id: 'panelPublicidad',
            layout: 'fit',
            autoScroll: true,
            height: 300,
            region: 'center',
            items: tpPublicidadUsuarios
        });
        tbPanelPublicar = new Ext.TabPanel({
            title: 'Rango de publicidad',
            activeTab: 0,
            border: false,
            items: panelPublicidad
        });
        wPublicarNomencladores = new Ext.Window({
            title: 'Publicar ' + nametiponom,
            width: 345,
            modal: true,
            layout: 'fit',
            constrain: true,
            items: tbPanelPublicar,
            buttons: [
                new Ext.Button({
                    id: 'cancelarpubl',
                    nextTab: 'publinomen',
                    prevTab: 'publinomen',
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        wPublicarNomencladores.destroy();
                    }
                }),
                new Ext.Button({
                    id: 'publinomen',
                    nextTab: 'cancelarpubl',
                    prevTab: 'cancelarpubl',
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    disabled: true,
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        if (publicartodos) {
                            publicarTodos();
                        } else
                            publicar();
                    }
                })
            ]
        });
        wPublicarNomencladores.show();
        setTimeout(function () {
            Ext.getCmp('cancelarpubl').focus(true);
        }, 500);
    }

    function publicar() {
        var arrayrecords;
        var array_idnom = [];
        arrayrecords = smMostrarNomenclador.getSelections();
        if (arrayrecords.length == 1){
		        array_idnom.push(arrayrecords[0].data.idnom);
        }
        else if(arrayrecords.length > 1){
		        for (var i = 0; i < arrayrecords.length; i++) {
				        array_idnom.push(arrayrecords[i].data.idnom);
		        }
        }
        else if(arrayrecords.length == 0){
            var items=stNomenclador.data.items;
            for (var i = 0; i < items.length; i++) {
                array_idnom.push(items[i].data.idnom);
            }
        }


        var arrayPublicidadUsuario = getgestionarCheck(tpPublicidadUsuarios, ['idusuario', 'idgrupo', 'tipo']);
        var arrayPublicidadEntidad = getgestionarCheck(tpPublicarEntidades, ['idusuario', 'idgrupo', 'tipo']);
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/PublicarTodosNomenclador',
            params: {
                arrayidnomencl: Ext.encode(array_idnom),
                arrayidusuarios: Ext.encode(arrayPublicidadUsuario.insertar),
                arrayidentidades: Ext.encode(arrayPublicidadEntidad.insertar)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                array_publicidad_ini = [];
                array_publicidad_fin = [];
                if (responseData.mensaje == 1) {
                    if (arrayrecords.length == 1) {
                        mostrarMensaje(1, 'El nomenclador ha sido publicado satisfactoriamente.');
                    } else {
                        mostrarMensaje(1, 'Los nomencladores han sido publicados satisfactoriamente.');
                    }
                    recargarGrid();
                    wPublicarNomencladores.destroy();
                    smMostrarNomenclador.clearSelections();
                }
            }
        });
    }

    function despublicar() {
        var arrayrecords;
        arrayrecords = smMostrarNomenclador.getSelections();
        if (arrayrecords.length == 1) {
            var mensaje = '&iquest;Est&aacute; seguro que quiere eliminar la publicación?';
        } else {
            var mensaje = '&iquest;Est&aacute; seguro que quiere eliminar las publicaciones?';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var array_idnom = [];
                if (arrayrecords.length > 1) {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        array_idnom.push(arrayrecords[i].data.idnom);
                    }
                } else {
                    array_idnom.push(arrayrecords[0].data.idnom);
                }
                Ext.Ajax.request({
                    url:  '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/DespublicarTodosNomenclador',
                    params: {
                        arrayidnomencl: Ext.encode(array_idnom)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgresoNomencladores.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            if (arrayrecords.length == 1) {
                                var mje = 'La publicación ha sido eliminada satisfactoriamente.';
                            } else {
                                var mje = 'Las publicaciones han sido eliminadas satisfactoriamente.';
                            }
                            mostrarMensaje(1, mje);
                            recargarGrid();
                        } else if (responseData.mensaje == 3)
                            mostrarMensaje(1, 'La publicación que usted quiere eliminar ya no se encuentra en los registros.');
                        recargarGrid();
                    }
                });
            }
        });
    }

    function publicarTodos() {
        var array_idnom = [];
        if (stNomenclador.getCount() != 0) {
            for (var i = 0; i < stNomenclador.getCount(); i++) {
                array_idnom.push(stNomenclador.getAt(i).data.idnom);
            }
        }
        var arrayPublicidadUsuario = getgestionarCheck(tpPublicidadUsuarios, ['idusuario', 'idgrupo', 'tipo']);
        var arrayPublicidadEntidad = getgestionarCheck(tpPublicarEntidades, ['idusuario', 'idgrupo', 'tipo']);
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/PublicarTodosNomenclador',
            params: {
                arrayidnomencl: Ext.encode(array_idnom),
                arrayidusuarios: Ext.encode(arrayPublicidadUsuario.insertar),
                arrayidentidades: Ext.encode(arrayPublicidadEntidad.insertar),
                publicartodos: publicartodos
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                array_publicidad_ini = [];
                array_publicidad_fin = [];
                if (responseData.mensaje == 1) {
                    mostrarMensaje(1, 'Los nomencladores han sido publicados satisfactoriamente.');
                    recargarGrid();
                    wPublicarNomencladores.destroy();
                }
            }
        });
    }

    function despublicarTodos(btn) {
        if (btn == 'ok') {
            _this.BarraProgresoNomencladores.show('Eliminando publicaciones');
            var array_idnom = [];
            // if (stNomenclador.getCount() != 0) {
            //     for (var i = 0; i < stNomenclador.getCount(); i++) {
            //         if (stNomenclador.getAt(i).data.pub == 1) {
            //             array_idnom.push(stNomenclador.getAt(i).data.idnom);
            //         }
            //     }
            // }

            if (smMostrarNomenclador.hasSelection()) {
                for (var i = 0; i < smMostrarNomenclador.getSelections().length; i++) {
                    if (smMostrarNomenclador.getSelections()[i].data.pub == 1) {
                        array_idnom.push(smMostrarNomenclador.getSelections()[i].data.idnom);
                    }
                }
            }
            if (array_idnom.length != 0) {
                Ext.Ajax.request({
                    url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/DespublicarTodosNomenclador',
                    params: {
                        arrayidnomencl: Ext.encode(array_idnom)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgresoNomencladores.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'Las publicaciónes han sido eliminadas satisfactoriamente.');
                            recargarGrid();
                        } else if (responseData.mensaje == 3)
                            mostrarMensaje(1, 'La publicación que usted quiere eliminar ya no se encuentra en los registros.');
                        recargarGrid();
                    }
                });
            } else {
                _this.BarraProgresoNomencladores.hide();
                mostrarMensaje(1, 'El usuario autenticado no posee permisos para despublicar los nomencladores seleccionado.');
            }
        }
    }

    function existenPublicaciones() {
        var existePublicacion = false;
        if (stNomenclador.getCount() != 0) {
            for (var i = 0; i < stNomenclador.getCount(); i++) {
                if (stNomenclador.getAt(i).data.pub == 1) {
                    existePublicacion = true;
                    break;
                }
            }
        }
        return existePublicacion;
    }

    //*****************Elementos de la Ventana Gestionar Nomenclador*****************
    function elementosGestionar() {
        //botones de la ventana gestionar nomenclador
        btnGestionCancelar = new Ext.Button({
            handler: function () {
                wingestionarNom.destroy();
                smMostrarNomenclador.clearSelections();
                array_publicidad_ini = [];
                array_publicidad_fin = [];
                recargarGrid();
            },
            id: 'btnGestionCancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            iconCls: 'cancelar'
        });
        function gestionAceptar() {
            datos_fin = fpGestionarNom.getForm().getValues(true);
            array_publicidad_fin = tprangopublicidad.getChecked();
            if (datos_fin === datos_ini && array_publicidad_ini.toString() === array_publicidad_fin.toString())
                mostrarMensaje(1, 'Usted no ha realizado modificaciones.');
            else
                GestionarNomenclador();
        }

        btnGestionAceptar = new Ext.Button({
            handler: function () {
                gestionAceptar();
                aply = false;
            },
            id: 'btnGestionAceptar',
            text: 'Aceptar ',
            nextTab: 'denominacion',
            iconCls: 'aceptar ',
            cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
            tooltip: 'Guardar datos y cerrar ventana'
        });
        btnGestionAplicar = new Ext.Button({
            handler: function () {
                gestionAceptar();
                aply = true;
            },
            id: 'btnGestionAplicar',
            text: 'Aplicar',
            iconCls: 'aplicar',
            cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
            tooltip: 'Guardar datos y limpiar los campos'
        });
        //campo para la denominacion  del nomenclador
        tfdenominacion = new Ext.form.TextField({
            id: 'denominacion',
            fieldLabel: 'Denominaci&oacute;n',
            name: 'denominacion',
            allowBlank: false,
            maxLength: 255,
            prevTab: 'btnGestionAceptar',
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            regex: ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            anchor: '100%',
            listeners: {
                'render': function (c) {
                    if (modificando) {
                        c.getEl().on('keyup', function () {
                            (_this.valoresiniform.denominacion !== c.getValue().toString()) ? _this.mod.denominacion = true : _this.mod.denominacion = false;
                        }, c);
                    }
                }
            }
        });

        //campo para la descripcion del nomenclador
        hedescripcion = new Ext.form.HtmlEditor({
            id: 'descripcion',
            title: 'Descripcion',
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            width: 510,
            height: 160,
            buttonTips: {
                bold: {
                    title: 'Negrita (Ctrl+B)',
                    text: 'Aplica el formato de negrita al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                italic: {
                    title: 'Cursiva (Ctrl+I)',
                    text: 'Aplica el formato de cursiva al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                underline: {
                    title: 'Subrayado (Ctrl+U)',
                    text: 'Subraya el texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                increasefontsize: {
                    title: 'Agrandar fuente',
                    text: 'Aumenta el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                decreasefontsize: {
                    title: 'Encoger fuente',
                    text: 'Reduce el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                backcolor: {
                    title: 'Color de resaltado del texto',
                    text: 'Cambia el aspecto del texto como si estuviera marcado con un marcador.',
                    cls: 'x-html-editor-tip'
                },
                forecolor: {
                    title: 'Color de fuente',
                    text: 'Cambia el color del texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyleft: {
                    title: 'Alinear texto a la izquierda',
                    text: 'Alinea el texto a la izquierda.',
                    cls: 'x-html-editor-tip'
                },
                justifycenter: {
                    title: 'Centrar',
                    text: 'Centrar el texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyright: {
                    title: 'Alinear texto a la derecha',
                    text: 'Alinea el texto a la derecha.',
                    cls: 'x-html-editor-tip'
                },
                insertunorderedlist: {
                    title: 'Viñetas',
                    text: 'Inicia una lista con viñetas.',
                    cls: 'x-html-editor-tip'
                },
                insertorderedlist: {
                    title: 'Numeración',
                    text: 'Inicia una lista numerada.',
                    cls: 'x-html-editor-tip'
                },
                createlink: {
                    title: 'Hipervínculo',
                    text: 'Hace del texto seleccionado un hipervínculo.',
                    cls: 'x-html-editor-tip'
                },
                sourceedit: {
                    title: 'Edición de código',
                    text: 'Cambia al modo de edición de código.',
                    cls: 'x-html-editor-tip'
                }
            },
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                },
                sync: function (editor, html) {
                    if (modificando) {
                        if (_this.valoresiniform.descripcion == '' || _this.valoresiniform.descripcion == '&nbsp;' || _this.valoresiniform.descripcion == '&nbsp;<br>' || _this.valoresiniform.descripcion == '<br>') {
                            if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>')
                                _this.mod.descripcion = false;
                            else
                                _this.mod.descripcion = true;
                        } else if (_this.valoresiniform.descripcion != html)
                            _this.mod.descripcion = true;
                        else
                            _this.mod.descripcion = false;
                    }
                }
            },
        });
        //fechas = crearFechasLigadas();
        fechaInicio = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            format: 'd/m/Y',
            name: 'fechainicio',
            id: 'fechainicio',
            value: new Date().format('d/m/Y'),
            anchor: '90%',
            endDateField: 'fechafin',
            allowBlank: false,
            readOnly: false,
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            vtype: 'daterange',
            listeners: {
                'render': function (c) {
                    if (modificando) {
                        c.getEl().on('keyup', function () {
                            if (fechaInicio.isValid()) {
                                if (_this.valoresiniform.fechainicio !== c.getValue().format('d/m/Y')) {
                                    _this.mod.fechainicio = true;
                                } else {
                                    _this.mod.fechainicio = false;
                                }
                            }
                        }, c);
                    }
                }
            },
            menuListeners: {
                select: function (df, date) {
                    fechaInicio.setValue(date);
                    fechaFin.setMinValue(date);
                    if (date > fechaFin.getValue()) {
                        fechaFin.setValue(date);
                    }
                    fechaInicio.setMaxValue(fechaFin.getValue());
                    if (modificando) {
                        (_this.valoresiniform.fechainicio != date.format('d/m/Y')) ? _this.mod.fechainicio = true : _this.mod.fechainicio = false;
                    }
                }
            }
        });
        fechaFin = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            disabled: false,
            format: 'd/m/Y',
            name: 'fechafin',
            startDateField: 'fechainicio',
            id: 'fechafin',
            anchor: '90%',
            readOnly: false,
            minText: 'La fecha de fin tiene que ser posterior o igual a la fecha inicio.',
            vtype: 'daterange',
            listeners: {
                'render': function (c) {
                    if (modificando) {
                        c.getEl().on('keyup', function () {
                            if (fechaFin.isValid()) {
                                if (fechaFin.getValue() != '') {
                                    if (_this.valoresiniform.fechafin !== c.getValue().format('d/m/Y')) {
                                        _this.mod.fechafin = true;
                                    } else {
                                        _this.mod.fechafin = false;
                                    }
                                } else if (_this.valoresiniform.fechafin != c.getValue()) {
                                    _this.mod.fechafin = true;
                                } else {
                                    _this.mod.fechafin = false;
                                }
                            }
                        }, c);
                    }
                }
            },
            menuListeners: {
                select: function (df, date) {
                    fechaFin.setValue(date);
                    fechaInicio.setMaxValue(date);
                    if (date < fechaInicio.getValue()) {
                        fechaInicio.setValue(date);
                    }
                    this.setMinValue(fechaInicio.getValue());
                    if (modificando) {
                        (_this.valoresiniform.fechafin != date.format('d/m/Y')) ? _this.mod.fechafin = true : _this.mod.fechafin = false;
                    }
                }
            }
        });

        //creo el campo color si el tipo es Categoria de la Actividad
        tfcolor = new Ext.form.TextField({
            id: 'tfcolor',
            fieldLabel: 'Color',
            hidden: true,
            hideLabel: true,
            name: 'tfcolor',
            anchor: '90%',
            readOnly: true,
            listeners: {
                'render': function (c) {
                    if (modificando) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.color !== c.getValue().toString()) {
                                _this.mod.color = true;
                            } else {
                                _this.mod.color = false;
                            }
                        }, c);
                    }
                }
            }
        });
        chInicial = new Ext.form.Checkbox({
            boxLabel: 'Inicial',
            id: 'inicial',
            checked: false,
            hidden: true,
            listeners: {
                check: function (check, checked) {
                    if (modificando) {
                        var checkprinciplal = '0';
                        if (checked) {
                            var checkprinciplal = '1';
                        }
                        if (_this.valoresiniform.inicial != checkprinciplal) {
                            _this.mod.inicial = true;
                        } else {
                            _this.mod.inicial = false;
                        }
                    }
                }
            }
        });
        chIncidencia = new Ext.form.Checkbox({
            boxLabel: 'Incide',
            id: 'incidencia',
            checked: false,
            hidden: true,
            listeners: {
                check: function (check, checked) {
                    if (modificando) {
                        var checkprinciplal = '0';
                        if (checked) {
                            var checkprinciplal = '1';
                        }
                        if (_this.valoresiniform.incidencia != checkprinciplal) {
                            _this.mod.incidencia = true;
                        } else {
                            _this.mod.incidencia = false;
                        }
                    }
                }
            }
        });
        //boton para mostrar el color seleccionado
        btcolorcat = new Ext.Button({
            id: 'btcolorcat',
            hidden: true,
            icon: perfil.dirImg + 'paletacolor.png',
            iconCls: 'btn',
            listeners: {
                click: function (b, e) {
                    e.stopEvent();
                    var xy = e.getXY();
                    colorMenu.showAt(xy);
                }
            }
        });
        //creo el campo alto si el tipo es Tipo de Hoja
        tfalto = new Ext.form.NumberField({
            id: 'tfalto',
            fieldLabel: 'Alto',
            hidden: true,
            hideLabel: true,
            name: 'tfalto',
            decimalPrecision: 2,
            maxValue: 99.99,
            //regex: /[{2}0-9{2}].{2}[0-9]/,  //No es necesario
            allowBlank: false,
            regexText: 'Solo admite números enteros de 2 dígitos. Con 2 cifras decimales.',
            anchor: '85%',
            listeners: {
                'render': function (c) {
                    if (modificando) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.alto != c.getValue().toString()) {
                                _this.mod.alto = true;
                            } else {
                                _this.mod.alto = false;
                            }
                        }, c);
                    }
                }
            }
        });
        //creo el campo ancho si el tipo es Tipo de Hoja
        tfancho = new Ext.form.NumberField({
            id: 'tfancho',
            fieldLabel: 'Ancho',
            hidden: true,
            hideLabel: true,
            name: 'tfancho',
            decimalPrecision: 2,
            maxValue: 99.99,
            //regex: /[{2}0-9{2}].{2}[0-9]/, //No es necesario
            allowBlank: false,
            regexText: 'Solo admite números enteros de 2 dígitos. Con 2 cifras decimales.',
            anchor: '85%',
            x: 1000,
            y: 1000,
            listeners: {
                'render': function (c) {
                    if (modificando) {
                        c.getEl().on('keyup', function () {
                            if (_this.valoresiniform.ancho != c.getValue().toString()) {
                                _this.mod.ancho = true;
                            } else {
                                _this.mod.ancho = false;
                            }
                        }, c);
                    }
                }
            }
        });
        pdatgenerales = new Ext.Panel({
            activeTab: 0,
            title: 'Datos generales',
            frame: true,
            items: [
                {
                    layout: 'column',
                    frame: false,
                    items: [
                        {
                            columnWidth: .25,
                            layout: 'form',
                            border: false,
                            items: [fechaInicio]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            border: false,
                            items: [fechaFin]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            border: false,
                            items: [{
                                layout: 'column',
                                items: [
                                    {
                                        columnWidth: .5,
                                        layout: 'form',
                                        id: 'tfanchop',
                                        items: [tfancho]
                                    }, {
                                        columnWidth: .5,
                                        layout: 'form',
                                        id: 'tfaltop',
                                        items: [tfalto]
                                    }, {
                                        columnWidth: .35,
                                        layout: 'form',
                                        id: 'tfcolorp',
                                        items: [tfcolor]
                                    }, {
                                        columnWidth: .15,
                                        id: 'btcolorcatp',
                                        layout: 'form',
                                        bodyStyle: 'padding-top:20px;',
                                        items: [btcolorcat]
                                    }, {
                                        columnWidth: .4,
                                        id: 'checkini',
                                        layout: 'form',
                                        items: [chInicial]
                                    }, {
                                        columnWidth: .4,
                                        id: 'checkincid',
                                        layout: 'form',
                                        items: [chIncidencia]
                                    }
                                ]
                            }]
                        }
                    ]
                }, {
                    layout: 'form',
                    frame: false,
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            border: false,
                            items: [hedescripcion]
                        }
                    ]
                }
            ]
        });
        panelUsuariosDominio = _this.objclasificadorinvol.crearPanelUsuariosRecurso();

        //tabpanel donde defino Rango de Publicidad y descripcion de una Actividad
        tpdatos = new Ext.TabPanel({
            height: 270,
            activeTab: 0,
            id: 'tpdatos',
            frame: true,
            items: [pdatgenerales, tpPublicidad/*, panelUsuariosDominio*/],
            listeners: {
            }
        });
        //formulario con los datos generales
        fpGestionarNom = new Ext.FormPanel({
            frame: true,
            id: 'fpDatosGenerales',
            labelAlign: 'top',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [tfdenominacion]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [tpdatos]
                        }
                    ]
                }],
            listeners: {
                render: function (f) {
                    chInicial.hideLabel = true;
                    chIncidencia.hideLabel = true;
                    tfalto.allowBlank = true;
                    tfancho.allowBlank = true;
                    if (tiponom == 2) {
                        tfcolor.show();
                        tfcolor.hideLabel = false;
                        btcolorcat.show();
                        Ext.getCmp('tfaltop').hide();
                        Ext.getCmp('tfanchop').hide();
                        chInicial.hide();
                        chIncidencia.hide();
                        chInicial.hideLabel = true;
                        chIncidencia.hideLabel = true
                    }
                    if (tiponom == 8) {
                        tfalto.hideLabel = false;
                        tfalto.show();
                        tfancho.hideLabel = false;
                        tfancho.show();
                        tfcolor.hide();
                        btcolorcat.hide();
                        chInicial.hide();
                        chIncidencia.hide();
                        tfalto.allowBlank = false;
                        tfancho.allowBlank = false;
                        chInicial.hideLabel = true;
                        chIncidencia.hideLabel = true
                    }
                    if (tiponom == 9) {
                        tfalto.hideLabel = true;
                        tfancho.hideLabel = true;
                        Ext.getCmp('tfaltop').hide();
                        Ext.getCmp('tfanchop').hide();
                        tfcolor.hide();
                        btcolorcat.hide();
                        chInicial.hideLabel = true;
                        chIncidencia.hideLabel = true;
                        chInicial.show();
                        chIncidencia.show();
                    }
                    if (tiponom == 12) {
                        tfcolor.show();
                        tfcolor.hideLabel = false;
                        btcolorcat.show();
                        Ext.getCmp('tfaltop').hide();
                        Ext.getCmp('tfanchop').hide();
                        chInicial.hide();
                        chInicial.hideLabel = true;
                        chIncidencia.hideLabel = true;
                        chIncidencia.checked = false;
                        chIncidencia.show();
                    }
                },
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        btnGestionAceptar.enable();
                    } else {
                        btnGestionAceptar.disable();
                    }
                    if (modificando) {
                        if (valid && (!modificarInvol
                            || _this.mod.denominacion
                            || _this.mod.descripcion
                            || _this.mod.fechainicio
                            || _this.mod.fechafin
                            || _this.mod.alto
                            || _this.mod.ancho
                            || _this.mod.color
                            || _this.mod.incidencia
                            || _this.mod.inicial)) {
                            btnGestionAceptar.enable();
                        } else {
                            btnGestionAceptar.disable();
                        }
                    }



                }
            }
        });
        wingestionarNom = new Ext.Window({
            layout: 'fit',
            width: 550,
            height: 388,
            constrain: true,
            closeAction: 'destroy',
            modal: true,
            items: [fpGestionarNom],
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    var idElementoConFoco = document.activeElement.id;
                    (!btnGestionAceptar.disabled && idElementoConFoco != 'tfbuscarInvPreCondicion2') ? gestionAceptar() : null;
                },
                scope: this
            }],
            listeners: {
                beforedestroy: function (w) {
                    if (aply) {
                        recargarGrid();
                    }
                },
                destroy: function (w) {
                    _this.mod = ({
                        denominacion: false,
                        descripcion: false,
                        fechainicio: false,
                        fechafin: false,
                        color: false,
                        alto: false,
                        ancho: false,
                        incidencia: false,
                        inicial: false,
                        publicarTodos: false
                    });
                    modificarInvol = true;

                }
            },
            buttons: [btnGestionCancelar, btnGestionAplicar, btnGestionAceptar]
        });
    }//fin de la funcion  selementosGestion

    //******************Elementos de la Ventana Gestionar Publicidad******************

    function elementosPublicar() {
        //botones de la ventana gestionar nomenclador
        btnGestionCancelar = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                winpublicidad.destroy();
            }
        });
        btnGestionAceptar = new Ext.Button({
            text: 'Aceptar ',
            tooltip: 'Guardar datos y cerrar ventana',
            iconCls: 'aceptar ',
            cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
            disabled: true,
            handler: function () {
                GestionarPublicidad();
                winpublicidad.destroy();
            }
        });
        //formulario de editar publicidad
        fppublicidad = new Ext.FormPanel({
            id: 'fppublicidad',
            labelAlign: 'top',
            height: 300,
            items: [panelRangoPublicidad]
        });
        this.winpublicidad = new Ext.Window({
            layout: 'fit',
            width: 550,
            height: 360,
            closeAction: 'destroy',
            modal: true,
            items: [fppublicidad],
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    GestionarPublicidad();
                    winpublicidad.destroy();
                },
                scope: this
            }],
            buttons: [btnGestionCancelar, btnGestionAceptar]
        });
    }

    /*...................Funciones.............................*/
    /* funcion donde creo la ventana para la gestion de los nomencladores
     */
    function CrearVentanaGestionNom() {
        //destruir ventana de gestionar nomenclador y crearla de nuevo
        if (wingestionarNom) {
            wingestionarNom.destroy();
        }
        if (modificando) {
            _this.BarraProgresoNomencladores.show('Cargando datos');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/existeNomenclador',
                params: {
                    idnom: selected.idnom
                },
                callback: function (options, success, response) {
                    _this.BarraProgresoNomencladores.hide();
                    responseData = Ext.decode(response.responseText);
                    //no hacer nada si ya no existe el nomenclador
                    if (responseData.mensaje == 3) {
                        mostrarMensaje(1, 'El nomenclador que quiere adicionar ya existe.');
                        recargarGrid();
                    }
                    if (responseData.mensaje == 1) {
                        //crear elementos de Interfaz de la ventana de Gestionar
                        elementosPublicidad();
                        elementosGestionar();
                        //mostrar ventana
                        wingestionarNom.doLayout();
                        wingestionarNom.show();
                        if (modificando) {
                            btnGestionAplicar.hide();
                        }
                        wingestionarNom.setTitle('Modificar ' + nametiponom);
                        tfdenominacion.setValue(selected.denom);
                        hedescripcion.setValue(selected.descrip);
                        fechaInicio.setValue(selected.fdesde);
                        fechaFin.setValue(selected.fhasta);
                        tfcolor.setValue(selected.color);
                        Ext.get('tfcolor').applyStyles('border:2px solid #' + selected.color);
                        tfalto.setValue(selected.alto);
                        tfancho.setValue(selected.ancho);
                        chIncidencia.setValue((selected.incidencia == 1) ? true : false);
                        chInicial.setValue((selected.inicial == 1) ? true : false);
                        chpublicotodos.checked = (selected.pubtodos == 1) ? true : false;
                        datos_ini = fpGestionarNom.getForm().getValues(true);
                        //Validar btn modificar
                        _this.valoresiniform.denominacion = selected.denom;
                        _this.valoresiniform.descripcion = selected.descrip;
                        _this.valoresiniform.fechainicio = selected.fdesde;
                        _this.valoresiniform.fechafin = (selected.fhasta != null) ? selected.fhasta : '';
                        _this.valoresiniform.color = selected.color;
                        _this.valoresiniform.alto = selected.alto;
                        _this.valoresiniform.ancho = selected.ancho;
                        _this.valoresiniform.incidencia = (selected.incidencia == 1) ? true : false;
                        _this.valoresiniform.inicial = (selected.inicial == 1) ? true : false;
                        _this.valoresiniform.publicarTodos = (selected.pubtodos == 1) ? true : false;

                        tfdenominacion.focus(false, 1024);
                    }
                }
            });
        } else {
            //crear elementos de Interfaz de la ventana de Gestionar
            elementosPublicidad();
            elementosGestionar();
            //mostrar ventana
            wingestionarNom.doLayout();
            wingestionarNom.show();
            wingestionarNom.setTitle('Adicionar ' + nametiponom);
            fechahoy = new Date();
            tfdenominacion.focus(false, 1024);
        }
    }

    /*
     * function para adicionar un nomenclador
     */
    function GestionarNomenclador() {
        var arrayPublicidad = getgestionarCheck(tprangopublicidad, ['idusuario', 'idgrupo', 'tipo']);
        //Si el arbol tiene asociado un checkbox , en lo posible  enviar  el  publico en  1  �   0  si se puede determinar
        var publico = 0, pubtodos,
            numinsertar = arrayPublicidad.insertar.length,
            numeliminar = arrayPublicidad.eliminar.length,
            numchecked = tprangopublicidad.getChecked().length;
        if (chpublicotodos.checked) {
            publico = 1;
            pubtodos = 1;
        } else
            pubtodos = 0;
        if (numinsertar > 0 || numchecked > 0)
            publico = 1;
        if (modificando) {
            url = 'modificarNomenclador';
            if (selected.pub == 1 && numeliminar == 0)
                publico = 1;
            if (selected.pub == 0 && numinsertar == 0)
                publico = 0;
        } else {
            url = 'adicionarNomenclador';
            fechahoy = new Date();
            if (fechaInicio.getRawValue() == '')
                fechaInicio.setValue(fechahoy);
        }
        _this.BarraProgresoNomencladores.show('Guardando datos del nomenclador.');
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/' + url,
            params: {
                //data
                denom: tfdenominacion.getValue(),
                fdesde: fechaInicio.getRawValue(),
                fhasta: fechaFin.getRawValue(),
                color: tfcolor.getValue(),
                ancho: parseFloat(tfancho.getValue()),
                alto: parseFloat(tfalto.getValue()),
                inicial: (chInicial.checked) ? 1 : 0,
                incidencia: (chIncidencia.checked) ? 1 : 0,
                descrip: hedescripcion.getValue(),
                caduca: (fechaFin.getRawValue() == '') ? 0 : 1,
                pub: publico,
                pubtodos: pubtodos,
                //involucrados
                arrayinsertar: Ext.encode(arrayPublicidad.insertar),
                arrayeliminar: Ext.encode(arrayPublicidad.eliminar),
                //ids
                tiponom: tiponom,
                idnom: ((!adicionarhijo) && (!modificando)) ? "" : idnom
            },
            callback: function (options, success, response) {
                _this.BarraProgresoNomencladores.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    mostrarMensaje(1, 'El nomenclador ha sido ' + ((modificando) ? 'modificado' : 'adicionado') + ' satisfactoriamente.');
                    if (aply) {
                        tfdenominacion.reset();
                        fechaInicio.reset();
                        fechaFin.reset();
                        tfancho.reset();
                        tfalto.reset();
                        hedescripcion.reset();
                        chIncidencia.reset();
                        array_publicidad_ini = [];
                        array_publicidad_fin = [];
                        stNomenclador.reload();
                        tprangopublicidad.root.reload();
                        LimpiarSeleccionNodos(tprangopublicidad.root);

                    } else {
                        stNomenclador.reload();
                        array_publicidad_ini = [];
                        array_publicidad_fin = [];
                        wingestionarNom.destroy();
                    }
                } else if (modificando) {
                    if (responseData.mensaje == 3) {
                        mostrarMensaje(1, 'El nomenclador que usted quiere modificar ya no existe en los registros.');
                        recargarGrid();
                        wingestionarNom.destroy();
                    } else if (responseData.mensaje == 8) {
                        mostrarMensaje(1, 'Ya existe un nomenclador con esa denominación.');
                    }
                } else {
                    switch (responseData.mensaje) {
                        case 7:
                            mostrarMensaje(1, 'El nomenclador no ha sido adicionado como hijo porque el nomenclador padre ya no existe en los registros.');
                            recargarGrid();
                            wingestionarNom.destroy();
                            break;
                        case 8:
                            mostrarMensaje(1, 'El nomenclador que quiere adicionar ya existe.');
                            break;
                    }
                }
            }
        });
    }

    function LimpiarSeleccionNodos(tree) {
        tree.eachChild(function (n) {
            if (n.getUI().isChecked()) {
                n.getUI().toggleCheck(false);
            }
        });
    }

    /*
     funcion donde creo la ventana para la gestion de los nomencladores
     */
    function CrearVentanaPublicidad() {
        if (winpublicidad)
            winpublicidad.destroy();
        //no hacer nada si ya no existe el nomenclador
        var eliminado = false;
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/existeNomenclador',
            params: {
                idnom: selected.idnom
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 3) {
                    eliminado = true;
                    mostrarMensaje(1, 'La publicidad del nomenclador no se puede modificar porque este ya no existe en los registros.');
                    recargarGrid();
                }
            }
        });
        if (eliminado)
            return;
        //crear elementos de Interfaz de la ventana de Publicidad
        elementosPublicidad();
        elementosPublicar();
        //Inicializar valores que cambian
        winpublicidad.title = 'Editar rango de publicidad del nomenclador:  ' + selected.denom;
        chpublicotodos.checked = (modificando) ? ((selected.pubtodos == 1) ? true : false) : false;
        winpublicidad.doLayout();
        winpublicidad.show();
    }

    /*
     * function para adicionar un nomenclador
     */
    function GestionarPublicidad() {
        var arrayPublicidad = getgestionarCheck(tprangopublicidad, ['idusuario', 'idgrupo', 'tipo']);
        //Si el arbol tiene asociado un checkbox , en lo posible  enviar  el  publico en  1  �   0  si se puede determinar
        var publico = 0, pubtodos,
            numinsertar = arrayPublicidad.insertar.length,
            numeliminar = arrayPublicidad.eliminar.length,
            numchecked = tprangopublicidad.getChecked().length;
        if (chpublicotodos.checked) {
            publico = 1;
            pubtodos = 0;
        } else {
            publico = 1;
            pubtodos = 0;
        }
        if (numinsertar > 0 || numchecked > 0)
            publico = 1;
        if (selected.pub == 1 && numeliminar == 0)
            publico = 1;
        if (selected.pub == 0 && numinsertar == 0)
            publico = 0;
        _this.BarraProgresoNomencladores.show('Editando la publicidad del nomenclador seleccionado...');
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/editarPublicidad',
            params: {
                arrayinsertar: Ext.encode(arrayPublicidad.insertar),
                arrayeliminar: Ext.encode(arrayPublicidad.eliminar),
                pub: publico,
                pubtodos: pubtodos,
                tiponom: tiponom,
                idnom: idnom
            },
            callback: function (options, success, response) {
                _this.BarraProgresoNomencladores.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    mostrarMensaje(1, 'La publicidad del nomenclador ha sido modificada satisfactoriamente.');
                    recargarGrid();
                } else if (responseData.mensaje == 3)
                    mostrarMensaje(1, 'La publicidad del nomenclador no ha sido modificada porque este ya no existe en los registros.');
                recargarGrid();
            }
        });
    }

    /* funcion para confirmar suspension
     */
    function confirmarEliminar() {
        mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere eliminar el nomenclador seleccionado?', eliminarNomenclador);
    }

    function confirmarDespublicar() {
        mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere eliminar las publicaciones?', despublicarTodos);
    }

    /* funcion para confirmar suspension
     */
    function confirmarDesactivar() {
        mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere desactivar el nomenclador seleccionado?', desactivarNomenclador);
    }

    /* funcion para confirmar suspension
     */
    function confirmarActivar() {
        mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere activar el nomenclador seleccionado?', activarNomenclador);
    }


    /* funcion para eliminar nom
     */
    function eliminarNomenclador(btn) {
        if (btn == 'ok') {
            _this.BarraProgresoNomencladores.show('Eliminando datos del nomenclador');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/eliminarNomenclador',
                params: {
                    idnom: selected.idnom
                },
                callback: function (options, success, response) {
                    _this.BarraProgresoNomencladores.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1 || responseData.mensaje == 2) {
                        var accionnom = 'eliminado';
                        if (responseData.mensaje == 2) {
                            accionnom = 'desactivado';
                        }
                        mostrarMensaje(1, 'El nomenclador ha sido ' + accionnom + ' satisfactoriamente.');
                        recargarGrid();
                    } else if (responseData.mensaje == 3)
                        mostrarMensaje(1, 'El nomenclador que usted quiere eliminar ya no se encuentra en los registros.');
                    recargarGrid();
                }
            });
        }
    }

    /* funcion para desactivar nom
     */
    function activarNomenclador(btn) {
        if (btn == 'ok') {
            activar_desactivar = true;
            _this.BarraProgresoNomencladores.show('Activando nomenclador');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cambiarEstado',
                params: {
                    idnom: selected.idnom,
                    estado: 1
                },
                callback: function (options, success, response) {
                    _this.BarraProgresoNomencladores.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'El nomenclador ha sido activado satisfactoriamente.');
                        stNomenclador.reload();
                    } else if (responseData.mensaje == 3) {
                        mostrarMensaje(1, 'El nomenclador que usted quiere activar ya no se encuentra en los registros.');
                        stNomenclador.reload();
                    }
                }
            });
        }
    }

    /* funcion para desactivar nom
     */
    function desactivarNomenclador(btn) {
        if (btn == 'ok') {
            activar_desactivar = true;
            _this.BarraProgresoNomencladores.show('Desactivando nomenclador');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cambiarEstado',
                params: {
                    idnom: selected.idnom,
                    estado: 0
                },
                callback: function (options, success, response) {
                    _this.BarraProgresoNomencladores.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'El nomenclador ha sido desactivado satisfactoriamente.');
                        stNomenclador.reload();
                    } else if (responseData.mensaje == 3) {
                        mostrarMensaje(1, 'El nomenclador que usted quiere desactivar ya no se encuentra en los registros.');
                        stNomenclador.reload();
                    }
                }
            });
        }
    }

    /* funcion para disparar acciones cuando selecciono un nodo del arbol de nomencladores
     */
    function On_TipoNomClick() {
        panelcentral.setTitle('Nomenclador: ' + nametiponom);
        //Recargar TreeGrid de Nomencladores
        Ext.get('gdNomenclador').unmask();
        gdNomenclador.colModel.setHidden(6, (tiponom == 2 || tiponom == 12) ? false : true);
        gdNomenclador.colModel.setHidden(7, (tiponom == 5) ? false : true);
        gdNomenclador.colModel.setHidden(12, (tiponom == 8) ? false : true);
        gdNomenclador.colModel.setHidden(13, (tiponom == 8) ? false : true);
        gdNomenclador.colModel.setHidden(14, (tiponom == 9) ? false : true);
        gdNomenclador.colModel.setHidden(15, (tiponom == 9 || tiponom == 12) ? false : true);
        _this.ftCmpnomencladores.clearFilters();
        stNomenclador.removeAll();
        ActivarBotonesGestion();
    }

    /* habilita los botones de la ventana de gestionar arc
     */
    function enableWinNom() {
        btnGestionCancelar.enable();
        btnGestionAceptar.enable();
    }

    /* deshabilita los botones de la ventana de gestionar arc
     */
    function disableWinNom() {
        btnGestionCancelar.disable();
        btnGestionAceptar.disable();
    }

    /* funcion para activar los botones de la barra de herramientas
     */
    function ActivarBotonesGestion() {
        btnAdicionarNomenclador.enable();
        if (smMostrarNomenclador.hasSelection() && selected.superior == 0) {
            btnModificarNomenclador.enable();
            btnEliminarNomenclador.enable();
            if (selected.activo == 0) {
                btnDesactivarNomenclador.disable();
                btnActivarNomenclador.enable();
            } else {
                btnDesactivarNomenclador.enable();
                btnActivarNomenclador.disable();
            }
        } else {
            btnModificarNomenclador.disable();
            btnEliminarNomenclador.disable();
            btnActivarNomenclador.disable();
            btnDesactivarNomenclador.disable();
        }
        if(smMostrarNomenclador.hasSelection()){
		        btnDespublicarNomenclador.enable();
        }else{
		        btnDespublicarNomenclador.disable();
        }
    }

    //funcion para cambiarle el titulo al grid de nomencladores cuando filtre    
    this.changeTitlenomenclador = function () {
        var filtrado_por = "";
        var sep = "/";
        if (_this.ftCmpnomencladores.getFiltrosActivos() == undefined || _this.ftCmpnomencladores.getFiltrosActivos().length == 0) {
            panelcentral.setTitle('Nomenclador: ' + nametiponom);
        } else {
            for (i = 0; i < _this.ftCmpnomencladores.getFiltrosActivos().length; i++) {
                var aux = "";
                if (_this.ftCmpnomencladores.getFiltrosActivos()[i].dataIndex == "denom") {
                    aux = 'Denominaci&oacute;n';
                } else if (_this.ftCmpnomencladores.getFiltrosActivos()[i].dataIndex == "pub") {
                    aux = 'P&uacute;blico';
                } else if (_this.ftCmpnomencladores.getFiltrosActivos()[i].dataIndex == "activo") {
                    aux = 'Activo';
                } else if (_this.ftCmpnomencladores.getFiltrosActivos()[i].dataIndex == "fdesde") {
                    aux = 'Fecha de Inicio';
                } else if (_this.ftCmpnomencladores.getFiltrosActivos()[i].dataIndex == "fhasta") {
                    aux = 'Fecha de Fin';
                } else if (_this.ftCmpnomencladores.getFiltrosActivos()[i].dataIndex == "nombreautor") {
                    aux = 'Autor';
                } else if (_this.ftCmpnomencladores.getFiltrosActivos()[i].dataIndex == "ancho") {
                    aux = 'Ancho';
                } else if (_this.ftCmpnomencladores.getFiltrosActivos()[i].dataIndex == "alto") {
                    aux = 'Alto';
                } else {
                    aux = 'Alto';
                }
                if (i == _this.ftCmpnomencladores.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            panelcentral.setTitle('Nomenclador: ' + nametiponom + ' <i>- Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    };
    /* funcion para recargar el treegrid de nomencladores
     */
    function recargarGrid() {
        stNomenclador.removeAll();
        smMostrarNomenclador.clearSelections();
        stNomenclador.reload({
            params: {
                start: start,
                anode: null
            }
        });
        ActivarBotonesGestion();
        if (smMostrarNomenclador.getSelected() == undefined) {
            idnom = "";
            idrowpadre = "";
        }
    }

//funcion para mostrar el icono "estado de cumplimiento"
    function renderFecha(val) {
        if (val) {
            return ('<center>' + val.substring(8, 10) + ' / ' + val.substring(5, 7) + ' / ' + val.substring(0, 4) + '</center>');
        }
    }

    function MostrarImagenT(val) {
        if (val == 0) {
            return ' ';
        }
        if (val > 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    function compararArray(arrayIni, arrayFin) {
        var contador = 0;
        var parada = 0;
        var a, b;
        a = Object.keys(arrayIni).length;
        b = Object.keys(arrayFin).length;
        if (a == b) {
            for (var id in arrayIni) {
                if (arrayIni.hasOwnProperty(id)) {
                    for (id in arrayFin) {
                        if (arrayFin.hasOwnProperty(id)) {
                            if (arrayIni[id].id == arrayFin[id].id) {
                                contador++;
                                break;
                            } else
                                parada++;
                        }
                    }
                    if (parada == b) {
                        return false;
                        break;
                    }
                    else
                        parada = 0;
                }
            }
            if (contador == a)
                return true;
        } else
            return false;
    }


    this.CargarCmpGestionarNom = function (idelemento, PostAccionesRelacionar) {
        _this.WinPrincipal.show();
    };

    if (opcionesConfig.subsistemaLlamada == "integracion") {
        this.panelPrincipal = new Ext.Panel({
            layout: 'border',
            width: 1000,
            height: 510,
            closable: opcionesConfig.cerrarPestaña,
            closeAction: 'destroy',
            id: opcionesConfig.idPanelPincipal,
            modal: true,
            items: [tpTipoNom, panelcentral]
        });

        return _this.panelPrincipal;
    }

}
;
