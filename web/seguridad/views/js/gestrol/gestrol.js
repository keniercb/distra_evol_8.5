UCID.portal.cargarEtiquetas('gestrol', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

//Declaración de variables.
var winIns, winMod, winRegular, winInsGrupo, winModGrupo, idsistema , idrolSelected, arraysistemas = [], arrayPaginado = [], arraytiene = [], arrayGrupos = [], padre = 0, arbolSistema, arbolSistemaRol, tabsPanelRol, busqueda_gridR = false, busqueda_gridG = false, tipo = false;
Ext.grid.CheckColumn = function (config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
    init: function (grid) {
        grid.checkeds = {};
        this.grid = grid;
        this.grid.on('render', function () {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown: function (e, t) {
        var index = this.grid.getView().findRowIndex(t);
        var record = this.grid.store.getAt(index);
        e.stopEvent();
        record.set(this.dataIndex, !record.data[this.dataIndex]);
    },

    renderer: function (v, p, record, index) {
        p.css += ' x-grid3-check-col-td';
        var isSelected = v;
        this.grid.checkeds[index] = v;
        if (isSelected)
            this.grid.getSelectionModel().selectRow(index, true);

        else
            this.grid.getSelectionModel().deselectRow(index);
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};
function cargarInterfaz(perfil, etiquetas) {

    btnAdicionar = new Ext.Button({
        id: 'btnAgrRol',
        hidden: true,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        prevTab: 'btnClearField',
        tooltip: etiquetas.textToolTipadicionar ,
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

    btnAdicionarGrupo = new Ext.Button({
        id: 'btnAgrGrupo',
        hidden: true,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        prevTab: 'btnClearGrupo',
        tooltip: etiquetas.textToolTipadicionarGrupo,
        text: etiquetas.lbBtnAdicionar,
        hotKey: {
            idGrupo: 'panelG',
            config: {
                key: 105,
                alt: true
            }
        },
        handler: function () {
            winForm('InsGrupo');
        }
    });

    btnModificar = new Ext.Button({
        id: 'btnModRol',
        disabled: true,
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

    btnModificarGrupo = new Ext.Button({
        id: 'btnModGrupo',
        disabled: true,
        hidden: true,
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnModificar,
        tooltip: etiquetas.textToolTipModGrupo,
        hotKey: {
            idGrupo: 'panelG',
            config: {
                key: 109,
                alt: true
            }
        },
        handler: function () {
            if (smGrupo.getCount() >= 1)
                winForm('ModGrupo');
        }
    });

    btnEliminar = new Ext.Button({
        id: 'btnEliRol',
        disabled: true,
        hidden: true,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnEliminar,
        tooltip: etiquetas.textToolTipDel,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: Ext.EventObject.DELETE,
                stopEvent: true
            }
        },
        handler: function () {
            if (sm.getCount() >= 1)
                eliminarRol();
        }
    });

    btnEliminarGrupo = new Ext.Button({
        id: 'btnEliRolGrupo',
        disabled: true,
        hidden: true,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnEliminar,
        tooltip: etiquetas.textToolTipDelGrupo,
        hotKey: {
            idGrupo: 'panelG',
            config: {
                key: Ext.EventObject.DELETE,
                stopEvent: true
            }
        },
        handler: function () {
            if (smGrupo.getCount() >= 1)
                eliminarRol();
        }
    });

    btnRegular = new Ext.Button({
        disabled: true,
        id: 'btnRestRol',
        hidden: true,
        icon: perfil.dirImg + 'regularacciones.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnRegularAcciones,
        tooltip: etiquetas.textToolTipReg,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 114,
                alt: true
            }
        },
        handler: function () {
            winForm('Reg');
        }
    });

    btnRegularGrupo = new Ext.Button({
        disabled: true,
        id: 'btnRestGrupo',
        //hidden	: true,
        icon: perfil.dirImg + 'regularacciones.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnRegularAcciones,
        tooltip: etiquetas.textToolTipReg,
        hotKey: {
            idGrupo: 'panelG',
            config: {
                key: 114,
                alt: true
            }
        },
        handler: function () {
            winForm('Reg');
        }
    });

    btnSiguiente = new Ext.Button({
        disabled: true,
        id: 'btnsiguiente',
        style: 'margin-left:18px;margin-top:110px',
        icon: perfil.dirImg + 'siguiente.png',
        iconCls: 'btn',
        tooltip: etiquetas.tooltipBtnSgte,
        handler: function () {
            eliminaraccion();
        }
    });

    btnAnterior = new Ext.Button({
        disabled: true,
        id: 'btnAnterior',
        style: 'margin-left:18px;margin-top:90px',
        icon: perfil.dirImg + 'anterior.png',
        iconCls: 'btn',
        tooltip: etiquetas.tooltipBtnAnte,
        handler: function () {
            adicionaraccion();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuAccion',
        iconCls: 'btn',
        text: '<b>'+etiquetas.lbBtnAyuda+'</b>',
        disabled: false,
        nextTab: 'denrol',
        prevTab: 'btnEliRol',
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
                        cargarAyuda('Ayuda de roles', 'seguridad/gestrol');
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
        id: 'btnAyuRol',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.textToolTipHelp,
        nextTab: 'denrol',
        prevTab: 'btnEliRol',
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 104,
                alt: true
            }
        },
        handler: function () {
            cargarAyuda('Ayuda de roles', 'seguridad/gestrol');
        }
    });*/

    btnAyudaGrupo = new Ext.Button({
        id: 'btnAyuGrupo',
        iconCls: 'btn',
        text: '<b>Ayuda</b>',
        disabled: false,
        nextTab: 'denGrupo',
        prevTab: 'btnEliRolGrupo',
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
                        cargarAyuda('Ayuda de grupos', 'seguridad/gestgrupo');
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
    /**btnAyudaGrupo = new Ext.Button({
        id: 'btnAyuGrupo',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.textToolTipHelp,
        nextTab: 'denGrupo',
        prevTab: 'btnEliRolGrupo',
        hotKey: {
            idGrupo: 'panelG',
            config: {
                key: 104,
                alt: true
            }
        },
        handler: function () {
            cargarAyuda('Ayuda de grupos', 'seguridad/gestgrupo');
        }
    });*/

    UCID.portal.cargarAcciones(window.frameElement.id);

    ////------------ Arbol de sistemas ------------////
    arbolSistema = new Ext.tree.TreePanel({
        title: etiquetas.lbTitSistemasregistrados,
        autoScroll: true,
        region: 'center',
        split: true,
        width: '37%',
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarsistemafuncionalidades',
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    atreeloader.baseParams = {};
                    if (modificar) {
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema;
                        atreeloader.baseParams.idrol = getIdRol();
                        if (anode.attributes.tiene)
                            arraytiene.push(anode.attributes.idsistema)
                    }
                    else
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema
                }
            }
        })
    });

    ////------------ Arbol de sistemas para roles------------////
    arbolSistemaRol = new Ext.tree.TreePanel({
        title: etiquetas.lbTitSistemasregistrados,
        autoScroll: true,
        //region:'center',
        split: true,
        width: '37%',
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarsistemafuncionalidades',
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    atreeloader.baseParams = {};
                    if (modificar) {
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema;
                        atreeloader.baseParams.idrol = getIdRol();
                        if (anode.attributes.tiene)
                            arraytiene.push(anode.attributes.idsistema)
                    }
                    else
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema
                }
            }
        })
    });

    ////------------ Crear nodo padre del arbol para roles------------////
    padreArbolSistema = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbTitMsgSubsistemas,
        expandable: false,
        id: '0'
    });

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolSistemaRol = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbTitMsgSubsistemas,
        expandable: false,
        id: '0'
    });

    arbolSistema.setRootNode(padreArbolSistema);
    arbolSistemaRol.setRootNode(padreArbolSistemaRol);

    function focusRol() {
        btnAdicionar.focus(200);
    }

    ////------------- Store del Grid de Roles -------------- ////
    stUsuario = new Ext.data.JsonStore({
        url: "cargarrol",
        totalProperty: "cantidad_filas",
        root: "datos",
        id: "idrol",
        fields: ["idrol", 'descripcion', "abreviatura", "denominacion", "regular"],
        listeners: {
            beforeload: function (thisstore, objeto) {
                thisstore.baseParams.type = false;
            },
            load: function () {
                if (stUsuario.getCount() == 0) {
                    if (denrol.getValue())
                        /**Ext.Msg.show({
                            title: etiquetas.msgInf,
                            msg: etiquetas.msgInfDatosMostrar,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar);
                    else if (busqueda_gridR) {
                        /**Ext.Msg.show({
                            title: etiquetas.msgInf,
                            msg: etiquetas.msgInfDatos,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatos);
                        busqueda_gridR = false;
                    }
                    btnModificar.disable();
                    btnEliminar.disable();
                    btnRegular.disable();
                }
            }
        }
    });

    function focusGrupo() {
        btnAdicionarGrupo.focus(200);
    }

    ////------------- Store del Grid de Grupos -------------- ////
    stIP = new Ext.data.JsonStore({
        url: "cargarGrupo",
        totalProperty: "cantidad_filas",
        root: "datos",
        id: "idrol",
        fields: ["idrol", 'descripcion', "abreviatura", "denominacion"],
        listeners: {
            beforeload: function (thisstore, objeto) {
                thisstore.baseParams.type = true;
            },
            load: function () {
                if (stIP.getCount() == 0) {
                    if (denGrupo.getValue())
                        /**Ext.Msg.show({
                            title: etiquetas.msgInf,
                            msg: etiquetas.msgInfDatosMostrar,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar);
                    else if (busqueda_gridG) {
                        /**Ext.Msg.show({
                            title: etiquetas.msgInf,
                            msg: etiquetas.msgInfDatos,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatos);
                        busqueda_gridG = false;
                        
                    } 
                    btnModificarGrupo.disable();
                    btnEliminarGrupo.disable();
                    btnRegularGrupo.disable();
                }
            }
        }
    });

    ////------------ Establesco modo de seleccion del grid de roles ---------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
        btnModificar.enable();
        btnEliminar.enable();
        if (record.data.regular)
            btnRegular.enable();
        else
            btnRegular.disable();
    }, this);

    sm.on('rowselect', function (smodel, rowIndex, record) {
        idrolSelected = record.data.idrol;
        if (sm.getCount() != 1) {
            btnModificar.disable();
            btnRegular.disable();
        } else {
            btnModificar.enable();
            if (record.data.regular)
                btnRegular.enable();
            else
                btnRegular.disable();
        }
    }, this);

    sm.on('rowdeselect', function (smodel, rowIndex, record) {
        if (sm.getCount() != 1) {
            btnModificar.disable();
            btnRegular.disable();
        } else {
            btnModificar.enable();
            if (record.data.regular)
                btnRegular.enable();
            else
                btnRegular.disable();
        }
    }, this);

    ////------------ Establesco modo de seleccion del grid de Grupos ---------////
    smGrupo = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    smGrupo.on('beforerowselect', function () {
        btnModificarGrupo.enable();
        btnEliminarGrupo.enable();
        btnRegularGrupo.enable();
    }, this);

    smGrupo.on('rowselect', function () {
        if (smGrupo.getCount() != 1) {
            btnModificarGrupo.disable();
            btnRegularGrupo.disable();
        } else {
            btnModificarGrupo.enable();
            btnRegularGrupo.enable();
        }
    }, this);

    smGrupo.on('rowdeselect', function () {
        if (smGrupo.getCount() != 1) {
            btnModificarGrupo.disable();
            btnRegularGrupo.disable();
        } else {
            btnModificarGrupo.enable();
            btnRegularGrupo.enable();
        }
    }, this);

    ////---------- Defino el grid de roles ----------////
    var gpRol = new Ext.grid.GridPanel({
        title: etiquetas.titleGridRol,
        cls: 'x-toolbar',
        border: false,
        frame: false,
        region: 'center',
        autoExpandColumn: 'expandir',
        store: stUsuario,
        sm: sm,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idrol'
            },

            {
                id: 'expandir',
                header: etiquetas.lbTitMsgDenominacion,
                width: 200,
                dataIndex: 'denominacion',
                sortable: true
            },

            {
                header: etiquetas.lbTitMsgAbreviatura,
                width: 200,
                dataIndex: 'abreviatura',
                sortable: true
            },

            {
                header: etiquetas.lbTitMsgDescripcion,
                width: 200,
                dataIndex: 'descripcion',
                sortable: true
            },

            {
                hidden: true,
                hideable: false,
                dataIndex: 'regular'
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            id: 'ptbaux',
            beforePageText: etiquetas.textPagina,
            afterPageText: etiquetas.textDe,
            store: stUsuario,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
        })
    });

    ////---------- Defino el grid de Grupos ----------////
    var gpGrupo = new Ext.grid.GridPanel({
        title: etiquetas.titleGridGrupo,
        cls: 'x-toolbar',
        border: false,
        frame: false,
        region: 'center',
        autoExpandColumn: 'expandir',
        store: stIP,
        sm: smGrupo,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idrol'
            },

            {
                id: 'expandir',
                header: etiquetas.lbTitMsgDenominacion,
                width: 200,
                dataIndex: 'denominacion',
                sortable: true
            },

            {
                header: etiquetas.lbTitMsgAbreviatura,
                width: 200,
                dataIndex: 'abreviatura',
                sortable: true
            },

            {
                header: etiquetas.lbTitMsgDescripcion,
                width: 200,
                dataIndex: 'descripcion',
                sortable: true
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            id: 'ptbaux',
            store: stIP,
            beforePageText: etiquetas.textPagina,
            afterPageText: etiquetas.textDe,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
        })
    });

    /////---------------Creando el Tbar del Grid-----------------------/////
    var denrol = new Ext.form.TextField({
        fieldLabel: etiquetas.lbTitDenBuscar,
        emptyText: etiquetas.emptytext,
        anchor: "98%",
        width: 150,
        colWidth: .3,
        maxLength: 60,
        id: 'denrol',
	    vtype: 'vtalfanumericosguiones',
        nextTab: 'btnBuscarGrid',
        prevTab: 'btnAyuRol'
    });

    var btnBuscar = new Ext.Button({
        icon: perfil.dirImg + 'buscar.png',
        id: 'btnBuscarGrid',
        nextTab: 'btnClearField',
        prevTab: 'denrol',
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
            buscar(denrol.getValue(), false);
        }
    });

    var btnClear = new Ext.Button({
        icon: perfil.dirImg + 'limpiar.png',
        id: 'btnClearField',
        nextTab: 'btnAgrRol',
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
            clearFilters(false);
        }
    });

    var fpFiltro = new Ext.ToolBar.searchToolBar({
        region: 'north',
        elementos: [denrol],
        botones: [btnBuscar, btnClear]
    });

    ////---------- Formulario de busqueda de grupos ----------////
    var denGrupo = new Ext.form.TextField({
        fieldLabel: etiquetas.lbTitDenBuscar,
        emptyText: etiquetas.emptytext,
        anchor: "98%",
        width: 150,
        colWidth: .3,
        maxLength: 60,
        id: 'denGrupo',
	    vtype: 'vtalfanumericosguiones',
        nextTab: 'btnBuscarGrupo',
        prevTab: 'btnAyuGrupo'
    });

    var btnBuscarGrupo = new Ext.Button({
        icon: perfil.dirImg + 'buscar.png',
        id: 'btnBuscarGrupo',
        nextTab: 'btnClearGrupo',
        prevTab: 'denGrupo',
        iconCls: 'btn',
        text: etiquetas.lbBtnBuscar,
        tooltip: etiquetas.textToolTipSearchG,
        hotKey: {
            idGrupo: 'panelG',
            config: {
                key: 98,
                alt: true
            }
        },
        handler: function () {
            buscar(denGrupo.getValue(), true);
        }
    });

    var btnClearGrupo = new Ext.Button({
        icon: perfil.dirImg + 'limpiar.png',
        id: 'btnClearGrupo',
        nextTab: 'btnAgrGrupo',
        prevTab: 'btnBuscarGrupo',
        iconCls: 'btn',
        text: etiquetas.denomLimpiar,
        tooltip: etiquetas.cleanFilter,
        hotKey: {
            idGrupo: 'panelG',
            config: {
                key: 108,
                alt: true
            }
        },
        handler: function () {
            clearFilters(true);
        }
    });

    var fpFiltroGrupo = new Ext.ToolBar.searchToolBar({
        region: 'north',
        elementos: [denGrupo],
        botones: [btnBuscarGrupo, btnClearGrupo]
    });

    ////---------- Renderiar el arbol ----------////
    var panel = new Ext.Panel({
        title: 'Roles',
        layout: 'border',
        items: [fpFiltro, gpRol],
        id: 'grid1',
        keyMapGroup: true,
        tbar: [btnAdicionar, btnModificar, btnRegular, btnEliminar, '->', btnAyuda],
        listeners: {
            afterlayout: function () {
                setTimeout(function () {
                    panel.getTopToolbar().items.items[0].focus();
                    panel.habilitarKeyMap();
                }, 1000)
            },
            activate: function () {
                sm.clearSelections();
                tipo = false;
                panel.getTopToolbar().items.items[0].focus();
                panel.habilitarKeyMap();
                btnModificar.disable();
                btnRegular.disable();
                btnEliminar.disable();
            }
        }
    });

    ////---------- Panel de grupos ----------////
    var panelGrupo = new Ext.Panel({
        title: etiquetas.textGrupo,
        layout: 'border',
        items: [fpFiltroGrupo, gpGrupo],
        id: 'panelG',
        keyMapGroup: true,
        tbar: [btnAdicionarGrupo, btnModificarGrupo, btnRegularGrupo, btnEliminarGrupo, '->', btnAyudaGrupo],
        listeners: {
            activate: function () {
                tipo = true;
                stIP.load({
                    params: {
                        start: 0,
                        limit: 15
                    }
                });
                panelGrupo.getTopToolbar().items.items[0].focus();
                panelGrupo.habilitarKeyMap();
                btnModificarGrupo.disable();
                btnRegularGrupo.disable();
                btnEliminarGrupo.disable();
            }
        }
    });

    stUsuario.load({
        params: {
            start: 0,
            limit: 15
        }
    });

    tabsPanelRol = new Ext.TabPanel({
        activeTab: 0,
        frame: true,
        items: [ panel, panelGrupo ]
    });

    ////---------- Viewport ----------////
    var vpGestRol = new Ext.Viewport({
        layout: 'fit',
        items: tabsPanelRol
    });

    ////---------- Formulario ----------////
    var regrol = new Ext.FormPanel({
        labelAlign: 'top',
        collapsible: true,
        width: 200,
        region: 'west',
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
                                fieldLabel: etiquetas.lbTitMsgDenominacion,
                                name: 'denominacion',
                                id: 'denominacion',
                                maxLength: 60,
                                anchor: '100%',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgEstecampoesrequerido,
                                vtype: 'vtalfanumericosguiones'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbTitMsgAbreviatura,
                                name: 'abreviatura',
                                maxLength: 10,
                                anchor: '100%',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgEstecampoesrequerido,
                                vtype: 'vtalfanumericosguiones'

                            },
                            {
                                xtype: 'textarea',
                                fieldLabel: etiquetas.lbTitMsgDescripcion,
                                name: 'descripcion',
                                maxLength: 255,
                                height: 180,
                                anchor: '100%'
                            }
                        ]
                    }
                ]
            }
        ]
    });


    ////---------- Formulario ----------////
    var regGrupo = new Ext.FormPanel({
        labelAlign: 'top',
        collapsible: true,
        width: 200,
        region: 'west',
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
                                fieldLabel: etiquetas.lbTitMsgDenominacion,
                                name: 'denominacion',
                                id: 'denominacionGrupo',
                                maxLength: 60,
                                anchor: '100%',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgEstecampoesrequerido,
                                vtype: 'vtalfanumericosguiones'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbTitMsgAbreviatura,
                                name: 'abreviatura',
                                maxLength: 10,
                                anchor: '100%',
                                allowBlank: false,
                                blankText: etiquetas.lbMsgEstecampoesrequerido,
                                vtype: 'vtalfanumericosguiones'

                            },
                            {
                                xtype: 'textarea',
                                fieldLabel: etiquetas.lbTitMsgDescripcion,
                                name: 'descripcion',
                                maxLength: 255,
                                height: 180,
                                anchor: '100%'
                            }
                        ]
                    }
                ]
            }
        ]
    });

    ////------------ Store del Grid de acciones que tiene un usuario ------------////
    var storeTieneAccion = new Ext.data.Store({
        url: 'cargaraccionesquetiene',
        listeners: {
            'beforeload': function (thisstore, objeto) {
                objeto.params.idsistema = idi,
                    objeto.params.idrol = idr,
                    objeto.params.idfuncionalidad = idu
            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "idrecurso"
            },
            [
                {
                    name: 'idrecurso',
                    mapping: 'idrecurso'
                },
                {
                    name: 'denominacion',
                    mapping: 'denominacion'
                },
                {
                    name: 'idfuncionalidad',
                    mapping: 'idfuncionalidad'
                }
            ])
    });

    ////------------- Modo de seleccion del Grid de acciones que tiene un usuario -------------////
    var smtieneaccion = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    smtieneaccion.on('beforerowselect', function () {
        btnAnterior.disable();
        btnSiguiente.enable();
    }, this);

    ////------------- Creando el grid de acciones que tiene un usuario -------------////
    var gridtieneaccion = new Ext.grid.GridPanel({
        title: etiquetas.lbTitAccionesautorizadas,
        frame: true,
        disabled: true,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        margins: '2 2 2 -4',
        store: storeTieneAccion,
        height: 315,
        sm: smtieneaccion,
        columns: [
            {
                header: etiquetas.lbDenominacion,
                width: 200,
                dataIndex: 'denominacion',
                id: 'expandir'
            },

            {
                hidden: true,
                hideable: false,
                dataIndex: 'idrecurso'
            },

            {
                hidden: true,
                hideable: false,
                dataIndex: 'idfuncionalidad'
            }
        ],

        loadMask: {
            store: storeTieneAccion
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            beforePageText: etiquetas.textPagina,
            afterPageText: etiquetas.textDe,
            store: storeTieneAccion
        })

    });

    ////------------ Store del grid de acciones que no tiene un usuario ------------////
    var storeNoTieneAccion = new Ext.data.Store({
        url: 'cargaraccionesquenotiene',
        listeners: {
            'beforeload': function (thisstore, objeto) {
                objeto.params.idsistema = idi,
                    objeto.params.idrol = idr,
                    objeto.params.idfuncionalidad = idu
            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "ide"
            },
            [
                {
                    name: 'idrecurso',
                    mapping: 'idrecurso'
                },
                {
                    name: 'idfuncionalidad',
                    mapping: 'idfuncionalidad'
                },
                {
                    name: 'denominacion',
                    mapping: 'denominacion'
                }
            ]
        )
    });

    ////------------ Modo de seleccion  del grid de acciones que no tiene un usuario ------------////
    var smnotieneaccion = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    smnotieneaccion.on('beforerowselect', function () {
        btnAnterior.enable();
        btnSiguiente.disable();
    }, this);

    ////------------ Creando el grid de acciones que no tiene un usuario ------------////
    var gridnotieneaccion = new Ext.grid.GridPanel({
        title: etiquetas.lbAccionesnoautorizadas,
        height: 315,
        frame: true,
        disabled: true,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        margins: '2 2 2 -4',
        store: storeNoTieneAccion,
        sm: smnotieneaccion,
        columns: [
            {
                header: etiquetas.lbDenominacion,
                width: 200,
                dataIndex: 'denominacion',
                id: 'expandir'
            },

            {
                hidden: true,
                hideable: false,
                dataIndex: 'idrecurso'
            },

            {
                hidden: true,
                hideable: false,
                dataIndex: 'idfuncionalidad'
            }
        ],

        loadMask: {
            store: storeNoTieneAccion
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            beforePageText: etiquetas.textPagina,
            afterPageText: etiquetas.textDe,
            store: storeNoTieneAccion
        })

    });

    ////------------ Arbol de sistema y roles para seleccionar acciones ------------////
    arbolRestAccion = new Ext.tree.TreePanel({
        title: etiquetas.lbTitMsgSistemasyroles,
        border: false,
        autoScroll: true,
        region: 'west',
        width: 200,
        margins: '2 2 2 2',
        loader: new Ext.tree.TreeLoader({
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    if (sm.getSelected() || smGrupo.getSelected()) {
                        arbolRestAccion.getLoader().baseParams = {
                            idrol: getIdRol(),
                            idsistema: anode.attributes.idsistema
                        }
                    }
                }
            },
            dataUrl: 'cargarsistemafunc'
        })
    });

    ////------------ Crear nodo padre del arbol ------------////
    padreRestAccion = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbTitMsgSubsistemas,
        expandable: false,
        expanded: true,
        id: '0'
    });

    ////------------ Habilitar botones y cargar id de Nodos ------------////
    arbolRestAccion.setRootNode(padreRestAccion);

    ////------------ Evento para habilitar botones. ------------////
    arbolRestAccion.on('click', function (node, e) {
        if (node.isLeaf()) {
            idi = node.attributes.idsistema;
            idr = getIdRol();
            idu = node.attributes.idfuncionalidad;
            storeNoTieneAccion.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            storeTieneAccion.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            gridtieneaccion.enable();
            gridnotieneaccion.enable();
        }
    }, this);

    ////------------ Panel para las acciones ------------////
    var regularAcciones = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        region: 'center',
        height: 370,
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .45,
                        layout: 'form',
                        items: [gridtieneaccion]
                    },
                    {
                        columnWidth: .10,
                        layout: 'form',
                        items: [btnSiguiente, btnAnterior],
                        anchor: '100%'
                    },
                    {
                        columnWidth: .45,
                        layout: 'form',
                        items: [gridnotieneaccion]
                    }
                ]
            }
        ]
    });

    panelRestAccion = new Ext.Panel({
        layout: 'border',
        items: [regularAcciones, arbolRestAccion]
    });

    ////------------ Store del grid de acciones que no tiene un usuario ------------////
    var storegridGrupos = new Ext.data.Store({
        url: 'cargarGridGrupos',
        listeners: {
            load: function (store, records, option) {
                if (idrolSelected)
                    store.baseParams.idrol = idrolSelected;
                getGruposInsertados(records);
            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "datos",
                id: "idrol"
            },
            [
                {
                    name: 'idrol',
                    mapping: 'idrol'
                },
                {
                    name: 'denominacion',
                    mapping: 'denominacion'
                },
                {
                    name: 'checket',
                    mapping: 'checket'
                }
            ]
        )
    });

    ////------------ Modo de seleccion  del grid de acciones que no tiene un usuario ------------////
    var smgridGrupos = new Ext.grid.CheckColumn({
        header: "Asociado",
        dataIndex: 'checket',
        width: 60
    });

    ////------------ Creando el grid de acciones que no tiene un usuario ------------////
    var gridGrupos = new Ext.grid.GridPanel({
        title: etiquetas.titleGridGrupo,
        height: 315,        
        autoExpandColumn: 'expandir',
        margins: '2 2 2 -4',
        store: storegridGrupos,
        region: "south",
        plugins: [smgridGrupos],
        columns: [
            smgridGrupos, {
                header: etiquetas.lbDenominacion,
                width: 200,
                dataIndex: 'denominacion',
                id: 'expandir'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idrol'
            }],
        bbar: new Ext.PagingToolbar({
            pageSize: 3,
            id: 'ptbaux',
            store: storegridGrupos,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
        })

    });
    storegridGrupos.grid = gridGrupos;

    gridGrupos.bottomToolbar.on("change", function (self) {
        if (arrayPaginado.length > 0) {
            for (var i = 0; i < arrayPaginado.length; i++) {
                if (arrayPaginado[i][0] == self.getPageData().activePage) {
                    for (var j = 0; j < arrayPaginado[i][1].length; j++) {
                        if (arrayPaginado[i][1][j] != 0)
                            self.store.getAt(j).set("checket", true);
                        else
                            self.store.getAt(j).set("checket", false);
                    }
                }
            }
        }
    });

    gridGrupos.bottomToolbar.on("beforechange", function (self) {
        if (arrayPaginado.length > 0) {
            var fly = false;
            for (var i = 0; i < arrayPaginado.length; i++) {
                if (arrayPaginado[i][0] == self.getPageData().activePage) {
                    arrayNodos = new Array();
                    arrayNodos = gridGrupos.checkeds;
                    arrayPaginado[i][1] = new Array();
                    for (j in arrayNodos) {
                        if (arrayNodos[j])
                            arrayPaginado[i][1].push(self.store.getAt(j).data.idrol);
                        else
                            arrayPaginado[i][1].push(0);
                    }
                    fly = false;
                    break;
                } else
                    fly = true;
            }
            if (fly) {
                addNodesCheckeds(self);
            }
        } else
            addNodesCheckeds(self);
    });

    var tabsPanelRG = new Ext.TabPanel({
        activeTab: 1,
        id: 'tabPanelRG',
        frame: true,
        region: "center",        
        items: [ arbolSistemaRol, gridGrupos ]
    });

    ////---------- panel ----------////
    var panelAdicionarRol = new Ext.Panel({
        layout: 'border',
        items: [regrol, tabsPanelRG]
    });

    ////---------- panel ----------////
    var panelAdicionar = new Ext.Panel({
        layout: 'border',
        items: [regGrupo, arbolSistema]
    });

    ////---------- Cargar ventanas ----------////
    function winForm(opcion) {
        switch (opcion) {
            case 'Ins':
            {
                if (!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitAdicionarRol,
                        width: 600,
                        height: 400,
                        listeners: {
                            hide: function (w) {
                                panel.getTopToolbar().items.items[0].focus();
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
                                    arrayGrupos = [];
                                    arrayPaginado = [];
                                    Ext.getCmp('tabPanelRG').activate(0);
                                    gridGrupos.getSelectionModel().clearSelections();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aplicar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAplicar,
                                tooltip: etiquetas.tooltipAplicarVen,
                                handler: function () {
                                    adicionarRol('apl');
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                nextTab: 'denominacion',
                                text: etiquetas.lbBtnAceptar,
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    adicionarRol();
                                }
                            }
                        ]
                    });

                }
                arraytiene = [];
                arraysistemas = [];
                modificar = false;
                arbolSistemaRol.getRootNode().reload();
                regrol.getForm().reset();
                winIns.add(panelAdicionarRol);
                winIns.doLayout();
                winIns.show();
                activarGridGrupos(null);
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
                        title: etiquetas.lbTitModificarRol,
                        width: 600,
                        height: 400,
                        listeners: {
                            hide: function (w) {
                                panel.getTopToolbar().items.items[0].focus();
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
                                    arrayGrupos = [];
                                    arrayPaginado = [];
                                    Ext.getCmp('tabPanelRG').activate(0);
                                    gridGrupos.getSelectionModel().clearSelections();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                nextTab: 'denominacion',
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    modificarRol();
                                }
                            }
                        ]
                    });
                }
                arraytiene = [];
                arraysistemas = [];
                modificar = true;
                arbolSistemaRol.getRootNode().reload();
                regrol.getForm().reset();
                winMod.add(panelAdicionarRol);
                winMod.doLayout();
                winMod.show();
                regrol.getForm().loadRecord(sm.getSelected());
                activarGridGrupos(sm.getSelected().data.idrol);
                Ext.getCmp('denominacion').focus(false, 200);
            }
                break;
            case 'Reg':
            {
                if (!winRegular) {
                    winRegular = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbBtnRegularAcciones,
                        width: 750,
                        height: 400,
                        listeners: {
                            hide: function (w) {
                                if (tipo)
                                    panelGrupo.getTopToolbar().items.items[0].focus();
                                else
                                    panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCerrar,
                                tooltip: etiquetas.tooltipCerrarVen,
                                handler: function () {
                                    winRegular.hide();
                                }
                            }
                        ]
                    });
                }
                winRegular.add(panelRestAccion);
                winRegular.doLayout();
                winRegular.show();
                storeTieneAccion.removeAll();
                storeNoTieneAccion.removeAll();
                arbolRestAccion.getRootNode().reload();
                arbolRestAccion.expandPath(arbolRestAccion.getRootNode().getPath());
            }
                break;
            case 'InsGrupo':
            {
                if (!winInsGrupo) {
                    winInsGrupo = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitAdicionarGrupo,
                        width: 550,
                        height: 400,
                        listeners: {
                            hide: function (w) {
                                panelGrupo.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCancelar,
                                tooltip: etiquetas.tooltipCancelarVen,
                                handler: function () {
                                    winInsGrupo.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aplicar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAplicar,
                                tooltip: etiquetas.tooltipAplicarVen,
                                handler: function () {
                                    adicionarGrupo('apl');
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                nextTab: 'denominacionGrupo',
                                text: etiquetas.lbBtnAceptar,
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    adicionarGrupo();
                                }
                            }
                        ]
                    });

                }
                arraytiene = [];
                arraysistemas = [];
                modificar = false;
                arbolSistema.getRootNode().reload();
                regGrupo.getForm().reset();
                winInsGrupo.add(panelAdicionar);
                winInsGrupo.doLayout();
                winInsGrupo.show();
                Ext.getCmp('denominacionGrupo').focus(false, 200);
            }
                break;
            case 'ModGrupo':
            {
                if (!winModGrupo) {
                    winModGrupo = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: etiquetas.lbTitModificarGrupo,
                        width: 550,
                        height: 400,
                        listeners: {
                            hide: function (w) {
                                panelGrupo.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons: [
                            {
                                icon: perfil.dirImg + 'cancelar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnCancelar,
                                tooltip: etiquetas.tooltipCancelarVen,
                                handler: function () {
                                    winModGrupo.hide();
                                }
                            },
                            {
                                icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'btn',
                                text: etiquetas.lbBtnAceptar,
                                nextTab: 'denominacionGrupo',
                                tooltip: etiquetas.tooltipAceptarVen,
                                handler: function () {
                                    modificarGrupo();
                                }
                            }
                        ]
                    });
                }
                arraytiene = [];
                arraysistemas = [];
                modificar = true;
                arbolSistema.getRootNode().reload();
                regGrupo.getForm().reset();
                winModGrupo.add(panelAdicionar);
                winModGrupo.doLayout();
                winModGrupo.show();
                regGrupo.getForm().loadRecord(smGrupo.getSelected());
                Ext.getCmp('denominacionGrupo').focus(false, 200);
            }
                break;
        }
    }

    ////---------- Adicionar Grupo ----------////
    function adicionarGrupo(apl) {
        if (regGrupo.getForm().isValid()) {
            Secodena.mostrarMascara('maskConexion', etiquetas.msgWait, etiquetas.msgAdd);
            var resultado = new Array();
            var arrPadres = new Array();
            var arrayNodos = arbolSistema.getChecked();
            if (arrayNodos.length > 0) {
                for (var i = 0; i < arrayNodos.length; i++) {

                    if (!existesistema(arrPadres, arrayNodos[i].parentNode.attributes.idsistema)) {
                        var result = new Array();
                        arrPadres.push(arrayNodos[i].parentNode.attributes.idsistema);
                        result[0] = arrayNodos[i].parentNode.attributes.idsistema;
                        result[1] = dameFuncionalidades(arrayNodos[i].parentNode.attributes.idsistema, arrayNodos);
                        resultado.push(result);
                        damesistemas(arrayNodos[i]);
                    }
                }
                regGrupo.getForm().submit({
                    url: 'insertar',
                    timeout: 1800000,
                    params: {
                        arraysistfun: Ext.encode(resultado),
                        arraysist: Ext.encode(arraysistemas),
                        clase: 'SegGrupo',
                        type: 'grupo'
                    },
                    failure: function (form, action) {
                        Secodena.ocultarMascara('maskConexion');
                        if (action.result.codMsg != 3) {
                            mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            if (!apl)
                                winInsGrupo.hide();
                            stIP.reload();
                            arraytiene = [];
                            arraysistemas = [];
                            regGrupo.getForm().reset();
                            btnModificar.disable();
                            btnEliminar.disable();
                            arbolSistema.getRootNode().reload();
                        }
                        if (action.result.codMsg == 3)
                            mostrarMensaje(action.result.codMsg, action.result.mensaje, focusGrupo);
                    }
                });
            }
            else {
                mostrarMensaje(3, etiquetas.informationGrupoMsg, focusGrupo);
                Secodena.ocultarMascara('maskConexion');
            }
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusGrupo);
    }

    ////---------- Adicionar Rol ----------////
    function adicionarRol(apl) {
        if (regrol.getForm().isValid()) {
            var resultado = new Array();
            var arrPadres = new Array();
            Secodena.mostrarMascara('maskConexion', etiquetas.msgWait, etiquetas.msgAdd);
            arrayAdd = gruposAdd();
            var arrayNodos = arbolSistemaRol.getChecked();
            if (arrayNodos.length > 0) {
                for (var i = 0; i < arrayNodos.length; i++) {
                    if (!existesistema(arrPadres, arrayNodos[i].parentNode.attributes.idsistema)) {
                        var result = new Array();
                        arrPadres.push(arrayNodos[i].parentNode.attributes.idsistema);
                        result[0] = arrayNodos[i].parentNode.attributes.idsistema;
                        result[1] = dameFuncionalidades(arrayNodos[i].parentNode.attributes.idsistema, arrayNodos);
                        resultado.push(result);
                        damesistemas(arrayNodos[i]);
                    }
                }
            }

            if (arrayAdd.length == 0 && arrayNodos.length == 0) {
                mostrarMensaje(3, etiquetas.informationMsg, focusRol);
                Secodena.ocultarMascara('maskConexion');
                return;
            }

            regrol.getForm().submit({
                url: 'insertar',
                timeout: 1800000,
                params: {
                    arraysistfun: Ext.encode(resultado),
                    arraysist: Ext.encode(arraysistemas),
                    arrayGrupo: Ext.encode(arrayAdd),
                    clase: 'SegRol',
                    type: 'rol'
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskConexion');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        if (!apl)
                            winIns.hide();
                        stUsuario.reload();
                        arraytiene = [];
                        arraysistemas = [];
                        arrayPaginado = [];
                        regrol.getForm().reset();
                        arbolSistemaRol.getRootNode().reload();
                        Ext.getCmp('tabPanelRG').activate(0);
                        gridGrupos.getSelectionModel().clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();

                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje, focusRol);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusRol);
    }

    ////---------- Modificar Rol ----------////
    function modificarRol() {
        arrayAdd = gruposAdd();
        arrayDel = gruposDel();
        if (regrol.getForm().isValid()) {
            Secodena.mostrarMascara('maskRolMod', etiquetas.msgWait, etiquetas.msgMod);
            var resultado = new Array();
            var arrPadres = new Array();
            var arrayNodos = getChecked();
            if (arrayNodos.length > 0) {
                for (var i = 0; i < arrayNodos.length; i++) {
                    if (!existesistema(arrPadres, arrayNodos[i].parentNode.attributes.idsistema)) {
                        var result = new Array();
                        arrPadres.push(arrayNodos[i].parentNode.attributes.idsistema);
                        result[0] = arrayNodos[i].parentNode.attributes.idsistema;
                        result[1] = dameFuncionalidades(arrayNodos[i].parentNode.attributes.idsistema, arrayNodos);
                        resultado.push(result);
                        damesistemas(arrayNodos[i]);
                    }
                }
                arrayeliminar = sistemaEliminar();
            } else
                arrayeliminar = arraytiene;
            regrol.getForm().submit({
                url: 'modificar',
                params: {
                    arraysistfun: Ext.encode(resultado),
                    arraysist: Ext.encode(arraysistemas),
                    arrayeliminar: Ext.encode(arrayeliminar),
                    arrayGruposAdd: Ext.encode(arrayAdd),
                    arrayGruposDel: Ext.encode(arrayDel),
                    idrol: getIdRol(),
                    type: (tipo) ? 'grupo' : 'rol',
                    clase: getClass()
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskRolMod');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        arrayGrupos = [];
                        arrayPaginado = [];
                        resultado = {};
                        Ext.getCmp('tabPanelRG').activate(0);
                        actualizarDatos();
                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje, focusRol);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusRol);
    }

    ////---------- Modificar Grupo ----------////
    function modificarGrupo() {
        if (regGrupo.getForm().isValid()) {
            Secodena.mostrarMascara('maskRolMod', etiquetas.msgWait, etiquetas.msgMod);
            var resultado = new Array();
            var arrPadres = new Array();
            var arrayNodos = getChecked();
            if (arrayNodos.length > 0) {
                for (var i = 0; i < arrayNodos.length; i++) {
                    if (!existesistema(arrPadres, arrayNodos[i].parentNode.attributes.idsistema)) {
                        var result = new Array();
                        arrPadres.push(arrayNodos[i].parentNode.attributes.idsistema);
                        result[0] = arrayNodos[i].parentNode.attributes.idsistema;
                        result[1] = dameFuncionalidades(arrayNodos[i].parentNode.attributes.idsistema, arrayNodos);
                        resultado.push(result);
                        damesistemas(arrayNodos[i]);
                    }
                }
                arrayeliminar = sistemaEliminar();
            } else
                arrayeliminar = arraytiene;
            regGrupo.getForm().submit({
                url: 'modificar',
                params: {
                    arraysistfun: Ext.encode(resultado),
                    arraysist: Ext.encode(arraysistemas),
                    arrayeliminar: Ext.encode(arrayeliminar),
                    idrol: getIdRol(),
                    type: (tipo) ? 'grupo' : 'rol',
                    clase: getClass()
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskRolMod');
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        resultado = {};
                        actualizarDatos();
                    }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje, focusGrupo);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusGrupo);
    }

    ////---------- Eliminar Rol ----------////
    function eliminarRol() {
        var arrayRolesElim = [];
        arrayRolesElim = getIdsEliminar();
        if (tipo)
            mostrarMensaje(2, etiquetas.confirmationMsgGrupo, elimina);
        else
            mostrarMensaje(2, etiquetas.confirmationMsg, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                var variable = (!tipo)?etiquetas.msgDEL:etiquetas.msgDELGrupo;
                Secodena.mostrarMascara('maskRolDel', etiquetas.msgWait, variable);
                Ext.Ajax.request({
                    url: 'eliminar',
                    method: 'POST',
                    params: {
                        arrayRolesElim: Ext.encode(arrayRolesElim),
                        clase: getClass()
                    },
                    callback: function (options, success, response) {
                        Secodena.ocultarMascara('maskRolDel');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            actualizarDatosEliminar();
                        }
                        if (responseData.codMsg == 3)
                            mostrarMensaje(responseData.codMsg, responseData.mensaje, focusRol);
                    }
                });
            }
            else
                Secodena.ocultarMascara('maskRolDel');
        }
    }

    ////---------- Función genérica para obtener los roles o grupos seleccionados para eliminar ----------////
    function getIdsEliminar() {
        var arrayRolesElim = [];
        if (tipo) {
            var arrGrupoElim = smGrupo.getSelections();
            for (var i = 0; i < arrGrupoElim.length; i++)
                arrayRolesElim.push(arrGrupoElim[i].data.idrol);
        } else {
            var arrRolesElim = sm.getSelections();
            for (var j = 0; j < arrRolesElim.length; j++)
                arrayRolesElim.push(arrRolesElim[j].data.idrol);
        }
        return arrayRolesElim;
    }

    ////---------- Función usada para obtener los nodos a adicionar sin importar el paginado ----------////
    function addNodesCheckeds(self) {
        arrayNodos = gridGrupos.checkeds;
        var result = new Array();
        result[0] = self.getPageData().activePage;
        result[1] = new Array();
        for (i in arrayNodos) {
            if (arrayNodos[i])
                result[1].push(self.store.getAt(i).data.idrol);
            else
                result[1].push(0);
        }
        arrayPaginado.push(result);
    }

    ////---------- Función genérica para actualizar los datos despues de haber eliminado roles o grupos ----------////
    function actualizarDatosEliminar() {
        if (tipo) {
            stIP.reload();
            smGrupo.clearSelections();
            btnModificarGrupo.disable();
            btnEliminarGrupo.disable();
        } else {
            stUsuario.reload();
            sm.clearSelections();
            btnModificar.disable();
            btnEliminar.disable();
        }
    }

    function getChecked() {
        var ArrayNodos = [];
        if (tipo)
            ArrayNodos = arbolSistema.getChecked();
        else
            ArrayNodos = arbolSistemaRol.getChecked();

        return ArrayNodos;
    }

    ////------------ Función generica usada para actualizar los datos del rol o de el grupo ------------////
    function actualizarDatos() {
        arraytiene = [];
        arraysistemas = [];
        if (tipo) {
            winModGrupo.hide();
            stIP.reload();
            btnModificarGrupo.disable();
            btnEliminarGrupo.disable();
        } else {
            winMod.hide();
            stUsuario.reload();
            btnModificar.disable();
            btnEliminar.disable();
        }
    }

    ////------------ Función generica usada para obtener el nombre de la clase ------------////
    function getClass() {
        var clase = '';
        if (tipo)
            clase = 'SegGrupo';
        else
            clase = 'SegRol';
        return clase;
    }

    ////------------ Función usada para obtener el id del rol ------------////
    function getIdRol() {
        if (tipo)
            return smGrupo.getSelected().data.idrol;
        else
            return sm.getSelected().data.idrol;
    }

    function damesistemas(nodo) {
        if (nodo.parentNode && nodo.parentNode.attributes.idsistema && !existesistema(arraysistemas, nodo.parentNode.attributes.idsistema))
            arraysistemas.push(nodo.parentNode.attributes.idsistema);
        if (nodo.parentNode)
            damesistemas(nodo.parentNode);
        return 0;
    }

    function dameFuncionalidades(idPadre, array) {
        var resultado = new Array();
        for (var i = 0; i < array.length; i++) {
            if (array[i].parentNode.attributes.idsistema == idPadre)
                resultado.push(array[i].attributes.idfuncionalidad);
        }
        return resultado;
    }

    function existesistema(arraysistemas, sistema) {
        for (var f = 0; f < arraysistemas.length; f++) {
            if (arraysistemas[f] == sistema)
                return true;
        }
        return false;
    }

    ////------------ Adicionar Acciones ------------////
    function adicionaraccion() {
        var arrAccs = smnotieneaccion.getSelections();
        var arrAcc = [];
        for (var i = 0; i < arrAccs.length; i++)
            arrAcc.push(arrAccs[i].data.idrecurso);
        if (regularAcciones.getForm().isValid()) {
            Secodena.mostrarMascara('maskAddAciones', etiquetas.msgWait, etiquetas.msgAdd);
            regularAcciones.getForm().submit({
                url: 'adicionaraccion',
                params: {
                    idsistema: idi,
                    idfuncionalidad: idu,
                    idrol: idr,
                    idrecurso: Ext.encode(arrAcc)
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskAddAciones');
                    if (action.result.tiene == 1) {
                        storeTieneAccion.reload();
                        storeNoTieneAccion.reload();
	                    btnAnterior.disable();
	                    btnSiguiente.disable();
                    }
	                if(storeTieneAccion.totalLength==0){
		                btnAnterior.disable();
		                btnSiguiente.disable();
	                }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    ////------------ Eliminar Acciones ------------////
    function eliminaraccion() {
        var arrAccs = smtieneaccion.getSelections();
        var arrAcc = [];
        for (var i = 0; i < arrAccs.length; i++)
            arrAcc.push(arrAccs[i].data.idrecurso);
        if (regularAcciones.getForm().isValid()) {
            Secodena.mostrarMascara('maskDelAcciones', etiquetas.msgWait, etiquetas.msgDelAccion);
            regularAcciones.getForm().submit({
                url: 'eliminaraccion',
                params: {
                    idsistema: idi,
                    idfuncionalidad: idu,
                    idrol: idr,
                    idrecurso: Ext.encode(arrAcc)
                },
                failure: function (form, action) {
                    Secodena.ocultarMascara('maskDelAcciones');
                    if (action.result.tiene == 1) {
                        storeTieneAccion.reload();
                        storeNoTieneAccion.reload();
	                    btnAnterior.disable();
	                    btnSiguiente.disable();
                    }
	                if(storeNoTieneAccion.totalLength==0){
		                btnAnterior.disable();
		                btnSiguiente.disable();
	                }
                    if (action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
    }

    ////------------ Para marcar un solo nodo ------------////
    function marcauno(node, idnode) {
        var arraynodos = node.parentNode.childNodes;
        if (node.attributes.checked) {
            for (var i = 0; i < arraynodos.length; i++) {
                if (arraynodos[i].id != idnode)
                    cambiarEstadoCheck(arraynodos[i], false);
                else
                    cambiarEstadoCheck(arraynodos[i], true);
            }
        }
    }

    ////------------ Auxiliar para marcar y desmarcar nodos ------------////
    function cambiarEstadoCheck(anodehijo, check) {
        if (anodehijo.attributes.checked != check) {
            anodehijo.getUI().toggleCheck(check);
            anodehijo.attributes.checked = check;
            banderaClick = false;
            anodehijo.fireEvent('checkchange', anodehijo, check);
        }
    }

    ////------------ obtener sistemas a eliminar ------------////
    function sistemaEliminar() {
        arrayeliminar = [];
        for (i = 0; i < arraytiene.length; i++) {
            bandera = false;
            for (j = 0; j < arraysistemas.length; j++) {
                if (arraytiene[i] == arraysistemas[j]) {
                    bandera = true;
                    break;
                }
            }
            if (!bandera)
                arrayeliminar.push(arraytiene[i]);
        }
        return arrayeliminar;
    }

    ////------------ buscar roles por denominacion ------------////
    function buscar(denrol, type) {
	    if(type){
		    if (Ext.getCmp('denGrupo').validate() == true) {
			    busqueda_gridG = true;
			    stIP.baseParams.denGrupo = denrol;
			    stIP.load({
				    params: {
					    start: 0,
					    limit: 15
				    }
			    });
                            btnRegularGrupo.disable();
                            btnEliminarGrupo.disable();
                            btnModificarGrupo.disable();
		    }
		    else
			    mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
	    }else {
		    if(Ext.getCmp('denrol').validate() == true){
			    busqueda_gridR = true;
			    stUsuario.baseParams.denrol = denrol;
			    stUsuario.load({
				    params: {
					    start: 0,
					    limit: 15
				    }
			    });
                            btnRegular.disable();
                            btnEliminar.disable();
                            btnModificar.disable();
		    }
		    else
			    mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
	    }
    }

    ////------------ Función genérica usada para limpiar los filtros de búsqueda ------------////
    function clearFilters(type) {
        if (type) {
            denGrupo.reset();
            stIP.baseParams = {};
            stIP.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
        } else {
            denrol.reset();
            stUsuario.baseParams = {};
            stUsuario.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
        }
	    focusGrupo();
	    focusRol();
    }

    ////------------ Usada para cargar el grid de grupos ------------////
    function activarGridGrupos(idrol) {
        tabsPanelRG.activate(arbolSistemaRol);
        storegridGrupos.load({
            params: {
                start: 0,
                limit: 3,
                idrol: idrol
            }
        });
    }
    ////------------ Usada para guardar los grupos que estan asignados inicialmente al rol seleccionado ------------////
    function getGruposInsertados(records) {
        for (var i = 0; i < records.length; i++)
            if (records[i].data.checket)
                arrayGrupos.push(records[i].data.idrol);
    }

    ////------------ Retorna un Array con los grupos nuevos a insertar ------------////
    function gruposAdd() {
        var arraySelected = new Array();
        var arrayCheckeds = gridGrupos.getSelectionModel().getSelections();
        for (var j = 0; j < arrayCheckeds.length; j++) {
            arraySelected.push(arrayCheckeds[j].data.idrol);
        }
        for (var k = 0; k < arrayPaginado.length; k++) {
            for (var i = 0; i < arrayPaginado[k][1].length; i++) {
                if (arrayPaginado[k][1][i] != 0)
                    arraySelected.push(arrayPaginado[k][1][i]);
            }
        }
        return array_diff(arraySelected, arrayGrupos);
    }

    ////------------ Retorna un Array con los grupos a eliminar ------------////
    function gruposDel() {
        var arraySelected = new Array();
        var arrayTemp = new Array();
        var arrayCheckeds = gridGrupos.getSelectionModel().getSelections();
        for (var j = 0; j < arrayCheckeds.length; j++) {
            arrayTemp.push(arrayCheckeds[j].data.idrol);
        }
        for (var k = 0; k < arrayPaginado.length; k++) {
            for (var i = 0; i < arrayPaginado[k][1].length; i++) {
                if (arrayPaginado[k][1][i] != 0)
                    arraySelected.push(arrayPaginado[k][1][i]);
            }
        }
        return array_diff(arrayGrupos, array_merge(arraySelected, arrayTemp));
    }

    ////------------ Determina la diferencia que existe entre dos arreglos ------------////
    function array_diff(arrayI, arrayF) {
        var arrayResult = new Array();
        for (var i = 0; i < arrayI.length; i++) {
            var fly = true;
            for (var j = 0; j < arrayF.length; j++) {
                if (arrayI[i] == arrayF[j]) {
                    fly = false;
                    break;
                }
            }
            if (fly)
                arrayResult.push(arrayI[i]);
        }
        return arrayResult;
    }

    ////------------ Mescla dos arreglos sin repetir valores ------------////
    function array_merge(arrayI, arrayF) {
        var arrayResult = new Array();
        if (arrayI.length == 0 && arrayF.length > 0)
            return arrayF;
        if (arrayF.length == 0 && arrayI.length > 0)
            return arrayI;
        for (var i = 0; i < arrayI.length; i++) {
            arrayResult.push(arrayI[i]);
        }
        for (var j = 0; j < arrayF.length; j++) {
            var bandera = true;
            for (var k = 0; k < arrayResult.length; k++) {
                if (arrayF[j] == arrayResult[k]) {
                    bandera = false;
                    break;
                }
            }
            if (bandera)
                arrayResult.push(arrayI[j]);
        }
        return arrayResult;
    }

    ////------------ Función genérica usada para cargar la ayuda de la funcionalidad ------------////
    function cargarAyuda(title, referencia) {
        help.show(title, referencia);
    }
}