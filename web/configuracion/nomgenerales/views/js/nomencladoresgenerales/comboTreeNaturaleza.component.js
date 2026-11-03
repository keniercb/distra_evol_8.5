/**
 *  Jorge Luis Cuellar Mondeja
 *  2/07/2013
 */
Ext.ns('Ext.erp');

/*
 * Impementación de un árbol para la selección de marcas-modelos desde un combo-tree
 */

Ext.erp.arbolNaturaleza = Ext.extend(Ext.tree.TreePanel, {
    validDblClikcRoot: false,
    constructor: function (config) {
        var _this = this;

        this.height = 150;
        this.autoWidth = true;
        this.enableDD = false;
        this.border = false;
        this.margins = '20 20 20 20';
        this.autoScroll = true;

        /*
         *  Creo el "TreeLoader" del árbol
         */
        this.loader = new Ext.tree.TreeLoader({
            dataUrl: config.dataUrl,
            listeners: {
                'beforeload': function (loader) {
                    if (_this.unidadmedida) {
                        loader.baseParams.unidadmedida = _this.unidadmedida;
                    }
                }
            }
        });
//
        /*//
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
            'click': function (nodo, e) {
                if (! nodo.isSelected()) {
                    nodo.select();
                }
            },
            'beforeload': function (nodo) {
                if (! nodo.isSelected()) {
                    nodo.select();
                }
            }
        };

        Ext.erp.arbolNaturaleza.superclass.constructor.apply(this, arguments);
    }
});

Ext.erp.comboTreeNaturaleza = Ext.extend(Ext.form.ComboBox, {
    constructor: function (config) {

        var _this = this;
        _this.addEvents('dblclick');
        Ext.apply(this, config);

        this.store = new Ext.data.SimpleStore({
            fields: ['id', 'value'],
            data: [
                ['div', '<div id="' + config.id + 'Div" style="width:100%; border:none; height:100%;"></div>']
            ]
        });
        this.autoLoad = true;
        this.editable = false;
        this.valueField = 'id';
        this.displayField = 'value';
        this.lazyRender = false;
        this.autoCreate = true;
        this.mode = 'local';
        this.readOnly = false;
        this.triggerAction = 'all';

        if (config.idcmpValue) {
            this.idcmpValue = config.idcmpValue;
        }

        var arbol = new Ext.erp.arbolNaturaleza({
            el: config.id + 'Div',
            dataUrl: config.dataUrl,
            textRootNode: config.textRootNode,            
            listeners: {
                'dblclick': function (nodo) {

                    if (nodo.id != 0 || _this.validDblClikcRoot) {
                        _this.fireEvent('dblclick', nodo);
                        _this.setValue(nodo.attributes.text);

                        if (_this.idcmpValue ) {
                            _this.naturalezacombo.setValue(nodo.attributes.id);
                        }

                        _this.collapse();
                        _this.fireEvent('select', _this, nodo);
                        if (config.onSelect && (typeof config.onSelect == 'function'))
                            config.onSelect.call();
                    }
                }
                ,
                'click': function (nodo) {

                    if (nodo.id != 0 || !_this.validDblClikcRoot) {
                        _this.fireEvent('click', nodo);
                        _this.setValue(nodo.attributes.text);

                        if (_this.idcmpValue) {
                            _this.naturalezacombo.setValue(nodo.attributes.id);
                        }

                        _this.collapse();
                        _this.fireEvent('select', _this, nodo);
                        if (config.onSelect && (typeof config.onSelect == 'function'))
                            config.onSelect.call();
                    }
                }
            }
        });

        this.tpl = config.tpl || '<tpl for=".">{' + this.displayField + '}</tpl>';

        this.listeners = {
            'expand': function () {
                arbol.render();
            }
        };

        Ext.erp.comboTreeNaturaleza.superclass.constructor.apply(this, arguments);
    }
});
