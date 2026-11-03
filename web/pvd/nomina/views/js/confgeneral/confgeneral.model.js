Ext.ns('Pvd.Nomina.Configuracion.General');

//Modelo de la vista del componente Configurar Periodos De Pagos.
Pvd.Nomina.Configuracion.General.Modelo = {
    init: function () {

        //Loader del tree de configuraciones
        this.loaderArbolConfiguraciones = new Ext.tree.TreeLoader({
            // url: 'cargarArbolConfiguraciones'
            url: 'obtenerconfiguraciones'
        });
    }
};