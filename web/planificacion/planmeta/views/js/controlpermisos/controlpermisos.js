var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controlpermisos', cargarInterfaz);
var temp = window.location.pathname;
var url = temp.substr(1);
//variable generales
var idfuncionalidad = window.frameElement.id, nodo = null, stUsuario, nodoEst = null;
var offsetPermisos = 0;
//construir la interfaz
function cargarInterfaz() {
    btnAyudaControlPermiso = new Ext.Button({
        id: 'idbtnAyudaControlPermiso',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtbtnAyu
    });
    //mascara de cargando
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });

    //Panel de las funcionalidades    
    loaderFuncionalidades = new Ext.tree.TreeLoader({
        dataUrl: 'cargarFuncionalidades'
    });
    panelFuncionalidades = new Ext.tree.TreePanel({
        region: 'west',
        title: perfil.etiquetas.lbFuncionalidades,
        autoScroll: true,
        border: false,
        width: 350,
        collapsible: true,
        split: true,
        loader: loaderFuncionalidades,
        listeners: {
            click: function (n, check) {
                nodo = n.id;
                if (nodo != 0) {
                    tpEstructura.enable();
                    if (nodoEst != null)
                        if (nodoEst.id != 'Estructuras')
                            storePermisos.reload();
                } else {
                    tpEstructura.disable();
                    gpPermisos.disable();
                }
            }
        },
        root: {
            nodeType: 'async',
            id: '0',
            text: perfil.etiquetas.lbFuncionalidades,
            expanded: true,
            tipo: 0,
            leaf: false
        }
    });

    //Para el trabajo con los usuarios a partir de 'idusuario'
    stUsuario = new Ext.data.Store({
        url: 'cargarUsuarios',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }])
    });
    stUsuario.reload();
    //Fin del store Usuarios
    //colum model del grid
    var chkadicionar = new Ext.grid.CheckColumn({
        header: perfil.etiquetas.lbAdicionar,
        tooltip: perfil.etiquetas.lbAdicionar,
        sortable: true,
        dataIndex: 'adicionar',
        editable: true,
        editor: {
            xtype: 'checkbox'/*,
             cls: 'x-grid-checkheader-editor'*/
        },
        width: 75
    });
    var chkmodificar = new Ext.grid.CheckColumn({
        header: perfil.etiquetas.lbModificar,
        tooltip: perfil.etiquetas.lbModificar,
        sortable: true,
        dataIndex: 'modificar',
        editable: true,
        editor: {
            xtype: 'checkbox'/*,
             cls: 'x-grid-checkheader-editor'*/
        },
        width: 75
    });
    var chkeliminar = new Ext.grid.CheckColumn({
        header: perfil.etiquetas.lbEliminar,
        tooltip: perfil.etiquetas.lbEliminar,
        sortable: true,
        dataIndex: 'eliminar',
        editable: true,
        editor: {
            xtype: 'checkbox'/*,
             cls: 'x-grid-checkheader-editor'*/
        },
        width: 75
    });
    cmPermisos = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbEntidad,
            tooltip: perfil.etiquetas.lbEntidad,
            id: 'Entidad',
            sortable: true,
            dataIndex: 'identidad',
            renderer: setEntidad
        },
        chkadicionar,
        chkmodificar,
        chkeliminar,
        {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            id: 'idusuario',
            sortable: true,
            align: 'right',
            hidden: true,
            dataIndex: 'idusuario',
            renderer: setUsuarios
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFechaU,
            width: 150,
            sortable: true,
            align: 'center',
            hidden: true,
            dataIndex: 'fecha',
            renderer: crearToolTip
        }
    ]);
    cmPermisos.defaultSortable = true;
    //store de las entidades del grid
    stEntidad = new Ext.data.Store({
        url: 'obtenerEntidadesHijas',
        listeners: {
            beforeload: function (st, opt) {
                mymask.show();
                this.baseParams.identidad = nodoEst.attributes.id;
                this.baseParams.denomentidad = nodoEst.attributes.denominacion;
            },
            load: function () {
                mymask.hide();
                storePermisos.reload();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });

    //filtros del grid de los permisos
    filtrospermisos = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'identidad',
                idcombo: 'cbEntidad',
                valueFieldcb: 'identidad',
                displayFieldcb: 'denominacion',
                st: stEntidad,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'adicionar',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'modificar',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'eliminar',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuario',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuario,
                autoload: false,
                mode: 'local'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }]
    });

    // ********** SelectionModel del Grid permisos ***************
    smPermisos = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        id: 'smPermisos'
    });

    //store del grid de los permisos
    storePermisos = new Ext.data.Store({
        url: 'listarPermisos',
        method: 'POST',
        listeners: {
            beforeload: function (st, opt) {
                mymask.show();
                this.baseParams.identidad = nodoEst.attributes.id;
                this.baseParams.idfuncionalidad = nodo;
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.idestado = cbEstadosEjercicio.getValue();
                this.baseParams.start = offsetPermisos;
            },
            load: function (t) {
                if (filtrospermisos.getFiltrosActivos().length > 0 && storePermisos.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                } else if (storePermisos.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                }
                btnGuardar.disable();
                mymask.hide();
                cambiarTituloFiltrar(gpPermisos, filtrospermisos, perfil.etiquetas.lbPermisos);
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idcontrolpermiso',
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'identidad'
            }, {
                name: 'idusuario'
            }, {
                name: 'adicionar'
            }, {
                name: 'modificar'
            }, {
                name: 'eliminar'
            }, {
                name: 'idcontrolpermiso'
            }, {
                name: 'fecha'
            }
        ])
    });

    //store del combo de los ejercicios
    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }])
    });

    //store del combo de los estados
    stcbEstadosEjercicio = new Ext.data.Store({
        url: 'getEstados',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                cbEstadosEjercicio.setValue(stcbEstadosEjercicio.data.items[0].id);
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'estado'
            }])
    });

    //combo de los ejercicios
    cbEjercicio = new Ext.form.ComboBox({
        store: stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEjercicio,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                storePermisos.reload();
            }
        }
    });

    //combo de los estados
    cbEstadosEjercicio = new Ext.form.ComboBox({
        store: stcbEstadosEjercicio,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'estado',
        mode: 'local',
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEstado,
        loadingText: perfil.etiquetas.lbCargando,
        width: 180,
        listeners: {
            select: function (cb, rec, index) {
                storePermisos.reload();
            }
        }
    });
    //btn LimpiarFiltros
    btnLimpiarFiltros = new Ext.Button({
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrospermisos.clearFilters();
        }
    });
    //btnGuardar
    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        iconCls: 'guardar',
        disabled: true,
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            guardarPermisos();
        }
    });

    //Panel de las entidades
    tpEstructura = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    tpEstructura.btnBuscar.setText("");
    tpEstructura.btnLimpiar.setText("");
    tpEstructura = tpEstructura.items.items[0];
    tpEstructura.getRootNode().expand();
    tpEstructura.disable();
    tpEstructura.region = 'west';
    tpEstructura.width = 300;
    tpEstructura.split = true;
    tpEstructura.addListener('click', function (n) {
        nodoEst = n;
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        if (n.id != 'Estructuras') {
            gpPermisos.enable();
            panelFuncionalidades.enable();
            stEntidad.reload();
            gpPermisos.enable();
        } else {
            gpPermisos.disable();
            panelFuncionalidades.disable();
            if (storePermisos)
                storePermisos.loadData({"data": [], "total": 0});
        }
    });

    //panel de las estructuras
    pEstructuras = new Ext.Panel({
        title: perfil.etiquetas.lbEntidades,
        layout: 'fit',
        region: 'west',
        width: 250,
        collapsible: true,
        split: true,
        items: [tpEstructura]
    });
    //Grid panel de los permisos
    gpPermisos = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.lbPermisos,
        region: 'center',
        autoExpandColumn: 'Entidad',
        autoScroll: true,
        enableKeyEvents: true,
        id: 'gpPermisos',
        disabled: true,
        clicksToEdit: 2,
        stripeRows: true,
        store: storePermisos,
        sm: smPermisos,
        plugins: [chkadicionar, chkmodificar, chkeliminar, filtrospermisos],
        cm: cmPermisos,
        tbar: [{
                xtype: 'tbtext',
                text: perfil.etiquetas.lbEjercicio + ': '}, cbEjercicio, '-', {
                xtype: 'tbtext',
                text: perfil.etiquetas.lbEstado + ': '}, cbEstadosEjercicio, '-', btnGuardar, '-',
            new Ext.Toolbar.MenuButton({
                id: 'accionesmasivas',
                tooltip: {
                    text: perfil.etiquetas.lbAccionesMasivas
                },
                iconCls: 'acciones',
                menu: {
                    items: [{
                            id: 'btnPermisoAdicionarTodos',
                            iconCls: 'aceptar',
                            text: perfil.etiquetas.lbPermisoAdicionarTodos,
                            handler: function () {
                                asignarPermisoTodas('adicionar', false);
                            }
                        }, {
                            id: 'btnPermisoModificarTodos',
                            iconCls: 'aceptar',
                            text: perfil.etiquetas.lbPermisoModificarTodos,
                            handler: function () {
                                asignarPermisoTodas('modificar', false);
                            }
                        }, {
                            id: 'btnPermisoEliminarTodos',
                            iconCls: 'aceptar',
                            text: perfil.etiquetas.lbPermisoEliminarTodos,
                            handler: function () {
                                asignarPermisoTodas('eliminar', false);
                            }
                        }, {
                            id: 'btnQuitarPermisoAdicionarTodos',
                            iconCls: 'cancelar',
                            text: perfil.etiquetas.lbQuitarPermisoAdicionarTodos,
                            handler: function () {
                                quitarPermisoTodas('adicionar', false);
                            }
                        }, {
                            id: 'btnQuitarPermisoModificarTodos',
                            iconCls: 'cancelar',
                            text: perfil.etiquetas.lbQuitarPermisoModificarTodos,
                            handler: function () {
                                quitarPermisoTodas('modificar', false);
                            }
                        }, {
                            id: 'btnQuitarPermisoEliminarTodos',
                            iconCls: 'cancelar',
                            text: perfil.etiquetas.lbQuitarPermisoEliminarTodos,
                            handler: function () {
                                quitarPermisoTodas('eliminar', false);
                            }
                        }]
                }
            }), new Ext.Toolbar.MenuButton({
                id: 'accionesmasivasGlobal',
                tooltip: {
                    text: perfil.etiquetas.lbAccionesMasivasGlobal
                },
                iconCls: 'acciones',
                menu: {
                    items: [{
                            id: 'btnPermisoAdicionarTodosGlobal',
                            iconCls: 'aceptar',
                            text: perfil.etiquetas.lbPermisoAdicionarTodosGlobal,
                            handler: function () {
                                asignarPermisoTodas('adicionar', true);
                            }
                        }, {
                            id: 'btnPermisoModificarTodosGlobal',
                            iconCls: 'aceptar',
                            text: perfil.etiquetas.lbPermisoModificarTodosGlobal,
                            handler: function () {
                                asignarPermisoTodas('modificar', true);
                            }
                        }, {
                            id: 'btnPermisoEliminarTodosGlobal',
                            iconCls: 'aceptar',
                            text: perfil.etiquetas.lbPermisoEliminarTodosGlobal,
                            handler: function () {
                                asignarPermisoTodas('eliminar', true);
                            }
                        }, {
                            id: 'btnQuitarPermisoAdicionarTodosGlobal',
                            iconCls: 'cancelar',
                            text: perfil.etiquetas.lbQuitarPermisoAdicionarTodosGlobal,
                            handler: function () {
                                quitarPermisoTodas('adicionar', true);
                            }
                        }, {
                            id: 'btnQuitarPermisoModificarTodosGlobal',
                            iconCls: 'cancelar',
                            text: perfil.etiquetas.lbQuitarPermisoModificarTodosGlobal,
                            handler: function () {
                                quitarPermisoTodas('modificar', true);
                            }
                        }, {
                            id: 'btnQuitarPermisoEliminarTodosGlobal',
                            iconCls: 'cancelar',
                            text: perfil.etiquetas.lbQuitarPermisoEliminarTodosGlobal,
                            handler: function () {
                                quitarPermisoTodas('eliminar', true);
                            }
                        }]
                }
            })],
        listeners: {
            checkcolumn: function () {
                btnGuardar.enable();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: storePermisos,
            displayInfo: true,
            listeners: {
                beforechange: function (p, e) {
                    offsetPermisos = e.start;
                }
            },
            items: ['-', btnLimpiarFiltros]
        })
    });

    //panel General contiene el tree de las entidades y el grid de los permisos
    panelGeneral = new Ext.Panel({
        id: 'panelGeneral',
        disabled: false,
        region: 'center',
        split: true,
        layout: 'border',
        items: [pEstructuras, gpPermisos]
    });
    //panel del componente
    panelGen = new Ext.Panel({
        id: 'panelGen',
        tbar: ['->', btnAyudaControlPermiso],
        layout: 'border',
        items: [panelFuncionalidades, panelGeneral]
    });

    // viewport de la plantilla
    vpcontrolpermiso = new Ext.Viewport({
        layout: 'fit',
        id: 'vpcontrolpermiso',
        items: [panelGen]
    });
}

