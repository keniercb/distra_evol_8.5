Ext.define('GestionOportunidad.controller.MainWindow', {
    extend: 'Ext.app.Controller',

    views: ['MainWindow'],

    refs: [{ref: 'MainWindow', selector: 'go_mainwindow'},
        {ref: 'MainGrid', selector: 'oportunidadgrid'},
        {ref: 'clienteGrid', selector: 'clientgrid'}
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);
        this.listen({
            store: {
                '#stClienteOportunidad': {
                    remove: function (store, record) {
                        var id = record.data.idclienteoportunidad;
                        if (id) {
                            this.clientremove.push(id);
                        }
                        this.setCurrentValue(store);
                    },
                    load: this.setOriginalValue,
                    add: this.setCurrentValue
                },
                '#stCreadoPor':{
                    load:function(store){
                        var combo = Ext.ComponentQuery.query('go_mainwindow combobox[name=idusuario]')[0],
                            selectedRecord = combo ? combo.selectedRecord : '';
                        if(selectedRecord){
                            combo.setValue(selectedRecord);
                        }
                    }
                }
            },
            component: {
                'go_mainwindow button[action]': {
                    click: this.onClickAction
                },
                'go_mainwindow': {
                    show: this.onShow,
                    destroy: this.onDestroy
                },
                'go_mainwindow combobox':{
                    select: this.onSelectCombo
                },
                'clientgrid': {
                    selectionchange: this.onSelectionChange
                },
                'clientgrid searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }

            }
        });
    },
//Contar cuantas ventanas estan ejecutandose
    onShow: function (window) {
        this.clientremove = new Array();
        this.activeWindows++;

        var form = window.down('form'),
            basicForm = form.getForm(),
            filter = basicForm.getFields().filter('first', true);

        if(window.action=='add'){
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
// Accion de los botones del window
    onClickAction: function (btn) {
        switch (btn.action) {
            case 'acept':
                this.onSave(btn);
                break;
            case 'apply':
                this.onSave(btn);
                break;
            case 'cancel':
                this.onCancel(btn);
                break;
            case 'add':
                this.onAdd(btn);
                break;
            case 'del':
                this.onDel(btn);
                break;
        }

    },

    onAdd: function (btn) {
        var me = this;
        me.window = Ext.create('GestionOportunidad.view.AddCliente', {
            width: 650,
            height: 490,
            layout: 'fit',
            action: btn.action,
            grid: btn.up('clientegrid')
        });
        me.window.show(null, function () {
            this.custom.getStore().load();
        });

    },

    onDel: function (btn) {
        var grid = this.getClienteGrid(),
            records = grid.getSelectionModel().getSelection();
        grid.getStore().remove(records);
    },
//Guardar la informacion de los campos en dependencia de la accion quq se este ejecutando
    onSave: function (btn) {
        var me = this,
            window = btn.up('go_mainwindow'),
            form = window.down('form').getForm(),
            msg = this.etiquetas.msgWait,
            modrecords = this.getClienteGrid().getStore().getModifiedRecords(),
            modclients = new Array(),
            delclients = this.clientremove,
            metodo = 'insert';

        if (window.action == 'edit') {
            metodo = 'modify'
        }

        Ext.each(modrecords, function (record) {
            modclients.push(record.data);
        });

        //Mostrar mensaje burbuja en dependencia del enero y numero
        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg.getSingular('f').get(me.etiquetas.lbOportinidad.toLowerCase()),
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        form.submit({
            url: UtilsFn.buildUrl({action: metodo}, ModuleMgr.get('GestionOportunidad')),
            scope: this,
            params: {
                responseCfg: {
                    action: window.action,
                    gen: 'f',
                    concept: 'oportunidad',
                    count: 1
                },
                modclients: Ext.encode(modclients),
                delclients: Ext.encode(delclients)
            },
            success: function (form, action) {
                me.clientremove = new Array();
                if (btn.action == 'acept' && form.isValid()) {
                    window.destroy();
                } else {
                    form.reset();
                    me.getClienteGrid().getStore().removeAll();
                }

                if (Ext.MessageBox.isVisible()) {
                    Ext.MessageBox.hide();
                }

                me.getMainGrid().getStore().load();
            },
            failure: function (form, action) {
                if (Ext.MessageBox.isVisible()) {
                    Ext.MessageBox.hide();
                }
            }
        });
    },

    onCancel: function (btn) {
        btn.up('go_mainwindow').close();
    },

    onDestroy: function (btn) {
        this.activeWindows--;
    },

    onSelectionChange: function (sm, records) {
        var btn = this.getClienteGrid().btnDel;
        if (records.length > 0) {
            btn.enable();
        } else {
            btn.disable();
        }
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

    onSelectCombo:function(combo,records){
        combo.selectedRecord = records;
    },

    checkWindow: function (form) {
        if (this.activeWindows != 0) {
            var bForm = form.getForm(),
                window = form.up('go_mainwindow'),
                storecliente = window.grid.getStore(),
                invalid = bForm.hasInvalidField() || !storecliente.currentValue || storecliente.currentValue=='[]',
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
});

