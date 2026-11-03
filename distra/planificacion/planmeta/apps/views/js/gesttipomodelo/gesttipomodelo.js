var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('gesttipomodelo', cargarInterfaz);
var btnAdicionar, btnModificar, btnEliminar, btnAyuda, btnAprobar, btnDesaprobar;
var stGpGestTipoModelo, smGpGestTipoModelo, gpTipoModelo, vpTipoModelo;
var fpTipoModelo, fpTipoModeloMod, winMod, winAdd, winAddCampos, panelGeneral, mensaje;
var winGestEncabesado, adicionando, contaprobar = 0, conteliminar = 0, contdesaprobar = 0;
var contadorNoEliminar = 0;
var accion_tipomod;
var field = 'codigo', direction = 'ASC';
var controlaraccion = 0;
var eliminando = false;
var offsetgpAtributos = 0;
var singleSmGpGestAt = null;

function cargarInterfaz() {
    btnAdicionar = new Ext.Button({
        handler: function () {
            controlaraccion = 1;
            winFp('Add');
        },
        tooltip: perfil.etiquetas.lbTtbtnAdd,
        disabled: false,
        id: 'btnAdd',
        iconCls: 'adicionar'
    });
    btnModificar = new Ext.Button({
        handler: function () {
            controlaraccion = 2;
            accion_tipomod = 'mod';
            validar();
        },
        tooltip: perfil.etiquetas.lbTtbtnMod,
        disabled: true,
        id: 'btnMod',
        iconCls: 'modificar'
    });
    btnEliminar = new Ext.Button({
        handler: function () {
            eliminando = true;
            eliminarTipoModelo();
        },
        tooltip: perfil.etiquetas.lbTtbtnDel,
        disabled: true,
        id: 'btnEli',
        iconCls: 'eliminar'
    });
    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
        id: 'btnAyudaTipoModelo',
        iconCls: 'ayuda'
    });
    btnAprobar = new Ext.Button({
        handler: function () {
            controlaraccion = 1;
            Aprobar(3);
        },
        tooltip: perfil.etiquetas.lbTtBtnAprobar,
        id: 'btnApro',
        iconCls: 'aprobar'
    });
    btnDesaprobar = new Ext.Button({
        handler: function () {
            controlaraccion = 2;
            Aprobar(1);
        },
        tooltip: perfil.etiquetas.lbTtBtnDesaprobar,
        id: 'btnDesap',
        iconCls: 'desaprobar'
    });


    btnAddAtributos = new Ext.Button({
        handler: function () {
            if (winAddCampos == undefined) {
                importarJS('../../views/js/gesttipomodelo/gestattrtipomodelo.js');
            } else {
                winFpCampos('Add');
            }
        },
        tooltip: perfil.etiquetas.lbTtbtnAddAttrib,
        id: 'btnAddAtributos',
        iconCls: 'adicionar'
    });
    btnDelAtributos = new Ext.Button({
        handler: function () {
            eliminarAtributos();
        },
        tooltip: perfil.etiquetas.lbTtbtnDelAttrib,
        disabled: true,
        id: 'btnEliRel',
        iconCls: 'eliminar'
    });
    btnAplicar = new Ext.Button({
        handler: function () {
            eliminarAtributos();
        },
        text: perfil.etiquetas.lbBtnAplicar,
        tooltip: perfil.etiquetas.lbTtbtnApl,
        disabled: true,
        id: 'btnApl',
        iconCls: 'aplicar'
    });
    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrostipomodelo.clearFilters();
        }
    });

    stnegocio = new Ext.data.Store({
        url: 'listarComboNegocio',
        reader: new Ext.data.JsonReader({
            id: 'idmodelosmetadatos',
            root: 'data'
        },
                [{
                        name: 'idmodelosmetadatos'
                    }, {
                        name: 'denominacion'
                    }
                ]),
        listeners: {
            load: function (t, n, e) {
                cbnegocio.setValue(stnegocio.getRange(0, 0)[0].id);
            }
        }
    });
    stnegocio.reload();
    cbnegocio = new Ext.form.ComboBox({
        fieldLabel: perfil.etiquetas.lbNegocio,
        emptyText: perfil.etiquetas.lbSeleccione,
        id: 'cbnegocio',
        prevTab: 'denominacion',
        nextTab: 'descripcion',
        anchor: '95%',
        tabIndex: 20,
        displayField: 'denominacion',
        valueField: 'idmodelosmetadatos',
        hiddenName: 'idmodelosmetadatos',
        allowBlank: false,
        store: stnegocio,
        mode: 'local',
        typeAhead: true,
        forceSelection: true,
        triggerAction: 'all',
        //selectOnFocus:true,
        listeners: {
            expand: function (combo) {
                // stnegocio.reload();
            }
        }
    });

    // formulario fpTipoModelo
    fpTipoModelo = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        listeners: {
            'clientvalidation': function (fm, valid) {
                /* if (!Ext.getCmp('idaceptar').disabled) {
                 Ext.getCmp('codigo').prevTab = 'idaceptar';
                 } else {
                 Ext.getCmp('codigo').prevTab = 'idcancel';
                 }*/
            }
        },
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .3,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbCodigo,
                                id: 'codigo',
                                minLength: 3,
                                maxLength: 19,
                                regex: /^([0-9]+ ?[0-9]*)+$/,
                                regexText: perfil.etiquetas.lbMsgSoloNum,
                                anchor: '95%',
                                allowBlank: false,
                                prevTab: 'idcancel'
                            }, {
                                xtype: 'hidden',
                                id: 'idtipomodelo'
                            }, {
                                xtype: 'hidden',
                                id: 'idtipomodelocolumna'
                            }]
                    }, {
                        columnWidth: .7,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbDenominacion,
                                id: 'denominacion',
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
                                maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
                                regexText: perfil.etiquetas.lbMsgSoloALfa,
                                anchor: '100%',
                                maxLength: 100,
                                maxLengthText: perfil.etiquetas.lbmaxLengthText100,
                                allowBlank: false
                            }]
                    }, {
                        columnWidth: .7,
                        layout: 'form',
                        items: [cbnegocio]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                id: 'descripcion',
                                anchor: '100%',
                                maxLength: 255,
                                maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
                                regexText: perfil.etiquetas.lbMsgSoloALfaguion,
                                maxLengthText: perfil.etiquetas.lbmaxLengthText255,
                                fieldLabel: perfil.etiquetas.lbDescripcion,
                                editable: false,
                                allowBlank: true
                            }]
                    }]
            }]
    });

    // formulario fpTipoModeloMod
    fpTipoModeloMod = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        listeners: {
            'clientvalidation': function (fm, valid) {
                if (fm.getForm().isValid() && (Ext.getCmp('denominacionmod').getValue() != valordenominacion
                        || Ext.getCmp('descripcionmod').getValue() != valordescripcion)) {
                    Ext.getCmp('idaceptarmodModelo').enable();
                } else {
                    Ext.getCmp('idaceptarmodModelo').disable();
                }
                if (!Ext.getCmp('idaceptarmodModelo').disabled) {
                    Ext.getCmp('denominacionmod').prevTab = 'idaceptarmodModelo';
                } else {
                    Ext.getCmp('denominacionmod').prevTab = 'idcancelarmodModelo';
                }
            }
        },
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .3,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbCodigo,
                                id: 'codigomod',
                                minLength: 3,
                                maxLength: 19,
                                regex: /^([0-9]+ ?[0-9]*)+$/,
                                regexText: perfil.etiquetas.lbMsgSoloNum,
                                anchor: '95%',
                                allowBlank: false
                            }, {
                                xtype: 'hidden',
                                id: 'idtipomodelo'
                            }, {
                                xtype: 'hidden',
                                id: 'idtipomodelocolumna'
                            }]
                    }, {
                        columnWidth: .7,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbDenominacion,
                                id: 'denominacionmod',
                                prevTab: 'idcancelarmodModelo',
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
                                maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
                                regexText: perfil.etiquetas.lbMsgSoloALfa,
                                anchor: '100%',
                                maxLength: 100,
                                maxLengthText: perfil.etiquetas.lbmaxLengthText100,
                                allowBlank: false
                            }]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                id: 'descripcionmod',
                                anchor: '100%',
                                maxLength: 255,
                                maxLengthText: perfil.etiquetas.lbmaxLengthText255,
                                fieldLabel: perfil.etiquetas.lbDescripcion,
                                editable: false,
                                allowBlank: true
                            }]
                    }]
            }]
    });

    // Store grid stGpGestTipoModelo
    stGpGestTipoModelo = new Ext.data.Store({
        url: 'listarTiposModelo',
        listeners: {
            beforeload: function () {
                stGpGestTipoModelo.removeAll();
                stGpGestTipoModelo.baseParams.field = field;
                stGpGestTipoModelo.baseParams.direction = direction;
                cambiarTituloFiltrar(gpTipoModelo, filtrostipomodelo, perfil.etiquetas.lbSinFiltradoTitle);
            },
            load: function () {
                //smGpGestTipoModelo.selectFirstRow();
                siexisteTmodeloFiltrado();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idtipomodelo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idtabla'
            }, {
                name: 'codigo'
            }, {
                name: 'descripcion'
            }, {
                name: 'uso'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'negocio'
            }, {
                name: 'idmodelosmetadatos'
            }]
                )
    });

    // Selection Model grid smGpGestTipoModelo
    smGpGestTipoModelo = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                valordenominacion = gpTipoModelo.getSelectionModel().getSelected().data.denominacion;
                valornegocio = gpTipoModelo.getSelectionModel().getSelected().data.negocio;
                valordescripcion = gpTipoModelo.getSelectionModel().getSelected().data.descripcion;
                contadorNoEliminar = 0;
                if (gpTipoModelo.getSelectionModel().getSelections().length == 0) {
                    btnModificar.disable();
                    btnAprobar.disable();
                    btnDesaprobar.disable();
                    gpAtributos.disable();
                } else {
                    gpAtributos.enable();
                    if (gpTipoModelo.getSelectionModel().getSelections().length == 1) {
                        if (gpTipoModelo.getSelectionModel().getSelected().data.uso == '1' || gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion == '3'/*|| gpTipoModelo.getSelectionModel().getSelected().data.estado == '1'*/) {
                            btnModificar.disable();
                            btnEliminar.disable();
                        } else if (gpTipoModelo.getSelectionModel().getSelected().data.uso != '1' && gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion != '3'/*|| gpTipoModelo.getSelectionModel().getSelected().data.estado != '1'*/) {
                            btnModificar.enable();
                            btnEliminar.enable();
                        }
                        if (gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion != '3') {
                            btnAprobar.enable();
                            btnDesaprobar.disable();
                        } else if (gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion == '3') {
                            btnAprobar.disable();
                            btnDesaprobar.enable()
                        }

                    } else {
                        var seleccionesTiposModelo = gpTipoModelo.getSelectionModel().getSelections();
                        for (var i = 0; i < seleccionesTiposModelo.length; i++) {
                            if (seleccionesTiposModelo[i].data.idaprobacion == '3') {
                                contaprobar = contaprobar + 1;
                            }
                            if (seleccionesTiposModelo[i].data.idaprobacion != '3') {
                                contdesaprobar = contdesaprobar + 1;
                            }
                            if (seleccionesTiposModelo[i].data.uso == 1) {
                                contadorNoEliminar++;
                            }
                        }

                        if (contadorNoEliminar > 0) {
                            btnEliminar.disable();
                        } else {
                            btnEliminar.enable();
                        }
                        if (contaprobar != gpTipoModelo.getSelectionModel().getSelections().length) {
                            btnAprobar.enable();
                        } else {
                            btnAprobar.disable();
                        }
                        contaprobar = 0;
                        if (contdesaprobar != gpTipoModelo.getSelectionModel().getSelections().length) {
                            btnDesaprobar.enable();
                        } else {
                            btnDesaprobar.disable();
                        }
                        contdesaprobar = 0;
                        btnDesaprobar.disable();
                        btnAprobar.disable();
                    }
                }
            },
            rowdeselect: function () {
                contadorNoEliminar = 0;
                if (gpTipoModelo.getSelectionModel().getSelections().length == 0) {
                    btnModificar.disable();
                    btnAprobar.disable();
                    btnDesaprobar.disable();
                    gpAtributos.disable();
                } else {
                    gpAtributos.enable();
                    if (gpTipoModelo.getSelectionModel().getSelections().length == 1) {
                        if (gpTipoModelo.getSelectionModel().getSelected().data.uso == '1' || gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion == '3') {
                            btnModificar.disable();
                            btnEliminar.disable();
                        } else if (gpTipoModelo.getSelectionModel().getSelected().data.uso != '1' && gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion != '3') {
                            btnModificar.enable();
                            btnEliminar.enable();
                        }
                        if (gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion != '3') {
                            btnAprobar.enable();
                            btnDesaprobar.disable();
                        } else if (gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion == '3') {
                            btnAprobar.disable();
                            btnDesaprobar.enable()
                        }
                    } else {
                        for (var i = 0; i < gpTipoModelo.getSelectionModel().getSelections().length; i++) {


                            if (gpTipoModelo.getSelectionModel().getSelections()[i].data.idaprobacion == '3') {
                                contaprobar = contaprobar + 1;
                            }
                            if (gpTipoModelo.getSelectionModel().getSelections()[i].data.idaprobacion != '3') {
                                contdesaprobar = contdesaprobar + 1;
                            }
                            if (gpTipoModelo.getSelectionModel().getSelections()[i].data.uso == 1) {
                                contadorNoEliminar++;
                            }
                        }
                        if (contadorNoEliminar > 0) {
                            btnEliminar.disable();
                        } else {
                            btnEliminar.enable();
                        }

                        if (contaprobar != gpTipoModelo.getSelectionModel().getSelections().length) {
                            btnAprobar.enable();
                        } else {
                            btnAprobar.disable();
                        }
                        contaprobar = 0;
                        if (contdesaprobar != gpTipoModelo.getSelectionModel().getSelections().length) {
                            btnDesaprobar.enable();
                        } else {
                            btnDesaprobar.disable();
                        }
                        contdesaprobar = 0;
                    }
                }
            },
            beforerowselect: function (sm, y, z, w) {
                if (w.get('idaprobacion') != '3') {
                    btnAprobar.enable();
                    btnDesaprobar.disable();
                } else if (w.get('idaprobacion') == '3') {
                    btnAprobar.disable();
                    btnDesaprobar.enable();
                }

            }
        }
    });

    // Filtros para cada columna de tipo de modelo
    filtrostipomodelo = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'boolean',
                dataIndex: 'uso'
            }, {
                type: 'boolean',
                dataIndex: 'idaprobacion'
            }, {
                type: 'listado',
                dataIndex: 'negocio',
                idcombo: 'idmodelosmetadatos',
                valueFieldcb: 'idmodelosmetadatos',
                displayFieldcb: 'denominacion',
                st: stnegocio,
                autoload: false,
                mode: 'local'
            }
        ]
    });

    /*menuConfigAtributo = new Ext.menu.Menu({
     id: 'menuConfig',
     listeners: {
     },
     items: [{
     text: 'Eliminar',
     iconCls: 'eliminar',
     id: 'mdEliminarAttrib',
     tooltip: 'Eliminar tipo(s) modelo',
     handler: function () {
     
     }
     }
     ]
     });*/

    // Grid gestion gpTipoModelo
    gpTipoModelo = new Ext.grid.GridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        region: 'center',
        title: perfil.etiquetas.lbSinFiltradoTitle,
        listeners: {
            /*rowcontextmenu: function (g, r, e) {
             e.stopEvent();
             gpTipoModelo.getSelectionModel().selectRow(r);
             g.getSelectionModel().selectRow(r);
             g.md.showAt(e.getXY());
             },*/
            sortchange: function (t, inf) {
                field = inf.field;
                direction = inf.direction;
                stGpGestTipoModelo.reload();
            },
            celldblclick: function () {
                if (winAdd == undefined || !winAdd.isVisible()) {
                    if (!btnModificar.disabled && !btnModificar.hidden && !eliminando) {
                        controlaraccion = 2;
                        accion_tipomod = 'mod';
                        validar()
                    }
                }
            }
        },
        store: stGpGestTipoModelo,
        sm: smGpGestTipoModelo,
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idtabla'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idtipomodelo'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idtipomodelocolumna'
            }, {
                header: perfil.etiquetas.lbCodigo,
                width: 100,
                sortable: true,
                dataIndex: 'codigo',
                tooltip: perfil.etiquetas.lbCodigo,
                renderer: crearToolTip
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                width: 270,
                header: perfil.etiquetas.lbDescripcion,
                tooltip: perfil.etiquetas.lbDescripcion,
                sortable: true,
                dataIndex: 'descripcion',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbNegocio,
                tooltip: perfil.etiquetas.lbNegocio,
                width: 150,
                sortable: true,
                dataIndex: 'negocio',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbAprobado,
                tooltip: perfil.etiquetas.lbAprobado,
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'idaprobacion',
                renderer: aprobado
            }, {
                header: perfil.etiquetas.lbEnUso,
                tooltip: perfil.etiquetas.lbEnUso,
                width: 60,
                align: 'center',
                sortable: true,
                dataIndex: 'uso',
                renderer: modificarEstado
            }],
        //md: menuConfigAtributo,
        loadMask: {
            store: stGpGestTipoModelo
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 8,
            store: stGpGestTipoModelo,
            displayInfo: true,
            items: [btnLimpiar]
        }),
        plugins: filtrostipomodelo
    });

    function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
        var filtrado_por = "";
        var sep = "/";
        if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
            gridPanel.setTitle(etiqueta);
        } else {
            for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
                var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
                if (i == filtro.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
            }
            gridPanel.setTitle(etiqueta + ' - <i>' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
            filtrado_por = "";
        }
    }

    function validar() {
        var tpm = gpTipoModelo.getSelectionModel().getSelections();
        var arr = new Array();
        for (var i = 0; i < tpm.length; i++) {
            arr.push(tpm[i].id);
        }
        Ext.Ajax.request({
            url: 'validarOperaciones',
            params: {
                tiposmodelos: Ext.encode(arr),
                operacion: accion_tipomod
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgA == 22) {
                    switch (accion_tipomod) {
                        case 'mod':
                            {
                                winFp('Mod');
                            }
                            break;
                    }
                } else if (responseData.codMsgA == 21)
                    mostrarMensaje(1, perfil.etiquetas.msgErrorTipoModeloEnUso);
                else if (responseData.codMsgA == 23)
                    mostrarMensaje(1, perfil.etiquetas.msgErrorTipoModeloAprobado);
                else
                    (mostrarMensaje(3, perfil.etiquetas.msgErrorAction));
            }
        });
    }

    function modificarEstado(val, metaData) {
        if (val == 1) {
            metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
            metaData.css = 'icondistra-true verde';
        } else {
            metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
            metaData.css = 'icondistra-false rojo';
        }
    }

    function aprobado(val, metaData) {
        if (val == 3) {
            metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
            metaData.css = 'icondistra-true verde';
        } else {
            metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
            metaData.css = 'icondistra-false rojo';
        }
    }

    // Store grid stGpGestAtributos
    stGpGestAtributos = new Ext.data.Store({
        url: 'listarColumnasTipoModelo',
        listeners: {
            'load': function (st, recordArray, opt) {
                if (st.getCount() > 0) {
                    smGpGestAtributos.selectFirstRow();
                    if (smGpGestTipoModelo.getSelected()) {
                        if (gpTipoModelo.getSelectionModel().getSelected().data.uso == 0) {
                            btnDelAtributos.enable();
                            btnAddAtributos.enable();
                        } else {
                            btnDelAtributos.disable();
                            btnAddAtributos.disable();
                        }
                        if (gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion == 3) {
                            btnDelAtributos.disable();
                            btnAddAtributos.disable();
                        }
                    }
                }
            },
            'beforeload': function (st, opt) {
                stGpGestAtributos.removeAll();
                btnDelAtributos.disable();
                this.baseParams.start = offsetgpAtributos;
                this.baseParams.idtipomodelo = singleSmGpGestAt;
                if (gpTipoModelo.getSelectionModel().getSelected().data.uso == 0)
                    btnAddAtributos.enable();
                else
                    btnAddAtributos.disable();
                if (gpTipoModelo.getSelectionModel().getSelected().data.idaprobacion == 3)
                    btnAddAtributos.disable();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idcampo"
        },
                [{
                        name: 'idcampo'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'etiqueta'
                    }, {
                        name: 'idtipodato'
                    }, {
                        name: 'denomtipodato'
                    }, {
                        name: 'idtipomodelocolumna'
                    }])
    });

    // Selection Model grid smGpGestAtributos
    smGpGestAtributos = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    /*menuTipoModelo = new Ext.menu.Menu({
     id: 'menuTipoModelo',
     listeners: {
     },
     items: [{
     text: 'Eliminar',
     iconCls: 'eliminar',
     id: 'mdEliminarColumn',
     tooltip: 'Eliminar columna del tipo de modelo',
     handler: function () {
     
     }
     }]
     });*/

    // Grid gestion gpAtributos
    gpAtributos = new Ext.grid.GridPanel({
        frame: true,
        title: perfil.etiquetas.lbTitGridAtributos,
        autoExpandColumn: 'expandir',
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        store: stGpGestAtributos,
        root_title: perfil.etiquetas.lbColumnas,
        region: 'south',
        height: 250,
        collapsible: true,
        collapsed: true,
        titleCollapse: true,
        split: true,
        disabled: true,
        sm: smGpGestAtributos,
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idcampo'
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                width: 100,
                dataIndex: 'etiqueta',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbTipoDato,
                tooltip: perfil.etiquetas.lbTipoDato,
                width: 120,
                dataIndex: 'denomtipodato',
                renderer: crearToolTip
            }],
        //md: menuTipoModelo,
        tbar: [btnAddAtributos, btnDelAtributos],
        bbar: new Ext.PagingToolbar({
            pageSize: 5,
            store: stGpGestAtributos,
            displayInfo: true,
            items: [],
            listeners: {
                beforechange: function (p, e) {
                    offsetgpAtributos = e.start;
                }
            }
        })/*,
         listeners: {
         rowcontextmenu: function (g, r, e) {
         e.stopEvent();
         g.getSelectionModel().selectRow(r);
         g.md.showAt(e.getXY());
         }
         }*/
    });

    panelGeneral = new Ext.Panel({
        frame: true,
        region: 'center',
        layout: 'border',
        id: 'panelGeneral',
        autoWidth: true,
        height: 50,
        items: [gpTipoModelo, gpAtributos],
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnAprobar, btnDesaprobar, '->', btnAyuda]
    });

    // viewport de la plantilla
    vpTipoModelo = new Ext.Viewport({
        layout: 'fit',
        id: 'idvpTipoModelo',
        items: [panelGeneral]
    });

    panelGeneral.focus(true, 500);

    // Evento Selection Model grid rowselect
    gpTipoModelo.getSelectionModel().on('rowselect', function (smodel, rowIndex, record) {
        gpAtributos.expand();
        singleSmGpGestAt = record.data.idtipomodelo;
        gpAtributos.getStore().reload({
            params: {
                idtipomodelo: record.data.idtipomodelo
            }
        });
    }, this);

    // Ventanas para formulario winFp(opcion)
    function winFp(opcion) {
        switch (opcion) {
            case 'Add':
                {
                    winAdd = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        constrain: true,
                        layout: 'fit',
                        title: perfil.etiquetas.lbTitWinAdd,
                        width: 350,
                        height: 240,
                        listeners: {
                            'beforeshow': function () {
                                Ext.getCmp('codigo').focus(true, 500);
                            }
                        },
                        buttons: [{
                                iconCls: 'cancelar',
                                id: 'idcancel',
                                text: perfil.etiquetas.lbBtnCancelar,
                                tooltip: perfil.etiquetas.lbTtBtnCancelarC,
                                handler: function () {
                                    winAdd.hide();
                                }
                            }, {
                                iconCls: 'aplicar',
                                id: 'idaplicar',
                                text: perfil.etiquetas.lbBtnAplicar,
                                tooltip: perfil.etiquetas.lbTtBtnAplicarC,
                                handler: function () {
                                    adicionarTipoModelo(true);
                                }
                            }, {
                                iconCls: 'aceptar',
                                id: 'idaceptar',
                                text: perfil.etiquetas.lbBtnAceptar,
                                tooltip: perfil.etiquetas.lbTTBtnAceptarC,
                                nextTab: 'codigo',
                                handler: function () {
                                    adicionarTipoModelo(false);
                                }
                            }
                        ]
                    });
                    fpTipoModelo.getForm().reset();
                    winAdd.show();
                    winAdd.add(fpTipoModelo);
                    Ext.getCmp('codigo').enable();
                    winAdd.doLayout();
                    Ext.getCmp('idtipomodelo').setValue('');
                }
                break;
            case 'Mod':
                {
                    btnAceptarModModelo = new Ext.Button({
                        iconCls: 'aceptar',
                        nextTab: 'denominacionmod',
                        disabled: true,
                        id: 'idaceptarmodModelo',
                        text: perfil.etiquetas.lbBtnAceptar,
                        tooltip: perfil.etiquetas.lbTTBtnAceptarC,
                        handler: function () {
                            adicionarTipoModelo(false);
                        }
                    });
                    btnCancelarModModelo = new Ext.Button({
                        iconCls: 'cancelar',
                        id: 'idcancelarmodModelo',
                        text: perfil.etiquetas.lbBtnCancelar,
                        tooltip: perfil.etiquetas.lbTtBtnCancelarC,
                        handler: function () {
                            winMod.hide();
                        }
                    });
                    winMod = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        constrain: true,
                        layout: 'fit',
                        title: perfil.etiquetas.lbTitWinMod,
                        width: 350,
                        height: 240,
                        autoValidate: false,
                        listeners: {
                            'beforeshow': function () {
                                Ext.getCmp('denominacionmod').focus(true, 500);
                            }
                        },
                        buttons: [btnCancelarModModelo, btnAceptarModModelo]
                    });
                    winMod.show();
                    winMod.add(fpTipoModeloMod);
                    Ext.getCmp('codigomod').disable();
                    winMod.doLayout();
                    Ext.getCmp('idtipomodelo').setValue(gpTipoModelo.getSelectionModel().getSelected().data.idtipomodelo);
                    Ext.getCmp('codigomod').setValue(gpTipoModelo.getSelectionModel().getSelected().data.codigo);
                    Ext.getCmp('denominacionmod').setValue(gpTipoModelo.getSelectionModel().getSelected().data.denominacion);
                    Ext.getCmp('descripcionmod').setValue(gpTipoModelo.getSelectionModel().getSelected().data.descripcion);
                }
                break;
        }
    }

    stGpGestTipoModelo.load({
        params: {
            start: 0,
            limit: 8
        }
    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ii',
            alt: true,
            fn: function () {
                if (winMod == undefined || !winMod.isVisible()) {
                    if (!btnAdicionar.disabled && !btnAdicionar.hidden && !eliminando) {
                        controlaraccion = 1;
                        winFp('Add');
                    }
                }
            }
        }, {
            key: 'Mm',
            alt: true,
            fn: function () {
                if (winAdd == undefined || !winAdd.isVisible()) {
                    if (!btnModificar.disabled && !btnModificar.hidden && !eliminando) {
                        controlaraccion = 2;
                        accion_tipomod = 'mod';
                        validar()
                    }
                }
            }
        }, {
            key: 46,
            fn: function () {
                if ((winAdd == undefined || !winAdd.isVisible()) && (winMod == undefined || !winMod.isVisible())) {
                    if (!btnEliminar.hidden && !btnEliminar.disabled) {
                        eliminando = true;
                        eliminarTipoModelo();
                    }
                }
            }
        }, {
            key: 'Qq',
            alt: true,
            fn: function () {
                if (winAdd == undefined && winMod == undefined) {
                    if (!btnAprobar.hidden) {
                        if (!btnAprobar.disabled) {
                            controlaraccion = 1;
                            Aprobar(3);
                        }
                    }
                } else if (winAdd != undefined) {
                    if (!btnAprobar.hidden && !winAdd.isVisible() && !winMod.isVisible()) {
                        if (!btnAprobar.disabled) {
                            controlaraccion = 1;
                            Aprobar(3);
                        }
                    }
                } else if (winMod != undefined) {
                    if (!btnAprobar.hidden && !winMod.isVisible()) {
                        if (!btnAprobar.disabled) {
                            controlaraccion = 1;
                            Aprobar(3);
                        }
                    }
                }
            }
        }, {
            key: 'Ww',
            alt: true,
            fn: function () {
                if (winAdd == undefined && winMod == undefined) {
                    if (!btnDesaprobar.hidden) {
                        if (!btnDesaprobar.disabled) {
                            controlaraccion = 2;
                            Aprobar(1);
                        }
                    }
                } else if (winAdd != undefined) {
                    if (!btnDesaprobar.hidden && !winAdd.isVisible() && !winMod.isVisible()) {
                        if (!btnDesaprobar.disabled) {
                            controlaraccion = 2;
                            Aprobar(1);
                        }
                    }
                } else if (winMod != undefined) {
                    if (!btnDesaprobar.hidden && !winMod.isVisible()) {
                        if (!btnDesaprobar.disabled) {
                            controlaraccion = 2;
                            Aprobar(1);
                        }
                    }
                }
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function () {
                if (winAdd == undefined && winMod == undefined) {
                    if (!btnLimpiar.hidden) {
                        if (!btnLimpiar.disabled) {
                            filtrostipomodelo.clearFilters();
                        }
                    }
                } else if (winAdd != undefined) {
                    if (!btnLimpiar.hidden && !winAdd.isVisible() && !winMod.isVisible()) {
                        if (!btnLimpiar.disabled) {
                            filtrostipomodelo.clearFilters();
                        }
                    }
                } else if (winMod != undefined) {
                    if (!btnLimpiar.hidden && !winMod.isVisible()) {
                        if (!btnLimpiar.disabled) {
                            filtrostipomodelo.clearFilters();
                        }
                    }
                }
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function () {
            }
        }, {
            key: 'Cc',
            alt: true,
            ctrl: true,
            fn: function () {
                if (winAdd == undefined && winMod == undefined) {
                    if (winAddCampos == undefined) {
                        importarJS('../../views/js/gesttipomodelo/gestattrtipomodelo.js');
                    } else
                        winFpCampos('Add');
                } else if (winAdd != undefined) {
                    if (winAddCampos == undefined && !winAdd.isVisible() && !winMod.isVisible()) {
                        importarJS('../../views/js/gesttipomodelo/gestattrtipomodelo.js');
                    } else
                        winFpCampos('Add');
                } else if (winMod != undefined) {
                    if (winAddCampos == undefined && !winMod.isVisible()) {
                        importarJS('../../views/js/gesttipomodelo/gestattrtipomodelo.js');
                    } else
                        winFpCampos('Add');
                }
            }
        }, {
            key: 'Ii',
            alt: true,
            ctrl: true,
            fn: function () {
                if (gpTipoModelo.getSelectionModel().getSelections().length == 1 && !btnEliminar.disabled && (winAdd == undefined || !winAdd.isVisible()) && (winMod == undefined || !winMod.isVisible())) {
                    if (winAddCampos == undefined) {
                        importarJS('../../views/js/gesttipomodelo/gestattrtipomodelo.js');
                    } else
                        winFpCampos('Add');
                }
            }
        }, {
            key: 46,
            ctrl: true,
            fn: function () {
                if (gpTipoModelo.getSelectionModel().getSelections().length == 1 && !btnDelAtributos.disabled && (winAdd == undefined || !winAdd.isVisible()) && (winMod == undefined || !winMod.isVisible())) {
                    eliminarAtributos();
                }
            }
        }
    ]);
}// Endof cargarInterfaz

