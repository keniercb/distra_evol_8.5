/**
 * 
 */

initBaseNorma = function () {
    /*Variables locales*/
    var valuecol = 0;
    var offsetAddNorma = 0;
    var offsetNorma = 0;
    /*Fin de las variables locales*/

    /*Elementos generales*/
    cbEjercicioNorma = new Ext.form.ComboBox({
        id: 'cbEjercicioNorma',
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
                stGpGestNorm.reload();
                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    gestionSegunEstEjercicioActv = false;
                } else {
                    gestionSegunEstEjercicioActv = true;
                }
            }
        }
    });
    /*Fin de los Elementos generales*/

    /*Botones del Grid de Norma*/
    btnAddNormasN = new Ext.Button({
        id: 'idbtnAddNormasN',
        iconCls: 'adicionar',
        disabled: true,
        tooltip: perfil.etiquetas.lbAdicionarNorma,
        handler: function () {
            ventanaAddNorma();
        }
    });
    btnGuardarNormasN = new Ext.Button({
        id: 'idbtnGuardarNormasN',
        iconCls: 'guardar',
        disabled: true,
        tooltip: perfil.etiquetas.lbGuardarNormas,
        handler: function () {
            actualizarNorma();
        }
    });
    btnEliminarNormasN = new Ext.Button({
        id: 'idbtnEliminarNormasN',
        iconCls: 'eliminar',
        disabled: true,
        tooltip: perfil.etiquetas.lbEliminarindicador,
        handler: function () {
            eliminarNormas();
        }
    });
    btnAddReglaN = new Ext.Button({
        id: 'idbtnAddReglaN',
        iconCls: 'adicionar',
        disabled: true,
        tooltip: perfil.etiquetas.lbBtnAdicionarRegla,
        handler: function () {
            ventanaRegla(gpGestNorm.getSelectionModel().getSelected().data.idnorma);
        }
    });
    btnLimpiarFiltrosnormas = new Ext.Button({
        id: 'btnLimpiarFiltrosnormas',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosnorma.clearFilters();
        }
    });
    /*Fin de los Botones del Grid de Norma*/

    /*Constructor del Grid de Norma*/
    tfimportetotalactividad = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotalactividad',
        anchor: '95%',
        align: 'right',
        disabled: false,
        maskRe: /^([.]+ ?[.]*)+$/,
        // regex : /^([0-9.]+ ?[0-9.]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.00'
    });
    filtrosnorma = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'codigo_ind_calculo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'nivelplanif',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [perfil.etiquetas.lbNo,
                    perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbRector]
            }, {
                type: 'numeric',
                dataIndex: 'cantplanif'
            }, {
                type: 'numeric',
                dataIndex: 'cantbase'
            }, {
                type: 'numeric',
                dataIndex: 'necesidad'
            }, {
                type: 'listado',
                dataIndex: 'idcentrobalance',
                idcombo: 'idcbcentrobalanceindicadornorma',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance',
                st: stCB,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'numeric',
                dataIndex: 'importedivisa'
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
                type: 'listado',
                dataIndex: 'idnaturaleza',
                idcombo: 'idcbnaturalezas',
                valueFieldcb: 'naturaleza',
                displayFieldcb: 'denominacion',
                st: stNaturaleza,
                autoload: false,
                mode: 'local'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }]
    });
    stGpGestNorm = new Ext.data.Store({
        url: 'listarNormas',
        listeners: {
            beforeload: function (st, opt) {
                cambiarTituloFiltrar(gpGestNorm, filtrosnorma, perfil.etiquetas.lbIndicadoresNorma + smGpGestAct.getSelected().data.denominacion);
                st.baseParams.idactividad = idactividadselecc = smGpGestAct.getSelected().data.idactividad;
                st.baseParams.idejercicio = cbEjercicioNorma.getValue();
                st.baseParams.start = offsetNorma;
            },
            load: function (st, rec, opt) {
                if (st.getCount() == 0) {
                    if (filtrosnorma.getFiltrosActivos().length > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    }
                }
                gpActividades.doLayout();
                calcularImporteTotalActividadGripNorma(st);
                controlarObjetosNormas();
                campos_modificados = [];
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idnorma'
        }, [{
                name: 'idnorma'
            }, {
                name: 'idactividad'
            }, {
                name: 'idindicador'
            }, {
                name: 'idnaturaleza'
            }, {
                name: 'nivelplanif'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'estado'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'cantplanif'
            }, {
                name: 'cantbase'
            }, {
                name: 'necesidad'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'importe'
            }, {
                name: 'importedivisa'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }])
    });
    cmnorma = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            width: 100,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNumPieza,
            tooltip: perfil.etiquetas.lbNumeroPieza,
            dataIndex: 'numeropieza',
            //width: 100,
            hidden: true,
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNaturaleza,
            tooltip: perfil.etiquetas.lbNaturaleza,
            dataIndex: 'idnaturaleza',
            width: 100,
            align: 'center',
            renderer: renderNaturaleza
        }, {
            header: perfil.etiquetas.lbCentroBalance,
            tooltip: perfil.etiquetas.lbCentroBalance,
            dataIndex: 'idcentrobalance',
            width: 100,
            hidden: true,
            renderer: renderCentroBalance
        }, {
            header: perfil.etiquetas.lbUnidadMedida,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            dataIndex: 'idumedida',
            //width: 100,
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbAprobado,
            tooltip: perfil.etiquetas.lbAprobado,
            dataIndex: 'idaprobacion',
            width: 60,
            align: 'center',
            renderer: modificarAprobacion
        }, {
            header: perfil.etiquetas.lbNivelPlanificacion,
            tooltip: perfil.etiquetas.lbNivelPlanificacion,
            dataIndex: 'nivelplanif',
            width: 100,
            align: 'center',
            renderer: renderNivelPlanif
        }, {
            header: perfil.etiquetas.lbActivado,
            tooltip: perfil.etiquetas.lbActivado,
            dataIndex: 'estado',
            width: 60,
            align: 'center',
            renderer: modificarEstado
        }, {
            header: perfil.etiquetas.lbPreciomn,
            tooltip: perfil.etiquetas.lbPreciomn,
            dataIndex: 'precio',
            //width: 100,
            align: 'right',
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbNorma,
            tooltip: perfil.etiquetas.lbNorma,
            dataIndex: 'cantplanif',
            width: 80,
            align: 'right',
            renderer: crearToolTipNro,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                invalidText: 'El valor debe ser mayor que 0',
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbBase,
            tooltip: perfil.etiquetas.lbBase,
            dataIndex: 'cantbase',
            width: 80,
            align: 'right',
            renderer: crearToolTipNro,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                invalidText: 'El valor debe ser mayor que 0',
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbNecesidad,
            tooltip: perfil.etiquetas.lbNecesidad,
            dataIndex: 'necesidad',
            width: 80,
            align: 'right',
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbImporte,
            tooltip: perfil.etiquetas.lbImporte,
            dataIndex: 'importe',
            width: 100,
            align: 'right',
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbPreciomlc,
            tooltip: perfil.etiquetas.lbPreciomlc,
            dataIndex: 'preciodivisa',
            width: 100,
            align: 'right',
            hidden: true,
            renderer: crearToolTipNro
        }, {
            header: perfil.etiquetas.lbImportemlc,
            tooltip: perfil.etiquetas.lbImportemlc,
            dataIndex: 'importedivisa',
            width: 100,
            align: 'right',
            hidden: true,
            renderer: crearToolTipNro
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
        }
    ]);
    cmnorma.defaultSortable = true;
    smGpGestNorm = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetosNormas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetosNormas();
            }
        }
    });
    gpGestNorm = new Ext.grid.EditorGridPanel({
        frame: true,
        id: 'gpGestNorm',
        autoExpandColumn: 'expandir',
        store: stGpGestNorm,
        plugins: filtrosnorma,
        clicksToEdit: 2,
        split: true,
        margins: '2 2 2 -4',
        sm: smGpGestNorm,
        cm: cmnorma,
        title: perfil.etiquetas.lbIndicadoresNorma,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        listeners: {
            afteredit: function (sm) {
                campos_modificados.push({
                    idnorma: sm.record.data.idnorma,
                    cantbase: sm.record.data.cantbase,
                    cantplanif: sm.record.data.cantplanif
                });
                columna = sm.column;
                btnGuardarNormasN.enable();
            },
            keypress: function (e) {
                if (e.getKey() == 46) {
                    eliminarNormas();
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
        tbar: [btnAddNormasN, btnGuardarNormasN, btnEliminarNormasN, '-', btnAddReglaN, '->', perfil.etiquetas.lbcbEjercicio, cbEjercicioNorma],
        bbar: new Ext.PagingToolbar({
            store: stGpGestNorm,
            displayInfo: true,
            items: ['-', {
                    xtype: 'tbtext', text: '<b>' + perfil.etiquetas.lbImporteTotal + '</b>'
                }, tfimportetotalactividad, '-', btnLimpiarFiltrosnormas],
            listeners: {
                beforechange: function (p, e) {
                    offsetNorma = e.start;
                }
            }
        })
    });
    /*Fin del Constructor del Grid de Norma*/

    /*Funciones para las Normas*/

    function renderCentroBalance(value, m) {
        valuecol = getRawValue(value, Ext.getCmp('idcbcentrobalanceindicadornorma'));
        m.attr = 'ext:qtip="' + valuecol + '"';
        return valuecol;
    }

    calcularImporteTotalActividadGripNorma = function (st) {
        if (st.getCount() > 0) {
            tfimportetotalactividad.setValue(st.reader.jsonData.importetotal);
        } else {
            tfimportetotalactividad.setValue('0.000');
        }
    }

    ventanaAddNorma = function () {
        filtrosindicadoresAddNorma = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'codigo_ind_calculo',
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
                    type: 'string',
                    dataIndex: 'numeropieza'
                }, {
                    type: 'listado',
                    dataIndex: 'idumedida',
                    idcombo: 'idcbunidadmedida',
                    valueFieldcb: 'idunidadmedida',
                    displayFieldcb: 'denominacionunidadmedida',
                    st: stum,
                    autoload: false,
                    mode: 'local'
                }, {
                    type: 'numeric',
                    dataIndex: 'precio'
                }, {
                    type: 'numeric',
                    dataIndex: 'preciodivisa'
                }, {
                    type: 'listado',
                    dataIndex: 'idcentrobalance',
                    idcombo: 'idcbcentrobalanceindicadornorma',
                    valueFieldcb: 'idcentrobalance',
                    displayFieldcb: 'centrobalance',
                    st: stCB,
                    autoload: false,
                    mode: 'local'
                }, {
                    type: 'listado',
                    dataIndex: 'idnaturaleza',
                    idcombo: 'idcbnaturalezaindicadornorma',
                    valueFieldcb: 'naturaleza',
                    displayFieldcb: 'denominacion',
                    st: stNaturaleza,
                    autoload: false,
                    mode: 'local'
                }]
        });
        checkColumnAddNorma = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (sm.getSelections().length > 0) {
                        btnAplicarAddNorma.enable();
                        btnAceptarAddNorma.enable();
                    } else {
                        btnAplicarAddNorma.disable();
                        btnAceptarAddNorma.disable();
                    }
                },
                rowdeselect: function (sm, indiceFila, record) {
                    if (sm.getSelections().length > 0) {
                        btnAplicarAddNorma.enable();
                        btnAceptarAddNorma.enable();
                    } else {
                        btnAplicarAddNorma.disable();
                        btnAceptarAddNorma.disable();
                    }
                }
            }
        });
        cmGpAddNorma = new Ext.grid.ColumnModel([checkColumnAddNorma, {
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
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbDescripcion,
                tooltip: perfil.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                hidden: true,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbNumPieza,
                tooltip: perfil.etiquetas.lbNumPieza,
                dataIndex: 'numeropieza',
                width: 120,
                hidden: true,
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbUnidadMedida,
                tooltip: perfil.etiquetas.lbUnidadMedida,
                dataIndex: 'idumedida',
                renderer: renderUM
            }, {
                header: perfil.etiquetas.lbPreciomn,
                tooltip: perfil.etiquetas.lbPreciomn,
                dataIndex: 'precio',
                width: 100,
                align: 'right',
                renderer: crearToolTipNro
            }, {
                header: perfil.etiquetas.lbPreciomlc,
                tooltip: perfil.etiquetas.lbPreciomlc,
                dataIndex: 'preciodivisa',
                width: 100,
                align: 'right',
                hidden: true,
                renderer: crearToolTipNro
            }, {
                header: perfil.etiquetas.lbCentroBalance,
                tooltip: perfil.etiquetas.lbCentroBalance,
                dataIndex: 'idcentrobalance',
                renderer: renderCB
            }, {
                header: perfil.etiquetas.lbNaturaleza,
                tooltip: perfil.etiquetas.lbNaturaleza,
                dataIndex: 'idnaturaleza',
                width: 100,
                renderer: renderNaturaleza
            }
        ]);
        cmGpAddNorma.defaultSortable = true;
        smGpAddNorma = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (sm.getSelections().length > 0) {
                        btnAplicarAddNorma.enable();
                        btnAceptarAddNorma.enable();
                    } else {
                        btnAplicarAddNorma.disable();
                        btnAceptarAddNorma.disable();
                    }
                },
                rowdeselect: function (sm, indiceFila, record) {
                    if (sm.getSelections().length > 0) {
                        btnAplicarAddNorma.enable();
                        btnAceptarAddNorma.enable();
                    } else {
                        btnAplicarAddNorma.disable();
                        btnAceptarAddNorma.disable();
                    }
                }
            }
        });
        stGpAddNorma = new Ext.data.Store({
            url: 'listarIndicadoresAddNorma',
            listeners: {
                beforeload: function () {
                    Ext.Ajax.timeout = 7200000;
                    cambiarTituloFiltrar(gpAddNorma, filtrosindicadoresAddNorma, perfil.etiquetas.lbIndicadores);
                    stGpAddNorma.baseParams.idactividad = idactividadselecc;
                    stGpAddNorma.baseParams.idejercicio = cbEjercicioNorma.getValue();
                    stGpAddNorma.baseParams.start = offsetAddNorma;
                },
                load: function (st, rec, opt) {
                    if (st.getCount() == 0) {
                        if (filtrosindicadoresAddNorma.getFiltrosActivos().length > 0) {
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
                id: 'idindicador'
            }, [{
                    name: 'idindicador'
                }, {
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'numeropieza'
                }, {
                    name: 'idnaturaleza'
                }, {
                    name: 'idcentrobalance'
                }, {
                    name: 'precio'
                }, {
                    name: 'preciodivisa'
                }, {
                    name: 'idumedida'
                }])
        });

        //********* Limpiar ****************
        btnLimpiarFiltrosInd = new Ext.Button({
            id: 'btnLimpiarFiltros',
            iconCls: 'limpiar',
            tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
            handler: function () {
                filtrosindicadoresAddNorma.clearFilters();
            }
        });
        gpAddNorma = new Ext.grid.GridPanel({
            id: 'gpAddNorma',
            frame: true,
            store: stGpAddNorma,
            master_column_id: 'mscolumn',
            sm: checkColumnAddNorma,
            region: 'center',
            root_title: perfil.etiquetas.lbGpRootTitle,
            autoExpandColumn: 'expandir',
            cm: cmGpAddNorma,
            plugins: filtrosindicadoresAddNorma,
            title: perfil.etiquetas.lbIndicadores,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            bbar: new Ext.PagingToolbar({
                store: stGpAddNorma,
                displayInfo: true,
                items: ['-', btnLimpiarFiltrosInd],
                listeners: {
                    beforechange: function (p, e) {
                        offsetAddNorma = e.start;
                    }
                }
            })
        });
        btnCancelarAddNorma = new Ext.Button({
            iconCls: 'cancelar',
            text: perfil.etiquetas.lbBtnCancelar,
            tooltip: perfil.etiquetas.lbttCancelar,
            handler: function () {
                winAddNorma.hide();
            }
        });
        btnAplicarAddNorma = new Ext.Button({
            iconCls: 'aplicar',
            text: perfil.etiquetas.lbBtnAplicar,
            tooltip: perfil.etiquetas.lbttAplicar,
            disabled: true,
            handler: function () {
                adicionarNormas(true);
            }
        });
        btnAceptarAddNorma = new Ext.Button({
            iconCls: 'aceptar',
            text: perfil.etiquetas.lbBtnAceptar,
            tooltip: perfil.etiquetas.lbttAceptar,
            disabled: true,
            handler: function () {
                adicionarNormas(false);
            }
        });
        winAddNorma = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            width: 960,
            layout: 'fit',
            items: gpAddNorma,
            constrain: true,
            height: 500,
            title: perfil.etiquetas.lbAdicionarNorma,
            listeners: {
                hide: function () {
                    //Alternar con la línea siguiente por un problema de rendimiento
                    //stGpActividades.reload();
                    stGpGestNorm.reload();
                },
                show: function () {
                    stGpAddNorma.load();
                }
            },
            buttons: [btnCancelarAddNorma, btnAplicarAddNorma, btnAceptarAddNorma]
        });
        winAddNorma.show();
    }

    adicionarNormas = function (aplicar) {
        var recordsSel = gpAddNorma.getSelectionModel().getSelections();
        var normasAdd = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                normasAdd.push({
                    idindicador: recordsSel[i].data.idindicador
                });
            myMaskActv.show(perfil.etiquetas.msgAdicionandoNorma, true);
            Ext.Ajax.request({
                url: 'adicionarNormas',
                params: {
                    normas: Ext.encode(normasAdd),
                    idactividad: idactividadselecc,
                    idejercicio: cbEjercicioNorma.getValue()
                },
                callback: function (options, success, response) {
                    myMaskActv.hide();
                    var responseData = Ext.decode(response.responseText);

                    if (responseData.codMsgN > 0) {
                        if (!aplicar) {
                            winAddNorma.hide();
                        } else {
                            stGpAddNorma.reload();
                            gpAddNorma.getSelectionModel().clearSelections();
                        }
                        smGpGestAct.selectRow(rowIndex_act);
                        mostrarMensaje(1, perfil.etiquetas.msgNormaAdicionadaOk);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNormaAdicionadaNo);
                        winAddNorma.hide();
                    }
                }
            });
        }
    }

    actualizarNorma = function () {
        myMaskActv.show(perfil.etiquetas.msgModificandoNorma, true);
        if (campos_modificados.length > 0) {
            Ext.Ajax.request({
                url: 'actualizarNorma',
                params: {
                    normas: Ext.encode(campos_modificados)
                },
                callback: function (options, success, response) {
                    myMaskActv.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgN > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNormaModificadaOk);
                        stGpGestNorm.reload();
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNormaModificadaNo);
                    }
                }
            });
            campos_modificados = [];
        }
    }

    eliminarNormas = function () {
        mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarNorma, eliminarNormasSeleccionadas);

        function eliminarNormasSeleccionadas(btnPresionado) {
            if (btnPresionado == 'ok') {
                myMaskActv.show(perfil.etiquetas.msgEliminandoNorma, true);
                var recordsSel = gpGestNorm.getSelectionModel().getSelections(), normasElim = [];
                if (recordsSel.length > 0) {
                    for (var i = 0; i < recordsSel.length; i++)
                        normasElim.push({
                            idnorma: recordsSel[i].data.idnorma
                        });
                    Ext.Ajax.request({
                        url: 'eliminarNorma',
                        params: {
                            normas: Ext.encode(normasElim)
                        },
                        callback: function (options, success, response) {
                            myMaskActv.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgN > 0) {
                                mostrarMensaje(1, perfil.etiquetas.msgEliminarNormaOk);
                                stGpGestNorm.reload();
                            } else {
                                mostrarMensaje(1, perfil.etiquetas.msgEliminarNormaNo);
                            }
                        }
                    });
                }
            }
        }
    }

    function controlarObjetosNormas() {
        btnAddNormasN.disable();
        btnGuardarNormasN.disable();
        btnEliminarNormasN.disable();
        btnAddReglaN.disable();
        gpGestNorm.getColumnModel().setEditable(cmnorma.findColumnIndex('cantplanif'), false);
        gpGestNorm.getColumnModel().setEditable(cmnorma.findColumnIndex('cantbase'), false);
        if (gestionSegunEstEjercicioActv) {
            if (smGpGestAct.getSelections().length == 1) {
                if (smGpGestAct.getSelected().data.idaprobacion < 3 && smGpGestAct.getSelected().data.estado == 0) {
                    btnAddNormasN.enable();
                    if (smGpGestNorm.getSelections().length > 0) {
                        btnEliminarNormasN.enable();
                    } else {
                        btnEliminarNormasN.disable();
                    }
                    if (smGpGestNorm.getSelections().length == 1) {
                        btnAddReglaN.enable();
                    } else {
                        btnAddReglaN.disable();
                    }
                    gpGestNorm.getColumnModel().setEditable(cmnorma.findColumnIndex('cantplanif'), true);
                    gpGestNorm.getColumnModel().setEditable(cmnorma.findColumnIndex('cantbase'), true);
                }
            }
        }
    }

    /*Fin de las funciones para las Normas*/

}

