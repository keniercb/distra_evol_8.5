/**
 * Configuracion de las plantillas nominales.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Configuraciones.ConfigPlantillaNominalCentroCosto
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Configuraciones.ConfigPlantillaNominalCentroCosto');

Ext.QuickTips.init();
//Modelo de la intrefaz
Pvd.Nomina.Configuraciones.ConfigPlantillaNominalCentroCosto.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function(idioma) {
	//Selection model del grid
	this.smPlantillaCentroCosto = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });
	//Store del combo de centros de costo
    this.storePlantillaCentroCosto = new Ext.data.Store({
		url: '/pvd/nomina/index.php/configplantillanominalcentrocosto/obtenerListadoPlantillasCentrosCosto',
		reader:new Ext.data.JsonReader({
			totalProperty: "cantidad",
			root: "datos",
			id: "idplantillanominalcentrocosto" 
		}, [ {name: 'idplantillanominalcentrocosto'}
			,{name: 'idplantillanominal'}
			,{name: 'denomplantilla'}
			,{name: 'idcentrocosto'}
			,{name: 'denomcentrocosto'}
			
		])
	});	
    
	//Store del gid de plantillas y centros de costo
    this.storeCentroCosto = new Ext.data.Store({
		url: '/pvd/nomina/index.php/configplantillanominalcentrocosto/obtenerListadoCentroCosto',
		reader:new Ext.data.JsonReader({
			totalProperty: "cantidad",
			root: "datos",
			id: "idcentrocosto" 
		}, [ {name: 'idcentrocosto'}
			,{name: 'denomcentrocosto'}
			
		])
	});	
	
   }
};

//Vista
Pvd.Nomina.Configuraciones.ConfigPlantillaNominalCentroCosto.Vista = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Configuracion de nóminas (Tipo: Pvd.Nomina.Configuracion.ConfiguracionNomina.Modelo).
     */
    init: function(perfil, idioma, modelo) {
        //Variables globales de la interfaz
        this.idestructura = 0;
        this.idpersona = 0;
        this.idcargo = 0;
        this.cambio = 0;
        this.boton = 0;
        this.flag = 0;
        this.idsueldocargo = 0;
        this.idcargosocupados = 0;
        this.elementosalarialsalario = 0;
        this.accionElemento = 'Add';
        this.accionConcepto = 'Add';
        this.accionEscala = 'Add';
        this.conceptoseleccionado = "";
        this.identidadstore = 0;
        
        //Objeto de estructura y composicion		
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
        	layout: 'border',
            region:'center',
            nivel: 5,
            nivelchequear: 3
            
        });
        
		//Boton aceptar entidad
        this.btnAceptarEntidad = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: idioma.BtnAceptar ,
            tooltip: idioma.lbBtnAceptar,
            disabled: true,
            iconCls: 'aceptar',
            handler: function(){
            }.createDelegate(this)
        });
		
		//Boton aceptar de la ventana de Centros de costo
		this.btnAceptarConfPlantillaCentroCosto = new Ext.Button({
            id: 'btnAceptarConfPlantillaCentroCosto',
            text: idioma.BtnAceptarPc,
            tooltip: idioma.lbBtnAceptarPc,
            disabled: false,
            iconCls: 'aceptar',
            handler: function(){
            }.createDelegate(this)
        });
		
		//Boton cancelar de la ventana de Centros de costo
		this.btnCancelarConfPlantillaCentroCosto = new Ext.Button({
            id: 'btnCancelarConfPlantillaCentroCosto',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbbtnCancelar,
            prevTab: 'iddfFFinElemento',
            nextTab: 'idbtnAplicarElemento',
        });
        
		//Boton actualizar del grid de plantillas nominales y centros de costo
		this.btnActualizar = new Ext.Button({
            id: 'btnActualizar',
            text: idioma.btnActualizar,
            tooltip: idioma.lbbtnActualizar ,
			disabled: true,
            iconCls: 'actualizar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        //Ventana contenedora del objeto de estructura y composicion		
        this.winEstructura = new Ext.Window({
            title: idioma.lbTitleEntidades,
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable:false,
            resizable:false, 
            layout: 'fit',
            items:[this.pobjestructura],
            buttons: [this.btnAceptarEntidad] 
        });
        
		//Grid de plantillas nominales y centros de costo
	    this.gpPlantillaCentroCosto = new Ext.grid.GridPanel({
            id:'idgpPlantillaCentroCosto',
            title: idioma.lbTitlegpPlantillaCentroCosto,
            columns: [{header: idioma.lbColNombrePlantilla, width: 300, sortable: true, dataIndex: 'denomplantilla'} 
                    ,{header: idioma.lbColNombreCentro, width: 300, sortable: true, dataIndex: 'denomcentrocosto'} 
                    ],
            stripeRows: true,
            autoScroll:true,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storePlantillaCentroCosto,
            sm: modelo.smPlantillaCentroCosto,
            loadMask:{msg : 'Cargando'},
        });
		
		//Combo de centros de costo
		this.cbConfPlantillaCentroCosto = new Ext.form.ComboBox({id: 'ConfPlantillaCentroCosto', fieldLabel: 'Centro de costo',
            tabIndex: 1, valueField: 'idcentrocosto',
            displayField: 'denomcentrocosto', hiddenName: 'idcentrocosto',
            allowBlank: false, mode: 'local',
            prevTab: 'cbSectoralarialBuscar',
            nextTab: 'cbDenomCargo',
            store: modelo.storeCentroCosto, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });
		
		//Formulario con el combo de centros de costo
		this.formularioConfPlantillaCentroCosto = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            height: '100%',
            width: '100%',
            border: false,
			width: 400,
            autoHeight: true,
            buttonAlign:'right',
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [this.cbConfPlantillaCentroCosto],
        });
		
		//Ventana contenedora del formulario de centros de costo
		this.ventanaConfPlantillaCentroCosto = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioConfPlantillaCentroCosto],
            buttons: [this.btnCancelarConfPlantillaCentroCosto, this.btnAceptarConfPlantillaCentroCosto],
        });
		
       /*
        * Ventana general 
        */ 
        this.winMostrarConfPlantillaCentroCosto = new Ext.Window({
            //title:idioma.lbTitleConfiguracion,
			modal: true,
            height: 600,
            width: 800,
            closeAction: 'hide',
            constrain: true,
            maximized: true,
            closable:true,
            resizable:false, 
            layout: 'fit',
			tbar:[this.btnActualizar],
            items:[this.gpPlantillaCentroCosto]
        });


    }
};

