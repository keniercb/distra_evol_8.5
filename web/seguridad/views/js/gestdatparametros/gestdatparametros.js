UCID.portal.cargarEtiquetas('gestdatparametros', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();
/*****  Temporal para cargar los combox  *****/
var dataTipoData = [
    ['boolean', 'boolean'],
    ['date', 'date'],
    ['int', 'int'],
    ['time', 'time'],
    ['varchar', 'varchar']
];
var storeDataTipoData = new Ext.data.SimpleStore({
    fields: ['data', 'iddata'],
    data: dataTipoData

});
/*****  EndOF Temporal  *****/

////------------ Declarar variables ------------////
var winIns, winMod, winCamb, tipos, referencia;

////------------ Area de Validaciones ------------////

referencia = /(^([a-zA-Z])+([a-zA-Z\d\_]*\.{0,1})|([a-zA-Z])+([a-zA-Z\d\_]*\.{0,1})(\/){0,1}([a-zA-Z])+([a-zA-Z\d\.\-\@\#\_]*))+$/
tipos = /(^([a-zA-Z��������])+([a-zA-Z��������\d\.\-\@\#\_]*))$/;
function cargarInterfaz(perfil, etiquetas) {

    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({disabled: true, id: 'btnAgrParametros', hidden: true, icon: perfil.dirImg + 'adicionar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnAdicionar + '</b>', handler: function () {
        winForm('Ins');
    }  });
    btnModificar = new Ext.Button({disabled: true, id: 'btnModParametros', hidden: true, icon: perfil.dirImg + 'modificar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnModificar + '</b>', handler: function () {
        winForm('Mod');
    } });
    btnEliminar = new Ext.Button({disabled: true, id: 'btnEliParametros', hidden: true, icon: perfil.dirImg + 'eliminar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnEliminar + '</b>', handler: function () {
        eliminarParametro();
    } });
    //btnAyuda = new Ext.Button({id: 'btnAyuParametros', hidden: true, icon: perfil.dirImg + 'ayuda.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnAyuda + '</b>' });
    btnAyuda = new Ext.Button({
        id: 'btnAyuParametros',
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
        width: '30%',
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarservicios',
        })
    });

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolFunc = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbRootNodeArbolServ,
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
        stGpParametros.removeAll();
        if (node.isLeaf()) {
            stGpParametros.removeAll();
            stGpParametros.load({params: {start: 0, limit: 15, idfunciones: node.id}});
            btnAdicionar.enable();
        }
    }, this);

    ////------------ Store del Grid de Funciones ------------////
    stGpParametros = new Ext.data.Store({
        url: 'cargarparametros',
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "idfunciones"
            },
            [
                {name: 'idfunciones'},
                {name: 'idparametros'},
                {name: 'denominacion'},
                {name: 'puedesernull'},
                {name: 'tipoparametro'},
                {name: 'valordefecto'},
                {name: 'descripcion'}


            ])
    });

    ////------------ Establesco modo de seleccion de grid (single) ------------////
    sm = new Ext.grid.RowSelectionModel({singleSelect: true});
    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
        btnModificar.enable();
        btnEliminar.enable();
    }, this);

    ////------------ Defino el grid de Parametros ------------////
    var gpParametros = new Ext.grid.GridPanel({
        frame: true,
        title: etiquetas.lbTitlbTitParamReg,
        region: 'center',
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        store: stGpParametros,
        sm: sm,
        columns: [
            {hidden: true, hideable: false, dataIndex: 'idparametros'},
            {hidden: true, hideable: false, dataIndex: 'idfunciones'},
            {header: etiquetas.lbCampoDenom, width: 100, dataIndex: 'denominacion'},
            {header: etiquetas.lbCampoTipoParam, width: 150, dataIndex: 'tipoparametro', id: 'expandir'},
            {header: etiquetas.lbCampoValorDefecto, width: 100, dataIndex: 'valordefecto'},
            {header: etiquetas.lbCampoEsNull, width: 100, dataIndex: 'puedesernull'}
        ],
        loadMask: {store: stGpParametros},


        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: stGpParametros,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgPaginado,
            emptyMsg: etiquetas.lbMsgEmpty
        })
    });

    ////------------ Panel con los componentes ------------////
    var panel = new Ext.Panel({
        layout: 'border',
        title: etiquetas.lbTitGestParam,
        items: [gpParametros, arbolFunc],
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnAyuda]
    });

    ////------------ Formulario ------------////
    var regParametros = new Ext.FormPanel({
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
                                fieldLabel: etiquetas.lbCampoDenom,
                                id: 'denominacion',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgBlankText,
                                //maskRe: tipos,
                                maxLength: 30,
                                regex: tipos,
                                regexText: etiquetas.lbMsgExpRegDenom,
                                anchor: '95%'
                            },
                            {

                                xtype: 'combo',
                                fieldLabel: etiquetas.lbCampoTipoParam,
                                id: 'tipoparametro',
                                displayField: 'iddata',
                                valueField: 'data',
                                store: dataTipoData,
                                triggerAction: 'all',
                                typeAhead: true,
                                allowBlank: false,
                                blankText: etiquetas.lbMsgBlankText,
                                mode: 'local',
                                editable: false,
                                emptyText: etiquetas.lbMsgEmptyText,
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
                                fieldLabel: etiquetas.lbCampoValorDefecto,
                                id: 'valordefecto',
                                name: 'valordefecto',
                                allowBlank: true,
                                blankText: etiquetas.lbMsgBlankText,
                                regexText: etiquetas.lbMsgExpRegValDef,
                                //maskRe:/^^[0-9]+$/,
                                //regex:/^^[0-9]+$/,
                                anchor: '95%'
                            }
                        ]

                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        style: 'margin-left:10px;margin-top:18px',
                        items: [
                            {
                                boxLabel: etiquetas.lbCampoEsNull,
                                xtype: 'checkbox',
                                id: 'puedesernull',
                                hideLabel: true,
                                name: 'puedesernull',
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
                                fieldLabel: 'Descripci&oacute;n',
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
                        title: etiquetas.lbTitlbTitAdicionarParam, width: 500, height: 300,
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
                                    adicionarParametro('apl');
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                handler: function () {
                                    adicionarParametro();
                                }
                            }
                        ]
                    });
                }
                regParametros.getForm().reset();
                winIns.add(regParametros);
                winIns.doLayout();
                winIns.show();
            }
                break;
            case 'Mod':
            {
                if (!winMod) {
                    winMod = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
                        title: etiquetas.lbTitModificarParam, width: 500, height: 300,
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
                                    modificarParametro();
                                }
                            }
                        ]
                    });
                }
                regParametros.getForm().reset();
                winMod.add(regParametros);
                winMod.doLayout();
                regParametros.getForm().loadRecord(sm.getSelected());
                winMod.show();
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
    function adicionarParametro(apl) {
        if (regParametros.getForm().isValid()) {
            regParametros.getForm().submit({
                url: 'insertarparametro',
                waitMsg: etiquetas.lbMsgEsperaRegParam,
                params: {idfunciones: arbolFunc.getSelectionModel().getSelectedNode().attributes.id},
                failure: function (form, action) {
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        regParametros.getForm().reset();
                        if (!apl)
                            winIns.hide();
                        stGpParametros.reload();
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
    function modificarParametro() {
        if (regParametros.getForm().isValid()) {
            regParametros.getForm().submit({
                url: 'modificarparametro',
                waitMsg: etiquetas.lbMsgEsperaModParam,
                params: {idparametros: sm.getSelected().data.idparametros, idfunciones: sm.getSelected().data.idfunciones},
                failure: function (form, action) {
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        stGpParametros.reload();
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
    function eliminarParametro() {
        mostrarMensaje(2, etiquetas.lbMsgDeseaEliminar, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.Ajax.request({
                    url: 'eliminarparametro',
                    method: 'POST',
                    params: {idparametros: sm.getSelected().data.idparametros},
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            stGpParametros.reload();
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

    ////------------ Buscar Funcionalidad ------------////
    function buscarfuncionalidad(funcionalidad) {
        stGpParametros.load({params: {denominacion: funcionalidad, idsistema: arbolFunc.getSelectionModel().getSelectedNode().attributes.id, start: 0, limit: 20}});
    }
}