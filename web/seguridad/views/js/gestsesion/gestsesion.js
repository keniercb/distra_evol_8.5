UCID.portal.cargarEtiquetas('gestsesion', cargarInterfaz);

Ext.isDefined = function (v) {
    return typeof v !== 'undefined';
};

Ext.override(Ext.data.Store, {
    findExact: function (property, value, start) {
        return this.data.findIndexBy(function (rec) {
            return rec.get(property) === value;
        }, this, start);
    }
});

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declaración de variables  ------------////
var idsistema, mostrarRecord, vpGestRol, responseData;

function cargarInterfaz(perfil, etiquetas) {
    var _this = this;

    this.btnSearch = new Ext.Button({
        id: 'btnSearch',
        iconCls: 'buscar',
        text: '<U>B</U>uscar',
        tooltip: 'Buscar sesion(es) <b>(Ctrl+B)</b>',
        handler: function () {
            ExecFilter();
        }
    });

    this.btnClean = new Ext.Button({
        id: 'btnClean',
        iconCls: 'limpiar',
        text: '<U>L</U>impiar',
        tooltip: 'Limpiar filtro(s) <b>(Ctrl+L)</b>',
        handler: function () {
            CleanFilters();
        }
    });

    this.fechaInicio = new Ext.form.DateField({
        id: 'fechainicio',
        fieldLabel: 'Fecha inicio',
        vtype: 'daterange',
        anchor: "95%",
        colWidth: .108,
        emptyText: '[-Seleccione-]',
        maxValue: new Date(),
        readOnly: true,
        format: 'd/m/Y'
    });

    var fecha = new Date();
    this.fechaFin = new Ext.form.DateField({
        id: 'fechafin',
        fieldLabel: 'Fecha fin',
        vtype: 'daterange',
        anchor: "95%",
        colWidth: .108,
        emptyText: '[-Seleccione-]',
        maxValue: new Date(fecha.setSeconds(86400)),
        readOnly: true,
        format: 'd/m/Y'
    });

    this.stComboUsuario = new Ext.data.JsonStore({
        url: 'cargarUsuarios',
        root: "usuarios",
        autoLoad: true,
        fields: [
            {name: 'usuario', mapping: 'usuario'}
        ]
    });

    this.comboUsuario = new Ext.ux.form.CheckboxCombo({
        id: 'comboUsuario',
        emptyText: '[-Seleccione-]',
        fieldLabel: 'Usuario',
        labelAlign: 'top',
        colWidth: .3,
        editable: false,
        disabled: false,
        loadingText: 'Cargando...',
        store: _this.stComboUsuario,
        valueField: 'usuario',
        displayField: 'usuario',
        mode: 'local',
        anchor: '95%',
        listeners: {
            'change': function (cmb, arr) {
            }
        }
    });

    this.stComboIp = new Ext.data.JsonStore({
        url: 'cargarIP',
        root: "ips",
        autoLoad: true,
        fields: [
            {name: 'ip', mapping: 'ip'}
        ]
    });

    this.comboIP = new Ext.ux.form.CheckboxCombo({
        id: 'comboIp',
        emptyText: '[-Seleccione-]',
        fieldLabel: 'IP',
        editable: false,
        disabled: false,
        labelAlign: 'top',
        colWidth: .3,
        loadingText: 'Cargando...',
        store: _this.stComboIp,
        valueField: 'ip',
        displayField: 'ip',
        mode: 'local',
        anchor: '95%',
        listeners: {
            'change': function (cmb, arr) {
            }
        }
    });

    this.searchtoolbar = new Ext.ToolBar.searchToolBar({
        id: 'searchtoolbar',
        elementos: [_this.fechaInicio, _this.fechaFin, _this.comboUsuario, _this.comboIP],
        botones: [_this.btnSearch, _this.btnClean],
        listeners: {
            render: function () {
                var scroll = Ext.query('*', Ext.get('searchtoolbar').dom);
                Ext.get(scroll[7].id).addClass('unscrollable');
            }
        }
    });

    ////---------- Botones ----------////
    this.btnEliminar = new Ext.Button({
        id: 'btnEliminar',
        disabled: true,
        iconCls: 'eliminar',
        nextTab: 'ayudaSesion',
        text: perfil.etiquetas.lbBtnEliminar,
        tooltip: perfil.etiquetas.toolTipEliminar,
        hotKey: {
            idGrupo: 'Panelsesion',
            config: {
                key: Ext.EventObject.DELETE
            }
        },
        handler: function () {
            Eliminar()
        }
    });
    this.btnAyuda = new Ext.Button({
        text: 'Ayuda',
        iconCls: "ayuda",
        tooltip: 'Ayuda',
        name: 'ayudaSesion',
        id: 'ayudaSesion',
        //disabled: false,
        //toolTip: etiquetas.textToolTipHelp,
        prevTab: 'btnDesbloqueoUser',
        nextTab: 'btnClearField',
        hotKey: {
            idGrupo: 'Panelsesion',
            config: {
                key: 104,
                alt: true
            }
        }//,
        //icon: perfil.dirImg + 'ayuda.png',
        //menu: new Ext.menu.Menu({
        //    id: 'mainMenu',
        //    items: [
        //        {
        //            handler: function () {
        //                help.show('Ayuda sobre la gestión de sesiones', 'seguridad/adminsesion')
        //            }, text: etiquetas.lbBtnAyuda,
        //            id: 'btnAyuRel',
        //            icon: perfil.dirImg + 'ayuda.png',
        //            iconCls: 'btn',
        //            tooltip: etiquetas.tooltipAyuda
        //        },
        //        {
        //            text: etiquetas.lbBtnACercaDe,
        //            id: 'acercade',
        //            icon: perfil.dirImg + 'info.png',
        //            iconCls: 'btn',
        //            tooltip: etiquetas.lbBtnACercaDe+" <b>(Alt+...s)</b>",
        //            handler: function () {
        //
        //                var uri = "seguridad";
        //                acercaDe.show(uri);
        //            }}
        //    ]
        //})

    });
    /**this.btnAyuda = new Ext.Button({
        id: 'ayudaSesion',
        iconCls: 'ayuda',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.textToolTipHelp,
        prevTab: 'btnDesbloqueoUser',
        nextTab: 'btnClearField',
        hotKey: {
            idGrupo: 'Panelsesion',
            config: {
                key: 104,
                alt: true
            }
        },
        handler: function () {
            help.show('Ayuda sobre la gestión de sesiones', 'seguridad/adminsesion')
        }
    });*/

    UCID.portal.cargarAcciones(window.frameElement.id);

    ////------------- Store del Grid de Usuario -------------- ////
    this.store = new Ext.data.Store({
        url: 'cargarSesion',
        id: 'user',
        reader: new Ext.data.JsonReader({
                totalProperty: "total_filas",
                root: "datos",
                id: "idstore"
            },
            [
                {name: 'idsession'},
                {name: 'fecha'},
                {name: 'hora'},
                {name: 'usuario'},
                {name: 'ip'},
                {name: 'sessionid'}
            ]
        ),
        listeners: {
            beforeload: function (st, options) {
                options.params.params = Ext.util.JSON.encode({
                    fechainicio: Ext.getCmp('fechainicio').getRawValue(),
                    fechafin: Ext.getCmp('fechafin').getRawValue(),
                    usuario: Ext.getCmp('comboUsuario').getValue(),
                    ip: Ext.getCmp('comboIp').getValue()

                });
            },
            load: function () {
                if (_this.store.getCount() === 0)
                    Ext.Msg.show({
                        title: perfil.etiquetas.msgInf,
                        msg: perfil.etiquetas.msgInfDatos,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO
                    })
            }
        }
    });

    ////------------ Establezco modo de selección de los gridPanels ---------////
    this.sm = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    this.sm.on('rowselect', function (sm, rowIndex, record) {
        _this.btnEliminar.enable();
        mostrarRecord = record
    }, this);

    this.sm.on('rowdeselect', function (smodel) {
        if (!smodel.hasSelection()) {
            _this.btnEliminar.disable();
        }
    }, this);

    ////---------- Defino el grid de Usuario ----------////
    this.grid = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbAdminSesion,
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
                dataIndex: 'idsession'
            },
            {
                header: perfil.etiquetas.lbUsuario,
                width: 200,
                dataIndex: 'usuario',
                sortable: true
            },
            {
                id: 'expandir',
                header: perfil.etiquetas.lbSesionID,
                dataIndex: 'sessionid',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbFecha,
                width: 150,
                dataIndex: 'fecha',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbHora,
                width: 150,
                dataIndex: 'hora',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbIP,
                width: 150,
                dataIndex: 'ip',
                sortable: true
            }
        ],
        loadMask: {
            store: _this.store
        },
        bbar: new Ext.PagingToolbar({

            beforePageText: etiquetas.textPagina,
            afterPageText: etiquetas.textDe,
            store: _this.store,
            displayInfo: true
        })
    });

    ////---------- Panel de Usuario ----------////
    var PanelSesion = new Ext.Panel({
        layout: 'border',
        items: [_this.searchtoolbar, _this.grid],
        id: 'Panelsesion',
        keyMapGroup: true,
        tbar: [_this.btnEliminar, '->', _this.btnAyuda],
        keys: [
            {
                key: 'b',
                ctrl: true,
                fn: function (e, a) {
                    a.browserEvent.preventDefault();
                    ExecFilter();
                }
            },
            {
                key: 'l',
                ctrl: true,
                fn: function (e, a) {
                    a.browserEvent.preventDefault();
                    CleanFilters();
                }
            }
        ],
        listeners: {
            afterlayout: function () {
                setTimeout(function () {
                    PanelSesion.getTopToolbar().items.items[0].focus();
                    PanelSesion.habilitarKeyMap();
                }, 1000)
            }
        }
    });

    this.store.load({
        params: {
            start: 0,
            limit: 15
        }
    });


    ////---------- Viewport ----------////
    vpGestRol = new Ext.Viewport({
        layout: 'fit',
        items: PanelSesion
    });

    function Eliminar() {
        var sessionIds = [];
        _this.sm.getSelections().forEach(function (item) {
            sessionIds.push(item.get('idsession'));
        });
        mostrarMensaje(2, perfil.etiquetas.confirmationMsg, elimina);

        function elimina(btnPresionado) {
            if (btnPresionado === 'ok') {
                Secodena.mostrarMascara('maskExpresionDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'eliminar',
                    method: 'POST',
                    params: {
                        sessionIds: Ext.encode(sessionIds)
                    },
                    callback: function (options, success, response) {
                        Secodena.ocultarMascara('maskExpresionDel');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg === 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            if (btnPresionado === 'ok') {
                                {
                                    _this.store.reload({
                                        params: {
                                            start: 0,
                                            limit: 15
                                        }
                                    });
                                    _this.sm.clearSelections();
                                }
                            }
                        }
                        if (responseData.codMsg === 3) mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    }
                });
            }
            if (btnPresionado !== 'ok') {
                PanelSesion.getTopToolbar().items.items[0].focus()
            }
        }
    }

    function ExecFilter() {
        if (
            Ext.getCmp('fechainicio').getValue() === "" && Ext.getCmp('fechafin').getValue() !== ""
            || Ext.getCmp('fechainicio').getValue() !== "" && Ext.getCmp('fechafin').getValue() === ""
        ) {
            mostrarMensaje(1, "Debe seleccionar un valor tanto para la fecha de inicio como para la fecha fin.");
            exec = false;
        } else if (
            Ext.getCmp('fechainicio').getValue() > Ext.getCmp('fechafin').getValue()
        ) {
            mostrarMensaje(1, "La fecha fin debe ser mayor o igual que la fecha de inicio.");
            exec = false;
        } else {
            _this.store.reload({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            _this.btnSearch.focus(200);
        }
    }

    function CleanFilters() {
        _this.comboUsuario.clearValue();
        _this.comboUsuario.enable();
        _this.comboUsuario.setCheckboxCheckedValue(false);
        _this.comboUsuario.getStore().reload();
        _this.comboIP.clearValue();
        _this.comboIP.enable();
        _this.comboIP.setCheckboxCheckedValue(false);
        _this.comboIP.getStore().reload();
        _this.fechaInicio.reset();
        _this.fechaFin.reset();
        _this.store.reload({
            params: {
                start: 0,
                limit: 15
            }
        });
        _this.btnClean.focus(200);
    }
}