UCID.portal.cargarEtiquetas('gestaccion', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar Variables ------------////
var winIns, winInsFE, winMod, idfuncionalidad, referencia, busqueda_grid = false, vpGestAcciones;
var allChequed = [], arbolReferencia, padreArbolReferencia, padreArbolAcc, arbolAcc;
////------------ Area de Validaciones ------------////
var tipos;
tipos = /(^([a-zA-ZáéíóúñüÑ])+([a-zA-ZáéíóúñüÑ\d\.\-\@\#\_\s]*))$/;
function cargarInterfaz(perfil, etiquetas) {
    var _this = this;

    ////------------ Botones ------------////
    this.btnAdicionar = new Ext.Button({
        disabled: true,
        id: 'btnAgrAccion',
        tooltip: etiquetas.textToolTipadicionar,
        prevTab: 'btnClearField',
        nextTab: 'btnAyuAccion',
        hidden: true,
        icon: perfil.dirImg + 'agrupacion.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAdicionar,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 103,
                alt: true,
                ctrl: true
            }
        },
        handler: function () {
            winForm('Ins');
        }
    });

    var btnGuardar = new Ext.Button({
        text: "Guardar",
        iconCls: 'guardar',
        handler: function(){
            var datos = storeGrid.getModifiedRecords();
            if(datos.length){
                var datosEnviar = Array();
                for(var i = 0;i<datos.length;i++){
                    datosEnviar.push(datos[i].data);
                }
                Ext.getBody().mask(etiquetas.msgAdd);
                Ext.Ajax.request({
                    url: "guardarDescripcion",
                    method: 'POST',
                    params:{
                        "datos": Ext.util.JSON.encode(datosEnviar)
                    },
                    callback: function(options, success, response){
                        Ext.getBody().unmask();
                        var responseData = Ext.decode(response.responseText);
                        if(responseData.codigo == 1) {
                            mostrarMensaje(1, etiquetas.msgGuardarGrid);
                            storeGrid.commitChanges();
                        }else{
                            storeGrid.rejectChanges();
                        }
                    }
                });
            }
        }
    });

    btnAyuda = new Ext.Button({
        id: 'btnAyuAccion',
        iconCls: 'ayuda',
        text:'<b>'+etiquetas.lbBtnAyuda+'</b>',
        nextTab: 'nombreaccion',
        prevTab: 'btnAgrAccion',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,
        icon: perfil.dirImg + 'ayuda.png',
        hotKey: {
            idGrupo: 'grid1',
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
                        }, text: etiquetas.lbBtnAyuda,
                        id: 'btnAyuDesktop',
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
    /**btnAyuda = new Ext.Button({
        id: 'btnAyuAccion',
        tooltip: etiquetas.textToolTipHelp,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAyuda,
        nextTab: 'nombreaccion',
        prevTab: 'btnAgrAccion',
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

    this.btnAdicionarFE = new Ext.Button({
        disabled: true,
        id: 'btnAgrFuncFE',
        tooltip: etiquetas.textToolTipadicionarFE,
        prevTab: 'btnClearField',
        hidden: true,
        iconCls: 'adicionar',
        text: etiquetas.lbBtnAdicionarFE,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 105,
                alt: true
            }
        },
        handler: function () {
            winForm('InsFE');
        }
    });

    this.btnModificarFE = new Ext.Button({
        disabled: true,
        id: 'btnModFuncFE',
        tooltip: etiquetas.textToolTipMod,
        hidden: true,
        iconCls: 'modificar',
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

    this.btnEliminarFE = new Ext.Button({
        disabled: true,
        id: 'btnEliAccFE',
        tooltip: etiquetas.textToolTipDel,
        hidden: true,
        iconCls: 'eliminar',
        text: etiquetas.lbBtnEliminar,
        nextTab: 'btnAyuAccion',
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: Ext.EventObject.DELETE,
                stopEvent: true
            }
        },
        handler: function () {
            if (_this.sm.getCount() >= 1)
                eliminarAccionesExternas();
        }
    });

    ////------------ Arbol Acciones ------------////
    arbolAcc = new Ext.tree.TreePanel({
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
            dataUrl: 'cargarsistfunc',
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    atreeloader.baseParams = {};
                    if (anode.attributes.idsistema)
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema
                }
            }
        })
    });

    arbolReferencia = new Ext.tree.TreePanel({
        autoScroll: true,
        split: true,
        width: '100%',
        height: 500,
        listeners: {
            append: function (t, p, n) {
                if (n.attributes.defaultChecked)
                    allChequed.push(n);
            }
        },
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarReferencia',
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    atreeloader.baseParams = {};
                    if (anode.attributes.id) {
                        atreeloader.baseParams.id = anode.attributes.id;
                        atreeloader.baseParams.accion = anode.attributes.accion;
                        atreeloader.baseParams.text = anode.attributes.text;
                        atreeloader.baseParams.type = anode.attributes.type;
                        atreeloader.baseParams.referencia = referencia;
                        atreeloader.baseParams.idfuncionalidad = idfuncionalidad;
                    }
                }
            }
        })
    });

    //Crear nodo padre del arbol.
    padreArbolReferencia = new Ext.tree.AsyncTreeNode({
        text: etiquetas.textRootNode,
        expandable: false,
        expanded: true,
        id: '0'
    });

    arbolReferencia.setRootNode(padreArbolReferencia);

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolAcc = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbRootNodeArbolSubsist,
        expandable: false,
        expanded: true,
        id: '0'
    });

    arbolAcc.setRootNode(padreArbolAcc);

    function enfocarElemento(param) {
        if (param) {
            panelCentral.getTopToolbar().items.items[1].focus();
        } else {
            panelCentral.getTopToolbar().items.items[0].focus();
        }
    }

    ////------------ Evento para habilitar botones ------------////
    arbolAcc.on('click', function (node) {
        _this.btnAdicionar.disable();
        btnBuscar.disable();
        storeGrid.removeAll();
        if (node.isLeaf()) {
            panelCentral.enable();
            idfuncionalidad = node.attributes.idfuncionalidad;
            referencia = node.attributes.referencia;
            storeGrid.removeAll();
            storeGrid.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            if (node.attributes.externa) {
                _this.btnAdicionarFE.enable();
                _this.btnAdicionar.disable();
                enfocarElemento(true);
                enfocarElemento(true);
            } else {
                _this.btnAdicionarFE.disable();
                _this.btnModificarFE.disable();
                _this.btnEliminarFE.disable();
                _this.btnAdicionar.enable();
                enfocarElemento(false);
                enfocarElemento(false);
            }
            btnBuscar.enable();
        }else{
                _this.btnAdicionarFE.disable();
                _this.btnModificarFE.disable();
                _this.btnEliminarFE.disable();
                _this.btnAdicionar.disable();
        }
    }, this);

    function focusAcc() {
        _this.btnAdicionar.focus(200);
    }

    ////------------ Store del grid Accion ------------////
    var storeGrid = new Ext.data.Store({
        url: 'cargargridacciones',
        listeners: {
            beforeload: function (thisstore, objeto) {
                objeto.params.idfuncionalidad = idfuncionalidad;
                objeto.params.referencia = referencia
            },
            load: function () {
                if (storeGrid.getCount() == 0) {
                    if (accion.getValue())
                        /**Ext.Msg.show({
                            title: etiquetas.msgInf,
                            msg: etiquetas.msgInfDatosMostrar,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar);
                    else if (busqueda_grid) {
                        /**Ext.Msg.show({
                            title: etiquetas.msgInf,
                            msg: etiquetas.msgInfDatos,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatos);
                        busqueda_grid = false;
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "id"
            },
            [
                {
                    name: 'idaccion',
                    mapping: 'idaccion'
                },

                {
                    name: 'denominacion',
                    mapping: 'denominacion'
                },
                {
                    name: 'descripcion',
                    mapping: 'descripcion'
                }
            ])
    });

    ////------------ MODO DE SELECCION; SI singleSelect = true=> INDICA SELECCION SIMPLE ------------////
    this.sm = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    this.sm.on('rowselect', function () {
        if (arbolAcc.getSelectionModel().getSelectedNode().attributes.externa) {
            if (sm.getCount() == 1) {
                _this.btnModificarFE.enable();
                _this.btnEliminarFE.enable();
            } else
                _this.btnModificarFE.disable();
        }
    }, this);

    this.sm.on('rowdeselect', function () {
        if (arbolAcc.getSelectionModel().getSelectedNode().attributes.externa) {
            if (_this.sm.getCount() == 1)
                _this.btnModificarFE.enable();
            else
                _this.btnModificarFE.disable();
        }
    }, this);



    ////------------ Grid de Acciones ------------////
    var grid = new Ext.grid.EditorGridPanel({
        title: etiquetas.lbMsgGridAcc,
        cls: 'x-toolbar',
        region: 'center',
        frame: false,
        border: false,
        width: '40%',
        margins: '2 2 2 -4',
        autoExpandColumn: 'expandir',
        store: storeGrid,
        sm: _this.sm,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idaccion'
            },

            {                
                header: etiquetas.lbCampoDenom,
                width: 200,
                dataIndex: 'denominacion',
                sortable: true
            }
            ,
            {
                id: 'expandir',
                header: etiquetas.lbDescripcion,
                width: 200,
                editor: new Ext.form.TextField(),
                dataIndex: 'descripcion',
                sortable: true
            }
        ],
        loadMask: {
            store: storeGrid
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            id: 'ptbaux',
            store: storeGrid,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgPaginado,
            emptyMsg: etiquetas.lbMsgEmpty
        })
    });

    var accion = new Ext.form.TextField({
        fieldLabel: etiquetas.lbAccion,
        emptyText: etiquetas.emptytext,
        anchor: "98%",
        width: 150,
        maxLength: 250,
        colWidth: .3,
        id: 'nombreaccion',
	    vtype: 'vtalfanumericosguiones',
        nextTab: 'btnBuscarGrid',
        prevTab: 'btnAyuAccion'
    });

    var btnBuscar = new Ext.Button({
        icon: perfil.dirImg + 'buscar.png',
        id: 'btnBuscarGrid',
        nextTab: 'btnClearField',
        prevTab: 'nombreaccion',
        tooltip: etiquetas.textToolTipSearch,
        iconCls: 'btn',
        text: etiquetas.lbBtnBuscar,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 98,
                alt: true
            }
        },
        handler: function () {
            buscaraccion(accion.getValue());
        }
    });

    var btnClear = new Ext.Button({
        icon: perfil.dirImg + 'limpiar.png',
        id: 'btnClearField',
        nextTab: 'btnAgrAccion',
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
        elementos: [accion],
        botones: [btnBuscar, btnClear]
    });

    ////------------ Panel del GRID ------------////
    var panelCentral = new Ext.Panel({
        layout: 'border',
        region: 'center',
        disabled: true,
        id: 'grid1',
        keyMapGroup: true,
        items: [fpFiltro, grid],
        tbar: [btnGuardar,_this.btnAdicionar, _this.btnAdicionarFE, _this.btnModificarFE, _this.btnEliminarFE, '->', _this.btnAyuda]
    });

    panelCentral.on('afterlayout', function () {
        panelCentral.habilitarKeyMap();
    });

    ////------------ Panel ------------////
    var panel = new Ext.Panel({
        layout: 'border',
        items: [arbolAcc, panelCentral]
    });

    ////------------ ViewPort ------------////
    vpGestAcciones = new Ext.Viewport({
        layout: 'fit',
        items: panel
    });

    ////------------ Formulario de funcionalidades externas ------------////

    var formAccExternas = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [
            {
                layout: 'column',
                items: [
                    {
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbDenominacion,
                                id: 'denominacion',
                                maxLength: 250,
                                width: 310,
                                allowBlank: false,
                                vtype: 'vtalfanumericosguiones',
                                blankText: etiquetas.lbMsgBlankTextDenom,
                                anchor: '100%'
                            }
                        ]
                    }
                ]
            }
        ]
    });


    ////------------ Cargar Ventanas ------------////
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitAdicionarAcc,
                        width: 439,
                        height: 410,
                        listeners: {
                            hide: function () {
                                enfocarElemento();
                            }
                        },
                        buttons: [
                            {
                                iconCls: 'cancelar',
                                text: etiquetas.lbBtnCancelar,
                                tooltip: etiquetas.tooltipCancelarVen,
                                handler: function () {
                                    winIns.hide();
                                }
                            },
                            {
                                iconCls: 'aceptar',
                                text: etiquetas.lbBtnAceptar,
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    adicionarAccion();
                                }
                            }
                        ]
                    });
                }
                winIns.add(arbolReferencia);
                winIns.on('activate', function () {
                    arbolReferencia.getRootNode().reload();
                }, this);
                winIns.doLayout();
                winIns.show();
            }
                break;
            case 'InsFE':
            {
                if (!winInsFE) {
                    winInsFE = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitAdicionarAccFE,
                        width: 350,
                        height: 130,
                        listeners: {
                            hide: function () {
                                enfocarElemento(true);
                            }
                        },
                        buttons: [
                            {
                                iconCls: 'cancelar',
                                text: etiquetas.lbBtnCancelar,
                                tooltip: etiquetas.tooltipCancelarVen,
                                handler: function () {
                                    winInsFE.hide();
                                }
                            },
                            {
                                iconCls: 'aplicar',
                                text: etiquetas.lbBtnAplicar,
                                tooltip: etiquetas.tooltipAplicarVen,
                                handler: function () {
                                    adicionarAccioneExterna('apl');
                                }
                            },
                            {
                                iconCls: 'aceptar',
                                nextTab: 'denominacion',
                                text: etiquetas.lbBtnAceptar,
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    adicionarAccioneExterna();
                                }
                            }
                        ]
                    });
                }
                formAccExternas.getForm().reset();
                winInsFE.add(formAccExternas);
                winInsFE.doLayout();
                winInsFE.show();
                Ext.getCmp('denominacion').focus(false, 200);
            }
                break;
            case 'Mod':
            {
                if (!winMod) {
                    winMod = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitModificarAcc,
                        width: 350,
                        height: 130,
                        listeners: {
                            hide: function () {
                                enfocarElemento(true);
                            }
                        },
                        buttons: [
                            {
                                iconCls: 'cancelar',
                                text: etiquetas.lbBtnCancelar,
                                tooltip: etiquetas.tooltipCancelarVen,
                                handler: function () {
                                    winMod.hide();
                                }
                            },
                            {
                                iconCls: 'aceptar',
                                text: etiquetas.lbBtnAceptar,
                                nextTab: 'text',
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    modificarAccionExterna();
                                }
                            }
                        ]
                    });
                }
                winMod.add(formAccExternas);
                winMod.doLayout();
                winMod.show();
                formAccExternas.getForm().loadRecord(_this.sm.getSelected());
                Ext.getCmp('denominacion').focus(false, 200);
            }
                break;
        }
    }

    ////------------ Función para obtener los nodos marcados ------------////
    function obtenerNodosMarcados() {
        var root = arbolReferencia.getRootNode();
        var array = [];
        root.cascade(function (n) {
            if (n != root) {
                var checked = false;
                if (!n.isLeaf() && n.attributes.type == 'funcionalidad') {
                    checked = arbolReferencia.getChecked(null, n);
                    if (checked && checked.length > 0) {
                        for (i = 0; i < checked.length; i++) {
                            if (checked[i].getUI().isChecked() && checked[i].attributes.defaultChecked == false)
                                array.push(checked[i].attributes.text);
                        }
                    }
                }
            }
        });
        return array;
    }

    ////------------ Función para obtener los nodos a eliminar ------------////
    function obtenerNodosElim() {
        var root = arbolReferencia.getRootNode();
        var array = [];
        root.cascade(function (n) {
            if (n != root) {
                var checked = false;
                if (!n.isLeaf() && n.attributes.type == 'funcionalidad') {
                    checked = arbolReferencia.getChecked(null, n);
                    var eliminados = [];
                    for (j = 0; j < allChequed.length; j++) {
                        var esta = false;
                        for (k = 0; k < checked.length; k++) {
                            if (allChequed[j] == checked[k]) {
                                esta = true;
                                break;
                            }
                        }
                        if (!esta)
                            eliminados.push(allChequed[j]);
                    }
                    checked = eliminados;
                    if (checked && checked.length > 0) {
                        for (i = 0; i < checked.length; i++)
                            array.push(checked[i].attributes.text);
                    }
                }
            }
        });
        return array;
    }

    ////------------ Adicionar Aciones ------------////
    function adicionarAccion() {
        var arrayNodes = obtenerNodosMarcados();
        var arrayNodesElim = obtenerNodosElim();
        if (arrayNodes.length == 0 && arrayNodesElim.length == 0)
            etiquetas.mensajeOperacion;
        Secodena.mostrarMascara('maskConexion', etiquetas.msgWait, etiquetas.msgAdd);
        Ext.Ajax.request({
            url: 'insertaraccion',
            waitMsg: etiquetas.lbMsgEsperaInsAcc,
            params: {
                idfuncionalidad: arbolAcc.getSelectionModel().getSelectedNode().attributes.idfuncionalidad,
                idsistema: arbolAcc.getSelectionModel().getSelectedNode().parentNode.attributes.idsistema,
                arrayNodesChecked: Ext.encode(arrayNodes),
                arrayNodesElim: Ext.encode(arrayNodesElim),
                referencia: referencia
            },
            callback: function (options, success, response) {
                Secodena.ocultarMascara('maskConexion');
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    allChequed = [];
                    winIns.hide();
                    storeGrid.reload();
                    _this.sm.clearSelections();
                    return;
                }
                if (success) {
                    Secodena.ocultarMascara('maskConexion');
                    mostrarMensaje(1, etiquetas.mensajeOperacion);
                    allChequed = [];
                    winIns.hide();
                    storeGrid.reload();
                    _this.sm.clearSelections();
                } else {
                    Secodena.ocultarMascara('maskConexion');
                    mostrarMensaje(1, etiquetas.mensajeOperacion, focusAcc);
                    allChequed = [];
                    winIns.hide();
                }

            }
        });
    }

    function adicionarAccioneExterna(apl) {
        if (formAccExternas.getForm().isValid()) {
            Secodena.mostrarMascara('maskAddAccionExt', etiquetas.msgWait, etiquetas.msgAdd);
            formAccExternas.getForm().submit({
                url: 'adicionarAccioneExterna',
                params: {
                    idfuncionalidad: arbolAcc.getSelectionModel().getSelectedNode().attributes.idfuncionalidad
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskAddAccionExt');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        formAccExternas.getForm().reset();
                        if (!apl)
                            winInsFE.hide();
                        storeGrid.reload();
                        _this.sm.clearSelections();
                        _this.btnModificarFE.disable();
                        _this.btnEliminarFE.disable();
                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusAcc);
    }

    function modificarAccionExterna() {
        if (formAccExternas.getForm().isValid()) {
            Secodena.mostrarMascara('maskFuncionalidadMod', etiquetas.msgWait, etiquetas.msgMod);
            formAccExternas.getForm().submit({
                url: 'modificarAccioneExterna',
                params: {
                    idaccion: _this.sm.getSelected().data.idaccion,
                    idfuncionalidad: arbolAcc.getSelectionModel().getSelectedNode().attributes.idfuncionalidad
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskFuncionalidadMod');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        storeGrid.reload();
                        winMod.hide();
                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje, focusAcc);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusAcc);
    }

    function eliminarAccionesExternas() {
        var arrAccElim = _this.sm.getSelections();
        var arrayElim = [];
        for (var i = 0; i < arrAccElim.length; i++) {
            arrayElim.push(arrAccElim[i].data.denominacion);
        }
        mostrarMensaje(2, etiquetas.lbMsgDeseaEliminar, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Secodena.mostrarMascara('maskAccionesDel', etiquetas.msgWait, etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'eliminarAccioneExterna',
                    method: 'POST',
                    params: {
                        arrayIdAcciones: Ext.encode(arrayElim),
                        idfuncionalidad: arbolAcc.getSelectionModel().getSelectedNode().attributes.idfuncionalidad
                    },
                    callback: function (options, success, response) {
                        Secodena.ocultarMascara('maskAccionesDel');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            storeGrid.reload();
                            _this.sm.clearSelections();
                            _this.btnEliminarFE.disable();
                            _this.btnModificarFE.disable();
                        }
                    }
                });
            }
        }
    }

    ////------------ Buscar Accion ------------////
    function buscaraccion(accion) {
	    if(Ext.getCmp('nombreaccion').validate() == true){
		    busqueda_grid = true;
		    storeGrid.load({
			    params: {
				    denominacion: accion,
				    idfuncionalidad: arbolAcc.getSelectionModel().getSelectedNode().attributes.idfuncionalidad,
				    start: 0,
				    limit: 20
			    }
		    });
	    }
	    else
		    mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    function clearFilters() {
        accion.reset();
        storeGrid.baseParams = {};
        storeGrid.load({
            params: {
                start: 0,
                limit: 15
            }
        });
	    focusAcc();
    }

    function cargarAyuda() {
        var title = 'Ayuda de acciones';
        var referencia = 'seguridad/gestacciones';
        help.show(title, referencia);
    }

}