Ext.namespace('Banco.Cierre');

Banco.Cierre.Model={

	inicio:function(){

	//store para escoger las cuentas bancarias a cerrar
	    this.stlistadocuentas = new Ext.data.Store({
	        url : 'cargarcuentabancaria',
	        reader : new Ext.data.JsonReader({
	            root : 'datos',
	            id : 'idcuentabancaria'
	        }, 
	        [{
	            name : 'idcuentabancaria'
	        }, 

	        {
	            name : 'nrocuenta'
	        }, 

	        {
	            name : 'nombrecuentabancaria'
	        }, 

	        {
	            name : 'saldoenbancomo'
	        }, 

	        {
	            name : 'nombremoneda'
	        }	
	        ])
	    });
	}
}
