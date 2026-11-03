Ext.ns('app');
app.col = [];
app.readerDina = [];
agregarmodificarplan = function () {

}

function winFp(accion) {
    auxslva=[];
    contdeguardar=0;
    emp=[];
    mymask.show();
    app.col = [];
    app.readerDina = [];
    longimp = 0;
    app.col.push({
        header: perfil.etiquetas.lbHeaderFF,
        tooltip: perfil.etiquetas.lbHeaderFF,
        dataIndex: 'denominacionff',
        id: 'expandir',
        width: 100,
        align: 'left'
    });

    app.readerDina.push({
        name: 'asociado'
    });
    app.readerDina.push({
        name: 'iddatosff'
    });
    app.readerDina.push({
        name: 'denominacionff'
    });
    
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
                //auxslva = [];
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    Ext.Ajax.timeout = 600000; //10min
    mymask.show();
    Ext.Ajax.request({
        url: 'listarCC',
        params: {
            tipoplan: cbTipoPlan.getValue()
            //montototal: montototal,
        },
        callback: function (options, success, response) {
            //mymask.hide();
            var responseData = Ext.decode(response.responseText);
            if (responseData.data) {
                var cant = responseData.data.length;
                arreglocol = responseData.data;
                for (var i = 0; i < cant; i++) {
                    if (arreglocol[i].denominacion != '-') {
                        app.readerDina.push({
                            name: arreglocol[i].iddatosnomenclador
                        });
                        app.col.push({
                            header: arreglocol[i].denominacion,
                            tooltip: arreglocol[i].denominacion,
                            dataIndex: arreglocol[i].iddatosnomenclador,
                            width: 100,
                            align: 'rigth',
                            renderer: RenderaddCommas,
                            editor: new Ext.form.TextField({
                                allowNegative: true,
                                regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                                allowBlank: false,
                                maxLength: 30,
                                listeners: {
                                    change : function ( me, nv, ov )  {
                                        me.setValue(addCommas(nv));
                                    }
                                }
                            })
                        });
                    }
                }

                montototalasig = new Ext.form.TextField({
                    allowNegative: true,
                    fieldLabel: perfil.etiquetas.lbLabelMonto,
                    //decimalPrecision: 2,
                    regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                    allowBlank: false,
                    maxLength: 30,
                    with: '100',
                    listeners: {
                        change : function ( me, nv, ov )  {
                            montototalasig.setValue(addCommas(nv));
                        }
                    }
                });
                
                stEmpresaImp = new Ext.data.Store({
                    autoLoad: true,
                    url: 'listarDatos',
                    listeners: {
                        beforeload: function () {
                            stEmpresaImp.baseParams.uri = 3;
                            stEmpresaImp.baseParams.tipoplan = cbTipoPlan.getValue();
                        },
                        load: function (mi, st, obj) {
                            longimp = st.length;
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
                    fieldLabel: perfil.etiquetas.lbLabelEmpImp,
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
                            var auxstore= null;
                            var band1=false;
                            if(auxslva.length>0){
                                for (var i = 0; i < auxslva.length; i++) {
                                    if (auxslva[i][1] == rec.data.iddatos) {
                                        auxstore = new Ext.data.JsonStore({
                                            storeId: 'Storedetalles',
                                            data: auxslva[i][0],
                                            autoLoad: true,
                                            fields: app.readerDina
                                        });
                                        band1=true;
                                    }
                                }
                                if(band1==true){
                                    gpFFyCC.reconfigure(auxstore, cmFFyCC);
                                }
                            }
                            if(band1==false){
                                gpFFyCC.reconfigure(stFFyCC, cmFFyCC);
                                stFFyCC.reload();
                            }
                            
                            if(contdeguardar<longimp){
                                btnGuardarDist.enable();
                            }
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
                    },{
                        name: 'idejercicio'
                    }]),
                    listeners: {
                        beforeload: function (store, record, options) {
                            var annoactual = new Date();
                            stComboEjercicios.baseParams.annoact = annoactual.getFullYear();
                            stComboEjercicios.baseParams.tipoplan = cbTipoPlan.getValue();
                        },
                        load: function (mi, st, obj) {
                            lonejerc=st.length;
                            if(st.length==0){
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

                cmFFyCC = new Ext.grid.ColumnModel(app.col);

                var jrStProd = new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: 'jrStProd',
                    fields: app.readerDina
                });
                
                btnGuardarDist = new Ext.Button({
                    handler: function () {
                        SalvarGrid();
                    },
                    tooltip: 'Guardar distribución',
                    disabled: true,
                    id: 'btnGuardarDist',
                    iconCls: 'guardar',
                });
                
                titulopanel = new Ext.form.Label({
                    id: 'titulopanel',
                    text: 'Distribución del monto asignado al plan:'
                });
                
                montoempresa = new Ext.form.Label({
                    text: '0.00'
                });

                //store del grid de FF 
                stFFyCC = new Ext.data.Store({
                    //autoLoad: true,
                    url: 'listarFFyCC',
                    reader: jrStProd,
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
                        load: function (store, record, options) {
                            montoempresa.setText(addCommas(store.reader.jsonData.totalimport));
                        }
                    }
                });

                smFFyCC = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                });

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
                    region: 'center',
                    frame: true,
                    tbar: [titulopanel,montoempresa,'->',btnGuardarDist],
                    disabled: true,
                    width: 500,
                    height: 300,
                    items: gpFFyCC
                });

                textmotivo = new Ext.form.TextArea({
                    id: 'idtextmotivo',
                    allowBlank: false,
                    emptyText: 'Argumentos de motivo'
                });

                //panel para escribir los motivos
                pMotivo = new Ext.Panel({
                    layout: 'fit',
                    region: 'east',
                    frame: true,
                    title: 'Motivos',
                    //margins: '3 3 3 3',
                    width: 170,
                    height: 300,
                    items: textmotivo
                });

                var h = 440;
                if (accion != 2) {
                    //panel para mostrar todos los elementos de la ventana add
                    pfinal = new Ext.FormPanel({
                        id: 'pfinal',
                        frame: true,
                        items: [{
                            layout: 'column',
                            items: [{
                                columnWidth: 0.4,
                                layout: 'form',
                                items: [cbDenominacionEjercicio]
                            }, {
                                columnWidth: 0.6,
                                layout: 'form',
                                items: montototalasig
                            }, {
                                columnWidth: 0.7,
                                layout: 'form',
                                items: cbEmpresasImp
                            }, {
                                columnWidth: 1,
                                layout: 'form',
                                items: pPlanificacion
                            }]

                        }]
                    });
                    ventanaCrud = null;
                    ventanaCrud = new Ext.Window({
                        title: 'Adicionar plan',
                        id: 'ventanaCrud',
                        width: 525,
                        constrain: true,
                        layout: 'fit',
                        height: h,
                        resizable: false,
                        frame: true,
                        modal: true,
                        buttons: [btnCancelarAdd, btnAplicarAdd, btnAceptarAdd],
                        items: [pfinal],
                        listeners: {
                            beforeshow: function () {
                            }
                        }
                    });
                    ventanaCrud.show();
                    stComboEjercicios.reload();
                    mymask.hide();

                } else {
                    idplan711modif = smGpGestPlanes711.getSelected().data.idplan711;
                    ventanaCrud = null;
                    //panel para mostrar todos los elementos de la ventana modificar
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
                                columnWidth: 0.45,
                                layout: 'form',
                                items: montototalasig
                            }, {
                                columnWidth: 0.7,
                                layout: 'form',
                                items: cbEmpresasImp
                            }, {
                                columnWidth: 0.75,
                                layout: 'form',
                                items: pPlanificacion
                            }, {
                                columnWidth: 0.25,
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
                        width: 710,
                        layout: 'fit',
                        constrain: true,
                        height: h,
                        frame: true,
                        resizable: false,
                        modal: true,
                        autoValidate: false,
                        items: [pfinal],
                        buttons: [btnCancelarAdd, btnAceptarAdd],
                        listeners: {
                            beforeshow: function (win) {

                            }
                        }
                    });
                    btnAceptarAdd.disable();
                    ventanaCrud.show();
                    mymask.hide();

                }
            }
        }
    });
}

