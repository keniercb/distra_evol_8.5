agregrarcontrato = function () {
    //**************contrato************************
   //**************grid panel contrato****************************
    btnLimpiarContrato = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        disabled: false,
        handler: function () {
            filtrosContrato.clearFilters();
        }
    });
        
    stContrato = new Ext.data.Store({
        url: 'listarContrato',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idcontrato'
            },{
                name: 'nocontrato'
            },{
                name: 'fechacontratacion'
            },{
                name: 'totalcontratado'
            },{
                name: 'iddatosproveedor'
            },{
                name: 'proveedor'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stContrato.removeAll();
                stContrato.baseParams.idsolicitud711 = smSolicitudes711.getSelected().data.idsolicitud711;
                //stContrato(gpListaModif, filtrosModif, perfil.etiquetas.lbFiltradoPor);
            },
            load: function (store, record, options) {
                recct= null;
                ControlBotonesCt(recct);
            }
        }
    });

    cmContrato = new Ext.grid.ColumnModel([
        {
            header: "No contrato",
            dataIndex: 'nocontrato',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Fecha de contratación",
            dataIndex: 'fechacontratacion',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Total contratado",
            dataIndex: 'totalcontratado',
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        },{
            header: "Proveedor",
            dataIndex: 'proveedor',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }
    ]);
    /*
//    filtrosContrato = new Ext.grid.GridFilters({
//        filters: []
//    });
*/
    smContrato = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, y, rec) {
                ControlBotonesCt(rec);
                stCtFuentesF.reload();
            }
        }
    });
    
    btnAdicionarCt = new Ext.Toolbar.Button({
        hidden: true,
        id: 'btnAdicionarCt',
        tooltip: 'Adicionar',
        iconCls: 'adicionar',
        disabled: false,
        handler: function () {
            if(smSolicitudes711.getSelected().data.idsolicitud711){
                winadicionarmodificarcontrato(1);
            }else{
                mostrarMensaje(2, 'Asegurese de tener selección sobre la solicitud 711!');
            }
        }
    });
    
    btnModificarCt = new Ext.Toolbar.Button({
        hidden: true,
        id: 'btnModificarCt',
        tooltip: 'Modificar',
        iconCls: 'modificar',
        disabled: true,
        handler: function () {
            if(smSolicitudes711.getSelected().data.idsolicitud711){
                winadicionarmodificarcontrato(2);
            }else{
                mostrarMensaje(2, 'Asegurese de tener selección sobre la solicitud 711!');
            }
        }
    });
    
    btnEliminarCt = new Ext.Toolbar.Button({
        hidden: true,
        disabled: true,
        tooltip: 'Eliminar',
        id: 'btnEliminarCt',
        iconCls: 'eliminar',
        //hidden: true,
        handler: function () {
            EliminarCT();
        }
    });
  
    gpContrato = new Ext.grid.GridPanel({
        frame: true,
        stripeRows: true,
        store: stContrato,
        sm: smContrato,
        disabled: true,
        autoExpandColumn: 'expandir',
        cm: cmContrato,
        tbar: [btnAdicionarCt, btnEliminarCt, btnModificarCt],
        bbar: new Ext.PagingToolbar({
            store: stContrato,
            displayInfo: true,
            items: [btnLimpiarContrato],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        //plugins: filtrosContrato,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
        }
    });
    
    //**************CtFuentesF************************
   //**************grid panel de Embarques y Acciones en el contrato****************************
    btnLimpiarCtFuentesF = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        disabled: false,
        handler: function () {
            filtrosCtFuentesF.clearFilters();
        }
    });
        
    stCtFuentesF = new Ext.data.Store({
        url: 'listarAccionesEmbarquesCt',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
            //idembarque, idcontrato, iddatosff, monto, fechaposible, fechareal,codigofactura, iddatosaccion
        }, [{
                name: 'idembarque'
            },{
                name: 'idcontrato'
            },{
                name: 'iddatosaccion'
            },{
                name: 'accion'
            },{
                name: 'iddatosff'
            },{
                name: 'fuentes'
            },{
                name: 'monto'
            },{
                name: 'fechaposible'
            },{
                name: 'fechareal'
            },{
                name: 'codigofactura'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stCtFuentesF.removeAll();
                stCtFuentesF.baseParams.idcontrato = smContrato.getSelected().data.idcontrato;
                //stContrato(gpListaModif, filtrosModif, perfil.etiquetas.lbFiltradoPor);
            },
            load: function (me) {
                rec=null;
                ControlBotonesCtAcc(rec);
            }
        }
    });

    cmCtFuentesF = new Ext.grid.ColumnModel([
        {
            header: "Acción en contrato",
            dataIndex: 'accion',
            id:'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Fuente F.",
            dataIndex: 'fuentes',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Valor contratado",
            dataIndex: 'monto',
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        },{
            header: "Fecha posible",
            dataIndex: 'fechaposible',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Fecha real",
            tooltip: "Fecha real",
            dataIndex: 'fechareal',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.DateField({
                allowBlank: true,
                format: 'Y-m-d h:i:s' 
            })
        }
    ]);

    smCtFuentesF = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, y, rec) {
                ControlBotonesCtAcc(rec)
                stCtFormaPago.reload();
                stDetallesEmbarq.reload();
            }
        }
    });
    
    btnGuaradarCtFuentes = new Ext.Toolbar.Button({
        tooltip: 'Guardar modificaciones',
        iconCls: 'guardar',
        disabled: true,
        id: 'btnGuaradarCtFuentes',
        hidden:true,
        handler: function () {
            SalvarFechas(1);
            stCtFuentesF.reload();
        }
    });
  
    gpCtFuentesF = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stCtFuentesF,
        sm: smCtFuentesF,
        disabled: true,
        autoExpandColumn: 'expandir',
        cm: cmCtFuentesF,
        tbar: [btnGuaradarCtFuentes],
        //layout: 'fit',
        bbar: new Ext.PagingToolbar({
            store: stCtFuentesF,
            displayInfo: true,
            items: [btnLimpiarCtFuentesF],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        //plugins: filtrosCtFuentesF,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
        }
    });
 
    //**************grid panel de detalles de formas de pago de Embarques en el contrato****************************
    btnLimpiarFormaPago = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        disabled: false,
        handler: function () {
            filtrosFormaPago.clearFilters();
        }
    });
        
    stCtFormaPago = new Ext.data.Store({
        url: 'listarCtEmbFormaPago',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
            //idembarqueformapago, idembarque, iddatosformapago, fechaposible, fechareal, porciento, monto
        }, [{
                name: 'idembarqueformapago'
            },{
                name: 'idembarque'
            },{
                name: 'iddatosformapago'
            },{
                name: 'formapago'
            },{
                name: 'porciento'
            },{
                name: 'monto'
            },{
                name: 'fechaposible'
            },{
                name: 'fechareal'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stCtFormaPago.removeAll();
                stCtFormaPago.baseParams.idembarque = smCtFuentesF.getSelected().data.idembarque;
                //stContrato(gpListaModif, filtrosModif, perfil.etiquetas.lbFiltradoPor);
            },
            load: function (me) {
                rec=null;
                ControlBotonesCtFormaPago(rec);
            }
        }
    });

    cmCtFormaPago = new Ext.grid.ColumnModel([
        {
            header: "Forma pago",
            dataIndex: 'formapago',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Por ciento",
            tooltip: "Por ciento",
            dataIndex: 'porciento',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: "Monto",
            tooltip: "Monto",
            dataIndex: 'monto',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas
        },{
            header: "Fecha posible",
            tooltip: "Fecha posible",
            dataIndex: 'fechaposible',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: "Fecha real",
            tooltip: "Fecha real",
            dataIndex: 'fechareal',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.DateField({
                allowBlank: true
            })
        }
    ]);

    smCtFormaPago = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, y, rec) {
                ControlBotonesCtFormaPago(rec);
            }
        }
    });
    
    btnGuaradarCtFormaPago = new Ext.Toolbar.Button({
        tooltip: 'Guardar modificación',
        iconCls: 'guardar',
        disabled: true,
        hidden: true,
        id: 'btnGuaradarCtFormaPago',
        handler: function () {
            SalvarFechas(2)
            stCtFormaPago.reload();
        }
    });
  
    gpCtFormaPago = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stCtFormaPago,
        sm: smCtFormaPago,
        disabled: true,
        autoExpandColumn: 'expandir',
        cm: cmCtFormaPago,
        tbar: [btnGuaradarCtFormaPago],
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
        }
    });
    
    //Detalles de un embarque cubicajes
    stDetallesEmbarq = new Ext.data.Store({
        //autoLoad: true,
        url: 'listarDetallesEmbarq',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
            //idembarquecubicaje, idembarque, iddatoscubicaje, cantidad
        }, [{
                name: 'idembarquecubicaje'
            },{
                name: 'iddatoscubicaje'
            },{
                name: 'cubicaje'
            },{
                name: 'cantidad'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stDetallesEmbarq.removeAll();
                stDetallesEmbarq.baseParams.idembarque = smCtFuentesF.getSelected().data.idembarque;
                //cambiarTituloFiltrar(gpListaModif, filtrosModif, perfil.etiquetas.lbFiltradoPor);
            },
            load: function (me) {

            }
        }
    });
    
    smDetalles = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    
    cmDetallesEmbarq = new Ext.grid.ColumnModel([
        {
            header: "Cubicaje",
            dataIndex: 'cubicaje',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },
        {
            header: "Cantidad",
            width: 150,
            dataIndex: 'cantidad',
            sortable: true,
            renderer: crearToolTip
        }
    ]);
    
    gpListaDetalles = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stDetallesEmbarq,
        sm: smDetalles,
        disabled: true,
        layout: 'fit',
        region: 'center',
        title: 'Listado de modificaciones',
        autoExpandColumn: 'expandir',
        cm: cmDetallesEmbarq,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
        }               
    });
}

