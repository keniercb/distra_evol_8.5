UCID.portal.cargarEtiquetas('configuracion', cargarInterfaz);
Ext.ns('Configuracion');

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar Variables ------------////
var winIns, winMod, idfuncionalidad, ConfGeneral, referencia, vpGestSistema;
var arbolAcc, Dominio, Server, Languages, Temas, Escritorio, Expresiones, Captcha, extension, ceincont, fileIntegrity;

function cargarInterfaz(perfil, etiquetas) {
    var _this = this;

    UCID.portal.cargarAcciones(window.frameElement.id);
    this.btnAyuda = new Ext.Button({
        id: 'btnAyuConf', // icon:dirpropia+'abrir.png',//perfil.dirImg+'adicionar.png',
        iconCls: 'ayuda',
        text: '<b>Ayuda</b>',
        disabled: false,
        hotKey: {
            idGrupo: 'tabPanel',

            config: {
                key: 104,
                alt: true
            }
        },
        toolTip: etiquetas.textToolTipHelp,
        icon: perfil.dirImg + 'ayuda.png',
        menu:
            new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function() {
                            cargarAyuda();
                        }, text: 'Ayuda',
                        id: 'btnAyuRel',
                        icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'btn',
                        tooltip:'Ayuda del sistema'
                    },
                    {
                        text: 'Acerca de',
                        id: 'acercade',
                        icon: perfil.dirImg  + 'info.png',
                        iconCls: 'btn',
                        tooltip:"Acerca de <b>(Alt+...s)</b>",
                        handler: function() {

                            var uri = "seguridad";
                            acercaDe.show(uri);
                        }}
                ]
            })

    });
    /**this.btnAyuda = new Ext.Button({
        id: 'btnAyuConf',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.textToolTipHelp,
        hotKey: {
            idGrupo: 'tabPanel',
            config: {
                key: 104,
                alt: true
            }
        },
        handler: function () {
            cargarAyuda();
        }
    });*/

    arbolAcc = new Ext.tree.TreePanel({
        title: 'Opciones',
        frame: false,
        height: '100%',
        collapsible: true,
        autoScroll: true,
        region: 'west',
        width: '15%',
        rootVisible : false,
        useArrows : true,
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarArbol',
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    atreeloader.baseParams = {};
                    if (anode.attributes.idsistema)
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema;
                }
            }
        }),
        listeners: {
            'click': function (node) {
                if (node.attributes.text == "Configuración") {
                    _this.tabPanel.setActiveTab(_this.tabPanel.items.items[0]);
                    _this.tabPanel.doLayout();
                }
                if (node.attributes.text == "Dominios") {
                    if (Dominio) {
                        _this.tabPanel.setActiveTab(Dominio.id)
                    } else {
                        Dominio = new Configuracion.Dominio({
                            title: 'Dominios',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    Dominio = false
                                },
                                'activate': function () {
                                    arbolAcc.selectPath('/0/gest_nomdominio');
                                    this.btnAdicionar.focus();
                                    this.habilitarKeyMap();
                                }
                            }
                        });
                        _this.tabPanel.add(Dominio);
                        _this.tabPanel.setActiveTab(Dominio.id);
                        _this.tabPanel.doLayout()
                    }
                }
                if (node.attributes.text == "Servidores") {
                    if (Server) {
                        _this.tabPanel.setActiveTab(Server.id);
                    } else {
                        Server = new Configuracion.Servidores({
                            title: 'Servidores',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    Server = false
                                },
                                'activate': function () {
                                    arbolAcc.selectPath('/0/gest_servidor');
                                    this.btnAdicionar.focus();
                                    this.habilitarKeyMap();
                                }
                            }
                        });
                        _this.tabPanel.add(Server);
                        _this.tabPanel.setActiveTab(Server.id);
                        _this.tabPanel.doLayout()
                    }
                }
                if (node.attributes.text == "Idiomas") {
                    if (Languages) {
                        _this.tabPanel.setActiveTab(Languages.id);
                    } else {
                        Languages = new Configuracion.Idiomas({
                            title: 'Idiomas',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    Languages = false
                                },
                                'activate': function () {
                                    arbolAcc.selectPath('/0/nom_idioma');
                                    this.btnAdicionar.focus();
                                    this.habilitarKeyMap();
                                }
                            }
                        });
                        _this.tabPanel.add(Languages);
                        _this.tabPanel.setActiveTab(Languages.id);
                        _this.tabPanel.doLayout()
                    }
                }
                if (node.attributes.text == "Temas") {
                    if (Temas) {
                        _this.tabPanel.setActiveTab(Temas.id);
                    } else {
                        Temas = new Configuracion.Temas({
                            title: 'Temas',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    Temas = false
                                },
                                'activate': function () {
                                    arbolAcc.selectPath('/0/nom_tema');
                                    this.btnAdicionar.focus();
                                    this.habilitarKeyMap();
                                }
                            }
                        });
                        _this.tabPanel.add(Temas);
                        _this.tabPanel.setActiveTab(Temas.id);
                        _this.tabPanel.doLayout()
                    }
                }
                if (node.attributes.text == "Escritorios") {
                    if (Escritorio) {
                        _this.tabPanel.setActiveTab(Escritorio.id);
                    } else {
                        Escritorio = new Configuracion.Escritorio({
                            title: 'Escritorios',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    Escritorio = false
                                },
                                'activate': function () {
                                    arbolAcc.selectPath('/0/nom_desktop');
                                    this.btnAdicionar.focus();
                                    this.habilitarKeyMap();
                                }
                            }
                        });
                        _this.tabPanel.add(Escritorio);
                        _this.tabPanel.setActiveTab(Escritorio.id);
                        _this.tabPanel.doLayout()
                    }
                }
                if (node.attributes.text == "Expresiones regulares") {
                    if (Expresiones) {
                        _this.tabPanel.setActiveTab(Expresiones.id);
                    } else {
                        Expresiones = new Configuracion.Expresiones({
                            title: 'Expresiones regulares',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    Expresiones = false
                                },
                                'activate': function () {
                                    arbolAcc.selectPath('/0/nom_expresiones');
                                    this.btnAdicionar.focus();
                                    this.habilitarKeyMap();
                                }
                            }
                        });
                        _this.tabPanel.add(Expresiones);
                        _this.tabPanel.setActiveTab(Expresiones.id);
                        _this.tabPanel.doLayout()
                    }
                }
                if (node.attributes.text == "Configuración del captcha") {
                    if (Captcha) {
                        _this.tabPanel.setActiveTab(Captcha.id);
                    } else {
                        Captcha = new Configuracion.Captcha({
                            title: 'Captcha',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    Captcha = false
                                }
                            }
                        });
                        _this.tabPanel.add(Captcha);
                        _this.tabPanel.setActiveTab(Captcha.id);
                        _this.tabPanel.doLayout();
                    }
                }
                if (node.attributes.text == "Integridad de ficheros") {
                    if (fileIntegrity) {
                        _this.tabPanel.setActiveTab(fileIntegrity.id);
                    } else {
                        fileIntegrity = new Configuracion.fileIntegrity({
                            listeners: {
                                'destroy': function () {
                                    fileIntegrity = false
                                },
                                'activate': function () {
                                    arbolAcc.selectPath('/0/nom_idioma');
                                    // this.btnAdicionar.focus();
                                    this.habilitarKeyMap();
                                }
                            }
                        });
                        _this.tabPanel.add(fileIntegrity);
                        _this.tabPanel.setActiveTab(fileIntegrity.id);
                        _this.tabPanel.doLayout()
                    }
                }

                /*if (node.attributes.text == "Compilar extension") {

                    if (extension) {
                        extension.show();
                    } else {
                        extension = cargarCompilarExtension();
                        extension.show();
                    }
                }*/

                if(node.attributes.text == "Centralizador de incidencias") {
                    if (ceincont) {
                        _this.tabPanel.add(ceincont);
                        ceincont.show();
                        Ext.getCmp('divContainer').fireEvent('beforerender', Ext.getCmp('divContainer'));
                        _this.tabPanel.setActiveTab(ceincont.id);
                    } else {
                        ceincont = new Configuracion.cein({
                            title: 'Centralizador de incidencias',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    cein = false
                                }
                            }
                        });
                        _this.tabPanel.add(ceincont);
                        _this.tabPanel.setActiveTab(ceincont.id);
                        _this.tabPanel.doLayout();
                    }
                }

            }
        }
    });

    ////------------ Crear nodo padre del árbol ------------////
    this.padreArbolAcc = new Ext.tree.AsyncTreeNode({
        text: 'Opciones',
        expandable: false,
        expanded: true,
        id: '0'
    });

    arbolAcc.setRootNode(_this.padreArbolAcc);

    this.tabPanel = new Ext.TabPanel({
        id: 'tabPanel',
        activeTab: 0,
        region: 'center',
        keyMapGroup: true,
        items: {
            title: 'Configuraci&oacute;n',
            layout: 'fit',
            listeners: {
                'afterlayout': function () {
                    setTimeout(function () {
                        _this.btnAyuda.focus()
                    })
                },
                'activate': function () {
                    arbolAcc.selectPath('/0/config_general')
                }
            },
            items: new Configuracion.ConfGeneral({
                etiquetas: perfil.etiquetas,
            })
        }
    });

    ////------------ Panel ------------////
    this.panel = new Ext.Panel({
        layout: 'border',
        items: [arbolAcc, _this.tabPanel],
        border: false
    });

    ////------------ ViewPort ------------////
    vpGestSistema = new Ext.Viewport({
        layout: 'fit',
        items: _this.panel
    });

    function cargarAyuda() {
        help.show('Ayuda del subsistema de configuración', 'seguridad/configeneral');
    }
}Ext.ns("Configuracion");

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
                _this.entidad, /*_this.configceinclient, _this.servicesMonitor*/
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
        }
    }
);
/**
 * Created by root on 12/06/17.
 */
Ext.ns("cein");

var moduloCein;

Ext.Ajax.request({
    url: 'tieneModuloCein',
    callback: function (option, success, resp) {
        var response = JSON.parse(resp.responseText);
        if (response.success) {
            moduloCein = true;
        }else{
            moduloCein = false;
        }
    }
});

