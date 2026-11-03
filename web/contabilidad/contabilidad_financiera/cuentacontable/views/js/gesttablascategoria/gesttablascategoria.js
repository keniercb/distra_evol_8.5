Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
var fpGestionTablas, fpRegistroTablas, stGestionTablas, gpGestionTablas, vpGestionTablas, smGpTablas, winInsTabla, winModTabla, gpGestionCategorias, stGestionCategoria, smGpGestionTablas, cmGpGestionTablas, cmbFiltroEsquemas, lastSelectRow, kmTeclasCaliente;
Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    params: {
        vista: 'gesttablascategoria'
    },
    callback: function(options, success, response) {
        var etiquetas = Ext.decode(response.responseText);
        cargarInterfaz(etiquetas);
    }
});
function cargarInterfaz(etiquetas) {
    var etiquetasTablas = etiquetas;
    btnRegistrarTabla = new Ext.Button({
        id: 'btnRegistrarTabla',
        iconCls: 'crearreporte',
//          icon: perfil.dirImg + 'crearreporte.png',
        disabled: true,
        text: etiquetasTablas.lbBtnRegistrar,
        tooltip: etiquetasTablas.lbTtRegistrar,
        handler: function() {
            kmTeclasCaliente.disable();
            stGestionCategorias.load({params: {
                    start: 0,
                    limit: 5
                }});
            winFpGestionTablas('Reg');
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnHelpTablasCat',
        iconCls: 'ayuda',
        text: etiquetasTablas.lbBtnAyuda,
        tooltip: etiquetasTablas.lbTtAyuda
    });
    btnAdicionarTabla = new Ext.Button({
        hidden: true,
        iconCls: 'adicionar',
        text: etiquetasTablas.lbBtnAdicionar,
        tooltip: etiquetasTablas.lbTtAdicionar,
        handler: function() {
            winFpGestionTablas('Ins');
        }
    });
    btnModificarTabla = new Ext.Button({
        disabled: true,
        hidden: true,
        iconCls: 'modificar',
        text: etiquetasTablas.lbBtnModificar,
        tooltip: etiquetasTablas.lbTtEliminar,
        handler: function() {
            winFpGestionTablas('Mod');
        }
    });
    btnEliminarTabla = new Ext.Button({
        disabled: true,
        hidden: true,
        iconCls: 'eliminar',
        text: etiquetasTablas.lbBtnEliminar,
        tooltip: etiquetasTablas.lbTtEliminar,
        handler: function() {
            eliminarTabla();
        }
    });
    storeEsquema = new Ext.data.Store({
        url: 'cargaresquema',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'esquemas'
        }, ['esquema'])
    });
    cmbFiltroEsquemas = new Ext.form.ComboBox({
        id: 'cmbFiltroEsquemas',
        emptyText: etiquetasTablas.lbSeleccionar,
        editable: false,
        tabIndex: 1,
        fieldLabel: etiquetasTablas.lbEsquema,
        store: storeEsquema,
        valueField: 'esquema',
        displayField: 'esquema',
        hiddenName: 'esquema',
        forceSelection: true,
        typeAhead: true,
        mode: 'local',
        allowBlank: false,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '97.5%',
        listeners: {
            select: function(combo, record) {
                stGestionTablas.load({
                    params: {
                        start: 0,
                        limit: 20,
                        esquema: record.data.esquema
                    }
                });
            }
        }
    });
    stGestionCategorias = new Ext.data.Store({
        url: 'cargarcategorias',
        listeners: {
            load: function(store, records) {
                if (store.getTotalCount() > 0) {
                    for (i = 0; i < records.length; i++) {
                        if (records[i].data.registrado) {
                            smGpGestionCategorias.selectRow(i, true);
                        } else {
                            smGpGestionCategorias.deselectRow(i);
                        }
                    }
                } else {
                    mostrarMensaje(1, etiquetasTablas.lbNoResults);
                }
            },
            beforeload: function(store) {
                store.baseParams.tabla = smGpGestionTablas.getSelected().data.nombre;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'campos',
            id: 'idcategoria',
            totalProperty: 'totalRecords'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idcategoria'
            }, {
                name: 'registrado',
                type: 'boolean'
            }])
    });
    smGpGestionCategorias = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function(sm, rowIndex, record) {
                record.set('registrado', true);
                Ext.getCmp('idgpGestionCategorias').getView().addRowClass(rowIndex, "negrita");
                Ext.getCmp('idbtnReg').enable();
            },
            rowdeselect: function(sm, rowIndex, record) {
                record.set('registrado', false);
                Ext.getCmp('idgpGestionCategorias').getView().removeRowClass(rowIndex, "negrita");
                Ext.getCmp('idbtnReg').disable();
            }
        }
    });
    cmGpGestionCategorias = new Ext.grid.ColumnModel([{
            id: 'expandir',
            header: etiquetasTablas.lbCategoria,
            tooltip: etiquetasTablas.lbTtCategoria,
            dataIndex: 'denominacion',
            sortable: true
        }, {
            hideable: false,
            hidden: true,
            dataIndex: 'idcategoria',
            sortable: true
        }, smGpGestionCategorias]);
    gpGestionCategorias = new Ext.grid.GridPanel({
        id: 'idgpGestionCategorias',
        frame: false,
        border: false,
        sm: smGpGestionCategorias,
        loadMask: {
            store: stGestionCategorias,
            msg: etiquetasTablas.lbCargando
        },
        viewConfig: {
            forceFit: true
        },
        autoscroll: true,
        stripeRows: true,
        autoExpandColumn: 'expandir',
        store: stGestionCategorias,
        height: 200,
        anchor: '100%',
        cm: cmGpGestionCategorias,
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 5,
            store: stGestionCategorias,
            displayInfo: true,
            emptyMsg: etiquetasTablas.lbEmptyMsg,
            displayMsg: etiquetasTablas.lbDisplayMsg
        })
    });
    fpGestionTablas = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        border: 'false',
        reader: new Ext.data.JsonReader({
            root: "campos",
            id: "idtable"
        }, [{
                name: 'idtable'
            }, {
                name: 'denomtable'
            }, {
                name: 'fechaini'
            }, {
                name: 'fechafin'
            }]),
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .5,
                style: 'margin:5 0 0 10',
                layout: 'form',
                items: [{
                    xtype: 'textfield',
                    tabIndex: 1,
                    fieldLabel: 'Nombre',
                    id: 'nombre',
                    anchor: '97.5%'
                }]
            }, {
                columnWidth: .5,
                style: 'margin:5 0 0 10',
                layout: 'form',
                items: [cmbFiltroEsquemas]
            }, {
                columnWidth: .5,
                layout: 'form',
                style: 'margin:0 0 0 10',
                items: [{
                    xtype: 'checkbox',
                    tabIndex: 2,
                    hideLabel: true,
                    boxLabel: 'Arbol',
                    name: 'tree',
                    anchor: '90%'
                    }]
            }, {
                columnWidth: .5,
                layout: 'form',
                items: [{
                    xtype: 'checkbox',
                    tabIndex: 3,
                    hideLabel: true,
                    boxLabel: 'Habilitado',
                    name: 'enabled',
                    anchor: '100%'
                    }]
            }, {
                columnWidth: 1,
                layout: 'fit',
                items: [gpGestionCategorias]
            }]
        }]
    });
    fpRegistroTablas = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        border: false,
        reader: new Ext.data.JsonReader({
            root: "campos",
            id: "idtable"
        }, [
            {name: 'idtable'},
            {name: 'denomtable'},
            {name: 'fechaini'},
            {name: 'fechafin'}
            ]
        ),
        items: [gpGestionCategorias]
    });
    stGestionTablas = new Ext.data.Store({
        url: 'cargargridtablas',
        listeners: {
            load: function() {
                if (!lastSelectRow)
                {
                    gpGestionTablas.getSelectionModel().selectFirstRow();
                }
                gpGestionTablas.getSelectionModel().selectRow(lastSelectRow);
                btnRegistrarTabla.focus();
            },
            beforeload: function(store, options) {
                store.baseParams.esquema = cmbFiltroEsquemas.getValue();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'campos',
            totalProperty: 'cantidad',
            id: 'nomenclador'
        }, [{
                name: 'nombre'
            }, {
                name: 'categorias'
            }])
    });
    smGpGestionTablas = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            selectionchange: Cambio,
            beforerowselect: function(xSelModel, xRowIndex, keepExisting, xRecord) {
                btnEliminarTabla.enable();
            },
            rowselect: function(xSelModel, xRowIndex, xRecord) {
                Ext.getCmp('idgpGestionTablas').getView().addRowClass(xRowIndex, "negrita");
                lastSelectRow = gpGestionTablas.getStore().indexOf(xSelModel.getSelected());
            },
            rowdeselect: function(selectioModel, rowIndex, record) {
                Ext.getCmp('idgpGestionTablas').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    gpGestionTablas = new Ext.grid.GridPanel({
        id: 'idgpGestionTablas',
        frame: false,
        border: false,
        store: stGestionTablas,
        sm: smGpGestionTablas,
        autoscroll: true,
        stripeRows: true,
        viewConfig: {
            forceFit: true
        },
        loadMask: {
            store: stGestionTablas,
            msg: etiquetasTablas.lbCargando
        },
        autoExpandColumn: 'expandir',
        columns: [{
            header: etiquetasTablas.lbTabla,
            tooltip: etiquetasTablas.lbTtTabla,
            width: 100,
            sortable: true,
            dataIndex: 'nombre'
        }, {
            id: 'expandir',
            width: 300,
            sortable: true,
            header: etiquetasTablas.lbCategorias,
            tooltip: etiquetasTablas.lbTtCategorias,
            dataIndex: 'categorias'
        }],
        tbar: [btnAdicionarTabla, btnModificarTabla, btnEliminarTabla],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stGestionTablas,
            displayInfo: true,
            emptyMsg: etiquetasTablas.lbEmptyMsg,
            displayMsg: etiquetasTablas.lbDisplayMsg
        })
    });
    pnlGestTablas = new Ext.Panel({
        layout: 'fit',
        border: false,
        frame: false,
        items: [gpGestionTablas],
        listeners: {render: function() {
            btnRegistrarTabla.focus();
        }},
        tbar: [{
            xtype: 'tbtext',
            text: etiquetasTablas.lbEsquemaDot
        }, cmbFiltroEsquemas, '-', btnRegistrarTabla, '->', btnAyuda],
        keys: kmTeclasCaliente = new Ext.KeyMap(Ext.getBody(), [{
            key: 'h',
            alt: true,
            fn: function() {
                btnAyuda.handler.call();
            }
        }, {
            key: 'r',
            alt: true,
            ctrl: true,
            fn: function() {
                if (!btnRegistrarTabla.disabled) {
                    btnRegistrarTabla.handler.call();
                }
            }
        }])
    });
    vpGestionTablas = new Ext.Viewport({
        layout: 'fit',
        items: pnlGestTablas
    });
    smGpTablas = gpGestionTablas.getSelectionModel();
    function winFpGestionTablas(opcion) {
        switch (opcion) {
            case 'Reg':
                {
                    fpRegistroTablas.getForm().reset();
                    if (!winInsTabla) {
                        id:'winRegTabla',
                            winRegTabla = new Ext.Window({
                                modal: true,
                                border: false,
                                closeAction: 'hide',
                                layout: 'fit',
                                title: etiquetasTablas.lbTtlRegistrar,
                                width: 600,
                                autoValidate: false,
                                height: 280,
                                constrain: true,
                                defaultButton: 0,
                                listeners: {
                                    'show': function() {
                                        Ext.getCmp('idbtnReg').disable();
                                    },
                                    'hide': function() {
                                        btnRegistrarTabla.focus();
                                        kmTeclasCaliente.enable();
                                    },
                                    'render': function() {
                                        winRegTabla.focus();
                                    }},
                                buttons: [{
                                        iconCls: 'cancelar',
                                        id: 'btnCancelarReg',
                                        text: etiquetasTablas.lbBtnCancelar,
                                        tooltip: etiquetasTablas.lbTtCancelar,
                                        handler: function() {
                                            winRegTabla.hide();
                                        }
                                    }, {
                                        iconCls: 'aceptar',
                                        id: 'idbtnReg',
                                        disabled: true,
                                        text: etiquetasTablas.lbBtnAceptar,
                                        tooltip: etiquetasTablas.lbTtAceptar,
                                        handler: function() {
                                            registrarTabla();
                                        }
                                    }]
                            });
                    }
                    winRegTabla.add(fpRegistroTablas);
                    winRegTabla.doLayout();
                    winRegTabla.show();
                }
                break;
            case 'Ins':
                {
                    fpGestionTablas.getForm().reset();
                    if (!winInsTabla) {
                        winInsTabla = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            constrain: true,
                            defaultButton: 0,
                            title: etiquetasTablas.lbTtlAdicionar,
                            width: 500,
                            autoHeight: true,
                            buttons: [{
                                    iconCls: 'cancelar',
                                    text: etiquetasTablas.lbBtnCancelar,
                                    tooltip: etiquetasTablas.lbTtCancelar,
                                    handler: function() {
                                        winInsTabla.hide();
                                    }
                                }, {
                                    iconCls: 'aplicar',
                                    text: etiquetasTablas.lbBtnAplicar,
                                    tooltip: etiquetasTablas.lbTtAplicar,
                                    handler: function() {
                                        adicionarTabla('apl');
                                    }
                                }, {
                                    iconCls: 'aceptar',
                                    text: etiquetasTablas.lbBtnAceptar,
                                    tooltip: etiquetasTablas.lbTtAceptar,
                                    handler: function() {
                                        adicionarTabla();
                                    }
                                }]
                        });
                    }
                    winInsTabla.add(fpGestionTablas);
                    winInsTabla.doLayout();
                    winInsTabla.show();
                }
                break;
            case 'Mod':
                {
                    if (!winModTabla) {
                        winModTabla = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: etiquetasTablas.lbTtlModificar,
                            width: 550,
                            height: 240,
                            constrain: true,
                            defaultButton: 0,
                            buttons: [{
                                    iconCls: 'cancelar',
                                    text: etiquetasTablas.lbBtnCancelar,
                                    tooltip: etiquetasTablas.lbTtCancelar,
                                    handler: function() {
                                        winModTabla.hide();
                                    }
                                }, {
                                    iconCls: 'aceptar',
                                    text: etiquetasTablas.lbBtnAceptar,
                                    tooltip: etiquetasTablas.lbTtAceptar,
                                    handler: function() {
                                        modificarTabla();
                                    }
                                }]
                        });
                    }
                    fpGestionTablas.getForm().reset();
                    winModTabla.add(fpGestionTablas);
                    winModTabla.doLayout();
                    winModTabla.show();
                    fpGestionTablas.getForm().load({
                        waitMsg: etiquetasTablas.lbEsperando,
                        url: 'cargarformulariotabla',
                        params: {
                            idtable: smGpTablas.getSelected().data.idtable
                        }
                    });
                }
                break;
        }
    }
    function adicionarTabla(apl) {
        var arrayCat = [];
        var arrayRecSel = gpGestionCategorias.getSelectionModel().getSelections();
        for (var h = 0; h < arrayRecSel.length; h++)
            arrayCat.push(arrayRecSel[h].data.idcategoria);
        if (fpGestionTablas.getForm().isValid()) {
            fpGestionTablas.getForm().submit({
                url: 'adicionartabla',
                waitMsg: etiquetasTablas.lbEsperando,
                params: {
                    categorias: Ext.encode(arrayCat)
                },
                failure: function(form, action) {
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg,
                                action.result.mensaje);
                        fpGestionTablas.getForm().reset();
                        if (!apl)
                            winInsTabla.hide();
                        stGestionTablas.reload();
                        smGpTablas.clearSelections();
                    }
                }
            });
        }
    }
    function registrarTabla(apl) {
        var arrayCat = [];
        var arrayRecSel = gpGestionCategorias.getStore().data.items;
        for (var h = 0; h < arrayRecSel.length; h++)
            arrayCat.push(arrayRecSel[h].data);
        if (fpRegistroTablas.getForm().isValid()) {
            fpRegistroTablas.getForm().submit({
                url: 'registrartabla',
                waitTitle: etiquetasTablas.lbEsperando,
                waitMsg: etiquetasTablas.lbWaitMsgReg,
                params: {
                    categorias: Ext.encode(arrayCat),
                    esquema: cmbFiltroEsquemas.getValue(),
                    tabla: smGpTablas.getSelected().data.nombre
                },
                failure: function(form, action) {
                    switch (action.result.codMsg) {
                        case -1:
                            {
                                mostrarMensaje(1, 'La tabla ha sido registrada satisfactoriamente.');
                                fpRegistroTablas.getForm().reset();
                                var selectIndex = gpGestionTablas.getStore().indexOf(smGpTablas.getSelected());
                                if (!apl) {
                                    winRegTabla.hide();
                                }
                                stGestionTablas.reload();
                            }
                            break;
                        default:
                            mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            break;
                    }
                }
            });
        }
    }
    function modificarTabla() {
        if (fpGestionTablas.getForm().isValid() && fpGestionTablas.getForm().isDirty()) {
            fpGestionTablas.getForm().submit({
                url: 'modificartabla',
                waitTitle: etiquetasTablas.lbEsperando,
                waitMsg: etiquetasTablas.lbWaitMsgReg,
                failure: function(form, action) {
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        stGestionTablas.reload();
                        winModTabla.hide();
                    }
                }
            });
        }
    }
    function eliminarTabla() {
        mostrarMensaje(2, etiquetasTablas.lbConfirmDel, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.Msg.wait(etiquetasTablas.lbWaitMsgReg, etiquetasTablas.lbEsperando);
                Ext.Ajax.request({
                    url: 'eliminartabla',
                    method: 'POST',
                    params: {
                        nombre: smGpTablas.getSelected().data.nombre
                    },
                    callback: function(options, success, response) {
                        Ext.Msg.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            stGestionTablas.reload();
                            smGpTablas.clearSelections();
                            btnEliminarTabla.disable();
                        }
                        if (responseData.codMsg == 3)
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    }
                });
            }
        }
    }
    function Cambio() {
        if (smGpGestionTablas.getCount() > 0) {
            btnRegistrarTabla.enable();
        } else {
            btnRegistrarTabla.disable();
        }
    }
}
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    Ext.getCmp('cmbFiltroEsquemas').focus();
    Ext.getCmp('cmbFiltroEsquemas').expand();
});