/**
 * Created by root on 12/06/17.
 */
Ext.ns("Configuracion");


// Panel de integridad
Configuracion.Integridad = Ext.extend(Ext.Panel,
    {
        id: 'Integridad',
        defaults: {border: false},
        layout: 'border',
        initComponent: function () {
            var _this = this;

            //----------------PANEL DE INTEGRIDAD DE FICHEROS------------------------------------

            ////------------Stores------------////
            this.storeIntegridadFichero = new Ext.data.Store({
                id: 'storeIntegridadFichero',
                url: 'cargarConfiguracionIntegridad',
                reader: new Ext.data.JsonReader({
                    root: "datos",
                }, [
                    {
                        name: 'escaneoActivo'
                    },
                    {
                        name: 'invalidarSistema'
                    },
                    {
                        name: 'horaEscaneo'
                    },
                    {
                        name: 'estaInstaladoAIDE'
                    }
                ]),

            });

            this.storeIntegridadFichero.load({
                scope: this,
                callback: function (records, operation, success) {
                    if (success) {
                        Ext.getCmp('idEstadoCodigo').setValue(records[0].data.escaneoActivo);
                        Ext.getCmp('inhabilitarCodigo').setValue(records[0].data.invalidarSistema);
                        Ext.getCmp('idOpcionesCodigo').setDisabled(!records[0].data.escaneoActivo);
                        Ext.getCmp('idEstadoCodigo').setVisible(true);
                    }
                }
            });

            this.maskSalvarConfiguracion = new Ext.LoadMask(Ext.getBody(),
                {
                    msg: perfil.etiquetas.lbMsjMascaraGuardarConfiguraciones,
                });
            this.maskActualizarBDFichero = new Ext.LoadMask(Ext.getBody(),
                {
                    msg: perfil.etiquetas.lbMsjMascaraActualizarBDFichero,
                });

            ////---------- Botones ----------////
            this.guardarIntegridadCodigo = new Ext.Button({
                id: 'guardarIntegridadCodigo',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                disabled: true,
                iconCls: 'guardar',
                text: perfil.etiquetas.lbBtnGuardar,
                handler: guardarIntegridadCodigo
            });


            this.integridadcodigo = new Ext.Panel({
                id: 'panelIntegridadCodigo',
                region: 'center',
                border: false,
                defaults: {
                    style: {
                        padding: '5px'
                    },
                    border: false
                },
                frame: true,
                tbar: [
                    {
                        xtype: 'label',
                        html: "<span style='cursor: default;color: #15428b;font-weight: bold;'>" + perfil.etiquetas.lbTitleIntegridadFichero + "</span>"
                    }, '->',
                    {
                        xtype: 'toggle',
                        id: 'idEstadoCodigo',
                        hidden: true,
                        listeners: {
                            check: function (toggle, checked) {
                                Ext.getCmp('idOpcionesCodigo').setDisabled(!checked);
                                Ext.getCmp('guardarIntegridadCodigo').setDisabled(false);

                            }
                        }
                    }],
                items: [
                    {
                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Opciones',
                                id: 'idOpcionesCodigo',
                                layout: 'form',
                                disabled: true,
                                defaults: {width: '20%'},
                                autoHeight: true,
                                items: [
                                    {
                                        xtype: 'field',
                                        fieldLabel: perfil.etiquetas.lbHoraEscaneo,
                                        editable: false,
                                        readOnly: true,
                                        value: '06:25 AM',
                                        disabled: true
                                    },
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: perfil.etiquetas.lbInhabilidarSistema,
                                        hideLabel: true,
                                        id: 'inhabilitarCodigo',
                                        name: 'inhabilitarCodigo',
                                        listeners: {
                                            check: function (toggle, chequed) {
                                                Ext.getCmp('guardarIntegridadCodigo').setDisabled(false);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: perfil.etiquetas.lbBtnActualizarBD,
                                        iconCls: 'actualizar',
                                        handler: actualizarBDFicheros
                                    }
                                ]
                            }
                        ]
                    }
                ],
                buttons: [_this.guardarIntegridadCodigo],
                buttonAlign: 'right'
            });

            //----------------PANEL DE INTEGRIDAD DE DB------------------------------------

            this.storeIntegridadBD = new Ext.data.Store({
                id: 'storeIntegridadBD',
                url: '../checkintegrity/estaHabilitadaDeteccionCambiosBD',
                autoLoad: true,
                reader: new Ext.data.JsonReader({
                    root: "datos",
                }, [
                    {
                        name: 'estaHabilitadaDeteccionCambiosBD'
                    }
                ]),
                listeners: {
                    load: function (store, records) {
                        Ext.getCmp('idEstadoBD').setValue(records[0].data.estaHabilitadaDeteccionCambiosBD);
                    }
                }
            });

            this.guardarIntegridadBD = new Ext.Button({
                id: 'guardarIntegridadBD',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                iconCls: 'guardar',
                text: perfil.etiquetas.lbBtnGuardar,
                listeners: {
                    'click': guardarIntegridadBD
                }
            });

            this.integridadbd = new Ext.Panel({
                id: 'formIntegridadBD',
                region: 'south',
                height: 300,
                border: false,
                defaults: {
                    style: {
                        padding: '5px'
                    },
                    border: false
                },
                frame: true,
                tbar: [
                    {
                        xtype: 'label',
                        html: "<span style='cursor: default;color: #15428b;font-weight: bold;'>" + perfil.etiquetas.lbTitleIntegridadBD + "</span>"
                    }, '->',
                    {
                        xtype: 'toggle',
                        id: 'idEstadoBD',
                        checked: false,
                        listeners: {
                            check: function () {
                                Ext.getCmp('guardarIntegridadBD').setDisabled(false);
                            }
                        }
                    }
                ],
                items: [// TODO poner opciones mas adelante
                    {}
                ],
                buttons: [_this.guardarIntegridadBD],
                buttonAlign: 'right'
            });

            this.items = [
                _this.integridadcodigo,
                _this.integridadbd
            ];

            Configuracion.Integridad.superclass.initComponent.call(this);

            ////---------- Funciones ----------////
            function guardarIntegridadCodigo(button) {
                _this.maskSalvarConfiguracion.show();
                Ext.Ajax.request({
                    url: 'cambiarConfiguracionIntegridad',
                    params: {
                        escaneoActivo: Ext.getCmp('idEstadoCodigo').getValue(),
                        invalidarSistema: Ext.getCmp('inhabilitarCodigo').getValue(),
                    },
                    callback: function (options, succes, response) {
                        if (3 != Ext.decode(response.responseText).codMsg)
                            mostrarMensaje(1, perfil.etiquetas.lbMsjInfoSalvarConfiguracion);
                        _this.maskSalvarConfiguracion.hide();
                    },
                });

                button.setDisabled(true);
            }

            function guardarIntegridadBD(me) {
                _this.maskSalvarConfiguracion.show();
                var estado = Ext.getCmp('idEstadoBD').getValue();
                var url = estado ? '../checkintegrity/habilitarDeteccionCambiosBD' : '../checkintegrity/deshabilitarDeteccionCambiosBD';
                Ext.Ajax.request({
                    url: url,
                    timeout: 600000,
                    callback: function (option, success, resp) {
                        var response = JSON.parse(resp.responseText);
                        if (response.success) {
                            var msgId = response.msgId;
                            me.setDisabled(true);
                            mostrarMensaje(7, perfil.etiquetas[msgId]);
                        }else{
                            Ext.getCmp('idEstadoBD').setValue(!estado);
                        }
                        _this.maskSalvarConfiguracion.hide();
                    }
                });
            }

            function actualizarBDFicheros() {
                //Poniendo la máscara
                _this.maskActualizarBDFichero.show();
                //TODO
                //Por la demora hay que hacerlo fuera de proceso con workers
                Ext.Ajax.request({
                    url: 'actualizarBD',
                    timeout: 600000,
                    callback: function (options, success, response) {
                        if (3 != Ext.decode(response.responseText).codMsg)
                            mostrarMensaje(1, perfil.etiquetas.lbMsjInfoAideUpdateBD);
                        _this.maskActualizarBDFichero.hide();

                    }
                });
            }

        }
    }
);