 Ext.ns('Pvd.RegimenTrabajo.TurnoTrabajo');
  
/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.RegimenTrabajo.TurnoTrabajo.Controlador = {
    
    init: function(idioma, vista, modelo) {
	 var scope=this;
	 scope.recSelected;

        vista.tfdenom.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.dfFInicio.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.dfFFin.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.cbhoraInicio.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.cbhoraFin.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.cbhoraalmuerzo.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.tftiempodescanso.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.tadescripcion.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
		
		vista.btnLimpiar.on('click', function(){
            vista.tfbuscar.reset();
			vista.dfFIniciob.reset();
			vista.dfFFinb.reset();
			modelo.fuenteDatosListado.load({params:{start:0, limit:15}});
        });
	
		 vista.btnBuscar.on('click', function(){
			modelo.fuenteDatosListado.load({params:{denominacion: vista.tfbuscar.getValue(), fdesde: vista.dfFIniciob.getRawValue(),fhasta: vista.dfFFinb.getRawValue(),start:0, limit:15}});
        });
        
        vista.btnCancelar.on('click', function(){
            vista.ventanaGestion.hide();
            vista.formularioGestion.getForm().reset();
        });
        
        vista.btnAceptar.on('click', function(){
            this.salvarFormulario(false);
        }, this);
        
        vista.btnAplicar.on('click', function(){
            this.salvarFormulario(true);
        }, this);
        
        this.salvarFormulario = function(btnAplicarPresionado) {
            var urlAction = 'addTurnoTrabajo';
            var lbTitMsgEspera = idioma.lbTitMsgAdicionandoR;
            var lbMsgExito = idioma.lbMsgInsTurnoTrabajoExito;
            if (vista.formularioGestion.getForm().findField('idturnotrabajo').getValue()) {
                urlAction = 'modTurnoTrabajo';
                lbTitMsgEspera = idioma.lbTitMsgModificandoR;
                lbMsgExito = idioma.lbMsgModTurnoTrabajoExito;
            }
            if (vista.formularioGestion.getForm().isValid()){
                vista.formularioGestion.getForm().submit({
                    url: urlAction,
                    params:{otro:vista.otrodia.getValue(),idestructura: vista.EstructuraPadre.getValue()},
                    waitMsg: lbTitMsgEspera,
                    success: function(o,r) {
                        vista.EstructuraPadre.setValue('');
                        vista.EstructuraPadre.setRawValue('');
					if(r.result.existe)
						mostrarMensaje(3, idioma.lbMsgModTurnoTrabajoExiste);
					else{
							if (!btnAplicarPresionado)
								vista.ventanaGestion.hide();
                                vista.formularioGestion.getForm().reset();
                                scope.stNewapa.reload()
                                mostrarMensaje(1, lbMsgExito);
                            }
                    },
                    failure: function(response) {
                        if (response.responseText) {
                            var responseData = Ext.decode(response.responseText);
                            vista.EstructuraPadre.setValue('');
                            vista.EstructuraPadre.setRawValue('');
                            if (responseData.codMsg)
                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        }
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        function boolean(val, metaData, record, rowIndex, colIndex, store){
            if(val == 1)
                return '<center><img src="/pvd/regimentrabajo/views/images/tick.png" /></center>';
            else if(val == 0)
                return '<center><img src="/pvd/regimentrabajo/views/images/restringir.png" /></center>';
            else
                return '';
        }

        Ext.Ajax.request({
            url: 'listarTurnoTrabajo',
            params:{start:0, limit:15},
            callback: function(options,success,response) {
                var responseData = Ext.decode(response.responseText);
                 var sesiones = responseData.sesiones;
                var columns = new Array();
                var indexs = new Array();
                var continentGroupRow = new Array();
                var expander = new Ext.grid.RowExpander({
                    tpl: new Ext.Template(
                        '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
                    )
                });

                columns.push(expander);

                columns.push({
                    dataIndex: 'idturnotrabajo',
                    sortable: true,
                    header: 'idturnotrabajo',
                    width: 30,
                    hidden:true,
                    hiddeable:false
                });
                columns.push({
                    dataIndex: 'denominacion',
                    sortable: true,
                    header: 'Denominaci&oacute;n',
                    hiddeable:false,
                    width: 50
                });
                columns.push({
                    dataIndex: 'fdesde',
                    sortable: true,
                    header: 'Fecha inicio',
                    hiddeable:false,
                    width: 30
                });
                columns.push({
                    dataIndex: 'fhasta',
                    sortable: true,
                    header: 'Fecha fin',
                    hiddeable:false,
                    width: 30
                });
                columns.push({
                    dataIndex: 'horainicio',
                    sortable: true,
                    header: 'Hora inicio',
                    width: 30,
                    hiddeable:false
                });
                columns.push({
                    dataIndex: 'horafin',
                    sortable: true,
                    header: 'Hora fin',
                    width: 30,
                    hidden:false,
                    hiddeable:false
                });
                columns.push({
                    dataIndex: 'horarioalmuerzo',
                    sortable: true,
                    header: 'Horario almuerzo',
                    width: 30,
                    hiddeable:false
                });
                columns.push({
                    dataIndex: 'tiempodescanso',
                    sortable: true,
                    header: 'Tiempo descanso',
                    width: 30,
                    hidden:false,
                    hiddeable:false
                });
                if(sesiones == '0')
                {
                    columns.push({
                        dataIndex: 'toleranciaentrada',
                        sortable: true,
                        header: 'Tolerancia entrada',
                        width: 30,
                        hiddeable:false
                    });
                    columns.push({
                        dataIndex: 'toleranciasalida',
                        sortable: true,
                        header: 'Tolerancia salida',
                        width: 30,
                        hidden:false,
                        hiddeable:false
                    });
                }
                columns.push({
                    dataIndex: 'otrodia',
                    sortable: true,
                    header: 'Abarca otro día',
                    width: 25,
                    hiddeable:false,
                    renderer:boolean,
                });
                columns.push({
                    dataIndex: 'horas',
                    sortable: true,
                    header: 'Horas',
                    width: 15,
                    hiddeable:false
                });
                columns.push({
                    dataIndex: 'estructura',
                    sortable: true,
                    header: 'Estructura',
                    width: 50,
                    hiddeable:false
                });
                indexs.push({name:'idturnotrabajo'});
                indexs.push({name:'denominacion'});
                indexs.push({name:'fdesde'});
                indexs.push({name:'fhasta'});
                indexs.push({name:'horainicio'});
                indexs.push({name:'horafin'});
                indexs.push({name:'horarioalmuerzo'});
                indexs.push({name:'tiempodescanso'});

                if(sesiones == '0')
                {
                    indexs.push({name:'toleranciaentrada'});
                    indexs.push({name:'toleranciasalida'});
                }
                indexs.push({name:'otrodia'});
                indexs.push({name:'horas'});
                indexs.push({name:'estructura'});
                  if(sesiones == '1')
                {
                    continentGroupRow.push({header: ' ', align: 'center', colspan:10});
                    continentGroupRow.push({header: 'Primera sesi&oacute;n', align: 'center', colspan: 2})

                    columns.push({
                        dataIndex: 'horaentradaps',
                        sortable: false,
                        header: 'Hora entrada',
                        width: 30
                    });
                    indexs.push({name:'horaentradaps'});

                    columns.push({
                        dataIndex: 'horasalidaps',
                        sortable: false,
                        header: 'Hora salida',
                        width: 30
                    });
                    indexs.push({name:'horasalidaps'});

                    continentGroupRow.push({header: 'Segunda sesi&oacute;n', align: 'center', colspan: 2})

                    columns.push({
                        dataIndex: 'horaentradass',
                        sortable: false,
                        header: 'Hora entrada',
                        width: 30
                    });
                    indexs.push({name:'horaentradass'});

                    columns.push({
                        dataIndex: 'horasalidass',
                        sortable: false,
                        header: 'Hora salida',
                        width: 30
                    });
                    indexs.push({name:'horasalidass'});

                }

                var group = new Ext.ux.grid.ColumnHeaderGroup({
                    rows: [continentGroupRow]
                });

                scope.cmNewapa = new Ext.grid.ColumnModel(columns);
                var plantillaapa = new Ext.data.Record.create(indexs);
                var myReaderapa = new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos"
                }, plantillaapa);

                scope.stNewapa = new Ext.data.Store({
                    url : 'listarTurnoTrabajo',
                    reader : myReaderapa
                });

                scope.stNewapa.on('load',function(){
                    if (scope.Listado.getSelectionModel().getCount() == 0) {
                        vista.btnModificar.disable();
                        vista.btnEliminar.disable();
                    }
                });

                var smListadoApa = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                });

                smListadoApa.on('selectionchange',function(th){
                    if(th.getCount() == 1)
                    {
                        vista.btnModificar.enable();
                        vista.btnEliminar.enable();
                        scope.recSelected = th.getSelected();
                    }
                    else
                    {
                        vista.btnModificar.disable();
                        vista.btnEliminar.disable();
                    }
                });


               scope.Listado = new Ext.grid.GridPanel({
                    id: 'listadonewapa1',
                    store: scope.stNewapa,
                    width: '100%',
                    height:500,
                    viewConfig: {
                        forceFit: true
                    },
                    sm: smListadoApa,
                    plugins: (sesiones)?[expander, group]:[scope.expander],
                    cm: scope.cmNewapa,
                    bbar: new Ext.PagingToolbar({
                        pageSize: 15,
                        store: scope.stNewapa,
                        displayInfo: true,
                        displayMsg: 'Resultados {0} - {1} de {2}',
                        emptyMsg: "Ning&uacute;n resultado para mostrar"
                    }),
                   listeners:{
                   }
                });

                vista.panelGrid.add(scope.Listado);
                vista.panelGrid.doLayout();

                scope.stNewapa.loadData({
                    datos : responseData.datos,
                    cantidad : responseData.cantidad
                },true);

            }
        });

        vista.btnAdicionar.on('click', function(){
            vista.ventanaGestion.setTitle(idioma.lbTitVentAddTurnoTrabajo);
            vista.btnAplicar.show();
            vista.ventanaGestion.show();
        });

        vista.btnModificar.on('click', function(){
            vista.ventanaGestion.setTitle(idioma.lbTitVentModTurnoTrabajo);
            vista.btnAplicar.hide();
            vista.ventanaGestion.show();
            vista.formularioGestion.getForm().loadRecord(scope.recSelected);
            vista.EstructuraPadre.setValue(scope.Listado.getSelectionModel().getSelected().get('idestructura'));
            vista.EstructuraPadre.setRawValue(scope.Listado.getSelectionModel().getSelected().get('estructura'));
        },this);

        vista.btnEliminar.on('click', function(){
            Eliminar();
        }, this);

        function Eliminar(){
            mostrarMensaje(2, idioma.lbTitMsgSeguroEliminarR, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgEliminandoR);
                    Ext.Ajax.request({
                        url: 'delTurnoTrabajo',
                        params:{idturnotrabajo: scope.recSelected.data.idturnotrabajo},
                        callback: function(r) {
                            Ext.getBody().unmask();
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.codMsg == 3)
                                mostrarMensaje(3, idioma.lbTitMsgTurnoUso);
                            else {
                                mostrarMensaje(1, idioma.lbMsgDelTurnoTrabajoExito);
                            }
                            scope.stNewapa.reload();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.codMsg == 3)
                                mostrarMensaje(3, idioma.lbTitMsgTurnoUso);
                            else {
                                mostrarMensaje(1, idioma.lbMsgDelTurnoTrabajoExito);
                            }
                            scope.stNewapa.reload();
                        }
                    });
                }
            });
        }


        //Manipulador de HotKeys