function winadicionarmodificarcontrato(accion) {
    mymask.show();
    
    cubicaje = [];
    cubicajelista = [];
    embarque = [];
    formapagolista = [];

    btnCancelarCt = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarCt',
        tooltip: perfil.etiquetas.lbTtCancenlarCt,
        text: 'Cancelar',
        handler: function () {
            ventanaCT.close();
        }
    });

    btnAplicarCt = new Ext.Button({
        iconCls: 'aplicar',
        id: 'btnAplicarCt',
        disabled: true,
        text: 'Aplicar',
        tooltip: perfil.etiquetas.lbTtAplicarCt,
        handler: function () {
            AdicionarContrato(accion);
        }
    });

    btnAceptarCt = new Ext.Button({
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarCt',
        text: 'Aceptar',
        tooltip: perfil.etiquetas.lbTtAceptarCt,
        handler: function () {
            AdicionarContrato(accion, 1);
        }
    });

    //Elementos
    NoContrato = new Ext.form.TextField({
        fieldLabel: 'No. Contrato',
        allowBlank: false,
        width: 200,
        anchor: '80%'
                //value: codigoreup
    });

    FechaCT = new Ext.form.DateField({
        fieldLabel: 'Fecha de contratación',
        allowBlank: false,
        width: 200,
        format: 'd/m/Y h:i:s', 
        anchor: '80%'
    });

    total = new Ext.form.TextField({
        allowNegative: true,
        fieldLabel: 'Total en contrato',
        allowBlank: false,
        maxLength: 30,
        with : '100',
        anchor: '80%',
        disabled: true,
        listeners: {
        }
    });

    stProveedor = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stProveedor.baseParams.uri = 22;
            },
            load: function (t) {
                mymask.hide();
                if (accion==2){
                    cbProveedor.setValue(smContrato.getSelected().data.iddatosproveedor);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'descripcion'
            }]
                )
    });

    cbProveedor = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        width: 200,
        anchor: '80%',
        fieldLabel: 'Proveedor',
        store: stProveedor,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    // aqui datos de adicionar embarques
    stAccionEncontrato = new Ext.data.Store({
        //autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stAccionEncontrato.baseParams.uri = 15;
                stAccionEncontrato.baseParams.condicion = cbCondicionEncontrato.getValue();
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
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'descripcion'
            }]
                )
    });

    cbAccionEncontrato = new Ext.form.ComboBox({
        //id: 'cbFFCt',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stAccionEncontrato,
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
                cbFFCt.enable();
                btnAdicionarFF.disable();
            }
        }
    });

    stCondicionEncontrato = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stCondicionEncontrato.baseParams.uri = 21;
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
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'descripcion'
            }]
                )
    });

    cbCondicionEncontrato = new Ext.form.ComboBox({
        //id: 'cbFFCt',
        emptyText: 'Seleccione',
        width: 150,
        store: stCondicionEncontrato,
        displayField: 'descripcion',
        valueField: 'uridatosnomenclador',
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
                cbAccionEncontrato.enable();
                stAccionEncontrato.reload();
            }
        }
    });

    textocondicion = new Ext.form.Label({
        text: 'Condición en contrato'
    });
    textoaccion = new Ext.form.Label({
        text: 'Acción en contrato'
    });

    cbFFCt = new Ext.form.ComboBox({
        //id: 'cbFFCt',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stTipoFuentesF,
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
                btnAdicionarFF.enable();
            }
        }
    });

    stEmbarqueContratoMod = new Ext.data.Store({
        url: 'listarAccionesEmbarquesCt',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
            //idembarque, idcontrato, iddatosff, monto, fechaposible, fechareal,codigofactura, iddatosaccion
        }, [{
                name: 'idembarque'
            },{
                name: 'idcontrato'
            },{
                name: 'iddatosaccion'
            },{
                name: 'accion'
            },{
                name: 'iddatosff'
            },{
                name: 'fuentes'
            },{
                name: 'monto'
            },{
                name: 'fechaposible'
            },{
                name: 'fechareal'
            },{
                name: 'codigofactura'
            }, {
                name: 'uricondicion'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stEmbarqueContratoMod.removeAll();
                stEmbarqueContratoMod.baseParams.idcontrato = smContrato.getSelected().data.idcontrato;
            },
            load: function (me) {
                stCubicajeMod.reload();
            }
        }
    });

    stEmbarqueContrato = new Ext.data.SimpleStore({
        fields: [{
                name: 'idembarque'
            }, {
                name: 'iddatosaccion'
            }, {
                name: 'accion'
            }, {
                name: 'iddatosff'
            }, {
                name: 'fuentes'
            }, {
                name: 'monto'
            }, {
                name: 'fechaposible'
            }, {
                name: 'uricondicion'
            }
        ]
    });

    cmEmbarqueContrato = new Ext.grid.ColumnModel([
        {
            header: "Acción",
            dataIndex: 'accion',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Fuentes Financienta",
            dataIndex: 'fuentes',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Valor contratado",
            tooltip: "Valor contratado",
            dataIndex: 'monto',
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
            header: "Fecha posible",
            tooltip: "Fecha posible",
            dataIndex: 'fechaposible',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.DateField({
                allowBlank: false
            })
        }
    ]);

    smEmbarqueContrato = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (x, num, rec) {
                pDetallesEmb.enable();
                //pDetallesEmb.toggleCollapse(true);
                pDetallesEmb.setTitle('Detalles de acción: ' + smEmbarqueContrato.getSelected().data.idembarque);
                CargarDetalles();
            }
        }
    });

    btnAdicionarFF = new Ext.Button({
        iconCls: 'adicionar',
        disabled: true,
        handler: function () {
            SeleccionarFuentes();
        }
    });

