/*Componente para gestionar el registro de Salarios y tiempo de servicio (SNC - 225)
 *@author 1er Tte. Frank Rodriguez Berroa
 *@email fberroa@xetid.cu
 */
Ext.ns('Pvd.Nomina.Submayor.GestReintegros');
//Modelo de la vista del componente Gestionar registro de salarios y tiempo de servicios.
Pvd.Nomina.Submayor.GestReintegros.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
    	
        //Store del listado de Gestionar registro de salarios y tiempo de servicios.
      this.storeReintegros = new Ext.data.Store({
           // groupField:'anno',
            url: 'obtenerListadoReintegros',
            //sortInfo:{field: 'anno', direction: "DESC"},
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idreintegropersona"
                },[
                    {name: 'idreintegropersona'},
                    {name: 'idpersona'},
                    {name: 'idestructura'},
					{name: 'importe'},
					{name: 'operacion'},
					{name: 'fecha'},
					{name: 'idreintegropersona'},
					{name: 'idtiponomina'},
					{name: 'tiponomina'},
					{name: 'tipomoneda'},
					{name: 'moneda'},
					{name: 'idfechacierre'},

            ])
        });


    }
};
