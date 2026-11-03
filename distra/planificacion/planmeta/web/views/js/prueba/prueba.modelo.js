//Namespace del componente Actividad
Ext.ns('Validacion.Prueba.Actividad')

//Modelo del componente Actividad
Validacion.Prueba.Actividad.Modelo = {
    //Inicializar modelo de la vista
    init: function() {
        //Fuente de datos del listado de actividades.
        this.listadoActividades = new Ext.data.Store({
            url: 'listarActividades',
            autoLoad: true,
            reader: new Ext.data.JsonReader(
                    {root: "data", id: "idactividad", totalProperty: "total"},
            [{name: 'idactividad'}, {name: 'denominacion'}, {name: 'codigo'}]
                    )
        });
        this.listadoNormas = new Ext.data.Store({
            url: 'listarNormas',
            reader: new Ext.data.JsonReader(
                    {root: "data", id: "idnorma", totalProperty: "total"},
            [{name: 'idnorma'}, {name: 'denominacion'}, {name: 'cantbase'}]
                    )
        });
    }
}


