Ext.define('SolicitudNegocio.view.WinEditSolicitud', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditsolicitud',
    frame: false,
    margin: false,
    border: false,
    width: 600,
    closable: true,
    closeAction: 'destroy',
    modal: true,
    actionInsert: true,
    resizable: false,
    initComponent: function () {
        var me = this;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        function cambioGrid() {
            me.gridAreasValido.setValue('valido')
        }

        function cambioGridPS() {
            me.gridProductosValido.setValue('valido')
        }

        me.gpareasimpl.getStore().on('add', cambioGrid)
        me.gpareasimpl.getStore().on('remove', cambioGrid)
        me.gpareasimpl.getStore().on('update', cambioGrid)
        me.gridProductoServicios.getStore().on('add', cambioGridPS)
        me.gridProductoServicios.getStore().on('remove', cambioGridPS)
        me.gridProductoServicios.getStore().on('update', cambioGridPS)

        // me.down('form').on('validitychange', function (yo) {
        //     me.checkValidez();
        // });
        // me.down('form').on('dirtychange', function (yo) {
        //     me.checkValidez();
        // });
        // me.down('form[tabId=datosadicionales]').on('validitychange', function () {
        //     me.checkValidez();
        // });
        // me.down('form[tabId=datosadicionales]').on('dirtychange', function (yo) {
        //     me.checkValidez();
        // });
        // me.down('#formdescripcion').on('dirtychange', function (yo) {
        //     console.log('dirtychange descripcion')
        //     me.checkValidez();
        // });
        // me.down('#descripcion').on('change', function (yo) {
        //     console.log('change descripcion')
        //     me.checkValidez();
        // });

        Ext.TaskManager.start({
            run: this.checkValidez.bind(this, me.down('form')),
            interval: 500,
            scope: this
        });
        // me.down('#descripcion').tinyMCEConfig.on('dirtychange', function (yo) {
        //     console.log('dirtychange2 descripcion')
        //     me.checkValidez();
        // });
        // Ext.TaskManager.start({
        //     run: this.checkWindow.bind(me),
        //     interval: 100,
        //     scope: this
        // });
    },
    checkValidez: function () {
        var me = this,
            form = me.down('form').getForm(),
            formDA = me.down('form[tabId=datosadicionales]').getForm(),
            invalid = form.hasInvalidField() || formDA.hasInvalidField(),
            dirty = form.isDirty() || formDA.isDirty() || me.down('#descripcion').isDirty();
        // console.log('dirty:',dirty, form.isDirty(),formDA.isDirty(), me.down('#descripcion').isDirty())
        if (me.action == 'addsolicitud') {
            me.down('button[action=aplicar]').setDisabled(invalid);
            me.down('button[action=aceptar]').setDisabled(invalid);
        } else {
            me.down('button[action=aplicar]').setDisabled(invalid || !dirty);
            me.down('button[action=aceptar]').setDisabled(invalid || !dirty);
        }
    },
    initBody: function () {
        var me = this;

        me.docAdicionales = Ext.create('OfertaNegocio.view.DocumentosAdicionales', {
            tabId: 'datosadicionales', height: me.height - 87, hidden: me.gestordocumentalactivo==0
        });

        me.items = [{
            xtype: 'tabpanel',
            deferredRender: false,
            border: false,
            items: [
                me.getFormDatosGenerales(),
                me.getFormDescripcion(),
                me.docAdicionales,
                me.getProductoServicioTab()
            ]
        }];

    },
    getFormDatosGenerales: function () {
        var me = this;

        me.tfNumero = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Número',
            name: 'numero',
            anchor: '100%',
            // regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ,\(-.\)]+(\d*)?)+$/,
            // regexText: me.etiquetas.validationNombreSolicitud,
            maxLength: 150,
            width: 100,
            flex:1,
            maxLengthText: me.etiquetas.validationMaxLength_150,
            columnWidth: 0.50,
            // allowBlank: me.tipo!=4,
            // hidden: me.tipo!=4 && me.tipo!=3,
            blankText: me.etiquetas.vBlankText,
            margin: '0 5 0 0'
        });

        me.tfNombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbFieldNombre,
            name: 'nombre',
            anchor: '100%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ,\(-.\)]+(\d*)?)+$/,
            regexText: me.etiquetas.validationNombreSolicitud,
            maxLength: 150,
            maxLengthText: me.etiquetas.validationMaxLength_150,
            allowBlank: false,
            columnWidth: 0.50,
            blankText: me.etiquetas.vBlankText
        });

        me.hfsector = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsector',
            name: 'idsector'
        });

        me.sfsector = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbFieldSector,
            name: 'sector',
            mapping: 'NomSector.denominacion',
            localId: 'idsector',
            module: 'Nomencladores',
            allowBlank: false,
            gen: 'm',
            filters: {},
            context: 'gestioncontratomainwindowsector',
            columnWidth: 0.50,
            margin: '0 5 10 0',
        });

        me.hfarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea'
        });

        me.cmbarea = Ext.create('GestionContrato.view.CmbArea', {
            fieldLabel: me.etiquetas.lbAreaResponsable,
            localId: 'idarea',
            name: 'arearesponsable',
            allowBlank: false,
            emptyText: me.etiquetas.lbSeleccione,
            columnWidth: 0.50,
            margin: '0 0 10 0',
            editable: false
        });

        me.hfclienteproveedor = Ext.create('Ext.form.field.Hidden', {
            name: 'idclienteproveedor'
        });

        me.sfclienteproveedor = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbFieldCliente,
            name: 'clienteproveedor',
            mapping: 'NomClienteproveedor.nombre',
            localId: 'idclienteproveedor',
            module: 'TipoContrato',
            noactions: true,
            anchor: '100%',
            allowBlank: me.context=='proveedor',
            hidden: me.context=='proveedor' || me.repositorioclientes==0,
            disabled: me.repositorioclientes==0,
            context: 'gestioncontratomainwindowclienteproveedor',
            filters: {
                idtipo: 1,
                idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
            },
            controller: 'gestioncontratomainwindow',
        });

        me.tfclienteproveedor = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbFieldCliente,
            name: 'clienteproveedor',
            anchor: '100%',
            allowBlank: me.context=='proveedor',
            hidden: me.context=='proveedor' || me.repositorioclientes==1,
            disabled: me.repositorioclientes==1,
        });

        me.panelProveedores = null;
        if (me.context=='proveedor') {
            me.panelProveedores = Ext.create('Nomencladores.view.GridToGrid', {
                closeAction: 'destroy',
                margin: '10 0 0 0',
                anchor: '100%',
                allowBlank: me.context=='cliente',
                preventMark: true,
                defineEvents: function () {
                    var _this = this;
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
                            this.enableButtons(this.rightGrid);
                            if (_this.rightGrid.cargandoServidor)
                                _this.resetOriginalValue();
                            me.down('form').fireEvent('validitychange', me.down('form'))
                            this.isValid();
                            if (this.stRight.data.items.length > 0)
                                _this.preventMark = false;
                        }
                    });
                    this.stLeft.on({
                        scope: this,
                        datachanged: function () {
                            this.enableButtons(this.leftGrid);
                            if (this.leftLoaded) {
                                this.isValid();
                            }
                        }
                    });
                },
                getRoles: function () {
                    null;
                },
                createBody: function () {
                    var _this = this,
                        columns = [
                            {
                                text: 'Nombre', flex: 1, dataIndex: 'nombre',
                                renderer: function (value, meta) {
                                    if (value) meta.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                        ];

                    this.btnMoveAllRight = Ext.create('Ext.button.Button', {
                        tooltip: 'Adicionar todos',
                        iconCls: 'desplazardoblederecha',
                        handler: _this.allMoveRight.bind(_this),
                        disabled: true
                    });

                    this.btnMoveRight = Ext.create('Ext.button.Button', {
                        tooltip: 'Adicionar seleccionados',
                        iconCls: 'siguiente',
                        handler: _this.moveRight.bind(_this),
                        disabled: true
                    });

                    this.btnMoveLeft = Ext.create('Ext.button.Button', {
                        tooltip: 'Quitar seleccionados',
                        iconCls: 'anterior',
                        handler: _this.moveleft.bind(_this),
                        disabled: true
                    });

                    this.btnMoveAllLeft = Ext.create('Ext.button.Button', {
                        tooltip: 'Quitar todos',
                        iconCls: 'desplazardobleizq',
                        handler: _this.allMoveleft.bind(_this),
                        disabled: true
                    });

                    Ext.define('proveedor', {
                        extend: 'Ext.data.Model',
                        fields: [
                            {name: 'idsolicitudnegocioproveedor'},
                            {name: 'idclientesproveedores'},
                            {name: 'nombre'},
                        ]
                    });

                    this.stRight = Ext.create('Ext.data.Store', {
                        originals: [],
                        idsOriginals: [],
                        cargandoServidor: false,
                        model: 'proveedor',
                        proxy: {
                            type: 'ajax',
                            actionMethods: {read: 'POST'},
                            url: UtilsFn.buildUrl({action: 'cargarProveedoresSolicitud'}, ModuleMgr.get('SolicitudNegocio')),
                            reader: {
                                root: 'datos',
                                totalProperty: 'cantidad',
                                successProperty: 'success'
                            },
                            extraParams: {
                                'idsolicitud': me.idsolicitud,
                            }
                        },
                        listeners: {
                            beforeload: function () {
                                _this.rightGrid.mascara = new Ext.LoadMask(_this.rightGrid.el, {
                                    msg: me.etiquetas.msgLoading
                                });
                                _this.rightGrid.mascara.show();
                                _this.rightGrid.cargandoServidor = true;
                            },
                            load: function (store, records, success) {
                                _this.rightGrid.cargandoServidor = false;
                                _this.rightGrid.setLoading(false);
                                if (_this.rightGrid.mascara) _this.rightGrid.mascara.hide();

                                _this.resetOriginalValue();
                                if (success) {
                                    if (store.data.items.length > 0)
                                        store.data.items.forEach(function (x) {
                                            _this.stRight.idsOriginals.push(x.get('idclientesproveedores'));
                                            _this.stRight.originals.push(x.data);
                                        });
                                }
                            }
                        }
                    });

                    this.stLeft = Ext.create('Ext.data.Store', {
                        model: 'proveedor',
                        remoteFilter: true,
                        proxy: {
                            type: 'ajax',
                            actionMethods: {read: 'POST'},
                            url: UtilsFn.buildUrl({action: 'cargarProveedores'}, ModuleMgr.get('SolicitudNegocio')),
                            reader: {
                                type: 'json',
                                root: 'datos',
                                totalProperty: 'cantidad',
                                successProperty: 'success'
                            },
                            extraParams: {
                                'idsolicitud': me.idsolicitud
                            }
                        },
                        listeners: {
                            beforeload: function () {
                                _this.leftGrid.mascara = new Ext.LoadMask(_this.leftGrid.el, {
                                    msg: me.etiquetas.msgLoading
                                });
                                _this.leftGrid.mascara.show();
                            },
                            load: function () {
                                if (_this.leftGrid.mascara) _this.leftGrid.mascara.hide();
                                if (_this.stRight.data.items.length > 0) {
                                    var seleccionados = [], toRemove = [];
                                    _this.stRight.data.items.forEach(function (x) {
                                        seleccionados.push(x.get('idclientesproveedores'));
                                    });
                                    _this.stLeft.data.items.forEach(function (x) {
                                        if (seleccionados.indexOf(x.get('idclientesproveedores')) != -1)
                                            toRemove.push(x);
                                    });
                                    _this.stLeft.remove(toRemove);
                                }
                            }
                        }
                    });

                    this.leftGrid = Ext.create('Ext.grid.Panel', {
                        flex: 1,
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
                                itemId: 'searchfield',
                                flex: 1,
                                fnOnClear: _this.remoteClear,
                                fnOnSearch: _this.remoteSearch,
                                clearTooltip: _this.etiquetas.qtipLimpiar,
                                searchTooltip: _this.etiquetas.qtipBuscarRolDisponible
                            })
                        ],
                        store: _this.stLeft,
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: _this.stLeft,
                            dock: 'bottom'
                        },
                        columns: columns,
                        title: 'Listado de proveedores',
                        plugins: [
                            Ext.create('SolicitudPago.view.MarcarFiltroPlugin', {
                                extraParams: true,
                                campos: [{
                                    'itemId': 'searchfield',
                                    'dataIndex': ['nombre'],
                                    'extraParams': 'nombre'
                                }]
                            })
                        ]
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
                        title: 'Proveedores seleccionados' + '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>'
                    });

                    var items = [
                        _this.leftGrid,
                        {
                            xtype: 'panel',
                            frame: true,
                            layout: {
                                type: 'vbox',
                                pack: 'center'
                            },
                            items: [{
                                xtype: 'toolbar',
                                dock: 'right',
                                border: false,
                                items: [
                                    this.btnMoveAllRight,
                                    this.btnMoveRight,
                                    this.btnMoveLeft,
                                    this.btnMoveAllLeft
                                ]
                            }],
                        },
                        _this.rightGrid];

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
                search: function () {
                    var store = this.up('gridpanel').getStore(),
                        value = this.getValue().toLowerCase();

                    store.filterBy(function (record) {
                        if (record.get('nombre'))
                            return record.get('nombre').toLowerCase().indexOf(value) != -1;
                    });
                },
                remoteSearch: function () {
                    var store = this.up('gridpanel').getStore(),
                        value = this.getValue();
                    store.proxy.extraParams['nombre'] = value;
                    store.load();
                },
                remoteClear: function () {
                    var store = this.up('gridpanel').getStore();
                    store.proxy.extraParams['nombre'] = '';
                    store.load();
                },
                getValue: function () {
                    var store = this.stRight,
                        cant = store.getCount();
                    if (cant) {
                        var range = store.getRange(0, cant - 1),
                            value = new Array();
                        Ext.each(range, function (record) {
                            value.push(record.get('idclienteproveedor'));
                        });
                        return value;
                    }
                },
            });
        }
        me.gpareasimpl = Ext.create('SolicitudNegocio.view.GpAreasImplicadas', {
            title: me.etiquetas.lbAreasImplicadas,
            margin: '10 0 0 0', height: 140,
            hidden: me.context==3 || me.tipo==4
        });

        me.gridAreasValido = Ext.create('Ext.form.field.Hidden', {
            allowBlank: false, value: me.action == 'addsolicitud' ? 'valido' : ''
        });

        me.gridProductosValido = Ext.create('Ext.form.field.Hidden', {
            allowBlank: false, value: me.action == 'addsolicitud' ? 'valido' : ''
        });

        return {
            title: me.etiquetas.lbTitleTabDatosGenerales,
            xtype: 'form',
            trackResetOnLoad: true,
            bodyStyle: {
                padding: '5px 10px 10px 10px',
                background: '#DFE9F6'
            },
            fieldDefaults: {labelAlign: 'top'},
            items: [
                {
                    layout: 'column',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        me.tfNumero, me.tfNombre
                    ]
                },

                {
                    xtype: 'hidden',
                    name: 'idsolicitud',
                    value: 0
                },
                {
                    xtype: 'hidden',
                    name: 'idespaciotrabajo'
                },
                me.hfclienteproveedor,
                me.sfclienteproveedor,
                me.tfclienteproveedor,
                {
                    layout: 'column',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        me.hfsector, me.sfsector, me.hfarea, me.cmbarea
                    ]
                },
                me.panelProveedores,
                me.gpareasimpl, me.gridAreasValido, me.gridProductosValido
            ]
        };
    },
    getFormDescripcion: function () {
        var me = this;

        return Ext.create('Ext.form.Panel',{
            title: me.etiquetas.lbTitleTabDDescripcion,
            itemId: 'formdescripcion',
            items: Ext.create('SolicitudNegocio.view.TinyHtmlEditor', {
                itemId: 'descripcion',
                name: 'descripcion',
                anchor: '100%',
                border: false,
                bodyBorder: false,
                height: me.height - 87
            })
        });
    },
    getProductoServicioTab: function () {
        var me = this;
        me.gridProductoServicios = Ext.create('GestionContrato.view.FormaPago.Producto.GridProducto', {
            title: me.etiquetas.lbProductoServicio,
            layout: 'fit',
            height: me.height - 87
        });
        me.gridProductoServicios.getStore().removeItems = [];
        me.gridProductoServicios.getStore().on('remove', function (store, records) {
            me.gridProductoServicios.getStore().removeItems.push(records);
        });
        me.gridProductoServicios.columns.forEach(function (x) {
            if (['unidadmedida', 'precio', 'preciodivisa'].indexOf(x.dataIndex) != -1) {
                x.hideable = false;
                x.hidden = true;
            }
        });
        return me.gridProductoServicios;
    },
    initButtons: function () {
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                handler: function () {
                    me.close();
                }
            }, {
                text: me.etiquetas.lbBtnApply,
                iconCls: 'icondistra-aplicar',
                tooltip: me.etiquetas.qtipApply,
                disabled: true,
                action: 'aplicar'
            }, {
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar'
            }
        ];
    },
    initState: function () {
        var me = this;
        me.down('button[action=aplicar]').setVisible(me.actionInsert);
        me.items.first().setActiveTab(0);
    },
    resetComponents: function () {
        var me = this,
            form = me.down('form'),
            formDA = me.down('form[tabId=datosadicionales]');

        me.gpareasimpl.getStore().removeAll();

        form.getForm().reset();
        me.down('#descripcion').setValue('');
        formDA.removeAllRow();
        formDA.insertRow();
        if (me.panelProveedores) {
            me.panelProveedores.rightGrid.getStore().removeAll();
            me.panelProveedores.leftGrid.getStore().load();
        }
        form.down('field:first').focus(false, 500);
        me.gridProductoServicios.getStore().removeAll();
    },
    loadValues: function (val) {
        var me = this,
            formDA = me.down('form[tabId=datosadicionales]');

        me.down('form').loadRecord(val);
    },
    getValues: function () {
        var me = this,
            areasimplicadas = new Array(),
            values;

        me.gpareasimpl.getStore().each(function (record) {
            areasimplicadas.push(record.getData());
        }, this);

        values = me.down('form').getForm().getValues();
        values.areasimplicadas = areasimplicadas;
       // values.descripcion = me.down('solicitudtinyhtmleditor').getValue();

        return values;
    },
    setActionInsert: function (action) {
        this.actionInsert = !!action;
    },
    getActionInsert: function () {
        return this.actionInsert;
    },
    show: function () {
        var me = this;

        me.initState();

        me.callParent();

        me.resetComponents();
    },
    checkWindow: function () {
        var me = this,
            form = me.down('form').getForm(),
            formDA = me.down('form[tabId=datosadicionales]').getForm(),
            invalid = form.hasInvalidField() || formDA.hasInvalidField(),
            dirty = form.isDirty() || formDA.isDirty();
        invalidGrid = false;
        if (me.panelProveedores)
            invalidGrid = !me.panelProveedores.isValid();
        if (me.action == 'addsolicitud') {
            me.down('button[action=aplicar]').setDisabled(invalid || invalidGrid);
            me.down('button[action=aceptar]').setDisabled(invalid || invalidGrid);
        } else {
            me.down('button[action=aplicar]').setDisabled(invalid || invalidGrid || !dirty);
            me.down('button[action=aceptar]').setDisabled(invalid || invalidGrid || !dirty);
        }

    }
});
