/**
 * Fichero que contiene el objeto TreePanel para gestionar las categorías y causas.
 * 
 * @author ohgonzalez 
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.CausaefectoTreePanel = ExtExtend.Class({
    $extend: Ext.tree.TreePanel,
    region: 'center',
    autoScroll: true,
    rootVisible: false,
    lines: false,
    useArrows: true,
    initComponent: function() {
        var _this = this;

        _this.init = true;

        // title
        _this.title = _this.idioma.titleTreePanel;

        // rootNode        
        _this.root = new Ext.tree.AsyncTreeNode({
            type: 'root',
            expanded: true
        });
        // loaderTree
        _this.loader = new Ext.tree.TreeLoader({
            dataUrl: Planificacion.Integracion.UrlModulo + 'causaefecto/cargarArbolCausaEfecto'
        });

        /*
         *  Eventos asociados al tree
         */

        // beforeload
        _this.loader.on('beforeload', function(treeLoader, node) {
            _this.beforeloadTreeLoader(treeLoader, node);
        }, _this);

        // load
        _this.loader.on('load', function(obj, node, response) {
            _this.loadTreeLoader(obj, node, response);
        });

        // append
        _this.on('append', function(tree, parent, node, index) {
            _this.appendTreePanel(tree, parent, node, index);
        });

        // contextmenu
        _this.on('contextmenu', function(node, e) {
            _this.contextmenuTreePanel(node, e);
        });

        // click
        _this.on('click', function(node, e) {
            if (node.attributes.type === 'categoria' || node.attributes.type === 'causa') {
                _this.instanceFormPanel.checkListarCausa = false;
            }
            _this.clickTreePanel(node, '');
        });

        Planificacion.Integracion.CausaefectoTreePanel.superclass.initComponent.call(Ext.apply(_this, arguments));
    },
    beforeloadTreeLoader: function(treeLoader, node) {
        var _this = this;
        var type = node.attributes.type;
        if (type === 'root') {
            treeLoader.baseParams.type = 'root';
            treeLoader.baseParams.objeto = Ext.encode({idproyecto: _this.idproyecto});
        } else if (type === 'causa') {
            treeLoader.baseParams.type = 'causa';
            treeLoader.baseParams.objeto = Ext.encode({idcausa: node.attributes.idcausa});
        }
        Secodena.mostrarMascara('loadTreePanel', '', '');
    },
    loadTreeLoader: function(obj, node, resp) {
        var _this = this;

        if (resp.statusText === "OK") {

            var response = Ext.decode(resp.responseText);
            var type = node.attributes.type;

            if (type === 'root') {

                _this.objDatEfecto = new DatEfecto();
                _this.objDatEfecto.set(((response[0]) ? response[0] : response));

                var childNodes = node.childNodes;
                var nodeEfecto = childNodes[0];

                nodeEfecto.expand();

                if (_this.init) {
                    _this.clickTreePanel(nodeEfecto, '');
                    _this.init = false;
                }

            }

        }

        Secodena.ocultarMascara('loadTreePanel');
    },
    appendTreePanel: function(tree, parent, node, index) {
        node.text = node.attributes.denominacion;
        var type = parent.attributes.type;

        switch (type) {
            case 'root':
                {
                    node.attributes.type = 'efecto';
                    node.attributes.iconCls = 'efecto';
                    break;
                }
            case 'efecto':
                {
                    node.attributes.type = 'categoria';
                    node.attributes.iconCls = 'categoria';
                    break;
                }
            case 'categoria':
                {
                    node.attributes.type = 'causa';
                    node.attributes.iconCls = 'causa';
                    break;
                }
            case 'causa':
                {
                    node.attributes.type = 'causa';
                    node.attributes.iconCls = 'causa';
                    break;
                }
        }
    },
    contextmenuTreePanel: function(node, event) {
        var _this = this;

        var menu = new Ext.menu.Menu({
            items: [
                new Ext.menu.Item({
                    iconCls: 'extExtend_adicionar',
                    type: 'adicionar'
                }),
                new Ext.menu.Item({
                    iconCls: 'extExtend_modificar',
                    type: 'modificar'
                }),
                new Ext.menu.Item({
                    iconCls: 'extExtend_eliminar',
                    type: 'eliminar'
                })
            ],
            listeners: {
                click: function(menu, item, e) {
                    _this.createAddModWindow(node, item);
                }
            }
        });

        var type = node.attributes.type;

        switch (type) {
            case 'efecto':
                {
                    menu.items.items[0].setText(_this.idioma.textAdicionarCategoria);
                    menu.items.items[1].setText(_this.idioma.textModificarEfecto);
                    menu.items.items[2].setVisible(false);
                    break;
                }
            case 'categoria':
                {
                    menu.items.items[0].setText(_this.idioma.textAdicionarCausa);
                    menu.items.items[1].setText(_this.idioma.textModificarCategoria);
                    menu.items.items[2].setText(_this.idioma.textEliminarCategoria);
                    break;
                }
            case 'causa':
                {
                    menu.items.items[0].setText(_this.idioma.textAdicionarCausa);
                    menu.items.items[1].setText(_this.idioma.textModificarCausa);
                    menu.items.items[2].setText(_this.idioma.textEliminarCausa);
                    break;
                }
        }

        menu.showAt(event.getXY());
    },
    createAddModWindow: function(node, item) {
        var _this = this;

        var fieldDenom = new _this.extendCmp.fields.fieldDenom({
            anchor: '100%'
        });

        var fieldDescripcion = new _this.extendCmp.fields.fieldDescripcion({
            anchor: '100%',
            height: 130
        });

        var addModPanel = new Ext.Panel({
            region: 'center',
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            border: false
        });

        var addModWindow = new _this.extendCmp.containers.windows.addModWindow({
            layout: 'border',
            resizable: false,
            modal: true,
            width: 350,
            height: 280,
            constrain: true,
            listeners: {
                 show: function(win) {                    
                    var fpanel = win.items.get(0);                    
                    win.formValidator = new ExtExtend.FormValidator({
                        buttons: win.vipButtons,
                        fields: fpanel.items.items
                    });
                }
            }
        });

        var type = node.attributes.type;

        var action = item.type;

        var arrBtn = addModWindow.buttons;

        var btnCancelar = arrBtn[0];

        var btnAplicar = arrBtn[1];

        var btnAceptar = arrBtn[2];

        var instanceFormPanel = _this.instanceFormPanel;
        var container = instanceFormPanel.items.items[0];
        var xtype = container.layout.activeItem.getXType();

        var gridPanel = container.items.items[0];

        switch (type) {

            case 'efecto':
                {
                    var objEfecto = _this.objDatEfecto.get();

                    if (action === 'modificar') {

                        fieldDenom.fieldLabel = _this.idioma.textDenomEfecto;
                        fieldDenom.setValue(objEfecto.denominacion);
                        addModPanel.add(fieldDenom);

                        fieldDescripcion.fieldLabel = _this.idioma.textDescripEfecto;
                        fieldDescripcion.setValue(objEfecto.descripcion);
                        addModPanel.add(fieldDescripcion);

                        addModWindow.add(addModPanel);

                        addModWindow.buttons = [btnCancelar, btnAceptar];

                        addModWindow.setTitle(_this.idioma.textModificarEfecto);

                    } else if (action === 'adicionar') {

                        fieldDenom.fieldLabel = _this.idioma.textDenomCategoria;
                        addModPanel.add(fieldDenom);

                        addModWindow.add(addModPanel);

                        addModWindow.buttons = [btnCancelar, btnAplicar, btnAceptar];

                        addModWindow.height = 125;

                        addModWindow.setTitle(_this.idioma.textAdicionarCategoria);
                    }

                    btnAceptar.handler = function() {
                        _this.handlerButton('aceptar', type, action, node, this);
                    };

                    btnAceptar.enable();

                    btnAplicar.handler = function() {
                        _this.handlerButton('aplicar', type, action, node, this);
                    };

                    btnAplicar.enable();

                    addModWindow.show();

                    break;
                }
            case 'categoria':
                {
                    var objDatCategoria = new DatCategoria();
                    objDatCategoria.set((node.attributes));

                    var objCategoria = objDatCategoria.get();

                    if (action === 'eliminar') {

                        if (!node.attributes.leaf) {
                            mostrarMensaje(1, _this.idioma.msgCategoriaEnUso, function() {
                            }, '');

                        } else {

                            mostrarMensaje(2, _this.idioma.confirmEliminarCategoria, function(btn) {
                                if (btn === 'ok') {

                                    objDatCategoria.on('objetoeliminado', function(obj, resp) {
                                        if (resp) {
                                            var rootNode = _this.getRootNode();

                                            _this.getLoader().load(rootNode);

                                            if (xtype === 'Planificacion.Integracion.CausaefectoGridPanel') {

                                                gridPanel.getStore().load({
                                                    params: {
                                                        start: 0,
                                                        limit: 18,
                                                        objeto: Ext.encode(_this.objDatEfecto.get())
                                                    },
                                                    callback: function() {
                                                        mostrarMensaje(1, _this.idioma.msgEliminarCategoria, function() {
                                                        });
                                                    }
                                                });

                                            } else {

                                                var selModel = _this.getSelectionModel();
                                                var nodeSelect = selModel.getSelectedNode();

                                                if (nodeSelect !== null && nodeSelect.attributes.idcategoria === node.attributes.idcategoria) {

                                                    _this.clickTreePanel(nodeSelect, _this.idioma.msgEliminarCategoria);

                                                } else {
                                                    mostrarMensaje(1, _this.idioma.msgEliminarCategoria, function() {
                                                    });
                                                }

                                            }

                                        }
                                        Secodena.ocultarMascara('eliminarCategoria');
                                    });

                                    if (objDatCategoria.isValid()) {

                                        mostrarMensaje(1, _this.idioma.msgEliminarCategoria, function() {
                                        });

                                        this.close();

                                        objDatCategoria.eliminar();

                                    }

                                } else {
                                    this.close();
                                }
                            });

                        }

                    } else if (action === 'modificar') {

                        fieldDenom.fieldLabel = _this.idioma.textDenomCategoria;
                        fieldDenom.setValue(objCategoria.denominacion);
                        addModPanel.add(fieldDenom);

                        addModWindow.add(addModPanel);

                        addModWindow.buttons = [btnCancelar, btnAceptar];

                        addModWindow.height = 125;

                        addModWindow.setTitle(_this.idioma.textModificarCategoria);

                        btnAceptar.handler = function() {
                            _this.handlerButton('aceptar', type, action, node, this);
                        };

                        btnAceptar.enable();

                        addModWindow.show();

                    } else if (action === 'adicionar') {

                        fieldDenom.fieldLabel = _this.idioma.textDenomCausa;
                        addModPanel.add(fieldDenom);

                        addModWindow.add(addModPanel);

                        addModWindow.buttons = [btnCancelar, btnAplicar, btnAceptar];

                        addModWindow.height = 125;

                        addModWindow.setTitle(_this.idioma.textAdicionarCausa);

                        btnAceptar.handler = function() {
                            _this.handlerButton('aceptar', type, action, node, this);
                        };

                        btnAceptar.enable();

                        btnAplicar.handler = function() {
                            _this.handlerButton('aplicar', type, action, node, this);
                        };

                        btnAplicar.enable();

                        addModWindow.show();

                    }

                    break;
                }
            case 'causa':
                {
                    var objDatCausa = new DatCausa();
                    objDatCausa.set((node.attributes));

                    var objCausa = objDatCausa.get();

                    if (action === 'adicionar') {

                        fieldDenom.fieldLabel = _this.idioma.textDenomCausa;
                        addModPanel.add(fieldDenom);

                        addModWindow.add(addModPanel);

                        addModWindow.buttons = [btnCancelar, btnAplicar, btnAceptar];

                        addModWindow.height = 125;

                        addModWindow.setTitle(_this.idioma.textAdicionarCausa);

                        btnAceptar.handler = function() {
                            _this.handlerButton('aceptar', type, action, node, this);
                        };

                        btnAceptar.enable();

                        btnAplicar.handler = function() {
                            _this.handlerButton('aplicar', type, action, node, this);
                        };

                        btnAplicar.enable();

                        addModWindow.show();

                    } else if (action === 'modificar') {

                        fieldDenom.fieldLabel = _this.idioma.textDenomCausa;
                        fieldDenom.setValue(objCausa.denominacion);
                        addModPanel.add(fieldDenom);

                        addModWindow.add(addModPanel);

                        addModWindow.buttons = [btnCancelar, btnAceptar];

                        addModWindow.height = 125;

                        addModWindow.setTitle(_this.idioma.textModificarCausa);

                        btnAceptar.handler = function() {
                            _this.handlerButton('aceptar', type, action, node, this);
                        };

                        btnAceptar.enable();

                        addModWindow.show();

                    } else if (action === 'eliminar') {

                        if (objDatCausa.isValid()) {

                            if (!node.attributes.leaf) {

                                mostrarMensaje(1, _this.idioma.msgCausaEnUso, function() {
                                }, '');

                            } else {

                                mostrarMensaje(2, _this.idioma.confirmEliminarCausa, function(btn) {
                                    if (btn === 'ok') {

                                        objDatCausa.on('objetoeliminado', function(obj, resp) {
                                            if (resp) {

                                                var rootNode = _this.getRootNode();

                                                _this.getLoader().load(rootNode);

                                                if (xtype === 'Planificacion.Integracion.CausaefectoTreeColumn') {

                                                    var selModel = _this.getSelectionModel();
                                                    var nodeSelect = selModel.getSelectedNode();

                                                    if (instanceFormPanel.checkListarCausa) {

                                                        _this.instanceParent.handlerListarCausa(_this.idioma.msgEliminarCausa);

                                                    } else {

                                                        if (nodeSelect !== null && nodeSelect.attributes.idcategoria === node.attributes.idcategoria) {

                                                            _this.clickTreePanel(nodeSelect, _this.idioma.msgEliminarCausa);

                                                        } else {

                                                            mostrarMensaje(1, _this.idioma.msgEliminarCausa, function() {
                                                            });

                                                        }

                                                    }

                                                } else {

                                                    mostrarMensaje(1, _this.idioma.msgEliminarCausa, function() {
                                                    });
                                                }

                                            }
                                            Secodena.ocultarMascara('eliminarCausa');
                                        });

                                        Secodena.mostrarMascara('eliminarCausa', '', _this.idioma.msgEliminandoCausa);

                                        this.close();

                                        objDatCausa.eliminar();

                                    } else {
                                        this.close();
                                    }
                                });

                            }
                        }

                    }

                    break;
                }
        } 

    },
    handlerButton: function(btn, type, action, node, cmp) {
        var _this = this;

        var treeloader = _this.getLoader();
        var rootNode = _this.getRootNode();

        var addModWindow = cmp.ownerCt;
        var addModPanel = addModWindow.items.items[0];

        var fieldDenom = addModPanel.items.items[0];
        var fieldDescripcion = addModPanel.items.items[1];

        var instanceFormPanel = _this.instanceFormPanel;
        var container = instanceFormPanel.items.items[0];
        var xtype = container.layout.activeItem.getXType();

        var gridPanel = container.items.items[0];

        if (btn === 'aceptar' || btn === 'aplicar') {

            switch (type) {

                case 'efecto':
                    {
                        var objEfecto = _this.objDatEfecto.get();

                        if (action === 'modificar') {

                            _this.objDatEfecto.on('objetoguardado', function(obj, response) {

                                Secodena.ocultarMascara('updateEfecto');

                                treeloader.load(rootNode, function() {
                                    mostrarMensaje(1, _this.idioma.msgModificarEfecto, function() {
                                    });
                                });

                            });

                            if (_this.objDatEfecto.isValid()) {

                                Secodena.mostrarMascara('updateEfecto', '', _this.idioma.msgModificandoEfecto);

                                _this.objDatEfecto.set('denominacion', fieldDenom.getValue());
                                _this.objDatEfecto.set('descripcion', fieldDescripcion.getValue());

                                addModWindow.close();

                                _this.objDatEfecto.update();

                            }

                        } else if (action === 'adicionar') {

                            var objDatCategoria = new DatCategoria();

                            objDatCategoria.set('idefecto', objEfecto.idefecto);
                            objDatCategoria.set('denominacion', fieldDenom.getValue());

                            objDatCategoria.on('objetoguardado', function(obj, response) {

                                if (btn === 'aceptar') {
                                    addModWindow.close();
                                }

                                treeloader.load(rootNode);

                                gridPanel.getStore().load({
                                    params: {
                                        start: 0,
                                        limit: 18,
                                        objeto: Ext.encode(_this.objDatEfecto.get())
                                    },
                                    callback: function() {
                                        //Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', _this.idioma.msgAdicionarCategoria, 1);
                                        mostrarMensaje(1, _this.idioma.msgAdicionarCategoria, function() {
                                        });

                                        if (btn === 'aplicar') {
                                            fieldDenom.reset();
                                        }
                                    }
                                });

                                Secodena.ocultarMascara('saveCategoria');

                            });

                            objDatCategoria.on('errorguardar', function(obj, response) {
                                Secodena.ocultarMascara('saveCategoria');
                                //Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', response.mensaje, response.cod);
                                mostrarMensaje(1, response.mensaje, function() {
                                })
                            });

                            if (objDatCategoria.isValidWithOutPK()) {

                                Secodena.mostrarMascara('saveCategoria', '', _this.idioma.msgAdicionandoCategoria);

                                objDatCategoria.save();

                            }

                        }

                        break;
                    }

                case 'categoria':
                    {

                        var objModDatCategoria = new DatCategoria();
                        objModDatCategoria.set((node.attributes));

                        var objCategoria = objModDatCategoria.get();

                        if (action === 'modificar') {

                            objModDatCategoria.set('denominacion', fieldDenom.getValue());

                            objModDatCategoria.on('objetoguardado', function(obj, response) {

                                Secodena.ocultarMascara('updateCategoria');

                                if (response.cod) {

                                    mostrarMensaje(1, response.mensaje, function() {
                                    });

                                } else {

                                    addModWindow.close();

                                    treeloader.load(rootNode);

                                    if (xtype === 'Planificacion.Integracion.CausaefectoGridPanel') {

                                        gridPanel.getStore().load({
                                            params: {
                                                start: 0,
                                                limit: 18,
                                                objeto: Ext.encode(_this.objDatEfecto.get())
                                            },
                                            callback: function() {
                                                mostrarMensaje(1, _this.idioma.msgModificarCategoria, function() {
                                                });
                                            }
                                        });

                                    } else {
                                        mostrarMensaje(1, _this.idioma.msgModificarCategoria, function() {
                                        });
                                    }
                                }

                            });

                            objModDatCategoria.on('errorguardar', function(obj, response) {
                                Secodena.ocultarMascara('updateCategoria');
                                mostrarMensaje(1, response.mensaje, function() {
                                });
                            });

                            if (objModDatCategoria.isValid()) {

                                Secodena.mostrarMascara('updateCategoria', '', _this.idioma.msgModificandoCategoria);

                                objModDatCategoria.update();

                            }

                        } else if (action === 'adicionar') {

                            var objDatCausa = new DatCausa();

                            objDatCausa.on('objetoguardado', function() {
                                if (btn === 'aceptar') {
                                    addModWindow.close();
                                }

                                treeloader.load(rootNode);

                                if (xtype === 'Planificacion.Integracion.CausaefectoTreeColumn') {

                                    if (instanceFormPanel.checkListarCausa) {

                                        _this.instanceParent.handlerListarCausa(_this.idioma.msgAdicionarCausa);

                                    } else {

                                        var selModel = _this.getSelectionModel();
                                        var nodeSelect = selModel.getSelectedNode();

                                        if (nodeSelect !== null && nodeSelect.attributes.idcategoria === node.attributes.idcategoria) {

                                            _this.clickTreePanel(nodeSelect, _this.idioma.msgAdicionarCausa);

                                        } else {

                                            //Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', _this.idioma.msgAdicionarCausa, 1);
                                            mostrarMensaje(1, _this.idioma.msgAdicionarCausa, function() {
                                            });

                                        }

                                    }

                                } else {

                                    //Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', _this.idioma.msgAdicionarCausa, 1);
                                    mostrarMensaje(1, _this.idioma.msgAdicionarCausa, function() {
                                    });

                                }

                                if (btn === 'aplicar') {
                                    fieldDenom.reset();
                                }

                                Secodena.ocultarMascara('saveCausa');
                            });

                            objDatCausa.on('errorguardar', function(obj, response) {
                                mostrarMensaje(3, response.mensaje, function() {
                                });
                                Secodena.ocultarMascara('saveCausa');
                            });

                            objDatCausa.set('idcategoria', objCategoria.idcategoria);
                            objDatCausa.set('denominacion', fieldDenom.getValue());

                            if (objDatCausa.isValidWithOutPK()) {

                                Secodena.mostrarMascara('saveCausa', '', '');

                                objDatCausa.save();

                            }

                        }

                        break;
                    }

                case 'causa':
                    {

                        if (action === 'adicionar') {

                            var objDatCausaPadre = new DatCausa();
                            objDatCausaPadre.set((node.attributes));

                            var objCausaPadre = objDatCausaPadre.get();

                            var objDatCausaAdd = new DatCausa();
                            objDatCausaAdd.set('idpadre', objCausaPadre.idcausa);
                            objDatCausaAdd.set('idcategoria', objCausaPadre.idcategoria);
                            objDatCausaAdd.set('denominacion', fieldDenom.getValue());

                            objDatCausaAdd.on('objetoguardado', function(obj, resp) {
                                if (btn === 'aceptar') {
                                    addModWindow.close();
                                }

                                treeloader.load(rootNode);

                                if (xtype === 'Planificacion.Integracion.CausaefectoTreeColumn') {

                                    if (instanceFormPanel.checkListarCausa) {

                                        _this.instanceParent.handlerListarCausa(_this.idioma.msgAdicionarCausa);

                                    } else {

                                        var selModel = _this.getSelectionModel();
                                        var nodeSelect = selModel.getSelectedNode();

                                        if (nodeSelect !== null && nodeSelect.attributes.idcategoria === node.attributes.idcategoria) {

                                            _this.clickTreePanel(nodeSelect, _this.idioma.msgAdicionarCausa);

                                        } else {

                                            Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', _this.idioma.msgAdicionarCausa, 1);

                                        }

                                    }

                                } else {

                                    Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', _this.idioma.msgAdicionarCausa, 1);

                                }

                                if (btn === 'aplicar') {
                                    fieldDenom.reset();
                                }

                                Secodena.ocultarMascara('saveCausa');
                            });

                            objDatCausaAdd.on('errorguardar', function(obj, response) {
                                mostrarMensaje(3, response.mensaje, function() {
                                });
                                Secodena.ocultarMascara('saveCausa');
                            });

                            if (objDatCausaAdd.isValidWithOutPK()) {

                                Secodena.mostrarMascara('saveCausa', '', _this.idioma.msgAdicionandoCausa);

                                objDatCausaAdd.save();

                            }

                        } else if (action === 'modificar') {

                            var objDatCausaMod = new DatCausa();
                            objDatCausaMod.set((node.attributes));

                            objDatCausaMod.on('objetoguardado', function(obj, response) {

                                if (btn === 'aceptar') {
                                    addModWindow.close();
                                }

                                if (response.cod) {

                                    mostrarMensaje(1, response.mensaje, function() {
                                    });

                                } else {

                                    treeloader.load(rootNode);

                                    if (xtype === 'Planificacion.Integracion.CausaefectoTreeColumn') {

                                        if (instanceFormPanel.checkListarCausa) {

                                            _this.instanceParent.handlerListarCausa(_this.idioma.msgModificarCausa);

                                        } else {

                                            var selModel = _this.getSelectionModel();
                                            var nodeSelect = selModel.getSelectedNode();

                                            if (nodeSelect !== null && nodeSelect.attributes.idcategoria === node.attributes.idcategoria) {

                                                _this.clickTreePanel(nodeSelect, _this.idioma.msgModificarCausa);

                                            } else {

                                                mostrarMensaje(1, _this.idioma.msgModificarCausa, function() {
                                                });

                                            }

                                        }

                                    } else {

                                        mostrarMensaje(1, _this.idioma.msgModificarCausa, function() {
                                        });

                                    }

                                }

                                Secodena.ocultarMascara('updateCausa');

                            });

                            objDatCausaMod.on('errorguardar', function(obj, response) {
                                mostrarMensaje(3, response.mensaje, function() {
                                });
                                Secodena.ocultarMascara('saveCausa');
                            });

                            objDatCausaMod.set('denominacion', fieldDenom.getValue());

                            if (objDatCausaMod.isValid()) {

                                Secodena.mostrarMascara('updateCausa', '', _this.idioma.msgModificandoCausa);

                                objDatCausaMod.update();

                            }

                        }

                        break;
                    }
            }
        }
    },
    clickTreePanel: function(node, msg) {
        var _this = this;
        var type = node.attributes.type;

        var instanceFormPanel = _this.instanceFormPanel;
        var container = instanceFormPanel.items.items[0];

        var gridPanel = container.items.items[0];

        var tbar = instanceFormPanel.getTopToolbar();

        tbar.items.items[0].enable();

        tbar.items.items[1].disable();
        tbar.items.items[2].disable();

        switch (type) {
            case 'efecto':
                {
                    container.layout.setActiveItem(gridPanel.getId());

                    var store = gridPanel.getStore();
                    store.load({
                        params: {
                            start: 0,
                            limit: 18,
                            objeto: Ext.encode(_this.objDatEfecto.get())
                        }
                    });

                    break;
                }
            case 'categoria':
                {
                    Secodena.mostrarMascara('cargarArbolCategoria', '', 'Cargando causas ...');

                    var type = 'categoria';
                    var idcategoria = node.attributes.idcategoria;

                    _this.controller._insertItem('causaefectoTreePanel', _this);
                    _this.controller.cargarArbolCausa(type, idcategoria, null, msg);

                    break;
                }
            case 'causa':
                {
                    Secodena.mostrarMascara('cargarArbolCategoria', '', '');

                    var type = 'causa';
                    var idcategoria = node.attributes.idcategoria;
                    var idcausa = node.attributes.idcausa;

                    _this.controller._insertItem('causaefectoTreePanel', _this);
                    _this.controller.cargarArbolCausa(type, idcategoria, idcausa, msg);

                    break;
                }
        }
    },
    cargarArbolCausa: function(data, type, idcausa) {
        var _this = this;
        var tabPanel = _this.instanceParent;
        tabPanel.listarCausas([data], type, idcausa);
    }
});
Ext.reg('Planificacion.Integracion.CausaefectoTreePanel', Planificacion.Integracion.CausaefectoTreePanel);
