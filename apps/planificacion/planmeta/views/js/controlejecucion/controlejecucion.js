var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controlejecucion', cargarInterfaz);
Ext.QuickTips.init();
var valor;
var is_leaf, identidad, idactividad, selected, vstart, vlimit, vidusuario, vusuario;
var flag = true;
var urlUsuario = '../controlejecucion/cargarUsuarios';
flag3 = false;

function cargarInterfaz() {
    userLogeado();
    btnAyuControl = new Ext.Button({
        disabled: false,
        id: 'btnAyuControl',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAyu,
        text: perfil.etiquetas.lbBtnAyuda,
        handler: function() {
            mostrarAyuda('control', 'Control de la ejecuci&oacute;n');
        }
    });
    btnLimpiarControlGA = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarControlGA',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnLimpiar,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            filtrosgparriba.clearFilters();
        }
    });

    btnLimpiarControlGB = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarControlGB',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnLimpiar,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            filtrosgpabajo.clearFilters();
        }
    });
    btnAdicionarControl = new Ext.Button({
        disabled: false,
        id: 'btnAdicionarControl',
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAdd,
        text: perfil.etiquetas.lbBtnAdd,
        disabled : true,
                handler: function() {
            AdicionarControl();
        }
    });
    btnEliminarControl = new Ext.Button({
        disabled: true,
        id: 'btnEliminarControl',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnDel,
        text: perfil.etiquetas.lbBtnDel,
        handler: function() {
            comprobarSeleccion('eliminar');
        }
    });
    btnGuardarControl = new Ext.Button({
        disabled: true,
        id: 'btnGuardarControl',
        icon: perfil.dirImg + 'guardar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnGuardar,
        text: perfil.etiquetas.lbBtnGuardar,
        handler: function() {
            comprobarSeleccion('guardar');
        }
    });



    filtrosgparriba = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                xtype: 'numberfield',
                dataIndex: 'codigo',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividad'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadreal'
            }, {
                type: 'numeric',
                dataIndex: 'porciento'
            }]
    });

    starriba = new Ext.data.Store({
        url: 'listarActividades',
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
                name: 'nivelactividad'
            }, {
                name: 'nivelactividadreal'
            }, {
                name: 'porciento'
            }, {
                name: 'idactividadentidad'
            }]),
        listeners: {
            beforeload: function(st, opt) {
                vstart = opt.params.start;
                vlimit = opt.params.limit;
                starriba.baseParams.identidad = identidad;
                starriba.baseParams.is_leaf = is_leaf;
                cambiarTituloGpArriba();

            },
            load: function(st, rec, obt) {
                if (st.getCount() == 0) {
                    if (filtrosgparriba.getFiltrosActivos() == undefined || filtrosgparriba.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                        gpAbajo.getStore().removeAll();
                        gpAbajo.collapse(true);
                    }
                    siexisteArriba();

                }
                else if (flag3) {
                    smarriba.selectRow(selected);
                    flag3 = false;
                }
            }
        }
    });
    smarriba = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(a, b, c) {
                idactividad = c.data.idactividad;
                btnAdicionarControl.enable();
                if (is_leaf) {
                    stabajo.reload({
                        params: {
                            identidad: identidad,
                            idactividad: idactividad,
                            start: 0,
                            limit: 20
                        }
                    })
                }
            },
            rowdeselect: function(a, b, c) {
                btnAdicionarControl.disable();
                btnEliminarControl.disable();
                btnGuardarControl.disable();
                stabajo.removeAll();
            }
        }

    });
    cmarriba = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip,
            tooltip: 'Codigo de la actividad'
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip,
            tooltip: 'Denominación de la actividad'

        }, {
            header: perfil.etiquetas.lbNAP,
            width: 150,
            sortable: true,
            dataIndex: 'nivelactividad',
            tooltip: 'Nivel actividad planificado',
            renderer: NivelACt,
            align: 'center'
        }, {
            header: perfil.etiquetas.lbNAR,
            width: 150,
            sortable: true,
            dataIndex: 'nivelactividadreal',
            tooltip: 'Nivel actividad ejecutado',
            renderer: NivelACtReal,
            align: 'center'
        }, {
            header: perfil.etiquetas.lbPorciento,
            width: 110,
            sortable: true,
            dataIndex: 'porciento',
            tooltip: 'Cumplimiento',
            renderer: CalculoPorciento,
            align: 'center'
        }]);

    filtrosgpabajo = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'nivelactividadreal'
            }, {
                type: 'date',
                dataIndex: 'fechareal',
                dateFormat: 'Y-m-d'
            }, {
                type: 'listado',
                dataIndex: 'usuario',
                idcombo: 'idusuario',
                urlcb: urlUsuario,
                idstore: 'idsusuario',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario'
            }, {
                type: 'boolean',
                dataIndex: 'fin'
            }]
    });
    stabajo = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarnNivelesporActividad',
        pruneModifiedRecords: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idnivelactividadporfechareal'
        }, [{
                name: 'idnivelactividadporfechareal'
            }, {
                name: 'idactividadentidad'
            }, {
                name: 'nivelactividadreal'
            }, {
                name: 'fechareal'
            }, {
                name: 'usuario'
            }, {
                name: 'idusuario'
            }, {
                name: 'fin'
            }]),
        listeners: {
            beforeload: function() {
                stabajo.baseParams.idactividad = idactividad;
                stabajo.baseParams.identidad = identidad;
                cambiarTituloGpAbajo();

            },
            load: function(t, re, o) {
                siexisteNiveles();
                if (is_leaf && re.length > 0)
                    gpAbajo.expand(true);
                else
                    gpAbajo.collapse(true)

            }
        }
    });
    smabajo = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(a, b, c) {
                btnEliminarControl.enable();
            },
            rowdeselect: function(a, b, c) {
                btnEliminarControl.disable();
                btnGuardarControl.disable();
            }
        }
    });
    cmabajo = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbNA,
            id: 'expandir',
            sortable: true,
            dataIndex: 'nivelactividadreal',
            editor: new Ext.form.NumberField({
                allowBlank: false,
                maxLength: 16,
                allowNegative: false
            }),
            renderer: renderterminada
        }, {
            header: perfil.etiquetas.lbFecha,
            sortable: true,
            width: 120,
            dataIndex: 'fechareal',
            renderer: InsertarFecha
        }, {
            header: perfil.etiquetas.lbUsuario,
            sortable: true,
            dataIndex: 'usuario',
            renderer: Usuario
        }]);

    gpArriba = new Ext.grid.GridPanel(
            {
                frame: true,
                autoExpandColumn: 'expandir',
                title: 'Niveles de Actividades',
                store: starriba,
                loadMask: true,
                plugins: filtrosgparriba,
                cm: cmarriba,
                region: 'center',
                height: 100,
                margins: '2 2 2 -4',
                sm: smarriba,
                bbar: new Ext.PagingToolbar({
                    pageSize: 20,
                    store: starriba,
                    displayInfo: true,
                    items: [btnLimpiarControlGA]
                })
            });


    gpAbajo = new Ext.grid.EditorGridPanel(
            {
                frame: true,
                title: 'Control de niveles',
                collapsible: true,
                collapsed: true,
                hidden: true,
                autoExpandColumn: 'expandir',
                loadMask: true,
                store: stabajo,
                plugins: filtrosgpabajo,
                cm: cmabajo,
                sm: smabajo,
                region: 'south',
                stripeRows: true,
                split: true,
                height: 300,
                margins: '2 2 2 -4',
                tbar: [btnAdicionarControl, btnEliminarControl, btnGuardarControl, '->', btnLimpiarControlGB],
                bbar: new Ext.PagingToolbar({
                    pageSize: 20,
                    store: stabajo,
                    displayInfo: true,
                    items: []
                }),
                menu: new Ext.menu.Menu({
                    id: 'mdGridFin'

                }),
                listeners: {
                    afteredit: function(e)
                    {
                        if (e.value != e.originalValue)
                            btnGuardarControl.enable();
                    },
                    rowcontextmenu: function(g, r, e) {
                        var menuItemFin = new Ext.menu.Item({
                            text: 'Nivel de actividad final',
                            iconCls: 'btn',
                            id: 'idfin',
                            handler: function() {
                                idnivelactividadporfechareal = smabajo.getSelected().data.idnivelactividadporfechareal;
                                Ext.Ajax.request({
                                    url: 'estadoActividad',
                                    params: {
                                        idnivelactividadporfechareal: idnivelactividadporfechareal,
                                        idactividadentidad: smabajo.getSelected().data.idactividadentidad,
                                        fin: 1
                                    },
                                    callback: function(options, success, response) {
                                        responseData = Ext.decode(response.responseText);
                                        if (responseData.codMsg == 3) {
                                            mostrarMensaje(3, 'Error');
                                        }
                                        else if (responseData.codMsg == 2) {
                                            mostrarMensaje(1, 'Ya existe un fin');
                                        }
                                        else {
                                            stabajo.reload();
                                        }
                                    }
                                });
                            }
                        });
                        var menuItemNoFin = new Ext.menu.Item({
                            text: 'Nivel de actividad no final',
                            iconCls: 'btn',
                            id: 'idfin',
                            handler: function() {
                                idnivelactividadporfechareal = smabajo.getSelected().data.idnivelactividadporfechareal;
                                Ext.Ajax.request({
                                    url: 'estadoActividad',
                                    params: {
                                        idnivelactividadporfechareal: idnivelactividadporfechareal,
                                        fin: 0
                                    },
                                    callback: function(options, success, response) {
                                        responseData = Ext.decode(response.responseText);
                                        if (responseData.codMsg == 3) {
                                            mostrarMensaje(3, 'Error');
                                        }
                                        else {

                                            stabajo.reload();
                                        }
                                    }
                                });
                            }
                        });
                        e.stopEvent();
                        gpAbajo.getSelectionModel().selectRow(r);
                        record_selected = g.getStore().getAt(r);
                        gpAbajo.menu.removeAll();
                        if (record_selected.data.fin == 0)
                        {
                            gpAbajo.menu.add(menuItemFin);
                        }

                        if (record_selected.data.fin == 1)
                        {
                            gpAbajo.menu.add(menuItemNoFin);
                        }

                        gpAbajo.menu.showAt(e.getXY());
                    }
                }
            });
    pGridArribaAbajo = new Ext.Panel({
        id: 'pGridArribaAbajo',
        region: 'center',
        titleCollapse: true,
        split: true,
        layout: 'border',
        items: [gpAbajo, gpArriba]
    });

   /*trEntControl = new Ext.estructura.panel.PanelEstructura(
        {
            cargos:false,
            menu:false,
            width:300

        });

    trEntControl.addListener('click',function(node,event){
        identidad = node.id;
        is_leaf = node.leaf;
        smarriba.clearSelections();
        stabajo.removeAll();
        if (!is_leaf) {
            gpAbajo.hide();
            myView.render();
        } else {
            gpAbajo.show();
            myView.render();
        }
        starriba.reload({
            params: {
                identidad: node.id,
                start: 0,
                limit: 20,
                is_leaf: node.leaf
            }
        });

    });*/



    trEntControl = new Ext.tree.TreePanel({
        frame: false,
        region: 'west',
        rootVisible: false,
        collapsible: true,
        autoScroll: true,
        height: 200,
        id: 'trEntControl',
        layout: 'fit',
        split: true,
        border: false,
        tbar: [{
                iconCls: 'icon-expand-all',
                tooltip: 'Expandir todas las entidades',
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function() {
                    Ext.getCmp('trEntControl').root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Colapsar todas las entidades',
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function() {
                    Ext.getCmp('trEntControl').root.collapse(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Refrescar todas las entidades',
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function() {
                }
            }, '-', {
                xtype: 'textfield',
                emptyText: 'Filtrar entidad...',
                width: 110,
                id: 'idfiltroentidadControl',
                listeners: {
                    specialkey: function(t, e) {
                        if (e.getKey() == '13') {
                            actualizararbol(Ext.getCmp('trEntControl'));
                        }
                    }
                }
            }],
        root: new Ext.tree.AsyncTreeNode({
            text: perfil.etiquetas.lbEntidades,
            tipo: 0,
            id: '0'
        }),
        listeners: {
            click: function(node, e) {
                identidad = node.id;
                is_leaf = node.leaf;
                smarriba.clearSelections();
                stabajo.removeAll();
                if (!is_leaf) {
                    gpAbajo.hide();
                    myView.render();
                } else {
                    gpAbajo.show();
                    myView.render();
                }
                starriba.reload({
                    params: {
                        identidad: node.id,
                        start: 0,
                        limit: 20,
                        is_leaf: node.leaf
                    }
                });
            }
        },
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarEntidades',
            preloadChildren: false,
            listeners: {
                beforeload: function(tree, node, res) {
                    tree.baseParams.valor = Ext.getCmp('idfiltroentidadControl').getValue();
                }
            }
        })
    });

    pEntControl = new Ext.Panel({
        title: 'Entidades',
        frame: false,
        id: 'pEntControl',
        region: 'west',
        collapsible: true,
        titleCollapse: true,
        split: true,
        width: 200,
        layout: 'fit',
        items: [trEntControl]
    });

    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            items: [pEntControl, pGridArribaAbajo],
            tbar: ['->', btnAyuControl]
        })
    });

    trEntControl.getRootNode().expand();

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Gg',
            alt: true,
            fn: function() {
                if (!btnGuardarControl.hidden) {
                    if (!btnGuardarControl.disabled)
                        comprobarSeleccion('guardar');
                }

            }
        },
        {
            key: 'Hh',
            alt: true,
            fn: function() {
                if (!btnAyuControl.hidden) {
                    if (!btnAyuControl.disabled)

                }

            }
        },
        {
            key: 'Ii',
            alt: true,
            fn: function() {
                if (!btnAdicionarControl.hidden) {
                    if (!btnAdicionarControl.disabled)
                        AdicionarControl();

                }

            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function() {
                if (!btnLimpiarControlGA.hidden) {
                    if (!btnLimpiarControlGA.disabled)
                        filtrosgparriba.clearFilters();
                }
            }
        },
        {
            key: 46,
            fn: function() {
                comprobarSeleccion('eliminar');
            }
        }
    ]);
}

