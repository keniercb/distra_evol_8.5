UCID.portal.cargarEtiquetas('gestdatfunciones', cargarInterfaz)

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar variables ------------////
var winIns, winMod, winCamb, tipos, referencia;

////------------ Area de Validaciones ------------////

referencia = /(^([a-zA-Z])+([a-zA-Z\d\_]*\.{0,1})|([a-zA-Z])+([a-zA-Z\d\_]*\.{0,1})(\/){0,1}([a-zA-Z])+([a-zA-Z\d\_]*))+$/
tipos = /(^([a-zA-Z��������])+([a-zA-Z��������\d\.\-\@\#\_]*))$/;

function cargarInterfaz(perfil, etiquetas) {

    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({disabled: true, id: 'btnAgrFunciones', hidden: true, icon: perfil.dirImg + 'adicionar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnAdicionar + '</b>', handler: function () {
        winForm('Ins');
    }  });
    btnModificar = new Ext.Button({disabled: true, id: 'btnModFunciones', hidden: true, icon: perfil.dirImg + 'modificar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnModificar + '</b>', handler: function () {
        winForm('Mod');
    } });
    btnEliminar = new Ext.Button({disabled: true, id: 'btnEliFunciones', hidden: true, icon: perfil.dirImg + 'eliminar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnEliminar + '</b>', handler: function () {
        eliminarFuncionalidad();
    } });
    //btnAyuda = new Ext.Button({id: 'btnAyuFunciones', hidden: true, icon: perfil.dirImg + 'ayuda.png', iconCls: 'btn', text: '<b>Ayuda</b>' });
    btnAyuda = new Ext.Button({
        id: 'btnAyuFunciones',
        iconCls: 'ayuda',
        text: '<b>Ayuda</b>',
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
                            //    cargarAyuda();
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
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

    ////------------ Arbol Sistemas ------------////
    arbolFunc = new Ext.tree.TreePanel({
        title: etiquetas.lbTitServReg,
        collapsible: true,
        autoScroll: true,
        region: 'west',
        split: true,
        width: '37%',
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarservicios'
        })
    });

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolFunc = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbRootNodeServ,
        expandable: false,
        expanded: true,
        id: '0'
    });
    arbolFunc.setRootNode(padreArbolFunc);

    ////------------ Evento para habilitar botones ------------////
    arbolFunc.on('click', function (node, e) {
        btnModificar.disable();
        btnEliminar.disable();
        btnAdicionar.disable();
        stGpFunciones.removeAll();
        if (node.isLeaf()) {
            stGpFunciones.removeAll();
            stGpFunciones.load({params: {start: 0, limit: 15, idservicio: node.id}});
            btnAdicionar.enable();
        }
    }, this);

    ////------------ Store del Grid de Funciones ------------////
    stGpFunciones = new Ext.data.Store({
        url: 'cargarfunciones',
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "idfunciones"
            },
            [
                {name: 'idfunciones'},
                {name: 'idservicio'},
                {name: 'denominacion'},
                {name: 'descripcion'}


            ])
    });

    ////------------ Establesco modo de seleccion de grid (single) ------------////
    sm = new Ext.grid.RowSelectionModel({singleSelect: true});
    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
        btnModificar.enable();
        btnEliminar.enable();
    }, this);

    ////------------ Defino el grid de Funcionalidades ------------////
    var gpFunciones = new Ext.grid.GridPanel({
        frame: true,
        title: etiquetas.lbTitFuncReg,
        region: 'center',
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        store: stGpFunciones,
        sm: sm,
        columns: [
            {hidden: true, hideable: false, dataIndex: 'idfunciones'},
            {hidden: true, hideable: false, dataIndex: 'idservicio'},
            {header: etiquetas.lbCampoDenominacion, width: 150, dataIndex: 'denominacion'},
            {header: etiquetas.lbCampoDescripcion, width: 250, dataIndex: 'descripcion', id: 'expandir'}
        ],
        loadMask: {store: stGpFunciones},


        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: stGpFunciones,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgPaginadoFun,
            emptyMsg: etiquetas.lbMsgEmptyFun
        })
    });

    ////------------ Panel con los componentes ------------////
    var panel = new Ext.Panel({
        layout: 'border',
        title: etiquetas.lbTitGestiFunc,
        items: [gpFunciones, arbolFunc],
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnAyuda]
    });

    ////------------ Formulario ------------////
    var regFunciones = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
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
                                fieldLabel: etiquetas.lbDenominacion,
                                id: 'denominacion',
                                maxLength: 40,
                                allowBlank: false,
                                blankText: etiquetas.lbMsgBlankFun,
                                //maskRe: tipos,
                                regex: tipos,
                                regexText: etiquetas.lbMsgRegExpDenom,
                                anchor: '90%'
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
        ]
    });
    ////------------ Cargar la ventana ------------////
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
                        title: etiquetas.lbTitAdicionarFun, width: 400, height: 280,
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCancelar,
                                handler: function () {
                                    winIns.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aplicar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAplicar,
                                handler: function () {
                                    adicionarFuncionalidad('apl');
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                handler: function () {
                                    adicionarFuncionalidad();
                                }
                            }
                        ]
                    });
                }
                regFunciones.getForm().reset();
                winIns.add(regFunciones);
                winIns.doLayout();
                winIns.show();
            }
                break;
            case 'Mod':
            {
                if (!winMod) {
                    winMod = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
                        title: etiquetas.lbTitModificarFun, width: 400, height: 280,
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCancelar,
                                handler: function () {
                                    winMod.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                handler: function () {
                                    modificarFuncionalidad();
                                }
                            }
                        ]
                    });
                }
                regFunciones.getForm().reset();
                winMod.add(regFunciones);
                winMod.doLayout();
                winMod.show();
                regFunciones.getForm().loadRecord(sm.getSelected());
            }
                break;
        }
    }

    ////------------ Viewport ------------////
    var vpGestFuncionalidad = new Ext.Viewport({
        layout: 'fit',
        items: panel
    })


    ////------------ Adicionar Funcionalidades ------------////
    function adicionarFuncionalidad(apl) {
        if (regFunciones.getForm().isValid()) {
            regFunciones.getForm().submit({
                url: 'insertarfuncion',
                waitMsg: etiquetas.lbMsgEsperaReg,
                params: {idservicio: arbolFunc.getSelectionModel().getSelectedNode().attributes.id},
                failure: function (form, action) {
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        regFunciones.getForm().reset();
                        if (!apl)
                            winIns.hide();
                        stGpFunciones.reload();
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

    ////------------ Modififcar Funcionalidad ------------////
    function modificarFuncionalidad() {
        if (regFunciones.getForm().isValid()) {
            regFunciones.getForm().submit({
                url: 'modificarfuncion',
                waitMsg: etiquetas.lbMsgEsperaMod,
                params: {idfunciones: sm.getSelected().data.idfunciones, idservicio: sm.getSelected().data.idservicio},
                failure: function (form, action) {
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        stGpFunciones.reload();
                        winMod.hide();
                    }
                    if (action.result.codMsg == 3) mostrarMensaje(action.result.codMsg, action.result.mensaje);

                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    ////------------ Eliminar Funcionalidad ------------////
    function eliminarFuncionalidad() {
        mostrarMensaje(2, etiquetas.lbMsgDeseaEliminar, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.Ajax.request({
                    url: 'eliminarfuncion',
                    method: 'POST',
                    params: {idfunciones: sm.getSelected().data.idfunciones},
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            stGpFunciones.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if (responseData.codMsg == 3)
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);


                    }
                });
            }
        }
    }

    ////------------ Buscar Funcionalidad ------------////
    function buscarfuncionalidad(funcionalidad) {
        stGpFunciones.load({params: {denominacion: funcionalidad, idsistema: arbolFunc.getSelectionModel().getSelectedNode().attributes.id, start: 0, limit: 20}});
    }
}