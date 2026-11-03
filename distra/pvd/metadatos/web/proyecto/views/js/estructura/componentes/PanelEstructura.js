Ext.MessageBox.buttonText.yes = "Si";
Ext.MessageBox.buttonText.ok = "Aceptar";
Ext.QuickTips.init();
Ext.ns('Gestion.Panel');
Gestion.Panel.Estructura = Ext.extend(Ext.Panel, {
    proyecto     : 0,
    parent       : false,//GRID PANEL DE PROYECTO
    ver          : false,
    checker      : false,
    fusion       : false,
    reportes     : false,
    subordinacion: false,
    isestructura : false,
    editNode     : false,
    estructuras  : new Array(),
    actionEditNode               : '',
    limitDeep                    : 3,
    initComponent                : function () {
        var _this = this;
        _this.nodoAInsertar = null;
        _this.esBuscar = false;
        _this.typo, _this.selccUltimo, _this.panel, _this.grid;
        _this.newNode = [];
        _this.hiddenPkgs = [];
        /*Componentes de busqueda*/
        _this.tfBuscar = new Ext.form.TextField({
            id             : 'tfBuscar' + _this.id,
            vtype          : 'vtdenominaciones',
            enableKeyEvents: true,
            listeners      : {
                keyup: function () {
                    if (_this.tfBuscar.getValue() != '') {
                        Ext.getCmp('btnLimpiar' + _this.proyecto).enable();
                        Ext.getCmp('btnBuscar' + _this.proyecto).enable();
                    } else {
                        Ext.getCmp('btnLimpiar' + _this.proyecto).disable();
                        Ext.getCmp('btnBuscar' + _this.proyecto).disable();
                    }
                }
            },
            emptyText      : 'Criterio a buscar...'
        })
        _this.btnBuscar = new Ext.Button({
            //						icon   : _this.perfil.dirImg + 'buscar.png',
            iconCls : 'buscar',
            text    : etiquetas.estructura.lbBuscar,
            id      : 'btnBuscar' + _this.proyecto,
            tooltip : etiquetas.estructura.lbBuscarEstructura,
            disabled: true,
            handler : function () {
                _this.buscarEstructura();
            }
        })
        _this.btnExpandir = new Ext.Button({
            //						icon   : '/metadatos/comun/recursos/iconos/expand_all.gif',
            iconCls: 'expandir',
            id     : 'btnExpandir' + _this.proyecto,
            tooltip: etiquetas.estructura.lbTooltipExpandir,
            handler: function () {
                if (_this.nodo && _this.nodo.id != _this.root.id) {
                    _this.nodoExpand = _this.nodo;
                } else {
                    _this.nodoExpand = _this.root;
                }
                _this.nodoExpand.expand(true);
            }
        })
        _this.btnActualizarTree = new Ext.Button({
            iconCls: 'actualizar',
            id     : 'btnActualizarTree',
            hidden : true,
            tooltip: etiquetas.estructura.lbActualizarTree,
            handler: function () {
                _this.actualizarTree();
            }
        })
        _this.busquedaDisponibilidad = new Ext.form.Checkbox({
            hideLabel: false,
            id       : 'chxDisponibilidad',
            boxLabel : 'Vacante de cargos',
            disabled : false,
            name     : 'disponibilidadcargo',
            //prevTab  : "chxOrganigrama",
            //nextTab  : "chxAResumen",
        })
        _this.btnColapsar = new Ext.Button({
            //						icon   : '/metadatos/comun/recursos/iconos/collapse_all.gif',
            iconCls: 'contraer',
            id     : 'btnColapsar' + _this.proyecto,
            tooltip: etiquetas.estructura.lbTooltipColapsar,
            handler: function () {
                if (_this.nodo && _this.nodo.id != _this.root.id) {
                    _this.nodoCollapse = _this.nodo;
                } else {
                    _this.nodoCollapse = _this.root;
                }
                _this.nodoCollapse.collapse(true);
            }
        })
        _this.btnLimpiar = new Ext.Button({
            //						icon   : perfil.dirImg + 'limpiar.png',
            iconCls : 'limpiar',
            text    : etiquetas.estructura.lbLimpiar,
            id      : 'btnLimpiar' + _this.proyecto,
            disabled: true,
            tooltip : etiquetas.estructura.lbLimpiarToolTips,
            handler : function () {
                _this.limpiar();
            }
        })
        UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
        /* TREE LOADER DEL ARBOL DE ESTRUCTURAS */
        _this.loaderEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'buscarHijos', listeners: {
                beforeload: function (_tload, node) {
                    this.baseParams.proyecto = _this.proyecto;
                    this.baseParams.disponibilidad = Ext.getCmp('chxDisponibilidad').getValue();
                    this.baseParams.ajuste = _this.checher;

                    if (node.id == 'Estructuras') {
                        Secodena.mostrarMascara('tree', '', "Cargando árbol de estructuras.");
                    }
                }, load   : function (treeLoader, node) {
                    Secodena.ocultarMascara('tree');
                    var hijos = node.childNodes;
                    for (var i = 0; i < hijos.length; i++) {
                        if (hijos[i].attributes.idconcepto == '7' || hijos[i].attributes.idconcepto == '9') {
                            var principal = (hijos[i].attributes.principal == '1') ? ' ( EP ) ' : '';
                            var jefebrigada = (hijos[i].attributes.jefebrigada == '1') ? ' ( JB ) ' : '';
                            hijos[i].setText(hijos[i].attributes.text + principal + jefebrigada + ' <b>[' + hijos[i].attributes.cantidad + ' | ' + hijos[i].attributes.cantidad_real + ']')
                        }
                        var currentClass = hijos[i].attributes.cls;
                        hijos[i].ui.removeClass(currentClass);
                        if (hijos[i].attributes.es == true) {
                            hijos[i].ui.addClass('search');
                        }
                        if (hijos[i].attributes.estado != 0) {
                            if (hijos[i].attributes.estado == 1) {
                                hijos[i].ui.addClass('add');
                            } else {
                                if (hijos[i].attributes.estado == 2) {
                                    hijos[i].ui.addClass('mod');
                                } else {
                                    hijos[i].ui.addClass('del');
                                }
                            }
                        }
                    }
                    _this.nodo = false;
                }
            }
        })
        /* TREE PANEL DEL ARBOL DE ESTRUCTURAS */
        _this.tree = new Ext.tree.TreePanel({
            id             : Ext.id,
            region         : 'center',
            autoScroll     : true,
            split          : true,
            useArrows      : true,
            animate        : true,
            //enableDD       : (_this.proyecto == 0), // Solo habilitar DD en estructura real (proyecto 0)
            enableDD       : true,
            width          : _this.subordinacion ? '50%' : 400,
            height         : 600,
            minSize        : 175,
            maxSize        : 400,
            margins        : '0 0 0 2',
            layoutConfig   : {
                animate: true
            },
            tbar           : (!_this.disponibilidadCargo) ? [_this.tfBuscar, ' ', _this.btnBuscar, _this.btnLimpiar, '-', _this.btnExpandir, _this.btnColapsar, _this.btnActualizarTree] : [_this.tfBuscar, ' ', _this.btnBuscar, _this.btnLimpiar, '-', _this.btnExpandir, _this.btnColapsar, _this.btnActualizarTree, '  ', _this.busquedaDisponibilidad],
            collapseMode   : 'mini',
            containerScroll: true,
            loader         : _this.loaderEstructura,
            keys           : [{
                key: Ext.EventObject.DELETE, fn: function (n) {
                    if (_this.nodo != 'Estructuras' && _this.isestructura && !_this.ver) {
                        _this.accion = 'Eliminar';
                        _this.eliminarNodo(_this.nodo);
                    }
                }
            }, {
                key: "c", ctrl: true, fn: function () {
                    if (_this.isestructura) {
                        var n = _this.nodo;
                        if (n.attributes.id != 'Estructuras' && !_this.ver && n.attributes.idconcepto != 3 && n.id != _this.editNode.id) {
                            _this.editNode = n;
                            _this.actionEditNode = 'copiar';
                        }
                    }
                }
            }, {
                key: "x", ctrl: true, fn: function () {
                    if (_this.isestructura) {
                        var n = _this.nodo;
                        if (n.attributes.id != 'Estructuras' && !_this.ver && n.attributes.idconcepto != 3 && n.id != _this.editNode.id) {
                            _this.editNode = n;
                            _this.actionEditNode = 'cortar';
                        }
                    }
                }
            }, {
                key: "v", ctrl: true, fn: function () {
                    if (_this.isestructura) {
                        var n = _this.nodo;
                        Ext.Ajax.request({
                            url       : 'construirCamposGrid', params: {
                                tipo         : (n.id == 'Estructuras') ? 0 : n.attributes.idconcepto,
                                identificador: n.id,
                                proyecto     : _this.proyecto
                            }, success: function (resp) {
                                var datos = Ext.decode(resp.responseText);
                                var permisos = datos[2];
                                _this.noAdd = false;
                                var ocultarPegar = (_this.noAdd || !_this.editNode || n.id == _this.editNode.id || n.id == 'Estructuras');
                                var havePermiso = (_this.editNode) ? false : true;
                                var conceptosAdicionar = permisos.menu;
                                if (!_this.noAdd && _this.editNode) {
                                    for (var i = 0; i < conceptosAdicionar.length; i++) {
                                        if (_this.editNode.attributes.idconcepto == conceptosAdicionar[i].id) {
                                            havePermiso = true;
                                            break;
                                        }
                                    }
                                }
                                ocultarPegar = (ocultarPegar || !havePermiso);
                                if (!ocultarPegar) {
                                    _this.editarEstructura(n);
                                } else {
                                    mostrarMensaje(1, 'El elemento no puede ser insertado en el nodo especificado.')
                                }
                            }
                        })
                    }
                }
            }]
        });
        _this.root = new Ext.tree.AsyncTreeNode({
            text     : etiquetas.estructura.lbgestructuras,
            draggable: false,
            icon     : '../../../comun/recursos/iconos/folder-open.gif',
            id       : 'Estructuras',
            idtipo   : 'Estructuras',
            listeners: {
                expand     : function (node) {
                    node.icon = '../../../comun/recursos/iconos/folder-open.gif';
                }, collapse: function (node) {
                    node.icon = '../../../comun/recursos/iconos/folder.gif';
                }
            }
        });
        _this.tree.on('beforemovenode', function (arbol, nodo, padre, padreNuevo) {
            _this.nodoAInsertar = nodo;
            var sameTree = padreNuevo.attributes.idsub == null;
            if ((_this.subordinacion || _this.isestructura) && (!sameTree)) {
                return false;
            }

           // if (_this.proyecto == 0) {
           // var valida = _this.validarMover(nodo, arbol, padre, padreNuevo);
  
            return true;
            //return valida;
           // }
            /*else {
                if (padre == padreNuevo) {
                    return true;
                } else {
                    mostrarMensaje(1, 'Esta opción está solo habilitada para el proyecto real.');
                    return false;
                }

            }*/



        });
        _this.tree.on('movenode', function (arbol, nodo, oldParent, newParent, index) {
            if (oldParent == newParent) {
                _this.cambiarOrden(nodo, arbol.loader);
            } else {
              //if (_this.validarMover(nodo, arbol, oldParent, newParent, index)) {
                    _this.moverArbol(nodo, arbol.loader, oldParent, newParent, index);
                //}

            }

        })
        _this.tree.on('click', function (node) {
            _this.nodo = node;

        })
        /* ASIGNANDOLE LA RAIZ AL ARBOL */
        _this.tree.setRootNode(_this.root);
        /* MANDANDO AL ARBOL QUE SE MUESTRE */
        _this.tree.show();
        /* Expandir el nodo inicial */
        _this.root.expand();
        _this.btnAyuda = new Ext.Button({
            //						icon   : perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda', id: 'btnAyudaEstructura', text: etiquetas.estructura.lbAyuda, hidden: false
        })
        _this.tree.on("click", function (n) {
            _this.nodo = n;
            _this.nodoSel = n;
            if (n.attributes.idconcepto == 3 || n.attributes.idconcepto == 4) {
                _this.textomenu = n.text;
                _this.idOp = "";
            }
        });
        _this.tree.on("expandnode", function (n) {
            _this.typo = n.attributes.tipo;
        });
        _this.tree.on("beforeexpandnode", function (nodo, deep) {
            if (deep && _this.limitDeep != -1 && !_this.esBuscar) {
                if (nodo.attributes.idtipo != 'Estructura') {
                    if (nodo.attributes.idconcepto == _this.limitDeep && nodo.id != _this.nodoExpand.id) {
                        return false;
                    }
                }
            }
        })
        _this.tree.on('contextmenu', function (n, e) {
            var idVentana = Ext.getCmp('resumen' + n.id + this.proyecto);
            var idDetalle = Ext.getCmp('detalle' + n.id + this.proyecto);
            var estado = n.attributes.estado;
            //						if (n.id != 'Estructuras') {
            _this.noAdd = false;
            _this.nodo = n;
            _this.accion = "Adicionar";
            _this.idOp = "";
            _this.nodoSel = n;
            _this.selccUltimo = "estructura";
            _this.textomenu = n.text;
            var contextMenu;
            Ext.Ajax.request({
                url       : 'construirCamposGrid', params: {
                    tipo         : (n.id == 'Estructuras') ? 0 : n.attributes.idconcepto,
                    identificador: n.id,
                    proyecto     : _this.proyecto
                }, success: function (resp, obj) {
                    var isRoot = (n.id == 'Estructuras');
                    var datos = Ext.decode(resp.responseText);
                    var insertado = false;
                    var modificado = datos.modificado;
                    var permisos = datos[2];
                    var userPermisos = datos[3];
                    var restringe = userPermisos.restringe;
                    _this.noAdd = false;
                    if (permisos.menu.length == 0) {
                        _this.noAdd = true;
                    }
                    var idescala = permisos.escala;
                    var tipoescala = permisos.tipoescala;
                    var idsector = permisos.idsector;
                    var sector = permisos.sector;
                    var ocultarCopiar = ((n.attributes.idconcepto == 3 || n.attributes.idconcepto == 4) || (n.id == _this.editNode.id && _this.actionEditNode == 'copiar'));
                    /*COPIAR OCULTO*/
                    var ocultarCortar = ((n.attributes.idconcepto == 3 || n.attributes.idconcepto == 4) || (n.id == _this.editNode.id && _this.actionEditNode == 'cortar'));
                    //(modificado || (n.id == _this.editNode.id && _this.actionEditNode == 'cortar')); --iba arriba en var ocultarCortar
                    /*CORTAR OCULTO*/
                    var ocultarPegar = (_this.noAdd || !_this.editNode || n.id == _this.editNode.id);
                    var havePermiso = (!_this.editNode) ? false : true;
                    var conceptosAdicionar = permisos.menu;
                    if (!_this.noAdd && _this.editNode) {
                        for (var i = 0; i < conceptosAdicionar.length; i++) {
                            if (_this.editNode.attributes.idconcepto == conceptosAdicionar[i].id) {
                                havePermiso = true;
                                break;
                            }
                        }
                    }
                    ocultarPegar = (ocultarPegar || !havePermiso);
                    /*PEGAR OCULTO*/
                    var ocultarEditar = (isRoot || _this.fusion || (_this.proyecto == 0 && !_this.isestructura) || (estado == 3)) || (ocultarCopiar && ocultarCortar && ocultarPegar);
                    var ocultarEliminar = _this.ver || isRoot || (((n.attributes.id == n.attributes._parent) ? true : false) && _this.root.childNodes.length == 1) || (_this.proyecto == 0 && !_this.isestructura) || _this.fusion || estado != 0 || n.parentNode.attributes.estado == 3 || modificado;
                    var ocultarAdicionar = _this.ver || _this.fusion || _this.noAdd || (_this.proyecto == 0 && !_this.isestructura) || (estado == 3);
                    var ocultarModificar = _this.ver || isRoot || (_this.proyecto == 0 && !_this.isestructura) || estado == 3 || _this.fusion;
                    var ocultarDeshacer = _this.ver || isRoot || estado == 0 || n.parentNode.attributes.estado == 3 || insertado || _this.fusion;
                    ocultarDeshacer = (restringe) ? !parseInt(userPermisos.deshacer) || ocultarDeshacer : ocultarDeshacer;
                    ocultarModificar = (restringe) ? !parseInt(userPermisos.modificar) || ocultarModificar : ocultarModificar;
                    ocultarEliminar = (restringe) ? !parseInt(userPermisos.eliminar) || ocultarEliminar : ocultarEliminar;
                    ocultarEditar = (restringe) ? !parseInt(userPermisos.editar) || ocultarEditar : ocultarEditar;
                    contextMenu = new Ext.menu.Menu({
                        items: [{
                            text   : etiquetas.estructura.lbBtnAdicionar,
                            hidden : ocultarAdicionar, //																icon   : _this.perfil.dirImg + 'adicionar.png',
                            iconCls: 'adicionar',
                            menu   : _this.dameGridMenu(conceptosAdicionar, n, _this.loaderEstructura, idescala, tipoescala, idsector, sector),
                            scope  : this
                        }, {
                            text   : etiquetas.estructura.lbBtnModificar, hidden: ocultarModificar, //																icon   : _this.perfil.dirImg + 'modificar.png',
                            iconCls: 'modificar', handler: function () {
                                if (n.attributes.esmilitar) {
                                    _this.construirVentanaGestion('Modificar ', true, '10', n, idescala, idsector, sector);
                                } else {
                                    _this.construirVentanaGestion('Modificar ', true, n.attributes.idconcepto, n, idescala, idsector, sector);
                                }
                            }
                        }, {
                            text   : etiquetas.estructura.lbBtnEliminar, hidden: ocultarEliminar, //																icon   : _this.perfil.dirImg + 'eliminar.png',
                            iconCls: 'eliminar', handler: function () {
                                _this.accion = 'Eliminar';
                                _this.eliminarNodo(n);
                            }
                        }, {
                            text   : etiquetas.estructura.lbBtnDeshacer, hidden: ocultarDeshacer, id: 'deshacer', //																icon   : _this.perfil.dirImg + 'deshacer.png',
                            iconCls: 'deshacer', handler: function () {
                                _this.deshacerCambios(n);
                            }
                        }, {
                            text   : etiquetas.estructura.lbBtnEditar,
                            hidden : _this.ver || ocultarEditar,
                            id     : 'editar', //																icon    : perfil.dirImg + 'editar.png',
                            iconCls: 'editar',
                            menu   : [{
                                text   : etiquetas.estructura.lbBtnCopiar + (_this.isestructura ? etiquetas.estructura.lbKeyCopiar : ''),
                                hidden : ocultarCopiar,
                                id     : 'copiar', //																				icon   : _this.perfil.dirImg + 'copiar.png',
                                iconCls: 'copiar',
                                handler: function () {
                                    _this.editNode = n;
                                    _this.actionEditNode = 'copiar';
                                }
                            }, {
                                text   : etiquetas.estructura.lbBtnCortar + (_this.isestructura ? etiquetas.estructura.lbKeyCortar : ''),
                                hidden : ocultarCortar,
                                id     : 'cortar', //																				icon   : _this.perfil.dirImg + 'cortar.png',
                                iconCls: 'cortar',
                                handler: function () {
                                    _this.editNode = n;
                                    _this.actionEditNode = 'cortar';
                                }
                            }, {
                                text   : etiquetas.estructura.lbBtnPegar, hidden: ocultarPegar, id: 'pegar', //																				icon   : _this.perfil.dirImg + 'pegar.png',
                                iconCls: 'pegar', handler: function () {
                                    _this.editarEstructura(n);
                                }
                            }]
                        }, {
                            text   : etiquetas.estructura.lbResumen,
                            hidden : (n.attributes.idconcepto < 7 && !idVentana && !n.attributes.leaf) ? false : true, //																icon   : _this.perfil.dirImg + 'informe.png',
                            iconCls: 'informe',
                            id     : 'idmenuResumen',
                            handler: function () {
                                _this.mostrarResumen(n);
                            }
                        }, {
                            text   : etiquetas.estructura.lbVerDetalles,
                            hidden : isRoot || (((n.attributes.idconcepto == 3 || n.attributes.idconcepto == 4) && !idDetalle && !n.attributes.leaf) ? false : true), //																icon   : _this.perfil.dirImg + 'detalles.png',
                            iconCls: 'detalles',
                            id     : 'idmenuDetalle',
                            handler: function () {
                                _this.mostrarDetalles(n);
                            }
                        }]
                    })
                    var elementos = contextMenu.items.items;
                    var show = false;
                    for (var i = 0; i < elementos.length; i++) {
                        if (!elementos[i].hidden) {
                            show = true;
                            break;
                        }
                    }
                    if (e.xy[0] != 0 && show) {
                        contextMenu.showAt(e.getXY());
                    } else {
                        contextMenu.show(n.ui.getAnchor());
                    }
                }
            })
        });
        _this.eliminarNodo = function (nodo) {
            var _this = this;
            var type = nodo.attributes.idconcepto;
            var eliminar = nodo.attributes.nombretipo;
            var art = 'el ';
            var sel = ' seleccionado?';
            if (type == 2 || type == 3 || type == 4 || type == 6 || type == 8) {
                art = 'la ';
                sel = ' seleccionada?';
            }
            var msg = etiquetas.estructura.lbMsgseguroquedeseaeliminar + art + eliminar.toLowerCase() + ' ' + sel
            mostrarMensaje(2, msg, function (btn) {
                if (btn == 'ok') {
                    Secodena.mostrarMascara("Elimi", '', 'Eliminando ' + eliminar + " ...");
                    Ext.Ajax.request({
                        url        : 'eliminarValores', params: {
                            idfila: nodo.id, idconcepto: nodo.attributes.idconcepto, proyecto: _this.proyecto    // SE CAMBIA this por _this solapamiento
                        }, callback: function (option, succes, response) {
                            Secodena.ocultarMascara("Elimi")
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg != 6) {
                                mostrarMensaje(responseData.codMsg, responseData.mensaje)
                                _this.onActionResponse();
                                _this.nopadre = nodo.parentNode;
                                _this.loaderEstructura.load(_this.nopadre);
                                _this.nopadre.expand();
                            }
                        }
                    })
                } else {
                    nodo.unselect();
                }
            })
        }
        _this.btnSubordinacion = new Ext.Button({
            xtype  : 'button',
            text   : etiquetas.estructura.lbBtnSubordinacion,
            id     : 'btnSubordinacion' + _this.proyecto,
            iconCls: 'subordinaciones',
            tooltip: "Subordinar estructura",
            hidden : !_this.isestructura,
            handler: function () {
                if (this.text == etiquetas.estructura.lbBtnSubordinacion) {
                    this.setText(etiquetas.estructura.lbBtnCerrarSubordinacion);
                    //										this.setIconClass('icon-checked');
                    _this.subordinacion = true;
                    _this.treeSubordinacion.show();
                } else {
                    this.setText(etiquetas.estructura.lbBtnSubordinacion);
                    //										this.setIconClass('icon-unchecked');
                    _this.subordinacion = false;
                    _this.treeSubordinacion.hide();
                }
                _this.doLayout();
            }
        })
        /*CONSTRUCCION DEL TBAR DE REPORTES EN CASO DE NECESITARLO*/
        if (_this.reportes) {
            _this.createNodoLeyenda = function (accion, text) {
                var div = "<div class='animacionContenedor" + accion + " contenedorLeyenda'><div class='iconLeyenda " + accion + "Leyend rotateLeyend'></div><div class='textLeyenda " + accion + "LeyendColor'>" + text + "</div>";
                return div;
            }
            _this.tbar = [{
                xtype  : 'button',
                text   : etiquetas.estructura.lbOrganigrama,
                id     : 'btnOrganigrama' + _this.proyecto,
                iconCls: 'estructura',
                tooltip: "Realizar organigrama", //										icon   : perfil.dirImg + 'estructura.png',
                menu   : {
                    items: [{
                        text   : etiquetas.estructura.lbNuevoOrganigrama, //																icon   : perfil.dirImg + 'estructura.png',
                        iconCls: 'estructura', handler: function () {
                            _this.dibujarOrganigrama(false);
                        }, menu: {
                            items: [{
                                text   : etiquetas.estructura.lbVOrganigrama, //																						icon   : perfil.dirImg + 'nuevo.png',
                                iconCls: 'nuevo', handler: function () {
                                    _this.dibujarOrganigrama(false);
                                }
                            }, {
                                text   : etiquetas.estructura.lbHOrganigrama, //																						icon   : perfil.dirImg + 'nuevo.png',
                                iconCls: 'nuevo', handler: function () {
                                    _this.dibujarOrganigrama(true);
                                }
                            }]
                        }
                    }, {
                        text   : etiquetas.estructura.lbCargarOrganigrama, hidden: _this.proyecto != 0, //																icon   : perfil.dirImg + 'recuperaciones.png',
                        iconCls: 'recuperaciones', handler: function () {
                            var winOrganigrama = new Gestion.Organigrama({
                                perfil: perfil
                            });
                            winOrganigrama.show();
                        }
                    }]
                }
            }, {
                xtype  : 'button',
                text   : etiquetas.reporte.lbDocumentos,
                id     : 'btnDoc' + _this.proyecto,
                iconCls: 'documentos', //										icon   : perfil.dirImg + 'historial.png',
                tooltip: "Ver documentos de la estructura",
                menu   : {
                    items: [{
                        xtype  : 'button', text: 'Tabla de organización', iconCls: 'informe', //																icon   : perfil.dirImg + 'informe.png',
                        handler: function () {
                            var selections = _this.getSelections(true);
                            var win = new Win.Reporte.TablaOrganizacion({
                                estructuras: selections, proyecto: _this.proyecto
                            });
                            win.show();
                        }
                    }, {
                        xtype  : 'button', text: 'Reporte plantilla', iconCls: 'informe', //																icon   : perfil.dirImg + 'informe.png',
                        handler: function () {
                            var selections = _this.getSelections(true);
                            _this.ventanaReportePlantillaCargos(selections);
                        }
                    }, {
                        xtype  : 'button', text: 'Reporte escalas salariales', iconCls: 'informe', //																icon   : perfil.dirImg + 'informe.png',
                        handler: function () {
                            _this.generateReporteEscala();
                        }
                    }, {
                        xtype  : 'button', text: 'Reporte de Cantidad de Plazas Aprobadas y Cubiertas', iconCls: 'informe', //																icon   : perfil.dirImg + 'informe.png',
                        handler: function () {
                            var selections = _this.getSelections(true);
                            _this.generateReportePlazasAprobadasYCubiertas(selections[0]);
                        }
                    }]
                }
            }, _this.btnSubordinacion, '->', {
                xtype : 'label',
                hidden: _this.ver || (_this.isestructura),
                style : 'padding-right: 10px;',
                text  : 'Leyenda:'
            }, {
                xtype : 'label',
                hidden: _this.ver || (_this.isestructura),
                html  : _this.createNodoLeyenda('Add', 'Adicionado')
            }, {
                xtype : 'label',
                hidden: _this.ver || (_this.isestructura),
                html  : _this.createNodoLeyenda('Mod', 'Modificado')
            }, {
                xtype : 'label',
                hidden: _this.ver || (_this.isestructura),
                html  : _this.createNodoLeyenda('Del', 'Eliminado')
            }, '-', _this.btnAyuda]
        }
        _this.itemsPanel = new Array();
        _this.itemsPanel.push(_this.tree);
        /**
         * ELEMENTOS DE SUBORDINACION
         */
        if (_this.subordinacion || _this.isestructura) {
            _this.construirSubordinacion();
            _this.itemsPanel.push(_this.treeSubordinacion);
        }
        Ext.apply(this, {
            layout: "border", items: _this.itemsPanel, width: 500, keys: [{
                key: Ext.EventObject.ENTER, fn: function () {
                    if (_this.tfBuscar.isDirty()) {
                        _this.buscarEstructura();
                    }
                }
            }, {
                key: 'b', alt: true, fn: function () {
                    _this.tfBuscar.focus(true, true);
                }
            }, {
                key: 'l', alt: true, fn: function () {
                    _this.limpiar();
                }
            }]
        })
        Gestion.Panel.Estructura.superclass.initComponent.apply(this)
    },
    ventanaReportePlantillaCargos: function (selections) {
        var _this = this;
        var win = new Win.Reporte.Plantilla({
            proyecto: _this.proyecto, estructuras: selections
        })
        win.show();
    },
    generateReporteEscala        : function () {
        var _this = this;
        var dir = "idproyecto=" + _this.proyecto;
        if (_this.getSelections(true).length > 0) {
            dir += "&idsestructuras=" + Ext.encode(_this.getSelections(true));
        }
        var idIFrame = Ext.id();
        var win = new Go.Pdf.Visor({
            url: 'reporteEscalasSalariales', params: dir, idIframe: idIFrame
        });
        win.show();
        Secodena.mostrarMascara('reporte', '', 'Generando reporte...');
        document.getElementById(idIFrame).onload = function () {
            Secodena.ocultarMascara('reporte');
            var iframeDocument = this.contentDocument;
            if (iframeDocument) {
                var response = iframeDocument.documentElement.textContent;
                response = Ext.decode(response);
                if (response.codMsg) {
                    mostrarMensaje(response.codMsg, response.mensaje);
                    win.destroy();
                }
            }
        };
    },

    generateReportePlazasAprobadasYCubiertas : function (idestructura) {
        let idIframe = Ext.id();
        new Ext.Window({
            title: 'Reporte de Cantidad de Plazas Aprobadas y Cubiertas',
            width: 800,
            height: 500,
            id: 'winnonivel',
            maskDisabled: false,
            animCollapse: false,
            maximizable: true,
            constrain: true,
            border: false,
            modal: true,
            items: {
                xtype: 'component',
                autoEl: {
                    tag: 'iframe',
                    id: idIframe,
                    style: 'height: 100%; width: 100%; border: none',
                    src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarReporteEstructuraComposicion?idestructura=' + idestructura
                }
            }
        }).show();
        Ext.getCmp('winnonivel').maximize();
        Secodena.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte');
        document.getElementById(idIframe).onload = function () {
            Secodena.ocultarMascara('rep01');
        }
    },
    construirVentanaGestion      : function (textAccion, modificar, idconcepto, nodo, idescala, tipoescala, idsector, sector) {
        var _this = this;
        var st = _this.parent;
        var loader = _this.loaderEstructura;
        var title = '';
        var name = '';
        switch (idconcepto) {
            case '1' :
                title = "órgano";
                name = 'organo';
                break;
            case '2' :
                title = "agrupación";
                name = 'agrupacion';
                break;
            case '3':
                title = "entidad";
                name = 'entidad';
                break;
            case '4':
                title = "organización";
                name = 'organizacion';
                break;
            case '5' :
                title = "órgano interno";
                name = 'organoi';
                break;
            case '6' :
                title = "agrupación interna";
                name = 'agrupacioni';
                break;
            case '7' :
                title = "cargo civil";
                name = 'cargocivil';
                break;
            case '10' :
                title = "cargo militar";
                name = 'cargomilitar';
                break;
            case '8':
                title = "estructura no formal";
                name = 'noformal';
                break;
            case '9':
                title = "medio";
                name = 'medio';
                break;
        }
        switch (idconcepto) {
            case '1' :
            case '2' :
            case '5' :
                var win = new Estructura.OrganoInterno({
                    nodo                : nodo,
                    loaderTreeEstructura: loader,
                    idconcepto          : idconcepto,
                    proyecto            : _this.proyecto,
                    storeProyecto       : st,
                    title               : textAccion + title,
                    modificar           : modificar,
                    name                : name,
                    tipoElemento        : title
                });
                break;
            case '6' :
            case '8' :
                var win = new Estructura.Comun({
                    idconcepto          : idconcepto,
                    nodo                : nodo,
                    loaderTreeEstructura: loader,
                    proyecto            : _this.proyecto,
                    storeProyecto       : st,
                    title               : textAccion + title,
                    modificar           : modificar,
                    name                : name,
                    tipoElemento        : title
                });
                break;
            case '3':
            case '4':
                var win = new Estructura.EntidadOrganizacion({
                    nodo                : nodo,
                    loaderTreeEstructura: loader,
                    idconcepto          : idconcepto,
                    proyecto            : _this.proyecto,
                    storeProyecto       : st,
                    title               : textAccion + title,
                    modificar           : modificar,
                    name                : name,
                    tipoElemento        : title
                });
                break;
            case '7' :
            case '10' :
                var win = new Estructura.Cargo({
                    idconcepto          : idconcepto,
                    nodo                : nodo,
                    loaderTreeEstructura: loader,
                    proyecto            : _this.proyecto,
                    storeProyecto       : st,
                    title               : textAccion + title,
                    modificar           : modificar,
                    name                : name,
                    escala              : idescala,
                    tipoescala          : tipoescala,
                    escala              : idescala,
                    /*idsector: idsector,
                    sector: sector,*/
                    tipoElemento        : title,
                    /* listeners: {
                          'show': function (_this) {
                              if (idsector) {
                                  Ext.getCmp('hiddenIdSector' + _this.name).setValue(_this.idsector);
                                  Ext.getCmp('combosector').setRawValue(_this.sector);
                              }
                          }
                      }*/
                });
                break;
            case '9':
                var win = new Estructura.Medio({
                    idconcepto          : idconcepto,
                    nodo                : nodo,
                    loaderTreeEstructura: loader,
                    proyecto            : _this.proyecto,
                    storeProyecto       : st,
                    title               : textAccion + title,
                    modificar           : modificar,
                    name                : name,
                    tipoElemento        : title
                });
                break;
        }
        win.show();
        if (modificar) {
            win.loadDatos();
            win.btnAceptar.focus();
        }
        win.on('afterInsert', function () {
            _this.tree.getNodeById(nodo.id).attributes.leaf = false;
            _this.tree.getNodeById(nodo.id).leaf = false;
        });
    },
    cambiarOrden                 : function (nodo, treeloader) {
        // Bloquea el cambio de orden si es un proyecto (proyecto ≠ 0)
        // if (this.proyecto !== 0) {
        //mostrarMensaje(1, 'La funcionalidad requerida ya no está en uso, para realizar cualquier cambio utilice cortar/copiar y pegar.');
        //  return false; // No permitir en proyectos
        //}
        // Lógica original para estructuras (proyecto = 0)
        var _this = this;
        var nodoId = nodo.attributes.id;
        var nextNodeOrden = (nodo.nextSibling) ? nodo.nextSibling.attributes.orden : 'last';
        Secodena.mostrarMascara('orden', '', 'Actualizando orden de estructura');
        Ext.Ajax.request({
            url       : 'cambiarOrden',
            params    : {
                nodoid   : nodoId,
                nextorden: nextNodeOrden,
                idproyecto:_this.proyecto
            }, success: function () {
                var padre = nodo.parentNode;
                treeloader.load(padre);
                padre.expand();
                Secodena.ocultarMascara('orden');
                mostrarMensaje(1, 'La estructura ha sido reordenada satisfactoriamente.')
            }
        })
    },
    moverArbol                   : function (nodo, treeloader, oldParent, newParent, index) {
        var _this = this;
        var nodoId = nodo.attributes.id;
        var idpadreoriginal = oldParent.attributes.id;
        var idpadrenuevo = newParent.attributes.id;


        Secodena.mostrarMascara('moverarbol', '', 'Moviendo estructura');
        Ext.Ajax.request({
            url    : 'moverArbol',
            params : {
                nodoid         : nodoId,
                idpadreoriginal: idpadreoriginal,
                idpadrenuevo   : idpadrenuevo,
                proyecto       : _this.proyecto
            },
            success: function () {
                var padre = newParent;
                treeloader.load(padre);
                treeloader.load(oldParent);
                Secodena.ocultarMascara('moverarbol');
                mostrarMensaje(1, 'La estructura ha sido movida satisfactoriamente.')
                treeloader.expand();
                padre.expand();
            }
        });


    },

    actualizarTree               : function () {
        var mask = new Ext.LoadMask(Ext.getBody(), {msg: "Actualizando jerarquía de la estructura organizativa..."});
        mask.show();
        Ext.Ajax.request({
            url     : 'actualizararbol',
            timeout : 2099999999,
            callback: function (options, success, response) {
                mask.hide();
            }
        })
    }
    ,
    validarMover                 : function (nodo, treeloader, padre, padreNuevo) {


            switch (nodo.attributes.idconcepto) {
                //internas hacia externas no
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '10':
                    //Estructuras internas superiores hacia cargo
                    if (nodo.attributes.idconcepto < 7) {
                        if (padreNuevo.attributes.idconcepto == '7') {
                            mostrarMensaje(1, 'No se puede mover una estructura interna hacia un cargo.');
                            return false;
                        }
                    }
                    //Si es una entidad, organizacion, organo o agrupacion
                    if ((padreNuevo.attributes.idconcepto == '1'
                            || padreNuevo.attributes.idconcepto == '2'
                            || padreNuevo.attributes.idconcepto == '3'
                            || padreNuevo.attributes.idconcepto == '4')
                        && padre != padreNuevo) {
                        mostrarMensaje(1, 'No se puede mover una estructura interna hacia una externa.');
                        return false;
                    }

                    break;

                //externas hacia internas no
                default:
                    //Estructuras superiores a entidad hacia entidad no
                    if (nodo.attributes.idconcepto == '1'
                        || nodo.attributes.idconcepto == '2'
                        || nodo.attributes.idconcepto == '4') {
                        if (padreNuevo.attributes.idconcepto == '3') {
                            mostrarMensaje(1, 'No se puede mover una estructura externa hacia una entidad.');
                            return false;
                        }
                    }
                    //Entidades hacia otra entidad  no
                    if (nodo.attributes.idconcepto == '3') {
                        if (padreNuevo.attributes.idconcepto == '3') {
                            mostrarMensaje(1, 'No se puede mover una entidad hacia otra entidad.');
                            return false;
                        }
                    }
                    if ((padreNuevo.attributes.idconcepto == '5'
                            || padreNuevo.attributes.idconcepto == '6'
                            || padreNuevo.attributes.idconcepto == '7'
                            || padreNuevo.attributes.idconcepto == '8'
                            || padreNuevo.attributes.idconcepto == '9'
                            || padreNuevo.attributes.idconcepto == '10')
                        && padre != padreNuevo) {
                        mostrarMensaje(1, 'No se puede mover una estructura externa hacia una interna.');
                        return false;
                    }
                    break;
            }

        return true;
    },
    buscarEstructura             : function () {
        var _this = this;
        var nodeSelc = false;
        _this.esBuscar = true;
        if (_this.tfBuscar.isDirty()) {
            Ext.each(_this.hiddenPkgs, function (n) {
                n.ui.show();
            });
            _this.loaderEstructura.baseParams = {
                buscar: _this.tfBuscar.getValue()
            };
            Go.Tree.search(this.tree, this.tfBuscar);
            (nodeSelc) ? true : nodeSelc = _this.tree.getRootNode();
            var contador = 0;
            nodeSelc.reload(function () {
                nodeSelc.expand(false, false, expandir = function (nodeSelc) {
                    if (nodeSelc.hasChildNodes) {
                        nodeSelc.eachChild(function (hijo) {
                            if (hijo.attributes.tiene) {
                                hijo.expand(false, false, expandir);
                            } else {
                                _this.hiddenPkgs.push(hijo);
                                hijo.ui.hide();
                                contador++;
                            }
                        }, this)
                    }
                });
                if (nodeSelc.childNodes.length == contador) {
                    mostrarMensaje(1, etiquetas.estructura.lbMsgeBusquedaSinDatos);
                    _this.limpiar();
                }
            });
        } else {
            mostrarMensaje(1, etiquetas.estructura.lbMsgNohayresultadosparamostrar);
            _this.limpiar();
        }
    },
    limpiar                      : function () {
        var _this = this;
        _this.tfBuscar.reset();
        _this.loaderEstructura.baseParams = {
            buscar: _this.tfBuscar.getValue()
        };
        _this.tree.root.reload();
        _this.tree.root.expand();
        _this.esBuscar = false;
    },
    dameGridMenu                 : function (conceptosAdicionar, nodo, loader, idescala, tipoescala, idsector, sector) {
        var _this = this;
        var menu = new Ext.menu.Menu();
        for (var i = 0; i < conceptosAdicionar.length; i++) {
            menu.add({
                text   : conceptosAdicionar[i].text,
                id     : conceptosAdicionar[i].id,
                icon   : conceptosAdicionar[i].icon,
                iconCls: 'btn',
                handler: function () {
                    _this.construirVentanaGestion("Adicionar ", false, this.getId(), nodo, idescala, tipoescala, idsector, sector);
                }
            })
        }
        return menu;
    },
    deshacerCambios              : function (nodo) {
        var _this = this;
        Ext.Ajax.request({
            url        : 'deshacerCambios', params: {
                identificador: nodo.id,
                idConcepto   : nodo.attributes.idconcepto,
                estado       : nodo.attributes.estado,
                proyecto     : _this.proyecto
            }, callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    _this.onActionResponse();
                    var ref = (nodo.attributes.referencia) ? nodo.attributes.referencia : nodo.attributes.referenciado;
                    var node = null;
                    if (ref) {
                        if (_this.tree.getNodeById(ref)) {        // INCLUIDA VALIDACION
                            node = _this.tree.getNodeById(ref).parentNode;
                            _this.loaderEstructura.load(node);
                            node.expand();
                        }
                    }
                    node = nodo.parentNode;
                    _this.loaderEstructura.load(node);
                    node.expand();
                }
            }
        })
    },
    editarEstructura             : function (node) {
        var _this = this;
        var text = (_this.actionEditNode == 'copiar') ? 'Duplicando ' : 'Reubicando ';
        Secodena.mostrarMascara('cargaini', '', text + 'los datos de la estructura');
        Ext.Ajax.request({
            url        : _this.actionEditNode + 'Estructura', params: {
                identificador: _this.editNode.id, idpadre: node.id, proyecto: _this.proyecto
            }, callback: function (options, success, response) {
                Secodena.ocultarMascara('cargaini');
                var responseData = Ext.decode(response.responseText);
                var codMsg = responseData.codMsg;
                if (codMsg == 1) {
                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    if (_this.actionEditNode == 'cortar') {
                        var nodo = _this.editNode.parentNode;
                        _this.loaderEstructura.load(nodo);
                        nodo.expand();
                        _this.editNode = false;
                        if (_this.parent) {
                            _this.parent.load({params: {start: 0, limit: 18}});
                        }
                        _this.actionEditNode = false;
                    }
                    node.leaf = false;
                    if (node.isExpanded() || node.attributes.leaf == true) {
                        _this.loaderEstructura.load(node);
                    }
                    node.expand();
                } else {
                    _this.editNode = false;
                }
            }
        })
    },
    mostrarResumen               : function (nodo) {
        var _this = this;
        var idEstructura = nodo.id
        var denominacion = nodo.attributes.abreviatura;
        if (denominacion == '') {
            denominacion = 'personal y medios';
        }
        _this.cantidad = 0;
        var tabs = new Ext.TabPanel({
            defaults: {
                frame: true
            }
        })
        var ventanaResumen = new Ext.Window({
            title    : 'Resumen de ' + denominacion,
            id       : 'resumen' + nodo.id + _this.proyecto,
            height   : 400,
            width    : 370,
            resizable: false,
            constrain: true,
            modal    : false,
            layout   : 'fit',
            items    : tabs
        })
        Ext.Ajax.request({
            url        : 'dameHTMLResumen', params: {
                identificador: idEstructura, idproyecto: _this.proyecto
            }, callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData) {
                    if (responseData.personal) {
                        tabs.add({
                            title     : 'Personal',
                            autoScroll: true,
                            id        : 'tabPersonal' + _this.proyecto,
                            html      : responseData.personal
                        });
                    }
                    if (responseData.medio) {
                        tabs.add({
                            title     : 'Medios',
                            autoScroll: true,
                            id        : 'tabMedio' + _this.proyecto,
                            html      : responseData.medio
                        });
                    }
                    tabs.activate(0);
                    ventanaResumen.show();
                } else {
                    ventanaResumen.destroy();
                    mostrarMensaje(1, 'No posee personal o medio.');
                }
            }
        });
    },
    mostrarDetalles              : function (nodo) {
        var _this = this;
        var idEstructura = nodo.id
        var idConcepto = nodo.attributes.idconcepto;
        var denominacion = nodo.attributes.abreviatura;
        if (denominacion == '') {
            denominacion = 'la estructura';
        }
        _this.cantidad = 0;
        var tabs = new Ext.TabPanel({
            defaults: {
                frame: true
            }
        })
        var ventanaDetalle = new Ext.Window({
            title    : 'Vista detalle de ' + denominacion,
            id       : 'detalle' + nodo.id + _this.proyecto,
            width    : 370,
            resizable: false,
            constrain: true,
            modal    : false,
            layout   : 'fit',
            items    : tabs
        })
        Ext.Ajax.request({
            url        : 'verDetallesValores', params: {
                identificador: idEstructura, idconcepto: idConcepto
            }, callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                tabs.add({
                    title: 'Detalles', id: 'detalles' + _this.proyecto, html: responseData.html
                });
                tabs.activate(0);
                if (idConcepto == 1 || idConcepto == 2 || idConcepto == 5 || idConcepto == 6) {
                    ventanaDetalle.height = 170;
                } else {
                    ventanaDetalle.height = 55 + (responseData.cantidad * 28);
                    var width = (150 + (responseData.ancho * 6.2));
                    ventanaDetalle.width = (width > (screen.width - 400)) ? (screen.width - 400) : width;
                }
                ventanaDetalle.show();
            }
        });
    },
    onActionResponse             : function () {
        if (this.parent) {
            this.parent.reload();
        }
    },
    getSelections                : function (soloIds) {
        var checkNodes = this.tree.getChecked();
        var selections = new Array();
        for (var i = 0; i < checkNodes.length; i++) {
            if (soloIds) {
                selections.push(parseInt(checkNodes[i].id));
            } else {
                selections.push({
                    id           : parseInt(checkNodes[i].id),
                    idpadre      : parseInt(checkNodes[i].parentNode.id),
                    cantidad     : checkNodes[i].attributes.cantidad,
                    cantidad_real: checkNodes[i].attributes.cantidad_real,
                    denom        : checkNodes[i].attributes.denominacion,
                    idconcepto   : parseInt(checkNodes[i].attributes.idconcepto),
                    estado       : parseInt(checkNodes[i].attributes.estado),
                    icono        : checkNodes[i].attributes.iconoorganigrama,
                    lft          : parseInt(checkNodes[i].attributes._lft),
                    rgt          : parseInt(checkNodes[i].attributes._rgt),
                    leaf         : checkNodes[i].leaf
                })
            }
        }
        return selections;
    },
    /**
     * La funcionalidad comprueba a traves del primer nodo en el arreglo que todos los
     * restantes sean hijos en su estructura para evitar pintar el organigrama con dos niveles
     * estructurales. En caso de ser hijo de la estructura modelo se busca que su padre se encuentre
     * adicionado en el mismo.
     *
     * @author Ing.Osvaldo Manuel González
     * @param arreglo Arreglo de elementos seleccionados del arbol de estructura
     * @returns {TRUE o FALSE} False en caso de no poder pintar el organigrama
     */
    comprobarNivelesEstructurales: function (arreglo) {
        var rgt = arreglo[0].rgt;
        var lft = arreglo[0].lft;
        for (var i = 1; i < arreglo.length; i++) {
            if (lft > arreglo[i].lft || rgt < arreglo[i].rgt) {
                return false;
            } else {
                if (this.buscarPadreNodoEnArreglo(arreglo, arreglo[i].idpadre) == -1) {
                    return false;
                }
            }
        }
        return true;
    },
    /**
     * Busca si existe algun identificador de un nodo que sea igual al idpadre
     * del nodo que se comprueba en la comprobacion de los niveles estructurales
     *
     * @author Ing.Osvaldo Manuel González
     * @param arreglo Arreglo de elementos
     * @param idpadre Identificador del nodo
     * @returns {TRUE, FALSE} Si existe o no el nodo con dicho identificador
     */
    buscarPadreNodoEnArreglo     : function (arreglo, idpadre) {
        for (var i = 0; i < arreglo.length; i++) {
            if (arreglo[i].id == idpadre) {
                return i;
            }
        }
        return -1;
    },
    /**
     * Comprueba que los elementos seleccionados esten correctos y el organigrama no posea
     * selecciones en diferentes ramas del arbol.
     *
     * @author Ing.Osvaldo Manuel González
     */
    dibujarOrganigrama           : function (horizontal) {
        var selections = this.getSelections();
        if (selections.length > 0) {
            if (this.comprobarNivelesEstructurales(selections)) {
                dibujarOrganigrama(this.title, this.proyecto, selections, null, horizontal);
            } else {
                mostrarMensaje(1, "El organigrama no permite dos niveles estructurales.")
            }
        } else {
            if (this.tree.root.childNodes.length == 1) {
                dibujarOrganigrama(this.title, this.proyecto, [], null, horizontal);
            } else {
                mostrarMensaje(1, "Debe seleccionar al menos una estructura.")
            }
        }
    },
    construirSubordinacion       : function () {
        var _this = this;
        //RAIZ DEL ARBOL DE SUBORDINACION
        _this.rootSubordinacion = new Ext.tree.AsyncTreeNode({
            text: etiquetas.subordinacion.lbSubordinaciones, draggable: false, id: 'Subordinacion'
        });
        _this.btnActualizarSubordinacion = new Ext.Button({
            //						icon   : perfil.dirImg + 'actualizar.png',
            iconCls: 'actualizar',
            text   : etiquetas.subordinacion.lbbtnActualizarSub,
            tooltip: etiquetas.subordinacion.lbTooltipActualizarSub,
            handler: function () {
                _this.rootSubordinacion.reload();
                _this.rootSubordinacion.expand();
            }
        })
        //TREE LOADER DEL ARBOL DE SUBORDINACION
        _this.loaderSubordinacion = new Ext.tree.TreeLoader({
            dataUrl: 'buscarSubordinacion', listeners: {
                beforeload: function (object, n) {
                    if (n.id != 'Subordinacion' && n.attributes.realid != n.attributes.idsub) {
                        object.baseParams = {
                            idpadre: n.attributes.realid, idsub: n.attributes.idsub
                        }
                    } else {
                        if (n.attributes.realid == n.attributes.idsub) {
                            object.baseParams = {
                                idpadre: '', idsub: n.attributes.idsub
                            }
                        }
                    }
                }
            }
        })
        _this.treeSubordinacion = new Ext.tree.TreePanel({
            autoScroll     : true,
            title          : etiquetas.subordinacion.lbSubordinaciones,
            hidden         : _this.isestructura,
            layoutConfig   : {animate: true},
            enableDrop     : true,
            region         : 'east',
            containerScroll: true,
            split          : true,
            width          : '50%',
            maxWidth       : screen.width / 2,
            loader         : _this.loaderSubordinacion,
            tbar           : [_this.btnActualizarSubordinacion],
            root           : _this.rootSubordinacion,
            dropConfig     : {appendOnly: true},
            keys           : [{
                key: Ext.EventObject.DELETE, fn: function () {
                    var n = _this.nodoSubordinacion;
                    if (n.id != 'Subordinacion' && n.attributes.id != n.attributes.realid) {
                        _this.eliminarSubordinacion(n);
                    }
                }
            }],
            listeners      : {
                load          : function (node) {
                    var childNodes = node.childNodes;
                    for (var i = 0; i < childNodes.length; i++) {
                        var child = childNodes[i];
                        if (!child.attributes.hijos) {
                            child.expanded = true;
                        }
                    }
                }, click      : function (n) {
                    _this.nodoSubordinacion = n;
                }, contextmenu: function (n, e) {
                    var realId = n.attributes.realid;
                    var idSub = n.attributes.idsub;
                    var isOculto = (realId == idSub || n.id == 'Subordinacion') ? true : false;
                    var contextMenu = new Ext.menu.Menu({
                        items: [{
                            text   : etiquetas.subordinacion.lbbtnEliminar + " <b>(Del)", //																icon   : perfil.dirImg + 'eliminar.png',
                            iconCls: 'eliminar', id: 'btnDelSubordinacion', handler: function () {
                                _this.eliminarSubordinacion(n);
                            }
                        }]
                    })
                    if (!isOculto) {
                        if (e.getXY()[0] == 0 && e.getXY()[1] == 0) {
                            contextMenu.showAt([831, 127]);
                        } else {
                            contextMenu.showAt(e.getXY());
                        }
                    }
                }, //NODO SOLTADO A INSERTAR EN SUBORDINACION
                nodedrop      : function (drop) {
                    var parent = drop.target; //Nodo padre
                    var objetivo = drop.point;//Posicion del evento [encima -> above ] [debajo -> below] [sobre -> append]
                    if (objetivo == 'append') {
                        //No es posible adicionar un hijo al nodo root del tree
                        if (parent.id != 'Subordinacion') {
                            var posible = true;
                            //No es posible adicionarles subordinaciones a los medios
                            if (parent.attributes.idconcepto == 9) {
                                posible = false;
                            } else {
                                //Si es cualquier estructura interna no le es posible adicionar las externas
                                if ((parent.attributes.idconcepto == 5 || parent.attributes.idconcepto == 6) && _this.nodoAInsertar.attributes.idconcepto <= 4) {
                                    posible = false;
                                } else {
                                    //Si son cargos, solo pueden subordinarse a si mismo o medios
                                    if ((parent.attributes.idconcepto == 7) && _this.nodoAInsertar.attributes.idconcepto != 7 && _this.nodoAInsertar.attributes.idconcepto != 9) {
                                        posible = false;
                                    }
                                }
                            }
                            if (posible) {
                                /*
                                 * Valor del nodo padre:
                                 * Si el idSub y realid son iguales es que lo adicionara en una subordinacion directamente
                                 * sino a un nodo ya subordinado
                                 */
                                var idSub = parent.attributes.idsub;
                                var realId = parent.attributes.realid;
                                var idPadre = (idSub == realId) ? _this.nodoAInsertar.id : realId;
                                var hijo = _this.nodoAInsertar.id; //Identificador del nodo hijo
                                Ext.Ajax.request({
                                    url        : 'cambiarSubordinacion', params: {
                                        idpadre: idPadre, hijo: hijo, idsub: idSub
                                    }, callback: function (options, success, response) {
                                        var responseData = Ext.decode(response.responseText);
                                        var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
                                        var msg = responseData.mensaje;
                                        mostrarMensaje(codMsg, msg);
                                        if (codMsg == 1) {
                                            if (parent.isExpanded() || parent.leaf) {
                                                _this.loaderSubordinacion.load(parent);
                                            }
                                            parent.expand();
                                        }
                                    }
                                })
                                return true;
                            } else {
                                mostrarMensaje(6, "No es posible adicionar la subordinación especificada.")
                            }
                        }
                    } else {
                        return false;
                    }
                }, beforeshow : function () {
                    _this.rootSubordinacion.expand();
                }
            }
        });
    },
    eliminarSubordinacion        : function (node) {
        var _this = this;
        var realId = node.attributes.realid;
        var idSub = node.attributes.idsub;
        mostrarMensaje(2, etiquetas.subordinacion.lbMsgEliminar, function (btn) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url        : 'eliminarSubordinacion', params: {
                        identificador: realId, idsub: idSub
                    }, callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
                        var msg = responseData.mensaje;
                        mostrarMensaje(codMsg, msg);
                        if (codMsg == 1) {
                            var padre = node.parentNode;
                            _this.loaderSubordinacion.load(padre);
                            padre.expand();
                        }
                    }
                })
            }
        })
    }
})