function userLogeado() {
    Ext.Ajax.request({
        url: 'userLogeado',
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            vidusuario = responseData.idusuario;
            vusuario = responseData.usuario;
        }
    });
}

function NivelACtReal(a, b, c, d, e, f) {
    NAR = c.data.nivelactividadreal;
    if (!NAR)
        return 0;
    else
        return NAR;
}

function NivelACt(a, b, c, d, e, f) {
    NAR = c.data.nivelactividad;
    if (!NAR)
        return 0;
    else
        return NAR;
}

function CalculoPorciento(a, b, c, d, e, f) {
    NA = c.data.nivelactividad;
    NAR = c.data.nivelactividadreal;
    porciento = (NAR * 100) / NA;
    if (porciento < 100)
        return '<span style="color:blue;">' + porciento.toFixed(2) + ' %</span>';
    else if (porciento == 100)
        return '<span style="color:green;">' + porciento.toFixed(2) + ' %</span>';
    else
        return '<span style="color:red;">' + porciento.toFixed(2) + ' %</span>';
}

function renderterminada(val, meta, record) {
    if (record.data.fin == 1)
        return val + "<span>&nbsp;&nbsp;</span><span style='color:green'>FIN </span>";
    else {
        return val;
    }
}

function InsertarFecha(value) {
    if (value == null || value == undefined || value == '') {
        var d, s = "";
        d = new Date();
        d = d.format('Y-m-d h:i:s');
        return d;
    }
    else {
        return value;
    }
}

