agregarmodificarplan = function () {

}

function winFp(accion) {
    mymask.show();
    listasalva = [];
    listasalvacod = [];

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function () {
            auxslva = [];
            ventanaCrud.destroy();
        }
    });

    btnAplicarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        disabled: true,
        id: 'btnAplicarAdd',
        text: perfil.etiquetas.lbtnAplicarAdd,
        tooltip: perfil.etiquetas.lbTtAplicarAdd,
        handler: function () {
            if (pfinal.getForm().isValid()) {
                AdicionarModificar(accion);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    btnAceptarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarAdd',
        text: perfil.etiquetas.lbtnAceptarAdd,
        tooltip: perfil.etiquetas.lbTtAceptarAdd,
        handler: function () {
            if (pfinal.getForm().isValid()) {
                accionboton = 2;
                AdicionarModificar(accion);
                auxslva = [];
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    montototalasig = new Ext.form.TextField({
        allowNegative: true,
        fieldLabel: perfil.etiquetas.lbLabelMonto,
        //decimalPrecision: 2,
        regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
        allowBlank: false,
        maxLength: 30,
        with : '100',
        listeners: {
            change: function (me, nv, ov) {
                //console.log(nv);
                montototalasig.setValue(addCommas(nv));
            }
        }
    });

    stComboEjercicios = new Ext.data.Store({
        url: 'listarEjerc',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'ejercicio'
            }, {
                name: 'idejercicio'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                var annoactual = new Date();
                stComboEjercicios.baseParams.annoact = annoactual.getFullYear();
                stComboEjercicios.baseParams.tipoplan = cbTipoPlan.getValue();
            },
            load: function (mi, st, obj) {
                lonejerc = st.length;
                if (st.length == 0) {
                    mostrarMensaje(2, 'No existen ejercicios disponibles para crear algún plan');
                    cbDenominacionEjercicio.disable();
                    cbEmpresasImp.disable();
                    montototalasig.disable();
                    btnAplicarAdd.hide();
                    btnAceptarAdd.hide();
                }
            }
        }
    });

    cbDenominacionEjercicio = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        id: '111cbDenominacionEjercicio',
        fieldLabel: perfil.etiquetas.lbLabelDen,
        store: stComboEjercicios,
        disabled: accion == 2 ? true : false,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        triggerAction: 'all',
        loadingText: 'Cargando datos...',
        allowBlank: false,
        selectOnFocus: false,
        blankText: 'Este campo es obligatorio',
        readOnly: true,
        mode: 'local',
        anchor: '92%'
    });

    stEmpresaImp = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stEmpresaImp.baseParams.uri = 3;
                stEmpresaImp.baseParams.tipoplan = cbTipoPlan.getValue();
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });

    cbEmpresasImp = new Ext.form.ComboBox({
        id: 'idcbEmpresasImp',
        emptyText: 'Seleccione',
        fieldLabel: 'Importadora',
        width: 150,
        disabled: false,
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                pPlanificacion.enable();
                var auxstore = null;
                var band1 = false;
                if (auxslva.length > 0) {
                    for (var i = 0; i < auxslva.length; i++) {
                        if (auxslva[i][1] == rec.data.iddatos) {
                            auxstore = new Ext.data.JsonStore({
                                storeId: 'Storedetalles',
                                data: auxslva[i][0],
                                autoLoad: true,
                                fields: app.readerDina
                            });
                            band1 = true;
                        }
                    }
                    if (band1 == true) {
                        gpFFyCC.reconfigure(auxstore, cmFFyCC);
                    }
                }
                if (band1 == false) {
                    //gpFFyCC.reconfigure(stFFyCC, cmFFyCC);

                }
                stFFyCC.reload();

            }
        }
    });

    /**
     * Panel izquierdo con los codigos y sus montos
     */
    btnGuardarDist = new Ext.Button({
        handler: function () {
            guardarCod();
        },
        tooltip: 'Guardar distribución',
        disabled: true,
        id: 'btnGuardarDist',
        iconCls: 'guardar',
    });

    titulopanel = new Ext.form.Label({
        id: 'titulopanel',
        text: 'Distribución del monto asignado al plan'
    });

    //store del grid de FF y CC 
    stFFyCC = new Ext.data.Store({
        //autoLoad: true,
        url: 'listarFFyCC',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idplanfuentescc"
        }, [{
                name: 'idplanfuentescc'
            }, {
                name: 'iddatoscodigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'monto'
            }]
                ),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stFFyCC.baseParams.start = offset;
                stFFyCC.baseParams.idempimp = cbEmpresasImp.getValue();
                if (accion == 2) {
                    stFFyCC.baseParams.accion = accion;
                    stFFyCC.baseParams.idejercicio = smGpGestPlanes711.getSelected().data.idejercicio;
                    stFFyCC.baseParams.idplan711 = smGpGestPlanes711.getSelected().data.idplan711;
                }
            },
            load: function (me, st, obj) {
                if (accion == 2) {
                    stProdIndMod.reload();
                }
            }
        }
    });

    stFFyCCSalva = new Ext.data.SimpleStore({
        fields: [{
                name: 'idplanfuentescc'
            }, {
                name: 'iddatoscodigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'monto'
            }]
    });

    smFFyCC = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (x, num, rec) {
                pPlanificacionCodigos.enable();
                btnAdicionarIndProd.enable()
                CargarDetalles(rec);
            }
        }
    });

    cmFFyCC = new Ext.grid.ColumnModel([{
            header: 'Códigos de distribución',
            tooltip: 'Códigos de distribución',
            dataIndex: 'denominacion',
            id: 'expandir',
            width: 100,
            align: 'left'
        }, {
            header: 'Monto',
            tooltip: 'Monto',
            dataIndex: 'monto',
            width: 150,
            align: 'rigth',
            renderer: RenderaddCommas,
            editor: new Ext.form.TextField({
                allowNegative: true,
                regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                allowBlank: false,
                maxLength: 30,
                listeners: {
                    change: function (me, nv, ov) {
                        me.setValue(addCommas(nv));
                    }
                }
            })
        }
    ]);

    gpFFyCC = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stFFyCC,
        sm: smFFyCC,
        enable: true,
        autoExpandColumn: 'expandir',
        cm: cmFFyCC,
        loadMask: {
            msg: 'Cargando las planificaciones...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpFFyCC.getColumnModel().setEditable(col_id, true);
            },
            afteredit: function (e) {
                btnGuardarDist.enable();
            }
        }
    });

    pPlanificacion = new Ext.Panel({
        layout: 'fit',
        region: 'west',
        frame: true,
        tbar: [titulopanel, '->', btnGuardarDist],
        disabled: true,
        width: 300,
        height: 250,
        items: gpFFyCC
    });

    /**
     * Panel derecho con los desgloses de los montos
     */
    stProdIndMod = new Ext.data.Store({
        url: 'listarDistribucionCod',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'iddistribucioncod'
            }, {
                name: 'idproducto711'
            }, {
                name: 'denominacion'
            }, {
                name: 'cantidad'
            }, {
                name: 'precio'
            }, {
                name: 'valor'
            }, {
                name: 'iddatoscodigo'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stProdIndMod.removeAll();
                stProdIndMod.baseParams.idplan711 = smGpGestPlanes711.getSelected().data.idplan711;
            },
            load: function (me, st, obj) {
                CargarDetallesModificar(st);
            }
        }
    });

    stProdInd = new Ext.data.SimpleStore({
        fields: [{
                name: 'iddistribucioncod'
            }, {
                name: 'iddatoscodigo'
            }, {
                name: 'idproducto711'
            }, {
                name: 'denominacion'
            }, {
                name: 'cantidad'
            }, {
                name: 'precio'
            }, {
                name: 'valor'
            }
        ]
    });

    //Este ColumnModel es para utilizar en el grid cuando se adicionan indicadores del codigo 100
    cmProdIndCod100 = new Ext.grid.ColumnModel([
        {
            header: "Denominación",
            dataIndex: 'denominacion',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Cantidad",
            tooltip: "Cantidad",
            dataIndex: 'cantidad',
            width: 100,
            renderer: crearToolTip
        }, {
            header: "Precio",
            tooltip: "Precio",
            dataIndex: 'precio',
            width: 100,
            renderer: crearToolTip
        }, {
            header: "Valor",
            tooltip: "Valor",
            dataIndex: 'valor',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas,
            editor: new Ext.form.TextField({
                allowNegative: true,
                regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                allowBlank: false,
                maxLength: 30,
                listeners: {
                    change: function (me, nv, ov) {
                        me.setValue(addCommas(nv));
                    }
                }
            })
        }
    ]);

    cmProdInd = new Ext.grid.ColumnModel([
        {
            header: "Denominación",
            dataIndex: 'denominacion',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Cantidad",
            tooltip: "Cantidad",
            dataIndex: 'cantidad',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 2,
                allowBlank: false,
                maxLength: 19
            })
        }, {
            header: "Precio",
            tooltip: "Precio",
            dataIndex: 'precio',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas,
            editor: new Ext.form.TextField({
                allowNegative: true,
                regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                allowBlank: false,
                maxLength: 30,
                listeners: {
                    change: function (me, nv, ov) {
                        me.setValue(addCommas(nv));
                    }
                }
            })
        }, {
            header: "Valor",
            tooltip: "Valor",
            dataIndex: 'valor',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas
        }
    ]);

    smProdInd = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (x, num, rec) {
                btnEliminarIndProd.enable();
            },
            rowdeselec: function (x, num, rec) {
                btnEliminarIndProd.disable();
            }
        }
    });

    btnAdicionarIndProd = new Ext.Button({
        iconCls: 'adicionar',
        tooltip: 'Adicionar indicador o producto',
        disabled: true,
        handler: function () {
            SeleccionarProductos(smFFyCC.getSelected().data.denominacion);
        }
    });
    btnEliminarIndProd = new Ext.Button({
        iconCls: 'eliminar',
        tooltip: 'Eliminar indicador o producto',
        disabled: true,
        handler: function () {
            EliminarIndProd();
        }
    });

    btnGuaradarProdInd = new Ext.Toolbar.Button({
        tooltip: 'Guaradar cambios previos',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            guardarRelCodInd();
            btnGuaradarProdInd.disable();
            btnAceptarAdd.enable();
        }
    });

    gpProdInd = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stProdInd,
        sm: smProdInd,
        disabled: false,
        autoExpandColumn: 'expandir',
        cm: cmProdInd,
        //tbar: [btnAdicionarIndProd, /*btnDelProdInd,*/ btnGuaradarProdInd],
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpProdInd.getColumnModel().setEditable(col_id, true);
            },
            afteredit: function (e) {
                btnGuaradarProdInd.enable();
                if (smFFyCC.getSelected().data.denominacion != '100.0.00') {
                    if (e.field == 'cantidad') {
                        valor = parseFloat(e.record.data.cantidad) * parseFloat('' + e.record.data.precio.replace(/,/g, ''));
                        smProdInd.selectRow(e.row);
                        smProdInd.getSelected().data.valor = parseFloat(valor).toFixed(6);
                        smProdInd.getSelected().commit();
                        smProdInd.selectNext();
                    }
                    if (e.field == 'precio') {
                        valor = parseFloat(e.record.data.cantidad) * parseFloat('' + e.record.data.precio.replace(/,/g, ''));
                        smProdInd.selectRow(e.row);
                        smProdInd.getSelected().data.valor = parseFloat(valor).toFixed(6);
                        smProdInd.getSelected().commit();
                        smProdInd.selectNext();
                    }
                }
            }
        }
    });

    titulopanel2 = new Ext.form.Label({
        id: 'titulopanel2',
        text: 'Distribución del monto asignado a los indicadores por códigos'
    });
    total1 = new Ext.form.Label({
        text: '0.00'
    });
    total2 = new Ext.form.Label({
        text: '0.00'
    });

    pPlanificacionCodigos = new Ext.Panel({
        layout: 'fit',
        region: 'center',
        frame: true,
        tbar: [titulopanel2, '->', btnAdicionarIndProd, btnEliminarIndProd, btnGuaradarProdInd],
        disabled: true,
        width: 680,
        height: 250,
        items: gpProdInd,
        bbar:['->','Suma total:', total1, '-','Falta por planificar:',total2]
    });
    //fin


    /**
     * Parte para cuando sea modifcar guardar un motivo de modificacion
     */
    textmotivo = new Ext.form.TextArea({
        id: 'idtextmotivo',
        allowBlank: false,
        emptyText: 'Argumentos de motivo'
    });

    //panel para escribir los motivos
    pMotivo = new Ext.Panel({
        layout: 'fit',
        region: 'center',
        frame: true,
        title: 'Motivos',
        //margins: '3 3 3 3',
        //width: 300,
        height: 200,
        items: textmotivo
    });

    var h = 400;
    if (accion != 2) {
        //panel para mostrar todos los elementos de la ventana add
        pfinal = new Ext.FormPanel({
            id: 'pfinal',
            frame: true,
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: [cbDenominacionEjercicio]
                        }, {
                            columnWidth: 0.4,
                            layout: 'form',
                            items: cbEmpresasImp
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: montototalasig
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: pPlanificacion
                        }, {
                            columnWidth: 0.7,
                            layout: 'form',
                            items: pPlanificacionCodigos
                        }]

                }]
        });
        ventanaCrud = null;
        ventanaCrud = new Ext.Window({
            title: 'Adicionar plan',
            id: 'ventanaCrud',
            width: 1000,
            constrain: true,
            layout: 'fit',
            height: h,
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarAdd/*, btnAplicarAdd*/, btnAceptarAdd],
            items: [pfinal],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
        ventanaCrud.show();
        stComboEjercicios.reload();
        mymask.hide();

    } else {
        h = 500;
        idplan711modif = smGpGestPlanes711.getSelected().data.idplan711;
        ventanaCrud = null;
        //panel para mostrar todos los elementos de la ventana modificar
        pfinal = new Ext.FormPanel({
            id: 'pfinal',
            frame: true,
            //margins: '3 3 3 3',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: [cbDenominacionEjercicio]
                        }, {
                            columnWidth: 0.4,
                            layout: 'form',
                            items: cbEmpresasImp
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: montototalasig
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: pPlanificacion
                        }, {
                            columnWidth: 0.7,
                            layout: 'form',
                            items: pPlanificacionCodigos
                        }, {
                            columnWidth: 1,
                            layout: 'form',
                            items: pMotivo
                        }]

                }]
        });
        cbDenominacionEjercicio.setValue(smGpGestPlanes711.getSelected().data.ejercicio);
        montototalasig.setValue(addCommas(smGpGestPlanes711.getSelected().data.montototal));

        ventanaCrud = new Ext.Window({
            title: 'Modificar plan',
            id: 'ventanaCrudMod',
            width: 1000,
            layout: 'fit',
            constrain: true,
            height: h,
            frame: true,
            resizable: false,
            modal: true,
            autoValidate: false,
            items: [pfinal],
            closeAction: 'destroy',
            buttons: [btnCancelarAdd, btnAceptarAdd],
            listeners: {
                beforeshow: function (win) {

                }
            }
        });
        //btnAceptarAdd.disable();
        ventanaCrud.show();
        mymask.hide();

    }
}

