Ext.ns('Pvd.Nomina.Nomencladores.NomPeriodoVacaciones');

Pvd.Nomina.Nomencladores.NomPeriodoVacaciones.Panel = Ext.extend(Ext.Panel,{
    layout:'fit',
    region: 'center',
    heigth: '100%', 
    width:  '100%', 
    border: false,
    frame:false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar:1,
    initComponent: function() {
        
        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Vista();
        this.vista.init( this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralPerVac];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

    	Pvd.Nomina.Nomencladores.NomPeriodoVacaciones.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function( x){
            if(this.mostrar == 1){
                this.modelo.storePerVac.load({params:{limit:20, start:0}});
                this.mostrar = 2;
            }    
        },
        destroy : function(x){
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de períodos de vacaciones.
var Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Modelo = function(){
	/**
     * Inicializar el modelo de la vista.
     */
    this.init = function() {

    	//Store del listado de periodos de vacaciones.
     	this.storePerVac = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/nomperiodovacaciones/obtenerListadoPeriodosVacaciones',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idperiodovacaciones" }, 
			[ 	 {name: 'idperiodovacaciones'}
				,{name: 'tiempootorgar'}
				,{name: 'tiempodescontar'}		
				,{name: 'fechainicio'}	
				,{name: 'fechafin'}	
				,{name: 'descripcion'}	
			])
		});

    }
};

//Vista del componente Nomenclador de período de vacaciones.
var Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Vista = function(){
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de períodos de vacaciones (Tipo: Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Modelo).
     */
    this.init = function(perfil, idioma, modelo) {

        var self = this;

    	//Listado de período de vacaciones.
    	function centrarValor(val){
			if(val)
				return "<center>"+val+"</center>";
		}

        this.expanderPerVac = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });

        this.smPerVac = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

		this.gpPerVac = new Ext.grid.GridPanel({
			id:'idgpPerVac',
			title:idioma.lbTitlePerVac,
			region:'center',
			columns: [{header: 'idperiodovacaciones',	hidden: true, hideable: false, dataIndex: 'idperiodovacaciones'}
                    ,this.expanderPerVac 
		            ,{header: '<center>'+idioma.lbColTiempoOtorgar+'</center>', width: 200, sortable: true,	dataIndex: 'tiempootorgar', renderer:centrarValor}			
					,{header: '<center>'+idioma.lbColTiempoDescontar+'</center>', width: 200, sortable: true, dataIndex: 'tiempodescontar', renderer:centrarValor}
		            ,{header: '<center>'+idioma.lbColDesde+'</center>', width: 90, sortable: true, dataIndex: 'fechainicio', renderer:centrarValor}
		            ,{header: '<center>'+idioma.lbColHasta+'</center>', width: 90, sortable: true, dataIndex: 'fechafin', renderer:centrarValor}
			],
			stripeRows: true,
			autoScroll:true,
			border: false,
			width: '100%', 
			heigth: '100%', 
			viewConfig: {forceFit: true},
			store: modelo.storePerVac,
            sm: this.smPerVac,
            plugins:this.expanderPerVac,
		    loadMask:{msg : idioma.lbMaskGridCargando},
            bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: modelo.storePerVac,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            }),
		});

        //Botones de Add, Mod, Elim, Ayud de período de vacaciones.
        this.btnAdicionarPerVac = new Ext.Button({
            id: 'btnAddPerVac',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddPerVac,
           // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaPerVac',
            nextTab: 'btnModPerVac',
        });

        this.btnModificarPerVac = new Ext.Button({
            id: 'btnModPerVac',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModPerVac,
          //  icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddPerVac',
            nextTab: 'btnElimPerVac',
        });

        this.btnEliminarPerVac = new Ext.Button({
            id: 'btnElimPerVac',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimPerVac,
          //  icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModPerVac',
            nextTab: 'btnAyudaPerVac',
        });

        this.btnAyudaPerVac = new Ext.Button({
            id: 'btnAyudaPerVac',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaPerVac,
           // icon:perfil.dirImg+'ayuda.png',
            iconCls:'ayuda',
            prevTab: 'btnElimPerVac',
            nextTab: 'btnAddPerVac',
        });

        //Panel contenedor del grid de períodos de vacaciones. 
        this.panelCentralPerVac = new Ext.Panel({
            id:'panelCentralPerVac',
            region:'center',
            heigth: '100%', 
            width:  '100%', 
            border:false,
            layout:'fit',
            tbar:[this.btnAdicionarPerVac, this.btnModificarPerVac, this.btnEliminarPerVac, '->', this.btnAyudaPerVac],
            items:[this.gpPerVac],
        });

        //Campo del formulario de períodos de vacaciones.
        this.tfTiempoOtorgar = new Ext.form.NumberField({id:'idtfTiempoOtorgar', fieldLabel:idioma.lbColTiempoOtorgar,
                                        tabIndex: 1, name: 'tiempootorgar', allowBlank: false, 
                                        anchor: '90%', prevTab: 'idbtnAceptarPerVac', 
                                        nextTab: 'idtfTiempoDescontar',
                                        blankText:idioma.lbErrorCampoVacio, 
                                        maxLength: 5,
                                        maxLengthText : idioma.lbMaxText_5,  
                                        maskRe :/[0-9.]/i,
                                        regex :/^\d+(\.\d{1,2})?$/i,
                                        regexText:idioma.lbErrorFormatoNum,
										maxValue: 30,
										maxText : idioma.lbDiasOtorgarMaxText,
										// minValue: 1,
										// minText : idioma.lbDiasOtorgarMaxText,
                                });
        this.tfTiempoDescontar = new Ext.form.NumberField({id:'idtfTiempoDescontar', fieldLabel:idioma.lbColTiempoDescontar, 
                                        tabIndex: 2, name: 'tiempodescontar', allowBlank: false,  anchor: '99%',
                                        blankText:idioma.lbErrorCampoVacio, 
                                        maxLength: 5,
                                        maxLengthText : idioma.lbMaxText_5,  
										maskRe :/[0-9.]/i,
                                        regex :/^\d+(\.\d{1,2})?$/i,
                                        regexText:idioma.lbErrorFormatoDescNum,
										maxValue: 24,
										maxText : idioma.lbDiasDescontarMaxText,
										// minValue: 1,
										// minText : idioma.lbDiasOtorgarMaxText
                                });
        this.dfFInicioPerVac = new Ext.form.DateField({id:'dfFInicioPerVac', fieldLabel:idioma.lbColDesde, 
                                        tabIndex: 3, name: 'fechainicio', allowBlank: false, 
                                        format:'d/m/Y', editable:true, readOnly : false, 
                                        value: new Date().format('d/m/Y'), maxText : idioma.lbFechaMaxima, 
                                        minText : idioma.lbFechaMinima, blankText:idioma.lbErrorCampoVacio, 
                                        invalidText: idioma.invalidTextFecha, vtype:'daterange', 
                                        anchor: '90%', endDateField: 'dfFFinPerVac'
                                });
        this.dfFFinPerVac = new Ext.form.DateField({id:'dfFFinPerVac', fieldLabel:idioma.lbColHasta, 
                                        tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
                                        format:'d/m/Y', editable:true, readOnly : false, 
                                        maxText : idioma.lbFechaMaxima, minText : idioma.lbFechaMinima, 
                                        blankText:idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha, 
                                        vtype:'daterange', anchor: '99%', startDateField: 'dfFInicioPerVac'
                                });
        this.tfDescripPerVac = new Ext.form.TextArea({id:'idtfDescripPerVac',
                                        fieldLabel:idioma.lbColDescripcion, tabIndex: 5, 
                                        name: 'descripcion', allowBlank: true, 
                                        hiddenname:'descripcion', 
										maxLength: 255,
										maxLengthText : idioma.lbMaxText_225, 
                                        anchor: '99%', prevTab: 'dfFFinPerVac', nextTab: 'idbtnCancelarPerVac',
                                        blankText:idioma.lbErrorCampoVacio, 
                                });

        //Formulario de períodos de vacaciones.
        this.formularioPerVac = new Ext.FormPanel({
            id:'idformularioPerVac',
            labelAlign: 'top',
            frame:true,
            width: 300,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },  
            items:[{layout:'column',
                        items:[
                            {columnWidth:.54, layout: 'form', items: [this.tfTiempoOtorgar]},
                            {columnWidth:.46, layout: 'form', items: [this.tfTiempoDescontar]},
                        ]
                    },{layout:'column',
                        items:[
                            {columnWidth:.54, layout: 'form', items: [this.dfFInicioPerVac]},
                            {columnWidth:.46, layout: 'form', items: [this.dfFFinPerVac]}
                        ]
                    },
                    this.tfDescripPerVac
            ],
        });

        //Botones de la ventana de adicionar período de vacaciones.
        this.btnCancelarPerVac = new Ext.Button({
            id:'idbtnCancelarPerVac',
            iconCls:'cancelar',
           // icon:perfil.dirImg+'cancelar.png',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idtfDescripPerVac', 
            nextTab: 'idbtnAplicarPerVac',
        });
        
        this.btnAplicarPerVac = new Ext.Button({
            id:'idbtnAplicarPerVac',
            iconCls:'aplicar',
          //  icon:perfil.dirImg+'aplicar.png',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarPerVac', 
            nextTab: 'idbtnAceptarPerVac',
        });

        this.btnAceptarPerVac = new Ext.Button({
            id:'idbtnAceptarPerVac',
            iconCls:'aceptar',
           // icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarPerVac', 
            nextTab: 'idtfTiempoOtorgar',
        });

        //Ventana de adicionar y modificar período de vacaciones.
        this.ventanaPerVac = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            resizable:false,
            constrain: true,
            layout: 'fit',
            autoValidate: true,
            validateDefault: true,
            items:[this.formularioPerVac],
            buttons: [this.btnCancelarPerVac, this.btnAplicarPerVac, this.btnAceptarPerVac] ,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarPerVac.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarConceptosContables.handler();
                    }
                },{
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarPerVac.handler();
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de período de vacaciones.
var Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Controlador = function(){
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de período de vacaciones (Tipo: Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de períodos de vacaciones (Tipo: Pvd_Nomina_Nomencladores_NomPeriodoVacaciones_Modelo)
     */
    this.init = function(idioma, vista, modelo) {

        var _vista=vista;

        /**
         *Variables generales
         */
        var variablesPerVac = {
            accion : 'Add',
            cambio : 0,
        };
        
        //Eventos del grid de período de vaciones.
        vista.gpPerVac.on('rowdblclick', function(e){
            mostrarVentanaModificarPerVac();
        }); 

        vista.gpPerVac.on('destroy', function(e){
            vista.ventanaPerVac.destroy();
        }); 

        //Eventos del store.
        modelo.storePerVac.on('beforeload', function(store){
            vista.btnModificarPerVac.disable();
            vista.btnEliminarPerVac.disable();
            store.removeAll();
        }); 
		
		modelo.storePerVac.on('load', function(store, records, opt){
			if(!records.length){
				mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
			}
        });
		
        //Eventos del seleccion model del grid.
        vista.smPerVac.on('rowselect', function(){
            vista.btnModificarPerVac.enable();
            vista.btnEliminarPerVac.enable();
        });

        //Eventos de campo de abreviatura. 
        vista.tfTiempoOtorgar.on('change', function(tf, n, o){
            variablesPerVac.cambio = 1;
        });

        //Eventos de campo de denominacion. 
        vista.tfTiempoDescontar.on('change', function(tf, n, o){
            variablesPerVac.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioPerVac.on('change', function(tf, n, o){
            variablesPerVac.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinPerVac.on('change', function(tf, n, o){
            variablesPerVac.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripPerVac.on('change', function(tf, n, o){
            variablesPerVac.cambio = 1;
        });

        //Eventos del botón adicionar.
        vista.btnAdicionarPerVac.setHandler(function(){
            mostrarVentanaAdicionarPerVac();
        });
        
        //Eventos del botón modificar.
        vista.btnModificarPerVac.setHandler(function(){
            mostrarVentanaModificarPerVac();
        });

        //Eventos del botón eliminar.
        vista.btnEliminarPerVac.setHandler(function(){
            eliminarPerVac();
        });

        //Eventos del botón cancelar.
        vista.btnCancelarPerVac.setHandler(function(){
            vista.ventanaPerVac.hide();
        });
        
        //Eventos del botón aplicar.
        vista.btnAplicarPerVac.setHandler(function(){
            salvarFormularioPerVac(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarPerVac.setHandler(function(){
            salvarFormularioPerVac(false);
        });

        //Evento de la ventana de adicionar/modificar 
        vista.ventanaPerVac.on('beforeshow', function(ventana){
            vista.formularioPerVac.getForm().reset();
            vista.tfTiempoOtorgar.focus(true,500);  
        });
        


        /*
         *Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarPerVac(){
            vista.ventanaPerVac.setTitle(idioma.lbTitleVentAdicionarPerVac);
            vista.btnAplicarPerVac.show();
            vista.ventanaPerVac.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarPerVac.setNextElement('idbtnAplicarPerVac');
            vista.btnAceptarPerVac.setPreviousElement('idbtnAplicarPerVac');
            variablesPerVac.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarPerVac(){
            vista.ventanaPerVac.setTitle(idioma.lbTitleVentModificarPerVac);
            vista.btnAplicarPerVac.hide();
            vista.ventanaPerVac.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarPerVac.setNextElement('idbtnAceptarPerVac');
            vista.btnAceptarPerVac.setPreviousElement('idbtnCancelarPerVac');
            vista.formularioPerVac.getForm().loadRecord(vista.smPerVac.getSelected());
            variablesPerVac.accion = 'Mod';
        }

         /*
         *Función para adicionar/modificar un período de vacaciones.
         */
        function salvarFormularioPerVac(boton){

            var urlAction = '/pvd/nomina/index.php/nomperiodovacaciones/adicionarPeriodoVacaciones';
            var idperiodovacaciones = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarPerVac;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoPerVac;

            if(variablesPerVac.accion == 'Mod'){
                lbMsgEspera = idioma.lbMsgModificarPerVac;
                lbMsgExito = idioma.lbMsgCorrectoModificadoPerVac;
                urlAction = '/pvd/nomina/index.php/nomperiodovacaciones/modificarPeriodoVacaciones';
                idperiodovacaciones= vista.smPerVac.getSelected().get('idperiodovacaciones');
            }
            if(variablesPerVac.cambio == 0){
                if(variablesPerVac.accion == 'Mod'){
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaPerVac.hide(); 
                }else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfTiempoOtorgar.markInvalid(idioma.lbErrorCampoVacio);
                    vista.tfTiempoDescontar.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }else{
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if(vista.formularioPerVac.getForm().isValid()){
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodpervac', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method:'POST',
                        params:{idperiodovacaciones : idperiodovacaciones,
                                tiempootorgar : vista.tfTiempoOtorgar.getValue(), 
                                tiempodescontar : vista.tfTiempoDescontar.getValue(), 
                                fechainicio : vista.dfFInicioPerVac.getRawValue(), 
                                fechafin : vista.dfFFinPerVac.getRawValue(), 
                                descripcion : vista.tfDescripPerVac.getValue(), 
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodpervac');

                            if(responseData.codigo == 1){
                                mostrarMensaje(1, lbMsgExito);
                                    if(!boton){
                                        vista.ventanaPerVac.hide();

                                    }else{
                                         vista.tfTiempoOtorgar.focus(true,500);  
                                    }
                                    vista.formularioPerVac.getForm().reset();
                                    modelo.storePerVac.removeAll();
                                    modelo.storePerVac.load({params:{limit:20, start:0}});
                                    variablesPerVac.cambio = 0;
                               
                                
                            }else{
                                if (responseData.codigo)
                                    mostrarMensaje(3, responseData.mensaje);
                            }
                        }
                    });
                }else{
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }     
            }
        }

        /*
         *Función para eliminar un período de vacaciones.
         */
        function eliminarPerVac(){
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2,idioma.lbTitleEliminarPerVac,function(btn){
                if(btn == "ok"){
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarpervac',idioma.lbMsgEsperaEnviarDatos,idioma.lbMsgEliminarPerVac);                    
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomperiodovacaciones/eliminarPeriodoVacaciones',
                        method:'POST',
                        params: {idperiodovacaciones:vista.smPerVac.getSelected().get('idperiodovacaciones')},
                        callback: function (options,success,response){
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarpervac');                                 
                            responseData = Ext.decode(response.responseText);
                            if(responseData.codigo){
                                //Mostrando el mensaje de que se ha eliminado.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoPerVac);
                                    //Recargando el grid.
                                    modelo.storePerVac.load({params:{limit:20, start:0}});
                              
                            }   
                        }           
                    });
                }
            });
        }

        /**
         *Teclas calientes de la interfaz.
         */
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true, 
            handler: function(k, e) {
               switch(k) {
                    case 73:{ //i para adicionar.
                        if(!vista.btnAdicionarPerVac.disabled && !vista.ventanaPerVac.isVisible()){
                               mostrarVentanaAdicionarPerVac();
                        }
                     break;
                    } 
                    case 77:{ //m para modificar .
                        if(!vista.btnModificarPerVac.disabled && !vista.ventanaPerVac.isVisible()){
                            mostrarVentanaModificarPerVac();
                        }
                     break;
                    }
                    case 72:{ //h para ayuda. 
                         if(!vista.ventanaPerVac.isVisible()){
                            vista.btnAyudaPerVac.focus();
							vista.btnAyudaPerVac.fireEvent('click');
                        }
                        break;
                    }
               }
            }      
        },{
            key: 46,//del para eliminar.
            fn: function(){if(!vista.btnEliminarPerVac.disabled && !vista.ventanaPerVac.isVisible()){
                eliminarPerVac();
            }},
        },{
            key: 13,//enter para aceptar.
            fn: function(){if(vista.btnAceptarPerVac.isVisible()){
                vista.btnAceptarPerVac.focus();
                vista.btnAceptarPerVac.fireEvent('click');
            }},
        }]);
    }
};

variablesGlobales.nomperiodovacaciones_js = 1;
