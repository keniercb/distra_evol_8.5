Ext.define('Proformas.controller.ClausulasGrid', {
    extend: 'Ext.app.Controller',
    alias: 'controller.clausulasgrid',

    refs: [
        {
            ref: 'customgrid',
            selector: 'customgrid'
        }
    ],

    init: function () {

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'mainwindow': {
                    afterrender: this.onShowWindow,
                    destroy: this.onCloseWindow
                },
                'customgrid': {
                    selectionchange: this.onItemSelect,
                    beforecellkeydown: function (view,td,cellindex,record,tr,rowindex,event) {
                        if(event.altKey){
                            return false;
                        }
                    }
                },
                'customgrid searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'customgrid button[action]': {
                    click: this.onClickAction
                },
                'clausulasgrid': {
                    afterrender: this.addToKeyMap
                }
            }
        });


    },
    onShowWindow: function (win) {
        if (!this.mainWindow) {
            this.mainWindow = win;
        }
    },
    onCloseWindow: function (win) {
        if (win.id == this.mainWindow.id) {
            this.mainWindow = false;
        }
    },
    onSearch: function (field) {
        var filter = field.getValue().toLowerCase(),
            grid = field.up('grid'),
            store = grid.store,
            expander = grid.plugins[1],
            cont = 0;

        if (field.disabled) {
            return;
        }

        if (!field.getValue()) {
            field.focus();
            return;
        }

        store.filterBy(function (record) {
            var data = record.data;
            for (k in data) {
                if (k != 'idclausula') {

                    var value = data[k].toLowerCase();
                    if (value.indexOf(filter) != -1) {
                        return true;
                    }
                }
            }
        });

        field.hasSearch = true;
    },
    onClear: function (field) {
        var grid = field.up('grid'),
            store = grid.store,
            expander = grid.plugins[1],
            cont = 0;

        if (field.getValue()) {
            field.reset();
        }

        if (field.disabled || !field.hasSearch) {
            return;
        }

        store.clearFilter();
        field.hasSearch = false;
    },
    onClickAction: function (cmp) {
        var grid = cmp.customgrid || cmp.up('customgrid');

        if (grid) {
            switch (cmp.action) {
                case 'add':
                    this.onAdd(cmp);
                    break;
                case 'edit':
                    this.onEdit(cmp);
                    break;
                case 'del':
                    this.onDel(cmp);
                    break;
                case 'up':
                    this.onUp(cmp);
                    break;
                case 'down':
                    this.onDown(cmp);
                    break;
            }
        }
    },
    onItemSelect: function (sm) {
        var count = sm.getCount(),
            records = sm.getSelection(),
            grid = sm.view.up('customgrid'),
            edit = grid.btnEdit,
            del = grid.btnDel,
            up = grid.btnUp,
            down = grid.btnDown;

        if (count == 1) {
            var index = this.getIndex(grid.getStore(), records[0].get('idclausula'));
            edit.enable();
            del.enable();
            if (index != 0) {
                up.enable();
            } else {
                up.disable();
            }
            if (index != grid.getStore().getCount() - 1) {
                down.enable();
            } else {
                down.disable();
            }
        } else if (count > 1) {
            edit.disable();
            del.enable();
            up.disable();
            down.disable();
        } else {
            edit.disable();
            del.disable();
            up.disable();
            down.disable();
        }
    },
    onAdd: function (cmp) {
        if (cmp.disabled) {
            return;
        }
        var grid = cmp.customgrid || cmp.up('customgrid'),
            orden=grid.getStore().getCount();

        this.application.getClausulasWindowController().showWindow(
            cmp, cmp.up('customgrid').tipocontrato,{'orden':orden+1});
    },
    onEdit: function (cmp) {
        if (cmp.disabled) {
            return;
        }
        var grid = cmp.customgrid || cmp.up('customgrid'),
            record=grid.getSelectionModel().getSelection()[0];
        this.application.getClausulasWindowController().showWindow(
            cmp, cmp.up('customgrid').tipocontrato, {'orden':record.get('orden')});
    },
    onDel: function (cmp) {
        var grid = cmp.up('customgrid'),
            records = grid.getSelectionModel().getSelection(),
            concept = this.etiquetas['textNomClausula'].toLowerCase(),
            msg = this.etiquetas.msgDelConfirm,
            gen = 'f';

        if (cmp.disabled) {
            return;
        }

        if (records.length == 1) {
            msg = msg.getSingular(gen).get(concept);
        } else {
            concept = (this.etiquetas['textPlNomClausula'] || this.etiquetas['textNomClausula']).toLowerCase();
            msg = msg.getPlural(gen).get(concept);
        }

        Ext.Msg.grid = grid;
        Ext.Msg.show({
            title: this.etiquetas.titleConfirm,
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn === 'ok') {
                    this.deleteElement(cmp);
                    this.ordenarFilas();
                }
            }
        });
    },
    ordenarFilas: function(){
        var me = this, grid=me.getCustomgrid(), cont=1;

        grid.getStore().getRange().forEach(function(x){
            x.set('orden', cont);
            cont++;
        });
    },
    onUp: function (cmp) {
        var grid = cmp.up('customgrid'),
            store = grid.getStore(),
            record = grid.getSelectionModel().getLastSelected(),
            index = this.getIndex(store, record.get('idclausula'));

        if (cmp.disabled) {
            return;
        }
        if (index >= 0) {
            // index--;
            record.set('orden', index);
            store.remove(record);
            store.insert(index-1, record);
            grid.getSelectionModel().select(index-1);
            // data=store.getRange();
            for(var i=index; i<store.getCount();i++){
                if(store.getAt(i))
                    store.getAt(i).set('orden', i+1);
            }

            grid.getView().refresh();
        }
    },
    onDown: function (cmp) {
        var grid = cmp.up('customgrid'),
            store = grid.getStore(),
            record = grid.getSelectionModel().getLastSelected(),
            index = this.getIndex(store, record.get('idclausula'));

        if (cmp.disabled) {
            return;
        }
        if (index < store.getCount()) {
            // index++;
            record.set('orden', index+2);
            store.getAt(index+1).set('orden', parseInt(store.getAt(index+1).get('orden'))-1);
            store.remove(record);
            store.insert(index+1, record);
            grid.getSelectionModel().select(index+1);
            for(var i=index+3; i<store.getCount();i++){
                if(store.getAt(i))
                    store.getAt(i).set('orden', i+1);
            }
            grid.getView().refresh();
        }
    },
    addToKeyMap: function (clausulagrid) {
        var win = clausulagrid.up('mainwindow'),
            grid = clausulagrid.grid,
            cmps = Ext.ComponentQuery.query('customgrid[id=' + grid.id + '] button[keyMap],customgrid[id=' + grid.id + '] searchfield[keyMap]');

        if (!win.keyMap) {
            win.keyMap = new Ext.util.KeyMap({
                target: Ext.getBody()
            });
        }

        for (k in cmps) {
            var component = cmps[k];
            if (component.xtype != 'tbseparator' && component.keyMap) {

                if (win && win.keyMap) {
                    var keymap = component.keyMap;
                    if (!Ext.isArray(keymap)) {
                        keymap = [keymap];
                    }
                    for (k in keymap) {
                        var binding = keymap[k];

                        binding.fn = function (component) {
                            Ext.EventObject.preventDefault();
                            component.fireEvent(this.event, component);
                        }.bind(binding, component);

                        win.keyMap.addBinding(binding);
                    }
                }
            }
        }
    },
    deleteElement: function (cmp) {
        var grid = cmp.up('customgrid'),
            record = grid.getSelectionModel().getSelection();

        grid.getStore().remove(record);
    },
    getIndex: function (store, idclausula) {
        for (var i = 0; i < store.getCount(); i++) {
            var id = store.getAt(i).get('idclausula');
            if (id == idclausula) {
                return i;
            }
        }
        return -1;
    }
});