function AdicionarModificar(accion) {
    var montototal = parseFloat(montototalasig.getValue().replace(/,/g, ''));
    var motivo = '';
    if (accion == 2) {
        motivo = textmotivo.getValue();
    }
    //relcodin-->relacion codigo-indicadores
    //si los conceptos de compra son iguales
    mymask.show();
    if (btnGuardarDist.disabled && btnGuaradarProdInd.disabled) {
        Ext.Ajax.request({
            url: 'adicionarModificarPlan',
            params: {
                ejercicio: cbDenominacionEjercicio.getValue(),
                montototal: montototal,
                distribuc: Ext.encode(listasalvacod),
                relcodind: Ext.encode(listasalva),
                planactual: 'false',
                accion: accion,
                idempimp: cbEmpresasImp.getValue(),
                motivo: motivo,
                idp711: idplan711modif,
                tipoplan: cbTipoPlan.getValue()
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    var postaccion = (accion == 1) ? 'adicionado' : 'modificado';
                    mostrarMensaje(1, 'El plan se ha ' + postaccion + ' satisfactoriamente');
                    gpFFyCC.reconfigure(stFFyCC, cmFFyCC);
                    stFFyCC.reload();
                    stGpGestPlanes711.reload();
                    stComboEjercicios.reload();
                    montototalasig.setValue(null);
                    if (accionboton == 2) {
                        ventanaCrud.destroy();
                    }
                    cbDenominacionEjercicio.reset()
                    auxslva = [];
                } else {
                    var verboaccion = (accion == 1) ? 'adicionar' : 'modificar';
                    mostrarMensaje(2, responseData.mensaje);
                }
            }
        });
    } else {
        mostrarMensaje(2, 'Falta por guardar algún dato parcialmente');
    }

}