//    btnDelEmbarque = new Ext.Button({
//        handler: function () {
//            //GuardarDistribucion();
//        },
//        tooltip: 'Eliminar valores',
//        disabled: false,
//        iconCls: 'eliminar',
//    });

    btnGuaradarEmbarqueContrato = new Ext.Toolbar.Button({
        tooltip: 'Guaradar cambios parciales',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            GuardarAcciones();
            btnGuaradarEmbarqueContrato.disable();
        }
    });

    gpEmbarqueContrato = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stEmbarqueContratoMod,
        sm: smEmbarqueContrato,
        disabled: false,
        region: 'center',
        width: 950,
        height: 270,
        autoExpandColumn: 'expandir',
        cm: cmEmbarqueContrato,
        tbar: [textocondicion, cbCondicionEncontrato, '-', textoaccion, cbAccionEncontrato, '-', 'Fuentes a adicionar', cbFFCt, btnAdicionarFF, /*btnDelEmbarque,*/ btnGuaradarEmbarqueContrato],
        //plugins: filtrosProductos1,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpEmbarqueContrato.getColumnModel().setEditable(col_id, true);

            },
            afteredit: function (e) {
                btnGuaradarEmbarqueContrato.enable();
            }
        }
    });

    pEmbarqCont = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        //width: '30%',
        items: [gpEmbarqueContrato]
    });
    //fin

    //aqui detalles de un embarques cubicaje
    stTipoCubicaje = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoCubicaje.baseParams.uri = 14;
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

    cbCubicaje = new Ext.form.ComboBox({
        //id: 'cbFFCt',
        emptyText: 'Seleccione',
        width: 150,
        store: stTipoCubicaje,
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
                btnAdicionarCub.enable();
            }
        }
    });

    stCubicajeMod = new Ext.data.Store({
        url: 'listarDetallesEmbarqTodo',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
            //idembarquecubicaje, idembarque, iddatoscubicaje, cantidad
        }, [{
                name: 'idembarque'
            },{
                name: 'iddatoscubicaje'
            },{
                name: 'cubicaje'
            },{
                name: 'cantidad'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stCubicajeMod.removeAll();
                stCubicajeMod.baseParams.idcontrato = smContrato.getSelected().data.idcontrato;
                //cambiarTituloFiltrar(gpListaModif, filtrosModif, perfil.etiquetas.lbFiltradoPor);
            },
            load: function (me) {
                CargarDetallesModificar(me, cubicajelista, 'c');
            }
        }
    });

    stCubicaje = new Ext.data.SimpleStore({
        fields: [{
                name: 'idembarque'
            }, {
                name: 'iddatoscubicaje'
            }, {
                name: 'cubicaje'
            }, {
                name: 'cantidad'
            }
        ]
    });

    cmCubicaje = new Ext.grid.ColumnModel([
        {
            header: "Cubicaje",
            dataIndex: 'cubicaje',
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
                decimalPrecision: 0,
                allowBlank: false,
                maxLength: 19
            })
        }
    ]);

    smCubicaje = new Ext.grid.RowSelectionModel({
        singleSelect: true,
    });

    btnAdicionarCub = new Ext.Button({
        iconCls: 'adicionar',
        disabled: true,
        handler: function () {
            SeleccionarCubicaje();
        }
    });

