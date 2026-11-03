Ext.ns('PVD.Persona.ConfigEspecializacionCargo');
//Modelo de la vista del componente.
PVD.Persona.ConfigEspecializacionCargo.Modelo = {
	init: function () {
		this.stCargos = new Ext.data.Store({
			url : 'getCargos',
			reader : new Ext.data.JsonReader({
				root: 'datos', id: "idcargo", totalProperty: "cantidad"
			}, [{name: 'idcargo'}, {name : 'denominacion'}])
        });

		this.stHomologacionesCargos = new Ext.data.Store({
			url : 'getHomologaciones',
			reader : new Ext.data.JsonReader({
				root: 'datos', id: "idespcargo", totalProperty: "cantidad"
			}, [{name: 'idespcargo'},{name: 'idcargo'}, {name : 'denominacion'}])
        });
    }
};