function SeleccionarProductos(tipo) {
    offsetproductos = 0;
    btnCancelarSel = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarSel',
        tooltip: perfil.etiquetas.lbTtCancenlarSol,
        text: 'Cancelar',
        handler: function () {
            ventanaProductos.hide()
        }
    });

    btnAceptarSel = new Ext.Button({
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarSel',
        text: 'Aceptar',
        tooltip: perfil.etiquetas.lbTtAceptarSol,
        handler: function () {
            SeleccionarProdInd(tipo);
            ventanaProductos.hide();
        }
    });

    btnLimpiarProductosSel = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarProductosSel',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtrosProductosSel.clearFilters();
        }
    });

    btnAdicionarProd = new Ext.Button({
        iconCls: 'adicionar',
        id: 'btnAdicionarProd',
        text: 'Adicionar producto',
        tooltip: 'Adicionar producto',
        //disabled: false,
        handler: function () {
            winFpProductos();
        }
    });

    //Parte para seleccionar productos
    checkProductosSel = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                if (checkProductosSel.getSelections().length >= 1) {
                    btnAceptarSel.enable();
                    //Ext.getCmp('btnaceptarasoc').enable();
                }

            },
            rowdeselect: function () {
                if (checkProductosSel.getSelections().length < 1) {
                    btnAceptarSel.disable();
                    //Ext.getCmp('btnaceptarasoc').disable();
                }

            }
        }
    });

    ventanaProductos = null;

    if (tipo != '100.0.00') {
        crearIUAddIndicadores();
    } else {
        //Elementos del grid para indicadores
        cmProductosInd = new Ext.grid.ColumnModel([checkProductosSel,
            {
                width: 150,
                id: 'expandir',
                sortable: true,
                header: 'Denominación',
                tooltip: 'Denominación',
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: 'Código',
                tooltip: 'Código',
                width: 80,
                sortable: true,
                dataIndex: 'codigo',
                renderer: crearToolTip
            }, {
                width: 50,
                header: 'Clasificación',
                tooltip: 'Clasificación',
                dataIndex: 'clasificacion',
                sortable: true,
                renderer: crearToolTip
            }]);

        filtrosProductosInd = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'codigo'
                }, {
                    type: 'string',
                    dataIndex: 'clasificacion'
                }]
        });
        stProductosInd = new Ext.data.Store({
            url: 'listarProductos',
            autoLoad: true,
            listeners: {
                beforeload: function () {
                    stProductosInd.baseParams.start = offsetproductos;
                    stProductosInd.baseParams.iddatoscodigo = tipo;
                },
                load: function (mi, record) {
                    //                cambiarTituloFiltrar(gpProductosSel, filtrosProductosSel, perfil.etiquetas.lbGridEquip);
                    //                stact = record.length;
                    //controlarObjetosEquipoiacion();
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "data",
                id: "iddepreciacionequipo"
            }, [{
                    name: 'idproducto711'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'codigo'
                }, {
                    name: 'clasificacion'
                }])
        });

        gpProductosSel = new Ext.grid.GridPanel({
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            id: 'gpProductosSel',
            store: stProductosInd,
            plugins: filtrosProductosInd,
            sm: checkProductosSel,
            cm: cmProductosInd,
            frame: true,
            layout: 'fit',
            autoExpandColumn: 'expandir',
            height: 400,
            width: 500,
            margins: '2 2 2 2',
            //anchor: '95%',
            title: perfil.etiquetas.lbGridEquip,
            bbar: new Ext.PagingToolbar({
                store: stProductosInd,
                displayInfo: true,
                items: ['-', btnLimpiarProductosSel],
                listeners: {
                    beforechange: function (p, e) {
                        offsetproductos = e.start;
                    }
                }
            })
        });

        //fin del panel de productos  
        ventanaProductos = new Ext.Window({
            title: 'Seleccionar productos',
            width: 500,
            constrain: true,
            layout: 'fit',
            height: 400,
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarSel, btnAceptarSel],
            items: [gpProductosSel],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });

        ventanaProductos.show();
    }

}

