/**
 * Created by Lisbeth 
 */
Ext.ns('LOG.utiles.versiones');

LOG.utiles.versiones.view = Ext.extend(Ext.Viewport, {
    constructor: function(config){
        this.idioma = config.idioma;
        this.title = 'Layout Window';
        this.closable =true;
        this.width = 600;
        this.height = 350;
        this.plain = true;
        this.layout = 'border';
        this.nodos = config.nodos.map(function(valor){
            return {
                text: valor.name, 
                leaf: true,
                ...valor
            };
        });
        
        this.crearPaneles();
        LOG.utiles.versiones.view.superclass.constructor.call(this, config);
    },
    crearPaneles: function(){
        var _this = this;
        _this.crearPanel();
        // Panel for the west
        var tree = new Ext.tree.TreePanel({
            title: 'Navigation',
            region: 'west',
            margins:'3 0 3 3',
            cmargins:'3 3 3 3',
            width: 200,
            split: true,
            collapsible: true,
            useArrows: true,
            autoScroll: true,
            animate: true,
            enableDD: true,
            containerScroll: true,
            border: false,
            root: new Ext.tree.AsyncTreeNode({
                expanded: true,
                children: _this.nodos
            }),
            rootVisible: false,
            listeners:{
                click: function (nodo){
                    function mostrarChangelog(datos){
                        var md = new LOG.utiles.versiones.remarkable.Remarkable();
                        var htmlChangelog = md.render(datos);
                        var src =  'data:text/html;charset=utf-8,' + encodeURI(htmlChangelog);
                        var ifrmae = '<iframe src="'+ src +'" height="100%" width="100%" title="Changelog for Changelog">$html</iframe>';                        
                        var panel2 = new Ext.Panel({});
                        _this.panel.add(panel2);
                        _this.panel.doLayout();
                        panel2.body.insertHtml("beforeEnd", ifrmae);
                    }
                    _this.panel.removeAll();
                    LOG.utiles.versiones.model.cargarChangelogData(nodo.attributes.dir, mostrarChangelog);
                }
            }
        });
        
        tree.getRootNode().expand();
        _this.items = [_this.panel,tree]
        
    },
    crearPanel: function(){
        var _this = this;
        _this.panel = new Ext.Panel({
            region: 'center',
            margins:'3 3 3 0',
            layout:'fit'
            
            
        });
    }

});

