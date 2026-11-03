Ext.ns('Gestionar.analisisplanificacion');
Ext.QuickTips.init();

UCID.portal.cargarEtiquetas('analisisplanificacion', function (perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Gestionar.analisisplanificacion.Modelo;
    modelo.init();
    var vista = Gestionar.analisisplanificacion.Vista;
    vista.init(idioma, modelo);
    var acciones, idorganismo, objci;

    Gestionar.analisisplanificacion.Controlador.init(idioma, vista, modelo);
});
Gestionar.analisisplanificacion.Controlador = {
    init: function (idioma, vista, modelo) {

        vista.treePanelinversion.on({
            click: function (n) {
                if (n.id != 'Estructuras') {
                    vista.entidadSeleccionada = n;
                    //vista.Graficas.actualizarParametros(n, 'analisis', 0, 1);
                    vista.Graficas.actualizarParametros(n, 'Analisis-Produccion', 0, 1);
                    vista.Graficas.fnPintar(n);
                    vista.Graficas.limpiarGraficas(true);
                    if (n.leaf)
                        vista.Graficas.chkGlobal.hide();
                    else
                        vista.Graficas.chkGlobal.show();
                }
                else {
                    vista.Graficas.limpiarGraficas(false);
                    vista.Graficas.chkGlobal.hide();
                }
            }
        });
    }
};
