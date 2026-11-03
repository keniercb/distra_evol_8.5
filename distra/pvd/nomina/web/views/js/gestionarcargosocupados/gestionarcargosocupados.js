Ext.ns('Pvd.Nomina.Pagos.GestionarCargosOcupados');
Ext.QuickTips.init();

//********************************************************MODELO*****************************
Pvd.Nomina.Pagos.GestionarCargosOcupados.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function(idioma) {
        //Store del listado de tarifas.
        this.storeTarifa = new Ext.data.Store({
            url: 'obtenerListadoTarifaConcepto',
            reader:new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idconceptopdtarifa" 
            },[
            {
                name: 'idconceptopdtarifa'
            },

            {
                name: 'idtarifa'
            },

            {
                name: 'denomtarifa'
            },

            {
                name: 'idformacalculo'
            },  

            {
                name: 'denomformacalculo'
            },   

            {
                name: 'importe'
            }     
            ])
        });
		
        this.stSituacionLaboral = new Ext.data.Store({
            url : '/pvd/nomina/index.php/gestionarcargosocupados/obtenerSituacionLaboral',
            reader : new Ext.data.JsonReader({
                root : 'datos',
                totalProperty : 'cant',
                id : "idsituacionlaboral"
            }, [{
                name : 'idsituacionlaboral'
            }, {
                name : 'denominacion'
            },{
                name : 'cantcaracteres'
            }, {
                name : 'alfanumerico'
            }])//,
        /*listeners: {
                load: function(){_this.cbBuscartiponoidentidad.enable();}
            }*/
        });
		
		
		
    }   
};
//*******************************************VISTAS*****************************************************************

