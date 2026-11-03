agregarmodificarproducto = function() {

}

function winFp(accion) {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function() {
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
        handler: function() {
            if (pfinal.getForm().isValid()) {
                AdicionarModificar(accion, 1);
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
        handler: function() {
            if (pfinal.getForm().isValid()) {
                AdicionarModificar(accion, 2);
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
            beforeload: function() {
                stUnidaMedida.baseParams.uri = 7;
            },
            load: function(t) {
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
            select: function(cb, rec, num) {

            }
        }
    });

    stEmpresaImp = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function() {
                stEmpresaImp.baseParams.uri = 3;
            },
            load: function(t) {
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
            select: function(cb, rec, num) {
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
        decimalPrecision: 2,
        allowBlank: false,
        maxLength: 19,
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
        width: 200,
        //disabled: accion == 2 ? true : false
                //anchor: '80%',
                //value: codigoreup
    });

    var h = 300;
    pfinal = new Ext.FormPanel({
        id: 'pfinal',
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
    ventanaCrud = null;
    ventanaCrud = new Ext.Window({
        title: 'Adicionar producto',
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
            beforeshow: function() {
            }
        }
    });
    if (accion == 2) {
        console.log(smGpProductos.getSelected());
        ventanaCrud.setTitle('Modificar producto');
        //cbUnidaMedida.selectByValue(smGpProductos.getSelected().data.um);
        cbUnidaMedida.setValue(smGpProductos.getSelected().data.iddatosunidadmedida);
        
        cbEmpresasImp.setValue(smGpProductos.getSelected().data.importadora);
        Denominacion.setValue(smGpProductos.getSelected().data.denominacion);
        Precio.setValue(smGpProductos.getSelected().data.precio);
        CodigoCUP.setValue(smGpProductos.getSelected().data.codigocup);
        CodigoPieza.setValue(smGpProductos.getSelected().data.numeropieza);
        btnAplicarAdd.hide();
    }
    ventanaCrud.show();
}

function AdicionarModificar(accion, band) {
    var id = null;
    if (accion == 2) {
        id = smGpProductos.getSelected().data.idproducto711;
    }
    //si los conceptos de compra son iguales
    Ext.Ajax.request({
        url: 'adicionarModificarProductos',
        params: {
            um: cbUnidaMedida.getValue(),
            idempimp: cbEmpresasImp.getValue(),
            denom: Denominacion.getValue(),
            precio: Precio.getValue(),
            codigocup: CodigoCUP.getValue(),
            idproducto711: id,
            numeropieza: CodigoPieza.getValue(),
            accion: accion,
            tipo: 0
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                var postaccion = (accion == 1) ? 'adicionado' : 'modificado';
                mostrarMensaje(1, 'El producto se ha ' + postaccion + ' satisfactoriamente');
                cbUnidaMedida.reset();
                cbEmpresasImp.reset();
                Denominacion.reset();
                Precio.reset();
                CodigoCUP.reset();
                CodigoPieza.reset();
                stGpProductos.reload();
                if(band==2){
                    ventanaCrud.destroy();
                }

            } else {
                var verboaccion = (accion == 1) ? 'adicionar' : 'modificar';
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });

}

function winAddInd(accion) {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function() {
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
        handler: function() {
            if (pfinal.getForm().isValid()) {
                AdicionarModificarInd(accion, 1);
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
        handler: function() {
            if (pfinal.getForm().isValid()) {
                AdicionarModificarInd(accion, 2);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

//*****Elementos de la ventana para adicionar indicador**********
    stTipoCodigo100 = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function() {
                stTipoCodigo100.baseParams.uri = 17;
            },
            load: function(t) {
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

    cbTipoCodigo100 = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        id: 'cbTipoCodigo100 ',
        fieldLabel: 'Tipo código 100',
        store: stTipoCodigo100,
        displayField: 'denominacion',
        valueField: 'iddatos',
        triggerAction: 'all',
        loadingText: 'Cargando datos...',
        allowBlank: false,
        selectOnFocus: false,
        blankText: 'Este campo es obligatorio',
        readOnly: true,
        mode: 'local',
        width: '100%',
        listeners: {
            select: function(cb, rec, num) {

            }
        }
    });
    
    textIndicador = new Ext.form.TextArea({
        id: 'idtextmotivo',
        allowBlank: false,
        fieldLabel: 'Indicador',
        width: '90%',
    });

    var h = 250;
    pfinal = new Ext.FormPanel({
        id: 'pfinal',
        frame: true,
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [cbTipoCodigo100]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: textIndicador
                    }]

            }]
    });
    ventanaCrud = null;
    ventanaCrud = new Ext.Window({
        title: 'Adicionar indicador',
        id: 'ventanaCrud',
        width: 300,
        constrain: true,
        layout: 'fit',
        height: h,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAdd, btnAplicarAdd, btnAceptarAdd],
        items: [pfinal],
        listeners: {
            beforeshow: function() {
            }
        }
    });
    if (accion == 2) {
        console.log(smGpProductos.getSelected());
        ventanaCrud.setTitle('Modificar indicador');
        cbUnidaMedida.setValue(smGpProductos.getSelected().data.um);
        cbEmpresasImp.setValue(smGpProductos.getSelected().data.importadora);
        Denominacion.setValue(smGpProductos.getSelected().data.denominacion);
        Precio.setValue(smGpProductos.getSelected().data.precio);
        CodigoCUP.setValue(smGpProductos.getSelected().data.codigocup);
        CodigoPieza.setValue(smGpProductos.getSelected().data.numeropieza);
        btnAplicarAdd.hide();
    }
    ventanaCrud.show();
}

function AdicionarModificarInd(accion, band) {
    var id = null;
    if (accion == 2) {
        id = smGpProductos.getSelected().data.idproducto711;
    }
    //si los conceptos de compra son iguales
    Ext.Ajax.request({
        url: 'adicionarModificarProductos',
        params: {
            iddatostipocodigo: cbTipoCodigo100.getValue(),
            denom: textIndicador.getValue(),
            idproducto711: id,
            accion: accion,
            tipo: 1
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                var postaccion = (accion == 1) ? 'adicionado' : 'modificado';
                mostrarMensaje(1, 'El indicador se ha ' + postaccion + ' satisfactoriamente');
                cbTipoCodigo100.reset();
                textIndicador.reset();
                stGpProductos.reload();
                if(band==2){
                    ventanaCrud.destroy();
                }

            } else {
                var verboaccion = (accion == 1) ? 'adicionar' : 'modificar';
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });

}

function winAddTarea(accion) {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function() {
            ventanaCrud3.destroy();
        }
    });

    btnAplicarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        disabled: true,
        id: 'btnAplicarAdd',
        text: perfil.etiquetas.lbtnAplicarAdd,
        tooltip: perfil.etiquetas.lbTtAplicarAdd,
        handler: function() {
            if (pfinal.getForm().isValid()) {
                AdicionarModificarTarea(accion, 1);
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
        handler: function() {
            if (pfinal.getForm().isValid()) {
                AdicionarModificarTarea(accion, 2);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

//*****Elementos de la ventana para adicionar indicador**********
    stCbejercicioPlanes = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        disabled: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            load: function (t) {
                //cbEjercicioPlanes.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        }
    });
    
    cbEjercicioPlanes = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        width: 150,
        disabled: false,
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        fieldLabel: 'Plan',
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
                idplan711= rec.json.idplan711;
            }
        }
    });
    
    textTarea = new Ext.form.TextField({
        id: 'idtextmotivo',
        allowBlank: false,
        fieldLabel: 'Tarea',
        width: '90%',
    });

    var h = 250;
    pfinal = new Ext.FormPanel({
        id: 'pfinal',
        frame: true,
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [cbEjercicioPlanes]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: textTarea
                    }]

            }]
    });
    ventanaCrud3 = null;
    ventanaCrud3 = new Ext.Window({
        title: 'Adicionar tarea de plan',
        //id: 'ventanaCrud',
        width: 300,
        constrain: true,
        layout: 'fit',
        height: h,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAdd, btnAplicarAdd, btnAceptarAdd],
        items: [pfinal],
        listeners: {
            beforeshow: function() {
            }
        }
    });
    
    ventanaCrud3.show();
}

function AdicionarModificarTarea(accion, band) {
    var id = null;
    if (accion == 2) {
        id = smGpProductos.getSelected().data.idproducto711;
    }
    //si los conceptos de compra son iguales
    Ext.Ajax.request({
        url: 'adicionarModificarProductos',
        params: {
            iddatostipocodigo: cbEjercicioPlanes.getValue(),
            denom: textTarea.getValue(),
            idproducto711: id,
            accion: accion,
            idplan711: idplan711,
            tipo: 2
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                var postaccion = (accion == 1) ? 'adicionado' : 'modificado';
                mostrarMensaje(1, 'El indicador se ha ' + postaccion + ' satisfactoriamente');
                cbEjercicioPlanes.reset();
                textTarea.reset();
                stGpProductos.reload();
                if(band==2){
                    ventanaCrud3.destroy();
                }

            } else {
                var verboaccion = (accion == 1) ? 'adicionar' : 'modificar';
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });

}

