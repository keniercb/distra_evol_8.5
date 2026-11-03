Ext.define('Nomencladores.controller.IconWindow', {
    extend: 'Ext.app.Controller',

    init: function () {
        var me = this;
        this.listen({
            component: {
                'iconwindow button[action],boundlist pagingtoolbar button[action]': {
                    click: this.onClickAction
                },
                'iconwindow dataview': {
                    selectionchange: this.onSelectView.bind(me)
                },
                'iconwindow combobox': {
                    select: this.onSelectCmb
                },
                'iconwindow searchfield': {
                    onclick1: this.searchOnClick1,
                    keyup: this.searchOnClick2
                }
            }
        });
    },
    onClickAction: function (cmp) {
        switch (cmp.action) {
            case 'update':
                this.onUpdate(cmp);
                break;
            case 'searchicon':
                this.onSearch(cmp);
                break;
            case 'acept':
                this.onAcept(cmp);
                break;
        }
    },
    onUpdate: function (cmp) {
        var store = cmp.up('pagingtoolbar').store;
        store.load();
    },
    onSearch: function (cmp) {
        Ext.create('Nomencladores.view.IconWindow', {
            target: cmp.up('cmbicons')
        }).show();
    },
    onAcept: function (cmp) {
        var window = cmp.up('iconwindow'),
            record = window.dataview.getSelectionModel().getSelection()[0],
            target = window.target;

        if (target) {
            var color = record.data.color ? (' ' + record.data.color) : '';
            target.setValue(record.data.name + color);
            target.setRawValue(record.data.name + color);
        }
        window.close();
        window.fireEvent('addicon', window, record);
    },
    onSelectView: function (sm, records) {
        console.log('onSelectView');
        var window = sm.view.up('iconwindow'),
            btn = window.btnAceptar;
        if (records.length == 1) {
            this.iconselected = records[0];
            btn.enable();
        } else {
            btn.disable();
        }
    },
    onSelectCmb: function (combo, records) {
        console.log('onSelectCmb');
        var me = this,
            dataview = combo.up('iconwindow').dataview,
            stitems = dataview.store.data.items,
            newclass = records[0].data.clase,
            id = records[0].data.id;

        Ext.Array.each(stitems, function (item) {
            if (id != 0) {
                item.data.color = newclass;
            } else {
                item.data.color = '';
            }
        });
        dataview.refresh();
    },
    searchOnClick1: function (field) {
        var window = field.up('iconwindow');
        window.store.clearFilter();
    },
    searchOnClick2: function (field) {
        console.log('searchOnClick2');
        var window = field.up('iconwindow');
        window.store.clearFilter();
        window.store.filterBy(function (record) {
            if (record.data.name.indexOf(field.getValue()) != -1) {
                return true;
            }
        }, this);
    }
});

