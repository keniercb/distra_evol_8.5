
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.CmpRangoEdades = Ext.extend(Ext.Panel, {
    id: 'pRangoEdades',
    title: 'Rango de edades',
    tabTip: 'Rango de edades',
    layout: 'border',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
        var accion = '';

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: this.idioma.btnAyuda,
            iconCls: 'ayuda',
            tooltip: this.idioma.lbBtnAyuda
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            text: 'Eliminar',
            tooltip: 'Eliminar escala <b>(Dell)</b>',
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var mensaje;
                var persona = self.gpRangoEdades.getSelectionModel().getSelections();
                if (persona.length == 1) {
                    mensaje = '¿Est&aacute; seguro que desea eliminar el rango de edad seleccionado?';
                } else {
                    mensaje = '¿Est&aacute; seguro que desea eliminar los rangos de edades seleccionados?';
                }
                mostrarMensaje(2, mensaje, function (btnPresionado) {
                    if (btnPresionado == 'ok') {
                        var arrescalas = new Array();
                        Ext.each(persona, function (rec) {
                            arrescalas.push(rec.data.idrangoedades)
                        });
                        Ext.Ajax.request({
                            url: '/pvd/maestro/configuraciones/index.php/confrangoedades/delRango',
                            params: {
                                configuraciones: Ext.encode(arrescalas)
                            },
                            success: function (n) {
                                var responseData = Ext.decode(n.responseText);
                                if (responseData.codMsg == 3)
                                    mostrarMensaje(3, responseData.mensaje);
                                else {
                                    mostrarMensaje(1, responseData.mensaje);
                                }
                                self.stgpCon.removeAll();
                                self.stgpCon.reload();
                            }
                        });
                    }

                })
            }
        });


        this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Adicionar escala <b>(Alt+I)</b>',
            iconCls: 'adicionar',
            handler: function () {
                self.accion = 'ADD';
                self.ventana.setTitle('Adicionar rango de edad');
                self.formularioGestion.getForm().reset();
                self.ventana.show();
                self.btnAplicar.show();
            }
        });

//Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: '<u>M</u>odificar',
            tooltip: 'Modificar escala <b>(Alt+A)</b>',
            iconCls: 'modificar',
            disabled: true,
            handler: function () {
                self.accion = 'MOD';
                self.ventana.setTitle('Modificar rango de edad');
                self.ventana.show();
                self.formularioGestion.getForm().loadRecord(self.gpRangoEdades.getSelectionModel().getSelected());
                self.tfdenom.setValue(self.gpRangoEdades.getSelectionModel().getSelected().get('denominacion'));
                self.btnAplicar.hide();
            }
        });

