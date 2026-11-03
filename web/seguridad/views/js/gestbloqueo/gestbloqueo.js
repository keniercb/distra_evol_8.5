UCID.portal.cargarEtiquetas('gestbloqueo', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declaración de variables  ------------////
var idsistema, gridUser = false, gridIP = false,
    tabsPanel, vpGestRol, Denominacion, DenominacionIP, stUsuario, stIP,
    btnAyuda, sm, smUser, responseData, buscarPress;

var esDirIP = /(^(2([0-4][0-9])|2(5[0-5]))|^([0-1]?[0-9]?[0-9]))\.(((2([0-4][0-9])|2(5[0-5]))|([0-1]?[0-9]?[0-9]))\.){2}((2([0-4][0-9])|2(5[0-5]))|([0-1]?[0-9]?[0-9]))$/;

function cargarInterfaz(perfil, etiquetas) {
    var _this = this;

    ////---------- Botones ----------////
    this.btnDesbloqueo = new Ext.Button({
        //icon: perfil.dirImg + 'desbloquear.png',
        iconCls: 'desbloquear',
        id: 'btnDesbloqueoUser',
        disabled: true,
        nextTab: 'ayudaDesbloqueoUser',
        prevTab: 'btnBuscarUser',
        text: perfil.etiquetas.lbBtnDesbloquear,
        tooltip: perfil.etiquetas.toolTipDesbloquearUser,
        //hotKey: {
        //    idGrupo: 'Paneluser',
        //    config: {
        //        key: 113,
        //        alt: true
        //    }
        //},
        handler: function () {
            Desbloquear()
        }
    });

    this.btnDesbloqueoIP = new Ext.Button({
        //icon: perfil.dirImg + 'desbloquear.png',
        iconCls: 'desbloquear',
        id: 'btnDesbloqueoIP',
        disabled: true,
        nextTab: 'ayudaDesbloqueoIP',
        prevTab: 'btnBuscarIP',
        text: perfil.etiquetas.lbBtnDesbloquear,
        tooltip: perfil.etiquetas.toolTipDesbloquearIP,
        //hotKey: {
        //    idGrupo: 'PanelIp',
        //    config: {
        //        key: 113,
        //        alt: true
        //    }
        //},
        handler: function () {
            DesbloquearIP()
        }
    });
    this.btnAyuda = new Ext.Button({
        id: 'ayudaDesbloqueoUser',
        iconCls: 'ayuda',
        text: '<b>' + etiquetas.lbBtnAyuda + '</b>',
        prevTab: 'btnDesbloqueoUser',
        nextTab: 'btnClearField',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,
        //icon: perfil.dirImg + 'ayuda.png',
        //hotKey: {
        //    idGrupo: 'grid1',
        //    config: {
        //        key: 104,
        //        alt: true
        //    }
        //},
        menu: new Ext.menu.Menu({
            id: 'mainMenu',
            items: [
                {
                    handler: function () {
                        cargarAyuda();
                    }, text: etiquetas.lbBtnAyuda,
                    id: 'btnAyuDesktop',
                    //icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'ayuda',
                    tooltip: etiquetas.tooltipAyuda
                },
                {
                    text: etiquetas.lbBtnAcercaDe,
                    id: 'acercade',
                    //icon: perfil.dirImg  + 'info.png',
                    iconCls: 'info',
                    tooltip: etiquetas.lbBtnAcercaDe + " <b>(Alt+...s)</b>",
                    handler: function () {

                        var uri = "seguridad";
                        acercaDe.show(uri);
                    }
                }
            ]
        })

    });
    /**this.btnAyuda = new Ext.Button({
        id: 'ayudaDesbloqueoUser',
        iconCls: 'ayuda',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.textToolTipHelp,
        prevTab: 'btnDesbloqueoUser',
        nextTab: 'btnClearField',
        hotKey: {
            idGrupo: 'Paneluser',
            config: {
                key: 104,
                alt: true
            }
        },
        handler: function () {
            cargarAyuda()
        }
    });*/
    this.btnAyudaIP = new Ext.Button({
        id: 'ayudaDesbloqueoIP',
        iconCls: 'ayuda',
        text: '<b>Ayuda</b>',
        nextTab: 'btnClearIP',
        prevTab: 'btnDesbloqueoIP',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,
        icon: perfil.dirImg + 'ayuda.png',
        //hotKey: {
        //    idGrupo: 'PanelIp',
        //    config: {
        //        key: 104,
        //        alt: true
        //    }
        //},
        menu:
            new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function () {
                            help.show('Ayuda de roles', 'seguridad/desbloqueo');
                        }, text: 'Ayuda',
                        id: 'btnAyuDesktop',
                        // icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'ayuda',
                        tooltip: 'Ayuda del sistema'
                    },
                    {
                        text: 'Acerca de',
                        id: 'acercade',
                        //icon: perfil.dirImg  + 'info.png',
                        iconCls: 'info',
                        tooltip: "Acerca de <b>(Alt+...s)</b>",
                        handler: function () {

                            var uri = "seguridad";
                            acercaDe.show(uri);
                        }
                    }
                ]
            })

    });
    /**this.btnAyudaIP = new Ext.Button({
        id: 'ayudaDesbloqueoIP',
        iconCls: 'ayuda',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.textToolTipHelp,
        nextTab: 'btnClearIP',
        prevTab: 'btnDesbloqueoIP',
        hotKey: {
            idGrupo: 'PanelIp',
            config: {
                key: 104,
                alt: true
            }
        },
        handler: function () {
            help.show('Ayuda de roles', 'seguridad/desbloqueo');
        }
    });*/

    //UCID.portal.cargarAcciones(window.frameElement.id);

    ////------------- Store del Grid de Usuario -------------- ////
    stUsuario = new Ext.data.Store({
        url: "cargar",
        id: "user",
        baseParams: {
            type: "user"
        },
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "idstore"
            },
            [
                {
                    name: 'idbloqueo',
                    mapping: 'idbloqueo'
                },
                {
                    name: 'fecha',
                    mapping: 'fecha'
                },
                {
                    name: 'hora',
                    mapping: 'hora'
                },
                {
                    name: 'intentos',
                    mapping: 'intento'
                },
                {
                    name: 'usuario',
                    mapping: 'usuario'
                },
                {
                    name: 'ip',
                    mapping: 'ip'
                }
            ]
        ),
        listeners: {
            load: function () {
                _this.btnDesbloqueo.disable();
                if (stUsuario.getCount() == 0) {
                    if (buscarPress) {
                        Zeolides.Utils.NotificationBox.show(perfil.etiquetas.msgInfDatosMostrar);
                        buscarPress = false;
                    } else {
                        Zeolides.Utils.NotificationBox.show(perfil.etiquetas.msgInfDatos);
                    }
                }
            }
        }
    });

    ////------------- Store del Grid de IP -------------- ////
    stIP = new Ext.data.Store({
        url: "cargar",
        id: "ip",
        baseParams: {
            type: "ip"
        },
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "idip"
            },
            [
                {
                    name: 'idip'
                },
                {
                    name: 'ip'
                }
            ]),
        listeners: {
            load: function () {
                if (stIP.getCount() == 0) {
                    if (buscarPress) {
                        Zeolides.Utils.NotificationBox.show(perfil.etiquetas.msgInfDatosMostrar);
                        buscarPress = false;
                    } else {
                        Zeolides.Utils.NotificationBox.show(perfil.etiquetas.msgInfDatos);
                    }
                }
            }
        }
    });

    ////------------ Establezco modo de selección de los gridPanels ---------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    sm.on('rowselect', function () {
        _this.btnDesbloqueoIP.enable();
    }, this);

    sm.on('rowdeselect', function (smodel) {
        if (smodel.hasSelection() == false) {
            _this.btnDesbloqueoIP.disable();
        }
    }, this);

    smUser = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    smUser.on('rowselect', function () {
        _this.btnDesbloqueo.enable();
    }, this);

    smUser.on('rowdeselect', function (smodel) {
        if (smodel.hasSelection() == false) {
            _this.btnDesbloqueo.disable();
        }
    }, this);

    ////---------- Defino el grid de Usuario ----------////
    var gpUser = new Ext.grid.GridPanel({
        title: perfil.etiquetas.titleGridUser,
        cls: 'x-toolbar',
        border: false,
        frame: false,
        region: 'center',
        autoExpandColumn: 'expandir',
        store: stUsuario,
        sm: smUser,
        id: 'gpUser',
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idbloqueo'
            },
            {
                id: 'expandir',
                header: perfil.etiquetas.lbUsuario,
                width: 200,
                dataIndex: 'usuario',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbFecha,
                width: 200,
                dataIndex: 'fecha',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbHora,
                width: 200,
                dataIndex: 'hora',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbIpOrigen,
                width: 200,
                dataIndex: 'ip',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbIntentos,
                width: 200,
                dataIndex: 'intentos',
                sortable: true
            }
        ],
        loadMask: {
            store: stUsuario
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            beforePageText: etiquetas.textPagina,
            afterPageText: etiquetas.textDe,
            store: stUsuario,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
        })
    });

    ////---------- Defino el grid de IP ----------////
    var gpIP = new Ext.grid.GridPanel({
        title: perfil.etiquetas.titleGridIp,
        cls: 'x-toolbar',
        border: false,
        frame: false,
        region: 'center',
        autoExpandColumn: 'expandir',
        store: stIP,
        id: 'gpIP',
        sm: sm,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idip'
            },
            {
                id: 'expandir',
                header: perfil.etiquetas.lbIP,
                dataIndex: 'ip',
                sortable: true
            }
        ],
        loadMask: {
            store: stIP
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: stIP,
            beforePageText: etiquetas.textPagina,
            afterPageText: etiquetas.textDe,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
        })
    });

    ////---------- Componentes del filtro de búsqueda ----------////
    Denominacion = new Ext.form.TextField({
        fieldLabel: perfil.etiquetas.lbDenominacion,
        emptyText: perfil.etiquetas.emptytext,
        anchor: "98%",
        width: 150,
        maxLength: 60,
        colWidth: .3,
        maxLength: 60,
        vtype: 'vtnombre',
        id: 'denomUser'
    });

    DenominacionIP = new Ext.form.TextField({
        fieldLabel: perfil.etiquetas.lbIP,
        emptyText: perfil.etiquetas.emptytext,
        anchor: "98%",
        width: 150,
        colWidth: .3,
        maxLength: 15,
        id: 'denomIP',
        vtype: 'vtdirip'
        //regex: /^(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/  ,
        //regexText: 'Debe introducir una direcci&oacute;n v&aacute;lida.'
    });

    var btnBuscar = new Ext.Button({
        id: 'btnBuscarUser',
        nextTab: 'btnClearField',
        prevTab: 'ayudaDesbloqueoUser',
        iconCls: 'buscar',
        text: etiquetas.lbBtnBuscar,
        tooltip: perfil.etiquetas.ToolTipSearch,
        //hotKey: {
        //    idGrupo: 'Paneluser',
        //    config: {
        //        key: 98,
        //        alt: true
        //    }
        //},
        handler: function () {
            buscarPress = true;
            buscar(Denominacion.getValue());
            _this.btnDesbloqueo.disable();
            PanelUser.getTopToolbar().items.items[0].focus()
        }
    });

    var btnClear = new Ext.Button({
        id: 'btnClearField',
        nextTab: 'ayudaDesbloqueoUser',
        prevTab: 'btnBuscarUser',
        iconCls: 'limpiar',
        text: etiquetas.denomLimpiar,
        tooltip: etiquetas.cleanFilter,
        //hotKey: {
        //    idGrupo: 'Paneluser',
        //    config: {
        //        key: 108,
        //        alt: true
        //    }
        //},
        handler: function () {
            Denominacion.reset();
            stUsuario.baseParams = {
                type: stUsuario.id
            }
            stUsuario.reload({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            _this.btnDesbloqueo.disable();
            PanelUser.getTopToolbar().items.items[0].focus()
        }
    });

    var fpFiltro = new Ext.ToolBar.searchToolBar({
        id: 'filtroUser',
        region: 'north',
        elementos: [Denominacion],
        botones: [btnBuscar, btnClear]
    });

    var btnBuscarIP = new Ext.Button({
        id: 'btnBuscarIP',
        nextTab: 'btnDesbloqueoIP',
        prevTab: 'btnClearIP',
        iconCls: 'buscar',
        text: etiquetas.lbBtnBuscar,
        tooltip: etiquetas.ToolTipSearchIP,
        //hotKey: {
        //    idGrupo: 'PanelIp',
        //    config: {
        //        key: 98,
        //        alt: true
        //    }
        //},
        handler: function () {
            buscarPress = true;
            buscar(DenominacionIP.getValue(), true);
            _this.btnDesbloqueoIP.disable();
            PanelIP.getTopToolbar().items.items[0].focus()
        }
    });

    var btnClearIP = new Ext.Button({
        id: 'btnClearIP',
        nextTab: 'btnBuscarIP',
        prevTab: 'ayudaDesbloqueoIP',
        iconCls: 'limpiar',
        text: perfil.etiquetas.denomLimpiar,
        tooltip: perfil.etiquetas.cleanFilter,
        //hotKey: {
        //    idGrupo: 'PanelIp',
        //    config: {
        //        key: 108,
        //        alt: true
        //    }
        //},
        handler: function () {
            DenominacionIP.reset();
            stIP.baseParams = {
                type: stIP.id
            }
            stIP.reload({
                params: {
                    start: 0,
                    limit: 15
                }
            });
        }
    });

    var fpFiltroIP = new Ext.ToolBar.searchToolBar({
        id: 'searchtb',
        region: 'north',
        elementos: [DenominacionIP],
        botones: [btnBuscarIP, btnClearIP]
    });

    ////---------- Panel de Usuario ----------////
    var PanelUser = new Ext.Panel({
        title: perfil.etiquetas.lbUsuario,
        layout: 'border',
        items: [gpUser],
        id: 'Paneluser',
        //keyMapGroup: true,
        tbar: [_this.btnDesbloqueo, '->', _this.btnAyuda],
        listeners: {
            afterlayout: function () {
                setTimeout(function () {
                    Ext.getCmp('btnBuscarUser').focus();
                    //PanelUser.habilitarKeyMap();
                })
            },
            activate: function () {
                stUsuario.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
                PanelUser.getTopToolbar().items.items[0].focus();
            }
        }
    });

    ////---------- Panel de IP ----------////
    var PanelIP = new Ext.Panel({
        title: perfil.etiquetas.lbIP,
        layout: 'border',
        items: [fpFiltroIP, gpIP],
        id: 'PanelIp',
        tbar: [_this.btnDesbloqueoIP, '->', _this.btnAyudaIP],
        listeners: {
            activate: function () {
                _this.btnDesbloqueoIP.disable();
                stIP.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
                Ext.getCmp('btnBuscarIP').focus();
                //PanelUser.habilitarKeyMap();
            }
        }
    });

    tabsPanel = new Ext.TabPanel({
        activeTab: 0,
        frame: true,
        items: [PanelUser, PanelIP]

    });

    ////---------- Viewport ----------////
    vpGestRol = new Ext.Viewport({
        layout: 'fit',
        items: tabsPanel
    });

    ////---------- Funciones ----------////

    function buscar(criterio, type) {
        if (type) {
            if (Ext.getCmp('denomIP').validate() == true) {
                gridIP = true;
                stIP.baseParams = {
                    type: stIP.id,
                    buscar: criterio
                }
                stIP.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
            }
            else
                mostrarMensaje(1, perfil.etiquetas.lbMsgErrorEnCamops)
        }
        else {
            if (Ext.getCmp('denomUser').validate() == true) {
                gridUser = true;
                stUsuario.baseParams = {
                    type: stUsuario.id,
                    buscar: criterio
                }
                stUsuario.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
            }
            else
                mostrarMensaje(1, perfil.etiquetas.lbMsgErrorEnCamops)
        }
    }

    function Desbloquear() {
        var arrSelect = smUser.getSelections();
        var arrSelectIDs = [];
        for (var i = 0; i < arrSelect.length; i++)
            arrSelectIDs.push(arrSelect[i].data.idbloqueo);
        Zeolides.Utils.MessageBox.show(2, perfil.etiquetas.confirmationMsg, desbloquea);

        function desbloquea(btnPresionado) {
            if (btnPresionado == 'ok') {
                Secodena.mostrarMascara('maskExpresionDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDesbloqueo);
                Ext.Ajax.request({
                    url: 'actualizar',
                    method: 'POST',
                    params: {
                        ArrayDel: Ext.encode(arrSelectIDs),
                        type: stUsuario.id
                    },
                    callback: function (options, success, response) {
                        Secodena.ocultarMascara('maskExpresionDel');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            //Zeolides.Utils.MessageBox.show(responseData.codMsg, responseData.mensaje, function (btnOK) {
                            //if (btnOK == 'ok') {
                            stUsuario.reload({
                                params: {
                                    start: 0,
                                    limit: 15
                                }
                            });
                            smUser.clearSelections();
                            _this.btnDesbloqueo.disable()
                            // }
                            //})
                        }
                        if (responseData.codMsg == 3)
                            Zeolides.Utils.MessageBox.show(responseData.codMsg, responseData.mensaje, _this.btnDesbloqueo.focus());
                    }
                });
            }
            if (btnPresionado != 'ok') {
                PanelUser.getTopToolbar().items.items[0].focus()
            }
        }
    }

    function DesbloquearIP() {
        var arrSelectIP = sm.getSelections();
        var arrSelectIpIDs = [];
        for (var i = 0; i < arrSelectIP.length; i++)
            arrSelectIpIDs.push(arrSelectIP[i].data.idbloqueo);
        Zeolides.Utils.MessageBox.show(2, perfil.etiquetas.confirmationMsgIP, desbloquea);

        function desbloquea(btnPresionado) {
            if (btnPresionado == 'ok') {
                Secodena.mostrarMascara('maskExpresionDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDesbloqueoIP);
                Ext.Ajax.request({
                    url: 'actualizar',
                    method: 'POST',
                    params: {
                        ArrayDel: Ext.encode(arrSelectIpIDs),
                        type: stIP.id
                    },
                    callback: function (options, success, response) {
                        Secodena.ocultarMascara('maskExpresionDel');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            //Zeolides.Utils.MessageBox.show(responseData.codMsg, responseData.mensaje, function (btnOK) {
                            //  if (btnOK == 'ok') {
                            stIP.reload({
                                params: {
                                    start: 0,
                                    limit: 15
                                }
                            });
                            sm.clearSelections();
                            _this.btnDesbloqueoIP.disable()
                            //}
                            //})
                        }
                        if (responseData.codMsg == 3) Zeolides.Utils.MessageBox.show(responseData.codMsg, responseData.mensaje, _this.btnDesbloqueoIP.focus());
                    }
                });
            }
            if (btnPresionado != 'ok') {
                PanelIP.getTopToolbar().items.items[0].focus()
            }
        }
    }

    function cargarAyuda() {
        var title = 'Ayuda de Desbloqueo';
        var referencia = 'seguridad/desbloqueo';
        help.show(title, referencia);
    }

    Ext.getCmp('searchtb').addListener('render', function () {
        Ext.getCmp('searchtb').autoScroll = false;
    });
}