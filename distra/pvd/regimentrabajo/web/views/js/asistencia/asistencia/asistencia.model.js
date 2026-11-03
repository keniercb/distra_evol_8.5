Ext.ns('Pvd.ControlAsistencia.Asistencia');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.Asistencia.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.stListadoResumen = new Ext.data.GroupingStore({
            url: 'getResumen',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idasistencia'},{name:'idpersona'},{name:'numid'},{name:'nombreapellidos'}, {name:'fechahoraentrada'},
                    {name:'denomarea'},{name:'denomcargo'},{name:'fdesde'},{name:'fhasta'},{name:'hrsdescontadas'},{name:'fechahorasalida'},
                    {name:'fecharegistro'},{name:'denomentidad'},{name:'causa'}, {name:'horasextras'}]
            ),
            sortInfo:{field: 'causa', direction: "ASC"},
            groupField:'causa'
        });
        
        this.storeCausasAusencia = new Ext.data.JsonStore({
            url: 'cargacausasausencia',
            root: 'datos',
            fields:['idcausa','denominacion','color','abreviatura','tieneentradasalida','tieneperiodo']
        });

        this.recQrElement = new Ext.data.Record.create(
            {name:'idasistencia'},{name:'idpersona'},{name:'nombreapellidos'}, {name:'fechahoraentrada'},
            {name:'idcausa'},{name:'fdesde'},{name:'fhasta'},{name:'hrsdescontadas'},{name:'fechahorasalida'},{name:'fecharegistro'}
            ,{name:'denominacion'},{name:'abreviatura'},{name:'tieneperiodo'}/*,{name:'pordefecto'}*/,
            {name:'tieneentradasalida'},{name:'color'},{name:'presente'},{name:'idcategoria'},{name:'observacion'},
            {name:'idarea'}, {name:'denomarea'}, {name:'horasextras'},{name:'idcontrolador'}, {name:'controlador'},{name:'idpersonamodifica'}, {name:'personamodifica'}, {name:'actualizado'}
            ,{name:'idpersonacertifica'}, {name:'personacertifica'}, {name:'certificado'}
        );

        this.TreePanelLoader = new Ext.tree.TreeLoader({
            dataUrl:'/pvd/regimentrabajo/index.php/asistencia/cargacausasausencia',
            preloadChildren:true,
        });

        this.TreePanelLoaderSesiones = new Ext.tree.TreeLoader({
            dataUrl:'/pvd/regimentrabajo/index.php/asistencia/cargacausasausenciasesiones',
            preloadChildren:true,
        });

        this.storeTurnoTrabajo = new Ext.data.JsonStore({
            url: 'obtenerTurnoTrabajo',
            root: 'datos',
            fields:['idturnotrabajop','idturnotrabajo','denominacion', 'fecha', 'idgrupodescanso']
        });

        this.storeMultiplesCausas = new Ext.data.GroupingStore({
            url: 'getMultiplesCausas',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idasistenciamultiplescausas'},{name:'idcausa'},{name:'denomcausa'},{name:'idpersona'},{name:'fecharegistro'},
                    {name:'horaentradamc'},{name:'horasalidamc'},{name:'horas'}, {name:'observaciones'}, {name:'afectasalario'}, {name:'idasistencia'}]
            )
        });
        
        //Store del listado de tipos de destajo.
        this.crearStoreHoras = new Ext.data.Store({
           url: 'generarArregloHoras',
           reader:new Ext.data.JsonReader(
           {
            totalProperty: "cantidad", 
            autoLoad:true, 
            root: "datos", 
            id: "id" 
        }, 
           [ 	 
               ,{name: 'id'}		
               ,{name: 'texto'}	
               ,{name: 'hora'}	
               ,{name: 'valor'}	
           ])
       });

    }

};