//Agregar al grid los indicadores o productos seleccionados
function SeleccionarProdInd(tipo) {
    prodind = [];

    cont = 1;
    auxLsiexiste = gpProdInd.getStore().data.items.length;
    if (auxLsiexiste > 0) {
        for (var i = 0; i < auxLsiexiste; i++) {
            prodind.push([
                gpProdInd.getStore().data.items[i].data.iddistribucioncod,
                gpProdInd.getStore().data.items[i].data.iddatoscodigo,
                gpProdInd.getStore().data.items[i].data.idproducto711,
                gpProdInd.getStore().data.items[i].data.denominacion,
                gpProdInd.getStore().data.items[i].data.cantidad,
                gpProdInd.getStore().data.items[i].data.precio,
                gpProdInd.getStore().data.items[i].data.valor
            ]);
            cont++;
        }
    }
    if (tipo != '100.0.00') {
        auxL = prodindmaestros.length;
        console.log(prodindmaestros);
        for (var i = 0; i < auxL; i++) {
            prodind.push([
                cont,
                prodindmaestros[i][1],
                prodindmaestros[i][2],
                prodindmaestros[i][3],
                0,
                prodindmaestros[i][5],
                0,
            ]);
            cont++;
        }
        stProdInd.loadData(prodind);
        gpProdInd.reconfigure(stProdInd, cmProdInd);
    } else {
        auxL = gpProductosSel.getSelectionModel().getCount();
        for (var i = 0; i < auxL; i++) {
            prodind.push([
                cont,
                smFFyCC.getSelected().data.iddatoscodigo,
                gpProductosSel.getSelectionModel().getSelections()[i].data.idproducto711,
                gpProductosSel.getSelectionModel().getSelections()[i].data.denominacion,
                null,
                null,
                0,
            ]);
            cont++;
        }
        stProdInd.loadData(prodind);
        gpProdInd.reconfigure(stProdInd, cmProdIndCod100);
    }
    btnGuaradarProdInd.disable();
}

