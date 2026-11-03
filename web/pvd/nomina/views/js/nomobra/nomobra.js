/**
 * Nomenclador de tipos de nomina.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Nomencladores.NomObra.Panel
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Nomencladores.NomObra');

Pvd.Nomina.Nomencladores.NomObra.Panel = Ext.extend(Ext.Panel,{
    layout:'fit',
    region: 'center',
    heigth: '100%', 
    width:  '100%', 
    html:'dad',
    border: false,
    frame:false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar:1,
    initComponent: function() {
        
        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomObra_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomObra_Vista();
        this.vista.init( this.perfil, this.idioma, this.modelo);

         //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomObra_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralObra];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

    	Pvd.Nomina.Nomencladores.NomObra.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function( x){
            if(this.mostrar == 1){
                //this.modelo.storeObra.load({params:{limit:20, start:0}});
                this.mostrar = 2;
            }    
        },
        destroy : function(x){
            this.keyMap.disable();
        }
    }
});

//Modelo de la vista del Nomenclador de tipos de nómina.
var Pvd_Nomina_Nomencladores_NomObra_Modelo = function(){
	/**
     * Inicializar el modelo de la vista.
     */
    this.init = function() {

    	//Store del listado de tipos de nómina.
     	this.storeObra = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/nomobra/obtenerListadoObras',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idobra" }, 
			[ 	 {name: 'idobra'}
				,{name: 'denominacion'}		
				,{name: 'fechainicio'}	
				,{name: 'fechafin'}	
				,{name: 'descripcion'}	
			])
		});
		
	}
};

