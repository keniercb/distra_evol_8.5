Ext.define('Nomencladores.view.GridToGrid', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.gridtogrid',

    requires: [
        'Ext.grid.*',
        'Ext.layout.container.HBox'
    ],
    errors: new Array(),

    preventMark: false,

    border: false,
    width: 572,
    hideLabel: true,
    fieldSubTpl: ['<div id="{id}" class="{fieldCls}"></div>', {}],
    data: [],
    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);
        this.blankText = this.etiquetas.vBlankText;
        this.createBody();

        //agregando los estilos del componente
        var styleLeaf = document.createElement('style');

        styleLeaf.innerHTML = ".x-form-invalid-field #rightgrid-body{" +
        "border-color: #C30;" +
        "border-width: 1px !important;" +
        "background-image: url(\"../../lib/4.2/resources/ext-theme-classic/images/grid/invalid_line.gif\");" +
        "background-repeat: repeat-x;" +
        "background-position: center bottom;" +
        "}" +
        ".x-html-editor-input {border-width: 1px !important;}";

        document.body.appendChild(styleLeaf);

        this.callParent(arguments);
        this.defineEvents();
    },
    onRender: function (ct, position) {
        var _this = this;
        _this.callParent(arguments);
        _this.bodyContainer.render(_this.inputEl);
    },
    afterComponentLayout: function (width) {
        this.callParent();
        this.bodyContainer.initialConfig.width = width;
        this.bodyContainer.setWidth(width);
    },
    createBody: function () {
        var _this = this,
            columns = [
                {
                    text: 'Roles',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'denominacion'
                }];

        this.btnMoveAllRight = Ext.create('Ext.button.Button', {
            iconCls: 'desplazardoblederecha',
            handler: _this.allMoveRight.bind(_this),
            disabled: true
        });

        this.btnMoveRight = Ext.create('Ext.button.Button', {
            iconCls: 'siguiente',
            handler: _this.moveRight.bind(_this),
            disabled: true
        });

        this.btnMoveLeft = Ext.create('Ext.button.Button', {
            iconCls: 'anterior',
            handler: _this.moveleft.bind(_this),
            disabled: true
        });

        this.btnMoveAllLeft = Ext.create('Ext.button.Button', {
            iconCls: 'desplazardobleizq',
            handler: _this.allMoveleft.bind(_this),
            disabled: true
        });

        Ext.define('rol',{
            extend: 'Ext.data.Model',
            fields: [
                {name: 'idrol'},
                {name: 'denominacion'}
            ]
        });

        this.stRight = Ext.create('Ext.data.Store', {
            model: 'rol'
        });

        this.stLeft = Ext.create('Ext.data.Store', {
            model: 'rol'
        });

        this.leftGrid = Ext.create('Ext.grid.Panel', {
            selType: 'checkboxmodel',
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                },
                listeners: {
                    drop: function () {
                        _this.isValid();
                    }
                }
            },
            tbar: [
                Ext.create('Ext.ux.SearchField', {
                    flex: 1,
                    fnOnClear: _this.clear,
                    fnOnSearch: _this.search,
                    clearTooltip: _this.etiquetas.qtipLimpiar,
                    searchTooltip: _this.etiquetas.qtipBuscarRolDisponible
                })
            ],
            store: _this.stLeft,
            columns: columns,
            stripeRows: true,
            title: _this.etiquetas.titleDisponible
        });

        this.rightGrid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            id: 'rightgrid',
            selType: 'checkboxmodel',
            tbar: [
                Ext.create('Ext.ux.SearchField', {
                    flex: 1,
                    fnOnClear: _this.clear,
                    fnOnSearch: _this.search,
                    clearTooltip: _this.etiquetas.qtipLimpiar,
                    searchTooltip: _this.etiquetas.qtipBuscarRolAutorizado
                })
            ],
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                },
                listeners: {
                    drop: function () {
                        _this.isValid();
                    }
                }
            },
            store: _this.stRight,
            columns: columns,
            stripeRows: true,
            title: _this.etiquetas.titleAutorizado + '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>'
        });

        var items = [
            {
                xtype: 'panel',
                flex: 1.10,
                layout: 'fit',
                border: false,
                buttonAlign: 'center',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'right',
                    style: 'margin-top:55px;',
                    items: [{
                        xtype: 'toolbar',
                        dock: 'right',
                        items: [
                            this.btnMoveAllRight,
                            this.btnMoveRight,
                            this.btnMoveLeft,
                            this.btnMoveAllLeft
                        ]
                    }]
                }],
                items: [_this.leftGrid]
            }, _this.rightGrid];

        this.bodyContainer = Ext.create('Ext.container.Container', {
            flex: 1,
            height: 200,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: items
        });

    },
    defineEvents: function () {

        this.on({
            afterrender: function () {
                this.getRoles();
            }
        });

        this.rightGrid.getSelectionModel().on({
            scope: this,
            selectionchange: function () {
                this.enableButtons(this.rightGrid);
            }
        });

        this.leftGrid.getSelectionModel().on({
            scope: this,
            selectionchange: function () {
                this.enableButtons(this.leftGrid);
            }
        });

        this.stRight.on({
            scope: this,
            datachanged: function () {
                console.log('datachanged r', this.leftLoaded)
                this.enableButtons(this.rightGrid);
                this.isValid();
            }
        });

        this.stLeft.on({
            scope: this,
            datachanged: function () {
                console.log('datachanged l', this.leftLoaded)
                this.enableButtons(this.leftGrid);
                if (this.leftLoaded) {
                    this.isValid();
                }
                this.leftLoaded = true;
            }
        });


    },
    enableButtons: function (grid) {
        var sm = grid.getSelectionModel(),
            store = grid.getStore(),
            all = grid.id === 'rightgrid' ? this.btnMoveAllLeft : this.btnMoveAllRight,
            one = grid.id === 'rightgrid' ? this.btnMoveLeft : this.btnMoveRight;

        if (sm.getCount() != 0) {
            one.enable();
        } else {
            one.disable();
        }

        if (store.getCount() != 0) {
            all.enable();
        } else {
            all.disable();
        }
    },
    allMoveRight: function () {
        var items = this.stLeft.data.items;
        this.stRight.add(items);
        this.stLeft.removeAll();
    },
    allMoveleft: function () {
        var items = this.stRight.data.items;
        this.stLeft.add(items);
        this.stRight.removeAll();
    },
    moveRight: function () {
        var items = this.leftGrid.getSelectionModel().getSelection();
        this.stRight.add(items);
        this.stLeft.remove(items);
    },
    moveleft: function () {
        var items = this.rightGrid.getSelectionModel().getSelection();
        this.stLeft.add(items);
        this.stRight.remove(items);
    },
    setValue: function (value) {
        if (value) {
            this.stRight.loadData(value);
        }
    },
    getValue: function () {
        var store = this.stRight,
            cant = store.getCount();

        if (cant) {
            var range = store.getRange(0, cant - 1),
                value = new Array();

            Ext.each(range, function (record) {
                value.push(record.get('idrol'));
            });

            return value;
        }
    },
    getSubmitValue: function () {
        var value = Ext.encode(this.getValue());
        return value;
    },
    getRoles: function () {
        var _this = this,
            mask = new Ext.LoadMask(_this.bodyContainer.getEl(), {msg: _this.etiquetas.msgLoading});

        mask.show();

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getUsuarios'}, ModuleMgr.get('Nomencladores')),
            params: {
                modelName: _this.modelName
            },

            callback: function (options, success, response) {
                var data = _this.data = Ext.decode(response.responseText).data,
                    result = new Array(),
                    value = _this.getValue();

                if (value) {
                    for (k in data) {
                        if (value.indexOf(data[k].idrol) == -1) {
                            result.push(data[k]);
                        }
                    }
                } else {
                    result = data;
                }

                _this.stLeft.loadData(result);

                mask.hide();
            }
        })
    },
    reset: function () {
        var _this = this;
        this.preventMark = true;
        this.stRight.removeAll();
        console.log('dataaa:', _this.data)
        this.stLeft.loadData(_this.data);
        this.preventMark = false;
    },
    isEmpty: function () {
        var value = this.getValue();
        // console.log('is empty', value)
        if (Ext.isEmpty(value)) {
            this.addError(this.blankText);
        } else {
            this.removeError(this.blankText);
        }
    },
    getErrors: function () {
        if (this.allowBlank === false) {
            this.isEmpty();
        }
        return this.errors;
    },
    addError: function (error) {
        if (this.errors.indexOf(error) == -1) {
            this.errors.push(error);
        }
    },
    removeError: function (error) {
        var pos = this.errors.indexOf(error);
        if (pos != -1) {
            this.errors.splice(pos, 1);
        }
    },
    isValid: function () {
        var _this = this,
            disabled = _this.disabled,
            validate = _this.forceValidation || !disabled;
        // console.log('is valid?', validate, _this.forceValidation, disabled, _this.preventMark)
        return validate ? _this.validateValue() : disabled;
    },
    validateValue: function () {
        var _this = this,
            errors = _this.getErrors(),
            realWidth = _this.rightGrid.initialConfig.width,
            isValid = Ext.isEmpty(errors);
        if (!_this.preventMark) {
            if (isValid) {
                _this.clearInvalid();
                _this.rightGrid.setWidth(realWidth);
            } else {
                _this.markInvalid(errors[0]);
                _this.rightGrid.setWidth(realWidth - 15);
            }
        }

        return isValid;
    },
    search: function () {
        var store = this.up('gridpanel').getStore(),
            value = this.getValue();

        store.filterBy(function (record) {
            return record.get('denominacion').toLowerCase().indexOf(value.toLowerCase()) != -1;
        });
    },
    clear: function () {
        var store = this.up('gridpanel').getStore();
        store.clearFilter();
    },
    onDestroy: function () {
        //se destroye el grid debido a que este se cra con un id
        //estatico que afecta la ejecucion una vez que se crea
        //mas de un vez
        this.rightGrid.destroy();
    }
});
