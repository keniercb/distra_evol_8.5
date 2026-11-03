Ext.ns('Pvd.Nomina.Pago.Retencion');

//Modelo de la vista del componente Gestionar retenciones.
Pvd.Nomina.Pago.Retencion.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
    	
        //Store del listado de retenciones.
        this.storeRetenc = new Ext.data.Store({
            url: 'obtenerListadoRetenciones',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idretencionpersona" 
                },[
                    {name: 'idretencionpersona'},
                    {name: 'idtiporetencion'},
                    {name: 'saldoinicial'},
                    {name: 'mensualidad'},
                    {name: 'ultmensualidad'},
                    {name: 'refdocumentoacredita'},
                    {name: 'fechadocumento'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'tiporetencion'},
            ])
        });

        //Store del listado de retenciones hist.
        this.storeRetencHist= new Ext.data.Store({
            url: 'obtenerListadoRetencionesss',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idretencionpersona" 
                },[
                    {name: 'idretencionpersona'},
            ])
        });

        //Store del listado de personas.
        this.storePersona = new Ext.data.Store({
            url: 'obtenerListadoPersonas',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idpersona" 
                },[
                    {name: 'idpersona'},
                    {name: 'numid'},
                    {name: 'nombre'},
                    {name: 'snombre'},
                    {name: 'papel'},
                    {name: 'sapel'},
            ])
        });

        //Store del combo de tipo de retención.
        this.storeTipoRetencion = new Ext.data.Store({
            url: 'obtenerTiposRetenciones',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idtiporetencion" 
                },[
                    {name: 'idtiporetencion'},
                    {name: 'denominacion'},
                    {name: 'descripcion'},
            ])
        });
    }
};