function AdicionarModificar(accion) {
    var montototal = parseFloat(montototalasig.getValue().replace(/,/g,''));
    var motivo = '';
    if (accion == 2) {
        motivo = textmotivo.getValue();
    }
    
    if(contdeguardar>=longimp){
        mymask.show();
        //si los conceptos de compra son iguales
        Ext.Ajax.request({
            url: 'adicionarModificarPlan',
            params: {
                ejercicio: cbDenominacionEjercicio.getValue(),
                montototal: montototal,
                distribuc: Ext.encode(auxslva),
                planactual: 'false',
                accion: accion,
                motivo: motivo,
                idp711: idplan711modif,
                tipoplan : cbTipoPlan.getValue()
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                mymask.hide();
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
    }else{
        mostrarMensaje(2, 'Falta cargar y guaradar los datos de una de las empresas importadoras');
    }

}

function agregarColumnas(reader, cmodel, arreglocol) {
    cmodel.push(chkFFyCC);
    cmodel.push({
        header: 'Conceptos de compra',
        tooltip: 'Conceptos de compra',
        dataIndex: 'denominacioncc',
        id: 'expandir',
        width: 50,
        align: 'center'
    });

    var cant = arreglocol.length;

    for (var i = 0; i < cant; i++) {
        if (arreglocol[i].data.denominacion != '-') {
            reader.push({
                name: "'" + arreglocol[i].data.iddatosnomenclador + "'"
            });
            cmodel.push({
                header: arreglocol[i].data.denominacion,
                tooltip: arreglocol[i].data.denominacion,
                dataIndex: arreglocol[i].data.iddatosnomenclador,
                width: 50,
                align: 'center',
                renderer: crearToolTip,
                editor: new Ext.form.NumberField({
                    allowNegative: true,
                    decimalPrecision: 2,
                    allowBlank: false,
                    maxLength: 19
                })
            });
        }
    }
}

function SalvarGrid(){
    var arrayConceptos = gpFFyCC.getStore().data.items;
    empimp = cbEmpresasImp.getValue();
    var cant = arrayConceptos.length;
    var distribuc = [];
    for (var i = 0; i < cant; i++) {
        distribuc.push(arrayConceptos[i].data);
    }
    totalparcial=0;
    for(i=0;i<distribuc.length; i++){
        for(valimp in distribuc[i]){
            for(j=0;j<arreglocol.length; j++){
                if(arreglocol[j].iddatosnomenclador == valimp){
                    totalparcial=totalparcial+parseFloat(''+distribuc[i][valimp]+''.replace(/,/g,''));
                }
            }
        }
    }
    var band= true;
    if(auxslva.length > 0){
        for (var i = 0; i < auxslva.length; i++) {
            if(auxslva[i][1]== cbEmpresasImp.getValue()){
                auxslva[i][0]= distribuc;
                band = false;
            }
        }
    }
    if(band==true){
        var auxST = new Ext.data.JsonStore({
            storeId: 'Storedetalles',
            data: distribuc,
            autoLoad: true,
            fields: app.readerDina
        });
        gpFFyCC.reconfigure(auxST, cmFFyCC);
        auxslva.push([distribuc, cbEmpresasImp.getValue()]);
    }
    
    if(auxslva.length == stEmpresaImp.getCount()){
        Ext.getCmp('btnAplicarAdd').enable();
        Ext.getCmp('btnAceptarAdd').enable();
        btnAceptarAdd.enable();
        if (btnAplicarAdd.isVisible()) {
            btnAplicarAdd.enable();
        }
    }
    
    btnGuardarDist.disable();
    btnAceptarAdd.enable();
    var bandemp=true;
    if(emp.length==0){
        emp[0]=cbEmpresasImp.getValue();
        contdeguardar++;
    }else{
        for (var i = 0; i < emp.length; i++) {
            if(emp[i]== cbEmpresasImp.getValue()){
                bandemp=false;
            }
        }
        if(bandemp==true){
            contdeguardar++;
        }
    }
    montoempresa.setText(addCommas(totalparcial));
}


