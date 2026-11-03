Ext.define('TipoContrato.controller.ElementoContrato', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: 'treeElemento',
        selector: 'treeElemento'
    }, {
        ref: 'treeElementoContrato',
        selector: 'treeElementoContrato'
    }, {
        ref: 'treeTipoContrato',
        selector: 'treeTipoContrato'
    }, {
        ref: 'gridCompartimentacion',
        selector: 'gridCompartimentacion'
    }, {
        ref: 'configElemento',
        selector: 'configElemento'
    }, {
        ref: 'toolBar',
        selector: 'toolBar'
    }, {
        ref: 'configuracion',
        selector: 'configuracion'
    }, {
        ref: 'cmbRolUsuario',
        selector: 'cmbRolUsuario'
    }, {
        ref: 'fuente',
        selector: 'fuente'
    }],

    requires: ['TipoContrato.view.ElementoContrato', 'TipoContrato.view.GridCompartimentacion'],
    stores: ['ElementoContrato'],

    init: function () {
        this.listen({
            store: {
                '#ElementoContrato': {
                    load: this.loadStore,
                    beforeload: this.beforeloadStore
                }
            },
            component: {
                'treeElementoContrato': {
                    itemcontextmenu: this.contextMenuActions,
                    selectionchange: this.actionSelectTreeElementoContrato,
                    render: this.renderTree,
                    load: this.loadRecord
                },
                'treeElementoContrato button[action]': {
                    click: this.actionEventClick
                },
                'treeElementoContrato textfield[action=fuente]': {
                    focus: this.actionFuente
                },
                'treeElementoContrato combo': {
                    select: this.cmbSelect,
                    focus: this.cmbFocus
                },
                'configuracion': {
                    //render: this.renderTree,
                    tabchange: this.activeTab
                },
                'configuracion button[action]': {
                    click: this.actionEventClickConfiguracion
                },
                'menuitem[action]': {
                    click: this.actionMenuItemClick
                },
                'treeElementoContrato actioncolumn': {
                    click: this.actionColumnEventClick
                },
                'treeElemento dataview': {
                    drop: this.dropTreeElemento
                },
                'treeElemento': {
                    beforeitemmove: this.beforedropTreeElemento
                },
                'treeElemento editor': {
                    beforecomplete: this.completeEditor,
                    complete: this.btnAccionsvalidate,
                    startedit: this.disableKeyMap,
                    canceledit: this.enableKeyMap
                },
                'treeElemento searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }
            }
        });

        this.etiquetas = LangMgr.getLang(this);
        this.delData = new Array();
    },

    renderTree: function (tree) {
        tree.module = 'TipoContrato';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(tree, true);
        this.getTreeElemento().getRootNode().expand();
    },

    disableKeyMap: function (editor) {
        if (!editor || !editor.items || editor.items.items[0].action != 'fuente') {
            this.application.keyMap.disable();
        }
    },

    enableKeyMap: function (editor) {
        if (!editor || !editor.items || editor.items.items[0].action != 'fuente') {
            this.application.keyMap.enable();
        }
    },

    activeTab: function (tabPanel, newCard, oldCard, eOpts) {
        if (newCard.title == this.etiquetas.lbConfig) {
            this.getTreeElementoContrato().tbarEC.buscar.setDisabled(false);
            this.getGridCompartimentacion().buscar.setDisabled(true);
        } else {
            this.getTreeElementoContrato().tbarEC.buscar.setDisabled(true);
            this.getGridCompartimentacion().buscar.setDisabled(false);
        }
    },

    btnAccionsvalidate: function () {
        if (this.getTreeElemento().getSelectionModel().getStore().getModifiedRecords().length > 0 || this.delData.length > 0) {
            this.getConfiguracion().btnGuardar.setDisabled(false);
            this.getConfiguracion().btnCancelar.setDisabled(false);
        } else {
            this.getConfiguracion().btnGuardar.setDisabled(true);
            this.getConfiguracion().btnCancelar.setDisabled(true);
        }
        if (this.getTreeTipoContrato().getSelectionModel().getStore().getModifiedRecords().length > 0) {
            this.getConfiguracion().btnGuardar.setDisabled(false);
        }
        this.enableKeyMap();
    },

    completeEditor: function (m, value, startValue, eOpts) {
        m.setValue(value.trim());
        if (value != startValue) {
            var models = this.getTreeElemento().getSelectionModel().getLastSelected().parentNode.childNodes;
            for (var j in models) {
                if (models[j].data.denominacion.toLocaleLowerCase() == value.toLocaleLowerCase()) {
                    mostrarMensaje(1, this.etiquetas.lbExisteEC);
                    return false;
                }
            }
        }
    },

    onSearch: function (field, data) {
        var me = this;
        if (field.context == 'treeEC') {
            me.getTreeElemento().getStore().proxy.extraParams['filter'] = field.getValue();
            me.getTreeElemento().getStore().load();
            me.getTreeElemento().expandAll();
            Ext.TaskManager.start({
                run: function () {
                    if (!Ext.Ajax.isLoading()) {
                        me.getTreeElemento().expandAll();
                        Ext.TaskManager.start({
                            run: function () {
                                if (!Ext.Ajax.isLoading()) {
                                    me.getTreeElemento().expandAll();
                                    var store = me.getTreeElementoContrato().getSelectionModel().getStore().data.items;
                                    for (var i in store) {
                                        if (store[i].isLeaf()) {
                                            return false;
                                        }
                                    }
                                    if (this.getTreeElementoContrato().tbarEC.buscar.getValue()) {
                                        mostrarMensaje(1, me.etiquetas.buscarNoDatos);
                                    }
                                    return false;
                                }
                            },
                            interval: 100,
                            scope: this
                        });
                        return false;
                    }
                },
                interval: 100,
                scope: this
            });
        }
    },

    onClear: function (field) {
        if (field.context == 'treeEC') {
            this.upElementoTipoContrato();
        }
    },

    actionFuente: function (myTextField, The, eOpts) {
        var context = this, win = Ext.create('TipoContrato.view.Fuente');
        var ruta = '', saveValue = '';
        if (context.getTreeElementoContrato().getSelectionModel().getLastSelected().get('ruta')) {
            ruta = context.getTreeElementoContrato().getSelectionModel().getLastSelected().get('ruta');
            console.log('ruta00:', context.getTreeElementoContrato())
            console.log('ruta00:', context.getTreeElementoContrato().getSelectionModel().getLastSelected())
        }
        win.dir.on('change', function (myWin, newValue, oldValue, eOpts) {
            win.campo.setDisabled(false);
            try {
                ruta = win.dir.picker.getSelectionModel().getLastSelected().data.id;
                console.log('ruta:', win)
                console.log('ruta:', win.dir.picker)
                console.log('ruta:', win.dir.picker.getSelectionModel().getLastSelected().data)
            } catch (e) {

            }
            
            win.storeCampo.proxy.extraParams = {
                'ruta': ruta,
                'clase': newValue
            };
            win.storeCampo.load();
            myWin.collapse();
            if (win.getHeight() == win.minHeight) {
                win.setHeight(600);
            }
            var cfg = {
                modelName: newValue,
                title: context.etiquetas.lbValores,
                module: 'Nomencladores',
                noactions: true,
                noHelp: true
            };
            if (newValue == 'DatEstructura') {
                cfg['filter'] = {
                    idproyecto: 0
                }
            }
            // console.log(newValue, cfg)
            win.centerGrid = Ext.create('BaseModule.view.CenterGrid', cfg);
            win.centerGrid.topBar.hide();
            win.centerGrid.store.proxy.extraParams.path = ruta;
            win.add(win.centerGrid);
            if (win.centerGrid.modelName) {
                win.centerGrid.fireEvent('onadded', win.centerGrid);
            }
            win.btnAceptar.setDisabled(false);
            win.center();
        });
        win.btnAceptar.handler = function () {
            var fuente = new Object();
            if (win.dir.getValue()) {
                fuente['clase'] = win.dir.getValue();
                context.getTreeElementoContrato().getSelectionModel().getLastSelected().set('model', win.dir.getValue());
            }
            if (win.centerGrid && win.centerGrid.getSelectionModel().getSelection().length > 0) {
                var selection = win.centerGrid.getSelectionModel().getSelection();
                var cfg = win.centerGrid.formConfiguration;
                for (var j in cfg) {
                    if (cfg[j].hidden) {
                        saveValue = cfg[j].name;
                        break;
                    }
                }
                var array = new Array();
                for (var i in selection) {
                    array.push(selection[i].get(saveValue));
                }
                fuente['idsselection'] = array;
                fuente['campowhere'] = saveValue;
            }
            if (win.campo.getRawValue()) {
                fuente['campo'] = win.campo.getRawValue();
            }
            if (win.dir.picker && win.dir.picker.getSelectionModel().getLastSelected().data.tablename) {
                fuente['tablename'] = win.dir.picker.getSelectionModel().getLastSelected().data.tablename;
            } else if (win.dir['tablename']) {
                fuente['tablename'] = win.dir['tablename'];
            }
            if (win.dir.picker && win.dir.picker.getSelectionModel().getLastSelected().data.id) {
                fuente['ruta'] = win.dir.picker.getSelectionModel().getLastSelected().data.id;
            } else if (win.dir['ruta']) {
                fuente['ruta'] = win.dir['ruta'];
            }
            context.getTreeElementoContrato().getSelectionModel().getLastSelected().set('fuente', fuente);
            try {
                ruta = win.dir.picker.getSelectionModel().getLastSelected().data.id;
            } catch (e) {

            }
            win.destroy();
            context.getTreeElementoContrato().getSelectionModel().getLastSelected().set('ruta', ruta);
            context.btnAccionsvalidate();
        };
        win.on('close', function () {
            context.enableKeyMap();
        });
        win.on('show', function () {
            context.disableKeyMap();
        });
        win.show(null, function () {
            var node = context.getTreeElementoContrato().getSelectionModel().getLastSelected(),
                fuente = node.get('fuente');
            // console.log(fuente)
            if (fuente && !Ext.Object.isEmpty(fuente)) {
                win.dir.setValue(fuente.clase);
                win.dir['tablename'] = fuente.tablename;
                win.dir['ruta'] = fuente.ruta;
                try {
                    win.campo.setValue(fuente.campo);
                } catch (e) {
                    menos = 0;
                }
                win.centerGrid.getStore().on('load', function (store, data) {
                    var cfg = win.centerGrid.formConfiguration;
                    for (var j in cfg) {
                        if (cfg[j].hidden) {
                            saveValue = cfg[j].name;
                            break;
                        }
                    }
                    if (fuente.idsselection) {
                        for (var i in fuente.idsselection) {
                            for (var j = 0 in data) {
                                if (data[j].get(saveValue) == fuente.idsselection[i]) {
                                    var selection = data[j];
                                    break;
                                }
                            }
                            if (selection) {
                                win.centerGrid.getSelectionModel().select(selection, true)
                            }
                        }
                    }
                });
            } else {
                win.dir.expand();
            }
        });
    },

    dropTreeElemento: function (node, data, overModel, dropPosition, eOpts) {
        for (var i in data.records) {
            var parentNode = data.records[i].parentNode;
            data.records[i].set('idpadre', parentNode.isRoot() ? data.records[i].get('idelemento') : parentNode.get('idelemento'));
        }
        this.btnAccionsvalidate();
    },

    beforedropTreeElemento: function (me, oldParent, newParent, index, eOpts) {
        if (oldParent.childNodes.length < 2) {
            oldParent.set('leaf', true);
        }
    },

    cmbSelect: function (combo, records, eOpts) {
        var node = this.getTreeElementoContrato().getSelectionModel().getLastSelected();
        node.set('tipo', records[0].data.tipo);
        node.set('namecomponent', records[0].data.namecomponent);
        node.set('humanlabel', records[0].data.humanlabel);
        if (node.dirty) {
            this.application.getConfigElementoController().actionColumnEventClick(null, null, this.getTreeElementoContrato().getSelectionModel().getStore().indexOf(node), this.getTreeElementoContrato().columnManager.columns.length - 3);
        }
    },

    cmbFocus: function (combo, e, eOpts) {
        combo.expand();
    },

    actionSelectTreeElementoContrato: function (sm, records) {
        var btnDel = this.getTreeElementoContrato().tbarEC.btnDel,
            confElement = this.getConfigElemento();
        if (records.length > 1 || (records.length == 1 && records[0].data.id != 0)) {
            btnDel.setDisabled(false);
        } else {
            btnDel.setDisabled(true);
            confElement.setDisabled(true);
        }
    },

    loadStore: function (store, operation, eOpts) {
        try {
            var rootElemento = this.getTreeElementoContrato().getRootNode();
            var items = this.getTreeTipoContrato().getSelectionModel().getStore().data.items;
            for (var k in items) {
                if (items[k].data.idtipocontrato == rootElemento.data.idpadre) {
                    var compartimentacion = items[k].data.compartimentacion;
                    if (compartimentacion) {
                        for (var j in compartimentacion) {
                            if (compartimentacion[j]['idrol'] == this.getCmbRolUsuario().getValue()) {
                                rootElemento.data.visibilidad = compartimentacion[j]['visibilidad'] == "true" ? true : compartimentacion[j]['visibilidad'] == "false" ? false : compartimentacion[j]['visibilidad'];
                                rootElemento.data.gestionar = compartimentacion[j]['gestionar'] == "true" ? true : compartimentacion[j]['gestionar'] == "false" ? false : compartimentacion[j]['gestionar'];
                                break;
                            } else {
                                rootElemento.data.visibilidad = false;
                                rootElemento.data.gestionar = false;
                            }
                        }
                    } else {
                        rootElemento.data.visibilidad = false;
                        rootElemento.data.gestionar = false;
                    }
                    break;
                }
            }
            for (var i in eOpts) {
                if (eOpts[i].data.cfg) {
                    eOpts[i].data.cfg = JSON.parse(eOpts[i].data.cfg);
                }
                if (eOpts[i].data.event) {
                    eOpts[i].data.event = JSON.parse(eOpts[i].data.event);
                }
                if (eOpts[i].data.fuente) {
                    eOpts[i].data.fuente = JSON.parse(eOpts[i].data.fuente);
                }
                if (eOpts[i].data.expanded) {
                    store.load({node: eOpts[i]});
                }
                eOpts[i].data.depth = parseInt(eOpts[i].data.depth);
                eOpts[i].data.index = parseInt(eOpts[i].data.index);
                if (eOpts[i].data.compartimentacion) {
                    eOpts[i].data.compartimentacion = JSON.parse(eOpts[i].data.compartimentacion);
                    for (var j in eOpts[i].data.compartimentacion) {
                        if (eOpts[i].data.compartimentacion[j]['idrol'] == this.getCmbRolUsuario().getValue()) {
                            eOpts[i].data.visibilidad = eOpts[i].data.compartimentacion[j]['visibilidad'] == "true" ? true : eOpts[i].data.compartimentacion[j]['visibilidad'] == "false" ? false : eOpts[i].data.compartimentacion[j]['visibilidad'];
                            break;
                        }
                    }
                }
            }
            this.getGridCompartimentacion().getView().refresh();
        } catch (e) {
            //console.log(e)
        }
    },

    beforeloadStore: function (store, operation, eOpts) {
        try {
            store.proxy.extraParams['idelemento'] = operation.node.data.idelemento;
        } catch (e) {
            //console.log(e);
        }
    },

    loadRecord: function (m, node, records, successful, eOpts) {
        if (records.length != 0) {
            this.getTreeElementoContrato().getSelectionModel().select(records[0]);
            this.getTreeElementoContrato().tbarEC.btnDel.setDisabled(!records[0]);
            this.getTreeElementoContrato().tbarEC.btnAdd.setDisabled(!records[0]);
        }
    },

    actionEventClick: function (btn) {
        switch (btn.action) {
            case 'add':
                this.addElementoContrato();
                break;
            case 'del':
                this.delElementoContrato();
                break;
            case 'expandir':
                this.getTreeElementoContrato().expandAll();
                break;
            case 'contraer':
                this.getTreeElementoContrato().collapseAll();
                break;
        }
    },

    actionEventClickConfiguracion: function (btn) {
        var me = this;
        switch (btn.action) {
            case 'saveC':
                me.saveElementoTipoContrato();
                break;
            case 'cancelC':
                this.cancelElementoTipoContrato();
                break;
        }
    },

    actionColumnEventClick: function (btn, gridView, rowIndex, colIndex, column, e) {
        var me = this;
        if (rowIndex) {
            me.getTreeElementoContrato().getSelectionModel().select(rowIndex);
        }

        if(btn.context == 'cfgETC'){
            me.application.getConfigElementoController().actionColumnEventClick(null, null, rowIndex, 4);
        }
    },

    contextMenuActions: function (view, list, node, rowIndex, e) {
        if (list.data.id != 0) {
            var contextMenu = Ext.create('TipoContrato.view.ContextMenu', {
                context: 'treeEC'
            });
            contextMenu.showAt(e.getX(), e.getY());
        }
        e.preventDefault();
        this.getTreeElementoContrato().getSelectionModel().select(rowIndex);
    },

    actionMenuItemClick: function (item, e) {
        if (item.context == 'treeEC') {
            var me = this;
            switch (item.action) {
                case 'configurar':
                    var node = this.getTreeElementoContrato().getSelectionModel().getLastSelected();
                    this.application.getConfigElementoController().actionColumnEventClick(null, null, this.getTreeElementoContrato().getSelectionModel().getStore().indexOf(node), this.getTreeElementoContrato().columnManager.columns.length - 3);
                    break;
                case 'add':
                    this.addElementoContrato();
                    break;
                case 'mod':
                    var node = me.getTreeElementoContrato().getSelectionModel().getLastSelected();
                    this.getTreeElementoContrato().editingPlugin.startEdit(node, 0);
                    break;
                case 'del':
                    me.delElementoContrato();
                    break;
            }
        }
    },

    addElementoContrato: function () {
        var me = this;
        var node = me.getTreeElementoContrato().getRootNode();
        if (!node) {
            return;
        }

        node.set('leaf', false);
        var n = node.appendChild({
            leaf: true,
            editing: true
        });
        if (!node.isExpanded()) {
            node.expand();
        }
        n.set('denominacion', me.etiquetas['lbNuevo'] + node.data.denominacion);
        me.getTreeElementoContrato().editingPlugin.startEdit(n, 0);
        me.getConfiguracion().btnGuardar.setDisabled(false);
        me.getConfiguracion().btnCancelar.setDisabled(false);

    },

    delElementoContrato: function () {
        var focused = Ext.ComponentQuery.query('searchfield[hasFocus=true]');
        if (focused.length > 0) {
            return;
        }
        var me = this,
            sel = me.getTreeElementoContrato().getSelectionModel().getSelection(),
            parentNode = sel[0].parentNode;
        if (sel.length > 1) {
            mostrarMensaje(2, this.etiquetas.msgDel + this.etiquetas.msgecP, function (response) {
                if (response === 'ok') {
                    for (var i in sel) {
                        if (sel[i].data.idelemento) {
                            me.delData.push(sel[i].data.idelemento);
                            sel[i].remove();
                            me.getConfiguracion().btnGuardar.setDisabled(false);
                            me.getConfiguracion().btnCancelar.setDisabled(false);
                        } else {
                            sel[i].remove();
                            me.btnAccionsvalidate();
                        }
                    }
                    me.getTreeElementoContrato().getSelectionModel().select(0);
                    if (parentNode && parentNode.childNodes.length == 0 && !parentNode.isRoot()) {
                        parentNode.set('leaf', true);
                    }
                }
            });
        } else {
            var node = me.getTreeElementoContrato().getSelectionModel().getLastSelected();
            mostrarMensaje(2, this.etiquetas.msgDel + this.etiquetas.msgecS, function (response) {
                if (response === 'ok') {
                    if (node.data.idelemento) {
                        me.delData.push(node.data.idelemento);
                        node.remove();
                        me.getTreeElementoContrato().getSelectionModel().select(0);
                        me.getConfiguracion().btnGuardar.setDisabled(false);
                        me.getConfiguracion().btnCancelar.setDisabled(false);
                    } else {
                        node.remove();
                        me.getTreeElementoContrato().getSelectionModel().select(0);
                        me.btnAccionsvalidate();
                    }
                    if (parentNode.childNodes.length == 0 && !parentNode.isRoot()) {
                        parentNode.set('leaf', true);
                    }
                }
            });
        }
    },

    upElementoTipoContrato: function () {
        var me = this;
        me.getTreeElemento().getStore().proxy.extraParams['filter'] = '';
        this.getTreeElementoContrato().getStore().load({
            callback: function () {
                me.getTreeElemento().tbarEC.buscar.reset();
                try {
                    me.getGridCompartimentacion().buscar.reset();
                } catch (e) {
                    //console.log('buscar not render', e)
                }
                me.delData = new Array();
                me.application.getConfigElementoController().resetConfigElemento();
                me.getConfiguracion().btnGuardar.setDisabled(true);
                me.getConfiguracion().btnCancelar.setDisabled(true);
            }
        });
    },

    cancelElementoTipoContrato: function () {
        var me = this;
        me.application.getConfigElementoController().checkValue();
        var data = me.getTreeElementoContrato().getStore().getModifiedRecords();
        if (data.length > 0 || this.delData.length > 0) {
            mostrarMensaje(2, this.etiquetas.lbcancelar, function (response) {
                if (response === 'ok') {
                    me.upElementoTipoContrato();
                }
            });
        } else {
            me.upElementoTipoContrato();
        }
    },

    saveElementoTipoContrato: function () {
        var me = this;
        this.application.getConfigElementoController().checkValue();
        var items = me.getTreeElementoContrato().getSelectionModel().getStore().getModifiedRecords();
        var upData = new Array();
        var addData = new Array();
        var nodeRoot = me.getTreeElementoContrato().getRootNode();
        var pp = new RegExp('(\')', "g");
        for (var i in items) {
            var eventObject = items[i].get('event'), eventFinal = new Object();
            for (var k in eventObject) {
                if (eventObject[k]) {
                    eventFinal[k] = eventObject[k].replace(pp, '\'$&');
                }
            }
            if (items[i].get('idelemento')) {
                upData.push({
                    idelemento: items[i].get('idelemento'),
                    denominacion: items[i].get('denominacion'),
                    tipo: items[i].get('tipo') ? items[i].get('tipo') : "widget",
                    humanlabel: items[i].get('humanlabel') ? items[i].get('humanlabel') : "CAMPO TEXTO",
                    namecomponent: items[i].get('namecomponent') ? items[i].get('namecomponent') : "Campo_texto",
                    mextype: items[i].data.mextype ? items[i].data.mextype : "textfield",
                    fuente: items[i].get('fuente'),
                    model: items[i].get('model'),
                    ruta: items[i].get('ruta'),
                    descripcion: items[i].get('descripcion'),
                    idpadre: items[i].data.idpadre,
                    leaf: items[i].get('leaf'),
                    cfg: items[i].get('cfg') ? items[i].get('cfg') : new Object(),
                    depth: parseInt(items[i].get('depth')),
                    index: parseInt(items[i].get('index')),
                    //orderby: items[i].get('orderby'),
                    event: eventFinal,
                    compartimentacion: items[i].get('compartimentacion') ? items[i].get('compartimentacion') : new Object(),
                    obligatorio: items[i].get('obligatorio') == "true" ? true : items[i].get('obligatorio') == "false" ? false : items[i].get('obligatorio')
                });
            } else {
                addData.push({
                    idelemento: false,
                    denominacion: items[i].get('denominacion'),
                    tipo: items[i].get('tipo') ? items[i].get('tipo') : "widget",
                    humanlabel: items[i].get('humanlabel') ? items[i].get('humanlabel') : "CAMPO TEXTO",
                    namecomponent: items[i].get('namecomponent') ? items[i].get('namecomponent') : "Campo_texto",
                    mextype: items[i].data.mextype ? items[i].data.mextype : "textfield",
                    fuente: items[i].get('fuente'),
                    model: items[i].get('model'),
                    ruta: items[i].get('ruta'),
                    descripcion: items[i].get('descripcion'),
                    idpadre: items[i].parentNode.data.idelemento,
                    cfg: items[i].get('cfg') ? items[i].get('cfg') : new Object(),
                    depth: parseInt(items[i].get('depth')),
                    index: parseInt(items[i].get('index')),
                    //orderby: items[i].get('orderby'),
                    event: eventFinal,
                    compartimentacion: items[i].get('compartimentacion') ? items[i].get('compartimentacion') : new Object(),
                    obligatorio: items[i].get('obligatorio') == "true" ? true : items[i].get('obligatorio') == "false" ? false : items[i].get('obligatorio')
                });
            }
        }
        if ((addData.length > 0) || (upData.length > 0) || (me.delData.length > 0)) {
            this.application.getConfigElementoController().resetConfigElemento();
            if (me.getTreeTipoContrato().getStore().getModifiedRecords().length > 0) {
                me.getTreeTipoContrato().btnGuardar.fireEvent('click', me.getTreeTipoContrato().btnGuardar)
            } else {
                Ext.MessageBox.show({
                    title: me.etiquetas.lbPorFavorEspere,
                    msg: me.etiquetas.lbGuardando,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });
            }
            var action = {
                idtipocontrato: nodeRoot.data.idpadre,
                addData: addData ? Ext.encode(addData) : addData,
                upData: upData ? Ext.encode(upData) : upData,
                delData: me.delData ? Ext.encode(me.delData) : me.delData
            };
            //console.log(addData, upData, me.delData);//return
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'guardarelementotipocontrato'}, me),
                params: action,
                success: function (response, opts) {
                    Ext.MessageBox.hide();
                    var plural = addData.length + upData.length + me.delData.length;
                    me.delData = new Array();
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        if (plural > 1) {
                            mostrarMensaje(1, me.etiquetas.msgGuardarPluralETC);
                        } else {
                            mostrarMensaje(1, me.etiquetas.msgGuardarSingularETC);
                        }
                        me.upElementoTipoContrato();
                    } else {
                        var fallos = '';
                        if (obj.fallos.add) {
                            fallos += '<ol> ' + me.etiquetas.adicionar;
                            for (var j in obj.fallos.add) {
                                fallos += '<li>' + obj.fallos.add[j] + '</li>';
                            }
                            fallos += '</ol>'
                        }
                        if (obj.fallos.edit) {
                            fallos += '<ol> ' + me.etiquetas.modificar;
                            for (var j in obj.fallos.edit) {
                                fallos += '<li>' + obj.fallos.edit[j] + '</li>';
                            }
                            fallos += '</ol>'
                        }
                        if (obj.fallos.del) {
                            fallos += '<ol> ' + me.etiquetas.lbEliminar;
                            for (var j in obj.fallos.del) {
                                fallos += '<li>' + obj.fallos.del[j] + '</li>';
                            }
                            fallos += '</ol>'
                        }
                        Ext.Msg.show({
                            title: me.etiquetas.lbGuardarEx,
                            msg: fallos,
                            buttons: Ext.Msg.OK
                        });
                    }
                },
                failure: function (response, opts) {
                    Ext.MessageBox.hide();
                }
            });
        } else {
            if (me.getTreeTipoContrato().getStore().getModifiedRecords().length > 0) {
                me.getTreeTipoContrato().btnGuardar.fireEvent('click', me.getTreeTipoContrato().btnGuardar)
            } else {
                mostrarMensaje(1, me.etiquetas.lbNoCambios);
                try {
                    Ext.MessageBox.hide();
                } catch (e) {
                    //console.log(e);
                }
            }
        }
    },

});