//Eliminar un indicador o producto
function EliminarIndProd() {
    prodind = [];
    auxLsiexiste = gpProdInd.getStore().data.items.length;
    console.log(gpProdInd.getStore().data.items);
    for (var i = 0; i < auxLsiexiste; i++) {
        if (gpProdInd.getStore().data.items[i].data.iddistribucioncod != smProdInd.getSelected().data.iddistribucioncod) {
            prodind.push([
                gpProdInd.getStore().data.items[i].data.iddistribucioncod,
                gpProdInd.getStore().data.items[i].data.iddatoscodigo,
                gpProdInd.getStore().data.items[i].data.idproducto711,
                gpProdInd.getStore().data.items[i].data.denominacion,
                gpProdInd.getStore().data.items[i].data.cantidad,
                gpProdInd.getStore().data.items[i].data.precio,
                gpProdInd.getStore().data.items[i].data.valor
            ]);
        }
    }
    stProdInd.loadData(prodind);
    //gpProdInd.reconfigure(stProdInd, cmProdInd);
    guardarRelCodInd();
    btnAceptarAdd.enable();
}

//Guardar relacion de codigos e indicadores
function guardarRelCodInd() {

    auxLista = [];
    auxL = gpProdInd.getStore().data.items.length;
    valoraux = 0;
    for (var i = 0; i < auxL; i++) {
        auxLista.push([
            gpProdInd.getStore().data.items[i].data.iddistribucioncod,
            gpProdInd.getStore().data.items[i].data.iddatoscodigo,
            gpProdInd.getStore().data.items[i].data.idproducto711,
            gpProdInd.getStore().data.items[i].data.denominacion,
            gpProdInd.getStore().data.items[i].data.cantidad,
            gpProdInd.getStore().data.items[i].data.precio,
            gpProdInd.getStore().data.items[i].data.valor
        ]);
        auxvalor = '' + gpProdInd.getStore().data.items[i].data.valor;
        valoraux += parseFloat(auxvalor.replace(/,/g, ''));
        
    }
    totalcod = parseFloat(smFFyCC.getSelected().data.monto.replace(/,/g, ''));
    total1.setText(addCommas(parseFloat(valoraux).toFixed(6)));
    var resta= ((totalcod)-(valoraux)).toFixed(2);
    total2.setText(addCommas(resta));
    
    if (parseFloat(valoraux) <= parseFloat(totalcod)) {
        if (listasalva.length == 0) {
            listasalva.push([[smFFyCC.getSelected().data.iddatoscodigo], auxLista]);
        } else {
            band = true;
            for (var i = 0; i < listasalva.length; i++) {
                if (listasalva[i][0] == smFFyCC.getSelected().data.iddatoscodigo) {
                    listasalva[i][1] = auxLista;
                    band = false;
                }
            }
            if (band == true) {
                listasalva.push([[smFFyCC.getSelected().data.iddatoscodigo], auxLista]);
            }
        }
        if (smFFyCC.getSelected().data.denominacion != '100.0.00') {
            stProdInd.loadData(auxLista);
            //gpProdInd.reconfigure(stProdInd, cmProdInd);
            btnGuaradarProdInd.disable();
        }
        if (smFFyCC.getSelected().data.denominacion == '100.0.00') {
            stProdInd.loadData(auxLista);
            //gpProdInd.reconfigure(stProdInd, cmProdIndCod100);
            btnGuaradarProdInd.disable();
        }
        //guardarCod();
        //gpProdInd.getStore().removeAll();
    } else {
        mostrarMensaje(1, 'La suma de los valores supera la asignada al código');
    }
}

