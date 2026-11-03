var check = false, offset = 0, idcolumna = 0;


// Store combo stCmbColumna
stCmbColumna = new Ext.data.Store({
    url: 'listarColumnasCombo',
    listeners: {
        beforeload: function(st, rec, opt) {
            this.baseParams.idtipomodelo = gpTipoModelo.getSelectionModel().getSelected().data.idtipomodelo;

        }
    },
    reader: new Ext.data.JsonReader({
        root: "data",
        id: "idcolumna"
    }, [{
            name: 'idcolumna'
        }, {
            name: 'denominacion'
        }]
            )
});

// Store combo stGpGestCampos
stCmbTipoDato = new Ext.data.Store({
    url: 'listarTiposDatosColumnas',
    listeners: {
        'load': function(st, rec, opt) {
            for (name in rec) {
                var record = rec[name];
                if (record.data)
                    if (record.data.denominacion == "Área de texto" || record.data.denominacion == "Sí/No") {
                        st.remove(record);
                    }
            }
        }

    },
    reader: new Ext.data.JsonReader({
        totalProperty: "total",
        root: "data",
        id: "idtipodato"
    }, [{
            name: 'idtipodato'
        }, {
            name: 'denominacion'
        }]
            )
});

// Store combo stCmbRexExp
stCmbRexExp = new Ext.data.Store({
    url: 'listarExpresionesRegulares',
    reader: new Ext.data.JsonReader({
        root: "data",
        id: "idexpresionregular"
    }, [{
            name: 'idexpresionregular'
        }, {
            name: 'denominacion'
        }]
            )
});

// Store combo stCmbTabla
stCmbConcepto = new Ext.data.Store({
    url: 'listarNomencladores',
    listeners: {
        beforeload: function() {
            stCmbConcepto.baseParams.idtipomodelo = gpTipoModelo.getSelectionModel().getSelected().data.idtipomodelo;
        }
    },
    reader: new Ext.data.JsonReader({
        root: "data",
        id: "idtiponomenclador"
    }, [{
            name: 'idtiponomenclador'
        }, {
            name: 'denominacion'
        }]
            )
});

stValueDisplay = new Ext.data.Store({
    url: 'cargarcmbcampos',
    listeners: {
        beforeload: function(st, rcs) {
            Ext.getCmp('cmbcampodf').enable();
            Ext.getCmp('ccmbcampodf').show();
        }
    },
    reader: new Ext.data.JsonReader({
        root: "data",
        id: "idcampo"
    }, [{
            name: 'idcampo'
        }, {
            name: 'denominacion'
        }, {
            name: 'llave_primaria'
        },
        {
            name: 'etiqueta',
            mapping: 'DatComponente.etiqueta'
        }]
            )
});

winConcepto = new Ext.Window({
    modal: true,
    closeAction: 'hide',
    constrain: true,
    layout: 'fit',
    title: perfil.etiquetas.lbTitSeleccion,
    width: 200,
    height: 200,
    buttons: [{
            iconCls: 'cancelar',
            text: perfil.etiquetas.lbBtnCancelar,
            handler: function() {
                winConcepto.hide();
            }
        },
        {
            iconCls: 'aceptar',
            text: perfil.etiquetas.lbBtnAceptar,
            id: 'btnAcpConcepto',
            disabled: true,
            handler: function() {

                Ext.getCmp('cmbtabla').setValue(
                        );
                Ext.getCmp('cmbcampovf').setValue(
                        );
                stValueDisplay.reload(
                        {
                            params: {
                                idtabla: smGpGestTipoModelo.getSelected().data.idtabla
                            },
                            callback: function(r, o, succes) {
                            }
                        });
                winConcepto.hide();
            }
        }
    ]
});


