Ext.ns('Ext.reccomplejas');

Ext.reccomplejas.WinJoinTable = Ext.extend(Ext.Window, {
    title: 'Unir a trav&eacute;s de',
    layout: 'fit',
    closeAction: 'hide',
    modal: true,
    plain: true,
    initComponent: function () {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        var arrTipoConexion = [
            ['LEFT JOIN', 'LEFT JOIN'],
            ['RIGHT JOIN', 'RIGHT JOIN'],
            ['INNER JOIN', 'INNER JOIN']
        ];

        var stTipoConexion = new Ext.data.SimpleStore({
            fields: ['idconexion', 'valconexion'],
            data: arrTipoConexion
        });

        var cbTipoConexionMod = new Ext.form.ComboBox({
            store: stTipoConexion,
            fieldLabel: this.idioma.cbTipoConexion,
            displayField: 'valconexion',
            valueField: 'idconexion',
            hiddenName: 'idconexion',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: this.idioma.MsgSeleccione,
            selectOnFocus: true,
            editable: false,
            allowBlank: false
        });

        this.fpConexion = new Ext.FormPanel({
            id: 'fpModTablaMapeo',
            labelWidth: 90,
            region: 'center',
            border: false,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width: 285,
            height: 100,
            defaults: {
                width: 160
            },
            defaultType: 'textfield',
            items: [cbTipoConexionMod, {
                xtype: 'checkbox',
                id: 'chkPersisteJoin',
                fieldLabel: this.idioma.chekbPersisteJoin,
                listeners: {
                    check: function (chkbox, checked) {
                        if (checked) {
                            Ext.getCmp('nfIDPersisteJoin').enable();
                        }
                        else {
                            Ext.getCmp('nfIDPersisteJoin').disable();
                            Ext.getCmp('nfIDPersisteJoin').reset();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                id: 'nfIDPersisteJoin',
                fieldLabel: this.idioma.tfIdPersisteJoin,
                allowBlank: false,
                allowNegative: false,
                allowDecimals: false,
                disabled: true,
                maxLength: 3,
                maxLengthText: this.idioma.MsgAlertPersisteJoin
            }]
        }),

            this.btnCancelar = new Ext.Button({
                text: this.idioma.btnCancelar,
                tooltip: this.idioma.tooltipBtnCancelar,
                iconCls: 'cancelar',
                handler: function () {
                    Ext.getCmp('fpModTablaMapeo').getForm().reset();
                    self.hide();
                    self.parent.gpMapeo.btnModificar.focus();
                }
            });

        this.btnAceptar = new Ext.Button({
            text: this.idioma.btnAceptar,
            tooltip: this.idioma.tooltipBtnAceptar,
            iconCls: 'aceptar'
        })

        this.buttons = [this.btnCancelar, this.btnAceptar];
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    self.btnAceptar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    self.btnCancelar.handler();
                }
            }
        ];
        this.items = [this.fpConexion];

        Ext.reccomplejas.WinJoinTable.superclass.initComponent.call(this);
        this.on('show', function () {
            cbTipoConexionMod.focus(false, 300);
        })
    }
});

