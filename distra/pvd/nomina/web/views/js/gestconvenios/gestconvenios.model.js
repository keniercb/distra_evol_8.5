Ext.ns('Pvd.Nomina.Configuracion.GestConvenios');

//Modelo de la vista del componente Gestionar subordinacion.
Pvd.Nomina.Configuracion.GestConvenios.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.idestrucrura = 0;
    	
    	//Store del listado de cargos.
     	this.storeConvenios = new Ext.data.GroupingStore({
		    url: 'obtenerListadoConvenios',
            groupField:'obra',
            baseParams : {identidad:this.idestrucrura},
            sortInfo:{field: 'fechainicio', direction: "DESC"},
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idconvenio" }, 
			[{name: 'idconvenio'}
			 ,{name: 'numeroconvenio'}
			 ,{name: 'denominacion'}
			 ,{name: 'idobra'}
			 ,{name: 'obra'}
			 ,{name: 'porcientoejecucion'}
			 ,{name: 'salario'}
			 ,{name: 'penalizacion'}
			 ,{name: 'definido'}
			 ,{name: 'aprobado'}
			 ,{name: 'fechainicio'}
			 ,{name: 'fechafin'}
			 ,{name: 'descripcion'}		
			 ,{name: 'horas'}
			])
		});

        //Store del listado de las Obras.
        this.storeObras = new Ext.data.Store({
            url: 'obtenerListadoObras',
            reader:new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idobra" },
                [{name: 'idobra'}
                    ,{name: 'denominacion'}
                ])
        });
	}
};