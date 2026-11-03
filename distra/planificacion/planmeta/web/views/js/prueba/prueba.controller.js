//Namespace del componente actividad
Ext.ns('Validacion.Prueba.Actividad')

//Controlador de la vista
Validacion.Prueba.Actividad.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     * 
     * @author Damian Oscar Falcon Borras
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Usuario (Tipo: Sauxe.CasoEstudio.Usuario.Vista)
     * @param modelo Modelo de la vista del componente Usuario (Tipo: Sauxe.CasoEstudio.Usuario.Modelo)
     */


    init: function(idioma, vista, modelo) {

        vista.gridActividades.getSelectionModel().on('rowselect', function() {
            vista.gridNormas.getStore().reload();
        }, this);

        vista.btnAdicionar.on('click', function() {
            vista.ventana_adicionar.show();
        }, this);



    }

}