//Vista del componente Nomenclador de tipos de nómina.
var Pvd_Nomina_Nomencladores_NomObra_Vista = function(){
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomObra_Modelo).
     */
    this.init = function(perfil, idioma, modelo) {

        var self = this;

    	//Listado de tipos de nómina.
    	function centrarValor(val){
			if(val)
				return "<center>"+val+"</center>";
		}

        /*this.expanderObra = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });*/

        this.smObra = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });
				
        this.gpObra = new Ext.grid.GridPanel({
            id:'gpObra',
            title:idioma.lbTitleObra,
            region:'center',
            columns: [{header: 'idobra',	hidden: true, hideable: false, dataIndex: 'idobra'} 
                 //,this.expanderobra
					,{header: idioma.lbColDenominacion, width: 200, sortable: true, dataIndex: 'denominacion'}
                   	,{header: '<center>'+idioma.lbColDesde+'</center>', width: 90, sortable: true, align:'center', dataIndex: 'fechainicio'}
                    ,{header: '<center>'+idioma.lbColHasta+'</center>', width: 90, sortable: true, align:'center', dataIndex: 'fechafin'}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%', 
            viewConfig: {forceFit: true},
            store: modelo.storeObra,
            sm: this.smObra,
            //plugins:this.expanderObra,
            loadMask:{msg : idioma.lbMaskGridCargando},
            bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: modelo.storeObra,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            })
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de nómina.
        this.btnAdicionarObra = new Ext.Button({
            id: 'btnAdicionarObra',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddObra,
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaObra',
            nextTab: 'btnModificarObra'
        });

        this.btnModificarObra = new Ext.Button({
            id: 'btnModificarObra',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModObra,
        //    icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAdicionarObra',
            nextTab: 'btnEliminarObra'
        });

        this.btnEliminarObra = new Ext.Button({
            id: 'btnEliminarObra',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimObra,
           // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModificarObra',
            nextTab: 'btnAyudaObra'
        });

        this.btnAyudaObra = new Ext.Button({
            id: 'btnAyudaObra',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaObra,
           // icon:perfil.dirImg+'ayuda.png',
            iconCls:'ayuda',
            prevTab: 'btnEliminarObra',
            nextTab: 'btnAdicionarObra'
        });

        //Panel contenedor general del grid de tipos de nómina. 
        this.panelCentralObra = new Ext.Panel({
            id:'idpanelCentralObra',
            region:'center',
            heigth: '100%', 
            width:  '100%', 
            border:false,
            layout:'fit',
            tbar:[this.btnAdicionarObra, this.btnModificarObra, this.btnEliminarObra, '->', this.btnAyudaObra],
            items:[this.gpObra]
        });

        //Campos del formulario de tipos de nómina.
        this.tfDenomObra = new Ext.form.TextField({id:'idtfDenomObra', fieldLabel:idioma.lbColDenominacion,
                                        tabIndex: 2, name: 'denominacion', allowBlank: false,  anchor: '99%',
                                        prevTab: 'idbtnAceptarObra',
                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
                                        regexText:idioma.lbDenomIncorr, //maskRe
                                        blankText:idioma.lbErrorCampoVacio,
										maxLength:100,
                                        maxLengthText:idioma.lbMaxText_100,
        });
								
        this.dfFInicioObra = new Ext.form.DateField({id:'iddfFInicioObra', fieldLabel:idioma.lbColDesde, 
                                        tabIndex: 3, name: 'fechainicio', allowBlank: false, 
                                        format:'d/m/Y', editable:true, readOnly : false, 
                                        value: new Date().format('d/m/Y'), maxText : idioma.lbFechaMaxima, 
                                        minText : idioma.lbFechaMinima, blankText:idioma.lbErrorCampoVacio, 
                                        invalidText: idioma.invalidTextFecha, vtype:'daterange', 
                                        anchor: '90%', endDateField: 'iddfFFinObra'
                                });
                                
        this.dfFFinObra = new Ext.form.DateField({id:'iddfFFinObra', fieldLabel:idioma.lbColHasta, 
                                        tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
                                        format:'d/m/Y', editable:true, readOnly : false, 
                                        maxText : idioma.lbFechaMaxima, minText : idioma.lbFechaMinima, 
                                        blankText:idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha, 
                                        vtype:'daterange', anchor: '99%', startDateField: 'iddfFInicioObra'
                                });
								
		this.tfDescripObra = new Ext.form.TextArea({id:'idtfDescripObra',
                                        fieldLabel:idioma.lbColDescripcion, tabIndex: 5, 
                                        name: 'descripcion', allowBlank: true, 
                                        hiddenname:'descripcion',
										maxLength: 255, //regex, regexText, maskRe
										maxLengthText : idioma.lbMaxText_255, 
                                        anchor: '99%', prevTab: 'iddfFFinObra', nextTab: 'idbtnCancelarObra',
                                        blankText:idioma.lbErrorCampoVacio
                                }); 

         //Formulario de tipos de nómina.
        this.formularioObra = new Ext.FormPanel({
            id:'idformlarioObra',
            labelAlign: 'top',
            frame:true,
            width: 330,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },  
            items:[this.tfDenomObra,
			        {layout:'column',
                        items:[
                            {columnWidth:.5, layout: 'form', items: [this.dfFInicioObra]},
                            {columnWidth:.5, layout: 'form', items: [this.dfFFinObra]}
                        ]
                    },
					this.tfDescripObra
            ]
        });

        //Botones de la ventana de tipos de nómina
        this.btnCancelarObra = new Ext.Button({
            id:'idbtnCancelarObra',
            iconCls:'cancelar',
          //  icon:perfil.dirImg+'cancelar.png',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idtfDescripObra', 
            nextTab: 'idbtnAplicarObra',
        });
        
        this.btnAplicarObra = new Ext.Button({
            id:'idbtnAplicarObra',
            iconCls:'aplicar',
           // icon:perfil.dirImg+'aplicar.png',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarObra', 
            nextTab: 'idbtnAceptarObra'
        });

        this.btnAceptarObra = new Ext.Button({
            id:'idbtnAceptarObra',
            iconCls:'aceptar',
           // icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarObra', 
            nextTab: 'idtfDenomObra'
        });

        //Ventana de adicionar y modificar tipos de nómina.
        this.ventanaObra = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            autoValidate: true,
            validateDefault: true,
            resizable:false, 
            layout: 'fit',
            constrain :true,
            items:[this.formularioObra],
            buttons: [this.btnCancelarObra, this.btnAplicarObra, this.btnAceptarObra],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarObra.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarObra.handler();
                    }
                },{
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarObra.handler();
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de tipos de nómina.
var Pvd_Nomina_Nomencladores_NomObra_Controlador = function(){
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomObra_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomObra_Modelo)
     */
    this.init = function(idioma, vista, modelo) {
        var _vista=vista;
       
        var variablesObra = {
            accion : 'Add',
            cambio : 0
        };

        modelo.storeObra.load();
		
		//Eventos del grid de tipos de nómina.
        vista.gpObra.on('rowdblclick', function(e){
            mostrarVentanaModificarObra();
        }); 

        vista.gpObra.on('destroy', function(e){
            vista.ventanaObra.destroy();
        });

        //Eventos del store de tipos de nómina.
        modelo.storeObra.on('beforeload', function(store){
            vista.btnModificarObra.disable();
            vista.btnEliminarObra.disable();
            store.removeAll();
        }); 
        
		modelo.storeObra.on('load', function(store, records, opt){
			if(!records.length){
				mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
			}
        });
		
        //Eventos del seleccion model del grid de tipos de nómina.
        vista.smObra.on('rowselect', function(){
            vista.btnModificarObra.enable();
            vista.btnEliminarObra.enable();
         });

        
		//Eventos de campo de denominacion. 
        vista.tfDenomObra.on('change', function(tf, n, o){
            variablesObra.cambio = 1;
        });
		
			
        //Eventos de campo de fecha inicio. 
        vista.dfFInicioObra.on('change', function(tf, n, o){
            variablesObra.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinObra.on('change', function(tf, n, o){
            variablesObra.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripObra.on('change', function(tf, n, o){
            variablesObra.cambio = 1;
        });
		
		
        //Eventos del botón adicionar tipos de nómina.
        vista.btnAdicionarObra.setHandler(function(){
            mostrarVentanaAdicionarObra();
        });
        
        //Eventos del botón modificar tipos de nómina.
        vista.btnModificarObra.setHandler(function(){
            mostrarVentanaModificarObra();
        });

        //Eventos del botón eliminar tipos de nómina.
        vista.btnEliminarObra.on(function(){
            eliminarObra();
        });

        //Eventos del botón cancelar tipos de nómina.
        vista.btnCancelarObra.setHandler(function(){
            vista.ventanaObra.hide();
        });
        
        //Eventos del botón aplicar tipos de nómina.
        vista.btnAplicarObra.setHandler(function(){
            salvarFormularioObra(true);
        });

        //Eventos del botón aceptar tipos de nómina.
        vista.btnAceptarObra.setHandler(function(){
            salvarFormularioObra(false);
        });

        //Evento de la ventana de adicionar/modificar tipos de nómina.
        vista.ventanaObra.on('beforeshow', function(ventana){
            vista.formularioObra.getForm().reset();
            vista.tfDenomObra.focus(true,500);  
        });
		


       
        function mostrarVentanaAdicionarObra(){
            vista.ventanaObra.setTitle(idioma.lbTitleVentAdicionarObra);
            vista.btnAplicarObra.show();
            vista.ventanaObra.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarObra.setNextElement('idbtnAplicarObra');
            vista.btnAceptarObra.setPreviousElement('idbtnAplicarObra');
            variablesObra.accion = 'Add';
        }

       
        function mostrarVentanaModificarObra(){
            vista.ventanaObra.setTitle(idioma.lbTitleVentModificarObra);
            vista.btnAplicarObra.hide();
            vista.ventanaObra.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarObra.setNextElement('idbtnAceptarObra');
            vista.btnAceptarObra.setPreviousElement('idbtnCancelarObra');
			vista.formularioObra.getForm().loadRecord(vista.smObra.getSelected());
            variablesObra.accion = 'Mod';
        }

        
        function salvarFormularioObra(boton){
            var urlAction = '/pvd/nomina/index.php/nomobra/adicionarObra';
            var idobra = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarObra;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoObra;

            if(variablesObra.accion == 'Mod'){
                lbMsgEspera = idioma.lbMsgModificarObra;
                lbMsgExito = idioma.lbMsgCorrectoModificadoObra;
                urlAction = '/pvd/nomina/index.php/nomobra/modificarObra';
                idobra = vista.smObra.getSelected().get('idobra');
             }
            if(variablesObra.cambio == 0){
                if(variablesObra.accion == 'Mod'){
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaObra.hide(); 
                }else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomObra.markInvalid(idioma.lbErrorCampoVacio);
					mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }else{
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if(vista.formularioObra.getForm().isValid()){
                    
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodobra', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);
                   
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method:'POST',
                        params:{idobra : idobra,
                                denominacion : vista.tfDenomObra.getValue(), 
                                fechainicio : vista.dfFInicioObra.getRawValue(), 
                                fechafin : vista.dfFFinObra.getRawValue(), 
                                descripcion : vista.tfDescripObra.getValue()
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodobra');

                            if(responseData.codigo == 1){
                                mostrarMensaje(1, lbMsgExito);
                                    if(!boton){
                                        vista.ventanaObra.hide();

                                    }else{
                                         vista.tfDenomObra.focus(true,500);  
                                    }
                                    vista.formularioObra.getForm().reset();
                                    modelo.storeObra.removeAll();
                                    modelo.storeObra.load({params:{limit:20, start:0}});
                                    variablesObra.cambio = 0;
                               
                                
                            }else{
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, responseData.mensaje);
                            }
                        }
                    });
                }else{
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }     
            }
        }

        
        function eliminarObra(){
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2,idioma.lbTitleEliminarObra,function(btn){
                if(btn == "ok"){
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarobra',idioma.lbMsgEsperaEnviarDatos,idioma.lbMsgEliminarObra);                    
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomobra/eliminarObra',
                        method:'POST',
                        params: {idobra:vista.smObra.getSelected().get('idobra')},
                        callback: function (options,success,response){
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarobra');                                 
                            responseData = Ext.decode(response.responseText);
                            if(responseData.codigo == 1){
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoObra);
                                    //Recargando el grid de tipos de nómina.
                                    modelo.storeObra.load({params:{limit:20, start:0}});
                                
                            }else{
						      if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorObraomUso);
						  }   
                        }           
                    });
                }
            });
        }

        
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true, 
            handler: function(k, e) {
               switch(k) {
                    case 73:{ //i para adicionar.
                        if(!vista.btnAdicionarObra.disabled && !vista.ventanaObra.isVisible()){
                               mostrarVentanaAdicionarObra();
                        }
                     break;
                    } 
                    case 77:{ //m para modificar .
                        if(!vista.btnModificarObra.disabled && !vista.ventanaObra.isVisible()){
                            mostrarVentanaModificarObra();
                        }
                     break;
                    }
                    case 72:{ //h para ayuda. 
                         if(!vista.ventanaObra.isVisible()){
                            vista.btnAyudaObra.focus();
							vista.btnAyudaObra.fireEvent('click');
                        }
                        break;
                    }
               }
            }      
        },{
            key: 46,//del para eliminar.
            fn: function(){if(!vista.btnEliminarObra.disabled && !vista.ventanaObra.isVisible()){
                eliminarObra();
            }}
        },{
            key: 13,//enter para aceptar.
            fn: function(){if(vista.btnAceptarObra.isVisible()){
					vista.btnAceptarObra.focus();
					vista.btnAceptarObra.fireEvent('click');
            }}
        }]);
    }
};

variablesGlobales.nomobra_js = 1;
