Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

//Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
    	
    	//Store del listado de conceptos de percepciones y descuentos.
     	this.storeConcepto = new Ext.data.GroupingStore({
		    url: 'obtenerListadoConceptosPD',
			groupField:'tipoconcepto',
			sortInfo:{field: 'tipoconcepto', direction: "DESC"},
			reader:new Ext.data.JsonReader({
			    totalProperty: "cantidad",
			    root: "datos",
			    id: "idconceptopercepciondescuento" 
			}, [ {name: 'idconceptopercepciondescuento'}
				,{name: 'abreviatura'}
				,{name: 'denominacion'}
				,{name: 'fechainicio'}	
				,{name: 'fechafin'}		
				,{name: 'descripcion'}
				,{name: 'idtipoconceptopd'}
				,{name: 'tipoconcepto'}
				,{name: 'idexpresionmatematica'}
				,{name: 'expresionamostrar'}
				,{name: 'esdescuentoaplicarunaves'}
				])
		});

		//Store del combo de tipo de concepto.
        this.storeTipoConcepto = new Ext.data.Store({
            url: 'obtenerTiposConceptosPD',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idtipoconceptopd" 
                },[
                    {name: 'idtipoconceptopd'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

        //Store del listado de tarifas.
        this.storeTarifa = new Ext.data.Store({
            url: 'obtenerListadoTarifaConcepto',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idconceptopdtarifa" 
                },[
                    {name: 'idconceptopdtarifa'},
                    {name: 'idtarifa'},
                    {name: 'denomtarifa'},
                    {name: 'idformacalculo'},  
                    {name: 'denomformacalculo'},   
                    {name: 'importe'},
                    {name: 'idformula'},
                    {name: 'denomformula'},
                    {name: 'importeformula'}, 
                    {name: 'lugaresdecimales'}
            ])
        });

        //Store del combo de tarifas.
        this.storeNomTarifa = new Ext.data.Store({
            url: 'obtenerTarifas',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idtarifa" 
                },[
                    {name: 'idtarifa'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

        //Store del combo de formas de cálculo.
        this.storeFormaCalculo = new Ext.data.Store({
            url: 'obtenerFormasCalculo',
            baseParams: {tipo : 'tarifa'},
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idformacalculo" 
                },[
                    {name: 'idformacalculo'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

        //Store del listado de variables auxiliares de fórmulas.
        this.storeVariable = new Ext.data.Store({
            url: 'obtenerListadoVariablesAuxiliaresFormula',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idvariableauxiliarformula" 
                },[
                    {name: 'idvariableauxiliarformula'},
                    {name: 'denominacion'},
                    {name: 'idtipoentrada'},
                    {name: 'denomtipoentrada'},  
                    {name: 'idconfreportescertificaciones'}, 
                    {name: 'denomreporte'},   
                    {name: 'idvariablesconfreportescertificaciones'}, 
                    {name: 'denomvarreporte'}      
            ])
        });

        //Store del combo de formas de entrada de variables auxiliares.
        this.storeFormaEntradaVariable = new Ext.data.Store({
            url: 'obtenerFormasEntrada',
            baseParams: {tipo : 'varaux'},
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idtipoentrada" 
                },[
                    {name: 'idtipoentrada'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

  //Store del combo de fuente de busqda de variables historico.
        this.storeFuenteBusqda = new Ext.data.SimpleStore({
            fields: ['idfuente', 'denominacion'],
            data : [['1', 'Reporte'], ['2', 'Nómina']]
        });

        this.storeBusqda = new Ext.data.SimpleStore({
            fields: ['idbusqda', 'denominacion'],
            data : [['1', 'Ultimas incidencias'], ['2', 'Ultimos períodos']]
        });


        //Store del combo de tipos de reporte de variables auxiliares.
        this.storeTipoReporteVariable = new Ext.data.Store({
            url: 'obtenerTiposReportes',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idconfreportescertificaciones" 
                },[
                    {name: 'idconfreportescertificaciones'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

        //Store del combo de var de reporte de variables auxiliares.
        this.storeVarReporteVariable = new Ext.data.Store({
            url: 'obtenerVariablesTipoReporte',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idvariablesconfreportescertificaciones" 
                },[
                    {name: 'idvariablesconfreportescertificaciones'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

        //Store del listado de estructura escalar.
        this.storeEstrucEsc = new Ext.data.Store({
            url: 'obtenerListadoEstructurasEscalares',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idestructuraescalar" 
                },[
                    {name: 'idestructuraescalar'},
                    {name: 'denominacion'},
                    {name: 'idtipocampo'},
                    {name: 'denomtipocampo'},  
                    {name: 'idnomencladorreferencia'}, 
                    {name: 'denomnomenclador'},   
                    {name: 'nivel'}, 
                    {name: 'idtipoentrada'},
                    {name: 'denomtipoentrada'},
                    {name: 'idconfreportescertificaciones'}, 
                    {name: 'denomreporte'},   
                    {name: 'idvariablesconfreportescertificaciones'}, 
                    {name: 'denomvarreporte'} 
            ])
        });
        
        //Store del combo de hoja.
        this.storeHoja = new Ext.data.SimpleStore({
            fields: ['nivel', 'denominacion'],
            data : [['1', 'Si'], ['2', 'No']]
        });

        //Store del combo de tipos de campo de estructuras escalas.
        this.storeTipoCampoEstrucEsc = new Ext.data.Store({
            url: 'obtenerTiposCampo',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idtipocampo" 
                },[
                    {name: 'idtipocampo'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

        //Store del combo de nomencladores de estructuras escalas.
        this.storeNomencladorEstrucEsc = new Ext.data.Store({
            url: 'obtenerNomencladores',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idnomencladorreferencia" 
                },[
                    {name: 'idnomencladorreferencia'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });
        
        //Store del combo de formas de entrada de estructuras escalas.
        this.storeFormaEntradaEstrucEsc = new Ext.data.Store({
            url: 'obtenerFormasEntrada',
            baseParams: {tipo : 'estesc'},
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idtipoentrada" 
                },[
                    {name: 'idtipoentrada'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

        //Store del combo de tipos de reporte de estructuras escalas.
        this.storeTipoReporteEstrucEsc = new Ext.data.Store({
            url: 'obtenerTiposReportes',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idconfreportescertificaciones" 
                },[
                    {name: 'idconfreportescertificaciones'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });

        //Store del combo de var de reporte de estructuras escalas.
        this.storeVarReporteEstrucEsc = new Ext.data.Store({
            url: 'obtenerVariablesTipoReporte',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idvariablesconfreportescertificaciones" 
                },[
                    {name: 'idvariablesconfreportescertificaciones'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });
            
        

        //Store de la matriz de adyacencia.
        this.storeMatrizAdy = new Ext.data.Store({
            url: 'obtenerListadoEstructurasEscalaresAdyacentes',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "iddependenciaestructuraescalar" 
                },[
                    {name: 'iddependenciaestructuraescalar'},
                    {name: 'idestructuraescalaradyacente'},
                    {name: 'denomestruraescalar'}
            ])
        });

        //Store de los adyacentes.
        this.storeEstrucEscAdy = new Ext.data.SimpleStore({
            fields: ['idestructuraescalaradyacente', 'denominacion'],
        });

        //Store de las escalas.
        this.storeEscala = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: 'obtenerListadoEscalasTarifa',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idescalatarifa" 
                },[
                    {name: 'idescalatarifa'},
                    {name: '_is_leaf'},
                    {name: '_parent'},
                    {name: 'idoperadorcomparacion'},
                    {name: 'denomoperador'},
                    {name: 'valorinicial'},
                    {name: 'valorfinal'},
                    {name: 'idformacalculo'},
                    {name: 'denomformacalculo'},
                    {name: 'idconceptopdtarifa'},
                    {name: 'idestructuraescalar'},
                    {name: 'valorescalar'},
                    {name: 'denomescala'},
                    {name: 'adyacentes'},
                    {name: 'importe'},
                    {name: 'idformula'},
                    {name: 'denomformula'},
                    {name: 'importeformula'}
            ])
        });

        //Store del combo de operadores de comparación de escalas.
        this.storeOperadorEscala = new Ext.data.Store({
            url: 'obtenerOperadoresComparacion',
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idoperadorcomparacion" 
                },[
                    {name: 'idoperadorcomparacion'},
                    {name: 'denominacion'}, 
                    {name: 'valorinicial'},
                    {name: 'valorfinal'},
                    {name: 'denominacion'},    
                    {name: 'descripcion'}   
            ])
        });

        //Store del combo de formas de cálculo de escalas.
        this.storeFormaCalculoEscala = new Ext.data.Store({
            url: 'obtenerFormasCalculo',
            baseParams: {tipo : 'escala'},
            reader:new Ext.data.JsonReader({        
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idformacalculo" 
                },[
                    {name: 'idformacalculo'},
                    {name: 'denominacion'},     
                    {name: 'descripcion'}   
            ])
        });
    }
};