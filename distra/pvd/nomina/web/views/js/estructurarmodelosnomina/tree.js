/**
 * Clase que crea un arbol dinamico.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses classTree
 * @copyright UCID
 * @version 1.0
 */ 

Ext
var classTree = function(params){

        var Tree = Ext.tree;

        var chequeada = "";
        var contador = 0;
        var sistemapago = this.sistemapago;

        var treeLoader = new Tree.TreeLoader({
            dataUrl: params.url,
            baseParams: (params.baseparams ? params.baseparams : {}),
            listeners:{
                beforeload:function(){
                    tree.disable();
                },
                load:function(){
                    tree.enable();
                }
            }
        });

        var tree = new Tree.TreePanel({
            useArrows:true,
            autoScroll:true,
            animate:true,
            border:false,
            //tbar : (params.tbar)? params.tbar : [],
            buttons : (params.buttons) ? params.buttons : [],
            title : (params.title) ? params.title : '',
            enableDD:false,
            containerScroll: true,
            loader: treeLoader,
            region : (params.region)? params.region : 'center',
            rootVisible: (params.rootVisible) ? params.rootVisible : false,
            root: (params.root) ? params.root : {
                nodeType: 'async',
                text: 'Arbol de conceptos y sistemas de pagos',
                draggable: false,
                id: 'idpadre'
            },
            listeners: (params.listeners) ? params.listeners :{
                checkchange : function(node, check){
					if (chequeada == "") {
                        chequeada = node.id;
                        contador = node.childNodes.length;
                    }
                    EVT_MANAGER.fireEvent("checkchange",{checked : check, node : node});                    
                    /*if(!check && params.dependiente){
                        unCheckAllChilds(node);
                    }*/
                },
                expandnode : function(node){
                	EVT_MANAGER.fireEvent("expanded",node);
                },
                append : function( tree, parent, node, index ){
                	/*if(node.attributes.checked && !node.isLeaf())
                		node.expand(true, true);*/
                }
            }
        });
        
        var EVT_MANAGER = new Ext.util.Observable();
	    EVT_MANAGER.addEvents({
	        "checkchange" : true,
	        "expanded" : true
	    });
	
	    this.getEventManager = function() {
	        return EVT_MANAGER;
	    };

        return {
            getTree : function(){
                return tree;
            },
            reloadNode : function(id){
                var node = tree.getNodeById(id);
                node.getLoader().load(node);
            },
            on : function(evt, fn, scope) {
	            EVT_MANAGER.on(evt, fn, scope);
	        }
        };
    }
