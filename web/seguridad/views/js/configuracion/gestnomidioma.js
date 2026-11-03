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
);