Ext.ns("Configuracion");

Configuracion.ConfGeneral = Ext.extend(Ext.Panel,
    {
        id: 'ConfGeneral',
        layout: 'accordion',
        border: false,
        defaults: {border: false},

        initComponent: function () {
            var _this = this;

            ////---------- Botones ----------////
            this.guardarClave = new Ext.Button({
                id: 'guardarClave',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                iconCls: 'guardar',
                text: 'Guardar',
                handler: modificarClave
            });

            this.guardarTraza = new Ext.Button({
                id: 'guardarTraza',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                iconCls: 'guardar',
                text: 'Guardar',
                handler: modificarTraza
            });

            this.guardarBloqueo = new Ext.Button({
                id: 'guardarBloqueo',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                iconCls: 'guardar',
                text: 'Guardar',
                handler: modificarBloqueo
            });

            this.guardarEntidad = new Ext.Button({
                id: 'guardarEntidad',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                iconCls: 'guardar',
                text: 'Guardar',
                handler: modificarEntidad
            });
            this.guardarModoInicio = new Ext.Button({
                id: 'guardarModoInicio',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                iconCls: 'guardar',
                text: 'Guardar',
                handler: GuardarModoInicio
            });

            /*this.configurarCeinClient = new Ext.Button({
                id: 'configurarCeinClient',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                iconCls: 'guardar',
                text: 'Guardar',
                handler: configurarCeinClient
            });*/

            ////---------- Formulario de Inicio ----------////
            this.ModoInicio = new Ext.FormPanel({
                title: 'Modo de inicio',
                border: false,
                layout: 'column',
                frame: true,
                defaults: {
                    height: 120,
                    style: {
                        padding: '7px',
                        margin: '7px'
                    }
                },
                bodyStyle: 'padding:5px 5px 5px 5px',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Modo de inicio',
                        id: 'modoiniciofieldset',
                        columnWidth: .25,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'radio',
                                id: 'navegador',
                                boxLabel: 'En el navegador',
                                hideLabel: true,
                                name: 'radiogroup',
                            },
                            {
                                xtype: 'radio',
                                id: 'emergente',
                                boxLabel: 'Inicio emergente',
                                hideLabel: true,
                                name: 'radiogroup',
                            }
                        ],
                        listeners: {
                            beforerender: function () {
                                //alert('fdfdsfsdf');
                                Ext.Ajax.request({
                                    url: 'obtenerModoInicio',
                                    success: function (response) {
                                        var text = Ext.decode(response.responseText);

                                        if (text.modoinicio == 1) {
                                            Ext.getCmp("emergente").setValue(true);
                                        }
                                        if (text.modoinicio == 2) {
                                            Ext.getCmp("navegador").setValue(true);
                                        }
                                    }
                                });
                            }
                        }
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Información',
                        columnWidth: .75,
                        html: 'La configuración del modo de inicio permite a los usuarios modificar el modo de inicio del sistema. La opción En el navegador permite iniciar el sistema la misma ventana del navegador en donde fue abierto, la opción inicio emergente permita abrir el sistema en una ventana emergente.'
                    },
                ],
                buttons: [_this.guardarModoInicio],
                buttonAlign: 'right'
            });

            ////---------- Formulario de Clave ----------////
            this.Clave = new Ext.FormPanel({
                title: 'Clave de acceso',
                labelAlign: 'top',
                height: 220,
                layout: 'column',
                defaults: {
                    style: {
                        padding: '7px',
                        margin: '7px',
                    },
                    layout: 'form',
                    height: 180
                },
                frame: true,
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'numerica', mapping: 'numerica'},
                    {name: 'idrestricclaveacceso', mapping: 'idrestricclaveacceso', visible: false},
                    {name: 'signo', mapping: 'signo'},
                    {name: 'alfabetica', mapping: 'alfabetica'},
                    {name: 'mayuscula', mapping: 'mayuscula'},
                    {name: 'minimocaracteres', mapping: 'minimocaracteres'},
                    {name: 'diascaducidad', mapping: 'diascaducidad'},
                    {name: 'historicoPass', mapping: 'historicoPass'}
                ]),
                bodyStyle: 'padding:5px 5px 5px 5px',
                items: [
                    {
                        xtype: 'fieldset',
                        title: perfil.etiquetas.lbTitFieldSet,
                        id: 'clavesfieldset',
                        columnWidth: .15,
                        items: [
                            {
                                xtype: 'checkbox',
                                id: 'numerica',
                                boxLabel: perfil.etiquetas.lbBLNumerico,
                                hideLabel: true,
                                name: 'numerica',
                                anchor: '80%'
                            },
                            {
                                xtype: 'checkbox',
                                boxLabel: perfil.etiquetas.lbBLSignos,
                                hideLabel: true,
                                name: 'signo',
                                id: 'signos',
                                anchor: '80%'
                            },
                            {
                                xtype: 'checkbox',
                                boxLabel: perfil.etiquetas.lbBLAlfabetico,
                                hideLabel: true,
                                name: 'alfabetica',
                                id: 'alfabetica',
                                anchor: '80%'
                            },
                            {
                                xtype: 'checkbox',
                                boxLabel: perfil.etiquetas.lbMayuscula,
                                hideLabel: true,
                                name: 'mayuscula',
                                id: 'mayuscula',
                                anchor: '80%'
                            }
                        ]

                    },
                    {
                        xtype: 'fieldset',
                        title: 'Seguridad',
                        columnWidth: .15,
                        items: [
                            {
                                xtype: 'numberfield',
                                id: 'minimocaracteres',
                                fieldLabel: perfil.etiquetas.lbFLMinCaracteres,
                                name: 'minimocaracteres',
                                allowBlank: false,
                                blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                maxValue: 30,
                                minValue: 8,
                                anchor: '80%'
                            },
                            {
                                xtype: 'numberfield',
                                id: 'diascaducidad',
                                fieldLabel: perfil.etiquetas.lbFLDiasCaducidad,
                                name: 'diascaducidad',
                                allowBlank: false,
                                blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                maxValue: 365,
                                minValue: 60,
                                anchor: '80%'
                            },
                            {
                                xtype: 'numberfield',
                                id: 'historicoPass',
                                fieldLabel: perfil.etiquetas.lbFLHistoricoPass,
                                name: 'historicoPass',
                                allowBlank: false,
                                blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                maxValue: 100,
                                minValue: 25,
                                anchor: '80%'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Información',
                        columnWidth: .7,
                        html: perfil.etiquetas.htmlClave
                    }

                ],
                buttons: [_this.guardarClave],
                buttonAlign: 'right'
            });

            this.Clave.load({url: 'cargarClave', waitMsg: perfil.etiquetas.msgLoad});

            ////---------- Formulario de Traza ----------////
            this.Traza = new Ext.FormPanel({
                title: 'Trazas',
                labelAlign: 'top',
                layout: 'column',
                defaults: {
                    style: {
                        padding: '7px',
                        margin: '7px',
                    },
                    layout: 'form',
                    height: 150
                },
                frame: true,
                reader: new Ext.data.JsonReader({
                        root: 'datos'
                    }, [
                        {name: 'background', mapping: 'background'}
                    ]
                ),
                bodyStyle: 'padding:5px 5px 5px 5px',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Tipo',
                        columnWidth: .25,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'checkbox',
                                boxLabel: perfil.etiquetas.lbFueraProceso,
                                hideLabel: true,
                                id: 'background',
                                name: 'numerica'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Información',
                        columnWidth: .75,
                        html: perfil.etiquetas.htmlTraza
                    }
                ],
                buttons: [_this.guardarTraza],
                buttonAlign: 'right'
            });

            this.Traza.load({url: 'cargarEntornoTraza', waitMsg: perfil.etiquetas.msgLoad});

            ////---------- Formulario de Bloqueo ----------////
            this.Bloqueo = new Ext.FormPanel({
                title: 'Bloqueo de usuarios y direcciones',
                frame: true,
                layout: 'column',
                defaults: {
                    style: {
                        padding: '7px',
                    },
                    height: 270
                },
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'active', mapping: 'active'},
                    {name: 'minutes', mapping: 'minutes'},
                    {name: 'userActive', mapping: 'userActive'},
                    {name: 'userAttempts', mapping: 'userAttempts'},
                    {name: 'ipActive', mapping: 'ipActive'},
                    {name: 'ipAttempts', mapping: 'ipAttempts'}
                ]),
                bodyStyle: 'padding:5px 5px 5px 5px',
                items: [
                    {
                        columnWidth: .25,
                        border: false,
                        defaults: {width : '91.8%'},
                        items: [
                            {
                            xtype: 'fieldset',
                            title: 'Bloqueos',
                            autoHeight: true,
                            items: [
                                {
                                    xtype: 'checkbox',
                                    boxLabel: perfil.etiquetas.lbUsuario,
                                    hideLabel: true,
                                    id: 'userActive',
                                    name: 'userActive',
                                    listeners: {
                                        check: function (component) {
                                            if (component.checked == true) {
                                                Ext.getCmp("userAttempts").enable();
                                            }
                                            if (component.checked == false) {
                                                Ext.getCmp("userAttempts").disable();
                                                if (Ext.getCmp("ipActive").checked == false) {
                                                    mostrarMensaje(3, perfil.etiquetas.msgWarning, function (btnPresionado) {
                                                        if (btnPresionado == 'ok') {
                                                            Ext.getCmp("userActive").setValue('1')
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: perfil.etiquetas.lbNumIntentos,
                                    disabled: true,
                                    width: 139,
                                    id: 'userAttempts',
                                    name: 'userAttempts',
                                    allowBlank: false,
                                    blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                    maxValue: 5,
                                    minValue: 1,
                                },
                                {
                                    xtype: 'checkbox',
                                    boxLabel: perfil.etiquetas.lbIP,
                                    hideLabel: true,
                                    id: 'ipActive',
                                    name: 'ipActive',
                                    listeners: {
                                        check: function (component) {
                                            if (component.checked == true) {
                                                Ext.getCmp("ipAttempts").enable();
                                            }
                                            if (component.checked == false) {
                                                Ext.getCmp("ipAttempts").disable();
                                                if (Ext.getCmp("userActive").checked == false) {
                                                    mostrarMensaje(3, perfil.etiquetas.msgWarning, function (btnPresionado) {
                                                        if (btnPresionado == 'ok') {
                                                            Ext.getCmp("ipActive").setValue('1')
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: perfil.etiquetas.lbNumIntentos,
                                    disabled: true,
                                    width: 139,
                                    id: 'ipAttempts',
                                    name: 'ipAttempts',
                                    allowBlank: false,
                                    blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                    maxValue: 5,
                                    minValue: 1,
                                }
                            ]
                        },
                            {
                                xtype: 'fieldset',
                                checkboxToggle: true,
                                id: 'activeCache',
                                checkboxName: 'active',
                                title: perfil.etiquetas.lbTemporal,
                                autoHeight: true,
                                collapsed: true,
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: perfil.etiquetas.lbTiempoEnMin,
                                        id: 'minutes',
                                        name: 'minutes',
                                        width: 139,
                                        blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                        maxValue: 60,
                                        minValue: 10,
                                    }
                                ],
                                listeners: {
                                    collapse: function () {
                                        Ext.getCmp("minutes").setValue("");
                                        Ext.getCmp("minutes").allowBlank = true
                                    },
                                    expand: function () {
                                        Ext.getCmp("minutes").allowBlank = false
                                    }
                                }
                            }


                        ]
                    },
                    {
                        columnWidth: .75,
                        border: false,
                        items: [{
                            xtype: 'fieldset',
                            title: 'Información',
                            height: 196,
                            html: perfil.etiquetas.htmlBloqueo

                        }]
                    }
                ],
                buttons: [_this.guardarBloqueo],
                buttonAlign: 'right'
            });

            this.Bloqueo.load({
                url: 'cargarConfiguracionBloqueo',
                waitMsg: perfil.etiquetas.msgLoad,
                success: function (form, action) {
                    if (form.findField('minutes').getValue())
                        Ext.getCmp('activeCache').expand();
                }
            });

            ////---------- Formulario de Entidad ----------////
            this.entidad = new Ext.FormPanel({
                title: 'Entidad accedida',
                layout: 'column',
                defaults: {
                    style: {
                        padding: '7px',
                        margin: '7px',
                    },
                    height: 100
                },
                frame: true,
                bodyStyle: 'padding:5px 5px 5px 5px',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Visibilidad',
                        columnWidth: .25,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'checkbox',
                                boxLabel: 'Mostrar entidad accedida',
                                hideLabel: true,
                                id: 'entidad',
                                name: 'numerica',
                                listeners: {
                                    render: function () {
                                        Ext.Ajax.request({
                                            url: 'cargarEntidad',
                                            callback: function (options, success, response) {
                                                var text = response.responseText;
                                                var msg = Ext.util.JSON.decode(text);
                                                if (msg.datos[0].mostrarentidad) {
                                                    window.parent.document.getElementById('entidadAccedida').style.display = "block";
                                                    Ext.getCmp('entidad').setValue(true);
                                                }
                                                else {
                                                    window.parent.document.getElementById('entidadAccedida').style.display = "none";
                                                    Ext.getCmp('entidad').setValue(false);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Información',
                        columnWidth: .75,
                        layout: 'form',
                        html: perfil.etiquetas.htmlEntidad
                    }
                ],
                buttons: [_this.guardarEntidad],
                buttonAlign: 'right'
            });

            ////---------- Bases de Datos ----------////
            this.baseDatos = new Ext.Panel({
                title: 'Bases de datos',
                border: false,
                tbar: [
                    {
                        id: 'btnExpServ',
                        //disabled: true,
                        tooltip: perfil.etiquetas.textToolTipExportar,
                        iconCls: 'exportar',
                        text: perfil.etiquetas.lbBtnExportar,
                        /*hotKey: {
                            idGrupo: 'Servidores',
                            config: {
                                key: Ext.EventObject.DELETE,
                                stopEvent: true
                            }
                        },*/
                        handler: function () {
                            _this.getEl().mask('Exportando base de datos. Esto puede demorar unos minutos...');
                            Ext.Ajax.request({
                                url: 'exportarBaseDatosMT',
                                method: 'POST',
                                callback: function (options, success, response) {
                                    //Secodena.ocultarMascara('maskservidorDel');
                                    var responseData = Ext.decode(response.responseText);

                                    if (responseData.msgCod == 1) {
                                        mostrarMensaje(7, perfil.etiquetas.msgInfExportarBD);
                                        window.location = 'export?filename='+responseData.filename;
                                    } else if (responseData.msgCod == 0) {
                                        switch (responseData.msgId) {
                                            //Importar operaciones configuradas
                                            case 'ExcSaberPrivilegiosRol':
                                                mostrarMensaje(6, perfil.etiquetas.ExcSaberPrivilegiosRol);
                                                break;
                                            case 'ExcNoPrivilegios':
                                                mostrarMensaje(6, perfil.etiquetas.ExcNoPrivilegios);
                                                break;
                                            case 'ExcGenerarBackup':
                                                mostrarMensaje(6, perfil.etiquetas.ExcGenerarBackup);
                                                break;
                                            case 'ExcComprimirFichero':
                                                mostrarMensaje(6, perfil.etiquetas.ExcComprimirFichero);
                                                break;
                                            default:
                                                mostrarMensaje(6, perfil.etiquetas.ExcExportarBD);
                                                break;
                                        }
                                    }
                                    _this.getEl().unmask();
                                }
                            });
                        }
                    },
                    {
                        id: 'btnImpServ',
                        tooltip: perfil.etiquetas.textToolTipImportar,
                        iconCls: 'importar',
                        text: perfil.etiquetas.lbBtnImportar,
                        handler: function () {
                            winImportarBD.show();
                        }
                    }
                ],
                frame: true,
            });

            var winImportarBD = new Ext.Window({
                id: 'idWinImpBackup',
                modal: true,
                closeAction: 'hide',
                layout: 'card',
                activeItem: 0,
                title: perfil.etiquetas.titleWinImportarBD,
                padding: 10,
                width: 370,
                height: 140,
                bodyStyle: {
                    padding: '5 5 5 5'
                },
                buttons: [
                    {
                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                        iconCls: 'cancelar',
                        text: perfil.etiquetas.lbBtnCancelar,
                        handler: function () {
                            Ext.getCmp('idfileUploadBackup').reset();
                            winImportarBD.hide();
                        }
                    }, {
                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                        iconCls: 'aceptar',
                        text: perfil.etiquetas.lbBtnAceptar,
                        handler: function () {
                            importarBD();
                        }
                    }
                ],
                items: [
                    {
                        xtype: 'fieldset',
                        title: perfil.etiquetas.titleFSImportarBD,
                        items: [
                            {
                                xtype: 'fileuploadfield',
                                buttonText: perfil.etiquetas.lbBtnBuscar,
                                name: 'fileUploadBackup',
                                id: 'idfileUploadBackup',
                                allowBlank: false,
                                hideLabel: true,
                                anchor: '100%'
                            }
                        ]

                    }
                ]
            });

            //Formulario gestionar Cein client
/*            this.configceinclient = new Ext.FormPanel({
                id: 'formConfigCein',
                title: 'Centralizador de incidencias',
                defaults: {
                    style: {
                        padding: '7px',
                    },
                    height: 200,
                    border: false
                },
                bodyStyle: 'padding:5px 5px 5px 5px',
                frame: true,
                layout: 'column',
                border: false,
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'ipCein', mapping: 'ipCein'},
                    {name: 'port', mapping: 'port'},
                    {name: 'radio', mapping: 'radio'}
                ]),
                items: [
                    {
                        columnWidth: .25,
                        defaults: {width : '91.8%'},
                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Datos centralizador',
                                layout: 'form',
                                defaults: {width: '90%'},
                                autoHeight: true,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Direcci&oacute;n',
                                        id: 'ipCein',
                                        name: 'ipCein',
                                        allowBlank: false,
                                        regex: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/,
                                        blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'port',
                                        fieldLabel: 'Puerto',
                                        maxValue: 65536,
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                title: 'Protocolo',
                                autoHeight: true,
                                layout: 'column',
                                items: [{
                                    xtype: 'radio',
                                    checked: true,
                                    name: 'radio',
                                    boxLabel: 'http',
                                    inputValue: 'http',
                                    columnWidth: .5
                                },
                                    {
                                        xtype: 'radio',
                                        name: 'radio',
                                        boxLabel: 'https',
                                        inputValue: 'https',
                                        columnWidth: .5
                                    }]
                            },
                        ]
                    },
                    {
                        columnWidth: .75,
                        items: [
                            {
                                xtype: 'fieldset',
                                height: 140,
                                title: 'Información',
                                html: perfil.etiquetas.htmlconfigurarCeinClient
                            }]
                    }
                ],
                buttons: [_this.configurarCeinClient],
                buttonAlign: 'right'
            });*/
            /*this.spantpl = new Ext.Template(
                '<tpl>'+
                '<span class="icondistra-{icono} {color}"/>'+
                '</tpl>'
            );

            this.servicesMonitor = new Ext.FormPanel({
                id: 'serviceMonitor',
                title: 'Monitor de servicios Soap',
                layout: 'form',
                defaults: {
                    style: {
                        padding: '7px',
                    },
                    height: 200,
                    border: false
                },
                bodyStyle: 'padding:5px 5px 5px 5px',
                border: false,
                frame: true,
                items: [
                    {
                        xtype: 'fieldset',
                        layout: 'column',
                        border: true,
                        autoHeight: true,
                        title: 'Centralizador de incidencias',
                        items: [
                            {
                                columnWidth: .1,
                                xtype: 'textfield',
                                value: 'CeinSoapService',
                                id: 'CeinSoapService',
                                readOnly: true,
                                hideLabel: true,
                                style: 'padding-left:5px;'
                            },
                            {
                                columnWidth: .035,
                                id: 'divContainer',
                                html: '',
                                style: 'padding: 3px;padding-left:4px;',
                                listeners: {
                                    beforerender: function(t) {
                                        Ext.Ajax.request({
                                            url: 'testSoapService',
                                            success: function(resp) {
                                                var response = JSON.parse(resp.responseText);
                                                if(response.success) {
                                                    if(typeof t.items != 'undefined') {
                                                        t.remove('spancerrar', true);
                                                    }
                                                    t.add({
                                                        id: 'spanok',
                                                        html: _this.spantpl.apply({icono: 'ok', color: 'verde'})
                                                    });
                                                    Ext.getCmp('configurarCein').disable();
                                                } else {
                                                    if(typeof t.items != 'undefined') {
                                                        t.remove('spanok', true);
                                                    }
                                                    t.add({
                                                        id: 'spancerrar',
                                                        html: _this.spantpl.apply({icono: 'cerrar', color: 'rojo'})
                                                    });
                                                    Ext.getCmp('configurarCein').enable();
                                                }
                                                t.doLayout();
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                columnWidth: .1,
                                id: 'buttonContainer',
                                listeners: {
                                    beforerender: function(t) {
                                        Ext.Ajax.request({
                                            url: 'tieneModuloCein',
                                            success: function(resp) {
                                                var response = JSON.parse(resp.responseText);
                                                if(response.success) {
                                                    Ext.getCmp('configurarCein').show();
                                                } else {
                                                    Ext.getCmp('configurarCein').hide();
                                                }
                                            }
                                        });
                                    }
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'configurar',
                                        id: 'configurarCein',
                                        disabled: true,
                                        tooltip: 'Configurar ',
                                        style: 'margin-left:5px;',
                                        listeners: {
                                            click: function() {
                                                Ext.Ajax.request({
                                                    url: 'configurarCeinWsdl',
                                                    success: function(resp) {
                                                        if(resp.responseText == "") {
                                                            Ext.getCmp('divContainer').fireEvent('beforerender', Ext.getCmp('divContainer'));
                                                            mostrarMensaje(7, 'Servicio configurado correctamente.');
                                                        } else {
                                                            mostrarMensaje(6, 'No se puede configurar el servicio debido a permisos de escritura.');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]

            });*/

            this.items = [
                _this.ModoInicio, _this.Clave, _this.Traza, _this.Bloqueo,
                _this.entidad, _this.baseDatos/*_this.configceinclient, _this.servicesMonitor*/
            ];
            //this.configceinclient.load({url: 'configurar', waitMsg: perfil.etiquetas.msgLoad});
            this.border = false;
            Configuracion.ConfGeneral.superclass.initComponent.call(this);

            ////---------- Funciones ----------////
            function modificarClave() {
                if (_this.Clave.getForm().isValid()) {
                    _this.Clave.getForm().submit({
                        url: 'modificarclave',
                        params: {
                            idrestricclaveacceso: _this.Clave.getForm().reader.jsonData.datos[0].idrestricclaveacceso
                        },
                        waitMsg: perfil.etiquetas.lbMsgModificarClave,
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskClaveMod');
                            if (action.result.codMsg == 2) {
                                mostrarMensaje(2, action.result.mensaje, function (btnPresionado) {
                                    if (btnPresionado == 'ok') {
                                        _this.Clave.getForm().submit({
                                            url: 'modificarclave',
                                            waitMsg: perfil.etiquetas.lbMsgModificarClave,
                                            params: {
                                                confirmar: true,
                                                idrestricclaveacceso: _this.Clave.getForm().reader.jsonData.datos[0].idrestricclaveacceso
                                            },
                                            failure: function (form, action) {
                                                Secodena.ocultarMascara('maskClaveMod');
                                                if (action.result.codMsg == 1) {
                                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                                }
                                                if (action.result.codMsg == 3)
                                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                            }
                                        });
                                    }
                                });
                            }
                            if (action.result.codMsg == 1) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                            if (action.result.codMsg == 3)
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);

                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function modificarTraza() {
                if (_this.Traza.getForm().isValid()) {
                    _this.Traza.getForm().submit({
                        url: 'actualizarEntornoTraza',
                        timeout: 12,
                        params: {
                            background: _this.Traza.getForm().reader.jsonData.datos[0].background
                        },
                        waitMsg: perfil.etiquetas.lbMsgModificarTraza,
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskClaveMod');
                            if (typeof(action.failureType) == 'undefined') {
                                if (action.result.codMsg == 2) {
                                    mostrarMensaje(2, action.result.mensaje, function (btnPresionado) {
                                        if (btnPresionado == 'ok') {
                                            Traza.getForm().submit({
                                                url: 'actualizarEntornoTraza',
                                                waitMsg: perfil.etiquetas.lbMsgModificarTraza,
                                                params: {
                                                    confirmar: true
                                                },
                                                failure: function (form, action) {
                                                    Secodena.ocultarMascara('maskClaveMod');
                                                    if (action.result.codMsg)
                                                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                                    else
                                                        mostrarMensaje(3, 'Ocurrió un error interno del sistema. Por favor contacte al administrador.');
                                                }
                                            });
                                        }
                                    });
                                }
                                if (action.result.codMsg)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                else
                                    mostrarMensaje(3, 'El sistema no está configurado para generar las trazas fuera de proceso. Por favor contacte al administrador.');
                            } else {
                                switch (action.failureType) {
                                    case 'connect':
                                        Zeolides.Utils.MessageBox.show(3, 'El sistema no está configurado para generar las trazas fuera de proceso. Por favor contacte al administrador.');
                                        break;
                                    default:
                                        Zeolides.Utils.MessageBox.show(3, 'Ocurrió un error interno del sistema. Por favor contacte al administrador.');
                                }
                            }


                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function modificarBloqueo() {
                if (_this.Bloqueo.getForm().isValid()) {
                    _this.Bloqueo.getForm().submit({
                        url: 'actualizarBloqueo',
                        waitMsg: perfil.etiquetas.lbMsgModificarBloqueo,
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskClaveMod');
                            if (action.result.codMsg == 2) {
                                mostrarMensaje(2, action.result.mensaje, function (btnPresionado) {
                                    if (btnPresionado == 'ok') {
                                        _this.Bloqueo.getForm().submit({
                                            url: 'actualizarBloqueo',
                                            waitMsg: perfil.etiquetas.lbMsgModificarBloqueo,
                                            params: {
                                                confirmar: true
                                            },
                                            failure: function (form, action) {
                                                Secodena.ocultarMascara('maskClaveMod');
                                                if (action.result.codMsg == 1) {
                                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                                }
                                                if (action.result.codMsg == 3)
                                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                            }
                                        });
                                    }
                                });
                            }
                            if (action.result.codMsg == 1) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                            if (action.result.codMsg == 3)
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function modificarEntidad() {
                var estado;
                if (!Ext.getCmp('entidad').checked) {
                    window.parent.document.getElementById('entidadAccedida').style.display = "none";
                    estado = false;
                }
                else {
                    window.parent.document.getElementById('entidadAccedida').style.display = "block";
                    estado = true;
                }

                Ext.Ajax.request({
                    url: 'cambiarestadoEntidad',
                    params: {
                        estado: estado
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        console.log(responseData);
                        mostrarMensaje(1, responseData.Msg);
                    }
                })


            }

            function GuardarModoInicio() {
                var estado = null;
                if (Ext.getCmp("emergente").getValue() == true) {
                    estado = 1;
                }
                else if (Ext.getCmp("navegador").getValue() == true) {
                    estado = 2;
                }
                if (estado != null) {
                    Ext.Ajax.request({
                        url: 'actualizarModoInicio',
                        params: {
                            value: estado
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            console.log(responseData);
                            mostrarMensaje(1, 'El modo de inicio ha sido modificado satisfactoriamente.');
                        }
                    })
                }


            }

            function configurarCeinClient() {
                var form = Ext.getCmp('formConfigCein').getForm();
                if (form.isValid()) {
                    form.submit({
                        url: 'configurarceinclient',
                        success: function (form, action) {
                            mostrarMensaje(7, action.result.message);
                        },
                        failure: function (form, action) {
                            mostrarMensaje(6, action.result.message);
                        }
                    });
                }
            }


            function importarBD() {
                var fileUp = Ext.getCmp('idfileUploadBackup');
                importarFicherosGrandes(winImportarBD, fileUp);
            }

            function importarFicherosGrandes(ventana, fieldload) {
                if (typeof fieldload.fileInput.dom.files[0] != 'undefined') {

                    var fichero = fieldload.fileInput.dom.files[0];

                    var total_archivo = fichero.size;
                    var start = 0;
                    var totalPaquete = 2048000; //2 mb
                    var totalTrozos = Math.ceil(total_archivo / totalPaquete);
                    var end = totalPaquete;
                    var idunico = (new Date()).getTime();
                    var i = 0;
                    var seguir = true;

                    ventana.getEl().mask('Subiendo archivo 0%');
                    while (start < total_archivo && seguir) {
                        i++;
                        //var trozo = fichero.slice(start, end);  //revisar función en safari
                        var method_slice = 'slice';
                        if ('mozSlice' in fichero) {
                            method_slice = 'mozSlice';
                        }
                        if ('webkitSlice' in fichero) {
                            method_slice = 'webkitSlice';
                        }
                        var trozo = fichero[method_slice](start, end);  //revisar función en safari
                        var nombreCorte = idunico + "_" + i;
                        subirFichero(trozo, nombreCorte, fichero.name);
                        start = end;
                        end = start + totalPaquete;
                    }

                    function subirFichero(trozo, nombreTrozo, nombreOriginal) {
                        var xhr = new XMLHttpRequest();
                        var formulario = new FormData();
                        formulario.append("archivo", trozo); //trozo fichero
                        formulario.append("nombreTrozo", nombreTrozo); //parametro adicional
                        formulario.append("nombreOriginal", nombreOriginal); //parametro adicional
                        formulario.append("accion", 'subirfichero'); //parametro adicional
                        var url = 'importarBaseDatosMT';
                        xhr.open("POST", url, false);    //FALSE, para sincronizar hago una petición síncrona para facilitar la recepción
                        xhr.send(formulario);
                        var obj = Ext.decode(xhr.responseText);
                        if (obj.msgCod == 1) {
                            var porciento = i * 100 / totalTrozos;
                            ventana.getEl().unmask();
                            ventana.getEl().mask('Subiendo archivo ' + Math.floor(porciento) + '%');
                            if (obj.numeroTrozo == totalTrozos) {
                                descomprimir(obj);
                            }
                        } else {
                            seguir = false;
                            cbError(obj);
                        }
                    }

                    function descomprimir(res) {
                        ventana.getEl().unmask();
                        ventana.getEl().mask('Descomprimiendo fichero...');
                        var url = 'importarBaseDatosMT';
                        Ext.Ajax.request({
                            url: url,
                            timeout: 3600000,
                            params: {
                                accion: 'descomprimir',
                                nombreOriginal: fichero.name
                            },
                            callback: function (opts, succes, response) {
                                //console.log('Fichero descomprimido.');
                                var respuesta = Ext.decode(response.responseText);
                                if (respuesta.msgCod == 1) {
                                    ventana.getEl().unmask();
                                    importarDatos(respuesta);
                                } else {
                                    ventana.getEl().unmask();
                                    ventana.hide();
                                    Ext.getCmp('idfileUploadBackup').reset();
                                }

                            }
                        });
                    }

                    function importarDatos(obj) {
                        ventana.getEl().unmask();
                        ventana.getEl().mask('Importando base de datos. Esto puede demorar unos minutos...');
                        var url = 'importarBaseDatosMT';
                        Ext.Ajax.request({
                            url: url,
                            timeout: 3600000,
                            params: {
                                accion: 'importar',
                                nombreOriginal: fichero.name
                            },
                            callback: function (opts, succes, response) {
                                if (response.timedout) {
                                    mostrarMensaje(6, perfil.etiquetas.MsgErrorTiempoExpiracion);
                                    ventana.getEl().unmask();
                                    ventana.hide();
                                    return;
                                }
                                var respuesta = Ext.decode(response.responseText);
                                if (respuesta.msgCod == 1) {
                                    cb();
                                } else {
                                    cbError(respuesta);
                                }
                                Ext.getCmp('idfileUploadBackup').reset();
                            }
                        });
                    }

                    function cb() {
                        ventana.getEl().unmask();
                        ventana.hide();
                        mostrarMensaje(7, perfil.etiquetas.msgInfImportarBD);
                    }

                    function cbError() {
                        ventana.getEl().unmask();
                        ventana.hide();
                    }
                }
            }

        }
    }
);
