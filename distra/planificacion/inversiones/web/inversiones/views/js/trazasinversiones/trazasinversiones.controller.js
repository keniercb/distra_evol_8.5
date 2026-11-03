Ext.ns('Gestionar.trazasinversiones');

UCID.portal.cargarEtiquetas('trazasinversiones', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Gestionar.trazasinversiones.Modelo;
    modelo.init();


    var vista = Gestionar.trazasinversiones.Vista;
    vista.init(idioma, modelo);
    Gestionar.trazasinversiones.Controlador.init(idioma, vista, modelo);
    paginado = 0;
});

Gestionar.trazasinversiones.Controlador = {
    init: function(idioma, vista, modelo) {
        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: idioma.lbCargando
        });
        modelo.stTrazasInversiones.on({
//            load: function(st, record, ob) {
//                _this.mymask.hide();
//            },
            afterload: function(st, record, ob) {
                _this.mymask.show();
            }
        });

        vista.btnLimpiar.on({
            click : function(){
                modelo.stTrazasInversiones.load();
            }
        });
    }
};