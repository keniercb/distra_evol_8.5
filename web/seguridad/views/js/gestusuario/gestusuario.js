
UCID.portal.cargarEtiquetas('gestusuario', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar variables ------------////
var winIns, winMod, vpGestUsuario, winRol, winPass, fpPass, btnRol, panelRolEntidad, arrayPadresEliminar = [], arregloDeschequeados = [], arrayTiene = [];
var storeGridRol, estado, bandera = true,via=false;
var idusuario, nodo, gridRol, sm, TFContrasenna, TFConfContrasenna;
var usuario, regUsuario, modificar = 0, idrol = 0, bandera_rol_entidad = false, banderaMod = false, cantrecords;
var profile = Ext.decode(Base64.decode(document.getElementById('profile').value));

function cargarInterfaz(perfil, etiquetas) {
    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        id: 'btnAgrUser',
        prevTab: 'btnClearField',
        hidden: true,
        iconCls: 'adicionar',
        tooltip: etiquetas.textToolTipadicionar,
        text: etiquetas.lbBtnAdicionar,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 105,
                alt: true
            }
        },
        handler: function() {
            winForm('Ins');
        }
    });

    btnModificar = new Ext.Button({
        disabled: true,
        id: 'btnModUser',
        hidden: true,
        iconCls: 'modificar',
        text: etiquetas.lbBtnModificar,
        tooltip: etiquetas.textToolTipMod,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 109,
                alt: true
            }
        },
        handler: function() {
            if (sm.getCount() >= 1)
                winForm('Mod');
        },
        listeners: {
            click: function() {
                banderaMod = true;
            }
        }
    });

    btnEliminar = new Ext.Button({
        disabled: true,
        id: 'btnEliUser',
        hidden: true,
        iconCls: 'eliminar',
        text: etiquetas.lbBtnEliminar,
        tooltip: etiquetas.textToolTipDel,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: Ext.EventObject.DELETE,
                stopEvent: true
            }
        },
        handler: function() {
            if (sm.getCount() >= 1)
                eliminarusuario();
        }
    });

    btnRol = new Ext.Button({
        id: 'btnAgrUserRol',
        icon: perfil.dirImg + 'asignaroles.png',
        iconCls: 'btn',
        hidden: true,
        disabled: true,
        text: etiquetas.lbBtnRol,
        tooltip: etiquetas.textToolTipAddRol,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 115,
                alt: true
            }
        },
        handler: function() {
            if (sm.getCount() >= 1)
                winForm('Rol');
        }
    });

    var btneliminarPerfil = new Ext.Button({
        id: 'btneliminarPerfil',
        hidden: true,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar perfil del usuario',
        handler: function () {
            if (sm.getCount() == 1){
                Ext.getBody().mask(etiquetas.msgWait);
                Ext.Ajax.request({
                    url: 'deleteProfileOrRoleToUser',
                    params: {
                        idusuario: sm.getSelected().data.idusuario,
                        entity: 'profile'
                    },
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        if(success) {
                            mostrarMensaje(1,'Se ha eliminado el perfil del usuario seleccionado.');
                        }
                    }
                });
            }
                
            
        }
    });

    var btneliminarRolUser = new Ext.Button({
        id: 'btneliminarRolUser',
        hidden: true,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar todos los roles asocionados al usuario',
        handler: function () {
            if (sm.getCount() == 1){
                Ext.getBody().mask(etiquetas.msgWait);
                Ext.Ajax.request({
                    url: 'deleteProfileOrRoleToUser',
                    params: {
                        idusuario: sm.getSelected().data.idusuario,
                        entity: 'role'
                    },
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        if(success) {
                            mostrarMensaje(1,'Los roles han sido eliminados satisfactoriamente.');
                        }
                    }
                });
            }
        }
    });

    btnAyuda = new Ext.Button({
        id: 'btnAyuUser',
        iconCls: 'ayuda',
        text:'<b>'+etiquetas.lbBtnAyuda+'</b>',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,
        nextTab: 'usuario',
        prevTab: 'btnFichaUsuario',
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
                    handler: function() {
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
                    handler: function() {

                        var uri = "seguridad";
                        acercaDe.show(uri);
                    }}
            ]
        })

    });
    /**btnAyuda = new Ext.Button({
     id: 'btnAyuUser',
     iconCls: 'ayuda',
     text: etiquetas.lbBtnAyuda,
     tooltip: etiquetas.textToolTipHelp,
     nextTab: 'usuario',
     prevTab: 'btnFichaUsuario',
     hotKey: {
     idGrupo: 'grid1',
     config: {
     key: 104,
     alt: true
     }
     },
     handler: function() {
     cargarAyuda();
     }
     });*/

    btnContrasena = new Ext.Button({
        id: 'btnContUser',
        icon: perfil.dirImg + 'cambiarcontrasena.png',
        iconCls: 'btn',
        hidden: true,
        disabled: true,
        text: etiquetas.lbBtnContrasena,
        tooltip: etiquetas.textToolTipContras,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 119,
                alt: true
            }
        },
        handler: function() {
            if (sm.getCount() >= 1)
                winForm('Pass');
        }
    });

    btnActivar = new Ext.Button({
        id: 'btnActivarUser',
        icon: perfil.dirImg + 'banderaverde.png',
        iconCls: 'btn',
        hidden: true,
        disabled: true,
        text: etiquetas.lbBtnactivarusuario,
        tooltip: etiquetas.textToolTipActivar,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 99,
                alt: true
            }
        },
        handler: function() {
            if (sm.getCount() >= 1)
                activarUsuarios();
        }
    });

    btnDesactivar = new Ext.Button({
        id: 'btnDesctivarUser',
        icon: perfil.dirImg + 'banderaroja.png',
        iconCls: 'btn',
        hidden: true,
        disabled: true,
        text: etiquetas.lbBtndesactivarusuario,
        tooltip: etiquetas.textToolTipDesct,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 116,
                alt: true
            }
        },
        handler: function() {
            if (sm.getCount() >= 1)
                desactivarUsuarios();
        }
    });

    btnVerPerfil = new Ext.Button({
        id: 'btnFichaUsuario',
        hidden: true,
        disabled: true,
        iconCls: 'ver',
        text: etiquetas.lbBtnfichausuario,
        tooltip: etiquetas.textToolTipVerPerf,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 118,
                alt: true
            }
        },
        handler: function() {
            winForm('fichausuario');
        }
    });

    btnAsignarPerfil = new Ext.Button({
        disabled: true,
        id: 'datosusuario',
        icon: perfil.dirImg + 'asignarperfil.png',
        iconCls: 'btn',
        text: etiquetas.lbBtnAsignarPerfil,
        tooltip: etiquetas.textToolTipAsigPerf,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 112,
                alt: true
            }
        },
        handler: function() {
            if (sm.getCount() >= 1)
                winForm('usuario');
        }
    });

    UCID.portal.cargarAcciones(window.frameElement.id, enfocarElemento);

    // //------------ TextField - Contraseña------------////
    TFContrasenna = new Ext.form.TextField({
        fieldLabel: '<br />' + etiquetas.lbTitMsgContrasena,
        inputType: 'password',
        id: 'contrasenna',
        nextTab: 'contrasena',
        prevTab: 'nombreusuario',
        tabIndex: 10,
        allowBlank: true,
        maxLength: 255,
        blankText: etiquetas.lbMsgEstecampoesrequerido,
        name: 'contrasenna',
        anchor: '95%'
    });

    // //------------ TextField - Confirmar Contraseña------------////
    TFConfContrasenna = new Ext.form.TextField({
        fieldLabel: etiquetas.lbTitMsgConfirmarcontrasena,
        id: 'contrasena',
        inputType: 'password',
        nextTab: 'btncancel',
        prevTab: 'contrasenna',
        tabIndex: 11,
        maxLength: 255,
        allowBlank: true,
        blankText: etiquetas.lbMsgEstecampoesrequerido,
        name: 'contrasena',
        anchor: '100%'
    });

    ////------------ Store del combobox de Dominio ------------////
    var storeDominio = new Ext.data.Store({
        data: Ext.decode(Base64.decode(document.getElementById('arrayDomIns').value)),
        reader: new Ext.data.JsonReader({
            id: 'iddominio',
            root: 'datos'
        },
        [
            {
                name: 'iddominio',
                mapping: 'iddominio'
            },
            {
                name: 'dominio',
                mapping: 'denominacion'
            }
        ])
    });

    var storeDominioBuscar = new Ext.data.Store({
        data: Ext.decode(Base64.decode(document.getElementById('arrayDomBusc').value)),
        reader: new Ext.data.JsonReader({
            id: 'iddominio',
            root: 'datos'
        },
        [
            {
                name: 'iddominio',
                mapping: 'iddominio'
            },
            {
                name: 'dominio',
                mapping: 'denominacion'
            }
        ])
    });

    var storeDataTmp = new Ext.data.SimpleStore({
        data: [
            ['seleccione', 'Seleccione'],
            ['activar', 'Activar'],
            ['desactivar', 'Desactivar']
        ],
        fields: ['value', 'text']
    });

    function focusADD() {
        btnAdicionar.focus(200);
    }

    ////------------ Store del Grid de usuarios ------------////
    var storeGrid = new Ext.data.Store({
        url: 'cargarusuario',
        listeners: {
            load: function(st, object) {
                if (st.getCount() != 0)
                    cantrecords = st.getCount();
                else {
                    if (nombreusuario.getValue() || activar.getValue() || dominiobuscar.getValue())
                        /**Ext.Msg.show({
                         title: etiquetas.msgInf,
                         msg: etiquetas.msgInfDatosMostrar,
                         buttons: Ext.Msg.OK,
                         fn: focusADD,
                         icon: Ext.MessageBox.INFO
                         })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar, focusADD());
                    else
                        /**Ext.Msg.show({
                         title: etiquetas.msgInf,
                         msg: etiquetas.msgInfDatos,
                         buttons: Ext.Msg.OK,
                         fn: focusADD,
                         icon: Ext.MessageBox.INFO
                         })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatos, focusADD());
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "idusuario"
        },
        [
            {
                name: 'nombreusuario',
                mapping: 'nombreusuario'
            },
            {
                name: 'activo',
                mapping: 'activo'
            },
            {
                name: 'iddominio',
                mapping: 'iddominio'
            },
            {
                name: 'idtema',
                mapping: 'idtema'
            },
            {
                name: 'ididioma',
                mapping: 'ididioma'
            },
            {
                name: 'iddesktop',
                mapping: 'iddesktop'
            },
            {
                name: 'dominio',
                mapping: 'dominio'
            },
            {
                name: 'tema',
                mapping: 'tema'
            },
            {
                name: 'idioma',
                mapping: 'idioma'
            },
            {
                name: 'desktop',
                mapping: 'desktop'
            },
            {
                name: 'servidor',
                mapping: 'deominacion'
            },
            {
                name: 'idservidor',
                mapping: 'idservidor'
            },
            {
                name: 'idusuario',
                mapping: 'idusuario'
            },
            {
                name: 'ip',
                mapping: 'ip'
            },
            {
                name: 'idpersona',
                mapping: 'idpersona'
            },
            {
                name: 'simpleacceso',
                mapping: 'simpleacceso'
            },
            {
                name: 'reescribirsesion',
                mapping: 'reescribirsesion'
            }
        ])
    });

    ////------------ Modo de seleccion del grid de usuarios ------------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    sm.on('beforerowselect', function() {
        btnEliminar.enable();
        btnAdicionar.enable();
        btnActivar.enable();
        btnDesactivar.enable();
        btnVerPerfil.disable();
        btneliminarPerfil.disable();
        btneliminarRolUser.disable();
        btnRol.enable();
        btnAsignarPerfil.enable();
    }, this);


    sm.on('rowselect', function(smodel, rowIndex, record) {
        if (sm.getCount() != 1) {
            btnModificar.disable();
            btnContrasena.disable();
            btnVerPerfil.disable();
            btneliminarPerfil.disable();
            btneliminarRolUser.disable();
        } else {
            btnModificar.enable();
            btnContrasena.enable();
            btnVerPerfil.enable();
            btnAsignarPerfil.enable();
            btneliminarPerfil.enable();
            btneliminarRolUser.enable();
            if (record.data.activo == false) {
                btnRol.disable();
                btnDesactivar.disable();
                btnActivar.enable();
            } else {
                btnContrasena.enable();
                btnRol.enable();
                btnDesactivar.enable();
                btnActivar.disable();
            }
            if (record.data.idpersona) {
                btnVerPerfil.enable();
            } else {
                btnVerPerfil.disable();
            }
        }
    }, this);

    sm.on('rowdeselect', function() {
        if (sm.getCount() != 1) {
            btnModificar.disable();
            btnContrasena.disable();
            btnVerPerfil.disable();
            btneliminarPerfil.disable();
            btneliminarRolUser.disable();
        } else {
            btnModificar.enable();
            btnContrasena.enable();
            btnVerPerfil.enable();
            btneliminarPerfil.enable();
            btneliminarRolUser.enable();
        }
    }, this);

    function cargarIcons(val) {
        if (val == true)
            return "<img src='" + (perfil.dirImg + "banderaverde.png'") + "/>";
        else
            return "<img src='" + (perfil.dirImg + "banderaroja.png'") + "/>";
    }

    var dominiobuscar = new Ext.form.ComboBox({
        emptyText: etiquetas.lbSeleccionardominio,
        editable: false,
        enableQtip: true,
        fieldLabel: etiquetas.lbDominio,
        store: storeDominioBuscar,
        valueField: 'iddominio',
        displayField: 'dominio',
        hiddenName: 'iddominio',
        forceSelection: true,
        colWidth: .2,
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: "98%"
    });

    var activar = new Ext.form.ComboBox({
        emptyText: etiquetas.lbSeleccionarestado,
        editable: false,
        enableQtip: true,
        fieldLabel: etiquetas.lbActivacion,
        store: storeDataTmp,
        valueField: 'text',
        displayField: 'text',
        hiddenName: 'activo',
        id: 'buscar_activar',
        forceSelection: true,
        typeAhead: true,
        colWidth: .2,
        anchor: "98%",
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true
    });

    ////------------ Creando el Grid de usuarios ------------////
    var grid = new Ext.grid.GridPanel({
        region: 'center',
        title: etiquetas.titleGridUsuarios,
        frame: false,
        border: false,
        cls: 'x-toolbar',
        autoExpandColumn: 'expandir',
        store: storeGrid,
        sm: sm,
        columns: [
            {
                header: etiquetas.lbUsuario,
                width: 150,
                dataIndex: 'nombreusuario',
                sortable: true

            },
            {
                header: etiquetas.lbDominio,
                width: 200,
                dataIndex: 'dominio',
                sortable: true
            },
            {
                header: etiquetas.lbTema,
                width: 100,
                dataIndex: 'tema',
                sortable: true
            },
            {
                header: etiquetas.lbIdioma,
                width: 100,
                dataIndex: 'idioma',
                sortable: true
            },
            {
                header: etiquetas.lbEscritorio,
                width: 200,
                dataIndex: 'desktop',
                sortable: true
            },
            {
                header: etiquetas.lbIP,
                width: 100,
                dataIndex: 'ip',
                id: 'expandir',
                sortable: true
            },
            {
                header: etiquetas.lbActivo,
                width: 50,
                dataIndex: 'activo',
                renderer: cargarIcons
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idusuario'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'iddominio'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idtema'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'ididioma'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'servidor'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idservidor'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'iddesktop'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idpersona'
            }
        ],
        loadMask: {
            store: storeGrid
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            id: 'ptbaux',
            beforePageText: etiquetas.textPagina,
            afterPageText: etiquetas.textDe,
            store: storeGrid,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
        })

    });
    var nombreusuario = new Ext.form.TextField({
        fieldLabel: etiquetas.lbTitDenBuscar,
        width: 20,
        emptyText: etiquetas.emptytext,
        colWidth: .2,
        maxLength: 60,
        vtype: 'vtusuario',
        anchor: "98%",
        id: 'usuario',
        prevTab: 'btnAyuUser'
    });
    var btnBuscar = new Ext.Button({
        id: 'btnBuscarGrid',
        nextTab: 'btnClearField',
        prevTab: 'buscar_activar',
        iconCls: 'buscar',
        text: etiquetas.lbBtnBuscar,
        tooltip: etiquetas.textToolTipSearch,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 98,
                alt: true
            }
        },
        handler: function() {
            buscarnombreusuario(nombreusuario.getValue(), dominiobuscar.getValue(), activar.getValue());
        }
    });

    var btnClear = new Ext.Button({
        id: 'btnClearField',
        nextTab: 'btnAgrUser',
        prevTab: 'btnBuscarGrid',
        iconCls: 'limpiar',
        text: etiquetas.denomLimpiar,
        tooltip: etiquetas.cleanFilter,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 108,
                alt: true
            }
        },
        handler: function() {
            clearFilters();
        }
    });

    var fpFiltro = new Ext.ToolBar.searchToolBar({
        elementos: [nombreusuario, dominiobuscar, activar],
        botones: [btnBuscar, btnClear]
    });

    ////------------ Panel con los componentes ------------////
    var panel = new Ext.Panel({
        layout: 'border',
        items: [fpFiltro, grid],
        id: 'grid1',
        keyMapGroup: true,
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnRol, btnContrasena, btnAsignarPerfil, btnActivar, btnDesactivar, btnVerPerfil,btneliminarPerfil, btneliminarRolUser, '->', btnAyuda]
    });

    ////--------------Funciones usadas en las TC------------////
    panel.on('afterlayout', function() {
        panel.habilitarKeyMap();
    });

    function enfocarElemento() {
        panel.getTopToolbar().items.items[0].focus();

        if (typeof (Ext.pvd) == 'undefined') {
            btnVerPerfil.hide();
            btnAsignarPerfil.hide();
        }
    }

    storeGrid.load({
        params: {
            start: 0,
            limit: 15
        }
    });

    ////------------ Viewport ------------////
    vpGestUsuario = new Ext.Viewport({
        layout: 'fit',
        items: panel
    });

    ////------------------ Store del combobox de Desktop -----------------////
    var storeDesktop = new Ext.data.Store({
        data: Ext.decode(Base64.decode(document.getElementById('arrayCombDesk').value)),
        reader: new Ext.data.JsonReader({
            id: 'id'
        },
        [
            {
                name: 'iddesktop',
                mapping: 'iddesktop'
            },
            {
                name: 'desktop',
                mapping: 'denominacion'
            }
        ])
    });

    ////------------ Store del combobox de Idioma ------------////
    var storeIdioma = new Ext.data.Store({
        data: Ext.decode(Base64.decode(document.getElementById('arrayCombIdio').value)),
        reader: new Ext.data.JsonReader({
            id: 'ididioma'
        },
        [
            {
                name: 'ididioma',
                mapping: 'ididioma'
            },
            {
                name: 'idioma',
                mapping: 'denominacion'
            }
        ])
    });

    ////------------ Store del combobox de Tema ------------////
    var storeTema = new Ext.data.Store({
        data: Ext.decode(Base64.decode(document.getElementById('arrayTemas').value)),
        reader: new Ext.data.JsonReader({
            id: 'idtema'
        },
        [
            {
                name: 'idtema',
                mapping: 'idtema'
            },
            {
                name: 'tema',
                mapping: 'denominacion'
            }
        ])
    });

    ////------------------ Store del combobox de ServidoresAut(Sistema) -----------------////
    storeservidor = new Ext.data.Store({
        data: Ext.decode(Base64.decode(document.getElementById('arrayComServA').value)),
        reader: new Ext.data.JsonReader({
            id: 'id'
        },
        [
            {
                name: 'idservidor',
                mapping: 'idservidor'
            },
            {
                name: 'servidor',
                mapping: 'denominacion'
            }
        ])
    });

    ////------------ Formulario de adicionar usuario ------------////
    regUsuario = new Ext.FormPanel({
        labelAlign: 'top',
        width: 460,
        frame: true,
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .66,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbIpfin,
                                blankText: etiquetas.lbMsgEstecampoesrequerido,
                                maxLength: 255,
                                regexText: etiquetas.lbMsgRangoIP,
                                id: 'ip',
                                nextTab: 'comboDesktop',
                                prevTab: 'btnaccept',
                                tabIndex: 1,
                                allowBlank: false,
                                anchor: '97%'
                            }
                        ]
                    },
                    {
                        columnWidth: .33,
                        layout: 'form',
                        items: [new Ext.form.ComboBox({
                                emptyText: etiquetas.lbSeleccionarescritorio,
                                editable: false,
                                enableQtip: true,
                                fieldLabel: etiquetas.lbTitMsgTipodeescritorio,
                                store: storeDesktop,
                                valueField: 'iddesktop',
                                displayField: 'desktop',
                                id: 'comboDesktop',
                                hiddenName: 'iddesktop',
                                forceSelection: true,
                                typeAhead: true,
                                mode: 'local',
                                allowBlank: false,
                                triggerAction: 'all',
                                selectOnFocus: true,
                                anchor: '100%',
                                nextTab: 'comboIdioma',
                                prevTab: 'ip',
                                tabIndex: 2
                            })]
                    },
                    {
                        columnWidth: .33,
                        layout: 'form',
                        items: [new Ext.form.ComboBox({
                                emptyText: etiquetas.lbSeleccionaridioma,
                                editable: false,
                                enableQtip: true,
                                fieldLabel: etiquetas.lbIdioma,
                                store: storeIdioma,
                                valueField: 'ididioma',
                                id: 'comboIdioma',
                                nextTab: 'comboTema',
                                prevTab: 'comboDesktop',
                                tabIndex: 3,
                                displayField: 'idioma',
                                hiddenName: 'ididioma',
                                forceSelection: true,
                                typeAhead: true,
                                mode: 'local',
                                allowBlank: false,
                                triggerAction: 'all',
                                selectOnFocus: true,
                                anchor: '95%'
                            }), {
                                xtype: "checkbox",
                                boxLabel: etiquetas.lbAcessoConcurrente,
                                hideLabel: true,
                                id: 'simpleacceso',
                                name: 'simpleacceso',
                                inputValue: 'true',
                                checked: 'true',
                                tabIndex: 6,
                                listeners: {
                                    check: function(component) {
                                        if (component.checked == true) {
                                            Ext.getCmp("reescribirsesion").enable();
                                        }
                                        if (component.checked == false) {
                                            Ext.getCmp("reescribirsesion").setValue('false');
                                            Ext.getCmp("reescribirsesion").disable();
                                        }
                                    }
                                }
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '<br />' + etiquetas.lbUsuario,
                                allowBlank: false,
                                blankText: etiquetas.lbMsgEstecampoesrequerido,
                                vtype: 'vtusuario',
                                id: 'nombreusuario',
                                nextTab: 'contrasenna',
                                prevTab: 'comboServAuth',
                                tabIndex: 9,
                                maxLength: 60,
                                anchor: '95%'
                            }
                        ]
                    },
                    {
                        columnWidth: .33,
                        layout: 'form',
                        items: [
                            new Ext.form.ComboBox({
                                emptyText: etiquetas.lbSeleccionartema,
                                editable: false,
                                enableQtip: true,
                                fieldLabel: etiquetas.lbTema,
                                store: storeTema,
                                valueField: 'idtema',
                                displayField: 'tema',
                                id: 'comboTema',
                                nextTab: 'iddom',
                                prevTab: 'comboIdioma',
                                tabIndex: 4,
                                hiddenName: 'idtema',
                                forceSelection: true,
                                typeAhead: true,
                                mode: 'local',
                                allowBlank: false,
                                triggerAction: 'all',
                                selectOnFocus: true,
                                anchor: '95%'
                            }), {
                                xtype: "checkbox",
                                boxLabel: etiquetas.lbReescribirSesion,
                                hideLabel: true,
                                id: 'reescribirsesion',
                                name: 'reescribirsesion',
                                tabIndex: 7,
                                inputValue: 'true',
                                disabled: true
                            },
                            TFContrasenna
                        ]
                    },
                    {
                        columnWidth: .33,
                        layout: 'form',
                        items: [
                            new Ext.form.ComboBox({
                                emptyText: etiquetas.lbSeleccionardominio,
                                editable: false,
                                enableQtip: true,
                                fieldLabel: etiquetas.lbDominio,
                                store: storeDominio,
                                valueField: 'iddominio',
                                displayField: 'dominio',
                                hiddenName: 'iddominio',
                                prevTab: 'comboTema',
                                tabIndex: 5,
                                forceSelection: true,
                                typeAhead: true,
                                mode: 'local',
                                allowBlank: false,
                                triggerAction: 'all',
                                selectOnFocus: true,
                                anchor: '100%',
                                id: 'iddom'
                            }),
                            new Ext.form.ComboBox({
                                emptyText: etiquetas.seleccionServidorMsg,
                                editable: false,
                                enableQtip: true,
                                fieldLabel: etiquetas.fieldLabelServidor,
                                store: storeservidor,
                                valueField: 'idservidor',
                                displayField: 'servidor',
                                hiddenName: 'idservidor',
                                id: 'comboServAuth',
                                tabIndex: 8,
                                forceSelection: true,
                                typeAhead: true,
                                mode: 'local',
                                triggerAction: 'all',
                                selectOnFocus: true,
                                anchor: '100%',
                                listeners: {
                                    select: function(cmb, recTipo) {
                                        if (recTipo.data.idservidor == 0) {
                                            if (banderaMod)
                                                deshabilitarCampos();
                                            else
                                                habilitarCampos();
                                        }
                                        else
                                            deshabilitarCampos();
                                    }
                                }
                            }),
                            TFConfContrasenna]
                    }
                ]
            }
        ]
    });


    ////------------ Formulario de Datos de Sistema ------------////
    fpPass = new Ext.FormPanel({
        frame: true,
        width: 100,
        bodyStyle: 'padding:5px 5px 0',
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: 5,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbUsuario,
                                id: 'usuariop',
                                labelStyle: 'width:150px',
                                width: 200,
                                readOnly: 'true'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbTitMsgContrasenanueva,
                                inputType: 'password',
                                blankText: etiquetas.lbMsgEstecampoesrequerido,
                                id: 'contrasenap',
                                labelStyle: 'width:150px',
                                allowBlank: false,
                                width: 200
                            }, {
                                xtype: 'textfield',
                                fieldLabel: etiquetas.lbTitMsgConfirmarcontrasena,
                                inputType: 'password',
                                blankText: etiquetas.lbMsgEstecampoesrequerido,
                                id: 'contrasennap',
                                labelStyle: 'width:150px',
                                allowBlank: false,
                                width: 200
                            }
                        ]
                    }
                ]
            }
        ]
    });

    function habilitarCampos() {
        TFContrasenna.enable();
        TFConfContrasenna.enable();
        TFContrasenna.allowBlank = false;
        TFConfContrasenna.allowBlank = false;
        estado = false;
    }

    function deshabilitarCampos() {
        TFContrasenna.disable();
        TFConfContrasenna.disable();
        TFContrasenna.allowBlank = true;
        TFConfContrasenna.allowBlank = true;
        estado = true;
    }

    //////////------------Store para cargar el grid de roles---------------/////////
    storeGridRol = new Ext.data.Store({
        url: 'cargarroles',
        listeners: {
            load: function() {
                if (storeGridRol.getCount() == 0) {
                    if (Ext.getCmp('denrolbuscado').getValue())
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
                name: 'descripcion',
                mapping: 'descripcion'
            },
            {
                name: 'estado',
                mapping: 'estado'
            }
        ])
    });

    ////------------ Modo de seleccion del grid de roles ------------////
    var smrol = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    smrol.on('rowselect', function(smodel, rowIndex, record) {
        if (bandera&&!via) {
            Ext.getCmp('btnroles').enable();
            idrol = record.data.idrol;
            arbolEntidades.enable();
            arbolEntidades.getRootNode().reload();
            bandera=false;
        } else if(!bandera&&via){
            Ext.getCmp('btnroles').enable();
            idrol = record.data.idrol;
            arbolEntidades.enable();
            arbolEntidades.getRootNode().reload();
            via=false;
        }else {
            Ext.getCmp('btnroles').enable();
            idrol = record.data.idrol;
            arbolEntidades.enable();
        }
    }, this);
    smrol.on('rowdeselect', function(SelectionModel, rowIndex, record) {
        asignarRol(null, record);
    }, this);

    ////------------ Creando el Grid de roles ------------////
    gridRol = new Ext.grid.GridPanel({
        region: 'west',
        frame: true,
        width: 400,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        margins: '2 2 2 -4',
        store: storeGridRol,
        sm: smrol,
        columns: [
            {
                header: etiquetas.lbRol,
                width: 150,
                dataIndex: 'denominacion',
                id: 'expandir'
            },
            {
                header: etiquetas.lbDescripcion,
                width: 250,
                dataIndex: 'descripcion'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idrol'
            },
            {
                hidden: true,
                hideable: false,
                dataIndex: 'estado'
            }
        ],
        loadMask: {
            store: storeGridRol
        },
        tbar: [
            new Ext.Toolbar.TextItem({
                text: etiquetas.lbTitDenRolBuscar
            }),
            denrolbuscado = new Ext.form.TextField({
                width: 150,
                emptyText: etiquetas.emptytext,
                id: 'denrolbuscado'
            }),
            new Ext.Button({
                iconCls: 'buscar',
                tooltip: etiquetas.textToolTipSearchRol,
                text: etiquetas.lbBtnBuscar,
                hotKey: {
                    idGrupo: 'grid2',
                    config: {
                        key: 98,
                        alt: true
                    }
                },
                handler: function() {
                    buscardenrol(denrolbuscado.getValue());
                }
            }),
            new Ext.Button({
                iconCls: 'limpiar',
                id: 'cleaneap',
                text: etiquetas.denomLimpiar,
                tooltip: etiquetas.cleanFilterRol,
                hotKey: {
                    idGrupo: 'grid2',
                    config: {
                        key: 108,
                        alt: true
                    }
                },
                handler: function() {
                    limpiarFiltro();
                }
            })
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: storeGridRol,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
        })
    });

    gridRol.getView().getRowClass = function(record) {
        if (record.data.estado == 1) {
            bandera_rol_entidad = true;
            return 'FilaAzul';
        }
    };

    /////------------------------------arbol de entidades que estan en mi dominio-------------------------------/////
    arbolEntidades = new Ext.tree.TreePanel({
        autoScroll: true,
        region: 'center',
        split: true,
        disabled: true,
        width: '37%',
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'cargarentidades',
            listeners: {
                'beforeload': function(atreeloader, anode) {
                    atreeloader.baseParams = {};
                    atreeloader.baseParams.idusuario = sm.getSelected().data.idusuario;
                    atreeloader.baseParams.iddominio = sm.getSelected().data.iddominio;
                    atreeloader.baseParams.idrol = idrol;
                    if (anode.attributes.idestructuraop)
                        atreeloader.baseParams.idarea = anode.attributes.idestructuraop;
                },
                'load': function(atreeloader, anode) {
                    hijosNodo = anode.childNodes;
                    if (hijosNodo.length) {
                        for (i = 0; i < hijosNodo.length; i++) {
                            nodoHijo = hijosNodo[i];
                            if (nodoHijo.attributes.checked)
                                adicionarEnDeschequeados(arrayTiene, nodoHijo.attributes.id);
                        }
                    }
                    var id;
                    if (anode.attributes.tipo == 'externa')
                        id = anode.attributes.id;
                    else
                        id = anode.attributes.id;
                    var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);
                    if (esta1 != -1) {
                        eliminarEnDeschequeados(arrayPadresEliminar, esta1);
                        if (arbolEntidades.getChecked("id", anode).length == 0) {
                            hijosNodo = anode.childNodes;
                            for (i = 0; i < hijosNodo.length; i++) {
                                if (!hijosNodo[i].isLeaf()) {
                                    if (hijosNodo[i].attributes.tipo == 'externa')
                                        id = anode.attributes.id;
                                    else
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

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolEntidades = new Ext.tree.AsyncTreeNode({
        text: 'Entidades',
        expandable: false,
        id: '0'
    });
    arbolEntidades.setRootNode(padreArbolEntidades);

    arbolEntidades.on('checkchange', function(node) {
        var esta = estaEnDeschequeados(arregloDeschequeados, node.attributes.id);
        var id;
        if (node.attributes.tipo == 'externa')
            id = node.attributes.id;
        else
            id = node.attributes.id;
        var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);

        if (node.attributes.checked) {
            marcarHijos(node, true);
            if (esta != -1)
                eliminarEnDeschequeados(arregloDeschequeados, esta);
            if (!node.isLeaf() && esta1 != -1)
                eliminarEnDeschequeados(arrayPadresEliminar, esta1);
        }
        else {
            var estaT = estaEnDeschequeados(arrayTiene, id);
            if (estaT != -1)
                adicionarEnDeschequeados(arregloDeschequeados, node.attributes.id);
            if (!node.isLeaf() && node.childNodes.length == 0 && estaT != -1)
                adicionarEnDeschequeados(arrayPadresEliminar, id);
        }
    }, this);

    //Funcion para cambiar el tipo de display de un textfield
    function cambiaDisplayTf(aTf, aTipo) {
        var aDivTF = aTf.getEl();
        var aLblTf = Ext.get(aDivTF.dom.parentNode.parentNode.childNodes[0]);
        if (aTipo) {
            aDivTF.show();
            aLblTf.show();
            return 0;
        }
        aDivTF.hide();
        aLblTf.hide();
    }

    function defaultValueForm(){
        Ext.getCmp('ip').setRawValue('0.0.0.0/0');
        Ext.getCmp('comboDesktop').setValue(profile.iddesktop, false);
        Ext.getCmp('comboIdioma').setValue(profile.ididioma, false);
        Ext.getCmp('comboTema').setValue(profile.idtema, false);
        Ext.getCmp('iddom').setValue(profile.iddominio, false);
        Ext.getCmp('simpleacceso').setValue('true');
        Ext.getCmp('comboServAuth').focus(false, 200);
    }

    ////------------ Panel con los componentes de roles y entidades ------------////
    panelRolEntidad = new Ext.Panel({
        layout: 'border',
        id: 'grid2',
        items: [gridRol, arbolEntidades]
    });

    ////--------------Funciones usadas en las TC------------////
    panelRolEntidad.on('afterlayout', function() {
        panelRolEntidad.habilitarKeyMap();
    });

    //Cargar ventanas
    function winForm(opcion) {
        if (storeservidor.find('idservidor', 0) == -1) {
            rdAuth = Ext.data.Record.create([
                {
                    name: 'idservidor'
                },
                {
                    name: 'servidor'
                }
            ]);
            storeservidor.add(new rdAuth({
                idservidor: 0,
                servidor: etiquetas.LBServidorAutenticacion
            }));
        }
        switch (opcion) {
            case 'Ins':
                {
                    Ext.getCmp('nombreusuario').nextTab = 'contrasenna';
                    Ext.getCmp('ip').prevTab = 'btnaccept';
                    if (!winIns) {
                        winIns = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: etiquetas.lbBtnAdicionarusuario,
                            width: 600,
                            height: 290,
                            listeners: {
                                hide: function() {
                                    banderaMod = false;
                                    panel.getTopToolbar().items.items[0].focus();
                                }
                            },
                            buttons: [
                                {
                                    id: 'btncancel',
                                    iconCls: 'cancelar',
                                    nextTab: 'btnaply',
                                    prevTab: 'contrasena',
                                    tabIndex: 12,
                                    text: etiquetas.lbBtnCancelar,
                                    tooltip: etiquetas.tooltipCancelarVen,
                                    handler: function() {
                                        banderaMod = false;
                                        winIns.hide();
                                    }
                                },
                                {
                                    iconCls: 'aplicar',
                                    id: 'btnaply',
                                    nextTab: 'btnaccept',
                                    prevTab: 'btncancel',
                                    tabIndex: 13,
                                    tooltip: etiquetas.tooltipAplicarVen,
                                    handler: function() {
                                        adicionarusuario('apl');
                                    },
                                    text: etiquetas.lbBtnAplicar
                                },
                                {
                                    iconCls: 'aceptar',
                                    id: 'btnaccept',
                                    nextTab: 'ip',
                                    prevTab: 'btnaply',
                                    tabIndex: 14,
                                    tooltip: etiquetas.tooltipAceptarVen,
                                    handler: function() {
                                        adicionarusuario();
                                    },
                                    text: etiquetas.lbBtnAceptar
                                }
                            ]
                        });
                    }
                    TFContrasenna.enable();
                    TFConfContrasenna.enable();
                    winIns.add(regUsuario);
                    regUsuario.getForm().reset();
                    winIns.doLayout();
                    winIns.show();
                    cambiaDisplayTf(TFContrasenna, true);
                    cambiaDisplayTf(TFConfContrasenna, true);

                    defaultValueForm();

                }
                break;
            case 'Mod':
                {
                    Ext.getCmp('nombreusuario').nextTab = 'btncancelmod';
                    Ext.getCmp('ip').prevTab = 'btnaceptmod';
                    if (!winMod) {
                        winMod = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: etiquetas.lbBtnModificarusuario,
                            width: 600,
                            height: 290,
                            resizable: false,
                            listeners: {
                                hide: function() {
                                    banderaMod = false;
                                    panel.getTopToolbar().items.items[0].focus();
                                }
                            },
                            buttons: [
                                {
                                    icon: perfil.dirImg + 'cancelar.png',
                                    id: 'btncancelmod',
                                    iconCls: 'btn',
                                    nextTab: 'btnaceptmod',
                                    prevTab: 'nombreusuario',
                                    text: etiquetas.lbBtnCancelar,
                                    tooltip: etiquetas.tooltipCancelarVen,
                                    handler: function() {
                                        banderaMod = false;
                                        winMod.hide();
                                    }
                                },
                                {
                                    id: 'btnaceptmod',
                                    iconCls: 'aceptar',
                                    nextTab: 'ip',
                                    prevTab: 'btncancelmod',
                                    tooltip: etiquetas.tooltipAceptarVen,
                                    handler: function() {
                                        modificarUsuario();
                                    },
                                    text: etiquetas.lbBtnAceptar
                                }
                            ]
                        });
                    }
                    modificar = 1;
                    winMod.add(regUsuario);
                    winMod.doLayout();
                    winMod.show();
                    cambiaDisplayTf(TFContrasenna);
                    cambiaDisplayTf(TFConfContrasenna);
                    regUsuario.getForm().loadRecord(sm.getSelected());
                    Ext.getCmp('ip').focus(false, 200);
                    if (!Ext.getCmp('ip').getValue()) {
                        Ext.getCmp('ip').setRawValue('0.0.0.0/0');
                    }

                }
                break;
            case 'Rol':
                {
                    var arrUsuarios = sm.getSelections();
                    if (arrUsuarios.length > 1) {
                        var arrUsuario = [];
                        if (!validarDominiosUsuarios(arrUsuarios))
                            mostrarMensaje(3, etiquetas.validacionDominioMsg, focusADD());
                        else {
                            for (var i = 0; i < arrUsuarios.length; i++)
                                arrUsuario.push(arrUsuarios[i].data.idusuario);
                            Ext.getBody().mask(etiquetas.validacionOperacionMsg);
                            Ext.Ajax.request({
                                url: 'validarasignacionroles',
                                params: {
                                    ArrayUsuarios: Ext.encode(arrUsuario)
                                },
                                callback: function(options, success, response) {
                                    Ext.getBody().unmask();
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.codMsg == 3)
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje, focusADD());
                                    else
                                        ventanaAsignarRol();
                                }
                            });
                        }
                    }
                    else
                        ventanaAsignarRol();
                }
                break;
            case 'Pass':
                {
                    if (!winPass) {
                        winPass = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: etiquetas.lbBtnCambiarpass,
                            width: 400,
                            height: 170,
                            resizable: false,
                            listeners: {
                                hide: function() {
                                    panel.getTopToolbar().items.items[0].focus();
                                }
                            },
                            buttons: [
                                {
                                    iconCls: 'cancelar',
                                    text: etiquetas.lbBtnCancelar,
                                    tooltip: etiquetas.tooltipCancelarVen,
                                    handler: function() {
                                        winPass.hide();
                                    }
                                },
                                {
                                    iconCls: 'aceptar',
                                    nextTab: 'usuariop',
                                    tooltip: etiquetas.tooltipAceptarVen,
                                    handler: function() {
                                        cambiarpass();
                                    },
                                    text: etiquetas.lbBtnAceptar
                                }
                            ]
                        });
                    }
                    winPass.add(fpPass);
                    winPass.doLayout();
                    winPass.show();
                    Ext.getCmp('usuariop').focus(false, 200);
                    Ext.getCmp('usuariop').setValue(sm.getSelected().data.nombreusuario);

                }
                break;
            case 'usuario':
                {
                    mostrarBusquedaPersona();
                }
                break;
            case 'fichausuario':
                {
                    if (sm.getSelected().data.idpersona != null) {
                        var winPerfilPersonaSeg = new Ext.pvd.persona.perfilseguridad.WinperfilSeguridad({
                            persona: sm.getSelected().data.idpersona
                        });
                        winPerfilPersonaSeg.show();
                    } else
                        mostrarMensaje(3, etiquetas.msgPersonaSeguridad, focusADD());
                }
                break;
        }
    }


    function mostrarBusquedaPersona() {
        var panelBusPer;
        var btnCancelarBusPer = new Ext.Button({
            id: 'btnCancelarBusPer',
            iconCls: 'cancelar',
            text: 'Cancelar',
            handler: function() {
                winBusPer.close();
            }
        });
        var btnAceptarBusPer = new Ext.Button({
            id: 'btnAceptarBusPer',
            disabled: true,
            iconCls: 'aceptar',
            text: 'Aceptar',
            handler: function() {
                adicionarPerfil(panelBusPer.getSeleccion().data.idpersona, winBusPer);
            }
        });

        var winBusPer = new Ext.Window({
            modal: true,
            layout: 'fit',
            id: 'winBusPer',
            title: 'Buscar persona',
            width: 700,
            height: 490,
            closeAction: 'destroy',
            closable: true,
            plain: false,
            items: [panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                    seguridad: 0,
                    listeners: {
                        'personaselecionada': function() {
                            btnAceptarBusPer.enable();
                        },
                        'personadeselecionada': function() {
                            btnAceptarBusPer.disable();
                        }
                    },
                    limit: 15,
                    start: 0
                })],
            resizable: true,
            buttons: [btnCancelarBusPer, btnAceptarBusPer]
        });
        winBusPer.show();
    }

    function validarDominiosUsuarios(arrUsuarios) {
        for (i = 0; i < arrUsuarios.length - 1; i++) {
            if (arrUsuarios[i].data.iddominio != arrUsuarios[i + 1].data.iddominio)
                return false;
        }
        return true;
    }

    function ventanaAsignarRol() {
        if (!winRol) {
            winRol = new Ext.Window({
                modal: true,
                closeAction: 'hide',
                layout: 'fit',
                title: etiquetas.lbBtnTramitarroles,
                width: 700,
                height: 450,
                resizable: false,
                buttons: [
                    {
                        iconCls: 'cancelar',
                        text: etiquetas.lbBtnCancelar,
                        tooltip: etiquetas.tooltipCancelarVen,
                        handler: function() {
                            winRol.hide();
                            arbolEntidades.disable();
                            if (Ext.getCmp('denrolbuscado').getValue())
                                Ext.getCmp('denrolbuscado').reset();
                        }
                    },
                    {
                        iconCls: 'aceptar',
                        id: 'btnroles',
                        nextTab: 'denrolbuscado',
                        disabled: true,
                        tooltip: etiquetas.tooltipAceptarVen,
                        handler: function() {
                            if (Ext.getCmp('denrolbuscado').getValue())
                                Ext.getCmp('denrolbuscado').reset();
                            asignarRol('apl');
                        },
                        text: etiquetas.lbBtnAceptar
                    }
                ]
            });
        }
        idrol = 0;
        arbolEntidades.collapseAll();
        winRol.add(panelRolEntidad);
        winRol.doLayout();
        winRol.show();
        Ext.getCmp('denrolbuscado').focus(false, 200);
        storeGridRol.baseParams = {};
        storeGridRol.baseParams.idusuario = sm.getSelected().data.idusuario;
        storeGridRol.load({
            params: {
                start: 0,
                limit: 15
            }
        });
        arrayPadresEliminar = [];
        arregloDeschequeados = [];
        arrayTiene = [];
        smrol.clearSelections();
    }

    ////------------ Modificar usuario ------------////
    var confirmarModDominio = false;

    function modificarUsuario(apl) {
        if (Ext.getCmp('ip').getValue()) {
            if (!validaRango()) {
                mostrarMensaje(3, etiquetas.lbTitMsgRangoIncorrecto, focusADD());
                return;
            }
        }
        if (Ext.getCmp('iddom').getValue() == 0) {
            mostrarMensaje(3, etiquetas.lbTitMsgDominioIncorrecto, focusADD());
            return;
        }
        if (regUsuario.getForm().isValid()) {
            Secodena.mostrarMascara('maskUsuarioMod', etiquetas.msgWait, etiquetas.msgMod);
            if (Ext.getCmp('contrasenna').getValue() == Ext.getCmp('contrasena').getValue()) {
                if ((confirmarModDominio == true && apl == 'ok') || confirmarModDominio == false) {
                    regUsuario.getForm().submit({
                        url: 'modificarusuario',
                        params: {
                            idusuario: sm.getSelected().data.idusuario,
                            estado: estado,
                            confirmar: confirmarModDominio
                        },
                        failure: function(form, action) {
                            Secodena.ocultarMascara('maskUsuarioMod');
                            if (action.result.codMsg == 2) {
                                confirmarModDominio = true;
                                mostrarMensaje(2, action.result.mensaje, modificarUsuario);
                            }
                            else if (action.result.codMsg == 1) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje, focusADD());
                                regUsuario.getForm().reset();
                                winMod.hide();
                                btnModificar.disable();
                                btnEliminar.disable();
                                btnAdicionar.enable();
                                btnRol.disable();
                                storeGrid.reload();
                                confirmarModDominio = false;
                            }
                            else {
                                Secodena.ocultarMascara('maskUsuarioMod');
                                mostrarMensaje(action.result.codMsg, action.result.mensaje, focusADD());
                                confirmarModDominio = false;
                            }
                        }
                    });
                }
                else {
                    Secodena.ocultarMascara('maskUsuarioMod');
                    confirmarModDominio = false;
                }
            }
            else
                mostrarMensaje(3, etiquetas.lbTitMsgContrasenaIncorrecta, focusADD());
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusADD());
    }

    //Funcion activar usuarios
    function activarUsuarios() {
        var arrUsuariosActivar = sm.getSelections();
        var arrUsuarioAct = [];
        for (var i = 0; i < arrUsuariosActivar.length; i++) {
            if (arrUsuariosActivar[i].data.activo == true) {
                mostrarMensaje(3, etiquetas.lbMsgYaActivados, focusADD());
                arrUsuarioAct = [];
                return;
            }
            else
                arrUsuarioAct.push(arrUsuariosActivar[i].data.idusuario);
        }
        Secodena.mostrarMascara('maskActivar', etiquetas.msgWait, etiquetas.msgActivar);
        Ext.Ajax.request({
            url: 'ActivarUsuario',
            method: 'POST',
            params: {
                arrUsuarioAct: Ext.encode(arrUsuarioAct)
            },
            callback: function(options, success, response) {
                Secodena.ocultarMascara('maskActivar');
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg != 3) {
                    mostrarMensaje(1, etiquetas.lbMsgActivados);
                    storeGrid.load({
                        params: {
                            start: 0,
                            limit: 15
                        }
                    });
                } else
                    Secodena.ocultarMascara('maskActivar');
            }
        });
    }

    //Funcion desactivar usuarios
    function desactivarUsuarios() {
        var arrUsuariosDesctivar = sm.getSelections();
        var arrUsuarioDesact = [];
        for (var i = 0; i < arrUsuariosDesctivar.length; i++) {
            if (arrUsuariosDesctivar[i].data.activo == false) {
                mostrarMensaje(3, etiquetas.lbMsgNoActivados, focusADD());
                arrUsuarioDesact = [];
                return;
            }
            else
                arrUsuarioDesact.push(arrUsuariosDesctivar[i].data.idusuario);
        }
        Secodena.mostrarMascara('maskDesactivar', etiquetas.msgWait, etiquetas.msgDesactivar);
        Ext.Ajax.request({
            url: 'DesactivarUsuario',
            method: 'POST',
            params: {
                arrUsuarioDesact: Ext.encode(arrUsuarioDesact)
            },
            callback: function(options, success, response) {
                Secodena.ocultarMascara('maskDesactivar');
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg != 3) {
                    mostrarMensaje(1, etiquetas.lbMsgDesactivados, focusADD());
                    storeGrid.load({
                        params: {
                            start: 0,
                            limit: 15
                        }
                    });
                } else
                    Secodena.ocultarMascara('maskDesactivar');
            }
        });
    }

    //Funcion eliminar
    function eliminarusuario() {
        var arrUsuariosElim = sm.getSelections();
        var arrUsuarioElim = [];
        for (var i = 0; i < arrUsuariosElim.length; i++) {
            arrUsuarioElim.push(arrUsuariosElim[i].data.idusuario);
        }
        mostrarMensaje(2, etiquetas.confirmacionMsg, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Secodena.mostrarMascara('maskUsuarioDel', etiquetas.msgWait, etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'eliminarusuario',
                    method: 'POST',
                    params: {
                        ArrayUserDel: Ext.encode(arrUsuarioElim)
                    },
                    callback: function(options, success, response) {
                        Secodena.ocultarMascara('maskUsuarioDel');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje, focusADD());
                            storeGrid.reload();
                            sm.clearSelections();
                            btnEliminar.disable();
                            btnModificar.disable();
                            btnAdicionar.enable();
                            btnRol.disable();
                        }
                    }
                });
            }
        }
    }

    //Función usada para adicionar un usuario.
    function adicionarusuario(apl) {
        if (Ext.getCmp('ip').getValue()) {
            if (!validaRango()) {
                mostrarMensaje(3, etiquetas.lbTitMsgRangoIncorrecto, focusADD());
                return;
            }
        }
        if (Ext.getCmp('iddom').getValue() == 0) {
            mostrarMensaje(3, etiquetas.lbTitMsgDominioIncorrecto, focusADD());
            return;
        }
        if (regUsuario.getForm().isValid()) {
            Secodena.mostrarMascara('maskAddUsuario', etiquetas.msgWait, etiquetas.msgAdd);
            if (estado)
                enviarFormulario(apl);
            else {
                if (Ext.getCmp('contrasenna').getValue() != 0 && Ext.getCmp('contrasena').getValue() != 0) {
                    if (Ext.getCmp('contrasenna').getValue() == Ext.getCmp('contrasena').getValue()) {
                        var pass1=encryptRSA(Ext.getCmp('contrasenna').getValue());
                        var pass2=encryptRSA(Ext.getCmp('contrasena').getValue());                        
                        enviarFormulario(apl,pass1,pass2);                        
                    } else {
                        Ext.getCmp('contrasenna').reset();
                        Ext.getCmp('contrasena').reset();
                        Secodena.ocultarMascara('maskAddUsuario');
                        mostrarMensaje(3, etiquetas.lbTitMsgContrasenaIncorrecta, focusADD());
                    }
                }
                else {
                    Secodena.ocultarMascara('maskAddUsuario');
                    mostrarMensaje(3, etiquetas.lbTitMsgEnblanco, focusADD());
                }
            }
        }
        else
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusADD());
    }

    function enviarFormulario(apl) {
        regUsuario.getForm().submit({
            url: 'insertarusuario',
            params: {
                estado: estado                
            },
            failure: function(form, action) {
                Secodena.ocultarMascara('maskAddUsuario');
                if (action.result.codMsg != 3 && action.result.codMsg != 4) {
                    mostrarMensaje(action.result.codMsg, action.result.mensaje, focusADD());
                    regUsuario.getForm().reset();
                    if (!apl)
                        winIns.hide();
                    btnModificar.disable();
                    btnEliminar.disable();
                    btnAdicionar.enable();
                    btnRol.disable();
                    storeGrid.reload();
                }
                if (action.result.codMsg == 3 || action.result.codMsg == 4) {
                    Ext.getCmp('contrasenna').reset();
                    Ext.getCmp('contrasena').reset();
                    mostrarMensaje(action.result.codMsg, action.result.mensaje, focusADD());
                }

            }
        });
    }
    function enviarFormulario(apl,pass1,pass2) {
        regUsuario.getForm().submit({
            url: 'insertarusuario',
            params: {
                estado: estado,
                passw: pass1,
                passw1: pass2
            },
            failure: function(form, action) {
                Secodena.ocultarMascara('maskAddUsuario');
                if (action.result.codMsg != 3 && action.result.codMsg != 4) {
                    mostrarMensaje(action.result.codMsg, action.result.mensaje, focusADD());
                    regUsuario.getForm().reset();
                    defaultValueForm();
                    if (!apl)
                        winIns.hide();
                    btnModificar.disable();
                    btnEliminar.disable();
                    btnAdicionar.enable();
                    btnRol.disable();
                    storeGrid.reload();
                }
                if (action.result.codMsg == 3 || action.result.codMsg == 4) {
                    Ext.getCmp('contrasenna').reset();
                    Ext.getCmp('contrasena').reset();
                    mostrarMensaje(action.result.codMsg, action.result.mensaje, focusADD());
                }

            }
        });
    }

    ////---------- Asignar Roles al usuario ----------////
    function asignarRol(apl, record) {
        if (!idrol)
            return;
        var arrayNodos = arbolEntidades.getChecked();
        var arrayEnt = new Array();
        var arrayPadres = new Array();
        var arrUsuarios = sm.getSelections();
        var arrUsuario = [];
        for (var i = 0; i < arrUsuarios.length; i++) {
            var user = [];
            user.push(arrUsuarios[i].data.idusuario);
            user.push(arrUsuarios[i].data.iddominio);
            arrUsuario.push(user);
        }
        buscarNodosTiene(arbolEntidades.getRootNode());
        if (arrayNodos.length > 0) {
            for (var i = 0; i < arrayNodos.length; i++) {
                arrayEnt.push(arrayNodos[i].attributes.id);
                if (!arrayNodos[i].isLeaf() && arrayNodos[i].childNodes.length == 0) {
                    arrayPadres.push(arrayNodos[i].attributes.id);
                }
            }
        }
        Ext.getBody().mask(etiquetas.waitMsg);
        Ext.Ajax.request({
            url: 'asignarroles',
            timeout: '180000',
            method: 'POST',
            params: {
                opcion: apl,
                arrayEntidades: Ext.encode(arrayEnt),
                arrayEntidadesEliminar: Ext.encode(arregloDeschequeados),
                arrayPadres: Ext.encode(arrayPadres),
                arrayPadresEliminar: Ext.encode(arrayPadresEliminar),
                arrayTiene: Ext.encode(arrayTiene),
                arrayUsuario: Ext.encode(arrUsuario),
                idrol: idrol
            },
            callback: function(options, success, response) {
                Ext.getBody().unmask();
                arrayPadresEliminar = [];
                arregloDeschequeados = [];
                arrayTiene = [];
                responseData = Ext.decode(response.responseText);
                if (responseData.bien == 1) {
                    if (apl) {
                        mostrarMensaje(1, etiquetas.operacionMsg, focusADD());
                        winRol.hide();
                        btnModificar.disable();
                        btnEliminar.disable();
                        btnAdicionar.enable();
                        btnDesactivar.disable();
                        btnVerPerfil.disable();
                        btnAsignarPerfil.disable();
                        btnRol.disable();
                        arbolEntidades.disable();
                        sm.clearSelections();
                        smrol.clearSelections();
                        bandera_rol_entidad = false;
                    } else {
                        record.data.estado = 1;
                        arbolEntidades.getRootNode().reload();
                    }
                    return true;
                }
                else if (responseData.bien == 2) {
                    mostrarMensaje(3, etiquetas.rolAsociadoMsg, focusADD());
                    return false;
                }
                else if (responseData.bien == 3) {
                    if (apl) {
                        if (!bandera_rol_entidad) {
                            mostrarMensaje(3, etiquetas.MsgEntidadRolApl, focusADD());
                        } else {
                            mostrarMensaje(1, etiquetas.operacionMsg, focusADD());
                            winRol.hide();
                            btnModificar.disable();
                            btnEliminar.disable();
                            btnAdicionar.enable();
                            btnDesactivar.disable();
                            btnVerPerfil.disable();
                            btnAsignarPerfil.disable();
                            btnRol.disable();
                            arbolEntidades.disable();
                            sm.clearSelections();
                            smrol.clearSelections();
                            bandera_rol_entidad = false;
                        }
                    }  
                    via=true;
                    storeGridRol.reload({
                        params: {
                            start: 0,
                            limit: 15
                        }
                    });

                    return true;
                }
                if (responseData.codMsg == 3)
                    mostrarMensaje(responseData.codMsg, responseData.mensaje, focusADD());
            }
        });
    }

    ////----------------------------------- Cambiar Password --------------------------------////
    function cambiarpass() {
        if (fpPass.getForm().isValid()) {
            Secodena.mostrarMascara('maskCambiarPass', etiquetas.msgWait, etiquetas.msgPassword);
            if (Ext.getCmp('contrasennap').getValue() != 0 && Ext.getCmp('contrasenap').getValue() != 0) {
                if (Ext.getCmp('contrasennap').getValue() == Ext.getCmp('contrasenap').getValue()) {
                    Ext.getCmp('contrasenap').setValue(encryptRSA(Ext.getCmp('contrasenap').getValue()));
                    Ext.getCmp('contrasennap').setValue(encryptRSA(Ext.getCmp('contrasennap').getValue()));

                    fpPass.getForm().submit({
                        url: 'cambiarpassword',
                        params: {
                            idusuario: sm.getSelected().data.idusuario
                        },
                        failure: function(form, action) {
                            Secodena.ocultarMascara('maskCambiarPass');
                            if (action.result.codMsg != 3 && action.result.codMsg != 4) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje, focusADD());
                                Ext.getCmp('contrasennap').reset();
                                Ext.getCmp('contrasenap').reset();
                                winPass.hide();
                            }
                            if (action.result.codMsg == 3 || action.result.codMsg == 4) {
                                Ext.getCmp('contrasennap').reset();
                                Ext.getCmp('contrasenap').reset();
                                mostrarMensaje(action.result.codMsg, action.result.mensaje, focusADD());
                            }
                        }
                    });
                }
                else {
                    Ext.getCmp('contrasennap').reset();
                    Ext.getCmp('contrasenap').reset();
                    Secodena.ocultarMascara('maskCambiarPass');
                    mostrarMensaje(3, etiquetas.lbTitMsgContrasenaIncorrecta, focusADD());
                }
            }
        }
        else
            mostrarMensaje(3, etiquetas.lbTitMsgEnblanco, focusADD());
    }

    function buscarnombreusuario(nombreusuario, dominiobuscar, activar) {
        if (Ext.getCmp('usuario').validate() == true) {
            storeGrid.baseParams = {};
            storeGrid.baseParams.nombreusuario = nombreusuario;
            storeGrid.baseParams.dominiobuscar = dominiobuscar;
            storeGrid.baseParams.activar = activar;
            storeGrid.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
        }
        else {
            mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops, focusADD());
        }

    }

    function clearFilters() {
        nombreusuario.reset();
        //console.log("Primero",dominiobuscar.getS);
        dominiobuscar.reset();
        dominiobuscar.clearValue();
        //console.log("Segundo",dominiobuscar.getValue());
        activar.reset();
        storeGrid.baseParams = {};
        storeGrid.load({
            params: {
                start: 0,
                limit: 15
            }
        });
        focusADD();
    }

    function buscardenrol(denrolbuscado) {
        storeGridRol.load({
            params: {
                rolbuscado: denrolbuscado,
                start: 0,
                limit: 15
            }
        });
    }

    function limpiarFiltro() {
        Ext.getCmp('denrolbuscado').reset();
        storeGridRol.load({
            params: {
                start: 0,
                limit: 15
            }
        });
    }

    function adicionarPerfil(idpersona, winBusPer) {
        Secodena.mostrarMascara('maskPerfil', etiquetas.msgWait, etiquetas.msgPerfil);
        Ext.Ajax.request({
            url: 'guardarPerfil',
            method: 'POST',
            params: {
                idusuario: sm.getSelected().data.idusuario,
                idpersona: idpersona
            },
            callback: function(options, success, response) {
                Secodena.ocultarMascara('maskPerfil');
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    mostrarMensaje(responseData.codMsg, responseData.mensaje, focusADD);
                    winBusPer.close();
                    storeGrid.reload();
                }
            }
        });
    }

    function encryptRSA(text) {
        var key = RSA.getPublicKey(document.getElementById('publicKey').value);
        return RSA.encrypt(text, key);
    }

    function cargarAyuda() {
        var title = 'Ayuda de usuario';
        var referencia = 'seguridad/gestusuario';
        help.show(title, referencia);
    }
}

////------------ Funcion para validar rango de ip ------------////
function validaRango() {
    var i;
    var rango = Ext.getCmp('ip').getValue();
    var ips = rango.split(',');
    var bandera = true;
    for (i = 0; i < ips.length; i++) {
        if (!compruebaRango(ips[i])) {
            bandera = false;
            break;
        }
    }
    if (bandera)
        return true;
    else
        return false;
}

function compruebaRango(valor) {
    var ipmascara = valor.split('/');
    var ipreal = ipmascara[0];
    var ippos = ipreal.split('.');
    if ((ipmascara[1])) {
        if (ipmascara[1] == 0) {
            if (ippos[0] == 0) {
                if (ippos[0] == 0 && ippos[1] == 0 && ippos[2] == 0 && ippos[3] == 0)
                    return true;
                else
                    return false;
            } else {
                if ((ippos[0] >= 1 && ippos[0] <= 255) && (ippos[1] >= 0 && ippos[0] <= 255) && (ippos[2] >= 0 && ippos[2] <= 255) && (ippos[3] >= 0 && ippos[3] <= 255))
                    return true;
                else
                    return false;
            }
        } else {
            if (ipmascara[1] >= 1 && ipmascara[1] <= 32) {
                if ((ippos[0] >= 1 && ippos[0] <= 255) && (ippos[1] >= 0 && ippos[0] <= 255) && (ippos[2] >= 0 && ippos[2] <= 255) && (ippos[3] >= 0 && ippos[3] <= 255))
                    return true;
                else
                    return false;
            } else
                return false;
        }
    } else {
        if (ippos[0] == 0) {
            if (ippos[0] == 0 && ippos[1] == 0 && ippos[2] == 0 && ippos[3] == 0)
                return true;
            else
                return false;
        } else {
            if ((ippos[0] >= 1 && ippos[0] <= 255) && (ippos[1] >= 0 && ippos[0] <= 255) && (ippos[2] >= 0 && ippos[2] <= 255) && (ippos[3] >= 0 && ippos[3] <= 255))
                return true;
            else
                return false;
        }
    }
    return false;
}

function estaEnDeschequeados(arreglonodos, idnodo) {
    var cantidad = arreglonodos.length;
    for (p = 0; p < cantidad; p++) {
        if (arreglonodos[p] == idnodo)
            return p;
    }
    return -1;
}

function eliminarEnDeschequeados(arreglo, pos) {
    arreglo.splice(pos, 1);
}

function adicionarEnDeschequeados(arreglo, id) {
    if (estaEnDeschequeados(arreglo, id) == -1)
        arreglo.push(id);
}

function buscarNodosTiene(nodo) {
    nodo.eachChild(function(anodehijo) {
        if (!anodehijo.attributes.checked && !anodehijo.isLeaf() && anodehijo.attributes.tiene && anodehijo.childNodes.length == 0)
            arrayTiene.push(anodehijo.attributes.id);
        if (anodehijo.childNodes.length > 0)
            buscarNodosTiene(anodehijo);

    }, this);
}

function marcarHijos(nodo, check) {
    nodo.eachChild(function(anodehijo) {
        if (anodehijo.attributes.checked != check)
            cambiarEstadoCheck(anodehijo, check);
        if (anodehijo.childNodes.length > 0)
            marcarHijos(anodehijo, check);
    }, this);
}

////------------ Auxiliar para marcar y desmarcar nodos ------------////
function cambiarEstadoCheck(anodehijo, check) {
    if (anodehijo.attributes.checked != check) {
        anodehijo.getUI().toggleCheck(check);
    }
}
