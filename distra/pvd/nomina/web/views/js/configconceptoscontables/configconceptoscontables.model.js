Ext.ns('Pvd.Nomina.Configuracion.ConceptosContables');

//Modelo de la vista del componente Configurar conceptos contables.
Pvd.Nomina.Configuracion.ConceptosContables.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
    	
    	//Store del listado de conceptos contables.
     	this.storeConceptosContables = new Ext.data.GroupingStore({
		    groupField:'denominaciontiponomina',
		    url: 'obtenerConfigConceptosContables',
			sortInfo:{field: 'idtiponomina', direction: "DESC"},
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", 
			 root: "datos", 
			 id: "idconceptoscontables" }, 
			[ 	 {name: 'idconceptoscontables'}
				,{name: 'denominacion'}	
				,{name: 'obligacion'}
				,{name: 'fdesde'}
				,{name: 'fhasta'}	
				,{name: 'descripcion'}
				,{name: 'idestructuramodelodomina'}
				,{name: 'denominacionestructuranomina'}
				,{name: 'denomelementogasto'}
				,{name: 'idtiponomina'}
				,{name: 'idpartidagasto'}
				,{name: 'idestructura'}
				,{name: 'id'}
				,{name: 'partida'}
				,{name: 'text'}
				,{name: 'denominaciontiponomina'}
				,{name: 'idconceptcontabelemtgasto'}
				,{name: 'idelementosgasto'}
				,{name: 'denomelementosgasto'}
				,{name: 'mostrardescuento'}
                ,{name: 'idparrafofiscal'}
                ,{name: 'idclienteproveedorcobropago'}
                ,{name: 'denominacionpf'}
                ,{name: 'nombrecuenta'}
                ,{name: 'idtienecobrospagos'}
                ,{name: 'denomtienecobrospagos'}
                ,{name: 'idtipocobrospagos'}
                ,{name: 'denomtipocobrospagos'}
                ,{name: 'idtipointegracioncobrospagos'}
                ,{name: 'denomidtipointegracioncobrospagos'}
                ,{name: 'cuentacontable'}
                ,{name: 'denom'}
                ,{name: 'liquidacobrosypagos'}
                ,{name: 'denomliquidacobrosypagos'}
                ,{name: 'idcampoliquidaobligacion'}
                ,{name: 'campoliquidaobligacion'}
			])
		});
		
		//Store del listado de tipos de nomina.
     	this.storeTiponomina = new Ext.data.Store({
		    url: 'obtenerTiposNomina',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", root: "datos", id: "idtiponomina" }, 
			[ 	 {name: 'idtiponomina'}
				,{name: 'denominaciontiponomina'}
				
			])
		});
		
		//Store del listado de la estructura de la nomina.
     	this.storeEstructuraNomina = new Ext.data.Store({
		    url: 'obtenerEstructuraNomina',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", root: "datos", id: "idestructuramodelodomina" }, 
			[ 	 {name: 'idestructuramodelodomina'}
				,{name: 'denominacionestructuranomina'}
				
			])
		});
		
		//Store del listado de la estructura de la nomina.
     	this.storeElementosdelGasto = new Ext.data.Store({
		    url: 'obtenerElementosGasto',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", root: "datos", id: "idelementosgasto" }, 
			[ 	 {name: 'idelementosgasto'}
				,{name: 'denominacion'}
				
			])
		});

        this.storeParrafoFiscal = new Ext.data.Store({
            url   : 'obtenerListadoParrafoFiscal',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idparrafofiscal" },
                [
                    {name: 'idparrafofiscal'}
                    ,
                    {name: 'denominacionpf'}
                ])
        });

        this.storeClienteProvCobrosPagos = new Ext.data.Store({
            url   : 'obtenerClienteProvCobrosPagos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idclienteproveedorcobropago" },
                [
                    {name: 'idclienteproveedorcobropago'}
                    ,
                    {name: 'nombrecuenta'}
                ])
        });

        this.storeCampoLiquidarObligacion = new Ext.data.Store({
            url: 'obtenerCampoLiquidarObligacion',
            reader:new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idcampoliquidaobligacion" },
                [ 	 {name: 'idcampoliquidaobligacion'}
                    ,{name: 'campoliquidaobligacion'}

                ])
        });

        this.storeCobrosPagos = new Ext.data.SimpleStore({
            //url   : 'obtenerClienteProvCobrosPagos',
            fields: [
                {name: 'idtienecobrospagos'}
                ,
                {name: 'cobrospagos'}
            ],
            data : [[1, 'Si'], [2, 'No']]
        });

        this.storeTipoCobrosPagos = new Ext.data.SimpleStore({
            fields: [
                {name: 'idtipocobrospagos'}
                ,
                {name: 'operacioncobrospagos'}
            ],
            data : [[1, 'Por cobrar'], [2, 'Por pagar']]
        });

        this.storeTipoIntegracioCobrosPagos = new Ext.data.SimpleStore({
            fields: [
                {name: 'idtipointegracioncobrospagos'}
                ,
                {name: 'tipointegracioncobrospagos'}
            ],
            data : [[1, 'Por personas'], [2, 'Global']]
        });

        this.stcuenta = new Ext.data.Store({
            url       : '/configuracion/modeloscontabilizacion/gestmodelos/index.php/gestionarmodelos/cargarCuentas',
            baseParams: {
                tipocta     : 2,
                idsubsistema: 71
            },
            reader    : new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'cuentacontable', mapping: 'id'},
                {name: 'denom', mapping: 'text'}
            ])
        });

		
    }
};