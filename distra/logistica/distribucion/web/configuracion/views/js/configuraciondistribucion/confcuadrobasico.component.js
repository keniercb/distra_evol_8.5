Ext.ns('Ext.erp');
Ext.erp.confcuadrobasico = Ext.extend(LOG.util.Panel, {
    nodoSeleccionadoArbol: undefined,
    urlController: '/logistica/distribucion/configuracion/index.php/configuraciondistribucion/',
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.buildUI();
        this.createEvents();
        this.listeners = {
            'activate': function() {

            },
            'afterrender': function(p) {
                var auxHeight = p._parent.items.items[0].getSize().height + p._parent.items.items[0].getSize().height;
                var height = p._parent.getSize().height - p._parent.fpGeneral.getSize().height;
                p.setHeight(height - auxHeight);
                _this.gridPanelClientes.setHeight((height - auxHeight) / 2);
            }
        };
        Ext.erp.confcuadrobasico.superclass.constructor.call(this, config);
    },
    buildUI: function() {
        var _this = this;

        /*this.gridProductos = new Ext.erp.gridProductos({
         idioma: this.idioma,
         title: 'Productos'
         });
         
         this.panelProductos = LOG.util.UIManager.initPanel({
         region: 'center',
         items: [this.gridProductos]
         });
         
         this.gridClientes = new Ext.erp.gridClientes({
         idioma: this.idioma,
         title: 'Clientes'
         });
         
         this.panelClientes = LOG.util.UIManager.initPanel({
         region: 'south',
         items: [this.gridClientes]
         });*/


        _this.panelDerecho = LOG.util.UIManager.initPanel({
            layout: 'border',
            region: 'center',
            items: [_this.buildGridCenter(), _this.buildGridSur()]
        });

        _this.panelGeneral = LOG.util.UIManager.initPanel({
            layout: 'border',
            region: 'center',
            items: [_this.panelDerecho,
                _this.buildPanelIzquierdo()
            ]
        });

        this.title = _this.idioma.lbTlCuadroBasico;
        this.frame = true;
        this.layout = 'border';
        this.activeTab = 0;
        this.layoutOnTabChange = true;
        this.items = [
            LOG.util.UIManager.initPanel({
                layout: 'border',
                region: 'center',
                items: [_this.panelGeneral]
            })
        ];
    },
    buildPanelIzquierdo: function() {
        var _this = this;

        this.listaBotonesCategorias = new LOG.util.List();

        this.listaBotonesCategorias.add(LOG.util.Prototipos.botonAdicionar({
            disabled: true,
            tooltip: _this.idioma.lbTtBtnAdicionarCategoria,
            handler: function() {

                this.ventanaAddCategoria = new Ext.erp.VentanaAddCategoria({
                    idioma: _this.idioma,
                    urlController: _this.urlController,
                    tpEstructuras: _this.tpEstructuras
                });
                this.ventanaAddCategoria.show();

                /*var tfdenominacion = new LOG.util.Prototipos.inputTexto({
                 name: 'adicionarcategoria',
                 fieldLabel: 'Denominaci\xf3n',
                 id: 'iddenominacion',
                 maskRe: /^([a-zA-Z]*|[0-9]*)+\s?([a-zA-Z]*|[0-9]*)+\s?$/,
                 regex: /^([a-zA-Z]*|[0-9]*)+\s?([a-zA-Z]*|[0-9]*)+\s?$/,
                 maxLength: 255,
                 allowBlank: false,
                 enableKeyEvents: true,
                 listeners: {
                 keyup: function(form, e) {
                 if (e.getKey() == 13) {
                 _this.adicionarCategoria();
                 }
                 }
                 }
                 });
                 
                 this.fpPanelSuperior = LOG.util.UIManager.initColumnForm({
                 columnas: 1
                 });
                 
                 this.fpPanelSuperior.addComponent(tfdenominacion);
                 
                 this.fpDatos = LOG.util.UIManager.initForm({
                 items: [this.fpPanelSuperior]
                 });
                 
                 this.panelSuperior = LOG.util.UIManager.initPanel({
                 region: 'center',
                 layout: 'fit',
                 frame: true,
                 items: [this.fpDatos]
                 });
                 
                 winAddCategoria = new Ext.Window({
                 height: 125,
                 width: 400,
                 title: 'Adicionar categoria',
                 modal: true,
                 items: [this.panelSuperior],
                 buttons: [{
                 text: 'Cancelar',
                 tooltip: 'Cancelar',
                 iconCls: 'cancelar',
                 handler: function () {
                 winAddCategoria.close();
                 }
                 }, {
                 tooltip: 'Nuevo',
                 text: 'Nuevo',
                 iconCls: 'nuevo',
                 handler: function () {
                 tfdenominacion.reset();
                 tfdenominacion.setValue("");
                 }
                 }, {
                 tooltip: 'Aceptar',
                 text: 'Aceptar',
                 iconCls: 'aceptar',
                 handler: function () {
                 _this.adicionarCategoria();
                 winAddCategoria.close();
                 }
                 }],
                 listeners: {
                 'show': function () {
                 
                 }
                 }
                 })
                 
                 winAddCategoria.show();
                 winAddCategoria.doLayout();*/
            }
        }));

        this.listaBotonesCategorias.add(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: _this.idioma.lbTtBtnEliminarCategoria,
            handler: function() {
                _this.eliminarCategoria();
            }
        }));

        this.listaBotonesCategorias.add(LOG.util.UIManager.createBtn({
            iconCls: 'heredar',
            text: _this.idioma.lbBtnHeredar,
            disabled: true,
            tooltip: _this.idioma.lbTtBtnHeredarCategoria,
            handler: function() {
                var _heredar = new Ext.erp.VentanaHeredar({
                    _parent: _this
                });
                _heredar.init();
                _this.vistaHeredar = _heredar.view();
                _this.vistaHeredar.show();
            }
        }));

        this.treeLoader = new Ext.tree.TreeLoader({
            dataUrl: '/logistica/distribucion/configuracion/index.php/configuraciondistribucion/cargarArbol',
            listeners: {
                beforeload: function(loader, nodo, fnCallBack) {
                    _this.tpEstructuras.enable();
                },
                load: function(obj, node, response) {
                    _this.storeProducto.removeAll();
                    _this.gpProducto.getView().refresh();
                    _this.storeCliente.removeAll();
                    _this.gpCliente.getView().refresh();
                }
            }
        });

        this.tpEstructuras = new Ext.tree.TreePanel({
            useArrows: true,
            urlController: null,
            border: false,
            bodyBorder: false,
            region: 'center',
            containerRegion: 'west',
            containerCollapsible: true,
            enableDD: true,
            autoScroll: true,
            style: 'margin: 2 2 2 2',
            loader: this.treeLoader,
            frame: true,
            height: 700,
            layout: 'fit',
            bodyStyle: 'background-color: white',
            listeners: {
                'click': function(node, e) {
                    _this.nodoSeleccionadoArbol = node;
                    _this.posicionArbol = _this.nodoSeleccionadoArbol.getDepth();
                    if (_this.posicionArbol == 0) {
                        _this.listaBotonesCategorias.getItem(0).enable();
                        _this.listaBotonesCategorias.getItem(1).disable();
                        _this.listaBotonesCategorias.getItem(2).enable();

                        _this.listaBotonesProductos.getItem(0).disable();
                        _this.listaBotonesProductos.getItem(1).disable();

                        _this.listaBotonesClientes.getItem(0).disable();
                        _this.listaBotonesClientes.getItem(1).disable();

                        _this.storeProducto.removeAll();
                        _this.gpProducto.getView().refresh();
                        _this.storeCliente.removeAll();
                        _this.gpCliente.getView().refresh();

                    } else if (_this.posicionArbol >= 1) {
                        _this.listaBotonesCategorias.getItem(0).disable();
                        _this.listaBotonesCategorias.getItem(1).enable();
                        _this.listaBotonesCategorias.getItem(2).disable();

                        _this.listaBotonesProductos.getItem(0).enable();
                        _this.listaBotonesClientes.getItem(0).enable();

                    } else if (node.id == 0) {
                        _this.listaBotonesCategorias.getItem(0).enable();
                        _this.listaBotonesCategorias.getItem(1).disable();
                        _this.listaBotonesCategorias.getItem(2).enable();

                        _this.listaBotonesProductos.getItem(0).disable();
                        _this.listaBotonesProductos.getItem(1).disable();

                        _this.listaBotonesClientes.getItem(0).disable();
                        _this.listaBotonesClientes.getItem(1).disable();

                        _this.storeProducto.removeAll();
                        _this.gpProducto.getView().refresh();
                        _this.storeCliente.removeAll();
                        _this.gpCliente.getView().refresh();
                    }
                    _this.storeProducto.reload();
                    _this.storeCliente.reload();
                }
            }
        });

        this.nodopadre = new Ext.tree.AsyncTreeNode({
            text: 'Categorias',
            id: '0',
            //iconCls: 'logistica',
            animate: true,
            expanded: true
        });

        this.tpEstructuras.setRootNode(this.nodopadre);

        this.fpCategorias = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesCategorias.getArray()
            }),
            labelAlign: 'top',
            collapsible: true,
            width: 255,
            minSize: 255,
            maxSize: 500,
            collapseMode: 'mini',
            frame: true,
            region: 'west',
            layout: 'border',
            margins: '0 2 0 0',
            title: 'Categorias',
            animCollapse: false,
            animate: false,
            border: true,
            split: true,
            items: [this.tpEstructuras]
                //items: [{region: 'north', tbar: [_this.btnAdicionarCategoria, _this.btnEliminarCategoria, _this.btnHeredar]}, this.tpEstructuras]
        });

        return this.fpCategorias;
    },
    buildGridCenter: function() {
        var _this = this;

        this.listaBotonesProductos = new LOG.util.List();

        this.listaBotonesProductos.add(LOG.util.Prototipos.botonAdicionar({
            disabled: true,
            tooltip: _this.idioma.lbTtBtnAdicionarProducto,
            handler: function() {
                LOG.inv.maestroproductos.Loader.init(function() {
                    var v = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        parametros: {
                            idestructura: null,
                            idseleccionados: Ext.encode(_this.storeProducto.collect('idproducto'))
                        },
                        doAction: function(r) {
                            _this.adicionarProductos(r);
                        }
                    });
                    v.show();
                });
            }
        }));

        this.listaBotonesProductos.add(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: _this.idioma.lbTtBtnEliminarProducto,
            handler: function() {
                _this.eliminarProductos(_this.smGridProducto.getSelections());
            }
        }));

        this.listaColumnasProducto = new LOG.util.List();

        this.listaColumnasProducto.add({
            dataIndex: 'idproducto',
            hidden: true
        });

        this.listaColumnasProducto.add({
            header: 'C\xf3digo',
            width: 120,
            dataIndex: 'codigo',
            default: true
        });

        this.listaColumnasProducto.add({
            header: 'Denominaci\xf3n',
            width: 360,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });

        this.smGridProducto = LOG.util.UIManager.initSelectionModel(3);

        var cls = LOG.util.UIManager.proccessColumns(this.listaColumnasProducto);

        this.cmGridProducto = new Ext.grid.ColumnModel(cls.columns);

        this.recStGridProducto = Ext.data.Record.create(cls.fields);

        this.storeProducto = new Ext.data.Store({
            url: _this.urlController + 'cargarProductos',
            reader: new Ext.data.JsonReader({
                id: 'idproducto',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridProducto)
        });

        this.storeProducto.on({
            'beforeload': function() {
                /*_this.storeProducto.baseParams.denominacion = _this.filterGpProducto.getValue();*/
                _this.storeProducto.initBaseParams.idcategoria = (_this.nodoSeleccionadoArbol.attributes.id) ? _this.nodoSeleccionadoArbol.attributes.id : null;
                /*_this.storeProducto.baseParams.limit = _this.gridPanelProductos.getBottomToolbar().cbPageSize.getValue();*/
            }
        });

        this.storeProducto.fireEvent = this.storeProducto.fireEvent.createSequence(function(e) {
            if (e == 'load') {
                _this.smGridProducto.clearSelections();

                _this.smGridProducto.fireEvent('rowdeselect');
                if (_this.storeProducto.getTotalCount() > 0) {
                    _this.smGridProducto.selectFirstRow();
                }
            }
        });

        this.gpProducto = LOG.util.UIManager.initGrid(this.cmGridProducto, this.storeProducto, this.smGridProducto, {
            expanded: cls.expanded,
            nobbar: false
        });

        this.smGridProducto.fireEvent = this.smGridProducto.fireEvent.createSequence(function(e) {
            if (e == 'rowselect') {
                _this.listaBotonesProductos.getItem(1).enable();
            }
            if (e == 'rowdeselect') {
                _this.listaBotonesProductos.getItem(1).disable();
            }
        });

        LOG.util.UIManager.initFilterGrid(this.gpProducto, 'C\xf3digo y denominaci\xf3n', 'productos');

        this.gridPanelProductos = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesProductos.getArray()
            }),
            layout: 'border',
            border: true,
            region: 'center',
            title: 'Productos',
            items: [this.gpProducto]
        });


        return this.gridPanelProductos;
    },
    buildGridSur: function() {
        var _this = this;


        this.listaBotonesClientes = new LOG.util.List();

        this.listaBotonesClientes.add(LOG.util.Prototipos.botonAdicionar({
            disabled: true,
            tooltip: _this.idioma.lbTtBtnAdicionarCliente,
            handler: function()
            {
                var _clientes = new Ext.erp.VentanaClientes({
                    _parent: _this,
                    parametros: {
                        idseleccionados: Ext.encode(_this.storeCliente.collect('idcliente'))
                    }
                });
                _clientes.init();
                _this.vistaClientes = _clientes.view();
                _this.vistaClientes.show();
            }
        }));

        this.listaBotonesClientes.add(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: _this.idioma.lbTtBtnEliminarCliente,
            handler: function()
            {
                _this.eliminarClientes(_this.smGridCliente.getSelections());
            }
        }));

        this.listaColumnasCliente = new LOG.util.List();

        this.listaColumnasCliente.add({
            dataIndex: 'idcliente',
            hidden: true
        });

        this.listaColumnasCliente.add({
            header: 'C\xf3digo',
            width: 120,
            dataIndex: 'codigo',
            default: true
        });

        this.listaColumnasCliente.add({
            header: 'Denominaci\xf3n',
            width: 360,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
        });

        this.smGridCliente = LOG.util.UIManager.initSelectionModel(3);

        var cls = LOG.util.UIManager.proccessColumns(this.listaColumnasCliente);

        this.cmGridCliente = new Ext.grid.ColumnModel(cls.columns);

        this.recStGridCliente = Ext.data.Record.create(cls.fields);

        this.storeCliente = new Ext.data.Store({
            url: _this.urlController + 'cargarClientes',
            reader: new Ext.data.JsonReader({
                id: 'idcliente',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridCliente)
        });

        this.storeCliente.on({
            'beforeload': function() {
                /*st.baseParams.nombre = _this.filterGpCliente.getValue();*/
                _this.storeCliente.initBaseParams.idcategoria = (_this.nodoSeleccionadoArbol.attributes.id) ? _this.nodoSeleccionadoArbol.attributes.id : null;
                /*st.baseParams.start = 0;
                 st.baseParams.limit = _this.gridPanelClientes.getBottomToolbar().cbPageSize.getValue();*/
            }
        });

        this.storeCliente.fireEvent = this.storeCliente.fireEvent.createSequence(function(e) {
            if (e == 'load') {
                _this.smGridCliente.clearSelections();

                _this.smGridCliente.fireEvent('rowdeselect');
                if (_this.storeCliente.getTotalCount() > 0) {
                    _this.smGridCliente.selectFirstRow();
                }
            }
        });

        this.smGridCliente.fireEvent = this.smGridCliente.fireEvent.createSequence(function(e) {
            if (e == 'rowselect') {
                _this.listaBotonesClientes.getItem(1).enable();
            }
            if (e == 'rowdeselect') {
                _this.listaBotonesClientes.getItem(1).disable();
            }
        });


        this.gpCliente = LOG.util.UIManager.initGrid(this.cmGridCliente, this.storeCliente, this.smGridCliente, {
            expanded: cls.expanded,
            nobbar: false
        });

        LOG.util.UIManager.initFilterGrid(this.gpCliente, 'C\xf3digo y denominaci\xf3n', 'clientes');

        this.gridPanelClientes = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesClientes.getArray()
            }),
            layout: 'border',
            border: true,
            height: 380,
            region: 'south',
            title: 'Clientes',
            items: [this.gpCliente]
        });

        return this.gridPanelClientes;
    },
    createEvents: function() {
        var _this = this;
    },
    eliminarCategoria: function() {
        var _this = this;
        if (_this.tpEstructuras.getSelectionModel().selNode.getDepth() === 1) {
            var obj = {};
            obj.idcategoria = _this.nodoSeleccionadoArbol.attributes.id;
            mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar la categor\xeda seleccionada\x3f', function(btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.wait('Eliminando categor\xeda', 'Espere por favor...');
                    Ext.Ajax.request({
                        url: _this.urlController + 'eliminarCategoria',
                        method: 'post',
                        params: {
                            datos: Ext.encode(obj)
                        },
                        callback: function(o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                mostrarMensaje(1, 'La categor\xeda ha sido eliminada satisfactoriamente.');
                                _this.tpEstructuras.getSelectionModel().getSelectedNode().parentNode.reload();
                                _this.listaBotonesCategorias.getItem(0).disable();
                                _this.listaBotonesCategorias.getItem(1).disable();
                                _this.listaBotonesCategorias.getItem(2).disable();
                            }
                        }
                    });
                }
            });
        }

    },
    adicionarProductos: function(r) {
        var _this = this;
        var _productos = new Array();
        Ext.each(r, function(rec) {
            _productos.push({
                idindicador: rec.get('idindicador')
            });
        });

        Ext.MessageBox.wait('Adicionando producto(s)', 'Espere por favor...');
        Ext.Ajax.request({
            url: _this.urlController + 'adicionarProductos',
            method: 'post',
            params: {
                productos: Ext.encode(_productos),
                idcategoria: Ext.encode(_this.nodoSeleccionadoArbol.attributes.id)
            },
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, 'El(Los) producto(s) ha(n) sido adicionado(s) satisfactoriamente.');
                    _this.storeProducto.reload();
                } else {
                    mostrarMensaje(1, 'El(Los) porducto(s) que desea adicionar ya existe(n).');
                }
            }
        });
    },
    eliminarProductos: function(r) {
        var _this = this;
        var _productos = new Array();
        Ext.each(r, function(rec) {
            _productos.push({
                idcuadrobasicoproducto: rec.data.idcuadrobasicoproducto
            });
        });

        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar el(los) producto(s) seleccionado(s)\x3f', function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait('Eliminando producto(s)', 'Espere por favor...');
                Ext.Ajax.request({
                    url: _this.urlController + 'eliminarProductos',
                    method: 'post',
                    params: {
                        datos: Ext.encode(_productos)
                    },
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, 'El(Los) producto(s) ha(n) sido eliminado(s) satisfactoriamente.');
                            _this.storeProducto.reload();
                        } else {
                            mostrarMensaje(1, 'Ha ocurrido un error al eliminar el(los) producto(s).');
                        }
                    }
                });
            }
        });
    },
    eliminarClientes: function(r) {
        var _this = this;
        var _clientes = new Array();
        Ext.each(r, function(rec) {
            _clientes.push({
                idcuadrobasicocliente: rec.data.idcuadrobasicocliente
            });
        });

        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar el(los) cliente(s) seleccionado(s)\x3f', function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait('Eliminando cliente(s)', 'Espere por favor...');
                Ext.Ajax.request({
                    url: _this.urlController + 'eliminarClientes',
                    method: 'post',
                    params: {
                        datos: Ext.encode(_clientes)
                    },
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, 'El(Los) cliente(s) ha(n) sido eliminado(s) satisfactoriamente.');
                            _this.storeCliente.reload();
                        } else {
                            mostrarMensaje(1, 'Ha ocurrido un error al eliminar el(los) cliente(s).');
                        }
                    }
                });
            }
        });
    }
});