// formulario fpCampos
fpCampos = new Ext.FormPanel({
    labelAlign: 'top',
    frame: true,
    id: 'fpCampos',
    autoHeight: true,
    bodyStyle: 'padding:5px 5px 0',
    reader: new Ext.data.JsonReader({
        totalProperty: "total",
        root: "data",
        id: "idcampo"
    }, [{
            name: 'idcampo'
        }, {
            name: 'denominacion'
        }, {
            name: 'tdato'
        }, {
            name: 'longitud'
        }]
            ),
    items: [{
            layout: 'column',
            items: [{
                    columnWidth: 0.50,
                    layout: 'form',
                    id: 'cidattr',
                    items: [
                        {
                            xtype: 'textfield',
                            id: 'tfcolumna',
                            readOnly: true,
                            disabled: false,
                            fieldLabel: perfil.etiquetas.lbColumna,
                            allowBlank: false,
                            anchor: '90%',
                            listeners: {
                                focus: function() {
                                    gestionarColumnas();
                                }
                            }
                        }
                    ]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    id: 'cnombre',
                    hidden: true,
                    items: [{
                            xtype: 'textfield',
                            fieldLabel: perfil.etiquetas.lbEtiqueta,
                            id: 'nombre',
                            regex: /^([a-zA-Z0-9áéíóú??É??ÓÚñÑ _-]+ ?[a-zA-Z0-9áéíóú??É??ÓÚñÑ _-]*)+$/,
                            anchor: '90%'
                        }]
                }, {
                    xtype: 'hidden',
                    id: 'idcampo'
                }, {
                    columnWidth: 0.50,
                    layout: 'form',
                    items: [{
                            displayField: 'denominacion',
                            xtype: 'combo',
                            id: 'tipo',
                            valueField: 'idtipodato',
                            hiddenName: 'idtipodato',
                            triggerAction: 'all',
                            mode: 'local',
                            anchor: '95%',
                            listeners: {
                                select: function(cmb) {
                                    LlenarFieldSet(cmb.getValue());
                                }
                            },
                            fieldLabel: perfil.etiquetas.lbTipo,
                            allowBlank: false,
                            store: stCmbTipoDato,
                            emptyText: perfil.etiquetas.lbSeleccione,
                            loadingText: perfil.etiquetas.lbCargando
                        }]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    id: 'etiq',
                    hidden: true,
                    items: [{
                            xtype: 'textfield',
                            fieldLabel: perfil.etiquetas.lbEtiqueta,
                            id: 'etiqueta',
                            anchor: '100%'
                        }]
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    items: new Ext.form.FieldSet({
                        layout: 'column',
                        title: '',
                        id: 'fs_fieldset',
                        autoHeight: true,
                        items: [{
                                columnWidth: 0.30,
                                layout: 'form',
                                id: 'cformat',
                                items: [{
                                        xtype: 'checkbox',
                                        labelSeparator: '',
                                        fieldLabel: '',
                                        boxLabel: perfil.etiquetas.lbFormato,
                                        name: 'format',
                                        id: 'format'
                                    }]
                            }, {
                                columnWidth: .33,
                                id: 'clongitud',
                                hidden: true,
                                layout: 'form',
                                items: [{
                                        xtype: 'numberfield',
                                        fieldLabel: perfil.etiquetas.lbLongitud,
                                        id: 'longitud',
                                        maxLength: 4,
                                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                                        regex: /^([0-9]+ ?[0-9]*)+$/,
                                        anchor: '95%'
                                    },
                                    new Ext.form.Checkbox({
                                        boxLabel: 'Decimal',
                                        id: 'decimales',
                                        hideLabel: true
                                    })
                                ]
                            }, {
                                columnWidth: .70,
                                id: 'ccmbtabla',
                                hidden: true,
                                layout: 'form',
                                items: [{displayField: 'denominacion',
                                        xtype: 'combo',
                                        id: 'cmbtabla',
                                        valueField: 'idtiponomenclador',
                                        hiddenName: 'idtiponomenclador',
                                        readOnly: true,
                                        mode: 'local',
                                        anchor: '95%',
                                        //triggerAction: 'all',
                                        fieldLabel: perfil.etiquetas.lbConcepto,
                                        allowBlank: false,
                                        editable: false,
                                        store: stCmbConcepto,
                                        emptyText: perfil.etiquetas.lbSeleccione,
                                        loadingText: perfil.etiquetas.lbCargando
                                    }, new Ext.form.Checkbox({
                                        boxLabel: perfil.etiquetas.lbFiltrado,
                                        id: 'filtro',
                                        hideLabel: true
                                    })
                                ]
                            }, {
                                columnWidth: .33,
                                id: 'ccmbcampodf',
                                hidden: true,
                                layout: 'form',
                                items: [{
                                        displayField: 'etiqueta',
                                        valueField: 'idcampo',
                                        hiddenName: 'idcampodf',
                                        id: 'cmbcampodf',
                                        fieldLabel: perfil.etiquetas.lbMostrar,
                                        xtype: 'combo',
                                        triggerAction: 'all',
                                        readOnly: true,
                                        allowBlank: false,
                                        mode: 'local',
                                        anchor: '95%',
                                        editable: false,
                                        store: stValueDisplay,
                                        emptyText: perfil.etiquetas.lbSeleccione,
                                        loadingText: perfil.etiquetas.lbCargando
                                    }]
                            }, {
                                columnWidth: 0.50,
                                id: 'rgex',
                                hidden: true,
                                layout: 'form',
                                items: [{
                                        displayField: 'denominacion',
                                        xtype: 'combo',
                                        id: 'expresion_regular',
                                        valueField: 'idexpresionregular',
                                        triggerAction: 'all',
                                        readOnly: true,
                                        hiddenName: 'idexpresionregular',
                                        mode: 'remote',
                                        anchor: '95%',
                                        fieldLabel: perfil.etiquetas.lbExpresion,
                                        editable: false,
                                        store: stCmbRexExp,
                                        emptyText: perfil.etiquetas.lbSeleccione,
                                        loadingText: perfil.etiquetas.lbCargando
                                    }]
                            }, {
                                columnWidth: 0.33,
                                id: 'mini',
                                hidden: true,
                                layout: 'form',
                                items: [{
                                        xtype: 'numberfield',
                                        fieldLabel: perfil.etiquetas.lbLimite,
                                        id: 'limite_inferior',
                                        minValue: 0,
                                        anchor: '95%'
                                    }]
                            }, {
                                columnWidth: 0.33,
                                id: 'maxi',
                                hidden: true,
                                layout: 'form',
                                items: [{
                                        xtype: 'numberfield',
                                        fieldLabel: perfil.etiquetas.lbLimiteS,
                                        id: 'limite_superior',
                                        minValue: 1,
                                        anchor: '95%'
                                    }]
                            }, {
                                columnWidth: 0.33,
                                id: 'fini',
                                hidden: true,
                                layout: 'form',
                                items: new Ext.form.DateField({
                                    fieldLabel: perfil.etiquetas.lbFecha,
                                    format: 'd/m/Y',
                                    name: 'fecha_inicio',
                                    id: 'fecha_inicio',
                                    anchor: '95%',
                                    vtype: 'daterange',
                                    endDateField: 'fecha_fin'
                                })
                            }, {
                                columnWidth: 0.33,
                                id: 'ffin',
                                hidden: true,
                                layout: 'form',
                                items: new Ext.form.DateField({
                                    fieldLabel: perfil.etiquetas.lbFechaF,
                                    format: 'd/m/Y',
                                    name: 'fecha_fin',
                                    id: 'fecha_fin',
                                    vtype: 'daterange',
                                    startDateField: 'fecha_inicio',
                                    anchor: '95%',
                                    allowBlank: false
                                })
                            }]
                    })
                }]
        }]
});

