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
        fieldLabel: 'Fecha de presentación',
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
            })
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
    
    //Elementos para actualizar     
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
                gpProductos1.getColumnModel().setEditable(col_id, true);

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
        items: [gpProductos1]
    });
    //fin
    
    pfinalFP = new Ext.FormPanel({
        layout: 'fit',
        frame: true,
        items: [pDatosFP]
    });
    ventanaFP = null;
    ventanaFP = new Ext.Window({
        title: 'Cantidad de productos suministrados',
        width: 950,
        height: 400,
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
    for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
        if(parseFloat(gpProductos1.getStore().data.items[i].data.cantidad)>=parseFloat(gpProductos1.getStore().data.items[i].data.distribuido)){
            productos.push(gpProductos1.getStore().data.items[i].data);
        }else{
            productoerroneo = gpProductos1.getStore().data.items[i].data.suministro;
        }
    }
    if(productoerroneo == null){
		mymask.show();
        Ext.Ajax.request({
            url: 'ActualizarSuministros',
            params: {
                idsolicitud711: idsolp,
                productos: Ext.encode(productos)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData) {
                    if (responseData.codMsgD == 1) {
                        mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                        stProductosSuministrados.reload();
                    } 
                    contdeguardar++;
                }
				mymask.hide();
            }
        });
    }else{
        mostrarMensaje(1, 'La cantidad del producto '+productoerroneo+' es menor al valor que intenta poner como distribuido');
    }
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
                } else {
                    mostrarMensaje(1, responseData.msg);
                }
                mymask.hide();
            }
            //mymask.hide();
        }
    });
}