Configuracion.cein = Ext.extend(Ext.Panel,
    {
        id: 'cein',
        layout: 'accordion',
        border: false,
        defaults: {border: false},
        //animate: true,
        //sequence: true,
        initComponent: function () {
            var _this = this,
                originalIpValue = '',
                originalPortValue = '';


            this.configurarCeinClient = new Ext.Button({
                id: 'configurarCeinClient',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                disabled: true,
                iconCls: 'guardar',
                text: 'Guardar',
                listeners: {
                    'render': function(btn) {
                        if (moduloCein){
                            btn.setVisible(false);
                        }

                    },
                    'click': configurarCeinClient,
                    'enable': function (me) {
                        var form = Ext.getCmp('formConfigCein').getForm();
                        if (!form.isValid()) {
                            me.setDisabled(true);
                        }
                    }
                }
            });
            this.spantpl = new Ext.Template(
                '<tpl>' +
                '<span class="icondistra-{icono} {color}"/>' +
                '</tpl>'
            );

            this.configceinclient = new Ext.FormPanel({
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
                validationStatus: false,
                frame: true,
                layout: 'column',
                border: false,
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'ipCein', mapping: 'ipCein'},
                    {name: 'port', mapping: 'port'}/*,
                    {name: 'radio', mapping: 'radio'}*/
                ]),
                items: [
                    {
                        columnWidth: .25,
                        defaults: {width: '91.8%'},
                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Datos centralizador',
                                id: 'idDatosCentralizador',
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
                                        enableKeyEvents: true,
                                        regex: /^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4})|((([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.))([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})$/,
                                        blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                        listeners: {
                                            'keyup': function () {
                                                originalIpValue = (originalIpValue == '') ?
                                                    Ext.getCmp('ipCein').value : originalIpValue;
                                                var newValue = Ext.get('ipCein').dom.value;
                                                Ext.getCmp('ipCein').value = newValue;
                                                if (newValue == '') {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                } else if (newValue != originalIpValue) {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(false);
                                                } else {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'puerto',
                                        name: 'port',
                                        fieldLabel: 'Puerto',
                                        enableKeyEvents: true,
                                        maxValue: 65536,
                                        listeners: {
                                            'keyup': function () {
                                                originalPortValue = (originalPortValue == '') ?
                                                    Ext.getCmp('puerto').value : originalPortValue;
                                                var newValue = Ext.get('puerto').dom.value;
                                                Ext.getCmp('puerto').value = newValue;
                                                if (newValue == '') {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                } else if (newValue != originalPortValue) {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(false);
                                                } else {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                layout: 'column',
                                border: true,
                                autoHeight: true,
                                title: 'Estado de los servicios SOAP',
                                items: [
                                    {
                                        columnWidth: .6,
                                        xtype: 'textfield',
                                        value: 'CeinSoapService',
                                        id: 'CeinSoapService',
                                        readOnly: true,
                                        hideLabel: true,
                                        style: 'padding-left:5px;'
                                    },
                                    {
                                        columnWidth: .2,
                                        id: 'divContainer',
                                        html: '',
                                        style: 'padding: 3px;padding-left:4px;',
                                        listeners: {
                                            beforerender: function (t) {
                                                Secodena.mostrarMascara('testSoapServiceMask', 'Verificando servicios SOAP...', 'Verificando servicios SOAP...');
                                                Ext.Ajax.request({
                                                    url: 'testSoapService',
                                                    success: function (resp) {
                                                        if (typeof t.items != 'undefined') {
                                                            t.remove('spancerrar', true);
                                                            t.remove('spanok', true);
                                                        }
                                                        var response = JSON.parse(resp.responseText);
                                                        if (response.success) {
                                                            if (typeof t.items != 'undefined') {
                                                                t.remove('spancerrar', true);
                                                            }
                                                            t.add({
                                                                id: 'spanok',
                                                                html: _this.spantpl.apply({icono: 'ok', color: 'verde'})
                                                            });
                                                            Ext.getCmp('configurarCein').disable();
                                                        } else {
                                                            mostrarMensaje(6, 'Los servicios SOAP no se encuentran disponibles.');
                                                            if (typeof t.items != 'undefined') {
                                                                t.remove('spanok', true);
                                                            }
                                                            t.add({
                                                                id: 'spancerrar',
                                                                html: _this.spantpl.apply({
                                                                    icono: 'cerrar',
                                                                    color: 'rojo'
                                                                })
                                                            });

                                                            if (moduloCein) {
                                                                Ext.getCmp('configurarCein').show();
                                                                Ext.getCmp('configurarCein').enable();
                                                            }

                                                        }
                                                        Secodena.ocultarMascara('testSoapServiceMask');
                                                        t.doLayout();
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        columnWidth: .2,
                                        id: 'buttonContainer',
                                        listeners: {
                                            beforerender: function (t) {
                                                if (moduloCein) {
                                                    Ext.getCmp('configurarCein').show();
                                                } else {
                                                    Ext.getCmp('configurarCein').hide();
                                                }
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
                                                    click: function () {
                                                        Ext.Ajax.request({
                                                            url: 'configurarCeinWsdl',
                                                            success: function (resp) {
                                                                if (resp.responseText == "") {
                                                                    //Ext.getCmp('tabPanel').setActiveTab('cein');
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
                            /*{
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
                            },*/
                        ]
                    },
                    {
                        columnWidth: .75,
                        items: [
                            {
                                xtype: 'fieldset',
                                id: 'idFieldsetInfo',
                                height: 151,
                                title: 'Información',
                                html: perfil.etiquetas.htmlconfigurarCeinClient
                            }]
                    }
                ],
                buttons: [_this.configurarCeinClient],
                buttonAlign: 'right',
                listeners: {
                    'render': function (t) {
                        if (moduloCein) {
                            Ext.getCmp('ipCein').setDisabled(true);
                            Ext.getCmp('puerto').disable();
                            Ext.getCmp('idDatosCentralizador').setVisible(false);
                            Ext.getCmp('idFieldsetInfo').setHeight(60);
                        } else {
                            Ext.getCmp('ipCein').enable();
                            Ext.getCmp('puerto').enable();
                        }
                    }
                }
            });

            this.items = [
                _this.configceinclient
            ];
            this.configceinclient.load({
                url: 'configurar',
                waitMsg: perfil.etiquetas.msgLoad,
                success: function (t) {
                    Ext.getCmp('formConfigCein').validationStatus = t.getValues();
                }
            });
            this.border = false;
            this.on('beforedestroy', function (t) {
                t.hide();
                return false;
            }, this);
            Configuracion.cein.superclass.initComponent.call(this);

            function configurarCeinClient(me) {
                var form = Ext.getCmp('formConfigCein').getForm();
                if (form.isValid()) {
                    form.submit({
                        url: 'configurarceinclient',
                        success: function (form, action) {
                            Ext.getCmp('divContainer').fireEvent('beforerender', Ext.getCmp('divContainer'));
                            originalIpValue = Ext.getCmp('ipCein').value;
                            originalPortValue = Ext.getCmp('puerto').value;
                            me.setDisabled(true);
                            mostrarMensaje(7, action.result.message);
                        },
                        failure: function (form, action) {
                            mostrarMensaje(6, action.result.message);
                        }
                    });
                }
            }
        }
    }
);Ext.ns("Configuracion");

//     Variables
var winIns, winMod, modificar = 0, arregloDeschequeados = [], arrayPadresEliminar = [], arrayTiene = [];
var regDominio, arbolEntidades, busqueda_filtro = false, padreArbolEntidades;
////------------ Area de Validaciones ------------////

Configuracion.Dominio = Ext.extend(Ext.Panel,
    {
        id: 'Dominio',
        layout: 'border',
        region: 'center',
        initComponent: function () {
            var _this = this;

            ////------------- Botones -------------////
            this.btnAdicionar = new Ext.Button({
                id: 'btnAgr',
                iconCls: 'adicionar',
                text: perfil.etiquetas.lbBtnAdicionar,
                tooltip: perfil.etiquetas.textToolTipadicionarM,
                prevTab: 'btnClearDominio',
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: 105,
                        alt: true
                    }
                },
                handler: function () {
                    winForm('Ins');
                }
            });

            this.btnModificar = new Ext.Button({
                id: 'btnMod',
                disabled: true,
                iconCls: 'modificar',
                text: perfil.etiquetas.lbBtnModificar,
                tooltip: perfil.etiquetas.textToolTipModificarM,
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: 109,
                        alt: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        winForm('Mod');
                }
            });

            this.btnEliminar = new Ext.Button({
                id: 'btnEli',
                disabled: true,
                iconCls: 'eliminar',
                text: perfil.etiquetas.lbBtnEliminar,
                tooltip: perfil.etiquetas.textToolTipEliminarM,
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        eliminardominio();
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyuDesktop',
                iconCls: 'ayuda',
                text: '<b>Ayuda</b>',
                nextTab: 'idDenDom',
                disabled: false,
                toolTip: perfil.etiquetas.textToolTipHelp,
                icon: perfil.dirImg + 'ayuda.png',
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                menu:
                    new Ext.menu.Menu({
                        id: 'mainMenu',
                        items: [
                            {
                                handler: function() {
                                    cargarAyuda();
                                }, text: 'Ayuda',
                                id: 'btnAyuDesktop',
                                icon: perfil.dirImg + 'ayuda.png',
                                iconCls: 'btn',
                                tooltip:'Ayuda del sistema'
                            },
                            {
                                text: 'Acerca de',
                                id: 'acercade',
                                icon: perfil.dirImg  + 'info.png',
                                iconCls: 'btn',
                                tooltip:"Acerca de <b>(Alt+...s)</b>",
                                handler: function() {

                                    var uri = "seguridad";
                                    acercaDe.show(uri);
                                }}
                        ]
                    })

            });
            /**this.btnAyuda = new Ext.Button({
                id: 'btnAyu',
                iconCls: 'ayuda',
                nextTab: 'idDenDom',
                text: perfil.etiquetas.lbBtnAyuda,
                tooltip: perfil.etiquetas.textToolTipHelp,
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                handler: function () {
                    cargarAyuda();
                }
            });*/

            ////------------- Store -------------////
            this.store = new Ext.data.Store({
                url: arbolAcc.root.childNodes[1].attributes.controller + 'cargardominios',
                listeners: {
                    load: function () {
                        if (_this.store.getCount() == 0) {
                            if (denDom.getValue())

                                /*Ext.Msg.show({
                                    title: perfil.etiquetas.msgInf,
                                    msg: perfil.etiquetas.msgInfDatosMostrar,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO
                                }); */
                                mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar);
                            else if (busqueda_filtro) {
                                Ext.Msg.show({
                                    title: perfil.etiquetas.msgInf,
                                    msg: perfil.etiquetas.msgInfDatos,
                                    buttons: Ext.Msg.OK,
                                    fn: focusADD,
                                    icon: Ext.MessageBox.INFO
                                });
                                busqueda_filtro = false;
                            }
                            _this.btnEliminar.disable();
                            _this.btnModificar.disable();
                        }
                    }
                },
                reader: new Ext.data.JsonReader({
                    totalProperty: "cant",
                    root: "datos",
                    id: "iddominio"
                }, [
                    {
                        name: 'iddominio'
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'descripcion'
                    },
                    {
                        name: 'seguridad'
                    }
                ])
            });

            ////------------- Establezco modo de selección de grid ----------////
            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });

            this.sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
                _this.btnEliminar.disable();
                _this.btnModificar.enable();
                if (!record.data.seguridad == 1)
                    _this.btnEliminar.enable();
            }, this);

            this.sm.on('rowselect', function () {
                _this.btnModificar.enable();
                _this.btnEliminar.enable()
            }, this);

            this.sm.on('rowdeselect', function (smodel) {
                if (smodel.hasSelection() == false) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable()
                }
            }, this);

            ////------------- Defino el grid de Dominios ------------////
            this.grid = new Ext.grid.GridPanel({
                title: perfil.etiquetas.titleGridDom,
                cls: 'x-toolbar',
                border: false,
                frame: false,
                region: 'center',
                autoExpandColumn: 'expandir',
                store: _this.store,
                sm: _this.sm,
                columns: [
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'iddominio'
                    },
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'seguridad'
                    },
                    {
                        header: perfil.etiquetas.lbDenominacion,
                        width: 400,
                        dataIndex: 'denominacion',
                        sortable: true
                    },
                    {
                        id: 'expandir',
                        header: perfil.etiquetas.lbDescripcion,
                        width: 300,
                        dataIndex: 'descripcion',
                        sortable: true
                    }
                ],
                loadMask: {
                    store: _this.store
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: 15,
                    id: 'ptbaux',
                    store: _this.store,
                    displayInfo: true,
                    displayMsg: perfil.etiquetas.lbMsgbbarI,
                    emptyMsg: perfil.etiquetas.lbMsgbbarII
                })
            });

            var denDom = new Ext.form.TextField({
                id: 'idDenDom',
                fieldLabel: perfil.etiquetas.lbNombre,
                anchor: "98%",
                width: 150,
                maxLength: 40,
                colWidth: .3,
	            vtype: 'vtalfanumericos',
                emptyText: perfil.etiquetas.emptytext
            });

            this.btnSearch = new Ext.Button({
                id: 'btnBuscarDominio',
                nextTab: 'btnClearDominio',
                prevTab: 'idDenDom',
                iconCls: 'buscar',
                text: perfil.etiquetas.lbBtnBuscar,
                tooltip: perfil.etiquetas.textToolTipSearchM,
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: 98,
                        alt: true
                    }
                },
                handler: function () {
                    buscarnombredominio(denDom.getValue());
                }
            });

            var btnClear = new Ext.Button({
                id: 'btnClearDominio',
                nextTab: 'btnAgr',
                prevTab: 'btnBuscarDominio',
                iconCls: 'limpiar',
                text: perfil.etiquetas.denomLimpiar,
                tooltip: perfil.etiquetas.cleanFilter,
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: 108,
                        alt: true
                    }
                },
                handler: function () {
                    clearFilters();
                }
            });

            this.filtro = new Ext.ToolBar.searchToolBar({
                elementos: [denDom],
                botones: [this.btnSearch, btnClear]
            });

            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });

            regDominio = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                region: 'west',
                width: 200,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbDenominacion,
                                        id: 'denominacion',
                                        maxLength: 40,
                                        allowBlank: false,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        vtype: 'vtalfanumericos',
                                        anchor: '100%'
                                    }
                                ]
                            },
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textarea',
                                        fieldLabel: perfil.etiquetas.lbDescripcion,
                                        id: 'descripcion',
                                        maxLength: 255,
                                        nextTab: 'btnCancelar',
                                        prevTab: 'denominacion',
                                        height: 200,
                                        anchor: '100%'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            ////------------ Arbol para cargar las estructuras del Dominio ------------////
            arbolEntidades = new Ext.tree.TreePanel({
                autoScroll: true,
                region: 'center',
                split: true,
                width: '37%',
                loader: new Ext.tree.TreeLoader({
                    dataUrl: arbolAcc.root.childNodes[1].attributes.controller + 'cargarestructuras',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {};
                            if (modificar > 0) {
                                atreeloader.baseParams.accion = 'modificar';
                                if (_this.sm.getSelected().data.seguridad)
                                    atreeloader.baseParams.idseguridad = _this.sm.getSelected().data.iddominio;
                                atreeloader.baseParams.iddominio = _this.sm.getSelected().data.iddominio;
                                if (anode.attributes.idestructuraop)
                                    atreeloader.baseParams.idarea = anode.attributes.idestructuraop;
                                if (anode.attributes.checked && anode.attributes.id != 0)
                                    atreeloader.baseParams.tcheck = 'marcado';
                                else if (!anode.attributes.checked && anode.attributes.id != 0)
                                    atreeloader.baseParams.tcheck = 'desmarcado';
                            } else {
                                atreeloader.baseParams.accion = 'insertar';
                                if (_this.store.getCount() > 0)
                                    atreeloader.baseParams.forma = 1;
                                if (anode.attributes.checked && anode.attributes.id != 0)
                                    atreeloader.baseParams.tcheck = 'marcado';
                                else if (!anode.attributes.checked && anode.attributes.id != 0)
                                    atreeloader.baseParams.tcheck = 'desmarcado';
                            }
                        },
                        'load': function (atreeloader, anode) {
                            hijosNodo = anode.childNodes;
                            if (hijosNodo.length) {
                                for (i = 0; i < hijosNodo.length; i++) {
                                    nodoHijo = hijosNodo[i];
                                    if (nodoHijo.attributes.checked)
                                        adicionarEnDeschequeados(arrayTiene, nodoHijo.attributes.id);
                                }
                            }
                            var id;
                            id = anode.attributes.id;
                            var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);
                            if (esta1 != -1) {
                                eliminarEnDeschequeados(arrayPadresEliminar, esta1);
                                if (arbolEntidades.getChecked("id", anode).length == 0) {
                                    hijosNodo = anode.childNodes;
                                    for (i = 0; i < hijosNodo.length; i++) {
                                        if (!hijosNodo[i].isLeaf()) {
                                            id = anode.attributes.id;
                                            adicionarEnDeschequeados(arrayPadresEliminar, id);
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            });

            arbolEntidades.on('checkchange', function (node) {
                var esta = estaEnDeschequeados(arregloDeschequeados, node.attributes.id);
                var id;
                id = node.attributes.id;
                var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);
                if (node.attributes.checked) {
                    marcarHijos(node, true);
                    if (esta != -1)
                        eliminarEnDeschequeados(arregloDeschequeados, esta);
                    if (!node.isLeaf() && esta1 != -1)
                        eliminarEnDeschequeados(arrayPadresEliminar, esta1);
                } else {
                    marcarHijos(node, false);
                    var estaT = estaEnDeschequeados(arrayTiene, id);
                    if (estaT != -1)
                        adicionarEnDeschequeados(arregloDeschequeados, node.attributes.id);
                    if (!node.isLeaf() && node.childNodes.length == 0)
                        adicionarEnDeschequeados(arrayPadresEliminar, id);
                }
            }, this);

            ////------------ Crear nodo padre del arbol ------------////
            padreArbolEntidades = new Ext.tree.AsyncTreeNode({
                text: perfil.etiquetas.lbEstructura,
                expandable: false,
                id: '0'
            });

            arbolEntidades.setRootNode(padreArbolEntidades);

            ////---------- Panel Adicionar Dominio----------////
            var panelAdicionar = new Ext.Panel({
                layout: 'border',
                items: [regDominio, arbolEntidades]
            });

            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];
            this.items = [_this.filtro, _this.grid];
            this.keyMapGroup = true;
            Configuracion.Dominio.superclass.initComponent.call(this);

            ////---------- Funciones ----------////
            function winForm(opcion) {
                switch (opcion) {
                    case 'Ins':
                    {
                        limpiarArreglos();
                        if (!winIns) {
                            winIns = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinAdicionarM,
                                width: 650,
                                height: 400,
                                listeners: {
                                    hide: function () {
                                        _this.getTopToolbar().items.items[0].focus();
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        id: 'btnCancelar',
                                        prevTab: 'descripcion',
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        handler: function () {
                                            winIns.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aplicar',
                                        text: perfil.etiquetas.lbBtnAplicar,
                                        tooltip: perfil.etiquetas.tooltipAplicarVen,
                                        handler: function () {
                                            adicionardominio('apl');
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denominacion',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            adicionardominio();
                                        }
                                    }
                                ]
                            });
                        }
                        modificar = 0;
                        regDominio.getForm().reset();
                        winIns.add(panelAdicionar);
                        winIns.show();
                        Ext.getCmp('denominacion').focus(false,200);
                        arbolEntidades.getRootNode().reload();
                        arbolEntidades.expandPath(arbolEntidades.getRootNode().getPath())
                    }
                        break;
                    case 'Mod':
                    {
                        limpiarArreglos();
                        if (!winMod) {
                            winMod = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinModificarM,
                                width: 650,
                                height: 400,
                                listeners: {
                                    hide: function () {
                                        _this.getTopToolbar().items.items[1].focus();
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        id: 'btnCancelar',
                                        prevTab: 'descripcion',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            winMod.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        nextTab: 'denominacion',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            modificardominio();
                                        }
                                    }
                                ]

                            });
                        }
                        modificar = 1;
                        winMod.add(panelAdicionar);
                        winMod.show();
                        regDominio.getForm().loadRecord(_this.sm.getSelected());
                        arbolEntidades.getRootNode().reload();
                        Ext.getCmp('denominacion').focus(false,200);
                        arbolEntidades.expandPath(arbolEntidades.getRootNode().getPath())
                    }
                        break;
                }
            }

            function adicionardominio(apl) {
                if (regDominio.getForm().isValid()) {
                    var arrayNodos = arbolEntidades.getChecked();
                    var arrayEnt = new Array();
                    var arrayPadres = new Array();
                    if (arrayNodos == 0)
                        mostrarMensaje(3, perfil.etiquetas.lbMsgSelecEntidad, _this.btnAdicionar.focus());
                    else {
                        for (var i = 0; i < arrayNodos.length; i++) {
                            arrayEnt.push(arrayNodos[i].attributes.id);
                            if (!arrayNodos[i].isLeaf() && arrayNodos[i].childNodes.length == 0)
                                arrayPadres.push(arrayNodos[i].attributes.id);
                        }
                        Secodena.mostrarMascara('maskDominio', perfil.etiquetas.msgWait, perfil.etiquetas.msgAdd);
                        regDominio.getForm().submit({
                            url: arbolAcc.root.childNodes[1].attributes.controller + 'insertarnomdominio',
                            timeout: 1800000,
                            params: {
                                arrayEntidades: Ext.encode(arrayEnt),
                                arrayPadres: Ext.encode(arrayPadres)
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskDominio');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.cod, action.result.mensaje, _this.btnAdicionar.focus());
                                    regDominio.getForm().reset();
                                    limpiarArreglos();
                                    if (!apl)
                                        winIns.hide();
                                    arrayNodos = arbolEntidades.getChecked();
                                    for (var i = 0; i < arrayNodos.length; i++) {
                                        cambiarEstadoCheck(arrayNodos[i], false);
                                    }
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje, _this.btnAdicionar.focus());
                            }
                        });
                    }
                }
                else  mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCampos, _this.btnAdicionar.focus());
            }

            function modificardominio() {
                if (regDominio.getForm().isValid()) {
                    var arrayNodos = arbolEntidades.getChecked();
                    var arrayEnt = new Array();
                    var arrayPadres = new Array();
                    if (arrayNodos == 0)
                        mostrarMensaje(3, perfil.etiquetas.lbMsgSelecEntidad, _this.btnModificar.focus());
                    else {
                        buscarNodosTiene(arbolEntidades.getRootNode());
                        if (arrayNodos.length > 0) {
                            for (var i = 0; i < arrayNodos.length; i++) {
                                arrayEnt.push(arrayNodos[i].attributes.id);
                                if (!arrayNodos[i].isLeaf() && arrayNodos[i].childNodes.length == 0) {
                                    arrayPadres.push(arrayNodos[i].attributes.id);
                                }
                            }
                        }
                        Secodena.mostrarMascara('maskDominioMod', perfil.etiquetas.msgWait, perfil.etiquetas.msgMod);
                        regDominio.getForm().submit({
                            url: arbolAcc.root.childNodes[1].attributes.controller + 'modificarnomdominio',
                            timeout: 1800000,
                            params: {
                                iddominio: _this.sm.getSelected().data.iddominio,
                                arrayEntidades: Ext.encode(arrayEnt),
                                arrayEntidadesEliminar: Ext.encode(arregloDeschequeados),
                                seguridad: _this.sm.getSelected().data.seguridad,
                                arrayPadres: Ext.encode(arrayPadres),
                                arrayPadresEliminar: Ext.encode(arrayPadresEliminar),
                                arrayTiene: Ext.encode(arrayTiene)
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskDominioMod');
                                limpiarArreglos();
                                if (action.result.cod != 3) {
                                    mostrarMensaje(action.result.cod, action.result.mensaje, _this.btnAdicionar.focus());
                                    _this.store.reload();
                                    winMod.hide();
                                }
                                if (action.result.cod == 3)
                                    mostrarMensaje(action.result.cod, action.result.mensaje, _this.btnAdicionar.focus());
                            }
                        })
                    }
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops, _this.btnModificar.focus());
            }

            function buscarNodosTiene(nodo) {
                nodo.eachChild(function (anodehijo) {
                    if (!anodehijo.attributes.checked && !anodehijo.isLeaf() && anodehijo.attributes.tiene && anodehijo.childNodes.length == 0)
                        arrayTiene.push(anodehijo.attributes.id);
                    if (anodehijo.childNodes.length > 0)
                        buscarNodosTiene(anodehijo);

                }, this);
            }

            function eliminardominio() {
                mostrarMensaje(2, perfil.etiquetas.lbMsgFunEliminarMsgM, elimina);
                function elimina(btnPresionado) {
                    Secodena.mostrarMascara('maskDominioDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                    if (btnPresionado == 'ok') {
                        Ext.Ajax.request({
                            url: arbolAcc.root.childNodes[1].attributes.controller + 'eliminarnomdominio',
                            method: 'POST',
                            params: {
                                iddominio: _this.sm.getSelected().data.iddominio
                            },
                            callback: function (options, success, response) {
                                Secodena.ocultarMascara('maskDominioDel');
                                responseData = Ext.decode(response.responseText);
                                mostrarMensaje(responseData.cod, responseData.mensaje, _this.btnAdicionar.focus());
                                if (responseData.cod == 1) {
                                    mostrarMensaje(responseData.cod, responseData.mensaje, _this.btnAdicionar.focus());
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                            }
                        });
                    }
                    else {
                        Secodena.ocultarMascara('maskDominioDel');
                        _this.btnEliminar.focus()
                    }
                }
            }

            function clearFilters() {
                denDom.reset();
                _this.store.baseParams = {};
                _this.store.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
	            focusADD();
            }

            function cargarAyuda() {
                help.show('Ayuda de Seguridad', 'seguridad/gestnomdominio');
            }

            function cambiarEstadoCheck(anodehijo, check) {
                if (anodehijo.attributes.checked != check) {
                    anodehijo.getUI().toggleCheck(check);
                }
            }

            function estaEnDeschequeados(arreglonodos, idnodo) {
                var cantidad = arreglonodos.length;
                for (p = 0; p < cantidad; p++) {
                    if (arreglonodos[p] == idnodo)
                        return p;
                }
                return -1;
            }

            function adicionarEnDeschequeados(arreglo, id) {
                if (estaEnDeschequeados(arreglo, id) == -1)
                    arreglo.push(id);
            }

            function limpiarArreglos() {
                arregloDeschequeados = [];
                arrayPadresEliminar = [];
                arrayTiene = [];
            }

            function marcarHijos(nodo, check) {
                nodo.eachChild(function (anodehijo) {
                    if (anodehijo.attributes.checked != check)
                        cambiarEstadoCheck(anodehijo, check);
                    if (anodehijo.childNodes.length > 0)
                        marcarHijos(anodehijo, check);
                }, this);
            }

            function buscarnombredominio(denDom) {
                if(Ext.getCmp('idDenDom').validate()==true){
                busqueda_filtro = true;
                _this.store.baseParams = {};
                _this.store.baseParams.denDom = denDom;
                _this.store.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
                }else{
                        mostrarMensaje(6, perfil.etiquetas.lbMsgErrorEnCamops);
                }
            }

            function focusADD() {
                _this.btnAdicionar.focus();
            }

            function eliminarEnDeschequeados(arreglo, pos) {
                arreglo.splice(pos, 1);
            }
        }
    }
);Ext.ns("Configuracion");
////------------ Declarar Variables ------------////
var winInsServ, winModServ, openldap, tiposervidor, ldap;
var ventanaadicionar = false, tfpuerto;
var arregloAtribNomb = [];
var arregloAtribApell = [];
var arregloAtribUsuario = [];