function guardarCod() {
    listasalvacod = [];
    montoaux = 0;
    auxL = gpFFyCC.getStore().data.items.length;
    for (var i = 0; i < auxL; i++) {
        listasalvacod.push([
            gpFFyCC.getStore().data.items[i].data.idplanfuentescc,
            gpFFyCC.getStore().data.items[i].data.iddatoscodigo,
            gpFFyCC.getStore().data.items[i].data.denominacion,
            gpFFyCC.getStore().data.items[i].data.monto
        ]);
        montoaux += parseFloat(('' + gpFFyCC.getStore().data.items[i].data.monto).replace(/,/g, ''));
    }
    total = parseFloat(montototalasig.getValue().replace(/,/g, ''));
    if (montoaux == total) {
        stFFyCCSalva.loadData(listasalvacod);
        //gpFFyCC.reconfigure(stFFyCCSalva, cmFFyCC);
        btnGuardarDist.disable();
        btnGuaradarProdInd.disable();
        btnAceptarAdd.enable();
        btnAdicionarIndProd.disable();
        //gpFFyCC.getSelectionModel().clearSelections();
    } else {
        mostrarMensaje(2, 'El monto distribuido en los códigos no es igual al asignado');
    }
}

function CargarDetalles(rec) {
    vacia = [];
    stProdInd.loadData(vacia);
    if (listasalva.length != 0) {
        for (var i = 0; i < listasalva.length; i++) {
            if (listasalva[i][0] == smFFyCC.getSelected().data.iddatoscodigo) {
                stProdInd.loadData(listasalva[i][1]);
                break;
            }
        }
    }
    if (rec.data.denominacion != "100.0.00") {
        gpProdInd.reconfigure(stProdInd, cmProdInd);
    }
    if (rec.data.denominacion == "100.0.00") {
        gpProdInd.reconfigure(stProdInd, cmProdIndCod100);
    }
}

