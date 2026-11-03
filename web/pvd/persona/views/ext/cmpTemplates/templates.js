Ext.ns('Ext.components');

Ext.components.Store = function (config) {
    var storeConfig = {
        listeners: {}
    };

    Ext.apply(storeConfig, {
        autoLoad: false
    }, config);

    var recordType = [];

    if (!Ext.isEmpty(config.mapping)) {
        recordType = config.mapping;
    }

    if (!Ext.isEmpty(config.reader)) {
        switch (config.reader.type) {
            case 'JsonReader':
                storeConfig.reader = new Ext.data.JsonReader(config.reader, recordType);
                break;
            case 'XmlReader':
                storeConfig.reader = new Ext.data.XmlReader(config.reader, recordType);
                break;
            case 'ArrayReader':
                storeConfig.reader = new Ext.data.ArrayReader(config.reader, recordType);
                break;
        }
    }

    if (!Ext.isEmpty(config.listeners)) {
        Ext.apply(storeConfig.listeners, config.listeners);
    }

    switch (config.type) {
        case 'Store':
            storeConfig = new Ext.data.Store(storeConfig);
            break;
        case 'SimpleStore':
            storeConfig = new Ext.data.SimpleStore(storeConfig);
            break;
        case 'GroupingStore':
            storeConfig = new Ext.data.GroupingStore(storeConfig);
            break;
    }

    Ext.apply(this, {
        /*load: function (options)
         {
         this.baseParams.mdl = 'persona';
         options = options || {};
         if (this.fireEvent("beforeload", this, options) !== false) {
         this.storeOptions(options);
         var p = Ext.apply(options.params || {}, this.baseParams);
         if (this.sortInfo && this.remoteSort) {
         var pn = this.paramNames;
         p[pn["sort"]] = this.sortInfo.field;
         p[pn["dir"]] = this.sortInfo.direction;
         }
         this.proxy.load(p, this.reader, this.loadRecords, this, options);
         return true;
         } else {
         return false;
         }
         }*/
    }, storeConfig);

    if (config.autoLoad) {
        this.load.defer(10, this, [
            typeof this.autoLoad == 'object' ?
                this.autoLoad : undefined]);
    }
}

Ext.components.GridPanel = Ext.extend(Ext.grid.GridPanel, {
    height: 200,
    frame: true,
    initComponent: function () {
        this.initStoreGrid();

        var configGrid = {
            margins: '5 5 5 5',
            region: 'center',
            loadMask: {
                store: this.store
            },
            store: this.store,
            columns: this.generateColumnModel(),
            sm: this.sm
        };

        if (this.view) {
            switch (this.view.type) {
                case 'GroupingView':
                    configGrid.view = new Ext.grid.GroupingView(this.view);
                    break;
                default :
                    configGrid.view = new Ext.grid.GridView(this.view);
                    break;
            }
        } else if (this.viewConfig) {
            configGrid.viewConfig = this.viewConfig;
        }

        if (!Ext.isEmpty(this.ptbar)) {
            configGrid.bbar = new Ext.PagingToolbar({
                store: this.store,
                displayInfo: true,
                pageSize: this.ptbar.pageSize || 15
            });
        }

        Ext.apply(this, configGrid);

        this.getSelectionModel().on('selectionchange', function (sm) {
            this.fireEvent('selectionchange', sm);
        }, this);
        this.getStore().on('load', function (st, rec, opt) {
            this.fireEvent('load', st, rec, opt);
        }, this);
        this.getStore().on('beforeload', function (st, opt) {
            this.fireEvent('beforeload', st, opt);
        }, this);

        this.on('resize', this.actualizarBox, this, {buffer: 200});
        this.on('expand', this.actualizarBox, this, {buffer: 200});
        Ext.components.GridPanel.superclass.initComponent.call(this);
    },
    initStoreGrid: function () {
        this.store.idpadre = this.idpadre;
        this.store = new Ext.components.Store(this.store);
    },
    generateColumnModel: function () {

        var columnModel = new Array();
        Ext.apply(columnModel, this.columns);

        this.sm = this.sm ? this.sm.type || {type: 'RowSelectionModel'} : {type: 'RowSelectionModel'};

        switch (this.sm.type) {
            case 'CheckboxSelectionModel':
                this.sm = new Ext.grid.CheckboxSelectionModel(this.sm || {});
                columnModel = insert(this.sm.pos || 0, columnModel, this.sm);
                break;
            case 'CellSelectionModel':
                this.sm = new Ext.grid.CellSelectionModel(this.sm || {});
                break;
            default :
                this.sm = new Ext.grid.RowSelectionModel(this.sm || {});
                break;
        }

        function insert(index, array, item) {
            var length = array.length - 1;
            var arrTmp = [];
            while (0 <= length) {
                arrTmp.push(array.pop());
                if (length == index) {
                    array.push(item);
                    length = -1;
                } else {
                    length--;
                }
            }
            length = arrTmp.length;
            while (0 < length) {
                array.push(arrTmp.pop());
                length--;
            }

            return array;
        }

        return columnModel;
    },
    actualizarBox: function () {
        if (this.rendered) {
            this.getView().refresh(true);
            this.onResize();
            this.doLayout();
        }
    },
    loadGridStore: function (params) {
        if (params.idpersona) {
            this.getStore().baseParams.idpersona = params.idpersona;
        } else {
            this.getStore().baseParams.idpersona = null;
        }
        this.getStore().load({
            params: params || {empty: ''}
        });
        this.dirty = false;
    }
});
Ext.reg('grid_panel', Ext.components.GridPanel);

