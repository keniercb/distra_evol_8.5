Ext.ns('Pvd.Nomina.CalcularPagoResultado');

Pvd.Nomina.CalcularPagoResultado.Modelo = {
    init: function() {

     	this.stExportarSBC = new Ext.data.Store({
            url: 'cargardatosSalariosBaseCalculo',
            reader:new Ext.data.JsonReader({
                root: "datos", 
				totalProperty: "cantidad",
                id: "idpagoresultado" }, 
                [{name: 'idpagoresultado'}
                ,{name: 'idpersona'}
                ,{name: 'ci'}
                ,{name: 'nombreyapellidos'}
				,{name: 'sbct'}	
                ,{name: 'evalarea'}		
                ,{name: 'evalindividual'}			
                ,{name: 'cpd'}			
                ,{name: 'sbctcpd'}			
                ,{name: 'ids'}			
                ,{name: 'ctrt'}			
                ])
        });
        
        this.CargarParaExportarSBC = function(auxid, pidentidad){
			this.stExportarSBC.removeAll();
			this.stExportarSBC.load({params:{limit:100, start:0}});
		};
		
    }
};