//    btnDelCubicaje = new Ext.Button({
//        handler: function () {
//            //GuardarDistribucion();
//        },
//        tooltip: 'Eliminar valores',
//        disabled: false,
//        iconCls: 'eliminar',
//    });

    btnGuaradarCubicaje = new Ext.Toolbar.Button({
        tooltip: 'Guardar cambios previos',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            guardarDetalles(gpCubicajeEmbarque, cubicajelista, 'c', stCubicaje, cmCubicaje);
            btnGuaradarCubicaje.disable();
        }
    });

    gpCubicajeEmbarque = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stCubicaje,
        sm: smCubicaje,
        disabled: false,
        region: 'center',
        width: 950,
        height: 270,
        autoExpandColumn: 'expandir',
        cm: cmCubicaje,
        tbar: ['Cubicaje', cbCubicaje, btnAdicionarCub, /*btnDelCubicaje,*/ btnGuaradarCubicaje],
        //plugins: filtrosProductos1,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpCubicajeEmbarque.getColumnModel().setEditable(col_id, true);
            },
            afteredit: function (e) {
                btnGuaradarCubicaje.enable();
            }
        }
    });
    //fin

    //aqui detalles de un embarques formas de pago
    stTipoFormaPago = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoFormaPago.baseParams.uri = 19;
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

    cbFormaPago = new Ext.form.ComboBox({
        //id: 'cbFFCt',
        emptyText: 'Seleccione',
        width: 150,
        store: stTipoFormaPago,
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
                btnAdicionarFormaPago.enable();
            }
        }
    });

    stFormaPagoMod = new Ext.data.Store({
        url: 'listarCtEmbFormaPagoTodo',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
            //idembarqueformapago, idembarque, iddatosformapago, fechaposible, fechareal, porciento, monto
        }, [{
                name: 'idembarqueformapago'
            },{
                name: 'idembarque'
            },{
                name: 'iddatosformapago'
            },{
                name: 'formapago'
            },{
                name: 'porciento'
            },{
                name: 'monto'
            },{
                name: 'fechaposible'
            },{
                name: 'fechareal'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stFormaPagoMod.removeAll();
                stFormaPagoMod.baseParams.idcontrato = smContrato.getSelected().data.idcontrato;
             },
            load: function (me) {
                CargarDetallesModificar(me, formapagolista, 'f');
            }
        }
    });

    stFormaPago = new Ext.data.SimpleStore({
        fields: [{
                name: 'idembarque'
            }, {
                name: 'idformapago'
            }, {
                name: 'formapago'
            }, {
                name: 'porciento'
            }, {
                name: 'monto'
            }, {
                name: 'fechaposible'
            }
        ]
    });

    cmFormaPago = new Ext.grid.ColumnModel([
        {
            header: "Forma pago",
            dataIndex: 'formapago',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "Por ciento",
            tooltip: "Por ciento",
            dataIndex: 'porciento',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 2,
                allowBlank: false,
                maxLength: 19,
                maxValue: 100,
                minValue: 0,
            })
        }, {
            header: "Monto",
            tooltip: "Monto",
            dataIndex: 'monto',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas
        }, {
            header: "Fecha posible",
            tooltip: "Fecha posible",
            dataIndex: 'fechaposible',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.DateField({
                allowBlank: true
            })
        }
    ]);

    smFormaPago = new Ext.grid.RowSelectionModel({
        singleSelect: true,
    });

    btnAdicionarFormaPago = new Ext.Button({
        iconCls: 'adicionar',
        disabled: true,
        handler: function () {
            SeleccionarFormaPago();
        }
    });

