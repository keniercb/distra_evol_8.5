/*Componente para gestionar el registro de Salarios y tiempo de servicio (SNC - 225)
 *@author 1er Tte. Frank Rodriguez Berroa
 *@email fberroa@xetid.cu
 */
Ext.ns('Pvd.Nomina.Submayor.GestReintegros');

//Controlador de la vista del componente Gestionar registro de salarios y tiempo de servicios.
Pvd.Nomina.Submayor.GestReintegros.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma            Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista             Vista general del componente Gestionar reintegros (Tipo: Pvd.Nomina.Submayor.GestReintegros.Vista)
     * @param modelo            Modelo de la vista del componente Gestionar reintegros (Tipo: Pvd.Nomina.Submayor.GestReintegros.Modelo)
     */
    init: function (idioma, vista, modelo) {

    vista.winEstructura.show();

        //Evento del componente de entidades
        vista.pobjestructura.on('estructuraselecionada',function(sm, nodo){
            //if(nodo.attributes.tipoestructura == 3){
                vista.btnAceptarEntidad.enable();
                vista.idestructura = nodo.id;
            //}
        }.createDelegate(this));

        //Evento del botón de estructuras.
        vista.btnAceptarEntidad.on('click', function(){
            vista.winReintegros.show();
            vista.gpPersonas.CambiarEntidad(vista.idestructura);
            vista.gpPersonas.Buscar();
        }.createDelegate(this));

        //Evento del selmodel del gris de personas
        vista.gpPersonas.on('personaselecionada', function(sel){
            vista.idpersona = sel.data.idpersona;
            vista.pfichadelapersona.mostrarFicha(vista.idpersona);
            modelo.storeReintegros.load({params:{idpersona: vista.idpersona, idestructura: vista.idestructura}});
        });



    }
};

