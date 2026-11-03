function formatoMoneda(v) {
    if (v == 'Carga inicial')
        return v;
    if (v == 0)
        return '0.00';
    v = (Math.round((v - 0) * 100)) / 100;
    v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
    v = String(v);
    var ps = v.split(".");
    var whole = ps[0];
    var sub = ps[1] ? "." + ps[1] : ".00";
    var r = /(\d+)(\d{3})/;
    while (r.test(whole)) {
        whole = whole.replace(r, "$1" + "," + "$2");
    }
    v = whole + sub;
    if (v.charAt(0) == "-") {//caso saldo negativo
        return "(" + v.substr(1) + ")";
    }
    return v;
}

UCID.portal.cargarEtiquetas('pagodestajo', function(perfil, idioma){
    perfil = arguments[0];
    idioma = arguments[1];
    //Inicializando modelo
    var modelo = Pvd.Nomina.Pagos.PagoDestajo.Modelo;
    modelo.init(idioma);
 
    //Inicializando la vista.
    var vista = Pvd.Nomina.Pagos.PagoDestajo.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Pagos.PagoDestajo.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

});