Configuracion.Servidores = Ext.extend(Ext.Panel,
    {
        id: 'Servidores',
        layout: 'fit',
        closeAction: 'destroy',
        initComponent: function () {
            var _this = this;

            ////------------ Botones ------------////
            this.btnAdicionar = new Ext.Button({
                id: 'btnAgrServ',
                tooltip: perfil.etiquetas.textToolTipadicionar,
                prevTab: 'btnAyuServ',
                iconCls: 'adicionar',
                text: perfil.etiquetas.lbBtnAdicionar,
                hotKey: {
                    idGrupo: 'Servidores',
                    config: {
                        key: 105,
                        alt: true
                    }
                },
                handler: function () {
                    winFormServ('Ins');
                }
            });

            this.btnModificar = new Ext.Button({
                id: 'btnModServ',
                disabled: true,
                tooltip: perfil.etiquetas.textToolTipModificar,
                iconCls: 'modificar',
                text: perfil.etiquetas.lbBtnModificar,
                hotKey: {
                    idGrupo: 'Servidores',
                    config: {
                        key: 109,
                        alt: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() == 1) {
                        winFormServ('Mod');
                    }
                }
            });

            this.btnEliminar = new Ext.Button({
                id: 'btnEliServ',
                disabled: true,
                tooltip: perfil.etiquetas.textToolTipEliminar,
                iconCls: 'eliminar',
                text: perfil.etiquetas.lbBtnEliminar,
                hotKey: {
                    idGrupo: 'Servidores',
                    config: {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        eliminarservidor();
                }
            });

            this.btnProbarConexAdd = new Ext.Button({
                tooltip: perfil.etiquetas.textToolTipProbar,
                iconCls: 'probar',
                text: 'Probar',
                id: 'probarConAdd',
                handler: function () {
                    winProbarCon.show();
                }
            });

            this.btnProbarConexMod = new Ext.Button({
                tooltip: perfil.etiquetas.textToolTipProbar,
                iconCls: 'probar',
                text: 'Probar',
                id: 'probarConMod',
                handler: function () {
                    winProbarCon.show();
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyuServ',
                iconCls: 'ayuda',
                text: '<b>Ayuda</b>',
                nextTab: 'btnAgrServ',
                prevTab: 'btnEliServ',
                disabled: false,
                toolTip: perfil.etiquetas.textToolTipHelp,
                icon: perfil.dirImg + 'ayuda.png',
                hotKey: {
                    idGrupo: 'Servidores',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                menu:
                    new Ext.menu.Menu({
                        id: 'mainMenu',
                        items: [
                            {
                                handler: function () {
                                    cargarAyuda();
                                }, text: 'Ayuda',
                                id: 'btnAyuDesktop',
                                icon: perfil.dirImg + 'ayuda.png',
                                iconCls: 'btn',
                                tooltip: 'Ayuda del sistema'
                            },
                            {
                                text: 'Acerca de',
                                id: 'acercade',
                                icon: perfil.dirImg + 'info.png',
                                iconCls: 'btn',
                                tooltip: "Acerca de <b>(Alt+...s)</b>",
                                handler: function () {

                                    var uri = "seguridad";
                                    acercaDe.show(uri);
                                }
                            }
                        ]
                    })

            });

            ////------------ Combo Box ------------////
            var dataTmp = [
                ['bd', 'Servidor de base datos'],
                ['autenticaci&oacute;n', 'Servidor de autenticaci\xf3n'],
                ['xmpp', 'Servidor XMPP'],
                ['email', 'Servidor de correo elctr\xf3nico']
            ];

            var storeDataTmp = new Ext.data.SimpleStore({
                fields: ['tiposervidor', 'denominacion'],
                data: dataTmp
            });

            ////------------ Store del Grid de Servidores ------------////
            this.store = new Ext.data.Store({
                url: arbolAcc.root.childNodes[2].attributes.controller + 'cargarservidores',
                reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad_filas",
                    root: "datos",
                    id: "id"
                }, [
                    {
                        name: 'idservidor',
                        mapping: 'id'
                    },

                    {
                        name: 'denominacion',
                        mapping: 'text'
                    },

                    {
                        name: 'tiposervidor',
                        mapping: 'tiposervidor'
                    },

                    {
                        name: 'descripcion',
                        mapping: 'descripcion'
                    },

                    {
                        name: 'ip',
                        mapping: 'ip'
                    },

                    {
                        name: 'typeserverauth',
                        mapping: 'tservidor'
                    },

                    {
                        name: 'user',
                        mapping: 'usuario'
                    },

                    {
                        name: 'basedn',
                        mapping: 'basedn'
                    },

                    {
                        name: 'puerto',
                        mapping: 'puerto'
                    },
                    {
                        name: 'chekssl',
                        mapping: 'ssl'
                    },

                    {
                        name: 'chektsl',
                        mapping: 'tsl'
                    },
                    {
                        name: 'objectclass',
                        mapping: 'objectclass'
                    },
                    {
                        name: 'fnombre',
                        mapping: 'fnombre'
                    },
                    {
                        name: 'fapellidos',
                        mapping: 'fapellidos'
                    },
                    {
                        name: 'fusuario',
                        mapping: 'fusuario'
                    },

                    {
                        name: 'fqdn',
                        mapping: 'fqdn'
                    }
                ]),
                listeners: {
                    load: function () {
                        if (_this.store.getCount() == 0) {
                            Ext.Msg.show({
                                title: perfil.etiquetas.msgInf,
                                msg: perfil.etiquetas.msgInfDatos,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                    }

                }
            });

            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });

            ////------------ Establezco modo de selección de grid ------------////
            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: false
            });

            this.sm.on('rowselect', function () {
                _this.btnModificar.enable();
                _this.btnEliminar.enable()
            }, this);

            this.sm.on('rowdeselect', function (smodel) {
                if (smodel.hasSelection() == false) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable()
                }
            }, this);

            ////------------ Defino el grid de Servidores ------------////
            this.grid = new Ext.grid.GridPanel({
                title: perfil.etiquetas.titleGridServidores,
                cls: 'x-toolbar',
                border: false,
                frame: false,
                region: 'center',
                autoExpandColumn: 'expandir',
                store: _this.store,
                sm: _this.sm,
                columns: [
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'idservidor'
                    },
                    {
                        header: perfil.etiquetas.lbServidor,
                        width: 150,
                        dataIndex: 'denominacion',
                        sortable: true
                    },
                    {
                        header: perfil.etiquetas.lbIP,
                        dataIndex: 'ip',
                        sortable: true
                    },
                    {
                        header: perfil.etiquetas.lbTipo,
                        dataIndex: 'tiposervidor',
                        sortable: true
                    },
                    {
                        id: 'expandir',
                        header: perfil.etiquetas.lbDescripcion,
                        width: 350,
                        dataIndex: 'descripcion',
                        sortable: true
                    }
                ],
                loadMask: {
                    store: _this.store
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: 15,
                    id: 'ptbaux',
                    store: _this.store,
                    displayInfo: true,
                    displayMsg: perfil.etiquetas.lbMsgbbarI,
                    emptyMsg: perfil.etiquetas.lbMsgbbarII
                })
            });

            ////************ ITEMS DEL FORMULARIO ************////

            ////------------ Combo servidores del formulario ------------////
            var cbservidores = new Ext.form.ComboBox({
                emptyText: perfil.etiquetas.lbMsgSelect,
                editable: false,
                fieldLabel: perfil.etiquetas.lbTiipoBD,
                store: storeDataTmp,
                tabIndex: 3,
                enableQtip: true,
                id: 'cbservidores',
                prevTab: 'ip',
                valueField: 'tiposervidor',
                displayField: 'denominacion',
                hiddenName: 'tiposervidor',
                typeAhead: true,
                mode: 'local',
                width: 150,
                allowBlank: false,
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '90%'
            });

            ////------------ Textfield usuario del formulario ------------////
            var tfusuario = new Ext.form.TextField({
                fieldLabel: perfil.etiquetas.lbUsuario,
                tabIndex: 6,
                allowBlank: false,
                maxLength: 100,
                width: 350,
                style: 'margin-right:22px',
                id: 'user'
            });

            var tfpassword = new Ext.form.TextField({
                fieldLabel: perfil.etiquetas.lbContrasena,
                inputType: 'password',
                allowBlank: false,
                encryptedValue: '',
                tabIndex: 7,
                width: 350,
                id: 'passw',
                validator: function (value) {
                    if (value) {
                        (ventanaadicionar) ? _this.btnProbarConexAdd.enable() : _this.btnProbarConexMod.enable();
                        if (false) {
                            return '@TODO Agregar mensaje de error (validator).';
                        } else {
                            return true;
                        }
                    } else {
                        if (ventanaadicionar) {
                            _this.btnProbarConexAdd.disable();
                            Ext.getCmp('btnInsServAut').disable();
                        } else {
                            _this.btnProbarConexMod.disable();
                            Ext.getCmp('btnAceptarMod').disable();
                        }
                        return this.emptyText;
                    }
                }
            });

            var tfpuerto = new Ext.form.NumberField({
                tabIndex: 11,
                maxLength: 4,
                anchor: '100%',
                fieldLabel: perfil.etiquetas.lbPuerto,
                value: 389,
                style: 'width: 225px;',
                allowBlank: true,
                id: 'puerto',
                name: 'puerto'
            });

            var panelpuerto = new Ext.Panel({
                hidden: 'true',
                autoHeight: true,
                labelAlign: 'top',
                layout: 'form',
                items: [tfpuerto]
            });

            var chbssl = new Ext.form.Checkbox({
                boxLabel: perfil.etiquetas.lbSSL,
                name: 'chekssl',
                id: 'chekssl',
                padding: '0 0 10 0',
                margins: '0 0 0 0',
                height: 40,
                inputValue: true
            });

            var chbtsl = new Ext.form.Checkbox({
                boxLabel: perfil.etiquetas.lbTSL,
                name: 'chektsl',
                id: 'chektsl',
                style: 'padding: 10px',
                height: 40,
                inputValue: true
            });

            var fqdn = new Ext.form.TextField({
                id: 'fqdn',
                tabIndex: 2,
                maxLength: 100,
                fieldLabel: perfil.etiquetas.fqdn,
                allowBlank: false
            });

            var fqdnct = new Ext.Panel({
                hidden: 'true',
                autoHeight: true,
                labelAlign: 'top',
                layout: 'form',
                autoWidth: true,
                items: [fqdn]
            });

            var chbAgrupador = new Ext.form.CheckboxGroup({
                xtype: 'checkboxgroup',
                labelSeparator: '',
                id: 'chbgp',
                style: 'margins: 10px',
                columns: 2,
                vertical: true,
                items: [chbssl, chbtsl]
            });

            ////------------ RadioButton LDAP y OpenLDAP ------------////
            var chbldap = new Ext.form.Radio({
                hideLabel: 'true',
                tabIndex: 5,
                name: 'ldap',
                boxLabel: perfil.etiquetas.lbTitLDAP,
                id: 'ldap'
            });

            var chbopenldap = new Ext.form.Radio({
                hideLabel: 'true',
                tabIndex: 5,
                name: 'openldap',
                boxLabel: perfil.etiquetas.lbTitOpenLDAP,
                id: 'openldap',
                nextTab: 'puerto'
            });

            ////------------ Fieldset tipos de autenticación del formulario ------------////
            var fstiposaut = new Ext.form.FieldSet({
                title: perfil.etiquetas.lbTitTipoAuth,
                autoHeight: true,
                collapsed: false,
                hidden: 'true',
                anchor: '90%',
                id: 'fstiposaut',
                items: [chbldap, chbopenldap]
            });

            ////------------ FieldSet filtros del ldap  ------------------////-------------------------------------------------------------------------------
            /******************************************************************/

            //-------------- Combo para el nombre de las clases ldap -----------
            var datafiltronombre = [
                ['businessCategory', 'businessCategory'],
                ['c', 'c'],
                ['cn', 'cn'],
                ['dc', 'dc'],
                ['description', 'description'],
                ['destinationIndicator', 'destinationIndicator'],
                ['distinguishedName', 'distinguishedName'],
                ['dnQualifier', 'dnQualifier'],
                ['enhancedSearchGuide', 'enhancedSearchGuide'],
                ['facsimileTelephoneNumber', 'facsimileTelephoneNumber'],
                ['generationQualifier', 'generationQualifier'],
                ['givenName', 'givenName'],
                ['givenname', 'givenname'],
                ['houseIdentifier', 'houseIdentifier'],
                ['initials', 'initials'],
                ['internationalISDNNumber', 'internationalISDNNumber'],
                ['l', 'l'],
                ['member', 'member'],
                ['name', 'name'],
                ['o', 'o'],
                ['ou', 'ou'],
                ['owner', 'owner'],
                ['physicalDeliveryOfficeName', 'physicalDeliveryOfficeName'],
                ['postalAddress', 'postalAddress'],
                ['postalCode', 'postalCode'],
                ['postOfficeBox', 'postOfficeBox'],
                ['preferredDeliveryMethod', 'preferredDeliveryMethod'],
                ['registeredAddress', 'registeredAddress'],
                ['roleOccupant', 'roleOccupant'],
                ['searchGuide', 'searchGuide'],
                ['seeAlso', 'seeAlso'],
                ['serialNumber', 'serialNumber'],
                ['sn', 'sn'],
                ['st', 'st'],
                ['street', 'street'],
                ['telephoneNumber', 'telephoneNumber'],
                ['teletexTerminalIdentifier', 'teletexTerminalIdentifier'],
                ['telexNumber', 'telexNumber'],
                ['title', 'title'],
                ['uid', 'uid'],
                ['uniqueMember', 'uniqueMember'],
                ['userPassword', 'userPassword'],
                ['x121Address', 'x121Address'],
                ['x500UniqueIdentifier', 'x500UniqueIdentifier']

            ];


            var storeFiltronombre = new Ext.data.SimpleStore({
                fields: ['fnombre', 'denomin'],
                data: datafiltronombre
            });

            var cbNombre = new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'denomin',
                enableQtip: true,
                autoScroll: true,
                id: 'cbNombre',
                name: 'cbNombre',
                valueField: 'fnombre',
                store: storeFiltronombre,
                autoCreate: true,
                typeAhead: true,
                hiddenName: 'fnombre',
                triggerAction: 'all',
                editable: true,
                // style:'width:202px',
                minListWidth: 202,
                fieldLabel: "Filtro para nombre",
                mode: 'local',
                emptyText: "Seleccione",
                listeners: {
                    select: function (c, record) {
                        var atrib = record.data.atributo;
                        if (arregloAtribNomb.length == 0) {
                            arregloAtribNomb.push(atrib);
                        }
                        else {
                            AgregarAtribNombre(atrib);
                        }
                    }
                }
            });

            //-------------- Combo para el apellido de las clases ldap -----------

            var datafiltroapellidos = [
                ['businessCategory', 'businessCategory'],
                ['c', 'c'],
                ['cn', 'cn'],
                ['dc', 'dc'],
                ['description', 'description'],
                ['destinationIndicator', 'destinationIndicator'],
                ['distinguishedName', 'distinguishedName'],
                ['dnQualifier', 'dnQualifier'],
                ['enhancedSearchGuide', 'enhancedSearchGuide'],
                ['facsimileTelephoneNumber', 'facsimileTelephoneNumber'],
                ['generationQualifier', 'generationQualifier'],
                ['givenName', 'givenName'],
                ['givenname', 'givenname'],
                ['houseIdentifier', 'houseIdentifier'],
                ['initials', 'initials'],
                ['internationalISDNNumber', 'internationalISDNNumber'],
                ['l', 'l'],
                ['member', 'member'],
                ['name', 'name'],
                ['o', 'o'],
                ['ou', 'ou'],
                ['owner', 'owner'],
                ['physicalDeliveryOfficeName', 'physicalDeliveryOfficeName'],
                ['postalAddress', 'postalAddress'],
                ['postalCode', 'postalCode'],
                ['postOfficeBox', 'postOfficeBox'],
                ['preferredDeliveryMethod', 'preferredDeliveryMethod'],
                ['registeredAddress', 'registeredAddress'],
                ['roleOccupant', 'roleOccupant'],
                ['searchGuide', 'searchGuide'],
                ['seeAlso', 'seeAlso'],
                ['serialNumber', 'serialNumber'],
                ['sn', 'sn'],
                ['st', 'st'],
                ['street', 'street'],
                ['telephoneNumber', 'telephoneNumber'],
                ['teletexTerminalIdentifier', 'teletexTerminalIdentifier'],
                ['telexNumber', 'telexNumber'],
                ['title', 'title'],
                ['uid', 'uid'],
                ['uniqueMember', 'uniqueMember'],
                ['userPassword', 'userPassword'],
                ['x121Address', 'x121Address'],
                ['x500UniqueIdentifier', 'x500UniqueIdentifier']
            ];

            var storeFiltroapellidos = new Ext.data.SimpleStore({
                fields: ['fapellidos', 'denomi'],
                data: datafiltroapellidos
            });

            var cbApellidos = new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'denomi',
                enableQtip: true,
                autoScroll: true,
                id: 'cbApellidos',
                name: 'cbApellidos',
                valueField: 'fapellidos',
                store: storeFiltroapellidos,
                autoCreate: true,
                typeAhead: true,
                hiddenName: 'fapellidos',
                triggerAction: 'all',
                editable: true,
                style: 'width:205px;margin-right:2px;',
                minListWidth: 205,
                fieldLabel: "Filtro para apellidos",
                mode: 'local',
                emptyText: "Seleccione",
                listeners: {
                    select: function (c, record) {
                        var atrib = record.data.atributo;
                        if (arregloAtribApell.length == 0) {
                            arregloAtribApell.push(atrib);
                        }
                        else {
                            AgregarAtribApell(atrib);
                        }
                    }
                }
            });


            //-------------- Combo para el usuario de las clases ldap -----------

            var datafiltrousuario = [
                ['businessCategory', 'businessCategory'],
                ['c', 'c'],
                ['cn', 'cn'],
                ['dc', 'dc'],
                ['description', 'description'],
                ['destinationIndicator', 'destinationIndicator'],
                ['distinguishedName', 'distinguishedName'],
                ['dnQualifier', 'dnQualifier'],
                ['enhancedSearchGuide', 'enhancedSearchGuide'],
                ['facsimileTelephoneNumber', 'facsimileTelephoneNumber'],
                ['generationQualifier', 'generationQualifier'],
                ['givenName', 'givenName'],
                ['houseIdentifier', 'houseIdentifier'],
                ['initials', 'initials'],
                ['internationalISDNNumber', 'internationalISDNNumber'],
                ['l', 'l'],
                ['member', 'member'],
                ['name', 'name'],
                ['o', 'o'],
                ['ou', 'ou'],
                ['owner', 'owner'],
                ['physicalDeliveryOfficeName', 'physicalDeliveryOfficeName'],
                ['postalAddress', 'postalAddress'],
                ['postalCode', 'postalCode'],
                ['postOfficeBox', 'postOfficeBox'],
                ['preferredDeliveryMethod', 'preferredDeliveryMethod'],
                ['registeredAddress', 'registeredAddress'],
                ['roleOccupant', 'roleOccupant'],
                ['searchGuide', 'searchGuide'],
                ['seeAlso', 'seeAlso'],
                ['serialNumber', 'serialNumber'],
                ['sn', 'sn'],
                ['st', 'st'],
                ['street', 'street'],
                ['telephoneNumber', 'telephoneNumber'],
                ['teletexTerminalIdentifier', 'teletexTerminalIdentifier'],
                ['telexNumber', 'telexNumber'],
                ['title', 'title'],
                ['uid', 'uid'],
                ['uniqueMember', 'uniqueMember'],
                ['userPassword', 'userPassword'],
                ['x121Address', 'x121Address'],
                ['x500UniqueIdentifier', 'x500UniqueIdentifier']

            ];

            var storeFiltrousuario = new Ext.data.SimpleStore({
                fields: ['fusuario', 'denomi'],
                data: datafiltrousuario
            });

            var cbUsuario = new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'denomi',
                enableQtip: true,
                autoScroll: true,
                id: 'cbUsuario',
                name: 'cbUsuario',
                valueField: 'fusuario',
                store: storeFiltrousuario,
                autoCreate: true,
                typeAhead: true,
                hiddenName: 'fusuario',
                triggerAction: 'all',
                editable: true,
                style: 'width:201px',
                minListWidth: 201,
                fieldLabel: "Filtro para usuario",
                mode: 'local',
                emptyText: "Seleccione",
                listeners: {
                    select: function (c, record) {
                        var atrib = record.data.atributo;
                        if (arregloAtribUsuario.length == 0) {
                            arregloAtribUsuario.push(atrib);
                        }
                        else {
                            AgregarAtribUsuario(atrib);
                        }
                    }
                }
            });


            ////************ FIN ITEMS DEL FORMULARIO ************////

            ////------------ Formulario ------------////
            this.formulario = new Ext.FormPanel({
                labelAlign: 'top',
                autoHeight: true,
                autoWidth: true,
                monitorValid: true,
                enableKeyEvents: true,
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .33,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbServidor,
                                        id: 'denominacion',
                                        nextTab: 'ip',
                                        tabIndex: 1,
                                        enableKeyEvents: true,
                                        allowBlank: false,
                                        vtype: 'vtalfanumericos',
                                        anchor: '90%'
                                    },
                                    fstiposaut,
                                    fqdnct
                                ]
                            },
                            {
                                columnWidth: .33,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbDireccionIP,
                                        id: 'ip',
                                        nextTab: 'cbservidores',
                                        prevTab: 'denominacion',
                                        tabIndex: 2,
                                        allowBlank: false,
                                        blankText: perfil.etiquetas.lbMsgCReq,
                                        vtype: 'vtdominioip',
                                        enableKeyEvents: true,
                                        anchor: '90%'
                                    },
                                    new Ext.Panel({
                                        id: 'panel3',
                                        hidden: 'true',
                                        autoHeight: true,
                                        labelAlign: 'top',
                                        layout: 'form',
                                        autoWidth: true,
                                        items: [
                                            new Ext.form.TextField({
                                                id: 'basedn',
                                                tabIndex: 2,
                                                maxLength: 100,
                                                style: 'width: 225px;',
                                                fieldLabel: perfil.etiquetas.lbBaseDN,
                                                allowBlank: false
                                            })
                                        ]
                                    }),
                                    chbAgrupador
                                ]
                            },
                            {
                                columnWidth: .33,
                                layout: 'form',
                                items: [
                                    cbservidores,
                                    panelpuerto
                                ]
                            }
                        ]
                    },
                    new Ext.form.FieldSet({
                        title: 'Filtros de b&uacute;squeda',
                        autoHeight: true,
                        height: 200,
                        hidden: 'true',
                        style: 'margin',
                        id: 'fsfiltrosLdap',
                        items: [{
                            layout: 'column',
                            items: [{
                                columnWidth: .33,
                                width: '33%',
                                layout: 'form',
                                items: [
                                    cbUsuario
                                ]
                            }, {
                                columnWidth: .33,
                                width: '33%',
                                layout: 'form',
                                items: [
                                    cbNombre
                                ]
                            }, {
                                columnWidth: .33,
                                width: '33%',
                                layout: 'form',
                                items: [
                                    cbApellidos
                                ]
                            }]
                        }]

                    }),
                    {
                        layout: 'column',
                        items: [{
                            width: '100%',
                            layout: 'form',
                            items: [
                                new Ext.form.FieldSet({
                                    title: perfil.etiquetas.lbTitConexion,
                                    autoHeight: true,
                                    hidden: 'true',
                                    layout: 'column',
                                    id: 'fsusuario',
                                    items: [{
                                        layout: 'form',
                                        items: [
                                            tfusuario
                                        ]
                                    }, {
                                        layout: 'form',
                                        items: [
                                            tfpassword
                                        ]
                                    }]
                                })
                            ]
                        }]
                    },
                    {
                        xtype: 'textarea',
                        height: '20%',
                        fieldLabel: perfil.etiquetas.lbDescripcion,
                        id: 'descripcion',
                        nextTab: 'btnCancelar',
                        maxLength: 255,
                        anchor: '96%'
                    }
                ]
            });

            ////------------ Formulario para probar conexion ------------////
            this.formProbar = new Ext.FormPanel({
                labelAlign: 'left',
                autoHeight: true,
                autoWidth: true,
                id: '_this.formProbar',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbUsuario,
                        id: 'usuario',
                        width: 120,
                        name: 'usuario',
                        allowBlank: false,
                        maxLength: 50,
                        anchor: '90%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbContrasena,
                        id: 'password',
                        width: 120,
                        inputType: 'password',
                        name: 'password',
                        maxLength: 30,
                        allowBlank: false,
                        anchor: '90%'
                    }
                ]
            });

            var winProbarCon = new Ext.Window({
                modal: true,
                closeAction: 'hide',
                layout: 'fit',
                title: perfil.etiquetas.lbConexion,
                width: 300,
                height: 250,
                resizable: false,
                autoHeight: true,
                shadow: false,
                items: [_this.formProbar],
                buttons: [
                    {
                        iconCls: 'cancelar',
                        text: perfil.etiquetas.lbBtnCancelar,
                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                        handler: function () {
                            winProbarCon.hide();
                            Ext.getCmp('passw').reset();
                            Ext.getCmp('usuario').reset();
                            Ext.getCmp('password').reset();
                        }
                    },
                    {
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        handler: function () {
                            if (_this.formProbar.getForm().isValid()) {
                                Secodena.mostrarMascara('maskConexion', perfil.etiquetas.msgWait, perfil.etiquetas.msgProbarConex);
                                var tmp = Ext.getCmp('passw');
                                var passTemp = tmp.getValue();
                                tmp.encryptedValue = encryptRSA(tmp.getValue());
                                tmp.setValue(tmp.encryptedValue);

                                _this.formulario.getForm().submit({
                                    url: arbolAcc.root.childNodes[2].attributes.controller + 'probarConexion',
                                    waitMsg: perfil.etiquetas.lbMsgProbandoS,
                                    params: {
                                        usuario: Ext.getCmp('usuario').getValue(),
                                        password: encryptRSA(Ext.getCmp('password').getValue())
                                    },
                                    failure: function (form, action) {
                                        Secodena.ocultarMascara('maskConexion');
                                        if (action.result.codMsg != 3 || action.result.codMsg != 4) {
                                            if (winInsServ != null) {
                                                if (winInsServ.isVisible()) {
                                                    Ext.getCmp('btnInsServAut').enable();
                                                    Ext.getCmp('btnInsServAutApli').enable();
                                                }
                                            } else if (winModServ != null) {
                                                if (winModServ.isVisible()) {
                                                    Ext.getCmp('btnAceptarMod').enable();
                                                    Ext.getCmp('passw').setValue(tmp);
                                                }
                                            }
                                            mostrarMensaje(action.result.codMsg, action.result.mensaje, function (btnPresionado) {
                                                if (btnPresionado == 'ok') {
                                                    winProbarCon.hide();
                                                    Ext.getCmp('usuario').reset();
                                                    Ext.getCmp('password').reset();
                                                }
                                            });
                                        }
                                        if (action.result.codMsg == 3 || action.result.codMsg == 4) {
                                            mostrarMensaje(action.result.codMsg, action.result.mensaje, function (btnPresionado) {
                                                if (btnPresionado == 'ok') {
                                                    winProbarCon.hide();
                                                    Ext.getCmp('usuario').reset();
                                                    Ext.getCmp('password').reset();
                                                    if (winInsServ != null) {
                                                        if (winInsServ.isVisible()) {
                                                            Ext.getCmp('passw').reset();
                                                            Ext.getCmp('passw').focus(200);
                                                            Ext.getCmp('probarConAdd').disable();
                                                            Ext.getCmp('btnInsServAut').disable();
                                                            Ext.getCmp('btnInsServAutApli').disable();
                                                        }
                                                    } else if (winModServ != null) {
                                                        if (winModServ.isVisible()) {
                                                            Ext.getCmp('passw').reset();
                                                            Ext.getCmp('passw').focus(200);
                                                            Ext.getCmp('probarConMod').disable();
                                                            Ext.getCmp('btnAceptarMod').disable();
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        tmp.setValue(passTemp);
                                    }
                                });
                            } else
                                mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
                        }
                    }
                ]
            });

            UCID.portal.cargarAcciones(window.frameElement.id);

            ////------------ Evento para activar o desactivar fieldset tipos de autenticación ------------////
            cbservidores.on('select', function () {
                tipoAutenticacion((cbservidores.getValue()));
                if (tfpuerto.getValue() == '')
                    tfpuerto.setValue(389);
                if (cbservidores.getValue() == 'autenticaci&oacute;n')
                    Ext.getCmp('basedn').allowBlank = false;
                else
                    Ext.getCmp('basedn').allowBlank = true;
                if (cbservidores.getValue() == 'autenticaci&oacute;n') {
                    _this.btnProbarConexAdd.enable();
                    if (winInsServ != null && winInsServ.isVisible()) {
                        Ext.getCmp('btnInsServAutApli').disable();
                        Ext.getCmp('btnInsServAut').disable();
                    } else if (winModServ != null && winModServ.isVisible()) {
                        Ext.getCmp('btnAceptarMod').disable();
                    }
                } else {
                    if (winInsServ != null && winInsServ.isVisible()) {
                        Ext.getCmp('btnInsServAutApli').enable();
                        Ext.getCmp('btnInsServAut').enable();
                    } else if (winModServ != null && winInsServ.isVisible()) {
                        Ext.getCmp('btnAceptarMod').enable();
                    }
                }
            });

            cbservidores.on('change', function () {
                if (cbservidores.getValue() == 'autenticaci&oacute;n')
                    Ext.getCmp('basedn').allowBlank = false;
                else
                    Ext.getCmp('basedn').allowBlank = true;
            });

            ////------------ Evento para activar o desactivar fieldset usuario a través del radio OpenLDAP ------------////
            chbldap.on('check', function () {
                if (chbldap.getValue() == true) {
                    chbopenldap.setValue(!chbldap.getValue());
                    ldap = 'ldap';
                    openldap = '';
                    cbUsuario.reset();
                    cbUsuario.hide();
                    cbUsuario.disable();

                    cbNombre.reset();
                    cbNombre.hide();
                    cbNombre.disable();

                    cbApellidos.reset();
                    cbApellidos.hide();
                    cbApellidos.disable();
                    Ext.getCmp('fsfiltrosLdap').disable();
                    Ext.getCmp('fsfiltrosLdap').hide();
                }
            });

            chbopenldap.on('check', function () {
                if (chbopenldap.getValue() == true) {
                    chbldap.setValue(!chbopenldap.getValue());
                    openldap = 'openldap';
                    ldap = '';
                    Ext.getCmp('fsfiltrosLdap').enable();
                    Ext.getCmp('fsfiltrosLdap').show();
                    cbNombre.show();
                    cbApellidos.show();
                    cbUsuario.show();
                    cbNombre.enable();
                    cbApellidos.enable();
                    cbUsuario.enable();
                }
            });

            chbssl.on('check', function () {
                if (tfpuerto.getValue() != '636')
                    tfpuerto.setValue('636');
                else
                    tfpuerto.setValue('389');
            });

            this.items = _this.grid;
            this.keyMapGroup = true;
            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];

            Configuracion.Servidores.superclass.initComponent.call(this);

            ////------------ Funciones ------------////

            function closeWindow(valor) {
                panelpuerto.hide();
                chbAgrupador.hide();
                Ext.getCmp('panel3').hide();
                (ventanaadicionar) ? _this.btnProbarConexAdd.hide() : _this.btnProbarConexMod.hide();
                (ventanaadicionar) ? _this.btnProbarConexAdd.disable() : _this.btnProbarConexMod.disable();
                if (valor == 1) {
                    winInsServ.hide();
                    Ext.getCmp('btnInsServAut').enable();
                    Ext.getCmp('btnInsServAutApli').enable();
                } else {
                    winModServ.hide();
                    Ext.getCmp('btnAceptarMod').enable();
                }
            }

            function winFormServ(opcion) {
                switch (opcion) {
                    case 'Ins': {
                        ventanaadicionar = true;
                        if (!winInsServ) {

                            winInsServ = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                title: perfil.etiquetas.lbWinAdicionarS,
                                width: 800,
                                height: 400,
                                resizable: false,
                                x: 312,
                                y: 50,
                                autoHeight: true,
                                shadow: false,
                                listeners: {
                                    show: function () {
                                        Ext.getCmp('chekssl').container.dom.style.width = '100%';
                                        Ext.getCmp('chektsl').container.dom.style.width = '100%';
                                    },
                                    hide: function () {
                                        _this.getTopToolbar().items.items[0].focus();
                                    }
                                },
                                buttons: [
                                    _this.btnProbarConexAdd,
                                    {
                                        iconCls: 'cancelar',
                                        id: 'btnCancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            closeWindow(1);
                                        }
                                    }, {
                                        iconCls: 'aplicar',
                                        id: 'btnInsServAutApli',
                                        text: perfil.etiquetas.lbBtnAplicar,
                                        tooltip: perfil.etiquetas.tooltipAplicarVen,
                                        handler: function () {
                                            adicionarservidor('apl');
                                        }
                                    }, {
                                        iconCls: 'aceptar',
                                        nextTab: 'denominacion',
                                        id: 'btnInsServAut',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            adicionarservidor();
                                        }
                                    }]
                            });


                        }
                        panelpuerto.hide();
                        chbAgrupador.hide();
                        Ext.getCmp('panel3').hide();
                        _this.btnProbarConexAdd.hide();
                        _this.btnProbarConexAdd.disable();
                        Ext.getCmp('fsusuario').hide();
                        if (_this.formulario)
                            _this.formulario.getForm().reset();
                        fstiposaut.hide();
                        Ext.getCmp('fsfiltrosLdap').hide();
                        cbNombre.hide();
                        cbApellidos.hide();
                        cbUsuario.hide();
                        fqdnct.hide();
                        winInsServ.add(_this.formulario);
                        winInsServ.doLayout();
                        winInsServ.show();

                    }
                        break;
                    case 'Mod': {
                        ventanaadicionar = false;
                        if (!winModServ) {
                            winModServ = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                title: perfil.etiquetas.lbWinModificarS,
                                width: 800,
                                height: 400,
                                x: 312,
                                y: 50,
                                resizable: false,
                                autoHeight: true,
                                shadow: false,
                                listeners: {
                                    show: function () {
                                        Ext.getCmp('chekssl').container.dom.style.width = '100%';
                                        Ext.getCmp('chektsl').container.dom.style.width = '100%';
                                    },
                                    hide: function () {
                                        _this.getTopToolbar().items.items[1].focus();
                                    }
                                },
                                buttons: [
                                    _this.btnProbarConexMod,
                                    {
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        iconCls: 'cancelar',
                                        id: 'btnCancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        handler: function () {
                                            closeWindow(0);
                                        }
                                    }, {
                                        iconCls: 'aceptar',
                                        id: 'btnAceptarMod',
                                        nextTab: 'denominacion',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            modificarservidor();
                                        }
                                    }]
                            });
                            _this.formulario.getForm().reset();
                        }
                        else {
                            _this.formulario.getForm().reset();
                        }

                        winModServ.add(_this.formulario);
                        winModServ.doLayout();
                        winModServ.show();
                        if (_this.sm.getSelected().data.tiposervidor == 'autenticaci&oacute;n') {
                            Ext.getCmp(_this.sm.getSelected().data.typeserverauth).setValue(true);
                            if (_this.sm.getSelected().data.chekssl == true)
                                chbssl.setValue(true);
                            if (_this.sm.getSelected().data.chektsl == true)
                                chbtsl.setValue(true);
                            tipoAutenticacion('autenticaci&oacute;n');
                            Ext.getCmp('basedn').allowBlank = false;
                        } else if (_this.sm.getSelected().data.tiposervidor == 'email' || _this.sm.getSelected().data.tiposervidor == 'xmpp') {
                            if (_this.sm.getSelected().data.chekssl == true)
                                chbssl.setValue(true);
                            if (_this.sm.getSelected().data.chektsl == true)
                                chbtsl.setValue(true);
                            //if (_this.sm.getSelected().data.fqdn != null)
                            //    fqdn.setValue(_this.sm.getSelected().data.fqdn);
                            tipoAutenticacion();
                        } else {
                            tipoAutenticacion('bd');
                            Ext.getCmp('basedn').allowBlank = true;
                        }
                        _this.formulario.getForm().loadRecord(_this.sm.getSelected())
                    }
                        break;
                }
            }

            function tipoAutenticacion(tiposerv) {
                if (tiposerv == 'autenticaci&oacute;n') {
                    if (!chbldap.getValue() && !chbopenldap.getValue())
                        chbldap.setValue(true);
                    tfpassword.show();
                    fstiposaut.show();
                    Ext.getCmp('fsusuario').show();
                    tfusuario.show();
                    panelpuerto.show();
                    chbAgrupador.show();
                    Ext.getCmp('panel3').show();
                    (ventanaadicionar) ? _this.btnProbarConexAdd.show() : _this.btnProbarConexMod.show();
                    (ventanaadicionar) ? _this.btnProbarConexAdd.disable() : _this.btnProbarConexMod.disable();
                    Ext.getCmp('fsusuario').enable();
                    fstiposaut.enable();
                    tfusuario.enable();
                    tfpuerto.allowBlank = false;
                    basedn.allowBlank = false;
                    fqdnct.hide();
                    fqdn.allowBlank = true;
                    tfpassword.enable();
                } else if (tiposerv == 'bd') {
                    chbldap.setValue(false);
                    chbopenldap.setValue(false);
                    Ext.getCmp('fsusuario').hide();
                    panelpuerto.hide();
                    fstiposaut.hide();
                    Ext.getCmp('fsfiltrosLdap').hide();
                    cbNombre.hide();
                    cbApellidos.hide();
                    cbUsuario.hide();
                    tfusuario.hide();
                    chbAgrupador.hide();
                    Ext.getCmp('panel3').hide();
                    basedn.allowBlank = true;
                    (ventanaadicionar) ? _this.btnProbarConexAdd.hide() : _this.btnProbarConexMod.hide();
                    Ext.getCmp('fsusuario').disable();
                    tfpassword.disable();
                    fstiposaut.disable();
                    Ext.getCmp('fsfiltrosLdap').disable();
                    cbNombre.disable();
                    cbApellidos.disable();
                    cbUsuario.disable();
                    tfusuario.disable();
                    tfpuerto.allowBlank = true;
                    tfusuario.allowBlank = true;
                    fqdnct.hide();
                    fqdn.allowBlank = true;
                } else {
                    (ventanaadicionar) ? _this.btnProbarConexAdd.hide() : _this.btnProbarConexMod.hide();
                    fqdnct.show();
                    fqdn.allowBlank = false;
                    tfpassword.show();
                    tfpassword.enable();
                    Ext.getCmp('fsusuario').show();
                    tfusuario.show();
                    panelpuerto.show();
                    chbAgrupador.show();
                    Ext.getCmp('fsusuario').enable();
                    fstiposaut.disable();
                    fstiposaut.hide();
                    tfusuario.enable();
                    tfpuerto.allowBlank = false;
                    basedn.allowBlank = true;
                    Ext.getCmp('panel3').hide();
                    Ext.getCmp('fsfiltrosLdap').hide();
                }
            }

            function adicionarservidor(apl) {
                if (_this.formulario.getForm().isValid()) {
                    var tmp = Ext.getCmp('passw');
                    var passTemp = tmp.getValue();
                    tmp.encryptedValue = encryptRSA(tmp.getValue());
                    tmp.setValue(tmp.encryptedValue);
                    Secodena.mostrarMascara('maskServidor', perfil.etiquetas.msgWait, perfil.etiquetas.msgAdd);
                    if (cbservidores.getValue() == 'bd') {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'insertarserv',
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskServidor');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    if (!apl)
                                        winInsServ.hide();
                                    _this.formulario.getForm().reset();
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);

                                tmp.setValue(passTemp);
                            }
                        });
                    } else if (chbopenldap.checked) {
                        enviarFormularioAdd(apl);
                    } else if (chbldap.checked) {
                        enviarFormularioAdd(apl);
                    } else if (cbservidores.getValue() == 'email' || cbservidores.getValue() == 'xmpp') {
                        enviarFormularioAdd(apl);
                    }
                    else
                        mostrarMensaje(3, perfil.etiquetas.msgInformacionServidor);
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function enviarFormularioAdd(apl) {
                _this.formulario.getForm().submit({
                    params: {
                        ldap: ldap
                    },
                    url: arbolAcc.root.childNodes[2].attributes.controller + 'insertarserv',
                    failure: function (form, action) {
                        Secodena.ocultarMascara('maskServidor');
                        if (action.result.codMsg != 3) {
                            mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            if (!apl)
                                winInsServ.hide();
                            _this.formulario.getForm().reset();
                            _this.store.reload();
                            _this.sm.clearSelections();
                            _this.btnModificar.disable();
                            _this.btnEliminar.disable();
                            chbldap.setValue(true);
                            _this.btnProbarConexAdd.disable();
                        }
                        if (action.result.codMsg == 3)
                            mostrarMensaje(action.result.codMsg, action.result.mensaje);
                    }
                });
            }

            function modificarservidor() {
                if (_this.formulario.getForm().isValid()) {

                    var tmp = Ext.getCmp('passw');
                    var passTemp = tmp.getValue();
                    tmp.encryptedValue = encryptRSA(tmp.getValue());
                    tmp.setValue(tmp.encryptedValue);
                    Secodena.mostrarMascara('maskservidorMod', perfil.etiquetas.msgWait, perfil.etiquetas.msgMod);
                    if (cbservidores.getValue() == 'bd') {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'modificarserv',
                            params: {
                                idservidor: _this.sm.getSelected().data.idservidor
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskservidorMod');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    _this.store.reload();
                                    winModServ.hide();
                                    _this.formulario.getForm().reset();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    } else if (cbservidores.getValue() == 'email' || cbservidores.getValue() == 'xmpp') {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'modificarserv',
                            params: {
                                idservidor: _this.sm.getSelected().data.idservidor
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskservidorMod');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    _this.store.reload();
                                    winModServ.hide();
                                    _this.formulario.getForm().reset();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    } else if (chbldap.checked) {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'modificarserv',
                            params: {
                                idservidor: _this.sm.getSelected().data.idservidor
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskservidorMod');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    _this.store.reload();
                                    winModServ.hide();
                                    _this.formulario.getForm().reset();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    } else if (chbopenldap.checked) {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'modificarserv',
                            params: {
                                idservidor: _this.sm.getSelected().data.idservidor
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskservidorMod');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    _this.store.reload();
                                    _this.formulario.getForm().reset();
                                    winModServ.hide();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    }
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function eliminarservidor() {
                var arrServElim = _this.sm.getSelections();
                var arrayServElim = [];
                for (var i = 0; i < arrServElim.length; i++)
                    arrayServElim.push(arrServElim[i].data.idservidor);
                mostrarMensaje(2, perfil.etiquetas.lbMsgFunEliminarMsgS, elimina);

                function elimina(btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Secodena.mostrarMascara('maskservidorDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                        Ext.Ajax.request({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'comprobarservidor',
                            method: 'POST',
                            params: {
                                arrayServ: Ext.encode(arrayServElim)
                            },
                            callback: function (options, success, response) {
                                Secodena.ocultarMascara('maskservidorDel');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.tiene == 1)
                                    mostrarMensaje(2, perfil.etiquetas.lbMsgEliminarGA, elimina1);
                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (responseData.codMsg == 3)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        });
                    }
                    if (btnPresionado != 'ok')
                        _this.btnEliminar.focus()
                }
            }

            function cargarAyuda() {
                help.show('Ayuda de servidores', 'seguridad/gestservidor');
            }

            function encryptRSA(text) {
                var key = RSA.getPublicKey(document.getElementById('publicKey').value);
                return RSA.encrypt(text, key);
            }

            function AgregarAtribNombre(atrib) {
                var encuentra = false;
                for (var i = 0; i < arregloAtribNomb.length; i++) {
                    if (atrib == arregloAtribNomb[i]) {
                        encuentra = true;
                    }
                }
                if (!encuentra) {
                    arregloAtribNomb.push(atrib);
                }
            }

            function AgregarAtribApell(atrib) {
                var encuentra = false;
                for (var i = 0; i < arregloAtribApell.length; i++) {
                    if (atrib == arregloAtribApell[i]) {
                        encuentra = true;
                    }
                }
                if (!encuentra) {
                    arregloAtribApell.push(atrib);
                }
            }

            function AgregarAtribUsuario(atrib) {
                var encuentra = false;
                for (var i = 0; i < arregloAtribUsuario.length; i++) {
                    if (atrib == arregloAtribUsuario[i]) {
                        encuentra = true;
                    }
                }
                if (!encuentra) {
                    arregloAtribUsuario.push(atrib);
                }
            }


        }
    }
);
Ext.ns("Configuracion");

////------------ Declarar Variables ------------////
var winInsIdioma, winModIdioma;

Configuracion.Idiomas = Ext.extend(Ext.Panel,
    {
        id: 'idiomas',
        layout: 'fit',
        initComponent: function () {
            var _this = this;

            ////------------ Botones ------------////
            this.btnAdicionar = new Ext.Button({
                id: 'btnAgrIdioma',
                iconCls: 'adicionar',
                text: perfil.etiquetas.lbBtnAdicionar,
                tooltip: perfil.etiquetas.textToolTipadicionarI,
                prevTab: 'btnAyuIdioma',
                hotKey: {
                    idGrupo: 'idiomas',
                    config: {
                        key: 105,
                        alt: true
                    }
                },
                handler: function () {
                    winFormIdioma('Ins');
                }
            });

            this.btnModificar = new Ext.Button({
                id: 'btnModIdioma',
                disabled: true,
                iconCls: 'modificar',
                text: perfil.etiquetas.lbBtnModificar,
                tooltip: perfil.etiquetas.textToolTipModificarI,
                hotKey: {
                    idGrupo: 'idiomas',
                    config: {
                        key: 109,
                        alt: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        winFormIdioma('Mod');
                }
            });

            this.btnEliminar = new Ext.Button({
                id: 'btnEliIdioma',
                disabled: true,
                iconCls: 'eliminar',
                text: perfil.etiquetas.lbBtnEliminar,
                tooltip: perfil.etiquetas.textToolTipEliminarI,
                nextTab: 'btnAyuIdioma',
                prevTab: 'btnModIdioma',
                hotKey: {
                    idGrupo: 'idiomas',
                    config: {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        eliminarIdioma();
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyuIdioma',
                iconCls: 'ayuda',
                text: '<b>Ayuda</b>',
                prevTab: 'btnEliIdioma',
                nextTab: 'btnAgrIdioma',
                disabled: false,
                toolTip: perfil.etiquetas.textToolTipHelp,
                icon: perfil.dirImg + 'ayuda.png',
                hotKey: {
                    idGrupo: 'idiomas',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                menu:
                    new Ext.menu.Menu({
                        id: 'mainMenu',
                        items: [
                            {
                                handler: function() {
                                    help.show('Ayuda del nomenclador de idiomas', 'seguridad/gestnomidioma');
                                }, text: 'Ayuda',
                                id: 'btnAyuDesktop',
                                icon: perfil.dirImg + 'ayuda.png',
                                iconCls: 'btn',
                                tooltip:'Ayuda del sistema'
                            },
                            {
                                text: 'Acerca de',
                                id: 'acercade',
                                icon: perfil.dirImg  + 'info.png',
                                iconCls: 'btn',
                                tooltip:"Acerca de <b>(Alt+...s)</b>",
                                handler: function() {

                                    var uri = "seguridad";
                                    acercaDe.show(uri);
                                }}
                        ]
                    })

            });
            /**this.btnAyuda = new Ext.Button({
                id: 'btnAyuIdioma',
                iconCls: 'ayuda',
                text: perfil.etiquetas.lbBtnAyuda,
                prevTab: 'btnEliIdioma',
                nextTab: 'btnAgrIdioma',
                tooltip: perfil.etiquetas.textToolTipHelp,
                hotKey: {
                    idGrupo: 'idiomas',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                handler: function () {
                    help.show('Ayuda del nomenclador de idiomas', 'seguridad/gestnomidioma');
                }
            });*/

            ////------------ Store del Grid de Idiomas ------------////
            this.store = new Ext.data.Store({
                url: arbolAcc.root.childNodes[3].attributes.controller + 'cargarnomidioma',
                reader: new Ext.data.JsonReader({
                        totalProperty: "cantidad_filas",
                        root: "datos",
                        id: "ididioma"
                    },
                    [
                        {
                            name: 'ididioma',
                            mapping: 'ididioma'
                        },

                        {
                            name: 'denomidioma',
                            mapping: 'denominacion'
                        },

                        {
                            name: 'abrevidioma',
                            mapping: 'abreviatura'
                        }
                    ])
            });

            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });

            ////------------ Establezco modo de selección de grid ------------////
            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });

            this.sm.on('rowselect', function () {
                _this.btnModificar.enable();
                _this.btnEliminar.enable()
            }, this);

            this.sm.on('rowdeselect', function (smodel) {
                if (smodel.hasSelection() == false) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable()
                }
            }, this);

            ////------------ Defino el grid de Idiomas ------------////
            this.grid = new Ext.grid.GridPanel({
                title: 'Listado de idiomas',
                cls: 'x-toolbar',
                border: false,
                frame: false,
                region: 'center',
                autoExpandColumn: 'expandir',
                store: _this.store,
                sm: _this.sm,
                columns: [
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'ididioma'
                    },

                    {
                        header: perfil.etiquetas.lbIdioma,
                        width: 200,
                        dataIndex: 'denomidioma',
                        id: 'expandir',
                        sortable: true
                    },

                    {
                        header: perfil.etiquetas.lbAbreviatura,
                        width: 300,
                        dataIndex: 'abrevidioma',
                        sortable: true
                    }
                ],
                loadMask: {
                    store: _this.store
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: 15,
                    id: 'ptbaux',
                    store: _this.store,
                    displayInfo: true,
                    displayMsg: perfil.etiquetas.lbMsgbbarI,
                    emptyMsg: perfil.etiquetas.lbMsgbbarII
                })
            });

            ////------------ Formulario ------------////
            this.formulario = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                enableKeyEvents: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbDenominacion,
                                        id: 'denomidioma',
                                        enableKeyEvents: true,
                                        allowBlank: false,
                                        maxLength: 50,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        vtype: 'vtletrasycomas',
                                        anchor: '80%'
                                    }
                                ]
                            },
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbAbreviatura,
                                        id: 'abrevidioma',
                                        enableKeyEvents: true,
                                        allowBlank: false,
                                        maxLength: 4,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        vtype: 'vtnombre',
                                        anchor: '80%'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            UCID.portal.cargarAcciones(window.frameElement.id);

            ////------------ Cargar la ventana ------------////
            function winFormIdioma(opcion) {
                switch (opcion) {
                    case 'Ins':
                    {
                        if (!winInsIdioma) {
                            winInsIdioma = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinAdicionarI,
                                width: 300,
                                height: 150,
                                listeners: {
                                    hide: function () {
                                        _this.btnAdicionar.focus()
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            winInsIdioma.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aplicar',
                                        text: perfil.etiquetas.lbBtnAplicar,
                                        tooltip: perfil.etiquetas.tooltipAplicarVen,
                                        handler: function () {
                                            adicionarIdioma('apl');
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denomidioma',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            adicionarIdioma();
                                        }
                                    }
                                ]
                            });
                        }
                        _this.formulario.getForm().reset();
                        winInsIdioma.add(_this.formulario);
                        winInsIdioma.show();
                        Ext.getCmp('denomidioma').focus(false,200)

                    }
                        break;
                    case 'Mod':
                    {
                        if (!winModIdioma) {
                            winModIdioma = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinModificarI,
                                width: 300,
                                height: 150,
                                listeners: {
                                    hide: function () {
                                        Ext.getCmp('btnModIdioma').focus()
                                    }
                                },
                                buttons: [
                                    {
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        iconCls: 'cancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        handler: function () {
                                            winModIdioma.hide();
                                        }
                                    },
                                    {
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        iconCls: 'aceptar',
                                        nextTab: 'denomidioma',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        handler: function () {
                                            modificarIdioma();
                                        }
                                    }
                                ]
                            });
                             _this.formulario.getForm().reset();
                        winModIdioma.add(_this.formulario);
                        }
                        else{
                             _this.formulario.getForm().reset();
                        
                        }
                       
                        winModIdioma.show();
                        Ext.getCmp('denomidioma').focus(false,200);
                        _this.formulario.getForm().loadRecord(_this.sm.getSelected())
                    }
                        break;
                }
            }

            this.items = _this.grid;
            this.keyMapGroup = true;
            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];

            Configuracion.Idiomas.superclass.initComponent.call(this);

            function adicionarIdioma(apl) {
                if (_this.formulario.getForm().isValid()) {
                    Secodena.mostrarMascara('maskIdioma', perfil.etiquetas.msgWait, perfil.etiquetas.msgAdd);
                    _this.formulario.getForm().submit({
                        url: arbolAcc.root.childNodes[3].attributes.controller + 'insertarnomidioma',
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskIdioma');
                            if (action.result.cod != 3) {
                                mostrarMensaje(action.result.cod, action.result.mensaje);
                                _this.formulario.getForm().reset();
                                _this.store.reload();
                                if (!apl)
                                    winInsIdioma.hide();
                                _this.sm.clearSelections();
                                _this.btnModificar.disable();
                                _this.btnEliminar.disable();
                            }
                            if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops, _this.btnAdicionar.focus());
            }

            function modificarIdioma() {
                if (_this.formulario.getForm().isValid()) {
                    Secodena.mostrarMascara('maskIdiomaMod', perfil.etiquetas.msgWait, perfil.etiquetas.msgMod);
                    _this.formulario.getForm().submit({
                        url: arbolAcc.root.childNodes[3].attributes.controller + 'modificarnomidioma',
                        params: {
                            ididioma: _this.sm.getSelected().data.ididioma
                        },
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskIdiomaMod');
                            if (action.result.cod != 3) {
                                mostrarMensaje(action.result.cod, action.result.mensaje);
                                winModIdioma.hide();
                                _this.store.reload();
                            }
                            if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops, _this.btnModificar.focus());
            }

            function eliminarIdioma() {
                mostrarMensaje(2, perfil.etiquetas.lbMsgFunEliminarMsgI, elimina);
                function elimina(btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Secodena.mostrarMascara('maskIdiomaDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                        Ext.Ajax.request({
                            url: arbolAcc.root.childNodes[3].attributes.controller + 'eliminarnomidioma',
                            method: 'POST',
                            params: {
                                ididioma: _this.sm.getSelected().data.ididioma
                            },
                            callback: function (options, success, response) {
                                Secodena.ocultarMascara('maskIdiomaDel');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.cod == 1) {
                                    mostrarMensaje(responseData.cod, responseData.mensaje);
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (responseData.cod == 3) mostrarMensaje(responseData.cod, responseData.mensaje);
                            }
                        });
                    }
                    if (btnPresionado != 'ok')
                        _this.btnEliminar.focus()
                }
            }
        }
    }
);Ext.ns("Configuracion");

