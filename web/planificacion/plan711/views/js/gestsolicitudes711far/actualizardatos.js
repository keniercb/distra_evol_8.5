actualizardatos = function () {

}

function ActualizarFechaAperturaCredito() {
   
    btnCancelarFP = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarFP',
        tooltip: perfil.etiquetas.lbTtCancenlarSol,
        text: 'Cancelar',
        handler: function () {
                ventanaFP.destroy();
        }
    });

    btnAceptarFP = new Ext.Button({
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarFP',
        text: 'Aceptar',
        tooltip: perfil.etiquetas.lbTtAceptarSol,
        handler: function () {
            if (pfinalFP.getForm().isValid()) {
                AperturarCancelar();
            } else {
                mostrarMensaje(2, 'Existen campos vacíos o con valores incorrectos.')
            }
        }
    });
    
    //Elementos para actualizar     
    FechaPresentacion = new Ext.form.DateField({
        disabled: false,
        fieldLabel: 'Fecha de presentacion',
        readOnly: true,
        allowBlank: false,
        format: 'Y-m-d h:i:s',
        width: 200
    });
        
    pDatosFP = new Ext.Panel({
        frame: true,
        width: 220,
        height: 60,
        items: [FechaPresentacion]
    });
    //fin
    
    pfinalFP = new Ext.FormPanel({
        layout: 'fit',
        frame: true,
        items: [pDatosFP]
    });
    ventanaFP = null;
    ventanaFP = new Ext.Window({
        title: 'Actualizar fecha de apertura de crédito',
        width: 250,
        constrain: true,
        layout: 'form',
        height: 110,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarFP, btnAceptarFP],
        items: [pfinalFP],
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {
            }
        }
    });
    ventanaFP.show();
}

function actualizarGerentePedido() {
   
    btnCancelarAct = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarSol',
        tooltip: perfil.etiquetas.lbTtCancenlarSol,
        text: 'Cancelar',
        handler: function () {
                ventanaAct.destroy();
        }
    });

    btnAceptarAct = new Ext.Button({
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarSol',
        text: 'Aceptar',
        tooltip: perfil.etiquetas.lbTtAceptarSol,
        handler: function () {
            if (pfinal.getForm().isValid()) {
                ActualizarDatosGerente();
                listarSolicitudes();
            } else {
                mostrarMensaje(2, 'Existen campos vacíos o con valores incorrectos.')
            }
        }
    });
    
    //Elementos para actualizar 
    NumeroPedido = new Ext.form.NumberField({
        disabled: false,
        fieldLabel: 'Número del pedido',
        allowBlank: false,
        width: 200,
        anchor: '80%'
    });
        
    stGerente = new Ext.data.Store({
        autoLoad: true,
        url: 'listarPersonas',
        listeners: {
            beforeload: function () {
                stGerente.baseParams.tipopers = 3;
                stGerente.baseParams.idempimp = cbEmpresasImp.getValue();
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idpersonadel711"
        }, [{
                name: 'idpersonadel711'
            }, {
                name: 'nombreapell'
            }]
                )
    });
    
    cbGerente = new Ext.form.ComboBox({
        id: 'idcbGerente',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stGerente,
        fieldLabel: 'Gerente',
        displayField: 'nombreapell',
        valueField: 'idpersonadel711',
        typeAhead: true,
        anchor: '80%',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
        }
    });
       
    FechaPresentacion = new Ext.form.DateField({
        disabled: false,
        fieldLabel: 'Fecha de presentación',
        readOnly: true,
        allowBlank: false,
        format: 'Y-m-d h:i:s',
        anchor: '80%',
        width: 200
    });
        
    pDatos = new Ext.Panel({
        frame: true,
        width: 300,
        height: 250,
        defaults:{labelAlign:'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: NumeroPedido
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: cbGerente
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: FechaPresentacion
                    }
                ]
            }]
    });
    //fin
    
    pfinal = new Ext.FormPanel({
        id: 'pfinal',
        layout: 'fit',
        frame: true,
        items: [pDatos]
    });
    ventanaAct = null;
    ventanaAct = new Ext.Window({
        title: 'Actualizar pedido y gerente',
        //id: 'ventanaCrud',
        width: 300,
        constrain: true,
        layout: 'form',
        height: 250,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAct, btnAceptarAct],
        items: [pfinal],
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {
            }
        }
    });
    ventanaAct.show();
}

