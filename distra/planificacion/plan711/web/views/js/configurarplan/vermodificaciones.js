vermodificaciones = function () {
    
    

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
                stModificaciones.baseParams.field = field;
                stModificaciones.baseParams.start = offsetmodif;
                stModificaciones.baseParams.idplan711 = smGpGestPlanes711.getSelected().data.idplan711;
                stModificaciones.baseParams.idejercicio = smGpGestPlanes711.getSelected().data.idejercicio;
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
                dataIndex: 'usuario'
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
        title: 'Modificaciones realizadas al plan: '+ smGpGestPlanes711.getSelected().data.ejercicio,
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
    stUsuarios = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarUsuarios',
        id: 'stUsuarios',
        reader: new Ext.data.JsonReader({
            root: 'data',
            idusuarioLog: 'idusuarioLog',
            id: 'idusuario'
        }, [{
            name: 'idusuario'
        }, {
            name: 'nombreusuario'
        }]),
        listeners: {
            load: function (st, rec, obj) {
                usuarios.push(rec);
            }
        }
    });
    
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

