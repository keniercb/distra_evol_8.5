Ext.ns('Ext.component.persona');

Ext.component.persona.Modelo={

init: function(perfil) {
	
 //Store del grid de campos
    this.storeGrid = new Ext.data.JsonStore({
		url: 'getCampos',
		totalProperty: 'total',
		root: 'data',
		fields: [
		    {name: 'idcampo'},
		    {name: 'denominacion'},
		    {name: 'idtipodedato'},
		    {name: 'descripcion'},
		    {name:  'denom'}
		]
    }); 
 //Store del combo de tipo de dato
    this.stTipoDato = new Ext.data.JsonStore({
	    url:'getTipoDato',
	    root:'data',
	    totalProperty:'total',
	    fields: [
		    {name: 'idtipodedato'},
		    {name: 'denominacion'}
		    
	    ]
    });
       
     } 
      
    
};