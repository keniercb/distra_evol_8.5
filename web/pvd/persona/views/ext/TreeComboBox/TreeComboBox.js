Ext.ns("Ext.components");

Ext.components.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent: function () {
        Ext.components.SearchField.superclass.initComponent.call(this);

        this.on('render', function () {
            this.hiddenPkgs = [];
        }, this);

        this.on('specialkey', function (f, e) {
            if (e.getKey() == e.ENTER) {
                this.onTrigger2Click();
            }
        }, this);

        this.on('keydown', this.onTrigger2Click, this, {buffer: 350});
    },

    validationEvent: false,
    validateOnBlur: false,
    trigger1Class: 'x-form-clear-trigger',
    trigger2Class: 'x-form-search-trigger',
    hideTrigger1: true,
    width: 180,
    hasSearch: false,
    paramName: 'query',

    onTrigger1Click: function () {
        if (this.hasSearch) {
            this.el.dom.value = '';
            this.filterTree();
            this.triggers[0].hide();
            this.hasSearch = false;
            this.focus();
        }
    },

    onTrigger2Click: function () {
        var v = this.getRawValue();
        if (v.length < 1) {
            this.onTrigger1Click();
            return;
        }
        this.filterTree();
        this.hasSearch = true;
        this.triggers[0].show();
        this.focus();
    },

    filterTree: function () {
        var self = this;
        var text = this.getRawValue();

        Ext.each(this.hiddenPkgs, function (n) {
            n.ui.show();//muestro todos los nodos que se habian ocultado
        });
        if (!text) {
            this.filtro.clear();
            return;
        }
        this.tree.expandAll();

        var re = new RegExp(Ext.escapeRe(text), 'i');
        this.filtro.filterBy(function (n) {
            return !n.isLeaf() || re.test(n.text);
        });

        // hide empty packages that weren't filtered
        this.hiddenPkgs = [];
        this.tree.root.cascade(function (n) {
            if (!n.isLeaf() && n.ui.ctNode.offsetHeight < 3) {
                n.ui.hide();
                self.hiddenPkgs.push(n);
            }
        });
    }
});