function ActualizarDatosGerente(){
    Ext.Ajax.request({
        url: 'ActualizarDatosGerente',
        params: {
            idsolicitud711: smSolicitudes711.getSelected().data.idsolicitud711,
            nopedido: NumeroPedido.getValue(),
            idgerente: cbGerente.getValue(),
            fechapres: FechaPresentacion.getRawValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData) {
                if (responseData.codMsgD == 1) {
                    mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                    ventanaAct.destroy();
                    stSolicitudes711.reload();
                } else if (responseData.codMsgD == 2) {
                    mostrarMensaje(1, 'dsdfgdg');
                }
            }
        }
    });
}

function CambiarSituacionPedido(idsituacionpedido, text){
    mostrarMensaje(2, '¿Está seguro que desea asignar \nla situación al pedido '+text+'?', function (btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            Ext.Ajax.request({
                url: 'CambiarSituacionPedido',
                params: {
                    idsolicitud711: smSolicitudes711.getSelected().data.idsolicitud711,
                    idsituacionpedido: idsituacionpedido,
                    msgmotivo: msgmotivo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (responseData.codMsgD == 1) {
                            mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                            listarSolicitudes();
                            if(responseData.usuarios.length>0){
                                setTimeout(function(){
                                    mostrarMensaje(2, 'Se ha detectado una configuración de notificaciones');
                                    ListaUsuariosNotificar(responseData.usuarios,1);
                                }, 4000);                                
                            }
                        } else {
                            mostrarMensaje(1, responseData.codMsgD);
                        } 

                    }
		    mymask.hide();
                }
            });
        }
    }); 
}

function AperturarCancelar(){
    fecha= FechaPresentacion.getRawValue();
	mymask.show();
    Ext.Ajax.request({
        url: 'AperturarCancelar',
        params: {
            idsolicitud711: smSolicitudes711.getSelected().data.idsolicitud711,
            fecha: fecha
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData) {
                if (responseData.codMsgD == 1) {
                    mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                    ventanaFP.destroy();
                    stSolicitudes711.reload();
                } else if (responseData.codMsgD == 2) {
                    mostrarMensaje(1, responseData.msg);
                }
            }
			mymask.hide();
        }
    });
}
    