function LlenarFieldSet(op) {
    Ext.getCmp('expresion_regular').disable();
    Ext.getCmp('cnombre').disable();
    Ext.getCmp('cnombre').hide();
    Ext.getCmp('cidattr').enable();
    Ext.getCmp('cidattr').show();
    Ext.getCmp('rgex').hide();
    Ext.getCmp('longitud').disable();
    Ext.getCmp('clongitud').hide();
    Ext.getCmp('decimales').hide();
    Ext.getCmp('limite_inferior').disable();
    Ext.getCmp('mini').hide();
    Ext.getCmp('limite_superior').disable();
    Ext.getCmp('maxi').hide();
    Ext.getCmp('longitud').disable();
    Ext.getCmp('clongitud').hide();
    Ext.getCmp('fecha_inicio').disable();
    Ext.getCmp('fini').hide();
    Ext.getCmp('fecha_fin').disable();
    Ext.getCmp('ffin').hide();
    Ext.getCmp('cmbtabla').disable();
    Ext.getCmp('ccmbtabla').hide();
    Ext.getCmp('filtro').disable();
    Ext.getCmp('filtro').hide();
    Ext.getCmp('cmbcampodf').disable();
    Ext.getCmp('ccmbcampodf').hide();
    Ext.getCmp('cformat').hide();
    Ext.getCmp('cformat').disable();
    Ext.getCmp('etiqueta').disable();
    Ext.getCmp('etiq').hide();
    if (op == 2) {
        Ext.getCmp('rgex').show();
        Ext.getCmp('expresion_regular').enable();
    }
    if (op == 3) {
    }
    if (op == 5) {
        Ext.getCmp('ccmbtabla').show();
        Ext.getCmp('cmbtabla').enable();
        stCmbConcepto.reload();
    }
    winAddCampos.doLayout();
}

