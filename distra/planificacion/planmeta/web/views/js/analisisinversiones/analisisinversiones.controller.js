Ext.ns('Gestionar.analisisinversiones');
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('analisisinversiones', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Gestionar.analisisinversiones.Modelo;
    modelo.init();
    var vista = Gestionar.analisisinversiones.Vista;
    vista.init(idioma, modelo);
    var acciones, idorganismo, objci;

    Gestionar.analisisinversiones.Controlador.init(idioma, vista, modelo);
});
Gestionar.analisisinversiones.Controlador = {
    init: function(idioma, vista, modelo) {
//        this.GraficasController = new Utilidades.Cmp.CmpGrafica({
//            idioma: idioma,
//            ejercicio: vista.cmbEjercicio.getValue(),
//            nodeEntidad: vista.entidadSeleccionada
//            //identidad: idorganismo
//                    //idinverion: _this.idinversion
//        });
        
        modelo.stCbejercicio.on({
            load: function(t, n, e) {
                vista.cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        });
        
        vista.treePanelinversion.on({
            click: function(n){
                vista.entidadSeleccionada = n;
                idejercicio = vista.cmbEjercicio.getValue();
                ejercicio = vista.cmbEjercicio.getRawValue();
                vista.Graficas.actualizarParametros(n, idejercicio, ejercicio);
                vista.Graficas.fnPintar(n, idejercicio, ejercicio);
            }
        });
    }
};