function WpActualizarSuministros() {
    contdeguardar=0;
   
    btnCerrarFP = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCerrarFP',
        tooltip: 'Cerrar',
        text: 'Cerrar',
        handler: function () {
                ventanaFP.destroy();
                if(contdeguardar>0){
                    stSolicitudes711.reload();
                }
        }
    });
    
    //Elementos para actualizar de solicitud general     
    stProductosSuministrados = new Ext.data.Store({
        url: 'listarProductosSeleccionados',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idproducto711'
            }, {
                name: 'codigocup'
            }, {
                name: 'suministro'
            }, {
                name: 'precio'
            }, {
                name: 'cantidad'
            },{
                name: 'valor'
            },{
                name: 'distribuido'
            },{
                name: 'falta'
            }, {
                name: 'unidadmedida'
            }
        ]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stProductosSuministrados.removeAll();              
                stProductosSuministrados.baseParams.idsolp = idsolp;                
            },
            load: function (store, record, options) {

            }
        }
    });
    
    cmProductos1 = new Ext.grid.ColumnModel([
        {
            header: "Descripción de suministro",
            dataIndex: 'suministro',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "UM",
            dataIndex: 'unidadmedida',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Monto total",
            dataIndex: 'valor',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Cantidad",
            tooltip: "Cantidad",
            dataIndex: 'cantidad',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: "Distribuido",
            tooltip: "Distribuido",
            dataIndex: 'distribuido',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({                
                id: 'coldistrib',
                allowNegative: true,
                decimalPrecision: 2,
                allowBlank: false,
                maxLength: 19
            })
        },{
            header: "Falta",
            tooltip: "Falta",
            dataIndex: 'falta',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        }
    ]);

    smProductos1 = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
             rowselect : function (sm, y, rec) {
                 gpEntProdConsolidado.enable();
                 stEntProdConsolidado.reload();
            }
        }
    });
    
    btnLimpiarProd = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrosProductos1.clearFilters();
        }
    });

    btnGuardarAct = new Ext.Button({
        handler: function () {
            ActualizarSuministros();
        },
        tooltip: 'Guardar valores',
        disabled: false,
        iconCls: 'guardar',
    }); 
    
    gpProductos1 = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stProductosSuministrados,
        sm: smProductos1,
        disabled: false,
        region: 'center',
        width: 920,
        height: 320,
        autoExpandColumn: 'expandir',
        cm: cmProductos1,
        title: 'Suministros a importar: '+nosol,
        tbar: [btnGuardarAct],
        bbar: new Ext.PagingToolbar({
            store: stProductosSuministrados,
            displayInfo: true,
            items: [btnLimpiarProd],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        //plugins: filtrosProductos1,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                if(smSolicitudes711.getSelected().data.esconsolidada==false){
                    gpProductos1.getColumnModel().setEditable(col_id, true);
                }
            },
            afteredit: function (e) {
                console.log(e);
            }
        }
    });
        
    pDatosFP = new Ext.Panel({
        frame: true,
        width: 930,
        height: 330,
        region: 'center',
        layout: 'border',
        items: [gpProductos1]
    });
    //fin
    
    //Elementos para actualizar por soolicitud consolidada    
    stEntProdConsolidado = new Ext.data.Store({
        url: 'ListarEntProdConsolidado',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idproducto711'
            }, {
                name: 'idsolicitud711'
            }, {
                name: 'nombreentidad'
            }, {
                name: 'valor'
            }, {
                name: 'cantidad'
            },{
                name: 'distribuido'
            },{
                name: 'falta'
            }
        ]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stEntProdConsolidado.removeAll();
                stEntProdConsolidado.baseParams.idproducto711 = smProductos1.getSelected().data.idproducto711;               
                stEntProdConsolidado.baseParams.idsolp = idsolp;                
            },
            load: function (store, record, options) {

            }
        }
    });
    
    cmEntProdConsolidado = new Ext.grid.ColumnModel([
        {
            header: "Entidad",
            dataIndex: 'nombreentidad',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Monto total",
            dataIndex: 'valor',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Cantidad",
            tooltip: "Cantidad",
            dataIndex: 'cantidad',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: "Distribuido",
            tooltip: "Distribuido",
            dataIndex: 'distribuido',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 2,
                allowBlank: false,
                maxLength: 19
            })
        },{
            header: "Falta",
            tooltip: "Falta",
            dataIndex: 'falta',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        }
    ]);

    smEntProdConsolidado = new Ext.grid.RowSelectionModel({
        singleSelect: true,
    });
    
    btnLimpiarEntProdConsolidado = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btnLimpiarEntProdConsolidado',
        disabled: false,
        handler: function () {
            filtrosProductos1.clearFilters();
        }
    });

    btnGuardarbEntProdConsolidado = new Ext.Button({
        handler: function () {
            ActualizarSuministros();
        },
        tooltip: 'Guardar valores',
        disabled: false,
        iconCls: 'guardar',
    }); 
    
    gpEntProdConsolidado = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stEntProdConsolidado,
        sm: smEntProdConsolidado,
        disabled: true,
        region: 'center',
        width: 920,
        height: 290,
        //layout: 'fit',
        autoExpandColumn: 'expandir',
        cm: cmEntProdConsolidado,
        title: 'Distribución del suministro por entidad',
        tbar: [btnGuardarbEntProdConsolidado],
        bbar: new Ext.PagingToolbar({
            store: stEntProdConsolidado,
            displayInfo: true,
            items: [btnLimpiarEntProdConsolidado],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        //plugins: filtrosProductos1,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpEntProdConsolidado.getColumnModel().setEditable(col_id, true);

            },
            afteredit: function (e) {
                console.log(e);
            }
        }
    });
        
    pEntProdConsolidado = new Ext.Panel({
        frame: true,
        width: 930,
        height: 330,
        region: 'west',
        //layout: 'border',
        items: [gpEntProdConsolidado]
    });
    //fin
    
    pfinalFP = new Ext.Panel({
        frame: true,
        width: 950,
        height: 430,
         autoScroll: true,
        //layout: 'fit',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: pDatosFP
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: pEntProdConsolidado
                    }
                ]

            }]
    });
    
    h=460;
    w=960;
    
    if(smSolicitudes711.getSelected().data.esconsolidada==false){
        h=400;
        pEntProdConsolidado.hide();
        if(smSolicitudes711.getSelected().data.estaconsolidada==true){
            btnGuardarAct.hide();
        }
    }else{
        Ext.getCmp('coldistrib').disable();        
        btnGuardarAct.hide();
    }
    
    ventanaFP = null;
    ventanaFP = new Ext.Window({
        title: 'Distribuir producto suministrados',
        width: w,
        height: h,
        constrain: true,
        layout: 'form',
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCerrarFP],
        items: [pfinalFP],
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {
            }
        }
    });
    ventanaFP.show();
}

