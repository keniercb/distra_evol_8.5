UCID.portal.cargarEtiquetas('configuracion', cargarInterfaz);
Ext.ns('Configuracion');

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar Variables ------------////
var winIns, winMod, idfuncionalidad, ConfGeneral, referencia, vpGestSistema;
var arbolAcc, Dominio, Server, Languages, Temas, Escritorio, Expresiones, Captcha, extension, ceincont, integridad;

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
                if(node.attributes.text == "Integridad") {
                    if (integridad) {
                        _this.tabPanel.add(integridad);
                        integridad.show();
                        Ext.getCmp('divContainer').fireEvent('beforerender', Ext.getCmp('divContainer'));
                        _this.tabPanel.setActiveTab(integridad.id);
                    } else {
                        integridad = new Configuracion.Integridad({
                            title: 'Integridad',
                            region: 'center',
                            closable: true,
                            closeAction: 'hide',
                            etiquetas: perfil.etiquetas,
                            listeners: {
                                'destroy': function () {
                                    integridad = false
                                }
                            }
                        });
                        _this.tabPanel.add(integridad);
                        _this.tabPanel.setActiveTab(integridad.id);
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
}