// Ventanas para formulario winFpCampos(opcion)
function winFpCampos(opcion) {

    switch (opcion) {
        case 'Add':
            if (!winAddCampos) {
                winAddCampos = new Ext.Window({
                    modal: true,
                    closeAction: 'hide',
                    constrain: true,
                    layout: 'fit',
                    title: perfil.etiquetas.lbTitWinAddCol,
                    width: 400,
                    autoHeight: true,
                    buttons: [{
                            iconCls: 'cancelar',
                            tooltip: perfil.etiquetas.lbTtBtnCancelarC,
                            text: perfil.etiquetas.lbBtnCancelar,
                            handler: function() {
                                winAddCampos.hide();
                            }
                        },
                        {
                            iconCls: 'aplicar',
                            tabIndex: 13,
                            text: perfil.etiquetas.lbBtnAplicar,
                            id: 'btnApl',
                            tooltip: perfil.etiquetas.lbTtBtnAplicarC,
                            handler: function() {
                                adicionarAtribModelo(true);
                            }
                        },
                        {
                            iconCls: 'aceptar',
                            text: perfil.etiquetas.lbBtnAceptar,
                            tooltip: perfil.etiquetas.lbTTBtnAceptarC,
                            handler: function() {
                                adicionarAtribModelo(false);
                            }
                        }],
                    listeners: {
                        beforeshow: function() {
                        }
                    }
                });
            }
            winAddCampos.setTitle(perfil.etiquetas.lbTitWinAddCol);
            fpCampos.getForm().reset();
            LlenarFieldSet(-1);
            winAddCampos.show();
            stCmbColumna.reload();
            stCmbTipoDato.reload();
            winAddCampos.add(fpCampos);
            winAddCampos.doLayout();
            break;
        case 'Enc':
            if (!winAddCampos) {
                winAddCampos = new Ext.Window({
                    modal: true,
                    closeAction: 'hide',
                    constrain: true,
                    layout: 'fit',
                    title: perfil.etiquetas.lbTitWinAddEnc,
                    width: 550,
                    autoHeight: true,
                    buttons: [{
                            iconCls: 'cancelar',
                            text: perfil.etiquetas.lbBtnCancelar,
                            handler: function() {
                                winAddCampos.hide();
                            }
                        }, {
                            iconCls: 'aceptar',
                            text: perfil.etiquetas.lbBtnAceptar,
                            handler: function() {
                                adicionarAtribModelo();
                            }
                        }]
                });
            }
            encabezado = true;
            winAddCampos.setTitle(perfil.etiquetas.lbTitWinAddEnc);
            fpCampos.getForm().reset();
            LlenarFieldSet(-1);
            winAddCampos.show();
            winAddCampos.add(fpCampos);
            winAddCampos.doLayout();
            break;
    }
}

winFpCampos('Add');

// function adicionarAtribModelo
function adicionarAtribModelo(aply) {
    var urlDir;

    if (fpCampos.getForm().isValid()) {
        fpCampos.getForm().submit({
            url: 'adicionarColumnaATipoModelo',
            waitMsg: perfil.etiquetas.lbAdicionando,
            params: {
                idtabla: gpTipoModelo.getSelectionModel().getSelected().data.idtabla,
                idcolumna: idcolumna,
                idtipomodelo: gpTipoModelo.getSelectionModel().getSelected().data.idtipomodelo
            },
            failure: function(form, action) {
                if (action.result) {
                    if (action.result.codMsgC == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgAdicionadoCol);
                        stCmbColumna.reload();
                        if (!aply) {
                            winAddCampos.hide();
                        }

                        fpCampos.getForm().reset();
                        gpAtributos.getStore().reload();
                        btnModificar.disable();
                        btnDelAtributos.disable();
                    }
                    if (action.result.codMsgC == 3)
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAddExistente)
                    if (action.result.codMsgC == 21)
                        mostrarMensaje(1, perfil.etiquetas.msgErrorAddImpCant)
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        });
    } else
        mostrarMensaje(1, perfil.etiquetas.msgVerifique);
}

function modificarEstado(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}
///gestion de las columnas*///////////////
function gestionarColumnas() {
    var accion_col;
    //botones
    btnAdd = new Ext.Toolbar.Button({
        id: 'btnAdd',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbTtbtnAdicionarColumna,
        handler: function() {
            accionAdicionar();
        }
    });
    btnMod = new Ext.Toolbar.Button({
        id: 'btnMod',
        disabled: true,
        iconCls: 'modificar',
        tooltip: perfil.etiquetas.lbTtbtnModificarColumna,
        handler: function() {
            accion_col = 'mod';
            validar(accion_col);
        }
    });
    btnDel = new Ext.Toolbar.Button({
        id: 'btnDel',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbTtElimColumna,
        disabled: true,
        handler: function() {
            accion_col = 'del';
            validar(accion_col);
        }
    });
    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btnLimpiar',
        disabled: false,
        handler: function() {
            filtroscolumnas.clearFilters();
        }
    });
