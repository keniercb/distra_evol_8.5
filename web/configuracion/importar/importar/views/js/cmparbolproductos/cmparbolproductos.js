Utilidades.Cmp.Cmparbolproductos = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.prevrow = -1;
    this.start = 0;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.idProductos = null;

    //funcion que me construye el árbol de Productos
    this.CrearArbolProductos = function () {
        this.tfbuscarProductos = new Ext.form.TextField(
            {
                id: 'tfbuscarProductos',
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 100,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (tf.isValid() && tf.getValue() != '') {
                                _this.tpProductos.getRootNode().reload();
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.getValue() != '') {
                            _this.btnLimpiarProductos.enable();
                            if (tf.isValid()) {
                                _this.btnbuscarProductos.enable();
                            } else {
                                _this.btnbuscarProductos.disable();
                            }
                        } else {
                            _this.btnLimpiarProductos.disable();
                        }
                    }
                }
            });

        this.btnbuscarProductos = new Ext.Button({
            iconCls: 'buscar',
            tooltip: 'Buscar productos',
            disabled: true,
            handler: function () {
                _this.tpProductos.getRootNode().reload();
            },
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.btnLimpiarProductos = new Ext.Button({
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro(s)',
            disabled: true,
            handler: function () {
                _this.tfbuscarProductos.reset();
                _this.btnbuscarProductos.disable();
                _this.btnLimpiarProductos.disable();
                _this.tpProductos.getRootNode().reload();
            },
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            text: 'Productos y servicios',
            iconCls: 'historial',
            expanded: true,
            animate: false,
            codigo: '',
            denominacion: '',
            nivel: 0,
            idpadre: 0,
            idarbol: 0,
            idformato: 0,
            idindicador: null,
            leaf: false,
            treeSearch: ''
        });

        this.tpProductos = new Ext.tree.TreePanel({
            tbar: ['Buscar:', '', _this.tfbuscarProductos, _this.btnbuscarProductos,
                _this.btnLimpiarProductos, '-',
                {
                    id: 'btnExpandirProducto',
                    iconCls: 'expandir',
                    tooltip: 'Expandir &aacute;rbol de productos',
                    handler: function () {
                        _this.tpProductos.root.expand(true);
                        _this.actualizarBarraHerramientasEstructura('expandir');
                    }
                }, {
                    id: 'btnContraerProducto',
                    iconCls: 'contraer',
                    tooltip: 'Contraer &aacute;rbol de productos',
                    handler: function () {
                        _this.tpProductos.root.collapse(true);
                        _this.actualizarBarraHerramientasEstructura('contraer');
                    }
                }, {
                    id: 'btnActualizarProducto',
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar &aacute;rbol de productos',
                    handler: function () {
                        _this.tfbuscarProductos.reset();
                        _this.tpProductos.getRootNode().reload();
                        _this.actualizarBarraHerramientasEstructura('actualizar');
                    }
                }
            ],
            autoScroll: true,
            split: true,
            root: _this.root,
            listeners: {
                click: function (node) {
                    _this.idProductos = node.id;
                },
                beforeexpandnode: function (node) {
                    _this.actualizarBarraHerramientasEstructura('expandir');
                },
                beforecollapsenode: function (node) {
                    _this.actualizarBarraHerramientasEstructura('contraer');
                },
                load: function (node) {
                    _this.actualizarBarraHerramientasEstructura('actualizar');
                },
                render: function (tpanel) {
                    //_this.tpProductos.getRootNode().reload();
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarArbolClasificador',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        var text = _this.tfbuscarProductos.getValue();
                        atreeloader.baseParams = {
                            treeSearch: text
                        };
                    },
                    'load': function (atreeloader, anode) {
                        var text = _this.tfbuscarProductos.getValue();
                        atreeloader.baseParams = {
                            treeSearch: text
                        };
                    }
                }
            })
        });

        return _this.tpProductos;
    };

    this.actualizarBarraHerramientasEstructura = function (accion) {
        if (_this.tpProductos.getRootNode().childNodes.length == 0) {
            Ext.getCmp('btnExpandirProducto').setDisabled(true);
            Ext.getCmp('btnContraerProducto').setDisabled(true);
        } else {
            if (accion == 'contraer') {
                Ext.getCmp('btnExpandirProducto').setDisabled(false);
                Ext.getCmp('btnContraerProducto').setDisabled(true);
            } else if (accion == 'expandir' || accion == 'actualizar') {
                Ext.getCmp('btnExpandirProducto').setDisabled(true);
                Ext.getCmp('btnContraerProducto').setDisabled(false);
                if (accion == 'actualizar') {
                    _this.tfbuscarProductos.reset();
                    _this.btnbuscarProductos.disable();
                    _this.btnLimpiarProductos.disable();
                }
            }
        }
    };


}