function ActualizarSuministros(){
    productoerroneo = null;
    var productos = [];
    if(smSolicitudes711.getSelected().data.esconsolidada==false){
        for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
            if(parseFloat(gpProductos1.getStore().data.items[i].data.cantidad)>=parseFloat(gpProductos1.getStore().data.items[i].data.distribuido)){
                productos.push(gpProductos1.getStore().data.items[i].data);
            }else{
                productoerroneo = gpProductos1.getStore().data.items[i].data.suministro;
            }
        }
    }else{
        for (i = 0; i < gpEntProdConsolidado.getStore().data.items.length; i++) {
            if(parseFloat(gpEntProdConsolidado.getStore().data.items[i].data.cantidad)>=parseFloat(gpEntProdConsolidado.getStore().data.items[i].data.distribuido)){
                productos.push(gpEntProdConsolidado.getStore().data.items[i].data);
            }else{
                productoerroneo = smProductos1.getSelected().data.suministro + ' de la entidad '+smEntProdConsolidado.getSelected().data.nombreentidad;
            }
        }
    }
    
    if(productoerroneo == null){
        mymask.show();
        Ext.Ajax.request({
            url: 'ActualizarSuministros',
            params: {
                idsolicitud711: idsolp,
                esconsolidada: smSolicitudes711.getSelected().data.esconsolidada,
                productos: Ext.encode(productos)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData) {
                    if (responseData.codMsgD == 1) {
                        mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                        if(smSolicitudes711.getSelected().data.esconsolidada==true){
                            stEntProdConsolidado.reload();
                        }
                        stProductosSuministrados.reload();
                        contdeguardar++;
                    } else if (responseData.codMsgD == 2) {
                        mostrarMensaje(1, responseData.msg);
                    }
                }
		mymask.hide();
            }
        });
    }else{
        mostrarMensaje(1, 'La cantidad del producto '+productoerroneo+' es menor al valor que intenta poner como distribuido');
    }
}

function WpPrecioConsolidados() {
    bandera=false;
   
    btnCerrarFP = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCerrarFP',
        tooltip: 'Cerrar',
        text: 'Cerrar',
        handler: function () {
            if (bandera == true) {
                valor = (parseFloat(smProductos1.getSelected().data.cantidad) * parseFloat(Precio.getValue())).toFixed(2);
                smProductos1.getSelected().data.valor = addCommas(valor);
                total = 0;
                for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
                    auxv = '' + gpProductos1.getStore().data.items[i].data.valor;
                    total += parseFloat(auxv.replace(/,/g, ''));
                }
                totalgeneral.setValue(addCommas(total.toFixed(2)));
                ActualizarListProd();
            }
            ventanaFP.destroy();
        }
    });
    
    //Elementos para actualizar de precio     
    Precio = new Ext.form.NumberField({
        disabled: false,
        fieldLabel: 'Nuevo precio',
        value: smProductos1.getSelected().data.precio,
        allowBlank: false,
        width: 100,
        minValue:0.01        
    });
    
    btnActualizarPrecios = new Ext.Button({
//        iconCls: 'cancelar',
        id: 'btnActualizarPrecios',
        tooltip: 'Actualizar Precios',
        text: 'Actualizar',
        handler: function () {
            bandera=true;
            ActualizarPreciosConsolidados();
        }
    });
    //fin
    
    //Elementos para actualizar por soolicitud consolidada 
    stEntProdConsolidadoAux = new Ext.data.SimpleStore({
        fields: [{
                name: 'idsolicitudproductos'
            }, {
                name: 'idproducto711'
            }, {
                name: 'idsolicitud711'
            }, {
                name: 'textnosolicitudo'
            },{
                name: 'precio'
            }, {
                name: 'valor'
            }, {
                name: 'cantidad'
            },{
                name: 'totalgeneral'
            }
        ]
    });
    
    stEntProdConsolidado = new Ext.data.Store({
        url: 'ListarEntProdConsolidado',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idsolicitudproductos'
            }, {
                name: 'idproducto711'
            }, {
                name: 'idsolicitud711'
            }, {
                name: 'textnosolicitudo'
            },{
                name: 'precio'
            }, {
                name: 'valor'
            }, {
                name: 'cantidad'
            },{
                name: 'totalgeneral'
            }
        ]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stEntProdConsolidado.removeAll();
                stEntProdConsolidado.baseParams.idproducto711 = smProductos1.getSelected().data.idproducto711;               
                stEntProdConsolidado.baseParams.idsolp = idsolp;                
            },
            load: function (store, record, options) {

            }
        }
    });
    
    cmEntProdConsolidado = new Ext.grid.ColumnModel([
        {
            header: "N. solicitud",
            dataIndex: 'textnosolicitudo',
            id: 'expandir',
            width: 130,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Precio",
            tooltip: "Precio",
            dataIndex: 'precio',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
//            editor: new Ext.form.NumberField({
//                allowNegative: true,
//                decimalPrecision: 0,
//                allowBlank: false,
//                maxLength: 19
//            })
        },{
            header: "Cantidad",
            tooltip: "Cantidad",
            dataIndex: 'cantidad',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
//            editor: new Ext.form.NumberField({
//                allowNegative: true,
//                decimalPrecision: 0,
//                allowBlank: false,
//                maxLength: 19
//            })
        },{
            header: "Monto total",
            dataIndex: 'valor',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Total general",
            tooltip: "Total general",
            dataIndex: 'totalgeneral',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        }
    ]);

    smEntProdConsolidado = new Ext.grid.RowSelectionModel({
        singleSelect: true,
    });
    
    gpEntProdConsolidado = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stEntProdConsolidado,
        sm: smEntProdConsolidado,
