Ext.ns('Ext.component.persona');

Ext.component.persona.Modelo={

	init: function(perfil) {
		var reader = new Ext.data.JsonReader(
            {totalProperty: 'quantity', root: 'data', id: 'idlimitacion'},
            [
                {name:'idlimitacion'},
				{name:'idpersona'},
				{name:'idsituacionlaboralp'},
                {name:'numid'},
                {name: 'nombreyapellidos'},
				{name:'idcausa'},
				{name:'causa'},
				{name:'fdesde'},
				{name:'fhasta'},
				{name:'ueb'}
            ]
        );        
    
        this.store = new Ext.data.GroupingStore({
            url: 'getLimitaciones',
            reader: reader,
            sortInfo: {field: 'ueb', direction: "ASC"},
            groupField: 'ueb'
        });

		this.stPersonas = new Ext.data.Store({
			url:'getPersonas',
			reader: new Ext.data.JsonReader(
				{root: "data", id: "idpersona", totalProperty: "quantity"},
				[{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'},
					{name:'idcargo'},{name:'entidad_area'},{name:'idsituacionlaboralp'}]
			)
		});

		this.storeCausas = new Ext.data.JsonStore({
			url:'getcausas',
			root:'causas',
			fields : [
				{type: 'string', name : 'idcausa'},
				{type: 'string', name : 'dencausa'}
			]
		});
	}
};