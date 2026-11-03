/**
 * Interfaz para asociar las escalas cualitativas*
 *
 * @author Ing. Javier Rodríguez López*
 * @package PVD *
 * @subpackage Evaluaciones *
 */

Ext.ns("Ext.PVD.Evaluaciones");
Ext.PVD.Evaluaciones.gpEscalas = Ext.extend(Ext.Panel, {
    layout: 'border',
    gestionar: false,
    initComponent: function() {
        var self = this;
        this.lang = Ext.lang.es.Evaluaciones.Escalas;
        var accionE = null;

        this.btnAyuda = new Ext.Button({
            id:'btnAyudaEscalas',
            text: this.lang.lbBtnAyuda,
            tooltip: this.lang.lbTTipBtnAyuda,
            iconCls: 'ayuda'
        });

        //Botón para adicionar una escala
        this.btnAdicionar = new Ext.Button({
            text: this.lang.btnAdicionar,
            tooltip: this.lang.ttpBtnAdicionar,
            iconCls: 'adicionar',
            handler: function() {
                accionE = 'ADD';
                VentanaEscala(accionE);
            }
        });

        //Botón para modificar una escala
        this.btnModificar = new Ext.Button({
            id: 'btnModificarE',
            text: this.lang.btnModificar,
            tooltip: this.lang.ttpBtnModificarE,
            iconCls: 'modificar',
            disabled: true,
            handler: function() {
                accionE = 'MOD';
                VentanaEscala(accionE);
            }
        });

        //Botón para eliminar una escala
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminarE',
            text: this.lang.btnEliminar,
            tooltip: this.lang.ttpBtnEliminarE,
            iconCls: 'eliminar',
            disabled: true,
            handler: function() {
                mostrarMensaje(2, labels.mensajeEliminarE, function(btn) {
                    if (btn == "ok") {
                        PVD.mostrarMascara('idmskdelete', self.lang.lbMsgWait, self.lang.msgDeletingEscala);
                        Ext.Ajax.request({
                            url: 'eliminarescala',
                            method: 'POST',
                            params: {
                                idEscala: self.grid.getSelectionModel().getSelected().get('idescala')
                            },
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmskdelete');
                                if (responseData.exception == 1) {
                                    Ext.MessageBox.show({
                                        title: 'Información',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO,
                                        msg: self.lang.lbConceptoEnUso,
                                        fn: function() {
                                            self.btnAdicionar.focus();
                                        }
                                    });
                                } else {
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje, function(btn) {
                                        self.stEscala.reload();
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });

        if (this.gestionar) {
            this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnAyuda];
        }

        this.btnBuscar = new Ext.Button({
            id: 'btn_Buscar' + this.id,
            text: this.lang.lbBtnBuscar,
            tooltip: this.lang.ttpBtnBuscar,
            iconCls: 'buscar',
            handler: function() {
                this.stEscala.load({
                    params: {
                        filtro: self.tfDenominacion.getValue(),
                        limit: 15,
                        start: 0
                    }
                });
            }.createDelegate(this)
        });

        this.btnLimpiar = new Ext.Button({
            text: this.lang.lbBtnLimpiar,
            tooltip: this.lang.ttpBtnLimpiar,
            iconCls: 'limpiar',
            handler: function() {
                self.tfDenominacion.reset();
                self.stEscala.load({
                    params: {
                        filtro: self.tfDenominacion.getValue(),
                        limit: 15,
                        start: 0
                    }
                });
            }
        });

        this.tfDenominacion = new Ext.form.TextField({
            xtype: 'textfield',
            minLength: 3,
            maxLength: 100,
            anchor: '95%',
            fieldLabel: this.lang.lbDenominacion,
			regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
            emptyText: this.lang.lbEmptyTextBuscar,
            listeners: {
                specialkey: function(field, e) {
                    if (e.getKey() == e.ENTER) {
                        if (!Ext.isEmpty(this.getValue())) {
                            self.btnBuscar.handler();
                        }
                    }
                }
            }
        });

        //bodyBorder:false,
        //tbar: tbEscala,

        this.pFiltros = new Ext.Panel({
            layout: 'column',
            cls: 'x-toolbar',
            margins: '5 5 5 5',
            frame: true,
            defaults: {
                layout: 'form',
                border: false,
                labelAlign: 'top',
                buttonAlign: 'right'
            },
            height: 63,
            autoScroll: true,
            autoShow: true,
            region: 'north',
            items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.tfDenominacion]
                }, {
                    layout: 'form',
                    bodyStyle: 'padding:19px 0 0 0;',
                    columnWidth: '35px',
                    items: [this.btnBuscar]
                }, {
                    layout: 'form',
                    bodyStyle: 'padding:19px 0 0 0;',
                    columnWidth: '35px',
                    items: [this.btnLimpiar]
                }]
        });

        var expDescripcion = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<p><b>Descripci&oacute;n:</b> {descripcion}</p>')
        });

        this.stEscala = new Ext.data.Store({
            url: '/pvd/evaluaciones/plantillas/index.php/escalas/todasescalas',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idescala"
            }, [{
                    name: 'idescala'
                },
                {
                    name: 'denom'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'tipoescala'
                },
                {
                    name: 'desde'
                },
                {
                    name: 'hasta'
                }
            ]),
            listeners: {
                beforeload: function(st, options) {
                    st.baseParams.filtro = self.tfDenominacion.getValue();
                },
                load: function() {
                    self.grid.getSelectionModel().selectFirstRow();
                }
            }
        });

        this.grid = new Ext.grid.GridPanel({
            region: 'center',
            title: this.lang.lbListEscala,
            plugins: expDescripcion,
            store: this.stEscala,
            columns: [expDescripcion,
                {
                    id: 'idEscala',
                    header: 'idescala',
                    hidden: true,
                    width: 50,
                    dataIndex: 'idescala'
                }
                , {
                    id: 'denom',
                    header: this.lang.lbDenominacion,
                    sortable: true,
                    dataIndex: 'denom'
                }
                , {
                    id: 'descrip',
                    header: this.lang.lbDescripcion,
                    hidden: true,
                    width: 150,
                    dataIndex: 'descripcion'
                }
                , {
                    id: 'tipoEscala',
                    header: this.lang.lbTipoEscala,
                    width: 100,
                    dataIndex: 'tipoescala',
                    renderer: this.showTipoEscala
                }
            ],
            loadMask: {
                msg: this.lang.loadingMsg
            },
            autoExpandColumn: 'denom',
            margins: '0 5 5 5',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function(sm, row, rec) {
                        self.btnModificar.enable();
                        self.btnEliminar.enable();
                        this.fireEvent('escalaseleccionada', rec);

                    }.createDelegate(this)
                }
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stEscala,
                displayInfo: true
            }),
            listeners: {
                render: function(grid) {
                    self.stEscala.load({params: {start: 0, limit: 15}});
                }
            }
        });

        this.items = [this.grid, this.pFiltros];

        this.keys = [{
                key: 'i',
                alt: true,
                fn: function() {
                    if (!self.btnAdicionar.hidden) {
                        self.btnAdicionar.handler();
                    }
                }
            }, {
                key: 'm',
                alt: true,
                fn: function() {
                    if (!self.btnAdicionar.hidden && !self.btnModificar.disabled) {
                        self.btnModificar.handler();
                    }
                }
            }, {
                key: 46,
                fn: function() {
                    if (!self.btnModificar.hidden && !self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            }, {
                key: 'b',
                alt: true,
                fn: self.btnBuscar.handler
            }, {
                key: 'l',
                alt: true,
                fn: function() {
                    self.btnLimpiar.handler();
                }
            }, {
                key: 'h',
                alt: true,
                fn: function() {
                    self.btnAyuda.handler();
                }
            }
        ];

        Ext.PVD.Evaluaciones.gpEscalas.superclass.initComponent.call(this);
        this.grid.on('load', function(cmp) {
            self.btnBuscar.focus();
        });

        //----------------------------------------------------------------------
        btnCancelarE = new Ext.Button({
            id: 'btnCancelarE',
            iconCls: 'cancelar',
            text: labels.btnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',//labels.lbToolTipCancelar,
            handler: function() {
                winEscala.hide();
            }
        });
        btnAplicarE = new Ext.Button({
            id: 'btnAplicarE',
            iconCls: 'aplicar',
            hidden: true,
            text: labels.btnAplicar,
            tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',//labels.lbToolTipAplicar,
            handler: function() {
                AddModEscalas(accionE, 'APLI');
            }
        });
        btnAceptarE = new Ext.Button({
            id: 'btnAceptarE',
            iconCls: 'aceptar',
            nextTab: 'tfdenomEscala',
            prevTab: 'btnAplicarE',
            text: labels.btnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',//labels.lbToolTipAceptar,
            handler: function() {
                AddModEscalas(accionE, 'ACEP');
            }
        });

        tfdenomEscala = new Ext.form.TextField({
            id: 'tfdenomEscala',
            fieldLabel: labels.lbDenominacion,
            name: 'denom',
            anchor: '99%',
            allowBlank: false,
            prevTab: 'btnAceptarE',
            maxLength: 255,
            blankText: labels.blankText,
            listeners: {
                specialkey: function(field, e) {
                    if (e.getKey() == e.ENTER) {
                        btnBuscar.handler();//LLamar al boton
                    }
                },
                change: function(tf, n, o) {
                    cambio = 1;
                }
            },
            //regex: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_/]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_/]*)+$/,
            //regexText: 'Solo se admite caracteres alfanuméricos'
        });

        dfFIEscala = new Ext.form.DateField({
            id: 'dfFIEscala',
            fieldLabel: labels.hFI,
            name: 'desde',
            width: 195,
            value: new Date().format('d/m/Y'),
            format: 'd/m/Y',
            allowBlank: false,
            invalidText: labels.invalidTextFecha,
            blankText: labels.blankText,
            listeners: {
                change: function(tf, n, o) {
                    cambio = 1;
                }
            },
            vtype: 'daterange',
            endDateField: 'dfFFEscala'
        });

        dfFFEscala = new Ext.form.DateField({
            id: 'dfFFEscala',
            fieldLabel: labels.hFF,
            name: 'hasta',
            width: 196,
            format: 'd/m/Y',
            invalidText: labels.invalidTextFecha,
            listeners: {
                change: function(tf, n, o) {
                    cambio = 1;
                }
            },
            vtype: 'daterange',
            startDateField: 'dfFIEscala'
        });

        arrayTipoEscala = [['0', 'Rango numérico'], ['1', 'Cualitativa'], ['2', 'Imagen']];

        storeCBTipoEscala = new Ext.data.SimpleStore({
            fields: ['valor', 'tipo'],
            data: arrayTipoEscala
        });

        cbTipoEscala = new Ext.form.ComboBox({
            name: 'tipoescala',
            //hiddenName: 'tipoescala',
            valueField: 'valor',
            typeAhead: true,
            triggerAction: 'all',
            allowBlank: false,
            blankText: labels.blankText,
            forceSelection: true,
            fieldLabel: labels.hTipoEscala,
            displayField: 'tipo',
            store: storeCBTipoEscala,
            mode: 'local',
            listeners: {
                change: function(tf, n, o) {
                    cambio = 1;
                }
            },
            emptyText: 'Seleccione...',//labels.emptyTextCB,
            anchor: '99%'
        });

        heDescripcion = new Ext.form.TextArea({
            height: 100,
            anchor: '99%',
            id: 'heDescripcion',
            maxLength: 255,
            fieldLabel: labels.lbDescripcion,
            listeners: {
                change: function(tf, n, o) {
                    cambio = 1;
                }
            },
            name: 'descripcion'
        });

        //FormPanel que contine los componentes necesarios para adicionar o modificar una escala.
        fpEscala = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            region: 'center',
            width: 420,
            autoHeight: true,
            autoShow: true,
            items: [tfdenomEscala, cbTipoEscala, {
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            anchor: '50%',
                            items: [dfFIEscala]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [dfFFEscala]
                        }]
                }, heDescripcion]
        });

        //Ventana para adicionar o modificar una escala seleccionada en el grid de la izquierda.
        winEscala = new Ext.Window({
            title: this.lang.titleProvicional,
            layout: 'fit',
            width: 430,
            //height:360,
            autoHeight: true,
            closable: true,
            resizable: false,
            closeAction: 'hide',
            items: [fpEscala],
            modal: true,
            buttons: [btnCancelarE, btnAplicarE, btnAceptarE]
        });
        winEscala.on('show', function(cmp) {
            tfdenomEscala.focus(false, 300);
        });
        winEscala.on('hide', function(cmp) {
            self.btnAdicionar.focus();
        });
        //Muestra ventana de adicionar o modificar
        function VentanaEscala(accion) {
            fpEscala.getForm().reset();
            if (accion == 'ADD') {
                winEscala.setTitle(labels.addEscala);
                btnAplicarE.show();
                winEscala.show();
            } else {
                var record = self.grid.getSelectionModel().getSelected();
                winEscala.setTitle(labels.modEscala);
                btnAplicarE.hide();
                winEscala.show();
                fpEscala.getForm().loadRecord(record);
            }
        }

        //Adiciona o modifica una escala
        function AddModEscalas(accion, boton) {
            var url = 'adicionarescala';
            var idescala = -1;
            if (accion == 'ADD')
            {
                idescala = -1;
                url = 'adicionarescala';
            }
            else
            {
                idescala = self.grid.getSelectionModel().getSelected().get('idescala');
                url = 'modificarescala';
            }
            if (cambio == 0) {
                if (accion == 'MOD')
                    winEscala.hide();
                else {
                    tfdenomEscala.markInvalid(labels.blankText);
                }
            }
            else if (fpEscala.getForm().isValid()) {
                if (dfFIEscala.getRawValue() != dfFFEscala.getRawValue()) {
                    PVD.mostrarMascara('idmsksaving', self.lang.lbMsgWait, self.lang.msgSaveEscala);
                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',
                        params: {
                            idescala: idescala,
                            denom: tfdenomEscala.getValue(),
                            tipoEscala: cbTipoEscala.getValue(),
                            descrip: heDescripcion.getValue(),
                            fi: dfFIEscala.getRawValue(),
                            ff: dfFFEscala.getRawValue()
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmsksaving');
                            if (responseData.codMsg == 1) {
                                mostrarMensaje(responseData.codMsg, responseData.mensaje, function() {
                                    if (accion == 'ADD') {
                                        fpEscala.getForm().reset();
                                    }
                                    if (boton == 'ACEP') {
                                        winEscala.hide();
                                    }
                                    self.stEscala.reload();
                                });

                            } else if (responseData.codMsg == 3)
                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        }
                    });
                }
                else {
                    Ext.MessageBox.show({
                        title: 'Alerta',
                        msg: labels.msgFechasIguales,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }
            }
        }
    },
    showTipoEscala: function(valor) {
        if (valor == 0)
            valor = 'Rango numérico';
        else if (valor == 1)
            valor = 'Cualitativa';
        else
            valor = 'Imagen';
        return valor;
    }
});
