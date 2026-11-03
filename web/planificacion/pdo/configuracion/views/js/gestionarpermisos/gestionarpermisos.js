Utilidades.Cmp.Cmpgestionarpermiso = function (opcionesConfig) {
    var perfil = window.parent.UCID.portal.perfil;
    perfil.etiquetas = Object();
//UCID.portal.cargarEtiquetas('gestionarpermisos',cargarInterfaz);
    Ext.QuickTips.init();
// declarar variables
    this.arr_tempNodos = [];
    var click = true;
    var tpDarPermisoPara, tpPermisoSobre;
    var VentanaDarPermiso, VentanaModificarPermiso;
    var estamodificando = 0;
    var arrayCheckedPara, arrayCheckedSobre;
    var arrayrecords, totalrecords, totalidpermisos, url, btnSubordinados, tpsubordinados;
    var arraysubordinadoseliminar = [];
    var permisospormiactivado = 0;
    var chequeadopermisop = 0;
    var chequeadopermisos = 0;
    var chequeadopermiso = 0;
    var permisosparami = 0;
    var reload = 0;
    var pgultima = 0;
    var pgactual = 0;
    var pagstar = 0;
    var paglimit = 0;
    var _this = this;
    var wConfigSubordinados, tfbuscarInv, tfbuscarSub, winArbolSubordinacion, tpsubordinacion;
    var arrayIniSub = [];
    var arrayTempSub = [];

    Ext.Ajax.timeout = 1000000000;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    this.BarraProgresoPermisos = new BarraEstado();

    this.btnAdicionar = new Ext.Button({
        id: 'btnAgr',
        iconCls: 'adicionar',
        handler: function () {
            estamodificando = 0;
            CrearVentanaAdicionarPermisos();
        },
        tooltip: 'Adicionar permisos',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });

    this.btnModificar = new Ext.Button({
        disabled: true,
        id: 'btnMod',
        iconCls: 'modificar',
        handler: function () {
            estamodificando = 1;
            CrearVentanaModificarPermisos();
        },
        tooltip: 'Modificar permisos',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminar = new Ext.Button({
        disabled: true,
        id: 'btnEli',
        iconCls: 'eliminar',
        handler: function () {
            ConfirmarEliminacion();
        },
        tooltip: 'Eliminar permisos',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    this.btnLimpiar = new Ext.Button({
        disabled: false,
        handler: function () {
            if (_this.ftCmppermisos)
                _this.ftCmppermisos.clearFilters();
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.btnLimpiarOtorgados = new Ext.Button({
        disabled: false,
        handler: function () {
            if (_this.ftCmppermisosOtorgados)
                _this.ftCmppermisosOtorgados.clearFilters();
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.btnAyuda = new Ext.Button({
        text: 'Ayuda',
        id: 'btnAyuGestionarPermisos',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.btnAyuda1 = new Ext.Button({
        text: 'Ayuda',
        id: 'btnAyuGestionarPermisos',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.btnRefrescar = new Ext.Button({
        id: 'btnRefrescar',
        iconCls: 'actualizar',
        handler: function () {
            ActualizarPermisos();
        },
        tooltip: 'Actualizar mis permisos',
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        },
        scope: this
    });
    this.btnSubordinados = new Ext.Button({
        id: 'btnSubordinados',
        iconCls: 'buscarclitepersona',
        handler: function () {
            CrearVentanaConfigurarSubordinados();
        },
        tooltip: 'Configurar permisos sobre subordinados',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });

    //botbones temporales
    this.btnActualizarPermisos = new Ext.Button({
        text: 'Actualizar permisos',
        iconCls: 'buscarclitepersona',
        handler: function () {
            ActualizarPermisos();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        },
        scope: this
    });
    this.btnReorganizarSubordinacion = new Ext.Button({
        iconCls: 'estructura',
        handler: function () {
            CrearVentanaArbolSubordinacion();
        },
        tooltip: 'Visualizar el árbol de subordinaci&oacute;n directa e indirecta',
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });

    this.btnAceptarConf = new Ext.Button({
        handler: function () {
            ConfigurarPermisosSub();
        },
        id: 'btnAceptarConf',
        iconCls: 'aceptar',
        tooltip: 'Crear o eliminar configuración de permisos de lectura y escritura sobre mis usuarios subordinados'
    });

    /* funcion para mostrar la imagen de los permisos
     */
    function MostrarImagenSiTienePermiso(valor) {
        if (valor == 0) {
            return ' ';
        }
        if (valor == 1) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    /* funcion para mostrar el tipo sobre en colores
     */
    function MostrarImagenTipoSobre(valor) {
        if (valor == 0) {
            return '<span style="color:blue;"><center>Grupo</center></span>';
        }
        if (valor == 1) {
            return '<span style="color:red;"><center>Usuario</center></span>';
        }
        if (valor == 2) {
            return '<span style="color:green;"><center>Estructura</center></span>';
        }
    }

    /* funcion para mostrar el tipo para en colores
     */
    function MostrarImagenTipoPara(valor) {
        if (valor == 0) {
            return '<span style="color:blue;">Grupos</span>';
        }
        if (valor == 1) {
            return '<span style="color:red;">Usuarios</span>';
        }
        if (valor == 2) {
            return '<span style="color:green;">Estructura</span>';
        }
    }

    /* store del grid donde muestro los permisos que tengo
     */
    this.stPermisos = new Ext.data.GroupingStore({
        url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargarmispermisos',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "campos",
            id: "idelemento"
        }, [{
            name: 'idelemento'
        }, {
            name: 'denominacion'
        }, {
            name: 'tipo'
        }, {
            name: 'leer'
        }, {
            name: 'annadir'
        }, {
            name: 'modificar'
        }, {
            name: 'eliminar'
        }, {
            name: 'origen'
        }]),
        sortInfo: {
            field: 'denominacion',
            direction: "ASC"
        },
        groupField: 'origen',
        listeners: {
            beforeload: function (st) {
                _this.stPermisos.removeAll();
                st.baseParams.start = pagstar;
                st.baseParams.limit = _this.pgpermisos.pageSize;

            },
            load: function (st) {
                if (_this.gpPermisos.getStore().getCount() == 0) {
                    if (_this.ftCmppermisos.getFiltrosActivos() == undefined
                        || _this.ftCmppermisos.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
            }
        }
    });

    //barra de paginado del grid donde se cargan las repeticiones
    this.pgpermisos = new Ext.PagingToolbar({
        pageSize: 20,
        store: _this.stPermisos,
        displayInfo: true,
        id: 'pgpermisos',
        listeners: {
            beforechange: function (paginado, evento) {
                pagstar = evento.start;
            }
        }
    });

    /* selection model del grid donde muestro los permisos que tengo
     */
    this.smPermisos = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    //plugins para los filtros del grid
    this.ftCmppermisos = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'list',
            dataIndex: 'tipo',
            options: ['Grupo', 'Usuario']

        }, {
            type: 'list',
            dataIndex: 'leer',
            options: ['Si', 'No']

        }, {
            type: 'list',
            dataIndex: 'annadir',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'modificar',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'eliminar',
            options: ['Si', 'No']
        }, {
            type: 'string',
            dataIndex: 'origen'
        }]
    });

    /*grid donde muestro los permisos
     */
    this.gpPermisos = new Ext.grid.GridPanel({
        id: 'gpPermisos' + opcionesConfig.idsubsistema,
        frame: true,
        margins: '3 3 3 3',
        plugins: _this.ftCmppermisos,
        autoExpandColumn: 'expandir',
        store: _this.stPermisos,
        loadMask: {
            msg: 'Cargando mis permisos'
        },
        sm: _this.smPermisos,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idelemento'
            }, {
                id: 'expandir',
                header: 'Permiso sobre',
                sortable: true,
                dataIndex: 'denominacion',
                //renderer: MostrarImagenGrupo,
                width: 300
            }, {
                header: 'Tipo',
                dataIndex: 'tipo',
                sortable: false,
                renderer: MostrarImagenTipoSobre,
                width: 100
            }, {
                header: 'Leer',
                dataIndex: 'leer',
                sortable: false,
                renderer: MostrarImagenSiTienePermiso,
                width: 100
            }, {
                header: 'Adicionar',
                dataIndex: 'annadir',
                sortable: false,
                renderer: MostrarImagenSiTienePermiso,
                width: 100
            }, {
                header: 'Modificar',
                dataIndex: 'modificar',
                sortable: false,
                renderer: MostrarImagenSiTienePermiso,
                width: 100
            }, {
                header: 'Eliminar',
                dataIndex: 'eliminar',
                sortable: false,
                renderer: MostrarImagenSiTienePermiso,
                width: 100
            }, {
                hidden: true,
                header: 'Origen del permiso',
                sortable: false,
                dataIndex: 'origen',
                width: 10
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '<center>{text} ({[values.rs.length]} {[values.rs.length > 1 ? "permisos" : "permiso"]})</center>'
        }),
        bbar: _this.pgpermisos
    });

    //funcion para mostrar la imagen del grupo o usuario delante de la denominacion
    /*function MostrarImagenGrupo(valor, e, record) {
     if (record.data.tipo == 0) {
     return '<span class="icondistra-rolesygrupos sipac-azul">' + ' ' + valor + '</span>';
     }
     if (record.data.tipo == 1) {
     return '<span class="icondistra-usuario sipac-azul">' + ' ' + valor + '</span>';
     }
     if (record.data.tipo == 2) {
     return '<span><img src=' + record.data.icono + ' >' + ' ' + valor + '</span>';
     }
     }*/

    /* store del grid donde muestro los permisos que he otorgado
     */
    this.stPermisosOtorgados = new Ext.data.GroupingStore({
        url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargarpermisosotorgados',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "campos",
            id: "idpermiso"
        }, [{
            name: 'idpermiso'
        }, {
            name: 'denominacionpara'
        }, {
            name: 'tipopara'
        }, {
            name: 'denominacionsobre'
        }, {
            name: 'tiposobre'
        }, {
            name: 'leer'
        }, {
            name: 'annadir'
        }, {
            name: 'modificar'
        }, {
            name: 'eliminar'
        }]),
        sortInfo: {
            field: 'denominacionpara',
            direction: "ASC"
        },
        groupField: 'tipopara',
        listeners: {
            beforeload: function (st) {
                _this.stPermisosOtorgados.removeAll();
                st.baseParams.start = pgactual;
                st.baseParams.limit = _this.pgpotorg.pageSize;
            },
            load: function (st) {
                if (_this.gpPermisosOtorgados.getStore().getCount() == 0) {
                    if (_this.ftCmppermisosOtorgados.getFiltrosActivos() == undefined || _this.ftCmppermisosOtorgados.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                SetEstadoBotonesTbarGrid();
            }
        }
    });

    //barra de paginado del grid donde se cargan las repeticiones
    this.pgpotorg = new Ext.PagingToolbar({
        pageSize: 20,
        store: _this.stPermisosOtorgados,
        id: 'pgpotorg',
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                pgactual = evento.start;
            }
        }
    });

    /*selection model del grid donde muestro los permisos que he otorgado
     */
    this.smPermisosOtorgados = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: On_RowClick,
            rowdeselect: On_RowClick
        }
    });
    //plugins para los filtros del grid
    this.ftCmppermisosOtorgados = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'denominacionpara'
        }, {
            type: 'list',
            dataIndex: 'tipopara',
            options: ['Grupo', 'Usuario']

        }, {
            type: 'string',
            dataIndex: 'denominacionsobre'
        }, {
            type: 'list',
            dataIndex: 'tiposobre',
            options: ['Grupo', 'Usuario']
        }, {
            type: 'list',
            dataIndex: 'leer',
            options: ['Si', 'No']

        }, {
            type: 'list',
            dataIndex: 'annadir',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'modificar',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'eliminar',
            options: ['Si', 'No']
        }, {
            type: 'string',
            dataIndex: 'origen'
        }]
    });

    /* grid donde muestro los permisos que he otorgado
     */
    this.gpPermisosOtorgados = new Ext.grid.GridPanel({
        frame: true,
        id: 'gpPermisosOtorgados' + opcionesConfig.idsubsistema,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        plugins: _this.ftCmppermisosOtorgados,
        store: _this.stPermisosOtorgados,
        loadMask: {
            msg: 'Cargando los permisos que he otorgado'
        },
        sm: _this.smPermisosOtorgados,
        listeners: {
            rowdblclick: function () {
                estamodificando = 1;
                CrearVentanaModificarPermisos();
            }
        },
        columns: [
            _this.smPermisosOtorgados,
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idpermiso'
            }, {
                header: 'Permiso para',
                sortable: true,
                dataIndex: 'denominacionpara',
                width: 190
            }, {
                hidden: true,
                header: 'Tipo',
                dataIndex: 'tipopara',
                renderer: MostrarImagenTipoPara,
                width: 100
            }, {
                id: 'expandir',
                header: 'Permiso sobre',
                sortable: true,
                dataIndex: 'denominacionsobre',
                width: 190
            }, {
                header: 'Tipo',
                dataIndex: 'tiposobre',
                renderer: MostrarImagenTipoSobre,
                width: 100
            }, {
                header: 'Leer',
                dataIndex: 'leer',
                renderer: MostrarImagenSiTienePermiso,
                width: 70
            }, {
                header: 'Adicionar',
                dataIndex: 'annadir',
                renderer: MostrarImagenSiTienePermiso,
                width: 70
            }, {
                header: 'Modificar',
                dataIndex: 'modificar',
                renderer: MostrarImagenSiTienePermiso,
                width: 70
            }, {
                header: 'Eliminar',
                dataIndex: 'eliminar',
                renderer: MostrarImagenSiTienePermiso,
                width: 70
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '<center>{text} ({[values.rs.length]} {[values.rs.length > 1 ? "permisos" : "permiso"]})</center>'
        }),
        bbar: _this.pgpotorg
    });

    /* panel que muestro como pestanna con los permisos que he otorgado
     */
    this.panelpermisosotorgpormi = new Ext.Panel({
        id: 'panelpermisosotorgpormi' + opcionesConfig.idsubsistema,
        layout: 'fit',
        title: 'Permisos otorgados por mí',
        tbar: [_this.btnAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar, ' ', _this.btnLimpiarOtorgados, '->', _this.btnAyuda],
        items: [_this.gpPermisosOtorgados],
        listeners: {
            activate: function (p) {
                if (permisospormiactivado == 0) {
                    _this.stPermisosOtorgados.reload({params: {start: 0}});
                    permisospormiactivado = 1;
                }
            }
        }
    });

    /* panel que muestro como pestanna de los permisos que tengo
     */
    this.panelmispermisos = new Ext.Panel({
        id: 'panelmispermisos' + opcionesConfig.idsubsistema,
        layout: 'fit',
        //frame: true,
        title: 'Mis permisos',
        listeners: {
            activate: function (p) {
                if (permisosparami == 0) {
                    _this.stPermisos.reload({params: {start: 0}});
                    permisosparami = 1;
                }
            }
        },
        tbar: [_this.btnSubordinados, ' ', _this.btnReorganizarSubordinacion, ' ', _this.btnLimpiar, '->', _this.btnAyuda1/*,btnActualizarPermisos,'-',btnRefrescar,'-','->',btnAyuda,'-'*/],
        items: _this.gpPermisos
    });

    /* tabpanel donde muestro las pestannas de los permisos
     */
    this.panelPermisos = new Ext.TabPanel({
        id: 'panelPermisos',
        activeTab: 0,
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnLimpiarOtorgados, _this.btnSubordinados, _this.btnReorganizarSubordinacion, _this.btnLimpiar, _this.btnAyuda],
        items: [_this.panelmispermisos, _this.panelpermisosotorgpormi],
        listeners: {
            tabchange: function (tbPanel, tab) {
                /*if (tbPanel.getActiveTab().getId() == _this.panelmispermisos.getId()) {
                    _this.stPermisos.reload({params: {start: 0}});
                } else {
                    _this.stPermisosOtorgados.reload({params: {start: 0}});
                }*/
            }
        }

    });

    /* viewport de la vista
     */
    this.vpPermisos = new Ext.Viewport({
        layout: 'fit',
        items: _this.panelPermisos
    });

    /* funcion que invoco cuanod selecciono un elemento en el grid
     */
    function On_RowClick(sm, indiceFila, record) {
        CrearArregloDeRecords();
        SetEstadoBotonesTbarGrid();
    }

    /* funcion donde guardo en un arreglo los record del selection model
     */
    function CrearArregloDeRecords() {
        arrayrecords = _this.smPermisosOtorgados.getSelections();
        totalrecords = arrayrecords.length;
        totalidpermisos = [];
        for (var i = 0; i < totalrecords; i++) {
            var permiso = {
                idpermiso: arrayrecords[i].data.idpermiso
            };
            totalidpermisos.push(permiso);
        }
    }

    /* funcion para saber si hay algun permiso seleccionado
     */
    PermisoSeleccionado = function () {
        return (_this.smPermisosOtorgados.hasSelection());
    };

    /* funcion para activar los botones de la barra de herramientas para la gestion de los permisos
     */
    function SetEstadoBotonesTbarGrid() {
        if (PermisoSeleccionado()) {
            if (totalrecords == 1) {
                _this.btnModificar.enable();
                _this.btnEliminar.enable();
            }
            if (totalrecords > 1) {
                _this.btnModificar.disable();
                _this.btnEliminar.enable();
            }
        } else {
            _this.btnModificar.disable();
            _this.btnEliminar.disable();
        }
    }

    /* funciones para garantizar logica en los arboles
     */
    function alChekNodo(nodo, check) {
        if (!click)
            return 0;
        click = false;
        if (nodo.hasChildNodes()) {
            marcarHijos(nodo, check);
        }
        click = true;
        if (check == true && nodo.attributes.chekeado == 1) {

            for (var i = 0; i < arraysubordinadoseliminar.length; i++) {
                if (nodo.id == arraysubordinadoseliminar[i].idusuario) {
                    arraysubordinadoseliminar.splice(i, 1);
                }
            }
        } else {
            if (nodo.attributes.chekeado == 1) {
                var subordinado = {};
                if (nodo.id != 'nodo2') {
                    subordinado = {
                        idusuario: nodo.attributes.idusuario,
                        denominacion: nodo.text
                    };
                    arraysubordinadoseliminar.push(subordinado);
                }
            } else {
                if (!check) {
                    arraysubordinadoseliminar = [];
                    nodo.eachChild(function (anodehijo) {
                        subordinado = {
                            idusuario: anodehijo.attributes.idusuario,
                            denominacion: anodehijo.text
                        };
                        arraysubordinadoseliminar.push(subordinado);
                    });
                }
            }
        }
    }

    function chekParent(nodo) {
        if (todoHijoIsChecked(nodo.parentNode) && !nodo.parentNode.attributes.checked) {
            cambiarEstadoCheck(nodo.parentNode, true);
        } else if (nodo.parentNode.attributes.checked) {
            cambiarEstadoCheck(nodo.parentNode, false);
        }
        if (nodo.parentNode.parentNode)
            chekParent(nodo.parentNode);
    }

    function marcarHijos(nodo, check) {
        nodo.eachChild(function (anodehijo) {
            if (anodehijo.attributes.checked != check) {
                cambiarEstadoCheck(anodehijo, check);
                if (anodehijo.hasChildNodes()) {
                    marcarHijos(anodehijo, check);
                }
            }
        }, this);
    }

    function todoHijoIsChecked(nodo) {
        var estado = true;
        nodo.eachChild(function (anodehijo) {
            if (!anodehijo.attributes.checked)
                return estado = false;
        }, this);
        return estado;
    }

    function cambiarEstadoCheck(node, check) {
        if (node.attributes.checked != check) {
            node.getUI().toggleCheck(check);
            node.attributes.checked = check;
        }
    }

    function chekHijosSiChekPadre(node) {
        if (node.attributes.checked) {
            marcarHijos(node, node.attributes.checked);
        }
    }

    /* funcion donde creo la ventana para adicionar permisos
     */
    function CrearVentanaAdicionarPermisos() {
        chequeadopermisop = 0;
        chequeadopermisos = 0;
        chequeadopermiso = 0;
        if (VentanaDarPermiso)
            VentanaDarPermiso.destroy();

        var tfbuscarInvPreCondicion2 = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 110,
                id: 'tfbuscarInvPreCondicion2',
                nextTab: 'btnBuscarInv',
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (tf.isValid() && tf.getValue() != '') {
                                btnBuscarInv.handler();
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            btnBuscarInv.enable();
                            btnLimpiarSobre.enable();
                        } else {
                            btnBuscarInv.disable();
                            btnLimpiarSobre.disable();
                        }
                    }
                }
            });

        tpEntidadesPara = new Ext.tree.TreePanel({
            title: 'Estructuras',
            autoScroll: true,
            tbar: ['Buscar:', '', tfbuscarInvPreCondicion2, '-', {
                iconCls: 'buscar',
                tooltip: 'Buscar usuarios subordinados',
                handler: function () {
                }
            }, {
                iconCls: 'expandir',
                tooltip: 'Expandir',
                handler: function () {
                    //  tpUserSubord.root.expand(true);
                }
            }, {
                iconCls: 'contraer',
                tooltip: 'Contraer',
                handler: function () {
                    //  tpUserSubord.root.collapse(true);
                }
            }, {
                iconCls: 'actualizar',
                tooltip: 'Refrescar todas las agrupaciones',
                handler: function () {
                    /*
                     tpUserSubord.getRootNode().reload();
                     tfbuscarInvPreCondicion.setValue(null);
                     tfbuscarInvPreCondicion.focus();
                     */
                }
            }],
            region: 'center',
            height: 370,
            root: {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                expanded: true,
                text: 'Estructuras'
            },
            listeners: {
                'checkchange': function (node, ch) {
                    Ext.getCmp('aceptar').disable();
                    Ext.getCmp('aplicar').disable();
                    if (ch) {
                        chequeadopermisop++;
                    } else {
                        chequeadopermisop--;
                    }
                    if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                        Ext.getCmp('aceptar').enable();
                        Ext.getCmp('aplicar').enable();
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpasignarentidades/cargarArbolRelacionesAutor',
                listeners: {
                    'load': function (atreeloader, anode) {
                        if (!anode.hasChildNodes()) {
                            mostrarMensaje(1, 'Usted no tiene asociaciones usuario/estructura configuradas.');
                        }
                    }
                }
            })
        });
        var tfbuscarInvPreCondicion = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                id: 'tfbuscarInvPreCondicion',
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                prevTab: 'aceptar',
                maxLength: 255,
                width: 110,
                nextTab: 'btnBuscarPara',
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (tf.isValid() && tf.getValue() != '') {
                                btnBuscarInvolucrados.handler();
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            btnBuscarInvolucrados.enable();
                            btnLimpiarPara.enable();
                        } else {
                            btnBuscarInvolucrados.disable();
                            btnLimpiarPara.disable();
                        }
                    }
                }
            });

        tpEntidadesSobre = new Ext.tree.TreePanel({
            title: 'Estructuras',
            autoScroll: true,
            region: 'center',
            height: 370,
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
                    Ext.getCmp('aplicar').disable();
                    if (ch) {
                        chequeadopermisos++;
                    } else {
                        chequeadopermisos--;
                    }
                    if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                        Ext.getCmp('aceptar').enable();
                        Ext.getCmp('aplicar').enable();
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpasignarentidades/cargarArbolRelacionesAutor',
                listeners: {
                    'load': function (atreeloader, anode) {
                        if (!anode.hasChildNodes()) {
                            mostrarMensaje(1, 'Usted no tiene asociaciones usuario/estructura configuradas.');
                        }
                    }
                }
            })
        });

        var btnLimpiarPara = new Ext.Button({
            disabled: true,
            id: 'btnLimpiarPara',
            nextTab: 'btnExpandirPara',
            prevTab: 'btnBuscarPara',
            handler: function () {
                tpDarPermisoPara.root.reload();
                tfbuscarInvPreCondicion.reset();
                btnLimpiarPara.disable();
                btnBuscarInvolucrados.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        var btnBuscarInvolucrados = new Ext.Button({
            id: 'btnBuscarPara',
            nextTab: 'btnLimpiarPara',
            prevTab: 'tfbuscarInvPreCondicion',
            disabled: true,
            iconCls: 'buscar',
            tooltip: 'Buscar involucrados',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this,
            handler: function () {
                if (tfbuscarInvPreCondicion.getValue() == '') {
                    if (_this.newRootChild) {
                        tpDarPermisoPara.root.cascade(function (n) {
                            Ext.each(_this.newRootChild, function (n_arr) {
                                if (n_arr.id == n.id && n.ui.ctNode.offsetHeight < 3) {
                                    n.ui.hide();
                                }
                            });
                        });
                        Ext.each(_this.arr_tempNodos, function (n) {
                            n.ui.show();
                        });
                        tpDarPermisoPara.render();
                    }
                } else {
                    tpDarPermisoPara.body.mask("Buscando involucrados", 'x-mask-loading');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/buscargruposyusuarioscheckpara',
                        params: {
                            denominacion: tfbuscarInvPreCondicion.getValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
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
                            tpDarPermisoPara.body.unmask();
                        }
                    });

                }
            }
        });
        // Arbol donde cargo los usuarios a los cuales voy dar permiso
        tpDarPermisoPara = new Ext.tree.TreePanel({
            title: 'Permiso para:',
            autoScroll: true,
            tbar: ['Buscar:', '', tfbuscarInvPreCondicion, '-', btnBuscarInvolucrados, btnLimpiarPara,
                {
                    id: 'btnExpandirPara',
                    prevTab: 'btnLimpiarPara',
                    iconCls: 'expandir',
                    tooltip: 'Expandir',
                    handler: function () {
                        tpDarPermisoPara.expandAll();
                    }
                }, {
                    id: 'btnContraerPara',
                    iconCls: 'contraer',
                    tooltip: 'Contraer',
                    handler: function () {
                        tpDarPermisoPara.root.collapse(true);
                    }
                }, {
                    id: 'btnActualizarPara',
                    //netxTab: 'btcancelarAct',
                    prevTab: 'btnContraerPara',
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar todas las agrupaciones',
                    handler: function () {
                        tpDarPermisoPara.getRootNode().reload();
                        tpDarPermisoPara.focus();
                    }
                }],
            height: 380,
            split: true,
            listeners: {
                'checkchange': function (node, ch) {
                    Ext.getCmp('aceptar').disable();
                    Ext.getCmp('aplicar').disable();
                    if (ch) {
                        chequeadopermisop++;
                    } else {
                        chequeadopermisop--;
                    }
                    if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                        Ext.getCmp('aceptar').enable();
                        Ext.getCmp('aplicar').enable();
                    }
                }
            },
            root: {
                text: 'Clasificador de Involucrados',
                expanded: true,
                id: '0',
                children: [{
                    nodeType: 'async',
                    id: 'nodo1',
                    idgrupo: 'nodo1',
                    text: 'Mis grupos',
                    leaf: false,
                    checked: false
                }, {
                    nodeType: 'async',
                    id: 'nodo2',
                    idgrupo: 'nodo2',
                    text: 'Usuarios subordinados',
                    leaf: false,
                    checked: false
                }, {
                    nodeType: 'async',
                    id: 'nodo3',
                    idgrupo: 'nodo3',
                    text: 'Estructuras',
                    leaf: false,
                    checked: false
                }]
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargargruposyusuarioscheckpara',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo
                        };
                    }
                }
            })
        });
        tpDarPermisoPara.on('checkchange', alChekNodo);
        tpDarPermisoPara.on('load', chekHijosSiChekPadre);
        this.setChildren = function (childrenNodos) {
            _this.newRootChild = childrenNodos;
            tpDarPermisoPara.root.eachChild(function (n) {
                if (n.isExpanded())
                    n.collapse(true, false);
                if (n.ui.ctNode.offsetHeight < 3) {
                    if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                        _this.arr_tempNodos.push(n);
                    n.ui.hide();
                }
            });
            tpDarPermisoPara.root.appendChild(_this.newRootChild);
            tpDarPermisoPara.render();
            tpDarPermisoPara.root.eachChild(function (n) {
            })
        };

        var btnLimpiarSobre = new Ext.Button({
            disabled: true,
            id: 'btnLimpiarSobre',
            nextTab: 'btnExpandirSobre',
            prevTab: 'btnBuscarInv',
            handler: function () {
                tpPermisoSobre.root.reload();
                tfbuscarInvPreCondicion2.reset();
                btnLimpiarSobre.disable();
                btnBuscarInv.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        var btnBuscarInv = new Ext.Button({
            id: 'btnBuscarInv',
            disabled: true,
            nextTab: 'btnLimpiarSobre',
            prevTab: 'tfbuscarInvPreCondicion2',
            iconCls: 'buscar',
            tooltip: 'Buscar involucrados',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this,
            handler: function () {
                if (tfbuscarInvPreCondicion2.getValue() == '') {
                    tpPermisoSobre.getRootNode().reload();
                } else {
                    tpPermisoSobre.body.mask("Buscando involucrados", 'x-mask-loading');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/buscargruposyusuarioschecksobre',
                        params: {
                            denominacion: tfbuscarInvPreCondicion2.getValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
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
                            this.setChildren1(array);
                            tpPermisoSobre.body.unmask();
                        }
                    });
                }
            }
        });
        // Arbol donde cargo los usuarios sobre los cuales voy a dar permiso
        tpPermisoSobre = new Ext.tree.TreePanel({
            title: 'Permiso sobre:',
            tbar: ['Buscar:', '', tfbuscarInvPreCondicion2, '-', btnBuscarInv, btnLimpiarSobre,
                {
                    id: 'btnExpandirSobre',
                    prevTab: 'btnLimpiarSobre',
                    iconCls: 'expandir',
                    tooltip: 'Expandir',
                    handler: function () {
                        tpPermisoSobre.expandAll();
                    }
                }, {
                    id: 'btnContraerSobre',
                    iconCls: 'contraer',
                    tooltip: 'Contraer',
                    handler: function () {
                        tpPermisoSobre.collapseAll();
                    }
                }, {
                    id: 'btnActualizarSobre',
                    //netxTab: 'btcancelarAct',
                    prevTab: 'btnContraerSobre',
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar todas las agrupaciones',
                    handler: function () {
                        tpPermisoSobre.getRootNode().reload();
                        tpPermisoSobre.focus();
                    }
                }],
            autoScroll: true,
            listeners: {
                'checkchange': function (node, ch) {
                    Ext.getCmp('aceptar').disable();
                    Ext.getCmp('aplicar').disable();
                    if (ch) {
                        chequeadopermisos++;
                    } else {
                        chequeadopermisos--;
                    }
                    if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                        Ext.getCmp('aceptar').enable();
                        Ext.getCmp('aplicar').enable();
                    }
                }
            },
            height: 380,
            split: true,
            root: {
                text: 'Clasificador de Involucrados',
                expanded: true,
                id: '0',
                children: [
                    {
                        nodeType: 'async',
                        id: 'nodo1',
                        idgrupo: 'nodo1',
                        text: 'Mi usuario',
                        leaf: false,
                        checked: false
                    }, {
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
                        id: 'nodo4',
                        idgrupo: 'nodo4',
                        text: 'Otros grupos y usuarios (permisos del nivel superior)',
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
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargargruposyusuarioschecksobre',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo
                        };
                    }
                }
            })
        });

        this.setChildren1 = function (childrenNodos) {
            _this.newRootChild = childrenNodos;
            tpPermisoSobre.root.eachChild(function (n) {
                if (n.isExpanded())
                    n.collapse(true, false);
                if (n.ui.ctNode.offsetHeight < 3) {
                    n.ui.hide();
                }
            });
            tpPermisoSobre.root.appendChild(_this.newRootChild);
            tpPermisoSobre.render();
            tpPermisoSobre.root.eachChild(function (n) {
            })
        };
        tpPermisoSobre.on('checkchange', alChekNodo);
        tpPermisoSobre.on('load', chekHijosSiChekPadre);

        // Ventana donde muestro los dos arboles de usuarios con los que voy a gestionar los permisos
        VentanaDarPermiso = new Ext.Window({
            width: 700,
            title: 'Adicionar permiso',
            constrain: true,
            height: 470,
            modal: true,
            resizable: false,
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            border: false,
                            columnWidth: .5,
                            items: tpDarPermisoPara
                        }, {
                            border: false,
                            columnWidth: .5,
                            items: tpPermisoSobre
                        }
                    ]
                }
            ],
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    id: 'cancelar',
                    nextTab: 'aplicar',
                    handler: function () {
                        VentanaDarPermiso.destroy();
                    },
                    tooltip: 'Cerrar ventana sin guardar los datos'
                }, {
                    iconCls: 'aplicar',
                    text: 'Aplicar',
                    id: 'aplicar',
                    tooltip: 'Guardar datos y limpiar los campos',
                    disabled: true,
                    nextTab: 'aceptar',
                    prevTab: 'cancelar',
                    handler: function () {
                        AdicionarPermisos('apl');
                    }
                }, {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    id: 'aceptar',
                    disabled: true,
                    prevTab: 'aplicar',
                    nextTab: 'tfbuscarInvPreCondicion',
                    handler: function () {
                        AdicionarPermisos('acep');
                    },
                    tooltip: 'Guardar datos y cerrar ventana'
                }
            ],
            tbar: [
                {
                    xtype: 'tbtext',
                    text: '<b> Permisos: </b>'
                }, {
                    xtype: 'tbseparator'
                }, {
                    xtype: 'checkbox',
                    boxLabel: 'Leer',
                    prevTab: 'aceptar',
                    id: 'chleer',
                    listeners: {
                        'check': function (ck, tp) {
                            habilitaBtnAplicarAceptar(ck, tp);
                            Ext.getCmp('aceptar').disable();
                            Ext.getCmp('aplicar').disable();
                            if (tp) {
                                chequeadopermiso++;
                            } else {
                                chequeadopermiso--;
                            }
                            if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                                Ext.getCmp('aceptar').enable();
                                Ext.getCmp('aplicar').enable();
                            }
                        }
                    }
                }, ' ', {
                    xtype: 'checkbox',
                    boxLabel: 'Adicionar',
                    id: 'ckannadir',
                    listeners: {
                        'check': function (ck, tp) {
                            habilitaBtnAplicarAceptar(ck, tp);
                            Ext.getCmp('aceptar').disable();
                            Ext.getCmp('aplicar').disable();
                            if (tp) {
                                chequeadopermiso++;
                            } else {
                                chequeadopermiso--;
                            }
                            if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                                Ext.getCmp('aceptar').enable();
                                Ext.getCmp('aplicar').enable();
                            }
                        }
                    }
                }, ' ', {
                    xtype: 'checkbox',
                    boxLabel: 'Modificar',
                    id: 'ckeditar',
                    listeners: {
                        'check': function (ck, tp) {
                            habilitaBtnAplicarAceptar(ck, tp);
                            Ext.getCmp('aceptar').disable();
                            Ext.getCmp('aplicar').disable();
                            if (tp) {
                                chequeadopermiso++;
                                Ext.getCmp('aceptar').disable();
                                Ext.getCmp('aplicar').disable();
                            } else {
                                chequeadopermiso--;
                            }
                            if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                                Ext.getCmp('aceptar').enable();
                                Ext.getCmp('aplicar').enable();
                            }
                        }
                    }
                }, ' ', {
                    xtype: 'checkbox',
                    boxLabel: 'Eliminar',
                    id: 'ckeliminar',
                    listeners: {
                        'check': function (ck, tp) {
                            habilitaBtnAplicarAceptar(ck, tp);
                            Ext.getCmp('aceptar').disable();
                            Ext.getCmp('aplicar').disable();
                            if (tp) {
                                chequeadopermiso++;
                                Ext.getCmp('aceptar').disable();
                                Ext.getCmp('aplicar').disable();
                            } else {
                                chequeadopermiso--;
                            }
                            if (chequeadopermisop > 0 && chequeadopermisos > 0 && chequeadopermiso > 0) {
                                Ext.getCmp('aceptar').enable();
                                Ext.getCmp('aplicar').enable();
                            }
                        }
                    }
                }
            ]
        });
        VentanaDarPermiso.on('beforeshow', function () {
            tfbuscarInvPreCondicion.focus(true, 700);

        });
        VentanaDarPermiso.show();
    }

    /* funcion donde creo la ventana para modificar permisos
     */
    function CrearVentanaModificarPermisos() {
        var btnAceptarModPer = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            id: 'aceptarm',
            nextTab: 'chleerm',
            prevTab: 'cancelarm',
            disabled: true,
            handler: function () {
                ModificarPermisos();
            },
            tooltip: 'Guardar datos y cerrar ventana'
        });

        var btnCancelarModPer = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            id: 'cancelarm',
            nextTab: 'aceptarm',
            prevTab: 'ckeliminarm',
            handler: function () {
                VentanaModificarPermiso.destroy();
            },
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        var chLeer = new Ext.form.Checkbox({
            boxLabel: 'Leer',
            id: 'chleerm',
            nextTab: 'ckannadirm',
            prevTab: 'aceptarm',
            listeners: {
                'check': function (ck, tp) {
                    habilitaBtnAceptarLeerAdd(ck, tp);
                }
            }
        });
        var chAdicionar = new Ext.form.Checkbox({
            xtype: 'checkbox',
            boxLabel: 'Adicionar',
            id: 'ckannadirm',
            nextTab: 'ckeditarm',
            prevTab: 'chleerm',
            listeners: {
                'check': function (ck, tp) {
                    habilitaBtnAceptarLeerAdd(ck, tp);
                }
            }
        });
        var chModificar = new Ext.form.Checkbox({
            boxLabel: 'Modificar',
            id: 'ckeditarm',
            nextTab: 'ckeliminarm',
            prevTab: 'ckannadirm',
            listeners: {
                'check': function (ck, tp) {
                    habilitaBtnAceptar(ck, tp);
                }
            }
        });
        var chEliminar = new Ext.form.Checkbox({
            boxLabel: 'Eliminar',
            id: 'ckeliminarm',
            nextTab: 'cancelarm',
            prevTab: 'ckeditarm',
            listeners: {
                'check': function (ck, tp) {
                    habilitaBtnAceptar(ck, tp);
                }
            }
        });

        url = '';
        if (VentanaModificarPermiso)
            VentanaModificarPermiso.destroy();

        VentanaModificarPermiso = new Ext.Window({
                constrain: true,
                id: 'VentanaModificarPermiso',
                title: 'Modificar permiso',
                modal: true,
                resizable: false,
                width: 320,
                height: 90,
                tbar: [
                    {
                        xtype: 'tbtext',
                        text: '<b> Permisos: </b>'
                    }, {
                        xtype: 'tbseparator'
                    }, chLeer, chAdicionar, chModificar, chEliminar
                ],
                buttons: [
                    btnCancelarModPer, btnAceptarModPer
                ]
            }
        )
        ;
        VentanaModificarPermiso.on('beforeshow', function () {
            Ext.getCmp('cancelarm').focus(true, 700);
        });

        VentanaModificarPermiso.show();
        VentanaModificarPermiso.focus(false, 1024);
        setTimeout(function () {
            Ext.getCmp('cancelarm').focus(true);
        }, 500);

        var record = _this.smPermisosOtorgados.getSelections();
        if (record[0].data.leer == 1) {
            Ext.getCmp('chleerm').setValue('true');
        }
        if (record[0].data.annadir == 1) {
            Ext.getCmp('ckannadirm').setValue('true');
        }
        if (record[0].data.modificar == 1) {
            Ext.getCmp('ckeditarm').setValue('true');
        }
        if (record[0].data.eliminar == 1) {
            Ext.getCmp('ckeliminarm').setValue('true');
        }
    }

    /* funcion donde habilito los botones aceptar y aplicar del formulario para gestionar permisos
     */
    function habilitaBtnAplicarAceptar(ck, tp) {
        if (tp && (ck.id == 'ckeditar' || ck.id == 'ckeliminar')
            && Ext.getCmp('ckeditar').getValue()
            || Ext.getCmp('ckeliminar').getValue()) {
            Ext.getCmp('chleer').setValue(true);
            Ext.getCmp('chleer').disable();
        }
        if (!(Ext.getCmp('ckeditar').getValue() || Ext.getCmp('ckeliminar').getValue()))
            if (Ext.getCmp('chleer').disabled)
                Ext.getCmp('chleer').enable();
    }

    /* funcion donde habilito el boton aceptar de la ventana para modificar permisos
     */

    function habilitaBtnAceptar(ck, tp) {
        var record = _this.smPermisosOtorgados.getSelections();
        var arrPermisos = {};
        var leer = 0;
        if (Ext.getCmp('chleerm').getValue()) {
            leer = 1;
        }
        arrPermisos.leer = leer;
        var anadir = 0;
        if (Ext.getCmp('ckannadirm').getValue()) {
            anadir = 1;
        }
        arrPermisos.anadir = anadir;
        var modificar = 0;
        if (Ext.getCmp('ckeditarm').getValue()) {
            modificar = 1;
        }
        arrPermisos.modificar = modificar;
        var eliminar = 0;
        if (Ext.getCmp('ckeliminarm').getValue()) {
            eliminar = 1;
        }
        arrPermisos.eliminar = eliminar;

        if (tp && (ck.id == 'ckeditarm' || ck.id == 'ckeliminarm') && Ext.getCmp('ckeditarm').getValue()
            || Ext.getCmp('ckeliminarm').getValue()) {
            setValueCheckBox(Ext.getCmp('chleerm'), true);
            arrPermisos.leer = 1;
            Ext.getCmp('chleerm').disable();
        }
        if (!(Ext.getCmp('ckeditarm').getValue() || Ext.getCmp('ckeliminarm').getValue()))
            Ext.getCmp('chleerm').enable();
        if (record[0].data.leer == arrPermisos.leer
            && record[0].data.annadir == arrPermisos.anadir
            && record[0].data.modificar == arrPermisos.modificar
            && record[0].data.eliminar == arrPermisos.eliminar) {
            var modifico = 0;
        } else {
            modifico = 1;
        }
        (modifico) ? Ext.getCmp('aceptarm').enable() : Ext.getCmp('aceptarm').disable();
    }

    function habilitaBtnAceptarLeerAdd(ck, tp) {
        var record = _this.smPermisosOtorgados.getSelections();
        var arrPermisos = {};
        var leer = 0;
        if (Ext.getCmp('chleerm').getValue()) {
            leer = 1;
        }
        arrPermisos.leer = leer;
        var anadir = 0;
        if (Ext.getCmp('ckannadirm').getValue()) {
            anadir = 1;
        }
        arrPermisos.anadir = anadir;
        var modificar = 0;
        if (Ext.getCmp('ckeditarm').getValue()) {
            modificar = 1;
        }
        arrPermisos.modificar = modificar;
        var eliminar = 0;
        if (Ext.getCmp('ckeliminarm').getValue()) {
            eliminar = 1;
        }
        arrPermisos.eliminar = eliminar;
        if (record[0].data.leer == arrPermisos.leer
            && record[0].data.annadir == arrPermisos.anadir
            && record[0].data.modificar == arrPermisos.modificar
            && record[0].data.eliminar == arrPermisos.eliminar) {
            var modifico = 0;
        } else {
            modifico = 1;
        }
        (modifico) ? Ext.getCmp('aceptarm').enable() : Ext.getCmp('aceptarm').disable();
    }

    function setValueCheckBox(checkbox, value) {
        checkbox.suspendEvents(false);
        checkbox.setValue(value);
        checkbox.resumeEvents();
    }

    /*funcion para limpiar los checkbox de permisos */
    function clearPermOnApply() {
        Ext.getCmp('ckeliminar').setValue(false);
        Ext.getCmp('chleer').setValue(false);
        Ext.getCmp('ckannadir').setValue(false);
        Ext.getCmp('ckeditar').setValue(false);
        if (Ext.getCmp('chleer').disabled) {
            Ext.getCmp('chleer').enable();
        }
    }

    /*funcion para adicionar permisos*/
    function AdicionarPermisos(opcion) {
        _this.BarraProgresoPermisos.show('Guardando datos de los permisos');
        var arrPermisos = {};
        var leer = 0;
        if (Ext.getCmp('chleer').getValue()) {
            leer = 1;
        }
        arrPermisos.leer = leer;
        var anadir = 0;
        if (Ext.getCmp('ckannadir').getValue()) {
            anadir = 1;
        }
        arrPermisos.anadir = anadir;
        var modificar = 0;
        if (Ext.getCmp('ckeditar').getValue()) {
            modificar = 1;
        }
        arrPermisos.modificar = modificar;
        var eliminar = 0;
        if (Ext.getCmp('ckeliminar').getValue()) {
            eliminar = 1;
        }
        arrPermisos.eliminar = eliminar;

        var arraypermsospara = [];
        var arraypermsossobre = [];
        var anodei = {};

        arrayCheckedPara = tpDarPermisoPara.getChecked();
        arrayCheckedSobre = tpPermisoSobre.getChecked();

        arrayCheckedParaEstruc = tpEntidadesPara.getChecked();
        arrayCheckedSobreEstruc = tpEntidadesSobre.getChecked();

        for (var i = 0; i < arrayCheckedParaEstruc.length; i++) {
            arrayCheckedPara.push(arrayCheckedParaEstruc[i]);
        }
        for (var j = 0; j < arrayCheckedSobreEstruc.length; j++) {
            arrayCheckedSobre.push(arrayCheckedSobreEstruc[j]);
        }
        for (var i = 0; i < arrayCheckedPara.length; i++) {
            //if (arrayCheckedPara[i].parentNode && !arrayCheckedPara[i].parentNode.attributes.checked) 
            if (arrayCheckedPara[i].parentNode.id != 0) {
                anodei = colocaPadres(arrayCheckedPara[i]);
                /* else
                 anodei = {
                 idgrupo: arrayCheckedPara[i].attributes.idgrupo,
                 idusuario: arrayCheckedPara[i].attributes.idusuario,
                 tipo: arrayCheckedPara[i].attributes.tipo,
                 denominacion: arrayCheckedPara[i].text
                 };*/
                arraypermsospara.push(anodei);
            }
        }

        var restriccion = 0;
        for (var i = 0; i < arrayCheckedSobre.length; i++) {
            if (arrayCheckedSobre[i].attributes.superior == 1) {
                restriccion = CompararPermiso(arrayCheckedSobre[i], arrPermisos);
            }
            //if (arrayCheckedSobre[i].parentNode && !arrayCheckedSobre[i].parentNode.attributes.checked)
            if (arrayCheckedSobre[i].parentNode.id != 0) {
                anodei = colocaPadres(arrayCheckedSobre[i]);
                /*else
                 anodei = {
                 idgrupo: arrayCheckedSobre[i].attributes.idgrupo,
                 idusuario: arrayCheckedSobre[i].attributes.idusuario,
                 tipo: arrayCheckedSobre[i].attributes.tipo,
                 denominacion: arrayCheckedPara[i].text
                 };*/
                arraypermsossobre.push(anodei);
            }
        }
        if (restriccion == 1) {
            _this.BarraProgresoPermisos.hide();
            mostrarMensaje(3, 'Usted est&aacute; otorgando sobre un usuario o grupo del nivel superior un permiso mayor al que se le ha concedido.Por favor proceda a rectificar.', function () {

            });

        } else {
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/adicionarpermisos',
                params: {
                    arraypermsospara: Ext.encode(arraypermsospara),
                    arraypermsossobre: Ext.encode(arraypermsossobre),
                    arraypermisos: Ext.encode(arrPermisos)
                },
                callback: function (options, success, response) {
                    _this.BarraProgresoPermisos.hide();
                    var responseData = Ext.decode(response.responseText);
                    var msje = '';
                    var icno = 1;
                    if (responseData.mensaje == 1 && responseData.mensaje != 4) {

                        if (arraypermsospara.length > 1 || arraypermsossobre.length > 1) {
                            msje = 'Los permisos han sido adicionados satisfactoriamente.';
                        } else {
                            msje = 'El permiso ha sido adicionado satisfactoriamente.';
                        }
                        // icno = 3;
                        mostrarMensaje(icno, msje);
                        if (opcion == 'acep') {
                            VentanaDarPermiso.destroy();
                            _this.stPermisosOtorgados.reload({
                                params: {
                                    anode: null,
                                    start: pgultima
                                }
                            });
                            SetEstadoBotonesTbarGrid();
                        }
                        if (responseData.mensaje == 1 && opcion == 'apl') {
                            tpDarPermisoPara.getRootNode().reload();
                            tpPermisoSobre.getRootNode().reload();
                            _this.smPermisosOtorgados.clearSelections();
                            _this.stPermisosOtorgados.reload({
                                params: {
                                    anode: null,
                                    start: pgultima
                                }
                            });
                            SetEstadoBotonesTbarGrid();
                        }

                    } else if (responseData.mensaje == 4) {
                        mostrarMensaje(1, 'Ya existe una configuración de usuario con este permiso definido.');
                    }
                }
            });
        }
    }

    /*funcion para modificar permisos */
    function ModificarPermisos() {
        var arrPermisos = {};
        var leer = 0;
        if (Ext.getCmp('chleerm').getValue()) {
            leer = 1;
        }
        arrPermisos.leer = leer;
        var anadir = 0;
        if (Ext.getCmp('ckannadirm').getValue()) {
            anadir = 1;
        }
        arrPermisos.anadir = anadir;
        var modificar = 0;
        if (Ext.getCmp('ckeditarm').getValue()) {
            modificar = 1;
        }
        arrPermisos.modificar = modificar;
        var eliminar = 0;
        if (Ext.getCmp('ckeliminarm').getValue()) {
            eliminar = 1;
        }
        arrPermisos.eliminar = eliminar;
        _this.BarraProgresoPermisos.show('Guardando datos del permiso');
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/modificarpermisos',
            params: {
                arrayidpermiso: Ext.encode(totalidpermisos),
                arraypermisos: Ext.encode(arrPermisos)
            },
            callback: function (options, success, response) {
                _this.BarraProgresoPermisos.hide();
                var responseData = Ext.decode(response.responseText);
                var msje = 'El permiso ha sido modificado satisfactoriamente.';
                var icno = 1;
                mostrarMensaje(1, msje);
                VentanaModificarPermiso.destroy();
                _this.stPermisosOtorgados.reload({
                    params: {
                        anode: null
                    }
                });
                SetEstadoBotonesTbarGrid();
            }
        });
    }

    /*funcion para confirmar la eliminacion de permisos*/
    function ConfirmarEliminacion() {
        var mensaje = '';
        if (_this.smPermisosOtorgados.getSelections().length == 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar el permiso seleccionado?';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar los permisos seleccionados?';
        }
        mostrarMensaje(2, mensaje, EliminarPermisos);
    }

    /*funcion para eliminar permisos */
    function EliminarPermisos(btnEli) {
        var mensajemask = '';
        var mensajeaccion = '';

        if (_this.smPermisosOtorgados.getSelections().length == 1) {
            mensajemask = 'Eliminando datos del permiso';
            mensajeaccion = 'El permiso ha sido eliminado satisfactoriamente.';
        } else {
            mensajemask = 'Eliminando datos de los permisos';
            mensajeaccion = 'Los permisos han sido eliminados satisfactoriamente.';
        }
        if (btnEli == 'ok') {
            _this.BarraProgresoPermisos.show(mensajemask);
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/eliminarpermisos',
                params: {
                    arrayidpermiso: Ext.encode(totalidpermisos)
                },
                callback: function (options, success, response) {
                    _this.BarraProgresoPermisos.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, mensajeaccion);
                        if (_this.stPermisosOtorgados.getCount() == totalidpermisos.length) {
                        }
                        _this.smPermisosOtorgados.clearSelections();
                        SetEstadoBotonesTbarGrid();
                        _this.stPermisosOtorgados.reload({
                            params: {
                                start: pgactual
                            }
                        });
                    } else {
                        mostrarMensaje(responseData.mensaje, mensajeaccion, function () {
                            _this.stPermisosOtorgados.load();
                            _this.smPermisosOtorgados.clearSelections();
                            SetEstadoBotonesTbarGrid();
                        });
                    }
                }
            });
        }
    }

    /*funcion complementaria para poder armar el arreglo de grupos y usuarios en la gestion de permisos
     */
    function colocaPadres(nodo) {
        var anodei = {};
        //if (nodo.parentNode && !nodo.parentNode.attributes.checked) {
        if (nodo.parentNode.id != 0)
            anodei = {
                idgrupo: nodo.attributes.idgrupo,
                idusuario: nodo.attributes.idusuario,
                tipo: nodo.attributes.tipo,
                denominacion: nodo.text
            };
        else
            anodei = {
                idgrupo: nodo.attributes.idgrupo,
                idusuario: nodo.attributes.idusuario,
                tipo: nodo.attributes.tipo,
                denominacion: nodo.text
            };
        //}
        return anodei;
    }


    function ActualizarPermisos() {
        _this.stPermisos.load();
    }

    function CompararPermiso(nodo, arrPermisos) {
        if (tpPermisoSobre.getNodeById('nodo4').contains(nodo)) {
            var numpermisootorgado = 0;
            if (arrPermisos.leer == 1) {
                numpermisootorgado = numpermisootorgado + 1;
            }
            if (arrPermisos.anadir == 1) {
                numpermisootorgado = numpermisootorgado + 2;
            }
            if (arrPermisos.modificar == 1) {
                numpermisootorgado = numpermisootorgado + 4;
            }
            if (arrPermisos.eliminar == 1) {
                numpermisootorgado = numpermisootorgado + 8;
            }
            var numpermisonodo = 0;
            if (nodo.attributes.leer == 1) {
                numpermisonodo = numpermisonodo + 1;
            }
            if (nodo.attributes.adicionar == 1) {
                numpermisonodo = numpermisonodo + 2;
            }
            if (nodo.attributes.modificar == 1) {
                numpermisonodo = numpermisonodo + 4;
            }
            if (nodo.attributes.eliminar == 1) {
                numpermisonodo = numpermisonodo + 8;
            }
            if (numpermisootorgado > numpermisonodo) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    function ConfigurarPermisosSub() {
        var arraysubordinadoscheck = tpsubordinados.getChecked();
        var arraysubordinados = [];
        var subordinado = {};
        if (arraysubordinadoseliminar.length > 0 || arraysubordinadoscheck.length > 0) {
            if (arraysubordinadoscheck.length == 1 && arraysubordinadoscheck[0].id == 'nodo2') {
                mostrarMensaje(1, 'Debe seleccionar al menos un usuario.');
            } else {
                _this.BarraProgresoPermisos.show('Configurando permisos sobre usuarios subordinados');
                for (var i = 0; i < arraysubordinadoscheck.length; i++) {
                    if (arraysubordinadoscheck[i].id != 'nodo2') {
                        var den = arraysubordinadoscheck[i].text.split("> ");
                        subordinado = {
                            idusuario: arraysubordinadoscheck[i].attributes.idusuario,
                            denominacion: (den.length > 0) ? den[1] : arraysubordinadoscheck[i].text
                        };
                        arraysubordinados.push(subordinado);
                    }
                }
                Ext.Ajax.request({
                    url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/configurarpermisossub',
                    params: {
                        arraysubordinados: Ext.encode(arraysubordinados),
                        arraysubordinadoseliminar: Ext.encode(arraysubordinadoseliminar)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgresoPermisos.hide();
                        var responseData = Ext.decode(response.responseText);
                        var mensaje = '';
                        if (responseData.mensajeadicionar == 1 || responseData.mensajeeliminar == 1) {
                            mensaje = 'Permisos ';
                            var mensaje2 = 'El(Los) usuario(s) subordinado(s) ha(n) sido configurado(s) satisfactoriamente.';
                            if (responseData.mensajeadicionar == 1) {
                                mensaje = mensaje + 'generados ';
                            }
                            if (responseData.mensajeeliminar == 1) {
                                if (responseData.mensajeadicionar == 1) {
                                    mensaje = mensaje + 'y ';
                                }
                                mensaje = mensaje + 'eliminados ';
                            }
                            mensaje = mensaje + 'satisfactoriamente. ';
                            mostrarMensaje(1, mensaje2);
                            arraysubordinadoseliminar = [];
                            wConfigSubordinados.destroy();
                            _this.stPermisos.load({params: {start: 0}});
                        }
                        if (responseData.mensajeadicionar > 1) {
                            mensaje = mensaje + 'El(los) permiso(s) sobre el(los) siguiente(s) usuario(s) no se ha(n)' +
                                ' podido adicionar debido a que ya usted existe como subordinado en ellos: ';
                            for (var i = 0; i < responseData.cantidad; i++) {
                                mensaje = mensaje + responseData.subordinadosinversos[i].denominacion;
                                if (i != (responseData.cantidad - 1)) {
                                    mensaje = mensaje + ', ';
                                }
                            }
                            mensaje = mensaje + '.';
                            mostrarMensaje(1, mensaje);
                            arraysubordinadoseliminar = [];
                            _this.stPermisos.load({params: {start: 0}});
                            tpsubordinados.root.reload();
                        }
                    }
                });
            }
        } else {
            mostrarMensaje(1, 'Debe seleccionar al menos un usuario.');
        }
    }

    function ActualizarPermisos() {
        _this.BarraProgresoPermisos.show('Actualizando los permisos');
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/actualizarpermisos',
            callback: function (options, success, response) {
                _this.BarraProgresoPermisos.hide();
                var responseData = Ext.decode(response.responseText);
                var mensaje = 'No se pudieron actualizar los permisos satisfactoriamente.';
                var icon = 3;
                if (responseData.mensaje == 1) {
                    mensaje = 'Permisos actualizados satisfactoriamente.';
                    icon = 1;
                }
                mostrarMensaje(icon, mensaje, function () {
                    _this.stPermisos.load();
                });
            }
        });
    }

    function ReorganizarSubordinacion() {
        _this.BarraProgresoPermisos.show('Reorganizando subordinacion de usuarios');
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/reorganizarsubordinacion',
            callback: function (options, success, response) {
                _this.BarraProgresoPermisos.hide();
                var responseData = Ext.decode(response.responseText);
                var mensaje = 'No se pudo reorganizar la subordinacion satisfactoriamente.';
                var icon = 3;
                if (responseData.mensaje == 1) {
                    mensaje = 'Subordinacion reorganizada satisfactoriamente.';
                    icon = 1;
                }
                mostrarMensaje(1, mensaje);
                tpsubordinacion.getRootNode().reload();
            }
        });
    }

    function BuscarSubordinados() {
        if (tpsubordinados.getRootNode().hasChildNodes()) {
            var denominacionbusqueda = tfbuscarInv.getValue().toLowerCase();
            tpsubordinados.getRootNode().eachChild(function (node) {
                var denominacionnodo = node.text.toLowerCase();
                if (denominacionnodo.indexOf(denominacionbusqueda) != -1) {
                    node.ui.show();
                } else {
                    node.ui.hide();
                }
            });
        }
    }

    function BuscarSubordinadosArbol() {
        if (tpsubordinacion.getRootNode().hasChildNodes()) {
            var denominacionbusqueda = tfbuscarSub.getValue().toLowerCase();
		        tpsubordinacion.getRootNode().eachChild(function (node) {
                var denominacionnodo = node.text.toLowerCase();
                if (denominacionnodo.indexOf(denominacionbusqueda) != -1) {
                    node.ui.show();
                } else {
                    node.ui.hide();
                }
            });
        }
    }

    function compararArray(arrayIni, arrayTemp) {
        var contador = 0;
        var parada = 0;
        if (arrayIni.length == arrayTemp.length) {
            for (var i = 0; i < arrayIni.length; i++) {
                for (var j = 0; j < arrayTemp.length; j++) {
                    if (arrayIni[i] == arrayTemp[j]) {
                        contador++;
                        break;
                    } else
                        parada++;
                }
                if (parada == arrayTemp.length) {
                    return false;
                    break;
                }
                else
                    parada = 0;
            }
            if (contador == arrayIni.length)
                return true;
        } else
            return false;
    }

    function CrearVentanaConfigurarSubordinados() {
        if (wConfigSubordinados)
            wConfigSubordinados.destroy();
        //campo de busqueda de usuarios
        tfbuscarInv = new Ext.form.TextField({
            id: 'tfbuscarInv',
            prevTab: 'idbtnaceptarSub',
            enableKeyEvents: true,
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            maxLength: 255,
            width: 200,
            listeners: {
                keyup: function (tf, e) {
                    BuscarSubordinados();
                }
            }
        });
        //arbol donde muesto los usuarios
        tpsubordinados = new Ext.tree.TreePanel({
            id: 'tpsubordinados',
            autoScroll: true,
            tbar: ['Buscar: ', tfbuscarInv, '->',
                {
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        tpsubordinados.root.expand(true);
                    }
                }, {
                    iconCls: 'contraer',
                    tooltip: 'Contraer agrupación ',
                    handler: function () {
                        tpsubordinados.root.collapse(true);
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación ',
                    handler: function () {
                        tpsubordinados.getRootNode().reload();
                    }
                }
            ],
            listeners: {
                'checkchange': function (nodo, check) {
                    arrayTempSub = tpsubordinados.getChecked('id');
                    if (compararArray(arrayIniSub, arrayTempSub))
                        Ext.getCmp('idbtnaceptarSub').setDisabled(true);
                    else
                        Ext.getCmp('idbtnaceptarSub').setDisabled(false);
                }
            },
            root: {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                text: 'Usuarios subordinados',
                checked: false,
                leaf: false
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargarsubordinados',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo
                        };
                        arrayTempSub = [];
                    },
                    'load': function (atreeloader, anode) {
                        arrayIniSub = tpsubordinados.getChecked('id');
                    }
                }
            })
        });
        tpsubordinados.on('checkchange', alChekNodo);
        tpsubordinados.on('load', chekHijosSiChekPadre);
        //ventana donde muestro los usuarios
        wConfigSubordinados = new Ext.Window({
            constrain: true,
            title: 'Configurar subordinados',
            width: 330,
            height: 380,
            layout: 'fit',
            modal: true,
            //autoValidate: true,
            items: [tpsubordinados],
            buttons: [
                new Ext.Button({
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    handler: function () {
                        wConfigSubordinados.destroy();
                    },
                    tooltip: 'Cerrar ventana sin guardar los datos'
                }),
                new Ext.Button({
                    id: 'idbtnaceptarSub',
                    iconCls: 'aceptar',
                    disabled: true,
                    nextTab: 'tfbuscarInv',
                    text: 'Aceptar',
                    handler: function () {
                        ConfigurarPermisosSub();
                    },
                    tooltip: 'Guardar datos y cerrar ventana'
                })
            ]
        });
        wConfigSubordinados.show();
        tfbuscarInv.focus(false, 1024);
        tpsubordinados.getRootNode().reload();
    }

    function CrearVentanaArbolSubordinacion() {
        if (winArbolSubordinacion)
            winArbolSubordinacion.destroy();
        //arbol donde muesto los usuarios

		    tfbuscarSub = new Ext.form.TextField({
				    id: 'tfbuscarSub',
				    enableKeyEvents: true,
				    regex: _this.ObjValidaciones.expresionRegular('denominacion'),
				    maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
				    regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
				    vtype: 'validarEspaciosEnBlanco',
				    maxLength: 255,
				    width: 200,
				    listeners: {
						    keyup: function (tf, e) {
								    BuscarSubordinadosArbol();
						    }
				    }
		    });

        tpsubordinacion = new Ext.tree.TreePanel({
            autoScroll: true,
            tbar: ['Buscar: ', tfbuscarSub, '->',
                {
                    id: 'expanSubDirecta',
                    nextTab: 'contraerSubDirecta',
                    prevTab: 'cerrarSubDirecta',
                    iconCls: 'expandir',
                    tooltip: 'Expandir todo el árbol de subordinaci&oacute;n',
                    handler: function () {
                        tpsubordinacion.root.expand(true);
                    }
                }, {
                    id: 'contraerSubDirecta',
                    nextTab: 'actualSubDirecta',
                    prevTab: 'expanSubDirecta',
                    iconCls: 'contraer',
                    tooltip: 'Contraer todo el árbol de subordinaci&oacute;n ',
                    handler: function () {
                        tpsubordinacion.root.collapse(true);
                    }
                }, {
                    id: 'actualSubDirecta',
                    nextTab: 'cerrarSubDirecta',
                    prevTab: 'contraerSubDirecta',
                    iconCls: 'actualizar',
                    tooltip: 'Actualizar el árbol de subordinaci&oacute;n ',
                    handler: function () {
                        tpsubordinacion.getRootNode().reload();
                        //ReorganizarSubordinacion();
                    }
                }
            ],
            bbar: ['Leyenda: ', ' ',
                {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-usuario"></span></center>'
                }, 'Subordinados directos ', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-persona"></span></center>'
                }, 'Subordinados indirectos'
            ],
            listeners: {
                'click': function (anode) {
                    setFocusBtnCerrarSubDirecta();
                },
                collapsenode: function (anode) {
                    setFocusBtnCerrarSubDirecta();
                },
                expandnode: function (anode) {
                    setFocusBtnCerrarSubDirecta();
                },
            },
            root: {
                nodeType: 'async',
                id: 0,
                idsubordinado: 0,
                text: 'Cadena de subordinaci&oacute;n',
                leaf: false
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargarcadenasubordinacion',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            idsubordinado: anode.attributes.idsubordinado
                        };
                    }
                }
            })
        });
        //ventana donde muestro los usuarios
        winArbolSubordinacion = new Ext.Window({
            title: 'Árbol de subordinaci&oacute;n',
            width: 350,
            constrain: true,
            height: 450,
            layout: 'fit',
            modal: true,
            items: tpsubordinacion,
            buttons: [
                new Ext.Button({
                    id: 'cerrarSubDirecta',
                    nextTab: 'expanSubDirecta',
                    prevTab: 'actualSubDirecta',
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    handler: function () {
                        winArbolSubordinacion.destroy();
                    },
                    tooltip: 'Cerrar ventana'
                })
            ],
            listeners: {
                move: function (cmp) {
                    setFocusBtnCerrarSubDirecta();
                },
                resize: function (cmp) {
                    setFocusBtnCerrarSubDirecta();
                }
            }
        });
        winArbolSubordinacion.show();
        setFocusBtnCerrarSubDirecta();
        /*setTimeout(function () {
         Ext.getCmp('cerrarSubDirecta').focus(true);
         }, 500);*/
        tpsubordinacion.getRootNode().reload();

        function setFocusBtnCerrarSubDirecta() {
            setTimeout(function () {
                Ext.getCmp('cerrarSubDirecta').focus(true);
            }, 500);
        }
    }

    this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        closable: false,
        maximized: true,
        modal: true,
        width: 1000,
        height: 510,
        items: _this.panelPermisos
    });

    this.CargarCmpGestionarPermiso = function () {
        _this.WinPrincipal.show();
    };

    this.getPanelPermisosOtorgados = function () {
        return _this.panelpermisosotorgpormi;
    };

    if (opcionesConfig.subsistemaLlamada == "integracion") {
        var paneles = {
            panelPermisosOtorgados: _this.panelpermisosotorgpormi,
            panelPermisosRecibidos: _this.panelmispermisos,
            stPermisos: _this.stPermisos,
            stPermisosOtorgados: _this.stPermisosOtorgados
        };
        return paneles;
    }

}


