/*
 * Componente para crear un arbol chekeable o no.
 * @copyright UCID Cuba
 * @author Rolando Toledo Fernández
 * @version 1.0-0
 */

 /**
  * @description Funcion que se encarga de crear un arbol dinamico 
  * 				
  * 
  * @param {tbar:[],buttons: [], regio : '', root: {}, title : '', url:''} params
  * @return {}
  */
 var classTree = function(params){

        var Tree = Ext.tree;

        var chequeada = "";
        var contador = 0;

        var treeLoader = new Tree.TreeLoader({
            dataUrl: params.url,
            baseParams: (params.baseparams ? params.baseparams : {})
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
                text: 'Base legal',
                draggable: false,
                id: 'idpadre'
            },
            listeners: (params.listeners) ? params.listeners :{
                checkchange : function(node, check){

                    if (chequeada == "") {
                        chequeada = node.id;
                        contador = node.childNodes.length;
                    }
                    if (node.childNodes && node.childNodes.length > 0)
                        UncheckOrCheckParent(node, check, false);
                    else
                        UncheckOrCheckParent(node, check, true);

                    EVT_MANAGER.fireEvent("checkchange",{checked : check, node : node});
                },
                expandnode : function(node){
                	EVT_MANAGER.fireEvent("expanded",node);
                },
                append : function( tree, parent, node, index ){
                	if(node.attributes.checked && !node.isLeaf())
                		node.expand(false, true);
                }
            }
        })
        /**
             * Dice si es ancestro del nodo
             *
             * @author Rolando Toledo Fernández
             *
             * @param {Ext.tree.TreeNode}
             *            node
             * @param {String}
             *            ancestro
             */
        var  isAncestro = function(node, ancestro) {
            if (!node.parentNode)
                return false;
            return (node.parentNode.id == ancestro || isAncestro(
                node.parentNode, ancestro));
        }

        /**
             * Funcion que chequea los nodos
             * SelectionLayer
             *
             * @author Rolando Toledo Fernández
             *
             * @param {Ext.tree.TreeNode}
             *            node
             * @param {Boolean}
             *            checked
             */
        var  CascadeChecked = function(node, checked) {
            checkParent(node, checked);
            if (node.childNodes)
                checkChild(node, checked);
            if (checkedChild(node) == node.childNodes.length
                && node.id == chequeada)
                chequeada = "";
        };

        /**
             * Chekea los padres del nodo
             *
             * @author Rolando Toledo Fernández
             *
             * @param {Ext.tree.TreeNode}
             *            node
             * @param {Boolean}
             *            checked
             */
        var  checkParent = function(node, checked) {
            if (node.parentNode && !node.parentNode.attributes.checked) {
                node.parentNode.getUI().removeClass('complete');
                node.parentNode.getUI().toggleCheck(checked);
            }
        };
        /**
             * Chekea los hijos del nodo
             *
             * @author Rolando Toledo Fernández
             *
             * @param {Ext.tree.TreeNode}
             *            node
             * @param {Boolean}
             *            checked
             */
        var checkChild = function(node, checked) {
            node.cascade(function(n) {
                if (n.attributes.id != node.attributes.id && isAncestro(n, chequeada)) {
                    n.getUI().toggleCheck(checked);
                    if(checked)
                        node.parentNode.getUI().addClass('complete');
                    else
                        node.parentNode.getUI().removeClass('complete');

                    this.fireEvent("checkchange",this,checked);
                }
            });
        }
        /**
             * Funcion que deschequea los nodos
             *
             * @author Rolando Toledo Fernández
             *
             * @param {Ext.tree.TreeNode}
             *            node
             * @param {Boolean}
             *            checked
             */
        var CascadeUnCheked = function(node, checked) {
            node.cascade(function(n) {
                if (n.attributes.id != node.attributes.id) {
                    n.getUI().toggleCheck(checked);
                    n.attributes.checked = checked;
                    this.fireEvent("checkchange",this,checked);
                }
            });
            if (node.parentNode && node.parentNode.attributes.checked
                && checkedChild(node.parentNode) == 0) {

                node.parentNode.getUI().addClass('complete');
                node.parentNode.getUI().toggleCheck(checked);
            }
            contador = 0;
            chequeada = "";
        }
        /**
             * Funcion para saber la cantidad de hijos de un nodo
             *
             * @author Rolando Toledo Fernández
             *
             * @param {Ext.tree.TreeNode}
             *            parentNode
             * @return {Number}
             */
        var checkedChild = function(parentNode) {
            var cantidad = 0;
            if (parentNode.childNodes) {
                var nodeList = parentNode.childNodes;
                for (var i in nodeList) {
                    if (nodeList[i].attributes
                        && nodeList[i].attributes.id != parentNode.attributes.id)
                        if (nodeList[i].attributes.checked)
                            cantidad++;
                }
            }
            return cantidad;
        }

        /**
             * Funcion que cambia el estado del padre segun el estado de los hijos
             *
             * @author Rolando Toledo Fernández
             *
             * @param {Ext.tree.TreeNode}
             *            node
             * @param {boolean}
             *            checked
             * @param {boolean}
             *            checkear
             */
        var UncheckOrCheckParent = function(node, checked, checkear) {
            if (checked) {
                CascadeChecked(node, checked, checkear);

            } else {
                CascadeUnCheked(node, checked);
            }
        };
        var ventana;
        
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