function Usuario(value) {
    if (value != null || value != undefined)
        return value;
    else
        return vusuario;
}

function actualizararbol(arbol, valor) {

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

function AdicionarControl() {
    if (smarriba.hasSelection()) {
        var d;
        d = new Date();
        d = d.format('Y-m-d h:i:s');
        record = Ext.data.Record.create(
                {
                    name: 'nivelactividadreal',
                    mapping: 'nivelactividadreal',
                    type: 'int'
                },
        {
            name: 'fechareal',
            mapping: 'fechareal',
            type: 'date'
        },
        {
            name: 'usuario',
            mapping: 'usuario'
        });
        obj = new record({
            fecha: d,
            nivelactividadreal: ''
        });
        stabajo.add(obj);
    }
}

function comprobarSeleccion(caso) {
    switch (caso) {
        case 'eliminar':
            if (gpAbajo.getSelectionModel().getSelections().length > 0)
                mostrarMensaje(2, perfil.etiquetas.msgSeguroEliminar, EliminarControl);
            break;
        case 'guardar':
            GuardarControl();
            break;
        default:
            break;
    }

    function EliminarControl(btn) {
        if (btn == 'ok') {
            if (smabajo.hasSelection()) {

                lista_idnivelactividadporfechareal = smabajo.getSelections();
                if (lista_idnivelactividadporfechareal.length != 0) {
                    idnivelactividadporfechareal = [];
                    for (i = 0; i < lista_idnivelactividadporfechareal.length; i++)
                    {
                        idnivelactividadporfechareal.push(lista_idnivelactividadporfechareal[i].data.idnivelactividadporfechareal)
                    }
                }
                selected = smarriba.getSelections();
                MostrarBarraProgreso('Eliminando el(los) controle(s)');
                Ext.Ajax.request({
                    url: 'eliminarNivelActividadporFechareal',
                    params: {
                        idnivelactividadporfechareal: Ext.encode(idnivelactividadporfechareal)
                    },
                    callback: function(options, success, response) {
                        Planificacion.ocultarMascara('idmask');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 3) {
                            mostrarMensaje(3, 'Error');
                        }
                        else if (responseData >= 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgEC, function() {
                                flag3 = true;
                                starriba.reload({
                                    params: {
                                        start: vstart,
                                        limit: vlimit
                                    }
                                });
                            });

                        }
                        else if (responseData == 0) {
                            mostrarMensaje(1, perfil.etiquetas.msgEC, function() {
                                starriba.reload();
                                stabajo.reload();
                            });

                        }
                    }
                });

                btnEliminarControl.disable();
                btnGuardarControl.disable();
            }
        }
    }

    function GuardarControl() {
        filas_nuevas = stabajo.getModifiedRecords();
        if (filas_nuevas.length != 0) {
            arreglo = [];
            for (i = 0; i < filas_nuevas.length; i++)
            {
                arreglo.push(filas_nuevas[i].data)
            }
            selected = smarriba.getSelections();

            MostrarBarraProgreso('Guardando el(los) controle(s)...');
            Ext.Ajax.request({
                url: 'adicionarNivelActividadporFechareal',
                params: {
                    filas_nuevas: Ext.encode(arreglo),
                    idactividad: idactividad,
                    identidad: identidad,
                    idusuario: vidusuario
                },
                callback: function(options, success, response) {
                    Planificacion.ocultarMascara('idmask');

                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 3) {
                        mostrarMensaje(3, 'Error');
                    }
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgANA, function() {
                            flag3 = true;
                            starriba.reload({
                                params: {
                                    start: vstart,
                                    limit: vlimit
                                }
                            });
                        });
                    }
                }
            });
            btnEliminarControl.disable();
            btnGuardarControl.disable();
        }
    }
}


