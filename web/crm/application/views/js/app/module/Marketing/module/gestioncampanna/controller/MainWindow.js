Ext.define('GestionCampanna.controller.MainWindow', {
    extend: 'Ext.app.Controller',

    views: ['MainWindow'],

    refs: [{ref: 'MainWindow', selector: 'gc_mainwindow'},
        {ref: 'ActividadGrid', selector: 'actividadgrid'},
        {ref: 'ProductGrid', selector: 'productgrid'},
        {ref: 'MainGrid', selector: 'campannagrid'},
        {ref: 'ClienteGrid', selector: 'clientegrid'},
        {ref: 'AddActividad', selector: 'addactividad'}
    ],

    init: function () {
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#stActividad': {
                    remove: function (store, record) {
                        var id = record.data.idactividad;
                        if (id) {
                            this.actremove.push(id);
                        }
                        this.setCurrentValue(store);
                    },
                    load: this.setOriginalValue
                    ,
                    add: this.setCurrentValue,
                    update: this.setCurrentValue
                },
                '#stCampannaProducto': {
                    remove: function (store, record) {
                        var id = record.data.idcampannaproducto;
                        if (id) {
                            this.prodremove.push(id);
                        }
                        this.setCurrentValue(store);
                    },
                    load: this.setOriginalValue,
                    add: this.setCurrentValue,
                    update: this.setCurrentValue
                },
                '#gc_stCreadoPor': {
                    load: this.onRemoteStoreLoad
                },
                '#stMoneda': {
                    load: this.onRemoteStoreLoad
                }
            },
            component: {
                'gc_mainwindow button[action]': {
                    click: this.onClickAction
                },
                'gc_mainwindow': {
                    show: this.onShow,
                    destroy: this.onDestroy
                },
                'gc_mainwindow [name=costofijo]': {
                    change:this.setCostoDisponible
                },
                'gc_mainwindow actividadgrid': {
                    selectionchange: this.onSelectionChange
                },
                'gc_mainwindow productgrid': {
                    selectionchange: this.onSelectionChange
                },
                'gc_mainwindow combobox[queryMode=remote]': {
                    select: this.onSelectCombo
                },
                'gc_mainwindow productgrid searchfield,gc_mainwindow actividadgrid searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'messagebox,window': {
                    beforeshow: this.onBeforeShow,
                    hide: this.onHide
                }
            }
        });
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
            case 'acept':
                this.onSave(btn);
                break;
            case 'apply':
                this.onSave(btn);
                break;
        }
    },

    onDel: function (btn) {
        var grid = btn.up('gridpanel'),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection();
        store.remove(record);
    },

    //Contar cuantas ventanas estan ejecutandose
    onShow: function (window) {
        this.actremove = new Array();
        this.prodremove = new Array();
        this.activeWindows = 0;
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

        var costo = this.getCostoDisponible();
        window.costodisponible.setValue(costo);

        Ext.TaskManager.start({
            run: this.checkWindow.bind(this, form),
            interval: 100,
            scope: this
        });
    },

    onAdd: function (btn) {
        var me = this,
            fechainicio = me.getMainWindow().fechainicio.getValue(),
            fechafin = me.getMainWindow().fechafin.getValue(),
            campanna = me.getMainWindow().idcampanna.getValue(),
            costodisponible = this.getCostoDisponible(),
            costo = this.getMainWindow().costofijo.getValue();

        if (btn.concept == 'actividad') {

            if ((!fechainicio || !fechafin)) {
                mostrarMensaje(1, me.etiquetas.msgFechaVacia, null, me.etiquetas.titleInfo);
                return;
            }
            else {
                if ((!costo)) {
                    mostrarMensaje(1, me.etiquetas.msgCosto, null, me.etiquetas.titleInfo);
                    return;
                }
            }
            if (costodisponible < 0 && btn.action == 'add') {
                mostrarMensaje(1, this.etiquetas.msgCostoSuperior, null, this.etiquetas.titleInfo);
                return;
            } else {
                if (btn.action == 'edit') {
                    var costovariable = this.getActividadGrid().getSelectionModel().getSelection()[0].data.presupuesto;
                    costodisponible += costovariable;
                }
            }
        }
        var clase = 'GestionCampanna.view.AddActividad',
            concepto = me.etiquetas.lbActividad.toLowerCase(),
            gridname = 'actividadgrid';

        if (btn.concept == 'producto') {
            clase = 'GestionCampanna.view.AddProducto';
            concepto = me.etiquetas.lbProducto.toLowerCase();
            gridname = 'productgrid';
        }

        var window = me.window = Ext.create(clase, {
            width: 650,
            height: 490,
            concept: concepto,
            layout: 'fit',
            action: btn.action,
            grid: btn.up(gridname),
            finicio: fechainicio,
            ffin: fechafin,
            costodisponible: costodisponible,
            campanna: campanna

        });
        me.window.show(null, function () {
            if (btn.concept == 'actividad') {

                window.mask = new Ext.LoadMask(window, {msg: me.etiquetas.msgLoading});
                window.mask.show();
                window.cont = 0;

                function hideMask() {
                    window.cont++;
                    if (btn.action == 'edit' && window.cont == 3 || window.cont == 2) {
                        window.mask.hide();
                    }
                }

                this.prioridad.store.load({
                    callback: hideMask
                });
                this.canal.store.load({
                    callback: hideMask
                });

                if (btn.action == 'edit') {
                    var record = me.getActividadGrid().getSelectionModel().getSelection()[0],
                        idactividad = record.data.idactividad,
                        eliminados = record.data.clienteseliminados;
                    me.window.customForm.getForm().loadRecord(record);
                    me.window.clientegrid.getStore().load({
                        params: {
                            idactividad: idactividad || 0,
                            esOportunidad: 0,
                            eliminados: eliminados ? Ext.encode(eliminados) : 0

                        },
                        callback: function () {
                            hideMask();
                            me.window.clientegrid.getStore().loadData(record.data.clientesmodificados, true);
                        }
                    });
                }
            }

        });
    },

    onDestroy: function (btn) {
        this.activeWindows--;
    },

    onSave: function (btn) {
        var me = this,
            window = btn.up('gc_mainwindow'),
            form = window.down('form').getForm(),
            msg = this.etiquetas.msgWait,
            metodo = 'insert',
            actrecords = window.gridactividad.getStore().getModifiedRecords(),
            prodrecords = window.gridproducto.getStore().getModifiedRecords(),
            actmodificadas = new Array(),
            prodmodificados = new Array();

        for (k in actrecords) {
            actmodificadas.push(actrecords[k].data);
        }
        for (k in prodrecords) {
            prodmodificados.push(prodrecords[k].data);
        }

        if (window.action == 'edit') {
            metodo = 'campmodify'
        }
        //Mostrar mensaje de espera
        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,//por favor espere...
            msg: msg.getSingular('f').get(this.etiquetas.lbCampanna.toLowerCase()),
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        form.submit({
            url: UtilsFn.buildUrl({action: metodo}, ModuleMgr.get('GestionCampanna')),
            scope: this,
            params: {
                responseCfg: {
                    action: window.action,
                    gen: 'f',
                    concept: this.etiquetas.lbCampanna.toLowerCase(),
                    count: 1
                },
                actmodificadas: Ext.encode(actmodificadas),
                acteliminadas: Ext.encode(me.actremove),
                prodmodificados: Ext.encode(prodmodificados),
                prodeliminados: Ext.encode(me.prodremove),
                descripcion: window.descripcion.getValue()
            },
            success: function (form, action) {
                this.actremove = new Array();
                this.prodremove = new Array();
                if (btn.action == 'acept') {
                    window.destroy();
                } else {
                    form.reset();
                    window.gridactividad.getStore().removeAll();
                    window.gridproducto.getStore().removeAll();
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

    onSelectionChange: function (sm) {
        var grid = sm.view.up('gridpanel');

        var count = sm.getCount(),
            del = grid.btnDel,
            edit = grid.btnEdit;

        if (count == 1) {
            del.enable();
            if (edit) {
                edit.enable();
            }
        } else if (count > 1) {
            del.enable();
            if (edit) {
                edit.disable();
            }
        } else {
            del.disable();
            if (edit) {
                edit.disable();
            }
        }

    },

    onSearch: function (field) {
        var grid = field.up('gridpanel'),
            store = grid.getStore(),
            filter = 'denominacion';
        if (store) {
            this.onClear(field);
            store.filterBy(function (record) {
                var nombre = record.data[filter].toLowerCase(),
                    value = field.getValue().toLowerCase();
                if (nombre.indexOf(value) != -1) {
                    return true;
                }
            });
        }
    },

    onSelectCombo: function (combo, records) {
        console.log(combo.selectedRecord);
        combo.selectedRecord = records;
    },

    onClear: function (field) {
        field.up('gridpanel').getStore().clearFilter();
    },

    onRemoteStoreLoad: function (store) {
        console.log(store);
        var window = this.getMainWindow(),
            combo = window.creadopor;
        if (store.concept == 'moneda') {
            combo = window.moneda;
        }
        var selectedRecord = combo.selectedRecord;
        console.log(combo.selectedRecord);
        if (selectedRecord) {
            combo.setValue(selectedRecord);
        }
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
    },

    getCostoDisponible: function () {
        var store = this.getMainWindow().gridactividad.getStore(),
            suma = 0,
            arreglo = store.getCount(),
            costodisponible = 0,
            costofijo = this.getMainWindow().costofijo.getValue();

        for (var i = 0; i < arreglo; i++) {
            var costoact = store.getAt(i).data.presupuesto;
            suma += costoact;
        }
        costodisponible = costofijo - suma;

        return costodisponible;
    },

    getGastos:function(){
        var store = this.getMainWindow().gridactividad.getStore(),
            cant = store.getCount(),
            suma = 0;
        for (var i = 0; i < cant; i++) {
            var costoact = store.getAt(i).data.presupuesto;
            suma += costoact;
        }
        return suma;
    },

    setCostoDisponible: function () {
        var costo = this.getCostoDisponible(),
            gastos = this.getGastos();
        this.getMainWindow().costodisponible.setValue(costo);
        this.getMainWindow().costodisponible.originalValue = costo;
        this.getMainWindow().costofijo.setMinValue(gastos);
    },

    checkWindow: function (form) {
        if (this.activeWindows != 0) {
            var me = this,
                bForm = form.getForm(),
                window = form.up('gc_mainwindow'),
                storeactividad = window.gridactividad.getStore(),
                storeproducto = window.gridproducto.getStore(),
                invalid = bForm.hasInvalidField()
                    || !storeactividad.currentValue || storeactividad.currentValue == '[]'
                    || !storeproducto.currentValue || storeproducto.currentValue == '[]',
                change = bForm.isDirty()
                    || storeactividad.currentValue != storeactividad.originalValue
                    || storeproducto.currentValue != storeproducto.originalValue
                    || window.descripcion.originalValue != window.descripcion.value;

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
        this.setCostoDisponible();
    },

    setCurrentValue: function (store) {
        var temp = new Array(),
            records = store.getRange(0);
        Ext.each(records, function (record) {
            temp.push(record.data);
        })
        store.currentValue = Ext.encode(temp);
        this.setCostoDisponible();
    }
});