Ext.reccomplejas.CmpDesigner = Ext.extend(Ext.Panel, {
    layout: 'border',
    border: false,
    initComponent: function () {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.stMapeo = new Ext.data.Store({
            url: 'getMapeo',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idmapeo'
            }, [
                {
                    name: 'idmapeomostrar'
                }
            ]),
            listeners: {
                load: function (st, arrRecords, options) {

                }
            }
        });

        this.gpMapeo = new Ext.grid.GridPanel({
            store: this.stMapeo,
            columns: [
                {
                    header: this.idioma.tfEsquema,
                    width: 120,
                    menuDisabled: true,
                    dataIndex: 'esquema'
                },
                {
                    header: this.idioma.tfTabla,
                    width: 120,
                    menuDisabled: true,
                    dataIndex: 'tabla'
                },
                {
                    header: this.idioma.cbTipoConexion,
                    width: 94,
                    menuDisabled: true,
                    dataIndex: 'tipoconexion'
                },
                {
                    header: this.idioma.chekbPersisteJoin,
                    width: 83,
                    menuDisabled: true,
                    dataIndex: 'persistejoin',
                },
                {
                    header: this.idioma.tfIdPersisteJoin,
                    width: 90,
                    menuDisabled: true,
                    dataIndex: 'idpersistejoin'
                },
            ],
            stripeRows: true,
            height: 400,
            width: 300,
            title: perdil.labels.titleGpMapeo,
            region: 'center',
            ddGroup: 'gpMapeoDDGroup',
            enableDragDrop: true,
            loadMask: {
                msg: 'Cargando..'
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            listeners: {
                rowclick: function (gp, rowIndex, event) {

                }
            }
        });

        this.stUnionTabla = new Ext.data.Store({
            url: 'getCamposUnionMostrar',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'iduniontabla'
            }, [
                {
                    name: 'idunionmostrar'
                },
                {
                    name: 'idmapeomostrar'
                },
                {
                    name: 'campoinicial'
                },
                {
                    name: 'operador'
                },
                {
                    name: 'campofinal'
                },
                {
                    name: 'logico'
                }
            ])
        });

        //Gridpanel que va a representar a traves de que campo est� unido la tabla seleccionada con la anterior
        this.gpUnionTabla = new Ext.grid.GridPanel({
            store: this.stUnionTabla,
            columns: [
                {
                    header: this.idioma.cbOperadorLogico,
                    width: 80,
                    menuDisabled: true,
                    dataIndex: 'logico'
                },
                {
                    header: this.idioma.cbCampoInicial,
                    width: 120,
                    menuDisabled: true,
                    dataIndex: 'campoinicial'
                },
                {
                    header: this.idioma.cbOperador,
                    width: 120,
                    menuDisabled: true,
                    dataIndex: 'operador'
                },
                {
                    header: this.idioma.cbCampoFinal,
                    width: 120,
                    menuDisabled: true,
                    dataIndex: 'campofinal'
                },
            ],
            stripeRows: true,
            disabled: true,
            height: 210,
            width: 300,
            title: self.idioma.titleGpUnionTablas,
            region: 'south',
            split: true,
            loadMask: {
                msg: 'Cargando..'
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function (sm, indiceFila, record) {

                    }
                }
            }),
            viewConfig: {
                forceFit: true
            }
        });

        this.items = [this.gpMapeo, this.gpUnionTabla];
        Ext.reccomplejas.CmpDesigner.superclass.initComponent.call(this);
    }
});