function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function cambiarTituloGpArriba() {

    var filtrado_por = "";
    var sep = "/";
    if (filtrosgparriba.getFiltrosActivos() == undefined || filtrosgparriba.getFiltrosActivos().length == 0)
    {
        gpArriba.setTitle(perfil.etiquetas.lbSinFiltradoTitle);
    } else {
        for (i = 0; i < filtrosgparriba.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosgparriba.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = 'Código';
            } else if (filtrosgparriba.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = 'Denominación';
            } else if (filtrosgparriba.getFiltrosActivos()[i].dataIndex == "nivelactividad") {
                aux = 'Nivel de actividad planificada';
            } else if (filtrosgparriba.getFiltrosActivos()[i].dataIndex == "nivelactividadreal") {
                aux = 'Nivel de actividad real';
            } else if (filtrosgparriba.getFiltrosActivos()[i].dataIndex == "porciento") {
                aux = 'Porciento';
            }
            if (i == filtrosgparriba.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }

        gpArriba.setTitle(perfil.etiquetas.lbFiltradoPorTip + filtrado_por + '</i>');

        filtrado_por = "";
    }
}

function cambiarTituloGpAbajo() {

    var filtrado_por = "";
    var sep = "/";
    if (filtrosgpabajo.getFiltrosActivos() == undefined || filtrosgpabajo.getFiltrosActivos().length == 0)
    {
        gpAbajo.setTitle(perfil.etiquetas.lbSinFiltradoTitlegpAbajo);
    } else {
        for (i = 0; i < filtrosgpabajo.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosgpabajo.getFiltrosActivos()[i].dataIndex == "nivelactividadreal") {
                aux = 'Nivel de actividad';
            } else if (filtrosgpabajo.getFiltrosActivos()[i].dataIndex == "fechareal") {
                aux = 'Fecha';
            } else if (filtrosgpabajo.getFiltrosActivos()[i].dataIndex == "usuario") {
                aux = 'Usuario';
            }
            if (i == filtrosgpabajo.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }

        gpAbajo.setTitle(perfil.etiquetas.lbFiltradoPorTipgAbajo + filtrado_por + '</i>');

        filtrado_por = "";
    }

}

function siexisteNiveles() {
    if (filtrosgpabajo.getFiltrosActivos().length > 0 && stabajo.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function siexisteArriba() {
    if (filtrosgparriba.getFiltrosActivos().length > 0 && starriba.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}
function mostrarAyuda(referencia, title) {
    var title = title;
    var referencia = referencia;
    help.show(title, referencia);
}