Ext.components.GestPanel = Ext.extend(Ext.Panel, {
    layout: 'border',
    height: 300,
    arrAdd: [],
    arrDel: [],
    initButtons: function () {
        this.lang = {};
        if (typeof this.getLanguaje === 'function') {
            this.lang = this.getLanguaje(perfil.idioma);
        }
        this.btnAdicionar = new Ext.Button({
            text: 'Ad<u>i</u>cionar',
            iconCls: 'adicionar',
            tooltip: !Ext.isEmpty(this.lang) ? this.lang.ttBtnAdd : '',
            disabled: true,
            scope: this,
            handler: this.adicionarHandler.createSequence(function () {
                this.setAccion('ADD');
                this.fpFormulario.expand();

            }, this)
        });

        this.btnModificar = new Ext.Button({
            text: '<u>M</u>odificar',
            iconCls: 'modificar',
            tooltip: !Ext.isEmpty(this.lang) ? this.lang.ttBtnMod : '',
            disabled: true,
            scope: this,
            handler: this.modificarHandler.createInterceptor(function () {
                this.setAccion('MOD');
                this.loadFormulario();
            }, this)
        });

        this.btnEliminar = new Ext.Button({
            text: 'Eliminar',
            iconCls: 'eliminar',
            tooltip: !Ext.isEmpty(this.lang) ? this.lang.ttBtnDel : '',
            disabled: true,
            scope: this,
            handler: this.eliminarHandler.createInterceptor(function () {
                this.cancelarHandler();
            }, this)
        });

        this.btnSave = new Ext.Button({
            id: 'save' + this.getId(),
            text: 'Aceptar',
            disabled: true,
            tooltip: !Ext.isEmpty(this.lang) ? this.lang.ttBtnSave : '',
            iconCls: 'aceptar',
            scope: this,
            handler: function () {
                if (this.validateForm()) {
                    this.guardarHandler();
                }
            }
        });

        this.btnAplicar = new Ext.Button({
            id: 'aplicar' + this.getId(),
            text: 'Aplicar',
            disabled: true,
            tooltip: !Ext.isEmpty(this.lang) ? this.lang.ttBtnApl : '',
            iconCls: 'aplicar',
            scope: this,
            handler: function () {
                if (this.validateForm()) {
                    this.aplicarHandler();
                }
            }
        });

        this.btnCancelar = new Ext.Button({
            id: 'cancelar' + this.getId(),
            text: 'Cancelar',
            tooltip: !Ext.isEmpty(this.lang) ? this.lang.ttBtnCancel : '',
            iconCls: 'cancelar',
            scope: this,
            handler: this.cancelarHandler
        });
    },
    initStoreGrid: function () {
        this.store.idpadre = this.idpadre;
        this.stGrid = new Ext.components.Store(this.store);
        this.stGrid.addListener('update', this.changeToDirty, this);
        this.stGrid.addListener('add', this.changeToDirty, this);
        this.stGrid.addListener('remove', this.changeToDirty, this);
    },
    initGrid: function () {

        this.initStoreGrid();

        var configGrid = {
            margins: '5 5 0 5',
            region: 'center',
            loadMask: {
                store: this.stGrid
            },
            store: this.stGrid,
            columns: this.generateColumnModel(),
            sm: this.sm,
            keys: [
                {
                    stopEvent: true,
                    key: Ext.EventObject.I,
                    fn: this.btnAdicionar.handler,
                    scope: this
                },
                {
                    stopEvent: true,
                    key: Ext.EventObject.M,
                    fn: this.btnModificar.handler,
                    scope: this
                },
                {
                    stopEvent: true,
                    key: Ext.EventObject.DELETE,
                    fn: this.btnEliminar.handler,
                    scope: this
                }
            ]
        };

        if (this.view) {
            switch (this.view.type) {
                case 'GroupingView':
                    configGrid.view = new Ext.grid.GroupingView(this.view);
                    break;
                default :
                    configGrid.view = new Ext.grid.GridView(this.view);
                    break;
            }
        } else if (this.viewConfig) {
            configGrid.viewConfig = this.viewConfig;
        }

        if (!Ext.isEmpty(this.ptbar)) {
            configGrid.bbar = new Ext.PagingToolbar({
                store: this.stGrid,
                displayInfo: true,
                pageSize: this.ptbar.pageSize || 15
            });
        }

        configGrid.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar];

        if (typeof this.addBotones == "function") {
            var v = this.addBotones();
            Ext.applyIf(this, v);
            for (var p in v) {
                configGrid.tbar.push(this[p]);
            }
        }

        if (this.children instanceof Array) {
            configGrid.margins = '5 5 5 5';
        }

        this.gpGrid = new Ext.grid.GridPanel(configGrid);

        this.gpGrid.on('rowdblclick', function (gp) {
            if (gp.getSelectionModel().getCount() == 1) {
                this.btnModificar.handler.call(this);
            }
        }, this);
        this.gpGrid.getSelectionModel().on('selectionchange', function (sm) {
            this.fireEvent('selectionchange', sm);
        }, this);
        this.gpGrid.getStore().on('load', function (st, rec, opt) {
            this.fireEvent('load', st, rec, opt);
        }, this);
        this.gpGrid.getStore().on('beforeload', function (st, opt) {
            this.fireEvent('beforeload', st, opt);
        }, this);
        this.gpGrid.on('render', function () {
            this.btnAdicionar.focus(true, 100);
        }, this, {buffer: 200});
    },
    generateColumnModel: function () {

        function multiSelectionHandler(sm) {
            if (sm.getCount() == 1) {
                this.btnModificar.enable();
                this.btnEliminar.enable();
            } else if (sm.getCount() > 1) {
                this.btnModificar.disable();
            } else {
                this.btnModificar.disable();
                this.btnEliminar.disable();
            }
        }

        var columnModel = new Array();
        Ext.apply(columnModel, this.columns);

        this.sm = this.sm ? this.sm.type || {type: 'RowSelectionModel'} : {type: 'RowSelectionModel'};

        switch (this.sm.type) {
            case 'CheckboxSelectionModel':
                this.sm = new Ext.grid.CheckboxSelectionModel(this.sm || {});
                columnModel = insert(this.sm.pos || 0, columnModel, this.sm);
                this.sm.on('selectionchange', multiSelectionHandler, this);
                break;
            case 'CellSelectionModel':
                this.sm = new Ext.grid.CellSelectionModel(this.sm || {});
                this.sm.on('selectionchange', multiSelectionHandler, this);
                break;
            default :
                this.sm = new Ext.grid.RowSelectionModel(this.sm || {});
                this.sm.on('selectionchange', multiSelectionHandler, this);
                break;
        }

        function insert(index, array, item) {
            var length = array.length - 1;
            var arrTmp = [];
            while (0 <= length) {
                arrTmp.push(array.pop());
                if (length == index) {
                    array.push(item);
                    length = -1;
                } else {
                    length--;
                }
            }
            length = arrTmp.length;
            while (0 < length) {
                array.push(arrTmp.pop());
                length--;
            }

            return array;
        }

        return columnModel;
    },
    initForm: function () {

        var fields = [];

        var formConfig = {
            margins: '0 5 5 5',
            region: 'south',
            split: true,
            collapsible: true,
            collapseMode: 'mini',
            collapsed: true,
            trackResetOnLoad: true,
            header: false,
            autoHeight: true,
            border: false,
            frame: true,
            buttonAlign: 'right',
            labelAlign: 'top',
            hidden: true,
            items: [
                {xtype: 'hidden'}
            ],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: this.btnSave.handler,
                    scope: this
                },
                {
                    stopEvent: true,
                    key: Ext.EventObject.ESC,
                    fn: this.btnCancelar.handler,
                    scope: this
                },
                {
                    stopEvent: true,
                    key: Ext.EventObject.P,
                    alt: true,
                    fn: this.btnAplicar.handler,
                    scope: this
                }
            ],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnSave]

        };

        if (this.children instanceof Object) {
            /*this.children.items[0].items.nextTab = (this.children.items[1])
             ? this.children.items[1].items.id
             : this.btnSave.id;
             this.children.items[0].items.prevTab = this.btnCancelar.id;
             this.btnSave.nextTab = this.children.items[0].items.id;*/
            Ext.apply(formConfig, {
                items: this.children,
                hidden: false,
                listeners: {
                    expand: function (cmp) {
                        cmp.doLayout();
                        this.btnAdicionar.disable();
                    }.createDelegate(this),
                    beforecollapse: function () {
                        this.btnAdicionar.enable();
                        this.setAccion('ADD');
                        this.cleanForm();
                        this.btnAdicionar.focus(true, 100);
                    }.createDelegate(this)
                }
            });
            this.btnAdicionar.enable();
        }

        this.fpFormulario = new Ext.form.FormPanel(formConfig);

        this.fpFormulario.on('clientvalidation', function (form, valid) {
            if (form.getForm().isDirty() && valid) {
                this.btnAplicar.enable();
                this.btnSave.enable();
            } else {
                this.btnAplicar.disable();
                this.btnSave.disable();
            }
        }, this)
    },
    initComponent: function () {

        this.accion = 'ADD';
        this.dirty = false;
        this.accionTab = Ext.getCmp(this.idpadre).accion;
        Ext.getCmp(this.idpadre).on('changeStatus', function () {
            this.accionTab = Ext.getCmp(this.idpadre).accion;
        }, this);

        this.initButtons();
        this.initGrid();
        this.initForm();

        this.items = [
            this.gpGrid,
            this.fpFormulario
        ];

        this.on('resize', this.actualizarBox, this, {buffer: 200});
        this.on('expand', this.actualizarBox, this, {buffer: 200});

        this.on('changeAccion', function (cmp, st) {
            switch (st) {
                case 'MOD':
                    this.btnAplicar.hide();
                    break;
                default :
                    this.btnAplicar.show();
                    break;
            }
        }, this);


        Ext.components.GestPanel.superclass.initComponent.call(this);

        var gSecurity = this.gSecurity || function (add, mod, del) {

                var fullSeg = 3;
                if (!this.viewFicha) {
                    if (parseInt(add) !== 1) {
                        this.btnAdicionar.setHandler(Ext.emptyFn);
                        this.btnAdicionar.hide();
                        fullSeg--;
                    }
                    if (parseInt(mod) !== 1) {
                        this.btnModificar.setHandler(Ext.emptyFn);
                        this.btnModificar.hide();
                        fullSeg--;
                    }
                    if (parseInt(del) !== 1) {
                        this.btnEliminar.setHandler(Ext.emptyFn);
                        this.btnEliminar.hide();
                        fullSeg--;
                    }
                    if (fullSeg === 0) {
                        if (this.gpGrid.getTopToolbar() instanceof Ext.Toolbar) {
                            this.gpGrid.getTopToolbar().destroy()
                        } else {
                            delete this.gpGrid.getTopToolbar();
                        }
                        this.gpGrid.doLayout();
                    }
                } else {
                    this.btnAdicionar.setHandler(Ext.emptyFn);
                    this.btnAdicionar.hide();
                    this.btnModificar.setHandler(Ext.emptyFn);
                    this.btnModificar.hide();
                    this.btnEliminar.setHandler(Ext.emptyFn);
                    this.btnEliminar.hide();
                    fullSeg = 0;
                    if (fullSeg === 0) {
                        if (this.gpGrid.getTopToolbar() instanceof Ext.Toolbar) {
                            this.gpGrid.getTopToolbar().destroy()
                        } else {
                            delete this.gpGrid.getTopToolbar();
                        }
                        this.gpGrid.doLayout();
                    }
                }

            };
        gSecurity.call(this, this.segAction[0], this.segAction[1], this.segAction[2]);

    }.createInterceptor(function () {
        this.children = this.items || [];
    }),
    changeToDirty: function () {
        this.dirty = true;
    },
    isDirty: function () {
        return this.dirty;
    },
    actualizarBox: function () {
        if (this.gpGrid.rendered) {
            this.gpGrid.getView().refresh(true);
            this.gpGrid.onResize();
            this.doLayout();
        }
    },
    adicionarHandler: function () {

    },
    modificarHandler: function () {

    },
    eliminarHandler: function (arrRecords) {

    },
    /**
     * Funcion para cargar el formulario con los datos
     * @param record
     */
    loadFormulario: function (record) {
        this.fpFormulario.getForm().loadRecord(record || this.sm.getSelected());
        this.setAccion('MOD');
        if (this.fpFormulario.collapsed) {
            this.fpFormulario.expand();
        }

    },
    loadGridStore: function (params) {
        this.stGrid.load({
            params: params || {empty: ''}
        });
        this.dirty = false;
    },
    guardarHandler: function () {

    },
    aplicarHandler: function () {

    },
    validateForm: function () {
        return this.fpFormulario.getForm().isValid();
    },
    cancelarHandler: function () {
        this.fpFormulario.collapse();
    },
    isDirtyForm: function () {
        return this.fpFormulario.getForm().isDirty();
    },
    cleanForm: function () {
        this.fpFormulario.getForm().items.each(function (f) {
            if (f.originalValue) {
                f.originalValue = null;
            }
            if (f.value) {
                f.value = null;
            }
            f.reset();
        });
    },
    setAccion: function (st) {
        this.fireEvent('changeAccion', this, st);
        this.accion = st;
    },
    getAction: function () {
        return this.accion;
    },
    addBotones: function () {
        return {};
    },
    getLanguaje: function () {

    }
});
Ext.reg('gest_panel', Ext.components.GestPanel);

