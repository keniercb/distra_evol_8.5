Ext.ns("Configuracion");

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
