UCID.portal.cargarEtiquetas('gestfuncionalidad', cargarInterfaz);

//Inicializo el singlenton QuickTips.
Ext.QuickTips.init();

//Declaracion de variables.
var winIns, arbolFunc, winMod, referencia, vpGestFuncionalidad, arbolReferencia, padreArbolFunc, busqueda_grid = false;

function cargarInterfaz(perfil, etiquetas) {
    var _this = this;

    //Botones.
    this.btnAdicionar = new Ext.Button({
        disabled: true,
        id: 'btnAgrFunc',
        tooltip: etiquetas.textToolTipadicionar,
        prevTab: 'btnClearField',
        hidden: true,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAdicionar,
        hotKey: {
            idGrupo: 'grid1',
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
        disabled: true,
        id: 'btnModFunc',
        tooltip: etiquetas.textToolTipMod,
        hidden: true,
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnModificar,
        hotKey: {
            idGrupo: 'grid1',
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
        disabled: true,
        id: 'btnEliFunc',
        tooltip: etiquetas.textToolTipDel,
        hidden: true,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnEliminar,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: Ext.EventObject.DELETE,
                stopEvent: true
            }
        },
        handler: function () {
            if (_this.sm.getCount() >= 1)
                eliminarFuncionalidad();
        }
    });
    this.btnAyuda = new Ext.Button({
        id: 'gestdatfunciones.json',
        iconCls: 'btn',
        text: '<b>'+etiquetas.lbBtnAyuda+'</b>',
        disabled: false,
        nextTab: 'nombrefuncionalidad',
        prevTab: 'btnEliFunc',
        toolTip: etiquetas.textToolTipHelp,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  :{
                key		  : 104,
                alt		  : true
            }
        },
        icon: perfil.dirImg + 'ayuda.png',
        menu:
            new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function() {
                            cargarAyuda();
                        }, text: etiquetas.lbBtnAyuda,
                        id: 'btnAyuRel',
                        icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'btn',
                        tooltip:'Ayuda del sistema'
                    },
                    {
                        text: etiquetas.lbBtnAcercaDe,
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
        id: 'btnAyuFunc',
        tooltip: etiquetas.textToolTipHelp,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAyuda,
        nextTab: 'nombrefuncionalidad',
        prevTab: 'btnEliFunc',
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

    //Arbol Sistemas.
    arbolFunc = new Ext.tree.TreePanel({
        title: etiquetas.lbTitArbolSistemas,
        cls: 'x-toolbar',
        frame: false,
        border: false,
        collapsible: true,
        autoScroll: true,
        region: 'west',
        split: true,
        width: '30%',
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarsistema'
        })
    });

    //Crear nodo padre del arbol.
    padreArbolFunc = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbRootNodeArbolSubsist,
        expandable: false,
        expanded: true,
        id: '0'
    });

    arbolFunc.setRootNode(padreArbolFunc);

    //Evento para habilitar botones.
    arbolFunc.on('click', function (node) {
        if (node.id == 0) {
            _this.store.removeAll();
            _this.btnModificar.disable();
            _this.btnEliminar.disable();
            _this.btnAdicionar.disable();
            btnBuscar.disable();
        }
        else if (node.isLeaf()) {
            panelCentral.enable();
            _this.store.removeAll();
            idsistema = node.id;
            _this.btnAdicionar.enable();
            _this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            btnBuscar.enable();
            enfocarElemento();
        }
        else {
            idsistema = node.id;
            panelCentral.enable();
            _this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            btnBuscar.enable();
            _this.btnAdicionar.enable();
        }
    }, this);

    function focusFunc() {
        _this.btnAdicionar.focus(200);
    }

    //Store del Grid de Funcionalidades.
    this.store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'cargarfuncionalidades'
        }),
        listeners: {

            beforeload: function (thisstore, objeto) {
                objeto.params.idsistema = idsistema
            },
            load: function () {
                if (_this.store.getCount() == 0) {
                    if (funcionalidad.getValue())
                        /**Ext.Msg.show({
                            title: etiquetas.msgInf,
                            msg: etiquetas.msgInfDatosMostrar,
                            buttons: Ext.Msg.OK,
                            fn: focusFunc,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar, _this.btnAdicionar.focus(200));
                    else if (busqueda_grid) {
                        /**Ext.Msg.show({
                            title: etiquetas.msgInf,
                            msg: etiquetas.msgInfDatosMostrar,
                            buttons: Ext.Msg.OK,
                            fn: focusFunc,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar, _this.btnAdicionar.focus(200));
                        busqueda_grid = false;
                    }
                _this.btnModificar.disable();
                _this.btnEliminar.disable();
                }
            }
        },
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
                    name: 'referencia'
                },

                {
                    name: 'text'
                },

                {
                    name: 'descripcion'
                },

                {
                    name: 'icono'
                },

                {
                    name: 'idsistema'
                },

                {
                    name: 'index'
                },

                {
                    name: 'visible'
                }
            ])
    });

    //Establesco modo de seleccion de grid (single).
    this.sm = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    this.sm.on('beforerowselect', function () {
        _this.btnModificar.enable();
        _this.btnEliminar.enable();
    }, this);

    //Defino el grid de Funcionalidades.
    var gpFuncionalidades = new Ext.grid.GridPanel({
        title: etiquetas.lbMsgGridFunc,
        frame: false,
        cls: 'x-toolbar',
        region: 'center',
        border: false,
        autoExpandColumn: 'expandir',
        store: _this.store,
        sm: _this.sm,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idfuncionalidad'
            },

            {
                hidden: true,
                hideable: false,
                dataIndex: 'idsistema'
            },

            {
                hidden: true,
                hideable: false,
                dataIndex: 'descripcion'
            },

            {
                hidden: true,
                hideable: false,
                dataIndex: 'index'
            },

            {
                header: etiquetas.lbCampoDenom,
                width: 150,
                dataIndex: 'text',
                sortable: true
            },

            {
                header: etiquetas.lbCampoReferencia,
                width: 300,
                dataIndex: 'referencia',
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
            displayMsg: etiquetas.lbMsgPaginado,
            emptyMsg: etiquetas.lbMsgEmpty
        })
    });

    /////---------------Creando el Tbar del Grid-----------------------/////
    var funcionalidad = new Ext.form.TextField({
        fieldLabel: etiquetas.lbBuscarFunc,
        emptyText: etiquetas.emptytext,
        anchor: "98%",
        width: 150,
        colWidth: .3,
        maxLength: 60,
	    vtype: 'vtalfanumericosguiones',
        id: 'nombrefuncionalidad',
        nextTab: 'btnBuscarGrid',
        prevTab: 'btnAyuFunc'
    });

    var btnBuscar = new Ext.Button({
        icon: perfil.dirImg + 'buscar.png',
        id: 'btnBuscarGrid',
        nextTab: 'btnClearField',
        prevTab: 'nombrefuncionalidad',
        iconCls: 'btn',
        text: etiquetas.lbBtnBuscar,
        tooltip: etiquetas.textToolTipSearch,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 98,
                alt: true
            }
        },
        handler: function () {
            buscarfuncionalidad(funcionalidad.getValue());
        }
    });

    var btnClear = new Ext.Button({
        icon: perfil.dirImg + 'limpiar.png',
        id: 'btnClearField',
        nextTab: 'btnAgrFunc',
        prevTab: 'btnBuscarGrid',
        iconCls: 'btn',
        text: etiquetas.denomLimpiar,
        tooltip: etiquetas.cleanFilter,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 108,
                alt: true
            }
        },
        handler: function () {
            clearFilters();
        }
    });

    var fpFiltro = new Ext.ToolBar.searchToolBar({
        elementos: [funcionalidad],
        botones: [btnBuscar, btnClear]
    });

    ////------------ Panel del GRID ------------////
    var panelCentral = new Ext.Panel({
        layout: 'border',
        region: 'center',
        id: 'grid1',
        keyMapGroup: true,
        disabled: true,
        items: [fpFiltro, gpFuncionalidades],
        tbar: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda]
    });

    ////--------------Funciones usadas en las TC------------////
    panelCentral.on('afterlayout', function () {
        panelCentral.habilitarKeyMap();
    });

    function enfocarElemento() {
        panelCentral.getTopToolbar().items.items[0].focus();
    }

    //Panel con los componentes.
    var panel = new Ext.Panel({
        layout: 'border',
        items: [arbolFunc, panelCentral]
    });

    //Arbol Acciones.
    arbolReferencia = new Ext.tree.TreePanel({
        title: etiquetas.titleMsg,
        autoScroll: true,
        split: true,
        width: '100%',
        height: 500,
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarReferencia',
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    atreeloader.baseParams = {};
                    if (anode.attributes.id) {
                        atreeloader.baseParams.id = anode.attributes.id;
                        atreeloader.baseParams.text = anode.attributes.text;
                        atreeloader.baseParams.type = anode.attributes.type;
                    }
                }
            }
        }),
        listeners: {
            'click': function (nodo) {
                if (nodo.attributes.type == 'action') {
                    Ext.getCmp('btnAceptarReferencia').enable();
                    Ext.getCmp('referencia').setValue(nodo.attributes.referencia);
                } else
                    Ext.getCmp('btnAceptarReferencia').disable();
            }
        }
    });

    //Crear nodo padre del arbol.
    padreArbolReferencia = new Ext.tree.AsyncTreeNode({
        text: etiquetas.textRootNode,
        expandable: false,
        expanded: true,
        id: '0'
    });

    arbolReferencia.setRootNode(padreArbolReferencia);

    //Formulario.
    var chbVisibilidad = new Ext.form.Checkbox({
        boxLabel: etiquetas.Visibilidad,
        name: 'visible',
        inputValue: 'true',
        checked: true
    });

    var regFuncionalidad = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .8,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbDenominacion,
                                id: 'text',
                                maxLength: 60,
                                allowBlank: false,
                                vtype: 'vtalfanumericosguiones',
                                blankText: etiquetas.lbMsgBlankTextDenom,
                                anchor: '98%'
                            }
                        ]
                    },
                    {
                        columnWidth: .2,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbIcono,
                                id: 'icono',
                                maxLength: 20,
                                vtype: 'vtalfanumerico',
                                anchor: '100%'
                            }
                        ]
                    },
                    {
                        columnWidth: .6,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbReferencia,
                                id: 'referencia',
                                maxLength: 255,
                                allowBlank: false,
                                blankText: etiquetas.lbMsgExpRegDenom,
                                vtype: 'vtreferencia',
                                anchor: '100%'
                            }
                        ]
                    },
                    {
                        columnWidth: .2,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'button',
                                text: etiquetas.DenBottomArbolReferencia,
                                tooltip: etiquetas.tooltipBottomArbolReferencia,
                                style: 'padding:19px 10px 0',
                                icon: perfil.dirImg + 'buscar.png',
                                iconCls: 'btn',
                                id: 'btnexaminar',
                                handler: function () {
                                    var referenciaWindow = new Ext.Window({
                                        width: 400,
                                        height: 550,
                                        frame: true,
                                        items: arbolReferencia,
                                        buttons: [
                                            {
                                                text: 'Cancelar',
                                                id: 'btnCancelarReferencia',
                                                icon: perfil.dirImg + 'cancelar.png',
                                                tooltip: etiquetas.tooltipCancelarVen,
                                                iconCls: 'btn',
                                                handler: function () {
                                                    referenciaWindow.hide();
                                                }
                                            },
                                            {
                                                text: 'Aceptar',
                                                id: 'btnAceptarReferencia',
                                                disabled: true,
                                                icon: perfil.dirImg + 'aceptar.png',
                                                iconCls: 'btn',
                                                tooltip: etiquetas.tooltipAceptarVen,
                                                handler: function () {
                                                    referenciaWindow.hide();
                                                }
                                            }
                                        ]
                                    });
                                    referenciaWindow.show();
                                }
                            }
                        ]
                    },
                    {
                        columnWidth: .2,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbIndex,
                                id: 'index',
                                vtype: 'vtnumeroReales',
                                maxLength: 5,
                                anchor: '100%'
                            }
                        ]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'checkboxgroup',
                                labelSeparator: '',
                                id: 'chbgp',
                                columns: 1,
                                style: 'margin-top:-20px',
                                vertical: true,
                                items: [chbVisibilidad]
                            }
                        ]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textarea',
                                fieldLabel: etiquetas.lbDescripcion,
                                id: 'descripcion',
                                anchor: '100%',
                                maxLength: 255
                            }
                        ]
                    }
                ]
            }
        ]
    });

    //Cargar la ventana.
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitAdicionarFun,
                        width: 400,
                        height: 310,
                        listeners: {
                            hide: function (w) {
                                panelCentral.getTopToolbar().items.items[0].focus();
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
                                icon: perfil.dirImg + 'aplicar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAplicar,
                                tooltip: etiquetas.tooltipAplicarVen,
                                handler: function () {
                                    adicionarFuncionalidad('apl');
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                nextTab: 'text',
                                text: etiquetas.lbBtnAceptar,
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    adicionarFuncionalidad();
                                }
                            }
                        ]
                    });
                }
                regFuncionalidad.getForm().reset();
                winIns.add(regFuncionalidad);
                winIns.doLayout();
                winIns.show();
                Ext.getCmp('text').focus(false, 200);
            }
                break;
            case 'Mod':
            {
                if (!winMod) {
                    winMod = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitModificarFun,
                        width: 400,
                        height: 310,
                        listeners: {
                            hide: function () {
                                panelCentral.getTopToolbar().items.items[0].focus();
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
                                nextTab: 'text',
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    modificarFuncionalidad();
                                }
                            }
                        ]
                    });
                }
                winMod.add(regFuncionalidad);
                winMod.doLayout();
                winMod.show();
                regFuncionalidad.getForm().loadRecord(_this.sm.getSelected());
                chbVisibilidad.setValue(gpFuncionalidades.getSelectionModel().getSelected().get('visible'));
                Ext.getCmp('text').focus(false, 200);
            }
                break;
        }
    }

    //Viewport.
    vpGestFuncionalidad = new Ext.Viewport({
        layout: 'fit',
        items: panel
    });

    //Adicionar Funcionalidades.
    function adicionarFuncionalidad(apl) {
        if (regFuncionalidad.getForm().isValid()) {
            Secodena.mostrarMascara('maskAddFuncionalidad', etiquetas.msgWait, etiquetas.msgAdd);
            regFuncionalidad.getForm().submit({
                url: 'insertarfuncionalidad',
                params: {
                    idsistema: arbolFunc.getSelectionModel().getSelectedNode().attributes.id
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskAddFuncionalidad');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        regFuncionalidad.getForm().reset();
                        if (!apl)
                            winIns.hide();
                        _this.store.reload();
                        _this.sm.clearSelections();
                        _this.btnModificar.disable();
                        _this.btnEliminar.disable();
                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusFunc);
    }

    //Modififcar Funcionalidad.
    function modificarFuncionalidad() {
        if (regFuncionalidad.getForm().isValid()) {
            Secodena.mostrarMascara('maskFuncionalidadMod', etiquetas.msgWait, etiquetas.msgMod);
            regFuncionalidad.getForm().submit({
                url: 'modificarfuncionalidad',
                params: {
                    idfuncionalidad: _this.sm.getSelected().data.idfuncionalidad,
                    idsistema: _this.sm.getSelected().data.idsistema
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskFuncionalidadMod');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        _this.store.reload();
                        winMod.hide();
                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusFunc);
    }

    //Eliminar Funcionalidad.
    function eliminarFuncionalidad() {
        mostrarMensaje(2, etiquetas.lbMsgDeseaEliminar, elimina);
        function elimina(btnPresionado) {
	        if (btnPresionado == 'ok') {
		        Secodena.mostrarMascara('maskFuncionalidadDel', etiquetas.msgWait, etiquetas.msgDEL);
		        Ext.Ajax.request({
			        url: 'eliminarfuncionalidad',
			        method: 'POST',
			        params: {
				        idfuncionalidad: _this.sm.getSelected().data.idfuncionalidad
			        },
			        callback: function (options, success, response) {
				        Secodena.ocultarMascara('maskFuncionalidadDel');
				        responseData = Ext.decode(response.responseText);
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
            else
                Secodena.ocultarMascara('maskFuncionalidadDel');
        }
    }

    //Buscar Funcionalidad.
    function buscarfuncionalidad(funcionalidad) {
	    if(Ext.getCmp('nombrefuncionalidad').validate() == true){
		    busqueda_grid = true;
		    _this.store.load({
			    params: {
				    denominacion: funcionalidad,
				    idsistema: arbolFunc.getSelectionModel().getSelectedNode().attributes.id,
				    start: 0,
				    limit: 20
			    }
		    });
	    } else
		    mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    function clearFilters() {
        funcionalidad.reset();
        _this.store.baseParams = {};
        _this.store.load({
            params: {
                start: 0,
                limit: 15
            }
        });
	    focusFunc();
    }

    function cargarAyuda() {
        var title = 'Ayuda de funcionalidades';
        var referencia = 'seguridad/funcionalidades';
        help.show(title, referencia);
    }
}