function CargarDetallesModificar(str) {
    auxLista = [];
    auxL1 = str.length;
    auxL2 = gpFFyCC.getStore().data.items.length;

    for (var j = 0; j < auxL2; j++) {
        auxLista = [];
        for (var i = 0; i < auxL1; i++) {
            if (str[i].data.iddatoscodigo == gpFFyCC.getStore().data.items[j].data.iddatoscodigo) {
                auxLista.push([
                    str[i].data.iddistribucioncod,
                    str[i].data.iddatoscodigo,
                    str[i].data.idproducto711,
                    str[i].data.denominacion,
                    str[i].data.cantidad,
                    str[i].data.precio,
                    str[i].data.valor
                ]);
            }
        }
        listasalva.push([[gpFFyCC.getStore().data.items[j].data.iddatoscodigo], auxLista]);
    }
}

function winFpProductos(accion) {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function () {
            ventanaCrudProd.destroy();
        }
    });

    btnAplicarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        disabled: true,
        id: 'btnAplicarAdd',
        text: perfil.etiquetas.lbtnAplicarAdd,
        tooltip: perfil.etiquetas.lbTtAplicarAdd,
        handler: function () {
            if (pfinalP.getForm().isValid()) {
                AdicionarProductos(accion, 1);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    btnAceptarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarAdd',
        text: perfil.etiquetas.lbtnAceptarAdd,
        tooltip: perfil.etiquetas.lbTtAceptarAdd,
        handler: function () {
            if (pfinalP.getForm().isValid()) {
                AdicionarProductos(accion, 2);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

//*****Elementos de la ventana para adicionar personas**********
    stUnidaMedida = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stUnidaMedida.baseParams.uri = 7;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });

    cbUnidaMedida = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        id: '111cbUnidaMedida ',
        fieldLabel: 'Unida de Medida',
        store: stUnidaMedida,
        displayField: 'denominacion',
        valueField: 'iddatos',
        triggerAction: 'all',
        loadingText: 'Cargando datos...',
        allowBlank: false,
        selectOnFocus: false,
        blankText: 'Este campo es obligatorio',
        readOnly: true,
        mode: 'local',
        width: 200,
        listeners: {
            select: function (cb, rec, num) {

            }
        }
    });

    stEmpresaImp = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stEmpresaImp.baseParams.uri = 3;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });

    cbEmpresasImp = new Ext.form.ComboBox({
        //id: 'idcbEmpresasImp',
        emptyText: 'Seleccione',
        fieldLabel: 'Empresa importadora',
        width: 200,
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        disabled: accion == 2 ? true : false,
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
            }

        }
    });

    Denominacion = new Ext.form.TextField({
        fieldLabel: 'Denominación',
        allowBlank: false,
        width: 200,
        anchor: '80%'
                //value: codigoreup
    });

    Precio = new Ext.form.NumberField({
        fieldLabel: 'Precio',
        allowNegative: true,
        decimalPrecision: 6,
        allowBlank: false,
        maxLength: 30,
        width: 200
                //value: codigoreup
    });

    CodigoCUP = new Ext.form.TextField({
        fieldLabel: 'Codigo CUP',
        allowBlank: false,
        width: 200,
        //disabled: accion == 2 ? true : false
        //anchor: '80%',
        //value: codigoreup
    });

    CodigoPieza = new Ext.form.TextField({
        fieldLabel: 'Número de pieza',
        allowBlank: true,
        width: 200
                //disabled: accion == 2 ? true : false
                //anchor: '80%',
                //value: codigoreup
    });

    var h = 300;
    pfinalP = new Ext.FormPanel({
        id: 'pfinalP',
        frame: true,
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [cbEmpresasImp]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: Denominacion
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: cbUnidaMedida
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: Precio
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: CodigoCUP
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: CodigoPieza
                    }]

            }]
    });
    ventanaCrudProd = null;
    ventanaCrudProd = new Ext.Window({
        title: 'Adicionar producto',
        id: 'ventanaCrudProd',
        width: 525,
        constrain: true,
        layout: 'fit',
        height: h,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAdd, btnAplicarAdd, btnAceptarAdd],
        items: [pfinalP],
        listeners: {
            beforeshow: function () {
            }
        }
    });
    ventanaCrudProd.show();
}

