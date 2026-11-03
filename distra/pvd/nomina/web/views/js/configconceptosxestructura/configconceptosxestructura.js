/**
 * Configuracion de los conceptos x estructuras.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Configuraciones.ConfigConceptosxEstructura
 * @copyright UCID
 * @version 1.0
 * ////
 */
Ext.ns('Pvd.Nomina.ConfigConceptosxEstructura');
Ext.QuickTips.init();
var variablesGlobales = {};
//Modelo de la vista del Nomenclador de tipos de nómina.
Pvd.Nomina.ConfigConceptosxEstructura.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function(idioma) {
	 //Sel model del grid de esructura
	 this.smEstructura = new Ext.grid.RowSelectionModel({
            singleSelect:true,
            listeners: {
				rowselect: function(sm, index, rec){
					this.estructuraseleccionada = rec;
				}.createDelegate(this)
			}
      });
	  // Sel model del grid de conceptos
	  this.smConceptoPD = new Ext.grid.CheckboxSelectionModel({
            multiSelect:true,
      });
	 //Store de estructura 
	 this.storeEntidades = new Ext.data.Store({
            url: '/pvd/nomina/index.php/configconceptosxestructura/cargarestructura',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idestructura"
            }, [
                {name: 'idestructura'},
                {name: 'denominacion'}
            ])
        });
		
	 //Store de conceptos
	 this.storeConceptos = new Ext.data.Store({
            url: '/pvd/nomina/index.php/configconceptosxestructura/cargarconceptosPD',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idconceptopdxestructura"
            }, [
                {name: 'idconceptopdxestructura'},
                {name: 'idconceptopercepciondescuento'},
                {name: 'idestructura'},
                {name: 'abreviatura'},
                {name: 'denominacion'}
            ])
        });
    }
};

