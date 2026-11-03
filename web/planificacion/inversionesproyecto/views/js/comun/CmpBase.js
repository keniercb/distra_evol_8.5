Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();

var Utilidades = {Cmp: {}};

Utilidades.Cmp.Cmpvalidaciones = function () {
    var _this = this;
    var msjerrortextoregido = '';
    var cadena = /^$/;

    /* Ext.override(Ext.form.TextField, {
     initComponent:function(){
     this.maxLengthText = 'El tamaño máximo requerido es '+ this.maxLength +' caracteres.'
     }
     });*/

    this.ObtenerMsjErrorTextoRegido = function (nombrecampo) {
        switch (nombrecampo) {
            case'denominacion':
                msjerrortextoregido = 'Solo admite caracteres alfanuméricos y los caracteres especiales (- _ ' + "''" + ' "" () , . /).';
                break;
            case'car':
                msjerrortextoregido = 'Este valor es incorrecto. Solo se permiten n&uacute;meros.';
                break;
            case'fecha':
                msjerrortextoregido = 'El formato establecido: dd/mm/aaaa.';
                break;
            case'decimal2':
                msjerrortextoregido = 'Este valor es incorrecto. El formato debe de ser xx.xx para valores num&eacute;ricos solamente.';
                break;
        }
        return msjerrortextoregido;
    };

    this.expresionRegular = function (nombrecampo) {
        switch (nombrecampo) {
            case 'denominacion':
                //cadena = /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.]+)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.])*$/;
                cadena = /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.])*$/;
                break;
            case 'hora':
                cadena = /^(([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])([/s]{0,1}([am]|[AM]|[pm]|[PM]))$/;
                break;
        }
        return cadena;
    };

    this.validacionesVtypes = function (validacion) {
        switch (validacion) {
            case 'validarEspaciosEnBlanco':
                Ext.apply(Ext.form.VTypes, {
                    validarEspaciosEnBlanco: function (value, field) {
                        return (!(/^\s+|\s+$/.test(value)));
                    },
                    validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
                });
                return 'validarEspaciosEnBlanco';
                break;
            default:
                return null;
        }
    }
};


Ext.layout.BorderLayout.Region.prototype.getCollapsedEl =
    Ext.layout.BorderLayout.Region.prototype.getCollapsedEl.createSequence(function () {
        if (( this.position == 'south' ) && !this.collapsedEl.titleEl) {
            this.collapsedEl.titleEl = this.collapsedEl.createChild({cls: 'x-collapsed-title', cn: this.panel.title});
        }
    });

Ext.override(Ext.Panel, {
    createClasses: function () {

        if (this.noTitle)
            this.headerCls = this.baseCls + '-header-sipac';
        else
            this.headerCls = this.baseCls + '-header';


        this.headerTextCls = this.baseCls + '-header-text';
        this.bwrapCls = this.baseCls + '-bwrap';
        this.tbarCls = this.baseCls + '-tbar';
        this.bodyCls = this.baseCls + '-body';
        this.bbarCls = this.baseCls + '-bbar';
        this.footerCls = this.baseCls + '-footer';
    }
});

Ext.override(Ext.Button, {

    setTooltip: function (b, a) {
        if (this.rendered) {

            var btnEl = this.el.child(this.buttonSelector);

            if (typeof b == 'object') {
                Ext.QuickTips.register(Ext.apply({
                    target: btnEl.id
                }, b));
                this.tooltip = b
            } else {
                btnEl.dom[this.tooltipType] = b
            }
        } else {
            this.tooltip = b
        }
        return this
    }
});

