UCID.portal.cargarEtiquetas('configcont', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar variables ------------////
var winIns, winMod, regServ, stCongContr;

////------------ Area de validaciones ------------////
var soloNumeros;
soloNumeros = /^[0-9]+$/;

function cargarInterfaz(perfil, etiquetas) {
    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        disabled: true,
        id: 'btnAgrClaves',
        hidden: true,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        prevTab: 'btnModClaves',
        text: etiquetas.lbBtnAdicionar,
        tooltip: etiquetas.textToolTipadicionar,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 105,
                alt: true
            }
        },
        handler: function () {
            if (btnAdicionar.disabled == false)
                winForm('Ins');
        }
    });

    btnModificar = new Ext.Button({
        disabled: true,
        id: 'btnModClaves',
        hidden: true,
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnModificar,
        nextTab: 'btnAyuClaves',
        tooltip: etiquetas.textToolTipMod,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 109,
                alt: true
            }
        },
        handler: function () {
            if (sm.getCount() >= 1)
                winForm('Mod');
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuClaves',
        iconCls: 'btn',
        nextTab: 'btnAgrClaves',
        text: '<b>Ayuda</b>',
        disabled: false,
        hotKey: {
            idGrupo: 'grid1',
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
    /**btnAyuda = new Ext.Button({
        id: 'btnAyuClaves',
        nextTab: 'btnAgrClaves',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.textToolTipHelp,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 104,
                alt: true
            }
        },
        handler: function () {
            cargarAyuda();
        }
    });*/

    UCID.portal.cargarAcciones(window.frameElement.id);

    ////------------ Store del Grid ------------////
    var stCongContr = new Ext.data.Store({
        url: 'cargarclaves',
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
                    name: 'idrestricclaveacceso',
                    mapping: 'idrestricclaveacceso'
                },
                {
                    name: 'signos',
                    mapping: 'signos'
                },

                {
                    name: 'diascaducidad',
                    mapping: 'diascaducidad'
                },

                {
                    name: 'minimocaracteres',
                    mapping: 'minimocaracteres'
                },

                {
                    name: 'numerica',
                    mapping: 'numerica'
                },

                {
                    name: 'alfabetica',
                    mapping: 'alfabetica'
                },

                {
                    name: 'historicoPass',
                    mapping: 'historicoPass'
                }
            ]),
        listeners: {
            load: function () {
                btnAdicionar.focus(200);
            }
        }
    });

    ////------------ Modo de seleccion del grid ------------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
        btnModificar.enable();

    }, this);


    stCongContr.on('load', mostrar);

    ////------------ Defino el grid de contraseñas ------------////
    var gpContr = new Ext.grid.GridPanel({
        title: etiquetas.titleGridClaves,
        cls: 'x-toolbar',
        border: false,
        frame: false,
        region: 'center',
        autoExpandColumn: 'expandir',
        store: stCongContr,
        sm: sm,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idrestricclaveacceso'
            },

            {
                id: 'expandir',
                header: etiquetas.lbTitDiasCaducidad,
                width: 200,
                dataIndex: 'diascaducidad'
            },

            {
                header: etiquetas.lbTitMinCaracteres,
                width: 150,
                dataIndex: 'minimocaracteres'
            },

            {
                id: 'expandir',
                header: etiquetas.lbFLHistoricoPass,
                width: 150,
                dataIndex: 'historicoPass'
            },

            {
                header: etiquetas.lbTitAlfabetico,
                width: 100,
                dataIndex: 'alfabetica'
            },

            {
                header: etiquetas.lbTitSignos,
                width: 100,
                dataIndex: 'signos'
            },

            {
                header: etiquetas.lbTitNumerico,
                width: 100,
                dataIndex: 'numerica'
            }
        ],
        loadMask: {
            store: stCongContr
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            id: 'ptbaux',
            store: stCongContr,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgbbarI,
            emptyMsg: etiquetas.lbMsgbbarII
        })
    });

    ////------------ Panel ------------////
    var panel = new Ext.Panel({
        layout: 'border',
        items: [gpContr],
        id: 'grid1',
        keyMapGroup: true,
        tbar: [btnAdicionar, btnModificar, '->', btnAyuda]
    });

    ////--------------Funciones usadas en las TC------------////
    panel.on('afterlayout', function () {
        panel.habilitarKeyMap();
    });

    function enfocarElemento() {
        panel.getTopToolbar().items.items[0].focus();
    }

    ////------------ Viewport ------------////
    var vpServidorAut = new Ext.Viewport({
        layout: 'fit',
        items: panel
    })
    stCongContr.load({
        params: {
            start: 0,
            limit: 15
        }
    });

    ////------------ Formulario ------------////
    var regUsuario = new Ext.FormPanel({
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
                            new Ext.form.FieldSet({
                                title: etiquetas.lbTitFieldSet,
                                id: 'filsetclaves',
                                width: 150,
                                autoHeight: true,
                                items: [
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: etiquetas.lbBLNumerico,
                                        id: 'numerica',
                                        hideLabel: true,
                                        name: 'numerica',
                                        anchor: '80%'
                                    },
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: etiquetas.lbBLAlfabetico,
                                        hideLabel: true,
                                        name: 'alfabetica',
                                        id: 'alfabetica',
                                        anchor: '80%'
                                    },
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: etiquetas.lbBLSignos,
                                        hideLabel: true,
                                        name: 'signos',
                                        id: 'signos',
                                        anchor: '80%'
                                    }
                                ]
                            })

                        ]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: etiquetas.lbFLMinCaracteres,
                                id: 'minimocaracteres',
                                name: 'minimocaracteres',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgBlank,
                                maxValue: 30,
                                minValue: 8,
                                anchor: '95%'
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: etiquetas.lbFLDiasCaducidad,
                                id: 'diascaducidad',
                                name: 'diascaducidad',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgBlank,
                                maxValue: 365,
                                minValue: 10,
                                anchor: '95%'
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: etiquetas.lbFLHistoricoPass,
                                id: 'historicoPass',
                                name: 'historicoPass',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgBlank,
                                maxValue: 10,
                                minValue: 1,
                                anchor: '95%'
                            }
                        ]
                    }
                ]
            }
        ]
    });

    //Cargar la ventana
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitVentanaTitI,
                        width: 400,
                        height: 230,
                        listeners: {
                            hide: function (w) {
                                panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCancelar,
                                tooltip: etiquetas.tooltipCancelarVen,
                                handler: function () {
                                    winIns.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                nextTab: 'minimocaracteres',
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    adicionarClave();
                                }
                            }
                        ]
                    });
                }
                regUsuario.getForm().reset();
                winIns.add(regUsuario);
                winIns.doLayout();
                winIns.show();
                Ext.getCmp('minimocaracteres').focus(false, 200);
            }
                break;
            case 'Mod':
            {
                if (!winMod) {
                    winMod = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: 'Modificar clave',
                        width: 400,
                        height: 230,
                        listeners: {
                            hide: function (w) {
                                panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCancelar,
                                tooltip: etiquetas.tooltipCancelarVen,
                                handler: function () {
                                    winMod.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                nextTab: 'minimocaracteres',
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    modificarClave();
                                }
                            }
                        ]
                    });
                }

                winMod.add(regUsuario);
                winMod.doLayout();
                winMod.show();
                regUsuario.getForm().loadRecord(sm.getSelected());
                Ext.getCmp('minimocaracteres').focus(false, 200);
            }
                break;

        }
    }

    ////------------ Adicionar clave ------------////
    function adicionarClave(apl) {
        if (regUsuario.getForm().isValid() && ValidaC()) {
            Secodena.mostrarMascara('maskClave', etiquetas.msgWait, etiquetas.msgAdd);
            regUsuario.getForm().submit({
                url: 'insertarclave',
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskClave');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        regUsuario.getForm().reset();
                        winIns.hide();
                        stCongContr.reload();
                        sm.clearSelections();
                        btnModificar.disable();

                    }
                    if (action.result.codMsg == 3) mostrarMensaje(action.result.codMsg, action.result.mensaje);

                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    ////------------ Modififcar clave ------------////
    function modificarClave() {
        if (regUsuario.getForm().isValid() && ValidaC()) {
            Secodena.mostrarMascara('maskClaveMod', etiquetas.msgWait, etiquetas.msgMod);
            regUsuario.getForm().submit({
                url: 'modificarclave',
                waitMsg: etiquetas.lbMsgFunModificarMsg,
                params: {
                    idrestricclaveacceso: sm.getSelected().data.idrestricclaveacceso
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskClaveMod');
                    if (action.result.codMsg == 2) {
                        mostrarMensaje(2, action.result.mensaje, function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                regUsuario.getForm().submit({
                                    url: 'modificarclave',
                                    waitMsg: etiquetas.lbMsgFunModificarMsg,
                                    params: {
                                        idrestricclaveacceso: sm.getSelected().data.idrestricclaveacceso,
                                        confirmar: true
                                    },
                                    failure: function (form, action) {
                                        Secodena.ocultarMascara('maskClaveMod');
                                        if (action.result.codMsg == 1) {
                                            mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                            stCongContr.reload();
                                            winMod.hide();
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
                        stCongContr.reload();
                        winMod.hide();
                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);

                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    ////------------ Funcion para validar  los checkbox ------------////
    function ValidaC() {
        if ((regUsuario.getComponent(0).getComponent(0).getComponent(0).getComponent(0).getValue() == false) && (regUsuario.getComponent(0).getComponent(0).getComponent(0).getComponent(1).getValue() == false) && (regUsuario.getComponent(0).getComponent(0).getComponent(0).getComponent(2).getValue() == false)) {
            mostrarMensaje(3, etiquetas.lbMsgFunValidaMsg)
            return false;
        }
        else return true;
    }

    ////------------ Funcion para validar boton adicionar si existe alguna clave ------------////
    function mostrar() {
        if (stCongContr.getCount() != 0)
            btnAdicionar.disable();
        else
            btnAdicionar.enable();

    }

    function cargarAyuda() {
        var title = 'Ayuda de la configuraci&oacute;n de la clave';
        var referencia = 'seguridad/configcont';
        help.show(title, referencia);
    }
}