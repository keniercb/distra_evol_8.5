/**
 *  Clase para crear un árbol con las unidades de medidas
 *
 *  Jorge Luis Cuellar Mondeja
 *  18-07-2013
 */
Ext.ns('Ext.erp');

Ext.erp.arbolUnidadDeMedida = Ext.extend(Ext.tree.TreePanel, {
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

        Ext.erp.arbolUnidadDeMedida.superclass.constructor.apply(this, arguments);
    }
});

Ext.erp.ComboUnidadDeMedida = Ext.extend(Ext.form.ComboBox, {
    constructor: function (config) {

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
        this.readOnly = false;
        this.triggerAction = 'all';

        if (config.idcmpValue) {
            this.idcmpValue = config.idcmpValue;
        }

        var arbol = new Ext.erp.arbolUnidadDeMedida({
            el: config.id + 'Div',
            dataUrl: config.dataUrl,
            textRootNode: config.textRootNode,
            listeners: {
                'dblclick': function (nodo) {

                    if (nodo.attributes.leaf) {
                        _this.setValue(nodo.attributes.text);

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
            'expand': function () {
                arbol.render();
            }
        };

        Ext.erp.ComboUnidadDeMedida.superclass.constructor.apply(this, arguments);
    }
});