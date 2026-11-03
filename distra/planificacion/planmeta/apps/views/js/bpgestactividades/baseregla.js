/**
 * 
 */

initBaseRegla = function () {
    var offsetActvReglas = 0;
    var offsetReglas = 0;
    cbEjercicioRegla = new Ext.form.ComboBox({
        id: 'cbEjercicioRegla',
        store: stEjercicio,
        disabled: false,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        //maxLength: 5,
        width: 180,
        listeners: {
            select: function (cb, rec, num) {
                stgpGestReglas.reload();
                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    gestionSegunEstEjercicioActv = false;
                } else {
                    gestionSegunEstEjercicioActv = true;
                }
            }
        }
    });
    /*Botones del Grid de Reglas*/
    btnAddRegla = new Ext.Button({
        id: 'idbtnAddRegla',
        iconCls: 'adicionar',
        disabled: true,
        tooltip: perfil.etiquetas.lbAdicionarRegla,
        handler: function () {
            ventanaRegla(null);
        }
    });
    btnGuardarRegla = new Ext.Button({
        id: 'idbtnGuardarRegla',
        iconCls: 'guardar',
        disabled: true,
        tooltip: perfil.etiquetas.lbGuardarRegla,
        handler: function () {
            actualizarReglas();
        }
    });
    btnEliminarRegla = new Ext.Button({
        id: 'idbtnEliminarRegla',
        iconCls: 'eliminar',
        disabled: true,
        tooltip: perfil.etiquetas.lbEliminarRegla,
        handler: function () {
            eliminarReglas();
        }
    });
    btnLimpiarFiltrosRegla = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosRegla',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosreglas.clearFilters();
        }
    });
    /*Fin de los Botones del Grid de Reglas*/

    cmgpGestRegla = new Ext.grid.ColumnModel([
        {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbIndicador,
            tooltip: perfil.etiquetas.lbIndicador,
            dataIndex: 'denoindicador',
            width: 160,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbValorControl,
            tooltip: perfil.etiquetas.lbValorControl,
            dataIndex: 'valorcontrol',
            width: 100,
            align: 'right',
            renderer: crearToolTipNro,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                minValue: 1
            })
        }, {
            header: perfil.etiquetas.lbActividadaGenerar,
            tooltip: perfil.etiquetas.lbActividadaGenerar,
            dataIndex: 'denoactividad',
            width: 250,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNivelBase,
            tooltip: perfil.etiquetas.lbNivelBase,
            dataIndex: 'nivelactividadbase',
            width: 80,
            align: 'right',
            renderer: crearToolTipNro,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                minValue: 1
            })
        }, {
            header: perfil.etiquetas.lbTipo,
            tooltip: perfil.etiquetas.lbTipo,
            dataIndex: 'tipo',
            width: 70,
            align: 'center',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            dataIndex: 'idusuario',
            hidden: true,
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            dataIndex: 'fecha',
            width: 120,
            align: 'right',
            hidden: true,
            renderer: crearToolTip
        }]);
    cmgpGestRegla.defaultSortable = true;
    smGpGestReglas = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetosReglas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetosReglas();
            }
        }
    });

    filtrosreglas = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'denoindicador'
            }, {
                type: 'numeric',
                dataIndex: 'valorcontrol'
            }, {
                type: 'string',
                dataIndex: 'denoactividad'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadbase'
            }, {
                type: 'list',
                dataIndex: 'tipo',
                options: [perfil.etiquetas.lbGenerada,
                    perfil.etiquetas.lbGeneradora]
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuarioNormas',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }]
    });

    stgpGestReglas = new Ext.data.GroupingStore({
        url: 'listarReglas',
        sortInfo: {
            field: 'tipo',
            direction: "ASC"
        },
        groupField: 'tipo',
        listeners: {
            beforeload: function (st, rec, opt) {
                cambiarTituloFiltrar(gpGestReglas, filtrosreglas, perfil.etiquetas.lbReglasDe + smGpGestAct.getSelected().data.denominacion);
                st.baseParams.idactividad = idactividadselecc;
                st.baseParams.idejercicio = cbEjercicioRegla.getValue();
                st.baseParams.start = offsetReglas;
            },
            load: function (st, rec, opt) {
                if (st.getCount() == 0) {
                    if (filtrosreglas.getFiltrosActivos().length > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    }

                    if (parseInt(smGpGestAct.selections.items[0].data.reglas) != 0) {
                        smGpGestAct.selections.items[0].set('reglas', 0);
                    }
                } else {
                    if (parseInt(smGpGestAct.selections.items[0].data.reglas) != 1) {
                        smGpGestAct.selections.items[0].set('reglas', 1);
                    }
                }
                gpActividades.doLayout();
                controlarObjetosReglas();
                campos_modificados = [];
                //upColorCell1();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data",
            id: 'idregla'
        }, [{
                name: 'idregla'
            }, {
                name: 'denominacion'
            }, {
                name: 'denoindicador'
            }, {
                name: 'valorcontrol'
            }, {
                name: 'denoactividad'
            }, {
                name: 'nivelactividadbase'
            }, {
                name: 'tipo'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }]
                )
    });

    gpGestReglas = new Ext.grid.EditorGridPanel({
        frame: true,
        id: 'gpGestReglas',
        autoExpandColumn: 'expandir',
        split: true,
        store: stgpGestReglas,
        plugins: filtrosreglas,
        clicksToEdit: 2,
        margins: '2 2 2 -4',
        sm: smGpGestReglas,
        cm: cmgpGestRegla,
        title: "Reglas",
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Reglas" : "Regla"]})'
        }),
        tbar: [btnAddRegla, btnGuardarRegla, btnEliminarRegla, '->', perfil.etiquetas.lbcbEjercicio, cbEjercicioRegla],
        bbar: new Ext.PagingToolbar({
            store: stgpGestReglas,
            displayInfo: true,
            items: ['-', btnLimpiarFiltrosRegla],
            listeners: {
                beforechange: function (p, e) {
                    offsetReglas = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function (sm) {
                campos_modificados.push({
                    idregla: sm.record.data.idregla,
                    valorcontrol: sm.record.data.valorcontrol,
                    nivelactividadbase: sm.record.data.nivelactividadbase
                });
                btnGuardarRegla.enable();
            },
            keypress: function (e) {
                if (e.getKey() == 46) {
                    eliminarReglas();
                }
            },
            //esto es para los campos editable en un grid
            beforeedit: function (cm) {
                if (!gestionSegunEstEjercicioActv) {
                    cm.cancel = true; //aki se deshabilita el editable en la columna que se kiere modificar
                } else {
                    cm.cancel = false; //aki se habilita el editable en la columna que se kiere modificar
                }
            }
        },
    });

    /*Fin del Constructor del Grid de Regla*/

    /*Funciones para las Reglas*/

    ventanaRegla = function (idnorma) {
        /*Constructor del grid Actividades - reglas*/
        idnormaselected = idnorma;
        var denactselec = smGpGestAct.getSelected().data.denominacion;

        filtrosActividadesReglas = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'codigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                    strEmptyText: ''
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }, {
                    type: 'list',
                    dataIndex: 'comportamiento',
                    options: [perfil.etiquetas.lbPropia,
                        perfil.etiquetas.lbDemandada,
                        perfil.etiquetas.lbCompartida]
                }, {
                    type: 'string',
                    dataIndex: 'idespecialidad'
                }/*, {
                 type: 'listado',
                 dataIndex: 'denespecialidad',
                 idcombo: 'idcbespregla',
                 valueFieldcb: 'id',
                 displayFieldcb: 'denominacion',
                 st: stEspecialidades,
                 autoload: false,
                 mode: 'local'
                 }*/
            ]
        });

        stgpActividadesReglas = new Ext.data.Store({
            url: 'listarActividadesAddRegla',
            listeners: {
                beforeload: function () {
                    cambiarTituloFiltrar(gpActividadesReglas, filtrosActividadesReglas, perfil.etiquetas.lbActividades);
                    stgpActividadesReglas.baseParams.idejercicio = cbEjercicioRegla.getValue();
                    stgpActividadesReglas.baseParams.idactividad = idactividadselecc;
                    stgpActividadesReglas.baseParams.idespecialidad = smGpGestAct.getSelected().data.idespecialidad;
                    stgpActividadesReglas.baseParams.idnorma = idnorma;
                    stgpActividadesReglas.baseParams.ultimonivel = ultimonivel;
                    stgpActividadesReglas.baseParams.start = offsetActvReglas;
                },
                load: function (st, rec, opt) {
                    if (st.getCount() == 0) {
                        if (filtrosActividadesReglas.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                        }
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idactividad'
            }, [{
                    name: 'idactividad'
                }, {
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'comportamiento'
                }, {
                    name: 'idespecialidad'
                }])
        });

        cmgpActividadesReglas = new Ext.grid.ColumnModel([{
                header: perfil.etiquetas.lbCodigo,
                tooltip: perfil.etiquetas.lbCodigo,
                dataIndex: 'codigo',
                width: 100,
                renderer: crearToolTip
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                dataIndex: 'denominacion',
                //width: 250,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbDescripcion,
                tooltip: perfil.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                width: 120,
                hidden: true,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbComportamiento,
                tooltip: perfil.etiquetas.lbComportamiento,
                dataIndex: 'comportamiento',
                width: 100,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbEspecialidad,
                tooltip: perfil.etiquetas.lbEspecialidad,
                dataIndex: 'idespecialidad',
                width: 120,
                renderer: renderEspecialidad
            }
        ]);
        cmgpActividadesReglas.defaultSortable = true;

        smgpActividadesReglas = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (sm) {
                    if (smgpActividadesReglas.getSelected()) {
                        denominacionregla.setValue(perfil.etiquetas.lbReglaDe + ': ' + denactselec + perfil.etiquetas.lbGenera + sm.getSelected().data.denominacion);
                    }
                }
            }
        });

        btnLimpiarActividadesReglas = new Ext.Button({
            id: 'btnLimpiarActividadesReglas',
            iconCls: 'limpiar',
            tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
            handler: function () {
                filtrosActividadesReglas.clearFilters();
            }
        });

        gpActividadesReglas = new Ext.grid.GridPanel({
            id: 'gpActividadesReglas',
            store: stgpActividadesReglas,
            sm: smgpActividadesReglas,
            cm: cmgpActividadesReglas,
            plugins: filtrosActividadesReglas,
            loadMask: {
                msg: perfil.etiquetas.lbEspere
            },
            region: 'center',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            height: 425,
            width: 750,
            margins: '2 2 2 -4',
            anchor: '100%',
            bbar: new Ext.PagingToolbar({
                store: stgpActividadesReglas,
                items: ['-', btnLimpiarActividadesReglas],
                displayInfo: true,
                listeners: {
                    beforechange: function (p, e) {
                        offsetActvReglas = e.start;
                    }
                }
            })
        });
        /*Fin del constructor del grid Actividades - reglas*/


        denominacionregla = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'denominacionregla',
            disabled: true,
            fieldLabel: perfil.etiquetas.lbDenominacion,
            anchor: '99%',
            regex: /^\S+/,
            allowBlank: false,
            blankText: perfil.etiquetas.lbRequerido
        });

        varcontrol = new Ext.form.NumberField({
            id: 'varcontrol',
            decimalPrecision: 6,
            minValue: 0.000001,
            maxValue: 100000000.999999,
            fieldLabel: perfil.etiquetas.lbVariableControl,
            anchor: '99%',
            value: 1,
            allowBlank: false,
            blankText: perfil.etiquetas.lbRequerido,
            prevTab: 'btnAceptaRregla'
        });

        nivBase = new Ext.form.NumberField({
            minValue: 1,
            maxValue: 999,
            value: 1,
            maxLength: 3,
            xtype: 'textfield',
            id: 'nivBase',
            fieldLabel: perfil.etiquetas.lbNivelBase,
            anchor: '99%',
            allowBlank: false,
            blankText: perfil.etiquetas.lbRequerido
        });

        fpAddRegla = new Ext.FormPanel({
            region: 'north',
            frame: true,
            autoHeight: true,
            labelAlign: 'top',
            items: [{
                    items: [{
                            layout: 'column',
                            items: [{
                                    layout: 'form',
                                    columnWidth: 0.7,
                                    items: denominacionregla
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.2,
                                    items: varcontrol
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.1,
                                    items: nivBase
                                }]
                        }]
                }/*, {
                 xtype: 'hidden',
                 name: 'idactividadquegenera',
                 id: 'idactividadquegenera'
                 }, {
                 xtype: 'hidden',
                 name: 'idactividadquegenera',
                 id: 'idactividadquegenera'
                 }*/]
        });

        winAddRegla = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            width: 750,
            layout: 'fit',
            items: [fpAddRegla, gpActividadesReglas],
            height: 555,
            title: perfil.etiquetas.lbAdicionarRegla,
            buttons: [{
                    iconCls: 'cancelar',
                    // id: 'btnCancelarAddRegla',
                    text: perfil.etiquetas.lbBtnCancelar,
                    tooltip: perfil.etiquetas.lbttCancelar,
                    handler: function () {
                        winAddRegla.destroy();
                    }
                }, {
                    iconCls: 'aplicar',
                    // id: 'btnAplicarAddRegla',
                    text: perfil.etiquetas.lbAplicar,
                    tooltip: perfil.etiquetas.lbttAplicar,
                    disabled: true,
                    handler: function () {
                        mensaje = perfil.etiquetas.msgAdicionandoregla;
                        adicionarRegla(true);
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'btnAceptarAddRegla',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbttAceptar,
                    disabled: true,
                    //  nextTab: 'denominacionregla',
                    handler: function () {
                        mensaje = perfil.etiquetas.msgAdicionandoregla;
                        adicionarRegla(false);
                    }
                }],
            listeners: {
                beforeshow: function () {
                    stgpActividadesReglas.load();
                    Ext.getCmp('varcontrol').focus(true, 500);
                }
            }
        });
        winAddRegla.show();
    }

    function adicionarRegla(aplicar) {
        myMaskActv.show(perfil.etiquetas.msgAdicionandoRegla, true);
        if (fpAddRegla.getForm().isValid()) {
            Ext.Ajax.request({
                url: 'adicionarRegla',
                //waitMsg: mensaje,
                params: {
                    idnorma: idnormaselected,
                    idactividad: idactividadselecc,
                    idactividaddestino: smgpActividadesReglas.getSelected().data.idactividad,
                    idejercicio: cbEjercicioRegla.getValue(),
                    denominacion: denominacionregla.getValue(),
                    valorcontrol: varcontrol.getValue(),
                    nivelbase: nivBase.getValue()
                },
                callback: function (options, success, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgN == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgReglaAdicionadaOk);
                        if (aplicar) {
                            stgpActividadesReglas.reload();
                        } else {
                            winAddRegla.destroy();
                            stgpGestReglas.reload();
                        }
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgReglaAdicionadaNo);
                    }
                }
            });
        } else {
            mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
        }
    }

    actualizarReglas = function () {
        myMaskActv.show(perfil.etiquetas.msgModificandoRegla, true);
        if (campos_modificados.length > 0) {
            Ext.Ajax.request({
                url: 'actualizarRegla',
                params: {
                    reglas: Ext.encode(campos_modificados)
                },
                callback: function (options, success, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgN > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgReglaModificadaOk);
                        stgpGestReglas.reload();
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgReglaModificadaNo);
                    }
                }
            });
            campos_modificados = [];
        }
    }

    eliminarReglas = function () {
        mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarRegla, eliminarReglasSeleccionadas);

        function eliminarReglasSeleccionadas(btnPresionado) {
            if (btnPresionado == 'ok') {
                myMaskActv.show(perfil.etiquetas.msgEliminandoRegla, true);
                var recordsSel = gpGestReglas.getSelectionModel().getSelections(), reglasElim = [];
                if (recordsSel.length > 0) {
                    for (var i = 0; i < recordsSel.length; i++)
                        reglasElim.push({
                            idregla: recordsSel[i].data.idregla
                        });
                    Ext.Ajax.request({
                        url: 'eliminarRegla',
                        params: {
                            reglas: Ext.encode(reglasElim)
                        },
                        callback: function (options, success, response) {
                            myMaskActv.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgN > 0) {
                                mostrarMensaje(1, perfil.etiquetas.msgEliminarReglaOk);
                                stgpGestReglas.reload();
                                /*stGpActividades.reload({
                                 params: {
                                 anode: null
                                 }
                                 });*/
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.msgEliminarReglaNo);
                            }
                        }
                    });
                }
            }
        }
    }

    upColorCell1 = function () {
        for (var i = 0; i < stgpGestReglas.getCount(); i++) {
            for (var j = 0; j < 5; j++) {
                if (stgpGestReglas.getAt(i).data.colorear == 1) {
                    Ext.get(gpGestReglas.getView().getCell(i, j))
                            .applyStyles('background-color: CCFFCC');
                }
            }
        }
    };

    function controlarObjetosReglas() {
        btnAddRegla.disable();
        btnGuardarRegla.disable();
        btnEliminarRegla.disable();
        gpGestReglas.getColumnModel().setEditable(cmgpGestRegla.findColumnIndex('valorcontrol'), false);
        gpGestReglas.getColumnModel().setEditable(cmgpGestRegla.findColumnIndex('nivelactividadbase'), false);
        if (gestionSegunEstEjercicioActv) {
            if (smGpGestAct.getSelections().length == 1) {
                if (smGpGestAct.getSelected().data.idaprobacion < 3 && smGpGestAct.getSelected().data.estado == 0) {
                    btnAddRegla.enable();
                    if (smGpGestReglas.getSelections().length > 0) {
                        btnEliminarRegla.enable();
                    } else {
                        btnEliminarRegla.disable();
                    }
                    gpGestReglas.getColumnModel().setEditable(cmgpGestRegla.findColumnIndex('valorcontrol'), true);
                    gpGestReglas.getColumnModel().setEditable(cmgpGestRegla.findColumnIndex('nivelactividadbase'), true);
                }
            }
        }
    }

    /*Fin de las funciones para las Reglas*/

}

