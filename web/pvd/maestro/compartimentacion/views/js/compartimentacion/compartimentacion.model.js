
/*
 * Compartimentacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Compartimentacion
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Maestro.Compartimentacion');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Maestro.Compartimentacion.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
	
        //Fuente de datos del listado de usuarios.
        this.stUsuarios = new Ext.data.Store({
            url: 'getUsuarios',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idusuario", totalProperty: "cantidad"},
                [{name:'idusuario'},{name:'nombreusuario'}]
            )
        });
		
		//Fuente de datos del listado de compartimentaciones.
        this.stCompartimentaciones = new Ext.data.Store({
            url: 'getCompartimentaciones',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcompartimentacion", totalProperty: "cantidad"},
                [{name:'idcompartimentacion'},{name:'denominacion'}, {name:'editable'}, {name:'pordefecto'}]
            )
        });
    }
};
