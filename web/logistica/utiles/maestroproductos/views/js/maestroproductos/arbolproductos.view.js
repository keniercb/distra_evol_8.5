Ext.ns('LOG.lb.maestroproductos');
LOG.lb.maestroproductos.ArbolProductos = Ext.extend(Ext.tree.TreePanel, {
    useArrows: true,
    urlController: null,
    controllerAction: null,
    autoScroll: true,
    border: false,
    bodyBorder: false,
    region: 'center',
    containerRegion: 'west',
    containerCollapsible: true,
    isService: false,
    baseParams: null,
    parentUI: undefined,
    constructor: function(config) {
        var _this = this;
        var urlControlador = config.urlController || '/logistica/utiles/maestroproductos/index.php/maestroproductos'
        urlControlador += '/';
        this.baseParams = config.baseParams || {};
        this.loader = new Ext.tree.TreeLoader({
            url: urlControlador + (config.controllerAction || 'cargarArbolClasificador'),
            baseParams: this.baseParams
        });
        this.loader.on({
            'beforeload': function(tl) {
                if(typeof centrobalance != 'undefined' && centrobalance == true){
                    return true;
                }
                if (_this.parentUI && !_this.parentUI.idEspecialidad) {
                    return false;
                }
            },
            'load': function(t, n, r) {
                var response = Ext.decode(r.responseText);
                if (response.length == 0) {
                    mostrarMensaje(1, _this.tfBusqueda.isDirty() ? LOG.util.Idioma.msgNoResultados : LOG.util.Idioma.msgNoMostrarResultados);
                }
            }
        });
        LOG.lb.maestroproductos.ArbolProductos.superclass.constructor.call(this, config);
    },
    preInit: function() {
        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            text: LOG.lb.maestroproductos.Idioma.titleClasificador,
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
            leaf: false
        });
        this.tfBusqueda = LOG.util.Prototipos.inputTexto({
            name: 'treeSearch',
            width: this.isService ? 150 : 200,
            maxLength: 50,
            emptyText: LOG.lb.maestroproductos.Idioma.textBusquedaSimple
        });
        this.busquedaTbar = [this.tfBusqueda, '', LOG.util.Prototipos.botonBuscar({
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
            'click': this.onClickNode,
            'expandnode': this.onNodeExpand
        });
        LOG.lb.maestroproductos.ArbolProductos.superclass.initComponent.call(this);
    },
    init: function() {
        this.preInit();
        if (this.parentContainer) {
            this.parentContainer.add(LOG.util.UIManager.initPanel({
                layout: 'border',
                region: this.containerRegion,
                margins: '0 2 0 0',
                width: 265,
                minSize: 255,
                maxSize: 500,
                collapsible: this.containerCollapsible,
                collapseMode: 'mini',
                //autoScroll: true,
                animCollapse: false,
                animate: false,
                border: true,
                split: true,
                items: [{region: 'north', tbar: this.busquedaTbar}, this]
            }));
            this.parentContainer.doLayout();
            if (this.parentUI) {
//                var clonLista = new LOG.util.List();
//                this.parentUI.listaMenu.each(function(b) {
//                    var btn = LOG.util.UIManager.createMenuItem(b.initialConfig);
//                    btn.controlFn.createDelegate.call(this.parentUI, [btn, this.parentUI]);
//                    clonLista.add(btn);
//                });
                LOG.util.UIManager.initTreePanelContextMenu(this, this.parentUI.listaMenu);
            }
        }
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
        _this.loadNode(_this.getRootNode());
    },
    getSelectedNode: function() {

        return this.getSelectionModel().getSelectedNode() || this.getRootNode();
    },
    getSelectedLevel: function() {
        return this.getSelectedNode() ? this.getSelectedNode().getDepth() : 0;
    },
    onClickNode: function(n) {
        var _scope = this.scope || this;
        if (_scope.parentUI) {
            _scope.parentUI.regionSeleccionada = 1;
            _scope.parentUI.getSmPrincipal().clearSelections();
            if (_scope.parentUI.gestInterfazAtributDinamicos)
                _scope.parentUI.gestInterfazAtributDinamicos(true, n);
            _scope.parentUI.getStorePrincipal().initBaseParams.node = n.id;
            _scope.parentUI.getStorePrincipal().reload({
                params: {node: n.id}
            });

        }
    },
    onNodeExpand : function (node){
        var _this = this.scope || this;
        _this.getLoader().baseParams.treeSearch = '';
    },
    setDataNodoSeleccionado: function(columna, newValor) {
        var attributes = this.getSelectedNode().attributes;
        attributes[columna] = newValor;

        this.getSelectedNode().attributes = attributes;
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
        this.getSelectionModel().select(node)
    }
});