//Store para el grid
        this.stgpCon = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/confrangoedades/getRangos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos"},
                [
                    {name: 'idrangoedades'},
                    {name: 'denominacion'},
                    {name: 'operador'},
                    {name: 'valorinicial'},
                    {name: 'valorfinal'},
                    {name: 'idestructura'},
                    {name: 'orden'}
                ]),
            autoLoad: true
        });

        this.smgp = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function () {
                    self.btnModificar.enable();
                    self.btnEliminar.enable();
                }.createDelegate(this)
            }
        });

        this.gpRangoEdades = new Ext.grid.GridPanel({
            store: this.stgpCon,
            sm: this.smgp,
            region: 'center',
            loadMask: {msg: 'Cargando...'},
            columns: [//this.smgp,
                {
                    header: "Denominación",
                    dataIndex: 'denominacion',
                    width: 260
                },
                {
                    header: "Valor inicial",
                    dataIndex: 'valorinicial',
                    width: 100,
                    align: 'center'
                },
                {
                    header: "Valor final",
                    dataIndex: 'valorfinal',
                    width: 100,
                    align: 'center'
                },
                {
                    header: "Orden",
                    dataIndex: 'orden',
                    width: 100,
                    align: 'center'
                }
            ],
            tbar: [self.btnAdicionar, self.btnModificar, self.btnEliminar, '->', self.btnAyuda],
            keys: [
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionar.handler();
                    }
                },
                {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificar.disabled) {
                            self.btnModificar.handler();
                        }

                    }
                },
                {
                    key: 46,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminar.disabled) {
                            self.btnEliminar.handler();
                        }
                    }
                }
            ]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbBtnCancelar,
            handler: function () {
                self.ventana.hide()
            }
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbBtnAceptar,
            handler: function () {
                save('ACP');
            }

        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbBtnAplicar,
            handler: function () {
                save('APL');
            }
        });

        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Denominación',
            allowBlank: false,
            width: 300,
            name: 'denominacion'
        });

        this.nfDesde = new Ext.form.NumberField({
            id: 'valorinicial',
            fieldLabel: 'Valor inicial',
            minLength: 1,
            maxLength: 3,
            allowBlank: true,
            enableKeyEvents: true,
            allowDecimals: true,
            minValue: 1,
            maxValue: 400,
            width: '98%',
            name: 'valorinicial'
        });

        this.nfHasta = new Ext.form.NumberField({
            id: 'valorfinal',
            fieldLabel: 'Valor final',
            minLength: 1,
            maxLength: 3,
            allowBlank: true,
            enableKeyEvents: true,
            allowDecimals: true,
            minValue: 1,
            maxValue: 400,
            width: '98%',
            name: 'valorfinal'
        });
        
        this.orden = new Ext.form.NumberField({
            id: 'orden',
            fieldLabel: 'Orden',
            minLength: 1,
            maxLength: 4,
            allowBlank: true,
            enableKeyEvents: true,
            allowDecimals: false,
            minValue: 1,
            maxValue: 1000,
            width: '98%',
            name: 'orden'
        });

        this.stOperador = new Ext.data.SimpleStore({
            fields: ['operador', 'denom'],
            data: [[1, 'Mayor (>)'], [2, 'Menor (<)'], [3, 'Igual (=)'], [4, 'Mayor o igual (>=)'], [5, 'Menor o igual (<=)']]
        });

        this.cbOperador = new Ext.form.ComboBox({
            id: 'operador',
            store: this.stOperador,
            displayField: 'denom',
            forceSelection: true,
            valueField: 'operador',
            fieldLabel: 'Operador',
            typeAhead: true,
            allowblank: false,
            anchor: '98%',
            name: 'operador',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            editable: false,
            readOnly: true
        });

        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            width: 350,
            height: 190,
            items: [self.tfdenom,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [self.nfDesde]
                        },{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [self.nfHasta]
                        },{
                            columnWidth: 1,
                            layout: 'form',
                            items: [self.orden]
                        }
                    ]
                }
            ],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptar.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelar.handler();

                    }
                },
                {
                    key: 'p',
                    alt: true,
                    ctrl:true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicar.handler();

                    }
                }
            ]
        });

        this.ventana = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            title: 'Adicionar rango de edad',
            width: 330,
            height: 240,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });

        this.items = [this.gpRangoEdades];

        function save(btnPress) {
            if (self.formularioGestion.getForm().isValid()) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (self.accion == 'ADD')?'/pvd/maestro/configuraciones/index.php/confrangoedades/addRango': '/pvd/maestro/configuraciones/index.php/confrangoedades/updRango',
                    params: {
                        idrangoedades: (self.accion == 'ADD') ? -1: self.gpRangoEdades.getSelectionModel().getSelected().data.idrangoedades,
                        denominacion: self.tfdenom.getValue(),
                        valorinicial: self.nfDesde.getValue(),
                        valorfinal: self.nfHasta.getValue(),
                        orden: self.orden.getValue()
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData.codigo == 1)
                            mostrarMensaje(1, responseData.mensaje);
                        if (btnPress == 'ACP') {
                            self.ventana.hide();
                        }
                        self.formularioGestion.getForm().reset();
                        self.stgpCon.reload();
                    }
                });
            }

        }

        Pvd.Maestro.Configuraciones.CmpRangoEdades.superclass.initComponent.call(this);
    }
})
;
