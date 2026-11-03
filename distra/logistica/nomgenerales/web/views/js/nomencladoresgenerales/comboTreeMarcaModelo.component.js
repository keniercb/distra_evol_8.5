/**
 *  Jorge Luis Cuellar Mondeja
 *  2/07/2013
 */
Ext.ns('Ext.erp');

/*
 * Impementación de un árbol para la selección de marcas-modelos desde un combo-tree
 */

Ext.erp.arbolMarcaModelo = Ext.extend(Ext.tree.TreePanel, {
    maskDisabled: false,
    validDblClikcRoot: false,
    constructor: function(config) {
        var _this = this;

        this.height = 150;
        this.autoWidth = true;
        this.enableDD = false;
        this.border = false;
        this.margins = '20 20 20 20';
        this.autoScroll = true;
        this.params = config.params;

        /*
         *  Creo el "TreeLoader" del árbol
         */
        this.loader = new Ext.tree.TreeLoader({
            dataUrl: config.dataUrl,
            listeners: {
                'beforeload': function(loader) {
                    if (_this.unidadmedida) {
                        loader.baseParams.unidadmedida = _this.unidadmedida;
                    }
                    if (_this.params) {
                        loader.baseParams.params = Ext.encode(_this.params);
                    }
                }
            }
        });

        /*
         *  Creo el nodo padre del árbol el cual se identificará por tener id 0
         */
        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            text: config.textRootNode,
            expanded: true,
            animate: false,
            draggable: false
        });

        /*
         *  Esta sentencias es para marcar el nodo sobre el cual se esté trabajando
         */
        this.listeners = {
            'click': function(nodo, e) {
                if (!nodo.isSelected()) {
                    nodo.select();
                }
            },
            'beforeload': function(nodo) {
                if (!nodo.isSelected()) {
                    nodo.select();
                }
            }
        };

        Ext.erp.arbolMarcaModelo.superclass.constructor.apply(this, arguments);
    }
});

Ext.erp.comboTreeMarcaModelo = Ext.extend(Ext.form.ComboBox, {
    modeTree: 'local',
    is_init: false,
    constructor: function(config) {

        var _this = this;

        this.store = new Ext.data.SimpleStore({
            fields: ['id', 'value'],
            data: [
                ['div', '<div id="' + config.id + 'Div" style="width:100%; border:none; height:100%;"></div>']
            ]
        });

        this.editable = false;
        this.valueField = 'id';
        this.displayField = 'value';
        this.lazyRender = false;
        this.autoCreate = true;
        this.mode = 'local';
        this.modeTree = (config.modeTree) ? config.modeTree : _this.modeTree;
        this.readOnly = false;
        this.triggerAction = 'all';

        if (config.idcmpValue) {
            this.idcmpValue = config.idcmpValue;
        }

        this.arbol = new Ext.erp.arbolMarcaModelo({
            el: config.id + 'Div',
            dataUrl: config.dataUrl,
            textRootNode: config.textRootNode,
            params: config.params,
            listeners: {
                'dblclick': function(nodo) {
                    console.info(nodo);
                    if (nodo.id != 0 || _this.validDblClikcRoot) {

                        _this.setValue(((nodo.parentNode.id != 0) ? (nodo.parentNode.attributes.text + ' - ') : ('')) + nodo.attributes.text);

                        if (_this.idcmpValue) {
                            Ext.getCmp(_this.idcmpValue).setValue(nodo.attributes.id);
                        }
                        _this.collapse();
                    }

                }
            }
        });

        this.tpl = config.tpl || '<tpl for=".">{' + this.displayField + '}</tpl>';

        this.listeners = {
            'expand': function() {
                if (!_this.is_init) {
                    _this.arbol.render();
                    _this.is_init = true;

                } else {
                    if (_this.modeTree == 'remote')
                        this.arbol.getLoader().load(this.arbol.getRootNode());
                }
            }
        };

        Ext.erp.comboTreeMarcaModelo.superclass.constructor.apply(this, arguments);
    },
    setParams: function(parametros) {

        this.arbol.getLoader().on({
            'beforeload': function(loader) {
                loader.baseParams.params = Ext.encode(parametros);
            }
        });
    }
});