Ext.reccomplejas.CmpMapeo = Ext.extend(Ext.grid.GridPanel, {
    stripeRows: true,
    height: 400,
    width: 300,
    ddGroup: 'gpMapeoDDGroup',
    enableDragDrop: true,
    title: 'Mapeo de las tablas',
    loadMask: {
        msg: 'Carfando..'
    },
    columns: [
        {
            header: 'Esquema',
            width: 120,
            menuDisabled: true,
            dataIndex: 'esquema'
        },
        {
            header: 'Tabla',
            width: 120,
            menuDisabled: true,
            dataIndex: 'tabla'
        },
        {
            header: 'Tipo conexi&oacute;n',
            width: 94,
            menuDisabled: true,
            dataIndex: 'tipoconexion'
        },
        {
            header: 'Persiste join',
            width: 83,
            menuDisabled: true,
            dataIndex: 'persistejoin'
        },
        {
            header: 'ID persiste join',
            width: 90,
            menuDisabled: true,
            dataIndex: 'idpersistejoin'
        }
    ],
    initComponent: function () {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.btnModificar = new Ext.Button({
            text: this.idioma.btnModificar,
            tooltip: this.idioma.tooltipBtnModificarMapeo,
            id: 'btnMod' + self.id,
            prevTab: 'btnEliminar' + self.id,
            nextTab: 'btnEliminar' + self.id,
            disabled: true,
            iconCls: 'modificar',
            handler: function () {
            }
        });

        this.btnEliminar = new Ext.Button({
            text: this.idioma.btnEliminarMapeo,
            id: 'btnEliminar' + self.id,
            tooltip: this.idioma.tooltipBtnEliminarMapeo,
            nextTab: 'btnMod' + self.id,
            prevTab: 'btnMod' + self.id,
            disabled: true,
            iconCls: 'eliminar',
            handler: function () {
            }
        });

        this.store = new Ext.data.Store({
            url: 'getMapeo',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idmapeo'
            }, [
                {
                    name: 'idmapeo'
                },
                {
                    name: 'esquema'
                },
                {
                    name: 'tabla'
                },
                {
                    name: 'persistejoin'
                },
                {
                    name: 'idpersistejoin'
                },
                {
                    name: 'tipoconexion'
                }
            ]),
            listeners: {
                load: function (st, arrRecords, options) {

                }
            }
        });

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                'rowselect': function (sm, rowIndex, rec) {
                    if (rowIndex != 0) {
                        self.btnModificar.enable();
                        self.btnModificar.focus();
                    } else {
                        self.btnModificar.disable();
                    }
                    self.btnEliminar.enable();
                    self.btnEliminar.focus();
                },
                'rowdeselect': function (sm, rowIndex, rec) {
                    self.btnEliminar.disable();
                    self.btnModificar.disable();
                }
            }
        });

        this.tbar = [this.btnModificar, this.btnEliminar];

        Ext.reccomplejas.CmpMapeo.superclass.initComponent.call(this);
    }
});