//        disabled: true,
        region: 'center',
        width: 550,
        height: 290,
        //layout: 'fit',
        autoExpandColumn: 'expandir',
        cm: cmEntProdConsolidado,
        title: 'Distribución del suministro por entidad',
//        tbar: [btnGuardarbEntProdConsolidado],
        bbar: new Ext.PagingToolbar({
            store: stEntProdConsolidado,
            displayInfo: true,
//            items: [btnLimpiarEntProdConsolidado],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        //plugins: filtrosProductos1,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpEntProdConsolidado.getColumnModel().setEditable(col_id, true);

            },
            afteredit: function (e) {
                console.log(e);
            }
        }
    });
    //fin
    
    pfinalFP = new Ext.Panel({
        frame: true,
        width: 580,
        height: 420,
//         autoScroll: true,
        //layout: 'fit',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: Precio
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: btnActualizarPrecios
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: gpEntProdConsolidado
                    }
                ]

            }]
    });

    
    ventanaFP = null;
    ventanaFP = new Ext.Window({
        title: 'Actualizar precios de producto de solicitudes consolidadas',
        width: 580,
        height: 420,
        constrain: true,
        layout: 'form',
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCerrarFP],
        items: [pfinalFP],
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {
            }
        }
    });
    ventanaFP.show();
}

function ActualizarPreciosConsolidados(){
    precioudp=Precio.getValue();
    
    cantidad=0;
    totalgenaux1=0;
    totalgenaux2=0;
    auxprecios = [];
    auxL1= gpEntProdConsolidado.getStore().data.items.length;
    for (var i = 0; i < auxL1; i++) {
        totalgenaux1=gpEntProdConsolidado.getStore().data.items[i].data.totalgeneral-gpEntProdConsolidado.getStore().data.items[i].data.valor;

        gpEntProdConsolidado.getStore().data.items[i].data.precio = precioudp;
        cantidad = gpEntProdConsolidado.getStore().data.items[i].data.cantidad;
        totalgenaux2 = cantidad * precioudp;
        gpEntProdConsolidado.getStore().data.items[i].data.valor = totalgenaux2;
        gpEntProdConsolidado.getStore().data.items[i].data.totalgeneral=totalgenaux1+totalgenaux2;
        auxprecios.push([
            gpEntProdConsolidado.getStore().data.items[i].data.idsolicitudproductos,
            gpEntProdConsolidado.getStore().data.items[i].data.idproducto711,
            gpEntProdConsolidado.getStore().data.items[i].data.idsolicitud711,
            gpEntProdConsolidado.getStore().data.items[i].data.textnosolicitudo,
            precioudp,
            totalgenaux2,
            gpEntProdConsolidado.getStore().data.items[i].data.cantidad,
            totalgenaux1+totalgenaux2
        ]);
    }
    stEntProdConsolidadoAux.removeAll();
    stEntProdConsolidadoAux.loadData(auxprecios);
    gpEntProdConsolidado.reconfigure(stEntProdConsolidadoAux, cmEntProdConsolidado);
    
    smProductos1.getSelected().data.precio=addCommas(precioudp);


//    if(productoerroneo == null){
        mymask.show();
        Ext.Ajax.request({
            url: 'ActualizarSuministros',
            params: {
                tipoudp: 1,
                solicitudes: Ext.encode(auxprecios)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData) {
                    if (responseData.codMsgD == 1) {
                        mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                    } else if (responseData.codMsgD == 2) {
                        mostrarMensaje(1, responseData.msg);
                    }
                }
		mymask.hide();
            }
        });