//    btnDelFormaPago = new Ext.Button({
//        handler: function () {
//            //GuardarDistribucion();
//        },
//        tooltip: 'Eliminar valores',
//        disabled: false,
//        iconCls: 'eliminar',
//    });

    btnGuaradarFormaPago = new Ext.Toolbar.Button({
        tooltip: 'Guaradar cambios previos',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            guardarDetalles(gpFormaPagoEmbarque, formapagolista, 'f', stFormaPago, cmFormaPago);
            btnGuaradarFormaPago.disable();
        }
    });

    gpFormaPagoEmbarque = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stFormaPago,
        sm: smFormaPago,
        disabled: false,
        region: 'center',
        width: 950,
        height: 270,
        autoExpandColumn: 'expandir',
        cm: cmFormaPago,
        tbar: ['Forma de pago', cbFormaPago, btnAdicionarFormaPago, /*btnDelFormaPago,*/ btnGuaradarFormaPago],
        //plugins: filtrosProductos1,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpFormaPagoEmbarque.getColumnModel().setEditable(col_id, true);
            },
            afteredit: function (e) {
                btnGuaradarFormaPago.enable();
                CalcularMonto(e);
            }
        }
    });
    //fin

    //TabPanel detalles de embarques, formas de pago y cubicajes
    tabDetallesCt = new Ext.TabPanel({
        activeTab: 0,
        plain: true,
        defaults: {autoScroll: true},
        items: [{
                title: 'Cubicajes',
                layout: 'fit',
                html: "<div id = 'cubicajes' ></div>",
                items: [gpCubicajeEmbarque]
            }, {
                title: 'Formas de pago',
                layout: 'fit',
                html: "<div id = 'formaspagos' ></div>",
                items: [gpFormaPagoEmbarque]
            }
        ],
        listeners: {
            tabchange: function (panel, tab) {
                tab.doLayout(true);
            }
        }
    });

    pDetallesEmb = new Ext.Panel({
        region: 'east',
        layout: 'fit',
        collapsible: true,
        collapsed: true,
        width: '85%',
        disabled: true,
        titleCollapse: true,
        title: "Detalles de acción",
        split: true,
        margins: '0 0 0 0',
        items: [tabDetallesCt]
    });

    pAdicionarEmbarq = new Ext.Panel({
        region: 'center',
        layout: 'border',
        width: 950,
        height: 270,
        items: [pEmbarqCont, pDetallesEmb]
    });

    pEmbarqGeneral = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        width: 950,
        title: 'Acciones en contrato',
        height: 270,
        items: [pAdicionarEmbarq]
    });

    pDatosContrato = new Ext.Panel({
        frame: true,
        width: 1000,
        height: 450,
        layout: 'fit',
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: NoContrato
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: FechaCT
                    }, 
//                    {
//                        columnWidth: 0.5,
//                        layout: 'form',
//                        items: RateCambio
//                    }, 
                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: total
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: cbProveedor
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: pEmbarqGeneral
                    }
                ]

            }]
    });

    pfinalCt = new Ext.FormPanel({
        layout: 'fit',
        frame: true,
        items: [pDatosContrato]
    });
    ventanaCT = null;
    if(accion==1){
        ventanaCT = new Ext.Window({
            title: 'Adicionar contrato',
            width: 1000,
            constrain: true,
            layout: 'form',
            height: 450,
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarCt/*, btnAplicarCt*/, btnAceptarCt],
            items: [pfinalCt],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
    }
    if(accion==2){
        cargarDatosAMOdificar();
        ventanaCT = new Ext.Window({
            title: 'Modificar contrato',
            width: 1000,
            constrain: true,
            layout: 'form',
            height: 450,
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarCt, btnAceptarCt],
            items: [pfinalCt],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
        if(rolepersona==300000000402||rolepersona==300000000403||rolepersona==300000000404||rolepersona==300000000405){
           btnAceptarCt.hide();
        }
    }
    ventanaCT.show();
}

function SeleccionarFuentes(){
    fuentes = [];
    auxL= gpEmbarqueContrato.getStore().data.items.length;
    cont =1;
    if (auxL==0){
        fuentes.push([cont, cbAccionEncontrato.getValue(), cbAccionEncontrato.getRawValue(), cbFFCt.getValue(), cbFFCt.getRawValue(), 0, null, cbCondicionEncontrato.getValue()]);
        stEmbarqueContrato.loadData(fuentes);
        gpEmbarqueContrato.reconfigure(stEmbarqueContrato, cmEmbarqueContrato);
    }
    if(auxL >0){
        for (var i = 0; i < auxL; i++) {
            fuentes.push([
                gpEmbarqueContrato.getStore().data.items[i].data.idembarque,
                gpEmbarqueContrato.getStore().data.items[i].data.iddatosaccion,
                gpEmbarqueContrato.getStore().data.items[i].data.accion,
                gpEmbarqueContrato.getStore().data.items[i].data.iddatosff,
                gpEmbarqueContrato.getStore().data.items[i].data.fuentes,
                gpEmbarqueContrato.getStore().data.items[i].data.monto,
                gpEmbarqueContrato.getStore().data.items[i].data.fechaposible,
                gpEmbarqueContrato.getStore().data.items[i].data.uricondicion
            ]);
            cont++;
            cont+=parseFloat(gpEmbarqueContrato.getStore().data.items[i].data.idembarque);
        }
        fuentes.push([cont, cbAccionEncontrato.getValue(), cbAccionEncontrato.getRawValue(), cbFFCt.getValue(), cbFFCt.getRawValue(), 0, null, cbCondicionEncontrato.getValue()]);
        stEmbarqueContrato.loadData(fuentes);
        gpEmbarqueContrato.reconfigure(stEmbarqueContrato, cmEmbarqueContrato);
    }
    cbCondicionEncontrato.reset();
    cbAccionEncontrato.reset();
    cbFFCt.reset();
    cbAccionEncontrato.disable();
    cbFFCt.disable();
    btnAdicionarFF.disable();
}

function SeleccionarCubicaje(){
    cubicaje = [];
    auxL= gpCubicajeEmbarque.getStore().data.items.length;
    if (auxL==0 && smEmbarqueContrato.getSelected().data.idembarque){
        cubicaje.push([
            smEmbarqueContrato.getSelected().data.idembarque, 
            cbCubicaje.getValue(), cbCubicaje.getRawValue(), 0]);
        stCubicaje.loadData(cubicaje);
        gpCubicajeEmbarque.reconfigure(stCubicaje, cmCubicaje);
    }
    if(auxL >0 && smEmbarqueContrato.getSelected().data.idembarque){
        for (var i = 0; i < auxL; i++) {
            cubicaje.push([
                gpCubicajeEmbarque.getStore().data.items[i].data.idembarque,
                gpCubicajeEmbarque.getStore().data.items[i].data.iddatoscubicaje,
                gpCubicajeEmbarque.getStore().data.items[i].data.cubicaje,
                gpCubicajeEmbarque.getStore().data.items[i].data.cantidad
            ]);
        }
        cubicaje.push([
            smEmbarqueContrato.getSelected().data.idembarque, 
            cbCubicaje.getValue(), cbCubicaje.getRawValue(), 0]
                );
        stCubicaje.loadData(cubicaje);
        gpCubicajeEmbarque.reconfigure(stCubicaje, cmCubicaje);
    }
    if(cubicajelista.length==0){
        cubicajelista.push([[smEmbarqueContrato.getSelected().data.idembarque],[cubicaje]]);
    }else{
        for (var i = 0; i < cubicajelista.length; i++) {
            if(cubicajelista[i][0]==smEmbarqueContrato.getSelected().data.idembarque){
                cubicajelista[i][1]=cubicaje;
            }
        }
    }
    cbCubicaje.reset();
    btnAdicionarCub.disable();
}

function SeleccionarFormaPago(){
    formapago = [];
    auxL= gpFormaPagoEmbarque.getStore().data.items.length;
    if (auxL==0 && smEmbarqueContrato.getSelected().data.idembarque){
        formapago.push([
            smEmbarqueContrato.getSelected().data.idembarque, 
            cbFormaPago.getValue(), cbFormaPago.getRawValue(), 0,0, null]
                );
        
        stFormaPago.loadData(formapago);
        gpFormaPagoEmbarque.reconfigure(stFormaPago, cmFormaPago);
    }
    if(auxL >0 && smEmbarqueContrato.getSelected().data.idembarque){
        for (var i = 0; i < auxL; i++) {
            formapago.push([
                gpFormaPagoEmbarque.getStore().data.items[i].data.idembarque,
                gpFormaPagoEmbarque.getStore().data.items[i].data.idformapago,
                gpFormaPagoEmbarque.getStore().data.items[i].data.formapago,
                gpFormaPagoEmbarque.getStore().data.items[i].data.porciento,
                gpFormaPagoEmbarque.getStore().data.items[i].data.monto,
                gpFormaPagoEmbarque.getStore().data.items[i].data.fechaposible
            ]);
        }
        formapago.push([
            smEmbarqueContrato.getSelected().data.idembarque, 
            cbFormaPago.getValue(), cbFormaPago.getRawValue(), 0, 0, null]
             
                );
        stFormaPago.loadData(formapago);
        gpFormaPagoEmbarque.reconfigure(stFormaPago, cmFormaPago);
    }
    if(formapagolista.length==0){
        formapagolista.push([[smEmbarqueContrato.getSelected().data.idembarque],[formapago]]);
    }else{
        for (var i = 0; i < formapagolista.length; i++) {
            if(formapagolista[i][0]==smEmbarqueContrato.getSelected().data.idembarque){
                formapagolista[i][1]=formapago;
            }
        }
    }
    cbFormaPago.reset();
    btnAdicionarFormaPago.disable();
}

function CargarDetalles(){
   cubicaje =[];
   formapago = [];
   stCubicaje.loadData(cubicaje);
   if(cubicajelista.length != 0){
        for (var i = 0; i < cubicajelista.length; i++) {
            if(cubicajelista[i][0]==smEmbarqueContrato.getSelected().data.idembarque){
                stCubicaje.loadData(cubicajelista[i][1]);
                break;
            }
        }
    }
    gpCubicajeEmbarque.reconfigure(stCubicaje, cmCubicaje);
    stFormaPago.loadData(formapago);
    if(formapagolista.length!=0){
        for (var i = 0; i < formapagolista.length; i++) {
            if(formapagolista[i][0]==smEmbarqueContrato.getSelected().data.idembarque){
                stFormaPago.loadData(formapagolista[i][1]);
                break;
            }
        }
    }
    gpFormaPagoEmbarque.reconfigure(stFormaPago, cmFormaPago);
}

function guardarDetalles(gpASalvar, listadeSalvas, tipo, stASalvar, cmUtilizar){
    auxLista = [];
    auxL= gpASalvar.getStore().data.items.length;
    if(tipo == 'f'){
        for (var i = 0; i < auxL; i++) {
            auxLista.push([
                gpASalvar.getStore().data.items[i].data.idembarque,
                gpASalvar.getStore().data.items[i].data.idformapago,
                gpASalvar.getStore().data.items[i].data.formapago,
                gpASalvar.getStore().data.items[i].data.porciento,
                gpASalvar.getStore().data.items[i].data.monto,
                gpASalvar.getStore().data.items[i].data.fechaposible
            ]);
        }
    }
    
    if(tipo == 'c'){
        for (var i = 0; i < auxL; i++) {
            auxLista.push([
                gpASalvar.getStore().data.items[i].data.idembarque,
                gpASalvar.getStore().data.items[i].data.iddatoscubicaje,
                gpASalvar.getStore().data.items[i].data.cubicaje,
                gpASalvar.getStore().data.items[i].data.cantidad
            ]);
        }    
    }
    
    if(listadeSalvas.length==0){
        listadeSalvas.push([[smEmbarqueContrato.getSelected().data.idembarque],auxLista]);
    }else{
        band = true;
        for (var i = 0; i < listadeSalvas.length; i++) {
            if(listadeSalvas[i][0]==smEmbarqueContrato.getSelected().data.idembarque){
                listadeSalvas[i][1]=auxLista;
                band=false;
            }
        }
        if(band==true){
            listadeSalvas.push([[smEmbarqueContrato.getSelected().data.idembarque],auxLista]);
        }
    }
    stASalvar.loadData(auxLista);
    gpASalvar.reconfigure(stASalvar, cmUtilizar);
}

function GuardarAcciones(){
    auxL= gpEmbarqueContrato.getStore().data.items.length;
    sumintotal = 0;
    ft = [];
    stri = '';
    for (var i = 0; i < auxL; i++) {
        ft.push([
            gpEmbarqueContrato.getStore().data.items[i].data.idembarque,
            gpEmbarqueContrato.getStore().data.items[i].data.iddatosaccion,
            gpEmbarqueContrato.getStore().data.items[i].data.accion,
            gpEmbarqueContrato.getStore().data.items[i].data.iddatosff,
            gpEmbarqueContrato.getStore().data.items[i].data.fuentes,
            gpEmbarqueContrato.getStore().data.items[i].data.monto,
            gpEmbarqueContrato.getStore().data.items[i].data.fechaposible,
            gpEmbarqueContrato.getStore().data.items[i].data.uricondicion
        ]);
        if(gpEmbarqueContrato.getStore().data.items[i].data.uricondicion!='Fletescero'){
            stri = ''+gpEmbarqueContrato.getStore().data.items[i].data.monto;
            sumintotal += parseFloat(stri.replace(/,/g,''));            
        }
        for (var j = 0; j < formapagolista.length; j++){
            if(formapagolista[j][0][0]==gpEmbarqueContrato.getStore().data.items[i].data.idembarque){
                for (var y=0; y <formapagolista[j][1].length;y++){
                    stri = ''+gpEmbarqueContrato.getStore().data.items[i].data.monto;
                     valornuevo = (parseFloat(''+stri.replace(/,/g,''))*((parseFloat(formapagolista[j][1][y][3]))/100)).toFixed(6);
                     formapagolista[j][1][y][4]=valornuevo;
                }
            }
        }
    }
    stEmbarqueContrato.loadData(ft);
    gpEmbarqueContrato.getSelectionModel().clearSelections();
    gpCubicajeEmbarque.getStore().removeAll();
    gpFormaPagoEmbarque.getStore().removeAll();    
    total.setValue(addCommas(sumintotal));
    btnAdicionarFF.disable();   
}

function CalcularMonto(e){
    stri = '';
    if (e.field == 'porciento'){
        stri = ''+smEmbarqueContrato.getSelected().data.monto;
        gpFormaPagoEmbarque.getStore().data.items[e.row].data.monto= (parseFloat(''+stri.replace(/,/g,''))*((parseFloat(e.value))/100)).toFixed(6);
    }
}

function AdicionarContrato(accion, band){
    contrato=null;
    if(accion==2){
        contrato = smContrato.getSelected().data.idcontrato;
    }
    stri = '';
    montoaux=parseFloat(total.getValue().replace(/,/g,''));
    for(var i =0; i< gpContrato.getStore().data.items.length; i++){
        if(accion==2){
          if(gpContrato.getStore().data.items[i].data.idcontrato!=contrato){
              stri = ''+gpContrato.getStore().data.items[i].data.totalcontratado;
              montoaux+=parseFloat(''+ stri.replace(/,/g,''));
          } 
        }else{
            stri = ''+gpContrato.getStore().data.items[i].data.totalcontratado;
            montoaux+=parseFloat(''+ stri.replace(/,/g,''));
        }
    }
    if(montoaux<= parseFloat(rec.data.suministrototal)){
        if (btnGuaradarEmbarqueContrato.disabled && btnGuaradarCubicaje.disabled && btnGuaradarFormaPago.disabled) {
            //Datos a enviar
            mymask.show();
            Ext.Ajax.request({
                url: 'adicionarModificarContrato',
                params: {
                    idsolicitud711: smSolicitudes711.getSelected().data.idsolicitud711,
                    nocontrato: NoContrato.getValue(),
                    fechacontrat: FechaCT.getRawValue(),
                    totalcont: parseFloat(total.getValue().replace(/,/g,'')),
                    montoreal: montoaux,
                    //ratecambio : RateCambio.getValue(),
                    accionescontrato: Ext.encode(ft),
                    formapagolista: Ext.encode(formapagolista),
                    cubicajelista: Ext.encode(cubicajelista),
                    accion: accion,
                    idcontrato: contrato,
                    iddatosproveedor: cbProveedor.getValue()
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                        stContrato.reload();
                        stSolicitudes711.reload();
                        stMontoTotal.reload();
                        if (band == 1) {
                            ventanaCT.destroy();
                        }
                    } else {
                        mostrarMensaje(2, 'Ha ocurrido un error.');
                    }
                    mymask.hide();
                }
            });
        } else {
            mostrarMensaje(1, 'Falta por guardar algún dato parcialmente');
        }
    }else{
        mostrarMensaje(1, 'Ha superado el valor monetario disponible para contratar');
    }
}