Ext.override(Ext.KeyMap, {
    addBinding: function (config) {
        var _this = this;
        if (Ext.isArray(config)) {
            for (var i = 0, len = config.length; i < len; i++) {
                this.addBinding(config[i]);
            }
            return;
        }
        var codigokey = config.key,
            shift = config.shift,
            ctrl = config.ctrl,
            alt = config.alt,
            fn = config.fn || config.handler,
            scope = config.scope;
        if (config.stopEvent) {
            this.stopEvent = config.stopEvent;
        }
        if (typeof codigokey == "string") {
            var ks = [];
            var keyString = codigokey.toUpperCase().replace('+', '');

            for (var j = 0, len = keyString.length; j < len; j++) {
                ks.push(keyString.charCodeAt(j));
            }
            codigokey = ks;
        }
        var keyArray = Ext.isArray(codigokey);
        var cant = [];
        var indef = [];
        var count = 0;
        var handler = function (e) {
            if (((shift === undefined) || (shift === e.shiftKey)) &&
                ((ctrl === undefined) || (ctrl === e.ctrlKey)) &&
                ((alt === undefined) || (alt === e.altKey))) {
                var k = e.getKey();
                var c = 0;
                c++;
                if ((e.ctrlKey == true && e.altKey == true) && mayor < 2) {
                    mayor = 2;
                    count = 2
                }
                if (keyArray) {
                    for (var i = 0, len = codigokey.length; i < len; i++) {
                        if (codigokey[i] == k) {
                            if (this.stopEvent) {
                                e.stopEvent();
                            }
                            if (cant.indexOf(k) == -1) {
                                cant.push(k);
                            }
                            if (cant.length == len) {
                                cant = [];
                                count = 0;
                                fn.call(scope || window, k, e);
                                return;
                            }
                        }
                    }
                } else {
                    if (k == codigokey) {
                        if (this.stopEvent) {
                            e.stopEvent();
                        }
                        fn.call(scope || window, k, e);
                    }
                }
            }
        };
        this.bindings.push(handler);
    }
});


Ext.override(Ext.PagingToolbar, {
    name: "pagingToolbarSipac",
    onRender: Ext.PagingToolbar.prototype.onRender.createInterceptor(function () {
        this.agregarDato(this);
    }),
    agregarDato: function (p) {


        this.arrSize = [
            [5],
            [10],
            [15],
            [20],
            [30],
            [50],
            [100],
            [1000]
        ];


        p.cbPageSize.store = new Ext.data.SimpleStore({
            fields: ['size'],
            data: this.arrSize,
            sortInfo: {field: "size", direction: "ASC"}
        });


        /*if(p.cbPageSize.store.getAt(p.cbPageSize.store.getCount()-1).data.size != 1000);
         p.cbPageSize.store.add(newRecord);*/
    }

});

Ext.override(Ext.Panel, {
    headerCls: 'sipac-panel',
    applyKey: function (button, keyContainer) {
        if (button && button.key && keyContainer && button.handler && !button.setKey) {
            if (!keyContainer.keyMap) {
                keyContainer.getKeyMap();
            }
            button.key.stopEvent = true;
            button.key.scope = button;
            button.key.fn = function (b, e) {
                e.stopPropagation();
                e.preventDefault();
                if (!this.disabled && !this.hidden)
                    this.handler.call(this.scope || this, button);
            };
            /* if (!button.underline && button.getText()) {
             // var newText = this.ireplaceStyle(button.getText(), button.key.key, 'span', 'text-decoration: underline;');
             //button.setText(newText);
             button.underline = true;
             }*/
            //esto es para poner el tooltip automaticamente
            if (!button.toolKey && button.tooltip) {
                var keyTip = '', countKey = 0;
                if (button.key.ctrl) {
                    keyTip += 'Ctrl';
                    countKey++;
                }
                if (button.key.alt) {
                    keyTip += countKey == 0 ? 'Alt' : '+Alt';
                    countKey++;
                }
                if (button.key.shift) {
                    keyTip += countKey == 0 ? 'Shift' : '+Shift';
                    countKey++;
                }
                if (button.key.key) {
                    var key = button.key.key;
                    if (key == Ext.EventObject.DELETE) {
                        key = 'DEL';
                    }
                    if (key == 13) {
                        key = 'Enter';
                    }
                    keyTip += (countKey == 0 ? key : '+' + key);
                    countKey++;
                }
                button.countKey = countKey;
                //termina
                if (button.setTooltip) {
                    button.setTooltip(button.tooltip + ' <b>(' + keyTip + ')</b>');
                }
            }
            button.setKey = true;
            keyContainer.keyMap.addBinding(button.key);
        }
    },
    focus: function (c) {
        if (this.usarKeymap && this.focusEl) {
            if (!c || (!(c.browserEvent.target instanceof HTMLInputElement)
                && !(c.browserEvent.target instanceof HTMLTextAreaElement))) {
                //cambia el focus siempre que no este enfocado un componente del tipo texto
                if (Ext.get(document.activeElement).dom.type != 'text') {
                    this.focusEl.focus();
                }
            }
        }
    },
    listeners: {
        render: function (p) {
            var _este = this;
            if (this.usarKeymap) {
                this.focused = '';
                this.focusEl = this.el.createChild({
                    tag: 'a', href: '#', cls: 'x-dlg-focus',
                    tabIndex: '-1', html: '&#160;'
                });
                this.focusEl.swallowEvent('click', true);
                this.getEl().on({
                    mouseover: _este.focus,
                    scope: _este
                });
                this.getEl().on({
                    click: _este.focus,
                    scope: _este
                });
                mayor = 0;
                if (p.botonesKeymap != undefined) {
                    p.botonesKeymap.forEach(function (b) {
                        _este.applyKey(b, _este);
                    });
                }
            }
        }
    }
});

