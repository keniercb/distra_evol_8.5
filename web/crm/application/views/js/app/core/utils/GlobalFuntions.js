/**
 * Esta clase provee un grupo de utiles funciones globales.
 *
 * @author  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 */
Ext.define('CRM.core.utils.GlobalFuntions', {
        singleton: true,
        alternateClassName: 'UtilsFn',

        buildUrl: function (params, scope) {
            var realPath, action = (typeof params === 'string') ? params :
                    (Ext.isObject(params) && params.action ? params.action : null),
                controller = Ext.isObject(params) && params.controller ? params.controller : false;

            if (!scope) {
                return controller ?  controller + '/' + action : action;
            }

            var moduleCfg = scope.getModuleCfg();
            realPath = moduleCfg.getBasePath ? moduleCfg.getBasePath() : moduleCfg.get('basePath');

            if (!controller) {
                controller = moduleCfg.getController ? moduleCfg.getController() : moduleCfg.get('controller');
            }

            if (!controller) {
                Ext.Error.raise("No se encontró un controlador válido para este módulo. Configure el atributo " +
                "'controller' en el fichero de configuración del módulo o puede definir una propiedad del mismo nombre " +
                "en el primer parameto de la función");
            }

            if (!Ext.isString(action)) {
                Ext.Error.raise("Error! Formato inválido de la acción (Se requiere un String distinto de 'undefined' " +
                "y se encontró: " + toString.call(action) + ")");
            }

            return '/' + realPath + 'index.php/' + controller + '/' + action;
        },
        /**
         * Funcion generadora de etiquetas a partir de una cadena base y un array de patrones a sustituir
         *
         * @param Sring base. La cadena base a partir de la cual se realiza la sustitucion.
         * @param Array patterns. Arreglo de objetos conlos patrones a buscar y sus correspondientes sustituciones con
         * con genero (Masculino[M] o Femenino[F]) y numero (Singular[S] o Plural[P])
         * Ejemplo:
         *          base = '<article> <#concepto#> <auxverb> sido adicionado satisfactoriamente.',
         *          patterns = [
         *              {
         *                  pattern: '<article>',
         *                  sustitutions: {
         *                      SF: 'La', // Genero: Femenino Numero: Singular
         *                      SM: 'El', // Genero: Masculino Numero: Singular
         *                      PF: 'Las', // Genero: Femenino Numero: Plurar
         *                      PM: 'Los', // Genero: Masculino Numero: Plurar
         *                  }
         *              },
         *              {
         *                  pattern: '<auxverb>',
         *                  sustitutions: {
         *                      SF: 'ha', // Genero: Femenino Numero: Singular
         *                      SM: 'ha', // Genero: Masculino Numero: Singular
         *                      PF: 'han', // Genero: Femenino Numero: Plurar
         *                      PM: 'han', // Genero: Masculino Numero: Plurar
         *                  }
         *              }
         *          ]
         */
        getLabelsTpl: function (base, patterns) {
            if (!patterns) {
                return base;
            }
            return Object.create({
                get: function (concepto) {
                    var toReturn = this.baseFixed ? this.baseFixed : this.base;
                    this.baseFixed = false;
                    if (!concepto) {
                        return toReturn;
                    }

                    return toReturn.replace(/<#concepto#>/g, concepto);
                },
                getSingular: function (genero) {
                    var genero = genero || 'M',
                        genero = genero[0].toUpperCase(),
                        me = this;
                    this.patterns.every(function (item) {
                        var sustituirPor = item.invariante ? item.sustitutions['S'] : item.sustitutions['S' + genero],
                            base = me.base;

                        if (sustituirPor) {
                            if (me.baseFixed) {
                                base = me.baseFixed;
                            }
                            me.baseFixed = base.replace(new RegExp(item.pattern, 'g'), sustituirPor);
                        }
                        return true;
                    });
                    return me;
                },
                getPlural: function (genero) {
                    var genero = genero || 'M',
                        genero = genero[0].toUpperCase(),
                        me = this;

                    this.patterns.every(function (item) {
                        var sustituirPor = item.invariante ? item.sustitutions['P'] : item.sustitutions['P' + genero],
                            base = me.base;

                        if (sustituirPor) {
                            if (me.baseFixed) {
                                base = me.baseFixed;
                            }
                            me.baseFixed = base.replace(new RegExp(item.pattern, 'g'), sustituirPor);
                        }
                        return true;
                    });
                    return me;
                },
                setValue: Ext.Function.flexSetter(function (name, value) {
                    this[name] = value;
                })
            }, {
                base: {
                    value: base
                    //writable: true
                },
                baseFixed: {
                    value: false,
                    writable: true
                },
                patterns: {
                    value: patterns
                },
                autogenerated: {
                    value: true
                }
            });
        }
    }
)