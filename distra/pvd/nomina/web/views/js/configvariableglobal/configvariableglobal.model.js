Ext.ns('Pvd.Nomina.Configuracion.VariableGlobal');

//Modelo de la vista del componente Configurar variables globales.
Pvd.Nomina.Configuracion.VariableGlobal.Modelo = {
    /**
     * Inicializar el modelo de la vista. 3
     */
    init: function() {
    	
    	//Store del listado de variables globales a nivel de sistema.
     	this.storeGpNivelSist = new Ext.data.Store({
		    url: 'obtenerConfigVariablesGlobales',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idvariableglobal" }, 
			[ 	 {name: 'idvariableglobal'}
				,{name: 'idvariableglobalvalor'}
				,{name: 'denominacion'}		
				,{name: 'abreviatura'}		
				,{name: 'valor'}	
			])
		});

		//Store del listado de variables globales a nivel de entidad.
     	this.storeGpNivelEnt = new Ext.data.Store({
		    url: 'obtenerConfigVariablesGlobales',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idvariableglobal" }, 
			[ 	 {name: 'idvariableglobal'}
				,{name: 'idvariableglobalvalor'}
				,{name: 'denominacion'}		
				,{name: 'abreviatura'}		
				,{name: 'valor'}	
			])
		});

		//Store del listado de variables globales a nivel de cargo.
     	this.storeGpNivelCargo = new Ext.data.Store({
		    url: 'obtenerConfigVariablesGlobales',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idvariableglobal" }, 
			[ 	 {name: 'idvariableglobal'}
				,{name: 'idvariableglobalvalor'}
				,{name: 'denominacion'}		
				,{name: 'abreviatura'}		
				,{name: 'valor'}	
			])
		});
    }
};