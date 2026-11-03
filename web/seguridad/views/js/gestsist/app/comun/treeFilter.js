/**
 * Add basic filtering to Ext.tree.Panel. Add as a mixin:
 * mixins: {
* treeFilter: 'MyApp.lib.TreeFilter'
* }
 */
Ext.define('Conf.lib.TreeFilter', {


    filterScope: this,

    filterByText: function(text) {
        this.filterBy(text, 'text');
    },


    /**
     * Filter the tree on a string, hiding all nodes expect those which match and their parents.
     * @param The term to filter on.
     * @param The field to filter on (i.e. 'text').
     */
    filterBy: function(text, by) {

        this.clearFilter();

        var view = this.getView(),
            me = this,
            nodesAndParents = [];

// Find the nodes which match the search term, expand them.
// Then add them and their parents to nodesAndParents.
        this.getRootNode().cascadeBy(function(tree, view){
            var currNode = this;

            if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                me.expandPath(currNode.getPath());

                do {
                    nodesAndParents.push(currNode.id);
                    currNode = currNode.parentNode;
                } while (currNode);
            }
        }, null, [me, view]);

// Hide all of the nodes which aren't in nodesAndParents
        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                Ext.get(uiNode).setDisplayed('none');
            }
        }, null, [me, view]);
    },


    clearFilter: function() {
        var view = this.getView();

        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode) {
                Ext.get(uiNode).setDisplayed('table-row');
            }
        }, null, [this, view]);
    },


    filtrarArbol: function (value,childNodes, haschildText)
    {

        var valuer = value;
        var _this = this;
        if (!valuer) {
           _this.clearFilter();
        }
        else {
            Ext.each(childNodes, function (node) {

                if(node){

                    var view = _this.getView();
                    var nodo = view.getNode(node);
                    node.haschildText = false;
                    if (node.isLeaf() || !node.isExpanded()) {
                        if ((node.data.text.toLowerCase().indexOf(valuer.toLowerCase()) != -1)) {
                            Ext.get(nodo).setDisplayed(true);
                            node.parentNode.haschildText = true;
                        }
                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                    else if (node.isExpanded() && node.childNodes.length > 0) {
                        _this.filtrarArbol(valuer,node.childNodes, node.haschildText);
                        if (node.haschildText) {
                            Ext.get(nodo).setDisplayed(true);
                            node.parentNode.haschildText = true;
                        }
                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                    else {
                        if (node.data.text.toLowerCase().indexOf(valuer.toLowerCase()) != -1) {
                            Ext.get(nodo).setDisplayed(true);
                            node.parentNode.haschildText = true;
                        }
                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                }


            });
        }
    },

    buscarMenuIzquierdo: function (value) {
        var arbol = this;
        if (!value) {
            arbol.clearFilter();
        }
        else if (value != undefined) {

            arbol.getRootNode().eachChild(function (n) {
                if(n) {
                    var view = arbol.getView();
                    var nodo = view.getNode(n);

                    n.haschildText = false;
                    if (n.isExpanded() && n.childNodes.length > 0) {

                        arbol.filtrarArbol(value, n.childNodes, n.haschildText);
                        if (n.haschildText)
                            Ext.get(nodo).setDisplayed(true);

                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                    else {
                        if (n.data.text.toLowerCase().indexOf(value.toLowerCase()) != -1) {
                            Ext.get(nodo).setDisplayed(true);
                            n.parentNode.haschildText = true;
                        }
                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                }
            }, this);

        }
    }


});