Ext.components.ComboBox = Ext.extend(Ext.form.ComboBoxBtn, {
    trigger1Class: 'x-form-refresh-trigger',
    toolTipTrigger1: 'Recargar',
    initComponent: function () {
        this.store = new Ext.components.Store(this.store);

        Ext.components.ComboBox.superclass.initComponent.call(this);
    },
    handler: function () {
        if (this.store.url)
            this.store.reload();
    }
});
Ext.reg('combo_box', Ext.components.ComboBox);

Ext.components.CheckBox = Ext.extend(Ext.form.Checkbox, {
    /**
     * Sets the checked state of the checkbox.
     * @param {Boolean/String} checked True, 'true', '1', or 'on' to check the checkbox, any other value will uncheck it.
     */
    setValue: function (v) {
        var checked = this.checked;
        this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');

        if (this.el && this.el.dom) {
            this.el.dom.checked = this.checked;
            this.el.dom.defaultChecked = this.checked;
        }

        if (this.wrap)
            this.wrap[this.checked ? 'addClass' : 'removeClass'](this.checkedCls);

        if (checked != this.checked) {
            this.fireEvent("check", this, this.checked);
            if (this.handler) {
                this.handler.call(this.scope || this, this, this.checked);
            }
        }
    }
});
Ext.reg('check_box', Ext.components.CheckBox);

Ext.components.FormPanel = Ext.extend(Ext.form.FormPanel, {
    initComponent: function () {

        this.on('resize', this.actualizarBox, this, {buffer: 200});
        this.on('expand', this.actualizarBox, this, {buffer: 200});
        /* this.on('clientvalidation', function (form, valid) {
         if (form.getForm().isDirty() && valid) {
         Ext.getCmp('btnAplicarPers').enable();
         Ext.getCmp('btnAceptSavePers').enable();
         } else {
         Ext.getCmp('btnAplicarPers').disable();
         Ext.getCmp('btnAceptSavePers').disable();
         }
         }, this)*/
        Ext.components.FormPanel.superclass.initComponent.call(this);
    },
    isDirty: function () {
        return this.getForm().isDirty();
    },
    actualizarBox: function () {
        this.doLayout();
    }
})
Ext.reg('form_panel', Ext.components.FormPanel);