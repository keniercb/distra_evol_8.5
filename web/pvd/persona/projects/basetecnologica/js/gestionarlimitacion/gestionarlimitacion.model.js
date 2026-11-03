Ext.ns('Ext.component.persona');

Ext.component.persona.Modelo={

	init: function(perfil) {
		var reader = new Ext.data.JsonReader(
            {totalProperty: 'total', root: 'data', id: 'idlimitacion'},
            [
                {name:'idlimitacion'},
				{name:'identificacion'},
                {name:'registro'},
                {name: 'nombre'},
                {name: 'apellido'},
                {name: 'apellido2'},
				{name:'causa'},
				{name:'fdesde'},
				{name:'fhasta'}       
            ]
        );        
    
        this.store = new Ext.data.GroupingStore({
            url: 'getLimitaciones',
            reader: reader,
            //baseParams: {idagenda: this.idagenda},
            sortInfo: {field: 'identificacion', direction: "ASC"},
            groupField: 'identificacion'
        }); 
		
		/* this.store = new Ext.data.JsonStore({
			url:'getLimitaciones',
			totalProperty:'total',
			root:'data',
			id: 'idlimitacion',
			fields:[
				{name:'idlimitacion'},
				{name:'idpersona'},
				{name:'numid'},
				{name:'nombre'},
				{name:'snombre'},
				{name:'papel'},
				{name:'sapel'},
				{name:'causa'},
				{name:'fdesde'},
				{name:'fhasta'}
			]
		}); */
		this.storeCausas = new Ext.data.JsonStore({
			url:'getCausas',
			root:'causas',
			fields : [
				{type: 'string', name : 'idcausa'},
				{type: 'string', name : 'dencausa'}
			]
		});
	}
};