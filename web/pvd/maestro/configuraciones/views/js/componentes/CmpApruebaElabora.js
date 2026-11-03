/**
 * @name componentes.CmpRegUnico - Componente para la configuración de las personas que aprueba o elaboran el registro de persona.
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Beatriz Selema Alvarez
 * @version 1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.CmpApruebaElabora = Ext.extend(Ext.Panel, {
    id: 'pAprueba',
    title: 'Firmas',
    tabTip: 'Firmas',
    layout: 'border',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
        var idper = '';
        var accion = '';

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: this.idioma.btnAyuda,
            iconCls: 'ayuda',
            tooltip: this.idioma.lbBtnAyuda
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            text: this.idioma.btnEliminar,
            tooltip: this.idioma.lbbtnEliminar,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                mostrarMensaje(2, self.idioma.lbTitMsgSeguroEliminarPersona, function (btnPresionado) {
                    if (btnPresionado == 'ok') {
                        var persona = self.gpAprueba.getSelectionModel().getSelections();
                        var arrpersonas = new Array();
                        Ext.each(persona, function (rec) {
                            arrpersonas.push(rec.data.idfirma)
                        });
                        Ext.Ajax.request({
                            url: '/pvd/maestro/configuraciones/index.php/confpersona/delConf',
                            params: {
                                idfirma: Ext.encode(arrpersonas)
                            },
                            success: function (n) {
                                var responseData = Ext.decode(n.responseText);
                                if (responseData.codMsg == 3)
                                    mostrarMensaje(3, responseData.mensaje);
                                else {
                                    mostrarMensaje(1, responseData.mensaje);
                                }
                                self.stgpCon.load();
                            }
                        });
                    }

                })
            }
        });


        this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.lbbtnAdicionar,
            iconCls: 'adicionar',
            handler: function () {
                self.accion = 'ADD';
                self.formularioGestion.getForm().reset();
                self.ventana.show();
            }
        });

//Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: this.idioma.btnModificar,
            tooltip: this.idioma.lbbtnModificar,
            iconCls: 'modificar',
            disabled: true,
            handler: function () {
                self.accion = 'MOD';
                self.ventana.setTitle('Modificar firma');
                self.ventana.show();
                self.formularioGestion.getForm().loadRecord(self.gpAprueba.getSelectionModel().getSelected());
                self.tfdenom.setValue(self.gpAprueba.getSelectionModel().getSelected().get('nombreapellidos'));
                self.idper = self.gpAprueba.getSelectionModel().getSelected().get('idpersona');
                self.btnAplicar.hide();

            }
        });

//Store para el grid
        this.stgpCon = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/confpersona/getCfgpersona',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos"},
                [
                    {name: 'idfirma'}
                    ,
                    {name: 'idpersona'}
                    ,
                    {name: 'identidad'}
                    ,
                    {name: 'elabora'}
                    ,
                    {name: 'aprueba'}
                    ,
                    {name: 'nombreapellidos'}

                ]),
            autoLoad: true
        });

        this.smgp = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (selM, indexF, r) {
                    self.btnModificar.enable();
                    self.btnEliminar.enable();
                }.createDelegate(this)
            }
        });

        this.gpAprueba = new Ext.grid.GridPanel({
            store: this.stgpCon,
            sm: this.smgp,
            region: 'center',
            loadMask: {msg: 'Cargando...'},
            columns: [//this.smgp,
                {
                    header: "Nombre y apellidos",
                    dataIndex: 'nombreapellidos',
                    width: 260
                },
                {
                    header: "Aprueba",
                    dataIndex: 'aprueba',
                    width: 60,
                    align: 'center',
                    renderer: setX
                },

                {
                    header: "Elabora",
                    dataIndex: 'elabora',
                    width: 60,
                    align: 'center',
                    renderer: setX
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
            text: this.idioma.lbBtnCancelar,
            tooltip:this.idioma.textToolTipCancelar,
            handler: function () {
                self.ventana.hide()
            }
        });

        this.reccomplejaspersonas = new Ext.components.CmpReccomplejas.Interfaz({
            margins: '5 5 5 0',
            title: 'Reccomplejas',
            width: '100%',
            //height: 300,
            region: 'center',
            border: true,
            idconfiguracion: 'personas',
            tituloReporte: 'Reporte de personas',
            tituloConfiguracion: 'Configuración de la búsqueda',
            tituloGrid: 'Listado de personas',
            hideBtnRtf: true,
            singleSelect: false,
            noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
            useMap: false,
            hideBtnOperCant: false,
            filters: [
                {
                    idcampo: "1158",
                    condicion: "IS NULL",
                    valor: ""
                },
                {
                    idcampo: "1160",
                    condicion: "=",
                    valor: 1
                }
            ],
            renderers: {
                showFoto: function (val) {
                    if (!Ext.isEmpty(val)) {
                        return '<img src="' + val + '" width= "40" heigth= "40"/>'
                    } else {
                        return '<img src="/pvd/persona/views/images/persona/no-photo-male.png" width= "40" heigth= "40"/>';
                    }
                }

            },
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarRec.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarRec.handler();

                    }
                }
            ]
        });


        this.btnAceptarRec = new Ext.Button({
            iconCls: 'aceptar',
            text: this.idioma.lbBtnAceptar,
            tooltip:this.idioma.textToolTipAceptar,
            handler: function () {
                var persona = self.reccomplejaspersonas.pReporte.gpReporte.getSelectionModel().getSelected();
                self.tfdenom.setValue(persona.data.idpersona);
                self.tfdenom.setRawValue(persona.data.nombreyapellidos);
                self.idper = persona.data.idpersona;
                self.ventanarec.hide();
            }
        });

        this.btnCancelarRec = new Ext.Button({
            iconCls: 'cancelar',
            text: this.idioma.lbBtnCancelar,
            tooltip:this.idioma.textToolTipCancelar,
            handler: function () {
                self.ventanarec.hide()
            }
        });

        this.ventanarec = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            title: this.idioma.lbTitVentAdd,
            width: 350,
            height: 200,
            items: [self.reccomplejaspersonas],
            buttons: [
                self.btnCancelarRec,
                self.btnAceptarRec
            ]
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: this.idioma.lbBtnAceptar,
            tooltip:this.idioma.textToolTipAceptar,
            handler: function () {
                save('ACP');
            }

        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: this.idioma.lbBtnAplicar,
            tooltip:this.idioma.textToolTipAplicar,
            handler: function () {
                save('APL');
            }
        });

        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank: false,
            width: 300,
            name: 'denominacion',
            listeners: {
                focus: function () {

                    self.ventanarec.show();
                    self.ventanarec.maximize();
                    self.reccomplejaspersonas.pReporte.gpReporte.getSelectionModel().clearSelections();

                }
            }
        });

        this.checkAprueba = new Ext.form.Checkbox({
            id: 'checkApr',
            boxLabel: 'Aprueba',
            //anchor: '50%',
            name: 'aprueba',
            labelSeparator: ''
        });
        this.checkElabora = new Ext.form.Checkbox({
            id: 'checkEla',
            boxLabel: 'Elabora',
            //anchor: '50%',
            name: 'elabora',
            labelSeparator: ''
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
                            items: [self.checkAprueba]
                        },
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [self.checkElabora]
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
            title: this.idioma.lbTitVentAdd,
            width: 330,
            height: 190,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });

        this.items = [this.gpAprueba];

        function setX(value, metadata, record, rowIndex, colIndex, store) {
            if (value == 1) {
                return 'X';
            }
            else {
                return '';
            }

        }

        function save(btnPress) {
            if (self.formularioGestion.getForm().isValid()) {
                if(self.checkAprueba.getValue()=='' &&  self.checkElabora.getValue()=='' ){
                    mostrarMensaje(8,'Debe seleccionar al menos un elemento');
                }else{
                    if (self.accion == 'ADD') {
                        Ext.Ajax.request({
                            url: '/pvd/maestro/configuraciones/index.php/confpersona/addConf',
                            params: {
                                idepersona: self.idper,
                                aprueba: self.checkAprueba.getValue(),
                                elabora: self.checkElabora.getValue()
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
                    }else{
                        Ext.Ajax.request({
                            url: '/pvd/maestro/configuraciones/index.php/confpersona/updConf',
                            params: {
                                idfirma:self.gpAprueba.getSelectionModel().getSelected().get('idfirma'),
                                idepersona: self.idper,
                                aprueba: self.checkAprueba.getValue(),
                                elabora: self.checkElabora.getValue()
                            },
                            callback: function () {
                                Ext.getBody().unmask();
                            },
                            success: function (n) {
                                var responseData = Ext.decode(n.responseText);
                                if (responseData.codMsg == 3)
                                    mostrarMensaje(8, responseData.mensaje);
                                else {
                                    mostrarMensaje(1, responseData.mensaje);
                                }
                                self.stgpCon.load();
                                self.ventana.hide();
                            }

                        });
                    }
                }


            }

        }

        Pvd.Maestro.Configuraciones.CmpApruebaElabora.superclass.initComponent.call(this);
    }
})
;
