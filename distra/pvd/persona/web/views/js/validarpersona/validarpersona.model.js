
/*
 * Validar persona.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Riesgo
 * @uses Pvd.Persona.Validarpersona
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Persona.Validarpersona');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Persona.Validarpersona.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
        
        //Fuente de datos del listado de personas.
        this.stPersonas = new Ext.data.Store({
            url: 'getPersonas',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombre'}, {name:'snombre'}, {name:'papel'}, 
                    {name:'sapel'}, {name:'sexo'}, {name:'fuente'}, {name:'fechadevalidacion'}, {name:'horadevalidacion'}]
            )
        });
        
    }
};
