Ext.ns('Pvd.Nomina.Pagos.Compartimentacion');

Pvd.Nomina.Pagos.Compartimentacion.Modelo = {
    init: function() {

     	this.stCompartimentacionCargos = new Ext.data.Store({
            url: 'buscarcargoscompartimentados',
            reader:new Ext.data.JsonReader({
                root: "datos", 
                id: "idcompartimentacionnomina" }, 
                [{name: 'idcompartimentacionnomina'}
                ,{name: 'idcargo'}	
                ,{name: 'cargo'}	
                ])
        });
        this.stCompartimentacionCategorias = new Ext.data.Store({
            url: 'buscarcategorias',
            reader:new Ext.data.JsonReader({
                root: "datos",
                id: "idcompartcargocategoria"
               },
                [{name: 'idcompartcargocategoria'}
                ,{name: 'denominacion'}
                ])
        });
        
     	this.stCompartimentacionTipoNomina = new Ext.data.Store({
            url: 'cargarcompartimentacion',
            reader:new Ext.data.JsonReader({
                root: "datos", 
                id: "idcompartimentacioncargoportiponomina" }, 
                [{name: 'idcompartimentacioncargoportiponomina'}
                ,{name: 'idcompartimentacionnomina'}	
                ,{name: 'idtiponomina'}	
                ,{name: 'tiponomina'}	
                ,{name: 'permiso'}	
                ])
        });

        this.stcategoria = new Ext.tree.TreeLoader({
            url: '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/getCategorias'
        });
        
        var arrPermisos = [[1, 'Leer'], [2, 'Certificar'], [3, 'Aprobar']];
        this.stPermisos = new Ext.data.SimpleStore({
            fields: [{name: 'valor'},{name: 'denominacion'}]
        });
        this.stPermisos.loadData(arrPermisos);
		
    }
};

