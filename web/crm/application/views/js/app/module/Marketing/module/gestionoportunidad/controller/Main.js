Ext.define('GestionOportunidad.controller.Main', {
    extend: 'Ext.app.Controller',

    views: ['MainGrid'],

    refs: [{ref: 'MainGrid', selector: 'oportunidadgrid'}],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'oportunidadgrid button[action]': {
                    click: this.onClickAction
                },
                'oportunidadgrid searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'oportunidadgrid': {
                    containercontextmenu: this.showContextMenu,
                    itemcontextmenu: function (view, record, item, index, e, eOpts) {
                        var sm = view.up('oportunidadgrid').getSelectionModel();
                        if (sm.getCount() <= 1) {
                            sm.select(record);
                        }
                        this.showContextMenu(view, e);
                    },
                    itemdblclick: this.onItemDblClick,
                    selectionchange: this.selectionChanged,
                    render: this.onRenderGrid
                },
                'menuitem[oportunidad]': {
                    click: this.onClickAction
                },
                'messagebox,window': {
                    beforeshow: this.onBeforeShow,
                    hide: this.onHide
                }
            }
        });
    },

    showContextMenu: function (view, e) {
        var grid = view.up('gridpanel'),
            btnadd = Ext.merge(grid.btnAdd.initialConfig, {
                disabled: grid.btnAdd.isDisabled(),
                oportunidadgrid: grid
            }),
            btnedit = Ext.merge(grid.btnEdit.initialConfig, {
                disabled: grid.btnEdit.isDisabled(),
                oportunidadgrid: grid
            }),
            btndel = Ext.merge(grid.btnDel.initialConfig, {
                disabled: grid.btnDel.isDisabled(),
                oportunidadgrid: grid
            }),
            contextMenu = Ext.create('Ext.menu.Menu', {
                items: [btnadd, btnedit, btndel]
            });
        contextMenu.showAt(e.getX(), e.getY());
        e.preventDefault();
    },

    selectionChanged: function (sm) {
        var grid = sm.view.up('oportunidadgrid');

        var count = sm.getCount(),
            edit = grid.btnEdit,
            del = grid.btnDel;

        if (count == 1) {
            edit.enable();
            del.enable();
        } else if (count > 1) {
            edit.disable();
            del.enable();
        } else {
            edit.disable();
            del.disable();
        }

    },

    onClickAction: function (btn) {
        switch (btn.action) {
            case 'add':
                this.onAdd(btn);
                break;
            case 'edit':
                this.onAdd(btn);
                break;
            case 'del':
                this.onDel(btn);
                break;
            case 'update':
                this.onUpdate(btn);
                break;
            case 'clearfilters':
                this.onClearFilters(btn);
                break;
        }
    },

    onAdd: function (btn) {

        var me = this,
            clase = 'GestionOportunidad.view.MainWindow',
            concepto = me.etiquetas.lbOportinidad.toLowerCase();

        var window = me.window = Ext.create(clase, {
            width: 650,
            height: 490,
            concept: concepto,
            layout: 'fit',
            action: btn.action,
            grid: btn.up('oportunidadgrid') || btn.oportunidadgrid
        });

        //Esperar a que cargue
        me.window.show(null, function () {
            if (btn.concept != 'cliente') {
                window.mask = new Ext.LoadMask(window, {msg: me.etiquetas.msgLoading});
                window.mask.show();
                window.cont = 0;

                function hideMask() {
                    window.cont++;
                    if (window.action == 'edit' && window.cont == 5) {
                        window.mask.hide();
                    } else if (window.cont == 4) {
                        window.mask.hide();
                    }
                }

                this.campannaasociada.store.load({
                    callback: hideMask
                });
                this.prioridad.store.load({
                    callback: hideMask
                });
                this.canal.store.load({
                    callback: hideMask
                });
                this.tipo.store.load({
                    callback: hideMask
                });
                if (btn.action == 'edit') {
                    var record = me.getMainGrid().getSelectionModel().getSelection()[0];
                    me.window.customFormaa.getForm().loadRecord(record);
                    var userrecord = GestionOportunidad.model.CreadoPor.create({
                        idusuario: record.data.idusuario,
                        nombreusuario: record.data.nombreusuario,
                    });
                    me.window.creadopor.setValue(userrecord);
                    me.window.creadopor.selectedRecord = userrecord;
                    me.window.grid.getStore().load({
                        params: {
                            idoportunidad: record.data.idoportunidad
                        },
                        callback: hideMask
                    });
                }
            }
        });
    },

    onDel: function (btn) {
        var me = this,
            selection = me.getMainGrid().getSelectionModel().getSelection(),
            arrayDel = new Array(),
            concept = me.etiquetas.lbOportinidad.toLowerCase(),
            msgConfirm = this.etiquetas.msgDelConfirm,
            msgWait = this.etiquetas.msgDelWait,
            mensajeConfirm = msgConfirm.getSingular('f').get(concept),
            mensajeWait = msgWait.getSingular('f').get(concept);

        if (selection.length > 1) {
            concept = me.etiquetas.lbOportinidades.toLowerCase();
            mensajeConfirm = msgConfirm.getPlural('f').get(concept);
            mensajeWait = msgWait.getPlural('f').get(concept);
        }

        if (selection.length > 0) {
            mostrarMensaje(2, mensajeConfirm, function (response) {
                if (response === 'ok') {
                    for (var i in selection) {
                        arrayDel.push(selection[i].data.idoportunidad)
                    }
                    Ext.MessageBox.show({
                        msg: mensajeWait,
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200}
                    });
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'delete'}, ModuleMgr.get('GestionOportunidad')),
                        params: {
                            arrayDel: Ext.encode(arrayDel),
                            responseCfg: {
                                action: 'del',
                                gen: 'f',
                                concept: me.etiquetas.lbOportinidad.toLowerCase(),
                                count: selection.length
                            }
                        },
                        success: function (response, opts) {
                            Ext.MessageBox.hide();
                            me.getMainGrid().getStore().load();
                        },
                        failure: function (response, opts) {
                            Ext.MessageBox.hide();
                        }
                    });
                }
            });
        }
    },

    onUpdate:function(btn){
        var grid = this.getMainGrid();
        if (btn.fired && grid && grid.store && !grid.store.isLoading()) {
            grid.store.reload();
        }
    },

    onClearFilters: function (btn) {
        var grid = this.getMainGrid();
        grid.filters.clearFilters();
        grid.down('searchfield').reset();
    },

    onItemDblClick: function (view) {
        var btn = view.up('gridpanel').btnEdit;
        this.onClickAction(btn);
    },

    onClear: function (field) {
        var grid = this.getMainGrid(),
            name = 'denominacion';

        if (field.getValue()) {
            field.reset();
        }

        if (field.disabled || !field.hasSearch) {
            return;
        }

        grid.filters.getFilter(name).setValue('');
        grid.filters.getFilter(name).setActive(false);
    },

    onSearch: function (field) {
        var grid = this.getMainGrid(),
            name = 'denominacion';

        if (field.disabled) {
            return;
        }

        grid.filters.getFilter(name).setActive(true);
        grid.filters.getFilter(name).setValue(field.getValue());
    },

    onRenderGrid: function (grid) {
        if (grid.filters) {
            grid.filters.createFilters();
        }
        grid.module = 'GestionOportunidad';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid);
    },

    onHide: function (win) {
        var grid = this.getMainGrid();

        if (!grid) {
            return;
        }
        var cmps = Ext.ComponentQuery.query('grid[id=' + grid.id + '] button[keyMap],grid[id=' + grid.id + '] searchfield[keyMap]');

        for (k in cmps) {
            if (Ext.isBoolean(cmps[k].currentstate)) {
                cmps[k].setDisabled(cmps[k].currentstate);
                cmps[k].currentstate = false;
            }
        }
    },

    onBeforeShow: function (win) {
        var grid = this.getMainGrid();

        if (!grid) {
            return;
        }
        var cmps = Ext.ComponentQuery.query('grid[id=' + grid.id + '] button[keyMap],grid[id=' + grid.id + '] searchfield[keyMap]');

        for (k in cmps) {
            cmps[k].currentstate = !cmps[k].disabled ? false : true;
            cmps[k].disable();
        }
    }

});
