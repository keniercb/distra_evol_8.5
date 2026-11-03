agregarmodificar = function () {

}

function winFp(tiponotificacion,accion) {
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
                AdicionarModificar(tiponotificacion,accion, 1);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    btnAceptarAdd = new Ext.Button({
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarAdd',
        text: perfil.etiquetas.lbtnAceptarAdd,
        tooltip: perfil.etiquetas.lbTtAceptarAdd,
        handler: function () {
            if (pfinal.getForm().isValid()) {
                AdicionarModificar(tiponotificacion,accion,0);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    stNomenclador = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stNomenclador.baseParams.uri = (tiponotificacion==1)? 23:4;
            },
            load: function (t) {
                mymask.hide();
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
        
    cbNomenclador = new Ext.form.ComboBox({
        id: 'cbNomenclador',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stNomenclador,
        fieldLabel: (tiponotificacion==1)? 'Estados de aprobación': 'Situcion de pedido',
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        //anchor: '80%',
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
    
    checkROL = [];
    checkIDROL = [];
    stRoles711 = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarRoles',
        listeners: {
            beforeload: function () {
                
            },
            load: function (t) {
                if(accion==2){
                    checkROL =  smCfgEstado.getSelected().data.listaroles;
                    checkIDROL = smCfgEstado.getSelected().data.listaidrol;
                    checkIDROL = checkIDROL.replace('{','');
                    checkIDROL = checkIDROL.replace('}','');
                    console.log(checkIDROL);
                    if(tiponotificacion==1){
                        cbNomenclador.setValue(smCfgEstado.getSelected().data.idestadoaprobacion);
                        cbRoles711.setRawValue(smCfgEstado.getSelected().data.listaroles);
//                        cbRoles711.setValue(smCfgEstado.getSelected().data.listaidrol);
                        TextoNotificaciones.setValue(smCfgEstado.getSelected().data.textonotificacion);
                        chkSobreConsolidacion.setValue(smCfgEstado.getSelected().data.paraconsolidacion);
                    }else{
                        cbNomenclador.setValue(smCfgSS.getSelected().data.idsituacionpedido);
//                        cbRoles711.setValue(smCfgSS.getSelected().data.idrol);
                        cbRoles711.setRawValue(smCfgEstado.getSelected().data.listaroles);
//                        cbRoles711.setValue(smCfgEstado.getSelected().data.listaidrol);    
                        TextoNotificaciones.setValue(smCfgSS.getSelected().data.textonotificacion);
                        chkSobreConsolidacion.setValue(smCfgSS.getSelected().data.paraconsolidacion);
                    }
                    cbNomenclador.disable();
//                    cbRoles711.disable();
                    
                }   
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'idrol'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    cbRoles711 = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        enableQtip: true,
        fieldLabel: 'Rol',
        displayField: 'denominacion',
        id: 'cbRoles711',
        valueField: 'idrol',
        store: stRoles711,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'denominacion',
        triggerAction: 'all',
        editable: true,
        width: 200,
        mode: 'remote',
        emptyText: 'Seleccione',
        listeners: {
            expand: function (cb) {
//                cb.store.reload();
            },
            change: function (cb, newV, oldV) {
                cbRoles711 = true;
                checkROL = [];
                checkIDROL = [];
                checkROL = cb.getRawValue();
                checkIDROL = newV;
//                var valoresN = newV.split(',');
//                for (var i = 0; i < valoresN.length; i++) {
//                    checkROL.push({id: valoresN[i]});
//                }
                console.log(checkROL);
                console.log(cb.getRawValue());
            }
        }
    });
    
    TextoNotificaciones = new Ext.form.TextArea({
        //id: 'AntecedenteCompra',
        allowBlank: false,
        fieldLabel: 'Notificación',
        emptyText: 'Texto',
        width: 200,
        height: 100
    });
    
    chkSobreConsolidacion = new Ext.form.Checkbox({
        align: 'right',
        fieldLabel: 'Para consolidaciones',
        labelAlign: 'right',
        listeners: {
            check: function (ck, t) {
            }
        }
    });
    
    pDatos = new Ext.Panel({
        //id: 'pDatosGen',
        frame: true,
        layout: 'fit',
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: cbNomenclador
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: cbRoles711
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: TextoNotificaciones
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: chkSobreConsolidacion,
                        labelAlign: 'right',
                        labelWidth: 180
                    }
                ]

            }]
    });
    
    pfinal = new Ext.FormPanel({
        id: 'pfinal',
        layout: 'fit',
        frame: true,
        width: 250,
        height: 350,
        items: [pDatos],
        listeners: {
        }
    });
    ventanaCrud = null;
    if (accion == 1) {
        ventanaCrud = new Ext.Window({
            title: 'Adicionar notificación 711 por '+((tiponotificacion==1)? 'Estados de aprobación': 'Situcion de pedido'),
            //id: 'ventanaCrud',
            width: 265,
            constrain: true,
            layout: 'form',
            height: 390,
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarAdd, btnAplicarAdd, btnAceptarAdd],
            items: [pfinal],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
    }
    if (accion == 2) {
        
        ventanaCrud = new Ext.Window({
            title: 'Modificar notificación 711 por '+((tiponotificacion==1)? 'Estados de aprobación': 'Situcion de pedido'),
            //id: 'ventanaCrud',
            width: 265,
            constrain: true,
            layout: 'form',
            height: 450,
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarAdd, btnAceptarAdd],
            items: [pfinal],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
    }
    mymask.show();
    if(cbTipoPlan.getValue()==1254){
        chkSobreConsolidacion.hide();
        chkSobreConsolidacion. hideLabel=true;
    }
    
    ventanaCrud.show();
//    if (accion == 1) {
//        //mymask.hide();
//    }
}

function AdicionarModificar(tiponotificacion,accion, aplicar) {
    idnotificaciones711 = null;
    if(accion==2){
        if(tiponotificacion==1){
            idnotificaciones711 = smCfgEstado.getSelected().data.idnotificaciones711;
        }else{
            idnotificaciones711 = smCfgSS.getSelected().data.idnotificaciones711;
        }
        
    }
    mymask.show();
        Ext.Ajax.request({
            url: 'adicionarModificar',
            params: {
                tiponotificacion: tiponotificacion,
                idnomenclador: cbNomenclador.getValue(),
//                idrol: cbRoles711.getValue(),
                listaidrol: Ext.encode(checkIDROL),
                listaroles: Ext.encode(checkROL),
                textonotificacion: TextoNotificaciones.getValue(),
                idtipoplan: cbTipoPlan.getValue(),
                idcc: (tiponotificacion==1)? cbCC1.getValue(): null,
                accion: accion,
                paraconsolidacion : chkSobreConsolidacion.getValue(),
                idnotificaciones711: idnotificaciones711
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == '1') {
                    var postaccion = (accion == 1) ? 'adicionado' : 'modificado';
                    mostrarMensaje(1, 'La notificacion se ha ' + postaccion + ' satisfactoriamente');
                    if(tiponotificacion==1){
                        stCfgEstado.reload();
                    }else{
                        stCfgSS.reload();
                    }
                    if(aplicar==1){
                        cbNomenclador.reset();
                        cbRoles711.reset();
                        TextoNotificaciones.reset();
                    }else{
                        ventanaCrud.destroy();
                    }                    
                } else {
                    var verboaccion = (accion == 1) ? 'adicionar' : 'modificar';
                    mostrarMensaje(2, responseData.mensaje);
                }
            }
        });

}

function Eliminar(idnotificaciones711, tiponotificacion) {
    mymask.show();
    Ext.Ajax.request({
        url: 'EliminarConfiguracion',
        params: {
            idnotificaciones711: idnotificaciones711
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                if (tiponotificacion == 1) {
                    stCfgEstado.reload();
                } else {
                    stCfgSS.reload();
                }
                mostrarMensaje(1, 'La notificacion se ha eliminado satisfactoriamente');
            } else {
                mostrarMensaje(2, 'Ha ocurrido un error, contacte al administrador');
            }
        }
    });

}

function ListaDeUsuarios() {

    btnCerrar = new Ext.Button({
        iconCls: 'cancelar',
        tooltip: 'Cerrar ventana',
        text: 'Cerrar',
        handler: function () {
            ventanaCrud.destroy();
        }
    });
    
    btnActualizarListaUser = new Ext.Toolbar.Button({
        tooltip: 'Actualizar lista de usuarios a notificar',
        id: 'btnActualizarListaUser',
        iconCls: 'actualizar',
        handler: function () {
            ActualizarListaDeUsuarios();
        }
    });
    btnGuardarCambios = new Ext.Toolbar.Button({
        tooltip: 'Guardar cambios',
        id: 'btnGuardarCambios',
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            GuardarCorreos();
        }
    });

    stListaUserANotificar = new Ext.data.Store({
        autoLoad: true,
        url: 'listarUserNotificar',
        listeners: {
            beforeload: function () {
//                stListaUserANotificar.baseParams.uri = (tiponotificacion==1)? 23:4;
            },
            load: function (t) {
                mymask.hide();
            }
        },//idusernotificar, nombreusuario, idsuario, rol, idrol, entidad,identidad
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idusernotificar"
        }, [{
                name: 'idusernotificar'
            }, {
                name: 'nombreusuario'
            },{
                name: 'idusuario'
            }, {
                name: 'rol'
            },{
                name: 'idrol'
            }, {
                name: 'entidad'
            },{
                name: 'identidad'
            },{
                name: 'idpersona'
            }, {
                name: 'idcontacto'
            },{
                name: 'contacto'
            }]
        )
    });
    
    cmListaUserANotificar = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),{
            header: 'Nombre usuario',
            dataIndex: 'nombreusuario',
            width: 100,
            align: 'left',
            renderer: crearToolTip
        }, {
            header: 'Rol',
            dataIndex: 'rol',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        }, {
            header: 'Entidad',
            dataIndex: 'entidad',
            id: 'expandir',
            width: 200,
            align: 'rigth',
            renderer: crearToolTip
        }, {
            header: 'idusuario',
            dataIndex: 'idusuario',
            hidden: true
        }, {
            header: 'idrol',
            dataIndex: 'idrol',
            hidden: true
        }, {
            header: 'identidad',
            dataIndex: 'identidad',
            hidden: true
        }, {
            header: 'Tiene Persona',
            dataIndex: 'idpersona',
            width: 100,
            align: 'rigth',
            renderer: renderTienePersona
        }, {
            header: "Contacto",
            dataIndex: 'contacto',
            width: 200,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.TextField({
                allowBlank: true,
                maxLength: 50,
                maxText: 'El tama&#241;o m&#225;ximo requerido es de 50 caracteres.',
                regex: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                regexText: 'Formato: usuario@dominio.ext',
                anchor: '95%'
            })
        }, {
            header: 'idcontacto',
            dataIndex: 'idcontacto',
            hidden: true
        }
    ]);

        this.tfemailfacturar = 
    
    smListaUserANotificar = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
        }
    });
    
    filtrosListaUserANotificar = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'nombreusuario'
            }, {
                type: 'string',
                dataIndex: 'entidad'
            }, {
                type: 'string',
                dataIndex: 'rol'
            },  {
                type: 'string',
                dataIndex: 'contacto'
            }]
    });
    
    gpListaUserANotificar = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stListaUserANotificar,
        sm: smListaUserANotificar,
        autoExpandColumn: 'expandir',
        cm: cmListaUserANotificar,
        tbar: [btnActualizarListaUser, btnGuardarCambios],
        region: 'center',
        layout: 'fit',
        width: 600,
        height: 350,
        loadMask: {
            msg: 'Cargando...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpListaUserANotificar.getColumnModel().setEditable(col_id, true);
                btnGuardarCambios.enable();
            },
            afteredit: function (e) {
                console.log(e);
                listademodificados.push(e.record.data);
                console.log(listademodificados);
                /*evalor='';
                if (e.field == 'cantidad') {
                    evalor=''+e.record.data.precio;
                    valor = (parseFloat(e.record.data.cantidad) * parseFloat(evalor.replace(/,/g, ''))).toFixed(6);
                    smProductos1.selectRow(e.row);
                    smProductos1.getSelected().data.valor = addCommas(valor);
                    smProductos1.getSelected().commit();
                    smProductos1.selectNext();
                }
                if (e.field == 'precio') {
                    evalor=''+e.record.data.precio;
                    valor = (parseFloat(e.record.data.cantidad) * parseFloat(evalor.replace(/,/g, ''))).toFixed(6);
                    smProductos1.selectRow(e.row);
                    smProductos1.getSelected().data.valor = addCommas(valor);
                    smProductos1.getSelected().commit();
                    smProductos1.selectNext();
                }
                sumintotal = 0;
                auxv='';
                for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
                    auxv = ''+gpProductos1.getStore().data.items[i].data.valor;
                    sumintotal += parseFloat(auxv.replace(/,/g,''));
                }
                suministro.setValue(addCommas(parseFloat(sumintotal).toFixed(6)));
                valorporciento = porcientodeGastos.getValue() / 100;
                otrog = (parseFloat(sumintotal) * parseFloat(valorporciento)).toFixed(6);
                otrosgastos.setValue(addCommas(otrog));
                totalg = parseFloat(parseFloat(otrog) + parseFloat(sumintotal)).toFixed(6);
                totalgeneral.setValue(addCommas(totalg));
                ActualizarListProd();*/
            }
        },
        plugins: filtrosListaUserANotificar,
    });

    
    pfinal = new Ext.FormPanel({
        id: 'pfinal',
        layout: 'fit',
        frame: true,
        items: [gpListaUserANotificar],
        listeners: {
        }
    });
    ventanaCrud = new Ext.Window({
        title: 'Lista de usuarios a notificar',
        //id: 'ventanaCrud',
        width: 700,
        height: 430,
        constrain: true,
        layout: 'form',
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCerrar],
        items: [pfinal],
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {
            }
        }
    });
    