Ext.erp.VentanaAddCategoria = Ext.extend(LOG.util.Window, {
    proceso: false,
    listaBotones: undefined,
    constructor: function(config) {
        config.width = 400;
        config.height = 125;
        config.constrain = true;
        this.autoValidate = true;
        this.validateDefault = true;
        config.resizable = false;
        this.listaBotonesVentana = new LOG.util.List();
        Ext.erp.VentanaAddCategoria.superclass.constructor.call(this, config);
        this.setTitle('Adicionar categor\xeda');
        this.panelDatos();
    },
    panelDatos: function() {
        var _this = this;
        this.tfdenominacion = new LOG.util.Prototipos.inputTexto({
            name: 'adicionarcategoria',
            fieldLabel: 'Denominaci\xf3n',
            id: 'iddenominacion',
            regex: LOG.util.Regex.cadena,
            maxLength: 255,
            msgMaxLengthText: _this.idioma.msgMaxLengthText,
            allowBlank: false,
            enableKeyEvents: true
        });

        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.clsSuperior.addComponent(this.tfdenominacion);

        this.panel = LOG.util.UIManager.initForm({
            frame: true,
            layout: 'form',
            labelAlign: 'top',
            region: 'center',
            items: [this.clsSuperior]
        });
        this.add(this.panel);
    },
    onCloseHandler: function(p) {
        p.destroy();
        return false;
    },
    aceptarFn: function() {
        var _this = this;
        var cerrar = true;
        var scope = (_this.scope) ? _this.scope : _this;
        if (scope.panel.getForm().isValid()) {
            var obj = {};
            obj.denominacion = scope.tfdenominacion.getValue();
            Ext.MessageBox.wait('Adicionando categor\xeda', 'Espere por favor...');
            Ext.Ajax.request({
                url: scope.urlController + 'adicionarCategoria',
                method: 'post',
                params: {
                    datos: Ext.encode(obj)
                },
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        mostrarMensaje(1, 'La categor\xeda ha sido adicionada satisfactoriamente.');
                        scope.loadNode();
                    } else {
                        mostrarMensaje(1, 'La categor\xeda que desea adicionar ya existe.');
                    }
                }
            });
        } else {
            mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
        }
    },
    loadNode: function() {
        var _this = this;
        if (_this.tpEstructuras.getRootNode().isExpanded()) {
            _this.tpEstructuras.getLoader().load(_this.tpEstructuras.getRootNode(), function() {
                _this.tpEstructuras.getRootNode().collapse();
                _this.tpEstructuras.getRootNode().expand();
            });
        } else {
            _this.tpEstructuras.getRootNode().expand();
        }
    }
});