Pvd.Nomina.Pagos.GestionarCargosOcupados.Vista = {

    init: function(perfil, idioma, modelo) {
        var fecha = new Date();
		
        this.pobjestructuraCargos = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center'
            
        });
		
        this.btnAceptarCargo = new Ext.Button({
            text: idioma.btnAceptar,
            tooltip: idioma.btnAceptarCargoToolTip,
            disabled: true,
            iconCls: 'aceptar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
	   
        this.btnCancelarCargo = new Ext.Button({
            text: idioma.btnCancelar,
            tooltip: idioma.btncancelarSelCargotooltip,
            disabled: false,
            iconCls: 'cancelar'/*,
			prevTab: 'btnAyudaFormP',
			nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
		
        // ventana para comp Estruct y Comp para sel CArgos
        this.winEstructuraCargos = new Ext.Window({
            title: idioma.winEstructura,
            modal: true,
            height: 350,
            width: 300,
            closable:false,
            constrain: true,
            resizable:false, 
            layout: 'fit',
            items:[this.pobjestructuraCargos],
            buttons: [this.btnCancelarCargo,this.btnAceptarCargo] 
        });	
		
        //** ventana para comp Estruct y Comp para sel CArgos
        this.btnAceptarCargoCH = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: idioma.btnAceptar,
            tooltip: idioma.btnAceptarCargoToolTip,
            disabled: true,
            iconCls: 'aceptar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
	   
        this.btnCancelarCargoCH = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: 'Cancelar',
            tooltip: idioma.btncancelarSelCargotooltip,
            disabled: false,
            iconCls: 'cancelar'/*,
			prevTab: 'btnAyudaFormP',
			nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
		
        this.gpCargos = new PVD.Nomina.Pagos.Cargos({});
		
        this.winCargosCapHum = new Ext.Window({
            title: idioma.winCargosCH,
            modal: true,
            height: 350,
            width: 400,
            closable:false,
            constrain: true,
            resizable:false, 
            layout: 'fit',
            items:[this.gpCargos],
            buttons: [this.btnCancelarCargoCH,this.btnAceptarCargoCH] 
        });	
				
        //alert("Hola vista");
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 3,
            nivelchequear: 3
        });
        
        this.btnAceptarEntidad = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: idioma.btnAceptar,
            tooltip: idioma.btnAceptarEntidadT,
            disabled: true,
            iconCls: 'aceptar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
       
        this.btnAdicionar = new Ext.Button({
            id: 'btnadicionarreportecertificacion',
            text: idioma.btnAdicionar,
            tooltip: idioma.btnAdicionarToolTip,
            hidden: false,
            disabled: true,
            iconCls: 'adicionar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        this.btnModificar = new Ext.Button({
            id: 'btnmodificarreportecertificacion',
            text: idioma.btnModificar,
            tooltip: idioma.btnModificarToolTip,
            disabled: true,
            hidden: false,
            iconCls: 'modificar'/*,
            prevTab: 'btnAddFormP',
            nextTab: 'btnElimFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        this.btnEliminar = new Ext.Button({
            id: 'btneliminarreportecertificacion',
            text: idioma.btnEliminar,
            tooltip: idioma.btnEliminarToolTip,
            disabled: true,
            hidden: false,
            iconCls: 'eliminar'/*,
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',*/
        });
        
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: idioma.btnAyuda,
            tooltip: idioma.btnAyudatooltip,
            iconCls:'ayuda'/*,
            prevTab: 'btnElimFormP',
            nextTab: 'btnAddFormP',*/
        });
        
        //****ventana para seleccionar las embresas al inicio de CU
        this.winEstructura = new Ext.Window({
            title: idioma.winEstructura,
            modal: true,
            height: 350,
            width: 300,
            closable:false,
            constrain: true,
            resizable:false, 
            layout: 'fit',
            items:[this.pobjestructura],
            buttons: [this.btnAceptarEntidad] 
        });
       
        function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }
       
        this.smTarifa = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });
        this.gpCargosActual = new PVD.Nomina.Pagos.CargosOcupados({
		
            });
	   
	   
        //grid para la gestion de los cargo Actuales de la persona
        /* this.gpCargosActual = new Ext.grid.GridPanel({
            id:'idgpCargosOcupados',
            title:idioma.lbTitleTarifa,
            region:'center',
            columns: [{header: 'idcargosocupados',  hidden: true, hideable: false, dataIndex: 'idcargosocupados'}
                    ,{header: 'Cargo', width: 50, sortable: true, dataIndex: 'denomtarifa'}
                    ,{header: '<center>Situaci&oacute;n laboral</center>', fixed : true, width: 250, sortable: true, dataIndex: 'denomformacalculo', renderer:centrarValor}
                    ,{header: '<center>F.Reg.</center>', fixed : true, width: 150, sortable: true, dataIndex: 'importe', renderer:centrarValor}
                    ,{header: '<center>F.Aplic.</center>', fixed : true, width: 150, sortable: true, dataIndex: 'importe', renderer:centrarValor}
                    ,{header: '<center>F.Venc.</center>', fixed : true, width: 150, sortable: true, dataIndex: 'importe', renderer:centrarValor}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeTarifa,
            sm: this.smTarifa,
            loadMask:{msg : 'Cargando los cargos'},//idioma.lbMaskGridCargando
        });
		
		*/
        this.gpCargosHistorial = new PVD.Nomina.Pagos.CargosOcupados({
		
            });
        this.gpCargosHistorial = new Ext.grid.GridPanel({
            id:'idgpTarifa',
            title:idioma.lbTitleTarifa,
            region:'center',
            columns: [{header: 'idcargosocupados',  hidden: true, hideable: false, dataIndex: 'idcargosocupados'}
                    ,{header: 'Cargo', width: 50, sortable: true, dataIndex: 'denomtarifa'}
                    ,{header: '<center>Situaci&oacute;n laboral</center>', fixed : true, width: 250, sortable: true, dataIndex: 'denomformacalculo', renderer:centrarValor}
                    ,{header: '<center>F.Reg.</center>', fixed : true, width: 150, sortable: true, dataIndex: 'importe', renderer:centrarValor}
                    ,{header: '<center>F.Aplic.</center>', fixed : true, width: 150, sortable: true, dataIndex: 'importe', renderer:centrarValor}
                    ,{header: '<center>F.Venc.</center>', fixed : true, width: 150, sortable: true, dataIndex: 'importe', renderer:centrarValor}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeTarifa,
            sm: this.smTarifa,
            loadMask:{msg : 'Cargando los cargos'},//idioma.lbMaskGridCargando
        });
       
        //panel del componente persona
        this.panelObtPersonas = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            height: 300,
            width: '45%',
            split: true,
            region: 'west',
            cantidadPorPagina: 20
        });
        
        //tap panel para los cargos ocupados
        this.tabPanelConfigVar = new Ext.TabPanel({
            id:'idtabPanelConfigVar',
            region:'center',
            enableTabScroll:true,
            defaults: {
                autoScroll:true
            },
            resizeTabs:true,
            border:true,
            width:'100%',
            height:'100%',
            activeTab: 0,
            frame:true,
            items:[{    
                id:'idtabsistema',
                layout:'fit',
                title: idioma.tpActual,
                tbar:[this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnAyuda],
                items:[this.gpCargosActual]
            },{ 
                id:'idtabentidad',
                layout:'fit',
                title: idioma.tpHistorial,                  
                items:[this.gpCargosHistorial]
            }]   
        });
		   
        
        this.winCargosOcupados = new Ext.Window({
            title: idioma.wCargosOcup,
            modal: true,
            height: 600,
            width: 800,
            closeAction: 'hide',
            constrain: true,
            maximized: true,
            closable:true,
            resizable:false, 
            layout: 'border',
            items:[this.panelObtPersonas,this.tabPanelConfigVar]//,this.tabPanelConfigVar
        });
		
        /*ventana adicionar cargos*/
        /*componentes de la ventana*/
        /*textfield cargo*/
        this.tfCargo = new Ext.form.TextField({
            id:'tfCargo',
            fieldLabel:idioma.tfCargo,
            //allowBlank : false,
            //maxLength: 20,
            //nextTab: 'tfBuscarnombre'+idCmp,
            //prevTab: 'btnAceptarBusqueda'+idCmp,
            blankText : 'Este campo es obligatorio',
            maskRe : /^([a-z0-9A-Z��������\d]+ ?[a-z0-9A-Z��������\d]*)+$/,
            anchor:'95%',
            name : 'cargo'
			
        });
        /*textfield cargo*/
        this.cbSituacionLaboral = new Ext.form.ComboBox({
            id:'cbSituacionLaboral',
            store: modelo.stSituacionLaboral,
            tpl: '<tpl for="."><div ext:qtip="<p><b>{denominacion}</b></p>{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            fieldLabel: idioma.cbsituacionLaboralL,
            displayField : 'denominacion',
            hiddenName : 'idsituacionlaboral',
            valueField : 'idsituacionlaboral',
            mode : 'local',
            nextTab : 'dfFechaRegistro',
            prevTab : 'tfCargo',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection : true,
            emptyText:idioma.cbemtyText,
            editable: false,
            // allowBlank: false,
            selectOnFocus:true,
            anchor: '100%',
            msgTarget : 'qtip',
            blankText : idioma.cbblTSituacion,
            disabled: false
        });
		 
        /*fecha de registro*/
        this.dfFechaRegistro = new Ext.form.DateField({
            fieldLabel: idioma.dfFregistro,
            anchor: '98%',
            name: 'fecharegistro',
            id: 'fecharegistro',
            //width: 176,
            value: fecha.format('d/m/Y'),
            format:'d/m/Y',
            //vtype: 'daterange',
            //endDateField: 'fechafin',
            allowBlank:false,
            // invalidText:labels.lbBtnFecha,
            // blankText: labels.lbCampoVacio,
            prevTab     :'cbSituacionLaboral',
            nextTab     :'dfFechaAplicacion',
            listeners: {
                change: function(){
                    cambio = 1;
                }
            }
        });
		
        /*fecha de aplicacion */
        this.dfFechaAplicacion = new Ext.form.DateField({
            fieldLabel: idioma.dfFaplicacion,
            anchor: '98%',
            name: 'fechaaplicacion',
            id: 'fechaaplicacion',
            //width: 176,
            value: fecha.format('d/m/Y'),
            format:'d/m/Y',
            //vtype: 'daterange',
            //endDateField: 'fechafin',
            allowBlank:false,
            // invalidText:labels.lbBtnFecha,
            // blankText: labels.lbCampoVacio,
            prevTab     :'dfFechaRegistro',
            nextTab     :'dfFechaVencimiento',
            listeners: {
                change: function(){
                    cambio = 1;
                }
            }
        });
		
        /*fecha de vencimiento */
        this.dfFechaVencimiento = new Ext.form.DateField({
            fieldLabel: idioma.dfFvencimiento,
            anchor: '100%',
            name: 'fechavenc',
            id: 'fechavenc',
            //width: 176,
            value: fecha.format('d/m/Y'),
            format:'d/m/Y',
            //vtype: 'daterange',
            //endDateField: 'fechafin',
            allowBlank:false,
            // invalidText:labels.lbBtnFecha,
            // blankText: labels.lbCampoVacio,
            prevTab     :'dfFechaAplicacion',
            nextTab     :'taObservaciones',
            listeners: {
                change: function(){
                    cambio = 1;
                }
            }
        });

        /*textarea de observaciones*/
        this.taObservaciones = new Ext.form.TextArea({
            anchor:'100%',
            id:'descripcion',
            fieldLabel: idioma.taObservaciones,
            name:'descripcion',
            allowBlank:false,
            height: 120,
            prevTab     :'dfFechaVencimiento',
            nextTab     :'tfCargo'
        /*listeners: {
				change: function(){
					cambio = 1;
				}
			}*/
        });
		
        this.fpAsignarCargo = new Ext.FormPanel({
            id : 'fpAsignarCargo',
            labelAlign : 'top',
            autoHeight:true,
            frame: true,
            //labelWidth : 50,
            items : [{
                //layout : 'column',
                border : true,					
                items : [{                    
                    layout : 'column',
                    items:[{
                        columnWidth : .5,
                        layout : 'form',                        
                        items : [this.tfCargo]
                    },{
                        columnWidth : .5,
                        layout : 'form',                        
                        items : [this.cbSituacionLaboral]
                    }]
                },{
                    layout:'column',
                    items:[{
                        columnWidth:.33333,
                        layout: 'form',
                        items: [this.dfFechaRegistro]
                    },{
                        columnWidth:.33333,
                        layout: 'form',
                        items: [this.dfFechaAplicacion]
                    },{
                        columnWidth:.33333,
                        layout: 'form',
                        items: [this.dfFechaVencimiento]
                    }]
                }]
            }, this.taObservaciones]
        });
		
        this.LimpiarFormAsigCargos = function(){
            this.fpAsignarCargo.getForm().reset();
        }
		
        /*bton cancilar winAdicionarCargos*/
        this.btncancelar = new Ext.Button({
            text : idioma.btnCancelar,
            id: 'btnCancelarBusqueda',
            iconCls : 'cancelar',
            nextTab : 'btnLimpiarBusqueda',
            prevTab : 'btnAplicar',
            tooltip: idioma.btncancelartooltip
        });
		 
        /*bton aplicar cambios*/
        this.btnAplicar = new Ext.Button({
            text : idioma.btnAplicar,
            iconCls : 'aplicar',
            tooltip: idioma.btnAplicartooltip,
            //nextTab : 'btnAceptarBusqueda',
            prevTab : 'btncancelar',
            id : 'btnAplicarCambios'
        //handler : function() {_this.LimpiarComponenteBuscar();}
        });
		
        /*bton guardar cambios*/
        this.btnGuardar = new Ext.Button({
            text : idioma.btnAceptar,
            iconCls : 'guardar',
            tooltip: idioma.btnGuardartooltip,
            nextTab : 'tfCargo',
            prevTab : 'btncancelar',
            id : 'btnGuardarCambios'
        //handler : function() {_this.LimpiarComponenteBuscar();}
        });
		
        /*creacion final de la ventana*/
        this.winAdicionarCargos = new Ext.Window({
            plain : true,
            title : idioma.winAdicionarCargos,
            closeAction : 'hide',
            constrain: true,
            modal : true,
            frame: true,
            width : 366,
            height : 330,
            items:[this.fpAsignarCargo],
            buttons: [this.btncancelar,this.btnAplicar,this.btnGuardar]
        });		
		
    //this.enviarDatosServer = function(){ console.info('asdasdasd'); alert('paso por aqui...'); }
		
	
    }
};
//******************************* FIN DE LA VISTA*******************************

