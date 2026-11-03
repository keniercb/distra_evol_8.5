Ext.define('TipoContrato.controller.TipoContrato', {
    extend: 'CRM.core.controller.Base',

    views: ['Main'],
    requires: ['TipoContrato.view.ElementoContrato'],
    stores: ['ElementoContrato'],

    refs: [{
        ref: 'treeTipoContrato',
        selector: 'treeTipoContrato'
    }, {
        ref: 'treeElementoContrato',
        selector: 'treeElementoContrato'
    }, {
        ref: 'treeElemento',
        selector: 'treeElemento'
    }, {
        ref: 'configElemento',
        selector: 'configElemento'
    }, {
        ref: 'toolBar',
        selector: 'toolBar'
    }, {
        ref: 'gridCompartimentacion',
        selector: 'gridCompartimentacion'
    }, {
        ref: 'configuracion',
        selector: 'configuracion'
    }],

    init: function () {
        this.listen({
            store: {
                '#TipoContrato': {
                    load: this.loadStore
                }
            },
            component: {
                'treeTipoContrato': {
                    itemcontextmenu: this.contextMenuActions,
                    selectionchange: this.actionSelectTreeTipoContrato,
                    render: this.renderTree
                },
                'tc_main': {
                    afterrender: this.grantActions
                },
                'treeTipoContrato button[action]': {
                    click: this.actionEventClick
                },
                'menuitem[action]': {
                    click: this.actionMenuItemClick
                },
                'treeTipoContrato searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'treeTipoContrato editor': {
                    beforecomplete: this.completeEditor,
                    complete: this.btnAccionsvalidate,
                    startedit: this.disableKeyMap,
                    canceledit: this.enableKeyMap
                },
                'heredarwindow[itemId=heredartipocontrato] button[action=acept]': {
                    click: this.guardarHerenciaTipoContrato
                },
            }
        });

        this.delData = new Array();
        this.etiquetas = LangMgr.getLang(this);
    },

    renderTree: function (tree) {
        tree.module = 'TipoContrato';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(tree, true);
    },

    completeEditor: function (m, value, startValue, eOpts) {
        m.setValue(value.trim());
        if (value != startValue) {
            var models = this.getTreeTipoContrato().getSelectionModel().getLastSelected().parentNode.childNodes;
            for (var j in models) {
                if (models[j].data.denominacion.toLocaleLowerCase() == value.toLocaleLowerCase()) {
                    mostrarMensaje(1, this.etiquetas.lbExisteTC);
                    return false;
                }
            }
        }
    },

    btnAccionsvalidate: function () {
        if (this.getTreeTipoContrato().getSelectionModel().getStore().getModifiedRecords().length > 0 || this.delData.length > 0) {
            this.getTreeTipoContrato().btnGuardar.setDisabled(false);
            this.getTreeTipoContrato().btnCancelar.setDisabled(false);
        } else {
            this.getTreeTipoContrato().btnGuardar.setDisabled(true);
            this.getTreeTipoContrato().btnCancelar.setDisabled(true);
        }
        this.enableKeyMap();
    },

    disableKeyMap: function () {
        this.application.keyMap.disable();
    },

    enableKeyMap: function () {
        this.application.keyMap.enable();
    },

    onSearch: function (field, data) {
        var me = this;
        if (field.getValue() && field.context == 'treeTC') {
            // me.getTreeTipoContrato().getStore().proxy.extraParams = {
            //     'filter': field.getValue()
            // };
            me.getTreeTipoContrato().getStore().clearFilter(true);
            me.getTreeTipoContrato().getStore().filter('denominacion', field.getValue());
            me.getTreeTipoContrato().getStore().load();
        }
    },

    onClear: function (field) {
        if (field.context == 'treeTC') {
            this.upTipoContrato();
        }
    },

     actionSelectTreeTipoContrato: function (sm, records) {
        var btnDel = this.getTreeTipoContrato().tbarTC.btnDel;
        var btnUsar = this.getTreeTipoContrato().tbarTC.btnUsar;
        var btnNoUsar = this.getTreeTipoContrato().tbarTC.btnNoUsar;
        if (records.length > 1 || (records.length == 1 && records[0].data.id != 0)) {
            btnDel.setDisabled(false);
            var todosenuso=records.every(function(x){return x.get('enuso')})
            var ningunoenuso=records.every(function(x){return !x.get('enuso')})
            btnUsar.setDisabled(!ningunoenuso);
            btnNoUsar.setDisabled(!todosenuso);
        } else {
            btnDel.setDisabled(true);
            btnUsar.setDisabled(true);
            btnNoUsar.setDisabled(true);
        }
    },

    loadStore: function (store, operation, eOpts) {
        try {
            this.getTreeTipoContrato().btnGuardar.setDisabled(true);
            this.getTreeTipoContrato().btnCancelar.setDisabled(true);
            if (this.getTreeTipoContrato().tbarTC.buscar.getValue() && eOpts[0].childNodes[1].childNodes.length == 0 && eOpts[1].childNodes[1].childNodes.length == 0) {
                mostrarMensaje(1, this.etiquetas.buscarNoDatos);
            }
        } catch (e) {
            //console.log(e);
        }
    },

    actionEventClick: function (btn) {
        var me = this;
        switch (btn.action) {
            case 'add':
                me.addTipoContrato();
                break;
            case 'acept':
                me.addTipoContrato();
                break;
            case 'del':
                me.delTipoContrato();
                break;
            case 'update':
                me.upTipoContrato();
                break;
            case 'save':
                me.saveTipoContrato();
                break;
            case 'heredarTC':
                me.heredarTipoContrato(btn);
                break;
            case 'cancel':
                me.cancelTipoContrato();
                break;
            case 'expandir':
                this.getTreeTipoContrato().expandAll();
                break;
            case 'contraer':
                this.getTreeTipoContrato().collapseAll();
                break;
            case 'usarTC':
                this.usarTipoContrato(true);
                break;
            case 'nousarTC':
                this.usarTipoContrato(false);
                break;
        }
    },

    contextMenuActions: function (view, list, node, rowIndex, e) {
        var contextMenu;
        if (list.data.tipo) {
            contextMenu = Ext.create('TipoContrato.view.ContextMenu', {
                context: 'treeTC'
            });
            contextMenu.items.items[0].hide();
            contextMenu.showAt(e.getX(), e.getY());
        }
        e.preventDefault();
        this.getTreeTipoContrato().getSelectionModel().select(rowIndex);
    },

    actionMenuItemClick: function (item, e) {
        if (item.context == 'treeTC') {
            var me = this;
            switch (item.action) {
                case 'add':
                    me.addTipoContrato();
                    break;
                case 'mod':
                    var node = me.getTreeTipoContrato().getSelectionModel().getLastSelected();
                    me.getTreeTipoContrato().editingPlugin.startEdit(node, 0);
                    break;
                case 'del':
                    me.delTipoContrato();
                    break;
            }
        }
    },

    addTipoContrato: function () {
        var me = this;
        var node = me.getTreeTipoContrato().getRootNode();
        if (!node) {
            return;
        }
        if (node.data.id == 0) {
            node.set('leaf', false);
            var n = node.appendChild({
                leaf: true,
                editing: true
            });
            if (!node.isExpanded()) {
                node.expand();
            }
            n.set('denominacion', this.etiquetas ['lbNuevoTc']);
            n.set('editable', true);
            n.set('tipo', true);
            me.getTreeTipoContrato().editingPlugin.startEdit(n, 0);
            me.getTreeTipoContrato().btnGuardar.setDisabled(false);
            me.getTreeTipoContrato().btnCancelar.setDisabled(false);
        }
    },

    delTipoContrato: function () {
        var focused = Ext.ComponentQuery.query('searchfield[hasFocus=true]');
        if (focused.length > 0) {
            return;
        }
        var me = this,
            sel = me.getTreeTipoContrato().getSelectionModel().getSelection();
        if (sel.length > 1) {
            mostrarMensaje(2, this.etiquetas.msgDel + this.etiquetas.msgtpP /*+ eliminar*/, function (response) {
                if (response === 'ok') {
                    for (i in sel) {
                        if (sel[i].data.idtipocontrato) {
                            me.delData.push({
                                idtipocontrato: sel[i].data.idtipocontrato,
                                denominacion: sel[i].data.denominacion
                            });
                            sel[i].remove();
                            me.getTreeTipoContrato().btnGuardar.setDisabled(false);
                            me.getTreeTipoContrato().btnCancelar.setDisabled(false);
                        } else {
                            sel[i].remove();
                            me.btnAccionsvalidate();
                        }
                    }
                    me.getTreeTipoContrato().getSelectionModel().select(0);
                }
            });
        } else {
            var node = me.getTreeTipoContrato().getSelectionModel().getLastSelected();
            mostrarMensaje(2, this.etiquetas.msgDel + this.etiquetas.msgtpS, function (response) {
                if (response === 'ok') {
                    if (node.data.idtipocontrato) {
                        me.delData.push({
                            idtipocontrato: node.data.idtipocontrato,
                            denominacion: node.data.denominacion
                        });
                        node.remove();
                        me.getTreeTipoContrato().getSelectionModel().select(0);
                        me.getTreeTipoContrato().btnGuardar.setDisabled(false);
                        me.getTreeTipoContrato().btnCancelar.setDisabled(false);
                    } else {
                        node.remove();
                        me.getTreeTipoContrato().getSelectionModel().select(0);
                        me.btnAccionsvalidate();
                    }
                }
            });
        }
    },

    upTipoContrato: function () {
        var me = this;
        // me.getTreeTipoContrato().getStore().proxy.extraParams = {};
        me.getTreeTipoContrato().getStore().clearFilter();
        this.getTreeTipoContrato().getStore().load({
            callback: function () {
                me.getTreeTipoContrato().tbarTC.buscar.reset();
                me.delData = new Array();
            }
        });
    },

    heredarTipoContrato: function (button) {
        var me = this;
        var win = Ext.create('BaseModule.view.HeredarWindow', {
            itemId: 'heredartipocontrato',
            grid: button.up('treepanel')
        }).show();
    },

    guardarHerenciaTipoContrato: function (button) {
        var me = this, winheredar = button.up('window');
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        winheredar.down('#form_heredar').submit({
            url: UtilsFn.buildUrl({action: 'guardarHerenciaTipoContrato'}, ModuleMgr.get('TipoContrato')),
            params: {
                idestructura: winheredar.down('#tree_estructura').getSelectionModel().getSelection()[0].get('id'),
            },
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if (response['success'] == true) {
                    if (response['code'] == 1) {
                        mostrarMensaje(1, me.etiquetas.msgTipoContratoHeredados);
                        if (winheredar.grid) winheredar.grid.getStore().load();
                        winheredar.close();
                    } else if (response['code'] == 2) {
                        mostrarMensaje(8, me.etiquetas.msgSinTC);
                    } else if (response['code'] == 3) {
                        mostrarMensaje(8, me.etiquetas.msgEntidadActual);
                    }
                } else {
                    mostrarMensaje(6, response['msg'])
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.hide();
//                     mostrarMensaje(7, 'Ha ocurrido un error.')
            }
        });
    },

    cancelTipoContrato: function () {
        var me = this;
        var data = me.getTreeTipoContrato().getStore().getModifiedRecords();
        if (data.length > 0 || this.delData.length > 0) {
            mostrarMensaje(2, this.etiquetas ['lbcancelar'], function (response) {
                if (response === 'ok') {
                    me.upTipoContrato();
                }
            });
        } else {
            me.upTipoContrato();
        }
    },

    saveTipoContrato: function () {
        var me = this;
        var items = me.getTreeTipoContrato().getSelectionModel().getStore().getModifiedRecords();
        var upData = new Array();
        var addData = new Array();
        for (var i in items) {
            if (items[i].get('idtipocontrato')) {
                upData.push({
                    idtipocontrato: items[i].get('idtipocontrato'),
                    denominacion: items[i].get('denominacion'),
                    idestructuracomun: items[i].get('idestructuracomun'),
                    cliente: items[i].parentNode.data.cliente ? 1 : 0,
                    compartimentacion: items[i].get('compartimentacion')
                });
            } else {
                addData.push({
                    idtipocontrato: false,
                    denominacion: items[i].get('denominacion'),
                    idestructuracomun: items[i].get('idestructuracomun'),
                    cliente: items[i].parentNode.data.cliente ? 1 : 0,
                    compartimentacion: items[i].get('compartimentacion')
                });
            }
        }
        if ((addData.length > 0) || (upData.length > 0) || (me.delData.length > 0)) {
            Ext.MessageBox.show({
                title: me.etiquetas.lbPorFavorEspere,
                msg: me.etiquetas.lbGuardando,
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });
            var action = {
                addData: addData ? Ext.encode(addData) : addData,
                upData: upData ? Ext.encode(upData) : upData,
                delData: me.delData ? Ext.encode(me.delData) : me.delData
            };
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'guardartipocontrato'}, me),
                params: action,
                success: function (response, opts) {
                    Ext.MessageBox.hide();
                    var plural = addData.length + upData.length + me.delData.length;
                    me.delData = new Array();
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        if (plural > 1) {
                            mostrarMensaje(1, me.etiquetas.msgGuardarPluralTC);
                        } else {
                            mostrarMensaje(1, me.etiquetas.msgGuardarSingularTC);
                        }
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
                            obj.fallos.del.length > 1 ? mostrarMensaje(1, me.etiquetas.lbEliminarExP) : mostrarMensaje(1, me.etiquetas.lbEliminarExS);
                            fallos += '<ol> <b><U>' + me.etiquetas.lbEliminar + '</U></b>';
                            for (var j in obj.fallos.del) {
                                fallos += '<li>' + obj.fallos.del[j] + me.etiquetas.lbEnUso + '</li>';
                            }
                            fallos += '</ol>'
                        }
                        //Muestra los errores ocuridos en las acciones realizadas
                        /*Ext.Msg.show({
                         title: me.etiquetas.lbGuardarEx,
                         msg: fallos,
                         buttons: Ext.Msg.OK
                         });*/
                    }
                    me.upTipoContrato();
                },
                failure: function (response, opts) {
                    Ext.MessageBox.hide();
                }
            });
        } else {
            Ext.MessageBox.hide();
            mostrarMensaje(1, me.etiquetas.lbNoCambios);
        }
    },

    grantActions: function (tree) {
        this.validateGrantedActions({container: tree});
 },

    usarTipoContrato: function(usar){
        var me=this,
            westernTree=me.getTreeTipoContrato(),
            seleccionados=westernTree.getSelectionModel().getSelection(),
            ids=[];
        seleccionados.forEach(function(x){
            ids.push(x.get('idtipocontrato'));
        });
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'usarEnEntidad'}, me),
            params: {
                arrayIds: ids ? Ext.encode(ids) : ids,
                usar: usar,
            },
            success: function (response, opts) {
                Ext.MessageBox.hide();
                westernTree.getStore().load();
            },
            failure: function (response, opts) {
                Ext.MessageBox.hide();
            }
        });
    }

});