function SalvarFechas(tipo){
    listafechareal = [];
    if(tipo==1){
        auxlista= gpCtFuentesF.getStore().getModifiedRecords();
        console.log(auxlista);
        for(var i =0; i< auxlista.length; i++){
            listafechareal.push([
                auxlista[i].data.idembarque,
                auxlista[i].data.fechareal
            ]);
        }
    }
    if(tipo==2){
        auxlista= gpCtFormaPago.getStore().getModifiedRecords();
        for(var i =0; i< auxlista.length; i++){
            listafechareal.push([
                auxlista[i].data.idembarqueformapago,
                auxlista[i].data.fechareal
            ]);
        }
    }
    Ext.Ajax.request({
        url: 'SalvarFechas',
        params: {
            tipo: tipo,
            listafechareal: Ext.encode(listafechareal)
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensage == 1) {
                mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                if (tipo==1){
                    stCtFuentesF.reload();
                }
                if (tipo==2){
                    stCtFormaPago.reload();
                }
            } else {
                mostrarMensaje(2, 'Ha ocurrido un error.');
            }
        }
    });
}

function cargarDatosAMOdificar(){
    idcontrato = smContrato.getSelected().data.idcontrato;
    NoContrato.setValue(smContrato.getSelected().data.nocontrato);
    NoContrato.disable();
    ds = new Date();
    ds= Date.parseDate(smContrato.getSelected().data.fechacontratacion, "d/m/Y h:i:s" );
    FechaCT.setValue(ds);
    FechaCT.disable();
    total.setValue(addCommas(smContrato.getSelected().data.totalcontratado));
    stEmbarqueContratoMod.reload();
    btnGuaradarEmbarqueContrato.enable();
    stFormaPagoMod.reload();
}