Ext.components.Tree_ComboBox = Ext.extend(Ext.form.TwinTriggerField, {
    listClass: 'tree_comboBox',
    /**
     * @cfg {Boolean/String} shadow True or "sides" for the default effect, "frame" for 4-way shadow, and "drop" for bottom-right
     */
    shadow: 'sides',
    /**
     * @cfg {String} listAlign A valid anchor position value. See {@link Ext.Element#alignTo} for details on supported
     * anchor positions (defaults to 'tl-bl')
     */
    listAlign: 'tl-bl?',
    /**
     * @cfg {Number} maxHeight The maximum height in pixels of the dropdown list before scrollbars are shown (defaults to 300)
     */
    maxHeight: 300,
    /**
     * @cfg {Number} minHeight The minimum height in pixels of the dropdown list when the list is constrained by its
     * distance to the viewport edges (defaults to 90)
     */
    minHeight: 90,
    /**
     * @cfg {String} triggerAction The action to execute when the trigger field is activated.  Use 'all' to run the
     * query specified by the allQuery config option (defaults to 'query')
     */
    triggerAction: 'query',
    /**
     * @cfg {Number} minChars The minimum number of characters the user must type before autocomplete and typeahead activate
     * (defaults to 4 if remote or 0 if local, does not apply if editable = false)
     */
    minChars: 4,
    /**
     * @cfg {Boolean} typeAhead True to populate and autoselect the remainder of the text being typed after a configurable
     * delay ({@link #typeAheadDelay}) if it matches a known value (defaults to false)
     */
    typeAhead: false,
    /**
     * @cfg {Number} queryDelay The length of time in milliseconds to delay between the start of typing and sending the
     * query to filter the dropdown list (defaults to 500 if mode = 'remote' or 10 if mode = 'local')
     */
    queryDelay: 500,
    /**
     * @cfg {Boolean} selectOnFocus True to select any existing text in the field immediately on focus.  Only applies
     * when editable = true (defaults to false)
     */
    selectOnFocus: false,
    /**
     * @cfg {String} loadingText The text to display in the dropdown list while data is loading.  Only applies
     * when mode = 'remote' (defaults to 'Loading...')
     */
    loadingText: 'Loading...',
    /**
     * @cfg {Boolean} resizable True to add a resize handle to the bottom of the dropdown list (defaults to false)
     */
    resizable: false,
    /**
     * @cfg {Number} handleHeight The height in pixels of the dropdown list resize handle if resizable = true (defaults to 8)
     */
    handleHeight: 8,
    /**
     * @cfg {Boolean} editable False to prevent the user from typing text directly into the field, just like a
     * traditional select (defaults to true)
     */
    editable: true,
    /**
     * @cfg {String} allQuery The text query to send to the server to return all records for the list with no filtering (defaults to '')
     */
    allQuery: '',
    /**
     * @cfg {String} mode Set to 'local' if the ComboBox loads local data (defaults to 'remote' which loads from the server)
     */
    mode: 'remote',
    /**
     * @cfg {Number} minListWidth The minimum width of the dropdown list in pixels (defaults to 70, will be ignored if
     * listWidth has a higher value)
     */
    minListWidth: 70,
    /**
     * @cfg {Boolean} forceSelection True to restrict the selected value to one of the values in the list, false to
     * allow the user to set arbitrary text into the field (defaults to false)
     */
    forceSelection: false,
    /**
     * @cfg {Number} typeAheadDelay The length of time in milliseconds to wait until the typeahead text is displayed
     * if typeAhead = true (defaults to 250)
     */
    typeAheadDelay: 250,
    /**
     * @cfg {String} valueNotFoundText When using a name/value combo, if the value passed to setValue is not found in
     * the store, valueNotFoundText will be displayed as the field text if defined (defaults to undefined). If this
     * defaut text is used, it means there is no value set and no validation will occur on this field.
     */

    /**
     * @cfg {Boolean} lazyInit True to not initialize the list for this combo until the field is focused (defaults to true)
     */
    lazyInit: true,

    validationEvent: false,
    validateOnBlur: false,
    trigger1Class: 'x-form-refresh-trigger',
    trigger2Class: 'x-form-arrow-trigger',
    hideTrigger1: true,
    width: 180,
    loaded: false,
    hasSearch: false,
    paramName: 'query',
    baseParams: {},

    initComponent: function () {
        this.addEvents(
            /**
             * @event expand
             * Fires when the dropdown list is expanded
             * @param {Ext.form.ComboBox} combo This combo box
             */
            'expand',
            /**
             * @event collapse
             * Fires when the dropdown list is collapsed
             * @param {Ext.form.ComboBox} combo This combo box
             */
            'collapse',
            /**
             * @event beforeselect
             * Fires before a list item is selected. Return false to cancel the selection.
             * @param {Ext.form.ComboBox} combo This combo box
             * @param {Ext.data.Record} record The data record returned from the underlying store
             * @param {Number} index The index of the selected item in the dropdown list
             */
            'beforeselect',
            /**
             * @event select
             * Fires when a list item is selected
             * @param {Ext.form.ComboBox} combo This combo box
             * @param {Ext.data.Record} record The data record returned from the underlying store
             * @param {Number} index The index of the selected item in the dropdown list
             */
            'select',
            /**
             * @event beforequery
             * Fires before all queries are processed. Return false to cancel the query or set the queryEvent's
             * cancel property to true.
             * @param {Object} queryEvent An object that has these properties:<ul>
             * <li><code>combo</code> : Ext.form.ComboBox <div class="sub-desc">This combo box</div></li>
             * <li><code>query</code> : String <div class="sub-desc">The query</div></li>
             * <li><code>forceAll</code> : Boolean <div class="sub-desc">True to force "all" query</div></li>
             * <li><code>cancel</code> : Boolean <div class="sub-desc">Set to true to cancel the query</div></li>
             * </ul>
             */
            'beforequery'
        );

        Ext.components.Tree_ComboBox.superclass.initComponent.call(this);
    },

    onRender: function (ct, position) {
        Ext.components.Tree_ComboBox.superclass.onRender.call(this, ct, position);
        if (this.hiddenName) {
            this.hiddenField = this.el.insertSibling({
                tag: 'input', type: 'hidden', name: this.hiddenName,
                id: (this.hiddenId || this.hiddenName)
            }, 'before', true);

            // prevent input submission
            this.el.dom.removeAttribute('name');
        }
        if (Ext.isGecko) {
            this.el.dom.setAttribute('autocomplete', 'off');
        }

        if (!this.lazyInit) {
            this.initList();
        } else {
            this.on('focus', this.initList, this, {single: true});
        }

        if (!this.editable) {
            this.editable = true;
            this.setEditable(false);
        }
    },

    onResize: function (w, h) {
        Ext.components.Tree_ComboBox.superclass.onResize.apply(this, arguments);
        if (this.list && this.listWidth === undefined) {
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
            this.tgSearch.setWidth(lw - 50);
        }
    },

    onBeforeLoad: function (tl, n, callback) {
        if (n.isLoading()) {
            return false;
        }
        Ext.apply(tl.baseParams, this.baseParams);
        /*if(!this.hasFocus){
         return;
         }
         this.innerList.update(this.loadingText ?
         '<div class="loading-indicator">'+this.loadingText+'</div>' : '');
         this.restrictHeight();
         this.selectedIndex = -1;*/
    },

    restrictHeight: function () {
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom;
        var pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight;
        var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
        var ha = this.getPosition()[1] - Ext.getBody().getScroll().top;
        var hb = Ext.lib.Dom.getViewHeight() - ha - this.getSize().height;
        var space = Math.max(ha, hb, this.minHeight || 0) - this.list.shadowOffset - pad - 5;
        h = Math.min(h, space, this.maxHeight);

        this.innerList.setHeight(h);
        this.list.beginUpdate();
        this.list.setHeight(h + pad);
        this.list.alignTo(this.wrap, this.listAlign);
        this.list.endUpdate();
    },

    clickNode: function (node, e) {
        //this.valueNotFoundText = node.text;
        this.setValue(node.id);
        this.collapse();
    },

    setValue: function (v) {
        var text = v;
        var n = (this.tree instanceof Ext.tree.TreePanel) ? this.tree.getNodeById(v) : null;
        if (n instanceof Ext.tree.TreeNode) {
            text = n.text;
        }
        this.lastSelectionText = text;
        /*if (this.hiddenField) {
         this.hiddenField.value = v;
         }*/
        Ext.components.Tree_ComboBox.superclass.setValue.call(this, text);
        this.value = v;
    },

    getValue: function () {
        //if (this.valueField) {
        return typeof this.value != 'undefined' ? this.value : '';
        //} else {
        //return Ext.components.Tree_ComboBox.superclass.getValue.call(this);
        //}
    },

    initList: function () {
        if (!this.list) {
            var cls = 'x-combo-list';

            this.list = new Ext.Layer({
                shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain: false
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setWidth(lw);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;

            if (this.title) {
                this.header = this.list.createChild({cls: cls + '-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls: cls + '-inner'});
            //this.innerList.on('mouseover', this.onViewOver, this);
            //this.innerList.on('mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            var treeConfig = {
                border: false,
                height: 200,
                renderTo: this.innerList
            };

            var treeLoader = new Ext.tree.TreeLoader(this.treeConfig.loader);
            this.treeConfig.loader = treeLoader;

            var root = new Ext.tree.AsyncTreeNode(this.treeConfig.root || {
                    text: 'treeRoot'
                });
            this.treeConfig.root = root;

            Ext.apply(treeConfig, this.treeConfig);

            this.tree = new Ext.tree.TreePanel(treeConfig);
            this.tree.getLoader().on('beforeload', this.onBeforeLoad, this);
            this.tree.getLoader().on('load', this.onLoad, this);
            this.tree.on('click', function (n, e) {
                this.clickNode(n, e);
            }, this);
            this.on('expand', function () {
                if (!this.loaded && !this.tree.getLoader().isLoading()) {
                    this.tree.getLoader().load(this.tree.getRootNode());
                }
                this.tgSearch.focus(true, 100);
            }, this);

            this.filtro = new Ext.tree.TreeFilter(this.tree, {
                clearBlank: true,
                autoClear: true
            });

            this.footer = this.list.createChild({cls: cls + '-ft'});
            this.bbarSearch = new Ext.Toolbar({
                renderTo: this.footer
            });

            this.tgSearch = new Ext.components.SearchField({
                hideLabel: true,
                tree: this.tree,
                filtro: this.filtro,
                enableKeyEvents: true,
                width: lw - 50
            });

            /**
             * Boton para expandir el arbol
             * @type {Button}
             */
            this.btnExpand = new Ext.Button({
                tooltip: 'Expandir',
                iconCls: 'expand-all',
                scope: this,
                handler: function () {
                    this.tree.expandAll();
                }
            });

            /**
             * Boton para contraer el arbol
             * @type {Button}
             */
            this.btnCollapse = new Ext.Button({
                tooltip: 'Contraer',
                iconCls: 'collapse-all',
                scope: this,
                handler: function () {
                    this.tree.collapseAll();
                }
            });

            this.bbarSearch.add(this.tgSearch);
            this.bbarSearch.add(this.btnExpand);
            this.bbarSearch.add(this.btnCollapse);

            this.assetHeight += this.footer.getHeight();

            if (this.resizable) {
                this.resizer = new Ext.Resizable(this.list, {
                    pinned: true, handles: 'se'
                });
                this.resizer.on('resize', function (r, w, h) {
                    this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
                    this.listWidth = w;
                    var lw = w - this.list.getFrameWidth('lr');
                    this.innerList.setWidth(lw);
                    this.restrictHeight();
                    this.tgSearch.setWidth(lw - 50);
                }, this);
            }
        }
    },

    getSelectedNode: function () {
        return this.tree.getSelectionModel().getSelectedNode();
    },

    setEditable: function (value) {
        if (value == this.editable) {
            return;
        }
        this.editable = value;
        if (!value) {
            this.el.dom.setAttribute('readOnly', true);
            this.el.on('mousedown', this.onTrigger2Click, this);
            this.el.addClass('x-combo-noedit');
        } else {
            this.el.dom.setAttribute('readOnly', false);
            this.el.un('mousedown', this.onTrigger2Click, this);
            this.el.removeClass('x-combo-noedit');
        }
    },

    isExpanded: function () {
        return this.list && this.list.isVisible();
    },

    collapse: function () {
        if (!this.isExpanded()) {
            return;
        }
        this.list.hide();
        this.triggers[0].hide();
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },

    onLoad: function () {
        if (!this.hasFocus) {
            return;
        }
        this.expand();
        this.loaded = true;
        this.restrictHeight();
    },

    collapseIf: function (e) {
        if (!e.within(this.wrap) && !e.within(this.list)) {
            this.collapse();
        }
    },

    expand: function () {
        if (this.isExpanded() || !this.hasFocus) {
            return;
        }
        this.list.alignTo(this.wrap, this.listAlign);
        this.list.show();
        this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
        Ext.getDoc().on('mousewheel', this.collapseIf, this);
        Ext.getDoc().on('mousedown', this.collapseIf, this);
        this.fireEvent('expand', this);
    },

    onTrigger1Click: function () {
        /*if (this.loaded) {
         //this.el.dom.value = '';
         this.triggers[0].hide();
         this.hasSearch = false;
         this.focus();
         }

         */
        if (typeof this.handler == "function") {
            this.handler.call(this.scope || this, this, e);
        } else if (this.tree) {
            this.fireEvent("click", this);
            this.tree.getLoader().load(this.tree.getRootNode());
            this.tree.getRootNode().expand(true);
        }

    },

    onTrigger2Click: function () {
        if (this.disabled) {
            return;
        }
        if (this.isExpanded()) {
            this.collapse();
            this.el.focus();
        } else {
            this.onFocus({});
            this.onLoad();
            this.el.focus();
            this.triggers[0].show();
        }
        this.focus();
    }
});

Ext.reg("tree_combobox", Ext.components.Tree_ComboBox);