// function adicionarTipoModelo
function adicionarTipoModelo(aply) {
    if (controlaraccion == 1)
        var mensa = perfil.etiquetas.msgAdicionando;
    else {
        if (controlaraccion == 2)
            var mensa = perfil.etiquetas.msgModificando;
    }
    if (accion_tipomod != "mod") {
        if (fpTipoModelo.getForm().isValid()) {
            fpTipoModelo.getForm().submit({
                url: 'adicionartipomodelo',
                waitMsg: mensa,
                failure: function (form, action) {
                    if (action.result.codMsgC == 1) {
                        if (action.result.mensaje == 'add')
                            mensaje = perfil.etiquetas.msgAdicionado;
                        else
                            mensaje = perfil.etiquetas.msgModificado;
                        if (!aply) {
                            winAdd.hide();
                        }
                        mostrarMensaje(1, conformarMensaje(mensaje));
                        gpTipoModelo.getStore().reload();
                        fpTipoModelo.getForm().reset();
                        btnModificar.disable();
                        btnEliminar.disable();
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgErrorTipoModeloAdicionado);
                    }
                }
            });
        } else {
            if (!Ext.getCmp('denominacion').getRawValue() || !Ext.getCmp('codigo').getRawValue())
                mostrarMensaje(1, perfil.etiquetas.msgBlanco);
            else
                mostrarMensaje(1, perfil.etiquetas.msgVerifique);
        }
    } else {
        if (fpTipoModeloMod.getForm().isValid()) {
            fpTipoModeloMod.getForm().submit({
                url: 'adicionartipomodelo',
                waitMsg: mensa,
                failure: function (form, action) {
                    if (action.result.codMsgC == 1) {
                        if (action.result.mensaje == 'add')
                            mensaje = perfil.etiquetas.msgAdicionado;
                        else
                            mensaje = perfil.etiquetas.msgModificado;
                        if (!aply) {
                            winMod.hide();
                        }
                        mostrarMensaje(1, conformarMensaje(mensaje));
                        gpTipoModelo.getStore().reload();
                        fpTipoModeloMod.getForm().reset();
                        btnModificar.disable();
                        btnEliminar.disable();
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgErrorTipoModeloAdicionado);
                    }
                }
            });
        } else {
            if (!Ext.getCmp('denominacionmod').getValue())
                mostrarMensaje(1, perfil.etiquetas.msgBlanco);
            else
                mostrarMensaje(1, perfil.etiquetas.msgVerifique);
        }
    }
}