function CargarDetallesModificar(str, lista, tipo){
    auxLista = [];
    auxL1= str.reader.jsonData.data.length;
    auxL2= gpEmbarqueContrato.getStore().data.items.length;
    if(tipo == 'f'){
        for (var i = 0; i < auxL1; i++) {
            auxLista.push([
                str.reader.jsonData.data[i].idembarque,
                str.reader.jsonData.data[i].iddatosformapago,
                str.reader.jsonData.data[i].formapago,
                str.reader.jsonData.data[i].porciento,
                str.reader.jsonData.data[i].monto,
                str.reader.jsonData.data[i].fechaposible
            ]);
        }
    }
    if(tipo == 'c'){
        for (var i = 0; i < auxL1; i++) {
            auxLista.push([
                str.reader.jsonData.data[i].idembarque,
                str.reader.jsonData.data[i].iddatoscubicaje,
                str.reader.jsonData.data[i].cubicaje,
                str.reader.jsonData.data[i].cantidad
            ]);
        }    
    }
    for (var i = 0; i < auxL2; i++) {
        auxtotal=[];
        for (var j = 0; j < auxL1; j++){
            if(auxLista[j][0]==gpEmbarqueContrato.getStore().data.items[i].data.idembarque){
                auxtotal.push(auxLista[j]);
            }
        }
        lista.push([[gpEmbarqueContrato.getStore().data.items[i].data.idembarque],auxtotal]);
    }
}

