vermodificaciones = function () {
    
}

function MotivoRechazo(accion){
    if(btnAprobar.hidden == false){
        desaprueba=5;
    }
    if(btnAprobarAtm.hidden == false){
        desaprueba=2;
    }
    if(btnAprobarAT.hidden == false){
        desaprueba=3;
    }
    if(btnAprobarDI.hidden == false){
        desaprueba=4;
    }
    if(btnAprobarEspEmp.hidden == false){
        desaprueba=7;
    }
    btnAceptarMotivo = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarMotivo',
        tooltip: 'Aceptar',
        text: 'Aceptar',
        handler: function () {
                textorchazo = textmodif. getValue();
                AprobarDesaprobar(accion, desaprueba);
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
        title: 'Motivo de rechazo de solitud',
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

function EscribirMotivo(situacionpedido, text){
    nombrepanel = (situacionpedido==3) ? 'Motivo de modificación de solicitud': 'Motivo de cancelación de solicitud';
    btnAceptarMotivo = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarMotivo',
        tooltip: 'Aceptar',
        text: 'Aceptar',
        handler: function () {
                msgmotivo = textmodif.getValue();
                CambiarSituacionPedido(situacionpedido, text);
                ventanaMotivo.destroy();
        }
    });
    
    btnCancelarMotivo = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnCancelarMotivo',
        tooltip: 'Cancelar',
        text: 'Cancelar',
        handler: function () {
                msgmotivo = "";
                CambiarSituacionPedido(situacionpedido, text);
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
        title: nombrepanel,
        id: 'ventanaMotivo',
        width: 350,
        constrain: true,
        layout: 'fit',
        height: 350,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarMotivo,btnAceptarMotivo],
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
                stModificaciones.baseParams.idsolicitud711= smSolicitudes711.getSelected().data.idsolicitud711;
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
        title: 'Modificaciones realizadas a la solicitud',
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
    stModificaciones.reload();    
    ventanaModificaciones.show();

}