Ext.reccomplejas.CmpUnionTabla = Ext.extend(Ext.grid.GridPanel, {
    stripeRows: true,
    disabled: true,
    height: 210,
    width: 300,
    title: 'Conexi&oacute;n de las tablas',
    split: true,
    loadMask: {
        msg: 'Cargando..'
    },
    initComponent: function () {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.tabla = new Ext.form.TextField();
        this.esquema = new Ext.form.TextField();
        esquema:self.esquema.getValue(),

            this.winMapeoCampos = new Ext.reccomplejas.winMapeoCampos({
                config: self.config,
                parent: self
            });

        this.winMapeoCampos.on('hide', function () {
            self.btnModificar.disable();
            self.btnEliminar.disable();
            self.btnAdicionar.enable();
            self.btnAdicionar.focus();
            self.getSelectionModel().clearSelections();
        }, this);

        this.btnAdicionar = new Ext.Button({
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.tooltipBtnAdicionarUnion,
            id: 'btnAdicionar' + self.id,
            nextTab: 'btnModificar' + self.id,
            prevTab: 'btnEliminar' + self.id,
            iconCls: 'adicionar',
            handler: function () {
                this.winMapeoCampos.setTitle(this.idioma.titleWinUnionAdd);
                this.winMapeoCampos.show();
                this.winMapeoCampos.accion = 'ADD';
                if (self.store.getCount() != 0) {
                    this.winMapeoCampos.cbLogico.enable();
                } else {
                    this.winMapeoCampos.cbLogico.disable();
                }
                self.cambio = 0;
            }.createDelegate(this)
        });

        this.btnModificar = new Ext.Button({
            text: this.idioma.btnModificar,
            tooltip: this.idioma.tooltipBtnModificarUnion,
            id: 'btnModificar' + self.id,
            nextTab: 'btnEliminar' + self.id,
            prevTab: 'btnAdicionar' + self.id,
            iconCls: 'modificar',
            disabled: true,
            handler: function () {
                if (self.store.getCount() == 1) {
                    this.winMapeoCampos.cbLogico.disable();
                } else {
                    this.winMapeoCampos.cbLogico.enable();
                }
                this.winMapeoCampos.setTitle(this.idioma.titleWinUnionMod);
                this.winMapeoCampos.show();
                this.winMapeoCampos.accion = 'MOD';
                var arr = {
                    'cbCampoFinal': self.getSelectionModel().getSelected().get('campofinal'),
                    'cbOperador': self.getSelectionModel().getSelected().get('operador'),
                    'cbCampoInicial': self.getSelectionModel().getSelected().get('campoinicial'),
                    'cbLogico': self.getSelectionModel().getSelected().get('logico')
                }
                var record = new Ext.data.Record(arr);
                this.winMapeoCampos.fpUnion.getForm().loadRecord(record);
                self.cambio = 0;
            }.createDelegate(this)
        });

        this.btnEliminar = new Ext.Button({
            text: this.idioma.btnEliminarMapeo,
            tooltip: this.idioma.tooltipBtnEliminarUnion,
            id: 'btnEliminar' + self.id,
            nextTab: 'btnAdicionar' + self.id,
            prevTab: 'btnModificar' + self.id,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                this.eliminarUnion(this.getSelectionModel().getSelected().get('idunion'), this);
            }.createDelegate(this)
        });

        this.store = new Ext.data.Store({
            url: 'getUnion',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'iduniontabla'
            }, [
                {
                    name: 'idunion'
                },
                {
                    name: 'idmapeo'
                },
                {
                    name: 'campoinicial'
                },
                {
                    name: 'operador'
                },
                {
                    name: 'campofinal'
                },
                {
                    name: 'logico'
                }
            ])
        });


        this.columns = [
            {
                header: this.idioma.tfLogico,
                width: 80,
                menuDisabled: true,
                dataIndex: 'logico'
            },
            {
                header: this.idioma.cbCampoInicial,
                width: 120,
                menuDisabled: true,
                dataIndex: 'campoinicial'
            },
            {
                header: this.idioma.cbOperador,
                width: 120,
                menuDisabled: true,
                dataIndex: 'operador'
            },
            {
                header: this.idioma.cbCampoFinal,
                width: 120,
                menuDisabled: true,
                dataIndex: 'campofinal'
            },
        ]

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                'rowselect': function (sm, rowIndex, rec) {
                    self.btnAdicionar.enable();
                    self.btnModificar.enable();
                    self.btnEliminar.enable();
                },
                'rowdeselect': function (sm, rowIndex, rec) {
                    self.btnEliminar.disable();
                    self.btnModificar.disable();
                }
            }
        });

        this.on('load', function () {
            self.btnModificar.disable();
            self.btnEliminar.disable();
            self.btnAdicionar.enable();
            self.btnAdicionar.focus();
        }, this);
        this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar];
        Ext.reccomplejas.CmpUnionTabla.superclass.initComponent.call(this);
    },
    eliminarUnion: function (id, self) {
        mostrarMensaje(2, this.idioma.askDelUnion, function (btn) {
            if (btn == "ok") {
                PVD.mostrarMascara('eliminarUnion', self.idioma.MsgWait, self.idioma.MsgEliminarUnionAccion);
                Ext.Ajax.request({
                    url: 'eliminarUnion',
                    method: 'POST',
                    params: {
                        idunion: id
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('eliminarUnion');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.eliminar == 1) {
                            self.store.reload();
                            Ext.Notification.show({
                                title: self.idioma.titleInfo,
                                msg: self.idioma.MsgDelUnionOK,
                                time: 3
                            });
                            self.btnEliminar.disable();
                            self.btnModificar.disable();
                            self.btnAdicionar.enable();
                            self.btnAdicionar.focus();
                        }
                        else {
                            Ext.Notification.show({
                                title: self.idioma.titleInfo,
                                msg: self.idioma.MsgDelUnionFail,
                                time: 3
                            });
                            self.btnAdicionar.enable();
                            self.btnAdicionar.focus();
                        }
                    }
                });
            } else {
                self.btnAdicionar.enable();
                self.btnAdicionar.focus();
            }
        });
    }
});