function AdicionarProductos(accion, band) {
    var id = null;
    ccup = CodigoCUP.getValue();
    if (accion == 2) {
        id = smGpProductos.getSelected().data.idproducto711;
    }
    //si los conceptos de compra son iguales
    Ext.Ajax.request({
        url: 'adicionarProductos',
        params: {
            um: cbUnidaMedida.getValue(),
            idempimp: cbEmpresasImp.getValue(),
            denom: Denominacion.getValue(),
            precio: Precio.getValue(),
            codigocup: ccup,
            idproducto711: id,
            numeropieza: CodigoPieza.getValue(),
            accion: accion,
            tipo: 0
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                var postaccion = 'adicionado';
                mostrarMensaje(1, 'El producto se ha ' + postaccion + ' satisfactoriamente');
                cbUnidaMedida.reset();
                cbEmpresasImp.reset();
                Denominacion.reset();
                Precio.reset();
                CodigoCUP.reset();
                CodigoPieza.reset();
                stProductosSel.reload();
                DameProdCodigoCUP(ccup);
                if (band == 2) {
                    ventanaCrudProd.destroy();
                }
            } else {
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });

}

function DameProdCodigoCUP(codigo) {
    Ext.Ajax.request({
        url: 'listarProductos711',
        params: {
            codigocup: codigo,
            tipo: 0
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == "1") {
                result = responseData.data;
                console.log(result);
                AgregarDesdeAdicionar(result);
            } else {
                mostrarMensaje(2, 'error en la busqueda');
            }
        }
    });
}

function AgregarDesdeAdicionar(tipo) {
    prodind = [];
    cont = 1;
    auxLsiexiste = gpProdInd.getStore().data.items.length;
    if (auxLsiexiste > 0) {
        for (var i = 0; i < auxLsiexiste; i++) {
            prodind.push([
                gpProdInd.getStore().data.items[i].data.iddistribucioncod,
                gpProdInd.getStore().data.items[i].data.iddatoscodigo,
                gpProdInd.getStore().data.items[i].data.idproducto711,
                gpProdInd.getStore().data.items[i].data.denominacion,
                gpProdInd.getStore().data.items[i].data.cantidad,
                gpProdInd.getStore().data.items[i].data.precio,
                gpProdInd.getStore().data.items[i].data.valor
            ]);
            cont++;
        }
    }
    prodind.push([
        cont,
        smFFyCC.getSelected().data.iddatoscodigo,
        tipo[0].idproducto711,
        tipo[0].denominacion,
        0,
        tipo[0].precio,
        0
    ]);
    cont++;

    stProdInd.loadData(prodind);
    //pProdInd.reconfigure(stProdInd, cmProdInd);
}