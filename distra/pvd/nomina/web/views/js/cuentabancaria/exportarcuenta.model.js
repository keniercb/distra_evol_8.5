Ext.ns('Pvd.Nomina.Banco.Acreditarcuentabancaria');

Pvd.Nomina.Banco.Acreditarcuentabancaria.Modelo = {
    init: function() {

     	this.stExportarcuenta = new Ext.data.Store({
            //url: 'obtenerperiododepagoexportado',
            reader:new Ext.data.JsonReader({
                root: "datos", 
                id: "id" }, 
                [{name: 'id'}
                ,{name: 'cod_tipid'}		
                ,{name: 'cod_paexid'}			
                ,{name: 'num_ideper'}			
                ,{name: 'apellido_1'}			
                ,{name: 'apellido_2'}			
                ,{name: 'nombre'}			
                ,{name: 'nom_apell'}
                ])
        });
        
        this.CargarParaExportarBanco = function(auxid, pidentidad){
			this.stExportarcuenta.removeAll();
			this.stExportarcuenta.load();
		};
		
    }
};