function winRevisiones() {
    console.log('asa');
    offset = 0;
   h=500;
   w=1000;
   productossel =[];
   solseleccionadas =[];
   textoAntecendetes = '';
    prod =[];
    auxcons =[];
    var servsol = [];
    btnCancelarSol = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarSol',
        tooltip: perfil.etiquetas.lbTtCancenlarSol,
        text: 'Cancelar',
        handler: function () {
                ventanaCrud.destroy();
        }
    });
    
    stSolConsolidar = new Ext.data.Store({
        url: 'listarSolicitudes711',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                stSolConsolidar.removeAll();
                stSolConsolidar.baseParams.start = offset;
                stSolConsolidar.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                //stSolicitudes711.baseParams.identidad = identidadselectedPlanes;
                stSolConsolidar.baseParams.idempimp = cbEmpresasImp.getValue();
                stSolConsolidar.baseParams.idcc = cbCC.getValue();
                stSolConsolidar.baseParams.tipoplan = tipoplan;               
//                stSolConsolidar.baseParams.esconsolidada = escon;                
                stSolConsolidar.baseParams.revision = 1;     
                gpSolConsolidar.getSelectionModel().suspendEvents();
//                stSolConsolidar.baseParams.paraconsolidar = true;                
            },
            load: function (st, rec, obj) {
                mymask.hide();
                gpSolConsolidar.getSelectionModel().resumeEvents();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idsolicitud711'
            }, {
                name: 'nosolicitud'
            }, {
                name: 'iddatosempimp'
            }, {
                name: 'iddatoscc'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripciongeneral'
            }, {
                name: 'totalgeneral'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'identidaddestino'
            },{
                name: 'situacionpedido'
            },{
                name: 'idsp'
            },{
                name: 'nopedido'
            }, {
                name: 'fechapresped'
            }, {
                name: 'aperturacredito'
            }, {
                name: 'gerente'
            }, {
                name: 'antecedentes'
            }, {
                name: 'lugarentrega'
            }, {
                name: 'suministrototal'
            }, {
                name: 'otrosgastos'
            }, {
                name: 'idespecialista'
            }, {
                name: 'idgerente'
            }, {
                name: 'iddirector'
            }, {
                name: 'idcodigodecc'
            }, {
                name: 'valorreal'
            }, {
                name: 'iddatosff'
            }, {
                name: 'montoff'
            }, {
                name: 'estaconsolidada'
            }, {
                name: 'esconsolidada'
            }, {
                name: 'iddatostarea'
            }, {
                name: 'iddirectorecon'
            }, {
                name: 'idespecialistacs'
            }, {
                name: 'idcomprador'
            }, {
                name: 'idtiposolicitudplan'
            }, {
                name: 'nombreentidad'
            }, {
                name: 'codigoaprob'
            } 
        ]
                )
    });
   
    checkSol = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (Sel, rowIndex,record) {
                auxcons=[];
                auxcons[0]=record.data.idsolicitud711;
                auxcons[1]=''+record.data.nosolicitud + ': \n' +record.data.antecedentes+'';
                valaux=false;
                for (j = 0; j < solseleccionadas.length; j++) {
                    if(record.data.idsolicitud711==solseleccionadas[j][0]){
                        valaux=true;
                    }
                }
               if(valaux==false)
                    solseleccionadas.push(auxcons);
            },
            rowdeselect: function (Sel, rowIndex,record) {
                auxmio =[]; 
                for (j = 0; j < solseleccionadas.length; j++) {
                    if(record.data.idsolicitud711 != solseleccionadas[j][0]){
                        auxmio.push(solseleccionadas[j]);
                    }
                }
                solseleccionadas =[]; 
                solseleccionadas = auxmio; 
                console.log(solseleccionadas);
            },
            selectionchange: function () {
                console.log('asa');
                btnVerificarCons.enable();
            } 
        }
    });
    
    cmSolCons = new Ext.grid.ColumnModel([checkSol,
        {
            header: "No.Solicitud",
            dataIndex: 'nosolicitud',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Entidad",
            dataIndex: 'nombreentidad',
            width: 200,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Descripción general",
            dataIndex: 'descripciongeneral',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Total general",
            dataIndex: 'totalgeneral',
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        }
    ]);
    
    filtrosSolCons = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'nosolicitud'
            }, {
                type: 'string',
                dataIndex: 'nombreentidad'
            }, {
                type: 'string',
                dataIndex: 'descripciongeneral'
            }/*, {
                type: 'numeric',
                dataIndex: 'totalgeneral'
            }*/]
    });
    
    btnLimpGpSC = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        disabled: false,
        handler: function () {
            filtrosSolCons.clearFilters();
        }
    });
    
    btnVerificarCons = new Ext.Button({
        handler: function () {
            ConsolidarSeleccionados(2);
        },
        tooltip: 'Revisar seleccionados',
//        disabled: true,
        iconCls: 'comprobante'
    });
    
    gpSolConsolidar = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stSolConsolidar,
        sm: checkSol,
        region: 'center',
        width: 950,
        height: 400,
        autoExpandColumn: 'expandir',
        cm: cmSolCons,
//        title: 'Solicitudes a consolidar',
        tbar: [btnVerificarCons],
        bbar: new Ext.PagingToolbar({
            pageSize: 50, 
            store: stSolConsolidar,
            displayInfo: true,
            items: [btnLimpGpSC],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        plugins: filtrosSolCons,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            
        }
    });

    pfinal = new Ext.FormPanel({
        id: 'pfinal',
        layout: 'fit',
        frame: true,
        items: [gpSolConsolidar]
    });
    ventanaCrud = null;
    ventanaCrud = new Ext.Window({
        title: 'Revisar solicitudes para consolidar',
        //id: 'ventanaCrud',
        width: 950,
        constrain: true,
        layout: 'form',
        height: 480,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarSol],
        items: [pfinal],
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {
            }
        }
    });
    mymask.show();
    ventanaCrud.show();
}