//    mymask.show();
    ventanaCrud.show();
}

function ActualizarListaDeUsuarios() {
    mymask.show();
    Ext.Ajax.request({
        url: 'ActualizarListaDeUsuarios',
        params: {
//            idnotificaciones711: idnotificaciones711
        },
        callback: function (options, success, response) {
            mymask.hide();
//            stListaUserANotificar.reload();
            stListaUserANotificar.removeAll();
//            responseData = Ext.decode(response.responseText);
//            if (responseData.mensaje == 1) {  
//                stListaUserANotificar.removeAll();
                mostrarMensaje(1, 'Se ha actualizado la lista de usuarios a notificar satisfactoriamente');
                stListaUserANotificar.reload();
//            } else {
//                mostrarMensaje(2, 'Ha ocurrido un error, contacte al administrador');
//            }
        }
    });

}

function GuardarCorreos() {
    console.log(listademodificados);
    mymask.show();
    Ext.Ajax.request({
        url: 'GuardarCorreos',
        params: {
            listausuarios: Ext.encode(listademodificados)
        },
        callback: function (options, success, response) {
            mymask.hide();
            var responseData = Ext.decode(response.responseText);
            listademodificados = [];
            if (responseData.mensaje == 1) { 
                stListaUserANotificar.removeAll();
                mostrarMensaje(1, 'Se ha actualizado la lista de usuarios a notificar satisfactoriamente');
                stListaUserANotificar.reload();
            } else {
                mostrarMensaje(2, 'Ha ocurrido un error, contacte al administrador');
            }
        }
    });

}