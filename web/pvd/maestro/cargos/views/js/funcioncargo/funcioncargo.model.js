Ext.ns('PVD.Persona.FuncionCargo');
//Modelo de la vista del componente.
PVD.Persona.FuncionCargo.Modelo = {
	init: function () {

		this.stFuncionCargos = new Ext.data.GroupingStore({
			url : 'getFuncioncargo',
			reader : new Ext.data.JsonReader({
				root: 'datos', id: "idfunccargo", totalProperty: "cantidad"
			}, [{name: 'idfunccargo'},
				{name: 'idestructura'},
				{name: 'denominacion'},
				{name: 'especifica'}
			]),
			sortInfo: {field: 'especifica', direction: "ASC"},
			groupField: 'especifica'
        });
    }
};