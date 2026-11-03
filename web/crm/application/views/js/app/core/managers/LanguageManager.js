/**
 * Esta clase es un manejador para administrar los lenguajes por modulos.
 *
 * @author  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 */
Ext.define('CRM.core.managers.LanguageManager', {
        extend: 'CRM.core.managers.AbstractManager',
        alternateClassName: 'LangMgr',
        singleton: true,
        requires: ['CRM.core.managers.AbstractManager','CRM.core.common.language.' + (perfil.idioma.toLowerCase() || 'es')],

        /**
         * Funcion que verifica si ya el lenguaje de un modulo ha sido cargado y registrado en el Managerer. En caso
         * de que no haya sido cargado aun entonces este es cargado y registrado en el Manager.
         * @param {String | Ext.app.Controller | Ext.container.Container} search Ambito del lenguaje. Admite los siguientes
         * valores:
         *      1. string: namespace del modulo (se almacena en la propiedad $namespace del modulo).
         *      2. Ext.app.Controller: instancia de un controlador del modulo.
         *      3. Ext.container.Container: instancia de una vista del modulo, siempre y cuando esta en la jerarquia de
         *          clases herede directa o indirectamente de la clase Ext.container.Container.
         *
         * @return Ext.Class Lenguage del modulo.
         * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
         */
        loadLanguage: function (search) {
            var me = this, namespace = search,
                name, lang;

            if (Ext.isObject(search)) {
                namespace = search.$namespace ? search.$namespace :
                    search.$className.split('.')[0];
            }

            //Verificando si existe ya el lenguage en el manager entonces se retorna
            lang = this.get(namespace)
            if(lang){
                return lang;
            }

            name = Ext.app.Controller.getFullName((perfil.idioma.toLowerCase() || 'es'), 'language', namespace);

            if (name) {
                try {
                    lang = Ext.create(name.absoluteName);
                } catch (e) {
                    //si no existe el fichero fisico del lenguaje entonces se retorna false
                    return false;
                }
                /**
                 * Esta es la seccion para aplicarle a cada fichero de lenguage el lenguage definido el fichero
                 * comun del paquete CRM.core.common.language
                 */
                //Ext.require('CRM.core.common.language.' + (perfil.idioma.toLowerCase() || 'es'));

                Ext.define(namespace + ".$lang", Ext.apply({
                        extend: 'CRM.core.common.language.' + (perfil.idioma.toLowerCase() || 'es')
                    }, lang),
                    function () {
                        lang = new this();
                    });
            }

            if (lang) {
                me.register(lang, namespace);
                return lang;
            }
        },

        /**
         * Busca un lenguage para un modulo determinado por el id o name del modulo
         *
         * @param {String | Object} id El id o name del modulo. Tambien biende ser
         * una instancia de un Controller o un View.
         * @return Ext.Class Lenguage del modulo, `undefined` si no se encuentra, or `null` si lo que
         * se encontro es una Clase.
         *
         * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
         */
        getLang: function (id) {
            var me = this;
            /**
             * Si no se define un id (String / Controller / View) entonces se carga solo el lenguage global
             * para el idioma del perfil (este tiene que existir fisicamente)
             */
            if(!id){
                var check = this.get('global_lang'),
                    lang = check || Ext.create('CRM.core.common.language.' + (perfil.idioma.toLowerCase() || 'es'));

                // si no se ha registrado la instancia del lenguage global, entonces se registra una unica vez
                if(!check){
                    this.register(lang, 'global_lang');
                }

                return lang;
            }

            /**
             * Si es un objeto y no es singlenton es porque es cualquier objeto menos el propio LanguageManager
             */
            if(Ext.isObject(id) && !id.singleton){
                id = id.$namespace ? id.$namespace :
                    id.$className.split('.')[0];
            }

            return this.get(id) || this.getLang();
        }
    }
)