Ext.reccomplejas.winMapeoCampos = Ext.extend(Ext.Window, {
    layout: 'fit',
    closeAction: 'hide',
    modal: true,
    plain: true,
    initComponent: function () {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;

        /**
         * Record para almacenar los campos nuevos
         * @type {void|Function}
         */
        this.recCampo = Ext.data.Record.create([
            {name: 'campo'}
        ]);

        /*--- Formularion para conformar la relacion ---*/
        this.stCampoInicial = new Ext.data.Store({
            url: 'getCamposTabla',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'campo'
                }
            ]),
            listeners: {
                load: function (st, rec, opt) {
                    self.cbCampoInicial.focus();
                }
            }
        });

        this.cbCampoInicial = new Ext.form.BtnComboBox({
            name: 'cbCampoInicial',
            store: self.stCampoInicial,
            fieldLabel: this.idioma.cbCampoInicial,
            displayField: 'campo',
            valueField: 'campo',
            id: 'cbCampoInicial' + self.id,
            prevTab: 'btnAceptar' + self.id,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: this.idioma.MsgSeleccione,
            anchor: '95%',
            listeners: {
                'change': function () {
                    self.cambio = 1
                }
            }
        });
        var arrOperadores = [
            ['=', 'Igual'],
            ['<>', 'Distinto'],
            ['>', 'Mayor'],
            ['<', 'Menor'],
            ['>=', 'Mayor igual'],
            ['<=', 'Menor igual'],
            ['IN', 'Contenido en'],
            ['NOT IN', 'No se encuentra en'],
            ['IS NULL', 'Es nulo'],
            ['IS NOT NULL', 'No es nulo']
        ];
        var stOperador = new Ext.data.SimpleStore({
            fields: ['operador', 'showoperador'],
            data: arrOperadores
        });
        this.cbOperador = new Ext.form.ComboBox({
            store: stOperador,
            name: 'cbOperador',
            fieldLabel: this.idioma.cbOperador,
            displayField: 'showoperador',
            valueField: 'operador',
            typeAhead: true,
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            emptyText: this.idioma.MsgSeleccione,
            selectOnFocus: true,
            editable: true,
            anchor: '95%',
            listeners: {
                'change': function () {
                    self.cambio = 1
                }
            }
        });

        this.stCampoFinal = new Ext.data.Store({
            url: 'getCamposTabla',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'campo'
                }
            ]),
            listeners: {
                load: function (st, rec, opt) {
                    self.cbCampoInicial.focus();
                }
            }
        });
        this.cbCampoFinal = new Ext.form.BtnComboBox({
            name: 'cbCampoFinal',
            store: self.stCampoFinal,
            fieldLabel: this.idioma.cbCampoFinal,
            displayField: 'campo',
            valueField: 'campo',
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: this.idioma.MsgSeleccione,
            anchor: '95%',
            listeners: {
                'change': function () {
                    self.cambio = 1
                }
            }
        });
        var arrlogico = [
            ['and', 'Y'],
            ['or', 'O']
        ];
        var stLogico = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'idlog'
                },
                {
                    name: 'logico'
                }
            ]
        });
        stLogico.loadData(arrlogico);
        this.cbLogico = new Ext.form.ComboBox({
            name: 'cbLogico',
            store: stLogico,
            triggerAction: 'all',
            mode: 'local',
            displayField: 'logico',
            valueField: 'idlog',
            lazyRender: true,
            editable: true,
            fieldLabel: this.idioma.cbOperadorLogico,
            anchor: '98%',
            allowBlank: false,
            listeners: {
                'change': function () {
                    self.cambio = 1
                }
            }
        });
        this.fpUnion = new Ext.FormPanel({
            labelWidth: 90,
            region: 'center',
            border: false,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width: 700,
            height: 80,
            resizable: false,
            labelAlign: 'top',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .30,
                            layout: 'form',
                            items: self.cbCampoInicial
                        },
                        {
                            columnWidth: .24,
                            layout: 'form',
                            items: self.cbOperador
                        },
                        {
                            columnWidth: .30,
                            layout: 'form',
                            items: self.cbCampoFinal
                        },
                        {
                            columnWidth: .16,
                            layout: 'form',
                            items: self.cbLogico
                        }
                    ]
                }
            ]
        });

        this.btnCancelar = new Ext.Button({
            text: this.idioma.btnCancelar,
            tooltip: this.idioma.tooltipBtnCancelar,
            id: 'btnCancelar' + self.id,
            iconCls: 'cancelar',
            handler: function () {
                self.hide();
            }
        });

        this.btnAceptar = new Ext.Button({
            text: this.idioma.btnAceptar,
            tooltip: this.idioma.tooltipBtnAceptar,
            id: 'btnAceptar' + self.id,
            nextTab: 'cbCampoInicial' + self.id,
            prevTab: 'btnCancelar' + self.id,
            iconCls: 'aceptar',
            handler: function () {
                self.actualizarUnion(self.parent.parent.gpMapeo.getSelectionModel().getSelected().get('idmapeo'), self.parent);
            }
        })
        this.items = [self.fpUnion];
        this.buttons = [self.btnCancelar, self.btnAceptar];

        this.on('show', function () {
            self.fpUnion.getForm().reset();
            self.stCampoInicial.load({
                params: {
                    servidor: self.config.get('servidor'),
                    puerto: self.config.get('puerto'),
                    usuario: self.config.get('usuario'),
                    contrasena: self.config.get('contrasena'),
                    basedato: self.config.get('basedato'),
                }
            });
            self.stCampoFinal.load({
                params: {
                    servidor: self.config.get('servidor'),
                    puerto: self.config.get('puerto'),
                    usuario: self.config.get('usuario'),
                    contrasena: self.config.get('contrasena'),
                    basedato: self.config.get('basedato')
                }
            });
            self.btnCancelar.focus();
        }, this);

        this.keys = [
            {
                key: 'x',
                alt: true,
                fn: function () {
                    self.btnCancelar.handler();
                }
            }
        ];
        Ext.reccomplejas.winMapeoCampos.superclass.initComponent.call(this);
    },
    actualizarUnion: function (idmapeo, rec) {
        var self = this;
        var url = 'adicionarUnion';
        var params;
        if (this.fpUnion.getForm().isValid()) {
            if (this.cambio == 1) {
                if (this.accion == 'ADD') {
                    url = 'adicionarUnion';
                    params = {
                        idmapeo: idmapeo,
                        campoinicial: this.fpUnion.getForm().findField('cbCampoInicial').getRawValue(),
                        operador: this.fpUnion.getForm().findField('cbOperador').getValue(),
                        campofinal: this.fpUnion.getForm().findField('cbCampoFinal').getRawValue(),
                        logico: this.fpUnion.getForm().findField('cbLogico').getValue()
                    };
                } else {
                    url = 'modificarUnion';
                    params = {
                        idunion: rec.getSelectionModel().getSelected().get('idunion'),
                        idmapeo: idmapeo,
                        campoinicial: this.fpUnion.getForm().findField('cbCampoInicial').getRawValue(),
                        operador: this.fpUnion.getForm().findField('cbOperador').getValue(),
                        campofinal: this.fpUnion.getForm().findField('cbCampoFinal').getRawValue(),
                        logico: this.fpUnion.getForm().findField('cbLogico').getValue()
                    };
                }
                PVD.mostrarMascara('actualizarUnion', this.idioma.MsgWait, this.idioma.MsgAddUnionAccion);
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: params,
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('actualizarUnion');
                        self.hide();
                        self.parent.store.reload();
                        responseData = Ext.decode(response.responseText);
                        this.labels = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
                        if (responseData.modificar == 1) {
                            this.cambio = 0;
                            Ext.Notification.show({
                                title: this.labels.titleInfo,
                                msg: self.accion == 'ADD' ? this.labels.MsgAddUnionOK : this.labels.MsgModUnionOK,
                                time: 3
                            });
                        }
                        else {
                            Ext.Notification.show({
                                title: this.labels.titleInfo,
                                msg: self.accion == 'ADD' ? this.labels.MsgAddUnionFail : this.labels.MsgModUnionFail,
                                time: 3
                            });
                        }
                    }
                });
            }
        }
    }
});