////------------ Declarar Variables ------------////
var winInsTema, winModTema;

////------------ Area de Validaciones ------------////
var tipos, abreviatura;
abreviatura = /^([a-zA-ZáéíóúñüÑ]+[a-zA-ZáéíóúñüÑ\d\.\-\@\#\_]*)+$/;

Configuracion.Temas = Ext.extend(Ext.Panel,
    {
        id: 'temas',
        layout: 'fit',
        initComponent: function () {
            var _this = this;

            ////------------ Botones ------------////
            this.btnAdicionar = new Ext.Button({
                id: 'btnAgrTema',
                iconCls: 'adicionar',
                text: perfil.etiquetas.lbBtnAdicionar,
                hotKey: {
                    idGrupo: 'temas',
                    config: {
                        key: 105,
                        alt: true
                    }
                },
                tooltip: perfil.etiquetas.textToolTipadicionarT,
                prevTab: 'btnAyuTema',
                handler: function () {
                    winForm('Ins');
                }
            });

            this.btnModificar = new Ext.Button({
                id: 'btnModTema',
                disabled: true,
                iconCls: 'modificar',
                text: perfil.etiquetas.lbBtnModificar,
                hotKey: {
                    idGrupo: 'temas',
                    config: {
                        key: 109,
                        alt: true
                    }
                },
                tooltip: perfil.etiquetas.textToolTipModificarT,
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        winForm('Mod');
                }
            });

            this.btnEliminar = new Ext.Button({
                id: 'btnEliTema',
                disabled: true,
                iconCls: 'eliminar',
                text: perfil.etiquetas.lbBtnEliminar,
                hotKey: {
                    idGrupo: 'temas',
                    config: {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true
                    }
                },
                nextTab: 'btnAyuTema',
                prevTab: 'btnModTema',
                tooltip: perfil.etiquetas.textToolTipEliminarT,
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        eliminarTema();
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyuTema',
                iconCls: 'ayuda',
                text: '<b>Ayuda</b>',
                nextTab: 'btnAgrTema',
                prevTab: 'btnEliTema',
                disabled: false,
                toolTip: perfil.etiquetas.textToolTipHelp,
                icon: perfil.dirImg + 'ayuda.png',
                hotKey: {
                    idGrupo: 'temas',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                menu:
                    new Ext.menu.Menu({
                        id: 'mainMenu',
                        items: [
                            {
                                handler: function() {
                                    cargarAyuda();
                                }, text: 'Ayuda',
                                id: 'btnAyuDesktop',
                                icon: perfil.dirImg + 'ayuda.png',
                                iconCls: 'btn',
                                tooltip:'Ayuda del sistema'
                            },
                            {
                                text: 'Acerca de',
                                id: 'acercade',
                                icon: perfil.dirImg  + 'info.png',
                                iconCls: 'btn',
                                tooltip:"Acerca de <b>(Alt+...s)</b>",
                                handler: function() {

                                    var uri = "seguridad";
                                    acercaDe.show(uri);
                                }}
                        ]
                    })

            });
            /**this.btnAyuda = new Ext.Button({
                id: 'btnAyuTema',
                nextTab: 'btnAgrTema',
                prevTab: 'btnEliTema',
                iconCls: 'ayuda',
                text: perfil.etiquetas.lbBtnAyuda,
                hotKey: {
                    idGrupo: 'temas',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                tooltip: perfil.etiquetas.textToolTipHelp,
                handler: function () {
                    cargarAyuda();
                }
            });*/

            ////------------ Store del Grid de Temas ------------////
            this.store = new Ext.data.Store({
                url: arbolAcc.root.childNodes[4].attributes.controller + 'cargarnomtema',
                reader: new Ext.data.JsonReader({
                        totalProperty: "cantidad_filas",
                        root: "datos",
                        id: "idtema"
                    },
                    [
                        {
                            name: 'idtema'
                        },
                        {
                            name: 'denomTema',
                            mapping: 'denominacion'
                        },
                        {
                            name: 'descripTema',
                            mapping: 'descripcion'
                        },
                        {
                            name: 'abrevTema',
                            mapping: 'abreviatura'
                        }
                    ])
            });

            ////------------ Establezco modo de selección de grid ------------////
            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });

            this.sm.on('rowselect', function () {
                _this.btnModificar.enable();
                _this.btnEliminar.enable()
            }, this);

            this.sm.on('rowdeselect', function (smodel) {
                if (smodel.hasSelection() == false) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable()
                }
            }, this);

            ////------------ Defino el grid de Temas ------------////
            this.grid = new Ext.grid.GridPanel({
                title: perfil.etiquetas.titleGridTemas,
                cls: 'x-toolbar',
                border: false,
                frame: false,
                region: 'center',
                autoExpandColumn: 'expandir',
                store: _this.store,
                sm: _this.sm,
                columns: [
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'idtema'
                    },
                    {
                        header: perfil.etiquetas.lbTema,
                        width: 200,
                        dataIndex: 'denomTema',
                        sortable: true
                    },
                    {
                        header: perfil.etiquetas.lbAbreviatura,
                        width: 200,
                        dataIndex: 'abrevTema',
                        sortable: true
                    },
                    {
                        id: 'expandir',
                        header: perfil.etiquetas.lbDescripcion,
                        width: 200,
                        dataIndex: 'descripTema',
                        sortable: true
                    }
                ],
                loadMask: {
                    store: _this.store
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: 15,
                    id: 'ptbaux',
                    store: _this.store,
                    displayInfo: true,
                    displayMsg: perfil.etiquetas.lbMsgbbarI,
                    emptyMsg: perfil.etiquetas.lbMsgbbarII
                })
            });

            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });

            UCID.portal.cargarAcciones(window.frameElement.id);

            ////------------ Formulario ------------////
            this.formulario = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                enableKeyEvents: true,
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbDenominacion,
                                        id: 'denomTema',
                                        enableKeyEvents: true,
                                        allowBlank: false,
                                        maxLength: 60,
                                        maskRe:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*))$/,
                                        regex:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*))$/,
                                        regexText: perfil.etiquetas.lbMsgregexI,
                                        anchor: '95%'
                                    }
                                ]
                            },
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbAbreviatura,
                                        id: 'abrevTema',
                                        maxLength: 10,
                                        allowBlank: false,
                                        enableKeyEvents: true,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        vtype: 'vtalfanumericosguiones',
                                        anchor: '95%'
                                    }
                                ]
                            },
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textarea',
                                        maxLength: 255,
                                        fieldLabel: perfil.etiquetas.lbDescripcion,
                                        id: 'descripTema',
                                        anchor: '100%'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            this.items = _this.grid;
            this.keyMapGroup = true;
            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];
            Configuracion.Temas.superclass.initComponent.call(this);

            ////------------ Funciones ------------////
            function winForm(opcion) {
                switch (opcion) {
                    case 'Ins':
                    {
                        if (!winInsTema) {
                            winInsTema = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinAdicionarT,
                                width: 350,
                                height: 220,
                                listeners: {
                                    hide: function () {
                                        _this.btnAdicionar.focus()
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            winInsTema.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aplicar',
                                        text: perfil.etiquetas.lbBtnAplicar,
                                        tooltip: perfil.etiquetas.tooltipAplicarVen,
                                        handler: function () {
                                            adicionarTema('apl');
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denominacion',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            adicionarTema();
                                        }
                                    }
                                ]
                            });
                        }
                        _this.formulario.getForm().reset();
                        winInsTema.add(_this.formulario);
                        winInsTema.show()
                        Ext.getCmp('denomTema').focus(false,200);
                    }
                        break;
                    case 'Mod':
                    {
                        if (!winModTema) {
                            winModTema = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinModificarT,
                                width: 350,
                                height: 220,
                                listeners: {
                                    hide: function () {
                                        _this.btnModificar.focus()
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        handler: function () {
                                            winModTema.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denomTema',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            modificarTema();
                                        }
                                    }
                                ]
                            });
                        _this.formulario.getForm().reset();
                        winModTema.add(_this.formulario);
                        }
                        else{
                              _this.formulario.getForm().reset();                    
                        }
                     
                        winModTema.show();
                        Ext.getCmp('denomTema').focus(false,200);
                        _this.formulario.getForm().loadRecord(_this.sm.getSelected())
                    }
                        break;
                }
            }

            function adicionarTema(apl) {
                if (_this.formulario.getForm().isValid()) {
                    Secodena.mostrarMascara('maskTema', perfil.etiquetas.msgWait, perfil.etiquetas.msgAdd);
                    _this.formulario.getForm().submit({
                        url: arbolAcc.root.childNodes[4].attributes.controller + 'insertartema',
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskTema');
                            if (action.result.cod != 3) {
                                mostrarMensaje(action.result.cod, action.result.mensaje);
                                _this.formulario.getForm().reset();
                                _this.store.reload();
                                if (!apl)
                                    winInsTema.hide();
                                _this.sm.clearSelections();
                                _this.btnModificar.disable();
                                _this.btnEliminar.disable();
                            }
                            if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops, _this.btnAdicionar.focus());
            }

            function modificarTema() {
                if (_this.formulario.getForm().isValid()) {
                    Secodena.mostrarMascara('maskTemaMod', perfil.etiquetas.msgWait, perfil.etiquetas.msgMod);
                    _this.formulario.getForm().submit({
                        url: arbolAcc.root.childNodes[4].attributes.controller + 'modificartema',
                        params: {
                            idtema: _this.sm.getSelected().data.idtema
                        },
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskTemaMod');
                            if (action.result.cod != 3) {
                                mostrarMensaje(action.result.cod, action.result.mensaje);
                                _this.store.reload();
                                winModTema.hide();
                            }
                            if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops, _this.btnModificar.focus());
            }

            function eliminarTema() {
                mostrarMensaje(2, perfil.etiquetas.lbMsgFunEliminarMsgT, elimina);

                function elimina(btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Secodena.mostrarMascara('maskTemaDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                        Ext.Ajax.request({
                            url: arbolAcc.root.childNodes[4].attributes.controller + 'eliminarnomtema',
                            method: 'POST',
                            params: {
                                idtema: _this.sm.getSelected().data.idtema
                            },
                            callback: function (options, success, response) {
                                Secodena.ocultarMascara('maskTemaDel');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.cod == 1) {
                                    mostrarMensaje(responseData.cod, responseData.mensaje);
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (responseData.cod == 3) mostrarMensaje(responseData.cod, responseData.mensaje);
                            }
                        });
                    }
                    if (btnPresionado != 'ok')
                        _this.btnEliminar.focus()
                }
            }

            function cargarAyuda() {
                help.show('Ayuda del nomenclador de temas', 'seguridad/gestnomtema');
            }
        }
    }
);Ext.ns("Configuracion");