Ext.erp.Clientes = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.concepto= 'clientes';
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.urlBusquedaGridPrincipal = '/logistica/distribucion/configuracion/index.php/configuraciondistribucion/cargarTodosClientes';
        Ext.erp.Clientes.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: 'C\xf3digo',
            width: 120,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: 'Denominaci\xf3n',
            width: 220,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({
            dataIndex: 'idclientesproveedores'
        });
    },
    init: function() {
        var _this = this;
        Ext.erp.Clientes.superclass.init.call(this);
        this.getVistaPrincipal().setTitle('Adicionar clientes');
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;

        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function() {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function() {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        mostrarMensaje(1, 'Debe seleccionar un cliente para realizar esta operaci\xf3n');
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections()]).call();
                }
            }
        });
    },
    render: function() {
        var _this = this;
        var _res = LOG.dist.distribucion.Clientes.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                _this.habilitarBotones();
            }
        });
        this.getStorePrincipal().on({
            beforeload: function () {
                console.info(_this.parametros)
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);

            }
        });
        return _res;
    },
    habilitarBotones: function() {
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function() {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});

Ext.erp.VentanaClientes = Ext.extend(Ext.erp.Clientes, {
    _parent: undefined,
    constructor: function(config) {
        Ext.erp.VentanaClientes.superclass.constructor.call(this, config);
        this.autoLoad = false;
    },
    doAction: function(r) {
        var _this = this;
        var _clientes = new Array();

        Ext.each(r, function(rec) {
            _clientes.push({
                idcliente: rec.get('idclientesproveedores')
            });
        });

        Ext.MessageBox.wait('Adicionando cliente(s)', 'Espere por favor...');
        Ext.Ajax.request({
            url: _this._parent.urlController + 'adicionarClientes',
            method: 'post',
            params: {
                clientes: Ext.encode(_clientes),
                idcategoria: Ext.encode(_this._parent.nodoSeleccionadoArbol.attributes.id)
            },
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, 'El(Los) cliente(s) ha(n) sido adicionado(s) satisfactoriamente.');
                    _this._parent.storeCliente.reload();
                } else {
                    mostrarMensaje(1, 'El(Los) clientes(s) que desea adicionar ya existe(n).');
                }
            }
        });
    }
});

