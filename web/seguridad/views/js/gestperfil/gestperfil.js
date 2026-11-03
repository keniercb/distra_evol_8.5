var aJsonGrid;
var vpGestperfilusuario, fpRegistrarPerfil = {}, GpUsuarios = {};
UCID.portal.cargarEtiquetas('gestperfil', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar variables ------------////

var winIns, winMod, winCamb;

function cargarInterfaz(perfil, etiquetas) {

    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        id: 'btnAddPerfil',
        disabled: true,
        prevTab: 'btnClearField',
        hidden: true,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAdicionar,
        tooltip: etiquetas.textToolTipadicionar,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 105,
                alt: true
            }
        },
        handler: function () {
            if (sm.getCount() >= 1)
                winForm('Ins');
        }
    });

    btnModificar = new Ext.Button({
        disabled: true,
        id: 'btnModPerfil',
        hidden: true,
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnModificar,
        tooltip: etiquetas.textToolTipMod,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 109,
                alt: true
            }
        },
        handler: function () {
            if (sm.getCount() >= 1)
                winForm('Mod');
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnHelpPerfil',
        iconCls: 'btn',
        text: '<b>'+etiquetas.lbBtnAyuda+'</b>',
        disabled: false,
        nextTab:'tfDenomUsuario',
        prevTab : 'btnModPerfil',
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
                        cargarAyuda();
                    }, text: etiquetas.lbBtnAyuda,
                    id: 'btnAyuRel',
                    icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'btn',
                    tooltip: 'Ayuda del sistema'
                },
                {
                    text: etiquetas.lbBtnAcercaDe,
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
        id: 'btnHelpPerfil',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        nextTab: 'tfDenomUsuario',
        prevTab: 'btnModPerfil',
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
            cargarAyuda()
        }
    });*/

    UCID.portal.cargarAcciones(window.frameElement.id);

    ////------------ Establesco modo de seleccion de grid (single)------------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    sm.on("rowselect", getFila);

    ////------------ Cargar la ventana ------------////
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitAdicionardatosalperfil,
                        width: 400,
                        autoHeight: true,
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
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    adicionarperfil();
                                }
                            }
                        ]
                    });
                }
                var hasItems = true;
                try {
                    fpRegistrarPerfil.items.items[0].items.items[0].items.items[0];
                }
                catch (e) {
                    hasItems = false;
                    mostrarMensaje(3, etiquetas.MsgErrorCampos);
                }
                if (hasItems) {
                    winIns.add(fpRegistrarPerfil);
                    winIns.doLayout();
                    winIns.show();
                    fpRegistrarPerfil.items.items[0].items.items[0].items.items[0].focus(false, 100);
                }
            }
                break;
            case 'Mod':
            {
                if (!winMod) {
                    winMod = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitModificardatosdelperfil,
                        width: 500,
                        autoHeight: true,
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
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    modificarperfil();
                                }
                            }
                        ]
                    });
                }
                winMod.add(fpRegistrarPerfil);
                winMod.doLayout();
                winMod.show();
                fpRegistrarPerfil.getForm().loadRecord(vpGestperfilusuario.items.items[0].items.items[1].getSelectionModel().getSelected());
            }
                break;
        }
    }

    // EndOF Cargar
    function cargarConfigGrid() {
        Ext.Ajax.request({
            url: 'configurargrid',
            params: {},
            callback: function (options, success, response) {
                aJsonGrid = Ext.decode(response.responseText);
                creaViewPort(aJsonGrid);
            }
        });
    }

    cargarConfigGrid();
    ////------------ Formulario que se crea dinamico ------------////
    function cargarConfigForm() {
        Ext.Ajax.request({
            url: 'cargarcampos',
            params: {},
            callback: function (options, success, response) {
                aJsonForm = Ext.decode(response.responseText);
                fpRegistrarPerfil = dameFormUsuarios(aJsonForm);
            }
        });
    }

    cargarConfigForm();
    // Para formulario dinamico
    function creaArrayItems(aJSonItems) {
        var arrayItems = new Array();
        for (var i = 0; i < aJSonItems.cantidad; i++)
            arrayItems.push(dameArrayColumn(aJSonItems.campos, aJSonItems.cantidad, i))
        return arrayItems;
    }

    //Para crear el arreglo de columnas
    function dameArrayColumn(aJSonItems, noCol, pos) {


        if (noCol == 1) {
            return {
                columnWidth: 1,
                layout: 'form',
                items: dameItem(aJSonItems[pos].tipocampo, pos, aJSonItems)
            };
        }
        if (noCol == 2) {
            return {
                columnWidth: .5,
                layout: 'form',
                items: dameItem(aJSonItems[pos].tipocampo, pos, aJSonItems)
            };
        }
        if (noCol >= 3) {
            return {
                columnWidth: .33,
                layout: 'form',
                items: dameItem(aJSonItems[pos].tipocampo, pos, aJSonItems)
            };
        }
    }

    //Para devolver un item especifico (El chek y radio por ahora no funciona, hay que acomodarlos.)
    function dameItem(xtype, pos, aJSonItems) {

        if (xtype == 'textfield') {
            return {
                xtype: 'textfield',
                fieldLabel: aJSonItems[pos].nombreamostrar,
                id: aJSonItems[pos].idcampo,
                minLength: 1,
                minLengthText: 'lkh',
                maxLength: aJSonItems[pos].longitud,
                maxLengthText: (aJSonItems[pos].longitud == 1) ? 'El tama&ntilde;o m&aacute;ximo requerido es 1 caracter.' : 'El tama&ntilde;o m&aacute;ximo requerido es ' + aJSonItems[pos].longitud + '  caracteres.',
                name: aJSonItems[pos].nombre,
                anchor: '95%',
                maskRe: eval(aJSonItems[pos].NomExpresiones.expresion)
            };
        }
        if (xtype == 'datefield')  return {
            xtype: 'datefield',
            fieldLabel: aJSonItems[pos].nombreamostrar,
            id: aJSonItems[pos].idcampo,
            maxLength: aJSonItems[pos].longitud,
            name: aJSonItems[pos].nombre,
            anchor: '95%',
            maskRe: eval(aJSonItems[pos].NomExpresiones.expresion)
        };
    }

    ////---------- AdicionarPerfil ----------////
    function adicionarperfil(apl) {
        var flag = false;
        Ext.each(fpRegistrarPerfil.getForm().items.items, function (item, index) {
            if (item.getValue())
                flag = true;
        });
        if (fpRegistrarPerfil.getForm().isValid() && flag) {
            Secodena.mostrarMascara('maskConexion', etiquetas.msgWait, etiquetas.msgAdd);
            fpRegistrarPerfil.getForm().submit({
                url: 'insertarperfil',
                params: {
                    idusuario: vpGestperfilusuario.items.items[0].items.items[1].getSelectionModel().getSelected().data.idusuario
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskConexion');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        vpGestperfilusuario.items.items[0].items.items[1].getStore().reload();
                        fpRegistrarPerfil.getForm().reset();
                        if (!apl)
                            winIns.hide();
                        btnModificar.disable();
                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        } else
            mostrarMensaje(3, etiquetas.msgCamposIncorrectos);
    }

    ////------------ Modififcar Perfil ------------////
    function modificarperfil() {
        if (fpRegistrarPerfil.getForm().isValid()) {
            Secodena.mostrarMascara('maskPerfilMod', etiquetas.msgWait, etiquetas.msgMod);
            fpRegistrarPerfil.getForm().submit({
                url: 'modificarperfil',
                params: {
                    idfila: vpGestperfilusuario.items.items[0].items.items[1].getSelectionModel().getSelected().data.idfila
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskPerfilMod');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        vpGestperfilusuario.items.items[0].items.items[1].getStore().reload();
                        fpRegistrarPerfil.getForm().reset();
                        winMod.hide();
                    }
                    if (action.result.codMsg == 3) mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.msgCamposIncorrectos);
    }

    //Funcion para crear el store
    function dameStoreGp(aJsonGrid) {
        return new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'cargargrid'
            }),
            listeners: {
                load: function (store, r, o) {
                    if (store.getCount() == 0) {
                        if (nombreusuario.getValue())
                            /**Ext.Msg.show({
                                title: etiquetas.msgInf,
                                msg: etiquetas.msgInfDatosMostrar,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            })*/
                            mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                    totalProperty: 'cant_fila',
                    root: 'datos',
                    id: 'idusuario'
                },
                aJsonGrid[1].store
            )
        });
    }

    function getFila(_sm, indiceFila, record) {
        if (record.data.idfila) {
            btnModificar.enable();
            btnAdicionar.disable();
        }
        else {
            btnModificar.disable();
            if (record.data.idusuario)
                btnAdicionar.enable();
        }
    }

    // Para las columnas del grid
    function dameColumnModelGpUsuario(aJsonGrid) {
        return new Ext.grid.ColumnModel(aJsonGrid[0].columns);
    }

    // Para crear el formulario
    function dameFormUsuarios(aJsonForm) {
        return new Ext.FormPanel({
            labelAlign: 'top',
            autoHeight: true,
            frame: true,
            items: {
                layout: 'column',
                items: creaArrayItems(aJsonForm)
            }
        });
    }

    ////------------ Defino el grid de perfiles ------------////
    function dameGpUsuarios(aJsonGrid) {
        var objStore = dameStoreGp(aJsonGrid);
        return new Ext.grid.GridPanel({
            title: etiquetas.MsgGridPerfil,
            cls: 'x-toolbar',
            border: false,
            frame: false,
            region: 'center',
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: etiquetas.cargando
            },
            store: objStore,
            sm: sm,
            cm: dameColumnModelGpUsuario(aJsonGrid),
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                beforePageText:etiquetas.textPagina,
                afterPageText:etiquetas.textDe,
                store: objStore,
                displayInfo: true
            })
        });
    }

    var nombreusuario = new Ext.form.TextField({
        fieldLabel: etiquetas.lbTitDenBuscar,
        emptyText: etiquetas.emptytext,
        anchor: "98%",
        maxLength: 60,
        id: 'tfDenomUsuario',
        prevTab: 'btnHelpPerfil',
        colWidth: .3
    });

    ////---------- Panel ----------////


    ////------------ viewPort ------------////
    function creaViewPort(aJsonGrid) {

        var btnBuscar = new Ext.Button({
            icon: perfil.dirImg + 'buscar.png',
            id: 'btnBuscarGrid',
            nextTab: 'btnClearField',
            prevTab: 'tfDenomUsuario',
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
                buscarnombreusuario(nombreusuario.getValue());
            }
        });

        var btnClear = new Ext.Button({
            icon: perfil.dirImg + 'limpiar.png',
            id: 'btnClearField',
            nextTab: 'btnAddPerfil',
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
            elementos: [nombreusuario],
            botones: [btnBuscar, btnClear]
        })
        var panel = new Ext.Panel({
            layout: 'border',
            tbar: [
                btnAdicionar, btnModificar, '->', btnAyuda
            ],
            items: [fpFiltro, dameGpUsuarios(aJsonGrid)],
            id: 'grid1',
            keyMapGroup: true
        });
        vpGestperfilusuario = new Ext.Viewport({
            layout: 'fit',
            items: [panel]
        });
        vpGestperfilusuario.items.items[0].items.items[1].getStore().load({
            params: {
                start: 0,
                limit: 15
            }
        });
        panel.habilitarKeyMap();
        btnAdicionar.focus();
    }

    function buscarnombreusuario(nombreusuario) {
        var storeGridUsuarios = vpGestperfilusuario.items.items[0].items.items[1].getStore();
        storeGridUsuarios.baseParams = {};
        storeGridUsuarios.baseParams.nombreusuario = nombreusuario;
        storeGridUsuarios.load({
            params: {
                nombreusuario: nombreusuario,
                start: 0,
                limit: 15
            }
        });
    }

    function clearFilters() {
        var storeGridUsuarios = vpGestperfilusuario.items.items[0].items.items[1].getStore();
        nombreusuario.reset();
        storeGridUsuarios.baseParams = {};
        storeGridUsuarios.load({
            params: {
                start: 0,
                limit: 15
            }
        });
    }

    function cargarAyuda() {
        var title = 'Ayuda de Seguridad';
        var referencia = 'seguridad/gestperfil';
        help.show(title, referencia);
    }
}
