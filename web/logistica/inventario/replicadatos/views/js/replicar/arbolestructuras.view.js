Ext.ns('LOG.inv.replicar');
LOG.inv.replicar.ArbolEstructuras = Ext.extend(Ext.tree.TreePanel, {
    useArrows: true,
    autoScroll: true,
    border: false,
    bodyBorder: false,
    region: 'center',
    containerRegion: 'west',
    containerCollapsible: true,
    containerScroll: true,
    isService: false,
    baseParams: null,
    seleccionados : null,
    parentUI: undefined,
    constructor: function(config) {
        var _this = this;
        this.idioma = config.idioma;
        var urlControlador = '/logistica/inventario/replicadatos/index.php/replicardatos';
        urlControlador += '/';
        this.baseParams = config.baseParams || {};
        this.loader = new Ext.tree.TreeLoader({
            url: urlControlador + 'cargarEstructuras',
            baseParams: this.baseParams
        });
        this.loader.on({
            load: function(_l, _n, _r) {
                var response = Ext.decode(_r.responseText);
                if (response.length == 0) {
                    mostrarMensaje(1, _this.tfBusqueda.isDirty() ? LOG.util.Idioma.msgNoResultados : LOG.util.Idioma.msgNoMostrarResultados);
                }
            }
        });
        this.seleccionados = new LOG.util.List();
        LOG.inv.replicar.ArbolEstructuras.superclass.constructor.call(this, config);
        this.on({
            checkchange: function(node, checked, padre) {
//                if (!padre) {
                    node.eachChild(function(rec) {
                        rec.getUI().toggleCheck(checked);
                        _this.seleccionarNodo(node, checked);
                    });
                    _this.seleccionarNodo(node, checked);
//                }
//                _this.checkPadre(node);
            }
        });
    },
    seleccionarNodo: function(nodo, seleccion) {
        if (seleccion == true) {
            var esta = false;
            this.seleccionados.each(function(s) {
                if (s == nodo.id) {
                    esta = true;
                    return;
                }
            });
            if (esta == false) {
                this.seleccionados.add(nodo.id);
            }
        } else {
            var pos = -1;
            this.seleccionados.each(function(s, posNode) {
                if (s != nodo.id) {
                    pos = posNode;
                    return;
                }
            });
            if (pos != -1) {
                this.seleccionados.delete(pos);
            }
        }
    },
    checkPadre: function(nodo) {
        if (nodo.parentNode && nodo.parentNode.id != 0) {
            var cant = 0;
            nodo.parentNode.eachChild(function(n) {
                if (n.getUI().isChecked()) {
                    cant++;
                }
            });
            var checked = cant == nodo.parentNode.childNodes.length;
            nodo = nodo.parentNode;
            nodo.getUI().checkbox.checked = checked;
            nodo.getUI().checkbox.defaultChecked = checked;
            nodo.getUI().node.attributes.checked = checked;
            this.fireEvent('checkchange', nodo, checked, true);
            this.seleccionarNodo(nodo, checked);
        }
    },
    unCheckAll: function() {
        Ext.each(this.getChecked(), function(n) {
            n.getUI().toggleCheck(false);
        });
    },
    dameSeleccion : function(){
        return this.seleccionados.getArray();
    },
    removerSeleccion : function(){
        this.seleccionados.deleteAll();
    },
    initComponent: function() {
        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            text: 'Estructuras',
            iconCls: 'historial',
            expanded: false,
            animate: false,
            leaf: false
        });
        this.tfBusqueda = LOG.util.Prototipos.inputTexto({
            name: 'treeSearch',
            width: this.isService ? 150 : 200
        });
        this.busquedaTbar = [this.tfBusqueda, '', LOG.util.Prototipos.botonBuscar({
                tooltip: 'Buscar estructuras',
                handler: this.onTreeSearch,
                scope: this,
                text: this.isService ? '' : ' '
            }),
            LOG.util.Prototipos.botonLimpiar({
                handler: this.onTreeClear,
                scope: this,
                text: this.isService ? '' : ' '
            })];
        this.on({
            'click': this.onClickNode
        });
        LOG.inv.replicar.ArbolEstructuras.superclass.initComponent.call(this);
    },
    onTreeSearch: function() {
        var _this = this.scope || this;
        _this.getLoader().baseParams.treeSearch = _this.tfBusqueda.getValue();
        _this.loadNode(_this.getSelectedNode());
    },
    onTreeClear: function() {
        var _this = this.scope || this;
        _this.getLoader().baseParams.treeSearch = '';
        _this.tfBusqueda.reset();
        _this.loadNode(_this.getSelectedNode());
    },
    getSelectedNode: function() {
        return this.getSelectionModel().getSelectedNode() || this.getRootNode();
    },
    getSelectedLevel: function() {
        return this.getSelectedNode() ? this.getSelectedNode().getDepth() : 0;
    },
    onClickNode: function(n) {
        /*var _scope = this.scope || this;
         if (_scope.parentUI) {
         _scope.parentUI.regionSeleccionada = 1;
         _scope.parentUI.getSmPrincipal().clearSelections();
         _scope.parentUI.getStorePrincipal().reload({
         params: {node: n.id}
         });
         }*/
    },
    getParentNode: function() {
        return this.getSelectedNode().parentNode || this.getRootNode();
    },
    loadNode: function(node) {
        var _this = this;
        if (node.isExpanded()) {
            _this.getLoader().load(node);

            node.collapse();
            node.expand();
            
        } else {
            node.expand();
        }
    },
    select: function(node) {
        this.getSelectionModel().select(node);
    }
});


