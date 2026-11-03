Utilidades.Cmp.Cmpclasificadorinvol = function () {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    this.tabactivo = 'autores';
    this.arrayinvolucrados = [];
    this.arrayautoresbus = [];
    this.arrayinvolucradosbus = [];
    this.arrayinvoleliminar = [];
    this.arrayinvoleliminarGrupoNom = [];
    this.idelemento = null;
    this.tipoelemento = null;
    this.involucradoInicial = null;
    this.involucradoSelected = null;
    this.comboSeleccion = 0;
    this.idautor = null;
    this.estamodificando = 0;
    this.notienetiposinvol = 0;
    this.newRootChild = [];
    this.newRootChildGrupoNom = [];
    this.newRootChildReasig = [];
    this.newRootChildAI = [];
    this.newRootChildCriterio = [];
    this.newRootChildHeredarElementos = [];
    this.arr_tempNodos = [];
    this.arr_tempNodosGrupoNom = [];
    this.arr_tempNodosReasig = [];
    this.arr_tempNodosAI = [];
    this.arr_tempNodosCriterio = [];
    this.arr_tempNodosHeredarElementos = [];
    this.idestructurainvol = null;
    this.confperfil = 0;
    this.arrayInicialInv = [];
    this.arrayTempInv = [];
    this.modificarInv = false;
    this.verificarCantInv = false;
    this.verificarAutoresInvolBusqueda = false;
    this.flag = false;

    Ext.grid.CheckColumn = function (config) {
        Ext.apply(this, config);
        if (!this.id) {
            this.id = Ext.id();
        }
        this.renderer = this.renderer.createDelegate(this);
    };

    Ext.grid.CheckColumn.prototype = {
        init: function (grid) {
            this.grid = grid;
            this.grid.on('render', function () {
                var view = this.grid.getView();
                view.mainBody.on('mousedown', this.onMouseDown, this);
            }, this);
        },
        onMouseDown: function (e, t) {
            if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
                e.stopEvent();
                var index = this.grid.getView().findRowIndex(t);
                var record = this.grid.store.getAt(index);
                record.set(this.dataIndex, !record.data[this.dataIndex]);
            }
        },
        renderer: function (v, p, record) {
            p.css += ' x-grid3-check-col-td';
            return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
        }
    };

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    Ext.override(Ext.Editor, {
        beforeDestroy: function () {
            if (this.field) {
                this.field.destroy();
                this.field = null;
            }
        }
    });

    Ext.override(Ext.grid.EditorGridPanel, {
        onDestroy: function () {
            var cols = this.getColumnModel().config;
            for (var i = 0, len = cols.length; i < len; i++) {
                var c = cols[i];
                if (c.editor) {
                    c.editor.destroy();
                }
            }
            Ext.grid.EditorGridPanel.superclass.onDestroy.call(this);
        }
    });

    //funcion que me construye el clasico clasificador de involucrados
    this.CrearClasificadorInvol = function (idelemento, tipoelemento, estamodificando, idautorelemento, parametros) {
        _this.idelemento = idelemento;
        _this.estamodificando = estamodificando;
        _this.tipoelemento = tipoelemento;
        _this.idautor = idautorelemento;
        if (_this.pPrincipal) {
            _this.pPrincipal.destroy();
        }

        _this.btnBusqueda = new Ext.Button({
            handler: function () {
                if (_this.tfbuscarInv.isValid()) {
                    _this.BuscarInvolucrados(_this.tfbuscarInv.getValue());
                }
            },
            text: '',
            id: 'btnBusqueda',
            nextTab: 'btnLimpiarElemen',
            prevTab: 'tfbuscarInv',
            iconCls: 'buscar',
            disabled: true,
            tooltip: 'Buscar involucrado(s)',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.btnLimpiarElemen = new Ext.Button({
            disabled: true,
            id: 'btnLimpiarElemen',
            nextTab: 'btnExpandirAgrupacion',
            prevTab: 'btnBusqueda',
            handler: function () {
                _this.tpinvolucrados.root.reload();
                _this.tfbuscarInv.reset();
                _this.btnLimpiarElemen.disable();
                _this.btnBusqueda.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });
        //Textfiel para buscar involucrado
        _this.tfbuscarInv = new Ext.form.TextField({
            enableKeyEvents: true,
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            emptyText: 'Criterio a buscar',
            maxLength: 255,
            width: 150,
            prevTab: 'btnAceptarAsociar', //Para la ventana Asociar involucrados a las actividades
            nextTab: 'btnBusqueda',
            id: 'tfbuscarInv',
            listeners: {
                keyup: function (tf, e) {
                    if (tf.isValid() && tf.getValue() != '') {
                        _this.btnBusqueda.enable();
                        _this.btnLimpiarElemen.enable();
                    } else {
                        _this.btnBusqueda.disable();
                        _this.btnLimpiarElemen.disable();
                        (tf.getValue() == '') ? _this.tpinvolucrados.root.reload() : null;
                    }
                },
                keydown: function (tf, e) {
                    if (e.getKey() == 13) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBusqueda.handler();
                        }
                    }
                }
            }
        });

        //store del grid donde muestro los involucrados
        _this.stGInvolucrados = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarinvolucrados',
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'idestructura'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }, {
                    name: 'tipoinvolucrado'
                }, {
                    name: 'idtipoinvolucrado'
                }, {
                    name: 'incidencia'
                }, {
                    name: 'actualiza'
                }]
            ),
            listeners: {
                beforeload: function (atreeloader, anode) {
                    _this.arrayTempInv = [];
                    _this.modificarInv = false;
                },
                load: function (st, record) {
                    _this.arrayInicialInv = _this.stGInvolucrados.getRange();
                    var long = Object.keys(_this.arrayInicialInv).length;
                    if (long > 0)
                        _this.verificarCantInv = true;
                    else
                        _this.verificarCantInv = false;
                    for (var i = 0; i < long; i++) {
                        _this.arrayTempInv.push(_this.arrayInicialInv[i].data);
                    }
                }
            }
        });

        //nodos hijos por defecto
        _this.defaultRootNodes = [{
            nodeType: 'async',
            id: 'nodo1',
            idgrupo: 'nodo1',
            text: 'Mi usuario',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo4',
            idgrupo: 'nodo4',
            text: 'Permisos otorgados por el nivel superior',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo5',
            idgrupo: 'nodo5',
            text: 'Estructuras',
            tipo: '2',
            leaf: false
        }];

        //Arbol de Involucrados
        _this.tpinvolucrados = new Ext.tree.TreePanel({
            title: 'Usuarios y Estructuras',
            region: 'center',
            autoScroll: true,
            width:100,
            border: false,
            //baseCls: 'prueba',
            id: (parametros && parametros.id) ? 'tpInvolucradosUserEst' + parametros.id : 'tpInvolucradosUserEst',
            tbar: ['Buscar: ', '', _this.tfbuscarInv, _this.btnBusqueda,
                _this.btnLimpiarElemen, '-',
                {
                    id: 'btnExpandirAgrupacion',
                    prevTab: 'btnLimpiarElemen',
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.expand(true);
                        Ext.getCmp('btnContraerAgrupacion').enable();
                        Ext.getCmp('btnExpandirAgrupacion').disable();

                    }
                }, {
                    id: 'btnContraerAgrupacion',
                    iconCls: 'contraer',
                    disabled: true,
                    tooltip: 'Contraer agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.collapse(true);
                        Ext.getCmp('btnContraerAgrupacion').disable();
                        Ext.getCmp('btnExpandirAgrupacion').enable();
                    }
                }, {
                    id: 'btnActualizarExpandirAgrupacion',
                    netxTab: 'btcancelarAct',
                    prevTab: 'btnContraerAgrupacion',
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.reload();
                        (!_this.estamodificando) ? _this.stGInvolucrados.removeAll() : null;
                    }
                }, '-', '->'
            ],
            root: {
                text: 'Clasificador de Involucrados',
                expanded: true,
                id: '-1',
                children: _this.defaultRootNodes
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (!check) {
                        _this.listarInvolucradosAct(nodo, check, 1, _this.estamodificando);
                    } else {
                        _this.listarInvolucradosAct(nodo, check, 1, _this.estamodificando);
                    }
                    var arrayInv = _this.stGInvolucrados.getRange();
                    if (arrayInv.length > 0)
                        _this.verificarCantInv = true;
                    else
                        _this.verificarCantInv = false;
                },
                expandnode: function (nodo) {
                    _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucrados);
                },
                'contextmenu': function (node, event) {
                    if (_this.tipoelemento != 'cargas' && _this.tipoelemento != 'calendario') {

                        if (!node.attributes.checked)
                            _this.Mostrarmenuarbol(node, event.xy);
                        event.stopEvent();
                    }
                },
                beforeload: function () {
                    var arrayInv = _this.stGInvolucrados.getRange();
                    if (arrayInv.length > 0)
                        _this.verificarCantInv = true;
                    else
                        _this.verificarCantInv = false;
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvol',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo,
                            estamodificando: estamodificando,
                            idelemento: idelemento,
                            tipoelemento: tipoelemento,
                            idautor: idautorelemento
                        };
                    },
                    'load': function (atreeloader, anode) {

                    }
                }
            })
        });

        this.checkColumn = new Ext.grid.CheckColumn({
            header: "Actualiza",
            dataIndex: 'actualiza',
            width: 60
        });

        //grid donde muestro los involucrados
        _this.GInvolucrados = new Ext.grid.EditorGridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            width: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? 270 : 350,
            clicksToEdit: 1,
            region: 'east',
            split: true,
            collapsible: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            plugins: _this.checkColumn,
            id: (parametros && parametros.id) ? 'gpInvol' + parametros.id : 'gpInvol',
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            columns: [{
                id: 'expandir',
                header: "Denominaci&oacute;n",
                sortable: true,
                dataIndex: 'denominacion',
                width: 110
            }, {
                header: "Tipo",
                sortable: true,
                dataIndex: 'nombretipo',
                width: 60
            }, {
                header: "TI",
                tooltip: "Tipo de Involucrado",
                hidden: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? true : false,
                sortable: true,
                dataIndex: 'tipoinvolucrado',
                width: 60
            }],
            store: _this.stGInvolucrados
        });

        if (estamodificando) {
            _this.stGInvolucrados.reload({
                params: {
                    idelemento: idelemento,
                    idtipoelemento: tipoelemento
                }
            });
        }

        this.menuNode = new Ext.menu.Menu({
            id: 'menuNode'
        });

        _this.tpEntidades = new Ext.tree.TreePanel({
            title: 'Estructuras',
            autoScroll: true,
            region: 'center',
            split: true,
            root: {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                text: 'Estructuras'
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (!check) {
                        _this.listarInvolucradosAct(nodo, check);
                    } else {
                        _this.listarInvolucradosAct(nodo, check);
                    }
                },
                expandnode: function (nodo) {
                    _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucrados);
                },
                'contextmenu': function (node, event) {
                    if (!node.attributes.checked)
                        _this.Mostrarmenuarbol(node, event.xy);
                    event.stopEvent();
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpasignarentidades/cargarArbolRelacionesAutor',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                    },
                    'load': function (atreeloader, anode) {
                    }
                }
            })
        });

        _this.tpInvolucrado = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            region: 'center',
            items: [_this.tpinvolucrados, _this.tpEntidades]
        });

        //panel donde cuelgo el clasificador de involucrados y el grid donde muestro a los nvolucrados
        _this.pPrincipal = new Ext.Panel({
            title: 'Involucrados',
            height: (_this.tipoelemento == 3 || _this.tipoelemento == 2) ? 250 : 150,
            layout: 'border',
            items: [_this.tpinvolucrados, _this.GInvolucrados],
            usarKeymap: true,
            botonesKeymap: [_this.btnBusqueda, _this.btnLimpiarElemen]
        });

        if (_this.tipoelemento == 'comportamiento' || _this.tipoelemento == 3) {
            _this.pPrincipal.disable();
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
                params: {
                    tiponomenclador: 9,
                    inicial: 1
                },
                callback: function (options, success, response) {
                    _this.pPrincipal.enable();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.data.length > 0) {
                        _this.involucradoInicial = {
                            idtipo: responseData.data[0].idtipo,
                            denominacion: responseData.data[0].denominacion
                        };
                    }
                }
            });
        }
        return _this.pPrincipal;
    };

    //funcion que me construye el clasico clasificador de involucrados para las precondiciones
    this.CrearClasificadorInvolPreCondiciones = function (idprecondicion, estamodificando, idautorelemento) {
        _this.idprecondicion = idprecondicion;
        _this.estamodificandoprecond = estamodificando;
        if (_this.pPrincipalPreCond) {
            _this.pPrincipalPreCond.destroy();
        }
        //Textfiel para buscar involucrado
        _this.tfbuscarInvPreCond = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 230,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            /*if(_this.tfbuscarInv.isValid())
                             {_this.BuscarInvolucrados(e);}*/
                        }
                    }
                }
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucradosPreCond = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarinvolucradosprecond',
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                },
                [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }]
            )
        });

        //nodos hijos por defecto
        _this.defaultRootNodesPreCond = [{
            nodeType: 'async',
            id: 'nodo1',
            idgrupo: 'nodo1',
            text: 'Mi usuario',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo4',
            idgrupo: 'nodo4',
            text: 'Permisos otorgados por el nivel superior',
            tipo: '2',
            leaf: false
        }];

        //Arbol de Involucrados
        _this.tpinvolucradosPreCond = new Ext.tree.TreePanel({
            region: 'center',
            autoScroll: true,
            border: false,
            tbar: [_this.tfbuscarInvPreCond,
                {
                    iconCls: 'icon-expand-all',
                    tooltip: 'Expandir agrupación',
                    icon: '../../../comun/recursos/images/fam/expand-all.gif',
                    handler: function () {
                        _this.tpinvolucradosPreCond.root.expand(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: 'Contraer agrupación',
                    icon: '../../../comun/recursos/images/fam/collapse-all.gif',
                    handler: function () {
                        _this.tpinvolucradosPreCond.root.collapse(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    //iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    icon: '../../../comun/recursos/images/fam/table_refresh.png',
                    handler: function () {
                        _this.tpinvolucradosPreCond.root.reload();
                    }
                }
            ],
            root: {
                text: 'Clasificador de Involucrados',
                expanded: true,
                id: '-1',
                children: _this.defaultRootNodesPreCond

            },
            listeners: {
                'checkchange': function (nodo, check) {
                    //_this.listarInvolucradosAct(nodo, check);
                },
                expandnode: function (nodo) {
                    //_this.ChequearInvolucradosDesdeCliente(nodo,'expand',_this.stGInvolucrados);
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvolprecond',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo,
                            estamodificando: estamodificando,
                            idprecondicion: idprecondicion,
                            idautor: idautorelemento
                        };
                    },
                    'load': function (atreeloader, anode) {
                    }
                }
            })
        });

        //grid donde muestro los involucrados
        _this.GInvolucradosP = new Ext.grid.GridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            width: 270,
            region: 'east',
            collapsible: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            store: _this.stGInvolucradosPreCond,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });

        if (estamodificando) {
            _this.stGInvolucradosPreCond.reload({
                params: {
                    idprecondicion: idprecondicion
                }
            });
        }

        //panel donde cuelgo el clasificador de involucrados y el grid donde muestro a los nvolucrados
        _this.pPrincipalPreCond = new Ext.Panel({
            title: 'Involucrados',
            layout: 'border',
            items: [_this.tpinvolucradosPreCond, _this.GInvolucradosP]
        });
        return _this.pPrincipalPreCond;
    };

    //funcion que me crea el clasificador de involucrados para grupos y nomencladores
    this.CrearClasificadorInvolGrupoNom = function (idelemento, tipoelemento, estamodificando, idautor) {
        _this.idelemento = idelemento;
        _this.estamodificando = estamodificando;
        _this.tipoelemento = tipoelemento;
        _this.idautor = idautor;
        var titulopanel = 'Listado de grupos, estructuras y usuarios existentes';
        if (_this.pPrincipalGrupoNom) {
            _this.pPrincipalGrupoNom.destroy();
        }
        //Textfiel para buscar los usuarios, grupos y permisos
        this.tfbuscarInvGrupoNom = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 150,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInvGrupoNom.isValid()) {
                                _this.BuscarInvolucradosGrupoNom(e);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBuscarInvGrupoNom.enable();
                            _this.btnLimpiarInvGrupoNom.enable();
                        } else {
                            _this.btnBuscarInvGrupoNom.disable();
                            _this.btnLimpiarInvGrupoNom.disable();
                        }
                    }
                }
            });

        this.btnBuscarInvGrupoNom = new Ext.Button({
            disabled: true,
            handler: function () {
                if (_this.tfbuscarInvGrupoNom.isValid()) {
                    _this.BuscarInvolucradosGrupoNom(_this.tfbuscarInvGrupoNom.getValue());
                }
            },
            iconCls: 'Buscar',
            tooltip: 'Buscar involucrados',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.btnLimpiarInvGrupoNom = new Ext.Button({
            disabled: false,
            handler: function () {
                _this.tpinvolucradosGrupoNom.root.reload();
                _this.tfbuscarInvGrupoNom.reset();
                _this.btnBuscarInvGrupoNom.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        //store del grid donde muestro los usuarios, grupos y permisos
        _this.stGInvolucradosGrupoNom = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarinvolucrados',
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }]
            ),
            listeners: {
                beforeload: function (atreeloader, anode) {
                    _this.arrayTempInv = [];
                    _this.modificarInv = false;
                },
                load: function (atreeloader, anode, response) {
                    _this.arrayInicialInv = _this.stGInvolucradosGrupoNom.getRange();
                    var long = Object.keys(_this.arrayInicialInv).length;
                    for (var i = 0; i < long; i++) {
                        _this.arrayTempInv.push(_this.arrayInicialInv[i].data);
                    }
                }
            }
        });

        //nodos hijos por defecto
        _this.defaultRootNodesGrupoNom = [
            {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                text: 'Mis grupos',
                tipo: '2',
                leaf: false
            }, {
                nodeType: 'async',
                id: 'nodo3',
                idgrupo: 'nodo3',
                text: 'Usuarios subordinados',
                tipo: '2',
                leaf: false
            }, {
                nodeType: 'async',
                id: 'nodo4',
                idgrupo: 'nodo4',
                text: 'Permisos otorgados por el nivel superior',
                tipo: '2',
                leaf: false
            }, {
                nodeType: 'async',
                id: 'nodo5',
                idgrupo: 'nodo5',
                text: 'Estructuras',
                tipo: '2',
                leaf: false
            }
        ];

        //Arbol donde muestro los usuarios, grupos y permisos
        _this.tpinvolucradosGrupoNom = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                border: false,
                tbar: ['Buscar:', _this.tfbuscarInvGrupoNom,
                    _this.btnBuscarInvGrupoNom,
                    _this.btnLimpiarInvGrupoNom, '-',
                    {
                        iconCls: 'expandir',
                        tooltip: 'Expandir agrupación',
                        handler: function () {
                            _this.tpinvolucradosGrupoNom.root.expand(true);
                        }
                    }, {
                        iconCls: 'contraer',
                        tooltip: 'Contraer agrupación',
                        handler: function () {
                            _this.tpinvolucradosGrupoNom.root.collapse(true);
                        }
                    }, {
                        iconCls: 'actualizar',
                        tooltip: 'Refrescar agrupación',
                        handler: function () {
                            _this.tpinvolucradosGrupoNom.root.reload();
                        }
                    }
                ],
                root: {
                    text: 'Clasificador de involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesGrupoNom
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarInvolucradosGrupoNom(nodo, check);
                    },
                    expandnode: function (nodo) {
                        _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucradosGrupoNom);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvolGrupoNom',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: _this.estamodificando,
                                idelemento: _this.idelemento,
                                tipoelemento: _this.tipoelemento,
                                idautor: _this.idautor
                            };

                        },
                        'load': function (atreeloader, anode, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, responseData.mensaje);
                            }
                        }
                    }
                })
            });

        //grid donde muestro los usuarios, grupos y permisos
        _this.GInvolucradosGrupoNom = new Ext.grid.GridPanel({
            title: 'Listado de estructuras, usuarios y grupos seleccionados',
            frame: true,
            width: 270,
            region: 'east',
            collapsible: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando usuarios y grupos seleccionados'
            },
            stripeRows: true,
            store: _this.stGInvolucradosGrupoNom,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });

        if (estamodificando) {
            _this.stGInvolucradosGrupoNom.reload({
                params: {
                    idelemento: _this.idelemento,
                    idtipoelemento: _this.tipoelemento
                }
            });
        }

        //panel donde cuelgo los usuarios, grupos y permisos y el grid donde muestro los usuarios, 
        //grupos y permisos
        _this.pPrincipalGrupoNom = new Ext.Panel({
            title: 'Involucrados',
            height: 270,
            layout: 'border',
            items: [_this.tpinvolucradosGrupoNom, _this.GInvolucradosGrupoNom],
            usarKeymap: true,
            botonesKeymap: [_this.btnBuscarInvGrupoNom, _this.btnLimpiarInvGrupoNom]
        });

        return _this.pPrincipalGrupoNom;
    };

    //funcion que me construye el clasificador de involucrados para la busqueda
    this.CrearClasificadorInvolBusqueda = function (tipoelemento, cantarboles) {
        var idelemento = null;
        var estamodificando = 0;
        var tipoelemento = tipoelemento;
        if (tipoelemento == 'reporte') {
            tipoelemento = 3;
        }
        var idautor = null;
        if (_this.tpPrincipal) {
            _this.tpPrincipal.destroy();
        }
        this.btnBusquedaplanes = new Ext.Button({
            id: 'btnBusquedaplanes',
            handler: function () {
                _this.BuscarAutoresInvolucrados();
            },
            iconCls: 'buscar',
            nextTab: 'btnLimpiarPlanes',
            prevTab: 'tfbuscarInvBusqueda',
            disabled: true,
            tooltip: 'Buscar autor(es)',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });

        this.btnLimpiarPlanes = new Ext.Button({
            id: 'btnLimpiarPlanes',
            nextTab: 'expanNot',
            prevTab: 'btnBusquedaplanes',
            disabled: true,
            handler: function () {
                var treepanel = _this.tpAutoresBusqueda;
                var store = _this.stGAutoresBusqueda;
                if (_this.tabactivo == 'involucrados') {
                    treepanel = _this.tpInvolucradosBusqueda;
                    store = _this.stGInvolucradosBusqueda;
                }
                treepanel.root.reload();
                _this.tfbuscarInvBusqueda.reset();
                this.btnLimpiarPlanes.disable();
                store.removeAll();
                _this.btnBusquedaplanes.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        //Textfiel para buscar involucrado
        this.tfbuscarInvBusqueda = new Ext.form.TextField(
            {
                id: 'tfbuscarInvBusqueda',
                nextTab: 'btnBusquedaplanes',
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                selectOnFocus: true,
                width: 120,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInvBusqueda.isValid()) {
                                _this.BuscarAutoresInvolucrados(e, idelemento, estamodificando, tipoelemento, idautor);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBusquedaplanes.enable();
                            _this.btnLimpiarPlanes.enable();
                        } else {
                            _this.btnBusquedaplanes.disable();
                            _this.btnLimpiarPlanes.disable();
                        }
                    }
                }
            });

        //store del grid donde muestro los autores
        _this.stGAutoresBusqueda = new Ext.data.Store({
            reader: new Ext.data.JsonReader(
                {
                    id: "idautor",
                    root: 'campos',
                    totalProperty: 'total'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'idautor'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipo'
                }, {
                    name: 'nombretipo'
                }]
            )
        });

        //nodos hijos por defecto
        _this.defaultRootNodesAutores = [{
            nodeType: 'async',
            id: 'nodo1',
            idgrupo: 'nodo1',
            text: 'Mi usuario',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }];
        _this.defaultRootNodesInvolucrados = [{
            nodeType: 'async',
            id: 'nodo1',
            idgrupo: 'nodo1',
            text: 'Mi usuario',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo4',
            idgrupo: 'nodo4',
            text: 'Otros usuarios(permisos del nivel superior)',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo5',
            idgrupo: 'nodo5',
            text: 'Estructuras',
            tipo: '2',
            leaf: false
        }];

        //Arbol de Autores
        this.tpAutoresBusqueda = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                border: false,
                root: {
                    text: 'Clasificador de involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesAutores
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarAutoresBusqueda(nodo, check);
                        _this.verificarCantAutoresInvolBusqueda();
                    },
                    expandnode: function (nodo) {
                        _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGAutoresBusqueda);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorbusqueda',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: estamodificando,
                                idelemento: idelemento,
                                tipoelemento: tipoelemento,
                                idautor: idautor// null
                            };
                        }
                    }
                })
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucradosBusqueda = new Ext.data.Store({
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }]
            )
        });
        //Arbol de Involucrados
        _this.tpInvolucradosBusqueda = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                border: false,
                root: {
                    text: 'Clasificador de involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesInvolucrados

                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarInvolucradosBusqueda(nodo, check);
                        _this.verificarCantAutoresInvolBusqueda();
                    },
                    expandnode: function (nodo) {
                        _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucradosBusqueda);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvol',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: estamodificando,
                                idelemento: idelemento,
                                tipoelemento: tipoelemento,
                                idautor: 'nulo'
                            };
                        }
                    }
                })
            });

        //grid donde muestro los autores
        _this.GAutoresBusqueda = new Ext.grid.GridPanel({
            title: 'Listado de autores seleccionados',
            frame: true,
            region: 'south',
            collapsible: true,
            height: 200,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            store: _this.stGAutoresBusqueda,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });

        //grid donde muestro los involucrados
        _this.GInvolucradosBusqueda = new Ext.grid.GridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            region: 'south',
            collapsible: true,
            height: 200,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            viewConfig: {
                forcefit: true
            },
            autoExpandColumn: 'expandir',
            stripeRows: true,
            store: _this.stGInvolucradosBusqueda,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });
        //panel donde cuelgo el clasificador y el grid de autores
        _this.pAutoresBusqueda = new Ext.Panel({
            title: 'Autores',
            layout: 'border',
            border: false,
            listeners: {
                activate: function (p) {
                    _this.tabactivo = 'autores';
                }
            },
            items: [_this.tpAutoresBusqueda, _this.GAutoresBusqueda]
        });

        //panel donde cuelgo el clasificador y el grid de involucrados
        _this.pInvolucradosBusqueda = new Ext.Panel({
            title: 'Involucrados',
            layout: 'border',
            border: false,
            listeners: {
                activate: function (p) {
                    _this.tabactivo = 'involucrados';
                }
            },
            items: [_this.tpInvolucradosBusqueda, _this.GInvolucradosBusqueda]

        });
        //tabpanel donde muestro ambos clasificadores
        _this.tpPrincipal = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            tbar: ['Buscar:', _this.tfbuscarInvBusqueda,
                _this.btnBusquedaplanes, _this.btnLimpiarPlanes, '-',
                {
                    id: 'expanNot',
                    prevTab: 'btnLimpiarPlanes',
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        var treepanel = _this.tpAutoresBusqueda;
                        if (_this.tabactivo == 'involucrados') {
                            treepanel = _this.tpInvolucradosBusqueda;
                        }
                        treepanel.root.expand(true);
                    }
                }, {
                    iconCls: 'contraer',
                    tooltip: 'Contraer agrupación',
                    handler: function () {
                        var treepanel = _this.tpAutoresBusqueda;
                        if (_this.tabactivo == 'involucrados') {
                            treepanel = _this.tpInvolucradosBusqueda;
                        }
                        treepanel.root.collapse(true);
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    handler: function () {
                        var treepanel = _this.tpAutoresBusqueda;
                        var st = _this.stGAutoresBusqueda;
                        if (_this.tabactivo == 'involucrados') {
                            treepanel = _this.tpInvolucradosBusqueda;
                            st = _this.stGInvolucradosBusqueda;
                        }
                        treepanel.root.reload();
                        st.removeAll();
                        _this.verificarAutoresInvolBusqueda = false;
                    }
                }
            ],
            usarKeymap: true,
            botonesKeymap: [_this.btnBusquedaplanes, _this.btnLimpiarPlanes],
            items: _this.pAutoresBusqueda
        });
        if (cantarboles == 2) {
            _this.tpPrincipal.add(_this.pInvolucradosBusqueda);
        }
        _this.tpPrincipal.doLayout();
        return _this.tpPrincipal;
    };

    //funcion que me construye el clasificador de involucrados para la busqueda en el calendario
    this.CrearClasificadorInvolBusquedaCalendario = function (tipoelemento, GenerarCalendariosPorUsuarios) {
        var idelemento = null;
        var estamodificando = 0;
        var tipoelemento = tipoelemento;
        var idautor = null;
        if (_this.tpPrincipal) {
            _this.tpPrincipal.destroy();
        }
        this.btnBuscarCalen = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.BuscarAutoresInvolucrados(_this.tfbuscarInvBusqueda.getValue(),
                    idelemento, estamodificando, tipoelemento, idautor);
            },
            iconCls: 'buscar',
            tooltip: 'Buscar involucrado(s) <b>(Alt+B)</b>'/*,
             key: {
             alt: true,
             key: 'B'
             },
             scope: this*/
        });

        this.btnLimpiarCalen = new Ext.Button({
            disabled: true,
            handler: function () {
                var treepanel = _this.tpAutoresBusqueda;
                if (_this.tabactivo == 'involucrados') {
                    treepanel = _this.tpInvolucradosBusqueda;
                }
                treepanel.root.reload();
                _this.tfbuscarInvBusqueda.reset();
                _this.btnBuscarCalen.disable();
                _this.btnLimpiarCalen.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro <b>(Alt+L)</b>'/*,
             key: {
             alt: true,
             key: 'L'
             },
             scope: this*/
        });

        _this.keys = new Ext.KeyMap(Ext.getBody(), [
            {
                key: 'B',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function () {
                    _this.btnBuscarCalen.handler.call();
                }
            }, {
                key: 'L',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function () {
                    _this.btnLimpiarCalen.handler.call();
                }
            }
        ]);

        //Textfiel para buscar involucrado
        this.tfbuscarInvBusqueda = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 155,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInvBusqueda.isValid()) {
                                var treepanel = _this.tpAutoresBusqueda;
                                _this.BuscarAutoresInvolucrados(e, idelemento, estamodificando, tipoelemento, idautor, treepanel);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBuscarCalen.enable();
                            _this.btnLimpiarCalen.enable();
                        } else {
                            _this.btnBuscarCalen.disable();
                            _this.btnLimpiarCalen.disable();
                        }
                    }
                }
            });

        //store del grid donde muestro los autores
        _this.stGAutoresBusqueda = new Ext.data.Store({
            reader: new Ext.data.JsonReader(
                {
                    id: "idusuario",
                    root: 'campos',
                    totalProperty: 'total'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idusuario'
                }]
            )
        });

        //nodos hijos por defecto
        _this.defaultRootNodesAutores = [{
            nodeType: 'async',
            id: 'nodo1',
            idgrupo: 'nodo1',
            text: 'Mi usuario',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }];
        _this.defaultRootNodesInvolucrados = [{
            nodeType: 'async',
            id: 'nodo1',
            idgrupo: 'nodo1',
            text: 'Mi usuario',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo4',
            idgrupo: 'nodo4',
            text: 'Otros usuarios(permisos del nivel superior)',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo5',
            idgrupo: 'nodo5',
            text: 'Estructuras',
            tipo: '2',
            leaf: false
        }];
        //Arbol de Autores
        _this.tpAutoresBusqueda = new Ext.tree.TreePanel(
            {
                width: 290,
                height: 390,
                region: 'center',
                autoScroll: true,
                border: false,
                root: {
                    text: 'Clasificador de involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesAutores
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarAutoresBusqueda(nodo, check);
                    },
                    expandnode: function (nodo) {
                        _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGAutoresBusqueda);
                    },
                    contextmenu: function (nodo, e) {
                        if ((nodo.id != 'nodo1' && nodo.id != 'nodo2'
                            && nodo.id != 'nodo3' && nodo.id != 'nodo4')
                            && nodo.attributes.tipo == 1) {
                            _this.tpAutoresBusqueda.selModel.select(nodo);
                            var treeautoresmenu = new Ext.menu.Menu({
                                items: [
                                    {
                                        text: 'Consultar calendario de actividades de este usuario ',
                                        icon: perfil.dirImg + 'buscar.png',
                                        iconCls: 'buscar',
                                        id: 'usercalendar' + nodo.idusuario,
                                        handler: function () {
                                            _this.nodomenu = nodo;
                                            GenerarCalendariosPorUsuarios();
                                        }
                                    }
                                ]
                            });
                            e.stopEvent();
                            var xy = e.getXY();
                            _this.tpAutoresBusqueda.contextMenu = treeautoresmenu;
                            _this.tpAutoresBusqueda.contextMenu.showAt(xy);
                        }
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorbusqueda',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: estamodificando,
                                idelemento: idelemento,
                                tipoelemento: tipoelemento,
                                idautor: idautor//null
                            };
                        }
                    }
                })
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucradosBusqueda = new Ext.data.Store({
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }]
            )
        });
        //Arbol de Involucrados
        _this.tpInvolucradosBusqueda = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                border: false,
                root: {
                    text: 'Clasificador de involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesInvolucrados
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarInvolucradosBusqueda(nodo, check);
                    },
                    expandnode: function (nodo) {
                        _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucradosBusqueda);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvol',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: estamodificando,
                                idelemento: idelemento,
                                tipoelemento: tipoelemento,
                                idautor: 'nulo'
                            };
                        }
                    }
                })
            });
        //grid donde muestro los autores
        _this.GAutoresBusqueda = new Ext.grid.GridPanel({
            title: 'Listado de autores seleccionados',
            frame: true,
            height: 385,
            width: 490,
            region: 'east',
            collapsible: true,
            collapsed: false,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            store: _this.stGAutoresBusqueda,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    hidden: true,
                    dataIndex: 'idusuario'
                }
            ]
        });
        //grid donde muestro los involucrados
        _this.GInvolucradosBusqueda = new Ext.grid.GridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            height: 385,
            width: 490,
            region: 'east',
            collapsible: true,
            collapsed: false,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            viewConfig: {
                forcefit: true
            },
            autoExpandColumn: 'expandir',
            stripeRows: true,
            store: _this.stGInvolucradosBusqueda,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });
        //panel donde cuelgo el clasificador y el grid de autores
        _this.pAutoresBusqueda = new Ext.Panel({
            title: 'Autores',
            layout: 'border',
            border: false,
            listeners: {
                activate: function (p) {
                    _this.tabactivo = 'autores';
                }
            },
            usarKeymap: true,
            botonesKeymap: [_this.btnBuscarCalen, _this.btnLimpiarCalen],
            items: [_this.tpAutoresBusqueda, _this.GAutoresBusqueda]
        });
        //panel donde cuelgo el clasificador y el grid de involucrados
        _this.pInvolucradosBusqueda = new Ext.Panel({
            title: 'Involucrados',
            layout: 'border',
            border: false,
            listeners: {
                activate: function (p) {
                    _this.tabactivo = 'involucrados';
                }
            },
            items: [_this.tpInvolucradosBusqueda, _this.GInvolucradosBusqueda]
        });
        //tabpanel donde muestro ambos clasificadores
        _this.tpPrincipal = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            tbar: ['Buscar:', _this.tfbuscarInvBusqueda, _this.btnBuscarCalen, _this.btnLimpiarCalen, '-',
                {
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        var treepanel = _this.tpAutoresBusqueda;
                        if (_this.tabactivo == 'involucrados') {
                            treepanel = _this.tpInvolucradosBusqueda;
                        }
                        treepanel.root.expand(true);
                    }
                }, {
                    iconCls: 'contraer',
                    tooltip: 'Contraer agrupación',
                    handler: function () {
                        var treepanel = _this.tpAutoresBusqueda;
                        if (_this.tabactivo == 'involucrados') {
                            treepanel = _this.tpInvolucradosBusqueda;
                        }
                        treepanel.root.collapse(true);
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    handler: function () {
                        var treepanel = _this.tpAutoresBusqueda;
                        if (_this.tabactivo == 'involucrados') {
                            treepanel = _this.tpInvolucradosBusqueda;
                        }
                        treepanel.root.reload();
                    }
                }
            ],
            height: 365,
            items: [_this.pAutoresBusqueda]
        });
        _this.tpPrincipal.add(_this.pInvolucradosBusqueda);
        _this.tpPrincipal.doLayout();
        return _this.tpPrincipal;
    };

    //funcion que me construye el clasico clasificador de involucrados
    this.CrearClasificadorInvolCrit = function (idobjetivo, idcriterio, estamodificandocriterio, idautorobjetivo) {
        _this.idobjetivo = idobjetivo;
        _this.idcriterio = idcriterio;
        _this.estamodificandocriterio = estamodificandocriterio;
        _this.idautorobjetivo = idautorobjetivo;
        if (_this.pPrincipalCriterio) {
            _this.pPrincipalCriterio.destroy();
        }
        //Textfiel para buscar involucrado
        _this.tfbuscarInvCriterio = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                id: 'tfbuscarInvCriterio',
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 150,
                nextTab: 'btnBuscarCriterios',
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInvCriterio.isValid()) {
                                _this.BuscarInvolucradosCriterios(e);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBuscarCriterios.enable();
                            _this.btnLimpiarCriterios.enable();
                        } else {
                            _this.btnBuscarCriterios.disable();
                            _this.btnLimpiarCriterios.disable();
                        }
                    }
                }
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucradosCirterio = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarinvolucradoscriterios',
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                },
                [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }]
            ),
            listeners: {
                beforeload: function (atreeloader, anode) {
                    _this.arrayTempInv = [];
                    _this.modificarInv = false;
                },
                load: function (atreeloader, anode, response) {
                    if (!_this.flag) {
                        _this.arrayInicialInv = _this.stGInvolucradosCirterio.getRange();
                        var long = Object.keys(_this.arrayInicialInv).length;
                        for (var i = 0; i < long; i++) {
                            _this.arrayTempInv.push(_this.arrayInicialInv[i].data);
                        }
                        _this.flag = true;
                    } else {
                        _this.arrayTempInv = [];
                        var arrayInvol = _this.stGInvolucradosCirterio.getRange();
                        var long = Object.keys(arrayInvol).length;
                        for (var i = 0; i < long; i++) {
                            _this.arrayTempInv.push(arrayInvol[i].data);
                        }
                    }
                    _this.comprobarCambiosInvCriterio();
                }
            }
        });

        this.btnBuscarCriterios = new Ext.Button({
            disabled: true,
            id: 'btnBuscarCriterios',
            prevTab: 'tfbuscarInvCriterio',
            nextTab: 'btnLimpiarCriterios',
            handler: function () {
                _this.BuscarInvolucradosCriterios(_this.tfbuscarInvCriterio.getValue());
            },
            iconCls: 'buscar',
            tooltip: 'Buscar involucrado(s)',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });

        this.btnLimpiarCriterios = new Ext.Button({
            disabled: true,
            id: 'btnLimpiarCriterios',
            prevTab: 'btnBuscarCriterios',
            nextTab: 'btnExpandirInvolCriterio',
            handler: function () {
                _this.tpinvolucradosCriterio.root.reload();
                _this.tfbuscarInvCriterio.reset();
                _this.btnLimpiarCriterios.disable();
                _this.btnBuscarCriterios.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        //nodos hijos por defecto
        _this.defaultRootNodesCriterio = [{
            nodeType: 'async',
            id: 'nodo1',
            idgrupo: 'nodo1',
            text: 'Involucrados en el objetivo',
            tipo: '2',
            leaf: false
        }];

        //Arbol de Involucrados
        _this.tpinvolucradosCriterio = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                border: false,
                tbar: ['Buscar:', _this.tfbuscarInvCriterio,
                    _this.btnBuscarCriterios, _this.btnLimpiarCriterios, '-',
                    {
                        iconCls: 'expandir',
                        id: 'btnExpandirInvolCriterio',
                        prevTab: 'btnLimpiarCriterios',
                        nextTab: 'btnContraerInvolCriterio',
                        tooltip: 'Expandir agrupación',
                        handler: function () {
                            _this.tpinvolucradosCriterio.root.expand(true);
                        }
                    }, {
                        iconCls: 'contraer',
                        id: 'btnContraerInvolCriterio',
                        prevTab: 'btnExpandirInvolCriterio',
                        nextTab: 'btnActualizarInvolCriterio',
                        tooltip: 'Contraer agrupación',
                        handler: function () {
                            _this.tpinvolucradosCriterio.root.collapse(true);
                        }
                    }, {
                        iconCls: 'actualizar',
                        id: 'btnActualizarInvolCriterio',
                        prevTab: 'btnContraerInvolCriterio',
                        nextTab: '',
                        tooltip: 'Refrescar agrupación',
                        handler: function () {
                            _this.tpinvolucradosCriterio.root.reload();
                        }
                    }
                ],
                root: {
                    text: 'Clasificador de Involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesCriterio

                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarInvolucradosCriterio(nodo, check);
                    },
                    expandnode: function (nodo) {
                        _this.ChequearInvolucradosDesdeClienteCriterio(nodo, 'expand', _this.stGInvolucradosCirterio);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvolcriterio',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: estamodificandocriterio,
                                idcriterio: idcriterio,
                                idobjetivo: idobjetivo,
                                tipoelemento: tipoelemento,
                                idautor: idautorobjetivo
                            };
                        },
                        'load': function (atreeloader, anode) {
                        }
                    }
                })
            });

        //grid donde muestro los involucrados
        _this.GInvolucradosCriterio = new Ext.grid.GridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            width: 270,
            region: 'east',
            collapsible: true,
            margins: '-5 -5 -5 -5',
            cmargins: '-5 -5 -5 -5',
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            store: _this.stGInvolucradosCirterio,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });

        if (estamodificandocriterio) {
            _this.stGInvolucradosCirterio.reload({
                params: {
                    idcriterio: idcriterio
                }
            });
        }

        //panel donde cuelgo el clasificador de involucrados y el grid donde muestro a los nvolucrados
        _this.pPrincipalCriterio = new Ext.Panel({
            title: 'Involucrados',
            height: 270,
            layout: 'border',
            usarKeymap: true,
            botonesKeymap: [_this.btnBuscarCriterios, _this.btnLimpiarCriterios],
            items: [_this.tpinvolucradosCriterio, _this.GInvolucradosCriterio],
            listeners: {
                destroy: function (cmp) {
                    _this.flag = false;
                }
            }
        });
        return _this.pPrincipalCriterio;
    };

    this.CrearClasificadorReasignacion = function (idelemento, tipoelemento, AccionesPostReasignacion) {
        _this.AccionesPostReasignacion = AccionesPostReasignacion;
        _this.idelemento = idelemento;
        _this.tipoelemento = tipoelemento;
        if (_this.winReasignacion) {
            _this.winReasignacion.destroy();
        }
        //Textfiel para buscar involucrado
        this.tfbuscarInvReasignacion = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 230,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInvReasignacion.isValid()) {
                                _this.BuscarInvolucradosReasignacion(e);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBuscarReasignacion.enable();
                        } else {
                            _this.btnBuscarReasignacion.disable();
                        }
                    }
                }
            });

        this.btnBuscarReasignacion = new Ext.Button({
            disabled: true,
            handler: function () {
                if (_this.tfbuscarInvReasignacion.isValid()) {
                    _this.BuscarInvolucradosReasignacion(_this.tfbuscarInvReasignacion.getValue());
                }
            },
            iconCls: 'buscar',
            tooltip: 'Buscar involucrado(s)',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });

        this.btnLimpiarReasignacion = new Ext.Button({
            disabled: false,
            handler: function () {
                _this.tpinvolucradosReasignacion.root.reload();
                _this.tfbuscarInvReasignacion.reset();
                _this.btnBuscarReasignacion.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        //nodos hijos por defecto
        _this.defaultRootNodesReasignacion = [{
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo5',
            idgrupo: 'nodo5',
            text: 'Estructuras',
            tipo: '2',
            leaf: false
        }];

        //Arbol de Involucrados
        _this.tpinvolucradosReasignacion = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                border: false,
                tbar: ['Buscar:', _this.tfbuscarInvReasignacion,
                    _this.btnBuscarReasignacion, _this.btnLimpiarReasignacion, '-',
                    {
                        iconCls: 'expandir',
                        tooltip: 'Expandir agrupación',
                        handler: function () {
                            _this.tpinvolucradosReasignacion.root.expand(true);
                        }
                    }, {
                        iconCls: 'contraer',
                        tooltip: 'Contraer agrupación',
                        handler: function () {
                            _this.tpinvolucradosReasignacion.root.collapse(true);
                        }
                    }, {
                        iconCls: 'actualizar',
                        tooltip: 'Refrescar agrupación',
                        handler: function () {
                            _this.tpinvolucradosReasignacion.root.reload();
                        }
                    }
                ],
                root: {
                    text: 'Clasificador de Involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesReasignacion
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarInvolucradosActReasignacion(nodo, check);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvol',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: 0,
                                idelemento: idelemento,
                                tipoelemento: tipoelemento,
                                idautor: 'null'
                            };
                        },
                        'load': function (atreeloader, anode) {
                        }
                    }
                })
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucradosReasignacion = new Ext.data.Store({
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }]
            )
        });

        //grid donde muestro los involucrados
        _this.GInvolucradosReasignacion = new Ext.grid.GridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            width: 270,
            region: 'east',
            collapsible: true,
            margins: '-5 -5 -5 -5',
            cmargins: '-5 -5 -5 -5',
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            store: _this.stGInvolucradosReasignacion,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });

        //store del combo del filtro por estados de aprobacion
        _this.stestados = new Ext.data.Store(
            {
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcmbestados',
                baseParams: {
                    idtipodoc: tipoelemento,
                    accion:'reasignacion'
                },
                reader: new Ext.data.JsonReader(
                    {
                        id: 'idestado',
                        root: "data"
                    }, [{
                        name: 'idestado'
                    }, {
                        name: 'denominacion'
                    }])
            });
        //combo del filtro por estados de aprobacion
        _this.cbestados = new Ext.form.ComboBox({
            fieldLabel: 'Estado',
            store: _this.stestados,
            valueField: 'idestado',
            displayField: 'denominacion',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            allowBlank: false,
            emptyText: 'Seleccione',
            width: 500,
            listeners: {
                select: function (cb, record, index) {
                }
            }
        });

        //ventana donde muestro el clasificador de involucrados para reasignar
        _this.winReasignacion = new Ext.Window({
            title: 'Reasignar actividad',
            modal: true,
            resizable: false,
            layout: 'border',
            width: 700,
            height: 400,
            closeAction: 'destroy',
            bbar: ['-', 'Estado : ', ' ', _this.cbestados, '-'],
            items: [_this.tpinvolucradosReasignacion, _this.GInvolucradosReasignacion],
            buttons: [
                {
                    handler: function () {
                        _this.winReasignacion.destroy();
                    },
                    text: 'Cancelar',
                    disabled: false,
                    iconCls: 'cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos'
                }, {
                    handler: function () {
                        _this.Reasignar();
                    },
                    text: 'Aceptar',
                    disabled: false,
                    iconCls: 'aceptar',
                    tooltip: 'Guardar datos y cerrar ventana'
                }
            ]
        });
        if (tipoelemento == 1) {
            _this.winReasignacion.setTitle('Reasignar objetivos');
        }
        _this.winReasignacion.show();
    };

    this.CrearClasificadorReasignacionMultiplesElementos = function (idelementos, tipoelemento, AccionesPostReasignacion) {
        _this.AccionesPostReasignacion = AccionesPostReasignacion;
        _this.idelementos = idelementos;
        _this.tipoelemento = tipoelemento;
        if (_this.winReasignacion) {
            _this.winReasignacion.destroy();
        }
        //Textfiel para buscar involucrado
        this.tfbuscarInvReasignacion = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 230,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInvReasignacion.isValid()) {
                                _this.BuscarInvolucradosReasignacion(e);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBuscarReasignacion.enable();
                        } else {
                            _this.btnBuscarReasignacion.disable();
                        }
                    }
                }
            });

        this.btnBuscarReasignacion = new Ext.Button({
            disabled: true,
            handler: function () {
                if (_this.tfbuscarInvReasignacion.isValid()) {
                    _this.BuscarInvolucradosReasignacion(_this.tfbuscarInvReasignacion.getValue());
                }
            },
            iconCls: 'buscar',
            tooltip: 'Buscar involucrado(s)',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });

        this.btnLimpiarReasignacion = new Ext.Button({
            disabled: false,
            handler: function () {
                _this.tpinvolucradosReasignacion.root.reload();
                _this.tfbuscarInvReasignacion.reset();
                _this.btnBuscarReasignacion.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        //nodos hijos por defecto
        _this.defaultRootNodesReasignacion = [{
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo5',
            idgrupo: 'nodo5',
            text: 'Estructuras',
            tipo: '2',
            leaf: false
        }];

        //Arbol de Involucrados
        _this.tpinvolucradosReasignacion = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                border: false,
                tbar: ['Buscar:', _this.tfbuscarInvReasignacion,
                    _this.btnBuscarReasignacion, _this.btnLimpiarReasignacion, '-',
                    {
                        iconCls: 'expandir',
                        tooltip: 'Expandir agrupación',
                        handler: function () {
                            _this.tpinvolucradosReasignacion.root.expand(true);
                        }
                    }, {
                        iconCls: 'contraer',
                        tooltip: 'Contraer agrupación',
                        handler: function () {
                            _this.tpinvolucradosReasignacion.root.collapse(true);
                        }
                    }, {
                        iconCls: 'actualizar',
                        tooltip: 'Refrescar agrupación',
                        handler: function () {
                            _this.tpinvolucradosReasignacion.root.reload();
                        }
                    }
                ],
                root: {
                    text: 'Clasificador de Involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesReasignacion
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarInvolucradosActReasignacion(nodo, check);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvol',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: 0,
                                idelemento: idelemento,
                                tipoelemento: tipoelemento,
                                idautor: 'null'
                            };
                        },
                        'load': function (atreeloader, anode) {
                        }
                    }
                })
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucradosReasignacion = new Ext.data.Store({
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }]
            )
        });

        //grid donde muestro los involucrados
        _this.GInvolucradosReasignacion = new Ext.grid.GridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            width: 270,
            region: 'east',
            collapsible: true,
            margins: '-5 -5 -5 -5',
            cmargins: '-5 -5 -5 -5',
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            store: _this.stGInvolucradosReasignacion,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });

        //store del combo del filtro por estados de aprobacion
        _this.stestados = new Ext.data.Store(
            {
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarcmbestados',
                baseParams: {
                    idtipodoc: tipoelemento,
                    accion:'reasignacion'
                },
                reader: new Ext.data.JsonReader(
                    {
                        id: 'idestado',
                        root: "data"
                    }, [{
                        name: 'idestado'
                    }, {
                        name: 'denominacion'
                    }])
            });
        //combo del filtro por estados de aprobacion
        _this.cbestados = new Ext.form.ComboBox({
            fieldLabel: 'Estado',
            store: _this.stestados,
            valueField: 'idestado',
            displayField: 'denominacion',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            allowBlank: false,
            emptyText: 'Seleccione',
            width: 500,
            listeners: {
                select: function (cb, record, index) {
                }
            }
        });

        //ventana donde muestro el clasificador de involucrados para reasignar
        _this.winReasignacionMultiple = new Ext.Window({
            title: 'Reasignar actividad',
            modal: true,
            resizable: false,
            layout: 'border',
            width: 700,
            height: 400,
            closeAction: 'destroy',
            bbar: ['-', 'Estado : ', ' ', _this.cbestados, '-'],
            items: [_this.tpinvolucradosReasignacion, _this.GInvolucradosReasignacion],
            buttons: [
                {
                    handler: function () {
                        _this.winReasignacionMultiple.destroy();
                    },
                    text: 'Cancelar',
                    disabled: false,
                    iconCls: 'cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos'
                }, {
                    handler: function () {
                        _this.ReasignarMultiplesElementos();
                    },
                    text: 'Aceptar',
                    disabled: false,
                    iconCls: 'aceptar',
                    tooltip: 'Guardar datos y cerrar ventana'
                }
            ]
        });
        if (tipoelemento == 1) {
            _this.winReasignacionMultiple.setTitle('Reasignar objetivos');
        }
        _this.winReasignacionMultiple.show();
    };

    this.CrearClasificadorHeredarElementos = function (idelemento, tipoelemento, AccionesPostHeredarElementos) {
        _this.AccionesPostHeredarElementos = AccionesPostHeredarElementos;
        _this.idelementoheredar = idelemento;
        _this.tipoelementoheredar = tipoelemento;
        if (_this.winHeredarElementos) {
            _this.winHeredarElementos.destroy();
        }
        //Textfiel para buscar involucrado
        _this.tfbuscarInvHeredarElementos = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 230,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInvHeredarElementos.isValid()) {
                                _this.BuscarInvolucradosHeredarElementos(e);
                            }
                        }
                    }
                }
            });

        //nodos hijos por defecto
        _this.defaultRootNodesHeredarElementos = [{
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }];

        //Arbol de Involucrados
        _this.tpinvolucradosHeredarElementos = new Ext.tree.TreePanel(
            {
                region: 'center',
                autoScroll: true,
                border: false,
                tbar: ['Buscar:', _this.tfbuscarInvHeredarElementos, '-',
                    {
                        iconCls: 'expandir',
                        tooltip: 'Expandir agrupación',
                        handler: function () {
                            _this.tpinvolucradosHeredarElementos.root.expand(true);
                        }
                    }, {
                        iconCls: 'contraer',
                        tooltip: 'Contraer agrupación',
                        handler: function () {
                            _this.tpinvolucradosHeredarElementos.root.collapse(true);
                        }
                    }, {
                        iconCls: 'actualizar',
                        tooltip: 'Refrescar agrupación',
                        handler: function () {
                            _this.tpinvolucradosHeredarElementos.root.reload();
                        }
                    }
                ],
                root: {
                    text: 'Clasificador de Involucrados',
                    expanded: true,
                    id: '-1',
                    children: _this.defaultRootNodesHeredarElementos

                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        _this.listarInvolucradosActHeredarElementos(nodo, check);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvol',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                tipo: anode.attributes.tipo,
                                idgrupo: anode.attributes.idgrupo,
                                estamodificando: 1,
                                idelemento: _this.idelementoheredar,
                                tipoelemento: _this.tipoelementoheredar,
                                idautor: null
                            };

                        },
                        'load': function (atreeloader, anode) {
                        }
                    }
                })
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucradosHeredarElementos = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarinvolucrados',
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                },
                [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }]
            )
        });

        //grid donde muestro los involucrados
        _this.GInvolucradosHeredarElementos = new Ext.grid.GridPanel({
            title: 'Listado de subordinados seleccionados',
            frame: true,
            width: 270,
            region: 'east',
            collapsible: true,
            margins: '-5 -5 -5 -5',
            cmargins: '-5 -5 -5 -5',
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            viewConfig: {
                forcefit: true
            },
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            store: _this.stGInvolucradosHeredarElementos,
            columns: [
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 250
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'nombretipo',
                    width: 60
                }
            ]
        });

        _this.stGInvolucradosHeredarElementos.reload({
            params: {
                idelemento: idelemento,
                idtipoelemento: tipoelemento
            }
        });

        //ventana donde muestro el clasificador de involucrados para reasignar
        _this.winHeredarElementos = new Ext.Window({
            modal: true,
            resizable: false,
            layout: 'border',
            width: 700,
            height: 400,
            closeAction: 'destroy',
            items: [_this.tpinvolucradosHeredarElementos, _this.GInvolucradosHeredarElementos],
            buttons: [
                {
                    handler: function () {
                        _this.winHeredarElementos.destroy();
                    },
                    text: 'Cerrar',
                    disabled: false,
                    iconCls: 'cerrar'
                }
            ]
        });
        _this.winHeredarElementos.setTitle('<center>Publicar ARC para mis subordinados</center>');
        _this.winHeredarElementos.show();
    };

    //Listar involucrados de las Actividades del panel principal
    this.listarInvolucradosAct = function (nodo, check, inicial, estamodificando) {
        _this.existe = 0;
        var involucrado = {};
        var id = nodo.attributes.idusuario;
        var nombretipo = 'Usuario';
        if (nodo.attributes.tipo == 0) {
            id = nodo.attributes.idgrupo;
            nombretipo = 'Grupo';
        } else if (nodo.attributes.tipo == 2) {
            id = nodo.attributes.idestructura;
            nombretipo = 'Estructura';
        }

        var tipoinvol = (nodo.attributes.tipo != 2) ? nodo.attributes.tipoinvol : 1;
        var llaveinvolucrado = id + tipoinvol;

        var arrayinvolucradosexistentes = _this.stGInvolucrados.getRange();
        if (check == true) {
            if (_this.tipoelemento == 'comportamiento' && _this.involucradoInicial == null
                && _this.involucradoSelected == null) {
                if (_this.notienetiposinvol == 1) {
                    mostrarMensaje(1, 'Usted no tiene tipos de involucrados configurados.');
                } else {
                    mostrarMensaje(1, 'Por favor seleccione un tipo de involucrado antes de adicionar');
                }
            } else {
                if (arrayinvolucradosexistentes.length > 0) {
                    for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                        if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                            _this.existe = 1;
                        } else if (arrayinvolucradosexistentes[i].data.idusuario == id) {
                            _this.existe = 1;
                        } else if (arrayinvolucradosexistentes[i].data.idgrupo == id) {
                            _this.existe = 1;
                        } else if (arrayinvolucradosexistentes[i].data.idestructura == id) {
                            _this.existe = 1;
                        }
                    }
                }
                if (_this.existe == 0) {
                    _this.msj = 'Adicionando';
                    involucrado = {
                        idinvolucrado: llaveinvolucrado,
                        llaveinvolucrado: llaveinvolucrado,
                        denominacion: nodo.text,
                        nombretipo: nombretipo,
                        idusuario: (nodo.attributes.tipo != 2) ? nodo.attributes.idusuario : nodo.attributes.idestructura,
                        idgrupo: nodo.attributes.idgrupo,
                        tipo: nodo.attributes.tipo,
                        tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0,
                        idestructurainvol: _this.idestructurainvol,
                        idtipoinvolucrado: null,
                        denomtipoinvolucrado: null
                    };
                    if (_this.tipoelemento != 'cargas' && _this.tipoelemento != 'calendario') {
                        if (inicial == 1 && _this.comboSeleccion == 0 && _this.involucradoInicial != null) {
                            involucrado.idtipoinvolucrado = _this.involucradoInicial.idtipo;
                            involucrado.denomtipoinvolucrado = _this.involucradoInicial.denominacion;
                        } else if (_this.involucradoSelected != null) {
                            involucrado.idtipoinvolucrado = _this.involucradoSelected.idtipo;
                            involucrado.denomtipoinvolucrado = _this.involucradoSelected.denominacion;
                        }
                    }
                    _this.CargarGridInvolucrados(involucrado);
                    _this.comprobarCambiosInv(involucrado, _this.msj);
                }
            }
        } else {
            _this.msj = 'Eliminando';
            for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                    _this.stGInvolucrados.remove(arrayinvolucradosexistentes[i]);
                } else if (arrayinvolucradosexistentes[i].data.idusuario == id) {
                    _this.stGInvolucrados.remove(arrayinvolucradosexistentes[i]);
                } else if (arrayinvolucradosexistentes[i].data.idgrupo == id) {
                    _this.stGInvolucrados.remove(arrayinvolucradosexistentes[i]);
                } else if (arrayinvolucradosexistentes[i].data.idestructura == id) {
                    _this.stGInvolucrados.remove(arrayinvolucradosexistentes[i]);
                }
            }
            if (estamodificando == 1) {
                involucrado = {
                    idinvolucrado: llaveinvolucrado,
                    llaveinvolucrado: llaveinvolucrado,
                    denominacion: nodo.text,
                    nombretipo: nombretipo,
                    idusuario: (nodo.attributes.tipo != 2) ? nodo.attributes.idusuario : nodo.attributes.idestructura,
                    idgrupo: nodo.attributes.idgrupo,
                    tipo: nodo.attributes.tipo,
                    tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0,
                    idestructurainvol: _this.idestructurainvol
                };
                _this.arrayinvoleliminar.push(involucrado);
                _this.comprobarCambiosInv(involucrado, _this.msj);
            }
        }
    };

    this.listarInvolucradosActInicial = function (nodo, check) {
        this.sttiposactividad = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
            reader: new Ext.data.JsonReader({
                id: 'idtipo',
                root: "data"
            }, [{
                name: 'denominacion'
            }, {
                name: 'idtipo'
            }, {
                name: 'incidencia'
            }]),
            listeners: {
                beforeload: function (st, opt) {
                    st.baseParams.tiponomenclador = 9;
                },
                load: function (store, records, options) {
                    var existeactinicial = false;
                    if (_this.sttiposactividad.getCount() != 0) {
                        for (var i = 0; i < _this.sttiposactividad.getCount(); i++) {
                            if (_this.sttiposactividad.getAt(i).data.inicial == 1) {
                                _this.idestructurainvol = _this.sttiposactividad.getAt(i).data.idtipo;
                                existeactinicial = true;
                            }
                        }
                    }
                    if (!existeactinicial) {
                        _this.CrearVentanaConfigurarInvol(nodo, true);
                    } else {
                        _this.existe = 0;
                        var involucrado = {};
                        var id = nodo.attributes.idusuario;
                        var nombretipo = 'Usuario';
                        if (nodo.attributes.tipo == 0) {
                            id = nodo.attributes.idgrupo;
                            nombretipo = 'Grupo';
                        } else if (nodo.attributes.tipo == 2) {
                            id = nodo.attributes.idestructura;
                            nombretipo = 'Estructura';
                        }
                        var tipoinvol = (nodo.attributes.tipo != 2) ? nodo.attributes.tipoinvol : 1;
                        var llaveinvolucrado = id + tipoinvol;
                        var arrayinvolucradosexistentes = _this.stGInvolucrados.getRange();
                        if (check == true) {
                            if (arrayinvolucradosexistentes.length > 0) {
                                for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                                    if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                                        _this.existe = 1;
                                    }
                                }
                            }
                            if (_this.existe == 0) {
                                _this.msj = 'Adicionando';
                                involucrado = {
                                    idinvolucrado: llaveinvolucrado,
                                    llaveinvolucrado: llaveinvolucrado,
                                    denominacion: nodo.text,
                                    nombretipo: nombretipo,
                                    idusuario: (nodo.attributes.tipo != 2) ? nodo.attributes.idusuario : nodo.attributes.idestructura,
                                    idgrupo: nodo.attributes.idgrupo,
                                    tipo: nodo.attributes.tipo,
                                    tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
                                };
                                _this.CargarGridInvolucrados(involucrado);
                            }
                        } else {
                            _this.msj = 'Eliminando';
                            for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                                if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                                    _this.stGInvolucrados.remove(arrayinvolucradosexistentes[i]);
                                }
                            }
                            if (_this.estamodificando == 1) {
                                involucrado = {
                                    idinvolucrado: llaveinvolucrado,
                                    llaveinvolucrado: llaveinvolucrado,
                                    denominacion: nodo.text,
                                    nombretipo: nombretipo,
                                    idusuario: nodo.attributes.idusuario,
                                    idgrupo: nodo.attributes.idgrupo,
                                    tipo: nodo.attributes.tipo,
                                    tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
                                };
                                _this.arrayinvoleliminar.push(involucrado);
                            }
                        }
                    }
                }
            }
        });
        _this.sttiposactividad.reload();
    };

    //Listar usuarios y grupos del panel principal
    this.listarInvolucradosGrupoNom = function (nodo, check) {
        _this.existegrupoNom = 0;
        var involucrado = {};
        var id = nodo.attributes.idusuario;
        var nombretipo = 'Usuario';
        if (nodo.attributes.tipo == 0) {
            id = nodo.attributes.idgrupo;
            nombretipo = 'Grupo';
        } else if (nodo.attributes.tipo == 2) {
            id = nodo.attributes.idestructura;
            nombretipo = 'Estructura';
        }
        var tipoinvol = (nodo.attributes.tipo != 2) ? nodo.attributes.tipoinvol : 1;
        var llaveinvolucrado = id + tipoinvol;
        var arrayinvolucradosexistentes = _this.stGInvolucradosGrupoNom.getRange();
        if (check) {
            if (arrayinvolucradosexistentes.length > 0) {
                for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                    if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                        _this.existegrupoNom = 1;
                    }
                }
            }
            if (_this.existegrupoNom == 0) {
                _this.msj = 'Adicionando';
                involucrado = {
                    idinvolucrado: llaveinvolucrado,
                    llaveinvolucrado: llaveinvolucrado,
                    denominacion: nodo.text,
                    nombretipo: nombretipo,
                    idusuario: (nodo.attributes.tipo != 2) ? nodo.attributes.idusuario : nodo.attributes.idestructura,
                    idgrupo: nodo.attributes.idgrupo,
                    tipo: nodo.attributes.tipo,
                    tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
                };
                _this.CargarGridInvolucradosGrupoNom(involucrado);
                _this.comprobarCambiosInv(involucrado, _this.msj);
            }
        } else {
            _this.msj = 'Eliminando';
            for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                    _this.stGInvolucradosGrupoNom.remove(arrayinvolucradosexistentes[i]);
                }
            }
            if (_this.estamodificando == 1) {
                involucrado = {
                    idinvolucrado: llaveinvolucrado,
                    llaveinvolucrado: llaveinvolucrado,
                    denominacion: nodo.text,
                    nombretipo: nombretipo,
                    idusuario: nodo.attributes.idusuario,
                    idgrupo: nodo.attributes.idgrupo,
                    tipo: nodo.attributes.tipo,
                    tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
                };
                _this.arrayinvoleliminar.push(involucrado);
                _this.comprobarCambiosInv(involucrado, _this.msj);
            }
        }
    };
    //Listar involucrados de las Actividades del panel principal
    this.listarInvolucradosCriterio = function (nodo, check) {
        _this.existecriterio = 0;
        var involucrado = {};
        var id = nodo.attributes.idusuario;
        var nombretipo = 'Usuario';
        if (nodo.attributes.tipo == 0) {
            id = nodo.attributes.idgrupo;
            nombretipo = 'Grupo';
        } else if (nodo.attributes.tipo == 2) {
            id = nodo.attributes.idestructura;
            nombretipo = 'Estructura';
        }
        var tipoinvol = (nodo.attributes.tipo != 2) ? nodo.attributes.tipoinvol : 1;
        var llaveinvolucrado = id + tipoinvol;
        if (_this.estamodificandocriterio == 0) {
            var arrayinvolucradosexistentes = _this.stGInvolucradosCirterio.getRange();
            if (check == true) {
                if (arrayinvolucradosexistentes.length > 0) {
                    for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                        if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                            _this.existecriterio = 1;
                        }
                    }
                }
                if (_this.existecriterio == 0) {
                    _this.msjcriterio = 'Adicionando';
                    involucrado = {
                        idinvolucrado: llaveinvolucrado,
                        llaveinvolucrado: llaveinvolucrado,
                        denominacion: nodo.text,
                        nombretipo: nombretipo,
                        idusuario: (nodo.attributes.tipo != 2) ? nodo.attributes.idusuario : nodo.attributes.idestructura,
                        idgrupo: nodo.attributes.idgrupo,
                        tipo: nodo.attributes.tipo,
                        tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
                    };
                    _this.CargarGridInvolucradosCriterios(involucrado);
                }
            } else {
                _this.msjcriterio = 'Eliminando';
                for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                    if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                        _this.stGInvolucradosCirterio.remove(arrayinvolucradosexistentes[i]);
                    }
                }
            }
        }
        if (_this.estamodificandocriterio == 1) {
            if (check == true) {
                _this.existecriterio = 0;
            }
            if (check == false) {
                _this.existecriterio = 1;
            }
            involucrado = {
                idinvolucrado: llaveinvolucrado,
                llaveinvolucrado: llaveinvolucrado,
                denominacion: nodo.text,
                nombretipo: nombretipo,
                idusuario: nodo.attributes.idusuario,
                idgrupo: nodo.attributes.idgrupo,
                tipo: nodo.attributes.tipo,
                tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
            };
            _this.CargarInvolucradosBDAjaxCriterio(involucrado);//enviar para el servidor

        }
    };
    //Listar involucrados de las Actividades del panel principal
    this.listarInvolucradosActReasignacion = function (nodo, check) {
        _this.existereas = 0;
        var involucrado = {};
        var id = nodo.attributes.idusuario;
        var nombretipo = 'Usuario';
        if (nodo.attributes.tipo == 0) {
            id = nodo.attributes.idgrupo;
            nombretipo = 'Grupo';
        } else if (nodo.attributes.tipo == 2) {
            id = nodo.attributes.idrelacion;
            nombretipo = 'Estructura';
        }
        var tipoinvol = (nodo.attributes.tipo != 2) ? nodo.attributes.tipoinvol : 1;
        var llaveinvolucrado = id + tipoinvol;
        var arrayinvolucradosexistentes = _this.stGInvolucradosReasignacion.getRange();
        if (check == true) {
            if (arrayinvolucradosexistentes.length > 0) {
                for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                    if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                        _this.existereas = 1;
                    }
                }
            }
            if (_this.existereas == 0) {
                _this.msj = 'Adicionando';
                involucrado = {
                    idinvolucrado: llaveinvolucrado,
                    llaveinvolucrado: llaveinvolucrado,
                    denominacion: nodo.text,
                    nombretipo: nombretipo,
                    idusuario: (nodo.attributes.tipo != 2) ? nodo.attributes.idusuario : nodo.attributes.idestructura,
                    idgrupo: nodo.attributes.idgrupo,
                    tipo: nodo.attributes.tipo,
                    tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
                };
                _this.CargarGridInvolucradosReasignacion(involucrado);
            }
        } else {
            _this.msj = 'Eliminando';
            for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                    _this.stGInvolucradosReasignacion.remove(arrayinvolucradosexistentes[i]);
                }
            }
        }
    };

    //Listar involucrados de las Actividades del panel principal
    this.listarInvolucradosActHeredarElementos = function (nodo, check) {
        _this.existereheredado = 0;
        var involucrado = {};
        var id = nodo.attributes.idusuario;
        var nombretipo = 'Usuario';
        if (nodo.attributes.tipo == 0) {
            id = nodo.attributes.idgrupo;
            nombretipo = 'Grupo';
        } else if (nodo.attributes.tipo == 2) {
            id = nodo.attributes.idrelacion;
            nombretipo = 'Estructura';
        }
        var tipoinvol = (nodo.attributes.tipo != 2) ? nodo.attributes.tipoinvol : 1;
        var llaveinvolucrado = id + tipoinvol;
        var arrayinvolucradosexistentes = _this.stGInvolucradosHeredarElementos.getRange();
        if (check == true) {
            if (arrayinvolucradosexistentes.length > 0) {
                for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                    if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                        _this.existereheredado = 1;
                    }
                }
            }
            if (_this.existereheredado == 0) {
                involucrado = {
                    idinvolucrado: llaveinvolucrado,
                    llaveinvolucrado: llaveinvolucrado,
                    denominacion: nodo.text,
                    nombretipo: nombretipo,
                    idusuario: (nodo.attributes.tipo != 2) ? nodo.attributes.idusuario : nodo.attributes.idestructura,
                    idgrupo: nodo.attributes.idgrupo,
                    tipo: nodo.attributes.tipo,
                    tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
                };
                _this.CargarGridInvolucradosHeredarElementos(involucrado, 'adicionar');
            }
        } else {
            for (var i = 0; i < arrayinvolucradosexistentes.length; i++) {
                if (arrayinvolucradosexistentes[i].data.llaveinvolucrado == llaveinvolucrado) {
                    involucrado = {
                        idinvolucrado: llaveinvolucrado,
                        llaveinvolucrado: llaveinvolucrado,
                        denominacion: nodo.text,
                        nombretipo: nombretipo,
                        idusuario: nodo.attributes.idusuario,
                        idgrupo: nodo.attributes.idgrupo,
                        tipo: nodo.attributes.tipo,
                        tipoinvol: (nodo.attributes.tipoinvol != undefined) ? nodo.attributes.tipoinvol : 0
                    };
                    _this.stGInvolucradosHeredarElementos.remove(arrayinvolucradosexistentes[i]);
                    _this.CargarGridInvolucradosHeredarElementos(involucrado, 'eliminar');
                }
            }
        }
    };

    //Funcion de Adicionar y Eliminar Involucrados a la BD
    this.CargarInvolucradosBDAjax = function (involucrado) {
        var url;
        var mensaje;
        if (_this.existe == 0) {
            msj = 'Adicionando';
            url = 'adicionarinvolucrados';
            mensaje = 'El involucrado ha sido adicionado satisfactoriamente.';
        } else {
            msj = 'Eliminando';
            url = 'eliminarinvolucrados';
            mensaje = 'El Involucrado ha sido eliminado satisfactoriamente.';
        }
        _this.BarraProgreso.show(msj + ' involucrado');
        Ext.Ajax.request(
            {
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/' + url,
                params: {
                    involucrado: Ext.encode(involucrado),
                    idelemento: _this.idelemento,
                    idtipoelemento: _this.tipoelemento,
                    estamodificando: 1
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        //Ext.example.msg('Hecho!', mensaje);
                        mostrarMensaje(1, mensaje);
                        _this.stGInvolucrados.removeAll();
                        _this.stGInvolucrados.reload({
                            params: {
                                idelemento: _this.idelemento,
                                idtipoelemento: _this.tipoelemento
                            }
                        });
                    }
                }
            });
    };

    //Funcion de Adicionar y Eliminar Involucrados a la BD
    this.CargarInvolucradosBDAjaxCriterio = function (involucrado) {
        var url;
        var mensaje;
        if (_this.existecriterio == 0) {
            msj = 'Adicionando';
            url = 'adicionarinvolucrados';
            mensaje = 'El involucrado ha sido adicionado satisfactoriamente.';
        } else {
            msj = 'Eliminando';
            url = 'eliminarinvolucrados';
            mensaje = 'El involucrado ha sido eliminado satisfactoriamente.';
        }
        _this.BarraProgreso.show(msj + ' involucrado');
        Ext.Ajax.request(
            {
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/' + url,
                params: {
                    involucrado: Ext.encode(involucrado),
                    idelemento: _this.idcriterio,
                    idtipoelemento: 6,
                    estamodificando: 1
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, mensaje);
                        _this.stGInvolucradosCirterio.removeAll();
                        _this.stGInvolucradosCirterio.reload({
                            params: {
                                idcriterio: _this.idcriterio
                            }
                        });
                    }
                }
            });
    };

    //buscar involucrados segun el nombre
    this.BuscarInvolucrados = function (e) {
        //_this.BarraProgreso.show('Buscando involucrados');
        _this.tpinvolucrados.body.mask('Buscando involucrados', 'x-mask-loading');
        var text = _this.tfbuscarInv.getValue();
        if (text) {
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/buscarinvolucrados',
                params: {
                    idelemento: _this.idelemento,
                    denominacion: text,
                    estamodificando: _this.estamodificando,
                    idautor: _this.idautor,
                    idtipoelemento: _this.tipoelemento,
                    permiso: 'adicionar'
                },
                callback: function (options, success, response) {
                    //_this.BarraProgreso.hide();
                    _this.tpinvolucrados.body.unmask();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.msj == 3) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                    _this.setChildren(responseData.nodos);
                }
            });
        } else {
            //_this.BarraProgreso.hide();
            _this.tpinvolucrados.body.unmask();
            if (_this.newRootChild) {
                _this.tpinvolucrados.root.cascade(function (n) {
                    Ext.each(_this.newRootChild, function (n_arr) {
                        if (n_arr.id == n.id && n.ui.ctNode.offsetHeight < 3) {
                            n.ui.hide();
                        }
                    });
                });
                Ext.each(_this.arr_tempNodos, function (n) {
                    n.ui.show();
                });
                _this.tpinvolucrados.render();
            }
        }
    };
    this.setChildren = function (childrenNodos) {
        _this.newRootChild = childrenNodos;
        _this.tpinvolucrados.root.eachChild(function (n) {
            if (n.isExpanded())
                n.collapse(true, false);
            if (n.ui.ctNode.offsetHeight < 3) {
                if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                    _this.arr_tempNodos.push(n);
                n.ui.hide();
            }
        });
        _this.tpinvolucrados.root.appendChild(_this.newRootChild);
        _this.tpinvolucrados.render();
        _this.tpinvolucrados.root.eachChild(function (n) {
            _this.ChequearInvolucradosDesdeCliente(n, 'append', _this.stGInvolucrados);
        });
    };

    //buscar involucrados segun el nombre
    this.BuscarInvolucradosGrupoNom = function (e) {
        _this.BarraProgreso.show('Buscando involucrados');
        var text = _this.tfbuscarInvGrupoNom.getValue();
        if (text) {
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/buscarinvolucrados',
                params: {
                    idelemento: _this.idelemento,
                    denominacion: text,
                    estamodificando: _this.estamodificando,
                    idautor: _this.idautor,
                    idtipoelemento: _this.tipoelemento,
                    permiso: 'adicionar'
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.msj == 3) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    } else
                        _this.setChildrenGrupoNom(responseData.nodos);
                }
            });
        } else {
            _this.BarraProgreso.hide();
            if (_this.newRootChildGrupoNom) {
                _this.tpinvolucradosGrupoNom.root.cascade(function (n) {
                    Ext.each(_this.newRootChildGrupoNom, function (n_arr) {
                        if (n_arr.id == n.id && n.ui.ctNode.offsetHeight < 3) {
                            n.ui.hide();
                        }
                    });
                });
                Ext.each(_this.arr_tempNodosGrupoNom, function (n) {
                    n.ui.show();
                });
                _this.tpinvolucradosGrupoNom.render();
            }
        }
    };
    this.setChildrenGrupoNom = function (childrenNodos) {
        _this.newRootChildGrupoNom = childrenNodos;

        _this.tpinvolucradosGrupoNom.root.eachChild(function (n) {
            if (n.isExpanded())
                n.collapse(true, false);
            if (n.ui.ctNode.offsetHeight < 3) {
                if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                    _this.arr_tempNodosGrupoNom.push(n);
                n.ui.hide();
            }
        });
        _this.tpinvolucradosGrupoNom.root.appendChild(_this.newRootChildGrupoNom);
        _this.tpinvolucradosGrupoNom.render();
        _this.tpinvolucradosGrupoNom.root.eachChild(function (n) {
            _this.ChequearInvolucradosDesdeCliente(n, 'append', _this.stGInvolucradosGrupoNom);
        })
    };

    //buscar involucrados segun el nombre
    this.BuscarInvolucradosCriterios = function (e) {
        _this.BarraProgreso.show('Buscando involucrados');
        var text = _this.tfbuscarInvCriterio.getValue();
        if (text) {
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/buscarinvolucradosobjetivo',
                params: {
                    idobjetivo: _this.idobjetivo,
                    idcriterio: _this.idcriterio,
                    denominacion: text,
                    estamodificando: _this.estamodificandocriterio,
                    permiso: 'leer'
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.msj == 3)
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    else
                        _this.setChildrenCriterios(responseData.nodos);
                }
            });
        } else {
            _this.BarraProgreso.hide();
            if (_this.newRootChildCriterio) {
                _this.tpinvolucradosCriterio.root.cascade(function (n) {
                    Ext.each(_this.newRootChildCriterio, function (n_arr) {
                        if (n_arr.id == n.id && n.ui.ctNode.offsetHeight < 3) {
                            n.ui.hide();
                        }
                    });
                });
                Ext.each(_this.arr_tempNodosCriterio, function (n) {
                    n.ui.show();
                });
                _this.tpinvolucradosCriterio.render();
            }
        }
    };
    this.setChildrenCriterios = function (childrenNodos) {
        _this.newRootChildCriterio = childrenNodos;

        _this.tpinvolucradosCriterio.root.eachChild(function (n) {
            if (n.isExpanded())
                n.collapse(true, false);
            if (n.ui.ctNode.offsetHeight < 3) {
                if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                    _this.arr_tempNodosCriterio.push(n);
                n.ui.hide();
            }
        });
        _this.tpinvolucradosCriterio.root.appendChild(_this.newRootChildCriterio);
        _this.tpinvolucradosCriterio.render();
        _this.tpinvolucradosCriterio.root.eachChild(function (n) {
            _this.ChequearInvolucradosDesdeCliente(n, 'append', _this.stGInvolucradosCirterio);
        })
    };

    //buscar involucrados segun el nombre para la reasignacion
    this.BuscarInvolucradosReasignacion = function (e) {
        _this.BarraProgreso.show('Buscando involucrados');
        var text = _this.tfbuscarInvReasignacion.getValue();
        if (text) {
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/buscarinvolucrados',
                params: {
                    idelemento: _this.idelemento,
                    denominacion: text,
                    estamodificando: 0,
                    idautor: null,
                    idtipoelemento: _this.tipoelemento,
                    permiso: 'adicionar'
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.msj == 3) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    } else
                        _this.setChildrenReasignacion(responseData.nodos);
                }
            });
        } else {
            _this.BarraProgreso.hide();
            if (_this.newRootChildReasig) {
                _this.tpinvolucradosReasignacion.root.cascade(function (n) {
                    Ext.each(_this.newRootChildReasig, function (n_arr) {
                        if (n_arr.id == n.id && n.ui.ctNode.offsetHeight < 3) {
                            n.ui.hide();
                        }
                    });
                });
                Ext.each(_this.arr_tempNodosReasig, function (n) {
                    n.ui.show();
                });
                _this.tpinvolucradosReasignacion.render();
            }
        }
    };
    this.setChildrenReasignacion = function (childrenNodos) {
        _this.newRootChildReasig = childrenNodos;

        _this.tpinvolucradosReasignacion.root.eachChild(function (n) {
            if (n.isExpanded())
                n.collapse(true, false);
            if (n.ui.ctNode.offsetHeight < 3) {
                if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                    _this.arr_tempNodosReasig.push(n);
                n.ui.hide();
            }
        });
        _this.tpinvolucradosReasignacion.root.appendChild(_this.newRootChildReasig);
        _this.tpinvolucradosReasignacion.render();
    };

    //buscar involucrados segun el nombre para heredar elementos
    this.BuscarInvolucradosHeredarElementos = function (e) {
        _this.BarraProgreso.show('Buscando involucrados');
        var text = _this.tfbuscarInvHeredarElementos.getValue();
        if (text) {
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/buscarinvolucrados',
                params: {
                    idelemento: _this.idelementoheredar,
                    denominacion: text,
                    estamodificando: 0,
                    idautor: null,
                    idtipoelemento: _this.tipoelementoheredar
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.msj == 3) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    } else
                        _this.setChildrenHeredarElementos(responseData.nodos);
                }
            });
        } else {
            _this.BarraProgreso.hide();
            if (_this.newRootChildHeredarElementos) {
                _this.tpinvolucradosHeredarElementos.root.cascade(function (n) {
                    Ext.each(_this.newRootChildHeredarElementos, function (n_arr) {
                        if (n_arr.id == n.id && n.ui.ctNode.offsetHeight < 3) {
                            n.ui.hide();
                        }
                    });
                });
                Ext.each(_this.arr_tempNodosHeredarElementos, function (n) {
                    n.ui.show();
                });
                _this.tpinvolucradosHeredarElementos.render();
            }
        }
    };
    this.setChildrenHeredarElementos = function (childrenNodos) {
        _this.newRootChildHeredarElementos = childrenNodos;

        _this.tpinvolucradosHeredarElementos.root.eachChild(function (n) {
            if (n.isExpanded())
                n.collapse(true, false);
            if (n.ui.ctNode.offsetHeight < 3) {
                if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                    _this.arr_tempNodosHeredarElementos.push(n);
                n.ui.hide();
            }
        });
        _this.tpinvolucradosHeredarElementos.root.appendChild(_this.newRootChildHeredarElementos);
        _this.tpinvolucradosHeredarElementos.render();
    };

    //Cargar grid de involucrados desde cliente
    this.CargarGridInvolucrados = function (involucrado) {
        _this.BarraProgreso.show(_this.msj + ' involucrado');
        var TopicRecord = Ext.data.Record.create([
            {
                name: 'denominacion'
            }, {
                name: 'idinvolucrado'
            }, {
                name: 'llaveinvolucrado'
            }, {
                name: 'tipo'
            }, {
                name: 'idusuario'
            }, {
                name: 'nombretipo'
            }, {
                name: 'idgrupo'
            }, {
                name: 'tipoinvol'
            }, {
                name: 'tipoinvolucrado'
            }, {
                name: 'idtipoinvolucrado'
            }
        ]);
        var myNewRecord = new TopicRecord(
            {
                denominacion: involucrado.denominacion,
                idinvolucrado: involucrado.idinvolucrado,
                llaveinvolucrado: involucrado.llaveinvolucrado,
                tipo: involucrado.tipo,
                idusuario: involucrado.idusuario,
                nombretipo: involucrado.nombretipo,
                idgrupo: involucrado.idgrupo,
                tipoinvol: involucrado.tipoinvol,
                idtipoinvolucrado: involucrado.idtipoinvolucrado,
                tipoinvolucrado: involucrado.denomtipoinvolucrado
            });
        _this.stGInvolucrados.add(myNewRecord);
        _this.BarraProgreso.hide();
    };

    //Cargar grid de involucrados desde cliente
    this.CargarGridInvolucradosGrupoNom = function (involucrado) {
        _this.BarraProgreso.show(_this.msj + ' involucrado');
        var TopicRecord = Ext.data.Record.create([
            {
                name: 'denominacion'
            }, {
                name: 'idinvolucrado'
            }, {
                name: 'llaveinvolucrado'
            }, {
                name: 'tipo'
            }, {
                name: 'idusuario'
            }, {
                name: 'nombretipo'
            }, {
                name: 'idgrupo'
            }, {
                name: 'tipoinvol'
            }
        ]);
        var myNewRecord = new TopicRecord(
            {
                denominacion: involucrado.denominacion,
                idinvolucrado: involucrado.idinvolucrado,
                llaveinvolucrado: involucrado.llaveinvolucrado,
                tipo: involucrado.tipo,
                idusuario: involucrado.idusuario,
                nombretipo: involucrado.nombretipo,
                idgrupo: involucrado.idgrupo,
                tipoinvol: involucrado.tipoinvol
            });
        _this.stGInvolucradosGrupoNom.add(myNewRecord);
        _this.BarraProgreso.hide();
    };

    //Cargar grid de involucrados desde cliente
    this.CargarGridInvolucradosCriterios = function (involucrado) {
        _this.BarraProgreso.show(_this.msjcriterio + ' involucrado');
        var TopicRecord = Ext.data.Record.create([
            {
                name: 'denominacion'
            }, {
                name: 'idinvolucrado'
            }, {
                name: 'llaveinvolucrado'
            }, {
                name: 'tipo'
            }, {
                name: 'idusuario'
            }, {
                name: 'nombretipo'
            }, {
                name: 'idgrupo'
            }, {
                name: 'tipoinvol'
            }
        ]);
        var myNewRecord = new TopicRecord(
            {
                denominacion: involucrado.denominacion,
                idinvolucrado: involucrado.idinvolucrado,
                llaveinvolucrado: involucrado.llaveinvolucrado,
                tipo: involucrado.tipo,
                idusuario: involucrado.idusuario,
                nombretipo: involucrado.nombretipo,
                idgrupo: involucrado.idgrupo,
                tipoinvol: involucrado.tipoinvol
            });
        _this.stGInvolucradosCirterio.add(myNewRecord);
        _this.BarraProgreso.hide();
    };

    //Cargar grid de involucrados para la reasignacion
    this.CargarGridInvolucradosReasignacion = function (involucrado) {
        _this.BarraProgreso.show(_this.msj + ' involucrado');
        var TopicRecord = Ext.data.Record.create([
            {
                name: 'denominacion'
            }, {
                name: 'idinvolucrado'
            }, {
                name: 'llaveinvolucrado'
            }, {
                name: 'tipo'
            }, {
                name: 'idusuario'
            }, {
                name: 'nombretipo'
            }, {
                name: 'idgrupo'
            }, {
                name: 'tipoinvol'
            }
        ]);
        var myNewRecord = new TopicRecord(
            {
                denominacion: involucrado.denominacion,
                idinvolucrado: involucrado.idinvolucrado,
                llaveinvolucrado: involucrado.llaveinvolucrado,
                tipo: involucrado.tipo,
                idusuario: involucrado.idusuario,
                nombretipo: involucrado.nombretipo,
                idgrupo: involucrado.idgrupo,
                tipoinvol: involucrado.tipoinvol
            });
        _this.stGInvolucradosReasignacion.add(myNewRecord);
        _this.BarraProgreso.hide();
    };

    //Cargar grid de involucrados para la reasignacion
    this.CargarGridInvolucradosHeredarElementos = function (involucrado, accion) {
        _this.BarraProgreso.show('Publicando ARC para el subordinado seleccionado');
        var url = 'eliminarinvolucrados';
        if (accion == 'adicionar') {
            url = 'adicionarinvolucrados';
            var TopicRecord = Ext.data.Record.create([
                {
                    name: 'denominacion'
                }, {
                    name: 'idinvolucrado'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }
            ]);
            var myNewRecord = new TopicRecord(
                {
                    denominacion: involucrado.denominacion,
                    idinvolucrado: involucrado.idinvolucrado,
                    llaveinvolucrado: involucrado.llaveinvolucrado,
                    tipo: involucrado.tipo,
                    idusuario: involucrado.idusuario,
                    nombretipo: involucrado.nombretipo,
                    idgrupo: involucrado.idgrupo,
                    tipoinvol: involucrado.tipoinvol
                });
            _this.stGInvolucradosHeredarElementos.add(myNewRecord);
        }

        Ext.Ajax.request(
            {
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/' + url,
                params: {
                    involucrado: Ext.encode(involucrado),
                    idelemento: _this.idelementoheredar,
                    idtipoelemento: _this.tipoelementoheredar,
                    estamodificando: 1
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                }
            });

        _this.BarraProgreso.hide();
    };

    //buscar autores o involucrados segun el nombre
    this.BuscarAutoresInvolucrados = function (e, idelemento, estamodificando, tipoelemento, idautor) {
        var mensaje = 'Buscando autores';
        var termino = 'autores';
        var treepanel = _this.tpAutoresBusqueda;
        if (_this.tabactivo == 'involucrados') {
            mensaje = 'Buscando involucrados';
            termino = 'involucrados';
            treepanel = _this.tpInvolucradosBusqueda;
        }
        //_this.BarraProgreso.show(mensaje);
        treepanel.body.mask(mensaje, 'x-mask-loading');
        var text = _this.tfbuscarInvBusqueda.getValue();
        if (text) {
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/buscarinvolucrados',
                params: {
                    idelemento: idelemento,
                    denominacion: text,
                    estamodificando: estamodificando,
                    idautor: idautor,
                    idtipoelemento: tipoelemento,
                    permiso: 'leer'
                },
                callback: function (options, success, response) {
                    //_this.BarraProgreso.hide();
                    treepanel.body.unmask();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.msj == 3) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    } else {
                        _this.tfbuscarInvBusqueda.focus(false, 1);
                    }
                    _this.setChildrenAutoresInvolucrados(responseData.nodos, treepanel);
                }
            });
        } else {
            //_this.BarraProgreso.hide();
            treepanel.body.unmask();
            if (_this.newRootChildAI) {
                treepanel.root.cascade(function (n) {
                    Ext.each(_this.newRootChildAI, function (n_arr) {
                        if (n_arr.id == n.id && n.ui.ctNode.offsetHeight < 3) {
                            n.ui.hide();
                        }
                    });
                });
                Ext.each(_this.arr_tempNodosAI, function (n) {
                    n.ui.show();
                });
                treepanel.render();
            }
        }
    };
    this.setChildrenAutoresInvolucrados = function (childrenNodos, treepanel) {
        _this.newRootChildAI = childrenNodos;
        treepanel.root.eachChild(function (n) {
            if (n.isExpanded())
                n.collapse(true, false);
            if (n.ui.ctNode.offsetHeight < 3) {
                if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                    _this.arr_tempNodosAI.push(n);
                n.ui.hide();
            }
        });
        treepanel.root.appendChild(_this.newRootChildAI);
        treepanel.render();
        var store = _this.stGAutoresBusqueda;
        if (_this.tabactivo == 'involucrados') {
            store = _this.stGInvolucradosBusqueda;
        }
        treepanel.root.eachChild(function (n) {
            _this.ChequearInvolucradosDesdeClienteBusqueda(n, _this.tabactivo, store);
        })
    };
    //Listar autores
    this.listarAutoresBusqueda = function (nodo, check) {
        _this.existeautorbus = 0;
        var autorbus = {};
        var idautor = nodo.attributes.idusuario;
        var nombretipo = "Usuario";
        if (nodo.attributes.tipo == 0) {
            idautor = nodo.attributes.idgrupo;
            nombretipo = "Grupo";
        }
        if (check == true) {
            for (var i = 0; i < _this.arrayautoresbus.length; i++) {
                if (_this.arrayautoresbus[i].idautor == idautor) {
                    _this.existeautorbus = 1;
                }
            }
            if (_this.existeautorbus == 0) {
                autorbus = {
                    idusuario: nodo.attributes.idusuario,
                    idgrupo: nodo.attributes.idgrupo,
                    tipo: nodo.attributes.tipo,
                    idautor: idautor,
                    nombretipo: nombretipo,
                    denominacion: nodo.text
                };
                //AQUI
                _this.arrayautoresbus.push(autorbus);
                _this.CargarGridAutoresBusqueda();
            }
        } else {
            for (var i = 0; i < _this.arrayautoresbus.length; i++) {
                if (_this.arrayautoresbus[i].idautor == idautor) {
                    index = i;

                    _this.arrayautoresbus.splice(index, 1);
                }
            }
            _this.CargarGridAutoresBusqueda();
        }
    };
    //Cargar grid de autores
    this.CargarGridAutoresBusqueda = function () {
        var arrayrecords = [];
        for (var i = 0; i < _this.arrayautoresbus.length; i++) {

            var TopicRecord = Ext.data.Record.create([
                {
                    name: 'denominacion'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'idautor'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipo'
                }, {
                    name: 'nombretipo'
                }
            ]);
            var myNewRecord = new TopicRecord(
                {
                    denominacion: _this.arrayautoresbus[i]['denominacion'],
                    idusuario: _this.arrayautoresbus[i]['idusuario'],
                    idgrupo: _this.arrayautoresbus[i]['idgrupo'],
                    idautor: _this.arrayautoresbus[i]['idautor'],
                    tipo: _this.arrayautoresbus[i]['tipo'],
                    nombretipo: _this.arrayautoresbus[i]['nombretipo']
                });
            arrayrecords.push(myNewRecord);
        }
        _this.stGAutoresBusqueda.removeAll();
        for (var j = 0; j < arrayrecords.length; j++) {
            _this.stGAutoresBusqueda.add(arrayrecords[j]);
        }
    };

    //Listar autores
    this.listarInvolucradosBusqueda = function (nodo, check) {
        _this.existeinvolucradobus = 0;
        var involucradobus = {};
        var idinvolucrado = nodo.attributes.idusuario;
        if (nodo.attributes.tipo == 0) {
            idinvolucrado = nodo.attributes.idgrupo;
        } else if (nodo.attributes.tipo == 2) {
            idinvolucrado = nodo.attributes.idestructura;
        }
        if (check == true) {
            for (var i = 0; i < _this.arrayinvolucradosbus.length; i++) {
                if (_this.arrayinvolucradosbus[i].idinvolucrado == idinvolucrado) {
                    _this.existeinvolucradobus = 1;
                }
            }
            if (_this.existeinvolucradobus == 0) {
                involucradobus = {
                    idinvolucrado: idinvolucrado,
                    denominacion: nodo.text,
                    idusuario: nodo.attributes.idusuario,
                    idgrupo: nodo.attributes.idgrupo,
                    tipo: nodo.attributes.tipo
                };
                _this.arrayinvolucradosbus.push(involucradobus);
                _this.CargarGridInvolucradosBus();
            }
        } else {
            for (var i = 0; i < _this.arrayinvolucradosbus.length; i++) {
                if (_this.arrayinvolucradosbus[i].idinvolucrado == idinvolucrado) {
                    index = i;
                    _this.arrayinvolucradosbus.splice(index, 1);
                }
            }
            _this.CargarGridInvolucradosBus();
        }
    };
    //Cargar grid de involucrados en ARC
    this.CargarGridInvolucradosBus = function () {
        var arrayrecords = [];
        for (var i = 0; i < _this.arrayinvolucradosbus.length; i++) {
            var TopicRecord = Ext.data.Record.create([
                {
                    name: 'denominacion'
                }, {
                    name: 'idinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }
            ]);

            var nombretipo = 'Usuario';
            if (_this.arrayinvolucradosbus[i]['tipo'] == 0) {
                nombretipo = 'Grupo';
            }
            var myNewRecord = new TopicRecord(
                {
                    denominacion: _this.arrayinvolucradosbus[i]['denominacion'],
                    idinvolucrado: _this.arrayinvolucradosbus[i]['idinvolucrado'],
                    tipo: _this.arrayinvolucradosbus[i]['tipo'],
                    idusuario: _this.arrayinvolucradosbus[i]['idusuario'],
                    nombretipo: nombretipo,
                    idgrupo: _this.arrayinvolucradosbus[i]['idgrupo']
                });
            arrayrecords.push(myNewRecord);
        }
        _this.stGInvolucradosBusqueda.removeAll();
        for (var j = 0; j < arrayrecords.length; j++) {
            _this.stGInvolucradosBusqueda.add(arrayrecords[j]);
        }
    };

    //reasignar elementos
    this.Reasignar = function () {
        var puedereasignar = 1;
        var arrayinvolucradosreasign = _this.ObtenerInvolucradosReasignacion();
        if (arrayinvolucradosreasign.length < 0) {
            puedereasignar = 0;
        }
        var idestado = _this.cbestados.getValue();
        if (!idestado) {
            puedereasignar = 2;
        }
        switch (puedereasignar) {
            case 0:
                mostrarMensaje(1, 'Para reasignar debe seleccionar al menos un involucrado.');
                break;
            case 1:
                _this.BarraProgreso.show('Reasignando');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/reasignar',
                    params: {
                        idelemento: _this.idelemento,
                        tipoelemento: _this.tipoelemento,
                        accion:0,
                        involucrados: Ext.encode(arrayinvolucradosreasign),
                        idestadoaprob: idestado
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mensaje = 'La reasignaci&oacute;n ha sido realizada satisfactoriamente.';
                            mostrarMensaje(1, mensaje);
                            _this.winReasignacion.destroy();
                            _this.AccionesPostReasignacion(responseData.mensaje, 'Reasignar');
                        }
                        if (responseData.mensaje == 0) {
                            mensaje = 'El elemento que usted quiere reasignar ya no se encuentra en los registros.';
                            mostrarMensaje(responseData.mensaje, mensaje, function () {
                                _this.winReasignacion.destroy();
                                _this.AccionesPostReasignacion(responseData.mensaje, 'Reasignar');
                            });
                        }
                    }
                });
                break;
            case 2:
                mostrarMensaje(1, 'Para reasignar debe seleccionar el estado.');
                break;
        }
    };

    this.ReasignarMultiplesElementos = function () {
        var puedereasignar = 1;
        var arrayinvolucradosreasign = _this.ObtenerInvolucradosReasignacion();
        if (arrayinvolucradosreasign.length < 0) {
            puedereasignar = 0;
        }
        var idestado = _this.cbestados.getValue();
        if (!idestado) {
            puedereasignar = 2;
        }
        switch (puedereasignar) {
            case 0:
                mostrarMensaje(1, 'Para reasignar debe seleccionar al menos un involucrado.');
                break;
            case 1:
                _this.BarraProgreso.show('Reasignando');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/reasignar',
                    params: {
                        idelemento: Ext.encode(_this.idelementos),
                        accion:1,
                        tipoelemento: _this.tipoelemento,
                        involucrados: Ext.encode(arrayinvolucradosreasign),
                        idestadoaprob: idestado
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mensaje = 'La reasignaci&oacute;n ha sido realizada satisfactoriamente.';
                            mostrarMensaje(1, mensaje);
                            _this.winReasignacionMultiple.destroy();
                            _this.AccionesPostReasignacion(responseData.mensaje, 'Reasignar');
                        }
                        if (responseData.mensaje == 0) {
                            mensaje = 'El elemento que usted quiere reasignar ya no se encuentra en los registros.';
                            mostrarMensaje(responseData.mensaje, mensaje, function () {
                                _this.winReasignacionMultiple.destroy();
                                _this.AccionesPostReasignacion(responseData.mensaje, 'Reasignar');
                            });
                        }
                    }
                });
                break;
            case 2:
                mostrarMensaje(1, 'Para reasignar debe seleccionar el estado.');
                break;
        }
    };

    this.ObtenerInvolucrados = function (array) {
        var arrayinvol = [];
        var involucrado = {};
        var arrayinvolgrid = _this.stGInvolucrados.getRange();
        if (arrayinvolgrid.length > 0) {
            for (var i = 0; i < arrayinvolgrid.length; i++) {
                nodo = arrayinvolgrid[i];
                var id = nodo.data.idusuario;
                if (nodo.data.tipo == 0) {
                    id = nodo.data.idgrupo;
                } else if (nodo.data.tipo == 2) {
                    id = nodo.data.idestructura;

                }
                var llaveinvolucrado = id;
                involucrado = {
                    idinvolucrado: llaveinvolucrado,
                    llaveinvolucrado: llaveinvolucrado,
                    denominacion: nodo.data.denominacion,
                    idusuario: nodo.data.idusuario,
                    idgrupo: nodo.data.idgrupo,
                    tipo: nodo.data.tipo,
                    idestructura: nodo.data.idestructura,
                    nombretipo: nodo.data.nombretipo,
                    tipoinvol: nodo.data.tipoinvol,
                    idtipoinvolucrado: nodo.data.idtipoinvolucrado,
                    actualiza: nodo.data.actualiza
                };
                if (array)
                    arrayinvol.push(llaveinvolucrado);
                else
                    arrayinvol.push(involucrado);
            }
        }
        return arrayinvol;
    };

    this.ObtenerListadoGrupoNom = function (array) {
        var arrayinvol = [];
        var involucrado = {};
        var arrayinvolgrid = _this.stGInvolucradosGrupoNom.getRange();
        if (arrayinvolgrid.length > 0) {
            for (var i = 0; i < arrayinvolgrid.length; i++) {
                nodo = arrayinvolgrid[i];
                var id = nodo.data.idusuario;
                if (nodo.data.tipo == 0) {
                    id = nodo.data.idgrupo;
                }
                var llaveinvolucrado = id + nodo.data.tipoinvol;
                involucrado = {
                    idinvolucrado: llaveinvolucrado,
                    llaveinvolucrado: llaveinvolucrado,
                    denominacion: nodo.data.denominacion,
                    idusuario: nodo.data.idusuario,
                    idgrupo: nodo.data.idgrupo,
                    tipo: nodo.data.tipo,
                    nombretipo: nodo.data.nombretipo,
                    tipoinvol: nodo.data.tipoinvol
                };
                if (array)
                    arrayinvol.push(llaveinvolucrado);
                else
                    arrayinvol.push(involucrado);
            }
        }
        return arrayinvol;
    };

    this.ObtenerInvolucradosEliminar = function (array) {
        return _this.arrayinvoleliminar;
    };

    this.ObtenerInvolucradosCriterios = function (arrayid) {
        var arrayinvol = [];
        var involucrado = {};
        var arrayinvolgrid = _this.stGInvolucradosCirterio.getRange();
        if (arrayinvolgrid.length > 0) {
            for (var i = 0; i < arrayinvolgrid.length; i++) {
                nodo = arrayinvolgrid[i];
                var id = nodo.data.idusuario;
                if (nodo.data.tipo == 0) {
                    id = nodo.data.idgrupo;
                }
                var llaveinvolucrado = id + nodo.data.tipoinvol;
                if (arrayid) {
                    involucrado = llaveinvolucrado;
                } else {
                    involucrado = {
                        idinvolucrado: llaveinvolucrado,
                        llaveinvolucrado: llaveinvolucrado,
                        denominacion: nodo.data.denominacion,
                        idusuario: nodo.data.idusuario,
                        idgrupo: nodo.data.idgrupo,
                        tipo: nodo.data.tipo,
                        nombretipo: nodo.data.nombretipo,
                        tipoinvol: nodo.data.tipoinvol
                    };
                }
                arrayinvol.push(involucrado);
            }
        }
        return arrayinvol;
    };

    this.ObtenerInvolucradosReasignacion = function () {
        var arrayinvol = [];
        var involucrado = {};
        var arrayinvolgrid = _this.stGInvolucradosReasignacion.getRange();
        if (arrayinvolgrid.length > 0) {
            for (var i = 0; i < arrayinvolgrid.length; i++) {
                nodo = arrayinvolgrid[i];
                var id = nodo.data.idusuario;
                if (nodo.data.tipo == 0) {
                    id = nodo.data.idgrupo;
                }
                if (nodo.data.tipo == 2) {
                    id = nodo.data.idinvolucrado;
                }
                var llaveinvolucrado = id + nodo.data.tipoinvol;
                involucrado = {
                    idinvolucrado: llaveinvolucrado,
                    llaveinvolucrado: llaveinvolucrado,
                    denominacion: nodo.data.denominacion,
                    idusuario: nodo.data.idusuario,
                    idgrupo: nodo.data.idgrupo,
                    tipo: nodo.data.tipo,
                    nombretipo: nodo.data.nombretipo,
                    tipoinvol: nodo.data.tipoinvol
                };
                arrayinvol.push(involucrado);
            }
        }
        return arrayinvol;
    };

    this.ObtenerAutoresBusqueda = function () {
        var arrayautoresbus = [];
        var autorbus = {};
        var arrayautoresbusgrid = _this.stGAutoresBusqueda.getRange();
        if (arrayautoresbusgrid.length > 0) {
            for (var i = 0; i < arrayautoresbusgrid.length; i++) {
                nodo = arrayautoresbusgrid[i];
                var idautor = nodo.data.idusuario;
                if (nodo.data.tipo == 0) {
                    idautor = nodo.data.idgrupo;
                }
                autorbus = {
                    idautor: idautor,
                    tipo: nodo.data.tipo
                };
                arrayautoresbus.push(autorbus);
            }
        }
        return arrayautoresbus;
    };

    this.ObtenerInvolucradosBusqueda = function () {
        var arrayinvolucradosbus = [];
        var involucradobus = {};
        var arrayinvolbusgrid = _this.stGInvolucradosBusqueda.getRange();
        if (arrayinvolbusgrid.length > 0) {
            for (var i = 0; i < arrayinvolbusgrid.length; i++) {
                nodo = arrayinvolbusgrid[i];
                var id = nodo.data.idusuario;
                if (nodo.data.tipo == 0) {
                    id = nodo.data.idgrupo;
                }
                if (nodo.data.tipo == 2) {
                    id = nodo.data.idinvolucrado;
                }
                var idinvolucrado = id;
                involucradobus = {
                    idinvolucrado: idinvolucrado,
                    text: nodo.data.denominacion,
                    idusuario: nodo.data.idusuario,
                    idgrupo: nodo.data.idgrupo,
                    tipo: nodo.data.tipo
                };
                arrayinvolucradosbus.push(involucradobus);
            }
        }
        return arrayinvolucradosbus;
    };

    this.verificarCantAutoresInvolBusqueda = function () {
        (_this.ObtenerAutoresBusqueda().length > 0 || _this.ObtenerInvolucradosBusqueda().length > 0) ?
            _this.verificarAutoresInvolBusqueda = true : _this.verificarAutoresInvolBusqueda = false;
    }

    this.ResetearArbolesBusqueda = function () {
        if (_this.tpAutoresBusqueda.getRootNode().rendered) {
            _this.tpAutoresBusqueda.getRootNode().reload();
        }
        _this.arrayautoresbus = [];
        _this.stGAutoresBusqueda.removeAll();
        if (_this.tpInvolucradosBusqueda.getRootNode().rendered) {
            _this.tpInvolucradosBusqueda.getRootNode().reload();
        }
        _this.stGInvolucradosBusqueda.removeAll();
        if (_this.tfbuscarInvBusqueda.getValue()) {
            _this.tfbuscarInvBusqueda.reset();
        }
        _this.verificarAutoresInvolBusqueda = false;
    };

    this.ResetearArregloDeInvolucrados = function () {
        _this.arrayinvolucrados = [];
    };

    this.ResetearArregloDeInvolucradosEliminar = function () {
        _this.arrayinvoleliminar = [];
    };

    this.ChequearInvolucradosDesdeCliente = function (nodo, accion, storegrid) {
        if ((nodo.id == 'nodo1' || nodo.id == 'nodo2' || nodo.id == 'nodo3' || nodo.id == 'nodo4' || nodo.id == 'nodo5') && (_this.estamodificando == 1 || _this.confperfil == 1) && accion != 'append') {
            if (nodo.hasChildNodes()) {
                var arrayinvexistentes = storegrid.getRange();
                if (arrayinvexistentes.length > 0) {
                    nodo.eachChild(function (anodehijo) {
                        id = anodehijo.attributes.idusuario;
                        if (anodehijo.attributes.tipo == 0) {
                            id = anodehijo.attributes.idgrupo;
                        } else if (anodehijo.attributes.tipo == 2) {
                            id = anodehijo.attributes.idestructura;
                            var llaveinvolucrado = id + '1';
                        }
                        if (anodehijo.attributes.tipo != 2)
                            var llaveinvolucrado = id + anodehijo.attributes.tipoinvol;
                        var con = 0;
                        for (var j = 0; j < arrayinvexistentes.length; j++) {
                            if (arrayinvexistentes[j].data.llaveinvolucrado == llaveinvolucrado) {
                                con++;
                                anodehijo.getUI().toggleCheck(true);
                            }
                            if (arrayinvexistentes[j].data.idusuario == id) {
                                con++;
                                anodehijo.getUI().toggleCheck(true);
                            }
                            if (arrayinvexistentes[j].data.idgrupo == id) {
                                con++;
                                anodehijo.getUI().toggleCheck(true);
                            }
                            if (arrayinvexistentes[j].data.idestructura == id) {
                                con++;
                                anodehijo.getUI().toggleCheck(true);
                            }
                        }
                    });
                }
            }
        }

        if (accion == 'append' && _this.estamodificando == 0 || !_this.estamodificando) {
            var arrayinvexistentes = storegrid.getRange();
            if (arrayinvexistentes.length > 0) {
                id = nodo.attributes.idusuario;
                if (nodo.attributes.tipo == 0) {
                    id = nodo.attributes.idgrupo;
                }
                var llaveinvolucrado = id + nodo.attributes.tipoinvol;
                for (var j = 0; j < arrayinvexistentes.length; j++) {
                    if (arrayinvexistentes[j].data.llaveinvolucrado == llaveinvolucrado) {
                        nodo.getUI().toggleCheck(true);
                    }
                }
            }
        }
    };

    this.ChequearInvolucradosDesdeClienteCriterio = function (nodo, accion, storegrid) {
        if ((nodo.id == 'nodo1' || nodo.id == 'nodo2' || nodo.id == 'nodo3' || nodo.id == 'nodo4')
            && _this.estamodificandocriterio == 0 && accion != 'append') {
            if (nodo.hasChildNodes()) {
                var arrayinvexistentes = storegrid.getRange();
                if (arrayinvexistentes.length > 0) {
                    nodo.eachChild(function (anodehijo) {
                        id = anodehijo.attributes.idusuario;
                        if (anodehijo.attributes.tipo == 0) {
                            id = anodehijo.attributes.idgrupo;
                        }
                        var llaveinvolucrado = id + anodehijo.attributes.tipoinvol;
                        for (var j = 0; j < arrayinvexistentes.length; j++) {
                            if (arrayinvexistentes[j].data.llaveinvolucrado == llaveinvolucrado) {
                                anodehijo.getUI().toggleCheck(true);
                            }
                        }
                    });
                }
            }
        }

        if (accion == 'append' && _this.estamodificando == 0 || !_this.estamodificando) {
            var arrayinvexistentes = storegrid.getRange();
            if (arrayinvexistentes.length > 0) {
                id = nodo.attributes.idusuario;
                if (nodo.attributes.tipo == 0) {
                    id = nodo.attributes.idgrupo;
                }
                var llaveinvolucrado = id + nodo.attributes.tipoinvol;
                for (var j = 0; j < arrayinvexistentes.length; j++) {
                    if (arrayinvexistentes[j].data.llaveinvolucrado == llaveinvolucrado) {
                        nodo.getUI().toggleCheck(true);
                    }
                }
            }
        }
    };

    this.ChequearInvolucradosDesdeClienteBusqueda = function (nodo, panelactivo, storegrid) {
        if (_this.estamodificando == 0 || !_this.estamodificando) {
            if (panelactivo == 'involucrados') {
                var arrayinvexistentes = storegrid.getRange();
                id = nodo.attributes.idusuario;
                if (nodo.attributes.tipo == 0) {
                    id = nodo.attributes.idgrupo;
                }
                var idinvolucrado = id;
                for (var j = 0; j < arrayinvexistentes.length; j++) {
                    if (arrayinvexistentes[j].data.idinvolucrado == idinvolucrado) {
                        nodo.getUI().toggleCheck(true);
                    }
                }
            }
            if (panelactivo == 'autores') {
                var arrayinvexistentes = storegrid.getRange();
                idusuario = nodo.attributes.idusuario;
                for (var j = 0; j < arrayinvexistentes.length; j++) {
                    if (arrayinvexistentes[j].data.idusuario == idusuario) {
                        nodo.getUI().toggleCheck(true);
                    }
                }
            }
        }
    };

    this.recorrerArbolInvolucrados = function (tree) {
        var result = '';
        var nodo = 1;
        tree.getRootNode().eachChild(function (childnode) {
            result += nodo;
            childnode.eachChild(function (leaf) {
                (leaf.attributes.checked) ? result += 't' : result += 'f';
            });
            nodo++;
        });
        return result;
    };

    this.comprobarCambiosInv = function (involucrado, msj) {
        var inicial = _this.arrayInicialInv;
        switch (msj) {
            case 'Adicionando':
                if (inicial.length == 0) {
                    _this.modificarInv = true;
                    _this.arrayTempInv.push(involucrado);
                } else {
                    _this.arrayTempInv.push(involucrado);
                    _this.modificarInv = !_this.compararArray(inicial, _this.arrayTempInv);
                }
                break;
            case 'Eliminando':
                if (inicial.length == 0 && _this.arrayTempInv.length == 1) {
                    _this.modificarInv = false;
                    _this.arrayTempInv = [];
                } else {
                    _this.eliminarElemento(_this.arrayTempInv, involucrado);
                    _this.modificarInv = !_this.compararArray(inicial, _this.arrayTempInv);
                }
                break;
        }
        return _this.modificarInv;
    };

    this.comprobarCambiosInvCriterio = function () {
        var inicial = _this.arrayInicialInv;
        var temp = _this.arrayTempInv;
        _this.modificarInv = !_this.compararArray(inicial, temp);
        return _this.modificarInv;
    };

    this.compararArray = function (arrayIni, arrayTemp) {
        var contador = 0;
        var parada = 0;
        if (arrayIni.length == arrayTemp.length) {
            for (var i = 0; i < arrayIni.length; i++) {
                for (var j = 0; j < arrayTemp.length; j++) {
                    if (arrayIni[i].data.llaveinvolucrado == arrayTemp[j].llaveinvolucrado) {
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
    };

    this.buscarElemento = function (inicial, involucrado) {
        var longitud = Object.keys(inicial).length;
        var result = false;
        for (var i = 0; i < longitud; i++) {
            if (inicial[i].data.llaveinvolucrado == involucrado.llaveinvolucrado) {
                result = true;
                break;
            }
        }
        return result;
    };

    this.eliminarElemento = function (arrayTempInv, involucrado) {
        for (var i = 0; i < arrayTempInv.length; i++) {
            if (arrayTempInv[i].llaveinvolucrado == involucrado.llaveinvolucrado) {
                arrayTempInv.splice(i, 1);
                break;
            }
        }
    };

    this.limpiarParaReportes = function () {
        _this.tfbuscarInvBusqueda.reset();

        _this.tpAutoresBusqueda.root.reload();
        _this.stGAutoresBusqueda.removeAll();

        _this.tpInvolucradosBusqueda.root.reload();
        _this.stGInvolucradosBusqueda.removeAll();

    };

    this.ResetearCampos = function () {
        _this.tpinvolucrados.root.reload();
        _this.stGInvolucrados.removeAll();
    };
    this.ResetearCriterio = function () {
        _this.tpinvolucradosCriterio.root.reload();
        _this.stGInvolucradosCirterio.removeAll();
    };

    this.ResetearCamposGrupoNom = function () {
        _this.tpinvolucradosGrupoNom.root.reload();
        _this.stGInvolucradosGrupoNom.removeAll();
    };

    this.CrearVentanaConfigurarInvol = function (nodo, check) {
        this.stcbtiposactividad = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idtipo',
                root: "data"
            }, [{
                name: 'denominacion'
            }, {
                name: 'idtipo'
            }, {
                name: 'incidencia'
            }]),
            listeners: {
                beforeload: function (st, opt) {
                    st.baseParams.tiponomenclador = 9;
                },
                load: function (store, records, options) {
                    if (store.getCount() == 0) {
                        _this.listarInvolucradosAct(nodo, check, 1);
                        wConfigSubordinados.destroy();
                    } else {
                        wConfigSubordinados.show();
                    }
                }
            }
        });
        //combo del modo donde muestro la cantidad de elementos por paginas del grid
        this.cbtiposactividad = new Ext.form.ComboBox({
            fieldLabel: 'Involucrar como',
            store: _this.stcbtiposactividad,
            displayField: 'denominacion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            iconCls: 'asociar',
            valueField: 'idtipo',
            width: 210,
            emptyText: 'Seleccionar',
            listeners: {
                select: function (cb, record, index) {
                    _this.involucradoSelected = {
                        idtipo: record.data.idtipo,
                        denominacion: record.data.denominacion
                    };
                }
            }
        });

        this.fpConfig = new Ext.FormPanel({
            id: 'fpConfig',
            frame: true,
            border: true,
            rezisable: false,
            width: 370,
            height: 90,
            items: [_this.cbtiposactividad]
        });

        wConfigSubordinados = new Ext.Window({
            title: 'Configurar involucrados',
            width: 345,
            height: 105,
            modal: true,
            items: [_this.fpConfig],
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
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    handler: function () {
                        if (_this.fpConfig.getForm().isValid()) {
                            _this.idestructurainvol = _this.cbtiposactividad.getValue();
                            //console.log(_this.involucradoSelected);
                            _this.listarInvolucradosAct(nodo, check, 0);
                            _this.tpEntidades.getRootNode().cascade(function (n) {
                                var ui = n.getUI();
                                if (n.id == nodo.attributes.id)
                                    ui.toggleCheck(true);
                            });
                            _this.tpinvolucrados.getRootNode().cascade(function (n) {
                                var ui = n.getUI();
                                if (n.id == nodo.attributes.id)
                                    ui.toggleCheck(true);
                            });
                            wConfigSubordinados.destroy();
                        } else
                            mostrarMensaje(1, 'Por favor verifique que hay campo(s) vac&iacute;o(s).');
                    },
                    tooltip: 'Guardar datos y cerrar ventana'
                })
            ]
        });
    };

    this.Mostrarmenuarbol = function (node, xy) {
        if (_this.menuNode.items == undefined || _this.menuNode.items.length == 0) {
            _this.menuNode.addMenuItem({
                text: 'Involucrar como',
                iconCls: 'asociar',
                tooltip: 'Configurar involucrados',
                handler: function () {
                    _this.CrearVentanaConfigurarInvol(node, true);
                }
            });
        } else {
            _this.menuNode.removeAll();
            _this.Mostrarmenuarbol(node, xy);
        }
        _this.menuNode.showAt(xy);
    };

    this.devolverInvolucradoSelected = function () {
        return _this.involucradoSelected;
    };

    this.resolverConflicto = function (arrayidinvoltienenconflictos) {
        var arraydatosinvolucrados = _this.stGInvolucrados.getRange();

        for (var i = 0; i < arrayidinvoltienenconflictos.length; i++) {
            for (var j = 0; j < arraydatosinvolucrados.length; j++) {
                if (arraydatosinvolucrados[j].data.idusuario == arrayidinvoltienenconflictos[i]) {
                    _this.stGInvolucrados.remove(arraydatosinvolucrados[j]);
                    _this.tpinvolucrados.getRootNode().cascade(function (n) {
                        var ui = n.getUI();
                        if (n.attributes.idusuario == arrayidinvoltienenconflictos[i])
                            ui.toggleCheck(false);
                    });
                }
            }
        }
    };

    this.cargarArbolPublicados = function (arrayidusuariosinvol) {
        for (var i = 0; i < arrayidusuariosinvol.length; i++) {
            _this.tpinvolucrados.getRootNode().cascade(function (n) {
                var ui = n.getUI();
                if (n.id == arrayidusuariosinvol[i])
                    ui.toggleCheck(true);
                _this.listarInvolucradosAct(n, true, 1);
            });
        }
    };

    this.enviarDatosTipoInvolucrados = function () {
        var arrayPorcTiposInvolucrados = [];
        var porcinvol = _this.stGInvolucrados.getRange();
        if (porcinvol.length > 0) {
            for (var i = 0; i < porcinvol.length; i++) {
                var porcinvolsent = {
                    idinvol: porcinvol[i].data.idinvolucrado,
                    idtipoinvol: porcinvol[i].data.idtipoinvolucrado,
                    llaveinvolucrado: porcinvol[i].data.llaveinvolucrado,
                    porccump: porcinvol[i].data.incidencia
                };
                arrayPorcTiposInvolucrados.push(porcinvolsent);
            }
        }
        return arrayPorcTiposInvolucrados;
    };

    this.cargarInvolConfPerfil = function (tipoelemento) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarInvolConfPerfil',
            params: {
                tipoelemento: tipoelemento
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                var involucrados = responseData.array_invol;
                if (responseData.tienecompinvol == 'true') {
                    _this.confperfil = 1;
                    for (var i = 0; i < involucrados.length; i++) {
                        var TopicRecord = Ext.data.Record.create([
                            {
                                name: 'denominacion'
                            }, {
                                name: 'idinvolucrado'
                            }, {
                                name: 'llaveinvolucrado'
                            }, {
                                name: 'tipo'
                            }, {
                                name: 'idusuario'
                            }, {
                                name: 'nombretipo'
                            }, {
                                name: 'idestructura'
                            }, {
                                name: 'idgrupo'
                            }, {
                                name: 'tipoinvol'
                            }, {
                                name: 'tipoinvolucrado'
                            }, {
                                name: 'idtipoinvolucrado'
                            }
                        ]);
                        var myNewRecord = new TopicRecord(
                            {
                                denominacion: involucrados[i].denominacion,
                                idinvolucrado: involucrados[i].idinvolucrado,
                                llaveinvolucrado: involucrados[i].llaveinvolucrado,
                                tipo: involucrados[i].idtipo,
                                idusuario: involucrados[i].idusuario,
                                nombretipo: involucrados[i].nombretipo,
                                idgrupo: involucrados[i].idgrupo,
                                tipoinvol: involucrados[i].tipoinvol,
                                idtipoinvolucrado: involucrados[i].idtipoinvolucrado,
                                tipoinvolucrado: involucrados[i].tipoinvolucrado,
                                idestructura: involucrados[i].idestructura
                            });
                        _this.stGInvolucrados.add(myNewRecord);

                    }
                }
            }
        });
    };

    function MostrarImagen(val) {
        if (val == 0) {

            return ' ';
        }
        if (val > 0) {
            return ' <span><center><img src="../../../comun/recursos/images/fam/tick.png" ></center></span>';
        }
    }

    this.esNumImpar = function (num) {
        if (num == 1 || (num % 2) == 1)
            return true;
        else
            return false;
    };

    this.CrearClasificadorInvolIncidenciaDesviacion = function (idelemento, tipoelemento, estamodificando, idautorelemento, desdeConf) {
        _this.idelemento = idelemento;
        _this.estamodificando = estamodificando;
        _this.tipoelemento = tipoelemento;
        _this.idautor = idautorelemento;
        if (_this.pPrincipal) {
            _this.pPrincipal.destroy();
        }
        _this.btnBusqueda = new Ext.Button({
            disabled: true,
            handler: function () {
                if (_this.tfbuscarInv.isValid()) {
                    _this.BuscarInvolucrados();
                    if (_this.tfbuscarInv.getValue() == '') {
                        _this.tpinvolucrados.root.reload();
                    }
                }
            },
            text: '',
            iconCls: 'buscar',
            tooltip: 'Buscar usuario(s), grupo(s) y estructura(s)',
            prevTab: 'tfbuscarInvDes',
            nextTab: 'btnLimpiarInsiDesv',
            id: 'btnBusquedaDes',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.btnLimpiarInsiDesv = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.tpinvolucrados.root.reload();
                _this.tfbuscarInv.reset();
                _this.btnBusqueda.disable();
                _this.btnLimpiarInsiDesv.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            id: 'btnLimpiarInsiDesv',
            prevTab: 'btnBusquedaDes',
            nextTab: 'expandirInsiDesv',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        //Textfiel para buscar involucrado
        _this.tfbuscarInv = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 200,
                id: 'tfbuscarInvDes',
                nextTab: 'btnBusquedaDes',
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInv.isValid()) {
                                _this.BuscarInvolucrados(e);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBusqueda.enable();
                            _this.btnLimpiarInsiDesv.enable();
                        } else {
                            _this.btnBusqueda.disable();
                            _this.btnLimpiarInsiDesv.disable();
                        }
                    }
                }
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucrados = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarinvolucrados',
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                },
                [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'idestructura'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }, {
                    name: 'tipoinvolucrado'
                }, {
                    name: 'idtipoinvolucrado'
                }, {
                    name: 'incidencia'
                }, {
                    name: 'actualiza'
                }]
            ),
            listeners: {
                beforeload: function (atreeloader, anode) {
                    _this.arrayTempInv = [];
                    _this.modificarInv = false;
                },
                load: function (st, record) {
                    _this.arrayInicialInv = _this.stGInvolucrados.getRange();
                    var long = Object.keys(_this.arrayInicialInv).length;

                    for (var i = 0; i < long; i++) {
                        _this.arrayTempInv.push(_this.arrayInicialInv[i].data);
                    }
                }
            }
        });

        //nodos hijos por defecto
        _this.defaultRootNodes = [
            {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                text: 'Mis grupos',
                tipo: '2',
                leaf: false
            }, {
                nodeType: 'async',
                id: 'nodo3',
                idgrupo: 'nodo3',
                text: 'Usuarios subordinados',
                tipo: '2',
                leaf: false
            }, {
                nodeType: 'async',
                id: 'nodo5',
                idgrupo: 'nodo5',
                text: 'Estructuras',
                tipo: '2',
                leaf: false
            }
        ];

        //Arbol de Involucrados
        _this.tpinvolucrados = new Ext.tree.TreePanel({
            title: 'Usuarios y Estructuras',
            region: 'center',
            autoScroll: true,
            border: false,
            tbar: ['Buscar:', _this.tfbuscarInv,
                _this.btnBusqueda, _this.btnLimpiarInsiDesv, '-',
                {
                    id: 'expandirInsiDesv',
                    prevTab: 'btnLimpiarInsiDesv',
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.expand(true);
                    }
                }, {
                    iconCls: 'contraer',
                    tooltip: 'Contraer agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.collapse(true);
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.reload();
                    }
                }
            ],
            root: {
                text: 'Clasificador de involucrados',
                expanded: true,
                id: '-1',
                children: _this.defaultRootNodes

            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (!check) {
                        _this.listarInvolucradosAct(nodo, check, 1, _this.estamodificando);
                    } else {
                        _this.listarInvolucradosAct(nodo, check, 1, _this.estamodificando);
                    }
                },
                expandnode: function (nodo) {
                    _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucrados);
                },
                'contextmenu': function (node, event) {
                    if (node.id > 0) {
                        if (_this.tipoelemento != 'cargas' && _this.tipoelemento != 'calendario') {
                            if (!node.attributes.checked)
                                _this.Mostrarmenuarbol(node, event.xy);
                            event.stopEvent();
                        }
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvol',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo,
                            estamodificando: estamodificando,
                            idelemento: idelemento,
                            tipoelemento: tipoelemento,
                            idautor: idautorelemento
                        };
                    },
                    'load': function (atreeloader, anode) {
                    }
                }
            })
        });

        this.checkColumn = new Ext.grid.CheckColumn({
            header: "Actualiza",
            dataIndex: 'actualiza',
            width: 60
        });

        //grid donde muestro los involucrados
        _this.GInvolucrados = new Ext.grid.EditorGridPanel({
            title: 'Listado de grupos, usuarios y estructuras seleccionadas',
            frame: true,
            width: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? 270 : 350,
            clicksToEdit: 1,
            region: 'east',
            collapsible: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            plugins: _this.checkColumn,
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            columns: [{
                id: 'expandir',
                header: "Denominaci&oacute;n",
                sortable: true,
                dataIndex: 'denominacion',
                width: 110
            }, {
                header: "Tipo",
                sortable: true,
                dataIndex: 'nombretipo',
                width: 60
            }, {
                header: "TI",
                tooltip: "Tipo de Involucrado",
                hidden: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? true : false,
                sortable: true,
                dataIndex: 'tipoinvolucrado',
                width: 60
            }],
            store: _this.stGInvolucrados
        });

        if (estamodificando) {
            _this.stGInvolucrados.reload({
                params: {
                    idelemento: idelemento,
                    idtipoelemento: tipoelemento
                }
            });
        }

        this.menuNode = new Ext.menu.Menu({
            id: 'menuNode'
        });

        _this.tpEntidades = new Ext.tree.TreePanel({
            title: 'Estructuras',
            autoScroll: true,
            region: 'center',
            split: true,
            root: {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                text: 'Estructuras'
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (!check) {
                        _this.listarInvolucradosAct(nodo, check);
                    } else {
                        _this.listarInvolucradosAct(nodo, check);
                    }
                },
                expandnode: function (nodo) {
                    _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucrados);
                },
                'contextmenu': function (node, event) {
                    if (!node.attributes.checked)
                        _this.Mostrarmenuarbol(node, event.xy);
                    event.stopEvent();
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpasignarentidades/cargarArbolRelacionesAutor',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                    },
                    'load': function (atreeloader, anode) {
                    }
                }
            })
        });

        _this.tpInvolucrado = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            region: 'center',
            items: [_this.tpinvolucrados, _this.tpEntidades]
        });

        //panel donde cuelgo el clasificador de involucrados y el grid donde muestro a los involucrados
        _this.pPrincipal = new Ext.Panel({
            title: 'Involucrados',
            height: 270,
            layout: 'border',
            usarKeymap: true,
            frame: true,
            botonesKeymap: [_this.btnBusqueda, _this.btnLimpiarInsiDesv],
            items: [_this.tpinvolucrados, _this.GInvolucrados]
        });

        if (_this.tipoelemento == 'comportamiento' || _this.tipoelemento == 3) {
            _this.pPrincipal.disable();
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
                params: {
                    tiponomenclador: 9,
                    inicial: 1
                },
                callback: function (options, success, response) {
                    _this.pPrincipal.enable();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.data.length > 0) {
                        _this.involucradoInicial = {
                            idtipo: responseData.data[0].idtipo,
                            denominacion: responseData.data[0].denominacion
                        };
                    }
                }
            });
        }
        return _this.pPrincipal;
    };

    ///fin de la prueba

    this.CrearClasificadorInvolProyecto = function (idelemento, tipoelemento, estamodificando, idautorelemento, desdeConf) {
        _this.idelemento = idelemento;
        _this.estamodificando = estamodificando;
        _this.tipoelemento = tipoelemento;
        _this.idautor = idautorelemento;
        if (_this.pPrincipal) {
            _this.pPrincipal.destroy();
        }
        _this.btnBusqueda = new Ext.Button({
            handler: function () {
                if (_this.tfbuscarInv.isValid()) {
                    _this.BuscarInvolucrados(_this.tfbuscarInv.getValue());
                }
            },
            text: '',
            id: 'btnBusqueda',
            iconCls: 'buscar',
            tooltip: 'Buscar involucrado(s)',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.btnLimpiar = new Ext.Button({
            handler: function () {
                _this.tpinvolucrados.root.reload();
                _this.tfbuscarInv.reset();
                _this.btnBusqueda.disable();
            },
            text: '',
            id: 'btnLimpiar',
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        //Textfiel para buscar involucrado
        _this.tfbuscarInv = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 150,
                id: 'tfbuscarInv',
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (_this.tfbuscarInv.isValid()) {
                                _this.BuscarInvolucrados(e);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBusqueda.enable();
                        } else {
                            _this.btnBusqueda.disable();
                        }
                    }
                }
            });

        //store del grid donde muestro los involucrados
        _this.stGInvolucrados = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarinvolucrados',
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'idestructura'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }, {
                    name: 'tipoinvolucrado'
                }, {
                    name: 'idtipoinvolucrado'
                }, {
                    name: 'incidencia'
                }, {
                    name: 'actualiza'
                }]
            ),
            listeners: {
                beforeload: function (atreeloader, anode) {
                    _this.arrayTempInv = [];
                    _this.modificarInv = false;
                },
                load: function (st, record) {
                    _this.arrayInicialInv = _this.stGInvolucrados.getRange();
                    var long = Object.keys(_this.arrayInicialInv).length;
                    if (long > 0)
                        _this.verificarCantInv = true;
                    else
                        _this.verificarCantInv = false;
                    for (var i = 0; i < long; i++) {
                        _this.arrayTempInv.push(_this.arrayInicialInv[i].data);
                    }
                }
            }
        });

        //nodos hijos por defecto
        _this.defaultRootNodes = [{
            nodeType: 'async',
            id: 'nodo1',
            idgrupo: 'nodo1',
            text: 'Mi usuario',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo2',
            idgrupo: 'nodo2',
            text: 'Mis grupos',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo3',
            idgrupo: 'nodo3',
            text: 'Usuarios subordinados',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo4',
            idgrupo: 'nodo4',
            text: 'Permisos otorgados por el nivel superior',
            tipo: '2',
            leaf: false
        }, {
            nodeType: 'async',
            id: 'nodo5',
            idgrupo: 'nodo5',
            text: 'Estructuras',
            tipo: '2',
            leaf: false
        }
        ];

        //Arbol de Involucrados
        _this.tpinvolucrados = new Ext.tree.TreePanel({
            title: 'Usuarios y Estructuras',
            region: 'center',
            autoScroll: true,
            border: false,
            tbar: ['Buscar: ', '', _this.tfbuscarInv, _this.btnBusqueda, '-',
                {
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.expand(true);
                    }
                }, {
                    iconCls: 'contraer',
                    tooltip: 'Contraer agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.collapse(true);
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    handler: function () {
                        _this.tpinvolucrados.root.reload();
                    }
                }, '-'
            ],
            root: {
                text: 'Clasificador de Involucrados',
                expanded: true,
                id: '-1',
                children: _this.defaultRootNodes
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (!check) {
                        _this.listarInvolucradosAct(nodo, check, 1, _this.estamodificando);
                    } else {
                        _this.listarInvolucradosAct(nodo, check, 1, _this.estamodificando);
                    }
                    var arrayInv = _this.stGInvolucrados.getRange();
                    if (arrayInv.length > 0)
                        _this.verificarCantInv = true;
                    else
                        _this.verificarCantInv = false;
                },
                expandnode: function (nodo) {
                    _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucrados);
                },
                'contextmenu': function (node, event) {
                    if (_this.tipoelemento != 'cargas' && _this.tipoelemento != 'calendario') {

                        if (!node.attributes.checked)
                            _this.Mostrarmenuarbol(node, event.xy);
                        event.stopEvent();
                    }
                },
                beforeload: function () {
                    var arrayInv = _this.stGInvolucrados.getRange();
                    if (arrayInv.length > 0)
                        _this.verificarCantInv = true;
                    else
                        _this.verificarCantInv = false;
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/cargarclasificadorinvol',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo,
                            estamodificando: estamodificando,
                            idelemento: idelemento,
                            tipoelemento: tipoelemento,
                            idautor: idautorelemento
                        };
                    },
                    'load': function (atreeloader, anode) {

                    }
                }
            })
        });

        /* _this.cmGInvolucrados = new Ext.grid.ColumnModel([
         {
         id: 'expandir',
         header: "Denominaci&oacute;n",
         sortable: true,
         dataIndex: 'denominacion',
         width: 150
         }, {
         header: "Tipo",
         sortable: true,
         dataIndex: 'nombretipo',
         width: 60
         }, {
         header: "TI",
         tooltip: "Tipo de Involucrado",
         hidden: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? true : false,
         sortable: true,
         dataIndex: 'tipoinvolucrado',
         width: 60
         }, {
         header: "% de Cumplimiento",
         sortable: true,
         id:'incidencia',
         dataIndex: 'incidencia',
         hidden: (_this.tipoelemento == 3) ? false : true,
         hideable:(_this.tipoelemento == 3) ? true : false,
         width: 100,
         editor:new Ext.form.NumberField({
         allowNegative: true
         })
         }
         ]);
         */

        this.checkColumn = new Ext.grid.CheckColumn({
            header: "Actualiza",
            dataIndex: 'actualiza',
            width: 60
        });

        //grid donde muestro los involucrados
        _this.GInvolucrados = new Ext.grid.EditorGridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            width: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? 270 : 350,
            clicksToEdit: 1,
            region: 'east',
            collapsible: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            plugins: _this.checkColumn,
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            columns: [{
                id: 'expandir',
                header: "Denominaci&oacute;n",
                sortable: true,
                dataIndex: 'denominacion',
                width: 110
            }, {
                header: "Tipo",
                sortable: true,
                dataIndex: 'nombretipo',
                width: 60
            }, {
                header: "TI",
                tooltip: "Tipo de Involucrado",
                hidden: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? true : false,
                sortable: true,
                dataIndex: 'tipoinvolucrado',
                width: 60
            }//,_this.checkColumn
                /*{
                 header: "Actualiza",
                 align:'center',
                 sortable: true,
                 id: 'actualiza',
                 dataIndex: 'actualiza',
                 hidden: (_this.tipoelemento == 3) ? false : true,
                 hideable: (_this.tipoelemento == 3) ? true : false,
                 width: 100,
                 renderer:MostrarImagen,
                 editor: new Ext.form.Checkbox({
                 checked:false   
                 })
                 }*/],
            //colModel: _this.cmGInvolucrados,
            store: _this.stGInvolucrados
            //cm: _this.cmGInvolucrados
        });

        if (estamodificando) {
            _this.stGInvolucrados.reload({
                params: {
                    idelemento: idelemento,
                    idtipoelemento: tipoelemento
                }
            });
        }

        this.menuNode = new Ext.menu.Menu({
            id: 'menuNode'
        });

        _this.tpEntidades = new Ext.tree.TreePanel({
            title: 'Estructuras',
            autoScroll: true,
            region: 'center',
            split: true,
            root: {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                text: 'Estructuras'
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (!check) {
                        _this.listarInvolucradosAct(nodo, check);
                    } else {
                        _this.listarInvolucradosAct(nodo, check);
                    }
                },
                expandnode: function (nodo) {
                    _this.ChequearInvolucradosDesdeCliente(nodo, 'expand', _this.stGInvolucrados);
                },
                'contextmenu': function (node, event) {
                    if (!node.attributes.checked)
                        _this.Mostrarmenuarbol(node, event.xy);
                    event.stopEvent();
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpasignarentidades/cargarArbolRelacionesAutor',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                    },
                    'load': function (atreeloader, anode) {
                    }
                }
            })
        });

        _this.tpInvolucrado = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            region: 'center',
            items: [_this.tpinvolucrados, _this.tpEntidades]
        });

        //panel donde cuelgo el clasificador de involucrados y el grid donde muestro a los nvolucrados
        _this.pPrincipal = new Ext.Panel({
            title: 'Involucrados',
            height: 270,
            layout: 'border',
            items: [_this.tpinvolucrados, _this.GInvolucrados],
            usarKeymap: true,
            botonesKeymap: [_this.btnBusqueda]
        });

        if (_this.tipoelemento == 'comportamiento' || _this.tipoelemento == 3) {
            _this.pPrincipal.disable();
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargartiposactividad',
                params: {
                    tiponomenclador: 9,
                    inicial: 1
                },
                callback: function (options, success, response) {
                    _this.pPrincipal.enable();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.data.length > 0) {
                        _this.involucradoInicial = {
                            idtipo: responseData.data[0].idtipo,
                            denominacion: responseData.data[0].denominacion
                        };
                    }

                }
            });
        }
        return _this.pPrincipal;
    }

    this.crearPanelUsuariosRecurso = function () {
        if (_this.pPrincipalUsuarios) _this.pPrincipalUsuarios.destroy();
        //Textfiel para buscar los usuarios del dominio
        this.tfbuscarUsuarios = new Ext.form.TextField(
            {
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 150,
                emptyText: 'Buscar usuarios del dominio',
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (tf.isValid()) {
                                //_this.BuscarInvolucradosGrupoNom(e);
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.isValid() && tf.getValue() != '') {
                            _this.btnBuscarUsuarios.enable();
                            _this.btnLimpiarUsuarios.enable();
                        } else {
                            _this.btnBuscarUsuarios.disable();
                            _this.btnLimpiarUsuarios.disable();
                        }
                    }
                }
            });

        this.btnBuscarUsuarios = new Ext.Button({
            disabled: true,
            handler: function () {
                if (_this.tfbuscarUsuarios.isValid()) {
                    //_this.BuscarInvolucradosGrupoNom(_this.tfbuscarInvGrupoNom.getValue());
                }
            },
            iconCls: 'Buscar',
            tooltip: 'Buscar usuarios',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.btnLimpiarUsuarios = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.tfbuscarUsuarios.reset();
                _this.btnBuscarUsuarios.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        //store del grid donde muestro los usuarios seleccionados
        _this.stUsuariosDominioSeleccionados = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarUsuariosDominioSeleccionados',
            reader: new Ext.data.JsonReader(
                {
                    id: 'idusuario',
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idusuario'
                }, {
                    name: 'idpersona'
                }, {
                    name: 'nombreapellidos'
                }, {
                    name: 'nombreusuario'
                }, {
                    name: 'iddominio'
                }, {
                    name: 'nombreapellidosusuario'
                }, {
                    name: 'bntEliminar'
                }]
            ),
            listeners: {
                beforeload: function (st, rc) {
                },
                load: function (st, record) {
                },
                add: function (st, record) {
                },
            }
        });


        this.smUsuariosDominioSeleccionado = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, ri, record) {
                    _this.smUsuariosDominio.clearSelections();
                    (sm.getSelections().length > 0) ? _this.btnDesAsociarUser.enable() : _this.btnDesAsociarUser.disable();
                },
                rowdeselect: function (sm, ri, record) {
                    (sm.getSelections().length > 0) ? _this.btnDesAsociarUser.enable() : _this.btnDesAsociarUser.disable();
                }
            }
        });
        this.cmUsuariosDominioSeleccionado = [
            _this.smUsuariosDominioSeleccionado,
            {
                id: 'expandir',
                header: 'Nombre',
                sortable: true,
                dataIndex: 'nombreapellidosusuario',
                width: 250
            },
        ];

        //grid donde muestro los usuarios seleccionados
        _this.gUsuariosDominioSeleccionados = new Ext.grid.GridPanel({
            title: 'Usuarios seleccionados',
            frame: true,
            width: 243,
            region: 'east',
            collapsible: false,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando usuarios seleccionados'
            },
            stripeRows: true,
            store: _this.stUsuariosDominioSeleccionados,
            columns: _this.cmUsuariosDominioSeleccionado,
            sm: _this.smUsuariosDominioSeleccionado,
        });
        //store del grid donde muestro los usuarios del dominio
        _this.stUsuariosDominio = new Ext.data.Store({
            url: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargarUsuariosDominio',
            autoLoad: false,
            reader: new Ext.data.JsonReader(
                {
                    id: 'idusuario',
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idusuario'
                }, {
                    name: 'idpersona'
                }, {
                    name: 'nombreapellidos'
                }, {
                    name: 'nombreusuario'
                }, {
                    name: 'iddominio'
                }, {
                    name: 'nombreapellidosusuario'
                }, {
                    name: 'bntEliminar'
                }]
            ),
            listeners: {
                beforeload: function (st, record) {
                },
                load: function (st, record) {
                },
            }
        });
        this.smUsuariosDominio = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, ri, record) {
                    _this.smUsuariosDominioSeleccionado.clearSelections();
                    (sm.getSelections().length > 0) ? _this.btnAsociarUser.enable() : _this.btnAsociarUser.disable();
                },
                rowdeselect: function (sm, ri, record) {
                    (sm.getSelections().length > 0) ? _this.btnAsociarUser.enable() : _this.btnAsociarUser.disable();
                }
            }
        });
        this.cmUsuariosDominio = [
            _this.smUsuariosDominio,
            {
                id: 'expandir',
                header: "Nombre",
                sortable: true,
                dataIndex: 'nombreapellidosusuario',
                width: 250
            },
        ];

        //grid donde muestro los usuarios del dominio
        _this.gUsuariosDominio = new Ext.grid.GridPanel({
            title: 'Usuarios del dominio',
            frame: true,
            width: 243,
            region: 'west',
            collapsible: false,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando usuarios del dominio'
            },
            stripeRows: true,
            store: _this.stUsuariosDominio,
            columns: _this.cmUsuariosDominio,
            sm: _this.smUsuariosDominio
        });

        _this.btnAsociarUser = new Ext.Button({
            tooltip: 'Asociar usuario(es)',
            disabled: true,
            iconCls: 'siguiente',
            id: 'btnAsociarUserDominio',
            listeners: {},
            handler: function () {
                var smNoAsociados = _this.smUsuariosDominio;
                var storeNoAsociados = _this.stUsuariosDominio;
                var storeAsociados = _this.stUsuariosDominioSeleccionados;
                _this.asociarUsuarios(smNoAsociados, storeNoAsociados, storeAsociados);
            }
        });
        _this.btnDesAsociarUser = new Ext.Button({
            tooltip: 'Desasociar usuario(es)',
            disabled: true,
            iconCls: 'anterior',
            id: 'btnDesAsociarUserDominio',
            handler: function () {
                var smAsociados = _this.smUsuariosDominioSeleccionado;
                var storeNoAsociados = _this.stUsuariosDominio;
                var storeAsociados = _this.stUsuariosDominioSeleccionados;
                _this.desasociarUsuario(smAsociados, storeNoAsociados, storeAsociados, this);
            }
        });

        _this.PanelAsociarUser = new Ext.Panel({
            region: 'center',
            bodyStyle: 'padding:70px 15px 40px 0px',
            width: 20,
            height: 20,
            frame: true,
            items: [_this.btnAsociarUser, _this.btnDesAsociarUser]
        });

        _this.pPrincipalUsuarios = new Ext.Panel({
            title: 'Usuarios',
            height: 270,
            layout: 'border',
            tbar: ['Buscar: ', _this.tfbuscarUsuarios, _this.btnBuscarUsuarios, _this.btnLimpiarUsuarios],
            usarKeymap: true,
            botonesKeymap: [_this.btnBuscarUsuarios, _this.btnLimpiarUsuarios],
            items: [_this.gUsuariosDominio, _this.PanelAsociarUser, _this.gUsuariosDominioSeleccionados],
            listeners: {
                activate: function(panel){
                    _this.stUsuariosDominio.reload();
                    panel.doLayout();
                }
            }
        });

        this.asociarUsuarios = function (smNoAsociados, storeNoAsociados, storeAsociados) {
            var stAsociados = storeAsociados.data.items;
            if (smNoAsociados.hasSelection()) {
                var arrayUsuarioAAsociar = smNoAsociados.getSelections();
                var arrayUsuarioAsociados = storeAsociados.data.items;
                if (arrayUsuarioAAsociar.length > 0) {
                    storeAsociados.add(arrayUsuarioAAsociar);
                    /*if (arrayUsuarioAAsociar.length == 1) {
                     var mensaje = 'El usuario ha sido asociado satisfactoriamente.';
                     } else {
                     mensaje = 'Los usuarios han sido asociados satisfactoriamente.';
                     }
                     mostrarMensaje(2, mensaje);*/
                }
            }
            smNoAsociados.clearSelections();
        }
        this.desasociarUsuario = function (smAsociados, storeNoAsociados, storeAsociados, btnDesasociar) {
            var stNoAsociados = storeNoAsociados.data.items;
            if (smAsociados.hasSelection()) {
                btnDesasociar.disable();
                var arrayUsuarioDesasociar = smAsociados.getSelections();
                if (arrayUsuarioDesasociar.length > 0) {
                    for (var i = 0; i < arrayUsuarioDesasociar.length; i++) {
                        storeAsociados.remove(arrayUsuarioDesasociar[i]);
                    }
                    storeNoAsociados.add(arrayUsuarioDesasociar);
                    /*if (arrayUsuarioDesasociar.length == 1) {
                     var mensaje = 'El usuario ha sido desasociado satisfactoriamente.';
                     } else mensaje = 'Los usuarios han sido desasociados satisfactoriamente.';
                     mostrarMensaje(2, mensaje);*/
                }
            }
            smAsociados.clearSelections();

        }

        function mostrarImagenEliminar(valor, o, record) {
            var retorno = '<center><a href="#" id = "' + record.data.idusuario + '-del' + '" style="text-decoration:none" ><span class="icondistra-eliminar sipac-roja"></span></a></center>';
            return retorno;
        }

        function array_diff_assoc(arr1) {
            var retArr = {}
            var argl = arguments.length
            var k1 = ''
            var i = 1
            var k = ''
            var arr = {}
            arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
                for (i = 1; i < argl; i++) {
                    arr = arguments[i]
                    for (k in arr) {
                        if (arr[k] === arr1[k1] && k === k1) {
                            // If it reaches here, it was found in at least one array, so try next value
                            continue arr1keys // eslint-disable-line no-labels
                        }
                    }
                    retArr[k1] = arr1[k1]
                }
            }
            return retArr
        }
        return _this.pPrincipalUsuarios;
    }


};