// function eliminarTipoModelo
function eliminarTipoModelo() {

    var selecciones = gpTipoModelo.getSelectionModel().getSelections();
    if (selecciones.length == 1) {
        mostrarMensaje(2, perfil.etiquetas.msgSeguroSin, elimina);
    } else {
        mostrarMensaje(2, perfil.etiquetas.msgSeguroPlural, elimina);
    }
    var cont = 0;

    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            var arreglo = [];
            var arreglotabla = [];
            var arreglocodigo = [];
            for (var i = 0; i < selecciones.length; i++) {
                arreglo.push(selecciones[i].data.idtipomodelo);
                arreglotabla.push(selecciones[i].data.idtabla);
                arreglocodigo.push(selecciones[i].data.codigo);
            }
            if (selecciones.length == 1) {
                Ext.MessageBox.show({
                    title: perfil.etiquetas.msgEspere,
                    msg: perfil.etiquetas.msgEliminandoSingular,
                    width: 250,
                    wait: true,
                    progress: true,
                    closable: false
                });
            } else {
                Ext.MessageBox.show({
                    title: perfil.etiquetas.msgEspere,
                    msg: perfil.etiquetas.msgEliminandoPlural,
                    width: 250,
                    wait: true,
                    progress: true,
                    closable: false
                });
            }

            Ext.Ajax.request({
                url: 'eliminarTipoModelo',
                params: {
                    idtipomodelo: Ext.encode(arreglo),
                    idtabla: Ext.encode(arreglotabla),
                    codigo: Ext.encode(arreglocodigo)
                },
                callback: function (options, success, response) {
                    eliminando = false;
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgC == 1) {
                        if (selecciones.length == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoTMSingular);
                            gpTipoModelo.getStore().reload();
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoTMPlural);
                            gpTipoModelo.getStore().reload();
                        }
                    } else if (responseData.codMsgC == 21)
                        mostrarMensaje(1, perfil.etiquetas.msgUsado);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                    Ext.MessageBox.hide();
                    stGpGestAtributos.loadData({"data": [], "total": 0});
                    btnAddAtributos.disable();
                    btnDelAtributos.disable();
                    btnModificar.disable();
                    btnEliminar.disable();
                }
            });
        } else {
            eliminando = false;
        }
    }
}

