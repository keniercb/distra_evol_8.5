UCID.portal.cargarEtiquetas('gestservpresta', cargarInterfaz);
// 3. Inicializo el singlenton QuickTips
Ext.QuickTips.init();

////----------4 declarar variables ----------////
var winIns, winMod, idsistema;
function cargarInterfaz(perfil, etiquetas) {

    ////----------Botones ----------////
    btnAdicionar = new Ext.Button({id: 'btnAgrServPres', hidden: true, disabled: true, icon: perfil.dirImg + 'adicionar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnAdicionar + '</b>', handler: function () {
        winForm('Ins');
    } });
    btnModificar = new Ext.Button({id: 'btnModServPres', hidden: true, disabled: true, icon: perfil.dirImg + 'modificar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnModificar + '</b>', handler: function () {
        winForm('Mod');
    } });
    btnEliminar = new Ext.Button({id: 'btnEliServPres', hidden: true, disabled: true, icon: perfil.dirImg + 'eliminar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnEliminar + '</b>', handler: function () {
        eliminarServicio();
    } });
    //btnAyuda = new Ext.Button({id: 'btnAyuServPres', hidden: true, icon: perfil.dirImg + 'ayuda.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnAyuda + '</b>' });
    btnAyuda = new Ext.Button({
        id: 'btnAyuServPres',
        iconCls: 'btn',
        text: '<b>Ayuda</b>',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,

        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 104,
                alt: true
            }
        },
        icon: perfil.dirImg + 'ayuda.png',
        menu: new Ext.menu.Menu({
            id: 'mainMenu',
            items: [
                {
                    handler: function () {

                    }, text: 'Ayuda',
                    id: 'btnAyuRel',
                    icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'btn',
                    tooltip: 'Ayuda del sistema'
                },
                {
                    text: 'Acerca de',
                    id: 'acercade',
                    icon: perfil.dirImg + 'info.png',
                    iconCls: 'btn',
                    tooltip: "Acerca de <b>(Alt+...s)</b>",
                    handler: function () {

                        var uri = "seguridad";
                        acercaDe.show(uri);
                    }}
            ]
        })

    });
    UCID.portal.cargarAcciones(window.frameElement.id);

    ////----------Arbol funcionalides ----------////
    arbolServ = new Ext.tree.TreePanel({
        title: etiquetas.lbTitSistemasReg,
        collapsible: true,
        autoScroll: true,
        region: 'west',
        split: true,
        width: '28%',
        loader: new Ext.tree.TreeLoader({
            dataUrl: '../gestsistema/cargarsistema'
        })
    });
    ////---------- Crear nodo padre del arbol ----------////
    padreArbolServ = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbRootNodeSitem,
        expandable: false,
        expanded: true,
        id: '0'
    });

    ////----------Para insertarle el root al arbol  ----------////
    arbolServ.setRootNode(padreArbolServ);

    ////---------- Evento para habilitar botones ----------////
    arbolServ.on('click', function (node, e) {
        btnModificar.disable();
        btnEliminar.disable();
        btnAdicionar.disable();
        stGpServicio.removeAll();
        if (node.isLeaf()) {
            stGpServicio.removeAll();
            idsistema = node.id;
            stGpServicio.load({params: {start: 0, limit: 15}});
            btnAdicionar.enable();

        }
    }, this);
    ////----------Store del Grid de Funcionalidades  ----------////
    stGpServicio = new Ext.data.Store({

        proxy: new Ext.data.HttpProxy({
            url: 'cargarservicio'
        }),
        listeners: {'beforeload': function (thisstore, objeto) {
            objeto.params.idsistema = idsistema
        }},
        reader: new Ext.data.JsonReader(
            {
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "idfuncionalidad"
            },
            [
                {name: 'idservicio', mapping: 'idservicio'},
                {name: 'denominacion', mapping: 'denominacion'},
                {name: 'descripcion', mapping: 'descripcion'},
                {name: 'wsdl', mapping: 'wsdl'}
            ]
        )
    });

    ////---------- Establesco modo de seleccion de grid (single) ----------////
    sm = new Ext.grid.RowSelectionModel({singleSelect: true});

    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
        btnModificar.enable();
        btnEliminar.enable();

    }, this);

    ////---------- Defino el grid de Funcionalidades ----------////
    var gpServicio = new Ext.grid.GridPanel({
        title: etiquetas.lbTitServiciosPresta,
        frame: true,
        region: 'center',
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        store: stGpServicio,
        sm: sm,
        columns: [
            {hidden: true, hideable: false, dataIndex: 'idservicio'},
            {header: etiquetas.lbCampDenom, width: 150, dataIndex: 'denominacion'},
            {header: etiquetas.lbCampWSDL, width: 150, dataIndex: 'wsdl'},
            {id: 'expandir', header: etiquetas.lbCampDescrip, width: 200, dataIndex: 'descripcion'}
        ],
        loadMask: {store: stGpServicio},
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: stGpServicio,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgPaginado,
            emptyMsg: etiquetas.lbMsgEmpty
        })
    });

    ////---------- Renderiar el arbol  ----------////
    var panel = new Ext.Panel({
        title: etiquetas.lbTitGestServPresta,
        layout: 'border',
        items: [gpServicio, arbolServ],
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnAyuda]
    });

    var vpGestSistema = new Ext.Viewport({
        layout: 'fit',
        items: panel
    })

    ////---------- Formulario de registrar servicios que presta ----------////
    var regServPresta = new Ext.FormPanel({
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
                                fieldLabel: etiquetas.lbDenominacion,
                                id: 'denominacion',
                                maxLength: 50,
                                anchor: '95%',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgBlankTextDenom,
                                regex: /(^([a-zA-Z�������])+([a-zA-Z��������\d\.\-\@\#\_\s]*))$/,
                                regexText: etiquetas.lbMsgExpRegDenom
                            }
                        ]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbWSDL,
                                id: 'wsdl',
                                anchor: '100%',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgBlankTextDenom,
                                regex: /^([hH][tT]{2}[pP]:\/\/).+(\.[wW][sS][dD][lL])$/,
                                regexText: etiquetas.lbMsgExpRegDenom
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
                                anchor: '100%'
                            }
                        ]
                    }
                ]
            }
        ],
    });

    ////---------- Cargar ventanas ----------////
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
                        title: etiquetas.lbTitAdicServPrest, width: 400, height: 270,
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCancelar,
                                handler: function () {
                                    regServPresta.getForm().reset();
                                    winIns.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aplicar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAplicar,
                                handler: function () {
                                    adicionarServicio('apl');
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                handler: function () {
                                    adicionarServicio();
                                }
                            }
                        ]
                    });
                }
                winIns.add(regServPresta);
                winIns.doLayout();
                winIns.show();
            }
                break;
            case 'Mod':
            {
                if (!winMod) {
                    winMod = new Ext.Window({
                        modal: true, closeAction: 'hide', layout: 'fit',
                        title: etiquetas.lbTitModServPresta, width: 400, height: 270,
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCancelar,
                                handler: function () {
                                    regServPresta.getForm().reset();
                                    winMod.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                handler: function () {
                                    modificarServicio();
                                }
                            }
                        ]
                    });
                }
                winMod.add(regServPresta);
                winMod.doLayout();
                winMod.show();
                regServPresta.getForm().loadRecord(sm.getSelected());
            }
                break;
        }
    }

    ////---------- Adicionar un servicio qu presta ----------////
    function adicionarServicio(apl) {
        if (regServPresta.getForm().isValid()) {
            regServPresta.getForm().submit({
                url: 'insertarservicio',
                waitMsg: etiquetas.lbMsgEsperaRegServ,
                params: {idsistema: arbolServ.getSelectionModel().getSelectedNode().attributes.id},
                failure: function (form, action) {
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        regServPresta.getForm().reset();
                        if (!apl)
                            winIns.hide();
                        stGpServicio.reload();
                        sm.clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();
                    }
                    if (action.result.codMsg == 3) mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    ////---------- Modificar un servicio qu presta ----------////
    function modificarServicio() {
        if (regServPresta.getForm().isValid()) {
            regServPresta.getForm().submit({
                url: 'modificarservicio',
                waitMsg: etiquetas.lbMsgEsperaModServ,
                params: {idservicio: sm.getSelected().data.idservicio, idsistema: arbolServ.getSelectionModel().getSelectedNode().attributes.id},
                failure: function (form, action) {
                    if (action.result.codMsg != 3) {
                        winMod.hide();
                        regServPresta.getForm().reset();
                        stGpServicio.reload();
                        sm.clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                    }
                    if (action.result.codMsg == 3) mostrarMensaje(action.result.codMsg, action.result.mensaje);

                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    ////---------- Eliminar un servicio qu presta----------////
    function eliminarServicio() {
        mostrarMensaje(2, etiquetas.lbMsgDeseaEliminar, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.Ajax.request({
                    url: 'eliminarservicio',
                    method: 'POST',
                    params: {idservicio: sm.getSelected().data.idservicio},
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            stGpServicio.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if (responseData.codMsg == 3) mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    }
                });
            }
        }
    }
}
