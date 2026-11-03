Ext.ns('Log.aft.submayor_v2');

Log.aft.submayor_v2.Container = Ext.extend(Ext.Viewport,{
    constructor: function(config){
        var _this = this;
        this.layout = 'border';
        this.tipoVistas = config.tipoVistas;
        this.tipoSubmayores = config.tipoSubmayores;
        this.ready = false;
        this.model = config.model;


        this.datosPrecargados = this.model.state
            .then(function(datos){
                _this.grupos = datos.grupos;
                _this.naturalezas = datos.naturalezas;
                _this.viewConfig = datos.configView;
                //_this.estados = datos.estados;
                
                _this.ready = true; 
            });
        
        this.crearCascaron();
        Log.aft.submayor_v2.Container.superclass.constructor.call(this, config);
    },
    crearCascaron: function(){
        this.crearTabPanelTree();
        this.crearTabPanelPrincipal();
        this.items = [
            this.tabPanelTree,
            this.tabPanelPrincipal
        ];
    },
    crearTabPanelTree: function(){

        this.crearTabsTree();

        this.tabPanelTree = new Ext.TabPanel({
            region: 'west',
            title: 'Vistas',
            collapseMode: 'mini',
            split: true,
            activeTab: 0,
            width: 250,
            items: [this.tabsTree]
        });

    },
    crearTabsTree: function(){
        var _this = this;

        function _toTreePanel(vista) {
            function _toTreeNode(tiposubmayor){
                var node = new Ext.tree.TreeNode({
                    id: tiposubmayor.id,
                    text: tiposubmayor.text,
                    leaf: true
                });
    
                node.dynamic = {
                    tiposubmayor: tiposubmayor,
                    tipovista: vista
                }

                return node;
            }

            var tree = new Ext.tree.TreePanel({
                title: vista.text,
                rootVisible: false,
                loader: new Ext.tree.TreeLoader(),
                root: new Ext.tree.AsyncTreeNode({
                    title: '',//vista.text,
                    expanded: true,
                    children: _this.tipoSubmayores.map(_toTreeNode),
                }),
                listeners: {
                    click: function(node) {

                        if(!_this.ready){
                            var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Por favor espere..."});
                            myMask.show();
                            // Si no se han cargado los recursos necesarios al dar el click en el nodo
                            // se crea un intervalo de 0.2 segundos que estará pendiente a que terminen de cargar estos recursos
                            // y una vez cargados se abre la interfaz automaticamente sin necesidad de volvar a dar clic.
                            var interval = setInterval(function(){
                                if(_this.ready){
                                    myMask.hide();
                                    _this.createView(node.attributes.dynamic.tipovista, node.attributes.dynamic.tiposubmayor)
                                    clearInterval(interval);
                                }
                            }, 200)
                        }else {
                            _this.createView(node.attributes.dynamic.tipovista, node.attributes.dynamic.tiposubmayor)
                        }
                    }
                }
            });
            
            return tree;
        };
        this.tabsTree = this.tipoVistas.map(_toTreePanel);
    },
    crearTabPanelPrincipal: function(){
        this.tabPanelPrincipal = new Ext.TabPanel({
            region: 'center',
            items: []
        });
    },
    createView: function(tipovista, tiposubmayor){
        var _this = this;
        var viewPromise = undefined;
        var params = {
            idioma: _this.idioma,
            grupos: _this.grupos,
            naturalezas: _this.naturalezas,
            viewConfig: _this.viewConfig,
            model: _this.model
        };

        if(tipovista.id === 'cantidades'){
            viewPromise = Log.aft.submayor_v2.ViewCantidadesCreator.getInstance(tiposubmayor.id, params);
        }else{
            viewPromise = Log.aft.submayor_v2.ViewMediosCreator.getInstance(tiposubmayor.id , params);
        }
        viewPromise.then(function(view){
            _this.addPanelToTab(view, {tiposubmayor, tipovista});
        });

    },
    addPanelToTab: function(panel, params){
        panel.init();
        panel.view();
        var title = params.tiposubmayor.text + ' por ' + params.tipovista.text.toLowerCase();
        var tpl = params.tiposubmayor.tooltip ? params.tiposubmayor.tooltip : title;
        panel.getPanelPrincipal().title = title;
        panel.getPanelPrincipal().closable = true;
        panel.getPanelPrincipal().tabTip = tpl;
        this.tabPanelPrincipal.add(panel.getPanelPrincipal());
        this.tabPanelPrincipal.activate(panel.getPanelPrincipal());
    }
});