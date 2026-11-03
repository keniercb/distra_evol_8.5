vermodificaciones = function () {
   
}

function MotivoModif(){
    btnAceptarMotivo = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarMotivo',
        tooltip: 'Aceptar',
        text: 'Aceptar',
        handler: function () {
                textomotivo = textmodif. getValue();
                GuardarDistribucion();
                ventanaMotivo.destroy();
        }
    });
      
    textmodif = new Ext.form.TextArea({
        id: 'textmodif',
        allowBlank: false,
    });

    //panel para ver las modificaciones realizadas
    pModifciacion = new Ext.Panel({
        layout: 'fit',
        region: 'east',
        frame: true,
        width: 300,
        height: 270,
        items: textmodif
    });

    //panel para mostrar todos los elementos de la ventana add
    pfinal = new Ext.Panel({
        id: 'pfinal',
        frame: true,
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'fit',
                        items: pModifciacion
                    }]

            }]
    });
    ventanaMotivo = new Ext.Window({
        title: 'Motivo de modificación',
        id: 'ventanaMotivo',
        width: 350,
        constrain: true,
        layout: 'fit',
        height: 350,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnAceptarMotivo],
        items: [pfinal],
        listeners: {
            
        }
    });
        
    ventanaMotivo.show();
}

function winModificaciones() {

    btnCerrarWin = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCerrarWin',
        tooltip: 'Cerrar',
        text: 'Cerrar',
        handler: function () {
                ventanaModificaciones.destroy();
        }
    });
    
    btnLimpiarModif = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrosModif.clearFilters();
        }
    });

    stModificaciones = new Ext.data.Store({
        autoLoad: true,
        url: 'listarModif',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
            //idmotivomodif, identificador, motivo, idusuario, fechamodificacion
        }, [{
                name: 'idmotivomodif'
            },{
                name: 'identificador'
            },{
                name: 'motivo'
            },{
                name: 'usuario'
            },{
                name: 'fechamodificacion'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                stModificaciones.removeAll();
                stModificaciones.baseParams.identidad = identidadselectedPlanes;
                stModificaciones.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                //cambiarTituloFiltrar(gpListaModif, filtrosModif, perfil.etiquetas.lbFiltradoPor);
            },
            load: function (me) {

            }
        }
    });
    
    smModificaciones = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            beforerowselect: function (sm, y, z, rec) {
                textmodif.enable();
                textmodif.setValue(rec.data.motivo);
            }
        }

    });
    
    cmModificaciones = new Ext.grid.ColumnModel([
        {
            header: "Usuario",
            dataIndex: 'usuario',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },
        {
            header: "Fecha de modificación",
            width: 150,
            dataIndex: 'fechamodificacion',
            sortable: true,
            renderer: crearToolTip
        }
    ]);
    
    filtrosModif = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'idusuario'
            }, {
                type: 'date',
                dataIndex: 'fechamodificacion'
            }]
    });
    gpListaModif = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stModificaciones,
        sm: smModificaciones,
        enable: true,
        layout: 'fit',
        region: 'center',
        width: 300,
        height: 270,
        title: 'Listado de modificaciones',
        autoExpandColumn: 'expandir',
        cm: cmModificaciones,
        plugins: filtrosModif,
        loadMask: {
            msg: 'Cargando los CC...'
        },
        listeners: {
            beforerowselect: function () {
                //console.log(sm);
                    textmodif.setValue(gpListaModif.getSelectionModel().getSelected().data.motivo);
            }
        },
        bbar: btnLimpiarModif
               
    });
    
    textmodif = new Ext.form.TextArea({
        id: 'textmodif',
        allowBlank: false,
        readOnly: true,
        disabled: true
    });

    //panel para ver las modificaciones realizadas
    pModifciacion = new Ext.Panel({
        layout: 'fit',
        region: 'east',
        frame: true,
        title: 'Motivo de modificación',
        width: 300,
        height: 270,
        items: textmodif
    });

    //panel para mostrar todos los elementos de la ventana add
    pfinal = new Ext.Panel({
        id: 'pfinal',
        frame: true,
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 0.5,
                        layout: 'fit',
                        items: gpListaModif
                    }, {
                        columnWidth: 0.5,
                        layout: 'fit',
                        items: pModifciacion
                    }]

            }]
    });
    ventanaModificaciones = new Ext.Window({
        title: 'Modificaciones realizadas a la distribución: '+ denom_ent,
        id: 'ventanaModificaciones',
        width: 625,
        constrain: true,
        layout: 'fit',
        height: 350,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCerrarWin],
        items: [pfinal],
        listeners: {
            
        }
    });
    
        //Para el trabajo con los usuarios a partir de 'idusuario'

    //stModificaciones.reload();
    ventanaModificaciones.show();

    
}

function VerModificaciones(){
    
    Ext.Ajax.request({
        url: 'adicionarModificarPlan',
        params: {
            ejercicio: cbDenominacionEjercicio.getValue(),
            montototal: montototal,
            ff: Ext.encode(ff1),
            cc: Ext.encode(cc1),
            planactual: ChboxActual.getValue(),
            accion: accionventana,
            motivo: motivo,
            idp711: idplan711modif
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                if (accion == 1) {
                    ventanaModificaciones.destroy();
                }
            } else {
                mostrarMensaje(2, 'Ha ocurrido un error.');
            }
        }
    });
    
}

function renderUsuario(value, m) {
    console.log(usuarios);
    console.log(usuarios.pop);
    for (i = 0; i < usuarios.length; i++) {
        if (usuarios[0][i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + usuarios[0][i].data.nombreusuario + '"';
            return usuarios[0][i].data.nombreusuario;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}
