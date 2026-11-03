Ext.define('GestionCampanna.controller.MainGrid', {
    extend: 'Ext.app.Controller',

    views: ['MainGrid'],

    refs: [{ref: 'MainGrid', selector: 'campannagrid'},
        {ref: 'MainWindow', selector: 'gc_mainwindow'}],

    init: function () {
        var me = this;
        //cargando idioma del modulo
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'campannagrid': {
                    containercontextmenu: this.showContextMenu,
                    itemcontextmenu: function (view, record, item, index, e, eOpts) {
                        var sm = view.up('campannagrid').getSelectionModel();
                        if (sm.getCount() <= 1) {
                            sm.select(record);
                        }
                        this.showContextMenu(view, e);
                    },
                    itemdblclick: this.onItemDblClick,
                    selectionchange: this.onSelection,
                    render: this.onRenderGrid
                },
                'campannagrid button[action]': {
                    click: this.onClickAction
                },
                'menuitem[campanna]': {
                    click: this.onClickAction
                },
                'campannagrid searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
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

    onItemDblClick: function (view) {
        var btn = view.up('gridpanel').btnEdit;
        this.onClickAction(btn);
    },

    onAdd: function (btn) {
        var me = this,

            window = Ext.create('GestionCampanna.view.MainWindow', {
                width: 650,
                height: 490,
                concept: this.etiquetas.lbCampanna,
                layout: 'fit',
                action: btn.action
            });

        window.show(null, function () {
            window.mask = new Ext.LoadMask(window, {msg: me.etiquetas.msgLoading});
            window.mask.show();
            window.cont = 0;

            function hideMask() {
                window.cont++;
                if (btn.action == 'edit' && window.cont == 3 || btn.action == 'add' && window.cont == 1) {
                    window.mask.hide();
                }
            }

            this.prioridad.store.load({
                callback: hideMask
            });

            if (btn.action == 'edit') {
                var record = me.getMainGrid().getSelectionModel().getSelection()[0],
                    idcampanna = record.data.idcampanna;
                window.customFor.getForm().loadRecord(record);

                var userrecord = GestionCampanna.model.CreadoPor.create({
                        idusuario: record.data.idusuario,
                        nombreusuario: record.data.nombreusuario
                    }),
                    monedarecord = GestionCampanna.model.Moneda.create({
                        idmoneda: record.data.idmoneda,
                        codigoiso: record.data.codigoiso
                    });
                window.creadopor.setValue(userrecord);
                window.creadopor.selectedRecord = userrecord;
                window.moneda.setValue(monedarecord);
                window.moneda.selectedRecord = monedarecord;
                window.descripcion.setValue(record.data.descripcion);
                window.descripcion.originalValue = record.data.descripcion;
                this.gridactividad.store.load({
                    params: {
                        idcampanna: idcampanna || 0
                    },
                    callback: hideMask
                });
                this.gridproducto.store.load({
                    params: {
                        idcampanna: idcampanna || 0
                    },
                    callback: hideMask
                });
            }

        });
    },

    onSelection: function (sm) {
        var grid = sm.view.up('gridpanel');
        if (!grid.noactions) {
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
        }
    },

    onDel: function (btn) {
        var me = this,
            selection = me.getMainGrid().getSelectionModel().getSelection(),
            arrayDel = new Array(),
            concept = me.etiquetas.lbCampanna.toLowerCase(),
            msgConfirm = this.etiquetas.msgDelConfirm,
            msgWait = this.etiquetas.msgDelWait,
            mensajeConfirm = msgConfirm.getSingular('f').get(concept),
            mensajeWait = msgWait.getSingular('f').get(concept);

        if (selection.length > 1) {
            concept = me.etiquetas.lbCampannas.toLowerCase();
            mensajeConfirm = msgConfirm.getPlural('f').get(concept);
            mensajeWait = msgWait.getPlural('f').get(concept);
        }

        if (selection.length > 0) {
            mostrarMensaje(2, mensajeConfirm, function (response) {
                if (response === 'ok') {
                    for (var i in selection) {
                        arrayDel.push(selection[i].data.idcampanna)
                    }
                    Ext.MessageBox.show({
                        msg: mensajeWait,
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200}
                    });
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'campdelete'}, me),
                        params: {
                            arrayDel: Ext.encode(arrayDel),
                            responseCfg: {
                                action: 'del',
                                gen: 'f',
                                concept: me.etiquetas.lbCampanna,
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
            case 'chart':
                this.createChart(btn);
                break;
            case 'update':
                this.onUpdate(btn);
                break;
            case 'clearfilters':
                this.onClearFilters(btn);
                break;
        }
    },

    onRenderGrid: function (grid) {
        if (grid.filters) {
            grid.filters.createFilters();
        }
        grid.module = 'GestionCampanna';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid);
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

    onUpdate: function (btn) {
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

    createChart: function (btn) {
        var window = Ext.create('GestionCampanna.view.ChartWindow', {
            width: 650,
            height: 490,
            layout: 'fit',
            action: btn.action
        });

        window.show();
    }
});