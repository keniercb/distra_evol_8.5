/**
 *  Jorge Luis Cuellar Mondeja
 *  20/04/2014
 */
Ext.ns('Ext.erp');

Ext.erp.arbolTipoCombustible = Ext.extend(Ext.tree.TreePanel, {
    validDblClikcRoot: false,
    constructor: function (config) {
        var _this = this;

        this.height = 250;
        this.autoWidth = true;
        this.enableDD = false;
        this.border = false;
        this.margins = '20 20 20 20';
        this.autoScroll = true;
        /*
         *  Esta sentencias es para marcar el nodo sobre el cual se esté trabajando
         */
        this.listeners = {
            'click': function (nodo, e) {
                if (!nodo.isSelected()) {
                    nodo.select();
                }
            },
            'beforeload': function (nodo) {
                if (!nodo.isSelected()) {
                    nodo.select();
                }
            }
        };

        /*
         *  Creo el "TreeLoader" del árbol
         */
        this.loader = new Ext.tree.TreeLoader({
            dataUrl: config.dataUrl,
            listeners: {
                'beforeload': function (loader) {
                    loader.baseParams.idnom = 'idtipocombustible';
                    loader.baseParams.modelo = 'NomTipocombustible';
                    loader.baseParams.treesearch = 1;
                    loader.baseParams.onlyData = true;
                }
            }
        });

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

        Ext.erp.arbolTipoCombustible.superclass.constructor.apply(this, arguments);
    }
});

Ext.erp.comboTipoCombustible = Ext.extend(Ext.form.ComboBox, {
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

        this.editable = false;
        this.valueField = 'id';
        this.displayField = 'value';
        this.lazyRender = false;
        this.autoCreate = true;
        this.mode = 'local';
        this.readOnly = false;
        this.triggerAction = 'all';
        this.listWidth = 300;

        if (config.idcmpValue) {
            this.idcmpValue = config.idcmpValue;
        }

        var arbol = new Ext.erp.arbolTipoCombustible({
            el: config.id + 'Div',
            dataUrl: '/logistica/activos_fijos/configuracion/index.php/nomencladoresgeneralesaft/cargarnomenclador',
            textRootNode: config.textRootNode,
            listeners: {
                'dblclick': function (nodo) {
                    if (nodo.id != 0 || _this.validDblClikcRoot) {
                        _this.fireEvent('dblclick', nodo);
                        _this.setValue(nodo.attributes.text);

                        _this.fnDbClick(nodo.attributes.id);

                        _this.collapse();
                        _this.fireEvent('select', _this, nodo);
                        if (config.onSelect && (typeof config.onSelect == 'function'))
                            config.onSelect.call();
                    }
                },
                'click': function (nodo) {
                    if (_this.actionOnClick) {
                        if (nodo.id != 0 || _this.validDblClikcRoot) {
                            _this.fireEvent('dblclick', nodo);
                            _this.setValue(nodo.attributes.text);

                            _this.fnDbClick(nodo.attributes.id);

                            _this.collapse();
                            _this.fireEvent('select', _this, nodo);
                            if (config.onSelect && (typeof config.onSelect == 'function'))
                                config.onSelect.call();
                        }
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

        Ext.erp.comboTipoCombustible.superclass.constructor.apply(this, arguments);
    }
});