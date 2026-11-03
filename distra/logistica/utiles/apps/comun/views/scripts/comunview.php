<?php

/*
 * Ficheros comunes empleados en las IU, versiones por defecto de los frameworks
 * de presentacion
 */
return array(
    'default' => array(
        'estilos' => array(
            array(
                'tipo' => 'file',
                'css'  => '/lib/ExtJS/temas/default/css/ext-all.css'
            ),
        ),
        'idiomas' => array(
            '/logistica/utiles/comun/views/idioma/locale/global.js'
        ),
        'scripts' => array(
            array(
                'tipo' => 'file',
                'js'   => '/lib/UCID/js/imporcss.js',
            ),
            array(
                'tipo' => 'script',
                'js'   => 'importarCSS(window.parent.UCID.portal.perfil.dirCss);',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/lib/ExtJS/idioma/es/js/ext-base.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/lib/ExtJS/idioma/es/js/ext-all.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/lib/UCID/js/ucid-all.js',
            ),
            
            /*array(
                'tipo' => 'file',
                'js' => '/lib/UCID/js/utiles/extensiones.js',
            ),*/
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/util/ui.manager.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/plugins/ui.template.js',
            ),
        ),
    ),
    'log'     => array(
        'estilos'      => array(
            array(
                'tipo' => 'file',
                'css'  => '/logistica/utiles/comun/views/js/extjs/css/ext-all.css',
                'ext'  => true
            ),
            array(
                'tipo' => 'file',
                'css'  => '/logistica/utiles/comun/views/css/comun.css'
            ),
            array(
                'tipo' => 'file',
                'css'  => '/lib/ExtJS/temas/default/css/icon-font.css'
            ),
            array(
                'tipo' => 'file',
                'css' => '/logistica/utiles/comun/views/js/gridfilter/css/gridfilters.css'
            ), 
            array(
                'tipo' => 'file',
                'css' => '/logistica/utiles/comun/views/js/gridfilter/css/rangemenu.css'
            ),
        ),
        'scripts'      => array(
            array(
                'tipo' => 'file',
                'js'   => '/lib/UCID/js/imporcss.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/extjs/ext-base-debug.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/extjs/ext-all-debug.js',
            ),

            array(
                'tipo' => 'file',
                'js'   => '/lib/UCID/js/security/rsa/jsbn.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/lib/UCID/js/security/rsa/rsa.js',
            ),

            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/extjs/ext-lang-es.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/portal/views/js/portal/informacion/infoSistema.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/lib/UCID/js/ucid-all.js',
            ),
            //            array(
            //                'tipo' => 'file',
            //                'js' => '/lib/UCID/js/utiles/extensiones.js',
            //            ),
        ),
        'idiomas'      => array(
            '/logistica/utiles/comun/views/idioma/locale/global.js',
            '/logistica/utiles/comun/views/idioma/locale/meses.js'
        ),
        'util-scripts' => array(
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/plugins/extjs-addons.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/rangemenu.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/listmenu.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/gridfilters.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/filter.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/stringfilter.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/datefilter.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/combofilter.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/listfilter.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/numericfilter.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/gridfilter/js/booleanfilter.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/util/ui.manager.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/util/ui.model.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/util/ui.template.js',
            ),
            array(
                'tipo' => 'file',
                'js'   => '/logistica/utiles/comun/views/js/util/ui.templatetab.js',
            )
        ),
    ),
);
