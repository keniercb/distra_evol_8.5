Ext.define('Reclamaciones.view.WinEditReclamacion', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditreclamacion',
    frame: true,
    margin: false,
    border: false,
    width: 800,
    height: 400,
    closable: true,
    closeAction: 'destroy',
    modal: true,
    actionInsert: true,
    resizable: false,
    defaultFocus: 'nombre',
    initComponent: function () {
        var me = this;
        me.idcontrato = null;
        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        me.down('form').on('validitychange', function (yo) {
            me.checkValidez();
        });
        me.down('form').on('dirtychange', function (yo) {
            me.checkValidez();
        });
        me.down('form[tabId=anexos]').on('validitychange', function () {
            me.checkValidez();
        });
        me.down('form[tabId=anexos]').on('dirtychange', function (yo) {
            me.checkValidez();
        });
        me.down('#motivo').on('dirtychange', function (yo) {
            me.checkValidez();
        });
        me.down('#pretension').on('dirtychange', function (yo) {
            me.checkValidez();
        });
        me.down('#fundamentacionlegal').on('dirtychange', function (yo) {
            me.checkValidez();
        });
        // Ext.TaskManager.start({
        //     run: this.checkWindow.bind(me),
        //     interval: 100,
        //     scope: this
        // });
    },
    checkValidez: function () {
        var me = this,
            form = me.down('form').getForm(),
            formDA = me.down('form[tabId=anexos]').getForm(),
            invalid = form.hasInvalidField() || formDA.hasInvalidField(),
            dirty = form.isDirty() || formDA.isDirty() || me.down('#motivo').isDirty() || me.down('#pretension').isDirty() || me.down('#fundamentacionlegal').isDirty();
        if (me.action == 'addreclamacion') {
            me.down('button[action=aplicar]').setDisabled(invalid);
            me.down('button[action=aceptar]').setDisabled(invalid);
        } else {
            me.down('button[action=aplicar]').setDisabled(invalid || !dirty);
            me.down('button[action=aceptar]').setDisabled(invalid || !dirty);
        }
    },
    initBody: function () {
        var me = this;

        me.docAdicionales = Ext.create('Reclamaciones.view.DocumentosAdicionales', {
            tabId: 'anexos',
            height: 400,//me.height - 87,
            hidden: !me.gestordocumental
        });

        var elementos = [
            me.getFormDatosGenerales(),
            me.getProductosTab(),
            me.docAdicionales
        ] //
        me.items = [{
            xtype: 'tabpanel',
            deferredRender: false,
            border: false,
            items: elementos
        }];


    },
    getFormDatosGenerales: function () {
        var me = this;
        me.tfNumero = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbFieldNumero,
            name: 'numero',
            readOnly: true,
            anchor: '25%',
            maxLength: 150,
            width: 100,
            flex: 0.5,
            maxLengthText: me.etiquetas.validationMaxLength_150,
            blankText: me.etiquetas.vBlankText,

        });

        me.fecha = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFecha,
            name: 'fecha',
            anchor: '25%',
            hidden: false,
            width: 25,
            flex: 0.5,
            margin: '0 0 0 6'
        });

        me.tieneprod = Ext.create('Ext.form.field.Text', {
            name: 'tieneprod',
            hidden: true,
            allowBlank: false
        });

        me.tfNombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbFieldNombre,
            name: 'nombre',
            anchor: '50%',
            flex: 1,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ,\(-.\)]+(\d*)?)+$/,
            regexText: me.etiquetas.validationNombreReclamacion,
            maxLength: 150,
            maxLengthText: me.etiquetas.validationMaxLength_150,
            allowBlank: false,
            blankText: me.etiquetas.vBlankText
        });

        me.hfcliente = Ext.create('Ext.form.field.Hidden', {
            name: 'idcliente'
        });

        me.sfcliente = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbFieldCliente,
            // fieldLabel: me.context == 'proveedor'?me.etiquetas.lbFieldProveedor:me.etiquetas.lbFieldCliente,
            name: 'cliente',
            mapping: 'NomClienteproveedor.nombre',
            localId: 'idclientesproveedores',
            module: 'TipoContrato',
            // queryMode: 'local',
            // forceSelection: true,
            noactions: true,
            anchor: '100%',
            flex: 1,
            allowBlank: me.context == 'proveedor',
            hidden: me.context == 'proveedor',
            context: 'gestioncontratomainwindowclienteproveedor',
            filters: {
                idtipo: 1,
            },
        });
        me.hfproveedor = Ext.create('Ext.form.field.Hidden', {
            name: 'idproveedor'
        });
        me.sfproveedor = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbFieldProveedor,
            name: 'proveedor',
            mapping: 'NomClienteproveedor.nombre',
            localId: 'idclientesproveedores',
            module: 'TipoContrato',
            // queryMode: 'local',
            // forceSelection: true,
            noactions: true,
            anchor: '100%',
            flex: 1,
            // allowBlank: me.context == 'cliente',
            hidden: me.context == 'cliente',
            context: 'gestioncontratomainwindowclienteproveedor',
            filters: {
                idtipo: 2,
            },
            controller: 'gestioncontratomainwindow',
            listeners: {
                select: function (yo, records) {
                    me.sflinea.setDisabled(records.length != 1);
                    if (records.length != 1) {
                        me.sflinea.getStore().proxy.extraParams = {};
                        me.sftipolinea.getStore().proxy.extraParams.idproveedor = null;
                        me.sfcontrato.getStore().proxy.extraParams.idproveedor = null;
                    } else {
                        me.sflinea.getStore().proxy.extraParams = {'idproveedor': records[0].get('idclientesproveedores'),}
                        me.sfcontrato.getStore().proxy.extraParams.idproveedor = records[0].get('idclientesproveedores');
                        me.sftipolinea.getStore().proxy.extraParams.idproveedor = records[0].get('idclientesproveedores');
                    }
                    me.sflinea.setValue('');
                    me.sflinea.getStore().load();
                    me.sfcontrato.getStore().load();
                },
                change: function (yo) {
                    var record = yo.findRecordByValue(yo.getValue());
                    if (!record) {
                        me.sflinea.setValue('');
                        me.sftipolinea.setValue('');
                        me.sflinea.getStore().proxy.extraParams = {};
                        me.sftipolinea.getStore().proxy.extraParams = {};
                        me.sflinea.setValue('');
                        me.sftipolinea.setValue('');
                        me.sflinea.setDisabled(true);
                    }
                }
            }
        });

        // me.hflinea = Ext.create('Ext.form.field.Hidden', {
        //     name: 'idindicador'
        // });

        me.sflinea = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbBtnLinea,
            name: 'idlinea',
            flex: 0.5,
            hidden: false,
            columnWidth: 0.50,
            valueField: 'idindicador',
            displayField: 'denominacion',
            queryParam: 'idindicador',
            // localId: 'idindicador',
            queryMode: 'local',
            disabled: true,
            forceSelection: true,
            emptyText: 'Seleccione la linea',
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            readOnly: false,

            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="x-boundlist-item" data-qtip="{codigo} - {denominacion}">' +
                '{denominacion}' +
                '</div>',
                '</tpl>'
            ),
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'idlinea'},
                    {name: 'idtipolinea'},
                    {name: 'linea'},
                    {name: 'tipolinea'},
                    {name: 'denominacion'},
                    {name: 'idindicador'}
                ],
                storeId: 'Linea',
                //remoteFilter:false,
                // autoLoad:false,
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'cargarLineas'}, ModuleMgr.get('Reclamaciones')),
                    actionMethods: {read: 'POST'},
                    reader: {
                        root: 'datos',
                        totalProperty: 'cantidad',
                        successProperty: 'success'
                    }
                }
            }),
            listeners: {
                select: function (yo, records) {
                    me.sftipolinea.setDisabled(!yo.getValue());
                    console.log('records[o]', records[0].internalId)

                    if (yo.getValue()) {
                        me.sftipolinea.getStore().proxy.extraParams.idindicador = records[0].internalId;
                        me.sfcontrato.getStore().proxy.extraParams.idindicador = records[0].internalId;
                        // esto es para cargar luego los productos
                        me.filtros = {
                            'idnaturaleza': me.idnaturaleza,
                            'node': yo.getValue()
                        }
                    } else {
                        me.sftipolinea.getStore().proxy.extraParams.idindicador = null;
                        me.sfcontrato.getStore().proxy.extraParams.idindicador = null;
                        me.filtros = {'idnaturaleza': me.idnaturaleza,}
                    }
                    me.sftipolinea.setValue('');
                    me.sftipolinea.getStore().load();
                    me.sfcontrato.getStore().load();
                    // }
                },
                change: function (yo) {
                    var pos = yo.store.findExact('idindicador', yo.getValue());

                    me.sftipolinea.setDisabled(pos == -1);

                    if (pos == -1) {
                        me.sftipolinea.getStore().proxy.extraParams.idindicador = null;
                        me.filtros = {'idnaturaleza': me.idnaturaleza,}
                        me.sftipolinea.getStore().load();
                    }
                }
            }
            // margin: '0 0 10 0',
        });

        me.sftipolinea = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbBtnTipoLinea,
            name: 'idtipolinea',
            valueField: 'idtipolinea',
            displayField: 'tipolinea',
            module: 'Nomencladores',
            flex: 0.5,
            hidden: false,
            emptyText: 'Seleccione el tipo de linea',
            columnWidth: 0.50,
            disabled: true,
            readOnly: false,
            editable: true,
            queryMode: 'local',
            forceSelection: true,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'idlinea'},
                    {name: 'idtipolinea'},
                    {name: 'linea'},
                    {name: 'tipolinea'},
                    {name: 'idnaturaleza'},
                    {name: 'denominacion'},
                    {name: 'idindicador'}
                ],
                storeId: 'TipoLinea',
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'obtenerTiposLineas'}, ModuleMgr.get('Reclamaciones')),
                    actionMethods: {read: 'POST'},
                    reader: {
                        root: 'datos',
                        totalProperty: 'cantidad',
                        successProperty: 'success'
                    }
                }
            }),
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            listeners: {

                select: function (tl, records) {
                    if (tl.getValue()) {
                        // me.sfcontrato.getStore().proxy.extraParams.idtipolinea = yo.getValue();
                        // esto es para cargar luego los productos
                        me.filtros = {
                            'idnaturaleza': me.idnaturaleza,
                            'node': tl.getValue()
                        }
                    } else {
                        me.filtros = {'idnaturaleza': me.idnaturaleza,}
                    }
                },

                change: function (tl) {
                    console.log('ESTO ES EN RECLAMACION TL',tl)
                    var pos = tl.store.findExact('tipolinea', tl.getRawValue());
                }

            }
            // margin: '0 0 10 5',
        });

        me.hftiporeclamacion = Ext.create('Ext.form.field.Hidden', {
            name: 'idtiporeclamacion'
        });

        me.sftiporeclamacion = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbBtnTipoReclamacion,
            name: 'tiporeclamacion',
            // valueField: 'idtiporeclamacion',
            // displayField: 'tiporeclamacion',
            mapping: 'NomTipoReclamacion.nombre',
            localId: 'idtiporeclamacion',
            module: 'Nomencladores',
            // queryMode: 'local',
            // forceSelection: true,
            flex: 1,
            emptyText: 'Seleccione el tipo de reclamación',
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            listeners: {
                change: function () {
                    //  si no esta esto al dar click al campo se desplega la lista
                }
            }
            // margin: '0 0 10 5',
        });

        me.sfcontrato = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbContrato,
            name: 'idcontrato',
            valueField: 'idcontrato',
            displayField: 'nombre',
            queryParam: 'idcontrato',
            queryMode: 'local',
            forceSelection: true,
            allowBlank: false,
            flex: 0.5,
            hidden: false,
            emptyText: 'Seleccione el proveedor...',
            columnWidth: 0.50,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'idcontrato'},
                    {name: 'nombre'},
                ],
                storeId: 'Contrato',
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'cargarContratos'}, ModuleMgr.get('Reclamaciones')),
                    actionMethods: {read: 'POST'},
                    reader: {
                        root: 'datos',
                        totalProperty: 'cantidad',
                        successProperty: 'success'
                    }
                }
            }),
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            listeners: {
                select: function () {
                    if (me.sfcontrato.getValue() != "") {
                        me.idcontrato = me.sfcontrato.getValue();
                        console.log('me.idcontrato', me.idcontrato)
                        me.gridProducto.setDisabled(false);
                        me.gridProducto.stLeft.proxy.extraParams.idcontrato = me.idcontrato;
                        console.log('me.idcontrato', me.idcontrato)
                        me.gridProducto.stLeft.reload();
                    }
                },
                change: function (com) {
                    if (me.sfcontrato.getValue() != "") {
                        me.idcontrato = me.sfcontrato.getValue();
                        console.log('me.idcontrato', me.idcontrato)
                        me.gridProducto.setDisabled(false);
                        me.gridProducto.stLeft.proxy.extraParams.idcontrato = me.idcontrato;
                        console.log('me.idcontrato', me.idcontrato)
                        me.gridProducto.stLeft.reload();
                    }
                }
            }
        })

        me.motivo = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbTitleTabMotivo,
            itemId: 'motivo',
            name: 'motivo',
            anchor: '100%',
            flex: 0.5,
            height: 140,
        })

        me.pretension = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbPretension,
            itemId: 'pretension',
            name: 'pretension',
            anchor: '100%',
            height: 140,
            flex: 0.5,
        })

        me.fundamentacionlegal = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbFL,
            itemId: 'fundamentacionlegal',
            name: 'fundamentacionlegal',
            anchor: '100%',
            height: 140,
            flex: 1,
        })

        return {
            title: me.etiquetas.lbTitleTabDatosGenerales,
            xtype: 'form',
            itemId: 'principal',
            trackResetOnLoad: true,
            bodyStyle: {
                padding: '5px 10px 10px 10px',
                background: '#DFE9F6'
            },
            fieldDefaults: {labelAlign: 'top'},
            defaults: {
                // bodyStyle: 'background:#DFE9F6;',
                defaults: {margin: '0 3 0 3'}
            },
            items: [
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    hidden: true,
                    items: []
                },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    // anchor: '50%',
                    items: [
                        me.tieneprod,
                        me.tfNombre,
                        me.tfNumero,
                        me.fecha,
                    ]
                },

                {
                    xtype: 'hidden',
                    name: 'idreclamacion',
                },

                {
                    xtype: 'hidden',
                    name: 'idespaciotrabajo'
                },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items:

                        (me.context == 'proveedor' ?
                                [me.hfproveedor, me.sfproveedor, me.hftiporeclamacion, me.sftiporeclamacion] :
                                [me.hfcliente, me.sfcliente, me.hftiporeclamacion, me.sftiporeclamacion]
                        )

                }, {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items:
                        (me.context == 'proveedor' ?
                            [me.hflinea, me.sflinea, me.sftipolinea] :
                            [me.hfproveedor, me.sfproveedor, me.hflinea, me.sflinea, me.sftipolinea])

                },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        me.sfcontrato,
                    ]

                }, {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        me.motivo,
                        me.pretension,
                    ]

                },


                me.fundamentacionlegal,
                me.gridProductosValido
            ]
        };
    },

    getProductosTab: function () {
        var me = this;
        me.gridProducto = Ext.create('Nomencladores.view.GridToGrid', {
            // title: 'Productos',
            title: 'Productos' + ' <span style="color:red" data-qtip="Este campo es obligatorio">*</span>',
            disabled: me.deshabilitarproductos,
            closeAction: 'destroy',
            margin: '10 0 0 0',
            anchor: '100%',
            allowBlank: false,
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
                        if (this.stRight.data.items.length > 0) {
                            _this.preventMark = false;
                            me.tieneprod.setValue('1');
                        } else {
                            me.tieneprod.setValue('');
                        }
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
                            text: 'Nombre', flex: 1, dataIndex: 'denominacion',
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
                    fields: [
                        {name: 'idindicadorreclamacion'},
                        {name: 'idreclamacion'},
                        {name: 'idindicadorcontrato'},
                        {name: 'cantidad'},
                        {name: 'denominacion'},
                        {name: 'codigo'},
                        {name: 'idcontrato'},

                    ],
                    proxy: {
                        type: 'ajax',
                        actionMethods: {read: 'POST'},
                        url: UtilsFn.buildUrl({action: 'cargarProductosReclamaciones'}, ModuleMgr.get('Reclamaciones')),
                        reader: {
                            root: 'productos',
                            totalProperty: 'cantidad',
                            successProperty: 'success'
                        },
                        extraParams: {
                            'idreclamacion': me.idreclamacion
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
                            if (_this.stRight.data.items.length > 0) {
                                var seleccionados = [], toRemove = [];
                                _this.stRight.data.items.forEach(function (x) {
                                    seleccionados.push(x.get('idindicadorcontrato'));
                                });
                                _this.stLeft.data.items.forEach(function (x) {
                                    if (seleccionados.indexOf(x.get('idindicadorcontrato')) != -1)
                                        toRemove.push(x);
                                });
                                _this.stLeft.remove(toRemove);
                            }
                        }
                    }
                });

                this.stLeft = Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'idindicadorreclamacion'},
                        {name: 'idreclamacion'},
                        {name: 'idindicadorcontrato'},
                        {name: 'cantidad'},
                        {name: 'denominacion'},
                        {name: 'codigo'},
                        {name: 'idcontrato'},
                    ],
                    remoteFilter: true,
                    proxy: {
                        type: 'ajax',
                        actionMethods: {read: 'POST'},
                        url: UtilsFn.buildUrl({action: 'cargarProductos'}, ModuleMgr.get('Reclamaciones')),
                        reader: {
                            type: 'json',
                            root: 'productos',
                            totalProperty: 'cantidad',
                            successProperty: 'success'
                        },
                        extraParams: {
                            'idcontrato': me.idcontrato
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
                                    seleccionados.push(x.get('idindicadorcontrato'));
                                });
                                _this.stLeft.data.items.forEach(function (x) {
                                    if (seleccionados.indexOf(x.get('idindicadorcontrato')) != -1)
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
                    title: 'Productos del contrato',
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
                    title: 'Productos reclamados' + '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>'
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
                    height: 400,
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
                        value.push(record.get('idclientesproveedores'));
                    });
                    return value;
                }
            },
        });
        return me.gridProducto;
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
            formDA = me.down('form[tabId=anexos]');
        if (me.gridProducto) {
            me.gridProducto.leftGrid.getStore().removeAll();
        }

        form.getForm().reset();
        if (me.down('#motivo')) {
            me.down('#motivo').setValue('');
        }
        if (me.down('#pretension')) {
            me.down('#pretension').setValue('');
        }
        if (me.down('#fundamentacionlegal')) {
            me.down('#fundamentacionlegal').setValue('');
        }
        if (formDA) {
            formDA.removeAllRow();
            formDA.insertRow();
        }
        // form.down('field:first').focus(false, 500);
    },
    loadValues: function (val) {
        var me = this,
            formDA = me.down('form[tabId=anexos]');

        me.down('form').loadRecord(val);
    },
    getValues: function () {
        var me = this,
            values;

        values = me.down('form').getForm().getValues();
        // values.descripcion = me.down('reclamacionestinyhtmleditor').getValue();
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
            formDA = me.down('form[tabId=anexos]').getForm(),
            invalid = form.hasInvalidField() || formDA.hasInvalidField(),
            dirty = form.isDirty() || formDA.isDirty();
        invalidGrid = false;
        if (me.action == 'addreclamacion') {
            me.down('button[action=aplicar]').setDisabled(invalid || invalidGrid);
            me.down('button[action=aceptar]').setDisabled(invalid || invalidGrid);
        } else {
            me.down('button[action=aplicar]').setDisabled(invalid || invalidGrid || !dirty);
            me.down('button[action=aceptar]').setDisabled(invalid || invalidGrid || !dirty);
        }

    },
    changeLinea: function (idlinea) {
        var me = this;
        me.sflinea.mask = new Ext.LoadMask(me.sflinea, {msg: this.etiquetas.msgLoading});
        me.sflinea.mask.show();
        me.sflinea.getStore().load({
            callback: function (records, operation, success) {
                me.sflinea.mask.hide();
                if (success) me.sflinea.setValue(idlinea);
            }
        })
        me.gridProducto.getStore().removeAll();
    },
    // validateButtons: function (selected) {
    //     var me = this;
    //     me.down('#agregardemanda').setDisabled(selected.get('seleccionado'));
    //     me.down('#quitardemanda').setDisabled(!selected.get('seleccionado'));
    // }
});
