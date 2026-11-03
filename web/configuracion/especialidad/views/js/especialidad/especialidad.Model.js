Ext.ns('Configuracio.Especialidad');
Configuracio.Especialidad.GestionarEspModel = {
	init:function(){
		this.treeLoader = new Ext.tree.TreeLoader({
			dataUrl:'cargararbol'
		});
	},
	
	dameNodeInfo :function(node){
        var record = Ext.data.Record.create(
            [{
                name: 'abrevespecialidad1'
            },

            {
                name: 'denespecialidad1'
            },

            {
                name: 'codespecialidad1'
            },

            {
                name: 'orden1'
            },

            {
                name: 'fechaini1'
            },

            {
                name: 'fechafin1'
            }]
            )
        return new record(
        {
            abrevespecialidad1: node.attributes.abrevespecialidad,
            denespecialidad1: node.attributes.denespecialidad,
            codespecialidad1:node.attributes.codespecialidad,
            orden1:node.attributes.orden,
            fechaini1:node.attributes.fechaini,
            fechafin1:node.attributes.fechafin
        });
    },
	//***************************************
    dameNodeInfoModificar: function(node){
        var record = Ext.data.Record.create(
            [{
                name: 'idespecialidad'
            },

            {
                name: 'abrevespecialidad'
            },

            {
                name: 'denespecialidad'
            },

            {
                name: 'codespecialidad'
            },

            {
                name: 'orden'
            },

            {
                name: 'fechaini'
            },

            {
                name: 'fechafin'
            }]
            )
        return new record(
        {
            idespecialidad: node.attributes.id,
            abrevespecialidad: node.attributes.abrevespecialidad,
            denespecialidad: node.attributes.denespecialidad,
            codespecialidad:node.attributes.codespecialidad,
            orden:node.attributes.orden,
            fechaini:node.attributes.fechaini,
            fechafin:node.attributes.fechafin
        });
    }
}