//filtros
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtroscolumnas = new Ext.grid.GridFilters({
        filters: [
            {
                id: 'denomcolumna',
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            },
            {
                type: 'list',
                dataIndex: 'enuso',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }]
    });
//store
    stGridpcolumna = new Ext.data.Store({
        url: 'listarColumnas',
        listeners: {
            beforeload: function() {
                stGridpcolumna.baseParams.start = offset;
                stGridpcolumna.baseParams.idtipomodelo = gpTipoModelo.getSelectionModel().getSelected().data.idtipomodelo;
                cambiarTituloFiltrarColumnas();
            },
            load: function() {
                siexistecolumFiltrada();
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idcolumna',
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idcolumna'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'enuso'
            }])
    });
//selection model
    smGridpcolumna = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function() {
                var long = smGridpcolumna.getSelections().length;
                if (long > 1) {
                    btnMod.disable();
                } else {
                    btnDel.enable();
                    btnMod.enable();
                    btnAdd.enable();
                    if (smGridpcolumna.getSelected().get('enuso') == 0) {
                        btnMod.enable();
                        btnDel.enable();
                    } else {
                        btnMod.disable();
                        btnDel.disable();
                    }
                }
            },
            rowdeselect: function(s, n, r) {
                if (smGridpcolumna.getSelections().length > 1 || smGridpcolumna.getSelections().length == 1) {
                    btnDel.enable();
                } else {
                    btnDel.disable();
                }
                if (smGridpcolumna.getSelections().length == 1) {
                    if (smGridpcolumna.getSelected().data.enuso == 0)
                        btnMod.enable();
                    else
                        btnMod.disable();
                } else {
                    btnMod.disable();
                }
            }
        }
    });
    btnAceptarSelCol = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarSelCol',
        text: perfil.etiquetas.lbBtnAceptar,
        tooltip: perfil.etiquetas.lbTTBtnAceptarC,
        handler: function() {
            Ext.getCmp('tfcolumna').setValue(smGridpcolumna.getSelected().data.denominacion);
            idcolumna = smGridpcolumna.getSelected().data.idcolumna;
            winGestColumnas.destroy();
        }
    });
    btnCancelarSelCol = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarSelCol',
        text: perfil.etiquetas.lbBtnCancelar,
        tooltip: perfil.etiquetas.lbTtBtnCancelarC,
        handler: function() {
            Ext.getCmp('tfcolumna').setValue('');
            idcolumna = 0;
            winGestColumnas.destroy();
        }
    });
//gridpanel
    Gridpcolumna = new Ext.grid.GridPanel({
        loadMask: {
            store: stGridpcolumna
        },
        store: stGridpcolumna,
        plugins: filtroscolumnas,
        master_column_id: 'expandir',
        sm: smGridpcolumna,
        root_title: perfil.etiquetas.lbColumnas,
        autoExpandColumn: 'expandir',
        stripeRows: true,
        columns: [
            {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            },
            {
                id: 'auto',
                header: perfil.etiquetas.lbDescripcion,
                tooltip: perfil.etiquetas.lbDescripcion,
                width: 270,
                sortable: true,
                dataIndex: 'descripcion',
                renderer: crearToolTip
            },
            {
                header: perfil.etiquetas.lbEnUso,
                tooltip: perfil.etiquetas.lbEnUso,
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'enuso',
                renderer: modificarEstado
            }
        ],
        listeners: {
            celldblclick: function() {
                if (!btnMod.hidden && !btnMod.disabled) {
                    accion_col = 'mod';
                    validar(accion_col);
                }
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGridpcolumna,
            displayInfo: true,
            items: [btnLimpiar],
            listeners: {
                beforechange: function(p, e) {
                    offset = e.start;
                }
            }
        })
    });