Ext.erp.Heredar = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.urlBusquedaGridPrincipal = '/logistica/distribucion/configuracion/index.php/configuraciondistribucion/cargarCategorias';
        Ext.erp.Heredar.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: 'Categor\xedas',
            width: 420,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({
            dataIndex: 'idcategoria'
        });
    },
    init: function() {
        var _this = this;
        Ext.erp.Clientes.superclass.init.call(this);
        this.getVistaPrincipal().setTitle('Heredar categor\xeda');
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;

        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function() {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function() {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        mostrarMensaje(1, 'Debe seleccionar una categor\xeda para realizar esta operaci\xf3n.');
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections()]).call();
                }
            }
        });

        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            title: 'Listado de categorias'
        });
    },
    render: function() {
        var _this = this;
        var _res = LOG.dist.distribucion.Clientes.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                _this.habilitarBotones();
            }
        });
        return _res;
    },
    habilitarBotones: function() {
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function() {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});

Ext.erp.VentanaHeredar = Ext.extend(Ext.erp.Heredar, {
    _parent: undefined,
    constructor: function(config) {
        Ext.erp.VentanaHeredar.superclass.constructor.call(this, config);
        this.autoLoad = false;
    },
    doAction: function(r) {
        var _this = this;
        var _categorias = new Array();

        Ext.each(r, function(rec) {
            _categorias.push({
                denominacion: rec.data.denominacion
            });
        });

        Ext.MessageBox.wait('Heredando categor\xeda(s)', 'Espere por favor...');
        Ext.Ajax.request({
            url: _this._parent.urlController + 'heredarCategoria',
            method: 'post',
            params: {
                datos: Ext.encode(_categorias)
            },
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, 'La(Las) categor\xeda(s) ha(n) sido adicionada(s) satisfactoriamente.');
                    _this.loadNode();
                } else {
                    mostrarMensaje(1, 'La(s) categor\xeda(s) que desea adicionar ya existe(n).');
                }
            }
        });
    },
    loadNode: function () {
        var _this = this._parent;
        if (_this.tpEstructuras.getRootNode().isExpanded()) {
            _this.tpEstructuras.getLoader().load(_this.tpEstructuras.getRootNode(), function () {
                _this.tpEstructuras.getRootNode().collapse();
                _this.tpEstructuras.getRootNode().expand();
            });
        } else {
            _this.tpEstructuras.getRootNode().expand();
        }
    }
});
