agregarmodificarpersona = function () {

}

function winFp(accion) {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function () {
            ventanaCrud.destroy();
        }
    });

    btnAplicarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        disabled: false,
        id: 'btnAplicarAdd',
        text: perfil.etiquetas.lbtnAplicarAdd,
        tooltip: perfil.etiquetas.lbTtAplicarAdd,
        handler: function () {
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
        disabled: false,
        id: 'btnAceptarAdd',
        text: perfil.etiquetas.lbtnAceptarAdd,
        tooltip: perfil.etiquetas.lbTtAceptarAdd,
        handler: function () {
            if (pfinal.getForm().isValid()) {
                AdicionarModificar(accion, 2);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

//*****Elementos de la ventana para adicionar personas**********
    stComboTipoPersona = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stComboTipoPersona.baseParams.uri = 6;
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

    cbTipoPersona = new Ext.form.ComboBox({
        fieldLabel: 'Tipo persona',
        emptyText: 'Seleccione',
        id: '111cbTipoPersona ',
        store: stComboTipoPersona,
        disabled: accion == 2 ? true : false,
        displayField: 'denominacion',
        valueField: 'iddatos',
        triggerAction: 'all',
        loadingText: 'Cargando datos...',
        allowBlank: false,
        selectOnFocus: false,
        blankText: 'Este campo es obligatorio',
        readOnly: true,
        mode: 'local',
        anchor: '92%',
        listeners: {
            select: function (cb, rec, num) {
                console.log(rec.data.iddatos);
                tp = rec.data.iddatos;
                ControlarVentana();
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
        emptyText: 'Seleccione',
        fieldLabel: 'Empresa importadora',
        width: 200,
        disabled: true,
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        //anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        hidden: false,
        listeners: {
            select: function (cb, rec, num) {
                idempimp = rec.data.iddatos;
                empvalue = rec.data.denominacion;
            }

        }
    });

    stUnidadCompra = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stUnidadCompra.baseParams.uri = 7;
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

    cbUnidadCompra = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Unidad de compra',
        width: 200,
        disabled: true,
        store: stUnidadCompra,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        //anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        hidden: false,
        listeners: {
            select: function (cb, rec, num) {
                uc = rec.data.iddatos;
            }

        }
    });

    stCategoriaPersona = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stCategoriaPersona.baseParams.uri = 5;
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

    cbCategoriaPersona = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Categoría',
        width: 200,
        disabled: true,
        store: stCategoriaPersona,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        //anchor: '95%',
        loadingText: 'Cargando...',
        hidden: false,
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cp = rec.data.iddatos;
            }

        }
    });

    NombrePersona = new Ext.form.TextField({
        disabled: false,
        fieldLabel: 'Nombre persona',
        allowBlank: false,
        width: 200,
        anchor: '80%',
        hidden: false
    });

    Apellidos = new Ext.form.TextField({
        disabled: false,
        fieldLabel: 'Apellidos',
        allowBlank: false,
        width: 200,
        anchor: '80%',
        hidden: false
    });

    Correo = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Correo',
        allowBlank: true,
        width: 200,
        hidden: false
    });

    Telefono = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Telefóno',
        allowBlank: true,
        width: 200,
        hidden: false
    });

    cbEmpresaDestino =  new Ext.form.TextField({
        disabled: true,
        emptyText: 'Seleccione',
        fieldLabel: 'Entidad',
        readOnly: true,
        allowBlank: true,
        width: 200,flex:1,
        anchor: '90%',
        hidden: false,
        listeners: {
            render: function(yo){
                yo.getEl().on('click', function(){
                    SeleccionarEmpDestino();
                });
            }
        }
    });
    
    var h = 400;
    pfinal = new Ext.FormPanel({
        id: 'pfinal',
        frame: true,
        defaults:{labelAlign:'top'},
        items: [{
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [cbTipoPersona]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: NombrePersona
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: Apellidos
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    items: cbCategoriaPersona
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: cbEmpresasImp
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: cbUnidadCompra
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: Correo
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: Telefono
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    items: cbEmpresaDestino
                }]

            }]
    });
    ventanaCrud = null;
    ventanaCrud = new Ext.Window({
        title: 'Adicionar persona',
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
    if(accion == 2){
      ControlarVentana2(accion);
    }

    if(accion == 1){
        ventanaCrud.show();
    }
}

function AdicionarModificar(accion, band) {
    var id = null;
    if (accion == 2) {
        id = smGpPersonas711.getSelected().data.idpersonadel711;
    }
    if(cbTipoPersona.getValue()==5056){
        empvalue = cbEmpresasImp.getRawValue();
    }
    nombre= NombrePersona.getValue();
    apell= Apellidos.getValue();
    correo= Correo.getValue();
    telf= Telefono.getValue();

    //si los conceptos de compra son iguales
    //if()
    Ext.Ajax.request({
        url: 'adicionarModificarPersona',
        params: {
            tp: tp,
            idempimp: idempimp,
            uc: uc,
            cp: cp,
            nombre: nombre,
            apell: apell,
            correo: correo,
            telf: telf,
            idempdest: empdestino,
            empvalue: empvalue,
            idpersonadel711: id,
            accion: accion
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                var postaccion = (accion == 1) ? 'adicionado' : 'modificado';
                mostrarMensaje(1, 'La persona se ha ' + postaccion + ' satisfactoriamente');
                cbTipoPersona.reset();
                cbEmpresasImp.reset();
                cbUnidadCompra.reset();
                cbCategoriaPersona.reset();
                NombrePersona.reset();
                Apellidos.reset();
                Correo.reset();
                Telefono.reset();
                cbEmpresaDestino.reset();
                stGpPersonas711.reload();
                tp=null;
                idempimp=null;
                uc=null;
                cp=null;
                nombre=null;
                apell=null;
                correo=null;
                telf=null;
                empdestino=null;
                empvalue=null;                
                if(band==2){
                    ventanaCrud.destroy();
                } 
            }else {
                var verboaccion = (accion == 1) ? 'adicionar' : 'modificar';
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });

}

function SeleccionarEmpDestino(){
    empvalue= null;
    empdestino= null;
    
    btnCancelarSel = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarSel',
        tooltip: perfil.etiquetas.lbTtCancenlarSol,
        text: 'Cancelar',
        handler: function () {
            ventanaEmpresas.hide();
        }
    });
    
    btnAceptarSel = new Ext.Button({
        iconCls: 'aceptar',
        disabled: false,
        id: 'btnAceptarSel',
        text: 'Aceptar',
        tooltip: perfil.etiquetas.lbTtAceptarSol,
        handler: function () {
            cbEmpresaDestino.setValue(empvalue);
            ventanaEmpresas.hide();
        }
    });
    
    //Parte para relacionar con estructuras
    tpEstructura = new Ext.tree.TreePanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        id: 'tpEstructura',
        autoScroll: true,
        loader: new Ext.tree.TreeLoader({
            singleClickExpand: true,
            dataUrl: 'listarConfEntidadesDestino',
            listeners: {
                scope: this,
                beforeload: function (loader, treeNode) {
                    loader.baseParams = {
                        idempdestino: empdestino
                    };
                },
                load: function (loader, nodo, respuesta) {
                }
            }
        }),
        root: new Ext.tree.AsyncTreeNode({
            text: 'Entidades',
            tipo: 0,
            expanded: true,
            id: '0',
            leaf: false
        })
    });
    
    tpEstructura.addListener('click', function (n) {
        if (n.text != "Entidades") {
            if(n.attributes.orden!=1){
                empvalue = n.text;
                empdestino= n.id;
                btnAceptarSel.enable();
            }
        }

    });
    
    pAsocEstruc = new Ext.Panel({
        id: 'pAsocEstruc',
        region: 'east',
        split: true,
        layout: 'fit',
        title: perfil.etiquetas.lbGestionarCategoriaEstrc,
        width: 350,
        height: 400, 
        items: [tpEstructura]
    });
    //fin estructuras  
    
    ventanaEmpresas = null;
    ventanaEmpresas = new Ext.Window({
        title: 'Seleccionar empresa destino',
        width: 350,
        constrain: true,
        layout: 'form',
        height: 400,
        resizable: false,
        frame: true,
        modal: true,
        autoScroll: true,
        buttons: [btnCancelarSel, btnAceptarSel],
        items: [pAsocEstruc],
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {
            }
        }
    });
    ventanaEmpresas.show();
}

