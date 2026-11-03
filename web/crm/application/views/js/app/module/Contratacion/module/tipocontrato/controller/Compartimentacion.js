Ext.define('TipoContrato.controller.Compartimentacion', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: 'gridCompartimentacion',
        selector: 'gridCompartimentacion'
    }, {
        ref: 'treeElementoContrato',
        selector: 'treeElementoContrato'
    }, {
        ref: 'treeElemento',
        selector: 'treeElemento'
    }, {
        ref: 'treeTipoContrato',
        selector: 'treeTipoContrato'
    }, {
        ref: 'cmbRolUsuario',
        selector: 'cmbRolUsuario'
    }, {
        ref: 'configuracion',
        selector: 'configuracion'
    }],

    requires: ['TipoContrato.view.ElementoContrato', 'TipoContrato.view.GridCompartimentacion'],
    stores: ['ElementoContrato'],

    init: function () {
        this.listen({
            store: {
                '#RolUsuario': {
                    load: this.loadStore
                }
            },
            component: {
                'gridCompartimentacion': {
                    render: this.renderTree
                },
                'gridCompartimentacion toggleslidefield': {
                    change: this.changeStateToggle
                },
                'cmbRolUsuario': {
                    select: this.selectRolUsuario
                },
                'gridCompartimentacion searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }
            }
        });

        this.etiquetas = LangMgr.getLang(this);
    },

    loadStore: function (store, operation, eOpts) {
        this.getCmbRolUsuario().select(store.data.items[0]);
    },

    renderTree: function (tree) {
        tree.module = 'TipoContrato';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(tree, true);
    },

    onSearch: function (field, data) {
        var me = this;
        if (field.context == 'treeC'){

            me.getGridCompartimentacion().getStore().proxy.extraParams['filter'] = field.getValue();
            me.getGridCompartimentacion().getStore().load();
            me.getGridCompartimentacion().expandAll();
            Ext.TaskManager.start({
                run: function () {
                    if (!Ext.Ajax.isLoading()) {
                        me.getGridCompartimentacion().expandAll();
                        Ext.TaskManager.start({
                            run: function () {
                                if (!Ext.Ajax.isLoading()) {
                                    me.getGridCompartimentacion().expandAll();
                                    var store = me.getGridCompartimentacion().getSelectionModel().getStore().data.items;
                                    for (var i in store) {
                                        if (store[i].isLeaf()) {
                                            return false;
                                        }
                                    }
                                    if (this.getGridCompartimentacion().buscar.getValue()) {
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
        if (field.context == 'treeC'){
            this.getGridCompartimentacion().getStore().proxy.extraParams['filter'] = '';
            this.getGridCompartimentacion().getStore().load();
        }
    },

    selectRolUsuario: function (combo, records, eOpts) {
        var items = this.getGridCompartimentacion().getSelectionModel().getStore().data.items;
        for (var i in items) {
            var compartimentacion = items[i].data.compartimentacion;
            if (compartimentacion) {
                for (var j in compartimentacion) {
                    if (compartimentacion[j]['idrol'] == records[0].data.idrol) {
                        items[i].data.visibilidad = compartimentacion[j]['visibilidad'] == "true" ? true : compartimentacion[j]['visibilidad'] == "false" ? false : compartimentacion[j]['visibilidad'];
                        break;
                    } else {
                        items[i].data.visibilidad = false;
                    }
                }
            } else {
                items[i].data.visibilidad = false;
            }
        }
        var rootElemento = this.getTreeElementoContrato().getRootNode();
        var itemsTipoContrato = this.getTreeTipoContrato().getSelectionModel().getStore().data.items;
        for (var k in itemsTipoContrato) {
            if (itemsTipoContrato[k].data.idtipocontrato == rootElemento.data.idpadre) {
                var compartimentacionTipoContrato = itemsTipoContrato[k].data.compartimentacion;
                if (Array.isArray(compartimentacionTipoContrato)) {
                    for (var j in compartimentacionTipoContrato) {
                        if (compartimentacionTipoContrato[j]['idrol'] == records[0].data.idrol) {
                            rootElemento.data.visibilidad = compartimentacionTipoContrato[j]['visibilidad'] == "true" ? true : compartimentacionTipoContrato[j]['visibilidad'] == "false" ? false : compartimentacionTipoContrato[j]['visibilidad'];
                            rootElemento.data.gestionar = compartimentacionTipoContrato[j]['gestionar'] == "true" ? true : compartimentacionTipoContrato[j]['gestionar'] == "false" ? false : compartimentacionTipoContrato[j]['gestionar'];
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
        try {
            this.getGridCompartimentacion().getView().refresh();
        } catch (e) {
            //console.log(e);
        }
    },

    changeStateToggle: function (me, stateValue, checked, eOpts) {
        var node = this.getGridCompartimentacion().getSelectionModel().getLastSelected();
        stateValue = stateValue == 'true' ? true : stateValue == 'false' ? false : stateValue;
        switch (me.idColumn) {
            case 'visibilidad':
                node.data.visibilidad = stateValue;
                break;
            case 'obligatorio':
                node.set('obligatorio', stateValue);
                this.application.getElementoContratoController().btnAccionsvalidate();
                return;
            case 'gestionar':
                node.data.gestionar = stateValue;
                break;
        }
        if (!node.isRoot()) {
            if (node.data.compartimentacion) {
                for (var i in node.data.compartimentacion) {
                    if (node.data.compartimentacion[i].idrol == this.getCmbRolUsuario().getValue()) {
                        node.data.compartimentacion[i] = {
                            "idrol": this.getCmbRolUsuario().getValue(),
                            "denominacion": this.getCmbRolUsuario().getRawValue(),
                            "visibilidad": node.data.visibilidad,
                        };
                        if (node.raw.compartimentacion && !Ext.Object.equals(JSON.parse(node.raw.compartimentacion)[i], node.data.compartimentacion[i])) {
                            node.dirty = true;
                        } else {
                            var data = node.data;
                            for (var i in data) {
                                if ((i != 'compartimentacion' || i != 'visibilidad') && node.isModified(i)) {
                                    node.dirty = true;
                                    break;
                                } else {
                                    node.dirty = false;
                                }
                            }
                        }
                        this.application.getElementoContratoController().btnAccionsvalidate();
                        return;
                    }
                }
                node.data.compartimentacion.push({
                    "idrol": this.getCmbRolUsuario().getValue(),
                    "denominacion": this.getCmbRolUsuario().getRawValue(),
                    "visibilidad": node.data.visibilidad,
                });
                node.dirty = true;
                this.application.getElementoContratoController().btnAccionsvalidate();
            } else {
                node.data.compartimentacion = new Array();
                node.data.compartimentacion.push({
                    "idrol": this.getCmbRolUsuario().getValue(),
                    "denominacion": this.getCmbRolUsuario().getRawValue(),
                    "visibilidad": node.data.visibilidad,
                });
                node.dirty = true;
                this.application.getElementoContratoController().btnAccionsvalidate();
            }
        } else {
            var items = this.getTreeTipoContrato().getSelectionModel().getStore().data.items;
            for (var k in items) {
                if (items[k].data.idtipocontrato == node.data.idpadre) {
                    var compartimentacion = items[k].data.compartimentacion;
                    if (compartimentacion) {
                        for (var j in compartimentacion) {
                            if (compartimentacion[j]['idrol'] == this.getCmbRolUsuario().getValue()) {
                                items[k].data.compartimentacion[j] = {
                                    "idrol": this.getCmbRolUsuario().getValue(),
                                    "denominacion": this.getCmbRolUsuario().getRawValue(),
                                    "visibilidad": node.data.visibilidad,
                                    "gestionar": node.data.gestionar
                                };
                                if (items[k].raw.compartimentacion && !Ext.Object.equals(JSON.parse(items[k].raw.compartimentacion)[j], items[k].data.compartimentacion[j])) {
                                    items[k].dirty = true;
                                    this.getConfiguracion().btnGuardar.setDisabled(false);
                                } else {
                                    var data = items[k].data;
                                    for (var i in data) {
                                        if ((i != 'compartimentacion') && items[k].isModified(i)) {
                                            items[k].dirty = true;
                                            this.getConfiguracion().btnGuardar.setDisabled(false);
                                            break;
                                        } else {
                                            items[k].dirty = false;
                                            this.application.getElementoContratoController().btnAccionsvalidate();
                                        }
                                    }
                                }
                                this.application.getTipoContratoController().btnAccionsvalidate();
                                return;
                            }
                        }
                        items[k].data.compartimentacion.push({
                            "idrol": this.getCmbRolUsuario().getValue(),
                            "denominacion": this.getCmbRolUsuario().getRawValue(),
                            "visibilidad": node.data.visibilidad,
                            "gestionar": node.data.gestionar
                        });
                        items[k].dirty = true;
                        this.getConfiguracion().btnGuardar.setDisabled(false);
                        this.application.getTipoContratoController().btnAccionsvalidate();
                    } else {
                        items[k].data.compartimentacion = new Array();
                        items[k].data.compartimentacion.push({
                            "idrol": this.getCmbRolUsuario().getValue(),
                            "denominacion": this.getCmbRolUsuario().getRawValue(),
                            "visibilidad": node.data.visibilidad,
                            "gestionar": node.data.gestionar
                        });
                        items[k].dirty = true;
                        this.getConfiguracion().btnGuardar.setDisabled(false);
                        this.application.getTipoContratoController().btnAccionsvalidate();
                    }
                    return;
                }
            }
        }
    }

});