//Vista del componente Nomenclador de tipos de nómina.
Pvd.Nomina.ConfigConceptosxEstructura.Vista = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_ConfigConceptosxEstructura_Modelo).
     */
    init: function(perfil, idioma, modelo) {
	    this.estructuraseleccionada = "";
		
		//-----------------------------------------------------Aqui empieza la el codigo de la ventana de conceptos---------------------------------------
		//Obj del nomenclador de conceptos pd
		this.objConceptosPercepcionesDescuentos = new Pvd.nomina.nomencladores.ListarConceptosPercepcionesDescuentosComp({
            region: 'center',
            layout: 'fit',
            width: '100%',
            split: true,
            height: '100%',
            tipo: 2,
            seleccionMultiple: true
		});
		
		//Aceptar concepto pd
		this.btnAceptarConcepto = new Ext.Button({
            id: 'btnAceptarConcepto',
            text: 'Aceptar',
            tooltip: idioma.textToolTipAceptar,
            iconCls: 'aceptar',
            handler: function(){
            }.createDelegate(this)
        });
        
		//Aplicar concepto pd
        this.btnAplicarConcepto = new Ext.Button({
            id: 'btnAplicarConcepto',
            text: 'Aplicar',
			hiden: true,
            tooltip: idioma.textToolTipAplicar,
            iconCls: 'aplicar'
        });
        
        //Cancelar concepto pd
		this.btnCancelarConcepto = new Ext.Button({
            id: 'btnCancelarConcepto',
            text: 'Cancelar',
            tooltip: idioma.textToolTipCancelar,
            iconCls: 'cancelar'
        });
		
		//Ventana de conceptos pd
		this.winConceptosPercepcionDescuentos = new Ext.Window({
            title: 'Adicionar conceptos de percepci&oacute;n y descuentos',
            modal: true,
            height: 400,
            width: 600,
            closeAction: 'hide',
            constrain: true,
            closable:true,
            resizable:false, 
            layout: 'border',
            items:[this.objConceptosPercepcionesDescuentos],
            buttons:[this.btnCancelarConcepto, this.btnAplicarConcepto, this.btnAceptarConcepto]
        });
		
		//-----------------------------------------------------Aqui empieza la interfaz principal--------------------------------------------------------
		this.btnActualizar = new Ext.Button({
            id: 'btnActualizar',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar',
            disabled: true,
            iconCls: 'adicionar'
        });
		
		this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar',
            disabled: true,
            iconCls: 'eliminar'
        });
		
		//Grid de estructura
		this.gpEntidades = this.gpTipoNomina = new Pvd.Nomina.TreeGridEstructuras({
            id:'idgpEntidades',
            title: 'Listado de entidades',
			region: 'center',
            //width: '50%',
			width: '100%', 
            heigth: '100%',
			layout:'fit',
			listeners: {
                render: {
                    fn: function() {

                    }
                }
            }
        }); 
				
		//Grid de conceptos
		this.gpConceptosPD = new Ext.grid.GridPanel({
            id:'idgpgpConceptosPD',
            title: 'Listado de los pagos adicionales',
            layout:'fit',
            border: false,
            disabled: true,
            columns: [new Ext.grid.RowNumberer(), new Ext.grid.CheckboxSelectionModel()
			         ,{header: 'idconceptopdxestructura',  hidden: true, hideable: false, dataIndex: 'idconceptopdxestructura'}
			         ,{header: 'idconceptopercepciondescuento',  hidden: true, hideable: false, dataIndex: 'idconceptopercepciondescuento'}
                     ,{header: 'Abreviatura', fixed : true, width: 150, sortable: true, dataIndex: 'abreviatura', renderer: function(val){ return '<center><span style="color:green;">'+val+'</span></center>';}} 
                     ,{header: 'Denominaci&oacute;n', fixed : true, width: 400, sortable: true, dataIndex: 'denominacion', renderer: function(val){ return '<span style="color:green;">'+val+'</span>';}} 
                     ],
            stripeRows: true,
            autoScroll:true,
            width: '100%', 
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeConceptos,
            sm: modelo.smConceptoPD,
            loadMask:{msg : 'Cargando'},
			tbar: [this.btnActualizar, this.btnEliminar],
			bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: modelo.storeConceptos,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            }),
        });
	    
		//Panel de estructuras
	    this.panelEstructuras = new Ext.Panel({
			title: 'Entidades',
			region: 'center',
			layout: 'fit',
			height: 150,
			width: '50%',
			split: true,
			items: [this.gpEntidades]
		});
		
		//Panel de conceptos
		this.panelConceptos = new Ext.Panel({
			title: 'Pagos adicionales',
			layout: 'fit',
			region: 'east',
			height: 150,
			width: '50%',
			split: true,
			items: [this.gpConceptosPD]
		});

        //Vista general.
        new Ext.Viewport({
            layout: 'border',
            items: [this.panelEstructuras, this.panelConceptos]
        });
        
     }
};