function ControlarVentana(){
    cbCategoriaPersona.enable();
    cbEmpresasImp.disable();
    cbUnidadCompra.disable();
    Correo.disable();
    Telefono.disable();
    cbEmpresaDestino.disable();
    
    //Especialistas
    if(cbTipoPersona.getValue()==5058){
        cbEmpresasImp.disable();
        cbUnidadCompra.disable();
        Correo.enable();
        Telefono.enable();
        cbEmpresaDestino.enable();
    }
    //Directores
    if(cbTipoPersona.getValue()==5057 || cbTipoPersona.getValue()==1282){
        cbEmpresasImp.disable();
        cbUnidadCompra.disable();
        Correo.enable();
        Telefono.enable();
        cbEmpresaDestino.enable();
    }
    //Comprador y gerente
    if(cbTipoPersona.getValue()==5056 || cbTipoPersona.getValue()==1283 || cbTipoPersona.getValue()==1281){
        cbEmpresasImp.enable();
        cbUnidadCompra.enable();
        Correo.enable();
        Telefono.enable();
        cbEmpresaDestino.allowBlank=true;
        cbEmpresaDestino.disable();
    }

}

function ControlarVentana2(accion){
    if(accion == 2){
        btnAplicarAdd.hide();
        pers = smGpPersonas711.getSelected();
        ventanaCrud.setTitle('Modificar persona');
        ventanaCrud.show();
        NombrePersona.setValue(pers.data.nombre);
        Apellidos.setValue(pers.data.apellidos);
        cbTipoPersona.setValue(pers.data.iddatostp);
        cbCategoriaPersona.enable();
        cbCategoriaPersona.setValue(pers.data.categoria);
        cp = pers.data.iddatoscategoria;
        
        tpp = pers.data.idtipopersona;
        if(tpp==5058){
            cbEmpresasImp.disable();
            cbUnidadCompra.disable();
            Correo.enable();
            Telefono.enable();            
            Correo.setValue(pers.data.correoelec);
            Telefono.setValue(pers.data.telefono);
            cbEmpresaDestino.setValue(pers.data.nombrepertenece);
            empdestino = pers.data.identidad;
            empvalue = pers.data.nombrepertenece;
            cbEmpresaDestino.disable();
        }
        if(tpp==5057 || tpp==1282){
            cbEmpresasImp.disable();
            cbUnidadCompra.disable();
            Correo.enable();
            Telefono.enable();
                       
            Correo.setValue(pers.data.correoelec);
            Telefono.setValue(pers.data.telefono);
            cbEmpresaDestino.setValue(pers.data.nombrepertenece);
            empdestino = pers.data.identidad;
            empvalue = pers.data.nombrepertenece;
            cbEmpresaDestino.disable();
        }
        if(tpp==5056 || tpp==1283 || tpp==1281){
            cbEmpresasImp.enable();
            cbUnidadCompra.enable();
            Correo.enable();
            Telefono.enable();
            cbEmpresaDestino.disable();
            
            Correo.setValue(pers.data.correoelec);
            Telefono.setValue(pers.data.telefono);
            cbUnidadCompra.setValue(pers.data.datosuc);
            cbEmpresasImp.setValue(pers.data.importadora);
        }
        
    }
}