////------------ Declarar variables ------------////
var winInsEsc, winModEsc;

////------------ Area de Validaciones ------------////
var tipos, abreviatura;
tipos = /(^([a-zA-ZáéíóúñüÑ])+([a-zA-ZáéíóúñüÑ\d\.\-\@\#\_\s]*))$/;
abreviatura = /(^([a-zA-ZáéíóúñüÑ])+([a-zA-ZáéíóúñüÑ\d\.\-\@\#\_\s]*))$/;

Configuracion.Escritorio = Ext.extend(Ext.Panel,
    {
        id: 'Escritorio',
        layout: 'fit',
        initComponent: function () {
            var _this = this;

            ////------------ Botones ------------////
            this.btnAdicionar = new Ext.Button({
                id: 'btnAgrDesktop',
                iconCls: 'adicionar',
                prevTab: 'btnAyuDesktop',
                text: perfil.etiquetas.lbBtnAdicionar,
                tooltip: perfil.etiquetas.textToolTipadicionarD,
                hotKey: {
                    idGrupo: 'Escritorio',
                    config: {
                        key: 105,
                        alt: true
                    }
                },
                handler: function () {
                    winForm('Ins');
                }
            });

            this.btnModificar = new Ext.Button({
                id: 'btnModDesktop',
                disabled: true,
                iconCls: 'modificar',
                text: perfil.etiquetas.lbBtnModificar,
                tooltip: perfil.etiquetas.textToolTipModificarD,
                hotKey: {
                    idGrupo: 'Escritorio',
                    config: {
                        key: 109,
                        alt: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        winForm('Mod');
                }
            });

            this.btnEliminar = new Ext.Button({
                id: 'btnEliDesktop',
                disabled: true,
                iconCls: 'eliminar',
                text: perfil.etiquetas.lbBtnEliminar,
                tooltip: perfil.etiquetas.textToolTipEliminarD,
                hotKey: {
                    idGrupo: 'Escritorio',
                    config: {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        eliminarDesktop();
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyuDesktop',
                iconCls: 'ayuda',
                text: '<b>Ayuda</b>',
                disabled: false,
                toolTip: 'Ayuda de Escritorios',
                icon: perfil.dirImg + 'ayuda.png',
                hotKey: {
                    idGrupo: 'Escritorio',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                menu:
                    new Ext.menu.Menu({
                        id: 'mainMenu',
                        items: [
                            {
                                handler: function() {
                                    cargarAyuda();
                                }, text: 'Ayuda',
                                id: 'btnAyuDesktop',
                                icon: perfil.dirImg + 'ayuda.png',
                                iconCls: 'btn',
                                tooltip:'Ayuda del sistema'
                            },
                            {
                                text: 'Acerca de',
                                id: 'acercade',
                                icon: perfil.dirImg  + 'info.png',
                                iconCls: 'btn',
                                tooltip:"Acerca de <b>(Alt+...s)</b>",
                                handler: function() {

                                    var uri = "seguridad";
                                    acercaDe.show(uri);
                                }}
                        ]
                    })

            });
            /**this.btnAyuda = new Ext.Button({
                id: 'btnAyuDesktop',
                iconCls: 'ayuda',
                text: perfil.etiquetas.lbBtnAyuda,
                nextTab: 'btnAgrDesktop',
                prevTab: 'btnEliDesktop',
                tooltip: perfil.etiquetas.textToolTipHelp,
                hotKey: {
                    idGrupo: 'Escritorio',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                handler: function () {
                    cargarAyuda();
                }
            });*/

            ////------------ Store del Grid de Escritorio ------------////
            this.store = new Ext.data.Store({
                url: arbolAcc.root.childNodes[5].attributes.controller + 'cargarnomdesktop',
                reader: new Ext.data.JsonReader({
                        totalProperty: "cantidad_filas",
                        root: "datos",
                        id: "iddesktop"
                    },
                    [
                        {
                            name: 'iddesktop',
                            mapping: 'iddesktop'
                        },
                        {
                            name: 'descripciondes',
                            mapping: 'descripcion'
                        },
                        {
                            name: 'denominaciondes',
                            mapping: 'denominacion'
                        },
                        {
                            name: 'abreviaturades',
                            mapping: 'abreviatura'
                        }
                    ]),
                listeners: {
                    load: function () {
                        if (_this.store.getCount() == 0)
                            Ext.Msg.show({
                                title: perfil.etiquetas.msgInf,
                                msg: perfil.etiquetas.msgInfDatos,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            });
                    }
                }
            });

            ////------------ Establezco modo de selección del grid ------------////
            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });

            this.sm.on('rowselect', function () {
                _this.btnModificar.enable();
                _this.btnEliminar.enable()
            }, this);

            this.sm.on('rowdeselect', function (smodel) {
                if (smodel.hasSelection() == false) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable()
                }
            }, this);

            ////------------ Defino el grid de Escritorio ------------////
            this.grid = new Ext.grid.GridPanel({
                title: perfil.etiquetas.titleGridDesktop,
                cls: 'x-toolbar',
                border: false,
                frame: false,
                region: 'center',
                autoExpandColumn: 'expandir',
                store: _this.store,
                sm: _this.sm,
                columns: [
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'iddesktop'
                    },
                    {
                        header: perfil.etiquetas.lbEscritorio,
                        width: 200,
                        dataIndex: 'denominaciondes',
                        sortable: true
                    },
                    {
                        header: perfil.etiquetas.lbAbreviatura,
                        width: 200,
                        dataIndex: 'abreviaturades',
                        sortable: true
                    },
                    {
                        header: perfil.etiquetas.lbDescripcion,
                        width: 200,
                        dataIndex: 'descripciondes',
                        id: 'expandir',
                        sortable: true
                    }
                ],
                loadMask: {
                    store: _this.store
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: 15,
                    id: 'ptbaux',
                    store: _this.store,
                    displayInfo: true,
                    displayMsg: perfil.etiquetas.lbMsgbbarI,
                    emptyMsg: perfil.etiquetas.lbMsgbbarII
                })
            });

            ////------------ Formulario ------------////
            this.formulario = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbDenominacion,
                                        id: 'denominaciondes',
                                        allowBlank: false,
                                        maxLength: 60,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        vtype: 'vtalfanumericos',
                                        anchor: '95%'
                                    }
                                ]
                            },
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbAbreviatura,
                                        id: 'abreviaturades',
                                        maxLength: 40,
                                        allowBlank: false,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        vtype: 'vtabrev',
                                        anchor: '95%'
                                    }
                                ]
                            },
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textarea',
                                        fieldLabel: perfil.etiquetas.lbDescripcion,
                                        id: 'descripciondes',
                                        maxLength: 255,
                                        anchor: '98%'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            ////------------ Cargar la ventana ------------////
            function winForm(opcion) {
                switch (opcion) {
                    case 'Ins':
                    {
                        if (!winInsEsc) {
                            winInsEsc = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinAdicionarD,
                                width: 500,
                                height: 220,
                                listeners: {
                                    hide: function () {
                                        _this.getTopToolbar().items.items[0].focus();
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            winInsEsc.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aplicar',
                                        text: perfil.etiquetas.lbBtnAplicar,
                                        tooltip: perfil.etiquetas.tooltipAplicarVen,
                                        handler: function () {
                                            adicionarDesktop('apl');
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denominaciondes',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            adicionarDesktop();
                                        }
                                    }
                                ]
                            });
                        }
                        _this.formulario.getForm().reset();
                        winInsEsc.add(_this.formulario);
                        winInsEsc.show();
                        Ext.getCmp('denominaciondes').focus(false,200)

                    }
                        break;
                    case 'Mod':
                    {
                        if (!winModEsc) {
                            winModEsc = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinModificarD,
                                width: 500,
                                height: 220,
                                listeners: {
                                    hide: function () {
                                        _this.getTopToolbar().items.items[1].focus();
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            winModEsc.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denominaciondes',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            modificarDesktop();
                                        }
                                    }
                                ]
                            });
                             _this.formulario.getForm().reset();
                        winModEsc.add(_this.formulario);
                        }
                        else{
                             _this.formulario.getForm().reset();
                      
                        }
                       
                        winModEsc.show();
                        Ext.getCmp('denominaciondes').focus(false,200)
                        _this.formulario.getForm().loadRecord(_this.sm.getSelected())
                    }
                        break;
                }
            }

            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });

            UCID.portal.cargarAcciones(window.frameElement.id);

            this.items = _this.grid;
            this.keyMapGroup = true;
            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];
            Configuracion.Escritorio.superclass.initComponent.call(this);

            ////------------ Funciones ------------////
            function adicionarDesktop(apl) {
                if (_this.formulario.getForm().isValid()) {
                    Secodena.mostrarMascara('maskDesktop', perfil.etiquetas.msgWait, perfil.etiquetas.msgAdd);
                    _this.formulario.getForm().submit({
                        url: arbolAcc.root.childNodes[5].attributes.controller + 'insertarnomdesktop',
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskDesktop');
                            if (action.result.cod != 3) {
                                mostrarMensaje(action.result.cod, action.result.mensaje);
                                _this.formulario.getForm().reset();
                                _this.store.reload();
                                if (!apl)
                                    winInsEsc.hide();
                                _this.sm.clearSelections();
                                _this.btnModificar.disable();
                                _this.btnEliminar.disable();
                            }
                            if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function modificarDesktop() {
                if (_this.formulario.getForm().isValid()) {
                    Secodena.mostrarMascara('maskDesktopMod', perfil.etiquetas.msgWait, perfil.etiquetas.msgMod);
                    _this.formulario.getForm().submit({
                        url: arbolAcc.root.childNodes[5].attributes.controller + 'modificarnomdesktop',
                        params: {
                            iddesktop: _this.sm.getSelected().data.iddesktop
                        },
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskDesktopMod');
                            if (action.result.cod != 3) {
                                mostrarMensaje(action.result.cod, action.result.mensaje);
                                winModEsc.hide();
                                _this.store.reload();
                            }
                            if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function eliminarDesktop() {
                mostrarMensaje(2, perfil.etiquetas.lbMsgFunEliminarMsgD, elimina);
                function elimina(btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Secodena.mostrarMascara('maskDesktopDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                        Ext.Ajax.request({
                            url: arbolAcc.root.childNodes[5].attributes.controller + 'eliminarnomdesktop',
                            method: 'POST',
                            params: {
                                iddesktop: _this.sm.getSelected().data.iddesktop
                            },
                            callback: function (options, success, response) {
                                Secodena.ocultarMascara('maskDesktopDel');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.cod == 1) {
                                    mostrarMensaje(responseData.cod, responseData.mensaje);
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (responseData.cod == 3) mostrarMensaje(responseData.cod, responseData.mensaje);
                            }
                        });
                    }
                    if (btnPresionado != 'ok')
                        _this.btnEliminar.focus()
                }
            }

            function cargarAyuda() {
                help.show('Ayuda del nomenclador de tipos de escritorios', 'seguridad/gestnomdesktop');
            }
        }
    }
);
Ext.ns("Configuracion");

////------------ Area de Validaciones ------------////
var tipos, expre, busqueda_grid = false;
expre = /^(\/{1}).+(\/{1})$/;

////------------- Declarar Variables -------------////
var winInsExp, winModExp;

Configuracion.Expresiones = Ext.extend(Ext.Panel,
    {
        id: 'Expresiones',
        layout: 'border',
        region: 'center',
        initComponent: function () {
            var _this = this;

            ////------------- Botones -------------////
            this.btnAdicionar = new Ext.Button({
                id: 'btnAgrExpre',
                iconCls: 'adicionar',
                text: perfil.etiquetas.lbBtnAdicionar,
                tooltip: perfil.etiquetas.textToolTipadicionarE,
                prevTab: 'btnAyuExpre',
                hotKey: {
                    idGrupo: 'Expresiones',
                    config: {
                        key: 105,
                        alt: true
                    }
                },
                handler: function () {
                    winForm('Ins');
                }
            });

            this.btnModificar = new Ext.Button({
                id: 'btnModExpre',
                disabled: true,
                iconCls: 'modificar',
                text: perfil.etiquetas.lbBtnModificar,
                tooltip: perfil.etiquetas.textToolTipModificarE,
                hotKey: {
                    idGrupo: 'Expresiones',
                    config: {
                        key: 109,
                        alt: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        winForm('Mod');
                }
            });

            this.btnEliminar = new Ext.Button({
                id: 'btnEliExpre',
                disabled: true,
                iconCls: 'eliminar',
                nextTab: 'btnAyuExpre',
                prevTab: 'btnModExpre',
                text: perfil.etiquetas.lbBtnEliminar,
                tooltip: perfil.etiquetas.textToolTipEliminarE,
                hotKey: {
                    idGrupo: 'Expresiones',
                    config: {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        eliminarExpresion();
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyuExpre',
                iconCls: 'ayuda',
                nextTab: 'btnAgrExpre',
                prevTab: 'btnEliExpre',
                text: '<b>Ayuda</b>',
                disabled: false,
                hotKey: {
                    idGrupo: 'Expresiones',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                toolTip: perfil.etiquetas.textToolTipHelp,
                //icon: perfil.dirImg + 'ayuda.png',
                menu:
                    new Ext.menu.Menu({
                        id: 'mainMenu',
                        items: [
                            {
                                handler: function() {
                                    help.show('Ayuda del nomenclador de expresiones regulares', 'seguridad/gestnomexpresiones');
                                }, text: 'Ayuda',
                                id: 'btnAyuRel',
                                //icon: perfil.dirImg + 'ayuda.png',
                                iconCls: 'ayuda',
                                tooltip:'Ayuda del sistema'
                            },
                            {
                                text: 'Acerca de',
                                id: 'acercade',
                                //icon: perfil.dirImg  + 'info.png',
                                iconCls: 'info',
                                tooltip:"Acerca de <b>(Alt+...s)</b>",
                                handler: function() {

                                    var uri = "seguridad";
                                    acercaDe.show(uri);
                                }}
                        ]
                    })

            });
            /**this.btnAyuda = new Ext.Button({
                id: 'btnAyuExpre',
                nextTab: 'btnAgrExpre',
                prevTab: 'btnEliExpre',
                iconCls: 'ayuda',
                text: perfil.etiquetas.lbBtnAyuda,
                tooltip: perfil.etiquetas.textToolTipHelp,
                hotKey: {
                    idGrupo: 'Expresiones',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                handler: function () {
                    help.show('Ayuda del nomenclador de expresiones regulares', 'seguridad/gestnomexpresiones');
                }
            });*/

            ////------------- Store del Grid -------------////
            this.store = new Ext.data.Store({
                url: arbolAcc.root.childNodes[6].attributes.controller + 'cargarexpresiones',
                reader: new Ext.data.JsonReader({
                        totalProperty: "cantidad_filas",
                        root: "datos",
                        id: "idfuncionalidad"
                    },
                    [
                        {
                            name: 'idfuncionalidad'
                        },
                        {
                            name: 'idmodulo'
                        },
                        {
                            name: 'idexpresiones'
                        },
                        {
                            name: 'denominacionexp',
                            mapping: 'denominacion'
                        },
                        {
                            name: 'descripcionexp',
                            mapping: 'descripcion'
                        },
                        {
                            name: 'expresion'
                        }
                    ]),
                listeners: {
                    load: function () {
                        if (_this.store.getCount() == 0) {
                            if (denomExp.getValue())
                                /**Ext.Msg.show({
                                    title: perfil.etiquetas.msgInf,
                                    msg: perfil.etiquetas.msgInfDatosMostrar,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO
                                })*/
                                mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar);
                            else if (busqueda_grid) {
                                /**Ext.Msg.show({
                                    title: perfil.etiquetas.msgInf,
                                    msg: perfil.etiquetas.msgInfDatos,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO
                                })*/
                                mostrarMensaje(1, perfil.etiquetas.msgInfDatos);
                                busqueda_grid = false;
                            }
                        }
                    }
                }
            });

            ////------------- Establezco modo de selección de grid -------------////
            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });

            this.sm.on('rowselect', function () {
                _this.btnModificar.enable();
                _this.btnEliminar.enable()
            }, this);

            this.sm.on('rowdeselect', function (smodel) {
                if (smodel.hasSelection() == false) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable()
                }
            }, this);

            ////------------- Defino el grid de Expresiones -------------////
            this.grid = new Ext.grid.GridPanel({
                title: perfil.etiquetas.titleGridExpr,
                cls: 'x-toolbar',
                border: false,
                frame: false,
                region: 'center',
                autoExpandColumn: 'expandir',
                store: _this.store,
                sm: _this.sm,
                columns: [
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'idexpresiones'
                    },
                    {
                        header: perfil.etiquetas.lbDenominacion,
                        width: 300,
                        dataIndex: 'denominacionexp',
                        sortable: true
                    },
                    {
                        header: perfil.etiquetas.lbExpresion,
                        width: 300,
                        dataIndex: 'expresion',
                        sortable: true
                    },
                    {
                        id: 'expandir',
                        header: perfil.etiquetas.lbDescripcion,
                        width: 210,
                        dataIndex: 'descripcionexp',
                        sortable: true
                    }
                ],
                loadMask: {
                    store: _this.store
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: 15,
                    id: 'ptbaux',
                    store: _this.store,
                    displayInfo: true,
                    displayMsg: perfil.etiquetas.lbMsgbbarI,
                    emptyMsg: perfil.etiquetas.lbMsgbbarII
                })
            });

            var denomExp = new Ext.form.TextField({
                fieldLabel: perfil.etiquetas.lbDenominacion,
                emptyText: perfil.etiquetas.emptytext,
                anchor: "98%",
                width: 150,
                maxLength: 60,
                colWidth: .3,
                id: 'denomExp',
                vtype:'vtalfanumericos',
                prevTab: 'btnAyuExpre'
            });

            var btnBuscar = new Ext.Button({
                id: 'btnBuscarExp',
                nextTab: 'btnClearExp',
                prevTab: 'denomExp',
                iconCls: 'buscar',
                text: perfil.etiquetas.lbBtnBuscar,
                tooltip: perfil.etiquetas.textToolTipSearchE,
                hotKey: {
                    idGrupo: 'Expresiones',
                    config: {
                        key: 98,
                        alt: true
                    }
                },
                handler: function () {
                    buscarExpresiones(denomExp.getValue());
                }
            });

            var btnLimpiar = new Ext.Button({
                //icon: perfil.dirImg + 'limpiar.png',
                id: 'btnClearExp',
                nextTab: 'btnAgrExpre',
                prevTab: 'btnBuscarExp',
                iconCls: 'limpiar',
                text: perfil.etiquetas.denomLimpiar,
                tooltip: perfil.etiquetas.cleanFilter,
                hotKey: {
                    idGrupo: 'Expresiones',
                    config: {
                        key: 108,
                        alt: true
                    }
                },
                handler: function () {
                    clearFilters();
                }
            });

            this.filtro = new Ext.ToolBar.searchToolBar({
                elementos: [denomExp],
                botones: [btnBuscar, btnLimpiar]
            });

            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });

            UCID.portal.cargarAcciones(window.frameElement.id);

            ////------------- Formulario -------------////
            this.formulario = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbDenominacion,
                                        id: 'denominacionexp',
                                        maxLength: 60,
                                        allowBlank: false,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        vtype: 'vtalfanumericos',
                                        anchor: '95%'
                                    }
                                ]
                            },
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbExpresion,
                                        id: 'expresion',
                                        maxLength: 255,
                                        allowBlank: false,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        regexText: perfil.etiquetas.lbMsgregexII,
                                        regex: expre,
                                        anchor: '95%'
                                    }
                                ]
                            },
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textarea',
                                        fieldLabel: perfil.etiquetas.lbDescripcion,
                                        id: 'descripcionexp',
                                        maxLength: 255,
                                        anchor: '100%'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];
            this.items = [_this.filtro, _this.grid];
            this.keyMapGroup = true;
            Configuracion.Expresiones.superclass.initComponent.call(this);

            ////------------- Funciones -------------////
            function winForm(opcion) {
                switch (opcion) {
                    case 'Ins':
                    {
                        if (!winInsExp) {
                            winInsExp = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                title: perfil.etiquetas.lbWinAdicionarE,
                                width: 400,
                                height: 230,
                                listeners: {
                                    hide: function () {
                                        _this.getTopToolbar().items.items[0].focus();
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            winInsExp.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aplicar',
                                        text: perfil.etiquetas.lbBtnAplicar,
                                        tooltip: perfil.etiquetas.tooltipAplicarVen,
                                        handler: function () {
                                            adicionarExpresiones('apl');
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denominacionexp',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            adicionarExpresiones();
                                        }
                                    }
                                ]
                            });
                        }
                        _this.formulario.getForm().reset();
                        winInsExp.add(_this.formulario);
                        winInsExp.show();
                        Ext.getCmp('denominacionexp').focus(false,200)

                    }
                        break;
                    case 'Mod':
                    {
                        if (!winModExp) {
                            winModExp = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                title: perfil.etiquetas.lbWinModificarE,
                                width: 400,
                                height: 230,
                                listeners: {
                                    hide: function () {
                                        _this.getTopToolbar().items.items[1].focus();
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            winModExp.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denominacionexp',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            modificarExpresion();
                                            Ext.getCmp('btnModExpre').setDisabled(true);
                                            Ext.getCmp('btnEliExpre').setDisabled(true);

                                        }
                                    }
                                ]
                            });
                             _this.formulario.getForm().reset();
                        winModExp.add(_this.formulario);
                        }
                        else{
                             _this.formulario.getForm().reset();                       
                        }
                       
                        winModExp.show();
                        Ext.getCmp('denominacionexp').focus(false,200);
                        _this.formulario.getForm().loadRecord(_this.sm.getSelected())
                    }
                        break;
                }
            }

            function buscarExpresiones(denomExp) {
                if(Ext.getCmp('denomExp').validate()==true){
                    busqueda_grid = true;
                    _this.store.baseParams = {};
                    _this.store.baseParams.buscar = denomExp;
                    _this.store.load({
                        params: {
                            start: 0,
                            limit: 15
                        }
                    });
                }else
                    mostrarMensaje(7, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function clearFilters() {
                denomExp.reset();
                _this.store.baseParams = {};
                _this.store.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
               _this.btnAdicionar.focus();
            }

            function adicionarExpresiones(apl) {
                if (_this.formulario.getForm().isValid()) {
                    Secodena.mostrarMascara('maskExpresion', perfil.etiquetas.msgWait, perfil.etiquetas.msgAdd);
                    _this.formulario.getForm().submit({
                        url: arbolAcc.root.childNodes[6].attributes.controller + 'insertarexpresion',
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskExpresion');
                            if (action.result.codMsg != 3) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                _this.formulario.getForm().reset();
                                if (!apl)
                                    winInsExp.hide();
                                _this.store.reload();
                                _this.sm.clearSelections();
                                _this.btnModificar.disable();
                                _this.btnEliminar.disable();
                            }
                            if (action.result.codMsg == 3) mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function modificarExpresion() {
                if (_this.formulario.getForm().isValid()) {
                    Secodena.mostrarMascara('maskExpresionMod', perfil.etiquetas.msgWait, perfil.etiquetas.msgMod);
                    _this.formulario.getForm().submit({
                        url: arbolAcc.root.childNodes[6].attributes.controller + 'modificarexpresion',
                        params: {
                            idexpresiones: _this.sm.getSelected().data.idexpresiones
                        },
                        failure: function (form, action) {
                            Secodena.ocultarMascara('maskExpresionMod');
                            if (action.result.codMsg != 3) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                _this.store.reload();
                                winModExp.hide();
                            }
                            if (action.result.codMsg == 3) mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        }
                    });
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function eliminarExpresion() {
                var arrExpElim = _this.sm.getSelections();
                var arrayExpElim = [];
                for (var i = 0; i < arrExpElim.length; i++)
                    arrayExpElim.push(arrExpElim[i].data.idexpresiones);
                mostrarMensaje(2, perfil.etiquetas.lbMsgFunEliminarMsgE, elimina);
                function elimina(btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Secodena.mostrarMascara('maskExpresionDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                        Ext.Ajax.request({
                            url: arbolAcc.root.childNodes[6].attributes.controller + 'eliminarexpresion',
                            method: 'POST',
                            params: {
                                expresionesElim: Ext.encode(arrayExpElim)
                            },
                            callback: function (options, success, response) {
                                Secodena.ocultarMascara('maskExpresionDel');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (responseData.codMsg == 3) mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        });
                    }
                    if (btnPresionado != 'ok')
                        _this.btnEliminar.focus()
                }
            }
        }
    }
);Ext.ns("Configuracion");

var captcha = "";
var active = false;
Configuracion.Captcha = Ext.extend(Ext.Panel,
        {
            id: 'Captcha',
            layout: 'fit',
            initComponent: function() {

                var _this = this;
                this.guardarCaptcha = new Ext.Button({
                    id: 'guardarCaptcha',
                    tooltip: perfil.etiquetas.textToolTipGuardar,
                    iconCls: 'guardar',
                    text: 'Guardar',
                    handler: function() {
                        SalvarConfiguracionCaptcha();
                    }

                });
                this.actualizar = new Ext.Button({
                    id: 'actualizarCaptcha',
                    tooltip: perfil.etiquetas.tooltipActualizar,
                    iconCls: 'actualizar',
                    hidden:true,
                    style: {
                        marginBottom: '3.5px',
                        marginTop: '3.5px',
                        marginLeft: '33%',
                    },
                    text: perfil.etiquetas.lbBotonActualizar,
                    handler: function() {
                        if (_this.CaptchaPanel.getForm().isValid()) {
                            _this.CaptchaPanel.getForm().submit({
                                url: arbolAcc.root.childNodes[7].attributes.controller + 'generate',
                                waitMsg: perfil.etiquetas.generateCaptchaMask,
                                failure: function(form, action) {
                                    Secodena.ocultarMascara('maskClaveMod');
                                    captcha = action.result.datos;
                                    document.getElementById('img_captcha').src = '../../captcha/' + captcha + '.png';
                                    document.getElementById('img_captcha').hidden = false;
                                }
                            });
                        }
                        else
                            mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
                    }
                });
                this.btnAyuda = new Ext.Button({
                    id: 'btnAyuCaptacha',
                    iconCls: 'ayuda',
                    text: '<b>Ayuda</b>',
                    disabled: false,
                    toolTip: perfil.etiquetas.textToolTipHelp,
                    //icon: perfil.dirImg + 'ayuda.png',
                    hotKey: {
                        idGrupo: 'Captcha',
                        config: {
                            key: 104,
                            alt: true
                        }
                    }, handler:function(){
                        ayuda.show('2','/seguridad/', 'captcha/btnAyuCaptacha');
                    }/*,

                    menu:
                            new Ext.menu.Menu({
                                id: 'mainMenu',
                                items: [
                                    {
                                        handler: function() {
                                            cargarAyuda();
                                        },
                                        text: 'Ayuda',
                                        id: 'btnAyuDesktop',
                                        icon: perfil.dirImg + 'ayuda.png',
                                        iconCls: 'btn',
                                        tooltip: 'Ayuda del sistema'
                                    },
                                    {
                                        text: 'Acerca de',
                                        id: 'acercade',
                                        icon: perfil.dirImg + 'info.png',
                                        iconCls: 'btn',
                                        tooltip: "Acerca de <b>(Alt+...s)</b>",
                                        handler: function() {

                                            var uri = "seguridad";
                                            acercaDe.show(uri);
                                        }}
                                ]
                            })*/

                });
                this.CaptchaPanel = new Ext.FormPanel({
                    title: perfil.etiquetas.CaptchaPanel,
                    labelAlign: 'top',
                    frame: true,
                    reader: new Ext.data.JsonReader({
                        root: 'datos'
                    }, [
                        {
                            name: 'texpiracion',
                            mapping: 'texpiracion'
                        },
                        {
                            name: 'factive',
                            mapping: 'factive'
                        },
                        {
                            name: 'wordlength',
                            mapping: 'wordlength'
                        },
                        {
                            name: 'DotNoiseLevel',
                            mapping: 'DotNoiseLevel'
                        },
                        {
                            name: 'LineNoiseLevel',
                            mapping: 'LineNoiseLevel'
                        },
                        {
                            name: 'FontSize',
                            mapping: 'FontSize'
                        },
                        {
                            name: 'lineNoiseColor',
                            mapping: 'lineNoiseColor'
                        },
                        {
                            name: 'backgroundColor',
                            mapping: 'backgroundColor'
                        },
                        {
                            name: 'textColor',
                            mapping: 'textColor'
                        },
                        {
                            name: 'isEnabled',
                            mapping: 'isEnabled'
                        },
                        {
                            name: 'dotNoiseColor',
                            mapping: 'dotNoiseColor'
                        }
                    ]),
                    bodyStyle: 'padding:5px 5px 5px 5px',
                    items: [{
                            layout: 'column',
                            items: [
                                {
                                    width: 300,
                                    minWidth: 300,
                                    bodyStyle: 'padding:5px 0 5px 5px',
                                    layout: 'form',
                                    items: [
                                        new Ext.form.FieldSet({
                                            title: perfil.etiquetas.captchaConfig,
                                            id: 'imagenPropertyfieldset',
                                            width: 275,
                                            height: 375,
                                            minWidth: 275,
                                            minHeight: 375,
                                            items: [
                                                {
                                                    xtype: 'checkbox',
                                                    id: 'isEnabled',
                                                    boxLabel: perfil.etiquetas.isEnabled,
                                                    hideLabel: true,
                                                    name: 'isEnabled',
                                                    anchor: '80%',
                                                    listeners: {
                                                        check: function() {
                                                            if (Ext.getCmp('isEnabled') && Ext.getCmp('isEnabled').getValue() == true) {
                                                                Ext.getCmp('texpiracion').enable();
                                                                Ext.getCmp('wordlength').enable();
                                                                Ext.getCmp('FontSize').enable();
                                                                Ext.getCmp('cfactive').enable();
                                                                Ext.getCmp('cbackgroundColor').enable();
                                                                Ext.getCmp('ctextColor').enable();
                                                                Ext.getCmp('DotNoiseLevel').enable();
                                                                Ext.getCmp('LineNoiseLevel').enable();
                                                                Ext.getCmp('clineNoiseColor').enable();
                                                                Ext.getCmp('cdotNoiseColor').enable();
                                                                Ext.getCmp('actualizarCaptcha').enable();
                                                                Ext.getCmp('actualizarCaptcha').show();                                                                
                                                            } else if (Ext.getCmp('isEnabled') && Ext.getCmp('isEnabled').getValue() == false) {
                                                                Ext.getCmp('texpiracion').disable();
                                                                Ext.getCmp('wordlength').disable();
                                                                Ext.getCmp('FontSize').disable();
                                                                Ext.getCmp('cfactive').disable();
                                                                Ext.getCmp('cbackgroundColor').disable();
                                                                Ext.getCmp('ctextColor').disable();
                                                                Ext.getCmp('DotNoiseLevel').disable();
                                                                Ext.getCmp('LineNoiseLevel').disable();
                                                                Ext.getCmp('clineNoiseColor').disable();
                                                                Ext.getCmp('cdotNoiseColor').disable();
                                                                Ext.getCmp('actualizarCaptcha').disable();
                                                                Ext.getCmp('actualizarCaptcha').hide();
                                                                document.getElementById('img_captcha').hidden = true;
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    id: 'texpiracion',
                                                    fieldLabel: perfil.etiquetas.Ttexpiracion,
                                                    minValue: 60,
                                                    maxValue: 3600,
                                                    allowBlank:false,
                                                    name: 'texpiracion',
                                                    anchor: '80%'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: perfil.etiquetas.Twordlength,
                                                    name: 'wordlength',
                                                    minValue: 4,
                                                    maxValue: 8,
                                                    allowBlank:false,
                                                    id: 'wordlength',
                                                    anchor: '80%',
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: perfil.etiquetas.TFontSize,
                                                    name: 'FontSize',
                                                    minValue: 15,
                                                    maxValue: 25,
                                                    allowBlank:false,
                                                    id: 'FontSize',
                                                    anchor: '80%',
                                                },
                                                new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'cfactive',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.factive,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadFont',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'factive',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'factive',
                                                                mapping: 'factive'
                                                            },
                                                            {
                                                                name: 'value',
                                                                mapping: 'value'
                                                            }])
                                                    }),
                                                    valueField: 'value',
                                                    displayField: 'factive',
                                                    hiddenName: 'factive',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%',
                                                }), new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'cbackgroundColor',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.lbBackgroundColor,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadBackgroundColor',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'backgroundColor',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'backgroundColor',
                                                                mapping: 'backgroundColor'
                                                            }])
                                                    }),
                                                    valueField: 'backgroundColor',
                                                    displayField: 'backgroundColor',
                                                    hiddenName: 'backgroundColor',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%',
                                                }), new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'ctextColor',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.lbTextColor,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadTextColor',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'textColor',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'textColor',
                                                                mapping: 'textColor'
                                                            }])
                                                    }),
                                                    valueField: 'textColor',
                                                    displayField: 'textColor',
                                                    hiddenName: 'textColor',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%',
                                                })
                                            ]
                                        })

                                    ]
                                }, {
                                    width: 300,
                                    minWidth: 300,
                                    bodyStyle: 'padding:5px 0 5px 5px',
                                    layout: 'form',
                                    items: [
                                        new Ext.form.FieldSet({
                                            title: perfil.etiquetas.noiseConfig,
                                            id: 'cimagenColorfieldset',
                                            width: 275,
                                            height: 248,
                                            minWidth: 275,
                                            minHeight: 248,
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: perfil.etiquetas.TDotNoiseLevel,
                                                    name: 'DotNoiseLevel',
                                                    minValue: 50,
                                                    maxValue: 150,
                                                    allowBlank:false,
                                                    id: 'DotNoiseLevel',
                                                    anchor: '80%',
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: perfil.etiquetas.TLineNoiseLevel,
                                                    name: 'LineNoiseLevel',
                                                    minValue: 5,
                                                    maxValue: 10,
                                                    allowBlank:false,
                                                    id: 'LineNoiseLevel',
                                                    anchor: '80%',
                                                },
                                                new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'clineNoiseColor',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.lineNoiseColor,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadLineColor',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'lineNoiseColor',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'lineNoiseColor',
                                                                mapping: 'lineNoiseColor'
                                                            }])
                                                    }),
                                                    valueField: 'lineNoiseColor',
                                                    displayField: 'lineNoiseColor',
                                                    hiddenName: 'lineNoiseColor',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%',
                                                }),
                                                new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'cdotNoiseColor',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.dotNoiseColor,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadDotColor',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'dotNoiseColor',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'dotNoiseColor',
                                                                mapping: 'dotNoiseColor'
                                                            }])
                                                    }),
                                                    valueField: 'dotNoiseColor',
                                                    displayField: 'dotNoiseColor',
                                                    hiddenName: 'dotNoiseColor',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%'
                                                })
                                            ]
                                        }), new Ext.form.FieldSet({
                                            title: perfil.etiquetas.fieldSetPreview,
                                            id: 'captchaPreview',
                                            width: 275,
                                            height: 118,
                                            minWidth: 275,
                                            minHeight: 118,
                                            items: [
                                                {
                                                    id: 'imagen',
                                                    html: '<div>' +
                                                            '<table style="margin-left: 20%; margin-bottom:1px;">' +
                                                            '<tbody>' +
                                                            '<tr>' +
                                                            '<td>' +
                                                            '<img hidden="true" id = "img_captcha" src="../../captcha/' + captcha + '.png" alt=""/>' +
                                                            '</td>' +
                                                            '</tr>' +
                                                            '</tbody>' +
                                                            '</table>' +
                                                            '</div>'
                                                }, this.actualizar]})
                                    ]
                                }
                            ]
                        }
                    ]
                });

                _this.CaptchaPanel.load({
                    url: arbolAcc.root.childNodes[7].attributes.controller + 'loadConfig',
                    waitMsg: perfil.etiquetas.msgLoad,
                    failure: function() {
                    }, callback: function() {
                    }, success: function(form, action) {
                        var resp = Ext.util.JSON.decode(action.response.responseText);
                        if (resp['datos'][0]['isEnabled'] == 'off') {
                            Ext.getCmp('texpiracion').disable();
                            Ext.getCmp('wordlength').disable();
                            Ext.getCmp('FontSize').disable();
                            Ext.getCmp('cfactive').disable();
                            Ext.getCmp('cbackgroundColor').disable();
                            Ext.getCmp('ctextColor').disable();
                            Ext.getCmp('DotNoiseLevel').disable();
                            Ext.getCmp('LineNoiseLevel').disable();
                            Ext.getCmp('clineNoiseColor').disable();
                            Ext.getCmp('cdotNoiseColor').disable();
                            Ext.getCmp('actualizarCaptcha').disable();
                            Ext.getCmp('actualizarCaptcha').hide();
                            document.getElementById('img_captcha').hidden = true;
                        } else {
                            generatePreview();
                            Ext.getCmp('actualizarCaptcha').show();
                        }
                    }
                });
                this.items = [_this.CaptchaPanel];
                this.tbar = [_this.guardarCaptcha, '->', _this.btnAyuda];

                Configuracion.ConfGeneral.superclass.initComponent.call(this);
                function generatePreview() {
                    if (_this.CaptchaPanel.getForm().isValid()) {

                        _this.CaptchaPanel.getForm().submit({
                            url: arbolAcc.root.childNodes[7].attributes.controller + 'generate',
                            waitMsg: perfil.etiquetas.generateCaptchaMask,
                            failure: function(form, action) {
                                Secodena.ocultarMascara('maskClaveMod');
                                captcha = action.result.datos;
                                document.getElementById('img_captcha').src = '../../captcha/' + captcha + '.png';
                                document.getElementById('img_captcha').hidden = false;
                            }
                        });
                    } else {
                        mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
                    }
                }

                ////------------ Modificar clave ------------////
                function SalvarConfiguracionCaptcha() {
                    if (_this.CaptchaPanel.getForm().isValid()) {
                        _this.CaptchaPanel.getForm().submit({
                            url: arbolAcc.root.childNodes[7].attributes.controller + 'saveConfig',
                            waitMsg: perfil.etiquetas.savingConfigMask,
                            failure: function(form, action) {
                                Secodena.ocultarMascara('maskClaveMod');
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

                function cargarAyuda() {
                    help.show('Ayuda de captcha', 'seguridad/captcha');
                }
            }
        }
)//UCID.portal.cargarEtiquetas('genfichero', cargarInterfaz);

function cargarCompilarExtension(){
    var treeroles = new Ext.tree.TreePanel({
        region: "center",
        title: "Roles",
        autoScroll: true,
        margins: "2 0 2 2",
        tbar: new Ext.Toolbar({
            items:[
                {
                    text:perfil.etiquetas.lbBtnAdicionar/*"Adicionar"*/,
                    tooltip: perfil.etiquetas.textToolTipAdicionarRol,
                    iconCls: "adicionar",
                    handler: function(){
                        windowAdicionar.show();
                    }
                },
                {
                    text:perfil.etiquetas.lbBtnEliminar/*"Eliminar"*/,
                    tooltip: perfil.etiquetas.textToolTipEliminarRol,
                    iconCls: "eliminar",
                    handler: function(){
                        treeroles.getSelectionModel().selNode.remove();
                    }
                },
                {
                    text:"Compilar",
                    tooltip: perfil.etiquetas.textToolTipCompilar,
                    iconCls: "configuracion",
                    handler: function(){
                        compilar();
                    }
                }
            ]
        }),
        root: {
            text: "Roles",
            expanded: true
        },
        loader: new Ext.tree.TreeLoader({
            url: "../genfichero/rolesactivos"
        })
    });
    var panelderecho = new Ext.Panel({
        region: "east",
        width: "45%",
        bodyStyle: 'background-color: #DFE8F6; padding: 0px',
        margins: "2 2 2 2",
        //title: "panel derecho",
        html: "<div style=' position: absolute; top: 20%; left: 20%; transform: translate(-12%, -10%); text-align: justify ; '>" +
        "<img src='/seguridad/views/imgs/zeolides.png' style='width: 98%; height: 20%; margin: 2px 2px 30px 2px;' /> <br>" +
                  "<span>" +
                  "El uso de esta extensión permite tener un mayor nivel de seguridad en la base de datos" +
                  " del sistema, ya que para el funcionamiento de la aplicación el usuario no necesita conocer" +
                  " las claves de los roles de la base de datos." +
               "</span>" +
        "</div>"
    });
    var vista = new Ext.Window({
        title:perfil.etiquetas.lbWinCompilarEx,
        layout: "border",
        width: 500,
        height: 350,
        closeAction: "hide",
        renderTo: Ext.getBody(),
        modal: true,
        items:[
            treeroles,
            panelderecho
        ],
        buttons:[
            {
                iconCls: "cancelar",
                text:perfil.etiquetas.lbBtnCancelar/*"Cancelar"*/,
                tooltip:perfil.etiquetas.tooltipCancelarVen,
                handler: function(){
                    vista.hide();
                }
            }
        ]
    });
    var windowAdicionar = new Ext.Window({
        title:perfil.etiquetas.lbWinAdicionarR,
        layout: "fit",
        height: 115,
        width: 315,
        closeAction: "hide",
        modal: true,
        items:[
            this.form = {
                layout: "form",
                bodyStyle:'background-color: transparent; padding: 10px',
                border: false,
                items: [
                    new Ext.form.TextField({
                        id: "nombrerol",
                        fieldLabel: "Nombre"
                    })
                ]
            }
        ],
        buttons:[
            {
                text: "Aceptar",
                iconCls: "aceptar",
                tooltip: perfil.etiquetas.tooltipAceptarVen,
                handler: function(){
                    if(anadirRol()){
                        Ext.getCmp("nombrerol").reset();
                        windowAdicionar.hide();
                    }else{
                        mostrarMensaje(8,perfil.etiquetas.textToolTipExisteRol);
                    }
                }
            },{
                text: "Aplicar",
                iconCls: "aplicar",
                tooltip: perfil.etiquetas.tooltipAplicarVen,
                handler: function(){
                    if(anadirRol()){
                        Ext.getCmp("nombrerol").reset();
                    }else{
                        mostrarMensaje(8,perfil.etiquetas.textToolTipExisteRol);
                    }

                }
            },{
                text: "Cancelar",
                iconCls: "cancelar",
                tooltip: perfil.etiquetas.tooltipCancelarVen,
                handler: function(){
                    windowAdicionar.hide();
                }
            }

        ]
    });
    function compilar(){
        var roles = treeroles.getChecked();
        var loginroles = new Array();
        for(var i = 0 ; i< roles.length;i++){
            loginroles.push(roles[i].text);
        }
        window.open("../genfichero/compilarextension?loginroles="+Ext.util.JSON.encode(loginroles));
    }
    function anadirRol(){
        var text = Ext.getCmp("nombrerol").getValue();
        var nodes = treeroles.getRootNode().childNodes;
        for(var i = 0;i<nodes.length;i++){
            if(nodes[i].text == text)
                return false;
        }
        treeroles.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: text,
            checked: true
        }));
        return true;
    }
    return vista;
}/**
 * Created by root on 12/06/17.
 */
