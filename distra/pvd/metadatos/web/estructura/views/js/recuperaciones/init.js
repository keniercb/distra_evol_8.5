/**
 * @Created with PhpStorm.
 * @Author: Ing. Miguel Antonio Cabreja Aldana
 * @package distra
 * @subpackage Wand
 * @Date: 28/08/2015
 * @Version:@package_version@
 */
Ext.ns('Metadatos.Recuperaciones');
Metadatos.Recuperaciones.View = {
    init: function (lang) {

        this.container = new PVD.Persona.ActivarPersona.pActivar({
            region: 'center',
            lang: lang
        });

        new Ext.Viewport({
            layout: 'border',
            items: [this.container]
        });

    }
};


var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
labels = Object();
UCID.portal.cargarEtiquetas('recuperaciones', function (perfil, lang) {
    //Escogiendo la configuración del lang según la versión del MT.

    lang = (lang) ? lang : perfil.etiquetas;

    //Inicializando la view.
    Metadatos.Recuperaciones.View.init(lang);

});