//*******************************CONTROLADOR******************************************
Pvd.Nomina.Pagos.GestionarCargosOcupados.Controlador = {
    init: function(idioma, vista, modelo) {
        var self = this;
        //this.identidad = null;
            
        vista.pobjestructura.on('estructuraselecionada',function(sm, nodo){
            //alert("Hola" + nodo.attributes.tipoestructura);
            // if( 1){//esto es lo que estaba pero no habilita bton aceptar
            //if(nodo.attributes.tipoestructura == 3){
                vista.btnAceptarEntidad.enable();
                self.identidad = nodo.id;
            //}
        }.createDelegate(this));
			
        //se habilita el boton aceptar de la ventana para sel cargo
        vista.pobjestructuraCargos.on('estructuraselecionada',function(sm, nodo){
            if(nodo.attributes.tipoestructura == 5){
                vista.btnAceptarCargo.enable();
                self.idCargo = nodo.id;		
                self.cargo = nodo.text;	
            //alert(' cargo '+ nodo.text);
            }
            else{
                vista.btnAceptarCargo.disable();
            }
        }.createDelegate(this));
            
        vista.btnAceptarCargo.setHandler(function(){
            vista.tfCargo.setValue(self.cargo);
            vista.winEstructuraCargos.hide();
        //alert(' cargo '+self.idCargo +' entidad '+self.identidad);	
        });
			
        var cargarDatosCargoAGrid = function(){
            vista.gpCargosActual.getStore().load({
                params: {
                    idpers: self.idpersona,
                    identidad: self.identidad						
                }
            });
        }
			
        vista.panelObtPersonas.on('personaselecionada',function(nodo){
            //alert("Hola "+nodo.id +' entidad '+self.identidad);				
            if(nodo.id){
                vista.btnAdicionar.enable();
            }
            self.idpersona = nodo.id;
            cargarDatosCargoAGrid();
                
        }.createDelegate(this));
            
        vista.tfCargo.on('focus',function(){
            var cant = vista.gpCargos.store.getCount();
            if(cant == 0){
                vista.winEstructuraCargos.show();
            }
            else{
                vista.winCargosCapHum.show();
            }				
        });
            
        vista.btnAceptarEntidad.setHandler(function(){
            vista.winCargosOcupados.show();
        //vista.pTiposReportesCertificaciones.Cargar();
        });
            
        vista.btnAdicionar.setHandler(function(){
            //alert("Adicionar un cargo ocupado") ;
            modelo.stSituacionLaboral.load();
            vista.winAdicionarCargos.show();//mostrando la ventana de adicionar cargo
        });
        vista.btnCancelarCargo.setHandler(function(){
            vista.winEstructuraCargos.hide(); 
        });
        vista.btnCancelarCargoCH.setHandler(function(){
            vista.winCargosCapHum.hide(); 
            vista.winEstructuraCargos.show(); 
        });
        vista.btncancelar.setHandler(function(){
            vista.winAdicionarCargos.hide(); 
            vista.LimpiarFormAsigCargos();
        });
			
        /*manejador de eventos para el combo cbSituacionLaboral*/
        vista.cbSituacionLaboral.on('select',function(){
            alert('cambio de options ' + vista.cbSituacionLaboral.getValue());
        });
			
        var enviarDatosServer = function(op){
            //*si son validos los datos del formulario/
            if(vista.fpAsignarCargo.getForm().isValid()){
                //console.info('true');
                //Se muestra la m�scara de espera.
                PVD.mostrarMascara('idmaskaddmodformap', "", idioma.lbMsgEsperaAddCargos);

                //Enviando datos al servidor.
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/gestionarcargosocupados/adicionarCargoOcupado',
                    method:'POST',						
                    params:{
                        idpersona : self.idpersona,
                        idcargo : self.idCargo, 
                        identidad : self.identidad, 
                        fecharegistro : vista.dfFechaRegistro.getValue().format('Y-m-d'), 
                        fechaaplicacion : vista.dfFechaAplicacion.getValue().format('Y-m-d'), 
                        fechavencimiento : vista.dfFechaVencimiento.getValue().format('Y-m-d'),
                        observaciones : vista.taObservaciones.getValue(), 
                        idsituacionlaboral : vista.cbSituacionLaboral.getValue()
                    },
                    callback: function (options,success,response){
                        responseData = Ext.decode(response.responseText);
                        //alert(responseData);

                        //Ocultando m�scara de enviar datos.
                        PVD.ocultarMascara('idmaskaddmodformap');

                        if(responseData.codMsg == 1){
                            mostrarMensaje(1, idioma.msgAdicionarCargoOk);
                            if (op == 'aplicar')
                            {
                                vista.LimpiarFormAsigCargos();									
                            }
                            if (op == 'guardar')
                            {
                                vista.LimpiarFormAsigCargos();
                                vista.winAdicionarCargos.hide();
                            }
                            cargarDatosCargoAGrid();
                        }else{
                            if (responseData.codMsg){
                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    }
                });
            }else{
                mostrarMensaje(3, 'mensaje de error de formulario');//idioma.lbErrorFormulario);
            }
        }
			
        vista.btnAplicar.setHandler(function(){             	
            enviarDatosServer('aplicar');				
        });
			
        vista.btnGuardar.setHandler(function(){
            enviarDatosServer('guardar');				
        });
			
        vista.winEstructura.show();
	
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarcargosocupados', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    var modelo = Pvd.Nomina.Pagos.GestionarCargosOcupados.Modelo;
    modelo.init(idioma);
 
    //Inicializando la vista.
    var vista = Pvd.Nomina.Pagos.GestionarCargosOcupados.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Pagos.GestionarCargosOcupados.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

});