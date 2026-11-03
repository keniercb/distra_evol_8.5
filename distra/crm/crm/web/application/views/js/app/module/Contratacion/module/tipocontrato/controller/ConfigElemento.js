Ext.define('TipoContrato.controller.ConfigElemento', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: 'treeElemento',
        selector: 'treeElemento'
    }, {
        ref: 'configElemento',
        selector: 'configElemento'
    }, {
        ref: 'treeElementoContrato',
        selector: 'treeElementoContrato'
    }, {
        ref: 'cmbTipoElemento',
        selector: 'cmbTipoElemento'
    }, {
        ref: 'configuracion',
        selector: 'configuracion'
    }],
    //requires: ['TipoContrato.view.ElementoContrato', 'TipoContrato.view.GridCompartimentacion'],
    stores: ['ElementoContrato'],

    init: function () {
        this.listen({
            component: {
                'configElemento combobox': {
                    expand: this.cmbExpand,
                    select: this.cmbSelect,
                    focus: this.focusCombo
                },
                'configElemento panel': {
                    expand: this.addCodeToEditor,
                    beforecollapse: this.beforecollapsePanelEditor,
                    blureditor: this.blurPanelEditor
                },
                'configElemento': {
                    tabchange: this.tabChange,
                    render: this.renderCfg
                },
                'configElemento propertygrid actioncolumn': {
                    click: this.removeProperty
                },
                'configElemento propertygrid': {
                    propertychange: this.propertyChange
                },
                'configElemento panel tool[type=maximize]': {
                    click: this.onMaximizeClick
                },
                'configElemento panel tool[type=close]': {
                    click: this.onCloseClick
                },
                'configElemento button[context]': {
                    click: this.actionBtnLimpiar
                },
                'treeElementoContrato actioncolumn': {
                    click: this.actionColumnEventClick
                }
            }
        });
        this.etiquetas = LangMgr.getLang(this);
        this.eventParams = new Object();
        this.win = false;
        this.storeTreeElemento = null;
    },

    renderCfg: function (tree) {
        tree.module = 'TipoContrato';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(tree, true);
    },

    actionColumnEventClick: function (btn, gridView, rowIndex, colIndex, column, e) {
        var me = this;
        var col = me.getTreeElementoContrato().columnManager.columns.length;
        me.getTreeElementoContrato().getSelectionModel().select(rowIndex);

        if (!me.getTreeElementoContrato().getSelectionModel().getLastSelected().isRoot()) {
            me.getTreeElementoContrato().setDisabled(true);
            me.getConfiguracion().btnGuardar.setDisabled(true);
            try {
                this.checkValue();
                this.storeTreeElemento = me.getTreeElementoContrato().getSelectionModel().getLastSelected();
                if (this.storeTreeElemento.data.tipo && this.storeTreeElemento.data.namecomponent) {
                    this.getConfigElemento().up().setTitle('<span class="icondistra-configuracion"></span>' + this.storeTreeElemento.get('denominacion'));
                    this.getConfigElemento().storeTreeElemento = this.storeTreeElemento;

                    if (this.getConfigElemento().isDisabled()) {
                        this.getConfigElemento().setDisabled(false);
                    }
                    this.getConfigElemento().up('panel').expand();
                    var tabActive = this.getConfigElemento().getActiveTab().title;
                    if (tabActive == me.etiquetas['lbPropiedades']) {
                        this.getConfigElemento().gdPropiedades.mask();
                    }
                    var nameClass = 'TipoContrato.dataComponent.' + this.storeTreeElemento.data.tipo + '.' + this.storeTreeElemento.data.namecomponent;
                    var component = Ext.create(nameClass);
                    this.storeTreeElemento.set('mextype', component.aliases.widget[0]);
                    if (!Ext.Object.isEmpty(this.storeTreeElemento.data.cfg) && !this.storeTreeElemento.isModified('namecomponent')) {
                        this.getConfigElemento().gdPropiedades.setSource(this.storeTreeElemento.data.cfg)
                    } else {
                        this.getConfigElemento().gdPropiedades.setSource(this.getConfigElementStaticValue(component.members.cfg));
                    }

                    var cfg = Ext.create('Ext.data.Store', {
                        fields: ['cfg', 'value'],
                        data: this.getConfigElement(component.html, component.members.cfg, 'cfg')
                    });
                    this.getConfigElemento().cmbPropiedades.store = cfg;
                    if (tabActive == me.etiquetas['lbPropiedades']) {
                        this.getConfigElemento().setActiveTab(1);
                        this.getConfigElemento().gdPropiedades.unmask();
                        this.getConfigElemento().setActiveTab(0);
                    }
                    this.eventParams = this.getParamsEventElement(component.html, component.members.event, 'event');
                    if (tabActive == me.etiquetas.lbEventos) {
                        this.tabChange(null, this.getConfigElemento().getActiveTab());
                    }
                    if (Ext.Object.isEmpty(this.getConfigElemento().gdPropiedades.getSource())) {
                        this.getConfigElemento().btnLimpiarPropiedades.setDisabled(true);
                    } else {
                        this.getConfigElemento().btnLimpiarPropiedades.setDisabled(false);
                    }
                    me.getTreeElementoContrato().setDisabled(false);
                } else {
                    me.getTreeElementoContrato().setDisabled(false);
                    this.getTreeElementoContrato().editingPlugin.startEdit(rowIndex, 1);
                    mostrarMensaje(1, me.etiquetas.lbSelectComponent);
                }
                me.application.getElementoContratoController().btnAccionsvalidate();
            } catch (e) {
                me.getTreeElementoContrato().setDisabled(false);
                me.application.getElementoContratoController().btnAccionsvalidate();
            }
        }

    },

    actionBtnLimpiar: function (btn) {
        var me = this;
        if (btn.context == 'cfg' && this.getConfigElemento().getActiveTab().title == me.getConfigElemento().gdPropiedades.title) {
            var cfg = me.getConfigElemento().gdPropiedades.getSource();
            for (var i in cfg) {
                me.getConfigElemento().gdPropiedades.removeProperty(i);
            }
            me.checkValue();
        }
    },

    tabChange: function (tabPanel, newCard, oldCard, eOpts) {
        if (newCard.title == this.etiquetas.lbEventos) {
            var panels = newCard.items.items;
            for (var i in panels) {
                var panel = panels[i].items.items;
                for (var j in panel) {
                    panel[j].expand();
                }
            }
        }
    },

    checkValue: function () {
        if (this.storeTreeElemento) {
            this.storeTreeElemento.data.cfg = this.getConfigElemento().gdPropiedades.getSource();
            var event = new Object();
            this.storeTreeElemento.data.event = event;
            if (this.storeTreeElemento.raw.cfg && !Ext.Object.equals(JSON.parse(this.storeTreeElemento.raw.cfg), this.getConfigElemento().gdPropiedades.getSource())) {
                this.storeTreeElemento.dirty = true;
            } else {
                var data = this.storeTreeElemento.data;
                for (var i in data) {
                    if ((i != 'cfg' || i != 'event') && this.storeTreeElemento.isModified(i)) {
                        this.storeTreeElemento.dirty = true;
                        break;
                    } else {
                        this.storeTreeElemento.dirty = false;
                    }
                }
            }
            this.application.getElementoContratoController().btnAccionsvalidate();
            if (Ext.Object.isEmpty(this.getConfigElemento().gdPropiedades.getSource())) {
                this.getConfigElemento().btnLimpiarPropiedades.setDisabled(true);
            } else {
                this.getConfigElemento().btnLimpiarPropiedades.setDisabled(false);
            }
        }
    },

    getConfigElementStaticValue: function (cfg) {
        var sourceCfg = new Object();
        for (var i in cfg) {
            if (cfg[i].staticvalue) {
                sourceCfg[cfg[i].name] = cfg[i].staticvalue;
            }
        }
        return sourceCfg;
    },

    getConfigElement: function (html, cfg, id) {
        var sourceCfg = new Array();
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        var dom = Ext.fly(wrapper);
        for (var i in cfg) {
            if (!cfg[i].staticvalue) {
                var li = dom.select('#' + id + '-' + cfg[i].name + '>.title .docClass');
                if (li.elements.length > 0) {
                    var types = '';
                    for (var j in li.elements) {
                        if (li.elements[j].className != 'defined-in docClass') {
                            if (types == '') {
                                types = li.elements[j].innerHTML;
                            } else {
                                types += '/' + li.elements[j].innerHTML;
                            }
                        }
                    }
                    switch (types) {
                        case 'Number' :
                            sourceCfg.push({'cfg': cfg[i].name, 'value': 0});
                            break;
                        case 'Boolean':
                            sourceCfg.push({'cfg': cfg[i].name, 'value': false});
                            break;
                        default :
                            sourceCfg.push({'cfg': cfg[i].name, 'value': ''});
                            break;
                    }
                }
            }
        }
        return sourceCfg;
    },

    getParamsEventElement: function (html, cfg, id) {
        var sourceCfg = new Object();
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        var dom = Ext.fly(wrapper);
        for (var i in cfg) {
            var li = dom.select('#' + id + '-' + cfg[i].name + '>.title .pre');
            if (li.elements.length > 0) {
                var param = li.elements[0].innerHTML.split(',');
                if (param[0] == 'this') {
                    param[0] = 'me'
                }
            }
            sourceCfg[cfg[i].name] = param.join(',');
        }
        return sourceCfg;
    },

    cmbSelect: function (combo, records, eOpts) {
        var me = this;
        if (combo.context == 'cfg') {
            var source = me.getConfigElemento().gdPropiedades.getSource();
            source[records[0].data.cfg] = records[0].data.value;
            me.getConfigElemento().gdPropiedades.setSource(source);
            me.checkValue();
        }
        combo.setValue('');
    },

    focusCombo: function (combo, The, eOpts) {
        combo.expand();
    },

    blurPanelEditor: function (p, The, eOpts) {
        this.checkValue();
    },

    beforecollapsePanelEditor: function (p, direction, animate, eOpts) {
        this.checkValue();
    },

    addCodeToEditor: function (p, eOpts) {
        var me = this;
        if (this.win) {
            this.win = false;
            if (p.getValue() == '') {
                p.setValue('function (' + this.eventParams[p.title] + ') {}');
            }
            var editor = Ext.create('TipoContrato.view.WithToolbar', {
                theme: 'cobalt',
                parser: 'javascript',
                showInvisible: true,
                printMargin: true
            });
            Ext.create('Ext.window.Window', {
                title: p.title,
                animateTarget: p,
                maximized: true,
                layout: 'fit',
                autoScroll: true,
                items: [
                    editor
                ],
                listeners: {
                    close: function () {
                        p.setValue(editor.getValue());
                        me.checkValue();
                    },
                    show: function () {
                        editor.setValue(p.getValue());
                    }
                }
            }).show();
        } else {
            if (this.storeTreeElemento.data.event[p.title]) {
                p.setValue(this.storeTreeElemento.data.event[p.title])
            }
            if (p.getValue() == '') {
                p.setValue('function (' + this.eventParams[p.title] + ') {}');
            }
        }
        me.checkValue();
    },

    onMaximizeClick: function (p, eOpts) {
        var panel = p.up('withToolbar'), me = this;
        if (panel.getCollapsed() == false) {
            this.win = false;
            var editor = Ext.create('TipoContrato.view.WithToolbar', {
                theme: 'cobalt',
                parser: 'javascript',
                showInvisible: true,
                printMargin: true
            });
            var win = Ext.create('Ext.window.Window', {
                title: panel.title,
                maximized: true,
                animateTarget: panel,
                layout: 'fit',
                autoScroll: true,
                items: [
                    editor
                ],
                listeners: {
                    close: function () {
                        panel.setValue(editor.getValue());
                        me.checkValue();
                    },
                    show: function () {
                        editor.setValue(panel.getValue());
                    }
                }
            }).show();
        } else {
            this.win = true;
            panel.expand();
        }
        me.checkValue();
    },

    onCloseClick: function (p, eOpts) {
        var me = this;
        var panel = p.up('withToolbar');
        mostrarMensaje(2, me.etiquetas.msgDel + me.etiquetas.msgeEventoS, function (response) {
            if (response === 'ok') {
                panel.destroy();
                me.checkValue();
            }
        });
    },

    cmbExpand: function () {

    },

    removeProperty: function (btn, gridView, rowIndex, colIndex, column, e) {
        var me = this;
        var store = me.getConfigElemento().gdPropiedades.getStore();
        var property = store.getProperty(rowIndex).data;
        mostrarMensaje(2, me.etiquetas.msgDel + me.etiquetas.msgeCfgS, function (response) {
            if (response === 'ok') {
                store.remove(property.name);
                me.checkValue();
            }
        });
    },

    propertyChange: function (source, recordId, value, oldValue, eOpts) {
        this.checkValue();
    },

    resetConfigElemento: function (source, recordId, value, oldValue, eOpts) {
        this.getConfigElemento().up().setTitle('<span class="icondistra-configuracion"></span>' + this.etiquetas.lbConfigElemento);
        this.getConfigElemento().setDisabled(true);
        this.getConfigElemento().up().collapse();
    }

});
