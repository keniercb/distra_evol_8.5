Ext.ns('Pvd.Nomina.Configuracion.ModeloNomina');

//Modelo de la vista del componente Configurar modelos de nómina.
Pvd.Nomina.Configuracion.ModeloNomina.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
    	
    	//Store del listado de tipos de modelos de nómina.
     	this.storeModeloN = new Ext.data.Store({
		    url: 'obtenerConfModelosNomina',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", root: "datos", id: "idtiponomina" }, 
			[ 	 {name: 'idtiponomina'}
				,{name: 'idconfmodelonomina'}
				,{name: 'idtipopago'}	
				,{name: 'denomtiponomina'}
				,{name: 'denomtipopago'}	
				,{name: 'categorias'}
				,{name: 'arrayCateg'}
			])
		});

		//Store del listado de tipos de pagos.
     	this.storeTipoPago = new Ext.data.Store({
		    url: 'obtenerTiposPago',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", root: "datos", id: "idtipopago" }, 
			[ 	 {name: 'idtipopago'}	
				,{name: 'denominacion'}
			])
		});

		//Store del listado de categorías de persona.
     	this.storeCategoriaPersona = new Ext.data.Store({
		    url: 'obtenerCategoriasPersona',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", root: "datos", id: "idcategoriapersona" }, 
			[ 	 {name: 'idcategoriapersona'}	
				,{name: 'denom'}
			])
		});
    }
};