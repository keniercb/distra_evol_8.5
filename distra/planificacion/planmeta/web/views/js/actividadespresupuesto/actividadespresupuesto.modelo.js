//Namespace del componente Actividades asociadas a presupuesto
Ext.ns('Planificacion.Presupuesto.Actividad')

//Modelo del componente Actividades asociadas a presupuesto
Planificacion.Presupuesto.Actividad.Modelo = {
    //Inicializar modelo de la vista
    init: function() {

        //Fuente de datos de las entidades
        this.listadoEntidades = new Ext.tree.TreeLoader({
            singleClickExpand: true,
            dataUrl: 'cargarEntidades'
        })

        //Fuente de datos de los planes
        this.listadoPlanes = new Ext.tree.TreeLoader({
            singleClickExpand: true,
            dataUrl: 'cargarPlanes'
        });

        this.rdActvs = new Ext.data.JsonReader(
                {root: 'data', id: 'idactividadentidad', importetotal: 'total', totalProperty: 'total'},
        [{name: 'idactividad'}, {name: 'denominacion'}, {name: 'codigo'},
            {name: 'idespecialidad'}, {name: 'importe'}, {name: 'importedivisa'},
            {name: 'idactividadentidadnae'}, {name: 'idobjetogasto'}, {name: 'idingreso'},
            {name: 'datos'}, {name: 'idplanificacionnaegeneral'}, {name: 'idactividadentidad'}]
                );

        //Fuente de datos de las actividades
        this.listadoActividades = new Ext.data.Store({
            url: 'listarActividades',
            reader: this.rdActvs
        });

        //Fuente de datos de los niveles de actividad economica
        this.listadoNAE = new Ext.data.Store({
            url: 'listarNAE',
            reader: new Ext.data.JsonReader(
                    {root: "data", id: "idnae", totalProperty: "total"},
            [{name: 'idnae'}, {name: 'codigo'}, {name: 'denominacion'}]
                    )
        });

        //Fuente de datos de los objetos de datos
        this.listadoObjetoGasto = new Ext.data.Store({
            url: 'listarOG',
            reader: new Ext.data.JsonReader(
                    {root: "data", id: "idobjetogasto", totalProperty: "total"},
            [{name: 'idobjetogasto'}, {name: 'codigo'}, {name: 'denominacion'}]
                    )
        });

        //Fuente de datos de los recursos financieros
        this.listadoRecursoFinanciero = new Ext.data.Store({
            url: 'listarRF',
            reader: new Ext.data.JsonReader(
                    {root: "data", id: "idrecursofinanciero", totalProperty: "total"},
            [{name: 'idrecursofinanciero'}, {name: 'codigo'}, {name: 'denominacion'}]
                    )
        });
    }
}

