Ext.define('GestionCampanna.controller.AddActividad', {
    extend: 'Ext.app.Controller',

    views: ['AddActividad'],

    refs: [{ref: 'AddActividad', selector: 'addactividad'},
        {ref: 'actividadGrid', selector: 'actividadgrid'},
        {ref: 'productGrid', selector: 'productgrid'},
        {ref: 'clienteGrid', selector: 'gc_clientegrid'},
        {ref: 'MainWindow', selector: 'gc_mainwindow'}
    ],

    init: function () {
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#stClienteActividad': {
                    remove: function (store, record) {
                        var id = record.data.idclienteactividad;
                        if (id) {
                            this.clientremove.push(id);
                        }
                        this.setCurrentValue(store);
                    },
                    load: this.setOriginalValue,
                    add: this.setCurrentValue
                }
            },
            component: {
                'addactividad': {
                    show: this.onShow,
                    destroy: this.onDestroy
                },
                'addactividad button[action]': {
                    click: this.onClickAction
                },
                'addactividad combobox[name=idcanal]': {
                    select: function (combo, records) {
                        var denom = records[0].get('denominacion'),
                            window = combo.up('window');
                        window.denomcanal.setValue(denom);

                    }
                },
                'addactividad combobox[name=idprioridad]': {
                    select: function (combo, records) {
                        var denom = records[0].get('denominacion'),
                            window = combo.up('window');
                        window.denomprioridad.setValue(denom);

                    }
                },
                'gc_clientegrid': {
                    selectionchange: this.onSelectionChange
                },
                'gc_clientegrid searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }
            }
        });
    },

    onClickAction: function (btn) {
        switch (btn.action) {
            case 'acept':
                this.onSave(btn);
                break;
            case 'apply':
                this.onSave(btn);
                break;
            case 'add':
                this.onAdd(btn);
                break;
            case 'del':
                this.onDel(btn);
                break;
        }
    },

    onShow: function (window) {
        this.activeWindows = 0;
        this.clientremove = new Array();
        this.activeWindows++;

        var form = window.down('form'),
            basicForm = form.getForm(),
            filter = basicForm.getFields().filter('first', true);

        if (window.action == 'add') {
            var firstField = filter.items[0];

            setTimeout(function () {
                firstField.focus();
            }, 10);
        }

        Ext.TaskManager.start({
            run: this.checkWindow.bind(this, form),
            interval: 100,
            scope: this
        });

    },


    onAdd: function (btn) {
        var me = this;
        me.window = Ext.create('GestionCampanna.view.AddCliente', {
            width: 650,
            height: 490,
            layout: 'fit',
            action: btn.action,
            grid: btn.up('gc_clientegrid')
        });
        me.window.show(null, function () {
            this.custom.getStore().load();
        });

    },

    onSelectionChange: function (sm, records) {
        var btn = this.getClienteGrid().btnDel;
        if (records.length > 0) {
            btn.enable();
        } else {
            btn.disable();
        }
    },

    onDel: function (btn) {
        var grid = this.getClienteGrid(),
            records = grid.getSelectionModel().getSelection();
        grid.getStore().remove(records);
    },

    onSearch: function (field) {
        this.onClear();
        this.getClienteGrid().getStore().filterBy(function (record) {
            var nombre = record.data.nombre.toLowerCase(),
                value = field.getValue().toLowerCase();
            if (nombre.indexOf(value) != -1) {
                return true;
            }
        })
    },

    onClear: function () {
        this.getClienteGrid().getStore().clearFilter();
    },

    onSave: function (btn) {
        var me = this,
            window = btn.up('addactividad'),
            form = window.down('form').getForm(),
            msg = this.etiquetas.msgWait,
            store = window.grid.getStore(),
            values = form.getValues(),
            clientesrecord = this.getClienteGrid().getStore().getModifiedRecords(),
            clientesmodificados = new Array(),
            clienteseliminados = this.clientremove;

        Ext.each(clientesrecord, function (record) {
            clientesmodificados.push(record.data);
        });

        values.clientesmodificados = clientesmodificados;
        values.clienteseliminados = clienteseliminados;

        if (window.action == 'add') {
            store.add(values);
        } else {
            var record = this.getActividadGrid().getSelectionModel().getSelection()[0];
            for (k in values) {
                record.set(k, values[k]);
            }
        }
        if (btn.action == 'apply') {
            form.reset();
            this.getClienteGrid().getStore().removeAll();
            var costo = this.application.getMainWindowController().getCostoDisponible(),
                field = this.getAddActividad().costodisponible;
            field.setValue(costo);
            field.originalValue = costo;
        } else {
            window.close();
        }
        this.clientremove = new Array();
    },
    onDestroy: function (btn) {
        this.activeWindows--;
    },
    checkWindow: function (form) {
        if (this.activeWindows != 0) {
            var bForm = form.getForm(),
                window = form.up('addactividad'),
                storecliente = window.clientegrid.getStore(),
                invalid = bForm.hasInvalidField(),
                change = bForm.isDirty() || storecliente.currentValue != storecliente.originalValue;
            if (window.action == 'edit') {
                invalid = invalid || !change;
            }
            window.disableButtons(invalid);
        } else {
            return false;
        }
    },


    setOriginalValue: function (store, records) {
        var temp = new Array();
        Ext.each(records, function (record) {
            temp.push(record.data);
        });
        var value = Ext.encode(temp)
        store.originalValue = value;
        store.currentValue = value;
    },

    setCurrentValue: function (store) {
        var temp = new Array(),
            records = store.getRange(0);
        Ext.each(records, function (record) {
            temp.push(record.data);
        })
        store.currentValue = Ext.encode(temp);
    }
})
;