//ventana
    winGestColumnas = new Ext.Window({
        title: perfil.etiquetas.lbColumnas,
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        width: 500,
        height: 500,
        items: Gridpcolumna,
        tbar: [btnAdd, btnMod, btnDel],
        bbar: ['->', btnCancelarSelCol, btnAceptarSelCol]
    });
    winGestColumnas.show();
    stGridpcolumna.reload();
}
function cambiarTituloFiltrarColumnas() {
    var filtrado_por = "";
    var sep = "/";
    if (filtroscolumnas.getFiltrosActivos() == undefined || filtroscolumnas.getFiltrosActivos().length == 0) {
        Gridpcolumna.setTitle(perfil.etiquetas.lbColumnas);
    } else {
        for (i = 0; i < filtroscolumnas.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtroscolumnas.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtroscolumnas.getFiltrosActivos()[i].dataIndex == "descripcion") {
                aux = perfil.etiquetas.lbDescripcion;
            } else if (filtroscolumnas.getFiltrosActivos()[i].dataIndex == "enuso") {
                aux = perfil.etiquetas.lbEnUso;
            }
            if (i == filtroscolumnas.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        Gridpcolumna.setTitle(perfil.etiquetas.lbFiltradoPorCol + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function siexistecolumFiltrada() {
    if (filtroscolumnas.getFiltrosActivos().length > 0 && stGridpcolumna.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}
function accionAdicionar() {
    controlaraccion = 1;
    accion_col = 'add';
    mensaje = perfil.etiquetas.msgGuardandoAdicionar;
    btnCancelarCol = new Ext.Button({
        iconCls: 'cancelar',
        tabIndex: 14,
        id: 'idcancel',
        text: perfil.etiquetas.lbBtnCancelar,
        tooltip: perfil.etiquetas.lbTtbtnCancelarC,
        handler: function() {
            winAddColumnas.destroy();
        }
    });
    btnAplicarCol = new Ext.Button({
        iconCls: 'aplicar',
        tabIndex: 13,
        text: perfil.etiquetas.lbBtnAplicar,
        tooltip: perfil.etiquetas.lbTtBtnAplicarC,
        id: 'btnApl',
        handler: function() {
            adicionarColumnas(controlaraccion, accion_col, 'apl');
        }
    });
    btnAceptarCol = new Ext.Button({
        iconCls: 'aceptar',
        tabIndex: 12,
        id: 'idaceptar',
        nextTab: 'denominacion',
        text: perfil.etiquetas.lbBtnAceptar,
        tooltip: perfil.etiquetas.lbTTBtnAceptarC,
        handler: function() {
            adicionarColumnas(controlaraccion, accion_col);
        }
    });
    denominacion = new Ext.form.TextField({
        id: 'denominacionAddColunmasN',
        tabIndex: 11,
        prevTab: 'idaceptar',
        fieldLabel: perfil.etiquetas.lbDenominacion,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: perfil.etiquetas.lbmaxLengthText100,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        allowBlank: false,
        blankText: perfil.etiquetas.lbRequerido
    });
    descripcion = new Ext.form.TextArea({
        id: 'descripcionAddColunmasN',
        tabIndex: 12,
        maxLength: 255,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        maxLengthText: perfil.etiquetas.lbmaxLengthText255,
        fieldLabel: perfil.etiquetas.lbDescripcion,
        anchor: '100%'
    });
    fp_Add_Columnas = new Ext.FormPanel({
        id: 'fp_Add_Columnas',
        region: 'center',
        autoHeight: true,
        autoWidth: true,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 10 0 10;',
                        layout: 'form',
                        items: [denominacion, descripcion]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'hidden',
                                id: 'idcolumna'
                            }]
                    }]
            }]
    });
    winAddColumnas = new Ext.Window({
        title: perfil.etiquetas.titAddcolumnas,
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        width: 320,
        autoHeight: true,
        items: fp_Add_Columnas,
        buttons: [btnCancelarCol, btnAplicarCol, btnAceptarCol],
        listeners: {
        }
    });
    winAddColumnas.on('beforeshow', function() {
        denominacion.focus(true, 500);
    });
    winAddColumnas.show();
    smGridpcolumna.clearSelections();
}
function validar(accion_col) {
    Ext.Ajax.request({
        url: 'validarOperacionesColumna',
        params: {
            idcolumna: smGridpcolumna.getSelected().data.idcolumna,
            operacion: accion_col
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 22) {
                switch (accion_col) {
                    case 'del':
                        {
                            eliminarColumnas();
                        }
                        break;
                    case 'mod':
                        {
                            ModificarColumna(accion_col);
                        }
                }
            } else if (responseData.codMsg == 20)
                mostrarMensaje(1, perfil.etiquetas.msgErrorColumnasFijasMod);
            else if (responseData.codMsg == 21 && smGridpcolumna.getSelections().length == 1)
                mostrarMensaje(1, perfil.etiquetas.msgErrorEnUsoSin);
            else if (responseData.codMsg == 21 && smGridpcolumna.getSelections().length > 1)
                mostrarMensaje(1, perfil.etiquetas.msgErrorEnUsoPlural);
            else
                (mostrarMensaje(3, perfil.etiquetas.msgErrorAction));
        }
    });
}
function eliminarColumnas() {
    var mensajeConfEliminar = true;
    if (Gridpcolumna.getSelectionModel().getSelections().length == 1) {
        mostrarMensaje(2, perfil.etiquetas.lbMsgEliminarColumna, elimina);
    } else {
        mostrarMensaje(2, perfil.etiquetas.lbMsgEliminarColumnas, elimina);
    }
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            mensajeConfEliminar = true;
            var aux = Gridpcolumna.getSelectionModel().getSelections();
            var els = new Array();
            for (var i = 0; i < aux.length; i++) {
                els.push(aux[i].id);
            }
            Ext.MessageBox.show({
                title: perfil.etiquetas.msgEspere,
                msg: perfil.etiquetas.msgEliminando,
                width: 250,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: 'eliminarColumna',
                params: {
                    idcolumna: Ext.encode(els)
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    switch (responseData.codMsgP) {
                        case 1:
                            mostrarMensaje(1, perfil.etiquetas.lbMsgEliminado);
                            Gridpcolumna.getStore().reload();
                            break;
                        case 2:
                            mostrarMensaje(1, perfil.etiquetas.lbEliminadoAlg);
                            Gridpcolumna.getStore().reload();
                            break;
                        case 4:
                            mostrarMensaje(1, perfil.etiquetas.lbNoEliminado);
                            break;
                        default:
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                            break;
                    }
                    Ext.MessageBox.hide();
                    smGridpcolumna.clearSelections();
                }
            });
        } else {
            mensajeConfEliminar = false;
        }
    }
}
function adicionarColumnas(controlaraccion, accion_col, apl) {
    if (controlaraccion == 1)
        var mensa = perfil.etiquetas.msgAdicionandoCol;
    else {
        if (controlaraccion == 2)
            var mensa = perfil.etiquetas.msgModificandoCol;
    }
    if (accion_col == "mod") {
        var denominacion = Gridpcolumna.getSelectionModel().getSelected().json.denominacion;
        var descripcion = Gridpcolumna.getSelectionModel().getSelected().json.descripcion;
        if (Ext.getCmp('iddenominacionmod').getValue() != denominacion || Ext.getCmp('iddescripcionmod').getValue() != descripcion) {
            if (fp_Mod_Columnas.getForm().isValid()) {
                fp_Mod_Columnas.getForm().submit({
                    url: 'adicionarColumna',
                    waitMsg: mensa,
                    failure: function(form, action) {
                        responseData = action.result;
                        if (action.result.mensaje == 'mod') {
                            if (responseData.codMsgP == 1) {
                                mensaje1 = perfil.etiquetas.msgModificadoCol;
                                winModColumnas.destroy();
                                mostrarMensaje(1, mensaje1);
                                btnMod.disable();
                                btnDel.disable();
                            } else if (responseData.codMsgP == 2) {
                                mostrarMensaje(1, perfil.etiquetas.msgDenominacionYaExiste);
                            }
                            Gridpcolumna.getStore().reload();
                        }
                    }
                })
            } else {
                if (!Ext.getCmp('iddenominacionmod').getRawValue())
                    mostrarMensaje(1, perfil.etiquetas.msgBlanco);
                else
                    mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
            }
        } else {
            mostrarMensaje(1, perfil.etiquetas.msgRealizarModificacion);
        }
    } else {
        if (fp_Add_Columnas.getForm().isValid()) {
            fp_Add_Columnas.getForm().submit({
                url: 'adicionarColumna',
                waitMsg: mensa,
                method: 'POST',
                params: {
                    denominacion: Ext.getCmp('denominacionAddColunmasN').getValue(),
                    descripcion: Ext.getCmp('descripcionAddColunmasN').getValue()
                },
                failure: function(form, action) {
                    responseData = action.result;
                    if (responseData.mensaje == 'add') {
                        if (responseData.codMsgP == 1) {
                           
                            if (!apl)
                                winAddColumnas.destroy();
                            mensaje1 = perfil.etiquetas.msgAdicionadoCol;
                            if (!apl)
                                winAddColumnas.destroy();
                            mostrarMensaje(1, mensaje1);
                            if(Ext.getCmp('denominacionAddColunmasN')!= undefined)
                                Ext.getCmp('denominacionAddColunmasN').reset();
                            if(Ext.getCmp('denominacionAddColunmasN')!= undefined)
                                Ext.getCmp('descripcionAddColunmasN').reset();
                            
                            btnAceptarCol.disable();
                            btnAplicarCol.disable();
                            btnMod.disable();
                            btnDel.disable();
                            
                        } else if (responseData.codMsgP == 2) {
                            mostrarMensaje(1, perfil.etiquetas.msgDenominacionYaExiste);
                        }
                        
                    }
                    
                    Gridpcolumna.getStore().reload();
                }
            })
        } else {
            if (!Ext.getCmp('denominacion').getRawValue())
                mostrarMensaje(1, perfil.etiquetas.msgBlanco);
            else
                mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
        }
    }
}
function ModificarColumna(accion_col) {
    mensaje = perfil.etiquetas.msgGuardandoModificar;
    controlaraccion = 2;
    btnCancelarColMod = new Ext.Button({
        iconCls: 'cancelar',
        tabIndex: 14,
        id: 'idcancelmod',
        text: perfil.etiquetas.lbBtnCancelar,
        tooltip: perfil.etiquetas.lbTtBtnCancelarC,
        handler: function() {
            winModColumnas.destroy();
        }
    });
    btnAceptarColMod = new Ext.Button({
        iconCls: 'aceptar',
        tabIndex: 12,
        disabled: true,
        id: 'idaceptarmod',
        nextTab: 'iddenominacionmod',
        text: perfil.etiquetas.lbBtnAceptar,
        tooltip: perfil.etiquetas.lbTTBtnAceptarC,
        handler: function() {
            adicionarColumnas(controlaraccion, accion_col);
        }
    });
    denominacionmod = new Ext.form.TextField({
        id: 'iddenominacionmod',
        prevTab: 'idaceptarmod',
        tabIndex: 11,
        fieldLabel: perfil.etiquetas.lbDenominacion,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextDescripcion,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        listeners: {
            change: function() {
            }
        },
        allowBlank: false,
        blankText: perfil.etiquetas.lbRequerido
    });
    descripcionmod = new Ext.form.TextArea({
        id: 'iddescripcionmod',
        tabIndex: 12,
        maxLength: 255,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextDescripcion,
        fieldLabel: perfil.etiquetas.lbDescripcion,
        anchor: '100%'
    });
    fp_Mod_Columnas = new Ext.FormPanel({
        id: 'fp_Mod_Columnas',
        region: 'center',
        autoHeight: true,
        autoWidth: true,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 10 0 10;',
                        layout: 'form',
                        items: [denominacionmod, descripcionmod]
                    }]
            }, {
                columnWidth: 1,
                layout: 'form',
                items: [{
                        xtype: 'hidden',
                        id: 'idcolumna'
                    }]
            }],
        listeners: {
            'clientvalidation': function(fm, valid) {
                if (Ext.getCmp('iddescripcionmod').getValue() == "") {
                    descripcion = null;
                } else {
                    descripcion = Ext.getCmp('iddescripcionmod').getValue();
                }
                if ((Ext.getCmp('iddenominacionmod').getValue() != valordenominacion ||
                        descripcion != valordescripcion) && fm.getForm().isValid()) {
                    Ext.getCmp('idaceptarmod').enable();
                } else {
                    Ext.getCmp('idaceptarmod').disable();
                }
            }
        }
    });
    winModColumnas = new Ext.Window({
        title: perfil.etiquetas.titModcolumnas,
        modal: true,
        closeAction: 'destroy',
        layout: 'fit',
        constrain: true,
        width: 320,
        autoValidate: false,
        autoHeight: true,
        items: fp_Mod_Columnas,
        buttons: [btnCancelarColMod, btnAceptarColMod],
        listeners: {
            beforeshow: function() {
                Ext.getCmp('idaceptarmod').disable();
            },
            beforeclose: function() {
            }
        }
    });
    winModColumnas.show();
    fp_Mod_Columnas.getForm().reset();
    Ext.getCmp('iddenominacionmod').setValue(Gridpcolumna.getSelectionModel().getSelected().data.denominacion);
    Ext.getCmp('iddescripcionmod').setValue(Gridpcolumna.getSelectionModel().getSelected().data.descripcion);
    Ext.getCmp('idcolumna').setValue(Gridpcolumna.getSelectionModel().getSelected().data.idcolumna);
}
/////fin gest columnas*/////////////////////////