function EliminarCT(){
    mostrarMensaje(2, '¿Está seguro que desea eliminar el contrato seleccionado?',
            function (btnPress) {
                if (btnPress == 'ok') {
					mymask.show();
                    contrato = smContrato.getSelected().data.idcontrato;
                    monto = parseFloat(smSolicitudes711.getSelected().data.valorreal)-parseFloat(smContrato.getSelected().data.totalcontratado);
                    Ext.Ajax.request({
                        url: 'EliminarCT',
                        params: {
                            idsolicitud711: smSolicitudes711.getSelected().data.idsolicitud711,
                            montoreal: monto,
                            idcontrato: contrato
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 1) {
                                mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                                stContrato.reload();
                                stCtFuentesF.removeAll();
                                stCtFormaPago.removeAll();
                                stDetallesEmbarq.removeAll();
                                stSolicitudes711.reload();
                                stMontoTotal.reload();
                            } else {
                                mostrarMensaje(2, 'Ha ocurrido un error.');
                            }
							mymask.hide();
                        }
                    });
                }

            });
       
}

function ControlBotonesCt(recct){
    btnAdicionarCt.enable();
    btnEliminarCt.disable();
    btnModificarCt.disable();
    btnGuaradarCtFuentes.disable();
    btnGuaradarCtFormaPago.disable();
    //btnAperturaCred.disable();
    rec=gpSolicitudes711.getSelectionModel().getSelected();
    btnAperturaCred.disable();
    ct=gpContrato.getStore().data.items.length;
    if(ct>0){
        btnAperturaCred.enable();
    } 
    if(rec != null) {
        if (rec.data.idsp != '5026') {
            btnEliminarCt.disable();
            btnModificarCt.disable();
            btnAdicionarCt.enable();
            btnGuaradarCtFuentes.disable();
            btnGuaradarCtFormaPago.disable();
            //btnAperturaCred.enable();
            if(recct!=null){
                btnEliminarCt.enable();
                btnModificarCt.enable();
            }
        }
        if (rec.data.idsp== '5026') {
            btnAdicionarCt.disable();
            btnEliminarCt.disable();
            btnModificarCt.disable();
            btnAperturaCred.disable();
        }
    }
}
function ControlBotonesCtAcc(recctacc){
    gpCtFormaPago.enable();
    gpListaDetalles.enable();
    rec=gpSolicitudes711.getSelectionModel().getSelected();
    if(rec != null) {
        if (rec.data.idsp != '5026') {
            if(recctacc!=null){
                btnGuaradarCtFuentes.enable();
            }
        }
        if (rec.data.idsp== '5026') {
            btnGuaradarCtFuentes.disable();
        }
    }
}
function ControlBotonesCtFormaPago(recctacc){
    rec=gpSolicitudes711.getSelectionModel().getSelected();
    if(rec != null) {
        if (rec.data.idsp != '5026') {
            if(recctacc!=null){
                btnGuaradarCtFormaPago.enable();
            }
        }
        if (rec.data.idsp== '5026') {
            btnGuaradarCtFormaPago.disable();
        }
    }
}