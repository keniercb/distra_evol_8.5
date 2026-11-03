Ext.ns('Pvd.Nomina.Configuracion.PlantillaNominal');

//Modelo de la vista del componente Gestionar plantilla nominal.
Pvd.Nomina.Configuracion.PlantillaNominal.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
    	
    	//Store del listado de plantillas nominales.
     	this.storePlantillaN = new Ext.data.Store({
		    url: 'obtenerListadoPlantillasNominales',
			//autoload :true,
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idplantillanominal" }, 
			[ 	 {name: 'idplantillanominal'}
				,{name: 'denominacion'}		
				,{name: 'fechainicio'}		
				,{name: 'fechafin'}
				,{name: 'descripcion'}	
				,{name: 'codigo'}	
				,{name: 'idarea'}
				,{name: 'area'}
				,{name: 'orden'}
				,{name: 'idcentrocosto'}
				,{name: 'centrocosto'}
			])
		});

     	//Store del árbol de plantilla nominal.
		this.storeArbolPlantilla = new Ext.tree.TreeLoader({
            url:'obtenerEstructuraPlantillaNominal',
            baseParams: {idplantilla:0}
         });

        //Store del árbol de plantilla nominal.
        this.stCentrosCosto = new Ext.data.Store({
            url:'obtenerCentrosCosto',
            //autoload :true,
            reader:new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idcentrocosto" },
                [ 	 {name: 'idcentrocosto'}
                    ,{name: 'centrocosto'}
                ])
        });

        //Store del árbol de estructuras restantes.
        this.storeArbolRest = new Ext.tree.TreeLoader({
            url:'obtenerEstructuraRestante',
            baseParams: {identidad : 0}
         });

        //Store del árbol de estructuras insertadas.
        this.storeArbolInsert = new Ext.tree.TreeLoader({
            url:'obtenerEstructuraInsertadas',
            baseParams: {idplantilla : 0, identidad : 0 }
         });
		 
		//Store del cmbox area 
		this.cmbArea = new Ext.data.Store({
				url: 'obtenerArea',
				autoload:false,
				reader: new Ext.data.JsonReader(
					{root: "datos", id: "idarea"},
					[{name:'idarea'}, 
					{name:'area'}]
				),
				//autoLoad: true
		}); 
		 
   }
};