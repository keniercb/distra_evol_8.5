UCID.portal.cargarEtiquetas('gestgestor', cargarInterfaz);
////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar Variables ------------////
var winIns, winMod, idservidor;
function cargarInterfaz(perfil, etiquetas) {

    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        disabled: true,
        id: 'btnAgrgestorBd',
        hidden: true,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn', text: etiquetas.lbBtnAdicionar,
        prevTab: 'btnEligestorBd',
        tooltip: etiquetas.textToolTipadicionar,
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

    btnEliminar = new Ext.Button({
        disabled: true,
        id: 'btnEligestorBd',
        hidden: true,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnEliminar,
        nextTab: 'btnAgrgestorBd',
        tooltip: etiquetas.textToolTipDel,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: Ext.EventObject.DELETE,
                stopEvent: true
            }
        },
        handler: function () {
            eliminargestor();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyugestorBd',
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
                        alert('Ayuda en construcción');
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
    /**btnAyuda = new Ext.Button({
        id: 'btnAyugestorBd',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.textToolTipHelp,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 104,
                alt: true
            }
        },
        handler: function () {
            alert('Ayuda en construcción');
        }
    });*/

    UCID.portal.cargarAcciones(window.frameElement.id);

    ////------------ Arbol Servidores-Gestores ------------////
    arbolGestor = new Ext.tree.TreePanel({
        title: etiquetas.lbTitReg,
        cls: 'x-toolbar',
        frame: false,
        border: false,
        collapsible: true,
        autoScroll: true,
        region: 'west',
        split: true,
        width: '30%',
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarservidores'
        })
    });

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolGestor = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbTit,
        expandable: false,
        expanded: true,
        id: '0'
    });
    arbolGestor.setRootNode(padreArbolGestor);

    ////--------------- Evento para habilitar botones -------------////
    arbolGestor.on('click', function (node, e) {
        btnEliminar.disable();
        btnAdicionar.disable();
        stGpGestor.removeAll();
        if (node.isLeaf()) {
            panelCentral.enable();
            panelCentral.getTopToolbar().items.items[0].focus();
            stGpGestor.removeAll();
            idservidor = node.id;
            stGpGestor.load({params: {start: 0, limit: 15}});
            btnAdicionar.enable();
            btnEliminar.disable();
        }
    }, this);

    ////------------- Store del Grid de Gestores -------------- ////
    stGpGestor = new Ext.data.Store({
        url: 'cargargestores',
        listeners: {'beforeload': function (thisstore, objeto) {
            objeto.params.idservidor = idservidor
        }},
        reader: new Ext.data.JsonReader(
            {
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "id"
            },
            [
                {name: 'idgestor', mapping: 'idgestor'},
                {name: 'gestor', mapping: 'gestor'},
                {name: 'puerto', mapping: 'puerto'},
                {name: 'descripcion', mapping: 'descripcion'}
            ]
        )
    });

    ////------------ Establesco modo de seleccion de grid (single) ---------////
    var sm = new Ext.grid.RowSelectionModel({singleSelect: true});
    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
        btnEliminar.enable();
    }, this);

    ////---------- Defino el grid de gestores ----------////
    var gpGestor = new Ext.grid.GridPanel({
        title: etiquetas.lbMsgGridGestor,
        cls: 'x-toolbar',
        region: 'center',
        frame: false,
        border: false,
        region: 'center',
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        store: stGpGestor,
        sm: sm,
        columns: [
            { hidden: true, hideable: false, dataIndex: 'idgestor'},
            { header: etiquetas.lbGestor, width: 150, dataIndex: 'gestor'},
            { header: etiquetas.lbPuerto, dataIndex: 'puerto'},
            { id: 'expandir', header: etiquetas.lbDes, width: 300, dataIndex: 'descripcion'}
        ],

        loadMask: {store: stGpGestor},
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: stGpGestor,
            id: 'ptbaux',
            displayInfo: true,
            displayMsg: etiquetas.lbMsgPaginado,
            emptyMsg: etiquetas.lbMsgEmpty
        })
    });

    //Trabajo con el PagingToolbar.
    Ext.getCmp('ptbaux').on('change', function () {
        sm.selectFirstRow();
    }, this)

    ////------------------ Store del combobox de expresiones -----------------////
    var storeGestor = new Ext.data.Store({
        url: 'cargarcombogestores',
        reader: new Ext.data.JsonReader(
            {
                id: 'id'
            },
            [
                {name: 'idgestor', mapping: 'idgestor'},
                {name: 'gestor', mapping: 'gestor'}
            ])
    });

    ////------------ Panel del GRID ------------////
    var panelCentral = new Ext.Panel({
        layout: 'border',
        region: 'center',
        disabled: true,
        id: 'grid1',
        keyMapGroup: true,
        items: [gpGestor],
        tbar: [btnAdicionar, btnEliminar, '->', btnAyuda]
    });

    ////--------------Funciones usadas en las TC------------////
    panelCentral.on('afterlayout', function () {
        panelCentral.habilitarKeyMap();
    });

    ////------------- Renderiar el Arbol ----------------////
    var panel = new Ext.Panel({
        layout: 'border',
        items: [arbolGestor, panelCentral]
    });

    var vpGestGestor = new Ext.Viewport({
        layout: 'fit',
        items: panel
    })

    ////------------- Formulario --------------////
    var regGestor = new Ext.FormPanel({
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
                        items: [new Ext.form.ComboBox({
                            emptyText: etiquetas.lbMsgSelect,
                            editable: false,
                            fieldLabel: etiquetas.lbMsgNombreG,
                            store: storeGestor,
                            valueField: 'idgestor',
                            displayField: 'gestor',
                            hiddenName: 'idgestor',
                            forceSelection: true,
                            typeAhead: true,
                            mode: 'local',
                            allowBlank: false,
                            triggerAction: 'all',
                            selectOnFocus: true,
                            anchor: '90%'
                        })]
                    }
                ]
            }
        ]
    });

    ////------------- Cargar la Ventana ---------------////
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
                        title: etiquetas.lbTitAdicionarG, width: 400, height: 150,
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
                                handler: function () {
                                    winIns.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aplicar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAplicar,
                                handler: function () {
                                    adicionargestor('apl');
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                handler: function () {
                                    adicionargestor();
                                }
                            }
                        ]
                    });
                }
                storeGestor.load({params: {idservidor: arbolGestor.getSelectionModel().getSelectedNode().attributes.id}});
                regGestor.getForm().reset();
                winIns.add(regGestor);
                winIns.doLayout();
                winIns.show();


            }
                break;
        }
    }

    ////------------------- Adicionar Gestor ------------------------////
    function adicionargestor(apl) {
        if (regGestor.getForm().isValid()) {
            regGestor.getForm().submit({
                url: 'insertargestorservidor',
                waitMsg: etiquetas.lbMsgAdicionandoG,
                params: {idservidor: arbolGestor.getSelectionModel().getSelectedNode().attributes.id},
                failure: function (form, action) {
                    if (action.result.cod != 3) {
                        mostrarMensaje(action.result.cod, action.result.mensaje);


                        if (!apl)
                            winIns.hide();

                        regGestor.getForm().reset();
                        storeGestor.load({params: {idservidor: arbolGestor.getSelectionModel().getSelectedNode().attributes.id}});
                        stGpGestor.reload();
                        sm.clearSelections();
                        btnEliminar.disable();
                    }

                    if (action.result.cod == 3) mostrarMensaje(action.result.cod, action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    ////------------------- Eliminar Gestor ------------------------////
    function elimina1(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Ajax.request({
                url: 'eliminargestores',
                method: 'POST',
                params: {idservidor: arbolGestor.getSelectionModel().getSelectedNode().attributes.id, idgestor: sm.getSelected().data.idgestor},
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.cod == 1) {
                        mostrarMensaje(responseData.cod, responseData.mensaje);
                        stGpGestor.reload();
                        sm.clearSelections();
                        btnEliminar.disable();
                    }
                    if (responseData.cod == 3) mostrarMensaje(responseData.cod, responseData.mensaje);
                }
            });
        }
    }

    function eliminargestor() {
        mostrarMensaje(2, etiquetas.lbMsgEliminarG, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.Ajax.request({
                    url: 'comprobargestores',
                    method: 'POST',
                    params: {idservidor: arbolGestor.getSelectionModel().getSelectedNode().attributes.id, idgestor: sm.getSelected().data.idgestor},
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.tiene == 1)
                            mostrarMensaje(2, etiquetas.lbMsgEliminarGA, elimina1)
                        if (responseData.cod == 1) {
                            mostrarMensaje(responseData.cod, responseData.mensaje);
                            stGpGestor.reload();
                            sm.clearSelections();
                            btnEliminar.disable();
                        }
                        if (responseData.cod == 3) mostrarMensaje(responseData.cod, responseData.mensaje);
                    }
                });
            }
        }
    }
}