//Controlador de la vista del Nomenclador de tipos de nómina.
Pvd.Nomina.ConfigConceptosxEstructura.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_ConfigConceptosxEstructura_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_ConfigConceptosxEstructura_Modelo)
     */
    init: function(idioma, vista, modelo) {
	    var idestructura = 0;
	    var arregloidconceptopd = new Array();
	
	    //Eventos del seleccion model del grid de entidades.
        vista.gpEntidades.selModel.on('rowselect', function(grid, index, sm) {
            idestructura = sm.get('_id');
			vista.btnActualizar.enable();
			modelo.storeConceptos.load({params:{idestructura: idestructura}});
			vista.gpConceptosPD.enable();
        });
		
		 //Eventos del seleccion model del grid de conceptos.
        vista.gpConceptosPD.selModel.on('rowselect', function(grid, index, sm) {
            vista.btnEliminar.enable();
        });
		
		//Evento del boton eliminar conceptos
		vista.btnEliminar.on('click', function(){
		    var contarrayidconfconceptospd = 0;
		    var arrayidconfconceptospd = new Array();
		    var arrselections = vista.gpConceptosPD.getSelectionModel().getSelections();
			for(var i = 0; i < arrselections.length; i++){
			  arrayidconfconceptospd[contarrayidconfconceptospd] = arrselections[i].data.idconceptopdxestructura;
			  contarrayidconfconceptospd++;
			}
		    PVD.mostrarMascara('idmaskenviardel', 'Por favor espere...', 'Eliminando el(los) pago(s) adicionales');
			 Ext.Ajax.request({
				url:'/pvd/nomina/index.php/configconceptosxestructura/eliminarconceptosPD',
				method:'POST',
				params: {
			       arrayidconfconceptospd: Ext.encode(arrayidconfconceptospd) 
				},
				callback: function (options,success,response){
				  var respuesta = Ext.decode(response.responseText);
				  PVD.ocultarMascara('idmaskenviardel');
				  mostrarMensaje(1, 'El(los) pago(s) se ha(n) eliminado satisfactoriamente');
				  modelo.storeConceptos.load({params:{idestructura: idestructura}});
				}.createDelegate(this)
			});
		});
		
		//Evento del boton Actualizar
	    vista.btnActualizar.on('click', function(btn){
		   if(vista.objConceptosPercepcionesDescuentos.gpConceptosPercepcionesDescuentos.getSelectionModel().hasSelection()){
		     vista.objConceptosPercepcionesDescuentos.Desmarcar();
		   }
		   vista.winConceptosPercepcionDescuentos.show();
		   vista.objConceptosPercepcionesDescuentos.Cargar();
		});
		
		//Evento del Btn Aceptar conceptos
		vista.btnAceptarConcepto.on('click', function(btn){
		   var conceptos = vista.objConceptosPercepcionesDescuentos.GetSeleccionados();
		   for(var i = 0; i<conceptos.length; i++){
		     arregloidconceptopd[i] = conceptos[i].data.idconceptopercepciondescuento;
		   }
		   adicionarconceptospdXEstructura();
		});
		
		//Evento del Btn Cancelar conceptos
		vista.btnCancelarConcepto.on('click', function(btn){
		   vista.winConceptosPercepcionDescuentos.hide();
		});
		
		function adicionarconceptospdXEstructura(){
		  if(vista.objConceptosPercepcionesDescuentos.gpConceptosPercepcionesDescuentos.getSelectionModel().hasSelection()){
		     PVD.mostrarMascara('idmaskenviaradd', 'Por favor espere...', 'Adicionando los pagos adicionales');
			 Ext.Ajax.request({
				url:'/pvd/nomina/index.php/configconceptosxestructura/adicionarconceptosPD',
				method:'POST',
				params: {
			      idestructura: idestructura,
				  arrayidconceptospd: Ext.encode(arregloidconceptopd) 
				},
				callback: function (options,success,response){
				  var respuesta = Ext.decode(response.responseText);
				  PVD.ocultarMascara('idmaskenviaradd');
				  vista.objConceptosPercepcionesDescuentos.Desmarcar();
    			  vista.winConceptosPercepcionDescuentos.hide();
				  mostrarMensaje(1, 'El concepto se ha adicionado satisfactoriamente');
				  modelo.storeConceptos.load({params:{idestructura: idestructura}});
				}.createDelegate(this)
			});
		  }else{
		    mostrarMensaje(3, 'Debe seleccionar al menos un concepto');
		  }
		}
    }
};


UCID.portal.cargarEtiquetas('configconceptosxestructura', function(perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    variablesGlobales.perfil = arguments[0];

    var modelo = Pvd.Nomina.ConfigConceptosxEstructura.Modelo;
    modelo.init(idioma);

    //Inicializando la vista.
    var vista = Pvd.Nomina.ConfigConceptosxEstructura.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.ConfigConceptosxEstructura.Controlador.init(idioma, vista, modelo);

});