Utilidades.Cmp.UIManager = {
    /**
     * Shortcut a Ext.apply
     * @param {type} o
     * @param {type} cfg
     * @returns {Object}
     */
    apply: function (o, cfg) {
        o = o || {};
        Ext.apply(o, cfg || {});
        return o;
    }
};

Utilidades.Cmp.ComboBox = Ext.extend(Ext.form.ComboBox, {
    /**
     * Store que cargara los datos que se mostraran en el combo
     * @type Ext.data.Store
     */
    store: undefined,
    /**
     * URL  de la cual se van a llenar los datos del combo
     */
    url: undefined,
    /**
     *
     */
    typeAhead: true,
    /**
     *
     */
    tabular: true,
    /**
     *
     */
    forceSelection: true,
    /**
     *
     */
    triggerAction: 'all',
    /**
     *
     */
    mode: 'local',
    /**
     *
     *
     */
    autoLoad: true,
    /**
     *
     */
    autoSelect: false,
    /**
     * Constructor de la lase
     * @param {Object} config
     * @returns {void}
     */
    constructor: function (config) {
        Utilidades.Cmp.UIManager.apply(this, config);
        Utilidades.Cmp.ComboBox.superclass.constructor.call(this, config);
        this.addEvents({
            'valuechange': true
        });
    },
    setValue: Ext.form.ComboBox.prototype.setValue.createInterceptor(function (value) {
        if (this.isXType('combo', false))
            this.fireEvent('valuechange', value);
    }),
    /**
     *
     * @returns {void}
     */
    initComponent: function () {
        this.store = this.initStore();
        if (!this.tpl) {
            var desc = this.descField || this.displayField;
            this.tpl = '<tpl for="."><div ext:qtip="{' + desc + '}" class="x-combo-list-item">{' + this.displayField + '}</div></tpl>';
        }
        Utilidades.Cmp.ComboBox.superclass.initComponent.call(this, arguments);
        var cb = this;
        if (cb.autoSelect) {
            cb.store.on({
                'load': function (st) {
                    if (st.getCount() > 0) {
                        cb.setValue(st.getAt(0).id);
                        cb.fireEvent('change', cb, st.getAt(0).id);
//                        cb.originalValue = st.getAt(0).id;
                    }
                }
            });
        }
    },
    /**
     * Inicializa el store del combo
     * @returns {Ext.data.Store}
     */
    initStore: function () {
        return this.store || new Ext.data.Store({
                url: this.url,
                autoLoad: this.autoLoad,
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    id: this.valueField
                }, [
                    {name: this.valueField},
                    {name: this.displayField}
                ])
            });
    }
});