//metodo para renderizar los usuarios del gpPermisos
function setUsuarios(value, m) {
    for (i in stUsuario.data.items)
        if (stUsuario.data.items[i].data) {
            if (stUsuario.data.items[i].data.idusuario == value) {
                m.attr = 'ext:qtip="' + stUsuario.data.items[i].data.nombreusuario + '"';
                return stUsuario.data.items[i].data.nombreusuario;
            }
        } else {
            return ' ';
        }
}
//metodo para renderizar las entidades del gpPermisos
function setEntidad(value, m) {
    if (value == null) {
        m.attr = 'ext:qtip=""';
        return "";
    } else {
        for (var i = 0; i < stEntidad.data.items.length; i++)
            if (stEntidad.data.items[i].data.identidad == value) {
                m.attr = 'ext:qtip="' + stEntidad.data.items[i].data.denominacion + '"';
                return stEntidad.data.items[i].data.denominacion;
            }
        m.attr = 'ext:qtip="' + value + '"';
        return value;
    }
}
//metodo para guardar los Permisos
function guardarPermisos() {
    mymask.show();
    var records = gpPermisos.getStore().getModifiedRecords();
    var arreglo = [];
    while (records.length > 0) {
        var record = records.pop();
        var rec = record.getChanges();
        rec['idcontrolpermiso'] = record.data['idcontrolpermiso'];
        rec['identidad'] = record.data['identidad'];
        rec['adicionar'] = (record.data['adicionar'] === false) ? 0 : 1;
        rec['eliminar'] = (record.data['eliminar'] === false) ? 0 : 1;
        rec['modificar'] = (record.data['modificar'] === false) ? 0 : 1;
        arreglo.push(rec);
    }
    Ext.Ajax.request({
        url: 'guardarPermisos',
        params: {
            datos: Ext.encode(arreglo),
            idfuncionalidad: nodo,
            idejercicio: cbEjercicio.getValue(),
            idestado: cbEstadosEjercicio.getValue()
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarOK);
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarNo);
            }
            storePermisos.reload();
        }
    });
}

////
function asignarPermisoTodas(accion, global) {
    mymask.show();
    Ext.Ajax.request({
        url: 'asignarPermisoTodas',
        params: {
            idfuncionalidad: nodo,
            idejercicio: cbEjercicio.getValue(),
            idestado: cbEstadosEjercicio.getValue(),
            identidad: nodoEst.id,
            permiso: accion,
            global: global
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarOK);
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarNo);
            }
            storePermisos.reload();
        }
    });
}

function quitarPermisoTodas(accion, global) {
    mymask.show();
    Ext.Ajax.request({
        url: 'quitarPermisoTodas',
        params: {
            idfuncionalidad: nodo,
            idejercicio: cbEjercicio.getValue(),
            idestado: cbEstadosEjercicio.getValue(),
            identidad: nodoEst.id,
            permiso: accion,
            global: global
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarOK);
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbGuardarNo);
            }
            storePermisos.reload();
        }
    });
}
////

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

function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}