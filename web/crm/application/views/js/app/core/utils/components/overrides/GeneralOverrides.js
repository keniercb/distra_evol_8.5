/**
 * Esta clase sobre escribe y define un conjunto de propiedades y funciones a los componente de Ext.
 *
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author Ing. Alberto Mesa Martinez <amesa@xetid.cu>
 */
Ext.define('CRM.ux.overrides.GeneralOverrides', {
        singleton: true,
        alternateClassName: 'GlobalOverrides',

        init: function(){

            Ext.container.Container.addMembers({
                getLang: function(){
                    return this.etiquetas = LangMgr.loadLanguage(this);
                }
            });

            Ext.override(Ext.data.Store, {
                listeners:{
                    beforeload:  function(store){
                        //console.log('BEFORELOAD:',store.onlyOneLoad, store.loading, store.isLoading(), store.proxy.url, store)
                        if (store.onlyOneLoad && store.isLoading()) {
                            console.log('ABORTADA -> ', store.proxy.url)
                            Ext.Ajax.abort(store.proxy.activeRequest);
                            delete store.proxy.activeRequest;
                        }
                    }
                }
            });

            Ext.override(Ext.data.TreeStore, {

                hasFilter: false,

                filter: function (filters, value, callback, scope) {

                    if (Ext.isString(filters)) {
                        filters = {
                            property: filters,
                            value: value
                        };
                    }

                    var me = this,
                        decoded = me.decodeFilters(filters),
                        i = 0,
                        length = decoded.length;

                    me.data = me.proxy.reader.rawData;

                    me.clearFilter();

                    for (; i < length; i++) {
                        me.filters.replace(decoded[i]);
                    }

                    Ext.Array.each(me.filters.items, function (filter) {

                        filter.filterFn = function (node) {
                            var nodevalue = node.data[filter.property].toLowerCase();
                            var filtervalue = filter.value.toLowerCase();
                            return nodevalue.indexOf(filtervalue) != -1
                        };

                        Ext.Object.each(me.tree.nodeHash, function (key, node) {
                            me.nodeCount++;
                            if (filter.filterFn) {
                                if (!filter.filterFn(node)) node.remove();
                            } else {

                                if (node.data[filter.property].indexOf(filter.value) == -1) node.remove();
                            }
                        });

                        if (Ext.isFunction(callback)) {
                            callback.call(scope);
                        }
                    });
                    me.hasFilter = true;
                },

                clearFilter: function (callback, scope) {
                    var me = this;
                    me.filters.clear();
                    me.hasFilter = false;
                    me.loadData(me.data, callback, scope);
                },

                isFiltered: function () {
                    return this.hasFilter;
                },

                loadData: function (data, callback, scope) {

                    var root = Ext.Object.merge(this.tree.root.data, {
                        children: data
                    });

                    this.setRootNode(root);

                    if (Ext.isFunction(callback)) {
                        callback.call(scope)
                    }
                }
            });

            Ext.override(Ext.Button, {

                initComponent: function () {
                    if (this.iconCls == 'x-tbar-loading') {
                        this.iconCls = 'actualizar';
                    }

                    if (this.iconCls && this.iconCls.split('-').length == 1) {
                        this.iconCls = 'icondistra-' + this.iconCls;
                    }
                    this.callParent();
                }
            });

            Ext.override(Ext.menu.Item, {
                initComponent: function () {
                    if (this.iconCls && this.iconCls.split('-').length == 1) {
                        this.iconCls = 'icondistra-' + this.iconCls;
                    }
                    if (!this.text && this.tooltip) {
                        this.text = this.tooltip;
                    }
                    this.callParent();
                }
            });

            Ext.override(Ext.grid.column.Action, {
                initComponent: function () {
                    this.callParent();
                },
                defaultRenderer: function (v, meta, record, rowIdx, colIdx, store, view) {
                    var me = this,
                        prefix = Ext.baseCSSPrefix,
                        scope = me.origScope || me,
                        items = me.items,
                        len = items.length,
                        i = 0,
                        item, ret, disabled, tooltip;

                    ret = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : '';

                    meta.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
                    for (; i < len; i++) {
                        item = items[i];

                        disabled = item.disabled || (item.isDisabled ? item.isDisabled.call(item.scope || scope, view, rowIdx, colIdx, item, record) : false);
                        tooltip = disabled ? null : (item.tooltip || (item.getTip ? item.getTip.apply(item.scope || scope, arguments) : null));

                        // Only process the item action setup once.
                        if (!item.hasActionConfiguration) {

                            // Apply our documented default to all items
                            item.stopSelection = me.stopSelection;
                            item.disable = Ext.Function.bind(me.disableAction, me, [i], 0);
                            item.enable = Ext.Function.bind(me.enableAction, me, [i], 0);
                            item.hasActionConfiguration = true;
                        }

                        if (item.icon) {
                            ret += '<img role="button" alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
                                '" class="' + prefix + 'action-col-icon ' + prefix + 'action-col-' + String(i) + ' ' + (disabled ? prefix + 'item-disabled' : ' ') +
                                ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : (item.iconCls || me.iconCls || '')) + '"' +
                                (tooltip ? ' data-qtip="' + tooltip + '"' : '') + ' />';
                        } else {
                            ret += '<span role="button" alt="' + (item.altText || me.altText) +
                                '" class="' + prefix + 'action-col-icon ' + prefix + 'action-col-' + String(i) + ' ' + (disabled ? prefix + 'item-disabled' : ' ') +
                                ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : (item.iconCls || me.iconCls || '')) + '"' +
                                (tooltip ? ' data-qtip="' + tooltip + '"' : '') + 'style="display:inline-block;font-size:11px;margin-right:2px"></span>';
                        }
                    }
                    return ret;
                }

            });

            Ext.override(Ext.form.field.TextArea, {
                initComponent: function () {
                    if (this.maxLength <= 255) {
                        this.rows = 2;
                    }
                    this.callParent(arguments);
                }
            });

            Ext.override(Ext.form.field.Hidden, {
                initComponent: function () {
                    this.callParent(arguments);
                },
                setValue: function (value) {
                    var oldValue = !Ext.isEmpty(this.getValue()) ? this.getValue().split(',') : '';

                    if (this.multiSelect && !Ext.isEmpty(value) && Ext.isArray(oldValue)) {
                        for (k in value) {
                            if (oldValue.indexOf(value[k]) == -1) {
                                oldValue.push(value[k]);
                            }
                        }
                        value = oldValue;
                    }

                    this.callParent(arguments);
                }
            });

            Ext.override(Ext.form.field.Base, {
                initComponent: function () {
                    if (!this.allowBlank) {
                        this.allowOnlyWhitespace = false;
                        this.afterLabelTextTpl = '<span style="color:red;font-weight:bold data-qtip="Obligatorio"">*</span>';
                    }
                    this.callParent();
                },
                /*
                 * Se redefine este metodo para que solo se muestre un error durante la validacion
                 */
                setActiveErrors: function (errors) {
                    errors = Ext.Array.from(errors);
                    this.activeError = errors[0];
                    this.activeErrors = [this.activeError];
                    this.activeError = this.getTpl('activeErrorsTpl').apply({
                        errors: this.activeErrors,
                        listCls: Ext.plainListCls
                    });
                    this.renderActiveError();
                }
            });

            Ext.override(Ext.form.field.ComboBox, {
                autoExpand: true,
                listeners: {
                    focus: function (cmb) {
                        if (cmb.autoExpand) {
                            cmb.expand();
                        }
                    }
                },
                initComponent: function () {
                    var me = this;
                    if (me.listConfig) {
                        // Ext.Object.merge(me.listConfig, {
                        //     getInnerTpl: function () {
                        //         return '<div data-qtip="' + (me.labelToolTip ? me.labelToolTip + " : " : "") + '{' + (me.valueToolTip || me.displayField) + '}">{' + me.displayField + '}</div>';
                        //     }
                        // });
                    } else {
                        me.listConfig =  {
                            getInnerTpl: function () {
                                return '<div data-qtip="' + (me.labelToolTip ? me.labelToolTip + " : " : "") + '{' + (me.valueToolTip || me.displayField) + '}">{' + me.displayField + '}</div>';
                            }
                        }
                    }
                    if(!me.listLoadingText)me.listLoadingText='Cargando...';
                    if(!me.listEmptyText)me.listEmptyText='No existen datos que mostrar.';
                    if(me.allowBlank==true && !me.editable){
                        // me.trigger2Cls= 'x-form-clear-trigger';
                        me.trigger2Cls= Ext.baseCSSPrefix + 'form-clear-trigger';
                        me.on('render', function(yo){
                            yo.triggerCell.item(1).setDisplayed(false);
                        })
                        me.on('change', function(yo){
                            console.log('change', Ext.isEmpty(yo.getValue()), yo.getValue())
                            if(yo.triggerCell)
                                yo.triggerCell.item(1).setDisplayed(!Ext.isEmpty(yo.getValue()));
                        })
                    }
                    me.callParent();
                },
                onTrigger2Click : function(){
                    this.setValue('');
                }
            });

            Ext.override(Ext.toolbar.Paging, {
                pageNumb: false,
                steps: 5,
                comboEntradas:4,
                initComponent: function () {
                    this.callParent(this);
                    this.bind(this.store);
                },
                // private
                onRender: function (ct, position) {

                    this.callParent(this, ct, position);

                    if (this.pageNumb == true) {
                        var size = this.store.pageSize || 25,
                            data = new Array();
                        for (var i = 1; i <= this.comboEntradas; i++) {
                            data.push({
                                text: size * i
                            });
                        }

                        var stnum = Ext.create('Ext.data.Store', {
                            fields: ['text'],
                            data: data
                        });

                        this.displayNum = Ext.create('Ext.form.field.ComboBox', {
                            hideLabel: true,
                            store: stnum,
                            displayField: 'text',
                            valueField: 'text',
                            value: this.store.pageSize,
                            width: 60,
                            queryMode: 'local',
                            editable: false
                        });

                        this.initpages();

                        this.insert(16, this.displayNum);
                        this.insert(17, '-');

                        this.store.on({
                            scope: this,
                            load: this.onLoadStore
                        });

                        this.displayNum.on({
                            scope: this,
                            select: function (cmb) {
                                this.store.currentPage = 1;
                                this.store.pageSize = cmb.getValue();
                                this.store.load();
                            }
                        });
                    }

                    if(this.leyenda && Ext.isArray(this.leyenda) && this.leyenda.length>0){
                        // console.log('vamo alla5')
                        var items=[];
                        this.leyenda.forEach(function(x){
                            items.push({
                                xtype: 'label',
                                style: 'background:#DFE9F6;',
                                padding:2,
                                html: (x['class']?'<span class="'+x['class']+'">':'')+
                                    '<h2 style="font-size: 14px" class="x-grid-cell">&nbsp;'+x['text']+'&nbsp;</h2>'+
                                    (x['class']?'</span>':'')
                            });
                        })
                        // console.log('items:', items)
                        this.insert(this.items.length-1,
                            Ext.create('Ext.button.Button',{
                                // xtype: 'textfield',
                                text: 'Leyenda',
                                iconCls: 'inf',
                                // hidden:false,
                                menu: Ext.create('Ext.menu.Menu',{
                                    plain: true,
                                    bodyStyle: 'background:#DFE9F6;',
                                    style: 'background:#DFE9F6;',
                                    defaults:{
                                        bodyStyle: 'background:#DFE9F6;',
                                        style: 'background:#DFE9F6;',
                                        styleHtmlContent: true,
                                    },
                                    // html:'<body heigth="150px">' +
                                    // '<span class="contrademanda"><h2 style="font-size: 13px" class="x-grid-cell">Es una contrademanda</h2></span>' +
                                    // '<span class="eliminado" style="background-color:#DFE9F6"><h2 style="font-size: 13px" class="x-grid-cell">Demanda desactivada</h2></span>'+
                                    // '</body>'
                                    items: items
                                })
                            })
                        );
                    }
                },
                initpages: function () {
                    var me = this;
                    for (var i = 1; i <= this.steps; i++) {
                        var btn = Ext.create('Ext.button.Button', {
                            id: this.id + '_btn' + i,
                            tooltip: 'p&aacute;gina #' + i,
                            text: i,
                            page: i,
                            disabled: true,
                            handler: me.onClickBtn.bind(this)
                        });
                        this.insert(2 + i, btn);
                    }
                    this.insert(2 + i, '-');
                },
                onLoadStore: function () {
                    var pagedata = this.getPageData(),
                        current = pagedata.currentPage,
                        count = pagedata.pageCount,
                        j = (count > this.steps && current - this.getHalfStep() ) >= 1 ? ( current - this.getHalfStep() ) : 1;
                    for (var i = 1; i <= this.steps; i++, j++) {
                        var page = j,
                            btn = Ext.getCmp(this.id + '_btn' + i);

                        btn.page = page;

                        if (page == current) {
                            page = "<b>" + page + "</b>";
                        }

                        btn.setText(page);
                        btn.setTooltip(this.beforePageText + ' # ' + btn.page);

                        if (btn.page <= count) {
                            btn.enable();
                        } else {
                            btn.setText('');
                            btn.setTooltip('');
                            btn.disable();
                        }
                    }
                },
                onClickBtn: function (bnt) {
                    if (bnt.page != this.getPageData().currentPage) {
                        this.store.currentPage = bnt.page;
                        this.store.load();
                    }
                },
                getHalfStep: function () {
                    return parseInt(this.steps / 2);
                }
            });

            Ext.override(Ext.form.field.Date, {
                listeners: {
                    render: function () {
                        var picker = this.getPicker(),
                            me = this,
                            elFilter = Ext.dom.Query.jsSelect('table[id=' + me.id + ']');

                        this.setInitial();

                        picker.on({
                            show: function () {
                                if (me.pickerAutoEight) {
                                    picker.setWidth(elFilter[0].clientWidth);
                                }
                            }
                        });
                    },
                    change: function (field, value) {
                        var date = field.parseDate(value),
                            form = this.up('form');

                        if (form) {
                            form = form.getForm();

                            if (!date) {
                                if (field.endDateField) {
                                    form.findField(field.endDateField).getPicker().setMinDate(null);
                                    form.findField(field.endDateField).setMinValue(null);
                                    form.findField(field.endDateField).dateRangeMin = this.dateRangeMin = '';
                                } else if (field.startDateField) {
                                    form.findField(field.startDateField).getPicker().setMaxDate(null);
                                    form.findField(field.startDateField).setMaxValue(null);
                                    form.findField(field.startDateField).dateRangeMax = this.dateRangeMax = '';
                                }
                                return;
                            }
                            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                                var start = form.findField(field.startDateField);
                                start.setMaxValue(date);
                                start.validate();
                                this.dateRangeMax = date;
                            } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                                var end = form.findField(field.endDateField);
                                end.setMinValue(date);
                                end.validate();
                                this.dateRangeMin = date;
                            }
                        }
                    }
                },
                setInitial: function () {
                    var form = this.up('form');

                    if (form) {
                        form = form.getForm();

                        if (this.endDateField) {
                            if (!this.value) {
                                this.setValue(new Date());
                            }
                            this.originalValue = this.getValue();
                            form.findField(this.endDateField).setMinValue(new Date());
                        }
                    }

                }
            });

            Ext.override(Ext.form.field.File,{
                reset : function(){
                    var me = this,
                        clear = me.clearOnSubmit;
                    if (me.rendered) {
                        me.button.reset(clear);
                        me.fileInputEl = me.button.fileInputEl;
                        if (clear) {
                            me.inputEl.dom.value = '';
                        }
                        me.fireEvent('reset',me);
                    }
                    me.callParent();
                }
            })
        }
    });