Utilidades.Cmp.TreeCombo = Ext.extend(Utilidades.Cmp.ComboBox, {
    selectOnlyLeaf: false,
    node: null,
    displayedText: '',
    constructor: function (config) {
        config.valueField = 'tag';
        config.displayField = 'html';
        config.lazyRender = false;
        config.autoCreate = true;
        config.mode = 'local';
        config.readOnly = false;
        config.triggerAction = 'all';
        config.editable = false;
        config.onSelect = Ext.emptyFn;
        Utilidades.Cmp.TreeCombo.superclass.constructor.call(this, config);
        this.idSeleccionado = null;
        this.idtpl = this.getId() + '-div';
        this.tpl = '<tpl for="."><div id= ' + this.idtpl + ' ext:qtip="{' + this.displayField + '}" class="x-combo-list-item">{' + this.displayField + '}</div></tpl>';
        this.createTree();
        var _this = this;
        this.on({
            'blur': function () {
                if (_this.displayedText.length != 0) {
                    _this.setRawValue(_this.displayedText);
                }
            }
        })
    },
    /**
     *
     * hace la funcion del setvalue con el setrawvalue
     */
    cargar: function (displayfield, valuefield) {
        var _this = this;
        _this.idSeleccionado = valuefield;
        _this.setValue(displayfield);
        _this.setRawValue(displayfield);
    },
    initStore: function () {
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
    createTree: function () {
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
            dataUrl: this.url
        });

        this.setBaseNode({_node: _cb.node}, _cb._fn);

        this.tpDatos = new Ext.tree.TreePanel({
            useArrows: true,
            urlController: null,
            autoScroll: true,
            border: false,
            bodyBorder: false,
            region: 'center',
            height: 200,
            loader: this.loader,
            root: this.rootNode,
            listeners: {
                'click': function (nodo, e) {
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
            }
        });
        var _this = this;
        this.on({
            'expand': {
                fn: function (converted) {
                    _this.tpDatos.render(this.getId() + '-div');
                },
                single: true
            },
            'blur': function () {
                _this.collapse();
            }
        });
    },
    /***
     * @returns {undefined} idSeleccionado
     */
    getValue: function () {
        return this.idSeleccionado;
    },
    selectNode: function (nodo) {
        this.node = nodo;
        var _this = this;
        nodo.select();
        _this.idSeleccionado = nodo.id;
        _this.fireEvent('select');
        if (typeof _this.selectFn == 'function') {
            _this.selectFn.createDelegate(_this, [nodo]).call();
        }
        _this.setValue(nodo.text);
        _this.collapse();
    },
    setBaseNode: function (params, _fn) {
        Ext.apply(this.loader.baseParams, params);
        this.loader.load(this.rootNode, function (r) {
            if (typeof _fn == 'function') {
                _fn.createDelegate(this, [r]).call();
            }
        });
    },
    getNodeText: function () {
        return this.node.text;
    },
    /**
     * Restaura los valores por defecto.
     * @returns {undefined}
     */
    resetNode: function () {
        this.selectNode(this.tpDatos.getRootNode());
        this.idSeleccionado = null;
        this.node.text = null;
    },
    setRawValue: function (value) {
        Utilidades.Cmp.TreeCombo.superclass.setRawValue.call(this, value);
        this.displayedText = value;
    }
});


Ext.util.DelayedTask = function (fn, scope, args) {

    var id = null, d, t;

    var call = function () {
        var now = new Date().getTime();
        if (now - t >= d) {
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        }
    };


    this.delay = function (delay, newFn, newScope, newArgs) {
        if (id && delay != d) {
            this.cancel();
        }
        d = delay;
        t = new Date().getTime();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        if (!id) {
            id = setInterval(call, d);
        }
    };


    this.cancel = function () {
        if (id) {
            clearInterval(id);
            id = null;
        }
    };
};


Ext.override(Ext.form.HtmlEditor, {
    onDisable: function () {
        if (this.rendered) {
            this.wrap.mask();
        }
        Ext.form.HtmlEditor.superclass.onDisable.call(this);
    },
    onEnable: function () {
        if (this.rendered) {
            this.wrap.unmask();
        }
        Ext.form.HtmlEditor.superclass.onEnable.call(this);
    }
});




Ext.override(Ext.grid.GridView,{
    columnsToShow:[],
    scope:this,
    deferredUpdate: new Ext.util.DelayedTask(),

    recargar: function () {
        this.grid.getStore().reload({
            params:{
                columnsToShow:Ext.encode(this.columnsToShow)
            }
        });
    },
    handleHdMenuClick : Ext.grid.GridView.prototype.handleHdMenuClick.createInterceptor(function(item){
        var id = item.id.split('-');
        switch(id[0]){

            case "col":
                var cm = this.cm
                var index = cm.getIndexById(item.id.substr(4));
                var grid = this;


                if(grid.grid.columnsByDemand == true)
                {
                    var dataindex = cm. getDataIndex(index);
                    if(item.checked == false){
                        grid.deferredUpdate.cancel();
                        grid.columnsToShow.push(dataindex);
                        grid.deferredUpdate.delay(1000,grid.recargar,grid);

                    }
                    else{
                        if(grid.columnsToShow.length > 0){
                            var indexdata = grid.columnsToShow.indexOf(dataindex);
                            if(indexdata>=0){
                                grid.columnsToShow.splice(indexdata,1)
                            }
                        }
                    }
                }
                break;
        }
        return true;
    })
});

