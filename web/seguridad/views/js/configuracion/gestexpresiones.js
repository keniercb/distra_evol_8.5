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
);