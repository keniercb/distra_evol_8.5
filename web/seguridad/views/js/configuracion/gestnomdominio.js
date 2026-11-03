Ext.ns("Configuracion");

//     Variables
var winIns, winMod, modificar = 0, arregloDeschequeados = [], arrayPadresEliminar = [], arrayTiene = [];
var regDominio, arbolEntidades, busqueda_filtro = false, padreArbolEntidades;
////------------ Area de Validaciones ------------////

Configuracion.Dominio = Ext.extend(Ext.Panel,
    {
        id: 'Dominio',
        layout: 'border',
        region: 'center',
        initComponent: function () {
            var _this = this;

            ////------------- Botones -------------////
            this.btnAdicionar = new Ext.Button({
                id: 'btnAgr',
                iconCls: 'adicionar',
                text: perfil.etiquetas.lbBtnAdicionar,
                tooltip: perfil.etiquetas.textToolTipadicionarM,
                prevTab: 'btnClearDominio',
                hotKey: {
                    idGrupo: 'Dominio',
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
                id: 'btnMod',
                disabled: true,
                iconCls: 'modificar',
                text: perfil.etiquetas.lbBtnModificar,
                tooltip: perfil.etiquetas.textToolTipModificarM,
                hotKey: {
                    idGrupo: 'Dominio',
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
                id: 'btnEli',
                disabled: true,
                iconCls: 'eliminar',
                text: perfil.etiquetas.lbBtnEliminar,
                tooltip: perfil.etiquetas.textToolTipEliminarM,
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        eliminardominio();
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyuDesktop',
                iconCls: 'ayuda',
                text: '<b>Ayuda</b>',
                nextTab: 'idDenDom',
                disabled: false,
                toolTip: perfil.etiquetas.textToolTipHelp,
                icon: perfil.dirImg + 'ayuda.png',
                hotKey: {
                    idGrupo: 'Dominio',
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
                id: 'btnAyu',
                iconCls: 'ayuda',
                nextTab: 'idDenDom',
                text: perfil.etiquetas.lbBtnAyuda,
                tooltip: perfil.etiquetas.textToolTipHelp,
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                handler: function () {
                    cargarAyuda();
                }
            });*/

            ////------------- Store -------------////
            this.store = new Ext.data.Store({
                url: arbolAcc.root.childNodes[1].attributes.controller + 'cargardominios',
                listeners: {
                    load: function () {
                        if (_this.store.getCount() == 0) {
                            if (denDom.getValue())

                                /*Ext.Msg.show({
                                    title: perfil.etiquetas.msgInf,
                                    msg: perfil.etiquetas.msgInfDatosMostrar,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO
                                }); */
                                mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar);
                            else if (busqueda_filtro) {
                                Ext.Msg.show({
                                    title: perfil.etiquetas.msgInf,
                                    msg: perfil.etiquetas.msgInfDatos,
                                    buttons: Ext.Msg.OK,
                                    fn: focusADD,
                                    icon: Ext.MessageBox.INFO
                                });
                                busqueda_filtro = false;
                            }
                            _this.btnEliminar.disable();
                            _this.btnModificar.disable();
                        }
                    }
                },
                reader: new Ext.data.JsonReader({
                    totalProperty: "cant",
                    root: "datos",
                    id: "iddominio"
                }, [
                    {
                        name: 'iddominio'
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'descripcion'
                    },
                    {
                        name: 'seguridad'
                    }
                ])
            });

            ////------------- Establezco modo de selección de grid ----------////
            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });

            this.sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
                _this.btnEliminar.disable();
                _this.btnModificar.enable();
                if (!record.data.seguridad == 1)
                    _this.btnEliminar.enable();
            }, this);

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

            ////------------- Defino el grid de Dominios ------------////
            this.grid = new Ext.grid.GridPanel({
                title: perfil.etiquetas.titleGridDom,
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
                        dataIndex: 'iddominio'
                    },
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'seguridad'
                    },
                    {
                        header: perfil.etiquetas.lbDenominacion,
                        width: 400,
                        dataIndex: 'denominacion',
                        sortable: true
                    },
                    {
                        id: 'expandir',
                        header: perfil.etiquetas.lbDescripcion,
                        width: 300,
                        dataIndex: 'descripcion',
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

            var denDom = new Ext.form.TextField({
                id: 'idDenDom',
                fieldLabel: perfil.etiquetas.lbNombre,
                anchor: "98%",
                width: 150,
                maxLength: 40,
                colWidth: .3,
	            vtype: 'vtalfanumericos',
                emptyText: perfil.etiquetas.emptytext
            });

            this.btnSearch = new Ext.Button({
                id: 'btnBuscarDominio',
                nextTab: 'btnClearDominio',
                prevTab: 'idDenDom',
                iconCls: 'buscar',
                text: perfil.etiquetas.lbBtnBuscar,
                tooltip: perfil.etiquetas.textToolTipSearchM,
                hotKey: {
                    idGrupo: 'Dominio',
                    config: {
                        key: 98,
                        alt: true
                    }
                },
                handler: function () {
                    buscarnombredominio(denDom.getValue());
                }
            });

            var btnClear = new Ext.Button({
                id: 'btnClearDominio',
                nextTab: 'btnAgr',
                prevTab: 'btnBuscarDominio',
                iconCls: 'limpiar',
                text: perfil.etiquetas.denomLimpiar,
                tooltip: perfil.etiquetas.cleanFilter,
                hotKey: {
                    idGrupo: 'Dominio',
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
                elementos: [denDom],
                botones: [this.btnSearch, btnClear]
            });

            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });

            regDominio = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                region: 'west',
                width: 200,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbDenominacion,
                                        id: 'denominacion',
                                        maxLength: 40,
                                        allowBlank: false,
                                        blankText: perfil.etiquetas.lbMsgBlank,
                                        vtype: 'vtalfanumericos',
                                        anchor: '100%'
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
                                        id: 'descripcion',
                                        maxLength: 255,
                                        nextTab: 'btnCancelar',
                                        prevTab: 'denominacion',
                                        height: 200,
                                        anchor: '100%'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            ////------------ Arbol para cargar las estructuras del Dominio ------------////
            arbolEntidades = new Ext.tree.TreePanel({
                autoScroll: true,
                region: 'center',
                split: true,
                width: '37%',
                loader: new Ext.tree.TreeLoader({
                    dataUrl: arbolAcc.root.childNodes[1].attributes.controller + 'cargarestructuras',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {};
                            if (modificar > 0) {
                                atreeloader.baseParams.accion = 'modificar';
                                if (_this.sm.getSelected().data.seguridad)
                                    atreeloader.baseParams.idseguridad = _this.sm.getSelected().data.iddominio;
                                atreeloader.baseParams.iddominio = _this.sm.getSelected().data.iddominio;
                                if (anode.attributes.idestructuraop)
                                    atreeloader.baseParams.idarea = anode.attributes.idestructuraop;
                                if (anode.attributes.checked && anode.attributes.id != 0)
                                    atreeloader.baseParams.tcheck = 'marcado';
                                else if (!anode.attributes.checked && anode.attributes.id != 0)
                                    atreeloader.baseParams.tcheck = 'desmarcado';
                            } else {
                                atreeloader.baseParams.accion = 'insertar';
                                if (_this.store.getCount() > 0)
                                    atreeloader.baseParams.forma = 1;
                                if (anode.attributes.checked && anode.attributes.id != 0)
                                    atreeloader.baseParams.tcheck = 'marcado';
                                else if (!anode.attributes.checked && anode.attributes.id != 0)
                                    atreeloader.baseParams.tcheck = 'desmarcado';
                            }
                        },
                        'load': function (atreeloader, anode) {
                            hijosNodo = anode.childNodes;
                            if (hijosNodo.length) {
                                for (i = 0; i < hijosNodo.length; i++) {
                                    nodoHijo = hijosNodo[i];
                                    if (nodoHijo.attributes.checked)
                                        adicionarEnDeschequeados(arrayTiene, nodoHijo.attributes.id);
                                }
                            }
                            var id;
                            id = anode.attributes.id;
                            var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);
                            if (esta1 != -1) {
                                eliminarEnDeschequeados(arrayPadresEliminar, esta1);
                                if (arbolEntidades.getChecked("id", anode).length == 0) {
                                    hijosNodo = anode.childNodes;
                                    for (i = 0; i < hijosNodo.length; i++) {
                                        if (!hijosNodo[i].isLeaf()) {
                                            id = anode.attributes.id;
                                            adicionarEnDeschequeados(arrayPadresEliminar, id);
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            });

            arbolEntidades.on('checkchange', function (node) {
                var esta = estaEnDeschequeados(arregloDeschequeados, node.attributes.id);
                var id;
                id = node.attributes.id;
                var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);
                if (node.attributes.checked) {
                    marcarHijos(node, true);
                    if (esta != -1)
                        eliminarEnDeschequeados(arregloDeschequeados, esta);
                    if (!node.isLeaf() && esta1 != -1)
                        eliminarEnDeschequeados(arrayPadresEliminar, esta1);
                } else {
                    marcarHijos(node, false);
                    var estaT = estaEnDeschequeados(arrayTiene, id);
                    if (estaT != -1)
                        adicionarEnDeschequeados(arregloDeschequeados, node.attributes.id);
                    if (!node.isLeaf() && node.childNodes.length == 0)
                        adicionarEnDeschequeados(arrayPadresEliminar, id);
                }
            }, this);

            ////------------ Crear nodo padre del arbol ------------////
            padreArbolEntidades = new Ext.tree.AsyncTreeNode({
                text: perfil.etiquetas.lbEstructura,
                expandable: false,
                id: '0'
            });

            arbolEntidades.setRootNode(padreArbolEntidades);

            ////---------- Panel Adicionar Dominio----------////
            var panelAdicionar = new Ext.Panel({
                layout: 'border',
                items: [regDominio, arbolEntidades]
            });

            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];
            this.items = [_this.filtro, _this.grid];
            this.keyMapGroup = true;
            Configuracion.Dominio.superclass.initComponent.call(this);

            ////---------- Funciones ----------////
            function winForm(opcion) {
                switch (opcion) {
                    case 'Ins':
                    {
                        limpiarArreglos();
                        if (!winIns) {
                            winIns = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinAdicionarM,
                                width: 650,
                                height: 400,
                                listeners: {
                                    hide: function () {
                                        _this.getTopToolbar().items.items[0].focus();
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        id: 'btnCancelar',
                                        prevTab: 'descripcion',
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        handler: function () {
                                            winIns.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aplicar',
                                        text: perfil.etiquetas.lbBtnAplicar,
                                        tooltip: perfil.etiquetas.tooltipAplicarVen,
                                        handler: function () {
                                            adicionardominio('apl');
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        nextTab: 'denominacion',
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            adicionardominio();
                                        }
                                    }
                                ]
                            });
                        }
                        modificar = 0;
                        regDominio.getForm().reset();
                        winIns.add(panelAdicionar);
                        winIns.show();
                        Ext.getCmp('denominacion').focus(false,200);
                        arbolEntidades.getRootNode().reload();
                        arbolEntidades.expandPath(arbolEntidades.getRootNode().getPath())
                    }
                        break;
                    case 'Mod':
                    {
                        limpiarArreglos();
                        if (!winMod) {
                            winMod = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                resizable: false,
                                title: perfil.etiquetas.lbWinModificarM,
                                width: 650,
                                height: 400,
                                listeners: {
                                    hide: function () {
                                        _this.getTopToolbar().items.items[1].focus();
                                    }
                                },
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        id: 'btnCancelar',
                                        prevTab: 'descripcion',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            winMod.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        nextTab: 'denominacion',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            modificardominio();
                                        }
                                    }
                                ]

                            });
                        }
                        modificar = 1;
                        winMod.add(panelAdicionar);
                        winMod.show();
                        regDominio.getForm().loadRecord(_this.sm.getSelected());
                        arbolEntidades.getRootNode().reload();
                        Ext.getCmp('denominacion').focus(false,200);
                        arbolEntidades.expandPath(arbolEntidades.getRootNode().getPath())
                    }
                        break;
                }
            }

            function adicionardominio(apl) {
                if (regDominio.getForm().isValid()) {
                    var arrayNodos = arbolEntidades.getChecked();
                    var arrayEnt = new Array();
                    var arrayPadres = new Array();
                    if (arrayNodos == 0)
                        mostrarMensaje(3, perfil.etiquetas.lbMsgSelecEntidad, _this.btnAdicionar.focus());
                    else {
                        for (var i = 0; i < arrayNodos.length; i++) {
                            arrayEnt.push(arrayNodos[i].attributes.id);
                            if (!arrayNodos[i].isLeaf() && arrayNodos[i].childNodes.length == 0)
                                arrayPadres.push(arrayNodos[i].attributes.id);
                        }
                        Secodena.mostrarMascara('maskDominio', perfil.etiquetas.msgWait, perfil.etiquetas.msgAdd);
                        regDominio.getForm().submit({
                            url: arbolAcc.root.childNodes[1].attributes.controller + 'insertarnomdominio',
                            timeout: 1800000,
                            params: {
                                arrayEntidades: Ext.encode(arrayEnt),
                                arrayPadres: Ext.encode(arrayPadres)
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskDominio');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.cod, action.result.mensaje, _this.btnAdicionar.focus());
                                    regDominio.getForm().reset();
                                    limpiarArreglos();
                                    if (!apl)
                                        winIns.hide();
                                    arrayNodos = arbolEntidades.getChecked();
                                    for (var i = 0; i < arrayNodos.length; i++) {
                                        cambiarEstadoCheck(arrayNodos[i], false);
                                    }
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje, _this.btnAdicionar.focus());
                            }
                        });
                    }
                }
                else  mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCampos, _this.btnAdicionar.focus());
            }

            function modificardominio() {
                if (regDominio.getForm().isValid()) {
                    var arrayNodos = arbolEntidades.getChecked();
                    var arrayEnt = new Array();
                    var arrayPadres = new Array();
                    if (arrayNodos == 0)
                        mostrarMensaje(3, perfil.etiquetas.lbMsgSelecEntidad, _this.btnModificar.focus());
                    else {
                        buscarNodosTiene(arbolEntidades.getRootNode());
                        if (arrayNodos.length > 0) {
                            for (var i = 0; i < arrayNodos.length; i++) {
                                arrayEnt.push(arrayNodos[i].attributes.id);
                                if (!arrayNodos[i].isLeaf() && arrayNodos[i].childNodes.length == 0) {
                                    arrayPadres.push(arrayNodos[i].attributes.id);
                                }
                            }
                        }
                        Secodena.mostrarMascara('maskDominioMod', perfil.etiquetas.msgWait, perfil.etiquetas.msgMod);
                        regDominio.getForm().submit({
                            url: arbolAcc.root.childNodes[1].attributes.controller + 'modificarnomdominio',
                            timeout: 1800000,
                            params: {
                                iddominio: _this.sm.getSelected().data.iddominio,
                                arrayEntidades: Ext.encode(arrayEnt),
                                arrayEntidadesEliminar: Ext.encode(arregloDeschequeados),
                                seguridad: _this.sm.getSelected().data.seguridad,
                                arrayPadres: Ext.encode(arrayPadres),
                                arrayPadresEliminar: Ext.encode(arrayPadresEliminar),
                                arrayTiene: Ext.encode(arrayTiene)
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskDominioMod');
                                limpiarArreglos();
                                if (action.result.cod != 3) {
                                    mostrarMensaje(action.result.cod, action.result.mensaje, _this.btnAdicionar.focus());
                                    _this.store.reload();
                                    winMod.hide();
                                }
                                if (action.result.cod == 3)
                                    mostrarMensaje(action.result.cod, action.result.mensaje, _this.btnAdicionar.focus());
                            }
                        })
                    }
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops, _this.btnModificar.focus());
            }

            function buscarNodosTiene(nodo) {
                nodo.eachChild(function (anodehijo) {
                    if (!anodehijo.attributes.checked && !anodehijo.isLeaf() && anodehijo.attributes.tiene && anodehijo.childNodes.length == 0)
                        arrayTiene.push(anodehijo.attributes.id);
                    if (anodehijo.childNodes.length > 0)
                        buscarNodosTiene(anodehijo);

                }, this);
            }

            function eliminardominio() {
                mostrarMensaje(2, perfil.etiquetas.lbMsgFunEliminarMsgM, elimina);
                function elimina(btnPresionado) {
                    Secodena.mostrarMascara('maskDominioDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                    if (btnPresionado == 'ok') {
                        Ext.Ajax.request({
                            url: arbolAcc.root.childNodes[1].attributes.controller + 'eliminarnomdominio',
                            method: 'POST',
                            params: {
                                iddominio: _this.sm.getSelected().data.iddominio
                            },
                            callback: function (options, success, response) {
                                Secodena.ocultarMascara('maskDominioDel');
                                responseData = Ext.decode(response.responseText);
                                mostrarMensaje(responseData.cod, responseData.mensaje, _this.btnAdicionar.focus());
                                if (responseData.cod == 1) {
                                    mostrarMensaje(responseData.cod, responseData.mensaje, _this.btnAdicionar.focus());
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                            }
                        });
                    }
                    else {
                        Secodena.ocultarMascara('maskDominioDel');
                        _this.btnEliminar.focus()
                    }
                }
            }

            function clearFilters() {
                denDom.reset();
                _this.store.baseParams = {};
                _this.store.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
	            focusADD();
            }

            function cargarAyuda() {
                help.show('Ayuda de Seguridad', 'seguridad/gestnomdominio');
            }

            function cambiarEstadoCheck(anodehijo, check) {
                if (anodehijo.attributes.checked != check) {
                    anodehijo.getUI().toggleCheck(check);
                }
            }

            function estaEnDeschequeados(arreglonodos, idnodo) {
                var cantidad = arreglonodos.length;
                for (p = 0; p < cantidad; p++) {
                    if (arreglonodos[p] == idnodo)
                        return p;
                }
                return -1;
            }

            function adicionarEnDeschequeados(arreglo, id) {
                if (estaEnDeschequeados(arreglo, id) == -1)
                    arreglo.push(id);
            }

            function limpiarArreglos() {
                arregloDeschequeados = [];
                arrayPadresEliminar = [];
                arrayTiene = [];
            }

            function marcarHijos(nodo, check) {
                nodo.eachChild(function (anodehijo) {
                    if (anodehijo.attributes.checked != check)
                        cambiarEstadoCheck(anodehijo, check);
                    if (anodehijo.childNodes.length > 0)
                        marcarHijos(anodehijo, check);
                }, this);
            }

            function buscarnombredominio(denDom) {
                if(Ext.getCmp('idDenDom').validate()==true){
                busqueda_filtro = true;
                _this.store.baseParams = {};
                _this.store.baseParams.denDom = denDom;
                _this.store.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
                }else{
                        mostrarMensaje(6, perfil.etiquetas.lbMsgErrorEnCamops);
                }
            }

            function focusADD() {
                _this.btnAdicionar.focus();
            }

            function eliminarEnDeschequeados(arreglo, pos) {
                arreglo.splice(pos, 1);
            }
        }
    }
);