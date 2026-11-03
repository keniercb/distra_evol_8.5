Ext.ns('Pvd.Nomina.Configuracion.GestSubordinacion');

//Modelo de la vista del componente Gestionar subordinacion.
Pvd.Nomina.Configuracion.GestSubordinacion.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
    	
    	//Store del árbol de subordinacion.
		this.storeArbolPlantilla = new Ext.tree.TreeLoader({
            url:'obtenerEstructura'
         });
		 
		 //Store del listado de cargos.
     	this.storeCargos = new Ext.data.Store({
		    url: 'obtenerListadoCargosSubordinados',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idsubordinacion" }, 
			[{name: 'idsubordinacion'}
			 ,{name: 'idjefe'}
			 ,{name: 'idsubordinado'}
			 ,{name: 'denomcargo'}		
			 ,{name: 'descripcion'}	
			])
		});
		
		//Store del listado de personas subordinadas.
     	this.storePersonas = new Ext.data.Store({
		    url: 'obtenerListadoPersonasSubordinados',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idpersona" }, 
			[{name: 'idpersona'}
			 ,{name: 'nombreapp'}
			 ,{name: 'descripcion'}
			])
		});

    }
};