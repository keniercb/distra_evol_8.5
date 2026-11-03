Ext.define('ConfContratacion.controller.ConfContratoCompart', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'mainGrid', selector: 'compartgrid'},
        {ref: 'mainWindow', selector: 'compartwindow'},
        {ref: 'mainpanel', selector: 'confcontratocompart'},
        {ref: 'gridEditor', selector: 'gridfiltros'}
    ],

    init: function () {
        var me = this;
        this.getLang();
        this.activeForm = 0;
        this.listen({
            component: {
                'compartgrid': {
                    selectionchange: this.onSelectionChangeMainGrid
                },
                'compartgrid button[action],compartwindow button[action]': {
                    click: this.onClickAction
                },
                'gridfiltros': {
                    selectionchange: this.onSelectionChangeGridEditor,
                    edit: this.onEdit
                },
                'gridfiltros gridcolumn': {
                    render: function (col) {
                        if (col.dataIndex == 'idvalue') {
                            col.getEditor = this.createCmpValor.bind(this);
                        }

                        if (col.dataIndex == 'idcomparison') {
                            col.getEditor = this.createCmbCondicion.bind(this);
                        }
                    }
                },
                'compartwindow': {
                    show: this.onShowWindow,
                    close: function () {
                        this.activeWindow = false;
                    }
                },
                'compartwindow combobox[localId]': {
                    change: this.changeCombo,
                    select: this.selectCombo
                }
            }
        });
    },

    onShowWindow: function (window) {
        this.activeWindow = true;

        if (window.record && window.action == 'edit') {
            this.loadRecord(window.record);
        }

        Ext.TaskManager.start({
            run: this.checkWindow.bind(this),
            interval: 100,
            scope: this
        });
    },

    onClickAction: function (btn) {
        if (!btn.action) {
            return;
        }
        switch (btn.action) {
            case 'acept':
                this.save(btn);
                break;
            case 'apply':
                this.save(btn);
                break;
            case 'cancel':
                this.cancel();
                break;
            case 'add':
                this.createWindow(btn);
                break;
            case 'edit':
                this.createWindow(btn);
                break;
            case 'del':
                this.deleteCompart(btn);
                break;
        }
    },

    createWindow: function (btn) {
        var grid = btn.up('gridpanel'),
            record = grid.getSelectionModel().getSelection()[0];
        Ext.create('ConfContratacion.view.CompartWindow', {
            action: btn.action,
            record: record,
            modelName: grid.modelName
        }).show();
    },

    deleteCompart: function (btn) {
        var grid = btn.up('gridpanel'),
            records = grid.getSelectionModel().getSelection(),
            ids = this.getIds(records),
            msg = this.etiquetas.msgDelConfirm,
            gen = 'f';

        if (ids.length != 0) {
            var concept = ids.length == 1 ? this.etiquetas.lbCompartimentacion : this.etiquetas.lbCompartimentacionPlural,
                concept = concept.toLowerCase(),
                msg = ids.length == 1 ? msg.getSingular(gen).get(concept) : msg.getPlural(gen).get(concept);

            Ext.Msg.show({
                title: this.etiquetas.titleConfirm,
                msg: msg,
                buttons: Ext.Msg.OKCANCEL,
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                fn: function (btn) {
                    if (btn === 'ok') {
                        this.deleteElements(ids);
                    }
                }
            });
        }
    },

    deleteElements: function (ids) {
        var me=this,
            concept = ids.length == 1 ? this.etiquetas.lbCompartimentacion : this.etiquetas.lbCompartimentacionPlural,
            concept = concept.toLowerCase(),
            msg = this.etiquetas.msgDelWait,
            gen = 'f',
            msg = ids.length == 1 ? msg.getSingular(gen).get(concept) : msg.getPlural(gen).get(concept),
            params = {
                ids: Ext.encode(ids),
                responseCfg: {
                    action: 'del',
                    gen: gen,
                    concept: concept,
                    count: ids.length
                }
            };

        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });


        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'deleteConfCompartimentacion'}, this),
            params: params,
            scope: this,
            success: function(response, opts) {
                Ext.MessageBox.hide();
                var obj = Ext.decode(response.responseText);
                console.dir(obj);
            },
            failure: function(response, opts) {
                Ext.MessageBox.hide();
                console.log('server-side failure with status code ' + response.status);
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
               if(me.getMainpanel()){
                    me.getMainpanel().grid.getStore().load();
                }
                if(me.getMainpanelsolicitud()){
                    me.getMainpanelsolicitud().grid.getStore().load();
                }
                if(me.getMainpaneloferta()){
                    me.getMainpaneloferta().grid.getStore().load();
                }
                // this.getMainGrid().getStore().load();
            }
        });
    },

    getIds: function (records) {
        var ids = new Array();
        Ext.each(records, function (record) {
            ids.push(record.data.idcompartimentacion);
        });
        return ids;
    },

    onSelectionChangeMainGrid: function (sm) {
        var me=this, selection = sm.getCount();
        console.log('selectionchange comparticion:', selection, sm);
        if(me.getMainpanel()){
            me.getMainpanel().grid.btnDel.setDisabled(selection == 0);
            me.getMainpanel().grid.btnEdit.setDisabled(selection != 1);
        }
        if(me.getMainpanelsolicitud()){
            me.getMainpanelsolicitud().grid.btnDel.setDisabled(selection == 0);
            me.getMainpanelsolicitud().grid.btnEdit.setDisabled(selection != 1);
        }
        if(me.getMainpaneloferta()){
            me.getMainpaneloferta().grid.btnDel.setDisabled(selection == 0);
            me.getMainpaneloferta().grid.btnEdit.setDisabled(selection != 1);
        }

    },

    onSelectionChangeGridEditor: function (sm) {
        var selection = sm.getCount() == 0;
        this.getGridEditor().btnDel.setDisabled(selection);
    },

    createCmbCondicion: function (record) {
        var config = this.getConfigFiltro(record),
            stCondicion = Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'id'},
                    {name: 'name'}
                ],
                data: config ? config.comparison : []
            });

        return Ext.create('Ext.grid.CellEditor', {
            field: Ext.create('Ext.form.ComboBox', {
                store: stCondicion,
                queryMode: 'local',
                typeAhead: true,
                displayField: 'name',
                valueField: 'id',
                allowBlank: false,
                forceSelection: true,
                listConfig: {
                    loadingText: this.etiquetas.msgLoading,
                    emptyText: '<div class="x-grid-empty">' + this.etiquetas.msgNoDataLoaded + '</div>'
                }
            })
        });
    },

    createCmpValor: function (record) {
        var config = this.getConfigFiltro(record);

        if (config) {
            if (config['source'] && config['source']['data']) {
                return this.getComboLocal(config);
            } else if (config['source']) {
                return this.getComboRemote(config);
            } else if (config['data']) {
                return this.getComboLocal(config);
            } else {
                switch (config['type']) {
                    case 'numeric':
                        return this.getNumberField();
                    case 'string':
                        return this.getTextField();
                    case 'date':
                        return this.getDateField();
                }
            }
        }

        return this.getTextField();
    },

    getComboRemote: function (config) {
        var idfield = config['source']['idfield'] || 'id',
            namefield = config['source']['namefield'] || 'name',
            queryfield = config['source']['queryfield'] || namefield;

        var stValor = Ext.create('Ext.data.Store', {
                pageSize: 10,
                fields: [
                    {name: idfield},
                    {name: namefield}
                ],
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'getValores'}, ModuleMgr.get('ConfContratacion')),
                    reader: {
                        root: 'data',
                        totalProperty: 'count',
                        successProperty: 'success'
                    }
                }
            }),
            editor = Ext.create('Ext.grid.CellEditor', {
                field: Ext.create('Ext.form.ComboBox', {
                    store: stValor,
                    typeAhead: true,
                    flex: 1,
                    displayField: namefield,
                    valueField: idfield,
                    allowBlank: false,
                    forceSelection: true,
                    queryMode: 'remote',
                    queryParam: queryfield,
                    queryDelay: 400,
                    minChars: 1,
                    pageSize: 10,
                    listConfig: {
                        loadingText: this.etiquetas.msgLoading,
                        emptyText: '<div class="x-grid-empty">' + this.etiquetas.msgNoDataLoaded + '</div>'
                    }
                })
            });

        stValor.proxy.extraParams = config['source'];
        stValor.load();

        return editor;
    },

    getComboLocal: function (config) {
        var stValor = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'id'},
                {name: 'name'}
            ],
            data: config['source']['data'] || []
        });
        return Ext.create('Ext.grid.CellEditor', {
            field: Ext.create('Ext.form.ComboBox', {
                store: stValor,
                typeAhead: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                allowBlank: false,
                forceSelection: true,
                listConfig: {
                    loadingText: this.etiquetas.msgLoading,
                    emptyText: '<div class="x-grid-empty">' + this.etiquetas.msgNoDataLoaded + '</div>'
                }
            })
        });
    },

    getNumberField: function () {
        return Ext.create('Ext.grid.CellEditor', {
            field: Ext.create('Ext.form.field.Number')
        });
    },

    getTextField: function () {
        return Ext.create('Ext.grid.CellEditor', {
            field: Ext.create('Ext.form.field.Text')
        });
    },

    getDateField: function () {
        return Ext.create('Ext.grid.CellEditor', {
            field: Ext.create('Ext.form.field.Date')
        });
    },

    getConfigFiltro: function (record) {
        var grid = this.getGridEditor(),
            stFiltro = grid.cmbFiltro.getStore();

        if (record.data.field) {
            var recfiltro = stFiltro.getById(record.data.field),
                config = recfiltro.data.config;
        }

        return config;
    },

    checkWindow: function () {
        var window = this.getMainWindow();
        if (this.activeWindow) {
            var valid = this.windowValid(),
                dirty = this.windowDirty(),
                condicion = valid && dirty;
            window.disableButtons(!condicion);
        } else {
            return false;
        }
    },

    windowValid: function () {
        var window = this.getMainWindow(),
            store = this.getGridEditor().getStore();
        return window.form.getForm().isValid() && store.getCount() != 0;
    },

    windowDirty: function () {
        var window = this.getMainWindow(),
            store = this.getGridEditor().getStore(),
            formdirty = window.form.getForm().isDirty(),
            storedirty = store.originalValue != Ext.encode(this.getFiltros());
        return formdirty || storedirty;
    },

    save: function (btn) {
        var me=this,
            window = this.getMainWindow(),
            concept = this.etiquetas.lbCompartimentacion,
            gen = 'f',
            msg = this.etiquetas.msgWait,
            params = window.form.getForm().getValues();
        params.definicion = Ext.encode(this.getFiltros());
        params.modelName=window.modelName;
        params.responseCfg = {
            action: window.action,
            gen: gen,
            concept: concept,
            count: 1
        };

        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg.getSingular(gen).get(concept),
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'saveConfCompartimentacion'}, this),
            params: params,
            scope: this,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                if (btn.action == 'acept') {
                    this.cancel();
                } else {
                    this.reset();
                }
                if(me.getMainpanel()){
                    me.getMainpanel().grid.getStore().load();
                }
                if(me.getMainpanelsolicitud()){
                    me.getMainpanelsolicitud().grid.getStore().load();
                }
                if(me.getMainpaneloferta()){
                    me.getMainpaneloferta().grid.getStore().load();
                }
                // me.getMainGrid().getStore().load();
            }
        });
    },

    cancel: function () {
        var window = this.getMainWindow();
        window.close();
    },

    reset: function () {
        var form = this.getMainWindow().form,
            grideditor = this.getGridEditor();

        form.getForm().reset();
        grideditor.getStore().removeAll();
    },

    getFiltros: function () {
        var grid = this.getGridEditor(),
            records = grid.getStore().getRange(),
            result = new Array();

        Ext.each(records, function (record) {
            result.push(record.data);
        });
        return result;
    },

    changeCombo: function (combo, value) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);

        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },

    selectCombo: function (combo, records) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);

        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    },

    loadRecord: function (record) {
        var data = Ext.decode(record.data.definicion),
            window = this.getMainWindow(),
            store = this.getGridEditor().getStore();
        window.form.getForm().loadRecord(record);
        store.originalValue = record.data.definicion;
        store.loadData(data);
    },

    onEdit: function (editor, object) {
        var config = this.getConfigFiltro(object.record);
        if (config) {
            if (config['type'] == 'date') {
                var date = Ext.Date.format(object.record.data.idvalue, 'd/m/Y');
                object.record.set('idvalue',date);
            }
        }
    }
});