var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
    key: 'imlbx',
    alt: true,
    stopEvent: true, 
    handler: function(k, e) {
        switch(k) {
            case 73:{ //i para adicionar
                    vista.ventanaGestion.setTitle(idioma.lbTitVentAddTurnoTrabajo);
				    vista.btnAplicar.show();
					vista.ventanaGestion.show();
                break;
            } 
            case 77:{ //m para modificar 
                if(!vista.btnModificar.disabled){
                    vista.ventanaGestion.setTitle(idioma.lbTitVentModTurnoTrabajo);
					vista.btnAplicar.hide();
					vista.formularioGestion.getForm().loadRecord(scope.recSelected);
					vista.ventanaGestion.show();
                }
                break;
            }
			 case 76:{ //l para limpiar
				vista.tfbuscar.reset();
				vista.dfFIniciob.reset();
				vista.dfFFinb.reset();
                modelo.fuenteDatosListado.load({params:{start:0, limit:15}});
               break;
            }
            case 66:{ //b para buscar 
                modelo.fuenteDatosListado.load({params:{denominacion: vista.tfbuscar.getValue(), fdesde: vista.dfFIniciob.getRawValue(),fhasta: vista.dfFFinb.getRawValue(),start:0, limit:15}});
                break;
            }
            case 88:{ //x para cancelar
                vista.ventanaGestion.hide();
                vista.formularioGestion.getForm().reset();
                break;
            }
        }
    }      
},{
    key: 46,//del para eliminar
    fn: function(){
        if(!vista.btnEliminar.disabled){
            Eliminar();
        }
    }
},{
    key: 13,//enter para aceptar
    fn: function(){
	 
        if(vista.btnAceptar.isVisible()){
            vista.btnAceptar.focus();
			scope.salvarFormulario(false);
        }        
    }
},{
    alt: true,
    ctrl: true,
    stopEvent: true,
    key: 'p',
    fn: function(){
        if(vista.btnAplicar.isVisible()){
            scope.salvarFormulario(true);
        }
    }
}]);
    }
}