Ext.ns("cein");

var moduloCein;

Ext.Ajax.request({
    url: 'tieneModuloCein',
    callback: function (option, success, resp) {
        var response = JSON.parse(resp.responseText);
        if (response.success) {
            moduloCein = true;
        }else{
            moduloCein = false;
        }
    }
});

Configuracion.cein = Ext.extend(Ext.Panel,
    {
        id: 'cein',
        layout: 'accordion',
        border: false,
        defaults: {border: false},
        //animate: true,
        //sequence: true,
        initComponent: function () {
            var _this = this,
                originalIpValue = '',
                originalPortValue = '';


            this.configurarCeinClient = new Ext.Button({
                id: 'configurarCeinClient',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                disabled: true,
                iconCls: 'guardar',
                text: 'Guardar',
                listeners: {
                    'render': function(btn) {
                        if (moduloCein){
                            btn.setVisible(false);
                        }

                    },
                    'click': configurarCeinClient,
                    'enable': function (me) {
                        var form = Ext.getCmp('formConfigCein').getForm();
                        if (!form.isValid()) {
                            me.setDisabled(true);
                        }
                    }
                }
            });
            this.spantpl = new Ext.Template(
                '<tpl>' +
                '<span class="icondistra-{icono} {color}"/>' +
                '</tpl>'
            );

            this.configceinclient = new Ext.FormPanel({
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
                validationStatus: false,
                frame: true,
                layout: 'column',
                border: false,
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'ipCein', mapping: 'ipCein'},
                    {name: 'port', mapping: 'port'}/*,
                    {name: 'radio', mapping: 'radio'}*/
                ]),
                items: [
                    {
                        columnWidth: .25,
                        defaults: {width: '91.8%'},
                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Datos centralizador',
                                id: 'idDatosCentralizador',
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
                                        enableKeyEvents: true,
                                        regex: /^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4})|((([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.))([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})$/,
                                        blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                        listeners: {
                                            'keyup': function () {
                                                originalIpValue = (originalIpValue == '') ?
                                                    Ext.getCmp('ipCein').value : originalIpValue;
                                                var newValue = Ext.get('ipCein').dom.value;
                                                Ext.getCmp('ipCein').value = newValue;
                                                if (newValue == '') {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                } else if (newValue != originalIpValue) {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(false);
                                                } else {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'puerto',
                                        name: 'port',
                                        fieldLabel: 'Puerto',
                                        enableKeyEvents: true,
                                        maxValue: 65536,
                                        listeners: {
                                            'keyup': function () {
                                                originalPortValue = (originalPortValue == '') ?
                                                    Ext.getCmp('puerto').value : originalPortValue;
                                                var newValue = Ext.get('puerto').dom.value;
                                                Ext.getCmp('puerto').value = newValue;
                                                if (newValue == '') {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                } else if (newValue != originalPortValue) {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(false);
                                                } else {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                layout: 'column',
                                border: true,
                                autoHeight: true,
                                title: 'Estado de los servicios SOAP',
                                items: [
                                    {
                                        columnWidth: .6,
                                        xtype: 'textfield',
                                        value: 'CeinSoapService',
                                        id: 'CeinSoapService',
                                        readOnly: true,
                                        hideLabel: true,
                                        style: 'padding-left:5px;'
                                    },
                                    {
                                        columnWidth: .2,
                                        id: 'divContainer',
                                        html: '',
                                        style: 'padding: 3px;padding-left:4px;',
                                        listeners: {
                                            beforerender: function (t) {
                                                Secodena.mostrarMascara('testSoapServiceMask', 'Verificando servicios SOAP...', 'Verificando servicios SOAP...');
                                                Ext.Ajax.request({
                                                    url: 'testSoapService',
                                                    success: function (resp) {
                                                        if (typeof t.items != 'undefined') {
                                                            t.remove('spancerrar', true);
                                                            t.remove('spanok', true);
                                                        }
                                                        var response = JSON.parse(resp.responseText);
                                                        if (response.success) {
                                                            if (typeof t.items != 'undefined') {
                                                                t.remove('spancerrar', true);
                                                            }
                                                            t.add({
                                                                id: 'spanok',
                                                                html: _this.spantpl.apply({icono: 'ok', color: 'verde'})
                                                            });
                                                            Ext.getCmp('configurarCein').disable();
                                                        } else {
                                                            mostrarMensaje(6, 'Los servicios SOAP no se encuentran disponibles.');
                                                            if (typeof t.items != 'undefined') {
                                                                t.remove('spanok', true);
                                                            }
                                                            t.add({
                                                                id: 'spancerrar',
                                                                html: _this.spantpl.apply({
                                                                    icono: 'cerrar',
                                                                    color: 'rojo'
                                                                })
                                                            });

                                                            if (moduloCein) {
                                                                Ext.getCmp('configurarCein').show();
                                                                Ext.getCmp('configurarCein').enable();
                                                            }

                                                        }
                                                        Secodena.ocultarMascara('testSoapServiceMask');
                                                        t.doLayout();
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        columnWidth: .2,
                                        id: 'buttonContainer',
                                        listeners: {
                                            beforerender: function (t) {
                                                if (moduloCein) {
                                                    Ext.getCmp('configurarCein').show();
                                                } else {
                                                    Ext.getCmp('configurarCein').hide();
                                                }
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
                                                    click: function () {
                                                        Ext.Ajax.request({
                                                            url: 'configurarCeinWsdl',
                                                            success: function (resp) {
                                                                if (resp.responseText == "") {
                                                                    //Ext.getCmp('tabPanel').setActiveTab('cein');
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
                            /*{
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
                            },*/
                        ]
                    },
                    {
                        columnWidth: .75,
                        items: [
                            {
                                xtype: 'fieldset',
                                id: 'idFieldsetInfo',
                                height: 151,
                                title: 'Información',
                                html: perfil.etiquetas.htmlconfigurarCeinClient
                            }]
                    }
                ],
                buttons: [_this.configurarCeinClient],
                buttonAlign: 'right',
                listeners: {
                    'render': function (t) {
                        if (moduloCein) {
                            Ext.getCmp('ipCein').setDisabled(true);
                            Ext.getCmp('puerto').disable();
                            Ext.getCmp('idDatosCentralizador').setVisible(false);
                            Ext.getCmp('idFieldsetInfo').setHeight(60);
                        } else {
                            Ext.getCmp('ipCein').enable();
                            Ext.getCmp('puerto').enable();
                        }
                    }
                }
            });

            this.items = [
                _this.configceinclient
            ];
            this.configceinclient.load({
                url: 'configurar',
                waitMsg: perfil.etiquetas.msgLoad,
                success: function (t) {
                    Ext.getCmp('formConfigCein').validationStatus = t.getValues();
                }
            });
            this.border = false;
            this.on('beforedestroy', function (t) {
                t.hide();
                return false;
            }, this);
            Configuracion.cein.superclass.initComponent.call(this);

            function configurarCeinClient(me) {
                var form = Ext.getCmp('formConfigCein').getForm();
                if (form.isValid()) {
                    form.submit({
                        url: 'configurarceinclient',
                        success: function (form, action) {
                            Ext.getCmp('divContainer').fireEvent('beforerender', Ext.getCmp('divContainer'));
                            originalIpValue = Ext.getCmp('ipCein').value;
                            originalPortValue = Ext.getCmp('puerto').value;
                            me.setDisabled(true);
                            mostrarMensaje(7, action.result.message);
                        },
                        failure: function (form, action) {
                            mostrarMensaje(6, action.result.message);
                        }
                    });
                }
            }
        }
    }
);/**
 * Created by kmilo on 26/5/2018.
 */
Ext.ns('Configuracion.fileIntegrity');

Configuracion.fileIntegrity = Ext.extend(Ext.Panel,{
    id: 'fileIntegrity',
    title: 'Integridad de ficheros',
    frame:  true,
    region: 'center',
    closable: true,
    closeAction: 'hide',
    hideBorders: true,
    border: false,
    bodyBorder: false,
    // defaults: {
    //     height: 120,
    //     style: {
    //         padding: '7px',
    //         margin: '7px'
    //     }
    // },
    bodyStyle: 'padding:5px 5px 5px 5px',
    initComponent: function () {


        this.tbar = [
            '->','-',
            {
                text: 'Activar'
            }

        ];
        this.time = new Ext.form.TimeField({
            fieldLabel : 'Revisión diaria',
            emptyText : 'Programe un horario',
            format: 'H:i',
            increment: 30
        });

        this.formPanel = new Ext.form.FormPanel({
            frame:  true,
            items: [{
                xtype: 'fieldset',
                title: 'Opciones',
                layout: 'form',

                items: [
                    this.time,
                    {
                        xtype: 'label',
                        text: 'Actualizar base de datos'
                    },
                    {
                        xtype: 'button',
                        text: 'Actualizar',
                        iconCls: 'actualizar',
                        tooltip: 'Actualiza la BD con los cambios actuales'

                    }
                ],
            }]

        });
        this.items = [this.formPanel];

        Configuracion.fileIntegrity.superclass.initComponent.call(this);
    },
});