// function eliminarAtribModelo
function eliminarAtributos() {
    mostrarMensaje(2, perfil.etiquetas.msgEliminarColum, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.MessageBox.show({
                title: perfil.etiquetas.msgEspere,
                msg: perfil.etiquetas.msgEliminandoCol,
                width: 250,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: 'eliminarColumnaATipoModelo',
                params: {
                    idcolumna: gpAtributos.getSelectionModel().getSelected().data.idcampo,
                    idtipomodelo: gpTipoModelo.getSelectionModel().getSelected().data.idtipomodelo,
                    idtipomodelocolumna: gpAtributos.getSelectionModel().getSelected().data.idtipomodelocolumna
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgC == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgEliminarColum1);
                        gpAtributos.getStore().removeAll();
                        gpAtributos.getStore().reload();
                    } else {
                        if (responseData.codMsgC == 21) {
                            mostrarMensaje(1, perfil.etiquetas.msgUsado);
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgEliminarColum2);
                        }
                    }
                    Ext.MessageBox.hide();
                }
            });
        }
    }
}

function Aprobar(val) {
    if (controlaraccion == 1) {
        mostrarMensaje(2, perfil.etiquetas.msgSegCambEstado, aprobar);
    } else if (controlaraccion == 2) {
        mostrarMensaje(2, perfil.etiquetas.msgSegCambEstadoDes, aprobar);
    }

    function aprobar(btn) {
        var arreglo = [];
        if (btn == 'ok') {
            for (var i = 0; i < gpTipoModelo.getSelectionModel().getSelections().length; i++) {
                if (gpTipoModelo.getSelectionModel().getSelections()[i].id)
                    arreglo.push(gpTipoModelo.getSelectionModel().getSelections()[i].data.idtipomodelo);
            }
            if (controlaraccion == 1)
                var mensa = perfil.etiquetas.msgAprobando;
            else {
                if (controlaraccion == 2)
                    var mensa = perfil.etiquetas.msgDesaprobando;
            }
            var mascara = Ext.MessageBox.show({
                title: perfil.etiquetas.msgEspere,
                msg: mensa,
                width: 250,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: 'aprobarDesaprobar',
                params: {
                    idtipomodelo: Ext.encode(arreglo),
                    aprobacion: val
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgA == 1) {
                        if (responseData.mensaje == 'aprobado')
                            mensaje = perfil.etiquetas.msgAprobado;
                        else
                            mensaje = perfil.etiquetas.msgDesaprobado;
                        mostrarMensaje(1, conformarMensaje(mensaje));
                        gpTipoModelo.getStore().reload();
                    } else if (responseData.codMsgA == 22) {
                        mostrarMensaje(1, perfil.etiquetas.msgErrorTipoModeloEnUso);
                    } else {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                    }
                    mascara.hide();
                }
            });
        }
    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

onkyupbusqueda = function (c, e) {
    if (e.getKey() == 13)
        stGpGestTipoModelo.reload({});
}

function conformarMensaje(mesg) {
    mesg = perfil.etiquetas.msg1 + mesg + perfil.etiquetas.msg2;
    return mesg;
}

function siexisteTmodeloFiltrado() {
    if (filtrostipomodelo.getFiltrosActivos().length > 0 && stGpGestTipoModelo.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}