//Controlador
Pvd.Nomina.Configuraciones.ConfigPlantillaNominalCentroCosto.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Configuracion de nóminas (Tipo: Pvd.Nomina.Configuracion.ConfiguracionNomina.Vista)
     * @param modelo Modelo de la vista del componente Configuracion de nóminas (Tipo: Pvd.Nomina.Configuracion.ConfiguracionNomina.Modelo)
     */
    init: function(idioma, vista, modelo) {
	    //Mostrandose la ventana para seleccionar la estructura
		vista.winEstructura.show();
		
		//evento al seleccionar una estructura en la ventana
		vista.pobjestructura.on('estructuraselecionada',function(sm, nodo){
			 //if(nodo.attributes.tipoestructura == 3){
                vista.btnAceptarEntidad.enable();
                vista.identidad = nodo.id;
                vista.idestructura = nodo.id;
                
            //}
        }.createDelegate(this));
        
		//Mostrandose el grid de plantillas nominales y centros de costo al presionar el boton acentar
        vista.btnAceptarEntidad.setHandler(function(){
            vista.winMostrarConfPlantillaCentroCosto.show();
			modelo.storePlantillaCentroCosto.load({params:{idestructura: vista.idestructura}});
			modelo.storeCentroCosto.load({params:{idestruct: vista.idestructura}});
        }.createDelegate(this));
        
		vista.ventanaConfPlantillaCentroCosto.on('show', function(win){
		    var idcentrocosto = vista.gpPlantillaCentroCosto.getSelectionModel().getSelected().get('idcentrocosto');
			vista.cbConfPlantillaCentroCosto.setValue(idcentrocosto);
		});
		
       //Habilitando el boton actualizar al seleccionar una fila de grid	
		modelo.smPlantillaCentroCosto.on('rowselect', function(sel) {
		    vista.btnActualizar.enable();
		});
		
		//Desabilitando el boton actualizar al desseleccionar una fila de grid
		modelo.smPlantillaCentroCosto.on('rowdeselect', function(sel) {
		    vista.btnActualizar.disable();
		});
		
		//Escondiendo la ventana al presionar el coton cancelar
		vista.btnCancelarConfPlantillaCentroCosto.on('click', function() {
             vista.ventanaConfPlantillaCentroCosto.hide();
		});
		
		//Mostrando la ventana de centros de costo al presionar el boton actualizar
		vista.btnActualizar.on('click', function() {
		     vista.cbConfPlantillaCentroCosto.setValue("");
             vista.ventanaConfPlantillaCentroCosto.show();
	    });
		
		//Haciendo referencia a la funcion actualizarDatos() al presionar el boton de aceptar
		 vista.btnAceptarConfPlantillaCentroCosto.on('click', function() {
             actualizarDatos();
        });
		
	   /*
	    *Funcion para actualizar los datos
		**/
		function actualizarDatos(){
		  var idcentrocosto = vista.cbConfPlantillaCentroCosto.getValue();
		  var idplantillanominalcentrocosto = vista.gpPlantillaCentroCosto.getSelectionModel().getSelected().get('idplantillanominalcentrocosto');
		  if(isNaN(idcentrocosto) == false){
		  vista.ventanaConfPlantillaCentroCosto.hide();
		  Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/configplantillanominalcentrocosto/actualizar',
                        method: 'POST',
                        params: {idcentrocosto: idcentrocosto,
                            idplantillanominalcentrocosto: idplantillanominalcentrocosto,
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            var result = responseData;
                            if(result == "Ok"){
                            mostrarMensaje(1, 'La plantilla nominal fue actualizada correctamente', function(){
							 modelo.storePlantillaCentroCosto.load({params:{idestructura: vista.idestructura}}); 
							});
                            }else{
						    mostrarMensaje(3, 'No se pudo actualizar la plantilla nominal', function(){
							 modelo.storePlantillaCentroCosto.load({params:{idestructura: vista.idestructura}}); 
							});
							}
                        }
                    });
		  }
		}
		
}
};
//Inicializando la vista.
UCID.portal.cargarEtiquetas('configplantillanominalcentrocosto', function(perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    
	//Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuraciones.ConfigPlantillaNominalCentroCosto.Modelo;
	modelo.init(idioma);
	
	//Inicializando la vista.
	var vista = Pvd.Nomina.Configuraciones.ConfigPlantillaNominalCentroCosto.Vista;
	vista.init(perfil, idioma, modelo);

	//Inicializar controlador.
	Pvd.Nomina.Configuraciones.ConfigPlantillaNominalCentroCosto.Controlador.init(idioma, vista, modelo);
	UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
   
});
