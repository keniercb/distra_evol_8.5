Ext.ns('Pvd.Nomina.SBC.ExportarSBC');

Pvd.Nomina.SBC.ExportarSBC.Modelo = {
    init: function() {

     	this.stExportarSBC = new Ext.data.GroupingStore({
            url: 'cargarSalariosBaseCalculo',
            reader:new Ext.data.JsonReader({
                root: "datos", 
				totalProperty: "cantidad",
                id: "iddatossbc" }, 
                [{name: 'iddatossbc'}
                ,{name: 'idpersona'}
                ,{name: 'ci'}
                ,{name: 'nombreyapellidos'}
                ,{name: 'sbc1'}		
                ,{name: 'sbc2'}			
                ,{name: 'sbc3'}			
                ,{name: 'sbct'}			
                ,{name: 'evalindividual'}			
                ,{name: 'evalcolectiva'}			
                ,{name: 'cpdt'}			
                ,{name: 'ids'}			
                ,{name: 'ctrt'}			
                ,{name: 'area'}			
                ,{name: 'idarea'}			
                ]),
			sortInfo: {field: 'idarea', direction: "ASC"},
			groupField: 'area'
        });
		
		this.stPlantillaNAreas = new Ext.data.Store({
		    url: 'obtenerAreas',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", root: "datos", id: "idarea" }, 
			[ 	 {name: 'idarea'}
				,{name: 'area'}		
				,{name: 'valor'}		
			]),
			autoLoad:true,
		});
        
        this.CargarParaExportarSBC = function(auxid, pidentidad){
			this.stExportarSBC.removeAll();
			this.stExportarSBC.load({params:{limit:20, start:0}});
		};
		
    }
};

