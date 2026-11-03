Ext.ns("Configuracion");

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
);