//Empaquetando el componente tipo CajaFondo.
Ext.ns('Contabilidad.AsignarTipoCtaContable');

//Model del componente Documento.
Contabilidad.AsignarTipoCtaContable.Model = {
	init: function() {
		// JsonReader de gpIngresos
		this.rdIngresos = new Ext.data.JsonReader({
			id : 'idRecord',
			totalProperty : 'total',
			root : 'datos'
			},[{
				name : 'idcuenta'
			},{
				name : 'concatcta'
			},{
				name : 'descripcion'
			}]
		);
		
		// Store del gpIngresos
		this.stgridIngresos =  new Ext.data.Store({
			url : 'cargardatosgridingreso',
			reader : this.rdIngresos
		});
		
		// JsonReader de gpGastos
		this.rdGastos = new Ext.data.JsonReader({
			//root:'campos',
			id : 'idRecord',
			totalProperty : 'total',
			root : 'datos'
		},[{
			name : 'idcuenta'
		},{
			name : 'concatcta'
		},{
			name : 'descripcion'
		}]);
		
		// Store del gpGastos
		this.stgridGastos =  new Ext.data.Store({
			url : 'cargardatosgridgasto',
			reader : this.rdGastos
		});
		
		// JsonReader de gpCuentaResultado
		/* this.rdCuentaOrden = new Ext.data.JsonReader({
			id:'idRecord',
			totalProperty:'total',
			root:'datos'
			},[{
				name : 'idcuenta'
			},{
				name : 'concatcta'
			},{
				name : 'descripcion'
			}]
		);

		// Store del gpCuentaResultado
		this.stgridCuentaOrden =  new Ext.data.Store({
			url : 'cargardatosgridorden',
			reader : this.rdCuentaOrden
		}); */
		
		//JsonReader de gpCuentaResultado
		var rdCuentaResultado = new Ext.data.JsonReader({
			id:'idRecord',
			totalProperty : 'total',
			root : 'datos'
			},[{
				name : 'idcuenta'
			},{
				name : 'concatcta'
			},{
				name : 'descripcion'
			}]
		);

		//Store del gpCuentaResultado
		this.stgridCuentaResultado =  new Ext.data.Store({
			url : 'cargardatosgridresult',
			reader : this.rdCuentaResultado
		});
		
		////Store del combo para Subsistema/////  
		/* this.rdCargarTipoCuenta = new Ext.data.JsonReader({
			root:'nom',	
			id:'idCuenta'
			},[{
				name: 'idCuenta'
			},{
				name: 'descrip'
			}]
		);
		
		this.storeCargarTipoCuenta = new Ext.data.Store({
			url : 'cargartipocuenta',
			reader : this.rdCargarTipoCuenta
		}); */
		
		////Store del Grid de la ventana de incluir ctas///////                                        
		this.rdCargargrid = new Ext.data.JsonReader({
			totalProperty : "cantidad",
			root : 'datos',
			id : 'idcuenta'
			},[{
				name : 'concatcta'
			},{
				name : 'idcuenta'
			},{
				name : 'descripcion'
			},{
				name : 'ordender'
			},{
				name : 'ordenizq'
			},{
				name : 'idarbol'
			}]
		);
		   
		this.storeCargargrid = new Ext.data.Store({
			url : 'cargarcuentassintipo',
			reader : this.rdCargargrid
		});
		
	}
};