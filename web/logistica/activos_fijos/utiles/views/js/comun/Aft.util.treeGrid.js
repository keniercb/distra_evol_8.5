/**
 * Created by yoendy on 7/3/2015.
 */
Ext.ns('AFT.util');
AFT.util.TreeCombo = Ext.extend(LOG.util.TreeCombo, {
    conCheck:-1,
    chequeados:-1,
    constructor: function(config) {
        Ext.apply(this, config);
        AFT.util.TreeCombo.superclass.constructor.call(this, config);

        //this.createTree();
    },
    initStore: function() {
        var store = new Ext.data.Store({
            reader: new Ext.data.ArrayReader({
                fields: ['tag', 'html']
            })
        });
        store.loadData([
            ['div', '']
        ]);
        return store;
    },
    createTree: function() {
        var _cb = this;
        this.rootNode = new Ext.tree.AsyncTreeNode({
            id: this.idNode || '0',
            text: this.textRootNode || 'Elementos',
            expanded: true,
            animate: false,
            draggable: false,
            iconCls: 'historial'
        });

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: this.url,
        });

        this.loader.baseParams = {
            _node: _cb.node,
            conCheck: _cb.conCheck,
            chequeados: _cb.chequeados
        };

        _cb.tpDatos = new Ext.tree.TreePanel({
            useArrows: true,
            urlController: null,
            autoScroll: true,
            border: false,
            bodyBorder: false,
            region: 'center',
            height: 300,
            loader: this.loader,
            root: this.rootNode,
            listeners: {
                'click': function(nodo, e) {
                    if (nodo.id != 0) {
                        if (_cb.selectOnlyLeaf) {
                            if (nodo.leaf) {
                                _cb.selectNode(nodo);
                            } else {
                                nodo.expand();
                            }
                        } else {
                            _cb.selectNode(nodo);
                        }
                    }
                }
            },
//            bbar: new Ext.Toolbar({
//                layout: 'fit',
//                items: [LOG.util.Prototipos.inputTexto({width: '100%'})]
//            })
        });
        var _this = this;
        this.on({
            'expand': {
                fn: function(converted) {
                    _cb.tpDatos.render(this.getId() + '-div');
                },
                single: true
            },
            'blur': function() {
                _this.collapse();
            }
        });
    },
    selectNode: function(nodo) {
        var _this = this;
//        if (!nodo.isSelected()) {
        nodo.select();
        _this.fireEvent('select');
        _this.idSeleccionado = nodo.id;
        if (typeof _this.selectFn == 'function') {
            _this.selectFn.createDelegate(_this, [nodo]).call();
        }
        if (_this.conCheck == -1) {
            var valorChk = nodo;
            var path = valorChk.getPath();
            var arrayPath = path.split("/");
            var denoPadres = "";
            for(var j = 1; j<arrayPath.length; j++){
                denoPadres +=  _this.tpDatos.getNodeById(arrayPath[j]).attributes.text;
                if(j+1<arrayPath.length){
                    denoPadres +=" / ";
                }

            }
            _this.setValue(denoPadres);
        } else {
            _this.setValue(nodo.text);
        }
//        }
        _this.collapse();
    }
});