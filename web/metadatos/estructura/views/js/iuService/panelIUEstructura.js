Ext.QuickTips.init();
Ext.ns('Ext.estructura.panel');
/**
 * @class Ext.estructura.panel.PanelEstructura
 * @extends Ext.Panel
 * Panel de consulta estructural de Gestion Organizacional.
 * @constructor
 * @param {Object} config Configuracion del panel
 */
var etiquetas = etiquetas;
Ext.estructura.panel.PanelEstructura = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Boolean|Array} checker
     * False para que los elementos de la estructura no contengan opcion de selección
     * TRUE para que todos los elementos de la estructura contengan un checkbox de seleccion
     * ARRAY (e.j., checker:[1,2,3],) permite annadirles un campo de seleccion a conceptos especificos.
     */
    checker                : false,
    /**
     * @cfg {Boolean|Object} checked
     * False para que todos los elementos de la estructura estén deseleccionados
     * TRUE para que todos todos los elementos de la estructura esten checkeados
     * Object (e.j., checker:{ id: [100000001], concepto:[1,2,3]},) permite seleccionar solo las estructuras segun
     * los conceptos o identificadores definidos, que no entren en conflicto con {checker}.
     */
    checked                : false,
    /**
     * @cfg {Boolean|Numeric} inicial
     * False crea la estructura a partir del nodo principal de su dominio
     * Numeric (e.j., inicial: 100000001,) permite crear la estructura a pertir de un
     * identificador de estructrura o codigo de una plantilla.
     */
    inicial                : false,
    /**
     * @cfg {Boolean} cargos
     * False no carga los cargos en la estructura
     * True permite que los cargos aparezcan en la estructura.
     */
    cargos                 : true,

    /**
     *
     * @cfg {Array} excluirConceptos
     * Vacio permite que todos los elementos de la estructura puedan mostrarse
     * Array (e.j., limit:[7,10,9],) permite especificar los conceptos que no podran mostrarse.
     * Nota: El id de los conceptos se encuentra en la tabla mod_estructuracomp.nom_concepto
     */
    excluirConceptos                 : new Array(),
    /**
     * @cfg {Boolean|Numeric|Array} limit
     * False permite que todos los elementos de la estructura puedan expandirse en caso de tener
     * elementos hijos
     * Numeric (e.j., limit:3,) permite especificar el conceptos que no podra expandirse
     * Array (e.j., limit:[1,2,3],) permite especificar los conceptos que no podran expandirse.
     */
    limit                  : false,
    /**
     * @cfg {Boolean} menu
     * False deshabilita las opciones de resumen y detalle de las estructuras
     * True habilita todas las opciones del menu del arbol de estructura.
     */
    menu                   : false,
    /**
     * @cfg {Numeric} proyecto
     * 0 muestra todas las estructuras aprobadas
     * <>0 muestra las estructuras por proyecto.
     */
    proyecto               : 0,
    /**
     * Para el buscador de diponibilidad de cargos
     */
    disponibilidad:   false,
    isGestionProyecto      : false,
    width                  : 600,
    height                 : 450,
    editNode               : false,
    autoScroll             : true,
    limitDeep              : 3,
    initComponent          : function () {
        var _this = this;
        _this.esBuscar = false;
        _this.rutaUrl = 'estructura';
        if (_this.proyecto) {
            _this.isGestionProyecto = true;
        }
        if (_this.isGestionProyecto) {
            _this.rutaUrl = 'proyecto';
        }
        /**
         * @cfg {String} url
         * Cambia la ruta para las peticiones de estructura en el panel
         */
        _this.url = '/metadatos/' + _this.rutaUrl + '/index.php/' + _this.rutaUrl + '/';
        _this.nodo = false;
        if (_this.checked && !_this.checker) {
            _this.checker = true;
        }
        _this.hiddenPkgs = [];
        /**Componentes de busqueda*/
        _this.tfBuscar = new Ext.form.TextField({
            id             : 'tfBuscarIU' + _this.proyecto,
            enableKeyEvents: true,
            nextTab        : 'btnBuscarIU' + _this.proyecto,
            prevTab        : 'btnAceptar',
            emptyText      : "Criterio a buscar...",
            vtype          : 'vtalfanumericosguiones',
            listeners      : {
                'keyup': function (_tx, state) {
                    if (_tx.getValue() != "" && _tx.isValid()) {
                        _this.btnBuscar.enable();
                        _this.btnLimpiar.enable();

                    } else {

                        _this.btnBuscar.disable();
                        _this.btnLimpiar.disable();
                    }
                }
            }
        })
        _this.btnBuscar = new Ext.Button({
            id      : 'btnBuscarIU' + _this.proyecto,
            iconCls : 'buscar',
            disabled: true,
            nextTab : 'btnLimpiar' + _this.proyecto,
            prevTab : 'tfBuscarIU' + _this.proyecto,
            text    : etiquetas.estructura.lbBuscar,
            tooltip : etiquetas.estructura.lbBuscarEstructura,
            handler : function () {
                _this.buscarEstructura();
            }
        })
        _this.btnLimpiar = new Ext.Button({
            iconCls : 'limpiar',
            disabled: true,
            nextTab : 'btnExpandir' + _this.proyecto,
            prevTab : 'btnBuscar' + _this.proyecto,
            text    : etiquetas.estructura.lbLimpiar,
            id      : 'btnLimpiar' + _this.proyecto,
            tooltip : etiquetas.estructura.lbLimpiarToolTips,
            handler : function () {
                _this.limpiar();
            }
        })
        _this.btnExpandir = new Ext.Button({
            iconCls: 'expandir',
            nextTab: 'btnColapsar' + _this.proyecto,
            prevTab: 'btnLimpiar' + _this.proyecto,
            id     : 'btnExpandir' + _this.proyecto,
            tooltip: etiquetas.estructura.lbTooltipExpandir,
            handler: function () {
                var nodo = _this.tree.getSelectionModel().getSelectedNode();
                if (nodo && nodo.id != _this.tree.root.id) {
                    _this.nodoExpand = nodo;
                } else {
                    _this.nodoExpand = _this.tree.root;
                }
                _this.nodoExpand.expand(true);
            }
        })
        _this.btnColapsar = new Ext.Button({
            iconCls: 'contraer',
            nextTab: 'btnCancelar',
            prevTab: 'btnExpandir' + _this.proyecto,
            id     : 'btnColapsar' + _this.proyecto,
            tooltip: etiquetas.estructura.lbTooltipColapsar,
            handler: function () {
                var nodo = _this.tree.getSelectionModel().getSelectedNode();
                if (nodo && nodo.id != _this.tree.root.id) {
                    _this.nodoCollapse = nodo;
                } else {
                    _this.nodoCollapse = _this.tree.root;
                }
                _this.nodoCollapse.collapse(true);
            }
        })
        /**TREE LOADER DEL ARBOL DE ESTRUCTURAS */
        _this.loaderEstructura = new Ext.tree.TreeLoader({
            dataUrl: _this.url + 'buscarHijosIU', listeners: {
                beforeload: function () {
                    /**PARAMETRO PARA PONER LOS CHECKBOX A LOS ELEMENTOS*/
                    var marcar = _this.checker;
                    if (marcar.length > 0) {
                        marcar = Ext.encode(_this.checker);
                    }
                    this.baseParams.checker = marcar;
                    /**PARAMETRO DE CHEKEO DE ELEMENTOS*/
                    marcar = _this.checked;
                    if (marcar instanceof Object) {
                        marcar = Ext.encode({
                            id      : _this.checked.id ? _this.checked.id : [],
                            concepto: _this.checked.concepto ? _this.checked.concepto : []
                        });
                    }
                    this.baseParams.marcar = marcar;
                    /**SI SE ADMITIRAN CARGOS EN LA ESTRUCTURA*/
                    this.baseParams.cargos = _this.cargos;
                    this.baseParams.excluirConceptos = Ext.encode(_this.excluirConceptos);
                    this.baseParams.root = _this.inicial;
                    this.baseParams.proyecto = _this.proyecto;
                    this.baseParams.disponibilidad = _this.disponibilidad;

                }, load   : function (treeLoader, node) {
                    _this.tfBuscar.focus(false, 10);
                    var nivel = 0;
                    if (node.id != 'Estructuras') {
                        nivel = node.attributes.nivel + 1;
                    }
                    var hijos = node.childNodes;
                    for (var i = 0; i < hijos.length; i++) {
                        hijos[i].attributes.nivel = nivel;
                        if (hijos[i].attributes.idconcepto == '7' || hijos[i].attributes.idconcepto == '9') {
                            hijos[i].setText(hijos[i].attributes.text + ' <b>[' + hijos[i].attributes.cantidad + ' | ' + hijos[i].attributes.cantidad_real + ']')
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
                    if (_this.checker) {
                        _this.nodo = _this.tree.getChecked();
                    } else {
                        _this.nodo = false;
                    }
                }
            }
        })
        /** TREE PANEL DEL ARBOL DE ESTRUCTURAS */
        _this.tree = new Ext.tree.TreePanel({
            autoScroll     : true,
            split          : true,
            animate        : true,
            width          : 400,
            height         : 600,
            minSize        : 175,
            maxSize        : 400,
            enableDrag     : _this.isGestionProyecto,
            margins        : '0 0 0 2',
            rootVisible    : (!_this.inicial) ? true : false,
            layoutConfig   : {
                animate: true
            },
            tbar           : [_this.tfBuscar, ' ', _this.btnBuscar, _this.btnLimpiar, '-', _this.btnExpandir, _this.btnColapsar],
            collapseMode   : 'mini',
            containerScroll: true,
            loader         : _this.loaderEstructura,
            listeners      : {
                beforemovenode: function (arbol, nodo) {
                    if (_this.isGestionProyecto) {
                        _this.fireEvent('dragnode', this, nodo);
                    }
                    return false;
                }
            },
            keys           : [{
                key: Ext.EventObject.ENTER, fn: function () {
                    if (_this.tfBuscar.isDirty()) {
                        _this.btnBuscar.handler.call();
                    }
                }
            }, {
                key: 'B', alt: true, fn: function () {
                    _this.tfBuscar.focus(true, 10);
                }
            }]
        });
        _this.root = new Ext.tree.AsyncTreeNode({
            text     : etiquetas.estructura.lbgestructuras,
            draggable: false,
            icon     : '/metadatos/comun/recursos/iconos/folder-open.gif',
            id       : 'Estructuras',
            idtipo   : 'Estructuras',
            listeners: {
                expand     : function (node) {
                    node.icon = '/metadatos/comun/recursos/iconos/folder-open.gif';
                }, collapse: function (node) {
                    node.icon = '/metadatos/comun/recursos/iconos/folder.gif';
                }
            }
        });
        _this.tree.setRootNode(_this.root);
        _this.on('render', function () {
            _this.tree.getRootNode().expand();
        })
        if (_this.checker) {
            _this.tree.on('checkchange', function () {
                _this.nodo = _this.tree.getChecked();
                _this.fireEvent('dameseleccion', this, _this.nodo);
            })
        } else {
            _this.tree.on('click', function (node) {
                if (!_this.inicial) {
                    if (_this.tree.getRootNode().id == node.id) {
                        this.nodo = false;
                    } else {
                        this.nodo = node;
                    }
                    _this.nodo = this.nodo;
                } else {
                    var root = _this.tree.getRootNode().firstChild;
                    if (root.id == node.id) {
                        this.nodo = false;
                    } else {
                        this.nodo = node;
                    }
                    _this.nodo = this.nodo;
                }
                this.fireEvent('dameseleccion', this, _this.nodo);
            })
        }
        /**MANDANDO AL ARBOL QUE SE MUESTRE */
        _this.tree.on("beforeexpandnode", function (nodo, deep) {
            var idconcepto = (nodo.attributes.idtipo != undefined) ? nodo.attributes.idtipo : nodo.attributes.idconcepto;
            if (_this.limit) {
                if (_this.limit.length >= 1) {
                    if (_this.tree.getRootNode().id != nodo.id) {
                        for (var i = 0; i < _this.limit.length; i++) {
                            if (idconcepto == _this.limit[i]) {
                                return false;
                            }
                        }
                    }
                    return true;
                } else {
                    if (idconcepto != 'Estructura') {
                        if (idconcepto == _this.limit) {
                            return false;
                        }
                    }
                }
            }
            if (deep && _this.limitDeep != -1 && !_this.esBuscar) {
                if (idconcepto != 'Estructura') {
                    if (idconcepto == _this.limitDeep && nodo.id != _this.nodoExpand.id) {
                        return false;
                    }
                }
            }
        })
        _this.tree.on('contextmenu', function (n, e) {
            var idVentana = Ext.getCmp('resumen' + n.id + this.proyecto);
            var idDetalle = Ext.getCmp('detalle' + n.id + this.proyecto);
            var estado = n.attributes.estado;
            _this.noAdd = false;
            _this.nodo = n;
            _this.accion = "Adicionar";
            _this.idOp = "";
            _this.nodoSel = n;
            _this.selccUltimo = "estructura";
            _this.textomenu = n.text;
            var contextMenu;
            Ext.Ajax.request({
                url       : _this.url + 'construirCamposGrid', params: {
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
                    var ocultarEliminar = !_this.menu || isRoot || (((n.attributes.id == n.attributes._parent) ? true : false) && _this.root.childNodes.length == 1);
                    var ocultarAdicionar = !_this.menu;
                    var ocultarModificar = (!_this.menu || isRoot) ? true : false;
                    ocultarModificar = (restringe) ? !parseInt(userPermisos.modificar) || ocultarModificar : ocultarModificar;
                    ocultarEliminar = (restringe) ? !parseInt(userPermisos.eliminar) || ocultarEliminar : ocultarEliminar;
                    ocultarAdicionar = (restringe) ? !parseInt(userPermisos.adicionar) || ocultarAdicionar : ocultarAdicionar;
                    contextMenu = new Ext.menu.Menu({
                        items: [{
                            text   : etiquetas.estructura.lbBtnAdicionar,
                            hidden : ocultarAdicionar, //																icon   : _this.perfil.dirImg + 'adicionar.png',
                            iconCls: 'adicionar',
                            menu   : _this.dameGridMenu(conceptosAdicionar, n, _this.loaderEstructura, idescala, tipoescala),
                            scope  : this
                        }, {
                            text   : etiquetas.estructura.lbBtnModificar, hidden: ocultarModificar, //																icon   : _this.perfil.dirImg + 'modificar.png',
                            iconCls: 'modificar', handler: function () {
                                if (n.attributes.esmilitar) {
                                    _this.construirVentanaGestion('Modificar ', true, '10', n, idescala, tipoescala, idsector, sector);
                                } else {
                                    _this.construirVentanaGestion('Modificar ', true, n.attributes.idconcepto, n, idescala, tipoescala, idsector, sector);
                                }
                            }
                        }, {
                            text   : etiquetas.estructura.lbBtnEliminar, hidden: ocultarEliminar, //																icon   : _this.perfil.dirImg + 'eliminar.png',
                            iconCls: 'eliminar', handler: function () {
                                _this.accion = 'Eliminar';
                                _this.eliminarNodo(n);
                            }
                        }, {
                            text   : etiquetas.estructura.lbResumen,
                            hidden : !_this.menu || (n.attributes.idconcepto < 7 && !idVentana && !n.attributes.leaf) ? false : true, //																icon   : _this.perfil.dirImg + 'informe.png',
                            iconCls: 'informe',
                            id     : 'idmenuResumen',
                            handler: function () {
                                _this.mostrarResumen(n);
                            }
                        }, {
                            text   : etiquetas.estructura.lbVerDetalles,
                            hidden : !_this.menu || isRoot || (((n.attributes.idconcepto == 3 || n.attributes.idconcepto == 4) && !idDetalle && !n.attributes.leaf) ? false : true), //																icon   : _this.perfil.dirImg + 'detalles.png',
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
        if (_this.checker) {
            _this.tree.on('checkchange', function (n) {
                _this.nodo = _this.tree.getChecked();
                _this.fireEvent('dameseleccion', this, _this.nodo);
            })
        } else {
            _this.tree.on('click', function (n) {
                _this.nodo = n;
                _this.fireEvent('dameseleccion', this, this.nodo);
            })
        }
        Ext.apply(this, {
            layout: "fit", items: _this.tree, keys: [//
                {
                    key: 'l', alt: true, fn: function () {
                    _this.limpiar();
                }
                }, {
                    key: 'b', alt: true, fn: function () {
                        _this.tfBuscar.focus(true, 10);
                        ///_this.btnBuscar.handler.call();
                    }
                }]
        })
        Ext.estructura.panel.PanelEstructura.superclass.initComponent.apply(this)
        _this.addEvents('dameseleccion', 'dragnode');
    },
    /**
     * Funcion que permite obtener el nodo seleccionado en el arbol de estructura o
     * el arreglo de nodos checkeados en la misma en caso de {cheker}
     * @returns {TreeNode|Array}
     */
    dameSeleccion          : function () {
        return this.nodo;
    },
    setInicial             : function (inicial) {
        var _this = this;
        _this.inicial = inicial;
    },
    buscarEstructura       : function () {
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
            (nodeSelc) ? nodeSelc = true : _this.inicial ? nodeSelc = _this.tree.getNodeById(_this.inicial) : nodeSelc = _this.tree.getRootNode();
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
                if (nodeSelc.childNodes.length == contador && _this.tfBuscar.getValue() != '') {
                    mostrarMensaje(1, etiquetas.estructura.lbMsgeBusquedaSinDatos);
                    _this.limpiar();
                }
            });
        } else {
            mostrarMensaje(1, etiquetas.estructura.lbMsgNohayresultadosparamostrar);
            _this.limpiar();
        }
    }, //private
    limpiar                : function () {
        var _this = this;
        _this.nodo = null;
        _this.tfBuscar.reset();
        _this.loaderEstructura.baseParams = {
            buscar: _this.tfBuscar.getValue()
        };
        _this.btnBuscar.disable();
        _this.btnLimpiar.disable();
        _this.tree.root.reload();
        _this.tree.root.expand();
        _this.esBuscar = false;
    },
    /**
     * Funcion que permite obtener el resumen de cargos y entidades por estructuras, asi
     * como el porcentaje de cargos directos e indirectos en la misma
     * @returns {Window}
     */
    mostrarResumen         : function (nodo) {
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
            url        : _this.url + 'dameHTMLResumen', params: {
                identificador: idEstructura, idproyecto: 0
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
    /**
     * Funcion que permite obtener todos los datos de la estructura en una ventana detalle
     * @returns {Window}
     */
    mostrarDetalles        : function (nodo) {
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
            resizable: true,
            modal    : false,
            layout   : 'fit',
            items    : tabs
        })
        Ext.Ajax.request({
            url        : _this.url + 'verDetallesValores', params: {
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
    dameGridMenu           : function (conceptosAdicionar, nodo, loader, idescala, tipoescala) {
        var _this = this;
        var menu = new Ext.menu.Menu();
        for (var i = 0; i < conceptosAdicionar.length; i++) {
            menu.add({
                text   : conceptosAdicionar[i].text,
                id     : conceptosAdicionar[i].id,
                icon   : conceptosAdicionar[i].icon,
                iconCls: 'btn',
                handler: function () {
                    _this.construirVentanaGestion("Adicionar ", false, this.getId(), nodo, idescala, tipoescala);
                }
            })
        }
        return menu;
    },
    eliminarNodo           : function (nodo) {
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
                    url        : _this.url + 'eliminarValores', params: {
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
    },
    onActionResponse       : function () {
        if (this.parent) {
            this.parent.reload();
        }
    },
    dameTree: function () {
        return this.tree;
    },
    construirVentanaGestion: function (textAccion, modificar, idconcepto, nodo, idescala, tipoescala) {
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
                    tipoElemento        : title
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
        }
        win.on('afterInsert', function () {
            _this.tree.getNodeById(nodo.id).attributes.leaf = false;
            _this.tree.getNodeById(nodo.id).leaf = false;
        });
    }
})