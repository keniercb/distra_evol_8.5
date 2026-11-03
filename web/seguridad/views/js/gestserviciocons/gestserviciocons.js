UCID.portal.cargarEtiquetas('gestserviciocons', cargarInterfaz);

// 3. Inicializo el singlenton QuickTips
Ext.QuickTips.init();


////------------ Declarar variables ------------////
var sistema;
var winIns;

function cargarInterfaz(perfil, etiquetas) {
    btnAdicionar = new Ext.Button({id: 'btnAgrServCons', hidden: true, icon: perfil.dirImg + 'adicionar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnAdicionar + '</b>', handler: function () {
        winForm('Ins');
    } });
    btnEliminar = new Ext.Button({disabled: true, id: 'btnEliServCons', hidden: true, icon: perfil.dirImg + 'eliminar.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnEliminar + '</b>', handler: function () {
        eliminarServicio();
    }});
    //btnAyuda = new Ext.Button({id: 'btnAyuServCons', hidden: true, icon: perfil.dirImg + 'ayuda.png', iconCls: 'btn', text: '<b>' + etiquetas.lbBtnAyuda + '</b>' });
    btnAyuda = new Ext.Button({
        id: 'btnAyuServCons',
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
    ////------------ Arbol de sistemas ------------////
    arbolSistema = new Ext.tree.TreePanel({
        title: etiquetas.lbTitArbolSistemas,
        collapsible: true,
        autoScroll: true,
        region: 'west',
        split: true,
        width: '30%',
        margins: '2 0 2 2',
        loader: new Ext.tree.TreeLoader({
            dataUrl: '../gestsistema/cargarsistema'
        })
    });

    ////------------ Crear nodo padre del arbol ------------////
    padreSistema = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbTitRootNodeArbolSubsist,
        expandable: false,
        expanded: true,
        id: '0'
    });

    ////------------ Habilitar botones y cargar id de Nodos ------------////
    arbolSistema.setRootNode(padreSistema);

    ////------------ Evento para habilitar botones ------------////
    arbolSistema.on('click', function (node, e) {
        sistema = node.id;
        //btnModificar.disable();
        btnEliminar.disable();
        btnAdicionar.disable();
        storeGrid.removeAll();
        if (node.isLeaf()) {
            storeGrid.removeAll();
            storeGrid.load({params: {start: 0, limit: 15, idsistema: node.id}});
            storeConsSrv.removeAll();
            storeConsSrv.load({params: {idsistema: node.id}});
            btnAdicionar.enable();
        }
    }, this);

    ////------------ Store del Grid ------------////
    var storeGrid = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'cargarserviciocons'
        }),
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "ide"
            },
            [
                {name: 'idservicio', mapping: 'idservicio'},
                {name: 'denominacion', mapping: 'denominacion'},
                {name: 'descripcion', mapping: 'descripcion'},
                {name: 'wsdl', mapping: 'wsdl'},
                {name: 'idsistema', mapping: 'idsistema'}
            ])
    });

    ////------------ Modo seleccion del Grid ------------////
    var sm = new Ext.grid.RowSelectionModel({singleSelect: true});

    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
        btnEliminar.enable();
    }, this);

    ////----------- Grid ------------////
    var grid = new Ext.grid.GridPanel({
        title: etiquetas.lbTitServiciosConsume,
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        margins: '2 2 2 -4',
        store: storeGrid,
        sm: sm,
        columns: [
            {hidden: true, hideable: false, dataIndex: 'idservicio'},
            {hidden: true, hideable: false, dataIndex: 'idsistema'},
            {header: etiquetas.lbDenominacion, width: 150, dataIndex: 'denominacion'},
            {header: etiquetas.lbDescripcion, width: 150, dataIndex: 'descripcion'},
            {header: etiquetas.lbWSDL, width: 200, dataIndex: 'wsdl', id: 'expandir'}
        ],
        loadMask: {store: storeGrid},

        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: storeGrid,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgPaginado,
            emptyMsg: etiquetas.lbMsgEmpty
        })
    });

    ////------------ Panel con los componentes ------------////
    var panel = new Ext.Panel({
        title: etiquetas.lbTitGestServCons,
        layout: 'border',
        renderTo: 'panel',
        items: [grid, arbolSistema],
        tbar: [btnAdicionar, btnEliminar, btnAyuda]
    });

    ////------------ Viewport ------------////
    var vpGestSistema = new Ext.Viewport({
        layout: 'fit',
        items: panel
    })

    var storeConsSrv = new Ext.data.Store({
        url: 'cargarservicionocons',
        reader: new Ext.data.JsonReader({
                id: 'idgrupos'
            },
            [
                {name: 'idservicio', mapping: 'idservicio'},
                {name: 'denominacion', mapping: 'denominacion'}
            ])
    });

    ////------------ Registrar Accion ------------////
    var formConsServ = new Ext.FormPanel({
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
                        items: [new Ext.form.ComboBox({
                            emptyText: etiquetas.lbMsgBlankTextServ,
                            editable: false,
                            fieldLabel: etiquetas.lbServCons,
                            store: storeConsSrv,
                            valueField: 'idservicio',
                            displayField: 'denominacion',
                            hiddenName: 'idservicio',
                            forceSelection: true,
                            typeAhead: true,
                            mode: 'local',
                            allowBlank: false,
                            triggerAction: 'all',
                            selectOnFocus: true,
                            anchor: '100%'
                        })]
                    }
                ]
            }
        ]
    });

    ////------------ Cargar ventanas ------------////
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
                        title: etiquetas.lbTitAdicionarServCons, width: 500, height: 150,
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
                winIns.add(formConsServ);
                winIns.doLayout();
                winIns.show();
            }
                break;
        }
    }

    ////------------ Funcion Adicionar ------------////
    function adicionarServicio(apl) {
        if (formConsServ.getForm().isValid()) {
            formConsServ.getForm().submit({
                url: 'insertarserviciocons',
                waitMsg: etiquetas.lbMsgRegServCons,
                params: {idsistema: arbolSistema.getSelectionModel().getSelectedNode().attributes.id},
                failure: function (form, action) {
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        formConsServ.getForm().reset();
                        if (!apl)
                            winIns.hide();
                        storeGrid.reload();
                        sm.clearSelections();
                        //btnModificar.disable();
                        btnEliminar.disable();
                    }
                    if (action.result.codMsg == 3) mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    ////------------ Funcion eliminar ------------////
    function eliminarServicio() {
        mostrarMensaje(2, etiquetas.lbMsgDeseaEliminar, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.Ajax.request({
                    url: 'eliminarserviciocons',
                    method: 'POST',
                    params: {idsistema: sm.getSelected().data.idsistema, idservicio: sm.getSelected().data.idservicio},
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            storeGrid.reload();
                            sm.clearSelections();
                            btnEliminar.disable();
                        }
                        if (responseData.codMsg == 3) mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    }
                });
            }
        }
    }

}