//    }else{
//        mostrarMensaje(1, 'La cantidad del producto '+productoerroneo+' es menor al valor que intenta poner como distribuido');
//    }
}

function ListaUsuariosNotificar(listaUsuarios, tiponotificicacion) {//Inicio de declaracion

    checkColumnUsuarios = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function() {
                if (!checkColumnUsuarios.hasSelection()) {
                    Ext.getCmp('btnaplicar').disable();
                } else {
                    Ext.getCmp('btnaplicar').enable();
                }
            },
            rowdeselect: function() {
                if (!checkColumnUsuarios.hasSelection()) {
                    Ext.getCmp('btnaplicar').disable();
                } else {
                    Ext.getCmp('btnaplicar').enable();
                }
            }
        }

    });
            
    var cmGpUsuarios = new Ext.grid.ColumnModel([
        checkColumnUsuarios, {
            hidden: true,
            hideable: false,
            dataIndex: 'idusuario'
        }, {
            header: 'Usuario',
            width: 80,
            dataIndex: 'nombreusuario'
        },{
            hidden: true,
            hideable: false,
            dataIndex: 'idcontacto'
        }, {
            header: 'Correo',
            width: 80,
            dataIndex: 'contacto'
        },{
            hidden: true,
            hideable: false,
            dataIndex: 'idsolicitud711'
        }, {
            header: 'Solicitud',
            id: 'expandir',
            width: 100,
            dataIndex: 'solicitud'
        }
    ]);

    var smGpUsuarios = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    
    stUsuarios = new Ext.data.SimpleStore({
        fields: [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }, {
                name: 'idcontacto'
            }, {
                name: 'contacto'
            }, {
                name: 'idsolicitud711'
            },{
                name: 'solicitud'
            }
        ]
    });

    var gpUsuarios = new Ext.grid.GridPanel({
        store: stUsuarios,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        cm: cmGpUsuarios,
        sm: checkColumnUsuarios,
        autoExpandColumn: 'expandir',
        region: 'center',
    });

    winUsuarios = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        width: 350,
        layout: 'fit',
        items: gpUsuarios,
        height: 400,
        title: 'Lista de Usuarios a notificar',
        listeners: {
        },
        buttons: [{
                id: 'idcancel',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: 'Cancelar',
                handler: function() {
                    winUsuarios.destroy();
                }
            }, {
                disabled: true,
                id: 'btnaplicar',
                iconCls: 'aceptar',
                tooltip: 'Cerrar y notificar los seleccionados',
                text: 'Aceptar',
                handler: function() {
                    GenerarNotificaciones(tiponotificicacion);
                    
                }
            }]
    });
    user=[];
    for (i = 0; i < listaUsuarios.length; i++) {
        user.push([
            listaUsuarios[i].idusuario,
            listaUsuarios[i].nombreusuario,
            listaUsuarios[i].idcontacto,
            listaUsuarios[i].contacto,
            listaUsuarios[i].idsolicitud711,
            listaUsuarios[i].solicitud
        ]);
    }
    
    stUsuarios.removeAll();
    stUsuarios.loadData(user);
    //gpProductos1.reconfigure(stProductosLista, cmProductos1);

    winUsuarios.show();

}

function GenerarNotificaciones(tiponotificacion) {
    var indicadoresPlanes = new Array();
    user = [];
    userchek = checkColumnUsuarios.getSelections();
    contind=1;
    if (checkColumnUsuarios.hasSelection()){
        auxL = checkColumnUsuarios.getSelections().length;
        //console.log(checkColumnUsuarios.getSelections());
        for (var i = 0; i < auxL; i++) {
            user.push(userchek[i].data);

        }
    }
    console.log(user);
    mymask.show();
    Ext.Ajax.request({
        url: 'GenerarNotificaciones',
        params: {
            listauser: Ext.encode(user),
            tiponotificacion: tiponotificacion,
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            
            if (responseData) {
                if (responseData.codMsgD == 1) {
                    mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                    winUsuarios.destroy();
                } else if (responseData.codMsgD == 2) {
                    mostrarMensaje(1, 'Ha existido un problema para notificar a todos los correos');
                }
                mymask.hide();
            }
            //mymask.hide();
        }
    });
}
